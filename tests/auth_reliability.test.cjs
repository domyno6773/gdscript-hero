// Eseguire: node tests/auth_reliability.test.cjs
// Nessuna dipendenza npm: usa un Supabase simulato, mai account reali.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const authSource = fs.readFileSync(path.join(__dirname, '..', 'auth.js'), 'utf8');
function setup() {
    const values = {};
    const localStorage = {
        getItem: key => values[key] ?? null,
        setItem: (key, value) => { values[key] = value; },
        removeItem: key => { delete values[key]; }
    };
    const win = { SupabaseConfig: { isConfigured: () => true } };
    const sounds = { enabled: true, volume: 0.6 };
    vm.runInNewContext(authSource, { window: win, localStorage, SoundFX: sounds, console });
    return { auth: win.AuthManager, localStorage, sounds };
}
async function run() {
    let count = 0;
    const { auth } = setup();
    const progress = {
        xp: 125, finishedLessons: [1, 2],
        reviewProgress: { completedVariants: ['reviewA'], variantHistory: { reviewA: { attempts: 3, attempts_since_last_success: 1, last_run: { is_autonomous: false } } } },
        sandbox: { projects: [{ id: 'p', name: 'Mio progetto', code: 'print("ciao")' }] },
        arenaProject: { currentPhase: 2, userCode: { '2': 'print(42)' } },
        learningTelemetry: { schema_version: 1, lessons: {} }
    };
    const backup = auth.createBackupPayload(progress);
    assert.equal(backup.version, '4.1');
    for (const field of ['sandbox', 'arenaProject', 'reviewProgress', 'learningTelemetry']) {
        assert.equal(JSON.stringify(backup.data[field]), JSON.stringify(progress[field]), field);
    }
    assert.equal(auth.parseBackupString(JSON.stringify(backup)).data.sandbox.projects[0].name, 'Mio progetto');
    count += 2;

    const broken = JSON.parse(JSON.stringify(backup));
    broken.data.xp = 9999;
    assert.throws(() => auth.parseBackupString(JSON.stringify(broken)), /integrità/);
    const missing = JSON.parse(JSON.stringify(backup));
    delete missing.checksum;
    assert.throws(() => auth.parseBackupString(JSON.stringify(missing)), /checksum/);
    const historical = { app: 'GDScript Hero', version: '4.0', data: { xp: 5 } };
    historical.checksum = auth.generateChecksum(historical.data);
    assert.equal(auth.parseBackupString(JSON.stringify(historical)).data.xp, 5);
    assert.equal(auth.parseBackupString(JSON.stringify({ xp: 3, finishedLessons: [1] })).version, 'legacy');
    count += 4;

    const merged = auth.mergeProgress(
        { reviewProgress: { completedVariants: [], variantHistory: { a: { attempts: 1, last_attempt_at: '2026-10-01T00:00:00Z', attempts_since_last_success: 0, last_run: { is_autonomous: true } } } } },
        { reviewProgress: { completedVariants: [], variantHistory: { a: { attempts: 2, last_attempt_at: '2026-10-02T00:00:00Z', attempts_since_last_success: 2, last_run: { is_autonomous: false } } } } }
    );
    assert.equal(merged.reviewProgress.variantHistory.a.attempts_since_last_success, 2);
    assert.equal(merged.reviewProgress.variantHistory.a.last_run.is_autonomous, false);
    count++;


    // L'importazione iniziale ospite deve conservare anche il ritmo scelto.
    const selectedGoal={week:'2026-10-26',selectedDate:'2026-10-28'};
    const importedGuest=auth.mergeProgress(
        {streakMode:'rilassato',streakGoalSelection:null,siteWelcomeSeen:false},
        {streakMode:'lockin',streakGoalSelection:selectedGoal,siteWelcomeSeen:true}
    );
    assert.equal(importedGuest.streakMode,'lockin');
    assert.equal(JSON.stringify(importedGuest.streakGoalSelection),JSON.stringify(selectedGoal));
    assert.equal(importedGuest.siteWelcomeSeen,true);
    const savedBackup=auth.createBackupPayload(importedGuest);
    assert.equal(savedBackup.data.streakGoalSelection.week,selectedGoal.week);
    count++;

        // La coda locale invia le richieste con la versione confermata dal server.
    auth.currentUser={id:'u',email:'test@example.com',isGuest:false};
    let db={'test@example.com':{progress:null}};
    auth.getAccountsDB=()=>db;
    auth.saveAccountsDB=next=>{db=next;};
    auth._cloudVersion={userId:'u',revision:0,blocked:false,remote:null};
    let revision=0,inFlight=0,maxInFlight=0;
    let releaseFirst;
    const pending=new Promise(resolve=>{releaseFirst=resolve;});
    const writes=[];
    auth.supabaseClient={
        auth:{getUser:async()=>({data:{user:{id:'u',email:'test@example.com'}}})},
        rpc:async(name,args)=>{
            assert.equal(name,'gdh_cas_save_progress');
            inFlight++;maxInFlight=Math.max(maxInFlight,inFlight);
            writes.push(args);
            if(args.p_save_data.xp===10)await pending;
            const result=[{applied:revision===args.p_expected_revision,save_revision:revision+1,save_data:args.p_save_data}];
            if(result[0].applied)revision++;
            inFlight--;
            return {data:result,error:null};
        }
    };
    const one=auth.syncUserProgress({xp:10});
    const two=auth.syncUserProgress({xp:20});
    for(let i=0;i<10;i++)await Promise.resolve();
    assert.equal(writes.length,1,'overlapping requests');
    releaseFirst();
    await Promise.all([one,two]);
    assert.deepEqual(writes.map(x=>x.p_expected_revision),[0,1]);
    assert.equal(maxInFlight,1);
    assert.equal(revision,2);
    assert.equal(auth.getSaveRevision(),2);
    count+=3;
    // Un errore di rete conserva i salvataggi locali e permette tentativi futuri.
    let attempts=0;
    auth.supabaseClient.rpc=async(_name,args)=>{
        if(++attempts===1)return {data:null,error:{message:'Offline'}};
        return {data:[{applied:true,save_revision:3,save_data:args.p_save_data}],error:null};
    };
    await auth.syncUserProgress({xp:30});
    assert.equal(auth.getSyncStatus().kind,'error');
    assert.equal(db['test@example.com'].progress.xp,30);
    await auth.syncUserProgress({xp:40});
    assert.equal(auth.getSyncStatus().kind,'synced');
    assert.equal(auth.getSaveRevision(),3);
    count+=2;
    console.log('PASS:', count, 'gruppi di controlli su backup, merge e sincronizzazione');
}
run().catch(err => { console.error(err); process.exitCode = 1; });
