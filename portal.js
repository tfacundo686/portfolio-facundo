/* =========================================================
   MOTOR DEL PORTAL DEL TIEMPO (Canvas 2D)
   Vórtice espacio-temporal, anillos warp y túnel de partículas
   ========================================================= */

class TimePortalEngine {
  constructor() {
    this.overlay = document.getElementById('portal-overlay');
    this.canvas = document.getElementById('portal-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.yearEl = document.getElementById('portal-year');
    this.destEl = document.getElementById('portal-destination');
    this.flashEl = document.getElementById('portal-flash');

    this.running = false;
    this.stars = [];
    this.rings = [];
    this.colorPalette = ['#c084fc', '#38bdf8', '#ffffff'];

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
    this.cx = this.w / 2;
    this.cy = this.h / 2;
  }

  initParticles(colors) {
    this.colorPalette = colors;
    this.stars = Array.from({ length: 220 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 80 + 10,
      speed: Math.random() * 14 + 8,
      size: Math.random() * 2.6 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      spin: (Math.random() - 0.5) * 0.08
    }));

    this.rings = Array.from({ length: 14 }, (_, i) => ({
      radius: i * 90 + 20,
      rotation: Math.random() * Math.PI * 2,
      speed: 22 + i * 1.2,
      color: colors[i % colors.length]
    }));
  }

  formatYear(num) {
    const abs = Math.abs(Math.round(num));
    if (abs >= 1_000_000_000) {
      return `${(abs / 1_000_000_000).toFixed(1)}B A.C.`;
    }
    if (abs >= 1_000_000) {
      return `${Math.round(abs / 1_000_000)}M A.C.`;
    }
    if (num < 0) {
      return `${abs.toLocaleString('es-AR')} A.C.`;
    }
    return `${abs} D.C.`;
  }

  trigger({ fromYear, toYear, targetName, colors, onMidpoint, onComplete }) {
    if (this.running) return;
    this.running = true;
    this.initParticles(colors);

    this.destEl.textContent = targetName.toUpperCase();
    this.overlay.classList.add('active');

    const duration = 1250; // ms totales del salto temporal
    const startTime = performance.now();
    let midpointCalled = false;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Interpolación acelerada del contador de años
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentYear = fromYear + (toYear - fromYear) * eased;
      this.yearEl.textContent = this.formatYear(currentYear);

      // Render del vórtice
      this.drawFrame(progress);

      // En el punto medio: destello de singularidad y cambio de era
      if (progress >= 0.52 && !midpointCalled) {
        midpointCalled = true;
        this.flashEl.classList.add('flash-on');
        if (typeof onMidpoint === 'function') onMidpoint();
        setTimeout(() => this.flashEl.classList.remove('flash-on'), 220);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.overlay.classList.remove('active');
        this.running = false;
        this.ctx.clearRect(0, 0, this.w, this.h);
        if (typeof onComplete === 'function') onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  drawFrame(progress) {
    const ctx = this.ctx;
    // Fondo semi-transparente para generar estela (motion blur)
    ctx.fillStyle = 'rgba(2, 4, 14, 0.28)';
    ctx.fillRect(0, 0, this.w, this.h);

    const maxR = Math.hypot(this.cx, this.cy) * 1.15;
    const intensity = Math.sin(progress * Math.PI); // 0 -> 1 -> 0

    // Núcleo del portal
    const coreGrad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, 220 * intensity + 40);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    coreGrad.addColorStop(0.35, this.colorPalette[0] + '88');
    coreGrad.addColorStop(0.7, this.colorPalette[1] + '33');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 240 * intensity + 60, 0, Math.PI * 2);
    ctx.fill();

    // Anillos del túnel espacio-temporal
    for (const ring of this.rings) {
      ring.radius += ring.speed * (0.6 + intensity * 1.8);
      ring.rotation += 0.04;
      if (ring.radius > maxR) {
        ring.radius = 18;
      }

      const alpha = Math.min(1, ring.radius / 180) * (1 - ring.radius / maxR) * (0.4 + intensity * 0.6);
      ctx.save();
      ctx.translate(this.cx, this.cy);
      ctx.rotate(ring.rotation);
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.lineWidth = 1.5 + (ring.radius / maxR) * 4;
      ctx.setLineDash([28, 16, 8, 16]);
      ctx.beginPath();
      ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Estrellas y líneas warp en espiral
    for (const s of this.stars) {
      const prevR = s.radius;
      const prevAngle = s.angle;
      s.radius += s.speed * (0.8 + intensity * 2.6) * (1 + s.radius / 320);
      s.angle += s.spin * (1 + intensity);

      if (s.radius > maxR) {
        s.radius = Math.random() * 35 + 5;
        s.angle = Math.random() * Math.PI * 2;
        continue;
      }

      const x1 = this.cx + Math.cos(prevAngle) * prevR;
      const y1 = this.cy + Math.sin(prevAngle) * prevR;
      const x2 = this.cx + Math.cos(s.angle) * s.radius;
      const y2 = this.cy + Math.sin(s.angle) * s.radius;

      ctx.strokeStyle = s.color;
      ctx.globalAlpha = Math.min(1, s.radius / 140) * (0.5 + intensity * 0.5);
      ctx.lineWidth = s.size * (0.5 + s.radius / maxR);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

window.TimePortalEngine = TimePortalEngine;
