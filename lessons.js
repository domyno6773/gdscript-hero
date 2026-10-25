// Dataset delle Lezioni e Capitoli per GDScript Hero (100% Italiano)

const CHAPTERS_DATA = [
    {
        id: 1,
        title: "Capitolo 1: Introduzione",
        badge: "CAPITOLO 1",
        desc: "Primi passi con Godot Engine: benvenuto in GDScript 4, la funzione _ready(), commenti e stampa.",
        icon: "🌱"
    },
    {
        id: 2,
        title: "Capitolo 2: Variabili (Parte 1)",
        badge: "CAPITOLO 2",
        desc: "Creazione di variabili con var, tipi di testo String, numeri interi int e concatenazione.",
        icon: "📦"
    },
    {
        id: 3,
        title: "Capitolo 3: Variabili (Parte 2 & Tipizzazione)",
        badge: "CAPITOLO 3",
        desc: "Numeri decimali float, booleani bool, tipizzazione statica esplicita di Godot 4 e costanti const.",
        icon: "🏷️"
    },
    {
        id: 4,
        title: "Capitolo 4: Operatori e Matematica di Gioco",
        badge: "CAPITOLO 4",
        desc: "Operazioni aritmetiche (+, -, *, /, %), assegnazioni rapide e calcolo di danno, punteggi e monete.",
        icon: "⚔️"
    },
    {
        id: 5,
        title: "Capitolo 5: Condizioni e Logica (If / Elif / Else)",
        badge: "CAPITOLO 5",
        desc: "Operatori di confronto, operatori logici (and, or, not) e logica decisionale per il gameplay.",
        icon: "🛡️"
    },
    {
        id: 6,
        title: "Capitolo 6: Liste e Collezioni (Array)",
        badge: "CAPITOLO 6",
        desc: "Creare un inventario con gli Array, accesso per indice ed utilizzo di append() e size().",
        icon: "🎒"
    },
    {
        id: 7,
        title: "Capitolo 7: Cicli (For e While)",
        badge: "CAPITOLO 7",
        desc: "Cicli for con range(), iterazione su liste di oggetti o nemici e ciclo while.",
        icon: "🔄"
    },
    {
        id: 8,
        title: "Capitolo 8: Funzioni e Nodi Godot",
        badge: "CAPITOLO 8",
        desc: "Il ciclo vitale func _ready(), definizione di funzioni personalizzate con parametri e return.",
        icon: "⚙️"
    },
    {
        id: 9,
        title: "Capitolo 9: Vettori e Movimento 2D",
        badge: "CAPITOLO 9",
        desc: "Vector2(x, y), coordinate 2D nello spazio di Godot e calcolo della nuova posizione con velocità.",
        icon: "🚀"
    },
    {
        id: 10,
        title: "Capitolo 10: Dizionari (Dictionary)",
        badge: "CAPITOLO 10",
        desc: "Coppie chiave-valore con {}, accesso per chiave, aggiunta elementi e metodi has(), keys(), values().",
        icon: "📖"
    },
    {
        id: 11,
        title: "Capitolo 11: I Segnali di Godot (Signals)",
        badge: "CAPITOLO 11",
        desc: "La comunicazione disaccoppiata di Godot: dichiarare segnali, connettere funzioni ed emettere eventi con emit().",
        icon: "📡"
    },
    {
        id: 12,
        title: "Capitolo 12: Classi e Oggetti (OOP in Godot 4)",
        badge: "CAPITOLO 12",
        desc: "Programmazione a oggetti: definizione di classi con class e costruttore _init(), istanziazione con .new() ed ereditarietà.",
        icon: "🏛️"
    },
    {
        id: 13,
        title: "Capitolo 13: L'Albero della Scena e i Nodi (Scene Tree)",
        badge: "CAPITOLO 13",
        desc: "L'architettura fondamentale di Godot: cos'è un Nodo, la gerarchia della Scena, il nodo Label e l'accesso rapido con l'operatore $.",
        icon: "🌳"
    },
    {
        id: 14,
        title: "Capitolo 14: Nodi di Interfaccia & Interattività (Button & UI)",
        badge: "CAPITOLO 14",
        desc: "Controlli utente reattivi: il nodo Button, gestione del segnale pressed al click e creazione di un Clicker Game interattivo.",
        icon: "🔘"
    },
    {
        id: 15,
        title: "Capitolo 15: Nodi Temporali e Meccaniche Avanzate",
        badge: "CAPITOLO 15",
        desc: "Meccaniche e ciclo di vita: il nodo Timer con segnale timeout, grafica con ColorRect ed eliminazione nodi con queue_free().",
        icon: "⏱️"
    }
];

// Helper per feedback chiaro allo studente (distinzione sintassi vs runtime)
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

// Rimuove stringhe e commenti dal codice per impedire bypass tramite testo nei commenti o letterali
function stripCommentsAndStrings(code) {
    if (!code) return "";
    return code
        .replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, '""')
        .replace(/"(?:\\.|[^"\\])*"/g, '""')
        .replace(/'(?:\\.|[^'\\])*'/g, "''")
        .replace(/#.*$/gm, '');
}

// Verifica la presenza di commenti autentici (non contenuti all'interno di stringhe)
function hasRealComment(code) {
    if (!code) return false;
    const noStrings = code
        .replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, '""')
        .replace(/"(?:\\.|[^"\\])*"/g, '""')
        .replace(/'(?:\\.|[^'\\])*'/g, "''");
    return /#\s*\S+/.test(noStrings);
}


const LESSONS_DATA = [
    // ==========================================
    // CAPITOLO 1: INTRODUZIONE
    // ==========================================
    {
        id: 1,
        chapterId: 1,
        isMastery: false,
        title: "1. Benvenuto in GDScript 4 (print)",
        icon: "👋",
        xp: 50,
        expectedOutput: "Ciao Godot!",
        theory: `
            <p>Benvenuto in <strong>GDScript Hero</strong>! In questo corso imparerai a programmare per <strong>Godot Engine</strong> passo dopo passo attraverso sfide pratiche ed interattive.</p>
            <p>In GDScript, quando un nodo entra nella scena, Godot esegue automaticamente la funzione <code>_ready()</code>.</p>
            <p>Per inviare un messaggio alla console di debug, usiamo la funzione incorporata <code>print(...)</code> inserendo il testo tra virgolette:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="nb">print</span>(<span class="s">"Ciao Godot!"</span>)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>All'interno della funzione <code>_ready()</code>, usa <code>print(...)</code> per stampare esattamente: <br><code>"Ciao Godot!"</code></li>
                <li>Presta attenzione alle lettere maiuscole e al punto esclamativo finale.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Stampa esattamente: "Ciao Godot!"\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "In Godot, quando un nodo viene inserito nella scena, il motore esegue automaticamente la funzione `_ready()`. Pensa a questa funzione come al punto di partenza del tuo script."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa la funzione nativa `print(...)`. Il testo da stampare deve essere racchiuso tra virgolette doppie o singole e inserito indentato sotto `func _ready():`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    print(\"Saluti da Godot!\")\n```\nSostituisci il messaggio di esempio con la stringa esatta richiesta nel testo dell'esercizio."
            }
],
        solution: `func _ready():\n    print("Ciao Godot!")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasPrinted = result.logs.some(l => l.includes("Ciao Godot!"));
    tests.push({ desc: "Console contiene 'Ciao Godot!'", passed: hasPrinted, diff: hasPrinted ? null : `Ricevuto: "${result.logs.join('\n')}"` });
    return tests;
}
    },
    {
        id: 2,
        chapterId: 1,
        isMastery: false,
        title: "2. Come funzionano i commenti (#)",
        icon: "📝",
        xp: 50,
        expectedOutput: "Benvenuto nel gioco",
        theory: `
            <p>I <strong>commenti</strong> servono a spiegare cosa fa il codice. In GDScript iniziano con il simbolo cancelletto (<code>#</code>).</p>
            <p>Tutto ciò che scrivi dopo <code>#</code> viene completamente ignorato dal motore di gioco:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="c"># Questo è un commento che Godot non legge</span>
    <span class="nb">print</span>(<span class="s">"Benvenuto nel gioco"</span>)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Aggiungi una riga di commento che inizia con <code>#</code>.</li>
                <li>Subito sotto, stampa: <code>"Benvenuto nel gioco"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Inserisci il tuo commento e stampa la frase richiesta\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I commenti sono note per gli umani che il computer ignora completamente durante l'esecuzione del gioco. Servono a spiegare l'intenzione del codice."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In GDScript, qualsiasi testo che segue il simbolo cancelletto `#` sulla stessa riga diventa un commento. Puoi posizionarlo su una riga dedicata prima del `print()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    # Inizializzazione parametri\n    print(\"Test\")\n```\nInserisci un commento descrittivo seguito dal `print()` con la frase richiesta."
            }
],
        solution: `func _ready():\n    # Inizializzazione gioco\n    print("Benvenuto nel gioco")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasComment = hasRealComment(result.code);
    tests.push({ desc: "Riga di commento con '#' presente nel codice", passed: !!hasComment, diff: hasComment ? null : "Non è stato trovato alcun commento con '#'." });
    const hasPrinted = result.logs.some(l => l.includes("Benvenuto nel gioco"));
    tests.push({ desc: "Console contiene 'Benvenuto nel gioco'", passed: hasPrinted, diff: hasPrinted ? null : `Ricevuto: "${result.logs.join('\n')}"` });
    return tests;
}
    },
    {
        id: 3,
        chapterId: 1,
        isMastery: false,
        title: "3. Stampare valori multipli e numeri",
        icon: "🔢",
        xp: 50,
        expectedOutput: "Livello\n1",
        theory: `
            <p>La funzione <code>print(...)</code> può stampare sia testo che numeri senza virgolette:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="nb">print</span>(<span class="s">"Livello"</span>)
    <span class="nb">print</span>(<span class="m">1</span>)</pre>
            </div>
            <p>Ogni chiamata a <code>print(...)</code> va automaticamente a capo sulla riga successiva.</p>
        `,
        task: `
            <ul>
                <li>Stampa prima il testo <code>"Livello"</code>.</li>
                <li>Nella riga successiva stampa il numero <code>1</code> (senza virgolette).</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Stampa "Livello" e poi il numero 1\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Il testo (stringa) richiede le virgolette per essere interpretato, mentre i numeri interi sono valori numerici puri e vanno inseriti direttamente."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa due chiamate distinte a `print(...)` in sequenza: la prima con la parola tra virgolette, la seconda con il numero senza virgolette."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    print(\"Capitolo\")\n    print(42)\n```\nOgni chiamata a `print()` produce una riga separata nella console di Godot."
            }
],
        solution: `func _ready():\n    print("Livello")\n    print(1)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasLivello = result.logs.some(l => l.includes("Livello"));
    const hasNumberOne = result.logs.some(l => /^\s*1\s*$/.test(l) || (l.trim() === "1") || (l.includes("1") && !l.includes("Livello")));
    tests.push({ desc: "Stampato il testo 'Livello'", passed: hasLivello, diff: hasLivello ? null : `Ricevuto: "${result.logs.join('\n')}"` });
    tests.push({ desc: "Stampato il numero 1 su riga separata", passed: hasNumberOne, diff: hasNumberOne ? null : "Il numero 1 deve essere stampato su riga separata senza virgolette." });
    return tests;
}
    },
{
        id: 4,
        chapterId: 1,
        isMastery: true,
        title: "4. ⭐ Sfida di Apprendimento: Terminale di Avvio della Nave",
        icon: "🏆",
        xp: 100,
        difficulty: "facile",
        difficultyLabel: "Facile",
        scenario: "Il computer di bordo della navetta spaziale ha bisogno di verificare la diagnostica dei sistemi. Sotto il commento, aggiungi un commento e usa <code>print()</code> per completare la sequenza:",
        requirements: [
            'Aggiungi un commento con cancelletto: <code># Diagnostica reattori</code>',
            'Stampa la riga di sistema: <code>"Sistema: Godot OS"</code>',
            'Stampa l\'energia passando i tre valori separati da virgola: <code>"Energia: ", 100, "%"</code>'
        ],
        notice: "Non modificare le righe print() esistenti. Il programma stampa:",
        expectedOutput: "=== AVVIO SISTEMA ===\nSistema: Godot OS\nEnergia: 100 %\n=== DIAGNOSTICA COMPLETATA ===",
        initialCode: `extends Node\n\nfunc _ready():\n    print("=== AVVIO SISTEMA ===")\n    # Aggiungi il commento e le due istruzioni print() sotto\n    \n    # Non modificare la riga sotto\n    print("=== DIAGNOSTICA COMPLETATA ===")\n`,
        aiExplanation: "In questo esercizio applichi i fondamenti del Capitolo 1: i commenti con <code>#</code> vengono ignorati dal motore ma servono a documentare il codice. La funzione <code>print()</code> accetta sia singoli testi tra virgolette, sia argomenti multipli separati da virgola come <code>print(\"Energia: \", 100, \"%\")</code>, che Godot formatta automaticamente con gli spazi corretti.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida richiede di combinare documentazione (commento con cancelletto) e output di diagnostica nella console."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Scrivi una riga che inizia con `#` per documentare il sistema, poi due istruzioni `print(...)` separate per i due parametri di diagnostica."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    # Diagnostica motore\n    print(\"Modulo: Audio\")\n    print(\"Volume:\", 80, \"%\")\n```\nAdatta i nomi delle etichette e le percentuali ai requisiti della missione."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    print("=== AVVIO SISTEMA ===")\n    # Diagnostica reattori\n    print("Sistema: Godot OS")\n    print("Energia: ", 100, "%")\n    print("=== DIAGNOSTICA COMPLETATA ===")
`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Terminale di Avvio della Nave</h3>
                <p>Metti alla prova i fondamenti del Capitolo 1 completando la sequenza di diagnostica del terminale di bordo.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Aggiungi il commento <code># Diagnostica reattori</code></li>
                <li>Stampa <code>"Sistema: Godot OS"</code></li>
                <li>Stampa con valori multipli: <code>"Energia: ", 100, "%"</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasComment = hasRealComment(result.code);
    tests.push({ desc: "Commento di diagnostica '#' presente", passed: !!hasComment, diff: hasComment ? null : "Aggiungi un commento che inizia con '#'." });
    const clean = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const hasSystem = clean.includes("Sistema: Godot OS");
    const hasEnergy = clean.includes("Energia: 100 %") || clean.includes("Energia: 100%");
    tests.push({ desc: "Sistema: Godot OS stampato", passed: hasSystem, diff: hasSystem ? null : `Ricevuto: "${clean}"` });
    tests.push({ desc: "Energia: 100 % stampato con valori multipli", passed: hasEnergy, diff: hasEnergy ? null : `Ricevuto: "${clean}"` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 2: VARIABILI (PARTE 1)
    // ==========================================
    {
        id: 5,
        chapterId: 2,
        isMastery: false,
        title: "5. Creazione di variabili con var",
        icon: "📦",
        xp: 50,
        expectedOutput: "Eroe",
        theory: `
            <p>Una <strong>variabile</strong> è un contenitore a cui diamo un nome per memorizzare un dato che il gioco userà più volte.</p>
            <p>In GDScript si usa la parola chiave <code>var</code> seguita dal nome e dal valore:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> nome = <span class="s">"Eroe"</span>
    <span class="nb">print</span>(nome)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara una variabile chiamata <code>nome</code> e assegnale il valore <code>"Eroe"</code>.</li>
                <li>Stampa la variabile usando <code>print(nome)</code> (senza virgolette attorno a nome).</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Dichiara la variabile nome e stampala\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Una variabile è come una scatola etichettata nella memoria del computer in cui conservare un dato che potrai riutilizzare più volte nel gioco."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In GDScript si crea una variabile con la parola chiave `var`, seguita dal nome della variabile, dall'operatore `=` e dal valore numerico iniziale."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var monete = 25\n    print(monete)\n```\nNota che quando stampi la variabile non devi usare le virgolette, altrimenti stamperesti il testo del nome e non il suo contenuto numerico."
            }
],
        solution: `func _ready():\n    var nome = "Eroe"\n    print(nome)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasVar = result.scope && result.scope.nome === "Eroe";
    tests.push({ desc: "Variabile 'nome' creata con valore 'Eroe'", passed: hasVar, diff: hasVar ? null : `Valore attuale: ${result.scope ? result.scope.nome : 'non definita'}` });
    const printed = result.logs.some(l => l.includes("Eroe"));
    tests.push({ desc: "Valore della variabile 'nome' stampato a console", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 6,
        isDebugging: true,
        debugType: "Sintassi (Virgolette mancanti)",
        chapterId: 2,
        isMastery: false,
        title: "6. Tipi di testo (String) e interi (int)",
        icon: "🏷️",
        xp: 50,
        expectedOutput: "Guerriero\n100",
        theory: `
            <p>I due tipi fondamentali per un personaggio sono il suo nome (<strong>String</strong>, testo) e i suoi punti vita (<strong>int</strong>, numero intero):</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> personaggio = <span class="s">"Guerriero"</span>
    <span class="k">var</span> punti_vita = <span class="m">100</span>
    <span class="nb">print</span>(personaggio)
    <span class="nb">print</span>(punti_vita)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Crea la variabile <code>personaggio</code> con valore <code>"Guerriero"</code>.</li>
                <li>Crea la variabile <code>punti_vita</code> con valore intero <code>100</code>.</li>
                <li>Stampa entrambe le variabili su righe separate.</li>
            </ul>
        `,
        initialCode: `func _ready():
    # BUG DI SINTASSI: Manca la delimitazione della stringa!
    # Correggi la riga sotto affinché 'Eroe' sia una stringa racchiusa tra virgolette:
    var nome_giocatore = Eroe
    print(nome_giocatore)
`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Le stringhe rappresentano testi o sequenze di caratteri (nomi di personaggi, messaggi di dialogo). Senza virgolette, il compilatore le confonderebbe con variabili non definite."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dichiara la variabile con `var` e assegna la stringa racchiusa tra doppi apici `\"...\"` o singoli apici `'...'`. Poi passa la variabile a `print()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var titolo = \"Cavaliere\"\n    print(titolo)\n```\nSe il codice di partenza conteneva un errore (virgolette mancanti), racchiudi la parola nelle virgolette."
            }
],
        solution: `func _ready():\n    var personaggio = "Guerriero"\n    var punti_vita = 100\n    print(personaggio)\n    print(punti_vita)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const isStr = result.scope && result.scope.personaggio === "Guerriero";
    const isInt = result.scope && result.scope.punti_vita === 100;
    tests.push({ desc: "Variabile 'personaggio' impostata a 'Guerriero'", passed: isStr, diff: isStr ? null : `Valore: ${result.scope ? result.scope.personaggio : 'undefined'}` });
    tests.push({ desc: "Variabile 'punti_vita' impostata a intero 100", passed: isInt, diff: isInt ? null : `Valore: ${result.scope ? result.scope.punti_vita : 'undefined'}` });
    const pPrinted = result.logs.some(l => l.includes("Guerriero"));
    const hpPrinted = result.logs.some(l => l.includes("100"));
    tests.push({ desc: "Entrambe le variabili stampate a console", passed: pPrinted && hpPrinted, diff: (pPrinted && hpPrinted) ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 7,
        chapterId: 2,
        isMastery: false,
        title: "7. Concatenazione di stringhe",
        icon: "🔗",
        xp: 50,
        expectedOutput: "Giocatore: Eroe",
        theory: `
            <p>Puoi unire due stringhe usando l'operatore <code>+</code>. Questo processo si chiama <strong>concatenazione</strong>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> nome = <span class="s">"Eroe"</span>
    <span class="k">var</span> messaggio = <span class="s">"Giocatore: "</span> + nome
    <span class="nb">print</span>(messaggio)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>nome = "Eroe"</code>.</li>
                <li>Dichiara <code>messaggio = "Giocatore: " + nome</code>.</li>
                <li>Stampa la variabile <code>messaggio</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Concatena "Giocatore: " con la variabile nome e stampa\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Concatenare significa 'incollare' due stringhe insieme per formare una frase completa (es. unire un'etichetta fissa con il nome dinamico del personaggio)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In GDScript puoi unire due stringhe usando l'operatore di addizione `+`. Assegna il risultato dell'unione a una seconda variabile `messaggio`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var utente = \"Mario\"\n    var benvenuto = \"Ciao: \" + utente\n    print(benvenuto)\n```\nFai attenzione a includere lo spazio dopo i due punti all'interno delle virgolette."
            }
],
        solution: `func _ready():\n    var nome = "Eroe"\n    var messaggio = "Giocatore: " + nome\n    print(messaggio)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasNome = result.scope && result.scope.nome === "Eroe";
    const hasMsg = result.scope && result.scope.messaggio === "Giocatore: Eroe";
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesConcat = cleanCode.includes("+") && cleanCode.includes("nome");
    tests.push({ desc: "Variabili 'nome' e 'messaggio' create correttamente", passed: hasNome && hasMsg, diff: (hasNome && hasMsg) ? null : `nome=${result.scope ? result.scope.nome : 'null'}, messaggio=${result.scope ? result.scope.messaggio : 'null'}` });
    tests.push({ desc: "Concatenazione con l'operatore '+' utilizzata", passed: !!usesConcat, diff: usesConcat ? null : "Usa 'Giocatore: ' + nome per concatenare la stringa." });
    const printed = result.logs.some(l => l.includes("Giocatore: Eroe"));
    tests.push({ desc: "Stringa concatenata stampata a console", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
{
        id: 8,
        chapterId: 2,
        isMastery: true,
        title: "8. ⭐ Sfida di Apprendimento: Dialoghi e Codice Segreto",
        icon: "🏆",
        xp: 100,
        difficulty: "facile",
        difficultyLabel: "Facile",
        scenario: "Un gioco d'avventura ha bisogno di tre elementi di testo. Sotto il commento, crea tre variabili <code>String</code>:",
        requirements: [
            '<code>title</code> contiene <code>The \"Lost\" Key</code>, comprese le due virgolette doppie',
            '<code>npc_line</code> contiene <code>It\'s dangerous to go alone!</code>, compreso l\'apostrofo',
            '<code>door_code</code> contiene i quattro caratteri <code>0420</code>'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Title: The \"Lost\" Key\nNPC: It's dangerous to go alone!\nDoor code: 0420",
        initialCode: `extends Node\n\nfunc _ready():\n    # Crea title, npc_line e door_code sotto\n    \n    # Non modificare le righe sotto\n    print("Title: ", title)\n    print("NPC: ", npc_line)\n    print("Door code: ", door_code)\n`,
        aiExplanation: "In GDScript puoi creare stringhe sia con virgolette doppie <code>\"...\"</code> sia con apici singoli <code>'...'</code>. Se il testo contiene virgolette doppie interne (come <code>\"Lost\"</code>), racchiudi la stringa tra apici singoli come <code>'The \"Lost\" Key'</code> oppure usa il carattere di escape <code>\\\"</code>. Per includere un apostrofo, racchiudi la stringa tra virgolette doppie. Per codici con zero iniziale come <code>\"0420\"</code>, usa sempre una stringa di caratteri altrimenti verrebbe troncato a numero.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I giochi di ruolo memorizzano attributi differenti per ciascun personaggio: testo per l'identità, numeri interi per le statistiche come punti salute e forza."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dichiara le variabili richieste (`nome_personaggio`, `classe_ruolo`, `salute_iniziale`, `livello`) una sotto l'altra, quindi stampale ciascuna con la propria etichetta."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var eroe = \"Geralt\"\n    var hp = 100\n    print(\"Eroe:\", eroe)\n    print(\"HP:\", hp)\n```\nIn `print()`, passare argomenti separati da virgola inserisce automaticamente uno spazio."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var title = 'The "Lost" Key'\n    var npc_line = "It's dangerous to go alone!"\n    var door_code = "0420"\n    \n    # Non modificare le righe sotto\n    print("Title: ", title)\n    print("NPC: ", npc_line)\n    print("Door code: ", door_code)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Dialoghi e Codice Segreto</h3>
                <p>Metti alla prova la gestione delle variabili String, apici ed escape di caratteri in GDScript.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Crea <code>title</code> con <code>The "Lost" Key</code></li>
                <li>Crea <code>npc_line</code> con <code>It's dangerous to go alone!</code></li>
                <li>Crea <code>door_code</code> con la stringa <code>0420</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const titleOk = s.title === 'The "Lost" Key';
    const npcOk = s.npc_line === "It's dangerous to go alone!";
    const doorOk = s.door_code === "0420";
    tests.push({ desc: "Variabile 'title' con virgolette interne corretta", passed: titleOk, diff: titleOk ? null : `Ricevuto: ${s.title}` });
    tests.push({ desc: "Variabile 'npc_line' con apostrofo corretta", passed: npcOk, diff: npcOk ? null : `Ricevuto: ${s.npc_line}` });
    tests.push({ desc: "Variabile 'door_code' impostata a \"0420\"", passed: doorOk, diff: doorOk ? null : `Ricevuto: ${s.door_code}` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 3: VARIABILI (PARTE 2 & TIPIZZAZIONE)
    // ==========================================
    {
        id: 9,
        chapterId: 3,
        isMastery: false,
        title: "9. Numeri decimali (float) e Booleani (bool)",
        icon: "🔑",
        xp: 50,
        expectedOutput: "4.5\ntrue",
        theory: `
            <p>Oltre a testo e numeri interi, nei videogiochi usiamo:</p>
            <ul>
                <li><strong>float</strong>: numeri con la virgola (es. velocità, coordinate).</li>
                <li><strong>bool</strong>: valori logici che possono essere solo <code>true</code> o <code>false</code>.</li>
            </ul>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> velocita = <span class="m">4.5</span>
    <span class="k">var</span> ha_chiave = <span class="k">true</span>
    <span class="nb">print</span>(velocita)
    <span class="nb">print</span>(ha_chiave)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>velocita = 4.5</code>.</li>
                <li>Dichiara <code>ha_chiave = true</code>.</li>
                <li>Stampa entrambe le variabili su righe separate.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Dichiara velocita (float) e ha_chiave (bool)\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I numeri con la virgola (chiamati `float` per virgola mobile) servono per grandezze fisiche continue come velocità, tempo in secondi, o moltiplicatori di danno."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In programmazione si usa il punto `.` come separatore decimale anziché la virgola. Crea la variabile assegnando il numero decimale con il punto."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var fattore_scala = 1.75\n    print(fattore_scala)\n```\nNon usare `1,75` poiché la virgola separa gli argomenti."
            }
],
        solution: `func _ready():\n    var velocita = 4.5\n    var ha_chiave = true\n    print(velocita)\n    print(ha_chiave)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const isFloat = result.scope && result.scope.velocita === 4.5;
    const isBool = result.scope && result.scope.ha_chiave === true;
    tests.push({ desc: "Variabile float 'velocita = 4.5' creata", passed: isFloat, diff: isFloat ? null : `Valore: ${result.scope ? result.scope.velocita : 'undefined'}` });
    tests.push({ desc: "Variabile bool 'ha_chiave = true' creata", passed: isBool, diff: isBool ? null : `Valore: ${result.scope ? result.scope.ha_chiave : 'undefined'}` });
    return tests;
}
    },
    {
        id: 10,
        chapterId: 3,
        isMastery: false,
        title: "10. Tipizzazione statica esplicita",
        icon: "🛡️",
        xp: 50,
        expectedOutput: "100",
        theory: `
            <p>In Godot 4 è consigliato indicare esplicitamente il tipo della variabile usando la sintassi <code>: Tipo</code>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> vita: int = <span class="m">100</span>
    <span class="nb">print</span>(vita)</pre>
            </div>
            <p>Questo protegge il gioco da errori e rende il codice molto più veloce e chiaro.</p>
        `,
        task: `
            <ul>
                <li>Dichiara una variabile tipizzata esplicitamente: <code>var vita: int = 100</code>.</li>
                <li>Stampa <code>vita</code> sulla console.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Dichiara con tipizzazione statica: var vita: int = 100\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "La tipizzazione statica esplicita informa Godot sul tipo di dato che la variabile conterrà per sempre. Questo previene bug ed ottimizza le prestazioni dello script."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Aggiungi `:` seguito dal tipo (`int`, `float`, `String`, `bool`) subito dopo il nome della variabile e prima del segno `=`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var energia: int = 50\n    print(energia)\n```\nLa struttura è sempre: `var nome: Tipo = valore`."
            }
],
        solution: `func _ready():\n    var vita: int = 100\n    print(vita)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const okVal = result.scope && result.scope.vita === 100;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasType = /(:\s*int\b)/.test(cleanCode);
    tests.push({ desc: "Variabile 'vita' con valore 100", passed: okVal, diff: okVal ? null : `Valore attuale: ${result.scope ? result.scope.vita : 'undefined'}` });
    tests.push({ desc: "Tipizzazione statica esplicita ': int' applicata", passed: !!hasType, diff: hasType ? null : "Aggiungi ': int' dopo il nome della variabile: var vita: int = 100." });
    return tests;
}
    },
    {
        id: 11,
        chapterId: 3,
        isMastery: false,
        title: "11. Costanti con const",
        icon: "🔒",
        xp: 50,
        expectedOutput: "9.8",
        theory: `
            <p>Se un valore non deve <strong>mai</strong> cambiare durante il gioco (come la forza di gravità o il limite massimo di giocatori), si usa <code>const</code> anziché <code>var</code>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">const</span> GRAVITA = <span class="m">9.8</span>
    <span class="nb">print</span>(GRAVITA)</pre>
            </div>
            <p>Per convenzione, i nomi delle costanti si scrivono tutte in MAIUSCOLO.</p>
        `,
        task: `
            <ul>
                <li>Dichiara la costante: <code>const GRAVITA = 9.8</code>.</li>
                <li>Stampa la costante con <code>print(GRAVITA)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Dichiara la costante GRAVITA e stampala\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Se un parametro di gioco non deve MAI cambiare durante l'esecuzione (come le leggi fisiche o la risoluzione base), usare `const` impedisce modifiche accidentali."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Sostituisci la parola chiave `var` con `const`. Per convenzione in Godot, i nomi delle costanti si scrivono interamente in MAIUSCOLO."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nconst ATTRITO = 0.85\n\nfunc _ready():\n    print(ATTRITO)\n```\nLe costanti possono essere definite sia a livello di classe (in cima al file) che all'interno di funzioni."
            }
],
        solution: `func _ready():\n    const GRAVITA = 9.8\n    print(GRAVITA)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const okVal = result.scope && result.scope.GRAVITA === 9.8;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasConst = /\bconst\s+GRAVITA\b/.test(cleanCode);
    tests.push({ desc: "Costante GRAVITA impostata a 9.8", passed: okVal, diff: okVal ? null : `Valore: ${result.scope ? result.scope.GRAVITA : 'undefined'}` });
    tests.push({ desc: "Parola chiave 'const' utilizzata", passed: !!hasConst, diff: hasConst ? null : "Dichiara la costante con: const GRAVITA = 9.8." });
    return tests;
}
    },
{
        id: 12,
        chapterId: 3,
        isMastery: true,
        title: "12. ⭐ Sfida di Apprendimento: Scheda Eroe RPG Tipizzata",
        icon: "🏆",
        xp: 100,
        difficulty: "facile",
        difficultyLabel: "Facile",
        scenario: "Il database degli eroi richiede tipi statici espliciti per prevenire bug e garantire prestazioni ottimali. Sotto il commento, dichiara una costante e tre variabili con la sintassi richiesta:",
        requirements: [
            'Dichiara la costante globale: <code>const MAX_HP: int = 200</code>',
            'Dichiara la variabile tipizzata: <code>var eroe: String = \"Valerius\"</code>',
            'Dichiara la variabile tipizzata: <code>var salute: int = 150</code>',
            'Dichiara con inferenza automatica: <code>var scudo_attivo := true</code> (usando l\'operatore <code>:=</code>)'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Eroe: Valerius\nHP: 150 / 200\nScudo: true",
        initialCode: `extends Node\n\n# Dichiara la costante MAX_HP sotto\n\nfunc _ready():\n    # Crea eroe, salute e scudo_attivo sotto\n    \n    # Non modificare le righe sotto\n    print("Eroe: ", eroe)\n    print("HP: ", salute, " / ", MAX_HP)\n    print("Scudo: ", scudo_attivo)\n`,
        aiExplanation: "In GDScript 4, le costanti si dichiarano con <code>const NOME: Tipo = Valore</code> e non possono essere modificate durante il gioco. La tipizzazione statica usa la sintassi <code>var nome: Tipo = valore</code>, consentendo all'autocompletamento di suggerire i metodi corretti. L'operatore speciale di inferenza <code>:=</code> assegna il tipo automaticamente in base al valore iniziale.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "In Godot 4, l'operatore walrus `:=` permette di combinare la sicurezza del tipo statico con la brevità, lasciando che Godot indovini il tipo dal valore assegnato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `const NOME := valore` per una costante con tipo inferito, oppure `var nome := valore` per una variabile con tipo inferito."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nconst LIMITE_LIVELLO := 99\n\nfunc _ready():\n    var attivo := true\n    print(LIMITE_LIVELLO)\n```\n`LIMITE_LIVELLO` riceve automaticamente il tipo `: int` senza doverlo digitare manualmente."
            }
],
        solution: `extends Node\n\nconst MAX_HP: int = 200\n\nfunc _ready():\n    var eroe: String = "Valerius"\n    var salute: int = 150\n    var scudo_attivo := true\n    \n    # Non modificare le righe sotto\n    print("Eroe: ", eroe)\n    print("HP: ", salute, " / ", MAX_HP)\n    print("Scudo: ", scudo_attivo)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Scheda Eroe RPG Tipizzata</h3>
                <p>Applica tipi statici rigorosi, costanti e inferenza per configurare la scheda dell'avventuriero.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>const MAX_HP: int = 200</code></li>
                <li>Dichiara <code>var eroe: String = "Valerius"</code></li>
                <li>Dichiara <code>var salute: int = 150</code></li>
                <li>Dichiara <code>var scudo_attivo := true</code> con inferenza <code>:=</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const heroOk = s.eroe === "Valerius";
    const hpOk = s.salute === 150;
    const shieldOk = s.scudo_attivo === true;
    const maxHpOk = s.MAX_HP === 200;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasConst = /\bconst\s+MAX_HP\b/.test(cleanCode);
    const hasInfer = /:=/.test(cleanCode);
    tests.push({ desc: "Costante MAX_HP: int = 200 con const", passed: maxHpOk && hasConst, diff: (maxHpOk && hasConst) ? null : "Dichiara const MAX_HP: int = 200" });
    tests.push({ desc: "Variabili tipizzate eroe e salute configurate", passed: heroOk && hpOk, diff: (heroOk && hpOk) ? null : `eroe=${s.eroe}, salute=${s.salute}` });
    tests.push({ desc: "Variabile scudo_attivo con inferenza di tipo ':='", passed: shieldOk && hasInfer, diff: (shieldOk && hasInfer) ? null : "Usa ':=' per scudo_attivo := true" });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 4: OPERATORI E MATEMATICA DI GIOCO
    // ==========================================
    {
        id: 13,
        chapterId: 4,
        isMastery: false,
        title: "13. Operazioni aritmetiche (+, -, *, /, %)",
        icon: "➕",
        xp: 50,
        expectedOutput: "15\n10",
        theory: `
            <p>GDScript supporta tutti gli operatori aritmetici standard:</p>
            <ul>
                <li><code>+</code> (Addizione) e <code>-</code> (Sottrazione)</li>
                <li><code>*</code> (Moltiplicazione) e <code>/</code> (Divisione)</li>
                <li><code>%</code> (Modulo: calcola il resto della divisione)</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Calcola la somma: <code>var somma = 10 + 5</code> e stampala.</li>
                <li>Calcola la moltiplicazione: <code>var prodotto = 5 * 2</code> e stampala.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Calcola somma (10 + 5) e prodotto (5 * 2), poi stampali\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Il computer valuta prima le moltiplicazioni e divisioni, e solo successivamente addizioni e sottrazioni, esattamente come nelle regole matematiche standard."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Combina l'addizione `+` e la moltiplicazione `*` in un'unica espressione assegnata alla variabile `xp_totali`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var monete_totali = 100 + 4 * 10\n    print(monete_totali)\n```\n`4 * 10` viene calcolato per primo (40), poi sommato a 100 per un totale di 140."
            }
],
        solution: `func _ready():\n    var somma = 10 + 5\n    var prodotto = 5 * 2\n    print(somma)\n    print(prodotto)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope && result.scope.somma === 15;
    const p = result.scope && result.scope.prodotto === 10;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasOps = cleanCode.includes("+") && cleanCode.includes("*");
    tests.push({ desc: "Somma (10 + 5 = 15) calcolata", passed: s, diff: s ? null : `Ricevuto somma: ${result.scope ? result.scope.somma : 'null'}` });
    tests.push({ desc: "Prodotto (5 * 2 = 10) calcolato", passed: p, diff: p ? null : `Ricevuto prodotto: ${result.scope ? result.scope.prodotto : 'null'}` });
    tests.push({ desc: "Operatori '+' e '*' utilizzati nel calcolo", passed: !!hasOps, diff: hasOps ? null : "Usa gli operatori + e * per eseguire le operazioni matematiche." });
    return tests;
}
    },
    {
        id: 14,
        isDebugging: true,
        debugType: "Logica (Precedenza aritmetica)",
        chapterId: 4,
        isMastery: false,
        title: "14. Assegnazioni rapide (+=, -=)",
        icon: "⚡",
        xp: 50,
        expectedOutput: "80",
        theory: `
            <p>Nei giochi modifichiamo continuamente le variabili. Gli operatori di assegnazione rapida velocizzano la scrittura:</p>
            <ul>
                <li><code>punti_vita -= danno</code> (equivale a <code>punti_vita = punti_vita - danno</code>)</li>
                <li><code>monete += premio</code> (equivale a <code>monete = monete + premio</code>)</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Crea <code>punti_vita = 100</code>.</li>
                <li>Sottrai <code>20</code> usando <code>punti_vita -= 20</code>.</li>
                <li>Stampa il valore finale di <code>punti_vita</code> (80).</li>
            </ul>
        `,
        initialCode: `func _ready():
    # BUG DI PRECEDENZA: La divisione viene eseguita prima dell'addizione!
    # Aggiungi le parentesi tonde per calcolare la media corretta (50):
    var media_salute = 60 + 40 / 2
    print(media_salute)
`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Quando vuoi che una somma venga calcolata prima di una divisione (come nel calcolo di una media tra due valori), devi forzare la precedenza racchiudendo la somma tra parentesi tonde."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Racchiudi gli addendi tra parentesi tonde: `(valore1 + valore2) / 2`. In questo modo la somma viene eseguita per prima."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    # Senza parentesi: 10 + 20 / 2 = 10 + 10 = 20 (Sbagliato)\n    var media = (10 + 20) / 2 # (30) / 2 = 15 (Corretto)\n    print(media)\n```\nIdentifica l'espressione nel codice e avvolgila tra parentesi tonde."
            }
],
        solution: `func _ready():\n    var punti_vita = 100\n    punti_vita -= 20\n    print(punti_vita)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const ok = result.scope && result.scope.punteggio === 20;
    tests.push({ desc: "Espressione 'punteggio = 10 + 5 * 2' calcolata a 20", passed: ok, diff: ok ? null : `Ricevuto: ${result.scope ? result.scope.punteggio : 'null'}` });
    return tests;
}
    },
    {
        id: 15,
        chapterId: 4,
        isMastery: false,
        title: "15. Calcolo del danno, punteggi e monete",
        icon: "💰",
        xp: 50,
        expectedOutput: "150",
        theory: `
            <p>Quando sconfiggi un nemico, moltiplichiamo le monete base per il punteggio moltiplicatore del livello:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> monete_base = <span class="m">50</span>
    <span class="k">var</span> moltiplicatore = <span class="m">3</span>
    <span class="k">var</span> monete_totali = monete_base * moltiplicatore
    <span class="nb">print</span>(monete_totali)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>monete_base = 50</code>.</li>
                <li>Dichiara <code>moltiplicatore = 3</code>.</li>
                <li>Crea <code>monete_totali = monete_base * moltiplicatore</code> e stampala.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Calcola monete_totali e stampala\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Invece di riscrivere `monete = monete + 25`, puoi usare una scorciatoia sintattica che ordina a Godot di 'aggiungere 25 al valore già presente nella variabile'."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa l'operatore di assegnazione composta `+=`. La sintassi è: `nome_variabile += incremento`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var punteggio = 10\n    punteggio += 5 # Ora punteggio vale 15\n    print(punteggio)\n```\nPrima dichiara la variabile con il valore di partenza, poi applica `+=`."
            }
],
        solution: `func _ready():\n    var monete_base = 50\n    var moltiplicatore = 3\n    var monete_totali = monete_base * moltiplicatore\n    print(monete_totali)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const okVal = result.scope && result.scope.monete_totali === 150;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasCompound = /\+=/.test(cleanCode);
    tests.push({ desc: "Monete totali aggiornate a 150", passed: okVal, diff: okVal ? null : `Ricevuto: ${result.scope ? result.scope.monete_totali : 'null'}` });
    tests.push({ desc: "Operatore di assegnazione composta '+=' utilizzato", passed: !!hasCompound, diff: hasCompound ? null : "Usa 'monete_totali += 50' per incrementare il valore." });
    return tests;
}
    },
{
        id: 16,
        chapterId: 4,
        isMastery: true,
        title: "16. ⭐ Sfida di Apprendimento: Bottino del Dungeon e Danno Subito",
        icon: "🏆",
        xp: 100,
        difficulty: "media",
        difficultyLabel: "Media",
        scenario: "Al termine di uno scontro nel dungeon, il party di 3 avventurieri calcola i punti ferita rimasti e si spartisce equamente un forziere di 100 monete d'oro. Sotto il commento, esegui i calcoli con gli operatori adatti:",
        requirements: [
            '<code>salute_rimasta</code>: parte da <code>100</code>; sottrai un danno di <code>35</code> usando l\'operatore rapido <code>-=</code>',
            '<code>monete_per_membro</code>: calcola quante monete intere spettano a ciascuno dividendo <code>100 / 3</code>',
            '<code>monete_avanzate</code>: calcola quante monete restano nel forziere usando l\'operatore modulo <code>%</code> (<code>100 % 3</code>)'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Salute Guerriero: 65\nMonete per membro: 33\nMonete avanzate: 1",
        initialCode: `extends Node\n\nfunc _ready():\n    var salute_rimasta = 100\n    # Aggiorna salute_rimasta e calcola monete_per_membro e monete_avanzate sotto\n    \n    # Non modificare le righe sotto\n    print("Salute Guerriero: ", salute_rimasta)\n    print("Monete per membro: ", monete_per_membro)\n    print("Monete avanzate: ", monete_avanzate)\n`,
        aiExplanation: "In GDScript l'operatore <code>-=</code> sottrae un valore direttamente da una variabile esistente (es. <code>salute_rimasta -= 35</code>). La divisione intera tra due numeri interi <code>100 / 3</code> calcola la parte intera (33), mentre l'operatore resto <code>%</code> (modulo) calcola quante unità avanzano dalla divisione (1).",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Quando distribuisci risorse tra membri di una squadra, la divisione intera ti dice quante monete spettano a ciascuno, mentre l'operatore modulo `%` restituisce il resto che non può essere diviso equamente."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `-=` per sottrarre danno dalla salute, `/` per la divisione in parti uguali e `%` (modulo) per calcolare le monete avanzate."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var mele = 10\n    var mele_per_persona = 10 / 3 # Divisione intera = 3\n    var resto = 10 % 3           # Resto della divisione = 1\n```\nIn GDScript, dividere due numeri interi restituisce un quoziente intero."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var salute_rimasta = 100\n    salute_rimasta -= 35\n    var monete_per_membro = 100 / 3\n    var monete_avanzate = 100 % 3\n    \n    # Non modificare le righe sotto\n    print("Salute Guerriero: ", salute_rimasta)\n    print("Monete per membro: ", monete_per_membro)\n    print("Monete avanzate: ", monete_avanzate)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Bottino del Dungeon e Danno Subito</h3>
                <p>Verifica l'uso degli operatori di assegnazione rapida (-=), divisione intera (/) e resto modulo (%).</p>
            </div>
        `,
        task: `
            <ul>
                <li>Sottrai 35 da <code>salute_rimasta</code> con <code>-=</code></li>
                <li>Calcola <code>var monete_per_membro = 100 / 3</code></li>
                <li>Calcola <code>var monete_avanzate = 100 % 3</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const hpOk = s.salute_rimasta === 65;
    const coinsOk = Math.floor(Number(s.monete_per_membro)) === 33;
    const restOk = s.monete_avanzate === 1;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasSub = /-=/ .test(cleanCode);
    const hasMod = /%/.test(cleanCode);
    tests.push({ desc: "Salute rimasta aggiornata con '-=' a 65", passed: hpOk && hasSub, diff: hpOk ? (hasSub ? null : "Usa '-='") : `Ricevuto: ${s.salute_rimasta}` });
    tests.push({ desc: "Divisione intera monete per membro calcolata a 33", passed: coinsOk, diff: coinsOk ? null : `Ricevuto: ${s.monete_per_membro}` });
    tests.push({ desc: "Modulo '%' resto monete calcolato a 1", passed: restOk && hasMod, diff: restOk ? (hasMod ? null : "Usa '%'") : `Ricevuto: ${s.monete_avanzate}` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 5: CONDIZIONI E LOGICA (IF / ELIF / ELSE)
    // ==========================================
    {
        id: 17,
        chapterId: 5,
        isMastery: false,
        title: "17. Operatori di confronto (==, !=, >, <)",
        icon: "⚖️",
        xp: 50,
        expectedOutput: "Livello raggiunto!",
        theory: `
            <p>Gli <strong>operatori di confronto</strong> permettono di confrontare due valori:</p>
            <ul>
                <li><code>==</code> (Uguale a) e <code>!=</code> (Diverso da)</li>
                <li><code>></code> (Maggiore) e <code><</code> (Minore)</li>
                <li><code>>=</code> (Maggiore o uguale) e <code><=</code> (Minore o uguale)</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Dichiara <code>livello = 10</code>.</li>
                <li>Se <code>livello >= 10:</code>, stampa <code>"Livello raggiunto!"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    var livello = 10\n    # Confronta con >= e stampa\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Le istruzioni condizionali permettono al gioco di prendere decisioni: eseguire un blocco di codice solo se una determinata condizione è vera (ad esempio se il giocatore ha raggiunto il livello richiesto)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `if` seguito dalla condizione e dai due punti `:`. Le istruzioni da eseguire devono essere indentate di 4 spazi."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var punteggio = 15\n    if punteggio >= 10:\n        print(\"Traguardo superato!\")\n```\nNon dimenticare i due punti `:` alla fine della riga dell'if."
            }
],
        solution: `func _ready():\n    var livello = 10\n    if livello >= 10:\n        print("Livello raggiunto!")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasVar = result.scope && result.scope.livello !== undefined && result.scope.livello >= 10;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasIf = /\bif\s+livello\s*(>=|>|==)/.test(cleanCode);
    tests.push({ desc: "Variabile 'livello' configurata (>= 10)", passed: hasVar, diff: hasVar ? null : `Valore livello: ${result.scope ? result.scope.livello : 'undefined'}` });
    tests.push({ desc: "Condizione 'if' sul livello applicata", passed: !!hasIf, diff: hasIf ? null : "Usa 'if livello >= 10:' per verificare la condizione." });
    const printed = result.logs.some(l => l.includes("Livello raggiunto!"));
    tests.push({ desc: "Messaggio 'Livello raggiunto!' stampato", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 18,
        chapterId: 5,
        isMastery: false,
        title: "18. Operatori logici (and, or, not)",
        icon: "🧠",
        xp: 50,
        expectedOutput: "Accesso consentito",
        theory: `
            <p>In GDScript puoi combinare più condizioni logiche:</p>
            <ul>
                <li><code>and</code>: entrambe le condizioni devono essere vere.</li>
                <li><code>or</code>: almeno una delle due deve essere vera.</li>
                <li><code>not</code>: inverte il valore di verità.</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Dichiara <code>ha_chiave = true</code> e <code>porta_chiusa = true</code>.</li>
                <li>Se <code>ha_chiave and porta_chiusa:</code> stampa <code>"Accesso consentito"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    var ha_chiave = true\n    var porta_chiusa = true\n    # Combina con and e stampa\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Spesso un'azione richiede che PIÙ condizioni siano soddisfatte contemporaneamente (ad esempio possedere sia la chiave che il livello sufficiente per aprire una porta)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Unisci le due condizioni all'interno dell'`if` usando l'operatore logico `and`. Entrambe le espressioni devono risultare `true` affinché il blocco venga eseguito."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var ha_pass = true\n    var eta = 18\n    if ha_pass and eta >= 18:\n        print(\"Ingresso VIP consentito\")\n```\nSe una sola delle due condizioni fosse falsa, il print verrebbe saltato."
            }
],
        solution: `func _ready():\n    var ha_chiave = true\n    var porta_chiusa = true\n    if ha_chiave and porta_chiusa:\n        print("Accesso consentito")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasKeys = result.scope && result.scope.ha_chiave === true && result.scope.porta_chiusa === true;
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesAnd = /\band\b/.test(cleanCode) && /\bif\b/.test(cleanCode);
    tests.push({ desc: "Variabili ha_chiave e porta_chiusa impostate a true", passed: hasKeys, diff: hasKeys ? null : "Entrambe le variabili devono essere true." });
    tests.push({ desc: "Condizione con 'and' utilizzata", passed: !!usesAnd, diff: usesAnd ? null : "Usa 'if ha_chiave and porta_chiusa:'." });
    const ok = result.logs.some(l => l.includes("Accesso consentito"));
    tests.push({ desc: "Console stampa 'Accesso consentito'", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 19,
        isDebugging: true,
        debugType: "Logica (Ramo else mancante)",
        chapterId: 5,
        isMastery: false,
        title: "19. Logica gameplay (Game Over con if / else)",
        icon: "⚰️",
        xp: 50,
        expectedOutput: "Game Over",
        theory: `
            <p>Uno schema fondamentale di gameplay è verificare se i punti vita scendono a zero per attivare il Game Over:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> punti_vita = <span class="m">0</span>
    <span class="k">if</span> punti_vita <= <span class="m">0</span>:
        <span class="nb">print</span>(<span class="s">"Game Over"</span>)
    <span class="k">else</span>:
        <span class="nb">print</span>(<span class="s">"In battaglia"</span>)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>punti_vita = 0</code>.</li>
                <li>Se <code>punti_vita <= 0:</code> stampa <code>"Game Over"</code>.</li>
                <li>Altrimenti (<code>else:</code>) stampa <code>"In battaglia"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():
    var salute = 0
    # BUG LOGICO: Manca la gestione per quando la salute scende a zero!
    # Aggiungi il ramo 'else:' per stampare "Game Over":
    if salute > 0:
        print("In vita!")
`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "La clausola `else` definisce cosa deve accadere quando la condizione dell'`if` NON è verificata (il piano B del tuo programma, ad esempio quando i punti vita arrivano a zero)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dopo il blocco indentato dell'`if`, scrivi `else:` allo stesso livello di indentazione dell'`if`, seguito dal blocco di istruzioni alternativo indentato."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var energia = 0\n    if energia > 0:\n        print(\"In combattimento!\")\n    else:\n        print(\"Sconfitto!\")\n```\nNota che `else:` non accetta alcuna condizione: cattura tutti i casi in cui l'if è falso."
            }
],
        solution: `func _ready():\n    var punti_vita = 0\n    if punti_vita <= 0:\n        print("Game Over")\n    else:\n        print("In battaglia")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasHp = result.scope && result.scope.punti_vita !== undefined;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasIfElse = /\bif\b/.test(cleanCode) && /\belse\b/.test(cleanCode);
    tests.push({ desc: "Struttura di controllo 'if / else' completa presente", passed: !!hasIfElse, diff: hasIfElse ? null : "Includi sia il ramo 'if' che il ramo 'else:'." });
    const ok = result.logs.some(l => l.includes("Game Over"));
    tests.push({ desc: "Ramo 'Game Over' eseguito con punti_vita <= 0", passed: ok && hasHp, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
{
        id: 20,
        chapterId: 5,
        isMastery: true,
        title: "20. ⭐ Sfida di Apprendimento: Il Portale Antico del Tempio",
        icon: "🏆",
        xp: 100,
        difficulty: "media",
        difficultyLabel: "Media",
        scenario: "Un antico portale magico si apre solo se l'avventuriero possiede abbastanza energia e almeno una reliquia chiave. Sotto il commento, assegna alla variabile <code>stato_portale</code> il messaggio corretto con una catena <code>if</code>, <code>elif</code>, <code>else</code>:",
        requirements: [
            'Se <code>energia >= 50</code> AND (<code>ha_amuleto</code> OR <code>ha_chiave</code>): imposta <code>stato_portale = \"Portale Attivato\"</code>',
            'Altrimenti se <code>energia < 50</code>: imposta <code>stato_portale = \"Energia Insufficiente\"</code>',
            'Altrimenti: imposta <code>stato_portale = \"Nessuna Reliquia Trovata\"</code>'
        ],
        notice: "Non modificare le variabili iniziali né la riga print(). Il programma stampa:",
        expectedOutput: "Stato: Portale Attivato",
        initialCode: `extends Node\n\nfunc _ready():\n    var energia = 75\n    var ha_amuleto = true\n    var ha_chiave = false\n    var stato_portale = ""\n    \n    # Scrivi la catena if / elif / else sotto\n    \n    # Non modificare la riga sotto\n    print("Stato: ", stato_portale)\n`,
        aiExplanation: "In GDScript si combinano le condizioni booleane usando <code>and</code> e <code>or</code>. Racchiudere tra parentesi <code>(ha_amuleto or ha_chiave)</code> assicura che basti una qualsiasi delle due reliquie purché l'energia sia maggiore o uguale a 50. Ogni blocco condizionale deve terminare con <code>:</code> e il corpo deve essere indentato di 4 spazi.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Quando ci sono più di due possibili esiti (es. medaglia d'Oro, Argento o Bronzo in base al punteggio), `elif` permette di verificare condizioni a cascata una dopo l'altra."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inizia con `if`, prosegui con uno o più rami `elif condizione:`, e termina facoltativamente con `else:` per tutti gli altri casi inferiori."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var exp_val = 75\n    if exp_val >= 90:\n        print(\"Rango S\")\n    elif exp_val >= 70:\n        print(\"Rango A\")\n    else:\n        print(\"Rango B\")\n```\nGodot valuta le condizioni dall'alto verso il basso e si ferma alla prima vera."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var energia = 75\n    var ha_amuleto = true\n    var ha_chiave = false\n    var stato_portale = ""\n    \n    if energia >= 50 and (ha_amuleto or ha_chiave):\n        stato_portale = "Portale Attivato"\n    elif energia < 50:\n        stato_portale = "Energia Insufficiente"\n    else:\n        stato_portale = "Nessuna Reliquia Trovata"\n        \n    # Non modificare la riga sotto\n    print("Stato: ", stato_portale)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Il Portale Antico del Tempio</h3>
                <p>Verifica le decisioni di gioco logiche combinando if, elif, else con gli operatori and e or.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Se <code>energia >= 50 and (ha_amuleto or ha_chiave)</code>: imposta <code>"Portale Attivato"</code></li>
                <li>Se <code>energia < 50</code>: imposta <code>"Energia Insufficiente"</code></li>
                <li>Altrimenti: imposta <code>"Nessuna Reliquia Trovata"</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const stateOk = s.stato_portale === "Portale Attivato";
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasElif = /\b(elif|else)\b/.test(cleanCode);
    tests.push({ desc: "Rami condizionali multipli con elif/else presenti", passed: !!hasElif, diff: hasElif ? null : "Usa if, elif e else per gestire i tre stati del portale." });
    tests.push({ desc: "Stato portale calcolato a 'Portale Attivato'", passed: stateOk, diff: stateOk ? null : `Ricevuto: "${s.stato_portale}"` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 6: LISTE E COLLEZIONI (ARRAY)
    // ==========================================
    {
        id: 21,
        chapterId: 6,
        isMastery: false,
        title: "21. Creare un inventario con gli Array",
        icon: "🎒",
        xp: 50,
        expectedOutput: "Spada",
        theory: `
            <p>Un <strong>Array</strong> è una lista ordinata di elementi racchiusi tra parentesi quadre <code>[...]</code>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> inventario = [<span class="s">"Spada"</span>, <span class="s">"Scudo"</span>, <span class="s">"Pozione"</span>]
    <span class="nb">print</span>(inventario[<span class="m">0</span>]) <span class="c"># Stampa "Spada"</span></pre>
            </div>
            <p>Gli elementi si contano a partire da zero (<code>0</code> è il primo elemento).</p>
        `,
        task: `
            <ul>
                <li>Crea <code>inventario = ["Spada", "Scudo", "Pozione"]</code>.</li>
                <li>Stampa il primo oggetto dell'inventario (<code>inventario[0]</code>).</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Crea l'inventario e stampa il primo elemento\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Un Array è una sequenza ordinata di elementi. In quasi tutti i linguaggi di programmazione moderni, compreso GDScript, il conteggio degli elementi inizia sempre da ZERO."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dichiara l'array racchiudendo gli elementi tra parentesi quadre `[...]` separati da virgole. Per accedere al primo elemento usa `nome_array[0]`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var armi = [\"Arco\", \"Pugnale\"]\n    print(armi[0]) # Stampa 'Arco'\n```\n`armi[0]` punta al primo elemento, mentre `armi[1]` punterebbe al secondo."
            }
],
        solution: `func _ready():\n    var inventario = ["Spada", "Scudo", "Pozione"]\n    print(inventario[0])\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const inv = result.scope && result.scope.inventario;
    const isArray = Array.isArray(inv) && inv.length === 3 && inv.includes("Spada") && inv.includes("Scudo");
    tests.push({ desc: "Array 'inventario' creato con 3 elementi", passed: isArray, diff: isArray ? null : `Valore: ${JSON.stringify(inv)}` });
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesIndex = /inventario\s*\[\s*0\s*\]/.test(cleanCode);
    tests.push({ desc: "Accesso con indice [0] utilizzato per la stampa", passed: !!usesIndex, diff: usesIndex ? null : "Usa 'inventario[0]' per accedere al primo elemento." });
    const ok = result.logs.some(l => l.includes("Spada"));
    tests.push({ desc: "Primo elemento ('Spada') stampato", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 22,
        isDebugging: true,
        debugType: "Off-by-One (Indici Array)",
        chapterId: 6,
        isMastery: false,
        title: "22. Accesso per indice",
        icon: "🔍",
        xp: 50,
        expectedOutput: "Scudo\nPozione",
        theory: `
            <p>Ogni posizione in un array ha un indice numerico:</p>
            <ul>
                <li><code>lista[0]</code> = primo elemento</li>
                <li><code>lista[1]</code> = secondo elemento</li>
                <li><code>lista[2]</code> = terzo elemento</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Dato <code>oggetti = ["Spada", "Scudo", "Pozione"]</code>.</li>
                <li>Stampa il secondo elemento (<code>oggetti[1]</code>) e poi il terzo (<code>oggetti[2]</code>).</li>
            </ul>
        `,
        initialCode: `func _ready():
    var colori = ["Rosso", "Verde", "Blu"]
    # BUG DI INDICE: Gli array in GDScript partono da [0], non da [1]!
    # Correggi gli indici sotto per stampare 'Verde' (2° elemento) e 'Blu' (3° elemento):
    print(colori[0])
    print(colori[1])
`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Gli array sono 'mutabili': puoi cambiare il valore memorizzato in una specifica posizione assegnando un nuovo valore tramite il suo indice tra parentesi quadre."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Per visualizzare il secondo e terzo elemento, usa rispettivamente gli indici `[1]` e `[2]`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var frutti = [\"Mela\", \"Banana\", \"Arancia\"]\n    print(frutti[1]) # Stampa 'Banana'\n    print(frutti[2]) # Stampa 'Arcia'\n```\nSe il codice di partenza conteneva un bug (es. indici errati), correggi i numeri tra parentesi quadre."
            }
],
        solution: `func _ready():\n    var oggetti = ["Spada", "Scudo", "Pozione"]\n    print(oggetti[1])\n    print(oggetti[2])\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesIndices = /\[\s*1\s*\]/.test(cleanCode) && /\[\s*2\s*\]/.test(cleanCode);
    tests.push({ desc: "Accesso tramite indici [1] e [2] utilizzato", passed: !!usesIndices, diff: usesIndices ? null : "Accedi agli elementi con oggetti[1] e oggetti[2]." });
    const out = (result.logs || []).join('\n');
    const ok = out.includes("Scudo") && out.includes("Pozione");
    tests.push({ desc: "Scudo e Pozione stampati a console", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 23,
        chapterId: 6,
        isMastery: false,
        title: "23. Metodi append() e size()",
        icon: "➕",
        xp: 50,
        expectedOutput: "3",
        theory: `
            <p>Per aggiungere un nuovo elemento in fondo a un array si usa il metodo <code>append(...)</code>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> inventario = [<span class="s">"Mappa"</span>, <span class="s">"Bussola"</span>]
    inventario.append(<span class="s">"Torcia"</span>)
    <span class="nb">print</span>(inventario.size()) <span class="c"># Stampa 3</span></pre>
            </div>
            <p>Il metodo <code>size()</code> restituisce il numero totale di elementi presenti.</p>
        `,
        task: `
            <ul>
                <li>Crea <code>inventario = ["Mappa", "Bussola"]</code>.</li>
                <li>Aggiungi <code>"Torcia"</code> con <code>inventario.append("Torcia")</code>.</li>
                <li>Stampa la dimensione dell'array con <code>print(inventario.size())</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    var inventario = ["Mappa", "Bussola"]\n    # Aggiungi "Torcia" e stampa la dimensione\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Durante una partita, il giocatore raccoglie nuovi oggetti. Gli array di Godot offrono metodi dedicati per aggiungere elementi alla fine e per verificare la dimensione totale."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `.append(nuovo_elemento)` per aggiungere un oggetto in coda all'array, e `.size()` per ottenere il numero totale di elementi attualmente presenti."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var squadra = [\"Cavaliere\", \"Mago\"]\n    squadra.append(\"Ladro\")\n    print(\"Membri:\", squadra.size())\n```\nDopo `append`, la chiamata a `.size()` restituirà 3."
            }
],
        solution: `func _ready():\n    var inventario = ["Mappa", "Bussola"]\n    inventario.append("Torcia")\n    print(inventario.size())\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const inv = result.scope && result.scope.inventario;
    const hasAppended = Array.isArray(inv) && inv.length === 3 && inv.includes("Torcia");
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesMethods = /\.append\s*\(/.test(cleanCode) && /\.size\s*\(/.test(cleanCode);
    tests.push({ desc: "Elemento 'Torcia' aggiunto all'array", passed: hasAppended, diff: hasAppended ? null : `Inventario finale: ${JSON.stringify(inv)}` });
    tests.push({ desc: "Metodi append() e size() utilizzati", passed: !!usesMethods, diff: usesMethods ? null : "Usa inventario.append('Torcia') e print(inventario.size())." });
    const ok = result.logs.some(l => l.trim() === "3");
    tests.push({ desc: "Dimensione '3' stampata a console", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
{
        id: 24,
        chapterId: 6,
        isMastery: true,
        title: "24. ⭐ Sfida di Apprendimento: Gestione dello Zaino d'Avventura",
        icon: "🏆",
        xp: 100,
        difficulty: "media",
        difficultyLabel: "Media",
        scenario: "Il giocatore organizza gli oggetti nel proprio inventario prima del duello finale. Sotto il commento, esegui le operazioni richieste sull'array <code>zaino</code>:",
        requirements: [
            'Aggiungi <code>\"Arco Elfico\"</code> in coda allo zaino usando <code>.append()</code>',
            'Rimuovi l\'oggetto <code>\"Ramo Secco\"</code> dallo zaino usando <code>.erase()</code>',
            'Verifica se possiedi <code>\"Pozione di Vita\"</code> con <code>.has()</code> e assegna il booleano a <code>var ha_cura</code>',
            'Conta gli oggetti totali rimasti con <code>.size()</code> e assegna il numero a <code>var totale_slot</code>'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Zaino: [\"Spada\", \"Pozione di Vita\", \"Arco Elfico\"]\nHa pozione: true\nTotale slot: 3",
        initialCode: `extends Node\n\nfunc _ready():\n    var zaino = ["Spada", "Ramo Secco", "Pozione di Vita"]\n    \n    # Modifica lo zaino e crea ha_cura e totale_slot sotto\n    \n    # Non modificare le righe sotto\n    print("Zaino: ", zaino)\n    print("Ha pozione: ", ha_cura)\n    print("Totale slot: ", totale_slot)\n`,
        aiExplanation: "Gli array in GDScript offrono potenti metodi nativi: <code>.append(elemento)</code> inserisce in ultima posizione, <code>.erase(elemento)</code> cerca ed elimina la prima occorrenza specificata, <code>.has(elemento)</code> restituisce <code>true</code> se l'elemento è presente e <code>.size()</code> restituisce la dimensione totale della lista.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida di padronanza richiede di combinare creazione dell'inventario, aggiunta di nuovi oggetti trovati e verifica della capacità dello zaino."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inizializza l'array con gli oggetti di partenza, usa `.append()` per inserire il nuovo manufatto e infine stampa la dimensione totale con `.size()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var zaino = [\"Mappa\", \"Torcia\"]\n    zaino.append(\"Bussola\")\n    var capienza = zaino.size()\n    print(\"Capienza:\", capienza)\n```\nVerifica attentamente i nomi esatti degli oggetti richiesti dal testo della sfida."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var zaino = ["Spada", "Ramo Secco", "Pozione di Vita"]\n    \n    zaino.append("Arco Elfico")\n    zaino.erase("Ramo Secco")\n    var ha_cura = zaino.has("Pozione di Vita")\n    var totale_slot = zaino.size()\n    \n    # Non modificare le righe sotto\n    print("Zaino: ", zaino)\n    print("Ha pozione: ", ha_cura)\n    print("Totale slot: ", totale_slot)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Gestione dello Zaino d'Avventura</h3>
                <p>Verifica le operazioni essenziali sugli array: aggiunta con append, rimozione con erase, ricerca con has e conteggio con size.</p>
            </div>
        `,
        task: `
            <ul>
                <li><code>zaino.append("Arco Elfico")</code></li>
                <li><code>zaino.erase("Ramo Secco")</code></li>
                <li><code>var ha_cura = zaino.has("Pozione di Vita")</code></li>
                <li><code>var totale_slot = zaino.size()</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const inv = s.zaino || [];
    const hasBow = inv.includes("Arco Elfico");
    const noStick = !inv.includes("Ramo Secco");
    const cureOk = s.ha_cura === true;
    const sizeOk = s.totale_slot === 3 && inv.length === 3;
    tests.push({ desc: "Arco Elfico aggiunto e Ramo Secco rimosso", passed: hasBow && noStick, diff: (hasBow && noStick) ? null : `Zaino: ${JSON.stringify(inv)}` });
    tests.push({ desc: "Controllo has('Pozione di Vita') true", passed: cureOk, diff: cureOk ? null : `Ricevuto: ${s.ha_cura}` });
    tests.push({ desc: "Totale slot calcolato con size() a 3", passed: sizeOk, diff: sizeOk ? null : `Ricevuto: ${s.totale_slot}` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 7: CICLI (FOR E WHILE)
    // ==========================================
    {
        id: 25,
        chapterId: 7,
        isMastery: false,
        title: "25. Ciclo for con range()",
        icon: "🔁",
        xp: 50,
        expectedOutput: "0\n1\n2",
        theory: `
            <p>Il ciclo <code>for</code> permette di ripetere un blocco di istruzioni. Usando <code>range(3)</code> il ciclo ripete per i valori <code>0, 1, 2</code>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">for</span> i <span class="k">in</span> range(<span class="m">3</span>):
        <span class="nb">print</span>(i)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Scrivi un ciclo <code>for i in range(3):</code>.</li>
                <li>All'interno del ciclo, stampa <code>i</code> con <code>print(i)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Scrivi il ciclo for con range(3)\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Un ciclo 'for' con 'range' permette di ripetere un blocco di istruzioni per un numero prefissato di volte, ad esempio per contare i turni di gioco."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `for i in range(N):`. La funzione `range(5)` genera numeri partendo da 0 fino a 4 (l'estremo superiore non è mai incluso)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    for n in range(3):\n        print(n) # Stampa 0, poi 1, poi 2\n```\nAll'interno del ciclo, stampa la variabile iteratore (es. `i`)."
            }
],
        solution: `func _ready():\n    for i in range(3):\n        print(i)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasLoop = /\bfor\s+\w+\s+in\s+range\s*\(/.test(cleanCode);
    tests.push({ desc: "Ciclo 'for ... in range(...)' utilizzato", passed: !!hasLoop, diff: hasLoop ? null : "Usa 'for i in range(3):' per iterare." });
    const out = (result.logs || []).join('\n');
    const ok = out.includes("0") && out.includes("1") && out.includes("2");
    tests.push({ desc: "Numeri 0, 1, 2 stampati dal ciclo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 26,
        chapterId: 7,
        isMastery: false,
        title: "26. Iterazione su liste di nemici",
        icon: "👾",
        xp: 50,
        expectedOutput: "Goblin\nOrco\nDrago",
        theory: `
            <p>Il ciclo <code>for</code> può scorrere automaticamente ogni elemento presente in un array:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> nemici = [<span class="s">"Goblin"</span>, <span class="s">"Orco"</span>, <span class="s">"Drago"</span>]
    <span class="k">for</span> nemico <span class="k">in</span> nemici:
        <span class="nb">print</span>(nemico)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>nemici = ["Goblin", "Orco", "Drago"]</code>.</li>
                <li>Usa <code>for nemico in nemici:</code> per stampare ogni nome con <code>print(nemico)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    var nemici = ["Goblin", "Orco", "Drago"]\n    # Itera sui nemici con il ciclo for\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Invece di usare indici numerici, in GDScript puoi scorrere direttamente ogni singolo elemento contenuto in un array, uno per ciascuna iterazione del ciclo."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "La sintassi è: `for elemento in nome_array:`. A ogni giro del ciclo, `elemento` assumerà automaticamente il valore del prossimo elemento dell'array."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var pozioni = [\"Cura\", \"Mana\", \"Velocita\"]\n    for p in pozioni:\n        print(p)\n```\nNon occorre specificare indici tra parentesi quadre: l'iterazione è automatica."
            }
],
        solution: `func _ready():\n    var nemici = ["Goblin", "Orco", "Drago"]\n    for nemico in nemici:\n        print(nemico)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const inv = result.scope && result.scope.nemici;
    const isArray = Array.isArray(inv) && inv.includes("Goblin") && inv.includes("Orco") && inv.includes("Drago");
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasLoop = /\bfor\s+\w+\s+in\s+nemici\b/.test(cleanCode);
    tests.push({ desc: "Lista 'nemici' definita con Goblin, Orco e Drago", passed: isArray, diff: isArray ? null : `Valore: ${JSON.stringify(inv)}` });
    tests.push({ desc: "Ciclo 'for nemico in nemici:' utilizzato", passed: !!hasLoop, diff: hasLoop ? null : "Usa 'for nemico in nemici:' per iterare sulla lista." });
    const out = (result.logs || []).join('\n');
    const ok = out.includes("Goblin") && out.includes("Orco") && out.includes("Drago");
    tests.push({ desc: "Tutti i 3 nemici stampati a console", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 27,
        isDebugging: true,
        debugType: "Loop Infinito (Decremento mancante)",
        chapterId: 7,
        isMastery: false,
        title: "27. Ciclo while",
        icon: "⏳",
        xp: 50,
        expectedOutput: "Conto: 1\nConto: 2\nConto: 3",
        theory: `
            <p>Il ciclo <code>while</code> continua a ripetere finché la sua condizione rimane vera:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> conto = <span class="m">1</span>
    <span class="k">while</span> conto <= <span class="m">3</span>:
        <span class="nb">print</span>(<span class="s">"Conto: "</span> + str(conto))
        conto += <span class="m">1</span></pre>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>conto = 1</code>.</li>
                <li>Scrivi un ciclo <code>while conto <= 3:</code>.</li>
                <li>Stampa <code>"Conto: " + str(conto)</code> e incrementa <code>conto += 1</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():
    var tempo = 3
    # BUG CRITICO: Senza decremento, la condizione 'tempo > 0' rimane per sempre vera!
    # Aggiungi 'tempo -= 1' all'interno del ciclo per evitare il blocco:
    while tempo > 0:
        print(tempo)
`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Il ciclo 'while' continua a girare finché la condizione specificata rimane vera. È fondamentale che all'interno del ciclo qualcosa modifichi la variabile di controllo, altrimenti si crea un loop infinito che congela il gioco."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Scrivi `while tempo > 0:` e nel corpo indentato stampa il tempo, dopodiché decrementalo con `tempo -= 1`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var countdown = 5\n    while countdown > 0:\n        print(countdown)\n        countdown -= 1 # Cruciale: previene il blocco del programma!\n```\nSe stai correggendo un bug, assicurati che il decremento sia presente prima della fine del ciclo."
            }
],
        solution: `func _ready():\n    var conto = 1\n    while conto <= 3:\n        print("Conto: " + str(conto))\n        conto += 1\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasWhile = /\bwhile\b/.test(cleanCode);
    const valOk = result.scope && Number(result.scope.conto) >= 3;
    tests.push({ desc: "Ciclo 'while' utilizzato nel codice", passed: !!hasWhile, diff: hasWhile ? null : "Usa 'while conto <= 3:' per il conteggio." });
    const out = (result.logs || []).join('\n');
    const ok = out.includes("Conto: 1") && out.includes("Conto: 2") && out.includes("Conto: 3");
    tests.push({ desc: "Conteggio da 1 a 3 stampato correttamente", passed: ok && valOk, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
{
        id: 28,
        chapterId: 7,
        isMastery: true,
        title: "28. ⭐ Sfida di Apprendimento: Annuncio Ondate e Calcolo XP",
        icon: "🏆",
        xp: 100,
        difficulty: "avanzata",
        difficultyLabel: "Avanzata",
        scenario: "Il sistema di difesa dell'arena deve elaborare un'ondata di nemici in arrivo, avvisare la guarnigione e calcolare i punti esperienza complessivi della battaglia. Sotto il commento, scrivi un ciclo <code>for</code> che itera sull'array <code>nemici</code>:",
        requirements: [
            'Scrivi il ciclo: <code>for nemico in nemici:</code>',
            'All\'interno del ciclo, stampa per ogni nemico: <code>\"Allerta: \" + nemico</code>',
            'All\'interno del ciclo, incrementa <code>xp_totali</code> di <code>25</code> (usando <code>+= 25</code>)'
        ],
        notice: "Non modificare le righe print() finali. Il programma stampa:",
        expectedOutput: "Allerta: Slime\nAllerta: Scheletro\nAllerta: Spettro\nAllerta: Boss Drago\nXP Totali: 100",
        initialCode: `extends Node\n\nfunc _ready():\n    var nemici = ["Slime", "Scheletro", "Spettro", "Boss Drago"]\n    var xp_totali = 0\n    \n    # Scrivi il ciclo for sotto\n    \n    # Non modificare la riga sotto\n    print("XP Totali: ", xp_totali)\n`,
        aiExplanation: "Il ciclo <code>for elemento in collezione:</code> scorre in sequenza tutti gli elementi di un array o di una sequenza. Ad ogni passaggio la variabile temporanea (in questo caso <code>nemico</code>) assume il valore dell'elemento corrente, consentendo di eseguire operazioni ripetute come stampare messaggi e sommare punti in un accumulatore.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Il pattern dell'accumulatore consiste nel partire da un totale iniziale (pari a zero) e aggiungere progressivamente ogni valore della lista durante il passaggio del ciclo."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inizializza `var somma = 0` prima del ciclo. All'interno del `for n in numeri:`, esegui `somma += n`. Infine, stampa la somma all'esterno del ciclo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var monete_casse = [10, 20, 30]\n    var totale = 0\n    for m in monete_casse:\n        totale += m\n    print(\"Totale:\", totale) # Stampa 60\n```\nFai attenzione a posizionare il `print` finale NON indentato dentro il ciclo."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var nemici = ["Slime", "Scheletro", "Spettro", "Boss Drago"]\n    var xp_totali = 0\n    \n    for nemico in nemici:\n        print("Allerta: " + nemico)\n        xp_totali += 25\n        \n    # Non modificare la riga sotto\n    print("XP Totali: ", xp_totali)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Annuncio Ondate e Calcolo XP</h3>
                <p>Verifica l'iterazione con i cicli for su collezioni e l'accumulo di valori numerici.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Itera con <code>for nemico in nemici:</code></li>
                <li>Stampa <code>"Allerta: " + nemico</code></li>
                <li>Incrementa <code>xp_totali += 25</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const xpOk = s.xp_totali === 100;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasLoop = /\bfor\b/.test(cleanCode);
    tests.push({ desc: "Ciclo for utilizzato per scorrere l'ondata", passed: !!hasLoop, diff: hasLoop ? null : "Usa un ciclo for per iterare sui nemici." });
    tests.push({ desc: "XP Totali accumulati a 100 (4 x 25)", passed: xpOk, diff: xpOk ? null : `Ricevuto: ${s.xp_totali}` });
    const clean = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const logsOk = clean.includes("Allerta: Slime") && clean.includes("Allerta: Scheletro") && clean.includes("Allerta: Spettro") && clean.includes("Allerta: Boss Drago");
    tests.push({ desc: "Allerte di tutti i nemici stampate", passed: logsOk, diff: logsOk ? null : `Ricevuto: "${clean}"` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 8: FUNZIONI E NODI GODOT
    // ==========================================
    {
        id: 29,
        chapterId: 8,
        isMastery: false,
        title: "29. Il ciclo di vita func _ready()",
        icon: "🎬",
        xp: 50,
        expectedOutput: "Nodo Inizializzato",
        theory: `
            <p>Ogni script in Godot è collegato a un <strong>Nodo</strong> nella scena. Quando la scena viene caricata nella memoria dell'engine, Godot esegue in ordine la funzione <code>_ready()</code>.</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="nb">print</span>(<span class="s">"Nodo Inizializzato"</span>)</pre>
            </div>
            <p>È il punto ideale dove caricare salvataggi, inizializzare inventari e connettere segnali.</p>
        `,
        task: `
            <ul>
                <li>All'interno di <code>_ready()</code>, stampa: <code>"Nodo Inizializzato"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Inizializza il nodo e stampa il messaggio\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Le funzioni sono blocchi riutilizzabili di istruzioni con un nome. Invece di riscrivere lo stesso codice ovunque, scrivi la funzione una volta sola e la richiami quando serve."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In GDScript le funzioni si dichiarano con `func nome_funzione():`. Per richiamare la funzione all'interno di `_ready()`, digita il suo nome seguito dalle parentesi `nome_funzione()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc avvia_motore():\n    print(\"Motore pronto\")\n\nfunc _ready():\n    avvia_motore()\n```\nDefinisci la tua funzione personalizzata all'esterno di `_ready()`, poi invocala dentro `_ready()`."
            }
],
        solution: `func _ready():\n    print("Nodo Inizializzato")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasReady = /\bfunc\s+_ready\s*\(/.test(cleanCode);
    tests.push({ desc: "Funzione 'func _ready():' definita", passed: !!hasReady, diff: hasReady ? null : "Assicurati di definire la funzione 'func _ready():'." });
    const ok = result.logs.some(l => l.includes("Nodo Inizializzato"));
    tests.push({ desc: "Console stampa 'Nodo Inizializzato'", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 30,
        chapterId: 8,
        isMastery: false,
        title: "30. Funzioni con parametri",
        icon: "📥",
        xp: 50,
        expectedOutput: "Ciao Eroe",
        theory: `
            <p>Puoi creare funzioni personalizzate con la parola chiave <code>func</code> e passare dei <strong>parametri</strong> tra le parentesi:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">saluta</span>(nome):
    <span class="nb">print</span>(<span class="s">"Ciao "</span> + nome)

<span class="k">func</span> <span class="nf">_ready</span>():
    saluta(<span class="s">"Eroe"</span>)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Definisci una funzione <code>saluta(nome):</code> che stampa <code>"Ciao " + nome</code>.</li>
                <li>All'interno di <code>_ready():</code>, chiama <code>saluta("Eroe")</code>.</li>
            </ul>
        `,
        initialCode: `func saluta(nome):\n    # Stampa il saluto con il parametro nome\n    pass\n\nfunc _ready():\n    # Chiama saluta("Eroe")\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I parametri sono variabili speciali racchiuse tra le parentesi tonde della funzione, che ricevono i valori forniti al momento della chiamata (argomenti)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dichiara la funzione inserendo il nome del parametro tra le parentesi: `func saluta(nome):`. Nel corpo della funzione, usa il parametro come una normale variabile."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc benvenuto(giocatore):\n    print(\"Benvenuto, \" + giocatore)\n\nfunc _ready():\n    benvenuto(\"Eroe\")\n```\nLa funzione saluta deve stampare la stringa 'Ciao ' concatenata con il parametro."
            }
],
        solution: `func saluta(nome):\n    print("Ciao " + nome)\n\nfunc _ready():\n    saluta("Eroe")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasFn = result.scope && typeof result.scope.saluta === 'function';
    tests.push({ desc: "Funzione 'saluta(nome)' dichiarata", passed: !!hasFn, diff: hasFn ? null : "Dichiara la funzione con: func saluta(nome):" });
    
    let paramTestOk = false;
    if (hasFn) {
        try {
            result.scope.saluta("Campione");
            paramTestOk = result.logs.some(l => l.includes("Ciao Campione"));
        } catch (e) {
            paramTestOk = false;
        }
    }
    tests.push({ desc: "Funzione accetta parametri dinamici (es. saluta('Campione'))", passed: paramTestOk, diff: paramTestOk ? null : "La funzione deve stampare 'Ciao ' concatenato al parametro passato." });
    const defaultOk = result.logs.some(l => l.includes("Ciao Eroe"));
    tests.push({ desc: "Chiamata iniziale saluta('Eroe') eseguita", passed: defaultOk, diff: defaultOk ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 31,
        chapterId: 8,
        isMastery: false,
        title: "31. Valori di ritorno con return",
        icon: "📤",
        xp: 50,
        expectedOutput: "25",
        theory: `
            <p>Una funzione può calcolare un risultato e restituirlo a chi l'ha chiamata usando la parola chiave <code>return</code>:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">calcola_danno</span>(attacco, difesa):
    <span class="k">return</span> attacco - difesa

<span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> danno = calcola_danno(<span class="m">30</span>, <span class="m">5</span>)
    <span class="nb">print</span>(danno) <span class="c"># Stampa 25</span></pre>
            </div>
        `,
        task: `
            <ul>
                <li>Definisci <code>calcola_danno(attacco, difesa): return attacco - difesa</code>.</li>
                <li>In <code>_ready():</code> calcola <code>var danno = calcola_danno(30, 5)</code> e stampa <code>danno</code>.</li>
            </ul>
        `,
        initialCode: `func calcola_danno(attacco, difesa):\n    # Restituisci attacco - difesa con return\n    pass\n\nfunc _ready():\n    # Chiama calcola_danno(30, 5) e stampa il risultato\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Spesso una funzione non deve limitarsi a stampare, ma deve 'restituire' un risultato calcolato al codice che l'ha chiamata. La parola chiave `return` restituisce il valore e interrompe la funzione."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Scrivi `return risultato` all'interno della funzione. Chi invoca la funzione può memorizzare il valore restituito in una variabile: `var danno = calcola_danno(30, 5)`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc somma(a, b):\n    return a + b\n\nfunc _ready():\n    var risultato = somma(10, 5)\n    print(risultato) # Stampa 15\n```\nSostituisci l'addizione con la formula del danno `attacco - difesa`."
            }
],
        solution: `func calcola_danno(attacco, difesa):\n    return attacco - difesa\n\nfunc _ready():\n    var danno = calcola_danno(30, 5)\n    print(danno)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasFn = result.scope && typeof result.scope.calcola_danno === 'function';
    tests.push({ desc: "Funzione 'calcola_danno(attacco, difesa)' definita", passed: !!hasFn, diff: hasFn ? null : "Dichiara func calcola_danno(attacco, difesa): con return." });
    
    let testsPass = false;
    if (hasFn) {
        const r1 = result.scope.calcola_danno(30, 5);
        const r2 = result.scope.calcola_danno(50, 10);
        const r3 = result.scope.calcola_danno(15, 15);
        testsPass = (r1 === 25) && (r2 === 40) && (r3 === 0);
    }
    tests.push({ desc: "Valori di ritorno calcolati correttamente su input multipli", passed: testsPass, diff: testsPass ? null : "La funzione deve restituire 'attacco - difesa'." });
    const printed = result.logs.some(l => l.trim() === "25");
    tests.push({ desc: "Risultato '25' stampato in _ready()", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
{
        id: 32,
        chapterId: 8,
        isMastery: true,
        title: "32. ⭐ Sfida di Apprendimento: Motore di Calcolo Danno Critico",
        icon: "🏆",
        xp: 100,
        difficulty: "avanzata",
        difficultyLabel: "Avanzata",
        scenario: "Il modulo di combattimento di Godot richiede una funzione pura e riutilizzabile per calcolare i colpi inflitti dai personaggi in base ai colpi critici. Sotto il commento iniziale, definisci la funzione richiesta:",
        requirements: [
            'Definisci la funzione: <code>func calcola_colpo(attacco: int, critico: bool) -> int:</code>',
            'Se <code>critico</code> è <code>true</code>, restituisci con return il doppio dell\'attacco (<code>attacco * 2</code>)',
            'Altrimenti restituisci con return semplicemente il valore di <code>attacco</code>'
        ],
        notice: "Non modificare il codice dentro _ready(). Il programma stampa:",
        expectedOutput: "Colpo normale: 30\nColpo critico: 60",
        initialCode: `extends Node\n\n# Definisci la funzione calcola_colpo sotto\n\n\nfunc _ready():\n    # Non modificare le righe sotto\n    var normale = calcola_colpo(30, false)\n    var critico = calcola_colpo(30, true)\n    print("Colpo normale: ", normale)\n    print("Colpo critico: ", critico)\n`,
        aiExplanation: "Le funzioni personalizzate si dichiarano con <code>func nome_funzione(argomenti):</code>. La parola chiave <code>return</code> interrompe l'esecuzione della funzione e restituisce il valore al chiamante. Specificare il tipo con <code>-> int</code> rende la funzione auto-documentante ed efficiente.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida richiede di costruire una funzione pura di combattimento che decide il valore del danno in base a un flag booleano (colpo critico)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Definisci `func calcola_colpo(attacco: int, critico: bool) -> int:`. All'interno, usa `if critico: return attacco * 2` e `else: return attacco` (oppure return immediato)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc calcola_bonus(valore: int, potenziato: bool) -> int:\n    if potenziato:\n        return valore * 2\n    return valore\n```\nNon modificare le istruzioni preesistenti in `_ready()`."
            }
],
        solution: `extends Node\n\nfunc calcola_colpo(attacco: int, critico: bool) -> int:\n    if critico:\n        return attacco * 2\n    else:\n        return attacco\n\nfunc _ready():\n    var normale = calcola_colpo(30, false)\n    var critico = calcola_colpo(30, true)\n    print("Colpo normale: ", normale)\n    print("Colpo critico: ", critico)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Motore di Calcolo Danno Critico</h3>
                <p>Verifica la creazione di funzioni con parametri multipli, logica condizionale interna e valore di ritorno return.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Crea <code>func calcola_colpo(attacco: int, critico: bool) -> int:</code></li>
                <li>Se critico è true ritorna <code>attacco * 2</code></li>
                <li>Altrimenti ritorna <code>attacco</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const hasFn = result.scope && typeof result.scope.calcola_colpo === 'function';
    tests.push({ desc: "Funzione calcola_colpo definita", passed: !!hasFn, diff: hasFn ? null : "Definisci func calcola_colpo(attacco: int, critico: bool) -> int:" });
    let checks = false;
    if (hasFn) {
        const norm = result.scope.calcola_colpo(30, false);
        const crit = result.scope.calcola_colpo(30, true);
        const altNorm = result.scope.calcola_colpo(50, false);
        const altCrit = result.scope.calcola_colpo(50, true);
        checks = (norm === 30) && (crit === 60) && (altNorm === 50) && (altCrit === 100);
    }
    tests.push({ desc: "Calcolo danno critico (x2 se true, x1 se false) verificato su vari input", passed: checks, diff: checks ? null : "Se critico è true ritorna attacco * 2, altrimenti attacco." });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 9: VETTORI E MOVIMENTO 2D (GODOT)
    // ==========================================
    {
        id: 33,
        chapterId: 9,
        isMastery: false,
        title: "33. Vector2(x, y) e coordinate 2D",
        icon: "🧭",
        xp: 50,
        expectedOutput: "Vector2(100, 200)",
        theory: `
            <p>Nello spazio 2D di Godot Engine, la posizione di qualsiasi oggetto o sprite è rappresentata da un vettore a due dimensioni: <code>Vector2(x, y)</code>:</p>
            <ul>
                <li><strong>X</strong>: asse orizzontale (verso destra cresce).</li>
                <li><strong>Y</strong>: asse verticale (verso il basso cresce).</li>
            </ul>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> posizione = Vector2(<span class="m">100</span>, <span class="m">200</span>)
    <span class="nb">print</span>(posizione)</pre>
            </div>
        `,
        task: `
            <ul>
                <li>Crea <code>posizione = Vector2(100, 200)</code>.</li>
                <li>Stampa il vettore con <code>print(posizione)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Crea posizione come Vector2(100, 200) e stampala\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "In uno spazio 2D, ogni punto o movimento ha due componenti: orizzontale (X, verso destra) e verticale (Y, verso il basso nello standard degli schermi 2D)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Crea una variabile assegnando il costruttore nativo `Vector2(coordinata_x, coordinata_y)`. Poi passa la variabile a `print()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var punto_spawn = Vector2(50, 75)\n    print(punto_spawn)\n```\nGodot stamperà automaticamente il formato `(50, 75)`."
            }
],
        solution: `func _ready():\n    var posizione = Vector2(100, 200)\n    print(posizione)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const p = result.scope && result.scope.posizione;
    const ok = p && p.x === 100 && p.y === 200;
    tests.push({ desc: "Vector2(100, 200) creato nella variabile 'posizione'", passed: !!ok, diff: ok ? null : `Ricevuto: ${p}` });
    const printed = result.logs.some(l => l.includes("100") && l.includes("200"));
    tests.push({ desc: "Coordinate Vector2 stampate a console", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
    return tests;
}
    },
    {
        id: 34,
        chapterId: 9,
        isMastery: false,
        title: "34. Calcolo nuova posizione con velocità",
        icon: "🏃",
        xp: 50,
        expectedOutput: "Vector2(150, 200)",
        theory: `
            <p>Per muovere un personaggio nello spazio di gioco, aggiungiamo la velocità alla sua coordinata:</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> posizione = Vector2(<span class="m">100</span>, <span class="m">200</span>)
    <span class="k">var</span> velocita = <span class="m">50</span>
    posizione.x += velocita
    <span class="nb">print</span>(posizione) <span class="c"># Stampa Vector2(150, 200)</span></pre>
            </div>
        `,
        task: `
            <ul>
                <li>Inizializza <code>posizione = Vector2(100, 200)</code> e <code>velocita = 50</code>.</li>
                <li>Aggiorna <code>posizione.x += velocita</code>.</li>
                <li>Stampa il vettore finale con <code>print(posizione)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Aggiorna posizione.x con velocita e stampa\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Puoi accedere e modificare singolarmente le due componenti di un vettore tramite la notazione puntata (`.x` e `.y`), ad esempio per spostare un personaggio solo a destra."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa l'operatore composto sulla proprietà: `posizione.x += velocita` per incrementare la sola coordinata orizzontale."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var pos = Vector2(100, 200)\n    pos.x += 50 # Ora la posizione è (150, 200)\n    print(pos)\n```\nLa coordinata `y` rimane invariata se modifichi solo `.x`."
            }
],
        solution: `func _ready():\n    var posizione = Vector2(100, 200)\n    var velocita = 50\n    posizione.x += velocita\n    print(posizione)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const p = result.scope && result.scope.posizione;
    const ok = p && p.x === 150 && p.y === 200;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasAdd = /posizione\.x\s*\+=/.test(cleanCode);
    tests.push({ desc: "Coordinata X incrementata con 'posizione.x += velocita' a 150", passed: ok && hasAdd, diff: ok ? (hasAdd ? null : "Usa posizione.x += velocita") : `Ricevuto: ${p}` });
    return tests;
}
    },
    {
        id: 35,
        chapterId: 9,
        isMastery: false,
        title: "35. Movimento diagonale su entrambi gli assi",
        icon: "↗️",
        xp: 50,
        expectedOutput: "Vector2(120, 180)",
        theory: `
            <p>Nei giochi 2D il movimento diagonale aggiorna simultaneamente sia la coordinata X (orizzontale) che la coordinata Y (verticale):</p>
            <div class="code-preview">
<pre><span class="k">func</span> <span class="nf">_ready</span>():
    <span class="k">var</span> pos = Vector2(<span class="m">100</span>, <span class="m">200</span>)
    pos.x += <span class="m">20</span>
    pos.y -= <span class="m">20</span>
    <span class="nb">print</span>(pos) <span class="c"># Stampa Vector2(120, 180)</span></pre>
            </div>
        `,
        task: `
            <ul>
                <li>Crea <code>pos = Vector2(100, 200)</code>.</li>
                <li>Aggiungi <code>20</code> a <code>pos.x</code> e sottrai <code>20</code> a <code>pos.y</code>.</li>
                <li>Stampa <code>pos</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Aggiorna pos.x e pos.y e stampa il vettore\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I vettori supportano l'aritmetica diretta: sommare due vettori somma le rispettive componenti X e Y contemporaneamente."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Calcola la nuova posizione sommando la posizione iniziale e il vettore velocità: `var nuova_posizione = posizione + velocita`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var pos = Vector2(10, 20)\n    var vel = Vector2(5, 5)\n    var arrivo = pos + vel # (15, 25)\n    print(arrivo)\n```\nQuesta operazione simula lo spostamento fisico in un frame di gioco."
            }
],
        solution: `func _ready():\n    var pos = Vector2(100, 200)\n    pos.x += 20\n    pos.y -= 20\n    print(pos)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const p = result.scope && result.scope.pos;
    const ok = p && p.x === 120 && p.y === 180;
    tests.push({ desc: "Vettore aggiornato a Vector2(120, 180)", passed: !!ok, diff: ok ? null : `Ricevuto: ${p}` });
    return tests;
}
    },
{
        id: 36,
        chapterId: 9,
        isMastery: true,
        title: "36. ⭐ Sfida di Apprendimento: Navigazione Radar e Atterraggio 2D",
        icon: "🏆",
        xp: 100,
        difficulty: "avanzata",
        difficultyLabel: "Avanzata",
        scenario: "La sonda spaziale Orion deve calcolare la sua traiettoria di avvicinamento e verificare se le coordinate finali coincidono con la stazione spaziale orbitale. Sotto il commento, completa i calcoli vettoriali 2D:",
        requirements: [
            'Inizializza la posizione della sonda: <code>var posizione = Vector2(100, 200)</code>',
            'Applica la spinta dei motori modificando gli assi: <code>posizione.x += 50</code> e <code>posizione.y -= 30</code>',
            'Crea la coordinata della stazione: <code>var stazione = Vector2(150, 170)</code>',
            'Verifica se la sonda ha raggiunto la stazione: <code>var atterrato: bool = (posizione.x == stazione.x and posizione.y == stazione.y)</code>'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Posizione finale: Vector2(150, 170)\nStazione raggiunta: true",
        initialCode: `extends Node\n\nfunc _ready():\n    # Crea posizione, aggiorna le coordinate e verifica atterrato sotto\n    \n    # Non modificare le righe sotto\n    print("Posizione finale: ", posizione)\n    print("Stazione raggiunta: ", atterrato)\n`,
        aiExplanation: "Un <code>Vector2(x, y)</code> rappresenta un punto o una velocità nello spazio bidimensionale di Godot Engine. Puoi accedere e modificare direttamente le singole componenti <code>.x</code> e <code>.y</code>. Per verificare se la sonda ha raggiunto le coordinate della stazione, puoi confrontare i valori delle coordinate per accertarti dell'allineamento perfetto.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Per sapere quanto è lungo un vettore (ad esempio la distanza coperta o la velocità complessiva di un proiettile), Godot offre il metodo matematico nativo `.length()`."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Chiama `.length()` sul vettore: `var distanza = vettore.length()`. Restituirà un numero float calcolato con il teorema di Pitagora."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var spostamento = Vector2(3, 4)\n    var lunghezza = spostamento.length() # sqrt(3^2 + 4^2) = 5.0\n    print(lunghezza)\n```\nSe il vettore è `Vector2(300, 400)`, `.length()` restituirà esattamente `500.0`."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var posizione = Vector2(100, 200)\n    posizione.x += 50\n    posizione.y -= 30\n    var stazione = Vector2(150, 170)\n    var atterrato: bool = (posizione.x == stazione.x and posizione.y == stazione.y)\n    \n    # Non modificare le righe sotto\n    print("Posizione finale: ", posizione)\n    print("Stazione raggiunta: ", atterrato)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO FINALE</span>
                <h3>Navigazione Radar e Atterraggio 2D</h3>
                <p>Verifica l'uso avanzato di Vector2, modifica degli assi X/Y e confronto vettoriale nello spazio bidimensionale di Godot.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Crea <code>var posizione = Vector2(100, 200)</code></li>
                <li>Modifica <code>posizione.x += 50</code> e <code>posizione.y -= 30</code></li>
                <li>Crea <code>var stazione = Vector2(150, 170)</code></li>
                <li>Verifica <code>var atterrato = (posizione.x == stazione.x and posizione.y == stazione.y)</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const pos = s.posizione;
    const posOk = pos && Number(pos.x) === 150 && Number(pos.y) === 170;
    const landOk = s.atterrato === true;
    tests.push({ desc: "Posizione finale calcolata a Vector2(150, 170)", passed: posOk, diff: posOk ? null : `Ricevuto: ${pos}` });
    tests.push({ desc: "Atterraggio riuscito con successo (true)", passed: landOk, diff: landOk ? null : `Ricevuto: ${s.atterrato}` });
    return tests;
}
    },
// ==========================================
    // CAPITOLO 10: DIZIONARI (DICTIONARY)
    // ==========================================
    {
        id: 37,
        chapterId: 10,
        isMastery: false,
        title: "37. Creare e accedere ai Dizionari",
        icon: "📖",
        xp: 50,
        expectedOutput: "Classe: Guerriero\nLivello: 10",
        theory: `
            <p>Mentre gli <strong>Array</strong> memorizzano liste ordinate per indice numerico (<code>0, 1, 2...</code>), un <strong>Dizionario (Dictionary)</strong> memorizza dati in coppie <strong>chiave-valore</strong> racchiuse tra parentesi graffe <code>{}</code>:</p>
            <pre class="code-block"><span class="k">var</span> eroe = { <span class="s">"classe"</span>: <span class="s">"Guerriero"</span>, <span class="s">"livello"</span>: <span class="m">10</span> }
<span class="nb">print</span>(eroe[<span class="s">"classe"</span>]) <span class="c"># Stampa "Guerriero"</span></pre>
            <p>Per leggere un valore dal dizionario, inserisci la chiave tra parentesi quadre: <code>dizionario["nome_chiave"]</code>.</p>
        `,
        task: `
            <ul>
                <li>Crea la variabile <code>var eroe = { "classe": "Guerriero", "livello": 10 }</code>.</li>
                <li>Stampa la classe: <code>print("Classe: ", eroe["classe"])</code>.</li>
                <li>Stampa il livello: <code>print("Livello: ", eroe["livello"])</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Crea il dizionario eroe e stampa classe e livello sotto\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Un Dizionario memorizza dati in coppie 'chiave: valore', permettendoti di cercare un dato tramite un nome descrittivo (come 'vita' o 'nome') anziché tramite un indice numerico."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa le parentesi graffe `{}` con la sintassi `\"chiave\": valore`, separando le coppie con virgole. Per accedere a un valore, usa `dizionario[\"chiave\"]`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var nemico = { \"nome\": \"Goblin\", \"salute\": 30 }\n    print(nemico[\"nome\"]) # Stampa 'Goblin'\n```\nAssicurati di racchiudere le chiavi tra virgolette."
            }
],
        solution: `func _ready():\n    var eroe = { "classe": "Guerriero", "livello": 10 }\n    print("Classe: ", eroe["classe"])\n    print("Livello: ", eroe["livello"])\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const d = s.eroe || {};
    const heroOk = d["classe"] === "Guerriero" && Number(d["livello"]) === 10;
    tests.push({ desc: "Dizionario eroe creato con chiavi 'classe' e 'livello'", passed: heroOk, diff: heroOk ? null : `Ricevuto: ${JSON.stringify(d)}` });
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const outOk = out.includes("Classe: Guerriero") && out.includes("Livello: 10");
    tests.push({ desc: "Classe e livello stampati con eroe['...']", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 38,
        chapterId: 10,
        isMastery: false,
        title: "38. Modificare e aggiungere chiavi al Dizionario",
        icon: "🛡️",
        xp: 50,
        expectedOutput: "Arma: Spada Laser\nArmatura: Scudo",
        theory: `
            <p>I dizionari in GDScript sono <strong>mutabili</strong>. Puoi aggiungere una nuova chiave semplicemente assegnandole un valore, o modificare una chiave esistente:</p>
            <pre class="code-block"><span class="k">var</span> equip = { <span class="s">"arma"</span>: <span class="s">"Spada"</span> }
equip[<span class="s">"armatura"</span>] = <span class="s">"Scudo"</span>     <span class="c"># Aggiunge una nuova chiave</span>
equip[<span class="s">"arma"</span>] = <span class="s">"Spada Laser"</span>   <span class="c"># Aggiorna il valore esistente</span></pre>
        `,
        task: `
            <ul>
                <li>Inizializza <code>var equip = { "arma": "Spada" }</code>.</li>
                <li>Aggiungi la chiave armatura: <code>equip["armatura"] = "Scudo"</code>.</li>
                <li>Aggiorna l'arma: <code>equip["arma"] = "Spada Laser"</code>.</li>
                <li>Stampa: <code>print("Arma: ", equip["arma"])</code> e <code>print("Armatura: ", equip["armatura"])</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    var equip = { "arma": "Spada" }\n    # Aggiungi armatura, aggiorna arma e stampa sotto\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I dizionari sono dinamici: puoi aggiungere nuovi attributi in qualsiasi momento durante la partita o aggiornare valori esistenti riassegnando la chiave."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Per aggiungere o sovrascrivere una chiave, usa l'assegnazione con parentesi quadre: `dizionario[\"nuova_chiave\"] = nuovo_valore`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var profilo = { \"ruolo\": \"Guerriero\" }\n    profilo[\"livello\"] = 10 # Aggiunge la chiave 'livello'\n    profilo[\"ruolo\"] = \"Paladino\" # Sovrascrive 'ruolo'\n```\nNon ridefinire l'intero dizionario da capo: modifica l'oggetto esistente tramite le sue chiavi."
            }
],
        solution: `func _ready():\n    var equip = { "arma": "Spada" }\n    equip["armatura"] = "Scudo"\n    equip["arma"] = "Spada Laser"\n    print("Arma: ", equip["arma"])\n    print("Armatura: ", equip["armatura"])\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const eq = s.equip || {};
    const modOk = eq["arma"] === "Spada Laser" && eq["armatura"] === "Scudo";
    const codeNoComments = (result.code || "").replace(/#.*$/gm, "");
    const hasAssign = /(?:equip\s*\[\s*["']armatura["']\s*\]|equip\.armatura)\s*=/.test(codeNoComments);
    tests.push({ desc: "Chiavi aggiornate correttamente (arma: Spada Laser, armatura: Scudo)", passed: modOk, diff: modOk ? null : `Equip: ${JSON.stringify(eq)}` });
    tests.push({ desc: "Aggiunta della chiave 'armatura' tramite assegnazione dinamica", passed: !!hasAssign, diff: hasAssign ? null : "Assegna la chiave 'armatura' usando equip['armatura'] = 'Scudo'" });
    return tests;
}
    },
    {
        id: 39,
        isDebugging: true,
        debugType: "Controllo Sicurezza Chiave (.has)",
        chapterId: 10,
        isMastery: false,
        title: "39. Metodi dei Dizionari (has, keys)",
        icon: "🔍",
        xp: 50,
        expectedOutput: "Possiede oro: true\nPossiede chiave: false",
        theory: `
            <p>GDScript offre metodi integrati per verificare e ispezionare i dati di un dizionario:</p>
            <ul>
                <li><code>dizionario.has("chiave")</code>: restituisce <code>true</code> se la chiave esiste, altrimenti <code>false</code>.</li>
                <li><code>dizionario.keys()</code>: restituisce un array contenente tutte le chiavi.</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Inizializza <code>var forziere = { "oro": 100, "gemme": 3 }</code>.</li>
                <li>Salva in <code>var ha_oro</code> il risultato di <code>forziere.has("oro")</code>.</li>
                <li>Salva in <code>var ha_chiave</code> il risultato di <code>forziere.has("chiave")</code>.</li>
                <li>Stampa: <code>print("Possiede oro: ", ha_oro)</code> e <code>print("Possiede chiave: ", ha_chiave)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():
    var forziere = { "oro": 100 }
    # BUG DI SICUREZZA: Verificare l'esistenza della chiave 'chiave' prima dell'accesso!
    # Usa 'if forziere.has("oro"):' per stampare "Ha oro: true":
    print("Ha oro: ", forziere["oro"])
`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Tentare di leggere una chiave che non esiste in un dizionario può causare errori a runtime. Il metodo `.has()` permette di verificare in anticipo l'esistenza della chiave."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `if dizionario.has(\"nome_chiave\"):` per eseguire il blocco di codice solo se la chiave è effettivamente presente."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var inventario = { \"spada\": 1 }\n    if inventario.has(\"pozione\"):\n        print(\"Pozione presente!\")\n    else:\n        print(\"Pozione mancante!\")\n```\n`.has()` restituisce un booleano (`true` o `false`)."
            }
],
        solution: `func _ready():\n    var forziere = { "oro": 100, "gemme": 3 }\n    var ha_oro = forziere.has("oro")\n    var ha_chiave = forziere.has("chiave")\n    print("Possiede oro: ", ha_oro)\n    print("Possiede chiave: ", ha_chiave)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const goldOk = s.ha_oro === true;
    const keyOk = s.ha_chiave === false;
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasMethod = /\.has\s*\(/.test(cleanCode);
    tests.push({ desc: "Metodo forziere.has(...) utilizzato", passed: !!hasMethod, diff: hasMethod ? null : "Usa forziere.has('oro') e forziere.has('chiave')." });
    tests.push({ desc: "Verifica ha_oro (true) e ha_chiave (false)", passed: goldOk && keyOk, diff: (goldOk && keyOk) ? null : `ha_oro=${s.ha_oro}, ha_chiave=${s.ha_chiave}` });
    return tests;
}
    },
    {
        id: 40,
        chapterId: 10,
        isMastery: true,
        title: "40. ⭐ Sfida di Apprendimento: Statistiche del Boss Finale",
        icon: "🏆",
        xp: 100,
        difficulty: "media",
        difficultyLabel: "Media",
        scenario: "Il bestiario del dungeon deve registrare e aggiornare la scheda tecnica del boss del dungeon durante lo scontro. Sotto il commento, manipola il dizionario <code>boss</code>:",
        requirements: [
            'Crea il dizionario iniziale: <code>var boss = { "nome": "Drago Antico", "hp": 500 }</code>',
            'Aggiungi la statistica dell\'attacco: <code>boss["attacco"] = 75</code>',
            'Aggiorna la salute sottraendo i danni del primo turno: <code>boss["hp"] = 420</code>',
            'Controlla se il boss è entrato in stato di furia con <code>boss.has("furia")</code> e assegna il risultato a <code>var in_furia</code>'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Boss: Drago Antico\nHP rimanenti: 420\nAttacco: 75\nFuria attiva: false",
        initialCode: `extends Node\n\nfunc _ready():\n    # Crea e aggiorna boss e crea in_furia sotto\n    \n    # Non modificare le righe sotto\n    print("Boss: ", boss["nome"])\n    print("HP rimanenti: ", boss["hp"])\n    print("Attacco: ", boss["attacco"])\n    print("Furia attiva: ", in_furia)\n`,
        aiExplanation: "In GDScript i dizionari sono la struttura dati prediletta per memorizzare entità complesse con proprietà eterogenee (testi, numeri, booleani). Puoi accedere e modificare chiavi con le parentesi quadre <code>diz[\"chiave\"] = valore</code> e testare l'esistenza di parametri opzionali usando <code>diz.has(\"chiave\")</code>.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida richiede di strutturare un sistema di equipaggiamento flessibile per slot (testa, corpo, arma) con verifica e aggiornamento dei pezzi."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Inizializza il dizionario, aggiungi o modifica gli slot richiesti e stampa i valori finali verificando che ogni slot abbia l'oggetto corretto."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var armatura = { \"testa\": \"Elmo\" }\n    armatura[\"torace\"] = \"Corazza\"\n    if armatura.has(\"torace\"):\n        print(\"Protezione:\", armatura[\"torace\"])\n```\nControlla le maiuscole nei nomi degli equipaggiamenti richiesti dal testo."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    var boss = { "nome": "Drago Antico", "hp": 500 }\n    boss["attacco"] = 75\n    boss["hp"] = 420\n    var in_furia = boss.has("furia")\n    \n    # Non modificare le righe sotto\n    print("Boss: ", boss["nome"])\n    print("HP rimanenti: ", boss["hp"])\n    print("Attacco: ", boss["attacco"])\n    print("Furia attiva: ", in_furia)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Statistiche del Boss Finale</h3>
                <p>Verifica la creazione, manipolazione ed interrogazione di dizionari complessi in GDScript.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Crea <code>boss = { "nome": "Drago Antico", "hp": 500 }</code></li>
                <li>Aggiungi <code>boss["attacco"] = 75</code></li>
                <li>Imposta <code>boss["hp"] = 420</code></li>
                <li>Verifica <code>var in_furia = boss.has("furia")</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const b = s.boss || {};
    const bossOk = b["nome"] === "Drago Antico" && Number(b["hp"]) === 420 && Number(b["attacco"]) === 75;
    const furyOk = s.in_furia === false;
    tests.push({ desc: "Dizionario del boss aggiornato (hp: 420, attacco: 75)", passed: bossOk, diff: bossOk ? null : `Boss: ${JSON.stringify(b)}` });
    tests.push({ desc: "Controllo boss.has('furia') false", passed: furyOk, diff: furyOk ? null : `in_furia=${s.in_furia}` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 11: I SEGNALI DI GODOT (SIGNALS)
    // ==========================================
    {
        id: 41,
        chapterId: 11,
        isMastery: false,
        title: "41. Dichiarare ed emettere un Segnale",
        icon: "📡",
        xp: 50,
        expectedOutput: "Apertura in corso...\nPorta aperta con successo!",
        theory: `
            <p>I <strong>Segnali (Signals)</strong> sono il meccanismo di comunicazione disaccoppiata di Godot ("Observer pattern"). Permettono a un nodo di annunciare un evento senza dover conoscere chi lo ascolterà.</p>
            <p>In Godot 4, un segnale si dichiara a inizio script con la parola chiave <code>signal</code> e si emette invocando il metodo <code>.emit()</code>:</p>
            <pre class="code-block"><span class="k">signal</span> porta_aperta

<span class="k">func</span> _ready():
    porta_aperta.<span class="nb">emit</span>() <span class="c"># Lancia il segnale!</span></pre>
        `,
        task: `
            <ul>
                <li>Dichiara in cima allo script: <code>signal porta_aperta</code>.</li>
                <li>In <code>_ready()</code>, dopo la stampa, emetti il segnale: <code>porta_aperta.emit()</code>.</li>
            </ul>
        `,
        initialCode: `extends Node\n\n# Dichiara il segnale porta_aperta sotto\n\n\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print("Apertura in corso...")\n    # Emetti il segnale sotto\n\n\nfunc quando_aperta():\n    print("Porta aperta con successo!")\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I segnali sono il meccanismo di Godot per realizzare l'architettura a eventi: un nodo annuncia che qualcosa è accaduto ('Porta aperta!') senza doversi preoccupare di chi ascolterà."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dichiara il segnale in cima allo script con la parola chiave `signal nome_segnale`. Per inviare la notifica usa `nome_segnale.emit()` (o `emit_signal(\"nome_segnale\")`)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nsignal salto_eseguito\n\nfunc _ready():\n    salto_eseguito.emit()\n```\nIn Godot 4 la sintassi raccomandata è `segnale.emit()`."
            }
],
        solution: `extends Node\n\nsignal porta_aperta\n\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print("Apertura in corso...")\n    porta_aperta.emit()\n\nfunc quando_aperta():\n    print("Porta aperta con successo!")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasSigDecl = /\bsignal\s+porta_aperta\b/.test(cleanCode);
    const isSignal = s.porta_aperta && (typeof s.porta_aperta.emit === 'function');
    tests.push({ desc: "Segnale 'signal porta_aperta' dichiarato", passed: !!(hasSigDecl && isSignal), diff: (hasSigDecl && isSignal) ? null : "Dichiara 'signal porta_aperta' in cima allo script." });
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const ok = out.includes("Apertura in corso...") && out.includes("Porta aperta con successo!");
    tests.push({ desc: "Segnale emesso con successo e intercettato dalla callback", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 42,
        chapterId: 11,
        isMastery: false,
        title: "42. Connettere un Segnale a una Funzione (connect)",
        icon: "🔗",
        xp: 50,
        expectedOutput: "+10 Monete raccolte!",
        theory: `
            <p>Per fare in modo che una funzione risponda all'evento annunciato da un segnale, dobbiamo <strong>connetterli</strong> con <code>segnale.connect(nome_funzione)</code>:</p>
            <pre class="code-block"><span class="k">signal</span> evento

<span class="k">func</span> _ready():
    evento.<span class="nb">connect</span>(quando_accade) <span class="c"># Connessione</span>
    evento.<span class="nb">emit</span>()                   <span class="c"># Esecuzione automatica</span>

<span class="k">func</span> quando_accade():
    <span class="nb">print</span>(<span class="s">"Evento catturato!"</span>)</pre>
        `,
        task: `
            <ul>
                <li>Nel corpo di <code>_ready()</code>, connetti il segnale alla funzione: <code>moneta_raccolta.connect(aggiungi_punti)</code>.</li>
                <li>Subito dopo, lancia il segnale con: <code>moneta_raccolta.emit()</code>.</li>
            </ul>
        `,
        initialCode: `extends Node\n\nsignal moneta_raccolta\n\nfunc _ready():\n    # Connetti moneta_raccolta ad aggiungi_punti ed emettila sotto\n    pass\n\nfunc aggiungi_punti():\n    print("+10 Monete raccolte!")\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Per reagire a un segnale, dobbiamo 'collegare' l'evento a una funzione di risposta (chiamata callback)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Collega il segnale in `_ready()` con la sintassi `nome_segnale.connect(nome_funzione_callback)`. Definisci la funzione di risposta con `func _on_...():`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nsignal luce_accesa\n\nfunc _ready():\n    luce_accesa.connect(_on_luce_accesa)\n    luce_accesa.emit()\n\nfunc _on_luce_accesa():\n    print(\"Luce attiva!\")\n```\nNota che passi il nome della funzione senza parentesi tonde a `.connect()`."
            }
],
        solution: `extends Node\n\nsignal moneta_raccolta\n\nfunc _ready():\n    moneta_raccolta.connect(aggiungi_punti)\n    moneta_raccolta.emit()\n\nfunc aggiungi_punti():\n    print("+10 Monete raccolte!")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const sig = s.moneta_raccolta;
    const hasConnected = sig && sig.callbacks && sig.callbacks.length > 0;
    tests.push({ desc: "Segnale 'moneta_raccolta' connesso con connect()", passed: !!hasConnected, diff: hasConnected ? null : "Connetti il segnale con moneta_raccolta.connect(aggiungi_punti)." });
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const ok = out.includes("+10 Monete raccolte!");
    tests.push({ desc: "Funzione aggiungi_punti invocata da emit()", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 43,
        chapterId: 11,
        isMastery: false,
        title: "43. Segnali con Parametri",
        icon: "📨",
        xp: 50,
        expectedOutput: "Danno registrato: 35",
        theory: `
            <p>I segnali possono trasportare informazioni verso chi li ascolta. Basta specificare i parametri nella dichiarazione:</p>
            <pre class="code-block"><span class="k">signal</span> danno_inflitto(valore)

<span class="k">func</span> _ready():
    danno_inflitto.<span class="nb">connect</span>(on_danno)
    danno_inflitto.<span class="nb">emit</span>(<span class="m">35</span>) <span class="c"># Invia 35 alla funzione connessa!</span>

<span class="k">func</span> on_danno(v):
    <span class="nb">print</span>(<span class="s">"Danno registrato: "</span>, v)</pre>
        `,
        task: `
            <ul>
                <li>Dichiara in cima: <code>signal danno_inflitto(valore)</code>.</li>
                <li>In <code>_ready()</code>, emetti il segnale passando il valore 35: <code>danno_inflitto.emit(35)</code>.</li>
            </ul>
        `,
        initialCode: `extends Node\n\n# Dichiara signal danno_inflitto(valore) sotto\n\n\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    # Emetti danno_inflitto con 35 sotto\n\n\nfunc on_danno(v):\n    print("Danno registrato: ", v)\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I segnali possono trasportare informazioni con sé, come la quantità di punti danno inflitti o il punteggio guadagnato durante l'evento."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Dichiara il segnale con i parametri tra parentesi: `signal danno_inflitto(quantita)`. Quando emetti il segnale passa il valore: `danno_inflitto.emit(35)`. Il callback riceverà questo valore come argomento."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nsignal monete_raccolte(valore)\n\nfunc _ready():\n    monete_raccolte.connect(_on_monete_raccolte)\n    monete_raccolte.emit(50)\n\nfunc _on_monete_raccolte(valore):\n    print(\"Monete +\", valore)\n```\nIl nome del parametro nel callback può essere a tua scelta."
            }
],
        solution: `extends Node\n\nsignal danno_inflitto(valore)\n\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    danno_inflitto.emit(35)\n\nfunc on_danno(v):\n    print("Danno registrato: ", v)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const sig = s.danno_inflitto;
    const isSig = sig && (typeof sig.emit === 'function');
    const cleanCode = stripCommentsAndStrings(result.code);
    const hasParamDecl = /\bsignal\s+danno_inflitto\s*\(/.test(cleanCode);
    tests.push({ desc: "Segnale 'signal danno_inflitto(valore)' dichiarato", passed: !!(isSig && hasParamDecl), diff: (isSig && hasParamDecl) ? null : "Dichiara 'signal danno_inflitto(valore)'." });
    
    let dynamicOk = false;
    if (sig && sig.callbacks && sig.callbacks.length > 0) {
        try {
            sig.emit(99);
            dynamicOk = result.logs.some(l => l.includes("99"));
        } catch(e) {
            dynamicOk = false;
        }
    }
    tests.push({ desc: "Segnale accetta e trasmette parametri numerici alla callback", passed: dynamicOk, diff: dynamicOk ? null : "La callback collegata deve ricevere il valore trasmesso dal segnale." });
    return tests;
}
    },
    {
        id: 44,
        chapterId: 11,
        isMastery: true,
        title: "44. ⭐ Sfida di Apprendimento: Sistema di Eventi Battaglia",
        icon: "🏆",
        xp: 100,
        difficulty: "avanzata",
        difficultyLabel: "Avanzata",
        scenario: "Il modulo di interfaccia utente di gioco (UI) deve sincronizzare la barra della salute ogni volta che il personaggio viene colpito in battaglia, usando un segnale disaccoppiato. Sotto i commenti:",
        requirements: [
            'Dichiara in cima il segnale: <code>signal salute_aggiornata(nuova_salute)</code>',
            'Crea la funzione di risposta: <code>func quando_salute_cambia(hp): print("UI: Barra salute a ", hp)</code>',
            'In <code>_ready()</code>, connetti il segnale alla funzione: <code>salute_aggiornata.connect(quando_salute_cambia)</code>',
            'Emetti il segnale due volte: prima con <code>salute_aggiornata.emit(75)</code> e poi con <code>salute_aggiornata.emit(40)</code>'
        ],
        notice: "Non modificare la riga finale print(). Il programma stampa:",
        expectedOutput: "UI: Barra salute a 75\nUI: Barra salute a 40\n=== EVENTI BATTAGLIA COMPLETATI ===",
        initialCode: `extends Node\n\n# Dichiara il segnale salute_aggiornata sotto\n\n\n# Crea la funzione quando_salute_cambia(hp) sotto\n\n\nfunc _ready():\n    # Connetti il segnale ed emetti due volte (75 e 40) sotto\n    \n    # Non modificare la riga sotto\n    print("=== EVENTI BATTAGLIA COMPLETATI ===")\n`,
        aiExplanation: "In Godot 4 l'architettura a segnali garantisce che nodi diversi (come il Player e la barra HP della UI) non abbiano bisogno di riferimenti diretti l'uno verso l'altro. Il Player lancia <code>salute_aggiornata.emit(nuova_salute)</code> e qualunque elemento collegato aggiorna autonomamente la propria grafica.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida richiede di costruire un sistema di trasmissione eventi completo per un gioco di ruolo: dichiarare il segnale, connetterlo al ricevitore ed emetterlo con dati dinamici."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Combina la dichiarazione `signal`, la connessione con `.connect()` dentro `_ready()`, e la funzione callback che gestisce il messaggio stampato."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nsignal livello_superato(num_livello)\n\nfunc _ready():\n    livello_superato.connect(_on_livello_superato)\n    livello_superato.emit(1)\n\nfunc _on_livello_superato(num):\n    print(\"Livello completato:\", num)\n```\nVerifica che il messaggio emesso corrisponda esattamente all'output atteso."
            }
],
        solution: `extends Node\n\nsignal salute_aggiornata(nuova_salute)\n\nfunc quando_salute_cambia(hp):\n    print("UI: Barra salute a ", hp)\n\nfunc _ready():\n    salute_aggiornata.connect(quando_salute_cambia)\n    salute_aggiornata.emit(75)\n    salute_aggiornata.emit(40)\n    \n    # Non modificare la riga sotto\n    print("=== EVENTI BATTAGLIA COMPLETATI ===")\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Sistema di Eventi Battaglia</h3>
                <p>Verifica la dichiarazione, connessione ed emissione multipla di segnali con parametri.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>signal salute_aggiornata(nuova_salute)</code></li>
                <li>Crea <code>func quando_salute_cambia(hp)</code> con stampa</li>
                <li>Connetti ed emetti con <code>75</code> e <code>40</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const sig = s.salute_aggiornata;
    const isSig = sig && (typeof sig.emit === 'function');
    tests.push({ desc: "Segnale salute_aggiornata con parametro configurato", passed: !!isSig, diff: isSig ? null : "Dichiara signal salute_aggiornata(nuova_salute)." });
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const ok = out.includes("UI: Barra salute a 75") && out.includes("UI: Barra salute a 40");
    tests.push({ desc: "Due eventi di salute emessi (75 e 40)", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 12: CLASSI E OGGETTI (OOP IN GODOT 4)
    // ==========================================
    {
        id: 45,
        chapterId: 12,
        isMastery: false,
        title: "45. Definire una Classe e il Costruttore _init()",
        icon: "🏛️",
        xp: 50,
        expectedOutput: "Pozione creata: Elisir (Cura: 50)",
        theory: `
            <p>La <strong>Programmazione Orientata agli Oggetti (OOP)</strong> permette di creare tipi di dato personalizzati definiti con <code>class NomeClasse:</code>.</p>
            <p>Il metodo speciale <code>func _init(parametri):</code> è il <strong>costruttore</strong>: viene invocato automaticamente quando si crea un nuovo oggetto, permettendo di inizializzarne i campi con <code>self.campo = valore</code>:</p>
            <pre class="code-block"><span class="k">class</span> Pozione:
    <span class="k">var</span> nome
    <span class="k">var</span> cura
    <span class="k">func</span> _init(n, c):
        self.nome = n
        self.cura = c</pre>
        `,
        task: `
            <ul>
                <li>Definisci la classe <code>class Pozione:</code> con campi <code>var nome</code> e <code>var cura</code>.</li>
                <li>Nel costruttore <code>func _init(n, c):</code> assegna <code>self.nome = n</code> e <code>self.cura = c</code>.</li>
                <li>In <code>_ready()</code>, crea l'oggetto: <code>var elisir = Pozione.new("Elisir", 50)</code>.</li>
                <li>Stampa: <code>print("Pozione creata: ", elisir.nome, " (Cura: ", elisir.cura, ")")</code>.</li>
            </ul>
        `,
        initialCode: `extends Node\n\n# Definisci la classe Pozione sotto\n\n\nfunc _ready():\n    # Crea elisir con Pozione.new e stampa sotto\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "La programmazione a oggetti (OOP) ti permette di creare i tuoi 'tipi' personalizzati (come una classe Nemico o Personaggio) definendo lo stampo con cui generare tanti oggetti simili."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In GDScript dichiari una classe personalizzata con la parola chiave `class NomeClasse:`. All'interno della classe dichiari le sue variabili di stato."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nclass Veicolo:\n    var marca = \"GodotMobile\"\n    var velocita = 100\n\nfunc _ready():\n    var auto = Veicolo.new()\n    print(auto.marca)\n```\nPer creare un'istanza della classe usa `NomeClasse.new()`."
            }
],
        solution: `extends Node\n\nclass Pozione:\n    var nome\n    var cura\n    func _init(n, c):\n        self.nome = n\n        self.cura = c\n\nfunc _ready():\n    var elisir = Pozione.new("Elisir", 50)\n    print("Pozione creata: ", elisir.nome, " (Cura: ", elisir.cura, ")")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const item = s.elisir;
    const itemOk = item && item.nome === "Elisir" && Number(item.cura) === 50;
    tests.push({ desc: "Istanza elisir creata con classe Pozione (Elisir, cura 50)", passed: !!itemOk, diff: itemOk ? null : `Ricevuto: ${JSON.stringify(item)}` });
    
    let classConstructorOk = false;
    if (s.Pozione && typeof s.Pozione.new === 'function') {
        try {
            const testInst = s.Pozione.new("Mana", 30);
            classConstructorOk = (testInst.nome === "Mana" && Number(testInst.cura) === 30);
        } catch(e) {
            classConstructorOk = false;
        }
    }
    tests.push({ desc: "Costruttore _init() valorizza correttamente campi di nuove istanze", passed: classConstructorOk, diff: classConstructorOk ? null : "Il costruttore _init(n, c) deve inizializzare self.nome e self.cura." });
    return tests;
}
    },
    {
        id: 46,
        chapterId: 12,
        isMastery: false,
        title: "46. Creare Istanze Multiple con .new()",
        icon: "👥",
        xp: 50,
        expectedOutput: "Eroe 1: Arthur (HP: 100)\nEroe 2: Lancelot (HP: 90)",
        theory: `
            <p>Una volta definita una classe, puoi istanziare quanti oggetti desideri usando <code>NomeClasse.new(...)</code>. Ciascuna istanza possiede i propri valori indipendenti in memoria:</p>
            <pre class="code-block"><span class="k">var</span> g1 = Guerriero.<span class="nb">new</span>(<span class="s">"Arthur"</span>, <span class="m">100</span>)
<span class="k">var</span> g2 = Guerriero.<span class="nb">new</span>(<span class="s">"Lancelot"</span>, <span class="m">90</span>)</pre>
        `,
        task: `
            <ul>
                <li>In <code>_ready()</code> crea due guerrieri: <code>var g1 = Guerriero.new("Arthur", 100)</code> e <code>var g2 = Guerriero.new("Lancelot", 90)</code>.</li>
                <li>Stampa: <code>print("Eroe 1: ", g1.nome, " (HP: ", g1.hp, ")")</code>.</li>
                <li>Stampa: <code>print("Eroe 2: ", g2.nome, " (HP: ", g2.hp, ")")</code>.</li>
            </ul>
        `,
        initialCode: `extends Node\n\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n, h):\n        self.nome = n\n        self.hp = h\n\nfunc _ready():\n    # Crea g1 e g2 con .new() e stampa i loro stati sotto\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Il costruttore è la funzione speciale che viene eseguita automaticamente ogni volta che crei un nuovo oggetto con `.new()`, per impostare le sue proprietà di partenza."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "In GDScript il costruttore si chiama sempre `func _init(parametri):`. Al suo interno assegni i parametri alle variabili dell'istanza (`self.nome = nome`)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nclass Mostro:\n    var nome: String\n    func _init(n):\n        nome = n\n\nfunc _ready():\n    var m = Mostro.new(\"Slime\")\n    print(m.nome) # Stampa 'Slime'\n```\nI valori passati a `.new(...)` vengono inoltrati a `_init`."
            }
],
        solution: `extends Node\n\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n, h):\n        self.nome = n\n        self.hp = h\n\nfunc _ready():\n    var g1 = Guerriero.new("Arthur", 100)\n    var g2 = Guerriero.new("Lancelot", 90)\n    print("Eroe 1: ", g1.nome, " (HP: ", g1.hp, ")")\n    print("Eroe 2: ", g2.nome, " (HP: ", g2.hp, ")")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const g1Ok = s.g1 && s.g1.nome === "Arthur" && Number(s.g1.hp) === 100;
    const g2Ok = s.g2 && s.g2.nome === "Lancelot" && Number(s.g2.hp) === 90;
    tests.push({ desc: "Istanze indipendenti g1 e g2 create correttamente", passed: !!(g1Ok && g2Ok), diff: (g1Ok && g2Ok) ? null : "Crea g1 (Arthur, 100) e g2 (Lancelot, 90)." });
    return tests;
}
    },
    {
        id: 47,
        chapterId: 12,
        isMastery: false,
        title: "47. Metodi di Classe (Comportamento)",
        icon: "⚔️",
        xp: 50,
        expectedOutput: "Danno colpo caricato: 50",
        theory: `
            <p>Oltre alle proprietà, una classe può contenere <strong>metodi</strong> che ne descrivono il comportamento. I metodi possono accedere ai campi dell'oggetto usando <code>self.campo</code>:</p>
            <pre class="code-block"><span class="k">class</span> Personaggio:
    <span class="k">var</span> nome
    <span class="k">var</span> attacco
    <span class="k">func</span> _init(n, a):
        self.nome = n
        self.attacco = a
    <span class="k">func</span> colpo_caricato():
        <span class="k">return</span> self.attacco * <span class="m">2</span></pre>
        `,
        task: `
            <ul>
                <li>Nella classe <code>Personaggio</code>, aggiungi il metodo <code>func colpo_caricato(): return self.attacco * 2</code>.</li>
                <li>In <code>_ready()</code>, crea <code>var eroe = Personaggio.new("Eroe", 25)</code>.</li>
                <li>Stampa: <code>print("Danno colpo caricato: ", eroe.colpo_caricato())</code>.</li>
            </ul>
        `,
        initialCode: `extends Node\n\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n, a):\n        self.nome = n\n        self.attacco = a\n    # Aggiungi func colpo_caricato() sotto\n\n\nfunc _ready():\n    # Istanzia eroe con attacco 25 e stampa il colpo caricato sotto\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I metodi sono funzioni definite all'interno di una classe che rappresentano le azioni che quell'oggetto può compiere o subire (es. subire danno, attaccare, curarsi)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Definisci la funzione indentata all'interno della classe: `func subisci_danno(quantita):`. All'interno, modifica le proprietà dell'oggetto: `salute -= quantita`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nclass Giocatore:\n    var hp = 100\n    func ferisci(danno):\n        hp -= danno\n\nfunc _ready():\n    var p = Giocatore.new()\n    p.ferisci(20)\n    print(p.hp) # Stampa 80\n```\nInvocare `p.ferisci(20)` modifica direttamente l'istanza `p`."
            }
],
        solution: `extends Node\n\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n, a):\n        self.nome = n\n        self.attacco = a\n    func colpo_caricato():\n        return self.attacco * 2\n\nfunc _ready():\n    var eroe = Personaggio.new("Eroe", 25)\n    print("Danno colpo caricato: ", eroe.colpo_caricato())\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const hero = s.eroe;
    const heroOk = hero && typeof hero.colpo_caricato === 'function' && hero.colpo_caricato() === 50;
    tests.push({ desc: "Metodo colpo_caricato() restituisce attacco * 2 (25 x 2 = 50)", passed: !!heroOk, diff: heroOk ? null : "Definisci func colpo_caricato(): return self.attacco * 2." });
    
    let methodTestOk = false;
    if (s.Personaggio && typeof s.Personaggio.new === 'function') {
        try {
            const testP = s.Personaggio.new("Dummy", 40);
            methodTestOk = (testP.colpo_caricato() === 80);
        } catch(e) {
            methodTestOk = false;
        }
    }
    tests.push({ desc: "Metodo calcola correttamente il danno anche su nuove istanze", passed: methodTestOk, diff: methodTestOk ? null : "Il metodo colpo_caricato deve utilizzare self.attacco dell'istanza." });
    return tests;
}
    },
    {
        id: 48,
        chapterId: 12,
        isMastery: true,
        title: "48. ⭐ Sfida di Apprendimento Finale: Creazione Party RPG ad Oggetti",
        icon: "🏆",
        xp: 100,
        difficulty: "avanzata",
        difficultyLabel: "Avanzata",
        scenario: "La gilda degli avventurieri registra la spedizione dungeon creando i due compagni con la classe personalizzata Avventuriero e calcolando la salute complessiva della squadra. Sotto i commenti:",
        requirements: [
            'Definisci la classe <code>class Avventuriero:</code> con le proprietà <code>var nome</code>, <code>var ruolo</code>, <code>var vita</code>',
            'Nel costruttore <code>func _init(n, r, v):</code> assegna <code>self.nome = n</code>, <code>self.ruolo = r</code> e <code>self.vita = v</code>',
            'In <code>_ready()</code> crea <code>var membro1 = Avventuriero.new("Aria", "Maga", 80)</code>',
            'Crea il secondo membro: <code>var membro2 = Avventuriero.new("Krag", "Guerriero", 120)</code>',
            'Calcola la salute totale del party in <code>var vita_totale = membro1.vita + membro2.vita</code>'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Membro 1: Aria (Maga)\nMembro 2: Krag (Guerriero)\nSalute totale party: 200",
        initialCode: `extends Node\n\n# Definisci la classe Avventuriero con _init sotto\n\n\nfunc _ready():\n    # Crea membro1, membro2 e calcola vita_totale sotto\n    \n    # Non modificare le righe sotto\n    print("Membro 1: ", membro1.nome, " (", membro1.ruolo, ")")\n    print("Membro 2: ", membro2.nome, " (", membro2.ruolo, ")")\n    print("Salute totale party: ", vita_totale)\n`,
        aiExplanation: "Congratulazioni per essere arrivato alla Sfida Finale del Corso! In Godot Engine l'incapsulamento dei dati in classi personalizzate è la base per creare entità complesse, gestire party di gioco, inventari ed elementi della scena in modo pulito ed espandibile.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida culminante dell'OOP richiede di assemblare un'intera entità RPG con attributi, costruttore parametrico e metodi di interazione."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Crea la classe `Personaggio`, implementa `_init(nome_init, hp_init)` e i metodi richiesti (`subisci_danno` e `guarisci`). Poi istanziala in `_ready()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nclass Eroe:\n    var nome = \"\"\n    var hp = 0\n    func _init(n, h):\n        nome = n\n        hp = h\n    func cura(val):\n        hp += val\n\nfunc _ready():\n    var e = Eroe.new(\"Artù\", 100)\n    e.cura(25)\n    print(e.nome, e.hp)\n```\nSegui scrupolosamente i nomi delle variabili e dei metodi specificati nella sfida."
            }
],
        solution: `extends Node\n\nclass Avventuriero:\n    var nome\n    var ruolo\n    var vita\n    func _init(n, r, v):\n        self.nome = n\n        self.ruolo = r\n        self.vita = v\n\nfunc _ready():\n    var membro1 = Avventuriero.new("Aria", "Maga", 80)\n    var membro2 = Avventuriero.new("Krag", "Guerriero", 120)\n    var vita_totale = membro1.vita + membro2.vita\n    \n    # Non modificare le righe sotto\n    print("Membro 1: ", membro1.nome, " (", membro1.ruolo, ")")\n    print("Membro 2: ", membro2.nome, " (", membro2.ruolo, ")")\n    print("Salute totale party: ", vita_totale)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">🏆 SFIDA DI APPRENDIMENTO FINALE • CORSO GODOT 4 COMPLETATO</span>
                <h3>Creazione Party RPG ad Oggetti</h3>
                <p>La sfida suprema di GDScript Hero: unisci classi, costruttori, istanze multiple e calcolo di statistiche collettive.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Crea la classe <code>Avventuriero</code> con <code>_init</code></li>
                <li>Istanzia <code>membro1</code> e <code>membro2</code> con <code>.new()</code></li>
                <li>Calcola <code>var vita_totale = membro1.vita + membro2.vita</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const s = result.scope || {};
    const m1 = s.membro1;
    const m2 = s.membro2;
    const m1Ok = m1 && m1.nome === "Aria" && m1.ruolo === "Maga" && Number(m1.vita) === 80;
    const m2Ok = m2 && m2.nome === "Krag" && m2.ruolo === "Guerriero" && Number(m2.vita) === 120;
    const totOk = Number(s.vita_totale) === 200;
    tests.push({ desc: "Membri party istanziati (Aria Maga 80 HP, Krag Guerriero 120 HP)", passed: !!(m1Ok && m2Ok), diff: (m1Ok && m2Ok) ? null : "Verifica le istanze membro1 e membro2." });
    tests.push({ desc: "Salute totale del party calcolata a 200 HP", passed: totOk, diff: totOk ? null : `vita_totale=${s.vita_totale}` });
    return tests;
}
    },
// ==========================================
    // CAPITOLO 13: L'ALBERO DELLA SCENA E I NODI
    // ==========================================
    {
        id: 49,
        chapterId: 13,
        isMastery: false,
        title: "49. Cos'è un Nodo e l'Albero di Godot",
        icon: "🌳",
        xp: 60,
        expectedOutput: "Nodo rilevato: Giocatore",
        initialNodes: [
            { type: "Node", name: "Giocatore" }
        ],
        theory: `
            <p>In Godot Engine tutto è un <strong>Nodo (Node)</strong>: il personaggio, un'interfaccia, i nemici o un effetto visivo sono nodi organizzati a forma di albero gerarchico chiamato <strong>SceneTree</strong>.</p>
            <p>I nodi vengono creati e posizionati visivamente nella Scena (puoi osservarli nel pannello <strong>Scena Godot</strong> in basso a destra). In GDScript, usiamo la scorciatoia nativa <strong><code>$NomeNodo</code></strong> per accedere direttamente a qualsiasi nodo figlio dell'albero:</p>
            <pre class="code-block"><span class="c"># Accede al nodo figlio 'Giocatore' presente nella scena e ne legge il nome</span>
<span class="nb">print</span>(<span class="s">"Nodo trovato: "</span>, $Giocatore.name)</pre>
        `,
        task: `
            <ul>
                <li>Nel pannello <strong>Scena Godot</strong> a destra puoi osservare il nodo <code>Giocatore</code> già presente nell'albero.</li>
                <li>In <code>_ready()</code>, accedi al nodo con la sintassi nativa <code>$Giocatore</code>.</li>
                <li>Stampa a console: <code>print("Nodo rilevato: ", $Giocatore.name)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Accedi al nodo $Giocatore presente nella scena e stampa il suo nome\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "In Godot ogni gioco è un albero gerarchico di nodi (Scene Tree). Per controllare un elemento del gioco dallo script del genitore, dobbiamo ottenere un riferimento al nodo figlio desiderato."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa la sintassi rapida `$NomeNodo`. È una scorciatoia nativa di GDScript che equivale a chiamare `get_node(\"NomeNodo\")`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var nemico = $Nemico\n    print(nemico.name)\n```\nAssegna `$Giocatore` a una variabile `giocatore`."
            }
],
        solution: `func _ready():\n    print("Nodo rilevato: ", $Giocatore.name)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const nodeOk = sc && sc.has_node("Giocatore");
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesSyntax = /\$Giocatore\b/.test(cleanCode);
    tests.push({ desc: "Nodo 'Giocatore' presente nella scena", passed: !!nodeOk, diff: nodeOk ? null : "Nodo Giocatore non presente nella scena." });
    tests.push({ desc: "Sintassi nativa '$Giocatore' utilizzata nel codice", passed: !!usesSyntax, diff: usesSyntax ? null : "Accedi al nodo usando la sintassi: $Giocatore.name." });
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const outOk = out.includes("Nodo rilevato: Giocatore");
    tests.push({ desc: "Console stampa 'Nodo rilevato: Giocatore'", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 50,
        chapterId: 13,
        isMastery: false,
        title: "50. Testo a Schermo: Il nodo Label",
        icon: "🏷️",
        xp: 60,
        expectedOutput: "Testo a schermo: Benvenuto in Godot 4!",
        initialNodes: [
            { type: "Label", name: "Titolo", text: "In attesa..." }
        ],
        theory: `
            <p>Il nodo <strong>Label</strong> è il componente dedicato alla visualizzazione di testo nell'interfaccia 2D di Godot.</p>
            <p>I nodi Label sono creati nell'albero della Scena e visualizzati a schermo. Da codice GDScript possiamo cambiarne dinamicamente il contenuto modificando la proprietà <strong><code>.text</code></strong>:</p>
            <pre class="code-block"><span class="c"># Modifica il testo visualizzato dalla Label nella scena</span>
$Titolo.text = <span class="s">"Benvenuto in Godot 4!"</span>
<span class="nb">print</span>($Titolo.text)</pre>
        `,
        task: `
            <ul>
                <li>Nella scena è già presente il nodo <code>$Titolo</code> (visibile anche nell'anteprima 2D).</li>
                <li>Modifica il testo della label: <code>$Titolo.text = "Benvenuto in Godot 4!"</code>.</li>
                <li>Stampa a console: <code>print("Testo a schermo: ", $Titolo.text)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Modifica $Titolo.text e stampa a console\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Ogni nodo possiede proprietà specifiche in base al suo tipo. Un nodo di tipo Label (testo) possiede la proprietà `.text` che controlla la stringa mostrata a video."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Accedi al nodo tramite il dollaro e modifica la proprietà direttamente con l'assegnazione: `$NomeLabel.text = \"Nuovo testo\"`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    $Messaggio.text = \"Game Started!\"\n```\nSostituisci il nome del nodo con `$Titolo` e imposta il testo richiesto."
            }
],
        solution: `func _ready():\n    $Titolo.text = "Benvenuto in Godot 4!"\n    print("Testo a schermo: ", $Titolo.text)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const node = sc ? sc.get_node("Titolo") : null;
    const labelOk = node && node.text === "Benvenuto in Godot 4!";
    tests.push({ desc: "Proprietà text del nodo Label '$Titolo' impostata a 'Benvenuto in Godot 4!'", passed: !!labelOk, diff: labelOk ? null : `Ricevuto: ${node ? node.text : 'Nodo non trovato'}` });
    return tests;
}
    },
    {
        id: 51,
        chapterId: 13,
        isMastery: false,
        title: "51. L'operatore $: Accedere ai Nodi Figli",
        icon: "🧭",
        xp: 60,
        expectedOutput: "Nuova salute: HP: 75",
        initialNodes: [
            { type: "Label", name: "SaluteLabel", text: "HP: 100" }
        ],
        theory: `
            <p>In una scena reale di Godot, molti nodi sono già stati creati nell'albero della scena.</p>
            <p>Per accedere a un nodo figlio esistente non serve cercarlo manualmente: in GDScript si usa la scorciatoia nativa <strong><code>$NomeNodo</code></strong> (che equivale a <code>get_node("NomeNodo")</code>):</p>
            <pre class="code-block"><span class="c"># Modifica la Label già presente nella scena</span>
$SaluteLabel.text = <span class="s">"HP: 75"</span>
<span class="nb">print</span>($SaluteLabel.text)</pre>
        `,
        task: `
            <ul>
                <li>Nella scena è già presente il nodo <code>$SaluteLabel</code>.</li>
                <li>Modifica il suo testo: <code>$SaluteLabel.text = "HP: 75"</code>.</li>
                <li>Stampa il valore aggiornato: <code>print("Nuova salute: ", $SaluteLabel.text)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Accedi a $SaluteLabel con l'operatore $, aggiorna il testo a "HP: 75" e stampa\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Quando i nodi hanno nomi con spazi o caratteri speciali, o quando il percorso viene composto dinamicamente, si usa il metodo formale `get_node(...)`."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Chiama `get_node(\"Percorso/Nome\")` passando il nome esatto tra virgolette, rispettando maiuscole e minuscole."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var moneta = get_node(\"Moneta Speciale\")\n    print(moneta.name)\n```\nIn Godot, i percorsi dei nodi sono sempre case-sensitive (sensibili a maiuscole e minuscole)."
            }
],
        solution: `func _ready():\n    $SaluteLabel.text = "HP: 75"\n    print("Nuova salute: ", $SaluteLabel.text)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const node = sc ? sc.get_node("SaluteLabel") : null;
    const ok = node && node.text === "HP: 75";
    tests.push({ desc: "Nodo '$SaluteLabel.text' aggiornato a 'HP: 75'", passed: !!ok, diff: ok ? null : `Ricevuto: ${node ? node.text : 'null'}` });
    return tests;
}
    },
    {
        id: 52,
        chapterId: 13,
        isMastery: true,
        title: "52. ⭐ Sfida di Apprendimento: La Targhetta del Dungeon",
        icon: "🏆",
        xp: 120,
        difficulty: "media",
        difficultyLabel: "Media",
        initialNodes: [
            { type: "Label", name: "TitoloDungeon", text: "In attesa..." },
            { type: "Label", name: "LivelloLabel", text: "In attesa..." },
            { type: "Label", name: "MoneteLabel", text: "In attesa..." }
        ],
        scenario: "Il custode delle rovine antiche deve allestire la schermata d'ingresso del dungeon configurando le tre etichette informative presenti nell'albero della scena: <code>$TitoloDungeon</code>, <code>$LivelloLabel</code> e <code>$MoneteLabel</code>. Sotto il commento, accedi con l'operatore <code>$</code> e configura i testi corretti:",
        requirements: [
            'Imposta <code>$TitoloDungeon.text = "Caverna dei Goblin"</code>',
            'Imposta <code>$LivelloLabel.text = "Livello: 1"</code>',
            'Imposta <code>$MoneteLabel.text = "Oro: 50"</code>'
        ],
        notice: "Non modificare le righe print(). Il programma stampa:",
        expectedOutput: "Dungeon: Caverna dei Goblin\nDifficolta: Livello: 1\nBottino: Oro: 50",
        initialCode: `extends Node\n\nfunc _ready():\n    # Configura $TitoloDungeon, $LivelloLabel e $MoneteLabel sotto\n    \n    # Non modificare le righe sotto\n    print("Dungeon: ", $TitoloDungeon.text)\n    print("Difficolta: ", $LivelloLabel.text)\n    print("Bottino: ", $MoneteLabel.text)\n`,
        aiExplanation: `In Godot accedere ai nodi della scena con <code>$NomeNodo</code> permette di leggere e modificare qualunque proprietà visiva (come <code>.text</code> nelle Label). Assemblando la struttura visivamente nella Scena e programmando la logica in GDScript si ottiene il flusso di sviluppo nativo e raccomandato del motore.`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida richiede di manipolare l'interfaccia grafica aggiornando più etichette contemporaneamente (es. titolo del livello e punteggio attuale) interagendo con i nodi della scena."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Accedi a ciascuna Label con la notazione `$` o con `get_node` e modifica la rispettiva proprietà `.text` con i valori richiesti."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    $Titolo.text = \"Capitolo 1\"\n    $Punti.text = \"Punti: 0\"\n```\nAssicurati che entrambi i nodi ricevano il testo esatto indicato nelle istruzioni."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    $TitoloDungeon.text = "Caverna dei Goblin"\n    $LivelloLabel.text = "Livello: 1"\n    $MoneteLabel.text = "Oro: 50"\n    \n    # Non modificare le righe sotto\n    print("Dungeon: ", $TitoloDungeon.text)\n    print("Difficolta: ", $LivelloLabel.text)\n    print("Bottino: ", $MoneteLabel.text)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>La Targhetta del Dungeon</h3>
                <p>Verifica l'accesso e la configurazione di molteplici nodi Label presenti nell'albero della scena tramite l'operatore nativo $.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Imposta <code>$TitoloDungeon.text = "Caverna dei Goblin"</code></li>
                <li>Imposta <code>$LivelloLabel.text = "Livello: 1"</code></li>
                <li>Imposta <code>$MoneteLabel.text = "Oro: 50"</code></li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const tOk = sc && sc.get_node("TitoloDungeon") && sc.get_node("TitoloDungeon").text === "Caverna dei Goblin";
    const lOk = sc && sc.get_node("LivelloLabel") && sc.get_node("LivelloLabel").text === "Livello: 1";
    const mOk = sc && sc.get_node("MoneteLabel") && sc.get_node("MoneteLabel").text === "Oro: 50";
    tests.push({ desc: "TitoloDungeon ('Caverna dei Goblin') e LivelloLabel ('Livello: 1') configurati", passed: !!(tOk && lOk), diff: (tOk && lOk) ? null : "Verifica le proprietà .text dei nodi." });
    tests.push({ desc: "MoneteLabel configurata con 'Oro: 50'", passed: !!mOk, diff: mOk ? null : "MoneteLabel non trovata o testo errato." });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 14: NODI UI & INTERATTIVITÀ (BUTTON)
    // ==========================================
    {
        id: 53,
        chapterId: 14,
        isMastery: false,
        title: "53. Il primo Pulsante: Il nodo Button",
        icon: "🔘",
        xp: 60,
        expectedOutput: "Pulsante configurato: Sferra Attacco",
        initialNodes: [
            { type: "Button", name: "AttaccaBtn", text: "In attesa..." }
        ],
        theory: `
            <p>Il nodo <strong>Button</strong> crea un controllo interattivo nell'interfaccia 2D che l'utente può cliccare a schermo nella Viewport.</p>
            <p>I nodi Button vengono creati nell'albero della Scena e mostrati a schermo. In GDScript possiamo configurarne le proprietà accedendovi con la sintassi nativa <strong><code>$</code></strong>, ad esempio modificando il testo mostrato sul pulsante tramite <strong><code>.text</code></strong>:</p>
            <pre class="code-block"><span class="c"># Modifica la scritta visualizzata sul pulsante</span>
$AttaccaBtn.text = <span class="s">"Sferra Attacco"</span>
<span class="nb">print</span>($AttaccaBtn.text)</pre>
        `,
        task: `
            <ul>
                <li>Nella scena è già presente il nodo <code>$AttaccaBtn</code> (visibile anche nell'anteprima Viewport 2D in basso a destra).</li>
                <li>Modifica la proprietà <code>text</code> del pulsante: <code>$AttaccaBtn.text = "Sferra Attacco"</code>.</li>
                <li>Stampa a console il testo aggiornato: <code>print("Pulsante configurato: ", $AttaccaBtn.text)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Modifica il testo di $AttaccaBtn e stampa a console\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I nodi `Button` sono i controlli interattivi fondamentali dell'interfaccia di Godot, capaci di ricevere click o tap dall'utente e mostrare etichette testuali."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Puoi modificare il testo visibile di un pulsante assegnando la sua proprietà `.text`: `$PulsanteAvvia.text = \"Gioca\"`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var btn = $MioPulsante\n    btn.text = \"Inizia Battaglia\"\n    print(btn.text)\n```\nModifica la proprietà `.text` del nodo pulsante specificato nell'esercizio."
            }
],
        solution: `func _ready():\n    $AttaccaBtn.text = "Sferra Attacco"\n    print("Pulsante configurato: ", $AttaccaBtn.text)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const btn = sc ? sc.get_node("AttaccaBtn") : null;
    const btnOk = btn && btn.type === "Button" && btn.text === "Sferra Attacco";
    tests.push({ desc: "Nodo Button '$AttaccaBtn.text' impostato a 'Sferra Attacco'", passed: !!btnOk, diff: btnOk ? null : `Ricevuto: ${btn ? btn.text : 'Nodo non trovato'}` });
    return tests;
}
    },
    {
        id: 54,
        chapterId: 14,
        isMastery: false,
        title: "54. Rendere vivo il pulsante: Il Segnale pressed",
        icon: "⚡",
        xp: 60,
        expectedOutput: "Pulsante connesso\nColpo sferrato con successo!",
        initialNodes: [
            { type: "Button", name: "AttaccaBtn", text: "Attacca" }
        ],
        theory: `
            <p>I pulsanti di Godot emettono il segnale nativo <strong><code>pressed</code></strong> ogni volta che l'utente ci clicca sopra.</p>
            <p>Per far reagire il gioco al click, colleghiamo il segnale a una funzione con <code>connect</code>:</p>
            <pre class="code-block"><span class="k">func</span> _ready():
    $AttaccaBtn.pressed.connect(quando_premuto)

<span class="k">func</span> quando_premuto():
    <span class="nb">print</span>(<span class="s">"Pulsante cliccato!"</span>)</pre>
        `,
        task: `
            <ul>
                <li>In <code>_ready()</code>, connetti il segnale: <code>$AttaccaBtn.pressed.connect(quando_premuto)</code>.</li>
                <li>Stampa in <code>_ready()</code>: <code>print("Pulsante connesso")</code>.</li>
                <li>Definisci la funzione <code>func quando_premuto():</code> che stampa <code>print("Colpo sferrato con successo!")</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Connetti $AttaccaBtn.pressed e stampa "Pulsante connesso"\n    pass\n\n# Definisci func quando_premuto() sotto\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I pulsanti in Godot emettono automaticamente il segnale `pressed` ogni volta che vengono cliccati. Collegando questo segnale a una funzione, esegui il codice di risposta al click."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Usa `$Pulsante.pressed.connect(nome_funzione)` dentro `_ready()`, e definisci la funzione callback che esegue l'azione."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nfunc _ready():\n    $Pulsante.pressed.connect(_on_pulsante_pressed)\n\nfunc _on_pulsante_pressed():\n    print(\"Click registrato!\")\n```\nNon dimenticare di connettere il segnale all'interno di `_ready()`."
            }
],
        solution: `func _ready():\n    $AttaccaBtn.pressed.connect(quando_premuto)\n    print("Pulsante connesso")\n\nfunc quando_premuto():\n    print("Colpo sferrato con successo!")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const btn = sc ? sc.get_node("AttaccaBtn") : null;
    const connected = btn && btn.pressed && btn.pressed.callbacks && btn.pressed.callbacks.length > 0;
    tests.push({ desc: "Segnale $AttaccaBtn.pressed connesso con .connect(quando_premuto)", passed: !!connected, diff: connected ? null : "Usa $AttaccaBtn.pressed.connect(quando_premuto)." });
    if (connected) {
        btn.pressed.emit();
    }
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const outOk = out.includes("Colpo sferrato con successo!");
    tests.push({ desc: "Callback quando_premuto() invocata al click del pulsante", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 55,
        chapterId: 14,
        isMastery: false,
        title: "55. Costruire un mini Clicker Game",
        icon: "🎮",
        xp: 60,
        expectedOutput: "Clicker pronto\nClick: 1",
        initialNodes: [
            { type: "Button", name: "ClickBtn", text: "Cliccami!" },
            { type: "Label", name: "PuntiLabel", text: "Click: 0" }
        ],
        theory: `
            <p>Unendo un <code>Button</code> e una <code>Label</code> possiamo realizzare un ciclo di gioco reattivo: ogni volta che il giocatore preme il pulsante, incrementiamo una variabile e aggiorniamo il testo a schermo!</p>
            <pre class="code-block"><span class="k">var</span> punti = <span class="m">0</span>

<span class="k">func</span> _ready():
    $ClickBtn.pressed.connect(al_click)

<span class="k">func</span> al_click():
    punti += <span class="m">1</span>
    $PuntiLabel.text = <span class="s">"Click: "</span> + <span class="nb">str</span>(punti)</pre>
        `,
        task: `
            <ul>
                <li>Crea la variabile <code>var punti = 0</code>.</li>
                <li>In <code>_ready()</code> connetti <code>$ClickBtn.pressed.connect(al_click)</code> e stampa <code>print("Clicker pronto")</code>.</li>
                <li>In <code>func al_click():</code> incrementa <code>punti += 1</code> e aggiorna <code>$PuntiLabel.text = "Click: " + str(punti)</code>.</li>
                <li>Stampa il testo aggiornato: <code>print($PuntiLabel.text)</code>.</li>
            </ul>
        `,
        initialCode: `var punti = 0\n\nfunc _ready():\n    # Connetti $ClickBtn.pressed ad al_click e stampa "Clicker pronto"\n    pass\n\nfunc al_click():\n    # Incrementa punti, aggiorna $PuntiLabel.text e stampa\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "In Godot puoi alterare l'aspetto visivo e il colore di qualsiasi nodo 2D o UI modificando la sua proprietà `.modulate` (tinta di colore)."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Assegna una stringa di colore esadecimale o un Color a `.modulate`: `$Riquadro.modulate = \"#10b981\"` (verde smeraldo)."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    $Pannello.modulate = \"#ef4444\" # Rosso acceso\n```\nUsa il codice esadecimale specificato nella consegna della lezione."
            }
],
        solution: `var punti = 0\n\nfunc _ready():\n    $ClickBtn.pressed.connect(al_click)\n    print("Clicker pronto")\n\nfunc al_click():\n    punti += 1\n    $PuntiLabel.text = "Click: " + str(punti)\n    print($PuntiLabel.text)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const btn = sc ? sc.get_node("ClickBtn") : null;
    const lbl = sc ? sc.get_node("PuntiLabel") : null;
    const connected = btn && btn.pressed && btn.pressed.callbacks && btn.pressed.callbacks.length > 0;
    tests.push({ desc: "Pulsante $ClickBtn connesso alla funzione al_click", passed: !!connected, diff: connected ? null : "Connetti con $ClickBtn.pressed.connect(al_click)." });
    if (connected) {
        btn.pressed.emit();
    }
    const lblOk = lbl && lbl.text === "Click: 1";
    tests.push({ desc: "Etichetta $PuntiLabel aggiornata correttamente a 'Click: 1'", passed: !!lblOk, diff: lblOk ? null : `Ricevuto: ${lbl ? lbl.text : 'null'}` });
    return tests;
}
    },
    {
        id: 56,
        chapterId: 14,
        isMastery: true,
        title: "56. ⭐ Sfida di Apprendimento: Il Pannello di Controllo dell'Astronave",
        icon: "🚀",
        xp: 120,
        difficulty: "media",
        difficultyLabel: "Media",
        initialNodes: [
            { type: "Button", name: "MotoriBtn", text: "Accendi Motori" },
            { type: "Button", name: "AllarmeBtn", text: "Attiva Allarme" },
            { type: "Label", name: "StatoNave", text: "Sistemi Normali" }
        ],
        scenario: "Sulla plancia di comando della nave interstellare, il navigatore deve configurare i due comandi principali collegando i rispettivi segnali e aggiornando il monitor centrale della cabina. Nella scena sono già posizionati i nodi <code>$MotoriBtn</code>, <code>$AllarmeBtn</code> e la <code>$StatoNave</code>. Sotto i commenti, programma la plancia:",
        requirements: [
            'In <code>_ready()</code>, connetti <code>$MotoriBtn.pressed.connect(attiva_motori)</code>',
            'In <code>_ready()</code>, connetti <code>$AllarmeBtn.pressed.connect(attiva_allarme)</code>',
            'Nella funzione <code>func attiva_motori():</code> imposta <code>$StatoNave.text = "Motori a Massima Potenza"</code> e stampa <code>"Velocita Aumentata"</code>',
            'Nella funzione <code>func attiva_allarme():</code> imposta <code>$StatoNave.text = "Allarme Rosso Attivo"</code> e stampa <code>"Scudi al 100%"</code>'
        ],
        notice: "Non modificare la riga print() iniziale. Il programma stampa:",
        expectedOutput: "Plancia Operativa\nVelocita Aumentata\nScudi al 100%",
        initialCode: `extends Node\n\nfunc _ready():\n    # Connetti $MotoriBtn e $AllarmeBtn sotto\n    \n    # Non modificare la riga sotto\n    print("Plancia Operativa")\n\n# Definisci le funzioni attiva_motori e attiva_allarme sotto\n`,
        aiExplanation: "In Godot puoi collegare più nodi Button a funzioni diverse per creare pannelli di controllo e interfacce utente complesse. Ogni pulsante ha la propria istanza del segnale <code>pressed</code>, che quando viene emesso esegue il blocco associato modificando le Label e lo stato della scena.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Questa sfida richiede di collegare interazione e feedback visivo: quando l'utente clicca il pulsante, l'etichetta cambia testo e il pannello cambia colore."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Connetti il segnale `.pressed` del pulsante a una funzione callback, e al suo interno aggiorna la proprietà `.text` della Label e il colore di sfondo."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    $Bottone.pressed.connect(_on_click)\n\nfunc _on_click():\n    $Stato.text = \"Attivato\"\n    $Sfondo.modulate = \"#10b981\"\n```\nVerifica che tutti i nodi referenziati corrispondano ai nomi nell'albero della scena."
            }
],
        solution: `extends Node\n\nfunc _ready():\n    $MotoriBtn.pressed.connect(attiva_motori)\n    $AllarmeBtn.pressed.connect(attiva_allarme)\n    \n    # Non modificare la riga sotto\n    print("Plancia Operativa")\n\nfunc attiva_motori():\n    $StatoNave.text = "Motori a Massima Potenza"\n    print("Velocita Aumentata")\n\nfunc attiva_allarme():\n    $StatoNave.text = "Allarme Rosso Attivo"\n    print("Scudi al 100%")\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⭐ LIVELLO BONUS • SFIDA DI APPRENDIMENTO</span>
                <h3>Il Pannello di Controllo dell'Astronave</h3>
                <p>Verifica la gestione di pulsanti multipli (Button) e la reazione ai click per aggiornare l'interfaccia di bordo.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Connetti <code>$MotoriBtn.pressed</code> a <code>attiva_motori</code></li>
                <li>Connetti <code>$AllarmeBtn.pressed</code> a <code>attiva_allarme</code></li>
                <li>Aggiorna <code>$StatoNave.text</code> nelle rispettive funzioni</li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const mBtn = sc ? sc.get_node("MotoriBtn") : null;
    const aBtn = sc ? sc.get_node("AllarmeBtn") : null;
    const sLbl = sc ? sc.get_node("StatoNave") : null;
    const mConn = mBtn && mBtn.pressed && mBtn.pressed.callbacks.length > 0;
    const aConn = aBtn && aBtn.pressed && aBtn.pressed.callbacks.length > 0;
    tests.push({ desc: "Entrambi i pulsanti $MotoriBtn e $AllarmeBtn connessi con successo", passed: !!(mConn && aConn), diff: (mConn && aConn) ? null : "Uno o entrambi i pulsanti non risultano connessi." });
    if (mConn) mBtn.pressed.emit();
    const motOk = sLbl && sLbl.text === "Motori a Massima Potenza";
    tests.push({ desc: "Click su MotoriBtn aggiorna lo stato a 'Motori a Massima Potenza'", passed: !!motOk, diff: motOk ? null : `Ricevuto: ${sLbl ? sLbl.text : 'null'}` });
    if (aConn) aBtn.pressed.emit();
    const almOk = sLbl && sLbl.text === "Allarme Rosso Attivo";
    tests.push({ desc: "Click su AllarmeBtn aggiorna lo stato a 'Allarme Rosso Attivo'", passed: !!almOk, diff: almOk ? null : `Ricevuto: ${sLbl ? sLbl.text : 'null'}` });
    return tests;
}
    },

    // ==========================================
    // CAPITOLO 15: NODI TEMPORALI E AVANZATI
    // ==========================================
    {
        id: 57,
        chapterId: 15,
        isMastery: false,
        title: "57. Il nodo Timer: wait_time e segnale timeout",
        icon: "⏱️",
        xp: 60,
        expectedOutput: "Timer avviato per: 2.5s\nTempo scaduto!",
        initialNodes: [
            { type: "Timer", name: "Cooldown", wait_time: 1.0, one_shot: false }
        ],
        theory: `
            <p>Il nodo <strong>Timer</strong> permette di creare conti alla rovescia o azioni periodiche (es. ricarica abilità, spawn di nemici ogni tot secondi).</p>
            <p>Il nodo Timer è già presente nell'albero della Scena. In GDScript possiamo configurarne le proprietà e i metodi tramite <code>$Cooldown</code>:</p>
            <ul>
                <li><code>$Cooldown.wait_time = 2.5</code> (durata del conteggio in secondi)</li>
                <li><code>$Cooldown.one_shot = true</code> (se fermarsi dopo un solo scatto)</li>
                <li><code>$Cooldown.timeout.connect(funzione)</code> (il segnale emesso allo scadere del tempo)</li>
                <li><code>$Cooldown.start()</code> (avvia il conteggio)</li>
            </ul>
        `,
        task: `
            <ul>
                <li>Nella scena è già presente il nodo <code>$Cooldown</code> (Timer).</li>
                <li>Imposta <code>$Cooldown.wait_time = 2.5</code> e <code>$Cooldown.one_shot = true</code>.</li>
                <li>Connetti il segnale <code>$Cooldown.timeout.connect(quando_scaduto)</code> e avvia il timer con <code>$Cooldown.start()</code>.</li>
                <li>Stampa: <code>print("Timer avviato per: ", $Cooldown.wait_time, "s")</code>.</li>
                <li>Definisci <code>func quando_scaduto():</code> che stampa <code>print("Tempo scaduto!")</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Configura $Cooldown (wait_time, one_shot), connetti timeout, avvia e stampa\n    pass\n\nfunc quando_scaduto():\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "I nodi `Timer` gestiscono il tempo nei giochi: conto alla rovescia, intervalli di spawn dei nemici o delay prima di un'azione."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Imposta la durata con la proprietà `.wait_time = secondi` e avvia il conteggio con il metodo `.start()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    var t = $Timer\n    t.wait_time = 2.5\n    t.start()\n```\nSenza chiamare `.start()`, il timer non comincerà a scorrere."
            }
],
        solution: `func _ready():\n    $Cooldown.wait_time = 2.5\n    $Cooldown.one_shot = true\n    $Cooldown.timeout.connect(quando_scaduto)\n    $Cooldown.start()\n    print("Timer avviato per: ", $Cooldown.wait_time, "s")\n\nfunc quando_scaduto():\n    print("Tempo scaduto!")\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const t = sc ? sc.get_node("Cooldown") : null;
    const tOk = t && t.type === "Timer" && t.wait_time === 2.5 && t.one_shot === true;
    tests.push({ desc: "Nodo Timer 'Cooldown' configurato (wait_time: 2.5, one_shot: true)", passed: !!tOk, diff: tOk ? null : "Imposta $Cooldown.wait_time = 2.5 e $Cooldown.one_shot = true." });
    const conn = t && t.timeout && t.timeout.callbacks && t.timeout.callbacks.length > 0;
    tests.push({ desc: "Segnale timeout connesso a quando_scaduto", passed: !!conn, diff: conn ? null : "Usa $Cooldown.timeout.connect(quando_scaduto)." });
    if (conn) t.timeout.emit();
    const out = (result.logs || []).join(' ').replace(/\s+/g, ' ');
    const outOk = out.includes("Tempo scaduto!");
    tests.push({ desc: "Callback quando_scaduto eseguita allo scatto del timer", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
    return tests;
}
    },
    {
        id: 58,
        chapterId: 15,
        isMastery: false,
        title: "58. Grafica e Forme: Il nodo ColorRect",
        icon: "🟩",
        xp: 60,
        expectedOutput: "Barra salute aggiornata con colore: #22c55e",
        initialNodes: [
            { type: "ColorRect", name: "BarraVita", color: "#64748b", size: { x: 50, y: 20 } }
        ],
        theory: `
            <p>Il nodo <strong>ColorRect</strong> disegna un rettangolo colorato a tinta unita nello spazio 2D, ideale per barre della salute, riquadri HUD o sfondi di gioco.</p>
            <p>I nodi ColorRect vengono posizionati visivamente nella Scena (puoi osservarli nella Viewport 2D a destra). In GDScript possiamo modificarne l'aspetto accedendovi con la sintassi <code>$BarraVita</code>:</p>
            <pre class="code-block"><span class="c"># Aggiorna il colore e la dimensione del rettangolo</span>
$BarraVita.color = <span class="s">"#22c55e"</span>
$BarraVita.size = Vector2(<span class="m">200</span>, <span class="m">20</span>)</pre>
        `,
        task: `
            <ul>
                <li>Nella scena è già presente il nodo <code>$BarraVita</code> (ColorRect visibile nella Viewport 2D).</li>
                <li>Imposta il colore verde: <code>$BarraVita.color = "#22c55e"</code>.</li>
                <li>Imposta le dimensioni a 200x20: <code>$BarraVita.size = Vector2(200, 20)</code>.</li>
                <li>Stampa a console: <code>print("Barra salute aggiornata con colore: ", $BarraVita.color)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Modifica $BarraVita (color e size) e stampa a console\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Quando un Timer conclude la sua durata, emette automaticamente il segnale `timeout`. Collegandoti a questo evento puoi far scattare qualsiasi logica temporizzata."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Connetti `$Timer.timeout.connect(_on_timer_timeout)` e fai partire il timer con `.start()`."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nfunc _ready():\n    $Timer.timeout.connect(_on_timeout)\n    $Timer.start()\n\nfunc _on_timeout():\n    print(\"Tempo scaduto!\")\n```\nIl callback viene eseguito non appena il countdown arriva a zero."
            }
],
        solution: `func _ready():\n    $BarraVita.color = "#22c55e"\n    $BarraVita.size = Vector2(200, 20)\n    print("Barra salute aggiornata con colore: ", $BarraVita.color)\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const b = sc ? sc.get_node("BarraVita") : null;
    const bOk = b && b.type === "ColorRect" && b.color === "#22c55e" && b.size && b.size.x === 200 && b.size.y === 20;
    tests.push({ desc: "ColorRect 'BarraVita' configurato con colore verde e size Vector2(200, 20)", passed: !!bOk, diff: bOk ? null : "Imposta $BarraVita.color = '#22c55e' e $BarraVita.size = Vector2(200, 20)." });
    return tests;
}
    },
    {
        id: 59,
        chapterId: 15,
        isMastery: false,
        title: "59. Ciclo di Vita: Eliminare Nodi con queue_free()",
        icon: "🗑️",
        xp: 60,
        expectedOutput: "Moneta presente prima: true\nMoneta eliminata con queue_free: true",
        initialNodes: [
            { type: "Node", name: "Moneta" }
        ],
        theory: `
            <p>Quando un nemico viene sconfitto, una moneta viene raccolta o un proiettile esce dallo schermo, il nodo deve essere rimosso dalla memoria per non sprecare risorse.</p>
            <p>In Godot Engine il metodo ufficiale per distruggere un nodo è <strong><code>nodo.queue_free()</code></strong>:</p>
            <pre class="code-block"><span class="c"># Elimina il nodo dalla scena e dalla memoria</span>
$Moneta.<span class="nb">queue_free</span>()</pre>
            <p>Il metodo <code>has_node("Moneta")</code> restituirà <code>false</code> una volta rimosso!</p>
        `,
        task: `
            <ul>
                <li>Nella scena è presente il nodo <code>$Moneta</code>.</li>
                <li>Stampa: <code>print("Moneta presente prima: ", has_node("Moneta"))</code>.</li>
                <li>Rimuovi la moneta con: <code>$Moneta.queue_free()</code>.</li>
                <li>Stampa la conferma: <code>print("Moneta eliminata con queue_free: ", not has_node("Moneta"))</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # Stampa has_node("Moneta"), chiama $Moneta.queue_free() e stampa conferma\n    pass\n`,
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "In Godot non si eliminano i nodi all'istante durante l'elaborazione di un frame, perché altri nodi potrebbero ancora star leggendo i loro dati. Si usa `queue_free()`, che pianifica la distruzione sicura del nodo a fine frame."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Chiama `$NomeNodo.queue_free()`. Il nodo verrà rimosso dall'albero della scena e la memoria liberata pulitamente."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nfunc _ready():\n    # Raccogli e distruggi l'oggetto moneta\n    $Moneta.queue_free()\n```\nInvocando `queue_free()`, il nodo cessa di esistere nella scena al termine del ciclo corrente."
            }
],
        solution: `func _ready():\n    print("Moneta presente prima: ", has_node("Moneta"))\n    $Moneta.queue_free()\n    print("Moneta eliminata con queue_free: ", not has_node("Moneta"))\n`,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const notHas = sc && !sc.has_node("Moneta");
    const cleanCode = stripCommentsAndStrings(result.code);
    const usesQueueFree = /\$Moneta\.queue_free\s*\(/.test(cleanCode);
    tests.push({ desc: "Metodo '$Moneta.queue_free()' invocato", passed: !!usesQueueFree, diff: usesQueueFree ? null : "Usa $Moneta.queue_free() per rimuovere il nodo dalla scena." });
    tests.push({ desc: "Nodo Moneta rimosso con successo dall'albero della scena", passed: !!notHas, diff: notHas ? null : "Il nodo Moneta risulta ancora presente." });
    return tests;
}
    },
    {
        id: 60,
        chapterId: 15,
        isMastery: true,
        title: "60. 🏆 Sfida di Apprendimento Finale: Il Negozio dell'Avventuriero",
        icon: "👑",
        xp: 200,
        difficulty: "avanzata",
        difficultyLabel: "Avanzata",
        initialNodes: [
            { type: "Label", name: "OroLabel", text: "Monete: 100" },
            { type: "Button", name: "CompraPozioneBtn", text: "Compra Pozione (-25 Oro)" },
            { type: "Label", name: "MessaggioLabel", text: "" }
        ],
        scenario: "L'armaiolo dell'accademia di Godot apre la bottega. Nella scena sono già presenti l'etichetta <code>$OroLabel</code> con 100 monete, il pulsante <code>$CompraPozioneBtn</code> e un'etichetta di avviso <code>$MessaggioLabel</code> inizialmente vuota. Sotto i commenti, programma la logica della bottega:",
        requirements: [
            'Crea la variabile contatore <code>var monete = 100</code>',
            'In <code>_ready()</code>, connetti <code>$CompraPozioneBtn.pressed.connect(compra_pozione)</code>',
            'Nella funzione <code>func compra_pozione():</code>',
            'Se <code>monete >= 25</code>: sottrai <code>monete -= 25</code>, aggiorna <code>$OroLabel.text = "Monete: " + str(monete)</code> e imposta <code>$MessaggioLabel.text = "Pozione Acquistata!"</code>',
            'Altrimenti: imposta <code>$MessaggioLabel.text = "Oro Insufficiente!"</code>',
            'Stampa a fine funzione: <code>print($MessaggioLabel.text)</code>'
        ],
        notice: "Non modificare la riga print() iniziale. Il programma stampa:",
        expectedOutput: "Bottega Aperta\nPozione Acquistata!",
        initialCode: `extends Node\n\nvar monete = 100\n\nfunc _ready():\n    # Connetti $CompraPozioneBtn sotto\n    \n    # Non modificare la riga sotto\n    print("Bottega Aperta")\n\n# Definisci func compra_pozione() sotto\n`,
        aiExplanation: "Congratulazioni per essere giunto al completamento del corso! Questo esercizio finale unisce tutti i pilastri di Godot Engine: nodi di controllo (Button, Label), segnali di interazione utente in tempo reale, variabili di stato e logica condizionale.",
        hints: [
            {
                        "level": 1,
                        "type": "concept",
                        "icon": "💭",
                        "label": "Indizio Concettuale",
                        "text": "Congratulazioni per essere arrivato alla Sfida Finale! Questa missione integra tutti i concetti appresi nel corso: albero dei nodi, segnali, temporizzazione, modifica delle proprietà e ciclo di vita."
            },
            {
                        "level": 2,
                        "type": "structure",
                        "icon": "🏗️",
                        "label": "Guida alla Struttura",
                        "text": "Connetti il timer, aggiorna lo stato dei nodi UI all'avvio, gestisci il timeout rimuovendo l'ostacolo con `queue_free()` e colorando l'interfaccia di vittoria."
            },
            {
                        "level": 3,
                        "type": "example",
                        "icon": "📝",
                        "label": "Esempio Pratico",
                        "text": "Esempio analogo:\n```gdscript\nextends Node\n\nfunc _ready():\n    $TimerPartita.timeout.connect(_on_fine_gioco)\n    $TimerPartita.start()\n    $Messaggio.text = \"Partita in corso...\"\n\nfunc _on_fine_gioco():\n    $Ostacolo.queue_free()\n    $Messaggio.text = \"Vittoria!\"\n```\nVerifica tutti i requisiti elencati nella scheda della sfida finale."
            }
],
        solution: `extends Node\n\nvar monete = 100\n\nfunc _ready():\n    $CompraPozioneBtn.pressed.connect(compra_pozione)\n    \n    # Non modificare la riga sotto\n    print("Bottega Aperta")\n\nfunc compra_pozione():\n    if monete >= 25:\n        monete -= 25\n        $OroLabel.text = "Monete: " + str(monete)\n        $MessaggioLabel.text = "Pozione Acquistata!"\n    else:\n        $MessaggioLabel.text = "Oro Insufficiente!"\n    print($MessaggioLabel.text)\n`,
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">👑 SFIDA FINALE DI ARCHITETTURA NODI • GODOT 4 HERO</span>
                <h3>Il Negozio dell'Avventuriero</h3>
                <p>La sfida conclusiva dei nodi: connetti UI, gestione del patrimonio, segnali di click e feedback visivo in tempo reale.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Connetti <code>$CompraPozioneBtn.pressed</code> a <code>compra_pozione</code></li>
                <li>Sottrai 25 oro se disponibile e aggiorna <code>$OroLabel.text</code></li>
                <li>Aggiorna <code>$MessaggioLabel.text</code> con esito dell'acquisto</li>
            </ul>
        `,
        validate: async (result) => {
    const tests = [];
    tests.push(formatExecutionCheck(result));
    const sc = result.scene;
    const btn = sc ? sc.get_node("CompraPozioneBtn") : null;
    const oLbl = sc ? sc.get_node("OroLabel") : null;
    const mLbl = sc ? sc.get_node("MessaggioLabel") : null;
    const conn = btn && btn.pressed && btn.pressed.callbacks && btn.pressed.callbacks.length > 0;
    tests.push({ desc: "Pulsante d'acquisto $CompraPozioneBtn connesso alla funzione compra_pozione", passed: !!conn, diff: conn ? null : "Connetti il pulsante a compra_pozione." });
    
    if (conn) {
        btn.pressed.emit(); // Acquisto 1: 100 -> 75
    }
    const buyOk = oLbl && oLbl.text === "Monete: 75" && mLbl && mLbl.text === "Pozione Acquistata!";
    tests.push({ desc: "Primo acquisto: monete scalate a 75 e messaggio 'Pozione Acquistata!'", passed: !!buyOk, diff: buyOk ? null : `Oro=${oLbl ? oLbl.text : 'null'}, Msg=${mLbl ? mLbl.text : 'null'}` });
    
    if (conn) {
        btn.pressed.emit(); // 50
        btn.pressed.emit(); // 25
        btn.pressed.emit(); // 0
        btn.pressed.emit(); // Tentativo con monete esaurite!
    }
    const emptyOk = oLbl && oLbl.text === "Monete: 0" && mLbl && mLbl.text === "Oro Insufficiente!";
    tests.push({ desc: "Gestione limite di spesa: blocco acquisto e messaggio 'Oro Insufficiente!' quando terminano le monete", passed: !!emptyOk, diff: emptyOk ? null : `Oro=${oLbl ? oLbl.text : 'null'}, Msg=${mLbl ? mLbl.text : 'null'}` });
    return tests;
}
    }
];

// Traguardi / Obiettivi sbloccabili
const ACHIEVEMENTS_DATA = [
    {
        id: "first_blood",
        title: "Primi Passi",
        icon: "🌱",
        desc: "Compila ed esegui il tuo primo script con print in Godot.",
        xpReward: 25,
        condition: (state) => state.finishedLessons.includes(1)
    },
    {
        id: "chapter_1_master",
        title: "Padrone dell'Introduzione",
        icon: "🏅",
        desc: "Supera la Sfida di Padronanza del Capitolo 1.",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(4)
    },
    {
        id: "var_master_1",
        title: "Iniziatore di Variabili",
        icon: "📦",
        desc: "Supera la Sfida di Padronanza del Capitolo 2 (Variabili Parte 1).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(8)
    },
    {
        id: "var_master_2",
        title: "Signore dei Tipi",
        icon: "🏷️",
        desc: "Supera la Sfida di Padronanza del Capitolo 3 (Variabili Parte 2 & Tipizzazione).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(12)
    },
    {
        id: "math_master",
        title: "Alchimista dei Numeri",
        icon: "⚔️",
        desc: "Supera la Sfida di Padronanza del Capitolo 4 (Operatori e Matematica).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(16)
    },
    {
        id: "logic_master",
        title: "Mago della Logica",
        icon: "🛡️",
        desc: "Supera la Sfida di Padronanza del Capitolo 5 (Condizioni e Logica).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(20)
    },
    {
        id: "array_master",
        title: "Signore degli Inventari",
        icon: "🎒",
        desc: "Supera la Sfida di Padronanza del Capitolo 6 (Array).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(24)
    },
    {
        id: "loops_master",
        title: "Dominatore dei Cicli",
        icon: "🔄",
        desc: "Supera la Sfida di Padronanza del Capitolo 7 (Cicli For e While).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(28)
    },
    {
        id: "func_master",
        title: "Ingegnere di Funzioni",
        icon: "⚙️",
        desc: "Supera la Sfida di Padronanza del Capitolo 8 (Funzioni e Nodi).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(32)
    },
    {
        id: "vector_legend",
        title: "Leggenda dei Vettori 2D",
        icon: "🚀",
        desc: "Completa la Sfida di Padronanza Finale del Capitolo 9 (Vettori e Movimento 2D).",
        xpReward: 100,
        condition: (state) => state.finishedLessons.includes(36)
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
        icon: "⚡",
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
    },
    {
        id: "dict_master",
        title: "Custode del Sapere",
        icon: "📖",
        desc: "Supera la Sfida di Apprendimento del Capitolo 10 (Dizionari).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(40)
    },
    {
        id: "signal_master",
        title: "Maestro delle Frequenze",
        icon: "📡",
        desc: "Supera la Sfida di Apprendimento del Capitolo 11 (Segnali di Godot).",
        xpReward: 50,
        condition: (state) => state.finishedLessons.includes(44)
    },
    {
        id: "oop_grandmaster",
        title: "Gran Maestro di Godot 4",
        icon: "👑",
        desc: "Supera la Sfida di Apprendimento Finale del Capitolo 12 (Classi e Oggetti).",
        xpReward: 150,
        condition: (state) => state.finishedLessons.includes(48)
    },
    {
        id: "tree_explorer",
        title: "Esploratore dell'Albero",
        icon: "🌳",
        desc: "Supera la Sfida di Apprendimento del Capitolo 13 (Scene Tree & Label).",
        xpReward: 60,
        condition: (state) => state.finishedLessons.includes(52)
    },
    {
        id: "ui_designer",
        title: "Architetto di Interfacce",
        icon: "🔘",
        desc: "Supera la Sfida di Apprendimento del Capitolo 14 (Button & Segnale pressed).",
        xpReward: 60,
        condition: (state) => state.finishedLessons.includes(56)
    },
    {
        id: "godot_architect",
        title: "Maestro delle Scene Godot",
        icon: "🏛️",
        desc: "Supera la Sfida di Apprendimento Finale del Capitolo 15 (Timer, UI & Ciclo di Vita).",
        xpReward: 200,
        condition: (state) => state.finishedLessons.includes(60)
    }
];

const LEVELS_CONFIG = [
    { level: 1, title: "Recluta Godot", minXp: 0, maxXp: 99 },
    { level: 2, title: "Apprendista Script", minXp: 100, maxXp: 249 },
    { level: 3, title: "Sviluppatore 2D", minXp: 250, maxXp: 449 },
    { level: 4, title: "Alchimista dei Tipi", minXp: 450, maxXp: 699 },
    { level: 5, title: "Mago della Logica", minXp: 700, maxXp: 999 },
    { level: 6, title: "Maestro degli Array", minXp: 1000, maxXp: 1399 },
    { level: 7, title: "Architetto di Cicli", minXp: 1400, maxXp: 1899 },
    { level: 8, title: "Ingegnere di Nodi", minXp: 1900, maxXp: 2499 },
    { level: 9, title: "Pilota dei Vettori", minXp: 2500, maxXp: 3199 },
    { level: 10, title: "Custode dei Dizionari", minXp: 3200, maxXp: 3999 },
    { level: 11, title: "Comandante di Segnali", minXp: 4000, maxXp: 4899 },
    { level: 12, title: "Architetto di Classi", minXp: 4900, maxXp: 5899 },
    { level: 13, title: "Pioniere della Scena", minXp: 5900, maxXp: 6999 },
    { level: 14, title: "Mastro d'Interfaccia", minXp: 7000, maxXp: 8199 },
    { level: 15, title: "Ingegnere di Godot 4", minXp: 8200, maxXp: 9499 },
    { level: 16, title: "Godot Hero Trascendente", minXp: 9500, maxXp: 99999 }
];

const STREAK_TIERS = {
    rilassato: { target: 2, label: "Rilassato", icon: "☕", desc: "2 giorni / settimana" },
    concentrato: { target: 4, label: "Concentrato", icon: "🎯", desc: "4 giorni / settimana" },
    lockin: { target: 6, label: "Lock in", icon: "⚡", desc: "6 giorni / settimana" }
};

const DAILY_QUESTS_CONFIG = [
    {
        id: "daily_exercise",
        title: "Studio Quotidiano",
        desc: "Completa con successo almeno 1 livello oggi",
        icon: "📖",
        target: 1,
        xpReward: 20
    },
    {
        id: "no_hints",
        title: "Mente Brillante",
        desc: "Supera un esercizio senza usare suggerimenti",
        icon: "🧠",
        target: 1,
        xpReward: 30
    },
    {
        id: "code_runs",
        title: "Sperimentatore",
        desc: "Esegui e testa il codice almeno 3 volte",
        icon: "🔬",
        target: 3,
        xpReward: 20
    }
];

const PROJECTS_DATA = [
    {
        id: "project_platformer",
        title: "Controller 2D: Movimento & Salto",
        icon: "🎮",
        badge: "IN SVILUPPO",
        badgeClass: "badge-wip",
        desc: "Crea il CharacterBody2D controller in GDScript: movimento orizzontale, gravità, salto variabile e attrito.",
        levelReq: "Capitolo 9 completato",
        estimatedTime: "45 min",
        topics: ["Vector2", "Input", "Fisica 2D", "Delta Time"]
    },
    {
        id: "project_inventory",
        title: "Gestore Inventario RPG a Slot",
        icon: "🎒",
        badge: "PROSSIMAMENTE",
        badgeClass: "badge-soon",
        desc: "Programma un sistema di inventario flessibile: aggiunta e rimozione oggetti, pozioni consumabili e limite di peso.",
        levelReq: "Capitolo 6 completato",
        estimatedTime: "30 min",
        topics: ["Array", "Dizionari", "Tipizzazione", "Eventi"]
    },
    {
        id: "project_turn_combat",
        title: "Arena di Combattimento a Turni",
        icon: "⚔️",
        badge: "IN DESIGN",
        badgeClass: "badge-design",
        desc: "Logica per battaglie in stile JRPG: attacchi normali, abilità magiche, calcolo critico e IA nemica.",
        levelReq: "Capitolo 5 completato",
        estimatedTime: "50 min",
        topics: ["If/Else", "Matematica", "Turni", "Stati"]
    }
];

// Esporta gli oggetti globalmente per accesso da console e test
window.CHAPTERS_DATA = CHAPTERS_DATA;
window.LESSONS_DATA = LESSONS_DATA;
window.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
window.LEVELS_CONFIG = LEVELS_CONFIG;
window.STREAK_TIERS = STREAK_TIERS;
window.DAILY_QUESTS_CONFIG = DAILY_QUESTS_CONFIG;
window.PROJECTS_DATA = PROJECTS_DATA;
