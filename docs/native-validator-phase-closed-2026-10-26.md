# GDScript Hero — Fase validatori Godot: CHIUSA (scope sperimentale)

**Decisione:** CHIUSA per la validazione del prototipo sperimentale, 26 ottobre 2026.

**Evidenza finale:** [GitHub Actions, run 40315194185](https://github.com/domyno6773/gdscript-hero/actions/runs/40315194185) — **completed / success**, con vera esportazione Godot 4.4.1 WebAssembly ed esecuzione in Chrome.

## Criteri di chiusura, ora soddisfatti

1. **60/60** soluzioni ufficiali eseguite dal vero Godot e approvate dai validatori del laboratorio.
2. **59/59** candidati negativi storici respinti, con ulteriori regressioni mirate per casi limite, errori dopo output apparentemente corretto e scorretti comportamenti con scenari differenti.
3. Alternative semantiche e sintattiche controllate per funzioni, classi, cicli, segnali e scene.
4. **12/12 alternative semanticamente diverse** per le scene native **49–60**, non soltanto commenti e spazi, passate nel run finale (`NATIVE_VALIDATOR_PHASE_SCENE_GATE_PASS`).
5. Errori introdotti dalla strumentazione differenziati dagli errori del GDScript originale. `inconclusive` per l'osservazione impossibile.
6. Feedback del laboratorio con esiti `accepted`, `requirements_not_met`, `invalid_code`, `inconclusive` e `timeout`; 60/60 soluzioni ufficiali verificate con `accepted` e `demoOnly: true`.
7. I materiali non coerenti delle lezioni 4, 6, 39, 58 allineati nel branch sperimentale e parità 60/60 con lo snapshot di test.
8. CI per iframe sandbox, loop/timeout, runner locale, scene native e integrazione diagnostica nel vero editor senza alterare XP/progressi.

## Significato rigoroso di «CHIUSA»

**Questa non è una certificazione che il sistema riconosca qualunque GDScript o che sia pronto a gestire progressi reali.**

Abbiamo finito lo **scope di prove necessario per passare alla fase successiva**, anziché inseguire indefinitamente una copertura impossibile da dimostrare con test finiti. Falsi positivi o negativi su programmi mai testati sono ancora possibili: eventuali bug specifici emersi nelle prove di integrazione verranno trattati nel contesto dell'integrazione, senza riaprire automaticamente la fase.

La maggior parte degli esercizi di scena 49–60 segue ancora contratti didattici specifici (inclusi controlli testuali); l'interprete Godot è autentico ma i **validatori sono codice sviluppato da noi**. Le prove dei Timer usano un'emissione di timeout simulata, non una vera attesa di 2,5 secondi; nessun test attesta tutte le combinazioni possibili. Molte lezioni non richiedono più iniezione, ma la cattura locale in altre rimane strumentata.

## Prossima fase, separata: INTEGRAZIONE E RILASCIO CONTROLLATO

Il prossimo lavoro non è «altri validatori». È portare il runner isolato nell'editor reale, dietro una feature flag reversibile e con fallback JS:

- adattatore sul pulsante **Verifica il codice** limitato inizialmente a sessioni di prova, senza assegnare XP o progressi fidandosi dei messaggi del browser;
- criteri tecnici di compatibilità, performance mobile, distribuzione WASM, URL HTTPS/origini e recupero timeout;
- definizione dell'autorità di XP e progressi lato server, evitando di considerarli attestati dai risultati client;
- release gate e rollback prima di qualsiasi merge in `main`.

**Non modificare `main` né il sito pubblico in questa fase.** Il branch `spike/godot-native-proof-20261026` conserva tutte le prove e le scelte architetturali.

## Nuova regola di gestione del lavoro

Non si riapre la fase «Qualità validatori» per miglioramenti generici o per nuovi casi inventati a posteriori. Un difetto riproducibile scoperto durante integrazione entra come bug della fase corrente, con test e correzione mirati. Questo evita una fase a durata indefinita.
