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
            "Sostituisci 'pass' con: print(\"Ciao Godot!\")",
            "Assicurati che la riga sia indentata con 4 spazi (oppure 1 tasto Tab)"
        ],
        solution: `func _ready():\n    print("Ciao Godot!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const hasPrinted = result.logs.some(l => l.includes("Ciao Godot!"));
            tests.push({ desc: "Console contiene 'Ciao Godot!'", passed: hasPrinted, diff: hasPrinted ? null : `Ricevuto: "${result.logs.join('\\n')}"` });
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
            "Scrivi: # Inizializzazione gioco",
            "Poi stampa: print(\"Benvenuto nel gioco\")"
        ],
        solution: `func _ready():\n    # Inizializzazione gioco\n    print("Benvenuto nel gioco")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const hasPrinted = result.logs.some(l => l.includes("Benvenuto nel gioco"));
            tests.push({ desc: "Console contiene 'Benvenuto nel gioco'", passed: hasPrinted, diff: hasPrinted ? null : `Ricevuto: "${result.logs.join('\\n')}"` });
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
            "print(\"Livello\")",
            "print(1)"
        ],
        solution: `func _ready():\n    print("Livello")\n    print(1)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Livello") && out.includes("1");
            tests.push({ desc: "Stampato 'Livello' e il numero 1", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "Inizia inserendo il cancelletto # seguito dal testo: # Diagnostica reattori",
            "Per la prima stampa scrivi: print(\"Sistema: Godot OS\")",
            "Per stampare più valori separati da virgola scrivi: print(\"Energia: \", 100, \"%\")"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const ok = clean.includes("=== AVVIO SISTEMA ===") && clean.includes("Sistema: Godot OS") && clean.includes("Energia: 100 %") && clean.includes("=== DIAGNOSTICA COMPLETATA ===");
            tests.push({ desc: "Diagnostica completata con output esatto", passed: ok, diff: ok ? null : `Ricevuto:\n${out}` });
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
            "var nome = \"Eroe\"",
            "print(nome)"
        ],
        solution: `func _ready():\n    var nome = "Eroe"\n    print(nome)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.scope["nome"] === "Eroe";
            tests.push({ desc: "Variabile 'nome' creata con valore 'Eroe'", passed: ok, diff: ok ? null : `Valore: ${result.scope["nome"]}` });
            const printed = result.logs.some(l => l.includes("Eroe"));
            tests.push({ desc: "Valore 'Eroe' stampato a console", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
            return tests;
        }
    },
    {
        id: 6,
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
        initialCode: `func _ready():\n    # Dichiara personaggio e punti_vita, poi stampale\n    pass\n`,
        hints: [
            "var personaggio = \"Guerriero\"",
            "var punti_vita = 100",
            "print(personaggio)",
            "print(punti_vita)"
        ],
        solution: `func _ready():\n    var personaggio = "Guerriero"\n    var punti_vita = 100\n    print(personaggio)\n    print(punti_vita)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const isStr = result.scope["personaggio"] === "Guerriero";
            const isInt = result.scope["punti_vita"] === 100;
            tests.push({ desc: "Variabili personaggio e punti_vita create", passed: isStr && isInt, diff: (isStr && isInt) ? null : "Valori non corrispondenti" });
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
            "var nome = \"Eroe\"",
            "var messaggio = \"Giocatore: \" + nome",
            "print(messaggio)"
        ],
        solution: `func _ready():\n    var nome = "Eroe"\n    var messaggio = "Giocatore: " + nome\n    print(messaggio)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const printed = result.logs.some(l => l.includes("Giocatore: Eroe"));
            tests.push({ desc: "Stringa concatenata 'Giocatore: Eroe' stampata", passed: printed, diff: printed ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "Dichiara ogni variabile usando la parola chiave var: var nome_variabile = ...",
            "Per racchiudere virgolette doppie all'interno puoi usare apici singoli: var title = 'The \"Lost\" Key'",
            "Il codice della porta deve essere racchiuso tra virgolette: var door_code = \"0420\""
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const titleOk = s.title === 'The "Lost" Key';
            const npcOk = s.npc_line === "It's dangerous to go alone!";
            const doorOk = s.door_code === "0420";
            tests.push({ desc: "Variabile 'title' con virgolette interne corretta", passed: titleOk, diff: titleOk ? null : `Ricevuto: ${s.title}` });
            tests.push({ desc: "Variabile 'npc_line' con apostrofo corretta", passed: npcOk, diff: npcOk ? null : `Ricevuto: ${s.npc_line}` });
            tests.push({ desc: "Variabile 'door_code' impostata a \"0420\"", passed: doorOk, diff: doorOk ? null : `Ricevuto: ${s.door_code}` });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const outOk = clean.includes('Title: The "Lost" Key') && clean.includes("NPC: It's dangerous to go alone!") && clean.includes("Door code: 0420");
            tests.push({ desc: "Output della console corrispondente", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            "var velocita = 4.5",
            "var ha_chiave = true",
            "print(velocita)",
            "print(ha_chiave)"
        ],
        solution: `func _ready():\n    var velocita = 4.5\n    var ha_chiave = true\n    print(velocita)\n    print(ha_chiave)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const isFloat = result.scope["velocita"] === 4.5;
            const isBool = result.scope["ha_chiave"] === true;
            tests.push({ desc: "Variabili float e bool create", passed: isFloat && isBool, diff: (isFloat && isBool) ? null : "Valori non validi" });
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
            "var vita: int = 100",
            "print(vita)"
        ],
        solution: `func _ready():\n    var vita: int = 100\n    print(vita)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.scope["vita"] === 100;
            tests.push({ desc: "Variabile tipizzata 'vita' creata con valore 100", passed: ok, diff: ok ? null : `Ricevuto: ${result.scope["vita"]}` });
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
            "const GRAVITA = 9.8",
            "print(GRAVITA)"
        ],
        solution: `func _ready():\n    const GRAVITA = 9.8\n    print(GRAVITA)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.scope["GRAVITA"] === 9.8;
            tests.push({ desc: "Costante GRAVITA impostata a 9.8", passed: ok, diff: ok ? null : `Valore: ${result.scope["GRAVITA"]}` });
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
            "Dichiara la costante in cima allo script: const MAX_HP: int = 200",
            "Dichiara le variabili specificando il tipo con i due punti: var eroe: String = \"Valerius\" e var salute: int = 150",
            "Per l'inferenza di tipo usa := senza scrivere il tipo a mano: var scudo_attivo := true"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const heroOk = s.eroe === "Valerius";
            const hpOk = s.salute === 150;
            const shieldOk = s.scudo_attivo === true;
            const maxHpOk = s.MAX_HP === 200;
            tests.push({ desc: "Costante MAX_HP: int = 200 dichiarata correttamente", passed: maxHpOk, diff: maxHpOk ? null : `Ricevuto: ${s.MAX_HP}` });
            tests.push({ desc: "Variabili tipizzate eroe e salute configurate", passed: heroOk && hpOk, diff: (heroOk && hpOk) ? null : `eroe=${s.eroe}, salute=${s.salute}` });
            tests.push({ desc: "Variabile scudo_attivo impostata a true con inferenza", passed: shieldOk, diff: shieldOk ? null : `Ricevuto: ${s.scudo_attivo}` });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const outOk = clean.includes("Eroe: Valerius") && clean.includes("HP: 150 / 200") && clean.includes("Scudo: true");
            tests.push({ desc: "Output scheda eroe stampato con precisione", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            "var somma = 10 + 5",
            "var prodotto = 5 * 2",
            "print(somma)",
            "print(prodotto)"
        ],
        solution: `func _ready():\n    var somma = 10 + 5\n    var prodotto = 5 * 2\n    print(somma)\n    print(prodotto)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope["somma"] === 15;
            const p = result.scope["prodotto"] === 10;
            tests.push({ desc: "Somma (15) e Prodotto (10) calcolati", passed: s && p, diff: (s && p) ? null : "Calcoli non corretti" });
            return tests;
        }
    },
    {
        id: 14,
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
        initialCode: `func _ready():\n    var punti_vita = 100\n    # Sottrai 20 con -= e stampa\n    pass\n`,
        hints: [
            "punti_vita -= 20",
            "print(punti_vita)"
        ],
        solution: `func _ready():\n    var punti_vita = 100\n    punti_vita -= 20\n    print(punti_vita)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.scope["punti_vita"] === 80;
            tests.push({ desc: "punti_vita aggiornati a 80", passed: ok, diff: ok ? null : `Risultato: ${result.scope["punti_vita"]}` });
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
            "var monete_base = 50",
            "var moltiplicatore = 3",
            "var monete_totali = monete_base * moltiplicatore",
            "print(monete_totali)"
        ],
        solution: `func _ready():\n    var monete_base = 50\n    var moltiplicatore = 3\n    var monete_totali = monete_base * moltiplicatore\n    print(monete_totali)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.scope["monete_totali"] === 150;
            tests.push({ desc: "Monete totali calcolate a 150", passed: ok, diff: ok ? null : `Risultato: ${result.scope["monete_totali"]}` });
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
            "Per sottrarre il danno scrivi: salute_rimasta -= 35",
            "Per la divisione usa lo slash: var monete_per_membro = 100 / 3",
            "Per il resto della divisione usa il modulo %: var monete_avanzate = 100 % 3"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const hpOk = s.salute_rimasta === 65;
            const coinsOk = Math.floor(Number(s.monete_per_membro)) === 33;
            const restOk = s.monete_avanzate === 1;
            tests.push({ desc: "Salute rimasta aggiornata con -= a 65", passed: hpOk, diff: hpOk ? null : `Ricevuto: ${s.salute_rimasta}` });
            tests.push({ desc: "Monete per membro calcolate a 33", passed: coinsOk, diff: coinsOk ? null : `Ricevuto: ${s.monete_per_membro}` });
            tests.push({ desc: "Monete avanzate calcolate con % a 1", passed: restOk, diff: restOk ? null : `Ricevuto: ${s.monete_avanzate}` });
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
            "if livello >= 10:",
            "    print(\"Livello raggiunto!\")"
        ],
        solution: `func _ready():\n    var livello = 10\n    if livello >= 10:\n        print("Livello raggiunto!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Livello raggiunto!"));
            tests.push({ desc: "Condizione verificata con successo", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "if ha_chiave and porta_chiusa:",
            "    print(\"Accesso consentito\")"
        ],
        solution: `func _ready():\n    var ha_chiave = true\n    var porta_chiusa = true\n    if ha_chiave and porta_chiusa:\n        print("Accesso consentito")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Accesso consentito"));
            tests.push({ desc: "Condizione con 'and' verificata", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
            return tests;
        }
    },
    {
        id: 19,
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
        initialCode: `func _ready():\n    var punti_vita = 0\n    # Scrivi il controllo Game Over\n    pass\n`,
        hints: [
            "if punti_vita <= 0:",
            "    print(\"Game Over\")",
            "else:",
            "    print(\"In battaglia\")"
        ],
        solution: `func _ready():\n    var punti_vita = 0\n    if punti_vita <= 0:\n        print("Game Over")\n    else:\n        print("In battaglia")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Game Over"));
            tests.push({ desc: "Game Over stampato correttamente", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "Inizia con: if energia >= 50 and (ha_amuleto or ha_chiave):",
            "Nel ramo elif controlla l'energia: elif energia < 50: stato_portale = \"Energia Insufficiente\"",
            "Chiudi con else: stato_portale = \"Nessuna Reliquia Trovata\""
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const stateOk = s.stato_portale === "Portale Attivato";
            tests.push({ desc: "Stato portale impostato a 'Portale Attivato'", passed: stateOk, diff: stateOk ? null : `Ricevuto: "${s.stato_portale}"` });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const outOk = clean.includes("Stato: Portale Attivato");
            tests.push({ desc: "Messaggio stampato a console correttamente", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            "var inventario = [\"Spada\", \"Scudo\", \"Pozione\"]",
            "print(inventario[0])"
        ],
        solution: `func _ready():\n    var inventario = ["Spada", "Scudo", "Pozione"]\n    print(inventario[0])\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Spada"));
            tests.push({ desc: "Primo oggetto dell'inventario stampato ('Spada')", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
            return tests;
        }
    },
    {
        id: 22,
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
        initialCode: `func _ready():\n    var oggetti = ["Spada", "Scudo", "Pozione"]\n    # Stampa il secondo e il terzo elemento\n    pass\n`,
        hints: [
            "print(oggetti[1])",
            "print(oggetti[2])"
        ],
        solution: `func _ready():\n    var oggetti = ["Spada", "Scudo", "Pozione"]\n    print(oggetti[1])\n    print(oggetti[2])\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Scudo") && out.includes("Pozione");
            tests.push({ desc: "Indici 1 e 2 stampati con successo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "inventario.append(\"Torcia\")",
            "print(inventario.size())"
        ],
        solution: `func _ready():\n    var inventario = ["Mappa", "Bussola"]\n    inventario.append("Torcia")\n    print(inventario.size())\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.trim() === "3");
            tests.push({ desc: "Dimensione dell'inventario aggiornata a 3", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "Usa zaino.append(\"Arco Elfico\") per inserire il nuovo arco",
            "Usa zaino.erase(\"Ramo Secco\") per togliere l'oggetto inutile",
            "Crea le due variabili: var ha_cura = zaino.has(\"Pozione di Vita\") e var totale_slot = zaino.size()"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const inv = s.zaino || [];
            const hasBow = inv.includes("Arco Elfico");
            const noStick = !inv.includes("Ramo Secco");
            const cureOk = s.ha_cura === true;
            const sizeOk = s.totale_slot === 3 && inv.length === 3;
            tests.push({ desc: "Arco Elfico aggiunto e Ramo Secco rimosso", passed: hasBow && noStick, diff: (hasBow && noStick) ? null : `Zaino: ${JSON.stringify(inv)}` });
            tests.push({ desc: "Controllo ha_cura valido (true)", passed: cureOk, diff: cureOk ? null : `Ricevuto: ${s.ha_cura}` });
            tests.push({ desc: "Totale slot calcolato a 3", passed: sizeOk, diff: sizeOk ? null : `Ricevuto: ${s.totale_slot}` });
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
            "for i in range(3):",
            "    print(i)"
        ],
        solution: `func _ready():\n    for i in range(3):\n        print(i)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("0") && out.includes("1") && out.includes("2");
            tests.push({ desc: "Numeri da 0 a 2 stampati dal ciclo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "for nemico in nemici:",
            "    print(nemico)"
        ],
        solution: `func _ready():\n    var nemici = ["Goblin", "Orco", "Drago"]\n    for nemico in nemici:\n        print(nemico)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Goblin") && out.includes("Orco") && out.includes("Drago");
            tests.push({ desc: "Tutti i nemici stampati dal ciclo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
            return tests;
        }
    },
    {
        id: 27,
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
        initialCode: `func _ready():\n    var conto = 1\n    # Scrivi il ciclo while\n    pass\n`,
        hints: [
            "while conto <= 3:",
            "    print(\"Conto: \" + str(conto))",
            "    conto += 1"
        ],
        solution: `func _ready():\n    var conto = 1\n    while conto <= 3:\n        print("Conto: " + str(conto))\n        conto += 1\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Conto: 1") && out.includes("Conto: 2") && out.includes("Conto: 3");
            tests.push({ desc: "Conteggio da 1 a 3 stampato correttamente", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "Inizia con la dichiarazione del ciclo: for nemico in nemici:",
            "Indenta di 4 spazi le due righe all'interno del blocco for",
            "Dentro il ciclo scrivi: print(\"Allerta: \" + nemico) e xp_totali += 25"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const xpOk = s.xp_totali === 100;
            tests.push({ desc: "XP Totali accumulati a 100 (4 x 25)", passed: xpOk, diff: xpOk ? null : `Ricevuto: ${s.xp_totali}` });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const logsOk = clean.includes("Allerta: Slime") && clean.includes("Allerta: Scheletro") && clean.includes("Allerta: Spettro") && clean.includes("Allerta: Boss Drago");
            tests.push({ desc: "Tutte le 4 allerte dei nemici stampate", passed: logsOk, diff: logsOk ? null : `Ricevuto:\n${out}` });
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
            "print(\"Nodo Inizializzato\")"
        ],
        solution: `func _ready():\n    print("Nodo Inizializzato")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Nodo Inizializzato"));
            tests.push({ desc: "Messaggio 'Nodo Inizializzato' stampato", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "Dentro func saluta(nome): print(\"Ciao \" + nome)",
            "Dentro func _ready(): saluta(\"Eroe\")"
        ],
        solution: `func saluta(nome):\n    print("Ciao " + nome)\n\nfunc _ready():\n    saluta("Eroe")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Ciao Eroe"));
            tests.push({ desc: "Funzione richiamata con parametro corretto ('Ciao Eroe')", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "func calcola_danno(attacco, difesa): return attacco - difesa",
            "In _ready(): var danno = calcola_danno(30, 5); print(danno)"
        ],
        solution: `func calcola_danno(attacco, difesa):\n    return attacco - difesa\n\nfunc _ready():\n    var danno = calcola_danno(30, 5)\n    print(danno)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.trim() === "25");
            tests.push({ desc: "Valore di ritorno (25) calcolato e stampato", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
            "Inizia la funzione con: func calcola_colpo(attacco: int, critico: bool) -> int:",
            "Verifica la condizione booleana: if critico: return attacco * 2",
            "Nel ramo else scrivi: else: return attacco"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const ok = clean.includes("Colpo normale: 30") && clean.includes("Colpo critico: 60");
            tests.push({ desc: "Colpo normale (30) e colpo critico (60) calcolati con successo", passed: ok, diff: ok ? null : `Ricevuto:\n${out}` });
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
            "var posizione = Vector2(100, 200)",
            "print(posizione)"
        ],
        solution: `func _ready():\n    var posizione = Vector2(100, 200)\n    print(posizione)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const p = result.scope["posizione"];
            const ok = p && p.x === 100 && p.y === 200;
            tests.push({ desc: "Vector2(100, 200) creato correttamente", passed: ok, diff: ok ? null : "Valore non corrispondente" });
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
            "var posizione = Vector2(100, 200)",
            "var velocita = 50",
            "posizione.x += velocita",
            "print(posizione)"
        ],
        solution: `func _ready():\n    var posizione = Vector2(100, 200)\n    var velocita = 50\n    posizione.x += velocita\n    print(posizione)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const p = result.scope["posizione"];
            const ok = p && p.x === 150 && p.y === 200;
            tests.push({ desc: "Coordinata X aumentata a 150", passed: ok, diff: ok ? null : "Posizione errata" });
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
            "var pos = Vector2(100, 200)",
            "pos.x += 20",
            "pos.y -= 20",
            "print(pos)"
        ],
        solution: `func _ready():\n    var pos = Vector2(100, 200)\n    pos.x += 20\n    pos.y -= 20\n    print(pos)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const p = result.scope["pos"];
            const ok = p && p.x === 120 && p.y === 180;
            tests.push({ desc: "Vettore aggiornato a Vector2(120, 180)", passed: ok, diff: ok ? null : "Posizione non corretta" });
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
            "Inizializza il vettore: var posizione = Vector2(100, 200)",
            "Aggiorna i due assi: posizione.x += 50 e posizione.y -= 30",
            "Crea la stazione e confronta: var stazione = Vector2(150, 170) e var atterrato: bool = (posizione.x == stazione.x and posizione.y == stazione.y)"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const pos = s.posizione;
            const posOk = pos && Number(pos.x) === 150 && Number(pos.y) === 170;
            const landOk = s.atterrato === true;
            tests.push({ desc: "Posizione finale calcolata a Vector2(150, 170)", passed: posOk, diff: posOk ? null : `Ricevuto: ${pos}` });
            tests.push({ desc: "Atterraggio riuscito con successo (true)", passed: landOk, diff: landOk ? null : `Ricevuto: ${s.atterrato}` });
            const out = (result.logs || []).join('\n');
            const clean = out.replace(/\s+/g, ' ');
            const outOk = clean.includes("Posizione finale: Vector2(150, 170)") && clean.includes("Stazione raggiunta: true");
            tests.push({ desc: "Output della missione stampato con successo", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            'var eroe = { "classe": "Guerriero", "livello": 10 }',
            'print("Classe: ", eroe["classe"])',
            'print("Livello: ", eroe["livello"])'
        ],
        solution: `func _ready():\n    var eroe = { "classe": "Guerriero", "livello": 10 }\n    print("Classe: ", eroe["classe"])\n    print("Livello: ", eroe["livello"])\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const d = s.eroe || {};
            const heroOk = d["classe"] === "Guerriero" && Number(d["livello"]) === 10;
            tests.push({ desc: "Dizionario eroe creato con chiavi classe e livello", passed: heroOk, diff: heroOk ? null : `Ricevuto: ${JSON.stringify(d)}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Classe: Guerriero") && out.includes("Livello: 10");
            tests.push({ desc: "Classe e livello stampati correttamente", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
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
            'equip["armatura"] = "Scudo"',
            'equip["arma"] = "Spada Laser"',
            'print("Arma: ", equip["arma"]) e print("Armatura: ", equip["armatura"])'
        ],
        solution: `func _ready():\n    var equip = { "arma": "Spada" }\n    equip["armatura"] = "Scudo"\n    equip["arma"] = "Spada Laser"\n    print("Arma: ", equip["arma"])\n    print("Armatura: ", equip["armatura"])\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const eq = s.equip || {};
            const modOk = eq["arma"] === "Spada Laser" && eq["armatura"] === "Scudo";
            tests.push({ desc: "Chiavi aggiornate correttamente (arma e armatura)", passed: modOk, diff: modOk ? null : `Equip: ${JSON.stringify(eq)}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Arma: Spada Laser") && out.includes("Armatura: Scudo");
            tests.push({ desc: "Output della console esatto", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
            return tests;
        }
    },
    {
        id: 39,
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
        initialCode: `func _ready():\n    var forziere = { "oro": 100, "gemme": 3 }\n    # Verifica la presenza con .has() e stampa sotto\n    pass\n`,
        hints: [
            'var ha_oro = forziere.has("oro")',
            'var ha_chiave = forziere.has("chiave")',
            'print("Possiede oro: ", ha_oro) e print("Possiede chiave: ", ha_chiave)'
        ],
        solution: `func _ready():\n    var forziere = { "oro": 100, "gemme": 3 }\n    var ha_oro = forziere.has("oro")\n    var ha_chiave = forziere.has("chiave")\n    print("Possiede oro: ", ha_oro)\n    print("Possiede chiave: ", ha_chiave)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const goldOk = s.ha_oro === true;
            const keyOk = s.ha_chiave === false;
            tests.push({ desc: "Verifica ha_oro (true) e ha_chiave (false)", passed: goldOk && keyOk, diff: (goldOk && keyOk) ? null : `ha_oro=${s.ha_oro}, ha_chiave=${s.ha_chiave}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Possiede oro: true") && out.includes("Possiede chiave: false");
            tests.push({ desc: "Output della console stampato con precisione", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
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
            'Inizializza: var boss = { "nome": "Drago Antico", "hp": 500 }',
            'Aggiungi e modifica con le quadre: boss["attacco"] = 75 e boss["hp"] = 420',
            'Usa il metodo has per la furia: var in_furia = boss.has("furia")'
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const b = s.boss || {};
            const bossOk = b["nome"] === "Drago Antico" && Number(b["hp"]) === 420 && Number(b["attacco"]) === 75;
            const furyOk = s.in_furia === false;
            tests.push({ desc: "Dizionario del boss aggiornato (hp: 420, attacco: 75)", passed: bossOk, diff: bossOk ? null : `Boss: ${JSON.stringify(b)}` });
            tests.push({ desc: "Verifica stato furia con .has() corretta (false)", passed: furyOk, diff: furyOk ? null : `in_furia=${s.in_furia}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Boss: Drago Antico") && out.includes("HP rimanenti: 420") && out.includes("Attacco: 75") && out.includes("Furia attiva: false");
            tests.push({ desc: "Report di combattimento stampato con successo", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            "Dichiara: signal porta_aperta",
            "In _ready() scrivi: porta_aperta.emit()",
            "Il metodo .emit() avviserà automaticamente la funzione connessa"
        ],
        solution: `extends Node\n\nsignal porta_aperta\n\nfunc _ready():\n    porta_aperta.connect(quando_aperta)\n    print("Apertura in corso...")\n    porta_aperta.emit()\n\nfunc quando_aperta():\n    print("Porta aperta con successo!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const ok = out.includes("Apertura in corso...") && out.includes("Porta aperta con successo!");
            tests.push({ desc: "Segnale porta_aperta dichiarato ed emesso con successo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "Usa moneta_raccolta.connect(aggiungi_punti)",
            "Poi chiama moneta_raccolta.emit()",
            "Non mettere le parentesi tonde dentro connect()"
        ],
        solution: `extends Node\n\nsignal moneta_raccolta\n\nfunc _ready():\n    moneta_raccolta.connect(aggiungi_punti)\n    moneta_raccolta.emit()\n\nfunc aggiungi_punti():\n    print("+10 Monete raccolte!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const ok = out.includes("+10 Monete raccolte!");
            tests.push({ desc: "Segnale moneta_raccolta connesso ed intercettato", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "signal danno_inflitto(valore)",
            "danno_inflitto.emit(35)",
            "Il valore 35 viene ricevuto dal parametro v di on_danno"
        ],
        solution: `extends Node\n\nsignal danno_inflitto(valore)\n\nfunc _ready():\n    danno_inflitto.connect(on_danno)\n    danno_inflitto.emit(35)\n\nfunc on_danno(v):\n    print("Danno registrato: ", v)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const ok = out.includes("Danno registrato: 35");
            tests.push({ desc: "Segnale con parametro valore 35 ricevuto con successo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            "In cima dichiara: signal salute_aggiornata(nuova_salute)",
            "Definisci la funzione: func quando_salute_cambia(hp): print(\"UI: Barra salute a \", hp)",
            "In _ready() connetti ed emetti: salute_aggiornata.connect(quando_salute_cambia) poi salute_aggiornata.emit(75) e salute_aggiornata.emit(40)"
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const ok = out.includes("UI: Barra salute a 75") && out.includes("UI: Barra salute a 40") && out.includes("=== EVENTI BATTAGLIA COMPLETATI ===");
            tests.push({ desc: "Due eventi di salute emessi ed intercettati dalla UI", passed: ok, diff: ok ? null : `Ricevuto:\n${out}` });
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
            "class Pozione:\n    var nome\n    var cura\n    func _init(n, c):\n        self.nome = n\n        self.cura = c",
            "var elisir = Pozione.new(\"Elisir\", 50)",
            "print(\"Pozione creata: \", elisir.nome, \" (Cura: \", elisir.cura, \")\")"
        ],
        solution: `extends Node\n\nclass Pozione:\n    var nome\n    var cura\n    func _init(n, c):\n        self.nome = n\n        self.cura = c\n\nfunc _ready():\n    var elisir = Pozione.new("Elisir", 50)\n    print("Pozione creata: ", elisir.nome, " (Cura: ", elisir.cura, ")")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const item = s.elisir;
            const itemOk = item && item.nome === "Elisir" && Number(item.cura) === 50;
            tests.push({ desc: "Istanza elisir creata correttamente con classe Pozione", passed: itemOk, diff: itemOk ? null : `Ricevuto: ${JSON.stringify(item)}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Pozione creata: Elisir (Cura: 50)");
            tests.push({ desc: "Output della console stampato con precisione", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
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
            'var g1 = Guerriero.new("Arthur", 100)',
            'var g2 = Guerriero.new("Lancelot", 90)',
            'print("Eroe 1: ", g1.nome, " (HP: ", g1.hp, ")") e print("Eroe 2: ", g2.nome, " (HP: ", g2.hp, ")")'
        ],
        solution: `extends Node\n\nclass Guerriero:\n    var nome\n    var hp\n    func _init(n, h):\n        self.nome = n\n        self.hp = h\n\nfunc _ready():\n    var g1 = Guerriero.new("Arthur", 100)\n    var g2 = Guerriero.new("Lancelot", 90)\n    print("Eroe 1: ", g1.nome, " (HP: ", g1.hp, ")")\n    print("Eroe 2: ", g2.nome, " (HP: ", g2.hp, ")")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const g1Ok = s.g1 && s.g1.nome === "Arthur" && Number(s.g1.hp) === 100;
            const g2Ok = s.g2 && s.g2.nome === "Lancelot" && Number(s.g2.hp) === 90;
            tests.push({ desc: "Istanze indipendenti g1 e g2 create correttamente", passed: g1Ok && g2Ok, diff: (g1Ok && g2Ok) ? null : "Dati guerrieri errati" });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Eroe 1: Arthur (HP: 100)") && out.includes("Eroe 2: Lancelot (HP: 90)");
            tests.push({ desc: "Stato dei due guerrieri stampato correttamente", passed: outOk, diff: outOk ? null : `Ricevuto: "${out}"` });
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
            "func colpo_caricato():\n    return self.attacco * 2",
            'var eroe = Personaggio.new("Eroe", 25)',
            'print("Danno colpo caricato: ", eroe.colpo_caricato())'
        ],
        solution: `extends Node\n\nclass Personaggio:\n    var nome\n    var attacco\n    func _init(n, a):\n        self.nome = n\n        self.attacco = a\n    func colpo_caricato():\n        return self.attacco * 2\n\nfunc _ready():\n    var eroe = Personaggio.new("Eroe", 25)\n    print("Danno colpo caricato: ", eroe.colpo_caricato())\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const ok = out.includes("Danno colpo caricato: 50");
            tests.push({ desc: "Metodo colpo_caricato() eseguito con successo (25 x 2 = 50)", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
            'class Avventuriero:\n    var nome\n    var ruolo\n    var vita\n    func _init(n, r, v):\n        self.nome = n\n        self.ruolo = r\n        self.vita = v',
            'var membro1 = Avventuriero.new("Aria", "Maga", 80)\nvar membro2 = Avventuriero.new("Krag", "Guerriero", 120)',
            'var vita_totale = membro1.vita + membro2.vita'
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const s = result.scope || {};
            const m1 = s.membro1;
            const m2 = s.membro2;
            const m1Ok = m1 && m1.nome === "Aria" && m1.ruolo === "Maga" && Number(m1.vita) === 80;
            const m2Ok = m2 && m2.nome === "Krag" && m2.ruolo === "Guerriero" && Number(m2.vita) === 120;
            const totOk = Number(s.vita_totale) === 200;
            tests.push({ desc: "Entrambi gli avventurieri istanziati correttamente", passed: m1Ok && m2Ok, diff: (m1Ok && m2Ok) ? null : "Dati membri party non corretti" });
            tests.push({ desc: "Salute totale del party calcolata a 200 HP", passed: totOk, diff: totOk ? null : `vita_totale=${s.vita_totale}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Membro 1: Aria (Maga)") && out.includes("Membro 2: Krag (Guerriero)") && out.includes("Salute totale party: 200");
            tests.push({ desc: "Report finale del party stampato con successo", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$Giocatore.name restituisce il nome del nodo ("Giocatore")',
            'print("Nodo rilevato: ", $Giocatore.name)'
        ],
        solution: `func _ready():\n    print("Nodo rilevato: ", $Giocatore.name)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const nodeOk = sc && sc.has_node("Giocatore");
            tests.push({ desc: "Nodo 'Giocatore' presente nell'albero della scena", passed: !!nodeOk, diff: nodeOk ? null : "Nodo Giocatore non presente nella scena" });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Nodo rilevato: Giocatore");
            tests.push({ desc: "Console stampa 'Nodo rilevato: Giocatore'", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$Titolo.text = "Benvenuto in Godot 4!"',
            'print("Testo a schermo: ", $Titolo.text)'
        ],
        solution: `func _ready():\n    $Titolo.text = "Benvenuto in Godot 4!"\n    print("Testo a schermo: ", $Titolo.text)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const node = sc ? sc.get_node("Titolo") : null;
            const labelOk = node && node.text === "Benvenuto in Godot 4!";
            tests.push({ desc: "Nodo Label 'Titolo' configurato con il testo 'Benvenuto in Godot 4!'", passed: !!labelOk, diff: labelOk ? null : `Ricevuto: ${node ? node.text : 'Nodo non trovato'}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Testo a schermo: Benvenuto in Godot 4!");
            tests.push({ desc: "Console stampa 'Testo a schermo: Benvenuto in Godot 4!'", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$SaluteLabel.text = "HP: 75"',
            'print("Nuova salute: ", $SaluteLabel.text)'
        ],
        solution: `func _ready():\n    $SaluteLabel.text = "HP: 75"\n    print("Nuova salute: ", $SaluteLabel.text)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const node = sc ? sc.get_node("SaluteLabel") : null;
            const ok = node && node.text === "HP: 75";
            tests.push({ desc: "SaluteLabel aggiornata con successo a 'HP: 75' tramite $", passed: !!ok, diff: ok ? null : `Ricevuto: ${node ? node.text : 'null'}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Nuova salute: HP: 75");
            tests.push({ desc: "Console stampa 'Nuova salute: HP: 75'", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$TitoloDungeon.text = "Caverna dei Goblin"',
            '$LivelloLabel.text = "Livello: 1"',
            '$MoneteLabel.text = "Oro: 50"'
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const tOk = sc && sc.get_node("TitoloDungeon") && sc.get_node("TitoloDungeon").text === "Caverna dei Goblin";
            const lOk = sc && sc.get_node("LivelloLabel") && sc.get_node("LivelloLabel").text === "Livello: 1";
            const mOk = sc && sc.get_node("MoneteLabel") && sc.get_node("MoneteLabel").text === "Oro: 50";
            tests.push({ desc: "TitoloDungeon e LivelloLabel configurati correttamente", passed: !!(tOk && lOk), diff: (tOk && lOk) ? null : "Proprietà delle Label non corrette" });
            tests.push({ desc: "MoneteLabel configurata con 'Oro: 50'", passed: !!mOk, diff: mOk ? null : "MoneteLabel non trovata o testo errato" });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Dungeon: Caverna dei Goblin") && out.includes("Difficolta: Livello: 1") && out.includes("Bottino: Oro: 50");
            tests.push({ desc: "Report del dungeon stampato correttamente a console", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$AttaccaBtn.text = "Sferra Attacco"',
            'print("Pulsante configurato: ", $AttaccaBtn.text)'
        ],
        solution: `func _ready():\n    $AttaccaBtn.text = "Sferra Attacco"\n    print("Pulsante configurato: ", $AttaccaBtn.text)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const btn = sc ? sc.get_node("AttaccaBtn") : null;
            const btnOk = btn && btn.type === "Button" && btn.text === "Sferra Attacco";
            tests.push({ desc: "Nodo Button 'AttaccaBtn' configurato con testo 'Sferra Attacco'", passed: !!btnOk, diff: btnOk ? null : `Ricevuto: ${btn ? btn.text : 'Nodo non trovato'}` });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Pulsante configurato: Sferra Attacco");
            tests.push({ desc: "Console stampa 'Pulsante configurato: Sferra Attacco'", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$AttaccaBtn.pressed.connect(quando_premuto)',
            'print("Pulsante connesso")',
            'func quando_premuto():\n    print("Colpo sferrato con successo!")'
        ],
        solution: `func _ready():\n    $AttaccaBtn.pressed.connect(quando_premuto)\n    print("Pulsante connesso")\n\nfunc quando_premuto():\n    print("Colpo sferrato con successo!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const btn = sc ? sc.get_node("AttaccaBtn") : null;
            const connected = btn && btn.pressed && btn.pressed.callbacks.length > 0;
            tests.push({ desc: "Segnale $AttaccaBtn.pressed connesso a una funzione", passed: !!connected, diff: connected ? null : "Segnale pressed non connesso" });
            if (connected) {
                btn.pressed.emit();
            }
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Colpo sferrato con successo!");
            tests.push({ desc: "Callback eseguita con successo al click sul pulsante", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$ClickBtn.pressed.connect(al_click)',
            'punti += 1\n$PuntiLabel.text = "Click: " + str(punti)',
            'print($PuntiLabel.text)'
        ],
        solution: `var punti = 0\n\nfunc _ready():\n    $ClickBtn.pressed.connect(al_click)\n    print("Clicker pronto")\n\nfunc al_click():\n    punti += 1\n    $PuntiLabel.text = "Click: " + str(punti)\n    print($PuntiLabel.text)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const btn = sc ? sc.get_node("ClickBtn") : null;
            const lbl = sc ? sc.get_node("PuntiLabel") : null;
            const connected = btn && btn.pressed && btn.pressed.callbacks.length > 0;
            tests.push({ desc: "Pulsante $ClickBtn connesso alla funzione al_click", passed: !!connected, diff: connected ? null : "Segnale pressed non connesso" });
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
            '$MotoriBtn.pressed.connect(attiva_motori)\n$AllarmeBtn.pressed.connect(attiva_allarme)',
            'func attiva_motori():\n    $StatoNave.text = "Motori a Massima Potenza"\n    print("Velocita Aumentata")',
            'func attiva_allarme():\n    $StatoNave.text = "Allarme Rosso Attivo"\n    print("Scudi al 100%")'
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const mBtn = sc ? sc.get_node("MotoriBtn") : null;
            const aBtn = sc ? sc.get_node("AllarmeBtn") : null;
            const sLbl = sc ? sc.get_node("StatoNave") : null;
            const mConn = mBtn && mBtn.pressed.callbacks.length > 0;
            const aConn = aBtn && aBtn.pressed.callbacks.length > 0;
            tests.push({ desc: "Entrambi i pulsanti $MotoriBtn e $AllarmeBtn connessi con successo", passed: !!(mConn && aConn), diff: (mConn && aConn) ? null : "Uno o entrambi i pulsanti non connessi" });
            if (mConn) mBtn.pressed.emit();
            const motOk = sLbl && sLbl.text === "Motori a Massima Potenza";
            tests.push({ desc: "Click su MotoriBtn imposta 'Motori a Massima Potenza'", passed: !!motOk, diff: motOk ? null : `Ricevuto: ${sLbl ? sLbl.text : 'null'}` });
            if (aConn) aBtn.pressed.emit();
            const almOk = sLbl && sLbl.text === "Allarme Rosso Attivo";
            tests.push({ desc: "Click su AllarmeBtn imposta 'Allarme Rosso Attivo'", passed: !!almOk, diff: almOk ? null : `Ricevuto: ${sLbl ? sLbl.text : 'null'}` });
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
            '$Cooldown.wait_time = 2.5\n$Cooldown.one_shot = true',
            '$Cooldown.timeout.connect(quando_scaduto)\n$Cooldown.start()',
            'print("Timer avviato per: ", $Cooldown.wait_time, "s")'
        ],
        solution: `func _ready():\n    $Cooldown.wait_time = 2.5\n    $Cooldown.one_shot = true\n    $Cooldown.timeout.connect(quando_scaduto)\n    $Cooldown.start()\n    print("Timer avviato per: ", $Cooldown.wait_time, "s")\n\nfunc quando_scaduto():\n    print("Tempo scaduto!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const t = sc ? sc.get_node("Cooldown") : null;
            const tOk = t && t.type === "Timer" && t.wait_time === 2.5 && t.one_shot === true;
            tests.push({ desc: "Nodo Timer 'Cooldown' configurato con wait_time 2.5s e one_shot true", passed: !!tOk, diff: tOk ? null : "Proprietà timer errate o nodo assente" });
            const conn = t && t.timeout.callbacks.length > 0;
            tests.push({ desc: "Segnale timeout connesso a quando_scaduto", passed: !!conn, diff: conn ? null : "Segnale timeout non connesso" });
            if (conn) t.timeout.emit();
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Tempo scaduto!");
            tests.push({ desc: "Callback quando_scaduto eseguita con successo allo scatto del timer", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$BarraVita.color = "#22c55e"',
            '$BarraVita.size = Vector2(200, 20)',
            'print("Barra salute aggiornata con colore: ", $BarraVita.color)'
        ],
        solution: `func _ready():\n    $BarraVita.color = "#22c55e"\n    $BarraVita.size = Vector2(200, 20)\n    print("Barra salute aggiornata con colore: ", $BarraVita.color)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const b = sc ? sc.get_node("BarraVita") : null;
            const bOk = b && b.type === "ColorRect" && b.color === "#22c55e" && b.size.x === 200 && b.size.y === 20;
            tests.push({ desc: "ColorRect 'BarraVita' configurato con colore verde e size 200x20", passed: !!bOk, diff: bOk ? null : "Proprietà ColorRect non corrette" });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Barra salute aggiornata con colore: #22c55e");
            tests.push({ desc: "Console stampa conferma del colore aggiornato", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            'print("Moneta presente prima: ", has_node("Moneta"))',
            '$Moneta.queue_free()',
            'print("Moneta eliminata con queue_free: ", not has_node("Moneta"))'
        ],
        solution: `func _ready():\n    print("Moneta presente prima: ", has_node("Moneta"))\n    $Moneta.queue_free()\n    print("Moneta eliminata con queue_free: ", not has_node("Moneta"))\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const notHas = sc && !sc.has_node("Moneta");
            tests.push({ desc: "Nodo Moneta rimosso con successo dalla scena tramite queue_free()", passed: !!notHas, diff: notHas ? null : "Moneta ancora presente nella scena" });
            const out = (result.logs || []).join('\n').replace(/\s+/g, ' ');
            const outOk = out.includes("Moneta eliminata con queue_free: true");
            tests.push({ desc: "Console stampa conferma 'Moneta eliminata con queue_free: true'", passed: outOk, diff: outOk ? null : `Ricevuto:\n${out}` });
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
            '$CompraPozioneBtn.pressed.connect(compra_pozione)',
            'func compra_pozione():\n    if monete >= 25:\n        monete -= 25\n        $OroLabel.text = "Monete: " + str(monete)\n        $MessaggioLabel.text = "Pozione Acquistata!"\n    else:\n        $MessaggioLabel.text = "Oro Insufficiente!"\n    print($MessaggioLabel.text)'
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
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scene;
            const btn = sc ? sc.get_node("CompraPozioneBtn") : null;
            const oLbl = sc ? sc.get_node("OroLabel") : null;
            const mLbl = sc ? sc.get_node("MessaggioLabel") : null;
            const conn = btn && btn.pressed.callbacks.length > 0;
            tests.push({ desc: "Pulsante d'acquisto connesso alla funzione compra_pozione", passed: !!conn, diff: conn ? null : "Segnale pressed non connesso" });
            if (conn) {
                btn.pressed.emit();
            }
            const buyOk = oLbl && oLbl.text === "Monete: 75" && mLbl && mLbl.text === "Pozione Acquistata!";
            tests.push({ desc: "Primo acquisto riuscito: oro scalato a 75 e messaggio 'Pozione Acquistata!'", passed: !!buyOk, diff: buyOk ? null : `Oro=${oLbl ? oLbl.text : 'null'}, Msg=${mLbl ? mLbl.text : 'null'}` });
            if (conn) {
                btn.pressed.emit(); // 50
                btn.pressed.emit(); // 25
                btn.pressed.emit(); // 0
                btn.pressed.emit(); // Insufficiente!
            }
            const emptyOk = oLbl && oLbl.text === "Monete: 0" && mLbl && mLbl.text === "Oro Insufficiente!";
            tests.push({ desc: "Gestione limite spesa: avviso 'Oro Insufficiente!' quando terminano le monete", passed: !!emptyOk, diff: emptyOk ? null : `Oro=${oLbl ? oLbl.text : 'null'}, Msg=${mLbl ? mLbl.text : 'null'}` });
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
