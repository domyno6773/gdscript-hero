/* Manuale 221–235. Pattern avanzati, biblioteca incrementale e progetti finali.
 * Le specifiche e gli output di riferimento sono indipendenti dalle soluzioni
 * dei test. main.gd e le classi fornite sono sempre protetti.
 */
(()=>{
'use strict';
const lessons=window.LESSONS_DATA, verifier=window.GDHManualVerifier;
const get=n=>lessons.find(l=>l.manualLessonNumber===n);
const gd=s=>s.trim()+'\n';
const main=s=>gd('extends Node\n\nfunc _ready():\n'+s.trim().split('\n').map(l=>'    '+l).join('\n'));
const setup=(n,files,locked=['main.gd'])=>{
 const l=get(n);l.sourceFiles={...l.sourceFiles,...files};l.readOnlyFiles=locked;
 const first=Object.keys(l.sourceFiles).find(f=>!locked.includes(f));
 l.initialCode=l.sourceFiles[first];l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
};
const activate=(n,inputs,simulate,...proof)=>{
 const l=get(n);
 if(inputs.length<6)throw Error('Scenari insufficienti '+n);
 verifier.expectedCases[n]=inputs.map((stdin,i)=>({name:'Scenario '+(i+1),stdin,output:simulate(stdin)}));
 l.manualSourceCheck=s=>proof.every(rx=>rx.test(String(s).replace(/^\s*#.*$/gm,'')));
 l.validationReady=true;l.expectedOutput=verifier.expectedCases[n][0].output;
};
const counted=rows=>[String(rows.length),...rows];
const commands=(name,rows)=>[name,...rows,''];
const bool=b=>b?'true':'false';
const money=n=>Number(n).toFixed(2);
// Rimuove i soli separatori di riga del PDF prima di allineare i comandi.
const replaceTask=(n,from,to)=>{get(n).task=get(n).task.replace(from,to);};
for(let n=221;n<=235;n++)get(n).task=get(n).task.replace(/<span> <\/span>/g,' ');

setup(221,{'main.gd':main(`var board = WeatherBoard.new()
var count = int(OS.read_string_from_stdin())
for i in count:
    var parts = OS.read_string_from_stdin().split(" ")
    if parts[0] == "legacy":
        var old = LegacyThermometer.new(int(parts[1]), float(parts[2]))
        board.add_sensor(ThermometerAdapter.new(old))
    else:
        board.add_sensor(ModernSensor.new(parts[1], float(parts[2])))
board.show_all()`)
},['legacy_thermometer.gd','modern_sensor.gd','weather_board.gd','main.gd']);
activate(221,[['legacy 4 98.6','modern Garden 21.5'],[],['legacy 1 32','legacy 2 212'],
 ['modern Zero -40','legacy 8 -40'],['legacy 7 50','modern Studio 10','legacy 3 68'],
 ['modern Freddo -15','legacy 99 5','modern Caldo 30']].map(counted),input=>{
 const rows=input.slice(1).map(s=>{const[k,n,v]=s.split(' ');return {name:k==='legacy'?'Termometro TH-'+n:n,temp:k==='legacy'?(Number(v)-32)*5/9:Number(v)};});
 const out=rows.map(r=>r.name+': '+r.temp.toFixed(1)+' C');
 if(rows.length){const best=rows.reduce((a,b)=>b.temp>a.temp?b:a);out.push('Più caldo: '+best.name);}
 return out.join('\n');
},/\bfunc\s+get_sensor_name\s*\(/,/\bfunc\s+get_celsius\s*\(/,/thermometer\.read_fahrenheit\s*\(/,/thermometer\.get_code\s*\(/);

setup(222,{'main.gd':main(`var count = int(OS.read_string_from_stdin())
for i in count:
    var words = OS.read_string_from_stdin().split(" ")
    var drink: Beverage = Tea.new()
    if words[0] == "espresso":
        drink = Espresso.new()
    for extra in words.slice(1):
        match extra:
            "latte": drink = Milk.new(drink)
            "mocha": drink = Mocha.new(drink)
            "grande": drink = Large.new(drink)
    print("%s: $%d" % [drink.description(), drink.cost()])`)
},['beverage.gd','espresso.gd','tea.gd','main.gd']);
activate(222,[['espresso latte grande','tea mocha latte'],[],['espresso','tea'],
 ['tea grande latte','tea latte grande'],['espresso mocha mocha grande','tea grande grande latte'],
 ['tea latte latte','espresso grande mocha grande']].map(counted),input=>input.slice(1).map(s=>{
 const [base,...extras]=s.split(' ');let cost=base==='espresso'?3:2,desc=base==='espresso'?'Espresso':'Tea';
 for(const e of extras){if(e==='latte'){cost++;desc+=' + Milk';}else if(e==='mocha'){cost+=2;desc+=' + Mocha';}else{cost*=2;desc='Large '+desc;}}
 return desc+': $'+cost;
}).join('\n'),/\bclass_name\s+Milk\b/,/\bclass_name\s+Mocha\b/,/\bclass_name\s+Large\b/,/inner\.cost\s*\(/,/inner\.description\s*\(/);
replaceTask(222,/espresso milk large/g,'espresso latte grande');replaceTask(222,/tea mocha milk/g,'tea mocha latte');
replaceTask(222,/suoi extra, applicati/g,'suoi extra (latte, mocha, grande), applicati');

setup(223,{'main.gd':main(`var style = OS.read_string_from_stdin()
var rows: Array = []
var count = int(OS.read_string_from_stdin())
for i in count:
    var parts = OS.read_string_from_stdin().split(" ")
    rows.append({"name": parts[0], "score": int(parts[1])})
var exporter: Exporter = CsvExporter.new()
if style == "elenca":
    exporter = ListExporter.new()
exporter.export_rows(rows)`)});
activate(223,[['elenca','2','Ada 12','Bo 7'],['csv','0'],['elenca','0'],
 ['csv','3','Nora 0','Eli -3','Cy 100'],['elenca','1','Solo -8'],['csv','2','A 9','B 9']],input=>{
 const out=input[0]==='csv'?['nome,punteggio']:[];
 for(const row of input.slice(2)){const[n,s]=row.split(' ');out.push(input[0]==='csv'?n+','+s:'* '+n+' ha segnato '+s);}
 if(input[0]==='elenca')out.push('Giocatori: '+input[1]);return out.join('\n');
},/\bfunc\s+export_rows\s*\(/,/\bheader\s*\(/,/\bformat_row\s*\(/,/\bfooter\s*\(/,/\bextends\s+Exporter\b/,/@abstract\s+func\s+format_row/);
replaceTask(223,/\blist\b/g,'elenca');

setup(224,{'main.gd':main(`var door = Door.new()
var count = int(OS.read_string_from_stdin())
for i in count:
    door.handle_action(OS.read_string_from_stdin())
print("Stato finale: ", door.state.get_state_name())`)
},['door_state.gd','locked_state.gd','main.gd']);
activate(224,[['apri','sblocca','apri','blocca'],[],['sblocca','blocca','apri','sblocca','apri','chiudi'],
 ['chiudi','salta','sblocca','sblocca','chiudi'],['sblocca','apri','chiudi','blocca','sblocca'],
 ['sblocca','apri','apri','blocca','chiudi','blocca']].map(counted),input=>{
 let state='Bloccato';const out=[];
 for(const action of input.slice(1)){const old=state;
  if(state==='Bloccato'&&action==='sblocca')state='Chiuso';
  else if(state==='Chiuso'&&action==='apri')state='Aperto';
  else if(state==='Chiuso'&&action==='blocca')state='Bloccato';
  else if(state==='Aperto'&&action==='chiudi')state='Chiuso';
  out.push(action+': '+(old===state?'ancora '+state:old+' -> '+state));
 }return [...out,'Stato finale: '+state].join('\n');
},/\bfunc\s+handle_action\s*\(/,/state\.handle\s*\(/,/\bOpenState\.new\s*\(/,/\bClosedState\.new\s*\(/,/\bLockedState\.new\s*\(/);

setup(225,{'main.gd':main(`var open_folders: Array[FolderEntry] = []
var root: FolderEntry = null
var count = int(OS.read_string_from_stdin())
for i in count:
    var parts = OS.read_string_from_stdin().split(" ")
    match parts[0]:
        "cartella":
            var folder = FolderEntry.new(parts[1])
            if open_folders.is_empty():
                root = folder
            else:
                open_folders.back().add(folder)
            open_folders.append(folder)
        "file":
            open_folders.back().add(FileEntry.new(parts[1], int(parts[2])))
        "fine":
            open_folders.pop_back()
root.list_lines("")
print("Totale: %d KB, file: %d" % [root.get_size(), root.count_files()])`)
},['disk_entry.gd','main.gd']);
const trees=[['cartella Root','file notes.txt 4','cartella Musica','file song.mp3 300','fine','fine'],
 ['cartella Vuota','fine'],['cartella R','file zero 0','file altro 7','fine'],
 ['cartella A','cartella B','cartella C','file f 9','fine','fine','file g 3','fine'],
 ['cartella R','cartella A','fine','cartella B','file q 2','fine','fine'],
 ['cartella R','file a 5','cartella S','file b 5','file c 10','fine','file d 0','fine']];
activate(225,trees.map(counted),input=>{
 const stack=[];let root;
 for(const row of input.slice(1)){const[op,name,value]=row.split(' ');
  if(op==='fine')stack.pop();else{const node={name,size:op==='file'?Number(value):null,children:[]};if(stack.length)stack.at(-1).children.push(node);else root=node;if(op==='cartella')stack.push(node);}}
 const size=n=>n.size??n.children.reduce((a,b)=>a+size(b),0),count=n=>n.size!==null?1:n.children.reduce((a,b)=>a+count(b),0);
 const out=[];const walk=(n,indent)=>{out.push(indent+n.name+(n.size===null?'/':'')+' ('+size(n)+' KB)');for(const c of n.children)walk(c,indent+'  ');};
 walk(root,'');return [...out,`Totale: ${size(root)} KB, file: ${count(root)}`].join('\n');
},/\bclass_name\s+FileEntry\b/,/\bclass_name\s+FolderEntry\b/,/\bfunc\s+get_size\s*\(/,/\bfunc\s+count_files\s*\(/,/\bfunc\s+list_lines\s*\(/,/children\.(?:append|push_back)\s*\(/);
replaceTask(225,/folder NAME/g,'cartella NOME');replaceTask(225,/\bend\b/g,'fine');replaceTask(225,/cartella Music/g,'cartella Musica');

// La biblioteca conserva il lavoro già svolto, senza anticipare il passo attuale.
const bookSource=gd(`class_name Book
extends RefCounted
var title: String
var author: String
var isbn: String
var available = true
var borrower_id = ""
func _init(title: String, author: String, isbn: String) -> void:
    self.title = title
    self.author = author
    self.isbn = isbn
func _to_string() -> String:
    return "%s di %s (ISBN: %s) - %s" % [title, author, isbn, "Disponibile" if available else "Non disponibile"]`);
const userSource=gd(`class_name User
extends RefCounted
var user_id: String
var user_name: String
var borrowed_isbns: Array[String] = []
func _init(user_id: String, user_name: String) -> void:
    self.user_id = user_id
    self.user_name = user_name
func _to_string() -> String:
    return "Utente: %s (ID: %s) - Libri in prestito: %d" % [user_name, user_id, borrowed_isbns.size()]`);
const libraryBase=typed=>gd(`class_name Library
extends RefCounted
var library_name: String
var books: Array[${typed?'Book':'String'}] = []
var users: Array[${typed?'User':'String'}] = []
func _init(library_name: String) -> void:
    self.library_name = library_name
func _to_string() -> String:
    return "Biblioteca %s (libri: %d, utenti: %d)" % [library_name, books.size(), users.size()]`);
const libraryAdd=gd(`func add_book(book: Book) -> void:
    books.append(book)
func add_user(user: User) -> void:
    users.append(user)`);
const libraryBorrow=gd(`func find_book(isbn: String) -> Book:
    for book in books:
        if book.isbn == isbn:
            return book
    return null
func find_user(user_id: String) -> User:
    for user in users:
        if user.user_id == user_id:
            return user
    return null
func borrow_book(isbn: String, user_id: String) -> String:
    var book = find_book(isbn)
    var user = find_user(user_id)
    if book == null:
        return "Libro non trovato"
    if user == null:
        return "Utente non trovato"
    if not book.available:
        return "Il libro non è disponibile"
    book.available = false
    book.borrower_id = user_id
    user.borrowed_isbns.append(isbn)
    return "Libro prestato correttamente"`);
const librarySearch=gd(`func search_by_title(text: String) -> Array[Book]:
    var found: Array[Book] = []
    for book in books:
        if text == "" or text.to_lower() in book.title.to_lower():
            found.append(book)
    return found`);
const libraryStats=gd(`func get_statistics() -> Dictionary:
    var available_count = 0
    var readers_count = 0
    for book in books:
        if book.available:
            available_count += 1
    for user in users:
        if not user.borrowed_isbns.is_empty():
            readers_count += 1
    return {"total_books": books.size(), "available_books": available_count, "borrowed_books": books.size() - available_count, "total_users": users.size(), "users_with_books": readers_count}`);
const libraryMain=stage=>{
 const branches=[`        "libro":
            library.add_book(Book.new(fields[0], fields[1], fields[2]))
        "utente":
            library.add_user(User.new(fields[0], fields[1]))`];
 if(stage===227)branches.push(`        "presta":
            for book in library.books:
                if book.isbn == fields[0]:
                    book.available = false
                    book.borrower_id = fields[1]
            for user in library.users:
                if user.user_id == fields[1]:
                    user.borrowed_isbns.append(fields[0])`);
 if(stage>=228)branches.push(`        "presta":
            print(library.borrow_book(fields[0], fields[1]))
        "prestiti":
            var reader: User = library.find_user(fields[0])
            print(reader.user_name, " ha preso in prestito:")
            for isbn in reader.borrowed_isbns:
                print("- ", library.find_book(isbn).title)
        "titolare":
            var book: Book = library.find_book(fields[0])
            if book.available:
                print(book.title, " è sullo scaffale")
            else:
                print(book.title, " è stato preso in prestito da ", library.find_user(book.borrower_id).user_name)`);
 if(stage>=229)branches.push(`        "cerca":
            var term: String = parts[1] if parts.size() > 1 else ""
            var found: Array = library.search_by_title(term)
            print("Risultati per '%s': %d" % [term, found.size()])
            for book in found:
                print("- ", book.title, " di ", book.author)`);
 if(stage>=230)branches.push(`        "statistiche":
            var stats: Dictionary = library.get_statistics()
            print("Totale libri: ", stats["total_books"])
            print("Libri disponibili: ", stats["available_books"])
            print("Libri in prestito: ", stats["borrowed_books"])
            print("Totale utenti: ", stats["total_users"])
            print("Utenti con libri in prestito: ", stats["users_with_books"])`);
 if(stage>=231)branches.push(`        "restituisci":
            print(library.return_book(fields[0], fields[1]))
        "restituisci_tutti":
            var reader: User = library.find_user(fields[0])
            var count: int = reader.return_all_books(library)
            print("Libri restituiti da ", reader.user_name, ": ", count)`);
 branches.push(`        "libri":
            for book in library.books:
                print(book)
        "utenti":
            for user in library.users:
                print(user)
        "mostra":
            print(library)`);
 return main(`var library = Library.new(OS.read_string_from_stdin())
var line = OS.read_string_from_stdin()
while line != "":
    var parts = line.split(" ", true, 1)
    var fields: PackedStringArray = parts[1].split("|") if parts.size() > 1 else PackedStringArray()
    match parts[0]:
${branches.join('\n')}
    line = OS.read_string_from_stdin()`);
};
setup(226,{'library.gd':gd(`class_name Library
extends RefCounted
var library_name: String
var books: Array[String] = []
var users: Array[String] = []
func _init(library_name: String) -> void:
    pass
func _to_string() -> String:
    return ""`),'main.gd':main(`var library = Library.new(OS.read_string_from_stdin())
var line = OS.read_string_from_stdin()
while line != "":
    var parts = line.split(" ", true, 1)
    match parts[0]:
        "libro": library.books.append(parts[1])
        "utente": library.users.append(parts[1])
        "informazioni":
            print("Nome: ", library.library_name)
            print("Libri: ", library.books.size())
            print("Utenti: ", library.users.size())
        "mostra": print(library)
    line = OS.read_string_from_stdin()`)});
setup(227,{'library.gd':libraryBase(false),'main.gd':libraryMain(227)});
for(let n=228;n<=231;n++){
 setup(n,{'book.gd':bookSource,'user.gd':userSource,
 'library.gd':libraryBase(true)+libraryAdd+(n>=229?libraryBorrow:'')+(n>=230?librarySearch:'')+(n>=231?libraryStats:''),
 'main.gd':libraryMain(n)},n===231?['book.gd','main.gd']:['book.gd','user.gd','main.gd']);
}
const librarySim=(stage,input)=>{
 const name=input[0],books=[],users=[],out=[];
 const bookText=b=>`${b.title} di ${b.author} (ISBN: ${b.isbn}) - ${b.holder?'Non disponibile':'Disponibile'}`;
 const userText=u=>`Utente: ${u.name} (ID: ${u.id}) - Libri in prestito: ${u.loans.length}`;
 const returnOne=(isbn,id)=>{
  const b=books.find(b=>b.isbn===isbn),u=users.find(u=>u.id===id);
  if(!b)return 'Libro non trovato';if(!u)return 'Utente non trovato';
  if(!b.holder||b.holder!==id)return 'Questo libro non è stato preso in prestito da questo utente';
  b.holder='';u.loans.splice(u.loans.indexOf(isbn),1);return 'Libro restituito correttamente';
 };
 for(const line of input.slice(1).filter(Boolean)){
  const i=line.indexOf(' '),op=i<0?line:line.slice(0,i),arg=i<0?'':line.slice(i+1),f=arg.split('|');
  if(op==='libro')books.push(stage===226?arg:{title:f[0],author:f[1],isbn:f[2],holder:''});
  else if(op==='utente')users.push(stage===226?arg:{id:f[0],name:f[1],loans:[]});
  else if(op==='informazioni')out.push('Nome: '+name,'Libri: '+books.length,'Utenti: '+users.length);
  else if(op==='mostra')out.push(`Biblioteca ${name} (libri: ${books.length}, utenti: ${users.length})`);
  else if(op==='libri')out.push(...books.map(bookText));
  else if(op==='utenti')out.push(...users.map(userText));
  else if(op==='presta'){
   const b=books.find(b=>b.isbn===f[0]),u=users.find(u=>u.id===f[1]);
   if(stage===227){b.holder=f[1];u.loans.push(f[0]);continue;}
   if(!b)out.push('Libro non trovato');else if(!u)out.push('Utente non trovato');else if(b.holder)out.push('Il libro non è disponibile');
   else{b.holder=u.id;u.loans.push(b.isbn);out.push('Libro prestato correttamente');}
  }else if(op==='prestiti'){
   const u=users.find(u=>u.id===f[0]);out.push(u.name+' ha preso in prestito:',...u.loans.map(isbn=>'- '+books.find(b=>b.isbn===isbn).title));
  }else if(op==='titolare'){
   const b=books.find(b=>b.isbn===f[0]);out.push(b.title+(b.holder?' è stato preso in prestito da '+users.find(u=>u.id===b.holder).name:' è sullo scaffale'));
  }else if(op==='cerca'){
   const found=books.filter(b=>b.title.toLowerCase().includes(arg.toLowerCase()));
   out.push(`Risultati per '${arg}': ${found.length}`,...found.map(b=>'- '+b.title+' di '+b.author));
  }else if(op==='statistiche'){
   const borrowed=books.filter(b=>b.holder).length;
   out.push('Totale libri: '+books.length,'Libri disponibili: '+(books.length-borrowed),
    'Libri in prestito: '+borrowed,'Totale utenti: '+users.length,'Utenti con libri in prestito: '+users.filter(u=>u.loans.length).length);
  }else if(op==='restituisci')out.push(returnOne(f[0],f[1]));
  else if(op==='restituisci_tutti'){
   const u=users.find(u=>u.id===f[0]);let count=0;
   for(const isbn of [...u.loans])if(returnOne(isbn,u.id)==='Libro restituito correttamente')count++;
   out.push('Libri restituiti da '+u.name+': '+count);
  }
 }return out.join('\n');
};
const libInput=rows=>commands('Biblioteca Civica',rows);
const catalog=['libro Dune|Frank Herbert|111','libro Great Expectations|Charles Dickens|222','libro The Great Gatsby|Fitzgerald|333','utente U1|Alice','utente U2|Bob'];
const libraryCases={
 226:[['informazioni','libro Dune','utente Ada','mostra'],['mostra','informazioni'],['libro Uno','libro Due','informazioni','mostra'],
  ['utente Ana','utente Ben','utente Cy','mostra'],['libro Libro con spazi','utente Nome Cognome','informazioni','mostra'],['mostra','libro A','mostra','utente B','mostra']],
 227:[[...catalog,'presta 111|U2','libri','utenti','mostra'],['libri','utenti','mostra'],
  ['libro A|Autore|1','utente X|Nome Cognome','libri','utenti'],[...catalog,'libri','utenti'],
  [...catalog,'presta 222|U1','presta 333|U1','utenti','libri','mostra'],['utente Z|Zero','utenti','mostra']],
 228:[[...catalog,'presta 999|U1','presta 111|U9','presta 111|U1','presta 111|U2','titolare 111','prestiti U1'],
  ['presta 999|X','mostra'],[...catalog,'titolare 222','prestiti U2'],
  [...catalog,'presta 222|U1','presta 333|U1','prestiti U1','utenti','libri'],
  [...catalog,'presta 111|U2','presta 111|U9','presta 999|U9','titolare 111'],
  [...catalog,'presta 333|U2','presta 222|U1','prestiti U2','prestiti U1']],
 229:[[...catalog,'cerca great','cerca zzz'],['cerca','cerca Dune'],[...catalog,'cerca GREAT','cerca'],
  [...catalog,'presta 222|U1','cerca expectations','titolare 222'],[...catalog,'cerca dune','cerca DUNE','cerca e'],
  ['libro A A|Uno|1','libro A B|Due|2','libro B A|Tre|3','cerca A','cerca B']],
 230:[[...catalog,'presta 111|U1','presta 222|U1','presta 333|U2','statistiche'],['statistiche'],
  [...catalog,'statistiche','presta 111|U1','statistiche'],[...catalog,'presta 111|U1','presta 111|U2','presta 999|U1','statistiche'],
  ['utente U1|Senza libri','utente U2|Altro','statistiche'],['libro Solo|Autore|1','statistiche']],
 231:[[...catalog,'presta 111|U1','presta 222|U1','restituisci 111|U2','restituisci_tutti U1','utenti','statistiche'],
  [...catalog,'restituisci 999|U1','restituisci 111|U9','restituisci 111|U1','restituisci_tutti U1'],
  [...catalog,'presta 111|U1','restituisci 111|U1','restituisci 111|U1','titolare 111','prestiti U1'],
  [...catalog,'presta 111|U1','presta 222|U1','presta 333|U1','restituisci_tutti U1','restituisci_tutti U1','statistiche'],
  [...catalog,'presta 111|U1','restituisci 111|U1','presta 111|U2','titolare 111','prestiti U2','statistiche'],
  [...catalog,'presta 111|U1','presta 222|U2','restituisci_tutti U1','titolare 222','statistiche']]
};
const libProof={226:[/\bfunc\s+_init\s*\(/,/\bfunc\s+_to_string\s*\(/,/\blibrary_name\b/],
 227:[/books\s*:\s*Array\s*\[Book\]/,/users\s*:\s*Array\s*\[User\]/,/\bfunc\s+add_book\s*\(/,/\bfunc\s+add_user\s*\(/],
 228:[/\bfunc\s+find_book\s*\(/,/\bfunc\s+find_user\s*\(/,/\bfunc\s+borrow_book\s*\(/],
 229:[/\bfunc\s+search_by_title\s*\(/],230:[/\bfunc\s+get_statistics\s*\(/],
 231:[/\bfunc\s+return_book\s*\(/,/\bfunc\s+return_all_books\s*\(/]};
for(let n=226;n<=231;n++)activate(n,libraryCases[n].map(libInput),input=>librarySim(n,input),...libProof[n]);
// I nomi dei metodi restano quelli richiesti; i comandi utente sono italiani.
for(let n=226;n<=231;n++)for(const[from,to]of [['book TITLE','libro TITOLO'],['user NAME','utente NOME'],['show','mostra'],['info','informazioni'],['books','libri'],['users','utenti'],['lend','presta'],['borrow ISBN','presta ISBN'],['loans ID','prestiti ID'],['holder ISBN','titolare ISBN'],['stats','statistiche']]){
 // Non sostituire gli identificatori tecnici nelle descrizioni delle proprietà.
 if(['books','users','info','show'].includes(from))continue;
 replaceTask(n,new RegExp('\\b'+from+'\\b','g'),to);
}
replaceTask(226,/Biblioteca 2\./g,'2.');
replaceTask(225,/file NAME SIZE/g,'file NOME DIMENSIONE');
replaceTask(226,/user\s+NAME/g,'utente NOME');
replaceTask(226,/\binfo\b/g,'informazioni');replaceTask(226,/\bshow\b/g,'mostra');
replaceTask(226,/restituisce NAME \(libri/g,'restituisce Biblioteca NAME (libri');
replaceTask(227,/user ID\|NAME/g,'utente ID|NOME');
replaceTask(227,/books e users \(stampa/g,'libri e utenti (stampa');
replaceTask(227,/\be show\b/g,'e mostra');
replaceTask(227,/ {2}books\b/g,'  libri');replaceTask(227,/ {2}users\b/g,'  utenti');
replaceTask(228,/holder 111/g,'titolare 111');replaceTask(228,/loans U001/g,'prestiti U001');
replaceTask(228,/sostituisce presta con presta/g,'sostituisce il prestito diretto con presta');
for(const n of [228,229,230])replaceTask(n,/Inserisci il tuo codice in book\.gd, user\.gd e library\.gd/g,'Inserisci il tuo codice in library.gd; book.gd e user.gd sono già forniti');
replaceTask(231,/Inserisci il tuo codice in book\.gd, user\.gd e library\.gd/g,'Inserisci il tuo codice in user.gd e library.gd; book.gd è già fornito');


// 232: corsi, iscrizioni, completamenti e docenti, senza riferimenti ciclici.
setup(232,{'main.gd':main(`var courses = {}
var people = {}
var line = OS.read_string_from_stdin()
while line != "":
    var parts = line.split(" ", true, 1)
    var f: PackedStringArray = parts[1].split("|") if parts.size() > 1 else PackedStringArray()
    match parts[0]:
        "corso":
            var course: Course = Course.new(f[0], int(f[1])) if f.size() > 1 else Course.new(f[0])
            course.course_full.connect(func(title): print("Corso al completo: ", title))
            courses[f[0]] = course
        "studente": people[f[1]] = Student.new(f[0], f[1])
        "docente": people[f[1]] = Instructor.new(f[0], f[1], f[2])
        "iscrivi":
            var ok: bool = people[f[0]].enroll(courses[f[1]])
            print("Iscrivi ", people[f[0]].person_name, " a ", f[1], ": ", ok)
        "disiscrivi":
            var ok: bool = people[f[0]].unenroll(courses[f[1]])
            print("Disiscrivi ", people[f[0]].person_name, " da ", f[1], ": ", ok)
        "completa":
            var ok: bool = people[f[0]].complete_course(courses[f[1]])
            print(people[f[0]].person_name, " completa ", f[1], ": ", ok)
        "assegna":
            var ok: bool = people[f[0]].assign_to_course(courses[f[1]])
            print("Assegna ", people[f[0]].person_name, " a ", f[1], ": ", ok)
        "rapporto":
            for title in courses: print(courses[title])
            for email in people: print(people[email])
    line = OS.read_string_from_stdin()`)});
const learningSim=input=>{
 const courses=new Map(),people=new Map(),out=[];
 for(const line of input.filter(Boolean)){
  const i=line.indexOf(' '),op=i<0?line:line.slice(0,i),f=(i<0?'':line.slice(i+1)).split('|');
  if(op==='corso')courses.set(f[0],{title:f[0],max:f.length>1?Number(f[1]):30,students:[],completed:[],instructor:''});
  else if(op==='studente')people.set(f[1],{name:f[0],email:f[1],enrolled:[],completed:[]});
  else if(op==='docente')people.set(f[1],{name:f[0],email:f[1],expertise:f[2],titles:[]});
  else if(op==='rapporto'){
   for(const c of courses.values())out.push(`${c.title}: ${c.students.length}/${c.max} studenti, ${c.completed.length} completati, docente: ${c.instructor||'nessuno'}`);
   for(const p of people.values())out.push(p.expertise!==undefined?
    `Docente ${p.name} (${p.email}), ${p.expertise}: ${p.titles.join(', ')||'nessun corso'}`:
    `Studente ${p.name} (${p.email}): ${p.enrolled.length} ${p.enrolled.length===1?'iscritto':'iscritti'}, ${p.completed.length} completati`);
  }else{
   const p=people.get(f[0]),c=courses.get(f[1]);let ok=false;
   if(op==='iscrivi'){
    if(!p.enrolled.includes(c.title)&&!p.completed.includes(c.title)&&!c.students.includes(p.email)&&c.students.length<c.max){
     c.students.push(p.email);if(c.students.length===c.max)out.push('Corso al completo: '+c.title);p.enrolled.push(c.title);ok=true;
    }out.push(`Iscrivi ${p.name} a ${c.title}: ${bool(ok)}`);
   }else if(op==='disiscrivi'||op==='completa'){
    if(p.enrolled.includes(c.title)&&c.students.includes(p.email)){
     p.enrolled.splice(p.enrolled.indexOf(c.title),1);c.students.splice(c.students.indexOf(p.email),1);
     if(op==='completa'){c.completed.push(p.email);p.completed.push(c.title);}ok=true;
    }
    out.push(op==='completa'?`${p.name} completa ${c.title}: ${bool(ok)}`:`Disiscrivi ${p.name} da ${c.title}: ${bool(ok)}`);
   }else if(op==='assegna'){
    if(!c.instructor){c.instructor=p.name;p.titles.push(c.title);ok=true;}
    out.push(`Assegna ${p.name} a ${c.title}: ${bool(ok)}`);
   }
  }
 }return out.join('\n');
};
const learners=['studente Ana|a@mail','studente Ben|b@mail','docente Grace Hopper|g@mail|Compilatori'];
const learningCases=[['corso Python 101|2','corso Scienza dei dati',...learners,'iscrivi a@mail|Python 101','iscrivi b@mail|Python 101','iscrivi b@mail|Scienza dei dati','assegna g@mail|Python 101','rapporto'],
 ['corso Vuoto','studente Solo|s@mail','docente Ada|d@mail|Algoritmi','rapporto'],
 ['corso C|1',...learners,'iscrivi a@mail|C','iscrivi a@mail|C','iscrivi b@mail|C','disiscrivi a@mail|C','iscrivi b@mail|C','rapporto'],
 ['corso C|1',...learners,'completa a@mail|C','iscrivi a@mail|C','completa a@mail|C','completa a@mail|C','iscrivi a@mail|C','iscrivi b@mail|C','rapporto'],
 ['corso C',...learners,'docente Altro|x@mail|Matematica','assegna g@mail|C','assegna x@mail|C','assegna g@mail|C','disiscrivi a@mail|C','rapporto'],
 ['corso Zero|0','corso Due|2',...learners,'iscrivi a@mail|Zero','iscrivi a@mail|Due','iscrivi b@mail|Due','disiscrivi a@mail|Due','disiscrivi a@mail|Due','iscrivi a@mail|Due','completa b@mail|Due','assegna g@mail|Zero','assegna g@mail|Due','rapporto']];
activate(232,learningCases.map(r=>[...r,'']),learningSim,/\bsignal\s+course_full\b/,/\bextends\s+Person\b/,
 /\bfunc\s+enroll\s*\(/,/\bfunc\s+complete_course\s*\(/,/\bfunc\s+assign_to_course\s*\(/,/\bsuper\s*\(/);
get(232).task+='<p>Nel testo dello studente usa «1 iscritto» al singolare e «N iscritti» negli altri casi. Per il docente: Docente NOME (EMAIL), COMPETENZA: CORSI, con i titoli separati da virgola e spazio.</p>';

// 233: risultati delle operazioni, limiti di saldo e storico verificato.
setup(233,{'main.gd':gd(main(`var bank = Bank.new(OS.read_string_from_stdin())
var line = OS.read_string_from_stdin()
while line != "":
    var parts = line.split(" ", true, 1)
    var f: PackedStringArray = parts[1].split("|") if parts.size() > 1 else PackedStringArray()
    match parts[0]:
        "apri": show_result(bank.create_account(f[0], f[1], f[2], float(f[3])))
        "deposita": show_result(bank.get_account(f[0]).deposit(float(f[1])))
        "preleva": show_result(bank.get_account(f[0]).withdraw(float(f[1])))
        "interessi":
            var account: Account = bank.get_account(f[0])
            if account is SavingsAccount:
                show_result((account as SavingsAccount).apply_interest())
            else:
                print("Operazione non riuscita: ", f[0], " non è un conto di risparmio")
        "trasferisci": show_result(bank.transfer(f[0], f[1], float(f[2])))
        "storico":
            var history: Array = bank.get_account(f[0]).get_history()
            print("Storico di ", f[0], ":")
            for i in history.size(): print(i + 1, ". ", history[i])
        "account": print(bank.get_account(f[0]))
        "totale": print("Totale posseduto da %s: $%.2f" % [bank.bank_name, bank.total_holdings()])
    line = OS.read_string_from_stdin()`)+`
func show_result(result: Dictionary) -> void:
    print(("OK: " if result["ok"] else "Operazione non riuscita: ") + result["message"])
`)});
const bankSim=input=>{
 const name=input[0],accounts=new Map(),out=[];
 const result=(ok,message)=>({ok,message});
 const show=r=>out.push((r.ok?'OK: ':'Operazione non riuscita: ')+r.message);
 const deposit=(a,n)=>{if(n<=0)return result(false,"L'importo del deposito deve essere positivo");a.balance+=n;a.history.push(['Deposito',n]);return result(true,`Depositati $${money(n)}. Nuovo saldo: $${money(a.balance)}`);};
 const withdraw=(a,n)=>{
  if(n<=0)return result(false,"L'importo del prelievo deve essere positivo");
  if(a.kind==='risparmio'&&a.balance-n<100)return result(false,'Impossibile prelevare sotto il saldo minimo di $100.00');
  if(a.kind==='corrente'&&a.balance-n< -200)return result(false,'Impossibile superare il limite di scoperto di $200.00');
  a.balance-=n;a.history.push(['Prelievo',n]);return result(true,`Prelevati $${money(n)}. Nuovo saldo: $${money(a.balance)}`+(a.balance<0?' (Scoperto)':''));
 };
 for(const line of input.slice(1).filter(Boolean)){
  const i=line.indexOf(' '),op=i<0?line:line.slice(0,i),f=(i<0?'':line.slice(i+1)).split('|'),a=accounts.get(f[0]);
  if(op==='apri'){
   if(accounts.has(f[1]))show(result(false,'Il numero di conto esiste già'));
   else if(!['risparmio','corrente'].includes(f[0].toLowerCase()))show(result(false,'Tipo di conto non valido'));
   else{const k=f[0].toLowerCase();accounts.set(f[1],{kind:k,number:f[1],owner:f[2],balance:Number(f[3]),history:[]});show(result(true,k==='risparmio'?'Conto di risparmio creato correttamente':'Conto corrente creato correttamente'));}
  }else if(op==='deposita')show(deposit(a,Number(f[1])));
  else if(op==='preleva')show(withdraw(a,Number(f[1])));
  else if(op==='interessi'){
   if(a.kind!=='risparmio')out.push('Operazione non riuscita: '+f[0]+' non è un conto di risparmio');
   else{const interest=a.balance*0.02;a.balance+=interest;a.history.push(['Interessi',interest]);show(result(true,`Interessi applicati: $${money(interest)}. Nuovo saldo: $${money(a.balance)}`));}
  }else if(op==='trasferisci'){
   const b=accounts.get(f[1]),n=Number(f[2]);
   if(!a||!b)show(result(false,'Uno o entrambi i conti non sono stati trovati'));
   else{const r=withdraw(a,n);if(!r.ok)show(result(false,'Trasferimento non riuscito: '+r.message));else{deposit(b,n);show(result(true,`Trasferiti $${money(n)} da ${f[0]} a ${f[1]}`));}}
  }else if(op==='storico')out.push('Storico di '+f[0]+':',...a.history.map(([kind,n],i)=>(i+1)+'. '+kind+' - $'+money(n)));
  else if(op==='account')out.push((a.kind==='risparmio'?'Risparmio':'Corrente')+` ${a.number} (${a.owner}): $${money(a.balance)}`);
  else if(op==='totale')out.push('Totale posseduto da '+name+': $'+money([...accounts.values()].reduce((s,a)=>s+a.balance,0)));
 }return out.join('\n');
};
const bankCases=[['apri risparmio|S1|Alice|1000','apri corrente|C1|Bob|50','preleva S1|950','trasferisci S1|C1|300','preleva C1|400','storico C1','totale'],
 ['apri RiSpArMiO|S|Ada|100','preleva S|0','preleva S|-1','preleva S|1','deposita S|0','deposita S|-3','deposita S|50','preleva S|50','account S','storico S'],
 ['apri CORRENTE|C|Bo|0','preleva C|200','preleva C|0.01','deposita C|0.50','account C','storico C','totale'],
 ['apri sbagliato|X|X|100','apri corrente|C|Bo|10','apri risparmio|C|Cy|500','interessi C','trasferisci C|X|1','trasferisci X|C|1','totale'],
 ['apri risparmio|S|Nora|500','interessi S','interessi S','account S','storico S','totale'],
 ['apri corrente|A|Ana|75','apri corrente|B|Ben|25','trasferisci A|B|0','trasferisci A|B|-2','trasferisci A|B|300','trasferisci A|B|20.25','trasferisci B|A|5.75','storico A','storico B','account A','account B','totale']];
activate(233,bankCases.map(r=>commands('Prima Banca',r)),bankSim,/@abstract\s+(?:class_name\s+Account|func\s+account_type)/,
 /\bbalance\s*:\s*float\s*:\s*\n\s*get\s*:/,/\bconst\s+INTEREST_RATE\b/,/\bconst\s+MIN_BALANCE\b/,/\bconst\s+OVERDRAFT_LIMIT\b/,
 /\bfunc\s+transfer\s*\(/,/\bSavingsAccount\.new\s*\(/,/\bCheckingAccount\.new\s*\(/);
replaceTask(233,/L’importo/g,"L'importo");replaceTask(233,/transazione interest/g,'transazione interessi');
get(233).task+='<p>Transaction usa i tipi «deposito», «prelievo», «interessi» e li mostra come Deposito, Prelievo, Interessi. Tutti gli importi, anche il totale della banca, sono scritti come $100.00.</p>';

// 234: statistiche, ereditarietà, mana e un solo segnale alla sconfitta.
setup(234,{'main.gd':main(`var heroes = {}
var line = OS.read_string_from_stdin()
while line != "":
    var parts = line.split(" ", true, 1)
    var f: PackedStringArray = parts[1].split("|") if parts.size() > 1 else PackedStringArray()
    match parts[0]:
        "eroe":
            var hero: Character
            match f[0]:
                "guerriero": hero = Warrior.new(f[1])
                "mago": hero = Mage.new(f[1])
                "ladro": hero = Rogue.new(f[1])
            hero.defeated.connect(func(who): print(who, " è stato sconfitto!"))
            heroes[f[1]] = hero
        "impara": heroes[f[0]].learn_ability(Ability.new(f[1], int(f[2]), float(f[3])))
        "attacca": heroes[f[0]].attack(heroes[f[1]])
        "lancia": heroes[f[0]].use_ability(int(f[1]), heroes[f[2]])
        "livello": print(heroes[f[0]].level_up())
        "stato": print(heroes[f[0]])
        "vivo": print(f[0], " vivo: ", heroes[f[0]].is_alive())
    line = OS.read_string_from_stdin()`)});
const charactersSim=input=>{
 const heroes=new Map(),out=[];
 const damage=(t,n)=>{const alive=t.health>0,d=Math.max(1,n-t.defense*0.5);t.health=Math.max(0,t.health-d);
  out.push(`${t.name} subisce ${d.toFixed(1)} danni (PS ${t.health.toFixed(1)})`);if(alive&&t.health===0)out.push(t.name+' è stato sconfitto!');return d;};
 for(const line of input.filter(Boolean)){
  const i=line.indexOf(' '),op=line.slice(0,i),f=line.slice(i+1).split('|'),h=heroes.get(f[0]);
  if(op==='eroe'){
   const kind=f[0],c={name:f[1],kind,title:{guerriero:'Guerriero',mago:'Mago',ladro:'Ladro'}[kind],level:1,maxHealth:100,maxMana:50,strength:10,intelligence:10,agility:10,defense:5,abilities:[]};
   if(kind==='guerriero')Object.assign(c,{maxHealth:150,maxMana:30,strength:15,intelligence:5,defense:8});
   else if(kind==='mago')Object.assign(c,{maxHealth:80,maxMana:150,strength:5,intelligence:20,defense:3});
   else Object.assign(c,{maxHealth:100,maxMana:60,strength:12,intelligence:8,agility:18,defense:4});
   c.health=c.maxHealth;c.mana=c.maxMana;heroes.set(c.name,c);
  }else if(op==='impara')h.abilities.push({name:f[1],cost:Number(f[2]),damage:Number(f[3])});
  else if(op==='attacca'){
   out.push(h.name+' attacca '+f[1]);
   damage(heroes.get(f[1]),h.kind==='guerriero'?h.strength*1.2:h.kind==='mago'?h.intelligence*0.4:h.strength*0.5+h.agility*0.7);
   if(h.kind==='mago')h.mana=Math.min(h.maxMana,h.mana+5);
  }else if(op==='lancia'){
   const a=h.abilities[Number(f[1])];
   if(!a)out.push(`${h.name} non possiede l'abilità ${f[1]}`);
   else if(h.mana<a.cost)out.push(h.name+' non ha abbastanza mana per '+a.name);
   else{h.mana-=a.cost;out.push(h.name+' lancia '+a.name+' su '+f[2]);damage(heroes.get(f[2]),a.damage+h.intelligence*0.5);}
  }else if(op==='livello'){
   h.level++;h.maxHealth+=10;h.maxMana+=5;h.strength++;h.intelligence++;h.agility++;h.defense++;
   if(h.kind==='guerriero'){h.strength+=2;h.maxHealth+=10;}
   else if(h.kind==='mago'){h.intelligence+=2;h.maxMana+=15;}
   else h.agility+=2;
   h.health=h.maxHealth;h.mana=h.maxMana;out.push(h.name+' ha raggiunto il livello '+h.level+'!');
  }else if(op==='stato')out.push(`${h.name} il ${h.title} (livello ${h.level}): PS ${h.health.toFixed(1)}/${h.maxHealth.toFixed(1)}, mana ${h.mana}/${h.maxMana}, FOR ${h.strength}, INT ${h.intelligence}, AGI ${h.agility}, DIF ${h.defense}`);
  else if(op==='vivo')out.push(h.name+' vivo: '+bool(h.health>0));
 }return out.join('\n');
};
const party=['eroe guerriero|Aragorn','eroe mago|Merlino','eroe ladro|Orc'];
const heroCases=[['eroe guerriero|Aragorn','eroe ladro|Orc','attacca Aragorn|Orc','attacca Orc|Aragorn','livello Aragorn','stato Aragorn'],
 [...party,'stato Aragorn','stato Merlino','stato Orc','vivo Merlino'],
 [...party,'impara Merlino|Fuoco|100|40','lancia Merlino|0|Aragorn','lancia Merlino|0|Aragorn','attacca Merlino|Orc','stato Merlino','lancia Merlino|-1|Orc','lancia Merlino|9|Orc'],
 [...party,'impara Merlino|Fine|10|500','lancia Merlino|0|Orc','vivo Orc','lancia Merlino|0|Orc','livello Orc','vivo Orc','stato Orc'],
 [...party,'livello Aragorn','livello Merlino','livello Orc','livello Merlino','stato Aragorn','stato Merlino','stato Orc','attacca Merlino|Aragorn','attacca Orc|Merlino'],
 [...party,'impara Aragorn|Tocco|0|-20','lancia Aragorn|0|Merlino','impara Merlino|Lampo|150|1','lancia Merlino|0|Aragorn','stato Merlino','attacca Merlino|Orc','stato Merlino','livello Merlino','stato Merlino']];
activate(234,heroCases.map(r=>[...r,'']),charactersSim,/@abstract\s+func\s+class_title\s*\(/,/@abstract\s+func\s+attack_power\s*\(/,
 /\bsignal\s+defeated\b/,/\bArray\s*\[Ability\]/,/\bsuper\.level_up\s*\(/,/\bsuper\.attack\s*\(/);
replaceTask(234,/l’abilità/g,"l'abilità");replaceTask(234,/\bHP\b/g,'PS');replaceTask(234,/\bSTR\b/g,'FOR');replaceTask(234,/\bDEF\b/g,'DIF');
get(234).task+='<p>class_title() restituisce Guerriero, Mago o Ladro. Il comando vivo NOME mostra is_alive(). Il segnale defeated viene emesso solo nel passaggio da salute positiva a zero.</p>';

// 235: disponibilità, id assegnati solo ai noleggi riusciti e ricavi.
// Il PDF spezza la firma del costruttore della motocicletta.
setup(235,{'motorcycle.gd':get(235).sourceFiles['motorcycle.gd'].replace(/\)\s*->\s*\n\s*void:/,') -> void:'),
'main.gd':main(`var agency = RentalAgency.new(OS.read_string_from_stdin())
var line = OS.read_string_from_stdin()
while line != "":
    var parts = line.split(" ", true, 1)
    var f: PackedStringArray = parts[1].split("|") if parts.size() > 1 else PackedStringArray()
    match parts[0]:
        "veicolo": agency.add_vehicle(Vehicle.new(f[0], f[1], f[2], int(f[3])))
        "auto": agency.add_vehicle(Car.new(f[0], f[1], f[2], int(f[3]), int(f[4])))
        "moto": agency.add_vehicle(Motorcycle.new(f[0], f[1], f[2], int(f[3]), int(f[4])))
        "noleggia":
            var rental_id: String = agency.rent_vehicle(f[0], f[1], int(f[2]))
            if rental_id == "":
                print("Noleggio impossibile ", f[0])
            else:
                var rental: Rental = agency.rentals[rental_id]
                print("Noleggiato %s come %s: $%d" % [f[0], rental_id, rental.calculate_cost()])
        "restituisci": print("Restituzione ", f[0], ": ", agency.return_vehicle(f[0]))
        "disponibili":
            print("Disponibile presso ", agency.agency_name, ":")
            for vehicle in agency.available_vehicles(): print("- ", vehicle)
        "flotta":
            for vin in agency.vehicles: print(agency.vehicles[vin])
        "tipo":
            var vehicle: Vehicle = agency.vehicles[f[0]]
            print("%s: Veicolo %s, Auto %s, Motocicletta %s" % [f[0], vehicle is Vehicle, vehicle is Car, vehicle is Motorcycle])
        "noleggi":
            for rental_id in agency.rentals: print(agency.rentals[rental_id])
        "ricavi": print("Ricavi: $", agency.total_revenue())
    line = OS.read_string_from_stdin()`)});
const rentalSim=input=>{
 const name=input[0],vehicles=new Map(),rentals=new Map(),out=[];let next=1;
 const text=v=>`${v.make} ${v.model} (VIN: ${v.vin}) - ${v.available?'Disponibile':'Noleggiato'}`;
 const vehicleText=v=>v.kind==='auto'?'Auto: '+text(v)+' - '+v.extra+' posti':v.kind==='moto'?'Motocicletta: '+text(v)+' - '+v.extra+'cc':text(v);
 for(const line of input.slice(1).filter(Boolean)){
  const i=line.indexOf(' '),op=i<0?line:line.slice(0,i),f=(i<0?'':line.slice(i+1)).split('|');
  if(['auto','moto','veicolo'].includes(op))vehicles.set(f[0],{vin:f[0],make:f[1],model:f[2],rate:Number(f[3]),extra:f[4],kind:op,available:true});
  else if(op==='noleggia'){
   const v=vehicles.get(f[0]),days=Number(f[2]);
   if(!v||days<1||!v.available)out.push('Noleggio impossibile '+f[0]);
   else{v.available=false;const id='R'+next++;rentals.set(id,{id,v,customer:f[1],days,active:true});out.push(`Noleggiato ${v.vin} come ${id}: $${v.rate*days}`);}
  }else if(op==='restituisci'){
   const r=rentals.get(f[0]),ok=Boolean(r&&r.active);if(ok){r.active=false;r.v.available=true;}out.push('Restituzione '+f[0]+': '+bool(ok));
  }else if(op==='disponibili'){out.push('Disponibile presso '+name+':');for(const v of vehicles.values())if(v.available)out.push('- '+vehicleText(v));}
  else if(op==='flotta')for(const v of vehicles.values())out.push(vehicleText(v));
  else if(op==='tipo'){const v=vehicles.get(f[0]);out.push(`${v.vin}: Veicolo true, Auto ${bool(v.kind==='auto')}, Motocicletta ${bool(v.kind==='moto')}`);}
  else if(op==='noleggi')for(const r of rentals.values())out.push(`Noleggio ${r.id}: ${r.v.make} ${r.v.model} per ${r.customer}, ${r.days} giorni, $${r.v.rate*r.days} - ${r.active?'Attivo':'Terminato'}`);
  else if(op==='ricavi')out.push('Ricavi: $'+[...rentals.values()].reduce((s,r)=>s+r.v.rate*r.days,0));
 }return out.join('\n');
};
const fleet=['auto C1|Toyota|Camry|50|5','moto M1|Honda|CBR|40|600','veicolo V1|Fiat|Van|30'];
const rentalCases=[[...fleet.slice(0,2),'noleggia C1|Ana|3','noleggia C1|Ben|2','disponibili','tipo M1','noleggi','ricavi'],
 ['disponibili','noleggi','ricavi','restituisci R1'],[...fleet,'flotta','tipo C1','tipo M1','tipo V1'],
 [...fleet,'noleggia X|Ana|2','noleggia C1|Ana|0','noleggia C1|Ana|-1','noleggia M1|Ben|1','noleggia C1|Ana|2','ricavi','noleggi'],
 [...fleet,'noleggia C1|Ana|1','restituisci R1','restituisci R1','noleggia C1|Ben|4','restituisci R1','disponibili','noleggi','ricavi'],
 [...fleet,'noleggia V1|Cy|2','noleggia M1|Ana|3','restituisci R2','noleggia M1|Ben|1','noleggia C1|Dee|5','restituisci R1','restituisci R99','flotta','disponibili','noleggi','ricavi']];
activate(235,rentalCases.map(r=>commands('Noleggi Sprint',r)),rentalSim,/\bfunc\s+start_rental\s*\(/,/\bfunc\s+rent_vehicle\s*\(/,
 /\bfunc\s+return_vehicle\s*\(/,/\bfunc\s+available_vehicles\s*\(/,/\bfunc\s+total_revenue\s*\(/,/\bRental\.new\s*\(/,/\bsuper\._to_string\s*\(/);

// Contratti dei progetti finali: controlla anche i valori restituiti,
// che i driver dimostrativi non sempre stampano.
const contract=(n,harness,returns,extraOutput='')=>{
 const first=verifier.expectedCases[n][0];
 verifier.expectedCases[n].push({name:'Contratto dei metodi e dello stato',stdin:first.stdin,
  output:first.output+(extraOutput?'\n'+extraOutput:''),harness:gd(harness),
  calls:[{method:'__manual_contract',args:[]}],returns:[returns]});
};
contract(232,`func __manual_contract() -> Array:
    var course = Course.new("Test", 2)
    var person = Person.new("P", "p@mail")
    var results = [person.person_name, person.email, course.max_capacity]
    results.append(course.add_student("a"))
    results.append(course.add_student("a"))
    results.append(course.add_student("b"))
    results.append(course.add_student("c"))
    results.append(course.remove_student("x"))
    results.append(course.mark_completed("a"))
    results.append(course.mark_completed("a"))
    results.append(course.student_emails.duplicate())
    results.append(course.completed_emails.duplicate())
    results.append(course.assign_instructor("Docente"))
    results.append(course.assign_instructor("Altro"))
    var student = Student.new("S", "s@mail")
    results.append(student is Person)
    results.append(student.enroll(course))
    results.append(student.complete_course(course))
    results.append(student.enroll(course))
    results.append(student.completed.duplicate())
    return results`,['P','p@mail',2,true,false,true,false,false,true,false,['b'],['a'],true,false,true,true,true,false,['Test']]);
contract(233,`func __manual_contract() -> Array:
    var bank = Bank.new("Test")
    var created = bank.create_account("CORRENTE", "A", "Ada", 50.0)
    var a = bank.get_account("A")
    var denied = a.withdraw(251.0)
    var accepted = a.deposit(2.0)
    var transaction = Transaction.new("deposito", 2.0)
    return [created["ok"], a is CheckingAccount, bank.get_account("X") == null, denied["ok"], accepted["ok"], a.balance, a.get_history().size(), transaction.kind, transaction.amount, bank.total_holdings()]`,[true,true,true,false,true,52,1,'deposito',2,52]);
contract(234,`func __manual_contract() -> Array:
    var warrior = Warrior.new("W")
    var mage = Mage.new("M")
    var rogue = Rogue.new("R")
    var defeats: Array[String] = []
    rogue.defeated.connect(func(who): defeats.append(who))
    var first = rogue.take_damage(0.0)
    var lethal = rogue.take_damage(999.0)
    var repeated = rogue.take_damage(3.0)
    var ability = Ability.new("Vuoto", 1, 2.0)
    mage.mana = 0
    var refused = ability.use(mage, warrior)
    warrior.learn_ability(Ability.new("Uno", 0, 0.0))
    warrior.learn_ability(Ability.new("Due", 1, 1.0))
    return [warrior is Character, warrior.attack_power(), mage.attack_power(), rogue.attack_power(), first, lethal, repeated, rogue.health, rogue.is_alive(), defeats, refused, mage.mana, warrior.abilities.size()]`,
 [true,18,8,18.6,1,997,1,0,false,['R'],0,0,2],
 "R subisce 1.0 danni (PS 99.0)\nR subisce 997.0 danni (PS 0.0)\nR subisce 1.0 danni (PS 0.0)\nM non ha abbastanza mana per Vuoto");
contract(235,`func __manual_contract() -> Array:
    var v = Vehicle.new("V", "A", "B", 7)
    var results = [v.vin, v.make, v.model, v.daily_rate, v.available]
    results.append(v.start_rental())
    results.append(v.start_rental())
    v.end_rental()
    results.append(v.available)
    var rental = Rental.new("R9", v, "Ada", 3)
    results.append(rental.calculate_cost())
    results.append(rental.end_rental())
    results.append(rental.end_rental())
    results.append(v.available)
    var agency = RentalAgency.new("Test")
    agency.add_vehicle(v)
    results.append(agency.rent_vehicle("V", "Ben", 0))
    results.append(agency.next_rental_id)
    results.append(agency.rent_vehicle("V", "Ben", 2))
    results.append(agency.total_revenue())
    results.append(agency.available_vehicles().size())
    return results`,['V','A','B',7,true,true,false,true,21,true,false,true,'',1,'R1',14,0]);

window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 ...Object.fromEntries(Array.from({length:15},(_,i)=>{const n=221+i;return [n,verifier.expectedCases[n][0].stdin];}))});
window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();
