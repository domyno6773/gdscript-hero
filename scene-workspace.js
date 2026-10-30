/* Scene workspace: local authoring data and a separate native Godot play session. */
(() => {
'use strict';
const M=window.GDHSceneModel,A=window.App;
if(!M||!A)return;
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const button=(text,fn,title=text)=>{const b=el('button','scene-action',text);b.type='button';b.title=title;b.onclick=fn;return b;};
let progressTimer=null;
let selected=null,running=false,generation=0,history=[],future=[],projectId=null,collapsed=new Set();
const status=text=>{const n=$('scene-workspace-message');if(n)n.textContent=text;};
const project=()=>A.getActiveSandboxProject();
function getNodes(){return M.normalize(project().nodes);}
function remember(){history.push(M.clone(project().nodes));if(history.length>50)history.shift();future=[];}
function save(nodes,message){
 if(running)throw Error('Ferma la scena prima di modificarla.');
 const next=M.normalize(nodes);remember();project().nodes=next;project().updatedAt=new Date().toISOString();
 A.saveStorage();refresh();status(message||'Scena salvata.');
}
function attempt(fn){try{fn();}catch(e){status(e.message);}}
function field(parent,label,value,onChange,kind='text',options=[]){
 const row=el('label','scene-field'),caption=el('span','',label);let input;
 if(kind==='select'){input=el('select');options.forEach(o=>{const opt=el('option','',o.label??o.value??o);opt.value=o.value??o;input.append(opt);});}
 else input=el('input');
 if(kind!=='select')input.type=kind;
 if(kind==='number')input.step='any';
 if(kind==='checkbox')input.checked=!!value;else input.value=value??'';
 input.disabled=running;input.onchange=()=>attempt(()=>onChange(kind==='checkbox'?input.checked:kind==='number'?Number(input.value):input.value));
 row.append(caption,input);parent.append(row);return input;
}
function refresh(){
 window.GDHCourseCapstoneVerifier?.render();
 let nodes;try{nodes=getNodes();}catch(e){status(e.message);return;}
 const p=project();
 if(projectId!==p.id){projectId=p.id;history=[];future=[];selected=nodes[0].name;collapsed=new Set();}
 if(!nodes.some(n=>n.name===selected))selected=nodes[0].name;
 const tree=$('sandbox-scene-tree');if(!tree)return;tree.replaceChildren();tree.setAttribute('role','tree');tree.setAttribute('aria-label','Albero della scena locale');
 const walk=(n,depth)=>{
   const children=nodes.filter(c=>c.parent===n.name),row=el('div','scene-tree-row');
   row.style.paddingLeft=(depth*15)+'px';
   const fold=button(children.length?(collapsed.has(n.name)?'▸':'▾'):'·',()=>{collapsed.has(n.name)?collapsed.delete(n.name):collapsed.add(n.name);refresh();},'Espandi o comprimi '+n.name);
   fold.className='scene-fold';fold.disabled=!children.length;fold.tabIndex=-1;
   const item=button(n.name,()=>{selected=n.name;refresh();},n.type+' · '+M.path(nodes,n.name));item.className='scene-node-select'+(selected===n.name?' selected':'');
   item.setAttribute('role','treeitem');item.setAttribute('aria-level',String(depth+1));item.setAttribute('aria-selected',String(selected===n.name));
   if(children.length)item.setAttribute('aria-expanded',String(!collapsed.has(n.name)));
   const icon=el('span','scene-kind scene-kind-'+M.types[n.type].group,M.types[n.type].group==='2D'?'◇':M.types[n.type].group==='UI'?'▣':'○');icon.setAttribute('aria-hidden','true');item.prepend(icon);
   item.append(el('small','',n.parent===null?'main.gd':n.type));
   item.onkeydown=e=>{const items=[...tree.querySelectorAll('[role=treeitem]')],i=items.indexOf(item);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();items[Math.max(0,Math.min(items.length-1,i+(e.key==='ArrowDown'?1:-1)))]?.focus();}if(e.key==='ArrowRight'){collapsed.delete(n.name);refresh();}if(e.key==='ArrowLeft'){collapsed.add(n.name);refresh();}};
   row.append(fold,item);tree.append(row);if(!collapsed.has(n.name))children.forEach(c=>walk(c,depth+1));
 };
 walk(nodes[0],0);$('sandbox-scene-node-count').textContent=nodes.length+(nodes.length===1?' nodo':' nodi');
 const details=$('sandbox-node-details');details.replaceChildren();
 const n=nodes.find(n=>n.name===selected);
 details.append(el('h3','scene-inspector-title','Inspector'),el('strong','',n.type),el('p','scene-description',M.types[n.type].description));
 const path=M.path(nodes,n.name);details.append(el('code','scene-node-path',path==='.'?'self · main.gd':'$'+path));
 const update=(key,v)=>save(nodes.map(x=>x.name===n.name?{...x,[key]:v}:x));
 field(details,'Nome',n.name,v=>{save(M.rename(nodes,n.name,v),'Nodo rinominato. Aggiorna eventuali percorsi $ nel codice.');selected=v;refresh();});
 if(n.parent!==null){const invalid=M.descendants(nodes,n.name);field(details,'Genitore',n.parent,v=>save(M.reparent(nodes,n.name,v),'Gerarchia aggiornata. Controlla i percorsi nel codice.'),'select',nodes.filter(x=>!invalid.has(x.name)).map(x=>({value:x.name,label:M.path(nodes,x.name)==='.'?x.name:M.path(nodes,x.name)})));}
 else {
   field(details,'Tipo radice',n.type,v=>update('type',v),'select',['Node','Node2D','Control','CharacterBody2D']);
   details.append(el('p','scene-description','main.gd è collegato a questa radice. I percorsi $ partono da qui. Se cambi tipo, adatta extends nello script.'));
 }
 for(const key of ['position','size','shape_size'])if(n[key]){
   const labels={position:'Position',size:'Size',shape_size:'Shape · Size'};
   const group=el('fieldset','scene-vector');group.append(el('legend','',labels[key]));
   for(const axis of ['x','y'])field(group,axis.toUpperCase(),n[key][axis],v=>update(key,{...n[key],[axis]:v}),'number');details.append(group);
 }
 for(const [key,label,type] of [['text','Text','text'],['visible','Visible','checkbox'],['disabled','Disabled','checkbox'],['color','Color','color'],['wait_time','Wait Time (s)','number'],['one_shot','One Shot','checkbox'],['autostart','Autostart','checkbox'],['min_value','Min Value','number'],['max_value','Max Value','number'],['value','Value','number'],['collision_layer','Collision Layer','number'],['collision_mask','Collision Mask','number']])if(n[key]!==undefined)field(details,label,n[key],v=>update(key,v),type);
 if(n.type==='CollisionShape2D'&&!['CharacterBody2D','StaticBody2D','Area2D'].includes(nodes.find(x=>x.name===n.parent)?.type))details.append(el('p','scene-warning','La forma deve essere figlia diretta di un corpo fisico o di Area2D per partecipare alle collisioni.'));
 if(['Button','Timer','Area2D'].includes(n.type)){
   details.append(el('h4','','Segnali'));
   const signal=n.type==='Button'?'pressed':n.type==='Timer'?'timeout':'body_entered';
   details.append(el('code','scene-node-path',signal+(signal==='body_entered'?'(body)':'()')));
   details.append(el('p','scene-description','Collega questo segnale esplicitamente nello script. Il nome della funzione da solo non crea una connessione.'));
   const ref=path==='.'?'self':'$'+path,method='_on_'+n.name.replace(/([a-z])([A-Z])/g,'$1_$2').toLowerCase()+'_'+signal;
   details.append(el('pre','scene-signal-example',ref+'.'+signal+'.connect('+method+')'));
 }
 const remove=$('btn-sandbox-remove-node');remove.classList.toggle('hidden',n.parent===null);remove.disabled=running || n.parent===null;
 remove.title=running?'Premi «Ferma» prima di eliminare nodi.':'Elimina il nodo selezionato e i suoi figli';
 $('btn-sandbox-add-node').disabled=running;
 for(const [id,disabled] of [['scene-undo',!history.length||running],['scene-redo',!future.length||running]])if($(id))$(id).disabled=disabled;
 if(!running)renderEditor(nodes);
}
function renderEditor(nodes){
 const overlay=$('sandbox-ui-overlay');overlay.replaceChildren();overlay.className='scene-editor-surface';overlay.style.display='block';
 const positions=new Map(),visible=new Map();
 for(const n of nodes){
   const p=positions.get(n.parent)||{x:0,y:0},pos={x:p.x+(n.position?.x||0),y:p.y+(n.position?.y||0)};positions.set(n.name,pos);
   const shown=n.visible!==false&&visible.get(n.parent)!==false;visible.set(n.name,shown);
   if(!n.position||!shown||['Node2D','Control','CharacterBody2D','StaticBody2D','Area2D'].includes(n.type))continue;
   const item=el('button','scene-preview-node scene-preview-'+n.type+(selected===n.name?' selected':''));item.type='button';item.title=n.name+' · '+n.type;item.setAttribute('aria-label','Seleziona '+n.name);
   Object.assign(item.style,{left:pos.x+'px',top:pos.y+'px',width:(n.size?.x||n.shape_size?.x||32)+'px',height:(n.size?.y||n.shape_size?.y||32)+'px'});
   if(n.type==='Sprite2D'||n.type==='CollisionShape2D')item.style.transform='translate(-50%, -50%)';
   if(n.text!==undefined)item.textContent=n.text;
   if(n.color)item.style.background=n.color;
   if(n.type==='ProgressBar'){item.textContent=Math.round((n.value-n.min_value)/(n.max_value-n.min_value)*100)+'%';item.style.background=`linear-gradient(to right,#478cbf ${Math.round((n.value-n.min_value)/(n.max_value-n.min_value)*100)}%,#252e3c 0)`;}
   item.onpointerdown=e=>{
     if(e.button!==0)return;e.preventDefault();selected=n.name;const start={x:e.clientX,y:e.clientY},original={...n.position};let moved=false;
     item.setPointerCapture(e.pointerId);
     item.onpointermove=ev=>{if(!item.hasPointerCapture(ev.pointerId))return;moved=true;item.style.left=(pos.x+ev.clientX-start.x)+'px';item.style.top=(pos.y+ev.clientY-start.y)+'px';};
     item.onpointerup=ev=>{item.onpointermove=null;item.onpointerup=null;if(moved)attempt(()=>save(nodes.map(x=>x.name===n.name?{...x,position:{x:Math.round(original.x+ev.clientX-start.x),y:Math.round(original.y+ev.clientY-start.y)}}:x)));else refresh();};
   };
   item.onclick=()=>{selected=n.name;refresh();};overlay.append(item);
 }
}
function addDialog(){
 if(running)return;
 const dialog=el('dialog','scene-create-dialog'),heading=el('h2','','Crea un nuovo nodo'),search=el('input','scene-node-search');search.type='search';search.placeholder='Cerca un tipo di nodo…';search.setAttribute('aria-label','Cerca tipo di nodo');
 const parent=getNodes().find(n=>n.name===selected)||getNodes()[0];dialog.append(heading,el('p','','Il nodo sarà figlio di '+parent.name+'.'),search);
 const list=el('div','scene-type-list');dialog.append(list);
 function filter(){list.replaceChildren();for(const [type,info] of Object.entries(M.types))if((type+' '+info.description).toLowerCase().includes(search.value.toLowerCase())){
   const b=button(type,()=>attempt(()=>{const nodes=getNodes();let name=type,i=2;while(nodes.some(n=>n.name===name))name=type+i++;save([...nodes,{name,type,parent:parent.name}]);selected=name;dialog.close();refresh();}));b.append(el('small','',info.description));list.append(b);
 }}
 search.oninput=filter;filter();dialog.append(button('Annulla',()=>dialog.close()));dialog.onclose=()=>dialog.remove();document.body.append(dialog);dialog.showModal();search.focus();
}
function stop(){
 clearInterval(progressTimer);generation++;running=false;A.sandboxNativeSession=null;window.GDHGodot?.stopPreview();
 $('scene-game-host')?.replaceChildren();$('scene-game-host')?.classList.add('hidden');$('sandbox-ui-overlay')?.classList.remove('hidden');
 $('sandbox-code-editor').readOnly=false;$('scene-stop').disabled=true;$('btn-sandbox-run').disabled=false;
 $('scene-stop').textContent='■ Ferma';
 $('sandbox-status-tag').textContent='Locale · scena ferma';refresh();
}
async function run(){
 stop();const ticket=++generation,p=project(),editor=$('sandbox-code-editor');
 try{
   p.code=editor.value;p.nodes=getNodes();M.exportProject(p);A.saveStorage();
   running=true;editor.readOnly=true;$('scene-stop').disabled=false;$('scene-stop').textContent='■ Ferma · per modificare';$('btn-sandbox-run').disabled=true;refresh();status('Scena attiva: premi «Ferma» per modificare o eliminare i nodi.');
   const host=$('scene-game-host');host.classList.remove('hidden');$('sandbox-ui-overlay').classList.add('hidden');
   const output=$('sandbox-console-output');output.textContent='';$('sandbox-status-tag').textContent='Avvio Godot…';
   let count=0,noticeCount=0;
   const notices=$('sandbox-engine-notices'),noticeText=$('sandbox-engine-notice-text');
   if(notices){notices.hidden=true;noticeText.textContent='';}
   const append=(line,error)=>{
     if(ticket!==generation)return;
     // Questi messaggi provengono dal canale error del bootstrap Godot,
     // non da una verifica del codice GDScript dello studente.
     const infrastructure=/\b(?:IndexedDB|service.worker|PWA|persistent.storage|database.storage)\b/i;
     if(error && infrastructure.test(line)){
       noticeCount++;
       if(notices&&noticeText){
         notices.hidden=false;
         notices.querySelector('summary').textContent='Avvisi tecnici del motore ('+noticeCount+') · non sono errori del tuo codice';
         noticeText.textContent=(noticeText.textContent+'\n'+line).slice(-12000);
       }
       return;
     }
     if(++count>500)return;
     output.textContent=(output.textContent+'\n'+(error?'Errore: ':'')+line).slice(-20000);
     output.scrollTop=output.scrollHeight;
   };
   window.GDHGodot.beginPreview(host,append);
   progressTimer=setInterval(()=>{if(ticket===generation)$("sandbox-status-tag").textContent=window.GDHGodot.lastStage||"Avvio Godot…";},400);
   const result=await window.GDHGodot.execute(p.code,{sandboxNodes:p.nodes});if(ticket!==generation)return;
   result.logs?.forEach(l=>append(l,false));A.updateDidacticDebugger(result,[],'sandbox');
   if(!result.success)throw Error(result.error||result.native?.message||'La scena non è stata avviata.');
   clearInterval(progressTimer);A.sandboxNativeSession=p.id;$('sandbox-status-tag').textContent='In esecuzione · Godot 4.4.1';status('La scena è in esecuzione. Premi «Ferma» per aggiungere, eliminare o modificare i nodi.');
 }catch(e){if(ticket!==generation)return;stop();$('sandbox-console-output').textContent=e.message;status(e.message);}
}
const originalLoad=A.loadActiveSandboxProject.bind(A);
A.loadActiveSandboxProject=function(){if($('scene-stop'))stop();originalLoad();refresh();};
A.renderSandboxSceneDock=refresh;
A.renderSandboxViewportOverlay=()=>{if(!running)attempt(()=>renderEditor(getNodes()));};
A.runSandboxCode=run;
A.addSandboxNode=(name,type,text)=>attempt(()=>save([...getNodes(),{name,type,text,parent:selected||getNodes()[0].name}]));
A.removeSandboxNode=()=>attempt(()=>{const nodes=getNodes(),deleted=M.descendants(nodes,selected);save(M.remove(nodes,selected),deleted.size+' nodi rimossi. Puoi annullare.');});
A.exportSandboxToGodot4=()=>attempt(()=>{const p=project();p.code=$('sandbox-code-editor').value;A.saveStorage();const url=URL.createObjectURL(M.zip(M.exportProject(p))),a=el('a');a.href=url;a.download='godot-project.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);status('Progetto esportato. Estrai lo ZIP e importa project.godot in Godot 4.4 o successivo.');});
const originalSwitch=A.switchView.bind(A);A.switchView=function(id){if(id!=='view-practice'&&running)stop();return originalSwitch(id);};
window.addEventListener('DOMContentLoaded',()=>{
 const toolbar=$('sandbox-scene-tree').parentElement;
 const actions=el('div','scene-history');
 const undo=button('Annulla',()=>{if(!history.length||running)return;future.push(M.clone(project().nodes));project().nodes=history.pop();A.saveStorage();refresh();});undo.id='scene-undo';
 const redo=button('Ripeti',()=>{if(!future.length||running)return;history.push(M.clone(project().nodes));project().nodes=future.pop();A.saveStorage();refresh();});redo.id='scene-redo';actions.append(undo,redo);toolbar.prepend(actions);
 const message=el('p','scene-workspace-message','Seleziona un nodo per modificarne le proprietà.');message.id='scene-workspace-message';message.setAttribute('role','status');toolbar.append(message);
 const host=el('div','scene-game-host hidden');host.id='scene-game-host';$('sandbox-ui-overlay').parentElement.append(host);
 const notices=el('details','sandbox-engine-notices');notices.id='sandbox-engine-notices';notices.hidden=true;
 notices.append(el('summary','','Avvisi tecnici del motore'),el('pre','',''));
 notices.querySelector('pre').id='sandbox-engine-notice-text';
 $('sandbox-console-output').after(notices);
 const stopButton=button('■ Ferma',stop);stopButton.id='scene-stop';stopButton.disabled=true;$('btn-sandbox-run').after(stopButton);
 $('btn-sandbox-add-node').onclick=addDialog;$('btn-sandbox-restart').onclick=run;$('btn-sandbox-restart').title='Riavvia la scena da zero';
 $('btn-sandbox-export-godot').title='Scarica un progetto Godot completo in ZIP';
 const canvas=$('sandbox-viewport-canvas');canvas.style.display='none';A.practiceViewport?.stopLoop?.();
 document.addEventListener('keydown',e=>{if($('view-practice').classList.contains('hidden'))return;if(e.key==='F6'){e.preventDefault();run();}if(e.key==='F8'){e.preventDefault();stop();}});
 refresh();
});
window.GDHSceneWorkspace=Object.freeze({refresh,stop,run,get running(){return running;}});
})();
