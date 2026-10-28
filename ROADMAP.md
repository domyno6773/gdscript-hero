# Roadmap di GDScript Hero

> **Aggiornata a ottobre 2026.** Questo documento distingue ciò che è già presente da idee e priorità. Non costituisce una promessa di rilascio né indica scadenze.

[Torna al README](README.md) · [Prova il sito](https://domyno6773.github.io/gdscript-hero/)

## Stato attuale

La piattaforma dispone già di:

- Corso principale gratuito in italiano: **15 capitoli, 60 lezioni**.
- Editor con evidenziazione GDScript, suggerimenti, verifica del codice e diagnostica.
- Sandbox con vista 2D e strumenti di scena.
- **Arena del Gladiatore**, primo progetto guidato giocabile ed esportabile.
- Ripasso con varianti, statistiche di apprendimento, XP, missioni e traguardi.
- Salvataggi locali, funzionalità di account/backup e integrazione Supabase.
- Interfaccia desktop/mobile con identità grafica ispirata all'editor Godot.

Sono presenti test automatici per validatori, salvataggi, browser e confronti nativi mirati. Questo non significa che tutti i comportamenti di Godot siano supportati dal runtime web.

## Sviluppo competitivo in pausa

Lo sviluppo dell'**Arena classificata**, delle **classifiche ufficiali** e del relativo backend è sospeso. Non sono in programma deploy o lavori sull'infrastruttura server: la priorità torna al corso gratuito, alle lezioni e all'esperienza d'uso. Il progetto didattico **Arena del Gladiatore** resta disponibile e non viene eliminato.

## Priorità adesso: consolidare, non ampliare

Questa è la fase più importante, prima di aggiungere funzionalità o lanciare un abbonamento.

1. **Stabilità:** correggere problemi reali di editor, validazione, navigazione e salvataggi senza perdere i progressi esistenti.
2. **Controllo didattico:** verificare chiarezza delle consegne, correttezza delle soluzioni e utilità dei messaggi di errore per tutte le 60 lezioni.
3. **Esperienza d'uso:** rifinire leggibilità, layout mobile, accessibilità e feedback della console; non cambiare la struttura della mappa senza una ragione.
4. **Affidabilità e sicurezza:** riesaminare sincronizzazione cloud, backup, policy RLS e limiti del runtime nel browser; le future autorizzazioni a pagamento richiederanno verifiche lato server.
5. **Feedback reale:** osservare come nuovi studenti usano corso, Sandbox e Arena, poi scegliere le modifiche in base ai problemi riscontrati.

Nessun nuovo sistema di pagamento è previsto in questa fase.

## Da valutare dopo il consolidamento

### Libreria di progetti

- Distinguere progetti **semplici** (un sistema specifico: inventario, dialoghi, movimento, ecc.) e **complessi** (esperienze guidate fino a un piccolo gioco completo).
- Per progetti complessi, preparare scene Godot, sprite, audio e file di supporto originali, con istruzioni interattive.
- Consentire l'esportazione dei lavori e l'utilizzo didattico offline dei materiali scaricati.
- Non presentare come disponibili le schede attualmente segnate come «prossimamente» o «in design».

### Possibile modello Premium

**Idea allo studio, non funzionalità attiva:**

- Il **corso principale rimane gratuito**.
- L'eventuale abbonamento può includere l'accesso alla libreria di progetti, ampliata nel tempo.
- Statistiche **avanzate**, ripasso **personalizzato** e ulteriori strumenti possono aggiungere valore al piano, senza rimuovere XP, progressi o funzionalità essenziali del corso.
- I progetti già scaricati dovrebbero restare consultabili e utilizzabili per imparare anche dopo la scadenza dell'abbonamento.
- I materiali forniti per l'apprendimento potranno avere licenze restrittive distinte dal codice scritto dallo studente.

**Prima di vendere qualsiasi abbonamento** saranno necessarie decisioni su prezzi e offerta, gestione degli account, permessi Premium verificati lato server, pagamenti, privacy, termini di servizio, diritto di recesso e licenze per codice e asset. Non verranno aggiunti semplici blocchi nel JavaScript client come misura di protezione.

### Licenza del repository

Il repository è pubblico ma **non ha ancora una licenza `LICENSE` esplicita**. Una futura decisione dovrà distinguere i permessi sul codice della piattaforma da quelli sugli asset distribuiti nei contenuti didattici. Non scegliere automaticamente una licenza permissiva per materiali che potrebbero richiedere condizioni differenti.

## Cosa non cambia

- La formazione di base deve rimanere accessibile gratuitamente.
- Il lavoro degli studenti, i loro progressi e il loro codice non devono essere persi per aggiornamenti o scadenze di un eventuale abbonamento.
- Le funzionalità annunciate non devono essere presentate come esistenti prima dell'implementazione.
- Le decisioni sul prodotto verranno prese gradualmente, evitando di introdurre troppi sistemi contemporaneamente.

---

Per proporre una modifica o segnalare un problema puoi utilizzare le [GitHub Issues](https://github.com/domyno6773/gdscript-hero/issues).
