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

// Transpiler da GDScript a JavaScript moderno
const GDScriptRuntime = {
    transpile(gdCode) {
        const lines = gdCode.split(/\r?\n/);
        const jsLines = [];
        const indentStack = [0];
        const declaredVars = new Set();

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
                // Prima di chiudere una funzione (livello 4 -> 0), sincronizza le variabili
                if (indentStack.length === 1) {
                    declaredVars.forEach(v => {
                        jsLines.push(' '.repeat(poppedIndent) + `try { __scope["${v}"] = ${v}; } catch(e) {}`);
                    });
                }
                jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
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

            // var name: Type = Val  OPPURE  const name: Type = Val
            if (content.startsWith('var ') || content.startsWith('const ')) {
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

                declaredVars.add(varName);
                content = `__scope["${varName}"] = ${varValue}; let ${varName} = __scope["${varName}"]`;
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

                    content = `async function ${funcName}(${cleanParams})`;
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

            // Costruzione riga finale
            if (isBlockStart) {
                indentStack.push(currentIndent + 4);
                jsLines.push(' '.repeat(currentIndent) + content + ' {');
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
            if (indentStack.length === 1) {
                declaredVars.forEach(v => {
                    jsLines.push(' '.repeat(poppedIndent) + `try { __scope["${v}"] = ${v}; } catch(e) {}`);
                });
            }
            jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
        }

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
            const formatted = args.map(a => {
                if (a === null) return "null";
                if (a === undefined) return "null";
                if (typeof a === 'object' && a.toString) return a.toString();
                return String(a);
            }).join(' ');
            logs.push(formatted);
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
                __gd_str
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
