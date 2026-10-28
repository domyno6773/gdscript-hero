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
    "theory": "<p>Nello script, <code>extends Node</code> definisce il tipo del nodo mentre <code>_ready()</code> contiene le istruzioni eseguite all'avvio.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Nello script, `extends Node` definisce il tipo del nodo mentre `_ready()` contiene le istruzioni eseguite all'avvio."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Una stringa e un numero non si concatenano direttamente: <code>str(numero)</code> converte il valore in testo.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Una stringa e un numero non si concatenano direttamente: `str(numero)` converte il valore in testo."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>L'operatore <code>:=</code> deduce il tipo dal valore iniziale; <code>bool</code> distingue <code>true</code> e <code>false</code>.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "L'operatore `:=` deduce il tipo dal valore iniziale; `bool` distingue `true` e `false`."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Nelle formule di gioco usa le parentesi per esprimere chiaramente i gruppi di operazioni.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Nelle formule di gioco usa le parentesi per esprimere chiaramente i gruppi di operazioni."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>elif</code> verifica una seconda condizione soltanto se quelle precedenti non sono vere.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`elif` verifica una seconda condizione soltanto se quelle precedenti non sono vere."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>not</code> nega un valore booleano, mentre <code>and</code> richiede che entrambe le condizioni siano soddisfatte.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`not` nega un valore booleano, mentre `and` richiede che entrambe le condizioni siano soddisfatte."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>.has()</code> controlla la presenza, <code>.erase()</code> rimuove una corrispondenza e <code>.size()</code> restituisce la dimensione.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`.has()` controlla la presenza, `.erase()` rimuove una corrispondenza e `.size()` restituisce la dimensione."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>Array[int]</code> indica al motore che tutti gli elementi della lista devono essere interi.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`Array[int]` indica al motore che tutti gli elementi della lista devono essere interi."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>break</code> fa terminare anticipatamente il ciclo. È utile nelle ricerche in cui il primo risultato basta.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`break` fa terminare anticipatamente il ciclo. È utile nelle ricerche in cui il primo risultato basta."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>continue</code> salta l'iterazione corrente ma permette al ciclo di passare agli elementi successivi.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`continue` salta l'iterazione corrente ma permette al ciclo di passare agli elementi successivi."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Un parametro con valore predefinito può essere omesso quando richiami la funzione.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Un parametro con valore predefinito può essere omesso quando richiami la funzione."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Una variabile locale esiste nella funzione in cui è dichiarata; <code>return</code> permette di usare il suo valore all'esterno.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Una variabile locale esiste nella funzione in cui è dichiarata; `return` permette di usare il suo valore all'esterno."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>distance_to()</code> calcola la distanza reale tra due posizioni 2D, non confronta soltanto gli assi.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`distance_to()` calcola la distanza reale tra due posizioni 2D, non confronta soltanto gli assi."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Normalizzare un <code>Vector2</code> mantiene la direzione ma porta la lunghezza a 1, se il vettore non è nullo.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Normalizzare un `Vector2` mantiene la direzione ma porta la lunghezza a 1, se il vettore non è nullo."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>Dictionary.get(chiave, valore_predefinito)</code> evita di accedere a una chiave inesistente.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`Dictionary.get(chiave, valore_predefinito)` evita di accedere a una chiave inesistente."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Con i segnali, chi emette un evento non ha bisogno di conoscere in anticipo chi lo ascolterà.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Con i segnali, chi emette un evento non ha bisogno di conoscere in anticipo chi lo ascolterà."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Una classe raccoglie stato e comportamenti; tipizzare il risultato di un metodo documenta il contratto con chi lo chiama.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Una classe raccoglie stato e comportamenti; tipizzare il risultato di un metodo documenta il contratto con chi lo chiama."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Ogni istanza di una classe mantiene un proprio stato. Non confondere le variabili dell'istanza con variabili globali condivise.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Ogni istanza di una classe mantiene un proprio stato. Non confondere le variabili dell'istanza con variabili globali condivise."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>add_child()</code> inserisce un nodo nell'albero della scena. <code>has_node()</code> può verificarne l'esistenza.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`add_child()` inserisce un nodo nell'albero della scena. `has_node()` può verificarne l'esistenza."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p>Un <code>Button</code> è un nodo interattivo: il segnale <code>pressed</code> permette di separare l'interfaccia dal comportamento.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "Un `Button` è un nodo interattivo: il segnale `pressed` permette di separare l'interfaccia dal comportamento."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
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
    "theory": "<p><code>delta</code> misura il tempo trascorso tra aggiornamenti. Moltiplicarlo per una velocità riduce la dipendenza dagli FPS.</p><p>Questo esercizio usa GDScript eseguito dal motore Godot reale.</p>",
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
        "text": "`delta` misura il tempo trascorso tra aggiornamenti. Moltiplicarlo per una velocità riduce la dipendenza dagli FPS."
      },
      {
        "level": 2,
        "type": "structure",
        "icon": "code-2",
        "label": "Struttura",
        "text": "Parti dal codice iniziale e individua le variabili, le funzioni o i metodi necessari. Controlla il risultato con la console."
      },
      {
        "level": 3,
        "type": "example",
        "icon": "book-open",
        "label": "Verifica",
        "text": "Confronta il comportamento del programma con l'output richiesto. Se il codice compila ma non supera i controlli, verifica prima i dati e poi il flusso di esecuzione."
      }
    ]
  }
];
  if (typeof LESSONS_DATA === 'undefined' || !Array.isArray(LESSONS_DATA)) {
    throw new Error('Caricare curriculum_extension.js dopo lessons.js');
  }
  for (const lesson of LESSONS_DATA) {
    if (lesson.isMastery) {
      lesson.isConsolidation = true; // Il vecchio esercizio resta nel corso.
      lesson.title = lesson.title
        .replace(/^[0-9]+\.\s*(?:⭐|🏆)\s*/, match => match.match(/\d+/)[0] + '. ')
        .replace(/Sfida di Apprendimento(?: Finale)?:\s*/, 'Consolidamento: ');
      lesson.task = [
        lesson.scenario ? '<p>' + lesson.scenario + '</p>' : '',
        lesson.requirements ? '<ul>' + lesson.requirements.map(r => '<li>' + r + '</li>').join('') + '</ul>' : lesson.task
      ].join('');
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
      {desc:'Output e sequenza corretti',passed:executed && JSON.stringify(lines(raw.stdout))===JSON.stringify(lines(lesson.expectedOutput))}
    ];
    const logicalSource=clean(code);
    for(const rule of lesson.rules){
      const found=new RegExp(rule).test(logicalSource);
      checks.push({desc:'Costrutto richiesto: '+rule,passed:found});
    }
    const accepted=checks.every(x=>x.passed);
    const feedback={id,passed:accepted,verdict:!executed?'invalid_code':accepted?'accepted':'requirements_not_met',
      checks,reason:!executed?(raw.stderr||'Il motore non ha eseguito lo script'):'',demoOnly:true};
    const execution={success:executed,code,logs:lines(raw.stdout),
      error:executed?null:(String(raw.stderr||'Impossibile eseguire lo script')),nativeStatus:raw.status,nativeFeedback:feedback};
    return {feedback,execution,original:raw,accepted};
  }
  window.GDHCurriculumExtension=Object.freeze({has:id=>records.has(id),verify,count:EXTRA_LESSONS.length});
})();
