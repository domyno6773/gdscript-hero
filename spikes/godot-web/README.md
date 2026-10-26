# GDScript Hero — Spike Godot runtime

Prototipo separato dal sito e NON sicuro per codice di utenti reali.

## Esecuzione nativa
`GODOT=/path/to/Godot ./spikes/godot-web/tests/test_native.sh`

Lo script compila GDScript dinamicamente, istanzia un Node ed esegue _ready, controlla l'output print("A","B") -> AB, divisione tra interi 100/3 -> 33, proprietà script answer -> 33 e un errore di compilazione.

## Web (non ancora validato dal CI)
Installare il template Godot 4.4.1 Web. Esportare `project` con il preset `Web` a `../web/godot.html`; avviare un server HTTP su `web/` e aprire `index.html`. Il file di hosting usa il vero `godot.js` e `godot.wasm`, con `onPrint`, `onPrintError` e callback JavascriptBridge.

### Limiti
- NON isolato: il GDScript può accedere a JavaScriptBridge e API Godot. Solo demo locale senza sessioni, dati o account.
- Possibili loop infiniti o blocchi del main thread: richiede strategia di terminazione e isolamento.
- Lo script Node accetta solo var di classe osservabili; le locali in _ready non sono ispezionabili con `get`.
- I validatori didattici restano necessari; l'autenticità del runtime non valida l'intenzione didattica.
- Prova browser, mobile, memoria e tempi di avvio non ancora eseguiti.

Il workflow CI su questo ramo esegue SOLTANTO la verifica native/headless: non è una certificazione di WebAssembly o sicurezza.

## Risultato WebAssembly (26 ottobre 2026)

L'export Web di Godot 4.4.1 con template ufficiale `web_nothreads_release.zip` è stato provato in CI con Chrome. I test hanno verificato compilazione dinamica, output nativo, divisione intera, lettura di proprietà, errori, recupero dopo un errore e dimensioni desktop/mobile **simulate**. La build Web generata occupa circa 43 MB non compressi, dei quali ~42 MB sono il file WebAssembly. I tempi misurati in GitHub Actions NON equivalgono a prestazioni di smartphone reali.

**NON usare in produzione.** Il test mostra anche che uno script può accedere al `window` della pagina che lo ospita. Vedi [SECURITY.md](SECURITY.md) per le misure necessarie prima di qualsiasi integrazione.
