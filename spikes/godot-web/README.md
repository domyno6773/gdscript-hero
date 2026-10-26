# GDScript Hero — prototipo Godot 4 WebAssembly

**Solo prova tecnica, non pronta per produzione.** Nessun codice è stato integrato nel sito pubblico.

## Stato verificato

- Il progetto Godot 4.4.1 viene esportato per il Web con il template ufficiale senza thread.
- Il browser invia nuovo codice GDScript al motore e ne riceve output, errori e informazioni sulle variabili.
- Il laboratorio separato host/lesson-lab.html contiene 48 lezioni tratte dal dataset reale.
- Sono passate **48 soluzioni ufficiali**, **47 test negativi** e **36 alternative valide**: https://github.com/domyno6773/gdscript-hero/actions/runs/40263356901
- Il runner è isolato in iframe sandboxed con origine opaca su una diversa origine HTTP, e i test Chrome verificano blocchi DOM/localStorage, riavvio e interruzione di un ciclo infinito.
- La build generata pesa circa 43 MB non compressi, soprattutto WebAssembly. Non è stata misurata su smartphone reali.

## Percorsi utili

- Editor didattico: host/lesson-lab.html
- Dati delle lezioni: host/lesson-fixtures.js (snapshot manuale di lessons.js)
- Validazione dimostrativa: host/lesson-validation.js
- Motore Godot: project/runner.gd
- Test lezioni: tests/native_lessons_1_12.cjs, tests/native_lessons_13_24.cjs e tests/native_lessons_25_36.cjs e tests/native_lessons_37_48.cjs
- Approfondimenti: ISOLATION.md, SECURITY.md e docs/native-godot-lesson-lab-audit-37-48-2026-10-26.md nella radice repository.

## Riproduzione

Il workflow .github/workflows/godot-web-wasm.yml scarica Godot 4.4.1 e i template, esporta il progetto, avvia due server HTTP e usa Chrome automatizzato per le verifiche.

Per eseguire manualmente bisogna esportare project/ in web/godot.html e avviare:
- il server host sulla origine http://127.0.0.1:18767
- il server WebAssembly con CORS sulla origine http://localhost:18768 (vedi tests/cors_server.py)

La pagina web/index.html appartiene al primo esperimento NON isolato e non deve essere usata per dati o utenti reali.

## Limiti da risolvere

La lettura delle variabili locali avviene inserendo una chiamata in una copia temporanea di _ready; non funziona automaticamente con ogni costrutto GDScript. Gli scenari alternativi cambiano dichiarazioni iniziali semplici, e i controlli sulle sintassi utilizzano ancora regex. Il grading nel browser è falsificabile e non deve governare XP, progressi salvati o abbonamenti. La sicurezza dell'isolamento va ulteriormente verificata su browser e dispositivi reali, e la migrazione richiede ulteriori test su nodi, scene, risorse, funzioni complesse e casi reali non ancora coperti.

## Segnali, Dizionari e Classi (37–48)

Il runner espone il contenuto dei dizionari e le proprietà elementari delle istanze interne di GDScript. Esegue prove extra sui segnali (connessioni, emissione e output del callback) e può invocare metodi sugli oggetti creati in `_ready()`, per esempio variando l'attacco del personaggio nella lezione 47.

Le funzioni di osservazione sono limitate: dati molto annidati vengono troncati; il codice è strumentato con una trasformazione testuale semplificata, non un parser completo. Le emissioni inviate dal browser tramite JSON possono essere numeri float: nel test i callback stampano `71.0` e `11.0` per valori aggiunti dal sistema di prova. I risultati restano non attendibili per XP e progressi persistenti.
