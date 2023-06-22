export default class k4ltitemsheet extends ItemSheet {
  get template() {
    return `systems/k4lt/templates/sheets/${this.item.type}-sheet.hbs`;
  }

  async getData() {
    const context = await super.getData();
    context.system = context.item.system;
    return context;
  }
}
