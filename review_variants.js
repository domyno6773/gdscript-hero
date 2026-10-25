/**
 * GDScript Hero - P3.3: Modulo Ripasso Intelligente & Catalogo Varianti Didattiche
 * Generazione deterministica, raccomandazioni trasparenti basate su telemetria P3.1
 * e varianti alternative con scenari differenti.
 */


async function reviewAuditMutation(result, variantId, alternateCode, expectedLine) {
 if (!alternateCode || alternateCode === result.code) return false;
 const variant = REVIEW_VARIANTS.find(v => v.id === variantId);
 const replay = await GDScriptRuntime.execute(alternateCode, { lesson: variant });
 if (!replay.success) return false;
 const target = String(expectedLine).trim();
 return (result.logs || []).some(v => String(v).trim() === target) &&
     !(replay.logs || []).some(v => String(v).trim() === target);
}
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
            const code = result.code || '';

            // 1. Verifica di due istruzioni print distinte nel codice sorgente eseguibile
            // (escludendo print all'interno di commenti # o stringhe letterali)
            const cleanCode = (typeof stripCommentsAndStrings === 'function')
                ? stripCommentsAndStrings(code)
                : (code || '')
                    .replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, '""')
                    .replace(/"(?:\\.|[^"\\])*"/g, '""')
                    .replace(/'(?:\\.|[^'\\])*'/g, "''")
                    .replace(/#.*$/gm, '');
            const printMatches = cleanCode.match(/\bprint\s*\(/g) || [];
            const hasTwoPrints = printMatches.length >= 2;
            tests.push({
                desc: "Utilizzo di due istruzioni print() distinte",
                passed: hasTwoPrints,
                diff: hasTwoPrints ? null : `Rilevate ${printMatches.length} istruzioni print() eseguibili (commenti e stringhe esclusi). La consegna richiede due istruzioni print() separate.`
            });

            // 2. Verifica dei messaggi su righe separate ed ordinate
            const l1Idx = logs.findIndex(l => l.includes("Astronave: Stella Polare") && !l.includes("Sistemi di bordo: Operativi"));
            const l2Idx = logs.findIndex(l => l.includes("Sistemi di bordo: Operativi") && !l.includes("Astronave: Stella Polare"));
            const distinctLinesInOrder = (l1Idx !== -1 && l2Idx !== -1 && l1Idx < l2Idx);

            tests.push({
                desc: "Console stampa 'Astronave: Stella Polare' sulla prima riga",
                passed: l1Idx !== -1,
                diff: l1Idx !== -1 ? null : `Atteso su riga separata: "Astronave: Stella Polare", Ricevuto: "${logs.join(' | ')}"`
            });
            tests.push({
                desc: "Console stampa 'Sistemi di bordo: Operativi' sulla riga successiva",
                passed: l2Idx !== -1 && distinctLinesInOrder,
                diff: (l2Idx !== -1 && distinctLinesInOrder) ? null : `Atteso su riga successiva: "Sistemi di bordo: Operativi", Ricevuto: "${logs.join(' | ')}"`
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
            const causalAudit = /\bif[^\n:]*\bha_chiave\b[^\n:]*\band\b[^\n:]*\blivello\b/.test(result.code || '');
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
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
            const causalAudit = await reviewAuditMutation(result, 'rev_loops_01', (result.code || '').replace(/^(\s*for\s+\w+\s+in\s+)range\s*\(\s*1\s*,\s*5\s*\)(\s*:)/m, '$1range(0)$2'), 'Generatore 1 attivo');
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
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
            const causalAudit = await reviewAuditMutation(result, 'rev_functions_01', (result.code || '').replace(/\breturn\s+[^\n]+/, 'return 9999'), '30');
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
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
    },

    // ---------------------------------------------------------
    // 11. I SEGNALI DI GODOT (signals) - Variante 1
    // ---------------------------------------------------------
    {
        id: "rev_signals_01",
        conceptId: "signals",
        title: "Allarme Perimetrale della Base",
        scenario: "Attivazione del protocollo di sicurezza di un avamposto spaziale dopo il rilevamento di un'intrusione.",
        task: "Dichiara in cima allo script il segnale personalizzato: <code>signal allarme_attivato</code>.<br><br>All'interno di <code>_ready()</code>:<br>1. Connetti il segnale alla funzione di gestione: <code>allarme_attivato.connect(on_allarme_attivato)</code><br>2. Emetti il segnale con la sintassi nativa di Godot 4: <code>allarme_attivato.emit()</code>",
        expectedOutput: "[ALLARME] Violazione perimetro rilevata!",
        starterCode: `extends Node

# Dichiara qui il segnale allarme_attivato


func _ready():
    # Connetti il segnale a on_allarme_attivato ed emettilo sotto
    pass

func on_allarme_attivato():
    print("[ALLARME] Violazione perimetro rilevata!")
`,
        solution: `extends Node

signal allarme_attivato

func _ready():
    allarme_attivato.connect(on_allarme_attivato)
    allarme_attivato.emit()

func on_allarme_attivato():
    print("[ALLARME] Violazione perimetro rilevata!")
`,
        hints: [
            {
                level: 1,
                text: "Dichiara il segnale a livello radice dello script (fuori da ogni funzione) usando la parola chiave 'signal'."
            },
            {
                level: 2,
                text: "In _ready(), prima effettua la connessione con 'allarme_attivato.connect(on_allarme_attivato)', poi emetti la notifica con 'allarme_attivato.emit()'."
            },
            {
                level: 3,
                text: "Esempio:\nsignal allarme_attivato\n\nfunc _ready():\n    allarme_attivato.connect(on_allarme_attivato)\n    allarme_attivato.emit()"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const cleanCode = (typeof stripCommentsAndStrings === 'function') ? stripCommentsAndStrings(result.code || '') : (result.code || '');
            const hasSigDecl = /\bsignal\s+allarme_attivato\b/.test(cleanCode);
            tests.push({
                desc: "Segnale 'signal allarme_attivato' dichiarato a inizio script",
                passed: hasSigDecl,
                diff: hasSigDecl ? null : "Dichiara 'signal allarme_attivato' in cima allo script."
            });
            const hasConnect = /allarme_attivato\.connect\s*\(\s*on_allarme_attivato\s*\)/.test(cleanCode) || /connect\s*\(\s*["']allarme_attivato["']/.test(cleanCode);
            tests.push({
                desc: "Segnale connesso alla funzione callback 'on_allarme_attivato'",
                passed: hasConnect,
                diff: hasConnect ? null : "Connetti il segnale con allarme_attivato.connect(on_allarme_attivato)."
            });
            const hasEmit = /allarme_attivato\.emit\s*\(/.test(cleanCode) || /emit_signal\s*\(\s*["']allarme_attivato["']/.test(cleanCode);
            tests.push({
                desc: "Metodo .emit() invocato per emettere il segnale",
                passed: hasEmit,
                diff: hasEmit ? null : "Emetti il segnale con allarme_attivato.emit()."
            });
            const logs = result.logs || [];
            const hasLog = logs.some(l => l.includes("[ALLARME] Violazione perimetro rilevata!"));
            tests.push({
                desc: "Callback eseguita con successo via segnale",
                passed: hasLog,
                diff: hasLog ? null : `Atteso: "[ALLARME] Violazione perimetro rilevata!", Ricevuto: "${logs.join(' | ')}"`
            });
            const causalAudit = !!(result.scope?.allarme_attivato?.emissions?.some(args => args.length === 0));
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 11. I SEGNALI DI GODOT (signals) - Variante 2 (Con Parametri)
    // ---------------------------------------------------------
    {
        id: "rev_signals_02",
        conceptId: "signals",
        title: "Ricarica Nucleo Energetico",
        scenario: "Notifica a evento del ripristino di energia agli scudi difensivi con passaggio di parametri.",
        task: "Dichiara in cima allo script il segnale con parametro: <code>signal energia_ricaricata(quantita)</code>.<br><br>All'interno di <code>_ready()</code>:<br>1. Connetti il segnale alla funzione: <code>energia_ricaricata.connect(quando_ricaricato)</code><br>2. Emetti il segnale passando il valore numerico <code>50</code>: <code>energia_ricaricata.emit(50)</code>",
        expectedOutput: "Energia ripristinata: +50 MW",
        starterCode: `extends Node

# Dichiara qui il segnale energia_ricaricata con parametro quantita


func _ready():
    # Connetti a quando_ricaricato ed emetti passando 50
    pass

func quando_ricaricato(quantita):
    print("Energia ripristinata: +" + str(quantita) + " MW")
`,
        solution: `extends Node

signal energia_ricaricata(quantita)

func _ready():
    energia_ricaricata.connect(quando_ricaricato)
    energia_ricaricata.emit(50)

func quando_ricaricato(quantita):
    print("Energia ripristinata: +" + str(quantita) + " MW")
`,
        hints: [
            {
                level: 1,
                text: "I segnali in Godot possono trasportare dati specificando parametri tra parentesi: signal nome_segnale(parametro)."
            },
            {
                level: 2,
                text: "Quando invochi .emit(valore), l'argomento fornito viene recapitato come parametro alla funzione connessa."
            },
            {
                level: 3,
                text: "Esempio:\nsignal energia_ricaricata(quantita)\n\nfunc _ready():\n    energia_ricaricata.connect(quando_ricaricato)\n    energia_ricaricata.emit(50)"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const cleanCode = (typeof stripCommentsAndStrings === 'function') ? stripCommentsAndStrings(result.code || '') : (result.code || '');
            const hasSigDecl = /\bsignal\s+energia_ricaricata\b/.test(cleanCode);
            tests.push({
                desc: "Segnale 'signal energia_ricaricata' dichiarato",
                passed: hasSigDecl,
                diff: hasSigDecl ? null : "Dichiara 'signal energia_ricaricata(quantita)' in cima allo script."
            });
            const hasEmitVal = /energia_ricaricata\.emit\s*\(\s*50\s*\)/.test(cleanCode) || /emit_signal\s*\(\s*["']energia_ricaricata["']\s*,\s*50\s*\)/.test(cleanCode);
            tests.push({
                desc: "Segnale emesso con argomento numerico 50",
                passed: hasEmitVal,
                diff: hasEmitVal ? null : "Invocare energia_ricaricata.emit(50)."
            });
            const logs = result.logs || [];
            const hasLog = logs.some(l => l.includes("Energia ripristinata: +50 MW"));
            tests.push({
                desc: "Callback ha ricevuto il parametro stampando la riga corretta",
                passed: hasLog,
                diff: hasLog ? null : `Atteso: "Energia ripristinata: +50 MW", Ricevuto: "${logs.join(' | ')}"`
            });
            const causalAudit = !!(result.scope?.energia_ricaricata?.emissions?.some(args => args.length === 1 && args[0] === 50));
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 12. CLASSI E PROGRAMMAZIONE AD OGGETTI (oop_classes)
    // ---------------------------------------------------------
    {
        id: "rev_oop_01",
        conceptId: "oop_classes",
        title: "Unità Robotica da Esplorazione",
        scenario: "Creazione di una classe interna per modellare la matricola e la percentuale di batteria di droni da ricognizione.",
        task: "Definisci la classe interna <code>class Drone:</code> con due variabili di istanza: <code>var matricola</code> e <code>var batteria</code>.<br><br>Nel costruttore <code>func _init(m, b):</code> assegna <code>self.matricola = m</code> e <code>self.batteria = b</code>.<br><br>All'interno di <code>_ready()</code>:<br>1. Crea un'istanza con <code>var d = Drone.new(\"EX-101\", 100)</code><br>2. Stampa a console la stringa formattata:<br><code>Drone EX-101 operativo (Batteria: 100%)</code>",
        expectedOutput: "Drone EX-101 operativo (Batteria: 100%)",
        starterCode: `extends Node

# Definisci la classe interna Drone con il costruttore _init sotto


func _ready():
    # Istanzia il drone con Drone.new("EX-101", 100) e stampa la riga attesa
    pass
`,
        solution: `extends Node

class Drone:
    var matricola
    var batteria
    func _init(m, b):
        self.matricola = m
        self.batteria = b

func _ready():
    var d = Drone.new("EX-101", 100)
    print("Drone " + d.matricola + " operativo (Batteria: " + str(d.batteria) + "%)")
`,
        hints: [
            {
                level: 1,
                text: "In GDScript le classi interne si dichiarano con 'class NomeClasse:'. Al loro interno definisci le proprietà e il costruttore speciale _init."
            },
            {
                level: 2,
                text: "Nel costruttore _init(m, b), memorizza gli argomenti usando self.matricola = m e self.batteria = b."
            },
            {
                level: 3,
                text: "Esempio:\nclass Drone:\n    var matricola\n    var batteria\n    func _init(m, b):\n        self.matricola = m\n        self.batteria = b\n\nfunc _ready():\n    var d = Drone.new(\"EX-101\", 100)\n    print(\"Drone \" + d.matricola + \" operativo (Batteria: \" + str(d.batteria) + \"%)\")"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const cleanCode = (typeof stripCommentsAndStrings === 'function') ? stripCommentsAndStrings(result.code || '') : (result.code || '');
            const hasClass = /\bclass\s+Drone\b/.test(cleanCode);
            tests.push({
                desc: "Dichiarazione 'class Drone:' presente nello script",
                passed: hasClass,
                diff: hasClass ? null : "Definisci la classe con la sintassi: class Drone:."
            });
            const hasInit = /func\s+_init\s*\(/.test(cleanCode);
            tests.push({
                desc: "Costruttore 'func _init' implementato nella classe",
                passed: hasInit,
                diff: hasInit ? null : "Aggiungi il costruttore func _init(m, b) all'interno della classe Drone."
            });
            const hasNew = /Drone\.new\s*\(\s*["']EX-101["']\s*,\s*100\s*\)/.test(result.code || '');
            tests.push({
                desc: "Istanziazione dell'oggetto con Drone.new('EX-101', 100)",
                passed: hasNew,
                diff: hasNew ? null : "Istanzia l'oggetto chiamando Drone.new(\"EX-101\", 100)."
            });
            const logs = result.logs || [];
            const hasLog = logs.some(l => l.includes("Drone EX-101 operativo (Batteria: 100%)"));
            tests.push({
                desc: "Console stampa 'Drone EX-101 operativo (Batteria: 100%)'",
                passed: hasLog,
                diff: hasLog ? null : `Atteso: "Drone EX-101 operativo (Batteria: 100%)", Ricevuto: "${logs.join(' | ')}"`
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 13. ALBERO DELLA SCENA E I NODI (scene_tree_nodes)
    // ---------------------------------------------------------
    {
        id: "rev_scene_tree_01",
        conceptId: "scene_tree_nodes",
        title: "Pannello Termico del Generatore",
        scenario: "Ispezione e aggiornamento del monitor di temperatura del generatore tramite il nodo Label presente nella scena.",
        task: "Nella scena è presente il nodo figlio <code>MonitorTermico</code> (tipo Label).<br><br>All'interno di <code>_ready()</code>:<br>1. Accedi al nodo con la sintassi nativa <code>$MonitorTermico</code> (oppure <code>get_node(\"MonitorTermico\")</code>) e assegna alla proprietà <code>text</code> il valore <code>\"Temperatura: 300 K\"</code>.<br>2. Stampa a console il testo aggiornato: <code>print(\"Monitor aggiornato: \", $MonitorTermico.text)</code>.",
        expectedOutput: "Monitor aggiornato: Temperatura: 300 K",
        initialNodes: [
            { type: "Label", name: "MonitorTermico", text: "Temperatura: Sconosciuta" }
        ],
        requiresSceneTree: true,
        requires2D: false,
        starterCode: `extends Node

func _ready():
    # Accedi al nodo $MonitorTermico, aggiorna text e stampa a console
    pass
`,
        solution: `extends Node

func _ready():
    $MonitorTermico.text = "Temperatura: 300 K"
    print("Monitor aggiornato: ", $MonitorTermico.text)
`,
        hints: [
            {
                level: 1,
                text: "In Godot puoi accedere a un nodo figlio diretto presente nella scena usando la sintassi rapida $NomeNodo o la funzione get_node(\"NomeNodo\")."
            },
            {
                level: 2,
                text: "I nodi di tipo Label possiedono la proprietà 'text': assegna un nuovo valore con $MonitorTermico.text = \"Temperatura: 300 K\"."
            },
            {
                level: 3,
                text: "Esempio:\nfunc _ready():\n    $MonitorTermico.text = \"Temperatura: 300 K\"\n    print(\"Monitor aggiornato: \", $MonitorTermico.text)"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const scene = result.scene;
            const nodeExists = scene && scene.has_node("MonitorTermico");
            tests.push({
                desc: "Nodo 'MonitorTermico' presente nell'albero della scena",
                passed: !!nodeExists,
                diff: nodeExists ? null : "Il nodo MonitorTermico non è stato trovato nella scena."
            });
            const lbl = nodeExists ? scene.get_node("MonitorTermico") : null;
            const textUpdated = lbl && lbl.text === "Temperatura: 300 K";
            tests.push({
                desc: "Proprietà text di MonitorTermico impostata a 'Temperatura: 300 K'",
                passed: !!textUpdated,
                diff: textUpdated ? null : `Testo attuale del nodo: "${lbl ? lbl.text : 'null'}"`
            });
            const logs = result.logs || [];
            const hasLog = logs.some(l => l.includes("Monitor aggiornato: Temperatura: 300 K") || l.includes("Monitor aggiornato:  Temperatura: 300 K"));
            tests.push({
                desc: "Console stampa 'Monitor aggiornato: Temperatura: 300 K'",
                passed: hasLog,
                diff: hasLog ? null : `Ricevuto: "${logs.join(' | ')}"`
            });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 14. INTERFACCIA UTENTE E PULSANTI (ui_button_interaction)
    // ---------------------------------------------------------
    {
        id: "rev_ui_button_01",
        conceptId: "ui_button_interaction",
        title: "Pulsante di Lancio Capsula",
        scenario: "Interazione con l'interfaccia utente: rilevare il click su un pulsante Button e avviare la sequenza di volo.",
        task: "Nella scena è presente il nodo <code>BtnLancio</code> di tipo Button.<br><br>All'interno di <code>_ready()</code>:<br>1. Connetti il segnale nativo <code>pressed</code> del pulsante alla funzione <code>quando_premuto</code>: <code>$BtnLancio.pressed.connect(quando_premuto)</code><br>2. Simula l'interazione premendo il pulsante tramite l'emissione del segnale: <code>$BtnLancio.pressed.emit()</code>",
        expectedOutput: "Sequenza di lancio avviata con successo!",
        initialNodes: [
            { type: "Button", name: "BtnLancio", text: "Inizia Sequenza" }
        ],
        requiresSceneTree: true,
        requires2D: false,
        starterCode: `extends Node

func _ready():
    # Connetti $BtnLancio.pressed a quando_premuto ed emettilo sotto
    pass

func quando_premuto():
    print("Sequenza di lancio avviata con successo!")
`,
        solution: `extends Node

func _ready():
    $BtnLancio.pressed.connect(quando_premuto)
    $BtnLancio.pressed.emit()

func quando_premuto():
    print("Sequenza di lancio avviata con successo!")
`,
        hints: [
            {
                level: 1,
                text: "I nodi Button in Godot offrono il segnale nativo 'pressed', emesso ogni volta che l'utente clicca o preme il pulsante."
            },
            {
                level: 2,
                text: "Usa la sintassi Godot 4: $BtnLancio.pressed.connect(quando_premuto) per associare la funzione al click, e poi emettilo con $BtnLancio.pressed.emit()."
            },
            {
                level: 3,
                text: "Esempio:\nfunc _ready():\n    $BtnLancio.pressed.connect(quando_premuto)\n    $BtnLancio.pressed.emit()"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const cleanCode = (typeof stripCommentsAndStrings === 'function') ? stripCommentsAndStrings(result.code || '') : (result.code || '');
            const hasConnect = /\$BtnLancio\.pressed\.connect\s*\(\s*quando_premuto\s*\)/.test(cleanCode) || /get_node\(["']BtnLancio["']\)\.pressed\.connect/.test(cleanCode);
            tests.push({
                desc: "Segnale 'pressed' di $BtnLancio connesso a 'quando_premuto'",
                passed: hasConnect,
                diff: hasConnect ? null : "Connetti con $BtnLancio.pressed.connect(quando_premuto)."
            });
            const hasEmit = /\$BtnLancio\.pressed\.emit\s*\(/.test(cleanCode) || /get_node\(["']BtnLancio["']\)\.pressed\.emit/.test(cleanCode);
            tests.push({
                desc: "Metodo pressed.emit() invocato per simulare il click",
                passed: hasEmit,
                diff: hasEmit ? null : "Invocare $BtnLancio.pressed.emit() per attivare la funzione."
            });
            const logs = result.logs || [];
            const hasLog = logs.some(l => l.includes("Sequenza di lancio avviata con successo!"));
            tests.push({
                desc: "Callback di risposta eseguita e log stampato",
                passed: hasLog,
                diff: hasLog ? null : `Atteso: "Sequenza di lancio avviata con successo!", Ricevuto: "${logs.join(' | ')}"`
            });
            const causalAudit = !!(result.scene?.get_node('BtnLancio')?.pressed?.emissions?.length);
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 15. TIMER E CICLO DI VITA DEI NODI (timers_lifecycle)
    // ---------------------------------------------------------
    {
        id: "rev_timers_01",
        conceptId: "timers_lifecycle",
        title: "Timer di Detonazione e Pulizia Nodo",
        scenario: "Gestione temporizzata del conto alla rovescia di una mina e disattivazione/rimozione grafica tramite queue_free().",
        task: "Nella scena sono presenti un <code>TimerMina</code> (tipo Timer) e un <code>MinaGrafica</code> (tipo ColorRect).<br><br>All'interno di <code>_ready()</code>:<br>1. Connetti il segnale <code>timeout</code> del timer alla funzione <code>fai_esplodere</code>: <code>$TimerMina.timeout.connect(fai_esplodere)</code><br>2. Emetti il segnale con: <code>$TimerMina.timeout.emit()</code><br><br>All'interno della funzione <code>fai_esplodere()</code>:<br>• Stampa a console: <code>print(\"Detonazione mina energetica!\")</code><br>• Rimuovi in sicurezza il nodo grafico chiamando: <code>$MinaGrafica.queue_free()</code>",
        expectedOutput: "Detonazione mina energetica!",
        initialNodes: [
            { type: "Timer", name: "TimerMina", wait_time: 1.0 },
            { type: "ColorRect", name: "MinaGrafica" }
        ],
        requiresSceneTree: true,
        requires2D: false,
        starterCode: `extends Node

func _ready():
    # Connetti $TimerMina.timeout a fai_esplodere ed emettilo sotto
    pass

func fai_esplodere():
    # Stampa la frase e rimuovi $MinaGrafica con queue_free()
    pass
`,
        solution: `extends Node

func _ready():
    $TimerMina.timeout.connect(fai_esplodere)
    $TimerMina.timeout.emit()

func fai_esplodere():
    print("Detonazione mina energetica!")
    $MinaGrafica.queue_free()
`,
        hints: [
            {
                level: 1,
                text: "I nodi Timer emettono il segnale 'timeout' quando il tempo impostato scade. Connettilo con $TimerMina.timeout.connect(fai_esplodere)."
            },
            {
                level: 2,
                text: "In Godot non si distruggono i nodi bruscamente: si invoca queue_free() sul nodo desiderato ($MinaGrafica.queue_free()) per eliminarlo in sicurezza al termine del frame."
            },
            {
                level: 3,
                text: "Esempio:\nfunc _ready():\n    $TimerMina.timeout.connect(fai_esplodere)\n    $TimerMina.timeout.emit()\n\nfunc fai_esplodere():\n    print(\"Detonazione mina energetica!\")\n    $MinaGrafica.queue_free()"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const cleanCode = (typeof stripCommentsAndStrings === 'function') ? stripCommentsAndStrings(result.code || '') : (result.code || '');
            const hasConnect = /\$TimerMina\.timeout\.connect\s*\(\s*fai_esplodere\s*\)/.test(cleanCode) || /get_node\(["']TimerMina["']\)\.timeout\.connect/.test(cleanCode);
            tests.push({
                desc: "Segnale 'timeout' di $TimerMina connesso a 'fai_esplodere'",
                passed: hasConnect,
                diff: hasConnect ? null : "Connetti con $TimerMina.timeout.connect(fai_esplodere)."
            });
            const hasQueueFree = /\$MinaGrafica\.queue_free\s*\(/.test(cleanCode) || /get_node\(["']MinaGrafica["']\)\.queue_free/.test(cleanCode);
            tests.push({
                desc: "Istruzione $MinaGrafica.queue_free() presente",
                passed: hasQueueFree,
                diff: hasQueueFree ? null : "Invoca $MinaGrafica.queue_free() all'interno di fai_esplodere()."
            });
            const scene = result.scene;
            const isRemoved = scene ? (!scene.has_node("MinaGrafica") || (scene.get_node("MinaGrafica") && scene.get_node("MinaGrafica")._is_queued_for_deletion)) : false;
            tests.push({
                desc: "Nodo MinaGrafica rimosso o accodato per eliminazione (queue_free)",
                passed: isRemoved,
                diff: isRemoved ? null : "Il nodo MinaGrafica non è stato marcato per l'eliminazione con queue_free()."
            });
            const logs = result.logs || [];
            const hasLog = logs.some(l => l.includes("Detonazione mina energetica!"));
            tests.push({
                desc: "Console stampa 'Detonazione mina energetica!'",
                passed: hasLog,
                diff: hasLog ? null : `Atteso: "Detonazione mina energetica!", Ricevuto: "${logs.join(' | ')}"`
            });
            const causalAudit = !!(result.scene?.get_node('TimerMina')?.timeout?.emissions?.length);
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
            return tests;
        }
    },

    // ---------------------------------------------------------
    // 5. CONDIZIONI E LOGICA (conditions_logic) - Variante 2
    // ---------------------------------------------------------
    {
        id: "rev_conditions_02",
        conceptId: "conditions_logic",
        title: "Protocollo di Quarantena Bunker",
        scenario: "Controllo di sicurezza a doppia condizione logica per l'apertura del portellone principale.",
        task: "Dichiara all'interno di <code>_ready()</code> le due variabili:<br>• <code>livello_radiazioni = 15</code><br>• <code>tessera_valida = true</code><br><br>Utilizza un'istruzione <code>if / else</code> e l'operatore logico <code>and</code>:<br>• Se <code>tessera_valida</code> è <code>true</code> AND <code>livello_radiazioni < 25</code>, stampa:<br><code>Accesso Autorizzato: Nessuna Contaminazione</code><br>• Altrimenti stampa:<br><code>Accesso Negato: Quarantena Attiva</code>",
        expectedOutput: "Accesso Autorizzato: Nessuna Contaminazione",
        starterCode: `extends Node

func _ready():
    # Dichiara le variabili e verifica le condizioni con if / else
    pass
`,
        solution: `extends Node

func _ready():
    var livello_radiazioni = 15
    var tessera_valida = true
    if tessera_valida and livello_radiazioni < 25:
        print("Accesso Autorizzato: Nessuna Contaminazione")
    else:
        print("Accesso Negato: Quarantena Attiva")
`,
        hints: [
            {
                level: 1,
                text: "Usa l'operatore logico 'and' per combinare due condizioni: 'if condizione_a and condizione_b:'."
            },
            {
                level: 2,
                text: "Poiché tessera_valida è un valore booleano, puoi scrivere direttamente 'if tessera_valida and livello_radiazioni < 25:'."
            },
            {
                level: 3,
                text: "Esempio:\nfunc _ready():\n    var livello_radiazioni = 15\n    var tessera_valida = true\n    if tessera_valida and livello_radiazioni < 25:\n        print(\"Accesso Autorizzato: Nessuna Contaminazione\")\n    else:\n        print(\"Accesso Negato: Quarantena Attiva\")"
            }
        ],
        xpReward: 10,
        validate: async (result) => {
            const tests = [];
            tests.push(formatExecutionCheck(result));
            const cleanCode = (typeof stripCommentsAndStrings === 'function') ? stripCommentsAndStrings(result.code || '') : (result.code || '');
            const hasAnd = /\band\b/.test(cleanCode) || /&&/.test(cleanCode);
            tests.push({
                desc: "Operatore logico 'and' impiegato nella condizione",
                passed: hasAnd,
                diff: hasAnd ? null : "Utilizza l'operatore logico 'and' per unire le verifiche."
            });
            const logs = result.logs || [];
            const hasAuth = logs.some(l => l.includes("Accesso Autorizzato: Nessuna Contaminazione"));
            tests.push({
                desc: "Console stampa 'Accesso Autorizzato: Nessuna Contaminazione'",
                passed: hasAuth,
                diff: hasAuth ? null : `Atteso: "Accesso Autorizzato: Nessuna Contaminazione", Ricevuto: "${logs.join(' | ')}"`
            });
            const causalAudit = /\bif[^\n:]*\btessera_valida\b[^\n:]*\band\b[^\n:]*\blivello_radiazioni\b/.test(result.code || '');
            tests.push({ desc: "Il concetto richiesto viene realmente eseguito", passed: !!causalAudit, diff: causalAudit ? null : "Esegui realmente il ciclo, la funzione, la condizione o il segnale richiesto." });
            return tests;
        }
    }
];

// =============================================================
// MOTORE STRATEGICO DI RIPASSO DIDATTICO (ReviewEngine)
// Regole trasparenti e verificabili a tre livelli:
// 'da_ripassare', 'in_miglioramento', 'consolidato'
// =============================================================
const ReviewEngine = {
    getConceptStatus(conceptId, state) {
        if (!state) return { status: 'non_iniziato', priority: 0 };
        const finished = state.finishedLessons || [];
        const telemetry = (state.learningTelemetry && state.learningTelemetry.lessons)
            ? state.learningTelemetry.lessons
            : (state.learningTelemetry || {});

        const allLessons = (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA : [];
        const conceptLessons = allLessons.filter(l => l.conceptId === conceptId);
        const completedLessons = conceptLessons.filter(l => finished.includes(l.id));

        const conceptVariants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId);
        const reviewProgress = state.reviewProgress || { completedVariants: [], variantHistory: {} };
        const completedVariantsForConcept = conceptVariants.filter(v => (reviewProgress.completedVariants || []).includes(v.id));

        // Se non ha ancora sbloccato o completato alcuna lezione del concetto
        if (completedLessons.length === 0) {
            return {
                status: 'non_iniziato',
                badgeText: 'BLOCCATO',
                badgeClass: 'badge-locked',
                reason: 'Argomento non ancora affrontato nel percorso principale',
                priority: 0,
                hasActiveFriction: false,
                metrics: { errors: 0, maxHints: 0, variantsDone: 0, totalVariants: conceptVariants.length }
            };
        }

        // Valutazione dell'attrito nel corso principale
        let totalErrorsBeforeFirstSuccess = 0;
        let maxHintsBeforeFirstSuccess = 0;
        let hasActiveFriction = false;

        conceptLessons.forEach(l => {
            const tel = telemetry[String(l.id)] || telemetry[l.id];
            if (tel) {
                const errs = tel.failed_before_first_success || 0;
                const hints = tel.hints_opened_before_first_success || 0;
                totalErrorsBeforeFirstSuccess += errs;
                if (hints > maxHintsBeforeFirstSuccess) {
                    maxHintsBeforeFirstSuccess = hints;
                }
                if (errs >= 2 || hints >= 2) {
                    hasActiveFriction = true;
                }
            }
        });

        // Analisi dettagliata delle prestazioni durante il ripasso
        let cleanAutonomousCompletions = 0;
        let assistedCompletions = 0;
        let maxVariantHintsUsed = 0;
        let maxVariantErrors = 0;

        completedVariantsForConcept.forEach(v => {
            const vHist = reviewProgress.variantHistory ? reviewProgress.variantHistory[v.id] : null;
            if (vHist) {
                const hintsUsed = Math.max(vHist.hints_used || 0, vHist.hintsUsed || 0);
                const attempts = vHist.attempts || 1;
                const successes = vHist.successes || 1;
                const failedAttempts = Math.max(0, attempts - successes);

                if (hintsUsed > maxVariantHintsUsed) maxVariantHintsUsed = hintsUsed;
                if (failedAttempts > maxVariantErrors) maxVariantErrors = failedAttempts;

                // Definizione rigorosa di superamento autonomo (P3.3.1 / P3.4):
                // 1) Se documentata una prova autonoma pulita (vHist.has_autonomous_success === true)
                // 2) Oppure, per retrocompatibilità storica: senza alcun suggerimento (hintsUsed === 0) e con al massimo un errore occasionale (failedAttempts <= 1)
                const isCleanAutonomous = (vHist.has_autonomous_success === true) || (hintsUsed === 0 && failedAttempts <= 1);
                if (isCleanAutonomous) {
                    cleanAutonomousCompletions++;
                } else {
                    assistedCompletions++;
                }
            } else {
                // In assenza di telemetria specifica sulla variante, trattalo prudentemente come assistito
                assistedCompletions++;
            }
        });

        const remainingVariants = Math.max(0, conceptVariants.length - completedVariantsForConcept.length);

        // LIVELLO 1: CONSOLIDATO
        // Richiede ALMENO UNA dimostrazione sufficientemente autonoma (0 suggerimenti, max 1 errore occasionale).
        // Completare 2 o più varianti con assistenza NON garantisce automaticamente lo stato Consolidato.
        if (cleanAutonomousCompletions >= 1) {
            const reasonText = cleanAutonomousCompletions > 1
                ? `Argomento consolidato: ${cleanAutonomousCompletions} varianti di ripasso superate in piena autonomia (senza aiuti e al massimo 1 errore occasionale)`
                : 'Argomento consolidato: variante superata in piena autonomia (senza suggerimenti e al massimo un errore occasionale)';
            return {
                status: 'consolidato',
                badgeText: 'CONSOLIDATO',
                badgeClass: 'badge-consolidated',
                reason: reasonText,
                priority: 1,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: completedVariantsForConcept.length,
                    totalVariants: conceptVariants.length,
                    cleanVariants: cleanAutonomousCompletions,
                    assistedVariants: assistedCompletions,
                    remainingVariants: remainingVariants
                }
            };
        }

        // LIVELLO 2: IN MIGLIORAMENTO
        // Se ha completato una o più varianti MA tutte con assistenza/errori (cleanAutonomousCompletions === 0):
        if (completedVariantsForConcept.length > 0) {
            const detailText = maxVariantErrors >= 2
                ? `${maxVariantErrors} tentativi errati prima del successo`
                : (maxVariantHintsUsed > 0 ? `${maxVariantHintsUsed} livelli di suggerimento consultati` : 'con assistenza');

            let reasonText = '';
            if (remainingVariants === 0) {
                // Tutte le varianti disponibili per l'argomento sono state completate con supporto
                reasonText = `In miglioramento: hai completato con supporto tutte le ${completedVariantsForConcept.length} prove disponibili per questo argomento (${detailText}). Al momento non ci sono ulteriori varianti; puoi ripeterle in piena autonomia per consolidare.`;
            } else {
                reasonText = `In miglioramento: ${completedVariantsForConcept.length} prova/e superata/e con supporto (${detailText}). Restano altre prove disponibili per consolidare in piena autonomia.`;
            }

            return {
                status: 'in_miglioramento',
                badgeText: 'IN MIGLIORAMENTO',
                badgeClass: 'badge-improving',
                reason: reasonText,
                priority: 6,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: completedVariantsForConcept.length,
                    totalVariants: conceptVariants.length,
                    cleanVariants: cleanAutonomousCompletions,
                    assistedVariants: assistedCompletions,
                    remainingVariants: remainingVariants
                }
            };
        }
        // LIVELLO 3: DA RIPASSARE
        // Se ha incontrato attrito significativo nel corso (>= 2 errori o >= 2 hint) e non ha ancora completato varianti
        if (hasActiveFriction) {
            const primaryReason = totalErrorsBeforeFirstSuccess >= 2
                ? `Consigliato: riscontrati ${totalErrorsBeforeFirstSuccess} tentativi falliti prima del successo nel corso`
                : `Consigliato: utilizzati ${maxHintsBeforeFirstSuccess} livelli di suggerimento nella lezione`;

            return {
                status: 'da_ripassare',
                badgeText: 'DA RIPASSARE',
                badgeClass: 'badge-recommended',
                reason: primaryReason,
                priority: 10 + totalErrorsBeforeFirstSuccess + (maxHintsBeforeFirstSuccess * 2),
                hasActiveFriction: true,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: 0,
                    totalVariants: conceptVariants.length,
                    cleanVariants: 0,
                    assistedVariants: 0,
                    remainingVariants: conceptVariants.length
                }
            };
        }

        // Se tutte le lezioni sono state completate nel corso senza frizione (<= 1 errore, <= 1 hint): CONSOLIDATO
        if (completedLessons.length === conceptLessons.length && conceptLessons.length > 0) {
            return {
                status: 'consolidato',
                badgeText: 'CONSOLIDATO',
                badgeClass: 'badge-consolidated',
                reason: 'Superato con facilità: nessun attrito significativo riscontrato nel corso',
                priority: 2,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: 0,
                    totalVariants: conceptVariants.length,
                    cleanVariants: 0,
                    assistedVariants: 0,
                    remainingVariants: conceptVariants.length
                }
            };
        }

        // Disponibile facoltativamente
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
                totalVariants: conceptVariants.length,
                cleanVariants: 0,
                assistedVariants: 0
            }
        };
    },

    getRecommendedConcepts(state) {
        if (!state) return [];
        const result = [];
        const catalog = (typeof CONCEPTS_CATALOG !== 'undefined') ? CONCEPTS_CATALOG : {};

        for (const [conceptId, conceptMeta] of Object.entries(catalog)) {
            const statusInfo = this.getConceptStatus(conceptId, state);
            if (statusInfo.status === 'da_ripassare' || statusInfo.status === 'in_miglioramento') {
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

    recordVariantHintOpened(variantId, hintLevel, state) {
        if (!state || !variantId) return;
        if (!state.reviewProgress) {
            state.reviewProgress = { completedVariants: [], variantHistory: {} };
        }
        if (!state.reviewProgress.variantHistory) {
            state.reviewProgress.variantHistory = {};
        }
        const vHist = state.reviewProgress.variantHistory[variantId] || {
            attempts: 0,
            successes: 0,
            hints_used: 0,
            hintsUsed: 0,
            attempts_since_last_success: 0,
            has_autonomous_success: false,
            clean_autonomous_runs: 0,
            first_attempt_at: null,
            last_attempt_at: null,
            first_success_at: null
        };
        const maxH = Math.max(vHist.hints_used || 0, vHist.hintsUsed || 0, hintLevel || 0);
        vHist.hints_used = maxH;
        vHist.hintsUsed = maxH;
        state.reviewProgress.variantHistory[variantId] = vHist;
    },

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

        const now = new Date();
        const nowIso = now.toISOString();
        const vHist = state.reviewProgress.variantHistory[variantId] || {
            attempts: 0,
            successes: 0,
            hints_used: 0,
            hintsUsed: 0,
            attempts_since_last_success: 0,
            has_autonomous_success: false,
            clean_autonomous_runs: 0,
            first_attempt_at: null,
            last_attempt_at: null,
            first_success_at: null
        };

        vHist.attempts++;
        if (!vHist.first_attempt_at) vHist.first_attempt_at = nowIso;
        vHist.last_attempt_at = nowIso;

        const currentRunHints = hintsRevealed || 0;
        const maxH = Math.max(vHist.hints_used || 0, vHist.hintsUsed || 0, currentRunHints);
        vHist.hints_used = maxH;
        vHist.hintsUsed = maxH;

        const isFirstSuccess = isSuccess && !vHist.first_success_at;

        if (!isSuccess) {
            // Tentativo fallito nella sessione corrente
            vHist.attempts_since_last_success = (vHist.attempts_since_last_success || 0) + 1;
        } else {
            // Successo conseguito!
            vHist.successes++;
            if (!vHist.first_success_at) vHist.first_success_at = nowIso;
            if (!state.reviewProgress.completedVariants.includes(variantId)) {
                state.reviewProgress.completedVariants.push(variantId);
            }

            const sessionFailures = vHist.attempts_since_last_success || 0;
            // Valutazione della sessione: autonoma se 0 hint aperti in questa sessione e al max 1 errore prima del successo
            const isAutonomousRun = (currentRunHints === 0 && sessionFailures <= 1);
            if (isAutonomousRun) {
                vHist.has_autonomous_success = true;
                vHist.clean_autonomous_runs = (vHist.clean_autonomous_runs || 0) + 1;
            }

            vHist.last_run = {
                success: true,
                hints_used: currentRunHints,
                failed_attempts: sessionFailures,
                is_autonomous: isAutonomousRun,
                completed_at: nowIso
            };

            // Reset del conteggio errori per la sessione successiva
            vHist.attempts_since_last_success = 0;
        }

        state.reviewProgress.variantHistory[variantId] = vHist;

        // Registrazione nel contatore giornaliero aggregato (P3.4) - PROPRIETÀ ESCLUSIVA
        if (state && state.learningTelemetry) {
            if (!state.learningTelemetry.daily_activity) state.learningTelemetry.daily_activity = {};
            const todayKey = (typeof StatsEngine !== 'undefined' && StatsEngine.formatLocalDateKey)
                ? StatsEngine.formatLocalDateKey(now)
                : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            if (!state.learningTelemetry.daily_activity[todayKey]) {
                state.learningTelemetry.daily_activity[todayKey] = {
                    verifications: 0,
                    lessons_completed: 0,
                    autonomous_completed: 0,
                    assisted_completed: 0,
                    reviews_completed: 0
                };
            }
            state.learningTelemetry.daily_activity[todayKey].verifications++;
            if (isFirstSuccess) {
                state.learningTelemetry.daily_activity[todayKey].reviews_completed++;
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.REVIEW_VARIANTS = REVIEW_VARIANTS;
    window.ReviewEngine = ReviewEngine;
}
