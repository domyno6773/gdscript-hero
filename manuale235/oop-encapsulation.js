/* Lezioni 181–184: setter, getter, proprietà private, progetto bancario.
 * Driver main.gd protetto e test con input alternativi in Godot reale.
 */
(() => {
'use strict';
const items=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
if(items.length!==235||!verify)throw Error('Manuale 235 incompleto');
const get=n=>{const l=items.find(x=>x.manualLessonNumber===n);if(!l)throw Error('Manca '+n);return l;};
const patch=(n,files)=>{
 const l=get(n);l.sourceFiles=files;
 const first=Object.keys(files).find(x=>x!=='main.gd');
 l.initialCode=files[first];l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
};
const ready=lines=>['extends Node','','func _ready():',...lines.map(line=>'    '+line)].join('\n');
const cleaned=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
const proof=(...rules)=>s=>rules.every(p=>p.test(cleaned(s)));
const define=(n,cases,check)=>{
 const l=get(n);verify.expectedCases[n]=cases;l.manualSourceCheck=check;
 l.expectedOutput=cases[0].output;l.validationReady=true;
};
const setter=get(181);
setter.task=setter.task.replace(/\bdamage\b/g,'danno').replace(/\bheal\b/g,'cura')
 .replace(/\bset N\b/g,'imposta N').replace(/\bHealth:/g,'Salute:');
patch(181,{
 'player.gd':[
 'class_name Player','extends RefCounted','',
 'var max_health: int = 100',
 'var health: int = 100:',
 '    set(value):',
 '        # Impedisci valori fuori da 0..max_health.',
 '        # Stampa una volta sola quando la salute passa a zero.',
 '        health = value'
 ].join('\n'),
 'main.gd':ready([
 'var player = Player.new()',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    var amount = int(parts[1])',
 '    if parts[0] == "danno":',
 '        player.health -= amount',
 '    elif parts[0] == "cura":',
 '        player.health += amount',
 '    elif parts[0] == "imposta":',
 '        player.health = amount',
 '    print("Salute: %d" % player.health)'
 ])
});
const healthCases=[
 ['danno 30','cura 50','danno 120','cura 10'],
 ['danno 100','danno 1','cura 1','danno 2'],
 ['imposta 200','imposta -1','imposta -10','cura 100'],
 [],
 ['danno 10','cura 300','imposta 0','imposta 50']
];
define(181,healthCases.map((steps,i)=>{
 let hp=100,out=[];
 for(const step of steps){
 const [cmd,amountRaw]=step.split(' '),num=Number(amountRaw),previous=hp;
 if(cmd==='danno')hp-=num;
 else if(cmd==='cura')hp+=num;
 else hp=num;
 hp=Math.min(100,Math.max(0,hp));
 if(previous>0&&hp===0)out.push('Il giocatore è stato sconfitto!');
 out.push('Salute: '+hp);
 }
 return{name:'Salute e setter '+i,stdin:[String(steps.length),...steps],output:out.join('\n')};
}),proof(/\bclass_name\s+Player\b/,/\bvar\s+health\s*:\s*int\s*=\s*100\s*:/,
 /\bset\s*\(\s*value\s*\)\s*:/,/\bmax_health\b/,
 /\bhealth\b/,/\bprint\s*\(/));
patch(182,{
 'temperature.gd':[
 'class_name Temperature','extends RefCounted','',
 'var celsius: float = 0.0',
 'var fahrenheit: float:',
 '    get:',
 '        # Converti da Celsius a Fahrenheit.',
 '        return 0.0',
 '    set(value):',
 '        # Converti il valore Fahrenheit e salvalo in celsius.',
 '        pass',
 'var kelvin: float:',
 '    get:',
 '        # Converti da Celsius a Kelvin.',
 '        return 0.0'
 ].join('\n'),
 'main.gd':ready([
 'var temp = Temperature.new()',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    if parts[0] == "c":',
 '        temp.celsius = float(parts[1])',
 '    else:',
 '        temp.fahrenheit = float(parts[1])',
 '    print("%.2f C | %.2f F | %.2f K" % [temp.celsius, temp.fahrenheit, temp.kelvin])'
 ])
});
const tempInputs=[
 ['c 25','f 98.6','c -40'],[],
 ['c 0','f 32','f 212'],
 ['f -40','c 100'],
 ['c 20','f 68']
];
const temperatureOutput=steps=>{
 let c=0,rows=[];
 for(const step of steps){
 const [scale,v]=step.split(' '),n=Number(v);
 c=scale==='c'?n:(n-32)*5/9;
 rows.push(c.toFixed(2)+' C | '+(c*9/5+32).toFixed(2)+' F | '+(c+273.15).toFixed(2)+' K');
 }
 return rows.join('\n');
};
define(182,tempInputs.map((a,i)=>({
 name:'Scale termiche '+i,stdin:[String(a.length),...a],
 output:temperatureOutput(a)
})),proof(/\bclass_name\s+Temperature\b/,/\bvar\s+fahrenheit\s*:\s*float\s*:/,
 /\bvar\s+kelvin\s*:\s*float\s*:/,
 /get\s*:/,/set\s*\(\s*value\s*\)\s*:/,
 /\bcelsius\b/,/\b273\.15\b/,/\b32\b/));
const l183=get(183);
l183.task=l183.task.replace(/\bcheck PASSWORD\b/g,'verifica PASSWORD')
 .replace(/\bchange OLD NEW\b/g,'cambia OLD NEW')
 .replace(/change godot4 abc, change wrong longenough e check godot4/g,
 'cambia godot4 abc, cambia wrong longenough e verifica godot4');
patch(183,{
 'user.gd':[
 'class_name User','extends RefCounted','',
 '# Dichiara qui la proprietà privata _password.',
 'func _init(start_password: String) -> void:',
 '    # Memorizza la password iniziale.',
 '    pass',
 'func check_password(attempt: String) -> bool:',
 '    return false',
 'func change_password(old_password: String, new_password: String) -> bool:',
 '    return false',
 'func _is_strong(candidate: String) -> bool:',
 '    return false'
 ].join('\n'),
 'main.gd':ready([
 'var user = User.new(OS.read_string_from_stdin())',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    if parts[0] == "verifica":',
 '        print("Accesso consentito" if user.check_password(parts[1]) else "Accesso negato")',
 '    elif user.change_password(parts[1], parts[2]):',
 '        print("Password modificata")',
 '    else:',
 '        print("Password non modificata")'
 ])
});
const pwCases=[
 ['godot4',['cambia godot4 abc','cambia wrong longenough','verifica godot4']],
 ['aaa',['verifica aaa','cambia aaa secret123','verifica secret123','verifica aaa']],
 ['abcdef',['cambia abcdef 123456','verifica 123456']],
 ['hello123',[]],
 ['original',['cambia bad goodpassword','cambia original nuovo123','verifica nuovo123']]
];
define(183,pwCases.map(([initial,commands],i)=>{
 let password=initial,out=[];
 for(const cmd of commands){
 const [verb,a,b]=cmd.split(' ');
 if(verb==='verifica')out.push(a===password?'Accesso consentito':'Accesso negato');
 else if(a===password&&b.length>=6){password=b;out.push('Password modificata');}
 else out.push('Password non modificata');
 }
 return{name:'Verifica password '+i,stdin:[initial,String(commands.length),...commands],output:out.join('\n')};
}),proof(/\bclass_name\s+User\b/,
 /\bvar\s+_password\s*:\s*String\b/,
 /\bfunc\s+_init\s*\(/,/\bfunc\s+check_password\s*\(/,
 /\bfunc\s+change_password\s*\(/,/\bfunc\s+_is_strong\s*\(/,
 /\.length\s*\(\s*\)/));
const bank=get(184);
bank.task=bank.task.replace(/\bwithdraw 200\b/g,'preleva 200')
 .replace(/Depositati \$500/g,'Depositati 500 $')
 .replace(/Prelevati \$200/g,'Prelevati 200 $')
 .replace(/Interessi maturati: \$26/g,'Interessi maturati: 26 $')
 .replace(/Saldo: \$1326/g,'Saldo: 1326 $')
 .replace(/Ada possiede 5000(\s|$)/g,'Ada possiede 5000 $1');
patch(184,{
 'bank_account.gd':[
 'class_name BankAccount','extends RefCounted','',
 '# Definisci static var interest_percent: int = 2.',
 '# Dichiara _owner_name, _balance e le proprietà owner_name e balance.',
 'func _init(account_owner: String, start_balance: int) -> void:',
 '    pass',
 'func deposit(amount: int) -> bool:',
 '    return false',
 'func withdraw(amount: int) -> bool:',
 '    return false',
 'func apply_interest() -> int:',
 '    return 0',
 'func display_info() -> void:',
 '    pass'
 ].join('\n'),
 'main.gd':ready([
 'var first = OS.read_string_from_stdin().split(" ")',
 'var account = BankAccount.new(first[0], int(first[1]))',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    match parts[0]:',
 '        "deposita":',
 '            if account.deposit(int(parts[1])):',
 '                print("Depositati %s $" % parts[1])',
 '        "preleva":',
 '            if account.withdraw(int(parts[1])):',
 '                print("Prelevati %s $" % parts[1])',
 '        "imposta":',
 '            account.balance = int(parts[1])',
 '        "interessi":',
 '            print("Interessi maturati: %d $" % account.apply_interest())',
 '        "tasso":',
 '            BankAccount.interest_percent = int(parts[1])',
 '        "informazioni":',
 '            account.display_info()',
 'print("%s possiede %d $" % [account.owner_name, account.balance])'
 ])
});
const bankCases=[
 ['Ada',1000,['deposita 500','preleva 200','interessi','informazioni','imposta 5000','preleva 10000']],
 ['Leo',10,['deposita 0','preleva -1','imposta -50','informazioni']],
 ['Mia',100,['tasso 5','interessi','preleva 20','informazioni']],
 ['Ari',0,[]],
 ['Teo',200,['deposita 25','preleva 50','tasso 10','interessi']]
];
const simulateBank=(owner,start,commands)=>{
 let balance=Math.max(0,start),rate=2,out=[];
 const info=()=>['Titolare del conto: '+owner,'Saldo: $'+balance,'Tasso di interesse: '+rate+'%'];
 for(const cmd of commands){
 const [verb,s]=cmd.split(' '),amount=Number(s);
 if(verb==='deposita'){
 if(amount<=0)out.push("L'importo del deposito deve essere positivo");
 else{balance+=amount;out.push('Depositati '+s+' $');}
 }
 if(verb==='preleva'){
 if(amount<=0)out.push("L'importo del prelievo deve essere positivo");
 else if(amount>balance)out.push('Fondi insufficienti');
 else{balance-=amount;out.push('Prelevati '+s+' $');}
 }
 if(verb==='imposta'){
 if(amount<0)out.push('Il saldo non può essere negativo');
 else balance=amount;
 }
 if(verb==='interessi'){
 const interest=Math.trunc(balance*rate/100);balance+=interest;
 out.push('Interessi maturati: '+interest+' $');
 }
 if(verb==='tasso')rate=amount;
 if(verb==='informazioni')out.push(...info());
 }
 out.push(owner+' possiede '+balance+' $');
 return out.join('\n');
};
define(184,bankCases.map(([owner,start,commands],i)=>({
 name:'Conti incapsulati '+i,
 stdin:[owner+' '+start,String(commands.length),...commands],
 output:simulateBank(owner,start,commands)
})),proof(/\bclass_name\s+BankAccount\b/,
 /\bstatic\s+var\s+interest_percent\s*:\s*int\s*=\s*2\b/,
 /\bvar\s+_owner_name\s*:\s*String\b/,
 /\bvar\s+_balance\s*:\s*int\b/,
 /\bvar\s+owner_name\s*:\s*String\s*:/,
 /\bvar\s+balance\s*:\s*int\s*:/,
 /\bfunc\s+deposit\s*\(/,/\bfunc\s+withdraw\s*\(/,
 /\bfunc\s+apply_interest\s*\(/,/\bfunc\s+display_info\s*\(/));
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 181:['4','danno 30','cura 50','danno 120','cura 10'],
 182:['3','c 25','f 98.6','c -40'],
 183:['godot4','3','cambia godot4 abc','cambia wrong longenough','verifica godot4'],
 184:['Ada 1000','6','deposita 500','preleva 200','interessi','informazioni','imposta 5000','preleva 10000']});
window.GDHManualMigration.validated=items.filter(x=>x.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();