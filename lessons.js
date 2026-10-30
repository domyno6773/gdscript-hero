// ===========================================================================
// DATASET UFFICIALE DELLE LEZIONI PER GDSCRIPT HERO (PARTE 1: FONDAMENTI)
// 17 Capitoli, 92 Lezioni Didattiche Progressive, 100% Originali e Game-Dev
// Basato sulla versione finale di GDScript 4.4.1 e certificato Godot Engine
// ===========================================================================

const CHAPTERS_DATA = [
    {
        "id": 1,
        "title": "Capitolo 1: Introduzione a GDScript 4",
        "badge": "CAPITOLO 1",
        "desc": "Primi passi con Godot Engine 4: la funzione _ready(), commenti e output con print().",
        "icon": "🚀"
    },
    {
        "id": 2,
        "title": "Capitolo 2: Variabili (Parte 1)",
        "badge": "CAPITOLO 2",
        "desc": "Creazione di variabili con var, tipi di dato primitivi int, float, string, bool e valore null.",
        "icon": "📦"
    },
    {
        "id": 3,
        "title": "Capitolo 3: Variabili (Parte 2 & Tipizzazione)",
        "badge": "CAPITOLO 3",
        "desc": "Tipizzazione statica di Godot 4, inferenza del tipo :=, costanti const e type casting.",
        "icon": "🏷️"
    },
    {
        "id": 4,
        "title": "Capitolo 4: Operatori Aritmetici",
        "badge": "CAPITOLO 4",
        "desc": "Aritmetica (+, -, *, /, %), divisione intera, operatore modulo e operatori composti.",
        "icon": "➗"
    },
    {
        "id": 5,
        "title": "Capitolo 5: Operatori Logici e Condizioni",
        "badge": "CAPITOLO 5",
        "desc": "Operatori di confronto, condizioni logiche (and, or, not) e operatore ternario compatto.",
        "icon": "⚖️"
    },
    {
        "id": 6,
        "title": "Capitolo 6: Strutture Decisionali",
        "badge": "CAPITOLO 6",
        "desc": "Strutture condizionali if, elif, else, annidamento e match statement (switch pattern matching).",
        "icon": "🔀"
    },
    {
        "id": 7,
        "title": "Capitolo 7: Input e Output di Base",
        "badge": "CAPITOLO 7",
        "desc": "Stampa avanzata, output con variabili, formattazione stringhe ed elaborazione dati.",
        "icon": "💻"
    },
    {
        "id": 8,
        "title": "Capitolo 8: Calcolatore del Conto",
        "badge": "CAPITOLO 8",
        "desc": "Progetto pratico: calcolo divisione equa del bottino, mance, avanzi e formattazione ricevuta.",
        "icon": "🧾"
    },
    {
        "id": 9,
        "title": "Capitolo 9: Cicli e Iterazione",
        "badge": "CAPITOLO 9",
        "desc": "Cicli for con range, cicli while, controllo del flusso con break e continue.",
        "icon": "🔄"
    },
    {
        "id": 10,
        "title": "Capitolo 10: Funzioni e Parametri",
        "badge": "CAPITOLO 10",
        "desc": "Dichiarazione di funzioni personalizzate func, argomenti, valori di default e return.",
        "icon": "⚙️"
    },
    {
        "id": 11,
        "title": "Capitolo 11: FizzBuzz con Variante",
        "badge": "CAPITOLO 11",
        "desc": "Progetto algoritmico: FizzBuzz classico e variante estesa per meccaniche di gioco.",
        "icon": "🎯"
    },
    {
        "id": 12,
        "title": "Capitolo 12: Nozioni di Base sugli Array",
        "badge": "CAPITOLO 12",
        "desc": "Array e liste ordinate: creazione, indici, metodi append/size e array tipizzati.",
        "icon": "📚"
    },
    {
        "id": 13,
        "title": "Capitolo 13: Iterazione su Array e Stringhe",
        "badge": "CAPITOLO 13",
        "desc": "Scansione di collezioni: iterazione con for, indici, calcolo totale, media e inversione.",
        "icon": "🔁"
    },
    {
        "id": 14,
        "title": "Capitolo 14: Array Approfonditi e Slicing",
        "badge": "CAPITOLO 14",
        "desc": "Manipolazione avanzata di array: slicing [da:a], concatenazione, membership in/not in.",
        "icon": "✂️"
    },
    {
        "id": 15,
        "title": "Capitolo 15: Dizionari (Dictionary)",
        "badge": "CAPITOLO 15",
        "desc": "Dizionari (Dictionary): coppie chiave-valore, accesso, modifica, iterazione e metodi.",
        "icon": "📖"
    },
    {
        "id": 16,
        "title": "Capitolo 16: Registro Spese Giornaliere",
        "badge": "CAPITOLO 16",
        "desc": "Grande progetto pratico: gestione completa di un registro scorte e bilancio quotidiano.",
        "icon": "📊"
    },
    {
        "id": 17,
        "title": "Capitolo 17: Le Sfide Finali",
        "badge": "CAPITOLO 17",
        "desc": "Sfide conclusive di padronanza del percorso Fondamenti per mettere alla prova le tue abilità.",
        "icon": "🏆"
    }
];

const CONCEPTS_CATALOG = {
    "syntax_basics": {
        "id": "syntax_basics",
        "name": "Sintassi Base e Output di Gioco",
        "chapterId": 1,
        "desc": "Istruzioni print(), funzione _ready(), commenti e output testuale."
    },
    "variables_basics": {
        "id": "variables_basics",
        "name": "Variabili Fondamentali e Tipi Primitivi",
        "chapterId": 2,
        "desc": "Dichiarazione var, tipi int, float, string, bool e valore speciale null."
    },
    "type_system": {
        "id": "type_system",
        "name": "Tipizzazione Statica e Costanti",
        "chapterId": 3,
        "desc": "Tipizzazione esplicita : Type, inferenza :=, costanti const e type casting."
    },
    "operators_math": {
        "id": "operators_math",
        "name": "Operatori Aritmetici ed Espressioni",
        "chapterId": 4,
        "desc": "Operazioni aritmetiche (+, -, *, /, %), divisione intera e operatori composti."
    },
    "conditions_logic": {
        "id": "conditions_logic",
        "name": "Operatori Logici e Operatore Ternario",
        "chapterId": 5,
        "desc": "Operatori di confronto, operatori logici (and, or, not) e operatore ternario."
    },
    "control_flow": {
        "id": "control_flow",
        "name": "Strutture Decisionali",
        "chapterId": 6,
        "desc": "Controllo del flusso condizionale con if, elif, else e match statement."
    },
    "io_formatting": {
        "id": "io_formatting",
        "name": "Input, Output e Formattazione Stringhe",
        "chapterId": 7,
        "desc": "Stampa variabili multiple, formattazione stringhe (%s, %d) e conversione input."
    },
    "project_bill": {
        "id": "project_bill",
        "name": "Progetto: Ripartizione Bottino Party",
        "chapterId": 8,
        "desc": "Algoritmo completo di calcolo quote e resto del bottino tra avventurieri."
    },
    "loops_iteration": {
        "id": "loops_iteration",
        "name": "Cicli e Iterazione",
        "chapterId": 9,
        "desc": "Iterazione for con range(), cicli while, contatori, break e continue."
    },
    "functions_scope": {
        "id": "functions_scope",
        "name": "Funzioni e Parametri",
        "chapterId": 10,
        "desc": "Dichiarazione di funzioni personalizzate func, parametri, default values e return."
    },
    "project_fizzbuzz": {
        "id": "project_fizzbuzz",
        "name": "Progetto: FizzBuzz e Varianti",
        "chapterId": 11,
        "desc": "Implementazione e variazione dell'algoritmo classico per logiche di combattimento."
    },
    "arrays_basics": {
        "id": "arrays_basics",
        "name": "Array e Collezioni Ordinate",
        "chapterId": 12,
        "desc": "Creazione [], indicizzazione base zero, indici negativi e metodi append/size."
    },
    "collection_iteration": {
        "id": "collection_iteration",
        "name": "Iterazione su Collezioni e Stringhe",
        "chapterId": 13,
        "desc": "Scansione collezioni con for, iterazione per indice, somme cumulative e scansione caratteri."
    },
    "arrays_advanced": {
        "id": "arrays_advanced",
        "name": "Array Avanzati e Slicing",
        "chapterId": 14,
        "desc": "Slicing [a:b], concatenazione di liste con +, operatore in e ordinamento sort()."
    },
    "dictionaries": {
        "id": "dictionaries",
        "name": "Dizionari (Dictionary)",
        "chapterId": 15,
        "desc": "Coppie chiave-valore {}, accesso per chiave, modifica, iterazione e metodi keys/values/has."
    },
    "project_expenses": {
        "id": "project_expenses",
        "name": "Progetto: Registro Risorse Accampamento",
        "chapterId": 16,
        "desc": "Sistema interattivo per monitorare scorte, consumi medi, totali e azzeramento dati."
    },
    "challenges": {
        "id": "challenges",
        "name": "Sfide di Padronanza Finale",
        "chapterId": 17,
        "desc": "Sfide avanzate di programmazione algoritmica per testare ogni abilità acquisita."
    }
};

// ==========================================
// FUNZIONI DI SUPPORTO E VALIDAZIONE
// ==========================================
function getLessonConcept(lessonId) {
    const lesson = (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA.find(l => l.id === lessonId) : null;
    if (lesson && lesson.conceptId && CONCEPTS_CATALOG[lesson.conceptId]) {
        return CONCEPTS_CATALOG[lesson.conceptId];
    }
    const chapterId = lesson ? lesson.chapterId : 1;
    const found = Object.values(CONCEPTS_CATALOG).find(c => c.chapterId === chapterId);
    return found || { id: "general", name: "Generale", chapterId: chapterId || 1, desc: "Concetti generali GDScript" };
}

function formatExecutionCheck(result) {
    if (result && result.success) {
        return { desc: "Codice eseguito senza errori nel motore", passed: true, diff: null };
    }
    const err = (result && result.error) ? String(result.error) : "Errore sconosciuto";
    const isSyntax = err.includes("Errore di sintassi") ||
                     err.includes("SyntaxError") ||
                     err.includes("Unexpected token") ||
                     err.includes("Invalid or unexpected token") ||
                     err.includes("Unexpected identifier") ||
                     err.includes("missing ) after argument list");
    if (isSyntax) {
        return {
            desc: "Controllo sintassi GDScript",
            passed: false,
            diff: `⚠️ Errore di Sintassi: verifica due punti (:), indentazione o virgolette non chiuse.\nDettaglio: ${err}`
        };
    }
    return {
        desc: "Esecuzione dello script",
        passed: false,
        diff: `⚠️ Errore di Esecuzione:\nDettaglio: ${err}`
    };
}

function stripCommentsAndStrings(code) {
    if (!code) return "";
    return code
        .replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, '""')
        .replace(/"(?:\\.|[^"\\])*"/g, '""')
        .replace(/'(?:\\.|[^'\\])*'/g, "''")
        .replace(/#.*$/gm, '');
}

function hasRealComment(code) {
    if (!code) return false;
    const noStrings = code
        .replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, '""')
        .replace(/"(?:\\.|[^"\\])*"/g, '""')
        .replace(/'(?:\\.|[^'\\])*'/g, "''");
    return /#\s*\S+/.test(noStrings);
}

// ==========================================
// DATASET COMPLETO DELLE 92 LEZIONI ORIGINALI
// ==========================================
const LESSONS_DATA = [
    {
        id: 1,
        conceptId: "syntax_basics",
        conceptTags: ["syntax_basics", "ch1", "print", "functions"],
        chapterId: 1,
        isMastery: false,
        title: "1. Inizializzazione del Nodo e Output di Gioco",
        icon: "\ud83c\udf31",
        xp: 50,
        expectedOutput: "=== Inizializzazione Godot Hero: Sistema Pronto ===",
        theory: "\n<p>Benvenuto nel mondo di <strong>GDScript</strong>, il linguaggio nativo e ad altissime prestazioni integrato in <strong>Godot Engine 4</strong>! GDScript è stato progettato da zero specificamente per creare videogiochi: la sua sintassi è pulita e leggibile (simile a Python), ma è strettamente collegata all'architettura interna in C++ di Godot.</p>\n<p>In Godot, ogni elemento di una scena è un <strong>Nodo</strong> (<code>Node</code>). Quando associamo uno script a un nodo, indichiamo quale tipo di oggetto stiamo programmando attraverso la direttiva iniziale:</p>\n<pre><code class=\"language-gdscript\">extends Node</code></pre>\n<p>Il motore esegue automaticamente alcune funzioni speciali durante il ciclo di vita del nodo. La più importante per iniziare è <code>_ready()</code>, che viene chiamata una sola volta quando il nodo e tutti i suoi nodi figli entrano attivamente nell'albero della scena (SceneTree).</p>\n<p>Per inviare messaggi alla console di output di Godot utilizziamo la funzione globale <code>print()</code>, passando il testo desiderato racchiuso tra doppi apici <code>\"...\"</code>:</p>\n<pre><code class=\"language-gdscript\">func _ready():\n    print(\"Inizializzazione completata!\")</code></pre>\n<p>Ogni riga all'interno della funzione deve essere <strong>indentata</strong> (utilizzando un tasto Tab o 4 spazi) per indicare a Godot che fa parte del blocco di codice di quella funzione.</p>\n",
        task: "\n<p>Configura il primo script di avvio del tuo progetto Godot.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>All'interno della funzione <code>_ready()</code>, utilizza la funzione <code>print()</code>.</li>\n    <li>Stampa sulla console esattamente la seguente stringa di sistema: <code>=== Inizializzazione Godot Hero: Sistema Pronto ===</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa il messaggio di attivazione del sistema\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa il messaggio di attivazione del sistema\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"=== Inizializzazione Godot Hero: Sistema Pronto ===\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa la funzione print() passandole come argomento la stringa richiesta."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Assicurati di racchiudere il testo esattamente tra doppi apici: \"=== Inizializzazione Godot Hero: Sistema Pronto ===\"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Sostituisci l'istruzione 'pass' con la chiamata a print."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "=== Inizializzazione Godot Hero: Sistema Pronto ===";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 2,
        conceptId: "syntax_basics",
        conceptTags: ["syntax_basics", "ch1", "print", "functions"],
        chapterId: 1,
        isMastery: false,
        title: "2. Il Dialogo dell'Eroe (Stampe Consecutive)",
        icon: "\ud83d\udcac",
        xp: 50,
        expectedOutput: "Eroe: Cerco la Spada di Luce!\nGuardiano: Solo chi conosce GDScript può passare.",
        theory: "\n<p>Nei giochi narrativi e nei giochi di ruolo (RPG), la visualizzazione sequenziale di messaggi e dialoghi è il primo passo per costruire l'atmosfera. Ogni chiamata a <code>print()</code> emette automaticamente il proprio contenuto sulla console e aggiunge un carattere di fine riga (a capo).</p>\n<p>Se eseguiamo più istruzioni <code>print()</code> una dopo l'altra:</p>\n<pre><code class=\"language-gdscript\">func _ready():\n    print(\"Messaggio 1\")\n    print(\"Messaggio 2\")</code></pre>\n<p>La console mostrerà ciascuna frase su una riga separata, rispettando rigorosamente l'ordine dall'alto verso il basso in cui sono state scritte.</p>\n",
        task: "\n<p>L'eroe del nostro gioco incontra il guardiano del santuario antico. Crea il primo scambio di battute di dialogo.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Nella funzione <code>_ready()</code>, scrivi due chiamate separate a <code>print()</code>.</li>\n    <li>La prima riga deve stampare: <code>Eroe: Cerco la Spada di Luce!</code></li>\n    <li>La seconda riga deve stampare: <code>Guardiano: Solo chi conosce GDScript può passare.</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Scrivi le due righe di dialogo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Scrivi le due righe di dialogo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"Eroe: Cerco la Spada di Luce!\")\n\tprint(\"Guardiano: Solo chi conosce GDScript può passare.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Scrivi due istruzioni print() consecutive, una sotto l'altra."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Controlla attentamente la punteggiatura e le maiuscole delle due frasi."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Mantieni l'indentazione corretta con Tab all'interno di _ready()."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Eroe: Cerco la Spada di Luce!\nGuardiano: Solo chi conosce GDScript può passare.";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 3,
        conceptId: "syntax_basics",
        conceptTags: ["syntax_basics", "ch1", "print", "functions"],
        chapterId: 1,
        isMastery: false,
        title: "3. Documentare la Fisica di Gioco con i Commenti",
        icon: "\ud83d\udcdd",
        xp: 50,
        expectedOutput: "Forza catapulta impostata: 750 N",
        theory: "\n<p>Lo sviluppo di un videogioco richiede spesso formule matematiche, impostazioni di bilanciamento e logiche complesse. Per spiegare il funzionamento del codice a noi stessi in futuro o ai membri del team, usiamo i <strong>commenti</strong>.</p>\n<p>In GDScript qualsiasi testo preceduto dal simbolo cancelletto <code>#</code> viene ignorato dal compilatore di Godot fino alla fine della riga:</p>\n<pre><code class=\"language-gdscript\"># Questo è un commento esplicativo: non viene eseguito!\nvar velocita = 300 # Pixel al secondo</code></pre>\n<p>I commenti sono fondamentali per mantenere il codice pulito, spiegare perché è stato scelto un certo valore e disabilitare temporaneamente righe di codice durante il debug.</p>\n",
        task: "\n<p>Documenta le costanti di lancio di una catapulta e stampa il parametro configurato.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Aggiungi un commento sulla prima riga di <code>_ready()</code>: <code># Configurazione forza d'impatto</code></li>\n    <li>Subito sotto, stampa sulla console: <code>Forza catapulta impostata: 750 N</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Inserisci il commento richiesto e la stampa di configurazione\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Inserisci il commento richiesto e la stampa di configurazione\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\t# Configurazione forza d'impatto\n\tprint(\"Forza catapulta impostata: 750 N\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "I commenti iniziano con il simbolo #."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Godot ignorerà la riga di commento ed eseguirà solo la riga con print()."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il testo da stampare è esattamente: Forza catapulta impostata: 750 N"
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const hasComment = hasRealComment(result.code);
        tests.push({
            desc: "Include almeno un commento (#)",
            passed: hasComment,
            diff: hasComment ? null : "Aggiungi una riga di commento esplicativo che inizia con #"
        });
        const expected = "Forza catapulta impostata: 750 N";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 4,
        conceptId: "syntax_basics",
        conceptTags: ["syntax_basics", "ch1", "print", "functions"],
        chapterId: 1,
        isMastery: true,
        title: "4. La Sequenza di Caricamento del Livello",
        icon: "\u23f3",
        xp: 75,
        expectedOutput: "[1/3] Generazione terreno procedurale...\n[2/3] Caricamento sprite nemici...\n[3/3] Livello pronto! Avvio partita.",
        theory: "\n<p>Comprendere la struttura di base di un file <code>.gd</code> è la chiave per padroneggiare Godot. Uno script tipico è composto da tre zone principali ordinate verticalmente:</p>\n<ol>\n    <li><strong>Dichiarazione di ereditarietà:</strong> <code>extends TipoNodo</code> (es. <code>Node</code>, <code>Sprite2D</code>, <code>CharacterBody2D</code>).</li>\n    <li><strong>Variabili e costanti di classe:</strong> I dati persistenti del nodo (punti vita, stato, velocità).</li>\n    <li><strong>Funzioni:</strong> I blocchi logici eseguiti in risposta a eventi (<code>_ready()</code>, <code>_process(delta)</code>, funzioni personalizzate).</li>\n</ol>\n<p>Le istruzioni vengono eseguite in ordine sequenziale, riga per riga, dall'alto verso il basso.</p>\n",
        task: "\n<p>Simula la sequenza di avvio e caricamento di una mappa di gioco.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>All'interno di <code>_ready()</code>, stampa in sequenza tre messaggi di log distinti:</li>\n    <li>Riga 1: <code>[1/3] Generazione terreno procedurale...</code></li>\n    <li>Riga 2: <code>[2/3] Caricamento sprite nemici...</code></li>\n    <li>Riga 3: <code>[3/3] Livello pronto! Avvio partita.</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa la sequenza ordinata di caricamento\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa la sequenza ordinata di caricamento\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"[1/3] Generazione terreno procedurale...\")\n\tprint(\"[2/3] Caricamento sprite nemici...\")\n\tprint(\"[3/3] Livello pronto! Avvio partita.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa tre chiamate consecutive a print()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Presta attenzione ai caratteri tra parentesi quadre: [1/3], [2/3] e [3/3]."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Verifica che i puntini di sospensione e il punto esclamativo corrispondano al testo richiesto."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[1/3] Generazione terreno procedurale...\n[2/3] Caricamento sprite nemici...\n[3/3] Livello pronto! Avvio partita.";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 5,
        conceptId: "variables_basics",
        conceptTags: ["variables_basics", "ch2", "print", "var", "functions"],
        chapterId: 2,
        isMastery: false,
        title: "5. Statistiche Numeriche: Punti Vita e Velocità",
        icon: "\u2764\ufe0f",
        xp: 50,
        expectedOutput: "150\n6.5",
        theory: "\n<p>Nei giochi, i numeri controllano ogni cosa: punti ferita, velocità di corsa, munizioni, esperienza e coordinate spaziali. In GDScript i numeri si dividono principalmente in:</p>\n<ul>\n    <li><strong>Interi (int):</strong> Numeri senza virgola, sia positivi che negativi (es. <code>100</code>, <code>-5</code>, <code>0</code>). Ideali per contatori, vite e monete.</li>\n    <li><strong>Numeri a virgola mobile (float):</strong> Numeri con parte decimale, separata dal punto (es. <code>3.5</code>, <code>0.016</code>). Indispensabili per coordinate, velocità e percentuali.</li>\n</ul>\n<p>Per creare una variabile usiamo la parola chiave <code>var</code> seguita dal nome e dall'operatore di assegnazione <code>=</code>:</p>\n<pre><code class=\"language-gdscript\">var punti_vita = 100\nvar velocita = 4.5</code></pre>\n<p>Possiamo stampare variabili direttamente con <code>print(variabile)</code> o combinare più elementi separandoli da virgole: <code>print(\"HP:\", punti_vita)</code>.</p>\n",
        task: "\n<p>Dichiara le statistiche di base di un guerriero.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea una variabile <code>hp_massimi</code> assegnandole il valore intero <code>150</code>.</li>\n    <li>Crea una variabile <code>velocita_corsa</code> con il valore float <code>6.5</code>.</li>\n    <li>Stampa <code>hp_massimi</code> su una riga e <code>velocita_corsa</code> sulla riga successiva.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le due variabili numeriche e stampale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le due variabili numeriche e stampale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar hp_massimi = 150\n\tvar velocita_corsa = 6.5\n\tprint(hp_massimi)\n\tprint(velocita_corsa)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dichiara le variabili usando 'var nome = valore'."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non racchiudere i numeri tra virgolette, altrimenti verrebbero interpretati come testo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa prima hp_massimi con print(hp_massimi) e poi velocita_corsa."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "150\n6.5";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 6,
        conceptId: "variables_basics",
        conceptTags: ["variables_basics", "ch2", "print", "var", "functions"],
        chapterId: 2,
        isMastery: false,
        title: "6. Stringhe: Il Nome dell'Artefatto Leggendario",
        icon: "\ud83d\udcdc",
        xp: 50,
        expectedOutput: "Elisir di Mana (+50 MP)",
        theory: "\n<p>I dati testuali in informatica sono chiamati <strong>stringhe</strong> (<code>String</code>). Rappresentano nomi di personaggi, descrizioni di oggetti, dialoghi e percorsi di risorse (come <code>\"res://assets/hero.png\"</code>).</p>\n<p>Una stringa è racchiusa tra doppi apici <code>\"...\"</code> o apici singoli <code>'...'</code>:</p>\n<pre><code class=\"language-gdscript\">var arma = \"Lama del Crepuscolo\"\nvar rarita = \"Leggendaria\"</code></pre>\n<p>È possibile concatenare (unire) due o più stringhe utilizzando l'operatore <code>+</code>:</p>\n<pre><code class=\"language-gdscript\">var titolo_completo = arma + \" [\" + rarita + \"]\"\nprint(titolo_completo) # Output: Lama del Crepuscolo [Leggendaria]</code></pre>\n",
        task: "\n<p>Crea la scheda identificativa di una pozione alchemica unendo due stringhe.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea una variabile <code>nome_pozione</code> con valore <code>\"Elisir di Mana\"</code>.</li>\n    <li>Crea una variabile <code>effetto</code> con valore <code>\" (+50 MP)\"</code> (nota lo spazio iniziale).</li>\n    <li>Crea una variabile <code>descrizione_completa</code> che concatena <code>nome_pozione + effetto</code>.</li>\n    <li>Stampa <code>descrizione_completa</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le stringhe, uniscile e stampa il risultato\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le stringhe, uniscile e stampa il risultato\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar nome_pozione = \"Elisir di Mana\"\n\tvar effetto = \" (+50 MP)\"\n\tvar descrizione_completa = nome_pozione + effetto\n\tprint(descrizione_completa)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa l'operatore + per unire due variabili di tipo String."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Attenzione allo spazio iniziale nella stringa effetto: ' (+50 MP)'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile risultante con print(descrizione_completa)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Elisir di Mana (+50 MP)";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 7,
        conceptId: "variables_basics",
        conceptTags: ["variables_basics", "ch2", "print", "var", "functions"],
        chapterId: 2,
        isMastery: false,
        title: "7. Valori Booleani: Bandiere di Stato del Giocatore",
        icon: "\ud83d\udea9",
        xp: 50,
        expectedOutput: "false\ntrue",
        theory: "\n<p>Il tipo di dato <strong>booleano</strong> (<code>bool</code>) può avere solo uno tra due possibili valori: <code>true</code> (vero) oppure <code>false</code> (falso). In logica di gioco, i booleani sono noti come <em>flag</em> (bandiere).</p>\n<p>Servono a rispondere a domande binarie sullo stato del gioco:</p>\n<ul>\n    <li>Il giocatore è a terra o sta saltando? <code>var is_on_floor = true</code></li>\n    <li>La porta del dungeon è sbloccata? <code>var is_door_unlocked = false</code></li>\n    <li>L'eroe è invulnerabile dopo un colpo? <code>var is_invulnerable = false</code></li>\n</ul>\n<p>L'operatore logico <code>not</code> inverte il valore di un booleano (<code>not true</code> diventa <code>false</code>).</p>\n",
        task: "\n<p>Traccia lo stato di apertura di un baule del tesoro e l'attivazione di una trappola.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea una variabile booleana <code>baule_aperto</code> con valore <code>false</code>.</li>\n    <li>Crea una variabile booleana <code>trappola_attiva</code> con valore <code>true</code>.</li>\n    <li>Stampa <code>baule_aperto</code> sulla prima riga e <code>trappola_attiva</code> sulla seconda riga.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Definisci i due flag booleani e stampali\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Definisci i due flag booleani e stampali\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar baule_aperto = false\n\tvar trappola_attiva = true\n\tprint(baule_aperto)\n\tprint(trappola_attiva)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Scrivi true e false sempre in minuscolo."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non mettere virgolette attorno a true o false, altrimenti diventerebbero stringhe di testo anziché booleani."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa ciascun valore con una print() separata."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "false\ntrue";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 8,
        conceptId: "variables_basics",
        conceptTags: ["variables_basics", "ch2", "print", "var", "functions"],
        chapterId: 2,
        isMastery: false,
        title: "8. Variabili Vuote e il Valore Speciale null",
        icon: "\ud83d\udd18",
        xp: 50,
        expectedOutput: "<null>\nElmo di Ferro Antico",
        theory: "\n<p>In molti casi nello sviluppo di giochi abbiamo bisogno di riservare uno spazio per un dato che ancora non esiste al momento dell'avvio. Ad esempio, uno slot per l'arma equipaggiata inizia vuoto, oppure un bersaglio agganciato (<code>target</code>) non è ancora stato selezionato.</p>\n<p>Se dichiariamo una variabile senza assegnarle un valore iniziale:</p>\n<pre><code class=\"language-gdscript\">var bersaglio_selezionato</code></pre>\n<p>GDScript le assegna automaticamente il valore speciale <code>null</code>. <code>null</code> rappresenta l'assenza totale di un valore o di un oggetto in memoria.</p>\n<p>Successivamente nel gioco possiamo assegnarle un valore concreto: <code>bersaglio_selezionato = \"Orco Guardiano\"</code>.</p>\n",
        task: "\n<p>Gestisci lo slot dell'elmo del cavaliere prima e dopo aver visitato l'armeria.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara una variabile <code>elmo_equipaggiato</code> senza assegnarle alcun valore iniziale.</li>\n    <li>Stampa il suo valore iniziale (apparirà <code><null></code> nella console).</li>\n    <li>Assegna alla variabile la stringa <code>\"Elmo di Ferro Antico\"</code>.</li>\n    <li>Stampa nuovamente <code>elmo_equipaggiato</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara la variabile vuota, stampala, assegna il valore e ristampa\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara la variabile vuota, stampala, assegna il valore e ristampa\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar elmo_equipaggiato\n\tprint(elmo_equipaggiato)\n\telmo_equipaggiato = \"Elmo di Ferro Antico\"\n\tprint(elmo_equipaggiato)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Una variabile vuota si dichiara semplicemente con: var elmo_equipaggiato"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Quando stampi una variabile con valore null in Godot, la console visualizza <null>."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Per assegnare un valore in un secondo momento, non usare di nuovo var, ma scrivi: elmo_equipaggiato = \"...\""
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "<null>\nElmo di Ferro Antico";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 9,
        conceptId: "variables_basics",
        conceptTags: ["variables_basics", "ch2", "print", "var", "functions"],
        chapterId: 2,
        isMastery: true,
        title: "9. Convenzioni di Stile Ufficiali di Godot (snake_case)",
        icon: "\ud83d\udcd0",
        xp: 75,
        expectedOutput: "12\n35",
        theory: "\n<p>Per scrivere codice pulito, professionale e uniforme alla comunità mondiale di Godot, il team di Godot ha definito una <strong>Guida di Stile Ufficiale</strong> per GDScript:</p>\n<ul>\n    <li><strong>Variabili e Funzioni:</strong> Usano sempre <code>snake_case</code> (tutto minuscolo, parole separate da trattino basso): es. <code>velocita_massima</code>, <code>calcola_danno()</code>, <code>punti_esperienza</code>.</li>\n    <li><strong>Costanti ed Enumerazioni:</strong> Usano <code>CONSTANT_CASE</code> (tutto maiuscolo con trattino basso): es. <code>GRAVITA_MASSIMA</code>, <code>DANNO_BASE</code>.</li>\n    <li><strong>Nodi e Nomi di Classe:</strong> Usano <code>PascalCase</code> (ogni parola con iniziale maiuscola): es. <code>CharacterBody2D</code>, <code>WeaponSlot</code>.</li>\n</ul>\n<p>I nomi devono essere descrittivi ed auto-esplicativi: evita nomi generici come <code>x</code> o <code>temp</code> nei progetti reali!</p>\n",
        task: "\n<p>Riformatta le statistiche di un mostro seguendo rigorosamente lo snake_case ufficiale di Godot.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea la variabile <code>livello_nemico</code> con valore <code>12</code>.</li>\n    <li>Crea la variabile <code>danno_da_fuoco</code> con valore <code>35</code>.</li>\n    <li>Stampa <code>livello_nemico</code> e poi <code>danno_da_fuoco</code> su due righe distinte.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le variabili rispettando lo snake_case e stampale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le variabili rispettando lo snake_case e stampale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar livello_nemico = 12\n\tvar danno_da_fuoco = 35\n\tprint(livello_nemico)\n\tprint(danno_da_fuoco)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa trattini bassi (_) tra le parole, tutto in minuscolo."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non usare camelCase come livelloNemico."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa con print(livello_nemico) e print(danno_da_fuoco)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "12\n35";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 10,
        conceptId: "type_system",
        conceptTags: ["type_system", "ch3", "print", "var", "functions"],
        chapterId: 3,
        isMastery: false,
        title: "10. Tipizzazione Statica: Sicurezza e Prestazioni",
        icon: "\ud83c\udfaf",
        xp: 50,
        expectedOutput: "12.5\n40",
        theory: "\n<p>GDScript 2.0 (in Godot 4) offre un potente sistema di <strong>tipizzazione statica facoltativa</strong>. Sebbene possiamo lasciare che GDScript determini il tipo dinamicamente, specificare il tipo esplicito offre vantaggi immensi:</p>\n<ol>\n    <li><strong>Rilevamento immediato dei bug:</strong> Se provi ad assegnare una stringa a una variabile numerica, l'editor ti avvisa prima ancora di eseguire il gioco.</li>\n    <li><strong>Autocompletamento intelligente:</strong> L'editor di Godot conosce esattamente i metodi e le proprietà disponibili per quell'oggetto.</li>\n    <li><strong>Prestazioni superiori:</strong> Godot ottimizza il bytecode di esecuzione quando i tipi sono noti a priori.</li>\n</ol>\n<p>La sintassi prevede due punti <code>:</code> seguiti dal tipo:</p>\n<pre><code class=\"language-gdscript\">var munizioni: int = 30\nvar precisione_tiro: float = 0.85\nvar classe_personaggio: String = \"Mago\"\nvar in_combattimento: bool = true</code></pre>\n",
        task: "\n<p>Dichiara la configurazione tipizzata di una torretta difensiva.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara una variabile tipizzata <code>raggio_attacco: float = 12.5</code>.</li>\n    <li>Dichiara una variabile tipizzata <code>colpi_rimasti: int = 40</code>.</li>\n    <li>Stampa <code>raggio_attacco</code> e poi <code>colpi_rimasti</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le due variabili con tipizzazione statica esplicita e stampale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le due variabili con tipizzazione statica esplicita e stampale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar raggio_attacco: float = 12.5\n\tvar colpi_rimasti: int = 40\n\tprint(raggio_attacco)\n\tprint(colpi_rimasti)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa la sintassi: var nome: Tipo = valore"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "float per numeri decimali (12.5) e int per numeri interi (40)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Non dimenticare i due punti tra il nome della variabile e il nome del tipo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "12.5\n40";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 11,
        conceptId: "type_system",
        conceptTags: ["type_system", "ch3", "print", "var", "functions"],
        chapterId: 3,
        isMastery: false,
        title: "11. Inferenza Automatica del Tipo con l'Operatore :=",
        icon: "\u26a1",
        xp: 50,
        expectedOutput: "9.8\nViper-X",
        theory: "\n<p>Spesso scrivere sia il tipo che il valore iniziale risulta ripetitivo (es. <code>var forza: int = 100</code>). In Godot 4 possiamo usare l'operatore di <strong>inferenza di tipo</strong> <code>:=</code>.</p>\n<p>Quando scrivi <code>:=</code>, Godot deduce automaticamente il tipo dal valore assegnato a destra e blocca quel tipo per sempre, esattamente come se lo avessi scritto a mano!</p>\n<pre><code class=\"language-gdscript\">var punteggio := 500       # Godot deduce che punteggio è di tipo int\nvar tag_giocatore := \"P1\"  # Godot deduce String\nvar attivo := true         # Godot deduce bool</code></pre>\n<p>Questa è la sintassi più moderna e raccomandata per dichiarare variabili in Godot 4, perché unisce brevità e sicurezza statica.</p>\n",
        task: "\n<p>Inizializza i parametri di un veicolo da corsa spaziale sfruttando l'operatore <code>:=</code>.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea la variabile <code>accelerazione := 9.8</code>.</li>\n    <li>Crea la variabile <code>modello_nave := \"Viper-X\"</code>.</li>\n    <li>Stampa <code>accelerazione</code> e poi <code>modello_nave</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa l'operatore := per definire le variabili con inferenza\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa l'operatore := per definire le variabili con inferenza\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar accelerazione := 9.8\n\tvar modello_nave := \"Viper-X\"\n\tprint(accelerazione)\n\tprint(modello_nave)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa := senza spazio tra i due punti e l'uguale."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Esempio: var accelerazione := 9.8"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa le due variabili con due chiamate distinte a print()."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "9.8\nViper-X";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 12,
        conceptId: "type_system",
        conceptTags: ["type_system", "ch3", "print", "functions"],
        chapterId: 3,
        isMastery: false,
        title: "12. Costanti di Gioco: Parametri Immutabili",
        icon: "\ud83d\udd12",
        xp: 50,
        expectedOutput: "100\nAethelgard",
        theory: "\n<p>In qualsiasi videogioco esistono parametri che non devono <strong>mai</strong> essere modificati durante la partita: la gravità del mondo, il numero massimo di slot di inventario, la velocità della luce o il framerate target.</p>\n<p>Per definire un valore immutabile usiamo la parola chiave <code>const</code> anziché <code>var</code>:</p>\n<pre><code class=\"language-gdscript\">const GRAVITA := 980.0\nconst MAX_SLOT_INVENTARIO := 20</code></pre>\n<p>Se per sbaglio provi a riassegnare un valore a una costante (es. <code>GRAVITA = 500</code>), Godot bloccherà l'esecuzione segnalando un errore di compilazione. Inoltre, le costanti sono denominate per convenzione in tutto MAIUSCOLO (SCREAMING_SNAKE_CASE).</p>\n",
        task: "\n<p>Definisci le costanti fisiche e di progressione del mondo di gioco.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea una costante <code>LIVELLO_MASSIMO = 100</code>.</li>\n    <li>Crea una costante <code>NOME_REGNO = \"Aethelgard\"</code>.</li>\n    <li>Stampa <code>LIVELLO_MASSIMO</code> e poi <code>NOME_REGNO</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Definisci le due costanti e stampale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Definisci le due costanti e stampale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tconst LIVELLO_MASSIMO = 100\n\tconst NOME_REGNO = \"Aethelgard\"\n\tprint(LIVELLO_MASSIMO)\n\tprint(NOME_REGNO)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa la parola chiave const al posto di var."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Scrivi i nomi delle costanti in lettere tutte maiuscole con trattino basso."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa prima LIVELLO_MASSIMO e poi NOME_REGNO."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "100\nAethelgard";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 13,
        conceptId: "type_system",
        conceptTags: ["type_system", "ch3", "print", "var", "functions"],
        chapterId: 3,
        isMastery: false,
        title: "13. Riepilogo: Il Profilo Completo dell'Avventuriero",
        icon: "\ud83d\udc64",
        xp: 50,
        expectedOutput: "Kaelen\n18\n4.2\ntrue",
        theory: "\n<p>Facciamo un ripasso completo delle competenze acquisite sulle variabili combinando tutti i tipi fondamentali che abbiamo incontrato:</p>\n<ul>\n    <li><code>String</code> per il nome</li>\n    <li><code>int</code> per la forza</li>\n    <li><code>float</code> per la resistenza magica</li>\n    <li><code>bool</code> per lo stato di appartenenza a una gilda</li>\n</ul>\n<p>Padroneggiare queste definizioni è la base assoluta su cui costruirai i componenti dei nodi (Entity, Player, Enemy) nei capitoli successivi.</p>\n",
        task: "\n<p>Crea il profilo completo di un nuovo avventuriero con tipi espliciti.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>nome_eroe: String = \"Kaelen\"</code>.</li>\n    <li>Dichiara <code>punti_forza: int = 18</code>.</li>\n    <li>Dichiara <code>difesa_magica: float = 4.2</code>.</li>\n    <li>Dichiara <code>membro_gilda: bool = true</code>.</li>\n    <li>Stampa ciascuna variabile su una riga separata, esattamente in questo ordine.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le 4 variabili tipizzate dell'eroe e stampale in ordine\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le 4 variabili tipizzate dell'eroe e stampale in ordine\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar nome_eroe: String = \"Kaelen\"\n\tvar punti_forza: int = 18\n\tvar difesa_magica: float = 4.2\n\tvar membro_gilda: bool = true\n\tprint(nome_eroe)\n\tprint(punti_forza)\n\tprint(difesa_magica)\n\tprint(membro_gilda)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa 'var nome: Tipo = valore' per ciascuna variabile."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Rispetta l'ordine di stampa: nome, forza, difesa magica, membro gilda."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Verifica la corrispondenza dei tipi: String, int, float, bool."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Kaelen\n18\n4.2\ntrue";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 14,
        conceptId: "type_system",
        conceptTags: ["type_system", "ch3", "print", "var", "functions"],
        chapterId: 3,
        isMastery: true,
        title: "14. Conversione di Tipo (Casting) tra Numeri e Testo",
        icon: "\ud83d\udd04",
        xp: 75,
        expectedOutput: "Monete d'oro: 42\n15",
        theory: "\n<p>Spesso in un videogioco abbiamo bisogno di convertire un valore da un tipo all'altro. Ad esempio, per mostrare i punti vita su un'etichetta dell'interfaccia utente (<code>Label</code>) dobbiamo convertire un numero in testo.</p>\n<p>In GDScript possiamo usare le funzioni di casting integrate:</p>\n<ul>\n    <li><code>str(valore)</code>: Converte qualsiasi valore in una <code>String</code>.</li>\n    <li><code>int(valore)</code>: Converte in intero (tronca la parte decimale di un float, es. <code>int(9.8)</code> diventa <code>9</code>).</li>\n    <li><code>float(valore)</code>: Converte un intero o una stringa numerica in <code>float</code> (es. <code>float(5)</code> diventa <code>5.0</code>).</li>\n</ul>\n<p>Possiamo anche usare l'operatore <code>as</code> per il casting tra classi e nodi (lo vedremo nella Parte 3).</p>\n",
        task: "\n<p>Converti i dati di gioco e componi la stringa per l'HUD (Head-Up Display).</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>var monete_raccolte = 42</code>.</li>\n    <li>Converti il numero di monete in stringa con <code>str(monete_raccolte)</code> e uniscilo a <code>\"Monete d'oro: \"</code>.</li>\n    <li>Stampa la stringa risultante: <code>Monete d'oro: 42</code>.</li>\n    <li>Dichiara <code>var danno_grezzo = 15.89</code>, convertilo in intero con <code>int()</code> e stampa il numero risultante su una nuova riga.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Esegui le conversioni di tipo richieste e stampa i risultati\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Esegui le conversioni di tipo richieste e stampa i risultati\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar monete_raccolte = 42\n\tvar testo_hud = \"Monete d'oro: \" + str(monete_raccolte)\n\tprint(testo_hud)\n\tvar danno_grezzo = 15.89\n\tvar danno_intero = int(danno_grezzo)\n\tprint(danno_intero)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa str(monete_raccolte) per poter concatenare il numero con l'operatore +."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "int(15.89) tronca i decimali restituendo 15."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa prima la stringa dell'HUD e poi il danno convertito."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Monete d'oro: 42\n15";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 15,
        conceptId: "operators_math",
        conceptTags: ["operators_math", "ch4", "print", "var", "functions"],
        chapterId: 4,
        isMastery: false,
        title: "15. Operatori Aritmetici: Calcolo del Danno d'Attacco",
        icon: "\u2694\ufe0f",
        xp: 50,
        expectedOutput: "50",
        theory: "\n<p>Gli operatori matematici fondamentali permettono di calcolare il bilanciamento dei combattimenti e i punteggi:</p>\n<ul>\n    <li><code>+</code> : Addizione (sommare bonus al danno base)</li>\n    <li><code>-</code> : Sottrazione (ridurre il danno in base all'armatura nemica)</li>\n    <li><code>*</code> : Moltiplicazione (applicare moltiplicatori di colpo critico)</li>\n    <li><code>/</code> : Divisione</li>\n</ul>\n<p>L'ordine delle operazioni segue le regole matematiche standard (precedenza di moltiplicazione e divisione rispetto ad addizione e sottrazione). Possiamo usare le parentesi tonde <code>(...)</code> per controllare la precedenza.</p>\n",
        task: "\n<p>Calcola il danno finale inflitto da una freccia incantata.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Danno base: <code>20</code></li>\n    <li>Bonus incantamento: <code>5</code></li>\n    <li>Moltiplicatore critico: <code>2</code></li>\n    <li>Formula del danno: <code>(danno_base + bonus_incanto) * moltiplicatore_critico</code></li>\n    <li>Calcola il danno finale in una variabile <code>danno_totale</code> e stampalo.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il danno totale usando gli operatori aritmetici e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il danno totale usando gli operatori aritmetici e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar danno_base = 20\n\tvar bonus_incanto = 5\n\tvar moltiplicatore_critico = 2\n\tvar danno_totale = (danno_base + bonus_incanto) * moltiplicatore_critico\n\tprint(danno_totale)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "(20 + 5) * 2 = 25 * 2 = 50."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa le parentesi tonde per sommare prima il bonus al danno base."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile con print(danno_totale)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "50";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 16,
        conceptId: "operators_math",
        conceptTags: ["operators_math", "ch4", "print", "var", "functions"],
        chapterId: 4,
        isMastery: false,
        title: "16. Divisione Intera: Ripartizione del Bottino nel Party",
        icon: "\ud83d\udc8e",
        xp: 50,
        expectedOutput: "26",
        theory: "\n<p>In GDScript, quando dividi due numeri interi usando l'operatore <code>/</code>, il risultato è una <strong>divisione intera</strong>: qualsiasi decimale viene scartato (arrotondamento verso il basso).</p>\n<pre><code class=\"language-gdscript\">var monete = 10\nvar membri_party = 3\nvar quota = monete / membri_party # Risultato: 3 (non 3.333)</code></pre>\n<p>Se invece desideri una divisione reale con la virgola, almeno uno dei due operandi deve essere un numero <code>float</code>:</p>\n<pre><code class=\"language-gdscript\">var quota_esatta = 10.0 / 3 # Risultato: 3.333333</code></pre>\n",
        task: "\n<p>Il gruppo di 4 eroi ha sconfitto un drago e ottenuto un bottino di 105 gemme preziose.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>gemme_totali = 105</code> e <code>membri = 4</code>.</li>\n    <li>Calcola la quota intera che spetta a ciascun eroe con la divisione intera <code>gemme_per_eroe = gemme_totali / membri</code>.</li>\n    <li>Stampa <code>gemme_per_eroe</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola la divisione intera delle gemme e stampala\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola la divisione intera delle gemme e stampala\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar gemme_totali = 105\n\tvar membri = 4\n\tvar gemme_per_eroe = gemme_totali / membri\n\tprint(gemme_per_eroe)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "105 diviso 4 con numeri interi restituisce 26 (il resto di 1 gemma viene scartato)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non trasformare i numeri in float se vuoi ottenere il valore intero."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il risultato con print(gemme_per_eroe)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "26";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 17,
        conceptId: "operators_math",
        conceptTags: ["operators_math", "ch4", "print", "var", "functions"],
        chapterId: 4,
        isMastery: false,
        title: "17. Operatore Modulo (%): Resto del Bottino e Frame di Animazione",
        icon: "\ud83c\udfb2",
        xp: 50,
        expectedOutput: "1",
        theory: "\n<p>L'operatore <strong>modulo</strong> <code>%</code> calcola il <em>resto</em> di una divisione intera tra due numeri. È uno degli operatori più usati nello sviluppo di videogiochi!</p>\n<p>Casi d'uso classici:</p>\n<ul>\n    <li><strong>Verificare se un numero è pari o dispari:</strong> <code>numero % 2 == 0</code></li>\n    <li><strong>Ciclo dei frame di un'animazione:</strong> <code>frame_corrente = (frame_corrente + 1) % tot_frame</code></li>\n    <li><strong>Calcolare il resto di una ripartizione di oggetti o monete.</strong></li>\n</ul>\n<pre><code class=\"language-gdscript\">var resto = 105 % 4 # Risultato: 1 (poiché 26 * 4 = 104, con resto di 1)</code></pre>\n",
        task: "\n<p>Calcola quante gemme avanzano dopo aver diviso equamente il bottino di 105 gemme tra i 4 avventurieri.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa l'operatore modulo <code>%</code> per calcolare il resto tra <code>105</code> e <code>4</code> in una variabile <code>gemme_avanzate</code>.</li>\n    <li>Stampa <code>gemme_avanzate</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il resto con l'operatore % e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il resto con l'operatore % e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar gemme_totali = 105\n\tvar membri = 4\n\tvar gemme_avanzate = gemme_totali % membri\n\tprint(gemme_avanzate)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "L'operatore modulo in GDScript è il simbolo %."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "105 % 4 fa 1."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile gemme_avanzate."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "1";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 18,
        conceptId: "operators_math",
        conceptTags: ["operators_math", "ch4", "print", "var", "functions"],
        chapterId: 4,
        isMastery: false,
        title: "18. Scorciatoie di Assegnazione (+=, -=, *=)",
        icon: "\ud83d\udcc8",
        xp: 50,
        expectedOutput: "75",
        theory: "\n<p>Nei giochi capita continuamente di modificare una variabile aggiungendo o sottraendo un importo: quando raccogli monete, quando subisci danni o quando consumi mana.</p>\n<p>Invece di scrivere <code>hp = hp - 15</code>, GDScript offre le scorciatoie di assegnazione combinata:</p>\n<ul>\n    <li><code>hp -= 15</code> (sottrae 15 dai punti vita)</li>\n    <li><code>monete += 50</code> (aggiunge 50 alle monete)</li>\n    <li><code>punti_attacco *= 2</code> (raddoppia l'attacco)</li>\n    <li><code>munizioni /= 2</code> (dimezza le munizioni)</li>\n</ul>\n<p>Queste scorciatoie rendono il codice molto più sintetico, chiaro e veloce da leggere.</p>\n",
        task: "\n<p>Simula un combattimento: il giocatore subisce un danno da trappola e poi beve una pozione curativa.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Inizializza <code>var hp = 100</code>.</li>\n    <li>Sottrai <code>35</code> punti usando l'operatore <code>-=</code>.</li>\n    <li>Aggiungi <code>10</code> punti curativi usando l'operatore <code>+=</code>.</li>\n    <li>Stampa il valore finale di <code>hp</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Modifica hp usando le scorciatoie -= e +=, poi stampa\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Modifica hp usando le scorciatoie -= e +=, poi stampa\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar hp = 100\n\thp -= 35\n\thp += 10\n\tprint(hp)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Parti con hp = 100."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "100 - 35 = 65, poi 65 + 10 = 75."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile finale con print(hp)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "75";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 19,
        conceptId: "operators_math",
        conceptTags: ["operators_math", "ch4", "print", "var", "functions"],
        chapterId: 4,
        isMastery: false,
        title: "19. Riepilogo: Bilanciamento di Attacco e Difesa",
        icon: "\ud83d\udee1\ufe0f",
        xp: 50,
        expectedOutput: "50",
        theory: "\n<p>Mettiamo in pratica tutti gli operatori aritmetici per implementare una formula reale di bilanciamento GDR.</p>\n<p>La formula tipica di molti giochi di ruolo:</p>\n<p><code>Danno Netto = (Attacco Base + Livello * 3) - Armatura</code></p>\n<p>Padroneggiare queste espressioni combinate ti consentirà di bilanciare le armi, calcolare le ricompense di fine missione e gestire l'usura degli equipaggiamenti.</p>\n",
        task: "\n<p>Calcola il danno netto calcolato secondo la formula di gioco.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li><code>attacco_base = 50</code></li>\n    <li><code>livello = 5</code></li>\n    <li><code>armatura_nemica = 15</code></li>\n    <li>Calcola <code>danno_netto = (attacco_base + (livello * 3)) - armatura_nemica</code>.</li>\n    <li>Stampa <code>danno_netto</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il danno netto con la formula e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il danno netto con la formula e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar attacco_base = 50\n\tvar livello = 5\n\tvar armatura_nemica = 15\n\tvar danno_netto = (attacco_base + (livello * 3)) - armatura_nemica\n\tprint(danno_netto)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "5 * 3 = 15. Poi 50 + 15 = 65. Infine 65 - 15 = 50."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Attento all'ordine delle parentesi."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il risultato con print(danno_netto)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "50";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 20,
        conceptId: "operators_math",
        conceptTags: ["operators_math", "ch4", "print", "var", "functions"],
        chapterId: 4,
        isMastery: true,
        title: "20. Operatori di Confronto: Verificare i Requisiti di Livello",
        icon: "\ud83d\udddd\ufe0f",
        xp: 75,
        expectedOutput: "false\ntrue",
        theory: "\n<p>Per prendere decisioni nel codice dobbiamo confrontare due valori. Gli <strong>operatori di confronto</strong> restituiscono sempre un booleano (<code>true</code> o <code>false</code>):</p>\n<ul>\n    <li><code>==</code> : Uguale a (attenzione: due simboli di uguale, non uno solo!)</li>\n    <li><code>!=</code> : Diverso da</li>\n    <li><code>&gt;</code> : Maggiore di</li>\n    <li><code>&lt;</code> : Minore di</li>\n    <li><code>&gt;=</code> : Maggiore o uguale a</li>\n    <li><code>&lt;=</code> : Minore o uguale a</li>\n</ul>\n<pre><code class=\"language-gdscript\">var livello_giocatore = 15\nvar livello_richiesto = 10\nvar puo_equipaggiare = livello_giocatore >= livello_richiesto # true</code></pre>\n",
        task: "\n<p>Verifica se il giocatore soddisfa i requisiti per impugnare l'Ascia da Guerra.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>forza_giocatore = 14</code> e <code>forza_richiesta = 16</code>.</li>\n    <li>Confronta se la forza del giocatore è maggiore o uguale a quella richiesta (<code>forza_giocatore &gt;= forza_richiesta</code>) e stampa il risultato booleano.</li>\n    <li>Confronta se la forza del giocatore è diversa da zero (<code>forza_giocatore != 0</code>) e stampa il risultato booleano sulla seconda riga.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Esegui i due confronti e stampa i loro risultati booleani\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Esegui i due confronti e stampa i loro risultati booleani\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar forza_giocatore = 14\n\tvar forza_richiesta = 16\n\tprint(forza_giocatore >= forza_richiesta)\n\tprint(forza_giocatore != 0)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "14 >= 16 è falso (false)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "14 != 0 è vero (true)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Puoi passare il confronto direttamente a print(), es: print(forza_giocatore >= forza_richiesta)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "false\ntrue";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 21,
        conceptId: "conditions_logic",
        conceptTags: ["conditions_logic", "ch5", "print", "var", "functions"],
        chapterId: 5,
        isMastery: false,
        title: "21. Operatore Logico AND: Verificare Condizioni Multiple",
        icon: "\ud83d\udd17",
        xp: 50,
        expectedOutput: "true",
        theory: "\n<p>Spesso un'azione di gioco può avvenire solo se <strong>due condizioni sono contemporaneamente vere</strong>. Ad esempio: per lanciare un incantesimo, il giocatore deve avere abbastanza mana E l'incantesimo non deve essere in cooldown.</p>\n<p>In GDScript possiamo usare la parola chiave <code>and</code> (oppure il simbolo <code>&amp;&amp;</code>):</p>\n<pre><code class=\"language-gdscript\">var puo_lanciare = ha_mana and not in_cooldown</code></pre>\n<p>L'espressione <code>A and B</code> restituisce <code>true</code> solo se sia <code>A</code> che <code>B</code> sono <code>true</code>. Se anche solo una delle due è <code>false</code>, l'intero risultato sarà <code>false</code>.</p>\n",
        task: "\n<p>Verifica se il giocatore può aprire il Portale dei Titani.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Condizione 1: <code>ha_chiave_antica = true</code></li>\n    <li>Condizione 2: <code>livello_magia = 7</code></li>\n    <li>Il portale si apre solo se l'eroe ha la chiave E il livello di magia è maggiore o uguale a <code>5</code>.</li>\n    <li>Valuta la condizione combinata <code>ha_chiave_antica and (livello_magia &gt;= 5)</code> e stampa il risultato booleano.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Verifica le condizioni con l'operatore and e stampa il booleano\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Verifica le condizioni con l'operatore and e stampa il booleano\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar ha_chiave_antica = true\n\tvar livello_magia = 7\n\tvar portale_apribile = ha_chiave_antica and (livello_magia >= 5)\n\tprint(portale_apribile)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "true and (7 >= 5) -> true and true -> true."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa l'operatore 'and' tra le due condizioni."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile booleana portale_apribile."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "true";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 22,
        conceptId: "conditions_logic",
        conceptTags: ["conditions_logic", "ch5", "print", "var", "functions"],
        chapterId: 5,
        isMastery: false,
        title: "22. Operatore Logico OR: Vie di Fuga Alternative",
        icon: "\ud83d\udeaa",
        xp: 50,
        expectedOutput: "true",
        theory: "\n<p>L'operatore logico <code>or</code> (oppure <code>||</code>) restituisce <code>true</code> se <strong>almeno una</strong> delle condizioni confrontate è vera.</p>\n<p>Esempio di gameplay: un giocatore può entrare nella sala del tesoro se possiede il Pass VIP <em>OPPURE</em> se possiede un Grimaldello magico.</p>\n<pre><code class=\"language-gdscript\">var puo_entrare = ha_pass_vip or ha_grimaldello</code></pre>\n<p>L'espressione è <code>false</code> solo se entrambe le condizioni sono <code>false</code>.</p>\n",
        task: "\n<p>Verifica se l'eroe può sfuggire alla trappola mortale.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>ha_pozione_teletrasporto = false</code>.</li>\n    <li>Dichiara <code>ha_ali_di_drago = true</code>.</li>\n    <li>Verifica se l'eroe può fuggire con <code>ha_pozione_teletrasporto or ha_ali_di_drago</code>.</li>\n    <li>Stampa il valore booleano risultante.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa l'operatore or per verificare la via di fuga e stampa il risultato\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa l'operatore or per verificare la via di fuga e stampa il risultato\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar ha_pozione_teletrasporto = false\n\tvar ha_ali_di_drago = true\n\tvar puo_fuggire = ha_pozione_teletrasporto or ha_ali_di_drago\n\tprint(puo_fuggire)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "false or true restituisce true, perché almeno una delle due opzioni è valida."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa la parola chiave 'or'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa puo_fuggire."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "true";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 23,
        conceptId: "conditions_logic",
        conceptTags: ["conditions_logic", "ch5", "print", "var", "functions"],
        chapterId: 5,
        isMastery: false,
        title: "23. Riepilogo: Accesso al Sanctum dei Campioni",
        icon: "\ud83c\udfdb\ufe0f",
        xp: 50,
        expectedOutput: "true",
        theory: "\n<p>Nelle architetture di gioco reali spesso combiniamo <code>and</code>, <code>or</code> e <code>not</code> in espressioni articolate per determinare se consentire o vietare una determinata azione.</p>\n<p>Ricorda la priorità logica: <code>not</code> ha la precedenza più alta, seguito da <code>and</code>, e infine da <code>or</code>. Come in matematica, l'uso delle parentesi tonde rende l'intenzione del programmatore chiara ed evita equivoci.</p>\n",
        task: "\n<p>Determina se il cancello della città fortificata deve aprirsi per il viandante.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li><code>is_giorno = false</code></li>\n    <li><code>ha_torcia = true</code></li>\n    <li><code>is_ricercato = false</code></li>\n    <li>La guardia apre il cancello se: <code>(is_giorno or ha_torcia) and (not is_ricercato)</code>.</li>\n    <li>Calcola il valore booleano in una variabile <code>cancello_aperto</code> e stampalo.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Combina or, and e not per stabilire se il cancello si apre\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Combina or, and e not per stabilire se il cancello si apre\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar is_giorno = false\n\tvar ha_torcia = true\n\tvar is_ricercato = false\n\tvar cancello_aperto = (is_giorno or ha_torcia) and (not is_ricercato)\n\tprint(cancello_aperto)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "(false or true) -> true."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "not false -> true."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "true and true -> true. Stampa cancello_aperto."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "true";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 24,
        conceptId: "conditions_logic",
        conceptTags: ["conditions_logic", "ch5", "print", "var", "functions"],
        chapterId: 5,
        isMastery: false,
        title: "24. L'Operatore NOT e la Negazione dei Flag",
        icon: "\ud83d\udeab",
        xp: 50,
        expectedOutput: "true",
        theory: "\n<p>L'operatore <code>not</code> (oppure <code>!</code>) inverte lo stato logico di una condizione:</p>\n<ul>\n    <li><code>not true</code> diventa <code>false</code></li>\n    <li><code>not false</code> diventa <code>true</code></li>\n</ul>\n<p>È particolarmente utile per verificare l'assenza di penalità o stati negativi (ad esempio: se il giocatore <strong>non</strong> è stordito, allora può muoversi):</p>\n<pre><code class=\"language-gdscript\">var is_stordito = false\nif not is_stordito:\n    muovi_giocatore()</code></pre>\n",
        task: "\n<p>Verifica se l'arciere può scoccare una freccia.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>arco_rotto = false</code>.</li>\n    <li>Crea la variabile booleana <code>puo_tirare = not arco_rotto</code>.</li>\n    <li>Stampa <code>puo_tirare</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa not per invertire il flag arco_rotto e stampare il risultato\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa not per invertire il flag arco_rotto e stampare il risultato\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar arco_rotto = false\n\tvar puo_tirare = not arco_rotto\n\tprint(puo_tirare)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "not false vale true."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa l'operatore not prima del nome della variabile."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile puo_tirare."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "true";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 25,
        conceptId: "conditions_logic",
        conceptTags: ["conditions_logic", "ch5", "print", "var", "conditions", "functions"],
        chapterId: 5,
        isMastery: true,
        title: "25. L'Operatore Ternario in GDScript: Decisioni su Una Riga",
        icon: "\u26a1",
        xp: 75,
        expectedOutput: "Veterano",
        theory: "\n<p>In GDScript non esiste l'operatore ternario classico stile C (<code>cond ? val1 : val2</code>), bensì la sintassi in stile Python con <code>if ... else</code> compresso su una sola riga:</p>\n<pre><code class=\"language-gdscript\">var stato = \"Vivo\" if hp > 0 else \"Sconfitto\"</code></pre>\n<p>La formula si legge così: assegna il primo valore <code>\"Vivo\"</code> se la condizione <code>hp &gt; 0</code> è vera, altrimenti assegna il secondo valore <code>\"Sconfitto\"</code>.</p>\n<p>È ideale per compattare assegnazioni semplici senza dover scrivere 4 righe di blocco <code>if/else</code>.</p>\n",
        task: "\n<p>Determina il titolo onorifico dell'eroe in base al livello raggiunto usando l'operatore ternario.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>livello_giocatore = 25</code>.</li>\n    <li>Assegna a <code>rango</code> il valore <code>\"Veterano\"</code> se <code>livello_giocatore &gt;= 20</code>, altrimenti assegna <code>\"Recluta\"</code>.</li>\n    <li>Stampa il valore di <code>rango</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa l'operatore ternario (val1 if cond else val2) e stampa il rango\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Usa l'operatore ternario (val1 if cond else val2) e stampa il rango\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar livello_giocatore = 25\n\tvar rango = \"Veterano\" if livello_giocatore >= 20 else \"Recluta\"\n\tprint(rango)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Sintassi: var rango = \"Veterano\" if livello_giocatore >= 20 else \"Recluta\""
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dato che 25 >= 20 è vero, il risultato sarà 'Veterano'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile rango."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Veterano";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 26,
        conceptId: "control_flow",
        conceptTags: ["control_flow", "ch6", "print", "var", "conditions", "functions"],
        chapterId: 6,
        isMastery: false,
        title: "26. L'Istruzione if: Rilevamento Colpo Critico",
        icon: "\ud83d\udca5",
        xp: 50,
        expectedOutput: "Colpo Critico!\n60",
        theory: "\n<p>L'istruzione <code>if</code> è il fondamento della logica decisionale nei videogiochi. Permette di eseguire un blocco di istruzioni solo se una determinata condizione è vera:</p>\n<pre><code class=\"language-gdscript\">if condizione:\n    # Blocco indentato eseguito solo se la condizione è vera\n    fai_qualcosa()</code></pre>\n<p>Non dimenticare i <strong>due punti <code>:</code></strong> alla fine della riga del <code>if</code> e l'indentazione con Tab delle istruzioni contenute al suo interno!</p>\n",
        task: "\n<p>Se il dado d'attacco tira un <code>20</code>, si attiva un colpo critico devastante.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>tiro_dado = 20</code>.</li>\n    <li>Dichiara <code>danno = 30</code>.</li>\n    <li>Usa un'istruzione <code>if tiro_dado == 20:</code>. All'interno del blocco, moltiplica il danno per 2 (<code>danno *= 2</code>) e stampa <code>Colpo Critico!</code>.</li>\n    <li>Fuori dall'if (dopo il blocco), stampa sempre il valore finale di <code>danno</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa l'if per raddoppiare il danno su critico e stampare i messaggi\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa l'if per raddoppiare il danno su critico e stampare i messaggi\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar tiro_dado = 20\n\tvar danno = 30\n\tif tiro_dado == 20:\n\t\tdanno *= 2\n\t\tprint(\"Colpo Critico!\")\n\tprint(danno)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa == per verificare l'uguaglianza con 20."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Le righe dentro l'if devono avere un livello di indentazione in più."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La seconda print(danno) deve essere allo stesso livello dell'if (fuori dal blocco)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Colpo Critico!\n60";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 27,
        conceptId: "control_flow",
        conceptTags: ["control_flow", "ch6", "print", "var", "conditions", "functions"],
        chapterId: 6,
        isMastery: false,
        title: "27. Biforcazione if - else: Vita o Sconfitta dell'Avversario",
        icon: "\u2696\ufe0f",
        xp: 50,
        expectedOutput: "Vittoria! Il Boss è stato sconfitto.",
        theory: "\n<p>Quando vogliamo eseguire un blocco di codice se la condizione è vera, e un blocco <em>alternativo</em> se la condizione è falsa, usiamo la struttura <code>if ... else</code>:</p>\n<pre><code class=\"language-gdscript\">if hp > 0:\n    print(\"Il nemico combatte ancora!\")\nelse:\n    print(\"Nemico sconfitto! Guadagni XP.\")</code></pre>\n<p>Esattamente uno dei due blocchi verrà eseguito, mai entrambi e mai nessuno dei due.</p>\n",
        task: "\n<p>Controlla lo stato vitale del Boss finale dopo l'ultimo fendente dell'eroe.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>boss_hp = 0</code>.</li>\n    <li>Se <code>boss_hp &gt; 0</code>, stampa <code>Il Boss prepara il contrattacco!</code>.</li>\n    <li>Altrimenti (nel blocco <code>else:</code>), stampa <code>Vittoria! Il Boss è stato sconfitto.</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il controllo if-else sullo stato vitale del boss\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il controllo if-else sullo stato vitale del boss\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar boss_hp = 0\n\tif boss_hp > 0:\n\t\tprint(\"Il Boss prepara il contrattacco!\")\n\telse:\n\t\tprint(\"Vittoria! Il Boss è stato sconfitto.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Poiché boss_hp è 0, la condizione boss_hp > 0 è falsa."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Verrà eseguito il ramo else:."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Non dimenticare i due punti dopo if e dopo else."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Vittoria! Il Boss è stato sconfitto.";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 28,
        conceptId: "control_flow",
        conceptTags: ["control_flow", "ch6", "print", "var", "conditions", "functions"],
        chapterId: 6,
        isMastery: false,
        title: "28. Riepilogo: Calcolatore di Attacchi Elementali (elif)",
        icon: "\ud83d\udd25",
        xp: 50,
        expectedOutput: "Danno da Congelamento: +15 HP e Rallentamento",
        theory: "\n<p>Quando abbiamo più di due opzioni mutualmente esclusive, possiamo concatenare le verifiche usando <code>elif</code> (abbreviazione di <em>else if</em>):</p>\n<pre><code class=\"language-gdscript\">if elemento == \"Fuoco\":\n    applica_bruciatura()\nelif elemento == \"Ghiaccio\":\n    applica_congelamento()\nelif elemento == \"Fulmine\":\n    applica_paralisi()\nelse:\n    attacco_fisico_base()</code></pre>\n<p>Godot verifica le condizioni in ordine dall'alto verso il basso ed esegue il primo blocco la cui condizione risulta vera, ignorando tutti i successivi.</p>\n",
        task: "\n<p>Implementa l'elaboratore di danno elementale per una gemma magica incastonata.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>tipo_gemma = \"Ghiaccio\"</code>.</li>\n    <li>Se <code>tipo_gemma == \"Fuoco\"</code> stampa <code>Danno da Fiamma: +25 HP</code>.</li>\n    <li>Altrimenti se <code>tipo_gemma == \"Ghiaccio\"</code> stampa <code>Danno da Congelamento: +15 HP e Rallentamento</code>.</li>\n    <li>Altrimenti stampa <code>Danno Fisico Standard</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa if-elif-else per il tipo di gemma\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa if-elif-else per il tipo di gemma\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar tipo_gemma = \"Ghiaccio\"\n\tif tipo_gemma == \"Fuoco\":\n\t\tprint(\"Danno da Fiamma: +25 HP\")\n\telif tipo_gemma == \"Ghiaccio\":\n\t\tprint(\"Danno da Congelamento: +15 HP e Rallentamento\")\n\telse:\n\t\tprint(\"Danno Fisico Standard\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa elif tipo_gemma == \"Ghiaccio\": per il secondo controllo."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dato che tipo_gemma è \"Ghiaccio\", verrà eseguito il blocco elif."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa esattamente la stringa richiesta per il ghiaccio."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Danno da Congelamento: +15 HP e Rallentamento";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 29,
        conceptId: "control_flow",
        conceptTags: ["control_flow", "ch6", "print", "var", "conditions", "functions"],
        chapterId: 6,
        isMastery: false,
        title: "29. Istruzioni if Annidate: Controllo Chiave e Livello Serratura",
        icon: "\ud83c\udff0",
        xp: 50,
        expectedOutput: "Accesso consentito al caveau segreto!",
        theory: "\n<p>Un'istruzione <code>if</code> può trovarsi all'interno del blocco di un'altra istruzione <code>if</code>. Questa struttura è detta <strong>annidata</strong> (nested) e richiede un doppio livello di indentazione.</p>\n<pre><code class=\"language-gdscript\">if ha_chiave:\n    if livello_scasso >= 3:\n        print(\"Forziere antico aperto!\")\n    else:\n        print(\"La serratura è troppo complessa.\")\nelse:\n    print(\"Non possiedi la chiave.\")</code></pre>\n<p>L'if interno viene valutato solo se l'if esterno ha avuto esito positivo.</p>\n",
        task: "\n<p>Verifica l'accesso alla stanza segreta dei sotterranei.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>ha_tessera = true</code> e <code>codice_sicurezza = 774</code>.</li>\n    <li>Nel primo <code>if ha_tessera:</code>, inserisci un secondo controllo: se <code>codice_sicurezza == 774</code> stampa <code>Accesso consentito al caveau segreto!</code>, altrimenti stampa <code>Codice errato. Allarme attivato!</code>.</li>\n    <li>Nel ramo <code>else:</code> del primo controllo stampa <code>Tessera magnetica assente.</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Costruisci la struttura if-else annidata\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Costruisci la struttura if-else annidata\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar ha_tessera = true\n\tvar codice_sicurezza = 774\n\tif ha_tessera:\n\t\tif codice_sicurezza == 774:\n\t\t\tprint(\"Accesso consentito al caveau segreto!\")\n\t\telse:\n\t\t\tprint(\"Codice errato. Allarme attivato!\")\n\telse:\n\t\tprint(\"Tessera magnetica assente.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "L'if interno richiede due livelli di rientro (due Tab)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Entrambe le condizioni sono soddisfatte, quindi verrà stampato il messaggio di successo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Controlla attentamente i due punti alla fine di ciascun if ed else."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Accesso consentito al caveau segreto!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 30,
        conceptId: "control_flow",
        conceptTags: ["control_flow", "ch6", "print", "var", "functions"],
        chapterId: 6,
        isMastery: true,
        title: "30. L'Istruzione match: Gestione dello Stato dell'AI Nemica",
        icon: "\ud83c\udfaf",
        xp: 75,
        expectedOutput: "Bersaglio avvistato: accensione fari e sirena!",
        theory: "\n<p>In GDScript l'istruzione <code>match</code> è la versione potenziata e moderna dello <code>switch</code> di altri linguaggi come C++ o C#. È lo strumento ideale per gestire le macchine a stati finiti (Finite State Machine) dei nemici e del giocatore!</p>\n<pre><code class=\"language-gdscript\">match stato:\n    \"IDLE\":\n        riproduci_animazione_riposo()\n    \"PATROL\":\n        muovi_lungo_pattuglia()\n    \"CHASE\":\n        insegui_bersaglio()\n    _:\n        # Il trattino basso funge da caso di default (qualunque altro valore)\n        stato_sconosciuto()</code></pre>\n<p>L'istruzione <code>match</code> non richiede istruzioni <code>break</code> (non c'è fallthrough automatico), rendendo il codice compatto, leggibile ed esente da bug.</p>\n",
        task: "\n<p>Simula l'aggiornamento dell'intelligenza artificiale di una sentinella robotica usando <code>match</code>.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>stato_guardia = \"ALLERTA\"</code>.</li>\n    <li>Usa un blocco <code>match stato_guardia:</code> per gestire:</li>\n    <li><code>\"RIPOSO\"</code>: stampa <code>Sensori in stand-by.</code></li>\n    <li><code>\"ALLERTA\"</code>: stampa <code>Bersaglio avvistato: accensione fari e sirena!</code></li>\n    <li><code>\"ATTACCO\"</code>: stampa <code>Fuoco a volontà!</code></li>\n    <li><code>_</code>: stampa <code>Stato sconosciuto.</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il match per gestire lo stato della guardia\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il match per gestire lo stato della guardia\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar stato_guardia = \"ALLERTA\"\n\tmatch stato_guardia:\n\t\t\"RIPOSO\":\n\t\t\tprint(\"Sensori in stand-by.\")\n\t\t\"ALLERTA\":\n\t\t\tprint(\"Bersaglio avvistato: accensione fari e sirena!\")\n\t\t\"ATTACCO\":\n\t\t\tprint(\"Fuoco a volontà!\")\n\t\t_:\n\t\t\tprint(\"Stato sconosciuto.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La sintassi è match variabile: seguito dai singoli pattern indentati."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Ogni ramo ha il proprio blocco indentato di codice."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il trattino basso _ cattura qualsiasi valore non gestito precedentemente."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Bersaglio avvistato: accensione fari e sirena!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 31,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: false,
        title: "31. Output Multiplo e Separatori di Stampa",
        icon: "\ud83d\udce2",
        xp: 50,
        expectedOutput: "Settore: Nebulosa-Omega | Scudi: 88",
        theory: "\n<p>La funzione <code>print()</code> di GDScript è incredibilmente versatile: può accettare un numero arbitrario di argomenti separati da virgola. Di default, Godot stampa ciascun argomento separandolo con uno spazio:</p>\n<pre><code class=\"language-gdscript\">var eroe = \"Arthur\"\nvar hp = 100\nprint(\"Personaggio:\", eroe, \"| HP:\", hp)\n# Output: Personaggio: Arthur | HP: 100</code></pre>\n<p>Questo permette di comporre messaggi di debug complessi e log di combattimento senza dover convertire manualmente ogni numero in stringa.</p>\n",
        task: "\n<p>Componi il log di telemetria dell'astronave da ricognizione usando argomenti multipli in <code>print()</code>.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>settore = \"Nebulosa-Omega\"</code>.</li>\n    <li>Dichiara <code>scudi_percentuale = 88</code>.</li>\n    <li>Stampa con un'unica istruzione <code>print()</code> i seguenti quattro argomenti: <code>\"Settore:\"</code>, <code>settore</code>, <code>\"| Scudi:\"</code>, <code>scudi_percentuale</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le variabili e stampale con argomenti multipli separati da virgola\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le variabili e stampale con argomenti multipli separati da virgola\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar settore = \"Nebulosa-Omega\"\n\tvar scudi_percentuale = 88\n\tprint(\"Settore:\", settore, \"| Scudi:\", scudi_percentuale)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Separa ogni elemento con una virgola all'interno delle parentesi di print()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Godot inserirà automaticamente uno spazio tra ciascun argomento."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Non serve convertire scudi_percentuale con str(), la virgola fa tutto in automatico."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Settore: Nebulosa-Omega | Scudi: 88";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 32,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: false,
        title: "32. Stampa di Statistiche Dinamiche del Personaggio",
        icon: "\ud83d\uddfa\ufe0f",
        xp: 50,
        expectedOutput: "Carburante: 45.5 L\nPropulsore Attivo: true",
        theory: "\n<p>Durante il playtesting e il bilanciamento di un videogioco, monitorare le variabili dinamiche in tempo reale è essenziale. Possiamo stampare stringhe descrittive abbinate a variabili numeriche, booleane e di testo per verificare che i calcoli del motore fisico e delle statistiche si comportino come previsto.</p>\n",
        task: "\n<p>Genera il rapporto istantaneo del consumo di carburante del jetpack.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>carburante_rimasto = 45.5</code>.</li>\n    <li>Dichiara <code>propulsore_attivo = true</code>.</li>\n    <li>Stampa: <code>Carburante: 45.5 L</code></li>\n    <li>Stampa sulla seconda riga: <code>Propulsore Attivo: true</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le variabili e stampa le due righe di telemetria\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara le variabili e stampa le due righe di telemetria\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar carburante_rimasto = 45.5\n\tvar propulsore_attivo = true\n\tprint(\"Carburante: \", carburante_rimasto, \" L\")\n\tprint(\"Propulsore Attivo: \", propulsore_attivo)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Puoi concatenare con + convertendo in str() oppure usare la virgola."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Se usi la virgola, ricorda che aggiunge uno spazio automatico."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "In alternativa: print(\"Carburante: \" + str(carburante_rimasto) + \" L\")."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Carburante: 45.5 L\nPropulsore Attivo: true";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 33,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: false,
        title: "33. Formattazione delle Stringhe con Segnaposto (%s, %d)",
        icon: "\ud83c\udff7\ufe0f",
        xp: 50,
        expectedOutput: "Livello: Sotterranei delle Ombre | Monete: 120 | Stelle: 3/3",
        theory: "\n<p>Invece di concatenare decine di pezzetti di testo con il <code>+</code> o usare virgole, GDScript offre la <strong>formattazione tramite operatore <code>%</code></strong>, elegante e pulita:</p>\n<pre><code class=\"language-gdscript\">var testo = \"Eroe: %s | Livello: %d | Oro: %d\" % [\"Thorin\", 15, 250]\nprint(testo)</code></pre>\n<p>I segnaposto principali sono:</p>\n<ul>\n    <li><code>%s</code> : Sostituisce una stringa o qualsiasi oggetto formattabile come testo.</li>\n    <li><code>%d</code> : Sostituisce un numero intero (digit).</li>\n    <li><code>%f</code> : Sostituisce un numero decimale (float), es. <code>%.2f</code> per mostrare solo due cifre decimali.</li>\n</ul>\n",
        task: "\n<p>Formatta il banner di notifica di livello completato usando i segnaposto.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>nome_livello = \"Sotterranei delle Ombre\"</code>.</li>\n    <li>Dichiara <code>monete = 120</code>.</li>\n    <li>Dichiara <code>stelle = 3</code>.</li>\n    <li>Usa il template: <code>\"Livello: %s | Monete: %d | Stelle: %d/3\" % [nome_livello, monete, stelle]</code>.</li>\n    <li>Stampa la stringa formattata risultante.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Formatta la stringa usando i segnaposto e stampala\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Formatta la stringa usando i segnaposto e stampala\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar nome_livello = \"Sotterranei delle Ombre\"\n\tvar monete = 120\n\tvar stelle = 3\n\tvar banner = \"Livello: %s | Monete: %d | Stelle: %d/3\" % [nome_livello, monete, stelle]\n\tprint(banner)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Passa le variabili all'interno di un array tra parentesi quadre dopo il simbolo %."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "L'ordine delle variabili nell'array deve coincidere con l'ordine dei segnaposto nel testo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile banner."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Livello: Sotterranei delle Ombre | Monete: 120 | Stelle: 3/3";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 34,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: false,
        title: "34. Acquisizione dell'Input del Giocatore e Scelte di Gioco",
        icon: "\ud83d\udd79\ufe0f",
        xp: 50,
        expectedOutput: "Classe confermata: Mago Elementalista\nBenvenuto nella gilda, prode avventuriero!",
        theory: "\n<p>Nei giochi Godot l'input dell'utente avviene solitamente tramite la tastiera, il mouse o il gamepad gestiti dal singleton <code>Input</code> (es. <code>Input.is_action_pressed(\"jump\")</code>). Negli script a riga di comando o nei prototipi testuali, possiamo acquisire testo direttamente dalla console di sistema con <code>OS.read_string_from_stdin()</code>.</p>\n<p>Quando acquisiamo un dato da tastiera o da un campo di testo dell'interfaccia (<code>LineEdit</code>), il valore ricevuto è sempre di tipo <strong>String</strong>.</p>\n<pre><code class=\"language-gdscript\">var nome_scelto: String = \"Paladino\" # Input ricevuto dal giocatore\nprint(\"Hai selezionato la classe:\", nome_scelto)</code></pre>\n",
        task: "\n<p>Simula la ricezione della scelta della classe da parte del giocatore.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara una variabile <code>classe_scelta = \"Mago Elementalista\"</code>.</li>\n    <li>Stampa: <code>Classe confermata: Mago Elementalista</code></li>\n    <li>Stampa sulla seconda riga: <code>Benvenuto nella gilda, prode avventuriero!</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Gestisci la classe scelta e stampa i messaggi di conferma\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Gestisci la classe scelta e stampa i messaggi di conferma\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar classe_scelta = \"Mago Elementalista\"\n\tprint(\"Classe confermata: \" + classe_scelta)\n\tprint(\"Benvenuto nella gilda, prode avventuriero!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Concatena \"Classe confermata: \" con la variabile classe_scelta."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Stampa il messaggio di benvenuto sulla seconda riga."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Usa print() per ciascuna riga."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Classe confermata: Mago Elementalista\nBenvenuto nella gilda, prode avventuriero!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 35,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: false,
        title: "35. Parsing e Conversione dell'Input Testuale in Numeri",
        icon: "\ud83d\udcb0",
        xp: 50,
        expectedOutput: "Costo totale per 8 pozioni: 120 oro",
        theory: "\n<p>Poiché i dati provenienti da campi di testo (come la casella in cui il giocatore digita la quantità di monete da scambiare) arrivano sotto forma di stringa (ad es. <code>\"50\"</code>), non possiamo eseguire calcoli matematici direttamente su di essi. Tentare di fare <code>\"50\" + 10</code> genererebbe un errore di tipo in GDScript.</p>\n<p>Dobbiamo effettuare il <strong>parsing numerico</strong> convertendo la stringa con <code>int()</code> o <code>float()</code>:</p>\n<pre><code class=\"language-gdscript\">var stringa_input = \"50\"\nvar quantita = int(stringa_input)\nvar totale = quantita + 10 # Risultato numerico corretto: 60</code></pre>\n",
        task: "\n<p>Converti l'input di acquisto di pozioni e calcola il costo totale con sconto.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara l'input testuale <code>quantita_testo = \"8\"</code>.</li>\n    <li>Converti <code>quantita_testo</code> in intero usando <code>int()</code> e salvalo in <code>quantita</code>.</li>\n    <li>Prezzo unitario pozione: <code>15</code> monete d'oro.</li>\n    <li>Calcola <code>costo_totale = quantita * 15</code>.</li>\n    <li>Stampa: <code>Costo totale per 8 pozioni: 120 oro</code> (usando le variabili calcolate).</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Esegui il casting da stringa a intero e calcola il costo totale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Esegui il casting da stringa a intero e calcola il costo totale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar quantita_testo = \"8\"\n\tvar quantita = int(quantita_testo)\n\tvar costo_totale = quantita * 15\n\tprint(\"Costo totale per \" + str(quantita) + \" pozioni: \" + str(costo_totale) + \" oro\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "int(\"8\") restituisce il numero intero 8."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "8 * 15 = 120."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Formatta la stringa finale con la composizione richiesta."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Costo totale per 8 pozioni: 120 oro";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 36,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: false,
        title: "36. Riepilogo: Il Conto alla Rovescia del Reattore",
        icon: "\ud83e\udded",
        xp: 50,
        expectedOutput: "Allerta! Mancano 75 secondi all'esplosione!",
        theory: "\n<p>Consolidiamo le nozioni di calcolo e visualizzazione con un timer di sovraccarico energetico. Unire operazioni matematiche e stringhe informative è alla base delle notifiche su schermo in Godot.</p>\n",
        task: "\n<p>Calcola il tempo rimanente prima dell'esplosione del reattore della base.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Tempo massimo del reattore: <code>120</code> secondi.</li>\n    <li>Tempo trascorso: <code>45</code> secondi.</li>\n    <li>Calcola <code>tempo_rimasto = 120 - 45</code>.</li>\n    <li>Stampa esattamente: <code>Allerta! Mancano 75 secondi all'esplosione!</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il tempo rimanente e stampa l'avviso\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il tempo rimanente e stampa l'avviso\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar tempo_massimo = 120\n\tvar tempo_trascorso = 45\n\tvar tempo_rimasto = tempo_massimo - tempo_trascorso\n\tprint(\"Allerta! Mancano %d secondi all'esplosione!\" % tempo_rimasto)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "120 - 45 = 75."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Puoi formattare con %d oppure con \"...\" + str(tempo_rimasto) + \"...\"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Verifica la punteggiatura e i punti esclamativi."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Allerta! Mancano 75 secondi all'esplosione!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 37,
        conceptId: "io_formatting",
        conceptTags: ["io_formatting", "ch7", "print", "var", "functions"],
        chapterId: 7,
        isMastery: true,
        title: "37. Riepilogo: Diagnostica dei Sistemi di Bordo",
        icon: "\ud83d\udccb",
        xp: 75,
        expectedOutput: "Sensori Operativi: true\nAllarme Radiazioni: false",
        theory: "\n<p>Un sistema di diagnostica di gioco valuta lo stato dei sottosistemi di un'entità (motori, scudi, armi) e ne stampa un riepilogo pulito a schermo.</p>\n",
        task: "\n<p>Stampa il bollettino di diagnostica dei sensori del rover planetario.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>sensori_attivi = true</code>.</li>\n    <li>Dichiara <code>radiazioni_critiche = false</code>.</li>\n    <li>Stampa: <code>Sensori Operativi: true</code></li>\n    <li>Stampa: <code>Allarme Radiazioni: false</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa le due righe di diagnostica\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa le due righe di diagnostica\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar sensori_attivi = true\n\tvar radiazioni_critiche = false\n\tprint(\"Sensori Operativi: \", sensori_attivi)\n\tprint(\"Allarme Radiazioni: \", radiazioni_critiche)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Stampa ciascun valore booleano con la sua etichetta descrittiva."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa due print distinte."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Controlla l'esatta dicitura delle due etichette."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Sensori Operativi: true\nAllarme Radiazioni: false";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 38,
        conceptId: "project_bill",
        conceptTags: ["project_bill", "ch8", "print", "functions"],
        chapterId: 8,
        isMastery: false,
        title: "38. Progetto Bottino (1/5): Banner della Gilda degli Avventurieri",
        icon: "\ud83e\uddfe",
        xp: 75,
        expectedOutput: "=== REGISTRO BOTTINO DUNGEON ===\nCalcolo ricompense e tassa di gilda attivo.",
        theory: "\n<p>Benvenuto nel tuo primo <strong>mini-progetto guidato</strong>! Nei prossimi 5 passi realizzeremo un sistema completo di ripartizione del bottino di fine dungeon tra i membri del party, calcolando la tassa della gilda, le quote individuali e il resto rimasto nel forziere.</p>\n<p>Il primo passo è presentare al giocatore un'intestazione chiara e suggestiva.</p>\n",
        task: "\n<p>Crea il messaggio di benvenuto del Registro di Ripartizione della Gilda.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Stampa sulla prima riga: <code>=== REGISTRO BOTTINO DUNGEON ===</code></li>\n    <li>Stampa sulla seconda riga: <code>Calcolo ricompense e tassa di gilda attivo.</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa l'intestazione ufficiale del registro bottino\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa l'intestazione ufficiale del registro bottino\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"=== REGISTRO BOTTINO DUNGEON ===\")\n\tprint(\"Calcolo ricompense e tassa di gilda attivo.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Scrivi due chiamate a print() consecutive."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Attento ai caratteri uguali === all'inizio e alla fine del titolo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Rispetta maiuscole e minuscole."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "=== REGISTRO BOTTINO DUNGEON ===\nCalcolo ricompense e tassa di gilda attivo.";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 39,
        conceptId: "project_bill",
        conceptTags: ["project_bill", "ch8", "print", "var", "functions"],
        chapterId: 8,
        isMastery: false,
        title: "39. Progetto Bottino (2/5): Inizializzazione Dati del Bottino",
        icon: "\ud83e\ude99",
        xp: 75,
        expectedOutput: "Oro recuperato: 500\nMembri della spedizione: 4",
        theory: "\n<p>Nel secondo passo memorizziamo i parametri del forziere: la quantità totale di monete d'oro recuperate e il numero di avventurieri che compongono il gruppo.</p>\n",
        task: "\n<p>Memorizza e stampa i parametri del bottino del dungeon.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>oro_totale = 500</code>.</li>\n    <li>Dichiara <code>numero_membri = 4</code>.</li>\n    <li>Stampa: <code>Oro recuperato: 500</code></li>\n    <li>Stampa: <code>Membri della spedizione: 4</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Memorizza i dati del bottino e stampali\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Memorizza i dati del bottino e stampali\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar oro_totale = 500\n\tvar numero_membri = 4\n\tprint(\"Oro recuperato: %d\" % oro_totale)\n\tprint(\"Membri della spedizione: %d\" % numero_membri)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dichiara le due variabili numeriche."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Stampa ciascuna informazione con la propria dicitura descrittiva."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Puoi usare print(\"Oro recuperato: \", oro_totale)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Oro recuperato: 500\nMembri della spedizione: 4";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 40,
        conceptId: "project_bill",
        conceptTags: ["project_bill", "ch8", "print", "var", "functions"],
        chapterId: 8,
        isMastery: false,
        title: "40. Progetto Bottino (3/5): Calcolo della Tassa di Gilda (Percentuale)",
        icon: "\ud83e\udd1d",
        xp: 75,
        expectedOutput: "Tassa gilda (10%): 50\nOro netto da distribuire: 450",
        theory: "\n<p>Ogni gilda trattiene una percentuale (ad esempio il 10%) per mantenere le strutture dell'armeria e finanziare le pozioni mediche della confraternita.</p>\n<p>Per calcolare una percentuale in GDScript:</p>\n<pre><code class=\"language-gdscript\">var tasso_gilda = 0.10 # 10%\nvar tassa = int(oro_totale * tasso_gilda)\nvar oro_netto = oro_totale - tassa</code></pre>\n",
        task: "\n<p>Calcola la tassa del 10% su 500 monete e l'oro netto rimanente.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dati: <code>oro_totale = 500</code>.</li>\n    <li>Calcola <code>tassa_gilda = int(500 * 0.10)</code> (pari a 50 monete).</li>\n    <li>Calcola <code>oro_netto = oro_totale - tassa_gilda</code> (pari a 450 monete).</li>\n    <li>Stampa: <code>Tassa gilda (10%): 50</code></li>\n    <li>Stampa: <code>Oro netto da distribuire: 450</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola la percentuale di tassa e l'oro netto\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola la percentuale di tassa e l'oro netto\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar oro_totale = 500\n\tvar tassa_gilda = int(oro_totale * 0.10)\n\tvar oro_netto = oro_totale - tassa_gilda\n\tprint(\"Tassa gilda (10%): %d\" % tassa_gilda)\n\tprint(\"Oro netto da distribuire: %d\" % oro_netto)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "500 * 0.10 = 50.0, convertito con int() diventa 50."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "500 - 50 = 450."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa le due righe con i valori calcolati."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Tassa gilda (10%): 50\nOro netto da distribuire: 450";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 41,
        conceptId: "project_bill",
        conceptTags: ["project_bill", "ch8", "print", "var", "functions"],
        chapterId: 8,
        isMastery: false,
        title: "41. Progetto Bottino (4/5): Divisione Equa e Monete Avanzate",
        icon: "\u2797",
        xp: 75,
        expectedOutput: "Quota per eroe: 112 oro\nAvanzo forziere: 2 oro",
        theory: "\n<p>Ora che conosciamo l'oro netto da ripartire (450 monete) e il numero di eroi (4), dobbiamo calcolare sia la quota intera che spetta a ciascun avventuriero, sia le monete rimaste sul fondo del forziere con l'operatore modulo <code>%</code>.</p>\n",
        task: "\n<p>Dividi 450 monete nette tra 4 membri e ricava il resto.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>oro_netto = 450</code> e <code>membri = 4</code>.</li>\n    <li>Calcola <code>quota_per_membro = oro_netto / membri</code> (divisione intera).</li>\n    <li>Calcola <code>monete_avanzo = oro_netto % membri</code> (resto modulo).</li>\n    <li>Stampa: <code>Quota per eroe: 112 oro</code></li>\n    <li>Stampa: <code>Avanzo forziere: 2 oro</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola quota individuale e resto\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola quota individuale e resto\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar oro_netto = 450\n\tvar membri = 4\n\tvar quota_per_membro = oro_netto / membri\n\tvar monete_avanzo = oro_netto % membri\n\tprint(\"Quota per eroe: %d oro\" % quota_per_membro)\n\tprint(\"Avanzo forziere: %d oro\" % monete_avanzo)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "450 / 4 con interi restituisce 112."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "450 % 4 restituisce 2 (perché 112 * 4 = 448, 450 - 448 = 2)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa le due righe come richiesto."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Quota per eroe: 112 oro\nAvanzo forziere: 2 oro";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 42,
        conceptId: "project_bill",
        conceptTags: ["project_bill", "ch8", "print", "var", "functions"],
        chapterId: 8,
        isMastery: true,
        title: "42. Progetto Bottino (5/5): Il Rotolo delle Ricompense Finale",
        icon: "\ud83d\udcdc",
        xp: 75,
        expectedOutput: "--- RIPARTIZIONE BOTTINO ---\nTotale: 1000 oro | Gilda: 100 oro\nNetto: 900 oro diviso per 5 membri\nCiascun eroe riceve: 180 oro",
        theory: "\n<p>Congratulazioni! Nell'ultimo passo assembliamo l'intero flusso del progetto in un unico script completo e stampiamo la pergamena delle ricompense ufficiale con formattazione elegante.</p>\n",
        task: "\n<p>Esegui il calcolo completo e stampa il riepilogo ufficiale del bottino.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Oro totale: <code>1000</code></li>\n    <li>Membri: <code>5</code></li>\n    <li>Tassa gilda (10%): <code>100</code></li>\n    <li>Oro netto: <code>900</code></li>\n    <li>Quota per eroe: <code>180</code></li>\n    <li>Stampa il seguente blocco di 4 righe esatte:</li>\n    <li><code>--- RIPARTIZIONE BOTTINO ---</code></li>\n    <li><code>Totale: 1000 oro | Gilda: 100 oro</code></li>\n    <li><code>Netto: 900 oro diviso per 5 membri</code></li>\n    <li><code>Ciascun eroe riceve: 180 oro</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il calcolo completo e la stampa del report\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il calcolo completo e la stampa del report\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar oro_totale = 1000\n\tvar membri = 5\n\tvar tassa_gilda = int(oro_totale * 0.10)\n\tvar oro_netto = oro_totale - tassa_gilda\n\tvar quota = oro_netto / membri\n\tprint(\"--- RIPARTIZIONE BOTTINO ---\")\n\tprint(\"Totale: %d oro | Gilda: %d oro\" % [oro_totale, tassa_gilda])\n\tprint(\"Netto: %d oro diviso per %d membri\" % [oro_netto, membri])\n\tprint(\"Ciascun eroe riceve: %d oro\" % quota)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa i segnaposto o componi le stringhe."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "1000 * 0.10 = 100. 1000 - 100 = 900. 900 / 5 = 180."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa esattamente le 4 righe mostrate nel testo del task."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "--- RIPARTIZIONE BOTTINO ---\nTotale: 1000 oro | Gilda: 100 oro\nNetto: 900 oro diviso per 5 membri\nCiascun eroe riceve: 180 oro";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 43,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "for", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "43. Il Ciclo for: Generazione Ondate di Mostri",
        icon: "\ud83d\udc79",
        xp: 50,
        expectedOutput: "Goblin #1 generato!\nGoblin #2 generato!\nGoblin #3 generato!\nGoblin #4 generato!",
        theory: "\n<p>I computer e i motori di gioco eccellono nel ripetere azioni molte volte in una frazione di secondo. Il costrutto principale per iterare un numero prefissato di volte è il <strong>ciclo <code>for</code></strong>.</p>\n<p>In combinazione con la funzione <code>range(n)</code>, il ciclo itera da <code>0</code> fino a <code>n - 1</code>:</p>\n<pre><code class=\"language-gdscript\">for i in range(3):\n    print(\"Ondata numero:\", i + 1)</code></pre>\n<p>A ogni giro (iterazione), la variabile <code>i</code> assume il valore successivo della sequenza.</p>\n",
        task: "\n<p>Genera 4 goblin sul campo di battaglia numerandoli progressivamente.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa un ciclo <code>for i in range(4):</code>.</li>\n    <li>A ogni iterazione, stampa: <code>Goblin #X generato!</code> dove X è <code>i + 1</code> (da 1 a 4).</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera con un ciclo for su range(4) e stampa il messaggio per ogni goblin\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera con un ciclo for su range(4) e stampa il messaggio per ogni goblin\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor i in range(4):\n\t\tprint(\"Goblin #%d generato!\" % (i + 1))\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "range(4) produce i numeri 0, 1, 2, 3."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Aggiungendo 1 con (i + 1) ottieni i numeri da 1 a 4."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Indentare la print() all'interno del for."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Goblin #1 generato!\nGoblin #2 generato!\nGoblin #3 generato!\nGoblin #4 generato!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 44,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "var", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "44. Il Ciclo while: Ricarica della Barra di Stamina",
        icon: "\ud83c\udfaf",
        xp: 50,
        expectedOutput: "Stamina ricaricata: 30\nStamina ricaricata: 40\nStamina ricaricata: 50",
        theory: "\n<p>A differenza del ciclo <code>for</code> (che itera su una sequenza nota), il <strong>ciclo <code>while</code></strong> continua a ripetersi finché una determinata condizione booleana rimane vera (<code>true</code>):</p>\n<pre><code class=\"language-gdscript\">while stamina < max_stamina:\n    stamina += 10</code></pre>\n<p><strong>Attenzione:</strong> è fondamentale assicurarsi che all'interno del corpo del <code>while</code> ci sia un'istruzione che prima o poi renda falsa la condizione (come incrementare una variabile), altrimenti il gioco cadrà in un <em>ciclo infinito</em> bloccando l'applicazione!</p>\n",
        task: "\n<p>Simula il recupero graduale della stamina di un corridore fino al massimo.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Inizializza <code>stamina = 20</code>.</li>\n    <li>Usa un ciclo <code>while stamina &lt; 50:</code>.</li>\n    <li>All'interno del ciclo, incrementa <code>stamina += 10</code> e subito dopo stampa: <code>Stamina ricaricata: X</code> (con il valore attuale).</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il ciclo while per ricaricare la stamina\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il ciclo while per ricaricare la stamina\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar stamina = 20\n\twhile stamina < 50:\n\t\tstamina += 10\n\t\tprint(\"Stamina ricaricata: %d\" % stamina)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "All'inizio stamina è 20 (< 50). Diventa 30 e stampa."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Poi 40 (< 50). Diventa 40 e stampa."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Poi 50 (non è più < 50). Diventa 50, stampa ed esce dal ciclo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Stamina ricaricata: 30\nStamina ricaricata: 40\nStamina ricaricata: 50";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 45,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "for", "conditions", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "45. L'Istruzione break: Interruzione Immediata per Fuoco Nemico",
        icon: "\ud83d\udcc8",
        xp: 50,
        expectedOutput: "Stanza 1 esplorata con successo.\nStanza 2 esplorata con successo.\nTrappola mortale nella stanza 3! Esplorazione interrotta.",
        theory: "\n<p>L'istruzione <code>break</code> permette di uscire immediatamente da qualsiasi ciclo (<code>for</code> o <code>while</code>), interrompendo le iterazioni rimanenti anche se la condizione del ciclo sarebbe ancora vera.</p>\n<p>È tipicamente usata nei motori di gioco per interrompere una scansione quando l'obiettivo è stato trovato, oppure per bloccare un'azione continuativa quando la salute scende a zero.</p>\n",
        task: "\n<p>Scansiona le stanze del dungeon (da 1 a 5). Se la stanza 3 contiene una trappola mortale, interrompi la spedizione.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa un ciclo <code>for stanza in range(1, 6):</code>.</li>\n    <li>Se <code>stanza == 3</code>: stampa <code>Trappola mortale nella stanza 3! Esplorazione interrotta.</code> ed esegui <code>break</code>.</li>\n    <li>Altrimenti stampa <code>Stanza X esplorata con successo.</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera sulle stanze e usa break quando incontri la stanza 3\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera sulle stanze e usa break quando incontri la stanza 3\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor stanza in range(1, 6):\n\t\tif stanza == 3:\n\t\t\tprint(\"Trappola mortale nella stanza 3! Esplorazione interrotta.\")\n\t\t\tbreak\n\t\tprint(\"Stanza %d esplorata con successo.\" % stanza)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "range(1, 6) genera 1, 2, 3, 4, 5."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Quando stanza vale 3, entra nell'if, stampa il messaggio di allarme ed esegue break."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Le stanze 4 e 5 non verranno mai eseguite."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Stanza 1 esplorata con successo.\nStanza 2 esplorata con successo.\nTrappola mortale nella stanza 3! Esplorazione interrotta.";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 46,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "for", "conditions", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "46. L'Istruzione continue: Saltare i Bersagli Invulnerabili",
        icon: "\u23f3",
        xp: 50,
        expectedOutput: "Bersaglio #1 colpito da Fulmine!\nBersaglio #2 colpito da Fulmine!\nBersaglio #4 colpito da Fulmine!\nBersaglio #5 colpito da Fulmine!",
        theory: "\n<p>Mentre <code>break</code> termina completamente il ciclo, l'istruzione <code>continue</code> salta immediatamente al prossimo giro del ciclo, ignorando il resto del codice nell'iterazione corrente.</p>\n<p>È perfetta per saltare elementi non validi: ad esempio, quando una magia ad area d'effetto (AoE) danneggia tutti i nemici, possiamo usare <code>continue</code> se un bersaglio ha lo scudo di invulnerabilità attivo.</p>\n",
        task: "\n<p>Applica un incantesimo di fulmine a una catena di 5 bersagli, saltando il bersaglio numero 3 perché possiede immunità magica.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Itera con <code>for id_bersaglio in range(1, 6):</code>.</li>\n    <li>Se <code>id_bersaglio == 3</code>, esegui <code>continue</code> (salta senza stampare).</li>\n    <li>Altrimenti stampa <code>Bersaglio #X colpito da Fulmine!</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Salta il bersaglio 3 usando continue\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Salta il bersaglio 3 usando continue\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor id_bersaglio in range(1, 6):\n\t\tif id_bersaglio == 3:\n\t\t\tcontinue\n\t\tprint(\"Bersaglio #%d colpito da Fulmine!\" % id_bersaglio)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Quando id_bersaglio è 3, l'istruzione continue passa subito a 4 senza eseguire la print."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "I bersagli 1, 2, 4 e 5 verranno stampati."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "range(1, 6) comprende i numeri da 1 a 5."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Bersaglio #1 colpito da Fulmine!\nBersaglio #2 colpito da Fulmine!\nBersaglio #4 colpito da Fulmine!\nBersaglio #5 colpito da Fulmine!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 47,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "var", "for", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "47. Riepilogo: Calcolo delle Combinazioni di Incantesimi (Fattoriale)",
        icon: "\ud83d\udd0b",
        xp: 50,
        expectedOutput: "Combinazioni rune (5!): 120",
        theory: "\n<p>Il <strong>fattoriale</strong> di un numero $n$ (scritto $n!$) è il prodotto di tutti i numeri interi positivi da $1$ fino a $n$. Ad esempio, per $5$: $5! = 1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5 = 120$.</p>\n<p>Nei giochi di carte o tattici, il fattoriale serve a calcolare le possibili combinazioni o permutazioni dell'ordine di lancio di una mano di incantesimi.</p>\n",
        task: "\n<p>Calcola il numero di combinazioni possibili per lanciare una sequenza di 5 rune magiche ($5!$).</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Inizializza <code>risultato = 1</code>.</li>\n    <li>Usa un ciclo <code>for i in range(1, 6):</code> per moltiplicare <code>risultato *= i</code> a ogni giro.</li>\n    <li>Fuori dal ciclo, stampa: <code>Combinazioni rune (5!): 120</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il fattoriale di 5 con un ciclo for e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il fattoriale di 5 con un ciclo for e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar risultato = 1\n\tfor i in range(1, 6):\n\t\trisultato *= i\n\tprint(\"Combinazioni rune (5!): %d\" % risultato)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "1 * 2 * 3 * 4 * 5 = 120."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inizializza la variabile accumulatore a 1 (non a 0, altrimenti la moltiplicazione darebbe sempre 0!)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il risultato finale fuori dal ciclo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Combinazioni rune (5!): 120";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 48,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "for", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "48. La Funzione range() a Tre Parametri (Inizio, Fine, Passo)",
        icon: "\ud83d\uded1",
        xp: 50,
        expectedOutput: "3\n2\n1\nDecollo!",
        theory: "\n<p>La funzione <code>range()</code> accetta fino a 3 parametri:</p>\n<pre><code class=\"language-gdscript\">range(start, end, step)</code></pre>\n<ul>\n    <li><code>start</code>: Il valore di partenza (incluso).</li>\n    <li><code>end</code>: Il valore di arresto (escluso).</li>\n    <li><code>step</code>: L'incremento a ogni giro. Può anche essere <strong>negativo</strong> per contare all'indietro!</li>\n</ul>\n<p>Esempi:</p>\n<ul>\n    <li><code>range(0, 10, 2)</code> -&gt; <code>[0, 2, 4, 6, 8]</code> (numeri pari)</li>\n    <li><code>range(5, 0, -1)</code> -&gt; <code>[5, 4, 3, 2, 1]</code> (conto alla rovescia)</li>\n</ul>\n",
        task: "\n<p>Implementa il conto alla rovescia di lancio della capsula di salvataggio da 3 a 1, seguito dal decollo.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa <code>for t in range(3, 0, -1):</code> e stampa <code>t</code> a ogni iterazione.</li>\n    <li>Al termine del ciclo, stampa: <code>Decollo!</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il countdown con range decrescente\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il countdown con range decrescente\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor t in range(3, 0, -1):\n\t\tprint(t)\n\tprint(\"Decollo!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "range(3, 0, -1) produce 3, poi 2, poi 1."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Stampa t a ogni ciclo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Fuori dal ciclo stampa \"Decollo!\"."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "3\n2\n1\nDecollo!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 49,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "for", "functions"],
        chapterId: 9,
        isMastery: false,
        title: "49. Cicli Annidati: Scansione Coordinate Griglia 2D (Tilemap)",
        icon: "\u23ed\ufe0f",
        xp: 50,
        expectedOutput: "Cella: (0, 0)\nCella: (1, 0)\nCella: (0, 1)\nCella: (1, 1)",
        theory: "\n<p>Nei giochi in 2D (come giochi di strategia a griglia o roguelike con TileMap), il mondo è organizzato in righe (asse Y) e colonne (asse X). Per scansionare o posizionare celle usiamo un <strong>ciclo annidato</strong> (un for all'interno di un altro for):</p>\n<pre><code class=\"language-gdscript\">for y in range(righe):\n    for x in range(colonne):\n        disegna_tile(x, y)</code></pre>\n<p>Il ciclo interno viene completato interamente per ciascuna iterazione del ciclo esterno.</p>\n",
        task: "\n<p>Genera le coordinate di una mini-griglia 2x2 di stanze di una torre.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa un ciclo esterno <code>for y in range(2):</code>.</li>\n    <li>Usa un ciclo interno <code>for x in range(2):</code>.</li>\n    <li>Stampa: <code>Cella: (X, Y)</code> con le rispettive coordinate.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il doppio ciclo for per scansionare la griglia 2x2\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Implementa il doppio ciclo for per scansionare la griglia 2x2\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor y in range(2):\n\t\tfor x in range(2):\n\t\t\tprint(\"Cella: (%d, %d)\" % [x, y])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Quando y=0, x vale 0 poi 1."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Quando y=1, x vale 0 poi 1."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Presta attenzione al doppio livello di rientro nel ciclo interno."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Cella: (0, 0)\nCella: (1, 0)\nCella: (0, 1)\nCella: (1, 1)";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 50,
        conceptId: "loops_iteration",
        conceptTags: ["loops_iteration", "ch9", "print", "var", "for", "conditions", "functions"],
        chapterId: 9,
        isMastery: true,
        title: "50. Riepilogo: Raccolta Monete con Salto Multiplo",
        icon: "\ud83c\udf96\ufe0f",
        xp: 75,
        expectedOutput: "Oro speciale raccolto: 82",
        theory: "\n<p>Combiniamo cicli e condizioni per sommare solo le monete di valore elevato trovate lungo il percorso.</p>\n",
        task: "\n<p>Calcola il totale delle monete speciali (solo i valori maggiori di 10) in una sequenza predefinita.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Sequenza monete: <code>[5, 20, 8, 50, 12]</code>.</li>\n    <li>Itera con <code>for val in [5, 20, 8, 50, 12]:</code>.</li>\n    <li>Se <code>val &gt; 10</code>, aggiungilo a <code>oro_totale</code>.</li>\n    <li>Al termine del ciclo, stampa: <code>Oro speciale raccolto: 82</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera sulla lista e somma solo i valori > 10\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera sulla lista e somma solo i valori > 10\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar oro_totale = 0\n\tfor val in [5, 20, 8, 50, 12]:\n\t\tif val > 10:\n\t\t\toro_totale += val\n\tprint(\"Oro speciale raccolto: %d\" % oro_totale)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "I valori > 10 sono 20, 50 e 12."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "20 + 50 + 12 = 82."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il risultato finale fuori dal ciclo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Oro speciale raccolto: 82";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 51,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "51. Dichiarare una Funzione Personalizzata (func)",
        icon: "\u2699\ufe0f",
        xp: 50,
        expectedOutput: "ATTENZIONE: Il Drago Antico si è risvegliato!",
        theory: "\n<p>Le <strong>funzioni</strong> sono blocchi di codice riutilizzabili a cui diamo un nome. Permettono di evitare duplicazioni, rendono il progetto ordinato e facilitano la manutenzione.</p>\n<p>In GDScript una funzione si dichiara con la parola chiave <code>func</code>:</p>\n<pre><code class=\"language-gdscript\">func emetti_suono_vittoria():\n    print(\"Fanfara di trionfo!\")</code></pre>\n<p>Una funzione non viene eseguita finché non viene esplicitamente <strong>chiamata</strong> invocando il suo nome seguito da parentesi tonde: <code>emetti_suono_vittoria()</code>.</p>\n",
        task: "\n<p>Crea e richiama una funzione che stampa l'avviso di boss imminente.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Definisci una funzione <code>func annuncia_boss():</code> che stampa <code>ATTENZIONE: Il Drago Antico si è risvegliato!</code>.</li>\n    <li>All'interno di <code>_ready()</code>, chiama la funzione <code>annuncia_boss()</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama la funzione annuncia_boss\n\tpass\n\n# TODO: Dichiara qui la funzione annuncia_boss\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama la funzione annuncia_boss\n\tpass\n\n# TODO: Dichiara qui la funzione annuncia_boss\n",
        solution: "extends Node\n\nfunc _ready():\n\tannuncia_boss()\n\nfunc annuncia_boss():\n\tprint(\"ATTENZIONE: Il Drago Antico si è risvegliato!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Definisci la funzione con func annuncia_boss():"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non dimenticare di chiamare annuncia_boss() dentro _ready()."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il corpo della funzione deve essere indentato con un Tab."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "ATTENZIONE: Il Drago Antico si è risvegliato!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 52,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "52. Parametri e Argomenti: Funzione di Attacco Dinamico",
        icon: "\ud83c\udff9",
        xp: 50,
        expectedOutput: "Aria recupera 30 HP!",
        theory: "\n<p>Le funzioni diventano estremamente potenti quando accettano <strong>parametri</strong> (argomenti). I parametri sono variabili di input che passiamo alla funzione quando la chiamiamo, consentendole di operare su dati diversi:</p>\n<pre><code class=\"language-gdscript\">func infliggi_danno(bersaglio: String, quantita: int):\n    print(bersaglio, \"ha subito\", quantita, \"danni!\")</code></pre>\n<p>Chiamata: <code>infliggi_danno(\"Orco\", 40)</code>.</p>\n",
        task: "\n<p>Crea una funzione di cura che accetta il nome del personaggio e i punti ferita ripristinati.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea la funzione <code>func cura_alleato(nome, hp_curati):</code> che stampa: <code>X recupera Y HP!</code></li>\n    <li>In <code>_ready()</code>, chiama la funzione con <code>cura_alleato(\"Aria\", 30)</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama cura_alleato con i dati dell'avventuriero\n\tpass\n\n# TODO: Dichiara func cura_alleato(nome, hp_curati)\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama cura_alleato con i dati dell'avventuriero\n\tpass\n\n# TODO: Dichiara func cura_alleato(nome, hp_curati)\n",
        solution: "extends Node\n\nfunc _ready():\n\tcura_alleato(\"Aria\", 30)\n\nfunc cura_alleato(nome, hp_curati):\n\tprint(\"%s recupera %d HP!\" % [nome, hp_curati])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La funzione accetta due parametri: nome e hp_curati."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa i segnaposto o la concatenazione per stampare 'Aria recupera 30 HP!'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Invocala con gli argomenti (\"Aria\", 30)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Aria recupera 30 HP!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 53,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "var", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "53. L'Istruzione return: Calcolo e Restituzione di Valori",
        icon: "\ud83c\udf81",
        xp: 50,
        expectedOutput: "90",
        theory: "\n<p>Spesso non vogliamo che una funzione si limiti a stampare qualcosa, ma vogliamo che esegua un calcolo e <strong>restituisca il risultato</strong> a chi l'ha chiamata. Per fare questo usiamo la parola chiave <code>return</code>:</p>\n<pre><code class=\"language-gdscript\">func moltiplica_danno(base: int, bonus: int):\n    return base * bonus</code></pre>\n<p>Il valore restituito può essere assegnato a una variabile o usato in altre espressioni: <code>var totale = moltiplica_danno(10, 3)</code>.</p>\n<p>Non appena viene incontrato <code>return</code>, la funzione termina immediatamente la sua esecuzione.</p>\n",
        task: "\n<p>Crea una funzione che calcola il danno critico raddoppiato e restituisce il valore.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Definisci <code>func calcola_critico(danno_base):</code> che restituisce <code>danno_base * 2</code>.</li>\n    <li>In <code>_ready()</code>, chiama <code>calcola_critico(45)</code>, salva il valore restituito in <code>danno_finale</code> e stampalo.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama calcola_critico(45) e stampa il risultato restituito\n\tpass\n\n# TODO: Dichiara func calcola_critico(danno_base)\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama calcola_critico(45) e stampa il risultato restituito\n\tpass\n\n# TODO: Dichiara func calcola_critico(danno_base)\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar danno_finale = calcola_critico(45)\n\tprint(danno_finale)\n\nfunc calcola_critico(danno_base):\n\treturn danno_base * 2\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "45 * 2 = 90."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa return danno_base * 2 all'interno della funzione."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Salva il risultato in danno_finale e stampalo con print(danno_finale)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "90";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 54,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "var", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "54. Tipizzazione Statica dei Parametri e del Valore di Ritorno (->)",
        icon: "\ud83e\uddea",
        xp: 50,
        expectedOutput: "false",
        theory: "\n<p>In Godot 4 possiamo applicare la tipizzazione statica completa anche alle funzioni, specificando sia il tipo di ogni parametro che il tipo del valore restituito con la freccia <code>-&gt;</code>:</p>\n<pre><code class=\"language-gdscript\">func calcola_velocita(distanza: float, tempo: float) -> float:\n    return distanza / tempo</code></pre>\n<p>Se una funzione non restituisce alcun valore (funzione vuota o con sole azioni), possiamo specificare <code>-&gt; void</code>:</p>\n<pre><code class=\"language-gdscript\">func riproduci_suono() -> void:\n    # Azione senza return</code></pre>\n<p>Questo permette a Godot di verificare a monte la correttezza del codice ed evitare bug catastrofici in fase di release.</p>\n",
        task: "\n<p>Crea una funzione tipizzata che verifica se un personaggio è vivo.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Definisci <code>func is_personaggio_vivo(hp_attuali: int) -&gt; bool:</code> che restituisce <code>hp_attuali &gt; 0</code>.</li>\n    <li>In <code>_ready()</code>, verifica lo stato di un eroe con <code>0</code> HP invocando <code>is_personaggio_vivo(0)</code> e stampa il risultato booleano.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama la funzione tipizzata e stampa il booleano restituito\n\tpass\n\n# TODO: Dichiara func is_personaggio_vivo(hp_attuali: int) -> bool:\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama la funzione tipizzata e stampa il booleano restituito\n\tpass\n\n# TODO: Dichiara func is_personaggio_vivo(hp_attuali: int) -> bool:\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar vivo: bool = is_personaggio_vivo(0)\n\tprint(vivo)\n\nfunc is_personaggio_vivo(hp_attuali: int) -> bool:\n\treturn hp_attuali > 0\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "0 > 0 è falso, quindi restituisce false."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa la sintassi con la freccia: -> bool:"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile risultante."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "false";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 55,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "var", "for", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "55. Riepilogo: Funzione di Accumulo Punti Esperienza (Sommatoria)",
        icon: "\ud83d\udd2e",
        xp: 50,
        expectedOutput: "XP richiesti per livello 4: 10",
        theory: "\n<p>La funzione di sommatoria matematica (Sigma $\\sum_{i=1}^n i$) calcola la somma di tutti gli interi fino a $n$. Nei videogiochi, questa formula è impiegata per calcolare i punti esperienza totali richiesti per raggiungere il livello $n$:</p>\n<p>Livello 1: 1 XP, Livello 2: 1+2=3 XP, Livello 3: 1+2+3=6 XP, Livello 4: 1+2+3+4=10 XP.</p>\n",
        task: "\n<p>Crea una funzione che calcola i punti esperienza complessivi necessari per il livello desiderato.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea <code>func calcola_xp_totali(livello: int) -&gt; int:</code>.</li>\n    <li>Usa un ciclo <code>for i in range(1, livello + 1):</code> sommando a una variabile <code>totale</code> e restituisci <code>totale</code>.</li>\n    <li>In <code>_ready()</code>, chiama <code>calcola_xp_totali(4)</code> e stampa: <code>XP richiesti per livello 4: 10</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola gli XP totali e stampa il messaggio\n\tpass\n\n# TODO: Definisci func calcola_xp_totali(livello: int) -> int:\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola gli XP totali e stampa il messaggio\n\tpass\n\n# TODO: Definisci func calcola_xp_totali(livello: int) -> int:\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar xp_richiesti = calcola_xp_totali(4)\n\tprint(\"XP richiesti per livello 4: %d\" % xp_richiesti)\n\nfunc calcola_xp_totali(livello: int) -> int:\n\tvar totale = 0\n\tfor i in range(1, livello + 1):\n\t\ttotale += i\n\treturn totale\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "1 + 2 + 3 + 4 = 10."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "range(1, livello + 1) include il valore di 'livello'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Formatta la stampa finale come richiesto."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "XP richiesti per livello 4: 10";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 56,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "var", "conditions", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "56. Riepilogo: Validazione del Limite di Punti Vita (Clamp)",
        icon: "\ud83e\uddee",
        xp: 50,
        expectedOutput: "0",
        theory: "\n<p>In game design una regola ferrea è che i punti vita non possono mai scendere sotto zero né superare il valore massimo consentito. Questa operazione si chiama <strong>clamping</strong> (limitazione).</p>\n<p>Possiamo creare una funzione di validazione che riceve il valore proposto e restituisce il valore corretto entro i limiti stabiliti.</p>\n",
        task: "\n<p>Implementa una funzione che limita i punti vita tra 0 e il massimo consentito.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea <code>func limita_hp(valore: int, max_hp: int) -&gt; int:</code>:</li>\n    <li>Se <code>valore &lt; 0</code> restituisce <code>0</code>.</li>\n    <li>Se <code>valore &gt; max_hp</code> restituisce <code>max_hp</code>.</li>\n    <li>Altrimenti restituisce <code>valore</code>.</li>\n    <li>In <code>_ready()</code>, testa il caso di un danno eccessivo chiamando <code>limita_hp(-25, 100)</code> e stampa il valore restituito.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Testa la funzione limita_hp con -25 e stampa il risultato\n\tpass\n\n# TODO: Dichiara func limita_hp(valore: int, max_hp: int) -> int:\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Testa la funzione limita_hp con -25 e stampa il risultato\n\tpass\n\n# TODO: Dichiara func limita_hp(valore: int, max_hp: int) -> int:\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar hp_sicuri = limita_hp(-25, 100)\n\tprint(hp_sicuri)\n\nfunc limita_hp(valore: int, max_hp: int) -> int:\n\tif valore < 0:\n\t\treturn 0\n\telif valore > max_hp:\n\t\treturn max_hp\n\treturn valore\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Poiché -25 è minore di 0, la funzione restituisce 0."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Questo impedisce ai punti vita di diventare numeri negativi."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile hp_sicuri."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "0";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 57,
        conceptId: "functions_scope",
        conceptTags: ["functions_scope", "ch10", "print", "functions"],
        chapterId: 10,
        isMastery: true,
        title: "57. Parametri Predefiniti (Default Arguments) per le Magie",
        icon: "\ud83c\udf1f",
        xp: 75,
        expectedOutput: "Sparo con arma: Fucile Plasma | Munizione: Standard",
        theory: "\n<p>GDScript consente di assegnare <strong>valori predefiniti</strong> ai parametri delle funzioni. Se il chiamante omette quell'argomento durante la chiamata, verrà utilizzato automaticamente il valore di default impostato:</p>\n<pre><code class=\"language-gdscript\">func lancia_dardo(elemento: String = \"Fuoco\", potenza: int = 10):\n    print(\"Dardo di\", elemento, \"con potenza\", potenza)</code></pre>\n<p>Possiamo chiamarla specificando entrambi gli argomenti (<code>lancia_dardo(\"Ghiaccio\", 20)</code>) oppure omettendoli (<code>lancia_dardo()</code> userà <code>\"Fuoco\"</code> e <code>10</code>).</p>\n<p><strong>Regola:</strong> i parametri con valore predefinito devono essere posizionati sempre <em>dopo</em> quelli obbligatori senza valore predefinito.</p>\n",
        task: "\n<p>Crea una funzione di sparo con cadenza e tipo di munizione predefiniti.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea <code>func spara_arma(arma: String, munizione: String = \"Standard\"):</code> che stampa <code>Sparo con arma: X | Munizione: Y</code>.</li>\n    <li>In <code>_ready()</code>, chiama <code>spara_arma(\"Fucile Plasma\")</code> senza passare il secondo parametro.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama spara_arma usando il valore di default per la munizione\n\tpass\n\n# TODO: Dichiara func spara_arma(arma: String, munizione: String = \"Standard\"):\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Chiama spara_arma usando il valore di default per la munizione\n\tpass\n\n# TODO: Dichiara func spara_arma(arma: String, munizione: String = \"Standard\"):\n",
        solution: "extends Node\n\nfunc _ready():\n\tspara_arma(\"Fucile Plasma\")\n\nfunc spara_arma(arma: String, munizione: String = \"Standard\"):\n\tprint(\"Sparo con arma: %s | Munizione: %s\" % [arma, munizione])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Il parametro munizione riceve il valore predefinito \"Standard\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non passando il secondo argomento a spara_arma, verrà usato quello di default."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la stringa formattata con arma e munizione."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Sparo con arma: Fucile Plasma | Munizione: Standard";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 58,
        conceptId: "project_fizzbuzz",
        conceptTags: ["project_fizzbuzz", "ch11", "print", "functions"],
        chapterId: 11,
        isMastery: false,
        title: "58. Progetto ManaBurst (1/4): Panoramica dell'Antico Rituale",
        icon: "\ud83c\udfaf",
        xp: 75,
        expectedOutput: "=== RITUALE ARCANO: MANABURST ===\nIncanalamento frequenze runiche in corso...",
        theory: "\n<p>Benvenuto nella sfida logica <strong>ManaBurst</strong>, una rivisitazione creativa per il game development del celebre algoritmo di programmazione <em>FizzBuzz</em>!</p>\n<p>Nella tradizione magica del nostro gioco, i maghi dell'Accademia incanalano il flusso arcano attraverso una sequenza di numeri runici:</p>\n<ul>\n    <li>Se il numero è divisibile per <strong>3</strong>, la runa pulsa di energia: <code>\"Mana\"</code>.</li>\n    <li>Se il numero è divisibile per <strong>5</strong>, la runa esplode di potenza: <code>\"Burst\"</code>.</li>\n    <li>Se il numero è divisibile per <strong>sia per 3 che per 5</strong> (15), si genera la fusione suprema: <code>\"ManaBurst!\"</code>.</li>\n    <li>Altrimenti, la runa emette semplicemente il proprio numero.</li>\n</ul>\n",
        task: "\n<p>Stampa il banner di avvio del rituale arcano.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Stampa: <code>=== RITUALE ARCANO: MANABURST ===</code></li>\n    <li>Stampa sulla seconda riga: <code>Incanalamento frequenze runiche in corso...</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa l'introduzione del rituale ManaBurst\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa l'introduzione del rituale ManaBurst\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"=== RITUALE ARCANO: MANABURST ===\")\n\tprint(\"Incanalamento frequenze runiche in corso...\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa due istruzioni print() consecutive."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Presta attenzione alle maiuscole e ai caratteri === nel titolo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Verifica i tre puntini di sospensione alla fine."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "=== RITUALE ARCANO: MANABURST ===\nIncanalamento frequenze runiche in corso...";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 59,
        conceptId: "project_fizzbuzz",
        conceptTags: ["project_fizzbuzz", "ch11", "print", "var", "conditions", "functions"],
        chapterId: 11,
        isMastery: false,
        title: "59. Progetto ManaBurst (2/4): La Funzione di Risonanza Runiche",
        icon: "\u2728",
        xp: 75,
        expectedOutput: "ManaBurst!",
        theory: "\n<p>Scriviamo la funzione centrale <code>risolvi_runa(n: int) -&gt; String</code>. La chiave per risolvere questo problema è controllare la condizione più restrittiva <strong>prima</strong> delle altre:</p>\n<p>Se controllassimo prima la divisibilità per 3, un numero come 15 verrebbe etichettato come \"Mana\" anziché come \"ManaBurst!\". Dobbiamo quindi verificare la divisibilità per 15 (o per 3 AND 5) come primo controllo <code>if</code>!</p>\n",
        task: "\n<p>Crea la funzione logica e testala sul numero 15.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Crea <code>func risolvi_runa(n: int) -&gt; String:</code>:</li>\n    <li>Se <code>n % 3 == 0 and n % 5 == 0</code>: restituisce <code>\"ManaBurst!\"</code>.</li>\n    <li>Altrimenti se <code>n % 3 == 0</code>: restituisce <code>\"Mana\"</code>.</li>\n    <li>Altrimenti se <code>n % 5 == 0</code>: restituisce <code>\"Burst\"</code>.</li>\n    <li>Altrimenti: restituisce <code>str(n)</code>.</li>\n    <li>In <code>_ready()</code>, chiama <code>risolvi_runa(15)</code> e stampa il risultato restituito.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Testa risolvi_runa sul valore 15 e stampa il risultato\n\tpass\n\n# TODO: Dichiara func risolvi_runa(n: int) -> String:\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Testa risolvi_runa sul valore 15 e stampa il risultato\n\tpass\n\n# TODO: Dichiara func risolvi_runa(n: int) -> String:\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar esito = risolvi_runa(15)\n\tprint(esito)\n\nfunc risolvi_runa(n: int) -> String:\n\tif n % 3 == 0 and n % 5 == 0:\n\t\treturn \"ManaBurst!\"\n\telif n % 3 == 0:\n\t\treturn \"Mana\"\n\telif n % 5 == 0:\n\t\treturn \"Burst\"\n\treturn str(n)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "15 è divisibile sia per 3 che per 5."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Il primo if intercetta 15 e restituisce immediatamente 'ManaBurst!'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la variabile esito."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "ManaBurst!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 60,
        conceptId: "project_fizzbuzz",
        conceptTags: ["project_fizzbuzz", "ch11", "print", "for", "conditions", "functions"],
        chapterId: 11,
        isMastery: false,
        title: "60. Progetto ManaBurst (3/4): Iterazione della Sequenza Runiche (1..15)",
        icon: "\ud83d\udca5",
        xp: 75,
        expectedOutput: "1\n2\nMana\n4\nBurst\nMana",
        theory: "\n<p>Ora colleghiamo la funzione a un ciclo per generare l'intera sequenza di risonanza delle rune per i primi 15 livelli di potere.</p>\n",
        task: "\n<p>Genera la sequenza di rune da 1 a 6 stampando il risultato di ciascuna.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa la funzione <code>risolvi_runa(n)</code> sviluppata nel passaggio precedente.</li>\n    <li>In <code>_ready()</code>, esegui un ciclo <code>for i in range(1, 7):</code> (da 1 a 6).</li>\n    <li>A ogni giro, stampa il valore restituito da <code>risolvi_runa(i)</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera da 1 a 6 e stampa il risultato di ciascuna runa\n\tpass\n\nfunc risolvi_runa(n: int) -> String:\n\tif n % 3 == 0 and n % 5 == 0:\n\t\treturn \"ManaBurst!\"\n\telif n % 3 == 0:\n\t\treturn \"Mana\"\n\telif n % 5 == 0:\n\t\treturn \"Burst\"\n\treturn str(n)\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera da 1 a 6 e stampa il risultato di ciascuna runa\n\tpass\n\nfunc risolvi_runa(n: int) -> String:\n\tif n % 3 == 0 and n % 5 == 0:\n\t\treturn \"ManaBurst!\"\n\telif n % 3 == 0:\n\t\treturn \"Mana\"\n\telif n % 5 == 0:\n\t\treturn \"Burst\"\n\treturn str(n)\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor i in range(1, 7):\n\t\tprint(risolvi_runa(i))\n\nfunc risolvi_runa(n: int) -> String:\n\tif n % 3 == 0 and n % 5 == 0:\n\t\treturn \"ManaBurst!\"\n\telif n % 3 == 0:\n\t\treturn \"Mana\"\n\telif n % 5 == 0:\n\t\treturn \"Burst\"\n\treturn str(n)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "1 -> \"1\", 2 -> \"2\", 3 -> \"Mana\", 4 -> \"4\", 5 -> \"Burst\", 6 -> \"Mana\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "range(1, 7) comprende i numeri da 1 a 6."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa print(risolvi_runa(i)) dentro il ciclo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "1\n2\nMana\n4\nBurst\nMana";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 61,
        conceptId: "project_fizzbuzz",
        conceptTags: ["project_fizzbuzz", "ch11", "print", "var", "conditions", "functions"],
        chapterId: 11,
        isMastery: true,
        title: "61. Progetto ManaBurst (4/4): La Variante Divina (Numero 7)",
        icon: "\ud83c\udfc6",
        xp: 75,
        expectedOutput: "Solar\nManaSolar",
        theory: "\n<p>Nel quarto e ultimo passo aggiungiamo la variante speciale: il numero sacro <strong>7</strong> dei sacerdoti della luce! Se un numero è divisibile per 7, aggiungiamo la parola <code>\"Solar\"</code> alla formula.</p>\n<p>Componendo stringhe in modo modulare (anziché usare decine di if/elif rigidi), possiamo costruire pattern complessi ed estendibili con facilità!</p>\n",
        task: "\n<p>Implementa la variante solare per il rituale.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Se il numero è <code>7</code> restituisce <code>\"Solar\"</code>.</li>\n    <li>Se è <code>21</code> (divisibile sia per 3 che per 7) restituisce <code>\"ManaSolar\"</code>.</li>\n    <li>Testa la funzione richiamandola su <code>7</code> e poi su <code>21</code> e stampando i due risultati su righe separate.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa i risultati di risolvi_variante per 7 e 21\n\tpass\n\nfunc risolvi_variante(n: int) -> String:\n\tvar res = \"\"\n\tif n % 3 == 0:\n\t\tres += \"Mana\"\n\tif n % 5 == 0:\n\t\tres += \"Burst\"\n\tif n % 7 == 0:\n\t\tres += \"Solar\"\n\tif res == \"\":\n\t\tres = str(n)\n\treturn res\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa i risultati di risolvi_variante per 7 e 21\n\tpass\n\nfunc risolvi_variante(n: int) -> String:\n\tvar res = \"\"\n\tif n % 3 == 0:\n\t\tres += \"Mana\"\n\tif n % 5 == 0:\n\t\tres += \"Burst\"\n\tif n % 7 == 0:\n\t\tres += \"Solar\"\n\tif res == \"\":\n\t\tres = str(n)\n\treturn res\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(risolvi_variante(7))\n\tprint(risolvi_variante(21))\n\nfunc risolvi_variante(n: int) -> String:\n\tvar res = \"\"\n\tif n % 3 == 0:\n\t\tres += \"Mana\"\n\tif n % 5 == 0:\n\t\tres += \"Burst\"\n\tif n % 7 == 0:\n\t\tres += \"Solar\"\n\tif res == \"\":\n\t\tres = str(n)\n\treturn res\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Per 7: solo n % 7 == 0 è vero -> res diventa \"Solar\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Per 21: n % 3 == 0 (Mana) e n % 7 == 0 (Solar) -> \"ManaSolar\"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa ciascun risultato con una chiamata a print()."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Solar\nManaSolar";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 62,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "functions"],
        chapterId: 12,
        isMastery: false,
        title: "62. Dichiarare un Array: La Cintura degli Oggetti Rapidi",
        icon: "\ud83c\udf92",
        xp: 50,
        expectedOutput: "[\"Shuriken\", \"Kunai\", \"Fumogeno\"]",
        theory: "\n<p>Un <strong>Array</strong> è una collezione ordinata di elementi racchiusi tra parentesi quadre <code>[...]</code> e separati da virgole. Nei videogiochi, gli array sono il cuore di barre rapide, code di dialoghi, elenchi di bersagli e liste di nemici attivi.</p>\n<pre><code class=\"language-gdscript\">var cintura_rapida = [\"Pozione HP\", \"Bomba di Fuoco\", \"Antidoto\"]\nprint(cintura_rapida)</code></pre>\n<p>In GDScript gli array non hanno dimensione fissa: possono crescere o rimpicciolirsi dinamicamente durante il gioco.</p>\n",
        task: "\n<p>Crea l'inventario rapido delle armi da lancio del ninja.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara una variabile <code>armi_rapide = [\"Shuriken\", \"Kunai\", \"Fumogeno\"]</code>.</li>\n    <li>Stampa l'intero array usando <code>print(armi_rapide)</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara l'array delle armi e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara l'array delle armi e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar armi_rapide = [\"Shuriken\", \"Kunai\", \"Fumogeno\"]\n\tprint(armi_rapide)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa le parentesi quadre [...] e separa gli elementi con virgole."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Ciascun elemento è una stringa racchiusa tra virgolette."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa l'array direttamente con print(armi_rapide)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[\"Shuriken\", \"Kunai\", \"Fumogeno\"]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 63,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "functions"],
        chapterId: 12,
        isMastery: false,
        title: "63. Accesso agli Elementi con Indici e Indici Negativi",
        icon: "\ud83d\udccd",
        xp: 50,
        expectedOutput: "Spada Lunga\nDaga Spuntata",
        theory: "\n<p>Gli elementi di un array sono indicizzati a partire da <strong>zero</strong> (0-based indexing):</p>\n<ul>\n    <li><code>array[0]</code> restituisce il primo elemento.</li>\n    <li><code>array[1]</code> restituisce il secondo elemento.</li>\n</ul>\n<p>GDScript supporta anche gli <strong>indici negativi</strong>, comodissimi per accedere agli elementi dalla fine dell'array:</p>\n<ul>\n    <li><code>array[-1]</code> restituisce l'ultimo elemento.</li>\n    <li><code>array[-2]</code> restituisce il penultimo elemento.</li>\n</ul>\n",
        task: "\n<p>Recupera la prima arma principale e l'arma di riserva (l'ultima della lista).</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato l'array <code>armi = [\"Spada Lunga\", \"Arco Composito\", \"Daga Spuntata\"]</code>:</li>\n    <li>Stampa il primo elemento usando l'indice <code>0</code>: <code>Spada Lunga</code>.</li>\n    <li>Stampa l'ultimo elemento usando l'indice negativo <code>-1</code>: <code>Daga Spuntata</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar armi = [\"Spada Lunga\", \"Arco Composito\", \"Daga Spuntata\"]\n\t# TODO: Stampa il primo elemento con [0] e l'ultimo con [-1]\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar armi = [\"Spada Lunga\", \"Arco Composito\", \"Daga Spuntata\"]\n\t# TODO: Stampa il primo elemento con [0] e l'ultimo con [-1]\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar armi = [\"Spada Lunga\", \"Arco Composito\", \"Daga Spuntata\"]\n\tprint(armi[0])\n\tprint(armi[-1])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "armi[0] accede al primo elemento ('Spada Lunga')."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "armi[-1] accede all'ultimo elemento ('Daga Spuntata')."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Usa due istruzioni print() separate."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Spada Lunga\nDaga Spuntata";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 64,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "functions"],
        chapterId: 12,
        isMastery: false,
        title: "64. Modifica degli Elementi dell'Array in Memoria",
        icon: "\ud83d\udd19",
        xp: 50,
        expectedOutput: "[\"Scudo di Legno\", \"Spada d'Acciaio +1\", \"Stivali\"]",
        theory: "\n<p>Gli array in GDScript sono <strong>mutabili</strong>. Possiamo aggiornare un valore presente a un indice specifico semplicemente riassegnandolo con l'operatore <code>=</code>:</p>\n<pre><code class=\"language-gdscript\">var pozioni = [\"Minore\", \"Minore\", \"Minore\"]\npozioni[1] = \"Super Pozione\" # Aggiorna il secondo elemento</code></pre>\n",
        task: "\n<p>Il fabbro ha potenziato la spada dell'eroe. Sostituisci l'arma arrugginita con la versione forgiata.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>equipaggiamento = [\"Scudo di Legno\", \"Spada Arrugginita\", \"Stivali\"]</code>:</li>\n    <li>Modifica l'elemento all'indice <code>1</code> sostituendolo con <code>\"Spada d'Acciaio +1\"</code>.</li>\n    <li>Stampa l'array modificato.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar equipaggiamento = [\"Scudo di Legno\", \"Spada Arrugginita\", \"Stivali\"]\n\t# TODO: Sostituisci l'arma all'indice 1 e stampa l'array\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar equipaggiamento = [\"Scudo di Legno\", \"Spada Arrugginita\", \"Stivali\"]\n\t# TODO: Sostituisci l'arma all'indice 1 e stampa l'array\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar equipaggiamento = [\"Scudo di Legno\", \"Spada Arrugginita\", \"Stivali\"]\n\tequipaggiamento[1] = \"Spada d'Acciaio +1\"\n\tprint(equipaggiamento)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "L'indice 1 punta a \"Spada Arrugginita\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Assegna: equipaggiamento[1] = \"Spada d'Acciaio +1\"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa l'array con print(equipaggiamento)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[\"Scudo di Legno\", \"Spada d'Acciaio +1\", \"Stivali\"]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 65,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "functions"],
        chapterId: 12,
        isMastery: false,
        title: "65. Metodi Fondamentali degli Array: append, pop_back, size",
        icon: "\u2795",
        xp: 50,
        expectedOutput: "[\"Mappa\", \"Bussola\", \"Amuleto Antico\"]\n3",
        theory: "\n<p>La classe <code>Array</code> di Godot fornisce metodi potenti per gestire gli elementi:</p>\n<ul>\n    <li><code>append(valore)</code>: Aggiunge un elemento in coda all'array.</li>\n    <li><code>pop_back()</code>: Rimuove e restituisce l'ultimo elemento della coda.</li>\n    <li><code>size()</code>: Restituisce il numero totale di elementi contenuti nell'array.</li>\n    <li><code>clear()</code>: Svuota completamente l'array.</li>\n</ul>\n<pre><code class=\"language-gdscript\">var loot = []\nloot.append(\"Gemma Rossa\")\nprint(\"Oggetti raccolti:\", loot.size())</code></pre>\n",
        task: "\n<p>Raccogli un manufatto raro nel baule e verifica la capienza dell'inventario.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Inizializza <code>zaino = [\"Mappa\", \"Bussola\"]</code>.</li>\n    <li>Aggiungi <code>\"Amuleto Antico\"</code> usando <code>zaino.append(\"Amuleto Antico\")</code>.</li>\n    <li>Stampa l'array <code>zaino</code>.</li>\n    <li>Stampa sulla seconda riga il numero totale di oggetti usando <code>zaino.size()</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar zaino = [\"Mappa\", \"Bussola\"]\n\t# TODO: Aggiungi l'amuleto con append, stampa l'array e poi la sua dimensione\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar zaino = [\"Mappa\", \"Bussola\"]\n\t# TODO: Aggiungi l'amuleto con append, stampa l'array e poi la sua dimensione\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar zaino = [\"Mappa\", \"Bussola\"]\n\tzaino.append(\"Amuleto Antico\")\n\tprint(zaino)\n\tprint(zaino.size())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa il metodo zaino.append(\"Amuleto Antico\")."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Stampa l'array aggiornato con print(zaino)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la lunghezza con print(zaino.size())."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[\"Mappa\", \"Bussola\", \"Amuleto Antico\"]\n3";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 66,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "for", "functions"],
        chapterId: 12,
        isMastery: false,
        title: "66. Riepilogo: Calcolo del Moltiplicatore di Combo a Catena",
        icon: "\ud83d\udccf",
        xp: 50,
        expectedOutput: "Moltiplicatore combo finale: 12x",
        theory: "\n<p>Quando esegui una combo di attacchi in rapida successione, molti giochi moltiplicano i coefficienti di danno dei singoli colpi. Possiamo scorrere un array di numeri e calcolarne il prodotto cumulativo.</p>\n",
        task: "\n<p>Calcola il moltiplicatore totale ottenuto da una serie di colpi critici concatenati.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato l'array moltiplicatori: <code>[2, 3, 2]</code>.</li>\n    <li>Inizializza <code>prodotto = 1</code>.</li>\n    <li>Scorri l'array con un ciclo <code>for m in [2, 3, 2]:</code> moltiplicando <code>prodotto *= m</code>.</li>\n    <li>Stampa: <code>Moltiplicatore combo finale: 12x</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il prodotto cumulativo della sequenza e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Calcola il prodotto cumulativo della sequenza e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar moltiplicatori = [2, 3, 2]\n\tvar prodotto = 1\n\tfor m in moltiplicatori:\n\t\tprodotto *= m\n\tprint(\"Moltiplicatore combo finale: %dx\" % prodotto)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "2 * 3 * 2 = 12."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inizializza prodotto a 1."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Formatta con %dx o componi con stringhe."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Moltiplicatore combo finale: 12x";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 67,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "functions"],
        chapterId: 12,
        isMastery: false,
        title: "67. Riepilogo: Inversione del Registro delle Azioni",
        icon: "\ud83d\udce6",
        xp: 50,
        expectedOutput: "[\"Ovest\", \"Nord\", \"Est\", \"Nord\"]",
        theory: "\n<p>Il metodo <code>reverse()</code> modifica l'array sul posto invertendo l'ordine dei suoi elementi. È perfetto per implementare cronologie di azioni (Undo), riprodurre all'indietro percorsi di pattuglia o mostrare i replay.</p>\n",
        task: "\n<p>Inverti il registro dei passi dell'eroe nel labirinto per calcolare la via del ritorno.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>passi = [\"Nord\", \"Est\", \"Nord\", \"Ovest\"]</code>.</li>\n    <li>Inverti l'ordine usando <code>passi.reverse()</code>.</li>\n    <li>Stampa l'array invertito.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar passi = [\"Nord\", \"Est\", \"Nord\", \"Ovest\"]\n\t# TODO: Inverti l'array con reverse() e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar passi = [\"Nord\", \"Est\", \"Nord\", \"Ovest\"]\n\t# TODO: Inverti l'array con reverse() e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar passi = [\"Nord\", \"Est\", \"Nord\", \"Ovest\"]\n\tpassi.reverse()\n\tprint(passi)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "passi.reverse() non restituisce un nuovo array, modifica direttamente l'array originale."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Chiamalo su una riga da solo: passi.reverse()."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Poi stampa passi."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[\"Ovest\", \"Nord\", \"Est\", \"Nord\"]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 68,
        conceptId: "arrays_basics",
        conceptTags: ["arrays_basics", "ch12", "print", "var", "functions"],
        chapterId: 12,
        isMastery: true,
        title: "68. Array Tipizzati in Godot 4: Array[String] e Array[int]",
        icon: "\ud83d\udee1\ufe0f",
        xp: 75,
        expectedOutput: "[101, 102, 105, 110]",
        theory: "\n<p>Una delle novità più apprezzate di <strong>Godot 4</strong> sono gli <strong>Array Tipizzati</strong>! Puoi definire esattamente quale tipo di dati è ammesso all'interno dell'array:</p>\n<pre><code class=\"language-gdscript\">var nemici: Array[String] = [\"Slime\", \"Goblin\"]\nvar danni: Array[int] = [15, 25, 40]</code></pre>\n<p>Se qualcuno tenta di aggiungere un tipo errato (es. inserire un numero dentro <code>Array[String]</code>), Godot solleva immediatamente un errore prima che il gioco subisca un crash inaspettato. Inoltre, gli array tipizzati sono più veloci in memoria!</p>\n",
        task: "\n<p>Dichiara un array tipizzato di identificativi ID delle missioni completate.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara una variabile tipizzata <code>missioni_completate: Array[int] = [101, 102, 105]</code>.</li>\n    <li>Aggiungi la missione <code>110</code> usando <code>missioni_completate.append(110)</code>.</li>\n    <li>Stampa l'array tipizzato.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara l'array tipizzato Array[int], aggiungi 110 e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara l'array tipizzato Array[int], aggiungi 110 e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar missioni_completate: Array[int] = [101, 102, 105]\n\tmissioni_completate.append(110)\n\tprint(missioni_completate)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa la sintassi esplicita: var nome: Array[int] = [...]"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa append() per aggiungere l'intero 110."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa l'array con print(missioni_completate)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[101, 102, 105, 110]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 69,
        conceptId: "collection_iteration",
        conceptTags: ["collection_iteration", "ch13", "print", "var", "for", "functions"],
        chapterId: 13,
        isMastery: false,
        title: "69. Iterare per Elemento: L'Elenco dei Compagni di Spedizione",
        icon: "\ud83d\udc65",
        xp: 50,
        expectedOutput: "Eroe: Eldrin\nEroe: Lyra\nEroe: Grom",
        theory: "\n<p>Possiamo scorrere tutti gli elementi di un array in modo pulito ed elegante usando la sintassi <code>for elemento in collezione:</code>:</p>\n<pre><code class=\"language-gdscript\">var membri_party = [\"Guerriero\", \"Chierico\", \"Ladro\"]\nfor membro in membri_party:\n    print(\"Membro della squadra:\", membro)</code></pre>\n<p>In ogni iterazione, la variabile <code>membro</code> fa riferimento a un elemento diverso, dal primo all'ultimo.</p>\n",
        task: "\n<p>Stampa il registro dei 3 membri della squadra di ricognizione.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>squadra = [\"Eldrin\", \"Lyra\", \"Grom\"]</code>.</li>\n    <li>Usa un ciclo <code>for eroe in squadra:</code> per stampare ciascun nome preceduto da <code>Eroe: </code> (es. <code>Eroe: Eldrin</code>).</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar squadra = [\"Eldrin\", \"Lyra\", \"Grom\"]\n\t# TODO: Itera sulla squadra e stampa ogni eroe\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar squadra = [\"Eldrin\", \"Lyra\", \"Grom\"]\n\t# TODO: Itera sulla squadra e stampa ogni eroe\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar squadra = [\"Eldrin\", \"Lyra\", \"Grom\"]\n\tfor eroe in squadra:\n\t\tprint(\"Eroe: %s\" % eroe)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Il ciclo for estrae un elemento per riga."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Formatta ciascuna riga con \"Eroe: \" + eroe."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Ci saranno tre righe di output."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Eroe: Eldrin\nEroe: Lyra\nEroe: Grom";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 70,
        conceptId: "collection_iteration",
        conceptTags: ["collection_iteration", "ch13", "print", "var", "for", "functions"],
        chapterId: 13,
        isMastery: false,
        title: "70. Iterare con Indici e range(array.size()): Numerazione Slot",
        icon: "\ud83d\udd22",
        xp: 50,
        expectedOutput: "Slot [1]: Torcia\nSlot [2]: Corda\nSlot [3]: Biscotti",
        theory: "\n<p>Quando abbiamo bisogno non solo dell'elemento, ma anche della sua <strong>posizione numerica</strong> (ad esempio: \"Slot 1: Spada\", \"Slot 2: Pozione\"), iteriamo sugli indici usando <code>range(array.size())</code>:</p>\n<pre><code class=\"language-gdscript\">for i in range(oggetti.size()):\n    print(\"Slot\", i + 1, \":\", oggetti[i])</code></pre>\n<p>Questo permette di accedere o modificare l'array alla posizione esatta <code>i</code>.</p>\n",
        task: "\n<p>Numera gli slot dell'inventario da 1 in avanti.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>slot = [\"Torcia\", \"Corda\", \"Biscotti\"]</code>.</li>\n    <li>Itera con <code>for i in range(slot.size()):</code>.</li>\n    <li>Stampa: <code>Slot [1]: Torcia</code>, <code>Slot [2]: Corda</code>, <code>Slot [3]: Biscotti</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar slot = [\"Torcia\", \"Corda\", \"Biscotti\"]\n\t# TODO: Itera con indice e stampa slot numerati\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar slot = [\"Torcia\", \"Corda\", \"Biscotti\"]\n\t# TODO: Itera con indice e stampa slot numerati\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar slot = [\"Torcia\", \"Corda\", \"Biscotti\"]\n\tfor i in range(slot.size()):\n\t\tprint(\"Slot [%d]: %s\" % [i + 1, slot[i]])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "L'indice i va da 0 a 2. Aggiungi 1 per visualizzare [1], [2], [3]."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Accedi all'oggetto con slot[i]."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Formatta con segnaposto [%d] e %s."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Slot [1]: Torcia\nSlot [2]: Corda\nSlot [3]: Biscotti";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 71,
        conceptId: "collection_iteration",
        conceptTags: ["collection_iteration", "ch13", "print", "var", "for", "functions"],
        chapterId: 13,
        isMastery: false,
        title: "71. Iterare sui Caratteri di una Stringa: Decodifica del Messaggio Cifrato",
        icon: "\ud83d\udd24",
        xp: 50,
        expectedOutput: "G\nO\nD\nO\nT",
        theory: "\n<p>In GDScript anche una <code>String</code> può essere trattata come una sequenza! Un ciclo <code>for carattere in testo:</code> itera su ogni singola lettera o simbolo della stringa.</p>\n<p>Questo è utilissimo per analizzare codici segreti, verificare lettere vietate nei nickname dei giocatori o animare testi tipo macchina da scrivere (typewriter effect).</p>\n",
        task: "\n<p>Decodifica una parola runica stampando ciascuna lettera su una riga separata.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>parola_magica = \"GODOT\"</code>.</li>\n    <li>Scorri i singoli caratteri con <code>for lettera in parola_magica:</code> e stampa ciascuna lettera.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera su ogni lettera della stringa \"GODOT\" e stampala\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Itera su ogni lettera della stringa \"GODOT\" e stampala\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar parola_magica = \"GODOT\"\n\tfor lettera in parola_magica:\n\t\tprint(lettera)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "for lettera in \"GODOT\": itera su 'G', 'O', 'D', 'O', 'T'."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Stampa lettera dentro il corpo del ciclo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Ci saranno 5 righe di output."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "G\nO\nD\nO\nT";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 72,
        conceptId: "collection_iteration",
        conceptTags: ["collection_iteration", "ch13", "print", "var", "for", "conditions", "functions"],
        chapterId: 13,
        isMastery: true,
        title: "72. Conteggio e Filtro dei Caratteri: Analizzatore di Glifi",
        icon: "\ud83d\udd0d",
        xp: 75,
        expectedOutput: "Glifi 'A' trovati: 5",
        theory: "\n<p>Combinando l'iterazione sulle stringhe con un'istruzione condizionale <code>if</code>, possiamo contare quante volte ricorre un determinato simbolo o filtrare lettere indesiderate.</p>\n",
        task: "\n<p>Conta quante volte il glifo arcano <code>'A'</code> compare nel grimorio.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato il testo runico <code>incantesimo = \"ABRACADABRA\"</code>.</li>\n    <li>Inizializza <code>conteggio_a = 0</code>.</li>\n    <li>Itera sui caratteri: se il carattere è uguale a <code>\"A\"</code>, incrementa <code>conteggio_a += 1</code>.</li>\n    <li>Al termine, stampa: <code>Glifi 'A' trovati: 5</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Conta le lettere 'A' in ABRACADABRA e stampa il totale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Conta le lettere 'A' in ABRACADABRA e stampa il totale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar incantesimo = \"ABRACADABRA\"\n\tvar conteggio_a = 0\n\tfor c in incantesimo:\n\t\tif c == \"A\":\n\t\t\tconteggio_a += 1\n\tprint(\"Glifi 'A' trovati: %d\" % conteggio_a)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Nella parola ABRACADABRA ci sono esattamente 5 lettere 'A'."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Incrementa il contatore solo quando c == \"A\"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il risultato finale fuori dal ciclo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Glifi 'A' trovati: 5";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 73,
        conceptId: "arrays_advanced",
        conceptTags: ["arrays_advanced", "ch14", "print", "var", "functions"],
        chapterId: 14,
        isMastery: false,
        title: "73. Slicing degli Array con slice(): Selezione dei Primi Tre Eroi",
        icon: "\u2702\ufe0f",
        xp: 50,
        expectedOutput: "[\"Guerriero\", \"Mago\"]",
        theory: "\n<p>Il metodo <code>slice(inizio, fine)</code> permette di estrarre una porzione (o sotto-array) da un array esistente, senza alterare l'array originario:</p>\n<pre><code class=\"language-gdscript\">var tutti = [\"A\", \"B\", \"C\", \"D\", \"E\"]\nvar primi_due = tutti.slice(0, 2) # Restituisce [\"A\", \"B\"] (l'indice fine è escluso)</code></pre>\n<p>Se ometti il parametro di fine (<code>slice(2)</code>), estrae dall'indice specificato fino all'ultimo elemento!</p>\n",
        task: "\n<p>Estrai la squadra titolare (i primi due guerrieri) da una legione di 4 soldati.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>legione = [\"Guerriero\", \"Mago\", \"Arciere\", \"Assassino\"]</code>.</li>\n    <li>Estrai i primi due elementi usando <code>legione.slice(0, 2)</code> in una variabile <code>squadra_titolare</code>.</li>\n    <li>Stampa <code>squadra_titolare</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar legione = [\"Guerriero\", \"Mago\", \"Arciere\", \"Assassino\"]\n\t# TODO: Estrai con slice(0, 2) e stampa\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar legione = [\"Guerriero\", \"Mago\", \"Arciere\", \"Assassino\"]\n\t# TODO: Estrai con slice(0, 2) e stampa\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar legione = [\"Guerriero\", \"Mago\", \"Arciere\", \"Assassino\"]\n\tvar squadra_titolare = legione.slice(0, 2)\n\tprint(squadra_titolare)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "slice(0, 2) include l'indice 0 e 1, escludendo il 2."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Il risultato conterrà solo \"Guerriero\" e \"Mago\"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa con print(squadra_titolare)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[\"Guerriero\", \"Mago\"]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 74,
        conceptId: "arrays_advanced",
        conceptTags: ["arrays_advanced", "ch14", "print", "var", "functions"],
        chapterId: 14,
        isMastery: false,
        title: "74. Concatenazione e Duplicazione degli Array (+, *)",
        icon: "\ud83e\uddf0",
        xp: 50,
        expectedOutput: "[\"Pane\", \"Acqua\", \"Mela\", \"Carne\"]",
        theory: "\n<p>In GDScript possiamo unire due array usando l'operatore <code>+</code> oppure duplicarne il contenuto ripetendolo con l'operatore <code>*</code>:</p>\n<pre><code class=\"language-gdscript\">var loot1 = [\"Moneta\"]\nvar loot2 = [\"Gemma\"]\nvar unione = loot1 + loot2 # [\"Moneta\", \"Gemma\"]\nvar trappole = [\"Spine\"] * 3 # [\"Spine\", \"Spine\", \"Spine\"]</code></pre>\n",
        task: "\n<p>Unisci le provviste di due alleati in un'unica cassa comune.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara <code>zaino1 = [\"Pane\", \"Acqua\"]</code>.</li>\n    <li>Dichiara <code>zaino2 = [\"Mela\", \"Carne\"]</code>.</li>\n    <li>Unisci i due zaini con <code>zaino1 + zaino2</code> e assegna a <code>cassa_comune</code>.</li>\n    <li>Stampa <code>cassa_comune</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Unisci i due array e stampa il risultato\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Unisci i due array e stampa il risultato\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar zaino1 = [\"Pane\", \"Acqua\"]\n\tvar zaino2 = [\"Mela\", \"Carne\"]\n\tvar cassa_comune = zaino1 + zaino2\n\tprint(cassa_comune)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa l'operatore + per concatenare i due array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "L'ordine sarà prima gli elementi di zaino1 poi quelli di zaino2."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la cassa_comune."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[\"Pane\", \"Acqua\", \"Mela\", \"Carne\"]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 75,
        conceptId: "arrays_advanced",
        conceptTags: ["arrays_advanced", "ch14", "print", "var", "conditions", "functions"],
        chapterId: 14,
        isMastery: false,
        title: "75. Verifica di Appartenenza con l'Operatore in",
        icon: "\ud83d\udd0e",
        xp: 50,
        expectedOutput: "Accesso al nido del Drago sbloccato!",
        theory: "\n<p>L'operatore <code>in</code> permette di controllare istantaneamente se un elemento è presente all'interno di un array, restituendo <code>true</code> o <code>false</code>:</p>\n<pre><code class=\"language-gdscript\">var chiavi = [\"Oro\", \"Argento\"]\nif \"Oro\" in chiavi:\n    print(\"Possiedi la chiave dorata!\")</code></pre>\n<p>Possiamo anche usare <code>not (elemento in array)</code> per verificare l'assenza di un oggetto.</p>\n",
        task: "\n<p>Verifica se l'avventuriero possiede la Chiave del Drago per sbloccare il portale.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>mazzo_chiavi = [\"Chiave di Ferro\", \"Chiave del Drago\", \"Chiave d'Ossidiana\"]</code>.</li>\n    <li>Se <code>\"Chiave del Drago\" in mazzo_chiavi:</code>, stampa <code>Accesso al nido del Drago sbloccato!</code>.</li>\n    <li>Altrimenti stampa <code>Chiave del Drago mancante.</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar mazzo_chiavi = [\"Chiave di Ferro\", \"Chiave del Drago\", \"Chiave d'Ossidiana\"]\n\t# TODO: Usa l'operatore 'in' per verificare la presenza della chiave\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar mazzo_chiavi = [\"Chiave di Ferro\", \"Chiave del Drago\", \"Chiave d'Ossidiana\"]\n\t# TODO: Usa l'operatore 'in' per verificare la presenza della chiave\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar mazzo_chiavi = [\"Chiave di Ferro\", \"Chiave del Drago\", \"Chiave d'Ossidiana\"]\n\tif \"Chiave del Drago\" in mazzo_chiavi:\n\t\tprint(\"Accesso al nido del Drago sbloccato!\")\n\telse:\n\t\tprint(\"Chiave del Drago mancante.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "\"Chiave del Drago\" è presente nell'array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "L'if risulterà vero ed eseguirà il primo ramo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la frase esatta indicata nel task."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Accesso al nido del Drago sbloccato!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 76,
        conceptId: "arrays_advanced",
        conceptTags: ["arrays_advanced", "ch14", "print", "var", "functions"],
        chapterId: 14,
        isMastery: true,
        title: "76. Ordinare gli Elementi con sort() e sort_custom()",
        icon: "\ud83d\udcca",
        xp: 75,
        expectedOutput: "[12, 30, 45, 88]",
        theory: "\n<p>Il metodo <code>sort()</code> riordina gli elementi dell'array in ordine crescente (alfabetico per le stringhe, dal più piccolo al più grande per i numeri):</p>\n<pre><code class=\"language-gdscript\">var punteggi = [150, 40, 300, 90]\npunteggi.sort() # Diventa [40, 90, 150, 300]</code></pre>\n<p>È un'operazione fondamentale per classifiche (leaderboard), ordinare l'inventario per valore o organizzare l'iniziativa dei turni di combattimento in base alla velocità.</p>\n",
        task: "\n<p>Ordina i livelli di minaccia dei mostri dal più debole al più pericoloso.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>livelli_minaccia = [45, 12, 88, 30]</code>.</li>\n    <li>Ordina l'array con <code>livelli_minaccia.sort()</code>.</li>\n    <li>Stampa l'array ordinato.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar livelli_minaccia = [45, 12, 88, 30]\n\t# TODO: Ordina l'array con sort() e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar livelli_minaccia = [45, 12, 88, 30]\n\t# TODO: Ordina l'array con sort() e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar livelli_minaccia = [45, 12, 88, 30]\n\tlivelli_minaccia.sort()\n\tprint(livelli_minaccia)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "sort() ordina direttamente sul posto l'array numerico."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "12, 30, 45, 88."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa l'array con print(livelli_minaccia)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "[12, 30, 45, 88]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 77,
        conceptId: "dictionaries",
        conceptTags: ["dictionaries", "ch15", "print", "var", "functions"],
        chapterId: 15,
        isMastery: false,
        title: "77. Creare un Dizionario: La Scheda del Personaggio (Coppie Chiave-Valore)",
        icon: "\ud83d\udcd6",
        xp: 50,
        expectedOutput: "{\"nome\": \"Barnaby\", \"oro\": 350}",
        theory: "\n<p>Mentre un array organizza i dati per indice numerico sequenziale (0, 1, 2...), un <strong>Dizionario</strong> (<code>Dictionary</code>) associa ogni valore a una <strong>chiave</strong> descrittiva. È la struttura dati più versatile e utilizzata in Godot per schede di personaggi, salvataggi di gioco e configurazioni!</p>\n<p>I dizionari si definiscono con parentesi graffe <code>{...}</code> e coppie <code>chiave: valore</code>:</p>\n<pre><code class=\"language-gdscript\">var eroe = {\n    \"nome\": \"Alden\",\n    \"classe\": \"Guerriero\",\n    \"hp\": 120\n}\nprint(eroe)</code></pre>\n",
        task: "\n<p>Crea la scheda anagrafica di un NPC mercante.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara un dizionario <code>mercante = {\"nome\": \"Barnaby\", \"oro\": 350}</code>.</li>\n    <li>Stampa l'intero dizionario.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara il dizionario del mercante e stampalo\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Dichiara il dizionario del mercante e stampalo\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar mercante = {\"nome\": \"Barnaby\", \"oro\": 350}\n\tprint(mercante)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa le parentesi graffe { ... }."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Separa le chiavi dai valori con i due punti :."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa con print(mercante)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "{\"nome\": \"Barnaby\", \"oro\": 350}";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 78,
        conceptId: "dictionaries",
        conceptTags: ["dictionaries", "ch15", "print", "var", "functions"],
        chapterId: 15,
        isMastery: false,
        title: "78. Accesso ai Valori: Sintassi tra Parentesi Quadre e Notazione Puntata",
        icon: "\ud83d\udd11",
        xp: 50,
        expectedOutput: "45\n80",
        theory: "\n<p>In GDScript possiamo accedere ai valori di un dizionario in due modi equivalenti:</p>\n<ol>\n    <li><strong>Sintassi a parentesi quadre:</strong> <code>dizionario[\"chiave\"]</code> (funziona con qualsiasi tipo di chiave).</li>\n    <li><strong>Notazione a punto:</strong> <code>dizionario.chiave</code> (molto comoda quando le chiavi sono stringhe identificatrici).</li>\n</ol>\n<pre><code class=\"language-gdscript\">var mostro = {\"tipo\": \"Drago\", \"livello\": 50}\nprint(mostro[\"tipo\"]) # Stampa: Drago\nprint(mostro.livello) # Stampa: 50</code></pre>\n<p>Se una chiave non esiste, accedere con le parentesi quadre o con il punto provocherà un errore. In alternativa, il metodo <code>get(\"chiave\", default)</code> consente un accesso sicuro!</p>\n",
        task: "\n<p>Recupera il potere magico e la durabilità di un'arma dal suo dizionario delle statistiche.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>bastone = {\"attacco\": 45, \"durabilita\": 80}</code>:</li>\n    <li>Stampa il valore di <code>attacco</code> su una riga.</li>\n    <li>Stampa il valore di <code>durabilita</code> sulla seconda riga.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar bastone = {\"attacco\": 45, \"durabilita\": 80}\n\t# TODO: Accedi ai valori del dizionario e stampali\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar bastone = {\"attacco\": 45, \"durabilita\": 80}\n\t# TODO: Accedi ai valori del dizionario e stampali\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar bastone = {\"attacco\": 45, \"durabilita\": 80}\n\tprint(bastone[\"attacco\"])\n\tprint(bastone.durabilita)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "bastone[\"attacco\"] o bastone.attacco restituiscono 45."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "bastone[\"durabilita\"] o bastone.durabilita restituiscono 80."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa ciascun valore con print()."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "45\n80";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 79,
        conceptId: "dictionaries",
        conceptTags: ["dictionaries", "ch15", "print", "var", "functions"],
        chapterId: 15,
        isMastery: false,
        title: "79. Aggiornare ed Inserire Nuove Chiavi nel Dizionario",
        icon: "\u270f\ufe0f",
        xp: 50,
        expectedOutput: "{\"pozioni\": 12, \"elisir\": 3}",
        theory: "\n<p>I dizionari sono dinamici: puoi aggiornare il valore di una chiave esistente o inserire una chiave del tutto nuova assegnandole un valore:</p>\n<pre><code class=\"language-gdscript\">var giocatore = {\"nome\": \"Sora\", \"hp\": 100}\ngiocatore[\"hp\"] = 80          # Modifica chiave esistente\ngiocatore[\"mp\"] = 50          # Inserisce nuova chiave \"mp\"</code></pre>\n<p>Per rimuovere una chiave possiamo usare il metodo <code>erase(chiave)</code>: <code>giocatore.erase(\"mp\")</code>.</p>\n",
        task: "\n<p>Aggiorna le scorte della bottega dopo un rifornimento di pozioni.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>scorte = {\"pozioni\": 5}</code>:</li>\n    <li>Aggiorna <code>\"pozioni\"</code> a <code>12</code>.</li>\n    <li>Aggiungi la nuova chiave <code>\"elisir\"</code> con valore <code>3</code>.</li>\n    <li>Stampa il dizionario aggiornato.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar scorte = {\"pozioni\": 5}\n\t# TODO: Aggiorna pozioni, aggiungi elisir e stampa\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar scorte = {\"pozioni\": 5}\n\t# TODO: Aggiorna pozioni, aggiungi elisir e stampa\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar scorte = {\"pozioni\": 5}\n\tscorte[\"pozioni\"] = 12\n\tscorte[\"elisir\"] = 3\n\tprint(scorte)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "scorte[\"pozioni\"] = 12 sovrascrive il valore precedente."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "scorte[\"elisir\"] = 3 inserisce la nuova coppia."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa con print(scorte)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "{\"pozioni\": 12, \"elisir\": 3}";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 80,
        conceptId: "dictionaries",
        conceptTags: ["dictionaries", "ch15", "print", "var", "functions"],
        chapterId: 15,
        isMastery: false,
        title: "80. Metodi Utili: keys(), values(), has()",
        icon: "\ud83d\udee0\ufe0f",
        xp: 50,
        expectedOutput: "true\n[\"oro\", \"diamante\"]",
        theory: "\n<p>I dizionari offrono metodi integrati utilissimi per interrogare i dati:</p>\n<ul>\n    <li><code>has(chiave)</code>: Restituisce <code>true</code> se la chiave esiste nel dizionario (equivalente a <code>chiave in dizionario</code>).</li>\n    <li><code>keys()</code>: Restituisce un <code>Array</code> contenente tutte le chiavi del dizionario.</li>\n    <li><code>values()</code>: Restituisce un <code>Array</code> con tutti i valori.</li>\n    <li><code>size()</code>: Restituisce il numero di coppie presenti.</li>\n</ul>\n",
        task: "\n<p>Interroga il forziere magico per verificare la presenza di una reliquia e ottieni l'elenco delle chiavi.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>forziere = {\"oro\": 200, \"diamante\": 1}</code>:</li>\n    <li>Verifica se possiede la chiave <code>\"diamante\"</code> con <code>forziere.has(\"diamante\")</code> e stampa il risultato booleano.</li>\n    <li>Stampa l'elenco delle chiavi con <code>forziere.keys()</code> sulla seconda riga.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar forziere = {\"oro\": 200, \"diamante\": 1}\n\t# TODO: Usa has() e keys() e stampa i risultati\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar forziere = {\"oro\": 200, \"diamante\": 1}\n\t# TODO: Usa has() e keys() e stampa i risultati\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar forziere = {\"oro\": 200, \"diamante\": 1}\n\tprint(forziere.has(\"diamante\"))\n\tprint(forziere.keys())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "forziere.has(\"diamante\") restituisce true."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "forziere.keys() restituisce l'array [\"oro\", \"diamante\"]."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Usa due istruzioni print separate."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "true\n[\"oro\", \"diamante\"]";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 81,
        conceptId: "dictionaries",
        conceptTags: ["dictionaries", "ch15", "print", "var", "for", "functions"],
        chapterId: 15,
        isMastery: false,
        title: "81. Iterare sui Dizionari: Visualizzazione del Listino Bottega",
        icon: "\ud83c\udfea",
        xp: 50,
        expectedOutput: "Oggetto: [Cura] -> Costo: 25 oro\nOggetto: [Mana] -> Costo: 30 oro",
        theory: "\n<p>Quando iteri su un dizionario con <code>for chiave in dizionario:</code>, la variabile di ciclo assume il valore di ciascuna <strong>chiave</strong>. Da lì puoi accedere al relativo valore usando <code>dizionario[chiave]</code>:</p>\n<pre><code class=\"language-gdscript\">var catalogo = {\"Spada\": 100, \"Scudo\": 80}\nfor item in catalogo:\n    print(item, \"costa\", catalogo[item], \"monete\")</code></pre>\n",
        task: "\n<p>Formatta il catalogo dei prezzi della bottega delle pozioni.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>prezzi = {\"Cura\": 25, \"Mana\": 30}</code>.</li>\n    <li>Itera sulle chiavi e stampa ciascuna riga formattata: <code>Oggetto: [Cura] -> Costo: 25 oro</code> e <code>Oggetto: [Mana] -> Costo: 30 oro</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar prezzi = {\"Cura\": 25, \"Mana\": 30}\n\t# TODO: Itera sul dizionario e stampa il listino\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar prezzi = {\"Cura\": 25, \"Mana\": 30}\n\t# TODO: Itera sul dizionario e stampa il listino\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar prezzi = {\"Cura\": 25, \"Mana\": 30}\n\tfor nome in prezzi:\n\t\tprint(\"Oggetto: [%s] -> Costo: %d oro\" % [nome, prezzi[nome]])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "for nome in prezzi: assegna \"Cura\" poi \"Mana\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "prezzi[nome] recupera il relativo prezzo numerico."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa nel formato richiesto."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Oggetto: [Cura] -> Costo: 25 oro\nOggetto: [Mana] -> Costo: 30 oro";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 82,
        conceptId: "dictionaries",
        conceptTags: ["dictionaries", "ch15", "print", "var", "for", "functions"],
        chapterId: 15,
        isMastery: true,
        title: "82. Riepilogo: Calcolo del Valore Totale dell'Inventario",
        icon: "\ud83d\udcb0",
        xp: 75,
        expectedOutput: "Totale ingredienti alchemici: 25",
        theory: "\n<p>In un GDR o gioco di sopravvivenza, un dizionario può rappresentare gli oggetti e le rispettive quantità accumulate dal giocatore (stackable items). Possiamo calcolare la somma totale di tutti gli oggetti posseduti sommando i valori del dizionario.</p>\n",
        task: "\n<p>Calcola il numero complessivo di consumabili presenti nella borsa dell'alchimista.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>borsa = {\"erba_rossa\": 5, \"radice_blu\": 8, \"bacca_gialla\": 12}</code>.</li>\n    <li>Inizializza <code>totale_ingredienti = 0</code>.</li>\n    <li>Itera su <code>borsa.values()</code> e somma ciascun numero.</li>\n    <li>Stampa: <code>Totale ingredienti alchemici: 25</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar borsa = {\"erba_rossa\": 5, \"radice_blu\": 8, \"bacca_gialla\": 12}\n\t# TODO: Somma tutti i valori e stampa il totale\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar borsa = {\"erba_rossa\": 5, \"radice_blu\": 8, \"bacca_gialla\": 12}\n\t# TODO: Somma tutti i valori e stampa il totale\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar borsa = {\"erba_rossa\": 5, \"radice_blu\": 8, \"bacca_gialla\": 12}\n\tvar totale_ingredienti = 0\n\tfor qta in borsa.values():\n\t\ttotale_ingredienti += qta\n\tprint(\"Totale ingredienti alchemici: %d\" % totale_ingredienti)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "5 + 8 + 12 = 25."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa for qta in borsa.values(): per scorrere direttamente le quantità numeriche."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa la frase con il totale."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Totale ingredienti alchemici: 25";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 83,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "functions"],
        chapterId: 16,
        isMastery: false,
        title: "83. Progetto Risorse (1/7): Panoramica del Registro dell'Accampamento",
        icon: "\u26fa",
        xp: 75,
        expectedOutput: "=== REGISTRO SCORTE ACCAMPAMENTO ===\nInizializzazione modulo di monitoraggio...",
        theory: "\n<p>Benvenuto nel progetto finale di gestione dati della Parte 1! Nei prossimi 7 passi realizzeremo il <strong>Registro Risorse e Munizioni della Gilda</strong>: un sistema modulare per tracciare il consumo e l'approvvigionamento di scorte (frecce, ferro, razioni, legno) durante le spedizioni di gioco.</p>\n",
        task: "\n<p>Stampa il banner di avvio del Registro Risorse dell'Accampamento.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Stampa sulla prima riga: <code>=== REGISTRO SCORTE ACCAMPAMENTO ===</code></li>\n    <li>Stampa sulla seconda riga: <code>Inizializzazione modulo di monitoraggio...</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa l'intestazione del registro risorse\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa l'intestazione del registro risorse\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"=== REGISTRO SCORTE ACCAMPAMENTO ===\")\n\tprint(\"Inizializzazione modulo di monitoraggio...\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa due chiamate print() consecutive."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Rispetta maiuscole e punteggiatura."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "I tre puntini finali fanno parte della stringa."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "=== REGISTRO SCORTE ACCAMPAMENTO ===\nInizializzazione modulo di monitoraggio...";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 84,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "functions"],
        chapterId: 16,
        isMastery: false,
        title: "84. Progetto Risorse (2/7): Gestione Chiusura Registro",
        icon: "\ud83d\udeaa",
        xp: 75,
        expectedOutput: "Salvataggio registri su file completato. Arrivederci!",
        theory: "\n<p>Ogni sistema gestionale deve prevedere un meccanismo ordinato di uscita e salvataggio delle transazioni effettuate.</p>\n",
        task: "\n<p>Stampa il messaggio di chiusura sicura del registro dell'armeria.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Stampa: <code>Salvataggio registri su file completato. Arrivederci!</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa il messaggio di chiusura\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa il messaggio di chiusura\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tprint(\"Salvataggio registri su file completato. Arrivederci!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa print() con la stringa richiesta."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Controlla il punto esclamativo finale."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Non modificare il nome dello script."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Salvataggio registri su file completato. Arrivederci!";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 85,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "var", "functions"],
        chapterId: 16,
        isMastery: false,
        title: "85. Progetto Risorse (3/7): Funzione Registra Consumo Scorte",
        icon: "\ud83e\udeb5",
        xp: 75,
        expectedOutput: "Registrato: Frecce (-15 unità)",
        theory: "\n<p>Creiamo una funzione che registra una nuova voce di consumo risorsa all'interno di una lista cumulativa.</p>\n",
        task: "\n<p>Implementa la funzione per aggiungere una voce di consumo.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dichiara una variabile di classe <code>var consumi = []</code>.</li>\n    <li>Crea <code>func registra_consumo(voce: String, qta: int):</code> che aggiunge <code>{\"voce\": voce, \"qta\": qta}</code> a <code>consumi</code> e stampa: <code>Registrato: X (-Y unità)</code>.</li>\n    <li>In <code>_ready()</code>, chiama <code>registra_consumo(\"Frecce\", 15)</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nvar consumi = []\n\nfunc _ready():\n\t# TODO: Chiama registra_consumo(\"Frecce\", 15)\n\tpass\n\n# TODO: Dichiara func registra_consumo(voce: String, qta: int)\n",
        starterCode: "extends Node\n\nvar consumi = []\n\nfunc _ready():\n\t# TODO: Chiama registra_consumo(\"Frecce\", 15)\n\tpass\n\n# TODO: Dichiara func registra_consumo(voce: String, qta: int)\n",
        solution: "extends Node\n\nvar consumi = []\n\nfunc _ready():\n\tregistra_consumo(\"Frecce\", 15)\n\nfunc registra_consumo(voce: String, qta: int):\n\tconsumi.append({\"voce\": voce, \"qta\": qta})\n\tprint(\"Registrato: %s (-%d unità)\" % [voce, qta])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa append() per aggiungere il dizionario all'array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Formatta la stampa come richiesto: 'Registrato: Frecce (-15 unità)'."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Invocala in _ready()."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Registrato: Frecce (-15 unità)";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 86,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "var", "for", "functions"],
        chapterId: 16,
        isMastery: false,
        title: "86. Progetto Risorse (4/7): Elencare Tutte le Voci Registrate",
        icon: "\ud83d\udcdc",
        xp: 75,
        expectedOutput: "- Legna: 20 unita\n- Razioni: 8 unita",
        theory: "\n<p>Scriviamo una funzione di stampa che scorre tutte le registrazioni e le visualizza come una tabella chiara.</p>\n",
        task: "\n<p>Visualizza il bollettino di tutte le voci registrate nell'accampamento.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato l'elenco: <code>[{\"voce\": \"Legna\", \"qta\": 20}, {\"voce\": \"Razioni\", \"qta\": 8}]</code>.</li>\n    <li>Itera e stampa ciascuna riga nel formato: <code>- Legna: 20 unita</code> e <code>- Razioni: 8 unita</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar voci = [{\"voce\": \"Legna\", \"qta\": 20}, {\"voce\": \"Razioni\", \"qta\": 8}]\n\t# TODO: Itera e stampa ciascuna voce\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar voci = [{\"voce\": \"Legna\", \"qta\": 20}, {\"voce\": \"Razioni\", \"qta\": 8}]\n\t# TODO: Itera e stampa ciascuna voce\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar voci = [{\"voce\": \"Legna\", \"qta\": 20}, {\"voce\": \"Razioni\", \"qta\": 8}]\n\tfor v in voci:\n\t\tprint(\"- %s: %d unita\" % [v.voce, v.qta])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Accedi ai campi con v.voce e v.qta."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Non dimenticare il trattino iniziale: \"- \"."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Ci saranno due righe di output."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "- Legna: 20 unita\n- Razioni: 8 unita";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 87,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "var", "for", "functions"],
        chapterId: 16,
        isMastery: false,
        title: "87. Progetto Risorse (5/7): Calcolo del Consumo Totale e Medio",
        icon: "\ud83d\udcc8",
        xp: 75,
        expectedOutput: "Consumo totale: 60 unita\nConsumo medio: 20 unita",
        theory: "\n<p>Per pianificare i rifornimenti della spedizione, il comandante ha bisogno di conoscere sia il consumo totale di risorse sia la media per reparto.</p>\n<p>$\text{Media} = \frac{\text{Totale}}{\text{Numero Voci}}$</p>\n",
        task: "\n<p>Calcola totale e media da un elenco di quantità consumate: <code>[30, 10, 20]</code>.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>quantita = [30, 10, 20]</code>.</li>\n    <li>Calcola la somma: <code>totale = 60</code>.</li>\n    <li>Calcola la media intera: <code>media = totale / quantita.size()</code> (20).</li>\n    <li>Stampa: <code>Consumo totale: 60 unita</code></li>\n    <li>Stampa: <code>Consumo medio: 20 unita</code></li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar quantita = [30, 10, 20]\n\t# TODO: Calcola totale e media, poi stampali\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar quantita = [30, 10, 20]\n\t# TODO: Calcola totale e media, poi stampali\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar quantita = [30, 10, 20]\n\tvar totale = 0\n\tfor q in quantita:\n\t\ttotale += q\n\tvar media = totale / quantita.size()\n\tprint(\"Consumo totale: %d unita\" % totale)\n\tprint(\"Consumo medio: %d unita\" % media)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "30 + 10 + 20 = 60."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "60 / 3 = 20."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa le due righe come indicato."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Consumo totale: 60 unita\nConsumo medio: 20 unita";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 88,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "var", "functions"],
        chapterId: 16,
        isMastery: false,
        title: "88. Progetto Risorse (6/7): Resettare il Registro per il Nuovo Giorno",
        icon: "\ud83e\uddf9",
        xp: 75,
        expectedOutput: "Voci nel registro dopo il reset: 0",
        theory: "\n<p>All'alba di un nuovo giorno di gioco (day/night cycle), il registro giornaliero viene archiviato e azzerato usando il metodo <code>clear()</code> degli array.</p>\n",
        task: "\n<p>Azzera il registro delle scorte e conferma che la memoria sia vuota.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Inizializza <code>registro = [10, 25, 40]</code>.</li>\n    <li>Svuotalo con <code>registro.clear()</code>.</li>\n    <li>Stampa: <code>Voci nel registro dopo il reset: 0</code> (usando <code>registro.size()</code>).</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar registro = [10, 25, 40]\n\t# TODO: Svuota con clear() e stampa la dimensione\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar registro = [10, 25, 40]\n\t# TODO: Svuota con clear() e stampa la dimensione\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar registro = [10, 25, 40]\n\tregistro.clear()\n\tprint(\"Voci nel registro dopo il reset: %d\" % registro.size())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "clear() elimina tutti gli elementi."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "size() restituirà 0."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Formatta la stampa finale."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Voci nel registro dopo il reset: 0";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 89,
        conceptId: "project_expenses",
        conceptTags: ["project_expenses", "ch16", "print", "var", "conditions", "functions"],
        chapterId: 16,
        isMastery: true,
        title: "89. Progetto Risorse (7/7): Gestione Errori e Quantità Non Valide",
        icon: "\u26a0\ufe0f",
        xp: 75,
        expectedOutput: "ERRORE: Quantita non valida (-5). Inserimento annullato.",
        theory: "\n<p>Completiamo il progetto con un controllo di sicurezza essenziale: se un utente o un evento tenta di registrare una quantità negativa o nulla (es. <code>qta &lt;= 0</code>), il sistema deve rifiutare l'operazione stampando un messaggio di allarme.</p>\n",
        task: "\n<p>Valida la quantità inserita prima di aggiornare il registro.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>qta_input = -5</code>.</li>\n    <li>Se <code>qta_input &lt;= 0</code>, stampa: <code>ERRORE: Quantita non valida (-5). Inserimento annullato.</code>.</li>\n    <li>Altrimenti stampa: <code>Quantita registrata con successo.</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar qta_input = -5\n\t# TODO: Esegui la validazione con if-else\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar qta_input = -5\n\t# TODO: Esegui la validazione con if-else\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar qta_input = -5\n\tif qta_input <= 0:\n\t\tprint(\"ERRORE: Quantita non valida (%d). Inserimento annullato.\" % qta_input)\n\telse:\n\t\tprint(\"Quantita registrata con successo.\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dato che -5 <= 0 è vero, scatta il ramo di errore."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Stampa esattamente la stringa di allarme."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Inserisci il valore tra parentesi (%d)."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "ERRORE: Quantita non valida (-5). Inserimento annullato.";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 90,
        conceptId: "challenges",
        conceptTags: ["challenges", "ch17", "print", "for", "functions"],
        chapterId: 17,
        isMastery: true,
        title: "90. Sfida Finale 1: Generatore della Piramide di Pietra del Tempio",
        icon: "\ud83d\udd3a",
        xp: 100,
        expectedOutput: "*\n**\n***\n****",
        theory: "\n<p>Congratulazioni per essere arrivato alle <strong>Sfide Finali della Parte 1</strong>! In questa prima sfida algoritmica creiamo un generatore di gradini per un tempio antico a gradoni, moltiplicando stringhe e controllando i cicli.</p>\n<p>In GDScript moltiplicare una stringa per un numero ripete quel testo: <code>\"#\" * 3</code> produce <code>\"###\"</code>.</p>\n",
        task: "\n<p>Costruisci una piramide di blocchi di pietra di altezza 4.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Usa un ciclo <code>for i in range(1, 5):</code> (da 1 a 4).</li>\n    <li>A ogni riga, stampa una sequenza di asterischi <code>\"*\" * i</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa la piramide di asterischi di altezza 4\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\t# TODO: Stampa la piramide di asterischi di altezza 4\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tfor i in range(1, 5):\n\t\tprint(\"*\" * i)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "i = 1 stampa \"*\""
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "i = 2 stampa \"**\""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "i = 4 stampa \"****\""
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "*\n**\n***\n****";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 91,
        conceptId: "challenges",
        conceptTags: ["challenges", "ch17", "print", "var", "for", "conditions", "functions"],
        chapterId: 17,
        isMastery: true,
        title: "91. Sfida Finale 2: Rilevatore di Frequenza del Bottino (Loot Counter)",
        icon: "\ud83d\udc8e",
        xp: 100,
        expectedOutput: "Rubini trovati: 3",
        theory: "\n<p>Spesso nei giochi dobbiamo analizzare i drop dei nemici per verificare quanti oggetti di ciascuna rarità sono stati generati.</p>\n",
        task: "\n<p>Conta quante volte compare la gemma <code>\"Rubino\"</code> nel bottino di 5 casseforti.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Dato <code>bottino = [\"Smeraldo\", \"Rubino\", \"Zaffiro\", \"Rubino\", \"Rubino\"]</code>.</li>\n    <li>Inizializza <code>conteggio_rubini = 0</code>.</li>\n    <li>Scorri il bottino: se l'oggetto è <code>\"Rubino\"</code>, incrementa di 1.</li>\n    <li>Stampa: <code>Rubini trovati: 3</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar bottino = [\"Smeraldo\", \"Rubino\", \"Zaffiro\", \"Rubino\", \"Rubino\"]\n\t# TODO: Conta i rubini e stampa il risultato\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar bottino = [\"Smeraldo\", \"Rubino\", \"Zaffiro\", \"Rubino\", \"Rubino\"]\n\t# TODO: Conta i rubini e stampa il risultato\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar bottino = [\"Smeraldo\", \"Rubino\", \"Zaffiro\", \"Rubino\", \"Rubino\"]\n\tvar conteggio_rubini = 0\n\tfor item in bottino:\n\t\tif item == \"Rubino\":\n\t\t\tconteggio_rubini += 1\n\tprint(\"Rubini trovati: %d\" % conteggio_rubini)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Ci sono esattamente 3 elementi \"Rubino\" nell'array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Incrementa il conteggio solo per i rubini."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il totale al termine del ciclo."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Rubini trovati: 3";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    },
    {
        id: 92,
        conceptId: "challenges",
        conceptTags: ["challenges", "ch17", "print", "var", "for", "conditions", "functions"],
        chapterId: 17,
        isMastery: true,
        title: "92. Sfida Finale 3: L'Algoritmo di Acquisto Ottimale dal Mercante",
        icon: "\ud83d\uded2",
        xp: 100,
        expectedOutput: "Acquistabile: [Pozione] (20 oro)\nAcquistabile: [Torcia] (10 oro)",
        theory: "\n<p>L'eroe si trova alla bottega con un budget limitato di monete d'oro. Vogliamo scorrere il catalogo del mercante e stampare tutti e soli gli oggetti che l'eroe può permettersi con il suo oro attuale!</p>\n",
        task: "\n<p>Filtra e stampa gli oggetti acquistabili con 50 monete d'oro.</p>\n<p><strong>Cosa devi fare:</strong></p>\n<ul>\n    <li>Budget eroe: <code>oro_disponibile = 50</code>.</li>\n    <li>Catalogo: <code>catalogo = {\"Pozione\": 20, \"Spada\": 80, \"Torcia\": 10, \"Armatura\": 120}</code>.</li>\n    <li>Scorri gli articoli: se il prezzo è <code>&lt;= oro_disponibile</code>, stampa: <code>Acquistabile: [NOME] (X oro)</code>.</li>\n</ul>\n",
        initialCode: "extends Node\n\nfunc _ready():\n\tvar oro_disponibile = 50\n\tvar catalogo = {\"Pozione\": 20, \"Spada\": 80, \"Torcia\": 10, \"Armatura\": 120}\n\t# TODO: Itera sul catalogo e stampa gli oggetti che costano <= 50 oro\n\tpass\n",
        starterCode: "extends Node\n\nfunc _ready():\n\tvar oro_disponibile = 50\n\tvar catalogo = {\"Pozione\": 20, \"Spada\": 80, \"Torcia\": 10, \"Armatura\": 120}\n\t# TODO: Itera sul catalogo e stampa gli oggetti che costano <= 50 oro\n\tpass\n",
        solution: "extends Node\n\nfunc _ready():\n\tvar oro_disponibile = 50\n\tvar catalogo = {\"Pozione\": 20, \"Spada\": 80, \"Torcia\": 10, \"Armatura\": 120}\n\tfor item in catalogo:\n\t\tvar prezzo = catalogo[item]\n\t\tif prezzo <= oro_disponibile:\n\t\t\tprint(\"Acquistabile: [%s] (%d oro)\" % [item, prezzo])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Gli unici articoli con costo <= 50 sono Pozione (20) e Torcia (10)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Spada (80) e Armatura (120) superano il budget."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa le due righe formattate come indicato."
            }
],
        validate: async (result) => {
        const tests = [];
        tests.push(formatExecutionCheck(result));
        const expected = "Acquistabile: [Pozione] (20 oro)\nAcquistabile: [Torcia] (10 oro)";
        if (expected) {
            const expectedLines = String(expected).trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            const actualLogs = (result.logs || []).map(s => String(s).trim()).filter(Boolean);
            const matchLogs = expectedLines.every((exp, i) => actualLogs[i] === exp) && actualLogs.length >= expectedLines.length;
            tests.push({
                desc: "Console stampa l'output richiesto",
                passed: matchLogs,
                diff: matchLogs ? null : `Atteso:\n${expectedLines.join('\n')}\n\nRicevuto:\n${actualLogs.join('\n')}`
            });
        }
        return tests;
    }
    }
];

const ACHIEVEMENTS_DATA = [
    {
        id: "first_blood",
        title: "Primi Passi",
        icon: "🚀",
        desc: "Compila ed esegui il tuo primo script con print in Godot.",
        xpReward: 25,
        condition: (state) => state.finishedLessons.includes(1)
    },
    {
        id: "chapter_1_master",
        title: "Padrone dell'Introduzione",
        icon: "📜",
        desc: "Supera la Sfida di Padronanza del Capitolo 1.",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(4)
    },
    {
        id: "chapter_2_master",
        title: "Iniziatore di Variabili",
        icon: "📦",
        desc: "Supera la Sfida di Padronanza del Capitolo 2 (Variabili Parte 1).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(9)
    },
    {
        id: "chapter_3_master",
        title: "Signore dei Tipi",
        icon: "🏷️",
        desc: "Supera la Sfida di Padronanza del Capitolo 3 (Variabili Parte 2 & Tipizzazione).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(14)
    },
    {
        id: "chapter_4_master",
        title: "Alchimista dei Numeri",
        icon: "➗",
        desc: "Supera la Sfida di Padronanza del Capitolo 4 (Operatori Aritmetici).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(20)
    },
    {
        id: "chapter_5_master",
        title: "Mago della Logica",
        icon: "⚖️",
        desc: "Supera la Sfida di Padronanza del Capitolo 5 (Operatori Logici).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(25)
    },
    {
        id: "chapter_6_master",
        title: "Stratega delle Decisioni",
        icon: "🔀",
        desc: "Supera la Sfida di Padronanza del Capitolo 6 (Strutture Decisionali).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(30)
    },
    {
        id: "chapter_7_master",
        title: "Interprete di Canali I/O",
        icon: "💻",
        desc: "Supera la Sfida di Padronanza del Capitolo 7 (Input e Output).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(37)
    },
    {
        id: "chapter_8_master",
        title: "Contabile dell'Accademia",
        icon: "🧾",
        desc: "Completa il Progetto del Capitolo 8 (Calcolatore del Conto).",
        xpReward: 60,
        condition: (state) => state.finishedLessons.includes(42)
    },
    {
        id: "chapter_9_master",
        title: "Dominatore dei Cicli",
        icon: "🔄",
        desc: "Supera la Sfida di Padronanza del Capitolo 9 (Cicli e Iterazione).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(50)
    },
    {
        id: "chapter_10_master",
        title: "Ingegnere di Funzioni",
        icon: "⚙️",
        desc: "Supera la Sfida di Padronanza del Capitolo 10 (Funzioni e Parametri).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(57)
    },
    {
        id: "chapter_11_master",
        title: "Campione di FizzBuzz",
        icon: "🎯",
        desc: "Completa il Progetto del Capitolo 11 (FizzBuzz e Varianti).",
        xpReward: 60,
        condition: (state) => state.finishedLessons.includes(61)
    },
    {
        id: "chapter_12_master",
        title: "Signore degli Array",
        icon: "📚",
        desc: "Supera la Sfida di Padronanza del Capitolo 12 (Nozioni di Base sugli Array).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(68)
    },
    {
        id: "chapter_13_master",
        title: "Pellegrino dei Vettori Dati",
        icon: "🔁",
        desc: "Supera la Sfida di Padronanza del Capitolo 13 (Iterazione su Array e Stringhe).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(72)
    },
    {
        id: "chapter_14_master",
        title: "Chirurgo dello Slicing",
        icon: "✂️",
        desc: "Supera la Sfida di Padronanza del Capitolo 14 (Array Approfonditi e Slicing).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(76)
    },
    {
        id: "chapter_15_master",
        title: "Custode dei Dizionari",
        icon: "📖",
        desc: "Supera la Sfida di Padronanza del Capitolo 15 (Dizionari).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(82)
    },
    {
        id: "chapter_16_master",
        title: "Gestore di Bilancio",
        icon: "📊",
        desc: "Completa il Progetto del Capitolo 16 (Registro Spese Giornaliere).",
        xpReward: 75,
        condition: (state) => state.finishedLessons.includes(89)
    },
    {
        id: "part1_grandmaster",
        title: "Campione dei Fondamenti GDScript",
        icon: "🏆",
        desc: "Completa con successo tutte le Sfide Finali del Capitolo 17 e termina la Parte 1!",
        xpReward: 250,
        condition: (state) => state.finishedLessons.includes(92)
    },
    {
        id: "clean_run",
        title: "Al Primo Colpo",
        icon: "🎯",
        desc: "Completa un livello senza visualizzare alcun suggerimento.",
        xpReward: 30,
        condition: (state, meta) => meta && meta.hintsUsed === 0
    },
    {
        id: "century_xp",
        title: "Centurione dell'Accademia",
        icon: "⭐",
        desc: "Accumula almeno 500 Punti Esperienza totali.",
        xpReward: 50,
        condition: (state) => state.xp >= 500
    },
    {
        id: "profile_custom",
        title: "Identità Creata",
        icon: "👤",
        desc: "Personalizza il tuo nome, tag e colore nel Profilo Giocatore.",
        xpReward: 25,
        condition: (state) => state.profileCustomized === true
    },
    {
        id: "quest_hunter",
        title: "Cacciatore di Taglie",
        icon: "🎯",
        desc: "Riscatta la tua prima missione giornaliera.",
        xpReward: 30,
        condition: (state) => state.claimedQuestsCount > 0
    }
];

// ==========================================
// CONFIGURAZIONE LIVELLI, STREAK E MISSIONI
// ==========================================
const LEVELS_CONFIG = Array.from({length:50},(_,index)=>{
    const level=index+1;
    const minXp=(level-1)*(10*level+40);
    const nextLevel=level+1;
    const maxXp=(nextLevel-1)*(10*nextLevel+40)-1;
    const title=level>=50?'Leggenda':level>=40?'Maestro':
        level>=30?'Architetto':level>=20?'Forgiatore':
        level>=10?'Esploratore':'Apprendista Godot';
    return {level,title,minXp,maxXp};
});

const STREAK_TIERS = {
    rilassato: { target: 2, label: "Rilassato", icon: "🌱", desc: "2 giorni / settimana" },
    concentrato: { target: 4, label: "Concentrato", icon: "🎯", desc: "4 giorni / settimana" },
    lockin: { target: 6, label: "Lock in", icon: "🔥", desc: "6 giorni / settimana" }
};

const DAILY_QUESTS_CONFIG = [
    {
        id: "daily_exercise",
        title: "Studio Quotidiano",
        desc: "Completa con successo almeno 1 livello oggi",
        icon: "📖",
        target: 1,
        xpReward: 10
    },
    {
        id: "review_success",
        title: "Ripasso del Giorno",
        desc: "Completa una variante di ripasso (anche con suggerimenti)",
        icon: "book-open",
        target: 1,
        xpReward: 10
    },
    {
        id: "study_variety",
        title: "Studio Completo",
        desc: "Completa un esercizio del corso e un ripasso nello stesso giorno",
        icon: "layers",
        target: 1,
        xpReward: 10
    }
];

const PROJECTS_DATA = [
    {
        id: "project_bill",
        title: "Calcolatore del Conto & Mancia",
        icon: "🧾",
        badge: "PARTE 1 - CAP. 8",
        badgeClass: "badge-playable",
        isPlayable: true,
        desc: "Programma un sistema completo di calcolo scontrino: subtotale, imposte, percentuale mancia e divisione in quote eque.",
        levelReq: "Capitolo 8 sbloccato",
        estimatedTime: "25 min",
        topics: ["Variabili", "Float", "Operatori Aritmetici", "Format String"]
    },
    {
        id: "project_fizzbuzz",
        title: "FizzBuzz Dinamico con Parametri",
        icon: "🎯",
        badge: "PARTE 1 - CAP. 11",
        badgeClass: "badge-playable",
        isPlayable: true,
        desc: "L'iconico algoritmo di intervista tecnica adattato a Godot con personalizzazione delle etichette e condizioni combinate.",
        levelReq: "Capitolo 11 sbloccato",
        estimatedTime: "30 min",
        topics: ["Cicli For", "Modulo %", "Condizioni if/elif/else", "Funzioni"]
    },
    {
        id: "project_expenses",
        title: "Registro Spese e Bilancio",
        icon: "📊",
        badge: "PARTE 1 - CAP. 16",
        badgeClass: "badge-playable",
        isPlayable: true,
        desc: "Gestore contabile completo: tracciamento uscite, somme cumulative, media giornaliera e categoria di spesa massima.",
        levelReq: "Capitolo 16 sbloccato",
        estimatedTime: "40 min",
        topics: ["Array", "Dizionari", "Iterazione", "Statistiche"]
    }
];

// Esporta gli oggetti globalmente per accesso da console e test
if (typeof window !== 'undefined') {
    window.CHAPTERS_DATA = CHAPTERS_DATA;
    window.LESSONS_DATA = LESSONS_DATA;
    window.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
    window.LEVELS_CONFIG = LEVELS_CONFIG;
    window.STREAK_TIERS = STREAK_TIERS;
    window.DAILY_QUESTS_CONFIG = DAILY_QUESTS_CONFIG;
    window.PROJECTS_DATA = PROJECTS_DATA;
    window.CONCEPTS_CATALOG = CONCEPTS_CATALOG;
    window.getLessonConcept = getLessonConcept;
}

if (typeof global !== 'undefined') {
    global.CHAPTERS_DATA = CHAPTERS_DATA;
    global.LESSONS_DATA = LESSONS_DATA;
    global.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
    global.LEVELS_CONFIG = LEVELS_CONFIG;
    global.STREAK_TIERS = STREAK_TIERS;
    global.DAILY_QUESTS_CONFIG = DAILY_QUESTS_CONFIG;
    global.PROJECTS_DATA = PROJECTS_DATA;
    global.CONCEPTS_CATALOG = CONCEPTS_CATALOG;
    global.getLessonConcept = getLessonConcept;
    global.formatExecutionCheck = formatExecutionCheck;
    global.stripCommentsAndStrings = stripCommentsAndStrings;
    global.hasRealComment = hasRealComment;
}

