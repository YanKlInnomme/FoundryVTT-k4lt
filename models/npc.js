// npc.js
export default class k4ltNPCModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["k4lt.Sheets.NPC"];
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      /** Origine / lieu */
      home: new fields.StringField({ initial: "" }),
      /** Type de créature */
      creaturetype: new fields.StringField({ initial: "" }),
      /** Dégâts / état */
      harm: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0, min: 0 }),
        min: new fields.NumberField({ initial: 0, min: 0 }),
        max: new fields.NumberField({ initial: 5, min: 0 })
      }),
      /** Mouvements */
      harmmoves: new fields.HTMLField({ initial: "", blank: true }),
      combatmoves: new fields.HTMLField({ initial: "", blank: true }),
      influencemoves: new fields.HTMLField({ initial: "", blank: true }),
      magicmoves: new fields.HTMLField({ initial: "", blank: true }),
      /** Description */
      description: new fields.HTMLField({ initial: "", blank: true }),
      /** Attaques */
      attacks: new fields.HTMLField({ initial: "", blank: true }),
      /** Capacités */
      abilities: new fields.HTMLField({ initial: "", blank: true }),
      /** Niveaux */
      level: new fields.SchemaField({
        combat: new fields.StringField({ initial: "" }),
        influence: new fields.StringField({ initial: "" }),
        magic: new fields.StringField({ initial: "" })
      })
    };
  }
}