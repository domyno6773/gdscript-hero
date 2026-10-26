# GDScript Hero — prototipo del vero Godot WebAssembly

**Prototipo sperimentale, separato dal sito pubblico. Non usare in produzione.**

## Fattibilità dimostrata (26 ottobre 2026)

[Workflow browser con Godot 4.4.1 — 60 lezioni](https://github.com/domyno6773/gdscript-hero/actions/runs/40264354237)

- **60/60 soluzioni ufficiali** eseguite e validate in Chrome con Godot WebAssembly.
- **59/59 test negativi** respinti.
- **48/48 varianti corrette** accettate; quelle 49–60 variano solo commenti e formattazione.
- Il runner Godot usa un iframe a origine opaca, comunica mediante postMessage e si può distruggere/ricreare dopo un timeout.
- Prototipate le API native di GDScript, Dictionary, Array, Vector2, segnali, classi, Label, Button, Timer, ColorRect, queue_free e scene figlie.

## File principali

- `host/lesson-lab.html` — laboratorio indipendente di tutte le 60 lezioni.
- `host/lesson-fixtures.js` — snapshot manuale delle lezioni pubbliche.
- `host/lesson-validation.js` — controlli didattici di 1–48.
- `host/lesson-validation-native-scenes.js` — controlli di 49–60.
- `host/host.js` — editor e richieste al runner isolato.
- `project/runner.gd` — motore nativo WebAssembly, scene, test dinamici.
- `tests/native_lessons_1_12.cjs`, `native_lessons_13_24.cjs`, `native_lessons_25_36.cjs`, `native_lessons_37_48.cjs`, `native_lessons_49_60.cjs` — regression test.
- `ISOLATION.md`, `SECURITY.md` e `docs/native-godot-final-audit-2026-10-26.md` — limiti e valutazione.

## Riproduzione

La CI scarica Godot 4.4.1 e il template Web ufficiale, esporta il progetto, avvia due server HTTP di origine distinta ed esegue test Playwright con Chrome.

Per eseguirlo localmente: esportare `project/` in `web/godot.html` con template Web 4.4.1. Dalla directory `spikes/godot-web`, avviare un server HTTP per `host/` su `127.0.0.1:18767` e `python3 tests/cors_server.py 18768 web` per la WebAssembly sul nome `localhost:18768`. Aprire `http://127.0.0.1:18767/lesson-lab.html`.

## Cautele

Le scene sono create da veri nodi Godot; i clic vengono emessi artificialmente, e il Timer della lezione 57 è avviato davvero ma il timeout di prova viene emesso manualmente. Godot stampa il Color della lezione 58 come componenti RGBA, non come codice HEX. Le lezioni 4, 6 e 39 hanno altri problemi nei materiali originali.

I validatori usano ancora strumentazione delle variabili locali ed euristiche sintattiche. I risultati sul client non sono sicuri contro manipolazioni e **non devono assegnare XP, progressi cloud o accessi Premium**. Mancano test su dispositivi mobili reali, Safari e connessioni lente. La build Web precedentemente misurata è di circa 43 MB non compressi.

**Il branch main e il sito pubblico non sono stati modificati.**
