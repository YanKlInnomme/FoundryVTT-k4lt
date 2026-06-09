// item-viewer.js
const {
  ApplicationV2,
  HandlebarsApplicationMixin,
} = foundry.applications.api;
export default class k4ltItemViewer extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  static DEFAULT_OPTIONS = {
    id: "k4lt-item-viewer",
    classes: [
      "k4lt",
      "item-viewer",
    ],
    tag: "section",
    position: {
      width: 700,
    },
    window: {
      title: "Item",
      resizable: true,
    },
  };
  static PARTS = {
    header: {
      template:
        "systems/k4lt/templates/items/viewers/item-viewer-header.hbs",
    },
    body: {
      template:
        "systems/k4lt/templates/items/viewers/item-viewer-body.hbs",
    },
  };
  constructor(item, options = {}) {
    super(options);
    this.item = item;
  }
  _prepareContext() {
    const distance = (
      this.item.system.distance || []
    ).filter(Boolean);
    return {
      item: this.item,
      system: this.item.system,
      distance,
    };
  }
  get title() {
    return this.item.name;
  }
}