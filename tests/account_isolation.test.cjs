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
  weekKey:()=> '2026-W44',dateKey:()=> '2026-10-28',
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
  'updateStatsUI','applyProfileUI','updateQuestsBadge','checkAchievements'])
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
  // Successful real logout must trigger the normal owner change.
  app.switchSaveOwner(user('bob'));
  auth.currentUser=user('bob');
  auth.onAuthStateChanged(u=>app.switchSaveOwner(u));
  auth.supabaseClient.auth.signOut=async()=>({error:null});
  await auth.logout();
  assert.equal(auth.isGuest(),true);
  assert.equal(app._saveOwner,'guest');
  assert.equal(app.state.xp,42,'Logout did not restore the separate guest save');
  auth.supabaseClient=null;
  await assert.rejects(()=>auth.loginWithGoogle(),/solo con Supabase/);
  // La riapertura dello stesso account con bozze divergenti non deve
  // sostituire automaticamente il codice locale con quello del cloud.
  auth.currentUser=user('bob');
  app._saveOwner='user:bob';
  app.state.userCode={1:'print("bozza locale")'};
  app._cloudHydrationPending=true;
  auth._cloudVersion={userId:'bob',revision:2,blocked:false,remote:null};
  const competing={xp:200,userCode:{1:'print("bozza cloud")'},finishedLessons:[1]};
  await app.integrateCloudSave(competing);
  assert.equal(auth._cloudVersion.blocked,true);
  assert.equal(app.state.userCode[1],'print("bozza locale")');
  assert.equal(auth._cloudVersion.remote.userCode[1],'print("bozza cloud")');
  assert.equal(auth.getSyncStatus().kind,'conflict');
  assert.equal(app._cloudHydrationPending,true);

  // Dopo un salvataggio confermato, un refresh su QUESTO dispositivo
  // non deve mostrare un conflitto se soltanto il codice locale e' cambiato.
  const startingSave=app.getSavePayload();
  const knownBase={...deep(startingSave),userCode:{1:'print("base")'}};
  app.saveCloudBaseline(knownBase,7);
  assert.equal(app.getCloudBaseline().revision,7);
  auth._cloudVersion={userId:'bob',revision:7,blocked:false,remote:null};
  app.state.userCode={1:'print("modifica locale non ancora sincronizzata")'};
  await app.integrateCloudSave(knownBase);
  assert.equal(auth._cloudVersion.blocked,false,'Local edit mistaken for a two-device conflict');
  assert.equal(app.state.userCode[1],'print("modifica locale non ancora sincronizzata")',
    'Cloud overwritten an unsynced local edit');
  assert.equal(app._cloudHydrationPending,false,'Valid load remained paused');
  // Due modifiche indipendenti dello stesso codice restano protette.
  auth._cloudVersion={userId:'bob',revision:8,blocked:false,remote:null};
  app.state.userCode={1:'print("locale divergente")'};
  await app.integrateCloudSave({...knownBase,userCode:{1:'print("cloud divergente")'}});
  assert.equal(auth._cloudVersion.blocked,true,'Genuine divergence was overwritten');
  assert.equal(app.state.userCode[1],'print("locale divergente")');
  // "Non ora" non risolve ne' sovrascrive: nasconde soltanto il messaggio,
  // con una scelta persistente per questa revisione di questo account.
  auth.dismissConflictNotice();
  assert.equal(auth.isConflictDismissed(),true);
  assert.equal(auth._cloudVersion.blocked,true);
  assert.equal(auth._cloudVersion.remote.userCode[1],'print("cloud divergente")');
  assert.equal(app.state.userCode[1],'print("locale divergente")');
  auth._cloudVersion={userId:'bob',revision:8,blocked:true,remote:knownBase};
  assert.equal(auth.isConflictDismissed(),true,'Refresh must remember Non ora');
  auth._cloudVersion.revision=9;
  assert.equal(auth.isConflictDismissed(),false,'New cloud revision requires fresh warning');
  // Il vecchio salvataggio generale non deve mai prevalere sullo slot dell'account.
  store.set(app.ownerStorageKey('user:bob'),JSON.stringify({xp:444,userCode:{1:'print("bob")'}}));
  store.set('gdscript_hero_save_v4',JSON.stringify({xp:9999,userCode:{1:'print("altro account")'}}));
  assert.equal(app.ownerStorageKey('user:bob')!=='gdscript_hero_save_v4',true);
  // Importazione ospite: prova di prima registrazione, mai un semplice login.
  const newGuestSave=()=>JSON.parse(store.get(app.ownerStorageKey('guest')));
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  app.state.xp=85;
  app.state.userCode={1:'print("ospite prima registrazione")'};
  app.saveStorage({localOnly:true});
  const firstGuest=deep(newGuestSave());
  assert.equal(firstGuest.xp,85);
  assert.equal(auth.beginGuestOnboarding('google',true),true);
  const createdNow=new Date().toISOString();
  const newGoogle={
    id:'google-first',email:'first@example.test',
    provider:'google',createdAt:createdNow,isGuest:false
  };
  auth.currentUser=newGoogle;
  app.switchSaveOwner(newGoogle);
  auth._cloudVersion={userId:newGoogle.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,85,'Il nuovo utente Google perde i progressi ospite');
  assert.equal(app.state.userCode[1],'print("ospite prima registrazione")');
  assert.equal(app.state.guestOnboardingV1.complete,true);
  assert.equal(app.state.guestOnboardingV1.imported,true);
  assert.equal(auth.readGuestOnboarding(),null,'Il consenso non deve restare riutilizzabile');

  // L'ospite continua a studiare dopo il logout; i nuovi progressi non
  // possono piu' essere aggiunti allo stesso account.
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  app.state.xp=350;
  app.state.userCode={1:'print("studio successivo come ospite")'};
  app.saveStorage({localOnly:true});
  assert.equal(auth.beginGuestOnboarding('google',true),true);
  auth.currentUser=newGoogle;
  app.switchSaveOwner(newGoogle);
  auth._cloudVersion={userId:newGoogle.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,85,'Un secondo accesso ha importato i progressi ospite');
  assert.equal(app.state.userCode[1],'print("ospite prima registrazione")');
  assert.equal(app.state.guestOnboardingV1.imported,true);

  // Account gia' esistente SENZA salvataggio remoto: non conta come nuovo.
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  const oldGoogle={
    id:'google-old',email:'old@example.test',provider:'google',
    createdAt:'2024-01-01T12:00:00Z',isGuest:false
  };
  assert.equal(auth.beginGuestOnboarding('google',true),true);
  auth.currentUser=oldGoogle;
  app.switchSaveOwner(oldGoogle);
  auth._cloudVersion={userId:oldGoogle.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,0,'Account vecchio e vuoto ha importato un ospite');
  assert.equal(app.state.guestOnboardingV1.imported,false);

  // Email: serve la risposta di registrazione con lo STESSO user ID;
  // un altro account non puo' consumare il consenso.
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  assert.equal(auth.beginGuestOnboarding('email',true,'new@example.test'),true);
  auth.completeEmailOnboardingRegistration({
    id:'email-new',created_at:new Date().toISOString()
  });
  const wrongEmail={
    id:'email-wrong',email:'new@example.test',provider:'email',
    createdAt:new Date().toISOString(),isGuest:false
  };
  auth.currentUser=wrongEmail;
  app.switchSaveOwner(wrongEmail);
  auth._cloudVersion={userId:wrongEmail.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,0,'Un account diverso ha ricevuto il salvataggio ospite');

  // Verificare la registrazione email reale confermata.
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  auth.beginGuestOnboarding('email',true,'fresh@example.test');
  const emailCreated=new Date().toISOString();
  auth.completeEmailOnboardingRegistration({id:'email-new',created_at:emailCreated});
  const newEmail={
    id:'email-new',email:'fresh@example.test',provider:'email',
    createdAt:emailCreated,isGuest:false
  };
  auth.currentUser=newEmail;
  app.switchSaveOwner(newEmail);
  auth._cloudVersion={userId:newEmail.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,350,'Prima registrazione email non importa XP');
  assert.equal(app.state.guestOnboardingV1.imported,true);

  // Anche se il nuovo utente rinuncia all'importazione, non puo'
  // ripensarci a un login successivo dopo aver studiato come ospite.
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  auth.beginGuestOnboarding('email',false,'optout@example.test');
  const optoutCreated=new Date().toISOString();
  auth.completeEmailOnboardingRegistration({id:'email-optout',created_at:optoutCreated});
  const optout={
    id:'email-optout',email:'optout@example.test',
    provider:'email',createdAt:optoutCreated,isGuest:false
  };
  auth.currentUser=optout;
  app.switchSaveOwner(optout);
  auth._cloudVersion={userId:optout.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,0);
  assert.equal(app.state.guestOnboardingV1.imported,false);
  app.switchSaveOwner(auth.createGuestUser());
  auth.currentUser=auth.createGuestUser();
  auth.beginGuestOnboarding('email',true,'optout@example.test');
  auth.completeEmailOnboardingRegistration({id:'email-optout',created_at:optoutCreated});
  auth.currentUser=optout;
  app.switchSaveOwner(optout);
  auth._cloudVersion={userId:optout.id,revision:-1,blocked:false,remote:null};
  await app.integrateCloudSave(null);
  assert.equal(app.state.xp,0,'Importazione rifiutata alla registrazione riabilitata');
  assert.equal(newGuestSave().xp,350,'I progressi ospite devono restare separati');

    console.log('PASS: guest, Alice, Bob isolated; pending email and genuine Google OAuth');
})().catch(e=>{console.error(e);process.exitCode=1;});
