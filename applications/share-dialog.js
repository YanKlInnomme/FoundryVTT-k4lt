// share-dialog.js
const {
  ApplicationV2,
  HandlebarsApplicationMixin,
} = foundry.applications.api;
export default class k4ltShareDialog extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  static DEFAULT_OPTIONS = {
    id: "k4lt-share-dialog",
    classes: [
      "k4lt",
      "share-dialog",
    ],
    tag: "section",
    position: {
      width: 220,
    },
    window: {
      title: "Share",
      resizable: false,
    },
  };
  static PARTS = {
    body: {
      template:
        "systems/k4lt/templates/applications/share-dialog.hbs",
    },
  };
  get title() {
    return game.i18n.localize(
      "k4lt.share.Title",
    );
  }
  constructor(data, options = {}) {
    super(options);
    this.data = data;
  }
  _prepareContext() {
    return {
      users: game.users
        .filter(u =>
          u.active &&
          u.id !== game.user.id
        )
    };
  }
  _onRender(context, options) {
    super._onRender(context, options);
    const button = this.element.querySelector(
      "[data-action='share']",
    );
    button?.addEventListener(
      "click",
      () => {
        const users = [
          ...this.element.querySelectorAll(
            "input[type='checkbox']:checked",
          ),
        ].map(i => i.value);
        if (typeof this.data.onShare === "function") {
          this.data.onShare(users);
        }
        else {
          game.socket.emit(
            "system.k4lt",
            {
              ...this.data,
              users,
            },
          );
        }
        kultLogger(
          "Shared",
          this.data,
          users,
        );
        this.close();
      },
    );
  }
}