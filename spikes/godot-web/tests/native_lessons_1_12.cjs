'use strict';
/* Native Godot exercise parity test for the real lessons 1-12.
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
  for(let id=1;id<=12;id++){
   const r=await run(page,id,null);
   const failed=r.feedback.checks.filter(c=>!c.passed);
   assert.equal(r.raw.status,'executed','Native execution failed lesson '+id);
   assert.equal(r.feedback.passed,true,'Official lesson '+id+' failed native grading: '+JSON.stringify({failed,raw:r.raw,stdout:r.stdout}));
   if(id>=5)assert.equal(r.raw.localCapture,'instrumented','Local capture missing: '+id);
   results.push({id,positive:true,stdout:r.stdout,locals:r.raw.locals});
   console.log('NATIVE_LESSON_PASS '+id+' '+JSON.stringify({capture:r.raw.localCapture,stdout:r.stdout}));
  }
  const bypasses=[
    [2,'func _ready():\n    # Inserisci il tuo commento e stampa la frase richiesta\n    print("Benvenuto nel gioco")'],
    [3,'func _ready():\n    var x = "1"\n    print("Livello")\n    print(x)'],
    [4,'extends Node\nfunc _ready():\n    # Non modificare la riga sotto\n    print("=== AVVIO SISTEMA ===")\n    print("Sistema: Godot OS")\n    print("Energia: ",100,"%")\n    print("=== DIAGNOSTICA COMPLETATA ===")'],
    [5,'func _ready():\n    var nome = "Eroe"\n    print("Eroe")'],
    [6,'func _ready():\n    var nome_giocatore = "Eroe"\n    print(nome_giocatore)'],
    [7,'func _ready():\n    var nome = "Eroe"\n    var messaggio = "Giocatore: Eroe"\n    var unused = nome + ""\n    print(messaggio)'],
    [8,'extends Node\nfunc _ready():\n    var title = \'The "Lost" Key\'\n    var npc_line = "It\'s dangerous to go alone!"\n    var door_code = "0420"'],
    [9,'func _ready():\n    var velocita = 4.5\n    var ha_chiave = true\n    print("4.5")\n    print("true")'],
    [10,'func _ready():\n    var vita = 100\n    var dummy: int = 0\n    print(vita)'],
    [11,'func _ready():\n    const GRAVITA = 9.8\n    print(9.8)'],
    [12,'extends Node\nconst MAX_HP = 200\nfunc _ready():\n    var eroe = "Valerius"\n    var salute = 150\n    var scudo_attivo = true\n    var dummy := 3\n    print("Eroe: ",eroe)\n    print("HP: ",salute," / ",MAX_HP)\n    print("Scudo: ",scudo_attivo)']
  ];
  for(const [id,source] of bypasses){
   const r=await run(page,id,source);
   assert.equal(r.feedback.passed,false,'Lesson '+id+' accepted known bypass: '+JSON.stringify(r));
   results.push({id,bypassRejected:true,failed:r.feedback.checks.filter(c=>!c.passed).map(c=>c.desc)});
   console.log('NATIVE_BYPASS_REJECTED '+id);
  }
  // Varianti semanticamente corrette: il validatore non deve accettare solo la soluzione modello.
  const validAlternatives=[
    [1,"func _ready():\n    print('Ciao Godot!')\n"],
    [2,'func _ready():\n    # Il mio primo commento\n    print("Benvenuto nel gioco")\n'],
    [3,'func _ready():\n    var numero: int = 1\n    print("Livello")\n    print(numero)\n'],
    [5,'func _ready():\n    var nome: String = "Eroe"\n    print(nome)\n'],
    [10,'func _ready():\n    var vita: int = 60 + 40\n    print(vita)\n'],
    [11,'const GRAVITA: float = 9.8\nfunc _ready():\n    print(GRAVITA)\n']
  ];
  for (const [id,source] of validAlternatives){
    const r=await run(page,id,source);
    assert.equal(r.feedback.passed,true,'Legitimate alternative rejected in lesson '+id+': '+JSON.stringify(r));
    results.push({id,alternativeAccepted:true});
    console.log('NATIVE_ALTERNATIVE_ACCEPTED '+id);
  }

  // The initial stdout can look correct, but a real engine error must prevent credit.
  const runtimeErrorSource='func _ready():\n    print("Ciao Godot!")\n    push_error("GDH_EXPECTED_RUNTIME_ERROR")';
  const runtimeError=await run(page,1,runtimeErrorSource);
  const errorStream=await page.locator('#stderr').textContent();
  assert.match(errorStream,/GDH_EXPECTED_RUNTIME_ERROR/,'Godot error diagnostic should reach the browser');
  assert.equal(runtimeError.feedback.passed,false,
    'The correct stdout followed by a Godot error must NOT pass: '+JSON.stringify(runtimeError.feedback));
  assert.equal(runtimeError.feedback.checks.some(c=>c.desc.includes('Nessun errore')&&!c.passed),true,
    'Engine error must be explicitly identified in lesson feedback');
  console.log('NATIVE_ERROR_AFTER_CORRECT_OUTPUT_REJECTED');

  await page.screenshot({path:path.join(output,'native-12-lessons-lab.png'),fullPage:true});
  fs.writeFileSync(path.join(output,'native-12-lessons.json'),JSON.stringify(results,null,2));
 }catch(e){
  fs.writeFileSync(path.join(output,'native-12-lessons-FAILED.txt'),String(e.stack||e));
  throw e;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
