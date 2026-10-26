'use strict';
/* Native Godot exercise parity test for the real lessons 13-24.
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
  for(let id=13;id<=24;id++){
   const r=await run(page,id,null);
   const failed=r.feedback.checks.filter(c=>!c.passed);
   assert.equal(r.raw.status,'executed','Native execution failed lesson '+id);
   assert.equal(r.feedback.passed,true,'Official lesson '+id+' failed native grading: '+JSON.stringify({failed,raw:r.raw,stdout:r.stdout}));
   assert.equal(r.feedback.verdict,'accepted','Missing standard acceptance verdict '+id);
   assert.equal(r.feedback.demoOnly,true,'Untrusted grading cannot attest XP '+id);
   if([13,17,18,19,20].includes(id))assert.equal(r.raw.localCapture,'not_requested','Expected direct verification: '+id);
   else assert.equal(r.raw.localCapture,'instrumented','Local capture missing: '+id);
   results.push({id,positive:true,stdout:r.stdout,locals:r.raw.locals});
   console.log('NATIVE_LESSON_PASS '+id+' '+JSON.stringify({capture:r.raw.localCapture,stdout:r.stdout}));
  }
  const bypasses=[
    [13,'func _ready():\n    var somma = 15\n    var prodotto = 10\n    var inutile = 1 + 2 * 3\n    print(somma)\n    print(prodotto)'],
    [14,'func _ready():\n    var punti_vita = 80\n    var altra = 8\n    altra -= 2\n    print(punti_vita)'],
    [15,'func _ready():\n    var monete_base = 50\n    var moltiplicatore = 3\n    var monete_totali = 150\n    var inutile = monete_base * 1\n    print(monete_totali)'],
    [16,'extends Node\nfunc _ready():\n    var salute_rimasta = 65\n    var monete_per_membro = 33\n    var monete_avanzate = 1\n    var dummy = 40\n    dummy -= 1\n    var d2 = 7 % 3\n    print("Salute Guerriero: ", salute_rimasta)\n    print("Monete per membro: ", monete_per_membro)\n    print("Monete avanzate: ", monete_avanzate)'],
    [17,'func _ready():\n    var livello = 10\n    if livello >= 10:\n        print("Livello raggiunto!")\n    else:\n        print("Livello raggiunto!")'],
    [18,'func _ready():\n    var ha_chiave = true\n    var porta_chiusa = true\n    if ha_chiave and porta_chiusa:\n        print("Accesso consentito")\n    else:\n        print("Accesso consentito")'],
    [19,'func _ready():\n    var punti_vita = 0\n    if punti_vita <= 0:\n        print("Game Over")\n    else:\n        print("Game Over")'],
    [20,'extends Node\nfunc _ready():\n    var energia = 75\n    var ha_amuleto = true\n    var ha_chiave = false\n    var stato_portale = ""\n    if energia >= 50 and (ha_amuleto or ha_chiave):\n        stato_portale = "Portale Attivato"\n    elif energia < 50:\n        stato_portale = "Portale Attivato"\n    else:\n        stato_portale = "Nessuna Reliquia Trovata"\n    print("Stato: ", stato_portale)'],
    [21,'func _ready():\n    var inventario = ["Spada", "Scudo", "Pozione"]\n    print("Spada")'],
    [22,'func _ready():\n    var oggetti = ["Spada", "Scudo", "Pozione"]\n    print("Scudo")\n    print("Pozione")'],
    [23,'func _ready():\n    var inventario = ["Mappa", "Bussola", "Torcia"]\n    var tmp = []\n    tmp.append("a")\n    print(tmp.size())\n    print(3)'],
    [24,'extends Node\nfunc _ready():\n    var zaino = ["Spada", "Pozione di Vita", "Arco Elfico"]\n    var ha_cura = true\n    var totale_slot = 3\n    print("Zaino: ", zaino)\n    print("Ha pozione: ", ha_cura)\n    print("Totale slot: ", totale_slot)']
  ];
  for(const [id,source] of bypasses){
   const r=await run(page,id,source);
   assert.equal(r.feedback.passed,false,'Lesson '+id+' accepted known bypass: '+JSON.stringify(r));
   results.push({id,bypassRejected:true,failed:r.feedback.checks.filter(c=>!c.passed).map(c=>c.desc)});
   console.log('NATIVE_BYPASS_REJECTED '+id);
  }
  // Varianti semanticamente corrette: il validatore non deve accettare solo la soluzione modello.
  const validAlternatives=[
    [13,'func _ready():\n    var somma = 5 + 10\n    var prodotto = 2 * 5\n    print(somma)\n    print(prodotto)'],
    [14,'func _ready():\n    var punti_vita: int = 100\n    punti_vita -= 20\n    print(punti_vita)'],
    [15,'func _ready():\n    var monete_base = 25 * 2\n    var moltiplicatore = 3\n    var monete_totali = monete_base * moltiplicatore\n    print(monete_totali)'],
    [17,'func _ready():\n    var livello: int = 10\n    if livello >= 10:\n        print("Livello raggiunto!")'],
    [18,'func _ready():\n    var ha_chiave: bool = true\n    var porta_chiusa = true\n    if (ha_chiave and porta_chiusa):\n        print("Accesso consentito")'],
    [21,'func _ready():\n    var inventario: Array[String] = ["Spada", "Scudo", "Pozione"]\n    print(inventario[0])'],
    [22,'func _ready():\n    var oggetti := ["Spada", "Scudo", "Pozione"]\n    print(oggetti[1])\n    print(oggetti[2])'],
    [23,"func _ready():\n    var inventario = ['Mappa', 'Bussola']\n    inventario.append('Torcia')\n    print(inventario.size())"]
  ];
  for (const [id,source] of validAlternatives){
    const r=await run(page,id,source);
    assert.equal(r.feedback.passed,true,'Legitimate alternative rejected in lesson '+id+': '+JSON.stringify(r));
    results.push({id,alternativeAccepted:true});
    console.log('NATIVE_ALTERNATIVE_ACCEPTED '+id);
  }

  // Distinct, idiomatic Godot syntax: typed arithmetic and grouped conditions.
  const qualityAlternatives=[
    [13,'func _ready():\n    var somma: int = 10 + 5\n    var prodotto: int = 5 * 2\n    print(somma)\n    print(prodotto)'],
    [17,'func _ready():\n    var livello: int = 10\n    if (livello >= 10):\n        print("Livello raggiunto!")']
  ];
  for(const [id,source] of qualityAlternatives){
    const r=await run(page,id,source);
    assert.equal(r.raw.status,'executed','Native Godot rejected valid syntax: '+id);
    assert.equal(r.feedback.passed,true,'Quality regression: valid GDScript rejected in '+id+': '+JSON.stringify(r));
    console.log('NATIVE_IDIOMATIC_ALTERNATIVE_PASS '+id);
  }

  // The base case looks right. The altered level=9 branch is silent BUT emits
  // a native error: scenario grading must not count it as a passing branch.
  const brokenScenario='func _ready():\n    var livello = 10\n    if livello >= 10:\n        print("Livello raggiunto!")\n    else:\n        push_error("GDH_EXPECTED_BRANCH_ERROR")';
  const branch=await run(page,17,brokenScenario);
  assert.equal(branch.raw.status,'executed');
  assert.equal(branch.stdout.trim(),'Livello raggiunto!');
  assert.equal(branch.feedback.passed,false,
    'Correct default output cannot hide a Godot error in mutated scenario');
  assert.equal(branch.feedback.checks.find(x=>x.desc.includes('livello 9'))?.passed,false);
  console.log('NATIVE_SCENARIO_ENGINE_ERROR_REJECTED');

  // Behaviorally different, legitimately correct implementations, not mere whitespace.
  const richAlternatives=[
    [17,'func _ready():\n    var livello: int = 10\n    if livello > 9:\n        print("Livello raggiunto!")'],
    [19,'func _ready():\n    var punti_vita: int = 0\n    if punti_vita < 1:\n        print("Game Over")\n    else:\n        print("In battaglia")'],
    [20,'extends Node\nfunc _ready():\n    var energia: int = 75\n    var ha_amuleto: bool = true\n    var ha_chiave: bool = false\n    var stato_portale: String = ""\n    if energia > 49 and (ha_chiave or ha_amuleto):\n        stato_portale = "Portale Attivato"\n    elif energia <= 49:\n        stato_portale = "Energia Insufficiente"\n    else:\n        stato_portale = "Nessuna Reliquia Trovata"\n    print("Stato: ", stato_portale)']
  ];
  for(const [id,source] of richAlternatives){
    const r=await run(page,id,source);
    assert.equal(r.raw.status,'executed','Alternative valid Godot GDScript rejected: '+id);
    assert.equal(r.feedback.passed,true,'Correct alternative failed in '+id+': '+JSON.stringify(r.feedback));
    console.log('NATIVE_SEMANTIC_ALTERNATIVE_PASS '+id);
  }

  // Counterexamples which passed the earlier, smaller scenario matrices.
  const boundaryBypasses=[
    [17,'func _ready():\n    var livello = 10\n    if livello >= 10:\n        if livello == 10:\n            print("Livello raggiunto!")','livello 11'],
    [19,'func _ready():\n    var punti_vita = 0\n    if punti_vita <= 0:\n        if punti_vita == 0:\n            print("Game Over")\n    else:\n        print("In battaglia")','salute -5'],
    [20,'extends Node\nfunc _ready():\n    var energia = 75\n    var ha_amuleto = true\n    var ha_chiave = false\n    var stato_portale = ""\n    if energia >= 50 and (ha_amuleto or ha_chiave):\n        if energia > 50:\n            stato_portale = "Portale Attivato"\n    elif energia < 50:\n        stato_portale = "Energia Insufficiente"\n    else:\n        stato_portale = "Nessuna Reliquia Trovata"\n    print("Stato: ",stato_portale)','energia 50']
  ];
  for(const [id,source,label] of boundaryBypasses){
    const r=await run(page,id,source);
    assert.equal(r.raw.status,'executed','Adversarial candidate should run in Godot: '+id);
    assert.equal(r.feedback.passed,false,'Missing boundary test should reject: '+id+' '+JSON.stringify(r.feedback));
    assert.ok(r.feedback.checks.some(c=>c.desc.includes(label)&&!c.passed),
      'The native '+label+' scenario must specifically catch the bypass in '+id);
    console.log('NATIVE_BOUNDARY_BYPASS_REJECTED '+id);
  }

  await page.screenshot({path:path.join(output,'native-13-24-lessons-lab.png'),fullPage:true});
  fs.writeFileSync(path.join(output,'native-13-24-lessons.json'),JSON.stringify(results,null,2));
 }catch(e){
  fs.writeFileSync(path.join(output,'native-13-24-lessons-FAILED.txt'),String(e.stack||e));
  throw e;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
