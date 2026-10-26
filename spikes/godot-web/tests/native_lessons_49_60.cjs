'use strict';
/* Native Godot exercise parity test for the real lessons 49-60.
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
  for(let id=49;id<=60;id++){
   const r=await run(page,id,null);
   const failed=r.feedback.checks.filter(c=>!c.passed);
   assert.equal(r.raw.status,'executed','Native execution failed lesson '+id);
   assert.equal(r.feedback.passed,true,'Official lesson '+id+' failed native grading: '+JSON.stringify({failed,raw:r.raw,stdout:r.stdout}));
   assert.equal(r.feedback.verdict,'accepted','Missing accepted verdict on scene lesson '+id);
   assert.equal(r.feedback.demoOnly,true,'Scene grading must be demo-only');
   
   results.push({id,positive:true,stdout:r.stdout,locals:r.raw.locals});
   console.log('NATIVE_LESSON_PASS '+id+' '+JSON.stringify({capture:r.raw.localCapture,stdout:r.stdout}));
  }
  // Mutation-based negatives: generated directly from each official GDScript solution.
  const mutations={
    49: src=>src.replace('print("Nodo rilevato: ", $Giocatore.name)','print("Nodo rilevato: Giocatore")'),
    50: src=>src.replace('$Titolo.text = "Benvenuto in Godot 4!"','pass')
               .replace('print("Testo a schermo: ", $Titolo.text)','print("Testo a schermo: Benvenuto in Godot 4!")'),
    51: src=>src.replace('$SaluteLabel.text = "HP: 75"','pass')
               .replace('print("Nuova salute: ", $SaluteLabel.text)','print("Nuova salute: HP: 75")'),
    52: src=>src.replace('$TitoloDungeon.text = "Caverna dei Goblin"','pass'),
    53: src=>src.replace('$AttaccaBtn.text = "Sferra Attacco"','pass')
               .replace('print("Pulsante configurato: ", $AttaccaBtn.text)','print("Pulsante configurato: Sferra Attacco")'),
    54: src=>src.replace('$AttaccaBtn.pressed.connect(quando_premuto)','quando_premuto()'),
    55: src=>src.replace('punti += 1','punti = 1'),
    56: src=>src.replace('$MotoriBtn.pressed.connect(attiva_motori)','attiva_motori()'),
    57: src=>src.replace('$Cooldown.start()','pass'),
    58: src=>src.replace('$BarraVita.color = "#22c55e"','pass'),
    59: src=>src.replace('$Moneta.queue_free()','pass'),
    60: src=>src.replace('monete -= 25','monete = 75')
  };
  for(const [rawId,mutate] of Object.entries(mutations)){
    const id=Number(rawId);
    const original=await page.evaluate(id=>window.GDHLessonLab.get(id).solution,id);
    const bad=mutate(original);
    assert.notEqual(bad,original,'Negative mutation must change lesson '+id);
    const r=await run(page,id,bad);
    assert.equal(r.feedback.passed,false,'Lesson '+id+' accepted known bypass: '+JSON.stringify(r));
    results.push({id,bypassRejected:true,failed:r.feedback.checks.filter(c=>!c.passed).map(c=>c.desc)});
    console.log('NATIVE_BYPASS_REJECTED '+id);
  }
  // Correct independent formatting variants, not byte-identical to model answers.
  // For this phase the main value is executing real scenes, not requiring exact source bytes.
  for(let id=49;id<=60;id++){
    const original=await page.evaluate(id=>window.GDHLessonLab.get(id).solution,id);
    const modified='# Esecuzione alternativa con un commento di contesto\n'+original.replace(
      /print\("/, 'print( "'
    );
    assert.notEqual(modified,original);
    const r=await run(page,id,modified);
    assert.equal(r.feedback.passed,true,'Valid source variant rejected in lesson '+id+': '+JSON.stringify(r));
    results.push({id,alternativeAccepted:true});
    console.log('NATIVE_ALTERNATIVE_ACCEPTED '+id);
  }

  // A correct-looking UI state can still be accompanied by an engine error.
  // The error only happens during the second click, so the default probe looks fine.
  const brokenClick='var punti = 0\nfunc _ready():\n    $ClickBtn.pressed.connect(al_click)\n    print("Clicker pronto")\nfunc al_click():\n    punti += 1\n    $PuntiLabel.text = "Click: " + str(punti)\n    print($PuntiLabel.text)\n    if punti == 2:\n        push_error("GDH_CLICK_TWO_ERR")';
  const badClick=await run(page,55,brokenClick);
  assert.equal(badClick.raw.status,'executed','Two-click adversary must run');
  assert.equal(badClick.feedback.passed,false,'An error on the second click must fail');
  assert.ok(badClick.feedback.checks.some(c=>c.desc.includes('Due clic')&&!c.passed));
  console.log('NATIVE_SCENE_HIDDEN_SECOND_CLICK_ERROR_REJECTED');

  // Typed instance state should not skip the low-funds behavior probe.
  const typedShop='extends Node\nvar monete: int = 100\nfunc _ready():\n    $CompraPozioneBtn.pressed.connect(compra_pozione)\n    print("Bottega Aperta")\nfunc compra_pozione():\n    if monete >= 25:\n        monete -= 25\n        $OroLabel.text = "Monete: " + str(monete)\n        $MessaggioLabel.text = "Pozione Acquistata!"\n    else:\n        $MessaggioLabel.text = "Oro Insufficiente!"\n    print($MessaggioLabel.text)';
  const typedShopGrade=await run(page,60,typedShop);
  assert.equal(typedShopGrade.raw.status,'executed');
  assert.equal(typedShopGrade.feedback.passed,true,'Typed shop should preserve all scenarios: '+JSON.stringify(typedShopGrade.feedback));
  console.log('NATIVE_SCENE_TYPED_SHOP_ALTERNATIVE_PASS');

  // A shop which raises an error only after funds run out must be rejected,
  // even though the printed message and native Label/coin states are correct.
  const damagedShop=typedShop.replace('    else:\n        $MessaggioLabel', '    else:\n        push_error("GDH_EMPTY_SHOP_ERR")\n        $MessaggioLabel');
  const damaged=await run(page,60,damagedShop);
  assert.equal(damaged.raw.status,'executed');
  assert.equal(damaged.feedback.passed,false,'Hidden low-money engine error must not pass');
  assert.ok(damaged.feedback.checks.some(c=>c.desc.includes('monete = 20')&&!c.passed));
  console.log('NATIVE_SCENE_HIDDEN_LOW_FUNDS_ERROR_REJECTED');

  // If a native behavioral probe is missing, valid GDScript is inconclusive,
  // not a confirmed failed requirement.
  const missingProbe=await page.evaluate(()=>{
    const lesson=window.GDHLessonLab.get(60);
    return window.GDHLessonLab.grade(60,lesson.solution,{status:'executed'},'', '',{});
  });
  assert.equal(missingProbe.verdict,'inconclusive');
  assert.equal(missingProbe.passed,false);
  assert.equal(missingProbe.demoOnly,true);
  console.log('NATIVE_SCENE_MISSING_PROBE_INCONCLUSIVE');

  await page.screenshot({path:path.join(output,'native-49-60-lessons-lab.png'),fullPage:true});
  fs.writeFileSync(path.join(output,'native-49-60-lessons.json'),JSON.stringify(results,null,2));
 }catch(e){
  fs.writeFileSync(path.join(output,'native-49-60-lessons-FAILED.txt'),String(e.stack||e));
  throw e;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
