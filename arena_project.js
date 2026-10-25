// ==========================================================================
// ARENA DEL GLADIATORE - Mini-Progetto Pratico Guidato per GDScript 4
// ==========================================================================

const ARENA_PROJECT_DATA = {
    id: "project_arena",
    title: "Arena del Gladiatore",
    icon: "⚔️",
    badge: "PROGETTO INTERATTIVO",
    badgeClass: "badge-playable",
    desc: "Programma un sistema di combattimento per gladiatori in GDScript 4: gestione punti vita con take_damage() e heal(), limiti di sopravvivenza, HUD reattivo ed esportazione per Godot Engine 4.",
    levelReq: "Capitolo 4 completato",
    estimatedTime: "30 min",
    topics: ["Variabili", "Funzioni", "Condizioni if/else", "HUD Grafico", "Godot 4 Export"],

    phases: [
        {
            phase: 1,
            title: "Fase 1: Inizializzazione e Variabili di Stato",
            subtitle: "Dichiara lo stato vitale del tuo gladiatore nell'arena",
            narrative: "Benvenuto nell'Arena di Roma! Prima di scendere nella sabbia, il tuo combattente deve avere un'identità e parametri vitali chiari.",
            task: `<ul>
                <li>Dichiara una variabile <code>var salute: int = 100</code> (salute iniziale).</li>
                <li>Dichiara una variabile <code>var salute_max: int = 100</code> (tetto massimo di punti vita).</li>
                <li>Dichiara una variabile <code>var nome: String = "Massimo"</code> (o un nome a tua scelta).</li>
                <li>Dichiara una variabile <code>var is_vivo: bool = true</code> (indica se il guerriero è ancora in piedi).</li>
                <li>All'interno di <code>func _ready():</code>, stampa un messaggio di ingresso nell'arena usando <code>print()</code> che includa il nome e la salute iniziale.</li>
            </ul>`,
            initialCode: `# FASE 1: Inizializzazione del Gladiatore
# Dichiara qui sotto le variabili: salute, salute_max, nome, is_vivo

func _ready():
    # Stampa il messaggio di benvenuto nell'arena:
    pass
`,
            solution: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func _ready():
    print("Gladiatore ", nome, " entra nell'Arena! Salute: ", salute)
`,
            hints: [
                {
                    level: 1,
                    type: "concept",
                    icon: "💭",
                    label: "Indizio Concettuale",
                    text: "Il gladiatore ha bisogno di conservare il suo stato in variabili dedicate. Pensa a 'salute_max' come al massimo contenitore e 'salute' come al livello attuale."
                },
                {
                    level: 2,
                    type: "structure",
                    icon: "🏗️",
                    label: "Guida alla Struttura",
                    text: "Dichiara le variabili all'inizio dello script con 'var', specificando i tipi ': int', ': String' e ': bool' per rispettare le buone pratiche di GDScript 4."
                },
                {
                    level: 3,
                    type: "example",
                    icon: "📝",
                    label: "Esempio Pratico",
                    text: "Esempio:\n```gdscript\nvar salute: int = 100\nvar salute_max: int = 100\nvar nome: String = \"Massimo\"\nvar is_vivo: bool = true\n\nfunc _ready():\n    print(\"Benvenuto \", nome, \" HP: \", salute)\n```"
                }
            ],
            validate: async (result, runtime) => {
                const checks = [];
                const scope = result.scope || {};
                const logs = result.logs || [];

                // 1. Nessun errore di esecuzione
                checks.push({
                    desc: "Il codice viene interpretato ed eseguito senza errori",
                    passed: result.success === true,
                    diff: result.error ? `Errore riscontrato: ${result.error}` : null
                });

                // 2. Controllo salute iniziale
                const hasSalute = typeof scope.salute === 'number' && scope.salute === 100;
                checks.push({
                    desc: "Variabile 'salute' dichiarata e impostata a 100",
                    passed: hasSalute,
                    diff: !hasSalute ? `Valore attuale: ${scope.salute !== undefined ? scope.salute : 'non definita'}` : null
                });

                // 3. Controllo salute_max
                const hasMax = typeof scope.salute_max === 'number' && scope.salute_max === 100;
                checks.push({
                    desc: "Variabile 'salute_max' dichiarata e impostata a 100",
                    passed: hasMax,
                    diff: !hasMax ? `Valore attuale: ${scope.salute_max !== undefined ? scope.salute_max : 'non definita'}` : null
                });

                // 4. Controllo nome e is_vivo
                const hasNome = typeof scope.nome === 'string' && scope.nome.trim().length > 0;
                const hasVivo = scope.is_vivo === true;
                checks.push({
                    desc: "Variabili 'nome' (stringa valida) e 'is_vivo' (true) inizializzate",
                    passed: hasNome && hasVivo,
                    diff: !hasNome ? "La variabile 'nome' deve essere una stringa non vuota." : (!hasVivo ? "La variabile 'is_vivo' deve essere inizialmente true." : null)
                });

                // 5. Output di benvenuto in console
                const printedWelcome = logs.some(l => l.toLowerCase().includes("arena") || l.toLowerCase().includes("salute") || l.toLowerCase().includes("100"));
                checks.push({
                    desc: "Messaggio di ingresso stampato a console in _ready()",
                    passed: printedWelcome,
                    diff: !printedWelcome ? "Non è stato rilevato alcun messaggio di benvenuto stampato con print()." : null
                });

                return checks;
            }
        },
        {
            phase: 2,
            title: "Fase 2: Gestione del Danno (take_damage)",
            subtitle: "Programma la reazione del gladiatore ai colpi nemici",
            narrative: "Nel colosseo i colpi volano veloci. Dobbiamo programmare una funzione che sottragga i punti vita e gestisca la sconfitta quando la salute scende a zero, impedendo valori negativi assurdi.",
            task: `<ul>
                <li>Mantieni le variabili della Fase 1 (<code>salute</code>, <code>salute_max</code>, <code>nome</code>, <code>is_vivo</code>).</li>
                <li>Dichiara la funzione <code>func take_damage(quantita: int):</code>.</li>
                <li>All'interno della funzione, sottrai <code>quantita</code> dalla <code>salute</code>.</li>
                <li>Usa una condizione <code>if salute <= 0:</code>:
                    <ul>
                        <li>Imposta <code>salute = 0</code> (clamp a zero: niente salute negativa!).</li>
                        <li>Imposta <code>is_vivo = false</code>.</li>
                        <li>Stampa un messaggio di sconfitta (es. <code>print(nome, " è stato sconfitto!")</code>).</li>
                    </ul>
                </li>
                <li>Altrimenti (<code>else:</code>):
                    <ul>
                        <li>Stampa il danno subito e la salute rimasta (es. <code>print(nome, " subisce ", quantita, " danni. HP rimasti: ", salute)</code>).</li>
                    </ul>
                </li>
            </ul>`,
            initialCode: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func _ready():
    print("Gladiatore ", nome, " pronto al combattimento!")

# FASE 2: Implementa qui sotto func take_damage(quantita: int):

`,
            solution: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func _ready():
    print("Gladiatore ", nome, " pronto al combattimento!")

func take_damage(quantita: int):
    salute -= quantita
    if salute <= 0:
        salute = 0
        is_vivo = false
        print(nome, " è stato sconfitto!")
    else:
        print(nome, " subisce ", quantita, " danni. Salute: ", salute)
`,
            hints: [
                {
                    level: 1,
                    type: "concept",
                    icon: "💭",
                    label: "Indizio Concettuale",
                    text: "Sottraendo il danno, la salute cala. Se il colpo è letale, la salute non deve mai rimanere a numeri sottozero come -20: azzerala a 0 e segna il guerriero come non più vivo."
                },
                {
                    level: 2,
                    type: "structure",
                    icon: "🏗️",
                    label: "Guida alla Struttura",
                    text: "Usa 'salute -= quantita'. Subito dopo, usa 'if salute <= 0:' per assegnare 'salute = 0' e 'is_vivo = false'. Usa 'else:' per il ramo in cui il gladiatore sopravvive."
                },
                {
                    level: 3,
                    type: "example",
                    icon: "📝",
                    label: "Esempio Pratico",
                    text: "Esempio analogo:\n```gdscript\nfunc subisci_colpo(danno: int):\n    salute -= danno\n    if salute <= 0:\n        salute = 0\n        is_vivo = false\n        print(\"K.O.!\")\n    else:\n        print(\"Colpo incassato. HP:\", salute)\n```"
                }
            ],
            validate: async (result, runtime) => {
                const checks = [];
                const userCode = result.code || "";

                // 1. Controllo dichiarazione funzione take_damage
                const hasFunc = /func\s+take_damage\s*\(\s*quantita(?:\s*:\s*int)?\s*\)/.test(userCode);
                checks.push({
                    desc: "Funzione 'take_damage(quantita)' dichiarata correttamente",
                    passed: hasFunc,
                    diff: !hasFunc ? "Assicurati di scrivere 'func take_damage(quantita: int):' con il parametro." : null
                });

                // 2. Test isolato danno moderato (40 danni)
                const simCode1 = `${userCode}
func __test_take_damage_40():
    salute = 100
    is_vivo = true
    take_damage(40)
    return { "salute": salute, "is_vivo": is_vivo }
`;
                try {
                    const simRes1 = await runtime.execute(simCode1);
                    const out1 = simRes1.scope.__test_take_damage_40 ? await simRes1.scope.__test_take_damage_40() : null;
                    const pass1 = out1 && out1.salute === 60 && out1.is_vivo === true;
                    checks.push({
                        desc: "take_damage(40) riduce correttamente la salute da 100 a 60 e mantiene is_vivo = true",
                        passed: !!pass1,
                        diff: !pass1 ? `Salute ottenuta: ${out1 ? out1.salute : 'null'}, is_vivo: ${out1 ? out1.is_vivo : 'null'}` : null
                    });
                } catch (e) {
                    checks.push({ desc: "Esecuzione take_damage(40)", passed: false, diff: e.message });
                }

                // 3. Test danno letale con over-damage (150 danni su 100 HP) -> clamp a 0
                const simCode2 = `${userCode}
func __test_take_damage_lethal():
    salute = 100
    is_vivo = true
    take_damage(150)
    return { "salute": salute, "is_vivo": is_vivo }
`;
                try {
                    const simRes2 = await runtime.execute(simCode2);
                    const out2 = simRes2.scope.__test_take_damage_lethal ? await simRes2.scope.__test_take_damage_lethal() : null;
                    const pass2 = out2 && out2.salute === 0 && out2.is_vivo === false;
                    checks.push({
                        desc: "take_damage(150) azzera la salute esattamente a 0 (clamp) e imposta is_vivo = false",
                        passed: !!pass2,
                        diff: !pass2 ? `Salute ottenuta: ${out2 ? out2.salute : 'null'} (atteso 0), is_vivo: ${out2 ? out2.is_vivo : 'null'} (atteso false)` : null
                    });
                } catch (e) {
                    checks.push({ desc: "Esecuzione take_damage letale", passed: false, diff: e.message });
                }

                return checks;
            }
        },
        {
            phase: 3,
            title: "Fase 3: La Tecnica di Guarigione (heal)",
            subtitle: "Cura le ferite rispettando i limiti biologici dell'arena",
            narrative: "Una pozione medica o un momento di respiro possono salvare la vita del gladiatore. Tuttavia, non puoi curare chi è già caduto e la salute non può mai superare la salute massima!",
            task: `<ul>
                <li>Mantieni tutto il codice delle Fasi 1 e 2.</li>
                <li>Dichiara la funzione <code>func heal(quantita: int):</code>.</li>
                <li>Verifica prima di tutto se il gladiatore è vivo con <code>if not is_vivo:</code> (oppure <code>if is_vivo == false:</code>):
                    <ul>
                        <li>Stampa un messaggio che avvisa che non è possibile curare un gladiatore sconfitto.</li>
                    </ul>
                </li>
                <li>Nel blocco alternativo (<code>else:</code>):
                    <ul>
                        <li>Aggiungi <code>quantita</code> a <code>salute</code>.</li>
                        <li>Se <code>salute > salute_max:</code> imposta <code>salute = salute_max</code> (clamp al massimo!).</li>
                        <li>Stampa la quantità curata e la salute attuale.</li>
                    </ul>
                </li>
            </ul>`,
            initialCode: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func _ready():
    print("Gladiatore ", nome, " pronto!")

func take_damage(quantita: int):
    salute -= quantita
    if salute <= 0:
        salute = 0
        is_vivo = false
        print(nome, " è stato sconfitto!")
    else:
        print(nome, " subisce ", quantita, " danni. Salute: ", salute)

# FASE 3: Implementa qui sotto func heal(quantita: int):

`,
            solution: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func _ready():
    print("Gladiatore ", nome, " pronto!")

func take_damage(quantita: int):
    salute -= quantita
    if salute <= 0:
        salute = 0
        is_vivo = false
        print(nome, " è stato sconfitto!")
    else:
        print(nome, " subisce ", quantita, " danni. Salute: ", salute)

func heal(quantita: int):
    if not is_vivo:
        print(nome, " è già sconfitto! Impossibile curare.")
    else:
        salute += quantita
        if salute > salute_max:
            salute = salute_max
        print(nome, " recupera ", quantita, " HP. Salute: ", salute)
`,
            hints: [
                {
                    level: 1,
                    type: "concept",
                    icon: "💭",
                    label: "Indizio Concettuale",
                    text: "Controlla prima la variabile 'is_vivo': se è falsa, la cura deve essere rifiutata. Se è vivo, somma la cura e assicurati che non oltrepassi 'salute_max'."
                },
                {
                    level: 2,
                    type: "structure",
                    icon: "🏗️",
                    label: "Guida alla Struttura",
                    text: "Usa 'if not is_vivo:' (o 'if is_vivo == false:') all'inizio di 'heal(quantita)'. Nel ramo 'else:', esegui 'salute += quantita' seguito da 'if salute > salute_max: salute = salute_max'."
                },
                {
                    level: 3,
                    type: "example",
                    icon: "📝",
                    label: "Esempio Pratico",
                    text: "Esempio analogo:\n```gdscript\nfunc cura(valore: int):\n    if not is_vivo:\n        print(\"Troppo tardi!\")\n    else:\n        salute += valore\n        if salute > salute_max:\n            salute = salute_max\n        print(\"Curato: \", salute)\n```"
                }
            ],
            validate: async (result, runtime) => {
                const checks = [];
                const userCode = result.code || "";

                // 1. Dichiarazione func heal
                const hasHeal = /func\s+heal\s*\(\s*quantita(?:\s*:\s*int)?\s*\)/.test(userCode);
                checks.push({
                    desc: "Funzione 'heal(quantita)' dichiarata correttamente",
                    passed: hasHeal,
                    diff: !hasHeal ? "Assicurati di dichiarare 'func heal(quantita: int):'." : null
                });

                // 2. Test cura normale (da 50 a 80 con heal(30))
                const simCode1 = `${userCode}
func __test_heal_normal():
    salute = 50
    is_vivo = true
    salute_max = 100
    heal(30)
    return { "salute": salute, "is_vivo": is_vivo }
`;
                try {
                    const simRes1 = await runtime.execute(simCode1);
                    const out1 = simRes1.scope.__test_heal_normal ? await simRes1.scope.__test_heal_normal() : null;
                    const pass1 = out1 && out1.salute === 80;
                    checks.push({
                        desc: "heal(30) su 50 HP incrementa la salute a 80 HP",
                        passed: !!pass1,
                        diff: !pass1 ? `Salute ottenuta: ${out1 ? out1.salute : 'null'} (atteso 80)` : null
                    });
                } catch (e) {
                    checks.push({ desc: "Esecuzione heal normale", passed: false, diff: e.message });
                }

                // 3. Test over-healing (cura eccedente oltre salute_max)
                const simCode2 = `${userCode}
func __test_heal_cap():
    salute = 80
    is_vivo = true
    salute_max = 100
    heal(50)
    return { "salute": salute, "is_vivo": is_vivo }
`;
                try {
                    const simRes2 = await runtime.execute(simCode2);
                    const out2 = simRes2.scope.__test_heal_cap ? await simRes2.scope.__test_heal_cap() : null;
                    const pass2 = out2 && out2.salute === 100;
                    checks.push({
                        desc: "heal(50) su 80/100 HP blocca la salute a 100 (clamp a salute_max)",
                        passed: !!pass2,
                        diff: !pass2 ? `Salute ottenuta: ${out2 ? out2.salute : 'null'} (atteso 100)` : null
                    });
                } catch (e) {
                    checks.push({ desc: "Esecuzione heal clamp", passed: false, diff: e.message });
                }

                // 4. Test cura su gladiatore sconfitto (is_vivo == false)
                const simCode3 = `${userCode}
func __test_heal_dead():
    salute = 0
    is_vivo = false
    salute_max = 100
    heal(40)
    return { "salute": salute, "is_vivo": is_vivo }
`;
                try {
                    const simRes3 = await runtime.execute(simCode3);
                    const out3 = simRes3.scope.__test_heal_dead ? await simRes3.scope.__test_heal_dead() : null;
                    const pass3 = out3 && out3.salute === 0 && out3.is_vivo === false;
                    checks.push({
                        desc: "heal(40) su gladiatore sconfitto (is_vivo = false) rifiuta la cura (HP resta a 0)",
                        passed: !!pass3,
                        diff: !pass3 ? `Salute ottenuta: ${out3 ? out3.salute : 'null'} (atteso 0), is_vivo: ${out3 ? out3.is_vivo : 'null'}` : null
                    });
                } catch (e) {
                    checks.push({ desc: "Esecuzione heal su sconfitto", passed: false, diff: e.message });
                }

                return checks;
            }
        },
        {
            phase: 4,
            title: "Fase 4: Integrazione HUD & Arena Completa",
            subtitle: "Unisci logica e interfaccia grafica per il combattimento finale",
            narrative: "Il nostro Gladiatore è completo di attacco e recupero! Ora definiamo una funzione di stato 'get_status()' e testiamo l'intera sequenza di battaglia collegandola all'HUD visivo.",
            task: `<ul>
                <li>Mantieni tutto il codice delle fasi precedenti.</li>
                <li>Dichiara la funzione <code>func get_status() -> String:</code> che restituisce lo stato del gladiatore:
                    <ul>
                        <li>Se <code>not is_vivo:</code> restituisci <code>"Sconfitto"</code>.</li>
                        <li>Altrimenti se <code>salute < 35:</code> restituisci <code>"Critico"</code>.</li>
                        <li>Altrimenti se <code>salute < 70:</code> restituisci <code>"Ferito"</code>.</li>
                        <li>Altrimenti (<code>else:</code>): restituisci <code>"In Forma"</code>.</li>
                    </ul>
                </li>
                <li>In <code>func _ready():</code>, esegui la sequenza di simulazione dell'Arena:
                    <ol>
                        <li>Stampa lo stato iniziale chiamando <code>get_status()</code>.</li>
                        <li>Subisci 40 danni con <code>take_damage(40)</code>.</li>
                        <li>Curati di 15 con <code>heal(15)</code>.</li>
                        <li>Subisci un fendente letale di 90 danni con <code>take_damage(90)</code>.</li>
                        <li>Tenta una cura impossibile con <code>heal(30)</code>.</li>
                        <li>Stampa lo stato finale con <code>get_status()</code>.</li>
                    </ol>
                </li>
            </ul>`,
            initialCode: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func take_damage(quantita: int):
    salute -= quantita
    if salute <= 0:
        salute = 0
        is_vivo = false
        print(nome, " è stato sconfitto!")
    else:
        print(nome, " subisce ", quantita, " danni. Salute: ", salute)

func heal(quantita: int):
    if not is_vivo:
        print(nome, " è già a terra! Impossibile curare.")
    else:
        salute += quantita
        if salute > salute_max:
            salute = salute_max
        print(nome, " recupera ", quantita, " HP. Salute: ", salute)

# FASE 4: Implementa func get_status() -> String e la simulazione in _ready()

func _ready():
    pass
`,
            solution: `var salute: int = 100
var salute_max: int = 100
var nome: String = "Massimo"
var is_vivo: bool = true

func take_damage(quantita: int):
    salute -= quantita
    if salute <= 0:
        salute = 0
        is_vivo = false
        print(nome, " è stato sconfitto!")
    else:
        print(nome, " subisce ", quantita, " danni. Salute: ", salute)

func heal(quantita: int):
    if not is_vivo:
        print(nome, " è già a terra! Impossibile curare.")
    else:
        salute += quantita
        if salute > salute_max:
            salute = salute_max
        print(nome, " recupera ", quantita, " HP. Salute: ", salute)

func get_status() -> String:
    if not is_vivo:
        return "Sconfitto"
    elif salute < 35:
        return "Critico"
    elif salute < 70:
        return "Ferito"
    else:
        return "In Forma"

func _ready():
    print("Stato iniziale: ", get_status())
    take_damage(40)
    heal(15)
    take_damage(90)
    heal(30)
    print("Stato finale: ", get_status())
`,
            hints: [
                {
                    level: 1,
                    type: "concept",
                    icon: "💭",
                    label: "Indizio Concettuale",
                    text: "La funzione 'get_status' usa una catena if/elif/else per valutare le soglie di salute in ordine logico. Ricorda di restituire la stringa con 'return'."
                },
                {
                    level: 2,
                    type: "structure",
                    icon: "🏗️",
                    label: "Guida alla Struttura",
                    text: "Usa: 'if not is_vivo: return \"Sconfitto\"' poi 'elif salute < 35: return \"Critico\"' poi 'elif salute < 70: return \"Ferito\"' ed infine 'else: return \"In Forma\"'."
                },
                {
                    level: 3,
                    type: "example",
                    icon: "📝",
                    label: "Esempio Pratico",
                    text: "Esempio:\n```gdscript\nfunc get_status() -> String:\n    if not is_vivo:\n        return \"Sconfitto\"\n    elif salute < 35:\n        return \"Critico\"\n    elif salute < 70:\n        return \"Ferito\"\n    else:\n        return \"In Forma\"\n```"
                }
            ],
            validate: async (result, runtime) => {
                const checks = [];
                const userCode = result.code || "";
                const scope = result.scope || {};

                // 1. Controllo get_status()
                const hasStatusFunc = /func\s+get_status\s*\(\s*\)/.test(userCode);
                checks.push({
                    desc: "Funzione 'get_status()' definita nello script",
                    passed: hasStatusFunc,
                    diff: !hasStatusFunc ? "Definisci 'func get_status() -> String:'." : null
                });

                // 2. Test delle soglie di get_status
                const testStatusScript = `${userCode}
func __test_status_thresholds():
    var res = []
    salute = 100
    is_vivo = true
    res.push(get_status()) # In Forma
    salute = 50
    res.push(get_status()) # Ferito
    salute = 20
    res.push(get_status()) # Critico
    salute = 0
    is_vivo = false
    res.push(get_status()) # Sconfitto
    return res
`;
                try {
                    const statusRes = await runtime.execute(testStatusScript);
                    const outcomes = statusRes.scope.__test_status_thresholds ? await statusRes.scope.__test_status_thresholds() : [];
                    const okForma = outcomes[0] === "In Forma";
                    const okFerito = outcomes[1] === "Ferito";
                    const okCritico = outcomes[2] === "Critico";
                    const okSconfitto = outcomes[3] === "Sconfitto";
                    const allOk = okForma && okFerito && okCritico && okSconfitto;
                    checks.push({
                        desc: "get_status() valuta correttamente tutte le 4 soglie (In Forma, Ferito, Critico, Sconfitto)",
                        passed: allOk,
                        diff: !allOk ? `Risultati ricevuti: [${outcomes.join(', ')}]` : null
                    });
                } catch (e) {
                    checks.push({ desc: "Valutazione get_status", passed: false, diff: e.message });
                }

                // 3. Verifica simulazione completa in _ready()
                // A fine _ready: salute deve essere 0 e is_vivo deve essere false
                const endSalute = scope.salute === 0;
                const endVivo = scope.is_vivo === false;
                checks.push({
                    desc: "La simulazione in _ready() viene eseguita (gladiatore subisce danni e termina a 0 HP)",
                    passed: endSalute && endVivo,
                    diff: !endSalute ? `Salute finale attesa 0, trovata: ${scope.salute}` : (!endVivo ? `is_vivo atteso false, trovato: ${scope.is_vivo}` : null)
                });

                return checks;
            }
        }
    ],

    // Generatore di file GDScript 4 pronto per il download
    exportGdScript: (userCode, gladiatorName = "Massimo") => {
        let cleanCode = (userCode || "").trim();
        // Rimuove eventuali 'class_name' o 'extends' ridondanti scritti dall'utente
        cleanCode = cleanCode.replace(/^class_name\s+[A-Za-z0-9_]+\s*\r?\n/m, '');
        cleanCode = cleanCode.replace(/^extends\s+[A-Za-z0-9_]+\s*\r?\n/m, '');

        return `# ==============================================================================
# PROGETTO GDScript 4: Arena del Gladiatore
# Generato da GDScript Hero
# Compatibile con: Godot Engine 4.0 / 4.1 / 4.2 / 4.3+
# ==============================================================================
class_name Gladiator
extends Node2D

# --- PROPRIETA E LOGICA DEL GLADIATORE (Scritto dallo Studente) ---
${cleanCode}

# --- INTEGRAZIONE AUTOMATICA HUD GODOT 4 ---
func _notification(what: int) -> void:
    if what == NOTIFICATION_READY:
        update_hud()

func update_hud(progress_bar: ProgressBar = null, status_label: Label = null, name_label: Label = null) -> void:
    if progress_bar == null and has_node("CanvasLayer/HUD/Panel/HealthBar"):
        progress_bar = get_node("CanvasLayer/HUD/Panel/HealthBar") as ProgressBar
    if status_label == null and has_node("CanvasLayer/HUD/Panel/StatusLabel"):
        status_label = get_node("CanvasLayer/HUD/Panel/StatusLabel") as Label
    if name_label == null and has_node("CanvasLayer/HUD/Panel/GladiatorName"):
        name_label = get_node("CanvasLayer/HUD/Panel/GladiatorName") as Label

    if name_label != null and "nome" in self:
        name_label.text = "⚔️ " + str(nome) + " il Gladiatore"
    if progress_bar != null:
        progress_bar.max_value = salute_max
        progress_bar.value = salute
    if status_label != null:
        if has_method("get_status"):
            status_label.text = "Stato: " + str(get_status()) + " (" + str(salute) + "/" + str(salute_max) + " HP)"
        else:
            status_label.text = "Salute: " + str(salute) + "/" + str(salute_max)
`;
    },

    // Generatore di file di configurazione progetto Godot 4 (project.godot)
    exportGodotProject: (projectName = "Arena del Gladiatore") => {
        return `config_version=5

[application]
config/name="${projectName}"
run/main_scene="res://gladiator_arena.tscn"
config/features=PackedStringArray("4.3", "Forward Plus")

[display]
window/size/viewport_width=1152
window/size/viewport_height=648
`;
    },

    // Generatore di Scena Testuale Godot 4 (.tscn)
    exportGodotScene: (scriptFileName = "gladiator.gd") => {
        return `[gd_scene load_steps=2 format=3 uid="uid://c6v8y2x7gladiator"]

[ext_resource type="Script" path="res://${scriptFileName}" id="1_gladiator_script"]

[node name="ArenaDelGladiatore" type="Node2D"]
script = ExtResource("1_gladiator_script")

[node name="CanvasLayer" type="CanvasLayer" parent="."]

[node name="HUD" type="Control" parent="CanvasLayer"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="Panel" type="Panel" parent="CanvasLayer/HUD"]
layout_mode = 0
offset_left = 32.0
offset_top = 32.0
offset_right = 380.0
offset_bottom = 160.0

[node name="GladiatorName" type="Label" parent="CanvasLayer/HUD/Panel"]
layout_mode = 0
offset_left = 16.0
offset_top = 12.0
offset_right = 260.0
offset_bottom = 38.0
theme_override_font_sizes/font_size = 18
text = "⚔️ Massimo il Gladiatore"

[node name="HealthBar" type="ProgressBar" parent="CanvasLayer/HUD/Panel"]
layout_mode = 0
offset_left = 16.0
offset_top = 46.0
offset_right = 330.0
offset_bottom = 74.0
max_value = 100.0
value = 100.0
show_percentage = true

[node name="StatusLabel" type="Label" parent="CanvasLayer/HUD/Panel"]
layout_mode = 0
offset_left = 16.0
offset_top = 86.0
offset_right = 330.0
offset_bottom = 112.0
text = "Stato: In Forma (100/100 HP)"
`;
    }
};

// Esporta globalmente
if (typeof window !== 'undefined') {
    window.ARENA_PROJECT_DATA = ARENA_PROJECT_DATA;
}
