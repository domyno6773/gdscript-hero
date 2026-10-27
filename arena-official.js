'use strict';
// UI for real seasons. No fabricated players, grades, official XP, or active seasons.
// Static site NEVER receives service role credentials or hidden test fixtures.
const OfficialArena=(()=>{
 const COUNTRY_CODES='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
 const seasonPattern=/^\d{4}-(0[1-9]|1[0-2])$/;
 const idPattern=/^[a-z0-9][a-z0-9_-]{3,79}$/;
 const MAX_SOURCE=10000;
 let busy=false,season=null,challenges=[],selected=null,country=null,boardScope='global',opening=false;
 const $=id=>document.getElementById(id);
 const client=()=>window.AuthManager?.supabaseClient||null;
 const apiBase=()=>typeof window.SupabaseConfig?.arenaApiBaseUrl==='string'
   ?window.SupabaseConfig.arenaApiBaseUrl.trim().replace(/\/$/,''):'';
 const canSubmit=()=>/^https:\/\/[A-Za-z0-9.-]+(?::\d+)?$/.test(apiBase());
 const formatCountry=(code)=>{
   try{return new Intl.DisplayNames(['it'],{type:'region'}).of(code)||code;}catch{return code;}
 };
 const label=(id,text)=>{const e=$(id);if(e)e.textContent=text;};
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;};
 const seasonLabel=id=>id?new Intl.DateTimeFormat('it-IT',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(id+'-01T12:00:00Z')):'';
 const setStatus=(message)=>label('official-status',message);
 const show=(id,visible)=>$(id)?.classList.toggle('hidden',!visible);
 async function sessionToken(){
   if(!client()||window.AuthManager?.isGuest())return null;
   const {data,error}=await client().auth.getSession();
   if(error||!data?.session?.access_token)return null;
   return data.session.access_token;
 }
 function countries(){
   const root=$('official-country-select');if(!root||root.options.length>1)return;
   const opts=COUNTRY_CODES.map(code=>({code,name:formatCountry(code)}))
     .sort((a,b)=>a.name.localeCompare(b.name,'it'));
   for(const item of opts){const option=document.createElement('option');option.value=item.code;
     option.textContent=item.name;root.append(option);}
 }
 function isValidResponse(payload){
   return !!(payload&&payload.official===true&&Number.isFinite(payload.points)&&
     Number.isFinite(payload.bestPoints)&&Number.isFinite(payload.xpAwarded));
 }
 async function fetchSeason(){
   const supabase=client();if(!supabase)return null;
   const {data,error}=await supabase.from('gdh_seasons')
     .select('id,opens_at,closes_at').order('id',{ascending:false}).limit(1);
   if(error)throw error;
   const row=data?.[0];return row&&seasonPattern.test(row.id)?row:null;
 }
 async function fetchChallenges(id){
   const {data,error}=await client().from('gdh_challenges')
     .select('id,title,task,difficulty,topics,points_max,xp_once,published_at')
     .eq('season_id',id).order('published_at',{ascending:true});
   if(error)throw error;
   return (data||[]).filter(row=>idPattern.test(row.id)&&
     [100,150,250].includes(row.points_max));
 }
 function populateList(){
   const root=$('official-challenge-list');if(!root)return;
   root.replaceChildren();
   if(!challenges.length){
     root.append(node('p','competition-result-note','Nessuna sfida pubblicata in questa stagione.'));
     return;
   }
   for(const c of challenges){
     const btn=node('button','competition-demo-tab'+(selected?.id===c.id?' active':''));
     btn.type='button';btn.setAttribute('aria-pressed',String(selected?.id===c.id));
     btn.append(node('span','competition-tab-name',c.title),
       node('span','competition-tab-meta',c.difficulty+' · '+c.points_max+' pt'));
     btn.addEventListener('click',()=>pickChallenge(c.id));root.append(btn);
   }
 }
 function pickChallenge(id){
   const next=challenges.find(row=>row.id===id);if(!next||busy)return;
   selected=next;
   label('official-task-title',next.title);
   label('official-task-meta',next.difficulty+' · '+next.points_max+' punti competitivi · +'+next.xp_once+' XP a soluzione completa');
   label('official-task-description',next.task);
   // Saving own code is the student's responsibility, not a Premium archive feature.
   if($('official-code'))$('official-code').value='extends Node\n\n# Scrivi qui la tua soluzione\n';
   label('official-result','Puoi inviare la soluzione dopo aver confermato il Paese per la stagione.');
   populateList();
 }
 async function fetchCountry(){
   country=null;show('official-country-confirmed',false);show('official-country-form',false);
   const token=await sessionToken();
   if(!token){setStatus('Puoi consultare le sfide gratuitamente. Accedi per registrare punteggi ufficiali.');return;}
   const {data,error}=await client().rpc('gdh_my_country',{p_season:season.id});
   if(error){setStatus('Impossibile leggere il Paese di questa stagione.');return;}
   if(data){
     country=String(data);
     label('official-country-confirmed','Paese confermato per questa stagione: '+formatCountry(country)+' ('+country+'). Non modificabile fino alla prossima stagione.');
     show('official-country-confirmed',true);
   }else{
     show('official-country-form',true);
     label('official-country-help','Conferma il Paese per partecipare. Una volta salvato non potrai cambiarlo durante questa stagione.');
     // IP-based suggestion ONLY from an explicitly configured protected endpoint.
     if(canSubmit()){
       try{
         const result=await fetch(apiBase()+'/api/arena/country-suggestion',{cache:'no-store'});
         if(result.ok){
           const guess=await result.json();
           if(COUNTRY_CODES.includes(guess.country)){
             $('official-country-select').value=guess.country;
             label('official-country-help','Paese suggerito dalla posizione IP approssimativa: '+
               formatCountry(guess.country)+'. È sbagliato? Seleziona il tuo Paese prima di confermare.');
           }
         }
       }catch{}
     }
   }
 }
 async function confirmCountry(){
   if(!season||busy||country)return;
   const code=$('official-country-select')?.value;
   if(!COUNTRY_CODES.includes(code)){label('official-country-help','Seleziona un Paese valido.');return;}
   if(!(await sessionToken())){login();return;}
   busy=true;const button=$('official-country-save');if(button)button.disabled=true;
   try{
     const {data,error}=await client().rpc('gdh_confirm_country',{p_season:season.id,p_country:code});
     if(error)throw error;
     country=data;
     show('official-country-form',false);show('official-country-confirmed',true);
     label('official-country-confirmed','Paese confermato: '+formatCountry(country)+'. Rimarrà invariato per la stagione '+seasonLabel(season.id)+'.');
     if(boardScope==='country')await leaderboard();
   }catch(e){label('official-country-help','Impossibile confermare: '+String(e.message||e).slice(0,160));}
   finally{busy=false;if(button)button.disabled=false;}
 }
 async function leaderboard(){
   const root=$('official-leaderboard');if(!root||!season)return;
   root.replaceChildren(node('p','competition-result-note','Caricamento classifica...'));
   if(boardScope==='country'&&!country){
     root.replaceChildren(node('p','competition-result-note','Conferma il Paese per visualizzare la classifica nazionale.'));
     return;
   }
   try{
     const {data,error}=await client().rpc('gdh_leaderboard',{
       p_season:season.id,p_scope:boardScope,p_limit:50});
     if(error)throw error;
     root.replaceChildren();
     if(!data?.length){
       root.append(node('p','competition-result-note','Nessun risultato verificato per questa stagione.'));
       return;
     }
     for(const entry of data){
       const row=node('div','official-rank');
       row.append(node('span','official-rank-position','#'+entry.rank),
         node('span','official-rank-name',entry.display_name||'Eroe Godot'),
         node('span','official-rank-score',entry.points+' pt'));
       root.append(row);
     }
   }catch{
     root.replaceChildren(node('p','competition-result-note','Classifica non ancora disponibile.'));
   }
 }
 function scope(value){
   if(value!=='global'&&value!=='country')return;
   boardScope=value;
   for(const x of ['global','country']){
     const b=$('official-rank-'+x);b?.setAttribute('aria-pressed',String(value===x));
     b?.classList.toggle('active',x===value);
   }
   void leaderboard();
 }
 function login(){
   if(typeof window.App?.openAuthModal==='function')window.App.openAuthModal('login');
 }
 async function submit(){
   if(busy||!selected||!season)return;
   const token=await sessionToken();
   if(!token){login();setStatus('Effettua l’accesso con un account per partecipare alla classifica.');return;}
   if(!country){setStatus('Conferma prima il Paese della stagione.');return;}
   if(!canSubmit()){setStatus('Invio ufficiale non attivo: il valutatore server non è ancora configurato.');return;}
   const code=$('official-code')?.value||'';
   if(!code.trim()||new TextEncoder().encode(code).length>MAX_SOURCE){
     label('official-result','Inserisci un codice GDScript valido, massimo 10.000 byte.');
     return;
   }
   busy=true;const btn=$('official-submit');if(btn){btn.disabled=true;btn.textContent='Verifica ufficiale in corso...';}
   label('official-result','Valutazione Godot in corso. Il codice viene eseguito su un server isolato.');
   try{
     const result=await fetch(apiBase()+'/api/arena/submit',{
       method:'POST',mode:'cors',cache:'no-store',
       headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
       body:JSON.stringify({challengeId:selected.id,attemptId:crypto.randomUUID(),code})
     });
     if(!result.ok)throw Error(result.status===429?'Troppi tentativi: riprova più tardi.':'Verifica ufficiale non disponibile.');
     const body=await result.json();
     if(!isValidResponse(body)||body.challengeId!==selected.id)throw Error('Risposta ufficiale non valida.');
     label('official-result','Risultato verificato: '+body.points+'/'+body.maxPoints+
       ' pt · Miglior risultato '+body.bestPoints+' pt · XP nuovi: +'+body.xpAwarded+
       (body.duplicateAttempt?' (tentativo già registrato)':''));
     const root=$('official-feedback');root?.replaceChildren();
     for(const check of body.feedback||[]){
       if(typeof check.requirement!=='string')continue;
       root?.append(node('div','competition-check',
         check.requirement+' · '+check.points+'/'+check.max+' punti'));
     }
     await leaderboard();
   }catch(error){label('official-result',String(error.message||error).slice(0,180));}
   finally{busy=false;if(btn){btn.disabled=false;btn.textContent='Invia soluzione classificata';}}
 }
 function download(){
   const code=$('official-code')?.value;if(!code||!selected)return;
   window.App?.downloadFile?.(selected.id+'.gd',code,'text/plain');
 }
 async function open(){
   if(opening)return;opening=true;
   countries();
   show('official-stage-empty',true);
   show('official-stage-live',false);
   setStatus('Verifica delle stagioni in corso...');
   try{
     season=await fetchSeason();
     if(!season){
       setStatus('Le stagioni classificate non sono ancora attive. Le sfide dimostrative restano gratuite.');
       return;
     }
     challenges=await fetchChallenges(season.id);
     label('official-season-title','Stagione di '+seasonLabel(season.id));
     show('official-stage-empty',false);show('official-stage-live',true);
     selected=null;populateList();
     if(challenges.length)pickChallenge(challenges[0].id);
     await fetchCountry();
     await leaderboard();
     if(!canSubmit())setStatus('Classifiche consultabili; invio dei risultati ufficiali non ancora abilitato.');
     else setStatus('Le sfide classificate sono aperte a tutti. Serve un account per registrare punti.');
     const button=$('official-submit');if(button)button.disabled=!canSubmit();
   }catch(error){
     show('official-stage-empty',true);show('official-stage-live',false);
     setStatus('Arena ufficiale in preparazione: server e database non ancora operativi.');
   }finally{opening=false;}
 }
 function wire(){
   $('official-country-save')?.addEventListener('click',()=>void confirmCountry());
   $('official-rank-global')?.addEventListener('click',()=>scope('global'));
   $('official-rank-country')?.addEventListener('click',()=>scope('country'));
   $('official-submit')?.addEventListener('click',()=>void submit());
   $('official-download')?.addEventListener('click',download);
   $('official-login')?.addEventListener('click',login);
 }
 return Object.freeze({COUNTRY_CODES,seasonLabel,canSubmit,formatCountry,
   open,wire,scope,fetchSeason,fetchChallenges,get state(){return {season,country,boardScope,selected:selected?.id||null}}});
})();
if(typeof window!=='undefined')window.OfficialArena=OfficialArena;
if(typeof module!=='undefined'&&module.exports)module.exports=OfficialArena;
