'use strict';
/* Final skills assessment: does not replace tested lessons or grant XP.
 * Creates a NEW Sandbox project on explicit click, never overwrites drafts.
 */
(() => {
 const root=window;
 const final=root.LESSONS_DATA?.find(l=>l.id===48);
 if(!final)throw Error('Final lesson 48 is missing');
 const nodes=[
  {name:'Main',type:'Node2D',parent:null},
  {name:'Player',type:'CharacterBody2D',parent:'Main',position:{x:60,y:180}},
  {name:'PlayerSprite',type:'Sprite2D',parent:'Player'},
  {name:'PlayerShape',type:'CollisionShape2D',parent:'Player',shape_size:{x:20,y:20}},
  {name:'Coin',type:'Area2D',parent:'Main',position:{x:140,y:180},collision_layer:2,collision_mask:1},
  {name:'CoinShape',type:'CollisionShape2D',parent:'Coin',shape_size:{x:24,y:24}},
  {name:'CoinGraphic',type:'ColorRect',parent:'Coin',position:{x:-12,y:-12},size:{x:24,y:24},color:'#fbbf24'},
  {name:'PuntiLabel',type:'Label',parent:'Main',position:{x:24,y:20},text:'Tesori: 0'},
  {name:'StatoLabel',type:'Label',parent:'Main',position:{x:24,y:55},text:'Trova il tesoro!'},
  {name:'AttaccaBtn',type:'Button',parent:'Main',position:{x:24,y:100},size:{x:170,y:40},text:'Colpisci bersaglio'}
 ];
 const code=`extends Node2D

# PROGETTO FINALE: completa i TODO senza cambiare i nomi dei nodi.
signal tesoro_raccolto(totale)

class Zaino:
    var oggetti: Array[String] = []

    func aggiungi(nome: String) -> void:
        # TODO A: conserva il nome ricevuto nell'Array di questa istanza.
        pass

var zaino = Zaino.new()
var boss = {"hp": 30, "attacco": 5}
var monete: int = 0

func _ready() -> void:
    # TODO B: collega Coin, AttaccaBtn e tesoro_raccolto alle rispettive funzioni.
    _aggiorna_hud(monete)

func _physics_process(_delta: float) -> void:
    # TODO C: leggi le quattro frecce e muovi il corpo a 120 pixel al secondo.
    pass

func _raccogli(body: Node2D) -> void:
    if body != $Player:
        return
    # TODO 1: aggiungi "Moneta" allo zaino e aumenta monete.
    # TODO 2: emetti tesoro_raccolto con il nuovo numero.
    # TODO 3: rimuovi Coin con queue_free.
    pass

func _colpisci_bersaglio() -> void:
    # TODO 4: riduci boss["hp"] di 10 senza scendere sotto zero.
    # TODO 5: chiama _aggiorna_stato() dopo aver modificato gli HP.
    pass

func _aggiorna_hud(totale: int) -> void:
    $PuntiLabel.text = "Tesori: " + str(totale)
    _aggiorna_stato()

func _aggiorna_stato() -> void:
    if monete > 0 and boss["hp"] == 0:
        $StatoLabel.text = "Vittoria!"
    else:
        $StatoLabel.text = "Tesori: " + str(monete) + " | Boss HP: " + str(boss["hp"])
`;
 const content='<section class="course-capstone" aria-label="Progetto finale">'+
  '<h3>Verifica finale: laboratorio 2D di raccolta e stato</h3>'+
  '<p>Dimostra di saper unire movimento, inventario, classi, segnali, condizioni e interfaccia. La scena e le firme delle funzioni sono predisposte; completa la logica. '+
  'Il bersaglio è rappresentato dai dati boss, senza un nemico animato. Questo è un prototipo didattico. Le lezioni completate e il progetto finale verificato sono due risultati distinti: i progressi precedenti restano validi e questa prova non assegna XP.</p>'+
  '<ol><li>Premi Avvia progetto per creare una <strong>nuova copia</strong> nella Sandbox; i tuoi progetti precedenti restano intatti.</li>'+
  '<li>Completa Zaino.aggiungi: ogni istanza conserva i propri oggetti. In _ready collega body_entered di Coin a _raccogli, pressed di AttaccaBtn a _colpisci_bersaglio e tesoro_raccolto a _aggiorna_hud.</li>'+
  '<li>Completa _physics_process con le quattro frecce, velocità 120 pixel al secondo e il movimento del CharacterBody2D.</li>'+
  '<li>Completa _raccogli: usa lo zaino, aumenta monete, emetti il segnale e rimuovi Coin.</li>'+
  '<li>Completa _colpisci_bersaglio: sottrai 10 da boss["hp"], senza scendere sotto zero, poi aggiorna lo stato.</li>'+
  '<li>Controlla il risultato: una raccolta mostra Tesori: 1; ogni pressione riduce gli HP da 30 a 20, 10 e 0. Con il tesoro raccolto e il boss a zero deve apparire Vittoria!, in qualsiasi ordine tu svolga le due azioni.</li>'+
  '<li>Prova la scena con Esegui. Poi premi <strong>Verifica il progetto finale</strong>: il motore proverà movimento, contatto reale, inventario e vittoria anche spostando il tesoro. Correggi gli eventuali errori e riprova. Puoi esportare il prototipo per ampliarlo.</li></ol>'+
  '<button type="button" id="gdh-start-final-project" class="btn-primary">Crea il progetto finale nella Sandbox</button>'+
  '</section>';
 final.theory+=content;
 const make=()=>{
  const app=root.App;
  if(!app?.createSandboxProject||!app?.getActiveSandboxProject)return;
  // A new named project is created before writing code; no pre-existing data is touched.
  app.switchView('view-practice');
  app.createSandboxProject('Gioco finale - Avventura 2D');
  const project=app.getActiveSandboxProject();
  project.code=code;
  project.nodes=JSON.parse(JSON.stringify(nodes));
  project.capstoneVersion=2;
  project.updatedAt=new Date().toISOString();
  app.saveStorage();
  app.loadActiveSandboxProject();
 };
 document.addEventListener('click',e=>{
  if(e.target?.closest?.('#gdh-start-final-project'))make();
 });
 root.GDHCourseCapstone=Object.freeze({nodes,starter:code,create:make});
})();
