'use strict';
// Production design: deploy this server behind TLS reverse proxy, not on GitHub Pages.
// Required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GDH_PRIVATE_FIXTURES_DIR,
// GDH_ALLOWED_ORIGIN. No default fixtures, scores, entitlements or secrets.
const http=require('node:http'),fs=require('node:fs/promises');
const path=require('node:path'),crypto=require('node:crypto');
const {grade,validateCode}=require('./runner');
const PORT=Number(process.env.PORT||8787),HOST=process.env.HOST||'127.0.0.1';
const ORIGIN=process.env.GDH_ALLOWED_ORIGIN||'https://domyno6773.github.io';
const SUPA=process.env.SUPABASE_URL,KEY=process.env.SUPABASE_SERVICE_ROLE_KEY;
const FIXTURES=process.env.GDH_PRIVATE_FIXTURES_DIR;
const MAX_BODY=14000;
const TRUST_IP_GEO=process.env.GDH_TRUST_CLOUDFLARE_COUNTRY==='1';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CHALLENGE=/^[a-z0-9][a-z0-9_-]{3,79}$/;
const tasks=new Map();
const clocks=new Map();
let active=0;
class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
function secureEnv(){
 if(!SUPA||!/^https:\/\//.test(SUPA)||!KEY||!FIXTURES||!path.isAbsolute(FIXTURES)||
   !/^https:\/\//.test(ORIGIN))throw Error('Required arena environment missing; refusing to start');
}
function response(res,status,body,origin){
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
   'X-Content-Type-Options':'nosniff','Vary':'Origin',...(origin===ORIGIN?{
   'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'authorization,content-type',
   'Access-Control-Allow-Methods':'GET,POST,OPTIONS'}:{})});
 res.end(JSON.stringify(body));
}
async function parseBody(req) {
 return new Promise((resolve,reject)=>{
   let bytes=0,body='';
   req.on('data',chunk=>{
     bytes+=chunk.length;
     if(bytes>MAX_BODY){reject(new HttpError(413,'Richiesta troppo grande'));req.destroy();return;}
     body+=chunk.toString('utf8');
   });
   req.on('end',()=>{
     try{resolve(JSON.parse(body));}catch{reject(new HttpError(400,'JSON non valido'));}
   });
   req.on('error',reject);
 });
}
async function supaFetch(url,headers,init={}){
 const res=await fetch(SUPA+url,{...init,headers:{...headers,...init.headers},signal:AbortSignal.timeout(7000)});
 if(!res.ok)throw new HttpError(res.status===401?401:503,'Servizio competitivo non disponibile');
 return res.json();
}
const svcHeaders=()=>({'apikey':KEY,'Authorization':'Bearer '+KEY});
async function userByToken(token){
 const user=await supaFetch('/auth/v1/user',{'apikey':KEY,'Authorization':'Bearer '+token});
 if(!UUID.test(user.id||''))throw new HttpError(401,'Sessione non valida');
 return user;
}
async function activeChallenge(challengeId){
 const q=new URLSearchParams({select:'id,season_id,grading_version,points_max,state,published_at',
   id:'eq.'+challengeId,limit:'1'});
 const rows=await supaFetch('/rest/v1/gdh_challenges?'+q,svcHeaders());
 if(!rows.length)throw new HttpError(404,'Sfida non disponibile');
 return rows[0];
}
async function checkCountry(token,season){
 const country=await supaFetch('/rest/v1/rpc/gdh_my_country',
   {'apikey':KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json'},
   {method:'POST',body:JSON.stringify({p_season:season})});
 if(!country)throw new HttpError(409,'Conferma il Paese della stagione prima di partecipare');
}
async function privateFixture(challenge){
 // IDs and versions come from the DB (strict allowlist). Never load user paths.
 const filename=challenge.id+'-v'+challenge.grading_version+'.json';
 const filepath=path.join(FIXTURES,filename);
 const stat=await fs.lstat(filepath).catch(()=>null);
 if(!stat||!stat.isFile()||stat.isSymbolicLink())throw new HttpError(503,'Test riservati non disponibili');
 const raw=await fs.readFile(filepath,'utf8');
 if(Buffer.byteLength(raw)>16000)throw new Error('Private fixture size exceeded');
 return JSON.parse(raw);
}
function applyRateLimit(uid){
 const now=Date.now();
 const record=clocks.get(uid)||{start:now,count:0};
 if(now-record.start>60000){record.start=now;record.count=0;}
 if(record.count>=5)throw new HttpError(429,'Troppi tentativi: riprova più tardi');
 record.count++;clocks.set(uid,record);
 // TTL bounded by count of active users, pruned periodically on incoming requests.
 if(clocks.size>5000)for(const [key,v] of clocks)if(now-v.start>61000)clocks.delete(key);
 if(active>=2||tasks.has(uid))throw new HttpError(429,'Una verifica è già in corso');
}
async function submit(payload,token) {
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||
    !CHALLENGE.test(payload.challengeId||'')||!UUID.test(payload.attemptId||''))
   throw new HttpError(400,'Parametri della sfida non validi');
 try{validateCode(payload.code);}catch{throw new HttpError(400,'Codice GDScript non valido');}
 const user=await userByToken(token);
 applyRateLimit(user.id);
 active++;tasks.set(user.id,true);
 try{
   // The authoritative season comes from the challenge row, never the ID prefix.
   const challenge=await activeChallenge(payload.challengeId);
   // SQL transaction is final authority, but reject clearly inactive challenges early.
   const seasonRows=await supaFetch('/rest/v1/gdh_seasons?'+new URLSearchParams({
      select:'id,status,opens_at,closes_at',id:'eq.'+challenge.season_id,limit:'1'}),svcHeaders());
   const s=seasonRows[0],now=Date.now();
   if(!s||s.status!=='published'||challenge.state!=='published'||
       now<Date.parse(s.opens_at)||now>=Date.parse(s.closes_at)||
       now<Date.parse(challenge.published_at))throw new HttpError(409,'Sfida non attiva');
   await checkCountry(token,challenge.season_id);
   const fixture=await privateFixture(challenge);
   const result=await grade({code:payload.code,fixture,challenge});
   const hash=crypto.createHash('sha256').update(payload.code).digest('hex');
   const rows=await supaFetch('/rest/v1/rpc/gdh_record_verified_verdict',svcHeaders(),
     {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
       p_user:user.id,p_attempt:payload.attemptId,p_challenge:challenge.id,
       p_version:result.gradingVersion,p_code_sha256:hash,p_points:result.points})});
   const record=rows?.[0];
   if(!record)throw new HttpError(503,'Risultato non registrato');
   return {official:true,challengeId:challenge.id,points:result.points,maxPoints:result.maxPoints,
     bestPoints:record.best_points,xpAwarded:record.xp_awarded,
     duplicateAttempt:record.duplicate_attempt,feedback:result.feedback};
 }finally{active--;tasks.delete(user.id);}
}
function createServer(){
 return http.createServer(async(req,res)=>{
   const origin=req.headers.origin;
   if(origin && origin!==ORIGIN){response(res,403,{error:'Origine non autorizzata'},origin);return;}
   if(req.url==='/healthz'&&req.method==='GET'){
     response(res,200,{ready:true},origin);return;
   }
   if(req.url==='/api/arena/country-suggestion'&&req.method==='GET'){
     // Trust only when deployed behind a Cloudflare reverse proxy configured
     // to strip incoming visitor-supplied CF-IPCountry headers.
     const code=TRUST_IP_GEO?String(req.headers['cf-ipcountry']||'').toUpperCase():'';
     response(res,200,{country:/^[A-Z]{2}$/.test(code)&&code!=='XX'&&code!=='T1'?code:null},origin);
     return;
   }
   if(req.url==='/api/arena/submit'&&req.method==='OPTIONS'){
     response(res,204,{},origin);return;
   }
   if(req.url!=='/api/arena/submit'||req.method!=='POST'){
     response(res,404,{error:'Non trovato'},origin);return;
   }
   try{
     if(!req.headers['content-type']?.startsWith('application/json'))
       throw new HttpError(415,'Content-Type application/json richiesto');
     const bearer=/^Bearer ([-._~+\/=A-Za-z0-9]+)$/.exec(req.headers.authorization||'');
     if(!bearer)throw new HttpError(401,'Effettua l’accesso per partecipare');
     const payload=await parseBody(req);
     const result=await submit(payload,bearer[1]);
     response(res,200,result,origin);
   }catch(error){
     const code=error instanceof HttpError?error.status:503;
     if(code===503)console.error('Arena unavailable:',String(error?.message||error).slice(0,180));
     if(!res.headersSent)response(res,code,{error:code===503?'Verifica non disponibile':error.message},origin);
   }
 });
}
if(require.main===module){
 secureEnv();
 createServer().listen(PORT,HOST,()=>console.log('GDH Arena coordinator listening (TLS reverse proxy required)'));
}
module.exports={createServer,secureEnv,submit,activeChallenge,checkCountry,privateFixture,applyRateLimit};
