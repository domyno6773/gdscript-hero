# Migrazione del manuale italiano in GDScript Hero

Questo ramo NON è pronto per essere unito a `main`. Il sito pubblico non deve essere sostituito finché le verifiche non sono realmente funzionanti.

## Fonte e struttura
- Documento di origine: `GDScript_Manuale_Italiano_Revisionato.pdf` fornito nella conversazione.
- 235 lezioni in sequenza, titoli identici al manuale, 43 capitoli.
- Il vecchio array `LESSONS_DATA` di `lessons.js` è stato rimosso su questo ramo.
- `manuale235/data.js` contiene testo, consegna e sezioni `.gd` delle 235 lezioni.
- `manuale235/catalog.js` prepara i dati per l'interfaccia e conserva i file per l'evoluzione dell'editor.
- Gli ID interni delle nuove attività sono `10001…10235`: i progressi delle lezioni precedenti NON devono completare automaticamente attività diverse.
- Gli esempi iniziali dei primi otto esercizi sono stati ricostruiti dove il PDF aveva perso righe di codice nel passaggio editoriale.

## Semantica richiesta
- Lezione 1 «Il linguaggio»: lo script stampa già `Ciao GDScript!`, senza richiedere di scrivere codice. Si procede con la verifica.
- Lezione 2 «Ciao mondo!»: lo script contiene `print("")`, quindi lo studente deve inserire `Ciao mondo!`.
- Lezione 3 «Commenti»: lo studente deve commentare e NON cancellare `print("Arrivederci!")`.
- Lezione 4 «Struttura di base di un programma»: lo starter contiene volutamente errori di sintassi/indentazione da correggere.

## Blocchi per una pubblicazione corretta
1. Il PDF fa uso di `OS.read_string_from_stdin()` in circa 165 lezioni; l'editor web richiede una gestione dedicata di input e casi di prova. Il campo `input` del runner esistente è per azioni di gioco, non equivale a uno stdin ordinario.
2. Le lezioni 171–235 includono più file `.gd`; il motore corrente accetta uno script, non un progetto multi-file con classi globali. Occorrono editor per file, sincronizzazione e compilazione reale.
3. Solo le prime 8 attività hanno un validatore didattico predisposto (alcuni casi attendono prove native); le altre 227 non attribuiscono XP, per evitare falsi completamenti. Occorrono test positivi, negativi e almeno un caso alternativo per ciascuna.
4. Le prove di regressione precedenti fanno riferimento a ID/consegne del corso vecchio: vanno aggiornate al nuovo corpus, non silenziate.
5. Progressione, obiettivi giornalieri, ripasso e achievement devono usare i nuovi ID e azioni prima della pubblicazione.
6. Ricontrollare le lezioni con starter tronchi o senza `extends Node`, perché il PDF non garantisce l'eseguibilità del frammento fuori dal contesto originario.

## Gate di pubblicazione
- [x] Tutte le 235 lezioni importate senza omissioni.
- [x] 43 capitoli e ordine del PDF mantenuti.
- [x] Vecchio dataset rimosso dal ramo di migrazione.
- [x] Prima lezione predisposta per sola esecuzione, seconda per modifica di `print("")`.
- [x] Test automatici di integrità sul ramo.
- [ ] Validazione comportamentale di tutte le 235 attività in Godot.
- [ ] Input utente e varianti reali per le attività stdin.
- [ ] Supporto Godot nativo ai progetti multi-file.
- [ ] Regressioni browser, mobile, salvataggi e progressione superate.
- [ ] Pubblicazione su `main` e verifica GitHub Pages completate.

Non impostare `readyForRelease: true` finché tutti i gate non sono soddisfatti.
