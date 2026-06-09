// gear.js
export default class k4ltGearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      uses: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
        max: new fields.NumberField({ initial: 0 })
      })
    };
  }
}