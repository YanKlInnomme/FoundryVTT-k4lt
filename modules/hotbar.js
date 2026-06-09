// hotbar.js
export default class Hotbar {
  /* -------------------------------------------- */
  /* CREATE MACRO                                  */
  /* -------------------------------------------- */
  static async createK4ltMacro(dropData, slot) {
    if (dropData.type !== "Item") return false;
    const item = await fromUuid(dropData.uuid);
    if (!item) return false;
    /* ---------------------------------------- */
    /* PASSIVE ITEMS                             */
    /* ---------------------------------------- */
    if (item.system.type === "passive") {
      ui.notifications.info(game.i18n.localize("k4lt.PassiveAbility"));
      return false;
    }
    const actor = item.actor;
    if (!actor) return false;
    /* ---------------------------------------- */
    /* COMMAND                                   */
    /* ---------------------------------------- */
    const command = `
      const actor = game.actors.get("${actor.id}");
      if (actor) {
        actor.moveroll("${item.id}");
      }
    `;
    const macroName = `${item.name} (${actor.name})`;
    /* ---------------------------------------- */
    /* CREATE                                    */
    /* ---------------------------------------- */
    await this.createMacro(slot, macroName, command, item.img);
    return false;
  }
  /* -------------------------------------------- */
  /* CREATE MACRO DOCUMENT                         */
  /* -------------------------------------------- */
  static async createMacro(slot, name, command, img) {
    let macro = game.macros.find((m) => m.name === name && m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name, type: "script", img, command, flags: { "k4lt.macro": true } },
        { displaySheet: false },
      );
    }
    await game.user.assignHotbarMacro(macro, slot);
  }
}