// trait.js
export default class k4ltTraitModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      attributemod: new fields.StringField({ initial: "" }),
      type: new fields.StringField({
        initial: "active",
        choices: ["active", "passive"]
      }),
      hasTokens: new fields.BooleanField({ initial: false }),
      tokenType: new fields.StringField({
        initial: "none",
        choices: [
          "none",
          "edge",
          "hold",
          "time",
          "rage"
        ]
      }),
      tokens: new fields.NumberField({ initial: 0, min: 0 }),
      effect: new fields.HTMLField({ initial: "" }),
      options: new fields.HTMLField({ initial: "" }),
      completesuccess: new fields.HTMLField({ initial: "" }),
      completeTokenValue: new fields.NumberField({ initial: 0, min: 0 }),
      partialsuccess: new fields.HTMLField({ initial: "" }),
      partialTokenValue: new fields.NumberField({ initial: 0, min: 0 }),
      failure: new fields.HTMLField({ initial: "" }),
      failureTokenValue: new fields.NumberField({ initial: 0, min: 0 }),
      timeTokenMax: new fields.NumberField({ initial: 10, min: 0 })
    };
  }
}