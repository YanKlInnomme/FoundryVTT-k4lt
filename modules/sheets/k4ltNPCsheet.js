export default class k4ltNPCsheet extends ActorSheet {
  /** @override */
  get template() {
    return `systems/k4lt/templates/sheets/npc-sheet.hbs`;
  }

  /** @override */
  getData() {
    const context = super.getData();
    context.system = context.actor.system;
    context.moves = context.items.filter(function (item) {
      return item.type == "move" || "advantage" || "disadvantage" || "darksecret" || "relationship";
    });
    kultLogger("NPCSheet getData => ", context);
    return context;
  }
}
