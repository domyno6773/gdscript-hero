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
 const check=(arr,desc,p)=>arr.push({desc,passed:Boolean(p)});
 function grade(id,src,reply,stdout,stderr){
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
       check(list,'Numero 1 come argomento numerico, non come String',/\bprint\s*\(\s*1\s*\)/.test(m));break;
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
     default:check(list,'Non supportato',false);
   }
   return{id,passed:list.every(x=>x.passed),checks:list,demoOnly:true,nativeStatus:reply?.status,localCapture:reply?.localCapture,
     warning:'Non utilizzare questi esiti locali per assegnare XP, progressi salvati o accessi.'};
 }
 root.GDHLessonLab=Object.freeze({lessons:Object.freeze(lessons),get,grade});
})(typeof window!=='undefined'?window:globalThis);
