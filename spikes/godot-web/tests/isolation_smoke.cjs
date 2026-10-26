'use strict';
// Tests browser origin isolation, cross-origin bridge, spoof rejection, manual restart.
// Does not assert a hostile infinite loop is safely killable (separate test needed).
const {chromium} = require('playwright');
const {spawn} = require('node:child_process');
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict'), http=require('node:http');
const base=path.resolve(__dirname,'..');
const out=path.join(base,'test-artifacts'); fs.mkdirSync(out,{recursive:true});
const PARENT='http://127.0.0.1:18767', RUNNER='http://localhost:18768';
const procs=[
  spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',path.join(base,'host')],{stdio:'ignore'}),
  spawn('python3',[path.join(base,'tests','cors_server.py'),'18768',path.join(base,'web')],{stdio:'ignore'})
];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitHttp(url) {
  for(let i=0;i<80;i++){
    const yes=await new Promise(r=>http.get(url,resp=>{resp.resume();r(resp.statusCode===200)}).on('error',()=>r(false)));
    if(yes)return; await sleep(130);
  }throw Error('Unable to start HTTP host '+url);
}
async function ready(page) {await page.waitForFunction(()=>window.__gdhIsolation?.ready===true,null,{timeout:80000});}
async function run(page,code,expected){
  await page.locator('#code').fill(code);
  await page.locator('#run').click();
  await page.waitForFunction(expect=>{
    const x=document.querySelector('#result')?.textContent||'';
    try{return JSON.parse(x).status===expect;}catch{return false;}
  },expected,{timeout:17000});
  return {
    stdout: await page.locator('#stdout').textContent(),
    stderr: await page.locator('#stderr').textContent(),
    result: JSON.parse(await page.locator('#result').textContent())
  };
}
(async()=>{
  let browser;
  try{
    await Promise.all([waitHttp(PARENT+'/index.html'),waitHttp(RUNNER+'/isolated.html')]);
    browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
    const results=[];
    for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
      const ctx=await browser.newContext({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500});
      const page=await ctx.newPage();
      const start=Date.now();
      await page.goto(PARENT+'/index.html',{waitUntil:'domcontentloaded'});
      await ready(page);
      const loadedMs=Date.now()-start;
      const frame=page.frame({url:/isolated\.html/});
      assert.ok(frame,'Isolated iframe exists');
      const probe=await frame.evaluate(()=>{
        try {void window.parent.document.title; return 'NOT_ISOLATED';}
        catch(e){return e.name;}
      });
      assert.equal(probe,'SecurityError','Iframe must be prevented from reading parent DOM');
      const storage=await frame.evaluate(()=>{
        try{return window.parent.localStorage.getItem('gdh_host_private');}
        catch(e){return e.name;}
      });
      assert.equal(storage,'SecurityError');
      const initial=await page.evaluate(()=>({g:window.__gdhIsolation.generation,r:window.__gdhIsolation.rejected}));
      await page.evaluate(()=>{window.postMessage({v:1,type:'ready',session:'forged'},location.origin);});
      await page.waitForTimeout(150);
      assert.ok((await page.evaluate(()=>window.__gdhIsolation.rejected))>initial.r, 'Fake same-origin message ignored');
      const valid=await run(page,'extends Node\nvar answer: int = 0\nfunc _ready():\n    answer = 100 / 3\n    print("A", "B")\n    print("Risultato: ", answer)\n','executed');
      assert.equal(valid.result.properties.answer,33);
      assert.match(valid.stdout,/AB\nRisultato: 33/);
      const malicious=await run(page,'extends Node\nfunc _ready():\n    JavaScriptBridge.get_interface("window").gdhRunnerFlag = "LOCAL_ONLY"\n    print("RUNNER_ONLY")\n','executed');
      assert.match(malicious.stdout,/RUNNER_ONLY/);
      assert.equal(await frame.evaluate(()=>window.gdhRunnerFlag),'LOCAL_ONLY');
      assert.equal(await page.evaluate(()=>window.gdhRunnerFlag),undefined,'GDScript cannot modify parent window property');
      const broken=await run(page,'extends Node\nfunc _ready():\n    var value: int = "wrong"\n','compile_error');
      assert.match(broken.stderr,/Error|Parse|Invalid|error/i);
      await page.locator('#restart').click();
      await ready(page);
      assert.ok((await page.evaluate(()=>window.__gdhIsolation.generation))>initial.g);
      const recovered=await run(page,'func _ready():\n    print("AFTER_RESTART")\n','executed');
      assert.match(recovered.stdout,/AFTER_RESTART/);
      // Navigazione deliberata verso l'origin del parent: l'iframe resta di origine opaca.
      await frame.evaluate(() => { setTimeout(() => { window.location.href = 'http://127.0.0.1:18767/probe.html'; }, 120); });
      await frame.waitForURL('http://127.0.0.1:18767/probe.html',{timeout:12000});
      const afterNavigation=await frame.evaluate(()=>{
        try { return window.parent.document.title; }
        catch(e) { return e.name; }
      });
      assert.equal(afterNavigation,'SecurityError','Navigating to parent origin must not escape opaque sandbox');
      await page.locator('#restart').click();
      await ready(page);
      await page.screenshot({path:path.join(out,viewport.width<500?'isolated-mobile.png':'isolated-desktop.png'),fullPage:true});
      results.push({viewport,loadedMs,probe,storage,valid,malicious,broken,recovered, afterNavigation});
      console.log('ISOLATION_PASS '+JSON.stringify({viewport,loadedMs,probe,storage,securityFlagOnlyInRunner:true,manualRestart:true, navigationIsolated:true}));
      await ctx.close();
    }
    fs.writeFileSync(path.join(out,'isolation.json'),JSON.stringify(results,null,2));
  }catch(e){
    fs.writeFileSync(path.join(out,'ISOLATION_FAILED.txt'),String(e.stack||e));
    throw e;
  }finally{if(browser)await browser.close();for(const p of procs)p.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
