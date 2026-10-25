// Runtime & Interprete GDScript per GDScript Hero (Funzionamento 100% Client-Side)

// Implementazione di Vector2 fedele a Godot
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = Number(x);
        this.y = Number(y);
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    mul(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distance_to(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    normalized() {
        const l = this.length();
        if (l === 0) return new Vector2(0, 0);
        return new Vector2(this.x / l, this.y / l);
    }

    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }
}

// Funzioni built-in di Godot
function __gd_range(...args) {
    let start = 0, stop = 0, step = 1;
    if (args.length === 1) {
        stop = args[0];
    } else if (args.length === 2) {
        start = args[0];
        stop = args[1];
    } else if (args.length >= 3) {
        start = args[0];
        stop = args[1];
        step = args[2];
    }
    const res = [];
    if (step > 0) {
        for (let i = start; i < stop; i += step) res.push(i);
    } else if (step < 0) {
        for (let i = start; i > stop; i += step) res.push(i);
    }
    return res;
}

function __gd_len(item) {
    if (item && item.length !== undefined) return item.length;
    if (item && typeof item === 'object') return Object.keys(item).length;
    return 0;
}

function __gd_str(item) {
    if (item === null) return "null";
    if (item === undefined) return "null";
    return item.toString();
}

// Metodi Array di Godot
if (!Array.prototype.append) {
    Array.prototype.append = function(...items) {
        return this.push(...items);
    };
}
if (!Array.prototype.size) {
    Array.prototype.size = function() {
        return this.length;
    };
}
if (!Array.prototype.erase) {
    Array.prototype.erase = function(item) {
        const idx = this.indexOf(item);
        if (idx !== -1) {
            this.splice(idx, 1);
        }
    };
}
if (!Array.prototype.has) {
    Array.prototype.has = function(item) {
        return this.includes(item);
    };
}

// Metodi Dictionary di Godot (definiti non-enumerabili per sicurezza)
if (!Object.prototype.has) {
    Object.defineProperty(Object.prototype, 'has', {
        value: function(key) {
            return Object.prototype.hasOwnProperty.call(this, key);
        },
        enumerable: false,
        writable: true,
        configurable: true
    });
}
if (!Object.prototype.keys) {
    Object.defineProperty(Object.prototype, 'keys', {
        value: function() {
            return Object.keys(this);
        },
        enumerable: false,
        writable: true,
        configurable: true
    });
}
if (!Object.prototype.values) {
    Object.defineProperty(Object.prototype, 'values', {
        value: function() {
            return Object.values(this);
        },
        enumerable: false,
        writable: true,
        configurable: true
    });
}
if (!Object.prototype.erase) {
    Object.defineProperty(Object.prototype, 'erase', {
        value: function(key) {
            delete this[key];
        },
        enumerable: false,
        writable: true,
        configurable: true
    });
}

// Classe Signal di Godot Engine
class GD_Signal {
    constructor(name = "signal") {
        this.name = name;
        this.callbacks = [];
    }
    connect(cb) {
        if (typeof cb === 'function') {
            this.callbacks.push(cb);
        }
    }
    emit(...args) {
        for (const cb of this.callbacks) {
            cb(...args);
        }
    }
    emit_signal(...args) {
        this.emit(...args);
    }
    toString() {
        return `[Signal: ${this.name}]`;
    }
}

// ==========================================
// SISTEMA NODI & SCENE DI GODOT ENGINE
// ==========================================

class GD_Node {
    constructor(name = "Node") {
        this.name = name;
        this.type = this.constructor.name.replace(/^GD_/, '');
        this.parent = null;
        this.children = [];
        this.position = new Vector2(0, 0);
        this.size = new Vector2(100, 40);
        this.visible = true;
        this.modulate = "#ffffff";
        this._is_queued_for_deletion = false;
    }

    static new(name) {
        return new this(name);
    }

    add_child(child) {
        if (!child || !(child instanceof GD_Node)) {
            throw new Error(`add_child: l'argomento non è un'istanza valida di Node!`);
        }
        if (child.parent) {
            child.parent.remove_child(child);
        }
        child.parent = this;
        this.children.push(child);
        return child;
    }

    remove_child(child) {
        const idx = this.children.indexOf(child);
        if (idx !== -1) {
            this.children.splice(idx, 1);
            child.parent = null;
        }
    }

    get_child_count() {
        return this.children.length;
    }

    get_children() {
        return [...this.children];
    }

    get_node(path) {
        if (!path || path === "." || path === "self") return this;
        const parts = String(path).split('/').filter(Boolean);
        let curr = this;
        for (const p of parts) {
            if (p === "..") {
                curr = curr.parent;
            } else {
                const found = curr.children.find(c => c.name === p);
                if (!found) return null;
                curr = found;
            }
        }
        return curr;
    }

    has_node(path) {
        return this.get_node(path) !== null;
    }

    queue_free() {
        this._is_queued_for_deletion = true;
        if (this.parent) {
            this.parent.remove_child(this);
        }
    }

    is_queued_for_deletion() {
        return this._is_queued_for_deletion;
    }

    toTreeObject() {
        return {
            name: this.name,
            type: this.type,
            text: this.text || null,
            visible: this.visible,
            children: this.children.map(c => c.toTreeObject())
        };
    }

    toString() {
        return `[${this.type}: ${this.name}]`;
    }
}

class GD_Label extends GD_Node {
    constructor(name = "Label") {
        super(name);
        this.text = "";
        this.horizontal_alignment = "left";
    }
}

class GD_Button extends GD_Node {
    constructor(name = "Button") {
        super(name);
        this.text = "Button";
        this.disabled = false;
        this.pressed = new GD_Signal("pressed");
    }
}

class GD_Timer extends GD_Node {
    constructor(name = "Timer") {
        super(name);
        this.wait_time = 1.0;
        this.one_shot = false;
        this.autostart = false;
        this.is_stopped = true;
        this.time_left = 0;
        this.timeout = new GD_Signal("timeout");
    }

    start(time = null) {
        if (time !== null) this.wait_time = Number(time);
        this.is_stopped = false;
        this.time_left = this.wait_time;
    }

    stop() {
        this.is_stopped = true;
        this.time_left = 0;
    }
}

class GD_ColorRect extends GD_Node {
    constructor(name = "ColorRect") {
        super(name);
        this.color = "#438eff";
        this.size = new Vector2(100, 30);
    }
}

class GD_Node2D extends GD_Node {
    constructor(name = "Node2D") {
        super(name);
        this.rotation = 0;
        this.scale = new Vector2(1, 1);
    }
}

class GD_Sprite2D extends GD_Node2D {
    constructor(name = "Sprite2D") {
        super(name);
        this.texture = "godot_icon";
        this.modulate = "#ffffff";
    }
}

class GD_CharacterBody2D extends GD_Node2D {
    constructor(name = "CharacterBody2D") {
        super(name);
        this.velocity = new Vector2(0, 0);
    }
    move_and_slide() {
        this.position.x += (this.velocity.x || 0) * 0.016;
        this.position.y += (this.velocity.y || 0) * 0.016;
    }
}

class GD_ProgressBar extends GD_Node {
    constructor(name = "ProgressBar") {
        super(name);
        this.value = 50;
        this.max_value = 100;
        this.min_value = 0;
    }
}

class GD_AudioStreamPlayer2D extends GD_Node {
    constructor(name = "AudioStreamPlayer2D") {
        super(name);
        this.playing = false;
    }
    play() {
        this.playing = true;
    }
    stop() {
        this.playing = false;
    }
}

// Transpiler da GDScript a JavaScript moderno
const GDScriptRuntime = {
    transpile(gdCode) {
        const lines = gdCode.split(/\r?\n/);
        const jsLines = [];
        const sourceMap = [];
        const indentStack = [0];
        const blockTypes = ['CLASS'];
        const declaredVars = new Set();
        let classIndent = -1;
        let currentClassName = '';
        let currentGdLine = 1;

        const pushJs = (code, gdLine = null) => {
            jsLines.push(code);
            sourceMap.push(gdLine !== null ? gdLine : currentGdLine);
        };

        for (let idx = 0; idx < lines.length; idx++) {
            currentGdLine = idx + 1;
            let line = lines[idx];

            // Rimuovi commenti inline se non tra virgolette
            let cleanLine = line;
            let inString = false;
            let stringChar = '';
            let commentIndex = -1;

            for (let c = 0; c < cleanLine.length; c++) {
                const ch = cleanLine[c];
                if ((ch === '"' || ch === "'") && (c === 0 || cleanLine[c - 1] !== '\\')) {
                    if (!inString) {
                        inString = true;
                        stringChar = ch;
                    } else if (stringChar === ch) {
                        inString = false;
                    }
                } else if (ch === '#' && !inString) {
                    commentIndex = c;
                    break;
                }
            }

            if (commentIndex !== -1) {
                cleanLine = cleanLine.substring(0, commentIndex);
            }

            // Ignora righe vuote
            if (cleanLine.trim().length === 0) {
                continue;
            }

            // Calcola indentazione (4 spazi o 1 tab = 4 spazi)
            const leadingSpacesMatch = line.match(/^[ \t]*/)[0];
            const currentIndent = leadingSpacesMatch.replace(/\t/g, '    ').length;

            let content = cleanLine.trim();

            // Chiusura blocchi in base all'indentazione
            while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
                const poppedIndent = indentStack.pop();
                blockTypes.pop();
                if (classIndent !== -1) {
                    // Siamo all'interno di una classe
                    if (indentStack.length === 1 || indentStack[indentStack.length - 1] <= classIndent) {
                        // Stiamo chiudendo il corpo della classe
                        pushJs(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                        if (currentClassName) {
                            pushJs(`try { __scope["${currentClassName}"] = ${currentClassName}; } catch(e) {}`);
                        }
                        classIndent = -1;
                        currentClassName = '';
                    } else {
                        // Stiamo chiudendo un metodo dentro la classe
                        pushJs(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                    }
                } else {
                    // Chiusura di un normale blocco/funzione
                    if (indentStack.length === 1) {
                        declaredVars.forEach(v => {
                            pushJs(' '.repeat(poppedIndent) + `try { __scope["${v}"] = ${v}; } catch(e) {}`);
                        });
                    }
                    pushJs(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                }
            }

            // Verifica direttive Godot
            if (content.startsWith('extends ')) {
                continue;
            }

            // Conversione costrutti GDScript -> JS
            let isBlockStart = content.endsWith(':');
            if (isBlockStart) {
                content = content.slice(0, -1).trim();
            }

            const inClass = (classIndent !== -1 && currentIndent > classIndent);
            const currentScopeType = blockTypes[blockTypes.length - 1];

            // Validazione strutturale GDScript 4:
            // Nel corpo di una classe (indent 0 o corpo di inner class) sono ammesse solo dichiarazioni
            if (currentScopeType === 'CLASS') {
                const isDeclaration = /^(extends\b|class_name\b|signal\b|enum\b|const\b|var\b|static\s+var\b|func\b|static\s+func\b|class\b|@)/.test(content);
                const isInnerClassPass = (inClass || indentStack.length > 1) && content === 'pass';
                if (!isDeclaration && !isInnerClassPass) {
                    throw new SyntaxError(`Riga ${currentGdLine}: Errore di sintassi GDScript: Istruzione '${content.substring(0, 35)}' non consentita nel corpo dello script/classe. Le istruzioni eseguibili devono trovarsi all'interno di una funzione (es. 'func _ready():').`);
                }
            }

            // signal nome(parametri)
            if (content.startsWith('signal ')) {
                const rawSig = content.substring(7).trim();
                const sigName = rawSig.split('(')[0].trim();
                declaredVars.add(sigName);
                content = `__scope["${sigName}"] = new GD_Signal("${sigName}"); let ${sigName} = __scope["${sigName}"]`;
            }

            // class NomeClasse:
            else if (content.startsWith('class ')) {
                classIndent = currentIndent;
                let cName = content.substring(6).trim();
                let baseClass = '';
                if (cName.includes('extends')) {
                    const parts = cName.split('extends');
                    cName = parts[0].trim();
                    baseClass = 'extends ' + parts[1].trim();
                }
                declaredVars.add(cName);
                currentClassName = cName;
                content = `class ${cName} ${baseClass}`.trim();
            }

            // class_name Nome
            else if (content.startsWith('class_name ')) {
                content = `/* ${content} */`;
            }

            // var name: Type = Val (in class field vs local/global var)
            else if (content.startsWith('var ') || content.startsWith('const ')) {
                let isConst = content.startsWith('const ');
                let rest = isConst ? content.substring(6).trim() : content.substring(4).trim();
                let varName = '';
                let varValue = 'null';

                if (rest.includes('=')) {
                    const eqParts = rest.split('=');
                    let lhs = eqParts[0].trim();
                    let rhs = eqParts.slice(1).join('=').trim();
                    if (lhs.includes(':')) {
                        varName = lhs.split(':')[0].trim();
                    } else {
                        varName = lhs;
                    }
                    varValue = rhs;
                } else if (rest.includes(':')) {
                    varName = rest.split(':')[0].trim();
                } else {
                    varName = rest;
                }

                if (inClass) {
                    content = `${varName} = ${varValue}`;
                } else {
                    declaredVars.add(varName);
                    content = `__scope["${varName}"] = ${varValue}; var ${varName} = __scope["${varName}"]`;
                }
            }

            // func nome(parametri) -> Ritorno:
            else if (content.startsWith('func ')) {
                let funcHeader = content.substring(5).trim();
                if (funcHeader.includes('->')) {
                    funcHeader = funcHeader.split('->')[0].trim();
                }
                const nameMatch = funcHeader.match(/^([a-zA-Z0-9_]+)\s*\((.*)\)/);
                if (nameMatch) {
                    const funcName = nameMatch[1];
                    const rawParams = nameMatch[2];
                    const cleanParams = rawParams.split(',').map(p => {
                        let cleanP = p.trim();
                        if (cleanP.includes(':')) cleanP = cleanP.split(':')[0].trim();
                        if (cleanP.includes('=')) cleanP = cleanP.split('=')[0].trim();
                        return cleanP;
                    }).filter(Boolean).join(', ');

                    if (inClass && funcName === '_init') {
                        content = `constructor(${cleanParams})`;
                    } else if (inClass) {
                        content = `${funcName}(${cleanParams})`;
                    } else if (funcName === '_ready' || funcName === '_process') {
                        declaredVars.add(funcName);
                        content = `async function ${funcName}(${cleanParams})`;
                    } else {
                        declaredVars.add(funcName);
                        content = `function ${funcName}(${cleanParams})`;
                    }
                }
            }

            // elif -> else if
            else if (content.startsWith('elif ')) {
                content = `else if (${content.substring(5).trim()})`;
            }

            // if
            else if (content.startsWith('if ')) {
                content = `if (${content.substring(3).trim()})`;
            }

            // else
            else if (content === 'else') {
                content = `else`;
            }

            // for item in array / range
            else if (content.startsWith('for ')) {
                const forMatch = content.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.+)$/);
                if (forMatch) {
                    const loopVar = forMatch[1];
                    const iterable = forMatch[2];
                    content = `for (let ${loopVar} of ${iterable})`;
                }
            }

            // while
            else if (content.startsWith('while ')) {
                content = `while (${content.substring(6).trim()})`;
            }

            // pass
            else if (content === 'pass') {
                content = `/* pass */`;
            }

            // match
            else if (content.startsWith('match ')) {
                content = `switch (${content.substring(6).trim()})`;
            }

            // print
            content = content.replace(/\bprint\s*\(/g, '__gd_print(');

            // Vector2 istanziazione
            content = content.replace(/\bVector2\s*\(/g, 'new Vector2(');

            // range / len / str
            content = content.replace(/\brange\s*\(/g, '__gd_range(');
            content = content.replace(/\blen\s*\(/g, '__gd_len(');
            content = content.replace(/\bstr\s*\(/g, '__gd_str(');

            // Operatore $ di Godot per nodi ($NomeNodo -> get_node("NomeNodo"))
            // 1. $"Nome con Spazi"
            content = content.replace(/\$("([^"]+)"|'([^']+)')/g, (_, d1, s1) => `get_node("${d1 || s1}")`);
            // 2. Maschera stringhe letterali per non alterare simboli $ nei testi (es. "$100")
            const strTokens = [];
            content = content.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (m) => {
                strTokens.push(m);
                return `__STR_LIT_${strTokens.length - 1}__`;
            });
            // 3. Sostituisci $Nome e $Padre/Figlio con get_node("...")
            content = content.replace(/\$([a-zA-Z0-9_]+(?:\/[a-zA-Z0-9_]+)*)/g, 'get_node("$1")');
            // 4. Ripristina stringhe letterali
            content = content.replace(/__STR_LIT_(\d+)__/g, (_, i) => strTokens[Number(i)]);

            // Operatori logici GDScript
            content = content.replace(/\band\b/g, '&&');
            content = content.replace(/\bor\b/g, '||');
            content = content.replace(/\bnot\b/g, '!');
            content = content.replace(/\bself\./g, 'this.');

            // Costruzione riga finale
            if (isBlockStart) {
                indentStack.push(currentIndent + 4);
                if (content.startsWith('class ')) {
                    blockTypes.push('CLASS');
                } else if (content.startsWith('async function ') || content.startsWith('function ') || inClass) {
                    blockTypes.push('FUNC');
                } else {
                    blockTypes.push(blockTypes[blockTypes.length - 1]);
                }
                pushJs(' '.repeat(currentIndent) + content + ' {');
                if (content.startsWith('class ')) {
                    pushJs(' '.repeat(currentIndent + 4) + `static new(...args) { return new ${currentClassName}(...args); }`);
                }
                // Guardia anti-ciclo infinito per while/for
                if (content.startsWith('while') || content.startsWith('for')) {
                    pushJs(' '.repeat(currentIndent + 4) + '__checkLoopTimeout();');
                }
            } else {
                pushJs(' '.repeat(currentIndent) + content + (content.endsWith(';') ? '' : ';'));
            }
        }

        // Chiudi tutti i blocchi pendenti
        while (indentStack.length > 1) {
            const poppedIndent = indentStack.pop();
            blockTypes.pop();
            if (classIndent !== -1) {
                if (indentStack.length === 1 || indentStack[indentStack.length - 1] <= classIndent) {
                    pushJs(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                    if (currentClassName) {
                        pushJs(`try { __scope["${currentClassName}"] = ${currentClassName}; } catch(e) {}`);
                    }
                    classIndent = -1;
                    currentClassName = '';
                } else {
                    pushJs(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                }
            } else {
                if (indentStack.length === 1) {
                    declaredVars.forEach(v => {
                        pushJs(' '.repeat(poppedIndent) + `try { __scope["${v}"] = ${v}; } catch(e) {}`);
                    });
                }
                pushJs(' '.repeat(indentStack[indentStack.length - 1]) + '}');
            }
        }

        // Variabili a livello globale / script
        declaredVars.forEach(v => {
            pushJs(`try { __scope["${v}"] = ${v}; } catch(e) {}`);
        });

        this.lastSourceMap = sourceMap;
        this.lastInputLines = lines;
        return jsLines.join('\n');
    },

    // Esecuzione protetta con cattura di output e variabili
    // Costruisce la scena iniziale a partire dalla configurazione della lezione
    buildScene(lesson) {
        const root = new GD_Node("Root");
        if (lesson && Array.isArray(lesson.initialNodes)) {
            for (const spec of lesson.initialNodes) {
                let node;
                if (spec.type === "Label") {
                    node = new GD_Label(spec.name);
                    if (spec.text !== undefined) node.text = spec.text;
                } else if (spec.type === "Button") {
                    node = new GD_Button(spec.name);
                    if (spec.text !== undefined) node.text = spec.text;
                } else if (spec.type === "Timer") {
                    node = new GD_Timer(spec.name);
                    if (spec.wait_time !== undefined) node.wait_time = spec.wait_time;
                } else if (spec.type === "ColorRect") {
                    node = new GD_ColorRect(spec.name);
                    if (spec.color !== undefined) node.color = spec.color;
                } else if (spec.type === "Node2D") {
                    node = new GD_Node2D(spec.name);
                } else {
                    node = new GD_Node(spec.name);
                }
                root.add_child(node);
            }
        }
        return root;
    },
    async execute(gdCode, options = {}) {
        let currentScene = (options && options.initialScene) ? options.initialScene : null;
        if (!currentScene && options && options.lesson && options.lesson.initialNodes) {
            currentScene = this.buildScene(options.lesson);
        }
        if (!currentScene) {
            currentScene = new GD_Node("Root");
        }
        const add_child = (n) => currentScene.add_child(n);
        const remove_child = (n) => currentScene.remove_child(n);
        const get_node = (p) => currentScene.get_node(p);
        const has_node = (p) => currentScene.has_node(p);
        const logs = [];
        const scope = (options && options.initialScope) ? Object.assign({}, options.initialScope) : {};
        let loopCounter = 0;
        const maxIterations = 50000;
        const startTime = Date.now();

        const customPrint = (...args) => {
            let res = '';
            for (let i = 0; i < args.length; i++) {
                const str = (args[i] === null || args[i] === undefined) ? "null" : (typeof args[i] === 'object' && args[i].toString ? args[i].toString() : String(args[i]));
                if (i === 0) {
                    res = str;
                } else {
                    if (res.endsWith(' ') || str.startsWith(' ') || res.endsWith('(') || res.endsWith('[') || /^[,.:;!?\)\]]/.test(str)) {
                        res += str;
                    } else {
                        res += ' ' + str;
                    }
                }
            }
            logs.push(res);
            if (options && typeof options.onLog === 'function') {
                options.onLog(res);
            }
        };

        const checkLoop = () => {
            loopCounter++;
            if (loopCounter > maxIterations) {
                throw new Error("Timeout: Possibile ciclo infinito rilevato nel tuo codice!");
            }
        };

        let transpiledCode = '';
        try {
            transpiledCode = this.transpile(gdCode);
        } catch (syntaxErr) {
            const rawMsg = syntaxErr.message || String(syntaxErr);
            const lines = gdCode.split(/\r?\n/);
            let identifiedLine = null;
            let specificReason = "";

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                let singleQ = 0, doubleQ = 0;
                for (let c = 0; c < line.length; c++) {
                    if (line[c] === '"' && (c === 0 || line[c-1] !== '\\')) doubleQ++;
                    if (line[c] === "'" && (c === 0 || line[c-1] !== '\\')) singleQ++;
                }
                if (doubleQ % 2 !== 0 || singleQ % 2 !== 0) {
                    identifiedLine = i + 1;
                    specificReason = "Delimitazione stringa non chiusa (virgolette mancanti)";
                    break;
                }
            }

            const cleanMsg = rawMsg
                .replace(/<anonymous>:\d+(:\d+)?/g, '')
                .replace(/eval at execute\s*/g, '')
                .replace(/\s+at\s+Function\..*/g, '')
                .replace(/\(line \d+\)/gi, '')
                .trim();

            const finalError = identifiedLine 
                ? `Riga ${identifiedLine}: Errore di sintassi (${specificReason || cleanMsg})`
                : (cleanMsg.startsWith('Riga ') ? cleanMsg : `Errore di sintassi GDScript: ${cleanMsg}`);

            return {
                success: false,
                logs: [],
                error: finalError,
                scope: {},
                scene: currentScene,
                code: gdCode,
                transpiled: ''
            };
        }

        try {
            // Creazione sandbox esecutiva all'interno del blocco try
            const sandboxFunction = new Function(
                '__gd_print',
                '__checkLoopTimeout',
                '__scope',
                'Vector2',
                '__gd_range',
                '__gd_len',
                '__gd_str',
                'GD_Signal',
                'Node',
                'Label',
                'Button',
                'Timer',
                'ColorRect',
                'Node2D',
                'add_child',
                'remove_child',
                'get_node',
                'has_node',
                'root',
                'scene',
                `return (async () => {
                    ${transpiledCode}
                    if (typeof _ready === 'function') {
                        await _ready();
                    }
                    return __scope;
                })();`
            );

            await sandboxFunction(
                customPrint,
                checkLoop,
                scope,
                Vector2,
                __gd_range,
                __gd_len,
                __gd_str,
                GD_Signal,
                GD_Node,
                GD_Label,
                GD_Button,
                GD_Timer,
                GD_ColorRect,
                GD_Node2D,
                add_child,
                remove_child,
                get_node,
                has_node,
                currentScene,
                currentScene
            );

            return {
                success: true,
                logs: logs,
                error: null,
                scope: scope,
                scene: currentScene,
                code: gdCode,
                transpiled: transpiledCode
            };
        } catch (runtimeErr) {
            const rawMsg = runtimeErr.message || String(runtimeErr);
            const lines = gdCode.split(/\r?\n/);
            let identifiedLine = null;
            let specificReason = "";

            if (runtimeErr instanceof SyntaxError || runtimeErr.name === 'SyntaxError') {
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    let singleQ = 0, doubleQ = 0;
                    for (let c = 0; c < line.length; c++) {
                        if (line[c] === '"' && (c === 0 || line[c - 1] !== '\\')) doubleQ++;
                        if (line[c] === "'" && (c === 0 || line[c - 1] !== '\\')) singleQ++;
                    }
                    if (doubleQ % 2 !== 0 || singleQ % 2 !== 0) {
                        identifiedLine = i + 1;
                        specificReason = "Delimitazione stringa non chiusa (virgolette mancanti)";
                        break;
                    }
                }
            } else if (runtimeErr.stack) {
                const stackMatch = runtimeErr.stack.match(/<anonymous>:(\d+):(\d+)/) ||
                                   runtimeErr.stack.match(/eval:(\d+):(\d+)/) ||
                                   runtimeErr.stack.match(/Function:(\d+):(\d+)/);
                if (stackMatch) {
                    const funcLine = parseInt(stackMatch[1], 10);
                    const jsLineIdx = funcLine - 4;
                    if (this.lastSourceMap && jsLineIdx >= 0 && jsLineIdx < this.lastSourceMap.length) {
                        const candidate = this.lastSourceMap[jsLineIdx];
                        if (candidate && candidate > 0 && candidate <= lines.length) {
                            identifiedLine = candidate;
                        }
                    }
                }
            }

            const cleanMsg = rawMsg
                .replace(/<anonymous>:\d+(:\d+)?/g, '')
                .replace(/eval at execute\s*/g, '')
                .replace(/\s+at\s+Function\..*/g, '')
                .replace(/line \d+ of \S+/gi, '')
                .trim();

            const finalError = identifiedLine 
                ? `Riga ${identifiedLine}: ${specificReason ? `Errore di sintassi (${specificReason})` : cleanMsg}`
                : cleanMsg;

            return {
                success: false,
                logs: logs,
                error: finalError,
                scope: scope,
                scene: currentScene,
                code: gdCode,
                transpiled: transpiledCode
            };
        }
    }
};

// Esporta classi di Godot
if (typeof window !== 'undefined') {
    window.GDScriptRuntime = GDScriptRuntime;
    window.GD_Node = GD_Node;
    window.GD_Label = GD_Label;
    window.GD_Button = GD_Button;
    window.GD_Timer = GD_Timer;
    window.GD_ColorRect = GD_ColorRect;
    window.GD_Node2D = GD_Node2D;
    window.GD_Sprite2D = GD_Sprite2D;
    window.GD_CharacterBody2D = GD_CharacterBody2D;
    window.GD_ProgressBar = GD_ProgressBar;
    window.GD_AudioStreamPlayer2D = GD_AudioStreamPlayer2D;
}
