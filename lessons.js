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
// Le precedenti attività sono state rimosse dal ramo di migrazione.
// Il contenuto didattico ufficiale viene caricato da manuale235/data.js e catalog.js.
const LESSONS_DATA = [];


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

