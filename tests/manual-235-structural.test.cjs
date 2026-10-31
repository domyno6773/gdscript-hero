'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=process.cwd();
const context={window:{},CHAPTERS_DATA:[],LESSONS_DATA:[],CONCEPTS_CATALOG:{},console};
vm.createContext(context);
for(const file of ['manuale235/data.js','manuale235/catalog.js','manuale235/basics.js','manuale235/verifier.js']){
  vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),context,{filename:file,timeout:3000});
}
const lessons=context.LESSONS_DATA,chapters=context.CHAPTERS_DATA;
assert.equal(lessons.length,235);
assert.equal(chapters.length,43);
assert.deepEqual(lessons.map(x=>x.manualLessonNumber),Array.from({length:235},(_,i)=>i+1));
assert.equal(new Set(lessons.map(x=>x.id)).size,235);
assert.equal(lessons[0].title,'1. Il linguaggio');
assert.equal(lessons[1].title,'2. Ciao mondo!');
assert.equal(lessons[234].title,'235. Servizio di noleggio veicoli');
assert.match(lessons[0].initialCode,/print\("Ciao GDScript!"\)/);
assert.match(lessons[1].initialCode,/print\(""\)/);
assert.match(lessons[2].initialCode,/print\("Arrivederci!"\)/);
assert.ok(lessons.every(x=>x.theory&&x.task&&x.initialCode&&x.title));
assert.ok(lessons.every(x=>typeof x.validate==='function'));
assert.ok(lessons.slice(0,30).every(x=>x.validationReady===true));
assert.ok(lessons.slice(30).every(x=>x.validationReady===false));
assert.ok(lessons.slice(170).every(x=>x.sourceFiles['main.gd']));
assert.match(lessons[8].initialCode,/^extends Node/m);
assert.match(lessons[8].initialCode,/^    var PlayerName/m);
assert.match(lessons[170].sourceFiles['greeter.gd'],/^class_name Greeter/m);
const stats=context.window.GDHManualMigration;
assert.equal(stats.total,235);
assert.equal(stats.chapters,43);
assert.equal(stats.validated,30);
assert.equal(stats.readyForRelease,false);
assert.equal(context.window.GDHManualBasicsValidated,18);
async function checks(n,logs,source=lessons[n-1].initialCode){
  return lessons[n-1].validate({code:source,success:true,logs});
}
(async()=>{
  const one=await checks(1,['Ciao GDScript!']);
  assert.ok(one.every(x=>x.passed),'Lezione 1: eseguibile senza modifica');
  const two=await checks(2,['Ciao mondo!'],'extends Node\nfunc _ready():\n    print("Ciao mondo!")');
  assert.ok(two.every(x=>x.passed),'Lezione 2: richiede il testo corretto');
  const wrong=await checks(2,[],lessons[1].initialCode);
  assert.ok(wrong.some(x=>!x.passed),'Lo starter non completa la lezione 2');
  const wrong3=await checks(3,['Ciao!']);
  assert.ok(wrong3.some(x=>!x.passed),'Commentare una riga non equivale a cancellarla');
  const n9='extends Node\nfunc _ready():\n    var player_name = "Ada"\n    var coin_count = 120\n    var is_online = true\n    print("Giocatore: ", player_name)\n    print("Monete: ", coin_count)\n    print("Online: ", is_online)';
  const nine=await checks(9,['Giocatore: Ada','Monete: 120','Online: true'],n9);
  assert.ok(nine.every(x=>x.passed),'Lezione 9: identificatori corretti');
  const nineWrong=await checks(9,['Giocatore: Ada','Monete: 120','Online: true'],'extends Node\nfunc _ready():\n    print("Giocatore: Ada")\n    print("Monete: 120")\n    print("Online: true")');
  assert.ok(nineWrong.some(x=>!x.passed),'Niente completamento con output hardcoded');
  const verify=context.window.GDHManualVerifier;
  const firstEndToEnd=await verify.verify(10001,lessons[0].initialCode,async()=>({
    status:'executed',stdout:'Ciao GDScript!\n',stderr:'',reply:{status:'executed'}
  }));
  assert.equal(firstEndToEnd.accepted,true,'La prima lezione deve superare la verifica completa');
  const secondEndToEnd=await verify.verify(10002,lessons[1].initialCode,async()=>({
    status:'executed',stdout:'\n',stderr:'',reply:{status:'executed'}
  }));
  assert.equal(secondEndToEnd.accepted,false,'print vuoto non deve essere promosso');
  const cs=verify.expectedCases[27];
  assert.equal(cs.length,6);
  const legitimate=await verify.verify(10027,'extends Node\nfunc _ready():\n    var wind=int(OS.read_string_from_stdin())',async(src,opts)=>{
    const found=cs.find(c=>JSON.stringify(c.stdin)===JSON.stringify(opts.stdin));
    return{status:'executed',stderr:'',stdout:found.output,reply:{status:'executed'}};
  });
  assert.equal(legitimate.accepted,true,'Tutti i casi alternativi del vento devono passare');
  const shortcut=await verify.verify(10027,'extends Node\nfunc _ready():\n    print("stato = Vento forte")',async()=>({
    status:'executed',stdout:'stato = Vento forte',stderr:'',reply:{status:'executed'}
  }));
  assert.equal(shortcut.accepted,false,'Una sola stringa fissa non copre il comportamento');
  const unsupported=await verify.verify(10031,'',async()=>{throw Error('Non dovrebbe partire');});
  assert.equal(unsupported.accepted,false,'Lezione non verificata non dà XP');
  assert.match(verify.nativeSource('print(OS.read_string_from_stdin())'),/__gdhManualReadStdin/);
  console.log('OK: 235 lezioni, 43 capitoli, 30 validatori, stdin e test negativi');
})().catch(err=>{console.error(err);process.exitCode=1});
