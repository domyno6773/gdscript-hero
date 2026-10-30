// Dataset delle Lezioni e Capitoli per GDScript Hero (Parte 1: I Fondamenti di GDScript 4)
// Sostituzione completa del percorso formativo: 17 Capitoli, 92 Lezioni, 100% Originale e Ottimizzato

const CHAPTERS_DATA = [
    {
        id: 1,
        title: "Capitolo 1: Introduzione a GDScript 4",
        badge: "CAPITOLO 1",
        desc: "Primi passi con Godot Engine 4: la funzione _ready(), commenti e output con print.",
        icon: "🚀"
    },
    {
        id: 2,
        title: "Capitolo 2: Variabili (Parte 1)",
        badge: "CAPITOLO 2",
        desc: "Creazione di variabili con var, tipi di dato primitivi int, float, string e bool.",
        icon: "📦"
    },
    {
        id: 3,
        title: "Capitolo 3: Variabili (Parte 2 & Tipizzazione)",
        badge: "CAPITOLO 3",
        desc: "Tipizzazione statica di Godot 4, inferenza del tipo :=, costanti const e type casting.",
        icon: "🏷️"
    },
    {
        id: 4,
        title: "Capitolo 4: Operatori Aritmetici",
        badge: "CAPITOLO 4",
        desc: "Aritmetica (+, -, *, /, %), divisione intera, operatore modulo e operatori composti.",
        icon: "➗"
    },
    {
        id: 5,
        title: "Capitolo 5: Operatori Logici e Condizioni",
        badge: "CAPITOLO 5",
        desc: "Condizioni logiche avanzate (and, or, not) e operatore ternario compatto.",
        icon: "⚖️"
    },
    {
        id: 6,
        title: "Capitolo 6: Strutture Decisionali",
        badge: "CAPITOLO 6",
        desc: "Strutture condizionali if, elif, else, annidamento e match statement (switch).",
        icon: "🔀"
    },
    {
        id: 7,
        title: "Capitolo 7: Input e Output di Base",
        badge: "CAPITOLO 7",
        desc: "Stampa avanzata, output con variabili, formattazione stringhe ed elaborazione dati.",
        icon: "💻"
    },
    {
        id: 8,
        title: "Capitolo 8: Calcolatore del Conto",
        badge: "CAPITOLO 8",
        desc: "Progetto interattivo: calcolatore del conto con ripartizione e calcolo mancia.",
        icon: "🧾"
    },
    {
        id: 9,
        title: "Capitolo 9: Cicli e Iterazione",
        badge: "CAPITOLO 9",
        desc: "Cicli for con range, cicli while, controllo del flusso con break e continue.",
        icon: "🔄"
    },
    {
        id: 10,
        title: "Capitolo 10: Funzioni e Parametri",
        badge: "CAPITOLO 10",
        desc: "Dichiarazione di funzioni personalizzate func, argomenti, valori di default e return.",
        icon: "⚙️"
    },
    {
        id: 11,
        title: "Capitolo 11: FizzBuzz con Variante",
        badge: "CAPITOLO 11",
        desc: "Progetto pratico: l'algoritmo classico FizzBuzz implementato ed esteso per Godot.",
        icon: "🎯"
    },
    {
        id: 12,
        title: "Capitolo 12: Nozioni di Base sugli Array",
        badge: "CAPITOLO 12",
        desc: "Array e liste ordinate: creazione, indici, metodi append/size e array tipizzati.",
        icon: "📚"
    },
    {
        id: 13,
        title: "Capitolo 13: Iterazione su Array e Stringhe",
        badge: "CAPITOLO 13",
        desc: "Scansione di collezioni: iterazione con for, indici, calcolo totale, media e inversione.",
        icon: "🔁"
    },
    {
        id: 14,
        title: "Capitolo 14: Array Approfonditi e Slicing",
        badge: "CAPITOLO 14",
        desc: "Manipolazione avanzata di array: slicing [da:a], concatenazione, membership in/not in.",
        icon: "✂️"
    },
    {
        id: 15,
        title: "Capitolo 15: Dizionari (Dictionary)",
        badge: "CAPITOLO 15",
        desc: "Dizionari (Dictionary): coppie chiave-valore, accesso, modifica, iterazione e metodi.",
        icon: "📖"
    },
    {
        id: 16,
        title: "Capitolo 16: Registro Spese Giornaliere",
        badge: "CAPITOLO 16",
        desc: "Grande progetto pratico: gestione completa di un registro spese quotidiane.",
        icon: "📊"
    },
    {
        id: 17,
        title: "Capitolo 17: Le Sfide Finali",
        badge: "CAPITOLO 17",
        desc: "Sfide conclusive del percorso Fondamenti per mettere alla prova le tue abilità.",
        icon: "🏆"
    }
];

// ==========================================
// CATALOGO DEI CONCETTI DIDATTICI STABILI
// ==========================================
const CONCEPTS_CATALOG = {
    syntax_basics: {
        id: "syntax_basics",
        name: "Sintassi Base e Output",
        chapterId: 1,
        desc: "Istruzioni print(), funzione _ready(), commenti e output testuale."
    },
    variables_basics: {
        id: "variables_basics",
        name: "Variabili Fondamentali",
        chapterId: 2,
        desc: "Dichiarazione var, tipi int, float, string e bool."
    },
    type_system: {
        id: "type_system",
        name: "Tipizzazione e Costanti",
        chapterId: 3,
        desc: "Tipizzazione statica esplicita : Type, inferenza := e costanti const."
    },
    operators_math: {
        id: "operators_math",
        name: "Operatori Aritmetici",
        chapterId: 4,
        desc: "Operazioni aritmetiche (+, -, *, /, %), divisione intera e modulo."
    },
    conditions_logic: {
        id: "conditions_logic",
        name: "Operatori Logici e Condizioni",
        chapterId: 5,
        desc: "Operatori di confronto, operatori logici (and, or, not) e operatore ternario."
    },
    control_flow: {
        id: "control_flow",
        name: "Strutture Decisionali",
        chapterId: 6,
        desc: "Diramazioni condizionali if, elif, else e match statement."
    },
    io_basics: {
        id: "io_basics",
        name: "Input e Output di Base",
        chapterId: 7,
        desc: "Stampa avanzata, manipolazione stringhe e formattazione."
    },
    project_bill: {
        id: "project_bill",
        name: "Progetto: Calcolatore del Conto",
        chapterId: 8,
        desc: "Applicazione pratica con calcolo somme, percentuali e divisioni."
    },
    loops_iteration: {
        id: "loops_iteration",
        name: "Cicli e Iterazione",
        chapterId: 9,
        desc: "Cicli for con range(), cicli while, break e continue."
    },
    functions_scope: {
        id: "functions_scope",
        name: "Funzioni e Parametri",
        chapterId: 10,
        desc: "Dichiarazione func, parametri, valori di default, return e visibilità."
    },
    project_fizzbuzz: {
        id: "project_fizzbuzz",
        name: "Progetto: FizzBuzz con Variante",
        chapterId: 11,
        desc: "Implementazione algoritmica di FizzBuzz ed estensioni per giochi."
    },
    arrays_collections: {
        id: "arrays_collections",
        name: "Array e Liste",
        chapterId: 12,
        desc: "Liste ordinate, indicizzazione, metodi append/size e array tipizzati."
    },
    collection_iteration: {
        id: "collection_iteration",
        name: "Iterazione su Collezioni",
        chapterId: 13,
        desc: "Scansione for di array e stringhe, calcoli cumulativi e inversione."
    },
    arrays_advanced: {
        id: "arrays_advanced",
        name: "Array Avanzati e Slicing",
        chapterId: 14,
        desc: "Slicing [a:b], concatenazione array e membership in/not in."
    },
    dictionaries: {
        id: "dictionaries",
        name: "Dizionari (Dictionary)",
        chapterId: 15,
        desc: "Coppie chiave-valore {}, accesso, modifica, iterazione e metodi."
    },
    project_expenses: {
        id: "project_expenses",
        name: "Progetto: Registro Spese",
        chapterId: 16,
        desc: "Sistema completo di gestione e aggregazione dati di spesa."
    },
    challenges: {
        id: "challenges",
        name: "Sfide di Padronanza Finale",
        chapterId: 17,
        desc: "Sfide di programmazione per consolidare tutti i concetti della Parte 1."
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
        return { desc: "Codice eseguito senza errori", passed: true, diff: null };
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
            diff: `⚠️ Errore di Sintassi: verifica due punti (:), indentazione a 4 spazi o virgolette non chiuse.\nDettaglio: ${err}`
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
// DATASET COMPLETO DELLE 92 LEZIONI
// ==========================================
const LESSONS_DATA = [
    {
        id: 1,
        conceptId: "syntax_basics",
        conceptTags: ["print", "ready", "syntax"],
        chapterId: 1,
        isMastery: false,
        title: "1. Il Linguaggio GDScript (print)",
        icon: "🌱",
        xp: 50,
        expectedOutput: "Hello GDScript!",
        theory: "\n                <p>Benvenuto in <strong>GDScript Hero</strong>! In questo percorso imparerai a programmare per <strong>Godot Engine 4</strong> partendo dalle basi assolute fino all'architettura avanzata a oggetti.</p>\n                <p>In Godot, ogni comportamento di gioco viene aggiunto tramite uno script associato a un <strong>nodo</strong> (Node). La funzione speciale <code>_ready()</code> viene eseguita automaticamente dal motore quando il nodo entra nella scena ed è pronto all'azione.</p>\n                <p>Per inviare messaggi alla console di debug usiamo la funzione integrata <code>print(...)</code> con il testo racchiuso tra virgolette:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">extends</span> Node\n\n<span class=\"k\">func</span> <span class=\"nf\">_ready</span>():\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Hello GDScript!\"</span>)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>All'interno della funzione <code>_ready()</code>, usa <code>print(...)</code> per stampare: <br><code>\"Hello GDScript!\"</code></li>\n                    <li>Fai attenzione all'indentazione a 4 spazi sotto <code>func _ready():</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Stampa il messaggio richiesto\n    print(\"Hello GDScript!\")\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Hello GDScript!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La funzione _ready() è il punto di ingresso dello script quando il gioco parte."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inserisci print(\"Hello GDScript!\") indentato sotto func _ready():."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il codice è già impostato nel riquadro: premi 'Esegui Codice' per verificare l'output."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.trim() === "Hello GDScript!");
                        tests.push({ desc: "Console stampa 'Hello GDScript!'", passed: hasLog, diff: hasLog ? null : `Atteso: 'Hello GDScript!', Ricevuto: '${(result.logs || []).join(' | ')}'` });
                        return tests;
        }
    },
    {
        id: 2,
        conceptId: "syntax_basics",
        conceptTags: ["print", "ready", "string"],
        chapterId: 1,
        isMastery: false,
        title: "2. Ciao Mondo! (Hello World!)",
        icon: "🌍",
        xp: 50,
        expectedOutput: "Hello World!",
        theory: "\n                <p>La tradizione di ogni programmatore è iniziare stampando <code>\"Hello World!\"</code> sullo schermo.</p>\n                <p>Le stringhe in GDScript possono essere racchiuse sia da virgolette doppie <code>\"...\"</code> che singole <code>'...'</code>. Qualsiasi carattere all'interno delle virgolette viene interpretato letteralmente.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">func</span> <span class=\"nf\">_ready</span>():\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Hello World!\"</span>)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Completa la riga <code>print(\"\")</code> inserendo tra le virgolette il testo esatto: <br><code>Hello World!</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Scrivi il tuo messaggio tra le virgolette\n    print(\"\")\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Hello World!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Inserisci il testo esatto tra le virgolette di print(\"\")."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Hello World!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Attenzione alle maiuscole e al punto esclamativo finale."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.trim() === "Hello World!");
                        tests.push({ desc: "Console stampa 'Hello World!'", passed: hasLog, diff: hasLog ? null : `Atteso: 'Hello World!', Ricevuto: '${(result.logs || []).join(' | ')}'` });
                        return tests;
        }
    },
    {
        id: 3,
        conceptId: "syntax_basics",
        conceptTags: ["comments", "syntax"],
        chapterId: 1,
        isMastery: false,
        title: "3. Commenti nel Codice (#)",
        icon: "💬",
        xp: 50,
        expectedOutput: "Hello!",
        theory: "\n                <p>I commenti sono annotazioni utili per spiegare cosa fa il codice e vengono completamente ignorati dal motore di gioco durante l'esecuzione.</p>\n                <p>In GDScript i commenti a riga singola iniziano con il simbolo cancelletto <code>#</code>. Tutto ciò che segue il cancelletto su quella riga non viene eseguito:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"c\"># Questa riga è un commento esplicativo</span>\n<span class=\"nb\">print</span>(<span class=\"s\">\"Eseguito!\"</span>) <span class=\"c\"># Anche questo alla fine è un commento</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Il programma attuale stampa due righe: <code>Hello!</code> e <code>Goodbye!</code>.</li>\n                    <li>Trasforma in commento la riga che stampa <code>Goodbye!</code> aggiungendo un <code>#</code> all'inizio.</li>\n                    <li>Non cancellare la riga: commentala soltanto, così che venga stampato solo <code>Hello!</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    print(\"Hello!\")\n    print(\"Goodbye!\")\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Hello!\")\n    # print(\"Goodbye!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Metti il carattere cancelletto '#' davanti all'istruzione che non vuoi eseguire."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "# print(\"Goodbye!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La riga print(\"Hello!\") deve rimanere intatta, mentre la seconda riga deve essere commentata."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const printsHello = logs.includes("Hello!");
                        const noGoodbye = !logs.includes("Goodbye!");
                        tests.push({ desc: "Stampa 'Hello!'", passed: printsHello, diff: printsHello ? null : "Manca 'Hello!'" });
                        tests.push({ desc: "Non stampa 'Goodbye!' (riga commentata)", passed: noGoodbye, diff: noGoodbye ? null : "La riga 'Goodbye!' non è stata commentata" });
                        return tests;
        }
    },
    {
        id: 4,
        conceptId: "syntax_basics",
        conceptTags: ["syntax", "ready", "structure"],
        chapterId: 1,
        isMastery: true,
        title: "4. Struttura del Programma (Sfida)",
        icon: "🏗️",
        xp: 75,
        expectedOutput: "Ready!\nLet's go!",
        theory: "\n                <p>La struttura tipica di uno script Godot comprende:</p>\n                <ol>\n                    <li><code>extends Node</code>: la classe base da cui eredita lo script.</li>\n                    <li>La definizione della funzione con <code>func nome():</code> (notare i due punti finali!).</li>\n                    <li>Il corpo della funzione indentato di 4 spazi o un tab.</li>\n                </ol>\n            ",
        task: "\n                <ul>\n                    <li>Correggi gli errori di sintassi nello script in modo che stampi su due righe:</li>\n                    <li><code>Ready!</code></li>\n                    <li><code>Let's go!</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready()\n    print(\"Ready!\")\n    print(\"Let's go!\")\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Ready!\")\n    print(\"Let's go!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "In GDScript dopo il nome e le parentesi di una funzione servono i due punti ':'."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func _ready(): con i due punti alla fine della riga."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Aggiungi ':' subito dopo func _ready()."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const okReady = logs.includes("Ready!");
                        const okGo = logs.includes("Let's go!");
                        tests.push({ desc: "Stampa 'Ready!'", passed: okReady, diff: okReady ? null : "Manca 'Ready!'" });
                        tests.push({ desc: "Stampa 'Let\'s go!'", passed: okGo, diff: okGo ? null : "Manca 'Let\'s go!'" });
                        return tests;
        }
    },
    {
        id: 5,
        conceptId: "variables_basics",
        conceptTags: ["var", "int", "float"],
        chapterId: 2,
        isMastery: false,
        title: "5. Numeri Interi e Decimali (int & float)",
        icon: "🔢",
        xp: 50,
        expectedOutput: "Coins: 25\nSpeed: 3.5",
        theory: "\n                <p>Una <strong>variabile</strong> è un contenitore a cui diamo un nome per memorizzare dati in memoria.</p>\n                <p>In GDScript si usa la parola chiave <code>var</code> per dichiarare una variabile. Godot distingue principalmente due tipi di numeri:</p>\n                <ul>\n                    <li><code>int</code>: numeri interi (es. <code>1</code>, <code>25</code>, <code>-10</code>). Ottimi per monete, vite, livelli.</li>\n                    <li><code>float</code>: numeri con la virgola / decimali (es. <code>3.5</code>, <code>0.01</code>, <code>9.8</code>). Usati per velocità, coordinate fisiche, timer.</li>\n                </ul>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> punteggio = 100\n<span class=\"k\">var</span> velocita = 4.5</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Crea due variabili dentro <code>_ready()</code>:</li>\n                    <li><code>coins</code> con il valore intero <code>25</code></li>\n                    <li><code>speed</code> con il valore decimale <code>3.5</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Crea coins (25) e speed (3.5) qui sotto\n    pass\n    print(\"Coins: \", coins)\n    print(\"Speed: \", speed)\n",
        solution: "extends Node\n\nfunc _ready():\n    var coins = 25\n    var speed = 3.5\n    print(\"Coins: \", coins)\n    print(\"Speed: \", speed)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dichiara le variabili usando var nome = valore."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var coins = 25\nvar speed = 3.5"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Sostituisci 'pass' con le due righe di dichiarazione."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const coinsOk = result.scope && result.scope.coins === 25;
                        const speedOk = result.scope && Math.abs(result.scope.speed - 3.5) < 0.001;
                        tests.push({ desc: "Variabile 'coins' uguale a 25", passed: coinsOk, diff: coinsOk ? null : `Trovato: ${result.scope?.coins}` });
                        tests.push({ desc: "Variabile 'speed' uguale a 3.5", passed: speedOk, diff: speedOk ? null : `Trovato: ${result.scope?.speed}` });
                        return tests;
        }
    },
    {
        id: 6,
        conceptId: "variables_basics",
        conceptTags: ["var", "string"],
        chapterId: 2,
        isMastery: false,
        title: "6. Stringhe di Testo (String)",
        icon: "📝",
        xp: 50,
        expectedOutput: "Imparo GDScript con GDScript Hero!",
        theory: "\n                <p>Il tipo <code>String</code> serve a memorizzare testo, nomi di personaggi, dialoghi e percorsi di risorse.</p>\n                <p>Basta assegnare un valore racchiuso tra virgolette a una variabile <code>var</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> nome_eroe = <span class=\"s\">\"Godot Warrior\"</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Crea una variabile chiamata <code>hero_msg</code> con il valore esatto: <br><code>\"Imparo GDScript con GDScript Hero!\"</code></li>\n                    <li>Stampala usando <code>print(hero_msg)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Crea hero_msg e stampala\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var hero_msg = \"Imparo GDScript con GDScript Hero!\"\n    print(hero_msg)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dichiara una variabile testuale assegnando una stringa tra virgolette."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var hero_msg = \"...\"\nprint(hero_msg)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "var hero_msg = \"Imparo GDScript con GDScript Hero!\"\nprint(hero_msg)"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Imparo GDScript con GDScript Hero!"));
                        tests.push({ desc: "Stampa la stringa hero_msg richiesta", passed: hasLog, diff: hasLog ? null : `Ricevuto: '${(result.logs || []).join(' | ')}'` });
                        return tests;
        }
    },
    {
        id: 7,
        conceptId: "variables_basics",
        conceptTags: ["var", "bool"],
        chapterId: 2,
        isMastery: false,
        title: "7. Valori Booleani (bool)",
        icon: "🔘",
        xp: 50,
        expectedOutput: "Alive: true\nHas Key: false",
        theory: "\n                <p>I valori booleani (<code>bool</code>) possono essere solo <code>true</code> (vero) o <code>false</code> (falso), rigorosamente in minuscolo.</p>\n                <p>Sono fondamentali nello sviluppo dei giochi per tenere traccia di stati e condizioni: il giocatore è vivo? Il salto è sbloccato? Il forziere è aperto?</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> scudo_attivo = <span class=\"kc\">true</span>\n<span class=\"k\">var</span> in_pausa = <span class=\"kc\">false</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Crea due variabili booleane dentro <code>_ready()</code>:</li>\n                    <li><code>is_alive</code> con valore <code>true</code></li>\n                    <li><code>has_key</code> con valore <code>false</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Crea is_alive (true) e has_key (false)\n    pass\n    print(\"Alive: \", is_alive)\n    print(\"Has Key: \", has_key)\n",
        solution: "extends Node\n\nfunc _ready():\n    var is_alive = true\n    var has_key = false\n    print(\"Alive: \", is_alive)\n    print(\"Has Key: \", has_key)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa le parole chiave booleane true e false (tutto minuscolo, senza virgolette)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var is_alive = true\nvar has_key = false"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Scrivi le due dichiarazioni sopra i print."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const aliveOk = result.scope && result.scope.is_alive === true;
                        const keyOk = result.scope && result.scope.has_key === false;
                        tests.push({ desc: "is_alive è true", passed: aliveOk, diff: aliveOk ? null : `is_alive: ${result.scope?.is_alive}` });
                        tests.push({ desc: "has_key è false", passed: keyOk, diff: keyOk ? null : `has_key: ${result.scope?.has_key}` });
                        return tests;
        }
    },
    {
        id: 8,
        conceptId: "variables_basics",
        conceptTags: ["var", "null"],
        chapterId: 2,
        isMastery: false,
        title: "8. Variabili Vuote e null",
        icon: "🫙",
        xp: 50,
        expectedOutput: "Weapon: <null>\nShield: <null>",
        theory: "\n                <p>A volte una variabile non possiede ancora un valore al momento della dichiarazione (ad esempio l'arma equipaggiata quando il giocatore inizia senza nulla).</p>\n                <p>In GDScript possiamo assegnare esplicitamente <code>null</code>, oppure dichiarare la variabile senza assegnazione iniziale (il cui valore predefinito è <code>null</code>):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> arma = <span class=\"kc\">null</span>\n<span class=\"k\">var</span> armatura <span class=\"c\"># vale null</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara una variabile <code>weapon</code> assegnandole <code>null</code>.</li>\n                    <li>Dichiara una variabile <code>shield</code> senza assegnare alcun valore iniziale.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Dichiara weapon = null e shield vuota\n    pass\n    print(\"Weapon: \", weapon)\n    print(\"Shield: \", shield)\n",
        solution: "extends Node\n\nfunc _ready():\n    var weapon = null\n    var shield\n    print(\"Weapon: \", weapon)\n    print(\"Shield: \", shield)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "null indica l'assenza di valore o un oggetto non ancora istanziato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var weapon = null\nvar shield"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Dichiara weapon con '= null' e shield con solo 'var shield'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasWeapon = result.scope && result.scope.weapon === null;
                        const hasShield = result.scope && ('shield' in result.scope);
                        tests.push({ desc: "weapon vale null", passed: hasWeapon, diff: hasWeapon ? null : `weapon: ${result.scope?.weapon}` });
                        tests.push({ desc: "shield dichiarata", passed: hasShield, diff: hasShield ? null : "shield non trovata" });
                        return tests;
        }
    },
    {
        id: 9,
        conceptId: "variables_basics",
        conceptTags: ["naming", "snake_case"],
        chapterId: 2,
        isMastery: true,
        title: "9. Convenzioni di Denominazione (snake_case)",
        icon: "🐍",
        xp: 75,
        expectedOutput: "Hero 250 false",
        theory: "\n                <p>Nelle linee guida ufficiali di Godot e GDScript, le variabili e le funzioni utilizzano la convenzione <strong>snake_case</strong> (tutto minuscolo, parole separate da underscore <code>_</code>):</p>\n                <ul>\n                    <li>Corretto: <code>player_name</code>, <code>move_speed</code>, <code>is_game_over</code></li>\n                    <li>Sconsigliato: <code>PlayerName</code>, <code>moveSpeed</code></li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Rinomina le variabili in snake_case per far funzionare lo script:</li>\n                    <li><code>PlayerName</code> ➔ <code>player_name</code></li>\n                    <li><code>MoveSpeed</code> ➔ <code>move_speed</code></li>\n                    <li><code>IsGameOver</code> ➔ <code>is_game_over</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var PlayerName = \"Hero\"\n    var MoveSpeed = 250\n    var IsGameOver = false\n    print(player_name, \" \", move_speed, \" \", is_game_over)\n",
        solution: "extends Node\n\nfunc _ready():\n    var player_name = \"Hero\"\n    var move_speed = 250\n    var is_game_over = false\n    print(player_name, \" \", move_speed, \" \", is_game_over)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Le variabili devono corrispondere ai nomi usati dentro print()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var player_name = \"Hero\"\nvar move_speed = 250\nvar is_game_over = false"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Converti le maiuscole in minuscole separate da underscore."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const okName = result.scope && result.scope.player_name === "Hero";
                        const okSpeed = result.scope && result.scope.move_speed === 250;
                        const okOver = result.scope && result.scope.is_game_over === false;
                        tests.push({ desc: "player_name in snake_case", passed: okName, diff: okName ? null : "player_name errato" });
                        tests.push({ desc: "move_speed in snake_case", passed: okSpeed, diff: okSpeed ? null : "move_speed errato" });
                        tests.push({ desc: "is_game_over in snake_case", passed: okOver, diff: okOver ? null : "is_game_over errato" });
                        return tests;
        }
    },
    {
        id: 10,
        conceptId: "type_system",
        conceptTags: ["types", "static_typing"],
        chapterId: 3,
        isMastery: false,
        title: "10. Tipizzazione Esplicita (: Tipo)",
        icon: "🏷️",
        xp: 50,
        expectedOutput: "10 99.5 GDScript true",
        theory: "\n                <p>In Godot 4 la <strong>tipizzazione statica</strong> rende il codice più veloce, pulito e immune da bug. Specifichiamo il tipo aggiungendo <code>: Tipo</code> dopo il nome:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> livello: <span class=\"nb\">int</span> = 5\n<span class=\"k\">var</span> salute: <span class=\"nb\">float</span> = 100.0\n<span class=\"k\">var</span> nome: <span class=\"nb\">String</span> = <span class=\"s\">\"Alex\"</span>\n<span class=\"k\">var</span> attivo: <span class=\"nb\">bool</span> = <span class=\"kc\">true</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara con tipizzazione esplicita:</li>\n                    <li><code>count: int = 10</code></li>\n                    <li><code>total: float = 99.5</code></li>\n                    <li><code>title: String = \"GDScript\"</code></li>\n                    <li><code>active: bool = true</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Dichiara le 4 variabili tipizzate qui sotto\n    pass\n    print(count, \" \", total, \" \", title, \" \", active)\n",
        solution: "extends Node\n\nfunc _ready():\n    var count: int = 10\n    var total: float = 99.5\n    var title: String = \"GDScript\"\n    var active: bool = true\n    print(count, \" \", total, \" \", title, \" \", active)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La sintassi è: var nome: Tipo = valore"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var count: int = 10\nvar total: float = 99.5\nvar title: String = \"GDScript\"\nvar active: bool = true"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Inserisci le dichiarazioni al posto di 'pass'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.count === 10 && Math.abs(s.total - 99.5) < 0.001 && s.title === "GDScript" && s.active === true;
                        tests.push({ desc: "4 variabili tipizzate corrette", passed: ok, diff: ok ? null : "Valori o tipi non corretti" });
                        return tests;
        }
    },
    {
        id: 11,
        conceptId: "type_system",
        conceptTags: ["type_inference", "walrus"],
        chapterId: 3,
        isMastery: false,
        title: "11. Inferenza del Tipo (:=)",
        icon: "⚡",
        xp: 50,
        expectedOutput: "10 19.99 Hero true",
        theory: "\n                <p>Spesso scrivere <code>var x: int = 10</code> è ridondante perché il valore <code>10</code> è chiaramente un intero. In Godot 4 possiamo usare l'operatore di <strong>inferenza del tipo</strong> <code>:=</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> munizioni := 30 <span class=\"c\"># Godot assegna automaticamente il tipo int in modo permanente!</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Crea le variabili usando l'operatore di inferenza <code>:=</code>:</li>\n                    <li><code>quantity := 10</code></li>\n                    <li><code>price := 19.99</code></li>\n                    <li><code>game_name := \"Hero\"</code></li>\n                    <li><code>is_ready := true</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Usa := per creare quantity, price, game_name, is_ready\n    pass\n    print(quantity, \" \", price, \" \", game_name, \" \", is_ready)\n",
        solution: "extends Node\n\nfunc _ready():\n    var quantity := 10\n    var price := 19.99\n    var game_name := \"Hero\"\n    var is_ready := true\n    print(quantity, \" \", price, \" \", game_name, \" \", is_ready)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa ':=' invece di '=' per dedurre il tipo dal valore assegnato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var quantity := 10\nvar price := 19.99"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "var game_name := \"Hero\"\nvar is_ready := true"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.quantity === 10 && Math.abs(s.price - 19.99) < 0.001 && s.game_name === "Hero" && s.is_ready === true;
                        tests.push({ desc: "Variabili inferite con :=", passed: ok, diff: ok ? null : "Valori errati" });
                        return tests;
        }
    },
    {
        id: 12,
        conceptId: "type_system",
        conceptTags: ["const", "constants"],
        chapterId: 3,
        isMastery: false,
        title: "12. Costanti di Gioco (const)",
        icon: "🔒",
        xp: 50,
        expectedOutput: "Max: 3 Gravity: 9.8",
        theory: "\n                <p>Una <strong>costante</strong> è un valore che una volta assegnato non può mai più essere modificato durante il gioco.</p>\n                <p>Si dichiara con la parola chiave <code>const</code> e, per convenzione, il suo nome viene scritto in <code>MAIUSCOLO_CON_UNDERSCORE</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">const</span> VELOCITA_MASSIMA = 500.0</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara due costanti:</li>\n                    <li><code>const MAX_LIVES = 3</code></li>\n                    <li><code>const GRAVITY = 9.8</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Dichiara MAX_LIVES (3) e GRAVITY (9.8)\n    pass\n    print(\"Max: \", MAX_LIVES, \" Gravity: \", GRAVITY)\n",
        solution: "extends Node\n\nfunc _ready():\n    const MAX_LIVES = 3\n    const GRAVITY = 9.8\n    print(\"Max: \", MAX_LIVES, \" Gravity: \", GRAVITY)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa const al posto di var."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "const MAX_LIVES = 3\nconst GRAVITY = 9.8"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Scrivi le due costanti prima dell'istruzione print."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.MAX_LIVES === 3 && Math.abs(s.GRAVITY - 9.8) < 0.001;
                        tests.push({ desc: "Costanti MAX_LIVES e GRAVITY definite", passed: ok, diff: ok ? null : "Costanti non definite o con valori errati" });
                        return tests;
        }
    },
    {
        id: 13,
        conceptId: "type_system",
        conceptTags: ["types", "recap"],
        chapterId: 3,
        isMastery: false,
        title: "13. Ripasso - Inizializzare le Variabili",
        icon: "🔄",
        xp: 50,
        expectedOutput: "88 4.9 Godot true",
        theory: "\n                <p>Consolidiamo quanto appreso finora dichiarando variabili con tipi espliciti in una scena Godot.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara queste variabili con i tipi espliciti:</li>\n                    <li><code>k: int = 88</code></li>\n                    <li><code>rating: float = 4.9</code></li>\n                    <li><code>label: String = \"Godot\"</code></li>\n                    <li><code>complete: bool = true</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Inizializza k, rating, label, complete\n    pass\n    print(k, \" \", rating, \" \", label, \" \", complete)\n",
        solution: "extends Node\n\nfunc _ready():\n    var k: int = 88\n    var rating: float = 4.9\n    var label: String = \"Godot\"\n    var complete: bool = true\n    print(k, \" \", rating, \" \", label, \" \", complete)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa var nome: Tipo = valore per ciascuna variabile."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var k: int = 88\nvar rating: float = 4.9"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "var label: String = \"Godot\"\nvar complete: bool = true"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.k === 88 && Math.abs(s.rating - 4.9) < 0.001 && s.label === "Godot" && s.complete === true;
                        tests.push({ desc: "Variabili inizializzate correttamente", passed: ok, diff: ok ? null : "Valori errati" });
                        return tests;
        }
    },
    {
        id: 14,
        conceptId: "type_system",
        conceptTags: ["casting", "conversion"],
        chapterId: 3,
        isMastery: true,
        title: "14. Conversione di Tipo (Casting)",
        icon: "🔀",
        xp: 75,
        expectedOutput: "19 42 100",
        theory: "\n                <p>Il <strong>type casting</strong> permette di convertire un valore da un tipo all'altro tramite funzioni di conversione dedicate:</p>\n                <ul>\n                    <li><code>int(19.99)</code> ➔ converte in intero troncando i decimali (diventa <code>19</code>).</li>\n                    <li><code>int(\"42\")</code> ➔ converte il testo in numero intero (diventa <code>42</code>).</li>\n                    <li><code>str(100)</code> ➔ converte un numero in stringa (diventa <code>\"100\"</code>).</li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Date le variabili iniziali <code>price = 19.99</code>, <code>level_str = \"42\"</code> e <code>score = 100</code>:</li>\n                    <li>Crea <code>int_price</code> convertendo <code>price</code> in <code>int</code></li>\n                    <li>Crea <code>level</code> convertendo <code>level_str</code> in <code>int</code></li>\n                    <li>Crea <code>str_score</code> convertendo <code>score</code> in <code>String</code> con <code>str(...)</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var price = 19.99\n    var level_str = \"42\"\n    var score = 100\n    # Esegui il casting qui sotto\n    pass\n    print(int_price, \" \", level, \" \", str_score)\n",
        solution: "extends Node\n\nfunc _ready():\n    var price = 19.99\n    var level_str = \"42\"\n    var score = 100\n    var int_price := int(price)\n    var level := int(level_str)\n    var str_score := str(score)\n    print(int_price, \" \", level, \" \", str_score)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa int(...) e str(...) per convertire i valori."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var int_price = int(price)\nvar level = int(level_str)\nvar str_score = str(score)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "int_price sarà 19, level sarà 42 e str_score sarà \"100\"."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.int_price === 19 && s.level === 42 && String(s.str_score) === "100";
                        tests.push({ desc: "Casting eseguito correttamente (19, 42, '100')", passed: ok, diff: ok ? null : "Casting non corretto" });
                        return tests;
        }
    },
    {
        id: 15,
        conceptId: "operators_math",
        conceptTags: ["operators", "arithmetic"],
        chapterId: 4,
        isMastery: false,
        title: "15. Operatori Aritmetici (+, -, *, /)",
        icon: "➕",
        xp: 50,
        expectedOutput: "c = 2.0",
        theory: "\n                <p>GDScript supporta tutti gli operatori matematici standard: <code>+</code> (addizione), <code>-</code> (sottrazione), <code>*</code> (moltiplicazione), <code>/</code> (divisione).</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> a = 10.0\n<span class=\"k\">var</span> b = 2.5\n<span class=\"k\">var</span> quoziente = a / b</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>a = 5.2</code></li>\n                    <li>Dichiara <code>b = 2.6</code></li>\n                    <li>Dichiara <code>c</code> calcolando il risultato di <code>a / b</code></li>\n                    <li>Stampa <code>\"c = \", c</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Dichiara a (5.2), b (2.6) e c (a / b)\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var a := 5.2\n    var b := 2.6\n    var c := a / b\n    print(\"c = \", c)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Assegna a 'c' l'espressione a / b."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var a = 5.2\nvar b = 2.6\nvar c = a / b\nprint(\"c = \", c)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "5.2 diviso 2.6 produce esattamente 2.0."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.c && Math.abs(s.c - 2.0) < 0.001;
                        tests.push({ desc: "c calcolato correttamente (2.0)", passed: ok, diff: ok ? null : `Trovato c = ${s.c}` });
                        return tests;
        }
    },
    {
        id: 16,
        conceptId: "operators_math",
        conceptTags: ["integer_division", "int"],
        chapterId: 4,
        isMastery: false,
        title: "16. Divisione Intera (senza virgola)",
        icon: "➗",
        xp: 50,
        expectedOutput: "Coins per player: 3",
        theory: "\n                <p>Quando dividi due numeri interi (<code>int / int</code>), GDScript scarta la parte decimale e restituisce solo la parte intera:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"nb\">print</span>(17 / 5) <span class=\"c\"># Stampa 3, non 3.4!</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>17 monete devono essere divise equamente tra 5 giocatori.</li>\n                    <li>Date <code>total_coins = 17</code> e <code>players = 5</code>:</li>\n                    <li>Calcola <code>coins_per_player = total_coins / players</code></li>\n                    <li>Stampa <code>\"Coins per player: \", coins_per_player</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var total_coins = 17\n    var players = 5\n    # Calcola coins_per_player e stampala\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var total_coins = 17\n    var players = 5\n    var coins_per_player = total_coins / players\n    print(\"Coins per player: \", coins_per_player)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La divisione tra due interi in GDScript restituisce sempre un intero."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var coins_per_player = total_coins / players"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "print(\"Coins per player: \", coins_per_player)"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.coins_per_player === 3;
                        tests.push({ desc: "coins_per_player uguale a 3", passed: ok, diff: ok ? null : `Trovato: ${s.coins_per_player}` });
                        return tests;
        }
    },
    {
        id: 17,
        conceptId: "operators_math",
        conceptTags: ["modulo", "remainder"],
        chapterId: 4,
        isMastery: false,
        title: "17. L'Operatore Modulo (%)",
        icon: "🔢",
        xp: 50,
        expectedOutput: "Resto 9 % 2: 1\nResto 11 % 2: 1",
        theory: "\n                <p>L'operatore <strong>modulo</strong> (<code>%</code>) calcola il <strong>resto</strong> di una divisione tra numeri interi.</p>\n                <p>È un operatore fondamentale nel gamedev: permette di verificare numeri pari/dispari (<code>n % 2 == 0</code>), gestire turni ciclici o timer che ripartono da zero.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"nb\">print</span>(10 % 3) <span class=\"c\"># 1 (perché 10 = 3 * 3 con resto 1)</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>a = 9</code>, <code>b = 2</code>, <code>c = 11</code></li>\n                    <li>Calcola <code>d = a % b</code> e <code>e = c % b</code></li>\n                    <li>Stampa i risultati: <code>\"Resto 9 % 2: \", d</code> e <code>\"Resto 11 % 2: \", e</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var a = 9\n    var b = 2\n    var c = 11\n    # Calcola d (a % b) ed e (c % b)\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var a = 9\n    var b = 2\n    var c = 11\n    var d = a % b\n    var e = c % b\n    print(\"Resto 9 % 2: \", d)\n    print(\"Resto 11 % 2: \", e)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa % per ottenere il resto della divisione."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var d = a % b\nvar e = c % b"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "9 % 2 vale 1, e 11 % 2 vale 1."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.d === 1 && s.e === 1;
                        tests.push({ desc: "Modulo d ed e calcolati correttamente (= 1)", passed: ok, diff: ok ? null : `d=${s.d}, e=${s.e}` });
                        return tests;
        }
    },
    {
        id: 18,
        conceptId: "operators_math",
        conceptTags: ["shortcuts", "assignment"],
        chapterId: 4,
        isMastery: false,
        title: "18. Scorciatoie Aritmetiche (+=, -=, *=)",
        icon: "⚡",
        xp: 50,
        expectedOutput: "Finale: 7",
        theory: "\n                <p>Spesso nei giochi dobbiamo aggiornare una variabile esistente (es. subire danni, guadagnare oro). Invece di scrivere <code>hp = hp - 10</code>, usiamo gli operatori composti:</p>\n                <ul>\n                    <li><code>x += 5</code> (somma 5 a x)</li>\n                    <li><code>x *= 2</code> (moltiplica x per 2)</li>\n                    <li><code>x -= 3</code> (sottrae 3 da x)</li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>La variabile <code>count</code> parte da <code>0</code>.</li>\n                    <li>Usa <code>count += 5</code> per aggiungere 5.</li>\n                    <li>Usa <code>count *= 2</code> per raddoppiare (diventa 10).</li>\n                    <li>Usa <code>count -= 3</code> per togliere 3 (diventa 7).</li>\n                    <li>Stampa <code>\"Finale: \", count</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var count = 0\n    # Applica le scorciatoie nell'ordine richiesto\n    pass\n    print(\"Finale: \", count)\n",
        solution: "extends Node\n\nfunc _ready():\n    var count = 0\n    count += 5\n    count *= 2\n    count -= 3\n    print(\"Finale: \", count)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa +=, *= e -= direttamente sulla variabile count."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "count += 5\ncount *= 2\ncount -= 3"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "0 + 5 = 5; 5 * 2 = 10; 10 - 3 = 7."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.count === 7;
                        tests.push({ desc: "count finale uguale a 7", passed: ok, diff: ok ? null : `Trovato: ${s.count}` });
                        return tests;
        }
    },
    {
        id: 19,
        conceptId: "operators_math",
        conceptTags: ["math", "puzzle"],
        chapterId: 4,
        isMastery: false,
        title: "19. Ripasso - Matematica Semplice",
        icon: "🧩",
        xp: 50,
        expectedOutput: "Prodotto: 24\nSomma: 10",
        theory: "\n                <p>Mettiamo alla prova le nostre capacità logiche con un piccolo puzzle matematico.</p>\n            ",
        task: "\n                <ul>\n                    <li>Trova due numeri interi <code>a</code> e <code>b</code> tali che:</li>\n                    <li>Il loro prodotto <code>a * b</code> sia <code>24</code></li>\n                    <li>La loro somma <code>a + b</code> sia <code>10</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Trova a e b giusti\n    var a = 0\n    var b = 0\n    var c = a * b\n    var d = a + b\n    print(\"Prodotto: \", c)\n    print(\"Somma: \", d)\n",
        solution: "extends Node\n\nfunc _ready():\n    var a = 6\n    var b = 4\n    var c = a * b\n    var d = a + b\n    print(\"Prodotto: \", c)\n    print(\"Somma: \", d)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Quali coppie di numeri moltiplicati danno 24? (1x24, 2x12, 3x8, 4x6...)"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Quale di queste coppie sommata dà 10? 4 + 6 = 10."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Imposta var a = 6 e var b = 4."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.c === 24 && s.d === 10;
                        tests.push({ desc: "Prodotto 24 e Somma 10 verificati", passed: ok, diff: ok ? null : `c=${s.c}, d=${s.d}` });
                        return tests;
        }
    },
    {
        id: 20,
        conceptId: "operators_math",
        conceptTags: ["comparison", "boolean"],
        chapterId: 4,
        isMastery: true,
        title: "20. Operatori di Confronto (==, !=, <, >)",
        icon: "⚖️",
        xp: 75,
        expectedOutput: "n3 = true",
        theory: "\n                <p>Gli operatori di confronto confrontano due valori e restituiscono un valore <code>bool</code> (<code>true</code> o <code>false</code>):</p>\n                <ul>\n                    <li><code>==</code> (uguale a)</li>\n                    <li><code>!=</code> (diverso da)</li>\n                    <li><code><</code> (minore di)</li>\n                    <li><code>></code> (maggiore di)</li>\n                    <li><code><=</code>, <code>>=</code> (minore/maggiore o uguale)</li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>n1 = 8</code> e <code>n2 = 9</code>.</li>\n                    <li>Dichiara <code>n3</code> assegnandole il confronto booleano: <code>n1 < n2</code>.</li>\n                    <li>Stampa <code>\"n3 = \", n3</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var n1 = 8\n    var n2 = 9\n    # Dichiara n3 che indica se n1 è minore di n2\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var n1 = 8\n    var n2 = 9\n    var n3 = n1 < n2\n    print(\"n3 = \", n3)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa il segno '<' tra n1 e n2."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var n3 = n1 < n2\nprint(\"n3 = \", n3)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Dato che 8 è minore di 9, n3 varrà true."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.n3 === true;
                        tests.push({ desc: "n3 confrontato correttamente (true)", passed: ok, diff: ok ? null : `Trovato: ${s.n3}` });
                        return tests;
        }
    },
    {
        id: 21,
        conceptId: "conditions_logic",
        conceptTags: ["and", "logical"],
        chapterId: 5,
        isMastery: false,
        title: "21. Operatore Logico AND (and)",
        icon: "🤝",
        xp: 50,
        expectedOutput: "Can Drive: true",
        theory: "\n                <p>L'operatore <code>and</code> restituisce <code>true</code> solo se <strong>entrambe</strong> le condizioni a sinistra e a destra sono vere.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> ha_chiave <span class=\"ow\">and</span> vicino_alla_porta:\n    apri_porta()</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Un giocatore può guidare se ha almeno 18 anni E possiede la patente.</li>\n                    <li>Date <code>age = 20</code> e <code>has_license = true</code>:</li>\n                    <li>Crea <code>can_drive = age >= 18 and has_license</code></li>\n                    <li>Stampa <code>\"Can Drive: \", can_drive</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var age = 20\n    var has_license = true\n    # Calcola can_drive e stampala\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var age = 20\n    var has_license = true\n    var can_drive = age >= 18 and has_license\n    print(\"Can Drive: \", can_drive)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Combina le due condizioni con la parola chiave 'and'."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var can_drive = age >= 18 and has_license"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "print(\"Can Drive: \", can_drive)"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.can_drive === true;
                        tests.push({ desc: "can_drive è true", passed: ok, diff: ok ? null : `Trovato: ${s.can_drive}` });
                        return tests;
        }
    },
    {
        id: 22,
        conceptId: "conditions_logic",
        conceptTags: ["or", "logical"],
        chapterId: 5,
        isMastery: false,
        title: "22. Operatore Logico OR (or)",
        icon: "🚪",
        xp: 50,
        expectedOutput: "b3 = true",
        theory: "\n                <p>L'operatore <code>or</code> restituisce <code>true</code> se <strong>almeno una</strong> delle condizioni è vera. È falso solo se entrambe sono false.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> ha_pass_vip <span class=\"ow\">or</span> ha_biglietto:\n    entra_nel_concerto()</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Modifica <code>b1</code> e <code>b2</code> con numeri interi in modo che <code>b3</code> risulti <code>true</code>.</li>\n                    <li><code>b3</code> verifica se <code>b1 > 10 or b2 < 5</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var b1 = 0\n    var b2 = 10\n    var b3 = b1 > 10 or b2 < 5\n    print(\"b3 = \", b3)\n",
        solution: "extends Node\n\nfunc _ready():\n    var b1 = 15\n    var b2 = 2\n    var b3 = b1 > 10 or b2 < 5\n    print(\"b3 = \", b3)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Basta che o b1 > 10 oppure b2 < 5 sia soddisfatta."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Imposta b1 maggiore di 10 (es. 15)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Con b1 = 15, la condizione b1 > 10 è vera, quindi b3 diventa true."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.b3 === true;
                        tests.push({ desc: "b3 vale true con operatore or", passed: ok, diff: ok ? null : `Trovato: ${s.b3}` });
                        return tests;
        }
    },
    {
        id: 23,
        conceptId: "conditions_logic",
        conceptTags: ["not", "logic_recap"],
        chapterId: 5,
        isMastery: false,
        title: "23. Operatore NOT e Logica Booleana",
        icon: "🔄",
        xp: 50,
        expectedOutput: "Risultato: true",
        theory: "\n                <p>L'operatore <code>not</code> inverte il valore booleano: trasforma <code>true</code> in <code>false</code> e viceversa.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> porta_chiusa = <span class=\"kc\">true</span>\n<span class=\"k\">var</span> posso_entrare = <span class=\"ow\">not</span> porta_chiusa <span class=\"c\"># false</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Imposta le variabili booleane <code>b1</code>, <code>b2</code> e <code>b3</code> in modo che la formula <code>(b1 and b2) or (not b3)</code> restituisca <code>true</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var b1 = false\n    var b2 = false\n    var b3 = true\n    var risultato = (b1 and b2) or (not b3)\n    print(\"Risultato: \", risultato)\n",
        solution: "extends Node\n\nfunc _ready():\n    var b1 = true\n    var b2 = true\n    var b3 = false\n    var risultato = (b1 and b2) or (not b3)\n    print(\"Risultato: \", risultato)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Se b3 è false, not b3 diventa true, rendendo vera l'intera espressione or."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Imposta b3 = false oppure b1 = true e b2 = true."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "var b1 = true\nvar b2 = true\nvar b3 = false"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.risultato === true;
                        tests.push({ desc: "Espressione logica valutata a true", passed: ok, diff: ok ? null : `Trovato: ${s.risultato}` });
                        return tests;
        }
    },
    {
        id: 24,
        conceptId: "conditions_logic",
        conceptTags: ["precedence", "parentheses"],
        chapterId: 5,
        isMastery: false,
        title: "24. Precedenza e Parentesi Logiche",
        icon: "🧩",
        xp: 50,
        expectedOutput: "Accesso: true",
        theory: "\n                <p>Nelle condizioni complesse usiamo le parentesi <code>(...)</code> per raggruppare espressioni e dare precedenza alle regole.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> entra = livello >= 5 <span class=\"ow\">and</span> (ha_chiave <span class=\"ow\">or</span> ha_amuleto)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Un eroe può accedere alla stanza segreta se il suo <code>level >= 5</code> E possiede almeno uno tra la chiave (<code>has_key</code>) o la mappa (<code>has_map</code>).</li>\n                    <li>Date <code>level = 7</code>, <code>has_key = false</code> e <code>has_map = true</code>:</li>\n                    <li>Calcola <code>can_enter = level >= 5 and (has_key or has_map)</code></li>\n                    <li>Stampa <code>\"Accesso: \", can_enter</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var level = 7\n    var has_key = false\n    var has_map = true\n    # Calcola can_enter usando le parentesi\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var level = 7\n    var has_key = false\n    var has_map = true\n    var can_enter = level >= 5 and (has_key or has_map)\n    print(\"Accesso: \", can_enter)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa le parentesi per raggruppare (has_key or has_map)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var can_enter = level >= 5 and (has_key or has_map)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "print(\"Accesso: \", can_enter)"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.can_enter === true;
                        tests.push({ desc: "can_enter calcolato correttamente (true)", passed: ok, diff: ok ? null : `Trovato: ${s.can_enter}` });
                        return tests;
        }
    },
    {
        id: 25,
        conceptId: "conditions_logic",
        conceptTags: ["ternary", "if_inline"],
        chapterId: 5,
        isMastery: true,
        title: "25. L'Operatore Ternario (if inline)",
        icon: "⚡",
        xp: 75,
        expectedOutput: "Stato: Acquistabile",
        theory: "\n                <p>L'<strong>operatore ternario</strong> in GDScript è una forma concisa per assegnare un valore in base a una condizione su una sola riga:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> stato = <span class=\"s\">\"Vivo\"</span> <span class=\"k\">if</span> hp > 0 <span class=\"k\">else</span> <span class=\"s\">\"K.O.\"</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Date <code>coins = 50</code> e <code>price = 30</code>:</li>\n                    <li>Usa l'operatore ternario per creare la variabile <code>status</code>:</li>\n                    <li>Assegna <code>\"Acquistabile\"</code> se <code>coins >= price</code>, altrimenti <code>\"Troppo caro\"</code>.</li>\n                    <li>Stampa <code>\"Stato: \", status</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var coins = 50\n    var price = 30\n    # Usa l'operatore ternario per definire status\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var coins = 50\n    var price = 30\n    var status = \"Acquistabile\" if coins >= price else \"Troppo caro\"\n    print(\"Stato: \", status)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La sintassi è: valore_se_vero if condizione else valore_se_falso"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var status = \"Acquistabile\" if coins >= price else \"Troppo caro\""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "print(\"Stato: \", status)"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.status === "Acquistabile";
                        tests.push({ desc: "status uguale a 'Acquistabile' via operatore ternario", passed: ok, diff: ok ? null : `Trovato: ${s.status}` });
                        return tests;
        }
    },
    {
        id: 26,
        conceptId: "conditions_logic",
        conceptTags: ["if", "branching"],
        chapterId: 6,
        isMastery: false,
        title: "26. L'Istruzione if (Condizioni Semplici)",
        icon: "🔀",
        xp: 50,
        expectedOutput: "Livello Superato!",
        theory: "\n                <p>L'istruzione <code>if</code> esegue un blocco di codice solo se la condizione specificata risulta vera (<code>true</code>):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> punti >= 100:\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Livello Superato!\"</span>)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Data la variabile <code>score = 150</code>:</li>\n                    <li>Scrivi un'istruzione <code>if</code> che verifica se <code>score >= 100</code>.</li>\n                    <li>Se vero, stampa: <code>\"Livello Superato!\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var score = 150\n    # Scrivi qui l'istruzione if\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var score = 150\n    if score >= 100:\n        print(\"Livello Superato!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa if score >= 100: seguito da print indentato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if score >= 100:\n    print(\"Livello Superato!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Ricorda i due punti ':' e l'indentazione a 4 spazi."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Livello Superato!"));
                        tests.push({ desc: "Console stampa 'Livello Superato!'", passed: hasLog, diff: hasLog ? null : "Messaggio non stampato" });
                        return tests;
        }
    },
    {
        id: 27,
        conceptId: "conditions_logic",
        conceptTags: ["if_else", "elif"],
        chapterId: 6,
        isMastery: false,
        title: "27. Scelta Multipla: if, elif ed else",
        icon: "⚖️",
        xp: 50,
        expectedOutput: "status = moderato",
        theory: "\n                <p>Quando abbiamo molteplici scenari alternativi, usiamo <code>elif</code> (else if) ed <code>else</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> velocita < 20:\n    stato = <span class=\"s\">\"lento\"</span>\n<span class=\"k\">elif</span> velocita <= 50:\n    stato = <span class=\"s\">\"moderato\"</span>\n<span class=\"k\">else</span>:\n    stato = <span class=\"s\">\"veloce\"</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Data la velocità del vento <code>wind = 35</code> e la variabile <code>status = \"unset\"</code>:</li>\n                    <li>Se <code>wind < 20</code>, imposta <code>status = \"leggero\"</code></li>\n                    <li>Altrimenti se <code>wind <= 50</code>, imposta <code>status = \"moderato\"</code></li>\n                    <li>Altrimenti imposta <code>status = \"tempesta\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var wind = 35\n    var status = \"unset\"\n    # Scrivi il tuo if, elif, else qui sotto\n    pass\n    print(\"status = \", status)\n",
        solution: "extends Node\n\nfunc _ready():\n    var wind = 35\n    var status = \"unset\"\n    if wind < 20:\n        status = \"leggero\"\n    elif wind <= 50:\n        status = \"moderato\"\n    else:\n        status = \"tempesta\"\n    print(\"status = \", status)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa if per il primo controllo, elif per il secondo ed else per tutti gli altri casi."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if wind < 20:\n    status = \"leggero\"\nelif wind <= 50:\n    status = \"moderato\"\nelse:\n    status = \"tempesta\""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Con wind = 35, il ramo elif sarà vero e status diventerà \"moderato\"."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.status === "moderato";
                        tests.push({ desc: "status impostato a 'moderato'", passed: ok, diff: ok ? null : `Trovato: ${s.status}` });
                        return tests;
        }
    },
    {
        id: 28,
        conceptId: "conditions_logic",
        conceptTags: ["calculator", "branching"],
        chapterId: 6,
        isMastery: false,
        title: "28. Ripasso - Calcolatrice Semplice",
        icon: "🧮",
        xp: 50,
        expectedOutput: "result = 50",
        theory: "\n                <p>Costruiamo una calcolatrice che esegue l'operazione in base al simbolo contenuto nella stringa <code>op</code> (<code>\"+\"</code>, <code>\"-\"</code>, <code>\"*\"</code>, <code>\"/\"</code>).</p>\n            ",
        task: "\n                <ul>\n                    <li>Dati <code>n1 = 10</code>, <code>n2 = 5</code>, <code>op = \"*\"</code> e <code>result = 0.0</code>:</li>\n                    <li>Se <code>op == \"+\"</code>, assegna a <code>result</code> la somma <code>n1 + n2</code></li>\n                    <li>Se <code>op == \"-\"</code>, assegna a <code>result</code> la sottrazione <code>n1 - n2</code></li>\n                    <li>Se <code>op == \"*\"</code>, assegna a <code>result</code> la moltiplicazione <code>n1 * n2</code></li>\n                    <li>Se <code>op == \"/\"</code>, assegna a <code>result</code> la divisione <code>n1 / n2</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var n1 = 10\n    var n2 = 5\n    var op = \"*\"\n    var result: float = 0.0\n    # Scrivi qui la logica di calcolo\n    pass\n    print(\"result = \", result)\n",
        solution: "extends Node\n\nfunc _ready():\n    var n1 = 10\n    var n2 = 5\n    var op = \"*\"\n    var result: float = 0.0\n    if op == \"+\":\n        result = n1 + n2\n    elif op == \"-\":\n        result = n1 - n2\n    elif op == \"*\":\n        result = n1 * n2\n    elif op == \"/\":\n        result = n1 / n2\n    print(\"result = \", result)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Confronta op usando == con le stringhe \"+\", \"-\", \"*\", \"/\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if op == \"+\": result = n1 + n2\nelif op == \"*\": result = n1 * n2"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "10 * 5 assegnerà 50 a result."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.result === 50;
                        tests.push({ desc: "result calcolato correttamente (= 50)", passed: ok, diff: ok ? null : `Trovato: ${s.result}` });
                        return tests;
        }
    },
    {
        id: 29,
        conceptId: "conditions_logic",
        conceptTags: ["nested_if", "logic"],
        chapterId: 6,
        isMastery: false,
        title: "29. Condizioni Annidate (Nested If)",
        icon: "🪆",
        xp: 50,
        expectedOutput: "Biglietto: consentito",
        theory: "\n                <p>Un'istruzione <code>if</code> può essere contenuta all'interno di un'altra. In questo caso il secondo controllo viene valutato solo se il primo è risultato vero.</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> ha_chiave:\n    <span class=\"k\">if</span> livello >= 10:\n        apri_cancello_dorato()</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Date <code>age = 14</code>, <code>with_parent = true</code> e <code>ticket = \"negato\"</code>:</li>\n                    <li>Se <code>age >= 18</code>, assegna <code>ticket = \"consentito\"</code></li>\n                    <li>Altrimenti, se <code>with_parent</code> è <code>true</code>, assegna <code>ticket = \"consentito\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var age = 14\n    var with_parent = true\n    var ticket = \"negato\"\n    # Applica i controlli annidati\n    pass\n    print(\"Biglietto: \", ticket)\n",
        solution: "extends Node\n\nfunc _ready():\n    var age = 14\n    var with_parent = true\n    var ticket = \"negato\"\n    if age >= 18:\n        ticket = \"consentito\"\n    else:\n        if with_parent:\n            ticket = \"consentito\"\n    print(\"Biglietto: \", ticket)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Inserisci il secondo controllo if all'interno del ramo else."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if age >= 18:\n    ticket = \"consentito\"\nelse:\n    if with_parent:\n        ticket = \"consentito\""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Dato che with_parent è true, ticket diventerà \"consentito\"."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.ticket === "consentito";
                        tests.push({ desc: "ticket impostato su 'consentito'", passed: ok, diff: ok ? null : `Trovato: ${s.ticket}` });
                        return tests;
        }
    },
    {
        id: 30,
        conceptId: "conditions_logic",
        conceptTags: ["match", "switch"],
        chapterId: 6,
        isMastery: true,
        title: "30. L'Istruzione match (Pattern Matching)",
        icon: "🎯",
        xp: 75,
        expectedOutput: "Stagione calda",
        theory: "\n                <p>L'istruzione <code>match</code> è la versione di GDScript del costrutto <em>switch/case</em> presente in altri linguaggi, ma molto più potente e leggibile:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">match</span> stato_gioco:\n    <span class=\"s\">\"MENU\"</span>:\n        mostra_titolo()\n    <span class=\"s\">\"PLAY\"</span>:\n        avvia_partita()\n    _:\n        <span class=\"nb\">print</span>(<span class=\"s\">\"Stato sconosciuto\"</span>) <span class=\"c\"># Caso predefinito</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Data <code>season = \"estate\"</code>:</li>\n                    <li>Usa <code>match season:</code> per stampare:</li>\n                    <li><code>\"primavera\"</code> ➔ <code>print(\"Fiori e rinascita\")</code></li>\n                    <li><code>\"estate\"</code> ➔ <code>print(\"Stagione calda\")</code></li>\n                    <li><code>\"autunno\"</code> ➔ <code>print(\"Caduta foglie\")</code></li>\n                    <li><code>\"inverno\"</code> ➔ <code>print(\"Neve e freddo\")</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var season = \"estate\"\n    # Scrivi il match statement qui sotto\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var season = \"estate\"\n    match season:\n        \"primavera\":\n            print(\"Fiori e rinascita\")\n        \"estate\":\n            print(\"Stagione calda\")\n        \"autunno\":\n            print(\"Caduta foglie\")\n        \"inverno\":\n            print(\"Neve e freddo\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa match season: e indenta ciascun caso con il proprio valore."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "match season:\n    \"estate\":\n        print(\"Stagione calda\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Essendo season = \"estate\", verrà eseguita la riga print(\"Stagione calda\")."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Stagione calda"));
                        tests.push({ desc: "Console stampa 'Stagione calda' tramite match", passed: hasLog, diff: hasLog ? null : "Output non trovato" });
                        return tests;
        }
    },
    {
        id: 31,
        conceptId: "syntax_basics",
        conceptTags: ["print", "multiline"],
        chapterId: 7,
        isMastery: false,
        title: "31. Output Multi-Riga",
        icon: "📺",
        xp: 50,
        expectedOutput: "I love GDScript\nLet's make games!",
        theory: "\n                <p>Ogni chiamata a <code>print(...)</code> produce automaticamente una nuova riga nell'output della console.</p>\n            ",
        task: "\n                <ul>\n                    <li>Stampa su due righe distinte:</li>\n                    <li><code>I love GDScript</code></li>\n                    <li><code>Let's make games!</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Stampa i due messaggi su righe separate\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"I love GDScript\")\n    print(\"Let's make games!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa due istruzioni print distinte."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"I love GDScript\")\nprint(\"Let's make games!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Fai attenzione all'apostrofo in Let's."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok1 = logs.includes("I love GDScript");
                        const ok2 = logs.includes("Let's make games!");
                        tests.push({ desc: "Stampa entrambe le righe richieste", passed: ok1 && ok2, diff: (ok1 && ok2) ? null : `Ricevuto: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 32,
        conceptId: "syntax_basics",
        conceptTags: ["print", "variables"],
        chapterId: 7,
        isMastery: false,
        title: "32. Output con Variabili Multiple",
        icon: "🏷️",
        xp: 50,
        expectedOutput: "Eroe: Alex Livello: 5 Monete: 120",
        theory: "\n                <p>Possiamo passare più argomenti separati da virgola a <code>print(...)</code>: Godot li stamperà separandoli con uno spazio:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"nb\">print</span>(<span class=\"s\">\"Vita:\"</span>, 100, <span class=\"s\">\"Mana:\"</span>, 50)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Date <code>hero = \"Alex\"</code>, <code>level = 5</code> e <code>coins = 120</code>:</li>\n                    <li>Stampa: <code>\"Eroe: \", hero, \" Livello: \", level, \" Monete: \", coins</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var hero = \"Alex\"\n    var level = 5\n    var coins = 120\n    # Stampa le informazioni su una sola riga\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var hero = \"Alex\"\n    var level = 5\n    var coins = 120\n    print(\"Eroe: \", hero, \" Livello: \", level, \" Monete: \", coins)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Separa testo e variabili con virgole dentro print()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Eroe: \", hero, \" Livello: \", level, \" Monete: \", coins)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Esegui il codice per verificare l'output combinato."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Eroe: Alex") && l.includes("120"));
                        tests.push({ desc: "Console visualizza eroe, livello e monete", passed: hasLog, diff: hasLog ? null : "Output non corrispondente" });
                        return tests;
        }
    },
    {
        id: 33,
        conceptId: "syntax_basics",
        conceptTags: ["formatting", "strings"],
        chapterId: 7,
        isMastery: false,
        title: "33. Formattazione di Stringhe (%s, %d)",
        icon: "🎨",
        xp: 50,
        expectedOutput: "Pozione costa 15 monete",
        theory: "\n                <p>L'operatore <code>%</code> applicato alle stringhe permette di formattare il testo inserendo segnaposto:</p>\n                <ul>\n                    <li><code>%s</code> ➔ stringa</li>\n                    <li><code>%d</code> ➔ numero intero</li>\n                    <li><code>%.2f</code> ➔ float con due decimali</li>\n                </ul>\n                <div class=\"code-preview\">\n<pre><span class=\"nb\">print</span>(<span class=\"s\">\"%s costa %d monete\"</span> % [item, price])</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Date <code>item = \"Pozione\"</code> e <code>price = 15</code>:</li>\n                    <li>Usa la formattazione per stampare: <br><code>\"%s costa %d monete\" % [item, price]</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var item = \"Pozione\"\n    var price = 15\n    # Usa la formattazione con %s e %d\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var item = \"Pozione\"\n    var price = 15\n    print(\"%s costa %d monete\" % [item, price])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa la sintassi \"%s costa %d monete\" % [item, price]."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"%s costa %d monete\" % [item, price])"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La lista di valori va tra parentesi quadre dopo il simbolo %."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Pozione costa 15 monete"));
                        tests.push({ desc: "Stringa formattata correttamente", passed: hasLog, diff: hasLog ? null : "Output non formattato come atteso" });
                        return tests;
        }
    },
    {
        id: 34,
        conceptId: "syntax_basics",
        conceptTags: ["saluto", "variables"],
        chapterId: 7,
        isMastery: false,
        title: "34. Gestione di Valori Dinamici (Player Input)",
        icon: "👋",
        xp: 50,
        expectedOutput: "Hello Mario!",
        theory: "\n                <p>Nei giochi Godot i dati del giocatore (come il nome scelto all'inizio) vengono memorizzati in una variabile e usati per personalizzare l'esperienza.</p>\n            ",
        task: "\n                <ul>\n                    <li>Data la variabile <code>player_name = \"Mario\"</code>:</li>\n                    <li>Stampa il messaggio di benvenuto: <br><code>\"Hello \" + player_name + \"!\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var player_name = \"Mario\"\n    # Stampa il saluto personalizzato\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var player_name = \"Mario\"\n    print(\"Hello \", player_name, \"!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Concatena o passa gli argomenti separati da virgola in print()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Hello \", player_name, \"!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "L'output deve contenere 'Hello Mario!'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Hello") && l.includes("Mario"));
                        tests.push({ desc: "Console stampa il saluto al giocatore", passed: hasLog, diff: hasLog ? null : "Manca il saluto atteso" });
                        return tests;
        }
    },
    {
        id: 35,
        conceptId: "syntax_basics",
        conceptTags: ["cast", "math"],
        chapterId: 7,
        isMastery: false,
        title: "35. Conversione Numerica e Calcolo",
        icon: "🔢",
        xp: 50,
        expectedOutput: "Prodotto: 15.0",
        theory: "\n                <p>Spesso i dati inseriti dall'utente o da file di configurazione arrivano come stringhe di testo. Dobbiamo convertirli in <code>float</code> o <code>int</code> prima di eseguire calcoli matematici.</p>\n            ",
        task: "\n                <ul>\n                    <li>Date due stringhe <code>s1 = \"3.0\"</code> e <code>s2 = \"5.0\"</code>:</li>\n                    <li>Convertile in float e moltiplicale tra loro.</li>\n                    <li>Stampa <code>\"Prodotto: \", float(s1) * float(s2)</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var s1 = \"3.0\"\n    var s2 = \"5.0\"\n    # Converti in float e stampa il prodotto\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var s1 = \"3.0\"\n    var s2 = \"5.0\"\n    var prod := float(s1) * float(s2)\n    print(\"Prodotto: \", prod)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa float(...) per convertire la stringa prima di moltiplicare."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var prod = float(s1) * float(s2)\nprint(\"Prodotto: \", prod)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "3.0 * 5.0 produce 15.0."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("15"));
                        tests.push({ desc: "Prodotto calcolato con conversione (= 15)", passed: hasLog, diff: hasLog ? null : "Calcolo errato" });
                        return tests;
        }
    },
    {
        id: 36,
        conceptId: "syntax_basics",
        conceptTags: ["math", "recap"],
        chapterId: 7,
        isMastery: false,
        title: "36. Ripasso - Fino a 120 Anni",
        icon: "🎂",
        xp: 50,
        expectedOutput: "Anni mancanti: 95",
        theory: "\n                <p>Eseguiamo un semplice calcolo matematico partendo da una variabile <code>age</code> per determinare quanti anni mancano al traguardo dei 120.</p>\n            ",
        task: "\n                <ul>\n                    <li>Data la variabile <code>age = 25</code>:</li>\n                    <li>Calcola gli anni mancanti a 120 con la formula: <code>120 - age</code></li>\n                    <li>Stampa <code>\"Anni mancanti: \", 120 - age</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var age = 25\n    # Calcola e stampa gli anni mancanti a 120\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var age = 25\n    print(\"Anni mancanti: \", 120 - age)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Sottrai age da 120."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Anni mancanti: \", 120 - age)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "120 - 25 = 95."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("95"));
                        tests.push({ desc: "Stampa corretta di 95 anni mancanti", passed: hasLog, diff: hasLog ? null : "Risultato non corretto" });
                        return tests;
        }
    },
    {
        id: 37,
        conceptId: "syntax_basics",
        conceptTags: ["logic", "recap"],
        chapterId: 7,
        isMastery: true,
        title: "37. Ripasso - Vero o Falso (1 o 0)",
        icon: "🔘",
        xp: 75,
        expectedOutput: "T",
        theory: "\n                <p>Spesso i flag nei file di configurazione sono espressi come interi: <code>1</code> per abilitato, <code>0</code> per disabilitato.</p>\n            ",
        task: "\n                <ul>\n                    <li>Data la variabile <code>flag = 1</code>:</li>\n                    <li>Se <code>flag == 1</code>, stampa <code>\"T\"</code>. Altrimenti stampa <code>\"F\"</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var flag = 1\n    # Controlla flag e stampa T o F\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var flag = 1\n    if flag == 1:\n        print(\"T\")\n    else:\n        print(\"F\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa if flag == 1: print(\"T\") else: print(\"F\")."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if flag == 1:\n    print(\"T\")\nelse:\n    print(\"F\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Essendo flag = 1, verrà stampato T."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok = logs.includes("T");
                        tests.push({ desc: "Stampa 'T' quando flag vale 1", passed: ok, diff: ok ? null : `Trovato: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 38,
        conceptId: "project_bill",
        conceptTags: ["project", "banner"],
        chapterId: 8,
        isMastery: false,
        title: "38. Calcolatore del Conto: Benvenuto",
        icon: "🧾",
        xp: 50,
        expectedOutput: "=== CALCOLATORE DEL CONTO ===",
        theory: "\n                <p>In questo progetto guidato realizzeremo un'applicazione completa per calcolare la mancia e dividere il conto tra amici al ristorante!</p>\n                <p>Iniziamo stampando il banner introduttivo del programma.</p>\n            ",
        task: "\n                <ul>\n                    <li>Stampa il titolo esatto del programma: <br><code>\"=== CALCOLATORE DEL CONTO ===\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Stampa il banner di benvenuto\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"=== CALCOLATORE DEL CONTO ===\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Stampa la stringa racchiusa tra virgolette."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"=== CALCOLATORE DEL CONTO ===\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Attenzione ai 3 segni uguale '===' prima e dopo il testo."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("CALCOLATORE DEL CONTO"));
                        tests.push({ desc: "Stampa banner di benvenuto", passed: hasLog, diff: hasLog ? null : "Banner non trovato" });
                        return tests;
        }
    },
    {
        id: 39,
        conceptId: "project_bill",
        conceptTags: ["project", "variables"],
        chapterId: 8,
        isMastery: false,
        title: "39. Calcolatore del Conto: Impostare i Dati",
        icon: "💵",
        xp: 50,
        expectedOutput: "Conto base: 60.0 Mancia %: 15.0",
        theory: "\n                <p>Passo 2: dichiariamo le variabili per memorizzare l'importo del conto e la percentuale di mancia che desideriamo lasciare.</p>\n            ",
        task: "\n                <ul>\n                    <li>Mantieni il messaggio di benvenuto del passo precedente.</li>\n                    <li>Dichiara <code>bill: float = 60.0</code></li>\n                    <li>Dichiara <code>tip_pct: float = 15.0</code></li>\n                    <li>Stampa <code>\"Conto base: \", bill, \" Mancia %: \", tip_pct</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    print(\"=== CALCOLATORE DEL CONTO ===\")\n    # Dichiara bill (60.0) e tip_pct (15.0)\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"=== CALCOLATORE DEL CONTO ===\")\n    var bill: float = 60.0\n    var tip_pct: float = 15.0\n    print(\"Conto base: \", bill, \" Mancia %: \", tip_pct)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dichiara bill e tip_pct come variabili float."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var bill: float = 60.0\nvar tip_pct: float = 15.0"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa i valori dopo la dichiarazione."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = Math.abs(s.bill - 60.0) < 0.001 && Math.abs(s.tip_pct - 15.0) < 0.001;
                        tests.push({ desc: "bill e tip_pct impostati correttamente", passed: ok, diff: ok ? null : `Trovato: bill=${s.bill}, tip_pct=${s.tip_pct}` });
                        return tests;
        }
    },
    {
        id: 40,
        conceptId: "project_bill",
        conceptTags: ["project", "math"],
        chapterId: 8,
        isMastery: false,
        title: "40. Calcolatore del Conto: Calcolo della Mancia",
        icon: "🪙",
        xp: 50,
        expectedOutput: "Mancia: 9.0 Totale: 69.0",
        theory: "\n                <p>La formula per calcolare la mancia in euro è: <code>tip = bill * (tip_pct / 100.0)</code>.</p>\n                <p>Il totale complessivo sarà la somma del conto base più la mancia: <code>total = bill + tip</code>.</p>\n            ",
        task: "\n                <ul>\n                    <li>Mantieni il codice precedente.</li>\n                    <li>Calcola <code>var tip = bill * (tip_pct / 100.0)</code></li>\n                    <li>Calcola <code>var total = bill + tip</code></li>\n                    <li>Stampa <code>\"Mancia: \", tip, \" Totale: \", total</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var bill: float = 60.0\n    var tip_pct: float = 15.0\n    # Calcola tip e total\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var bill: float = 60.0\n    var tip_pct: float = 15.0\n    var tip := bill * (tip_pct / 100.0)\n    var total := bill + tip\n    print(\"Mancia: \", tip, \" Totale: \", total)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Moltiplica bill per tip_pct / 100.0."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var tip = bill * (tip_pct / 100.0)\nvar total = bill + tip"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "60 * 0.15 = 9.0 di mancia; totale = 69.0."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = Math.abs(s.tip - 9.0) < 0.001 && Math.abs(s.total - 69.0) < 0.001;
                        tests.push({ desc: "tip (= 9.0) e total (= 69.0) calcolati correttamente", passed: ok, diff: ok ? null : `tip=${s.tip}, total=${s.total}` });
                        return tests;
        }
    },
    {
        id: 41,
        conceptId: "project_bill",
        conceptTags: ["project", "division"],
        chapterId: 8,
        isMastery: false,
        title: "41. Calcolatore del Conto: Dividere tra Persone",
        icon: "👥",
        xp: 50,
        expectedOutput: "Quota a persona: 23.0",
        theory: "\n                <p>Ora dividiamo il conto totale per il numero di commensali: <code>per_person = total / people</code>.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dati <code>total = 69.0</code> e <code>people = 3</code>:</li>\n                    <li>Calcola <code>var per_person = total / people</code></li>\n                    <li>Stampa <code>\"Quota a persona: \", per_person</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var total = 69.0\n    var people = 3\n    # Calcola la quota per persona\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var total = 69.0\n    var people = 3\n    var per_person := total / people\n    print(\"Quota a persona: \", per_person)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dividi total per people."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var per_person = total / people"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "69.0 / 3 = 23.0 a persona."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = Math.abs(s.per_person - 23.0) < 0.001;
                        tests.push({ desc: "per_person calcolato correttamente (= 23.0)", passed: ok, diff: ok ? null : `Trovato: ${s.per_person}` });
                        return tests;
        }
    },
    {
        id: 42,
        conceptId: "project_bill",
        conceptTags: ["project", "summary"],
        chapterId: 8,
        isMastery: true,
        title: "42. Calcolatore del Conto: Riepilogo Finale (Sfida)",
        icon: "🏆",
        xp: 75,
        expectedOutput: "=== SCONTRINO ===\nTotale: 69.0 EUR\nA testa: 23.0 EUR",
        theory: "\n                <p>Concludiamo il progetto generando uno scontrino elegante e chiaro!</p>\n            ",
        task: "\n                <ul>\n                    <li>Stampa su 3 righe consecutive:</li>\n                    <li><code>=== SCONTRINO ===</code></li>\n                    <li><code>Totale: 69.0 EUR</code></li>\n                    <li><code>A testa: 23.0 EUR</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Genera lo scontrino finale su 3 righe\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"=== SCONTRINO ===\")\n    print(\"Totale: 69.0 EUR\")\n    print(\"A testa: 23.0 EUR\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa 3 istruzioni print per produrre le tre righe dello scontrino."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"=== SCONTRINO ===\")\nprint(\"Totale: 69.0 EUR\")\nprint(\"A testa: 23.0 EUR\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Controlla il testo esatto con le lettere maiuscole 'EUR'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok1 = logs.includes("=== SCONTRINO ===");
                        const ok2 = logs.includes("Totale: 69.0 EUR");
                        const ok3 = logs.includes("A testa: 23.0 EUR");
                        tests.push({ desc: "Scontrino finale stampato correttamente", passed: ok1 && ok2 && ok3, diff: (ok1 && ok2 && ok3) ? null : `Ricevuto: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 43,
        conceptId: "loops_iteration",
        conceptTags: ["for", "loop"],
        chapterId: 9,
        isMastery: false,
        title: "43. Il Ciclo for (Ripetere Azioni)",
        icon: "🔁",
        xp: 50,
        expectedOutput: "0\n1\n2\n3\n4",
        theory: "\n                <p>Il ciclo <code>for</code> in GDScript permette di iterare un numero definito di volte attraverso una sequenza o un intervallo di numeri generato da <code>range()</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">for</span> i <span class=\"ow\">in</span> <span class=\"nb\">range</span>(3):\n    <span class=\"nb\">print</span>(i) <span class=\"c\"># Stampa 0, poi 1, poi 2</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Scrivi un ciclo <code>for i in range(5):</code> che stampi l'indice <code>i</code> ad ogni iterazione (da 0 a 4).</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Scrivi il ciclo for per stampare da 0 a 4\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    for i in range(5):\n        print(i)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "range(5) produce i numeri 0, 1, 2, 3, 4."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(5):\n    print(i)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Ricorda l'indentazione sotto for."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => String(l).trim());
                        const expected = ["0", "1", "2", "3", "4"];
                        const ok = expected.every(e => logs.includes(e));
                        tests.push({ desc: "Console stampa i numeri da 0 a 4", passed: ok, diff: ok ? null : `Ricevuto: ${logs.join(', ')}` });
                        return tests;
        }
    },
    {
        id: 44,
        conceptId: "loops_iteration",
        conceptTags: ["while", "loop"],
        chapterId: 9,
        isMastery: false,
        title: "44. Il Ciclo while (Finché la Condizione è Vera)",
        icon: "⏳",
        xp: 50,
        expectedOutput: "3\n2\n1\nVia!",
        theory: "\n                <p>Il ciclo <code>while</code> continua a ripetere le sue istruzioni finché la condizione booleana rimane vera (<code>true</code>):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">while</span> count > 0:\n    <span class=\"nb\">print</span>(count)\n    count -= 1</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Data <code>count = 3</code>:</li>\n                    <li>Usa un ciclo <code>while count > 0:</code> per stampare <code>count</code> e decrementarlo di 1 ad ogni giro.</li>\n                    <li>Alla fine del ciclo stampa: <code>\"Via!\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var count = 3\n    # Scrivi il ciclo while per il conto alla rovescia\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var count = 3\n    while count > 0:\n        print(count)\n        count -= 1\n    print(\"Via!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dentro al while devi decrementare count con count -= 1 altrimenti si crea un ciclo infinito!"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "while count > 0:\n    print(count)\n    count -= 1\nprint(\"Via!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La riga print(\"Via!\") va messa all'esterno del ciclo (non indentata)."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => String(l).trim());
                        const ok = logs.includes("3") && logs.includes("2") && logs.includes("1") && logs.includes("Via!");
                        tests.push({ desc: "Countdown 3, 2, 1 e 'Via!' eseguito", passed: ok, diff: ok ? null : `Ricevuto: ${logs.join(', ')}` });
                        return tests;
        }
    },
    {
        id: 45,
        conceptId: "loops_iteration",
        conceptTags: ["break", "loop_control"],
        chapterId: 9,
        isMastery: false,
        title: "45. Interrompere un Ciclo (break)",
        icon: "🛑",
        xp: 50,
        expectedOutput: "1\n2\n3\nBersaglio trovato a 3",
        theory: "\n                <p>L'istruzione <code>break</code> interrompe immediatamente l'esecuzione del ciclo più interno, uscendo dal blocco di iterazione:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">for</span> x <span class=\"ow\">in</span> <span class=\"nb\">range</span>(10):\n    <span class=\"k\">if</span> x == 3:\n        <span class=\"k\">break</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Scrivi un ciclo <code>for i in range(1, 10):</code> che stampi ogni numero.</li>\n                    <li>Se <code>i == 3</code>, stampa <code>\"Bersaglio trovato a \", i</code> ed esci immediatamente dal ciclo con <code>break</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Usa il ciclo for e break quando i == 3\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    for i in range(1, 10):\n        print(i)\n        if i == 3:\n            print(\"Bersaglio trovato a \", i)\n            break\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa if i == 3: seguito da break."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(1, 10):\n    print(i)\n    if i == 3:\n        print(\"Bersaglio trovato a \", i)\n        break"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il numero 4 non verrà mai stampato grazie al break."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => String(l).trim());
                        const stopsAt3 = logs.includes("3") && !logs.includes("4");
                        const hasTarget = logs.some(l => l.includes("Bersaglio trovato a"));
                        tests.push({ desc: "Ciclo interrotto correttamente a 3 con break", passed: stopsAt3 && hasTarget, diff: (stopsAt3 && hasTarget) ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 46,
        conceptId: "loops_iteration",
        conceptTags: ["continue", "loop_control"],
        chapterId: 9,
        isMastery: false,
        title: "46. Saltare un'Iterazione (continue)",
        icon: "⏭️",
        xp: 50,
        expectedOutput: "2\n4\n6",
        theory: "\n                <p>L'istruzione <code>continue</code> salta il resto del corpo del ciclo corrente e passa direttamente alla successiva iterazione:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">for</span> x <span class=\"ow\">in</span> <span class=\"nb\">range</span>(1, 7):\n    <span class=\"k\">if</span> x % 2 != 0:\n        <span class=\"k\">continue</span> <span class=\"c\"># Salta i dispari</span>\n    <span class=\"nb\">print</span>(x)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Itera sui numeri da 1 a 6 con <code>for i in range(1, 7):</code></li>\n                    <li>Se <code>i % 2 != 0</code> (numero dispari), usa <code>continue</code> per saltarlo.</li>\n                    <li>Altrimenti stampa il numero pari con <code>print(i)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Salta i numeri dispari usando continue\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    for i in range(1, 7):\n        if i % 2 != 0:\n            continue\n        print(i)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "continue salta subito al giro successivo senza eseguire il print sotto."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(1, 7):\n    if i % 2 != 0:\n        continue\n    print(i)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "L'output conterrà solo 2, 4 e 6."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => String(l).trim());
                        const onlyEven = logs.includes("2") && logs.includes("4") && logs.includes("6") && !logs.includes("1") && !logs.includes("3");
                        tests.push({ desc: "Stampati solo i numeri pari con continue", passed: onlyEven, diff: onlyEven ? null : `Ricevuto: ${logs.join(', ')}` });
                        return tests;
        }
    },
    {
        id: 47,
        conceptId: "loops_iteration",
        conceptTags: ["factorial", "algorithm"],
        chapterId: 9,
        isMastery: false,
        title: "47. Ripasso - Calcolo del Fattoriale",
        icon: "✖️",
        xp: 50,
        expectedOutput: "Fattoriale di 5: 120",
        theory: "\n                <p>Il fattoriale di un numero <code>n!</code> è il prodotto di tutti i numeri interi da 1 fino a <code>n</code> (es. <code>5! = 1 * 2 * 3 * 4 * 5 = 120</code>).</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>n = 5</code>:</li>\n                    <li>Usa un ciclo <code>for</code> per calcolare il fattoriale moltiplicando una variabile <code>fact</code> (che parte da 1).</li>\n                    <li>Stampa: <code>\"Fattoriale di 5: \", fact</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var n = 5\n    var fact = 1\n    # Calcola il fattoriale con un ciclo\n    pass\n    print(\"Fattoriale di 5: \", fact)\n",
        solution: "extends Node\n\nfunc _ready():\n    var n = 5\n    var fact = 1\n    for i in range(1, n + 1):\n        fact *= i\n    print(\"Fattoriale di 5: \", fact)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Itera con for i in range(1, n + 1): e moltiplica fact *= i."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(1, n + 1):\n    fact *= i"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "1 * 2 * 3 * 4 * 5 = 120."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.fact === 120;
                        tests.push({ desc: "fact uguale a 120", passed: ok, diff: ok ? null : `Trovato: ${s.fact}` });
                        return tests;
        }
    },
    {
        id: 48,
        conceptId: "loops_iteration",
        conceptTags: ["range", "step"],
        chapterId: 9,
        isMastery: false,
        title: "48. Parametri di range(start, end, step)",
        icon: "📐",
        xp: 50,
        expectedOutput: "2 4 6 8 10",
        theory: "\n                <p>La funzione <code>range()</code> accetta fino a 3 parametri:</p>\n                <ul>\n                    <li><code>range(fine)</code> ➔ da 0 a fine - 1</li>\n                    <li><code>range(inizio, fine)</code> ➔ da inizio a fine - 1</li>\n                    <li><code>range(inizio, fine, passo)</code> ➔ incrementando del passo specificato</li>\n                </ul>\n                <div class=\"code-preview\">\n<pre><span class=\"nb\">range</span>(2, 11, 2) <span class=\"c\"># produce 2, 4, 6, 8, 10</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Usa <code>for i in range(2, 11, 2):</code></li>\n                    <li>Aggiungi ogni valore a una stringa <code>numeri</code> separata da spazi.</li>\n                    <li>Stampa <code>numeri.strip()</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var numeri = \"\"\n    # Itera con range(2, 11, 2)\n    pass\n    print(numeri.strip())\n",
        solution: "extends Node\n\nfunc _ready():\n    var numeri = \"\"\n    for i in range(2, 11, 2):\n        numeri += str(i) + \" \"\n    print(numeri.strip())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "range(2, 11, 2) genera i numeri pari da 2 a 10 compresi."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(2, 11, 2):\n    numeri += str(i) + \" \""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La console visualizzerà '2 4 6 8 10'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("2 4 6 8 10"));
                        tests.push({ desc: "Sequenza generata con passo 2", passed: hasLog, diff: hasLog ? null : "Sequenza non corretta" });
                        return tests;
        }
    },
    {
        id: 49,
        conceptId: "loops_iteration",
        conceptTags: ["nested_loops", "grid"],
        chapterId: 9,
        isMastery: false,
        title: "49. Cicli Annidati e Griglie 2D",
        icon: "🔲",
        xp: 50,
        expectedOutput: "(0, 0)\n(0, 1)\n(1, 0)\n(1, 1)",
        theory: "\n                <p>Nei giochi con mappe a griglia (come scacchi, RPG o platform a tile) si usano cicli annidati per scorrere righe (y) e colonne (x):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">for</span> y <span class=\"ow\">in</span> <span class=\"nb\">range</span>(2):\n    <span class=\"k\">for</span> x <span class=\"ow\">in</span> <span class=\"nb\">range</span>(2):\n        <span class=\"nb\">print</span>(<span class=\"s\">\"(%d, %d)\"</span> % [x, y])</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Scrivi due cicli annidati con <code>for y in range(2):</code> e <code>for x in range(2):</code></li>\n                    <li>Stampa le coordinate: <code>\"(\", y, \", \", x, \")\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Scrivi i due cicli annidati per (y, x)\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    for y in range(2):\n        for x in range(2):\n            print(\"(\", y, \", \", x, \")\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Il ciclo interno x viene completato interamente per ogni valore di y."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for y in range(2):\n    for x in range(2):\n        print(\"(\", y, \", \", x, \")\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Genera le 4 combinazioni: (0, 0), (0, 1), (1, 0), (1, 1)."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.replace(/\s+/g, ''));
                        const ok = logs.includes("(0,0)") && logs.includes("(0,1)") && logs.includes("(1,0)") && logs.includes("(1,1)");
                        tests.push({ desc: "Griglia 2x2 generata con cicli annidati", passed: ok, diff: ok ? null : `Trovato: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 50,
        conceptId: "loops_iteration",
        conceptTags: ["countdown", "recap"],
        chapterId: 9,
        isMastery: true,
        title: "50. Ripasso - Conto alla Rovescia Dinamico",
        icon: "🚀",
        xp: 75,
        expectedOutput: "3\n2\n1\n0\nDecollo!",
        theory: "\n                <p>Consolidiamo i cicli realizzando un conto alla rovescia che parte da un valore dinamico <code>start_num</code> e scende fino a 0.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>start_num = 3</code>:</li>\n                    <li>Scendi da 3 a 0 stampando ogni numero con <code>for i in range(start_num, -1, -1):</code></li>\n                    <li>Al termine stampa: <code>\"Decollo!\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var start_num = 3\n    # Esegui il countdown fino a 0 e poi 'Decollo!'\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var start_num = 3\n    for i in range(start_num, -1, -1):\n        print(i)\n    print(\"Decollo!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa un passo negativo -1 in range() per contare all'indietro."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(start_num, -1, -1):\n    print(i)\nprint(\"Decollo!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stamperà 3, 2, 1, 0 e infine Decollo!."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => String(l).trim());
                        const ok = logs.includes("3") && logs.includes("0") && logs.includes("Decollo!");
                        tests.push({ desc: "Countdown inverso e 'Decollo!' stampati", passed: ok, diff: ok ? null : `Logs: ${logs.join(', ')}` });
                        return tests;
        }
    },
    {
        id: 51,
        conceptId: "functions_scope",
        conceptTags: ["func", "declaration"],
        chapterId: 10,
        isMastery: false,
        title: "51. Dichiarare una Funzione Personalizzata (func)",
        icon: "⚡",
        xp: 50,
        expectedOutput: "Benvenuto in Godot!",
        theory: "\n                <p>Una <strong>funzione</strong> è un blocco di istruzioni riutilizzabile contrassegnato dalla parola chiave <code>func</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">func</span> <span class=\"nf\">saluta</span>():\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Ciao Eroe!\"</span>)\n\n<span class=\"k\">func</span> <span class=\"nf\">_ready</span>():\n    saluta() <span class=\"c\"># Chiamata alla funzione</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Sotto <code>_ready()</code>, dichiara una funzione chiamata <code>saluta()</code>.</li>\n                    <li>La funzione deve stampare: <code>\"Benvenuto in Godot!\"</code></li>\n                    <li>Chiama <code>saluta()</code> all'interno di <code>_ready()</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama saluta() qui\n    pass\n\n# Dichiara saluta() qui sotto\n",
        solution: "extends Node\n\nfunc _ready():\n    saluta()\n\nfunc saluta():\n    print(\"Benvenuto in Godot!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Dichiara func saluta(): allineata a sinistra, con il proprio corpo indentato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func saluta():\n    print(\"Benvenuto in Godot!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "In _ready(), scrivi semplicemente saluta()."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Benvenuto in Godot!"));
                        tests.push({ desc: "Funzione saluta() eseguita con successo", passed: hasLog, diff: hasLog ? null : "Messaggio di benvenuto non stampato" });
                        return tests;
        }
    },
    {
        id: 52,
        conceptId: "functions_scope",
        conceptTags: ["parameters", "arguments"],
        chapterId: 10,
        isMastery: false,
        title: "52. Parametri e Argomenti delle Funzioni",
        icon: "📥",
        xp: 50,
        expectedOutput: "Somma: 15",
        theory: "\n                <p>I <strong>parametri</strong> permettono di passare valori in ingresso a una funzione per renderla generica e riutilizzabile con dati diversi:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">func</span> <span class=\"nf\">mostra_somma</span>(a: <span class=\"nb\">int</span>, b: <span class=\"nb\">int</span>):\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Somma: \"</span>, a + b)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara la funzione <code>mostra_somma(a: int, b: int)</code> che stampa <code>\"Somma: \", a + b</code>.</li>\n                    <li>In <code>_ready()</code>, chiamala passando <code>10</code> e <code>5</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama mostra_somma(10, 5)\n    pass\n\n# Dichiara mostra_somma(a: int, b: int) qui sotto\n",
        solution: "extends Node\n\nfunc _ready():\n    mostra_somma(10, 5)\n\nfunc mostra_somma(a: int, b: int):\n    print(\"Somma: \", a + b)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Specifica i parametri a e b tra le parentesi tonde."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func mostra_somma(a: int, b: int):\n    print(\"Somma: \", a + b)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "In _ready(), scrivi mostra_somma(10, 5)."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Somma: 15") || l.includes("Somma:  15"));
                        tests.push({ desc: "Funzione mostra_somma calcola 10 + 5 = 15", passed: hasLog, diff: hasLog ? null : "Output non trovato" });
                        return tests;
        }
    },
    {
        id: 53,
        conceptId: "functions_scope",
        conceptTags: ["return", "functions"],
        chapterId: 10,
        isMastery: false,
        title: "53. Valori di Ritorno (return)",
        icon: "↩️",
        xp: 50,
        expectedOutput: "Quadrato di 6: 36",
        theory: "\n                <p>La parola chiave <code>return</code> permette a una funzione di calcolare un risultato e restituirlo al codice chiamante:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">func</span> <span class=\"nf\">quadrato</span>(n: <span class=\"nb\">int</span>):\n    <span class=\"k\">return</span> n * n</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara una funzione <code>square_number(n: int)</code> che restituisce <code>n * n</code> con <code>return</code>.</li>\n                    <li>In <code>_ready()</code>, calcola il quadrato di 6 e stampalo: <code>\"Quadrato di 6: \", square_number(6)</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama square_number(6) e stampa il risultato\n    pass\n\n# Dichiara square_number(n: int) qui sotto\n",
        solution: "extends Node\n\nfunc _ready():\n    var res = square_number(6)\n    print(\"Quadrato di 6: \", res)\n\nfunc square_number(n: int):\n    return n * n\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "return n * n calcola e invia indietro il risultato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func square_number(n: int):\n    return n * n"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "print(\"Quadrato di 6: \", square_number(6))"
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("36"));
                        tests.push({ desc: "square_number(6) restituisce 36", passed: hasLog, diff: hasLog ? null : "Risultato 36 non trovato" });
                        return tests;
        }
    },
    {
        id: 54,
        conceptId: "functions_scope",
        conceptTags: ["return_types", "static_typing"],
        chapterId: 10,
        isMastery: false,
        title: "54. Tipi di Ritorno Espliciti (-> Tipo)",
        icon: "🎯",
        xp: 50,
        expectedOutput: "Area: 40",
        theory: "\n                <p>In Godot 4 possiamo specificare il tipo di dato restituito usando la freccia <code>-> Tipo</code> dopo i parametri:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">func</span> <span class=\"nf\">calcola_area</span>(w: <span class=\"nb\">int</span>, h: <span class=\"nb\">int</span>) -> <span class=\"nb\">int</span>:\n    <span class=\"k\">return</span> w * h</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>get_area(w: int, h: int) -> int</code> che calcola l'area di un rettangolo restituendo <code>w * h</code>.</li>\n                    <li>In <code>_ready()</code>, chiama la funzione con <code>8</code> e <code>5</code> e stampa: <code>\"Area: \", get_area(8, 5)</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama get_area(8, 5) e stampala\n    pass\n\n# Dichiara get_area(w: int, h: int) -> int\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Area: \", get_area(8, 5))\n\nfunc get_area(w: int, h: int) -> int:\n    return w * h\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Aggiungi -> int prima dei due punti finali."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func get_area(w: int, h: int) -> int:\n    return w * h"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "8 * 5 = 40."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Area: 40") || l.includes("Area:  40"));
                        tests.push({ desc: "get_area restituisce 40 con tipo di ritorno int", passed: hasLog, diff: hasLog ? null : "Area non calcolata correttamente" });
                        return tests;
        }
    },
    {
        id: 55,
        conceptId: "functions_scope",
        conceptTags: ["sigma", "math_fn"],
        chapterId: 10,
        isMastery: false,
        title: "55. Ripasso - Funzione Somma Sigma",
        icon: "∑",
        xp: 50,
        expectedOutput: "Sigma(4): 10",
        theory: "\n                <p>La funzione matematica Sigma (sommatoria) calcola la somma di tutti i numeri da 1 fino a <code>n</code> (es. <code>sigma(4) = 1 + 2 + 3 + 4 = 10</code>).</p>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>sigma(n: int) -> int</code> che usa un ciclo per sommare tutti i numeri da 1 a <code>n</code>.</li>\n                    <li>In <code>_ready()</code>, stampa <code>\"Sigma(4): \", sigma(4)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama e stampa sigma(4)\n    pass\n\n# Dichiara sigma(n: int) -> int\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Sigma(4): \", sigma(4))\n\nfunc sigma(n: int) -> int:\n    var s := 0\n    for i in range(1, n + 1):\n        s += i\n    return s\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Accumula in una variabile s partendo da 0 con un ciclo for i in range(1, n + 1): s += i."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func sigma(n: int) -> int:\n    var s = 0\n    for i in range(1, n + 1):\n        s += i\n    return s"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "1 + 2 + 3 + 4 = 10."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("10"));
                        tests.push({ desc: "sigma(4) restituisce 10", passed: hasLog, diff: hasLog ? null : "Risultato sigma errato" });
                        return tests;
        }
    },
    {
        id: 56,
        conceptId: "functions_scope",
        conceptTags: ["validation", "bool_fn"],
        chapterId: 10,
        isMastery: false,
        title: "56. Ripasso - Funzione di Validazione",
        icon: "🛡️",
        xp: 50,
        expectedOutput: "Valido: true",
        theory: "\n                <p>Le funzioni di validazione verificano se i dati soddisfano criteri di sicurezza e restituiscono un valore <code>bool</code>.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>is_valid(user: String, pwd: String) -> bool</code>.</li>\n                    <li>Restituisce <code>true</code> se la lunghezza di <code>user >= 3</code> E la lunghezza di <code>pwd >= 6</code>.</li>\n                    <li>In <code>_ready()</code>, chiama la funzione con <code>\"alex\"</code> e <code>\"secret123\"</code> e stampa <code>\"Valido: \", is_valid(\"alex\", \"secret123\")</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama is_valid e stampa il risultato\n    pass\n\n# Dichiara is_valid(user: String, pwd: String) -> bool\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"Valido: \", is_valid(\"alex\", \"secret123\"))\n\nfunc is_valid(user: String, pwd: String) -> bool:\n    return user.length() >= 3 and pwd.length() >= 6\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa .length() per ottenere la lunghezza della stringa."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func is_valid(user: String, pwd: String) -> bool:\n    return user.length() >= 3 and pwd.length() >= 6"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "\"alex\".length() è 4 (>=3) e \"secret123\".length() è 9 (>=6), quindi restituisce true."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Valido: true"));
                        tests.push({ desc: "is_valid valida correttamente i parametri", passed: hasLog, diff: hasLog ? null : "Output non corretto" });
                        return tests;
        }
    },
    {
        id: 57,
        conceptId: "functions_scope",
        conceptTags: ["default_values", "functions"],
        chapterId: 10,
        isMastery: true,
        title: "57. Valori di Default dei Parametri (Sfida)",
        icon: "⚙️",
        xp: 75,
        expectedOutput: "Nemico: Goblin HP: 100\nNemico: Drago HP: 500",
        theory: "\n                <p>Possiamo assegnare un <strong>valore predefinito</strong> (default value) a un parametro. Se chi chiama la funzione omette quell'argomento, Godot userà automaticamente il valore di default:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">func</span> <span class=\"nf\">genera_nemico</span>(tipo: <span class=\"nb\">String</span>, hp: <span class=\"nb\">int</span> = 100):\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Nemico: \"</span>, tipo, <span class=\"s\">\" HP: \"</span>, hp)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>spawn_enemy(tipo: String, hp: int = 100)</code>.</li>\n                    <li>La funzione deve stampare: <code>\"Nemico: \", tipo, \" HP: \", hp</code></li>\n                    <li>In <code>_ready()</code>:</li>\n                    <li>Chiama <code>spawn_enemy(\"Goblin\")</code> (usando il default 100)</li>\n                    <li>Chiama <code>spawn_enemy(\"Drago\", 500)</code> (sovrascrivendo l'HP a 500)</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama spawn_enemy prima per Goblin e poi per Drago (500)\n    pass\n\n# Dichiara spawn_enemy(tipo: String, hp: int = 100)\n",
        solution: "extends Node\n\nfunc _ready():\n    spawn_enemy(\"Goblin\")\n    spawn_enemy(\"Drago\", 500)\n\nfunc spawn_enemy(tipo: String, hp: int = 100):\n    print(\"Nemico: \", tipo, \" HP: \", hp)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Imposta hp: int = 100 nella firma della funzione."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "func spawn_enemy(tipo: String, hp: int = 100):\n    print(\"Nemico: \", tipo, \" HP: \", hp)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Chiamando spawn_enemy(\"Goblin\") senza secondo argomento, hp assumerà automaticamente 100."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok1 = logs.some(l => l.includes("Goblin") && l.includes("100"));
                        const ok2 = logs.some(l => l.includes("Drago") && l.includes("500"));
                        tests.push({ desc: "spawn_enemy con valore di default (Goblin 100)", passed: ok1, diff: ok1 ? null : "Goblin con hp default non stampato" });
                        tests.push({ desc: "spawn_enemy con valore personalizzato (Drago 500)", passed: ok2, diff: ok2 ? null : "Drago con hp 500 non stampato" });
                        return tests;
        }
    },
    {
        id: 58,
        conceptId: "project_fizzbuzz",
        conceptTags: ["fizzbuzz", "banner"],
        chapterId: 11,
        isMastery: false,
        title: "58. Progetto FizzBuzz: Panoramica e Setup",
        icon: "🎮",
        xp: 50,
        expectedOutput: "=== GIOCO FIZZBUZZ GODOT ===",
        theory: "\n                <p><strong>FizzBuzz</strong> è uno dei più celebri problemi algoritmici al mondo, utilizzato anche nei colloqui tecnici per programmatori di giochi!</p>\n                <p>Le regole di base: per i numeri da 1 a 20, se un numero è multiplo di 3 si dice <em>'Fizz'</em>, se è multiplo di 5 si dice <em>'Buzz'</em>, se è multiplo di entrambi si dice <em>'FizzBuzz'</em>, altrimenti si dice il numero stesso.</p>\n                <p>Iniziamo configurando il banner del gioco in <code>_ready()</code>.</p>\n            ",
        task: "\n                <ul>\n                    <li>Stampa il titolo del progetto: <br><code>\"=== GIOCO FIZZBUZZ GODOT ===\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Stampa il banner di FizzBuzz\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"=== GIOCO FIZZBUZZ GODOT ===\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Stampa il titolo esatto con la funzione print()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"=== GIOCO FIZZBUZZ GODOT ===\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Fai attenzione a lettere maiuscole e spazi."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("GIOCO FIZZBUZZ GODOT"));
                        tests.push({ desc: "Banner FizzBuzz stampato correttamente", passed: hasLog, diff: hasLog ? null : "Banner non trovato" });
                        return tests;
        }
    },
    {
        id: 59,
        conceptId: "project_fizzbuzz",
        conceptTags: ["fizzbuzz", "function"],
        chapterId: 11,
        isMastery: false,
        title: "59. Progetto FizzBuzz: La Funzione Logica",
        icon: "⚙️",
        xp: 50,
        expectedOutput: "fizzbuzz(15) = FizzBuzz",
        theory: "\n                <p>Creiamo la funzione <code>fizzbuzz(n: int) -> String</code> che applica le regole logiche con l'operatore modulo <code>%</code>:</p>\n                <ul>\n                    <li>Se <code>n % 15 == 0</code> (o <code>n % 3 == 0 and n % 5 == 0</code>) ➔ restituisce <code>\"FizzBuzz\"</code></li>\n                    <li>Se <code>n % 3 == 0</code> ➔ restituisce <code>\"Fizz\"</code></li>\n                    <li>Se <code>n % 5 == 0</code> ➔ restituisce <code>\"Buzz\"</code></li>\n                    <li>Altrimenti ➔ restituisce <code>str(n)</code></li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara la funzione <code>fizzbuzz(n: int) -> String</code> con le regole sopra indicate.</li>\n                    <li>In <code>_ready()</code>, stampa <code>\"fizzbuzz(15) = \", fizzbuzz(15)</code> per testare.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Testa fizzbuzz con 15\n    pass\n\n# Dichiara fizzbuzz(n: int) -> String qui sotto\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"fizzbuzz(15) = \", fizzbuzz(15))\n\nfunc fizzbuzz(n: int) -> String:\n    if n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Attenzione: controlla prima il caso combinato n % 15 == 0!"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if n % 15 == 0: return \"FizzBuzz\"\nelif n % 3 == 0: return \"Fizz\"\nelif n % 5 == 0: return \"Buzz\"\nelse: return str(n)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "15 è divisibile sia per 3 che per 5, quindi restituirà 'FizzBuzz'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("FizzBuzz"));
                        tests.push({ desc: "fizzbuzz(15) restituisce 'FizzBuzz'", passed: hasLog, diff: hasLog ? null : "Output non corrispondente" });
                        return tests;
        }
    },
    {
        id: 60,
        conceptId: "project_fizzbuzz",
        conceptTags: ["fizzbuzz", "loop"],
        chapterId: 11,
        isMastery: false,
        title: "60. Progetto FizzBuzz: Iterare sui Numeri",
        icon: "🔄",
        xp: 50,
        expectedOutput: "1\n2\nFizz\n4\nBuzz",
        theory: "\n                <p>Colleghiamo la funzione <code>fizzbuzz()</code> a un ciclo <code>for</code> per stampare la sequenza da 1 a 5.</p>\n            ",
        task: "\n                <ul>\n                    <li>Usa un ciclo <code>for i in range(1, 6):</code></li>\n                    <li>Per ogni numero, stampa il risultato di <code>fizzbuzz(i)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Ciclo da 1 a 5 che stampa fizzbuzz(i)\n    pass\n\nfunc fizzbuzz(n: int) -> String:\n    if n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n",
        solution: "extends Node\n\nfunc _ready():\n    for i in range(1, 6):\n        print(fizzbuzz(i))\n\nfunc fizzbuzz(n: int) -> String:\n    if n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n",
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
                        "text": "for i in range(1, 6):\n    print(fizzbuzz(i))"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Per 1 stampa 1, per 3 stampa Fizz, per 5 stampa Buzz."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok = logs.includes("1") && logs.includes("2") && logs.includes("Fizz") && logs.includes("4") && logs.includes("Buzz");
                        tests.push({ desc: "Sequenza FizzBuzz da 1 a 5 corretta", passed: ok, diff: ok ? null : `Ricevuto: ${logs.join(', ')}` });
                        return tests;
        }
    },
    {
        id: 61,
        conceptId: "project_fizzbuzz",
        conceptTags: ["fizzbuzz", "twist"],
        chapterId: 11,
        isMastery: true,
        title: "61. Progetto FizzBuzz: La Variante Speciale (Sfida)",
        icon: "🌶️",
        xp: 75,
        expectedOutput: "Bazz a 7",
        theory: "\n                <p>Aggiungiamo una variante alle regole: se il numero è divisibile per 7, restituiamo <code>\"Bazz\"</code>!</p>\n            ",
        task: "\n                <ul>\n                    <li>Aggiorna <code>fizzbuzz(n: int) -> String</code>:</li>\n                    <li>Se <code>n % 7 == 0</code>, restituisci <code>\"Bazz\"</code>!</li>\n                    <li>In <code>_ready()</code>, chiama <code>fizzbuzz(7)</code> e stampa <code>\"fizzbuzz(7) = \", fizzbuzz(7)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    print(\"fizzbuzz(7) = \", fizzbuzz(7))\n\nfunc fizzbuzz(n: int) -> String:\n    # Aggiungi il controllo per il multiplo di 7 (\"Bazz\")\n    pass\n    return \"\"\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"fizzbuzz(7) = \", fizzbuzz(7))\n\nfunc fizzbuzz(n: int) -> String:\n    if n % 7 == 0:\n        return \"Bazz\"\n    elif n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Inserisci if n % 7 == 0: return \"Bazz\" all'inizio della funzione."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if n % 7 == 0:\n    return \"Bazz\""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "7 % 7 vale 0, quindi restituirà 'Bazz'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Bazz"));
                        tests.push({ desc: "Variante 'Bazz' su multipli di 7 completata", passed: hasLog, diff: hasLog ? null : "Output 'Bazz' non trovato" });
                        return tests;
        }
    },
    {
        id: 62,
        conceptId: "arrays_collections",
        conceptTags: ["array", "list"],
        chapterId: 12,
        isMastery: false,
        title: "62. Dichiarare un Array ([])",
        icon: "📚",
        xp: 50,
        expectedOutput: "[\"bread\", \"eggs\", \"milk\", \"butter\"]",
        theory: "\n                <p>Un <strong>Array</strong> è una lista ordinata di elementi racchiusa tra parentesi quadre <code>[...]</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> armi = [<span class=\"s\">\"spada\"</span>, <span class=\"s\">\"arco\"</span>, <span class=\"s\">\"bastone\"</span>]</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Crea un array chiamato <code>grocery</code> contenente le 4 stringhe in ordine:</li>\n                    <li><code>\"bread\"</code>, <code>\"eggs\"</code>, <code>\"milk\"</code>, <code>\"butter\"</code></li>\n                    <li>Stampa l'array con <code>print(grocery)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Crea e stampa l'array grocery\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var grocery := [\"bread\", \"eggs\", \"milk\", \"butter\"]\n    print(grocery)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Inserisci le stringhe separate da virgole tra parentesi quadre."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var grocery = [\"bread\", \"eggs\", \"milk\", \"butter\"]\nprint(grocery)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stamperà l'intera lista."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const arr = s.grocery || [];
                        const ok = Array.isArray(arr) && arr.length === 4 && arr[0] === "bread" && arr[3] === "butter";
                        tests.push({ desc: "Array grocery creato con 4 elementi corretti", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(arr)}` });
                        return tests;
        }
    },
    {
        id: 63,
        conceptId: "arrays_collections",
        conceptTags: ["array", "indexing"],
        chapterId: 12,
        isMastery: false,
        title: "63. Accedere agli Elementi di un Array ([0])",
        icon: "🔍",
        xp: 50,
        expectedOutput: "Primo: spada Ultimo: corda",
        theory: "\n                <p>Gli array in GDScript hanno <strong>indice su base zero</strong> (zero-indexed):</p>\n                <ul>\n                    <li>Il primo elemento si trova a indice <code>0</code>: <code>arr[0]</code></li>\n                    <li>Il secondo a indice <code>1</code>: <code>arr[1]</code></li>\n                    <li>L'ultimo elemento si può leggere con indice <code>-1</code>: <code>arr[-1]</code></li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>inventory = [\"spada\", \"scudo\", \"pozione\", \"mappa\", \"torcia\", \"corda\"]</code>:</li>\n                    <li>Stampa il primo elemento con <code>\"Primo: \", inventory[0]</code></li>\n                    <li>Stampa l'ultimo elemento con <code>\"Ultimo: \", inventory[-1]</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var inventory = [\"spada\", \"scudo\", \"pozione\", \"mappa\", \"torcia\", \"corda\"]\n    # Stampa il primo e l'ultimo elemento\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var inventory = [\"spada\", \"scudo\", \"pozione\", \"mappa\", \"torcia\", \"corda\"]\n    print(\"Primo: \", inventory[0])\n    print(\"Ultimo: \", inventory[-1])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "inventory[0] accede al primo elemento, inventory[-1] all'ultimo."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Primo: \", inventory[0])\nprint(\"Ultimo: \", inventory[-1])"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Primo: spada, Ultimo: corda."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok1 = logs.some(l => l.includes("spada"));
                        const ok2 = logs.some(l => l.includes("corda"));
                        tests.push({ desc: "Primo (spada) e ultimo (corda) estratti con indici", passed: ok1 && ok2, diff: (ok1 && ok2) ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 64,
        conceptId: "arrays_collections",
        conceptTags: ["array", "modification"],
        chapterId: 12,
        isMastery: false,
        title: "64. Modificare gli Elementi dell'Array",
        icon: "✏️",
        xp: 50,
        expectedOutput: "[\"Capitano\", \"Luigi\", \"Toad\", \"Yoshi\"]",
        theory: "\n                <p>Gli array sono mutabili: possiamo riassegnare un elemento a un indice esistente usando <code>arr[indice] = nuovo_valore</code>:</p>\n                <div class=\"code-preview\">\n<pre>squadra[0] = <span class=\"s\">\"Capitano\"</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>team = [\"Mario\", \"Luigi\", \"Toad\", \"Yoshi\"]</code>:</li>\n                    <li>Sostituisci il primo giocatore (indice 0) con <code>\"Capitano\"</code>.</li>\n                    <li>Stampa l'array modificato con <code>print(team)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var team = [\"Mario\", \"Luigi\", \"Toad\", \"Yoshi\"]\n    # Modifica il primo elemento a \"Capitano\"\n    pass\n    print(team)\n",
        solution: "extends Node\n\nfunc _ready():\n    var team = [\"Mario\", \"Luigi\", \"Toad\", \"Yoshi\"]\n    team[0] = \"Capitano\"\n    print(team)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Assegna team[0] = \"Capitano\"."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "team[0] = \"Capitano\""
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il primo elemento diventerà \"Capitano\" al posto di \"Mario\"."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const arr = s.team || [];
                        const ok = arr[0] === "Capitano";
                        tests.push({ desc: "team[0] modificato in 'Capitano'", passed: ok, diff: ok ? null : `Trovato: ${arr[0]}` });
                        return tests;
        }
    },
    {
        id: 65,
        conceptId: "arrays_collections",
        conceptTags: ["array", "methods"],
        chapterId: 12,
        isMastery: false,
        title: "65. Metodi degli Array: append() e size()",
        icon: "📦",
        xp: 50,
        expectedOutput: "Dimensione: 3",
        theory: "\n                <p>Gli array offrono metodi potenti:</p>\n                <ul>\n                    <li><code>arr.append(valore)</code>: aggiunge un elemento in fondo alla lista.</li>\n                    <li><code>arr.size()</code>: restituisce il numero totale di elementi.</li>\n                    <li><code>arr.pop_back()</code>: rimuove e restituisce l'ultimo elemento.</li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>inventory = [\"pozione\", \"chiave\"]</code>:</li>\n                    <li>Usa <code>inventory.append(\"mappa\")</code> per aggiungere un terzo elemento.</li>\n                    <li>Stampa: <code>\"Dimensione: \", inventory.size()</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var inventory = [\"pozione\", \"chiave\"]\n    # Aggiungi \"mappa\" e stampa la dimensione\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var inventory = [\"pozione\", \"chiave\"]\n    inventory.append(\"mappa\")\n    print(\"Dimensione: \", inventory.size())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa inventory.append(\"mappa\") e poi inventory.size()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "inventory.append(\"mappa\")\nprint(\"Dimensione: \", inventory.size())"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La dimensione passerà da 2 a 3."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const inv = s.inventory || [];
                        const ok = inv.length === 3 && inv.includes("mappa");
                        tests.push({ desc: "Elemento 'mappa' aggiunto e size() = 3", passed: ok, diff: ok ? null : `Dimensione: ${inv.length}` });
                        return tests;
        }
    },
    {
        id: 66,
        conceptId: "arrays_collections",
        conceptTags: ["array", "product_recap"],
        chapterId: 12,
        isMastery: false,
        title: "66. Ripasso - Prodotto degli Elementi",
        icon: "✖️",
        xp: 50,
        expectedOutput: "Prodotto totale: 120",
        theory: "\n                <p>Moltiplichiamo tra loro tutti gli elementi numerici contenuti in un array tramite un ciclo di accumulazione.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>numbers = [2, 3, 4, 5]</code>:</li>\n                    <li>Usa un ciclo <code>for</code> per calcolare il prodotto cumulativo partendo da <code>prod = 1</code>.</li>\n                    <li>Stampa <code>\"Prodotto totale: \", prod</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var numbers = [2, 3, 4, 5]\n    var prod = 1\n    # Moltiplica tutti gli elementi di numbers\n    pass\n    print(\"Prodotto totale: \", prod)\n",
        solution: "extends Node\n\nfunc _ready():\n    var numbers = [2, 3, 4, 5]\n    var prod = 1\n    for n in numbers:\n        prod *= n\n    print(\"Prodotto totale: \", prod)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Itera con for n in numbers: e moltiplica prod *= n."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for n in numbers:\n    prod *= n"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "2 * 3 * 4 * 5 = 120."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.prod === 120;
                        tests.push({ desc: "prod uguale a 120", passed: ok, diff: ok ? null : `Trovato: ${s.prod}` });
                        return tests;
        }
    },
    {
        id: 67,
        conceptId: "arrays_collections",
        conceptTags: ["array", "reverse_recap"],
        chapterId: 12,
        isMastery: false,
        title: "67. Ripasso - Inversione di un Array",
        icon: "🔄",
        xp: 50,
        expectedOutput: "[30, 20, 10]",
        theory: "\n                <p>Il metodo incorporato <code>arr.reverse()</code> inverte l'ordine degli elementi dell'array sul posto (in-place).</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>scores = [10, 20, 30]</code>:</li>\n                    <li>Invertilo usando <code>scores.reverse()</code>.</li>\n                    <li>Stampa <code>scores</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var scores = [10, 20, 30]\n    # Inverti e stampa scores\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var scores = [10, 20, 30]\n    scores.reverse()\n    print(scores)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "scores.reverse() modifica l'array invertendone l'ordine."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "scores.reverse()\nprint(scores)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Diventa [30, 20, 10]."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const arr = s.scores || [];
                        const ok = arr[0] === 30 && arr[2] === 10;
                        tests.push({ desc: "scores invertito correttamente [30, 20, 10]", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(arr)}` });
                        return tests;
        }
    },
    {
        id: 68,
        conceptId: "arrays_collections",
        conceptTags: ["typed_arrays", "godot4"],
        chapterId: 12,
        isMastery: true,
        title: "68. Array Tipizzati in Godot 4 (Array[int])",
        icon: "🛡️",
        xp: 75,
        expectedOutput: "[100, 250, 400]",
        theory: "\n                <p>Una delle novità più potenti di Godot 4 sono gli <strong>Array Tipizzati</strong>: garantiscono che la lista possa contenere soltanto elementi di un tipo specifico, migliorando le prestazioni:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> punteggi: <span class=\"nb\">Array</span>[<span class=\"nb\">int</span>] = [100, 250, 400]</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara un array tipizzato di interi: <br><code>var scores: Array[int] = [100, 250, 400]</code></li>\n                    <li>Stampa <code>scores</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Dichiara scores come Array[int] e stampalo\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var scores: Array[int] = [100, 250, 400]\n    print(scores)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "La sintassi è: var nome: Array[Tipo] = [...]"
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var scores: Array[int] = [100, 250, 400]\nprint(scores)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Array[int] assicura che non possano essere inseriti valori di tipo diverso."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const arr = s.scores || [];
                        const ok = Array.isArray(arr) && arr.length === 3 && arr[0] === 100;
                        tests.push({ desc: "Array tipizzato scores creato e stampato", passed: ok, diff: ok ? null : "Array non conforme" });
                        return tests;
        }
    },
    {
        id: 69,
        conceptId: "arrays_collections",
        conceptTags: ["filter", "iteration"],
        chapterId: 13,
        isMastery: false,
        title: "69. Filtrare Elementi di un Array",
        icon: "🔎",
        xp: 50,
        expectedOutput: "[\"pinguino\"]",
        theory: "\n                <p>Possiamo filtrare gli elementi di un array scorrendoli con <code>for</code> e aggiungendo a una nuova lista solo quelli che soddisfano un criterio (ad esempio lunghezza maggiore di 5 caratteri):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> parola.length() > 5:\n    lunghe.append(parola)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>words = [\"gatto\", \"pinguino\", \"cane\"]</code>:</li>\n                    <li>Crea un array vuoto <code>long_words = []</code>.</li>\n                    <li>Usa un ciclo <code>for w in words:</code> per aggiungere a <code>long_words</code> solo le parole con <code>w.length() > 5</code>.</li>\n                    <li>Stampa <code>long_words</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var words = [\"gatto\", \"pinguino\", \"cane\"]\n    var long_words = []\n    # Filtra le parole con più di 5 lettere\n    pass\n    print(long_words)\n",
        solution: "extends Node\n\nfunc _ready():\n    var words = [\"gatto\", \"pinguino\", \"cane\"]\n    var long_words = []\n    for w in words:\n        if w.length() > 5:\n            long_words.append(w)\n    print(long_words)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa if w.length() > 5: long_words.append(w)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for w in words:\n    if w.length() > 5:\n        long_words.append(w)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "\"pinguino\" ha 8 lettere ed è l'unica parola che verrà aggiunta."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const lw = s.long_words || [];
                        const ok = lw.length === 1 && lw[0] === "pinguino";
                        tests.push({ desc: "long_words contiene solo 'pinguino'", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(lw)}` });
                        return tests;
        }
    },
    {
        id: 70,
        conceptId: "arrays_collections",
        conceptTags: ["array", "indexes"],
        chapterId: 13,
        isMastery: false,
        title: "70. Iterare con gli Indici (range(size))",
        icon: "🔢",
        xp: 50,
        expectedOutput: "0: 10\n1: 20\n2: 30",
        theory: "\n                <p>Quando abbiamo bisogno sia dell'indice numerico che dell'elemento, usiamo <code>range(arr.size())</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">for</span> i <span class=\"ow\">in</span> <span class=\"nb\">range</span>(arr.size()):\n    <span class=\"nb\">print</span>(i, <span class=\"s\">\": \"</span>, arr[i])</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>numbers = [10, 20, 30]</code>:</li>\n                    <li>Usa un ciclo con indice per stampare ogni riga nel formato: <code>i, \": \", numbers[i]</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var numbers = [10, 20, 30]\n    # Itera usando gli indici\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var numbers = [10, 20, 30]\n    for i in range(numbers.size()):\n        print(i, \": \", numbers[i])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "numbers.size() vale 3, quindi range(3) produce gli indici 0, 1, 2."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(numbers.size()):\n    print(i, \": \", numbers[i])"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stamperà 0: 10, 1: 20, 2: 30."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.replace(/\s+/g, ''));
                        const ok = logs.some(l => l.includes("0:10")) && logs.some(l => l.includes("1:20")) && logs.some(l => l.includes("2:30"));
                        tests.push({ desc: "Iterazione con indici completata con successo", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 71,
        conceptId: "arrays_collections",
        conceptTags: ["string", "count"],
        chapterId: 13,
        isMastery: false,
        title: "71. Iterare sui Caratteri di una Stringa",
        icon: "🔤",
        xp: 50,
        expectedOutput: "Lettere p: 2",
        theory: "\n                <p>In GDScript anche le stringhe sono collezioni di caratteri sequenziali! Possiamo scorrerle direttamente con un ciclo <code>for char in testo:</code>.</p>\n            ",
        task: "\n                <ul>\n                    <li>Data la stringa <code>text = \"pipistrello\"</code>:</li>\n                    <li>Conta quante volte compare la lettera <code>\"p\"</code> usando un ciclo.</li>\n                    <li>Stampa <code>\"Lettere p: \", count</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var text = \"pipistrello\"\n    var count = 0\n    # Conta quante 'p' ci sono in text\n    pass\n    print(\"Lettere p: \", count)\n",
        solution: "extends Node\n\nfunc _ready():\n    var text = \"pipistrello\"\n    var count = 0\n    for c in text:\n        if c == \"p\":\n            count += 1\n    print(\"Lettere p: \", count)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Itera con for c in text: e se c == \"p\": count += 1."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for c in text:\n    if c == \"p\":\n        count += 1"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "\"pipistrello\" contiene 2 lettere 'p'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const ok = s.count === 2;
                        tests.push({ desc: "Lettere 'p' contate correttamente (= 2)", passed: ok, diff: ok ? null : `Trovato: ${s.count}` });
                        return tests;
        }
    },
    {
        id: 72,
        conceptId: "arrays_collections",
        conceptTags: ["string", "split"],
        chapterId: 13,
        isMastery: true,
        title: "72. Dividere Stringhe con split() (Sfida)",
        icon: "✂️",
        xp: 75,
        expectedOutput: "Parole: 3",
        theory: "\n                <p>Il metodo <code>string.split(separatore)</code> divide una stringa in un <code>Array[String]</code> in base al delimitatore scelto (es. virgola o spazio):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> parti = <span class=\"s\">\"spada,scudo,arco\"</span>.split(<span class=\"s\">\",\"</span>)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Data <code>phrase = \"Godot,GDScript,Hero\"</code>:</li>\n                    <li>Dividi la frase in parole usando <code>phrase.split(\",\")</code>.</li>\n                    <li>Stampa il numero di parole con: <code>\"Parole: \", parole.size()</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var phrase = \"Godot,GDScript,Hero\"\n    # Dividi la frase con split(\",\") e stampa la dimensione\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var phrase = \"Godot,GDScript,Hero\"\n    var parole = phrase.split(\",\")\n    print(\"Parole: \", parole.size())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa var parole = phrase.split(\",\") e poi parole.size()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var parole = phrase.split(\",\")\nprint(\"Parole: \", parole.size())"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Ci sono 3 elementi separati da virgole."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Parole: 3") || l.includes("Parole:  3"));
                        tests.push({ desc: "Stringa divisa con split e size() = 3", passed: hasLog, diff: hasLog ? null : "Output non corretto" });
                        return tests;
        }
    },
    {
        id: 73,
        conceptId: "arrays_collections",
        conceptTags: ["slice", "slicing"],
        chapterId: 14,
        isMastery: false,
        title: "73. Slicing degli Array (slice(da, a))",
        icon: "🍰",
        xp: 50,
        expectedOutput: "[\"b\", \"c\", \"d\"]",
        theory: "\n                <p>Il metodo <code>slice(inizio, fine)</code> estrae una porzione (fetta) di un array dall'indice <code>inizio</code> fino a <code>fine</code> escluso:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> lettere = [<span class=\"s\">\"a\"</span>, <span class=\"s\">\"b\"</span>, <span class=\"s\">\"c\"</span>, <span class=\"s\">\"d\"</span>, <span class=\"s\">\"e\"</span>]\n<span class=\"nb\">print</span>(lettere.slice(1, 4)) <span class=\"c\"># [\"b\", \"c\", \"d\"]</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>items = [\"a\", \"b\", \"c\", \"d\", \"e\"]</code>:</li>\n                    <li>Estrai con <code>items.slice(1, 4)</code> e stampa il risultato.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var items = [\"a\", \"b\", \"c\", \"d\", \"e\"]\n    # Estrai con slice(1, 4) e stampa\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var items = [\"a\", \"b\", \"c\", \"d\", \"e\"]\n    print(items.slice(1, 4))\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "items.slice(1, 4) include gli indici 1, 2 e 3."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(items.slice(1, 4))"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Risultato: [\"b\", \"c\", \"d\"]."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.replace(/\s+/g, ''));
                        const ok = logs.some(l => l.includes('["b","c","d"]') || l.includes('[b,c,d]') || l.includes("['b','c','d']") || l.includes('b,c,d'));
                        tests.push({ desc: "Slicing estratto correttamente: ['b', 'c', 'd']", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 74,
        conceptId: "arrays_collections",
        conceptTags: ["concat", "plus"],
        chapterId: 14,
        isMastery: false,
        title: "74. Concatenare Array con +",
        icon: "🔗",
        xp: 50,
        expectedOutput: "[1, 2, 3, 4, 5, 6]",
        theory: "\n                <p>L'operatore <code>+</code> unisce due array creando un nuovo array combinato:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> a = [1, 2]\n<span class=\"k\">var</span> b = [3, 4]\n<span class=\"k\">var</span> c = a + b <span class=\"c\"># [1, 2, 3, 4]</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dati <code>a = [1, 2, 3]</code> e <code>b = [4, 5, 6]</code>:</li>\n                    <li>Uniscili con <code>var c = a + b</code> e stampa <code>c</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var a = [1, 2, 3]\n    var b = [4, 5, 6]\n    # Unisci a e b con + e stampa\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var a = [1, 2, 3]\n    var b = [4, 5, 6]\n    var c = a + b\n    print(c)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa l'operatore + tra i due array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var c = a + b\nprint(c)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "L'array c avrà lunghezza 6."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const c = s.c || [];
                        const ok = (Array.isArray(c) && c.length === 6 && c[0] === 1 && c[5] === 6) || (result.logs || []).some(l => l.replace(/\s+/g, '').includes('1,2,3,4,5,6') || l.replace(/\s+/g, '').includes('1,2,34,5,6'));
                        tests.push({ desc: "Array concatenati correttamente con +", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(c)}` });
                        return tests;
        }
    },
    {
        id: 75,
        conceptId: "arrays_collections",
        conceptTags: ["in", "membership"],
        chapterId: 14,
        isMastery: false,
        title: "75. Operatore di Appartenenza (in / not in)",
        icon: "🎯",
        xp: 50,
        expectedOutput: "Pozione presente: true\nArco presente: false",
        theory: "\n                <p>Gli operatori <code>in</code> e <code>not in</code> verificano istantaneamente se un elemento appartiene a una collezione (array, stringa o dizionario):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">if</span> <span class=\"s\">\"chiave\"</span> <span class=\"ow\">in</span> zaino:\n    <span class=\"nb\">print</span>(<span class=\"s\">\"Puoi aprire la porta!\"</span>)</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>loot = [\"pozione\", \"spada\", \"scudo\"]</code>:</li>\n                    <li>Verifica <code>\"pozione\" in loot</code> (sarà <code>true</code>)</li>\n                    <li>Verifica <code>\"arco\" in loot</code> (sarà <code>false</code>)</li>\n                    <li>Stampa <code>\"Pozione presente: \", \"pozione\" in loot</code> e <code>\"Arco presente: \", \"arco\" in loot</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var loot = [\"pozione\", \"spada\", \"scudo\"]\n    # Controlla l'appartenenza con in\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var loot = [\"pozione\", \"spada\", \"scudo\"]\n    print(\"Pozione presente: \", \"pozione\" in loot)\n    print(\"Arco presente: \", \"arco\" in loot)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa l'espressione \"elemento\" in array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Pozione presente: \", \"pozione\" in loot)\nprint(\"Arco presente: \", \"arco\" in loot)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stamperà true per pozione e false per arco."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok1 = logs.some(l => l.includes("true"));
                        const ok2 = logs.some(l => l.includes("false"));
                        tests.push({ desc: "Controllo di appartenenza 'in' verificato", passed: ok1 && ok2, diff: (ok1 && ok2) ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 76,
        conceptId: "arrays_collections",
        conceptTags: ["sort", "array_methods"],
        chapterId: 14,
        isMastery: true,
        title: "76. Ordinamento di un Array con sort() (Sfida)",
        icon: "📶",
        xp: 75,
        expectedOutput: "[1, 3, 5, 8, 9]",
        theory: "\n                <p>Il metodo <code>arr.sort()</code> ordina gli elementi dell'array in ordine crescente (dal più piccolo al più grande) o alfabetico:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> punteggi = [50, 10, 80]\npunteggi.sort() <span class=\"c\"># diventa [10, 50, 80]</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>numbers = [5, 1, 9, 3, 8]</code>:</li>\n                    <li>Ordinalo con <code>numbers.sort()</code>.</li>\n                    <li>Stampa <code>numbers</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var numbers = [5, 1, 9, 3, 8]\n    # Ordina e stampa numbers\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var numbers = [5, 1, 9, 3, 8]\n    numbers.sort()\n    print(numbers)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "numbers.sort() ordina l'array direttamente in memoria."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "numbers.sort()\nprint(numbers)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "L'output ordinato sarà [1, 3, 5, 8, 9]."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const arr = s.numbers || [];
                        const ok = arr[0] === 1 && arr[1] === 3 && arr[2] === 5 && arr[3] === 8 && arr[4] === 9;
                        tests.push({ desc: "Array ordinato in modo crescente con sort()", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(arr)}` });
                        return tests;
        }
    },
    {
        id: 77,
        conceptId: "dictionaries",
        conceptTags: ["dictionary", "dict_syntax"],
        chapterId: 15,
        isMastery: false,
        title: "77. Creare un Dizionario ({chiave: valore})",
        icon: "📖",
        xp: 50,
        expectedOutput: "{\"level\": 10, \"name\": \"Ares\", \"role\": \"Guerriero\"}",
        theory: "\n                <p>Un <strong>Dictionary</strong> (dizionario) memorizza coppie formate da una <strong>chiave</strong> e un <strong>valore</strong> racchiuse tra parentesi graffe <code>{...}</code>:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> eroe = {\n    <span class=\"s\">\"name\"</span>: <span class=\"s\">\"Ares\"</span>,\n    <span class=\"s\">\"role\"</span>: <span class=\"s\">\"Guerriero\"</span>,\n    <span class=\"s\">\"level\"</span>: 10\n}</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Crea un dizionario chiamato <code>hero</code> con le seguenti coppie:</li>\n                    <li><code>\"name\": \"Ares\"</code></li>\n                    <li><code>\"role\": \"Guerriero\"</code></li>\n                    <li><code>\"level\": 10</code></li>\n                    <li>Stampa il dizionario con <code>print(hero)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Crea e stampa il dizionario hero\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var hero = {\"name\": \"Ares\", \"role\": \"Guerriero\", \"level\": 10}\n    print(hero)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa le parentesi graffe {} con chiave: valore separate da virgola."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var hero = {\"name\": \"Ares\", \"role\": \"Guerriero\", \"level\": 10}\nprint(hero)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il dizionario hero conterrà nome, ruolo e livello."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const h = s.hero || {};
                        const ok = h.name === "Ares" && h.role === "Guerriero" && h.level === 10;
                        tests.push({ desc: "Dizionario hero creato con campi corretti", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(h)}` });
                        return tests;
        }
    },
    {
        id: 78,
        conceptId: "dictionaries",
        conceptTags: ["dictionary", "access"],
        chapterId: 15,
        isMastery: false,
        title: "78. Accedere ai Valori di un Dizionario",
        icon: "🔑",
        xp: 50,
        expectedOutput: "Prezzo: 25.5 Rarita: comune",
        theory: "\n                <p>Per leggere un valore da un dizionario possiamo usare:</p>\n                <ul>\n                    <li>Le parentesi quadre: <code>dict[\"chiave\"]</code></li>\n                    <li>Il metodo sicuro <code>dict.get(\"chiave\", valore_default)</code>: se la chiave non esiste, restituisce il valore di default senza causare errori!</li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>item = {\"name\": \"Pozione\", \"price\": 25.5}</code>:</li>\n                    <li>Leggi il prezzo con <code>item[\"price\"]</code></li>\n                    <li>Leggi la rarità con <code>item.get(\"rarity\", \"comune\")</code></li>\n                    <li>Stampa <code>\"Prezzo: \", item[\"price\"], \" Rarita: \", item.get(\"rarity\", \"comune\")</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var item = {\"name\": \"Pozione\", \"price\": 25.5}\n    # Leggi e stampa prezzo e rarità con get()\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var item = {\"name\": \"Pozione\", \"price\": 25.5}\n    print(\"Prezzo: \", item[\"price\"], \" Rarita: \", item.get(\"rarity\", \"comune\"))\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa item[\"price\"] e item.get(\"rarity\", \"comune\")."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Prezzo: \", item[\"price\"], \" Rarita: \", item.get(\"rarity\", \"comune\"))"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Dato che 'rarity' non è presente in item, get() restituirà 'comune'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok = logs.some(l => l.includes("25.5") && l.includes("comune"));
                        tests.push({ desc: "Accesso a prezzo (25.5) e rarità di default ('comune')", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 79,
        conceptId: "dictionaries",
        conceptTags: ["dictionary", "update"],
        chapterId: 15,
        isMastery: false,
        title: "79. Modificare e Aggiungere Chiavi",
        icon: "✏️",
        xp: 50,
        expectedOutput: "{\"hp\": 100, \"level\": 2, \"name\": \"Player\"}",
        theory: "\n                <p>Per aggiornare una chiave esistente o aggiungerne una nuova, basta assegnarle un valore:</p>\n                <div class=\"code-preview\">\n<pre>giocatore[<span class=\"s\">\"level\"</span>] += 1\ngiocatore[<span class=\"s\">\"hp\"</span>] = 100 <span class=\"c\"># Se hp non esiste, viene creata!</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>player = {\"name\": \"Player\", \"level\": 1}</code>:</li>\n                    <li>Incrementa <code>player[\"level\"]</code> di 1 (diventa 2).</li>\n                    <li>Aggiungi la nuova chiave <code>player[\"hp\"] = 100</code>.</li>\n                    <li>Stampa <code>player</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var player = {\"name\": \"Player\", \"level\": 1}\n    # Incrementa level e aggiungi hp = 100\n    pass\n    print(player)\n",
        solution: "extends Node\n\nfunc _ready():\n    var player = {\"name\": \"Player\", \"level\": 1}\n    player[\"level\"] += 1\n    player[\"hp\"] = 100\n    print(player)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "player[\"level\"] += 1 e player[\"hp\"] = 100."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "player[\"level\"] += 1\nplayer[\"hp\"] = 100"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Il dizionario avrà 3 campi: name, level=2 e hp=100."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const p = s.player || {};
                        const ok = p.level === 2 && p.hp === 100;
                        tests.push({ desc: "player aggiornato con level=2 e hp=100", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(p)}` });
                        return tests;
        }
    },
    {
        id: 80,
        conceptId: "dictionaries",
        conceptTags: ["dictionary", "methods"],
        chapterId: 15,
        isMastery: false,
        title: "80. Metodi dei Dizionari: has(), keys(), size()",
        icon: "🛠️",
        xp: 50,
        expectedOutput: "Ha mana: true\nCampi totali: 3",
        theory: "\n                <p>I metodi fondamentali per interrogare i dizionari:</p>\n                <ul>\n                    <li><code>dict.has(\"chiave\")</code> ➔ restituisce <code>true</code> se la chiave è presente.</li>\n                    <li><code>dict.keys()</code> ➔ restituisce un array con tutte le chiavi.</li>\n                    <li><code>dict.size()</code> ➔ restituisce il numero di coppie.</li>\n                </ul>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>stats = {\"hp\": 100, \"mana\": 50, \"atk\": 25}</code>:</li>\n                    <li>Verifica con <code>stats.has(\"mana\")</code> e stampa <code>\"Ha mana: \", stats.has(\"mana\")</code>.</li>\n                    <li>Stampa <code>\"Campi totali: \", stats.size()</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var stats = {\"hp\": 100, \"mana\": 50, \"atk\": 25}\n    # Usa has() e size()\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var stats = {\"hp\": 100, \"mana\": 50, \"atk\": 25}\n    print(\"Ha mana: \", stats.has(\"mana\"))\n    print(\"Campi totali: \", stats.size())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "stats.has(\"mana\") restituisce true."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"Ha mana: \", stats.has(\"mana\"))\nprint(\"Campi totali: \", stats.size())"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "size() restituirà 3."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok1 = logs.some(l => l.includes("true"));
                        const ok2 = logs.some(l => l.includes("3"));
                        tests.push({ desc: "stats.has('mana') = true e size() = 3", passed: ok1 && ok2, diff: (ok1 && ok2) ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 81,
        conceptId: "dictionaries",
        conceptTags: ["dictionary", "for_loop"],
        chapterId: 15,
        isMastery: false,
        title: "81. Iterare su un Dizionario",
        icon: "🔄",
        xp: 50,
        expectedOutput: "oro: 50\ngemme: 3",
        theory: "\n                <p>Quando iteri su un dizionario con <code>for chiave in dict:</code>, la variabile del ciclo assume ciascuna chiave a ogni passaggio:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">for</span> k <span class=\"ow\">in</span> bottino:\n    <span class=\"nb\">print</span>(k, <span class=\"s\">\": \"</span>, bottino[k])</pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>loot = {\"oro\": 50, \"gemme\": 3}</code>:</li>\n                    <li>Usa un ciclo <code>for k in loot:</code> per stampare ogni riga come <code>k, \": \", loot[k]</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var loot = {\"oro\": 50, \"gemme\": 3}\n    # Itera sul dizionario stampando chiave: valore\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var loot = {\"oro\": 50, \"gemme\": 3}\n    for k in loot:\n        print(k, \": \", loot[k])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "k rappresenta la chiave, e loot[k] il valore associato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for k in loot:\n    print(k, \": \", loot[k])"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stamperà 'oro: 50' e 'gemme: 3'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.replace(/\s+/g, ''));
                        const ok = logs.some(l => l.includes("oro:50")) && logs.some(l => l.includes("gemme:3"));
                        tests.push({ desc: "Iterazione corretta sulle chiavi e valori del dizionario", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 82,
        conceptId: "dictionaries",
        conceptTags: ["inventory", "recap"],
        chapterId: 15,
        isMastery: true,
        title: "82. Ripasso - Dizionario dell'Inventario (Sfida)",
        icon: "🎒",
        xp: 75,
        expectedOutput: "Pozioni: 5 Frecce: 15",
        theory: "\n                <p>Gestire un inventario con quantità di oggetti è il classico caso d'uso dei dizionari nei giochi di ruolo (RPG):</p>\n                <div class=\"code-preview\">\n<pre><span class=\"k\">var</span> zaino = {<span class=\"s\">\"pozione\"</span>: 2, <span class=\"s\">\"freccia\"</span>: 10}\nzaino[<span class=\"s\">\"pozione\"</span>] += 3 <span class=\"c\"># Raccoglie 3 pozioni</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>inv = {\"pozione\": 2, \"freccia\": 10}</code>:</li>\n                    <li>Raccogli 3 pozioni: aggiungi 3 a <code>inv[\"pozione\"]</code>.</li>\n                    <li>Raccogli 5 frecce: aggiungi 5 a <code>inv[\"freccia\"]</code>.</li>\n                    <li>Stampa <code>\"Pozioni: \", inv[\"pozione\"], \" Frecce: \", inv[\"freccia\"]</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var inv = {\"pozione\": 2, \"freccia\": 10}\n    # Aggiorna le quantità dell'inventario\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var inv = {\"pozione\": 2, \"freccia\": 10}\n    inv[\"pozione\"] += 3\n    inv[\"freccia\"] += 5\n    print(\"Pozioni: \", inv[\"pozione\"], \" Frecce: \", inv[\"freccia\"])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa += sulla chiave specifica del dizionario."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "inv[\"pozione\"] += 3\ninv[\"freccia\"] += 5"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Pozioni diventerà 5 e frecce diventerà 15."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const inv = s.inv || {};
                        const ok = inv.pozione === 5 && inv.freccia === 15;
                        tests.push({ desc: "Inventario aggiornato (pozione=5, freccia=15)", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(inv)}` });
                        return tests;
        }
    },
    {
        id: 83,
        conceptId: "project_expenses",
        conceptTags: ["project", "banner"],
        chapterId: 16,
        isMastery: false,
        title: "83. Registro Spese: Struttura del Menu",
        icon: "💰",
        xp: 50,
        expectedOutput: "=== REGISTRO SPESE GODOT ===\n1. Aggiungi\n2. Visualizza\n3. Totale\n4. Cancella\n5. Esci",
        theory: "\n                <p>In questo grande progetto costruiremo un sistema di gestione per tenere traccia delle spese quotidiane con un menu interattivo a 5 opzioni!</p>\n            ",
        task: "\n                <ul>\n                    <li>Stampa il menu iniziale dell'applicazione:</li>\n                    <li><code>=== REGISTRO SPESE GODOT ===</code></li>\n                    <li><code>1. Aggiungi</code></li>\n                    <li><code>2. Visualizza</code></li>\n                    <li><code>3. Totale</code></li>\n                    <li><code>4. Cancella</code></li>\n                    <li><code>5. Esci</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Stampa il menu delle opzioni\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    print(\"=== REGISTRO SPESE GODOT ===\")\n    print(\"1. Aggiungi\")\n    print(\"2. Visualizza\")\n    print(\"3. Totale\")\n    print(\"4. Cancella\")\n    print(\"5. Esci\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Stampa ciascuna opzione del menu su una riga separata."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "print(\"=== REGISTRO SPESE GODOT ===\")\nprint(\"1. Aggiungi\")..."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Assicurati di includere tutte e 5 le opzioni."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok = logs.includes("=== REGISTRO SPESE GODOT ===") && logs.includes("5. Esci");
                        tests.push({ desc: "Menu del registro spese stampato", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 84,
        conceptId: "project_expenses",
        conceptTags: ["project", "exit"],
        chapterId: 16,
        isMastery: false,
        title: "84. Registro Spese: Opzione Esci (Scelta 5)",
        icon: "🚪",
        xp: 50,
        expectedOutput: "Arrivederci dal Registro Spese!",
        theory: "\n                <p>Gestiamo la scelta <code>5</code> dell'utente per terminare la sessione di lavoro.</p>\n            ",
        task: "\n                <ul>\n                    <li>Data la scelta dell'utente <code>choice = 5</code>:</li>\n                    <li>Se <code>choice == 5</code>, stampa: <br><code>\"Arrivederci dal Registro Spese!\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var choice = 5\n    # Gestisci l'uscita se choice == 5\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var choice = 5\n    if choice == 5:\n        print(\"Arrivederci dal Registro Spese!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Verifica if choice == 5:."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if choice == 5:\n    print(\"Arrivederci dal Registro Spese!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stampa il messaggio di saluto di uscita."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Arrivederci"));
                        tests.push({ desc: "Messaggio di uscita stampato", passed: hasLog, diff: hasLog ? null : "Saluto di uscita non trovato" });
                        return tests;
        }
    },
    {
        id: 85,
        conceptId: "project_expenses",
        conceptTags: ["project", "add"],
        chapterId: 16,
        isMastery: false,
        title: "85. Registro Spese: Aggiungere una Spesa (Scelta 1)",
        icon: "➕",
        xp: 50,
        expectedOutput: "Spesa registrata: 14.5 EUR",
        theory: "\n                <p>Gestiamo la scelta <code>1</code>: memorizzare una nuova spesa aggiungendola alla lista <code>expenses</code>.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dati <code>expenses: Array[float] = []</code>, <code>choice = 1</code> e <code>new_amount: float = 14.5</code>:</li>\n                    <li>Se <code>choice == 1</code>, aggiungi <code>new_amount</code> all'array <code>expenses</code> con <code>.append()</code>.</li>\n                    <li>Stampa <code>\"Spesa registrata: \", new_amount, \" EUR\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var expenses: Array[float] = []\n    var choice = 1\n    var new_amount = 14.5\n    # Gestisci la scelta 1 aggiungendo new_amount a expenses\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var expenses: Array[float] = []\n    var choice = 1\n    var new_amount = 14.5\n    if choice == 1:\n        expenses.append(new_amount)\n        print(\"Spesa registrata: \", new_amount, \" EUR\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "expenses.append(new_amount) inserisce la spesa nell'array."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if choice == 1:\n    expenses.append(new_amount)\n    print(\"Spesa registrata: \", new_amount, \" EUR\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "L'array expenses conterrà [14.5]."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const exp = s.expenses || [];
                        const ok = exp.length === 1 && Math.abs(exp[0] - 14.5) < 0.001;
                        tests.push({ desc: "Spesa aggiunta a expenses con append()", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(exp)}` });
                        return tests;
        }
    },
    {
        id: 86,
        conceptId: "project_expenses",
        conceptTags: ["project", "view"],
        chapterId: 16,
        isMastery: false,
        title: "86. Registro Spese: Visualizzare le Spese (Scelta 2)",
        icon: "📋",
        xp: 50,
        expectedOutput: "Spesa 1: 12.0\nSpesa 2: 25.0",
        theory: "\n                <p>Gestiamo la scelta <code>2</code>: stampare l'elenco completo di tutte le spese registrate fino a quel momento.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>expenses = [12.0, 25.0]</code> e <code>choice = 2</code>:</li>\n                    <li>Se <code>choice == 2</code>, usa un ciclo per stampare ogni spesa con il suo indice (su base 1): <br><code>\"Spesa \", i + 1, \": \", expenses[i]</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var expenses = [12.0, 25.0]\n    var choice = 2\n    # Gestisci la scelta 2 visualizzando le spese\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var expenses = [12.0, 25.0]\n    var choice = 2\n    if choice == 2:\n        for i in range(expenses.size()):\n            print(\"Spesa \", i + 1, \": \", expenses[i])\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa for i in range(expenses.size()): per scorrere gli indici."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if choice == 2:\n    for i in range(expenses.size()):\n        print(\"Spesa \", i + 1, \": \", expenses[i])"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Stamperà Spesa 1: 12.0 e Spesa 2: 25.0."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.replace(/\s+/g, ''));
                        const ok = logs.some(l => l.includes("Spesa1:12")) && logs.some(l => l.includes("Spesa2:25"));
                        tests.push({ desc: "Tutte le spese visualizzate correttamente", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 87,
        conceptId: "project_expenses",
        conceptTags: ["project", "math"],
        chapterId: 16,
        isMastery: false,
        title: "87. Registro Spese: Totale e Media (Scelta 3)",
        icon: "📊",
        xp: 50,
        expectedOutput: "Totale: 40.0 Media: 20.0",
        theory: "\n                <p>Gestiamo la scelta <code>3</code>: sommare tutte le spese e calcolare la spesa media (<code>media = totale / numero_spese</code>).</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>expenses = [10.0, 30.0]</code> e <code>choice = 3</code>:</li>\n                    <li>Calcola la somma delle spese con un ciclo in <code>total</code>.</li>\n                    <li>Calcola la media: <code>avg = total / expenses.size()</code>.</li>\n                    <li>Stampa <code>\"Totale: \", total, \" Media: \", avg</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var expenses = [10.0, 30.0]\n    var choice = 3\n    # Gestisci la scelta 3 calcolando totale e media\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var expenses = [10.0, 30.0]\n    var choice = 3\n    if choice == 3:\n        var total := 0.0\n        for e in expenses:\n            total += e\n        var avg := total / expenses.size()\n        print(\"Totale: \", total, \" Media: \", avg)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Somma gli elementi in total, poi dividi per expenses.size()."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "var total = 0.0\nfor e in expenses: total += e\nvar avg = total / expenses.size()"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "10 + 30 = 40; media = 40 / 2 = 20.0."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok = logs.some(l => l.includes("40") && l.includes("20"));
                        tests.push({ desc: "Totale (40.0) e media (20.0) calcolati correttamente", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 88,
        conceptId: "project_expenses",
        conceptTags: ["project", "clear"],
        chapterId: 16,
        isMastery: false,
        title: "88. Registro Spese: Cancellare Tutto (Scelta 4)",
        icon: "🗑️",
        xp: 50,
        expectedOutput: "Registro svuotato! Elementi rimasti: 0",
        theory: "\n                <p>Il metodo <code>arr.clear()</code> rimuove istantaneamente tutti gli elementi da un array, resettando la sua dimensione a 0.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>expenses = [50.0, 20.0, 35.0]</code> e <code>choice = 4</code>:</li>\n                    <li>Se <code>choice == 4</code>, svuota la lista con <code>expenses.clear()</code>.</li>\n                    <li>Stampa <code>\"Registro svuotato! Elementi rimasti: \", expenses.size()</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var expenses = [50.0, 20.0, 35.0]\n    var choice = 4\n    # Gestisci la scelta 4 svuotando la lista con clear()\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var expenses = [50.0, 20.0, 35.0]\n    var choice = 4\n    if choice == 4:\n        expenses.clear()\n        print(\"Registro svuotato! Elementi rimasti: \", expenses.size())\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "expenses.clear() rimuove tutti gli elementi."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if choice == 4:\n    expenses.clear()\n    print(\"Registro svuotato! Elementi rimasti: \", expenses.size())"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "La dimensione dopo clear() sarà 0."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const exp = s.expenses || [];
                        const ok = exp.length === 0;
                        tests.push({ desc: "expenses svuotato con clear() (size = 0)", passed: ok, diff: ok ? null : `Elementi rimasti: ${exp.length}` });
                        return tests;
        }
    },
    {
        id: 89,
        conceptId: "project_expenses",
        conceptTags: ["project", "error_handling"],
        chapterId: 16,
        isMastery: true,
        title: "89. Registro Spese: Gestione Errori (Sfida)",
        icon: "⚠️",
        xp: 75,
        expectedOutput: "Errore: Scelta non valida!",
        theory: "\n                <p>Completiamo il progetto aggiungendo un ramo <code>else</code> per intercettare qualsiasi scelta non valida (minore di 1 o maggiore di 5).</p>\n            ",
        task: "\n                <ul>\n                    <li>Data una scelta non valida <code>choice = 99</code>:</li>\n                    <li>Se la scelta è compresa tra 1 e 5 gestiscila; in caso contrario stampa l'errore: <br><code>\"Errore: Scelta non valida!\"</code></li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var choice = 99\n    # Gestisci le scelte non valide da 1 a 5\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var choice = 99\n    if choice >= 1 and choice <= 5:\n        print(\"Scelta valida\")\n    else:\n        print(\"Errore: Scelta non valida!\")\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa if choice < 1 or choice > 5 oppure il ramo else."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "if choice < 1 or choice > 5:\n    print(\"Errore: Scelta non valida!\")"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Essendo choice = 99, entrerà nel ramo di errore."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("Errore: Scelta non valida!"));
                        tests.push({ desc: "Gestione errore su scelta non valida completata", passed: hasLog, diff: hasLog ? null : "Messaggio di errore non trovato" });
                        return tests;
        }
    },
    {
        id: 90,
        conceptId: "challenges",
        conceptTags: ["challenge", "pyramid"],
        chapterId: 17,
        isMastery: false,
        title: "90. Sfida: Piramide di Asterischi",
        icon: "🔺",
        xp: 75,
        expectedOutput: "*\n***\n*****",
        theory: "\n                <p>Disegnare pattern geometrici a console allena il pensiero algoritmico e l'uso combinato di cicli e moltiplicazione di stringhe:</p>\n                <div class=\"code-preview\">\n<pre><span class=\"nb\">print</span>(<span class=\"s\">\"*\"</span>.repeat(3)) <span class=\"c\"># \"***\"</span></pre>\n                </div>\n            ",
        task: "\n                <ul>\n                    <li>Dato <code>n = 5</code> (numero massimo di asterischi della base):</li>\n                    <li>Genera una piramide stampando solo le righe con numero dispari di asterischi da 1 a n (es. per n=5: 1 asterisco, 3 asterischi, 5 asterischi).</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var n = 5\n    # Stampa le righe della piramide dispari\n    pass\n",
        solution: "extends Node\n\nfunc _ready():\n    var n = 5\n    for i in range(1, n + 1, 2):\n        print(\"*\".repeat(i))\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa range(1, n + 1, 2) per scorrere i numeri dispari: 1, 3, 5."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(1, n + 1, 2):\n    print(\"*\".repeat(i))"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "\"*\".repeat(3) produce tre asterischi consecutivi '***'."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const logs = (result.logs || []).map(l => l.trim());
                        const ok = logs.includes("*") && logs.includes("***") && logs.includes("*****");
                        tests.push({ desc: "Piramide 1, 3, 5 asterischi generata", passed: ok, diff: ok ? null : `Logs: ${logs.join(' | ')}` });
                        return tests;
        }
    },
    {
        id: 91,
        conceptId: "challenges",
        conceptTags: ["challenge", "pattern"],
        chapterId: 17,
        isMastery: false,
        title: "91. Sfida: Ricerca di Pattern in Stringhe",
        icon: "🔍",
        xp: 75,
        expectedOutput: "Occorrenze di 'hero': 2",
        theory: "\n                <p>Scrivere una funzione di ricerca che conta quante volte una parola chiave compare all'interno di una stringa di testo.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dichiara <code>find_occurrences(text: String, pattern: String) -> int</code>:</li>\n                    <li>Restituisce quante volte <code>pattern</code> appare all'interno di <code>text</code>.</li>\n                    <li>In <code>_ready()</code>, chiama la funzione con <code>\"gdscript hero è un vero hero\"</code> e <code>\"hero\"</code> e stampa <code>\"Occorrenze di 'hero': \", find_occurrences(...)</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    # Chiama e stampa le occorrenze di 'hero'\n    pass\n\n# Dichiara find_occurrences(text: String, pattern: String) -> int\n",
        solution: "extends Node\n\nfunc _ready():\n    var text = \"gdscript hero è un vero hero\"\n    print(\"Occorrenze di 'hero': \", find_occurrences(text, \"hero\"))\n\nfunc find_occurrences(text: String, pattern: String) -> int:\n    var count := 0\n    var p_len := pattern.length()\n    for i in range(text.length() - p_len + 1):\n        if text.substr(i, p_len) == pattern:\n            count += 1\n    return count\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Usa text.substr(i, pattern.length()) per estrarre sottostringhe e confrontarle con pattern."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for i in range(text.length() - p_len + 1):\n    if text.substr(i, p_len) == pattern:\n        count += 1"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "'hero' compare 2 volte nella frase."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const hasLog = (result.logs || []).some(l => l.includes("2"));
                        tests.push({ desc: "find_occurrences trova 2 occorrenze di 'hero'", passed: hasLog, diff: hasLog ? null : "Conteggio occorrenze errato" });
                        return tests;
        }
    },
    {
        id: 92,
        conceptId: "challenges",
        conceptTags: ["challenge", "capstone"],
        chapterId: 17,
        isMastery: true,
        title: "92. Gran Finale: Cosa Posso Comprare? (Sfida)",
        icon: "👑",
        xp: 100,
        expectedOutput: "Acquistabili: [\"pozione\", \"torcia\"]",
        theory: "\n                <p>Complimenti! Sei arrivato alla <strong>lezione finale di Fondamenti</strong>! Metti insieme tutte le competenze su variabili, array, dizionari e cicli per risolvere questo problema di budget di gioco.</p>\n            ",
        task: "\n                <ul>\n                    <li>Dato il negozio <code>shop = {\"spada\": 50, \"pozione\": 10, \"scudo\": 30, \"torcia\": 5}</code> e un budget <code>gold = 15</code>:</li>\n                    <li>Trova tutti gli oggetti che puoi permetterti (prezzo <= gold).</li>\n                    <li>Aggiungili a un array <code>can_buy = []</code>.</li>\n                    <li>Stampa <code>\"Acquistabili: \", can_buy</code>.</li>\n                </ul>\n            ",
        initialCode: "extends Node\n\nfunc _ready():\n    var shop = {\"spada\": 50, \"pozione\": 10, \"scudo\": 30, \"torcia\": 5}\n    var gold = 15\n    var can_buy = []\n    # Trova gli oggetti con prezzo <= gold e aggiungili a can_buy\n    pass\n    print(\"Acquistabili: \", can_buy)\n",
        solution: "extends Node\n\nfunc _ready():\n    var shop = {\"spada\": 50, \"pozione\": 10, \"scudo\": 30, \"torcia\": 5}\n    var gold = 15\n    var can_buy = []\n    for item in shop:\n        if shop[item] <= gold:\n            can_buy.append(item)\n    print(\"Acquistabili: \", can_buy)\n",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💡",
                        "label": "Indizio Concettuale",
                        "text": "Itera con for item in shop: e controlla if shop[item] <= gold:."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "for item in shop:\n    if shop[item] <= gold:\n        can_buy.append(item)"
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "✨",
                        "label": "Esempio Pratico",
                        "text": "Con 15 monete puoi comprare 'pozione' (10) e 'torcia' (5)."
            }
],
        validate: async (result) => {
        const tests = [];
                        tests.push(formatExecutionCheck(result));
                        const s = result.scope || {};
                        const cb = s.can_buy || [];
                        const ok = cb.includes("pozione") && cb.includes("torcia") && !cb.includes("spada") && !cb.includes("scudo");
                        tests.push({ desc: "Gran Finale completato: can_buy contiene pozione e torcia!", passed: ok, diff: ok ? null : `Trovato: ${JSON.stringify(cb)}` });
                        return tests;
        }
    }
];

// ==========================================
// TRAGUARDI / OBIETTIVI SBLOCCABILI (17 CAPITOLI)
// ==========================================
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

