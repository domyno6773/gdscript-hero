# GDScript Hero — Verifica nativa Godot delle lezioni 25–36

Data: 26 ottobre 2026. Branch di prova: spike/godot-native-proof-20261026.

## Risultati riproducibili

GitHub Actions (Godot 4.4.1 WebAssembly in Chrome):
https://github.com/domyno6773/gdscript-hero/actions/runs/40262013034

Risultati **complessivi delle lezioni 1–36**:
- 36/36 soluzioni ufficiali compilate, eseguite e validate.
- 35/35 esempi non conformi intenzionali respinti.
- 24/24 alternative corrette accettate.
- Isolamento dell'iframe, navigazione con origine opaca e recupero dopo ciclo infinito ancora verificati.

La parte aggiunta (lezioni 25–36) comprende 12 soluzioni modello, 12 casi negativi e 10 varianti accettabili. Questi numeri descrivono una suite progettata a mano: NON certificano che il validatore sia completo o esente da falsi positivi.

## Funzionalità implementate

### Cicli (25–28)

Il validatore osserva l'output nativo e riesegue copie temporanee del programma:
- Lezione 25: estende temporaneamente range(3) a range(4) e richiede anche la stampa di 3.
- Lezione 26: sostituisce due nomi di nemici e controlla la stampa dinamica.
- Lezione 27: modifica il valore iniziale di conto a 2; il ciclo deve stampare soltanto 2 e 3.
- Lezione 28: sostituisce l'array con due nemici; l'XP finale deve essere 50, anziché 100.

### Funzioni e return (29–32)

Le lezioni 30–32 hanno una lista dichiarata di prove con parametri. Il runner chiama direttamente le funzioni dell'istanza Godot tramite Node.callv e osserva:
- saluta("Ada") e saluta("Viaggiatore"), con output coerente;
- calcola_danno(12,7) = 5 e calcola_danno(20,9) = 11;
- calcola_colpo(7,false)=7, calcola_colpo(7,true)=14, calcola_colpo(12,true)=24.

Queste prove respingono alcune implementazioni che restituiscono un valore fisso e verificano la firma tipizzata del colpo critico.

### Vector2 (33–36)

La cattura delle variabili locali serializza i Vector2 come oggetti JSON marcati da __type: "Vector2", x, y. Il validatore verifica così il tipo effettivo e le coordinate, evitando di fidarsi del solo output di print.

Per le lezioni 34 e 36 sono stati provati valori alternativi di velocita, posizione e stazione: una diversa destinazione deve produrre atterrato=false.

## Limitazioni e scelte

- Rimane un prototipo NON disponibile sul sito pubblico, senza collegamenti a Supabase, XP, abbonamenti o progresso.
- Il codice GDScript dello studente controlla il proprio ambiente, quindi i risultati non possono essere usati come attestazione attendibile o anti-manipolazione.
- Le condizioni sono validate tramite modifiche testuali controllate a semplici inizializzazioni. Non è un parser GDScript e può rifiutare soluzioni valide con espressioni o strutture più complesse.
- Le variabili locali sono catturate da una copia strumentata di _ready e non in modo generale per ogni funzione e blocco.
- Le prove di funzioni sono limitate a metodi con argomenti JSON primitivi. Nessuna prova generalizzata su metodi di Node, segnali, classi personalizzate o risorse.
- Nessuna prova eseguita su Safari/iOS o Android reali, memoria su dispositivo o rete lenta.
- Le anomalie note delle lezioni originali 4 e 6 restano nel dataset pubblico.

## File

- spikes/godot-web/host/lesson-lab.html — interfaccia sperimentale per 36 lezioni
- spikes/godot-web/host/lesson-fixtures.js — snapshot dei 36 esercizi
- spikes/godot-web/host/lesson-validation.js — validatori didattici dimostrativi
- spikes/godot-web/project/runner.gd — vero Godot con chiamate di metodo e telemetria Vector2
- spikes/godot-web/tests/native_lessons_25_36.cjs — test browser
- .github/workflows/godot-web-wasm.yml — CI

## Decisione

Prova di fattibilità positiva per 36 lezioni, **non approvazione alla migrazione in produzione**. I prossimi esercizi devono includere caratteristiche di nodi, segnali, classi o altre API del motore e richiedono prove più approfondite.

Nessuna modifica a main né al sito pubblico.
