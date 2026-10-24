// Engine particellare per i coriandoli (100% offline su HTML5 Canvas)
const ConfettiFX = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    burst() {
        this.init();
        if (!this.canvas) return;

        // Colori vivaci festosi
        const colors = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#eab308'];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            // Spara sia dal lato sinistro che dal lato destro dello schermo
            const isLeft = i % 2 === 0;
            this.particles.push({
                x: isLeft ? window.innerWidth * 0.2 : window.innerWidth * 0.8,
                y: window.innerHeight * 0.7,
                vx: (Math.random() - (isLeft ? 0.2 : 0.8)) * 14,
                vy: (Math.random() * -18) - 6,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                life: 0,
                maxLife: Math.random() * 60 + 80
            });
        }

        if (!this.animationId) {
            this.animate();
        }
    },

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // gravità
            p.vx *= 0.98; // attrito dell'aria
            p.rotation += p.rotationSpeed;
            p.life++;

            if (p.life > p.maxLife - 25) {
                p.opacity = Math.max(0, (p.maxLife - p.life) / 25);
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
            this.ctx.restore();

            if (p.life >= p.maxLife || p.y > window.innerHeight + 50) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};
