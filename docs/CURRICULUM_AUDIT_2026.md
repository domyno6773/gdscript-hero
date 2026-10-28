# Revisione didattica — GDScript Hero (ottobre 2026)

## Scopo e metodo

Audit delle **60 lezioni originali** (3 esercizi guidati e una vecchia sfida stellata per ogni capitolo), condotto leggendo `lessons.js`, i fixture e i validatori nativi, i prerequisiti della progressione e il runner Godot 4.4.1 WebAssembly. Il nuovo percorso inizia con **21 esercizi aggiuntivi** in tutti i capitoli, per un totale di **81**. Tutte le 15 sfide stellate restano presenti come **consolidamenti obbligatori** e sono proposte dopo gli approfondimenti. Nessun progetto di laboratorio è fittiziamente dichiarato disponibile.

**Nota fondamentale:** 81 esercizi **non** equivalgono a un corso completo dell'engine Godot. Oggi il corso copre soprattutto GDScript; competenze di sviluppo 2D e 3D richiedono moduli e strumenti ulteriori, come accade nel percorso ufficiale Godot "Step by step" e "Your first 2D game": https://docs.godotengine.org/en/stable/getting_started/step_by_step/index.html e https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html.

## Audit dei capitoli originali

| Capitolo | Lezioni originali e cosa fanno | Lacuna didattica osservata | Approfondimento introdotto | Nuovo totale |
|---|---|---|---|---|
| 1 — Sintassi | 1 stampa, 2 commenti, 3 output numerico, 4 console di diagnostica | Struttura script, `extends`, ordine dei comandi | Sequenza di esecuzione | 5 |
| 2 — Variabili e testi | 5 `var`, 6 `String/int`, 7 concatenazione, 8 apici/escape | Conversione `int`→`String` usata nei messaggi | `str()` e report crediti | 5 |
| 3 — Tipizzazione | 9 `float/bool`, 10 annotazioni, 11 `const`, 12 scheda tipizzata | Inferenza `:=` mostrata quasi soltanto nella verifica | Dichiarazioni con `:=` | 5 |
| 4 — Operatori | 13 somme e prodotti, 14 assegnazioni rapide, 15 bottino, 16 divisione/modulo | Formule composte con precedenza esplicita | Prezzo e tassa | 5 |
| 5 — Condizioni | 17 confronti, 18 `and`, 19 `if/else`, 20 portale con `elif` | `elif` e `not` poco allenati; più rami decisionali | Classificazione ranghi; negazione logica | 6 |
| 6 — Array | 21 creazione, 22 indici, 23 `append/size`, 24 `erase/has` | Ricerca e rimozione condizionale; array tipizzati | Ricerca/rimozione e `Array[int]` | 6 |
| 7 — Cicli | 25 `range`, 26 ciclo su array, 27 `while`, 28 somma XP | Uscite anticipate e salti selettivi | `break` e `continue` | 6 |
| 8 — Funzioni | 29 `_ready`, 30 parametri, 31 `return`, 32 danno critico | Default dei parametri, scope e funzioni riutilizzabili | Parametri opzionali; variabili locali | 6 |
| 9 — Vector2 | 33 creazione, 34 aggiornamento x, 35 diagonale, 36 arrivo alla stazione | Distanza reale e normalizzazione | `distance_to()`, `normalized()` | 6 |
| 10 — Dizionari | 37 definizione, 38 modifica, 39 `has`, 40 boss | Accesso sicuro alle chiavi mancanti | `get()` con valore di fallback | 5 |
| 11 — Segnali | 41 dichiarazione, 42 connessione, 43 parametri, 44 eventi battaglia | Collegare segnale/azione in un contesto riutilizzabile | Allarme con callback | 5 |
| 12 — OOP | 45 classe e `_init`, 46 istanze, 47 metodi, 48 party | Metodi con contratti tipizzati e indipendenza dello stato | Metodo tipizzato; istanze separate | 6 |
| 13 — Scene Tree | 49 nodo, 50 Label, 51 `$`, 52 HUD testuale | Creazione dinamica e proprietà dei figli | `Node.new()` + `add_child()` | 5 |
| 14 — Button/UI | 53 testo Button, 54 `pressed`, 55 clicker, 56 due pulsanti | Creazione e connessione programmatica dei controlli | Pulsante nativo creato a runtime | 5 |
| 15 — Timer/ciclo di vita | 57 Timer, 58 ColorRect, 59 `queue_free`, 60 negozio | Ruolo di `delta` nel movimento e differenza tra frame/secondi | Simulazione di aggiornamenti con `delta` | 5 |

## Criteri per ogni nuovo esercizio

1. Introduce un concetto realmente mancante o poco esercitato; non replica l'esercizio precedente con numeri diversi.
2. Comprende una spiegazione breve, una consegna contestualizzata, codice iniziale, soluzione ufficiale e tre suggerimenti.
3. Viene eseguito tramite **Godot reale**, con verifica dell'output e dei costrutti richiesti: non usa un interprete GDScript JavaScript.
4. Deve rifiutare starter incompleti e accettare la soluzione ufficiale; i test del curriculum nativo fanno entrambe le prove.
5. Il consolidamento è parte del percorso lineare e sblocca il capitolo seguente. Gli ID storici delle 60 lezioni restano stabili; gli ID 61–63 restano riservati ai fixture nativi dei ripassi, le nuove lezioni usano 101+.

## Gap del corso oltre i 15 capitoli (da progettare, NON dichiarati implementati)

La formazione **Godot Engine** richiede, oltre alla sintassi:

- **Editor e scene**: progetto, file system, `.tscn`, Inspector, proprietà esportate, scene annidate, istanziazione PackedScene, ownership e salvataggio.
- **Input e ciclo di gioco**: Input Map, `Input`, `_input`, `_process(delta)` e `_physics_process(delta)`, pause.
- **2D reale**: `Node2D`, `CharacterBody2D`, `move_and_slide()`, collisioni, layer/mask, `Area2D`, `CollisionShape2D`, `TileMapLayer`.
- **Grafica e contenuti**: `Sprite2D`, Texture, AnimationPlayer/AnimatedSprite2D, Tween, CanvasItem, Camera2D, importazione asset.
- **UI**: contenitori Control, anchors, layout responsivi, temi, tastiera/gamepad.
- **Architettura di gioco**: risorse personalizzate, Autoload, gruppi, scene riutilizzabili, gestione eventi, stati.
- **Persistenza e distribuzione**: FileAccess/JSON, impostazioni, debugging e profiler, export e packaging.
- **Audio e 3D**: AudioStreamPlayer, mixer; `Node3D`, Mesh, materiali, luci, camere e fisica 3D come percorso successivo.

Per questi temi non basta aggiungere `print()`: occorre ampliare i fixture e l'esecuzione Godot, creare vere scene modificabili e introdurre Laboratori guidati con stato persistente tra fasi.

## Regola per Laboratori futuri

Quando saranno pronti, aggiungere un **Laboratorio gratuito per capitolo** con fasi progressive, verifiche per scenari, checkpoint e risultato concreto. Differenziarlo dal consolidamento (singolo problema, niente progetto multi-step). Non includerlo ancora nel conteggio dei contenuti disponibili.

## Limitazioni della prima espansione

I 21 nuovi esercizi usano esecuzione reale e verifiche mirate su output e costrutti sintattici. Alcune verifiche sono ancora legate a pattern di codice: prima di considerarli perfettamente valutati sono necessari test aggiuntivi su soluzioni alternative, casi limite e comportamenti dinamici. Le 60 lezioni storiche conservano i validatori più articolati. La lezione su `delta` usa una **simulazione di chiamate**: non pretende di insegnare già il ciclo `_process` reale.
