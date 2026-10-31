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
- Sono predisposte verifiche specifiche per 110 lezioni: 1–26 con requisiti statici e Godot; 27–30 con casi alternativi; 31–50 con input/calcoli/cicli; 51–61 con funzioni e FizzBuzz; 62–76 con array/sequenze; 77–89 con dizionari e registro spese; 90–100 con stringhe e match; 101–110 con pattern di dizionario, parser e matrici. Sono state eseguite prove positive/negative e test browser Godot sulle nuove soluzioni; NON è una certificazione di ogni soluzione alternativa possibile.

## Semantica richiesta
- Lezione 1 «Il linguaggio»: lo script stampa già `Ciao GDScript!`, senza richiedere di scrivere codice. Si procede con la verifica.
- Lezione 2 «Ciao mondo!»: lo script contiene `print("")`, quindi lo studente deve inserire `Ciao mondo!`.
- Lezione 3 «Commenti»: lo studente deve commentare e NON cancellare `print("Arrivederci!")`.
- Lezione 4 «Struttura di base di un programma»: lo starter contiene volutamente errori di sintassi/indentazione da correggere.

## Blocchi per una pubblicazione corretta
1. Il PDF fa uso di `OS.read_string_from_stdin()` in 165 lezioni. È stato aggiunto un canale di input testuale al browser (distinto dall'input delle azioni di gioco), ma servono ancora set di casi di prova didattici per quasi tutte queste lezioni.
2. Le lezioni 171–235 includono più file `.gd`. Ora hanno tab separati con bozze editabili; manca la compilazione nativa dell'intero progetto con classi globali, quindi la verifica non conferisce ancora XP.
3. I primi 110 esercizi hanno un validatore didattico predisposto, gli altri 125 non attribuiscono XP. Occorrono comunque verifiche native sistematiche, test positivi, negativi e casi alternativi per ciascuna attività prima del rilascio.
4. Le prove di regressione precedenti fanno riferimento a ID/consegne del corso vecchio: vanno aggiornate al nuovo corpus, non silenziate.
5. Progressione, obiettivi giornalieri, ripasso e achievement devono usare i nuovi ID e azioni prima della pubblicazione.
6. Ricontrollare le lezioni successive con starter tronchi o senza `extends Node`, perché il PDF non garantisce l'eseguibilità del frammento fuori dal contesto originario.
8. I casi con funzioni senza `_ready()` delle lezioni 105, 107, 109 sono eseguiti con harness Godot separati; la 108 usa invocazioni dirette e confronta array annidati per valore.
7. Le incongruenze note individuate tra lezioni 82 e 110 sono state corrette nel catalogo del sito (in particolare `arrow` / `freccia`, refuso `bombee`, messaggi inglesi per `match`, slug con «è», output delle matrici). La fonte PDF rimane conservata; non sono stati modificati gli identificatori tecnici.

## Gate di pubblicazione
- [x] Tutte le 235 lezioni importate senza omissioni.
- [x] 43 capitoli e ordine del PDF mantenuti.
- [x] Vecchio dataset rimosso dal ramo di migrazione.
- [x] Prima lezione predisposta per sola esecuzione, seconda per modifica di `print("")`.
- [x] Test automatici di integrità sul ramo.
- [x] Verificatori didattici 1–110 predisposti, esiti incompleti/non funzionanti bloccati.
- [ ] Validazione comportamentale di tutte le 235 attività in Godot.
- [ ] Input utente e varianti reali per le attività stdin.
- [ ] Supporto Godot nativo ai progetti multi-file.
- [ ] Regressioni browser, mobile, salvataggi e progressione superate.
- [ ] Pubblicazione su `main` e verifica GitHub Pages completate.

Non impostare `readyForRelease: true` finché tutti i gate non sono soddisfatti.
