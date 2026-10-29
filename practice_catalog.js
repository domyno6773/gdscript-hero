/* Laboratori multi-compito: 14 capitoli successivi al pilota.
   Tre prove per ciascun argomento: applicazione, debugging, trasferimento.
   Nessun GDScript viene interpretato in JavaScript: le soluzioni sono
   eseguite e valutate esclusivamente nel motore nativo Godot. */
(function(root){
'use strict';
const make=(key,title,task,initialCode,solution,expectedOutput,mustUse=[],tips=[])=>({
  key,title,task:'<p>'+task+'</p>',initialCode,solution,expectedOutput,
  requirements:{mustUse},
  hints:[
    {level:1,type:'concept',label:'Ragiona',text:tips[0]||'Identifica i dati e il comportamento che la consegna richiede.'},
    {level:2,type:'structure',label:'Struttura',text:tips[1]||'Controlla le condizioni, le funzioni e i tipi usati.'},
    {level:3,type:'example',label:'Esempio simile',text:tips[2]||'Prova un caso simile con dati diversi prima di verificare.'}
  ]
});
const ready=body=>'extends Node\n\nfunc _ready():\n'+body.split('\n').map(x=>x?'    '+x:'').join('\n')+'\n';
const task=(k,title,desc,starter,sol,expected,patterns,hints)=>make(k,title,desc,starter,sol,expected,patterns,hints);
const banks={
  2:(n)=>[
    task('p2','Inizializza due statistiche',
      'Dichiara una variabile testuale <code>eroe</code> con valore <code>Lia</code> e una numerica <code>vite</code> con valore '+(n+2)+'. Stampa i valori su due righe usando le variabili.',
      ready('# Definisci eroe e vite, poi visualizzale\npass'),
      ready('var eroe = "Lia"\nvar vite = '+(n+2)+'\nprint(eroe)\nprint(vite)'),
      'Lia\n'+(n+2),['\\bvar\\s+eroe\\b','\\bvar\\s+vite\\b','\\bprint\\s*\\(\\s*eroe\\s*\\)'],
      ['Testo e numeri sono tipi diversi.','Dichiara entrambe le variabili con var e stampale per nome.','Usa print(eroe), non print("eroe").']),
    task('p3','Ripara una somma',
      'Nel registro il secondo valore viene concatenato come testo. Correggi il calcolo affinché <code>totale</code> sia la somma numerica di '+(n+3)+' e '+(n+5)+'.',
      ready('var primo = '+(n+3)+'\nvar secondo = "'+(n+5)+'"\n# Ripara il dato e calcola il totale\nprint("Totale: ", primo + secondo)'),
      ready('var primo = '+(n+3)+'\nvar secondo = '+(n+5)+'\nvar totale = primo + secondo\nprint("Totale: ", totale)'),
      'Totale: '+(2*n+8),['\\bvar\\s+totale\\b','\\bprimo\\s*\\+\\s*secondo\\b'],
      ['Una stringa non è un intero.','Correggi il tipo del secondo dato e assegna la somma a totale.','Non stampare il risultato come stringa fissa.']),
    task('p4','Descrizione dinamica',
      'Costruisci da due variabili una frase dinamica: <code>Personaggio: Milo - Livello: '+(n+4)+'</code>. Converti il numero con <code>str()</code>.',
      ready('var nome = "Milo"\nvar livello = '+(n+4)+'\n# Componi e stampa il messaggio\npass'),
      ready('var nome = "Milo"\nvar livello = '+(n+4)+'\nvar testo = "Personaggio: " + nome + " - Livello: " + str(livello)\nprint(testo)'),
      'Personaggio: Milo - Livello: '+(n+4),['\\bstr\\s*\\(','\\bnome\\b','\\blivello\\b'],
      ['Il numero deve diventare testo per unirlo alla frase.','Usa str(livello) nella concatenazione.','Il messaggio deve dipendere dalle due variabili.'])
  ],
  3:(n)=>[
    task('p2','Valori a tipo esplicito','Dichiara <code>hp: int</code> a '+(60+n)+' e <code>scudo: bool</code> a <code>true</code>; stampa entrambi.',
      ready('# Dichiara e stampa hp e scudo\npass'),
      ready('var hp: int = '+(60+n)+'\nvar scudo: bool = true\nprint(hp)\nprint(scudo)'),
      (60+n)+'\ntrue',['\\bhp\\s*:\\s*int\\b','\\bscudo\\s*:\\s*bool\\b'],
      ['Il tipo si indica dopo i due punti.','Scrivi le dichiarazioni prima delle stampe.','Un bool accetta solo true o false.']),
    task('p3','Distingui inferenza e costante','Definisci una costante <code>MAX_VITE</code> uguale a '+(10+n)+' e una variabile <code>vite</code> tramite <code>:=</code>, inizializzata a '+n+'. Stampa la differenza.',
      ready('# Definisci costante e variabile con inferenza\npass'),
      ready('const MAX_VITE: int = '+(10+n)+'\nvar vite := '+n+'\nprint(MAX_VITE - vite)'),
      '10',['\\bconst\\s+MAX_VITE\\b','\\bvar\\s+vite\\s*:=','\\bMAX_VITE\\s*-\\s*vite\\b'],
      ['Una costante non cambia, una variabile sì.','Usa const e := nelle dichiarazioni.','Calcola la differenza usando i nomi.']),
    task('p4','Correggi una dichiarazione tipizzata','Una variabile intera è stata inizializzata con testo. Mantieni il tipo <code>int</code> e correggi l’assegnazione, poi determina se il punteggio '+(n+15)+' supera 10.',
      ready('var punteggio: int = "'+(n+15)+'"\nprint(punteggio > 10)'),
      ready('var punteggio: int = '+(n+15)+'\nprint(punteggio > 10)'),
      'true',['\\bpunteggio\\s*:\\s*int\\b','\\bpunteggio\\s*>\\s*10\\b'],
      ['Il valore fra virgolette è una String.','Rimuovi le virgolette dal numero.','Il confronto produce un booleano.'])
  ],
  4:(n)=>[
    task('p2','Costo con tassa','Calcola il prezzo di '+(n+2)+' batterie a 6 monete e una tassa fissa di 3 usando le variabili. Stampa il totale.',
      ready('var prezzo = 6\nvar quantita = '+(n+2)+'\nvar tassa = 3\n# Calcola totale\npass'),
      ready('var prezzo = 6\nvar quantita = '+(n+2)+'\nvar tassa = 3\nvar totale = prezzo * quantita + tassa\nprint(totale)'),
      String(6*(n+2)+3),['(?:\\bprezzo\\s*\\*\\s*quantita\\b|\\bquantita\\s*\\*\\s*prezzo\\b)','\\bvar\\s+totale\\b'],
      ['Prima moltiplica il costo per quantità.','Poi aggiungi la tassa fissa.','Il totale deve usare le tre variabili.']),
    task('p3','Ripara il saldo','Il programma sovrascrive il saldo invece di sottrarre '+(n+4)+' monete. Usa un’assegnazione rapida e stampa il saldo finale.',
      ready('var saldo = 100\nsaldo = '+(n+4)+'\nprint(saldo)'),
      ready('var saldo = 100\nsaldo -= '+(n+4)+'\nprint(saldo)'),
      String(100-n-4),['\\bsaldo\\s*-=' ],
      ['Un acquisto diminuisce il saldo precedente.','Usa -= invece di =.','Non sostituire direttamente il valore finale.']),
    task('p4','Distribuzione del bottino','Distribuisci '+(n*3+11)+' monete tra 3 avventurieri. Calcola quote intere e resto con divisione e modulo, poi stampa due righe.',
      ready('var monete = '+(n*3+11)+'\nvar membri = 3\n# Calcola quota e resto\npass'),
      ready('var monete = '+(n*3+11)+'\nvar membri = 3\nvar quota = int(monete / membri)\nvar resto = monete % membri\nprint("Quota: ", quota)\nprint("Resto: ", resto)'),
      'Quota: '+Math.floor((n*3+11)/3)+'\nResto: '+((n*3+11)%3),
      ['\\bmonete\\s*%\\s*membri\\b','\\bmonete\\s*\\/\\s*membri\\b'],
      ['La divisione calcola la quota, il modulo il resto.','Usa % e / sulle variabili.','La quota deve essere un intero.'])
  ],
  5:(n)=>[
    task('p2','Soglia del cancello','Un giocatore ha '+(n+7)+' punti; il cancello richiede almeno 10. Usa <code>if/else</code> per stampare <code>Aperto</code> oppure <code>Chiuso</code>.',
      ready('var punti = '+(n+7)+'\n# Decidi se aprire il cancello\npass'),
      ready('var punti = '+(n+7)+'\nif punti >= 10:\n    print("Aperto")\nelse:\n    print("Chiuso")'),
      n+7>=10?'Aperto':'Chiuso',['\\bif\\b','\\belse\\s*:','\\bpunti\\s*>=\\s*10'],
      ['Controlla il limite 10, incluso.','Usa if e un ramo else.','La condizione deve usare punti.']),
    task('p3','Due requisiti di accesso','La porta richiede una tessera valida e un allarme disattivato. Usa <code>not</code> e <code>and</code> per decidere se stampare <code>Accesso</code>.',
      ready('var tessera = true\nvar allarme = false\n# Controlla entrambi i requisiti\npass'),
      ready('var tessera = true\nvar allarme = false\nif tessera and not allarme:\n    print("Accesso")\nelse:\n    print("Negato")'),
      'Accesso',['\\band\\b','\\bnot\\b','\\bif\\b'],
      ['I requisiti devono valere contemporaneamente.','L’allarme deve essere negato con not.','Se un requisito manca, stampa Negato.']),
    task('p4','Tre livelli di pericolo','Classifica il rischio '+(n*12)+' usando <code>if</code>, <code>elif</code> ed <code>else</code>: almeno 50 = Alto; almeno 25 = Medio; altrimenti Basso.',
      ready('var rischio = '+(n*12)+'\n# Scrivi tre rami di classificazione\npass'),
      ready('var rischio = '+(n*12)+'\nif rischio >= 50:\n    print("Alto")\nelif rischio >= 25:\n    print("Medio")\nelse:\n    print("Basso")'),
      n*12>=50?'Alto':n*12>=25?'Medio':'Basso',['\\belif\\b','\\belse\\s*:','\\bif\\b'],
      ['Le condizioni vengono provate dall’alto in basso.','Controlla prima la soglia più alta.','Il ramo else copre tutti i casi restanti.'])
  ],
  6:(n)=>[
    task('p2','Espandi l’inventario','Aggiungi <code>Benda</code> a un inventario di due oggetti con <code>append()</code>. Stampa l’ultimo elemento e la dimensione.',
      ready('var inventario = ["Spada", "Mappa"]\n# Aggiungi un oggetto\npass'),
      ready('var inventario = ["Spada", "Mappa"]\ninventario.append("Benda")\nprint(inventario[2])\nprint(inventario.size())'),
      'Benda\n3',['\\.append\\s*\\(','\\.size\\s*\\('],
      ['append inserisce alla fine.','L’indice dell’ultimo elemento è 2.','size restituisce il numero degli elementi.']),
    task('p3','Ripara una rimozione','Lo zaino contiene una chiave da eliminare: cerca l’oggetto con <code>has()</code>, rimuovilo con <code>erase()</code> e stampa la dimensione.',
      ready('var zaino = ["Pozione", "Chiave", "Lanterna"]\n# Controlla e rimuovi la chiave\npass'),
      ready('var zaino = ["Pozione", "Chiave", "Lanterna"]\nif zaino.has("Chiave"):\n    zaino.erase("Chiave")\nprint(zaino.size())'),
      '2',['\\.has\\s*\\(','\\.erase\\s*\\(','\\bif\\b'],
      ['Prima controlla la presenza.','Usa has nel if prima di erase.','La stampa deve usare size(), non il numero 2 fisso.']),
    task('p4','Punteggi tipizzati','Crea un <code>Array[int]</code> con '+n+' e '+(n+1)+', aggiungi '+(n+2)+' e stampa la somma del primo e dell’ultimo.',
      ready('# Dichiara l’array tipizzato, aggiungi e calcola\npass'),
      ready('var punteggi: Array[int] = ['+n+', '+(n+1)+']\npunteggi.append('+(n+2)+')\nprint(punteggi[0] + punteggi[2])'),
      String(2*n+2),['Array\\s*\\[\\s*int\\s*\\]','\\.append\\s*\\('],
      ['Gli Array tipizzati impongono il tipo degli elementi.','Usa Array[int] e append.','Accedi agli indici 0 e 2.'])
  ],
  7:(n)=>[
    task('p2','Somma di un intervallo','Somma con <code>for</code> e <code>range()</code> i valori da 1 a '+(n+3)+' inclusi, senza scrivere la somma finale nel codice.',
      ready('var totale = 0\n# Somma i numeri con un ciclo\npass'),
      ready('var totale = 0\nfor numero in range(1, '+(n+4)+'):\n    totale += numero\nprint(totale)'),
      String((n+3)*(n+4)/2),['\\bfor\\b','\\brange\\s*\\(','\\btotale\\s*\\+='],
      ['range esclude il suo limite superiore.','Il ciclo deve includere '+(n+3)+'.','Usa un accumulatore.']),
    task('p3','Filtra premi non validi','Scorri quattro ricompense; salta quelle negative usando <code>continue</code> e somma soltanto quelle valide.',
      ready('var premi = ['+n+', -3, '+(n+5)+', -1]\nvar totale = 0\n# Scorri e filtra\npass'),
      ready('var premi = ['+n+', -3, '+(n+5)+', -1]\nvar totale = 0\nfor premio in premi:\n    if premio < 0:\n        continue\n    totale += premio\nprint(totale)'),
      String(n+n+5),['\\bfor\\b','\\bcontinue\\b','\\bif\\b'],
      ['I numeri negativi non vanno sommati.','continue salta solo l’iterazione corrente.','Non usare il numero finale direttamente.']),
    task('p4','Contatore con while','Incrementa un contatore da zero fino a '+(n+2)+' compreso usando un <code>while</code>. Stampa soltanto il valore finale.',
      ready('var contatore = 0\n# Ripeti finché raggiungi l’obiettivo\npass'),
      ready('var contatore = 0\nwhile contatore < '+(n+2)+':\n    contatore += 1\nprint(contatore)'),
      String(n+2),['\\bwhile\\b','(?:\\bcontatore\\s*\\+=|\\bcontatore\\s*=\\s*contatore\\s*\\+\\s*1)'],
      ['while ripete finché la condizione è vera.','Incrementa il contatore a ogni passo.','Evita un ciclo senza termine.'])
  ],
  8:(n)=>[
    task('p2','Estrai una procedura','Definisci <code>avvisa()</code> che stampa <code>Segnale pronto</code> e chiamala da <code>_ready()</code>.',
      'extends Node\n\nfunc avvisa():\n    pass\n\nfunc _ready():\n    pass\n',
      'extends Node\n\nfunc avvisa():\n    print("Segnale pronto")\n\nfunc _ready():\n    avvisa()\n',
      'Segnale pronto',['\\bfunc\\s+avvisa\\s*\\(','\\bavvisa\\s*\\(\\s*\\)'],
      ['Definire la funzione non basta.','Aggiungi la stampa in avvisa e invocala da _ready.','La funzione può essere richiamata più volte.']),
    task('p3','Riutilizza un parametro','Completa <code>saluta(nome)</code> e richiamala con <code>Luna</code> e <code>Milo</code>. Non codificare i nomi nel testo della funzione.',
      'extends Node\n\nfunc saluta(nome):\n    pass\n\nfunc _ready():\n    saluta("Luna")\n    saluta("Milo")\n',
      'extends Node\n\nfunc saluta(nome):\n    print("Ciao " + nome)\n\nfunc _ready():\n    saluta("Luna")\n    saluta("Milo")\n',
      'Ciao Luna\nCiao Milo',['\\bfunc\\s+saluta\\s*\\(','\\bnome\\b','\\bsaluta\\s*\\('],
      ['Il parametro cambia a ogni chiamata.','Concatena il saluto con nome.','Una sola funzione deve gestire entrambi i nomi.']),
    task('p4','Restituisci un calcolo','Crea <code>triplica(numero)</code> che restituisce il triplo del parametro. Richiamala con '+(n+5)+' e stampa il risultato.',
      'extends Node\n\nfunc triplica(numero):\n    pass\n\nfunc _ready():\n    print(triplica('+(n+5)+'))\n',
      'extends Node\n\nfunc triplica(numero):\n    return numero * 3\n\nfunc _ready():\n    print(triplica('+(n+5)+'))\n',
      String((n+5)*3),['\\breturn\\b','(?:\\bnumero\\s*\\*\\s*3|\\b3\\s*\\*\\s*numero|\\bnumero\\s*\\+\\s*numero\\s*\\+\\s*numero)'],
      ['return consegna un valore al chiamante.','Usa il parametro nel calcolo.','Stampa il risultato della chiamata.'])
  ],
  9:(n)=>[
    task('p2','Spostamento su entrambi gli assi','Parti da <code>Vector2(10, 20)</code>, sposta X di +'+(n+4)+' e Y di -3; stampa le coordinate separatamente.',
      ready('var posizione = Vector2(10, 20)\n# Aggiorna entrambe le coordinate\npass'),
      ready('var posizione = Vector2(10, 20)\nposizione.x += '+(n+4)+'\nposizione.y -= 3\nprint(int(posizione.x))\nprint(int(posizione.y))'),
      String(14+n)+'\n17',['\\.x\\s*\\+=','\\.y\\s*-=' ],
      ['X cresce verso destra, Y diminuisce verso l’alto.','Aggiorna x e y separatamente.','Stampa i valori del Vector2 modificato.']),
    task('p3','Calcola una distanza reale','Una navetta si trova in <code>(0,0)</code> e la stazione in <code>('+ (n+3)+',4)</code>. Calcola <code>distance_to()</code> e stampa se la distanza è al massimo 5.',
      ready('var nave = Vector2(0, 0)\nvar stazione = Vector2('+(n+3)+', 4)\n# Verifica la distanza vera\npass'),
      ready('var nave = Vector2(0, 0)\nvar stazione = Vector2('+(n+3)+', 4)\nvar vicino = nave.distance_to(stazione) <= 5.0\nprint(vicino)'),
      (Math.hypot(n+3,4)<=5?'true':'false'),['\\.distance_to\\s*\\(','<=\\s*5'],
      ['Non basta confrontare una sola coordinata.','distance_to misura la distanza euclidea.','Il limite include esattamente 5.']),
    task('p4','Normalizza una direzione','Crea un vettore da <code>(3,4)</code>, normalizzalo e stampa se la sua lunghezza è circa 1.',
      ready('# Crea una direzione normalizzata\npass'),
      ready('var direzione = Vector2(3, 4).normalized()\nprint(is_equal_approx(direzione.length(), 1.0))'),
      'true',['\\.normalized\\s*\\(','\\.length\\s*\\('],
      ['La normalizzazione conserva la direzione.','Il vettore (3,4) ha lunghezza 5 prima di normalizzarlo.','Confronta numeri float con is_equal_approx.'])
  ],
  10:(n)=>[
    task('p2','Chiave facoltativa','Un nemico ha 20 HP ma potrebbe non avere scudo. Usa <code>get("scudo",0)</code> e stampa il valore sicuro.',
      ready('var nemico = {"hp": 20}\n# Leggi lo scudo anche se manca\npass'),
      ready('var nemico = {"hp": 20}\nvar scudo = nemico.get("scudo", 0)\nprint(scudo)'),
      '0',['\\.get\\s*\\(','\\bscudo\\b'],
      ['Una chiave assente non va indicizzata direttamente.','get consente un valore predefinito.','Se scudo manca, stampa zero.']),
    task('p3','Inventario dinamico di chiavi','Aggiungi la chiave <code>pozione</code> a un dizionario e conta le chiavi tramite <code>keys().size()</code>.',
      ready('var equip = {"arma": "Spada", "scudo": "Legno"}\n# Aggiungi una chiave e conta\npass'),
      ready('var equip = {"arma": "Spada", "scudo": "Legno"}\nequip["pozione"] = '+(n+1)+'\nprint(equip.keys().size())'),
      '3',['\\[\\s*["\\x27]pozione["\\x27]\\s*\\]\\s*=','\\.keys\\s*\\('],
      ['Un dizionario contiene coppie chiave-valore.','Crea una nuova chiave e usa keys().','Non stampare semplicemente 3.']),
    task('p4','Aggiorna un record','Un boss ha '+(80+n)+' HP iniziali. Sottrai 15 tramite una chiave del dizionario, controlla <code>has("hp")</code> e stampa il valore aggiornato.',
      ready('var boss = {"hp": '+(80+n)+', "nome": "Custode"}\n# Sottrai i danni e controlla la chiave\npass'),
      ready('var boss = {"hp": '+(80+n)+', "nome": "Custode"}\nboss["hp"] -= 15\nif boss.has("hp"):\n    print(boss["hp"])'),
      String(65+n),['\\.has\\s*\\(','\\[\\s*["\\x27]hp["\\x27]\\s*\\]\\s*-=' ],
      ['Aggiorna il valore della chiave, non un numero isolato.','Usa -= sull’indice hp.','Controlla la presenza della chiave.'])
  ],
  11:(n)=>[
    task('p2','Collega un allarme','Dichiara <code>signal allarme</code>, collegalo a <code>quando_allarme</code> ed emettilo una volta. La callback deve stampare <code>Allarme ricevuto</code>.',
      'extends Node\n\n# Dichiara il segnale\n\nfunc quando_allarme():\n    print("Allarme ricevuto")\n\nfunc _ready():\n    pass\n',
      'extends Node\n\nsignal allarme\n\nfunc quando_allarme():\n    print("Allarme ricevuto")\n\nfunc _ready():\n    allarme.connect(quando_allarme)\n    allarme.emit()\n',
      'Allarme ricevuto',['\\bsignal\\s+allarme\\b','\\.connect\\s*\\(','\\.emit\\s*\\('],
      ['La callback non si esegue finché l’evento non viene emesso.','Connetti prima di emit.','Usa il segnale reale di Godot.']),
    task('p3','Trasporta un parametro','Un segnale <code>cura_ricevuta(valore)</code> deve trasmettere '+(10+n)+' punti alla callback e stamparli.',
      'extends Node\n\nsignal cura_ricevuta(valore)\n\nfunc mostra_cura(valore):\n    pass\n\nfunc _ready():\n    pass\n',
      'extends Node\n\nsignal cura_ricevuta(valore)\n\nfunc mostra_cura(valore):\n    print("Cura: ", valore)\n\nfunc _ready():\n    cura_ricevuta.connect(mostra_cura)\n    cura_ricevuta.emit('+(10+n)+')\n',
      'Cura: '+(10+n),['\\bsignal\\s+cura_ricevuta','\\.connect\\s*\\(','\\.emit\\s*\\('],
      ['Il parametro del segnale arriva alla funzione collegata.','Connetti mostra_cura e usa emit(valore).','Non stampare un valore fisso nella callback.']),
    task('p4','Due notifiche indipendenti','Collega il segnale <code>evento(codice)</code> e invia due eventi, con codici '+n+' e '+(n+1)+', in ordine.',
      'extends Node\n\nsignal evento(codice)\n\nfunc ricevi(codice):\n    pass\n\nfunc _ready():\n    pass\n',
      'extends Node\n\nsignal evento(codice)\n\nfunc ricevi(codice):\n    print("Evento: ", codice)\n\nfunc _ready():\n    evento.connect(ricevi)\n    evento.emit('+n+')\n    evento.emit('+(n+1)+')\n',
      'Evento: '+n+'\nEvento: '+(n+1),['\\.connect\\s*\\(','(?:\\.emit\\s*\\([^\\n]*\\)[\\s\\S]*){2}'],
      ['La stessa connessione gestisce più eventi.','Emetti il segnale due volte dopo connect.','La callback usa il parametro ricevuto.'])
  ],
  12:(n)=>[
    task('p2','Costruttore di un oggetto','Crea una classe <code>Oggetto</code> con un costruttore che riceva il nome, poi crea una <code>new("Gemma")</code> e stampa il nome dell’istanza.',
      'extends Node\n\nclass Oggetto:\n    var nome\n    func _init(n):\n        pass\n\nfunc _ready():\n    pass\n',
      'extends Node\n\nclass Oggetto:\n    var nome\n    func _init(n):\n        self.nome = n\n\nfunc _ready():\n    var oggetto = Oggetto.new("Gemma")\n    print(oggetto.nome)\n',
      'Gemma',['\\bclass\\s+Oggetto\\b','\\bfunc\\s+_init\\b','\\.new\\s*\\('],
      ['Il costruttore salva i dati nell’oggetto.','Assegna n a self.nome.','Poi crea una nuova istanza.']),
    task('p3','Istanze indipendenti','Definisci una classe contatore e crea due oggetti: incrementa il primo '+n+' volte e stampa entrambi i valori.',
      'extends Node\n\nclass Contatore:\n    var valore = 0\n    func aggiungi():\n        pass\n\nfunc _ready():\n    pass\n',
      'extends Node\n\nclass Contatore:\n    var valore = 0\n    func aggiungi():\n        valore += 1\n\nfunc _ready():\n    var a = Contatore.new()\n    var b = Contatore.new()\n'+Array.from({length:n},()=> '    a.aggiungi()\n').join('')+'    print(a.valore)\n    print(b.valore)\n',
      n+'\n0',['\\bclass\\s+Contatore\\b','\\.new\\s*\\(','\\bvalore\\s*\\+='],
      ['Ogni istanza possiede un proprio valore.','Crea due oggetti con new().','Incrementa soltanto il primo.']),
    task('p4','Metodo che restituisce un valore','Una classe <code>Arma</code> deve esporre <code>danno()</code> calcolato dai campi <code>base</code> e <code>bonus</code>, non da un numero fisso.',
      'extends Node\n\nclass Arma:\n    var base = '+(n+7)+'\n    var bonus = 3\n    func danno():\n        pass\n\nfunc _ready():\n    var a = Arma.new()\n    print(a.danno())\n',
      'extends Node\n\nclass Arma:\n    var base = '+(n+7)+'\n    var bonus = 3\n    func danno():\n        return base + bonus\n\nfunc _ready():\n    var a = Arma.new()\n    print(a.danno())\n',
      String(n+10),['\\bfunc\\s+danno\\s*\\(','\\breturn\\b','\\bbase\\s*\\+\\s*bonus\\b'],
      ['I metodi leggono i campi dell’istanza.','Somma base e bonus con return.','Non modificare i campi originali.'])
  ],
  13:(n)=>[
    task('p2','Crea un figlio nella scena','Crea un <code>Node</code> chiamato <code>Compagno</code>, aggiungilo come figlio e stampa <code>has_node("Compagno")</code>.',
      'extends Node\n\nfunc _ready():\n    # Crea, nomina e aggiungi il nodo\n    pass\n',
      'extends Node\n\nfunc _ready():\n    var compagno = Node.new()\n    compagno.name = "Compagno"\n    add_child(compagno)\n    print(has_node("Compagno"))\n',
      'true',['\\bNode\\.new\\s*\\(','\\badd_child\\s*\\(','\\bhas_node\\s*\\('],
      ['Un nodo creato non appartiene ancora all’albero.','Assegnagli name e chiama add_child.','has_node controlla l’albero reale.']),
    task('p3','Crea una Label da codice','Crea una <code>Label</code> chiamata <code>Stato</code>, imposta il testo a <code>Pronto</code> e stampalo leggendo la proprietà del nodo.',
      'extends Node\n\nfunc _ready():\n    # Crea la Label e aggiorna il testo\n    pass\n',
      'extends Node\n\nfunc _ready():\n    var label = Label.new()\n    label.name = "Stato"\n    add_child(label)\n    label.text = "Pronto"\n    print(get_node("Stato").text)\n',
      'Pronto',['\\bLabel\\.new\\s*\\(','\\.text\\s*=','\\bget_node\\s*\\('],
      ['Label è un nodo dell’interfaccia.','Imposta name e text dopo la creazione.','Leggi il testo dal nodo, non da una stringa fissa.']),
    task('p4','Gerarchia genitore-figlio','Crea un nodo <code>Squadra</code> con figlio <code>Scout</code>. Aggiungi la gerarchia alla scena e controlla il percorso <code>Squadra/Scout</code>.',
      'extends Node\n\nfunc _ready():\n    # Costruisci la gerarchia\n    pass\n',
      'extends Node\n\nfunc _ready():\n    var squadra = Node.new()\n    squadra.name = "Squadra"\n    add_child(squadra)\n    var scout = Node.new()\n    scout.name = "Scout"\n    squadra.add_child(scout)\n    print(has_node("Squadra/Scout"))\n',
      'true',['\\bNode\\.new\\s*\\(','\\.add_child\\s*\\(','\\bhas_node\\s*\\('],
      ['Un percorso può contenere più livelli.','Aggiungi prima il genitore, poi il suo figlio.','Usa has_node con il percorso completo.'])
  ],
  14:(n)=>[
    task('p2','Gestisci un pulsante','Crea un <code>Button</code>, collega <code>pressed</code> a una callback e simula una pressione.',
      'extends Node\n\nfunc premuto():\n    print("Pulsante attivato")\n\nfunc _ready():\n    # Crea il pulsante, collega ed emetti\n    pass\n',
      'extends Node\n\nfunc premuto():\n    print("Pulsante attivato")\n\nfunc _ready():\n    var bottone = Button.new()\n    add_child(bottone)\n    bottone.pressed.connect(premuto)\n    bottone.pressed.emit()\n',
      'Pulsante attivato',['\\bButton\\.new\\s*\\(','\\.pressed\\.connect\\s*\\(','\\.pressed\\.emit\\s*\\('],
      ['Il click emette pressed.','Collega la callback prima dell’evento.','Usa il pulsante vero, non una chiamata diretta alla callback.']),
    task('p3','Contatore di click','Crea un pulsante e invia '+(n+2)+' click; la callback incrementa <code>punti</code> di uno per ogni pressione. Stampa il totale.',
      'extends Node\nvar punti = 0\n\nfunc al_click():\n    pass\n\nfunc _ready():\n    # Crea il bottone, collega ed emetti '+(n+2)+' click\n    pass\n',
      'extends Node\nvar punti = 0\n\nfunc al_click():\n    punti += 1\n\nfunc _ready():\n    var bottone = Button.new()\n    add_child(bottone)\n    bottone.pressed.connect(al_click)\n'+Array.from({length:n+2},()=> '    bottone.pressed.emit()\n').join('')+'    print(punti)\n',
      String(n+2),['\\bButton\\.new\\s*\\(','\\bpoints\\b|\\bpunti\\s*\\+=','\\.pressed\\.emit\\s*\\('],
      ['La callback viene chiamata a ogni segnale.','Incrementa punti dentro al_click.','Una sola connessione per tutte le pressioni.']),
    task('p4','Due pulsanti diversi','Crea un pulsante di avvio e uno di arresto, con callback separate. Emetti gli eventi nell’ordine <code>Start</code>, <code>Stop</code>.',
      'extends Node\n\nfunc on_start():\n    pass\n\nfunc on_stop():\n    pass\n\nfunc _ready():\n    # Crea e collega due Button\n    pass\n',
      'extends Node\n\nfunc on_start():\n    print("Start")\n\nfunc on_stop():\n    print("Stop")\n\nfunc _ready():\n    var a = Button.new()\n    var b = Button.new()\n    add_child(a)\n    add_child(b)\n    a.pressed.connect(on_start)\n    b.pressed.connect(on_stop)\n    a.pressed.emit()\n    b.pressed.emit()\n',
      'Start\nStop',['\\bButton\\.new\\s*\\(','\\.pressed\\.connect\\s*\\(','\\.pressed\\.emit\\s*\\('],
      ['Ogni pulsante deve avere una callback propria.','Connetti i due segnali prima di emetterli.','L’ordine dei messaggi segue l’ordine degli eventi.'])
  ],
  15:(n)=>[
    task('p2','Configura un Timer','Crea un Timer in modalità <code>one_shot</code> con attesa '+(n+1)+'.0 secondi, aggiungilo alla scena e avvialo. Stampa il tempo configurato come intero.',
      'extends Node\n\nfunc _ready():\n    # Crea e configura il timer\n    pass\n',
      'extends Node\n\nfunc _ready():\n    var timer = Timer.new()\n    add_child(timer)\n    timer.wait_time = '+(n+1)+'.0\n    timer.one_shot = true\n    timer.start()\n    print(int(timer.wait_time))\n',
      String(n+1),['\\bTimer\\.new\\s*\\(','\\.wait_time\\s*=','\\.one_shot\\s*=\\s*true','\\.start\\s*\\('],
      ['Il Timer deve essere figlio di un nodo attivo.','Imposta wait_time e one_shot prima di start.','Stampa la proprietà del timer.']),
    task('p3','Aggiorna una barra ColorRect','Crea un <code>ColorRect</code> e imposta la larghezza a '+(80+n*10)+' pixel. Stampa la larghezza realmente assegnata.',
      'extends Node\n\nfunc _ready():\n    # Crea la barra e aggiorna size\n    pass\n',
      'extends Node\n\nfunc _ready():\n    var barra = ColorRect.new()\n    add_child(barra)\n    barra.size = Vector2('+(80+n*10)+', 12)\n    print(int(barra.size.x))\n',
      String(80+n*10),['\\bColorRect\\.new\\s*\\(','\\.size\\s*=','\\bVector2\\s*\\('],
      ['ColorRect è un nodo Control.','La dimensione si imposta con Vector2.','Leggi barra.size.x dopo l’assegnazione.']),
    task('p4','Elimina un nodo in sicurezza','Crea un nodo <code>Moneta</code>, aggiungilo alla scena e chiamane <code>queue_free()</code>. Verifica se è in attesa di eliminazione.',
      'extends Node\n\nfunc _ready():\n    # Crea il nodo, aggiungilo ed eliminalo\n    pass\n',
      'extends Node\n\nfunc _ready():\n    var moneta = Node.new()\n    moneta.name = "Moneta"\n    add_child(moneta)\n    moneta.queue_free()\n    print(moneta.is_queued_for_deletion())\n',
      'true',['\\bNode\\.new\\s*\\(','\\.queue_free\\s*\\(','\\.is_queued_for_deletion\\s*\\('],
      ['queue_free non distrugge immediatamente il nodo.','Il nodo viene marcato per l’eliminazione.','Controlla is_queued_for_deletion.'])
  ]
};
const cache=new Map();
function tasksFor(lesson){
  if(!lesson || !Number.isInteger(lesson.id) || !banks[lesson.chapterId])return [];
  if(cache.has(lesson.id))return cache.get(lesson.id);
  // Seme stabile per ogni argomento: le attività non cambiano al refresh.
  const seed=(lesson.id%5)+1;
  const tasks=banks[lesson.chapterId](seed);
  if(tasks.length!==3||new Set(tasks.map(x=>x.key)).size!==3)
    throw Error('Catalogo multi-compito incompleto: '+lesson.id);
  cache.set(lesson.id,tasks);
  return tasks;
}
root.GDHPracticeCatalog=Object.freeze({tasksFor,chapters:Object.freeze(Object.keys(banks).map(Number))});
})(typeof window!=='undefined'?window:globalThis);
