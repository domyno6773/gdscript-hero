'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const P=require('../progression.js');
assert.equal(P.threshold(1),0);
for(const [level,xp] of [[5,360],[10,1260],[20,4560],[30,9860],[40,17160],[50,26460]])
    assert.equal(P.threshold(level),xp);
for(const [xp,level] of [[0,1],[1259,9],[1260,10],[4559,19],[4560,20],[9859,29],[9860,30],[26460,50],[10000000,998]])
    if(xp===10000000)assert.ok(P.levelFromXp(xp).tier.level>50);
    else assert.equal(P.levelFromXp(xp).tier.level,level);
assert.equal(P.levelFromXp(4560).grade.title,'Forgiatore');
assert.equal(P.weekKey('2026-12-31T23:59:00Z'),P.weekKey('2027-01-01T00:01:00Z'));
assert.notEqual(P.weekKey('2026-10-25T23:59:00Z'),P.weekKey('2026-10-26T00:01:00Z'));
const date=new Date('2026-10-27T12:00:00Z');
let state=P.createRewards(100,date);
assert.equal(P.grantRecurring(state,'quests','daily:2026-10-27:a',10,date),10);
assert.equal(P.grantRecurring(state,'quests','daily:2026-10-27:a',10,date),0);
for(let i=0;i<3;i++)assert.equal(P.grantRecurring(state,'quests','other:'+i,10,date),10);
assert.equal(P.grantRecurring(state,'quests','over',10,date),0);
for(let i=0;i<12;i++)assert.equal(P.grantRecurring(state,'reviews','v:'+i,5,date),5);
assert.equal(P.grantRecurring(state,'reviews','last',5,date),0);
assert.equal(P.grantRecurring(state,'streak','week',20,date),20);
assert.equal(state.totals.reviews+state.totals.quests+state.totals.streak,120);
const newer=new Date('2026-11-02T12:00:00Z');
assert.equal(P.grantRecurring(state,'reviews','v:0',5,newer),5);
assert.equal(state.totals.reviews,5);
const left=P.createRewards(0,date),right=P.createRewards(0,date);
P.grantRecurring(left,'quests','a',10,date);
P.grantRecurring(right,'quests','b',10,date);
const merged=P.mergeRewards(left,right,50,date);
assert.equal(merged.totals.quests,20);
assert.equal(P.grantRecurring(merged,'quests','a',10,date),0);
const before=P.normalizeRewards(null,100,{date:'2026-10-27',claimed:{daily_exercise:true}},date);
assert.equal(P.grantRecurring(before,'quests','daily:2026-10-27:daily_exercise',10,date),0);

const window={addEventListener:()=>{}};
const context={window,ProgressionV2:P,console,Date,document:{getElementById:()=>null}};
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(root,'lessons.js'),'utf8'),{window,ProgressionV2:P,console});
context.DAILY_QUESTS_CONFIG=window.DAILY_QUESTS_CONFIG;
context.SoundFX={playFanfare(){},playClick(){}};
context.ConfettiFX={burst(){}};
const app=window.App;
app.state.xp=0;
app.state.rewardsV2=P.createRewards(0);
app.state.dailyQuests={date:P.dateKey(),progress:{daily_exercise:0,review_success:0,study_variety:0},
    claimed:{daily_exercise:false,review_success:false,study_variety:false}};
let saved=0,latestSave=null,latestToast=null;
app.saveStorage=()=>{saved++;latestSave=JSON.parse(JSON.stringify({dailyQuests:app.state.dailyQuests,xp:app.state.xp,rewardsV2:app.state.rewardsV2}));};
app.showToast=data=>{latestToast=data};
app.checkAchievements=()=>{};
app.updateStatsUI=()=>{};
app.updateQuestsBadge=()=>{};
app.renderSidebarDailyQuests=()=>{};
assert.equal(app.claimQuestReward('not-a-quest'),false);
assert.equal(app.claimQuestReward('daily_exercise'),false);
assert.equal(app.state.xp,0);
app.state.dailyQuests.progress.daily_exercise=1;
assert.equal(app.claimQuestReward('daily_exercise'),true);
assert.equal(app.claimQuestReward('daily_exercise'),false);
assert.equal(app.state.xp,10);
assert.equal(app.state.claimedQuestsCount,1);
assert.ok(saved>0);
// Regressione: il limite settimanale prima lasciava il pulsante "Riscatta"
// attivo per sempre, anche quando il giocatore aveva completato l'obiettivo.
const capState=P.createRewards(0);
for(let n=0;n<4;n++)
    assert.equal(P.grantRecurring(capState,'quests','previous:'+n,10),10);
app.state.rewardsV2=capState;
app.state.dailyQuests.progress.review_success=1;
const beforeCapXp=app.state.xp;
const beforeCapCount=app.state.claimedQuestsCount;
assert.equal(app.claimQuestReward('review_success'),true,
    'Missione completa anche se il budget settimanale XP e' terminato');
assert.equal(app.state.xp,beforeCapXp,'Il limite XP non viene aggirato');
assert.equal(app.state.claimedQuestsCount,beforeCapCount+1);
assert.equal(app.state.dailyQuests.claimed.review_success,true);
assert.ok(latestToast.desc.includes('limite di 40 XP'));
assert.equal(app.claimQuestReward('review_success'),false,'Doppio riscatto vietato');
assert.equal(app.state.claimedQuestsCount,beforeCapCount+1);
assert.equal(latestSave.dailyQuests.claimed.review_success,true,
    'Il salvataggio deve mantenere la missione completata');
app.state.dailyQuests=latestSave.dailyQuests;
assert.equal(app.claimQuestReward('review_success'),false,
    'Ricaricare lo stato salvato non deve riproporre il riscatto');

// La fusione con cloud obsoleto non deve cancellare lo stato riscattato.
vm.runInNewContext(fs.readFileSync(path.join(root,'auth.js'),'utf8'),context);
const auth=window.AuthManager;
const dateStr=P.dateKey();
const local={xp:10,dailyQuests:{date:dateStr,
  progress:{daily_exercise:1,review_success:1,study_variety:0},
  claimed:{daily_exercise:true,review_success:true,study_variety:false}}};
const cloud={xp:10,dailyQuests:{date:dateStr,
  progress:{daily_exercise:1,review_success:0,study_variety:0},
  claimed:{daily_exercise:false,review_success:false,study_variety:false}}};
const mergedCloud=auth.mergeProgress(local,cloud);
assert.equal(mergedCloud.dailyQuests.claimed.daily_exercise,true);
assert.equal(mergedCloud.dailyQuests.claimed.review_success,true);
assert.equal(mergedCloud.dailyQuests.progress.review_success,1);
const oldDate={...cloud,dailyQuests:{...cloud.dailyQuests,date:'2026-01-01'}};
assert.equal(auth.mergeProgress(local,oldDate).dailyQuests.date,dateStr,
    'La giornata vecchia non deve sovrascrivere quella corrente');
console.log('XP 2.0 and quest claim regression tests passed.');
