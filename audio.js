// Audio Synthesizer per GDScript Hero (100% offline tramite Web Audio API)
const SoundFX = {
    ctx: null,
    enabled: true,
    volume: 0.8, // da 0.0 a 1.0

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggle(forceState) {
        if (typeof forceState === 'boolean') {
            this.enabled = forceState;
        } else {
            this.enabled = !this.enabled;
        }
        return this.enabled;
    },

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    },

    // Suono di vittoria stile Duolingo / Coddy: arpeggio squillante (Do - Mi - Sol - Do)
    playSuccess() {
        if (!this.enabled || this.volume <= 0.001) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [
            { f: 523.25, t: 0.00, d: 0.12 }, // C5
            { f: 659.25, t: 0.08, d: 0.12 }, // E5
            { f: 783.99, t: 0.16, d: 0.15 }, // G5
            { f: 1046.50, t: 0.25, d: 0.40 } // C6
        ];

        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + n.t);

            gain.gain.setValueAtTime(0, now + n.t);
            gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + n.t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + n.t);
            osc.stop(now + n.t + n.d);
        });
    },

    // Suono di errore: doppio tono discendente sintetico
    playError() {
        if (!this.enabled || this.volume <= 0.001) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.22);

        gain.gain.setValueAtTime(0.18 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    },

    // Suono per l'apertura dei suggerimenti (chime luminoso)
    playHint() {
        if (!this.enabled || this.volume <= 0.001) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.18);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    },

    // Click tattile per pulsanti
    playClick() {
        if (!this.enabled || this.volume <= 0.001) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.06 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    },

    // Fanfara epica per il completamento del corso / boss / livello superato
    playFanfare() {
        if (!this.enabled || this.volume <= 0.001) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const fanfareNotes = [
            { f: 523.25, t: 0.00, d: 0.15 }, // C5
            { f: 523.25, t: 0.15, d: 0.15 }, // C5
            { f: 523.25, t: 0.30, d: 0.15 }, // C5
            { f: 659.25, t: 0.45, d: 0.35 }, // E5
            { f: 783.99, t: 0.70, d: 0.25 }, // G5
            { f: 1046.50, t: 0.95, d: 0.80 } // C6 (lunga)
        ];

        fanfareNotes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + n.t);

            gain.gain.setValueAtTime(0, now + n.t);
            gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + n.t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + n.t);
            osc.stop(now + n.t + n.d);
        });
    }
};

window.SoundFX = SoundFX;
