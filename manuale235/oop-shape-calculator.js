/* Lezione 195: shape calculator con @abstract reale (Godot 4.5+),
 * tre forme concrete, duck typing e input diversi.
 */
(() => {
 'use strict';
 const lesson=(window.LESSONS_DATA||[]).find(x=>x.manualLessonNumber===195);
 const verifier=window.GDHManualVerifier;
 if(!lesson||!verifier)throw Error('Lezione 195 non disponibile');
 const main=rows=>['extends Node','','func _ready():',
   ...rows.map(s=>'    '+s)].join('\n');
 const files={
   'shape.gd':[
     '# Rendi Shape astratta.',
     'class_name Shape','extends RefCounted','',
     '# Dichiara area(), perimeter(), shape_name() come metodi astratti.',
     'func describe() -> String:',
     '    # Usa i tre metodi definiti dalle classi concrete.',
     '    return ""'
   ].join('\n'),
   'circle.gd':[
     'class_name Circle','extends Shape','',
     'var radius: float','',
     'func _init(r: float) -> void:',
     '    # Memorizza il raggio.',
     '    pass','',
     '# Implementa area(), perimeter() e shape_name().'
   ].join('\n'),
   'rectangle.gd':[
     'class_name Rectangle','extends Shape','',
     'var width: float','var height: float','',
     'func _init(w: float, h: float) -> void:',
     '    # Memorizza base e altezza.',
     '    pass','',
     '# Implementa area(), perimeter() e shape_name().'
   ].join('\n'),
   'triangle.gd':[
     'class_name Triangle','extends Shape','',
     'var a: float','var b: float','var c: float','',
     'func _init(side_a: float, side_b: float, side_c: float) -> void:',
     '    # Memorizza i tre lati.',
     '    pass','',
     '# Implementa area() con Erone, perimeter() e shape_name().'
   ].join('\n'),
   'custom_shape.gd':[
     'class_name CustomShape','extends RefCounted','',
     'var custom_name: String','var size: float','',
     'func _init(n: String, s: float) -> void:',
     '    # Memorizza i dati.',
     '    pass','',
     '# Implementa area(), perimeter() e describe() senza estendere Shape.'
   ].join('\n'),
   'shape_calculator.gd':[
     'class_name ShapeCalculator','extends RefCounted','',
     'static func process(thing) -> String:',
     '    # Riconosci Shape, oggetti che hanno describe() e oggetti non misurabili.',
     '    return ""','',
     'static func total_area(things: Array) -> float:',
     '    # Somma area() solo per gli oggetti che espongono quel metodo.',
     '    return 0.0'
   ].join('\n'),
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'var things = []',
     'for i in count:',
     '    var p = OS.read_string_from_stdin().split(" ")',
     '    if p[0] == "cerchio":',
     '        things.append(Circle.new(float(p[1])))',
     '    elif p[0] == "rettangolo":',
     '        things.append(Rectangle.new(float(p[1]), float(p[2])))',
     '    elif p[0] == "triangolo":',
     '        things.append(Triangle.new(float(p[1]), float(p[2]), float(p[3])))',
     '    elif p[0] == "custom":',
     '        things.append(CustomShape.new(p[1], float(p[2])))',
     '    else:',
     '        things.append(RefCounted.new())',
     'for thing in things:',
     '    print(ShapeCalculator.process(thing))',
     'print("Area totale: %.2f" % ShapeCalculator.total_area(things))'
   ])
 };
 lesson.sourceFiles=files;
 lesson.readOnlyFiles=['main.gd'];
 lesson.initialCode=files['shape.gd'];
 lesson.starterCode=lesson.initialCode;
 lesson.requiresMultipleFiles=true;
 lesson.task=lesson.task
   .replace('I loro nomi sono Circle,\n Rectangle e Triangle.',
     'I loro nomi sono Cerchio, Rettangolo e Triangolo.')
   .replace(/\[Shape\]/g,'[Forma]');
 const cases=[
   ['cerchio 5','custom Hexa 3','unknown'],
   ['rettangolo 4 5','triangolo 3 4 5'],
   [],
   ['custom Box 2','cerchio 1'],
   ['unknown','unknown','rettangolo 0 3'],
   ['triangolo 5 12 13','rettangolo 2 3'],
   ['cerchio 0','custom X 0','triangolo 6 8 10']
 ];
 const display=n=>n.toFixed(2);
 const simulate=rows=>{
   let sum=0;const out=[];
   for(const line of rows){
     const [kind,...a]=line.split(' '),args=a.map(Number);
     let label='',area=0,perimeter=0,prefix='[Forma]';
     if(kind==='cerchio'){
       label='Cerchio';area=Math.PI*args[0]**2;perimeter=2*Math.PI*args[0];
     }else if(kind==='rettangolo'){
       label='Rettangolo';area=args[0]*args[1];perimeter=2*(args[0]+args[1]);
     }else if(kind==='triangolo'){
       label='Triangolo';
       const semiperimeter=(args[0]+args[1]+args[2])/2;
       area=Math.sqrt(Math.max(0,semiperimeter*(semiperimeter-args[0])*
         (semiperimeter-args[1])*(semiperimeter-args[2])));
       perimeter=args[0]+args[1]+args[2];
     }else if(kind==='custom'){
       label=a[0];area=Number(a[1])**2;perimeter=4*Number(a[1]);
       prefix='[Compatibile]';
     }else{
       out.push('Impossibile misurare questo oggetto');continue;
     }
     sum+=area;
     out.push(prefix+' '+label+': area '+display(area)+', perimetro '+display(perimeter));
   }
   out.push('Area totale: '+display(sum));
   return out.join('\n');
 };
 verifier.expectedCases[195]=cases.map((rows,i)=>({
   name:'Calcolatore forme '+i,
   stdin:[String(rows.length),...rows],
   output:simulate(rows)
 }));
 const active=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 lesson.manualSourceCheck=s=>{
   const code=active(s);
   const all=[
     /@abstract\s+class_name\s+Shape\b|@abstract\s*\n\s*class_name\s+Shape\b/,
     /@abstract\s+func\s+area\s*\(\s*\)\s*->\s*float/,
     /@abstract\s+func\s+perimeter\s*\(\s*\)\s*->\s*float/,
     /@abstract\s+func\s+shape_name\s*\(\s*\)\s*->\s*String/,
     /\bclass_name\s+Circle\b/,/\bclass_name\s+Rectangle\b/,
     /\bclass_name\s+Triangle\b/,/\bclass_name\s+CustomShape\b/,
     /\bclass_name\s+ShapeCalculator\b/,
     /\bstatic\s+func\s+process\s*\(/,
     /\bstatic\s+func\s+total_area\s*\(/,
     /\bsqrt\s*\(/,
     /\.has_method\s*\(\s*["']area["']\s*\)/,
     /\.has_method\s*\(\s*["']describe["']\s*\)/
   ];
   return all.every(re=>re.test(code))&&
     (code.match(/\bfunc\s+area\s*\(/g)||[]).length>=5&&
     (code.match(/\bfunc\s+perimeter\s*\(/g)||[]).length>=5;
 };
 lesson.expectedOutput=verifier.expectedCases[195][0].output;
 lesson.validationReady=true;
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   195:['3','cerchio 5','custom Hexa 3','unknown']});
 window.GDHManualMigration.validated=(window.LESSONS_DATA||[]).filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();
