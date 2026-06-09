// relationship-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltRelationshipSheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "relationship"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/relationship-sheet.hbs" }
  };
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Actor lié
    context.linked = this.document.system.linkedActor;
    // Strength (avec valeur affichée)
    const relationLevels = [
      { key: "Neutral", value: 0 },
      { key: "Meaningful", value: 1 },
      { key: "Vital", value: 2 }
    ];
    context.strengthValues = relationLevels.map(r => ({
      value: r.value,
      label: `${game.i18n.localize(`k4lt.relationship.${r.key}`)} [${r.value}]`
    }));
    return context;
  }
  async _onDrop(event) {
    event.preventDefault();
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    if (!data || data.type !== "Actor") {
      ui.notifications.warn(game.i18n.localize("k4lt.mechanics.InvalidDropType"));
      return;
    }
    const actor = await fromUuid(data.uuid);
    if (!actor) {
      ui.notifications.error(game.i18n.localize("k4lt.mechanics.InvalidUUID"));
      return;
    }
    await this.document.update({
      "system.link": actor.uuid
    });
    ui.notifications.info(
      game.i18n.format("k4lt.mechanics.LinkAddedToActor", { name: actor.name })
    );
  }
  _onClickAction(event, target) {
    if (target.closest(".k4lt-link-remove")) {
      return this._onUnlink(event);
    }
    const card = target.closest(".k4lt-link-card");
    if (card) {
      return this._onOpenLink(card);
    }
    return super._onClickAction(event, target);
  }
  async _onUnlink(event) {
    event.preventDefault();
    await this.document.update({
      "system.link": ""
    });
    ui.notifications.info(
      game.i18n.localize("k4lt.mechanics.LinkRemoved")
    );
  }
  async _onOpenLink(card) {
    const uuid = card.dataset.uuid;
    if (!uuid) return;
    const doc = await fromUuid(uuid);
    if (doc?.sheet) {
      doc.sheet.render(true);
    }
  }
}