# GDScript Hero — contratto didattico stabile (v4)

## Decisione di prodotto

Questo corso ha un percorso unitario: **16 capitoli, 85 lezioni pratiche, 30 quiz,
264 compiti**, mantenendo gli identificativi di tutte le attivita esistenti.
Le correzioni di contenuto devono essere valutate su tutto il percorso: non si
riscrive il corso quando una singola attivita e da chiarire.

L'obiettivo di uscita e saper leggere e modificare codice GDScript, comprendere
l'albero delle scene di Godot, utilizzare UI e segnali, realizzare un piccolo
gioco 2D e costruire strutture dati riutilizzabili. Non si promette che un
principiante sappia pubblicare da solo un gioco commerciale dopo il corso.

## Percorso e risultato tangibile

| Capitolo | Competenza valutata | Esercizio ponte |
| --- | --- | --- |
| 1 | Eseguire `_ready()`, commenti e `print()` | Terminale di avvio |
| 2 | Variabili, numeri, stringhe, conversione `str()` | Dialoghi dinamici |
| 3 | Nodi, gerarchie, `$`, Label, `add_child()` | Targhetta del dungeon |
| 4 | `float`, `bool`, tipizzazione, costanti e `:=` | Scheda eroe tipizzata |
| 5 | Formule, resto, assegnazioni e precedenza | Bottino e punti vita |
| 6 | Confronti, `and`, `or`, `if`, `elif`, `not` | Portale con condizioni |
| 7 | Funzioni, parametri, `return`, valori predefiniti | Calcolo del danno |
| 8 | Button, `pressed`, aggiornamento UI | Clicker interattivo |
| 9 | Vector2, distanze e direzioni | Radar e coordinate |
| 10 | Delta, input, collisioni, Area2D | Minigioco giocabile con moneta |
| 11 | Timer, ColorRect, `queue_free()`, aggiornamenti | Bottega interattiva |
| 12 | Array, indici, `append()`, `erase()`, `has()` | Gestione dati inventario |
| 13 | `for`, `while`, `break`, `continue` | Simulazione ondate |
| 14 | Dictionary, chiavi e `get()` | Statistiche boss |
| 15 | Segnali con e senza parametri | Eventi di battaglia |
| 16 | Classi, istanze, metodi e stato indipendente | Party RPG e laboratorio finale facoltativo |

La console non e un difetto nelle lezioni sulla sintassi. E invece necessario
usare la scena reale quando si insegna movimento, UI, segnali di nodi e fisica.

## Confini delle verifiche

1. Ogni esercizio ha un codice iniziale, un risultato osservabile e indizi.
2. I 152 compiti individuali hanno due dati: un valore visibile allo studente
   e un altro valore con cui Godot esegue una verifica comportamentale.
3. I quiz intermedi devono coprire **solo argomenti gia affrontati**. In
   particolare i quiz 203, 205, 207, 209, 211, 213, 215, 219, 225 e 226
   non anticipano booleani, inferenza, precedenza, blocchi condizionali,
   metodi Array, while/break, return, Dictionary.get o metodi dei nodi.
4. Il motore reale Godot esegue script, input e scene; una preview JavaScript
   non sostituisce la verifica nativa.
5. Uno starter incompleto non viene accettato; spiegazioni e commenti aggiunti
   dallo studente non devono provocare falsi errori.
6. Errori infrastrutturali non possono conferire XP o completare attivita.

## Sicurezza di progressi e contenuti

- Gli ID `1..60`, `101..121`, `201..230`, `301..304` sono immutabili.
- Le chiavi di compito (`base`, `p2`, `p3`, `p4`) restano quelle gia salvate.
- Le correzioni v4 riguardano spiegazioni, indicazioni, quiz e un progetto
  facoltativo: **non** cambiano le soluzioni ufficiali o i validatori.
- Non si azzerano XP, bozze o completamenti con la motivazione di aver migliorato
  una consegna; non si effettuano migrazioni per semplici modifiche editoriali.
- Il progetto finale si crea soltanto premendo il pulsante e compare come
  **nuovo** progetto nella Sandbox. Non sostituisce un progetto precedente,
  non assegna XP ed e un esercizio autonomo senza giudizio automatico.

## Come si approvano cambiamenti futuri

Prima di accettare un nuovo cambiamento di ordine o contenuto bisogna indicare:
problema verificato, competenza interessata, impatto sui prerequisiti,
attivita/quiz toccati, compatibilita dei dati salvati e prove native/browser.
Solo un difetto provato o una nuova capacita richiesta giustifica una
riscrittura. Le modifiche estetiche o l'impressione di maggiore varieta non
giustificano la sostituzione di esercizi corretti.

## Test obbligatori

- Contratto v4 (16 capitoli, 85 obiettivi individuali, copertura quiz,
  264 compiti e formato delle consegne).
- Prove pratiche di tutte le soluzioni e starter sul Godot Web nativo.
- Prove su variazione degli input e rifiuto di soluzioni hard-coded.
- Test di scena, UI e fisica, su desktop e mobile.
- Test regressione di bozze, progressi, XP e sincronizzazione.

## Verifiche riproducibili della versione finale

`node tests/curriculum_stable_v4.test.cjs` carica i file nello stesso ordine
di index.html, controlla i prerequisiti nelle 90 domande e confronta tutti
i 264 contratti dei compiti con la versione precedente: chiavi, starter,
soluzioni, risultati, requisiti e input variabili. Le 152 consegne individuali
devono specificare dati iniziali, risultato e dipendenza dal dato ricevuto.
Il test protegge anche gli indici delle risposte e la creazione di copie
indipendenti del progetto finale.

`node tests/capstone_browser.test.cjs` usa Chrome a 1280 e 390 pixel, preme
il pulsante reale, verifica che le bozze precedenti restino intatte ed esegue
starter e completamento nel Godot WASM. Controlla segnali reali, inventario,
raccolta, HP mai negativi e vittoria in entrambi gli ordini delle azioni.
Il progetto finale resta facoltativo e non assegna XP automaticamente.

Questi controlli sono obbligatori nelle workflow di regressione e browser.
Un vecchio test che pretendeva _process(delta) nella consegna 121 e stato
allineato all'esercizio effettivo: due chiamate manuali ad aggiorna(delta),
senza animazione continua. Codice e verifica della lezione non cambiano.

**Nota sulle garanzie:** i test automatici rilevano regressioni definite,
non dimostrano che ogni persona comprendera ogni testo. Le attivita didattiche
richiedono anche test di usabilita con persone reali.
