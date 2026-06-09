// armor-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltArmorSheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "armor"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/armor-sheet.hbs" }
  };
}