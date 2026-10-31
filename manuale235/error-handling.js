/* Lezioni 158–162: gestione degli errori e validazione degli input.
 * Test su estremi, input non numerici, zero e risultati decimali.
 * Le incongruenze linguistiche del PDF sono riallineate al comportamento.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
 if(lessons.length!==235||!verify)throw Error('Catalogo del manuale non pronto');
 const lesson=n=>{
   const l=lessons.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione assente: '+n);
   return l;
 };
 const patch=(n,code)=>{
   const l=lesson(n);
   l.initialCode=code;l.starterCode=code;
   l.sourceFiles={...l.sourceFiles,'main.gd':code};
 };
 const clean=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 const proof=(...rules)=>src=>rules.every(re=>re.test(clean(src)));
 const functionOnly=src=>!/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(clean(src))&&
   !/\bprint\s*\(/.test(clean(src));
 const define=(n,cases,rule)=>{
   if(cases.length<4)throw Error('Test insufficienti '+n);
   const l=lesson(n);
   verify.expectedCases[n]=cases;
   l.manualSourceCheck=rule;
   l.expectedOutput=cases[0].output||'Verifica specifica';
   l.validationReady=true;
 };

 const slot=lesson(158);
 slot.task=slot.task.replace('Slot, il numero e is empty',
   'La posizione, il numero e «è vuota»')
   .replace('Slot -1 is empty','La posizione -1 è vuota');
 patch(158,[
   'extends Node','','func _ready():',
   '    var inventory = ["spada", "scudo", "pozione", "arco"]',
   '    var slot = int(OS.read_string_from_stdin())',
   '    # Controlla il limite inferiore e quello superiore prima di usare slot.',
   '    pass'
 ].join('\n'));
 define(158,[-5,-1,0,1,2,3,4,7].map(n=>({
   name:'Accesso alla posizione '+n,stdin:[String(n)],
   output:n>=0&&n<4?'Slot '+n+': '+['spada','scudo','pozione','arco'][n]:
     'La posizione '+n+' è vuota'
 })),proof(/\binventory\b/,/\bslot\b/,/\bif\b/,/\bprint\s*\(/,
   /\.size\s*\(\s*\)|\b4\b/,/>=\s*0|0\s*<=\s*slot|0\s*>\s*slot/));

 patch(159,[
   'extends Node','','func _ready():',
   '    var user_input = OS.read_string_from_stdin()',
   '    # Verifica prima che il testo rappresenti un intero.',
   '    # Solo dopo converti e stampa; altrimenti mostra l’errore.',
   '    pass'
 ].join('\n'));
 const intSamples=['42','007','-12','0','abc','3.14','hello7',''];
 define(159,intSamples.map(value=>({
   name:'Input intero '+JSON.stringify(value),stdin:[value],
   output:/^[+-]?\d+$/.test(value)?
     'Hai inserito: '+Number(value):
     'Input non valido! Inserisci un numero valido.'
 })),proof(/\buser_input\b/,/\.is_valid_int\s*\(\s*\)/,
   /\bint\s*\(|\.to_int\s*\(\s*\)/,/\bif\b/,/\bprint\s*\(/));

 patch(160,[
   'func process_data(text: String):',
   '    # Se text non è un intero, ritorna il primo messaggio di errore.',
   '    # Se il numero è zero, ritorna il secondo messaggio.',
   '    # Altrimenti restituisci 100.0 diviso il numero, con due decimali.',
   '    pass'
 ].join('\n'));
 const guardInputs=['8','-5','abc','0','100','25','-4','3.14','1'];
 const guardResult=s=>{
   if(!/^[+-]?\d+$/.test(s))return 'Il valore deve essere un numero!';
   const n=Number(s);
   if(n===0)return 'Impossibile dividere per zero!';
   return (100/n).toFixed(2);
 };
 define(160,guardInputs.map(value=>({
   name:'Clausole di guardia '+JSON.stringify(value),
   harness:'func _ready():\n    print(process_data('+JSON.stringify(value)+'))',
   output:guardResult(value)
 })),src=>proof(/\bfunc\s+process_data\s*\(\s*text\s*:\s*String\s*\)/,
   /\.is_valid_int\s*\(\s*\)/,/\breturn\b/,
   /\b100(?:\.0)?\b/,/\b0\b/)(src)&&
   functionOnly(src));

 const level=lesson(161);
 level.task=level.task.replace('Errore: il livello deve essere compreso tra 1 e 99',
   'Errore: Il livello deve essere compreso tra 1 e 99');
 patch(161,[
   'extends Node',
   '',
   '# Scrivi parse_level(text: String), che restituisce un Dictionary.',
   '',
   'func _ready():',
   '    var text = OS.read_string_from_stdin()',
   '    # Chiama parse_level e mostra il livello oppure il messaggio di errore.',
   '    pass'
 ].join('\n'));
 const levelInputs=['42','1','99','0','100','-1','150','xyz','3.14','007'];
 define(161,levelInputs.map(value=>({
   name:'Validazione livello '+JSON.stringify(value),stdin:[value],
   output:!/^[+-]?\d+$/.test(value)?'Errore: Valore non numerico':
     Number(value)<1||Number(value)>99?
       'Errore: Il livello deve essere compreso tra 1 e 99':
       'Livello impostato a '+Number(value)
 })),proof(/\bfunc\s+parse_level\s*\(\s*text\b/,
   /\.is_valid_int\s*\(\s*\)/,
   /\breturn\b/,/\b["']ok["']\b|["']ok["']/,
   /\b["']error["']\b|["']error["']/,
   /\b["']value["']\b|["']value["']/,
   /\bparse_level\s*\(/,/\bprint\s*\(/));

 const divide=lesson(162);
 divide.task=divide.task.replace('Errore: impossibile dividere per zero',
   'Errore: Impossibile dividere per zero');
 patch(162,[
   'extends Node',
   '',
   '# Implementa safe_divide(a: float, b: float) -> Dictionary.',
   '',
   'func _ready():',
   '    var first = OS.read_string_from_stdin()',
   '    var second = OS.read_string_from_stdin()',
   '    # Verifica entrambi gli input, chiama safe_divide e stampa',
   '    # il risultato con due decimali oppure l’errore.',
   '    pass'
 ].join('\n'));
 const dividePairs=[
   ['10','4'],['100','0'],['-10','4'],['4','-2'],
   ['8','3'],['0','8'],['abc','5'],['5','nan'],['2.5','0.5'],['7','-0']
 ];
 define(162,dividePairs.map(([a,b])=>({
   name:'Divisione '+a+' / '+b,stdin:[a,b],
   output:!Number.isFinite(Number(a))||!Number.isFinite(Number(b))||
     !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(a)||
     !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(b)?
       'Errore: numero non valido':
       Number(b)===0?'Errore: Impossibile dividere per zero':
         'Risultato della divisione: '+(Number(a)/Number(b)).toFixed(2)
 })),proof(/\bfunc\s+safe_divide\s*\(\s*a\s*:\s*float\s*,\s*b\s*:\s*float\s*\)/,
   /\.is_valid_float\s*\(\s*\)/,/\bsafe_divide\s*\(/,
   /\breturn\b/,/\b["']ok["']\b|["']ok["']/,
   /\bprint\s*\(/));

 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   158:['2'],159:['42'],161:['42'],162:['10','4']
 });
 window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();