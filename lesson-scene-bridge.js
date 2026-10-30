/* Lesson scenes are observed in Godot, never simulated in JavaScript. */
(function(root){
'use strict';
let active=null,items=[],status='before',selected='',verified=false;
const $=id=>document.getElementById(id);
const drawable=/\b(?:Label|Button|ColorRect|ProgressBar|Sprite2D|CharacterBody2D|StaticBody2D|Area2D)\.new\s*\(/;
const nodes=/\b(?:Node|Node2D|Control|Timer|CollisionShape2D)\.new\s*\(/;
function plan(lesson,task){
 if(!lesson||lesson.isQuiz)return {tree:false,viewport:false};
 if(root.GDHGameplayLessons?.has(lesson.id))return {tree:!!lesson.hasNodeTree,viewport:!!lesson.has2DViewport};
 const source=String(task&&!task.nativeOriginal?task.solution:lesson.solution||'');
 if(task&&!task.nativeOriginal){
  const graphics=drawable.test(source);
  return {tree:graphics||nodes.test(source)||/\badd_child\s*\(/.test(source),viewport:graphics};
 }
 const preset=!!lesson.hasNodeTree||Array.isArray(lesson.initialNodes)&&lesson.initialNodes.length>0;
 return {tree:preset||drawable.test(source)||nodes.test(source),
  viewport:[50,51,52,53,54,55,56,58,60,120].includes(lesson.id)||
    (!!lesson.has2DViewport&&![49,57,59,119].includes(lesson.id))};
}
const el=(tag,cls,value)=>{
 const x=document.createElement(tag);
 if(cls)x.className=cls;
 if(value!==undefined)x.textContent=String(value);
 return x;
};
function initial(lesson){
 const code=String(lesson?.solution||'');
 const base=/^\s*extends\s+(\w+)/m.exec(code)?.[1]||'Node';
 const list=[{name:'Root',path:'Root',class:base,depth:0}];
 for(const n of lesson?.initialNodes||[]){
  if(n?.name&&n?.type)list.push({name:n.name,path:'Root/'+n.name,class:n.type,depth:1,
    text:n.text,wait_time:n.wait_time});
 }
 return list;
}
function hideFake(){
 for(const id of ['exercise-ui-overlay','exercise-viewport-canvas']){
  const node=$(id);if(node){node.style.display='none';if(id==='exercise-ui-overlay')node.replaceChildren();}
 }
 for(const id of ['btn-open-add-node-modal','btn-remove-selected-node']){
  const node=$(id);if(node){node.classList.add('hidden');node.disabled=true;}
 }
}
function render(){
 if(!active)return;
 hideFake();
 const tree=$('exercise-scene-tree');if(!tree)return;
 tree.replaceChildren();tree.setAttribute('role','tree');
 const count=$('scene-node-count');if(count)count.textContent=items.length+' nod'+(items.length===1?'o':'i');
 const messages={before:'Struttura prevista · verifica il codice per leggere i nodi reali',
  running:'Esecuzione Godot in corso',verified:'Stato letto dal vero Godot · sola lettura',
  changed:'Codice modificato · verifica per aggiornare',error:'La scena non è stata eseguita',
  unavailable:'Stato del motore non disponibile'};
 let label=$('exercise-scene-source');
 if(!label){label=el('p','exercise-scene-source');label.id='exercise-scene-source';tree.before(label);}
 label.textContent=messages[status]||messages.before;
 const inspector=el('div','exercise-native-inspector');
 inspector.id='exercise-native-inspector';
 function select(path){
  selected=path;inspector.replaceChildren();
  for(const b of tree.querySelectorAll('.exercise-native-node')){
   b.classList.toggle('selected',b.dataset.path===path);
   b.setAttribute('aria-selected',String(b.dataset.path===path));
  }
  const n=items.find(x=>x.path===path);if(!n)return;
  inspector.append(el('strong','',n.name+' · Inspector'));
  for(const [key,value] of Object.entries(n)){
   if(['name','depth','parent','childCount','exists'].includes(key))continue;
   if(value===null||typeof value==='object')continue;
   const row=el('div','exercise-native-property');
   row.append(el('span','',key),el('code','',value));inspector.append(row);
  }
  if(!verified)inspector.append(el('small','', 'Dati previsti: non ancora osservati nel motore.'));
 }
 for(const n of items){
  const b=el('button','exercise-native-node');
  b.type='button';b.dataset.path=n.path;
  b.style.paddingLeft=(8+Math.min(12,Number(n.depth)||0)*14)+'px';
  b.setAttribute('role','treeitem');
  b.setAttribute('aria-label',n.class+' '+n.name);
  b.append(el('code','',n.class||'Node'),el('span','',n.name));
  if(n.queued)b.append(el('small','','queue_free'));
  b.onclick=()=>select(n.path);
  tree.append(b);
 }
 tree.append(inspector);
 if(!items.some(n=>n.path===selected))selected=items[0]?.path||'';
 select(selected);
}
function open(lesson,task){
 if(!lesson){active=null;return;}
 active={id:lesson.id,layout:plan(lesson,task)};
 items=active.layout.tree?initial(lesson):[];
 verified=false;status='before';selected='';render();
}
function change(){
 if(!active||status==='before'||status==='changed')return;
 items=active.layout.tree?initial(root.LESSONS_DATA?.find(l=>l.id===active.id)):[];
 verified=false;status='changed';selected='';render();
}
function applyNative(scene,success){
 if(!active||!active.layout.tree)return;
 if(success&&Array.isArray(scene)&&scene.length){
  items=scene.filter(n=>typeof n?.name==='string'&&typeof n?.path==='string'
    &&typeof n?.class==='string').slice(0,48);
  verified=items.length>0;status=verified?'verified':'unavailable';
 }else{items=[];verified=false;status=success?'unavailable':'error';}
 selected='';render();
}
if(typeof document!=='undefined')document.addEventListener('input',e=>{
 if(e.target?.id==='code-editor')change();
});
root.GDHLessonScene=Object.freeze({plan,open,render,hideFake,applyNative,
 isActive:()=>!!active,current:()=>active?.layout||{tree:false,viewport:false},
 running:()=>{if(active){status='running';render();}},
 change,get lastScene(){return items.slice();},get lastStatus(){return status;}});
})(typeof window!=='undefined'?window:globalThis);
