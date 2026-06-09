// move.js
export default class k4ltMoveModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      attributemod: new fields.StringField({ initial: "" }),
      trigger: new fields.HTMLField({ initial: "" }),
      options: new fields.HTMLField({ initial: "" }),
      completesuccess: new fields.HTMLField({ initial: "" }),
      partialsuccess: new fields.HTMLField({ initial: "" }),
      failure: new fields.HTMLField({ initial: "" }),
      specialflag: new fields.StringField({
        initial: "0",
        choices: ["0", "1", "2", "3"]
      })
    };
  }
}