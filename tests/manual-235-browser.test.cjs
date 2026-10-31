'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml',
  '.wasm':'application/wasm','.pck':'application/octet-stream','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const requested=decodeURIComponent((req.url||'/').split('?')[0]);
  const filename=path.resolve(root,requested==='/'?'index.html':requested.replace(/^\/+/,''));
  if(!filename.startsWith(root+path.sep))return res.writeHead(403).end();
  fs.readFile(filename,(err,data)=>{if(err)return res.writeHead(404).end();
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream',
      'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}).end(data);
  });
});
async function main(){
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded',timeout:40000});
    await page.waitForFunction(()=>window.App&&Array.isArray(window.LESSONS_DATA),{timeout:30000});
    // Il tour del primo accesso non deve coprire i controlli del corso.
    const introduction=page.locator('#site-welcome');
    if(await introduction.isVisible()){
      await page.locator('#site-skip-tour').click();
      if(await page.locator('#site-goal-gate').isVisible())
        await page.locator('#site-goal-gate [data-goal="rilassato"]').click();
      if(await page.locator('#streak-modal').isVisible())
        await page.locator('#btn-close-streak').click();
    }
    const stats=await page.evaluate(()=>({
      count:LESSONS_DATA.length,chapters:CHAPTERS_DATA.length,
      prepared:GDHManualMigration.validated,
      first:LESSONS_DATA[0].title,last:LESSONS_DATA[234].title
    }));
    assert.equal(stats.count,235);
    assert.equal(stats.chapters,43);
    assert.equal(stats.prepared,140);
    await page.evaluate(()=>App.openLesson(10001));
    assert.match(await page.locator('#code-editor').inputValue(),/print\("Ciao GDScript!"\)/);
    assert.match(await page.locator('#btn-run-code').innerText(),/Esegui codice/);
    // In Godot reale, lo starter deve essere valido senza cambiare nulla.
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>{
      const x=document.getElementById('real-output-pre')?.textContent||'';
      return x.includes('Ciao GDScript!')||x.includes('Errore Godot');
    },null,{timeout:125000});
    const result=await page.locator('#real-output-pre').innerText();
    assert.match(result,/Ciao GDScript!/);
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10001),null,{timeout:30000});
    await page.evaluate(()=>App.openLesson(10002));
    assert.match(await page.locator('#code-editor').inputValue(),/print\(""\)/);
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>!App.isValidating,null,{timeout:30000});
    assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(10002)),false,
      'La seconda lezione non deve risultare superata con lo starter vuoto');
    await page.locator('#code-editor').fill('extends Node\nfunc _ready():\n    print("Ciao mondo!")');
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10002),null,{timeout:30000});
    await page.evaluate(()=>App.openLesson(10009));
    const snippet=await page.locator('#code-editor').inputValue();
    assert.match(snippet,/^extends Node/m);
    assert.match(snippet,/^    var PlayerName/m);
    await page.evaluate(()=>App.openLesson(10027));
    assert.equal(await page.locator('#manual-stdin-lines').inputValue(),'45');
    await page.locator('#code-editor').fill(
      'extends Node\nfunc _ready():\n    var wind = int(OS.read_string_from_stdin())\n'+
      '    var status = ""\n    if wind < 8:\n        status = "Calmo"\n    elif wind <= 31:\n        status = "Brezza"\n    elif wind <= 63:\n        status = "Vento forte"\n    else:\n        status = "Tempesta"\n    print("stato = ", status)'
    );
    await page.locator('.manual-preview-btn').click();
    await page.waitForFunction(()=>!document.querySelector('.manual-preview-btn')?.disabled,null,{timeout:30000});
    assert.match(await page.locator('#real-output-pre').innerText(),/stato = Vento forte/);
    assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(10027)),false,
      'Una semplice anteprima non deve completare l’esercizio');
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10027),null,{timeout:60000});
    await page.evaluate(()=>App.openLesson(10034));
    assert.equal(await page.locator('#manual-stdin-lines').inputValue(),'Ada');
    await page.locator('#code-editor').fill(
      'extends Node\nfunc _ready():\n    var nome = OS.read_string_from_stdin()\n    print("Ciao, ", nome)');
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10034),null,{timeout:60000});
    await page.evaluate(()=>App.openLesson(10042));
    await page.locator('#code-editor').fill(
      'extends Node\nfunc _ready():\n'+
      '    print("Calcolatore per dividere il conto")\n'+
      '    var bill_amount = float(OS.read_string_from_stdin())\n'+
      '    var tip_percentage = float(OS.read_string_from_stdin())\n'+
      '    var num_people = int(OS.read_string_from_stdin())\n'+
      '    var tip_amount = (tip_percentage / 100) * bill_amount\n'+
      '    var total_amount = bill_amount + tip_amount\n'+
      '    var amount_per_person = total_amount / num_people\n'+
      '    print("Totale (mancia inclusa): $%.2f" % total_amount)\n'+
      '    print("Ogni persona paga: $%.2f" % amount_per_person)');
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10042),null,{timeout:60000});
    // Esercizi su funzioni, chiamate dirette, cicli e array con il vero Godot.
    const exercise=async(n,code)=>{
      await page.evaluate(id=>App.openLesson(id),10000+n);
      await page.locator('#code-editor').fill(code);
      await page.locator('#btn-run-code').click();
      await page.waitForFunction(()=>!App.isValidating,null,{timeout:60000});
      const result=await page.evaluate(id=>({
        finished:App.state.finishedLessons.includes(id),
        output:document.getElementById('real-output-pre')?.textContent,
        error:document.querySelector('#exercise-debug-area')?.textContent?.slice(0,1300),
        explanation:document.getElementById('validation-result')?.textContent?.slice(0,1200)
      }),10000+n);
      assert.equal(result.finished,true,'Lezione '+n+' rifiutata: '+JSON.stringify(result));
    };
    await exercise(51,
      'extends Node\nfunc _ready():\n'+
      '    var n = int(OS.read_string_from_stdin())\n'+
      '    for i in range(n):\n        print_large_number()\n'+
      'func print_large_number():\n    print(50005000)');
    // Questo esercizio non usa _ready: il motore deve chiamare sigma(n).
    await exercise(55,
      'func sigma(n: int):\n    var total = 0\n'+
      '    for i in range(1, n + 1):\n        total += i\n    return total');
    await exercise(56,
      'func is_valid(username: String, password: String):\n'+
      '    if username == "admin":\n        return true\n'+
      '    if username == "utente":\n        return password == "qweasd"\n'+
      '    return false');
    // Controllo separato del protocollo stdin: lo stesso script deve leggere
    // valori differenti in esecuzioni consecutive, senza tenere dati vecchi.
    const stdinProbe=await page.evaluate(async()=>{
      const src='extends Node\nfunc _ready():\n    print(OS.read_string_from_stdin())';
      const adapted=GDHManualVerifier.nativeSource(src);
      const values=[];
      for(const text of ['1','7','21']){
        const result=await GDHGodot.runNative(adapted,{stdin:[text]});
        values.push({text,stdout:result.stdout,status:result.status,stderr:result.stderr});
      }
      return values;
    });
    assert.deepEqual(stdinProbe.map(x=>x.stdout.trim()),['1','7','21'],
      'Input non isolato correttamente: '+JSON.stringify(stdinProbe));
    const fizzSolution =
      'extends Node\nfunc _ready():\n'+
      '    print("Benvenuto in FizzBuzz!")\n'+
      '    var limit = int(OS.read_string_from_stdin())\n'+
      '    for i in range(1, limit + 1):\n        print(fizzbuzz(i))\n'+
      'func fizzbuzz(number: int) -> String:\n'+
      '    if number % 21 == 0:\n        return "FizzBuzz"\n'+
      '    if number % 3 == 0:\n        return "Fizz"\n'+
      '    if number % 7 == 0:\n        return "Buzz"\n'+
      '    return str(number)';
    const fizzProbe=await page.evaluate(async code=>{
      const trace=[];
      const verdict=await GDHManualVerifier.verify(10060,code,async(source,options)=>{
        const value=await GDHGodot.runNative(source,options);
        trace.push({stdin:options.stdin,output:value.stdout,ok:value.status,stderr:value.stderr});
        return value;
      });
      return {trace,cases:GDHManualVerifier.expectedCases[60].map(({name,stdin,output})=>({name,stdin,output})),checks:verdict.feedback.checks,accepted:verdict.accepted};
    },fizzSolution);
    assert.equal(fizzProbe.accepted,true,
      'La funzione nativa di verifica FizzBuzz ha fallito: '+JSON.stringify(fizzProbe));
    await exercise(60,fizzSolution);
    await exercise(67,
      'extends Node\nfunc _ready():\n'+
      '    var count = int(OS.read_string_from_stdin())\n'+
      '    var numbers = []\n'+
      '    for i in range(count):\n'+
      '        numbers.append(int(OS.read_string_from_stdin()))\n'+
      '    var reversed_numbers = []\n'+
      '    for i in range(numbers.size() - 1, -1, -1):\n'+
      '        reversed_numbers.append(numbers[i])\n'+
      '    print(reversed_numbers)');
    await exercise(71,
      'extends Node\nfunc _ready():\n'+
      '    var text = OS.read_string_from_stdin()\n'+
      '    var count = 0\n'+
      '    for letter in text.to_lower():\n'+
      '        if letter == "p":\n            count += 1\n'+
      '    print(count)');
    await exercise(76,
      'extends Node\nfunc _ready():\n'+
      '    var parts = OS.read_string_from_stdin().split(",")\n'+
      '    var numbers: Array[int] = []\n'+
      '    for part in parts:\n        numbers.append(int(part))\n'+
      '    var ascending = numbers.duplicate()\n'+
      '    ascending.sort()\n'+
      '    var descending = ascending.duplicate()\n'+
      '    descending.reverse()\n'+
      '    print("Original: ", numbers)\n'+
      '    print("Ascending: ", ascending)\n'+
      '    print("Descending: ", descending)');
    await exercise(77,
      'extends Node\nfunc _ready():\n'+
      '    var hero_name = OS.read_string_from_stdin()\n'+
      '    var role = OS.read_string_from_stdin()\n'+
      '    var level = int(OS.read_string_from_stdin())\n'+
      '    var hero = {"name": hero_name, "role": role, "level": level}\n'+
      '    print(hero)');
    await exercise(78,
      'extends Node\nfunc _ready():\n'+
      '    var item_name = OS.read_string_from_stdin()\n'+
      '    var price = float(OS.read_string_from_stdin())\n'+
      '    var stock = int(OS.read_string_from_stdin())\n'+
      '    var key = OS.read_string_from_stdin()\n'+
      '    var item = {"name": item_name, "price": price, "stock": stock}\n'+
      '    print(item.get(key, "Non trovato"))');
    await exercise(81,
      'extends Node\nfunc _ready():\n'+
      '    var loot = OS.read_string_from_stdin().split(",")\n'+
      '    var counts = {}\n'+
      '    for item in loot:\n        counts[item] = counts.get(item, 0) + 1\n'+
      '    for item in counts:\n        print(item, ": ", counts[item])');
    // Il registro spese è un progetto progressivo: ogni fase deve funzionare
    // con una sequenza di scelte differente, non solo con l'esempio del manuale.
    await exercise(82,
      'extends Node\nfunc _ready():\n'+
      '    var item = OS.read_string_from_stdin()\n'+
      '    var amount = int(OS.read_string_from_stdin())\n'+
      '    var used = OS.read_string_from_stdin()\n'+
      '    var inventory = {"pozione": 2, "freccia": 10}\n'+
      '    inventory[item] = inventory.get(item, 0) + amount\n'+
      '    if inventory.has(used):\n'+
      '        inventory[used] -= 1\n'+
      '        print("Usato ", used)\n'+
      '        if inventory[used] == 0:\n'+
      '            inventory.erase(used)\n'+
      '    else:\n'+
      '        print("Non possiedi ", used)\n'+
      '    print("Articoli: ", inventory.size())\n'+
      '    for key in inventory:\n'+
      '        print(key, ": ", inventory[key])');
    await page.evaluate(()=>App.openLesson(10083));
    assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(10083)),false);
    assert.doesNotMatch(await page.locator('#code-editor').inputValue(),
      /print\("Benvenuto nel registro giornaliero/);
    const expensesMenu=(
      '    print("Benvenuto nel registro giornaliero delle spese!")\n'+
      '    print("\\nMenu:")\n'+
      '    print("1. Aggiungi una nuova spesa")\n'+
      '    print("2. Visualizza tutte le spese")\n'+
      '    print("3. Calcola totale e media delle spese")\n'+
      '    print("4. Cancella tutte le spese")\n'+
      '    print("5. Esci")\n'
    );
    await exercise(83,'extends Node\nfunc _ready():\n'+expensesMenu);
    await exercise(84,'extends Node\nfunc _ready():\n'+expensesMenu+
      '    while true:\n'+
      '        var choice = OS.read_string_from_stdin()\n'+
      '        if choice == "5":\n'+
      '            print("Chiusura del registro delle spese. Arrivederci!")\n'+
      '            break');
    const completeExpense=
      'extends Node\nfunc _ready():\n'+expensesMenu+
      '    var expenses: Array[float] = []\n'+
      '    while true:\n'+
      '        var choice = OS.read_string_from_stdin()\n'+
      '        if choice == "1":\n'+
      '            var amount = float(OS.read_string_from_stdin())\n'+
      '            expenses.append(amount)\n'+
      '            print("Spesa aggiunta correttamente!")\n'+
      '        elif choice == "2":\n'+
      '            if expenses.is_empty():\n'+
      '                print("Nessuna spesa registrata.")\n'+
      '            else:\n'+
      '                print("Le tue spese:")\n'+
      '                for i in range(expenses.size()):\n'+
      '                    print(i + 1, ". ", expenses[i])\n'+
      '        elif choice == "3":\n'+
      '            if expenses.is_empty():\n'+
      '                print("Nessuna spesa registrata.")\n'+
      '            else:\n'+
      '                var total = 0.0\n'+
      '                for expense in expenses:\n'+
      '                    total += expense\n'+
      '                var average = total / expenses.size()\n'+
      '                print("Totale delle spese: ", total)\n'+
      '                print("Spesa media: ", average)\n'+
      '        elif choice == "4":\n'+
      '            expenses.clear()\n'+
      '            print("Tutte le spese sono state cancellate.")\n'+
      '        elif choice == "5":\n'+
      '            print("Chiusura del registro delle spese. Arrivederci!")\n'+
      '            break\n'+
      '        else:\n'+
      '            print("Scelta non valida. Riprova.")';
    for(const n of [85,86,87,88,89])await exercise(n,completeExpense);
    await exercise(90,
      'extends Node\nfunc _ready():\n'+
      '    var n = int(OS.read_string_from_stdin())\n'+
      '    for i in range(1, n + 1, 2):\n'+
      '        print("*".repeat(i))');
    await exercise(91,
      'extends Node\nfunc find_occurrences(text, pattern):\n'+
      '    var positions = []\n'+
      '    for i in range(text.length() - pattern.length() + 1):\n'+
      '        if text.substr(i, pattern.length()) == pattern:\n'+
      '            positions.append(i)\n'+
      '    return [not positions.is_empty(), positions.size(), positions]\n'+
      'func _ready():\n'+
      '    var text = OS.read_string_from_stdin()\n'+
      '    var pattern = OS.read_string_from_stdin()\n'+
      '    print(find_occurrences(text, pattern))');
    await exercise(92,
      'extends Node\nfunc _ready():\n'+
      '    var prices: Array[int] = []\n'+
      '    for price in OS.read_string_from_stdin().split(","):\n'+
      '        prices.append(int(price))\n'+
      '    var items = OS.read_string_from_stdin().split(",")\n'+
      '    var budget_per_item = int(OS.read_string_from_stdin())\n'+
      '    var affordable_items: Array[String] = []\n'+
      '    var cant_afford = 0\n'+
      '    var total_needed = 0\n'+
      '    for i in range(prices.size()):\n'+
      '        if prices[i] <= budget_per_item:\n'+
      '            affordable_items.append(items[i])\n'+
      '            total_needed += prices[i]\n'+
      '        else:\n'+
      '            cant_afford += 1\n'+
      '    print("Può acquistare: ", affordable_items)\n'+
      '    print("Budget totale necessario: ", total_needed)\n'+
      '    print("Acquisto non possibile: ", cant_afford)');
    await exercise(94,
      'extends Node\nfunc _ready():\n'+
      '    var email = OS.read_string_from_stdin()\n'+
      '    var low = email.to_lower()\n'+
      '    var valid = email.count("@") == 1 and not email.begins_with("@") '+ 
      'and not email.contains(" ") and '+ 
      '(low.ends_with(".com") or low.ends_with(".org") or low.ends_with(".tech"))\n'+
      '    print("valido" if valid else "non valido")');
    await exercise(95,
      'extends Node\nfunc _ready():\n'+
      '    var title = OS.read_string_from_stdin()\n'+
      '    var slug = title.strip_edges().to_lower().replace(" ", "-")\n'+
      '    slug = slug.replace("!", "").replace("?", "").replace(".", "")\n'+
      '    slug = slug.replace("è", "e")\n'+
      '    print(slug)');
    await exercise(96,
      'extends Node\nfunc _ready():\n'+
      '    var line = OS.read_string_from_stdin()\n'+
      '    var parts = line.split(",")\n'+
      '    var words: PackedStringArray = []\n'+
      '    var longest = ""\n'+
      '    for part in parts:\n'+
      '        var word = part.strip_edges()\n'+
      '        words.append(word.to_upper())\n'+
      '        if word.length() > longest.length():\n'+
      '            longest = word\n'+
      '    print(words.size())\n'+
      '    print(" > ".join(words))\n'+
      '    print(longest)');
    await exercise(97,
      'extends Node\nfunc _ready():\n'+
      '    var raw = OS.read_string_from_stdin()\n'+
      '    var name = raw.strip_edges().to_lower()\n'+
      '    var ok = name.length() >= 3 and name.length() <= 16\n'+
      '    ok = ok and not name.contains(" ") and not name.contains("!")\n'+
      '    ok = ok and not name.contains("?") and not name.contains(".")\n'+
      '    if name.length() > 0:\n'+
      '        ok = ok and not "0123456789".contains(name.substr(0, 1))\n'+
      '    print("ok: " + name if ok else "non valido")');
    await exercise(98,
      'extends Node\nfunc _ready():\n'+
      '    const SECRET = 42\n'+
      '    var guess = int(OS.read_string_from_stdin())\n'+
      '    match guess:\n'+
      '        SECRET:\n            print("Corretto!")\n'+
      '        0:\n            print("Hai rinunciato.")\n'+
      '        var attempt:\n            print(attempt, " non è il numero cercato.")');
    await exercise(99,
      'extends Node\nfunc _ready():\n'+
      '    var age = int(OS.read_string_from_stdin())\n'+
      '    match age:\n'+
      '        var n when n >= 0 and n <= 12:\n'+
      '            print("Bambino")\n'+
      '        var n when n >= 13 and n <= 19:\n'+
      '            print("Adolescente")\n'+
      '        var n when n >= 20 and n <= 64:\n'+
      '            print("Adulto")\n'+
      '        var n when n >= 65 and n <= 120:\n'+
      '            print("Anziano")\n'+
      '        _:\n            print("Età non valida")');
    await exercise(100,
      'extends Node\nfunc _ready():\n'+
      '    var parts = OS.read_string_from_stdin().split(",")\n'+
      '    var point = [int(parts[0]), int(parts[1])]\n'+
      '    match point:\n'+
      '        [0, 0]:\n            print("Origine")\n'+
      '        [0, var y]:\n            print("Sull’asse y in y=", y)\n'+
      '        [var x, 0]:\n            print("Sull’asse x in x=", x)\n'+
      '        [var x, var y] when x == y:\n'+
      '            print("Sulla diagonale in ", x)\n'+
      '        [var x, var y]:\n'+
      '            print("Punto in (", x, ", ", y, ")")');
    await exercise(101,
      'extends Node\nfunc _ready():\n'+
      '    var event = {}\n'+
      '    for pair in OS.read_string_from_stdin().split(","):\n'+
      '        var kv = pair.split("=")\n'+
      '        event[kv[0]] = kv[1]\n'+
      '    match event:\n'+
      '        {"type": "muovi", "dir": var direction}:\n'+
      '            print("Movimento: ", direction)\n'+
      '        {"type": "attacca", "damage": var damage}:\n'+
      '            print("Subisce ", damage, " danni")\n'+
      '        {"type": "cura", ..}:\n'+
      '            print("Cura")\n'+
      '        {"type": var kind, ..}:\n'+
      '            print("Evento sconosciuto: ", kind)\n'+
      '        _:\n'+
      '            print("Evento non valido")');
    await exercise(102,
      'extends Node\nfunc _ready():\n'+
      '    var names = ["Alice", "Bob", "Charlie", "Dana"]\n'+
      '    var grades = {"Alice": 85, "Bob": 90, "Charlie": 78}\n'+
      '    var student = OS.read_string_from_stdin()\n'+
      '    var grade = OS.read_string_from_stdin()\n'+
      '    print(student, " è nella classe." if student in names else " non è nella classe.")\n'+
      '    print(student, " ha un voto." if student in grades else " non ha voti.")\n'+
      '    print("Qualcuno ha ottenuto " + grade + "." if int(grade) in grades.values() '+
        'else "Nessuno ha ottenuto " + grade + ".")');
    await exercise(103,
      'extends Node\nfunc _ready():\n'+
      '    const DIRECTIONS = ["nord", "sud", "est", "ovest"]\n'+
      '    var inventory: Array[String] = []\n'+
      '    while true:\n'+
      '        var raw = OS.read_string_from_stdin().strip_edges().to_lower()\n'+
      '        var words: Array[String] = []\n'+
      '        for word in raw.split(" ", false):\n'+
      '            words.append(word)\n'+
      '        match words:\n'+
      '            []:\n'+
      '                print("Digita un comando.")\n'+
      '            ["aiuto"]:\n'+
      '                print("Comandi: vai, prendi, inventario, esci")\n'+
      '            ["vai", var direction] when direction in DIRECTIONS:\n'+
      '                print("Vai verso ", direction, ".")\n'+
      '            ["vai", var direction]:\n'+
      '                print("Non puoi andare verso ", direction, ".")\n'+
      '            ["prendi", var item] when item in inventory:\n'+
      '                print("Possiedi già ", item, ".")\n'+
      '            ["prendi", var item]:\n'+
      '                inventory.append(item)\n'+
      '                print("Prendi ", item, ".")\n'+
      '            ["inventario"]:\n'+
      '                print("Inventario: ", ", ".join(inventory) if not inventory.is_empty() else "vuoto")\n'+
      '            ["esci"]:\n'+
      '                print("Arrivederci!")\n'+
      '                break\n'+
      '            _:\n'+
      '                print("Comando sconosciuto.")');
    await exercise(104,
      'extends Node\nfunc _ready():\n'+
      '    var level = [\n'+
      '        [1, 1, 1, 1, 1],\n'+
      '        [1, 0, 2, 0, 1],\n'+
      '        [1, 0, 1, 3, 1],\n'+
      '        [1, 1, 1, 1, 1]\n'+
      '    ]\n'+
      '    print("Righe: ", level.size())\n'+
      '    print("Colonne: ", level[0].size())\n'+
      '    for row in level:\n'+
      '        print(row)');
    await exercise(105,
      'func get_tile(grid: Array, row: int, col: int):\n'+
      '    if row < 0 or row >= grid.size():\n'+
      '        return -1\n'+
      '    if col < 0 or col >= grid[row].size():\n'+
      '        return -1\n'+
      '    return grid[row][col]');
    await exercise(106,
      'extends Node\nfunc _ready():\n'+
      '    var rows = int(OS.read_string_from_stdin())\n'+
      '    var cols = int(OS.read_string_from_stdin())\n'+
      '    var player_row = int(OS.read_string_from_stdin())\n'+
      '    var player_col = int(OS.read_string_from_stdin())\n'+
      '    var grid = []\n'+
      '    for r in range(rows):\n'+
      '        var line: PackedStringArray = []\n'+
      '        for c in range(cols):\n'+
      '            line.append(".")\n'+
      '        grid.append(line)\n'+
      '    grid[player_row][player_col] = "P"\n'+
      '    for line in grid:\n'+
      '        print("".join(line))');
    await exercise(107,
      'func grid_stats(grid: Array):\n'+
      '    var total = 0\n'+
      '    var largest = grid[0][0]\n'+
      '    var even = 0\n'+
      '    for row in grid:\n'+
      '        for value in row:\n'+
      '            total += value\n'+
      '            if value > largest:\n'+
      '                largest = value\n'+
      '            if value % 2 == 0:\n'+
      '                even += 1\n'+
      '    return [total, largest, even]');
    await exercise(108,
      'func make_triangle(n: int):\n'+
      '    var grid = []\n'+
      '    for row in range(1, n + 1):\n'+
      '        var cells = []\n'+
      '        for col in range(1, row + 1):\n'+
      '            cells.append(row * col)\n'+
      '        grid.append(cells)\n'+
      '    return grid');
    await exercise(109,
      'func print_patterns(grid: Array):\n'+
      '    var n = grid.size()\n'+
      '    var main: PackedStringArray = []\n'+
      '    var second: PackedStringArray = []\n'+
      '    var top: PackedStringArray = []\n'+
      '    var bottom: PackedStringArray = []\n'+
      '    var left: PackedStringArray = []\n'+
      '    var right: PackedStringArray = []\n'+
      '    for i in range(n):\n'+
      '        main.append(str(grid[i][i]))\n'+
      '        second.append(str(grid[i][n-1-i]))\n'+
      '        top.append(str(grid[0][i]))\n'+
      '        bottom.append(str(grid[n-1][i]))\n'+
      '        left.append(str(grid[i][0]))\n'+
      '        right.append(str(grid[i][n-1]))\n'+
      '    print("Diagonale principale: ", " ".join(main))\n'+
      '    print("Diagonale secondaria: ", " ".join(second))\n'+
      '    print("Prima riga: ", " ".join(top))\n'+
      '    print("Ultima riga: ", " ".join(bottom))\n'+
      '    print("Prima colonna: ", " ".join(left))\n'+
      '    print("Ultima colonna: ", " ".join(right))');
    await exercise(110,
      'extends Node\nfunc _ready():\n'+
      '    var board = []\n'+
      '    for r in range(3):\n'+
      '        var row = []\n'+
      '        var line = OS.read_string_from_stdin()\n'+
      '        for c in range(3):\n'+
      '            row.append(line.substr(c, 1))\n'+
      '        board.append(row)\n'+
      '    var winner = ""\n'+
      '    for i in range(3):\n'+
      '        if board[i][0] != "." and board[i][0] == board[i][1] '+ 
      'and board[i][1] == board[i][2]:\n'+
      '            winner = board[i][0]\n'+
      '        if board[0][i] != "." and board[0][i] == board[1][i] '+
      'and board[1][i] == board[2][i]:\n'+
      '            winner = board[0][i]\n'+
      '    if board[1][1] != ".":\n'+
      '        if board[0][0] == board[1][1] and board[1][1] == board[2][2]:\n'+
      '            winner = board[1][1]\n'+
      '        if board[0][2] == board[1][1] and board[1][1] == board[2][0]:\n'+
      '            winner = board[1][1]\n'+
      '    if winner != "":\n'+
      '        print("Vince ", winner)\n'+
      '    else:\n'+
      '        var full = true\n'+
      '        for row in board:\n'+
      '            if "." in row:\n'+
      '                full = false\n'+
      '        print("Pareggio" if full else "Continua a giocare")');
    await exercise(111,
      'extends Node\nfunc _ready():\n'+
      '    var inventory = {\n'+
      '        "frutta": {"mele": 12, "banane": 4},\n'+
      '        "carne": {"manzo": 7, "pollo": 5},\n'+
      '        "latticini": {"latte": 9, "formaggio": 2}\n'+
      '    }\n'+
      '    var lookups = OS.read_string_from_stdin().split(",")\n'+
      '    for lookup in lookups:\n'+
      '        var parts = lookup.split("/")\n'+
      '        if inventory.has(parts[0]) and inventory[parts[0]].has(parts[1]):\n'+
      '            print(lookup, ": ", inventory[parts[0]][parts[1]])\n'+
      '        else:\n'+
      '            print(lookup, ": mancante")\n'+
      '    var total = 0\n'+
      '    for dept in inventory:\n'+
      '        for quantity in inventory[dept].values():\n'+
      '            total += quantity\n'+
      '    print("Totale inventario: ", total)');
    await exercise(112,
      'extends Node\nfunc _ready():\n'+
      '    var n = int(OS.read_string_from_stdin())\n'+
      '    var players = []\n'+
      '    var best_name = ""\n'+
      '    var best_score = -999999\n'+
      '    for i in range(n):\n'+
      '        var parts = OS.read_string_from_stdin().split(",")\n'+
      '        var name = parts[0]\n'+
      '        var score = int(parts[1])\n'+
      '        players.append({"name": name, "score": score})\n'+
      '        if score > best_score:\n'+
      '            best_score = score\n'+
      '            best_name = name\n'+
      '    print(players)\n'+
      '    print("Migliore: ", best_name, " (", best_score, ")")');
    await exercise(113,
      'extends Node\nfunc _ready():\n'+
      '    var defaults = {"difficulty": "normale", "volume": "5",\n'+
      '        "subtitles": "spento", "language": "en"}\n'+
      '    var saved = {}\n'+
      '    for pair in OS.read_string_from_stdin().split(",", false):\n'+
      '        var parts = pair.split("=")\n'+
      '        saved[parts[0]] = parts[1]\n'+
      '    for key in defaults:\n'+
      '        if not saved.has(key):\n'+
      '            saved[key] = defaults[key]\n'+
      '    print(saved)\n'+
      '    print(defaults)');
    await exercise(114,
      'extends Node\nfunc _ready():\n'+
      '    var template = {"type": "slime",\n'+
      '        "statistiche": {"hp": 30, "speed": 2}, "loot": ["gel"]}\n'+
      '    var n = int(OS.read_string_from_stdin())\n'+
      '    var bonus = int(OS.read_string_from_stdin())\n'+
      '    for i in range(1, n+1):\n'+
      '        var enemy = template.duplicate(true)\n'+
      '        enemy["id"] = i\n'+
      '        enemy["statistiche"]["hp"] += bonus * i\n'+
      '        if i == n:\n'+
      '            enemy["loot"].append("crown")\n'+
      '        print(enemy)\n'+
      '    print("Template: ", template)');
    await exercise(115,
      'func frequency_counter(data_list: Array):\n'+
      '    var counts = {}\n'+
      '    for item in data_list:\n'+
      '        counts[item] = counts.get(item, 0) + 1\n'+
      '    return counts');
    await exercise(116,
      'extends Node\nfunc _ready():\n    display_menu()\n'+
      'func display_menu():\n'+
      '    print("Menu della rubrica:")\n'+
      '    print("1. Aggiungi contatto")\n'+
      '    print("2. Visualizza contatto")\n'+
      '    print("3. Modifica contatto")\n'+
      '    print("4. Elimina contatto")\n'+
      '    print("5. Elenca tutti i contatti")\n'+
      '    print("6. Esci")');
    const completeRubrica=await page.evaluate(
      ()=>LESSONS_DATA.find(l=>l.manualLessonNumber===122).initialCode);
    for(const n of [117,118,119,120,121])
      await exercise(n,completeRubrica);
    const matchRubrica=completeRubrica
      .replace(/^        if choice == "1":/m,
        '        match choice:\n            "1":')
      .replace(/^        elif choice == "([2-6])":/gm,
        '            "$1":')
      .replace(/^            (add_contact|view_contact|edit_contact|delete_contact|list_all_contacts)\(contact_book\)$/gm,
        '                $1(contact_book)')
      .replace(/^            break$/m,'                break')
      .replace('        # Aggiungi il pattern jolly per le scelte non valide.',
        '            _:\n                print("Scelta non valida. Riprova.")');
    await exercise(122,matchRubrica);
    await exercise(123,
      'extends Node\nfunc _ready():\n'+
      '    var badges = {}\n'+
      '    for i in range(4):\n'+
      '        var badge = OS.read_string_from_stdin()\n'+
      '        badges[badge] = true\n'+
      '    print("Medaglie diverse: ", badges.size())\n'+
      '    print(badges.keys())');
    await exercise(124,
      'extends Node\nfunc _ready():\n'+
      '    var guest_list = OS.read_string_from_stdin().split(" ", false)\n'+
      '    var arrivals = OS.read_string_from_stdin().split(" ", false)\n'+
      '    var guests = {}\n'+
      '    for name in guest_list:\n'+
      '        guests[name] = true\n'+
      '    print("Ospiti nell’elenco: ", guests.size())\n'+
      '    for name in arrivals:\n'+
      '        print(name, ": benvenuto" if guests.has(name) else ": non presente nell’elenco")');
    await exercise(125,
      'extends Node\nfunc _ready():\n'+
      '    var inventory = {}\n'+
      '    while true:\n'+
      '        var command = OS.read_string_from_stdin()\n'+
      '        if command == "fine":\n'+
      '            break\n'+
      '        var parts = command.split(" ")\n'+
      '        var action = parts[0]\n'+
      '        var item = parts[1]\n'+
      '        if action == "aggiungi":\n'+
      '            if inventory.has(item):\n'+
      '                print("Già presente ", item)\n'+
      '            else:\n'+
      '                inventory[item] = true\n'+
      '                print("Aggiunto ", item)\n'+
      '        elif action == "rimuovi":\n'+
      '            if inventory.has(item):\n'+
      '                inventory.erase(item)\n'+
      '                print("Rimosso ", item)\n'+
      '            else:\n'+
      '                print("Nessuna ", item, " da rimuovere")\n'+
      '    print("Inventario: ", ", ".join(PackedStringArray(inventory.keys())) '+ 
      'if not inventory.is_empty() else "vuoto")');
    await exercise(126,
      'extends Node\nfunc _ready():\n'+
      '    var first = {}\n'+
      '    for skill in OS.read_string_from_stdin().split(" ", false):\n'+
      '        first[skill] = true\n'+
      '    var second = {}\n'+
      '    for skill in OS.read_string_from_stdin().split(" ", false):\n'+
      '        second[skill] = true\n'+
      '    var union = first.keys()\n'+
      '    for skill in second:\n'+
      '        if not first.has(skill):\n'+
      '            union.append(skill)\n'+
      '    var shared = []\n'+
      '    for skill in first:\n'+
      '        if second.has(skill):\n'+
      '            shared.append(skill)\n'+
      '    print("Tutte le abilità: ", ", ".join(PackedStringArray(union)))\n'+
      '    print("Abilità condivise: ", ", ".join(PackedStringArray(shared)) '+ 
      'if shared.size() > 0 else "nessuna")');
    await exercise(127,
      'extends Node\nfunc _ready():\n'+
      '    var needed = {}\n'+
      '    for item in OS.read_string_from_stdin().split(" ", false):\n'+
      '        needed[item] = true\n'+
      '    var packed = {}\n'+
      '    for item in OS.read_string_from_stdin().split(" ", false):\n'+
      '        packed[item] = true\n'+
      '    var missing = []\n'+
      '    for item in needed:\n'+
      '        if not packed.has(item):\n'+
      '            missing.append(item)\n'+
      '    var extra = []\n'+
      '    for item in packed:\n'+
      '        if not needed.has(item):\n'+
      '            extra.append(item)\n'+
      '    print("Mancano: ", ", ".join(PackedStringArray(missing)) '+
      'if missing.size() > 0 else "nessuno")\n'+
      '    print("Extra: ", ", ".join(PackedStringArray(extra)) '+
      'if extra.size() > 0 else "nessuno")');
    await exercise(128,
      'func remove_duplicates(numbers: Array[int]) -> Array[int]:\n'+
      '    var seen = {}\n'+
      '    var result: Array[int] = []\n'+
      '    for number in numbers:\n'+
      '        if not seen.has(number):\n'+
      '            seen[number] = true\n'+
      '            result.append(number)\n'+
      '    return result');
    // Lezioni 129–133: verifiche reali con input alternativi nel runtime Godot.
    await exercise(129,[
      'extends Node',
      'enum Weather { SUNNY, CLOUDY, RAINY, SNOWY }',
      'func _ready():',
      '    var weather = int(OS.read_string_from_stdin())',
      '    match weather:',
      '        Weather.SUNNY: print("Wear sunglasses")',
      '        Weather.CLOUDY: print("Porta una giacca")',
      '        Weather.RAINY: print("Take an umbrella")',
      '        Weather.SNOWY: print("Costruisci un pupazzo di neve")'
    ].join('\n'));
    await exercise(130,[
      'extends Node',
      'enum Difficulty { EASY = 1, NORMAL, HARD, NIGHTMARE = 10 }',
      'func _ready():',
      '    var base_damage = int(OS.read_string_from_stdin())',
      '    print("EASY: ", base_damage * Difficulty.EASY)',
      '    print("NORMAL: ", base_damage * Difficulty.NORMAL)',
      '    print("HARD: ", base_damage * Difficulty.HARD)',
      '    print("NIGHTMARE: ", base_damage * Difficulty.NIGHTMARE)'
    ].join('\n'));
    await exercise(131,[
      'extends Node',
      'enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }',
      'func _ready():',
      '    var day_name = OS.read_string_from_stdin()',
      '    var days = int(OS.read_string_from_stdin())',
      '    var lookup = {"LUNEDÌ": Day.MONDAY, "MARTEDÌ": Day.TUESDAY,',
      '        "MERCOLEDÌ": Day.WEDNESDAY, "GIOVEDÌ": Day.THURSDAY,',
      '        "VENERDÌ": Day.FRIDAY, "SABATO": Day.SATURDAY, "DOMENICA": Day.SUNDAY}',
      '    var names = ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ",',
      '        "VENERDÌ", "SABATO", "DOMENICA"]',
      '    var current = lookup[day_name]',
      '    print(day_name, " ha valore ", current)',
      '    print("Tra ", days, " giorni: ", names[(current + days) % 7])'
    ].join('\n'));
    await exercise(132,[
      'extends Node',
      'enum State { IDLE, WALK, RUN, JUMP, FALL }',
      'func describe(state: State):',
      '    match state:',
      '        State.IDLE: return "Fermo"',
      '        State.WALK, State.RUN: return "In movimento"',
      '        State.JUMP, State.FALL: return "In aria"',
      '    return ""',
      'func _ready():',
      '    var names = OS.read_string_from_stdin().split(" ", false)',
      '    for state_name in names:',
      '        print(state_name, ": ", describe(State[state_name]))'
    ].join('\n'));
    await exercise(133,[
      'extends Node',
      'enum TrafficLight { RED, YELLOW, GREEN }',
      'func get_driver_action(light):',
      '    match light:',
      '        TrafficLight.RED: return "Fermati"',
      '        TrafficLight.YELLOW: return "Attenzione"',
      '        TrafficLight.GREEN: return "Procedi"',
      '    return ""',
      'func get_wait_time(light):',
      '    match light:',
      '        TrafficLight.RED: return 30',
      '        TrafficLight.YELLOW: return 3',
      '        TrafficLight.GREEN: return 25',
      '    return 0',
      'func get_next_light(light):',
      '    match light:',
      '        TrafficLight.RED: return TrafficLight.GREEN',
      '        TrafficLight.GREEN: return TrafficLight.YELLOW',
      '        TrafficLight.YELLOW: return TrafficLight.RED',
      '    return TrafficLight.RED',
      'func _ready():',
      '    var first = OS.read_string_from_stdin()',
      '    var count = int(OS.read_string_from_stdin())',
      '    var labels = {TrafficLight.RED: "ROSSO",',
      '        TrafficLight.YELLOW: "GIALLO", TrafficLight.GREEN: "VERDE"}',
      '    var light = TrafficLight[first]',
      '    var total = 0',
      '    for i in range(count):',
      '        var wait = get_wait_time(light)',
      '        print(labels[light], ": ", get_driver_action(light), " per ", wait, " secondi")',
      '        total += wait',
      '        light = get_next_light(light)',
      '    print("")',
      '    print("Attesa totale: ", total, " secondi")'
    ].join('\n'));
    // Controllo negativo nel vero Godot: stampa fissa non equivale a enum.
    const fakeEnum=await page.evaluate(async()=>{
      return await GDHManualVerifier.verify(10129,
        'extends Node\nfunc _ready():\n    print("Take an umbrella")',
        (src,options)=>GDHGodot.runNative(src,options));
    });
    assert.equal(fakeEnum.accepted,false);
    // I passaggi del registro degli studenti devono usare davvero Godot.
    // Lo starter del passaggio successivo contiene il lavoro già concluso
    // nel precedente e funge da soluzione di riferimento regressiva.
    for(let n=134;n<=139;n++){
      const source=await page.evaluate(next=>
        LESSONS_DATA.find(l=>l.manualLessonNumber===next).initialCode,n+1);
      await exercise(n,source);
    }
    const completedRecords=await page.evaluate(()=>
      LESSONS_DATA.find(l=>l.manualLessonNumber===140).initialCode);
    const recordSolution=completedRecords.replace(
      '            # Aggiungi qui il nuovo ramo del match per la lezione.',
      '            ["migliori", var threshold]:\n'+
      '                print(filter_top_students(float(threshold)))'
    )+'\nfunc filter_top_students(threshold: float) -> Array:\n'+
      '    var names = []\n'+
      '    for student_name in student_records:\n'+
      '        if calculate_average_grade(student_name) > threshold:\n'+
      '            names.append(student_name)\n'+
      '    return names';
    await exercise(140,recordSolution);
    const noStudentWork=await page.evaluate(async()=>{
      return GDHManualVerifier.verify(10140,
        'extends Node\nfunc _ready():\n    print("Arrivederci!")',
        (src,opts)=>GDHGodot.runNative(src,opts));
    });
    assert.equal(noStudentWork.accepted,false,'Non approvare il solo saluto finale');
    await page.evaluate(()=>App.openLesson(10171));
    assert.ok(await page.locator('.manual-file-tab').count()>=2);
    assert.match(await page.locator('#code-editor').inputValue(),/class_name Greeter/);
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),null);
    await page.locator('.manual-file-tab', {hasText:'main.gd'}).click();
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'');
    assert.equal(errors.length,0,'Page errors: '+errors.join(' | '));
    console.log('PASS browser: 70 lezioni predisposte, funzioni, array, FizzBuzz e editor.');
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
