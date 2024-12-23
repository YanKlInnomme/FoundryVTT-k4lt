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

    const levelValues = [
      { value: 0, label: " - " },
      { value: 1, label: `[1] ${game.i18n.localize('k4lt.LevelAttributes.1')}` },
      { value: 2, label: `[2] ${game.i18n.localize('k4lt.LevelAttributes.2')}` },
      { value: 3, label: `[3] ${game.i18n.localize('k4lt.LevelAttributes.3')}` },
      { value: 4, label: `[4] ${game.i18n.localize('k4lt.LevelAttributes.4')}` },
      { value: 5, label: `[5] ${game.i18n.localize('k4lt.LevelAttributes.5')}` },
      { value: 6, label: `[6] ${game.i18n.localize('k4lt.LevelAttributes.6')}` },
      { value: 7, label: `[7] ${game.i18n.localize('k4lt.LevelAttributes.7')}` },
      { value: 8, label: `[8] ${game.i18n.localize('k4lt.LevelAttributes.8')}` },
      { value: 9, label: `[9] ${game.i18n.localize('k4lt.LevelAttributes.9')}` },
      { value: 10, label: `[10] ${game.i18n.localize('k4lt.LevelAttributes.10')}` }
    ];    
    context.levelValues = levelValues;

    kultLogger("NPCSheet getData => ", context);

    return context;
  }
}
