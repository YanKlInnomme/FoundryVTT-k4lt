import k4ltitemsheet from "./modules/sheets/k4ltitemsheet.js";
import k4ltPCsheet from "./modules/sheets/k4ltPCsheet.js";
import k4ltNPCsheet from "./modules/sheets/k4ltNPCsheet.js";
import k4ltActor from "./modules/sheets/k4ltActor.js";
import k4ltTracker from "./modules/tracker.js";
import {registerSystemSettings} from "./modules/system/settings.js";
import {registerLogger} from "./modules/system/logger.js";

async function preloadHandlebarTemplates() {
  const templatepaths =[
    "systems/k4lt/templates/partials/move-card.hbs",
    "systems/k4lt/templates/partials/darksecret-card.hbs",
    "systems/k4lt/templates/partials/relationship-card.hbs",
    "systems/k4lt/templates/partials/weapon-card.hbs",
    "systems/k4lt/templates/partials/gear-card.hbs",
    "systems/k4lt/templates/partials/advantage-card.hbs",
    "systems/k4lt/templates/partials/disadvantage-card.hbs",
    "systems/k4lt/templates/partials/modifier-values.hbs",
    "systems/k4lt/templates/partials/passive-attribute-values.hbs",
    "systems/k4lt/templates/partials/active-attribute-values.hbs"
  ];
  return loadTemplates(templatepaths);
};

Hooks.once("init", function() {
  // Register System Settings
  registerSystemSettings();
  registerLogger();

  kultLogger("Initializing K4lt");
  CONFIG.Actor.documentClass = k4ltActor;
  Items.unregisterSheet("core", ItemSheet);
  Actors.unregisterSheet("core", ActorSheet);
  Items.registerSheet("k4lt", k4ltitemsheet, {makeDefault: true});
  Actors.registerSheet("k4lt", k4ltPCsheet, {types: ["pc"], makeDefault: true});
  Actors.registerSheet("k4lt", k4ltNPCsheet, {types: ["npc"], makeDefault: true});

  preloadHandlebarTemplates();
});

Hooks.once("ready", () => {
  // Listen for dice icon click
  const diceIconSelector = '#chat-controls i.fas.fa-dice-d20';
  $(document).on('click', diceIconSelector, () => {
      console.log(`Dice Icon Works`);
  });
});

Hooks.on('createActor', async (document, createData, options, userId) => {
    if (createData.type === "pc"){
        let pack = await game.packs.get("k4lt.moves");
        let index = await pack.getIndex();
        let moveArray = Array.from(index);
        console.log(moveArray);
        var i;
        for (i=0; i<moveArray.length; i++){
            let finalID = moveArray[0];
            console.log(finalID);
            await createData.createEmbeddedDocuments('Item', [finalItem]);
        }
    }

  });

  Hooks.on('hotbarDrop', async (hotbar, data, slot) => {

    console.log(data.data.data);
    if(data.data.data.type === "passive"){
      ui.notifications.info(game.i18n.localize("k4lt.PassiveAbility"))
      return false;
    }
    let functionName = "";
    const itemID = data.data._id;
    const actorID = data.actorId
    const macroData = {
      name: data.data.name,
      command: `
      let character = game.actors.get("${actorID}");
      character.moveroll("${itemID}")`,
      img: data.data.img
    }
    let macro = await Macro.create({
      name: macroData.name,
      type: 'script',
      img: macroData.img,
      command: macroData.command})
      await game.user.assignHotbarMacro(macro, slot)


    })
