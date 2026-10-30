'use strict';
/* GDScript Hero stable path: authored outcomes and prerequisites for every
 * chapter and every practical activity. No renumbering, no replaced tests.
 */
(() => {
 const plans=[
  [1,'Avviare uno script Godot e interpretare l output del programma','Nessuno','Terminale di avvio',
   [[1,'Stampare il primo messaggio da _ready()'],[2,'Documentare e disattivare istruzioni con i commenti'],[3,'Distinguere testo e numeri nelle stampe'],[101,'Comprendere il momento e l ordine di esecuzione di _ready()'],[4,'Completare un piccolo terminale con messaggi ordinati']]],
  [2,'Conservare dati e comporre testo a partire da variabili','Capitolo 1','Dialogo con un personaggio',
   [[5,'Dichiarare e utilizzare una variabile'],[6,'Distinguere String e int'],[7,'Comporre stringhe usando variabili'],[102,'Convertire numeri in testo con str()'],[8,'Creare un dialogo con codice e testo dinamici']]],
  [3,'Leggere una gerarchia di nodi e aggiornare una Label reale','Capitoli 1 e 2','Targhetta visibile di un dungeon',
   [[49,'Distinguere radice e figli della scena'],[50,'Cambiare testo visibile di una Label'],[51,'Usare il percorso di un nodo figlio con $'],[119,'Creare e aggiungere un nodo alla gerarchia'],[52,'Aggiornare una piccola interfaccia con piu Label']]],
  [4,'Scegliere tipi corretti e mantenere invarianti con costanti','Capitoli 1 e 2','Scheda personaggio tipizzata',
   [[9,'Rappresentare numeri decimali e valori booleani'],[10,'Dichiarare esplicitamente i tipi delle variabili'],[11,'Definire una costante che non cambia'],[103,'Usare la inferenza del tipo con :='],[12,'Combinare dati tipizzati in una scheda RPG']]],
  [5,'Scrivere formule aritmetiche corrette per risorse e danni','Capitolo 4','Calcolo di bottino e salute',
   [[13,'Applicare operatori aritmetici e resto della divisione'],[14,'Aggiornare una variabile usando += e -='],[15,'Calcolare ricompense e danni da dati iniziali'],[104,'Controllare le precedenze con le parentesi'],[16,'Combinare calcoli in una ricompensa di gruppo']]],
  [6,'Tradurre regole del gioco in confronti e condizioni','Capitoli 4 e 5','Portale con controlli di accesso',
   [[17,'Confrontare valori con espressioni booleane'],[18,'Combinare condizioni con and e or'],[19,'Gestire due esiti con if ed else'],[105,'Gestire piu esiti con elif'],[106,'Negare una condizione con not'],[20,'Decidere se un portale puo essere aperto']]],
  [7,'Separare operazioni riutilizzabili in funzioni','Capitolo 6','Calcolatore di colpi critici',
   [[29,'Definire e richiamare una funzione'],[30,'Passare valori tramite parametri'],[31,'Restituire risultati con return'],[111,'Utilizzare parametri opzionali'],[112,'Distinguere variabili locali e risultati'],[32,'Comporre funzioni per un sistema di danno']]],
  [8,'Creare e collegare controlli UI ai comportamenti del gioco','Capitoli 3 e 7','Clicker e pannello di controllo',
   [[53,'Configurare un Button reale'],[54,'Collegare il segnale pressed a una callback'],[55,'Aggiornare un contatore dopo un clic'],[120,'Creare e collegare un pulsante interamente via script'],[56,'Coordinare piu pulsanti e Label in una scena']]],
  [9,'Usare Vector2 per rappresentare posizioni e direzioni','Capitolo 5','Calcoli per un radar 2D',
   [[33,'Leggere e costruire coordinate Vector2'],[34,'Spostare un punto nello spazio 2D'],[35,'Combinare piu spostamenti su due assi'],[113,'Misurare distanze tra punti'],[114,'Calcolare una direzione normalizzata'],[36,'Verificare se una destinazione e raggiunta']]],
  [10,'Controllare un personaggio con fisica e raggiungere un obiettivo','Capitoli 3, 6, 8 e 9','Minigioco con moneta da raccogliere',
   [[301,'Spostare un nodo in funzione di delta'],[302,'Leggere input direzionale e muovere CharacterBody2D'],[303,'Gestire il contatto con un muro'],[304,'Raccogliere una moneta e mostrare la vittoria']]],
  [11,'Gestire tempo, elementi visivi e ciclo di vita dei nodi','Capitolo 10','Negozio e HUD interattivo',
   [[57,'Configurare e avviare un Timer'],[58,'Modificare un ColorRect'],[59,'Rimuovere nodi con queue_free()'],[121,'Calcolare un aggiornamento mediante delta'],[60,'Collegare acquisti e aggiornamenti nella bottega']]],
  [12,'Gestire collezioni di oggetti e dati dell inventario','Capitoli 2 e 6','Modello dati di uno zaino',
   [[21,'Rappresentare oggetti in un Array'],[22,'Accedere a elementi tramite indice'],[23,'Aggiungere elementi con append() e contarli'],[107,'Cercare e rimuovere un oggetto'],[108,'Usare Array tipizzati'],[24,'Aggiornare coerentemente il contenuto dello zaino']]],
  [13,'Ripetere operazioni e gestire eventi ripetuti','Capitolo 12','Simulazione delle ondate',
   [[25,'Iterare un intervallo con for e range()'],[26,'Visitare tutti gli elementi di un Array'],[27,'Controllare un ciclo while'],[109,'Interrompere un ciclo con break'],[110,'Saltare un elemento con continue'],[28,'Calcolare ricompense da una serie di nemici']]],
  [14,'Rappresentare entita attraverso dizionari di proprieta','Capitoli 5, 6 e 12','Statistiche di un boss',
   [[37,'Associare chiavi e valori in un Dictionary'],[38,'Modificare e aggiungere proprieta'],[39,'Controllare esistenza e chiavi'],[115,'Usare un valore predefinito con get()'],[40,'Aggiornare i dati del boss in combattimento']]],
  [15,'Comunicare tra componenti senza accoppiarle inutilmente','Capitoli 7, 8 e 11','Sistema di eventi di battaglia',
   [[41,'Dichiarare ed emettere un segnale'],[42,'Connettere un segnale a una funzione'],[43,'Trasmettere parametri tramite segnali'],[116,'Reagire a un evento modificando il comportamento'],[44,'Coordinare notifiche di salute in battaglia']]],
  [16,'Organizzare entita e responsabilita in classi e istanze','Capitoli 7, 12 e 14','Sistema di personaggi RPG riutilizzabile',
   [[45,'Definire una classe con _init()'],[46,'Creare piu istanze indipendenti'],[47,'Incapsulare comportamenti in metodi'],[117,'Usare tipi espliciti nei metodi'],[118,'Verificare che ogni istanza mantenga il proprio stato'],[48,'Comporre un piccolo gruppo di personaggi con classi']]]
 ];
 const lessons=window.LESSONS_DATA,chapters=window.CHAPTERS_DATA;
 if(!Array.isArray(lessons)||chapters?.length!==16)throw Error('Load curriculum restructure first');
 const ids=new Set(),sections=[];
 for(const [num,outcome,prerequisites,project,skills] of plans){
  const chapter=chapters.find(c=>c.id===num);
  if(!chapter)throw Error('Capitolo non trovato: '+num);
  chapter.learningOutcome=outcome;
  chapter.prerequisites=prerequisites;
  chapter.practiceProject=project;
  sections.push({chapter:num,outcome,prerequisites,project,lessons:skills.map(x=>x[0])});
  for(const [id,goal] of skills){
   if(ids.has(id))throw Error('Obiettivo duplicato: '+id);
   ids.add(id);
   const lesson=lessons.find(l=>l.id===id);
   if(!lesson||lesson.isQuiz||lesson.chapterId!==num)throw Error('Obiettivo fuori ordine: '+id);
   lesson.learningGoal=goal;
   lesson.learningPrerequisites=prerequisites;
   lesson.learningProject=project;
   const context='<div class="course-learning-objective"><strong>Obiettivo della lezione</strong><span>'+
      goal+'</span><small>Nel percorso: '+project+'.</small></div>';
   lesson.theory=context+(lesson.theory||'');
  }
 }
 if(ids.size!==85||lessons.filter(l=>!l.isQuiz).length!==85)
  throw Error('La mappa finale deve coprire tutte le 85 lezioni.');
 const count=lessons.filter(l=>l.isQuiz).length;
 if(count!==30)throw Error('Il percorso ha perso quiz.');
 window.GDHCourseContract=Object.freeze({version:4,chapters:Object.freeze(sections),
   lessonIds:Object.freeze([...ids])});
})();
