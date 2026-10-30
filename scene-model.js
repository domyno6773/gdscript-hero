/* Shared scene contract: editor, native runtime and .tscn export.
   This is scene data, never a GDScript interpreter. */
(function(root){
'use strict';
const types=Object.freeze({
 Node:{group:'Node',description:'Organizza altri nodi. Non ha posizione né grafica.'},
 Node2D:{group:'2D',description:'Trasformazione 2D ereditata dai figli.'},
 Control:{group:'UI',description:'Contenitore per elementi di interfaccia.'},
 Label:{group:'UI',description:'Mostra testo sullo schermo.'},
 Button:{group:'UI',description:'Emette pressed quando viene premuto.'},
 ColorRect:{group:'UI',description:'Rettangolo colorato, utile per prototipi.'},
 ProgressBar:{group:'UI',description:'Mostra un valore fra minimo e massimo.'},
 Timer:{group:'Node',description:'Emette timeout dopo wait_time secondi.'},
 Sprite2D:{group:'2D',description:'Mostra una texture; nel laboratorio usa un segnaposto integrato.'},
 CharacterBody2D:{group:'2D',description:'Corpo controllato da codice con velocity e move_and_slide().'},
 StaticBody2D:{group:'2D',description:'Ostacolo fisico immobile.'},
 Area2D:{group:'2D',description:'Rileva corpi e aree tramite segnali.'},
 CollisionShape2D:{group:'2D',description:'Forma rettangolare per un corpo fisico o Area2D.'}
});
const identifier=/^[A-Za-z_][A-Za-z0-9_]{0,39}$/;
const clone=x=>JSON.parse(JSON.stringify(x));
const finite=(v,f,min=-10000,max=10000)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Number(v))):f;
function properties(node,index=0){
 const n={name:String(node.name||''),type:node.type||'Node',parent:node.parent??null};
 if(!types[n.type])throw Error('Tipo di nodo non supportato: '+n.type);
 if(!identifier.test(n.name))throw Error('Nome non valido: usa lettere, numeri e underscore; inizia con una lettera.');
 const ui=types[n.type].group==='UI',spatial=ui||types[n.type].group==='2D';
 if(spatial){
   n.position={x:finite(node.position?.x,ui?24:0),y:finite(node.position?.y,ui?24+index*44:0)};
   n.visible=node.visible!==false;
 }
 if(ui)n.size={x:finite(node.size?.x,180,0,4096),y:finite(node.size?.y,36,0,4096)};
 if(['Label','Button'].includes(n.type))n.text=String(node.text??n.name).slice(0,200);
 if(n.type==='Button')n.disabled=!!node.disabled;
 if(n.type==='ColorRect')n.color=/^#[a-f\d]{6}$/i.test(node.color)?node.color:'#478cbf';
 if(n.type==='Timer')Object.assign(n,{wait_time:finite(node.wait_time,1,0.05,120),one_shot:!!node.one_shot,autostart:!!node.autostart});
 if(n.type==='ProgressBar'){
   n.min_value=finite(node.min_value,0);n.max_value=Math.max(n.min_value+1,finite(node.max_value,100));
   n.value=finite(node.value,0,n.min_value,n.max_value);
 }
 if(n.type==='CollisionShape2D')n.shape_size={x:finite(node.shape_size?.x,32,1,4096),y:finite(node.shape_size?.y,32,1,4096)};
 if(['CharacterBody2D','StaticBody2D','Area2D'].includes(n.type)){
   n.collision_layer=finite(node.collision_layer,1,0,65535)|0;
   n.collision_mask=finite(node.collision_mask,1,0,65535)|0;
 }
 return n;
}
function normalize(input){
 if(!Array.isArray(input)||!input.length)input=[{name:'Main',type:'Node2D',parent:null}];
 if(input.length>48)throw Error('Il laboratorio supporta fino a 48 nodi.');
 const nodes=input.map(properties),map=new Map(nodes.map(n=>[n.name,n]));
 if(map.size!==nodes.length)throw Error('Nel laboratorio i nomi dei nodi devono essere univoci.');
 const roots=nodes.filter(n=>n.parent===null||n.parent==='');
 if(roots.length!==1)throw Error('La scena deve avere una sola radice.');
 roots[0].parent=null;
 const visit=(n,chain=new Set())=>{
   if(chain.has(n.name))throw Error('La gerarchia contiene un ciclo.');
   if(n.parent===null)return;
   if(!map.has(n.parent))throw Error('Genitore mancante per '+n.name+'.');
   visit(map.get(n.parent),new Set([...chain,n.name]));
 };
 nodes.forEach(n=>visit(n));
 const sorted=[];
 const walk=n=>{sorted.push(n);nodes.filter(c=>c.parent===n.name).forEach(walk);};
 walk(roots[0]);return sorted;
}
function path(nodes,name){
 const map=new Map(nodes.map(n=>[n.name,n]));let n=map.get(name);if(!n)throw Error('Nodo non trovato');
 const parts=[],seen=new Set();
 while(n.parent!==null&&n.parent!==''){
   if(seen.has(n.name))throw Error('Gerarchia non valida');seen.add(n.name);
   parts.unshift(n.name);n=map.get(n.parent);if(!n)throw Error('Genitore mancante');
 }
 return parts.join('/')||'.';
}
function descendants(nodes,name){
 const selected=new Set([name]);let changed=true;
 while(changed){changed=false;for(const n of nodes)if(selected.has(n.parent)&&!selected.has(n.name)){selected.add(n.name);changed=true;}}
 return selected;
}
function rename(nodes,oldName,newName){
 const next=clone(nodes);const n=next.find(n=>n.name===oldName);if(!n)throw Error('Nodo non trovato');
 n.name=newName;next.forEach(c=>{if(c.parent===oldName)c.parent=newName;});return normalize(next);
}
function reparent(nodes,name,parent){
 const next=clone(nodes),n=next.find(n=>n.name===name);
 if(!n||n.parent===null)throw Error('La radice non può essere spostata.');
 if(descendants(nodes,name).has(parent))throw Error('Un nodo non può diventare figlio di sé o di un suo discendente.');
 n.parent=parent;return normalize(next);
}
function remove(nodes,name){
 if(nodes.find(n=>n.name===name)?.parent===null)throw Error('La radice non può essere eliminata.');
 const deleted=descendants(nodes,name);return normalize(nodes.filter(n=>!deleted.has(n.name)));
}
const quote=value=>JSON.stringify(String(value));
function exportProject(project){
 const nodes=normalize(project.nodes),rootNode=nodes[0];
 const base=/^\s*extends\s+(\w+)/m.exec(project.code||'')?.[1]||'Node';
 const parents={Node2D:'Node',Control:'Node',Label:'Control',Button:'Control',ColorRect:'Control',ProgressBar:'Control',Timer:'Node',Sprite2D:'Node2D',CharacterBody2D:'Node2D',StaticBody2D:'Node2D',Area2D:'Node2D',CollisionShape2D:'Node2D'};
 let t=rootNode.type;while(t&&t!==base)t=parents[t];
 if(!t)throw Error('Lo script estende '+base+', ma la radice è '+rootNode.type+'. Scegli tipi compatibili.');
 const shapes=nodes.filter(n=>n.type==='CollisionShape2D'),sprites=nodes.some(n=>n.type==='Sprite2D');
 let scene=`[gd_scene load_steps=${2+shapes.length+(sprites?1:0)} format=3]\n\n[ext_resource type="Script" path="res://main.gd" id="1"]\n`;
 if(sprites)scene+='[ext_resource type="Texture2D" path="res://placeholder.svg" id="2"]\n';
 for(const n of shapes)scene+=`\n[sub_resource type="RectangleShape2D" id="Shape_${n.name}"]\nsize = Vector2(${n.shape_size.x}, ${n.shape_size.y})\n`;
 for(const n of nodes){
   scene+=`\n[node name=${quote(n.name)} type=${quote(n.type)}${n.parent===null?'':' parent='+quote(path(nodes,n.parent))}]\n`;
   if(n.parent===null)scene+='script = ExtResource("1")\n';
   const ui=types[n.type].group==='UI';
   if(n.position){
     if(ui)scene+=`offset_left = ${n.position.x}.0\noffset_top = ${n.position.y}.0\noffset_right = ${n.position.x+n.size.x}.0\noffset_bottom = ${n.position.y+n.size.y}.0\n`.replace(/(\d+\.\d+)\.0/g,'$1');
     else scene+=`position = Vector2(${n.position.x}, ${n.position.y})\n`;
   }
   for(const key of ['text','visible','disabled','wait_time','one_shot','autostart','min_value','max_value','value','collision_layer','collision_mask'])if(n[key]!==undefined)scene+=key+' = '+(typeof n[key]==='string'?quote(n[key]):String(n[key]))+'\n';
   if(n.color){const rgb=n.color.slice(1).match(/../g).map(x=>parseInt(x,16)/255);scene+=`color = Color(${rgb.join(', ')}, 1)\n`;}
   if(n.type==='CollisionShape2D')scene+=`shape = SubResource("Shape_${n.name}")\n`;
   if(n.type==='Sprite2D')scene+='texture = ExtResource("2")\n';
 }
 return {'project.godot':`config_version=5\n\n[application]\nconfig/name=${quote(project.name||'GDScript Hero')}\nrun/main_scene="res://main.tscn"\n\n[display]\nwindow/size/viewport_width=640\nwindow/size/viewport_height=360\n\n[rendering]\nrenderer/rendering_method="gl_compatibility"\n`,
 'main.tscn':scene,'main.gd':/^\s*extends\s+/m.test(project.code||'')?project.code:'extends Node\n'+(project.code||''),
 ...(sprites?{'placeholder.svg':'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect x="1" y="1" width="30" height="30" rx="4" fill="#478cbf" stroke="#b6dbed"/><path d="M8 12h4m8 0h4M10 22h12" stroke="#fff" stroke-width="3"/></svg>'}:{})};
}
// Uncompressed ZIP: no network dependency, deterministic UTF-8 file entries.
function zip(files){
 const enc=new TextEncoder(),parts=[],central=[];let offset=0;
 const crc=bytes=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
 const header=(size,signature)=>{const a=new Uint8Array(size);new DataView(a.buffer).setUint32(0,signature,true);return a;};
 for(const [name,text] of Object.entries(files)){
   const filename=enc.encode(name),bytes=enc.encode(text),sum=crc(bytes),local=header(30,0x04034b50),v=new DataView(local.buffer);
   v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint32(14,sum,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,filename.length,true);
   parts.push(local,filename,bytes);
   const entry=header(46,0x02014b50),d=new DataView(entry.buffer);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint32(16,sum,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,filename.length,true);d.setUint32(42,offset,true);central.push(entry,filename);offset+=30+filename.length+bytes.length;
 }
 const end=header(22,0x06054b50),e=new DataView(end.buffer),count=Object.keys(files).length;
 e.setUint16(8,count,true);e.setUint16(10,count,true);e.setUint32(12,central.reduce((s,a)=>s+a.length,0),true);e.setUint32(16,offset,true);
 return new Blob([...parts,...central,end],{type:'application/zip'});
}
root.GDHSceneModel=Object.freeze({types,normalize,path,descendants,rename,reparent,remove,exportProject,zip,clone});
})(typeof window==='undefined'?globalThis:window);
