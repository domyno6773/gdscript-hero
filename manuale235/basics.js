/* Verificatori specifici dei fondamenti: lezioni 9–26.
   Evitano il "promosso perché compila" e richiedono le operazioni della consegna.
   Tutti i controlli includono anche l'esecuzione nel vero Godot. */
(() => {
  'use strict';
  const expected={
    9:'Giocatore: Ada\nMonete: 120\nOnline: true',
    10:'Conteggio: 10\nTotale: 150.75\nVoto: A\nAttivo: false\nNome utente: Bob123',
    11:'Quantità: 10\nPrezzo: 99.99\nMessaggio: GDScript è fantastico!\nÈ disponibile: true',
    12:'MAX_LIVES = 3\nGRAVITY = 9.8',
    13:'k = 88\nratio = 3.14\nplayer_name = Bob\nMAX_LEVEL = 10',
    14:'Prezzo: 99.99\nPrezzo intero: 99\nLivello: 7\nMonete: 15.0',
    15:'a = 5.2, b = 2.6, c = 2.0',
    16:'Ogni giocatore riceve: 3 monete\nQuota esatta: 3.4',
    17:'a = 9\nb = 2\nc = 11\nd = 1\ne = 2\nf = 1',
    18:'count = 7',
    19:'c = 24\nd = 6',
    20:'n1 = 8, n2 = 9, n3 = false',
    21:'Età: 20\nPuò guidare: true',
    22:'b3 = true',
    23:'b4 = true',
    24:'Può entrare: true\nPuò trovare il tesoro: false\nSi è perso: false',
    25:'Monete insufficienti',
    26:'c = 3'
  };
  const patterns={
    9:[/\bvar\s+player_name\s*=\s*["']Ada["']/,/\bvar\s+coin_count\s*=\s*120\b/,
      /\bvar\s+is_online\s*=\s*true\b/,/print\([^)]*player_name\s*\)/,
      /print\([^)]*coin_count\s*\)/,/print\([^)]*is_online\s*\)/],
    10:[/\bvar\s+count\s*:\s*int\s*=\s*10\b/,/\bvar\s+total\s*:\s*float\s*=\s*150\.75\b/,
      /\bvar\s+grade\s*:\s*String\s*=\s*["']A["']/,
      /\bvar\s+is_active\s*:\s*bool\s*=\s*false\b/,
      /\bvar\s+user_name\s*:\s*String\s*=\s*["']Bob123["']/],
    11:[/\bvar\s+quantity\s*:=\s*10\b/,/\bvar\s+price\s*:=\s*99\.99\b/,
      /\bvar\s+message\s*:=\s*["']GDScript è fantastico!["']/,
      /\bvar\s+is_available\s*:=\s*true\b/],
    12:[/\bconst\s+MAX_LIVES\s*=\s*3\b/,/\bconst\s+GRAVITY\s*=\s*9\.8\b/],
    13:[/\bvar\s+k\s*(?::\s*int\s*=|:=)\s*88\b/,
      /\bvar\s+ratio\s*(?::\s*float\s*=|:=)\s*3\.14\b/,
      /\bvar\s+player_name\s*(?::\s*String\s*=|:=)\s*["']Bob["']/,
      /\bconst\s+MAX_LEVEL\s*=\s*10\b/],
    14:[/\bvar\s+int_price\s*(?::\s*int\s*)?(?:=|:=)\s*int\s*\(\s*price\s*\)/,
      /\bvar\s+level\s*(?::\s*int\s*)?(?:=|:=)\s*int\s*\(\s*level_text\s*\)/,
      /\bvar\s+coins_float\s*(?::\s*float\s*)?(?:=|:=)\s*float\s*\(\s*coins\s*\)/],
    15:[/\bvar\s+a\s*(?::\s*float\s*)?(?:=|:=)\s*5\.2\b/,
      /\bvar\s+b\s*(?::\s*float\s*)?(?:=|:=)\s*2\.6\b/,
      /\bvar\s+c\s*(?::\s*float\s*)?(?:=|:=)\s*a\s*\/\s*b\b/],
    16:[/\bvar\s+monete_each\b[^=\n]*=\s*total_coins\s*\/\s*players\b/,
      /\bvar\s+exact_share\b[^=\n]*=\s*float\s*\(\s*total_coins\s*\)\s*\/\s*players\b/],
    17:[/\bvar\s+a\b[^=\n]*=\s*9\b/,/\bvar\s+b\b[^=\n]*=\s*2\b/,
      /\bvar\s+c\b[^=\n]*=\s*11\b/,/\bvar\s+d\b[^=\n]*=\s*a\s*%\s*2\b/,
      /\bvar\s+e\b[^=\n]*=\s*b\s*%\s*3\b/,/\bvar\s+f\b[^=\n]*=\s*c\s*%\s*10\b/],
    18:[/\bcount\s*\+=\s*4\b/,/\bcount\s*\*=\s*2\b/,/\bcount\s*-=\s*1\b/],
    19:[/\bvar\s+c\s*:\s*int\s*=\s*a\s*\*\s*b\b/,/\bvar\s+d\s*:\s*int\s*=\s*a\s*\/\s*b\b/],
    20:[/\bvar\s+n1\b[^=\n]*=\s*8\b/,/\bvar\s+n2\b[^=\n]*=\s*9\b/,
      /\bvar\s+n3\b[^=\n]*=\s*n1\s*>\s*n2\b/],
    21:[/\bvar\s+age\s*:\s*int\s*=\s*20\b/,
      /\bvar\s+has_license\s*:\s*bool\s*=\s*true\b/,
      /\bvar\s+can_drive\s*:\s*bool\s*=\s*age\s*>=\s*18\s+and\s+has_license\b/],
    22:[/\bvar\s+b1\s*:\s*int\s*=\s*-?\d+\b/,/\bvar\s+b2\s*:\s*int\s*=\s*-?\d+\b/,
      /b1\s*\*\s*b2\s*>\s*b1\s*\+\s*b2/,/\bnot\s*\(\s*b1\s*==\s*b2\s*\)/],
    23:[/\bvar\s+b1\s*:\s*bool\s*=\s*(?:true|false)\b/,
      /\bvar\s+b2\s*:\s*bool\s*=\s*(?:true|false)\b/,
      /\bvar\s+b3\s*:\s*bool\s*=\s*(?:true|false)\b/,
      /\bvar\s+b4\s*:\s*bool\s*=\s*\(\s*b1\s+or\s+b2\s*\)\s+and\s+not\s*\(\s*b1\s+and\s+b2\s*\)\s+and\s+not\s+b3\b/],
    24:[/\bvar\s+can_enter\b[^=\n]*=/,/\bvar\s+can_find_treasure\b[^=\n]*=/,
      /\bvar\s+is_lost\b[^=\n]*=/,/\blevel\b/,/\bhas_key\b/,/\bhas_map\b/,
      /\band\b/,/\bor\b/,/\bnot\b/],
    25:[/\bvar\s+status\b[^=\n]*=/,/\bif\s+coins\s*>=\s*price\s+else\b/,
      /["']Acquisto completato["']/,/["']Monete insufficienti["']/],
    26:[/\bvar\s+c\s*:\s*int\s*=\s*0\b/,
      /\bif\s+a\s*>=\s*b\s+and\s+not\s+b\s*<\s*10\s*:/,
      /\bc\s*=\s*2\b/,/\bc\s*\+=\s*1\b/]
  };
  // Lezioni 9–26: il risultato va ottenuto con variabili/operazioni richieste.
  const stripComments=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
  const grade=n=>async result=>{
    const src=stripComments(result.code),logs=(result.logs||[]).join('\n').trimEnd();
    const tests=[{desc:'Compilazione ed esecuzione Godot',
      passed:result.success===true,diff:result.error||null}];
    const correct=(patterns[n]||[]).every(re=>re.test(src));
    tests.push({desc:'Operazioni e identificatori richiesti',
      passed:correct,diff:correct?null:'Controlla tipi, nomi e istruzioni specificati nella consegna.'});
    tests.push({desc:'Output atteso dalla lezione',
      passed:logs===expected[n],diff:logs===expected[n]?null:
      'Atteso:\n'+expected[n]+'\nRicevuto:\n'+logs});
    return tests;
  };
  let attached=0;
  for(let n=9;n<=26;n++){
    const lesson=(window.LESSONS_DATA||[]).find(x=>x.manualLessonNumber===n);
    if(!lesson)throw Error('Lezione mancante: '+n);
    lesson.validate=grade(n);
    lesson.expectedOutput=expected[n];
    lesson.validationReady=true;
    attached++;
  }
  window.GDHManualBasicsValidated=attached;
})();
