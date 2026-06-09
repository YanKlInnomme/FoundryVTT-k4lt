// weapon-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltWeaponSheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "weapon"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/weapon-sheet.hbs" }
  };
  /* ----------------------------------------- */
  /*  CONTEXT                                  */
  /* ----------------------------------------- */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Distance (multi-values KULT, i18n)
    const distanceLevels = [
      { key: "Arm", value: "arm" },
      { key: "Room", value: "room" },
      { key: "Field", value: "field" },
      { key: "Horizon", value: "horizon" }
    ];
    context.distanceValues = distanceLevels.map(d => ({
      value: d.value,
      label: game.i18n.localize(`k4lt.distance.${d.key}`)
    }));
    return context;
  }
  _onClickAction(event, target) {
    const action = target.dataset.action;
    if (action === "addAttack") {
        return this._addAttack();
    }
    if (action === "removeAttack") {
        return this._removeAttack(target.dataset.index);
    }
    return super._onClickAction(event, target);
    }
  async _addAttack() {
    const attacks = foundry.utils.deepClone(this.document.system.attacks ?? []);
    attacks.push({
      name: "",
      harm: 0,
      ammoCost: 0
    });
    await this.document.update({
      "system.attacks": attacks
    });
  }
  async _removeAttack(index) {
    const attacks = foundry.utils.deepClone(this.document.system.attacks ?? []);
    attacks.splice(index, 1);
    await this.document.update({
      "system.attacks": attacks
    });
  }
}