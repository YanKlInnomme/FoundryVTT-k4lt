// mj-hold-tracker.js
const {
  ApplicationV2,
  HandlebarsApplicationMixin,
} = foundry.applications.api;
export default class k4ltMJHoldTracker extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  static DEFAULT_OPTIONS = {
    id: "k4lt-mj-hold-tracker",
    classes: [
      "k4lt",
      "mj-hold-tracker",
    ],
    position: {
      width: 320,
    },
    window: {
      title: "Hold Tracker",
      resizable: true,
      controls: [],
    },
  };
  static PARTS = {
    body: {
      template:
        "systems/k4lt/templates/applications/mj-hold-tracker.hbs",
    },
  };
  /* -------------------------------------------- */
  /* LOAD SAVED POSITION                          */
  /* -------------------------------------------- */
  _initializeApplicationOptions(options) {
    options = super._initializeApplicationOptions(options);
    const saved = game.settings.get(
      "k4lt",
      "holdTrackerPosition",
    );
    if (saved?.left !== undefined) {
      options.position = {
        ...options.position,
        ...saved,
      };
    }
    return options;
  }
  /* -------------------------------------------- */
  /* CONTEXT                                      */
  /* -------------------------------------------- */
  async _prepareContext() {
    const actors = game.actors.contents
      .filter((a) => a.type === "pc")
      .map((actor) => {
        const hold = actor.items
          .filter(
            (i) => i.system.tokenType === "hold",
          )
          .reduce(
            (sum, i) => sum + (i.system.tokens ?? 0),
            0,
          );
        const owners = game.users
          .filter(
            (u) =>
              !u.isGM &&
              actor.ownership[u.id] ===
                CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
          )
          .map((u) => u.name)
          .join(", ")
          || game.i18n.localize("k4lt.ui.NoOwner");
        return {
          id: actor.id,
          name: actor.name,
          img: actor.img,
          owners,
          hold,
        };
      })
      .sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            game.i18n.lang,
            {
              sensitivity: "base",
            },
          ),
      );
    return { actors };
  }
  /* -------------------------------------------- */
  /* SAVE POSITION                                */
  /* -------------------------------------------- */
  _onPosition(position) {
    super._onPosition(position);
    game.settings.set(
      "k4lt",
      "holdTrackerPosition",
      {
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
      },
    );
  }
  /* -------------------------------------------- */
  /* PREVENT CLOSING                              */
  /* -------------------------------------------- */
  async close(options = {}) {
    kultLogger("Hold Tracker close prevented", options);
    if (options?.force) {
      return super.close(options);
    }
    return this;
  }
  /* -------------------------------------------- */
  /* CLICK CARD                                   */
  /* -------------------------------------------- */
  _onRender(...args) {
    super._onRender(...args);
    this.element
      .querySelectorAll(".k4lt-hold-card")
      .forEach((card) => {
        card.addEventListener(
          "click",
          () => {
            const actor = game.actors.get(
              card.dataset.actorId,
            );
            actor?.sheet.render(true);
          },
        );
      });
  }
}