/* =========================================================
   MOTOR DE FONDOS ATMOSFÉRICOS POR ERA (Canvas 2D)
   6 ecosistemas animados e interactivos con el mouse
   ========================================================= */

class EraBackgroundEngine {
  constructor() {
    this.canvas = document.getElementById('era-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.currentEra = 0;
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.time = 0;
    this.particles = [];
    this.gears = [];

    this.resize();
    this.setupEra(0);

    window.addEventListener('resize', () => {
      this.resize();
      this.setupEra(this.currentEra);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.loop();
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }

  setEra(eraIndex) {
    this.currentEra = eraIndex;
    this.setupEra(eraIndex);
  }

  setupEra(era) {
    this.particles = [];
    this.gears = [];

    if (era === 0) {
      // BIG BANG: polvo estelar, nebulosas y ondas de choque
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.max(this.w, this.h) * 0.65;
        this.particles.push({
          angle,
          dist,
          speed: Math.random() * 0.45 + 0.12,
          orbit: (Math.random() - 0.5) * 0.0025,
          size: Math.random() * 2.5 + 0.6,
          color: ['#ffffff', '#c084fc', '#38bdf8', '#f472b6'][Math.floor(Math.random() * 4)]
        });
      }
    } else if (era === 1) {
      // TIERRA PRIMORDIAL: cenizas volcánicas y brasas ascendentes
      for (let i = 0; i < 110; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.8 + 0.5),
          size: Math.random() * 3.5 + 1,
          alpha: Math.random() * 0.7 + 0.3,
          color: Math.random() > 0.35 ? '#f97316' : '#fbbf24'
        });
      }
    } else if (era === 2) {
      // ERA MESOZOICA / JURÁSICO: esporas luminosas y polen selvático
      for (let i = 0; i < 95; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 3.2 + 1.2,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.4 ? '#34d399' : '#f59e0b'
        });
      }
    } else if (era === 3) {
      // EDAD DE HIELO: ventisca de nieve cristalina
      for (let i = 0; i < 140; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: Math.random() * 1.2 - 0.3,
          vy: Math.random() * 1.8 + 0.6,
          size: Math.random() * 3 + 0.8,
          alpha: Math.random() * 0.7 + 0.25
        });
      }
    } else if (era === 4) {
      // ERA INDUSTRIAL: engranajes giratorios + chispas doradas
      for (let i = 0; i < 7; i++) {
        this.gears.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          radius: Math.random() * 75 + 40,
          teeth: Math.floor(Math.random() * 8) + 8,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.006 + 0.002)
        });
      }
      for (let i = 0; i < 65; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(Math.random() * 1.4 + 0.3),
          size: Math.random() * 2.4 + 0.8
        });
      }
    } else if (era === 5) {
      // ERA DIGITAL: red neuronal interactiva
      for (let i = 0; i < 75; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          size: Math.random() * 2.4 + 1.2
        });
      }
    }
  }

  loop() {
    this.time += 0.016;
    const ctx = this.ctx;

    if (this.currentEra === 0) this.drawBigBang(ctx);
    else if (this.currentEra === 1) this.drawVolcanic(ctx);
    else if (this.currentEra === 2) this.drawJurassic(ctx);
    else if (this.currentEra === 3) this.drawIceAge(ctx);
    else if (this.currentEra === 4) this.drawIndustrial(ctx);
    else if (this.currentEra === 5) this.drawDigital(ctx);

    requestAnimationFrame(() => this.loop());
  }

  drawBigBang(ctx) {
    ctx.fillStyle = '#04030c';
    ctx.fillRect(0, 0, this.w, this.h);

    const cx = this.w / 2 + (this.mouse.x - this.w / 2) * 0.04;
    const cy = this.h / 2 + (this.mouse.y - this.h / 2) * 0.04;

    // Nebulosa central pulsante
    const pulse = Math.sin(this.time * 1.6) * 28;
    const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, 340 + pulse);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(0.25, 'rgba(168, 85, 247, 0.22)');
    grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);

    // Onda expansiva periódica
    const waveR = ((this.time * 90) % 520);
    ctx.strokeStyle = `rgba(192, 132, 252, ${Math.max(0, 0.28 - waveR / 1900)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
    ctx.stroke();

    for (const p of this.particles) {
      p.dist += p.speed;
      p.angle += p.orbit;
      if (p.dist > Math.max(this.w, this.h) * 0.72) p.dist = 8;

      const x = cx + Math.cos(p.angle) * p.dist;
      const y = cy + Math.sin(p.angle) * p.dist;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.min(1, p.dist / 120);
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawVolcanic(ctx) {
    const bg = ctx.createLinearGradient(0, 0, 0, this.h);
    bg.addColorStop(0, '#140504');
    bg.addColorStop(0.65, '#290b06');
    bg.addColorStop(1, '#5c1908');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    // Resplandor de magma inferior
    const glow = ctx.createRadialGradient(this.w * 0.5, this.h * 1.05, 20, this.w * 0.5, this.h, this.w * 0.7);
    glow.addColorStop(0, 'rgba(249, 115, 22, 0.35)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, this.w, this.h);

    for (const p of this.particles) {
      p.x += p.vx + Math.sin(this.time + p.y * 0.01) * 0.35;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = this.h + 10;
        p.x = Math.random() * this.w;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawJurassic(ctx) {
    const bg = ctx.createLinearGradient(0, 0, 0, this.h);
    bg.addColorStop(0, '#04120a');
    bg.addColorStop(0.6, '#0b2618');
    bg.addColorStop(1, '#182414');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    // Rayos de sol filtrándose por la jungla
    const sunGrad = ctx.createRadialGradient(this.w * 0.2, 0, 10, this.w * 0.2, 0, this.h * 0.85);
    sunGrad.addColorStop(0, 'rgba(217, 119, 6, 0.16)');
    sunGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.08)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, this.w, this.h);

    for (const p of this.particles) {
      p.x += p.vx + Math.sin(this.time + p.phase) * 0.3;
      p.y += p.vy + Math.cos(this.time + p.phase) * 0.25;
      if (p.x < 0) p.x = this.w;
      if (p.x > this.w) p.x = 0;
      if (p.y < 0) p.y = this.h;
      if (p.y > this.h) p.y = 0;

      const glowAlpha = 0.35 + Math.sin(this.time * 2 + p.phase) * 0.3;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = glowAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawIceAge(ctx) {
    const bg = ctx.createLinearGradient(0, 0, 0, this.h);
    bg.addColorStop(0, '#020b16');
    bg.addColorStop(0.55, '#072138');
    bg.addColorStop(1, '#0c3554');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    // Aurora boreal dinámica
    ctx.save();
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      for (let x = 0; x <= this.w; x += 40) {
        const y = this.h * 0.22 + Math.sin(x * 0.004 + this.time * (0.8 + i * 0.3)) * 45 + i * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i === 0 ? 'rgba(56, 189, 248, 0.18)' : 'rgba(52, 211, 153, 0.14)';
      ctx.lineWidth = 55;
      ctx.stroke();
    }
    ctx.restore();

    // Nieve
    ctx.fillStyle = '#e0f2fe';
    for (const p of this.particles) {
      p.x += p.vx + Math.sin(this.time + p.y * 0.02) * 0.4;
      p.y += p.vy;
      if (p.y > this.h) {
        p.y = -5;
        p.x = Math.random() * this.w;
      }
      if (p.x > this.w) p.x = 0;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawIndustrial(ctx) {
    ctx.fillStyle = '#120d07';
    ctx.fillRect(0, 0, this.w, this.h);

    // Engranajes de fondo
    for (const g of this.gears) {
      g.angle += g.speed;
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.angle);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.14)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, g.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, g.radius * 0.45, 0, Math.PI * 2);
      ctx.stroke();

      for (let t = 0; t < g.teeth; t++) {
        const a = (t / g.teeth) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * g.radius, Math.sin(a) * g.radius);
        ctx.lineTo(Math.cos(a) * (g.radius + 12), Math.sin(a) * (g.radius + 12));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Chispas doradas
    ctx.fillStyle = '#fbbf24';
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = this.h;
        p.x = Math.random() * this.w;
      }
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawDigital(ctx) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.w, this.h);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.h) p.vy *= -1;

      // Conexiones entre nodos
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dist / 130) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Conexión con el cursor
      const mDist = Math.hypot(p.x - this.mouse.x, p.y - this.mouse.y);
      if (mDist < 160) {
        ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - mDist / 160) * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
      }

      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

window.EraBackgroundEngine = EraBackgroundEngine;
