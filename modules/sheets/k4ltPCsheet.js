export default class k4ltPCsheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "Stats" }],
      width: 950,
      height: 1200,
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
    context.moves = context.items
      .filter(function (item) {
        return item.type == "move";
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));
    context.advantages = context.items.filter(function (item) {
      return item.type == "advantage";
    });
    context.disadvantages = context.items.filter(function (item) {
      return item.type == "disadvantage";
    });
    context.darksecrets = context.items.filter(function (item) {
      return item.type == "darksecret";
    });
    context.relationships = context.items.filter(function (item) {
      return item.type == "relationship";
    });
    context.weapons = context.items.filter(function (item) {
      return item.type == "weapon";
    });
    context.gear = context.items.filter(function (item) {
      return item.type == "gear";
    });
    kultLogger("PCSheet getData => ", context);
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Drag event handler
    const dragHandler = (ev) => this._onDragStart(ev);

    // Helper function to make things draggable
    const makeDraggable = function (index, element) {
      // Add draggable attribute and dragstart listener.
      element.setAttribute("draggable", true);
      element.addEventListener("dragstart", dragHandler, false);
    };
    // Draggable items, including armor
    html.find(".item-draggable").each(makeDraggable);

    html.find(".item-delete").click((ev) => {
      let li = $(ev.currentTarget).parents(".item-name");
      let itemId = li.attr("data-item-id");
      kultLogger("Delete Item => ", { currentTarget: ev.currentTarget, li, itemId });
      this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });

    html.find(".item-edit").click((ev) => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    html.find(".item-show").click((ev) => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      kultLogger("Show Item => ", item);
      var effect;
      if (item.type == "disadvantage" || item.type == "advantage") {
        effect = item.system.effect;
      } else if (item.type == "move") {
        effect = item.system.trigger;
      } else if (item.type == "weapon") {
        effect = item.system.special;
      } else if (item.type == "gear" || item.type == "darksecret") {
        effect = item.system.description;
      }
      const html = "<div class='move-name'>" + item.name + "</div><div>" + effect + "</div>";
      ChatMessage.create({ content: html, speaker: ChatMessage.getSpeaker({ alias: this.name }) });
    });

    html.find(".move-roll").click((ev) => {
      const li = $(ev.currentTarget).parents(".item-name");
      this.actor.moveroll(li.data("itemId"));
    });

    html.find(".stability-minus").click((ev) => {
      let stability_current = Number(this.actor.system.stability.value);
      if (stability_current < 9) {
        let stability_new = stability_current + 1;
        this.actor.update({ "system.stability.value": stability_new });
        ChatMessage.create({ content: `${this.actor.name} ${game.i18n.localize("k4lt.LostStability")}`, speaker: ChatMessage.getSpeaker({ alias: this.name }) });
      } else {
        ui.notifications.warn(game.i18n.localize("k4lt.PCIsBroken"));
      }
    });

    html.find(".stability-plus").click((ev) => {
      let stability_current = Number(this.actor.system.stability.value);
      if (stability_current > 0) {
        let stability_new = stability_current - 1;
        this.actor.update({ "system.stability.value": stability_new });
        ChatMessage.create({ content: `${this.actor.name} ${game.i18n.localize("k4lt.HealedStability")}`, speaker: ChatMessage.getSpeaker({ alias: this.name }) });
      } else {
        ui.notifications.warn(game.i18n.localize("k4lt.PCIsComposed"));
      }
    });

    html.find(".token-add").click((ev) => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.get(li.data("itemId"));
      let newtokens = Number(item.system.tokens) + 1;
      item.update({ "system.tokens": newtokens });
    });

    html.find(".token-spend").click((ev) => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.get(li.data("itemId"));
      let newtokens = Number(item.system.tokens) - 1;
      item.update({ "system.tokens": newtokens });
    });

    html.find('#majorwound1').click(this._onUpdateWound.bind(this));
    html.find('#majorwound2').click(this._onUpdateWound.bind(this));
    html.find('#majorwound3').click(this._onUpdateWound.bind(this));
    html.find('#majorwound4').click(this._onUpdateWound.bind(this));
    html.find('#criticalwound').click(this._onUpdateWound.bind(this));

  }

  /**
   * @description l'id de l'image est utilisée pour récupérer l'information de l'acteur et le mettre à jour.
   * @param {*} ev 
   */
  _onUpdateWound(ev) {
    ev.preventDefault();
    const id = $(ev.currentTarget)[0].id; 

    const wound = eval(`this.actor.system.${id}`);
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
    this.actor.update({[key]: {value : wound.value, state: newState}});
  }
}
