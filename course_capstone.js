'use strict';
/* Optional final project: does not replace tested lessons or grant XP.
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
  {name:'UsaPozione',type:'Button',parent:'Main',position:{x:24,y:100},size:{x:150,y:40},text:'Usa pozione'}
 ];
 const code=`extends Node2D

# PROGETTO FINALE: completa i TODO senza cambiare i nomi dei nodi.
signal tesoro_raccolto(totale)

class Zaino:
    var oggetti: Array[String] = []

    func aggiungi(nome: String) -> void:
        oggetti.append(nome)

var zaino = Zaino.new()
var boss = {"hp": 30, "attacco": 5}
var monete: int = 0

func _ready() -> void:
    $Coin.body_entered.connect(_raccogli)
    $UsaPozione.pressed.connect(_usa_pozione)
    tesoro_raccolto.connect(_aggiorna_hud)
    _aggiorna_hud(monete)

func _physics_process(_delta: float) -> void:
    $Player.velocity = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down") * 120.0
    $Player.move_and_slide()

func _raccogli(body: Node2D) -> void:
    if body != $Player:
        return
    # TODO 1: aggiungi "Moneta" allo zaino e aumenta monete.
    # TODO 2: emetti tesoro_raccolto con il nuovo numero.
    # TODO 3: rimuovi Coin con queue_free.
    pass

func _usa_pozione() -> void:
    # TODO 4: riduci boss["hp"] di 10 senza scendere sotto zero.
    # TODO 5: aggiorna StatoLabel usando il valore effettivo di boss["hp"].
    pass

func _aggiorna_hud(totale: int) -> void:
    $PuntiLabel.text = "Tesori: " + str(totale)
`;
 const content='<section class="course-capstone" aria-label="Progetto finale">'+
  '<h3>Progetto finale facoltativo: un piccolo gioco completo</h3>'+
  '<p>Ora puoi applicare i concetti dei 16 capitoli in una scena 2D vera: movimento, moneta, inventario, segnali, UI e dati di un nemico. '+
  'Non e un quiz aggiuntivo e non modifica i progressi del corso.</p>'+
  '<ol><li>Premi Avvia progetto per creare una <strong>nuova copia</strong> nella Sandbox; i tuoi progetti precedenti restano intatti.</li>'+
  '<li>Completa i TODO nella funzione _raccogli: usa Zaino.aggiungi, aumenta monete, emetti tesoro_raccolto e rimuovi Coin.</li>'+
  '<li>Completa _usa_pozione: aggiorna il Dictionary boss e il testo StatoLabel.</li>'+
  '<li>Premi Esegui in Sandbox, raccogli la moneta con le frecce e prova il pulsante. Esporta il progetto Godot se vuoi ampliarlo.</li></ol>'+
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
  project.updatedAt=new Date().toISOString();
  app.saveStorage();
  app.loadActiveSandboxProject();
 };
 document.addEventListener('click',e=>{
  if(e.target?.closest?.('#gdh-start-final-project'))make();
 });
 root.GDHCourseCapstone=Object.freeze({nodes,starter:code,create:make});
})();
