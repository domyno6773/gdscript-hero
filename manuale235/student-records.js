/* Lezioni 134–140: gestore dei record degli studenti.
 * Ogni passaggio include le funzioni concluse nei precedenti, ma lascia
 * davvero da implementare il comando e la funzione nuovi.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],verifier=window.GDHManualVerifier;
  if(lessons.length!==235||!verifier)throw Error('Catalogo manuale non caricato');
  const get=n=>{
    const found=lessons.find(l=>l.manualLessonNumber===n);
    if(!found)throw Error('Lezione mancante '+n);
    return found;
  };
  const patch=(n,source)=>{
    const l=get(n);
    l.initialCode=source;l.starterCode=source;
    l.sourceFiles={...l.sourceFiles,'main.gd':source};
  };
  const active=src=>String(src).split('\n')
    .filter(line=>!/^\s*#/.test(line)).join('\n');
  const all=(...regex)=>src=>regex.every(r=>r.test(active(src)));
  const funcs={
    135:[
      'func add_student(student_name: String, age: int, courses: Array) -> void:',
      '    if student_records.has(student_name):',
      '        print("Lo studente \x27%s\x27 esiste già." % student_name)',
      '        return',
      '    var course_set = {}',
      '    for course in courses:',
      '        course_set[course] = true',
      '    student_records[student_name] = {"age": age, "grades": [], "courses": course_set}',
      '    print("Studente \x27%s\x27 aggiunto correttamente." % student_name)'
    ].join('\n'),
    136:[
      'func add_grade(student_name: String, grade: int) -> void:',
      '    if not student_records.has(student_name):',
      '        print("Studente \x27%s\x27 non trovato." % student_name)',
      '        return',
      '    student_records[student_name]["grades"].append(grade)',
      '    print("Voto %d aggiunto allo studente \x27%s\x27." % [grade, student_name])'
    ].join('\n'),
    137:[
      'func is_enrolled(student_name: String, course: String) -> bool:',
      '    if not student_records.has(student_name):',
      '        print("Studente \x27%s\x27 non trovato." % student_name)',
      '        return false',
      '    return student_records[student_name]["courses"].has(course)'
    ].join('\n'),
    138:[
      'func calculate_average_grade(student_name: String) -> float:',
      '    if not student_records.has(student_name):',
      '        print("Studente \x27%s\x27 non trovato." % student_name)',
      '        return -1.0',
      '    var grades: Array = student_records[student_name]["grades"]',
      '    if grades.is_empty():',
      '        return 0.0',
      '    var total = 0',
      '    for grade in grades:',
      '        total += grade',
      '    return float(total) / grades.size()'
    ].join('\n'),
    139:[
      'func list_students_by_course(course: String) -> Array:',
      '    var students_in_course = []',
      '    for student_name in student_records:',
      '        if student_records[student_name]["courses"].has(course):',
      '            students_in_course.append(student_name)',
      '    return students_in_course'
    ].join('\n'),
    140:[
      'func filter_top_students(threshold: float) -> Array:',
      '    var students = []',
      '    for student_name in student_records:',
      '        if calculate_average_grade(student_name) > threshold:',
      '            students.append(student_name)',
      '    return students'
    ].join('\n')
  };
  const branches={
    135:['            ["aggiungi", var student, var age, ..]:',
      '                add_student(student, int(age), parts.slice(3))'],
    136:['            ["voto", var student, var grade]:',
      '                add_grade(student, int(grade))'],
    137:['            ["iscritto", var student, var course]:',
      '                print(is_enrolled(student, course))'],
    138:['            ["media", var student]:',
      '                var average = calculate_average_grade(student)',
      '                if average >= 0:',
      '                    print("Media dei voti di \x27%s\x27: %.2f" % [student, average])'],
    139:['            ["corso", var course]:',
      '                print(list_students_by_course(course))'],
    140:['            ["migliori", var threshold]:',
      '                print(filter_top_students(float(threshold)))']
  };
  const comment={
    135:'    # Implementa il comando aggiungi e la funzione add_student().',
    136:'    # Implementa il comando voto e la funzione add_grade().',
    137:'    # Implementa il comando iscritto e la funzione is_enrolled().',
    138:'    # Implementa il comando media e calculate_average_grade().',
    139:'    # Implementa il comando corso e list_students_by_course().',
    140:'    # Implementa il comando migliori e filter_top_students().'
  };
  const buildStarter=n=>{
    if(n===134)return [
      'extends Node','',
      '# Dichiara var student_records = {} al livello dello script.','',
      'func _ready():',
      '    # Leggi i comandi con while true e match parts.',
      '    # Il comando mostra stampa il dizionario; esci termina il ciclo.',
      '    pass'
    ].join('\n');
    const body=[
      'extends Node','','var student_records = {}','',
      'func _ready():','    while true:',
      '        var parts = Array(OS.read_string_from_stdin().split(" ", false))',
      '        match parts:'
    ];
    for(let stage=135;stage<n;stage++)body.push(...branches[stage]);
    body.push(
      '            # Aggiungi qui il nuovo ramo del match per la lezione.',
      '            ["mostra"]:',
      '                print(student_records)',
      '            ["esci"]:',
      '                print("Arrivederci!")',
      '                break',
      '            _:',
      '                pass'
    );
    for(let stage=135;stage<n;stage++)body.push('',funcs[stage]);
    body.push('',comment[n]);
    return body.join('\n');
  };
  for(let n=134;n<=140;n++)patch(n,buildStarter(n));

  get(135).task=get(135).task.replace('- &gt; void','-> void').replace('- > void','-> void');
  get(136).task=get(136).task.replace(
    'Grade &lt;grade&gt; added for student','Voto &lt;grade&gt; aggiunto allo studente')
    .replace('Grade <grade> added for student','Voto <grade> aggiunto allo studente');
  get(138).task=get(138).task.replace('["average", var student]','["media", var student]');
  get(140).task=get(140).task.replace('come top 80','come migliori 80');

  // Il simulatore determina, a partire dai comandi delle prove, gli output
  // completi dei registri. Le prove sono poi eseguite da Godot, non da JS.
  const simulate=(commands,n)=>{
    const book=new Map(),out=[];
    for(const cmd of commands){
      const parts=cmd.split(' '),verb=parts[0],name=parts[1];
      if(verb==='esci'){
        out.push('Arrivederci!');
        break;
      }
      if(verb==='mostra'){
        const snapshot={};
        for(const [student,record] of book)
          snapshot[student]={age:record.age,grades:record.grades,
            courses:Object.fromEntries(record.courses.map(x=>[x,true]))};
        out.push({object:snapshot});
      }else if(verb==='aggiungi'&&n>=135){
        if(book.has(name))out.push("Lo studente '"+name+"' esiste già.");
        else{
          book.set(name,{age:Number(parts[2]),courses:[...new Set(parts.slice(3))],grades:[]});
          out.push("Studente '"+name+"' aggiunto correttamente.");
        }
      }else if(verb==='voto'&&n>=136){
        if(!book.has(name))out.push("Studente '"+name+"' non trovato.");
        else{
          book.get(name).grades.push(Number(parts[2]));
          out.push("Voto "+Number(parts[2])+" aggiunto allo studente '"+name+"'.");
        }
      }else if(verb==='iscritto'&&n>=137){
        if(!book.has(name)){
          out.push("Studente '"+name+"' non trovato.");
          out.push('false');
        }else out.push(String(book.get(name).courses.includes(parts[2])));
      }else if(verb==='media'&&n>=138){
        if(!book.has(name))out.push("Studente '"+name+"' non trovato.");
        else{
          const grades=book.get(name).grades;
          const avg=grades.length?grades.reduce((a,b)=>a+b,0)/grades.length:0;
          out.push("Media dei voti di '"+name+"': "+avg.toFixed(2));
        }
      }else if(verb==='corso'&&n>=139){
        out.push({object:[...book].filter(([,r])=>r.courses.includes(name))
          .map(([student])=>student)});
      }else if(verb==='migliori'&&n>=140){
        const threshold=Number(name);
        out.push({object:[...book].filter(([,r])=>{
          const grades=r.grades;
          return (grades.length?grades.reduce((a,b)=>a+b,0)/grades.length:0)>threshold;
        }).map(([student])=>student)});
      }
    }
    return out;
  };
  const common=['aggiungi Alice 20 Matematica Fisica',
    'aggiungi Bob 22 Matematica Biologia',
    'aggiungi Diana 23 Chimica Fisica'];
  const tests={
    134:[
      ['mostra','esci'],['esci'],['ignorato','mostra','esci']
    ],
    135:[
      [common[0],common[1],'mostra','esci'],
      ['aggiungi Ada 19 Matematica Matematica','aggiungi Ada 40 Arte','mostra','esci'],
      ['esci']
    ],
    136:[
      [common[0],'voto Alice 90','voto Alice 90','mostra','esci'],
      ['voto Assente 20','esci'],
      [common[0],'voto Alice 0','mostra','esci']
    ],
    137:[
      [common[0],common[1],'iscritto Alice Fisica',
        'iscritto Alice Biologia','iscritto Bob Matematica','esci'],
      ['iscritto Sconosciuto Fisica','esci'],
      [common[0],'iscritto Alice Matematica','esci']
    ],
    138:[
      [common[0],'voto Alice 90','voto Alice 85','media Alice','esci'],
      [common[0],'media Alice','media Bob','esci'],
      [common[0],'voto Alice 10','voto Alice 20','voto Alice 30','media Alice','esci']
    ],
    139:[
      [...common,'corso Matematica','corso Fisica','corso Biologia','corso Storia','esci'],
      ['corso Arte','esci'],
      [common[2],common[0],'corso Fisica','esci']
    ],
    140:[
      [...common,'voto Alice 90','voto Alice 85','voto Bob 75','voto Diana 95',
        'migliori 80','migliori 90','migliori 100','esci'],
      [common[0],'migliori -1','migliori 0','esci'],
      [common[0],common[1],'voto Alice 80','voto Bob 80',
        'migliori 80','migliori 79.5','esci']
    ]
  };
  const rules={
    134:all(/\bvar\s+student_records\s*(?::=|=)\s*\{\s*\}/,
      /\bwhile\s+true\s*:/,/\bmatch\s+parts\s*:/,
      /\[\s*["']mostra["']\s*\]\s*:/,/\[\s*["']esci["']\s*\]\s*:/,
      /\bOS\.read_string_from_stdin\s*\(/,/\bbreak\b/),
    135:all(/\bfunc\s+add_student\s*\(\s*student_name\s*:\s*String\s*,\s*age\s*:\s*int\s*,\s*courses\s*:\s*Array\s*\)/,
      /\[\s*["']aggiungi["']\s*,\s*var\s+student/,
      /\bstudent_records\s*\[\s*student_name\s*\]\s*=/,
      /\bfor\s+course\b/,/\bmatch\s+parts\s*:/),
    136:all(/\bfunc\s+add_grade\s*\(\s*student_name\s*:\s*String\s*,\s*grade\s*:\s*int\s*\)/,
      /\[\s*["']voto["']\s*,\s*var\s+student/,
      /\[\s*["']grades["']\s*\]\.append\s*\(/),
    137:all(/\bfunc\s+is_enrolled\s*\(\s*student_name\s*:\s*String\s*,\s*course\s*:\s*String\s*\)/,
      /\[\s*["']iscritto["']\s*,\s*var\s+student/,
      /\breturn\s+(?:true|false|\w+)/,/\bprint\s*\(\s*is_enrolled\s*\(/),
    138:all(/\bfunc\s+calculate_average_grade\s*\(\s*student_name\s*:\s*String\s*\)/,
      /\[\s*["']media["']\s*,\s*var\s+student/,
      /float\s*\(|\/\s*grades\.size\s*\(/,
      /\bgrades\b/,/\bprint\s*\(/),
    139:all(/\bfunc\s+list_students_by_course\s*\(\s*course\s*:\s*String\s*\)/,
      /\[\s*["']corso["']\s*,\s*var\s+course/,
      /\bfor\s+student_name\b/,/\breturn\b/),
    140:all(/\bfunc\s+filter_top_students\s*\(\s*threshold\s*:\s*float\s*\)/,
      /\[\s*["']migliori["']\s*,\s*var\s+threshold/,
      /\bcalculate_average_grade\s*\(/,/\breturn\b/,/>\s*threshold/)
  };
  for(let n=134;n<=140;n++){
    const lesson=get(n);
    const scenarios=tests[n].map((commands,i)=>{
      const spec=simulate(commands,n);
      return {name:'Registri studenti '+n+' - scenario '+(i+1),
        stdin:commands,
        linesSpec:spec,output:spec.every(x=>typeof x==='string')?spec.join('\n'):''};
    });
    verifier.expectedCases[n]=scenarios;
    lesson.expectedOutput=scenarios[0].output||'Registri studenti';
    lesson.manualSourceCheck=rules[n];
    lesson.validationReady=true;
  }
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    134:tests[134][0],135:tests[135][0],136:tests[136][0],
    137:tests[137][0],138:tests[138][0],139:tests[139][0],
    140:tests[140][0]
  });
  window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
