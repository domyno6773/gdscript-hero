# GDScript Hero 2.0 — registro delle decisioni e avanzamento

**Ultimo aggiornamento:** 27 ottobre 2026. Fonte: `GDScript_Hero_2_0_Specifica_Tecnica.md` (documento concordato in chat).

Questa pagina accompagna la specifica principale; non dichiara operative funzionalità non ancora distribuite. La logica XP nel browser è **locale e non certificata**: non usarla per attribuire punti competitivi, entitlement Premium o XP ufficiali in un backend.

## Decisioni prodotto confermate

- **Gradi:** Esploratore (10), Forgiatore (20), Architetto (30), Maestro (40), Leggenda (50), sempre automatici.
- **Missioni:** Studio Quotidiano = lezione completata; Ripasso del Giorno = variante completata con o senza aiuti; Studio Completo = lezione e ripasso nello stesso giorno UTC. 10 XP ciascuna, massimo 40 XP/settimana. Non premiare click o disincentivare suggerimenti.
- **Progetti interattivi futuri:** primo completamento validato = 150 XP progetto semplice / 350 XP progetto complesso. Valori scelti per la futura implementazione; non assegnare XP a progetti non completabili o non verificati, né attribuire vantaggi nella graduatoria.
- **Archivio Premium:** la sezione e gli esercizi sono **chiusi senza abbonamento valido**; nessuna navigazione o esecuzione dell'archivio in modalità gratuita, nemmeno come catalogo di prove accessibili. Il codice dell'utente non è recuperabile dall'archivio una volta terminata la stagione: **spetta all'utente salvarlo prima della chiusura**. È consentito conservare nel profilo i risultati e le posizioni storiche, non il codice. Nessun XP e nessun punto competitivo per i replay Premium.
- **Paese per graduatoria:** ipotesi automatica tramite geolocalizzazione IP approssimativa, **nessuna richiesta GPS**; domanda esplicita «È sbagliato?» con selettore Paese. Paese confermato e bloccato per **tutta la stagione UTC**. Eventuale modifica valida soltanto dalla stagione successiva. Non dichiarare che un IP provi residenza.
- **Motore di valutazione:** utilizzare **Godot**, come il runtime attualmente effettivo del sito (`native/native-beta-adapter.js` dichiara **4.4.1 WebAssembly**). Il server dovrà utilizzare Godot **4.4.1** headless isolato, almeno finché non viene aggiornato e verificato **sia** il sito **sia** il valutatore. NON fidarsi di una risposta del runner browser come risultato ufficiale. Un Supabase Edge Function da solo non sostituisce un processo Godot isolato; serve un worker adatto.
- **XP storici:** conservare i saldi precedenti nel profilo, conteggiarli per livello/grado, registrare separatamente il saldo storico non attestato. Non trasformarli in punti competitivi né in XP verificati via importazione, fusione o cambio di device. Per attività future, registro eventi univoci e server come fonte di verità.
- **Contestazioni:** congelare la sfida difettosa prima di ulteriori risultati; conservare `grading_version`, log e ricevute. Se possibile correggere i test e **rivalutare tutti i partecipanti con lo stesso valutatore**; in caso contrario annullare la sfida per tutti e ricalcolare la classifica della stagione in modo uniforme. Annunciare la rettifica; permettere segnalazioni entro sette giorni dalla chiusura. Nessuna penalità individuale per un errore del valutatore.

## Stato tecnico

| Blocco | Stato | Note |
|---|---|---|
| P0: doppio riscatto delle missioni e guardie | **Implementato nel client** | verifica progressi, ID, giorno UTC, già riscosso, budget; manca autorità server |
| P0: serie settimanale contata due volte | **Corretto nel client** | incremento al raggiungimento dell'obiettivo, non al successivo reset |
| P1: formula XP e sottolimiti 60/40/20 | **Implementato nel client** | modulo `progression.js`; limiti locali non anti-manomissione |
| P1: ripassi 15 XP + 5 XP da settimana successiva | **Implementato nel client** | una sola volta per variante/settimana e massimo 60 XP |
| P1: importazioni legacy | **Compatibilità parziale** | XP storico preservato, nuovo stato `rewardsV2` serializzato; necessario ledger server |
| P2: gradi e icone SVG nel profilo | **Implementato** | fino al grado Leggenda; livelli illimitati |
| P3: Arena Classificata, sfide e verifica autorevole | **Demo locale e backend headless implementati nel repository; ufficiale non attiva** | 3 esercizi gratuiti con Godot WebAssembly; coordinatore Node 22 + Godot 4.4.1 headless containerizzato con casi riservati; SQL, Docker e Supabase non ancora distribuiti sul server |
| P4: classifiche globali/nazionali, Paese e stagioni | **UI e migration Supabase live; valutatore non distribuito** | `arena-official.js` legge cataloghi Supabase e RPC: globale/nazionale, Paese confermabile, invio al valutatore solo se configurato. Nessun dato inventato; migration e server ancora da distribuire |
| P4: pagamento e Archivio Premium chiuso | **UI chiusa e SQL preparato; billing non attivo** | nessun accesso gratuito ai vecchi task via RLS; niente contenuti di stagioni reali ancora pubblicati |

## Passi di implementazione successivi

1. Disegnare e distribuire nel progetto Supabase un ledger eventi/XP con tabelle isolate da RLS, funzioni idempotenti e migratore legacy. Nessun credito ufficiale deve accettare `xp` o esiti scritti dal browser.
2. Creare worker Godot 4.4.1 headless in container separato con limiti CPU/RAM/tempo, rete disabilitata, filesystem temporaneo e harness di test non esposto al client.
3. Pubblicare la prima stagione soltanto dopo test end-to-end contro falsificazioni, replay, doppie richieste e parità di punteggio; nessuna classifica fittizia.
4. Implementare la scelta Paese, il blocco mensile, graduatoria mondiale/nazionale, archivio Premium completamente chiuso e storico pubblico **senza codice**.
5. Automatizzare migrazione, rollback e verifiche mobile/desktop/tema prima di dichiarare completo GDScript Hero 2.0.

Per verificare l'attuale blocco, eseguire `node tests/progression_v2.test.cjs` e gli altri test nei workflow GitHub Actions. Questo documento non è un autorizzazione a distribuire i nuovi componenti server non ancora collaudati.

## Avanzamento valutatore headless (27 ottobre 2026)

Il codice in `server/arena/` introduce autenticazione tramite JWT Supabase, limitazione delle richieste, caricamento di test riservati dal server, esecuzione di singoli casi mediante Godot 4.4.1 in contenitori con rete disabilitata e risorse limitate, punteggio calcolato lato coordinatore e API RPC per accrediti idempotenti. Il valutatore non espone risultati attesi al browser e non salva il codice inviato nel database. **Non è ancora ospitato né collegato all'interfaccia pubblica** e non assegna punti reali finché non verrà collaudata l'infrastruttura Docker/Supabase. I test GitHub CI comprendono un'esecuzione headless reale di Godot e test di regressione del contratto server; non equivalgono a test di integrazione con Supabase o al build/avvio dell'immagine Docker.

Per deployment, audit e gestione segreti consultare `server/arena/README.md` e `docs/arena_backend.md`.

## Integrazione frontend ufficiale (27 ottobre 2026)

Il pannello `official-arena-workspace` fa parte della sezione Progetti e resta accessibile anche senza registrazione per consultare eventuali contenuti pubblici della stagione. In assenza della migrazione Supabase o del servizio attivo, comunica chiaramente che non esiste alcuna stagione classificate operativa. `arena-official.js` implementa il catalogo di sfide, una sola selezione Paese per stagione mediante RPC, due sole classifiche mondiale/nazionale, visualizzazione sicura dei nomi con `textContent`, salvataggio manuale di file `.gd` e sottomissione ufficiale solo dopo aver impostato l'endpoint HTTPS in `supabase-config.js`. La risposta di invio non accredita autonomamente XP locali: l'integrazione completa del ledger sul profilo è una fase aperta. Il Paese è suggerito da IP solo con un server fidato dietro Cloudflare; in caso contrario è selezionabile senza falso rilevamento.

**Dipendenze esterne non risolte nel solo GitHub:** applicare la migration e verificare RLS in Supabase; distribuire su un provider con Docker l'API e il valutatore, configurare i segreti soltanto nell'ambiente protetto, revisionare e creare fixture private, collaudare il contratto RPC e la concorrenza; successivamente integrare billing/Premium e avviare una stagione reale. Non considerare percentuali o scadenze fittizie come segno di completamento.

## Supabase live (27 ottobre 2026)

**Migrazione applicata al progetto reale `gdscript-hero`:** `gdh_competition_foundation_20261027`. Schema `gdh_private` e tabelle pubbliche `gdh_*` create correttamente. Verificato dopo migrazione: 4 profili e 4 salvataggi esistenti, invariati nel conteggio; **0 stagioni, 0 punteggi e 0 accrediti** (nessun contenuto ufficiale fittizio). Tutte le tabelle nuove sono in RLS.

**Permessi verificati sul database:** `anon` e `authenticated` non hanno privilegi `INSERT/UPDATE/DELETE` sulla tabella punteggi; `anon` non ha accesso allo schema privato; `anon` e `authenticated` non possono invocare `gdh_record_verified_verdict`; `service_role` sì. Si tratta di test di grant; restano necessari test RLS con JWT reali e test integrati del worker Docker.

**Stato pubblico:** le classifiche rimangono senza dati finché non si avvia una stagione reale. Non attivare `arenaApiBaseUrl` nel client finché il coordinatore Godot non sia stato distribuito, collaudato e protetto su HTTPS.

**Osservazioni dei consulenti di sicurezza Supabase:** sono presenti avvisi preesistenti su `public.admin_stats_overview` (vista security definer), `public.handle_new_user` (search_path/permessi) e protezione password compromesse disabilitata. Le nuove tabelle riservate senza policy SELECT sono **intenzionalmente chiuse**. I metodi RPC `SECURITY DEFINER` esposti con permessi ristretti vanno comunque verificati in audit.
