'use strict';
/**
 * Phase 2: real Verifica il codice button -> native Godot grading in sandbox.
 * Explicit loopback-only flag, zero XP, zero local/cloud progress and reversible
 * fallback to preexisting JS runtime. No external HTTPS or real Supabase access.
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const spike=path.resolve(__dirname,'..'),repo=path.resolve(spike,'../..');
const output=path.join(spike,'test-artifacts');fs.mkdirSync(output,{recursive:true});
const host='http://127.0.0.1:18767',runner='http://localhost:18768';
const servers=[
 spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',repo],{stdio:'ignore'}),
 spawn('python3',[path.join(spike,'tests','cors_server.py'),'18768',path.join(spike,'web')],{stdio:'ignore'})
];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitHttp(url){
 for(let i=0;i<100;i++){
  const ok=await new Promise(resolve=>http.get(url,response=>{response.resume();resolve(response.statusCode===200)}).on('error',()=>resolve(false)));
  if(ok)return;await sleep(100);
 }
 throw Error('Local server unavailable: '+url);
}
async function browserPage(browser,url){
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 const page=await context.newPage();
 await page.route('**/supabase-config.js',route=>route.fulfill({
  contentType:'application/javascript',
  body:'window.SupabaseConfig={isConfigured:()=>false,isAdmin:()=>false};'
 }));
 const external=[];
 await page.route(/^https:\/\//,route=>{external.push(route.request().url());return route.abort('blockedbyclient');});
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>Boolean(window.App&&document.getElementById('code-editor')),{timeout:30000});
 return {page,context,external};
}
const state=()=>({
 xp:App.state.xp,finished:[...App.state.finishedLessons],
 completed:[...App.state.completedLessons],telemetry:JSON.stringify(App.state.learningTelemetry),
 save:localStorage.getItem('gdscript_hero_save_v4'),
 cloudSave:localStorage.getItem('gdscript_hero_save_v3'),
 code:document.getElementById('code-editor').value
});
async function openSolution(page,id){
 await page.evaluate(id=>App.openLesson(id),id);
 await page.waitForFunction(id=>App.state.currentLessonId===id,id);
 await page.evaluate(id=>{
  const lesson=LESSONS_DATA.find(l=>l.id===id);
  document.getElementById('code-editor').value=lesson.solution;
 },id);
}
async function clickAndGrade(page,expected){
 const old=await page.locator('#test-status-badge').textContent();
 await page.locator('#btn-run-code').click();
 await page.waitForFunction(expected=>{
  const badge=document.getElementById('test-status-badge')?.textContent||'';
  return badge.includes('Godot (PROVA): '+expected);
 },expected,{timeout:85000});
 return {
  badge:await page.locator('#test-status-badge').textContent(),
  console:await page.locator('#real-output-pre').textContent(),
  status:await page.locator('#gdh-native-preview-status').textContent(),
  details:await page.locator('#gdh-native-preview-details').textContent(),
  before:old
 };
}
(async()=>{
 let browser;
 try{
  await Promise.all([waitHttp(host+'/index.html'),waitHttp(runner+'/isolated.html')]);
  browser=await chromium.launch({channel:'chrome',headless:true,args:[
    '--no-sandbox','--use-gl=angle','--use-angle=swiftshader',
    '--enable-webgl','--enable-unsafe-swiftshader']});
  const ordinary=await browserPage(browser,host+'/index.html');
  assert.equal(await ordinary.page.locator('#gdh-native-verify-mode').count(),0);
  assert.equal(await ordinary.page.locator('#gdh-native-preview-runner').count(),0);
  await ordinary.context.close();
  console.log('MAIN_VERIFY_DEFAULT_JS_UNCHANGED_PASS');

  const {page,context,external}=await browserPage(browser,host+'/index.html?nativeGodotVerify=1');
  await page.waitForSelector('#gdh-native-verify-toggle',{state:'attached'});
  assert.equal(await page.locator('#gdh-native-verify-toggle').isChecked(),true);
  assert.equal(await page.locator('#gdh-native-preview-runner').count(),0,'WASM must load lazily');
  assert.equal(await page.locator('#gdh-native-preview-button').count(),0,'No redundant diagnostic button');
  assert.equal(await page.evaluate(()=>window.__GDHNativePreview.verificationEnabled),true);
  await page.evaluate(()=>{
    window.__nativeGuard={js:0,record:0,quest:0,cloud:0};
    const engine=window.GDScriptRuntime;
    const oldExecute=engine.execute;
    engine.execute=async function(...args){window.__nativeGuard.js++;return oldExecute.apply(this,args);};
    for(const [key,count] of [['recordLessonAttempt','record'],['recordDailyQuestProgress','quest']]){
      const original=App[key];
      App[key]=function(...args){window.__nativeGuard[count]++;return original.apply(this,args);};
    }
  });
  await openSolution(page,1);
  const beforeFirst=await page.evaluate(state);
  const first=await clickAndGrade(page,'accepted');
  assert.match(first.console,/Ciao Godot!/);
  assert.equal(await page.locator('#gdh-native-preview-runner').getAttribute('sandbox'),'allow-scripts');
  const frame=page.frame({url:/isolated\.html/});
  assert.ok(frame);
  assert.equal(await frame.evaluate(()=>{try{return window.parent.document.title;}catch(e){return e.name}}),'SecurityError');
  assert.deepEqual(await page.evaluate(state),beforeFirst,'Native accepted MUST NOT modify XP/local/cloud progress');
  assert.deepEqual(await page.evaluate(()=>window.__nativeGuard),{js:0,record:0,quest:0,cloud:0});
  console.log('MAIN_VERIFY_NATIVE_ACCEPTED_NO_XP_PASS lesson=1');

  await openSolution(page,17);
  const beforeConditional=await page.evaluate(state);
  const conditional=await clickAndGrade(page,'accepted');
  assert.match(conditional.console,/Livello raggiunto!/);
  assert.deepEqual(await page.evaluate(state),beforeConditional);
  assert.equal(await page.evaluate(()=>window.__nativeGuard.js),0);
  console.log('MAIN_VERIFY_NATIVE_BEHAVIOR_SCENARIOS_PASS lesson=17');

  await openSolution(page,50);
  const beforeScene=await page.evaluate(state);
  const scene=await clickAndGrade(page,'accepted');
  assert.match(scene.console,/Benvenuto in Godot 4/);
  const details=JSON.parse(scene.details);
  assert.equal(details.scene.Titolo.text,'Benvenuto in Godot 4!');
  assert.equal(details.feedback.verdict,'accepted');
  assert.deepEqual(await page.evaluate(state),beforeScene);
  assert.equal(await page.evaluate(()=>window.__nativeGuard.js),0);
  console.log('MAIN_VERIFY_NATIVE_SCENE_PASS lesson=50');

  await page.locator('#code-editor').fill('extends Node\nfunc _ready():\n    var x: int = "bad"');
  const beforeBad=await page.evaluate(state);
  const bad=await clickAndGrade(page,'invalid_code');
  assert.equal(JSON.parse(bad.details).feedback.passed,false);
  assert.deepEqual(await page.evaluate(state),beforeBad);
  console.log('MAIN_VERIFY_NATIVE_INVALID_NO_PROGRESS_PASS');

  await page.screenshot({path:path.join(output,'native-real-verify-button.png'),fullPage:true});
  // Explicit rollback switch: normal JS runtime executes only after the user
  // disabled native mode; don't award progress in this test (force engine error).
  await page.locator('#gdh-native-verify-toggle').uncheck();
  assert.equal(await page.evaluate(()=>window.__GDHNativePreview.verificationEnabled),false);
  await page.evaluate(()=>{
    window.GDScriptRuntime.execute=async()=>{window.__nativeGuard.js++;throw new Error('Expected JS fallback probe');};
  });
  const jsBefore=await page.evaluate(()=>window.__nativeGuard.js);
  await page.locator('#btn-run-code').click();
  await page.waitForFunction(before=>window.__nativeGuard.js>before,jsBefore,{timeout:20000});
  assert.equal(await page.evaluate(()=>window.__nativeGuard.js),jsBefore+1);
  console.log('MAIN_VERIFY_EXPLICIT_ROLLBACK_TO_JS_PASS');

  const beforeDispose=await page.evaluate(()=>App.runAndValidate);
  await page.evaluate(()=>window.__GDHNativePreview.dispose());
  assert.equal(await page.evaluate(()=>App.runAndValidate===window.__GDHNativePreview?.verifyFromMain),false);
  assert.equal(await page.locator('#gdh-native-verify-mode').count(),0);
  assert.equal(await page.locator('#gdh-native-preview-runner').count(),0);
  assert.equal(await page.evaluate(()=>window.__GDHNativePreview.verificationEnabled),false);
  console.log('MAIN_VERIFY_DISPOSE_RESTORES_LEGACY_PASS');
  assert.equal(external.filter(x=>/supabase\.co|supabase\.in/.test(x)).length,0,
    'No account requests must leave during offline verification');
  fs.writeFileSync(path.join(output,'native-main-verify.json'),JSON.stringify({
    native:[{lesson:1,verdict:'accepted'},{lesson:17,verdict:'accepted'},{lesson:50,verdict:'accepted'},{lesson:50,verdict:'invalid_code'}],
    noProgressDuringNative:true,legacyRollbackConfirmed:true,cloudTraffic:false
  },null,2));
  await context.close();
 }catch(error){
  fs.writeFileSync(path.join(output,'NATIVE_MAIN_VERIFY_FAILED.txt'),String(error.stack||error));
  throw error;
 }finally{
  if(browser)await browser.close();
  for(const s of servers)s.kill();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
