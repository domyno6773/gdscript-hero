# GDScript Hero — Godot WebAssembly, lezioni 37–48

Data: 26 ottobre 2026. Branch: spike/godot-native-proof-20261026.

## Prove confermate

Workflow completo GitHub Actions:
https://github.com/domyno6773/gdscript-hero/actions/runs/40263356901

Verifiche complessive:
- 48/48 soluzioni ufficiali accettate dal vero Godot 4.4.1 WebAssembly.
- 47/47 esempi volutamente errati respinti.
- 36/36 varianti corrette accettate.
- Isolamento della pagina dal runner e recupero da ciclo infinito confermati nella CI Chrome.

Verifiche aggiunte in questa fase: 12 soluzioni, 12 esempi negativi, 12 alternative.

## Dizionari (37–40)

I dizionari vengono normalizzati in oggetti JSON strutturati. I controlli verificano chiavi e valori reali, aggiornamenti e metodi has(). Sono respinte soluzioni che stampano i valori richiesti ma omettono le operazioni sui dizionari.

## Segnali (41–44)

Per ogni esercizio viene controllata la dichiarazione del segnale, la connessione e l'emissione. Dopo l'esecuzione di _ready, Godot controlla la presenza del segnale e il numero di connessioni, lo emette nuovamente e il test accerta che il callback venga richiamato.

Per le prove inviate tramite JSON, alcuni numeri vengono interpretati come float; nella console il segnale della lezione 43 stampa 71.0 e il segnale della lezione 44 stampa 11.0. Questo è un dettaglio della prova aggiuntiva, non un errore delle soluzioni.

## Classi e istanze (45–48)

La strumentazione estrae le proprietà dichiarate negli oggetti creati in _ready (campi delle classi interne) e restituisce dati strutturati; non soltanto l'output console. I controlli verificano costruttori, proprietà di due istanze distinte e calcolo dei valori.

Nella lezione 47 il runner modifica il campo attacco dell'oggetto Personaggio ed esegue colpo_caricato() nuovamente; il metodo deve restituire 14 e 62 con i valori di prova. Le soluzioni con un valore fisso vengono respinte.

## Limitazioni

- I test non costituiscono una dimostrazione di completezza per ogni possibile codice GDScript.
- La cattura dei valori locali di _ready è ottenuta tramite una copia strumentata del codice. Non funziona universalmente con funzioni e rami complessi.
- I controlli didattici di tipo sintattico usano ancora espressioni regolari e potrebbero rifiutare soluzioni alternative valide.
- Oggetti, Array e Dictionary vengono serializzati con profondità e dimensioni massime limitate.
- Le prove sui segnali sono eseguite nella stessa istanza, dopo _ready: il testo visualizzato include l'ulteriore emissione del segnale di test.
- Il runner è controllabile dall'utente, pertanto gli output NON possono confermare in modo affidabile progressi cloud, XP, licenze o Premium.
- Non sono ancora stati testati Safari, iOS e Android reali.
- Le lezioni 4 e 6 contengono ancora incongruenze note nel dataset pubblico; anche il codice iniziale della lezione 39 differisce dalla sua consegna.

## Stato

Proof of concept funzionante per 48 delle 60 lezioni, non pronta per pubblicazione. Nessuna modifica al ramo main o al sito pubblico.
