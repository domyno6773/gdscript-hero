# GDScript Hero — Godot WebAssembly: validatori delle lezioni 13–24

Data: 26 ottobre 2026. Branch sperimentale: spike/godot-native-proof-20261026.

## Esiti riprodotti

Workflow GitHub Actions verificato: https://github.com/domyno6773/gdscript-hero/actions/runs/40260935126

Risultati cumulativi delle lezioni 1–24:
- 24/24 soluzioni ufficiali eseguite e accettate dal vero Godot 4.4.1 WebAssembly.
- 23/23 soluzioni volutamente non conformi respinte (11 nelle lezioni 1–12 e 12 nelle 13–24).
- 14/14 varianti corrette approvate (6 nelle lezioni 1–12 e 8 nelle 13–24).
- I test di isolamento e di recupero da un ciclo infinito continuano a riuscire con Chrome CI.

## Che cosa verifica il prototipo

13–16: somma, moltiplicazione, decremento composto, calcolo delle monete e divisione intera Godot (100 / 3 restituisce 33).

17–20: più esecuzioni native, ciascuna con valori iniziali temporaneamente modificati: livello 9; chiave assente; porta aperta; punti vita 100; energia insufficiente; nessuna reliquia; chiave alternativa. Il testo nell'editor resta quello originale.

21–24: ordine e contenuto degli Array, indici dinamici, uso dei metodi append, erase, has e size sull'array richiesto.

Le variabili locali vengono osservate inserendo una chiamata di diagnostica in una copia temporanea della funzione _ready, dopo aver compilato il sorgente originale. Non sono modificati il testo mostrato allo studente né il file pubblico lessons.js.

## Limiti e problemi aperti

- La cattura dei valori locali non è un parser GDScript completo e può fallire con blocchi, callback o return complessi.
- Il controllo sintattico ancora basato su espressioni regolari potrebbe respingere altre soluzioni equivalenti non coperte dai test.
- Le varianti di scenario trasformano soltanto inizializzazioni semplici: non certificano ogni algoritmo possibile.
- Il risultato del runner è manipolabile dall'utente: NON è attendibile per assegnare XP, avanzamenti server, accessi Premium o risultati persistenti.
- Non sono stati provati Android/iOS reali o Safari.
- Le incongruenze didattiche delle lezioni 4 e 6 restano nel dataset pubblico e sono segnalate soltanto nel laboratorio.

## Codice

Laboratorio: spikes/godot-web/host/lesson-lab.html
Validatori: spikes/godot-web/host/lesson-validation.js
Casi: spikes/godot-web/tests/native_lessons_13_24.cjs
Workflow: .github/workflows/godot-web-wasm.yml

Stato: prova funzionante e riproducibile per le prime 24 lezioni. Non pronta per produzione. Nessuna modifica a main.
