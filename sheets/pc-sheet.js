// pc-sheet.js
const { sheets } = foundry.applications;
const { HandlebarsApplicationMixin } = foundry.applications.api;
import k4ltItemViewer from "../applications/item-viewer.js";
export default class k4ltPCSheet extends HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  #viewConsciousness = null;
  #scrollPositions = {};
  static DEFAULT_OPTIONS = {
    classes: ["k4lt", "actor", "pc"],
    position: { width: 1432, height: 885 },
    form: { submitOnChange: true },
    window: { resizable: true },
    scrollY: [".k4lt-scrollY"],
    dragDrop: [{ dragSelector: ".k4lt-drop-item", dropSelector: "[data-drop-zone]" }],
  };
  static PARTS = {
    header:      { template: "systems/k4lt/templates/actors/pc-sheet-header.hbs" },
    body:        { template: "systems/k4lt/templates/actors/pc-sheet-body.hbs" },
    tabs:        { template: "systems/k4lt/templates/actors/pc-sheet-tabs.hbs" },
    identity:    { template: "systems/k4lt/templates/actors/tabs/pc-identity.hbs" },
    status:      { template: "systems/k4lt/templates/actors/tabs/pc-status.hbs" },
    background:  { template: "systems/k4lt/templates/actors/tabs/pc-background.hbs" },
    inventory:   { template: "systems/k4lt/templates/actors/tabs/pc-inventory.hbs" },
    advancement: { template: "systems/k4lt/templates/actors/tabs/pc-advancement.hbs" },
    notes:       { template: "systems/k4lt/templates/actors/tabs/pc-notes.hbs" },
  };
  tabGroups = { sheet: "identity" };
  /* -------------------------------------------- */
  /*  TITLE                                        */
  /* -------------------------------------------- */
  get title() {
    const actorName =
      this.document.name ?? "PC";
    const player =
      game.users.find(
        u =>
          !u.isGM &&
          this.document.testUserPermission(
            u,
            CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
          )
      );
    const ownerName =
      player?.name ??
      game.i18n.localize("k4lt.meta.NoOwner");
    return `${actorName} (${ownerName})`;
  }
  /* -------------------------------------------- */
  /*  TABS                                         */
  /* -------------------------------------------- */
  #getTabs() {
    const tabs = {
      identity:    { id: "identity",    group: "sheet", label: "k4lt.ui.Identity" },
      status:      { id: "status",      group: "sheet", label: "k4lt.ui.Status" },
      inventory:   { id: "inventory",   group: "sheet", label: "k4lt.ui.Inventory" },
      background:  { id: "background",  group: "sheet", label: "k4lt.ui.Background" },
      advancement: { id: "advancement", group: "sheet", label: "k4lt.ui.Advancement" },
      notes:       { id: "notes",       group: "sheet", label: "k4lt.ui.Notes" },
    };
    for (const v of Object.values(tabs)) {
      v.active   = this.tabGroups[v.group] === v.id;
      v.cssClass = v.active ? "active" : "";
    }
    return tabs;
  }
  /* -------------------------------------------- */
  /*  DROPZONE FX                                  */
  /* -------------------------------------------- */
  #activateDropZones() {
    const zones = this.element.querySelectorAll("[data-drop-zone]");
    for (const zone of zones) {
      zone.addEventListener("dragenter", () => zone.classList.add("dragover"));
      zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
      zone.addEventListener("drop",      () => zone.classList.remove("dragover"));
    }
  }
  /* -------------------------------------------- */
  /*  ITEM DRAG                                    */
  /* -------------------------------------------- */
  #activateItemDrag() {
    const items = this.element.querySelectorAll(".k4lt-drop-item");
    for (const el of items) {
      el.addEventListener("dragstart", (event) => {
        const item = this.document.items.get(el.dataset.itemId);
        if (!item) return;
        event.dataTransfer.setData("text/plain", JSON.stringify({ type: "Item", uuid: item.uuid }));
      });
    }
  }
  /* -------------------------------------------- */
  /*  ATTRIBUTE HOVER FX                           */
  /* -------------------------------------------- */
  #activateAttributeHoverEffects() {
    const html = this.element;
    if (!html) return;
    const middle = html.querySelector(".attmid");
    if (!middle) return;
    const base = "systems/k4lt/assets/attributes/middle.webp";
    const effects = {
      ".reasonpic": "systems/k4lt/assets/attributes/middle-left.webp",
      ".intupic":   "systems/k4lt/assets/attributes/middle-right.webp",
      ".percpic":   "systems/k4lt/assets/attributes/middle-bottom.webp",
    };
    for (const [selector, image] of Object.entries(effects)) {
      const element = html.querySelector(selector);
      if (!element) continue;
      element.addEventListener("mouseenter", () => { middle.style.backgroundImage = `url(${image})`; });
      element.addEventListener("mouseleave", () => { middle.style.backgroundImage = `url(${base})`; });
    }
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
  /*  ITEM VIEW                                    */
  /* -------------------------------------------- */
  #onItemView(event) {
    if (event.target.closest("[data-prevent-view]")) return;
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    new k4ltItemViewer(item).render(true);
  }
  /* -------------------------------------------- */
  /*  CYCLE WOUND                                  */
  /* -------------------------------------------- */
  async #onCycleWound(event) {
    const wound   = event.target.dataset.wound;
    const current = this.document.system[wound].state;
    const next =
      current === "none"         ? "unstabilized" :
      current === "unstabilized" ? "stabilized"   : "none";
    this.#saveScrollPosition();
    await this.document.update({ [`system.${wound}.state`]: next });
  }
  /* -------------------------------------------- */
  /*  CYCLE CONDITION                              */
  /* -------------------------------------------- */
  async #onCycleCondition(event) {
    const condition = event.target.dataset.condition;
    const current   = this.document.system[condition]?.state;
    const next      = current === "checked" ? "unchecked" : "checked";
    const impacts   = ["conditionAngry", "conditionSad", "conditionScared", "conditionGuiltRidden"];
    let stability = parseInt(this.document.system.stability.value) || 0;
    if (impacts.includes(condition)) {
      stability += next === "checked" ? 1 : -1;
      stability = Math.max(0, Math.min(stability, 9));
    }
    this.#saveScrollPosition();
    await this.document.update({
      [`system.${condition}.state`]: next,
      "system.stability.value": stability,
    });
  }
  /* -------------------------------------------- */
  /*  STABILITY                                    */
  /* -------------------------------------------- */
  async #onStability(delta) {
    let value = parseInt(this.document.system.stability.value) || 0;
    value = Math.clamp(value + delta, 0, 9);
    await this.document.update({ "system.stability.value": value });
  }
  async #onStabilityIncrease() {
    let value = Number(this.actor.system.stability.value) || 0;
    value = Math.min(value + 1, 9);
    this.#saveScrollPosition();
    await this.actor.update({ "system.stability.value": value });
  }
  async #onStabilityDecrease() {
    let value = Number(this.actor.system.stability.value) || 0;
    value = Math.max(value - 1, 0);
    this.#saveScrollPosition();
    await this.actor.update({ "system.stability.value": value });
  }
  /* -------------------------------------------- */
  /*  CURRENT CONSCIOUSNESS                        */
  /* -------------------------------------------- */
  #getConsciousnessState() {
    const spentSleeper = [
      "advancementSleeper1", "advancementSleeper2", "advancementSleeper3",
      "advancementSleeper4", "advancementSleeper5", "advancementSleeper6",
    ].filter((id) => this.actor.system[id]?.value > 0).length;
    if (this.actor.system.advancementAware31?.value > 0) return "enlightened";
    if (spentSleeper >= 6) return "aware";
    return "sleeper";
  }
  /* -------------------------------------------- */
  /*  SELECT OPTIONS                               */
  /* -------------------------------------------- */
  _getSelectOptions() {
    const range = (from, to) =>
      Array.from({ length: to - from + 1 }, (_, i) => {
        const v = from + i;
        return { value: String(v), label: v > 0 ? `+${v}` : String(v) };
      }).reverse();
    const modifierValues         = range(-5, 5);
    const passiveAttributeValues = range(-2, 5);
    const activeAttributeValues  = range(-4, 5);
    const stabilityKeys = [
      "Composed", "Uneasy", "Unfocused", "Shaken", "Distressed",
      "Neurotic", "Anxious", "Irrational", "Unhinged", "Broken",
    ];
    const stabilityValues = stabilityKeys.map((key, i) => ({
      value: String(i),
      label: game.i18n.localize(`k4lt.Stability${key}`),
    }));
    return { modifierValues, passiveAttributeValues, activeAttributeValues, stabilityValues };
  }
  /* -------------------------------------------- */
  /*  COLLECTIONS                                  */
  /* -------------------------------------------- */
  _getCollections(items) {
    const collections = {};
    for (const item of items) {
      (collections[item.type] ??= []).push(item);
    }
    for (const collection of Object.values(collections)) {
      collection.sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang, { sensitivity: "base" }));
    }
    const relationships = (collections.relationship ?? []).map((item) => {
      const linked = fromUuidSync(item.system.link);
      return { ...item, linked };
    });
    return {
      abilities:     collections.ability      ?? [],
      advantages:    collections.advantage    ?? [],
      disadvantages: collections.disadvantage ?? [],
      darksecrets:   collections.darksecret   ?? [],
      limitations:   collections.limitation   ?? [],
      moves:         collections.move         ?? [],
      families:      collections.family       ?? [],
      occupations:   collections.occupation   ?? [],
      gears:         collections.gear         ?? [],
      weapons:       collections.weapon       ?? [],
      armors:        collections.armor        ?? [],
      dramatichooks: collections.dramatichook ?? [],
      relationships,
    };
  }
  /* -------------------------------------------- */
  /*  DROP                                         */
  /* -------------------------------------------- */
  async _onDrop(event) {
    event.preventDefault();
    const dropZone = event.target.closest("[data-drop-zone]");
    if (!dropZone) return;
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    if (data.type !== "Item") return;
    const item = await Item.implementation.fromDropData(data);
    if (!item) return;
    const allowedTypes = [
      "darksecret", "advantage", "disadvantage", "ability", "limitation",
      "move", "gear", "weapon", "armor", "relationship", "dramatichook",
    ];
    if (!allowedTypes.includes(item.type)) {
      ui.notifications.warn(game.i18n.localize("k4lt.mechanics.InvalidDropType"));
      return;
    }
    const currentState = this.#getConsciousnessState();
    if (item.type === "ability" && currentState === "sleeper") {
      kultLogger("DROP BLOCKED", item.name, "requires aware");
      return;
    }
    if (item.type === "limitation" && currentState !== "enlightened") {
      kultLogger("DROP BLOCKED", item.name, "requires enlightened");
      return;
    }
    if (item.type === "occupation") {
      const existing = this.document.items.filter((i) => i.type === "occupation");
      if (existing.length) await this.document.deleteEmbeddedDocuments("Item", existing.map((i) => i.id));
    }
    const duplicate = this.document.items.find((i) => i.type === item.type && i.name === item.name);
    if (duplicate) {
      ui.notifications.warn(game.i18n.localize("k4lt.mechanics.ItemAlreadyAdded"));
      return;
    }
    const itemData = item.toObject();
    if (itemData.system?.hasTokens && itemData.system?.tokenType === "time") {
      itemData.system.tokens = itemData.system.timeTokenMax ?? 0;
    }
    await this.document.createEmbeddedDocuments("Item", [itemData]);
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
  /*  RENDER                                       */
  /* -------------------------------------------- */
  _onRender(context, options) {
    super._onRender(context, options);
    this.#activateAttributeHoverEffects();
    this.#activateImageHoverPreview();
    this.#activateDropZones();
    this.#activateItemDrag();
    if (game.user.isGM) {
      this.element.querySelectorAll("[data-action='buyAdvancement']").forEach((el) => {
        el.addEventListener(
          "contextmenu",
          this.#onRefundAdvancement.bind(this),
        );
      });
    }
    requestAnimationFrame(() => this.#restoreScrollPosition());
  }
  /* -------------------------------------------- */
  /*  ACTION HANDLER                               */
  /* -------------------------------------------- */
  _onClickAction(event, target) {
    const action = target.dataset.action;
    switch (action) {
      case "openImageEditor":     return this.#onOpenImageEditor(event);
      case "itemCreate":          return this.#onItemCreate(event);
      case "itemView":            return this.#onItemView(event);
      case "itemEdit":            return this.#onItemEdit(event);
      case "itemDelete":          return this.#onItemDelete(event);
      case "itemRoll":            return this.#onItemRoll(event);
      case "tokenIncrease":       return this.#onTokenIncrease(event);
      case "tokenDecrease":       return this.#onTokenDecrease(event);
      case "cycleWound":          return this.#onCycleWound(event);
      case "stabilityIncrease":   return this.#onStability(1);
      case "stabilityDecrease":   return this.#onStability(-1);
      case "cycleCondition":      return this.#onCycleCondition(event);
      case "usesIncrease":        return this.#onUsesIncrease(event);
      case "usesDecrease":        return this.#onUsesDecrease(event);
      case "toggleEquip":         return this.#onToggleEquip(event);
      case "requestReload":       return this.#onRequestReload(event);
      case "createGear":          return this.#onCreateGear(event);
      case "createDarkSecret":    return this.#onCreateDarkSecret(event);
      case "toggleCompleted":     return this.#onToggleCompleted(event);
      case "toggleAdvancementXP": return this.#onToggleAdvancementXP(event);
      case "buyAdvancement":      return this.#onBuyAdvancement(event);
      case "resetAdvancements":   return this.#onResetAdvancements(event);
      case "resetProgression":    return this.#onResetProgression(event);
      case "viewConsciousness":   return this.#onViewConsciousness(event);
      default:                    return super._onClickAction(event, target);
    }
  }
  /* -------------------------------------------- */
  /*  HELPERS                                      */
  /* -------------------------------------------- */
  #getItemFromEvent(event) {
    const el = event.target.closest("[data-item-id]");
    if (!el) return null;
    return this.document.items.get(el.dataset.itemId);
  }
  /* -------------------------------------------- */
  /*  ITEM EDIT / DELETE / CREATE                  */
  /* -------------------------------------------- */
  #onItemEdit(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    item.sheet.render(true);
  }
  async #onItemDelete(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    await item.delete();
  }
  async #onItemCreate(event) {
    event.preventDefault();
    const type = event.target.dataset.type;
    if (!type) return;
    const [item] = await this.document.createEmbeddedDocuments("Item", [
      { name: game.i18n.localize(`TYPES.Item.${type}`), type },
    ]);
    item.sheet.render(true);
  }
  /* -------------------------------------------- */
  /*  ITEM ROLL                                    */
  /* -------------------------------------------- */
  #onItemRoll(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    if (item.type === "move" || item.system.type === "active") {
      return this.document.moveroll?.(item.id);
    }
  }
  /* -------------------------------------------- */
  /*  TOKEN INCREASE / DECREASE                    */
  /* -------------------------------------------- */
  async #onTokenIncrease(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    const tokenType = item.system.tokenType;
    if (tokenType === "hold" && !game.user.isGM) return;
    let value = (item.system.tokens ?? 0) + 1;
    if (tokenType === "time") value = Math.min(value, item.system.timeTokenMax ?? 0);
    this.#saveScrollPosition();
    await item.update({ "system.tokens": value });
  }
  async #onTokenDecrease(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    const tokenType = item.system.tokenType;
    if (tokenType === "hold" && !game.user.isGM) return;
    const value = Math.max((item.system.tokens ?? 0) - 1, 0);
    this.#saveScrollPosition();
    await item.update({ "system.tokens": value });
  }
  /* -------------------------------------------- */
  /*  USES INCREASE / DECREASE                     */
  /* -------------------------------------------- */
  async #onUsesIncrease(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    this.#saveScrollPosition();
    await item.update({
      "system.uses.value": Math.min((item.system.uses.value ?? 0) + 1, item.system.uses.max ?? 0),
    });
  }
  async #onUsesDecrease(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    this.#saveScrollPosition();
    await item.update({
      "system.uses.value": Math.max((item.system.uses.value ?? 0) - 1, 0),
    });
  }
  /* -------------------------------------------- */
  /*  TOGGLE EQUIP                                 */
  /* -------------------------------------------- */
  async #onToggleEquip(event) {
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    this.#saveScrollPosition();
    await item.update({ "system.active": !item.system.active });
  }
  /* -------------------------------------------- */
  /*  REQUEST RELOAD                               */
  /* -------------------------------------------- */
  async #onRequestReload(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    await ChatMessage.create({
      content: `
        <p>${game.i18n.format("k4lt.reload.RequestPC", { actor: this.actor.name, item: item.name })}</p>
        <button class="k4lt-chat-btn k4lt-chat-btn-success" data-reload="safe" data-actor="${this.actor.id}" data-item="${item.id}">
          <i class="fa-solid fa-circle-check"></i>
          ${game.i18n.localize("k4lt.reload.Safe")}
        </button>
        <button class="k4lt-chat-btn k4lt-chat-btn-danger" data-reload="pressure" data-actor="${this.actor.id}" data-item="${item.id}">
          <i class="fa-solid fa-triangle-exclamation"></i>
          ${game.i18n.localize("k4lt.reload.Pressure")}
        </button>
      `,
      whisper: ChatMessage.getWhisperRecipients("GM"),
    });
  }
  /* -------------------------------------------- */
  /*  CREATE DARK SECRET                           */
  /* -------------------------------------------- */
  async #onCreateDarkSecret(event) {
    event.preventDefault();
    const [item] = await this.document.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize("k4lt.collections.DarkSecret"),
      type: "darksecret",
      img:  "icons/svg/item-bag.svg",
    }]);
    item.sheet.render(true);
  }
  /* -------------------------------------------- */
  /*  CREATE GEAR                                  */
  /* -------------------------------------------- */
  async #onCreateGear(event) {
    event.preventDefault();
    const [item] = await this.document.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize("k4lt.collections.Gear"),
      type: "gear",
      img:  "icons/svg/item-bag.svg",
    }]);
    item.sheet.render(true);
  }
  /* -------------------------------------------- */
  /*  TOGGLE DRAMATIC HOOK                         */
  /* -------------------------------------------- */
  async #onToggleCompleted(event) {
    event.preventDefault();
    const item = this.#getItemFromEvent(event);
    if (!item) return;
    this.#saveScrollPosition();
    await item.update({ "system.completed": !item.system.completed });
  }
  /* -------------------------------------------- */
  /*  TOGGLE XP                                    */
  /* -------------------------------------------- */
  async #onToggleAdvancementXP(event) {
    if (!game.user.isGM) return;
    event.preventDefault();
    const button = event.target.closest("[data-id]");
    if (!button) return;
    const id      = button.dataset.id;
    const current = this.actor.system[id]?.value ?? 0;
    const next    = current > 0 ? 0 : 1;
    const updates = { [`system.${id}.value`]: next };
    const xpIds   = ["advancementExp1", "advancementExp2", "advancementExp3", "advancementExp4", "advancementExp5"];
    let checked = 0;
    for (const xpId of xpIds) {
      const value = xpId === id ? next : (this.actor.system[xpId]?.value ?? 0);
      if (value > 0) checked++;
    }
    if (checked >= 5) {
      for (const xpId of xpIds) updates[`system.${xpId}.value`] = 0;
      updates["system.advancementPoints.value"] = (this.actor.system.advancementPoints.value ?? 0) + 1;
    }
    this.#saveScrollPosition();
    await this.actor.update(updates);
  }
  /* -------------------------------------------- */
  /*  BUY ADVANCEMENT                              */
  /* -------------------------------------------- */
  async #onBuyAdvancement(event) {
    event.preventDefault();
    const button = event.target.closest("[data-id]");
    if (!button) return;
    const id           = button.dataset.id;
    const currentState = this.#getConsciousnessState();
    /* -- Tier locks ----------------------------- */
    const sleeperOrder = [
      "advancementSleeper1", "advancementSleeper2", "advancementSleeper3",
      "advancementSleeper4", "advancementSleeper5", "advancementSleeper6",
    ];
    const sleeperIndex = sleeperOrder.indexOf(id);
    if (sleeperIndex > 0) {
      const previousValue = this.actor.system[sleeperOrder[sleeperIndex - 1]]?.value ?? 0;
      if (previousValue < 1) return;
    }
    const awareTier1Ids = ["advancementAware11", "advancementAware12", "advancementAware13", "advancementAware14"];
    const awareTier2Ids = [...awareTier1Ids, "advancementAware21", "advancementAware22", "advancementAware23", "advancementAware24"];
    const sumSpent = (ids) => ids.reduce((total, id) => total + (this.actor.system[id]?.value ?? 0), 0);
    if (["advancementAware21", "advancementAware22", "advancementAware23", "advancementAware24"].includes(id) && sumSpent(awareTier1Ids) < 5) return;
    if (id === "advancementAware31" && sumSpent(awareTier2Ids) < 10) return;
    const enlightenedTier1Ids = ["advancementEnlightened11", "advancementEnlightened12", "advancementEnlightened13", "advancementEnlightened14"];
    const enlightenedTier2Ids = [...enlightenedTier1Ids, "advancementEnlightened21", "advancementEnlightened22", "advancementEnlightened23", "advancementEnlightened24"];
    if (["advancementEnlightened21", "advancementEnlightened22", "advancementEnlightened23", "advancementEnlightened24"].includes(id) && sumSpent(enlightenedTier1Ids) < 5) return;
    if (id === "advancementEnlightened31" && sumSpent(enlightenedTier2Ids) < 10) return;
    /* -- State lock ----------------------------- */
    const entryState = id.startsWith("advancementSleeper") ? "sleeper"
      : id.startsWith("advancementAware") ? "aware"
      : "enlightened";
    if (entryState !== currentState) return;
    const points    = this.actor.system.advancementPoints.value ?? 0;
    if (points <= 0) return;
    const entryData = this.actor.system[id];
    if (!entryData) return;
    const current = entryData.value ?? 0;
    const maxMap = {
      advancementAware11: 6, advancementAware12: 2, advancementAware13: 1, advancementAware14: 3,
      advancementAware21: 2, advancementAware22: 2, advancementAware23: 1, advancementAware24: 1,
      advancementAware31: 1,
      advancementEnlightened11: 1, advancementEnlightened12: 6, advancementEnlightened13: 2, advancementEnlightened14: 3,
      advancementEnlightened21: 2, advancementEnlightened22: 3, advancementEnlightened23: 1, advancementEnlightened24: 1,
      advancementEnlightened31: 1,
    };
    const max = maxMap[id] ?? entryData.max ?? 1;
    if (current >= max) return;
    /* -- Awakening confirmation ----------------- */
    if (id === "advancementEnlightened31") {
      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("k4lt.advancement.Awakening.DialogTitle") },
        content: `
          <div class="k4lt-awakening-dialog">
            <h2>${game.i18n.localize("k4lt.advancement.Awakening.DialogHeader")}</h2>
            <p>${game.i18n.localize("k4lt.advancement.Awakening.DialogParagraph1")}</p>
            <p>${game.i18n.localize("k4lt.advancement.Awakening.DialogParagraph2")}</p>
            <div class="k4lt-awakening-warning">
              <div class="k4lt-awakening-warning-header">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div><strong>${game.i18n.localize("k4lt.advancement.Awakening.DialogParagraph4")}</strong></div>
              <div>${game.i18n.localize("k4lt.advancement.Awakening.DialogParagraph5")}</div>
            </div>
            <div class="k4lt-awakening-confirm">
              ${game.i18n.localize("k4lt.advancement.Awakening.DialogConfirm")}
            </div>
          </div>
        `,
      });
      if (!confirmed) return;
    }
    /* -- Apply advancement ---------------------- */
    this.#saveScrollPosition();
    await this.actor.update({
      [`system.${id}.value`]: current + 1,
      "system.advancementPoints.value": points - 1,
    });
    /* -- Awakening chat message ----------------- */
    if (id === "advancementEnlightened31") {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="k4lt-awakening-chat">
            <h2>${game.i18n.localize("k4lt.advancement.Awakening.ChatTitle")}</h2>
            <p class="k4lt-awakening-chat-intro">
              <strong>${game.i18n.format("k4lt.advancement.Awakening.ChatParagraph1", { name: this.actor.name })}</strong>
            </p>
            <p>${game.i18n.localize("k4lt.advancement.Awakening.ChatParagraph2")}</p>
            <p>${game.i18n.localize("k4lt.advancement.Awakening.ChatParagraph3")}</p>
            <div class="k4lt-awakening-chat-warning">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>${game.i18n.localize("k4lt.advancement.Awakening.ChatParagraph4")}</span>
            </div>
          </div>
        `,
      });
    }
  }
  /* -------------------------------------------- */
  /*  REFUND ADVANCEMENT (GM ONLY)                 */
  /* -------------------------------------------- */
  async #onRefundAdvancement(event) {
    if (!game.user.isGM) return;
    event.preventDefault();
    const id           = event.currentTarget.dataset.id;
    const currentState = this.#getConsciousnessState();
    const entryState   = id.startsWith("advancementSleeper") ? "sleeper"
      : id.startsWith("advancementAware") ? "aware"
      : "enlightened";
    if (entryState !== currentState) return;
    if (!id) return;
    const data = this.actor.system[id];
    if (!data) return;
    const current = data.value ?? 0;
    if (current <= 0) return;
    this.#saveScrollPosition();
    await this.actor.update({
      [`system.${id}.value`]: current - 1,
      "system.advancementPoints.value": (this.actor.system.advancementPoints.value ?? 0) + 1,
    });
  }
  /* -------------------------------------------- */
  /*  RESET ADVANCEMENTS                           */
  /* -------------------------------------------- */
  async #onResetAdvancements() {
    if (!game.user.isGM) return;
    const updates = {};
    let refunded = 0;
    for (const [key, value] of Object.entries(this.actor.system)) {
      if (!key.startsWith("advancement") || key.startsWith("advancementExp") || key === "advancementPoints") continue;
      if (typeof value === "object" && typeof value.value === "number") {
        refunded += value.value;
        updates[`system.${key}.value`] = 0;
      }
    }
    updates["system.advancementPoints.value"] = refunded;
    this.#saveScrollPosition();
    await this.actor.update(updates);
  }
  /* -------------------------------------------- */
  /*  RESET PROGRESSION                            */
  /* -------------------------------------------- */
  async #onResetProgression() {
    if (!game.user.isGM) return;
    const confirmed = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Reset Progression" },
      content: `
        <p>This will completely reset all XP, Advancement Points and Advancements.</p>
        <p><strong>This action cannot be undone.</strong></p>
      `,
    });
    if (!confirmed) return;
    const updates = {};
    for (const [key, value] of Object.entries(this.actor.system)) {
      if (!key.startsWith("advancement")) continue;
      if (typeof value === "object" && typeof value.value === "number") {
        updates[`system.${key}.value`] = 0;
      }
    }
    this.#saveScrollPosition();
    await this.actor.update(updates);
  }
  /* -------------------------------------------- */
  /*  VIEW CONSCIOUSNESS                           */
  /* -------------------------------------------- */
  #onViewConsciousness(event) {
    kultLogger("CLICK");
    const button = event.target.closest("[data-state]");
    if (!button) return;
    const state = button.dataset.state;
    kultLogger("VIEW CLICK", state);
    this.#viewConsciousness = state;
    this.#saveScrollPosition();
    this.render(true);
  }
  /* -------------------------------------------- */
  /*  EDIT IMAGE                                   */
  /* -------------------------------------------- */
  #onOpenImageEditor(event) {
    event.preventDefault();
    const image = event.target.closest(".k4lt-image-block")?.querySelector(".profile-img");
    image?.click();
  }
  /* -------------------------------------------- */
  /*  SCROLL MEMORY                                */
  /* -------------------------------------------- */
  #saveScrollPosition() {
    const container = this.element?.querySelector(".tab.active.k4lt-scrollY");
    if (!container) return;
    const tab = this.tabGroups.sheet ?? "default";
    this.#scrollPositions[tab] = container.scrollTop;
  }
  #restoreScrollPosition() {
    const container = this.element?.querySelector(".tab.active.k4lt-scrollY");
    if (!container) return;
    const tab = this.tabGroups.sheet ?? "default";
    container.scrollTop = this.#scrollPositions[tab] ?? 0;
  }
  /* -------------------------------------------- */
  /*  CONTEXT                                      */
  /* -------------------------------------------- */
  async _prepareContext(options) {
    const context       = await super._prepareContext(options);
    const actor         = this.document;
    const selectOptions = this._getSelectOptions();
    const collections   = this._getCollections(actor.items);
    context.tabs = this.#getTabs();
    /* -- Token summary -------------------------- */
    const tokenSummary = {
      edge: 0,
      hold: 0,
      rage: { value: 0, exists: false },
      time: { current: 0, max: 0, exists: false },
    };
    for (const item of actor.items) {
      if (!item.system?.hasTokens) continue;
      const type  = item.system.tokenType;
      const value = item.system.tokens ?? 0;
      switch (type) {
        case "edge": tokenSummary.edge += value; break;
        case "hold": tokenSummary.hold += value; break;
        case "rage": tokenSummary.rage.exists = true; tokenSummary.rage.value += value; break;
        case "time":
          tokenSummary.time.exists   = true;
          tokenSummary.time.current += value;
          tokenSummary.time.max     += item.system.timeTokenMax ?? 0;
          break;
      }
    }
    /* -- Wounds --------------------------------- */
    const woundDefs = [
      { id: "majorwound1",   placeholder: "k4lt.character.MajorWound1" },
      { id: "majorwound2",   placeholder: "k4lt.character.MajorWound2" },
      { id: "majorwound3",   placeholder: "k4lt.character.MajorWound3" },
      { id: "majorwound4",   placeholder: "k4lt.character.MajorWound4" },
      { id: "criticalwound", placeholder: "k4lt.character.CriticalWound" },
    ];
    const woundImages = {
      unstabilized: "systems/k4lt/assets/bleeding-wound.webp",
      stabilized:   "systems/k4lt/assets/sticking-plaster.webp",
    };
    const wounds = woundDefs.map((def) => {
      const state = actor.system[def.id]?.state ?? "none";
      return {
        id:          def.id,
        placeholder: game.i18n.localize(def.placeholder),
        state,
        img:         woundImages[state] ?? "systems/k4lt/assets/blank.webp",
        value:       actor.system[def.id]?.value ?? "",
      };
    });
    /* -- Stability ------------------------------ */
    const stability = Number(actor.system.stability.value) || 0;
    const stabilityLabels = [
      "Composed", "Uneasy", "Unfocused", "Shaken", "Distressed",
      "Neurotic", "Anxious", "Irrational", "Unhinged", "Broken",
    ];
    context.stabilityLabel  = game.i18n.localize(`k4lt.character.Stability${stabilityLabels[stability]}`);
    context.stabilityEffect = game.i18n.localize(`k4lt.character.StabilityEffects${stability}`);
    context.stabilitySteps  = Array.from({ length: 10 }, (_, i) => ({ active: i <= stability }));
    /* -- Conditions ----------------------------- */
    const conditionQuestions = {
      Angry:       ["WhoOrWhatIsTheCharacterAngryAt",      "HowIsTheAngerManifesting"],
      Sad:         ["WhatIsCausingTheSadness",             "HowDoesTheCharacterDealWithIt"],
      Scared:      ["WhatIsTheSourceOfTheFear",            "HowDoesTheFearAffectTheCharactersActions"],
      GuiltRidden: ["WhatDoesTheCharacterFeelGuiltyAbout", "WhoDoesTheCharacterSeekForgivenessFrom"],
      Obsessed:    ["WhatIsTheCharacterObsessedWith",      "WhyDoesTheCharacterFindItCompelling"],
      Distracted:  ["WhatIsTheCharacterDistractedBy",      "HowDoesThisDistractionImpactTheSituation"],
    };
    const conditionNames = ["Angry", "Sad", "Scared", "GuiltRidden", "Obsessed", "Distracted", "Haunted"];
    const systemFields   = actor.system.constructor.schema.fields;
    const conditions = conditionNames.map((name) => {
      const id    = `condition${name}`;
      const data  = actor.system[id];
      const state = data?.state ?? "unchecked";
      return {
        id,
        label:        name,
        data,
        state,
        img:          state === "checked" ? "systems/k4lt/assets/checked.webp" : "systems/k4lt/assets/blank.webp",
        haunted:      name === "Haunted",
        questions:    conditionQuestions[name],
        fieldAnswer1: systemFields[id]?.fields?.answer1,
        fieldAnswer2: systemFields[id]?.fields?.answer2,
        fieldAnswer:  systemFields[id]?.fields?.answer,
      };
    });
    const activeConditions = conditions.filter((c) => c.state === "checked");
    context.activeConditions = activeConditions;
    context.conditionColumns =
      activeConditions.length >= 7 ? 3 :
      activeConditions.length >= 4 ? 2 : 1;
    /* -- Equipped items ------------------------- */
    const equippedItems = actor.items.filter((i) => ["weapon", "armor"].includes(i.type) && i.system.active);
    context.equippedItems    = equippedItems;
    context.equipmentColumns =
      equippedItems.length <= 2 ? 1 :
      equippedItems.length <= 5 ? 2 : 3;
    /* ========================================== */
    /* ADVANCEMENT                                */
    /* ========================================== */
    const advancement = {};
    /* -- XP track ------------------------------- */
    advancement.xp = ["advancementExp1", "advancementExp2", "advancementExp3", "advancementExp4", "advancementExp5"]
      .map((id) => ({ id, checked: (actor.system[id]?.value ?? 0) > 0 }));
    const advancementPoints = actor.system.advancementPoints.value;
    /* -- Consciousness -------------------------- */
    const currentState = this.#getConsciousnessState();
    context.consciousnessState = currentState;
    context.canSeeAbilities    = currentState === "enlightened";
    context.canSeeLimitations  = currentState === "enlightened";
    if (!this.#viewConsciousness) this.#viewConsciousness = currentState;
    const displayedState = this.#viewConsciousness ?? currentState;
    kultLogger("CURRENT:", currentState, "VIEW:", this.#viewConsciousness, "DISPLAY:", displayedState);
    advancement.states = [
      { id: "sleeper",     label: "k4lt.meta.Sleeper",     active: this.#viewConsciousness === "sleeper",     visible: true },
      { id: "aware",       label: "k4lt.meta.Aware",       active: this.#viewConsciousness === "aware",       visible: currentState !== "sleeper" },
      { id: "enlightened", label: "k4lt.meta.Enlightened", active: this.#viewConsciousness === "enlightened", visible: currentState === "enlightened" },
    ].filter((state) => state.visible);
    /* -- Enrich entry helper -------------------- */
    const enrichEntry = (entry) => {
      const data       = actor.system[entry.id];
      entry.value     = data?.value ?? 0;
      entry.max       = entry.max ?? 1;
      entry.remaining = entry.max - entry.value;
      entry.full      = entry.value >= entry.max;
      entry.checked   = entry.value > 0;
      entry.archived  = displayedState !== currentState;
      entry.available = !entry.archived && advancementPoints > 0 && !entry.full;
      entry.uses      = Array.from({ length: entry.max }, (_, i) => ({ used: i < entry.value }));
      return entry;
    };
    /* -- Sleeper -------------------------------- */
    const sleeperEntries = [
      { index: 1, id: "advancementSleeper1", max: 1, label: game.i18n.localize("k4lt.advancement.Sleeper.OneToFive") },
      { index: 2, id: "advancementSleeper2", max: 1, label: game.i18n.localize("k4lt.advancement.Sleeper.OneToFive") },
      { index: 3, id: "advancementSleeper3", max: 1, label: game.i18n.localize("k4lt.advancement.Sleeper.OneToFive") },
      { index: 4, id: "advancementSleeper4", max: 1, label: game.i18n.localize("k4lt.advancement.Sleeper.OneToFive") },
      { index: 5, id: "advancementSleeper5", max: 1, label: game.i18n.localize("k4lt.advancement.Sleeper.OneToFive") },
      { index: 6, id: "advancementSleeper6", max: 1, label: game.i18n.localize("k4lt.advancement.Sleeper.Six") },
    ];
    let nextAvailable = true;
    for (const entry of sleeperEntries) {
      enrichEntry(entry);
      entry.available = !entry.full && nextAvailable && advancementPoints > 0;
      if (!entry.checked) nextAvailable = false;
    }
    /* -- Aware ---------------------------------- */
    const awareGroups = [
      {
        title: game.i18n.localize("k4lt.advancement.Aware.Title1"), min: 0,
        entries: [
          { id: "advancementAware11", max: 6, label: game.i18n.localize("k4lt.advancement.Aware.One") },
          { id: "advancementAware12", max: 2, label: game.i18n.localize("k4lt.advancement.Aware.Two") },
          { id: "advancementAware13", max: 1, label: game.i18n.localize("k4lt.advancement.Aware.Three") },
          { id: "advancementAware14", max: 3, label: game.i18n.localize("k4lt.advancement.Aware.Four") },
        ],
      },
      {
        title: game.i18n.localize("k4lt.advancement.Aware.Title2"), min: 5,
        entries: [
          { id: "advancementAware21", max: 2, label: game.i18n.localize("k4lt.advancement.Aware.Five") },
          { id: "advancementAware22", max: 2, label: game.i18n.localize("k4lt.advancement.Aware.Six") },
          { id: "advancementAware23", max: 1, label: game.i18n.localize("k4lt.advancement.Aware.Seven") },
          { id: "advancementAware24", max: 1, label: game.i18n.localize("k4lt.advancement.Aware.Eight") },
        ],
      },
      {
        title: game.i18n.localize("k4lt.advancement.Aware.Title3"), min: 10,
        entries: [
          { id: "advancementAware31", max: 1, label: game.i18n.localize("k4lt.advancement.Aware.Nine") },
        ],
      },
    ];
    const sumSpent = (ids) => ids.reduce((total, id) => total + (actor.system[id]?.value ?? 0), 0);
    const awareTier1Ids = ["advancementAware11", "advancementAware12", "advancementAware13", "advancementAware14"];
    const awareTier2Ids = [...awareTier1Ids, "advancementAware21", "advancementAware22", "advancementAware23", "advancementAware24"];
    awareGroups[0].unlocked = true;
    awareGroups[1].unlocked = sumSpent(awareTier1Ids) >= 5;
    awareGroups[2].unlocked = sumSpent(awareTier2Ids) >= 10;
    for (const entry of awareGroups[0].entries) enrichEntry(entry);
    for (const entry of awareGroups[1].entries) { enrichEntry(entry); entry.available = entry.available && awareGroups[1].unlocked; }
    for (const entry of awareGroups[2].entries) { enrichEntry(entry); entry.available = entry.available && awareGroups[2].unlocked; }
    /* -- Enlightened ---------------------------- */
    const enlightenedGroups = [
      {
        title: game.i18n.localize("k4lt.advancement.Enlightened.Title1"), min: 0,
        entries: [
          { id: "advancementEnlightened11", max: 1, label: game.i18n.localize("k4lt.advancement.Enlightened.One") },
          { id: "advancementEnlightened12", max: 6, label: game.i18n.localize("k4lt.advancement.Enlightened.Two") },
          { id: "advancementEnlightened13", max: 2, label: game.i18n.localize("k4lt.advancement.Enlightened.Three") },
          { id: "advancementEnlightened14", max: 3, label: game.i18n.localize("k4lt.advancement.Enlightened.Four") },
        ],
      },
      {
        title: game.i18n.localize("k4lt.advancement.Enlightened.Title2"), min: 5,
        entries: [
          { id: "advancementEnlightened21", max: 2, label: game.i18n.localize("k4lt.advancement.Enlightened.Five") },
          { id: "advancementEnlightened22", max: 3, label: game.i18n.localize("k4lt.advancement.Enlightened.Six") },
          { id: "advancementEnlightened23", max: 1, label: game.i18n.localize("k4lt.advancement.Enlightened.Seven") },
          { id: "advancementEnlightened24", max: 1, label: game.i18n.localize("k4lt.advancement.Enlightened.Eight") },
        ],
      },
      {
        title: game.i18n.localize("k4lt.advancement.Enlightened.Title3"), min: 10,
        entries: [
          { id: "advancementEnlightened31", max: 1, label: game.i18n.localize("k4lt.advancement.Enlightened.Nine") },
        ],
      },
    ];
    const enlightenedTier1Ids = ["advancementEnlightened11", "advancementEnlightened12", "advancementEnlightened13", "advancementEnlightened14"];
    const enlightenedTier2Ids = [...enlightenedTier1Ids, "advancementEnlightened21", "advancementEnlightened22", "advancementEnlightened23", "advancementEnlightened24"];
    enlightenedGroups[0].unlocked = true;
    enlightenedGroups[1].unlocked = sumSpent(enlightenedTier1Ids) >= 5;
    enlightenedGroups[2].unlocked = sumSpent(enlightenedTier2Ids) >= 10;
    for (const entry of enlightenedGroups[0].entries) enrichEntry(entry);
    for (const entry of enlightenedGroups[1].entries) { enrichEntry(entry); entry.available = entry.available && enlightenedGroups[1].unlocked; }
    for (const entry of enlightenedGroups[2].entries) { enrichEntry(entry); entry.available = entry.available && enlightenedGroups[2].unlocked; }
    /* -- Current advancement view --------------- */
    if (displayedState === "sleeper") {
      advancement.current = {
        id:     "sleeper",
        label:  game.i18n.localize("k4lt.advancement.Sleeper.Title"),
        info:   game.i18n.localize("k4lt.advancement.Sleeper.Info"),
        groups: [{ unlocked: true, entries: sleeperEntries }],
      };
    } else if (displayedState === "aware") {
      advancement.current = {
        id:     "aware",
        label:  game.i18n.localize("k4lt.advancement.Aware.Title"),
        info:   game.i18n.localize("k4lt.advancement.Aware.Info"),
        groups: awareGroups,
      };
    } else {
      advancement.current = {
        id:     "enlightened",
        label:  game.i18n.localize("k4lt.advancement.Enlightened.Title"),
        info:   game.i18n.localize("k4lt.advancement.Enlightened.Info"),
        groups: enlightenedGroups,
      };
    }
    context.advancement = advancement;
    /* -- Assign to context ---------------------- */
    Object.assign(context, {
      actor,
      system:       actor.system,
      systemFields,
      fields:       actor.constructor.schema.fields,
      source:       actor.toObject(),
      tokenSummary,
      wounds,
      conditions,
      equippedItems,
      ...selectOptions,
      collections,
    });
    return context;
  }
  /* -------------------------------------------- */
  /*  PART CONTEXT                                 */
  /* -------------------------------------------- */
  _preparePartContext(partId, context) {
    super._preparePartContext(partId, context);
    if (context.tabs?.[partId]) context.tab = context.tabs[partId];
    return context;
  }
}