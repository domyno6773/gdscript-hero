'use strict';
// Quiz di meta-capitolo: domande soltanto su competenze gia insegnate.
// ID stabili e risposte corrette negli stessi indici: nessuna migrazione XP.
(() => {
 const bank=window.GDHChapterQuizzes?.sessions||[];
 const fix=(id,qid,data)=>{
  const quiz=bank.find(x=>x.id===id),q=quiz?.questions.find(x=>x.id===qid);
  if(!q)throw Error('Quiz mancante: '+id+'/'+qid);
  Object.assign(q,data);
 };
 fix(205,'q3',{
  prompt:'Completa una dichiarazione con tipo intero esplicito.',
  code:'func _ready():\n    □□□□\n    print(carica)',
  options:['var carica: int = 50','var carica: String = 50','var carica: bool = 50','var carica: float = "50"'],
  explanation:'Il tipo int si dichiara con i due punti. L inferenza dei tipi sara insegnata dopo questo quiz.',
  hint:'Il valore 50 e un intero: indica int.'
 });
 fix(207,'q1',{
  prompt:'Qual e il resto della divisione 15 % 4?',
  options:['3','4','11','3.75'],
  explanation:'L operatore % restituisce il resto intero: 15 diviso 4 lascia resto 3.',
  hint:'Raggruppa 15 oggetti in gruppi da quattro.'
 });
 fix(207,'q2',{
  prompt:'Quali istruzioni aggiornano una variabile salute gia dichiarata?',
  options:['salute += 5','salute -= 5','salute = salute - 5','salute == 5'],
  explanation:'I primi tre aggiornano la salute. == confronta invece di assegnare.',
  hint:'Cerca assegnazioni, non confronti.'
 });
 fix(209,'q1',{
  prompt:'Se ha_chiave e true e porta_bloccata e false, quanto vale ha_chiave and not porta_bloccata?',
  options:['true','false','null','10'],
  explanation:'Entrambe le condizioni sono vere: esiste la chiave e la porta non e bloccata.',
  hint:'Valuta prima not, quindi and.'
 });
 fix(215,'q1',{
  prompt:'A cosa serve il parametro nome in func saluta(nome):?',
  options:['Passa alla funzione un valore scelto dal chiamante','La esegue ad ogni frame','Crea un Button','Interrompe la funzione'],
  explanation:'I parametri permettono a una stessa funzione di operare su valori diversi.',
  hint:'Confronta saluta("Lia") e saluta("Milo").'
 });
 fix(215,'q2',{
  prompt:'Quali intestazioni definiscono una funzione GDScript valida?',
  options:['func saluta():','func saluta(nome):','func aggiorna(a, b):','function saluta() {}'],
  explanation:'La sintassi GDScript usa func e due punti alla fine.',
  hint:'Controlla la parola iniziale e la punteggiatura.'
 });
 fix(215,'q3',{
  prompt:'Completa una funzione con parametro che stampa un saluto dinamico.',
  code:'func saluta(nome):\n    □□□□\n\nfunc _ready():\n    saluta("Lia")',
  options:['print("Ciao " + nome)','print("Ciao nome")','saluta(nome)','func saluta(): print(nome)'],
  explanation:'Usa il parametro ricevuto nel messaggio, non il suo nome letterale.',
  hint:'Un parametro contiene un valore: puoi concatenarlo al testo.'
 });
 fix(211,'q2',{
  prompt:'Quali frasi sono vere per var oggetti = ["Arco", "Pozione", "Mappa"]?',
  options:['oggetti[0] contiene "Arco"','oggetti[1] contiene "Pozione"','oggetti[2] contiene "Mappa"','oggetti[3] contiene l ultimo elemento'],
  explanation:'I tre elementi hanno indici da 0 a 2; i metodi Array si studiano dopo.',
  hint:'Gli indici iniziano da zero.'
 });
 fix(211,'q3',{
  prompt:'Leggi il secondo oggetto senza modificare lo zaino.',
  code:'func _ready():\n    var zaino = ["Mappa", "Torcia"]\n    print(□□□□)',
  options:['zaino[1]','zaino[2]','zaino[0]','zaino["Torcia"]'],
  explanation:'La posizione 1 individua il secondo elemento della lista.',
  hint:'La numerazione inizia da zero.'
 });
 window.GDHCurriculumQuizAlignment=Object.freeze({version:1,corrected:[205,207,209,215,211]});
})();
