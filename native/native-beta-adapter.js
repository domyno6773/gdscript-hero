'use strict';
/*
 * EXPERIMENTAL ADAPTER for the real GDScript Hero code editor.
 *
 * GitHub Pages beta: native mode enabled only by explicit editor checkbox.
 * The original JavaScript verifier is the default (XP and progression kept).
 * Native results never grant XP, unlock a lesson or save account progress.
 * The runner origin is opaque and its returned data is UNTRUSTED.
 */
(() => {
  const verifyMode=true;
  const previewMode=false;
  const RUNNER_URL=new URL('native/isolated.html',document.baseURI);
  const VERSION=1, STARTUP_TIMEOUT=30000, EXECUTION_TIMEOUT=4500, MAX_CODE=10000;
  const element=id=>document.getElementById(id);
  const limit=x=>String(x||'').slice(0,32000);
  const asText=(node,text)=>{node.textContent=limit(text);};
  let frame=null,session=null,generation=0,ready=false,startup=null,startupTimer=null,pending=null,id=0;
  let disposed=false,running=false,fixturePromise=null,validatorPromise=null;
  let previousVerification=null;
  const ui={};
  const stillCurrent=(lessonId,source)=>
    window.App?.state?.currentLessonId===lessonId&&
    element('code-editor')?.value===source;
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
      tag.src=new URL('native/lesson-fixtures.js',document.baseURI).href;
      tag.onload=()=>Array.isArray(window.GDHLessonFixtures) ? resolve(window.GDHLessonFixtures):
        reject(new Error('Dataset lezioni non disponibile'));
      tag.onerror=()=>reject(new Error('Impossibile caricare i metadati delle lezioni'));
      document.head.append(tag);
    }).catch(error=>{fixturePromise=null;throw error;});
    return fixturePromise;
  };
  const loadValidators=()=>{
    if(window.GDHLessonLab?.grade&&window.GDHLessonLab?.scenarios)
      return Promise.resolve(window.GDHLessonLab);
    if(validatorPromise)return validatorPromise;
    const filenames=['lesson-validation.js','lesson-validation-native-scenes.js'];
    const loadScript=filename=>new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=new URL('native/'+filename,document.baseURI).href;
      script.onload=resolve;
      script.onerror=()=>reject(new Error('Validatore non disponibile: '+filename));
      document.head.append(script);
    });
    validatorPromise=loadFixtures().then(async()=>{
      for(const filename of filenames)await loadScript(filename);
      if(!window.GDHLessonLab?.grade)throw new Error('Validatore nativo non inizializzato');
      return window.GDHLessonLab;
    }).catch(error=>{validatorPromise=null;throw error;});
    return validatorPromise;
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
    const url=new URL(RUNNER_URL);
    url.searchParams.set('session',session);
    iframe.src=url.href;
    frame=iframe;
    const promise=new Promise((resolve,reject)=>{startup={resolve,reject,promise:null};});
    startup.promise=promise;
    startupTimer=setTimeout(()=>reset('Avvio Godot scaduto; runner distrutto'),STARTUP_TIMEOUT);
    ui.mount.append(iframe);
    return promise;
  };
  const execute=(code,lesson,step={key:'base',code})=>{
    if(!ready||!frame||pending)return Promise.reject(new Error('Motore non pronto'));
    if(typeof code!=='string'||code.length>MAX_CODE)return Promise.reject(new Error('Codice troppo lungo'));
    const request=++id;
    const args={
      v:VERSION,type:'run',session,id:request,code,
      inspect:lesson.properties||[],
      locals:step.key==='base'
        ? (window.GDHLessonLab?.captureNames?.(lesson.id,code)||lesson.locals||[])
        : [],
      calls:step.key==='base'?(lesson.calls||[]):[],
      emissions:step.key==='base'?(lesson.emissions||[]):[],
      objectCalls:step.key==='base'?(lesson.objectCalls||[]):[],
      scene:lesson.scene||0,
      actions:step.actions||(lesson.actions||[])
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

  const showMainFeedback=(report,lesson,original)=>{
    const output=element('real-output-pre');
    const expected=element('expected-output-pre');
    const badge=element('test-status-badge');
    const results=element('test-results-view');
    const checks=Array.isArray(report.feedback?.checks)?report.feedback.checks:[];
    if(output){
      output.textContent=(original?.stdout||'').trim() ||
        (original?.stderr?('// Errore Godot: '+original.stderr.trim()):
          '// Nessun output stampato a console');
      output.style.color=original?.stderr?'#f87171':'#38bdf8';
    }
    if(expected)expected.textContent=lesson.expectedOutput||'// Nessun output richiesto';
    if(badge){
      badge.textContent='Godot (PROVA): '+report.feedback.verdict+
        ' — nessun XP o progresso';
      badge.style.color=report.feedback.verdict==='accepted'?'#10b981':'#f59e0b';
    }
    if(results){
      results.replaceChildren();
      for(const check of checks){
        const row=document.createElement('div');
        row.className='test-row '+(check.passed?'passed':'failed');
        const symbol=document.createElement('span');
        symbol.className='test-icon';symbol.textContent=check.passed?'✓':'✗';
        const label=document.createElement('span');
        label.className='test-desc';
        label.textContent=String(check.desc||'').slice(0,300);
        row.append(symbol,label);
        if(!check.passed&&check.diff){
          const detail=document.createElement('pre');
          detail.className='test-diff';
          detail.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px';
          detail.textContent=String(check.diff).slice(0,4000);
          row.append(detail);
        }
        results.append(row);
      }
      const notice=document.createElement('p');
      notice.className='test-diff';
      notice.textContent='ANTEPRIMA NATIVA NON CERTIFICATA: nessun XP, sblocco, salvataggio, cloud o diritto Premium.';
      results.prepend(notice);
    }
    const mainArea=element('exercise-primary-feedback');
    if(mainArea)mainArea.dataset.state=
      report.feedback.verdict==='accepted'?'success':'error';
    const title=element('exercise-feedback-title');
    if(title)title.textContent=report.feedback.verdict==='accepted'?
      'Godot: verifiche superate (solo prova)': 'Godot: '+report.feedback.verdict;
    const description=element('exercise-feedback-description');
    if(description)description.textContent=report.feedback.reason ||
      (report.feedback.verdict==='accepted'
        ? 'Codice accettato dal laboratorio nativo. Non vengono assegnati progressi.'
        : checks.find(c=>!c.passed)?.diff || checks.find(c=>!c.passed)?.desc ||
          'Esecuzione non completata.');
    const testCount=element('exercise-test-count');
    if(testCount)testCount.textContent=checks.filter(c=>c.passed).length+
      ' di '+checks.length+' verifiche native — senza XP';
    asText(ui.stdout,original?.stdout||'(nessuna stampa)');
    asText(ui.stderr,original?.stderr||'(nessun errore)');
    asText(ui.details,JSON.stringify({
      lesson:lesson.id,feedback:report.feedback,
      nativeStatus:original?.reply?.status,scene:original?.reply?.scene||{},
      notice:'Risultati locali non attendibili per progressi.'
    },null,2));
    setStatus('Godot: '+report.feedback.verdict+
      ' — prova nel pulsante Verifica, nessun progresso salvato');
  };
  const verifyFromMain=async app=>{
    if(running||disposed||app.isValidating)return;
    if(app.isReviewMode)return; // review variants use legacy JS, unchanged
    const lessonId=Number(app.state?.currentLessonId);
    const source=element('code-editor')?.value;
    const currentLesson=typeof LESSONS_DATA!=='undefined'?
      LESSONS_DATA.find(x=>x.id===lessonId):null;
    if(!currentLesson||typeof source!=='string')return;
    const button=element('btn-run-code');
    running=true;
    app.isValidating=true; // transient UI guard only; no persistent state writes
    if(button)button.disabled=true;
    if(ui.button)ui.button.disabled=true;
    const runLabel=button?.querySelector('.run-text');
    if(runLabel)runLabel.textContent='Godot: verifica in prova…';
    asText(ui.stdout,'');asText(ui.stderr,'');asText(ui.details,'');
    setStatus('Preparazione della verifica nativa senza progressi…');
    let lesson=null;
    try{
      if(source.length>MAX_CODE)throw new Error('Limite di 10000 caratteri');
      const [fixtures,validator]=await Promise.all([loadFixtures(),loadValidators()]);
      lesson=fixtures.find(x=>x.id===lessonId);
      if(!lesson)throw new Error('Metadati nativi mancanti per la lezione');
      const scenarios=validator.scenarios(lessonId,source);
      const steps=[{key:'base',code:source},...scenarios];
      await ensureReady();
      const outputs={};
      for(const step of steps){
        if(!stillCurrent(lessonId,source))
          throw new Error('Il codice o la lezione sono cambiati: risultati ignorati');
        setStatus('Godot: prova '+(Object.keys(outputs).length+1)+'/'+steps.length+'…');
        const r=await execute(step.code,lesson,step);
        outputs[step.key]={reply:r.reply,stdout:r.stdout,stderr:r.stderr};
        if(step.key==='base'&&r.status!=='executed')break;
      }
      if(!stillCurrent(lessonId,source))
        throw new Error('Il codice o la lezione sono cambiati: risultati ignorati');
      const base=outputs.base;
      if(!base)throw new Error('Nessun risultato Godot ricevuto');
      const feedback=validator.grade(lessonId,source,
        base.reply,base.stdout,base.stderr,outputs);
      // The UI never consumes feedback as authorization.
      showMainFeedback({feedback},currentLesson,base);
      return feedback;
    }catch(error){
      if(!stillCurrent(lessonId,source)){
        setStatus('Risultato Godot ignorato: codice o lezione cambiati');
        return {id:lessonId,passed:false,verdict:'inconclusive',demoOnly:true};
      }
      const timeout=/timeout|scadut/i.test(String(error?.message||error));
      const feedback={id:lessonId,passed:false,demoOnly:true,
        verdict:timeout?'timeout':'inconclusive',checks:[],
        reason:String(error?.message||error).slice(0,250)};
      showMainFeedback({feedback},currentLesson,null);
      return feedback;
    }finally{
      running=false;
      app.isValidating=false;
      if(button)button.disabled=false;
      if(ui.button)ui.button.disabled=false;
      if(runLabel)runLabel.textContent='Verifica Codice';
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
    if(previewMode)tools.append(button);
    const nativeFlag=document.createElement('label');
    nativeFlag.id='gdh-native-verify-mode';
    nativeFlag.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 12px;'+
      'font-size:12px;line-height:1.3;cursor:pointer;white-space:normal;'+
      'flex-wrap:wrap;width:100%;box-sizing:border-box';
    const nativeToggle=document.createElement('input');
    nativeToggle.type='checkbox';
    nativeToggle.id='gdh-native-verify-toggle';
    nativeToggle.checked=false;
    const nativeToggleText=document.createElement('span');
    nativeToggleText.textContent=
      ' Godot reale (Beta — senza XP)';
    nativeFlag.append(nativeToggle,nativeToggleText);
    const panelCode=document.querySelector('#view-exercise .panel-code');
    if(verifyMode)panelCode.insertBefore(nativeFlag,panelCode.firstChild);
    panel.style.display='none';
    nativeToggle.addEventListener('change',()=>{
      if(running){nativeToggle.checked=!nativeToggle.checked;return;}
      panel.style.display=nativeToggle.checked?'block':'none';
      if(nativeToggle.checked)setStatus('Godot Beta: verifica senza XP, senza sblocchi né salvataggi.');
    });
    document.querySelector('#view-exercise .panel-code').append(panel);
    Object.assign(ui,{button,status,stdout,stderr,details,mount:mountPoint,nativeToggle});
    if(previewMode)button.addEventListener('click',run);
    if(verifyMode){
      previousVerification=window.App.runAndValidate;
      window.App.runAndValidate=function(...args){
        if(!disposed&&ui.nativeToggle.checked&&!this.isReviewMode)
          return verifyFromMain(this);
        return previousVerification.apply(this,args);
      };
      setStatus('Godot Beta disponibile: attiva la casella vicino a Verifica il codice.');
    }else{
      setStatus('Motore non caricato. Premi il pulsante per avviare solo la diagnostica.');
    }
  };
  window.__GDHNativePreview=Object.freeze({
    get enabled(){return true;},
    get ready(){return ready;},
    get running(){return running;},
    get generation(){return generation;},
    get verificationEnabled(){return verifyMode&&!disposed&&Boolean(ui.nativeToggle?.checked);},
    get mode(){return verifyMode?'verify':'preview';},
    dispose(){
      if(disposed)return;disposed=true;reset('Anteprima disattivata');
      window.removeEventListener('message',onMessage);
      if(previousVerification&&window.App)window.App.runAndValidate=previousVerification;
      ui.button?.remove();element('gdh-native-verify-mode')?.remove();
      element('gdh-native-preview-panel')?.remove();
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
