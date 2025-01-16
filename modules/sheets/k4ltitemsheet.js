export default class k4ltitemsheet extends ItemSheet {
  get template() {
    return `systems/k4lt/templates/sheets/${this.item.type}-sheet.hbs`;
  }

  async getData() {
    const context = await super.getData();
    context.system = context.item.system;

    const attributeValues = [
      { value: "", label: game.i18n.localize("k4lt.None") },
      { value: "willpower", label: game.i18n.localize("k4lt.Willpower") },
      { value: "fortitude", label: game.i18n.localize("k4lt.Fortitude") },
      { value: "reflexes", label: game.i18n.localize("k4lt.Reflexes") },
      { value: "reason", label: game.i18n.localize("k4lt.Reason") },
      { value: "intuition", label: game.i18n.localize("k4lt.Intuition") },
      { value: "perception", label: game.i18n.localize("k4lt.Perception") },
      { value: "coolness", label: game.i18n.localize("k4lt.Coolness") },
      { value: "violence", label: game.i18n.localize("k4lt.Violence") },
      { value: "charisma", label: game.i18n.localize("k4lt.Charisma") },
      { value: "soul", label: game.i18n.localize("k4lt.Soul") }
    ];
    context.attributeValues = attributeValues;

    const typeValues = [
      { value: "active", label: game.i18n.localize("k4lt.Active") },
      { value: "passive", label: game.i18n.localize("k4lt.Passive") }
    ];
    context.typeValues = typeValues;

    const attributeMoveValues = [
      { value: "none", label: game.i18n.localize("k4lt.None") },
      { value: "willpower", label: game.i18n.localize("k4lt.Willpower") },
      { value: "fortitude", label: game.i18n.localize("k4lt.Fortitude") },
      { value: "reflexes", label: game.i18n.localize("k4lt.Reflexes") },
      { value: "reason", label: game.i18n.localize("k4lt.Reason") },
      { value: "intuition", label: game.i18n.localize("k4lt.Intuition") },
      { value: "perception", label: game.i18n.localize("k4lt.Perception") },
      { value: "coolness", label: game.i18n.localize("k4lt.Coolness") },
      { value: "violence", label: game.i18n.localize("k4lt.Violence") },
      { value: "charisma", label: game.i18n.localize("k4lt.Charisma") },
      { value: "soul", label: game.i18n.localize("k4lt.Soul") },
      { value: "ask", label: game.i18n.localize("k4lt.Ask") }
    ];
    context.attributeMoveValues = attributeMoveValues;

    const specialMoveValues = [
      { value: "0", label: game.i18n.localize("k4lt.None") },
      { value: "1", label: game.i18n.localize("k4lt.KeepItTogether") },
      { value: "2", label: game.i18n.localize("k4lt.SeeThroughTheIllusion") },
      { value: "3", label: game.i18n.localize("k4lt.EndureInjury") }
    ];
    context.specialMoveValues = specialMoveValues;

    return context;
  }
}
