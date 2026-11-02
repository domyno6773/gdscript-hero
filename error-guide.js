'use strict';
/* Debug didattico: interpreta i messaggi autentici di Godot senza inventare
 * righe o sostituire il motore GDScript. Le modifiche al codice restano dell'utente.
 */
(function (root) {
  const cut = (value, max = 1600) => String(value ?? '').trim().slice(0, max);
  const lineOf = (message, source) => {
    const total = String(source || '').split('\n').length;
    // Godot Web può indicare uno script temporaneo come gdscript://-12345.gd:4.
    const patterns = [
      /(?:res|user|gdscript):\/\/[^\s()]*?\.gd:(\d+)(?::\d+)?\b/i,
      /(?:^|[\s(])(?:[^\s()]*?\/)?[^\s():]+\.gd:(\d+)(?::\d+)?\b/i,
      /\b(?:line|riga)\s*(\d+)\b/i
    ];
    for (const pattern of patterns) {
      const match = String(message || '').match(pattern);
      if (!match) continue;
      const godotLine = Number(match[1]);
      // Il runner inserisce "extends Node\\n" prima del codice se manca extends.
      // I numeri restituiti dallo script GDScript temporaneo sono quindi +1.
      // Correggiamo soltanto quei percorsi: file esterni / messaggi generici
      // non hanno una mappatura affidabile con l'editor dello studente.
      const generatedScript = /gdscript:\/\/[^\s()]*?\.gd:\d+/i.test(match[0]);
      const hasExtends = /^\s*extends\s+/m.test(String(source || ''));
      const line = generatedScript && !hasExtends ? godotLine - 1 : godotLine;
      if (Number.isSafeInteger(line) && line > 0 && line <= total) return line;
    }
    return null;
  };
  // La guida parte da un controllo semplice; gli indizi successivi si aprono
  // su richiesta e non includono mai la soluzione completa.
  const rules = [
    {
      pattern: /expected\s*["']?:["']?|expected.*colon|missing.*colon/i,
      title: 'Mancano i due punti (:)',
      why: 'Godot non riconosce la fine di un’istruzione che dovrebbe aprire un blocco.',
      hint: 'Guarda la fine della riga segnalata: come si indica l’inizio di un blocco in GDScript?',
      steps: [
        'Un if, un ciclo o una funzione introduce un gruppo di istruzioni. Il simbolo che apre quel gruppo si trova alla fine della sua riga.',
        'Confronta l’ultima parte della riga con un esempio nella teoria. Dopo l’apertura, le istruzioni del blocco vanno anche rientrate.'
      ]
    },
    {
      pattern: /indent|unindent|tabs and spaces|mixed tabs|expected.*indented/i,
      title: 'Il rientro del codice non è corretto',
      why: 'Godot usa il rientro per capire quali righe appartengono allo stesso blocco.',
      hint: 'Confronta la posizione della riga segnalata con le istruzioni vicine.',
      steps: [
        'Le istruzioni dentro func, if o for devono avere un rientro rispetto alla riga che apre il blocco.',
        'Guarda il rientro della prima istruzione del blocco e rendi coerenti le righe dello stesso livello. Evita di mescolare tabulazioni e spazi.'
      ]
    },
    {
      pattern: /unterminated string|unclosed string|expected closing.*quote|string not terminated/i,
      title: 'C’è un testo non chiuso',
      why: 'Godot ha trovato un testo iniziato con le virgolette senza riuscire a trovarne la fine.',
      hint: 'Conta le virgolette presenti nella zona indicata.',
      steps: [
        'Una stringa inizia e termina con lo stesso tipo di virgolette.',
        'Controlla il testo passato alle funzioni nelle righe coinvolte: verifica che ogni apertura abbia la sua chiusura.'
      ]
    },
    {
      pattern: /identifier.*(not declared|not found)|unknown identifier|not declared in the current scope|undeclared identifier/i,
      title: 'Un nome non è riconosciuto',
      why: 'Stai usando un nome che Godot non conosce nel punto in cui lo hai scritto.',
      hint: 'Dove viene creato o dichiarato questo nome?',
      steps: [
        'Una variabile deve esistere prima di poter essere usata e dev’essere visibile nella funzione o nel blocco corretto.',
        'Confronta carattere per carattere il nome usato con quello della dichiarazione: anche le maiuscole e le minuscole contano.'
      ]
    },
    {
      pattern: /invalid operands|invalid operator|cannot (?:convert|assign)|type mismatch|cannot be assigned/i,
      title: 'Stai combinando valori incompatibili',
      why: 'Godot non riesce a eseguire questa operazione con i tipi di dato presenti.',
      hint: 'Quali valori entrano nell’operazione? Sono numeri, testi o altri tipi?',
      steps: [
        'Per calcolare o confrontare valori, il tipo dei dati fa la differenza. Un testo non è automaticamente un numero.',
        'Controlla i valori prima dell’operazione e verifica se puoi usare tipi compatibili, senza cambiare l’obiettivo dell’esercizio.'
      ]
    },
    {
      pattern: /invalid (?:get|set)|nil|null instance|nonexistent function|invalid call/i,
      title: 'Chiamata o accesso non valido',
      why: 'Il programma prova a usare una proprietà o una funzione che l’oggetto non mette a disposizione.',
      hint: 'Controlla quale oggetto stai utilizzando e cosa stai chiedendogli di fare.',
      steps: [
        'Un metodo appartiene a determinati tipi di oggetto. Non tutte le funzioni funzionano su qualunque nodo o valore.',
        'Verifica che il riferimento non sia nullo e che il nome della funzione o della proprietà appartenga davvero al tipo usato.'
      ]
    },
    {
      pattern: /expected.*\)|expected.*\]|expected.*\}/i,
      title: 'Manca una chiusura',
      why: 'Godot ha trovato una parentesi o un altro delimitatore senza la sua chiusura.',
      hint: 'Controlla le aperture e le chiusure nella riga indicata.',
      steps: [
        'Ogni parentesi aperta richiede una parentesi dello stesso tipo per chiudere il gruppo.',
        'Controlla anche la riga prima di quella segnalata: a volte Godot si accorge del problema soltanto all’istruzione successiva.'
      ]
    }
  ];

  // Scansione lessicale locale, senza AI: evita falsi allarmi per caratteri
  // contenuti in stringhe, commenti o stringhe multilinea di GDScript.
  // Serve quando Godot segnala un altro problema prima del delimitatore aperto.
  function unclosedDelimiter(source) {
    const text=String(source||'');
    const closers={'(':')','[':']','{':'}'};
    const stack=[];
    let quote='', triple=false,escaped=false,comment=false,line=1;
    for(let i=0;i<text.length;i++){
      const ch=text[i];
      if(ch==='\n'){
        line++;
        comment=false;
        if(quote && !triple)escaped=false;
        continue;
      }
      if(comment)continue;
      if(quote){
        if(escaped){escaped=false;continue;}
        if(ch==='\\'){escaped=true;continue;}
        if(triple){
          if(text.slice(i,i+3)===quote.repeat(3)){quote='';triple=false;i+=2;}
        }else if(ch===quote)quote='';
        continue;
      }
      if(ch==='#'){comment=true;continue;}
      if(ch==='"'||ch==="'"){
        triple=text.slice(i,i+3)===ch.repeat(3);
        quote=ch;
        if(triple)i+=2;
        continue;
      }
      if(closers[ch])stack.push({open:ch,close:closers[ch],line});
      else if(ch===')'||ch===']'||ch==='}'){
        if(stack.at(-1)?.close===ch)stack.pop();
        else return null; // delimitatori non corrispondenti: lascia giudicare Godot
      }
    }
    if(quote||!stack.length)return null;
    return stack.at(-1);
  }
  function classBodyAdvice(message) {
    const match=String(message).match(/Unexpected (?:identifier|token) ["']([^"']+)["'] in class body/i);
    if(!match)return null;
    const name=match[1];
    return {
      title:'Istruzione fuori da una funzione',
      why:'Godot ha trovato "'+name+'" direttamente nel corpo dello script, ma qui possono stare dichiarazioni come var e func. Le istruzioni eseguibili, per esempio print(...), vanno dentro una funzione come func _ready(): e devono essere indentate.',
      hint:'Hai inserito questa istruzione dentro func _ready(): oppure dentro un’altra funzione?',
      steps:[
        'In GDScript le istruzioni vengono eseguite dentro funzioni. All’inizio dello script puoi invece dichiarare variabili, costanti e funzioni.',
        'Se vuoi eseguire una stampa all’avvio, usa una funzione come _ready() e indenta le istruzioni al suo interno.'
      ]
    };
  }
  function functionAdvice(message) {
    const match = String(message).match(/Function\s+["']([^"']+?)["']\s+not found in base self/i);
    if (!match) return null;
    const name = match[1].replace(/\(\)$/, '');
    return {
      title: 'Funzione non riconosciuta',
      why: 'Godot ha trovato la chiamata "' + name + '()", ma non conosce una funzione con questo nome in questo script.',
      hint: 'Rileggi il nome della funzione che hai scritto: potrebbe esserci una lettera in più, mancante o fuori posto.',
      steps: [
        'Ripensa allo scopo di questa riga: vuoi stampare un testo, eseguire un calcolo o richiamare una funzione creata da te? Cerca il comando corrispondente nella teoria.',
        'Confronta una lettera alla volta il nome nella riga con quello della funzione che hai studiato. Puoi aiutarti con i suggerimenti automatici dell’editor, senza riscrivere tutto il programma.'
      ]
    };
  }
  const literal = value => JSON.stringify(String(value ?? ''));
  function concreteAdvice(message, source, line, lesson) {
    const rows=String(source).split('\n');
    if(/expected.*indented block after.*(?:function|function declaration)/i.test(message)){
      let index=(line||rows.length)-1;
      while(index>=0&&!/^\s*(?:static\s+)?func\s+/.test(rows[index]))index--;
      if(index>=0){
        const name=rows[index].match(/func\s+(\w+)/)?.[1]||'questa funzione';
        const indent=rows[index].match(/^\s*/)[0].length;
        const body=[];let outside=null;
        for(let i=index+1;i<rows.length;i++){
          if(!rows[i].trim()||/^\s*#/.test(rows[i]))continue;
          if(rows[i].match(/^\s*/)[0].length<=indent){outside=rows[i];break;}
          body.push(rows[i]);
        }
        if(!body.length&&outside&&/^\s*(?:print\s*\(|return\b|if\b|for\b|while\b)/.test(outside))return {
          title:'L’istruzione non è dentro '+name+'()',why:'Dopo la dichiarazione della funzione, la riga '+literal(outside.trim())+' non ha un livello di rientro aggiuntivo. Godot la legge fuori dalla funzione e non trova il corpo richiesto.',
          hint:'Rientra l’istruzione sotto func '+name+'(): di un livello, come le altre istruzioni appartenenti alla funzione.',
          steps:['Usa quattro spazi oppure una tabulazione coerente per il livello interno, senza mescolare i due sistemi.','Le righe che appartengono allo stesso blocco devono partire dalla stessa colonna. I commenti da soli non formano un corpo eseguibile.']};
        if(!body.length)return {title:'La funzione '+name+'() è rimasta vuota',
          why:'Dopo '+name+'() Godot si aspetta almeno un’istruzione rientrata. Le righe che iniziano con # sono commenti: non vengono eseguite e non formano il corpo della funzione.',
          hint:'Controlla le righe sotto func '+name+'():. Lascia attiva almeno l’istruzione che deve essere eseguita; se vuoi una funzione volutamente vuota, usa pass con un livello di rientro.',
          steps:['Una riga come # print("Ciao!") non stampa nulla: il simbolo # esclude tutta la riga.',
            lesson?.manualLessonNumber===3?'In questa lezione deve restare attiva la stampa di Ciao!; va commentata soltanto quella di Arrivederci!.':'Inserisci il corpo richiesto dalla funzione. pass evita l’errore di sintassi in una funzione vuota, ma non realizza il comportamento richiesto dalla consegna.']};
      }
    }
    if(/tabs and spaces|mixed.*(?:tabs|spaces)|used.*(?:tabs|spaces).*indent/i.test(message))return {title:'Il rientro mescola tabulazioni e spazi',why:'Due righe possono sembrare allineate ma usare caratteri diversi per il rientro. Godot richiede uno stile coerente nello stesso blocco.',hint:'Cancella il rientro della riga segnalata e reinseriscilo con lo stesso tipo di caratteri delle righe vicine.',steps:['Non inserire una tabulazione davanti a spazi già presenti.','Allinea le istruzioni dello stesso blocco e aumenta il rientro solo dopo una riga che apre un nuovo blocco con :.']};
    const operands=message.match(/Invalid operands ["']([^"']+)["'] and ["']([^"']+)["'] for ["']([^"']+)["']/i);
    if(operands)return {title:'L’operatore '+operands[3]+' riceve tipi incompatibili',why:'Godot sta applicando '+operands[3]+' a un valore '+operands[1]+' e a un valore '+operands[2]+'. Questa combinazione non è ammessa per l’operatore indicato.',hint:'Controlla da dove arrivano i due valori. stdin restituisce testo: per un calcolo usa int() o float(); per comporre un messaggio converti il numero con str() o usa la formattazione.',steps:['Non basta che una stringa contenga cifre: "12" resta un testo finché non viene convertita.','Esegui la conversione prima dell’operazione, scegliendo il tipo in base a ciò che la riga deve fare.']};
    const identifier=message.match(/Identifier\s+["']([^"']+)["'].*not declared/i);
    if(identifier){
      const name=identifier[1];
      const declarations=[...source.matchAll(/^\s*(?:var|const|func)\s+([A-Za-z_]\w*)/gm)].map(m=>m[1]);
      const similar=declarations.find(n=>n!==name&&n.replace(/_/g,'').toLowerCase()===name.replace(/_/g,'').toLowerCase());
      return {title:'Il nome '+literal(name)+' non è dichiarato',
        why:'Nella riga indicata usi '+literal(name)+', ma Godot non trova una variabile, un parametro o una funzione con questo nome nel blocco corrente.'+(similar?' Nel tuo script è invece dichiarato '+literal(similar)+'. Maiuscole, minuscole e underscore fanno parte del nome.':''),
        hint:similar?'Confronta '+literal(name)+' con '+literal(similar)+': usa lo stesso identificatore nella dichiarazione e nel suo utilizzo.':'Cerca la dichiarazione di '+name+' prima della riga che lo usa. Se è dentro un altro blocco, potrebbe non essere visibile qui.',
        steps:['Dichiarare una variabile significa introdurla con var, oppure riceverla come parametro di una funzione. Un’assegnazione a un nome inesistente non lo dichiara.',
          'Una variabile creata dentro un if o una funzione resta locale a quel blocco. Se deve essere usata fuori, dichiarala nel blocco che contiene entrambi i punti.']};
    }
    const bounds=message.match(/(?:out of bounds|out of range).*?(?:index\s*)?(-?\d+)/i)||message.match(/index\s+(-?\d+).*out of bounds/i);
    if(bounds)return {title:'L’indice non corrisponde a un elemento dell’array',why:'Godot ha rifiutato l’accesso a un indice fuori dai limiti dell’array. Gli indici partono da 0: l’ultimo indice non negativo è size() - 1.',hint:'Prima di leggere l’elemento, controlla l’indice e la dimensione dell’array usato nella riga indicata.',steps:['Se un array contiene 4 elementi, gli indici non negativi validi sono 0, 1, 2 e 3; l’indice 4 è già fuori limite.','In un ciclo sugli indici usa range(array.size()). Negli esercizi che definiscono slot non negativi, rifiuta anche gli indici minori di 0.']};
    if(/division by zero|divide by zero|modulo by zero/i.test(message))return {title:'Il divisore è zero',why:'L’operazione indicata usa 0 come divisore. La divisione o il resto con divisore zero non possono produrre il risultato richiesto.',hint:'Controlla il valore del divisore prima dell’operazione, anche dopo aver convertito l’input in numero.',steps:['Il controllo va eseguito prima della divisione: un if successivo non impedisce l’errore.','Nel ramo con divisore 0 restituisci o stampa il messaggio previsto dalla consegna; esegui il calcolo soltanto nell’altro ramo.']};
    const nil=message.match(/(?:Invalid (?:get|set).*?["']([^"']+)["']|Nonexistent function ["']([^"']+)["']).*(?:Nil|null)/i);
    if(nil)return {title:'Stai usando un riferimento nullo',why:'L’oggetto su cui tenti di usare '+literal(nil[1]||nil[2])+' vale null: non c’è un’istanza da cui leggere la proprietà o chiamare il metodo.',hint:'Risali alla riga che assegna questo oggetto: la ricerca potrebbe non aver trovato un elemento, oppure l’istanza non è stata creata.',steps:['Una variabile dichiarata senza un oggetto valido non mette automaticamente a disposizione proprietà e metodi.','Se una ricerca può restituire null, controlla il risultato prima di accedervi e gestisci il caso “non trovato” previsto dall’esercizio.']};
    return null;
  }
  function requirementAdvice(lesson, source, failedTest, output, expected) {
    const hints=(lesson?.hints||[]).map(h=>typeof h==='string'?h:h.text).filter(Boolean);
    const n=lesson?.manualLessonNumber;
    if(n===3){
      const farewell=/^\s*print\s*\(\s*["']Arrivederci!["']\s*\)/m.test(source);
      const commented=/^\s*#\s*print\s*\(\s*["']Arrivederci!["']\s*\)/m.test(source);
      return {title:farewell?'La stampa di Arrivederci! è ancora attiva':'Devi conservare la riga come commento',
        why:farewell?'Il tuo codice esegue ancora print("Arrivederci!"). La consegna richiede che questa riga resti nel file, ma non venga eseguita; l’unico messaggio deve essere Ciao!.':!commented?'La riga originale che stampa Arrivederci! non risulta conservata come commento. Cancellarla non soddisfa l’obiettivo: qui devi esercitarti con il simbolo #.':'La stampa di Arrivederci! è commentata: controlla che quella di Ciao! sia ancora attiva e produca esattamente il messaggio richiesto.',
        hint:'Lascia attiva print("Ciao!") e aggiungi # davanti alla sola riga print("Arrivederci!"). Non commentare entrambe le stampe.',steps:hints};
    }
    const diff=String(failedTest?.diff||'');
    const pair=diff.match(/(?:Risultato previsto|Atteso):\n([\s\S]*?)\nRicevuto:\n([\s\S]*)/);
    const wanted=pair?pair[1]:expected,actual=pair?pair[2]:output;
    if(wanted!==undefined&&actual!==undefined&&String(wanted).trimEnd()!==String(actual).trimEnd()){
      const a=String(actual).replace(/\r/g,'').trimEnd().split('\n'),b=String(wanted).replace(/\r/g,'').trimEnd().split('\n');
      let i=0;while(i<Math.max(a.length,b.length)&&a[i]===b[i])i++;
      return {title:'L’output differisce alla riga '+(i+1),
        why:'Il programma è stato eseguito. '+(b[i]===undefined?'Non è richiesta un’altra riga di output.':'Alla riga '+(i+1)+' è richiesto '+literal(b[i])+'.')+' '+(a[i]===undefined?'Il tuo programma non ha prodotto questa riga.':'Il tuo codice ha prodotto '+literal(a[i])+'.')+(failedTest?.desc?' Controllo: '+failedTest.desc+'.':''),
        hint:hints[0]||'Controlla l’istruzione che produce questa riga: verifica il valore usato e il testo stampato, compresi spazi e maiuscole.',
        steps:hints.length?hints:[failedTest?.desc||'Esamina il controllo non superato.',diff||'Correggi l’istruzione che produce la riga diversa.']};
    }
    return {title:failedTest?.desc||'Un requisito della consegna non è soddisfatto',
      why:diff||'Il controllo «'+(failedTest?.desc||'requisito della lezione')+'» non è superato. Un output corretto da solo non dimostra che sia stata usata la struttura richiesta.',
      hint:hints[0]||'Controlla il requisito riportato sopra e l’istruzione che dovrebbe realizzarlo.',steps:hints.length?hints:[failedTest?.desc,diff].filter(Boolean)};
  }
  function diagnose({source = '', error = '', failedTest = null, verdict = '', lesson = null, files = null, filename = null, output, expectedOutput} = {}) {
    const raw = cut(error);
    const failure = cut(failedTest?.diff || failedTest?.desc || '', 800);
    if (!raw && !failure) return null;

    const engine = Boolean(raw);
    let file=filename;
    let line = engine ? lineOf(raw, source) : null;
    if(engine&&files){
      const positions=Object.keys(files).map(name=>{
        const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        const match=raw.match(new RegExp('(?:^|[\\s(/])'+escaped+':(\\d+)','m'));
        return match?{name,line:Number(match[1]),index:match.index}:null;
      }).filter(Boolean).sort((a,b)=>a.index-b.index);
      const location=positions[0];
      if(location){file=location.name;source=files[file];line=location.line<=source.split('\n').length?location.line:null;}
      else {file=null;line=null;}
    }
    const infra = engine && /failed to fetch|networkerror|motore godot non disponibile|failed to load.*wasm|webassembly.*failed/i.test(raw);
    const timedOut = engine && !infra && (verdict === 'timeout' || /timed out|timeout|time limit exceeded/i.test(raw));
    const syntax = engine && !infra && !timedOut &&
      /parse error|parser error|syntax error|unexpected token|expected.*(?:colon|:|indent)|not declared in the current scope|function\s+["'][^"']+["']\s+not found in base self/i.test(raw);
    const missingClose = syntax ? unclosedDelimiter(source) : null;
    const category = infra ? 'system' : timedOut ? 'timeout' :
      !engine ? 'requirement' : syntax ? 'syntax' : 'runtime';
    let title, why, hint, steps;
    if (infra) {
      title = 'La verifica non è riuscita ad avviarsi';
      why = 'Il motore Godot non è disponibile in questo momento: questo non dimostra che il tuo codice sia sbagliato.';
      hint = 'Riprova la verifica. Se continua a non funzionare, ricarica la pagina.';
      steps = [];
    } else if (timedOut) {
      title = 'Il programma impiega troppo tempo';
      why = 'L’esecuzione non è terminata nel tempo disponibile.';
      hint = 'Controlla se il programma può terminare o se continua a ripetere le stesse istruzioni.';
      steps = [
        'Un ciclo while continua finché la condizione è vera. Che cosa deve accadere perché diventi falsa?',
        'Segui a mente due o tre iterazioni del ciclo: un valore cambia davvero, oppure rimane sempre uguale?'
      ];
    } else if (missingClose) {
      // Non basarsi solo sull'errore che Godot segnala per primo:
      // nello script libero, print("ciao" da' Unexpected identifier prima
      // di arrivare al delimitatore mancante.
      line = missingClose.line;
      const names={'(': 'parentesi', '[': 'parentesi quadra', '{': 'parentesi graffa'};
      title='Manca la '+names[missingClose.open]+' di chiusura: '+missingClose.close;
      why='Alla riga '+missingClose.line+' hai aperto '+missingClose.open+
        ' ma non hai inserito la corrispondente '+missingClose.close+
        '. La chiusura serve a completare la chiamata o l’espressione.';
      const isTopLevelPrint=String(source).split(/\r?\n/).some((row,index)=>
        index+1===missingClose.line && /^print\s*\(/.test(row));
      if(isTopLevelPrint && /Unexpected identifier ["']print["'] in class body/i.test(raw)){
        why+=' Godot segnala anche che print(...) è fuori da una funzione: inseriscila in _ready() o in un’altra funzione.';
      }
      hint='Cerca la '+missingClose.open+' aperta alla riga '+missingClose.line+
        ': con quale simbolo va chiusa?';
      steps=[
        'Ogni '+missingClose.open+' deve avere una '+missingClose.close+
          ', anche quando ci sono stringhe o altre parentesi dentro.',
        isTopLevelPrint
          ? 'Inoltre, per eseguire print all’avvio in Godot, scrivila dentro func _ready(): e rientra la chiamata.'
          : 'Rileggi l’istruzione dalla prima apertura e controlla che i delimitatori siano chiusi nell’ordine corretto.'
      ];
    } else if (engine) {
      const match = concreteAdvice(raw,source,line,lesson) || functionAdvice(raw) || classBodyAdvice(raw) || rules.find(rule => rule.pattern.test(raw));
      if (match) ({title, why, hint, steps} = match);
      else if (syntax) {
        title = 'Godot non riesce a leggere un’istruzione';
        why = 'Una parte del codice non segue la sintassi di GDScript, quindi il programma non può partire.';
        hint = 'Parti dalla zona segnalata e cerca un simbolo o un nome diverso dagli esempi studiati.';
        steps = [
          'Controlla i segni che formano la struttura delle istruzioni: virgolette, parentesi, due punti e rientro.',
          'Isola una sola istruzione e confrontala con un esempio della lezione. Verifica anche la riga precedente a quella segnalata.'
        ];
      } else {
        title = 'Un’istruzione si blocca durante l’esecuzione';
        why = 'Godot ha iniziato a elaborare il programma, ma non è riuscito a completare un’operazione.';
        hint = 'Chiediti quale valore o quale oggetto usa l’istruzione coinvolta.';
        steps = [
          'Controlla da dove provengono i valori usati in quel punto e se l’oggetto esiste davvero.',
          'Segui l’ordine delle istruzioni fino al punto in cui avviene il problema: un valore potrebbe non essere ancora pronto.'
        ];
      }
    } else {
      ({title,why,hint,steps}=requirementAdvice(lesson,source,failedTest,output,expectedOutput));
    }
    return Object.freeze({
      kind: engine ? 'engine' : 'requirement',
      category, title, why, hint, steps: Object.freeze([...(steps || [])]), line,
      raw: engine ? raw : '', message:engine?raw.split('\n').find(s=>s.trim()&&!/^\s*(?:at:|at |GDScript backtrace)/.test(s))||raw:'',
      file, sourceLine:line?String(source).split('\n')[line-1]||'':'',requirement: failure, exact: line !== null
    });
  }
  function clear(container) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (host) host.querySelectorAll(':scope > .gdh-debug-panel').forEach(node => node.remove());
  }
  function render(container, diagnosis, onLine, onHint) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (!host) return;
    clear(host);
    if (!diagnosis) return;
    const card = document.createElement('section');
    card.className = 'gdh-debug-panel';
    card.dataset.kind = diagnosis.kind;
    card.dataset.category = diagnosis.category;
    card.setAttribute('aria-label', 'Guida alla correzione');
    const top = document.createElement('div');
    top.className = 'gdh-debug-top';
    const tag = document.createElement('span');
    tag.className = 'gdh-debug-tag';
    tag.textContent = ({
      syntax: 'SINTASSI', runtime: 'ESECUZIONE', requirement: 'REQUISITO',
      timeout: 'TEMPO ESAURITO', system: 'VERIFICA NON DISPONIBILE'
    })[diagnosis.category] || 'ERRORE GODOT';
    const heading = document.createElement('strong');
    heading.textContent = diagnosis.title;
    top.append(tag, heading);
    card.append(top);

    if(diagnosis.message){
      const original=document.createElement('div');original.className='gdh-debug-original';
      const title=document.createElement('strong');title.textContent='Messaggio di Godot';
      const message=document.createElement('pre');message.textContent=diagnosis.message;
      original.append(title,message);card.append(original);
    }
    if(diagnosis.sourceLine){
      const excerpt=document.createElement('pre');excerpt.className='gdh-debug-source';
      excerpt.textContent=(diagnosis.file?diagnosis.file+':':'Riga ')+diagnosis.line+'  '+diagnosis.sourceLine;card.append(excerpt);
    }

    const label = document.createElement('strong');
    label.className = 'gdh-debug-section-label';
    label.textContent = 'Che cosa significa';
    const explain = document.createElement('p');
    explain.className = 'gdh-debug-explanation';
    explain.textContent = diagnosis.why;
    card.append(label, explain);

    if (diagnosis.line !== null && typeof onLine === 'function') {
      const jump = document.createElement('button');
      jump.type = 'button';
      jump.className = 'gdh-debug-jump';
      jump.textContent = 'Vai '+(diagnosis.file?'a '+diagnosis.file+', ':'alla ')+'riga ' + diagnosis.line;
      jump.addEventListener('click', () => onLine(diagnosis.line,diagnosis.file));
      card.append(jump);
    } else if (diagnosis.kind === 'engine' && diagnosis.category !== 'system') {
      const where = document.createElement('small');
      where.className = 'gdh-debug-location';
      where.textContent = 'Godot non ha fornito una riga attendibile per questo problema.';
      card.append(where);
    }

    const box = document.createElement('div');
    box.className = 'gdh-debug-hint';
    const hintTitle = document.createElement('strong');
    hintTitle.textContent = diagnosis.category === 'system' ? 'Che cosa puoi fare' : 'Da dove iniziare';
    const hint = document.createElement('p');
    hint.textContent = diagnosis.hint;
    box.append(hintTitle, hint);
    card.append(box);

    if (diagnosis.steps?.length) {
      const progress = document.createElement('div');
      progress.className = 'gdh-debug-steps';
      const count = document.createElement('p');
      count.className = 'gdh-debug-steps-status';
      count.textContent = 'Se non basta, puoi chiedere altri indizi. Nessuna soluzione viene inserita nel codice.';
      progress.append(count);
      const extra = document.createElement('div');
      extra.className = 'gdh-debug-steps-revealed';
      extra.setAttribute('aria-live','polite');
      progress.append(extra);
      const next = document.createElement('button');
      next.className = 'gdh-debug-next-hint';
      next.type = 'button';
      let shown = 0;
      const update = () => {
        if (shown >= diagnosis.steps.length) {
          next.remove();
          count.textContent = 'Hai letto tutti gli indizi. Prova a correggere il codice e verifica di nuovo.';
        } else {
          next.textContent = 'Mostra indizio ' + (shown + 1) + ' di ' + diagnosis.steps.length;
        }
      };
      next.addEventListener('click', () => {
        if (shown >= diagnosis.steps.length) return;
        shown++;
        const row = document.createElement('div');
        row.className = 'gdh-debug-step';
        const title = document.createElement('strong');
        title.textContent = 'Indizio ' + shown;
        const description = document.createElement('p');
        description.textContent = diagnosis.steps[shown - 1];
        row.append(title, description);
        extra.append(row);
        if (typeof onHint === 'function') onHint(shown);
        update();
      });
      progress.append(next);
      update();
      card.append(progress);
    }

    if (diagnosis.requirement) {
      const details = document.createElement('details');
      details.className = 'gdh-debug-technical';
      const summary = document.createElement('summary');
      summary.textContent = 'Dettaglio del controllo non superato';
      const pre = document.createElement('pre');
      pre.textContent = diagnosis.requirement;
      details.append(summary, pre);
      card.append(details);
    }
    if (diagnosis.raw) {
      const details = document.createElement('details');
      details.className = 'gdh-debug-technical';
      const summary = document.createElement('summary');
      summary.textContent = 'Messaggio tecnico originale (facoltativo)';
      const pre = document.createElement('pre');
      pre.textContent = diagnosis.raw;
      details.append(summary, pre);
      card.append(details);
    }
    host.append(card);
    return card;
  }
  function clearMark(editor) {
    if (!editor) return;
    if (editor._gdhErrorScroll) {
      editor.removeEventListener('scroll', editor._gdhErrorScroll);
      delete editor._gdhErrorScroll;
    }
    const stack = editor.closest('.gdscript-edit-stack');
    stack?.querySelector('.gdh-error-row')?.remove();
    const gutter = stack?.parentElement?.querySelector('.line-numbers');
    if (gutter && gutter.dataset.gdhErrorDecorated === 'true') {
      gutter.textContent = Array.from({length: editor.value.split('\n').length}, (_, i) => i + 1).join('\n');
      delete gutter.dataset.gdhErrorDecorated;
      gutter.scrollTop = editor.scrollTop;
    }
  }
  function mark(editor, line) {
    clearMark(editor);
    if (!editor || !Number.isSafeInteger(line) || line < 1 ||
        line > editor.value.split('\n').length) return;
    const stack = editor.closest('.gdscript-edit-stack');
    if (!stack) return;
    const row = document.createElement('div');
    row.className = 'gdh-error-row';
    row.setAttribute('aria-hidden', 'true');
    stack.prepend(row);
    const gutter = stack.parentElement?.querySelector('.line-numbers');
    if (gutter) {
      const fragment = document.createDocumentFragment();
      editor.value.split('\n').forEach((_, index) => {
        const number = document.createElement('span');
        number.className = 'gdh-editor-line-number' + (index + 1 === line ? ' gdh-error-number' : '');
        number.textContent = String(index + 1);
        fragment.append(number);
      });
      gutter.replaceChildren(fragment);
      gutter.dataset.gdhErrorDecorated = 'true';
    }
    const place = () => {
      const style = getComputedStyle(editor);
      const height = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) || 14) * 1.6;
      const padding = parseFloat(style.paddingTop) || 0;
      row.style.top = (padding + (line - 1) * height - editor.scrollTop) + 'px';
      row.style.height = height + 'px';
      if (gutter) gutter.scrollTop = editor.scrollTop;
    };
    editor._gdhErrorScroll = place;
    editor.addEventListener('scroll', place);
    place();
    // Rendi la riga visibile senza spostare il focus dalla scheda di spiegazione.
    const style = getComputedStyle(editor);
    const height = parseFloat(style.lineHeight) || 22;
    const relative = (line - 1) * height - editor.scrollTop;
    if (relative < 0 || relative > editor.clientHeight - height * 2) {
      editor.scrollTop = Math.max(0, (line - 3) * height);
      place();
    }
  }
  function jump(editor, line) {
    if (!editor || !Number.isSafeInteger(line) || line < 1) return;
    const rows = editor.value.split('\n');
    if (line > rows.length) return;
    const start = rows.slice(0, line - 1).reduce((sum, row) => sum + row.length + 1, 0);
    editor.focus({preventScroll: true});
    editor.setSelectionRange(start, start + rows[line - 1].length);
    const height = parseFloat(getComputedStyle(editor).lineHeight) || 22;
    editor.scrollTop = Math.max(0, (line - 3) * height);
    editor._gdhErrorScroll?.();
  }
  root.GDHErrorGuide = Object.freeze({diagnose, render, clear, mark, clearMark, jump});
})(typeof window !== 'undefined' ? window : globalThis);
