export default class k4ltActor extends Actor {

  /** @override */
  prepareBaseData() {
    if (this.type === "pc") this._preparePCData();
  }

  _preparePCData() {
    this.system.disadvantages = this.items.filter(function (item) {
      return item.type == "disadvantage";
    });
    this.system.disadvantagearray = Array.from(this.system.disadvantages);
  }

  get hasUnstabilizedMajorWounds() {
    if (this.system.majorwound1.state == "unstabilized") return true;
    if (this.system.majorwound2.state == "unstabilized") return true;
    if (this.system.majorwound3.state == "unstabilized") return true;
    if (this.system.majorwound4.state == "unstabilized") return true;
    return false;
  }

  get hasUnstabilizedCriticalWound() {
    if (this.system.criticalwound.state == "unstabilized") return true;
    return false;
  }

  async displayRollResult({ roll, moveName, resultText, moveResultText, optionsText, rollMode }) {
    const templateData = {
      total: roll.total,
      result: roll.result,
      moveName: moveName,
      resultText: resultText,
      moveResultText: moveResultText,
      optionsText: optionsText
    };

    const content = await renderTemplate('systems/k4lt/templates/chat/roll-card.hbs', templateData);

    const chatData = {
      speaker: ChatMessage.getSpeaker({ alias: this.name }),
      content: content,
      rolls: [roll],
      rollMode: rollMode
    };

    ChatMessage.create(chatData);
  }

  async moveroll(moveID) {
    kultLogger("Actor Data => ", this);

    let move = this.items.get(moveID);
    kultLogger("Move => ", move);

    const moveSystemType = move.system.type; // active ou passive
    const moveType = move.type; // advantage, disadvantage...
    const moveName = move.name;
    kultLogger("Move Type => ", moveType);

    if (moveSystemType === "passive") {
      ui.notifications.warn(game.i18n.localize("k4lt.PassiveAbility"));
    } else {
      const attr = move.system.attributemod == "ask" ? await this._attributeAsk() : move.system.attributemod;
      const successtext = move.system.completesuccess;
      const optionstext = move.system.options;
      const failuretext = move.system.failure;
      const partialsuccess = move.system.partialsuccess;
      const specialflag = move.system.specialflag;
      let mod = 0;
      let harm = 0;

      if (specialflag == 3) {
        let boxoutput = await new Promise((resolve) => {
          new Dialog({
            title: game.i18n.localize("k4lt.EndureInjury"),
            content: `<div class="endure-harm-dialog"><label>${game.i18n.localize("k4lt.EndureInjuryDialog")}</label><input id="harm_value" data-type="number" type="number"></div>`,
            default: "one",
            buttons: {
              one: {
                label: "Ok",
                callback: () => {
                  resolve({ harm_value: document.getElementById("harm_value").value });
                },
              },
            },
          }).render(true);
        });
        harm = boxoutput.harm_value;
      }

      if (attr != "" && attr != "none") {
        mod = this.system.attributes[attr];
      }

      let stability = this.system.stability.value;
      let forward = parseInt(this.system.forward);
      let ongoing = parseInt(this.system.ongoing);
      kultLogger("Forward => ", this.system.forward);
      kultLogger("Ongoing => ", this.system.ongoing);

      let situation = 0;

      const hasGrittedTeeth = this.items.some(item => {
        const sourceId = item.getFlag("core", "sourceId");
        return sourceId === "Compendium.k4lt.advantages.Item.35QIDleyEBhrQf4k";
      });
      kultLogger("Has Gritted Teeth => ", hasGrittedTeeth);
      if (!hasGrittedTeeth) {
        if (this.hasUnstabilizedMajorWounds) situation -= 1;
        if (this.hasUnstabilizedCriticalWound) situation -= 1;
      }
      
      if (moveType == "disadvantage" && stability > 0) {
        situation -= (stability <= 2) ? 1 : ((stability <= 5) ? 2 : 3);
      }
      if (specialflag == 1 && stability > 0) {
        situation -= (stability <= 2) ? 0 : ((stability <= 5) ? 1 : 2);
      }
      if (specialflag == 2 && stability > 5) {
        situation += 1;
      }

      kultLogger("Attribute Mod => ", mod);
      kultLogger("Stability Mod => ", situation);
      kultLogger("Harm => ", harm);

      let r = new Roll(`2d10 + ${mod} + ${ongoing} + ${forward} + ${situation} - ${harm}`);
      await r.roll({ async: true });

      if (r.total) {
        this.update({ "system.forward": 0 });
        kultLogger(`Forward is ` + this.system.forward);
      }

      let rollMode = game.settings.get("core", "rollMode");
      if (moveType == "disadvantage") {
        rollMode = "gmroll";
      }

      if (r.total >= 15) {
        await this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Success"), moveResultText: successtext, optionsText: optionstext, rollMode });
      } else if (r.total < 10) {
        await this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Failure"), moveResultText: failuretext, optionsText: optionstext, rollMode });
      } else {
        await this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.PartialSuccess"), moveResultText: partialsuccess, optionsText: optionstext, rollMode });
      }
    }
  }

  async _attributeAsk() {
    const attributes = ["None", "Willpower", "Fortitude", "Reflexes", "Reason", "Intuition", "Perception", "Coolness", "Violence", "Charisma", "Soul"];

    const options = attributes
      .map((attribute) => {
        const localizedAttribute = game.i18n.localize(`k4lt.${attribute}`);
        return `<option value="${attribute.toLowerCase()}">${localizedAttribute}</option>`;
      })
      .join("");

    const result = await new Promise((resolve) => {
      new Dialog({
        title: game.i18n.localize("k4lt.AskAttribute"),
        content: `<div class="endure-harm-dialog">
          <label>${game.i18n.localize("k4lt.AttributePrompt")}</label>
          <select id="attribute_select">${options}</select>
        </div>`,
        default: "one",
        buttons: {
          one: {
            label: "Ok",
            callback: () => {
              const attributeValue = document.getElementById("attribute_select").value;
              resolve(attributeValue);
            },
          },
        },
      }).render(true);
    });

    return result;
  }
}
