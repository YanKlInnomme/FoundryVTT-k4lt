export default class k4ltActor extends Actor {

  /** @override */
  prepareBaseData() {
    // Cette méthode est appelée lors de la préparation des données de base de l'acteur.
    // Si le type de l'acteur est "pc" (personnage joueur), appelez la méthode _preparePCData().
    if (this.type === "pc") this._preparePCData();
  }

  _preparePCData() {
    // Cette méthode prépare les données spécifiques au personnage joueur.
    // Elle récupère les objets (items) de type "disadvantage" et les assigne à this.system.disadvantages.
    this.system.disadvantages = this.items.filter(function (item) {
      return item.type == "disadvantage";
    });
    // Elle convertit this.system.disadvantages en un tableau.
    this.system.disadvantagearray = Array.from(this.system.disadvantages);
  }

  get hasUnstabilizedMajorWounds() {
    // Cette méthode vérifie si l'acteur a des blessures majeures non stabilisées.
    // Si l'une des blessures a l'état "unstabilized", elle retourne true, sinon elle retourne false.
    if (this.system.majorwound1.state == "unstabilized") return true;
    if (this.system.majorwound2.state == "unstabilized") return true;
    if (this.system.majorwound3.state == "unstabilized") return true;
    if (this.system.majorwound4.state == "unstabilized") return true;
    return false;
  }

  get hasUnstabilizedCriticalWound() {
    // Cette méthode vérifie si l'acteur a une blessure critique non stabilisée.
    // Si la blessure a l'état "unstabilized", elle retourne true.
    // Sinon, la méthode ne retourne rien explicitement, ce qui signifie false sera renvoyé par défaut.
    if (this.system.criticalwound.state == "unstabilized") return true;
  }

  async displayRollResult({ roll, moveName, resultText, moveResultText, optionsText, whisper = [] }) {
    // Cette méthode affiche le résultat d'un lancer de dés dans le chat.
    // Les informations nécessaires sont passées en tant qu'objet dans le paramètre.
    // Les données sont ensuite utilisées pour générer le contenu du message à afficher.
    const templateData = {
      total: roll.total,
      result: roll.result,
      moveName: moveName,
      resultText: resultText,
      moveResultText: moveResultText,
      optionsText: optionsText
    };

    const content = await renderTemplate('systems/k4lt/templates/chat/roll-card.hbs', templateData);

    const data = {
      speaker: ChatMessage.getSpeaker({ alias: this.name }),
      content: content,
      whisper: whisper,
      rolls: [roll]
    }

    ChatMessage.applyRollMode(data, "roll");
    ChatMessage.create(data);
  }

  async moveroll(moveID) {
    // Cette méthode effectue le lancer de dés pour une action spécifique (move) de l'acteur.
    // Elle reçoit l'identifiant (moveID) de l'action à effectuer.

    kultLogger("Actor Data => ", this);

    let move = this.items.get(moveID);
    kultLogger("Move => ", move);

    const moveSystemType = move.system.type; // active ou passive
    const moveType = move.type; // advantage, disadvantage...
    const moveName = move.name;
    kultLogger("Move Type => ", moveType);

    let whisper = [];
    if (moveType == "disadvantage") {
      whisper = [game.user.uuid, game.users.find(u => u.isGM).uuid];
    }
    kultLogger("Whisper => ", whisper);

    if (moveSystemType === "passive") {
      // Si le type d'action est "passive", affiche un avertissement dans les notifications du jeu.
      ui.notifications.warn(game.i18n.localize("k4lt.PassiveAbility"));
    } else {
      // Sinon, récupère les informations nécessaires pour le lancer de dés.
      const attr = move.system.attributemod == "ask" ? await this._attributeAsk() : move.system.attributemod;
      const successtext = move.system.completesuccess;
      const optionstext = move.system.options;
      const failuretext = move.system.failure;
      const partialsuccess = move.system.partialsuccess;
      const specialflag = move.system.specialflag;
      let mod = 0;
      let harm = 0;

      if (specialflag == 3) {
        // Si le specialflag est égal à 3, il s'agit de l'action "Endure Injury" qui nécessite une saisie utilisateur.
        // Affiche une boîte de dialogue pour demander la valeur de harm.
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
        // Si attr n'est pas une chaîne vide et n'est pas égal à "none",
        // utilise this.system.attributes pour récupérer la valeur de mod correspondante.
        mod = this.system.attributes[attr];
      }

      let stability = this.system.stability.value;
      let forward = parseInt(this.system.forward);
      let ongoing = parseInt(this.system.ongoing);
      kultLogger("Forward => ", this.system.forward);
      kultLogger("Ongoing => ", this.system.ongoing);

      let situation = 0;

      // Réduit la situation modifiée en fonction des blessures majeures non stabilisées.
      if (this.hasUnstabilizedMajorWounds) situation -= 1;

      // Réduit la situation modifiée en fonction de la blessure critique non stabilisée.
      if (this.hasUnstabilizedCriticalWound) situation -= 1;

      // Réduit la situation modifiée en fonction de la stabilité pour les actions de type "disadvantage".
      if (moveType == "disadvantage" && stability > 0) {
        situation -= (stability <= 2) ? 1 : ((stability <= 5) ? 2 : 3);
      }

      // Réduit la situation modifiée en fonction de la stabilité pour l'action "Stability Keep It Together".
      if (specialflag == 1 && stability > 0) {
        situation -= (stability <= 2) ? 0 : ((stability <= 5) ? 1 : 2);
      }
  
      // Augmente la situation modifiée en fonction de la stabilité pour l'action "Stability See Through the Illusion".
      if (specialflag == 2 && stability > 5) {
        situation += 1;
      }

      kultLogger("Attribute Mod => ", mod);
      kultLogger("Stability Mod => ", situation);
      kultLogger("Harm => ", harm);

      // Effectue le lancer de dés avec les modificateurs et la situation modifiée.
      let r = new Roll(`2d10 + ${mod} + ${ongoing} + ${forward} + ${situation} - ${harm}`);
      await r.roll({ async: true });
      
      if (r.total) {
        // Si le résultat du lancer est supérieur à zéro, met à jour la valeur de forward de l'acteur à zéro.
        this.update({ "system.forward": 0 });
        kultLogger(`Forward is ` + this.system.forward);
      }

      if (r.total >= 15) {
        // Si le total du lancer est supérieur ou égal à 15, affiche le résultat comme un succès complet.
        await this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Success"), moveResultText: successtext, optionsText: optionstext });
      } else if (r.total < 10) {
        // Si le total du lancer est inférieur à 10, affiche le résultat comme un échec.
        await this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Failure"), moveResultText: failuretext, optionsText: optionstext });
      } else {
        // Sinon, affiche le résultat comme un succès partiel.
        await this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.PartialSuccess"), moveResultText: partialsuccess, optionsText: optionstext });
      }
    }
  }

  async _attributeAsk() {
    // Cette méthode gère la demande de l'attribut à l'utilisateur.
    // Elle affiche une boîte de dialogue contenant un sélecteur d'attributs.

    // Stocke les noms d'attributs dans un tableau plutôt que de les stocker individuellement.
    const attributes = ["None", "Willpower", "Fortitude", "Reflexes", "Reason", "Intuition", "Perception", "Coolness", "Violence", "Charisma", "Soul"];

    // Utilise la méthode map() pour générer les options du sélecteur à partir du tableau d'attributs.
    const options = attributes
      .map((attribute) => {
        // Localise chaque nom d'attribut.
        const localizedAttribute = game.i18n.localize(`k4lt.${attribute}`);
        // Retourne une chaîne HTML pour chaque option.
        return `<option value="${attribute.toLowerCase()}">${localizedAttribute}</option>`;
        // Utilise la méthode join() pour joindre les options du sélecteur en une seule chaîne.
      })
      .join("");

    // Utilise une promesse pour attendre la sélection de l'utilisateur.
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
