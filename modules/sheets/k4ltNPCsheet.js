export default class k4ltNPCsheet extends ActorSheet {
  get template() {
    return `systems/k4lt/templates/sheets/npc-sheet.hbs`;
  }

  getData() {
    const context = super.getData();
    context.moves = context.items.filter(function (item) {
      return item.type == "move" || "advantage" || "disadvantage" || "darksecret" || "relationship";
    });
    return context;
  }
}
