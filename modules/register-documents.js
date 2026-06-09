// register-documents.js
import k4ltActor from "../documents/actor.js";
import k4ltPCModel from "../models/pc.js";
import k4ltNPCModel from "../models/npc.js";
import k4ltPCSheet from "../sheets/pc-sheet.js";
import k4ltNPCSheet from "../sheets/npc-sheet.js";
import k4ltItem from "../documents/item.js";
import k4ltAbilityModel from "../models/ability.js";
import k4ltAdvantageModel from "../models/advantage.js";
import k4ltArmorModel from "../models/armor.js";
import k4ltDarkSecretModel from "../models/darksecret.js";
import k4ltDisadvantageModel from "../models/disadvantage.js";
import k4ltDramaticHookModel from "../models/dramatichook.js";
import k4ltFamilyModel from "../models/family.js";
import k4ltGearModel from "../models/gear.js";
import k4ltLimitationModel from "../models/limitation.js";
import k4ltMoveModel from "../models/move.js";
import k4ltOccupationModel from "../models/occupation.js";
import k4ltRelationshipModel from "../models/relationship.js";
import k4ltWeaponModel from "../models/weapon.js";
import k4ltAbilitySheet from "../sheets/ability-sheet.js";
import k4ltAdvantageSheet from "../sheets/advantage-sheet.js";
import k4ltArmorSheet from "../sheets/armor-sheet.js";
import k4ltDarkSecretSheet from "../sheets/darksecret-sheet.js";
import k4ltDisadvantageSheet from "../sheets/disadvantage-sheet.js";
import k4ltDramaticHookSheet from "../sheets/dramatichook-sheet.js";
import k4ltFamilySheet from "../sheets/family-sheet.js";
import k4ltGearSheet from "../sheets/gear-sheet.js";
import k4ltLimitationSheet from "../sheets/limitation-sheet.js";
import k4ltMoveSheet from "../sheets/move-sheet.js";
import k4ltOccupationSheet from "../sheets/occupation-sheet.js";
import k4ltRelationshipSheet from "../sheets/relationship-sheet.js";
import k4ltWeaponSheet from "../sheets/weapon-sheet.js";
export function registerk4ltDocuments(systemId) {
  /* -------------------------------------------- */
  /* REGISTRATION                                 */
  /* -------------------------------------------- */
  kultLogger("Registering K4lt documents");
  /* -------------------------------------------- */
  /* ACTORS                                       */
  /* -------------------------------------------- */
  CONFIG.Actor.documentClass = k4ltActor;
  CONFIG.Actor.dataModels = {
    pc: k4ltPCModel,
    npc: k4ltNPCModel,
  };
  /* -------------------------------------------- */
  /* ITEMS                                        */
  /* -------------------------------------------- */
  CONFIG.Item.documentClass = k4ltItem;
  CONFIG.Item.dataModels = {
    ability: k4ltAbilityModel,
    advantage: k4ltAdvantageModel,
    armor: k4ltArmorModel,
    darksecret: k4ltDarkSecretModel,
    disadvantage: k4ltDisadvantageModel,
    dramatichook: k4ltDramaticHookModel,
    family: k4ltFamilyModel,
    gear: k4ltGearModel,
    limitation: k4ltLimitationModel,
    move: k4ltMoveModel,
    occupation: k4ltOccupationModel,
    relationship: k4ltRelationshipModel,
    weapon: k4ltWeaponModel,
  };
  /* -------------------------------------------- */
  /* UNREGISTER CORE SHEETS                       */
  /* -------------------------------------------- */
  foundry.documents.collections.Actors.unregisterSheet(
    "core",
    foundry.appv1.sheets.ActorSheet,
  );
  foundry.documents.collections.Items.unregisterSheet(
    "core",
    foundry.appv1.sheets.ItemSheet,
  );
  /* -------------------------------------------- */
  /* REGISTER ACTOR SHEETS                        */
  /* -------------------------------------------- */
  foundry.documents.collections.Actors.registerSheet(
    systemId,
    k4ltPCSheet,
    {
      types: ["pc"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Actors.registerSheet(
    systemId,
    k4ltNPCSheet,
    {
      types: ["npc"],
      makeDefault: true,
    },
  );
  /* -------------------------------------------- */
  /* REGISTER ITEM SHEETS                         */
  /* -------------------------------------------- */
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltAbilitySheet,
    {
      types: ["ability"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltAdvantageSheet,
    {
      types: ["advantage"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltArmorSheet,
    {
      types: ["armor"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltDarkSecretSheet,
    {
      types: ["darksecret"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltDisadvantageSheet,
    {
      types: ["disadvantage"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltDramaticHookSheet,
    {
      types: ["dramatichook"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltFamilySheet,
    {
      types: ["family"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltGearSheet,
    {
      types: ["gear"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltLimitationSheet,
    {
      types: ["limitation"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltMoveSheet,
    {
      types: ["move"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltOccupationSheet,
    {
      types: ["occupation"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltRelationshipSheet,
    {
      types: ["relationship"],
      makeDefault: true,
    },
  );
  foundry.documents.collections.Items.registerSheet(
    systemId,
    k4ltWeaponSheet,
    {
      types: ["weapon"],
      makeDefault: true,
    },
  );
  /* -------------------------------------------- */
  /* DEBUG                                        */
  /* -------------------------------------------- */
  kultLogger("Registered K4lt sheets:", {
    k4ltPCSheet,
    k4ltNPCSheet,
    k4ltAbilitySheet,
    k4ltAdvantageSheet,
    k4ltArmorSheet,
    k4ltDarkSecretSheet,
    k4ltDisadvantageSheet,
    k4ltDramaticHookSheet,
    k4ltFamilySheet,
    k4ltGearSheet,
    k4ltLimitationSheet,
    k4ltMoveSheet,
    k4ltOccupationSheet,
    k4ltRelationshipSheet,
    k4ltWeaponSheet,
  });
}