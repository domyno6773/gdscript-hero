'use strict';
// Destructive hang test. Outer shell timeout is MANDATORY; Chrome's cross-origin isolation
// does not guarantee the host stays responsive in every browser / configuration.
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
const out=path.join(base,'test-artifacts');fs.mkdirSync(out,{recursive:true});
const servers=[
  spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',path.join(base,'host')],{stdio:'ignore'}),
  spawn('python3',['-m','http.server','18768','--bind','localhost','--directory',path.join(base,'web')],{stdio:'ignore'})
];
const sleep=t=>new Promise(r=>setTimeout(r,t));
async function waitHttp(url){
  for(let i=0;i<100;i++){
    const ok=await new Promise(r=>http.get(url,x=>{x.resume();r(x.statusCode===200)}).on('error',()=>r(false)));
    if(ok)return;
    await sleep(100);
  }
  throw Error('HTTP not available: '+url);
}
(async()=>{
 let browser;
 try{
   await Promise.all([waitHttp('http://127.0.0.1:18767/index.html'),waitHttp('http://localhost:18768/isolated.html')]);
   browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
   const page=await browser.newPage({viewport:{width:1200,height:760}});
   await page.goto('http://127.0.0.1:18767/index.html',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.__gdhIsolation?.ready,{timeout:60000});
   const generationBefore=await page.evaluate(()=>window.__gdhIsolation.generation);
   await page.locator('#code').fill('extends Node\nfunc _ready():\n    while true:\n        pass\n');
   const start=Date.now();
   await page.locator('#run').click();
   await page.waitForFunction(()=>{
     try{return JSON.parse(document.querySelector('#result').textContent).status==='timeout';}
     catch{return false;}
   },null,{timeout:18000});
   const timeoutMs=Date.now()-start;
   await page.waitForFunction((before)=>window.__gdhIsolation?.ready && window.__gdhIsolation.generation>before,generationBefore,{timeout:30000});
   const healthy=await page.evaluate(()=>({g:window.__gdhIsolation.generation,status:document.querySelector('#status').textContent}));
   await page.locator('#code').fill('func _ready():\n    print("AFTER_HANG")\n');
   await page.locator('#run').click();
   await page.waitForFunction(()=>{
     try {return JSON.parse(document.querySelector('#result').textContent).status==='executed';}
     catch{return false;}
   },null,{timeout:20000});
   assert.match(await page.locator('#stdout').textContent(),/AFTER_HANG/);
   const info={timeoutMs,healthy,status:'HANG_RECOVERY_PASS'};
   console.log('HANG_RECOVERY_PASS '+JSON.stringify(info));
   fs.writeFileSync(path.join(out,'hang-result.json'),JSON.stringify(info,null,2));
   await page.screenshot({path:path.join(out,'hang-recovery.png')});
 }catch(e){
   fs.writeFileSync(path.join(out,'hang-FAILED.txt'),String(e.stack||e));
   console.error('HANG_RECOVERY_FAILED '+String(e));
   process.exitCode=1;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
