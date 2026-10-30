'use strict';
/* Short playable projects, checked with native input and actual physics frames. */
(() => {
 const player=[
  {name:'Player',type:'CharacterBody2D',position:{x:60,y:180}},
  {name:'PlayerSprite',type:'Sprite2D',parent:'Player'},
  {name:'PlayerShape',type:'CollisionShape2D',parent:'Player',shape_size:{x:20,y:20}}
 ];
 const move='    $Player.velocity = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down") * 120.0\n    $Player.move_and_slide()\n';
 const controller='extends Node2D\n\nfunc _physics_process(_delta):\n'+move;
 const entries=[
 {id:301,title:'Dal vettore al movimento nel tempo',
  theory:'<p>Una posizione è misurata in pixel; una velocità in pixel al secondo. Per passare dalla velocità allo spostamento del singolo aggiornamento devi moltiplicare per <code>delta</code>, il tempo trascorso. Senza questo fattore la velocità dipende dal numero di aggiornamenti.</p><p>Godot chiama <code>_process(delta)</code> a ogni frame disegnato e <code>_physics_process(delta)</code> a intervalli fisici regolari. Qui usiamo il secondo per prepararci alle collisioni. Non chiamarlo da <code>_ready()</code>: il motore gestisce il ciclo.</p><p>Per esempio <code>$Freccia.position += Vector2(0, 80) * delta</code> sposta una freccia verso il basso di 80 pixel al secondo. Una <code>Sprite2D</code> disegna una texture; nel laboratorio ne usiamo una segnaposto.</p><p>Il verificatore fa avanzare il motore per intervalli diversi e osserva la posizione. Apri anche la copia nel laboratorio per vedere il movimento continuo.</p>',
  task:'<p>Fai muovere Player verso destra a <strong>120 pixel al secondo</strong>, senza cambiare la sua altezza. Parte da (60, 180). Usa gli aggiornamenti fisici del motore e il tempo trascorso; non sono richieste stampe.</p>',
  initialNodes:[{name:'Player',type:'Sprite2D',position:{x:60,y:180}}],
  initialCode:'extends Node2D\n\nfunc _physics_process(delta):\n    pass\n',
  solution:'extends Node2D\n\nfunc _physics_process(delta):\n    $Player.position += Vector2(120, 0) * delta\n',
  guidance:['Quanta strada si percorre in mezzo secondo a 120 pixel al secondo?','Costruisci un vettore velocità e moltiplicalo per delta prima di aggiungerlo alla posizione.']},
 {id:302,title:'Un personaggio controllato dalla tastiera',
  theory:'<p><code>CharacterBody2D</code> è un corpo fisico controllato dal tuo script. La proprietà <code>velocity</code> contiene la velocità in pixel al secondo. <code>move_and_slide()</code> muove il corpo e risolve le collisioni usando il passo fisico: <strong>non moltiplicare velocity per delta</strong> prima di questa chiamata.</p><p><code>Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")</code> legge quattro azioni e restituisce una direzione di lunghezza massima 1. Senza tasti restituisce zero; in diagonale evita di andare più veloce. Queste azioni esistono già in Godot e funzionano con le frecce. In un progetto personale puoi crearne altre in Project Settings → Input Map.</p><p>Player ha due figli con ruoli diversi: Sprite2D lo rende visibile, CollisionShape2D ne definisce l’ingombro fisico. Lo script didattico è sulla radice e raggiunge Player con un percorso. In Godot potrai anche collegare uno script direttamente a Player e usare <code>velocity</code> senza il prefisso.</p>',
  task:'<p>Muovi Player con le quattro frecce, a <strong>120 pixel al secondo</strong>. Deve fermarsi quando rilasci i tasti e mantenere la stessa velocità in diagonale. Usa il corpo fisico già presente e fai eseguire il movimento al motore.</p>',
  initialNodes:player,
  initialCode:'extends Node2D\n\nfunc _physics_process(_delta):\n    pass\n',solution:controller,
  guidance:['Se nessun tasto è premuto, quale deve essere la velocità?','Leggi la direzione dalle azioni, trasformala in una velocità e poi chiedi al corpo di muoversi.']},
 {id:303,title:'Una parete che ferma il giocatore',
  theory:'<p>Un <code>StaticBody2D</code> rappresenta un ostacolo che il gioco non sposta tramite la fisica. Una CollisionShape2D figlia gli dà una forma; disegnare un muro con uno sprite, da solo, non crea una collisione.</p><p>Il livello di collisione (<em>layer</em>) indica dove si trova un oggetto, la maschera (<em>mask</em>) indica quali livelli rileva. Qui corpo e parete usano il livello 1 e si rilevano a vicenda.</p><p>Modificare direttamente <code>position</code> può attraversare gli ostacoli. Il movimento del CharacterBody2D deve passare da <code>move_and_slide()</code>. Il corpo deve potersi allontanare dalla parete quando cambia direzione: non bloccare permanentemente l’input dopo un contatto.</p>',
  task:'<p>Ripara il movimento: Player deve fermarsi contro la parete a destra e potersi muovere di nuovo verso sinistra. Mantieni velocità e comandi della lezione precedente. I nodi fisici e le forme sono già predisposti; correggi il modo in cui il codice muove Player.</p>',
  initialNodes:[...player,{name:'Wall',type:'StaticBody2D',position:{x:180,y:180}},{name:'WallShape',type:'CollisionShape2D',parent:'Wall',shape_size:{x:20,y:220}},{name:'WallGraphic',type:'ColorRect',parent:'Wall',position:{x:-10,y:-110},size:{x:20,y:220},color:'#64748b'}],
  initialCode:'extends Node2D\n\nfunc _physics_process(delta):\n    var direzione = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")\n    $Player.position += direzione * 120.0 * delta\n',solution:controller,
  guidance:['Il codice cambia la posizione, ma sta chiedendo alla fisica di controllare l’ostacolo?','Assegna la direzione trasformata in velocità al CharacterBody2D; lascia che sia move_and_slide() a calcolare lo spostamento.']},
 {id:304,title:'Il primo obiettivo: raccogli e vinci',isMastery:true,isConsolidation:true,
  theory:'<p>Un <code>Area2D</code> rileva sovrapposizioni senza comportarsi come una parete. Con una CollisionShape2D e il segnale <code>body_entered(body)</code> puoi sapere quando un corpo entra in una moneta o in una zona di arrivo.</p><p>Il segnale passa il corpo entrato come argomento: confrontalo con il giocatore, perché anche altri corpi potrebbero entrare. Collega l’evento una volta in <code>_ready()</code>. All’evento aggiorna lo stato, l’interfaccia e il mondo.</p><p><code>queue_free()</code> programma l’eliminazione del nodo alla fine del frame; elimina anche i suoi figli. Rimuovere l’Area della moneta rimuove sia il disegno sia la forma di rilevamento. Evita di modificare la scena direttamente in risposta a ogni fotogramma se ciò che ti interessa è un evento.</p><p>Questo piccolo gioco ha già input, un personaggio, un obiettivo e una condizione di vittoria. Esportalo, importa project.godot nell’editor e aggiungi un secondo obiettivo come esercizio autonomo.</p>',
  task:'<p>Player si muove già con le frecce. Quando entra nella moneta, aumenta <code>punti</code> da 0 a 1, mostra <code>Punti: 1</code> in PuntiLabel e <code>Hai vinto!</code> in StatoLabel, poi rimuovi Coin. Muoversi altrove non deve assegnare punti; passare di nuovo nella stessa posizione non deve contarla due volte.</p>',
  initialNodes:[...player,{name:'Coin',type:'Area2D',position:{x:140,y:180},collision_layer:2,collision_mask:1},{name:'CoinShape',type:'CollisionShape2D',parent:'Coin',shape_size:{x:24,y:24}},{name:'CoinGraphic',type:'ColorRect',parent:'Coin',position:{x:-12,y:-12},size:{x:24,y:24},color:'#fbbf24'},{name:'PuntiLabel',type:'Label',position:{x:24,y:20},text:'Punti: 0'},{name:'StatoLabel',type:'Label',position:{x:24,y:56},text:'Raccogli la moneta'}],
  initialCode:'extends Node2D\n\nvar punti = 0\n\nfunc _ready():\n    pass\n\nfunc _physics_process(_delta):\n'+move,
  solution:'extends Node2D\n\nvar punti = 0\n\nfunc _ready():\n    $Coin.body_entered.connect(raccogli)\n\nfunc _physics_process(_delta):\n'+move+'\nfunc raccogli(body):\n    if body == $Player:\n        punti += 1\n        $PuntiLabel.text = "Punti: " + str(punti)\n        $StatoLabel.text = "Hai vinto!"\n        $Coin.queue_free()\n',
  guidance:['La moneta deve reagire all’ingresso di un corpo, non al passare del tempo.','Collega body_entered a una funzione con un parametro. Controlla il corpo ricevuto, aggiorna punti e Label, quindi elimina l’Area.']}
 ];
 for(const lesson of entries){
  Object.assign(lesson,{chapterId:'gameplay',xp:lesson.isMastery?100:60,icon:'gamepad-2',practiceMode:'focused',hasNodeTree:true,has2DViewport:false,expectedOutput:''});
  lesson.hints=[...lesson.guidance.map((text,i)=>({level:i+1,type:i?'structure':'concept',label:i?'Organizza':'Ragiona',text})),{level:3,type:'example',label:'Confronta una soluzione',text:lesson.solution}];
 }
 const sceneNodes=lesson=>[{name:'Main',type:'Node2D',parent:null},...lesson.initialNodes.map(n=>({...n,parent:n.parent||'Main'}))];
 const near=(a,b,tolerance=4)=>typeof a==='number'&&Math.abs(a-b)<=tolerance;
 const pos=r=>r?.scene?.Player?.position||{};
 const verify=async(id,source,raw)=>{
  const lesson=entries.find(l=>l.id===id),checks=[],runs=[];
  const check=(desc,passed)=>checks.push({desc,passed:!!passed});
  const run=async(code,options)=>{const r=await raw(code,options);runs.push(r);return r.reply;};
  let start=await run(source,{mode:'sandbox_start',nodes:sceneNodes(lesson),inspect:['punti'],paused:true});
  const observe=(frames,input=[])=>run('',{mode:'sandbox_observe',frames,input});
  if(start.status==='executed'&&!runs[0].stderr?.trim()){
   if(id===301){const a=await observe(30),b=await observe(60);check('Mezzo secondo produce circa 60 pixel di spostamento',near(pos(a).x-pos(start).x,60));check('Il doppio del tempo produce il doppio dello spostamento',near(pos(b).x-pos(a).x,120));check('La coordinata verticale rimane invariata',near(pos(a).y,180,0.1)&&near(pos(b).y,180,0.1));}
   if(id===302){const idle=await observe(12),right=await observe(30,['ui_right']),up=await observe(30,['ui_up']),diagonal=await observe(30,['ui_right','ui_up']),stop=await observe(12);check('Senza input il personaggio resta fermo',near(pos(idle).x,60,0.1)&&near(pos(idle).y,180,0.1));check('Destra muove lungo X a 120 pixel/s',near(pos(right).x-pos(idle).x,60)&&near(pos(right).y,pos(idle).y,0.1));check('Su diminuisce Y a 120 pixel/s',near(pos(up).y-pos(right).y,-60)&&near(pos(up).x,pos(right).x,0.1));check('La diagonale mantiene la velocità',near(Math.hypot(pos(diagonal).x-pos(up).x,pos(diagonal).y-pos(up).y),60));check('Rilasciare i tasti ferma il corpo',near(pos(stop).x,pos(diagonal).x,0.1)&&near(pos(stop).y,pos(diagonal).y,0.1));}
   if(id===303){const wall=await observe(90,['ui_right']),back=await observe(30,['ui_left']);check('La parete impedisce di attraversarla',pos(wall).x>=155&&pos(wall).x<=160.1);check('Il corpo può allontanarsi dalla parete',near(pos(back).x-pos(wall).x,-60));}
   if(id===304){const idle=await observe(12),away=await observe(12,['ui_left']),collected=await observe(70,['ui_right']),again=await observe(30,['ui_left']);check('Nessun premio all’avvio o lontano dalla moneta',start.properties?.punti===0&&idle.properties?.punti===0&&away.properties?.punti===0&&away.scene?.Coin?.exists);check('L’ingresso nell’Area assegna un punto',collected.properties?.punti===1);check('HUD e vittoria riflettono lo stato',collected.scene?.PuntiLabel?.text==='Punti: 1'&&collected.scene?.StatoLabel?.text==='Hai vinto!');check('La moneta viene rimossa e non si conta due volte',collected.scene?.Coin?.exists===false&&again.properties?.punti===1);}
  }
  const error=runs.map(r=>r.stderr||'').filter(s=>s.trim()).join('\n');
  const valid=runs.every(r=>r.status==='executed')&&!error;
  checks.unshift({desc:'Scena eseguita senza errori nel motore Godot',passed:valid});
  const accepted=valid&&checks.length>1&&checks.every(c=>c.passed);
  const feedback={verdict:accepted?'accepted':valid?'requirements_not_met':'invalid_code',passed:accepted,checks,reason:error||null};
  return {accepted,feedback,original:runs[0],execution:{success:valid,code:source,logs:[],error:error||(!valid?'La scena non è stata eseguita.':null),nativeStatus:start.status,nativeFeedback:feedback}};
 };
 window.GDHGameplayLessons=Object.freeze({entries,sceneNodes,has:id=>entries.some(l=>l.id===id),verify});
})();
