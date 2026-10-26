'use strict';
/*
 * Smoke tests the REAL GDScript Hero website on a two-origin HTTPS preview.
 * Use MAIN_URL and RUNNER_URL; no account connection or legacy XP awards.
 * Also works on CI loopback ports for a deterministic dry-run before cloudflared.
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const main=(process.env.MAIN_URL||'').replace(/\/$/,'');
const runner=(process.env.RUNNER_URL||'').replace(/\/$/,'');
if(!/^https?:\/\//.test(main)||!/^https?:\/\//.test(runner)||new URL(main).origin===new URL(runner).origin)
 throw Error('MAIN_URL and RUNNER_URL must be different origins');
const timeout=110000,report={main,runner,checks:[]};
const profile=()=>({
 xp:App.state.xp,
 completed:[...App.state.completedLessons],
 finished:[...App.state.finishedLessons],
 telemetry:JSON.stringify(App.state.learningTelemetry),
 save:localStorage.getItem('gdscript_hero_save_v4'),
 guest:AuthManager.currentUser,
 code:document.getElementById('code-editor').value
});
async function lesson(page,id){
 await page.evaluate(id=>App.openLesson(id),id);
 await page.waitForFunction(id=>App.state.currentLessonId===id,id,{timeout:15000});
 await page.evaluate(id=>{
  document.getElementById('code-editor').value=LESSONS_DATA.find(x=>x.id===id).solution;
 },id);
}
async function click(page,verdict){
 await page.locator('#btn-run-code').click();
 await page.waitForFunction(verdict=>{
  const badge=document.getElementById('test-status-badge')?.textContent||'';
  return badge.includes('Godot (PROVA): '+verdict);
 },verdict,{timeout});
 assert.equal(await page.evaluate(()=>App.isValidating),false);
}
(async()=>{
 let browser;
 try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:[
   '--no-sandbox','--use-gl=angle','--use-angle=swiftshader',
   '--enable-webgl','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1280,height:850}});
  const page=await context.newPage();
  const outgoing=[];
  page.on('request',request=>{
   const url=request.url();
   if(/https?:/.test(url)&&![new URL(main).origin,new URL(runner).origin,
      'https://fonts.googleapis.com','https://fonts.gstatic.com'].includes(new URL(url).origin))
      outgoing.push(url);
  });
  const r=await page.goto(main+'/index.html?nativeGodotVerify=1',
    {waitUntil:'domcontentloaded',timeout});
  assert.equal(r.status(),200);
  const csp=r.headers()['content-security-policy'];
  assert.match(csp,/connect-src 'none'/);
  assert.match(csp,/frame-src https?:\/\//);
  const stub=await page.request.get(main+'/supabase-config.js');
  assert.equal(stub.status(),200);
  assert.doesNotMatch(await stub.text(),/supabase\.co|eyJhbGci/);
  const forbidden=await page.request.get(main+'/docs/native-validation-verdict-contract-2026-10-26.md');
  assert.equal(forbidden.status(),404);
  const denied=await page.request.get(main+'/spikes/godot-web/web/godot.wasm');
  assert.equal(denied.status(),404);
  report.checks.push('account_config_stub_and_http_api_isolated');
  await page.waitForFunction(()=>Boolean(window.App&&document.getElementById('code-editor')),null,{timeout:35000});
  assert.equal(await page.evaluate(()=>window.SupabaseConfig.isConfigured()),false);
  assert.equal(await page.evaluate(()=>window.AuthManager.isCloudActive()),false);
  const toggle=page.locator('#gdh-native-verify-toggle');
  assert.equal(await toggle.count(),1);
  assert.equal(await toggle.isChecked(),true);
  assert.equal(await toggle.isDisabled(),true,'Public preview MUST prohibit fallback to XP-granting JS');
  assert.equal(await page.locator('#gdh-native-preview-runner').count(),0,'Godot must be loaded lazily');
  assert.equal(await page.evaluate(()=>window.__GDHNativePreview.verificationEnabled),true);
  report.checks.push('real_editor_loaded_native_only_mode_enabled');

  await lesson(page,1);
  const before=await page.evaluate(profile);
  await click(page,'accepted');
  assert.match(await page.locator('#real-output-pre').textContent(),/Ciao Godot!/);
  assert.deepEqual(await page.evaluate(profile),before,'Native grading must never alter progress');
  const frame=page.frame({url:/isolated\.html/});
  assert.ok(frame);
  assert.equal(new URL(frame.url()).origin,new URL(runner).origin);
  assert.equal(await page.locator('#gdh-native-preview-runner').getAttribute('sandbox'),'allow-scripts');
  assert.equal(await frame.evaluate(()=>{
   try{return window.parent.document.title;}catch(e){return e.name;}
  }),'SecurityError');
  report.checks.push('lesson_1_accepted_no_xp_sandbox_separate_origin');

  await lesson(page,17);
  const cond=await page.evaluate(profile);
  await click(page,'accepted');
  assert.deepEqual(await page.evaluate(profile),cond);
  report.checks.push('lesson_17_native_scenarios_no_xp');

  await lesson(page,50);
  const sceneBefore=await page.evaluate(profile);
  await click(page,'accepted');
  const data=JSON.parse(await page.locator('#gdh-native-preview-details').textContent());
  assert.equal(data.scene.Titolo.text,'Benvenuto in Godot 4!');
  assert.deepEqual(await page.evaluate(profile),sceneBefore);
  report.checks.push('lesson_50_real_native_label_scene_no_xp');

  await page.locator('#code-editor').fill('extends Node\nfunc _ready():\n    var value: int = "wrong"\n');
  const invalidBefore=await page.evaluate(profile);
  await click(page,'invalid_code');
  assert.deepEqual(await page.evaluate(profile),invalidBefore);
  report.checks.push('invalid_code_rejected_no_xp');

  // The preview must not leak any actual cloud API requests even on error.
  assert.equal(outgoing.filter(x=>/supabase\.co|\/auth\/|\/rest\/v1\//.test(x)).length,0);
  console.log('PUBLIC_FULLSITE_NATIVE_VERIFY_PASS '+JSON.stringify(report));
  const destination=path.join(root,'test-artifacts','native-https-fullsite.png');
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  await page.screenshot({path:destination,fullPage:true});
  await context.close();
 }finally{if(browser)await browser.close();}
})().catch(error=>{console.error('PUBLIC_FULLSITE_NATIVE_VERIFY_FAIL '+(error.stack||error));process.exitCode=1;});
