'use strict';
/**
 * Pre-release audit. Reads only public/static repository sources and a locally exported
 * Godot Web build. Never uses accounts, token, Supabase API or production user data.
 * Generates advisory evidence and a NO-GO status: it is NOT an authorization system.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const {spawn}=require('node:child_process');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'), repo=path.resolve(root,'../..');
const output=path.join(root,'test-artifacts');fs.mkdirSync(output,{recursive:true});
const read=(file)=>fs.readFileSync(path.join(repo,file),'utf8');
const hostOrigin='http://127.0.0.1:18767';
const runnerOrigin='http://localhost:18768';
const bytes=(v)=>Number((v/1048576).toFixed(2));
const recorded=new Date().toISOString();
const checks=[];
function check(id,title,status,evidence,severity){
  checks.push({id,title,status,evidence,severity:severity||'info'});
}
const app=read('app.js'),auth=read('auth.js'),sql=read('supabase_schema.sql');
const host=read('spikes/godot-web/host/host.js');
const isolated=read('spikes/godot-web/web/isolated-runner.js');
const runner=read('spikes/godot-web/project/runner.gd');
const html=read('spikes/godot-web/host/lesson-lab.html');
const lessonSrc=read('spikes/godot-web/host/lesson-validation.js');
const sceneSrc=read('spikes/godot-web/host/lesson-validation-native-scenes.js');

check('native-runtime','La suite usa Godot nativo per le 60 soluzioni',
 'verified-by-browser-ci','Le cinque suite native delle lezioni 1-60 eseguono Godot WebAssembly, con controlli di validazione e casi negativi.');
const stillJs=app.includes('GDScriptRuntime.execute(')&&app.includes('currentLesson.validate(result, GDScriptRuntime)');
check('production-integration','Integrazione nel pulsante Verifica codice del sito',
 stillJs?'blocker':'review',
 stillJs?'app.js usa ancora GDScriptRuntime.execute e i validatori precedenti: il laboratorio non è integrato nel percorso reale.':
  'Il flusso deve essere verificato manualmente con E2E completo dell’app.','high');

const clientRewards=app.includes('this.state.xp += currentLesson.xp')&&
 app.includes('this.state.finishedLessons.push(currentLesson.id)');
const clientSync=auth.includes('xp: snapshot.xp || 0')&&auth.includes('.upsert(payload');
const rlsOnlyIdentity=/USING\s*\(\s*auth\.uid\(\)\s*=\s*user_id\s*\)/.test(sql);
check('trusted-grading','Progressi/XP attendibili contro client manipolabili',
 clientRewards&&clientSync&&rlsOnlyIdentity?'blocker':'review',
 'Gli XP sono accreditati nel client; syncToCloud carica xp dal salvataggio; RLS limita la proprietà del record ma non prova la soluzione didattica.','high');

const opaque=host.includes("frame.setAttribute('sandbox', 'allow-scripts')") &&
 host.includes("event.origin !== 'null'") &&
 isolated.includes("e.origin !== PARENT_ORIGIN");
check('isolation','Sandbox del runner separata dalla pagina principale',
 opaque?'verified-by-browser-ci':'blocker',
 opaque?'Sandbox senza allow-same-origin, messaggi con controlli su finestra, origine/sessione; CI esegue anche probe di navigazione.':
 'Configurazione iframe/messaggi diversa da quella revisionata: ripetere audit di sicurezza.','high');

const mayBridge=runner.includes('JavaScriptBridge')&&isolated.includes('window.gdhResult');
check('forged-results','Origine dei risultati del runner attendibile',
 mayBridge?'blocker':'review',
 'Codice GDScript e pagina del runner possono accedere a JavaScriptBridge e al canale locale: l’esito client resta falsificabile.','high');

const codeRegex=lessonSrc.includes('new RegExp')&&runner.includes('func _with_local_capture');
check('validator-generality','Validazione e cattura di variabili su GDScript arbitrario',
 codeRegex?'blocker':'review',
 'I validatori usano RegExp e la cattura locale inietta una chiamata alla fine di _ready: non coprono tutti gli scope, return e programmi alternativi.','high');

const stored=html.includes('lesson-fixtures.js')&&!html.includes('auth.js');
check('experiment-no-account','Laboratorio sperimentale senza collegamento al cloud',
 stored?'verified-static':'review',
 stored?'La pagina di laboratorio carica dataset, validatori, UI e host separati, non auth.js o App.':
 'Rivedere i moduli importati dal laboratorio.','medium');

const artifacts=['godot.wasm','godot.js','godot.pck'];
const builds={};
for(const filename of artifacts){
 const filepath=path.join(root,'web',filename);
 if(!fs.existsSync(filepath))throw Error('Godot export missing: '+filepath);
 const buffer=fs.readFileSync(filepath);
 const hash=crypto.createHash('sha256').update(buffer).digest('hex');
 const gzip=zlib.gzipSync(buffer,{level:6});
 builds[filename]={bytes:buffer.length,MiB:bytes(buffer.length),gzipBytes:gzip.length,gzipMiB:bytes(gzip.length),sha256:hash};
}
const rawBytes=Object.values(builds).reduce((sum,b)=>sum+b.bytes,0);
const gzipBytes=Object.values(builds).reduce((sum,b)=>sum+b.gzipBytes,0);
check('payload','Dimensioni del primo caricamento',
 rawBytes>20*1048576?'blocker':'review',
 'Somma di godot.wasm, godot.js e godot.pck: '+bytes(rawBytes)+' MiB non compressi; '+bytes(gzipBytes)+' MiB gzip teorici. Il server CI non rappresenta una CDN compressa.','medium');

const servers=[
 spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',path.join(root,'host')],{stdio:'ignore'}),
 spawn('python3',[path.join(root,'tests','cors_server.py'),'18768',path.join(root,'web')],{stdio:'ignore'})
];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function checkHttp(url){
 for(let t=0;t<120;t++){
  const ok=await new Promise(done=>http.get(url,res=>{res.resume();done(res.statusCode===200)}).on('error',()=>done(false)));
  if(ok)return;await sleep(100);
 }
 throw Error('HTTP not ready: '+url);
}
async function measureLoad(browser,viewport,isMobile){
 const context=await browser.newContext({viewport,isMobile,hasTouch:isMobile});
 const page=await context.newPage();
 const requests=[];
 page.on('response',res=>{
   const u=res.url();
   if(/godot\.(?:wasm|pck|js)(?:\?|$)/.test(u))requests.push({url:u.split('/').pop(),status:res.status()});
 });
 const started=Date.now();
 await page.goto(hostOrigin+'/lesson-lab.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__gdhIsolation?.ready===true,{},{timeout:90000});
 const readyMs=Date.now()-started;
 const sandboxed=await page.locator('#isolated-runner').getAttribute('sandbox');
 const lessonCount=await page.locator('#lesson option').count();
 if(lessonCount!==60)throw Error('Expected 60 lessons, got '+lessonCount);
 if(sandboxed!=='allow-scripts')throw Error('Iframe sandbox configuration changed');
 const startup={viewport,isMobile,readyMs,requests,lessonCount,sandboxed};
 await context.close();
 return startup;
}
async function main(){
 let browser;
 const result={recorded,environment:'GitHub Actions Ubuntu + headless Chrome (NOT real smartphone or mobile network)',
   source:{repository:'domyno6773/gdscript-hero',branch:'spike/godot-native-proof-20261026'},
   artifactMetrics:{builds,rawMiB:bytes(rawBytes),gzipPotentialMiB:bytes(gzipBytes),
     caveat:'gzip size computed locally, not actual transfer; excludes headers, fonts, browser overhead and caches'},
   browserMeasurements:[],checks,
   limitations:['No Safari/iOS or Android hardware tested','No production CDN, CORS, CSP or real bandwidth tests',
     'No runtime heap profiling or sustained battery/CPU measurements','No server-side authoritative grading']};
 try{
   await Promise.all([checkHttp(hostOrigin+'/lesson-lab.html'),checkHttp(runnerOrigin+'/isolated.html')]);
   browser=await chromium.launch({channel:'chrome',headless:true,args:[
     '--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader'
   ]});
   result.browserMeasurements.push(await measureLoad(browser,{width:1280,height:800},false));
   result.browserMeasurements.push(await measureLoad(browser,{width:390,height:844},true));
   check('desktop-smoke','Avvio Chrome desktop e selettore 60 lezioni','verified-ci',
     'Caricamento '+result.browserMeasurements[0].readyMs+' ms sul runner CI, non rappresentativo di una rete Internet.','medium');
   check('mobile-emulation','Avvio Chrome con viewport mobile emulata','verified-ci',
     'Caricamento '+result.browserMeasurements[1].readyMs+' ms sul runner CI; non prova Android/iOS reali.','medium');
 }finally {
   if(browser)await browser.close();
   for(const server of servers)server.kill();
 }
 result.releaseRecommendation=checks.some(c=>c.status==='blocker')?'NO_GO':'MANUAL_REVIEW';
 const outputFile=path.join(output,'release-readiness-audit.json');
 fs.writeFileSync(outputFile,JSON.stringify(result,null,2));
 console.log('RELEASE_AUDIT '+JSON.stringify({
   recommendation:result.releaseRecommendation,buildMiB:result.artifactMetrics.rawMiB,
   gzipPotentialMiB:result.artifactMetrics.gzipPotentialMiB,
   startupMs:result.browserMeasurements.map(x=>x.readyMs),
   blockers:checks.filter(c=>c.status==='blocker').map(x=>x.id),
   artifact:outputFile
 }));
}
main().catch(error=>{
 fs.writeFileSync(path.join(output,'release-readiness-audit-FAILED.txt'),String(error.stack||error));
 console.error(error);process.exitCode=1;
});
