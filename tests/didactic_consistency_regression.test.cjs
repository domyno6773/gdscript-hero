'use strict';
// Avvio: node tests/didactic_consistency_regression.test.cjs
// Controllo didattico/validatori senza credenziali, rete o dipendenze npm.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const win={},ctx=vm.createContext({window:win,console});
function load(file){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
}
load('lessons.js');
load('native/lesson-fixtures.js');
load('native/lesson-validation.js');
load('curriculum_extension.js');
const lessons=win.LESSONS_DATA, fixtures=win.GDHLessonFixtures,lab=win.GDHLessonLab;
const byId=id=>lessons.find(x=>x.id===id);
const fixture=id=>fixtures.find(x=>x.id===id);
assert.equal(lessons.length,81,'81 esercizi nel corso prima di inserire i quiz');
assert.equal(win.GDHCurriculumExtension.count,21);

const lesson5=byId(5);
assert.match(lesson5.hints[1].text,/stringa/);
assert.match(lesson5.hints[1].text,/virgolette/);
assert.doesNotMatch(lesson5.hints[1].text,/valore numerico iniziale/);
assert.match(lesson5.hints[2].text,/personaggio/);

const lesson19=byId(19);
assert.match(lesson19.hints[0].text,/punti_vita > 0/);
assert.match(lesson19.hints[0].text,/Game Over/);
assert.match(lesson19.initialCode,/if punti_vita <= 0:/);

for(const id of [29,39]){
  const lesson=byId(id),native=fixture(id);
  assert.ok(lesson&&native,'Lezione o fixture mancante: '+id);
  for(const field of ['initialCode','solution','expectedOutput','title']){
    assert.equal(native[field],lesson[field],id+' '+field+' non sincronizzato');
  }
  assert.equal(native.id,id,'L’ID stabile non deve cambiare');
}
assert.match(byId(29).title,/funzione/);
assert.match(byId(29).solution,/func inizializza_nodo\(\)/);
assert.match(byId(29).solution,/func _ready\(\):\n    inizializza_nodo\(\)/);
assert.match(byId(39).task,/keys\(\)/);
assert.match(byId(39).solution,/forziere\.keys\(\)/);
assert.match(byId(39).expectedOutput,/Chiavi nel forziere: 2/);

function verifyNative(id,source,stdout){
  const reply={status:'executed',locals:id===39?
    {forziere:{oro:100,gemme:3},ha_oro:true,ha_chiave:false}:{},
    localCapture:id===39?'instrumented':undefined};
  return lab.grade(id,source,reply,stdout,'',{});
}
const lesson29=byId(29);
const lesson39=byId(39);
assert.equal(verifyNative(29,lesson29.solution,lesson29.expectedOutput).passed,true);
assert.equal(verifyNative(39,lesson39.solution,lesson39.expectedOutput).passed,true);
assert.equal(verifyNative(29,'func _ready():\n    print("Nodo Inizializzato")\n',
  lesson29.expectedOutput).passed,false,'La vecchia stampa diretta non dimostra le funzioni');
const oldHasOnly=lesson39.solution.replace(
  'var chiavi = forziere.keys()','var chiavi = ["oro", "gemme"]');
assert.equal(verifyNative(39,oldHasOnly,lesson39.expectedOutput).passed,false,
  'Non basta un elenco di chiavi fisse');
const hardcodedKeys=lesson39.solution.replace(
  'print("Chiavi nel forziere: ", chiavi.size())','print("Chiavi nel forziere: 2")');
assert.equal(verifyNative(39,hardcodedKeys,lesson39.expectedOutput).passed,false,
  'Il numero delle chiavi deve essere calcolato dall’array');

const lesson121=byId(121);
assert.match(lesson121.title,/Simulare aggiornamenti/);
assert.match(lesson121.task,/_process\(delta\)/);
assert.match(lesson121.solution,/aggiorna\(0\.5\)/);
assert.equal(win.GDHCurriculumExtension.has(121),true);
console.log('PASS: coerenza lezioni 5, 19, 29, 39, 121 e verificatori nativi.');
