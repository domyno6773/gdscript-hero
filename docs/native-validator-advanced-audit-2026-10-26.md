# GDScript Hero — Audit avanzato Godot: funzioni, classi, scene e correzioni didattiche

**Data:** 26 ottobre 2026  
**Branch:** `spike/godot-native-proof-20261026`. `main` e GitHub Pages **non modificati**.

## Cosa è stato implementato

### Funzioni native (lezioni 31–32)
- Il controllo di `calcola_danno` accetta un'implementazione tipizzata e una formula matematicamente equivalente `attacco + (-difesa)`, anziché pretendere la stessa riga `return attacco - difesa`.
- Il controllo del critico accetta un'espressione condizionale `attacco * (2 if critico else 1)` oltre ai due return con `if`.
- I metodi vengono chiamati dal vero Godot con **otto combinazioni** ciascuno: valori usuali, zero, negativi e casi del valore 30 non coincidenti con la consegna.
- Sono stati aggiunti esempi scorretti che funzionano sul caso originale ma sbagliano con parametri diversi.

### Classi reali e oggetti (45, 47, 48)
- Costruttori `_init` con annotazioni `String` e `int` accettati in 45 e 48.
- `colpo_caricato` nella lezione 47 non deve essere scritto identicamente a `self.attacco * 2`: per esempio è permessa la somma `self.attacco + self.attacco`, **verificata dal motore**.
- Quattro test nativi sul metodo di classe: attacco 7, 31, 0 e -3. Un metodo che produce zero per attacchi negativi viene respinto.
- Le istanze reali restano osservate con campi script `nome`, `attacco`, `vita`, ecc.; non è stata eliminata tutta la strumentazione sulle classi.

### Scene e pulsanti native (55 e 60)
- Gli scenari con **due clic**, **cinque clic** e **fondi insufficienti** sono validi soltanto se la risposta è `executed` **e** Godot non riporta errori.
- Lo scenario di fondi insufficienti riconosce anche la dichiarazione `var monete: int = 100`, senza saltare il test dinamico.
- Controesempi con `push_error()` emesso soltanto al secondo clic o quando terminano i soldi vengono respinti anche se il testo delle Label e l'output appaiono corretti.

### Quattro discrepanze delle lezioni corrette nel branch sperimentale
- **4**: l'output atteso è `Energia: 100%`, coerente con Godot e con `print("Energia: ", 100, "%")`. Aggiornata la spiegazione che diceva erroneamente che Godot inserisce spazi tra gli argomenti.
- **6**: lo starter ora usa `personaggio`, `punti_vita` e un errore di virgolette relativo a `Guerriero`, non una variabile estranea `nome_giocatore`.
- **39**: lo starter permette di correggere i controlli delle chiavi `oro` e `chiave` tramite `.has()`; suggerimenti e output sono allineati alla consegna.
- **58**: i suggerimenti insegnano `ColorRect`, `color` e `size` anziché `Timer`. Il risultato atteso dell'esportazione **Godot 4.4.1** riflette la stampa dei componenti di `Color`, `(0.1333, 0.7725, 0.3686, 1.0)`, confermata nel runner. Il validatore JavaScript preesistente accetta sia questo output sia il precedente formato esadecimale per compatibilità.

`lesson-fixtures.js` è sincronizzato con il corso sperimentale. `fixture_parity.cjs` confronta 60/60 starter, soluzioni, output attesi e titoli, e ora include controlli dedicati per queste quattro correzioni.

## Prova automatica

I workflow continuano a eseguire in CI Google Chrome con l'export vero Godot 4.4.1 WebAssembly, i test per tutti i 60 esercizi, gli errori del motore, l'isolamento, i casi comportamentali e l'integrazione senza XP.

- [Godot avanzato, funzioni e classi](https://github.com/domyno6773/gdscript-hero/actions/runs/40313064363)
- [Godot avanzato, scene e pulsanti](https://github.com/domyno6773/gdscript-hero/actions/runs/40313321243)
- [Verifica aggiornata anche dei contenuti didattici](https://github.com/domyno6773/gdscript-hero/actions/runs/40313850335)

## Limiti e prossimi gate

- I validatori combinano chiamate Godot autentiche, controlli sulle scene e talvolta regex; **non** sono un parser/data-flow analyzer generale e possono ancora produrre falsi positivi o negativi su codice arbitrario.
- Un numero finito di probe non dimostra matematicamente la correttezza di ogni algoritmo.
- In diversi esercizi 33–48 la cattura delle variabili locali dipende ancora da una copia strumentata; i programmi non osservabili restano `inconclusive`.
- Le 12 lezioni di scena hanno ancora una copertura limitata di implementazioni davvero differenti, soprattutto 49–54, 57–59.
- Questa è una **suite sperimentale**: la verifica ufficiale del sito usa ancora il vecchio runtime JS. Non trasferire al cloud gli esiti locali come XP o progressi certificati. Servono un contratto stabile di risultati, un controllo dei dispositivi reali e un piano reversibile di migrazione.
- Il formato testuale di `Color` può cambiare tra versioni di Godot: il grading nativo deve continuare a verificare anzitutto la **proprietà Color reale** del nodo anziché dipendere dall'output letterale.

## Sintesi

Sono state rafforzate le lezioni più avanzate senza cambiare il sito pubblico: meglio valutare comportamenti nativi differenti ed errori successivi, non l'esatta stringa del sorgente. Il prossimo passaggio per **chiudere la fase validator** è un audit finale per le restanti scene e il contratto esplicito `accepted / requirements_not_met / invalid_code / inconclusive / timeout`, prima dell'integrazione ufficiale.
