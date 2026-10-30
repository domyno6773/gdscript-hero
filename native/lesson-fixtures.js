/* Native lesson fixture snapshot */
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
    "task": "Stampa Sistema: Godot OS ed Energia: 100%; i commenti sono facoltativi",
    "expectedOutput": "=== AVVIO SISTEMA ===\nSistema: Godot OS\nEnergia: 100%\n=== DIAGNOSTICA COMPLETATA ===",
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
    "initialCode": "func _ready():\n    # BUG DI SINTASSI: mancano le virgolette attorno al nome del personaggio!\n    # Correggi \"Guerriero\", poi verifica la variabile intera punti_vita.\n    var personaggio = Guerriero\n    var punti_vita = 100\n    print(personaggio)\n    print(punti_vita)\n",
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
  },
  {
    "id": 25,
    "chapter": 7,
    "title": "25. Ciclo for con range()",
    "initialCode": "func _ready():\n    # Scrivi il ciclo for con range(3)\n    pass\n",
    "solution": "func _ready():\n    for i in range(3):\n        print(i)\n",
    "task": "Scrivi un ciclo for i in range(3): . All'interno del ciclo, stampa i con print(i) .",
    "expectedOutput": "0\n1\n2",
    "properties": [],
    "locals": [],
    "calls": []
  },
  {
    "id": 26,
    "chapter": 7,
    "title": "26. Iterazione su liste di nemici",
    "initialCode": "func _ready():\n    var nemici = [\"Goblin\", \"Orco\", \"Drago\"]\n    # Itera sui nemici con il ciclo for\n    pass\n",
    "solution": "func _ready():\n    var nemici = [\"Goblin\", \"Orco\", \"Drago\"]\n    for nemico in nemici:\n        print(nemico)\n",
    "task": "Dichiara nemici = [\"Goblin\", \"Orco\", \"Drago\"] . Usa for nemico in nemici: per stampare ogni nome con print(nemico) .",
    "expectedOutput": "Goblin\nOrco\nDrago",
    "properties": [],
    "locals": [
      "nemici"
    ],
    "calls": []
  },
  {
    "id": 27,
    "chapter": 7,
    "title": "27. Ciclo while",
    "initialCode": "func _ready():\n    var conto = 1\n    # BUG: il contatore diminuisce e il ciclo diventa infinito.\n    # Correggi l'aggiornamento per contare da 1 a 3.\n    while conto <= 3:\n        print(\"Conto: \" + str(conto))\n        conto -= 1\n",
    "solution": "func _ready():\n    var conto = 1\n    while conto <= 3:\n        print(\"Conto: \" + str(conto))\n        conto += 1\n",
    "task": "Dichiara conto = 1 . Scrivi un ciclo while conto . Stampa \"Conto: \" + str(conto) e incrementa conto += 1 .",
    "expectedOutput": "Conto: 1\nConto: 2\nConto: 3",
    "properties": [],
    "locals": [
      "conto"
    ],
    "calls": []
  },
  {
    "id": 28,
    "chapter": 7,
    "title": "28. ⭐ Sfida di Apprendimento: Annuncio Ondate e Calcolo XP",
    "initialCode": "extends Node\n\nfunc _ready():\n    var nemici = [\"Slime\", \"Scheletro\", \"Spettro\", \"Boss Drago\"]\n    var xp_totali = 0\n    \n    # Scrivi il ciclo for sotto\n    \n    # Non modificare la riga sotto\n    print(\"XP Totali: \", xp_totali)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var nemici = [\"Slime\", \"Scheletro\", \"Spettro\", \"Boss Drago\"]\n    var xp_totali = 0\n    \n    for nemico in nemici:\n        print(\"Allerta: \" + nemico)\n        xp_totali += 25\n        \n    # Non modificare la riga sotto\n    print(\"XP Totali: \", xp_totali)\n",
    "task": "Itera con for nemico in nemici: Stampa \"Allerta: \" + nemico Incrementa xp_totali += 25",
    "expectedOutput": "Allerta: Slime\nAllerta: Scheletro\nAllerta: Spettro\nAllerta: Boss Drago\nXP Totali: 100",
    "properties": [],
    "locals": [
      "nemici",
      "xp_totali"
    ],
    "calls": []
  },
  {
    "id": 29,
    "chapter": 8,
    "title": "29. Creare e chiamare una funzione",
    "initialCode": "func inizializza_nodo():\n    # Mostra il messaggio di avvio\n    pass\n\nfunc _ready():\n    # Richiama la funzione appena definita\n    pass\n",
    "solution": "func inizializza_nodo():\n    print(\"Nodo Inizializzato\")\n\nfunc _ready():\n    inizializza_nodo()\n",
    "task": "Definisci una funzione senza parametri chiamata inizializza_nodo() , che stampa \"Nodo Inizializzato\" . All'interno di _ready() , richiama inizializza_nodo() invece di ripetere direttamente la stampa. Verifica che il messaggio compaia una sola volta.",
    "expectedOutput": "Nodo Inizializzato",
    "properties": [],
    "locals": [],
    "calls": []
  },
  {
    "id": 30,
    "chapter": 8,
    "title": "30. Funzioni con parametri",
    "initialCode": "func saluta(nome):\n    # Stampa il saluto con il parametro nome\n    pass\n\nfunc _ready():\n    # Chiama saluta(\"Eroe\")\n    pass\n",
    "solution": "func saluta(nome):\n    print(\"Ciao \" + nome)\n\nfunc _ready():\n    saluta(\"Eroe\")\n",
    "task": "Definisci una funzione saluta(nome): che stampa \"Ciao \" + nome . All'interno di _ready(): , chiama saluta(\"Eroe\") .",
    "expectedOutput": "Ciao Eroe",
    "properties": [],
    "locals": [],
    "calls": [
      {
        "method": "saluta",
        "args": [
          "Ada"
        ]
      },
      {
        "method": "saluta",
        "args": [
          "Viaggiatore"
        ]
      }
    ]
  },
  {
    "id": 31,
    "chapter": 8,
    "title": "31. Valori di ritorno con return",
    "initialCode": "func calcola_danno(attacco, difesa):\n    # Restituisci attacco - difesa con return\n    pass\n\nfunc _ready():\n    # Chiama calcola_danno(30, 5) e stampa il risultato\n    pass\n",
    "solution": "func calcola_danno(attacco, difesa):\n    return attacco - difesa\n\nfunc _ready():\n    var danno = calcola_danno(30, 5)\n    print(danno)\n",
    "task": "Definisci calcola_danno(attacco, difesa): return attacco - difesa . In _ready(): calcola var danno = calcola_danno(30, 5) e stampa danno .",
    "expectedOutput": "25",
    "properties": [],
    "locals": [
      "danno"
    ],
    "calls": [
      {
        "method": "calcola_danno",
        "args": [
          12,
          7
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          20,
          9
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          0,
          4
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          -5,
          3
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          9,
          9
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          -3,
          -12
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          30,
          6
        ]
      },
      {
        "method": "calcola_danno",
        "args": [
          30,
          -2
        ]
      }
    ]
  },
  {
    "id": 32,
    "chapter": 8,
    "title": "32. ⭐ Sfida di Apprendimento: Motore di Calcolo Danno Critico",
    "initialCode": "extends Node\n\n# Definisci la funzione calcola_colpo sotto\n\n\nfunc _ready():\n    # Non modificare le righe sotto\n    var normale = calcola_colpo(30, false)\n    var critico = calcola_colpo(30, true)\n    print(\"Colpo normale: \", normale)\n    print(\"Colpo critico: \", critico)\n",
    "solution": "extends Node\n\nfunc calcola_colpo(attacco: int, critico: bool) -> int:\n    if critico:\n        return attacco * 2\n    else:\n        return attacco\n\nfunc _ready():\n    var normale = calcola_colpo(30, false)\n    var critico = calcola_colpo(30, true)\n    print(\"Colpo normale: \", normale)\n    print(\"Colpo critico: \", critico)\n",
    "task": "Crea func calcola_colpo(attacco: int, critico: bool) -> int: Se critico è true ritorna attacco * 2 Altrimenti ritorna attacco",
    "expectedOutput": "Colpo normale: 30\nColpo critico: 60",
    "properties": [],
    "locals": [
      "normale",
      "critico"
    ],
    "calls": [
      {
        "method": "calcola_colpo",
        "args": [
          7,
          false
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          7,
          true
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          12,
          true
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          0,
          true
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          -3,
          true
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          12,
          false
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          30,
          false
        ]
      },
      {
        "method": "calcola_colpo",
        "args": [
          30,
          true
        ]
      }
    ]
  },
  {
    "id": 33,
    "chapter": 9,
    "title": "33. Vector2(x, y) e coordinate 2D",
    "initialCode": "func _ready():\n    # Crea posizione come Vector2(100, 200) e stampala\n    pass\n",
    "solution": "func _ready():\n    var posizione = Vector2(100, 200)\n    print(posizione)\n",
    "task": "Crea posizione = Vector2(100, 200) . Stampa il vettore con print(posizione) . Godot mostra le coordinate come (100.0, 200.0) , senza la parola Vector2 nell'output.",
    "expectedOutput": "(100.0, 200.0)",
    "properties": [],
    "locals": [
      "posizione"
    ],
    "calls": []
  },
  {
    "id": 34,
    "chapter": 9,
    "title": "34. Calcolo nuova posizione con velocità",
    "initialCode": "func _ready():\n    # Aggiorna posizione.x con velocita e stampa\n    pass\n",
    "solution": "func _ready():\n    var posizione = Vector2(100, 200)\n    var velocita = 50\n    posizione.x += velocita\n    print(posizione)\n",
    "task": "Inizializza posizione = Vector2(100, 200) e velocita = 50 . Aggiorna posizione.x += velocita . Stampa il vettore finale con print(posizione) .",
    "expectedOutput": "(150.0, 200.0)",
    "properties": [],
    "locals": [
      "posizione",
      "velocita"
    ],
    "calls": []
  },
  {
    "id": 35,
    "chapter": 9,
    "title": "35. Movimento diagonale su entrambi gli assi",
    "initialCode": "func _ready():\n    # Aggiorna pos.x e pos.y e stampa il vettore\n    pass\n",
    "solution": "func _ready():\n    var pos = Vector2(100, 200)\n    pos.x += 20\n    pos.y -= 20\n    print(pos)\n",
    "task": "Crea pos = Vector2(100, 200) . Aggiungi 20 a pos.x e sottrai 20 a pos.y . Stampa pos .",
    "expectedOutput": "(120.0, 180.0)",
    "properties": [],
    "locals": [
      "pos"
    ],
    "calls": []
  },
  {
    "id": 36,
    "chapter": 9,
    "title": "36. ⭐ Sfida di Apprendimento: Navigazione Radar e Atterraggio 2D",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Crea posizione, aggiorna le coordinate e verifica atterrato sotto\n    \n    # Non modificare le righe sotto\n    print(\"Posizione finale: \", posizione)\n    print(\"Stazione raggiunta: \", atterrato)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var posizione = Vector2(100, 200)\n    posizione.x += 50\n    posizione.y -= 30\n    var stazione = Vector2(150, 170)\n    var atterrato: bool = (posizione.x == stazione.x and posizione.y == stazione.y)\n    \n    # Non modificare le righe sotto\n    print(\"Posizione finale: \", posizione)\n    print(\"Stazione raggiunta: \", atterrato)\n",
    "task": "Crea var posizione = Vector2(100, 200) Modifica posizione.x += 50 e posizione.y -= 30 Crea var stazione = Vector2(150, 170) Verifica var atterrato = (posizione.x == stazione.x and posizione.y == stazione.y)",
    "expectedOutput": "Posizione finale: (150.0, 170.0)\nStazione raggiunta: true",
    "properties": [],
    "locals": [
      "posizione",
      "stazione",
      "atterrato"
    ],
    "calls": []
  },
  {
    "id": 37,
    "chapter": 10,
    "title": "37. Creare e accedere ai Dizionari",
    "initialCode": "func _ready():\n    # Crea il dizionario eroe e stampa classe e livello sotto\n    pass\n",
    "solution": "func _ready():\n    var eroe = { \"classe\": \"Guerriero\", \"livello\": 10 }\n    print(\"Classe: \", eroe[\"classe\"])\n    print(\"Livello: \", eroe[\"livello\"])\n",
    "task": "Crea la variabile var eroe = { \"classe\": \"Guerriero\", \"livello\": 10 } . Stampa la classe: print(\"Classe: \", eroe[\"classe\"]) . Stampa il livello: print(\"Livello: \", eroe[\"livello\"]) .",
    "expectedOutput": "Classe: Guerriero\nLivello: 10",
    "properties": [],
    "calls": [],
    "locals": [
      "eroe"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 38,
    "chapter": 10,
    "title": "38. Modificare e aggiungere chiavi al Dizionario",
    "initialCode": "func _ready():\n    var equip = { \"arma\": \"Spada\" }\n    # Aggiungi armatura, aggiorna arma e stampa sotto\n    pass\n",
    "solution": "func _ready():\n    var equip = { \"arma\": \"Spada\" }\n    equip[\"armatura\"] = \"Scudo\"\n    equip[\"arma\"] = \"Spada Laser\"\n    print(\"Arma: \", equip[\"arma\"])\n    print(\"Armatura: \", equip[\"armatura\"])\n",
    "task": "Inizializza var equip = { \"arma\": \"Spada\" } . Aggiungi la chiave armatura: equip[\"armatura\"] = \"Scudo\" . Aggiorna l'arma: equip[\"arma\"] = \"Spada Laser\" . Stampa: print(\"Arma: \", equip[\"arma\"]) e print(\"Armatura: \", equip[\"armatura\"]) .",
    "expectedOutput": "Arma: Spada Laser\nArmatura: Scudo",
    "properties": [],
    "calls": [],
    "locals": [
      "equip"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 39,
    "chapter": 10,
    "title": "39. Metodi dei Dizionari (has, keys)",
    "initialCode": "func _ready():\n    var forziere = { \"oro\": 100, \"gemme\": 3 }\n    # BUG: questi accessi leggono valori, anziché verificare le chiavi.\n    var ha_oro = forziere[\"oro\"]\n    var ha_chiave = forziere[\"chiave\"]\n    # Sostituisci anche l'array vuoto con le chiavi del forziere.\n    var chiavi = []\n    print(\"Possiede oro: \", ha_oro)\n    print(\"Possiede chiave: \", ha_chiave)\n    print(\"Chiavi nel forziere: \", chiavi.size())\n",
    "solution": "func _ready():\n    var forziere = { \"oro\": 100, \"gemme\": 3 }\n    var ha_oro = forziere.has(\"oro\")\n    var ha_chiave = forziere.has(\"chiave\")\n    var chiavi = forziere.keys()\n    print(\"Possiede oro: \", ha_oro)\n    print(\"Possiede chiave: \", ha_chiave)\n    print(\"Chiavi nel forziere: \", chiavi.size())\n",
    "task": "Il forziere contiene \"oro\": 100 e \"gemme\": 3 . Correggi ha_oro e ha_chiave usando forziere.has() , senza leggere direttamente la chiave mancante. Usa forziere.keys() per assegnare a chiavi l'elenco delle chiavi del dizionario. Stampa gli esiti di entrambi i controlli e il numero di chiavi con chiavi.size() , secondo l'output atteso.",
    "expectedOutput": "Possiede oro: true\nPossiede chiave: false\nChiavi nel forziere: 2",
    "properties": [],
    "calls": [],
    "locals": [
      "forziere",
      "ha_oro",
      "ha_chiave"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 40,
    "chapter": 10,
    "title": "40. ⭐ Sfida di Apprendimento: Statistiche del Boss Finale",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Crea e aggiorna boss e crea in_furia sotto\n    \n    # Non modificare le righe sotto\n    print(\"Boss: \", boss[\"nome\"])\n    print(\"HP rimanenti: \", boss[\"hp\"])\n    print(\"Attacco: \", boss[\"attacco\"])\n    print(\"Furia attiva: \", in_furia)\n",
    "solution": "extends Node\n\nfunc _ready():\n    var boss = { \"nome\": \"Drago Antico\", \"hp\": 500 }\n    boss[\"attacco\"] = 75\n    boss[\"hp\"] = 420\n    var in_furia = boss.has(\"furia\")\n    \n    # Non modificare le righe sotto\n    print(\"Boss: \", boss[\"nome\"])\n    print(\"HP rimanenti: \", boss[\"hp\"])\n    print(\"Attacco: \", boss[\"attacco\"])\n    print(\"Furia attiva: \", in_furia)\n",
    "task": "Crea boss = { \"nome\": \"Drago Antico\", \"hp\": 500 } Aggiungi boss[\"attacco\"] = 75 Imposta boss[\"hp\"] = 420 Verifica var in_furia = boss.has(\"furia\")",
    "expectedOutput": "Boss: Drago Antico\nHP rimanenti: 420\nAttacco: 75\nFuria attiva: false",
    "properties": [],
    "calls": [],
    "locals": [
      "boss",
      "in_furia"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 41,
    "chapter": 11,
    "title": "41. Dichiarare ed emettere un Segnale",
    "initialCode": "extends Node\n\n# Dichiara il segnale porta_aperta sotto\n\n\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print(\"Apertura in corso...\")\n    # Emetti il segnale sotto\n\n\nfunc quando_aperta():\n    print(\"Porta aperta con successo!\")\n",
    "solution": "extends Node\n\nsignal porta_aperta\n\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print(\"Apertura in corso...\")\n    porta_aperta.emit()\n\nfunc quando_aperta():\n    print(\"Porta aperta con successo!\")\n",
    "task": "Dichiara in cima allo script: signal porta_aperta . In _ready() , dopo la stampa, emetti il segnale: porta_aperta.emit() .",
    "expectedOutput": "Apertura in corso...\nPorta aperta con successo!",
    "properties": [],
    "calls": [],
    "locals": [],
    "emissions": [
      {
        "signal": "porta_aperta",
        "args": []
      }
    ],
    "objectCalls": []
  },
  {
    "id": 42,
    "chapter": 11,
    "title": "42. Connettere un Segnale a una Funzione (connect)",
    "initialCode": "extends Node\n\nsignal moneta_raccolta\n\nfunc _ready():\n    # Connetti moneta_raccolta ad aggiungi_punti ed emettila sotto\n    pass\n\nfunc aggiungi_punti():\n    print(\"+10 Monete raccolte!\")\n",
    "solution": "extends Node\n\nsignal moneta_raccolta\n\nfunc _ready():\n    moneta_raccolta.connect(aggiungi_punti)\n    moneta_raccolta.emit()\n\nfunc aggiungi_punti():\n    print(\"+10 Monete raccolte!\")\n",
    "task": "Nel corpo di _ready() , connetti il segnale alla funzione: moneta_raccolta.connect(aggiungi_punti) . Subito dopo, lancia il segnale con: moneta_raccolta.emit() .",
    "expectedOutput": "+10 Monete raccolte!",
    "properties": [],
    "calls": [],
    "locals": [],
    "emissions": [
      {
        "signal": "moneta_raccolta",
        "args": []
      }
    ],
    "objectCalls": []
  },
  {
    "id": 43,
    "chapter": 11,
    "title": "43. Segnali con Parametri",
    "initialCode": "extends Node\n\n# Dichiara signal danno_inflitto(valore) sotto\n\n\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    # Emetti danno_inflitto con 35 sotto\n\n\nfunc on_danno(v):\n    print(\"Danno registrato: \", v)\n",
    "solution": "extends Node\n\nsignal danno_inflitto(valore)\n\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    danno_inflitto.emit(35)\n\nfunc on_danno(v):\n    print(\"Danno registrato: \", v)\n",
    "task": "Dichiara in cima: signal danno_inflitto(valore) . In _ready() , emetti il segnale passando il valore 35: danno_inflitto.emit(35) .",
    "expectedOutput": "Danno registrato: 35",
    "properties": [],
    "calls": [],
    "locals": [],
    "emissions": [
      {
        "signal": "danno_inflitto",
        "args": [
          71
        ]
      }
    ],
    "objectCalls": []
  },
  {
    "id": 44,
    "chapter": 11,
    "title": "44. ⭐ Sfida di Apprendimento: Sistema di Eventi Battaglia",
    "initialCode": "extends Node\n\n# Dichiara il segnale salute_aggiornata sotto\n\n\n# Crea la funzione quando_salute_cambia(hp) sotto\n\n\nfunc _ready():\n    # Connetti il segnale ed emetti due volte (75 e 40) sotto\n    \n    # Non modificare la riga sotto\n    print(\"=== EVENTI BATTAGLIA COMPLETATI ===\")\n",
    "solution": "extends Node\n\nsignal salute_aggiornata(nuova_salute)\n\nfunc quando_salute_cambia(hp):\n    print(\"UI: Barra salute a \", hp)\n\nfunc _ready():\n    salute_aggiornata.connect(quando_salute_cambia)\n    salute_aggiornata.emit(75)\n    salute_aggiornata.emit(40)\n    \n    # Non modificare la riga sotto\n    print(\"=== EVENTI BATTAGLIA COMPLETATI ===\")\n",
    "task": "Dichiara signal salute_aggiornata(nuova_salute) Crea func quando_salute_cambia(hp) con stampa Connetti ed emetti con 75 e 40",
    "expectedOutput": "UI: Barra salute a 75\nUI: Barra salute a 40\n=== EVENTI BATTAGLIA COMPLETATI ===",
    "properties": [],
    "calls": [],
    "locals": [],
    "emissions": [
      {
        "signal": "salute_aggiornata",
        "args": [
          11
        ]
      }
    ],
    "objectCalls": []
  },
  {
    "id": 45,
    "chapter": 12,
    "title": "45. Definire una Classe e il Costruttore _init()",
    "initialCode": "extends Node\n\n# Definisci la classe Pozione sotto\n\n\nfunc _ready():\n    # Crea elisir con Pozione.new e stampa sotto\n    pass\n",
    "solution": "extends Node\n\nclass Pozione:\n    var nome\n    var cura\n    func _init(n, c):\n        self.nome = n\n        self.cura = c\n\nfunc _ready():\n    var elisir = Pozione.new(\"Elisir\", 50)\n    print(\"Pozione creata: \", elisir.nome, \" (Cura: \", elisir.cura, \")\")\n",
    "task": "Definisci la classe class Pozione: con campi var nome e var cura . Nel costruttore func _init(n, c): assegna self.nome = n e self.cura = c . In _ready() , crea l'oggetto: var elisir = Pozione.new(\"Elisir\", 50) . Stampa: print(\"Pozione creata: \", elisir.nome, \" (Cura: \", elisir.cura, \")\") .",
    "expectedOutput": "Pozione creata: Elisir (Cura: 50)",
    "properties": [],
    "calls": [],
    "locals": [
      "elisir"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 46,
    "chapter": 12,
    "title": "46. Creare Istanze Multiple con .new()",
    "initialCode": "extends Node\n\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n, h):\n        self.nome = n\n        self.hp = h\n\nfunc _ready():\n    # Crea g1 e g2 con .new() e stampa i loro stati sotto\n    pass\n",
    "solution": "extends Node\n\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n, h):\n        self.nome = n\n        self.hp = h\n\nfunc _ready():\n    var g1 = Guerriero.new(\"Arthur\", 100)\n    var g2 = Guerriero.new(\"Lancelot\", 90)\n    print(\"Eroe 1: \", g1.nome, \" (HP: \", g1.hp, \")\")\n    print(\"Eroe 2: \", g2.nome, \" (HP: \", g2.hp, \")\")\n",
    "task": "In _ready() crea due guerrieri: var g1 = Guerriero.new(\"Arthur\", 100) e var g2 = Guerriero.new(\"Lancelot\", 90) . Stampa: print(\"Eroe 1: \", g1.nome, \" (HP: \", g1.hp, \")\") . Stampa: print(\"Eroe 2: \", g2.nome, \" (HP: \", g2.hp, \")\") .",
    "expectedOutput": "Eroe 1: Arthur (HP: 100)\nEroe 2: Lancelot (HP: 90)",
    "properties": [],
    "calls": [],
    "locals": [
      "g1",
      "g2"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 47,
    "chapter": 12,
    "title": "47. Metodi di Classe (Comportamento)",
    "initialCode": "extends Node\n\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n, a):\n        self.nome = n\n        self.attacco = a\n    # Aggiungi func colpo_caricato() sotto\n\n\nfunc _ready():\n    # Istanzia eroe con attacco 25 e stampa il colpo caricato sotto\n    pass\n",
    "solution": "extends Node\n\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n, a):\n        self.nome = n\n        self.attacco = a\n    func colpo_caricato():\n        return self.attacco * 2\n\nfunc _ready():\n    var eroe = Personaggio.new(\"Eroe\", 25)\n    print(\"Danno colpo caricato: \", eroe.colpo_caricato())\n",
    "task": "Nella classe Personaggio , aggiungi il metodo func colpo_caricato(): return self.attacco * 2 . In _ready() , crea var eroe = Personaggio.new(\"Eroe\", 25) . Stampa: print(\"Danno colpo caricato: \", eroe.colpo_caricato()) .",
    "expectedOutput": "Danno colpo caricato: 50",
    "properties": [],
    "calls": [],
    "locals": [
      "eroe"
    ],
    "emissions": [],
    "objectCalls": [
      {
        "variable": "eroe",
        "method": "colpo_caricato",
        "args": [],
        "set": {
          "attacco": 7
        }
      },
      {
        "variable": "eroe",
        "method": "colpo_caricato",
        "args": [],
        "set": {
          "attacco": 31
        }
      },
      {
        "variable": "eroe",
        "method": "colpo_caricato",
        "args": [],
        "set": {
          "attacco": 0
        }
      },
      {
        "variable": "eroe",
        "method": "colpo_caricato",
        "args": [],
        "set": {
          "attacco": -3
        }
      }
    ]
  },
  {
    "id": 48,
    "chapter": 12,
    "title": "48. ⭐ Sfida di Apprendimento Finale: Creazione Party RPG ad Oggetti",
    "initialCode": "extends Node\n\n# Definisci la classe Avventuriero con _init sotto\n\n\nfunc _ready():\n    # Crea membro1, membro2 e calcola vita_totale sotto\n    \n    # Non modificare le righe sotto\n    print(\"Membro 1: \", membro1.nome, \" (\", membro1.ruolo, \")\")\n    print(\"Membro 2: \", membro2.nome, \" (\", membro2.ruolo, \")\")\n    print(\"Salute totale party: \", vita_totale)\n",
    "solution": "extends Node\n\nclass Avventuriero:\n    var nome\n    var ruolo\n    var vita\n    func _init(n, r, v):\n        self.nome = n\n        self.ruolo = r\n        self.vita = v\n\nfunc _ready():\n    var membro1 = Avventuriero.new(\"Aria\", \"Maga\", 80)\n    var membro2 = Avventuriero.new(\"Krag\", \"Guerriero\", 120)\n    var vita_totale = membro1.vita + membro2.vita\n    \n    # Non modificare le righe sotto\n    print(\"Membro 1: \", membro1.nome, \" (\", membro1.ruolo, \")\")\n    print(\"Membro 2: \", membro2.nome, \" (\", membro2.ruolo, \")\")\n    print(\"Salute totale party: \", vita_totale)\n",
    "task": "Crea la classe Avventuriero con _init Istanzia membro1 e membro2 con .new() Calcola var vita_totale = membro1.vita + membro2.vita",
    "expectedOutput": "Membro 1: Aria (Maga)\nMembro 2: Krag (Guerriero)\nSalute totale party: 200",
    "properties": [],
    "calls": [],
    "locals": [
      "membro1",
      "membro2",
      "vita_totale"
    ],
    "emissions": [],
    "objectCalls": []
  },
  {
    "id": 49,
    "chapter": 13,
    "title": "49. Cos'è un Nodo e l'Albero di Godot",
    "initialCode": "func _ready():\n    # Accedi al nodo $Giocatore presente nella scena e stampa il suo nome\n    pass\n",
    "solution": "func _ready():\n    print(\"Nodo rilevato: \", $Giocatore.name)\n",
    "task": "Nel pannello Scena Godot a destra puoi osservare il nodo Giocatore già presente nell'albero. In _ready() , accedi al nodo con la sintassi nativa $Giocatore . Stampa a console: print(\"Nodo rilevato: \", $Giocatore.name) .",
    "expectedOutput": "Nodo rilevato: Giocatore",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 49,
    "actions": []
  },
  {
    "id": 50,
    "chapter": 13,
    "title": "50. Testo a Schermo: Il nodo Label",
    "initialCode": "func _ready():\n    # Modifica $Titolo.text e stampa a console\n    pass\n",
    "solution": "func _ready():\n    $Titolo.text = \"Benvenuto in Godot 4!\"\n    print(\"Testo a schermo: \", $Titolo.text)\n",
    "task": "Nella scena è già presente il nodo $Titolo (visibile anche nell'anteprima 2D). Modifica il testo della label: $Titolo.text = \"Benvenuto in Godot 4!\" . Stampa a console: print(\"Testo a schermo: \", $Titolo.text) .",
    "expectedOutput": "Testo a schermo: Benvenuto in Godot 4!",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 50,
    "actions": []
  },
  {
    "id": 51,
    "chapter": 13,
    "title": "51. L'operatore $: Accedere ai Nodi Figli",
    "initialCode": "func _ready():\n    # Accedi a $SaluteLabel con l'operatore $, aggiorna il testo a \"HP: 75\" e stampa\n    pass\n",
    "solution": "func _ready():\n    $SaluteLabel.text = \"HP: 75\"\n    print(\"Nuova salute: \", $SaluteLabel.text)\n",
    "task": "Nella scena è già presente il nodo $SaluteLabel . Modifica il suo testo: $SaluteLabel.text = \"HP: 75\" . Stampa il valore aggiornato: print(\"Nuova salute: \", $SaluteLabel.text) .",
    "expectedOutput": "Nuova salute: HP: 75",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 51,
    "actions": []
  },
  {
    "id": 52,
    "chapter": 13,
    "title": "52. ⭐ Sfida di Apprendimento: La Targhetta del Dungeon",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Configura $TitoloDungeon, $LivelloLabel e $MoneteLabel sotto\n    \n    # Non modificare le righe sotto\n    print(\"Dungeon: \", $TitoloDungeon.text)\n    print(\"Difficolta: \", $LivelloLabel.text)\n    print(\"Bottino: \", $MoneteLabel.text)\n",
    "solution": "extends Node\n\nfunc _ready():\n    $TitoloDungeon.text = \"Caverna dei Goblin\"\n    $LivelloLabel.text = \"Livello: 1\"\n    $MoneteLabel.text = \"Oro: 50\"\n    \n    # Non modificare le righe sotto\n    print(\"Dungeon: \", $TitoloDungeon.text)\n    print(\"Difficolta: \", $LivelloLabel.text)\n    print(\"Bottino: \", $MoneteLabel.text)\n",
    "task": "Imposta $TitoloDungeon.text = \"Caverna dei Goblin\" Imposta $LivelloLabel.text = \"Livello: 1\" Imposta $MoneteLabel.text = \"Oro: 50\"",
    "expectedOutput": "Dungeon: Caverna dei Goblin\nDifficolta: Livello: 1\nBottino: Oro: 50",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 52,
    "actions": []
  },
  {
    "id": 53,
    "chapter": 14,
    "title": "53. Il primo Pulsante: Il nodo Button",
    "initialCode": "func _ready():\n    # Modifica il testo di $AttaccaBtn e stampa a console\n    pass\n",
    "solution": "func _ready():\n    $AttaccaBtn.text = \"Sferra Attacco\"\n    print(\"Pulsante configurato: \", $AttaccaBtn.text)\n",
    "task": "Nella scena è già presente il nodo $AttaccaBtn (visibile anche nell'anteprima Viewport 2D in basso a destra). Modifica la proprietà text del pulsante: $AttaccaBtn.text = \"Sferra Attacco\" . Stampa a console il testo aggiornato: print(\"Pulsante configurato: \", $AttaccaBtn.text) .",
    "expectedOutput": "Pulsante configurato: Sferra Attacco",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 53,
    "actions": []
  },
  {
    "id": 54,
    "chapter": 14,
    "title": "54. Rendere vivo il pulsante: Il Segnale pressed",
    "initialCode": "func _ready():\n    # Connetti $AttaccaBtn.pressed e stampa \"Pulsante connesso\"\n    pass\n\n# Definisci func quando_premuto() sotto\n",
    "solution": "func _ready():\n    $AttaccaBtn.pressed.connect(quando_premuto)\n    print(\"Pulsante connesso\")\n\nfunc quando_premuto():\n    print(\"Colpo sferrato con successo!\")\n",
    "task": "In _ready() , connetti il segnale: $AttaccaBtn.pressed.connect(quando_premuto) . Stampa in _ready() : print(\"Pulsante connesso\") . Definisci la funzione func quando_premuto(): che stampa print(\"Colpo sferrato con successo!\") .",
    "expectedOutput": "Pulsante connesso\nColpo sferrato con successo!",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 54,
    "actions": [
      {
        "node": "AttaccaBtn",
        "signal": "pressed"
      }
    ]
  },
  {
    "id": 55,
    "chapter": 14,
    "title": "55. Costruire un mini Clicker Game",
    "initialCode": "var punti = 0\n\nfunc _ready():\n    # Connetti $ClickBtn.pressed ad al_click e stampa \"Clicker pronto\"\n    pass\n\nfunc al_click():\n    # Incrementa punti, aggiorna $PuntiLabel.text e stampa\n    pass\n",
    "solution": "var punti = 0\n\nfunc _ready():\n    $ClickBtn.pressed.connect(al_click)\n    print(\"Clicker pronto\")\n\nfunc al_click():\n    punti += 1\n    $PuntiLabel.text = \"Click: \" + str(punti)\n    print($PuntiLabel.text)\n",
    "task": "Crea la variabile var punti = 0 . In _ready() connetti $ClickBtn.pressed.connect(al_click) e stampa print(\"Clicker pronto\") . In func al_click(): incrementa punti += 1 e aggiorna $PuntiLabel.text = \"Click: \" + str(punti) . Stampa il testo aggiornato: print($PuntiLabel.text) .",
    "expectedOutput": "Clicker pronto\nClick: 1",
    "locals": [],
    "properties": [
      "punti",
      "monete"
    ],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 55,
    "actions": [
      {
        "node": "ClickBtn",
        "signal": "pressed"
      }
    ]
  },
  {
    "id": 56,
    "chapter": 14,
    "title": "56. ⭐ Sfida di Apprendimento: Il Pannello di Controllo dell'Astronave",
    "initialCode": "extends Node\n\nfunc _ready():\n    # Connetti $MotoriBtn e $AllarmeBtn sotto\n    \n    # Non modificare la riga sotto\n    print(\"Plancia Operativa\")\n\n# Definisci le funzioni attiva_motori e attiva_allarme sotto\n",
    "solution": "extends Node\n\nfunc _ready():\n    $MotoriBtn.pressed.connect(attiva_motori)\n    $AllarmeBtn.pressed.connect(attiva_allarme)\n    \n    # Non modificare la riga sotto\n    print(\"Plancia Operativa\")\n\nfunc attiva_motori():\n    $StatoNave.text = \"Motori a Massima Potenza\"\n    print(\"Velocita Aumentata\")\n\nfunc attiva_allarme():\n    $StatoNave.text = \"Allarme Rosso Attivo\"\n    print(\"Scudi al 100%\")\n",
    "task": "Connetti $MotoriBtn.pressed a attiva_motori Connetti $AllarmeBtn.pressed a attiva_allarme Aggiorna $StatoNave.text nelle rispettive funzioni",
    "expectedOutput": "Plancia Operativa\nVelocita Aumentata\nScudi al 100%",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 56,
    "actions": [
      {
        "node": "MotoriBtn",
        "signal": "pressed"
      },
      {
        "node": "AllarmeBtn",
        "signal": "pressed"
      }
    ]
  },
  {
    "id": 57,
    "chapter": 15,
    "title": "57. Il nodo Timer: wait_time e segnale timeout",
    "initialCode": "func _ready():\n    # Configura $Cooldown (wait_time, one_shot), connetti timeout, avvia e stampa\n    pass\n\nfunc quando_scaduto():\n    pass\n",
    "solution": "func _ready():\n    $Cooldown.wait_time = 2.5\n    $Cooldown.one_shot = true\n    $Cooldown.timeout.connect(quando_scaduto)\n    $Cooldown.start()\n    print(\"Timer avviato per: \", $Cooldown.wait_time, \"s\")\n\nfunc quando_scaduto():\n    print(\"Tempo scaduto!\")\n",
    "task": "Nella scena è già presente il nodo $Cooldown (Timer). Imposta $Cooldown.wait_time = 2.5 e $Cooldown.one_shot = true . Connetti il segnale $Cooldown.timeout.connect(quando_scaduto) e avvia il timer con $Cooldown.start() . Stampa: print(\"Timer avviato per: \", $Cooldown.wait_time, \"s\") . Definisci func quando_scaduto(): che stampa print(\"Tempo scaduto!\") .",
    "expectedOutput": "Timer avviato per: 2.5s\nTempo scaduto!",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 57,
    "actions": [
      {
        "node": "Cooldown",
        "signal": "timeout"
      }
    ]
  },
  {
    "id": 58,
    "chapter": 15,
    "title": "58. Grafica e Forme: Il nodo ColorRect",
    "initialCode": "func _ready():\n    # Modifica $BarraVita (color e size) e stampa a console\n    pass\n",
    "solution": "func _ready():\n    $BarraVita.color = \"#22c55e\"\n    $BarraVita.size = Vector2(200, 20)\n    print(\"Barra salute aggiornata con colore: \", $BarraVita.color)\n",
    "task": "Nella scena è già presente il nodo $BarraVita (ColorRect visibile nella Viewport 2D). Imposta il colore verde: $BarraVita.color = \"#22c55e\" . Imposta le dimensioni a 200x20: $BarraVita.size = Vector2(200, 20) . Stampa a console: print(\"Barra salute aggiornata con colore: \", $BarraVita.color) .",
    "expectedOutput": "Barra salute aggiornata con colore: (0.1333, 0.7725, 0.3686, 1.0)",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 58,
    "actions": []
  },
  {
    "id": 59,
    "chapter": 15,
    "title": "59. Ciclo di Vita: Eliminare Nodi con queue_free()",
    "initialCode": "func _ready():\n    # Verifica has_node(\"Moneta\"), accoda queue_free(), poi usa is_queued_for_deletion()\n    pass\n",
    "solution": "func _ready():\n    print(\"Moneta presente prima: \", has_node(\"Moneta\"))\n    $Moneta.queue_free()\n    print(\"Moneta in attesa di eliminazione: \", $Moneta.is_queued_for_deletion())\n",
    "task": "Nella scena è presente il nodo $Moneta . Stampa: print(\"Moneta presente prima: \", has_node(\"Moneta\")) . Rimuovi la moneta con: $Moneta.queue_free() . Stampa la conferma: print(\"Moneta in attesa di eliminazione: \", $Moneta.is_queued_for_deletion()) .",
    "expectedOutput": "Moneta presente prima: true\nMoneta in attesa di eliminazione: true",
    "locals": [],
    "properties": [],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 59,
    "actions": []
  },
  {
    "id": 60,
    "chapter": 15,
    "title": "60. 🏆 Sfida di Apprendimento Finale: Il Negozio dell'Avventuriero",
    "initialCode": "extends Node\n\nvar monete = 100\n\nfunc _ready():\n    # Connetti $CompraPozioneBtn sotto\n    \n    # Non modificare la riga sotto\n    print(\"Bottega Aperta\")\n\n# Definisci func compra_pozione() sotto\n",
    "solution": "extends Node\n\nvar monete = 100\n\nfunc _ready():\n    $CompraPozioneBtn.pressed.connect(compra_pozione)\n    \n    # Non modificare la riga sotto\n    print(\"Bottega Aperta\")\n\nfunc compra_pozione():\n    if monete >= 25:\n        monete -= 25\n        $OroLabel.text = \"Monete: \" + str(monete)\n        $MessaggioLabel.text = \"Pozione Acquistata!\"\n    else:\n        $MessaggioLabel.text = \"Oro Insufficiente!\"\n    print($MessaggioLabel.text)\n",
    "task": "Connetti $CompraPozioneBtn.pressed a compra_pozione Sottrai 25 oro se disponibile e aggiorna $OroLabel.text Aggiorna $MessaggioLabel.text con esito dell'acquisto",
    "expectedOutput": "Bottega Aperta\nPozione Acquistata!",
    "locals": [],
    "properties": [
      "punti",
      "monete"
    ],
    "calls": [],
    "emissions": [],
    "objectCalls": [],
    "scene": 60,
    "actions": [
      {
        "node": "CompraPozioneBtn",
        "signal": "pressed"
      }
    ]
  }
];

// Sincronizzazione dinamica con il corso attivo (92 lezioni)
if (typeof window !== 'undefined' && Array.isArray(window.LESSONS_DATA)) {
  window.GDHLessonFixtures = window.LESSONS_DATA.map(l => ({
    id: l.id,
    chapter: l.chapterId,
    title: l.title,
    initialCode: l.initialCode,
    solution: l.solution,
    task: l.task,
    expectedOutput: l.expectedOutput,
    locals: [],
    properties: []
  }));
}
