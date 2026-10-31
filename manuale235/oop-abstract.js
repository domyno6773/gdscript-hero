/* Lezioni 193–194: classi astratte ed interfacce Godot 4.5+.
 * Si usano @abstract e metodi astratti reali, non sostituti di 4.4.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],verifier=window.GDHManualVerifier;
 if(lessons.length!==235||!verifier)throw Error('Manuale assente');
 const get=n=>{const l=lessons.find(x=>x.manualLessonNumber===n);if(!l)throw Error('Manca '+n);return l;};
 const patch=(n,files)=>{
   const l=get(n);l.sourceFiles=files;l.readOnlyFiles=['main.gd'];
   const editable=Object.keys(files).find(x=>x!=='main.gd');
   l.initialCode=files[editable];l.starterCode=l.initialCode;
   l.requiresMultipleFiles=true;
 };
 const ready=arr=>['extends Node','','func _ready():',...arr.map(s=>'    '+s)].join('\n');
 const live=s=>String(s).split('\n').filter(l=>!/^\s*#/.test(l)).join('\n');
 const proof=(...patterns)=>s=>patterns.every(re=>re.test(live(s)));
 const define=(n,cases,p)=>{if(cases.length<5)throw Error('Casi insufficienti '+n);
   const l=get(n);verifier.expectedCases[n]=cases;l.manualSourceCheck=p;
   l.expectedOutput=cases[0].output;l.validationReady=true;};
 patch(193,{
   'payment_method.gd':[
     '# Rendi PaymentMethod una classe astratta.',
     'class_name PaymentMethod','extends RefCounted','',
     'var amount: float','',
     'func _init(a: float) -> void:',
     '    amount = a','',
     '# Dichiara qui i metodi astratti fee() e method_name().',
     'func receipt() -> String:',
     '    # Usa fee(), method_name() e amount per la ricevuta.',
     '    return ""'
   ].join('\n'),
   'credit_card.gd':[
     'class_name CreditCard','extends PaymentMethod','',
     '# Scrivi fee() -> float e method_name() -> String.'
   ].join('\n'),
   'bank_transfer.gd':[
     'class_name BankTransfer','extends PaymentMethod','',
     '# Scrivi fee() -> float e method_name() -> String.'
   ].join('\n'),
   'main.gd':ready([
     'var count = int(OS.read_string_from_stdin())',
     'var total_fees = 0.0',
     'for i in count:',
     '    var p = OS.read_string_from_stdin().split(" ")',
     '    var payment: PaymentMethod',
     '    if p[0] == "card":',
     '        payment = CreditCard.new(float(p[1]))',
     '    else:',
     '        payment = BankTransfer.new(float(p[1]))',
     '    print(payment.receipt())',
     '    total_fees += payment.fee()',
     'print("Commissioni totali: %.2f" % total_fees)'
   ])
 });
 const payments=[
   ['card 50','transfer 120'],
   ['transfer 99','transfer 100','card 0'],
   [],
   ['card 100','card 200','transfer 10'],
   ['transfer 0'],
   ['card 10','transfer 99.9','card 2.5']
 ];
 const charges=rows=>{
   let total=0,output=[];
   for(const row of rows){
     const [kind,amountRaw]=row.split(' '),amount=Number(amountRaw);
     const fee=kind==='card'?amount*0.03:(amount>=100?0:1.5);
     total+=fee;
     output.push((kind==='card'?'Carta di credito':'Bonifico')+
       ': pagati '+amount.toFixed(2)+', commissioni '+fee.toFixed(2)+
       ', totale '+(amount+fee).toFixed(2));
   }
   output.push('Commissioni totali: '+total.toFixed(2));
   return output.join('\n');
 };
 define(193,payments.map((rows,i)=>({
   name:'Pagamenti astratti '+i,stdin:[String(rows.length),...rows],
   output:charges(rows)
 })),s=>proof(
   /@abstract\s+class_name\s+PaymentMethod\b|@abstract\s*\n\s*class_name\s+PaymentMethod\b/,
   /@abstract\s+func\s+fee\s*\(\s*\)\s*->\s*float/,
   /@abstract\s+func\s+method_name\s*\(\s*\)\s*->\s*String/,
   /\bclass_name\s+CreditCard\b/,
   /\bclass_name\s+BankTransfer\b/,
   /\bextends\s+PaymentMethod\b/,
   /\bfunc\s+receipt\s*\(\s*\)/,
   /\bfunc\s+fee\s*\(\s*\)/,
   /\bfunc\s+method_name\s*\(\s*\)/)(s));
 patch(194,{
   'playable.gd':[
     '# Rendi Playable una classe astratta come interfaccia.',
     'class_name Playable','extends RefCounted','',
     '# Dichiara play() -> String e duration() -> int astratti.'
   ].join('\n'),
   'song.gd':[
     'class_name Song','extends Playable','',
     'var title: String','var artist: String','var seconds: int','',
     'func _init(t: String, a: String, s: int) -> void:',
     '    title = t','    artist = a','    seconds = s','',
     '# Scrivi play() e duration().'
   ].join('\n'),
   'video.gd':[
     'class_name Video','extends Playable','',
     'var title: String','var resolution: int','var seconds: int','',
     'func _init(t: String, r: int, s: int) -> void:',
     '    title = t','    resolution = r','    seconds = s','',
     '# Scrivi play() e duration().'
   ].join('\n'),
   'playlist.gd':[
     'class_name Playlist','extends RefCounted','',
     'var items: Array[Playable] = []','',
     'func add(item: Playable) -> void:',
     '    items.append(item)','',
     'func play_all() -> void:',
     '    # Riproduci ciascun elemento usando solo il contratto Playable.',
     '    pass','',
     'func total_time() -> String:',
     '    # Somma le durate e formatta M:SS.',
     '    return ""'
   ].join('\n'),
   'main.gd':ready([
     'var count = int(OS.read_string_from_stdin())',
     'var playlist = Playlist.new()',
     'for i in count:',
     '    var p = OS.read_string_from_stdin().split(" ")',
     '    if p[0] == "brano":',
     '        playlist.add(Song.new(p[1], p[2], int(p[3])))',
     '    else:',
     '        playlist.add(Video.new(p[1], int(p[2]), int(p[3])))',
     'playlist.play_all()',
     'print("Tempo totale: " + playlist.total_time())'
   ])
 });
 const media=[
   ['brano Imagine Lennon 183','video Trailer 1080 95'],
   [],
   ['brano Ciao Amico 59','video Clip 720 1'],
   ['video Test 480 0'],
   ['brano First Band 180','brano Second Singer 60','video Intro 360 125'],
   ['video Film 1080 3600']
 ];
 const playResult=rows=>{
   let seconds=0,output=[];
   for(const row of rows){
     const [kind,title,meta,durRaw]=row.split(' ');
     const duration=Number(durRaw);seconds+=duration;
     if(kind==='brano')output.push('Riproduzione brano: '+title+' di '+meta);
     else output.push('Riproduzione video: '+title+' in '+meta+'p');
   }
   output.push('Tempo totale: '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'));
   return output.join('\n');
 };
 define(194,media.map((rows,i)=>({
   name:'Playlist interfacce '+i,stdin:[String(rows.length),...rows],
   output:playResult(rows)
 })),s=>proof(
   /@abstract\s+class_name\s+Playable\b|@abstract\s*\n\s*class_name\s+Playable\b/,
   /@abstract\s+func\s+play\s*\(\s*\)\s*->\s*String/,
   /@abstract\s+func\s+duration\s*\(\s*\)\s*->\s*int/,
   /\bclass_name\s+Song\b/,/\bclass_name\s+Video\b/,
   /\bextends\s+Playable\b/,/\bclass_name\s+Playlist\b/,
   /\bfunc\s+play_all\s*\(\s*\)/,
   /\bfunc\s+total_time\s*\(\s*\)/,
   /%02d|\.pad_zeros\s*\(/)(s));
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   193:['2','card 50','transfer 120'],
   194:['2','brano Imagine Lennon 183','video Trailer 1080 95']});
 window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();
