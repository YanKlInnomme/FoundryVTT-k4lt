// gear-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltGearSheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "gear"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/gear-sheet.hbs" }
  };
}