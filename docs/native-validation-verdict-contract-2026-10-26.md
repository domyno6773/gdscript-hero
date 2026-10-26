# GDScript Hero — Contratto sperimentale del feedback Godot

**26 ottobre 2026** — branch `spike/godot-native-proof-20261026`. Nessuna modifica alla pubblicazione su `main`.

## Contratto da testare prima dell'integrazione

Per un esito didattico locale il campo **`verdict`** identifica il caso, mentre `passed` è `true` **soltanto** quando `verdict === "accepted"`:

| `verdict` | Significato |
|---|---|
| `accepted` | Codice eseguito dal vero Godot, senza errori, con requisiti e prove disponibili soddisfatti |
| `requirements_not_met` | Codice eseguibile, ma uno o più requisiti o prove native non sono soddisfatti |
| `invalid_code` | Il sorgente originale non compila, non si esegue correttamente oppure Godot segnala un errore |
| `inconclusive` | Il sorgente originale può essere valido, ma il laboratorio non riesce a osservare dati necessari o a generare uno scenario di prova |
| `timeout` | Un'esecuzione non termina nel limite previsto; il runner viene ripristinato |

**Tutti questi esiti sono dati non fidati**: `demoOnly: true`, nessun diritto di attestare XP, completamenti, progressi cloud o accessi Premium. Il browser e il runner possono essere manipolati; nessun punteggio server si fonda su questi valori.

Il risultato restituisce anche `checks` quando disponibile, `nativeStatus` e `reason` per gli esiti inconcludenti/timeout. Non esiste ancora una API/versione stable destinata a consumatori esterni: questo è un contratto di **spike** da consolidare prima dell'integrazione.

## Prove introdotte

- Lezioni 1–60: la soluzione ufficiale eseguita da Godot deve restituire **`verdict: accepted`** e `demoOnly: true`. Gli script sono coperti nelle cinque suite browser native.
- Lezione 60: se i test con pochi fondi o cinque clic non sono disponibili, il risultato non è un rifiuto definitivo, ma **`inconclusive`**.
- Lezioni 17–36: se uno scenario di comportamento non può essere generato o compilato, la risposta diventa **`inconclusive`** anziché pretendere che l'errore del trasformatore provi un errore dello studente.
- Lezioni 55 e 60: se uno scenario **viene eseguito** e produce un errore reale, rimane una mancata validazione e non un accettato.
- Timeout del laboratorio: restituisce `verdict: timeout`, `passed: false` e avvia il ripristino dell'iframe.

## Stato

L'export usa Godot 4.4.1 WebAssembly autentico. Validatori e scenari nativi sono sperimentali, con casi negativi e alternative ma non con copertura formale del linguaggio. Lezione 58 espone l'output nativo `Color` e controlla lo stato reale del nodo.

## Limiti da non scordare

1. Alcune verifiche didattiche usano ancora regex, e alcune classi/collezioni richiedono osservazione strumentata di `_ready()`.
2. Se lo studente cambia appositamente codice per riconoscere gli input di test, un insieme finito di chiamate non certifica che l'algoritmo sia universalmente corretto.
3. Nel laboratorio le regole anti-manipolazione e il protocollo origin sono ancora di prova; per la pubblicazione servono configurazione HTTPS/CORS definitiva e protezione degli account.
4. Le scene 49–60 richiedono altri esempi semanticamente differenti, test reali su mobile/Safari e confronto con risorse native diverse.
5. Serve un gate separato di deploy che verifichi stato auth/progressi/XP, performance, accessibilità e possibilità di rollback.

**Prossimo passaggio:** non aggiungere immediatamente nuove lezioni; valutare la chiusura della fase dei validatori soltanto sul perimetro dello spike e progettare la prova reversibile della verifica ufficiale. Il branch `main` rimane invariato.
