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
   const re=new RegExp('(^[ \\t]*var\\s+'+escape(name)+'\\s*(?::\\s*\\w+\\s*)?=\\s*)[^\\r\\n#]*','m');
   return re.test(code) ? code.replace(re,(_m,prefix)=>prefix+value) : null;
 };
 function scenarios(id,src){
   const specs={
     17:[['below',{livello:'9'}]],
     18:[['no_key',{ha_chiave:'false'}],['open_door',{porta_chiusa:'false'}]],
     19:[['alive',{punti_vita:'100'}]],
     20:[['low_energy',{energia:'20'}],['no_relic',{ha_amuleto:'false'}],
         ['key_instead',{ha_amuleto:'false',ha_chiave:'true'}]]
   };
   return (specs[id]||[]).flatMap(([key,overrides])=>{
     let result=src;
     for(const [name,value] of Object.entries(overrides)){
       result=overwriteSeed(result,name,value);
       if(result===null)return [];
     }
     return [{key,code:result}];
   });
 }
 const linesEqual=(out,expected)=>eq(logs(out||''),expected);
 const scenarioOk=(all,key,expected)=>{
   const x=all && all[key];
   return Boolean(x&&x.reply&&x.reply.status==='executed'&&linesEqual(x.stdout,expected));
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

 const check=(arr,desc,p)=>arr.push({desc,passed:Boolean(p)});
 function grade(id,src,reply,stdout,stderr,scenarioResults={}){
   const lesson=get(id);
   if(!lesson)return{id,passed:false,demoOnly:true,error:'Lezione non disponibile'};
   const m=clean(src),lines=logs(stdout),s=reply?.locals||{},list=[];
   const loc=name=>Object.prototype.hasOwnProperty.call(s,name)?s[name]:undefined;
   check(list,'Compilazione ed esecuzione tramite Godot nativo',reply?.status==='executed');
   if(lesson.locals.length)check(list,'Valori locali rilevati nella funzione _ready',reply?.localCapture==='instrumented');
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
       check(list,'nome = Eroe',loc('nome')==='Eroe'&&decl(m,'var','nome'));
       check(list,'Usato print(nome)',pr(m,'nome')&&eq(lines,['Eroe']));break;
     case 6:
       check(list,'personaggio = Guerriero',loc('personaggio')==='Guerriero'&&decl(m,'var','personaggio'));
       check(list,'punti_vita = 100 numerico',loc('punti_vita')===100&&decl(m,'var','punti_vita'));
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
       check(list,'velocita float',loc('velocita')===4.5);
       check(list,'ha_chiave boolean',loc('ha_chiave')===true);
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
       check(list,'somma = 15, calcolata con +',loc('somma')===15&&/\bvar\s+somma\s*=\s*(?:10\s*\+\s*5|5\s*\+\s*10)\b/.test(m));
       check(list,'prodotto = 10, calcolato con *',loc('prodotto')===10&&/\bvar\s+prodotto\s*=\s*(?:5\s*\*\s*2|2\s*\*\s*5)\b/.test(m));
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
       check(list,'livello iniziale 10',loc('livello')===10);
       check(list,'Confronto if livello >= 10',/\bif\s+livello\s*>=\s*10\s*:/.test(m));
       check(list,'Con livello 10 stampa messaggio',eq(lines,['Livello raggiunto!']));
       check(list,'Con livello 9 NON stampa messaggio',scenarioOk(scenarioResults,'below',[]));
       break;
     case 18:
       check(list,'Due variabili booleane vere',loc('ha_chiave')===true&&loc('porta_chiusa')===true);
       check(list,'Condizione usa if e and',/\bif\b[^\n:]*\band\b[^\n:]*:/.test(m));
       check(list,'Caso iniziale stampa Accesso consentito',eq(lines,['Accesso consentito']));
       check(list,'Nessun accesso senza chiave',scenarioOk(scenarioResults,'no_key',[]));
       check(list,'Nessun accesso con porta non chiusa',scenarioOk(scenarioResults,'open_door',[]));
       break;
     case 19:
       check(list,'punti_vita iniziale 0',loc('punti_vita')===0);
       check(list,'if su punti_vita e ramo else',/\bif\b[^\n]*punti_vita[^\n]*:/.test(m)&&/\belse\s*:/.test(m));
       check(list,'Game Over quando salute è zero',eq(lines,['Game Over']));
       check(list,'In battaglia quando salute è 100',scenarioOk(scenarioResults,'alive',['In battaglia']));
       break;
     case 20:
       check(list,'Configurazione iniziale del portale',
         loc('energia')===75&&loc('ha_amuleto')===true&&loc('ha_chiave')===false);
       check(list,'if / elif / else presenti',/\bif\b/.test(m)&&/\belif\b/.test(m)&&/\belse\b/.test(m));
       check(list,'Portale attivo nello scenario iniziale',
         loc('stato_portale')==='Portale Attivato'&&eq(lines,['Stato: Portale Attivato']));
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
     default:check(list,'Non supportato',false);
   }
   return{id,passed:list.every(x=>x.passed),checks:list,demoOnly:true,nativeStatus:reply?.status,localCapture:reply?.localCapture,
     warning:'Non utilizzare questi esiti locali per assegnare XP, progressi salvati o accessi.'};
 }
 root.GDHLessonLab=Object.freeze({lessons:Object.freeze(lessons),get,grade,scenarios});
})(typeof window!=='undefined'?window:globalThis);
