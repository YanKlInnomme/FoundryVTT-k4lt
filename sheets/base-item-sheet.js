// base-item-sheet.js
const { sheets } = foundry.applications;
const { HandlebarsApplicationMixin } = foundry.applications.api;
export default class k4ltBaseItemSheet extends HandlebarsApplicationMixin(sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["k4lt", "item"],
    position: { width: 556, height: 900 },
    form: { submitOnChange: true },
    window: { resizable: true },
    scrollY: [".k4lt-scrollY"],
  };
  #scrollPosition = 0;
  _saveScrollPosition() {
    const container = this.element?.querySelector(".k4lt-scrollY");
    if (!container) return;
    this.#scrollPosition = container.scrollTop;
  }
  _restoreScrollPosition() {
    const container = this.element?.querySelector(".k4lt-scrollY");
    if (!container) return;
    container.scrollTop = this.#scrollPosition;
  }
  async _renderHTML(context, options) {
    this._saveScrollPosition();
    return super._renderHTML(context, options);
  }
  _onRender(context, options) {
    super._onRender(context, options);
    requestAnimationFrame(() => this._restoreScrollPosition());
  }
  get title() {
    const name = this.document.name ?? "Item";
    const type = this.document.type ?? "";
    const typeLabel = game.i18n.has(`TYPES.Item.${type}`)
      ? game.i18n.localize(`TYPES.Item.${type}`)
      : type;
    return `${name} — ${typeLabel}`;
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const baseAttributes = [
      "willpower", "fortitude", "reflexes", "reason", "intuition",
      "perception", "coolness", "violence", "charisma", "soul",
    ];
    const attributeValues = [
      { value: "", label: game.i18n.localize("k4lt.mechanics.None") },
      ...baseAttributes.map((a) => ({
        value: a,
        label: game.i18n.localize(`k4lt.attributes.${a[0].toUpperCase() + a.slice(1)}`),
      })),
    ];
    const typeValues = [
      { value: "active",  label: game.i18n.localize("k4lt.ui.Active") },
      { value: "passive", label: game.i18n.localize("k4lt.ui.Passive") },
    ];
    const attributeMoveValues = [
      ...attributeValues,
      { value: "ask", label: game.i18n.localize("k4lt.mechanics.Ask") },
    ];
    const specialMoveValues = [
      { value: "0", label: game.i18n.localize("k4lt.mechanics.None") },
      { value: "1", label: game.i18n.localize("k4lt.combat.KeepItTogether") },
      { value: "2", label: game.i18n.localize("k4lt.combat.SeeThroughTheIllusion") },
      { value: "3", label: game.i18n.localize("k4lt.combat.EndureInjury") },
    ];
    const archetypeValues = [
      "Academic", "Agent", "Artist", "Avenger", "Broken", "Careerist",
      "Criminal", "Cursed", "Deceiver", "Descendant", "Detective", "Doll",
      "Drifter", "Fixer", "Occultist", "Prophet", "Ronin", "Scientist",
      "Seeker", "Veteran", "Sleeper", "Other",
    ].map((a) => ({
      value: a,
      label: game.i18n.localize(`k4lt.archetypes.${a}`),
    }));
    Object.assign(context, {
      item: this.document,
      system: this.document.system,
      type: this.document.type,
      attributeValues,
      attributeMoveValues,
      typeValues,
      specialMoveValues,
      archetypeValues,
      systemFields: this.document.system.constructor.schema.fields,
    });
    return context;
  }
  _onClickAction(event, target) {
    const action = target.dataset.action;
    if (action === "editImage") return this._onEditImage(event);
    return super._onClickAction(event, target);
  }
  async _onEditImage(event) {
    event.preventDefault();
    const fp = new FilePicker({
      type: "image",
      current: this.document.img,
      callback: (path) => this.document.update({ img: path }),
    });
    return fp.browse();
  }
}