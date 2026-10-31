/* Lezioni 201–205: metodi per i valori, _to_string, iteratori e segnali.
 * Main .gd fornito e di sola lettura. I verificatori eseguono Godot reale
 * con input variabili; non anticipare mai le implementazioni nello starter.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
 if(lessons.length!==235||!v)throw Error('Catalogo manuale assente');
 const get=n=>{const l=lessons.find(x=>x.manualLessonNumber===n);if(!l)throw Error('Manca '+n);return l;};
 const setup=(n,files)=>{
   const lesson=get(n);
   lesson.sourceFiles=files;lesson.readOnlyFiles=['main.gd'];
   const edit=Object.keys(files).find(name=>name!=='main.gd');
   lesson.initialCode=files[edit];lesson.starterCode=lesson.initialCode;
   lesson.requiresMultipleFiles=true;
 };
 const main=arr=>['extends Node','','func _ready():',...arr.map(s=>'    '+s)].join('\n');
 const live=s=>String(s).split('\n').filter(t=>!/^\s*#/.test(t)).join('\n');
 const proof=(...rx)=>s=>rx.every(r=>r.test(live(s)));
 const activate=(n,cases,check)=>{
   if(cases.length<5)throw Error('Pochi test in '+n);
   const l=get(n);v.expectedCases[n]=cases;l.manualSourceCheck=check;
   l.expectedOutput=cases[0].output;l.validationReady=true;
 };
 const asBool=x=>x?'true':'false';

 setup(201,{
  'counter.gd':[
    'class_name Counter','extends RefCounted','',
    'var value: int','var step: int','',
    'func _init(start: int = 0, step_size: int = 1) -> void:',
    '    # Memorizza valore iniziale e passo.',
    '    pass','',
    'func tick() -> void:',
    '    # Incrementa value usando step.',
    '    pass','',
    'func plus(other: Counter) -> Counter:',
    '    # Restituisci un nuovo Counter; non modificare gli originali.',
    '    return Counter.new()','',
    'func equals(other: Counter) -> bool:',
    '    # Confronta i valori, non le identità degli oggetti.',
    '    return false'
  ].join('\n'),
  'main.gd':[
    'extends Node','',
    'func _ready():',
    '    var a = make_counter(OS.read_string_from_stdin())',
    '    var b = make_counter(OS.read_string_from_stdin())',
    '    var ticks = OS.read_string_from_stdin().split(" ")',
    '    for i in int(ticks[0]):',
    '        a.tick()',
    '    for i in int(ticks[1]):',
    '        b.tick()',
    '    print("a: %d (passo %d)" % [a.value, a.step])',
    '    print("b: %d (passo %d)" % [b.value, b.step])',
    '    var total = a.plus(b)',
    '    print("a più b: %d (passo %d)" % [total.value, total.step])',
    '    print("stesso valore: %s" % a.equals(b))',
    '    print("stesso oggetto: %s" % (a == b))','',
    'func make_counter(line: String) -> Counter:',
    '    var parts = line.split(" ", false)',
    '    if parts.is_empty():',
    '        return Counter.new()',
    '    if parts.size() == 1:',
    '        return Counter.new(int(parts[0]))',
    '    return Counter.new(int(parts[0]), int(parts[1]))'
  ].join('\n')
 });
 const counterCases=[
   {a:'5',b:'2 3',ticks:[3,1]},
   {a:'',b:'',ticks:[0,0]},
   {a:'2 2',b:'6 1',ticks:[2,0]},
   {a:'-4 2',b:'1 3',ticks:[1,0]},
   {a:'100',b:'100 4',ticks:[0,0]},
   {a:'0 5',b:'3 2',ticks:[2,1]}
 ];
 const counterInit=s=>{
   const fields=s.trim().split(/\s+/).filter(Boolean);
   return {value:fields.length?Number(fields[0]):0,step:fields.length>1?Number(fields[1]):1};
 };
 activate(201,counterCases.map(({a,b,ticks},i)=>{
   const one=counterInit(a),two=counterInit(b);
   one.value+=one.step*ticks[0];two.value+=two.step*ticks[1];
   return{name:'Contatori e uguaglianza '+(i+1),stdin:[a,b,ticks.join(' ')],
     output:[
       'a: '+one.value+' (passo '+one.step+')',
       'b: '+two.value+' (passo '+two.step+')',
       'a più b: '+(one.value+two.value)+' (passo '+one.step+')',
       'stesso valore: '+asBool(one.value===two.value),
       'stesso oggetto: false'
     ].join('\n')};
 }),proof(/\bclass_name\s+Counter\b/,/\bfunc\s+_init\s*\(\s*start\s*:\s*int\s*=\s*0/,
  /\bfunc\s+tick\s*\(/,/\bfunc\s+plus\s*\(/,/\bfunc\s+equals\s*\(/,
  /\bCounter\.new\s*\(/,/\bvalue\b/,/\bstep\b/));
 get(201).task=get(201).task.replace('a plus b: 13','a più b: 13').replace(/\bstep (\d+)\b/g,'passo $1');

 setup(202,{
  'playing_card.gd':[
    'class_name PlayingCard','extends RefCounted','',
    'var rank: int','var suit: String','',
    'func _init(new_rank: int, new_suit: String) -> void:',
    '    rank = new_rank',
    '    suit = new_suit','',
    '# Definisci _to_string() per i ranghi dal 2 al 14.'
  ].join('\n'),
  'hand.gd':[
    'class_name Hand','extends RefCounted','',
    'var _cards: Array[PlayingCard] = []','',
    'func add(card: PlayingCard) -> void:',
    '    _cards.append(card)','',
    '# Definisci _to_string() usando i testi delle carte nell’ordine.'
  ].join('\n'),
  'main.gd':main([
    'var hand = Hand.new()',
    'print(hand)',
    'var count = int(OS.read_string_from_stdin())',
    'for i in count:',
    '    var parts = OS.read_string_from_stdin().split(" ")',
    '    var card = PlayingCard.new(int(parts[0]), parts[1])',
    '    hand.add(card)',
    '    print("Estratto %s" % card)',
    'print(hand)'
  ])
 });
 const hands=[
   ['7 clubs','12 hearts'],
   [],
   ['11 spades','13 diamonds','14 clubs'],
   ['2 hearts'],
   ['10 clubs','10 hearts','10 spades','10 diamonds'],
   ['14 spades','3 clubs','12 hearts']
 ];
 const rankText=n=>({11:'J',12:'Q',13:'K',14:'A'})[n]||String(n);
 activate(202,hands.map((cards,i)=>{
   const texts=cards.map(row=>{const [rank,suit]=row.split(' ');return rankText(Number(rank))+' of '+suit;});
   return{name:'Carte e testi '+(i+1),stdin:[String(cards.length),...cards],
     output:['Hand (0): empty',...texts.map(t=>'Estratto '+t),
       'Hand ('+texts.length+'): '+(texts.length?texts.join(', '):'empty')].join('\n')};
 }),s=>proof(/\bclass_name\s+PlayingCard\b/,/\bclass_name\s+Hand\b/,
   /\bfunc\s+_to_string\s*\(\s*\)\s*->\s*String/,
   /\b_cards\b/,/\brank\b/,/\bsuit\b/)(s)&&
   (live(s).match(/\bfunc\s+_to_string\s*\(/g)||[]).length>=2);
 get(202).task=get(202).task.replace(/\bDrew\b/g,'Estratto');

 setup(203,{
  'bookshelf.gd':[
    'class_name Bookshelf','extends RefCounted','',
    'var _titles: Array[String] = []','var _capacity: int','var _cursor: int = 0','',
    'func _init(capacity: int) -> void:',
    '    _capacity = capacity','',
    'func add(title: String) -> bool:',
    '    return false','',
    'func size() -> int:',
    '    return 0','',
    'func has(title: String) -> bool:',
    '    return false','',
    'func get_at(index: int) -> String:',
    '    return ""','',
    'func _iter_init(iter: Array) -> bool:',
    '    # Imposta _cursor su 0 per iniziare la visita.',
    '    return false','',
    'func _iter_next(iter: Array) -> bool:',
    '    # Incrementa _cursor e verifica se restano titoli.',
    '    return false','',
    'func _iter_get(position):',
    '    # Restituisci _titles[_cursor].',
    '    return null'
  ].join('\n'),
  'main.gd':main([
    'var shelf = Bookshelf.new(int(OS.read_string_from_stdin()))',
    'var count = int(OS.read_string_from_stdin())',
    'for i in count:',
    '    var title = OS.read_string_from_stdin()',
    '    if not shelf.add(title):',
    '        print("Impossibile aggiungere: " + title)',
    'print("Libri: %d" % shelf.size())',
    'var number = 1',
    'for title in shelf:',
    '    print("%d. %s" % [number, title])',
    '    number += 1',
    'var query = OS.read_string_from_stdin()',
    'print("Contiene %s: %s" % [query, shelf.has(query)])',
    'print("Ultimo: " + shelf.get_at(shelf.size() - 1))'
  ])
 });
 const shelves=[
   {capacity:3,titles:['Dune','Emma','Dune','Ulysses','Hamlet'],query:'Emma'},
   {capacity:0,titles:['Zero'],query:'Zero'},
   {capacity:2,titles:[],query:'None'},
   {capacity:1,titles:['A','B','A'],query:'A'},
   {capacity:4,titles:['L','A','M','B'],query:'Z'},
   {capacity:2,titles:['One','Two','Three'],query:'Three'}
 ];
 activate(203,shelves.map(({capacity,titles,query},i)=>{
   const list=[],out=[];
   for(const title of titles){
     if(list.length>=capacity||list.includes(title))out.push('Impossibile aggiungere: '+title);
     else list.push(title);
   }
   out.push('Libri: '+list.length);
   list.forEach((title,n)=>out.push((n+1)+'. '+title));
   out.push('Contiene '+query+': '+asBool(list.includes(query)));
   out.push('Ultimo: '+(list.at(-1)||''));
   return{name:'Scaffali e iterazione '+(i+1),
     stdin:[String(capacity),String(titles.length),...titles,query],
     output:out.join('\n')};
 }),proof(/\bclass_name\s+Bookshelf\b/,/\bfunc\s+add\s*\(/,
  /\bfunc\s+get_at\s*\(/,/\bfunc\s+_iter_init\s*\(/,
  /\bfunc\s+_iter_next\s*\(/,/\bfunc\s+_iter_get\s*\(/,/\b_cursor\b/));
 get(203).task=get(203).task.replace(/\bPossiede Emma\b/g,'Contiene Emma');

 setup(204,{
  'custom_list.gd':[
    'class_name CustomList','extends RefCounted','',
    'var _items: Array = []','var _cursor: int = 0','',
    'func _init(items: Array = []) -> void:',
    '    # Conserva una copia degli elementi, non l’Array originale.',
    '    pass','',
    'func append(item) -> void:',
    '    pass','',
    'func pop_back():',
    '    return null','',
    'func get_at(index: int):',
    '    return null','',
    'func set_at(index: int, value) -> bool:',
    '    return false','',
    'func size() -> int:',
    '    return 0','',
    'func has(item) -> bool:',
    '    return false','',
    'func clear() -> void:',
    '    pass','',
    'func concat(other: CustomList) -> CustomList:',
    '    return CustomList.new()','',
    'func _to_string() -> String:',
    '    return ""','',
    'func _iter_init(iter: Array) -> bool:',
    '    return false','',
    'func _iter_next(iter: Array) -> bool:',
    '    return false','',
    'func _iter_get(position):',
    '    return null'
  ].join('\n'),
  'main.gd':[
    'extends Node','',
    'func _ready():',
    '    var numbers = to_numbers(OS.read_string_from_stdin().split(" ", false))',
    '    var items = CustomList.new(numbers)',
    '    numbers.append(99)',
    '    print(items)',
    '    var count = int(OS.read_string_from_stdin())',
    '    for i in count:',
    '        var parts = OS.read_string_from_stdin().split(" ", false)',
    '        match parts[0]:',
    '            "aggiungi":',
    '                items.append(int(parts[1]))',
    '                print(items)',
    '            "estrai":',
    '                var item = items.pop_back()',
    '                print("Vuoto" if item == null else "Estratto %d" % item)',
    '            "ottieni":',
    '                var item = items.get_at(int(parts[1]))',
    '                print(("Nessun oggetto in posizione " + parts[1]) if item == null else "Elemento %s: %d" % [parts[1], item])',
    '            "imposta":',
    '                if items.set_at(int(parts[1]), int(parts[2])):',
    '                    print(items)',
    '                else:',
    '                    print("Nessun oggetto in posizione " + parts[1])',
    '            "contiene":',
    '                print("Contiene %s: %s" % [parts[1], items.has(int(parts[1]))])',
    '            "dimensione":',
    '                print("Dimensione: %d" % items.size())',
    '            "somma":',
    '                var total = 0',
    '                for item in items:',
    '                    total += item',
    '                print("Somma: %d" % total)',
    '            "cancella":',
    '                items.clear()',
    '                print(items)',
    '            "concatena":',
    '                var other = CustomList.new(to_numbers(parts.slice(1)))',
    '                print("%s + %s = %s" % [items, other, items.concat(other)])','',
    'func to_numbers(words: PackedStringArray) -> Array:',
    '    var numbers = []',
    '    for word in words:',
    '        numbers.append(int(word))',
    '    return numbers'
  ].join('\n')
 });
 const customCases=[
   {start:[3,1,4],commands:['aggiungi 1','ottieni 2','ottieni 9','imposta 0 5','contiene 4','somma','estrai','concatena 9 2']},
   {start:[],commands:['estrai','somma','dimensione','concatena 1 2','cancella']},
   {start:[7],commands:['imposta -1 3','ottieni -1','contiene 7','dimensione']},
   {start:[2,2],commands:['aggiungi 3','somma','cancella','dimensione','estrai']},
   {start:[1,2,3],commands:['concatena 4 5','dimensione','somma','ottieni 0']},
   {start:[0],commands:[]}
 ];
 const arrPrint=items=>'['+items.join(', ')+']';
 const runCustom=({start,commands})=>{
   let items=start.slice(),out=[arrPrint(items)];
   for(const line of commands){
     const [cmd,...raw]=line.split(' '),args=raw.map(Number),i=args[0];
     if(cmd==='aggiungi'){items.push(i);out.push(arrPrint(items));}
     if(cmd==='estrai'){out.push(items.length?'Estratto '+items.pop():'Vuoto');}
     if(cmd==='ottieni')out.push(i>=0&&i<items.length?'Elemento '+i+': '+items[i]:'Nessun oggetto in posizione '+i);
     if(cmd==='imposta'){
       if(i>=0&&i<items.length){items[i]=args[1];out.push(arrPrint(items));}
       else out.push('Nessun oggetto in posizione '+i);
     }
     if(cmd==='contiene')out.push('Contiene '+i+': '+asBool(items.includes(i)));
     if(cmd==='dimensione')out.push('Dimensione: '+items.length);
     if(cmd==='somma')out.push('Somma: '+items.reduce((a,b)=>a+b,0));
     if(cmd==='cancella'){items=[];out.push(arrPrint(items));}
     if(cmd==='concatena')out.push(arrPrint(items)+' + '+arrPrint(args)+' = '+arrPrint([...items,...args]));
   }
   return out.join('\n');
 };
 activate(204,customCases.map((c,i)=>({
   name:'CustomList e virtuali '+(i+1),
   stdin:[c.start.join(' '),String(c.commands.length),...c.commands],
   output:runCustom(c)
 })),s=>proof(/\bclass_name\s+CustomList\b/,/\bfunc\s+_init\s*\(/,
  /\bfunc\s+append\s*\(/,/\bfunc\s+pop_back\s*\(/,
  /\bfunc\s+get_at\s*\(/,/\bfunc\s+set_at\s*\(/,
  /\bfunc\s+size\s*\(/,/\bfunc\s+has\s*\(/,
  /\bfunc\s+clear\s*\(/,/\bfunc\s+concat\s*\(/,
  /\bfunc\s+_to_string\s*\(/,/\bfunc\s+_iter_init\s*\(/,
  /\bfunc\s+_iter_next\s*\(/,/\bfunc\s+_iter_get\s*\(/,
  /\.duplicate\s*\(/)(s));
 const custom=get(204);
 custom.task=custom.task.replace(/append N/g,'aggiungi N')
   .replace(/\bpop\b/g,'estrai')
   .replace(/\bget I\b/g,'ottieni I')
   .replace(/\bset I N\b/g,'imposta I N')
   .replace(/\bhas N\b/g,'contiene N')
   .replace(/\bsize\b/g,'dimensione')
   .replace(/\bsum\b/g,'somma')
   .replace(/\bclear\b/g,'cancella')
   .replace(/\bconcat N N\.\.\./g,'concatena N N...')
   .replace(/\bArticolo 2:/g,'Elemento 2:');

 setup(205,{
  'mailbox.gd':[
    'class_name Mailbox','extends RefCounted','',
    'signal mail_arrived','',
    'var letters: int = 0','',
    'func deliver(kind: String) -> void:',
    '    # Per "letter" incrementa letters ed emetti mail_arrived.',
    '    pass'
  ].join('\n'),
  'main.gd':[
    'extends Node','',
    'func _ready():',
    '    var mailbox = Mailbox.new()',
    '    mailbox.mail_arrived.connect(_on_mail_arrived)',
    '    var count = int(OS.read_string_from_stdin())',
    '    for i in count:',
    '        var kind = OS.read_string_from_stdin()',
    '        if kind == "away":',
    '            mailbox.mail_arrived.disconnect(_on_mail_arrived)',
    '        elif kind == "home":',
    '            mailbox.mail_arrived.connect(_on_mail_arrived)',
    '        else:',
    '            print("Consegna: ", kind)',
    '            mailbox.deliver(kind)',
    '    print("Lettere: ", mailbox.letters)','',
    'func _on_mail_arrived() -> void:',
    '    print("Hai ricevuto un messaggio!")'
  ].join('\n')
 });
 const mailCases=[
   ['letter','ad','away','letter'],
   ['letter','letter','flyer'],
   ['away','letter','home','letter'],
   [],
   ['ad','spam','home'], // avoid repeated .connect, see below
   ['away','letter','ad','letter','home','letter'],
 ];
 // Non duplicare connect mentre la connessione è già attiva.
 mailCases[4]=['ad','spam','letter'];
 const mailOutput=commands=>{
   let home=true,letters=0,out=[];
   for(const cmd of commands){
     if(cmd==='away'){home=false;continue;}
     if(cmd==='home'){home=true;continue;}
     out.push('Consegna: '+cmd);
     if(cmd==='letter'){
       letters++;
       if(home)out.push('Hai ricevuto un messaggio!');
     }
   }
   out.push('Lettere: '+letters);
   return out.join('\n');
 };
 activate(205,mailCases.map((commands,i)=>({
   name:'Mailbox e segnali '+(i+1),
   stdin:[String(commands.length),...commands],
   output:mailOutput(commands)
 })),proof(/\bclass_name\s+Mailbox\b/,/\bsignal\s+mail_arrived\b/,
   /\bfunc\s+deliver\s*\(/,/\bletters\b/,
   /mail_arrived\.emit\s*\(/));
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
  201:['5','2 3','3 1'],
  202:['2','7 clubs','12 hearts'],
  203:['3','5','Dune','Emma','Dune','Ulysses','Hamlet','Emma'],
  204:['3 1 4','8','aggiungi 1','ottieni 2','ottieni 9','imposta 0 5','contiene 4','somma','estrai','concatena 9 2'],
  205:['4','letter','ad','away','letter']
 });
 window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();
