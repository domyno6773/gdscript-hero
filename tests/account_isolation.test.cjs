'use strict';
// Fase 1: salvataggi isolati, registrazione in attesa email, Google OAuth reale.
// Nessun utente reale o chiamata al database viene effettuata.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=path.join(__dirname,'..');
const store=new Map(),sessionStore=new Map();
const storage=m=>({
  getItem:k=>m.has(k)?m.get(k):null,
  setItem:(k,v)=>m.set(k,String(v)),
  removeItem:k=>m.delete(k)
});
const localStorage=storage(store),sessionStorage=storage(sessionStore);
const SoundFX={enabled:true,volume:.8,setVolume(x){this.volume=x;}};
const win={addEventListener:()=>{},location:{hostname:'example.com',protocol:'https:',origin:'https://example.com',pathname:'/gdscript-hero/'}};
const ProgressionV2={
  normalizeRewards:()=>({}),createRewards:()=>({}),
  levelFromXp:()=>({tier:{level:1}})
};
const ctx={window:win,localStorage,sessionStorage,console,SoundFX,ProgressionV2,
  document:{querySelector:()=>null,getElementById:()=>null},setTimeout,clearTimeout,
  Date,URL,crypto:require('node:crypto').webcrypto};
vm.runInNewContext(fs.readFileSync(path.join(source,'app.js'),'utf8'),ctx,{filename:'app.js'});
vm.runInNewContext(fs.readFileSync(path.join(source,'auth.js'),'utf8'),ctx,{filename:'auth.js'});
const app=win.App,auth=win.AuthManager;
for(const name of ['saveReviewDraft','saveNavigationPosition','ensureUnlockedConsistency',
  'applyTheme','switchView','updateNavSelection','renderRoadmap','renderSidebarDailyQuests',
  'updateStatsUI','applyProfileUI','updateQuestsBadge'])
  app[name]=()=>{};
app._blankUserState=JSON.parse(JSON.stringify(app.state));
app._saveOwner='guest';app._cloudHydrationPending=false;
function user(id){return {id,isGuest:false,name:id,email:id+'@example.test'};}
function deep(v){return JSON.parse(JSON.stringify(v));}
(async()=>{
  app.state.xp=42;app.state.userCode={1:'print("ospite")'};
  app.state.sandbox.projects[0].code='print("sandbox ospite")';
  app.saveStorage({localOnly:true});
  assert.equal(app.initialSaveOwner(),'guest');
  app.switchSaveOwner(user('alice'));
  assert.equal(app.state.xp,0,'Alice inherited guest XP without consent');
  assert.equal(app.state.userCode[1],undefined,'Alice inherited guest code');
  app.state.xp=200;app.state.userCode[1]='print("alice")';
  app.saveStorage({localOnly:true});
  app.switchSaveOwner(user('bob'));
  assert.equal(app.state.xp,0,'Bob inherited Alice XP');
  assert.equal(app.state.userCode[1],undefined,'Bob inherited Alice code');
  app.state.xp=7;app.state.userCode[1]='print("bob")';
  app.saveStorage({localOnly:true});
  app.switchSaveOwner({id:'guest_local',isGuest:true});
  assert.equal(app.state.xp,42,'Guest progress lost on logout');
  assert.equal(app.state.userCode[1],'print("ospite")');
  assert.equal(app.state.sandbox.projects[0].code,'print("sandbox ospite")');
  app.switchSaveOwner(user('alice'));
  assert.equal(app.state.xp,200,'Alice progress lost during account switching');
  assert.equal(app.state.userCode[1],'print("alice")');
  app.switchSaveOwner(user('bob'));
  assert.equal(app.state.xp,7,'Bob progress lost during account switching');
  assert.equal(app.state.userCode[1],'print("bob")');
  assert.equal(deep(JSON.parse(store.get('gdscript_hero_scoped_save_v1:guest'))).xp,42);
  assert.equal(deep(JSON.parse(store.get('gdscript_hero_scoped_save_v1:user:alice'))).xp,200);
  assert.equal(deep(JSON.parse(store.get('gdscript_hero_scoped_save_v1:user:bob'))).xp,7);
  // A pending email does not generate a fake logged-in local session.
  auth.currentUser=auth.createGuestUser();
  win.SupabaseConfig={isConfigured:()=>true};
  auth.supabaseClient={
    auth:{
      signUp:async()=>({data:{user:{id:'pending',created_at:'2026-10-28'},session:null},error:null}),
      signInWithOAuth:async({provider,options})=>({data:{provider,options},error:null}),
      signOut:async()=>({error:{message:'Network offline'}})
    }
  };
  const pending=await auth.registerWithEmail('Eroe','pending@example.test','123456');
  assert.equal(pending.pendingConfirmation,true);
  assert.equal(auth.isGuest(),true);
  assert.equal(localStorage.getItem(auth.SESSION_KEY),null);
  const google=await auth.loginWithGoogle({email:'finta@example.test'});
  assert.equal(google.provider,'google','Google must call the actual provider');
  assert.equal(google.options.redirectTo,'https://example.com/gdscript-hero/');
  auth.currentUser={id:'verified',isGuest:false,email:'verified@example.test'};
  await assert.rejects(()=>auth.logout(),/Disconnessione dal cloud/);
  // Failed remote signout must not pretend the account was disconnected.
  assert.equal(auth.currentUser.id,'verified');
  auth.currentUser=auth.createGuestUser();
  auth.supabaseClient=null;
  await assert.rejects(()=>auth.loginWithGoogle(),/solo con Supabase/);
  console.log('PASS: guest, Alice, Bob isolated; pending email and genuine Google OAuth');
})().catch(e=>{console.error(e);process.exitCode=1;});
