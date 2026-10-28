'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const src=fs.readFileSync(path.resolve(__dirname,'../audio.js'),'utf8');
let contexts=0,timerId=0,cleared=0;
const listeners=new Map(),scheduled=new Map();
class Param {
 constructor(){this.value=0;this.calls=[];}
 setValueAtTime(v){this.value=v;this.calls.push(['set',v]);}
 exponentialRampToValueAtTime(v){this.value=v;this.calls.push(['exp',v]);}
 linearRampToValueAtTime(v){this.value=v;this.calls.push(['linear',v]);}
 setTargetAtTime(v){this.value=v;this.calls.push(['target',v]);}
 cancelScheduledValues(){}
}
class Node {
 constructor(){this.gain=new Param();this.frequency=new Param();
  this.threshold=new Param();this.knee=new Param();this.ratio=new Param();this.attack=new Param();this.release=new Param();}
 connect(){return this;}
 start(){}
 stop(){}
}
class MockContext {
 constructor(){contexts++;this.state='running';this.currentTime=10;this.sampleRate=8000;this.destination=new Node();}
 createDynamicsCompressor(){return new Node();}
 createGain(){return new Node();}
 createOscillator(){return new Node();}
 createBiquadFilter(){return new Node();}
 createBufferSource(){return new Node();}
 createBuffer(n,length){return {getChannelData:()=>new Float32Array(length)};}
 resume(){this.state='running';return Promise.resolve();}
}
const document={hidden:false,addEventListener(name,cb){
 const arr=listeners.get(name)||[];arr.push(cb);listeners.set(name,arr);
}};
const window={AudioContext:MockContext,addEventListener(name,cb){
 const arr=listeners.get(name)||[];arr.push(cb);listeners.set(name,arr);
},setTimeout(fn){const id=++timerId;scheduled.set(id,fn);return id;},
 clearTimeout(id){cleared++;scheduled.delete(id);}};
const ctx=vm.createContext({window,document,console,Math,Float32Array,Number});
vm.runInContext(src,ctx,{filename:'audio.js'});
const fx=window.SoundFX;
assert.ok(fx);
assert.equal(fx.ctx,null,'AudioContext deve nascere solo dopo un gesto');
fx.bindMusicGesture();
assert.equal(fx.ctx,null,'Nessun autoplay prima del tocco');
assert.ok(listeners.has('pointerdown')&&listeners.has('keydown')&&listeners.has('visibilitychange'));
listeners.get('pointerdown')[0]();
assert.equal(contexts,1,'Un solo contesto condiviso');
assert.equal(fx.musicPlaying,true,'Il primo gesto avvia la musica');
assert.ok(fx.musicBus.gain.calls.some(x=>x[0]==='target'&&x[1]>0));
for(const name of ['playClick','playHint','playSuccess','playError','playFanfare']){
 assert.doesNotThrow(()=>fx[name](),'L\'effetto '+name+' ha dato un errore');
}
fx.toggle(false);
assert.equal(fx.enabled,false);
assert.equal(fx.musicPlaying,true,'Il mute SFX non deve interrompere la musica');
assert.equal(fx.fxBus.gain.calls.at(-1)[1],0);
fx.setVolume(0.37);
assert.equal(fx.volume,0.37);
fx.setMusicVolume(0.72);
assert.equal(fx.musicVolume,0.72);
assert.ok(fx.musicBus.gain.calls.at(-1)[1]>0);
fx.setMusicEnabled(false);
assert.equal(fx.musicPlaying,false);
assert.equal(fx.musicBus.gain.calls.at(-1)[1],0);
fx.setMusicVolume(0.21);
assert.equal(fx.musicPlaying,false,'Il volume da solo non riattiva musica disabilitata');
fx.setMusicEnabled(true);
assert.equal(fx.musicPlaying,true);
document.hidden=true;
listeners.get('visibilitychange')[0]();
assert.equal(fx.musicPlaying,false,'La musica deve fermarsi in scheda nascosta');
document.hidden=false;
listeners.get('pointerdown')[0]();
assert.equal(fx.musicPlaying,true,'La musica riprende al gesto successivo');
fx.stopMusic();
fx.toggle(true);
fx.setVolume(-2);
assert.equal(fx.volume,0,'Clamp volume effetti');
fx.setMusicVolume(200);
assert.equal(fx.musicVolume,1,'Clamp volume musica');
assert.ok(cleared>0);
console.log('OK: suoni coerenti, Web Audio offline, bus indipendenti, autoplay solo dopo gesto, mute, volume, pausa scheda.');
