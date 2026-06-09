// dramatichook.js
export default class k4ltDramaticHookModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      completed: new fields.BooleanField({ initial: false }),
      link: new fields.StringField({ initial: "" })
    };
  }
  get linkedDocument() {
    if (!this.link) return null;
    const doc = fromUuidSync(this.link);
    return doc ?? null;
  }
}