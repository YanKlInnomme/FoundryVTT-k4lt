export const ACTIVE_ATTRIBUTES = ['reason', 'intuition', 'perception', 'coolness', 'violence', 'charisma', 'soul'];
export const ACTIVE_ADVANCEMENT = 'advancementAware11';
export const PASSIVE_ATTRIBUTES = ['willpower', 'fortitude', 'reflexes'];
export const PASSIVE_ADVANCEMENT = 'advancementAware12';
const active = {attributes:ACTIVE_ATTRIBUTES, id:ACTIVE_ADVANCEMENT, max:6, cap:3, title:'One', prompt:'Choose', history:'activeAttributeAdvancements'};
const passive = {attributes:PASSIVE_ATTRIBUTES, id:PASSIVE_ADVANCEMENT, max:2, cap:3, title:'Two', prompt:'ChoosePassive', history:'passiveAttributeAdvancements'};
export const ALL_ATTRIBUTES = [...PASSIVE_ATTRIBUTES, ...ACTIVE_ATTRIBUTES];
const any = {attributes:ALL_ATTRIBUTES, id:'advancementAware13', max:1, cap:4, title:'Three', prompt:'ChooseAny', history:'anyAttributeAdvancements'};
const anyLater = {...any, id:'advancementAware21', max:2, title:'Five', history:'anyLaterAttributeAdvancements'};
const enlightened = [
  {...any,id:'advancementEnlightened11',cap:5,title:'One',history:'enlightenedAnyAttributes',group:'Enlightened'},
  {...active,id:'advancementEnlightened12',cap:4,title:'Two',history:'enlightenedActiveAttributes',group:'Enlightened'},
  {...passive,id:'advancementEnlightened13',cap:4,title:'Three',history:'enlightenedPassiveAttributes',group:'Enlightened'},
  {...anyLater,id:'advancementEnlightened21',cap:5,title:'Five',history:'enlightenedLaterAttributes',group:'Enlightened'},
];
const configurations = [active, passive, any, anyLater, ...enlightened];
export const isAttributeAdvancement = id => configurations.some(config => config.id === id);
export const canIncreaseAttribute = (actor, id) => {
  const config = configurations.find(config => config.id === id);
  return !!config && config.attributes.some(key => Number(actor.system.attributes[key]) < config.cap);
};
export const buyAttributeAdvancement = (actor, id, isEligible) => {
  const config = configurations.find(config => config.id === id);
  if (config) return buyAttribute(actor, isEligible, config);
};
const pending = new Set();
export const canIncreaseActiveAttribute = actor => ACTIVE_ATTRIBUTES.some(key => Number(actor.system.attributes[key]) < 3);
export const canIncreasePassiveAttribute = actor => PASSIVE_ATTRIBUTES.some(key => Number(actor.system.attributes[key]) < 3);
export const buyActiveAttribute = (actor, isAware) => buyAttribute(actor, isAware, active);
export const buyPassiveAttribute = (actor, isAware) => buyAttribute(actor, isAware, passive);

async function buyAttribute(actor, isAware, config) {
  if (!actor.isOwner || pending.has(actor.uuid) || !canIncreaseAttribute(actor, config.id)) return;
  pending.add(actor.uuid);
  try {
    const signed = value => value >= 0 ? `+${value}` : String(value);
    const selected = await foundry.applications.api.DialogV2.wait({
      window: {title: game.i18n.localize(`k4lt.advancement.${config.group??'Aware'}.${config.title}`)},
      classes: ['k4lt-attribute-choice'],
      content: `<p>${config.group ? game.i18n.localize('k4lt.creation.AttributeChoice') + ' +' + config.cap : game.i18n.localize(`k4lt.attributeAdvancement.${config.prompt}`)}</p>`,
      buttons: config.attributes.map(key => {
        const value = Number(actor.system.attributes[key]);
        const label = game.i18n.localize(`k4lt.attributes.${key[0].toUpperCase() + key.slice(1)}`);
        return {action:key,label:`${label} : ${signed(value)}${value < config.cap ? ` → ${signed(value + 1)}` : ''}`,disabled:value >= config.cap};
      }),
      rejectClose: false,
    });
    if (!config.attributes.includes(selected) || !actor.isOwner || !isAware()) return;
    const value = Number(actor.system.attributes[selected]);
    const spent = actor.system[config.id].value ?? 0;
    const points = actor.system.advancementPoints.value ?? 0;
    if (!Number.isFinite(value) || value >= config.cap || spent >= config.max || points < 1) return;
    const history = actor.getFlag('k4lt', config.history) ?? [];
    await actor.update({
      [`system.attributes.${selected}`]: value + 1,
      [`system.${config.id}.value`]: spent + 1,
      'system.advancementPoints.value': points - 1,
      [`flags.k4lt.${config.history}`]: [...history, selected],
    });
  } finally {pending.delete(actor.uuid);}
}

// Reverse only increases made by this automation, never historical manual purchases.
export const refundActiveAttributes = (actor, all = false) => refundAttributes(actor, all, active);
export const refundPassiveAttributes = (actor, all = false) => refundAttributes(actor, all, passive);
export function refundAttributeAdvancement(actor, id) {
  const config = configurations.find(config => config.id === id);
  return config ? refundAttributes(actor, false, config) : {};
}
export function refundAllAttributes(actor) {
  const updates = {};
  for (const config of configurations) {
    for (const [path, value] of Object.entries(refundAttributes(actor, true, config))) {
      if (path.startsWith('system.attributes.')) {
        const original = Number(actor.system.attributes[path.split('.').at(-1)]);
        updates[path] = (updates[path] ?? original) - (original - value);
      } else updates[path] = value;
    }
  }
  return updates;
}
function refundAttributes(actor, all, config) {
  const history = [...(actor.getFlag('k4lt', config.history) ?? [])];
  const removed = all ? history.splice(0) : history.splice(-1);
  const updates = {};
  for (const key of removed) {
    if (!config.attributes.includes(key)) continue;
    const path = `system.attributes.${key}`;
    updates[path] = (updates[path] ?? Number(actor.system.attributes[key])) - 1;
  }
  if (removed.length) updates[`flags.k4lt.${config.history}`] = history;
  return updates;
}
