export const XP_IDS = [1, 2, 3, 4, 5].map(n => `advancementExp${n}`);
const queues = new Map();
const t = key => game.i18n.localize(`k4lt.xpApproval.${key}`);
const full = actor => XP_IDS.every(id => actor.system[id]?.value > 0);

export async function toggleExperience(actor, id) {
  if (actor.type !== 'pc' || !actor.isOwner || !XP_IDS.includes(id)) return;
  const updates = { [`system.${id}.value`]: actor.system[id]?.value > 0 ? 0 : 1 };
  const completes = XP_IDS.every(key => (key === id ? updates[`system.${id}.value`] : actor.system[key]?.value) > 0);
  const requestId = completes ? foundry.utils.randomID() : null;
  updates['flags.k4lt.xpApproval'] = requestId;
  await actor.update(updates);
  if (!completes) return;
  const recipients = game.users.filter(user => user.isGM).map(user => user.id);
  if (!recipients.length) {
    ui.notifications.warn(t('NoGM'));
    return;
  }
  try {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      whisper: recipients,
      content: `<p>${foundry.utils.escapeHTML(actor.name)} — ${t('Request')}</p>`,
      flags: { k4lt: { xpRequest: { actorUuid: actor.uuid, requestId, status: 'pending' } } },
    });
    ui.notifications.info(t('Sent'));
  } catch (error) {
    ui.notifications.error(t('SendFailed'));
    throw error;
  }
}

async function resolveRequest(message, decision) {
  const request = message.getFlag('k4lt', 'xpRequest');
  if (!request || request.status !== 'pending') return;
  const actor = await fromUuid(request.actorUuid);
  if (!actor || actor.getFlag('k4lt', 'xpApproval') !== request.requestId || !full(actor)) {
    await message.update({ 'flags.k4lt.xpRequest.status': 'stale' });
    return;
  }
  if (decision === 'approve') {
    const updates = {
      'system.advancementPoints.value': (actor.system.advancementPoints.value ?? 0) + 1,
      'flags.k4lt.xpApproval': null,
    };
    for (const id of XP_IDS) updates[`system.${id}.value`] = 0;
    await actor.update(updates);
  } else {
    // Return to four XP and invalidate the request in the same update.
    await actor.update({
      'system.advancementExp5.value': 0,
      'flags.k4lt.xpApproval': null,
    });
  }
  await message.update({ 'flags.k4lt.xpRequest.status': decision === 'approve' ? 'approved' : 'rejected' });
}

Hooks.on('renderChatMessageHTML', (message, html) => {
  const request = message.getFlag('k4lt', 'xpRequest');
  if (!request || !game.user.isGM) return;
  const container = html.querySelector('.message-content');
  if (!container || container.querySelector('[data-xp-approval]')) return;
  const controls = document.createElement('div');
  controls.dataset.xpApproval = '';
  container.append(controls);
  if (request.status !== 'pending') {
    controls.textContent = t(request.status);
    return;
  }
  for (const decision of ['approve', 'reject']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = t(decision);
    controls.append(button);
    button.addEventListener('click', async () => {
      if (!game.user.isGM) return;
      controls.querySelectorAll('button').forEach(element => element.disabled = true);
      try {
        // updateChatMessage supplies the authenticated author of this decision.
        await message.update({ 'flags.k4lt.xpDecision': { decision, nonce: foundry.utils.randomID() } });
      } catch (error) {
        controls.querySelectorAll('button').forEach(element => element.disabled = false);
        ui.notifications.error(t('Failed'));
        console.error(error);
      }
    });
  }
});

Hooks.on('updateChatMessage', (message, changes, options, userId) => {
  if (!game.user.isGM || game.users.activeGM?.id !== game.user.id || !game.users.get(userId)?.isGM) return;
  const decision = foundry.utils.getProperty(changes, 'flags.k4lt.xpDecision') ?? changes['flags.k4lt.xpDecision'];
  const request = message.getFlag('k4lt', 'xpRequest');
  if (!request || !['approve', 'reject'].includes(decision?.decision)) return;
  const key = request.actorUuid;
  const previous = queues.get(key) ?? Promise.resolve();
  const current = previous.then(() => resolveRequest(message, decision.decision)).catch(error => {
    ui.notifications.error(t('Failed'));
    console.error('K4LT | Experience approval failed', error);
  }).finally(() => { if (queues.get(key) === current) queues.delete(key); });
  queues.set(key, current);
  return current;
});
