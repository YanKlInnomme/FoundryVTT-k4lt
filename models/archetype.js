export default class k4ltArchetypeModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    return {
      key: new f.StringField({initial:''}),
      description: new f.HTMLField({initial:''}),
      state: new f.StringField({initial:'aware',choices:['sleeper','aware','enlightened']}),
      source: new f.ObjectField({initial:{}}),
      groups: new f.ArrayField(new f.ObjectField(),{initial:[]}),
      occupations: new f.ArrayField(new f.StringField(),{initial:[]}),
      appearance: new f.ObjectField({initial:{}}),
      relations: new f.ArrayField(new f.StringField(),{initial:[]}),
    };
  }
}
