// GDScript Hero - Motore Viewport 2D Canvas stile Godot Engine
// Fornisce un mini-ambiente di gioco 2D reattivo per visualizzare codice ed esecuzioni.

class GodotViewport {
    constructor(canvasId, options = {}) {
        this.canvasId = canvasId;
        this.canvas = null;
        this.ctx = null;
        this.animFrameId = null;
        this.time = 0;
        this.lastTime = performance.now();
        this.theme = 'dark';
        this.autoScale = options.autoScale !== false;

        // Stato Giocatore (Godot Robot Mascot)
        this.player = {
            x: 90,
            y: 110,
            startX: 90,
            startY: 110,
            targetX: 90,
            targetY: 110,
            size: 44,
            name: "Godot Bot",
            hp: null,
            maxHp: 100,
            coins: null,
            velocity: null,
            speech: null,
            speechTimer: 0,
            state: "idle", // "idle", "moving", "success", "error"
            tilt: 0,
            blinkTimer: 0,
            isBlinking: false
        };

        // Bersaglio / Traguardo (se previsto dall'esercizio)
        this.target = null; // { x, y, label, reached: false }

        // Sistema Particellare
        this.particles = [];

        // Griglia e HUD
        this.gridSize = 32;
        this.statusText = "Scena 2D pronta. Premi 'Verifica Codice'.";
        this.fps = 60;
        this.fpsTimer = 0;
        this.frameCount = 0;

        this.init();
    }

    init() {
        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
        this.startLoop();
    }

    setTheme(theme) {
        this.theme = theme;
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement 
            ? this.canvas.parentElement.getBoundingClientRect() 
            : this.canvas.getBoundingClientRect();

        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(rect.width || 360, 280);
        const height = Math.max(rect.height || 220, 200);

        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.width = width;
        this.height = height;

        // Centra o riposiziona di default se fuori schermo
        if (this.player.targetX > this.width - 60) {
            this.player.targetX = this.width - 70;
            this.player.x = this.player.targetX;
        }
        if (this.player.targetY > this.height - 60) {
            this.player.targetY = this.height - 70;
            this.player.y = this.player.targetY;
        }
    }

    startLoop() {
        if (this.animFrameId) return;
        const loop = (now) => {
            const dt = Math.min((now - this.lastTime) / 1000, 0.1);
            this.lastTime = now;
            this.time += dt;

            // Calcolo FPS
            this.frameCount++;
            this.fpsTimer += dt;
            if (this.fpsTimer >= 1.0) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.fpsTimer = 0;
            }

            this.update(dt);
            this.render();
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    stopLoop() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    // Aggiornamento logico e animazioni
    update(dt) {
        const p = this.player;

        // Interpolazione posizione (Lerp fluido)
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            p.x += dx * Math.min(dt * 8, 1);
            p.y += dy * Math.min(dt * 8, 1);
            p.state = "moving";
            p.tilt = (dx * 0.05);

            // Particelle scia / polvere
            if (Math.random() < 0.4) {
                this.addDustParticle(p.x, p.y + p.size * 0.45);
            }
        } else {
            p.x = p.targetX;
            p.y = p.targetY;
            p.tilt *= 0.8;
            if (p.state === "moving") {
                p.state = "idle";
            }
        }

        // Timer battito occhi
        p.blinkTimer -= dt;
        if (p.blinkTimer <= 0) {
            p.isBlinking = true;
            if (p.blinkTimer <= -0.15) {
                p.isBlinking = false;
                p.blinkTimer = 2.5 + Math.random() * 3.5;
            }
        }

        // Timer balloon di testo (speech bubble)
        if (p.speechTimer > 0) {
            p.speechTimer -= dt;
            if (p.speechTimer <= 0) {
                p.speech = null;
            }
        }

        // Verifica raggiungimento target
        if (this.target && !this.target.reached) {
            const tdx = this.target.x - p.x;
            const tdy = this.target.y - p.y;
            if (Math.sqrt(tdx * tdx + tdy * tdy) < 36) {
                this.target.reached = true;
                this.burstStars(this.target.x, this.target.y, 16);
            }
        }

        // Aggiorna particelle
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.vy += (pt.gravity || 0) * dt;
            pt.life -= dt;
            if (pt.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    addDustParticle(x, y) {
        this.particles.push({
            type: 'dust',
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 20,
            vy: -15 - Math.random() * 20,
            gravity: 10,
            size: 3 + Math.random() * 3,
            color: this.theme === 'light' ? 'rgba(148, 163, 184, 0.4)' : 'rgba(56, 189, 248, 0.3)',
            life: 0.5,
            maxLife: 0.5
        });
    }

    burstStars(x, y, count = 14) {
        const colors = ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#a855f7'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5);
            const speed = 40 + Math.random() * 90;
            this.particles.push({
                type: 'star',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 20,
                gravity: 120,
                size: 4 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 10,
                life: 0.8 + Math.random() * 0.4,
                maxLife: 1.2
            });
        }
    }

    // Integrazione diretta con il runtime GDScript
    updateFromExecution(result, lesson = null, isSuccess = false) {
        if (!this.canvas) return;
        const p = this.player;
        const scope = result.scope || {};

        // 1. Lettura Vector2 o Posizione
        let newX = null;
        let newY = null;
        ['posizione', 'pos', 'nave', 'player', 'coordinate'].forEach(key => {
            if (scope[key] && typeof scope[key] === 'object' && scope[key].x !== undefined) {
                newX = Number(scope[key].x);
                newY = Number(scope[key].y);
            }
        });

        // 2. Lettura Punti Vita (HP)
        let hpVal = null;
        ['punti_vita', 'vita', 'hp'].forEach(key => {
            if (typeof scope[key] === 'number') hpVal = scope[key];
        });
        if (hpVal !== null) {
            p.hp = hpVal;
        }

        // 3. Lettura Monete / Punti
        ['monete', 'score', 'punteggio', 'soldi'].forEach(key => {
            if (typeof scope[key] === 'number') p.coins = scope[key];
        });

        // 4. Lettura Nome Personaggio
        ['personaggio', 'nome', 'nome_giocatore'].forEach(key => {
            if (typeof scope[key] === 'string') p.name = scope[key];
        });

        // 5. Gestione Posizionamento nello Spazio Canvas
        if (newX !== null && newY !== null) {
            // Se le coordinate fornite sono grandi, mappa proporzionalmente
            const boundW = Math.max(this.width - 90, 160);
            const boundH = Math.max(this.height - 90, 140);

            let mappedX = newX;
            let mappedY = newY;

            // Se l'esercizio usa coordinate standard > width/height, scala adatta
            if (newX > boundW || newY > boundH) {
                const maxCoord = Math.max(newX, newY, 300);
                mappedX = 60 + (newX / maxCoord) * (boundW - 60);
                mappedY = 60 + (newY / maxCoord) * (boundH - 60);
            } else {
                mappedX = Math.max(50, Math.min(newX, boundW));
                mappedY = Math.max(50, Math.min(newY, boundH));
            }

            p.targetX = mappedX;
            p.targetY = mappedY;

            // Crea target da raggiungere
            this.target = {
                x: mappedX,
                y: mappedY,
                label: `(${Math.round(newX)}, ${Math.round(newY)})`,
                reached: false
            };
        } else {
            // Centra o mantieni al centro-sinistra se non ci sono vettori
            p.targetX = Math.min(100, this.width * 0.25);
            p.targetY = this.height * 0.52;
            this.target = null;
        }

        // 6. Speech Bubble dai log di print()
        if (result.logs && result.logs.length > 0) {
            const cleanMsg = result.logs.join(' • ');
            p.speech = cleanMsg.length > 45 ? cleanMsg.substring(0, 42) + '...' : cleanMsg;
            p.speechTimer = 6.0;
        } else if (result.error) {
            p.speech = "⚠️ Errore nello script!";
            p.speechTimer = 5.0;
        }

        // 7. Esito esecuzione
        if (isSuccess) {
            p.state = "celebrating";
            this.statusText = "✓ Scena eseguita con successo!";
            this.burstStars(p.targetX, p.targetY, 20);
            setTimeout(() => {
                if (p.state === "celebrating") p.state = "idle";
            }, 2500);
        } else if (result.error) {
            p.state = "error";
            this.statusText = `Errore: ${result.error}`;
        } else {
            this.statusText = "Esecuzione completata.";
        }
    }

    replay() {
        const p = this.player;
        p.x = p.startX;
        p.y = p.startY;
        if (p.speech) p.speechTimer = 5.0;
        if (this.target) this.target.reached = false;
        this.statusText = "Riproduzione simulazione 2D...";
    }

    reset() {
        const p = this.player;
        p.x = 90;
        p.y = 110;
        p.targetX = 90;
        p.targetY = 110;
        p.speech = null;
        p.speechTimer = 0;
        p.hp = null;
        p.coins = null;
        p.state = "idle";
        this.target = null;
        this.particles = [];
        this.statusText = "Scena 2D ripristinata.";
    }

    // =========================================================================
    // RENDERING COMPLETO CANVAS STILE GODOT 2D
    // =========================================================================
    render() {
        const ctx = this.ctx;
        if (!ctx) return;
        const w = this.width;
        const h = this.height;
        const isLight = this.theme === 'light';

        // 1. Sfondo Viewport Godot Engine
        ctx.fillStyle = isLight ? '#f1f5f9' : '#0a0f1d';
        ctx.fillRect(0, 0, w, h);

        // 2. Griglia 2D Godot (subtle grid)
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = isLight ? 'rgba(203, 213, 225, 0.45)' : 'rgba(30, 41, 59, 0.6)';

        const step = this.gridSize;
        ctx.beginPath();
        for (let x = step; x < w; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = step; y < h; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();

        // 3. Assi cartesiani Godot (X = Rosso, Y = Verde)
        const axisX = 32;
        const axisY = 32;

        // Asse X (Orizzontale - Rosso Godot)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, axisY);
        ctx.lineTo(w, axisY);
        ctx.stroke();

        // Asse Y (Verticale - Verde Godot)
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.65)';
        ctx.beginPath();
        ctx.moveTo(axisX, 0);
        ctx.lineTo(axisX, h);
        ctx.stroke();

        // Etichetta Origine (0, 0)
        ctx.font = '10px "Fira Code", monospace';
        ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
        ctx.fillText('(0, 0)', axisX + 6, axisY + 14);
        ctx.restore();

        // 4. Linea guida di traiettoria verso il bersaglio (se presente)
        if (this.target) {
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.45)' : 'rgba(56, 189, 248, 0.45)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.player.startX, this.player.startY);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.stroke();
            ctx.restore();

            // Disegna punto di arrivo (Target Node / Moneta)
            this.drawTargetNode(ctx, this.target.x, this.target.y, this.target.label, isLight);
        }

        // 5. Particelle
        this.renderParticles(ctx);

        // 6. Personaggio Principale (Godot Robot Mascot)
        this.drawGodotRobot(ctx, this.player.x, this.player.y, this.player.size, this.player, this.time, isLight);

        // 7. Speech Bubble (Fumetto stile Godot)
        if (this.player.speech) {
            this.drawSpeechBubble(ctx, this.player.x, this.player.y - this.player.size * 0.75, this.player.speech, isLight);
        }

        // 8. Barra di Stato HUD Superiore & Inferiore
        this.renderHUD(ctx, w, h, isLight);
    }

    drawTargetNode(ctx, x, y, label, isLight) {
        ctx.save();
        const pulse = Math.sin(this.time * 5) * 3;

        // Cerchio target pulsante
        ctx.beginPath();
        ctx.arc(x, y, 16 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(6, 182, 212, 0.15)';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.stroke();

        // Icona moneta / bandierina al centro
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪙', x, y);

        // Etichetta coordinate
        if (label) {
            ctx.font = '700 10px "Fira Code", monospace';
            ctx.fillStyle = isLight ? '#0369a1' : '#38bdf8';
            ctx.fillText(label, x, y + 26);
        }
        ctx.restore();
    }

    drawGodotRobot(ctx, x, y, size, p, animTime, isLight) {
        ctx.save();
        ctx.translate(x, y);

        // Oscillazione idle (hovering robotico)
        const bob = Math.sin(animTime * 3.5) * 3.5;
        ctx.translate(0, bob);
        ctx.rotate(p.tilt);

        // Ombra a terra
        ctx.save();
        ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, size * 0.65 - bob * 0.5, size * 0.38, size * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Propulsore inferiore / glow energetico
        ctx.save();
        const thrust = Math.sin(animTime * 12) * 2;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.beginPath();
        ctx.ellipse(0, size * 0.42, 6, 8 + thrust, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Dimensioni Testa Godot
        const w = size * 0.88;
        const h = size * 0.72;
        const r = size * 0.22;

        // Base Testa (Godot Blue)
        ctx.fillStyle = '#478cbf';
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, r);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#27597d';
        ctx.stroke();

        // Ingranaggio / Antenna Superiore
        ctx.fillStyle = '#478cbf';
        ctx.fillRect(-size * 0.10, -h / 2 - size * 0.14, size * 0.20, size * 0.16);
        ctx.strokeRect(-size * 0.10, -h / 2 - size * 0.14, size * 0.20, size * 0.16);

        // Orecchie laterali
        [-1, 1].forEach(side => {
            const earX = side === 1 ? (w / 2) : (-w / 2 - size * 0.08);
            ctx.fillStyle = '#478cbf';
            ctx.fillRect(earX, -size * 0.08, size * 0.08, size * 0.22);
            ctx.strokeRect(earX, -size * 0.08, size * 0.08, size * 0.22);
        });

        // Occhi (Grandi cerchi bianchi)
        const eyeSpacing = w * 0.26;
        const eyeY = -h * 0.08;
        const eyeRadius = size * 0.16;

        [-1, 1].forEach(side => {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(side * eyeSpacing, eyeY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#27597d';
            ctx.stroke();

            // Pupilla
            if (p.isBlinking) {
                ctx.fillStyle = '#27597d';
                ctx.fillRect(side * eyeSpacing - eyeRadius * 0.8, eyeY - 1.5, eyeRadius * 1.6, 3);
            } else {
                ctx.fillStyle = '#27597d';
                ctx.beginPath();
                ctx.arc(side * eyeSpacing, eyeY, eyeRadius * 0.55, 0, Math.PI * 2);
                ctx.fill();

                // Riflesso pupilla bianco
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(side * eyeSpacing - eyeRadius * 0.18, eyeY - eyeRadius * 0.18, eyeRadius * 0.22, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Bocca (Dentini o Sorriso Godot)
        const mouthY = h * 0.22;
        if (p.state === "celebrating") {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, mouthY - 2, size * 0.18, 0, Math.PI);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#27597d';
            ctx.stroke();
        } else if (p.state === "error") {
            ctx.fillStyle = '#27597d';
            ctx.beginPath();
            ctx.arc(0, mouthY + 4, size * 0.08, 0, Math.PI * 2);
            ctx.fill();

            // Gocciolina di sudore
            ctx.font = '14px sans-serif';
            ctx.fillText('💧', w * 0.45, -h * 0.45);
        } else {
            // Dentini Godot classici
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-size * 0.15, mouthY - size * 0.05, size * 0.30, size * 0.10);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#27597d';
            ctx.strokeRect(-size * 0.15, mouthY - size * 0.05, size * 0.30, size * 0.10);

            // Divisori dentini
            ctx.beginPath();
            ctx.moveTo(-size * 0.05, mouthY - size * 0.05);
            ctx.lineTo(-size * 0.05, mouthY + size * 0.05);
            ctx.moveTo(size * 0.05, mouthY - size * 0.05);
            ctx.lineTo(size * 0.05, mouthY + size * 0.05);
            ctx.stroke();
        }

        // Nome Entità sopra la testa
        ctx.font = '700 10px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
        ctx.fillText(p.name, 0, -h * 0.65);

        // Barra Punti Vita (HP) sopra la testa se presente
        if (p.hp !== null) {
            const barW = 46;
            const barH = 5;
            const barY = -h * 0.85;
            const pct = Math.max(0, Math.min(p.hp / p.maxHp, 1));

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(-barW / 2, barY, barW, barH);

            // Colore dinamico vita (verde > giallo > rosso)
            let hpColor = '#10b981';
            if (pct < 0.3) hpColor = '#ef4444';
            else if (pct < 0.6) hpColor = '#f59e0b';

            ctx.fillStyle = hpColor;
            ctx.fillRect(-barW / 2, barY, barW * pct, barH);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(-barW / 2, barY, barW, barH);

            ctx.font = '8px "Fira Code", monospace';
            ctx.fillStyle = isLight ? '#334155' : '#e2e8f0';
            ctx.fillText(`${p.hp} HP`, 0, barY - 3);
        }

        ctx.restore();
    }

    drawSpeechBubble(ctx, x, y, text, isLight) {
        ctx.save();
        ctx.font = '700 11px "Inter", sans-serif';
        const metrics = ctx.measureText(text);
        const bubbleW = Math.min(Math.max(metrics.width + 24, 70), 220);
        const bubbleH = 28;
        const bubbleX = Math.max(10, Math.min(x - bubbleW / 2, this.width - bubbleW - 10));
        const bubbleY = Math.max(28, y - bubbleH);

        // Sfondo fumetto
        ctx.fillStyle = isLight ? '#ffffff' : '#1e293b';
        ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
        ctx.fill();
        ctx.stroke();

        // Puntina fumetto verso il robottino
        ctx.fillStyle = isLight ? '#ffffff' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(x - 5, bubbleY + bubbleH);
        ctx.lineTo(x + 5, bubbleY + bubbleH);
        ctx.lineTo(x, bubbleY + bubbleH + 6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(x - 5, bubbleY + bubbleH);
        ctx.lineTo(x, bubbleY + bubbleH + 6);
        ctx.lineTo(x + 5, bubbleY + bubbleH);
        ctx.stroke();

        // Testo del fumetto
        ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bubbleX + bubbleW / 2, bubbleY + bubbleH / 2);

        ctx.restore();
    }

    renderParticles(ctx) {
        for (const pt of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
            if (pt.type === 'star') {
                ctx.translate(pt.x, pt.y);
                ctx.rotate(pt.rotation);
                ctx.fillStyle = pt.color;
                ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
            } else {
                ctx.fillStyle = pt.color;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    renderHUD(ctx, w, h, isLight) {
        ctx.save();

        // Badge Top-Left: Engine e Coordinate
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = isLight ? '#cbd5e1' : '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(8, 8, 140, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 9px "Fira Code", monospace';
        ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🎮 2D (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`, 14, 19);

        // Badge Top-Right: Monete o FPS
        let rightText = `${this.fps} FPS`;
        if (this.player.coins !== null) {
            rightText = `🪙 ${this.player.coins} | ${this.fps} FPS`;
        }

        ctx.font = '700 9px "Fira Code", monospace';
        const rightMetrics = ctx.measureText(rightText);
        const rBadgeW = rightMetrics.width + 16;

        ctx.beginPath();
        ctx.roundRect(w - rBadgeW - 8, 8, rBadgeW, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
        ctx.fillText(rightText, w - rBadgeW, 19);

        // Footer Informativo Bottom
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 15, 25, 0.85)';
        ctx.fillRect(0, h - 22, w, 22);
        ctx.strokeStyle = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(0, h - 22);
        ctx.lineTo(w, h - 22);
        ctx.stroke();

        ctx.font = '10px "Inter", sans-serif';
        ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`ℹ️ ${this.statusText}`, 10, h - 11);

        ctx.restore();
    }
}

// Inizializzazione globale comoda
window.GodotViewport = GodotViewport;
