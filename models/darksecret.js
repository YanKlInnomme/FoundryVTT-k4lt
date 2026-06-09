// darksecret.js
export default class k4ltDarkSecretModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" })
    };
  }
}