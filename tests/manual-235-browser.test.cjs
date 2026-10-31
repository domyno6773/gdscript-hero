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
    assert.equal(stats.prepared,89);
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
