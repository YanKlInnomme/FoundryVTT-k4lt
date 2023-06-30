export default class k4ltPCsheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "Stats" }],
      width: 800,
      height: 1294,
      dragDrop: [ { dragSelector: '.item-list .item-draggable', dropSelector: null }]
    });
  }

  /** @override */
  get template() {
    return `systems/k4lt/templates/sheets/pc-sheet.hbs`;
  }

  /** @override */
  getData() {
    const context = super.getData();
    context.system = context.actor.system;
    context.moves = context.items.filter(item => item.type === "move").sort((a, b) => a.name.localeCompare(b.name));
    context.advantages = context.items.filter(item => item.type === "advantage");
    context.disadvantages = context.items.filter(item => item.type === "disadvantage");
    context.darksecrets = context.items.filter(item => item.type === "darksecret");
    context.relationships = context.items.filter(item => item.type === "relationship");
    context.weapons = context.items.filter(item => item.type === "weapon");
    context.gear = context.items.filter(item => item.type === "gear");
    kultLogger("PCSheet getData => ", context);
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".item-delete").click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const itemId = li.attr("data-item-id");
      kultLogger("Delete Item => ", { currentTarget: ev.currentTarget, li, itemId });
      this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });

    html.find(".item-edit").click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    html.find(".item-show").click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      kultLogger("Show Item => ", item);
      let effect;
      if (item.type === "disadvantage" || item.type === "advantage") {
        effect = item.system.effect;
      } else if (item.type === "move") {
        effect = item.system.trigger;
      } else if (item.type === "weapon") {
        effect = item.system.special;
      } else if (item.type === "gear" || item.type === "darksecret") {
        effect = item.system.description;
      }
      const content = `<div class='move-name'>${item.name}</div><div>${effect}</div>`;
      ChatMessage.create({ content, speaker: ChatMessage.getSpeaker({ alias: this.name }) });
    });

    html.find(".move-roll").click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      this.actor.moveroll(li.data("itemId"));
    });

    html.find(".stability-minus").click(ev => {
      const stability_current = Number(this.actor.system.stability.value);
      if (stability_current < 9) {
        const stability_new = stability_current + 1;
        this.actor.update({ "system.stability.value": stability_new });
        ChatMessage.create({ content: `${this.actor.name} ${game.i18n.localize("k4lt.LostStability")}`, speaker: ChatMessage.getSpeaker({ alias: this.name }) });
      } else {
        ui.notifications.warn(game.i18n.localize("k4lt.PCIsBroken"));
      }
    });

    html.find(".stability-plus").click(ev => {
      const stability_current = Number(this.actor.system.stability.value);
      if (stability_current > 0) {
        const stability_new = stability_current - 1;
        this.actor.update({ "system.stability.value": stability_new });
        ChatMessage.create({ content: `${this.actor.name} ${game.i18n.localize("k4lt.HealedStability")}`, speaker: ChatMessage.getSpeaker({ alias: this.name }) });
      } else {
        ui.notifications.warn(game.i18n.localize("k4lt.PCIsComposed"));
      }
    });

    html.find(".token-add").click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      const newtokens = Number(item.system.tokens) + 1;
      item.update({ "system.tokens": newtokens });
    });

    html.find(".token-spend").click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      const newtokens = Number(item.system.tokens) - 1;
      item.update({ "system.tokens": newtokens });
    });

    html.find('#majorwound1, #majorwound2, #majorwound3, #majorwound4, #criticalwound').click(this._onUpdateWound.bind(this));

    $('.reasonpic').hover(
      () => $('.attmid').css('background-image', 'url(systems/k4lt/assets/attributes/middle-left.webp)'),
      () => $('.attmid').css('background-image', 'url(systems/k4lt/assets/attributes/middle.webp)')
    );

    $('.intupic').hover(
      () => $('.attmid').css('background-image', 'url(systems/k4lt/assets/attributes/middle-right.webp)'),
      () => $('.attmid').css('background-image', 'url(systems/k4lt/assets/attributes/middle.webp)')
    );

    $('.percpic').hover(
      () => $('.attmid').css('background-image', 'url(systems/k4lt/assets/attributes/middle-bottom.webp)'),
      () => $('.attmid').css('background-image', 'url(systems/k4lt/assets/attributes/middle.webp)')
    );
  }

  _onUpdateWound(ev) {
    ev.preventDefault();
    const id = ev.currentTarget.id;
    const wound = this.actor.system[id];
    let newState;
    switch (wound.state) {
      case "none":
        newState = "unstabilized";
        break;
      case "unstabilized":
        newState = "stabilized";
        break;
      case "stabilized":
        newState = "none";
        break;
    }
    const key = `system.${id}`;
    this.actor.update({ [key]: { value: wound.value, state: newState } });
  }
}
