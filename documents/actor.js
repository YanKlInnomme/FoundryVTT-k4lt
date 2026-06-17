// actor.js
import k4ltCombatSelector from "../applications/combat-selector.js";
export default class k4ltActor extends Actor {
  /* -------------------------------------------- */
  /*  PRE CREATE                                   */
  /* -------------------------------------------- */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    if (data.type === "pc") {
      this.updateSource({
        prototypeToken: {
          sight: {
            enabled: true,
            range: 16400,
            angle: 220,
            visionMode: "basic",
            attenuation: 0.5,
            brightness: 0,
            saturation: 0,
            contrast: 0,
          },
          rotation: 0,
          lockRotation: false,
          displayName: CONST.TOKEN_DISPLAY_MODES.HOVER,
          actorLink: true,
        },
      });
    }
  }
  /* -------------------------------------------- */
  /*  PREPARE BASE DATA                            */
  /* -------------------------------------------- */
  prepareBaseData() {
    super.prepareBaseData();
    if (this.type === "pc") {
      this._preparePCData();
    }
  }
  /* -------------------------------------------- */
  /*  PREPARE PC DATA                              */
  /* -------------------------------------------- */
  _preparePCData() {
    this.system.disadvantages = this.items.filter(i => i.type === "disadvantage");
    this.system.disadvantagearray = Array.from(this.system.disadvantages);
  }
  /* -------------------------------------------- */
  /*  WOUNDS                                       */
  /* -------------------------------------------- */
  get hasUnstabilizedMajorWounds() {
    return [1, 2, 3, 4].some(
      n => this.system[`majorwound${n}`]?.state === "unstabilized"
    );
  }
  get hasUnstabilizedCriticalWound() {
    return this.system.criticalwound?.state === "unstabilized";
  }
  /* -------------------------------------------- */
  /*  DISPLAY ROLL RESULT                          */
  /* -------------------------------------------- */
  async displayRollResult({
    roll,
    moveName,
    resultText,
    moveResultText,
    optionsText,
    rollMode,
    attrMod = 0,
    ongoing = 0,
    forward = 0,
    status = 0,
    harm = 0,
    armor = 0,
    combatData = null,
    isEndureInjury = false,
  }) {
    const templateData = {
      total: roll.total,
      result: roll.result,
      moveName,
      resultText,
      moveResultText,
      optionsText,
      formula: roll.formula,
      dice: roll.dice[0]?.results?.map(r => r.result) ?? [],
      modifiers: [
        {
          label: game.i18n.localize("k4lt.mechanics.RollModifierAttribute"),
          value: attrMod,
        },
        {
          label: game.i18n.localize("k4lt.mechanics.RollModifierOngoing"),
          value: ongoing,
        },
        {
          label: game.i18n.localize("k4lt.mechanics.RollModifierForward"),
          value: forward,
        },
        {
          label: game.i18n.localize("k4lt.mechanics.RollModifierStatus"),
          value: status,
        },
        ...(isEndureInjury
          ? [
              {
                label: game.i18n.localize("k4lt.mechanics.RollModifierHarm"),
                value: -harm,
              },
              {
                label: game.i18n.localize("k4lt.mechanics.RollModifierArmor"),
                value: armor,
              },
            ]
          : []),
      ],
      combatDetails: combatData,
    };
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/k4lt/templates/chat/roll-card.hbs",
      templateData
    );
    const chatData = {
      speaker: ChatMessage.getSpeaker({ alias: this.name }),
      content,
      rolls: [roll],
      rollMode,
    };
    if (rollMode === "gmroll") {
      chatData.whisper = game.users.filter(u => u.isGM).map(u => u.id);
    }
    kultLogger("chatData => ", chatData);
    return ChatMessage.create(chatData);
  }
  /* -------------------------------------------- */
  /*  MOVE ROLL                                    */
  /* -------------------------------------------- */
  async moveroll(moveId, combatData = null) {
    kultLogger("Actor Data => ", this);
    const move = this.items.get(moveId);
    kultLogger("Move => ", move);
    if (!move) return;
    const moveOriginalName = move.flags?.babele?.originalName ?? move.name;
    const moveDisplayName  = move.name;
    /* -- Engage in Combat: open selector -------- */
    if (moveOriginalName === "Engage in Combat" && !combatData) {
      return new k4ltCombatSelector(this, move).render(true);
    }
    const moveSystemType = move.system.type;
    const moveType       = move.type;
    /* -- Passive: warn and bail out ------------- */
    if (moveSystemType === "passive") {
      ui.notifications.warn(game.i18n.localize("k4lt.flags.PassiveAbility"));
      return;
    }
    /* -- Gather move data ----------------------- */
    const attr =
      move.system.attributemod === "ask"
        ? await this._attributeAsk()
        : move.system.attributemod;
    const successtext    = move.system.completesuccess;
    const optionstext    = move.system.options;
    const failuretext    = move.system.failure;
    const partialsuccess = move.system.partialsuccess;
    const specialflag    = move.system.specialflag;
    let mod   = 0;
    let harm  = 0;
    let armor = 0;
    /* -- Endure Injury: ask for harm value ------ */
    if (specialflag == 3) {
      const result = await foundry.applications.api.DialogV2.prompt({
        window: {
          title: game.i18n.localize("k4lt.combat.EndureInjury"),
        },
        content: `
          <div class="k4lt-dialog">
            <p>
              ${game.i18n.localize("k4lt.combat.EndureInjuryDialog")}
            </p>
            <input
              name="harm_value"
              type="number"
              value="0"
              min="0"
              autofocus
            >
          </div>
        `,
        ok: {
          callback: (_e, button) =>
            button.form.elements.harm_value.value,
        },
      });
      harm = parseInt(result) || 0;
      armor = this.items
        .filter(i => i.type === "armor" && i.system.active)
        .reduce(
          (sum, a) => sum + (parseInt(a.system.rating) || 0),
          0,
        );
    }
    /* -- Attribute modifier --------------------- */
    if (attr && attr !== "none") {
      mod = parseInt(this.system.attributes[attr]) || 0;
    }
    const stability = parseInt(this.system.stability.value) || 0;
    const forward   = parseInt(this.system.forward) || 0;
    const ongoing   = parseInt(this.system.ongoing) || 0;
    /* -- Wound status modifier ------------------ */
    let status = 0;
    const hasGrittedTeeth = this.items.some(
      i => i._stats?.compendiumSource === "Compendium.k4lt.advantages.Item.35QIDleyEBhrQf4k"
    );
    if (!hasGrittedTeeth) {
      if (this.hasUnstabilizedMajorWounds)   status--;
      if (this.hasUnstabilizedCriticalWound) status--;
    }
    /* -- Build roll formula --------------------- */
    const parts = ["2d10", mod, ongoing, forward, status];
    if (specialflag == 3) {
      parts.push(-harm);
      parts.push(armor);
    }
    const formula = parts.join(" + ");
    const r = new Roll(formula);
    await r.evaluate();
    if (r.total) {
      await this.update({ "system.forward": 0 });
    }
    /* -- Roll mode ------------------------------ */
    let rollMode = game.settings.get("core", "messageMode");
    if (moveType === "disadvantage") {
      rollMode = "gmroll";
    }
    /* -- Result text ---------------------------- */
    let resultText     = "";
    let moveResultText = "";
    if (r.total >= 15) {
      resultText     = game.i18n.localize("k4lt.mechanics.Success");
      moveResultText = successtext;
    } else if (r.total < 10) {
      resultText     = game.i18n.localize("k4lt.mechanics.Failure");
      moveResultText = failuretext;
    } else {
      resultText     = game.i18n.localize("k4lt.mechanics.PartialSuccess");
      moveResultText = partialsuccess;
    }
    /* -- Auto Token Update ---------------------------- */
    const excludedAutoTokens = [
      "time",
      "rage"
    ];
    if (
      move.system.hasTokens &&
      !excludedAutoTokens.includes(
        move.system.tokenType
      )
    ) {
      let delta = 0;
      if (r.total >= 15) {
        delta =
          move.system.completeTokenValue ?? 0;
      }
      else if (r.total < 10) {
        delta =
          move.system.failureTokenValue ?? 0;
      }
      else {
        delta =
          move.system.partialTokenValue ?? 0;
      }
      const current =
        move.system.tokens ?? 0;
      let next =
        current + delta;
      next = Math.max(0, next);
      if (next !== current) {
        await move.update({
          "system.tokens": next
        });
      }
    }
    /* -- Display -------------------------------- */
    await this.displayRollResult({
      roll: r,
      moveName: moveDisplayName,
      resultText,
      moveResultText,
      optionsText: optionstext,
      rollMode,
      attrMod: mod,
      ongoing,
      forward,
      status,
      harm,
      armor,
      combatData,
      isEndureInjury: specialflag == 3,
    });
  }
  /* -------------------------------------------- */
  /*  ATTRIBUTE ASK                                */
  /* -------------------------------------------- */
  async _attributeAsk() {
    const attributes = [
      "None",
      "Willpower", "Fortitude", "Reflexes",
      "Reason",    "Intuition", "Perception",
      "Coolness",  "Violence",  "Charisma",
      "Soul",
    ];
    const options = attributes
      .map(a => `
        <option value="${a.toLowerCase()}">
          ${game.i18n.localize(`k4lt.attributes.${a}`)}
        </option>
      `)
      .join("");
    const result = await foundry.applications.api.DialogV2.prompt({
      window: {
        title: game.i18n.localize("k4lt.mechanics.AskAttribute"),
      },
      content: `
        <div class="endure-harm-dialog">
          <label>${game.i18n.localize("k4lt.mechanics.AttributePrompt")}</label>
          <select name="attribute_select">${options}</select>
        </div>
      `,
      ok: {
        label: "Ok",
        callback: (_event, button) => button.form.elements.attribute_select.value,
      },
    });
    return result ?? "none";
  }
  /* -------------------------------------------- */
  /*  CONDITION COUNT                              */
  /* -------------------------------------------- */
  updateConditionCount() {
    const conditions = [
      this.system.conditionAngry?.state,
      this.system.conditionSad?.state,
      this.system.conditionScared?.state,
      this.system.conditionGuiltRidden?.state,
      this.system.conditionObsessed?.state,
      this.system.conditionDistracted?.state,
      this.system.conditionHaunted?.state,
    ];
    return conditions.filter(c => c === "checked").length;
  }
  /* -------------------------------------------- */
  /*  CREATE                                      */
  /* -------------------------------------------- */
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
    if (!this.isOwner)       return;
    if (this.type !== "pc") return;
    /* ---- DEFAULT MOVES ------------------------ */
    if (
      !this.items.some(
        i => i.type === "move"
      )
    ) {
      const movePack =
        game.packs.get("k4lt.moves");
      if (movePack) {
        const moveDocuments =
          await movePack.getDocuments();
        await this.createEmbeddedDocuments(
          "Item",
          moveDocuments.map(
            doc => doc.toObject()
          )
        );
      }
    }
    /* ---- STARTING WEAPON ---------------------- */
    const hasStartingWeapon =
      this.items.some(
        i => i.flags?.k4lt?.startingWeapon === true
      );
    if (!hasStartingWeapon) {
      const weaponPack =
        game.packs.get("k4lt.weapons");
      if (weaponPack) {
        const weaponDocument =
          await weaponPack.getDocument(
            "BVOWkEhUkbmuwlgG"
          );
        if (weaponDocument) {
          const weaponData =
            weaponDocument.toObject();
          weaponData.system ??= {};
          weaponData.flags ??= {};
          weaponData.flags.k4lt ??= {};
          weaponData.system.active = true;
          weaponData.flags.k4lt.startingWeapon = true;
          await this.createEmbeddedDocuments(
            "Item",
            [weaponData],
          );
        }
      }
    }
  }
}