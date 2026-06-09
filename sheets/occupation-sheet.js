// occupation-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltOccupationSheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "occupation"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/occupation-sheet.hbs" }
  };
  get archetypeLabel() {
    if (this.archetype === "other") {
      return this.customArchetype || "";
    }
    return this.archetype;
  }
}