# Audit del manuale GDScript: regressioni, progressi, salvataggi e runtime

Data: 2 novembre 2026. PR [#12](https://github.com/domyno6773/gdscript-hero/pull/12), ramo `manuale-235-lezioni`.

## Ambito

Completamento delle 235 lezioni; regressioni della migrazione; progressione e XP; bozze locali, backup e sincronizzazione cloud; ripasso; interfaccia mobile; caricamento Godot realmente multifile. Nessuna unione a `main` o modifica al sito pubblico.

## Problemi corretti

1. **I test caricavano il vecchio corso.** L'helper interpretava anche gli script commentati nell'HTML: `chapter_quizzes.js` interrompeva l'avvio con “Sequenza del capitolo non riconosciuta”. Ora l'helper legge gli script effettivamente attivi. Le prove legate a vecchi ID/consegne sono state riallineate al curriculum corrente; scene, gameplay, motore, account e cloud conservano i propri test isolati.
2. **I file visibili non erano risorse indipendenti.** Il vecchio adattatore univa gli script in classi annidate. Ora il runner monta risorse `.gd` distinte in un namespace per esecuzione e aggiorna il registro delle classi native. Il compilatore verifica tipi, ereditarietà e riferimenti incrociati originali, comprese le classi astratte di Godot 4.5. Le classi della precedente esecuzione non sono disponibili al nuovo progetto.
3. **Le bozze multifile non seguivano integralmente i salvataggi.** Tutti i file modificabili, il file selezionato e stdin sono inclusi nello stato dell'account, nel salvataggio locale, nel cloud e nel backup. I file protetti vengono recuperati dal corso. La fusione conserva modifiche indipendenti a file diversi; i conflitti sul medesimo file usano il flusso esistente di conservazione delle copie.
4. **Cambiare soltanto stdin poteva sovrascrivere il codice remoto.** I tempi delle modifiche sono ora distinti per file; l'aggiornamento del solo input non promuove gli starter a nuove versioni dei file.
5. **Completamenti sparsi e XP tra dispositivi.** I vecchi ID non promuovono le nuove lezioni; un completamento avanzato non completa i passaggi mancanti. Il percorso continua dalla prima attività non completata. Un registro stabile dei premi evita doppi XP e permette di sommare premi diversi ottenuti su due dispositivi senza perdere uno dei due.
6. **Traguardi ancora legati ai vecchi ID.** I 43 capitoli attuali e il corso completo hanno requisiti coerenti e premi idempotenti. Il primo script usa il nuovo ID. I traguardi storici restano nel salvataggio; i premi noti sono riconosciuti durante la migrazione, senza pagarli nuovamente. Gli XP dei traguardi diversi ottenuti su due dispositivi vengono conservati.
7. **Ripristino, soluzione e ripasso.** Ripristino agisce sul file selezionato. Le 235 soluzioni di riferimento riempiono i file modificabili. Il ripasso usa il verificatore Godot e bozze separate, non avanza il corso e non ripaga una prova già premiata nella settimana.
8. **Regressioni dell'interfaccia e del contenuto.** Ripristinata la guida del codice caricata dall'interfaccia; corretti i riepiloghi ancora fermi a 36 lezioni. Lezioni 72 e 93: accettate forme corrette equivalenti di split e padding. Corretti output e rientri degli esempi nelle lezioni 24 e 47. L’intestazione mostra il file effettivamente selezionato.
9. **Editor dopo importazione, cambio account e reset.** Il testo visibile non può sovrascrivere una bozza appena importata o passare a un altro account che apre lo stesso ID. Il reset completo cancella anche bozze, ripassi e registri dei premi, impedendo che l’editor precedente li ricrei.

## Prove automatiche

| Area | Prova e risultato |
| --- | --- |
| Curriculum completo | 235 soluzioni accettate da Godot 4.5.1 nativo, 2.113 scenari. 234 starter incompleti e 20 mutazioni compilabili respinti. Quattro alternative selezionate accettate. |
| Browser con motore reale | 235 soluzioni accettate da Godot WebAssembly in Chrome; 15 mutazioni finali respinte; risorse multifile reali confermate per 171–235. |
| Regressioni del corso | Struttura, contenuto, progressione in tutte le 236 posizioni, revisione, premi idempotenti, fusione degli XP, bozze e protezione degli script forniti. |
| Funzioni conservate | Test del motore, 65 soluzioni/96 esecuzioni native, gameplay con 4 soluzioni e 5 errori rifiutati, export Godot, laboratorio, Arena e coordinatore. |
| Salvataggi | Backup round-trip, reload, separazione degli account, fusione per file, modifiche al solo input, conflitti e revisioni CAS concorrenti. |
| Missioni e attività | Riscatti idempotenti, vecchi cloud, cambi di giornata, limiti settimanali di ripasso/streak e telemetria di successo. |
| Pack Godot | Esportazione riproducibile del pack con il nuovo loader. |
| Mobile e desktop | Chrome touch a 360, 390 e 820 px; WebKit touch a 390 px. Navigazione Chrome/WebKit a 23 larghezze, missioni in viewport basse e schermate allegate alla workflow Browser Smoke. |
| Loader indipendente | Quattro prove dedicate: preload tramite res://, percorso reale della risorsa, nuova versione della medesima classe e rifiuto di una classe rimasta soltanto nel progetto precedente. |

Le prove negative passano attraverso il validatore pubblico; gli errori comportamentali dei design pattern/progetti compilano, ma vengono rifiutati per il risultato o lo stato. Alcuni starter vengono correttamente respinti già dai controlli di struttura.

## Verifica sul database reale

È stata verificata l'implementazione corrente di `game_saves`, delle policy RLS e della RPC `gdh_cas_save_progress`. La RPC richiede un'identità autenticata e una revisione valida.

Una transazione di prova sul progetto Supabase del sito ha confermato:

- salvataggio e rilettura esatti di bozze multifile e registro XP;
- rifiuto di una revisione obsoleta;
- impossibilità di leggere o aggiornare il salvataggio di un altro proprietario con un JWT differente.

La transazione è stata annullata con `ROLLBACK`. Nessun avanzamento di un utente reale è stato conservato o sostituito. Non sono richieste migrazioni dello schema per questi campi JSON.

## Evidenze GitHub

Il checkpoint `c4255dc` ha **tutte le sette workflow verdi**, comprese mobile e WebKit:

- [Regressioni](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591418)
- [Practice / controlli comportamentali](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591543)
- [Curriculum completo in Godot WebAssembly](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591394)
- [Godot nativo, gameplay ed export](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591592)
- [Struttura, browser del manuale e progetti finali](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591529)
- [Browser mobile e navigazione Chrome/WebKit, con schermate](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591506)
- [Riproducibilità del pack](https://github.com/domyno6773/gdscript-hero/actions/runs/41371591411)

Le correzioni finali aggiungono controlli espliciti su traguardi, ripristino di backup a editor aperto, prima lezione dopo cambio account, reset completo e isolamento delle risorse. Le stesse workflow verificano automaticamente il nuovo head; gli esiti dell'ultima revisione sono collegati nella PR.

## Limiti delle prove e rilascio

- Sono verificate soluzioni di riferimento, casi limite e alternative selezionate, non tutte le soluzioni possibili.
- I browser mobile sono Chrome e WebKit con viewport e input touch simulati; non è una prova su un dispositivo iOS fisico.
- Il loader supporta i file GDScript del corso e i riferimenti `res://` tra tali file. Non è un importatore universale di progetti con scene, immagini, plugin o autoload arbitrari.
- Gli XP del corso rimangono progressione personale del client; questo audit non li trasforma in punteggi ufficiali certificati dal server.
- La PR resta in bozza e `readyForRelease` è `false`: il rilascio pubblico non fa parte delle modifiche eseguite.
