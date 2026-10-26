'use strict';
/**
 * Real GDScript Hero editor + isolated Godot, on LOOPBACK ONLY.
 * External HTTPS (including Supabase) is blocked, and its config is replaced
 * with an inert offline stub before the site runs. No real account requests.
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const spike=path.resolve(__dirname,'..'), repo=path.resolve(spike,'../..');
const out=path.join(spike,'test-artifacts');fs.mkdirSync(out,{recursive:true});
const host='http://127.0.0.1:18767',runner='http://localhost:18768';
const processes=[
 spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',repo],{stdio:'ignore'}),
 spawn('python3',[path.join(spike,'tests','cors_server.py'),'18768',path.join(spike,'web')],{stdio:'ignore'})
];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitHttp(url){
 for(let i=0;i<100;i++){
  const isReady=await new Promise(ok=>http.get(url,res=>{res.resume();ok(res.statusCode===200)}).on('error',()=>ok(false)));
  if(isReady)return;await sleep(100);
 }
 throw Error('HTTP startup failed '+url);
}
async function contextPage(browser,url){
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 const page=await context.newPage();
 const requests=[];
 await page.route('**/supabase-config.js',route=>route.fulfill({
  contentType:'application/javascript',body:'window.SupabaseConfig={isConfigured:()=>false,isAdmin:()=>false};'
 }));
 await page.route(/^https:\/\//,route=>{
  requests.push(route.request().url());
  return route.abort('blockedbyclient');
 });
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>Boolean(window.App && document.querySelector('#code-editor')),{timeout:30000});
 return {context,page,requests};
}
const stateSnapshot=()=>({
 xp:window.App.state.xp,
 finished:[...window.App.state.finishedLessons],
 completed:[...window.App.state.completedLessons],
 code:document.querySelector('#code-editor').value,
 localSave:localStorage.getItem('gdscript_hero_save_v4')
});
async function setLesson(page,id){
 await page.evaluate(id=>window.App.openLesson(id),id);
 await page.waitForFunction(id=>window.App.state.currentLessonId===id,id);
 await page.evaluate(id=>{
  const original=window.LESSONS_DATA?.find?.(x=>x.id===id);
  // LESSONS_DATA is global lexical const rather than a window property in the course.
  const lesson=(typeof LESSONS_DATA!=='undefined' ? LESSONS_DATA : window.LESSONS_DATA).find(x=>x.id===id);
  document.querySelector('#code-editor').value=lesson.solution;
 },id);
}
async function preview(page,status){
 await page.locator('#gdh-native-preview-button').click();
 await page.waitForFunction(expected=>{
  const s=document.querySelector('#gdh-native-preview-status')?.textContent||'';
  return s.includes(expected);
 },status,{timeout:85000});
 return {
  status:await page.locator('#gdh-native-preview-status').textContent(),
  stdout:await page.locator('#gdh-native-preview-stdout').textContent(),
  details:await page.locator('#gdh-native-preview-details').textContent()
 };
}
(async()=>{
 let browser;
 const proof=[];
 try{
  await Promise.all([waitHttp(host+'/index.html'),waitHttp(runner+'/isolated.html')]);
  browser=await chromium.launch({channel:'chrome',headless:true,args:[
    '--no-sandbox','--use-gl=angle','--use-angle=swiftshader',
    '--enable-webgl','--enable-unsafe-swiftshader']});
  const ordinary=await contextPage(browser,host+'/index.html');
  assert.equal(await ordinary.page.locator('#gdh-native-preview-button').count(),0,
    'The adapter must be inert without explicit opt-in query');
  assert.equal(await ordinary.page.locator('#gdh-native-preview-runner').count(),0);
  await ordinary.context.close();
  console.log('INTEGRATION_DEFAULT_INERT_PASS');
  const {context,page}=await contextPage(browser,host+'/index.html?nativeGodotPreview=1');
  await page.waitForSelector('#gdh-native-preview-button',{state:'attached',timeout:15000});
  assert.equal(await page.locator('#gdh-native-preview-runner').count(),0,'WASM must load lazily');
  assert.equal(await page.locator('#btn-run-code').count(),1,'Original verification button is retained');
  assert.equal(await page.evaluate(()=>window.__GDHNativePreview.enabled),true);
  console.log('INTEGRATION_OPT_IN_PASS');
  await setLesson(page,1);
  const start=await page.evaluate(stateSnapshot);
  const first=await preview(page,'Godot: executed');
  assert.match(first.stdout,/Ciao Godot!/);
  assert.equal(JSON.parse(first.details).lesson,1);
  assert.equal(await page.locator('#gdh-native-preview-runner').getAttribute('sandbox'),'allow-scripts');
  const frame=page.frame({url:/isolated\.html/});
  assert.ok(frame,'Sandboxed frame exists');
  assert.equal(await frame.evaluate(()=>{
    try{return window.parent.document.title}catch(e){return e.name}
  }),'SecurityError');
  const after=await page.evaluate(stateSnapshot);
  assert.equal(after.xp,start.xp);
  assert.deepEqual(after.finished,start.finished);
  assert.deepEqual(after.completed,start.completed);
  assert.equal(after.localSave,start.localSave);
  assert.equal(after.code,start.code);
  proof.push({lesson:1,status:first.status,stdout:first.stdout});
  console.log('INTEGRATION_NATIVE_EDITOR_PASS 1');
  await setLesson(page,50);
  const beforeSecond=await page.evaluate(stateSnapshot);
  const second=await preview(page,'Godot: executed');
  const scene=JSON.parse(second.details).scene;
  assert.equal(scene.Titolo?.text,'Benvenuto in Godot 4!','Real Godot scene must contain label text');
  assert.equal((await page.evaluate(stateSnapshot)).xp,beforeSecond.xp);
  assert.deepEqual((await page.evaluate(stateSnapshot)).finished,beforeSecond.finished);
  assert.equal((await page.evaluate(stateSnapshot)).localSave,beforeSecond.localSave);
  proof.push({lesson:50,status:second.status,label:scene.Titolo?.text});
  console.log('INTEGRATION_NATIVE_EDITOR_PASS 50');
  // A compilation error must NOT cause XP change, and must remain a diagnostic result.
  const bad='extends Node\nfunc _ready():\n    var n: int = "wrong"\n';
  await page.locator('#code-editor').fill(bad);
  const beforeBad=await page.evaluate(stateSnapshot);
  const invalid=await preview(page,'Godot: compile_error');
  assert.equal((await page.evaluate(stateSnapshot)).xp,beforeBad.xp);
  assert.deepEqual((await page.evaluate(stateSnapshot)).finished,beforeBad.finished);
  proof.push({lesson:50,invalidStatus:invalid.status});
  console.log('INTEGRATION_INVALID_DIAGNOSTIC_PASS');
  await page.screenshot({path:path.join(out,'main-editor-native-preview.png'),fullPage:true});
  fs.writeFileSync(path.join(out,'main-editor-native-preview.json'),JSON.stringify(proof,null,2));
  await context.close();
 }catch(error){
  fs.writeFileSync(path.join(out,'MAIN_EDITOR_INTEGRATION_FAILED.txt'),String(error.stack||error));
  throw error;
 }finally{
  if(browser)await browser.close();
  for(const process of processes)process.kill();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
