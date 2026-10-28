(function installQuizEngine(){
  "use strict";
  if(typeof App==="undefined"||!window.GDHChapterQuizzes)return;
  const html=text=>App.escapeHtml(String(text??""));
  const format=text=>html(text).replace(/`([^`]+)`/g,"<code>$1</code>");
  const nextLesson=id=>window.LESSONS_DATA[window.LESSONS_DATA.findIndex(l=>l.id===id)+1]||null;
  const status=()=>document.getElementById("quiz-inline-status");
  function draftKey(id){return "gdh_chapter_quiz_v1:"+String(App._saveOwner||"guest")+":"+id;}
  function saveDraft(){try{sessionStorage.setItem(draftKey(App.state.currentLessonId),JSON.stringify(App._quizAnswers||{}));}catch(e){}}
  function readDraft(id){
    try{const v=JSON.parse(sessionStorage.getItem(draftKey(id))||"{}");
      return v&&typeof v==="object"&&!Array.isArray(v)?v:{};}catch(e){return {};}
  }
  App.openQuiz=function(id){
    const item=window.LESSONS_DATA.find(l=>l.id===id&&l.isQuiz);
    if(!item)return;
    if(!this.state.devAllUnlocked&&!this.state.completedLessons.includes(id)&&!this.state.finishedLessons.includes(id)){
      SoundFX.playError();return;
    }
    this.isReviewMode=false;
    this.currentReviewVariant=null;
    this.state.currentLessonId=id;
    this._quizAnswers=readDraft(id);
    this.switchView("view-quiz");
    this.updateNavSelection("exercise");
    this.renderQuiz();
  };
  App.renderQuiz=function(){
    const item=window.LESSONS_DATA.find(l=>l.id===this.state.currentLessonId&&l.isQuiz);
    const main=document.getElementById("quiz-main");
    if(!item||!main)return;
    const done=this.state.finishedLessons.includes(item.id);
    const quizNumber=window.GDHChapterQuizzes.get(item.id)?.part||1;
    main.innerHTML=`
      <div class="gdh-quiz-top">
        <button class="gdh-quiz-back" type="button" id="quiz-back">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          Torna alla mappa
        </button>
        <span class="gdh-quiz-reward">${done?"Completato":("+"+item.xp+" XP")}</span>
      </div>
      <div class="gdh-quiz-heading">
        <span class="gdh-quiz-kicker">CAPITOLO ${item.chapterId} · QUIZ ${quizNumber}/2</span>
        <h1>${html(item.title.replace(/^\d+\.\s*/,""))}</h1>
        <p>${html(item.quizDescription)}</p>
        <div class="gdh-quiz-instructions">Tre domande: risposta singola, risposte multiple e completamento di codice. Puoi riprovare senza penalità.</div>
      </div>
      <div class="gdh-quiz-progress" aria-label="Tre domande"><span></span><span></span><span></span></div>
      <form id="chapter-quiz-form" novalidate>
      ${item.quizQuestions.map((q,i)=>{
        const label={single:"Una risposta",multi:"Più risposte",code:"Completa il codice"}[q.type];
        const selection=Array.isArray(this._quizAnswers?.[q.id])?this._quizAnswers[q.id]:[];
        return `<fieldset class="gdh-quiz-question" id="quiz-question-${i}">
          <legend><span class="gdh-quiz-index">${i+1}</span><span class="gdh-quiz-kind">${label}</span></legend>
          <p class="gdh-quiz-prompt">${format(q.prompt)}</p>
          ${q.type==="code"?`<pre class="gdh-quiz-code"><code>${html(q.code).replace("□□□□",'<span class="gdh-quiz-blank" aria-label="Codice mancante">□□□□</span>')}</code></pre>`:""}
          <div class="gdh-quiz-options">${q.options.map((option,j)=>`
            <label class="gdh-quiz-option">
              <input type="${q.type==="multi"?"checkbox":"radio"}" name="quiz-${item.id}-${q.id}"
                value="${j}" data-question="${q.id}" ${selection.includes(j)?"checked":""}/>
              <span class="gdh-quiz-option-key" aria-hidden="true">${String.fromCharCode(65+j)}</span>
              <span class="gdh-quiz-option-label">${q.type==="code"?"<code>"+html(option)+"</code>":format(option)}</span>
            </label>`).join("")}</div>
          <button type="button" class="gdh-quiz-hint-btn" data-hint="${i}" aria-expanded="false">Mostra un indizio</button>
          <p class="gdh-quiz-hint" id="quiz-hint-${i}" hidden>${html(q.hint)}</p>
          <div class="gdh-quiz-feedback" id="quiz-feedback-${i}" aria-live="polite" hidden></div>
        </fieldset>`;
      }).join("")}
        <p id="quiz-inline-status" class="gdh-quiz-status" role="status" aria-live="polite"></p>
        <div class="gdh-quiz-actions">
          <button class="gdh-quiz-verify" type="submit">Verifica le risposte</button>
          <button class="gdh-quiz-reset" id="quiz-reset" type="button">Ricomincia</button>
        </div>
      </form>
      <div id="quiz-completion" class="gdh-quiz-completion" hidden aria-live="polite"></div>
    `;
    document.getElementById("quiz-back").onclick=()=>{SoundFX.playClick();this.showRoadmap();};
    document.getElementById("chapter-quiz-form").addEventListener("change",event=>{
      const input=event.target.closest("input[data-question]");
      if(!input)return;
      const id=input.dataset.question;
      const selected=[...main.querySelectorAll('input[data-question="'+id+'"]:checked')].map(el=>Number(el.value));
      this._quizAnswers[id]=selected;
      saveDraft();
      const feedback=document.getElementById("quiz-feedback-"+item.quizQuestions.findIndex(q=>q.id===id));
      if(feedback)feedback.hidden=true;
      const question=input.closest(".gdh-quiz-question");
      if(question)question.classList.remove("is-correct","is-wrong");
      if(status())status().textContent="";
    });
    main.querySelectorAll("[data-hint]").forEach(button=>button.onclick=()=>{
      const target=document.getElementById("quiz-hint-"+button.dataset.hint);
      target.hidden=!target.hidden;
      button.setAttribute("aria-expanded",String(!target.hidden));
      button.textContent=target.hidden?"Mostra un indizio":"Nascondi indizio";
    });
    document.getElementById("chapter-quiz-form").addEventListener("submit",event=>{event.preventDefault();this.gradeCurrentQuiz();});
    document.getElementById("quiz-reset").onclick=()=>{
      this._quizAnswers={};
      saveDraft();
      this.renderQuiz();
    };
  };
  App.gradeCurrentQuiz=function(){
    const item=window.LESSONS_DATA.find(l=>l.id===this.state.currentLessonId&&l.isQuiz);
    if(!item)return;
    const answers=this._quizAnswers||{};
    const incomplete=item.quizQuestions.some(q=>!Array.isArray(answers[q.id])||answers[q.id].length===0);
    if(incomplete){
      status().textContent="Rispondi a tutte e tre le domande prima di verificare.";
      status().dataset.state="warning";
      return;
    }
    const results=window.GDHChapterQuizzes.grade(window.GDHChapterQuizzes.get(item.id),answers);
    for(let i=0;i<results.length;i++){
      const result=results[i],q=item.quizQuestions[i];
      const panel=document.getElementById("quiz-feedback-"+i);
      const fieldset=document.getElementById("quiz-question-"+i);
      fieldset.classList.toggle("is-correct",result.correct);
      fieldset.classList.toggle("is-wrong",!result.correct);
      panel.hidden=false;
      panel.replaceChildren();
      const heading=document.createElement("strong");
      heading.textContent=result.correct?"Risposta corretta":"Da rivedere";
      const body=document.createElement("p");
      body.textContent=q.explanation;
      panel.append(heading,body);
    }
    const correct=results.filter(r=>r.correct).length;
    document.querySelectorAll(".gdh-quiz-progress span").forEach((el,i)=>el.classList.toggle("passed",results[i].correct));
    if(correct!==results.length){
      status().textContent=correct+" su "+results.length+" risposte corrette. Rivedi le spiegazioni, correggi le risposte e verifica di nuovo.";
      status().dataset.state="warning";
      SoundFX.playError();
      return;
    }
    const first=!this.state.finishedLessons.includes(item.id);
    if(first){
      this.state.finishedLessons.push(item.id);
      this.state.xp+=item.xp;
      this.ensureUnlockedConsistency();
      this.saveStorage();
      this.updateStatsUI({announceLevelUp:true});
      this.recordDailyQuestProgress("daily_exercise",1);
      this.recordDailyActivity();
      SoundFX.playSuccess();
      window.ConfettiFX?.burst?.();
    }
    status().textContent="Ottimo! Hai compreso gli argomenti di questo quiz.";
    status().dataset.state="success";
    const next=nextLesson(item.id),done=document.getElementById("quiz-completion");
    done.hidden=false;
    done.innerHTML=`<strong>Quiz superato: ${correct}/${results.length}</strong>
      <p>${first?"Hai guadagnato "+item.xp+" XP.":"Avevi già completato questo quiz: nessun XP duplicato."}</p>
      <div class="gdh-quiz-actions">
        ${next?'<button type="button" id="quiz-next" class="gdh-quiz-verify">Prossima attività</button>':""}
        <button type="button" id="quiz-map" class="gdh-quiz-reset">Torna alla mappa</button>
      </div>`;
    if(next)document.getElementById("quiz-next").onclick=()=>this.openLesson(next.id);
    document.getElementById("quiz-map").onclick=()=>this.showRoadmap();
    document.querySelector("#chapter-quiz-form .gdh-quiz-actions").hidden=true;
    document.getElementById("quiz-back").focus({preventScroll:true});
  };
  window.GDHQuizEngine=Object.freeze({version:1});
})();
