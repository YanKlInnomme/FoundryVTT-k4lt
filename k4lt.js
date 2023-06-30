import k4ltitemsheet from "./modules/sheets/k4ltitemsheet.js";
import k4ltPCsheet from "./modules/sheets/k4ltPCsheet.js";
import k4ltNPCsheet from "./modules/sheets/k4ltNPCsheet.js";
import k4ltActor from "./modules/sheets/k4ltActor.js";
import Macros from "./modules/system/macros.js";
import { registerSystemSettings } from "./modules/system/settings.js";
import { registerLogger } from "./modules/system/logger.js";
import registerHandlebarsHelpers from "./modules/system/helpers.js";

async function preloadHandlebarTemplates() {
  const templatepaths = [
    "systems/k4lt/templates/partials/move-card.hbs",
    "systems/k4lt/templates/partials/darksecret-card.hbs",
    "systems/k4lt/templates/partials/relationship-card.hbs",
    "systems/k4lt/templates/partials/weapon-card.hbs",
    "systems/k4lt/templates/partials/gear-card.hbs",
    "systems/k4lt/templates/partials/advantage-card.hbs",
    "systems/k4lt/templates/partials/disadvantage-card.hbs",
    "systems/k4lt/templates/partials/modifier-values.hbs",
    "systems/k4lt/templates/partials/passive-attribute-values.hbs",
    "systems/k4lt/templates/partials/active-attribute-values.hbs",
  ];
  return loadTemplates(templatepaths);
}

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
