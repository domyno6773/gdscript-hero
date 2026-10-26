# GDScript Hero — Separazione dei diagnostici Godot e della strumentazione

**26 ottobre 2026**  
**Branch:** `spike/godot-native-proof-20261026`; nessun merge su `main`.

## Obiettivo

Il laboratorio strumentava una copia del GDScript dello studente per leggere variabili locali di `_ready()`. Un programma originale valido poteva generare un **errore di compilazione soltanto nella copia modificata**: per esempio un nome dichiarato dentro un `if` non è visibile nel punto dove il nostro strumento aggiungeva il riferimento. Questo errore non deve diventare un giudizio di invalidità sul codice originale.

## Implementazione

1. **Compilazione originale come primo passaggio.** `runner.gd` compila il sorgente dello studente senza iniezioni. Se fallisce, torna `status: "compile_error"`, senza provare a strumentarlo.
2. **Strumentazione opzionale.** Se l'originale compila, Godot prova a compilare una copia con l'osservazione delle variabili. Se questo fallisce, esegue **il GDScript originale**; la risposta torna `status: "executed"`, `localCapture: "unavailable"`, `localCaptureReason: "instrumentation_compile_error"`.
3. **Fasi diagnostiche dichiarate.** Il runner comunica tramite `JavaScriptBridge` le fasi `original_compile`, `instrumentation` e `execution`. La console del browser separa il diagnostico della compilazione originale, quello dell'iniezione temporanea e quello di esecuzione. I messaggi della fase di strumentazione **non vengono inseriti nello stderr dello studente** e sono osservabili in `reply.diagnostics.instrumentation`.
4. **Osservazione a runtime delimitata.** Il codice temporaneo inserito alla fine di `_ready()` attiva la fase di strumentazione prima dell'osservazione e ritorna alla fase `execution` subito dopo.
5. **Verifiche didattiche a tre esiti:** `invalid_code` quando il codice originale non compila o produce errori; `inconclusive` quando il codice originale funziona ma non riusciamo a osservare tutte le variabili richieste; `accepted`/`requirements_not_met` per codice effettivamente osservato ed esaminato. `passed: false` in tutti gli esiti tranne `accepted`. Nessuno di questi esiti autorizza XP o progressi cloud.
6. **Scenario di comportamento senza stderr.** Le riesecuzioni con valori differenti non possono essere approvate quando Godot segnala un errore, anche se l'output testuale coincide.

## Test con il vero Godot WebAssembly

Suite GitHub Actions:
- [Separazione della strumentazione, regressioni di tutte le 60 lezioni](https://github.com/domyno6773/gdscript-hero/actions/runs/40308420603)
- [Scenario alternativo con errore condizionale](https://github.com/domyno6773/gdscript-hero/actions/runs/40308699773)

Sono stati aggiunti quattro casi:

| Caso | Comportamento atteso |
|---|---|
| `nome` dichiarato e stampato dentro un `if true:` in lezione 5 | Originale valido, stampa Eroe; osservazione inserita fuori scope non compilabile → **inconclusive**, nessun errore attribuito allo studente |
| `var nome: int = "Eroe"` | Il **sorgente originale** non compila → **invalid_code**, nessun tentativo di iniezione |
| Variabile esistente, stampa corretta, poi `return` prima della cattura | Esecuzione originale corretta ma variabili non osservate → **inconclusive**, non promossa |
| Lezione 17: con livello iniziale 10 stampa correttamente; con livello modificato a 9 un ramo esegue `push_error()` | Il caso originale è corretto, ma lo scenario alternativo presenta diagnostico Godot → **respinta**, non promossa |

I test precedenti per 60 lezioni, casi negativi, alternative, sandbox e collegamento all'editor devono rimanere verdi.

## Limiti ancora esistenti

- Il codice per osservare le variabili è ancora inserito mediante analisi testuale e non tramite un parser GDScript. Questa fase **non lo rende universale**.
- La separazione dei diagnostici è effettuata dal runtime di browser che lo studente può manipolare tramite `JavaScriptBridge`: rimane **informazione didattica non attendibile** per premi e progressi.
- Eventuali messaggi asincroni arrivati dopo la risposta non sono garantiti associati alla richiesta conclusa.
- Anche una copia strumentata che **compila** potrebbe eseguire comportamenti differenti dall'originale; un vero schema di osservazione non invasivo richiede lavoro separato.
- `push_error` può essere una scelta intenzionale in altre consegne: oggi il laboratorio considera conservativamente qualsiasi diagnostico errore come mancata validazione.
- Nessuna distribuzione pubblica della modifica. La demo temporanea eventualmente avviata in precedenza potrebbe usare una build precedente.

## Esito architetturale

Il motore ha ora un comportamento più corretto: **un difetto del nostro strumento di osservazione non viene etichettato come errore GDScript dello studente.** Restano da affrontare l'osservazione di programmi arbitrari, la valutazione di soluzioni strutturalmente diverse e la sicurezza dei progressi.
