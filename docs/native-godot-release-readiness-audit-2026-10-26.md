# GDScript Hero — Audit di integrazione e preparazione al rilascio

**Data:** 26 ottobre 2026  
**Ambito:** branch `spike/godot-native-proof-20261026`. Nessuna modifica a `main`, al deploy GitHub Pages o ai dati degli account.  
**Decisione:** **NO-GO per produzione; GO per continuare la sperimentazione interna, isolata e senza progressi cloud.**

## Evidenze riprodotte

La [suite su Godot 4.4.1 WebAssembly](https://github.com/domyno6773/gdscript-hero/actions/runs/40264643510) ha coperto:
- **60/60 soluzioni ufficiali** approvate;
- **59/59 casi intenzionalmente errati** respinti;
- **48/48 varianti corrette** approvate, includendo casi di semplice formattazione nelle lezioni 49–60;
- isolamento cross-origin, riavvio dopo blocco e browser desktop/mobile **emulato** in Chrome CI.

Il [primo audit automatico di release](https://github.com/domyno6773/gdscript-hero/actions/runs/40301419815) ha confermato la stessa suite e misurato:

| Grandezza | Risultato | Interpretazione |
|---|---:|---|
| Export `godot.wasm` + `godot.js` + `godot.pck`, non compresso | **41,99 MiB** | Dimensione dei tre file locali, non traffico del sito completo |
| Dimensione gzip calcolata sugli stessi tre file | **9,16 MiB** | Potenziale compresso: **non** prova che il server di produzione offra gzip |
| Avvio su Chrome desktop, GitHub Actions | **1.941 ms** | Runner locale in CI, non connessione Internet |
| Avvio con viewport mobile Chrome emulata | **1.237 ms** | Non smartphone Android/iOS reale |
| Recupero dopo loop infinito | **circa 4,6 s** | Provato su Chrome CI, non garantito su ogni browser |

La diagnostica è disponibile in `spikes/godot-web/tests/release_readiness.cjs`; il file `test-artifacts/release-readiness-audit.json` viene salvato come artifact della GitHub Action. Il controllo è **consultivo**: il job può riuscire mentre il verdetto di rilascio rimane NO-GO.

## Gate di rilascio

| Gate | Stato | Evidenza / motivo |
|---|---|---|
| **Esecuzione nativa di 60 esercizi di riferimento** | Superato per i casi provati | Suite Chrome + Godot reale |
| **Isolamento della pagina principale** | Superato solo per le prove Chrome | Iframe con origine opaca; blocco DOM/localStorage; riavvio dopo timeout |
| **Integrazione nella piattaforma pubblica** | **Bloccante** | `app.js` chiama ancora `GDScriptRuntime.execute` e `currentLesson.validate(result, GDScriptRuntime)`. L'editor/sistema XP non usano il runner Godot |
| **Origini di deploy** | **Bloccante** | Host e runner codificano `127.0.0.1:18767` / `localhost:18768`; per pubblicare occorrono origini reali separate, CORS e policy CSP controllate |
| **Grading autorevole e progressi** | **Bloccante se XP/sblocchi sono considerati affidabili** | `app.js` accredita XP nel client; `auth.js` scrive su Supabase i valori XP e completamenti forniti dal salvataggio; RLS limita l'utente proprietario ma non certifica una soluzione |
| **Risultati a prova di manipolazione** | **Bloccante se serve anti-abuso** | GDScript può usare `JavaScriptBridge` nell'origine del runner e alterare il proprio feedback |
| **Validazione generale di GDScript** | **Bloccante per migrazione totale** | RegExp per i vincoli sintattici, iniezione temporanea alla fine di `_ready()`, alterazioni testuali dei valori per i test di scenari |
| **Dimensione del pacchetto** | Rischio da misurare, non bocciatura automatica | 41,99 MiB grezzi; ~9,16 MiB gzip teorici. Mancano misure CDN, cache e reti lente |
| **iOS/Safari e Android reali** | Non verificato | La modalità mobile CI cambia viewport, non dispositivo/browser |
| **Coerenza delle consegne** | Correzioni necessarie | Lezioni 4, 6, 39 e 58 presentano divergenze tra materiale, starter e Godot nativo |
| **Salvataggi guest / login / logout / multi-dispositivo** | Non verificato per integrazione Godot | Il laboratorio è indipendente da AuthManager e dallo stato dell'app |
| **Accessibilità e integrazione della viewport** | Non verificato | Non esiste ancora un'esperienza Godot nel flusso corrente |

## Dettagli sull'attuale integrazione account

Il comportamento corrente in `app.js` completa le lezioni e incrementa gli XP sul client in seguito ai propri validatori. `auth.js` prepara un payload `game_saves` con `xp`, `level`, `finished_lessons_count` e `save_data` derivati da `snapshot`. La policy RLS per `game_saves` esamina l'identità (`auth.uid() = user_id`), proteggendo l'accesso tra account, **non l'integrità dei valori XP**.

Questa distinzione non è un difetto nuovo introdotto da Godot: è una scelta architetturale già presente. Se XP, missioni e completamenti sono solo gamification personale, è possibile mantenere deliberatamente il progresso *locale e non attestato*. Se invece diventano premi, classifiche affidabili o requisiti Premium, serve verifica lato server e non basta una firma/prova proveniente dal browser.

In nessun caso inviare credenziali Supabase, token di sessione, cookie o profili utente all'origine del runner.

## Piano d'integrazione raccomandato

### Fase A — Contratto e isolamenti (nessun rilascio pubblico)
Definire un adattatore `NativeGodotRunner` che trasformi le risposte Godot in un risultato stabile per l'app (`status`, `stdout`, `stderr`, dati di scena, diagnostica, timeout), separandolo dalla valutazione didattica. Usare una configurazione di origini esplicite, un runner senza account o cookie e una policy CSP appropriata. Verificare input, output, versioni e dimensione dei messaggi.

### Fase B — Correttezza didattica
Allineare gli esercizi incoerenti (4, 6, 39, 58); introdurre test di mutazione e alternative semanticamente diverse. Distinguere esplicitamente `compile_error`, `runtime_error`, `instrumentation_unavailable` e `timeout`. Una semplice regex o la presenza di un certo `print()` non deve essere sufficiente per attestare un requisito di apprendimento. Se una variante corretta non è osservabile, segnalare l'incertezza anziché classificarla automaticamente come codice sbagliato.

### Fase C — Prove su hardware e hosting reali
Provare installazioni reali Chrome/Firefox desktop, Android Chrome, Safari iOS/iPadOS; prima apertura e riapertura, memoria, velocità e rete mobile lenta. Misurare l'effetto di compressione HTTP e caching; verificare che il runner rimanga isolato anche durante i riavvii e i timeout. Stabilire limiti prestazionali **dopo** aver raccolto dati reali e deciso i dispositivi minimi supportati.

### Fase D — Esperimento nel sito, reversibile
Solo dopo i gate precedenti, aggiungere una modalità di prova/feature flag per una porzione controllata di lezioni, **senza trasferire automaticamente XP o progressi cloud dal runner**. Il vecchio runtime resta disponibile per rollback, ma l'interfaccia deve indicare quale motore sta usando, soprattutto dove gli output differiscono. Testare continuità di codice e stato scena, login/logout, backup e ripristino.

## Decisione

**Non eseguire merge in `main` e non distribuire il runner sul dominio dell'app.** La prova che Godot nativo è utilizzabile per il curriculum ufficiale è positiva; la prova di rilascio al pubblico, di accuratezza dei validatori su programmi arbitrari e di affidabilità dei progressi **non** è ancora stata raggiunta.

### Fonti nel repository
- `spikes/godot-web/README.md`
- `spikes/godot-web/ISOLATION.md`
- `spikes/godot-web/SECURITY.md`
- `spikes/godot-web/tests/release_readiness.cjs`
- `spikes/godot-web/host/host.js`
- `spikes/godot-web/web/isolated-runner.js`
- `spikes/godot-web/project/runner.gd`
- `app.js`, `auth.js`, `supabase_schema.sql`
