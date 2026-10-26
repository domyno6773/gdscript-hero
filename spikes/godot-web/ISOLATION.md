# Prototipo fase 2 — origine separata e controlli

- Parent locale: \`http://127.0.0.1:18767/\` (demo editor)
- Runner locale: \`http://localhost:18768/isolated.html\` (motore Godot)
- Origini *diverse*: obbligatorie anche in produzione; le due origini locali sono di test.
- iframe con \`sandbox="allow-scripts allow-same-origin"\`, utile per Godot Web con fetch di risorse statiche. **Mai consentire allo stesso origin del parent**: MDN avverte che combinare entrambe le opzioni su documenti same-origin annulla le garanzie di sandbox.
- \`postMessage\`: controlli rigidi su \`event.origin\`, \`event.source\`, versione, session ID, request ID e dimensione dei messaggi.
- Nessun token, cookie, sessione Supabase, accesso a dati del sito e nessun grading trasferiti al runner.
- Ricreazione iframe: prototipo di kill switch; **da verificare con un vero loop infinito**, può non riuscire se il browser condivide processo o main thread.
- Il codice GDScript può comunque usare \`JavaScriptBridge\` e controllare il **proprio** origin, inviare messaggi falsi, alterare i risultati o inviare richieste di rete. Un runner diverso non è una sandbox fidata. Nessun output del runner deve decidere premi/progressi/abbonamenti senza policy server e verifica separata.
- Un sistema di origine separata per il runner richiede un secondo dominio/origine e controllo sulle policy CSP del runner. GitHub Pages di default può ospitare il parent, ma in produzione il runner deve stare su un'origine dedicata, senza cookie/chiavi.
- I test desktop e mobile sono entrambi Chrome su runner CI; NON Safari/Android reali.
- Godot WebAssembly ~42 MB non compressi; misurare con compressione, cache, rete lenta e dispositivi reali.

## Run CI

La workflow \`.github/workflows/godot-web-wasm.yml\` esporta Godot, avvia due web server, testa origine separata e dinamica dei runner. Lo script \`tests/isolation_smoke.cjs\` non include ancora un vero loop infinito perché tale prova deve essere eseguita in un processo browser con limite esterno. Non usare in produzione.
