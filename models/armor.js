// armor.js
export default class k4ltArmorModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      active:
        new fields.BooleanField({
          initial:
            false
        }),
      rating: new fields.NumberField({
        initial: 0,
        min: 0,
        integer: true
      }),
      description: new fields.HTMLField({ initial: "" })
    };
  }
}