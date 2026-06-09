// combat-selector.js
const {
  ApplicationV2,
  HandlebarsApplicationMixin,
} = foundry.applications.api;
export default class k4ltCombatSelector extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  static DEFAULT_OPTIONS = {
    id: "k4lt-combat-selector",
    classes: ["k4lt"],
    position: {
      width: 420,
      height: "auto",
    },
  };
  /* ===================== */
  /* TEMPLATE              */
  /* ===================== */
  static PARTS = {
    main: {
      template:
        "systems/k4lt/templates/applications/combat-selector.hbs",
    },
  };
  constructor(actor, move, options = {}) {
    super(options);
    this.actor = actor;
    this.move  = move;
    /* refresh listener */
    this._refreshHook = Hooks.on(
      "updateItem",
      (item) => {
        if (item.parent?.id === this.actor.id) {
          this.render(false);
        }
      },
    );
  }
  /* ===================== */
  /* CLOSE                 */
  /* ===================== */
  async close(options = {}) {
    if (this._refreshHook) {
      Hooks.off("updateItem", this._refreshHook);
    }
    return super.close(options);
  }
  /* ===================== */
  /* CONTEXT               */
  /* ===================== */
  async _prepareContext() {
    const weapons = this.actor.items.filter(
      (i) => i.type === "weapon" && i.system.active,
    );
    return {
      actor: this.actor,
      move: this.move,
      weapons,
    };
  }
  /* ===================== */
  /* EVENTS                */
  /* ===================== */
  _onRender(context, options) {
    super._onRender?.(context, options);
    /* -------- ATTACK ------ */
    this.element
      .querySelectorAll("[data-action='attack']")
      .forEach((el) =>
        el.addEventListener(
          "click",
          this._onAttack.bind(this),
        ),
      );
    /* -------- RELOAD ------ */
    this.element
      .querySelectorAll("[data-action='reload']")
      .forEach((el) =>
        el.addEventListener(
          "click",
          this._onReload.bind(this),
        ),
      );
  }
  /* ===================== */
  /* ATTACK                */
  /* ===================== */
  async _onAttack(ev) {
    ev.preventDefault();
    const weapon = this.actor.items.get(
      ev.currentTarget.dataset.weapon,
    );
    const attack = weapon.system.attacks[
      Number(ev.currentTarget.dataset.attack)
    ];
    /* consume ammo */
    if (attack.ammoCost > 0) {
      await weapon.update({
        "system.ammo.value": Math.max(
          0,
          weapon.system.ammo.value - attack.ammoCost,
        ),
      });
    }
    /* fermer AVANT roll */
    await this.close();
    /* lance Engage */
    await this.actor.moveroll(
      this.move.id,
      {
        weaponId: weapon.id,
        weaponName: weapon.name,
        attack: attack.name,
        harm: attack.harm,
        ammoCost: attack.ammoCost,
        effect: attack.effect,
        description: attack.description,
      },
    );
  }
  /* ===================== */
  /* RELOAD                */
  /* ===================== */
  async _onReload(ev) {
    ev.preventDefault();
    const item = this.actor.items.get(
      ev.currentTarget.dataset.item,
    );
    const owners = game.users.filter(
      (u) => this.actor.testUserPermission(u, "OWNER"),
    );
    /* message MJ */
    await ChatMessage.create({
      whisper: owners.map((u) => u.id),
      content: `
        <p>
          ${game.i18n.format(
            "k4lt.reload.RequestPC",
            {
              user: game.user.name,
              actor: this.actor.name,
              item: item.name,
            },
          )}
        </p>
        <button
          class="k4lt-chat-btn k4lt-chat-btn-success"
          data-reload="safe"
          data-actor="${this.actor.id}"
          data-item="${item.id}"
        >
          <i class="fa-solid fa-circle-check"></i>
          ${game.i18n.localize("k4lt.reload.Safe")}
        </button>
        <button
          class="k4lt-chat-btn k4lt-chat-btn-danger"
          data-reload="pressure"
          data-actor="${this.actor.id}"
          data-item="${item.id}"
        >
          <i class="fa-solid fa-triangle-exclamation"></i>
          ${game.i18n.localize("k4lt.reload.Pressure")}
        </button>
      `,
    });
  }
}