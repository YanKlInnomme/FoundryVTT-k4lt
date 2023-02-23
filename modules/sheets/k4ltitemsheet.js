export default class k4ltitemsheet extends ItemSheet {
  get template() {
    return `systems/k4lt/templates/sheets/${this.item.type}-sheet.hbs`;
  }

  getData() {
    const context = super.getData();
    context.system = context.item.system;
    return context;
  }
}
