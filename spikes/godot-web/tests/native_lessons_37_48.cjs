'use strict';
/* Native Godot exercise parity test for the real lessons 37-48.
   The grades are local demo feedback, not trustworthy for progress/account systems. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'), output=path.join(root,'test-artifacts');
fs.mkdirSync(output,{recursive:true});
const parent='http://127.0.0.1:18767',runner='http://localhost:18768';
const servers=[
 spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',path.join(root,'host')],{stdio:'ignore'}),
 spawn('python3',[path.join(root,'tests','cors_server.py'),'18768',path.join(root,'web')],{stdio:'ignore'})
];
const sleep=t=>new Promise(r=>setTimeout(r,t));
async function ready(url){
 for(let i=0;i<100;i++){
  const yes=await new Promise(ok=>http.get(url,r=>{r.resume();ok(r.statusCode===200)}).on('error',()=>ok(false)));
  if(yes)return;await sleep(100);
 }
 throw Error('Server unavailable: '+url);
}
async function run(page,id,code){
 await page.selectOption('#lesson',String(id));
 if(code===null)await page.locator('#solution').click();
 else await page.locator('#code').fill(code);
 await page.locator('#run').click();
 await page.waitForFunction(expected=>{
  try {const data=JSON.parse(document.querySelector('#grade').textContent);return data.id===expected;}
  catch {return false;}
 },id,{timeout:14000});
 const feedback=JSON.parse(await page.locator('#grade').textContent());
 const raw=JSON.parse(await page.locator('#result').textContent());
 const stdout=await page.locator('#stdout').textContent();
 return {feedback,raw,stdout};
}
(async()=>{
 let browser;
 const results=[];
 try{
  await Promise.all([ready(parent+'/lesson-lab.html'),ready(runner+'/isolated.html')]);
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1250,height:900}});
  await page.goto(parent+'/lesson-lab.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__gdhIsolation?.ready===true,null,{timeout:80000});
  for(let id=37;id<=48;id++){
   const r=await run(page,id,null);
   const failed=r.feedback.checks.filter(c=>!c.passed);
   assert.equal(r.raw.status,'executed','Native execution failed lesson '+id);
   assert.equal(r.feedback.passed,true,'Official lesson '+id+' failed native grading: '+JSON.stringify({failed,raw:r.raw,stdout:r.stdout}));
   if(![41,42,43,44].includes(id))assert.equal(r.raw.localCapture,'instrumented','Local capture missing: '+id);
   results.push({id,positive:true,stdout:r.stdout,locals:r.raw.locals});
   console.log('NATIVE_LESSON_PASS '+id+' '+JSON.stringify({capture:r.raw.localCapture,stdout:r.stdout}));
  }
  const bypasses=[
    [37,'func _ready():\n    var eroe = {"classe":"Guerriero","livello":10}\n    print("Classe: Guerriero")\n    print("Livello: 10")'],
    [38,'func _ready():\n    var equip = {"arma":"Spada Laser","armatura":"Scudo"}\n    print("Arma: ",equip["arma"])\n    print("Armatura: ",equip["armatura"])'],
    [39,'func _ready():\n    var forziere = {"oro":100,"gemme":3}\n    var ha_oro = true\n    var ha_chiave = false\n    print("Possiede oro: ",ha_oro)\n    print("Possiede chiave: ",ha_chiave)'],
    [40,'extends Node\nfunc _ready():\n    var boss = {"nome":"Drago Antico","hp":420,"attacco":75}\n    var in_furia = false\n    print("Boss: ",boss["nome"])\n    print("HP rimanenti: ",boss["hp"])\n    print("Attacco: ",boss["attacco"])\n    print("Furia attiva: ",in_furia)'],
    [41,'extends Node\nsignal porta_aperta\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print("Apertura in corso...")\n    print("Porta aperta con successo!")\nfunc quando_aperta():\n    print("Porta aperta con successo!")'],
    [42,'extends Node\nsignal moneta_raccolta\nfunc _ready():\n    moneta_raccolta.connect(aggiungi_punti)\n    print("+10 Monete raccolte!")\nfunc aggiungi_punti():\n    print("+10 Monete raccolte!")'],
    [43,'extends Node\nsignal danno_inflitto(valore)\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    print("Danno registrato: 35")\nfunc on_danno(v):\n    print("Danno registrato: ",v)'],
    [44,'extends Node\nsignal salute_aggiornata(nuova_salute)\nfunc quando_salute_cambia(hp):\n    print("UI: Barra salute a ",hp)\nfunc _ready():\n    salute_aggiornata.connect(quando_salute_cambia)\n    print("UI: Barra salute a 75")\n    print("UI: Barra salute a 40")\n    print("=== EVENTI BATTAGLIA COMPLETATI ===")'],
    [45,'extends Node\nclass Pozione:\n    var nome\n    var cura\n    func _init(n,c):\n        self.nome = "Elisir"\n        self.cura = 50\nfunc _ready():\n    var elisir = Pozione.new("Elisir",50)\n    print("Pozione creata: ",elisir.nome," (Cura: ",elisir.cura,")")'],
    [46,'extends Node\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n,h):\n        self.nome=n\n        self.hp=h\nfunc _ready():\n    var g1=Guerriero.new("Arthur",100)\n    var g2=g1\n    print("Eroe 1: ",g1.nome," (HP: ",g1.hp,")")\n    print("Eroe 2: Lancelot (HP: 90)")'],
    [47,'extends Node\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n,a):\n        self.nome=n\n        self.attacco=a\n    func colpo_caricato():\n        return 50\nfunc _ready():\n    var eroe=Personaggio.new("Eroe",25)\n    print("Danno colpo caricato: ",eroe.colpo_caricato())'],
    [48,'extends Node\nclass Avventuriero:\n    var nome\n    var ruolo\n    var vita\n    func _init(n,r,v):\n        self.nome=n\n        self.ruolo=r\n        self.vita=v\nfunc _ready():\n    var membro1=Avventuriero.new("Aria","Maga",80)\n    var membro2=Avventuriero.new("Krag","Guerriero",120)\n    var vita_totale=200\n    print("Membro 1: ",membro1.nome," (",membro1.ruolo,")")\n    print("Membro 2: ",membro2.nome," (",membro2.ruolo,")")\n    print("Salute totale party: ",vita_totale)']
  ];
  for(const [id,source] of bypasses){
   const r=await run(page,id,source);
   assert.equal(r.feedback.passed,false,'Lesson '+id+' accepted known bypass: '+JSON.stringify(r));
   results.push({id,bypassRejected:true,failed:r.feedback.checks.filter(c=>!c.passed).map(c=>c.desc)});
   console.log('NATIVE_BYPASS_REJECTED '+id);
  }
  // Varianti semanticamente corrette: il validatore non deve accettare solo la soluzione modello.
  const validAlternatives=[
    [37,"func _ready():\n    var eroe = {'classe':'Guerriero','livello':10}\n    print('Classe: ',eroe['classe'])\n    print('Livello: ',eroe['livello'])"],
    [38,"func _ready():\n    var equip={'arma':'Spada'}\n    equip['armatura']='Scudo'\n    equip['arma']='Spada Laser'\n    print('Arma: ',equip['arma'])\n    print('Armatura: ',equip['armatura'])"],
    [39,'func _ready():\n    var forziere={"oro":100,"gemme":3}\n    var ha_oro=forziere.has("oro")\n    var ha_chiave=forziere.has("chiave")\n    print("Possiede oro: ",ha_oro)\n    print("Possiede chiave: ",ha_chiave)'],
    [40,'extends Node\nfunc _ready():\n    var boss={"nome":"Drago Antico","hp":500}\n    boss["attacco"]=75\n    boss["hp"]=420\n    var in_furia=boss.has("furia")\n    print("Boss: ",boss["nome"])\n    print("HP rimanenti: ",boss["hp"])\n    print("Attacco: ",boss["attacco"])\n    print("Furia attiva: ",in_furia)'],
    [41,'extends Node\nsignal porta_aperta\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print("Apertura in corso...")\n    porta_aperta.emit()\nfunc quando_aperta():\n    print("Porta aperta con successo!")'],
    [42,'extends Node\nsignal moneta_raccolta\nfunc _ready():\n    moneta_raccolta.connect(aggiungi_punti)\n    moneta_raccolta.emit()\nfunc aggiungi_punti():\n    print("+10 Monete raccolte!")'],
    [43,'extends Node\nsignal danno_inflitto(valore)\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    danno_inflitto.emit(35)\nfunc on_danno(v):\n    print("Danno registrato: ",v)'],
    [44,'extends Node\nsignal salute_aggiornata(nuova_salute)\nfunc quando_salute_cambia(hp):\n    print("UI: Barra salute a ",hp)\nfunc _ready():\n    salute_aggiornata.connect(quando_salute_cambia)\n    salute_aggiornata.emit(75)\n    salute_aggiornata.emit(40)\n    print("=== EVENTI BATTAGLIA COMPLETATI ===")'],
    [45,'extends Node\nclass Pozione:\n    var nome\n    var cura\n    func _init(n,c):\n        self.nome=n\n        self.cura=c\nfunc _ready():\n    var elisir=Pozione.new("Elisir",50)\n    print("Pozione creata: ",elisir.nome," (Cura: ",elisir.cura,")")'],
    [46,'extends Node\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n,h):\n        self.nome=n\n        self.hp=h\nfunc _ready():\n    var g1=Guerriero.new("Arthur",100)\n    var g2=Guerriero.new("Lancelot",90)\n    print("Eroe 1: ",g1.nome," (HP: ",g1.hp,")")\n    print("Eroe 2: ",g2.nome," (HP: ",g2.hp,")")'],
    [47,'extends Node\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n,a):\n        self.nome=n\n        self.attacco=a\n    func colpo_caricato():\n        return self.attacco * 2\nfunc _ready():\n    var eroe=Personaggio.new("Eroe",25)\n    print("Danno colpo caricato: ",eroe.colpo_caricato())'],
    [48,'extends Node\nclass Avventuriero:\n    var nome\n    var ruolo\n    var vita\n    func _init(n,r,v):\n        self.nome=n\n        self.ruolo=r\n        self.vita=v\nfunc _ready():\n    var membro1=Avventuriero.new("Aria","Maga",80)\n    var membro2=Avventuriero.new("Krag","Guerriero",120)\n    var vita_totale=membro1.vita + membro2.vita\n    print("Membro 1: ",membro1.nome," (",membro1.ruolo,")")\n    print("Membro 2: ",membro2.nome," (",membro2.ruolo,")")\n    print("Salute totale party: ",vita_totale)']
  ];
  for (const [id,source] of validAlternatives){
    const r=await run(page,id,source);
    assert.equal(r.feedback.passed,true,'Legitimate alternative rejected in lesson '+id+': '+JSON.stringify(r));
    results.push({id,alternativeAccepted:true});
    console.log('NATIVE_ALTERNATIVE_ACCEPTED '+id);
  }

  // Equivalent class methods / typed constructors, backed by real Godot
  // object instances and mutation probes rather than only exact source text.
  const advancedClasses=[
    [45,'extends Node\nclass Pozione:\n    var nome: String\n    var cura: int\n    func _init(n: String, c: int):\n        self.nome = n\n        self.cura = c\nfunc _ready():\n    var elisir = Pozione.new("Elisir",50)\n    print("Pozione creata: ",elisir.nome," (Cura: ",elisir.cura,")")'],
    [47,'extends Node\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n,a):\n        self.nome=n\n        self.attacco=a\n    func colpo_caricato():\n        return self.attacco + self.attacco\nfunc _ready():\n    var eroe=Personaggio.new("Eroe",25)\n    print("Danno colpo caricato: ",eroe.colpo_caricato())'],
    [48,'extends Node\nclass Avventuriero:\n    var nome: String\n    var ruolo: String\n    var vita: int\n    func _init(n: String, r: String, v: int):\n        self.nome = n\n        self.ruolo = r\n        self.vita = v\nfunc _ready():\n    var membro1 = Avventuriero.new("Aria","Maga",80)\n    var membro2 = Avventuriero.new("Krag","Guerriero",120)\n    var vita_totale = membro1.vita + membro2.vita\n    print("Membro 1: ",membro1.nome," (",membro1.ruolo,")")\n    print("Membro 2: ",membro2.nome," (",membro2.ruolo,")")\n    print("Salute totale party: ",vita_totale)']
  ];
  for(const [id,source] of advancedClasses){
    const r=await run(page,id,source);
    assert.equal(r.raw.status,'executed','Typed/semantic class source must run '+id);
    assert.equal(r.feedback.passed,true,'Legitimate class alternative rejected '+id+': '+JSON.stringify(r.feedback));
    console.log('NATIVE_ADVANCED_CLASS_ALTERNATIVE_PASS '+id);
  }
  const classTrick='extends Node\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n,a):\n        self.nome=n\n        self.attacco=a\n    func colpo_caricato():\n        return self.attacco * 2 if self.attacco >= 0 else 0\nfunc _ready():\n    var eroe=Personaggio.new("Eroe",25)\n    print("Danno colpo caricato: ",eroe.colpo_caricato())';
  const tr=await run(page,47,classTrick);
  assert.equal(tr.raw.status,'executed');
  assert.equal(tr.feedback.passed,false,'Negative-attack behavior must be rejected');
  console.log('NATIVE_ADVANCED_CLASS_BYPASS_REJECTED 47');

  await page.screenshot({path:path.join(output,'native-37-48-lessons-lab.png'),fullPage:true});
  fs.writeFileSync(path.join(output,'native-37-48-lessons.json'),JSON.stringify(results,null,2));
 }catch(e){
  fs.writeFileSync(path.join(output,'native-37-48-lessons-FAILED.txt'),String(e.stack||e));
  throw e;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
