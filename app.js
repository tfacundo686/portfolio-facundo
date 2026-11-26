/* =========================================================
   CONTROLADOR PRINCIPAL — PORTFOLIO FACUNDO TORRES
   Navegación temporal, evanescencias, tilt 3D, cursor y audio
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.era-section'));
  const timelineNodes = Array.from(document.querySelectorAll('.timeline-node'));
  const progressBar = document.getElementById('timeline-progress');
  const hudBadge = document.getElementById('hud-era-badge');
  const hudYear = document.getElementById('hud-era-year');
  const soundToggle = document.getElementById('sound-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  const bgEngine = new EraBackgroundEngine();
  const portalEngine = new TimePortalEngine();

  let currentEra = 0;
  let isTransitioning = false;
  let soundEnabled = false;
  let audioCtx = null;

  const eraPalettes = [
    ['#c084fc', '#38bdf8', '#ffffff'], // 0: Big Bang
    ['#f97316', '#ef4444', '#fde047'], // 1: Primordial
    ['#34d399', '#d97706', '#bef264'], // 2: Mesozoico / Dinosaurios
    ['#38bdf8', '#a5f3fc', '#ffffff'], // 3: Edad de Hielo
    ['#f59e0b', '#fbbf24', '#fef3c7'], // 4: Industrial
    ['#22d3ee', '#818cf8', '#ffffff']  // 5: Digital
  ];

  // ==================== AUDIO SINTETIZADO DEL PORTAL ====================
  function playPortalSound() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc2.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.55);
      osc.frequency.exponentialRampToValueAtTime(110, now + 1.15);

      osc2.frequency.setValueAtTime(180, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 0.55);
      osc2.frequency.exponentialRampToValueAtTime(160, now + 1.15);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.55);
      filter.frequency.exponentialRampToValueAtTime(400, now + 1.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 1.22);
      osc2.stop(now + 1.22);
    } catch (_) {
      // Ignorar si el navegador bloquea Web Audio
    }
  }

  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIconOn.classList.toggle('hidden', !soundEnabled);
    soundIconOff.classList.toggle('hidden', soundEnabled);
    if (soundEnabled) playPortalSound();
  });

  // ==================== VIAJE EN EL TIEMPO ====================
  function travelToEra(targetIndex) {
    if (isTransitioning || targetIndex === currentEra) return;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    isTransitioning = true;
    const fromSection = sections[currentEra];
    const toSection = sections[targetIndex];

    const fromYear = Number(fromSection.dataset.numericYear);
    const toYear = Number(toSection.dataset.numericYear);
    const targetName = toSection.dataset.eraName;

    // 1. Evanescencia de salida de la era actual
    fromSection.classList.add('evanescing-out');
    playPortalSound();

    // 2. Activar el Portal del Tiempo
    portalEngine.trigger({
      fromYear,
      toYear,
      targetName,
      colors: eraPalettes[targetIndex],
      onMidpoint: () => {
        // Cambiar de era justo en el destello del portal
        fromSection.classList.remove('active', 'evanescing-out');
        toSection.scrollTop = 0;
        toSection.classList.add('active');

        currentEra = targetIndex;
        document.body.dataset.era = String(currentEra);
        bgEngine.setEra(currentEra);
        updateHUD(currentEra);
      },
      onComplete: () => {
        isTransitioning = false;
      }
    });
  }

  function updateHUD(index) {
    const sec = sections[index];
    hudBadge.textContent = `ERA 0${index + 1} / 0${sections.length}`;
    hudYear.textContent = sec.dataset.eraYear;

    timelineNodes.forEach((node, i) => {
      node.classList.toggle('active', i === index);
    });

    const pct = (index / (sections.length - 1)) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Botones con data-go-era
  document.querySelectorAll('[data-go-era]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.dataset.goEra);
      travelToEra(target);
    });
  });

  // Logo vuelve al Big Bang
  document.getElementById('brand-home').addEventListener('click', () => {
    travelToEra(0);
  });

  // Navegación con teclado (← / →)
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') travelToEra(currentEra + 1);
    if (e.key === 'ArrowLeft') travelToEra(currentEra - 1);
  });

  // ==================== EFECTO MÁQUINA DE ESCRIBIR ====================
  const phrases = [
    'Futuro Programador & Creador de Mundos Digitales',
    'Apasionado por el Código, el Diseño y las Animaciones',
    'Transformando Ideas en Software desde el Big Bang'
  ];
  const typingEl = document.getElementById('typing-text');
  let phraseIdx = 0;
  let charIdx = phrases[0].length;
  let deleting = true;

  setTimeout(() => {
    setInterval(() => {
      const current = phrases[phraseIdx];
      if (deleting) {
        charIdx--;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      } else {
        charIdx++;
        typingEl.textContent = phrases[phraseIdx].slice(0, charIdx);
        if (charIdx === phrases[phraseIdx].length) {
          setTimeout(() => { deleting = true; }, 1800);
        }
      }
    }, 55);
  }, 2400);

  // ==================== CURSOR PERSONALIZADO ====================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .fossil-card, .ice-card, .brand').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  // ==================== EFECTO TILT 3D EN TARJETAS ====================
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==================== FORMULARIO DE CONTACTO ====================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    formFeedback.textContent = `✦ ¡Gracias ${name}! Tu señal fue transmitida a Facundo Torres.`;
    contactForm.reset();
    setTimeout(() => {
      formFeedback.textContent = '';
    }, 5000);
  });

  updateHUD(0);
});
