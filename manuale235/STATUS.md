# Manuale italiano: stato del corso e del rilascio

Aggiornamento: 2 novembre 2026. Ramo di lavoro: `manuale-235-lezioni`, PR [#12](https://github.com/domyno6773/gdscript-hero/pull/12).

Le **235 lezioni, i 43 capitoli e tutti i verificatori sono implementati**. Il sito pubblico e `main` non sono stati modificati. La PR rimane in bozza; `readyForRelease` resta `false` fino alla decisione di pubblicazione.

## Fonte e comportamento

- Fonte: `GDScript_Manuale_Italiano_Revisionato.pdf` fornito nella conversazione. Ordine, titoli e obiettivi delle 235 attività conservati; frammenti e driver corrotti dall'impaginazione ricostruiti nel catalogo del sito.
- ID delle attività: `10001…10235`. I completamenti del vecchio corso non completano automaticamente esercizi differenti. Gli XP storici sono conservati.
- Lezione 1: esecuzione dello script già pronto. Lezione 2: modifica del messaggio vuoto. Lezione 3: commentare l'istruzione senza cancellarla. Lezione 4: correggere sintassi e indentazione.
- Lezioni con stdin: input riga per riga, più scenari di verifica e anteprima che non assegna completamenti o XP.
- Lezioni 171–235: file `.gd` indipendenti caricati da Godot 4.5.1 come risorse native, con `class_name`, tipi, ereditarietà, segnali e classi astratte reali. L'assemblaggio in classi annidate è stato sostituito.
- `main.gd` e gli altri script forniti sono protetti. Ripristino e soluzione agiscono sui file modificabili; le bozze comprendono tutti i file, la selezione e l'input.
- Ripasso disponibile per le attività già completate, in bozze separate dal corso, con premio settimanale idempotente e limite esistente.

## Verifiche di rilascio

| Controllo | Esito |
| --- | --- |
| Integrità: 235 attività, 43 capitoli, verificatori e file protetti | Superato |
| Tutte le 235 soluzioni in Godot nativo 4.5.1 | Superato: 2.113 scenari, 254 controlli negativi |
| Tutte le 235 soluzioni in Chrome con Godot WebAssembly | Superato: anche 15 mutazioni comportamentali respinte |
| Classi astratte, ereditarietà e riferimenti fra file | Superato su tutto il corso |
| Regressioni riallineate al corso attivo, engine e gameplay conservati | Superato |
| Sblocchi, vecchi ID, XP, missioni e fusione fra dispositivi | Superato |
| Bozze multifile, backup, conflitti e isolamento degli account | Superato nei test automatici |
| Supabase reale: round-trip, revisioni concorrenti e RLS | Superato in transazione annullata |
| Browser mobile Chrome/WebKit e navigazione desktop | Superato; quattro viewport mobile e 23 larghezze di navigazione |
| Pubblicazione e verifica del sito pubblico | Non eseguite |

I 254 controlli negativi comprendono i 234 starter incompleti (la prima lezione è volutamente eseguibile) e 20 mutazioni compilabili nei design pattern e nei progetti finali. Sono provate anche soluzioni alternative selezionate; i test non dimostrano la correttezza di tutte le implementazioni possibili.

I traguardi richiedono il completamento effettivo dei 43 capitoli; i premi delle lezioni e dei traguardi si fondono senza duplicazioni. Il reset completo elimina anche bozze multifile, ripassi e registri dei premi. Backup e cloud aggiornano l’editor senza riutilizzare il testo precedente.

Il rapporto [AUDIT_RELEASE.md](AUDIT_RELEASE.md) descrive correzioni, prove e limiti. Il supporto riguarda i file GDScript previsti dal corso, non l'importazione di qualsiasi progetto Godot con asset o plugin arbitrari.

## Riproduzione

- `node tests/manual-235-structural.test.cjs`
- `node tests/manual-release-regressions.test.cjs`
- `GODOT_BIN=/percorso/Godot_v4.5.1-stable_linux.x86_64 node tests/manual-course-native.test.cjs`
- `node tests/manual-course-browser.test.cjs` con Playwright 1.56.1 e Chrome installati.
- `node tests/manual-mobile-browser.test.cjs` con Chrome, WebKit e relative librerie di sistema.
- Le workflow di regressione, curriculum, parità nativa, riproducibilità del pack e browser eseguono anche i controlli conservati su cloud, account, quest, Arena, scene e gameplay.

## Pubblicazione

Il completamento tecnico dell'audit non pubblica il corso. Per il rilascio occorrono una decisione esplicita, l'unione della PR e la verifica del deployment GitHub Pages. Non vengono modificati utenti o salvataggi reali come parte della pubblicazione di questo ramo.
