import {consciousness} from './archetype-workflow.js';
export async function migrateLegacyArchetype(actor){
  if(actor.type!=='pc'||!game.user.isGM||game.users.activeGM?.id!==game.user.id)return;
  if(actor.items.some(i=>i.type==='archetype'))return;
  const occupation=actor.items.find(i=>i.type==='occupation'&&i.system.archetype);
  if(!occupation)return;
  const pack=game.packs.get('k4lt.archetypes');if(!pack)return;
  const key=occupation.system.archetype.toLowerCase().replace(/[^a-z0-9]/g,'');
  const catalogue=await pack.getDocuments();
  const template=catalogue.find(i=>i.system.key===key);
  if(!template&&key!=='other')return;
  const state=consciousness(actor);
  const raw=template?.toObject()??{name:occupation.system.customArchetype||game.i18n.localize('k4lt.archetypes.Other'),type:'archetype',img:'icons/svg/book.svg',system:{key:'custom',state,description:'',groups:[]}};
  delete raw._id;
  raw.flags??={};raw.flags.k4lt={...raw.flags.k4lt,legacyMigration:true};
  // No traits, no attribute changes and no guessed acquisition history.
  const [created]=await actor.createEmbeddedDocuments('Item',[raw]);
  try{
    await actor.update({'system.consciousness':state,'flags.k4lt.legacyArchetype':{occupationId:occupation.id,archetype:occupation.system.archetype,customArchetype:occupation.system.customArchetype}});
    await occupation.update({'system.archetype':'','system.customArchetype':''});
  }catch(error){await actor.deleteEmbeddedDocuments('Item',[created.id]);throw error;}
}
Hooks.once('ready',async()=>{
  if(!game.user.isGM)return;
  for(const actor of game.actors){try{await migrateLegacyArchetype(actor);}catch(error){console.error('K4LT archetype migration',actor.uuid,error);ui.notifications.warn(game.i18n.localize('k4lt.creation.MigrationError'));}}
});
Hooks.on('createActor',(actor,options,userId)=>{
  if(userId===game.user.id) migrateLegacyArchetype(actor).catch(error=>console.error('K4LT archetype migration',error));
});
