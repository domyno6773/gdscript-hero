'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=process.cwd();
const context={window:{},CHAPTERS_DATA:[],LESSONS_DATA:[],CONCEPTS_CATALOG:{},console};
vm.createContext(context);
for(const file of ['manuale235/data.js','manuale235/catalog.js','manuale235/basics.js','manuale235/verifier.js','manuale235/intermediate.js','manuale235/functions-and-arrays.js','manuale235/sequences.js','manuale235/dictionaries.js','manuale235/expenses.js','manuale235/challenges.js','manuale235/matching.js','manuale235/patterns-collections.js','manuale235/grids.js','manuale235/nested-dictionaries.js','manuale235/contact-book.js']){
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
assert.ok(lessons.slice(0,122).every(x=>x.validationReady===true));
assert.ok(lessons.slice(122).every(x=>x.validationReady===false));
assert.ok(lessons.slice(170).every(x=>x.sourceFiles['main.gd']));
assert.match(lessons[8].initialCode,/^extends Node/m);
assert.match(lessons[8].initialCode,/^    var PlayerName/m);
assert.match(lessons[170].sourceFiles['greeter.gd'],/^class_name Greeter/m);
const stats=context.window.GDHManualMigration;
assert.equal(stats.total,235);
assert.equal(stats.chapters,43);
assert.equal(stats.validated,122);
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
  // Le funzioni prive di _ready() vengono invocate direttamente nel vero motore:
  // simula qui solo il formato del risultato per collaudare il comparatore.
  const functionCalls=verify.expectedCases[55];
  assert.equal(functionCalls.length,2);
  assert.equal(functionCalls[0].calls.length,4);
  const sigma='func sigma(n: int):\n    var somma = 0\n    for i in range(1, n + 1):\n        somma += i\n    return somma';
  const functionResult=await verify.verify(10055,sigma,async(_,args)=>{
    const values=args.calls.map(c=>({status:'executed',method:c.method,
      value:c.args[0]*(c.args[0]+1)/2}));
    return {status:'executed',stdout:'',stderr:'',reply:{status:'executed',methodCalls:values}};
  });
  assert.equal(functionResult.accepted,true,'sigma deve usare i valori restituiti');
  const fakeResult=await verify.verify(10055,sigma,async(_,args)=>({
    status:'executed',stdout:'',stderr:'',reply:{status:'executed',
      methodCalls:args.calls.map(c=>({status:'executed',method:c.method,value:15}))}
  }));
  assert.equal(fakeResult.accepted,false,'Un valore restituito costante non supera sigma');
  const noMain=await verify.verify(10055,'extends Node\n'+sigma,async()=>({
    status:'executed',stdout:'',stderr:'',reply:{status:'executed',
      methodCalls:[]}
  }));
  assert.equal(noMain.accepted,false,'Il file solo-funzione non deve includere extends Node');
  assert.ok(verify.expectedCases[60][1].output.includes('Buzz'));
  assert.notEqual(verify.expectedCases[60][0].output,verify.expectedCases[60][1].output);
  assert.equal(verify.expectedCases[61].length,4);
  assert.equal(verify.expectedCases[65].length,3);
  assert.match(lessons[81].task,/freccia/);
  assert.doesNotMatch(lessons[81].task,/bombee|Used|Items:/);
  assert.match(lessons[81].initialCode,/var inventory = \{"pozione": 2, "freccia": 10\}/);
  assert.doesNotMatch(lessons[82].initialCode,/print\("Benvenuto/);
  for(let n=83;n<=89;n++)assert.match(lessons[n-1].initialCode,/extends Node/);
  const intro=await verify.verify(10083,lessons[82].initialCode,async()=>({
    status:'executed',stdout:'',stderr:'',reply:{status:'executed'}
  }));
  assert.equal(intro.accepted,false,'La lezione 83 non deve superarsi eseguendo pass');
  const commands=verify.expectedCases[89];
  assert.equal(commands.length,3);
  assert.ok(commands.some(c=>c.stdin.includes('0')));
  assert.ok(verify.expectedCases[88].some(c=>c.stdin.join(',').includes('4,2,3')));
  assert.match(lessons[94].task,/Sostituisci la lettera/);
  assert.match(lessons[96].task,/non valido/);
  assert.match(lessons[89].initialCode,/var n = int\(OS\.read_string_from_stdin\(\)\)/);
  assert.match(lessons[91].initialCode,/var prices: Array\[int\]/);
  assert.ok(verify.expectedCases[91].length>=5,'Lezione 91: sovrapposizioni');
  assert.ok(verify.expectedCases[95].some(c=>c.stdin[0].includes('è')));
  assert.equal(lessons[104].initialCode.includes('extends Node'),false);
  assert.match(lessons[103].task,/Righe: 4/);
  assert.equal(verify.expectedCases[105].length,6);
  const direct=verify.expectedCases[105][0];
  assert.match(direct.harness,/print\(get_tile\(/);
  const impossible=await verify.verify(10105,lessons[104].initialCode,
    async()=>({status:'executed',stderr:'',stdout:'6\n',reply:{status:'executed'}}));
  assert.equal(impossible.accepted,false,'Non attribuire XP allo starter di get_tile');
  assert.equal(verify.expectedCases[108][0].returns.length,4);
  assert.equal(JSON.stringify(verify.expectedCases[108][0].returns[2]),
    JSON.stringify([[1],[2,4],[3,6,9]]));
  assert.equal(verify.expectedCases[110].length,7);
  assert.match(lessons[108].task,/Diagonale principale/);
  const triangleSource='func make_triangle(n: int):\n    var grid = []\n    for row in range(1, n+1):\n        var items = []\n        for col in range(1, row+1):\n            items.append(row * col)\n        grid.append(items)\n    return grid';
  const expected=verify.expectedCases[108][0];
  const triangle=await verify.verify(10108,triangleSource,async(_source,options)=>({
    status:'executed',stderr:'',stdout:'',
    reply:{status:'executed',methodCalls:options.calls.map((c,i)=>({
      method:c.method,status:'executed',value:expected.returns[i]
    }))}
  }));
  assert.equal(triangle.accepted,true,'Gli array restituiti devono essere confrontati per valore');
  assert.match(lessons[110].initialCode,/frutta/);
  assert.doesNotMatch(lessons[110].task,/fruits\/apples/);
  assert.equal(verify.expectedCases[115].length,6);
  assert.equal(verify.expectedCases[114].length,4);
  assert.equal(verify.expectedCases[113].length,4);
  const sim=await verify.verify(10115,'func frequency_counter(data_list: Array):\n    var o={}\n    for value in data_list:\n        o[value]=o.get(value,0)+1\n    return o',async()=>({
      status:'executed',stdout:'{"1":1,"2":2,"3":3}\n',stderr:'',
      reply:{status:'executed'}
  }));
  assert.equal(sim.accepted,false,'Non supera tutti i test con un risultato fisso');
  assert.match(lessons[115].initialCode,/func display_menu\(\):/);
  assert.doesNotMatch(lessons[115].initialCode,/print\("Menu della rubrica/);
  assert.doesNotMatch(lessons[116].initialCode,/func add_contact/);
  assert.doesNotMatch(lessons[117].initialCode,/func view_contact/);
  assert.doesNotMatch(lessons[118].initialCode,/func edit_contact/);
  assert.doesNotMatch(lessons[119].initialCode,/func delete_contact/);
  assert.doesNotMatch(lessons[120].initialCode,/func list_all_contacts/);
  assert.match(lessons[121].initialCode,/func list_all_contacts/);
  assert.doesNotMatch(lessons[121].initialCode,/match choice:/);
  assert.equal(verify.expectedCases[122].length,3);
  assert.match(lessons[118].task,/Contatto aggiornato correttamente/);
  const unsupported=await verify.verify(10123,'',async()=>{throw Error('Non dovrebbe partire');});
  assert.equal(unsupported.accepted,false,'Lezione non verificata non dà XP');
  assert.match(verify.nativeSource('print(OS.read_string_from_stdin())'),/__gdhManualReadStdin/);
  console.log('OK: 235 lezioni, 43 capitoli, 122 validatori, stdin e test negativi');
})().catch(err=>{console.error(err);process.exitCode=1});
