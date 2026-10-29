'use strict';
// GDScript Hero 2.0 — regole condivise della progressione personale.
// IMPORTANTE: questa logica nel browser NON certifica XP o classifiche ufficiali.
const ProgressionV2 = (() => {
    const GRADES = Object.freeze([
        {level:10,title:'Esploratore',color:'#48a99f',icon:'compass'},
        {level:20,title:'Forgiatore',color:'#619bd2',icon:'hammer'},
        {level:30,title:'Architetto',color:'#aa89db',icon:'blocks'},
        {level:40,title:'Maestro',color:'#dfb555',icon:'crown'},
        {level:50,title:'Leggenda',color:'#d78cbd',icon:'gem'}
    ]);
    // I limiti settimanali valgono solo per ripasso e streak.
    const CAPS = Object.freeze({reviews:60,streak:20});
    const TYPES = Object.freeze(['reviews','quests','streak']);
    const limitFor = type => type === 'quests' ? Infinity : CAPS[type];
    const DAY = 86400000;
    const asDate = value => value instanceof Date ? value : new Date(value);
    const dateKey = (date = new Date()) => { const d = asDate(date); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'); };
    function weekKey(date = new Date()) {
        const input = asDate(date);
        const d = new Date(Date.UTC(input.getUTCFullYear(),input.getUTCMonth(),input.getUTCDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const year = d.getUTCFullYear();
        const week = Math.ceil((((d - new Date(Date.UTC(year,0,1))) / DAY) + 1) / 7);
        return year + '-W' + String(week).padStart(2,'0');
    }
    const threshold = level => {
        const n = Math.max(1,Math.floor(Number(level) || 1));
        return (n-1)*(10*n+40);
    };
    function levelFromXp(value) {
        const xp = Number.isFinite(Number(value)) ? Math.max(0,Math.floor(Number(value))) : 0;
        // Soglia (L-1)*(10L+40); correggere l'arrotondamento della radice.
        let level = Math.max(1,Math.floor((-30+Math.sqrt(900+40*(xp+40)))/20));
        while (threshold(level+1) <= xp) level++;
        while (level>1 && threshold(level)>xp) level--;
        const minXp=threshold(level), nextXp=threshold(level+1);
        const grade=GRADES.filter(g=>level>=g.level).at(-1)||null;
        return {
            tier:{level,title:grade?grade.title:'Apprendista Godot',minXp,maxXp:nextXp-1},
            grade,percent:Math.min(100,Math.max(0,Math.round(100*(xp-minXp)/(nextXp-minXp)))),
            xpToNext:nextXp-xp,nextXp
        };
    }
    function createRewards(legacyXp = 0, date = new Date()) {
        return {version:2,legacyXp:Math.max(0,Number(legacyXp)||0),week:weekKey(date),
            claims:{},totals:{reviews:0,quests:0,streak:0}};
    }
    function normalizeRewards(source,legacyXp=0,dailyQuests=null,date=new Date()) {
        const week=weekKey(date);
        if (!source || source.version!==2) {
            const next=createRewards(legacyXp,date);
            // Una missione riscattata prima della migrazione non torna disponibile.
            if(dailyQuests?.date===dateKey(date)) {
                for(const [id,claimed] of Object.entries(dailyQuests.claimed||{})) {
                    if(claimed) next.claims['quests:daily:'+dateKey(date)+':'+id]=10;
                }
                next.totals.quests=Object.values(next.claims).reduce((s,n)=>s+n,0);
            }
            return next;
        }
        const next={version:2,legacyXp:Math.max(0,Number(source.legacyXp)||0),week,
            claims:{},totals:{reviews:0,quests:0,streak:0}};
        if(source.week===week) {
            for(const [key,value] of Object.entries(source.claims||{})) {
                const type=key.split(':')[0];
                const amount=Number(value);
                if(!TYPES.includes(type) || !Number.isFinite(amount) || amount<=0) continue;
                next.claims[key]=Math.min(amount,limitFor(type));
            }
            for(const type of TYPES) {
                next.totals[type]=Math.min(limitFor(type),Object.entries(next.claims)
                    .filter(([k])=>k.startsWith(type+':')).reduce((sum,[,v])=>sum+v,0));
            }
        }
        return next;
    }
    function grantRecurring(rewards,type,sourceId,amount,date=new Date()) {
        if(!TYPES.includes(type) || typeof sourceId!=='string' || !sourceId ||
            !Number.isInteger(amount) || amount<=0) return 0;
        const state=normalizeRewards(rewards,0,null,date);
        Object.assign(rewards,state);
        const key=type+':'+sourceId;
        if(Object.hasOwn(rewards.claims,key)) return 0;
        const available=limitFor(type)-rewards.totals[type];
        if(available < amount) return 0;
        rewards.claims[key]=amount;
        rewards.totals[type]+=amount;
        return amount;
    }
    function mergeRewards(left,right,xp,date=new Date()) {
        const week=weekKey(date);
        const a=normalizeRewards(left,xp,null,date), b=normalizeRewards(right,xp,null,date);
        const output=createRewards(Math.max(a.legacyXp,b.legacyXp),date);
        for(const v of [a,b]) if(v.week===week) {
            for(const [key,value] of Object.entries(v.claims)) {
                output.claims[key]=Math.max(output.claims[key]||0,value);
            }
        }
        for(const type of TYPES) {
            output.totals[type]=Math.min(limitFor(type),Object.entries(output.claims)
                .filter(([key])=>key.startsWith(type+':')).reduce((sum,[,val])=>sum+val,0));
        }
        return output;
    }
    function gradeIcon(grade) {
        if (!grade) return '';
        const paths={
            compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
            hammer:'<path d="m14 4 6 6-3 3-6-6M4 20l10-10M13 3l8 8"/>',
            blocks:'<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>',
            crown:'<path d="m2 7 5 5 5-8 5 8 5-5-2 13H4z"/>',
            gem:'<path d="m7 3-5 7 10 11L22 10l-5-7zM2 10h20M7 3l5 18 5-18"/>'
        };
        return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[grade.icon]+'</svg>';
    }
    return Object.freeze({GRADES,CAPS,threshold,levelFromXp,dateKey,weekKey,
        createRewards,normalizeRewards,grantRecurring,mergeRewards,gradeIcon});
})();
if(typeof window!=='undefined') window.ProgressionV2=ProgressionV2;
if(typeof module!=='undefined' && module.exports) module.exports=ProgressionV2;
