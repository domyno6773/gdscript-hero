'use strict';
/* Curriculum v3. Stable lesson/quiz IDs preserve saves and earned rewards.
 * Run after quizzes: order belongs to the curriculum, never to numeric IDs.
 */
(() => {
  const order=[1,2,13,3,4,5,8,14,9,'gameplay',15,6,7,10,11,12];
  const chapterMap=new Map(order.map((old,index)=>[old,index+1]));
  const originalChapters=new Map(CHAPTERS_DATA.map(c=>[c.id,c]));
  originalChapters.set('gameplay',{title:'Capitolo 10: Movimento, collisioni e obiettivi',desc:'Quattro progetti eseguiti in tempo reale: movimento, input, pareti e una moneta da raccogliere per vincere.',icon:'🎮'});
  const originalLessons=[...LESSONS_DATA,...window.GDHGameplayLessons.entries];
  CHAPTERS_DATA.splice(0,CHAPTERS_DATA.length,...order.map((old,index)=>({
    ...originalChapters.get(old),id:index+1,legacyChapterId:old,
    title:originalChapters.get(old).title.replace(/^Capitolo \d+:/,'Capitolo '+(index+1)+':'),
    badge:'CAPITOLO '+(index+1)
  })));
  const groups=new Map(order.map(old=>[old,originalLessons.filter(l=>l.chapterId===old)]));
  const revised=[];
  for(const old of order)for(const lesson of groups.get(old)){
    lesson.legacyChapterId=old;
    lesson.chapterId=chapterMap.get(old);
    // Ogni lezione integra pratica progressiva; il compito originale
    // resta la verifica nativa ufficiale, senza cambiare gli ID salvati.
    if(!lesson.isQuiz)lesson.practiceMode='progressive';
    revised.push(lesson);
  }
  LESSONS_DATA.splice(0,LESSONS_DATA.length,...revised);
  if(typeof CONCEPTS_CATALOG!=='undefined')for(const concept of Object.values(CONCEPTS_CATALOG)){
    if(chapterMap.has(concept.chapterId))concept.chapterId=chapterMap.get(concept.chapterId);
  }
  for(const quiz of window.GDHChapterQuizzes?.sessions||[])quiz.chapterId=chapterMap.get(quiz.chapterId);
  const byId=id=>LESSONS_DATA.find(l=>l.id===id);
  const amend=(id,fields)=>Object.assign(byId(id),fields);
  CHAPTERS_DATA[2].desc='Dall’albero della scena allo schermo: riconoscere la radice, raggiungere un figlio e aggiornare un’interfaccia con il codice.';
  CHAPTERS_DATA[8].title='Capitolo 9: Coordinate e vettori 2D';
  CHAPTERS_DATA[8].desc='Posizioni, spostamenti, distanze e direzioni. Questi calcoli preparano il movimento; non sono ancora un controller in tempo reale.';
  CHAPTERS_DATA[10].title='Capitolo 11: Timer, grafica e ciclo di vita';
  CHAPTERS_DATA[15].title='Capitolo 16: Organizzare dati e comportamento con le classi';
  amend(49,{
    theory:'<p>Una <strong>scena</strong> è un albero di nodi con una sola radice. Ogni nodo ha un compito: una <code>Label</code> mostra testo, un <code>Button</code> riceve clic, un <code>Node2D</code> organizza elementi nello spazio 2D. Non tutto in Godot è un nodo: texture e altri dati sono risorse.</p><p>Lo script è collegato a un nodo. <code>extends Node</code> indica il tipo di base compatibile; <code>_ready()</code> viene chiamata quando quel nodo e i suoi figli sono pronti. I percorsi partono dal nodo che possiede lo script, non sempre dalla radice del gioco.</p><p><code>$HUD/Contatore</code> raggiunge il figlio Contatore dentro HUD; equivale a <code>get_node("HUD/Contatore")</code>. Il percorso deve rispettare nomi e gerarchia. La proprietà <code>name</code> è il nome del nodo. Leggi l’albero prima di scrivere un percorso.</p><p>In questa lezione lo script è sulla radice e il figlio Giocatore è già presente. Nel laboratorio potrai creare, rinominare e spostare i nodi; cambiare gerarchia richiede anche di aggiornare i percorsi nello script.</p>',
    task:'<p>All’avvio, il registro deve mostrare <code>Nodo rilevato: Giocatore</code>. Ricava il nome dal nodo presente nell’albero, così il messaggio dipende dalla scena. Non creare un secondo giocatore.</p>',
    initialCode:'extends Node\n\nfunc _ready():\n    pass\n'
  });
  amend(50,{
    theory:'<p>La <strong>viewport</strong> è l’area in cui Godot disegna il gioco. Una <code>Label</code> è un nodo dell’interfaccia: la sua proprietà <code>text</code> determina le parole visibili. Una stampa in console serve invece per la diagnostica e non cambia lo schermo.</p><p>Una proprietà si legge e si modifica come una variabile, ma appartiene a un oggetto. Per esempio <code>$Avviso.text = "Porta chiusa"</code> cambia un’etichetta chiamata Avviso; <code>print($Avviso.text)</code> ne legge il contenuto.</p><p>Prima individua il nodo nell’albero, poi scegli la proprietà, infine assegna il valore. L’Inspector permette di impostare il valore iniziale; lo script può cambiarlo durante la partita. Quando fermi una scena nel laboratorio torni ai valori iniziali salvati.</p>',
    task:'<p>La schermata iniziale deve accogliere il giocatore con <code>Benvenuto in Godot 4!</code>. Usa la Label Titolo già presente. Nel registro mostra <code>Testo a schermo: </code> seguito dal contenuto effettivo dell’etichetta.</p>',
    initialCode:'extends Node\n\nfunc _ready():\n    pass\n'
  });
  amend(51,{
    theory:'<p>Un HUD rende leggibili dati come salute e punteggio. Per aggiornarlo devi distinguere il <strong>dato del gioco</strong> dal <strong>testo dell’interfaccia</strong>: un numero può essere usato nei calcoli; una stringa contiene anche etichette come HP.</p><p>Hai già incontrato variabili e <code>str()</code>. Per un contatore di monete potresti costruire <code>"Monete: " + str(monete)</code> e assegnare il risultato alla proprietà <code>text</code> della relativa Label.</p><p>Qui eserciti l’aggiornamento della proprietà con un valore richiesto. Nel prossimo lavoro con i pulsanti il valore cambierà a ogni evento. Evita di aggiungere una nuova Label a ogni aggiornamento: modifica quella esistente.</p>',
    task:'<p>La salute visualizzata deve passare da <code>HP: 100</code> a <code>HP: 75</code> all’avvio. Aggiorna SaluteLabel e registra <code>Nuova salute: </code> seguito dal testo che il giocatore vede.</p>',
    initialCode:'extends Node\n\nfunc _ready():\n    pass\n'
  });
  amend(53,{task:'<p>Il pulsante AttaccaBtn deve mostrare <code>Sferra Attacco</code> all’avvio. Il registro deve riportare <code>Pulsante configurato: </code> seguito dal testo effettivo del pulsante. In questa lezione configuri l’interfaccia; nella prossima la farai reagire al clic.</p>'});
  amend(54,{
    theory:'<p>Un <strong>segnale</strong> comunica che è avvenuto un evento. <code>Button.pressed</code> viene emesso quando l’utente attiva il pulsante. Una funzione collegata al segnale viene chiamata solo quando accade quell’evento, non continuamente.</p><p>Per esempio un pulsante Pausa può collegarsi con <code>$Pausa.pressed.connect(apri_menu)</code>. <code>apri_menu</code> è un riferimento alla funzione: aggiungere le parentesi la chiamerebbe immediatamente. Il collegamento si prepara normalmente in <code>_ready()</code>, una volta sola.</p><p>Il nome <code>_on_pausa_pressed</code> è una convenzione: da solo non collega nulla. In Godot puoi creare una connessione dall’editor o dal codice. In questo laboratorio la connessione va dichiarata nello script.</p>',
    task:'<p>All’avvio registra <code>Pulsante connesso</code>. Ogni pressione di AttaccaBtn deve poi produrre <code>Colpo sferrato con successo!</code>. Il colpo non deve partire durante l’inizializzazione. Scegli tu il nome della funzione che gestisce l’evento.</p>',
    initialCode:'extends Node\n\nfunc _ready():\n    pass\n'
  });
  amend(55,{
    task:'<p>Costruisci un contatore: parte da zero e ogni pressione di ClickBtn aggiunge un punto. Conserva lo stato nella variabile <code>punti</code>. PuntiLabel deve mostrare <code>Click: 1</code>, poi <code>Click: 2</code> e così via. All’avvio registra <code>Clicker pronto</code>; dopo ogni clic registra il testo aggiornato. Deve funzionare anche dopo più pressioni.</p>',
    initialCode:'extends Node\n\nvar punti = 0\n\nfunc _ready():\n    pass\n'
  });
  amend(56,{
    task:'<p>La plancia ha due comandi indipendenti. MotoriBtn deve mostrare <code>Motori a Massima Potenza</code> in StatoNave e registrare <code>Velocita Aumentata</code>. AllarmeBtn deve mostrare <code>Allarme Rosso Attivo</code> e registrare <code>Scudi al 100%</code>. All’avvio registra <code>Plancia Operativa</code>. Organizza autonomamente funzioni e connessioni; i comandi devono funzionare in qualsiasi ordine.</p>',
    initialCode:'extends Node\n\nfunc _ready():\n    pass\n'
  });
  amend(34,{task:'<p>Una posizione parte da <code>(100, 200)</code>. Lo spostamento orizzontale è conservato in <code>velocita</code>, inizialmente 50. Aggiorna la variabile <code>posizione</code> senza cambiare la coordinata verticale e stampa il vettore finale. Se cambi lo spostamento, il risultato deve adattarsi.</p><p>Questo è un singolo calcolo di spostamento: non descrive ancora una velocità in pixel al secondo o un movimento continuo.</p>'});
  for(const id of [49,50,51,52,53,54,55,56]){
    const lesson=byId(id);
    lesson.hasNodeTree=true;lesson.has2DViewport=true;
    lesson.hints=[
      {level:1,type:'concept',label:'Ragiona',text:id<=53?'Quale nodo possiede il dato richiesto? Distingui il testo visibile dall’output della console.':'Che cosa deve accadere all’avvio e che cosa deve accadere soltanto dopo un clic?'},
      {level:2,type:'structure',label:'Organizza',text:id<=53?'Parti dall’albero, raggiungi il nodo corretto e modifica o leggi la proprietà necessaria dentro _ready().':'Prepara le connessioni in _ready(). Metti il comportamento di ogni evento in una funzione e conserva fuori dalle funzioni lo stato che deve durare fra i clic.'},
      {level:3,type:'example',label:'Soluzione commentata',text:'Confronta il tuo tentativo con questo esempio e individua quale passaggio ti mancava:\n'+lesson.solution}
    ];
  }
  LESSONS_DATA.forEach((lesson,index)=>{
    lesson.displayIndex=index+1;
    lesson.title=(index+1)+'. '+lesson.title.replace(/^\d+\.\s*/, '');
  });
  window.GDHCurriculumVersion=3;
})();
