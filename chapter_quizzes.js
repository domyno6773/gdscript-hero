'use strict';
/* Quiz brevi distribuiti durante il percorso: 2 per capitolo, 3 domande ciascuno.
 * Banca di 90 domande ragionate: risposta singola, multipla e completamento codice.
 * ID 201-230; gli ID delle lezioni e delle varianti native restano distinti.
 */
(() => {
  const sessions = [
  {
    "id": 201,
    "chapterId": 1,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "A cosa serve la funzione `_ready()` in uno script collegato a un nodo?",
        "options": [
          "Viene chiamata quando il nodo è pronto nell'albero della scena",
          "Viene eseguita una volta per ogni frame",
          "Viene chiamata solo quando premi un Button",
          "Viene eseguita soltanto quando chiudi il gioco"
        ],
        "correct": [
          0
        ],
        "explanation": "Godot chiama _ready() quando il nodo è entrato nella scena ed è pronto.",
        "hint": "Pensa al momento in cui un nodo diventa operativo."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali righe sono commenti validi in GDScript?",
        "options": [
          "# Spiega il codice",
          "print(\"# nota\")",
          "# TODO: rivedere",
          "// commento"
        ],
        "correct": [
          0,
          2
        ],
        "explanation": "Solo il testo che segue # fuori da una stringa è un commento in GDScript.",
        "hint": "Controlla quali simboli sono davvero interpretati dal linguaggio."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Quale istruzione inserisci per stampare una seconda riga?",
        "code": "func _ready():\n    print(\"Inizio\")\n    □□□□",
        "options": [
          "print(\"Fine\")",
          "return \"Fine\"",
          "var Fine = true",
          "pass(\"Fine\")"
        ],
        "correct": [
          0
        ],
        "explanation": "Una nuova chiamata a print genera una seconda riga nella console.",
        "hint": "Cerca l'istruzione che produce output senza cambiare il flusso."
      }
    ]
  },
  {
    "id": 202,
    "chapterId": 1,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quale sequenza stampa `print(\"A\")` seguito da `print(2)`?",
        "options": [
          "A e 2 su due righe",
          "A2 sulla stessa riga",
          "Solo il numero 2",
          "Prima 2 e poi A"
        ],
        "correct": [
          0
        ],
        "explanation": "Ogni chiamata a print() conclude automaticamente la propria riga.",
        "hint": "Valuta ciascuna chiamata separatamente."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali affermazioni descrivono correttamente `print()`?",
        "options": [
          "Può stampare numeri senza convertirli in stringhe",
          "Può ricevere più valori separati da virgole",
          "Deve trovarsi sempre fuori dalle funzioni",
          "È utile per osservare i valori durante il debug"
        ],
        "correct": [
          0,
          1,
          3
        ],
        "explanation": "print può mostrare valori diversi e aiutare a controllare il comportamento del programma.",
        "hint": "Pensa a come hai usato la console nei primi esercizi."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il messaggio di avvio senza cambiare la riga precedente.",
        "code": "func _ready():\n    print(\"Sistema pronto\")\n    □□□□",
        "options": [
          "print(\"Controllo completato\")",
          "return print",
          "var print = \"OK\"",
          "extends print"
        ],
        "correct": [
          0
        ],
        "explanation": "Una seconda istruzione print() aggiunge il messaggio alla console.",
        "hint": "Identifica un'istruzione eseguibile nello stesso blocco."
      }
    ]
  },
  {
    "id": 203,
    "chapterId": 2,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Perché `print(nome)` è diverso da `print(\"nome\")` se `nome = \"Eroe\"`?",
        "options": [
          "Il primo legge il contenuto della variabile",
          "Il primo dichiara una nuova variabile",
          "Il secondo stampa il valore della variabile",
          "Il secondo modifica automaticamente nome"
        ],
        "correct": [
          0
        ],
        "explanation": "Senza virgolette si accede all'identificatore; con le virgolette si usa testo letterale.",
        "hint": "Confronta una variabile con una stringa letterale."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali dichiarazioni GDScript rappresentano dati di gioco validi?",
        "options": [
          "var hp = 100",
          "var nome = \"Lia\"",
          "var pronto = true",
          "var 3vite = 10"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "I nomi delle variabili non possono iniziare con una cifra; gli altri esempi sono validi.",
        "hint": "Controlla sintassi, nomi e valori iniziali."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Mostra il contenuto della variabile `hp`.",
        "code": "func _ready():\n    var hp = 75\n    □□□□",
        "options": [
          "print(hp)",
          "print(\"hp\")",
          "hp.print()",
          "var print = hp"
        ],
        "correct": [
          0
        ],
        "explanation": "L'identificatore senza virgolette restituisce il valore 75.",
        "hint": "Non confondere il nome scritto come testo con il dato conservato."
      }
    ]
  },
  {
    "id": 204,
    "chapterId": 2,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Come ottieni la stringa `Vite: 3` usando una variabile intera `vite`?",
        "options": [
          "\"Vite: \" + str(vite)",
          "\"Vite: \" + vite",
          "str(\"Vite: \") + 3.0",
          "\"Vite: \" == vite"
        ],
        "correct": [
          0
        ],
        "explanation": "str() converte il numero in testo per la concatenazione.",
        "hint": "Quale operazione mette entrambi gli operandi nello stesso tipo?"
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali sono esempi di stringhe in GDScript?",
        "options": [
          "\"Porta aperta\"",
          "'Hai vinto!'",
          "42",
          "\"0420\""
        ],
        "correct": [
          0,
          1,
          3
        ],
        "explanation": "Le stringhe usano delimitatori di testo, anche quando il contenuto sembra numerico.",
        "hint": "I simboli usati per delimitare un valore cambiano il suo tipo."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa la frase dinamica con il nome del giocatore.",
        "code": "func _ready():\n    var nome = \"Lia\"\n    print(□□□□)",
        "options": [
          "\"Benvenuta \" + nome",
          "\"Benvenuta \" + \"nome\"",
          "\"Benvenuta \" + 7",
          "nome = \"Benvenuta\""
        ],
        "correct": [
          0
        ],
        "explanation": "La concatenazione con + unisce testo e contenuto della variabile.",
        "hint": "La frase deve cambiare se cambia il valore di nome."
      }
    ]
  },
  {
    "id": 205,
    "chapterId": 3,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quale tipo contiene solamente `true` oppure `false`?",
        "options": [
          "bool",
          "float",
          "String",
          "int"
        ],
        "correct": [
          0
        ],
        "explanation": "bool rappresenta i due valori logici.",
        "hint": "Pensa a uno stato acceso/spento."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali assegnazioni rispettano il tipo esplicito dichiarato?",
        "options": [
          "var vita: int = 100",
          "var velocita: float = 4.5",
          "var nome: String = \"Rex\"",
          "var vivo: bool = \"true\""
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "La stringa \"true\" non è un booleano; true senza virgolette lo è.",
        "hint": "Confronta il tipo richiesto con il tipo effettivo del valore."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa la dichiarazione di una variabile con tipo inferito.",
        "code": "func _ready():\n    □□□□\n    print(carica)",
        "options": [
          "var carica := 50",
          "const carica := 50",
          "carica: = 50",
          "var carica: = true"
        ],
        "correct": [
          0
        ],
        "explanation": "L'operatore := permette l'inferenza statica del tipo.",
        "hint": "Individua la dichiarazione che specifica il valore senza scrivere int."
      }
    ]
  },
  {
    "id": 206,
    "chapterId": 3,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Qual è il ruolo di una costante `const MAX_HP = 100`?",
        "options": [
          "Definisce un valore che non può essere riassegnato durante l'esecuzione",
          "Definisce una variabile modificabile ogni frame",
          "Esegue un controllo automatico della salute",
          "Crea una funzione"
        ],
        "correct": [
          0
        ],
        "explanation": "Una costante fissa un valore che non deve cambiare.",
        "hint": "Valuta la differenza tra var e const."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali esempi distinguono correttamente i tipi?",
        "options": [
          "3.5 è un float",
          "false è un bool",
          "\"12\" è una String",
          "12 è un bool"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Il valore 12 senza virgolette è un intero, non un booleano.",
        "hint": "I delimitatori e la forma del valore aiutano a identificare il tipo."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Imposta il limite massimo usando una costante tipizzata.",
        "code": "extends Node\n□□□□\nfunc _ready():\n    print(MAX_HP)",
        "options": [
          "const MAX_HP: int = 100",
          "var MAX_HP = \"100\"",
          "const MAX_HP: bool = 100",
          "const MAX_HP: String = 100"
        ],
        "correct": [
          0
        ],
        "explanation": "Una costante può dichiarare esplicitamente il proprio tipo.",
        "hint": "Il limite è un numero intero e non deve essere modificato."
      }
    ]
  },
  {
    "id": 207,
    "chapterId": 4,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quanto vale `10 + 2 * 3` in GDScript?",
        "options": [
          "16",
          "36",
          "30",
          "15"
        ],
        "correct": [
          0
        ],
        "explanation": "La moltiplicazione ha precedenza sull'addizione.",
        "hint": "Considera l'ordine delle operazioni aritmetiche."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali operatori modificano una variabile già esistente?",
        "options": [
          "+=",
          "-=",
          "*=",
          "=="
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "== confronta valori e non aggiorna una variabile.",
        "hint": "Separa gli operatori di assegnazione da quelli di confronto."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Sottrai un danno da `salute` senza riscrivere il nome due volte.",
        "code": "var salute = 100\nfunc _ready():\n    □□□□\n    print(salute)",
        "options": [
          "salute -= 20",
          "salute == 20",
          "salute += 20",
          "salute =- 20"
        ],
        "correct": [
          0
        ],
        "explanation": "L'assegnazione rapida aggiorna la variabile sottraendo il valore.",
        "hint": "Deve diminuire lo stato del personaggio."
      }
    ]
  },
  {
    "id": 208,
    "chapterId": 4,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Per distribuire 100 monete fra 3 persone e trovare il resto intero, quale operatore usi?",
        "options": [
          "%",
          "/",
          "*",
          "+="
        ],
        "correct": [
          0
        ],
        "explanation": "% restituisce il resto della divisione intera.",
        "hint": "Non cercare il quoziente: cerca ciò che avanza."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali espressioni producono 12?",
        "options": [
          "3 * 4",
          "20 - 8",
          "5 + 7",
          "18 % 6"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "18 % 6 vale zero perché 18 è divisibile per 6.",
        "hint": "Calcola ogni espressione indipendentemente."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il calcolo di un prezzo complessivo.",
        "code": "func _ready():\n    var prezzo = 8\n    var pezzi = 3\n    var totale = □□□□\n    print(totale)",
        "options": [
          "prezzo * pezzi",
          "prezzo + pezzi",
          "prezzo % pezzi",
          "prezzo / pezzi"
        ],
        "correct": [
          0
        ],
        "explanation": "Il totale cresce con il numero di unità acquistate.",
        "hint": "Un prezzo unitario va applicato a ciascun pezzo."
      }
    ]
  },
  {
    "id": 209,
    "chapterId": 5,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Cosa fa `elif` in una catena di condizioni?",
        "options": [
          "Verifica un'altra condizione se le precedenti sono false",
          "Esegue sempre il blocco seguente",
          "Termina la funzione immediatamente",
          "Rende true una variabile"
        ],
        "correct": [
          0
        ],
        "explanation": "elif introduce un'alternativa condizionata tra if ed else.",
        "hint": "Considera quando un ramo precedente è già stato eseguito."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali confronti sono veri quando `livello = 10`?",
        "options": [
          "livello >= 10",
          "livello == 10",
          "livello != 9",
          "livello < 10"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "10 non è minore di 10; le altre tre condizioni sono vere.",
        "hint": "Controlla con attenzione i confronti inclusivi."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Apri una porta solo se il giocatore ha la chiave.",
        "code": "var ha_chiave = true\nfunc _ready():\n    □□□□\n        print(\"Aperta\")",
        "options": [
          "if ha_chiave:",
          "if not ha_chiave:",
          "elif ha_chiave:",
          "else ha_chiave:"
        ],
        "correct": [
          0
        ],
        "explanation": "Un blocco if viene eseguito quando la condizione è vera.",
        "hint": "Il controllo deve poter iniziare da solo."
      }
    ]
  },
  {
    "id": 210,
    "chapterId": 5,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quando `a = false` e `b = true`, quanto vale `a or b`?",
        "options": [
          "true",
          "false",
          "0",
          "null"
        ],
        "correct": [
          0
        ],
        "explanation": "or è vero quando almeno una delle due condizioni è vera.",
        "hint": "Valuta entrambi gli operandi logici."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali casi autorizzano l'accesso se la regola è `energia >= 50 and ha_chiave`?",
        "options": [
          "energia 50, ha_chiave true",
          "energia 80, ha_chiave true",
          "energia 80, ha_chiave false",
          "energia 49, ha_chiave true"
        ],
        "correct": [
          0,
          1
        ],
        "explanation": "Servono entrambe le condizioni contemporaneamente, inclusa la soglia di energia.",
        "hint": "Controlla sia il valore sia il booleano in ogni scenario."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il ramo alternativo del controllo salute.",
        "code": "if salute <= 0:\n    print(\"Game Over\")\n□□□□\n    print(\"In battaglia\")",
        "options": [
          "else:",
          "elif:",
          "if:",
          "return:"
        ],
        "correct": [
          0
        ],
        "explanation": "Il secondo messaggio deve apparire nei casi non gestiti dal primo ramo.",
        "hint": "Non servono ulteriori condizioni esplicite."
      }
    ]
  },
  {
    "id": 211,
    "chapterId": 6,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quale elemento restituisce `oggetti[1]` se `oggetti = [\"Arco\", \"Pozione\", \"Mappa\"]`?",
        "options": [
          "Pozione",
          "Arco",
          "Mappa",
          "Nessuno"
        ],
        "correct": [
          0
        ],
        "explanation": "Gli indici degli Array iniziano da zero.",
        "hint": "Numera gli elementi a partire da 0."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali operazioni sono adatte a un Array Godot?",
        "options": [
          "append() aggiunge un elemento",
          "size() restituisce il numero di elementi",
          "has() verifica la presenza",
          "erase() restituisce sempre l'indice dell'elemento"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "erase rimuove per valore, non serve a recuperare l'indice.",
        "hint": "Valuta il ruolo di ciascun metodo nella gestione di uno zaino."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa l'istruzione per inserire una torcia nello zaino.",
        "code": "var zaino = [\"Mappa\"]\nfunc _ready():\n    □□□□",
        "options": [
          "zaino.append(\"Torcia\")",
          "zaino.size(\"Torcia\")",
          "zaino.has(\"Torcia\")",
          "zaino.erase(\"Torcia\")"
        ],
        "correct": [
          0
        ],
        "explanation": "append modifica la collezione aggiungendo un elemento.",
        "hint": "Cerca il metodo che modifica la lista anziché consultarla."
      }
    ]
  },
  {
    "id": 212,
    "chapterId": 6,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Perché `Array[int]` è utile rispetto a un Array non tipizzato?",
        "options": [
          "Limita gli elementi a valori interi",
          "Impedisce di rimuovere gli elementi",
          "Ordina automaticamente i numeri",
          "Rende immutabile la collezione"
        ],
        "correct": [
          0
        ],
        "explanation": "Gli Array tipizzati aiutano a rilevare errori di tipo.",
        "hint": "Non confondere tipi e ordinamento."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali controlli sono utili prima di consumare una pozione da un Array?",
        "options": [
          "Verificare has(\"Pozione\")",
          "Gestire il caso in cui la pozione non esiste",
          "Eseguire erase(\"Pozione\") solo quando è appropriato",
          "Assumere che il primo elemento sia sempre una pozione"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Un inventario può contenere elementi diversi o essere vuoto.",
        "hint": "Pensa al comportamento del gioco quando manca l'oggetto."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il codice per contare gli oggetti rimasti.",
        "code": "func _ready():\n    var zaino = [\"Spada\", \"Mappa\"]\n    print(□□□□)",
        "options": [
          "zaino.size()",
          "zaino.append()",
          "zaino.erase()",
          "zaino[2]"
        ],
        "correct": [
          0
        ],
        "explanation": "size restituisce il numero di elementi attualmente presenti.",
        "hint": "Il risultato desiderato è una quantità, non un oggetto."
      }
    ]
  },
  {
    "id": 213,
    "chapterId": 7,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quante iterazioni esegue `for i in range(3):`?",
        "options": [
          "3",
          "2",
          "4",
          "0"
        ],
        "correct": [
          0
        ],
        "explanation": "range(3) genera i valori 0, 1 e 2.",
        "hint": "Conta i valori, non il valore massimo incluso."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali comportamenti caratterizzano i cicli?",
        "options": [
          "for può attraversare gli elementi di un Array",
          "while ripete finché la condizione resta vera",
          "break termina il ciclo corrente",
          "while si interrompe sempre da solo dopo un minuto"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Il ciclo while può diventare infinito se la condizione rimane vera.",
        "hint": "La durata del ciclo dipende dai dati e dalle condizioni."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il ciclo che visita ogni nemico.",
        "code": "var nemici = [\"Orco\", \"Slime\"]\nfunc _ready():\n    □□□□\n        print(nemico)",
        "options": [
          "for nemico in nemici:",
          "while nemico in nemici:",
          "if nemico in nemici:",
          "for nemici in nemico:"
        ],
        "correct": [
          0
        ],
        "explanation": "Il ciclo for itera direttamente sulla collezione.",
        "hint": "Quale variabile rappresenta un elemento alla volta?"
      }
    ]
  },
  {
    "id": 214,
    "chapterId": 7,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Che differenza c'è tra `break` e `continue`?",
        "options": [
          "break interrompe il ciclo; continue salta alla prossima iterazione",
          "Entrambi terminano la funzione",
          "break salta una sola iterazione; continue termina il ciclo",
          "Entrambi modificano il valore del contatore"
        ],
        "correct": [
          0
        ],
        "explanation": "I due comandi influenzano diversamente il flusso del ciclo.",
        "hint": "Distingui la fine del ciclo dal salto del solo elemento corrente."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali azioni evitano un ciclo `while` infinito?",
        "options": [
          "Aggiornare una variabile coinvolta nella condizione",
          "Predisporre una condizione di uscita raggiungibile",
          "Usare break quando si verifica una condizione",
          "Lasciare la condizione sempre true senza break"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Un while termina soltanto quando la condizione diventa falsa o viene interrotto.",
        "hint": "Domandati cosa cambia tra un'iterazione e la successiva."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Salta le ricompense negative ma continua a leggere quelle successive.",
        "code": "for premio in premi:\n    if premio < 0:\n        □□□□\n    print(premio)",
        "options": [
          "continue",
          "break",
          "return",
          "pass"
        ],
        "correct": [
          0
        ],
        "explanation": "continue passa all'iterazione successiva, evitando il resto del blocco.",
        "hint": "Non devi interrompere l'intero ciclo."
      }
    ]
  },
  {
    "id": 215,
    "chapterId": 8,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "A cosa serve `return` dentro una funzione?",
        "options": [
          "Restituisce un valore al codice chiamante",
          "Stampa sempre un messaggio",
          "Crea una variabile globale",
          "Avvia _ready una seconda volta"
        ],
        "correct": [
          0
        ],
        "explanation": "return permette a chi chiama la funzione di utilizzare il valore calcolato.",
        "hint": "Pensa a cosa riceve il chiamante di una funzione."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali definizioni sono funzioni valide in GDScript?",
        "options": [
          "func saluta():",
          "func somma(a, b):",
          "func calcola(a: int) -> int:",
          "function saluta() {}"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "In GDScript le definizioni usano func, non la sintassi JavaScript.",
        "hint": "Osserva le parole chiave e i due punti finali."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa la funzione che restituisce il doppio di un numero.",
        "code": "func doppio(x: int) -> int:\n    □□□□\n\nfunc _ready():\n    print(doppio(3))",
        "options": [
          "return x * 2",
          "print(x * 2)",
          "return \"x * 2\"",
          "x *= 2"
        ],
        "correct": [
          0
        ],
        "explanation": "Il chiamante deve ricevere un numero, non soltanto vederlo in console.",
        "hint": "La funzione deve produrre un valore riutilizzabile."
      }
    ]
  },
  {
    "id": 216,
    "chapterId": 8,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Cosa accade al parametro opzionale `difesa` in `func danno(attacco, difesa = 0):` se chiami `danno(10)`?",
        "options": [
          "difesa assume il valore 0",
          "difesa diventa null",
          "Godot richiede sempre il secondo argomento",
          "difesa assume il valore 10"
        ],
        "correct": [
          0
        ],
        "explanation": "Un argomento non fornito usa il valore predefinito dichiarato.",
        "hint": "Interpreta il significato dell'assegnazione nella firma della funzione."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali sono vantaggi delle funzioni ben progettate?",
        "options": [
          "Evitano di ripetere la stessa logica",
          "Permettono di assegnare nomi chiari ai comportamenti",
          "Consentono di usare parametri per variare i dati",
          "Rendono inutile verificare il programma"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "La riusabilità non elimina la necessità di testare.",
        "hint": "Distingui organizzazione del codice da garanzia di correttezza."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il calcolo dello sconto restituendo il risultato.",
        "code": "func applica_sconto(prezzo, sconto):\n    □□□□\n\nfunc _ready():\n    print(applica_sconto(50, 10))",
        "options": [
          "return prezzo - sconto",
          "print(prezzo - sconto)",
          "return prezzo + sconto",
          "prezzo == sconto"
        ],
        "correct": [
          0
        ],
        "explanation": "Una funzione di calcolo deve restituire il nuovo importo.",
        "hint": "Il prezzo finale sarà inferiore a quello iniziale."
      }
    ]
  },
  {
    "id": 217,
    "chapterId": 9,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Cosa rappresenta `Vector2(100, 50)` in un contesto 2D?",
        "options": [
          "Un valore con componenti X e Y",
          "Un Array di cento elementi",
          "Un colore RGB",
          "Un segnale Godot"
        ],
        "correct": [
          0
        ],
        "explanation": "Vector2 raccoglie due componenti, spesso usate per posizione e direzione.",
        "hint": "Pensa agli assi dello spazio 2D."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali operazioni sono sensate su Vector2?",
        "options": [
          "Modificare la coordinata x",
          "Modificare la coordinata y",
          "Sommarlo a un altro Vector2",
          "Accedere alla proprietà z"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Vector2 ha componenti x e y; z appartiene ai vettori tridimensionali.",
        "hint": "Confronta la dimensione del vettore con le sue proprietà."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Sposta di 20 unità verso destra la posizione.",
        "code": "var posizione = Vector2(100, 50)\nfunc _ready():\n    □□□□",
        "options": [
          "posizione.x += 20",
          "posizione.y += 20",
          "posizione.x -= 20",
          "posizione.y -= 20"
        ],
        "correct": [
          0
        ],
        "explanation": "Nelle coordinate 2D comuni la destra corrisponde a X crescente.",
        "hint": "Identifica quale asse controlla lo spostamento orizzontale."
      }
    ]
  },
  {
    "id": 218,
    "chapterId": 9,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Quanto distano `Vector2(0, 0)` e `Vector2(3, 4)`?",
        "options": [
          "5",
          "7",
          "1",
          "25"
        ],
        "correct": [
          0
        ],
        "explanation": "La distanza euclidea è la lunghezza del segmento tra le due posizioni.",
        "hint": "Considera entrambe le coordinate e non sommarle direttamente."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali affermazioni sui vettori sono corrette?",
        "options": [
          "normalized() conserva la direzione se il vettore non è nullo",
          "distance_to() calcola la distanza fra posizioni",
          "length() misura la lunghezza di un vettore",
          "normalized() imposta sempre entrambe le componenti a 1"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Un vettore normalizzato non ha necessariamente componenti uguali.",
        "hint": "Pensa alla geometria del movimento 2D."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il controllo della distanza dall'obiettivo.",
        "code": "var posizione = Vector2(0, 0)\nvar bersaglio = Vector2(3, 4)\nfunc _ready():\n    var distanza = □□□□",
        "options": [
          "posizione.distance_to(bersaglio)",
          "posizione.x + bersaglio.y",
          "posizione.length() + bersaglio.length()",
          "posizione.normalized(bersaglio)"
        ],
        "correct": [
          0
        ],
        "explanation": "La distanza tra punti richiede un metodo che considera entrambi.",
        "hint": "Cerca un metodo che riceve la posizione di destinazione."
      }
    ]
  },
  {
    "id": 219,
    "chapterId": 10,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Qual è la caratteristica principale di un Dictionary?",
        "options": [
          "Associa chiavi a valori",
          "Mantiene soltanto numeri consecutivi",
          "Contiene solo due elementi",
          "Esegue automaticamente funzioni"
        ],
        "correct": [
          0
        ],
        "explanation": "Un Dictionary permette di recuperare dati tramite una chiave.",
        "hint": "Confrontalo con un Array indicizzato."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali accessi sono coerenti con `var eroe = {\"nome\": \"Lia\", \"vita\": 100}`?",
        "options": [
          "eroe[\"nome\"]",
          "eroe[\"vita\"]",
          "eroe.get(\"mana\", 0)",
          "eroe[0] restituisce sempre \"Lia\""
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Le chiavi dichiarate sono stringhe; get permette un valore predefinito.",
        "hint": "Le chiavi non sono automaticamente indici numerici."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Inserisci una nuova proprietà nel dizionario.",
        "code": "var eroe = {\"nome\": \"Lia\"}\nfunc _ready():\n    □□□□",
        "options": [
          "eroe[\"vita\"] = 100",
          "eroe.append(\"vita\", 100)",
          "eroe.size(\"vita\")",
          "eroe[0] = \"vita\""
        ],
        "correct": [
          0
        ],
        "explanation": "Per creare o aggiornare una coppia chiave-valore usa la chiave tra parentesi quadre.",
        "hint": "Confronta l'assegnazione dei dizionari con quella degli Array."
      }
    ]
  },
  {
    "id": 220,
    "chapterId": 10,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Che cosa restituisce `{ \"oro\": 30 }.get(\"gemme\", 0)`?",
        "options": [
          "0",
          "30",
          "\"gemme\"",
          "true"
        ],
        "correct": [
          0
        ],
        "explanation": "get usa il valore di fallback quando la chiave richiesta manca.",
        "hint": "Valuta il secondo argomento del metodo."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali attività sono adatte a un Dictionary di statistiche?",
        "options": [
          "Leggere la salute tramite chiave",
          "Aggiornare il valore dell'attacco",
          "Controllare l'esistenza di una chiave",
          "Supporre che l'ordine delle chiavi sia sempre quello di un Array"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Il dizionario organizza attributi per nome; non richiede indici numerici consecutivi.",
        "hint": "Ragiona sulle associazioni nome-valore."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Leggi la difesa usando zero se la chiave manca.",
        "code": "var nemico = {\"hp\": 80}\nfunc _ready():\n    var difesa = □□□□",
        "options": [
          "nemico.get(\"difesa\", 0)",
          "nemico[\"difesa\"]",
          "nemico.has(\"hp\")",
          "nemico.erase(\"difesa\")"
        ],
        "correct": [
          0
        ],
        "explanation": "get può restituire un valore alternativo senza accesso diretto a una chiave mancante.",
        "hint": "Serve un metodo di lettura con valore predefinito."
      }
    ]
  },
  {
    "id": 221,
    "chapterId": 11,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Perché i segnali sono utili tra nodi Godot?",
        "options": [
          "Permettono di reagire a eventi senza collegare rigidamente tutti i componenti",
          "Trasformano automaticamente un nodo in Sprite2D",
          "Sostituiscono l'esecuzione delle funzioni",
          "Impediscono di usare parametri"
        ],
        "correct": [
          0
        ],
        "explanation": "I segnali separano chi annuncia un evento da chi vi reagisce.",
        "hint": "Pensa a chi emette e a chi ascolta un evento."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali elementi fanno parte di un sistema di segnali?",
        "options": [
          "Dichiarazione signal",
          "Connessione connect",
          "Emissione emit",
          "Aggiornamento obbligatorio dentro while"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Un segnale non richiede necessariamente un ciclo while.",
        "hint": "Riconosci le fasi dell'invio e dell'ascolto."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa l'emissione dell'evento dopo la connessione.",
        "code": "signal porta_aperta\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    □□□□\nfunc quando_aperta():\n    print(\"Porta aperta\")",
        "options": [
          "porta_aperta.emit()",
          "porta_aperta.connect()",
          "porta_aperta = true",
          "porta_aperta.print()"
        ],
        "correct": [
          0
        ],
        "explanation": "emit notifica tutti gli ascoltatori collegati.",
        "hint": "Cerca l'operazione che invia e non quella che registra."
      }
    ]
  },
  {
    "id": 222,
    "chapterId": 11,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Che cosa riceve una callback collegata a `signal colpito(danno)` quando il segnale emette 25?",
        "options": [
          "Il valore 25 come argomento",
          "Sempre true",
          "Il nome testuale del segnale",
          "Un nuovo nodo"
        ],
        "correct": [
          0
        ],
        "explanation": "Gli argomenti del segnale vengono inoltrati alla funzione collegata.",
        "hint": "Pensa al passaggio di dati tra evento e ascoltatore."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali sono buone pratiche nell'uso dei segnali?",
        "options": [
          "Collegare la callback prima dell'emissione che vuoi osservare",
          "Usare parametri per trasmettere dati dell'evento",
          "Separare il produttore dell'evento dal codice che aggiorna la UI",
          "Stampare il segnale invece di emetterlo"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "La stampa in console non equivale all'emissione di un evento.",
        "hint": "Distingui un'osservazione da una notifica ai listener."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Invia un evento con il valore della nuova salute.",
        "code": "signal salute_cambiata(hp)\nfunc _ready():\n    □□□□",
        "options": [
          "salute_cambiata.emit(75)",
          "salute_cambiata.connect(75)",
          "salute_cambiata = 75",
          "print(salute_cambiata(75))"
        ],
        "correct": [
          0
        ],
        "explanation": "Il parametro della notifica viene passato nella chiamata di emissione.",
        "hint": "Devi inviare un dato, non registrare un ascoltatore."
      }
    ]
  },
  {
    "id": 223,
    "chapterId": 12,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Cosa crea l'espressione `Personaggio.new()` quando Personaggio è una classe?",
        "options": [
          "Una nuova istanza della classe",
          "Una nuova classe chiamata Personaggio",
          "Una stringa con il nome della classe",
          "Un nuovo segnale globale"
        ],
        "correct": [
          0
        ],
        "explanation": "new istanzia un oggetto che può conservare il proprio stato.",
        "hint": "Distinguere definizione di classe e oggetto concreto."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali elementi possono appartenere a una classe GDScript?",
        "options": [
          "Proprietà",
          "Metodi",
          "Costruttore _init()",
          "Obbligatoriamente un nodo visivo"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Una classe non deve per forza rappresentare un elemento visivo.",
        "hint": "Considera dati e comportamenti dell'oggetto."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il costruttore che riceve il nome.",
        "code": "class Eroe:\n    var nome\n    func _init(n):\n        □□□□",
        "options": [
          "self.nome = n",
          "var n = self",
          "return nome = n",
          "self = n"
        ],
        "correct": [
          0
        ],
        "explanation": "Il parametro deve finire nella proprietà dell'istanza.",
        "hint": "Assegna il dato ricevuto al campo dell'oggetto."
      }
    ]
  },
  {
    "id": 224,
    "chapterId": 12,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Se `a` e `b` sono due istanze indipendenti, cosa succede quando cambi `a.hp`?",
        "options": [
          "b.hp resta invariato, salvo riferimenti condivisi espliciti",
          "b.hp cambia sempre nello stesso modo",
          "Entrambe le istanze vengono eliminate",
          "Godot nega tutte le modifiche"
        ],
        "correct": [
          0
        ],
        "explanation": "Oggetti diversi mantengono normalmente proprietà d'istanza separate.",
        "hint": "Immagina due personaggi creati dalla stessa classe."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali vantaggi offre definire comportamenti come metodi?",
        "options": [
          "Riutilizzare logica su più istanze",
          "Organizzare comportamenti insieme ai dati",
          "Consentire a ogni istanza di agire sul proprio stato",
          "Evitare sempre la necessità di creare oggetti"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "I metodi migliorano organizzazione e riuso ma non sostituiscono gli oggetti.",
        "hint": "Valuta il rapporto tra classe, istanza e comportamento."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa un metodo che restituisce il danno calcolato.",
        "code": "class Arma:\n    var attacco = 10\n    func danno_doppio():\n        □□□□",
        "options": [
          "return attacco * 2",
          "print(attacco * 2)",
          "attacco == 20",
          "return \"attacco\""
        ],
        "correct": [
          0
        ],
        "explanation": "La funzione deve fornire un numero a chi la richiama.",
        "hint": "Non basta mostrare il valore nella console."
      }
    ]
  },
  {
    "id": 225,
    "chapterId": 13,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Che cosa rappresenta la struttura Scene Tree?",
        "options": [
          "La gerarchia dei nodi che compongono la scena",
          "Una lista di soli file audio",
          "La cronologia dei print",
          "La sequenza dei tasti premuti"
        ],
        "correct": [
          0
        ],
        "explanation": "SceneTree organizza nodi in relazioni di parentela.",
        "hint": "Pensa alla struttura padre-figlio."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali operazioni sono legate a un nodo Godot?",
        "options": [
          "Leggerne il nome",
          "Accedere a un figlio",
          "Aggiungere un figlio con add_child()",
          "Usarlo sempre senza un parent nell'albero"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "I nodi possono avere relazioni gerarchiche e proprietà.",
        "hint": "Considera le azioni su un oggetto nella scena."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Aggiorna il testo del Label figlio `Titolo`.",
        "code": "extends Node\nfunc _ready():\n    □□□□",
        "options": [
          "$Titolo.text = \"Pronto\"",
          "$Titolo.name = 40",
          "$Titolo = \"Pronto\"",
          "$Titolo.append(\"Pronto\")"
        ],
        "correct": [
          0
        ],
        "explanation": "I nodi Label espongono una proprietà testuale.",
        "hint": "Modifica la proprietà che il nodo visualizza."
      }
    ]
  },
  {
    "id": 226,
    "chapterId": 13,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Che cosa permette di fare `add_child(nodo)`?",
        "options": [
          "Inserisce il nodo come figlio nell'albero della scena",
          "Stampa il nome del nodo",
          "Elimina il nodo dalla memoria",
          "Converte il nodo in un Dictionary"
        ],
        "correct": [
          0
        ],
        "explanation": "add_child crea una relazione padre-figlio nel SceneTree.",
        "hint": "Osserva il verbo usato dal metodo."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali precauzioni sono utili quando cerchi un nodo?",
        "options": [
          "Controllare il percorso rispetto al nodo corrente",
          "Considerare che il nome potrebbe essere errato",
          "Usare get_node_or_null() quando un nodo può mancare",
          "Supporre che $QualsiasiNome esista sempre"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "I percorsi dipendono dalla gerarchia e un nodo potrebbe non esistere.",
        "hint": "Un riferimento a un nodo deve corrispondere alla scena reale."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Crea un nodo generico e aggiungilo come figlio.",
        "code": "extends Node\nfunc _ready():\n    var figlio = Node.new()\n    □□□□",
        "options": [
          "add_child(figlio)",
          "figlio.queue_free()",
          "print(figlio)",
          "figlio = null"
        ],
        "correct": [
          0
        ],
        "explanation": "Il nodo appena creato deve entrare nell'albero.",
        "hint": "Quale operazione stabilisce la relazione con il genitore?"
      }
    ]
  },
  {
    "id": 227,
    "chapterId": 14,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Che cosa indica il segnale `pressed` di un Button?",
        "options": [
          "Che il pulsante è stato premuto",
          "Che il nodo è stato eliminato",
          "Che è cambiato il tempo del Timer",
          "Che la scena è stata caricata"
        ],
        "correct": [
          0
        ],
        "explanation": "pressed rappresenta l'interazione dell'utente con un pulsante.",
        "hint": "Considera l'evento che vuoi ascoltare nell'interfaccia."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali elementi sono appropriati per costruire un clicker?",
        "options": [
          "Button per ricevere il clic",
          "Label per mostrare il punteggio",
          "Una variabile per conservare i punti",
          "Un segnale personalizzato obbligatorio per ogni clic"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Il clicker può usare direttamente pressed del Button.",
        "hint": "Distingui componenti necessari da possibili estensioni."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Collega il pulsante a una callback definita nello script.",
        "code": "func _ready():\n    □□□□\nfunc al_click():\n    print(\"Clic\")",
        "options": [
          "$ClickBtn.pressed.connect(al_click)",
          "$ClickBtn.pressed.emit(al_click)",
          "$ClickBtn.text = al_click",
          "$ClickBtn.queue_free()"
        ],
        "correct": [
          0
        ],
        "explanation": "connect registra la funzione da chiamare quando il pulsante sarà premuto.",
        "hint": "Non stai simulando il clic: stai configurando il suo comportamento."
      }
    ]
  },
  {
    "id": 228,
    "chapterId": 14,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "Perché il contatore del clicker deve essere una variabile persistente nello script?",
        "options": [
          "Per conservare il valore tra clic successivi",
          "Per impedire il collegamento del segnale",
          "Per trasformare un Label in Button",
          "Per ricreare la scena a ogni clic"
        ],
        "correct": [
          0
        ],
        "explanation": "Una variabile di stato resta disponibile tra invocazioni della callback.",
        "hint": "Pensa a cosa deve sopravvivere dopo una singola pressione."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali azioni danno un feedback corretto dopo un clic?",
        "options": [
          "Incrementare la variabile punti",
          "Aggiornare PuntiLabel.text",
          "Eseguire un comportamento nella callback",
          "Stampare soltanto il codice sorgente del pulsante"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "L'interfaccia deve riflettere lo stato aggiornato del gioco.",
        "hint": "Considera sia il modello dei dati sia quello che vede il giocatore."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa il testo della label usando il numero di punti.",
        "code": "var punti = 3\nfunc aggiorna():\n    $PuntiLabel.text = □□□□",
        "options": [
          "\"Punti: \" + str(punti)",
          "\"Punti: \" + punti",
          "punti = \"Punti\"",
          "$PuntiLabel.pressed"
        ],
        "correct": [
          0
        ],
        "explanation": "Il numero deve essere convertito in testo per unirlo al prefisso.",
        "hint": "Il valore mostrato deve variare insieme al punteggio."
      }
    ]
  },
  {
    "id": 229,
    "chapterId": 15,
    "part": 1,
    "title": "Controllo delle basi",
    "description": "Verifica ciò che hai appena imparato prima di continuare.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "A che cosa serve un nodo Timer?",
        "options": [
          "Attivare un'azione dopo un intervallo o periodicamente",
          "Calcolare la posizione X di un nodo",
          "Contenere i file di una scena",
          "Collegare automaticamente tutti i segnali"
        ],
        "correct": [
          0
        ],
        "explanation": "Il Timer può emettere timeout dopo il tempo impostato.",
        "hint": "Concentrati sul comportamento temporale."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali proprietà o segnali sono associati a Timer?",
        "options": [
          "wait_time",
          "one_shot",
          "timeout",
          "pressed"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "pressed è associato ai pulsanti, non al Timer.",
        "hint": "Distingui eventi temporali e di interfaccia."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Avvia un Timer già configurato dopo aver connesso timeout.",
        "code": "func _ready():\n    $Cooldown.timeout.connect(fine)\n    □□□□\nfunc fine():\n    print(\"Pronto\")",
        "options": [
          "$Cooldown.start()",
          "$Cooldown.emit()",
          "$Cooldown.free_time()",
          "$Cooldown.pressed()"
        ],
        "correct": [
          0
        ],
        "explanation": "Il timer va avviato per iniziare il conto alla rovescia.",
        "hint": "Un collegamento del segnale non mette in moto automaticamente il Timer."
      }
    ]
  },
  {
    "id": 230,
    "chapterId": 15,
    "part": 2,
    "title": "Ragiona e completa",
    "description": "Applica il ragionamento anche a situazioni nuove, prima del consolidamento.",
    "xp": 35,
    "questions": [
      {
        "id": "q1",
        "type": "single",
        "prompt": "A cosa serve `queue_free()` su un nodo?",
        "options": [
          "Ne programma l'eliminazione in sicurezza",
          "Ne avvia un timer infinito",
          "Ne duplica il contenuto",
          "Modifica la texture"
        ],
        "correct": [
          0
        ],
        "explanation": "queue_free mette il nodo in coda per la rimozione.",
        "hint": "Confronta l'eliminazione con la gestione temporale."
      },
      {
        "id": "q2",
        "type": "multi",
        "prompt": "Quali affermazioni sono corrette per movimento e aggiornamento?",
        "options": [
          "delta rappresenta tempo trascorso in secondi",
          "Una velocità in unità al secondo va moltiplicata per delta",
          "_physics_process(delta) si usa per il passo fisico",
          "_process(delta) viene richiamata una sola volta all'avvio"
        ],
        "correct": [
          0,
          1,
          2
        ],
        "explanation": "Il ciclo di vita distingue avvio e aggiornamenti ripetuti.",
        "hint": "Confronta la frequenza delle callback e il tempo trascorso."
      },
      {
        "id": "q3",
        "type": "code",
        "prompt": "Completa l'avanzamento indipendente dal numero di frame.",
        "code": "extends Node\nvar posizione = 0.0\nfunc _process(delta):\n    □□□□",
        "options": [
          "posizione += 100.0 * delta",
          "posizione += 100.0",
          "posizione = delta",
          "posizione *= delta"
        ],
        "correct": [
          0
        ],
        "explanation": "La velocità deve essere scalata per il tempo trascorso.",
        "hint": "Considera la differenza tra unità per secondo e unità per frame."
      }
    ]
  }
];
  const byId=new Map(sessions.map(s=>[s.id,s]));
  const validate=(session)=>{
    if(session.questions.length!==3)throw Error('Quiz senza 3 domande: '+session.id);
    for(const q of session.questions){
      if(!['single','multi','code'].includes(q.type)||q.options.length!==4)
        throw Error('Formato quiz non valido: '+session.id+'/'+q.id);
      if(q.type==='multi' ? q.correct.length<2 : q.correct.length!==1)
        throw Error('Risposte non valide: '+session.id+'/'+q.id);
      if(q.correct.some(i=>!Number.isInteger(i)||i<0||i>=q.options.length))
        throw Error('Indice risposta fuori intervallo: '+session.id+'/'+q.id);
      if(q.type==='code' && !q.code.includes('□□□□'))
        throw Error('Codice incompleto non valido: '+session.id+'/'+q.id);
    }
  };
  sessions.forEach(validate);
  if(typeof LESSONS_DATA==='undefined'||!Array.isArray(LESSONS_DATA))
    throw Error('Caricare chapter_quizzes.js dopo curriculum_extension.js');
  const all=[];
  for(let chapter=1;chapter<=15;chapter++){
    const original=LESSONS_DATA.filter(l=>l.chapterId===chapter);
    const consolidation=original.filter(l=>l.isConsolidation);
    if(consolidation.length!==1||original.length<5)
      throw Error('Sequenza del capitolo non riconosciuta: '+chapter);
    const a=byId.get(201+(chapter-1)*2),b=byId.get(202+(chapter-1)*2);
    const adapt=s=>({
      id:s.id,chapterId:s.chapterId,isQuiz:true,isMastery:false,
      title:'Quiz · '+s.title,quizQuestions:s.questions,
      quizDescription:s.description,xp:s.xp
    });
    all.push(...original.slice(0,2),adapt(a),...original.slice(2,-1),adapt(b),original.at(-1));
  }
  LESSONS_DATA.splice(0,LESSONS_DATA.length,...all);
  // Numerazione visuale indipendente dagli ID di salvataggio e verifica.
  let index=0;
  for(const lesson of LESSONS_DATA){
    lesson.displayIndex=++index;
    lesson.title=lesson.displayIndex+'. '+String(lesson.title).replace(/^\d+\.\s*/,'');
  }
  window.GDHChapterQuizzes=Object.freeze({
    sessions:Object.freeze(sessions),
    get:id=>byId.get(id)||null,
    grade:(session,answers)=>{
      if(!session||!Array.isArray(session.questions))throw Error('Quiz sconosciuto');
      return session.questions.map(q=>{
        const chosen=Array.isArray(answers?.[q.id])?answers[q.id]:[];
        const correct=q.correct;
        return {questionId:q.id,correct:chosen.length===correct.length&&
          chosen.every(i=>correct.includes(i)),selected:chosen.slice()};
      });
    }
  });
})();
