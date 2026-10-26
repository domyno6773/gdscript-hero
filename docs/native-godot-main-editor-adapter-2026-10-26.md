# GDScript Hero — Adattatore sperimentale nel vero editor

**Data:** 26 ottobre 2026. **Ambito:** branch `spike/godot-native-proof-20261026`. Il sito GitHub Pages e il ramo `main` non sono modificati.

## Che cosa è stato integrato

Il file `index.html` del solo branch sperimentale carica `spikes/godot-web/integration/native-preview-adapter.js`, che rimane completamente **inerte** per impostazione predefinita.

L'adattatore si attiva **soltanto** con tutti i seguenti criteri:
- URL principale servito in HTTP sull'host **127.0.0.1**, porta **18767**;
- parametro `?nativeGodotPreview=1` nell'URL;
- browser che supporta `crypto.randomUUID` e iframe sandboxed.

Nell'editor principale della lezione compare il pulsante `Prova con Godot (diagnostica)`. Legge il sorgente da `#code-editor` e l'ID della lezione da `App.state.currentLessonId`. Carica i metadati del laboratorio **solo al primo clic**, avvia Godot WebAssembly nell'iframe separato `http://localhost:18768/isolated.html`, e visualizza il risultato con `textContent`. L'iframe ha `sandbox="allow-scripts"`, **senza** `allow-same-origin`.

Il pulsante originale `Verifica il codice` rimane del tutto invariato e continua a usare l'attuale `GDScriptRuntime`. L'adattatore **non intercetta** il suo evento e **non chiama** `App.runAndValidate`.

## Limite di responsabilità

Questa è **solo diagnostica locale**. Non assegna XP, non sblocca lezioni, non modifica i progressi o il codice nell'editor, non esegue salvataggi e non invoca `AuthManager`, Supabase, endpoint cloud o altri servizi. Non legge né trasferisce credenziali o token. Il messaggio dell'interfaccia dichiara esplicitamente che i risultati ricevuti dal runner sono **non attendibili** e non possono diventare risultati ufficiali.

Per evitare errori dovuti alla navigazione, l'adattatore confronta ID lezione e testo dell'editor prima e dopo l'esecuzione: se cambiano, ignora l'output precedente. Permette una sola esecuzione alla volta. All'avvio di un errore o timeout distrugge l'iframe; Godot viene caricato di nuovo soltanto in un tentativo successivo.

## Come provarlo localmente

Le istruzioni presuppongono un clone/check-out **del branch sperimentale**, non della versione pubblica.

1. Installare Godot 4.4.1 con gli export template Web senza thread, ed esportare `spikes/godot-web/project` verso `spikes/godot-web/web/godot.html` seguendo il workflow CI.
2. Dalla root del repository avviare `python3 -m http.server 18767 --bind 127.0.0.1`.
3. Da `spikes/godot-web` avviare `python3 tests/cors_server.py 18768 web`.
4. Aprire `http://127.0.0.1:18767/index.html?nativeGodotPreview=1` e selezionare una lezione.
5. Premere **Prova con Godot (diagnostica)**, non il tasto di verifica ufficiale, e leggere console, errori e dati strutturati nel riquadro dedicato.

**Non attivare l'account durante una prova locale con dati reali.** Per provare il collegamento end-to-end senza account, usare la suite automatica, che intercetta la configurazione Supabase e blocca il traffico HTTPS esterno.

Il runner usa **due origini locali differenti** intenzionalmente. Cambiare `localhost`, la porta o l'host richiede rivedere i controlli di origine in entrambi i lati e la politica CORS. Questa non è una configurazione di deploy production-ready.

## Test d'integrazione

Il test `spikes/godot-web/tests/main_editor_adapter.cjs` apre la **vera pagina index.html** con Playwright e:
- verifica che senza query flag il pulsante non venga creato e Godot non venga caricato;
- verifica l'attivazione opt-in e il caricamento WebAssembly differito;
- esegue la lezione 1 usando il testo del vero editor e controlla la console;
- esegue la lezione 50, che richiede una vera `Label`, e controlla il testo del nodo restituito da Godot;
- verifica che il parent non sia accessibile dall'iframe sandboxed;
- verifica che XP, array delle lezioni completate e salvataggio locale restino invariati durante l'esecuzione;
- prova un errore nativo di compilazione, anch'esso privo di conseguenze sui progressi.

Tutto il traffico HTTPS esterno è bloccato in Playwright, e la configurazione Supabase è sostituita da uno stub locale senza sessioni/account.

## Limiti e prossimi gate

- Il prototipo non è stato collegato al sistema di grading e non attribuisce alcun punteggio.
- Mantiene i due motori in parallelo: quello JavaScript resta ufficiale mentre Godot dà feedback diagnostico.
- Non replica ancora tutte le funzioni dell'editor (viewport principale, asset di scena dinamici, ripasso, Arena, telemetria).
- I metadati delle lezioni sono uno snapshot: vanno sincronizzati con le consegne reali prima di una migrazione.
- Il runner e i risultati restano controllabili dallo studente; serve una decisione distinta sull'affidabilità del grading.
- Non sono stati verificati dispositivi mobili reali, Safari, memoria, rete lenta, accessibilità o un hosting con CSP/CORS definitivi.

**Conclusione:** questo adattatore è un passo di integrazione controllato, non un'autorizzazione al merge su `main` o alla pubblicazione.
