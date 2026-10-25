/**
 * GDScript Hero - P3.2: Modulo di Diagnostica Didattica Avanzata
 * Analisi statica, classificazione e spiegazioni pedagogiche per GDScript 4
 */

const GDScriptDiagnostic = {
    // ==========================================
    // CATALOGO CASI D'ERRORE E LIMITAZIONI
    // ==========================================
    LIMITATIONS: [
        {
            id: 'packed_scene',
            pattern: /\b(?:PackedScene|ResourceLoader\.load|preload\s*\(\s*["'][^"']+\.tscn["']\s*\))/i,
            title: "Caricamento scene complesse su disco",
            why: "Il caricamento dinamico di file .tscn richiede il file system completo di Godot 4, non simulato nel browser.",
            nextStep: "Crea e configura i nodi programmaticamente tramite codice come richiesto dall'esercizio."
        },
        {
            id: 'multithreading',
            pattern: /\b(?:Thread\.new|Mutex\.new|Semaphore\.new)\b/,
            title: "Multithreading non simulato su Web",
            why: "I thread di sistema GDScript 4 richiedono WebAssembly multithreading e SharedArrayBuffer non attivi nella sandbox web.",
            nextStep: "Utilizza funzioni asincrone e segnali anziché thread di basso livello."
        },
        {
            id: 'physics_servers',
            pattern: /\b(?:PhysicsServer2D|PhysicsServer3D|RenderingServer|AudioServer)\b/,
            title: "Accesso diretto ai Server di basso livello",
            why: "I Server di Godot operano a livello motore C++ e non sono simulati nell'ambiente didattico web.",
            nextStep: "Usa i nodi standard di alto livello (Node2D, Timer, ColorRect, Button)."
        },
        {
            id: 'file_access',
            pattern: /\b(?:FileAccess|DirAccess)\b/,
            title: "Accesso I/O al File System del disco",
            why: "Per ragioni di sicurezza della sandbox del browser, l'accesso diretto ai file locali è disabilitato.",
            nextStep: "Memorizza i dati in variabili, dizionari o array in memoria."
        }
    ],

    // ==========================================
    // METODO PRINCIPALE DI ANALISI
    // ==========================================
    analyze(code, runtimeResult, failedTest = null, currentLesson = null) {
        const rawCode = code || '';
        const lines = rawCode.split(/\r?\n/);
        const errStr = (runtimeResult && runtimeResult.error) ? String(runtimeResult.error) : '';
        const isExecutionSuccess = !!(runtimeResult && runtimeResult.success && !runtimeResult.error);

        // 1. VERIFICA LIMITAZIONI DEL SIMULATORE WEB (Distinzione esplicita da GDScript errato)
        for (const lim of this.LIMITATIONS) {
            if (lim.pattern.test(rawCode)) {
                let foundLine = null;
                for (let i = 0; i < lines.length; i++) {
                    if (lim.pattern.test(lines[i])) {
                        foundLine = i + 1;
                        break;
                    }
                }
                return {
                    category: 'transpiler_limitation',
                    badgeText: 'LIMITAZIONE SIMULATORE WEB',
                    badgeClass: 'badge-limitation',
                    title: `Sintassi GDScript valida, ma non supportata dal simulatore web (${lim.title})`,
                    line: foundLine,
                    isHeuristic: false,
                    isTranspilerLimitation: true,
                    why: `Il tuo codice GDScript 4 è valido, ma utilizza una funzionalità (${lim.title}) che richiede il motore Godot 4 completo e non può essere simulata all'interno del browser web.`,
                    nextStep: lim.nextStep,
                    techDetails: foundLine ? `Rilevato a riga ${foundLine}: "${lines[foundLine - 1].trim()}"` : null
                };
            }
        }

        // 2. TIMEOUT / CICLO INFINITO
        if (/timeout|ciclo infinito/i.test(errStr)) {
            let whileLine = null;
            for (let i = 0; i < lines.length; i++) {
                if (/\bwhile\b/.test(lines[i])) {
                    whileLine = i + 1;
                    break;
                }
            }
            return {
                category: 'timeout',
                badgeText: 'LOOP / TIMEOUT',
                badgeClass: 'badge-timeout',
                title: "Possibile ciclo infinito rilevato",
                line: whileLine,
                isHeuristic: whileLine !== null,
                isTranspilerLimitation: false,
                why: "Il codice ha superato il limite di sicurezza delle 50.000 iterazioni. Nella maggior parte dei casi questo avviene quando la condizione di un ciclo while non diventa mai falsa o il contatore non viene incrementato/decrementato ad ogni passaggio.",
                nextStep: "Verifica che le variabili che regolano l'uscita dal ciclo vengano modificate all'interno del corpo del while.",
                techDetails: whileLine ? `Ciclo individuato alla riga ${whileLine}: "${lines[whileLine - 1].trim()}"` : "Limite massimo di iterazioni superato"
            };
        }

        // 3. ANALISI STATICA PREVENTIVA DI SINTASSI (Pattern Comuni GDScript)
        // 3.1 Stringhe non chiuse
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cleanLine = line.replace(/#.*$/, ''); // ignora commenti
            let singleQ = 0, doubleQ = 0;
            for (let c = 0; c < cleanLine.length; c++) {
                if (cleanLine[c] === '"' && (c === 0 || cleanLine[c - 1] !== '\\')) doubleQ++;
                if (cleanLine[c] === "'" && (c === 0 || cleanLine[c - 1] !== '\\')) singleQ++;
            }
            if (doubleQ % 2 !== 0 || singleQ % 2 !== 0) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Delimitazione stringa non chiusa (virgolette spaiate)",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "Una stringa di testo è stata aperta con virgolette singole o doppie ma non è stata chiusa prima del termine della riga.",
                    nextStep: "Controlla la riga segnalata e accertati che ogni testo aperto sia terminato con la stessa virgoletta (doppia o singola).",
                    techDetails: `Riga ${i + 1}: ${line.trim()}`
                };
            }
        }

        // 3.2 Due punti mancanti sui costrutti a blocco (func, if, elif, else, for, while, class)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/#.*$/, '').trim();
            if (!line) continue;
            const blockKeywords = /^(func\s+[a-zA-Z_]\w*\s*\(.*\)|if\b.*|elif\b.*|else|for\b.*|while\b.*|class\b.*)$/;
            if (blockKeywords.test(line) && !line.endsWith(':')) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Due punti (:) mancanti al termine dell'istruzione",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "In GDScript ogni intestazione di blocco (definizione di funzione, condizione logica, ciclo o classe) deve obbligatoriamente terminare con il carattere due punti (:).",
                    nextStep: "Aggiungi ':' alla fine dell'istruzione indicata.",
                    techDetails: `Riga ${i + 1}: "${line}" ➔ aggiungi ':' alla fine`
                };
            }
        }

        // 3.3 Assegnazione singola '=' dentro una condizione 'if' o 'elif'
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/#.*$/, '').trim();
            if (/^(if|elif)\s+[^=!<>\n]+=[^=]/.test(line)) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Assegnazione singola (=) utilizzata al posto del confronto (==)",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "L'operatore singolo '=' assegna un valore a una variabile. Per verificare l'uguaglianza logica tra due valori all'interno di una condizione decisionale si deve usare il doppio uguale (==).",
                    nextStep: "Sostituisci '=' con '==' all'interno della condizione.",
                    techDetails: `Riga ${i + 1}: "${line}"`
                };
            }
        }

        // 3.4 Sintassi deprecata GDScript 3
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/#.*$/, '').trim();
            if (/^export\s+var\b/.test(line)) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Sintassi deprecata GDScript 3: 'export var'",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "In GDScript 4 la parola chiave 'export' è stata sostituita dall'annotazione con chiocciola '@export'.",
                    nextStep: "Sostituisci 'export var' con '@export var'.",
                    techDetails: `Riga ${i + 1}: ${line}`
                };
            }
            if (/^onready\s+var\b/.test(line)) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Sintassi deprecata GDScript 3: 'onready var'",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "In GDScript 4 la parola chiave 'onready' è stata sostituita dall'annotazione con chiocciola '@onready'.",
                    nextStep: "Sostituisci 'onready var' con '@onready var'.",
                    techDetails: `Riga ${i + 1}: ${line}`
                };
            }
            if (/\byield\s*\(/.test(line)) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Sintassi deprecata GDScript 3: 'yield()'",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "In GDScript 4 l'istruzione yield() è stata sostituita dalla parola chiave 'await'.",
                    nextStep: "Usa 'await segnale' oppure 'await funzione()' al posto di yield().",
                    techDetails: `Riga ${i + 1}: ${line}`
                };
            }
            if (/\.instance\s*\(\s*\)/.test(line)) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Sintassi deprecata GDScript 3: '.instance()'",
                    line: i + 1,
                    isHeuristic: false,
                    isTranspilerLimitation: false,
                    why: "In Godot 4 il metodo .instance() è stato rinominato in .instantiate().",
                    nextStep: "Sostituisci .instance() con .instantiate().",
                    techDetails: `Riga ${i + 1}: ${line}`
                };
            }
        }

        // 3.5 Mancanza di parola chiave 'var' su assegnazioni a livello radice
        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i].replace(/#.*$/, '');
            const trimmed = raw.trim();
            // Identifica se c'è un'assegnazione senza var non dentro una funzione (livello colonna 0)
            if (/^[a-zA-Z_]\w*\s*(?::\s*[a-zA-Z_]\w*)?\s*=[^=]/.test(raw) && !/^var\b|^const\b|^signal\b|^extends\b|^class\b/.test(trimmed)) {
                return {
                    category: 'syntax',
                    badgeText: 'SINTASSI GDSCRIPT',
                    badgeClass: 'badge-syntax',
                    title: "Dichiarazione variabile senza parola chiave 'var'",
                    line: i + 1,
                    isHeuristic: true,
                    isTranspilerLimitation: false,
                    why: "In GDScript per dichiarare una nuova variabile è necessario anteporre la parola chiave 'var' (es. 'var punteggio = 100').",
                    nextStep: "Aggiungi 'var' all'inizio dell'assegnazione.",
                    techDetails: `Riga ${i + 1}: "${trimmed}"`
                };
            }
        }

        // 3.6 Istruzioni eseguibili a livello radice (fuori da funzioni)
        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i].replace(/#.*$/, '');
            const trimmed = raw.trim();
            if (!trimmed) continue;
            if (!lines[i].startsWith(' ') && !lines[i].startsWith('\t')) {
                const isDecl = /^(extends\b|class_name\b|signal\b|enum\b|const\b|var\b|static\s+var\b|func\b|static\s+func\b|class\b|@)/.test(trimmed);
                if (!isDecl && /^(print\b|for\b|while\b|if\b|elif\b|else\b|match\b|[a-zA-Z_]\w*\s*\()/.test(trimmed)) {
                    return {
                        category: 'syntax',
                        badgeText: 'SINTASSI GDSCRIPT',
                        badgeClass: 'badge-syntax',
                        title: "Istruzione eseguibile fuori da una funzione",
                        line: i + 1,
                        isHeuristic: false,
                        isTranspilerLimitation: false,
                        why: "In GDScript 4 le istruzioni eseguibili (come print(), cicli e condizioni) non possono essere scritte direttamente nel corpo dello script: devono trovarsi all'interno di una funzione (es. 'func _ready():').",
                        nextStep: "Inserisci l'istruzione indentata all'interno della funzione 'func _ready():'.",
                        techDetails: `Riga ${i + 1}: "${trimmed}"`
                    };
                }
            }
        }

        // 4. ERRORI DI SINTASSI EMESSI DAL TRANSPILER
        const isSyntaxError = /syntaxerror|errore di sintassi|unexpected token|invalid or unexpected token|unexpected identifier|missing \)/i.test(errStr);
        if (isSyntaxError) {
            const lineMatch = errStr.match(/riga\s*(\d+)/i) || errStr.match(/line\s*(\d+)/i);
            const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : null;

            let specificTitle = "Errore di sintassi GDScript";
            let specificWhy = "Il codice non rispetta le regole grammaticali di GDScript 4. Controlla di aver chiuso tutte le parentesi e virgolette, indentato a 4 spazi e aggiunto i due punti (:) alle definizioni.";

            if (/missing \)/i.test(errStr) || /parentesi/i.test(errStr)) {
                specificTitle = "Parentesi mancante o non bilanciata";
                specificWhy = "È stata aperta una parentesi tonda '(' senza la corrispettiva parentesi di chiusura ')'.";
            } else if (/non consentita nel corpo/i.test(errStr) || /corpo della classe/i.test(errStr)) {
                specificTitle = "Istruzione eseguibile fuori da una funzione";
                specificWhy = "In GDScript le istruzioni eseguibili (come print, cicli, condizioni o chiamate) non possono trovarsi direttamente nel corpo della classe o dello script. Devono trovarsi all'interno di una funzione (come 'func _ready():').";
            }

            return {
                category: 'syntax',
                badgeText: 'SINTASSI GDSCRIPT',
                badgeClass: 'badge-syntax',
                title: specificTitle,
                line: lineNum,
                isHeuristic: lineNum === null,
                isTranspilerLimitation: false,
                why: specificWhy,
                nextStep: "Esamina la riga indicata o la riga immediatamente precedente per individuare simboli mancanti o non chiusi.",
                techDetails: errStr
            };
        }

        // 5. ERRORI DURANTE L'ESECUZIONE (RUNTIME)
        if (errStr && !isExecutionSuccess) {
            const lineMatch = errStr.match(/riga\s*(\d+)/i);
            const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : null;

            // 5.1 Identificatore non definito
            if (/is not defined|referenceerror/i.test(errStr)) {
                const varMatch = errStr.match(/([a-zA-Z_]\w*)\s+is not defined/i) || errStr.match(/ReferenceError:\s*([a-zA-Z_]\w*)/i);
                const varName = varMatch ? varMatch[1] : null;

                return {
                    category: 'runtime',
                    badgeText: 'ERRORE RUNTIME',
                    badgeClass: 'badge-runtime',
                    title: varName ? `Identificatore '${varName}' non definito` : "Identificatore o variabile non definita",
                    line: lineNum,
                    isHeuristic: lineNum === null,
                    isTranspilerLimitation: false,
                    why: varName
                        ? `Lo script sta tentando di utilizzare '${varName}', ma questo nome non è stato dichiarato con 'var' e non è un valore conosciuto. Se intendevi assegnare una parola o un testo, ricordati di racchiuderlo tra virgolette (es. "${varName}").`
                        : "Lo script fa riferimento a un nome non ancora dichiarato nello scope corrente.",
                    nextStep: "Verifica che il nome non contenga errori di battitura e che sia stato dichiarato con 'var' prima del suo utilizzo.",
                    techDetails: errStr
                };
            }

            // 5.2 Accesso su valore nullo (null instance)
            if (/cannot read propert|is null|is undefined|cannot call method on null/i.test(errStr)) {
                return {
                    category: 'runtime',
                    badgeText: 'ERRORE RUNTIME',
                    badgeClass: 'badge-runtime',
                    title: "Accesso su valore nullo (Null Instance)",
                    line: lineNum,
                    isHeuristic: lineNum === null,
                    isTranspilerLimitation: false,
                    why: "Stai provando a chiamare un metodo o leggere una proprietà su una variabile o un nodo che al momento dell'esecuzione vale 'null'. In Godot questo accade spesso se get_node() o $Nodo non trova il nodo specificato.",
                    nextStep: "Verifica che il nodo esista nella scena e che il percorso specificato con l'operatore $ o get_node() sia esatto.",
                    techDetails: errStr
                };
            }

            // 5.3 Concatenazione illegale tra String e Number
            if (/cannot convert|typeerror.*string|typeerror.*number/i.test(errStr)) {
                return {
                    category: 'runtime',
                    badgeText: 'ERRORE RUNTIME',
                    badgeClass: 'badge-runtime',
                    title: "Concatenazione tra tipi incompatibili (Testo e Numero)",
                    line: lineNum,
                    isHeuristic: lineNum === null,
                    isTranspilerLimitation: false,
                    why: "In GDScript non è possibile sommare direttamente un testo con un numero intero o decimale usando '+'.",
                    nextStep: "Converti il valore numerico in testo tramite la funzione str(numero) prima della concatenazione.",
                    techDetails: errStr
                };
            }

            // 5.4 Chiamata a metodo non esistente
            if (/is not a function|non è una funzione/i.test(errStr)) {
                return {
                    category: 'runtime',
                    badgeText: 'ERRORE RUNTIME',
                    badgeClass: 'badge-runtime',
                    title: "Metodo o funzione inesistente",
                    line: lineNum,
                    isHeuristic: lineNum === null,
                    isTranspilerLimitation: false,
                    why: "Il codice tenta di invocare un metodo che non esiste sulla classe o sul nodo di destinazione.",
                    nextStep: "Controlla il nome del metodo per verificare l'assenza di refusi e consulta la traccia dell'esercizio per la firma corretta.",
                    techDetails: errStr
                };
            }

            // Errore runtime generico
            return {
                category: 'runtime',
                badgeText: 'ERRORE RUNTIME',
                badgeClass: 'badge-runtime',
                title: "Errore durante l'esecuzione dello script",
                line: lineNum,
                isHeuristic: lineNum === null,
                isTranspilerLimitation: false,
                why: "Lo script si è interrotto in modo imprevisto prima di completare tutte le istruzioni.",
                nextStep: "Verifica l'ordine logico delle operazioni e i parametri passati alle funzioni.",
                techDetails: errStr
            };
        }

        // 6. REQUISITO LOGICO NON SODDISFATTO (Asserzione fallita)
        if (failedTest) {
            const desc = failedTest.desc || "Controllo requisito";
            const diff = failedTest.diff || null;

            return {
                category: 'requirement',
                badgeText: 'LOGICA / REQUISITO',
                badgeClass: 'badge-requirement',
                title: `Requisito non soddisfatto: ${desc}`,
                line: null,
                isHeuristic: false,
                isTranspilerLimitation: false,
                why: "Il codice è stato eseguito senza interruzioni né errori di sintassi, ma lo stato finale o l'output prodotto a console non coincide con quello atteso dalla traccia didattica.",
                nextStep: diff
                    ? "Confronta il risultato effettivamente prodotto con quello richiesto ed aggiusta il valore o la formula logica."
                    : "Rileggi l'obiettivo dell'esercizio per assicurarti di aver rispettato tutti i punti richiesti.",
                techDetails: diff
            };
        }

        // Nessun errore rilevato
        return null;
    }
};

if (typeof window !== 'undefined') {
    window.GDScriptDiagnostic = GDScriptDiagnostic;
}
