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
  return foundry.applications.handlebars.loadTemplates(templatePaths);
}

function initializeSystem() {
  registerSystemSettings();
  registerLogger();

  kultLogger("Initializing K4lt");
  CONFIG.Actor.documentClass = k4ltActor;
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Items.registerSheet("k4lt", k4ltitemsheet, { makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("k4lt", k4ltPCsheet, { types: ["pc"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("k4lt", k4ltNPCsheet, { types: ["npc"], makeDefault: true });
  // Log the registration of the sheets
  kultLogger("Registered K4lt sheets:", {
    k4ltitemsheet: k4ltitemsheet,
    k4ltPCsheet: k4ltPCsheet,
    k4ltNPCsheet: k4ltNPCsheet,
  });

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
  // On prend le premier <h4 class="divider">
  const gameSettingsHeader = html.querySelector("h4.divider");

  if (!gameSettingsHeader) {
    kultLogger("No header <h4.divider> found in parameters");
    return;
  }

  // Création de la section personnalisée
  const section = document.createElement("section");
  section.classList.add("settings", "flexcol");
  section.innerHTML = `
    <h4 class="divider">${game.i18n.localize("WORLD.FIELDS.system.label")}</h4>
    <div class="k4lt system-badge">
      <img src="systems/k4lt/assets/logo-en.svg">
    </div>
  `;

  // Définition des liens
  const linkKeys = [
    { icon: "fa-solid fa-cart-shopping", key: "KultWebsite" },
    { icon: "fab fa-github", key: "SystemRepo" },
    { icon: "fa-regular fa-mug-hot fa-bounce", key: "BuyCoffee" }
  ];

  for (const link of linkKeys) {
    const localizedText = game.i18n.localize(`k4lt.Links.${link.key}`);
    const localizedURL = game.i18n.localize(`k4lt.Links.${link.key}URL`);

    const linkSection = document.createElement("section");
    linkSection.classList.add("settings", "flexcol");

    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<i class="${link.icon}"></i> ${localizedText} <sup><i class="fa-light fa-up-right-from-square"></i></sup>`;
    button.addEventListener("click", ev => {
      ev.preventDefault();
      window.open(localizedURL, "_blank");
    });

    linkSection.appendChild(button);
    section.appendChild(linkSection);
  }

  // Insère la section avant le premier header
  gameSettingsHeader.parentNode.insertBefore(section, gameSettingsHeader);
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
  const directoryItem = document.querySelector(`.directory-item.actor[data-entry-id="${actorId}"]`);
  const actor = game.actors.get(actorId);

  if (!directoryItem || !actor) {
    kultLogger(`Unable to update actor information: ${actorId}`);
    return;
  }

  const statut = actor.system?.advancement?.statut
    ? game.i18n.localize(`k4lt.${actor.system.advancement.statut}`)
    : game.i18n.localize("k4lt.Sleeper");

  const level = actor.system?.advancementLevel?.value || "0";

  kultLogger(`Update information for: ${actor.name}\nStatut: ${statut}\nLevel: ${level}`);

  // Trouver le lien <a class="entry-name">
  const nameElement = directoryItem.querySelector('.entry-name');
  if (!nameElement) return;

  // Vérifie s'il y a déjà un champ d'info pour éviter les doublons
  let extraInfo = directoryItem.querySelector('.actor-extra-info');
  if (!extraInfo) {
    extraInfo = document.createElement('div');
    extraInfo.classList.add('actor-extra-info');
    extraInfo.style.fontSize = '0.75em';
    extraInfo.style.color = '#888';
    extraInfo.style.marginTop = '2px';
    directoryItem.appendChild(extraInfo); // append après le <a>
  }

  // Met à jour le texte
  extraInfo.textContent = `${statut} (${level})`;
}

function updateActorDirectory(app, html) {
  kultLogger("Additional information for PJs");

  const actorElements = html.querySelectorAll('.directory-item.actor');

  actorElements.forEach((element) => {
    const actorId = element.dataset.entryId;
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


Hooks.on("renderActorDirectory", (app, html, data) => {
  kultLogger("Injecting additional actor info into Actor Directory");

  for (const actor of game.actors) {
    if (actor.hasPlayerOwner) {
      updateActorDisplay(actor.id);
    }
  }
});
