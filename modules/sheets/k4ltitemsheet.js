export default class k4ltitemsheet extends ItemSheet{
  get template(){
    return `systems/k4lt/templates/sheets/${this.item.data.type}-sheet.hbs`;
  }

  getData(){
    const data = super.getData();
    const itemData = data.data;
    data.item = itemData;
    data.data = itemData.data;
    return data;
  }
}
