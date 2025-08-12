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
  const gameSettingsHeader = html.querySelector("h4.divider");
  if (!gameSettingsHeader) {
    console.error("No header <h4.divider> found in parameters");
    return;
  }

  const currentLang = game.i18n.lang;

  const logoMap = {
    "de": {
      "light": "logo-de.svg",
      "dark": "logo-de-dark.svg"
    },
    "es": {
      "light": "logo-es.svg",
      "dark": "logo-es-dark.svg"
    },
    "fr": {
      "light": "logo-fr.svg",
      "dark": "logo-fr-dark.svg"
    },
    "it": {
      "light": "logo-it.svg",
      "dark": "logo-it-dark.svg"
    },
    "pl": {
      "light": "logo-pl.svg",
      "dark": "logo-pl-dark.svg"
    },
    "pt-BR": {
      "light": "logo-pt-BR.svg",
      "dark": "logo-pt-BR-dark.svg"
    }
  };

  const defaultLogos = {
    "light": "logo.svg",
    "dark": "logo-dark.svg"
  };

  function getCurrentTheme() {
    if (html.classList.contains("theme-dark")) return "dark";
    if (html.classList.contains("theme-light")) return "light";
    return game.settings.get("core", "uiConfig")?.colorScheme?.interface || "light";
  }

  function getLogoPath() {
    const theme = getCurrentTheme();

    let logoFile;
    if (logoMap[currentLang]?.[theme]) {
      logoFile = logoMap[currentLang][theme];
    } else if (logoMap[currentLang]) {
      logoFile = logoMap[currentLang]["light"] || Object.values(logoMap[currentLang])[0];
    } else {
      logoFile = defaultLogos[theme] || defaultLogos["light"];
    }

    return `systems/k4lt/assets/${logoFile}`;
  }

  // Création de la section personnalisée
  const section = document.createElement("section");
  section.classList.add("settings", "flexcol");

  section.innerHTML = `
    <h4 class="divider">${game.i18n.localize("WORLD.FIELDS.system.label")}</h4>
    <div class="k4lt system-badge">
      <img class="dynamic-logo" src="${getLogoPath()}">
    </div>
  `;

  const linkKeys = [
    { icon: "fa-solid fa-cart-shopping", key: "Shop" },
    { icon: "fab fa-github", key: "Git" },
    { icon: "fa-regular fa-mug-hot fa-bounce", key: "Donation" }
  ];

  for (let i = 0; i < linkKeys.length; i++) {
    const link = linkKeys[i];
    const localizedText = game.i18n.localize(`k4lt.Links.${link.key}Title`);
    const localizedURL = game.i18n.localize(`k4lt.Links.${link.key}URL`);
    const linkSection = document.createElement("section");
    linkSection.classList.add("settings", "flexcol");

    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<i class="${link.icon}"></i> ${localizedText} <sup><i class="fa-light fa-up-right-from-square"></i></sup>`;

    if (i === linkKeys.length - 1) {
      button.style.marginBottom = "1rem";
    }

    button.addEventListener("click", ev => {
      ev.preventDefault();
      window.open(localizedURL, "_blank");
    });

    linkSection.appendChild(button);
    section.appendChild(linkSection);
  }

  gameSettingsHeader.parentNode.insertBefore(section, gameSettingsHeader);

  // Observer pour changer le logo selon thème
  const logoImg = section.querySelector(".dynamic-logo");
  const observer = new MutationObserver(() => {
    const newSrc = getLogoPath();
    if (logoImg.getAttribute("src") !== newSrc) {
      logoImg.setAttribute("src", newSrc);
    }
  });
  observer.observe(html, { attributes: true, attributeFilter: ["class"] });
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

function generateTokenImageFilenames(name, ext) {
  const variants = [
    '-token', '_token', 'token', '(token)', '[token]', 
    '%20-%20token', '%20_%20token', '%20token', '%20(token)', '%20[token]',
    '-Token', '_Token', 'Token', '(Token)', '[Token]', 
    '%20-%20Token', '%20_%20Token', '%20Token', '%20(Token)', '%20[Token]'
  ];

  return variants.map(variant => `${name}${variant}.${ext}`);
}

async function fileExists(filePath) {
  const basePath = filePath.split('/').slice(0, -1).join('/');
  try {
    const result = await FilePicker.browse('data', basePath);
    return result.files.includes(filePath);
  } catch (error) {
    return false;
  }
}

async function getTokenImagePath(actorImgPath) {
  const imgParts = actorImgPath.split('/');
  const fileName = imgParts.pop();
  const [name, ext] = fileName.split('.');
  const basePath = imgParts.join('/');

  const possibleFilenames = generateTokenImageFilenames(name, ext);

  const fileChecks = possibleFilenames.map(async (tokenFileName) => {
    const tokenImgPath = `${basePath}/${tokenFileName}`;
    return await fileExists(tokenImgPath) ? tokenImgPath : null;
  });

  const results = await Promise.all(fileChecks);
  const tokenImgPath = results.find(path => path !== null);

  return tokenImgPath || actorImgPath;
}

Hooks.on("createActor", async (actor, options, userId) => {
  try {
    if (options.duplicate) return;

    if (!actor.img || actor.img === "icons/svg/mystery-man.svg") {
      const actorImg = "icons/svg/mystery-man.svg";
      const tokenImg = await getTokenImagePath(actorImg);

      await actor.update({ "img": actorImg });
      await actor.prototypeToken.update({ "texture.src": tokenImg });

      Hooks.once("renderActorSheet", (sheet) => {
        if (sheet.actor.id === actor.id) {
          sheet.render();
        }
      });
    }
  } catch (error) {
    console.error('Error in createActor hook:', error);
  }
});

Hooks.on("updateActor", async (actor, data, options, userId) => {
  try {
    if (data.img) {
      const tokenImg = await getTokenImagePath(data.img);

      await actor.prototypeToken.update({ "texture.src": tokenImg });

      const tokens = actor.getActiveTokens(true);
      for (let token of tokens) {
        await token.document.update({ "texture.src": tokenImg });
      }
    }
  } catch (error) {
    console.error('Error in updateActor hook:', error);
  }
});