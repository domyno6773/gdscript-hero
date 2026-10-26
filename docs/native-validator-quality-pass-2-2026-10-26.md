# GDScript Hero — Secondo passaggio sui validatori Godot

**Data:** 26 ottobre 2026  
**Branch:** `spike/godot-native-proof-20261026`. Nessuna modifica a `main` o al sito pubblico.

## Risultato confermato

[Esecuzione completa Godot 4.4.1 WebAssembly / Chrome](https://github.com/domyno6773/gdscript-hero/actions/runs/40311872542)

- **60/60** soluzioni ufficiali accettate dal vero motore Godot Web.
- **59/59** bypass già noti respinti.
- **48/48** alternative precedenti accettate.
- **7/7** varianti GDScript idiomatiche precedentemente aggiunte accettate.
- **5/5** nuove soluzioni semanticamente differenti accettate: esercizi 17, 19, 20, 27 e 28.
- **6/6** nuovi bypass ai valori limite respinti: esercizi 17, 19, 20, 26, 27 e 28.
- **1** ulteriore bypass con `var nome` e `print(nome)` in un ramo morto, ma output vero stampato come stringa costante, respinto.

La suite continua a validare sandbox, riavvio dopo blocco, scene native e collegamento sperimentale all'editor senza modificare XP o salvataggi. Queste quantità descrivono un campione finito di input: non certificano la correttezza di GDScript arbitrario.

## Riduzione della strumentazione

In `lesson-validation.js`, la funzione `captureNames(id, source)` evita ora l'inserimento di codice in una copia di `_ready()` **per 11 esercizi quando la soluzione segue una forma di cui sappiamo verificare sorgente e comportamento**:

**5, 6, 9, 13, 17, 18, 19, 20, 26, 27, 28.**

Per le lezioni condizionali e i cicli la decisione non si basa soltanto su una regex: il sistema esegue anche il codice originale e più **scenari di comportamento nativi**, con dati di input differenti. I programmi non riconosciuti dal contratto ristretto conservano la cattura opzionale e possono ricevere `inconclusive` anziché una bocciatura ingiusta.

I controlli diretti analizzano la funzione `_ready()` e non accettano un numero di chiamate `print()` diverso da quello previsto, per ridurre la possibilità di nascondere un `print(var)` in codice non eseguito e stampare una costante altrove. **Questo filtro non è una prova formale di data-flow o raggiungibilità.**

Le esecuzioni di **scenari modificati** non richiedono più l'iniezione per catturare le variabili locali: si giudica lo stato nativo, l'output e l'assenza di errori.

## Matrice dei valori limite aggiunta

| Lezione | Nuovi scenari | Errore deliberato rilevato |
|---|---|---|
| 17 — Livello | Livello 9, 10 e **11** | Concedere accesso soltanto con `livello == 10` |
| 19 — Game Over | Punti vita 0, 100 e **-5** | Trattare solo lo zero, non la salute negativa, come Game Over |
| 20 — Portale | Energia 75, 20 e **50**; con e senza reliquie | Usare una condizione effettiva `> 50` invece di `>= 50` |
| 26 — Nemici | Array di 3, 2 e **0** nemici | Stampare un nome fittizio quando l'elenco è vuoto |
| 27 — While | Conto iniziale 1, 2 e **0** | Saltare impropriamente il valore 0 |
| 28 — XP | Lista di 4, 2 e **1** nemici | Attribuire 50 XP all'unico nemico anziché 25 |

Sono state accettate inoltre forme realmente differenti di controllo: `> 9` invece di `>= 10`, `< 1` invece di `<= 0`, variabili tipizzate e formattazione di stringhe tramite `%d` e `%s`.

## Consistenza del corso: nuova barriera automatica

È stato aggiunto `spikes/godot-web/tests/fixture_parity.cjs`, che confronta in CI **tutte le 60 lezioni** del file `lessons.js` con gli snapshot del laboratorio `lesson-fixtures.js`. Verifica ID, titolo, starter, soluzione ufficiale e output atteso.

Il workflow Godot adesso si attiva anche se cambia `lessons.js`, per intercettare eventuali divergenze tra il corso pubblico e i test sperimentali. Questa verifica **non corregge** le anomalie note nelle istruzioni didattiche (lezioni 4, 6, 39 e 58).

## Limiti rimasti per concludere la fase

1. Fare una revisione mirata **delle lezioni che richiedono ancora iniezione** (collezioni, oggetti, classi e metodi) e distinguere i requisiti verificabili con API native da quelli che richiedono ispezione.
2. Ampliare i controesempi delle lezioni 29–60, soprattutto metodi con input diversi, segnali, timer e scene; le varianti attuali 49–60 cambiano in buona parte solo la formattazione.
3. Risolvere e testare in modo coerente le discrepanze dei materiali 4, 6, 39 e 58, senza mutare silenziosamente il contenuto del corso.
4. Definire il contratto finale del feedback `accepted`, `requirements_not_met`, `invalid_code`, `inconclusive`, timeout e relativo motivo; poi superare una regressione completa.

**Questa fase non equivale al rilascio pubblico**: accesso Premium, XP verificati lato server, hosting e compatibilità dispositivi sono percorsi successivi. Per ora il motore resta dimostrativo e i risultati del client non sono prove sicure contro manipolazioni.
