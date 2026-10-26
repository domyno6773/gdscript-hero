'use strict';
// Separate runner origin. Not a trusted security enforcement boundary against hostile GDScript
// within this origin: GDScript can access window and forge responses via JavaScriptBridge.
(() => {
  const PARENT_ORIGIN = new URL(location.href).origin; // URL origin, iframe DOM origin stays opaque
  const VERSION = 1;
  const session = new URL(location.href).searchParams.get('session');
  if (!session || !/^[0-9a-f-]{36}$/i.test(session)) throw new Error('Invalid session');
  const MAX_OUT = 32000;
  let ready = false;
  let pending = null;
  let stdout = '', stderr = '';
  let phase = 'original_compile';
  let diagnostics = {original_compile:'', instrumentation:'', execution:''};
  const notify = m => window.parent.postMessage({v:VERSION,session,...m},PARENT_ORIGIN);
  // These diagnostic labels are *advisory*, not a security proof. Student GDScript
  // can call JavaScriptBridge from the sandboxed runner origin.
  window.gdhPhase = next => {
    if(pending !== null && Object.hasOwn(diagnostics,next))phase=next;
  };
  const append = (name,text) => {
    if(name === 'stderr'){
      diagnostics[phase]=(diagnostics[phase]+text+'\n').slice(0,MAX_OUT);
      if(phase !== 'instrumentation')stderr=(stderr+text+'\n').slice(0,MAX_OUT);
    }else if(phase !== 'instrumentation'){
      stdout=(stdout+text+'\n').slice(0,MAX_OUT);
    }
  };
  window.gdhReady = () => { ready = true; notify({type:'ready'}); };
  window.gdhResult = raw => {
    if(!pending)return;
    const id=pending;
    pending=null;
    try {
      const reply=JSON.parse(raw);
      if(!reply || typeof reply!=='object')throw new Error('Invalid native reply');
      reply.diagnostics={
        originalCompile:diagnostics.original_compile,
        instrumentation:diagnostics.instrumentation,
        execution:diagnostics.execution
      };
      notify({type:'result',id,stdout,stderr,reply});
    } catch(e) {
      notify({type:'error',message:'Native result parsing failed'});
    }
  };
  window.addEventListener('message', e => {
    if(e.origin !== PARENT_ORIGIN || e.source !== window.parent || !ready || pending !== null)return;
    const m=e.data;
    if(!m || typeof m!=='object' || m.v!==VERSION || m.type!=='run' || m.session!==session ||
       !Number.isSafeInteger(m.id) || m.id<1 || typeof m.code!=='string' || m.code.length>10000 ||
       !Array.isArray(m.inspect) || m.inspect.length>20 ||
       (m.calls !== undefined && (!Array.isArray(m.calls) || m.calls.length>8 ||
          m.calls.some(c=>!c || typeof c.method!=='string' || !/^[A-Za-z_]\w{0,59}$/.test(c.method) ||
            !Array.isArray(c.args) || c.args.length>5 || c.args.some(a=>a!==null&&
              !['number','boolean','string'].includes(typeof a))))) ||
       (m.locals !== undefined && (!Array.isArray(m.locals) || m.locals.length>20 || m.locals.some(x=>typeof x!=='string'||!/^[A-Za-z_]\w{0,59}$/.test(x)))) ||
       (m.emissions !== undefined && (!Array.isArray(m.emissions) || m.emissions.length>6 ||
          m.emissions.some(x=>!x || typeof x.signal!=='string' || !/^[A-Za-z_]\w{0,59}$/.test(x.signal) ||
            !Array.isArray(x.args) || x.args.length>5 ||
            x.args.some(arg=>arg!==null && !['string','number','boolean'].includes(typeof arg))))) ||
       (m.objectCalls !== undefined && (!Array.isArray(m.objectCalls) || m.objectCalls.length>8 ||
          m.objectCalls.some(x=>!x || typeof x.variable!=='string' ||
            !/^[A-Za-z_]\w{0,59}$/.test(x.variable) || typeof x.method!=='string' ||
            !/^[A-Za-z_]\w{0,59}$/.test(x.method) || !Array.isArray(x.args) || x.args.length>5 ||
            !x.set || typeof x.set!=='object' || Array.isArray(x.set)))) ||
       (m.scene !== undefined && (!Number.isSafeInteger(m.scene) || m.scene<0 || m.scene>63)) ||
       (m.actions !== undefined && (!Array.isArray(m.actions) || m.actions.length>7 ||
          m.actions.some(x=>!x||typeof x.node!=='string'|| x.node.length>40 ||
            (x.signal!=='pressed'&&x.signal!=='timeout')))) ||
       m.inspect.some(x=>typeof x!=='string'|| x.length>60))return;
    pending=m.id;
    stdout=''; stderr='';
    phase='original_compile';
    diagnostics={original_compile:'', instrumentation:'', execution:''};
    try { window.gdhReceive(JSON.stringify({id:m.id,code:m.code,inspect:m.inspect,locals:m.locals||[],calls:m.calls||[],emissions:m.emissions||[],objectCalls:m.objectCalls||[],scene:m.scene||0,actions:m.actions||[]})); }
    catch(e) { append('stderr',String(e));window.gdhResult(JSON.stringify({status:'bridge_error'})); }
  });
  if (typeof Engine !== 'function') { notify({type:'error',message:'Export Godot mancante'}); return; }
  const engine=new Engine({canvas:document.getElementById('canvas'),executable:'godot',mainPack:'godot.pck'});
  engine.startGame({
    onPrint: (...args)=>{if(pending!==null)append('stdout',args.join(' '));},
    onPrintError: (...args)=>{if(pending!==null)append('stderr',args.join(' '));}
  }).catch(e=>notify({type:'error',message:String(e).slice(0,180)}));
})();
