'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.resolve(__dirname,'../auth.js'),'utf8');
const row={revision:-1,data:null};
let offline=false,failRead=false,rpcCalls=0;
const deep=x=>JSON.parse(JSON.stringify(x));
const makeDevice=id=>{
    const stored={};
    const storage={
        getItem:k=>stored[k]??null,
        setItem:(k,v)=>{stored[k]=String(v);},
        removeItem:k=>{delete stored[k];}
    };
    const win={
        SupabaseConfig:{isConfigured:()=>true},
        ProgressionV2:{levelFromXp:xp=>({tier:{level:1}})},
        App:{
            state:{xp:0,finishedLessons:[],completedLessons:[1],userCode:{},sandbox:{projects:[]}},
            getSavePayload(){return this.state;},
            applyImportedState(data){this.state=data;}
        }
    };
    vm.runInNewContext(src,{window:win,localStorage:storage,SoundFX:{enabled:true,volume:.8},
        console,Date,Promise,setTimeout}, {filename:'auth.js'});
    const auth=win.AuthManager;
    auth.currentUser={id:'test-owner',email:'student@example.test',isGuest:false};
    auth.supabaseClient={
        auth:{getUser:async()=>({data:{user:{id:'test-owner',email:'student@example.test'}}})},
        from:()=>({select:()=>({eq:()=>({
            maybeSingle:async()=>failRead?{data:null,error:{message:'Connection unavailable'}}:
                {data:row.revision===-1?null:{save_data:deep(row.data),save_revision:row.revision},error:null}
        })})}),
        rpc:async(_name,args)=>{
            rpcCalls++;
            if(offline)return {data:null,error:{message:'Disconnected'}};
            if(args.p_expected_revision!==row.revision)return {
                data:[{applied:false,save_revision:row.revision,save_data:deep(row.data)}],error:null
            };
            row.revision=row.revision===-1?1:row.revision+1;
            row.data=deep(args.p_save_data);
            return {data:[{applied:true,save_revision:row.revision,save_data:deep(row.data)}],error:null};
        }
    };
    return {auth,window:win,storage,stored};
};
(async()=>{
    const a=makeDevice('a'),b=makeDevice('b');
    // Initial read is mandatory. No unknown baseline can write cloud.
    await a.auth.syncUserProgress({xp:10});
    assert.equal(row.revision,-1);
    assert.equal(a.auth.getSyncStatus().kind,'pending');
    assert.equal(await a.auth.fetchFromCloud(),null);
    assert.equal(await b.auth.fetchFromCloud(),null);
    assert.equal(a.auth.getSaveRevision(),-1);
    a.window.App.state={xp:30,finishedLessons:[1],completedLessons:[1],userCode:{1:'print("A")'}};
    await a.auth.syncUserProgress(a.window.App.state);
    assert.equal(row.revision,1);
    assert.equal(row.data.userCode[1],'print("A")');
    // Device B was offline with the same revision and cannot clobber A.
    b.window.App.state={xp:50,finishedLessons:[2],completedLessons:[1,2],userCode:{1:'print("B")'}};
    await b.auth.syncUserProgress(b.window.App.state);
    assert.equal(b.auth.getSyncStatus().kind,'conflict');
    assert.equal(row.revision,1);
    assert.equal(row.data.userCode[1],'print("A")');
    assert.equal(b.window.App.state.userCode[1],'print("B")');
    // Further writes stay local until explicit recovery.
    await b.auth.syncUserProgress({xp:99,userCode:{1:'print("B2")'}});
    assert.equal(row.revision,1);
    b.window.App.state={xp:99,finishedLessons:[2],completedLessons:[1,2],userCode:{1:'print("B2")'}};
    await b.auth.resolveCloudConflict();
    assert.equal(row.revision,2);
    assert.equal(row.data.xp,99);
    assert.equal(row.data.userCode[1],'print("B2")');
    const backups=Object.keys(b.stored).filter(x=>x.startsWith('gdh_cloud_conflict_backup:'));
    assert.equal(backups.length,1);
    const recovery=JSON.parse(b.stored[backups[0]]);
    assert.equal(recovery.cloud.userCode[1],'print("A")');
    assert.equal(recovery.local.userCode[1],'print("B2")');
    // Connection errors must never be interpreted as an empty remote row.
    const c=makeDevice('c');
    failRead=true;
    await assert.rejects(()=>c.auth.fetchFromCloud(),/Connection unavailable/);
    assert.equal(c.auth.getSaveRevision(),null);
    const before=rpcCalls;
    await c.auth.syncUserProgress({xp:1});
    assert.equal(rpcCalls,before);
    failRead=false;
    // Offline write is retained for retry, without advancing the revision.
    await a.auth.fetchFromCloud();
    offline=true;
    await a.auth.syncUserProgress({xp:120});
    assert.equal(a.auth.getSyncStatus().kind,'error');
    assert.equal(row.revision,2);
    offline=false;
    a.window.App.state={xp:120,finishedLessons:[1,2],completedLessons:[1,2],userCode:{1:'print("A2")'}};
    await a.auth.retryCloudSync();
    assert.equal(row.revision,3);
    assert.equal(row.data.xp,120);
    console.log('PASS: two-device CAS, conflicts, archival, missing reads, offline retries');
})().catch(e=>{console.error(e);process.exitCode=1;});
