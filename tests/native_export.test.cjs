'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
require('../scene-model.js');const w={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../gameplay_lessons.js'),'utf8'),{window:w});
const lesson=w.GDHGameplayLessons.entries.find(l=>l.id===304);
const files=global.GDHSceneModel.exportProject({name:'Raccogli e vinci',code:lesson.solution,nodes:w.GDHGameplayLessons.sceneNodes(lesson)});
const dir=fs.mkdtempSync('/tmp/gdh-export-native-');
const run=args=>{const result=spawnSync(process.env.GODOT_BIN||'godot',args,{encoding:'utf8',timeout:30000});assert.equal(result.status,0,String(result.error||result.signal||'')+'\n'+result.stdout+'\n'+result.stderr);assert.doesNotMatch(result.stderr||'',/SCRIPT ERROR|ERROR:/);return result.stdout;};
try{
 for(const [file,content] of Object.entries(files))fs.writeFileSync(path.join(dir,file),content);
 run(['--headless','--path',dir,'--editor','--quit']);
 const output=run(['--headless','--path',dir,'--script',path.join(__dirname,'native_godot/exported_game.gd')]);
 assert.match(output,/EXPORTED_GAME: PASS/);console.log('PASS exported Godot project: imports, preserves nested shapes, moves, collects and wins.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
