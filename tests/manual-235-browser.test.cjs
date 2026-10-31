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
    assert.equal(stats.prepared,110);
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
