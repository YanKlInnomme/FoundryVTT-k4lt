export default class k4ltNPCsheet extends ActorSheet {
  /** @override */
  get template() {
    return `systems/k4lt/templates/sheets/npc-sheet.hbs`;
  }

  /** @override */
  getData() {
    const context = super.getData();

    context.system = context.actor.system;

    const allowedTypes = ["move", "advantage", "disadvantage", "darksecret", "relationship"];
    context.moves = context.items.filter(item => allowedTypes.includes(item.type));

    kultLogger("NPCSheet getData => ", context);

    return context;
  }
}
