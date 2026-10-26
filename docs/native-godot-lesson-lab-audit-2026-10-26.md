# GDScript Hero: Godot 4 WebAssembly — primi 12 esercizi

Data: 26 ottobre 2026. Branch sperimentale: spike/godot-native-proof-20261026.

## Risultati riprodotti

Workflow verificato: https://github.com/domyno6773/gdscript-hero/actions/runs/40260220871

- 12 soluzioni ufficiali su 12 accettate dal runtime Godot 4.4.1 WebAssembly.
- 11 bypass didattici intenzionali su 11 rifiutati.
- 6 soluzioni alternative corrette su 6 accettate.
- Lezioni 5–12: cattura dei valori locali di _ready riuscita su tutti gli esempi modello.
- Test di isolamento cross-origin e recupero dopo loop infinito superati in Chrome automatizzato.

Il prototipo è disponibile nella directory spikes/godot-web. La pagina dimostrativa è host/lesson-lab.html; il codice di validazione è host/lesson-validation.js e i dati delle lezioni sono uno snapshot del file lessons.js.

## Come vengono raccolte le variabili locali

Il vero Godot non espone automaticamente i valori delle variabili locali di una funzione, diversamente dall'interprete JavaScript precedente.

Per le lezioni 1–12 il runner compila prima lo script originale. Solo dopo prepara in memoria una seconda versione con una chiamata aggiunta alla fine di _ready(), per riportare i nomi richiesti. Esegue la versione strumentata se questa compila; altrimenti ripiega sullo script originale e segnala localCapture=unavailable, distinguendo i limiti dello strumento dagli errori del codice originale.

Questa è una soluzione di prova, non un parser universale: non gestisce in modo generale return anticipati, rami con scope differenti, classi locali, funzioni complesse e altre caratteristiche presenti nei capitoli successivi.

## Validazione didattica

Il validatore sperimentale controlla l'output effettivo di Godot, i valori delle variabili e requisiti sintattici che non si deducono dal solo output (ad esempio la tipizzazione di vita e l'operatore := per scudo_attivo). Sei varianti legittime mostrano che non richiede necessariamente una copia identica della soluzione ufficiale.

Il risultato del runner NON è attendibile come prova per assegnare XP, progresso cloud, accessi o diritti Premium. Il codice dell'allievo può interagire con il JavaScript nel proprio ambiente di esecuzione e falsificare i dati in uscita. È quindi solo feedback didattico locale.

## Incongruenze non ancora corrette nel dataset

- Lezione 4: il testo dell'output atteso contiene uno spazio fra 100 e %, ma il vero Godot non lo aggiunge.
- Lezione 6: codice iniziale e consegna chiedono di lavorare su variabili diverse.

Il laboratorio mostra queste differenze; il file lessons.js pubblico non è stato modificato.

## Mancano ancora

1. Test su Android e Safari/iOS reali, memoria e reti lente.
2. Integrazione robusta con esercizi che coinvolgono nodi, segnali, funzioni, classi e scene.
3. Una policy per distinguere gli errori del codice studente dagli errori dell'instrumentazione.
4. Una strategia di grading attendibile, qualora serva verificare lato server risultati che incidono su account/progressi.
5. Verifica di sincronizzazione fra snapshot delle lezioni e corso pubblico.

La versione pubblica e il branch main non sono stati modificati. Stato: prototipo riuscito per le prime 12 lezioni, non ancora pronto per produzione.
