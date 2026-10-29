# GDScript Hero

**Impara GDScript per Godot 4 scrivendo codice, risolvendo esercizi e costruendo progetti.**

[Apri GDScript Hero](https://domyno6773.github.io/gdscript-hero/) · [Repository](https://github.com/domyno6773/gdscript-hero) · [Roadmap](ROADMAP.md)

GDScript Hero è una piattaforma didattica **gratuita e in italiano** per imparare GDScript e familiarizzare con Godot 4, direttamente dal browser. Il progetto è indipendente, in sviluppo attivo, e non è un prodotto ufficiale di Godot Engine.

> **Stato: ottobre 2026.** Il corso, l'editor, la Sandbox, il ripasso, le statistiche, il primo progetto e tre **sfide dimostrative gratuite con Godot** sono disponibili. L'**Archivio Premium** appare come sezione chiusa, ma non esistono ancora abbonamenti acquistabili o contenuti storici. Le **classifiche ufficiali** non sono attive: lo schema server non è stato ancora distribuito.

> **Sviluppo in pausa:** Arena classificata, classifiche ufficiali e backend competitivo rimangono nel repository come lavoro preparatorio, ma non saranno sviluppati o distribuiti per ora. Il corso e il progetto didattico Arena del Gladiatore restano disponibili.

## Funzionalità attuali

| Sezione | Stato | Descrizione |
| --- | --- | --- |
| **Corso gratuito** | Disponibile | **81 lezioni pratiche con 4 compiti ciascuna (324 compiti) e 30 quiz in 15 capitoli**, con teoria, esempi, indizi e verifiche tramite Godot |
| **Editor GDScript** | Disponibile | Sintassi colorata, numeri di riga, completamento contestuale e comandi rapidi |
| **Risultati e diagnostica** | Disponibile | Output atteso/ottenuto, errori in evidenza e dettagli dei test |
| **Sandbox** | Disponibile | Sperimentazione con codice, nodi, scena e viewport 2D |
| **Progetti** | In espansione | **Arena del Gladiatore** è giocabile; altre proposte sono segnalate come future |
| **Arena Classificata** | Demo disponibile | Tre sfide gratuite con Godot reale; l'interfaccia per stagioni e classifiche è pronta ma inattiva senza Supabase e il backend affidabile |
| **Ripasso** | Disponibile | Esercizi alternativi, varianti e percorsi di consolidamento |
| **Statistiche** | Disponibile | Progressione, autonomia, tentativi e aree da approfondire |
| **Gamification** | Disponibile | XP, livelli, traguardi, missioni e mappa del percorso |
| **Salvataggi e account** | Disponibile | Modalità ospite, dati locali, backup e integrazione Supabase |
| **Audio e musica** | Disponibile | Effetti sonori originali, musica lo-fi generativa e volumi indipendenti in Impostazioni |

La nuova interfaccia è ispirata all'editor di Godot: palette blu-grigio, pannelli ordinati, **evidenziazione reale del codice** e area risultati sempre vicina all'editor. Su mobile sono disponibili schede dedicate a compito e codice. Scena e viewport compaiono quando necessari agli esercizi o attivati dall'utente.

## Audio originale

Gli effetti di navigazione, successo, errore, suggerimenti e completamento utilizzano sintesi Web Audio con un timbro morbido. La musica lo-fi di sottofondo è un arrangiamento **originale e generativo** a 76 BPM, con accordi Rhodes, basso e percussioni leggere; non utilizza brani, campioni o risorse musicali di terzi.

Nelle **Impostazioni → Audio ed effetti sonori** sono presenti interruttori e volumi separati per musica ed effetti. La musica è attiva per impostazione predefinita, ma il browser può iniziarne la riproduzione **solo dopo la prima interazione** (anche su Safari/iPhone). Si arresta quando la scheda diventa inattiva e riprende dopo un nuovo gesto. Le preferenze fanno parte del salvataggio esistente. Nessun servizio audio esterno o infrastruttura a pagamento è richiesto.

## Corso e apprendimento

Il corso comprende **15 capitoli, 81 esercizi pratici e 30 quiz di comprensione**. Si parte dalle basi (output, variabili, operatori, condizioni) per arrivare a strutture dati, cicli, funzioni e meccaniche tipiche di Godot. Ogni livello offre un obiettivo concreto, test di verifica e aiuti progressivi.

**L'obiettivo è mantenere il corso principale gratuito.** Le eventuali funzioni aggiuntive a pagamento non dovranno impedire di completarlo.

## Progetti interattivi

**Arena del Gladiatore** è il primo progetto guidato giocabile: gestione della salute, funzioni, condizioni, HUD interattivo ed esportazione verso Godot 4.

Altre schede del catalogo descrivono idee *in preparazione*, non progetti già disponibili.

### Direzione futura, non ancora attiva

È allo studio una libreria di progetti **semplici e complessi**, espansa nel tempo. I progetti complessi potrebbero includere file Godot, sprite e audio originali per costruire giochi completi.

L'accesso a questa libreria, alle statistiche avanzate e al ripasso personalizzato **potrebbe** rientrare in un abbonamento Premium. **Al momento non sono implementati né il pagamento né le autorizzazioni Premium**: ripasso e statistiche esistenti restano accessibili secondo il funzionamento attuale.

I file creati dagli studenti e gli eventuali asset forniti dal progetto dovranno avere regole di utilizzo distinte. Nessuna licenza per futuri asset Premium viene concessa con questo README. Per lo stato e le priorità, consulta [ROADMAP.md](ROADMAP.md).

## Utilizzo

### Online

Apri **https://domyno6773.github.io/gdscript-hero/**: puoi iniziare dalla mappa senza installare Godot sul computer.

### In locale

L'interfaccia è composta da file HTML, CSS e JavaScript statici: non richiede una fase di build.

1. Clona il repository:

   ```bash
   git clone https://github.com/domyno6773/gdscript-hero.git
   cd gdscript-hero
   ```

2. Avvia il server locale incluso (richiede Python):

   ```bash
   python server.py
   ```

3. Visita **http://localhost:8080/** se il browser non si apre automaticamente.

Su Windows è presente anche `avvia.bat`, che apre direttamente `index.html`. Per il comportamento web più prevedibile è consigliabile usare un server HTTP.

**Offline:** una parte consistente dell'esperienza è elaborata nel browser e utilizza salvataggi locali; font, librerie da CDN, login e sincronizzazione cloud possono però richiedere Internet. La disponibilità completa offline non è garantita.

## Architettura

La verifica del **corso principale** usa ora direttamente **Godot Engine 4.4.1 WebAssembly**, eseguito in un iframe isolato. Non esiste più un selettore Beta: il pulsante «Verifica il codice» utilizza il motore Godot per tutte le 60 lezioni storiche e i nuovi esercizi storiche e i 21 nuovi esercizi. Gli esiti accettati attivano le ricompense XP, lo sblocco dei capitoli, la telemetria e i salvataggi esistenti. Le verifiche inconclusive non attribuiscono XP.

**Anche Sandbox, Ripasso e Arena invocano Godot per eseguire GDScript**, tramite un adattatore che conserva il formato dei risultati usato dall'interfaccia. Alcune funzioni avanzate della vecchia simulazione (ad esempio scene Sandbox dinamiche e interazioni persistenti tra chiamate) non sono ancora equivalenti alle funzionalità native di Godot e richiedono ulteriori rifiniture; il runtime JavaScript viene mantenuto nel repository per le classi di rappresentazione delle scene e per vecchi test, ma non è più usato come interprete del codice nella UI pubblica.

**Limite di sicurezza:** XP e salvataggi attuali sono gestiti dal client, come già avveniva prima. Un risultato Godot nel browser **non** è una certificazione server-side: un utente malintenzionato può alterare il client e i suoi messaggi. Non usare questi dati per classifiche competitive affidabili o autorizzazioni Premium senza verifica sul server.

| File | Funzione |
| --- | --- |
| `index.html`, `app.js` | Interfaccia e logica applicativa |
| `lessons.js` | Capitoli, lezioni, verifiche e catalogo dei progetti |
| `runtime.js`, `diagnostic.js` | Classi di compatibilità scena, vecchi test e diagnostica didattica |
| `gdscript-highlighter.js` | Colorazione della sintassi nel codice |
| `native/` | Motore Godot WebAssembly, runner isolato e validatori nativi |
| `styles.css`, `godot-theme.css`, `exercise-redesign.css` | Sistema visivo e layout degli esercizi |
| `viewport2d.js` | Strumenti e viewport 2D |
| `arena_project.js` | Progetto guidato Arena del Gladiatore |
| `review_variants.js`, `stats.js` | Ripasso e statistiche |
| `auth.js`, `supabase-config.js`, `supabase_schema.sql` | Autenticazione, salvataggi e integrazione cloud |

L'integrazione Supabase è prevista per account e sincronizzazione; il codice gira anche in modalità ospite. **Credenziali private e autorizzazioni di accesso non devono essere affidate ai soli file del client**. Un'eventuale monetizzazione richiederà verifiche lato server e un controllo specifico della sicurezza.

## Test

Sono presenti workflow GitHub Actions per regressioni, browser e controlli mirati sul comportamento di Godot:

- `tests/audit_validator_regression.test.cjs` — validatori e casi negativi.
- `tests/supplemental_curriculum_regression.test.cjs` — 21 esercizi aggiuntivi, spiegazioni e indizi specifici, prove con dati alternativi (runner nativo simulato per il test di regressione).
- `tests/didactic_consistency_regression.test.cjs` — coerenza di consegne, suggerimenti, soluzioni e verificatori delle lezioni 5, 19, 29, 39 e 121.
- `tests/review_native_parity.test.cjs` — 17 varianti di ripasso, collegamento all'adattatore Godot e gestione dei verdetti nativi (test con motore simulato).
- `tests/full_course_multitask.test.cjs` — verifica tutti gli 81 percorsi da quattro compiti, gli indizi, i requisiti GDScript e la compatibilità dei progressi (test statico; Godot WebAssembly da verificare separatamente).
- `tests/auth_reliability.test.cjs` — salvataggi, backup e affidabilità dell'integrazione.
- `tests/streak_telemetry_regression.test.cjs` — continuità streak, premio settimanale e completamento dei quattro compiti.
- `tests/browser_smoke.test.cjs` — prove funzionali in Chrome desktop e mobile, compresi i controlli audio.
- `tests/audio_soundscape.test.cjs` — sintesi locale, gesti di avvio e controlli audio indipendenti.
- `tests/native_godot/` — confronti mirati con Godot 4.4.1.

I test basati su Node.js possono essere avviati dalla radice della repository:

```bash
node tests/audit_validator_regression.test.cjs
node tests/supplemental_curriculum_regression.test.cjs
node tests/didactic_consistency_regression.test.cjs
node tests/review_native_parity.test.cjs
node tests/full_course_multitask.test.cjs
node tests/auth_reliability.test.cjs
node tests/streak_telemetry_regression.test.cjs
```

Per avviare i test browser o nativi, consulta [.github/workflows/](.github/workflows/) per strumenti e versioni. I test verificano i comportamenti coperti, **non** la piena compatibilità del runtime con tutte le funzioni di Godot.

## Sviluppo e segnalazioni

Questo è un prodotto in evoluzione: la priorità immediata è **consolidare l'esperienza già disponibile**, correggere problemi e migliorare l'affidabilità prima di introdurre nuove sezioni. Puoi inviare segnalazioni e proposte attraverso [GitHub Issues](https://github.com/domyno6773/gdscript-hero/issues).

I prossimi passi, senza date di rilascio promesse, sono raccolti in [ROADMAP.md](ROADMAP.md).

## Licenze e diritti

**Il repository è pubblico ma, attualmente, non contiene un file `LICENSE` che conceda una licenza esplicita sul codice.** Rendere il sorgente consultabile non equivale automaticamente a concedere il permesso di riutilizzarlo o redistribuirlo. La licenza del codice resta da decidere.

Per eventuali progetti Premium, **codice e asset grafici/audio devono essere trattati separatamente**. L'orientamento progettuale è concedere agli abbonati l'uso didattico e il download dei materiali forniti, senza autorizzarne automaticamente la rivendita, la redistribuzione separata o l'uso commerciale. I termini definitivi dovranno essere pubblicati prima di rendere disponibili tali contenuti.

---

*GDScript Hero è una piattaforma indipendente dedicata all'apprendimento di GDScript e Godot 4.*

## GDScript Hero 2.0: implementazione e prerequisiti

L'interfaccia dell'Arena ufficiale legge le stagioni da Supabase e prevede le classifiche **globale e nazionale**, scelta del Paese con conferma per stagione e invio dei risultati al valutatore Godot. Non si attiva semplicemente configurando una chiave anon: l'invio server è **disabilitato** in `supabase-config.js` finché non sarà distribuito e verificato il servizio `server/arena/`.

Sono ancora necessari: migrazione del database in staging, deployment protetto del valutatore Godot 4.4.1 con test privati, verifica integrata anti-abuso, pubblicazione delle prime 12 sfide stagionali effettive, integrazione del ledger XP ufficiale nel profilo e abbonamenti Premium con gestione dei pagamenti e verifica dell'accesso lato server.

Per monitorare il lavoro senza interpretare le parti preparatorie come già operative: [registro di avanzamento](docs/GDScript_Hero_2_0_implementazione.md) e [deployment del backend](server/arena/README.md).
