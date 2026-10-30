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
 fix(203,'q2',{
  options:['var hp = 100','var nome = "Lia"','var livello = 3','var 3vite = 10'],
  explanation:'I primi tre esempi dichiarano numeri interi o testo. Un nome non può iniziare con una cifra.'
 });
 fix(225,'q2',{
  options:['Leggerne il nome','Accedere a un figlio','Modificare il testo di una Label','Usarlo sempre senza un parent nell\'albero'],
  explanation:'Hai già usato nomi, percorsi e proprietà. Aggiungere nuovi figli sarà il passo successivo.'
 });
 fix(226,'q2',{
  options:['Controllare il percorso rispetto al nodo corrente','Considerare che il nome potrebbe essere errato','Rispettare i nomi dei nodi mostrati nell\'albero','Supporre che $QualsiasiNome esista sempre'],
  explanation:'Per raggiungere un nodo, il percorso e i nomi devono corrispondere alla gerarchia reale.'
 });
 fix(209,'q3',{
  prompt:'Completa il confronto: la porta richiede almeno 10 punti di energia.',
  code:'func _ready():\n    var energia = 12\n    print(□□□□)',
  options:['energia >= 10','energia < 10','energia == 10','energia != 12'],
  explanation:'>= include sia la soglia 10 sia i valori superiori. Il blocco if sarà introdotto nella prossima lezione.',
  hint:'Serve un confronto vero per 10, 11, 12 e i valori successivi.'
 });
 fix(213,'q2',{
  prompt:'Quali affermazioni descrivono i cicli for già studiati?',
  options:['for può attraversare gli elementi di un Array','range(3) produce 0, 1 e 2','Il blocco indentato si esegue per ogni elemento','range(3) include anche il valore 3'],
  explanation:'for visita gli elementi in ordine; il limite finale di range è escluso.',
  hint:'Distingui quanti valori vengono prodotti dal valore finale escluso.'
 });
 fix(219,'q2',{
  options:['eroe["nome"] legge il nome','eroe["vita"] legge la salute','eroe["vita"] = 80 aggiorna la salute','eroe[0] restituisce sempre "Lia"'],
  explanation:'Le chiavi dichiarate sono stringhe. Con le parentesi quadre puoi leggere o assegnare il valore associato.',
  hint:'Usa le chiavi effettivamente presenti nel dizionario.'
 });
 window.GDHCurriculumQuizAlignment=Object.freeze({version:2,corrected:[203,205,207,209,211,213,215,219,225,226]});
})();
