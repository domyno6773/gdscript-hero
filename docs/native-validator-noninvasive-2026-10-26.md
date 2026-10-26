# GDScript Hero — Riduzione dell'iniezione nel grading didattico

Data: 26 ottobre 2026. Branch di lavoro: `spike/godot-native-proof-20261026`. Nessuna modifica al sito pubblico o a `main`.

## Scelta architetturale

Il runner Godot 4.4.1 compilato in WebAssembly continua a interpretare il GDScript originale. La validazione didattica non deve però riscrivere ogni programma per catturare valori locali quando la consegna già chiede un comportamento osservabile.

In questa iterazione è stato introdotto `GDHLessonLab.captureNames(id, source)`: alcune semplici forme di esercizio sono valutate mediante **output autentico del motore + controllo mirato del requisito scritto in GDScript**, senza la strumentazione che modifica il programma. Le soluzioni che usano espressioni diverse conservano il percorso di cattura opzionale; non vengono dichiarate sbagliate soltanto perché non corrispondono al contratto semplice.

### Prime quattro lezioni coperte

- **5**: una variabile `nome` contenente `"Eroe"` e stampata tramite `print(nome)`.
- **6**: due variabili `personaggio` e `punti_vita`, con valori iniziali espliciti, stampate attraverso le rispettive variabili.
- **9**: variabili di tipo float e bool inizializzate ai valori della consegna, e stampate come valori nativi.
- **13**: somma e prodotto espressi con le operazioni richieste, stampati mediante le variabili.

Il percorso diretto mantiene i controlli sintattici e di stdout, **non equivale ad analisi statica generale né a una verifica di data-flow**. È appropriato solo alle forme di soluzione elencate. Programmi arbitrari rimangono un problema aperto.

### Scenari di comportamento

Le prove che mutano gli input (`livello`, `nemici`, `velocita`, ecc.) ora eseguono **sempre il programma dello scenario senza catturare variabili locali inutilizzate nella verifica**. Gli scenari continuano a controllare `status`, `stderr`, output nativo e, dove previsto, stato della scena/proprietà. Questo evita un secondo livello di modifiche al codice proprio mentre vogliamo verificare un caso differente.

### Nuovi regressioni

La suite Chrome/Playwright su Godot WebAssembly verifica:
- output e valutazione corretti delle quattro soluzioni ufficiali senza cattura locale (`localCapture: not_requested`);
- lezione 5 con `nome` dentro un ramo `if true:` — codice valido e risultato diretto accettato, dove l'iniezione in precedenza falliva;
- lezione 5 con `return` dopo `print(nome)` — codice valido accettato senza raggiungere un punto di osservazione inventato;
- soluzione con `print("Eroe")` al posto di `print(nome)` **respinta**, nonostante una stampa apparentemente corretta;
- lezione 7 usata come controllo per il precedente percorso non osservabile: mantiene `verdict: inconclusive` quando il codice originale funziona ma la strumentazione non può vedere la variabile in scope.

## Limiti e conclusione

Questo intervento non elimina l'iniezione da tutte le 60 lezioni: **quattro esercizi modello** non ne hanno più bisogno, oltre agli scenari comportamentali che non richiedono osservazione. Restano da selezionare altri esercizi che si prestano a giudizi comportamentali nativi senza sacrificare il controllo didattico su metodi, tipi, dichiarazioni e operazioni.

Non è ancora un parser GDScript, né un sistema di grading affidabile contro uno studente che manipoli il browser. Nessun XP o progresso cloud viene affidato all'esito locale.

## Passaggi rimasti per la *fase validatori*

1. **Ampliare l'osservazione non invasiva dove sufficiente**, e mantenere esplicito `inconclusive` negli altri casi. Includere varianti con funzioni, scope, condizioni e collezioni, senza pretendere che regex equivalgano a una prova di programma.
2. **Matrice finale di mutazioni e falsi positivi/negativi sulle 60 lezioni**: soluzioni semanticamente diverse, scenari limite, console con errori, test degli esercizi non osservabili.
3. **Gate di chiusura della fase**: regressione completa del progetto, revisione delle anomalie 4/6/39/58 e specifica del risultato stabile del validatore. Questa chiusura non equivale alla pubblicazione del motore su `main`.

Il passo successivo *dopo* questa fase è separato: integrare Godot nella verifica ufficiale, sicurezza di XP/progressi, test su device e hosting.
