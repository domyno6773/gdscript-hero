# GDScript Hero — Fase 2, Godot nel pulsante «Verifica il codice»

**Data:** 26 ottobre 2026. **Ambito:** esclusivamente `spike/godot-native-proof-20261026` su ambiente di prova locale; nessuna pubblicazione su `main`.

**Evidenza E2E:** [GitHub Actions 40316297587 — completed / success](https://github.com/domyno6773/gdscript-hero/actions/runs/40316297587).

## Comportamento implementato

Il nuovo adattatore `spikes/godot-web/integration/native-preview-adapter.js` offre due modalità *mutuamente esclusive*:

- `?nativeGodotPreview=1`: conserva il precedente pulsante separato **Prova con Godot (diagnostica)**.
- `?nativeGodotVerify=1`: intercetta **il vero pulsante «Verifica il codice»** nella pagina principale. Esegue il GDScript originale con il vero Godot WebAssembly, gli scenari didattici e il validatore Godot del laboratorio, poi mostra l'esito nel normale feedback/console dell'editor.

**Entrambe le modalità sono abilitate unicamente in HTTP su `127.0.0.1:18767`, e usano il runner isolato `http://localhost:18768`.** Nessun altro dominio, GitHub Pages, localhost generico, HTTPS pubblico o link temporaneo del laboratorio attiva queste funzioni. Le richieste non esplicite restano sul vecchio runtime JS.

La UI contiene un interruttore che permette di disattivare la modalità Godot e tornare immediatamente a `App.runAndValidate()` JavaScript. Il metodo `dispose()` ripristina esattamente il riferimento originale. Anche Ctrl+Invio usa l'intercettazione, perché la scorciatoia invoca `App.runAndValidate`. Le varianti di ripasso restano sul vecchio percorso.

Il runner viene caricato **lazy al primo utilizzo**. L'iframe ha `sandbox="allow-scripts"`, senza `allow-same-origin`. Le risposte usano session ID + request ID e sono mostrate come testo, senza interpretarle come markup HTML.

## Isolamento progressi e account

Nella modalità nativa **nessuna funzione di modifica dei progressi viene chiamata**. In particolare, la nuova funzione di verifica nativa non chiama `App.runAndValidate` originale, `currentLesson.validate`, `GDScriptRuntime.execute`, `recordDailyQuestProgress`, `recordLessonAttempt`, `saveStorage`, `AuthManager` o Supabase. Non modifica:

- `App.state.xp`, `finishedLessons` e `completedLessons`;
- stato delle missioni/telemetria persistente o salvataggi in `localStorage`;
- diritti Premium, progressi cloud o informazioni dell'account.

Il valore `app.isValidating` e lo stato del pulsante sono **temporanei**, soltanto per bloccare esecuzioni concorrenti, e tornano normali nel `finally`. Se lo studente modifica la lezione o il codice mentre Godot sta verificando, il risultato viene ignorato. Errori e timeout producono una diagnostica senza XP.

**Attenzione al rollback:** disattivando esplicitamente la casella Godot si ritorna al normale runtime JavaScript preesistente, che mantiene le sue regole attuali di XP e salvataggio. La garanzia di *assenza di XP* riguarda **le verifiche native**, non quelle originali eseguite dopo il rollback.

I risultati dell'iframe restano **non attendibili**. Non è stata aggiunta alcuna autorità di grading lato server.

## Prove Chrome/Godot verificate

Test: `spikes/godot-web/tests/main_editor_verify.cjs`, incluso nel workflow principale. HTTPS esterno bloccato; Supabase sostituito da uno stub senza account reale.

- Pagina originale senza query flag: nessun pulsante o runner nativo aggiunto.
- Attivazione solo locale e differita: l'iframe non esiste prima del primo utilizzo.
- Pulsante Verifica nella lezione **1**: esito nativo `accepted`, console di Godot reale, nessun cambiamento di progressi o salvataggi.
- Lezione **17**: controllo di condizioni con scenari di comportamento e verifica native `accepted`.
- Lezione **50**: `Label` realmente modificata nella scena Godot, esito `accepted`.
- Codice invalido su lezione 50: `invalid_code` e nessuna assegnazione di progressi.
- Il runner sandbox non può accedere al DOM dell'editor padre.
- Contatori strumentati dimostrano **zero invocazioni al JS runtime originale, ai metodi di telemetria/ricompense e ai metodi di quest durante le prove native**.
- Disattivazione checkbox: il successivo click invoca nuovamente il runtime JS precedente; `dispose()` elimina l'iframe e ripristina il metodo originale.
- Suite esistente 60/60, scenari avanzati, isolamento, recupero e parity invariati.

Marker CI: `MAIN_VERIFY_NATIVE_ACCEPTED_NO_XP_PASS`, `MAIN_VERIFY_NATIVE_BEHAVIOR_SCENARIOS_PASS`, `MAIN_VERIFY_NATIVE_SCENE_PASS`, `MAIN_VERIFY_NATIVE_INVALID_NO_PROGRESS_PASS`, `MAIN_VERIFY_EXPLICIT_ROLLBACK_TO_JS_PASS`, `MAIN_VERIFY_DISPOSE_RESTORES_LEGACY_PASS`.

## Prossimo gate: non è ancora «pubblica il sito»

**Questo è un collegamento funzionale nel vero editor, ma SOLO per il test locale.** Il report advisory release-readiness rimane `NO_GO` per la pubblicazione. Non vanno considerati risolti dai soli risultati di Chrome CI:

- origini HTTPS/CORS/CSP del runner pubblicato, cache/deployment e peso iniziale WebAssembly (~42 MiB non compressi, ~9 MiB gzip potenziale);
- affidabilità di sessione e messaggi falsificabili dal codice/browser;
- device mobili reali, browser Safari, memoria e reti lente;
- autorità dei progressi e degli XP lato server; piano di migrazione/rollback reale;
- test end-to-end in un hosting di preview segregato dagli utenti.

**Prossimo intervento tecnico distinto:** progettare e verificare una *preview HTTPS con accessi disabilitati* del vero sito, con due origini e rollback; in seguito test cross-browser e schema di sicurezza dei progressi prima di qualsiasi merge in `main`.

Nessuna modifica al sito pubblico: `main` è rimasto intatto.
