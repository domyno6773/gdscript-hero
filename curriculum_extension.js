'use strict';
/*
 * Espansione curricolare 2026: esercizi integrati tra le lezioni standard e
 * l'esercizio di consolidamento di ciascun capitolo.
 * ID 101+ separati dai fixture nativi storici (61-63: ripassi scena).
 * Le verifiche eseguono esclusivamente Godot reale nel runner isolato.
 */
(() => {
  const EXTRA_LESSONS = [
  {
    "id": 101,
    "chapterId": 1,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "101. Script e sequenza di esecuzione",
    "icon": "code-2",
    "expectedOutput": "Avvio: OK\nControllo: OK",
    "theory": "<p><code>extends Node</code> indica la classe di base dello script: non è un'istruzione da ripetere a ogni avvio. Godot invoca <code>_ready()</code> quando il nodo entra nell'albero ed è pronto; le istruzioni in quel blocco vengono eseguite in ordine.</p><p>Due chiamate a <code>print()</code> producono due righe distinte. La prima riga del file descrive il nodo, mentre il contenuto di <code>_ready()</code> descrive cosa deve fare.</p>",
    "task": "<p>Distingui la dichiarazione dello script dalle istruzioni eseguite quando il nodo è pronto.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Completa il registro di avvio su due righe\n    pass\n",
    "solution": "extends Node\n\nfunc _ready():\n    print(\"Avvio: OK\")\n    print(\"Controllo: OK\")\n",
    "rules": [
      "\\bextends\\s+Node\\b",
      "\\bfunc\\s+_ready\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Individua il punto di ingresso: che differenza c'è tra dichiarare `extends Node` e scrivere istruzioni dentro `_ready()`?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Mantieni `extends Node` fuori dalle funzioni e inserisci due istruzioni di output, ciascuna su una riga indentata dentro `_ready()`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Per ottenere due righe in console servono due chiamate distinte a `print()`: prima il messaggio di avvio, poi quello di controllo."
      }
    ]
  },
  {
    "id": 102,
    "chapterId": 2,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "102. Convertire numeri in testo con str()",
    "icon": "code-2",
    "expectedOutput": "Crediti: 25",
    "theory": "<p>In GDScript <code>\"Crediti: \"</code> è una stringa, mentre <code>crediti</code> contiene un numero. Per unirli con <code>+</code> devi convertire il numero in testo usando <code>str(crediti)</code>.</p><p>Assegnare il risultato a una variabile come <code>rapporto</code> permette di riutilizzare la frase prima di mostrarla. È importante riferirsi alla variabile, non scrivere direttamente il numero atteso.</p>",
    "task": "<p>Mostra quanti crediti possiede il giocatore concatenando una stringa con un numero intero.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var crediti = 25\n    # Prepara la frase usando str() e stampala\n    pass\n",
    "solution": "func _ready():\n    var crediti = 25\n    var rapporto = \"Crediti: \" + str(crediti)\n    print(rapporto)\n",
    "rules": [
      "\\bstr\\s*\\(",
      "\\bvar\\s+rapporto\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Il valore `crediti` è un intero: quale funzione lo trasforma in testo prima della concatenazione?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Crea `rapporto` combinando il prefisso testuale con `str(crediti)`, poi passa quella variabile a `print()`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Il frammento `\"Crediti: \" + str(crediti)` produce una stringa dinamica: se i crediti cambiano, cambia anche il messaggio."
      }
    ]
  },
  {
    "id": 103,
    "chapterId": 3,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "103. Inferenza dei tipi con :=",
    "icon": "code-2",
    "expectedOutput": "Energia: 75\nAcceso: true",
    "theory": "<p>Con <code>var energia := 75</code> Godot deduce che il tipo è <code>int</code>; in seguito non potrai assegnare a quella variabile un valore di un tipo incompatibile. Un <code>bool</code> ha solo i valori <code>true</code> e <code>false</code>.</p><p>L'inferenza <code>:=</code> non è una normale assegnazione <code>=</code>: dichiara una variabile il cui tipo viene fissato a partire dal valore iniziale. Usala sia per il numero sia per lo stato acceso/spento.</p>",
    "task": "<p>Dichiara una quantità di energia usando l'inferenza statica e una variabile booleana che indica se il generatore è acceso.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    # Crea energia e acceso con inferenza statica, poi stampali\n    pass\n",
    "solution": "func _ready():\n    var energia := 75\n    var acceso := true\n    print(\"Energia: \", energia)\n    print(\"Acceso: \", acceso)\n",
    "rules": [
      "\\bvar\\s+energia\\s*:=",
      "\\bvar\\s+acceso\\s*:="
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Che cosa cambia fra `=` e `:=` quando stai dichiarando una variabile?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Dichiara `energia` con `:=` e un intero; dichiara `acceso` con `:=` e un booleano, poi stampa entrambi i valori."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Due esempi di inferenza sono `var vite := 3` e `var attivo := false`: il tipo viene dedotto dai valori iniziali."
      }
    ]
  },
  {
    "id": 104,
    "chapterId": 4,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "104. Precedenza e parentesi nelle formule",
    "icon": "code-2",
    "expectedOutput": "Totale: 40",
    "theory": "<p>La moltiplicazione ha precedenza sull'addizione, ma usare parentesi rende evidente il gruppo di operazioni che rappresenta il costo dei kit. La formula è <code>(costo_kit * quantita) + tassa</code>.</p><p>Le parentesi non devono servire solo a decorare il codice: devono racchiudere effettivamente una parte del calcolo. Il totale deve cambiare quando cambiano quantità, costo o tassa, quindi non scrivere direttamente 40.</p>",
    "task": "<p>Calcola il costo di tre kit da 12 monete più una tassa fissa di 4: applica le parentesi per rendere esplicito il ragionamento.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var costo_kit = 12\n    var quantita = 3\n    var tassa = 4\n    # Calcola totale e stampa \"Totale: ...\"\n    pass\n",
    "solution": "func _ready():\n    var costo_kit = 12\n    var quantita = 3\n    var tassa = 4\n    var totale = (costo_kit * quantita) + tassa\n    print(\"Totale: \", totale)\n",
    "rules": [
      "\\bvar\\s+totale\\b",
      "\\*",
      "\\+"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Prima calcola il costo di tutti i kit, poi aggiungi la tassa una sola volta."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Dichiara `totale` usando le variabili esistenti e racchiudi il prodotto tra parentesi prima di aggiungere `tassa`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "La struttura matematica è `(prezzo * numero_di_oggetti) + costo_fisso`. Verifica che le parentesi contengano la moltiplicazione."
      }
    ]
  },
  {
    "id": 105,
    "chapterId": 5,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "105. Più esiti con elif",
    "icon": "code-2",
    "expectedOutput": "Rango: B",
    "theory": "<p>In una catena <code>if / elif / else</code>, Godot sceglie il primo ramo la cui condizione è vera. Per i ranghi, conviene controllare prima la soglia più alta: almeno 90 per A, altrimenti almeno 60 per B, altrimenti C.</p><p><code>elif</code> non è un secondo <code>if</code> indipendente: viene valutato solo quando il controllo precedente non è passato. Controlla anche i valori ai confini delle soglie.</p>",
    "task": "<p>Un personaggio con 72 punti viene classificato come rango A, B o C. Assegna il rango usando tre rami condizionali.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var punti = 72\n    var rango = \"\"\n    # Determina rango A (>=90), B (>=60) o C\n    pass\n",
    "solution": "func _ready():\n    var punti = 72\n    var rango = \"\"\n    if punti >= 90:\n        rango = \"A\"\n    elif punti >= 60:\n        rango = \"B\"\n    else:\n        rango = \"C\"\n    print(\"Rango: \", rango)\n",
    "rules": [
      "\\belif\\b",
      "\\belse\\s*:"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Con 72 punti il rango A non vale: quale condizione deve provare il ramo `elif`?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Imposta `rango` nei tre rami esclusivi: `if` soglia alta, `elif` soglia media, `else` tutti gli altri casi."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Prova mentalmente 95, 72 e 35 punti: i risultati dovrebbero essere A, B e C, rispettivamente."
      }
    ]
  },
  {
    "id": 106,
    "chapterId": 5,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "106. Negazione logica e controlli di accesso",
    "icon": "code-2",
    "expectedOutput": "Portone aperto",
    "theory": "<p>L'operatore <code>not</code> inverte un valore booleano: <code>not false</code> è <code>true</code>. L'operatore <code>and</code> richiede che entrambe le condizioni siano vere.</p><p>Il portone può aprirsi soltanto se l'allarme è disattivato <em>e</em> il giocatore ha il lasciapassare. Un solo requisito non basta; il ramo <code>else</code> deve gestire tutti i casi negati.</p>",
    "task": "<p>Un portone deve aprirsi soltanto quando l'allarme non è attivo e il giocatore possiede il lasciapassare.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var allarme_attivo = false\n    var ha_pass = true\n    # Valuta l'accesso usando not, and, if/else\n    pass\n",
    "solution": "func _ready():\n    var allarme_attivo = false\n    var ha_pass = true\n    if not allarme_attivo and ha_pass:\n        print(\"Portone aperto\")\n    else:\n        print(\"Accesso negato\")\n",
    "rules": [
      "\\bnot\\b",
      "\\band\\b",
      "\\bif\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Il portone è aperto solo quando `allarme_attivo` è falso e `ha_pass` è vero."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Scrivi un `if` con `not allarme_attivo and ha_pass` e un `else` con il messaggio di accesso negato."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Cambia mentalmente l'allarme a `true` oppure il pass a `false`: in entrambi i casi l'accesso va rifiutato."
      }
    ]
  },
  {
    "id": 107,
    "chapterId": 6,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "107. Cercare e rimuovere un oggetto",
    "icon": "code-2",
    "expectedOutput": "Oggetti rimasti: 2",
    "theory": "<p><code>Array.has(valore)</code> cerca un elemento e restituisce un booleano; <code>Array.erase(valore)</code> ne rimuove la prima occorrenza; <code>Array.size()</code> restituisce il numero di elementi rimasti.</p><p>Controllare la presenza prima della rimozione evita di assumere che la chiave esista sempre. La dimensione va letta dall'array dopo l'operazione, non impostata con un numero fisso.</p>",
    "task": "<p>Prima di rimuovere una chiave dall'inventario, verifica che sia presente. Mostra poi quanti oggetti rimangono.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var zaino = [\"Torcia\", \"Chiave\", \"Mappa\"]\n    # Controlla la chiave, rimuovila e stampa la dimensione\n    pass\n",
    "solution": "func _ready():\n    var zaino = [\"Torcia\", \"Chiave\", \"Mappa\"]\n    if zaino.has(\"Chiave\"):\n        zaino.erase(\"Chiave\")\n    print(\"Oggetti rimasti: \", zaino.size())\n",
    "rules": [
      "\\.has\\s*\\(",
      "\\.erase\\s*\\(",
      "\\.size\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Prima di rimuovere la chiave, come puoi chiedere allo zaino se contiene l'elemento?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Usa `if zaino.has(\"Chiave\"):` e dentro il blocco rimuovila; poi stampa `zaino.size()`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Con tre oggetti e una chiave rimossa restano due elementi; senza chiave, invece, l'inventario deve rimanere intatto."
      }
    ]
  },
  {
    "id": 108,
    "chapterId": 6,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "108. Array tipizzati in GDScript 4",
    "icon": "code-2",
    "expectedOutput": "Ultimo punteggio: 30",
    "theory": "<p><code>Array[int]</code> è un array tipizzato: Godot controlla che i valori inseriti siano interi. Non è la stessa cosa di un array generico che inizialmente contiene numeri.</p><p>Con <code>append()</code> aggiungi un elemento in coda; puoi accedere all'ultimo tramite l'indice o, se preferisci, <code>back()</code>. Il valore mostrato deve provenire davvero dall'array.</p>",
    "task": "<p>Crea una lista di punteggi che possa contenere solo interi, aggiungi un punteggio e stampa il valore finale.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    # Definisci punteggi come Array[int] e aggiungi 30\n    pass\n",
    "solution": "func _ready():\n    var punteggi: Array[int] = [10, 20]\n    punteggi.append(30)\n    print(\"Ultimo punteggio: \", punteggi[2])\n",
    "rules": [
      "Array\\s*\\[\\s*int\\s*\\]",
      "\\.append\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Quale sintassi impone a Godot che tutti i punteggi dell'array siano di tipo `int`?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Dichiara un `Array[int]`, inserisci il terzo punteggio con `.append()` e leggi l'ultimo elemento."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Se inizi da `[10, 20]`, dopo `append(30)` l'elemento di indice 2 è 30. Attenzione: gli indici iniziano da zero."
      }
    ]
  },
  {
    "id": 109,
    "chapterId": 7,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "109. Interrompere un ciclo con break",
    "icon": "code-2",
    "expectedOutput": "Guasto individuato",
    "theory": "<p>Un ciclo <code>for</code> visita gli elementi uno alla volta. Quando trovi il primo elemento uguale a <code>\"GUASTO\"</code>, puoi registrare il problema e interrompere immediatamente il ciclo con <code>break</code>.</p><p><code>break</code> esce dall'intero ciclo, non soltanto dal blocco <code>if</code>. Senza <code>break</code>, più guasti potrebbero causare segnalazioni duplicate; se non ci sono guasti, non va segnalato nulla.</p>",
    "task": "<p>Scorri un elenco di controlli e interrompi la ricerca quando incontri il primo guasto.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var controlli = [\"OK\", \"OK\", \"GUASTO\", \"OK\"]\n    # Cerca il primo GUASTO e interrompi il ciclo\n    pass\n",
    "solution": "func _ready():\n    var controlli = [\"OK\", \"OK\", \"GUASTO\", \"OK\"]\n    for controllo in controlli:\n        if controllo == \"GUASTO\":\n            print(\"Guasto individuato\")\n            break\n",
    "rules": [
      "\\bfor\\b",
      "\\bif\\b",
      "\\bbreak\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Perché non dovresti continuare a scandire l'array dopo aver trovato il primo guasto?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Scorri `controlli` con `for`; dentro un `if` confronta l'elemento con `\"GUASTO\"`, registra l'evento e usa `break`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Prova un elenco con due guasti: il messaggio deve comparire una volta sola. Prova anche un elenco senza guasti."
      }
    ]
  },
  {
    "id": 110,
    "chapterId": 7,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "110. Saltare un elemento con continue",
    "icon": "code-2",
    "expectedOutput": "Ricompense: 35",
    "theory": "<p><code>continue</code> interrompe soltanto l'iterazione corrente di un ciclo: l'elemento successivo viene comunque elaborato. È diverso da <code>break</code>, che termina l'intero ciclo.</p><p>Qui i valori negativi rappresentano ricompense non valide. Devi saltarli prima della somma, mentre tutti gli altri premi contribuiscono al totale; funziona anche se i premi validi sono più di due.</p>",
    "task": "<p>Somma i punti di tre ricompense, ignorando quella contrassegnata come non valida.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var premi = [10, -1, 25]\n    var totale = 0\n    # Ignora premi negativi con continue e stampa il totale\n    pass\n",
    "solution": "func _ready():\n    var premi = [10, -1, 25]\n    var totale = 0\n    for premio in premi:\n        if premio < 0:\n            continue\n        totale += premio\n    print(\"Ricompense: \", totale)\n",
    "rules": [
      "\\bcontinue\\b",
      "\\bfor\\b",
      "\\bif\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Quale istruzione permette di ignorare un premio negativo senza fermare l'intera scansione?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Dentro un `for`, se `premio < 0` esegui `continue`; dopo l'`if` aggiungi solo i valori rimasti al totale."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Con `[10, -1, 25]` il risultato è 35; con `[6, -4, 18, 2]` deve diventare 26."
      }
    ]
  },
  {
    "id": 111,
    "chapterId": 8,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "111. Parametri con valori predefiniti",
    "icon": "code-2",
    "expectedOutput": "Senza difesa: 20\nCon difesa: 15",
    "theory": "<p>Un parametro predefinito come <code>difesa: int = 0</code> consente di chiamare <code>calcola_danno(20)</code> senza specificare la difesa. In una seconda chiamata puoi passare un valore esplicito, per esempio <code>calcola_danno(20, 5)</code>.</p><p>La funzione deve restituire un intero tramite <code>return</code>. Se la difesa supera l'attacco, usa <code>max(0, ...)</code> per evitare un danno negativo. Non calcolare soltanto i due casi mostrati.</p>",
    "task": "<p>Implementa una funzione che calcola il danno dopo una difesa opzionale. Deve funzionare sia con un solo argomento sia con due.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func calcola_danno(attacco: int, difesa: int = 0) -> int:\n    # Restituisci il danno evitando valori negativi\n    pass\n\nfunc _ready():\n    print(\"Senza difesa: \", calcola_danno(20))\n    print(\"Con difesa: \", calcola_danno(20, 5))\n",
    "solution": "func calcola_danno(attacco: int, difesa: int = 0) -> int:\n    return max(0, attacco - difesa)\n\nfunc _ready():\n    print(\"Senza difesa: \", calcola_danno(20))\n    print(\"Con difesa: \", calcola_danno(20, 5))\n",
    "rules": [
      "\\bfunc\\s+calcola_danno\\s*\\(",
      "\\breturn\\b",
      "\\bmax\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Qual è il valore di `difesa` quando chiami la funzione con un solo argomento?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Calcola la differenza tra attacco e difesa e limita il minimo a zero con `max()` prima di restituire il risultato."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Testa `calcola_danno(9)`, `calcola_danno(9, 4)` e `calcola_danno(7, 12)`: dovresti ottenere 9, 5 e 0."
      }
    ]
  },
  {
    "id": 112,
    "chapterId": 8,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "112. Variabili locali e risultato di una funzione",
    "icon": "code-2",
    "expectedOutput": "Da pagare: 38",
    "theory": "<p>Una variabile locale, come <code>prezzo_finale</code>, esiste soltanto nel corpo della funzione che la dichiara. Con <code>return</code> puoi consegnare il valore calcolato al codice chiamante.</p><p><code>print()</code> mostra un risultato, ma non lo restituisce alla funzione che ha effettuato la chiamata. Calcola il prezzo a partire dai parametri, in modo che la stessa funzione lavori anche con prezzi e sconti diversi.</p>",
    "task": "<p>Costruisci una funzione che calcola il prezzo finale applicando uno sconto; il risultato deve essere restituito al chiamante.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func applica_sconto(prezzo: int, sconto: int) -> int:\n    # Calcola prezzo_finale e restituiscilo\n    pass\n\nfunc _ready():\n    var risultato = applica_sconto(50, 12)\n    print(\"Da pagare: \", risultato)\n",
    "solution": "func applica_sconto(prezzo: int, sconto: int) -> int:\n    var prezzo_finale = prezzo - sconto\n    return prezzo_finale\n\nfunc _ready():\n    var risultato = applica_sconto(50, 12)\n    print(\"Da pagare: \", risultato)\n",
    "rules": [
      "\\bfunc\\s+applica_sconto\\b",
      "\\breturn\\s+prezzo_finale\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "In che modo il chiamante può usare il risultato di una funzione invece di ricevere soltanto un messaggio in console?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Crea la variabile locale `prezzo_finale` sottraendo `sconto` da `prezzo`, poi restituiscila con `return`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Con prezzo 50 e sconto 12 ottieni 38; con prezzo 95 e sconto 17 dovresti ottenere 78."
      }
    ]
  },
  {
    "id": 113,
    "chapterId": 9,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "113. Distanza tra due punti con Vector2",
    "icon": "code-2",
    "expectedOutput": "Attracco possibile: true",
    "theory": "<p>Un <code>Vector2</code> descrive un punto tramite le sue coordinate X e Y. Il metodo <code>distance_to()</code> misura la distanza geometrica tra due vettori, non solo la differenza su un asse.</p><p>Per verificare la possibilità di attracco, confronta la distanza con il limite di 5 unità. I punti (0, 0) e (3, 4) distano esattamente 5, quindi il controllo deve includere anche il valore limite.</p>",
    "task": "<p>Verifica se una navicella è entro cinque unità dalla stazione, usando la distanza effettiva tra le coordinate.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var nave = Vector2(0, 0)\n    var stazione = Vector2(3, 4)\n    # Controlla la distanza con distance_to e stampa il risultato\n    pass\n",
    "solution": "func _ready():\n    var nave = Vector2(0, 0)\n    var stazione = Vector2(3, 4)\n    var vicino = nave.distance_to(stazione) <= 5.0\n    print(\"Attracco possibile: \", vicino)\n",
    "rules": [
      "\\.distance_to\\s*\\(",
      "Vector2\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Perché confrontare solo X o solo Y non basta a stabilire se la navicella è vicina?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Calcola `nave.distance_to(stazione)` e confronta il risultato con `<= 5.0`, poi stampa un booleano."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Tra (0,0) e (3,4) la distanza è 5: attracco possibile. Tra (0,0) e (10,3) è maggiore di 5."
      }
    ]
  },
  {
    "id": 114,
    "chapterId": 9,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "114. Direzioni normalizzate",
    "icon": "code-2",
    "expectedOutput": "Direzione unitaria: true",
    "theory": "<p><code>Vector2.normalized()</code> restituisce un vettore con la stessa direzione e lunghezza 1, quando la lunghezza originale è diversa da zero. È utile per applicare velocità costanti indipendentemente dalla distanza.</p><p>Con i numeri decimali, confronta le misure con <code>is_equal_approx()</code> perché gli arrotondamenti possono rendere poco affidabile <code>==</code>. Il vettore nullo resta nullo dopo la normalizzazione.</p>",
    "task": "<p>Ottieni la direzione dalla navicella all'obiettivo e verifica che il vettore risultante abbia lunghezza unitaria.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    # Normalizza Vector2(3,4) e verifica la sua lunghezza\n    pass\n",
    "solution": "func _ready():\n    var direzione = Vector2(3, 4).normalized()\n    var corretta = is_equal_approx(direzione.length(), 1.0)\n    print(\"Direzione unitaria: \", corretta)\n",
    "rules": [
      "\\.normalized\\s*\\(",
      "\\.length\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Che cosa deve restare invariato dopo la normalizzazione e quale proprietà deve diventare 1?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Costruisci un `Vector2`, applica `.normalized()`, poi verifica la sua `.length()` con `is_equal_approx()`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Il vettore (3,4) ha lunghezza 5 e normalizzato diventa unitario; il vettore (0,0) non può avere lunghezza 1."
      }
    ]
  },
  {
    "id": 115,
    "chapterId": 10,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "115. Valori mancanti con Dictionary.get()",
    "icon": "code-2",
    "expectedOutput": "Scudo: 0",
    "theory": "<p>Un dizionario associa chiavi a valori. Accedere direttamente a una chiave assente può causare problemi; <code>get(\"scudo\", 0)</code> restituisce il valore se presente, altrimenti 0.</p><p>Il secondo argomento di <code>get()</code> è il valore predefinito, non un valore da scrivere nel dizionario. Il codice deve funzionare sia quando il nemico non ha uno scudo sia quando dispone di uno scudo diverso da zero.</p>",
    "task": "<p>Leggi in sicurezza una statistica opzionale dal dizionario di un nemico, fornendo un valore predefinito se non esiste.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "func _ready():\n    var nemico = {\"nome\": \"Slime\", \"hp\": 20}\n    # Ricava scudo con get e stampa il valore\n    pass\n",
    "solution": "func _ready():\n    var nemico = {\"nome\": \"Slime\", \"hp\": 20}\n    var scudo = nemico.get(\"scudo\", 0)\n    print(\"Scudo: \", scudo)\n",
    "rules": [
      "\\.get\\s*\\(",
      "\\bvar\\s+scudo\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Come puoi leggere una proprietà facoltativa senza assumere che esista sempre?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Usa il metodo `.get()` del dizionario `nemico` passando la chiave `\"scudo\"` e il valore predefinito 0."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Senza la chiave `scudo` ottieni 0; se il dizionario contiene `\"scudo\": 18`, devi ottenere 18."
      }
    ]
  },
  {
    "id": 116,
    "chapterId": 11,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "116. Ricevere e reagire a un evento",
    "icon": "code-2",
    "expectedOutput": "Allarme: 3",
    "theory": "<p>Un segnale comunica che un evento è avvenuto senza obbligare il mittente a chiamare direttamente il ricevente. <code>connect()</code> registra la funzione da richiamare, mentre <code>emit()</code> invia l'evento.</p><p>Il parametro del segnale viene passato alla funzione collegata. La callback deve utilizzare quel parametro: se emetti un livello 7 anziché 3, anche il testo dell'allarme deve aggiornarsi.</p>",
    "task": "<p>Un avviso di battaglia deve essere ascoltato da una funzione che registra il livello di pericolo.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\nsignal pericolo(livello)\n\nfunc registra_allarme(livello):\n    # Stampa \"Allarme: \" e il livello\n    pass\n\nfunc _ready():\n    # Collega il segnale alla funzione e invia il livello 3\n    pass\n",
    "solution": "extends Node\nsignal pericolo(livello)\n\nfunc registra_allarme(livello):\n    print(\"Allarme: \", livello)\n\nfunc _ready():\n    pericolo.connect(registra_allarme)\n    pericolo.emit(3)\n",
    "rules": [
      "\\bsignal\\s+pericolo\\s*\\(",
      "\\.connect\\s*\\(",
      "\\.emit\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Che differenza c'è tra registrare un ascoltatore e inviare effettivamente un evento?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Collega `pericolo` a `registra_allarme` con `.connect()`, poi invia il livello con `.emit()`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "La callback `registra_allarme(livello)` deve stampare il parametro ricevuto; prova a immaginare l'emissione con 7."
      }
    ]
  },
  {
    "id": 117,
    "chapterId": 12,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "117. Metodi tipizzati e responsabilità delle classi",
    "icon": "code-2",
    "expectedOutput": "Danno: 15",
    "theory": "<p>Una classe riunisce dati e metodi. La classe <code>Arma</code> conserva due attributi numerici e può esporre un metodo <code>danno_totale() -> int</code> per calcolare la loro somma.</p><p>Il metodo deve leggere lo stato dell'istanza su cui viene chiamato e restituire il risultato senza modificare <code>base</code> e <code>bonus</code>. Un'altra arma con valori diversi deve produrre un altro danno.</p>",
    "task": "<p>Crea una classe statistica con un metodo che restituisca il danno totale senza modificare gli attributi originali.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\nclass Arma:\n    var base: int = 12\n    var bonus: int = 3\n\n    # Aggiungi un metodo tipizzato danno_totale()\n\nfunc _ready():\n    var arma = Arma.new()\n    print(\"Danno: \", arma.danno_totale())\n",
    "solution": "extends Node\nclass Arma:\n    var base: int = 12\n    var bonus: int = 3\n\n    func danno_totale() -> int:\n        return base + bonus\n\nfunc _ready():\n    var arma = Arma.new()\n    print(\"Danno: \", arma.danno_totale())\n",
    "rules": [
      "\\bclass\\s+Arma\\s*:",
      "\\bfunc\\s+danno_totale\\s*\\(",
      "\\breturn\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Perché è preferibile un metodo che calcola il danno dai campi dell'istanza invece di restituire sempre 15?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "All'interno di `class Arma`, dichiara `danno_totale() -> int` e restituisci la somma degli attributi."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Con base=12 e bonus=3 il danno è 15; con base=5 e bonus=8 il metodo deve restituire 13."
      }
    ]
  },
  {
    "id": 118,
    "chapterId": 12,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "118. Stato indipendente delle istanze",
    "icon": "code-2",
    "expectedOutput": "A: 2\nB: 0",
    "theory": "<p>Le istanze di una classe hanno stato indipendente: due oggetti <code>Contatore.new()</code> non condividono automaticamente il campo <code>valore</code>. Un metodo può modificare il campo dell'istanza su cui viene invocato.</p><p>Il metodo <code>aggiungi()</code> deve incrementare <code>valore</code> di una unità a ogni chiamata. Eseguire due chiamate su <code>a</code> non deve cambiare <code>b</code>.</p>",
    "task": "<p>Crea due contatori indipendenti: modificare il primo non deve cambiare il secondo.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\nclass Contatore:\n    var valore: int = 0\n\n    func aggiungi() -> void:\n        # Incrementa il valore di questa istanza\n        pass\n\nfunc _ready():\n    var a = Contatore.new()\n    var b = Contatore.new()\n    a.aggiungi()\n    a.aggiungi()\n    print(\"A: \", a.valore)\n    print(\"B: \", b.valore)\n",
    "solution": "extends Node\nclass Contatore:\n    var valore: int = 0\n\n    func aggiungi() -> void:\n        valore += 1\n\nfunc _ready():\n    var a = Contatore.new()\n    var b = Contatore.new()\n    a.aggiungi()\n    a.aggiungi()\n    print(\"A: \", a.valore)\n    print(\"B: \", b.valore)\n",
    "rules": [
      "\\bclass\\s+Contatore\\b",
      "\\.new\\s*\\(",
      "\\bfunc\\s+aggiungi\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Che differenza c'è tra un campo appartenente a ciascun oggetto e una variabile globale condivisa?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Nel metodo `aggiungi()`, modifica `valore` dell'istanza corrente; il codice di `_ready()` crea già `a` e `b`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Due invocazioni di `a.aggiungi()` portano A a 2 e lasciano B a 0. Un terzo contatore appena creato deve partire da 0."
      }
    ]
  },
  {
    "id": 119,
    "chapterId": 13,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "119. Aggiungere un figlio alla scena",
    "icon": "code-2",
    "expectedOutput": "Compagno presente: true",
    "theory": "<p>Un nodo creato con <code>Node.new()</code> esiste in memoria, ma non appartiene automaticamente all'albero della scena. <code>add_child()</code> lo inserisce tra i figli del nodo corrente.</p><p>Per cercarlo tramite <code>has_node(\"Compagno\")</code>, prima assegna al nodo il nome desiderato. Il controllo deve riflettere la presenza reale del figlio, non limitarsi a stampare il testo <code>true</code>.</p>",
    "task": "<p>Crea da codice un nodo figlio e controlla la sua presenza nell'albero della scena prima di accedervi.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Crea il nodo Compagno, aggiungilo come figlio e verificane la presenza\n    pass\n",
    "solution": "extends Node\n\nfunc _ready():\n    var compagno = Node.new()\n    compagno.name = \"Compagno\"\n    add_child(compagno)\n    print(\"Compagno presente: \", has_node(\"Compagno\"))\n",
    "rules": [
      "\\bNode\\.new\\s*\\(",
      "\\badd_child\\s*\\(",
      "\\bhas_node\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Creare un nodo significa che è già presente tra i figli della scena?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Crea il nodo, assegnagli il nome `Compagno`, aggiungilo con `add_child()` e solo dopo controlla `has_node()`."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "`has_node(\"Compagno\")` è vero soltanto se il percorso del figlio esiste davvero dopo l'aggiunta."
      }
    ]
  },
  {
    "id": 120,
    "chapterId": 14,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "120. Creare e collegare un pulsante via script",
    "icon": "code-2",
    "expectedOutput": "Avvio confermato",
    "theory": "<p><code>Button</code> è un tipo di nodo interfaccia che emette il segnale <code>pressed</code> quando viene premuto. Collegando <code>pressed</code> a una funzione puoi separare la logica del clic dal codice che costruisce l'interfaccia.</p><p>In questo esercizio simuli la pressione usando <code>pressed.emit()</code>. Per ottenere il messaggio, il pulsante deve essere creato, aggiunto alla scena e correttamente collegato alla callback.</p>",
    "task": "<p>Crea un pulsante Godot, collega il suo segnale pressed e simula una pressione che invia un messaggio.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\n\nfunc pulsante_premuto():\n    print(\"Avvio confermato\")\n\nfunc _ready():\n    # Crea Button, collega pressed e simula l'evento\n    pass\n",
    "solution": "extends Node\n\nfunc pulsante_premuto():\n    print(\"Avvio confermato\")\n\nfunc _ready():\n    var pulsante = Button.new()\n    add_child(pulsante)\n    pulsante.pressed.connect(pulsante_premuto)\n    pulsante.pressed.emit()\n",
    "rules": [
      "\\bButton\\.new\\s*\\(",
      "\\.pressed\\.connect\\s*\\(",
      "\\.pressed\\.emit\\s*\\("
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "Chi deve produrre il messaggio: direttamente `_ready()` o la funzione collegata al segnale del pulsante?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Crea un `Button`, aggiungilo come figlio, collega `pressed` a `pulsante_premuto` e invia il segnale."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "La catena è creazione → `add_child()` → `pressed.connect(...)` → `pressed.emit()`: invertire le ultime due operazioni non richiama la callback."
      }
    ]
  },
  {
    "id": 121,
    "chapterId": 15,
    "isMastery": false,
    "isSupplemental": true,
    "isConsolidation": false,
    "xp": 60,
    "title": "121. Una funzione di aggiornamento per ogni frame",
    "icon": "code-2",
    "expectedOutput": "Posizione finale: 10.0",
    "theory": "<p><code>delta</code> misura quanti secondi sono trascorsi tra aggiornamenti. Per un movimento a velocità costante la formula è <code>incremento = velocità * delta</code>.</p><p>Qui simuli due aggiornamenti da mezzo secondo chiamando <code>aggiorna(0.5)</code> due volte; non stai ancora collegando la funzione a <code>_process(delta)</code>. Il metodo deve funzionare anche con intervalli differenti, non soltanto con due chiamate da 0,5.</p>",
    "task": "<p>Simula due aggiornamenti di gioco passando un delta in secondi; distingui il tempo trascorso dal numero di frame.</p><p>Scrivi il codice per ottenere il comportamento richiesto, non limitarti a stampare una risposta preconfezionata.</p>",
    "initialCode": "extends Node\nvar posizione = 0.0\n\nfunc aggiorna(delta: float) -> void:\n    # Aggiorna posizione con velocità 10.0 per secondo\n    pass\n\nfunc _ready():\n    aggiorna(0.5)\n    aggiorna(0.5)\n    print(\"Posizione finale: \", posizione)\n",
    "solution": "extends Node\nvar posizione = 0.0\n\nfunc aggiorna(delta: float) -> void:\n    posizione += 10.0 * delta\n\nfunc _ready():\n    aggiorna(0.5)\n    aggiorna(0.5)\n    print(\"Posizione finale: \", posizione)\n",
    "rules": [
      "\\bfunc\\s+aggiorna\\s*\\(",
      "\\bdelta\\b",
      "\\*\\s*delta\\b"
    ],
    "hints": [
      {
        "level": 1,
        "type": "concept",
        "icon": "lightbulb",
        "label": "Ragionamento",
        "text": "A velocità 10 unità/secondo, di quanto cambia la posizione durante un aggiornamento di 0,5 secondi?"
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Dentro `aggiorna(delta)`, aumenta `posizione` di `10.0 * delta`, senza sovrascrivere il valore precedente."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Due aggiornamenti da 0,5 secondi fanno avanzare di 10 unità; un successivo aggiornamento da 0,2 deve portare la posizione a 12."
      }
    ]
  }
];
  const CONSOLIDATION_BRIEFS = {
  "4": [
    "Diagnostica di bordo",
    "Completa la sequenza di avvio della navetta: tra il messaggio iniziale e quello finale devono comparire il sistema operativo «Sistema: Godot OS» e il livello energia «Energia: 100%». Mantieni le stampe già presenti; i commenti sono facoltativi.",
    "Metti insieme output ordinato, testi e valori multipli, senza riscrivere l'intero programma."
  ],
  "8": [
    "Il messaggio nascosto",
    "Il sistema deve memorizzare tre valori testuali: il titolo The \"Lost\" Key, la battuta It's dangerous to go alone! e il codice di accesso 0420 (con lo zero iniziale). Usa le variabili title, npc_line e door_code: le stampe finali sono già pronte.",
    "Scegli correttamente i delimitatori delle stringhe e non trasformare il codice della porta in un numero."
  ],
  "12": [
    "La scheda del personaggio",
    "Prepara una scheda verificabile: costante globale MAX_HP intera a 200, nome eroe «Valerius» tipizzato String, salute intera 150 e scudo_attivo vero con tipo inferito tramite :=. Il report esistente deve leggere i tuoi valori.",
    "Combina costanti, tipi espliciti e inferenza senza modificare le righe del report."
  ],
  "16": [
    "Bottino dopo lo scontro",
    "Un combattente parte con 100 punti vita e subisce 35 danni. Tre compagni devono inoltre dividersi 100 monete: ciascuno riceve la propria quota intera e le monete avanzate restano nel forziere. Completa salute_rimasta, monete_per_membro e monete_avanzate, conservando le stampe di fine missione.",
    "Usa una sottrazione rapida e distingui divisione intera e resto."
  ],
  "20": [
    "Il portale antico",
    "Il portale si attiva quando l'energia è almeno 50 e il personaggio possiede una chiave o un amuleto. Se non ha abbastanza energia, lo stato deve essere «Energia Insufficiente»; negli altri casi «Nessuna Reliquia Trovata». Assegna stato_portale mediante if, elif ed else.",
    "Scegli l'ordine dei controlli affinché ogni risultato corrisponda davvero allo stato del personaggio."
  ],
  "24": [
    "Equipaggiamento per la partenza",
    "Lo zaino contiene Spada, Ramo Secco e Pozione di Vita. Prima della spedizione l'eroe raccoglie un Arco Elfico e scarta il Ramo Secco. Registra con ha_cura se rimane una Pozione di Vita e con totale_slot il numero degli oggetti restanti.",
    "Combina ricerca, aggiunta, rimozione e conteggio in un singolo problema."
  ],
  "28": [
    "Allerta delle ondate",
    "L'arena deve annunciare ogni nemico della lista nemici e attribuire 25 XP per avvistamento. Produci i messaggi «Allerta: ...» durante la scansione e accumula l'esperienza in xp_totali, inizialmente zero. Il report finale è già presente.",
    "La stessa procedura deve funzionare con elenchi di lunghezza diversa."
  ],
  "32": [
    "Calcolo del colpo",
    "Il sistema di combattimento richiede una funzione calcola_colpo(attacco: int, critico: bool) -> int: capace di restituire il danno normale o il doppio in caso di colpo critico. Le verifiche di attacco nella funzione _ready() sono già presenti.",
    "Scrivi una funzione riutilizzabile, non una stampa codificata per un solo danno."
  ],
  "36": [
    "Rotta verso la stazione",
    "La sonda parte da Vector2(100, 200), si muove di +50 sull'asse X e -30 sull'asse Y e deve capire se coincide con la stazione a Vector2(150, 170). Memorizza la conclusione in atterrato confrontando entrambe le coordinate.",
    "Verifica la posizione dopo la modifica e non basarti soltanto su valori stampati."
  ],
  "40": [
    "Analisi del boss",
    "Registra il Drago Antico in un dizionario boss con 500 HP iniziali; aggiungi un attacco pari a 75 e aggiorna i punti vita a 420 dopo lo scontro. Il flag in_furia deve indicare se esiste la proprietà opzionale furia.",
    "L'aggiornamento dello stato non deve perdere i dati originali del boss."
  ],
  "44": [
    "Eventi di battaglia",
    "La UI deve reagire ai cambiamenti di salute tramite il segnale salute_aggiornata(nuova_salute). Definisci quando_salute_cambia(hp) per stampare il nuovo valore, collega il segnale e invia gli aggiornamenti 75 e 40.",
    "La callback deve usare il parametro ricevuto, così potrà gestire anche altri valori."
  ],
  "48": [
    "Un party di due avventurieri",
    "Definisci la classe Avventuriero con nome, ruolo e vita, e un costruttore che riceva questi dati. Crea Aria (Maga, 80 HP) e Krag (Guerriero, 120 HP), quindi calcola la salute complessiva in vita_totale.",
    "Ogni istanza deve conservare i propri dati: la somma nasce dalle proprietà dei due oggetti."
  ],
  "52": [
    "La targhetta del dungeon",
    "Nella scena trovi tre Label esistenti. Il titolo deve diventare «Caverna dei Goblin», il livello «Livello: 1» e il denaro «Oro: 50». Aggiorna i nodi TitoloDungeon, LivelloLabel e MoneteLabel e lascia attivo il report già predisposto.",
    "Applica lo stesso meccanismo a nodi diversi dell'albero senza creare nuove etichette."
  ],
  "56": [
    "Plancia dell'astronave",
    "Il pulsante MotoriBtn deve richiamare attiva_motori, aggiornare StatoNave a «Motori a Massima Potenza» e stampare «Velocita Aumentata». AllarmeBtn deve invece richiamare attiva_allarme, mostrare «Allarme Attivato» e stampare «Sistemi di Difesa Online».",
    "I due pulsanti non devono condividere per errore la stessa azione."
  ],
  "60": [
    "Acquisti nella bottega",
    "La bottega parte con 100 monete e vende pozioni a 25. Quando premi CompraPozioneBtn il saldo deve diminuire soltanto se c'è oro sufficiente; aggiorna OroLabel e MessaggioLabel con l'esito dell'operazione. I messaggi sono «Pozione Acquistata!» oppure «Oro Insufficiente!».",
    "La logica deve continuare a funzionare dopo acquisti ripetuti, anche a saldo zero."
  ]
};
  if (typeof LESSONS_DATA === 'undefined' || !Array.isArray(LESSONS_DATA)) {
    throw new Error('Caricare curriculum_extension.js dopo lessons.js');
  }
  for (const lesson of LESSONS_DATA) {
    if (lesson.isMastery) {
      lesson.isConsolidation = true; // Il vecchio esercizio resta nel corso.
      lesson.title = lesson.title
        .replace(/^[0-9]+\.\s*(?:⭐|🏆)\s*/, match => match.match(/\d+/)[0] + '. ')
        .replace(/Sfida di Apprendimento(?: Finale)?:\s*/, 'Consolidamento: ');
      const brief = CONSOLIDATION_BRIEFS[lesson.id];
      if (brief) {
        lesson.theory = '<p><strong>' + brief[0] + '</strong> — ' + brief[2] + '</p>';
        lesson.task = '<p>' + brief[1] + '</p>';
      }
    }
  }
  // Traguardi storici: ora fanno riferimento agli esercizi di consolidamento.
  if (typeof ACHIEVEMENTS_DATA !== 'undefined') {
    for (const achievement of ACHIEVEMENTS_DATA) {
      achievement.desc = String(achievement.desc||'')
        .replace(/Sfida di (?:Padronanza|Apprendimento)(?: Finale)?/gi,
          'esercizio di consolidamento');
    }
  }
  const ids=new Set(LESSONS_DATA.map(l=>l.id));
  for (const entry of EXTRA_LESSONS) {
    if (ids.has(entry.id)) throw new Error('ID didattico duplicato: ' + entry.id);
    ids.add(entry.id);
    const {rules,...lesson}=entry;
    LESSONS_DATA.push(lesson);
  }
  LESSONS_DATA.sort((a,b)=>a.chapterId-b.chapterId ||
    Number(Boolean(a.isMastery))-Number(Boolean(b.isMastery)) ||
    a.id-b.id);
  // Numerazione mostrata allo studente: progressiva da 1 a 81.
  // L'ID usato per verifiche, salvataggi e traguardi non viene alterato.
  LESSONS_DATA.forEach((lesson,index)=>{
    const text=String(lesson.title||'').replace(/^\d+\.\s*/, '');
    lesson.title=(index+1)+'. '+text;
  });

  // Test comportamentali separati dall'esempio visibile. Le varianti cambiano
  // solo dati d'ingresso o aggiungono una piccola chiamata-prova dentro _ready.
  // Nessuna soluzione e' valutata tramite un interprete JavaScript.
  const RULE_LABELS={
    101:["Lo script deve estendere Node","L'avvio deve essere gestito da _ready()"],
    102:["Converti il numero con str()","Conserva il messaggio in una variabile rapporto"],
    103:["Dichiara energia con inferenza di tipo (:=)","Dichiara acceso con inferenza di tipo (:=)"],
    104:["Calcola il risultato nella variabile totale","Usa la moltiplicazione nel calcolo","Somma anche la tassa"],
    105:["Usa elif per la soglia intermedia","Gestisci tutti gli altri punteggi con else"],
    106:["Nega lo stato dell'allarme con not","Combina i requisiti con and","Utilizza una condizione if"],
    107:["Controlla la presenza della chiave con has()","Rimuovi la chiave con erase()","Leggi il numero di elementi con size()"],
    108:["Dichiara un Array[int]","Aggiungi il punteggio con append()"],
    109:["Scorri i controlli con un ciclo for","Controlla quando trovi un guasto con if","Interrompi la scansione con break"],
    110:["Salta soltanto l'iterazione non valida con continue","Scorri tutti i premi con for","Individua i premi da ignorare con if"],
    111:["Definisci la funzione calcola_danno()","Restituisci il risultato con return","Usa max() per impedire danni negativi"],
    112:["Definisci applica_sconto()","Restituisci la variabile locale prezzo_finale"],
    113:["Misura la distanza tra due vettori con distance_to()","Utilizza coordinate Vector2"],
    114:["Normalizza il vettore con normalized()","Misura la lunghezza del vettore risultante"],
    115:["Leggi le chiavi facoltative con get()","Conserva il risultato in scudo"],
    116:["Dichiara il segnale pericolo(livello)","Collega il segnale alla callback","Emetti il segnale con un parametro"],
    117:["Dichiara la classe Arma","Definisci il metodo danno_totale()","Restituisci un valore dal metodo"],
    118:["Dichiara la classe Contatore","Crea istanze distinte con new()","Definisci il metodo aggiungi()"],
    119:["Crea un nodo con Node.new()","Aggiungi il nodo all'albero con add_child()","Verifica la presenza con has_node()"],
    120:["Crea un pulsante con Button.new()","Collega il segnale pressed","Emetti il segnale pressed"],
    121:["Definisci la funzione aggiorna()","Usa il parametro delta","Scala il movimento moltiplicando per delta"]
  };
  function replaceInput(source,replacement,label,pattern,expected){
    let changed=false;
    const code=source.replace(pattern,(whole,prefix,...rest)=>{
      changed=true;
      return typeof replacement==='function'?replacement(whole,prefix,...rest):prefix+replacement;
    });
    return {label,code,expected,ready:changed};
  }
  const entry=(label,code,expected,ready=true)=>({label,code,expected,ready});
  function mutate(source,pattern,value,label,expected){
    let changed=false;
    const code=source.replace(pattern,(full,prefix)=>{
      changed=true;return prefix+value;
    });
    return entry(label,code,expected,changed);
  }
  // Aggiunge nuove osservazioni dopo le istruzioni di _ready() per interrogare
  // funzioni e nodi con dati non presenti nell'esempio mostrato allo studente.
  function probeReady(source,body,label,expected){
    const head=/^func[ \t]+_ready[ \t]*\([^)]*\)[ \t]*(?:->[ \t]*void[ \t]*)?:[^\n]*$/m.exec(source);
    if(!head)return entry(label,source,expected,false);
    const begin=head.index+head[0].length;
    let end=source.length, match;
    const top=/^([A-Za-z_][^\n]*)$/gm;
    top.lastIndex=begin;
    while((match=top.exec(source))){
      if(match.index>begin){end=match.index;break;}
    }
    const prefix=source.slice(0,end).replace(/[ \t]*$/,'').replace(/\n+$/,'');
    const suffix=source.slice(end);
    const extra=body.split('\n').map(line=>line?'    '+line:'').join('\n');
    return entry(label,prefix+'\n'+extra+'\n\n'+suffix,expected,true);
  }
  function scenarios(id,source,expected){
    const input=(name,value,output,regex)=>mutate(source,regex,value,name,output);
    const literal=(name,regex,value,output)=>{
      let done=false;
      const code=source.replace(regex,()=>{done=true;return value;});
      return entry(name,code,output,done);
    };
    switch(id){
      case 101: return []; // La sequenza dei due print e' gia' osservata.
      case 102: return [input('Crediti alternativi','47','Crediti: 47',/(^\s*var\s+crediti\s*(?::\s*int)?\s*(?::=|=)\s*)25\b/m)];
      case 103: return [
        input('Energia alternativa','31','Energia: 31\nAcceso: true',/(^\s*var\s+energia\s*:=\s*)75\b/m),
        input('Generatore spento','false','Energia: 75\nAcceso: false',/(^\s*var\s+acceso\s*:=\s*)true\b/m)
      ];
      case 104:{
        let count=0;
        const code=source.replace(/(^\s*var\s+(costo_kit|quantita|tassa)\s*=\s*)(12|3|4)\b/gm,
          (full,prefix,key)=>{
            count++;return prefix+({costo_kit:8,quantita:5,tassa:7}[key]);
          });
        return [entry('Costi e quantita diversi',code,'Totale: 47',count===3)];
      }
      case 105:return [
        input('Rango alto','95','Rango: A',/(^\s*var\s+punti\s*=\s*)72\b/m),
        input('Rango basso','35','Rango: C',/(^\s*var\s+punti\s*=\s*)72\b/m)
      ];
      case 106:return [
        input('Allarme attivo','true','Accesso negato',/(^\s*var\s+allarme_attivo\s*=\s*)false\b/m),
        input('Lasciapassare assente','false','Accesso negato',/(^\s*var\s+ha_pass\s*=\s*)true\b/m)
      ];
      case 107:return [
        input('Chiave mancante','["Torcia", "Mappa"]','Oggetti rimasti: 2',/(^\s*var\s+zaino\s*=\s*)\[[^\n]*\]/m),
        input('Zaino piu grande','["Torcia", "Chiave", "Mappa", "Pozione"]','Oggetti rimasti: 3',/(^\s*var\s+zaino\s*=\s*)\[[^\n]*\]/m)
      ];
      case 108:return [literal('Nuovo punteggio',/\.append\s*\(\s*30\s*\)/,'.append(45)','Ultimo punteggio: 45')];
      case 109:return [
        input('Due guasti consecutivi','["OK", "GUASTO", "GUASTO"]','Guasto individuato',/(^\s*var\s+controlli\s*=\s*)\[[^\n]*\]/m),
        input('Nessun guasto','["OK", "OK"]','',/(^\s*var\s+controlli\s*=\s*)\[[^\n]*\]/m)
      ];
      case 110:return [
        input('Premi differenti','[6, -4, 18, 2]','Ricompense: 26',/(^\s*var\s+premi\s*=\s*)\[[^\n]*\]/m),
        input('Solo premi non validi','[-2, -5]','Ricompense: 0',/(^\s*var\s+premi\s*=\s*)\[[^\n]*\]/m)
      ];
      case 111:return [probeReady(source,'print("GDH verifica: ", calcola_danno(7, 12), ";", calcola_danno(9))','Danno con altri argomenti',expected+'\nGDH verifica: 0;9')];
      case 112:return [probeReady(source,'print("GDH verifica: ", applica_sconto(95, 17))','Sconto con altri argomenti',expected+'\nGDH verifica: 78')];
      case 113:return [input('Stazione piu lontana','Vector2(10, 3)','Attracco possibile: false',/(^\s*var\s+stazione\s*=\s*)Vector2\s*\(\s*3\s*,\s*4\s*\)/m)];
      case 114:return [literal('Vettore nullo',/Vector2\s*\(\s*3\s*,\s*4\s*\)/,'Vector2(0, 0)','Direzione unitaria: false')];
      case 115:return [input('Nemico con scudo','{"nome": "Slime", "hp": 20, "scudo": 18}','Scudo: 18',/(^\s*var\s+nemico\s*=\s*)\{[^\n]*\}/m)];
      case 116:return [literal('Segnale di livello diverso',/pericolo\.emit\s*\(\s*3\s*\)/,'pericolo.emit(7)','Allarme: 7')];
      case 117:return [probeReady(source,'var arma_verifica = Arma.new()\narma_verifica.base = 5\narma_verifica.bonus = 8\nprint("GDH verifica: ", arma_verifica.danno_totale())','Danno di un\'altra arma',expected+'\nGDH verifica: 13')];
      case 118:return [probeReady(source,'var altro_contatore = Contatore.new()\naltro_contatore.aggiungi()\nprint("GDH verifica: ", altro_contatore.valore)','Terza istanza indipendente',expected+'\nGDH verifica: 1')];
      case 119:return [probeReady(source,'print("GDH verifica: ", has_node("Compagno"))','Verifica del nodo reale',expected+'\nGDH verifica: true')];
      case 120:return [probeReady(source,'for pulsante_verifica in get_children():\n    if pulsante_verifica is Button:\n        pulsante_verifica.pressed.emit()','Seconda pressione reale',expected+'\n'+expected)];
      case 121:return [probeReady(source,'aggiorna(0.2)\nprint("GDH verifica: ", posizione)','Aggiornamento con delta differente',expected+'\nGDH verifica: 12.0')];
      default:return [];
    }
  }

  const records = new Map(EXTRA_LESSONS.map(x=>[x.id,x]));
  const lines = text => String(text||'').trimEnd().split(/\r?\n/).filter(Boolean);
  const clean = code => String(code||'')
    .replace(/"(?:(?:\\.)|[^"\\])*"|'(?:(?:\\.)|[^'\\])*'/g,'""')
    .replace(/#.*$/gm,'');
  async function verify(id,code,runNative) {
    const lesson=records.get(id);
    if(!lesson)throw new Error('Esercizio esteso non trovato');
    const raw=await runNative(code);
    const executed=raw.status==='executed' && !String(raw.stderr||'').trim();
    const checks=[
      {desc:'Godot ha compilato ed eseguito lo script senza errori',passed:executed},
      {desc:'Output e sequenza corretti',passed:executed &&
        JSON.stringify(lines(raw.stdout))===JSON.stringify(lines(lesson.expectedOutput))}
    ];
    const logicalSource=clean(code);
    for(let i=0;i<lesson.rules.length;i++){
      const found=new RegExp(lesson.rules[i]).test(logicalSource);
      checks.push({desc:RULE_LABELS[id]?.[i]||'Utilizza il costrutto richiesto',passed:found});
    }
    if(id===104){
      checks.push({desc:'Raggruppa almeno una moltiplicazione tra parentesi',
        passed:/\([^()\n]*\*[^()\n]*\)/.test(logicalSource)});
    }
    // Se il codice non supera gia' i controlli visibili, evita esecuzioni
    // extra lente e usa il debugger nativo per spiegare l'errore originale.
    if(checks.every(check=>check.passed)){
      for(const scenario of scenarios(id,code,lesson.expectedOutput)){
        if(!scenario.ready){
          checks.push({desc:scenario.label+' · mantieni i dati di partenza come nella consegna',
            passed:false,diff:'Impossibile applicare il caso alternativo: verifica dichiarazioni e chiamate richieste.'});
          continue;
        }
        const response=await runNative(scenario.code);
        const ok=response.status==='executed'&&!String(response.stderr||'').trim()
          &&JSON.stringify(lines(response.stdout))===JSON.stringify(lines(scenario.expected));
        checks.push({desc:scenario.label+' · corretto anche con dati differenti',
          passed:ok,diff:ok?'':'Il programma non produce il risultato atteso nel caso di prova. Evita valori scritti direttamente nell’output.'});
      }
    }
    const accepted=checks.every(x=>x.passed);
    const reason=!executed?(raw.stderr||'Il motore non ha eseguito lo script'):
      accepted?'':(checks.find(x=>!x.passed)?.diff||'Rivedi il requisito evidenziato e riprova.');
    const feedback={id,passed:accepted,verdict:!executed?'invalid_code':accepted?'accepted':'requirements_not_met',
      checks,reason,demoOnly:true};
    const execution={success:executed,code,logs:lines(raw.stdout),
      error:executed?null:(String(raw.stderr||'Impossibile eseguire lo script')),nativeStatus:raw.status,nativeFeedback:feedback};
    return {feedback,execution,original:raw,accepted};
  }
  window.GDHCurriculumExtension=Object.freeze({has:id=>records.has(id),verify,count:EXTRA_LESSONS.length});
})();
