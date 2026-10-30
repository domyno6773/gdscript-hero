'use strict';
/* A local learning assessment, never an XP or competitive authority. */
(() => {
 const root=window;
 const snapshot=(code,nodes)=>JSON.stringify([code,nodes]);
 const isFinal=p=>p&&(p.capstoneVersion||p.name?.startsWith('Gioco finale -')||p.code?.includes('# PROGETTO FINALE:'));
 const probe='\nvar __gdh_final_events: Array = []\nfunc __gdh_final_event(total):\n    __gdh_final_events.append(total)\nfunc __gdh_final_probe():\n    var a = Zaino.new()\n    var b = Zaino.new()\n    a.aggiungi("Prova")\n    var listeners = tesoro_raccolto.get_connections().size()\n    tesoro_raccolto.connect(__gdh_final_event)\n    return [a.oggetti, b.oggetti, listeners]\n';
 async function verify(code,nodes,raw=root.GDHGodot.runNative){
  const checks=[];
  let activeFrame,previousStyle;
  const check=(desc,passed)=>checks.push({desc,passed:!!passed});
  const run=async(code,options)=>{
   const r=await raw(code,options);
   if(r.status!=='executed'||r.stderr?.trim())throw Error(r.stderr?.trim()||'Il motore non ha completato la prova.');
   return r.reply;
  };
  const inventory=r=>r.properties?.zaino?.fields?.oggetti;
  const hp=r=>r.properties?.boss?.hp;
  const collected=r=>r.properties?.monete===1&&JSON.stringify(inventory(r))==='["Moneta"]'&&JSON.stringify(r.properties?.__gdh_final_events)==='[1]'&&r.scene?.PuntiLabel?.text==='Tesori: 1'&&r.scene?.Coin?.exists===false;
  const defeated=r=>hp(r)===0;
  const won=r=>r.scene?.StatoLabel?.text==='Vittoria!';
  try{
   for(const [variant,coinX,bossFirst] of [[1,140,false],[2,220,true]]){
    const scene=JSON.parse(JSON.stringify(nodes));
    const player=scene.find(n=>n.name==='Player'),coin=scene.find(n=>n.name==='Coin');
    if(!player||!coin)throw Error('Mantieni Player e Coin nella scena del laboratorio.');
    // First run uses the student's actual scene; the second changes the input layout.
    if(variant===2){player.position={x:60,y:180};coin.position={x:coinX,y:180};}
    const button=scene.some(n=>n.name==='AttaccaBtn')?'AttaccaBtn':'UsaPozione';
    const start=await run(code+probe,{mode:'sandbox_start',nodes:scene,paused:true,
     inspect:['monete','boss','zaino'],calls:[{method:'__gdh_final_probe',args:[]}]});
    // Like the gameplay lessons, keep physics visible: Chromium throttles
    // animation frames in transparent/offscreen engine iframes.
    if(!activeFrame){
     activeFrame=document.getElementById('gdh-native-runner');
     if(activeFrame){previousStyle=activeFrame.style.cssText;activeFrame.style.cssText='position:fixed;right:12px;bottom:12px;width:min(320px, calc(100vw - 24px));height:180px;border:2px solid #478cbf;z-index:10000;background:#202b37;pointer-events:none';}
    }
    const bagProbe=start.methodCalls?.[0];
    check('Prova '+variant+': la classe aggiunge oggetti e mantiene istanze indipendenti',bagProbe?.status==='executed'&&JSON.stringify(bagProbe.value?.slice(0,2))==='[["Prova"],[]]');
    check('Prova '+variant+': il segnale del tesoro ha un destinatario',bagProbe?.value?.[2]>0);
    const observe=(frames,input=[])=>run('',{mode:'sandbox_observe',frames,input});
    const hit=async()=>{await run('',{mode:'sandbox_action',node:button,signal:'pressed'});return observe(1);};
    const idle=await observe(12),away=await observe(12,['ui_left']);
    check('Prova '+variant+': nessun premio prima del contatto',idle.properties?.monete===0&&JSON.stringify(inventory(idle))==='[]'&&hp(idle)===30&&!won(idle)&&away.properties?.monete===0&&away.scene?.Coin?.exists===true);
    check('Prova '+variant+': movimento da tastiera alla velocità richiesta',Math.abs(idle.scene?.Player?.position?.x-60)<1&&Math.abs(away.scene?.Player?.position?.x-36)<4);
    const up=await observe(12,['ui_up']),down=await observe(12,['ui_down']);
    check('Prova '+variant+': le frecce verticali muovono e tornano alla riga iniziale',Math.abs(up.scene?.Player?.position?.y-156)<4&&Math.abs(down.scene?.Player?.position?.y-180)<4);
    const diagonal=await observe(12,['ui_left','ui_up']);
    const x=diagonal.scene?.Player?.position?.x,y=diagonal.scene?.Player?.position?.y;
    check('Prova '+variant+': la diagonale mantiene la velocità',x<36&&y<180&&Math.abs(Math.hypot(x-36,y-180)-24)<4);
    const restored=await observe(12,['ui_right','ui_down']),stopped=await observe(12);
    check('Prova '+variant+': rilasciare i tasti ferma il corpo',Math.abs(restored.scene?.Player?.position?.x-36)<4&&Math.abs(restored.scene?.Player?.position?.y-180)<4&&Math.abs(stopped.scene?.Player?.position?.x-restored.scene?.Player?.position?.x)<1&&Math.abs(stopped.scene?.Player?.position?.y-restored.scene?.Player?.position?.y)<1);
    const attack=async()=>{
     let state;
     for(const expected of [20,10,0,0]){
      state=await hit();check('Prova '+variant+': il pulsante porta gli HP a '+expected,hp(state)===expected);
     }
     return state;
    };
    if(bossFirst){const s=await attack();check('La vittoria richiede anche il tesoro',defeated(s)&&!won(s));}
    const gathered=await observe(variant===1?65:105,['ui_right']);
    check('Prova '+variant+': raccolta attraverso un contatto fisico reale',collected(gathered));
    if(!bossFirst){check('La vittoria richiede anche il bersaglio a zero',!won(gathered));await attack();}
    const after=await observe(12);
    check('Prova '+variant+': vittoria dopo entrambi gli obiettivi',collected(after)&&defeated(after)&&won(after));
    await observe(30,['ui_left']);
    const again=await observe(30,['ui_right']);
    check('Prova '+variant+': tornare sul tesoro non lo conta due volte',collected(again)&&won(again));
   }
   return {passed:checks.length>0&&checks.every(c=>c.passed),checks};
  }catch(error){
   return {passed:false,checks,error:String(error.message||error)};
  }finally{
   if(activeFrame?.isConnected)activeFrame.style.cssText=previousStyle;
  }
 }
 let running=false;
 function render(){
  const panel=document.getElementById('capstone-assessment');if(!panel)return;
  const p=root.App?.getActiveSandboxProject();panel.hidden=!isFinal(p);
  if(panel.hidden)return;
  const code=document.getElementById('sandbox-code-editor')?.value??p.code;
  const valid=p.finalAssessment?.passed&&p.finalAssessment.snapshot===snapshot(code,p.nodes);
  document.getElementById('capstone-assessment-status').textContent=running?'Verifica in corso: movimento, raccolta, inventario e vittoria…':valid?'Progetto finale verificato.':p.finalAssessment?.passed?'Codice o scena modificati: verifica di nuovo il progetto.':'Verifica finale delle competenze: da superare.';
  document.getElementById('btn-verify-capstone').disabled=running;
 }
 async function assessProject(){
  if(running)return;
  const app=root.App,p=app?.getActiveSandboxProject(),editor=document.getElementById('sandbox-code-editor');
  if(!isFinal(p)||!editor)return;
  running=true;p.code=editor.value;p.updatedAt=new Date().toISOString();app.saveStorage();
  const code=p.code,nodes=JSON.parse(JSON.stringify(p.nodes)),captured=snapshot(code,nodes);
  const status=document.getElementById('capstone-assessment-status'),details=document.getElementById('capstone-assessment-results');
  const disclosure=document.getElementById('capstone-assessment-details');
  disclosure.hidden=true;disclosure.open=false;
  details.replaceChildren();render();status.textContent='Verifica in corso: movimento, raccolta, inventario e vittoria…';
  app.sandboxNativeSession=null;
  if(root.GDHSceneWorkspace)root.GDHSceneWorkspace.stop();else root.GDHGodot.stopPreview();
  const runButton=document.getElementById('btn-sandbox-run');if(runButton)runButton.disabled=true;
  let result;
  try{
   result=await verify(code,nodes);
   if(app.getActiveSandboxProject()!==p||snapshot(editor.value,p.nodes)!==captured){
    result={passed:false,checks:[],error:'Il progetto è cambiato durante la verifica. Avviala di nuovo.'};
   }else{
    p.finalAssessment={passed:result.passed,snapshot:captured,checkedAt:new Date().toISOString(),checks:result.checks,error:result.error||null};
    p.updatedAt=p.finalAssessment.checkedAt;
    app.saveStorage();
   }
  }finally{
   root.GDHGodot.stopPreview();running=false;if(runButton)runButton.disabled=false;render();
  }
  for(const c of result.checks){const li=document.createElement('li');li.textContent=(c.passed?'✓ ':'Da rivedere: ')+c.desc;details.append(li);}
  disclosure.hidden=result.checks.length===0;
  const failed=result.checks.filter(c=>!c.passed).length;
  document.getElementById('capstone-assessment-summary').textContent=failed?failed+' controlli da rivedere':'Tutti i '+result.checks.length+' controlli superati';
  status.textContent=result.error|| (result.passed?'Progetto finale verificato: tutte le prove superate.':'Progetto non ancora verificato: correggi i punti indicati e riprova.');
  return result;
 }
 root.GDHCourseCapstoneVerifier=Object.freeze({verify,snapshot,isFinal,render,assessProject});
 const app=root.App;
 const load=app.loadActiveSandboxProject;
 app.loadActiveSandboxProject=function(...args){const result=load.apply(this,args);render();return result;};
 document.getElementById('btn-verify-capstone')?.addEventListener('click',assessProject);
 document.getElementById('sandbox-code-editor')?.addEventListener('input',()=>{render();document.getElementById('capstone-assessment-results')?.replaceChildren();document.getElementById('capstone-assessment-details').hidden=true;});
 render();
})();
