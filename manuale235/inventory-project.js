/* Lezioni 163–167: progetto incrementale di gestione dell'inventario.
 * Una lezione eredita le parti concluse in quelle precedenti, ma NON
 * contiene il comando/funzione che lo studente deve implementare ora.
 */
(() => {
 'use strict';
 const data=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
 if(data.length!==235||!verify)throw Error('Manuale non caricato');
 const get=n=>{const l=data.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione mancante '+n);return l;};
 const patch=(n,src)=>{const l=get(n);l.initialCode=src;l.starterCode=src;
   l.sourceFiles={...l.sourceFiles,'main.gd':src};};
 const active=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 const all=(...rules)=>s=>rules.every(r=>r.test(active(s)));
 const define=(n,cases,check)=>{
   const l=get(n);
   verify.expectedCases[n]=cases;l.manualSourceCheck=check;
   l.expectedOutput=cases[0].output||'Verifica dei comandi';
   l.validationReady=true;
 };
 const title='Sistema di gestione dell\x27inventario';
 const message={
   added:name=>"Articolo '"+name+"' aggiunto correttamente.",
   duplicate:name=>"Errore: l'articolo '"+name+"' esiste già.",
   missing:name=>"Errore: articolo '"+name+"' non trovato.",
   shortage:name=>"Errore: scorte insufficienti per '"+name+"'.",
   updated:name=>"Scorte di '"+name+"' aggiornate correttamente."
 };
 const functions={
   164:[
     'func add_item(inventory: Dictionary, item: String, price: float, stock: int) -> void:',
     '    if inventory.has(item):',
     '        print("Errore: l\x27articolo \x27%s\x27 esiste già." % item)',
     '        return',
     '    inventory[item] = {"price": price, "stock": stock}',
     '    print("Articolo \x27%s\x27 aggiunto correttamente." % item)'
   ].join('\n'),
   165:[
     'func update_stock(inventory: Dictionary, item: String, quantity: int) -> void:',
     '    if not inventory.has(item):',
     '        print("Errore: articolo \x27%s\x27 non trovato." % item)',
     '        return',
     '    var new_stock: int = inventory[item]["stock"] + quantity',
     '    if new_stock < 0:',
     '        print("Errore: scorte insufficienti per \x27%s\x27." % item)',
     '        return',
     '    inventory[item]["stock"] = new_stock',
     '    print("Scorte di \x27%s\x27 aggiornate correttamente." % item)'
   ].join('\n'),
   166:[
     'func check_availability(inventory: Dictionary, item: String) -> int:',
     '    if not inventory.has(item):',
     '        return -1',
     '    return inventory[item]["stock"]'
   ].join('\n')
 };
 const branches={
   164:[
     '        elif command == "aggiungi":',
     '            if parts.size() != 4:',
     '                print("Errore: usa aggiungi ARTICOLO PREZZO SCORTE")',
     '            elif not parts[2].is_valid_float() or not parts[3].is_valid_int():',
     '                print("Errore: prezzo e scorte devono essere numerici.")',
     '            else:',
     '                add_item(inventory, parts[1], float(parts[2]), int(parts[3]))'
   ],
   165:[
     '        elif command == "aggiorna":',
     '            if parts.size() != 3:',
     '                print("Errore: usa aggiorna ARTICOLO QUANTITÀ")',
     '            elif not parts[2].is_valid_int():',
     '                print("Errore: la quantità deve essere un numero intero.")',
     '            else:',
     '                update_stock(inventory, parts[1], int(parts[2]))'
   ],
   166:[
     '        elif command == "verifica":',
     '            if parts.size() != 2:',
     '                print("Errore: usa verifica ARTICOLO")',
     '            else:',
     '                var stock = check_availability(inventory, parts[1])',
     '                if stock == -1:',
     '                    print("Articolo non trovato")',
     '                else:',
     '                    print(parts[1], ": ", stock, " disponibili in magazzino")'
   ]
 };
 const starter=n=>{
   if(n===163)return [
     'extends Node','','func _ready():',
     '    # Crea inventory, stampa il titolo e avvia while true.',
     '    # Leggi e dividi i comandi: mostra, esci o comando sconosciuto.',
     '    pass'
   ].join('\n');
   const src=['extends Node'];
   for(let k=164;k<n;k++)if(functions[k])src.push('',functions[k]);
   src.push('','func _ready():','    var inventory = {}',
     '    print("Sistema di gestione dell\x27inventario")',
     '    while true:',
     '        var line = OS.read_string_from_stdin()',
     '        var parts = line.split(" ", false)',
     '        var command = parts[0]',
     '        if command == "esci":',
     '            print("Arrivederci!")',
     '            break',
     '        elif command == "mostra":',
     '            print(inventory)');
   for(let k=164;k<n;k++)if(branches[k])src.push(...branches[k]);
   src.push('        # Implementa qui il ramo del nuovo comando della lezione.',
     '        else:',
     '            print("Comando sconosciuto")',
     '',
     ({164:'# Scrivi add_item(inventory, item, price, stock) sopra _ready().',
       165:'# Scrivi update_stock(inventory, item, quantity) sopra _ready().',
       166:'# Scrivi check_availability(inventory, item) sopra _ready().',
       167:'# Scrivi sales_report(inventory, sales) sopra _ready().'})[n]);
   return src.join('\n');
 };
 for(let n=163;n<=167;n++)patch(n,starter(n));
 // Lezione 163 aveva comandi inglesi, mentre tutti gli step successivi
 // richiedono i comandi italiani. Rimuove questa contraddizione.
 const l163=get(163);
 l163.task=l163.task.replace(/\bexit\b/g,'esci')
   .replace(/\bshow\b/g,'mostra')
   .replace(/\bsell\b/g,'vendi');
 const l164=get(164);
 l164.task=l164.task.replace("Articolo 'Mela' aggiunta correttamente.",
   "Articolo 'Mela' aggiunto correttamente.");
 const params={int:/^[+-]?\d+$/,float:/^[+-]?(?:\d+\.?\d*|\.\d+)$/};
 const simulate=(commands,n)=>{
   const inventory=new Map(),out=[title];
   for(const line of commands){
     const parts=line.split(' ').filter(Boolean),command=parts[0],item=parts[1];
     if(command==='esci'){out.push('Arrivederci!');break;}
     if(command==='mostra'){
       const obj={};
       for(const [key,value] of inventory)obj[key]={price:value.price,stock:value.stock};
       out.push({object:obj});continue;
     }
     if(command==='aggiungi'&&n>=164){
       if(parts.length!==4)out.push('Errore: usa aggiungi ARTICOLO PREZZO SCORTE');
       else if(!params.float.test(parts[2])||!params.int.test(parts[3]))
         out.push('Errore: prezzo e scorte devono essere numerici.');
       else if(inventory.has(item))out.push(message.duplicate(item));
       else {inventory.set(item,{price:Number(parts[2]),stock:Number(parts[3])});
         out.push(message.added(item));}
       continue;
     }
     if(command==='aggiorna'&&n>=165){
       if(parts.length!==3)out.push('Errore: usa aggiorna ARTICOLO QUANTITÀ');
       else if(!params.int.test(parts[2]))
         out.push('Errore: la quantità deve essere un numero intero.');
       else if(!inventory.has(item))out.push(message.missing(item));
       else if(inventory.get(item).stock+Number(parts[2])<0)
         out.push(message.shortage(item));
       else{inventory.get(item).stock+=Number(parts[2]);out.push(message.updated(item));}
       continue;
     }
     if(command==='verifica'&&n>=166){
       if(parts.length!==2)out.push('Errore: usa verifica ARTICOLO');
       else if(!inventory.has(item))out.push('Articolo non trovato');
       else out.push(item+': '+inventory.get(item).stock+' disponibili in magazzino');
       continue;
     }
     if(command==='vendi'&&n>=167){
       const sales=new Map();
       for(const bit of parts.slice(1)){
         const pieces=bit.split(':');
         if(pieces.length!==2||!pieces[0]||!params.int.test(pieces[1])){
           out.push("Errore: vendita non valida '"+bit+"'.");continue;
         }
         sales.set(pieces[0],Number(pieces[1]));
       }
       let total=0;
       for(const [product,count] of sales){
         if(!inventory.has(product)){out.push(message.missing(product));continue;}
         if(inventory.get(product).stock<count){
           out.push(message.shortage(product));continue;
         }
         inventory.get(product).stock-=count;
         total+=inventory.get(product).price*count;
       }
       out.push('Ricavo totale: '+total.toFixed(2));
       continue;
     }
     out.push('Comando sconosciuto');
   }
   return out;
 };
 const scenario=(commands,n,i)=>{
   const spec=simulate(commands,n);
   return{name:'Inventario '+n+' — scenario '+(i+1),stdin:commands,
     linesSpec:spec,
     output:spec.every(x=>typeof x==='string')?spec.join('\n'):''};
 };
 const base=['aggiungi Mela 0.5 100','aggiungi Banana 0.2 50'];
 const tests={
   163:[['mostra','vendi','esci'],['esci'],
     ['ignoto','mostra','esci'],['mostra','mostra','esci']],
   164:[[...base,'aggiungi Mela 0.6 30','mostra','esci'],
     ['aggiungi Pera nope 10','aggiungi Pera 1.2 xx','mostra','esci'],
     ['aggiungi Kiwi 2','aggiungi Kiwi 2.5 0','mostra','esci'],
     ['esci']],
   165:[[...base,'aggiorna Mela -20','aggiorna Banana 30',
       'aggiorna Arancia 10','aggiorna Mela -90','mostra','esci'],
     ['aggiorna Pera 3','aggiorna Mela NaN','esci'],
     ['aggiungi Latte 2 0','aggiorna Latte 3','aggiorna Latte -3','mostra','esci'],
     ['aggiungi Te 1 5','aggiorna Te -6','mostra','esci']],
   166:[[...base,'aggiorna Mela -20','verifica Mela','verifica Banana','verifica Arancia','esci'],
     ['verifica','verifica sconosciuto','esci'],
     ['aggiungi Te 1 0','verifica Te','mostra','esci'],
     ['aggiungi Torta 12 3','aggiorna Torta 5','verifica Torta','esci']],
   167:[['aggiungi Mela 0.5 50','aggiungi Banana 0.2 60',
       'vendi Mela:30 Banana:20 Arancia:10','mostra','esci'],
     ['aggiungi Caffe 1.5 3','vendi Caffe:5 Caffe-3 Te:2',
       'verifica Caffe','esci'],
     ['aggiungi Pane 0.75 10','vendi Pane:4','vendi Pane:3','mostra','esci'],
     ['vendi Fragola:3','vendi','mostra','esci'],
     ['aggiungi Uva 3 2','vendi Uva:1','vendi Uva:2','mostra','esci']]
 };
 const proofs={
   163:all(/\bvar\s+inventory\s*=\s*\{\s*\}/,/\bwhile\s+true\s*:/,
     /OS\.read_string_from_stdin\s*\(/,/\bif\s+command\s*==\s*["']esci["']/,
     /\belif\s+command\s*==\s*["']mostra["']/,/\bprint\s*\(\s*inventory\s*\)/,
     /\bbreak\b/),
   164:all(/\bfunc\s+add_item\s*\(\s*inventory\b/,
     /elif\s+command\s*==\s*["']aggiungi["']/,/\badd_item\s*\(/,
     /parts\.size\s*\(\s*\)\s*!=\s*4/,
     /\.is_valid_float\s*\(\s*\)/,/\.is_valid_int\s*\(\s*\)/,
     /\binventory\s*\[\s*item\s*\]\s*=/),
   165:all(/\bfunc\s+update_stock\s*\(\s*inventory\b/,
     /elif\s+command\s*==\s*["']aggiorna["']/,/\bupdate_stock\s*\(/,
     /parts\.size\s*\(\s*\)\s*!=\s*3/,/\bnew_stock\b|inventory\s*\[\s*item\s*\]\s*\[\s*["']stock["']\s*\]/),
   166:all(/\bfunc\s+check_availability\s*\(\s*inventory\b/,
     /elif\s+command\s*==\s*["']verifica["']/,/\bcheck_availability\s*\(/,
     /\breturn\s+-1\b/,/parts\.size\s*\(\s*\)\s*!=\s*2/),
   167:all(/\bfunc\s+sales_report\s*\(\s*inventory\b/,
     /elif\s+command\s*==\s*["']vendi["']/,/\bsales_report\s*\(/,
     /\.split\s*\(\s*["']:["']\s*\)/,
     /inventory\s*\[\s*(?:item|product|name)\s*\]\s*\[\s*["']stock["']\s*\]/,
     /\.is_valid_int\s*\(\s*\)/,/\breturn\b/)
 };
 for(let n=163;n<=167;n++)define(n,tests[n].map((commands,i)=>scenario(commands,n,i)),proofs[n]);
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   163:tests[163][0],164:tests[164][0],165:tests[165][0],
   166:tests[166][0],167:tests[167][0]});
 window.GDHManualMigration.validated=data.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();