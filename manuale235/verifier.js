/* Verificatore per le attività del manuale (Godot nativo, non interprete JS).
 * Lezioni non coperte restano bloccate e non conferiscono XP.
 */
(() => {
  'use strict';
  const rows=(window.GDHManualCourse||[]);
  const byId=id=>(window.LESSONS_DATA||[]).find(x=>x.id===id);
  const lines=s=>String(s||'').trimEnd().replace(/\r/g,'').split('\n').filter(x=>x.length>0);
  const same=(a,b)=>JSON.stringify(lines(a))===JSON.stringify(lines(b));
  const sortValues=value=>Array.isArray(value)?value.map(sortValues):
    value&&typeof value==='object'?Object.fromEntries(
      Object.keys(value).sort().map(key=>[key,sortValues(value[key])])):value;
  // Confronto semantico dei Dictionary stampati da Godot: l'ordine delle
  // chiavi non deve determinare una bocciatura.
  const dictionaryMatches=(stdout,expected,prefix)=>{
    const data=lines(stdout);
    const expectedCount=prefix===undefined?1:2;
    if(data.length!==expectedCount)return false;
    if(prefix!==undefined&&data[0]!==prefix)return false;
    try{
      const parsed=JSON.parse(data[expectedCount-1]);
      return JSON.stringify(sortValues(parsed))===JSON.stringify(sortValues(expected));
    }catch(_){return false;}
  };
  const scriptOnly=s=>String(s||'').split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
  const inputCall=/OS\.read_string_from_stdin\(\)/g;
  const nativeSource=s=>String(s).replace(inputCall,'String(JavaScriptBridge.eval("window.__gdhManualReadStdin()"))');
  const readInput=()=>window.GDHManualStudio?.inputLines?.()||[];
  const seed=(code,name,value)=>{
    const re=new RegExp('(^[ \\t]*var\\s+'+name+'\\s*(?::\\s*[A-Za-z_]\\w*\\s*)?(?:=|:=)\\s*)[^\\n#]*','m');
    if(!re.test(code))return null;
    return code.replace(re,(_,prefix)=>prefix+JSON.stringify(value));
  };
  const expectedCases={
    27:[{name:'Vento calmo',stdin:['0'],output:'stato = Calmo'},
      {name:'Limite brezze',stdin:['8'],output:'stato = Brezza'},
      {name:'Brezza superiore',stdin:['31'],output:'stato = Brezza'},
      {name:'Vento forte',stdin:['45'],output:'stato = Vento forte'},
      {name:'Limite vento forte',stdin:['63'],output:'stato = Vento forte'},
      {name:'Tempesta',stdin:['64'],output:'stato = Tempesta'}],
    28:[{name:'Addizione',stdin:['12','34','+'],output:'result = 46.0'},
      {name:'Sottrazione',stdin:['20','7','-'],output:'result = 13.0'},
      {name:'Moltiplicazione',stdin:['5','6','*'],output:'result = 30.0'},
      {name:'Divisione non intera',stdin:['7','2','/'],output:'result = 3.5'}],
    29:[{name:'Maggiorenne',stdin:['18','false'],output:'Puoi guardare qualsiasi film'},
      {name:'Minorenne con genitore',stdin:['17','true'],output:'Puoi guardare film classificati PG-13'},
      {name:'Minorenne senza genitore',stdin:['10','false'],output:'Puoi guardare soltanto film classificati G'}],
    30:[{name:'Primavera',seed:'Primavera',output:'Fai un\'escursione'},
      {name:'Estate',seed:'Estate',output:'Vai a nuotare'},
      {name:'Autunno',seed:'Autunno',output:'Raccogli le mele'},
      {name:'Abbreviazione autunno',seed:'Aut.',output:'Raccogli le mele'},
      {name:'Inverno',seed:'Inverno',output:'Vai a sciare'},
      {name:'Stagione sconosciuta',seed:'Altro',output:'Resta a casa'}]
  };
  const baseInputs={27:['45'],28:['12','34','+'],29:['17','true']};
  // Inizializza i valori di esempio per la UI, ma le verifiche eseguono tutte le varianti.
  window.GDHManualExamples=Object.freeze(baseInputs);
  const feedback=(checks,reason='')=>{
    const passed=checks.length>0&&checks.every(c=>c.passed===true);
    return {verdict:passed?'accepted':'requirements_not_met',passed,checks,
      reason:passed?'':(checks.find(x=>!x.passed)?.diff||reason||'La consegna non è stata soddisfatta')};
  };
  const wrap=(run,source,grade)=>{
    const success=run.status==='executed'&&!String(run.stderr||'').trim();
    const execution={success,code:source,logs:lines(run.stdout),error:success?null:
      (String(run.stderr||'Errore nel motore Godot').trim()),nativeStatus:run.status,
      scope:{},nativeFeedback:grade};
    return {feedback:grade,execution,original:run,accepted:grade.passed};
  };
  const unavailable=(id,source)=>{
    const item=byId(id);
    const msg=item?.requiresMultipleFiles?
      'La verifica di questa lezione richiede un progetto Godot con più file .gd. Non è ancora pronta.':
      'Il validatore specifico di questa lezione non è ancora pronto. Nessun progresso viene assegnato.';
    const grade=feedback([{desc:'Verifica didattica disponibile',passed:false,diff:msg}]);
    return {feedback:grade,execution:{success:false,code:source,logs:[],error:msg,nativeFeedback:grade},accepted:false};
  };
  const verify=async(id,source,run)=>{
    const lesson=byId(id),number=lesson?.manualLessonNumber;
    if(!lesson||!number||number<1||number>235)return unavailable(id,source);
    if(lesson.requiresMultipleFiles)return unavailable(id,source);
    const hasStatic=lesson.validationReady&&!expectedCases[number];
    const cases=expectedCases[number]||null;
    if(!hasStatic&&!cases)return unavailable(id,source);
    const sourceOnly=scriptOnly(source);
    if(cases&&number===30&&!/\bmatch\s+season\s*:/.test(sourceOnly)){
      const grade=feedback([{desc:'Usa match sulla stagione come da consegna',passed:false,
        diff:'L’esercizio richiede un match con tutti i casi indicati.'}]);
      return {feedback:grade,execution:{success:false,code:source,logs:[],error:grade.reason,nativeFeedback:grade},accepted:false};
    }
    let checks=[],base=null;
    const testRuns=cases||[{name:'Esecuzione',stdin:readInput()}];
    for(let i=0;i<testRuns.length;i++){
      const testcase=testRuns[i];
      let code=source;
      if(testcase.seed!==undefined)code=seed(source,'season',testcase.seed);
      if(testcase.seeds){
        for(const [key,value] of Object.entries(testcase.seeds)){
          if(code===null)break;
          code=seed(code,key,value);
        }
      }
      if(code===null){
        checks.push({desc:testcase.name,passed:false,diff:'La variabile season deve restare dichiarata nello script.'});
        break;
      }
      const actual=await run(nativeSource(code),{stdin:testcase.stdin||[],
        calls:testcase.calls||[]});
      if(!base)base=actual;
      const ok=actual.status==='executed'&&!String(actual.stderr||'').trim();
      // Le lezioni in cui Godot richiama direttamente le funzioni dello studente
      // controllano il VALORE restituito, non il solo output della console.
      const outputs=Array.isArray(testcase.returns)?testcase.returns:null;
      const observed=actual.reply?.methodCalls;
      const methodMatch=!outputs||(Array.isArray(observed)&&
        observed.length===outputs.length&&
        observed.every((entry,i)=>entry.status==='executed'&&
          entry.value===outputs[i]&&
          entry.method===testcase.calls[i].method));
      const printed=testcase.object!==undefined?
        dictionaryMatches(actual.stdout,testcase.object,testcase.prefix):
        testcase.preserveEmptyLines===true?
          String(actual.stdout||'').replace(/\r/g,'').trimEnd()===
            String(testcase.output||'').replace(/\r/g,'').trimEnd():
          same(actual.stdout,testcase.output||'');
      const matches=ok&&(!cases||printed)&&methodMatch;
      checks.push({desc:testcase.name,passed:matches,diff:matches?null:
        !ok?('Errore Godot: '+(actual.stderr||actual.reply?.message||actual.status)):
        'Risultato previsto:\n'+(testcase.output||JSON.stringify(testcase.object??testcase.returns))+'\nRicevuto:\n'+(testcase.returns?JSON.stringify(observed):actual.stdout)});
      if(!ok||!matches&&cases)break;
    }
    if(hasStatic&&base){
      const executed=base.status==='executed'&&!String(base.stderr||'').trim();
      if(executed){
        const score=await lesson.validate({success:true,code:source,logs:lines(base.stdout),scope:{}});
        if(!Array.isArray(score)||score.length===0)checks.push({desc:'Validazione della consegna',passed:false});
        else checks.push(...score);
      }else checks.push({desc:'Esecuzione Godot',passed:false,
        diff:String(base.stderr||base.reply?.message||base.status)});
    }
    if(typeof lesson.manualSourceCheck==='function'){
      const proof=lesson.manualSourceCheck(source);
      checks.push({desc:'Operazioni richieste dalla consegna',passed:proof===true,
        diff:proof?'':'Il codice non usa le strutture indicate dalla consegna.'});
    }
    const grade=feedback(checks);
    if(base)return wrap(base,source,grade);
    return {feedback:grade,execution:{success:false,code:source,logs:[],error:grade.reason,nativeFeedback:grade},accepted:false};
  };
  const preview=async(id,source,run,stdin)=>{
    const lesson=byId(id);
    if(!lesson||lesson.requiresMultipleFiles)throw Error('Esecuzione multi-file non ancora disponibile');
    const raw=await run(nativeSource(source),{stdin:stdin||[]});
    return {success:raw.status==='executed'&&!String(raw.stderr||'').trim(),
      logs:lines(raw.stdout),error:raw.stderr||raw.reply?.message||'',raw};
  };
  // I quattro esercizi condizionali sono verificati su TUTTI i casi previsti.
  for(let n=27;n<=30;n++){
    const item=(window.LESSONS_DATA||[]).find(x=>x.manualLessonNumber===n);
    if(!item)throw Error('Lezione mancante: '+n);
    item.validationReady=true;
    item.expectedOutput=({
      27:'stato = Vento forte',28:'result = 46.0',
      29:'Puoi guardare film classificati PG-13',30:'Raccogli le mele'
    })[n];
  }
  if(window.GDHManualMigration) {
    window.GDHManualMigration.validated=(window.LESSONS_DATA||[]).filter(l=>l.validationReady).length;
    window.GDHManualMigration.readyForRelease=false;
  }
  window.GDHManualVerifier=Object.freeze({has:id=>Number.isInteger(id)&&id>=10001&&id<=10235,
    verify,preview,nativeSource,expectedCases});
})();
