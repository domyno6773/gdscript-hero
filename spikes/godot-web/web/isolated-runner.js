'use strict';
// Separate runner origin. Not a trusted security enforcement boundary against hostile GDScript
// within this origin: GDScript can access window and forge responses via JavaScriptBridge.
(() => {
  const PARENT_ORIGIN = 'http://127.0.0.1:18767'; // deliberately hard-coded local PoC
  const VERSION = 1;
  const session = new URL(location.href).searchParams.get('session');
  if (!session || !/^[0-9a-f-]{36}$/i.test(session)) throw new Error('Invalid session');
  const MAX_OUT = 32000;
  let ready = false;
  let pending = null;
  let stdout = '', stderr = '';
  const notify = m => window.parent.postMessage({v:VERSION,session,...m},PARENT_ORIGIN);
  const append = (name,text) => {
    if(name === 'stderr') stderr=(stderr+text+'\n').slice(0,MAX_OUT);
    else stdout=(stdout+text+'\n').slice(0,MAX_OUT);
  };
  window.gdhReady = () => { ready = true; notify({type:'ready'}); };
  window.gdhResult = raw => {
    if(!pending)return;
    const id=pending;
    pending=null;
    try {
      const reply=JSON.parse(raw);
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
       m.inspect.some(x=>typeof x!=='string'|| x.length>60))return;
    pending=m.id;
    stdout=''; stderr='';
    try { window.gdhReceive(JSON.stringify({id:m.id,code:m.code,inspect:m.inspect,locals:m.locals||[],calls:m.calls||[]})); }
    catch(e) { append('stderr',String(e));window.gdhResult(JSON.stringify({status:'bridge_error'})); }
  });
  if (typeof Engine !== 'function') { notify({type:'error',message:'Export Godot mancante'}); return; }
  const engine=new Engine({canvas:document.getElementById('canvas'),executable:'godot',mainPack:'godot.pck'});
  engine.startGame({
    onPrint: (...args)=>{if(pending!==null)append('stdout',args.join(' '));},
    onPrintError: (...args)=>{if(pending!==null)append('stderr',args.join(' '));}
  }).catch(e=>notify({type:'error',message:String(e).slice(0,180)}));
})();
