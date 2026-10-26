'use strict';
/* Native Godot exercise parity test for the real lessons 25-36.
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
  for(let id=25;id<=36;id++){
   const r=await run(page,id,null);
   const failed=r.feedback.checks.filter(c=>!c.passed);
   assert.equal(r.raw.status,'executed','Native execution failed lesson '+id);
   assert.equal(r.feedback.passed,true,'Official lesson '+id+' failed native grading: '+JSON.stringify({failed,raw:r.raw,stdout:r.stdout}));
   if(![25,29,30].includes(id))assert.equal(r.raw.localCapture,'instrumented','Local capture missing: '+id);
   results.push({id,positive:true,stdout:r.stdout,locals:r.raw.locals});
   console.log('NATIVE_LESSON_PASS '+id+' '+JSON.stringify({capture:r.raw.localCapture,stdout:r.stdout}));
  }
  const bypasses=[
    [25,'func _ready():\n    print(0)\n    print(1)\n    print(2)'],
    [26,'func _ready():\n    var nemici = ["Goblin", "Orco", "Drago"]\n    print("Goblin")\n    print("Orco")\n    print("Drago")'],
    [27,'func _ready():\n    var conto = 1\n    while conto <= 3:\n        conto += 1\n    print("Conto: 1")\n    print("Conto: 2")\n    print("Conto: 3")'],
    [28,'extends Node\nfunc _ready():\n    var nemici = ["Slime", "Scheletro", "Spettro", "Boss Drago"]\n    var xp_totali = 0\n    for nemico in nemici:\n        xp_totali += 25\n    print("Allerta: Slime")\n    print("Allerta: Scheletro")\n    print("Allerta: Spettro")\n    print("Allerta: Boss Drago")\n    print("XP Totali: ",xp_totali)'],
    [29,'func altra():\n    print("Nodo Inizializzato")\nfunc _ready():\n    pass'],
    [30,'func saluta(nome):\n    print("Ciao Eroe")\nfunc _ready():\n    saluta("Eroe")'],
    [31,'func calcola_danno(attacco, difesa):\n    return 25\nfunc _ready():\n    var danno = calcola_danno(30,5)\n    print(danno)'],
    [32,'extends Node\nfunc calcola_colpo(attacco: int, critico: bool) -> int:\n    if critico:\n        return 30 * 2\n    else:\n        return 30\nfunc _ready():\n    var normale = calcola_colpo(30,false)\n    var critico = calcola_colpo(30,true)\n    print("Colpo normale: ",normale)\n    print("Colpo critico: ",critico)'],
    [33,'func _ready():\n    var posizione = Vector2(100,200)\n    print("(100.0, 200.0)")'],
    [34,'func _ready():\n    var posizione = Vector2(150,200)\n    var velocita = 50\n    print(posizione)'],
    [35,'func _ready():\n    var pos = Vector2(120,180)\n    print(pos)'],
    [36,'extends Node\nfunc _ready():\n    var posizione = Vector2(150,170)\n    var stazione = Vector2(150,170)\n    var atterrato = true\n    print("Posizione finale: ",posizione)\n    print("Stazione raggiunta: ",atterrato)']
  ];
  for(const [id,source] of bypasses){
   const r=await run(page,id,source);
   assert.equal(r.feedback.passed,false,'Lesson '+id+' accepted known bypass: '+JSON.stringify(r));
   results.push({id,bypassRejected:true,failed:r.feedback.checks.filter(c=>!c.passed).map(c=>c.desc)});
   console.log('NATIVE_BYPASS_REJECTED '+id);
  }
  // Varianti semanticamente corrette: il validatore non deve accettare solo la soluzione modello.
  const validAlternatives=[
    [25,'func _ready():\n    # Segui le coordinate della sequenza\n    for i in range(3):\n        print(i)'],
    [26,"func _ready():\n    var nemici = ['Goblin','Orco','Drago']\n    for nemico in nemici:\n        print(nemico)"],
    [27,'func _ready():\n    var conto: int = 1\n    while conto <= 3:\n        print("Conto: " + str(conto))\n        conto += 1'],
    [28,'extends Node\nfunc _ready():\n    var nemici = ["Slime", "Scheletro", "Spettro", "Boss Drago"]\n    var xp_totali = 0\n    for nemico in nemici:\n        print("Allerta: ",nemico)\n        xp_totali += 25\n    print("XP Totali: ",xp_totali)'],
    [30,"func saluta(nome):\n    print('Ciao ' + nome)\nfunc _ready():\n    saluta('Eroe')"],
    [31,'func calcola_danno(attacco, difesa):\n    return attacco - difesa\nfunc _ready():\n    var danno = calcola_danno(30,5)\n    print(danno)'],
    [33,'func _ready():\n    var posizione: Vector2 = Vector2(100,200)\n    print(posizione)'],
    [34,'func _ready():\n    var posizione = Vector2(100,200)\n    var velocita: int = 50\n    posizione.x += velocita\n    print(posizione)'],
    [35,'func _ready():\n    var pos: Vector2 = Vector2(100,200)\n    pos.x += 20\n    pos.y -= 20\n    print(pos)'],
    [36,'extends Node\nfunc _ready():\n    var posizione: Vector2 = Vector2(100,200)\n    posizione.x += 50\n    posizione.y -= 30\n    var stazione = Vector2(150,170)\n    var atterrato: bool = (posizione.x == stazione.x and posizione.y == stazione.y)\n    print("Posizione finale: ",posizione)\n    print("Stazione raggiunta: ",atterrato)']
  ];
  for (const [id,source] of validAlternatives){
    const r=await run(page,id,source);
    assert.equal(r.feedback.passed,true,'Legitimate alternative rejected in lesson '+id+': '+JSON.stringify(r));
    results.push({id,alternativeAccepted:true});
    console.log('NATIVE_ALTERNATIVE_ACCEPTED '+id);
  }

  await page.screenshot({path:path.join(output,'native-25-36-lessons-lab.png'),fullPage:true});
  fs.writeFileSync(path.join(output,'native-25-36-lessons.json'),JSON.stringify(results,null,2));
 }catch(e){
  fs.writeFileSync(path.join(output,'native-25-36-lessons-FAILED.txt'),String(e.stack||e));
  throw e;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
