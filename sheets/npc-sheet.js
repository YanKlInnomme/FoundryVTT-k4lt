// npc-sheet.js
const { sheets } = foundry.applications;
const { HandlebarsApplicationMixin } = foundry.applications.api;
export default class k4ltNPCSheet extends HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  #scrollPositions = {};
  static DEFAULT_OPTIONS = {
    classes: ["k4lt", "actor", "npc"],
    position: { width: 556, height: 900 },
    form: { submitOnChange: true },
    window: { resizable: true }
  };
  static PARTS = {
    header: { template: "systems/k4lt/templates/actors/npc-sheet-header.hbs" },
    body:   { template: "systems/k4lt/templates/actors/npc-sheet-body.hbs" },
    tabs: { template: "systems/k4lt/templates/actors/npc-sheet-tabs.hbs" },
    description: { template: "systems/k4lt/templates/actors/tabs/npc-description.hbs" },
    abilities:   { template: "systems/k4lt/templates/actors/tabs/npc-abilities.hbs" },
    attacks:     { template: "systems/k4lt/templates/actors/tabs/npc-attacks.hbs" },
    combat:      { template: "systems/k4lt/templates/actors/tabs/npc-combat.hbs" },
    influence:   { template: "systems/k4lt/templates/actors/tabs/npc-influence.hbs" },
    magic:       { template: "systems/k4lt/templates/actors/tabs/npc-magic.hbs" }
  };
  tabGroups = {
    sheet: "description"
  };
  get title() {
    const actor = this.document;
    const name = actor.name ?? "NPC";
    const harm = actor.system.harm ?? {};
    const value = Number(harm.value) || 0;
    const max = Number(harm.max) || 0;
    let state = `${value} / ${max}`;
    if (max > 0) {
      if (value >= max) {
        state = `💀 ${state}`;
      } else if (value >= max * 0.75) {
        state = `⚠️ ${state}`;
      }
    }
    return `${name} — ${state}`;
  }
  #getTabs() {
    const system = this.document.system;
    const tabs = {
      description: { id: "description", group: "sheet", label: "k4lt.ui.Description" },
      abilities: { id: "abilities", group: "sheet", label: "k4lt.ui.Abilities" },
      attacks: { id: "attacks", group: "sheet", label: "k4lt.ui.Attacks" },
      combat: {
        id: "combat",
        group: "sheet",
        label: "k4lt.combat.Combat",
        value: system.level?.combat ?? 0
      },
      influence: {
        id: "influence",
        group: "sheet",
        label: "k4lt.combat.Influence",
        value: system.level?.influence ?? 0
      },
      magic: {
        id: "magic",
        group: "sheet",
        label: "k4lt.combat.Magic",
        value: system.level?.magic ?? 0
      }
    };
    for (const v of Object.values(tabs)) {
      v.active = this.tabGroups[v.group] === v.id;
      v.cssClass = v.active ? "active" : "";
    }
    return tabs;
  }
  /* -------------------------------------------- */
  /*  ACTION HANDLER                              */
  /* -------------------------------------------- */
  _onClickAction(event, target) {
    const action = target.dataset.action;
    if (action === "openImageEditor") return this.#onOpenImageEditor(event);
    if (action === "harmInc") return this._onHarmChange(1, event);
    if (action === "harmDec") return this._onHarmChange(-1, event);
    return super._onClickAction(event, target);
  }
  _updateWindowTitle() {
    if (!this.element) return;
    const titleEl = this.element.querySelector(".window-title");
    if (!titleEl) return;
    titleEl.textContent = this.title;
  }
  async _onHarmChange(delta, event) {
    event.preventDefault();
    this.#saveScrollPosition();
    const actor = this.document;
    const value = Number(actor.system.harm.value) || 0;
    const max = Number(actor.system.harm.max) || 0;
    const newValue =
      Math.clamp(
        value + delta,
        0,
        max
      );
    await actor.update({
      "system.harm.value": newValue,
    });
    this._updateWindowTitle();
  }
  /* -------------------------------------------- */
  /* SCROLL MEMORY                                */
  /* -------------------------------------------- */
  #saveScrollPosition() {
    const container =
      this.element
      ?.querySelector(
        ".tab.active .k4lt-scrollY"
      );
    if(!container){
      return;
    }
    const tab =
      this.tabGroups.sheet
      ?? "default";
    this.#scrollPositions[tab] =
      container.scrollTop;
  }
  #restoreScrollPosition() {
    const container =
      this.element
      ?.querySelector(
        ".tab.active .k4lt-scrollY"
      );
    if(!container){
      return;
    }
    const tab =
      this.tabGroups.sheet
      ?? "default";
    container.scrollTop =
      this.#scrollPositions[tab]
      ?? 0;
  }
  /* -------------------------------------------- */
  /*  EDIT IMAGE                                  */
  /* -------------------------------------------- */
  #onOpenImageEditor(event) {
    event.preventDefault();
    const image = event.target
      .closest(".k4lt-image-block")
      ?.querySelector(".profile-img");
    image?.click();
  }
  /* -------------------------------------------- */
  /*  CONTEXT                                     */
  /* -------------------------------------------- */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.document;
    context.tabs = this.#getTabs();
    // Levels
    const levelValues = [
      { value: 0, label: " - " },
      { value: 1, label: `[1] ${game.i18n.localize('k4lt.rules.LevelAttributes.1')}` },
      { value: 2, label: `[2] ${game.i18n.localize('k4lt.rules.LevelAttributes.2')}` },
      { value: 3, label: `[3] ${game.i18n.localize('k4lt.rules.LevelAttributes.3')}` },
      { value: 4, label: `[4] ${game.i18n.localize('k4lt.rules.LevelAttributes.4')}` },
      { value: 5, label: `[5] ${game.i18n.localize('k4lt.rules.LevelAttributes.5')}` },
      { value: 6, label: `[6] ${game.i18n.localize('k4lt.rules.LevelAttributes.6')}` },
      { value: 7, label: `[7] ${game.i18n.localize('k4lt.rules.LevelAttributes.7')}` },
      { value: 8, label: `[8] ${game.i18n.localize('k4lt.rules.LevelAttributes.8')}` },
      { value: 9, label: `[9] ${game.i18n.localize('k4lt.rules.LevelAttributes.9')}` },
      { value: 10, label: `[10] ${game.i18n.localize('k4lt.rules.LevelAttributes.10')}` }
    ];
    Object.assign(context, {
      actor,
      items: actor.items,
      system: actor.system,
      systemFields: actor.system.constructor.schema.fields,
      fields: actor.constructor.schema.fields,
      source: actor.toObject(),
      levelValues
    });
    return context;
  }
  /* -------------------------------------------- */
  /*  PART CONTEXT                                */
  /* -------------------------------------------- */
  _preparePartContext(partId, context) {
    super._preparePartContext(partId, context);
    if (context.tabs?.[partId]) {
      context.tab = context.tabs[partId];
    }
    return context;
  }
  /* -------------------------------------------- */
  /*  IMAGE HOVER PREVIEW                         */
  /* -------------------------------------------- */
  #activateImageHoverPreview() {
    const blocks =
      this.element.querySelectorAll(".k4lt-image-block");
    for (const block of blocks) {
      block.addEventListener("mouseenter", () => {
        block._hoverTimer = setTimeout(() => {
          block.classList.add("hover-preview");
        }, 1000);
      });
      block.addEventListener("mouseleave", () => {
        clearTimeout(block._hoverTimer);
        block.classList.remove("hover-preview");
      });
    }
  }
  /* -------------------------------------------- */
  /*  MINIMIZE                                    */
  /* -------------------------------------------- */
  async minimize(...args) {
    const result =
      await super.minimize(...args);
    requestAnimationFrame(() => {
      const element = this.element;
      const title =
        element?.querySelector(".window-title");
      if (!element || !title) {
        return;
      }
      const measure =
        document.createElement("span");
      measure.style.position = "absolute";
      measure.style.visibility = "hidden";
      measure.style.whiteSpace = "nowrap";
      measure.style.font =
        getComputedStyle(title).font;
      measure.textContent =
        title.textContent;
      document.body.appendChild(measure);
      const width =
        measure.offsetWidth + 52;
      measure.remove();
      element.style.setProperty(
        "--minimized-width",
        `${width}px`,
      );
    });
    return result;
  }
  /* -------------------------------------------- */
  /* RENDER                                       */
  /* -------------------------------------------- */
  _onRender(context, options) {
    super._onRender(
      context,
      options
    );
    this.#activateImageHoverPreview();
    requestAnimationFrame(() => {
      this.#restoreScrollPosition();
    });
  }
}