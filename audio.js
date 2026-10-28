// GDScript Hero · Soundscape originale Web Audio, senza download o asset esterni.
// Due bus indipendenti: effetti dell'interfaccia e sottofondo lo-fi.
// Il browser avvia il contesto soltanto dopo un gesto reale (Safari/iOS incluso).
const SoundFX = {
    ctx: null,
    enabled: true,
    volume: 0.65,
    musicEnabled: true,
    musicVolume: 0.38,
    fxBus: null,
    musicBus: null,
    musicPlaying: false,
    musicTimer: null,
    musicStep: 0,
    musicNextAt: 0,
    noiseBuffer: null,
    musicUnlockBound: false,
    bpm: 76,

    clamp(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;
    },

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return false;
            try {
                this.ctx = new AudioContextClass();
                const master = this.ctx.createDynamicsCompressor();
                master.threshold.value = -16;
                master.knee.value = 14;
                master.ratio.value = 2.5;
                master.attack.value = 0.004;
                master.release.value = 0.24;
                master.connect(this.ctx.destination);

                this.fxBus = this.ctx.createGain();
                this.musicBus = this.ctx.createGain();
                this.fxBus.gain.value = this.enabled ? this.volume * 0.65 : 0;
                this.musicBus.gain.value = 0;
                this.fxBus.connect(master);
                this.musicBus.connect(master);
            } catch (error) {
                console.warn('[Audio] Web Audio non disponibile:', error);
                this.ctx = null;
                return false;
            }
        }
        if (this.ctx.state === 'suspended') {
            // L'eventuale blocco di autoplay non causa errori né tenta play nascosti.
            const resume = this.ctx.resume();
            if (resume && typeof resume.catch === 'function') resume.catch(() => {});
        }
        return true;
    },

    bindMusicGesture() {
        if (this.musicUnlockBound || typeof document === 'undefined') return;
        this.musicUnlockBound = true;
        const unlock = () => {
            if (!document.hidden && this.musicEnabled && this.musicVolume > 0) {
                if (!this.musicPlaying) this.startMusic();
                else if (this.ctx?.state === 'suspended') {
                    const resume = this.ctx.resume();
                    if (resume?.catch) resume.catch(() => {});
                }
            }
        };
        // Non "autoplay": soltanto dopo tocco/click/tasto reale.
        document.addEventListener('pointerdown', unlock, {passive:true, capture:true});
        document.addEventListener('keydown', unlock, {capture:true});
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.stopMusic();
            // Al ritorno la musica riprende al primo tocco, senza sorprese.
        });
        window.addEventListener('pagehide', () => this.stopMusic());
    },

    updateFXGain() {
        if (!this.ctx || !this.fxBus) return;
        this.fxBus.gain.setTargetAtTime(
            this.enabled ? this.volume * 0.65 : 0,
            this.ctx.currentTime, 0.022
        );
    },
    toggle(forceState) {
        this.enabled = typeof forceState === 'boolean' ? forceState : !this.enabled;
        this.updateFXGain();
        return this.enabled;
    },
    setVolume(value) {
        this.volume = this.clamp(value, this.volume);
        this.updateFXGain();
        return this.volume;
    },
    setMusicEnabled(value) {
        this.musicEnabled = Boolean(value);
        if (this.musicEnabled) this.startMusic();
        else this.stopMusic();
        return this.musicEnabled;
    },
    setMusicVolume(value) {
        this.musicVolume = this.clamp(value, this.musicVolume);
        if (!this.musicVolume) {
            this.stopMusic();
        } else if (this.musicPlaying && this.musicBus && this.ctx) {
            this.musicBus.gain.setTargetAtTime(
                this.musicVolume * 0.40, this.ctx.currentTime, 0.06
            );
        }
        // Se prima era a zero, la musica riparte sul successivo gesto o al
        // movimento dello slider, che è già un'interazione dell'utente.
        else if (this.musicEnabled) this.startMusic();
        return this.musicVolume;
    },

    // Oscillatori controllati da inviluppi. Nessun nodo rimane acceso dopo il suono.
    tone(freq, when, duration, peak, type='sine', destination=this.fxBus, endFreq=null) {
        if (!this.ctx || !destination) return;
        const osc=this.ctx.createOscillator(), gain=this.ctx.createGain();
        const start=Math.max(this.ctx.currentTime, when), length=Math.max(0.03, duration);
        osc.type=type;
        osc.frequency.setValueAtTime(freq, start);
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start+length*0.78);
        gain.gain.setValueAtTime(0.00001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), start+Math.min(0.014,length*0.16));
        gain.gain.exponentialRampToValueAtTime(0.00001, start+length);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(start);
        osc.stop(start+length+0.012);
    },

    getNoise() {
        if (this.noiseBuffer || !this.ctx) return this.noiseBuffer;
        const length=Math.ceil(this.ctx.sampleRate*0.36);
        const buffer=this.ctx.createBuffer(1,length,this.ctx.sampleRate);
        const ch=buffer.getChannelData(0);
        let seed=192803;
        for(let i=0;i<length;i++){
            seed=(Math.imul(seed,1664525)+1013904223)|0;
            ch[i]=(seed/2147483648)*0.68;
        }
        this.noiseBuffer=buffer;
        return buffer;
    },

    noise(when,duration,peak,filterType='highpass',cutoff=4000,destination=this.fxBus) {
        if (!this.ctx || !destination) return;
        const src=this.ctx.createBufferSource(), filter=this.ctx.createBiquadFilter(), g=this.ctx.createGain();
        src.buffer=this.getNoise();
        filter.type=filterType; filter.frequency.value=cutoff;
        const at=Math.max(this.ctx.currentTime,when),d=Math.min(.33,Math.max(.008,duration));
        g.gain.setValueAtTime(Math.max(0.00001,peak),at);
        g.gain.exponentialRampToValueAtTime(0.00001,at+d);
        src.connect(filter); filter.connect(g); g.connect(destination);
        src.start(at); src.stop(at+d+0.006);
    },

    available() {
        if (!this.enabled || this.volume <= 0.001) return false;
        return this.init() && this.ctx.state !== 'closed';
    },
    playClick() {
        if (!this.available()) return;
        const t=this.ctx.currentTime+.004;
        // Tap secco e caldo, non il "beep" persistente della vecchia UI.
        this.tone(680,t,.046,.065,'sine',this.fxBus,465);
        this.noise(t,.012,.018,'highpass',5200);
    },
    playHint() {
        if (!this.available()) return;
        const t=this.ctx.currentTime+.006;
        this.tone(587.33,t,.30,.095,'sine');
        this.tone(880,t+.09,.35,.066,'triangle');
        this.tone(1174.66,t+.15,.42,.024,'sine');
    },
    playSuccess() {
        if (!this.available()) return;
        const t=this.ctx.currentTime+.008;
        // Tre tocchi morbidi in maggiore: premio presente ma non invadente.
        for(const [f,offset,peak] of [[392,0,.13],[493.88,.105,.115],[587.33,.22,.10]]){
            this.tone(f,t+offset,.39,peak,'triangle');
            this.tone(f*2,t+offset,.23,peak*.14,'sine');
        }
    },
    playError() {
        if (!this.available()) return;
        const t=this.ctx.currentTime+.005;
        // Due note basse smorzate invece del vecchio buzz sawtooth.
        this.tone(261.63,t,.16,.11,'triangle',this.fxBus,233.08);
        this.tone(196,t+.115,.21,.095,'sine',this.fxBus,174.61);
    },
    playFanfare() {
        if (!this.available()) return;
        const t=this.ctx.currentTime+.012;
        for(const [f,o,p,d] of [
            [392,0,.12,.24],[493.88,.15,.12,.25],[587.33,.30,.12,.28],
            [783.99,.49,.105,.39],[659.25,.74,.08,.48],[783.99,.87,.10,.64]
        ])this.tone(f,t+o,d,p,'triangle');
    },

    // Un brano lo-fi originale, 4 battute / 76 BPM:
    // Dm9 - G9 - Cmaj9 - Am9. Suonato con Rhodes soft, basso, kick,
    // snare spazzolato e hi-hat. Il pattern è ciclico e non usa musica altrui.
    chords: [
        [146.83,174.61,220,261.63,329.63],
        [196,246.94,293.66,349.23,440],
        [130.81,164.81,196,246.94,293.66],
        [110,130.81,164.81,196,246.94]
    ],
    bass: [73.42,98,65.41,55],

    rhodes(freq,when,length=1.8,velocity=1) {
        if (!this.ctx || !this.musicBus) return;
        const at=Math.max(when,this.ctx.currentTime);
        const filter=this.ctx.createBiquadFilter();
        filter.type='lowpass'; filter.frequency.value=1150;
        const envelope=this.ctx.createGain();
        envelope.gain.setValueAtTime(.00001,at);
        envelope.gain.exponentialRampToValueAtTime(.065*velocity,at+.027);
        envelope.gain.exponentialRampToValueAtTime(.00001,at+length);
        filter.connect(envelope);envelope.connect(this.musicBus);
        for(const [wave,harmonic,level] of [['sine',1,.95],['triangle',2,.13]]){
            const o=this.ctx.createOscillator(),g=this.ctx.createGain();
            o.type=wave;o.frequency.setValueAtTime(freq*harmonic,at);
            g.gain.value=level;
            o.connect(g);g.connect(filter);o.start(at);o.stop(at+length+.02);
        }
    },
    kick(when) {
        this.tone(122,when,.26,.29,'sine',this.musicBus,43);
        this.noise(when,.014,.026,'lowpass',420,this.musicBus);
    },
    snare(when) {
        this.noise(when,.17,.058,'bandpass',1250,this.musicBus);
        this.tone(185,when,.115,.048,'triangle',this.musicBus,135);
    },
    hat(when,accent=false) {
        this.noise(when,.050,accent ? 0.026 : 0.016,'highpass',6200,this.musicBus);
    },
    scheduleBeat(index,when) {
        const step=index%32, bar=Math.floor(step/8), tick=step%8;
        const notes=this.chords[bar];
        if(tick===0){
            // Voicing: accordi al centro, timbri piano filtrati.
            for(let i=0;i<notes.length;i++)this.rhodes(notes[i],when,2.2,i===0?.78:.51);
            this.tone(this.bass[bar],when,.56,.20,'sine',this.musicBus);
        }
        if(tick===4){
            for(const i of [1,3,4])this.rhodes(notes[i],when,1.3,.44);
            this.tone(this.bass[bar]*1.5,when,.45,.11,'sine',this.musicBus);
        }
        if(tick===3||tick===7)this.rhodes(notes[tick===3?4:2]*2,when+.024,.64,.20);
        if(tick===0||tick===4)this.kick(when);
        if(tick===2||tick===6)this.snare(when+.025);
        if(tick%2===1)this.hat(when+.025,tick===3);
    },
    musicTick() {
        if (!this.musicPlaying || !this.ctx || document.hidden) return;
        if (this.ctx.state === 'running') {
            // Dopo una sospensione del dispositivo non recuperare battute arretrate.
            if (this.musicNextAt < this.ctx.currentTime - 1) {
                this.musicNextAt = this.ctx.currentTime + .06;
                this.musicStep = 0;
            }
            const horizon=this.ctx.currentTime+.28;
            const duration=60/this.bpm/2;
            while(this.musicNextAt<horizon){
                this.scheduleBeat(this.musicStep,this.musicNextAt);
                this.musicNextAt+=duration;
                this.musicStep=(this.musicStep+1)%32;
            }
        }
        this.musicTimer=window.setTimeout(()=>this.musicTick(),75);
    },
    startMusic() {
        if (!this.musicEnabled || this.musicVolume<=0 || document.hidden || this.musicPlaying) return;
        if (!this.init()) return;
        this.musicPlaying=true;
        this.musicStep=0;
        this.musicNextAt=this.ctx.currentTime+.10;
        this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
        this.musicBus.gain.setTargetAtTime(this.musicVolume*.40,this.ctx.currentTime,.55);
        this.musicTick();
    },
    stopMusic() {
        this.musicPlaying=false;
        if(this.musicTimer!==null)window.clearTimeout(this.musicTimer);
        this.musicTimer=null;
        if(this.ctx&&this.musicBus){
            this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
            this.musicBus.gain.setTargetAtTime(0,this.ctx.currentTime,.12);
        }
    }
};
window.SoundFX=SoundFX;
