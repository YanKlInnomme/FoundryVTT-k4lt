// dramatichook-sheet.js
import k4ltBaseItemSheet from "./base-item-sheet.js";
export default class k4ltDramaticHookSheet extends k4ltBaseItemSheet {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, "dramatichook"]
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/items/item-header.hbs" },
    body:   { template: "systems/k4lt/templates/items/dramatichook-sheet.hbs" }
  };
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    let linked = null;
    if (this.document.system.link) {
      try {
        linked = await fromUuid(this.document.system.link);
      } catch (e) {
        console.warn(game.i18n.localize("k4lt.mechanics.InvalidUUID"), e);
      }
    }
    context.linked = linked;
    return context;
  }
  async _onDrop(event) {
    event.preventDefault();
    const dropZone = event.target.closest(".k4lt-link-drop");
    if (!dropZone) return;
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    if (!data?.uuid) return;
    const doc = await fromUuid(data.uuid);
    if (!doc) {
      ui.notifications.error(game.i18n.localize("k4lt.mechanics.InvalidUUID"));
      return;
    }
    if (doc.documentName === "Actor") {
      return this._handleActorDrop(doc);
    }
    if (doc.documentName === "Item") {
      return this._handleItemDrop(doc);
    }
    ui.notifications.warn(game.i18n.localize("k4lt.mechanics.InvalidDropType"));
  }
  async _handleActorDrop(actor) {
    await this.document.update({
      "system.link": actor.uuid
    });
    ui.notifications.info(
      game.i18n.format("k4lt.mechanics.LinkAddedToActor", { name: actor.name })
    );
  }
  async _handleItemDrop(item) {
    const allowed = ["darksecret", "gear", "weapon"];
    if (!allowed.includes(item.type)) {
      return ui.notifications.warn(
        game.i18n.localize("k4lt.mechanics.InvalidDropItem")
      );
    }
    await this.document.update({
      "system.link": item.uuid
    });
    ui.notifications.info(
      game.i18n.format("k4lt.mechanics.LinkAddedToItem", { name: item.name })
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