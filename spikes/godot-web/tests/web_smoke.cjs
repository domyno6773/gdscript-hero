'use strict';
/* Live Godot WebAssembly smoke test. This is NOT a security validation. */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const evidence = path.join(root, 'test-artifacts');
fs.mkdirSync(evidence, {recursive:true});
const port = 18766;
const origin = 'http://127.0.0.1:' + port;
const server = spawn('python3', ['-m','http.server', String(port), '--bind', '127.0.0.1', '--directory', path.join(root,'web')], {stdio: 'ignore'});
async function untilServer() {
  for(let i=0;i<80;i++){
    const ok=await new Promise(resolve=>{
      http.get(origin+'/index.html',res=>{res.resume();resolve(res.statusCode===200)}).on('error',()=>resolve(false));
    }); if(ok)return;
    await new Promise(r=>setTimeout(r,125));
  }throw new Error('HTTP server failed to start');
}
async function execute(page, source, expectStatus = 'executed') {
  await page.locator('#source').fill(source);
  await page.locator('#run').click();
  await page.waitForFunction((expected)=>{
    const data=document.querySelector('#result')?.textContent;
    if(!data)return false;
    try{return JSON.parse(data).status===expected;} catch{return false;}
  },expectStatus,{timeout:12000});
  const result=JSON.parse(await page.locator('#result').textContent());
  const stdout=await page.locator('#stdout').textContent();
  const stderr=await page.locator('#stderr').textContent();
  return {result,stdout,stderr};
}
(async ()=>{
  let browser;
  try{
    await untilServer();
    browser = await chromium.launch({channel:'chrome', headless:true,
      args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
    for (const viewport of [{width:1280,height:800},{width:390,height:844}]) {
      const mobile=viewport.width<600;
      const ctx=await browser.newContext({viewport, deviceScaleFactor:1, isMobile:mobile, hasTouch:mobile});
      const page=await ctx.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const start=Date.now();
      await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>Boolean(window.gdhReady&&window.gdhReceive&&!(document.querySelector('#run')?.disabled)),null,{timeout:80000});
      const loadedMs=Date.now()-start;
      const valid=await execute(page,'extends Node\nvar answer: int = 0\nfunc _ready():\n    answer = 100 / 3\n    print("A", "B")\n    print("Risultato: ", answer)\n');
      assert.equal(valid.result.properties.answer,33,'Script property uses Godot integer arithmetic');
      assert.match(valid.stdout,/AB/,'Godot print() concatenates arguments without spaces');
      assert.match(valid.stdout,/Risultato: 33/);
      const noExtends=await execute(page,'func _ready():\n    print("GDH_NO_EXTENDS_SUCCESS")\n');
      assert.match(noExtends.stdout,/GDH_NO_EXTENDS_SUCCESS/,'Wrapper adds Node extends');
      const broken=await execute(page,'extends Node\nfunc _ready():\n    var x: int = "wrong"\n','compile_error');
      assert.match(broken.stderr,/Error|Parse|error|Invalid/i, 'Native diagnostic surfaced');
      // Non legge dati personali: dimostra solo la presenza di accesso al window dello stesso origin.
      const bridge=await execute(page,'extends Node\nfunc _ready():\n    var browser = JavaScriptBridge.get_interface("window")\n    browser.gdhSecurityProof = "GDSCRIPT_CAN_ACCESS_WINDOW"\n');
      assert.equal(await page.evaluate(()=>window.gdhSecurityProof), 'GDSCRIPT_CAN_ACCESS_WINDOW',
        'SECURITY: code executed inside Godot can access the hosting page window; prototype is NOT isolated');
      const retry=await execute(page,'func _ready():\n    print("RECOVERED_AFTER_ERROR")\n');
      assert.match(retry.stdout,/RECOVERED_AFTER_ERROR/);
      await page.screenshot({path:path.join(evidence,mobile?'mobile.png':'desktop.png'),fullPage:true});
      const measure={viewport,loadedMs,valid, noExtends,broken, bridge, retry, pageErrors:errors};
      fs.writeFileSync(path.join(evidence,mobile?'mobile.json':'desktop.json'),JSON.stringify(measure,null,2));
      console.log('WASM_PASS '+JSON.stringify({viewport, loadedMs, stdout:valid.stdout, errors:errors}));
      await ctx.close();
    }
  } catch(e) {
    fs.writeFileSync(path.join(evidence,'FAILED.txt'),String(e.stack||e));
    throw e;
  } finally {if(browser) await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
