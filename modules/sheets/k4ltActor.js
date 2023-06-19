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
    return false
  }

  get hasUnstabilizedCriticalWound() {
    if (this.system.criticalwound.state == "unstabilized") return true;
  }

  displayRollResult({ roll, moveName, resultText, moveResultText, optionsText }) {
    ChatMessage.create({
      content: `
        <div class='move-img'>
        <div class='result-roll'>
          <div class='tooltip'>
            ${roll.total}
            <span class='tooltiptext'>${roll.result}</span>
          </div>
        </div>
        <div class='move-name'>${moveName}</div>
        <div class='move-name'>${resultText}!</div>
        <div class='move-result'>${moveResultText}</div>
        <div class='move-options'>${optionsText}</div>
        </div>`,
      speaker: ChatMessage.getSpeaker({ alias: this.name }),
    });
  }

  async moveroll(moveID) {
    kultLogger("Actor Data => ", this);

    let move = this.items.get(moveID);
    kultLogger("Move => ", move);

    const moveType = move.system.type;
    const moveName = move.name;
    kultLogger("Move Type => ", moveType);

    if (moveType === "passive") {
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
        // Endure Injury
        let boxoutput = await new Promise((resolve) => {
          new Dialog({
            title: game.i18n.localize("k4lt.EndureInjury"),
            content: `<div class="endure-harm-dialog"><label>${game.i18n.localize(
              "k4lt.EndureInjuryDialog"
            )}</label><input id="harm_value" data-type="number" type="number"></div>`,
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
      let situation = parseInt(this.system.sitmod) + parseInt(this.system.forward);
      kultLogger("Sitmod => ", this.system.sitmod);

      // Major wounds
      if (this.hasUnstabilizedMajorWounds) situation -= 1;

      // Critical wound
      if (this.hasUnstabilizedCriticalWound) situation -= 1;

      // Stability Disadvantage
      if (moveType == "disadvantage" && stability > 0) {
        if (stability <= 2 ) situation -= 1;
        else if (3 <= stability && stability <= 5) situation -= 2;
        else situation -= 3;
      }

      // Stability Keep It Together
      if (specialflag == 1 && stability > 0) {
        situation -= (stability <= 2) ? 0 : ((stability <= 5) ? 1 : 2);
      }
  
      // Stability See Through the Illusion
      if (specialflag == 2 && stability > 5) {
        situation += 1;
      }

      kultLogger("Attribute Mod => ", mod);
      kultLogger("Situation Mod => ", situation);
      kultLogger("Harm => ", harm);

      let r = new Roll(`2d10 + ${mod} + ${situation} - ${harm}`);
      r.roll({ async: false });

      if (game.dice3d) {
        await game.dice3d.showForRoll(r);
      }

      if (r.total) {
        kultLogger("Roll Successful");
        this.update({ "data.sitmod": 0 });
        kultLogger(`Sitmod is ` + this.system.sitmod);
      }

      if (r.total >= 15) {
        this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Success"), moveResultText: successtext, optionsText: optionstext });
      } else if (r.total < 10) {
        this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Failure"), moveResultText: failuretext, optionsText: optionstext });
      } else {
        this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.PartialSuccess"), moveResultText: partialsuccess, optionsText: optionstext });
      }
    }
  }

  async _attributeAsk() {
    // Stocke les noms d'attributs dans un tableau plutôt que de les stocker individuellement
    const attributes = ["None", "Willpower", "Fortitude", "Reflexes", "Reason", "Intuition", "Perception", "Coolness", "Violence", "Charisma", "Soul"];

    // Utilise la méthode map() pour générer les options du sélecteur à partir du tableau d'attributs
    const options = attributes
      .map((attribute) => {
        // Localise chaque nom d'attribut
        const localizedAttribute = game.i18n.localize(`k4lt.${attribute}`);
        // Retourne une chaîne HTML pour chaque option
        return `<option value="${attribute.toLowerCase()}">${localizedAttribute}</option>`;
        // Utilise la méthode join() pour joindre les options du sélecteur en une seule chaîne
      })
      .join("");

    // Utilise une promesse pour attendre la sélection de l'utilisateur
    const result = await new Promise((resolve) => {
      new Dialog({
        title: game.i18n.localize("k4lt.AskAttribute"),
        content: `<div class="endure-harm-dialog">
          <label>${game.i18n.localize("k4lt.Attribute")}</label>
          <select id="attribute_value">${options}</select>
        </div>`,
        buttons: {
          one: {
            label: "Ok",
            // Résout la promesse avec la valeur sélectionnée par l'utilisateur
            callback: () => {
              resolve({ attribute_value: document.getElementById("attribute_value").value });
            },
          },
        },
      }).render(true);
    });

    // Retourne directement la valeur de attribute_value extraite de la promesse résolue
    return result.attribute_value;
  }
}
