import k4ltitemsheet from "./modules/sheets/k4ltitemsheet.js";
import k4ltPCsheet from "./modules/sheets/k4ltPCsheet.js";
import k4ltNPCsheet from "./modules/sheets/k4ltNPCsheet.js";
import k4ltActor from "./modules/sheets/k4ltActor.js";
import k4ltTracker from "./modules/tracker.js";
import { registerSystemSettings } from "./modules/system/settings.js";
import { registerLogger } from "./modules/system/logger.js";

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
  // Register System Settings
  registerSystemSettings();
  registerLogger();

  kultLogger("Initializing K4lt");
  CONFIG.Actor.documentClass = k4ltActor;
  Items.unregisterSheet("core", ItemSheet);
  Actors.unregisterSheet("core", ActorSheet);
  Items.registerSheet("k4lt", k4ltitemsheet, { makeDefault: true });
  Actors.registerSheet("k4lt", k4ltPCsheet, { types: ["pc"], makeDefault: true });
  Actors.registerSheet("k4lt", k4ltNPCsheet, { types: ["npc"], makeDefault: true });

  preloadHandlebarTemplates();

  Handlebars.registerHelper("getWoundsImage", function (state) {
    switch (state) {
      case "none":
        return "systems/k4lt/assets/blank.webp";
      case "unstabilized":
        return "systems/k4lt/assets/bleeding-wound.webp";
      case "stabilized":
        return "systems/k4lt/assets/sticking-plaster.webp";
    }
  });
});

Hooks.on("createActor", async (actor) => {
  if (actor.type === "pc") {
    let pack = game.packs.get("k4lt.moves");
    let index = pack.indexed ? pack.index : await pack.getIndex();
    let moves = [];
    for (const move of index) {
      let item = await pack.getDocument(move._id);
      moves.push(item.toObject());
    }
    console.log("moves", moves);
    await actor.createEmbeddedDocuments("Item", moves);
  }
});

//TODO V10
Hooks.on("hotbarDrop", async (hotbar, data, slot) => {
  kultLogger(data.system);
  if (data.system.type === "passive") {
    ui.notifications.info(game.i18n.localize("k4lt.PassiveAbility"));
    return false;
  }
  let functionName = "";
  const itemID = data.data._id;
  const actorID = data.actorId;
  const macroData = {
    name: data.data.name,
    command: `
      let character = game.actors.get("${actorID}");
      character.moveroll("${itemID}")`,
    img: data.data.img,
  };
  let macro = await Macro.create({
    name: macroData.name,
    type: "script",
    img: macroData.img,
    command: macroData.command,
  });
  await game.user.assignHotbarMacro(macro, slot);
});
