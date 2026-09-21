import Base from './base-item-sheet.js';
export default class ArchetypeSheet extends Base {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: [...super.DEFAULT_OPTIONS.classes, 'archetype'],
    position: {width: 640, height: 900},
  };
  static PARTS = {
    header:{template:'systems/k4lt/templates/items/item-header.hbs'},
    body:{template:'systems/k4lt/templates/items/archetype-sheet.hbs'},
  };
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.groups = await Promise.all(this.document.system.groups.map(async group => ({
      ...group, label:game.i18n.localize(`TYPES.Item.${group.type}`),
      links:await Promise.all(group.options.map(async uuid => {
        const item = await fromUuid(uuid);
        return {uuid,name:item?.name ?? game.i18n.localize('k4lt.creation.Missing'),required:group.required.includes(uuid)};
      })),
    })));
    return context;
  }
  _onRender(context,options){
    super._onRender(context,options);
    this.element.querySelectorAll('[data-choice-group]').forEach(element=>{
      element.addEventListener('dragover',event=>event.preventDefault());
      element.addEventListener('drop',async event=>{
        event.preventDefault();event.stopPropagation();if(!this.document.isOwner)return;
        const data=foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
        if(data.type!=='Item')return;
        const item=await Item.implementation.fromDropData(data);if(!item)return;
        const groups=foundry.utils.deepClone(this.document.system.groups),group=groups[Number(element.dataset.choiceGroup)];
        if(item.type!==group.type||group.options.includes(item.uuid))return;
        group.options.push(item.uuid);await this.document.update({'system.groups':groups});
      });
    });
  }
  async _onClickAction(event,target){
    if(target.dataset.action==='openChoice'){
      event.preventDefault();
      const item=await fromUuid(target.dataset.uuid);
      if(!item?.sheet)return ui.notifications.warn(game.i18n.localize('k4lt.creation.Missing'));
      return item.sheet.render(true);
    }
    if(!['addChoiceGroup','removeChoiceGroup','removeChoice','toggleRequired','editChoiceGroup'].includes(target.dataset.action))return super._onClickAction(event,target);
    if(!this.document.isOwner)return;
    const groups=foundry.utils.deepClone(this.document.system.groups);
    const index=Number(target.closest('[data-choice-group]')?.dataset.choiceGroup);
    const group=groups[index];
    if(target.dataset.action==='removeChoiceGroup'){
      groups.splice(index,1);
    }else if(target.dataset.action==='removeChoice'){
      group.options=group.options.filter(uuid=>uuid!==target.dataset.uuid);
      group.required=group.required.filter(uuid=>uuid!==target.dataset.uuid);
    }else if(target.dataset.action==='toggleRequired'){
      const uuid=target.dataset.uuid;
      group.required=group.required.includes(uuid)?group.required.filter(id=>id!==uuid):[...group.required,uuid];
    }else{
      const t=key=>game.i18n.localize('k4lt.creation.'+key);
      const selected=await foundry.applications.api.DialogV2.wait({window:{title:t('ChoiceGroup')},content:`<label>${t('ChoiceType')}<select name="type">${['darksecret','disadvantage','advantage','ability','limitation'].map(type=>`<option value="${type}" ${group?.type===type?'selected':''}>${game.i18n.localize('TYPES.Item.'+type)}</option>`).join('')}</select></label><label>${t('Minimum')}<input name="min" type="number" min="0" value="${group?.min??1}"></label><label>${t('Maximum')}<input name="max" type="number" min="0" value="${group?.max??1}"></label><label><input name="open" type="checkbox" ${group?.open?'checked':''}>${t('Open')}</label>`,buttons:[{action:'save',label:t('Apply'),callback:(event,button)=>Object.fromEntries(new FormData(button.form))}],rejectClose:false});
      if(!selected)return;
      const min=Number(selected.min),max=Number(selected.max);
      if(!Number.isInteger(min)||!Number.isInteger(max)||min<0||max<0||(max&&min>max))return;
      const value={type:selected.type,min,max,open:!!selected.open,options:group?.type===selected.type?group.options:[],required:group?.type===selected.type?group.required:[]};
      if(group)groups[index]=value;else groups.push(value);
    }
    await this.document.update({'system.groups':groups});
  }
}
