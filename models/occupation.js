// occupation.js
export default class k4ltOccupationModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      archetype: new fields.StringField({ initial: "" }),
      customArchetype: new fields.StringField({ initial: "" }),
      description: new fields.HTMLField({ initial: "" })
    };
  }
}