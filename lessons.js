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
        title: "4. ⚔️ Sfida di Padronanza: Introduzione",
        icon: "🏆",
        xp: 100,
        expectedOutput: "=== ACCADEMIA GODOT ===\nPronto a sviluppare!",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - INTRODUZIONE</span>
                <h3>Metti alla prova i Fondamenti!</h3>
                <p>Nelle sfide di padronanza verifichi tutti i concetti appresi finora per sbloccare il trofeo del capitolo e ottenere +100 XP!</p>
            </div>
        `,
        task: `
            <ul>
                <li>Aggiungi un commento iniziale (es. <code># Schermata iniziale</code>).</li>
                <li>Stampa l'intestazione esatta: <code>"=== ACCADEMIA GODOT ==="</code>.</li>
                <li>Nella riga successiva stampa: <code>"Pronto a sviluppare!"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Crea la schermata iniziale\n    pass\n`,
        hints: [
            "Usa il cancelletto per il commento",
            "print(\"=== ACCADEMIA GODOT ===\")",
            "print(\"Pronto a sviluppare!\")"
        ],
        solution: `func _ready():\n    # Schermata iniziale\n    print("=== ACCADEMIA GODOT ===")\n    print("Pronto a sviluppare!")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("=== ACCADEMIA GODOT ===") && out.includes("Pronto a sviluppare!");
            tests.push({ desc: "Intestazione e messaggio stampati con precisione", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
        title: "8. ⚔️ Sfida: Variabili (Parte 1)",
        icon: "🏆",
        xp: 100,
        expectedOutput: "Benvenuto Guerriero\nVita: 100",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - VARIABILI PARTE 1</span>
                <h3>Crea il Messaggio di Benvenuto del Personaggio!</h3>
                <p>Combina variabili testuali, numeri e concatenazione di stringhe.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>nome = "Guerriero"</code>.</li>
                <li>Stampa con concatenazione: <code>"Benvenuto " + nome</code>.</li>
                <li>Dichiara <code>punti_vita = 100</code> e stampa: <code>"Vita: 100"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Crea nome e punti_vita e stampa i messaggi composti\n    pass\n`,
        hints: [
            "var nome = \"Guerriero\"",
            "print(\"Benvenuto \" + nome)",
            "var punti_vita = 100",
            "print(\"Vita: 100\")"
        ],
        solution: `func _ready():\n    var nome = "Guerriero"\n    print("Benvenuto " + nome)\n    var punti_vita = 100\n    print("Vita: 100")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Benvenuto Guerriero") && out.includes("Vita: 100");
            tests.push({ desc: "Messaggi dell'eroe stampati con successo", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
        title: "12. ⚔️ Sfida: Variabili (Parte 2 & Tipizzazione)",
        icon: "🏆",
        xp: 100,
        expectedOutput: "100\n5.5\ntrue\n9.8",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - VARIABILI PARTE 2</span>
                <h3>Scheda Tipizzata con Costanti!</h3>
                <p>Combina int, float, bool tipizzati e una costante di sistema.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>var vita: int = 100</code></li>
                <li>Dichiara <code>var velocita: float = 5.5</code></li>
                <li>Dichiara <code>var vivo: bool = true</code></li>
                <li>Dichiara <code>const GRAVITA = 9.8</code></li>
                <li>Stampa ciascuna variabile in sequenza su una riga separata.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Dichiara le 3 variabili tipizzate e la costante, poi stampale\n    pass\n`,
        hints: [
            "var vita: int = 100",
            "var velocita: float = 5.5",
            "var vivo: bool = true",
            "const GRAVITA = 9.8"
        ],
        solution: `func _ready():\n    var vita: int = 100\n    var velocita: float = 5.5\n    var vivo: bool = true\n    const GRAVITA = 9.8\n    print(vita)\n    print(velocita)\n    print(vivo)\n    print(GRAVITA)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito correttamente", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const sc = result.scope;
            const ok = sc["vita"] === 100 && sc["velocita"] === 5.5 && sc["vivo"] === true && sc["GRAVITA"] === 9.8;
            tests.push({ desc: "Tutte le variabili e la costante sono definite", passed: ok, diff: ok ? null : "Una o più variabili non corrispondono" });
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
        title: "16. ⚔️ Sfida: Operatori e Matematica di Gioco",
        icon: "🏆",
        xp: 100,
        expectedOutput: "70\n25\n2",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - MATEMATICA RPG</span>
                <h3>Simula una Battaglia e Dividi il Bottino!</h3>
                <p>Combina danno subito, divisione del forziere tra compagni e resto con modulo (<code>%</code>).</p>
            </div>
        `,
        task: `
            <ul>
                <li><code>salute = 100</code>; sottrai un danno di <code>30</code> (<code>salute -= 30</code>) e stampa <code>salute</code>.</li>
                <li><code>monete = 77</code>; dividi per <code>3</code> avventurieri (<code>monete / 3</code>) e stampa la quota intera.</li>
                <li>Calcola il resto nello scrigno (<code>monete % 3</code>) e stampalo.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Calcola salute rimanente, quota monete e resto\n    pass\n`,
        hints: [
            "var salute = 100; salute -= 30; print(salute)",
            "var monete = 77; print(monete / 3)",
            "print(monete % 3)"
        ],
        solution: `func _ready():\n    var salute = 100\n    salute -= 30\n    print(salute)\n    var monete = 77\n    print(monete / 3)\n    print(monete % 3)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("70") && out.includes("25") && out.includes("2");
            tests.push({ desc: "Salute (70), quota (25) e resto (2) corretti", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
        title: "20. ⚔️ Sfida: Condizioni e Logica",
        icon: "🏆",
        xp: 100,
        expectedOutput: "Vittoria Epica!",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - CONDIZIONI</span>
                <h3>La Sconfitta del Boss del Dungeon!</h3>
                <p>Verifica se il boss è sconfitto (<code>salute_boss <= 0</code>) e il party è sopravvissuto (<code>eroi_vivi > 0</code>).</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>salute_boss: int = 0</code> e <code>eroi_vivi: int = 2</code>.</li>
                <li>Se <code>salute_boss <= 0 and eroi_vivi > 0:</code> stampa <code>"Vittoria Epica!"</code>.</li>
                <li>Altrimenti stampa <code>"Sconfitta..."</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Controlla le condizioni di vittoria finale\n    pass\n`,
        hints: [
            "var salute_boss: int = 0",
            "var eroi_vivi: int = 2",
            "if salute_boss <= 0 and eroi_vivi > 0:",
            "    print(\"Vittoria Epica!\")"
        ],
        solution: `func _ready():\n    var salute_boss: int = 0\n    var eroi_vivi: int = 2\n    if salute_boss <= 0 and eroi_vivi > 0:\n        print("Vittoria Epica!")\n    else:\n        print("Sconfitta...")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const ok = result.logs.some(l => l.includes("Vittoria Epica!"));
            tests.push({ desc: "Condizione di vittoria verificata ('Vittoria Epica!')", passed: ok, diff: ok ? null : `Ricevuto: "${result.logs.join(' | ')}"` });
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
        title: "24. ⚔️ Sfida: Liste e Collezioni (Array)",
        icon: "🏆",
        xp: 100,
        expectedOutput: "Pozione Magica\n4",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - ARRAY</span>
                <h3>Gestione dell'Equipaggiamento dell'Eroe!</h3>
                <p>Crea un inventario, inserisci un drop speciale con <code>append()</code> e verifica gli elementi e la dimensione.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>zaino = ["Chiave", "Pane", "Spada"]</code>.</li>
                <li>Aggiungi <code>"Pozione Magica"</code> con <code>append()</code>.</li>
                <li>Stampa l'ultimo oggetto aggiunto (<code>zaino[3]</code>).</li>
                <li>Stampa il numero totale di oggetti nello zaino con <code>size()</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Gestisci lo zaino con append e size\n    pass\n`,
        hints: [
            "var zaino = [\"Chiave\", \"Pane\", \"Spada\"]",
            "zaino.append(\"Pozione Magica\")",
            "print(zaino[3])",
            "print(zaino.size())"
        ],
        solution: `func _ready():\n    var zaino = ["Chiave", "Pane", "Spada"]\n    zaino.append("Pozione Magica")\n    print(zaino[3])\n    print(zaino.size())\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Pozione Magica") && out.includes("4");
            tests.push({ desc: "Nuovo drop e dimensione totale 4 stampati", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
        title: "28. ⚔️ Sfida: Cicli (For e While)",
        icon: "🏆",
        xp: 100,
        expectedOutput: "Onda 1 pronta\nOnda 2 pronta\nOnda 3 pronta",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - CICLI</span>
                <h3>Generatore di Ondate di Mostri!</h3>
                <p>Usa un ciclo <code>for</code> con <code>range(1, 4)</code> per annunciare le tre ondate di nemici del dungeon.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Scrivi un ciclo <code>for onda in range(1, 4):</code>.</li>
                <li>All'interno stampa: <code>"Onda " + str(onda) + " pronta"</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA: Genera le 3 ondate con un ciclo for\n    pass\n`,
        hints: [
            "for onda in range(1, 4):",
            "    print(\"Onda \" + str(onda) + \" pronta\")"
        ],
        solution: `func _ready():\n    for onda in range(1, 4):\n        print("Onda " + str(onda) + " pronta")\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Onda 1 pronta") && out.includes("Onda 2 pronta") && out.includes("Onda 3 pronta");
            tests.push({ desc: "Tutte e 3 le ondate annunciate correttamente", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
        title: "32. ⚔️ Sfida: Funzioni e Nodi Godot",
        icon: "🏆",
        xp: 100,
        expectedOutput: "Bonus calcolato: 150",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA - FUNZIONI</span>
                <h3>Crea una Funzione di Calcolo Ricompensa!</h3>
                <p>Costruisci una funzione che accetta punti base e moltiplicatore, restituisce il totale e stampalo in <code>_ready()</code>.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Crea la funzione <code>calcola_bonus(base, bonus): return base * bonus</code>.</li>
                <li>In <code>_ready():</code>, chiama <code>var ris = calcola_bonus(50, 3)</code>.</li>
                <li>Stampa: <code>"Bonus calcolato: " + str(ris)</code>.</li>
            </ul>
        `,
        initialCode: `func calcola_bonus(base, bonus):\n    # SFIDA: Calcola e ritorna base * bonus\n    pass\n\nfunc _ready():\n    # Chiama la funzione con 50 e 3, poi stampa il messaggio finale\n    pass\n`,
        hints: [
            "return base * bonus",
            "var ris = calcola_bonus(50, 3)",
            "print(\"Bonus calcolato: \" + str(ris))"
        ],
        solution: `func calcola_bonus(base, bonus):\n    return base * bonus\n\nfunc _ready():\n    var ris = calcola_bonus(50, 3)\n    print("Bonus calcolato: " + str(ris))\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const out = result.logs.join('\n');
            const ok = out.includes("Bonus calcolato: 150");
            tests.push({ desc: "Risultato 'Bonus calcolato: 150' stampato", passed: ok, diff: ok ? null : `Ricevuto: "${out}"` });
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
        title: "36. ⚔️ Sfida: Vettori e Movimento 2D",
        icon: "🏆",
        xp: 100,
        expectedOutput: "Vector2(140, 250)",
        theory: `
            <div class="mastery-banner">
                <span class="mastery-badge">⚔️ SFIDA DI PADRONANZA FINALE - VETTORI 2D</span>
                <h3>Il Propulsore Spaziale di Godot!</h3>
                <p>Simula il controller di decollo di una navetta spaziale calcolando lo spostamento su entrambi gli assi.</p>
            </div>
        `,
        task: `
            <ul>
                <li>Dichiara <code>nave = Vector2(100, 300)</code>.</li>
                <li>Aumenta la coordinata X: <code>nave.x += 40</code>.</li>
                <li>Riduci la coordinata Y verso l'alto: <code>nave.y -= 50</code>.</li>
                <li>Stampa la posizione finale con <code>print(nave)</code>.</li>
            </ul>
        `,
        initialCode: `func _ready():\n    # SFIDA FINALE: Calcola la traiettoria della nave spaziale\n    pass\n`,
        hints: [
            "var nave = Vector2(100, 300)",
            "nave.x += 40",
            "nave.y -= 50",
            "print(nave)"
        ],
        solution: `func _ready():\n    var nave = Vector2(100, 300)\n    nave.x += 40\n    nave.y -= 50\n    print(nave)\n`,
        validate: async (result) => {
            const tests = [];
            tests.push({ desc: "Codice eseguito senza errori", passed: result.success, diff: result.error ? `Errore: ${result.error}` : null });
            const p = result.scope["nave"];
            const ok = p && p.x === 140 && p.y === 250;
            tests.push({ desc: "Posizione finale calcolata a Vector2(140, 250)", passed: ok, diff: ok ? null : "Posizione non corretta" });
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
    { level: 10, title: "Godot Hero Leggendario", minXp: 3200, maxXp: 99999 }
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
