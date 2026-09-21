// item.js
export default class k4ltItem extends Item {
  /* -------------------------------------------- */
  /* DERIVED DATA                                 */
  /* -------------------------------------------- */
  prepareDerivedData() {
    super.prepareDerivedData();
    const system = this.system;
    /* -- normalisation simple -- */
    if (this.type === "weapon") {
      system.damage = Number(system.damage) || 0;
    }
    if (this.type === "move") {
      system.isActive = system.type === "active";
    }
  }
  /* -------------------------------------------- */
  /* GETTERS (LOGIQUE MÉTIER)                     */
  /* -------------------------------------------- */
  get isMove() {
    return this.type === "move";
  }
  get isWeapon() {
    return this.type === "weapon";
  }
  get isPassive() {
    return this.system.type === "passive";
  }
  get attribute() {
    return this.system.attribute || null;
  }
  /* -------------------------------------------- */
  /* LIFECYCLE HOOKS                              */
  /* -------------------------------------------- */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    /* -- valeur par défaut -- */
    if (this.type === "archetype" && !this.system.key) {
      this.updateSource({ "system.key": `custom-${foundry.utils.randomID()}` });
    }
    if (
      this.type === "relationship"
      && (!data.img || data.img === "icons/svg/item-bag.svg")
    ) {
      this.updateSource({ img: "icons/svg/mystery-man.svg" });
    }
    if (
      this.type === "weapon"
      && data.system?.damage == null
    ) {
      this.updateSource({
        system: {
          damage: 1,
        },
      });
    }
  }
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);
    /* -- clamp -- */
    if (changed.system?.damage != null) {
      changed.system.damage = Math.max(
        0,
        Number(changed.system.damage),
      );
    }
  }
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
    kultLogger("Item created:", this.name);
  }
  async _onUpdate(changed, options, userId) {
    await super._onUpdate(changed, options, userId);
    if (this.actor) {
      this.actor.render(false);
    }
  }
  async _onDelete(options, userId) {
    await super._onDelete(options, userId);
    if (this.actor) {
      this.actor.render(false);
    }
  }
}
