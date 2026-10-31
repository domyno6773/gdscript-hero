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
    assert.equal(stats.prepared,215);
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
    await exercise(141,[
      'extends Node','func _ready():',
      '    var sales = OS.read_string_from_stdin().split(" ", false)',
      '    var starting_cash = int(OS.read_string_from_stdin())',
      '    for sale in sales:',
      '        starting_cash += int(sale)',
      '    print("Totale: ", starting_cash)'
    ].join('\n'));
    await exercise(142,[
      'extends Node','func _ready():',
      '    var number_texts = OS.read_string_from_stdin().split(" ", false)',
      '    var words = Array(OS.read_string_from_stdin().split(" ", false))',
      '    var small_num = int(number_texts[0])',
      '    var big_num = small_num',
      '    for item in number_texts:',
      '        small_num = min(small_num, int(item))',
      '        big_num = max(big_num, int(item))',
      '    var small_word = words[0]',
      '    var big_word = words[0]',
      '    for word in words:',
      '        if small_word.casecmp_to(word) > 0:',
      '            small_word = word',
      '        if big_word.casecmp_to(word) < 0:',
      '            big_word = word',
      '    print("Numero più piccolo: ", small_num)',
      '    print("Numero più grande: ", big_num)',
      '    print("Parola più piccola: ", small_word)',
      '    print("Parola più grande: ", big_word)'
    ].join('\n'));
    await exercise(143,[
      'extends Node',
      'func by_length(a: String, b: String) -> bool:',
      '    if a.length() == b.length():',
      '        return a.casecmp_to(b) < 0',
      '    return a.length() < b.length()',
      'func _ready():',
      '    var numbers: Array[int] = []',
      '    for text in OS.read_string_from_stdin().split(" ", false):',
      '        numbers.append(int(text))',
      '    var words = Array(OS.read_string_from_stdin().split(" ", false))',
      '    var ascending = numbers.duplicate()',
      '    ascending.sort()',
      '    var descending = ascending.duplicate()',
      '    descending.reverse()',
      '    var alphabetical = words.duplicate()',
      '    alphabetical.sort()',
      '    var by_size = words.duplicate()',
      '    by_size.sort_custom(by_length)',
      '    print("Ascending: ", ascending)',
      '    print("Descending: ", descending)',
      '    print("Alphabetical: ", alphabetical)',
      '    print("Per lunghezza: ", by_size)'
    ].join('\n'));
    await exercise(144,[
      'func dictionary_sorter(data: Dictionary):',
      '    var keys = data.keys()',
      '    keys.sort_custom(func(a, b): return data[a] < data[b])',
      '    var ordered = {}',
      '    for key in keys:',
      '        ordered[key] = data[key]',
      '    return ordered'
    ].join('\n'));

    // Funzioni avanzate: soluzioni di riferimento testate nel Godot reale.
    const advancedSolutions=[
      [145,[
        'extends Node','func _ready():',
        '    var info = get_student_info()',
        '    var student_name = info[0]',
        '    var student_age = info[1]',
        '    var student_major = info[2]',
        '    print(student_name)','    print(student_age)','    print(student_major)',
        'func get_student_info() -> Array:',
        '    return ["Bob", 20, "Computer Scienze"]'
      ]],
      [146,[
        'extends Node','func _ready():',
        '    var a = int(OS.read_string_from_stdin())',
        '    var b = int(OS.read_string_from_stdin())',
        '    var c = int(OS.read_string_from_stdin())',
        '    var multiply = func(x, y, z): return x * y * z',
        '    print(multiply.call(a, b, c))'
      ]],
      [147,[
        'extends Node','func _ready():',
        '    var number = int(OS.read_string_from_stdin())',
        '    var categorize_number = func(n):',
        '        if n > 0: return "Positive"',
        '        if n == 0: return "Zero"',
        '        return "Negative"',
        '    print(categorize_number.call(number))'
      ]],
      [148,[
        'func sort_pairs(data: Array):',
        '    data.sort_custom(func(a, b): return (a[1] < b[1]) if a[1] != b[1] else (str(a[0]).casecmp_to(str(b[0])) < 0))',
        '    return data'
      ]],
      [149,[
        'extends Node','func _ready():',
        '    var n = int(OS.read_string_from_stdin())',
        '    count_down(n)',
        'func count_down(n):',
        '    print(n)',
        '    if n > 0: count_down(n - 1)'
      ]],
      [150,[
        'func fibonacci(n: int):',
        '    if n == 1: return 0',
        '    if n == 2: return 1',
        '    return fibonacci(n - 1) + fibonacci(n - 2)'
      ]],
      [151,[
        'func sum_nested(nested_array: Array):',
        '    var total = 0',
        '    for element in nested_array:',
        '        if element is Array:',
        '            total += sum_nested(element)',
        '        else:',
        '            total += element',
        '    return total'
      ]],
      [152,[
        'func convert_to_uppercase(strings: Array[String]):',
        '    return strings.map(func(s): return s.to_upper())'
      ]],
      [153,[
        'func get_long_strings(strings: Array[String]):',
        '    return strings.filter(func(s): return s.length() > 5)'
      ]],
      [154,[
        'extends Node','func _ready():',
        '    var numbers = []',
        '    for part in OS.read_string_from_stdin().split(","):',
        '        numbers.append(int(part))',
        '    print(numbers.reduce(func(acc, n): return acc + n, 0))',
        '    print(numbers.reduce(func(acc, n): return acc * n, 1))',
        '    print(numbers.reduce(func(acc, n): return n if n > acc else acc, numbers[0]))'
      ]],
      [155,[
        'extends Node','func _ready():',
        '    var numbers = []',
        '    for part in OS.read_string_from_stdin().split(","):',
        '        numbers.append(int(part))',
        '    print("Almeno uno perfetto: ", numbers.any(func(n): return n == 100))',
        '    print("Tutti promossi: ", numbers.all(func(n): return n >= 50))'
      ]],
      [156,[
        'func clean_email_list(emails: Array[String]):',
        '    var cleaned = emails.map(func(email): return email.strip_edges().to_lower())',
        '    return cleaned.filter(func(email): return email.count("@") == 1 and email.find("@") > 0 and email.find("@") < email.length() - 1)'
      ]],
      [157,[
        'func process_numbers(numbers: Array[int]):',
        '    return numbers.filter(func(n): return n > 0).map(func(n): return n * 2 if n % 2 == 0 else n * 3)'
      ]]
    ];
    for(const [n,lines] of advancedSolutions){
      if(n===149){
        const cases=await page.evaluate(()=>GDHManualVerifier.expectedCases[149]);
        assert.equal(cases[2].output,'3\n2\n1\n0');
      }
      await exercise(n,lines.join('\n'));
    }
    // Il primo valore utile non basta: un programma statico non deve
    // superare l'intero blocco di prove alternative.
    for(const n of [146,147,149,154,155]){
      const fraudulent=await page.evaluate(async number=>
        GDHManualVerifier.verify(10000+number,
          'extends Node\nfunc _ready():\n    print("Positive")',
          (source,options)=>GDHGodot.runNative(source,options)),n);
      assert.equal(fraudulent.accepted,false,'Scorciatoia accettata alla lezione '+n);
    }

    const errorHandlingSolutions=[
      [158,[
        'extends Node','func _ready():',
        '    var inventory = ["spada", "scudo", "pozione", "arco"]',
        '    var slot = int(OS.read_string_from_stdin())',
        '    if slot >= 0 and slot < inventory.size():',
        '        print("Slot ", slot, ": ", inventory[slot])',
        '    else:',
        '        print("La posizione ", slot, " è vuota")'
      ]],
      [159,[
        'extends Node','func _ready():',
        '    var user_input = OS.read_string_from_stdin()',
        '    if user_input.is_valid_int():',
        '        print("Hai inserito: ", int(user_input))',
        '    else:',
        '        print("Input non valido! Inserisci un numero valido.")'
      ]],
      [160,[
        'func process_data(text: String):',
        '    if not text.is_valid_int():',
        '        return "Il valore deve essere un numero!"',
        '    var number = int(text)',
        '    if number == 0:',
        '        return "Impossibile dividere per zero!"',
        '    return "%.2f" % (100.0 / number)'
      ]],
      [161,[
        'extends Node',
        'func parse_level(text: String) -> Dictionary:',
        '    if not text.is_valid_int():',
        '        return {"ok": false, "error": "Valore non numerico"}',
        '    var level = int(text)',
        '    if level < 1 or level > 99:',
        '        return {"ok": false, "error": "Il livello deve essere compreso tra 1 e 99"}',
        '    return {"ok": true, "value": level}',
        'func _ready():',
        '    var text = OS.read_string_from_stdin()',
        '    var result = parse_level(text)',
        '    if result["ok"]:',
        '        print("Livello impostato a ", result["value"])',
        '    else:',
        '        print("Errore: ", result["error"])'
      ]],
      [162,[
        'extends Node',
        'func safe_divide(a: float, b: float) -> Dictionary:',
        '    if b == 0.0:',
        '        return {"ok": false, "error": "Impossibile dividere per zero"}',
        '    return {"ok": true, "value": a / b}',
        'func _ready():',
        '    var first = OS.read_string_from_stdin()',
        '    var second = OS.read_string_from_stdin()',
        '    if not first.is_valid_float() or not second.is_valid_float():',
        '        print("Errore: numero non valido")',
        '        return',
        '    var result = safe_divide(float(first), float(second))',
        '    if result["ok"]:',
        '        print("Risultato della divisione: %.2f" % result["value"])',
        '    else:',
        '        print("Errore: ", result["error"])'
      ]]
    ];
    for(const [n,lines] of errorHandlingSolutions)
      await exercise(n,lines.join('\n'));

    // Ogni step dell'inventario eredita quanto già realizzato, non la
    // propria soluzione. Il passo successivo è un riferimento positivo.
    for(let n=163;n<=166;n++){
      const solved=await page.evaluate(next=>
        LESSONS_DATA.find(l=>l.manualLessonNumber===next).initialCode,n+1);
      await exercise(n,solved);
    }
    let inventorySolved=await page.evaluate(()=>
      LESSONS_DATA.find(l=>l.manualLessonNumber===167).initialCode);
    inventorySolved=inventorySolved.replace(
      '        # Implementa qui il ramo del nuovo comando della lezione.',
      [
        '        elif command == "vendi":',
        '            var sales = {}',
        '            for i in range(1, parts.size()):',
        '                var fields = parts[i].split(":")',
        '                if fields.size() != 2 or fields[0].is_empty() or not fields[1].is_valid_int():',
        '                    print("Errore: vendita non valida \x27%s\x27." % parts[i])',
        '                    continue',
        '                sales[fields[0]] = int(fields[1])',
        '            print(sales_report(inventory, sales))'
      ].join('\n')
    )+'\n'+[
      'func sales_report(inventory: Dictionary, sales: Dictionary) -> String:',
      '    var revenue = 0.0',
      '    for item in sales:',
      '        if not inventory.has(item):',
      '            print("Errore: articolo \x27%s\x27 non trovato." % item)',
      '            continue',
      '        var qty = sales[item]',
      '        if inventory[item]["stock"] < qty:',
      '            print("Errore: scorte insufficienti per \x27%s\x27." % item)',
      '            continue',
      '        inventory[item]["stock"] -= qty',
      '        revenue += inventory[item]["price"] * qty',
      '    return "Ricavo totale: %.2f" % revenue'
    ].join('\n');
    await exercise(167,inventorySolved);
    await exercise(168,[
      'extends Node','func _ready():',
      '    var n = int(OS.read_string_from_stdin())',
      '    var emails = {}',
      '    var phones = {}',
      '    var count = 0',
      '    for i in range(n):',
      '        var parts = OS.read_string_from_stdin().split(",")',
      '        var name = parts[0]',
      '        var email = parts[1].to_lower()',
      '        var phone = ""',
      '        for digit in parts[2]:',
      '            if "0123456789".contains(digit):',
      '                phone += digit',
      '        if not email.contains("@") or not email.contains(".") or email.contains(" "):',
      '            continue',
      '        if phone.length() != 10 or emails.has(email) or phones.has(phone):',
      '            continue',
      '        emails[email] = true',
      '        phones[phone] = true',
      '        count += 1',
      '        print(name, " | ", email, " | ", phone)',
      '    print("Contatti conservati: ", count, " su ", n)'
    ].join('\n'));
    await exercise(169,[
      'extends Node',
      'func analyze_text(text: String):',
      '    var content = text.to_lower()',
      '    for punctuation in [".", ",", "!", "?", ":", ";", "\\\"", "(", ")"]:',
      '        content = content.replace(punctuation, "")',
      '    var counts = {}',
      '    for word in content.split(" ", false):',
      '        counts[word] = counts.get(word, 0) + 1',
      '    var repeated = []',
      '    var palindromes = []',
      '    for word in counts:',
      '        if counts[word] > 1:',
      '            repeated.append(word)',
      '        var reverse = ""',
      '        for i in range(word.length()-1, -1, -1):',
      '            reverse += word.substr(i, 1)',
      '        if reverse == word:',
      '            palindromes.append(word)',
      '    repeated.sort()',
      '    palindromes.sort()',
      '    return {"unique_count": counts.size(),',
      '        "repeated_words": repeated, "palindromes": palindromes}',
      'func _ready():',
      '    var text = OS.read_string_from_stdin()',
      '    print(analyze_text(text))'
    ].join('\n'));
    await exercise(170,[
      'extends Node',
      'func _ready():',
      '    var n = int(OS.read_string_from_stdin())',
      '    var admitted = []',
      '    var subjects = {}',
      '    for i in range(n):',
      '        var fields = OS.read_string_from_stdin().split(";")',
      '        var grades = []',
      '        for text in fields[1].split(","):',
      '            grades.append(int(text))',
      '        if not grades.all(func(grade): return grade > 70):',
      '            continue',
      '        var total = 0',
      '        for grade in grades:',
      '            total += grade',
      '        admitted.append("%s: %.2f" % [fields[0], float(total) / grades.size()])',
      '        for subject in fields[2].split(","):',
      '            subjects[subject] = subjects.get(subject, 0) + 1',
      '    print("Studenti idonei: ", admitted.size())',
      '    for item in admitted:',
      '        print(item)',
      '    print("Materie:")',
      '    for subject in subjects:',
      '        print(subject, ": ", subjects[subject])'
    ].join('\n'));
    for(const n of [163,167,168,169,170]){
      const fake=await page.evaluate(number=>
        GDHManualVerifier.verify(10000+number,
          'extends Node\nfunc _ready():\n    print("Arrivederci!")',
          (code,opts)=>GDHGodot.runNative(code,opts)),n);
      assert.equal(fake.accepted,false,'Una stampa fissa non deve superare '+n);
    }

    // Esercizi OOP: ogni classe viene compilata dal motore Godot,
    // senza consentire l'editing di main.gd e con test su input alternativi.
    const oopSolutions=[
      [171,[
        'class_name Greeter','extends RefCounted','',
        'static func greet(player_name: String) -> String:',
        '    if player_name.is_empty():',
        '        return "Ciao, friend!"',
        '    return "Ciao, %s!" % player_name'
      ]],
      [172,[
        'class_name Car','extends RefCounted','',
        'var brand: String = "Generic"',
        'var ruote: int = 4'
      ]],
      [173,[
        'class_name Student','extends RefCounted','',
        'const SCHOOL = "Godot High School"',
        'var student_name: String',
        'var grade: String = "N/A"'
      ]],
      [174,[
        'class_name Car','extends RefCounted',
        'var year: int = 0','var make: String = ""','var model: String = ""',
        'func set_info(year: int, make: String, model: String) -> void:',
        '    self.year = year',
        '    self.make = make',
        '    self.model = model',
        'func describe() -> String:',
        '    return "Questa auto è una %d %s %s" % [year, make, model]'
      ]],
      [175,[
        'class_name BankAccount','extends RefCounted',
        'var balance: int = 0',
        'func deposit(amount: int) -> void:',
        '    balance += amount',
        'func withdraw(amount: int) -> bool:',
        '    if amount > balance:',
        '        return false',
        '    balance -= amount',
        '    return true',
        'func get_balance() -> int:',
        '    return balance'
      ]]
    ];
    for(const [n,lines] of oopSolutions){
      await page.evaluate(id=>App.openLesson(id),10000+n);
      const file=await page.locator('.manual-file-tab.is-active').innerText();
      assert.notEqual(file,'main.gd','La lezione si deve aprire sul file da scrivere');
      assert.equal(await page.locator('#code-editor').getAttribute('readonly'),null);
      await exercise(n,lines.join('\n'));
      // Il progetto fornito è conservato separatamente e non può essere
      // riscritto in modo invisibile dal file dell'allievo.
      await page.locator('.manual-file-tab',{hasText:'main.gd'}).click();
      assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'');
    }
    const amended=await page.evaluate(()=>{
      const lesson=LESSONS_DATA.find(l=>l.manualLessonNumber===171);
      const corrupt={...GDHManualStudio.getDraft(lesson).files,
        'main.gd':'extends Node\nfunc _ready():\n    print("barare")'};
      try{GDHManualProject.build(lesson,corrupt);return false;}
      catch(error){return /modificato/.test(error.message);}
    });
    assert.equal(amended,true,'Il main.gd fornito non deve essere modificabile');
    const insufficient=await page.evaluate(async()=>{
      App.openLesson(10171);
      // Dopo la prova sui file di sola lettura era selezionato main.gd:
      // scegliere esplicitamente il file modificabile della classe.
      const tab=[...document.querySelectorAll('.manual-file-tab')].find(x=>x.textContent==='greeter.gd');
      tab.click();
      const editor=document.getElementById('code-editor');
      editor.value='class_name Greeter\nextends RefCounted\nstatic func greet(player_name: String) -> String:\n    return "Ciao, Ada!"';
      const result=await GDHManualVerifier.verify(10171,editor.value,
        (code,options)=>GDHGodot.runNative(code,options));
      return result.accepted;
    });
    assert.equal(insufficient,false,'L’output fisso non supera il caso del nome vuoto');

    // Proprietà, constructor e static: classi separate verificate in Godot.
    const propertySolutions=[
      [176,[
        'class_name Player','extends RefCounted',
        'var player_name: String = "Eroe"',
        'var level: int = 1',
        'var hp: int = 100',
        'var inventory: Array[String] = []',
        'func describe() -> String:',
        '    var items = ", ".join(inventory) if not inventory.is_empty() else "nessun oggetto"',
        '    return "%s (livello %d, %d PS): %s" % [player_name, level, hp, items]'
      ]],
      [177,[
        'class_name Book','extends RefCounted',
        'var title: String','var author: String','var pages: int',
        'func _init(book_title: String, book_author: String, page_count: int) -> void:',
        '    title = book_title','    author = book_author','    pages = page_count',
        'func describe() -> String:',
        '    return "\x27%s\x27 di %s, %d pagine" % [title, author, pages]'
      ]],
      [178,[
        'class_name Calculator','extends RefCounted',
        'var result: float = 0.0',
        'func add(number: float) -> float:',
        '    result += number',
        '    return result',
        'func subtract(number: float) -> float:',
        '    result -= number',
        '    return result',
        'func multiply(number: float) -> float:',
        '    result *= number',
        '    return result',
        'func divide(number: float) -> float:',
        '    if number == 0.0:',
        '        print("Errore: divisione per zero")',
        '        return result',
        '    result /= number',
        '    return result',
        'func clear() -> float:',
        '    result = 0.0',
        '    return result',
        'func get_result() -> float:',
        '    return result'
      ]],
      [179,[
        'class_name BankAccount','extends RefCounted',
        'static var interest_percent: int = 2',
        'static var account_count: int = 0',
        'var holder: String','var balance: int',
        'func _init(account_holder: String, start_balance: int) -> void:',
        '    holder = account_holder',
        '    balance = start_balance',
        '    BankAccount.account_count += 1',
        'func describe() -> String:',
        '    return "%s: $%d at %d%%" % [holder, balance, BankAccount.interest_percent]'
      ]]
    ];
    for(const [n,lines] of propertySolutions)
      await exercise(n,lines.join('\n'));
    await page.evaluate(()=>App.openLesson(10180));
    await page.locator('.manual-file-tab',{hasText:'grader.gd'}).click();
    await page.locator('#code-editor').fill([
      'class_name Grader','extends RefCounted',
      'static func letter(points: int) -> String:',
      '    if points >= 90: return "A"',
      '    if points >= 80: return "B"',
      '    if points >= 70: return "C"',
      '    if points >= 60: return "D"',
      '    return "F"',
      'static func is_passing(points: int) -> bool:',
      '    return points >= 60'
    ].join('\n'));
    await page.locator('.manual-file-tab',{hasText:'student.gd'}).click();
    await page.locator('#code-editor').fill([
      'class_name Student','extends RefCounted',
      'var student_name: String','var score: int',
      'func _init(new_name: String, new_score: int) -> void:',
      '    student_name = new_name',
      '    score = new_score',
      'static func from_line(line: String) -> Student:',
      '    var parts = line.split(" ")',
      '    return Student.new(parts[0], int(parts[1]))',
      'func report() -> String:',
      '    var status = "promosso" if Grader.is_passing(score) else "non promosso"',
      '    return "%s: %d (%s), %s" % [student_name, score, Grader.letter(score), status]'
    ].join('\n'));
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>!App.isValidating,null,{timeout:60000});
    const multiple=await page.evaluate(()=>({
      finished:App.state.finishedLessons.includes(10180),
      text:document.getElementById('real-output-pre')?.textContent,
      error:document.getElementById('validation-result')?.textContent
    }));
    assert.equal(multiple.finished,true,'Lezione 180 rifiutata: '+JSON.stringify(multiple));

    const encapsulationSolutions=[
      [181,[
        'class_name Player','extends RefCounted',
        'var max_health: int = 100',
        'var health: int = 100:',
        '    set(value):',
        '        var previous = health',
        '        health = clampi(value, 0, max_health)',
        '        if health == 0 and previous > 0:',
        '            print("Il giocatore è stato sconfitto!")'
      ]],
      [182,[
        'class_name Temperature','extends RefCounted',
        'var celsius: float = 0.0',
        'var fahrenheit: float:',
        '    get:',
        '        return celsius * 9.0 / 5.0 + 32.0',
        '    set(value):',
        '        celsius = (value - 32.0) * 5.0 / 9.0',
        'var kelvin: float:',
        '    get:',
        '        return celsius + 273.15'
      ]],
      [183,[
        'class_name User','extends RefCounted',
        'var _password: String',
        'func _init(start_password: String) -> void:',
        '    _password = start_password',
        'func check_password(attempt: String) -> bool:',
        '    return attempt == _password',
        'func change_password(old_password: String, new_password: String) -> bool:',
        '    if not check_password(old_password) or not _is_strong(new_password):',
        '        return false',
        '    _password = new_password',
        '    return true',
        'func _is_strong(candidate: String) -> bool:',
        '    return candidate.length() >= 6'
      ]],
      [184,[
        'class_name BankAccount','extends RefCounted',
        'static var interest_percent: int = 2',
        'var _owner_name: String',
        'var _balance: int = 0',
        'var owner_name: String:',
        '    get:',
        '        return _owner_name',
        'var balance: int:',
        '    get:',
        '        return _balance',
        '    set(value):',
        '        if value < 0:',
        '            print("Il saldo non può essere negativo")',
        '            return',
        '        _balance = value',
        'func _init(account_owner: String, start_balance: int) -> void:',
        '    _owner_name = account_owner',
        '    balance = start_balance',
        'func deposit(amount: int) -> bool:',
        '    if amount <= 0:',
        '        print("L\x27importo del deposito deve essere positivo")',
        '        return false',
        '    balance += amount',
        '    return true',
        'func withdraw(amount: int) -> bool:',
        '    if amount <= 0:',
        '        print("L\x27importo del prelievo deve essere positivo")',
        '        return false',
        '    if amount > balance:',
        '        print("Fondi insufficienti")',
        '        return false',
        '    balance -= amount',
        '    return true',
        'func apply_interest() -> int:',
        '    var interest = int(float(_balance) * interest_percent / 100.0)',
        '    balance += interest',
        '    return interest',
        'func display_info() -> void:',
        '    print("Titolare del conto: ", owner_name)',
        '    print("Saldo: $", balance)',
        '    print("Tasso di interesse: ", interest_percent, "%")'
      ]]
    ];
    for(const [n,lines] of encapsulationSolutions)
      await exercise(n,lines.join('\n'));

    // Ereditarietà: due classi in due schede modificabili, compilate e
    // istanziate dal Godot reale, senza modificare main.gd.
    await page.evaluate(()=>App.openLesson(10185));
    await page.locator('.manual-file-tab',{hasText:'vehicle.gd'}).click();
    await page.locator('#code-editor').fill([
      'class_name Vehicle','extends RefCounted',
      'var brand: String','var model: String',
      'func _init(b: String, m: String) -> void:',
      '    brand = b','    model = m',
      'func info() -> String:',
      '    return "Veicolo: %s %s" % [brand, model]'
    ].join('\n'));
    await page.locator('.manual-file-tab',{hasText:'car.gd'}).click();
    await page.locator('#code-editor').fill([
      'class_name Car','extends Vehicle',
      'func honk() -> String:',
      '    return "%s %s fa Bip bip!" % [brand, model]'
    ].join('\n'));
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>!App.isValidating,null,{timeout:60000});
    const inherited=await page.evaluate(()=>({
      finished:App.state.finishedLessons.includes(10185),
      output:document.getElementById('real-output-pre')?.textContent,
      error:document.getElementById('validation-result')?.textContent
    }));
    assert.equal(inherited.finished,true,'Lezione 185 rifiutata: '+JSON.stringify(inherited));
    await page.evaluate(()=>App.openLesson(10186));
    await page.locator('.manual-file-tab',{hasText:'person.gd'}).click();
    await page.locator('#code-editor').fill([
      'class_name Person','extends RefCounted',
      'var person_name: String','var age: int',
      'func _init(n: String, a: int) -> void:',
      '    person_name = n','    age = a',
      'func introduce() -> String:',
      '    return "Ciao, sono %s e ho %d anni" % [person_name, age]'
    ].join('\n'));
    await page.locator('.manual-file-tab',{hasText:'employee.gd'}).click();
    await page.locator('#code-editor').fill([
      'class_name Employee','extends Person',
      'var job: String',
      'func _init(n: String, a: int, j: String) -> void:',
      '    super(n, a)',
      '    job = j',
      'func introduce() -> String:',
      '    return super.introduce() + ". Lavoro come " + job'
    ].join('\n'));
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>!App.isValidating,null,{timeout:60000});
    const superResult=await page.evaluate(()=>({
      finished:App.state.finishedLessons.includes(10186),
      output:document.getElementById('real-output-pre')?.textContent,
      error:document.getElementById('validation-result')?.textContent
    }));
    assert.equal(superResult.finished,true,'Lezione 186 rifiutata: '+JSON.stringify(superResult));

    // OOP 187-190: ereditarietà profonda, override ed array polimorfici.
    const completeProject=async(number,files)=>{
      await page.evaluate(id=>App.openLesson(id),10000+number);
      for(const [name,lines] of Object.entries(files)){
        await page.getByRole('tab',{name,exact:true}).click();
        assert.equal(await page.locator('#code-editor').getAttribute('readonly'),null,
          'File modificabile inaspettatamente protetto: '+name);
        await page.locator('#code-editor').fill(lines.join('\n'));
      }
      await page.locator('#btn-run-code').click();
      await page.waitForFunction(()=>!App.isValidating,null,{timeout:60000});
      const verdict=await page.evaluate(id=>({
        finished:App.state.finishedLessons.includes(id),
        output:document.getElementById('real-output-pre')?.textContent,
        error:document.getElementById('validation-result')?.textContent
      }),10000+number);
      assert.equal(verdict.finished,true,'Lezione '+number+' rifiutata: '+JSON.stringify(verdict));
    };
    await completeProject(187,{
      'circle.gd':[
        'class_name Circle','extends Shape',
        'var radius: int',
        'func _init(c: String, r: int) -> void:',
        '    super(c)',
        '    radius = r',
        'func area() -> float:',
        '    return PI * radius * radius',
        'func describe() -> String:',
        '    return "Questo è un %s circle with radius %d" % [color, radius]'
      ],
      'square.gd':[
        'class_name Square','extends Shape',
        'var side: int',
        'func _init(c: String, s: int) -> void:',
        '    super(c)',
        '    side = s',
        'func area() -> float:',
        '    return float(side * side)',
        'func describe() -> String:',
        '    return "Questo è un %s square with side %d" % [color, side]'
      ]
    });
    await page.locator('.manual-file-tab',{hasText:'shape.gd'}).click();
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'',
      'La classe Shape del corso non si deve modificare');
    await completeProject(188,{
      'warrior.gd':[
        'class_name Warrior','extends Character',
        'var strength: int',
        'func _init(n: String, h: int, s: int) -> void:',
        '    super(n, h)',
        '    strength = s',
        'func describe() -> String:',
        '    return super.describe() + ", strength %d" % strength',
        'func attack() -> int:',
        '    return strength'
      ],
      'knight.gd':[
        'class_name Knight','extends Warrior',
        'var armor: int',
        'func _init(n: String, h: int, s: int, a: int) -> void:',
        '    super(n, h, s)',
        '    armor = a',
        'func describe() -> String:',
        '    return super.describe() + ", armor %d" % armor',
        'func attack() -> int:',
        '    return super.attack() + 5'
      ]
    });
    await completeProject(189,{
      'zoo.gd':[
        'class_name Zoo','extends RefCounted',
        'static func describe(a: Animal) -> String:',
        '    if a is Penguin:',
        '        return a.animal_name + " swims"',
        '    if a is Bird:',
        '        return "%s flies (wingspan %d cm)" % [a.animal_name, a.wingspan]',
        '    return a.animal_name + " walks"',
        'static func count_birds(animals: Array[Animal]) -> int:',
        '    var count = 0',
        '    for a in animals:',
        '        if a is Bird:',
        '            count += 1',
        '    return count'
      ]
    });
    for(const file of ['animal.gd','bird.gd','penguin.gd']){
      await page.locator('.manual-file-tab',{hasText:file}).click();
      assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'',
        'File di supporto modificabile: '+file);
    }
    await completeProject(190,{
      'person.gd':[
        'class_name Person','extends RefCounted',
        'var person_name: String','var age: int',
        'func _init(n: String, a: int) -> void:',
        '    person_name = n',
        '    age = a',
        'func introduce() -> String:',
        '    return "Ciao, sono %s, %d anni" % [person_name, age]'
      ],
      'employee.gd':[
        'class_name Employee','extends Person',
        'var employee_id: String','var salary: int',
        'func _init(n: String, a: int, id: String, s: int) -> void:',
        '    super(n, a)',
        '    employee_id = id',
        '    salary = s',
        'func introduce() -> String:',
        '    return super.introduce() + ". My employee ID is " + employee_id + "."',
        'func monthly_pay() -> float:',
        '    return salary / 12.0'
      ],
      'manager.gd':[
        'class_name Manager','extends Employee',
        'var department: String',
        'func _init(n: String, a: int, id: String, s: int, d: String) -> void:',
        '    super(n, a, id, s)',
        '    department = d',
        'func monthly_pay() -> float:',
        '    return super.monthly_pay() * 1.2',
        'func manage_team() -> String:',
        '    return "Managing the %s department." % department'
      ],
      'engineer.gd':[
        'class_name Engineer','extends Employee',
        'var language: String',
        'func _init(n: String, a: int, id: String, s: int, l: String) -> void:',
        '    super(n, a, id, s)',
        '    language = l',
        'func code() -> String:',
        '    return "Coding in %s." % language'
      ],
      'payroll.gd':[
        'class_name Payroll','extends RefCounted',
        'static func role(p: Person) -> String:',
        '    if p is Manager: return "Manager"',
        '    if p is Engineer: return "Engineer"',
        '    if p is Employee: return "Employee"',
        '    return "Person"',
        'static func total_monthly(people: Array[Person]) -> float:',
        '    var total = 0.0',
        '    for p in people:',
        '        if p is Employee:',
        '            total += p.monthly_pay()',
        '    return total'
      ]
    });
    // Un risultato statico non supera gli input alternativi né i tipi.
    const wrongZoo=await page.evaluate(async()=>{
      App.openLesson(10189);
      const tab=[...document.querySelectorAll('.manual-file-tab')].find(x=>x.textContent==='zoo.gd');
      tab.click();
      document.getElementById('code-editor').value=[
        'class_name Zoo','extends RefCounted',
        'static func describe(a: Animal) -> String:',
        '    return a.animal_name + " flies (wingspan 30 cm)"',
        'static func count_birds(animals: Array[Animal]) -> int:',
        '    return 2'
      ].join('\n');
      const checked=await GDHManualVerifier.verify(10189,
        document.getElementById('code-editor').value,
        (code,options)=>GDHGodot.runNative(code,options));
      return checked.accepted;
    });
    assert.equal(wrongZoo,false,'La risposta fissa dello zoo non deve superare la prova');

    // Ripasso override (191) e duck typing (192): i driver e le classi
    // di supporto del corso non possono essere modificati dallo studente.
    await completeProject(191,{
      'vehicle.gd':[
        'class_name Vehicle','extends RefCounted',
        'var brand: String',
        'func _init(b: String) -> void:',
        '    brand = b',
        'func wheels() -> int:',
        '    return 0',
        'func sound() -> String:',
        '    return "..."',
        'func describe() -> String:',
        '    return "%s: %d ruote, %s" % [brand, wheels(), sound()]'
      ],
      'car.gd':[
        'class_name Car','extends Vehicle',
        'func wheels() -> int:',
        '    return 4',
        'func sound() -> String:',
        '    return "Vroom"'
      ],
      'motorcycle.gd':[
        'class_name Motorcycle','extends Vehicle',
        'func wheels() -> int:',
        '    return 2',
        'func sound() -> String:',
        '    return "Brrm"'
      ],
      'truck.gd':[
        'class_name Truck','extends Vehicle',
        'var trailers: int',
        'func _init(b: String, t: int) -> void:',
        '    super(b)',
        '    trailers = t',
        'func wheels() -> int:',
        '    return 6 + trailers * 4',
        'func sound() -> String:',
        '    return "Honk"'
      ]
    });
    await completeProject(192,{
      'crate.gd':[
        'class_name Crate','extends RefCounted',
        'var broken: bool = false',
        'func take_damage(amount: int) -> void:',
        '    if amount >= 10:',
        '        broken = true',
        'func status() -> String:',
        '    return "Cassa: distrutta" if broken else "Cassa: intatta"'
      ],
      'explosion.gd':[
        'class_name Explosion','extends RefCounted',
        'static func hit_all(things: Array, amount: int) -> int:',
        '    var hits = 0',
        '    for thing in things:',
        '        if thing.has_method("take_damage"):',
        '            thing.call("take_damage", amount)',
        '            hits += 1',
        '    return hits'
      ]
    });
    for(const protectedFile of ['player.gd','rock.gd','main.gd']){
      await page.locator('.manual-file-tab',{hasText:protectedFile}).click();
      assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'',
        'Classe fornita modificabile: '+protectedFile);
    }

    // Il runtime WebAssembly deve essere stato realmente aggiornato.
    // L'annotazione @abstract non viene sostituita da JavaScript.
    const engineVersion=await page.evaluate(async()=>{
      const run=await GDHGodot.runNative(
        'extends Node\nfunc _ready():\n    print(Engine.get_version_info().string)');
      return {status:run.status,stdout:run.stdout,stderr:run.stderr};
    });
    assert.equal(engineVersion.status,'executed',
      'Godot 4.5.1 non si avvia: '+JSON.stringify(engineVersion));
    assert.match(engineVersion.stdout,/4\.5\.1/,
      'La PR deve usare il nuovo runtime, non Godot 4.4');

    await completeProject(193,{
      'payment_method.gd':[
        '@abstract',
        'class_name PaymentMethod','extends RefCounted',
        'var amount: float',
        'func _init(a: float) -> void:',
        '    amount = a',
        '@abstract func fee() -> float',
        '@abstract func method_name() -> String',
        'func receipt() -> String:',
        '    var commission = fee()',
        '    return "%s: pagati %.2f, commissioni %.2f, totale %.2f" % [',
        '        method_name(), amount, commission, amount + commission]'
      ],
      'credit_card.gd':[
        'class_name CreditCard','extends PaymentMethod',
        'func fee() -> float:',
        '    return amount * 0.03',
        'func method_name() -> String:',
        '    return "Carta di credito"'
      ],
      'bank_transfer.gd':[
        'class_name BankTransfer','extends PaymentMethod',
        'func fee() -> float:',
        '    return 0.0 if amount >= 100.0 else 1.5',
        'func method_name() -> String:',
        '    return "Bonifico"'
      ]
    });
    await completeProject(194,{
      'playable.gd':[
        '@abstract',
        'class_name Playable','extends RefCounted',
        '@abstract func play() -> String',
        '@abstract func duration() -> int'
      ],
      'song.gd':[
        'class_name Song','extends Playable',
        'var title: String','var artist: String','var seconds: int',
        'func _init(t: String, a: String, s: int) -> void:',
        '    title = t',
        '    artist = a',
        '    seconds = s',
        'func play() -> String:',
        '    return "Riproduzione brano: %s di %s" % [title, artist]',
        'func duration() -> int:',
        '    return seconds'
      ],
      'video.gd':[
        'class_name Video','extends Playable',
        'var title: String','var resolution: int','var seconds: int',
        'func _init(t: String, r: int, s: int) -> void:',
        '    title = t',
        '    resolution = r',
        '    seconds = s',
        'func play() -> String:',
        '    return "Riproduzione video: %s in %dp" % [title, resolution]',
        'func duration() -> int:',
        '    return seconds'
      ],
      'playlist.gd':[
        'class_name Playlist','extends RefCounted',
        'var items: Array[Playable] = []',
        'func add(item: Playable) -> void:',
        '    items.append(item)',
        'func play_all() -> void:',
        '    for item in items:',
        '        print(item.play())',
        'func total_time() -> String:',
        '    var total = 0',
        '    for item in items:',
        '        total += item.duration()',
        '    return "%d:%02d" % [int(total / 60), total % 60]'
      ]
    });
    await completeProject(195,{
      'shape.gd':[
        '@abstract',
        'class_name Shape','extends RefCounted',
        '@abstract func area() -> float',
        '@abstract func perimeter() -> float',
        '@abstract func shape_name() -> String',
        'func describe() -> String:',
        '    return "%s: area %.2f, perimetro %.2f" % [',
        '        shape_name(), area(), perimeter()]'
      ],
      'circle.gd':[
        'class_name Circle','extends Shape',
        'var radius: float',
        'func _init(r: float) -> void:',
        '    radius = r',
        'func area() -> float:',
        '    return PI * radius * radius',
        'func perimeter() -> float:',
        '    return 2.0 * PI * radius',
        'func shape_name() -> String:',
        '    return "Cerchio"'
      ],
      'rectangle.gd':[
        'class_name Rectangle','extends Shape',
        'var width: float','var height: float',
        'func _init(w: float, h: float) -> void:',
        '    width = w',
        '    height = h',
        'func area() -> float:',
        '    return width * height',
        'func perimeter() -> float:',
        '    return 2.0 * (width + height)',
        'func shape_name() -> String:',
        '    return "Rettangolo"'
      ],
      'triangle.gd':[
        'class_name Triangle','extends Shape',
        'var a: float','var b: float','var c: float',
        'func _init(side_a: float, side_b: float, side_c: float) -> void:',
        '    a = side_a',
        '    b = side_b',
        '    c = side_c',
        'func area() -> float:',
        '    var semi = (a + b + c) / 2.0',
        '    return sqrt(maxf(0.0, semi * (semi-a) * (semi-b) * (semi-c)))',
        'func perimeter() -> float:',
        '    return a + b + c',
        'func shape_name() -> String:',
        '    return "Triangolo"'
      ],
      'custom_shape.gd':[
        'class_name CustomShape','extends RefCounted',
        'var custom_name: String','var size: float',
        'func _init(n: String, s: float) -> void:',
        '    custom_name = n',
        '    size = s',
        'func area() -> float:',
        '    return size * size',
        'func perimeter() -> float:',
        '    return 4.0 * size',
        'func describe() -> String:',
        '    return "%s: area %.2f, perimetro %.2f" % [',
        '        custom_name, area(), perimeter()]'
      ],
      'shape_calculator.gd':[
        'class_name ShapeCalculator','extends RefCounted',
        'static func process(thing) -> String:',
        '    if thing is Shape:',
        '        return "[Forma] " + thing.describe()',
        '    if thing.has_method("describe"):',
        '        return "[Compatibile] " + thing.call("describe")',
        '    return "Impossibile misurare questo oggetto"',
        'static func total_area(things: Array) -> float:',
        '    var total = 0.0',
        '    for thing in things:',
        '        if thing.has_method("area"):',
        '            total += thing.call("area")',
        '    return total'
      ]
    });
    for(const n of [193,194,195]){
      const l=await page.evaluate(num=>LESSONS_DATA.find(x=>x.manualLessonNumber===num),n);
      assert.equal(l.validationReady,true,
        'Non dichiarare pronte lezioni senza validazione native: '+n);
    }

    // 196: progressi e salti di livello; i nomi delle funzioni sono parte
    // della consegna e il calcolo è verificato con XP non fissi.
    await completeProject(196,{
      'hero.gd':[
        'class_name Hero','extends RefCounted',
        'var hero_name: String',
        'var _xp: int = 0',
        'var _level: int = 1',
        'func _init(new_name: String) -> void:',
        '    hero_name = new_name',
        'func gain_xp(amount: int) -> bool:',
        '    var previous = _level',
        '    _xp += amount',
        '    _update_level()',
        '    return _level > previous',
        'func get_xp() -> int:',
        '    return _xp',
        'func get_level() -> int:',
        '    return _level',
        'func _update_level() -> void:',
        '    _level = 1 + int(_xp / 100)'
      ]
    });
    // 197: i setter devono rifiutare valori fuori intervallo e
    // cancellare l'errore al prossimo comando valido.
    await completeProject(197,{
      'thermostat.gd':[
        'class_name Thermostat','extends RefCounted',
        'var last_error: String = ""',
        'var target: int = 20:',
        '    set(value):',
        '        if value < 10 or value > 30:',
        '            last_error = "Target must be between 10 and 30"',
        '        else:',
        '            target = value',
        '            last_error = ""',
        'var mode: String = "off":',
        '    set(value):',
        '        if value not in ["heat", "cool", "off"]:',
        '            last_error = "Sconosciuto mode: " + value',
        '        else:',
        '            mode = value',
        '            last_error = ""',
        'func _init(start_target: int) -> void:',
        '    target = start_target'
      ]
    });
    // 198: l'array restituito deve essere una copia, altrimenti
    // lo script fornito aggiunge Intruder e inverte l'ordine.
    await completeProject(198,{
      'playlist.gd':[
        'class_name Playlist','extends RefCounted',
        'var _songs: Array[String] = []',
        'func add(title: String) -> bool:',
        '    if title in _songs:',
        '        return false',
        '    _songs.append(title)',
        '    return true',
        'func remove(title: String) -> bool:',
        '    if title not in _songs:',
        '        return false',
        '    _songs.erase(title)',
        '    return true',
        'func count() -> int:',
        '    return _songs.size()',
        'func get_titles() -> Array[String]:',
        '    return _songs.duplicate()'
      ]
    });
    // 199: quattro proprietà calcolate con blocco get.
    await completeProject(199,{
      'order.gd':[
        'class_name Order','extends RefCounted',
        'var _id: int',
        'var _line_totals: Array[int] = []',
        'var order_id: int:',
        '    get:',
        '        return _id',
        'var subtotal: int:',
        '    get:',
        '        var result = 0',
        '        for row in _line_totals:',
        '            result += row',
        '        return result',
        'var shipping: int:',
        '    get:',
        '        return 0 if subtotal >= 50 else 5',
        'var total: int:',
        '    get:',
        '        return subtotal + shipping',
        'func _init(id: int) -> void:',
        '    _id = id',
        'func add_item(price: int, quantity: int) -> void:',
        '    _line_totals.append(price * quantity)'
      ]
    });
    // 200: due classi indipendenti per studenti e registro,
    // incluso l'ordine di inserimento e gli spareggi.
    await completeProject(200,{
      'student.gd':[
        'class_name Student','extends RefCounted',
        'var last_error: String = ""',
        'var _id: int',
        'var _grades: Dictionary = {}',
        'var student_id: int:',
        '    get:',
        '        return _id',
        'var student_name: String = "":',
        '    set(value):',
        '        if value.length() < 2:',
        '            last_error = "Il nome deve contenere almeno 2 caratteri"',
        '        else:',
        '            student_name = value',
        '            last_error = ""',
        'var average: float:',
        '    get:',
        '        if _grades.is_empty():',
        '            return 0.0',
        '        var total = 0.0',
        '        for score in _grades.values():',
        '            total += score',
        '        return total / _grades.size()',
        'func _init(id: int, new_name: String) -> void:',
        '    _id = id',
        '    student_name = new_name',
        'func add_grade(course: String, grade: int) -> bool:',
        '    if grade < 0 or grade > 100:',
        '        return false',
        '    _grades[course] = grade',
        '    return true',
        'func course_count() -> int:',
        '    return _grades.size()'
      ],
      'student_registry.gd':[
        'class_name StudentRegistry','extends RefCounted',
        'var _students: Dictionary = {}',
        'func add_student(student: Student) -> bool:',
        '    if _students.has(student.student_id):',
        '        return false',
        '    _students[student.student_id] = student',
        '    return true',
        'func remove_student(id: int) -> bool:',
        '    if not _students.has(id):',
        '        return false',
        '    _students.erase(id)',
        '    return true',
        'func get_student(id: int) -> Student:',
        '    return _students.get(id, null)',
        'func top_student() -> Student:',
        '    var best: Student = null',
        '    for value in _students.values():',
        '        var student: Student = value',
        '        if best == null or student.average > best.average:',
        '            best = student',
        '    return best',
        'func get_ids() -> Array:',
        '    return _students.keys()'
      ]
    });
    for(const n of [196,197,198,199,200]){
      const data=await page.evaluate(num=>{
        const l=LESSONS_DATA.find(x=>x.manualLessonNumber===num);
        return {ready:l.validationReady,locked:l.readOnlyFiles};
      },n);
      assert.equal(data.ready,true,'Lezione non pronta '+n);
      assert.deepEqual(data.locked,['main.gd']);
    }

    await completeProject(201,{
      'counter.gd':[
        'class_name Counter','extends RefCounted',
        'var value: int','var step: int',
        'func _init(start: int = 0, step_size: int = 1) -> void:',
        '    value = start',
        '    step = step_size',
        'func tick() -> void:',
        '    value += step',
        'func plus(other: Counter) -> Counter:',
        '    return Counter.new(value + other.value, step)',
        'func equals(other: Counter) -> bool:',
        '    return value == other.value'
      ]
    });
    await completeProject(202,{
      'playing_card.gd':[
        'class_name PlayingCard','extends RefCounted',
        'var rank: int','var suit: String',
        'func _init(new_rank: int, new_suit: String) -> void:',
        '    rank = new_rank',
        '    suit = new_suit',
        'func _to_string() -> String:',
        '    var display = str(rank)',
        '    match rank:',
        '        11: display = "J"',
        '        12: display = "Q"',
        '        13: display = "K"',
        '        14: display = "A"',
        '    return display + " of " + suit'
      ],
      'hand.gd':[
        'class_name Hand','extends RefCounted',
        'var _cards: Array[PlayingCard] = []',
        'func add(card: PlayingCard) -> void:',
        '    _cards.append(card)',
        'func _to_string() -> String:',
        '    if _cards.is_empty():',
        '        return "Hand (0): empty"',
        '    var names: Array[String] = []',
        '    for card in _cards:',
        '        names.append(str(card))',
        '    return "Hand (%d): %s" % [_cards.size(), ", ".join(names)]'
      ]
    });
    await completeProject(203,{
      'bookshelf.gd':[
        'class_name Bookshelf','extends RefCounted',
        'var _titles: Array[String] = []',
        'var _capacity: int',
        'var _cursor: int = 0',
        'func _init(capacity: int) -> void:',
        '    _capacity = capacity',
        'func add(title: String) -> bool:',
        '    if _titles.size() >= _capacity or title in _titles:',
        '        return false',
        '    _titles.append(title)',
        '    return true',
        'func size() -> int:',
        '    return _titles.size()',
        'func has(title: String) -> bool:',
        '    return title in _titles',
        'func get_at(index: int) -> String:',
        '    return _titles[index] if index >= 0 and index < size() else ""',
        'func _iter_init(iter: Array) -> bool:',
        '    _cursor = 0',
        '    return not _titles.is_empty()',
        'func _iter_next(iter: Array) -> bool:',
        '    _cursor += 1',
        '    return _cursor < _titles.size()',
        'func _iter_get(position):',
        '    return _titles[_cursor]'
      ]
    });
    await completeProject(204,{
      'custom_list.gd':[
        'class_name CustomList','extends RefCounted',
        'var _items: Array = []',
        'var _cursor: int = 0',
        'func _init(items: Array = []) -> void:',
        '    _items = items.duplicate()',
        'func append(item) -> void:',
        '    _items.append(item)',
        'func pop_back():',
        '    return null if _items.is_empty() else _items.pop_back()',
        'func get_at(index: int):',
        '    return _items[index] if index >= 0 and index < _items.size() else null',
        'func set_at(index: int, value) -> bool:',
        '    if index < 0 or index >= _items.size():',
        '        return false',
        '    _items[index] = value',
        '    return true',
        'func size() -> int:',
        '    return _items.size()',
        'func has(item) -> bool:',
        '    return item in _items',
        'func clear() -> void:',
        '    _items.clear()',
        'func concat(other: CustomList) -> CustomList:',
        '    return CustomList.new(_items + other._items)',
        'func _to_string() -> String:',
        '    return str(_items)',
        'func _iter_init(iter: Array) -> bool:',
        '    _cursor = 0',
        '    return not _items.is_empty()',
        'func _iter_next(iter: Array) -> bool:',
        '    _cursor += 1',
        '    return _cursor < _items.size()',
        'func _iter_get(position):',
        '    return _items[_cursor]'
      ]
    });
    await completeProject(205,{
      'mailbox.gd':[
        'class_name Mailbox','extends RefCounted',
        'signal mail_arrived',
        'var letters: int = 0',
        'func deliver(kind: String) -> void:',
        '    if kind == "letter":',
        '        letters += 1',
        '        mail_arrived.emit()'
      ]
    });
    // Gli starter non devono completare la lezione, neppure con codice compilabile.
    const starter205=await page.evaluate(async()=>{
      App.openLesson(10205);
      const editor=document.getElementById('code-editor');
      editor.value=LESSONS_DATA.find(x=>x.manualLessonNumber===205).sourceFiles['mailbox.gd'];
      const r=await GDHManualVerifier.verify(10205,editor.value,
        (code,options)=>GDHGodot.runNative(code,options));
      return r.accepted;
    });
    assert.equal(starter205,false,'La casella postale vuota non deve superare la lezione');

    await completeProject(206,{'bomb.gd':[
      'class_name Bomb','extends RefCounted',
      'signal beeped','signal exploded','var fuse: int',
      'func _init(start_fuse: int) -> void:','    fuse = start_fuse',
      'func tick() -> void:',
      '    if fuse <= 0: return',
      '    fuse -= 1',
      '    if fuse > 0: beeped.emit()',
      '    else: exploded.emit()'
    ]});
    await completeProject(207,{'score_board.gd':[
      'class_name ScoreBoard','extends RefCounted',
      'var points: int = 0',
      'func watch(target: Target) -> void:',
      '    if not target.hit.is_connected(_on_target_hit):',
      '        target.hit.connect(_on_target_hit)',
      'func ignore(target: Target) -> void:',
      '    if target.hit.is_connected(_on_target_hit):',
      '        target.hit.disconnect(_on_target_hit)',
      'func _on_target_hit() -> void:',
      '    points += 10',
      '    print("Hit! Punteggio: ", points)'
    ]});
    await completeProject(208,{'wallet.gd':[
      'class_name Wallet','extends RefCounted',
      'signal balance_changed(old_balance: int, new_balance: int)',
      'signal purchase_failed(price: int, missing: int)',
      'var balance: int = 0',
      'func add(amount: int) -> void:',
      '    var old = balance',
      '    balance += amount',
      '    balance_changed.emit(old, balance)',
      'func buy(price: int) -> void:',
      '    if price > balance:',
      '        purchase_failed.emit(price, price - balance)',
      '        return',
      '    var old = balance',
      '    balance -= price',
      '    balance_changed.emit(old, balance)'
    ]});
    await completeProject(209,{
      'health.gd':[
        'class_name Health','extends RefCounted',
        'signal damaged(amount: int, hp: int)',
        'signal healed(amount: int, hp: int)',
        'signal died',
        'var max_hp: int','var hp: int',
        'func _init(start_hp: int) -> void:',
        '    max_hp = start_hp',
        '    hp = start_hp',
        'func take_damage(amount: int) -> void:',
        '    if hp <= 0 or amount <= 0: return',
        '    var prev = hp',
        '    hp = maxi(0, hp - amount)',
        '    damaged.emit(prev - hp, hp)',
        '    if hp == 0: died.emit()',
        'func heal(amount: int) -> void:',
        '    if hp <= 0 or amount <= 0: return',
        '    var prev = hp',
        '    hp = mini(max_hp, hp + amount)',
        '    if hp != prev: healed.emit(hp - prev, hp)'
      ],
      'health_bar.gd':[
        'class_name HealthBar','extends RefCounted',
        'var maximum: int',
        'func watch(health: Health) -> void:',
        '    maximum = health.max_hp',
        '    health.damaged.connect(_on_damaged)',
        '    health.healed.connect(_on_healed)',
        '    health.died.connect(_on_died)',
        'func _on_damaged(amount: int, hp: int) -> void:',
        '    print("-%d HP [%d/%d]" % [amount, hp, maximum])',
        'func _on_healed(amount: int, hp: int) -> void:',
        '    print("+%d HP [%d/%d]" % [amount, hp, maximum])',
        'func _on_died() -> void:',
        '    print("Partita terminata")'
      ]
    });
    await completeProject(210,{
      'weapon.gd':[
        'class_name Weapon','extends RefCounted',
        'var weapon_name: String','var damage: int',
        'func _init(new_name: String, new_damage: int) -> void:',
        '    weapon_name = new_name',
        '    damage = new_damage'
      ],
      'knight.gd':[
        'class_name Knight','extends RefCounted',
        'var knight_name: String','var weapon: Weapon = null',
        'func _init(new_name: String) -> void:',
        '    knight_name = new_name',
        'func equip(new_weapon: Weapon) -> void:',
        '    weapon = new_weapon',
        'func drop() -> void:',
        '    weapon = null',
        'func attack() -> String:',
        '    if weapon == null:',
        '        return knight_name + " non ha armi"',
        '    return "%s attacca con %s per %d danni" % [knight_name, weapon.weapon_name, weapon.damage]'
      ]
    });

    // 211: classe interna e confronto stabile dei punteggi.
    await completeProject(211,{
      'leaderboard.gd':[
        'class_name Leaderboard','extends RefCounted',
        'class Entry:',
        '    extends RefCounted',
        '    var player_name: String','    var score: int',
        '    func _init(p: String, s: int) -> void:',
        '        player_name = p',
        '        score = s',
        '    func _to_string() -> String:',
        '        return "%s: %d" % [player_name, score]',
        'var entries: Array[Entry] = []',
        'func submit(player: String, score: int) -> void:',
        '    for e in entries:',
        '        if e.player_name == player:',
        '            e.score = maxi(e.score, score)',
        '            return',
        '    entries.append(Entry.new(player, score))',
        'func best() -> Entry:',
        '    var winning: Entry = null',
        '    for e in entries:',
        '        if winning == null or e.score > winning.score:',
        '            winning = e',
        '    return winning'
      ]
    });
    await completeProject(212,{
      'part.gd':[
        'class_name Part','extends Node',
        'var power: int',
        'func _init(part_name: String, new_power: int) -> void:',
        '    name = part_name',
        '    power = new_power',
        'func _ready() -> void:',
        '    print(name, " attached")'
      ],
      'robot.gd':[
        'class_name Robot','extends Node',
        'func add_part(part_name: String, power: int) -> void:',
        '    if has_node(part_name):',
        '        print(part_name, " è già collegato")',
        '        return',
        '    add_child(Part.new(part_name, power))',
        'func total_power() -> int:',
        '    var total = 0',
        '    for child in get_children():',
        '        total += (child as Part).power',
        '    return total'
      ]
    });
    await completeProject(213,{
      'wave.gd':[
        'class_name Wave','extends Node',
        'func spawn(enemy_name: String, hp: int) -> void:',
        '    if has_node(enemy_name):',
        '        print(enemy_name, " è già presente")',
        '        return',
        '    add_child(Enemy.new(enemy_name, hp))',
        'func hit(enemy_name: String, damage: int) -> void:',
        '    var enemy = get_node_or_null(enemy_name) as Enemy',
        '    if enemy == null:',
        '        print("Nessun ", enemy_name, " presente")',
        '        return',
        '    enemy.hp -= damage',
        '    if enemy.hp <= 0:',
        '        print(enemy_name, " defeated")',
        '        remove_child(enemy)',
        '        enemy.queue_free()',
        '    else:',
        '        print(enemy_name, " ha ", enemy.hp, " PS")',
        'func alive() -> int:',
        '    return get_child_count()'
      ]
    });
    // "enemy.gd" è dato dal corso e deve restare immutabile.
    await page.getByRole('tab',{name:'enemy.gd',exact:true}).click();
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'');
    await completeProject(214,{
      'potion.gd':[
        'class_name Potion','extends RefCounted',
        'enum Kind { HEAL, MANA, POISON }',
        'var kind: Kind','var strength: int',
        'func _init(potion_kind: int, potion_strength: int) -> void:',
        '    kind = potion_kind',
        '    strength = potion_strength',
        'static func from_text(text: String, potion_strength: int) -> Potion:',
        '    match text:',
        '        "HEAL": return Potion.new(Kind.HEAL, potion_strength)',
        '        "MANA": return Potion.new(Kind.MANA, potion_strength)',
        '        _: return Potion.new(Kind.POISON, potion_strength)',
        'func describe() -> String:',
        '    var label = Kind.keys()[kind]',
        '    var prefix = "-" if kind == Kind.POISON else "+"',
        '    var unit = " MP" if kind == Kind.MANA else " HP"',
        '    return "%s pozione: %s%d%s" % [label, prefix, strength, unit]'
      ],
      'belt.gd':[
        'class_name Belt','extends RefCounted',
        'var potions: Array[Potion] = []',
        'func add(potion: Potion) -> void:',
        '    potions.append(potion)',
        'func summary() -> Array[String]:',
        '    var lines: Array[String] = []',
        '    for kind in Potion.Kind.values():',
        '        var quantity = 0',
        '        var strength = 0',
        '        for potion in potions:',
        '            if potion.kind == kind:',
        '                quantity += 1',
        '                strength += potion.strength',
        '        lines.append("%s: %d (%d totali)" % [Potion.Kind.keys()[kind], quantity, strength])',
        '    return lines'
      ]
    });
    await completeProject(215,{
      'game_facade.gd':[
        'class_name GameFacade','extends RefCounted',
        'var music: MusicPlayer = MusicPlayer.new()',
        'var maps: LevelMap = LevelMap.new()',
        'var hud: Hud = Hud.new()',
        'func start_level(number: int, hearts: int) -> void:',
        '    music.play("boss.ogg" if number % 5 == 0 else "level_%d.ogg" % number)',
        '    maps.load_map(number)',
        '    hud.show_hearts(hearts)',
        'func quit_level() -> void:',
        '    hud.hide()',
        '    music.stop()'
      ]
    });
    for(const name of ['music_player.gd','level_map.gd','hud.gd','main.gd']){
      await page.getByRole('tab',{name,exact:true}).click();
      assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'',
        'File fornito non protetto: '+name);
    }
    // Il codice lasciato incompleto non supera i casi positivi e negativi.
    const default211=await page.evaluate(async()=>{
      App.openLesson(10211);
      const l=LESSONS_DATA.find(x=>x.manualLessonNumber===211);
      const draft=GDHManualStudio.getDraft(l);
      const original=draft.files['leaderboard.gd'];
      const editor=document.getElementById('code-editor');
      const previous=editor.value;
      try{
        draft.files['leaderboard.gd']=l.sourceFiles['leaderboard.gd'];
        editor.value=l.sourceFiles['leaderboard.gd'];
        const result=await GDHManualVerifier.verify(l.id,
          editor.value,(code,options)=>GDHGodot.runNative(code,options));
        return result.accepted;
      }finally{
        editor.value=previous;
        draft.files['leaderboard.gd']=original;
      }
    });
    assert.equal(default211,false,'La classifica iniziale non deve completare la lezione');
    const fake191=await page.evaluate(async()=>{
      App.openLesson(10191);
      const draft=GDHManualStudio.getDraft(LESSONS_DATA[190]);
      draft.files['vehicle.gd']=LESSONS_DATA[190].sourceFiles['vehicle.gd'].replace(
        'return ""','return "Toyota: 4 ruote, Vroom"');
      try{
        const result=await GDHManualVerifier.verify(10191,
          document.getElementById('code-editor').value,
          (code,options)=>GDHGodot.runNative(code,options));
        return result.accepted;
      }finally{
        draft.files['vehicle.gd']=LESSONS_DATA[190].sourceFiles['vehicle.gd'];
      }
    });
    assert.equal(fake191,false,'Non accettare output hardcoded nel garage');
    const future216=await page.evaluate(async()=>{
      const l=LESSONS_DATA.find(x=>x.manualLessonNumber===216);
      return {ready:l.validationReady,
        supported:GDHManualProject.supports(l),
        accepted:(await GDHManualVerifier.verify(l.id,l.initialCode,
          ()=>{throw Error('Non eseguire Godot su una lezione non supportata');})).accepted};
    });
    assert.deepEqual(future216,{ready:false,supported:false,accepted:false},
      'Non attribuire XP alle lezioni prive di validatore specifico');
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
