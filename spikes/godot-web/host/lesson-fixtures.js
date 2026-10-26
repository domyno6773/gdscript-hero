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
  },
  {
    "id": 13,
    "chapter": 4,
    "title": "13. Operazioni aritmetiche (+, -, *, /, %)",
    "initialCode": "func _ready():\n    # Calcola somma (10 + 5) e prodotto (5 * 2), poi stampali\n    pass\n",
    "solution": "func _ready():\n    var somma = 10 + 5\n    var prodotto = 5 * 2\n    print(somma)\n    print(prodotto)\n",
    "task": "Calcola la somma: var somma = 10 + 5 e stampala. Calcola la moltiplicazione: var prodotto = 5 * 2 e stampala.",
    "expectedOutput": "15\n10",
    "locals": [
      "somma",
      "prodotto"
    ],
    "properties": []
  },
  {
    "id": 14,
    "chapter": 4,
    "title": "14. Assegnazioni rapide (+=, -=)",
    "initialCode": "func _ready():\n    # Crea punti_vita = 100, sottrai 20 con -= e stampa\n    pass\n",
    "solution": "func _ready():\n    var punti_vita = 100\n    punti_vita -= 20\n    print(punti_vita)\n",
    "task": "Crea punti_vita = 100 . Sottrai 20 usando punti_vita -= 20 . Stampa il valore finale di punti_vita (80).",
    "expectedOutput": "80",
    "locals": [
      "punti_vita"
    ],
    "properties": []
  },
  {
    "id": 15,
    "chapter": 4,
    "title": "15. Calcolo del danno, punteggi e monete",
    "initialCode": "func _ready():\n    # Calcola monete_totali e stampala\n    pass\n",
    "solution": "func _ready():\n    var monete_base = 50\n    var moltiplicatore = 3\n    var monete_totali = monete_base * moltiplicatore\n    print(monete_totali)\n",
    "task": "Dichiara monete_base = 50 . Dichiara moltiplicatore = 3 . Crea monete_totali = monete_base * moltiplicatore e stampala.",
    "expectedOutput": "150",
    "locals": [
      "monete_base",
      "moltiplicatore",
      "monete_totali"
    ],
    "properties": []
  },
  {
    "id": 16,
    "chapter": 4,
    "title": "16. ⭐ Sfida di Apprendimento: Bottino del Dungeon e Danno Subito",
    "initialCode": "extends Node\n\nfunc _ready():\n    var salute_rimasta = 100\n    # Aggiorna salute_rimasta e calcola monete_per_membro e monete_avanzate sotto\n    \n    # Non modificare le righe sotto\n    print(\"Salute Guerriero: \", salute_rimasta)\n    print(\"Monete per membro: \", monete_per_membro)\n    print(\"Monete avanzate: \", monete_avanzate)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var salute_rimasta = 100\n    salute_rimasta -= 35\n    var monete_per_membro = 100 / 3\n    var monete_avanzate = 100 % 3\n    \n    # Non modificare le righe sotto\n    print(\"Salute Guerriero: \", salute_rimasta)\n    print(\"Monete per membro: \", monete_per_membro)\n    print(\"Monete avanzate: \", monete_avanzate)\n",
    "task": "Sottrai 35 da salute_rimasta con -= Calcola var monete_per_membro = 100 / 3 Calcola var monete_avanzate = 100 % 3",
    "expectedOutput": "Salute Guerriero: 65\nMonete per membro: 33\nMonete avanzate: 1",
    "locals": [
      "salute_rimasta",
      "monete_per_membro",
      "monete_avanzate"
    ],
    "properties": []
  },
  {
    "id": 17,
    "chapter": 5,
    "title": "17. Operatori di confronto (==, !=, >, <)",
    "initialCode": "func _ready():\n    var livello = 10\n    # Confronta con >= e stampa\n    pass\n",
    "solution": "func _ready():\n    var livello = 10\n    if livello >= 10:\n        print(\"Livello raggiunto!\")\n",
    "task": "Dichiara livello = 10 . Se livello >= 10: , stampa \"Livello raggiunto!\" .",
    "expectedOutput": "Livello raggiunto!",
    "locals": [
      "livello"
    ],
    "properties": []
  },
  {
    "id": 18,
    "chapter": 5,
    "title": "18. Operatori logici (and, or, not)",
    "initialCode": "func _ready():\n    var ha_chiave = true\n    var porta_chiusa = true\n    # Combina con and e stampa\n    pass\n",
    "solution": "func _ready():\n    var ha_chiave = true\n    var porta_chiusa = true\n    if ha_chiave and porta_chiusa:\n        print(\"Accesso consentito\")\n",
    "task": "Dichiara ha_chiave = true e porta_chiusa = true . Se ha_chiave and porta_chiusa: stampa \"Accesso consentito\" .",
    "expectedOutput": "Accesso consentito",
    "locals": [
      "ha_chiave",
      "porta_chiusa"
    ],
    "properties": []
  },
  {
    "id": 19,
    "chapter": 5,
    "title": "19. Logica gameplay (Game Over con if / else)",
    "initialCode": "func _ready():\n    var punti_vita = 0\n    # BUG LOGICO: Manca il ramo 'else:' per quando il giocatore e' ancora in vita!\n    # Aggiungi il ramo 'else:' per stampare \"In battaglia\":\n    if punti_vita <= 0:\n        print(\"Game Over\")\n",
    "solution": "func _ready():\n    var punti_vita = 0\n    if punti_vita <= 0:\n        print(\"Game Over\")\n    else:\n        print(\"In battaglia\")\n",
    "task": "Dichiara punti_vita = 0 . Se punti_vita stampa \"Game Over\" . Altrimenti ( else: ) stampa \"In battaglia\" .",
    "expectedOutput": "Game Over",
    "locals": [
      "punti_vita"
    ],
    "properties": []
  },
  {
    "id": 20,
    "chapter": 5,
    "title": "20. ⭐ Sfida di Apprendimento: Il Portale Antico del Tempio",
    "initialCode": "extends Node\n\nfunc _ready():\n    var energia = 75\n    var ha_amuleto = true\n    var ha_chiave = false\n    var stato_portale = \"\"\n    \n    # Scrivi la catena if / elif / else sotto\n    \n    # Non modificare la riga sotto\n    print(\"Stato: \", stato_portale)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var energia = 75\n    var ha_amuleto = true\n    var ha_chiave = false\n    var stato_portale = \"\"\n    \n    if energia >= 50 and (ha_amuleto or ha_chiave):\n        stato_portale = \"Portale Attivato\"\n    elif energia < 50:\n        stato_portale = \"Energia Insufficiente\"\n    else:\n        stato_portale = \"Nessuna Reliquia Trovata\"\n        \n    # Non modificare la riga sotto\n    print(\"Stato: \", stato_portale)\n",
    "task": "Se energia >= 50 and (ha_amuleto or ha_chiave) : imposta \"Portale Attivato\" Se energia : imposta \"Energia Insufficiente\" Altrimenti: imposta \"Nessuna Reliquia Trovata\"",
    "expectedOutput": "Stato: Portale Attivato",
    "locals": [
      "energia",
      "ha_amuleto",
      "ha_chiave",
      "stato_portale"
    ],
    "properties": []
  },
  {
    "id": 21,
    "chapter": 6,
    "title": "21. Creare un inventario con gli Array",
    "initialCode": "func _ready():\n    # Crea l'inventario e stampa il primo elemento\n    pass\n",
    "solution": "func _ready():\n    var inventario = [\"Spada\", \"Scudo\", \"Pozione\"]\n    print(inventario[0])\n",
    "task": "Crea inventario = [\"Spada\", \"Scudo\", \"Pozione\"] . Stampa il primo oggetto dell'inventario ( inventario[0] ).",
    "expectedOutput": "Spada",
    "locals": [
      "inventario"
    ],
    "properties": []
  },
  {
    "id": 22,
    "chapter": 6,
    "title": "22. Accesso per indice",
    "initialCode": "func _ready():\n    var oggetti = [\"Spada\", \"Scudo\", \"Pozione\"]\n    # BUG DI INDICE: Gli array in GDScript partono da [0]!\n    # Correggi gli indici sotto per stampare 'Scudo' (2° elemento) e 'Pozione' (3° elemento):\n    print(oggetti[0])\n    print(oggetti[1])\n",
    "solution": "func _ready():\n    var oggetti = [\"Spada\", \"Scudo\", \"Pozione\"]\n    print(oggetti[1])\n    print(oggetti[2])\n",
    "task": "Dato oggetti = [\"Spada\", \"Scudo\", \"Pozione\"] . Stampa il secondo elemento ( oggetti[1] ) e poi il terzo ( oggetti[2] ).",
    "expectedOutput": "Scudo\nPozione",
    "locals": [
      "oggetti"
    ],
    "properties": []
  },
  {
    "id": 23,
    "chapter": 6,
    "title": "23. Metodi append() e size()",
    "initialCode": "func _ready():\n    var inventario = [\"Mappa\", \"Bussola\"]\n    # Aggiungi \"Torcia\" e stampa la dimensione\n    pass\n",
    "solution": "func _ready():\n    var inventario = [\"Mappa\", \"Bussola\"]\n    inventario.append(\"Torcia\")\n    print(inventario.size())\n",
    "task": "Crea inventario = [\"Mappa\", \"Bussola\"] . Aggiungi \"Torcia\" con inventario.append(\"Torcia\") . Stampa la dimensione dell'array con print(inventario.size()) .",
    "expectedOutput": "3",
    "locals": [
      "inventario"
    ],
    "properties": []
  },
  {
    "id": 24,
    "chapter": 6,
    "title": "24. ⭐ Sfida di Apprendimento: Gestione dello Zaino d'Avventura",
    "initialCode": "extends Node\n\nfunc _ready():\n    var zaino = [\"Spada\", \"Ramo Secco\", \"Pozione di Vita\"]\n    \n    # Modifica lo zaino e crea ha_cura e totale_slot sotto\n    \n    # Non modificare le righe sotto\n    print(\"Zaino: \", zaino)\n    print(\"Ha pozione: \", ha_cura)\n    print(\"Totale slot: \", totale_slot)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var zaino = [\"Spada\", \"Ramo Secco\", \"Pozione di Vita\"]\n    \n    zaino.append(\"Arco Elfico\")\n    zaino.erase(\"Ramo Secco\")\n    var ha_cura = zaino.has(\"Pozione di Vita\")\n    var totale_slot = zaino.size()\n    \n    # Non modificare le righe sotto\n    print(\"Zaino: \", zaino)\n    print(\"Ha pozione: \", ha_cura)\n    print(\"Totale slot: \", totale_slot)\n",
    "task": "zaino.append(\"Arco Elfico\") zaino.erase(\"Ramo Secco\") var ha_cura = zaino.has(\"Pozione di Vita\") var totale_slot = zaino.size()",
    "expectedOutput": "Zaino: [\"Spada\", \"Pozione di Vita\", \"Arco Elfico\"]\nHa pozione: true\nTotale slot: 3",
    "locals": [
      "zaino",
      "ha_cura",
      "totale_slot"
    ],
    "properties": []
  }
];
