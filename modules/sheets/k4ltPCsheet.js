export default class k4ltPCsheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
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
    context.abilitities = context.items.filter(item => item.type === "abilitity").sort((a, b) => a.name.localeCompare(b.name));
    context.advantages = context.items.filter(item => item.type === "advantage").sort((a, b) => a.name.localeCompare(b.name));
    context.darksecrets = context.items.filter(item => item.type === "darksecret").sort((a, b) => a.name.localeCompare(b.name));
    context.disadvantages = context.items.filter(item => item.type === "disadvantage").sort((a, b) => a.name.localeCompare(b.name));
    context.families = context.items.filter(item => item.type === "family").sort((a, b) => a.name.localeCompare(b.name));
    context.gear = context.items.filter(item => item.type === "gear").sort((a, b) => a.name.localeCompare(b.name));
    context.limitations = context.items.filter(item => item.type === "limitation").sort((a, b) => a.name.localeCompare(b.name));
    context.moves = context.items.filter(item => item.type === "move").sort((a, b) => a.name.localeCompare(b.name));
    context.occupations = context.items.filter(item => item.type === "occupation").sort((a, b) => a.name.localeCompare(b.name));
    context.relationships = context.items.filter(item => item.type === "relationship").sort((a, b) => a.name.localeCompare(b.name));
    context.weapons = context.items.filter(item => item.type === "weapon").sort((a, b) => a.name.localeCompare(b.name));

    const modifierValues = [
      { value: "5", label: "\u00A0+5\u00A0" },
      { value: "4", label: "\u00A0+4\u00A0" },
      { value: "3", label: "\u00A0+3\u00A0" },
      { value: "2", label: "\u00A0+2\u00A0" },
      { value: "1", label: "\u00A0+1\u00A0" },
      { value: "0", label: "\u00A00\u00A0" },
      { value: "-1", label: "\u00A0-1\u00A0" },
      { value: "-2", label: "\u00A0-2\u00A0" },
      { value: "-3", label: "\u00A0-3\u00A0" },
      { value: "-4", label: "\u00A0-4\u00A0" },
      { value: "-5", label: "\u00A0-5\u00A0" }
    ];
    context.modifierValues = modifierValues;

    const passiveAttributeValues = [
      { value: "5", label: "\u00A0+5\u00A0" },
      { value: "4", label: "\u00A0+4\u00A0" },
      { value: "3", label: "\u00A0+3\u00A0" },
      { value: "2", label: "\u00A0+2\u00A0" },
      { value: "1", label: "\u00A0+1\u00A0" },
      { value: "0", label: "\u00A00\u00A0" },
      { value: "-1", label: "\u00A0-1\u00A0" },
      { value: "-2", label: "\u00A0-2\u00A0" },
    ];
    context.passiveAttributeValues = passiveAttributeValues;

    const activeAttributeValues = [
      { value: "5", label: "\u00A0+5\u00A0" },
      { value: "4", label: "\u00A0+4\u00A0" },
      { value: "3", label: "\u00A0+3\u00A0" },
      { value: "2", label: "\u00A0+2\u00A0" },
      { value: "1", label: "\u00A0+1\u00A0" },
      { value: "0", label: "\u00A00\u00A0" },
      { value: "-1", label: "\u00A0-1\u00A0" },
      { value: "-2", label: "\u00A0-2\u00A0" },
      { value: "-3", label: "\u00A0-3\u00A0" },
      { value: "-4", label: "\u00A0-4\u00A0" }
    ];
    context.activeAttributeValues = activeAttributeValues;

    const stabilityValues = [
      { value: "0", label: game.i18n.localize("k4lt.StabilityComposed") },
      { value: "1", label: game.i18n.localize("k4lt.StabilityUneasy") },
      { value: "2", label: game.i18n.localize("k4lt.StabilityUnfocused") },
      { value: "3", label: game.i18n.localize("k4lt.StabilityShaken") },
      { value: "4", label: game.i18n.localize("k4lt.StabilityDistressed") },
      { value: "5", label: game.i18n.localize("k4lt.StabilityNeurotic") },
      { value: "6", label: game.i18n.localize("k4lt.StabilityAnxious") },
      { value: "7", label: game.i18n.localize("k4lt.StabilityIrrational") },
      { value: "8", label: game.i18n.localize("k4lt.StabilityUnhinged") },
      { value: "9", label: game.i18n.localize("k4lt.StabilityBroken") },
    ];
    context.stabilityValues = stabilityValues;
          
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
      if (item.type === "disadvantage" || item.type === "advantage" || item.type === "abilitity" || item.type === "limitation") {
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

