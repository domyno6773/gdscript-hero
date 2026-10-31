'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=process.cwd();
const context={window:{},CHAPTERS_DATA:[],LESSONS_DATA:[],CONCEPTS_CATALOG:{},console};
vm.createContext(context);
for(const file of ['manuale235/data.js','manuale235/catalog.js','manuale235/basics.js','manuale235/verifier.js','manuale235/intermediate.js','manuale235/functions-and-arrays.js','manuale235/sequences.js','manuale235/dictionaries.js','manuale235/expenses.js','manuale235/challenges.js','manuale235/matching.js','manuale235/patterns-collections.js','manuale235/grids.js','manuale235/nested-dictionaries.js','manuale235/contact-book.js','manuale235/sets.js','manuale235/enums.js','manuale235/student-records.js','manuale235/aggregates.js','manuale235/advanced-functions.js','manuale235/array-methods.js','manuale235/error-handling.js','manuale235/inventory-project.js','manuale235/final-challenges.js','manuale235/projects.js','manuale235/oop-foundations.js','manuale235/oop-properties.js','manuale235/oop-encapsulation.js','manuale235/oop-inheritance.js','manuale235/oop-polymorphism.js','manuale235/oop-duck-typing.js','manuale235/oop-abstract.js','manuale235/oop-shape-calculator.js','manuale235/oop-encapsulation-advanced.js']){
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
assert.ok(lessons.slice(0,200).every(x=>x.validationReady===true));
assert.ok(lessons.slice(200).every(x=>x.validationReady===false));
assert.ok(lessons.slice(170).every(x=>x.sourceFiles['main.gd']));
assert.match(lessons[8].initialCode,/^extends Node/m);
assert.match(lessons[8].initialCode,/^    var PlayerName/m);
assert.match(lessons[170].sourceFiles['greeter.gd'],/^class_name Greeter/m);
const stats=context.window.GDHManualMigration;
assert.equal(stats.total,235);
assert.equal(stats.chapters,43);
assert.equal(stats.validated,200);
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

  // Le cinque enumerazioni vanno oltre una singola uscita prefissata.
  for (let n=129;n<=133;n++){
    assert.equal(lessons[n-1].validationReady,true,'Lezione '+n+' attiva');
    assert.ok(verify.expectedCases[n]?.length>=4,'Mancano scenari '+n);
    assert.ok(typeof lessons[n-1].manualSourceCheck==='function');
    assert.ok(!lessons[n-1].manualSourceCheck('extends Node\nfunc _ready():\n    print("Attesa totale: 88 secondi")'),
      'Non approvare stampe fisse nella lezione '+n);
  }
  assert.equal(verify.expectedCases[129].length,4);
  assert.ok(verify.expectedCases[131].some(x=>x.stdin[0]==='VENERDÌ'));
  assert.ok(verify.expectedCases[133].some(x=>x.stdin[0]==='YELLOW'));
  // Registri studenti: conserva funzioni passate, ma lascia da svolgere
  // esclusivamente il passo attuale.
  for(let n=134;n<=140;n++){
    const lesson=lessons[n-1];
    assert.ok(lesson.validationReady,'Lezione '+n+' pronta');
    assert.ok(verify.expectedCases[n].length>=3,'Mancano casi alternativi '+n);
    assert.ok(lesson.manualSourceCheck,'Controllo codice assente '+n);
    assert.equal(lesson.manualSourceCheck('extends Node\nfunc _ready():\n    print("Arrivederci!")'),false);
    if(n>134)assert.doesNotMatch(lesson.initialCode,
      new RegExp('^func '+['','add_student','add_grade','is_enrolled',
        'calculate_average_grade','list_students_by_course','filter_top_students'][n-134]+'\\(', 'm'),
      'La funzione della lezione '+n+' non deve essere già svolta');
  }
  assert.match(lessons[139].initialCode,/func list_students_by_course/);
  assert.ok(verify.expectedCases[140].some(x=>x.stdin.includes('migliori 90')));
  for(let n=141;n<=144;n++){
    assert.equal(lessons[n-1].validationReady,true,'Lezione '+n);
    assert.ok(verify.expectedCases[n].length>=4,'Input insufficienti '+n);
    assert.equal(lessons[n-1].manualSourceCheck('extends Node\nfunc _ready():\n    print("Totale: 800")'),false);
  }
  assert.deepEqual(Array.from(verify.expectedCases[144][0].orderedKeys),['b','c','a']);
  assert.equal(lessons[143].initialCode.includes('extends Node'),false);
  // Nuove attività: varianti di input, funzioni pure e divieto di
  // completamento con una sola stampa di valori prestabiliti.
  for (let n=145;n<=157;n++){
    const lesson=lessons[n-1];
    assert.equal(lesson.validationReady,true,'Lezione '+n+' ancora bloccata');
    assert.ok(verify.expectedCases[n]?.length>=3,'Test insufficienti '+n);
    assert.equal(typeof lesson.manualSourceCheck,'function');
    assert.equal(lesson.manualSourceCheck('extends Node\nfunc _ready():\n    print("Bob")'),false,
      'Possibile bypass nella lezione '+n);
  }
  for(const n of [148,150,151,152,153,156,157]){
    assert.doesNotMatch(lessons[n-1].initialCode,/^extends Node/m,
      'Lo starter della lezione '+n+' non deve essere un programma intero');
    assert.ok(verify.expectedCases[n].some(x=>x.harness));
  }
  assert.ok(verify.expectedCases[146].some(x=>x.stdin[0]==='-2'));
  assert.ok(verify.expectedCases[147].some(x=>x.stdin[0]==='0'));
  assert.ok(verify.expectedCases[150].some(x=>x.output==='34'));
  assert.equal(verify.expectedCases[149][2].output,'3\n2\n1\n0');
  assert.ok(verify.expectedCases[156].some(x=>x.stdin===undefined));
  assert.ok(verify.expectedCases[157].some(x=>x.output==='[]'));
  for(let n=158;n<=162;n++){
    assert.ok(lessons[n-1].validationReady,'Validatore mancante '+n);
    assert.ok(verify.expectedCases[n].length>=8,'Casi limite mancanti '+n);
    assert.equal(lessons[n-1].manualSourceCheck('extends Node\nfunc _ready():\n    print("Errore")'),false);
  }
  assert.ok(verify.expectedCases[158].some(x=>x.stdin[0]==='-1'));
  assert.ok(verify.expectedCases[159].some(x=>x.stdin[0]==='007'&&x.output==='Hai inserito: 7'));
  assert.ok(verify.expectedCases[162].some(x=>x.stdin[1]==='0'));

  // Inventario: il passo attuale è da svolgere, quelli precedenti sono forniti.
  const newFunctions=['add_item','update_stock','check_availability','sales_report'];
  for(let n=163;n<=167;n++){
    assert.ok(lessons[n-1].validationReady,'Non pronto: '+n);
    assert.ok(verify.expectedCases[n]?.length>=4,'Scenari insufficienti '+n);
    if(n>163){
      const fn=newFunctions[n-164];
      assert.doesNotMatch(lessons[n-1].initialCode,
        new RegExp('^func '+fn+'\\s*\\(', 'm'),
        'Lo starter anticipa la funzione della lezione '+n);
    }
  }
  assert.match(lessons[166].initialCode,/func check_availability/);
  assert.doesNotMatch(lessons[166].initialCode,/^func sales_report\s*\(/m);
  assert.ok(verify.expectedCases[167].some(x=>x.stdin.includes('vendi Caffe:5 Caffe-3 Te:2')));
  for(let n=168;n<=170;n++){
    assert.ok(lessons[n-1].validationReady,'Sfida non pronta: '+n);
    assert.ok(verify.expectedCases[n]?.length>=5,'Scenari insufficienti: '+n);
    assert.equal(lessons[n-1].manualSourceCheck(
      'extends Node\nfunc _ready():\n    print("Contatti conservati: 1 su 3")'),false,
      'Non accettare una risposta fissa');
  }
  assert.equal(verify.expectedCases[168][0].output.split('\n').at(-1),
    'Contatti conservati: 1 su 3');
  assert.equal(verify.expectedCases[170][0].output.split('\n')[0],'Studenti idonei: 2');
  // Il compilatore di progetto NON usa main.gd modificabili dall'utente:
  // i file restano indipendenti nella UI e il passaggio è bloccato finché
  // esiste un validatore comportamentale per la specifica lezione.
  const adapter=context.window.GDHManualProject;
  for(let n=171;n<=175;n++){
    const lesson=lessons[n-1];
    assert.equal(lesson.validationReady,true,'OOP non predisposto '+n);
    assert.equal(adapter.supports(lesson),true);
    assert.equal(verify.expectedCases[n].length,5);
    assert.equal(lesson.manualSourceCheck('extends Node\nfunc _ready():\n    print("OK")'),false);
    assert.ok(Object.keys(lesson.sourceFiles).length>=2);
    if(n===172){
      assert.throws(()=>adapter.build(lesson,lesson.sourceFiles),/Manca class_name/);
    }else{
      const assembled=adapter.build(lesson,lesson.sourceFiles);
      assert.match(assembled,/^extends Node/m);
      assert.match(assembled,/^class \w+:/m);
    }
    const broken={...lesson.sourceFiles,'main.gd':lesson.sourceFiles['main.gd']+'\nprint("falso")'};
    assert.throws(()=>adapter.build(lesson,broken),/modificato/);
  }
  assert.match(lessons[171].sourceFiles['main.gd'],/car\.ruote/);
  assert.ok(verify.expectedCases[171].some(t=>t.stdin[0]==='0'));
  assert.ok(verify.expectedCases[173].some(t=>t.stdin[0]==='0'));
  for(let n=176;n<=180;n++){
    const lesson=lessons[n-1];
    assert.equal(lesson.validationReady,true,'Lezione OOP inattiva '+n);
    assert.equal(context.window.GDHManualProject.supports(lesson),true);
    assert.equal(verify.expectedCases[n].length,5);
    assert.match(lesson.sourceFiles['main.gd'],/^extends Node/m);
  }
  assert.deepEqual(Object.keys(lessons[179].sourceFiles),
    ['grader.gd','student.gd','main.gd']);
  assert.ok(verify.expectedCases[180].some(x=>x.stdin[0]==='0'));
  for(let n=181;n<=184;n++){
    assert.equal(lessons[n-1].validationReady,true,'Lezione '+n+' senza verifiche');
    assert.equal(context.window.GDHManualProject.supports(lessons[n-1]),true);
    assert.equal(verify.expectedCases[n].length,5);
    assert.equal(lessons[n-1].manualSourceCheck(
      'class_name Player\nextends RefCounted\nvar health = 100'),false);
  }
  assert.ok(verify.expectedCases[181].some(x=>x.output.includes('Il giocatore è stato sconfitto!')));
  assert.ok(verify.expectedCases[184].some(x=>x.stdin.includes('preleva -1')));
  for(let n=185;n<=186;n++){
    const lesson=lessons[n-1];
    assert.equal(lesson.validationReady,true);
    assert.ok(verify.expectedCases[n].length>=5);
    assert.equal(context.window.GDHManualProject.supports(lesson),true);
    const code=context.window.GDHManualProject.build(lesson,lesson.sourceFiles);
    assert.match(code,/^class \w+:/m);
    assert.match(code,/extends RefCounted/);
    assert.match(code,/extends (Vehicle|Person)/);
  }
  // Le classi di supporto sono immutabili, non solo main.gd.
  const project=context.window.GDHManualProject;
  const lockedExpected={
    187:['shape.gd','main.gd'],
    188:['character.gd','main.gd'],
    189:['animal.gd','bird.gd','penguin.gd','main.gd'],
    190:['main.gd']
  };
  for(let n=187;n<=190;n++){
    const l=lessons[n-1];
    assert.equal(l.validationReady,true,'Validatore mancante '+n);
    assert.ok(verify.expectedCases[n].length>=5,'Varianti insufficienti '+n);
    assert.equal(project.supports(l),true);
    assert.equal(JSON.stringify(l.readOnlyFiles),JSON.stringify(lockedExpected[n]));
    const assembled=project.build(l,l.sourceFiles);
    assert.match(assembled,/^extends Node/m);
    for(const locked of l.readOnlyFiles){
      const altered={...l.sourceFiles,[locked]:l.sourceFiles[locked]+'\n# modifica non consentita'};
      assert.throws(()=>project.build(l,altered),/modificato/);
    }
    assert.equal(l.manualSourceCheck('class_name Hello\nextends RefCounted'),false);
  }
  assert.ok(verify.expectedCases[187].some(x=>x.output.includes('Area: 78.54')));
  assert.ok(verify.expectedCases[188].some(x=>x.output.includes('Attacco: 20')));
  assert.ok(verify.expectedCases[189].some(x=>x.output.includes('Uccelli: 2')));
  assert.ok(verify.expectedCases[190].some(x=>x.output.includes('13500.00')));

  const p192=context.window.GDHManualProject;
  for(const n of [191,192]){
    const l=lessons[n-1];
    assert.equal(l.validationReady,true,'OOP non disponibile: '+n);
    assert.equal(p192.supports(l),true);
    assert.ok(verify.expectedCases[n]?.length>=5,'Test alternativi mancanti '+n);
    assert.equal(l.manualSourceCheck('class_name Crate\nextends RefCounted'),false);
    assert.match(p192.build(l,l.sourceFiles),/^extends Node/m);
    for(const file of l.readOnlyFiles){
      const modified={...l.sourceFiles,[file]:l.sourceFiles[file]+'\n# cambia file protetto'};
      assert.throws(()=>p192.build(l,modified),/modificato/);
    }
  }
  assert.equal(JSON.stringify(lessons[191].readOnlyFiles),
    JSON.stringify(['player.gd','rock.gd','main.gd']));
  assert.ok(verify.expectedCases[192].some(c=>c.output.includes('Cassa: distrutta')));
  assert.ok(verify.expectedCases[191].some(c=>c.output.includes('Ruote totali: 18')));
  assert.equal(lessons[200].validationReady,false,'Attività future non devono concedere XP');

  // Godot 4.5 supporta @abstract: il verificatore non deve falsare
  // l'astrazione con metodi finti in un runtime obsoleto.
  for(const n of [193,194,195]){
    const lesson=lessons[n-1];
    assert.equal(lesson.validationReady,true,'Classi astratte non validate '+n);
    assert.equal(p192.supports(lesson),true);
    assert.ok(verify.expectedCases[n].length>=5);
    assert.match(p192.build(lesson,lesson.sourceFiles),/^extends Node/m);
    assert.equal(lesson.manualSourceCheck('class_name Shape\nextends RefCounted'),false);
    assert.equal(JSON.stringify(lesson.readOnlyFiles),'["main.gd"]');
    assert.throws(()=>p192.build(lesson,{...lesson.sourceFiles,'main.gd':'extends Node\nfunc _ready(): pass'}),/modificato/);
  }
  // Lo starter non contiene accidentalmente il codice della soluzione.
  assert.doesNotMatch(lessons[192].initialCode,/@abstract\s+func\s+fee/);
  assert.doesNotMatch(lessons[194].initialCode,/@abstract\s+func\s+area/);
  assert.ok(verify.expectedCases[194].some(x=>x.output.includes('Tempo totale: 4:38')));
  assert.ok(verify.expectedCases[195].some(x=>x.output.includes('Area totale: 87.54')));
  // Incapsulamento avanzato: cinque verificatori con input diversi e
  // rispetto del driver protetto dal manuale.
  for(let n=196;n<=200;n++){
    const l=lessons[n-1];
    assert.equal(l.validationReady,true,'Verifica didattica mancante '+n);
    assert.equal(p192.supports(l),true);
    assert.ok(verify.expectedCases[n].length>=5);
    assert.ok(p192.build(l,l.sourceFiles).includes('extends Node'));
    assert.equal(l.manualSourceCheck('class_name Example\nextends RefCounted'),false);
    const corrupt={...l.sourceFiles,'main.gd':l.sourceFiles['main.gd']+'\n# errore'};
    assert.throws(()=>p192.build(l,corrupt),/modificato/);
  }
  assert.equal(Object.keys(lessons[199].sourceFiles).length,3);
  assert.ok(verify.expectedCases[196].some(c=>c.output.includes('Rifiutato:')));
  assert.ok(verify.expectedCases[197].some(c=>c.output.includes('Già presente nella playlist:')));
  assert.ok(verify.expectedCases[198].some(c=>c.output.includes('Ordine n.')));
  assert.ok(verify.expectedCases[199].some(c=>c.output.includes('Media: 87.50')));
  assert.ok(lessons.slice(200).every(l=>l.validationReady===false));
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
  assert.doesNotMatch(lessons[121].initialCode.split('\n').filter(x=>!/^\s*#/.test(x)).join('\n'),/match choice:/);
  assert.equal(verify.expectedCases[122].length,3);
  assert.match(lessons[118].task,/Contatto aggiornato correttamente/);
  assert.equal(verify.expectedCases[123].length,4);
  assert.equal(verify.expectedCases[128].length,6);
  assert.match(lessons[127].initialCode,/func remove_duplicates\(numbers: Array\[int\]\) -> Array\[int\]/);
  assert.ok(verify.expectedCases[128].some(c=>c.stdin===undefined&&c.harness));
  const unsupported=await verify.verify(10201,'',async()=>{throw Error('Non dovrebbe partire');});
  assert.equal(unsupported.accepted,false,'Lezione non verificata non dà XP');
  assert.match(verify.nativeSource('print(OS.read_string_from_stdin())'),/__gdhManualReadStdin/);
  console.log('OK: 235 lezioni, 43 capitoli, 200 validatori, stdin e test negativi');
})().catch(err=>{console.error(err);process.exitCode=1});
