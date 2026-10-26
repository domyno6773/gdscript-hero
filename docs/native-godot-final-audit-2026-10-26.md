# GDScript Hero — esito finale del prototipo Godot WebAssembly

Data: 26 ottobre 2026. Branch: `spike/godot-native-proof-20261026`.

## Risultato verificato

[GitHub Actions completo, con Godot 4.4.1 WebAssembly e Chrome](https://github.com/domyno6773/gdscript-hero/actions/runs/40264354237)

L'esecuzione automatica conferma:
- **60/60 soluzioni ufficiali accettate**.
- **59/59 esempi scorretti progettati per la prova respinti**.
- **48/48 varianti corrette della suite accettate**. Nelle lezioni 49–60 le varianti cambiano soltanto commenti/formattazione, dunque questo numero non prova la tolleranza del validatore a algoritmi realmente alternativi.
- Esportazione WebAssembly, isolamento con iframe a origine opaca, riavvio manuale e recupero da ciclo infinito superati in Chrome.
- La versione pubblica e il branch main non sono stati modificati.

## Lezioni 49–60: scene native

Per gli esercizi su nodi, scene e input il runner crea veri oggetti Godot:
- **49**: Node Giocatore e operatore $.
- **50–52**: Label Titolo, SaluteLabel, e targhette del Dungeon.
- **53–56**: Button, connessioni del segnale pressed e simulazioni di clic su nodi reali. Il clicker è provato con 1 e 2 clic; la plancia prova entrambi i pulsanti.
- **57**: Timer Cooldown reale, configurazione wait_time=2.5, one_shot=true, start() e collegamento timeout. La prova automatica *emette manualmente timeout* in modo deterministico: non verifica che la callback scatti davvero dopo 2,5 secondi.
- **58**: ColorRect BarraVita reale, proprietà Color e dimensioni Vector2.
- **59**: Node Moneta reale; queue_free() e is_queued_for_deletion() verificati nella stessa esecuzione.
- **60**: Button e Label del negozio; acquisto con 100 monete, insufficienza con 20 e cinque clic consecutivi fino all'esaurimento del saldo.

I valori delle scene vengono letti direttamente dal motore, non simulati da JavaScript. Le pressioni dei pulsanti e gli eventi di timeout di prova sono generati in modo controllato dal runner, dopo _ready.

## Anomalie del materiale didattico da correggere prima della migrazione

1. Lezione 4: output previsto con spazio in Energia: 100 %, mentre print() di Godot produce Energia: 100%.
2. Lezione 6: starter e consegna richiedono nomi di variabili differenti.
3. Lezione 39: codice iniziale, commenti e consegna finale non coincidono.
4. Lezione 58: print() della proprietà Color in Godot produce "(0.1333, 0.7725, 0.3686, 1.0)", non la stringa "#22c55e" mostrata come output atteso sul sito. Il validatore del laboratorio controlla il vero Color e l'output nativo.
5. Lezione 57: la simulazione manuale di timeout convalida connessione e callback, ma non la precisione temporale. Per un test reale servirebbe aspettare il timer e misurare l'evento separatamente.

## Limiti rimasti

- **Validazione didattica non universale.** La cattura delle variabili locali inserisce codice in una copia di _ready(), e alcune verifiche sintattiche usano regex. Possono esserci falsi positivi o falsi negativi fuori dai casi testati.
- **Output del runner falsificabile.** La sandbox protegge l'origine dell'editor in Chrome CI, ma non rende autorevoli i risultati provenienti dal browser. Non usarli per XP, progressi salvati, sblocchi o abbonamenti senza una strategia attendibile.
- **Compatibilità e prestazioni.** Testate solo sessioni Chrome CI (desktop e viewport mobile emulata), non smartphone reali, Safari/iOS, reti lente o memoria su dispositivi economici.
- **Dimensione.** L'export precedente pesava circa 43 MB non compressi, di cui ~42 MB WebAssembly; non è ancora stata effettuata una strategia di caricamento differito e caching per produzione.
- **Copertura.** L'esito dei test dimostra solo i comportamenti verificati, non la correttezza generale dell'interprete, né un audit di sicurezza completo.
- **Esperienza prodotto.** Questo laboratorio è un sito dimostrativo, non un'integrazione nel flusso didattico di GDScript Hero.

## Decisione consigliata

Non unire ancora il branch sperimentale in main. La prova dell'architettura è riuscita: il vero Godot può sostituire l'esecuzione simulata delle lezioni testate. Prima di una migrazione preparare un'integrazione *a feature flag* sperimentale per un gruppo limitato di utenti, risolvere incongruenze e validatori, e svolgere test reali di sicurezza, prestazioni, accessibilità e compatibilità.

## File

- `spikes/godot-web/project/runner.gd`: runtime Godot e scene native.
- `spikes/godot-web/host/lesson-lab.html`: laboratorio completo delle 60 lezioni.
- `spikes/godot-web/host/lesson-validation-native-scenes.js`: validatori dei nodi per 49–60.
- `spikes/godot-web/tests/native_lessons_49_60.cjs`: prove nel browser.
- `.github/workflows/godot-web-wasm.yml`: tutta la suite.
