'use strict';
// Demo-only validator. The runner is UNTRUSTED: no XP, saved progress, or entitlements.
(function(root){
 const lessons=root.GDHLessonFixtures||[];
 const get=id=>lessons.find(x=>x.id===id)||null;
 const escape=s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
 const clean=source=>String(source||'').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'""').replace(/#.*$/gm,'');
 const decl=(m,kind,name,suffix='')=>new RegExp('\\b'+kind+'\\s+'+escape(name)+'\\b'+suffix).test(m);
 const pr=(m,name)=>new RegExp('\\bprint\\s*\\(\\s*'+escape(name)+'\\s*\\)').test(m);
 const logs=x=>String(x||'').trimEnd().split(/\r?\n/).filter(Boolean);
 const eq=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
 // Accetta anche print(numero) se numero è dichiarato come intero 1; non accetta var numero = "1".
 const printsNumericOne=m=>{
   if(/\bprint\s*\(\s*1\s*\)/.test(m))return true;
   for(const match of m.matchAll(/\bprint\s*\(\s*([A-Za-z_]\w*)\s*\)/g)){
     const variable=match[1];
     const expression=new RegExp('\\b(?:var|const)\\s+'+escape(variable)+'\\b\\s*(?::\\s*int\\s*)?(?::=|=)\\s*1\\b');
     if(expression.test(m))return true;
   }
   return false;
 };

 // Native repeatability scenarios. We rewrite ONLY the numeric/boolean seed declared in _ready.
 // A missing declaration yields no variant and therefore FAILS the corresponding behavior check.
 const overwriteSeed=(code,name,value)=>{
   const re=new RegExp('(^[ \\t]*var\\s+'+escape(name)+'\\s*(?::\\s*[A-Za-z_]\\w*(?:\\s*\\[\\s*[A-Za-z_]\\w*\\s*\\])?\\s*)?(?:=|:=)\\s*)[^\\r\\n#]*','m');
   return re.test(code) ? code.replace(re,(_m,prefix)=>prefix+value) : null;
 };
 function scenarios(id,src){
   const specs={
     25:[['range4',{__range4:true}]],
     26:[['other_enemies',{nemici:'["Ciclope", "Mago"]'}],['no_enemies',{nemici:'[]'}]],
     27:[['start2',{conto:'2'}],['start0',{conto:'0'}]],
     28:[['two_enemies',{nemici:'["Mago", "Lupo"]'}],['one_enemy',{nemici:'["Mago"]'}]],
     34:[['speed70',{velocita:'70'}]],
     36:[['station_moved',{stazione:'Vector2(151, 170)'}],['position_moved',{posizione:'Vector2(95, 200)'}]],
     17:[['below',{livello:'9'}],['above',{livello:'11'}]],
     18:[['no_key',{ha_chiave:'false'}],['open_door',{porta_chiusa:'false'}]],
     19:[['alive',{punti_vita:'100'}],['negative',{punti_vita:'-5'}]],
     20:[['low_energy',{energia:'20'}],['threshold50',{energia:'50'}],['no_relic',{ha_amuleto:'false'}],
         ['key_instead',{ha_amuleto:'false',ha_chiave:'true'}]]
   };
   return (specs[id]||[]).flatMap(([key,overrides])=>{
     let result=src;
     for(const [name,value] of Object.entries(overrides)){
       if(name==='__replace'){
         if(!result.includes(value[0]))return [];
         result=result.replace(value[0],value[1]);
       }else if(name==='__range4'){
         // Match the actual for-loop header, never a quoted string/comment.
         const header=/^([ \t]*for\s+i\s+in\s+)range\s*\(\s*3\s*\)(\s*:)/m;
         if(!header.test(result))return [];
         result=result.replace(header,'$1range(4)$2');
       }else {
         result=overwriteSeed(result,name,value);
         if(result===null)return [];
       }
     }
     return [{key,code:result}];
   });
 }
 const linesEqual=(out,expected)=>eq(logs(out||''),expected);
 const scenarioOk=(all,key,expected)=>{
   const x=all && all[key];
   return Boolean(x&&x.reply&&x.reply.status==='executed'&&
     !String(x.stderr||'').trim()&&linesEqual(x.stdout,expected));
 };
 const localsArray=(s,name,values)=>Array.isArray(s[name])&&eq(s[name],values);
 const rightPrint=(masked,name,index)=>new RegExp('\\bprint\\s*\\(\\s*'+escape(name)+'\\s*\\[\\s*'+index+'\\s*\\]\\s*\\)').test(masked);
 const pattern=(masked,re)=>re.test(masked);
 // Preserve quoted arguments while omitting standalone comment lines.
 const noCommentLines=source=>String(source||'').split(/\r?\n/).filter(l=>!/^\s*#/.test(l)).join('\n');
 const usesStringMethod=(source,owner,method,arg)=>{
   const re=new RegExp('\\b'+escape(owner)+'\\s*\\.\\s*'+escape(method)+'\\s*\\(\\s*["\\x27]'+escape(arg)+'["\\x27]\\s*\\)');
   return re.test(noCommentLines(source));
 };


 const vec=(v,x,y)=>Boolean(v&&typeof v==='object'&&v.__type==='Vector2'&&v.x===x&&v.y===y);
 const methods=(reply,name,expected)=>{const r=reply?.methodCalls||[];return r.length===expected.length&&r.every((v,i)=>
   v.method===name&&v.status==='executed'&&(expected[i]===null?v.value===null:v.value===expected[i]));};
 const fn=(src,name)=>{
   const lines=noCommentLines(src).split(/\r?\n/),start=lines.findIndex(line=>new RegExp('^\\s*func\\s+'+escape(name)+'\\s*\\(').test(line));
   if(start<0)return '';
   let end=start+1;while(end<lines.length&& !/^\S/.test(lines[end]))end++;
   return lines.slice(start,end).join('\n');
 };
 const exactDict=(o,expect)=>Boolean(o&&typeof o==='object'&&!Array.isArray(o) &&
    Object.keys(o).length===Object.keys(expect).length && Object.entries(expect).every(([k,v])=>o[k]===v));
 const obj=(o,fields)=>Boolean(o&&o.__type==='Object'&&o.fields&&
    Object.entries(fields).every(([k,v])=>o.fields[k]===v));
 const event=(reply,name,count)=>Array.isArray(reply?.signalEmissions)&&
    reply.signalEmissions.some(x=>x.signal===name&&x.status==='emitted'&&x.connections===count);
 const callProbe=(reply,name,values)=>Array.isArray(reply?.objectCalls)&&reply.objectCalls.length===values.length&&
    reply.objectCalls.every((v,i)=>v.variable===name&&v.method==='colpo_caricato'&&v.status==='executed'&&v.value===values[i]);
 const containsIndex=(source,owner,key)=>new RegExp('\\b'+owner+'\\s*\\[\\s*["\\x27]'+key+'["\\x27]\\s*\\]').test(noCommentLines(source));
 const emit=(source,name,arg)=>new RegExp('\\b'+name+'\\s*\\.\\s*emit\\s*\\(\\s*'+arg+'\\s*\\)').test(noCommentLines(source));
 const connect=(source,name,target)=>new RegExp('\\b'+name+'\\s*\\.\\s*connect\\s*\\(\\s*'+target+'\\s*\\)').test(noCommentLines(source));

 // In simple lessons, native stdout plus explicit GDScript syntax is sufficient
 // to avoid injecting a variable-capture instruction into the submitted code.
 // For other solutions, preserve the existing optional capture path.
 const directSourceProof=(id,src)=>{
   // Examine _ready only: declarations or print() statements in never-called
   // functions must not provide evidence for the execution under test.
   const ready=fn(src,'_ready');
   if(!ready)return false;
   const m=clean(ready), raw=noCommentLines(ready);
   // If a source contains extra print sites, do not trust a superficial
   // combination of an unused print(variable) with a hardcoded actual output.
   // Fall back to native local observation rather than accepting it directly.
   const expectedPrints={5:1,6:2,9:2,13:2,17:1,18:1,19:2,20:1,26:1,27:1,28:2}[id];
   if(expectedPrints!==undefined && (m.match(/\bprint\s*\(/g)||[]).length!==expectedPrints)return false;
   const literal=(name,type,value)=>{
     const annotation=type?'(?:\\s*:\\s*'+type+')?':'';
     return new RegExp('\\bvar\\s+'+name+annotation+'\\s*=\\s*["\\x27]'+value+'["\\x27](?=\\s*(?:$|#|;|,))','m').test(raw);
   };
   const number=(name,type,value)=>{
     const annotation=type?'(?:\\s*:\\s*'+type+')?':'';
     return new RegExp('\\bvar\\s+'+name+annotation+'\\s*=\\s*'+value+'(?=\\s*(?:$|#|;|,))','m').test(raw);
   };
   if(id===5)return literal('nome','String','Eroe')&&pr(m,'nome');
   if(id===6)return literal('personaggio','String','Guerriero')&&number('punti_vita','int','100')&&
      pr(m,'personaggio')&&pr(m,'punti_vita');
   if(id===9)return number('velocita','float','4\\.5')&&number('ha_chiave','bool','true')&&
      pr(m,'velocita')&&pr(m,'ha_chiave');
   if(id===13)return /\bvar\s+somma(?:\s*:\s*int)?\s*=\s*(?:10\s*\+\s*5|5\s*\+\s*10)\b/.test(m)&&
      /\bvar\s+prodotto(?:\s*:\s*int)?\s*=\s*(?:5\s*\*\s*2|2\s*\*\s*5)\b/.test(m)&&
      pr(m,'somma')&&pr(m,'prodotto');

   // The seven cases below already have independently executed native behavior
   // scenarios (different inputs). For their short, literal seed declarations,
   // we can avoid injecting a tail into _ready() altogether.
   // Not a general-purpose GDScript parser: anything outside this narrow form
   // falls back to optional local observation and can remain inconclusive.
   const body=ready;
   const seed=(name,pattern)=>{
     const typed='(?:\\s*:\\s*(?:[A-Za-z_]\\w*|Array\\s*\\[\\s*String\\s*\\]))?';
     const re=new RegExp('(?:^|\\n)[ \\t]+var\\s+'+escape(name)+typed+
       '\\s*(?:=|:=)\\s*'+pattern+'[ \\t]*(?=\\n|$|#)','m');
     return re.test(body);
   };
   const quoted=value=>'(?:"'+escape(value)+'"|\\x27'+escape(value)+'\\x27)';
   const array=items=>'\\[\\s*'+items.map(quoted).join('\\s*,\\s*')+'\\s*\\]';
   switch(id){
     case 17:
       return seed('livello','10')&&
         /\bif\s+\(?\s*livello\s*(?:>=\s*10|>\s*9)\s*\)?\s*:/.test(m);
     case 18:
       return seed('ha_chiave','true')&&seed('porta_chiusa','true')&&
         /\bif\b[^\n:]*\band\b[^\n:]*:/.test(m);
     case 19:
       return seed('punti_vita','0')&&
         /\bif\b[^\n]*\bpunti_vita\b[^\n]*:/.test(m)&&/\belse\s*:/.test(m);
     case 20:
       return seed('energia','75')&&seed('ha_amuleto','true')&&
         seed('ha_chiave','false')&&seed('stato_portale',quoted(''))&&
         /\bif\b/.test(m)&&/\belif\b/.test(m)&&/\belse\b/.test(m)&&
         /\bprint\s*\([^)]*\bstato_portale\s*\)/.test(m);
     case 26:
       return seed('nemici',array(['Goblin','Orco','Drago']))&&
         /\bfor\s+nemico\s+in\s+nemici\s*:/.test(m)&&pr(m,'nemico');
     case 27:
       return seed('conto','1')&&
         /\bwhile\s+conto\s*(?:<=\s*3|<\s*4)\s*:/.test(m)&&
         /\bconto\s*\+=\s*1\b/.test(m)&&
         /\bprint\s*\([^)]*\bstr\s*\(\s*conto\s*\)/.test(m);
     case 28:
       return seed('nemici',array(['Slime','Scheletro','Spettro','Boss Drago']))&&
         seed('xp_totali','0')&&
         /\bfor\s+nemico\s+in\s+nemici\s*:/.test(m)&&
         /\bxp_totali\s*\+=\s*25\b/.test(m)&&
         /\bprint\s*\([^)]*\bnemico\s*\)/.test(m)&&
         /\bprint\s*\([^)]*\bxp_totali\s*\)/.test(m);
   }
   return false;
 };
 const captureNames=(id,source)=>{
   const lesson=get(id);
   return lesson ? (directSourceProof(id,source) ? [] : lesson.locals.slice()) : [];
 };

 const check=(arr,desc,p)=>arr.push({desc,passed:Boolean(p)});
 function grade(id,src,reply,stdout,stderr,scenarioResults={}){
   const lesson=get(id);
   if(!lesson)return{id,passed:false,demoOnly:true,error:'Lezione non disponibile'};
   const m=clean(src),lines=logs(stdout),s=reply?.locals||{},list=[];
   const loc=name=>Object.prototype.hasOwnProperty.call(s,name)?s[name]:undefined;
   check(list,'Compilazione ed esecuzione tramite Godot nativo',reply?.status==='executed');
   check(list,'Nessun errore segnalato dal motore Godot',!String(stderr||'').trim());
   if(reply?.status!=='executed'||String(stderr||'').trim()){
     return {id,passed:false,verdict:'invalid_code',checks:list,demoOnly:true,
       nativeStatus:reply?.status,
       reason:'Il codice originale non è eseguibile senza errori nel motore Godot.'};
   }
   const requested=Array.isArray(lesson.locals)&&!directSourceProof(id,src)?lesson.locals:[];
   if(requested.length){
     const captureComplete=reply?.localCapture==='instrumented' &&
       requested.every(name=>Object.prototype.hasOwnProperty.call(s,name));
     if(!captureComplete){
       check(list,'Osservazione locale disponibile e completa',false);
       return {id,passed:false,verdict:'inconclusive',checks:list,demoOnly:true,
         nativeStatus:reply?.status,localCapture:reply?.localCapture,
         localCaptureReason:reply?.localCaptureReason||'values_not_observed',
         reason:'Godot ha eseguito il codice originale senza errori, ma il laboratorio non riesce a osservare tutte le variabili richieste. Non è una prova che il codice sia sbagliato.',
         instrumentationDiagnostics:reply?.diagnostics?.instrumentation||'',
         warning:'Nessun XP o progresso viene assegnato da questa diagnostica.'};
     }
     check(list,'Valori locali rilevati nella funzione _ready',true);
   }
   switch(id){
     case 1:
       check(list,'Stampa Ciao Godot! esatta',eq(lines,['Ciao Godot!']));break;
     case 2:{
       const comments=String(src).split(/\r?\n/).map(x=>x.trim()).filter(x=>/^#\s*\S/.test(x)&&!x.includes('Inserisci il tuo commento e stampa la frase richiesta'));
       const printIndex=String(src).search(/\bprint\s*\(/);
       check(list,'Commento scritto prima del print',comments.some(x=>src.indexOf(x)<printIndex));
       check(list,'Messaggio corretto',eq(lines,['Benvenuto nel gioco']));break;
     }
     case 3:
       check(list,'Stampe in ordine',eq(lines,['Livello','1']));
       check(list,'Numero 1 come argomento numerico, non come String',printsNumericOne(m));break;
     case 4:
       check(list,'Commento # Diagnostica reattori',/^\s*#\s*Diagnostica reattori\s*$/m.test(src));
       check(list,'print con 3 argomenti',/\bprint\s*\(\s*["']Energia:\s*["']\s*,\s*100\s*,\s*["']%["']\s*\)/.test(src));
       check(list,'Console Godot senza spazio aggiunto',eq(lines,['=== AVVIO SISTEMA ===','Sistema: Godot OS','Energia: 100%','=== DIAGNOSTICA COMPLETATA ===']));break;
     case 5:
       check(list,'nome = Eroe',(directSourceProof(id,src)||loc('nome')==='Eroe')&&decl(m,'var','nome'));
       check(list,'Usato print(nome)',pr(m,'nome')&&eq(lines,['Eroe']));break;
     case 6:
       check(list,'personaggio = Guerriero',(directSourceProof(id,src)||loc('personaggio')==='Guerriero')&&decl(m,'var','personaggio'));
       check(list,'punti_vita = 100 numerico',(directSourceProof(id,src)||loc('punti_vita')===100)&&decl(m,'var','punti_vita'));
       check(list,'Le variabili sono stampate',pr(m,'personaggio')&&pr(m,'punti_vita')&&eq(lines,['Guerriero','100']));break;
     case 7:
       check(list,'Valori nome/messaggio',loc('nome')==='Eroe'&&loc('messaggio')==='Giocatore: Eroe');
       check(list,'Concatenazione utilizzata per costruire messaggio',m.split(/\r?\n/).some(l=>/\bvar\s+messaggio\s*=/.test(l)&&/(\+\s*nome\b|\bnome\s*\+)/.test(l)));
       check(list,'Stampata variabile messaggio',pr(m,'messaggio')&&eq(lines,['Giocatore: Eroe']));break;
     case 8:
       check(list,'title con virgolette',loc('title')==='The "Lost" Key');
       check(list,'npc_line con apostrofo',loc('npc_line')==="It's dangerous to go alone!");
       check(list,'door_code è String 0420',loc('door_code')==='0420');
       check(list,'Tre dichiarazioni var', ['title','npc_line','door_code'].every(x=>decl(m,'var',x)));
       check(list,'Righe di output richieste',eq(lines,['Title: The "Lost" Key',"NPC: It's dangerous to go alone!",'Door code: 0420']));break;
     case 9:
       check(list,'velocita float',(directSourceProof(id,src)||loc('velocita')===4.5));
       check(list,'ha_chiave boolean',(directSourceProof(id,src)||loc('ha_chiave')===true));
       check(list,'Output delle variabili',pr(m,'velocita')&&pr(m,'ha_chiave')&&eq(lines,['4.5','true']));break;
     case 10:
       check(list,'vita = 100',loc('vita')===100);
       check(list,'Proprio vita ha : int',decl(m,'var','vita','\\s*:\\s*int\\s*='));
       check(list,'Stampa tramite vita',pr(m,'vita')&&eq(lines,['100']));break;
     case 11:
       check(list,'GRAVITA = 9.8',loc('GRAVITA')===9.8);
       check(list,'Dichiarata con const',decl(m,'const','GRAVITA'));
       check(list,'print(GRAVITA)',pr(m,'GRAVITA')&&eq(lines,['9.8']));break;
     case 12:
       check(list,'MAX_HP costante int = 200',loc('MAX_HP')===200&&decl(m,'const','MAX_HP','\\s*:\\s*int\\s*='));
       check(list,'eroe String',loc('eroe')==='Valerius'&&decl(m,'var','eroe','\\s*:\\s*String\\s*='));
       check(list,'salute int',loc('salute')===150&&decl(m,'var','salute','\\s*:\\s*int\\s*='));
       check(list,'scudo_attivo :=',loc('scudo_attivo')===true&&decl(m,'var','scudo_attivo','\\s*:=')); 
       check(list,'Output scheda',eq(lines,['Eroe: Valerius','HP: 150 / 200','Scudo: true']));break;
     case 13:
       check(list,'somma = 15, calcolata con +',(directSourceProof(id,src)||loc('somma')===15)&&/\bvar\s+somma(?:\s*:\s*int)?\s*=\s*(?:10\s*\+\s*5|5\s*\+\s*10)\b/.test(m));
       check(list,'prodotto = 10, calcolato con *',(directSourceProof(id,src)||loc('prodotto')===10)&&/\bvar\s+prodotto(?:\s*:\s*int)?\s*=\s*(?:5\s*\*\s*2|2\s*\*\s*5)\b/.test(m));
       check(list,'print(somma), print(prodotto) e output separati',pr(m,'somma')&&pr(m,'prodotto')&&eq(lines,['15','10']));
       break;
     case 14:
       check(list,'punti_vita = 80 dopo sottrazione con -=',loc('punti_vita')===80&&/\bpunti_vita\s*-=\s*20\b/.test(m));
       check(list,'Stampa dinamica dei punti_vita',pr(m,'punti_vita')&&eq(lines,['80']));
       break;
     case 15:
       check(list,'Monete iniziali e moltiplicatore corretti',loc('monete_base')===50&&loc('moltiplicatore')===3);
       check(list,'monete_totali = monete_base * moltiplicatore',
         loc('monete_totali')===150&&/\bvar\s+monete_totali\s*=\s*monete_base\s*\*\s*moltiplicatore\b/.test(m));
       check(list,'Stampa della variabile monete_totali',pr(m,'monete_totali')&&eq(lines,['150']));
       break;
     case 16:
       check(list,'Salute ridotta con salute_rimasta -= 35',
         loc('salute_rimasta')===65&&/\bsalute_rimasta\s*-=\s*35\b/.test(m));
       check(list,'Divisione intera Godot 100 / 3 = 33',
         loc('monete_per_membro')===33&&/\bvar\s+monete_per_membro\s*=\s*100\s*\/\s*3\b/.test(m));
       check(list,'Resto tramite 100 % 3 = 1',
         loc('monete_avanzate')===1&&/\bvar\s+monete_avanzate\s*=\s*100\s*%\s*3\b/.test(m));
       check(list,'Report completo Godot',
         eq(lines,['Salute Guerriero: 65','Monete per membro: 33','Monete avanzate: 1']));
       break;
     case 17:
       check(list,'livello iniziale 10',(directSourceProof(id,src)||loc('livello')===10));
       check(list,'Confronto if livello >= 10',/\bif\s+\(?\s*livello\s*(?:>=\s*10|>\s*9)\s*\)?\s*:/.test(m));
       check(list,'Con livello 10 stampa messaggio',eq(lines,['Livello raggiunto!']));
       check(list,'Con livello 9 NON stampa messaggio',scenarioOk(scenarioResults,'below',[]));
       check(list,'Con livello 11 stampa ancora il messaggio',scenarioOk(scenarioResults,'above',['Livello raggiunto!']));
       break;
     case 18:
       check(list,'Due variabili booleane vere',(directSourceProof(id,src)||(loc('ha_chiave')===true&&loc('porta_chiusa')===true)));
       check(list,'Condizione usa if e and',/\bif\b[^\n:]*\band\b[^\n:]*:/.test(m));
       check(list,'Caso iniziale stampa Accesso consentito',eq(lines,['Accesso consentito']));
       check(list,'Nessun accesso senza chiave',scenarioOk(scenarioResults,'no_key',[]));
       check(list,'Nessun accesso con porta non chiusa',scenarioOk(scenarioResults,'open_door',[]));
       break;
     case 19:
       check(list,'punti_vita iniziale 0',(directSourceProof(id,src)||loc('punti_vita')===0));
       check(list,'if su punti_vita e ramo else',/\bif\b[^\n]*punti_vita[^\n]*:/.test(m)&&/\belse\s*:/.test(m));
       check(list,'Game Over quando salute è zero',eq(lines,['Game Over']));
       check(list,'In battaglia quando salute è 100',scenarioOk(scenarioResults,'alive',['In battaglia']));
       check(list,'Game Over anche con salute -5',scenarioOk(scenarioResults,'negative',['Game Over']));
       break;
     case 20:
       check(list,'Configurazione iniziale del portale',
         (directSourceProof(id,src)||(loc('energia')===75&&loc('ha_amuleto')===true&&loc('ha_chiave')===false)));
       check(list,'if / elif / else presenti',/\bif\b/.test(m)&&/\belif\b/.test(m)&&/\belse\b/.test(m));
       check(list,'Portale attivo nello scenario iniziale',
         (directSourceProof(id,src)||loc('stato_portale')==='Portale Attivato')&&eq(lines,['Stato: Portale Attivato']));
       check(list,'Al limite esatto energia 50 il portale apre',scenarioOk(scenarioResults,'threshold50',['Stato: Portale Attivato']));
       check(list,'Energia insufficiente con energia 20',
         scenarioOk(scenarioResults,'low_energy',['Stato: Energia Insufficiente']));
       check(list,'Nessuna reliquia se non ha chiave né amuleto',
         scenarioOk(scenarioResults,'no_relic',['Stato: Nessuna Reliquia Trovata']));
       check(list,'La chiave alternativa apre il portale',
         scenarioOk(scenarioResults,'key_instead',['Stato: Portale Attivato']));
       break;
     case 21:
       check(list,'Inventario composto da Spada, Scudo, Pozione',
         localsArray(s,'inventario',['Spada','Scudo','Pozione']));
       check(list,'Accesso dinamico con inventario[0]',
         rightPrint(m,'inventario',0)&&eq(lines,['Spada']));
       break;
     case 22:
       check(list,'Array oggetti nell’ordine richiesto',
         localsArray(s,'oggetti',['Spada','Scudo','Pozione']));
       check(list,'Accessi dinamici oggetti[1] e oggetti[2]',
         rightPrint(m,'oggetti',1)&&rightPrint(m,'oggetti',2)&&eq(lines,['Scudo','Pozione']));
       break;
     case 23:
       check(list,'Torcia aggiunta a inventario',
         localsArray(s,'inventario',['Mappa','Bussola','Torcia'])&&usesStringMethod(src,'inventario','append','Torcia'));
       check(list,'Dimensione stampata tramite inventario.size()',
         /\bprint\s*\(\s*inventario\s*\.\s*size\s*\(\s*\)\s*\)/.test(m)&&eq(lines,['3']));
       break;
     case 24:
       check(list,'zaino modificato tramite append ed erase',
         localsArray(s,'zaino',['Spada','Pozione di Vita','Arco Elfico'])&&
         usesStringMethod(src,'zaino','append','Arco Elfico')&&usesStringMethod(src,'zaino','erase','Ramo Secco'));
       check(list,'ha_cura è risultato di zaino.has("Pozione di Vita")',
         loc('ha_cura')===true&&/\bvar\s+ha_cura\s*=\s*zaino\s*\.\s*has\s*\(/.test(m)&&
         usesStringMethod(src,'zaino','has','Pozione di Vita'));
       check(list,'totale_slot ottenuto da zaino.size()',
         loc('totale_slot')===3&&/\bvar\s+totale_slot\s*=\s*zaino\s*\.\s*size\s*\(\s*\)/.test(m));
       check(list,'Output finale corretto',eq(lines,[
         'Zaino: ["Spada", "Pozione di Vita", "Arco Elfico"]',
         'Ha pozione: true','Totale slot: 3'
       ]));
       break;

     case 25:
       check(list,'Ciclo for i in range(3) con print(i) nel corpo',/\bfor\s+i\s+in\s+range\s*\(\s*3\s*\)\s*:\s*\n[ \t]+print\s*\(\s*i\s*\)/.test(m));
       check(list,'Output 0, 1, 2',eq(lines,['0','1','2']));
       check(list,'range(4) genera anche il numero 3',scenarioOk(scenarioResults,'range4',['0','1','2','3']));break;
     case 26:
       check(list,'Array nemici iniziale',(directSourceProof(id,src)||localsArray(s,'nemici',['Goblin','Orco','Drago'])));
       check(list,'Iterazione sui nemici e stampa dinamica',
         /\bfor\s+nemico\s+in\s+nemici\s*:\s*\n[ \t]+print\s*\(\s*nemico\s*\)/.test(m));
       check(list,'Stampa di Goblin, Orco e Drago',eq(lines,['Goblin','Orco','Drago']));
       check(list,'Funziona con Ciclope e Mago',scenarioOk(scenarioResults,'other_enemies',['Ciclope','Mago']));
       check(list,'Nessun nemico non produce stampe',scenarioOk(scenarioResults,'no_enemies',[]));break;
     case 27:
       check(list,'while conto <= 3 e aggiornamento conto += 1',
         /\bwhile\s+conto\s*(?:<=\s*3|<\s*4)\s*:/.test(m)&&/\bconto\s*\+=\s*1\b/.test(m));
       check(list,'Valore finale conto = 4',(directSourceProof(id,src)||loc('conto')===4));
       check(list,'Sequenza Conto: 1, 2, 3',eq(lines,['Conto: 1','Conto: 2','Conto: 3']));
       check(list,'Con conto iniziale 2 stampa 2 e 3',scenarioOk(scenarioResults,'start2',['Conto: 2','Conto: 3']));
       check(list,'Con conto iniziale 0 stampa 0,1,2,3',scenarioOk(scenarioResults,'start0',['Conto: 0','Conto: 1','Conto: 2','Conto: 3']));break;
     case 28:
       check(list,'Array iniziale di quattro nemici',
         (directSourceProof(id,src)||localsArray(s,'nemici',['Slime','Scheletro','Spettro','Boss Drago'])));
       check(list,'XP aggiornati con += 25',
         (directSourceProof(id,src)||loc('xp_totali')===100)&&/\bfor\s+nemico\s+in\s+nemici\s*:/.test(m)&&/\bxp_totali\s*\+=\s*25\b/.test(m));
       check(list,'Quattro allerte e XP 100',eq(lines,['Allerta: Slime','Allerta: Scheletro','Allerta: Spettro','Allerta: Boss Drago','XP Totali: 100']));
       check(list,'Solo due nemici generano XP 50',scenarioOk(scenarioResults,'two_enemies',['Allerta: Mago','Allerta: Lupo','XP Totali: 50']));
       check(list,'Un solo nemico genera XP 25',scenarioOk(scenarioResults,'one_enemy',['Allerta: Mago','XP Totali: 25']));break;
     case 29:
       check(list,'Funzione _ready() definita',/\bfunc\s+_ready\s*\(\s*\)\s*:/.test(m));
       check(list,'Messaggio Nodo Inizializzato',eq(lines,['Nodo Inizializzato']));break;
     case 30:
       check(list,'Funzione saluta(nome)',/\bfunc\s+saluta\s*\(\s*nome\s*\)\s*:/.test(m));
       check(list,'_ready invoca saluta("Eroe")',/\bsaluta\s*\(\s*["']Eroe["']\s*\)/.test(noCommentLines(src)));
       check(list,'print usa parametro nome',/\bprint\s*\(\s*["']Ciao\s+["']\s*\+\s*nome\s*\)/.test(fn(src,'saluta')));
       check(list,'Godot chiama la funzione con due nomi diversi',methods(reply,'saluta',[null,null])&&eq(lines,['Ciao Eroe','Ciao Ada','Ciao Viaggiatore']));break;
     case 31:
       check(list,'danno calcolato da calcola_danno(30,5)',
         loc('danno')===25&&/\bvar\s+danno\s*=\s*calcola_danno\s*\(\s*30\s*,\s*5\s*\)/.test(m));
       check(list,'calcola_danno restituisce attacco - difesa',
         /\bfunc\s+calcola_danno\s*\(\s*attacco\s*,\s*difesa\s*\)\s*:/.test(m)&&/\breturn\s+attacco\s*-\s*difesa\b/.test(fn(src,'calcola_danno')));
       check(list,'Output dal valore danno',pr(m,'danno')&&eq(lines,['25']));
       check(list,'Prove parametri 12-7 e 20-9',methods(reply,'calcola_danno',[5,11]));break;
     case 32:
       check(list,'Firma tipizzata della funzione',
         /\bfunc\s+calcola_colpo\s*\(\s*attacco\s*:\s*int\s*,\s*critico\s*:\s*bool\s*\)\s*->\s*int\s*:/.test(m));
       check(list,'Ramificazioni e return sul parametro attacco',
         /\bif\s+critico\s*:/.test(fn(src,'calcola_colpo'))&&
         /\breturn\s+attacco\s*\*\s*2\b/.test(fn(src,'calcola_colpo'))&&
         /\breturn\s+attacco\b/.test(fn(src,'calcola_colpo')));
       check(list,'Normale 30, critico 60',
         loc('normale')===30&&loc('critico')===60&&
         eq(lines,['Colpo normale: 30','Colpo critico: 60']));
       check(list,'Prove native con 7/12 e critico',
         methods(reply,'calcola_colpo',[7,14,24]));break;
     case 33:
       check(list,'Vero Vector2(100,200)',vec(loc('posizione'),100,200)&&
         /\bvar\s+posizione\s*(?::\s*Vector2\s*)?=\s*Vector2\s*\(\s*100\s*,\s*200\s*\)/.test(m));
       check(list,'Stampa della variabile posizione',
         pr(m,'posizione')&&eq(lines,['(100.0, 200.0)']));break;
     case 34:
       check(list,'posizione finale Vector2(150,200)',vec(loc('posizione'),150,200));
       check(list,'velocita e aggiornamento posizione.x',
         loc('velocita')===50&&/\bposizione\s*\.\s*x\s*\+=\s*velocita\b/.test(m));
       check(list,'Output vettore finale',pr(m,'posizione')&&eq(lines,['(150.0, 200.0)']));
       check(list,'Con velocita 70 ottiene (170,200)',
         scenarioOk(scenarioResults,'speed70',['(170.0, 200.0)']));break;
     case 35:
       check(list,'pos finale Vector2(120,180)',vec(loc('pos'),120,180));
       check(list,'Incrementi sugli assi x ed y',
         /\bpos\s*\.\s*x\s*\+=\s*20\b/.test(m)&&/\bpos\s*\.\s*y\s*-=\s*20\b/.test(m));
       check(list,'Stampa pos',pr(m,'pos')&&eq(lines,['(120.0, 180.0)']));break;
     case 36:
       check(list,'posizione/stazione corrette e atterrato=true',
         vec(loc('posizione'),150,170)&&vec(loc('stazione'),150,170)&&loc('atterrato')===true);
       check(list,'Incrementi di posizione corretti',
         /\bposizione\s*\.\s*x\s*\+=\s*50\b/.test(m)&&/\bposizione\s*\.\s*y\s*-=\s*30\b/.test(m));
       check(list,'Confronto dinamico degli assi con and',
         /\bvar\s+atterrato\b/.test(m)&&/\bposizione\s*\.\s*x\s*==\s*stazione\s*\.\s*x\b/.test(m)&&
         /\bposizione\s*\.\s*y\s*==\s*stazione\s*\.\s*y\b/.test(m)&&/\band\b/.test(m));
       check(list,'Output radar corretto',
         eq(lines,['Posizione finale: (150.0, 170.0)','Stazione raggiunta: true']));
       check(list,'Spostamento stazione impedisce atterraggio',
         scenarioOk(scenarioResults,'station_moved',['Posizione finale: (150.0, 170.0)','Stazione raggiunta: false']));
       check(list,'Spostamento posizione produce coordinate diverse',
         scenarioOk(scenarioResults,'position_moved',['Posizione finale: (145.0, 170.0)','Stazione raggiunta: false']));break;

     case 37:
       check(list,'Dizionario eroe con classe e livello corretti',
         exactDict(loc('eroe'),{classe:'Guerriero',livello:10}));
       check(list,'Accesso tramite le chiavi classe e livello',
         containsIndex(src,'eroe','classe')&&containsIndex(src,'eroe','livello'));
       check(list,'Output del dizionario',eq(lines,['Classe: Guerriero','Livello: 10']));break;
     case 38:
       check(list,'Equipaggiamento finale coerente',
         exactDict(loc('equip'),{arma:'Spada Laser',armatura:'Scudo'}));
       check(list,'Assegnazioni tramite le chiavi del dizionario',
         /\bequip\s*\[\s*["']armatura["']\s*\]\s*=/.test(src)&&
         /\bequip\s*\[\s*["']arma["']\s*\]\s*=/.test(src));
       check(list,'Output arma e armatura',
         eq(lines,['Arma: Spada Laser','Armatura: Scudo']));break;
     case 39:
       check(list,'Forziere con oro e gemme',
         exactDict(loc('forziere'),{oro:100,gemme:3}));
       check(list,'Valori booleani ha_oro e ha_chiave',
         loc('ha_oro')===true&&loc('ha_chiave')===false);
       check(list,'Entrambe le variabili calcolate tramite forziere.has',
         /\bvar\s+ha_oro\s*=\s*forziere\.has\s*\(\s*["']oro["']\s*\)/.test(src)&&
         /\bvar\s+ha_chiave\s*=\s*forziere\.has\s*\(\s*["']chiave["']\s*\)/.test(src));
       check(list,'Output delle due condizioni',eq(lines,['Possiede oro: true','Possiede chiave: false']));break;
     case 40:
       check(list,'Boss finale coerente',
         exactDict(loc('boss'),{nome:'Drago Antico',hp:420,attacco:75}));
       check(list,'Modifiche esplicite a boss.hp e boss.attacco',
         /\bboss\s*\[\s*["']hp["']\s*\]\s*=\s*420\b/.test(src)&&
         /\bboss\s*\[\s*["']attacco["']\s*\]\s*=\s*75\b/.test(src));
       check(list,'in_furia dipende da boss.has("furia")',
         loc('in_furia')===false&&/\bvar\s+in_furia\s*=\s*boss\.has\s*\(\s*["']furia["']\s*\)/.test(src));
       check(list,'Output del boss',eq(lines,['Boss: Drago Antico','HP rimanenti: 420','Attacco: 75','Furia attiva: false']));break;
     case 41:
       check(list,'Segnale porta_aperta dichiarato',
         /^\s*signal\s+porta_aperta\s*$/m.test(m)&&event(reply,'porta_aperta',1));
       check(list,'Connesso a quando_aperta e inviato da _ready',
         connect(src,'porta_aperta','quando_aperta')&&emit(src,'porta_aperta',''));
       check(list,'Emissione aggiuntiva chiama ancora il callback',
         eq(lines,['Apertura in corso...','Porta aperta con successo!','Porta aperta con successo!']));break;
     case 42:
       check(list,'Segnale moneta_raccolta definito e connesso',
         /^\s*signal\s+moneta_raccolta\s*$/m.test(m)&&event(reply,'moneta_raccolta',1));
       check(list,'connect(aggiungi_punti) ed emit()',
         connect(src,'moneta_raccolta','aggiungi_punti')&&emit(src,'moneta_raccolta',''));
       check(list,'Callback richiamato due volte, anche dal test',
         eq(lines,['+10 Monete raccolte!','+10 Monete raccolte!']));break;
     case 43:
       check(list,'Segnale danno_inflitto(valore) definito',
         /^\s*signal\s+danno_inflitto\s*\(\s*valore\s*\)/m.test(m)&&event(reply,'danno_inflitto',1));
       check(list,'Emette 35 ed è connesso a on_danno',
         connect(src,'danno_inflitto','on_danno')&&emit(src,'danno_inflitto','35'));
       check(list,'Callback gestisce sia 35 sia 71',
         eq(lines,['Danno registrato: 35','Danno registrato: 71.0']));break;
     case 44:
       check(list,'Segnale salute_aggiornata(nuova_salute)',
         /^\s*signal\s+salute_aggiornata\s*\(\s*nuova_salute\s*\)/m.test(m)&&event(reply,'salute_aggiornata',1));
       check(list,'Funzione quando_salute_cambia(hp) registra il parametro',
         /\bfunc\s+quando_salute_cambia\s*\(\s*hp\s*\)\s*:/.test(m)&&
         /\bprint\s*\(\s*["']UI: Barra salute a\s*["']\s*,\s*hp\s*\)/.test(fn(src,'quando_salute_cambia')));
       check(list,'Connessione ed emissioni 75, 40',
         connect(src,'salute_aggiornata','quando_salute_cambia')&&
         emit(src,'salute_aggiornata','75')&&emit(src,'salute_aggiornata','40'));
       check(list,'Eventi native 75, 40 e test 11',
         eq(lines,['UI: Barra salute a 75','UI: Barra salute a 40',
           '=== EVENTI BATTAGLIA COMPLETATI ===','UI: Barra salute a 11.0']));break;
     case 45:
       check(list,'Istanza Pozione con proprietà corrette',
         obj(loc('elisir'),{nome:'Elisir',cura:50}));
       check(list,'Classe Pozione e costruttore _init(n,c)',
         /\bclass\s+Pozione\s*:/.test(m)&&/\bfunc\s+_init\s*\(\s*n\s*,\s*c\s*\)/.test(m)&&
         /\bself\.nome\s*=\s*n\b/.test(m)&&/\bself\.cura\s*=\s*c\b/.test(m));
       check(list,'Crea istanza attraverso Pozione.new',
         /\bvar\s+elisir\s*=\s*Pozione\.new\s*\(/.test(m));
       check(list,'Output della pozione',
         eq(lines,['Pozione creata: Elisir (Cura: 50)']));break;
     case 46:
       check(list,'Due istanze Guerriero indipendenti',
         obj(loc('g1'),{nome:'Arthur',hp:100})&&obj(loc('g2'),{nome:'Lancelot',hp:90}));
       check(list,'Entrambe le istanze create con Guerriero.new',
         /\bvar\s+g1\s*=\s*Guerriero\.new\s*\(/.test(m)&&
         /\bvar\s+g2\s*=\s*Guerriero\.new\s*\(/.test(m));
       check(list,'Output dei due eroi',
         eq(lines,['Eroe 1: Arthur (HP: 100)','Eroe 2: Lancelot (HP: 90)']));break;
     case 47:
       check(list,'Personaggio Eroe con attacco 25',
         obj(loc('eroe'),{nome:'Eroe',attacco:25}));
       check(list,'Funzione colpo_caricato restituisce self.attacco * 2',
         /\bfunc\s+colpo_caricato\s*\(\s*\)/.test(m)&&
         /\breturn\s+self\.attacco\s*\*\s*2\b/.test(m));
       check(list,'Colpo iniziale 50',eq(lines,['Danno colpo caricato: 50']));
       check(list,'Prove native con attacco 7 e 31 producono 14 e 62',
         callProbe(reply,'eroe',[14,62]));break;
     case 48:
       check(list,'Due Avventurieri con campi coerenti',
         obj(loc('membro1'),{nome:'Aria',ruolo:'Maga',vita:80})&&
         obj(loc('membro2'),{nome:'Krag',ruolo:'Guerriero',vita:120}));
       check(list,'Classe Avventuriero con costruttore e campi',
         /\bclass\s+Avventuriero\s*:/.test(m)&&
         /\bfunc\s+_init\s*\(\s*n\s*,\s*r\s*,\s*v\s*\)/.test(m)&&
         /\bself\.nome\s*=\s*n\b/.test(m)&&/\bself\.ruolo\s*=\s*r\b/.test(m)&&
         /\bself\.vita\s*=\s*v\b/.test(m));
       check(list,'vita_totale calcolata dalla somma dei membri',
         loc('vita_totale')===200&&
         /\bvar\s+vita_totale\s*=\s*membro1\.vita\s*\+\s*membro2\.vita\b/.test(m));
       check(list,'Output del party',
         eq(lines,['Membro 1: Aria (Maga)','Membro 2: Krag (Guerriero)','Salute totale party: 200']));break;
     default:check(list,'Non supportato',false);
   }
   const passed=list.every(x=>x.passed);
   return{id,passed,verdict:passed?'accepted':'requirements_not_met',checks:list,demoOnly:true,
     nativeStatus:reply?.status,localCapture:reply?.localCapture,
     warning:'Non utilizzare questi esiti locali per assegnare XP, progressi salvati o accessi.'};
 }
 root.GDHLessonLab=Object.freeze({lessons:Object.freeze(lessons),get,grade,scenarios,captureNames});
})(typeof window!=='undefined'?window:globalThis);
