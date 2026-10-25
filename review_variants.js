/**
 * GDScript Hero - P3.3: Modulo Ripasso Intelligente & Catalogo Varianti Didattiche
 * Generazione deterministica, raccomandazioni trasparenti basate su telemetria P3.1
 * e varianti alternative con scenari differenti.
 */

const REVIEW_VARIANTS = [
    // ---------------------------------------------------------
    // 1. SINTASSI BASE & OUTPUT (syntax_basics)
    // ---------------------------------------------------------
    {
        id: "rev_syntax_01",
        conceptId: "syntax_basics",
        title: "Registro di Bordo dell'Astronave",
        scenario: "Inizializzazione del computer di bordo prima del salto iperspaziale.",
        task: "All'interno della funzione <code>_ready()</code>, utilizza due istruzioni <code>print()</code> distinte per registrare a console i seguenti messaggi su due righe separate:<br>1. <code>Astronave: Stella Polare</code><br>2. <code>Sistemi di bordo: Operativi</code>",
        expectedOutput: "Astronave: Stella Polare\nSistemi di bordo: Operativi",
        starterCode: `extends Node2D

func _ready():
    # Scrivi qui le due istruzioni print() per il registro di bordo
    pass
`,
        solution: `extends Node2D

func _ready():
    print("Astronave: Stella Polare")
    print("Sistemi di bordo: Operativi")
`,
        hints: [
            {
                level: 1,
                text: "Utilizza due chiamate separate alla funzione print(), posizionate ciascuna su una propria riga all'interno del blocco _ready()."
            },
            {
                level: 2,
                text: "Il testo da stampare deve essere racchiuso tra virgolette doppie o singole, prestando attenzione alle maiuscole e ai due punti: print(\"Astronave: Stella Polare\")."
            },
            {
                level: 3,
                text: "Esempio di struttura:\nfunc _ready():\n    print(\"Astronave: Stella Polare\")\n    print(\"Sistemi di bordo: Operativi\")"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const logs = result.logs || [];
            const hasL1 = logs.some(l => l.includes("Astronave: Stella Polare"));
            const hasL2 = logs.some(l => l.includes("Sistemi di bordo: Operativi"));
            tests.push({
                desc: "Console contiene 'Astronave: Stella Polare'",
                passed: hasL1,
                diff: hasL1 ? null : `Atteso: "Astronave: Stella Polare", Ricevuto: "${logs.join(' | ')}"`
            });
            tests.push({
                desc: "Console contiene 'Sistemi di bordo: Operativi'",
                passed: hasL2,
                diff: hasL2 ? null : `Atteso: "Sistemi di bordo: Operativi", Ricevuto: "${logs.join(' | ')}"`
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 2. VARIABILI & CONCATENAZIONE (variables_basics)
    // ---------------------------------------------------------
    {
        id: "rev_variables_01",
        conceptId: "variables_basics",
        title: "Scheda del Ranger dei Boschi",
        scenario: "Configurazione delle scorte di munizioni per la missione di pattugliamento.",
        task: "Dichiara due variabili all'interno di <code>_ready()</code>:<br>• <code>nome_ranger</code> con valore testuale <code>\"Kael\"</code><br>• <code>frecce</code> con valore intero <code>18</code><br><br>Poi, utilizzando una singola istruzione <code>print()</code> e la conversione con <code>str()</code>, stampa esattamente la frase:<br><code>Il ranger Kael possiede 18 frecce.</code>",
        expectedOutput: "Il ranger Kael possiede 18 frecce.",
        starterCode: `extends Node2D

func _ready():
    # Dichiara le variabili nome_ranger e frecce, poi componi e stampa la frase
    pass
`,
        solution: `extends Node2D

func _ready():
    var nome_ranger = "Kael"
    var frecce = 18
    print("Il ranger " + nome_ranger + " possiede " + str(frecce) + " frecce.")
`,
        hints: [
            {
                level: 1,
                text: "Dichiara le variabili con la parola chiave 'var' e usa l'operatore '+' per concatenare i frammenti di testo."
            },
            {
                level: 2,
                text: "In GDScript non puoi sommare direttamente testo e numeri: racchiudi la variabile numerica dentro str(frecce) per convertirla in stringa prima della concatenazione."
            },
            {
                level: 3,
                text: "Esempio:\nvar nome_ranger = \"Kael\"\nvar frecce = 18\nprint(\"Il ranger \" + nome_ranger + \" possiede \" + str(frecce) + \" frecce.\")"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const logs = result.logs || [];
            const hasPhrase = logs.some(l => l.includes("Il ranger Kael possiede 18 frecce."));
            tests.push({
                desc: "Console contiene esattamente 'Il ranger Kael possiede 18 frecce.'",
                passed: hasPhrase,
                diff: hasPhrase ? null : `Ricevuto a console: "${logs.join('\n')}"`
            });
            const hasVar = /var\s+nome_ranger\b/.test(result.code) && /var\s+frecce\b/.test(result.code);
            tests.push({
                desc: "Variabili 'nome_ranger' e 'frecce' dichiarate correttamente con var",
                passed: hasVar,
                diff: hasVar ? null : "Verifica di aver dichiarato entrambe le variabili con la parola chiave var."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 3. TIPI, TIPIZZAZIONE STATICA & COSTANTI (type_system)
    // ---------------------------------------------------------
    {
        id: "rev_types_01",
        conceptId: "type_system",
        title: "Configurazione del Drone Esploratore",
        scenario: "Impostazione dei parametri di volo e telemetria con tipizzazione esplicita Godot 4.",
        task: "Dichiara le seguenti impostazioni in <code>_ready()</code>:<br>• Una costante <code>LIVELLO_MAX: int = 50</code><br>• Una variabile con tipo esplicito <code>altitudine: float = 120.5</code><br>• Una variabile con tipo esplicito <code>sensori_attivi: bool = true</code><br><br>Infine stampa il valore di <code>altitudine</code> a console.",
        expectedOutput: "120.5",
        starterCode: `extends Node2D

func _ready():
    # Dichiara LIVELLO_MAX (costante int), altitudine (float) e sensori_attivi (bool)
    pass
`,
        solution: `extends Node2D

func _ready():
    const LIVELLO_MAX: int = 50
    var altitudine: float = 120.5
    var sensori_attivi: bool = true
    print(altitudine)
`,
        hints: [
            {
                level: 1,
                text: "Usa la sintassi di tipizzazione statica di Godot 4: ': tipo = valore'."
            },
            {
                level: 2,
                text: "Per la costante usa 'const LIVELLO_MAX: int = 50'. Per il decimale usa 'var altitudine: float = 120.5' e per il booleano 'var sensori_attivi: bool = true'."
            },
            {
                level: 3,
                text: "Esempio:\nconst LIVELLO_MAX: int = 50\nvar altitudine: float = 120.5\nvar sensori_attivi: bool = true\nprint(altitudine)"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const hasConst = /const\s+LIVELLO_MAX\s*(?::\s*int)?\s*=\s*50\b/.test(result.code);
            const hasFloat = /var\s+altitudine\s*:\s*float\s*=\s*120\.5\b/.test(result.code);
            const hasBool = /var\s+sensori_attivi\s*:\s*bool\s*=\s*true\b/.test(result.code);
            tests.push({
                desc: "Costante LIVELLO_MAX definita pari a 50",
                passed: hasConst,
                diff: hasConst ? null : "Verifica la sintassi: 'const LIVELLO_MAX: int = 50'."
            });
            tests.push({
                desc: "Variabile tipizzata altitudine: float = 120.5",
                passed: hasFloat,
                diff: hasFloat ? null : "Verifica la sintassi: 'var altitudine: float = 120.5'."
            });
            tests.push({
                desc: "Variabile tipizzata sensori_attivi: bool = true",
                passed: hasBool,
                diff: hasBool ? null : "Verifica la sintassi: 'var sensori_attivi: bool = true'."
            });
            const printedFloat = (result.logs || []).some(l => l.includes("120.5"));
            tests.push({
                desc: "Console stampa l'altitudine 120.5",
                passed: printedFloat,
                diff: printedFloat ? null : "Assicurati di stampare la variabile altitudine."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 4. OPERATORI & MATEMATICA DI GIOCO (operators_math)
    // ---------------------------------------------------------
    {
        id: "rev_math_01",
        conceptId: "operators_math",
        title: "Fucina del Fabbro: Resistenza Armatura",
        scenario: "Calcolo della durabilità residua di una cotta di maglia dopo una battaglia.",
        task: "Nel codice di partenza sono definite <code>resistenza_iniziale = 80</code>, <code>danno_subito = 25</code> e <code>bonus_riparazione = 10</code>.<br><br>Calcola e salva in una nuova variabile <code>resistenza_finale</code> il valore ottenuto sottraendo il danno e aggiungendo il bonus di riparazione.<br>Infine stampa <code>resistenza_finale</code> a console (il risultato atteso è 65).",
        expectedOutput: "65",
        starterCode: `extends Node2D

func _ready():
    var resistenza_iniziale = 80
    var danno_subito = 25
    var bonus_riparazione = 10
    # Calcola resistenza_finale e stampala a console
`,
        solution: `extends Node2D

func _ready():
    var resistenza_iniziale = 80
    var danno_subito = 25
    var bonus_riparazione = 10
    var resistenza_finale = resistenza_iniziale - danno_subito + bonus_riparazione
    print(resistenza_finale)
`,
        hints: [
            {
                level: 1,
                text: "Combina gli operatori aritmetici '-' e '+' in un'unica espressione matematica."
            },
            {
                level: 2,
                text: "Assegna a resistenza_finale il calcolo: resistenza_iniziale - danno_subito + bonus_riparazione."
            },
            {
                level: 3,
                text: "Esempio:\nvar resistenza_finale = resistenza_iniziale - danno_subito + bonus_riparazione\nprint(resistenza_finale)"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const hasPrinted65 = (result.logs || []).some(l => l.trim() === "65" || l.includes("65"));
            tests.push({
                desc: "Console stampa il valore 65",
                passed: hasPrinted65,
                diff: hasPrinted65 ? null : `Atteso: 65, Ricevuto: "${(result.logs || []).join(' | ')}"`
            });
            const hasFormula = /resistenza_finale\s*=\s*resistenza_iniziale\s*-\s*danno_subito\s*\+\s*bonus_riparazione/.test(result.code);
            tests.push({
                desc: "Formula di calcolo applicata correttamente",
                passed: hasFormula,
                diff: hasFormula ? null : "Verifica che il calcolo usi le variabili fornite: resistenza_iniziale - danno_subito + bonus_riparazione."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 5. CONDIZIONI & LOGICA DECISIONALE (conditions_logic)
    // ---------------------------------------------------------
    {
        id: "rev_conditions_01",
        conceptId: "conditions_logic",
        title: "Cancello della Roccaforte Misteriosa",
        scenario: "Verifica dei requisiti di accesso alle catacombe del castello.",
        task: "All'interno di <code>_ready()</code> sono dichiarate <code>ha_chiave = true</code> e <code>livello = 12</code>.<br><br>Scrivi una struttura decisionale <code>if/else</code> con l'operatore logico <code>and</code>:<br>• Se <code>ha_chiave == true and livello >= 10</code>, stampa a console <code>Accesso Concesso</code>.<br>• Altrimenti (<code>else</code>), stampa <code>Accesso Negato</code>.",
        expectedOutput: "Accesso Concesso",
        starterCode: `extends Node2D

func _ready():
    var ha_chiave = true
    var livello = 12
    # Scrivi qui la condizione if/else con l'operatore and
`,
        solution: `extends Node2D

func _ready():
    var ha_chiave = true
    var livello = 12
    if ha_chiave == true and livello >= 10:
        print("Accesso Concesso")
    else:
        print("Accesso Negato")
`,
        hints: [
            {
                level: 1,
                text: "Utilizza l'istruzione 'if' unendo le due condizioni con la parola chiave 'and'."
            },
            {
                level: 2,
                text: "L'operatore di confronto per l'uguaglianza è '==' e quello per il maggiore o uguale è '>='. Ricordati i due punti ':' al termine di if ed else."
            },
            {
                level: 3,
                text: "Esempio:\nif ha_chiave and livello >= 10:\n    print(\"Accesso Concesso\")\nelse:\n    print(\"Accesso Negato\")"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const logs = result.logs || [];
            const hasGranted = logs.some(l => l.includes("Accesso Concesso"));
            const hasDenied = logs.some(l => l.includes("Accesso Negato"));
            tests.push({
                desc: "Console stampa 'Accesso Concesso'",
                passed: hasGranted && !hasDenied,
                diff: hasGranted ? null : `Ricevuto a console: "${logs.join(' | ')}"`
            });
            const hasAnd = /\bif\s+.*and\s+.*/.test(result.code);
            tests.push({
                desc: "Condizione if utilizza l'operatore logico 'and'",
                passed: hasAnd,
                diff: hasAnd ? null : "Assicurati di unire le condizioni con la parola chiave 'and'."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 6. ARRAY & COLLEZIONI (arrays_collections)
    // ---------------------------------------------------------
    {
        id: "rev_arrays_01",
        conceptId: "arrays_collections",
        title: "Zaino delle Pozioni Magiche",
        scenario: "Gestione dinamica dell'inventario alchimistico del personaggio.",
        task: "In <code>_ready()</code>:<br>1. Crea una variabile <code>zaino</code> contenente l'array <code>[\"Pozione Rossa\", \"Pozione Blu\"]</code>.<br>2. Aggiungi la stringa <code>\"Pozione Verde\"</code> all'array utilizzando il metodo <code>append()</code>.<br>3. Stampa a console la dimensione totale dell'array tramite <code>zaino.size()</code> (deve stampare 3).",
        expectedOutput: "3",
        starterCode: `extends Node2D

func _ready():
    # 1. Inizializza l'array zaino
    # 2. Aggiungi "Pozione Verde" con append()
    # 3. Stampa la dimensione con zaino.size()
    pass
`,
        solution: `extends Node2D

func _ready():
    var zaino = ["Pozione Rossa", "Pozione Blu"]
    zaino.append("Pozione Verde")
    print(zaino.size())
`,
        hints: [
            {
                level: 1,
                text: "Gli array in GDScript si definiscono con parentesi quadre: [elemento1, elemento2]."
            },
            {
                level: 2,
                text: "Per aggiungere un elemento in coda all'array si invoca zaino.append(\"nome\"). Per ottenere il numero di elementi si usa zaino.size()."
            },
            {
                level: 3,
                text: "Esempio:\nvar zaino = [\"Pozione Rossa\", \"Pozione Blu\"]\nzaino.append(\"Pozione Verde\")\nprint(zaino.size())"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const hasPrinted3 = (result.logs || []).some(l => l.trim() === "3" || l.includes("3"));
            tests.push({
                desc: "Console stampa la dimensione 3",
                passed: hasPrinted3,
                diff: hasPrinted3 ? null : `Ricevuto: "${(result.logs || []).join(' | ')}"`
            });
            const hasAppend = /\.append\s*\(\s*["']Pozione Verde["']\s*\)/.test(result.code);
            tests.push({
                desc: "Metodo append() invocato con 'Pozione Verde'",
                passed: hasAppend,
                diff: hasAppend ? null : "Assicurati di chiamare zaino.append(\"Pozione Verde\")."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 7. CICLI & ITERAZIONE (loops_iteration)
    // ---------------------------------------------------------
    {
        id: "rev_loops_01",
        conceptId: "loops_iteration",
        title: "Attivazione Generatori di Difesa",
        scenario: "Sequenza di accensione dei 4 generatori dello scudo perimetrale.",
        task: "All'interno di <code>_ready()</code>, scrivi un ciclo <code>for</code> che utilizzi <code>range(1, 5)</code> per iterare da 1 a 4.<br>Ad ogni iterazione, stampa a console la stringa formattata:<br><code>Generatore [numero] attivo</code> (es. <code>Generatore 1 attivo</code>, <code>Generatore 2 attivo</code>, ...).",
        expectedOutput: "Generatore 1 attivo\nGeneratore 2 attivo\nGeneratore 3 attivo\nGeneratore 4 attivo",
        starterCode: `extends Node2D

func _ready():
    # Usa un ciclo for con range(1, 5) per stampare lo stato dei 4 generatori
    pass
`,
        solution: `extends Node2D

func _ready():
    for i in range(1, 5):
        print("Generatore " + str(i) + " attivo")
`,
        hints: [
            {
                level: 1,
                text: "La funzione range(inizio, fine_esclusa) genera una sequenza numerica. Per arrivare fino a 4, il limite superiore deve essere 5."
            },
            {
                level: 2,
                text: "Usa la variabile del ciclo (ad es. 'i') per comporre il messaggio: print(\"Generatore \" + str(i) + \" attivo\")."
            },
            {
                level: 3,
                text: "Esempio:\nfor i in range(1, 5):\n    print(\"Generatore \" + str(i) + \" attivo\")"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const logs = result.logs || [];
            const has1 = logs.some(l => l.includes("Generatore 1 attivo"));
            const has2 = logs.some(l => l.includes("Generatore 2 attivo"));
            const has3 = logs.some(l => l.includes("Generatore 3 attivo"));
            const has4 = logs.some(l => l.includes("Generatore 4 attivo"));
            const all4 = has1 && has2 && has3 && has4;
            tests.push({
                desc: "Console stampa tutti e 4 i generatori (1, 2, 3 e 4)",
                passed: all4,
                diff: all4 ? null : `Ricevuto:\n${logs.join('\n')}`
            });
            const hasRange = /for\s+\w+\s+in\s+range\s*\(\s*1\s*,\s*5\s*\)/.test(result.code);
            tests.push({
                desc: "Ciclo for strutturato con range(1, 5)",
                passed: hasRange,
                diff: hasRange ? null : "Verifica di aver utilizzato 'for i in range(1, 5):'."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 8. FUNZIONI & PARAMETRI (functions_scope)
    // ---------------------------------------------------------
    {
        id: "rev_functions_01",
        conceptId: "functions_scope",
        title: "Propulsore Cosmico: Calcolo Spinta",
        scenario: "Creazione di un modulo matematico per il calcolo della spinta dei motori a ioni.",
        task: "1. All'esterno di <code>_ready()</code>, dichiara una funzione personalizzata <code>calcola_spinta(potenza: int, turbo: int)</code>.<br>2. La funzione deve restituire con <code>return</code> la formula moltiplicata: <code>(potenza + turbo) * 2</code>.<br>3. In <code>_ready()</code>, invoca <code>calcola_spinta(10, 5)</code> e stampa a console il valore restituito (deve stampare 30).",
        expectedOutput: "30",
        starterCode: `extends Node2D

# 1. Definisci qui la funzione calcola_spinta(potenza, turbo)

func _ready():
    # 2. Chiama calcola_spinta(10, 5) e stampa il risultato
    pass
`,
        solution: `extends Node2D

func calcola_spinta(potenza: int, turbo: int):
    return (potenza + turbo) * 2

func _ready():
    var spinta = calcola_spinta(10, 5)
    print(spinta)
`,
        hints: [
            {
                level: 1,
                text: "Definisci la nuova funzione allo stesso livello di indentazione di _ready(), usando la parola chiave 'func'."
            },
            {
                level: 2,
                text: "Usa l'istruzione 'return' per inviare indietro il risultato del calcolo: return (potenza + turbo) * 2."
            },
            {
                level: 3,
                text: "Esempio:\nfunc calcola_spinta(potenza, turbo):\n    return (potenza + turbo) * 2\n\nfunc _ready():\n    var s = calcola_spinta(10, 5)\n    print(s)"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const hasPrinted30 = (result.logs || []).some(l => l.trim() === "30" || l.includes("30"));
            tests.push({
                desc: "Console stampa il risultato calcolato (30)",
                passed: hasPrinted30,
                diff: hasPrinted30 ? null : `Ricevuto: "${(result.logs || []).join(' | ')}"`
            });
            const hasFuncDef = /func\s+calcola_spinta\s*\(/.test(result.code);
            tests.push({
                desc: "Funzione calcola_spinta definita con i parametri richiesti",
                passed: hasFuncDef,
                diff: hasFuncDef ? null : "Assicurati di dichiarare 'func calcola_spinta(potenza, turbo):'."
            });
            const hasReturn = /return\s+.*\(.*potenza.*\+.*turbo.*\)\s*\*\s*2/.test(result.code);
            tests.push({
                desc: "Funzione calcola_spinta utilizza return per restituire il valore",
                passed: hasReturn,
                diff: hasReturn ? null : "Verifica di usare 'return (potenza + turbo) * 2'."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 9. VETTORI & MOVIMENTO 2D (vectors_2d)
    // ---------------------------------------------------------
    {
        id: "rev_vectors_01",
        conceptId: "vectors_2d",
        title: "Spostamento Radar del Mecha",
        scenario: "Aggiornamento delle coordinate radar su griglia bidimensionale.",
        task: "In <code>_ready()</code>:<br>1. Dichiara la variabile <code>posizione = Vector2(100, 200)</code>.<br>2. Incrementa la coordinata <code>x</code> di 50 (<code>posizione.x += 50</code>).<br>3. Decrementa la coordinata <code>y</code> di 30 (<code>posizione.y -= 30</code>).<br>4. Stampa a console <code>posizione</code> (deve stampare <code>Vector2(150, 170)</code>).",
        expectedOutput: "Vector2(150, 170)",
        starterCode: `extends Node2D

func _ready():
    # Inizializza posizione con Vector2(100, 200), aggiorna x e y, poi stampa posizione
    pass
`,
        solution: `extends Node2D

func _ready():
    var posizione = Vector2(100, 200)
    posizione.x += 50
    posizione.y -= 30
    print(posizione)
`,
        hints: [
            {
                level: 1,
                text: "In Godot 4 i vettori bidimensionali si creano con il costruttore Vector2(x, y)."
            },
            {
                level: 2,
                text: "Puoi accedere e modificare direttamente i componenti spaziali del vettore usando posizione.x e posizione.y."
            },
            {
                level: 3,
                text: "Esempio:\nvar posizione = Vector2(100, 200)\nposizione.x += 50\nposizione.y -= 30\nprint(posizione)"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const hasVectorPrinted = (result.logs || []).some(l => l.includes("150") && l.includes("170"));
            tests.push({
                desc: "Console stampa il vettore risultante (150, 170)",
                passed: hasVectorPrinted,
                diff: hasVectorPrinted ? null : `Ricevuto: "${(result.logs || []).join(' | ')}"`
            });
            const hasInit = /Vector2\s*\(\s*100\s*,\s*200\s*\)/.test(result.code);
            tests.push({
                desc: "Vettore inizializzato con Vector2(100, 200)",
                passed: hasInit,
                diff: hasInit ? null : "Verifica di aver impostato: var posizione = Vector2(100, 200)."
            });
            const hasAxes = /posizione\.x\s*\+=\s*50/.test(result.code) && /posizione\.y\s*-=\s*30/.test(result.code);
            tests.push({
                desc: "Coordinate x e y aggiornate con += 50 e -= 30",
                passed: hasAxes,
                diff: hasAxes ? null : "Verifica di aggiornare i componenti: posizione.x += 50 e posizione.y -= 30."
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 10. DIZIONARI CHIAVE-VALORE (dictionaries)
    // ---------------------------------------------------------
    {
        id: "rev_dictionaries_01",
        conceptId: "dictionaries",
        title: "Tavola del Bottino del Dungeon",
        scenario: "Verifica e sblocco delle ricompense trovate in uno scrigno dorato.",
        task: "In <code>_ready()</code>:<br>1. Crea un dizionario <code>bottino = {\"oro\": 150, \"gemme\": 3}</code>.<br>2. Aggiungi la chiave <code>\"artefatti\"</code> con valore <code>1</code>.<br>3. Con un blocco <code>if</code>, verifica se la chiave esiste tramite <code>bottino.has(\"artefatti\")</code> e in caso affermativo stampa il valore della chiave <code>\"oro\"</code> (deve stampare 150).",
        expectedOutput: "150",
        starterCode: `extends Node2D

func _ready():
    # 1. Inizializza il dizionario bottino con "oro" e "gemme"
    # 2. Aggiungi la chiave "artefatti" pari a 1
    # 3. Se bottino.has("artefatti"), stampa bottino["oro"]
    pass
`,
        solution: `extends Node2D

func _ready():
    var bottino = {"oro": 150, "gemme": 3}
    bottino["artefatti"] = 1
    if bottino.has("artefatti"):
        print(bottino["oro"])
`,
        hints: [
            {
                level: 1,
                text: "I dizionari memorizzano coppie chiave: valore tra parentesi graffe {}."
            },
            {
                level: 2,
                text: "Per aggiungere o modificare una voce usa la notazione a parentesi quadre: bottino[\"artefatti\"] = 1. Per controllare l'esistenza di una chiave usa il metodo .has(\"chiave\")."
            },
            {
                level: 3,
                text: "Esempio:\nvar bottino = {\"oro\": 150, \"gemme\": 3}\nbottino[\"artefatti\"] = 1\nif bottino.has(\"artefatti\"):\n    print(bottino[\"oro\"])"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const hasPrinted150 = (result.logs || []).some(l => l.trim() === "150" || l.includes("150"));
            tests.push({
                desc: "Console stampa il valore 150 della chiave 'oro'",
                passed: hasPrinted150,
                diff: hasPrinted150 ? null : `Ricevuto: "${(result.logs || []).join(' | ')}"`
            });
            const hasDictKey = /bottino\s*\[\s*["']artefatti["']\s*\]\s*=\s*1/.test(result.code);
            tests.push({
                desc: "Chiave 'artefatti' inserita con successo nel dizionario",
                passed: hasDictKey,
                diff: hasDictKey ? null : "Assicurati di fare: bottino[\"artefatti\"] = 1."
            });
            const hasMethod = /bottino\.has\s*\(\s*["']artefatti["']\s*\)/.test(result.code);
            tests.push({
                desc: "Metodo .has('artefatti') impiegato per la verifica di sicurezza",
                passed: hasMethod,
                diff: hasMethod ? null : "Assicurati di usare if bottino.has(\"artefatti\"):."
            });
            return tests;
        }
    }
];

// =============================================================
// MOTORE STRATEGICO DI RIPASSO DIDATTICO (ReviewEngine)
// Regole trasparenti, nessuna percentuale opaca, nessuna penalizzazione
// =============================================================
const ReviewEngine = {
    /**
     * Calcola lo stato didattico trasparente di un concetto basato sulla telemetria P3.1
     * e sullo storico dei ripassi effettuati.
     * 
     * Regole di transizione:
     * - Un singolo errore isolato NON innesca raccomandazione.
     * - 'da_ripassare': se si sono registrati >= 2 errori o >= 2 livelli di suggerimento prima del primo successo,
     *   oppure se l'ultimo ripasso è fallito.
     * - 'consolidato': se tutte le lezioni sono state completate senza attrito, OPPURE se lo studente ha
     *   superato con successo una variante di ripasso per quell'argomento.
     */
    getConceptStatus(conceptId, state) {
        if (!state) return { status: 'non_iniziato', reason: 'Nessun dato di progresso', priority: 0 };

        const telemetry = state.learningTelemetry?.lessons || {};
        const finishedLessons = state.completedLessons || [];
        const reviewProgress = state.reviewProgress || { completedVariants: [], variantHistory: {} };

        // Recupera le lezioni del corso appartenenti a questo concetto
        const conceptLessons = (typeof LESSONS_DATA !== 'undefined')
            ? LESSONS_DATA.filter(l => l.conceptId === conceptId)
            : [];

        if (conceptLessons.length === 0) {
            return {
                status: 'disponibile',
                reason: 'Argomento teorico disponibile per la pratica',
                priority: 1,
                hasActiveFriction: false,
                metrics: { errors: 0, maxHints: 0, variantsDone: 0 }
            };
        }

        const startedLessons = conceptLessons.filter(l => telemetry[String(l.id)] && telemetry[String(l.id)].total_runs > 0);
        const completedLessons = conceptLessons.filter(l => finishedLessons.includes(l.id));

        if (startedLessons.length === 0 && completedLessons.length === 0) {
            return {
                status: 'non_iniziato',
                reason: 'Lezioni di questo argomento non ancora affrontate nella mappa',
                priority: 0,
                hasActiveFriction: false,
                metrics: { errors: 0, maxHints: 0, variantsDone: 0, totalVariants: 0 }
            };
        }

        // Recupera le varianti di ripasso disponibili per questo concetto
        const conceptVariants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId);
        const completedVariantsForConcept = conceptVariants.filter(v => reviewProgress.completedVariants?.includes(v.id));

        // Raccoglie metriche di attrito didattico reale registrato dalla P3.1
        let totalErrorsBeforeFirstSuccess = 0;
        let maxHintsBeforeFirstSuccess = 0;
        let hasActiveFriction = false;
        let problemLessons = [];

        conceptLessons.forEach(l => {
            const tel = telemetry[String(l.id)];
            if (tel) {
                const errs = tel.failed_before_first_success || 0;
                const hints = tel.hints_opened_before_first_success || 0;
                totalErrorsBeforeFirstSuccess += errs;
                if (hints > maxHintsBeforeFirstSuccess) {
                    maxHintsBeforeFirstSuccess = hints;
                }
                // Criterio trasparente: almeno 2 errori o 2 livelli di suggerimento indicano attrito
                if (errs >= 2 || hints >= 2) {
                    hasActiveFriction = true;
                    problemLessons.push({ lessonId: l.id, errors: errs, hints: hints });
                }
            }
        });

        // 1. Se una variante di ripasso è già stata completata con successo, il concetto è CONSOLIDATO!
        if (completedVariantsForConcept.length > 0) {
            return {
                status: 'consolidato',
                badgeText: 'CONSOLIDATO',
                badgeClass: 'badge-consolidated',
                reason: `Argomento consolidato con successo: ${completedVariantsForConcept.length} variante/i di ripasso superata/e`,
                priority: 1,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: completedVariantsForConcept.length,
                    totalVariants: conceptVariants.length
                }
            };
        }

        // 2. Se ha incontrato attrito significativo (>= 2 errori o >= 2 hint), è DA RIPASSARE!
        if (hasActiveFriction) {
            const primaryReason = totalErrorsBeforeFirstSuccess >= 2
                ? `Consigliato: riscontrati ${totalErrorsBeforeFirstSuccess} tentativi falliti prima del successo`
                : `Consigliato: utilizzati ${maxHintsBeforeFirstSuccess} livelli di suggerimento nella lezione`;

            return {
                status: 'da_ripassare',
                badgeText: 'CONSIGLIATO',
                badgeClass: 'badge-recommended',
                reason: primaryReason,
                priority: 10 + totalErrorsBeforeFirstSuccess + (maxHintsBeforeFirstSuccess * 2),
                hasActiveFriction: true,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: 0,
                    totalVariants: conceptVariants.length
                }
            };
        }

        // 3. Se tutte le lezioni sono state completate senza intoppi (0 o 1 errore), è CONSOLIDATO!
        if (completedLessons.length === conceptLessons.length && conceptLessons.length > 0) {
            return {
                status: 'consolidato',
                badgeText: 'CONSOLIDATO',
                badgeClass: 'badge-consolidated',
                reason: 'Superato con facilità: nessun attrito significativo riscontrato',
                priority: 2,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: 0,
                    totalVariants: conceptVariants.length
                }
            };
        }

        // 4. In corso / disponibile
        return {
            status: 'disponibile',
            badgeText: 'DISPONIBILE',
            badgeClass: 'badge-available',
            reason: 'Argomento sbloccato: ripasso facoltativo a disposizione',
            priority: 3,
            hasActiveFriction: false,
            metrics: {
                errors: totalErrorsBeforeFirstSuccess,
                maxHints: maxHintsBeforeFirstSuccess,
                variantsDone: 0,
                totalVariants: conceptVariants.length
            }
        };
    },

    /**
     * Restituisce l'elenco dei concetti raccomandati ordinati per priorità didattica
     */
    getRecommendedConcepts(state) {
        if (!state) return [];
        const result = [];
        const catalog = (typeof CONCEPTS_CATALOG !== 'undefined') ? CONCEPTS_CATALOG : {};

        for (const [conceptId, conceptMeta] of Object.entries(catalog)) {
            const statusInfo = this.getConceptStatus(conceptId, state);
            if (statusInfo.status === 'da_ripassare') {
                const variants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId);
                result.push({
                    concept: conceptMeta,
                    variants: variants,
                    ...statusInfo
                });
            }
        }

        result.sort((a, b) => b.priority - a.priority);
        return result;
    },

    /**
     * Restituisce tutti i concetti che lo studente ha già affrontato o sbloccato
     */
    getAllConceptsWithStatus(state) {
        if (!state) return [];
        const result = [];
        const catalog = (typeof CONCEPTS_CATALOG !== 'undefined') ? CONCEPTS_CATALOG : {};

        for (const [conceptId, conceptMeta] of Object.entries(catalog)) {
            const statusInfo = this.getConceptStatus(conceptId, state);
            const variants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId);
            result.push({
                concept: conceptMeta,
                variants: variants,
                ...statusInfo
            });
        }

        return result;
    },

    /**
     * Registra l'esito di un tentativo su una specifica variante di ripasso
     */
    recordVariantAttempt(variantId, isSuccess, hintsRevealed, state) {
        if (!state) return;
        if (!state.reviewProgress) {
            state.reviewProgress = { completedVariants: [], variantHistory: {} };
        }
        if (!state.reviewProgress.completedVariants) {
            state.reviewProgress.completedVariants = [];
        }
        if (!state.reviewProgress.variantHistory) {
            state.reviewProgress.variantHistory = {};
        }

        const nowIso = new Date().toISOString();
        const vHist = state.reviewProgress.variantHistory[variantId] || {
            attempts: 0,
            successes: 0,
            hints_used: 0,
            first_attempt_at: null,
            last_attempt_at: null,
            first_success_at: null
        };

        vHist.attempts++;
        if (!vHist.first_attempt_at) vHist.first_attempt_at = nowIso;
        vHist.last_attempt_at = nowIso;
        vHist.hints_used = Math.max(vHist.hints_used || 0, hintsRevealed || 0);

        if (isSuccess) {
            vHist.successes++;
            if (!vHist.first_success_at) vHist.first_success_at = nowIso;
            if (!state.reviewProgress.completedVariants.includes(variantId)) {
                state.reviewProgress.completedVariants.push(variantId);
            }
        }

        state.reviewProgress.variantHistory[variantId] = vHist;
    }
};

if (typeof window !== 'undefined') {
    window.REVIEW_VARIANTS = REVIEW_VARIANTS;
    window.ReviewEngine = ReviewEngine;
}
