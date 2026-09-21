export default class k4ltAppearanceModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    return {
      category: new f.StringField({initial:'clothes',choices:['clothes','face','eyes','body']}),
      description: new f.HTMLField({initial:''}),
    };
  }
}
