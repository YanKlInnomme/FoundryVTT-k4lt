// relationship.js
export default class k4ltRelationshipModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      summary: new fields.StringField({ initial: "" }),
      link: new fields.StringField({ initial: "" }),
      strength: new fields.NumberField({
        initial: 0,
        min: 0,
        max: 2,
        step: 1,
        integer: true
      })
    };
  }
  get linkedActor() {
    if (!this.link) return null;
    try {
      const doc = fromUuidSync(this.link);
      return doc?.documentName === "Actor" ? doc : null;
    } catch {
      return null;
    }
  }
  get strengthLabel() {
    const map = {
      0: "Neutral",
      1: "Meaningful",
      2: "Vital"
    };
    const key = map[this.strength];
    return key
      ? game.i18n.localize(`k4lt.relationship.${key}`)
      : "";
  }
  get safeStrength() {
    return Math.clamp(this.strength ?? 0, 0, 2);
  }
}