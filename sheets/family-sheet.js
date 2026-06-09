// family-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltFamilySheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "family"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/family-sheet.hbs" }
  };
}