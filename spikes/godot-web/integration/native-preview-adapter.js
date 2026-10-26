'use strict';
/*
 * EXPERIMENTAL ADAPTER for the real GDScript Hero code editor.
 *
 * Only activates at http://127.0.0.1:18767/?nativeGodotPreview=1 on the spike branch.
 * Separate button; NEVER calls App.runAndValidate, saveStorage, AuthManager or Supabase.
 * The runner origin is opaque and its returned data is UNTRUSTED.
 */
(() => {
  const enabled = location.protocol === 'http:' && location.hostname === '127.0.0.1' &&
    location.port === '18767' && new URL(location.href).searchParams.get('nativeGodotPreview') === '1';
  if (!enabled) return;
  const RUNNER_ORIGIN='http://localhost:18768';
  const VERSION=1, STARTUP_TIMEOUT=30000, EXECUTION_TIMEOUT=4500, MAX_CODE=10000;
  const element=id=>document.getElementById(id);
  const limit=x=>String(x||'').slice(0,32000);
  const asText=(node,text)=>{node.textContent=limit(text);};
  let frame=null,session=null,generation=0,ready=false,startup=null,startupTimer=null,pending=null,id=0;
  let disposed=false,running=false,fixturePromise=null;
  const ui={};
  const setStatus=text=>{if(ui.status)asText(ui.status,text);};
  const cancelTimer=t=>{if(t!==null)clearTimeout(t);};
  const rejectPending=(reason)=>{
    if(pending){const old=pending;pending=null;cancelTimer(old.timer);old.reject(new Error(reason));}
    if(startup){const old=startup;startup=null;cancelTimer(startupTimer);startupTimer=null;old.reject(new Error(reason));}
  };
  const reset=(reason)=>{
    rejectPending(reason);
    ready=false;
    if(frame){frame.remove();frame=null;}
    session=null;
    setStatus(reason);
  };
  const onMessage=event=>{
    if(disposed || event.origin!=='null' || !frame || event.source!==frame.contentWindow)return;
    const msg=event.data;
    if(!msg||typeof msg!=='object'||msg.v!==VERSION||msg.session!==session)return;
    if(msg.type==='ready'){
      if(ready||!startup)return;
      ready=true;const previous=startup;startup=null;
      cancelTimer(startupTimer);startupTimer=null;
      previous.resolve();
      return;
    }
    if(msg.type==='error'){
      reset('Errore dal runner: '+limit(msg.message).slice(0,160));
      return;
    }
    if(msg.type!=='result'||!pending||msg.id!==pending.id)return;
    if(typeof msg.stdout!=='string'||typeof msg.stderr!=='string'||
       msg.stdout.length>33000||msg.stderr.length>33000||
       !msg.reply||typeof msg.reply!=='object')return;
    const previous=pending;pending=null;cancelTimer(previous.timer);
    previous.resolve({status:String(msg.reply.status||'unknown'),
      stdout:msg.stdout,stderr:msg.stderr,reply:msg.reply});
  };
  window.addEventListener('message',onMessage);
  const loadFixtures=()=>{
    if(window.GDHLessonFixtures)return Promise.resolve(window.GDHLessonFixtures);
    if(fixturePromise)return fixturePromise;
    fixturePromise=new Promise((resolve,reject)=>{
      const tag=document.createElement('script');
      tag.src='/spikes/godot-web/host/lesson-fixtures.js';
      tag.onload=()=>Array.isArray(window.GDHLessonFixtures) ? resolve(window.GDHLessonFixtures):
        reject(new Error('Dataset lezioni non disponibile'));
      tag.onerror=()=>reject(new Error('Impossibile caricare i metadati delle lezioni'));
      document.head.append(tag);
    }).catch(error=>{fixturePromise=null;throw error;});
    return fixturePromise;
  };
  const ensureReady=()=>{
    if(disposed)return Promise.reject(new Error('Adattatore disattivato'));
    if(ready)return Promise.resolve();
    if(startup)return startup.promise;
    generation++;
    session=crypto.randomUUID();
    const iframe=document.createElement('iframe');
    iframe.id='gdh-native-preview-runner';
    iframe.title='Godot WebAssembly isolato - solo diagnostica';
    iframe.setAttribute('sandbox','allow-scripts');
    iframe.referrerPolicy='no-referrer';
    iframe.style.cssText='width:1px;height:1px;border:0;position:absolute;opacity:0;pointer-events:none';
    iframe.src=RUNNER_ORIGIN+'/isolated.html?session='+encodeURIComponent(session);
    frame=iframe;
    const promise=new Promise((resolve,reject)=>{startup={resolve,reject,promise:null};});
    startup.promise=promise;
    startupTimer=setTimeout(()=>reset('Avvio Godot scaduto; runner distrutto'),STARTUP_TIMEOUT);
    ui.mount.append(iframe);
    return promise;
  };
  const execute=(code,lesson)=>{
    if(!ready||!frame||pending)return Promise.reject(new Error('Motore non pronto'));
    if(typeof code!=='string'||code.length>MAX_CODE)return Promise.reject(new Error('Codice troppo lungo'));
    const request=++id;
    const args={
      v:VERSION,type:'run',session,id:request,code,
      inspect:lesson.properties||[],locals:lesson.locals||[],
      calls:lesson.calls||[],emissions:lesson.emissions||[],
      objectCalls:lesson.objectCalls||[],scene:lesson.scene||0,
      actions:lesson.actions||[]
    };
    const outcome=new Promise((resolve,reject)=>{
      pending={id:request,resolve,reject,timer:setTimeout(()=>reset('Timeout Godot; runner distrutto'),EXECUTION_TIMEOUT)};
    });
    frame.contentWindow.postMessage(args,'*'); // opaque sandbox requires "*" target origin
    return outcome;
  };
  const render=(result,lessonId)=>{
    const safe=result.reply||{};
    asText(ui.stdout,result.stdout||'(nessuna stampa)');
    asText(ui.stderr,result.stderr||'(nessun errore)');
    const detail={
      lesson:lessonId,nativeStatus:result.status,
      scene:safe.scene||{},properties:safe.properties||{},
      locals:safe.locals||{},methodCalls:safe.methodCalls||[],
      notice:'Dati non fidati: la prova Godot non assegna XP o progressi.'
    };
    asText(ui.details,JSON.stringify(detail,null,2));
    setStatus('Godot: '+result.status+' — esecuzione diagnostica, nessun progresso salvato');
  };
  const run=async()=>{
    if(running||disposed)return;
    if(!window.App||!window.App.state||!element('code-editor')){
      setStatus('Editor principale non disponibile');return;
    }
    if(window.App.isReviewMode){setStatus('Anteprima non disponibile nella modalità ripasso');return;}
    const lessonId=Number(window.App.state.currentLessonId);
    const source=element('code-editor').value;
    if(source.length>MAX_CODE){setStatus('Limite: 10000 caratteri');return;}
    running=true;ui.button.disabled=true;
    asText(ui.stdout,'');asText(ui.stderr,'');asText(ui.details,'');
    setStatus('Caricamento metadati e Godot nativo…');
    try{
      const fixtures=await loadFixtures();
      const lesson=fixtures.find(x=>x.id===lessonId);
      if(!lesson)throw new Error('Lezione senza metadati nativi');
      await ensureReady();
      if(lessonId!==Number(window.App.state.currentLessonId)||source!==element('code-editor').value)
        throw new Error('Codice o lezione modificati: nuova esecuzione richiesta');
      setStatus('Esecuzione nel runner Godot isolato…');
      const result=await execute(source,lesson);
      if(lessonId!==Number(window.App.state.currentLessonId)||source!==element('code-editor').value){
        setStatus('Risultato ignorato: il codice o la lezione sono cambiati');
      }else render(result,lessonId);
    }catch(err){
      setStatus('Diagnostica non completata: '+String(err.message||err).slice(0,200));
    }finally{
      running=false;ui.button.disabled=false;
    }
  };
  const mount=()=>{
    const tools=document.querySelector('#view-exercise .editor-header .editor-tools');
    const editor=element('code-editor');
    if(!tools||!editor)throw new Error('Editor pubblico non trovato');
    const button=document.createElement('button');
    button.id='gdh-native-preview-button';
    button.type='button';
    button.className='btn-tool';
    button.textContent='Prova con Godot (diagnostica)';
    button.title='Solo test locale: nessun XP o completamento assegnato';
    const panel=document.createElement('section');
    panel.id='gdh-native-preview-panel';
    panel.setAttribute('aria-label','Diagnostica Godot sperimentale');
    panel.style.cssText='margin:12px 16px;padding:12px;border:1px solid currentColor;border-radius:8px;';
    const head=document.createElement('strong');
    head.textContent='Motore Godot nativo — anteprima locale, nessun progresso salvato';
    const status=document.createElement('p');status.id='gdh-native-preview-status';status.setAttribute('role','status');
    const stdout=document.createElement('pre');stdout.id='gdh-native-preview-stdout';
    const stderr=document.createElement('pre');stderr.id='gdh-native-preview-stderr';
    const details=document.createElement('pre');details.id='gdh-native-preview-details';
    const mountPoint=document.createElement('div');mountPoint.id='gdh-native-preview-mount';
    for(const pre of [stdout,stderr,details])pre.style.cssText=
      'white-space:pre-wrap;overflow-wrap:anywhere;max-height:220px;overflow:auto;font-size:12px';
    const l1=document.createElement('p');l1.textContent='Console nativa';const l2=document.createElement('p');l2.textContent='Errori';const l3=document.createElement('p');l3.textContent='Dati nativi (non attendibili)';
    panel.append(head,status,l1,stdout,l2,stderr,l3,details,mountPoint);
    tools.append(button);
    document.querySelector('#view-exercise .panel-code').append(panel);
    Object.assign(ui,{button,status,stdout,stderr,details,mount:mountPoint});
    button.addEventListener('click',run);
    setStatus('Motore non caricato. Premi il pulsante per avviare solo la diagnostica.');
  };
  window.__GDHNativePreview=Object.freeze({
    get enabled(){return true;},
    get ready(){return ready;},
    get running(){return running;},
    get generation(){return generation;},
    dispose(){
      if(disposed)return;disposed=true;reset('Anteprima disattivata');
      window.removeEventListener('message',onMessage);
      ui.button?.remove();element('gdh-native-preview-panel')?.remove();
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
