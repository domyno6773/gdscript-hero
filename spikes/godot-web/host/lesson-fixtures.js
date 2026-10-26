/* Snapshot from lessons.js on experimental branch: DO NOT modify production lessons. */
window.GDHLessonFixtures = [
  {
    "id": 1,
    "chapter": 1,
    "title": "1. Benvenuto in GDScript 4 (print)",
    "initialCode": "func _ready():\n    # Stampa esattamente: \"Ciao Godot!\"\n    pass\n",
    "solution": "func _ready():\n    print(\"Ciao Godot!\")\n",
    "task": "All'interno della funzione _ready() , usa print(...) per stampare esattamente: \"Ciao Godot!\" Presta attenzione alle lettere maiuscole e al punto esclamativo finale.",
    "expectedOutput": "Ciao Godot!",
    "locals": [],
    "properties": []
  },
  {
    "id": 2,
    "chapter": 1,
    "title": "2. Come funzionano i commenti (#)",
    "initialCode": "func _ready():\n    # Inserisci il tuo commento e stampa la frase richiesta\n    pass\n",
    "solution": "func _ready():\n    # Inizializzazione gioco\n    print(\"Benvenuto nel gioco\")\n",
    "task": "Aggiungi una riga di commento che inizia con # . Subito sotto, stampa: \"Benvenuto nel gioco\" .",
    "expectedOutput": "Benvenuto nel gioco",
    "locals": [],
    "properties": []
  },
  {
    "id": 3,
    "chapter": 1,
    "title": "3. Stampare valori multipli e numeri",
    "initialCode": "func _ready():\n    # Stampa \"Livello\" e poi il numero 1\n    pass\n",
    "solution": "func _ready():\n    print(\"Livello\")\n    print(1)\n",
    "task": "Stampa prima il testo \"Livello\" . Nella riga successiva stampa il numero 1 (senza virgolette).",
    "expectedOutput": "Livello\n1",
    "locals": [],
    "properties": []
  },
  {
    "id": 4,
    "chapter": 1,
    "title": "4. ⭐ Sfida di Apprendimento: Terminale di Avvio della Nave",
    "initialCode": "extends Node\n\nfunc _ready():\n    print(\"=== AVVIO SISTEMA ===\")\n    # Aggiungi il commento e le due istruzioni print() sotto\n    \n    # Non modificare la riga sotto\n    print(\"=== DIAGNOSTICA COMPLETATA ===\")\n",
    "solution": "extends Node\n\nfunc _ready():\n    print(\"=== AVVIO SISTEMA ===\")\n    # Diagnostica reattori\n    print(\"Sistema: Godot OS\")\n    print(\"Energia: \", 100, \"%\")\n    print(\"=== DIAGNOSTICA COMPLETATA ===\")\n",
    "task": "Aggiungi il commento # Diagnostica reattori Stampa \"Sistema: Godot OS\" Stampa con valori multipli: \"Energia: \", 100, \"%\"",
    "expectedOutput": "=== AVVIO SISTEMA ===\nSistema: Godot OS\nEnergia: 100 %\n=== DIAGNOSTICA COMPLETATA ===",
    "locals": [],
    "properties": []
  },
  {
    "id": 5,
    "chapter": 2,
    "title": "5. Creazione di variabili con var",
    "initialCode": "func _ready():\n    # Dichiara la variabile nome e stampala\n    pass\n",
    "solution": "func _ready():\n    var nome = \"Eroe\"\n    print(nome)\n",
    "task": "Dichiara una variabile chiamata nome e assegnale il valore \"Eroe\" . Stampa la variabile usando print(nome) (senza virgolette attorno a nome).",
    "expectedOutput": "Eroe",
    "locals": [
      "nome"
    ],
    "properties": []
  },
  {
    "id": 6,
    "chapter": 2,
    "title": "6. Tipi di testo (String) e interi (int)",
    "initialCode": "func _ready():\n    # BUG DI SINTASSI: Manca la delimitazione della stringa!\n    # Correggi la riga sotto affinché 'Eroe' sia una stringa racchiusa tra virgolette:\n    var nome_giocatore = Eroe\n    print(nome_giocatore)\n",
    "solution": "func _ready():\n    var personaggio = \"Guerriero\"\n    var punti_vita = 100\n    print(personaggio)\n    print(punti_vita)\n",
    "task": "Crea la variabile personaggio con valore \"Guerriero\" . Crea la variabile punti_vita con valore intero 100 . Stampa entrambe le variabili su righe separate.",
    "expectedOutput": "Guerriero\n100",
    "locals": [
      "personaggio",
      "punti_vita"
    ],
    "properties": []
  },
  {
    "id": 7,
    "chapter": 2,
    "title": "7. Concatenazione di stringhe",
    "initialCode": "func _ready():\n    # Concatena \"Giocatore: \" con la variabile nome e stampa\n    pass\n",
    "solution": "func _ready():\n    var nome = \"Eroe\"\n    var messaggio = \"Giocatore: \" + nome\n    print(messaggio)\n",
    "task": "Dichiara nome = \"Eroe\" . Dichiara messaggio = \"Giocatore: \" + nome . Stampa la variabile messaggio .",
    "expectedOutput": "Giocatore: Eroe",
    "locals": [
      "nome",
      "messaggio"
    ],
    "properties": []
  },
  {
    "id": 8,
    "chapter": 2,
    "title": "8. ⭐ Sfida di Apprendimento: Dialoghi e Codice Segreto",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Crea title, npc_line e door_code sotto\n    \n    # Non modificare le righe sotto\n    print(\"Title: \", title)\n    print(\"NPC: \", npc_line)\n    print(\"Door code: \", door_code)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var title = 'The \"Lost\" Key'\n    var npc_line = \"It's dangerous to go alone!\"\n    var door_code = \"0420\"\n    \n    # Non modificare le righe sotto\n    print(\"Title: \", title)\n    print(\"NPC: \", npc_line)\n    print(\"Door code: \", door_code)\n",
    "task": "Crea title con The \"Lost\" Key Crea npc_line con It's dangerous to go alone! Crea door_code con la stringa 0420",
    "expectedOutput": "Title: The \"Lost\" Key\nNPC: It's dangerous to go alone!\nDoor code: 0420",
    "locals": [
      "title",
      "npc_line",
      "door_code"
    ],
    "properties": []
  },
  {
    "id": 9,
    "chapter": 3,
    "title": "9. Numeri decimali (float) e Booleani (bool)",
    "initialCode": "func _ready():\n    # Dichiara velocita (float) e ha_chiave (bool)\n    pass\n",
    "solution": "func _ready():\n    var velocita = 4.5\n    var ha_chiave = true\n    print(velocita)\n    print(ha_chiave)\n",
    "task": "Dichiara velocita = 4.5 . Dichiara ha_chiave = true . Stampa entrambe le variabili su righe separate.",
    "expectedOutput": "4.5\ntrue",
    "locals": [
      "velocita",
      "ha_chiave"
    ],
    "properties": []
  },
  {
    "id": 10,
    "chapter": 3,
    "title": "10. Tipizzazione statica esplicita",
    "initialCode": "func _ready():\n    # Dichiara con tipizzazione statica: var vita: int = 100\n    pass\n",
    "solution": "func _ready():\n    var vita: int = 100\n    print(vita)\n",
    "task": "Dichiara una variabile tipizzata esplicitamente: var vita: int = 100 . Stampa vita sulla console.",
    "expectedOutput": "100",
    "locals": [
      "vita"
    ],
    "properties": []
  },
  {
    "id": 11,
    "chapter": 3,
    "title": "11. Costanti con const",
    "initialCode": "func _ready():\n    # Dichiara la costante GRAVITA e stampala\n    pass\n",
    "solution": "func _ready():\n    const GRAVITA = 9.8\n    print(GRAVITA)\n",
    "task": "Dichiara la costante: const GRAVITA = 9.8 . Stampa la costante con print(GRAVITA) .",
    "expectedOutput": "9.8",
    "locals": [
      "GRAVITA"
    ],
    "properties": []
  },
  {
    "id": 12,
    "chapter": 3,
    "title": "12. ⭐ Sfida di Apprendimento: Scheda Eroe RPG Tipizzata",
    "initialCode": "extends Node\n\n# Dichiara la costante MAX_HP sotto\n\nfunc _ready():\n    # Crea eroe, salute e scudo_attivo sotto\n    \n    # Non modificare le righe sotto\n    print(\"Eroe: \", eroe)\n    print(\"HP: \", salute, \" / \", MAX_HP)\n    print(\"Scudo: \", scudo_attivo)\n",
    "solution": "extends Node\n\nconst MAX_HP: int = 200\n\nfunc _ready():\n    var eroe: String = \"Valerius\"\n    var salute: int = 150\n    var scudo_attivo := true\n    \n    # Non modificare le righe sotto\n    print(\"Eroe: \", eroe)\n    print(\"HP: \", salute, \" / \", MAX_HP)\n    print(\"Scudo: \", scudo_attivo)\n",
    "task": "Dichiara const MAX_HP: int = 200 Dichiara var eroe: String = \"Valerius\" Dichiara var salute: int = 150 Dichiara var scudo_attivo := true con inferenza :=",
    "expectedOutput": "Eroe: Valerius\nHP: 150 / 200\nScudo: true",
    "locals": [
      "MAX_HP",
      "eroe",
      "salute",
      "scudo_attivo"
    ],
    "properties": []
  }
];
