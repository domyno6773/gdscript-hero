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

// Transpiler da GDScript a JavaScript moderno
const GDScriptRuntime = {
    transpile(gdCode) {
        const lines = gdCode.split(/\r?\n/);
        const jsLines = [];
        const indentStack = [0];
        const declaredVars = new Set();
        let classIndent = -1;
        let currentClassName = '';

        for (let idx = 0; idx < lines.length; idx++) {
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
                if (classIndent !== -1) {
                    // Siamo all'interno di una classe
                    if (indentStack.length === 1 || indentStack[indentStack.length - 1] <= classIndent) {
                        // Stiamo chiudendo il corpo della classe
                        jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                        if (currentClassName) {
                            jsLines.push(`try { __scope["${currentClassName}"] = ${currentClassName}; } catch(e) {}`);
                        }
                        classIndent = -1;
                        currentClassName = '';
                    } else {
                        // Stiamo chiudendo un metodo dentro la classe
                        jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                    }
                } else {
                    // Chiusura di un normale blocco/funzione
                    if (indentStack.length === 1) {
                        declaredVars.forEach(v => {
                            jsLines.push(' '.repeat(poppedIndent) + `try { __scope["${v}"] = ${v}; } catch(e) {}`);
                        });
                    }
                    jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
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
                        content = `async function ${funcName}(${cleanParams})`;
                    } else {
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

            // Operatori logici GDScript
            content = content.replace(/\band\b/g, '&&');
            content = content.replace(/\bor\b/g, '||');
            content = content.replace(/\bnot\b/g, '!');
            content = content.replace(/\bself\./g, 'this.');

            // Costruzione riga finale
            if (isBlockStart) {
                indentStack.push(currentIndent + 4);
                jsLines.push(' '.repeat(currentIndent) + content + ' {');
                if (content.startsWith('class ')) {
                    jsLines.push(' '.repeat(currentIndent + 4) + `static new(...args) { return new ${currentClassName}(...args); }`);
                }
                // Guardia anti-ciclo infinito per while/for
                if (content.startsWith('while') || content.startsWith('for')) {
                    jsLines.push(' '.repeat(currentIndent + 4) + '__checkLoopTimeout();');
                }
            } else {
                jsLines.push(' '.repeat(currentIndent) + content + (content.endsWith(';') ? '' : ';'));
            }
        }

        // Chiudi tutti i blocchi pendenti
        while (indentStack.length > 1) {
            const poppedIndent = indentStack.pop();
            if (classIndent !== -1) {
                if (indentStack.length === 1 || indentStack[indentStack.length - 1] <= classIndent) {
                    jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                    if (currentClassName) {
                        jsLines.push(`try { __scope["${currentClassName}"] = ${currentClassName}; } catch(e) {}`);
                    }
                    classIndent = -1;
                    currentClassName = '';
                } else {
                    jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
                }
            } else {
                if (indentStack.length === 1) {
                    declaredVars.forEach(v => {
                        jsLines.push(' '.repeat(poppedIndent) + `try { __scope["${v}"] = ${v}; } catch(e) {}`);
                    });
                }
                jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
            }
        }

        // Variabili a livello globale / script
        declaredVars.forEach(v => {
            jsLines.push(`try { __scope["${v}"] = ${v}; } catch(e) {}`);
        });

        return jsLines.join('\n');
    },

    // Esecuzione protetta con cattura di output e variabili
    async execute(gdCode) {
        const logs = [];
        const scope = {};
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
        };

        const checkLoop = () => {
            loopCounter++;
            if (loopCounter > maxIterations || (Date.now() - startTime > 1500)) {
                throw new Error("Timeout: Possibile ciclo infinito rilevato nel tuo codice!");
            }
        };

        let transpiledCode = '';
        try {
            transpiledCode = this.transpile(gdCode);
        } catch (syntaxErr) {
            return {
                success: false,
                logs: [],
                error: `Errore di sintassi GDScript: ${syntaxErr.message}`,
                scope: {}
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
                GD_Signal
            );

            return {
                success: true,
                logs: logs,
                error: null,
                scope: scope,
                transpiled: transpiledCode
            };
        } catch (runtimeErr) {
            return {
                success: false,
                logs: logs,
                error: runtimeErr.message,
                scope: scope,
                transpiled: transpiledCode
            };
        }
    }
};
