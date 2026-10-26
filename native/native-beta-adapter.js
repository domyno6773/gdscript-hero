'use strict';
/*
 * Godot 4.4.1 is the only GDScript execution engine for the public site.
 * Every run takes place in a sandboxed, opaque-origin iframe.
 *
 * IMPORTANT: Browser execution is NOT a trusted authority for XP or entitlements:
 * Godot exposes JavaScriptBridge and a student can forge local runner responses.
 * Existing XP/saves are client-owned, as in the previous implementation.
 * Server-verified competitive rewards / paid access need server-side validation.
 */
(() => {
  const VERSION=1, MAX_CODE=10000, STARTUP_TIMEOUT=30000, EXEC_TIMEOUT=4500;
  const RUNNER_URL=new URL('native/isolated.html',document.baseURI);
  let frame=null,session=null,ready=false,startup=null,pending=null,nextId=0;
  let queue=Promise.resolve(),fixturesPromise=null,validatorsPromise=null,lastStage='';
  const lines=text=>String(text||'').trimEnd().split(/\r?\n/).filter(Boolean);
  const messageOf=err=>String(err?.message||err||'Errore sconosciuto').slice(0,400);

  const reset=reason=>{
    const error=new Error(reason);
    if(pending){const item=pending;pending=null;clearTimeout(item.timer);item.reject(error);}
    if(startup){const item=startup;startup=null;clearTimeout(item.timer);item.reject(error);}
    ready=false;session=null;
    if(frame){frame.remove();frame=null;}
  };
  window.addEventListener('message',event=>{
    if(event.origin!=='null'||!frame||event.source!==frame.contentWindow)return;
    const msg=event.data;
    if(!msg||typeof msg!=='object'||msg.v!==VERSION||msg.session!==session)return;
    if(msg.type==='progress'){lastStage=String(msg.stage||'');return;}
    if(msg.type==='ready'){
      if(startup){const item=startup;startup=null;clearTimeout(item.timer);ready=true;item.resolve();}
      return;
    }
    if(msg.type==='error'){reset('Errore Godot: '+String(msg.message||'runner').slice(0,180));return;}
    if(msg.type!=='result'||!pending||pending.id!==msg.id)return;
    if(typeof msg.stdout!=='string'||typeof msg.stderr!=='string'||
      msg.stdout.length>33000||msg.stderr.length>33000||
      !msg.reply||typeof msg.reply!=='object')return;
    const item=pending;pending=null;clearTimeout(item.timer);
    item.resolve({reply:msg.reply,stdout:msg.stdout,stderr:msg.stderr,status:String(msg.reply.status||'unknown')});
  });
  const start=()=>{
    if(ready)return Promise.resolve();
    if(startup)return startup.promise;
    session=crypto.randomUUID();
    const iframe=document.createElement('iframe');
    iframe.id='gdh-native-runner';
    iframe.title='Motore Godot isolato';
    iframe.setAttribute('sandbox','allow-scripts');
    iframe.referrerPolicy='no-referrer';
    iframe.style.cssText='width:1px;height:1px;border:0;position:absolute;opacity:0;pointer-events:none';
    const url=new URL(RUNNER_URL);
    url.searchParams.set('session',session);
    iframe.src=url.href;
    frame=iframe;
    const promise=new Promise((resolve,reject)=>{
      startup={resolve,reject,promise:null,timer:setTimeout(()=>reset('Avvio Godot scaduto'),STARTUP_TIMEOUT)};
    });
    startup.promise=promise;
    document.body.append(iframe);
    return promise;
  };
  const raw=(code,options={})=>{
    const operation=async()=>{
      lastStage='request';
      if(typeof code!=='string'||code.length>MAX_CODE)throw new Error('Codice troppo lungo: massimo 10000 caratteri');
      await start();
      const id=++nextId;
      const result=new Promise((resolve,reject)=>{
        pending={id,resolve,reject,timer:setTimeout(()=>reset('Esecuzione Godot scaduta'),EXEC_TIMEOUT)};
      });
      frame.contentWindow.postMessage({
        v:VERSION,type:'run',session,id,code,
        inspect:options.inspect||[],locals:options.locals||[],
        calls:options.calls||[],emissions:options.emissions||[],
        objectCalls:options.objectCalls||[],
        scene:options.scene||0,actions:options.actions||[],
        mode:options.mode||'',nodes:options.nodes||[],
        node:options.node||'',signal:options.signal||''
      },'*'); // sandboxed iframe has an opaque origin
      return result;
    };
    const result=queue.then(operation,operation);
    queue=result.catch(()=>{}); // a failed run must not block the next one
    return result;
  };
  const script=url=>new Promise((resolve,reject)=>{
    const tag=document.createElement('script');
    tag.src=new URL('native/'+url,document.baseURI).href;
    tag.onload=resolve;tag.onerror=()=>reject(new Error('Impossibile caricare '+url));
    document.head.append(tag);
  });
  const loadFixtures=()=>{
    if(Array.isArray(window.GDHLessonFixtures))return Promise.resolve(window.GDHLessonFixtures);
    if(!fixturesPromise)fixturesPromise=script('lesson-fixtures.js').then(()=>{
      if(!Array.isArray(window.GDHLessonFixtures))throw Error('Metadati nativi non disponibili');
      return window.GDHLessonFixtures;
    }).catch(err=>{fixturesPromise=null;throw err;});
    return fixturesPromise;
  };
  const loadValidators=()=>{
    if(window.GDHLessonLab?.grade&&window.GDHLessonLab?.scenarios)
      return Promise.resolve(window.GDHLessonLab);
    if(!validatorsPromise)validatorsPromise=loadFixtures()
      .then(()=>script('lesson-validation.js'))
      .then(()=>script('lesson-validation-native-scenes.js'))
      .then(()=>{
        if(!window.GDHLessonLab?.grade)throw Error('Validatore Godot non disponibile');
        return window.GDHLessonLab;
      }).catch(err=>{validatorsPromise=null;throw err;});
    return validatorsPromise;
  };
  const optionsFor=(lesson,source,step={key:'base'})=>({
    inspect:lesson.properties||[],
    locals:step.key==='base'?(window.GDHLessonLab.captureNames(lesson.id,source)||[]):[],
    calls:step.key==='base'?(lesson.calls||[]):[],
    emissions:step.key==='base'?(lesson.emissions||[]):[],
    objectCalls:step.key==='base'?(lesson.objectCalls||[]):[],
    scene:lesson.scene||0,
    actions:step.actions||lesson.actions||[]
  });
  const verifyLesson=async(id,source)=>{
    const [fixtures,validator]=await Promise.all([loadFixtures(),loadValidators()]);
    const lesson=fixtures.find(x=>x.id===id);
    if(!lesson)throw Error('Lezione non disponibile nel motore Godot');
    const steps=[{key:'base',code:source},...validator.scenarios(id,source)];
    const outputs={};
    for(const step of steps){
      const r=await raw(step.code,optionsFor(lesson,step.code,step));
      outputs[step.key]={reply:r.reply,stdout:r.stdout,stderr:r.stderr};
      if(step.key==='base'&&r.status!=='executed')break;
    }
    const base=outputs.base;
    if(!base)throw Error('Godot non ha restituito alcun risultato');
    const feedback=validator.grade(id,source,base.reply,base.stdout,base.stderr,outputs);
    const success=feedback.verdict==='accepted'&&feedback.passed===true;
    const execution={
      success:base.reply?.status==='executed'&&!String(base.stderr||'').trim(),
      code:source,logs:lines(base.stdout),
      error:base.reply?.status==='executed'&&!base.stderr?.trim()?null:
        (base.stderr?.trim()||'Godot non è riuscito a eseguire il codice'),
      nativeStatus:base.reply?.status,
      nativeFeedback:feedback
    };
    return {feedback,execution,original:base,accepted:success};
  };
  // Compatibility result format for Sandbox, Ripasso and Arena. Actual execution
  // is always performed by Godot; no JavaScript transpiler executes student code.
  const rootVariables=source=>[...new Set([...String(source).matchAll(/^var\s+([A-Za-z_]\w*)/gm)]
    .map(m=>m[1]))].slice(0,20);
  const methodsIn=source=>[...new Set([...String(source).matchAll(/^\s*func\s+([A-Za-z_]\w*)\s*\(/gm)]
    .map(m=>m[1]))].filter(x=>x!=='_ready');
  const sourceWithState=(source,values)=>{
    let next=source;
    for(const [name,value] of Object.entries(values)){
      if(!['string','number','boolean'].includes(typeof value))continue;
      const literal=typeof value==='string'?JSON.stringify(value):String(value);
      const escaped=name.replace(/[$()*+.?[\\\]^{|}]/g,'\\$&');
      const pattern=new RegExp('^(var\\s+'+escaped+'\\s*(?::\\s*\\w+)?\\s*(?:=|:=)\\s*)[^\\r\\n#]+','m');
      next=next.replace(pattern,(_,prefix)=>prefix+literal);
    }
    return next;
  };
  // Scene native dedicate alle varianti con nodi; gli oggetti rappresentati qui
  // sono snapshot letti dal vero Godot, non un interprete JavaScript.
  const reviewSceneIds=Object.freeze({
    rev_scene_tree_01:61,rev_ui_button_01:62,rev_timers_01:63
  });
  const snapshotScene=snapshot=>{
    if(!snapshot||typeof snapshot!=='object')return null;
    const read=name=>{
      const node=Object.prototype.hasOwnProperty.call(snapshot,name)?snapshot[name]:null;
      if(!node?.exists)return null;
      return Object.freeze({
        name,type:node.class,text:node.text,
        _is_queued_for_deletion:Boolean(node.queued),
        queued:Boolean(node.queued)
      });
    };
    return Object.freeze({has_node:name=>read(name)!==null,get_node:read});
  };
  const executeCompat=async(source,options={})=>{
    const names=rootVariables(source),methods=methodsIn(source);
    const probes=methods.filter(name=>name.startsWith('__test_')).slice(0,8);
    const locals=[...new Set([...String(source).matchAll(/^\s+var\s+([A-Za-z_]\w*)/gm)].map(m=>m[1]))].slice(0,20);
    const reviewId=options.lesson?.id;
    const sceneId=reviewSceneIds[reviewId]||0;
    const sandboxNodes=Array.isArray(options.sandboxNodes)?options.sandboxNodes:null;
    const nativeNodes=sandboxNodes?sandboxNodes.map(n=>({
      name:String(n.name||''),type:String(n.type||'Node'),
      parent:n.parent==null?null:String(n.parent),
      text:String(n.text||'').slice(0,200)
    })):[];
    const probeOptions={inspect:names,locals,scene:sceneId,calls:probes.map(method=>({method,args:[]})),
      mode:sandboxNodes?'sandbox_start':'',nodes:nativeNodes};
    const r=await raw(source,probeOptions);
    const success=r.status==='executed'&&!String(r.stderr||'').trim();
    const state={...(r.reply?.properties||{}),...(r.reply?.locals||{})};
    const outputs=new Map((r.reply?.methodCalls||[]).filter(x=>x.status==='executed').map(x=>[x.method,x.value]));
    for(const name of methods){
      if(name.startsWith('__test_')){
        if(outputs.has(name))state[name]=async()=>outputs.get(name);
      }else{
        state[name]=async(...args)=>{
          const cleanState=Object.fromEntries(Object.entries(state).filter(([key,value])=>
            names.includes(key)&&['string','number','boolean'].includes(typeof value)));
          const changed=sourceWithState(source,cleanState);
          const run=await raw(changed,{inspect:names,calls:[{method:name,args}]});
          if(run.status!=='executed'||String(run.stderr||'').trim())
            throw Error(run.stderr?.trim()||'Errore nella funzione '+name);
          Object.assign(state,run.reply.properties||{});
          const called=run.reply.methodCalls?.find(x=>x.method===name&&x.status==='executed');
          return called?.value;
        };
      }
    }
    const result={success,code:source,logs:lines(r.stdout),error:success?null:
      (r.stderr.trim()||'Codice non eseguibile in Godot'),scope:state,
      scene:sceneId?snapshotScene(r.reply?.scene):null,native:r.reply};
    if(typeof options.onLog==='function')result.logs.forEach(options.onLog);
    return result;
  };
  const sandboxAction=async(name,signal='pressed')=>{
    const run=await raw('',{mode:'sandbox_action',node:name,signal});
    const success=run.status==='executed'&&!String(run.stderr||'').trim();
    return {success,logs:lines(run.stdout),error:success?null:
      (run.stderr.trim()||String(run.reply?.message||'Azione Godot non riuscita')),
      native:run.reply};
  };
  const adapter=Object.freeze({verifyLesson,execute:executeCompat,sandboxAction,
    runNative:raw,get lastStage(){return lastStage;},get engine(){return 'Godot 4.4.1 WebAssembly';}});
  window.GDHGodot=adapter;
  if(window.GDScriptRuntime)window.GDScriptRuntime.execute=(...args)=>executeCompat(...args);
})();