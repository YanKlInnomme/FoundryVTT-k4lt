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

async function preloadHandlebarTemplates() {
  const templatePaths = [
    "systems/k4lt/templates/partials/abilitity-card.hbs",
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
  kultLogger("Loading templates:", templatePaths); // Log the template paths
  return loadTemplates(templatePaths);
}

/**
 * Initialize the system
 */
Hooks.once("init", function () {
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
    // Register Handlebars Helpers
    registerHandlebarsHelpers();

    kultLogger("K4lt Initialized");
  });
});

/**
 * Add the basic moves from the compendium to a new actor of type pc
 */
Hooks.on("createActor", async (actor) => {
  if (actor.type === "pc"  && actor.items.size === 0) {
    const pack = game.packs.get("k4lt.moves");
    const index = pack.indexed ? pack.index : await pack.getIndex();
    const moves = index.map(move => pack.getDocument(move._id).then(item => item.toObject()));
    await Promise.all(moves).then(async (objects) => {
      await actor.createEmbeddedDocuments("Item", objects);
    });
  }
});

/**
 * Create a macro when dropping an item on the hotbar
 */
Hooks.on("hotbarDrop", (bar, data, slot) => {
  if (data.type === "Item") {
    Macros.createK4ltMacro(data, slot);
    return false;
  }
});

/**
 * Add K4lt links to the settings
 */
Hooks.on("renderSettings", (app, html) => {
  let lotdSection = $("<h2>K4lt Links</h2>");
  html.find("#settings-game").after(lotdSection);
  let lotdDiv = $(`<div></div>`);
  lotdSection.after(lotdDiv);
  let helpButton = $(
    `<button><i class="fa-solid fa-cart-shopping"></i> Kult: Divinity Lost <sup><i class="fa-light fa-up-right-from-square"></i></sup></button></button>`
  );
  lotdDiv.append(helpButton);
  helpButton.on("click", (ev) => {
    ev.preventDefault();
    window.open("https://kultdivinitylost.com/products/", "_blank");
  });

  let dicordButton = $(
    `<button><i class="fab fa-github"></i> System repository <sup><i class="fa-light fa-up-right-from-square"></i></sup></button></button>`
  );
  lotdDiv.append(dicordButton);
  dicordButton.on("click", (ev) => {
    ev.preventDefault();
    window.open("https://github.com/YanKlInnomme/FoundryVTT-k4lt", "_blank");
  });

  let patreonButton = $(
    `<button><i class="fa-regular fa-mug-hot fa-bounce"></i> Buy me a coffee <sup><i class="fa-light fa-up-right-from-square"></i></sup></button>`
  );
  lotdDiv.append(patreonButton);
  patreonButton.on("click", (ev) => {
    ev.preventDefault();
    window.open("https://www.buymeacoffee.com/yank", "_blank");
  });
});

Hooks.on('renderActorSheet', (app, html, data) => {
  // Sélectionner l'image de la fiche
  const imgElement = html.find('.actor-picture');

  // Ajouter un événement de clic droit
  imgElement.on('contextmenu', (event) => {
    event.preventDefault(); // Empêche le menu contextuel par défaut
    
    // Récupérer l'objet acteur de la fiche
    const actor = app.actor;

    // Ouvre l'image dans une fenêtre pop-up
    new ImagePopout(actor.img, {
      title: actor.name,   // Titre de la fenêtre
      shareable: true,     // Partage possible avec les joueurs
    }).render(true);
  });
});


//* Modifier l'éditeur TinyMCE utilisé par défaut dans les zones de texte dans Foundry VTT pour utiliser EasyMDE configuré comme Notion




