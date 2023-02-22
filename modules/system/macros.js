export default class Macros {
  static createK4ltMacro = async function (dropData, slot) {
    const item = await fromUuid(dropData.uuid);
    if (item.system.type === "passive") {
      ui.notifications.info(game.i18n.localize("k4lt.PassiveAbility"));
      return false;
    }

    const actor = item.actor;
    let command = `character = game.actors.get("${actor.id}");character.moveroll("${item.id}");`;
    let macroName = item.name + " (" + game.actors.get(actor.id).name + ")";

    if (command !== null) { this.createMacro(slot, macroName, command, item.img); }
  };

  /**
   * @description Create a macro
   *  All macros are flaged with a k4lt.macro flag at true
   * @param {*} slot
   * @param {*} name
   * @param {*} command
   * @param {*} img
   */
  static createMacro = async function (slot, name, command, img) {
    let macro = game.macros.contents.find((m) => m.name === name && m.command === command);
    if (!macro) {
      macro = await Macro.create(
        {
          name: name,
          type: "script",
          img: img,
          command: command,
          flags: { "k4lt.macro": true },
        },
        { displaySheet: false }
      );
      game.user.assignHotbarMacro(macro, slot);
    }
  };
}
