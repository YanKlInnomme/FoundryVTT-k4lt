// pc.js
export default class k4ltPCModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = [
    "k4lt.Sheets.PC",
  ];
  static defineSchema() {
    const fields = foundry.data.fields;
    /* --------------------------- */
    /* HELPERS                     */
    /* --------------------------- */
    const woundField = () =>
      new fields.SchemaField({
        value: new fields.StringField({
          initial: "",
        }),
        state: new fields.StringField({
          initial: "none",
        }),
      });
    const conditionField = () =>
      new fields.SchemaField({
        state: new fields.StringField({
          initial: "none",
        }),
        answer1: new fields.HTMLField({
          initial: "",
        }),
        answer2: new fields.HTMLField({
          initial: "",
        }),
      });
    const advancementField = () =>
      new fields.SchemaField({
        value: new fields.NumberField({
          initial: 0,
          integer: true,
          min: 0,
        }),
        max: new fields.NumberField({
          initial: 1,
          integer: true,
          min: 1,
        }),
        timestamp: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        spent: new fields.BooleanField({
          initial: false,
        }),
      });
    /* --------------------------- */
    /* SCHEMA                      */
    /* --------------------------- */
    return {
      /* ========================= */
      /* FREE TEXT                 */
      /* ========================= */
      whoareyou: new fields.HTMLField({
        initial: "",
      }),
      whatyouholddear: new fields.HTMLField({
        initial: "",
      }),
      thingsinyourpossession: new fields.HTMLField({
        initial: "",
      }),
      relationtotheothercharacters: new fields.HTMLField({
        initial: "",
      }),
      dramatichooks: new fields.HTMLField({
        initial: "",
      }),
      notes: new fields.HTMLField({
        initial: "",
      }),
      /* ========================= */
      /* WOUNDS                    */
      /* ========================= */
      majorwound1: woundField(),
      majorwound2: woundField(),
      majorwound3: woundField(),
      majorwound4: woundField(),
      criticalwound: woundField(),
      /* ========================= */
      /* STABILITY                 */
      /* ========================= */
      stability: new fields.SchemaField({
        value: new fields.NumberField({
          initial: 0,
          min: 0,
          max: 9,
          integer: true,
        }),
        min: new fields.NumberField({
          initial: 0,
        }),
        max: new fields.NumberField({
          initial: 9,
        }),
      }),
      /* ========================= */
      /* ATTRIBUTES                */
      /* ========================= */
      attributes: new fields.SchemaField({
        willpower: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        fortitude: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        reflexes: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        reason: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        intuition: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        perception: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        coolness: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        violence: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        charisma: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        soul: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
      }),
      /* ========================= */
      /* MODIFIERS                 */
      /* ========================= */
      ongoing: new fields.NumberField({
        initial: 0,
        integer: true,
      }),
      forward: new fields.NumberField({
        initial: 0,
        integer: true,
      }),
      /* ========================= */
      /* CONDITIONS                */
      /* ========================= */
      conditionAngry: conditionField(),
      conditionSad: conditionField(),
      conditionScared: conditionField(),
      conditionGuiltRidden: conditionField(),
      conditionObsessed: conditionField(),
      conditionDistracted: conditionField(),
      /* ========================= */
      /* HAUNTED                   */
      /* ========================= */
      conditionHaunted: new fields.SchemaField({
        state: new fields.StringField({
          initial: "none",
        }),
        tokens: new fields.NumberField({
          initial: 0,
          min: 0,
          integer: true,
        }),
        answer: new fields.HTMLField({
          initial: "",
        }),
      }),
      /* ========================= */
      /* ADVANCEMENT               */
      /* ========================= */
      advancementPoints: new fields.SchemaField({
        value: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        sleeper: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        aware: new fields.NumberField({
          initial: 5,
          integer: true,
        }),
        enlightened: new fields.NumberField({
          initial: 10,
          integer: true,
        }),
      }),
      /* ========================= */
      /* EXPERIENCE                */
      /* ========================= */
      advancementXP: new fields.NumberField({
        initial: 0,
        min: 0,
        max: 5,
        integer: true,
      }),
      /* ========================= */
      /* XP TRACK                  */
      /* ========================= */
      advancementExp1: advancementField(),
      advancementExp2: advancementField(),
      advancementExp3: advancementField(),
      advancementExp4: advancementField(),
      advancementExp5: advancementField(),
      /* ========================= */
      /* SLEEPER                   */
      /* ========================= */
      advancementSleeper1: advancementField(),
      advancementSleeper2: advancementField(),
      advancementSleeper3: advancementField(),
      advancementSleeper4: advancementField(),
      advancementSleeper5: advancementField(),
      advancementSleeper6: advancementField(),
      /* ========================= */
      /* AWARE                     */
      /* ========================= */
      advancementAware11: advancementField(),
      advancementAware12: advancementField(),
      advancementAware13: advancementField(),
      advancementAware14: advancementField(),
      advancementAware21: advancementField(),
      advancementAware22: advancementField(),
      advancementAware23: advancementField(),
      advancementAware24: advancementField(),
      advancementAware31: advancementField(),
      /* ========================= */
      /* ENLIGHTENED               */
      /* ========================= */
      advancementEnlightened11: advancementField(),
      advancementEnlightened12: advancementField(),
      advancementEnlightened13: advancementField(),
      advancementEnlightened14: advancementField(),
      advancementEnlightened21: advancementField(),
      advancementEnlightened22: advancementField(),
      advancementEnlightened23: advancementField(),
      advancementEnlightened24: advancementField(),
      advancementEnlightened31: advancementField(),
    };
  }
}