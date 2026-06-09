// weapon.js
export default class k4ltWeaponModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields =
      foundry.data.fields;
    return {
      active:
        new fields.BooleanField({
          initial:
            false
        }),
      ammo:
        new fields.SchemaField({
          value:
            new fields.NumberField({
              initial: 0,
              min: 0
            }),
          max:
            new fields.NumberField({
              initial: 0,
              min: 0
            })
        }),
      distance:
        new fields.ArrayField(
          new fields.StringField({
            choices: [
              "arm",
              "room",
              "field",
              "horizon"
            ]
          })
        ),
      attacks:
        new fields.ArrayField(
          new fields.SchemaField({
            name:
              new fields.StringField({
                initial: ""
              }),
            harm:
              new fields.NumberField({
                initial: 0,
                min: 0
              }),
            ammoCost:
              new fields.NumberField({
                initial: 0,
                min: 0
              }),
            effect:
              new fields.StringField({
                initial: ""
              }),
            description:
              new fields.HTMLField({
                initial: ""
              }),
          })
        ),
    };
  }
}