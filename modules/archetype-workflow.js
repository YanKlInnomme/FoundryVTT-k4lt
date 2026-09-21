// Archetype workflows stage all choices before touching the actor.
const busy = new Set();
const clone = value => foundry.utils.deepClone(value);
const t = key => game.i18n.localize(`k4lt.creation.${key}`);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const passive=['willpower','fortitude','reflexes'];
const active=['reason','intuition','perception','coolness','violence','charisma','soul'];
const sleeperDistractions=['dating','forums','fitness','fashion','decorating','onlineGames','pornography','realityTelevision','shopping','socialMedia','tvSeries'];
export const BROKEN_DISADVANTAGE_SOURCE='Compendium.k4lt.disadvantages.Item.EOCTaeqsRdhXbRdz';
const consciousnessOrder={sleeper:0,aware:1,enlightened:2};
export const isPastConsciousness=(view,current)=>(consciousnessOrder[view]??-1)<(consciousnessOrder[current]??-1);
export function consciousness(actor) {
  if (actor.system.consciousness) return actor.system.consciousness;
  if (actor.system.advancementAware31?.value) return 'enlightened';
  return Array.from({length:6},(_,i)=>actor.system[`advancementSleeper${i+1}`]?.value).every(Boolean)?'aware':'sleeper';
}
export const sourceOf = item => item.getFlag?.('k4lt','sourceUuid') ?? item.flags?.k4lt?.sourceUuid ?? item._stats?.compendiumSource ?? item.uuid;
const normalizedName=value=>String(value??'').trim().toLocaleLowerCase();
export function shuffled(values,random=Math.random){
  const result=[...values];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export const hasUsefulAttributeFilter=items=>new Set(items.map(item=>String(item.system?.attributemod??'').trim()||'none')).size>1;
export function occupationCompatibility(occupation,definition,suggestions=[]){
  if(!occupation||!definition?.occupations?.length)return true;
  const source=sourceOf(occupation);
  return definition.occupations.includes(source)||suggestions.some(item=>normalizedName(item.name)===normalizedName(occupation.name));
}
export const stabilityMinimum = actor => actor.items.some(item=>item.type==='disadvantage'&&sourceOf(item)===BROKEN_DISADVANTAGE_SOURCE)?4:0;
let rulesPromise;
async function rules(){
  return rulesPromise ??= fetch('systems/k4lt/data/archetype-traits.json').then(r=>{if(!r.ok)throw Error(t('Missing'));return r.json();});
}
async function documents(pack){
  const collection=game.packs.get(`k4lt.${pack}`);
  if(!collection)throw Error(t('Missing'));
  return collection.getDocuments();
}
const packFor={advantage:'advantages',disadvantage:'disadvantages',darksecret:'dark-secrets',ability:'abilities',limitation:'limitations'};
const maxUses={advancementSleeper6:1,advancementAware14:3,advancementAware22:2,advancementAware24:1,advancementAware31:1,advancementEnlightened14:3,advancementEnlightened22:3,advancementEnlightened24:1};
export function advancementEligible(actor,id){
  if(!maxUses[id]||!actor.isOwner||actor.system.advancementPoints.value<1||(actor.system[id]?.value??0)>=maxUses[id])return false;
  const state=id.startsWith('advancementSleeper')?'sleeper':id.startsWith('advancementAware')?'aware':'enlightened';
  if(consciousness(actor)!==state)return false;
  if(id==='advancementSleeper6')return [1,2,3,4,5].every(n=>actor.system[`advancementSleeper${n}`]?.value>0);
  const prefix=state==='aware'?'advancementAware':'advancementEnlightened';
  const tier1=['11','12','13','14'].reduce((sum,k)=>sum+(actor.system[prefix+k]?.value??0),0);
  const tier2=['21','22','23','24'].reduce((sum,k)=>sum+(actor.system[prefix+k]?.value??0),0);
  if(id.endsWith('31'))return tier1+tier2>=10;
  if(id.endsWith('22')||id.endsWith('24'))return tier1>=5;
  return true;
}
const fingerprint=actor=>JSON.stringify({system:actor.system.toObject?.()??actor.system,items:actor.items.map(snapshotItem),history:actor.getFlag('k4lt','archetypeHistory')});
async function resolve(uuid){const item=await fromUuid(uuid);if(!item)throw Error(t('Missing'));return item;}
export function validateGroups(groups, selections, owned = new Set()) {
  for(const [i,group] of groups.entries()){
    const selected=selections[i] ?? [];
    const unique=new Set(selected);
    if(unique.size!==selected.length || selected.length<group.min || (group.max && selected.length>group.max))return false;
    if(group.required.some(uuid=>!unique.has(uuid)&&!owned.has(uuid)))return false;
    if(!group.open && selected.some(uuid=>!group.options.includes(uuid)))return false;
  }
  return true;
}
export function validatePrerequisites(selected, owned, metadata){
  const available=new Set([...selected,...owned]);
  return selected.every(uuid=>(metadata[uuid]?.requires ?? []).every(parent=>available.has(parent)));
}
export function selectionState(count,min,max){
  return {limitReached:max>0&&count>=max,valid:count>=min&&(!max||count<=max),label:max?`${count}/${max}`:`${count}/${min}+`};
}
async function formDialog(title,content,read,render=null){
  return foundry.applications.api.DialogV2.wait({
    window:{title},position:{width:660},classes:['k4lt-creation-dialog'],
    content,buttons:[{action:'apply',label:t('Apply'),callback:(event,button)=>read(new FormData(button.form))}],render,rejectClose:false,
  });
}
async function chooseGroups(groups, actor, extra='', archetypeKey=null){
  const owned=new Set(actor.items.map(sourceOf));
  const metadata=await rules();
  const key=archetypeKey??actor.items.find(i=>i.type==='archetype')?.system.key;
  const available=await Promise.all(groups.map(async group=>{
    const list=group.open?await documents(packFor[group.type]):await Promise.all(group.options.map(resolve));
    return list.filter(i=>!metadata[i.uuid]?.onlyArchetype||metadata[i.uuid].onlyArchetype===key).sort((a,b)=>a.name.localeCompare(b.name));
  }));
  const filterTypes=new Set(['advantage','disadvantage','limitation','ability']);
  let content=groups.map((group,i)=>{
    const attributes=[...new Set(available[i].map(item=>String(item.system.attributemod??'').trim()).filter(Boolean))]
      .sort((a,b)=>[...passive,...active].indexOf(a)-[...passive,...active].indexOf(b));
    const hasUnassigned=available[i].some(item=>!String(item.system.attributemod??'').trim());
    const hint=esc(t(group.open?'Open':'Restricted'));
    const filter=filterTypes.has(group.type)&&hasUsefulAttributeFilter(available[i])?`<label class="k4lt-creation-filter" title="${esc(t('FilterByAttribute'))}"><i class="fas fa-filter"></i><select data-attribute-filter="${i}" aria-label="${esc(t('FilterByAttribute'))}"><option value="all">${esc(t('AllAttributes'))}</option>${attributes.map(key=>`<option value="${esc(key)}">${esc(game.i18n.localize('k4lt.attributes.'+key[0].toUpperCase()+key.slice(1)))}</option>`).join('')}${hasUnassigned?`<option value="none">${esc(t('NoAttribute'))}</option>`:''}</select></label>`:'';
    const toolbar=filter?`<div class="k4lt-choice-toolbar"><p>${hint}</p>${filter}</div>`:`<p>${hint}</p>`;
    return `<fieldset data-choice-group="${i}" data-min="${group.min}" data-max="${group.max}"><legend>${esc(game.i18n.localize(`TYPES.Item.${group.type}`))} (<span data-selection-count>${group.required.length}/${group.max||`${group.min}+`}</span>)</legend>${toolbar}<div class="k4lt-creation-choices">${available[i].map(item=>{
    const required=group.required.includes(item.uuid);
    return `<label class="k4lt-creation-choice" data-item-uuid="${esc(item.uuid)}" data-item-attribute="${esc(String(item.system.attributemod??'').trim()||'none')}" title="${esc(t('RightClickDetails'))}"><input type="checkbox" name="g${i}" value="${esc(item.uuid)}" ${required?'checked data-required="true"':''}> <span>${esc(item.name)}${required?' ('+esc(t('Required'))+')':''}${owned.has(item.uuid)?' ✓':''}</span></label>`;
  }).join('')}</div></fieldset>`;}).join('')+extra;
  const activate=(event,dialog)=>{
    const root=dialog.element;
    const refresh=()=>{
      let valid=true;
      root.querySelectorAll('[data-choice-group]').forEach(fieldset=>{
        const boxes=[...fieldset.querySelectorAll('input[type="checkbox"]')];
        const count=boxes.filter(box=>box.checked).length;
        const state=selectionState(count,Number(fieldset.dataset.min),Number(fieldset.dataset.max));
        fieldset.querySelector('[data-selection-count]').textContent=state.label;
        for(const box of boxes){
          const blocked=state.limitReached&&!box.checked;
          box.disabled=blocked;
          box.closest('.k4lt-creation-choice')?.classList.toggle('disabled',blocked);
        }
        valid&&=state.valid;
      });
      const assignment=root.querySelector('[data-attribute-assignment]');
      if(assignment){
        const state=assignment.dataset.state;
        const expectedPassive=state==='enlightened'?[3,1,0]:[2,1,0];
        const expectedActive=state==='enlightened'?[4,3,2,1,0,-1,-2]:[3,2,1,1,0,-1,-2];
        for(const [kind,expected] of [['passive',expectedPassive],['active',expectedActive]]){
          const section=root.querySelector(`[data-attribute-status="${kind}"]`);
          const selects=[...section.querySelectorAll('[data-attribute-kind]')];
          const values=selects.map(select=>select.value===''?null:Number(select.value));
          const counts=new Map(expected.map(value=>[value,0]));
          values.filter(value=>value!==null).forEach(value=>counts.set(value,(counts.get(value)??0)+1));
          const allowed=new Map(expected.map(value=>[value,expected.filter(candidate=>candidate===value).length]));
          section.querySelectorAll('[data-reserve-value]').forEach(chip=>{
            const value=Number(chip.dataset.reserveValue);
            const used=Number(chip.dataset.occurrence)<(counts.get(value)??0);
            chip.classList.toggle('used',used);
            chip.draggable=!used;
          });
          for(const select of selects){
            for(const option of select.options){
              if(option.value==='')continue;
              const value=Number(option.value);
              option.disabled=select.value!==option.value&&(counts.get(value)??0)>=(allowed.get(value)??0);
            }
          }
          const correct=!values.includes(null)&&equal([...values].sort((a,b)=>a-b),[...expected].sort((a,b)=>a-b));
          section.classList.toggle('invalid',!correct);
          valid&&=correct;
        }
      }
      const distractions=root.querySelector('[data-distractions]');
      if(distractions){
        const checked=distractions.querySelector('input[type="checkbox"]:checked');
        const custom=distractions.querySelector('textarea')?.value.trim();
        valid&&=Boolean(checked||custom);
      }
      const occupationMismatch=root.querySelector('[data-occupation-mismatch]');
      if(occupationMismatch){
        const replace=occupationMismatch.querySelector('[name="occupationMode"]:checked')?.value==='replace';
        const input=occupationMismatch.querySelector('[name="occupation"]');
        input.disabled=!replace;
        occupationMismatch.querySelector('[data-occupation-replacement]').classList.toggle('active',replace);
        if(replace)valid&&=Boolean(input.value.trim());
      }
      const apply=root.querySelector('button[data-action="apply"]');if(apply)apply.disabled=!valid;
    };
    root.querySelectorAll('.k4lt-creation-choice').forEach(label=>{
      const box=label.querySelector('input');
      box.addEventListener('change',()=>{if(box.dataset.required&& !box.checked)box.checked=true;refresh();});
      label.addEventListener('contextmenu',async event=>{
        event.preventDefault();event.stopPropagation();
        const item=available.flat().find(item=>item.uuid===label.dataset.itemUuid);
        if(item){const {default:ItemViewer}=await import('../applications/item-viewer.js');new ItemViewer(item).render(true);}
      });
    });
    root.querySelectorAll('[data-background-suggestion]').forEach(select=>{
      const input=select.closest('.k4lt-background-choice').querySelector('input');
      select.addEventListener('change',()=>{
        if(!select.value)return;
        input.value=select.value;
        input.dispatchEvent(new Event('input',{bubbles:true}));
        refresh();
      });
      input.addEventListener('input',()=>{
        select.value=[...select.options].some(option=>option.value===input.value)?input.value:'';
      });
    });
    root.querySelectorAll('[data-attribute-filter]').forEach(filter=>filter.addEventListener('change',()=>{
      const fieldset=filter.closest('[data-choice-group]');
      fieldset.querySelectorAll('.k4lt-creation-choice').forEach(choice=>choice.classList.toggle('filtered-out',filter.value!=='all'&&choice.dataset.itemAttribute!==filter.value));
    }));
    root.querySelectorAll('[data-attribute-kind]').forEach(select=>{
      select.addEventListener('change',refresh);
      select.addEventListener('dragover',event=>{if(event.dataTransfer?.types.includes('text/x-k4lt-attribute'))event.preventDefault();});
      select.addEventListener('drop',event=>{
        const value=event.dataTransfer?.getData('text/x-k4lt-attribute');
        if(value===''||![...select.options].some(option=>option.value===value&&!option.disabled))return;
        event.preventDefault();select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));
      });
    });
    root.querySelectorAll('[data-reserve-value]').forEach(chip=>chip.addEventListener('dragstart',event=>{
      if(chip.classList.contains('used')){event.preventDefault();return;}
      event.dataTransfer.setData('text/x-k4lt-attribute',chip.dataset.reserveValue);
      event.dataTransfer.effectAllowed='copy';
    }));
    root.querySelector('[data-random-attributes]')?.addEventListener('click',()=>{
      const state=root.querySelector('[data-attribute-assignment]')?.dataset.state;
      const reserves={
        passive:state==='enlightened'?[3,1,0]:[2,1,0],
        active:state==='enlightened'?[4,3,2,1,0,-1,-2]:[3,2,1,1,0,-1,-2],
      };
      for(const [kind,values] of Object.entries(reserves)){
        const randomized=shuffled(values);
        root.querySelectorAll(`[data-attribute-kind="${kind}"]`).forEach((select,index)=>{select.value=String(randomized[index]);});
      }
      refresh();
    });
    root.querySelectorAll('[data-distractions] input, [data-distractions] textarea').forEach(control=>control.addEventListener('input',refresh));
    root.querySelectorAll('[data-occupation-mismatch] input').forEach(control=>control.addEventListener('input',refresh));
    refresh();
  };
  while(true){
    const result=await formDialog(t('Title'),content,data=>({selections:groups.map((_,i)=>data.getAll('g'+i)),data:Object.fromEntries(data),distractionOptions:data.getAll('distractionOption')}),activate);
    if(!result)return null;
    if(result.selections.some((selected,i)=>selected.some(uuid=>!available[i].some(item=>item.uuid===uuid)))){ui.notifications.warn(t('InvalidChoices'));continue;}
    if(!validateGroups(groups,result.selections,owned)){ui.notifications.warn(t('InvalidChoices'));continue;}
    return result;
  }
}
async function configureTraits(uuids,actor){
  const metadata=await rules();
  const owned=new Set(actor.items.map(sourceOf));
  if(!validatePrerequisites(uuids,owned,metadata))throw Error(t('Prerequisite'));
  const result=[];
  for(const uuid of uuids){
    if(owned.has(uuid))continue;
    const item=await resolve(uuid),rule=metadata[uuid]??{};
    let configuration={};
    if(rule.choices||rule.detail||rule.expertise){
      const options=rule.choices??(rule.expertise?['dead','inferno','summon','living','bind']:null);
      const content=`<p>${esc(item.name)}</p>`+(options?`<select name="choice">${options.map(key=>`<option value="${key}">${esc(t(key))}</option>`).join('')}</select>`:`<label>${esc(t('Details'))}<input name="detail" required></label>`);
      configuration=await formDialog(item.name,content,data=>Object.fromEntries(data));
      if(!configuration)return null;
      if(rule.detail&&!configuration.detail?.trim())throw Error(t('InvalidChoices'));
    }
    const raw=item.toObject();delete raw._id;
    raw.flags??={};raw.flags.k4lt={...raw.flags.k4lt,sourceUuid:uuid,configuration};
    result.push(raw);owned.add(uuid);
    if(rule.relation){
      const related=await formDialog(item.name,`<label>${esc(t('RelationName'))}<input name="name" required></label><label>${esc(t('RelationStrength'))}<select name="strength"><option value="1">+1</option><option value="2">+2</option></select></label>`,data=>Object.fromEntries(data));
      if(!related)return null;
      if(!related.name?.trim()||![1,2].includes(Number(related.strength)))throw Error(t('InvalidChoices'));
      result.push({name:related.name.trim(),type:'relationship',img:'icons/svg/mystery-man.svg',system:{strength:Number(related.strength),description:'',summary:item.name,link:''},flags:{k4lt:{parentSource:uuid}}});
    }
    if(rule.grantAdvantage){
      const selection=await chooseGroups([{type:'advantage',min:1,max:1,open:true,options:[],required:[]}],actor);
      if(!selection)return null;
      const child=selection.selections[0][0];
      if(owned.has(child))throw Error(t('Duplicate'));
      const bonus=(await resolve(child)).toObject();delete bonus._id;
      bonus.flags??={};bonus.flags.k4lt={...bonus.flags.k4lt,sourceUuid:child,parentSource:uuid};
      result.push(bonus);owned.add(child);
    }
  }
  // A magic rank cannot select an already acquired field of expertise.
  const domains=actor.items.map(i=>i.flags?.k4lt?.configuration?.choice).filter(Boolean);
  const magic=new Set(['dead','inferno','summon','living','bind']);
  for(const item of result){const choice=item.flags.k4lt.configuration?.choice;if(magic.has(choice)){if(domains.includes(choice))throw Error(t('Duplicate'));domains.push(choice);}}
  return result;
}
const snapshotItem = item => {
  const raw=item.toObject();delete raw._stats;delete raw.sort;
  return raw;
};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function archetypeRelationship(role, document, archetype=null, kind='ally'){
  if(document?.documentName!=='Actor')return null;
  const archetypeName=archetype?.name??'';
  return {
    name:String(role??'').trim()||document.name,
    type:'relationship',
    img:document.img??'icons/svg/mystery-man.svg',
    system:{
      strength:0,
      description:archetypeName?t('ArchetypeRelationDescription').replace('{archetype}',archetypeName):'',
      summary:t(kind==='enemy'?'Enemy':'Ally'),
      link:document.uuid,
    },
    flags:{k4lt:{archetypeRelation:true,archetypeRelationKind:kind,archetypeKey:archetype?.system?.key??'',archetypeSource:archetype?.uuid??''}},
  };
}
const relationshipSync = new Set();
export async function syncArchetypeRelationships(actor){
  if(!actor?.isOwner||consciousness(actor)!=='enlightened'||relationshipSync.has(actor.uuid))return false;
  const archetype=actor.items.find(item=>item.type==='archetype');
  const additions=[];
  const updates=[];
  for(const key of ['ally','enemy']){
    const uuid=actor.system.archetypeContext?.[key+'Link'];
    const document=uuid?fromUuidSync(uuid):null;
    const relationship=archetypeRelationship(actor.system.archetypeContext?.[key],document,archetype,key);
    if(!relationship)continue;
    const existing=actor.items.find(item=>item.type==='relationship'&&item.system.link===uuid&&item.name===relationship.name);
    if(!existing)additions.push(relationship);
    else if(existing.flags?.k4lt?.archetypeRelation&&(!existing.system.summary||!existing.system.description))updates.push({
      _id:existing.id,
      ...(!existing.system.summary&&{'system.summary':relationship.system.summary}),
      ...(!existing.system.description&&{'system.description':relationship.system.description}),
      'flags.k4lt.archetypeRelationKind':key,
    });
  }
  if(!additions.length&&!updates.length)return false;
  relationshipSync.add(actor.uuid);
  try{
    if(updates.length)await actor.updateEmbeddedDocuments('Item',updates);
    if(additions.length)await actor.createEmbeddedDocuments('Item',additions);
    return true;
  }
  finally{relationshipSync.delete(actor.uuid);}
}
export async function applyOperation(actor,{items=[],remove=[],updates={},advancement=null}){
  if(!actor.isOwner)throw Error(t('Permission'));
  updates=Object.fromEntries(Object.entries(updates).filter(([path,value])=>!equal(foundry.utils.getProperty(actor,path),value)));
  const before=Object.fromEntries(Object.keys(updates).map(path=>[path,clone(foundry.utils.getProperty(actor,path)??null)]));
  const removed=remove.map(snapshotItem);
  const history=clone(actor.getFlag('k4lt','archetypeHistory')??[]);
  const operation={id:foundry.utils.randomID(),advancement,before,after:clone(updates),removed,created:[]};
  let created=[];
  try{
    created=await actor.createEmbeddedDocuments('Item',items.map(item=>({...item,flags:{...item.flags,k4lt:{...item.flags?.k4lt,operation:operation.id,initial:!advancement}}})));
    operation.created=created.map(snapshotItem);
    if(remove.length)await actor.deleteEmbeddedDocuments('Item',remove.map(i=>i.id));
    await actor.update({...updates,'flags.k4lt.archetypeHistory':[...history,operation]});
  }catch(error){
    // Compensate a failed multi-document write without touching unrelated items.
    if(created.length)await actor.deleteEmbeddedDocuments('Item',created.map(i=>i.id));
    const missing=removed.filter(i=>!actor.items.get(i._id));
    if(missing.length)await actor.createEmbeddedDocuments('Item',missing,{keepId:true});
    throw error;
  }
}
export async function refundArchetypeOperations(actor, advancement=null, all=false){
  if(busy.has(actor.uuid))return false;
  busy.add(actor.uuid);
  try{return await undoOperations(actor,advancement,all);}
  catch(error){console.error('K4LT refund',error);ui.notifications.error(error.message);return false;}
  finally{busy.delete(actor.uuid);}
}
async function undoOperations(actor, advancement=null, all=false){
  if(!game.user.isGM)return false;
  const history=clone(actor.getFlag('k4lt','archetypeHistory')??[]);
  const targets=history.filter(op=>op.advancement && (all||op.advancement===advancement));
  if(!targets.length)return true;
  const undo=all?targets.reverse():[targets.at(-1)];
  if(!all){
    const state=undo[0].after['system.consciousness'];
    const prefix=state==='enlightened'?'advancementEnlightened':state==='aware'?'advancementAware':null;
    if(prefix&&Object.entries(actor.system).some(([key,value])=>key.startsWith(prefix)&&value?.value>0)){ui.notifications.warn(t('Conflict'));return false;}
  }
  // Preflight all operations on a virtual state; never partially reset after a conflict.
  const virtual=new Map(actor.items.map(i=>[i.id,snapshotItem(i)]));
  const fields={};
  for(const op of undo){
    for(const item of op.created){if(!equal(virtual.get(item._id),item)){ui.notifications.warn(t('Conflict'));return false;}virtual.delete(item._id);}
    for(const item of op.removed){if(virtual.has(item._id)){ui.notifications.warn(t('Conflict'));return false;}virtual.set(item._id,item);}
    for(const [path,value] of Object.entries(op.after)){
      if(path.startsWith('system.advancement'))continue;
      const current=path in fields?fields[path]:foundry.utils.getProperty(actor,path);
      if(!equal(current,value)){ui.notifications.warn(t('Conflict'));return false;}
      fields[path]=op.before[path];
    }
  }
  const metadata=await rules();
  const remaining=new Set([...virtual.values()].map(i=>i.flags?.k4lt?.sourceUuid??i._stats?.compendiumSource));
  if(!validatePrerequisites([...remaining],remaining,metadata)){ui.notifications.warn(t('Prerequisite'));return false;}
  if([...virtual.values()].some(i=>i.flags?.k4lt?.parentSource&&!remaining.has(i.flags.k4lt.parentSource))){ui.notifications.warn(t('Prerequisite'));return false;}
  const originalItems=actor.items.map(snapshotItem);
  const affected=new Set(undo.flatMap(op=>[...op.created,...op.removed].map(i=>i._id)));
  try{
    for(const op of undo){
      if(op.created.length)await actor.deleteEmbeddedDocuments('Item',op.created.map(i=>i._id));
      if(op.removed.length)await actor.createEmbeddedDocuments('Item',op.removed,{keepId:true});
      history.splice(history.findIndex(i=>i.id===op.id),1);
    }
    await actor.update({...fields,'flags.k4lt.archetypeHistory':history});
  }catch(error){
    const extra=actor.items.filter(i=>affected.has(i.id)&&!originalItems.some(old=>old._id===i.id));
    if(extra.length)await actor.deleteEmbeddedDocuments('Item',extra.map(i=>i.id));
    const missing=originalItems.filter(i=>affected.has(i._id)&&!actor.items.get(i._id));
    if(missing.length)await actor.createEmbeddedDocuments('Item',missing,{keepId:true});
    throw error;
  }
  return true;
}
export async function configureFreePool(actor){
  if(!game.user.isGM||actor.system.creationMode!=='free'||busy.has(actor.uuid))return;
  busy.add(actor.uuid);
  try{
    const initialFingerprint=fingerprint(actor);
    const result=await chooseGroups([{type:'advantage',min:5,max:5,open:true,options:[],required:[]}],actor);if(!result)return;
    if(result.selections[0].some(uuid=>(actor.getFlag('k4lt','initialAdvantages')??[]).includes(uuid)))throw Error(t('Duplicate'));
    if(fingerprint(actor)!==initialFingerprint)throw Error(t('Stale'));
    await actor.update({'system.freeAdvantages':result.selections[0]});
  }catch(error){ui.notifications.error(error.message);}finally{busy.delete(actor.uuid);}
}
function attributeForm(state,actor){
  const passiveValues=state==='enlightened'?[3,1,0]:[2,1,0];
  const activeValues=state==='enlightened'?[4,3,2,1,0,-1,-2]:[3,2,1,1,0,-1,-2];
  const validCurrent=(keys,values)=>equal(keys.map(key=>Number(actor.system.attributes[key])).sort((a,b)=>a-b),[...values].sort((a,b)=>a-b));
  const field=(key,kind,values,preserve)=>`<label>${esc(game.i18n.localize('k4lt.attributes.'+key[0].toUpperCase()+key.slice(1)))}<select name="attr.${key}" data-attribute-kind="${kind}"><option value="">—</option>${[...new Set(values)].map(n=>`<option value="${n}" ${preserve&&Number(actor.system.attributes[key])===n?'selected':''}>${n>=0?'+':''}${n}</option>`).join('')}</select></label>`;
  const reserve=values=>{const seen=new Map();return `<div class="k4lt-attribute-reserve">${values.map(value=>{const occurrence=seen.get(value)??0;seen.set(value,occurrence+1);return `<span data-reserve-value="${value}" data-occurrence="${occurrence}" draggable="true" title="${esc(t('DragAttributeValue'))}">${value>=0?'+':''}${value}</span>`;}).join('')}</div>`;};
  const passiveCurrent=validCurrent(passive,passiveValues),activeCurrent=validCurrent(active,activeValues);
  return `<fieldset data-attribute-assignment data-state="${state}"><legend>${esc(t('Attributes'))}</legend><div class="k4lt-attribute-toolbar"><p class="k4lt-attribute-hint">${esc(t('AttributeAllocationHint'))}</p><button type="button" data-random-attributes title="${esc(t('RandomizeAttributes'))}" aria-label="${esc(t('RandomizeAttributes'))}"><i class="fas fa-dice"></i></button></div><div class="k4lt-attribute-assignment"><section data-attribute-status="passive"><strong>${esc(t('PassiveDistribution'))}</strong>${reserve(passiveValues)}${passive.map(key=>field(key,'passive',passiveValues,passiveCurrent)).join('')}</section><section data-attribute-status="active"><strong>${esc(t('ActiveDistribution'))}</strong>${reserve(activeValues)}${active.map(key=>field(key,'active',activeValues,activeCurrent)).join('')}</section></div></fieldset>`;
}
export async function backgroundForm(definition,actor){
  const jobs=definition?.occupations?.length
    ? await Promise.all(definition.occupations.map(resolve)) : await documents('occupations');
  const allLooks=['clothes','face','eyes','body'].some(key=>!definition?.appearance?.[key]?.length)
    ? await documents('appearance') : [];
  const field=(name,label,items)=>{
    const names=[...new Set(items.filter(Boolean).map(item=>item.name))].sort((a,b)=>a.localeCompare(b,game.i18n.lang,{sensitivity:'base'}));
    return `<fieldset class="k4lt-background-choice"><legend>${esc(label)}</legend><label>${esc(t('Suggestions'))}<select data-background-suggestion><option value="">${esc(t('ChooseSuggestion'))}</option>${names.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('')}</select></label><label>${esc(t('CustomValue'))}<input name="${name}"></label></fieldset>`;
  };
  const existingOccupation=actor.items.find(item=>item.type==='occupation');
  const occupationInput=field('occupation',game.i18n.localize('k4lt.collections.Occupation'),jobs);
  let content;
  if(existingOccupation&&occupationCompatibility(existingOccupation,definition,jobs)){
    content=`<fieldset><legend>${esc(game.i18n.localize('k4lt.collections.Occupation'))}</legend><div class="k4lt-creation-existing"><img src="${esc(existingOccupation.img)}" alt=""><span>${esc(existingOccupation.name)}</span></div></fieldset>`;
  }else if(existingOccupation){
    content=`<fieldset class="k4lt-occupation-mismatch" data-occupation-mismatch><legend>${esc(game.i18n.localize('k4lt.collections.Occupation'))}</legend><div class="k4lt-occupation-current"><img src="${esc(existingOccupation.img)}" alt=""><span>${esc(existingOccupation.name)}</span></div><p class="k4lt-occupation-warning"><i class="fas fa-triangle-exclamation"></i><span>${esc(t('OccupationMismatch'))}</span></p><div class="k4lt-occupation-options"><label class="k4lt-occupation-option"><input type="radio" name="occupationMode" value="keep" checked><span>${esc(t('KeepOccupation'))}</span></label><label class="k4lt-occupation-option"><input type="radio" name="occupationMode" value="replace"><span>${esc(t('ReplaceOccupationChoice'))}</span></label></div><div class="k4lt-occupation-replacement" data-occupation-replacement>${occupationInput}</div></fieldset>`;
  }else content=occupationInput;
  for(const key of ['clothes','face','eyes','body']){
    const list=definition?.appearance?.[key]?.length
      ? await Promise.all(definition.appearance[key].map(resolve)) : allLooks.filter(item=>item.system.category===key);
    content+=field('look.'+key,t(key),list);
  }
  if(definition?.state==='enlightened'){
    const links=[...(game.actors?.contents??[]),...(game.journal?.contents??[])].filter(doc=>doc.visible);
    for(const key of ['ally','enemy'])content+=`<label>${esc(t(key==='ally'?'Ally':'Enemy'))}<input name="${key}"></label><label>${esc(t('LinkedDocument'))}<select name="${key}Link"><option value="">—</option>${links.map(doc=>`<option value="${esc(doc.uuid)}">${esc(doc.name)}</option>`).join('')}</select></label>`;
  }
  if(definition?.state==='sleeper')content+=`<fieldset data-distractions><legend>${esc(t('Distractions'))}</legend><p>${esc(t('DistractionsHint'))}</p><div class="k4lt-creation-choices">${sleeperDistractions.map(key=>`<label><input type="checkbox" name="distractionOption" value="${esc(t('DistractionOptions.'+key))}"> <span>${esc(t('DistractionOptions.'+key))}</span></label>`).join('')}</div><label>${esc(t('DistractionOptions.custom'))}<textarea name="distractions"></textarea></label></fieldset>`;
  if(definition?.relations?.length)content+=`<details class="k4lt-suggested-relations"><summary>${esc(t('Relations'))}</summary><p>${esc(t('RelationsHint'))}</p><ul>${definition.relations.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></details>`;
  return content;
}
export async function setupArchetype(actor,item=null,advancement=null){
  if(!actor.isOwner||busy.has(actor.uuid))return;
  busy.add(actor.uuid);
  try{
    const initialFingerprint=fingerprint(actor);
    if(advancement&&!advancementEligible(actor,advancement))throw Error(t('NoPoints'));
    const definition=item?.system, state=definition?.state??'aware';
    const existing=actor.items.filter(i=>i.type==='archetype');
    const remove=[...existing];
    if(advancement&&!game.user.isGM)throw Error(t('GMTransition'));
    if(advancement==='advancementEnlightened24'){
      const confirmed=await foundry.applications.api.DialogV2.confirm({window:{title:t('Review')},content:`<p>${esc(t('EnlightenedChange'))}</p><p>${esc(item.name)}</p>`});
      if(!confirmed)return;
      if(fingerprint(actor)!==initialFingerprint||!advancementEligible(actor,advancement))throw Error(t('Stale'));
      const raw=item.toObject();delete raw._id;
      return await applyOperation(actor,{items:[raw],remove,advancement,updates:{[`system.${advancement}.value`]:actor.system[advancement].value+1,'system.advancementPoints.value':actor.system.advancementPoints.value-1}});
    }
    if(!advancement&&item){
      const mode=await foundry.applications.api.DialogV2.wait({window:{title:t('Title')},content:`<p>${esc(t('ModeInfo'))}</p>`,buttons:[{action:'create',label:t('Create'),disabled:actor.system.creationMode!=='legacy'||Object.entries(actor.system).some(([k,v])=>/^advancement(Sleeper|Aware|Enlightened)/.test(k)&&v?.value>0)},{action:'link',label:t('Link')}],rejectClose:false});
      if(!mode)return;
      if(mode==='link'){
        if(item){
          if(fingerprint(actor)!==initialFingerprint)throw Error(t('Stale'));
          const updates={'system.consciousness':state};
          if(item.system.key&&actor.items.some(i=>i.type==='archetype'&&i.system.key===item.system.key)){
            if(actor.system.consciousness!==state)await applyOperation(actor,{updates});
            return;
          }
          const raw=item.toObject();delete raw._id;await applyOperation(actor,{items:[raw],remove,updates});
        }
        return;
      }
      if(actor.system.creationMode!=='legacy')throw Error(t('Conflict'));
    }else if(!advancement&&actor.system.creationMode!=='legacy'){
      throw Error(t('Conflict'));
    }
    let groups=clone(definition?.groups??[
      {type:'darksecret',min:1,max:0,open:true,options:[],required:[]},
      {type:'disadvantage',min:2,max:2,open:true,options:[],required:[]},
      {type:'advantage',min:3,max:3,open:true,options:[],required:[]},
    ]);
    // A Sleeper has an unknown Dark Secret, but the player does not choose or
    // receive it during character creation. Its fragments are revealed through
    // the first five Sleeper advancements.
    if(!advancement&&state==='sleeper')groups=groups.filter(g=>g.type!=='darksecret');
    if(advancement){
      groups=groups.filter(g=>['advantage','ability','limitation'].includes(g.type));
      if(state==='enlightened')groups.forEach(g=>{if(g.type==='limitation')g.min=g.max=1;});
      const owned=new Set(actor.items.map(sourceOf));
      groups.forEach(g=>{g.options=g.options.filter(uuid=>!owned.has(uuid));g.required=g.required.filter(uuid=>!owned.has(uuid));});
    }
    const extra=(!advancement?attributeForm(state,actor):`<p>${esc(t('Preserve'))}</p>`)+await backgroundForm(definition,actor);
    const selected=await chooseGroups(groups,actor,extra,definition?.key);if(!selected)return;
    if(state==='sleeper'){
      const distractions=[...(selected.distractionOptions??[]),...String(selected.data.distractions??'').split(';')]
        .map(value=>value.trim()).filter(Boolean);
      selected.data.distractions=[...new Set(distractions)].join('; ');
      if(!selected.data.distractions)throw Error(t('InvalidChoices'));
    }
    const uuids=[...new Set(selected.selections.flat())];
    const grants=await configureTraits(uuids,actor);if(!grants)return;
    const updates={};
    if(uuids.includes(BROKEN_DISADVANTAGE_SOURCE)&&(actor.system.stability?.value??0)<4)updates['system.stability.value']=4;
    if(!advancement){
      updates['flags.k4lt.initialAdvantages']=uuids.filter(uuid=>groups.some((g,i)=>g.type==='advantage'&&selected.selections[i].includes(uuid)));
      // Existing traits must participate in the chosen creation set, not silently exceed its limits.
      if(actor.items.some(i=>groups.some(g=>g.type===i.type)&&!uuids.includes(sourceOf(i))))throw Error(t('ExistingTraits'));
    }
    if(!definition){
      const reserve=await chooseGroups([{type:'advantage',min:5,max:5,open:true,options:[],required:[]}],actor);if(!reserve)return;
      if(reserve.selections[0].some(uuid=>uuids.includes(uuid)||actor.items.some(i=>sourceOf(i)===uuid)))throw Error(t('Duplicate'));
      updates['system.freeAdvantages']=reserve.selections[0];
    }
    if(!advancement){
      for(const keys of [passive,active]){
        const values=keys.map(key=>Number(selected.data['attr.'+key]));
        const expected=keys===passive?(state==='enlightened'?[3,1,0]:[2,1,0]):(state==='enlightened'?[4,3,2,1,0,-1,-2]:[3,2,1,1,0,-1,-2]);
        if(!equal([...values].sort((a,b)=>a-b),[...expected].sort((a,b)=>a-b)))throw Error(t('InvalidAttributes'));
        keys.forEach((key,i)=>updates['system.attributes.'+key]=values[i]);
      }
    }
    if(advancement==='advancementAware24'){
      let initial=actor.items.filter(i=>i.type==='advantage'&&(i.flags?.k4lt?.initial||(actor.getFlag('k4lt','initialAdvantages')??[]).includes(sourceOf(i))));
      if(!initial.length){
        const old=actor.items.filter(i=>i.type==='advantage');
        const activateInitialSelection=(event,dialog)=>{
          const root=dialog.element;
          const boxes=[...root.querySelectorAll('input[name="initial"]')];
          const refresh=()=>{
            const state=selectionState(boxes.filter(box=>box.checked).length,3,3);
            for(const box of boxes)box.disabled=state.limitReached&&!box.checked;
            root.querySelector('[data-initial-count]').textContent=state.label;
            root.querySelector('button[data-action="apply"]').disabled=!state.valid;
          };
          boxes.forEach(box=>box.addEventListener('change',refresh));
          refresh();
        };
        const marked=await formDialog(t('UnknownInitial'),`<p>${esc(t('IdentifyInitial'))} <span data-initial-count aria-live="polite">0/3</span></p>${old.map(i=>`<label><input type="checkbox" name="initial" value="${i.id}">${esc(i.name)}</label>`).join('')}`,data=>data.getAll('initial'),activateInitialSelection);if(!marked)return;
        if(marked.length!==3)throw Error(t('InvalidChoices'));
        initial=marked.map(id=>actor.items.get(id));
        updates['flags.k4lt.initialAdvantages']=initial.map(sourceOf);
      }
      const chosen=await formDialog(t('RemoveInitial'),`<select name="id">${initial.map(i=>`<option value="${i.id}">${esc(i.name)}</option>`).join('')}</select>`,data=>data.get('id'));if(!chosen)return;
      remove.push(actor.items.get(chosen));
      const required=definition.groups.find(g=>g.type==='disadvantage')?.required??[];
      for(const uuid of required){
        if(actor.items.some(i=>sourceOf(i)===uuid))continue;
        const old=actor.items.filter(i=>i.type==='disadvantage');
        const replace=await formDialog(t('ReplaceDisadvantage'),`<select name="id">${old.map(i=>`<option value="${i.id}">${esc(i.name)}</option>`).join('')}</select>`,data=>data.get('id'));if(!replace)return;
        remove.push(actor.items.get(replace));
        const raw=(await resolve(uuid)).toObject();delete raw._id;raw.flags??={};raw.flags.k4lt={...raw.flags.k4lt,sourceUuid:uuid};grants.push(raw);
      }
    }
    if(item){const raw=item.toObject();delete raw._id;grants.push(raw);}
    const job=selected.data.occupation?.trim();
    if(job){
      const catalogueOccupation=(await documents('occupations')).find(entry=>normalizedName(entry.name)===normalizedName(job));
      remove.push(...actor.items.filter(i=>i.type==='occupation'));
      grants.push({name:job,type:'occupation',img:catalogueOccupation?.img??'systems/k4lt/assets/suitcase.webp',system:{description:catalogueOccupation?.system.description??''}});
    }
    const looks=clone(actor.system.appearance);
    for(const key of ['clothes','face','eyes','body'])if(selected.data['look.'+key]?.trim())looks[key]=selected.data['look.'+key].trim();
    updates['system.appearance']=looks;
    updates['system.consciousness']=state;
    updates['system.creationMode']=item?'archetype':'free';
    updates['system.archetypeContext']={...clone(actor.system.archetypeContext),...Object.fromEntries(['ally','enemy','distractions'].filter(k=>selected.data[k]).map(k=>[k,selected.data[k]]))};
    for(const key of ['ally','enemy'])if(selected.data[key+'Link']){
      const doc=await fromUuid(selected.data[key+'Link']);
      if(!doc||!['Actor','JournalEntry'].includes(doc.documentName)||!doc.visible)throw Error(t('Missing'));
      updates['system.archetypeContext'][key+'Link']=doc.uuid;
      updates['system.archetypeContext'][key]||=doc.name;
      const relationship=archetypeRelationship(updates['system.archetypeContext'][key],doc,item,key);
      if(relationship&&!actor.items.some(existing=>existing.type==='relationship'&&existing.system.link===doc.uuid&&existing.name===relationship.name))grants.push(relationship);
    }
    if(state==='enlightened'&&(!updates['system.archetypeContext'].ally||!updates['system.archetypeContext'].enemy))throw Error(t('InvalidChoices'));
    if(advancement){
      if((actor.system.advancementPoints.value??0)<1)throw Error(t('NoPoints'));
      updates[`system.${advancement}.value`]=(actor.system[advancement].value??0)+1;
      updates['system.advancementPoints.value']=actor.system.advancementPoints.value-1;
    }
    const approved=await foundry.applications.api.DialogV2.confirm({window:{title:t('Review')},content:`<p>${esc(t('Preserve'))}</p><h3>${esc(t('Gains'))}</h3><ul>${grants.map(i=>`<li>${esc(i.name)}</li>`).join('')}</ul><h3>${esc(t('Replaced'))}</h3><ul>${remove.map(i=>`<li>${esc(i.name)}</li>`).join('')}</ul>${advancement&&state==='enlightened'?`<p>${esc(t('TransitionRule'))}</p>`:''}`});
    if(!approved)return;
    if(fingerprint(actor)!==initialFingerprint)throw Error(t('Stale'));
    if(advancement&&!advancementEligible(actor,advancement))throw Error(t('NoPoints'));
    await applyOperation(actor,{items:grants,remove,updates,advancement});
  }catch(error){console.error('K4LT archetype',error);ui.notifications.error(error.message);}finally{busy.delete(actor.uuid);}
}
export const traitAdvancements=new Set(['advancementAware14','advancementAware22','advancementEnlightened14','advancementEnlightened22']);
export async function buyArchetypeAdvancement(actor,id){
  if(!actor.isOwner||busy.has(actor.uuid))return;
  if(!advancementEligible(actor,id))return;
  if(['advancementSleeper6','advancementAware24','advancementAware31','advancementEnlightened24'].includes(id)){
    if(!game.user.isGM){ui.notifications.warn(t('GMTransition'));return;}
    const state=['advancementAware31','advancementEnlightened24'].includes(id)?'enlightened':'aware';
    const options=(await documents('archetypes')).filter(i=>i.system.state===state&&i.system.key!==actor.items.find(x=>x.type==='archetype')?.system.key);
    const chosen=await formDialog(t('Title'),`<select name="uuid">${options.map(i=>`<option value="${i.uuid}">${esc(i.name)}</option>`).join('')}</select>`,data=>data.get('uuid'));
    if(chosen)await setupArchetype(actor,await resolve(chosen),id);
    return;
  }
  busy.add(actor.uuid);
  try{
    const initialFingerprint=fingerprint(actor);
    const archetype=actor.items.find(i=>i.type==='archetype');
    const kind=id.startsWith('advancementAware')?'advantage':'ability';
    let options=archetype?.system.groups.find(g=>g.type===kind)?.options??actor.system.freeAdvantages??[];
    if(id.endsWith('22'))options=(await documents(packFor[kind])).map(i=>i.uuid);
    if(id==='advancementEnlightened22')options.push(...(await documents('advantages')).map(i=>i.uuid));
    options=options.filter(uuid=>!actor.items.some(i=>sourceOf(i)===uuid));
    if(!options.length)throw Error(t('NoChoices'));
    const chosen=await chooseGroups([{type:kind,min:1,max:1,open:false,options,required:[]}],actor);if(!chosen)return;
    const grants=await configureTraits(chosen.selections[0],actor);if(!grants)return;
    if(!advancementEligible(actor,id))throw Error(t('NoPoints'));
    if(fingerprint(actor)!==initialFingerprint)throw Error(t('Stale'));
    await applyOperation(actor,{items:grants,advancement:id,updates:{[`system.${id}.value`]:actor.system[id].value+1,'system.advancementPoints.value':actor.system.advancementPoints.value-1}});
  }catch(error){ui.notifications.error(error.message);}finally{busy.delete(actor.uuid);}
}
