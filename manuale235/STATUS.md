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
- L'editor nel ramo di prova ora presenta tab `.gd`, i file da completare si aprono per primi e `main.gd` è protetto quando fornito.
- Il runner isolato accetta una coda di righe stdin distinta dai controlli di gioco; l'interfaccia consente un'anteprima senza XP.
- Le prime 170 lezioni (1–170) hanno verificatori dedicati. Le lezioni 111–115 esercitano dizionari annidati, classifiche, default, copie profonde e conteggio delle frequenze; 116–122 costruiscono progressivamente una rubrica; 123–128 esercitano insiemi e rimozione dei duplicati; 129–133 verificano enumerazioni, giorni, stati e semafori con più input; 134–140 costruiscono il registro studenti in fasi, comprese le verifiche su assenze, voti, iscrizioni e soglie. I test Playwright/Chrome con Godot WebAssembly hanno provato soluzioni corrette e casi alternativi selezionati. Questo non certifica tutte le possibili soluzioni.

## Semantica richiesta
- Lezione 1 «Il linguaggio»: lo script stampa già `Ciao GDScript!`, senza richiedere di scrivere codice. Si procede con la verifica.
- Lezione 2 «Ciao mondo!»: lo script contiene `print("")`, quindi lo studente deve inserire `Ciao mondo!`.
- Lezione 3 «Commenti»: lo studente deve commentare e NON cancellare `print("Arrivederci!")`.
- Lezione 4 «Struttura di base di un programma»: lo starter contiene volutamente errori di sintassi/indentazione da correggere.

## Blocchi per una pubblicazione corretta
1. Il PDF fa uso di `OS.read_string_from_stdin()` in 165 lezioni. È stato aggiunto un canale di input testuale al browser (distinto dall'input delle azioni di gioco), ma servono ancora set di casi di prova didattici per quasi tutte queste lezioni.
2. Le lezioni 171–235 includono più file `.gd`. Ora hanno tab separati con bozze editabili; manca la compilazione nativa dell'intero progetto con classi globali, quindi la verifica non conferisce ancora XP.
3. I primi 170 esercizi hanno un validatore didattico predisposto, gli altri 65 non attribuiscono XP. Occorrono comunque verifiche native sistematiche, test positivi, negativi e casi alternativi per ciascuna attività prima del rilascio.
4. Le prove di regressione precedenti fanno riferimento a ID/consegne del corso vecchio: vanno aggiornate al nuovo corpus, non silenziate.
5. Progressione, obiettivi giornalieri, ripasso e achievement devono usare i nuovi ID e azioni prima della pubblicazione.
6. Ricontrollare le lezioni successive con starter tronchi o senza `extends Node`, perché il PDF non garantisce l'eseguibilità del frammento fuori dal contesto originario.
8. I casi con funzioni senza `_ready()` delle lezioni 105, 107, 109, 115 e 128 vengono testati senza aggiungere obblighi allo studente: si usa un harness Godot temporaneo. Le chiamate native confrontano array per contenuto.
9. Sono stati riallineati nel catalogo i nomi dei prodotti della lezione 111, i default della 113, l'esempio troncato della 112 e l'output progressivo della rubrica. Il PDF originale non è stato sovrascritto.
7. Le incongruenze note individuate tra lezioni 82 e 110 sono state corrette nel catalogo del sito (in particolare `arrow` / `freccia`, refuso `bombee`, messaggi inglesi per `match`, slug con «è», output delle matrici). La fonte PDF rimane conservata; non sono stati modificati gli identificatori tecnici.

## Gate di pubblicazione
- [x] Tutte le 235 lezioni importate senza omissioni.
- [x] 43 capitoli e ordine del PDF mantenuti.
- [x] Vecchio dataset rimosso dal ramo di migrazione.
- [x] Prima lezione predisposta per sola esecuzione, seconda per modifica di `print("")`.
- [x] Test automatici di integrità sul ramo.
- [x] Verificatori didattici 1–170 predisposti, esiti incompleti/non funzionanti bloccati.
- [ ] Validazione comportamentale di tutte le 235 attività in Godot.
- [ ] Input utente e varianti reali per le attività stdin.
- [ ] Supporto Godot nativo ai progetti multi-file.
- [ ] Regressioni browser, mobile, salvataggi e progressione superate.
- [ ] Pubblicazione su `main` e verifica GitHub Pages completate.

Non impostare `readyForRelease: true` finché tutti i gate non sono soddisfatti.
