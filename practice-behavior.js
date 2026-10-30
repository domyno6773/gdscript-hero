'use strict';
// Fase 1: controlli di robustezza su dati diversi, sempre eseguiti in Godot.
// Le varianti cambiano valori di input e NON confrontano il codice dello
// studente con il testo della soluzione ufficiale.
(() => {
  const variants={
    2:{p2:[['var','vite','19']],p3:[['var','primo','14']],p4:[['var','livello','11']]},
    3:{p2:[['regex',/has_node\s*\(\s*["']Compagno["']\s*\)/,'has_node("Assente")']],
       p3:[['regex',/["']Pronto["']/,'"Attivo"']],
       p4:[['regex',/has_node\s*\(\s*["']Squadra\/Scout["']\s*\)/,'has_node("Squadra/Assente")']]},
    4:{p2:[['var','hp','23']],p3:[['var','vite','8']],p4:[['var','punteggio','5']]},
    5:{p2:[['var','prezzo','13']],p3:[['var','saldo','65']],p4:[['var','monete','30']]},
    6:{p2:[['var','punti','4']],p3:[['var','tessera','false']],
       p4:[['var','rischio','85'],['var','rischio','7']]},
    7:{p2:[['line',/avvisa\s*\(\s*\)/,'pass']],
       p3:[['regex',/saluta\s*\(\s*["']Luna["']\s*\)/,'saluta("Sole")']],
       p4:[['regex',/triplica\s*\(\s*\d+\s*\)/,'triplica(4)']]},
    8:{p2:[['line',/\w+\.pressed\.emit\s*\(\s*\)/,'pass']],
       p3:[['line',/\w+\.pressed\.emit\s*\(\s*\)/,'pass']],
       p4:[['line',/\w+\.pressed\.emit\s*\(\s*\)/,'pass']]},
    9:{p2:[['regex',/Vector2\s*\(\s*10\s*,\s*20\s*\)/,'Vector2(2, 30)']],
       p3:[['var','stazione','Vector2(3, 4)']],
       p4:[['regex',/Vector2\s*\(\s*3\s*,\s*4\s*\)/,'Vector2(0, 0)']]},
    11:{p2:[['regex',/\.wait_time\s*=\s*\d+(?:\.\d+)?/,'.wait_time = 7.0']],
        p3:[['regex',/\.size\s*=\s*Vector2\s*\([^\n)]*\)/,'.size = Vector2(145, 12)']],
        p4:[['line',/\w+\.queue_free\s*\(\s*\)/,'pass']]},
    12:{p2:[['regex',/\.append\s*\(\s*["']Benda["']\s*\)/,'.append("Fascia")']],
        p3:[['var','zaino','["Pozione", "Chiave", "Lanterna", "Elmo"]']],
        p4:[['var','punteggi','[7, 3]']]},
    13:{p2:[['regex',/range\s*\(\s*1\s*,\s*\d+\s*\)/,'range(1, 22)']],
        p3:[['var','premi','[7, -3, 6, -1]']],
        p4:[['regex',/while\s+contatore\s*<\s*\d+/,'while contatore < 12']]},
    14:{p2:[['var','nemico','{"hp":20, "scudo":9}']],
        p3:[['var','equip','{"arma":"Spada", "scudo":"Legno", "elmo":1}']],
        p4:[['var','boss','{"hp":99, "nome":"Custode"}']]},
    15:{p2:[['line',/allarme\.emit\s*\(\s*\)/,'pass']],
        p3:[['regex',/cura_ricevuta\.emit\s*\(\s*\d+\s*\)/,'cura_ricevuta.emit(7)']],
        p4:[['regex',/evento\.emit\s*\(\s*\d+\s*\)/,'evento.emit(9)']]},
    16:{p2:[['regex',/Oggetto\.new\s*\(\s*["']Gemma["']\s*\)/,'Oggetto.new("Cristallo")']],
        p3:[['var','valore','4']],
        p4:[['var','base','18']]}
  };
  const mutate=(src,spec)=>{
    const [kind,target,value]=spec;
    src=String(src||'');
    if(kind==='var'){
      const safe=target.replace(/\W/g,'\\$&');
      const re=new RegExp('(^[ \\t]*(?:var|const)[ \\t]+'+safe+
        '[ \\t]*(?::[ \\t]*[\\w\\[\\]]+[ \\t]*)?(?::=|=)[ \\t]*)[^\\r\\n#]+','m');
      return re.test(src)?src.replace(re,(_whole,prefix)=>prefix+value):null;
    }
    if(kind==='line'){
      const re=new RegExp('^([ \\t]*)'+target.source+'[ \\t]*$','m');
      return re.test(src)?src.replace(re,(_whole,indent)=>indent+value):null;
    }
    return target.test(src)?src.replace(target,value):null;
  };
  const createProbes=(lesson,task,source)=>{
    if(!lesson||!task||task.nativeOriginal||task.nativeGameplay)return [];
    const specs=variants[lesson.chapterId]?.[task.key]||[];
    return specs.map((spec,i)=>{
      const reference=mutate(task.solution,spec),student=mutate(source,spec);
      return reference!==null&&student!==null &&
        reference!==task.solution&&student!==source ?
        {label:'Scenario '+(i+1),reference,student}:null;
    }).filter(Boolean);
  };
  window.GDHPracticeBehavior=Object.freeze({createProbes});
})();