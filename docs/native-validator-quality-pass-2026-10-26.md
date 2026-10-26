# GDScript Hero — Primo passaggio di qualità sui validatori Godot

**Data:** 26 ottobre 2026  
**Branch:** `spike/godot-native-proof-20261026` (nessuna modifica a `main` o al sito pubblico)

## Evidenza automatica

GitHub Actions (Godot 4.4.1 WebAssembly, Chrome):
https://github.com/domyno6773/gdscript-hero/actions/runs/40307361097

**Confermato dai log di esecuzione:**
- 60/60 soluzioni ufficiali riconosciute e accettate.
- 59/59 casi negativi precedenti respinti.
- 48/48 alternative già presenti nella suite accettate.
- **7 nuove soluzioni corrette e sintatticamente diverse riconosciute**, oltre alle 48 già testate.
- **1 nuovo caso negativo**: un programma stampa l'output corretto, poi chiama `push_error("GDH_EXPECTED_RUNTIME_ERROR")`. Il motore emette l'errore, e il validatore respinge la risposta.
- Regressioni di isolamento, recupero dal blocco, editor integrato senza XP o salvataggi e prove delle scene native superate.

Totale nei test disponibili dopo l'aggiunta: 60 soluzioni ufficiali, **55 prove di alternative** (alcune cambiano solo formattazione) e **60 casi negativi** (incluso il nuovo errore del motore). Questi sono insiemi di test finiti, non garanzie per tutti i possibili programmi GDScript.

## Problemi risolti

| Lezione | Prima | Ora |
|---|---|---|
| 13 — Somma e prodotto | `var somma: int = 10 + 5` non riconosciuta dal controllo sintattico | Accetta dichiarazioni numeriche con tipizzazione esplicita |
| 17 — Livello | `if (livello >= 10):` poteva essere respinto | Accetta parentesi attorno alla condizione, verificando sempre il caso livello = 9 |
| 25 — Range | `range( 3 )` non generava lo scenario alternativo di prova | La mutazione individua il `for i in range(...)` e genera `range(4)` senza sostituire altre stringhe contenenti `range(3)` |
| 26 e 28 — Array di nemici | `var nemici: Array[String] = [...]` non veniva modificato negli scenari | Il trasformatore riconosce dichiarazioni tipizzate di array |
| 27 — While | `while conto < 4:` respinto anche se ha la stessa logica della soluzione | Accetta sia `< 4` sia `<= 3`, verificando l'output con un valore iniziale differente |
| 34 — Velocità | `var velocita := 50` non veniva modificato dallo scenario | Supporta l'inferenza di tipo con `:=` nella semplice dichiarazione iniziale |
| Tutte le lezioni | Un output corretto seguito da un errore Godot poteva essere promosso | Se Godot segnala diagnostici nello stream d'errore, il feedback locale è negativo |

## Che cosa NON abbiamo risolto

- I controlli continuano a usare espressioni regolari per determinati requisiti sintattici; un programma corretto scritto in modo sufficientemente diverso potrebbe ancora risultare respinto.
- Gli scenari di prova modificano inizializzazioni semplici tramite analisi testuale, non tramite un parser GDScript completo. Variabili definite in altri modi o scope complessi potrebbero non essere riconosciuti.
- La cattura delle variabili locali di `_ready()` dipende ancora da una copia strumentata. Una strumentazione che produce diagnostici propri può confondersi con errori del codice dello studente: questa distinzione andrà affrontata prima della produzione.
- Lo stream d'errore è utilizzato conservativamente: anche `push_error` deliberati fanno fallire l'esercizio. Non tutte le lezioni future dovranno necessariamente adottare questa regola.
- La valutazione locale rimane falsificabile dal browser. **Non usare gli esiti del runner come attestazione per XP, completamenti cloud o abbonamenti.**
- Non sono stati testati Safari/iOS, Android reali o tutte le soluzioni alternative possibili.

## Modifiche testate

- `spikes/godot-web/host/lesson-validation.js`: validazione più tollerante per forme GDScript equivalenti, miglioramento degli scenari e controllo errori del motore.
- `spikes/godot-web/host/lesson-validation-native-scenes.js`: controllo dello stream di diagnostica Godot per le lezioni 49–60.
- `spikes/godot-web/tests/native_lessons_1_12.cjs`: test errore del motore *dopo* una stampa corretta.
- `spikes/godot-web/tests/native_lessons_13_24.cjs`: due nuove alternative reali.
- `spikes/godot-web/tests/native_lessons_25_36.cjs`: cinque nuove alternative reali.

## Prossimo passo tecnico

Continuare su una serie di falsi negativi osservabili, adottando test di comportamento e risultati nativi anziché ampliare indiscriminatamente le regex. Separare nettamente l'errore di compilazione dell'utente dall'errore introdotto dalla strumentazione. Solo dopo la stabilizzazione collegare i nuovi validatori al percorso di verifica ufficiale.

**Nessun merge o deploy pubblico approvato.**
