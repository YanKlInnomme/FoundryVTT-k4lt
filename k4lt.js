/**
 * Import modules
 */
import k4ltitemsheet from "./modules/sheets/k4ltitemsheet.js";
import k4ltPCsheet from "./modules/sheets/k4ltPCsheet.js";
import k4ltNPCsheet from "./modules/sheets/k4ltNPCsheet.js";
import k4ltActor from "./modules/sheets/k4ltActor.js";
import Macros from "./modules/system/macros.js";
import { registerSystemSettings } from "./modules/system/settings.js";
import { registerLogger } from "./modules/system/logger.js";
import registerHandlebarsHelpers from "./modules/system/helpers.js";

const templatePaths = [
  "systems/k4lt/templates/partials/ability-card.hbs",
  "systems/k4lt/templates/partials/advantage-card.hbs",
  "systems/k4lt/templates/partials/darksecret-card.hbs",
  "systems/k4lt/templates/partials/disadvantage-card.hbs",
  "systems/k4lt/templates/partials/family-card.hbs",
  "systems/k4lt/templates/partials/gear-card.hbs",
  "systems/k4lt/templates/partials/limitation-card.hbs",
  "systems/k4lt/templates/partials/move-card.hbs",
  "systems/k4lt/templates/partials/occupation-card.hbs",
  "systems/k4lt/templates/partials/relationship-card.hbs",
  "systems/k4lt/templates/partials/weapon-card.hbs",
];

async function preloadHandlebarTemplates() {
  kultLogger("Loading templates:", templatePaths); // Log the template paths
  return loadTemplates(templatePaths);
}

function initializeSystem() {
  registerSystemSettings();
  registerLogger();

  kultLogger("Initializing K4lt");
  CONFIG.Actor.documentClass = k4ltActor;
  Items.unregisterSheet("core", ItemSheet);
  Actors.unregisterSheet("core", ActorSheet);
  Items.registerSheet("k4lt", k4ltitemsheet, { makeDefault: true });
  Actors.registerSheet("k4lt", k4ltPCsheet, { types: ["pc"], makeDefault: true });
  Actors.registerSheet("k4lt", k4ltNPCsheet, { types: ["npc"], makeDefault: true });

  preloadHandlebarTemplates().then(() => {
    registerHandlebarsHelpers();
    kultLogger("K4lt Initialized");
  });
}

async function addBasicMovesToActor(actor) {
  if (actor.type === "pc" && actor.items.size === 0) {
    const pack = game.packs.get("k4lt.moves");
    const index = pack.indexed ? pack.index : await pack.getIndex();
    const moves = index.map(move => pack.getDocument(move._id).then(item => item.toObject()));
    await Promise.all(moves).then(async (objects) => {
      await actor.createEmbeddedDocuments("Item", objects);
    });
  }
}

function createMacroOnHotbarDrop(bar, data, slot) {
  if (data.type === "Item") {
    Macros.createK4ltMacro(data, slot);
    return false;
  }
}

function addK4ltLinksToSettings(app, html) {
  const lotdSection = $("<h2>K4lt Links</h2>");
  html.find("#settings-game").after(lotdSection);
  const lotdDiv = $("<div></div>");
  lotdSection.after(lotdDiv);

  const links = [
    { icon: "fa-solid fa-cart-shopping", text: "Kult: Divinity Lost", url: "https://kultdivinitylost.com/products/" },
    { icon: "fab fa-github", text: "System repository", url: "https://github.com/YanKlInnomme/FoundryVTT-k4lt" },
    { icon: "fa-regular fa-mug-hot fa-bounce", text: "Buy me a coffee", url: "https://www.buymeacoffee.com/yank" }
  ];

  links.forEach(link => {
    const button = $(`<button><i class="${link.icon}"></i> ${link.text} <sup><i class="fa-light fa-up-right-from-square"></i></sup></button>`);
    lotdDiv.append(button);
    button.on("click", (ev) => {
      ev.preventDefault();
      window.open(link.url, "_blank");
    });
  });
}

function openActorImageInPopup(app, html) {
  const imgElement = html.find('.actor-picture');
  imgElement.on('contextmenu', (event) => {
    event.preventDefault();
    const actor = app.actor;
    new ImagePopout(actor.img, {
      title: actor.name,
      shareable: true,
    }).render(true);
  });
}

function handleAdvancementTabChange(app, html) {
  const selectElement = html.find('select[name="system.advancement.statut"]');
  selectElement.on('change', (event) => {
    const selectedValue = event.target.value;
    const sleeperTab = html.find('#sleeper-tab');
    const awareTab = html.find('#aware-tab');
    const enlightenedTab = html.find('#enlightened-tab');

    if (selectedValue === "Sleeper") {
      sleeperTab.removeClass('hidden').addClass('tab-content');
      awareTab.removeClass('tab-content').addClass('hidden');
      enlightenedTab.removeClass('tab-content').addClass('hidden');
    } else if (selectedValue === "Aware") {
      sleeperTab.removeClass('tab-content').addClass('hidden');
      awareTab.removeClass('hidden').addClass('tab-content');
      enlightenedTab.removeClass('tab-content').addClass('hidden');
    } else if (selectedValue === "Enlightened") {
      sleeperTab.removeClass('tab-content').addClass('hidden');
      awareTab.removeClass('tab-content').addClass('hidden');
      enlightenedTab.removeClass('hidden').addClass('tab-content');
    }
  });

  // Initial trigger to set the correct tab visibility based on the current value
  selectElement.trigger('change');
}

function updateActorDisplay(actorId) {
  const directoryItem = document.querySelector(`.directory-item.actor[data-document-id="${actorId}"]`);
  const actor = game.actors.get(actorId);

  if (!directoryItem || !actor) {
    kultLogger(`Unable to update actor information: ${actorId}`);
    return;
  }

  const statut = actor.system?.advancement?.statut
    ? game.i18n.localize(`k4lt.${actor.system.advancement.statut}`)
    : game.i18n.localize("k4lt.Sleeper");

  const level = actor.system?.advancementLevel?.value || "0";

  kultLogger(`Update information for: ${actor.name}\nStatut: ${statut}`);

  let extraInfo = directoryItem.querySelector('.actor-extra-info');
  if (!extraInfo) {
    const nameElement = directoryItem.querySelector('.entity-name') || directoryItem.querySelector('h4');
    if (nameElement) {
      extraInfo = document.createElement('div');
      extraInfo.classList.add('actor-extra-info');
      nameElement.appendChild(extraInfo);
    }
  }

  if (extraInfo) {
    extraInfo.textContent = `${statut} (${level})`;
  }
}

function updateActorDirectory(app, html) {
  kultLogger("Additional information for PJs");
  html.find('.directory-item.actor').each((index, element) => {
    const actorId = element.dataset.documentId;
    const actor = game.actors.get(actorId);

    if (!actor) {
      kultLogger("Actor not found for ", element);
      return;
    }

    if (actor.type === 'pc') {
      updateActorDisplay(actorId);
    }
  });
}

async function checkAdvancements(actor) {
  const advancementStates = [
    actor.system.advancementExp1.state,
    actor.system.advancementExp2.state,
    actor.system.advancementExp3.state,
    actor.system.advancementExp4.state,
    actor.system.advancementExp5.state,
  ];

  const allChecked = advancementStates.every(state => state === "checked");
  const owners = Object.values(actor.ownership).map(id => game.users.get(id)?.name).filter(name => name).join(", ");

  if (allChecked) {
    const chatMessage = {
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: `<img src="systems/k4lt/assets/glass-celebration.webp" style="width: 60px; height: 60px; vertical-align: middle; margin-right: 8px; border: none;"> <br> ${actor.name} (${owners || game.i18n.localize("k4lt.NoOwner")}) ${game.i18n.localize("k4lt.LevelUp")}`
    };
    ChatMessage.create(chatMessage);

    const currentLevel = actor.system.advancementLevel.value || 0;
    await actor.update({ 
      "system.advancementLevel.value": currentLevel + 1,
      "system.advancementExp1.state": "none",
      "system.advancementExp2.state": "none",
      "system.advancementExp3.state": "none",
      "system.advancementExp4.state": "none",
      "system.advancementExp5.state": "none",
    });
  }
}

Hooks.once("init", initializeSystem);
Hooks.on("createActor", addBasicMovesToActor);
Hooks.on("hotbarDrop", createMacroOnHotbarDrop);
Hooks.on("renderSettings", addK4ltLinksToSettings);
Hooks.on('renderActorSheet', (app, html) => {
  openActorImageInPopup(app, html);
  handleAdvancementTabChange(app, html);
});
Hooks.on('renderActorDirectory', updateActorDirectory);
Hooks.on('updateActor', (actor, data, options, userId) => {
  if (actor.type === 'pc') {
    updateActorDisplay(actor.id);
    checkAdvancements(actor);
  }
});
