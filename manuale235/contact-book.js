/* Lezioni 116–122: costruzione progressiva di una Rubrica.
 * Ogni lezione conserva l'interfaccia creata nei passaggi precedenti, ma
 * il codice richiesto dalla fase corrente resta da scrivere allo studente.
 */
(() => {
'use strict';
const data=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
if(data.length!==235||!verify)throw Error('Il catalogo del manuale non è pronto');
const get=n=>{const l=data.find(x=>x.manualLessonNumber===n);if(!l)throw Error('Lezione '+n+' assente');return l;};
const menu=[
  'Menu della rubrica:',
  '1. Aggiungi contatto',
  '2. Visualizza contatto',
  '3. Modifica contatto',
  '4. Elimina contatto',
  '5. Elenca tutti i contatti',
  '6. Esci'
];
const menuSource=[
  'func display_menu() -> void:',
  ...menu.map(line=>'    print('+JSON.stringify(line)+')')
].join('\n');
const addSource=[
  'func add_contact(contact_book: Dictionary) -> void:',
  '    var name = OS.read_string_from_stdin()',
  '    if contact_book.has(name):',
  '        print("Il contatto esiste già!")',
  '        return',
  '    var phone = OS.read_string_from_stdin()',
  '    var email = OS.read_string_from_stdin()',
  '    var address = OS.read_string_from_stdin()',
  '    contact_book[name] = {"phone": phone, "email": email, "address": address}',
  '    print("Contatto aggiunto correttamente!")'
].join('\n');
const viewSource=[
  'func view_contact(contact_book: Dictionary) -> void:',
  '    var name = OS.read_string_from_stdin()',
  '    if not contact_book.has(name):',
  '        print("Contatto non trovato!")',
  '        return',
  '    var contact = contact_book[name]',
  '    print("Nome: ", name)',
  '    print("Telefono: ", contact["phone"])',
  '    print("Email: ", contact["email"])',
  '    print("Indirizzo: ", contact["address"])'
].join('\n');
const editSource=[
  'func edit_contact(contact_book: Dictionary) -> void:',
  '    var name = OS.read_string_from_stdin()',
  '    if not contact_book.has(name):',
  '        print("Contatto non trovato!")',
  '        return',
  '    var phone = OS.read_string_from_stdin()',
  '    var email = OS.read_string_from_stdin()',
  '    var address = OS.read_string_from_stdin()',
  '    if phone != "":',
  '        contact_book[name]["phone"] = phone',
  '    if email != "":',
  '        contact_book[name]["email"] = email',
  '    if address != "":',
  '        contact_book[name]["address"] = address',
  '    print("Contatto aggiornato correttamente!")'
].join('\n');
const deleteSource=[
  'func delete_contact(contact_book: Dictionary) -> void:',
  '    var name = OS.read_string_from_stdin()',
  '    if not contact_book.has(name):',
  '        print("Contatto non trovato!")',
  '        return',
  '    contact_book.erase(name)',
  '    print("Contatto eliminato correttamente!")'
].join('\n');
const listSource=[
  'func list_all_contacts(contact_book: Dictionary) -> void:',
  '    if contact_book.is_empty():',
  '        print("Nessun contatto disponibile.")',
  '        return',
  '    for name in contact_book:',
  '        var contact = contact_book[name]',
  '        print("Nome: ", name)',
  '        print("Telefono: ", contact["phone"])',
  '        print("Email: ", contact["email"])',
  '        print("Indirizzo: ", contact["address"])',
  '        print("")'
].join('\n');
const funcs=[menuSource,addSource,viewSource,editSource,deleteSource,listSource];
const choices=['1','2','3','4','5','6'];
const call={
  '1':'add_contact(contact_book)',
  '2':'view_contact(contact_book)',
  '3':'edit_contact(contact_book)',
  '4':'delete_contact(contact_book)',
  '5':'list_all_contacts(contact_book)'
};
const createReady=(n)=>{
  if(n===116)return 'func _ready():\n    display_menu()';
  if(n===117)return 'func _ready():\n    display_menu()\n    # Crea contact_book e il ciclo delle scelte.';
  const lines=[
    'func _ready():','    var contact_book = {}','    while true:',
    '        display_menu()',
    '        var choice = OS.read_string_from_stdin()'
  ];
  if(n===122){
    lines.push('        # Sostituisci la catena con match choice:, incluse le scelte errate.');
  }
  for(let x=1;x<=6;x++){
    const allowed=x<=6&&(x===6||x<=Math.max(1,n-117));
    if(!allowed)continue;
    const head=lines.some(line=>/^        (?:if|elif) choice/.test(line))?'elif':'if';
    lines.push('        '+head+' choice == "'+x+'":');
    if(x===6)lines.push('            break');
    else lines.push('            '+call[String(x)]);
  }
  if(n===122)lines.push('        # Aggiungi il pattern jolly per le scelte non valide.');
  else lines.push('        # Completa il ramo richiesto da questa lezione.');
  return lines.join('\n');
};
const starter=(n)=>{
  if(n===116)return [
    'extends Node','','func _ready():',
    '    display_menu()','','func display_menu():',
    '    # Stampa le sette righe del menu.',
    '    pass'
  ].join('\n');
  if(n===117)return [
    'extends Node','',createReady(n),'',menuSource,
    '', '# Scrivi add_contact(contact_book: Dictionary) qui.'
  ].join('\n');
  const functions=funcs.slice(0,Math.max(2,n-116));
  return ['extends Node','',createReady(n),'',...functions.flatMap((fn,i)=>i?[ '',fn ]:[fn]),
    '', '# Scrivi la funzione aggiuntiva richiesta da questa lezione.'].join('\n');
};
// Lezione 122 mantiene tutte le funzioni già acquisite e la catena if/elif.
for(let n=116;n<=122;n++){
  const l=get(n),src=starter(n);
  l.initialCode=src;l.starterCode=src;
  l.sourceFiles={...l.sourceFiles,'main.gd':src};
}
get(119).task=get(119).task.replace(/Contact\s+aggiornato correttamente!/g,
  'Contatto aggiornato correttamente!');
const clean=s=>String(s).split('\n').filter(row=>!/^\s*#/.test(row)).join('\n');
const all=(...checks)=>src=>checks.every(re=>re.test(clean(src)));
const patterns={
  116:[/\bfunc\s+display_menu\s*\(\s*\)/,/\bprint\s*\(/],
  117:[/\bfunc\s+add_contact\s*\(\s*contact_book\s*:\s*Dictionary\s*\)/,
    /\bwhile\s+true\s*:/,/\bcontact_book\b/,/\badd_contact\s*\(/],
  118:[/\bfunc\s+view_contact\s*\(\s*contact_book\s*:\s*Dictionary\s*\)/,
    /\belif\s+choice\s*==\s*["']2["']/,/\bview_contact\s*\(/],
  119:[/\bfunc\s+edit_contact\s*\(\s*contact_book\s*:\s*Dictionary\s*\)/,
    /\belif\s+choice\s*==\s*["']3["']/,
    /\bphone\b/,/\bemail\b/,/\baddress\b/],
  120:[/\bfunc\s+delete_contact\s*\(\s*contact_book\s*:\s*Dictionary\s*\)/,
    /\belif\s+choice\s*==\s*["']4["']/,
    /contact_book\.erase\s*\(/],
  121:[/\bfunc\s+list_all_contacts\s*\(\s*contact_book\s*:\s*Dictionary\s*\)/,
    /\belif\s+choice\s*==\s*["']5["']/,
    /\bfor\b/],
  122:[/\bmatch\s+choice\s*:/,/\b_\s*:/,
    /["']1["']\s*:/,/["']2["']\s*:/,/["']3["']\s*:/,
    /["']4["']\s*:/,/["']5["']\s*:/,/["']6["']\s*:/]
};
const menuText=menu.join('\n');
const contactsDetails=(name,d)=>[
  'Nome: '+name,'Telefono: '+d.phone,'Email: '+d.email,'Indirizzo: '+d.address
];
const simulate=(cmd,n)=>{
  const outputs=[],book=new Map(),step=cmd[Symbol.iterator]();
  while(true){
    outputs.push(...menu);
    const choice=step.next();
    if(choice.done)throw Error('La prova non termina con 6');
    const action=String(choice.value);
    if(action==='6')break;
    if(action==='1'&&n>=117){
      const name=step.next().value;
      if(book.has(name)){outputs.push('Il contatto esiste già!');continue;}
      const phone=step.next().value,email=step.next().value,
        address=step.next().value;
      book.set(name,{phone,email,address});
      outputs.push('Contatto aggiunto correttamente!');
    }else if(action==='2'&&n>=118){
      const name=step.next().value;
      if(!book.has(name))outputs.push('Contatto non trovato!');
      else outputs.push(...contactsDetails(name,book.get(name)));
    }else if(action==='3'&&n>=119){
      const name=step.next().value;
      if(!book.has(name)){outputs.push('Contatto non trovato!');continue;}
      const changes=[step.next().value,step.next().value,step.next().value];
      const entry=book.get(name);
      ['phone','email','address'].forEach((key,i)=>{
        if(changes[i]!=='')entry[key]=changes[i];
      });
      outputs.push('Contatto aggiornato correttamente!');
    }else if(action==='4'&&n>=120){
      const name=step.next().value;
      if(book.delete(name))outputs.push('Contatto eliminato correttamente!');
      else outputs.push('Contatto non trovato!');
    }else if(action==='5'&&n>=121){
      if(book.size===0)outputs.push('Nessun contatto disponibile.');
      else for(const [name,entry] of book)outputs.push(...contactsDetails(name,entry),'');
    }else if(n===122)outputs.push('Scelta non valida. Riprova.');
  }
  return outputs.join('\n');
};
const alice=['1','Alice','123-456-7890','alice@example.com','123 Main St'];
const bob=['1','Bob','234-567-8901','bob@example.com','456 Oak Ave'];
const tests={
  116:[[]],
  117:[[...alice,'6'],[...alice,'1','Alice','6'],['6']],
  118:[[...alice,'2','Alice','6'],['2','Ines','6']],
  119:[[...alice,'3','Alice','987-654-3210','','456 Elm St','2','Alice','6'],
    ['3','Assente','6']],
  120:[[...alice,'4','Alice','2','Alice','6'],['4','Ignoto','6']],
  121:[[...alice,...bob,'5','6'],['5','6']],
  122:[['0',...alice,'9','2','Alice','6'],[...alice,'3','Alice','','nuova@example.com',
      '','5','6'],['x','5','6']]
};
for(let n=116;n<=122;n++){
  const l=get(n);
  const scenarios=n===116?[{name:'Stampa il menu',output:menuText}]:
    tests[n].map((cmd,i)=>({
      name:'Rubrica - scenario '+(i+1),stdin:cmd,output:simulate(cmd,n),
      preserveEmptyLines:true
    }));
  verify.expectedCases[n]=scenarios;
  l.expectedOutput=scenarios[0].output;
  l.manualSourceCheck=all(...patterns[n]);
  l.validationReady=true;
}
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
  117:[...alice,'6'],118:[...alice,'2','Alice','6'],
  119:[...alice,'3','Alice','987-654-3210','','456 Elm St','2','Alice','6'],
  120:[...alice,'4','Alice','2','Alice','6'],
  121:[...alice,...bob,'5','6'],122:['0',...alice,'9','2','Alice','6']
});
window.GDHManualMigration.validated=data.filter(l=>l.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();
