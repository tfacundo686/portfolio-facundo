/* =========================================================
   PromoKiosco — Motor de Renderizado de Flyers (Canvas HD)
   Post 1:1 (1080x1080) e Historia WhatsApp 9:16 (1080x1920)
   ========================================================= */
(function (global) {
  "use strict";

  /* ---------------------------------------------------------
     Paletas de color
     --------------------------------------------------------- */
  const THEMES = [
    { id: "fuego", name: "Fuego", bg1: "#E53E3E", bg2: "#F59E0B", accent: "#FFE600", text: "#FFFFFF" },
    { id: "tropical", name: "Tropical", bg1: "#0D9488", bg2: "#0284C7", accent: "#FEF08A", text: "#FFFFFF" },
    { id: "neon", name: "Nocturno", bg1: "#4C1D95", bg2: "#DB2777", accent: "#22D3EE", text: "#FFFFFF" },
    { id: "sol", name: "Atardecer", bg1: "#EA580C", bg2: "#DC2626", accent: "#FEF3C7", text: "#FFFFFF" },
    { id: "frutal", name: "Frutal", bg1: "#BE185D", bg2: "#7C3AED", accent: "#FDE047", text: "#FFFFFF" },
    { id: "azul", name: "Eléctrico", bg1: "#1D4ED8", bg2: "#0891B2", accent: "#FACC15", text: "#FFFFFF" },
    { id: "verde", name: "Fresco", bg1: "#15803D", bg2: "#059669", accent: "#FEF08A", text: "#FFFFFF" },
    { id: "grafito", name: "Premium", bg1: "#18181B", bg2: "#3F3F46", accent: "#F59E0B", text: "#FFFFFF" },
    { id: "kraft", name: "Kraft", bg1: "#C9A27A", bg2: "#A97E52", accent: "#9B1C1C", text: "#2B1D12" },
    { id: "pastel", name: "Pastel", bg1: "#FBCFE8", bg2: "#BFDBFE", accent: "#7C3AED", text: "#1E1B4B" },
    { id: "limon", name: "Limón", bg1: "#FDE047", bg2: "#A3E635", accent: "#DC2626", text: "#1A2E05" },
    { id: "medianoche", name: "Medianoche", bg1: "#0F172A", bg2: "#1E3A8A", accent: "#F472B6", text: "#FFFFFF" }
  ];

  /* ---------------------------------------------------------
     Tipografías
     --------------------------------------------------------- */
  const FONTS = [
    { id: "Bricolage Grotesque", label: "Bricolage", family: "'Bricolage Grotesque', sans-serif", weight: "800", sample: "Oferta" },
    { id: "Anton", label: "Anton", family: "'Anton', sans-serif", weight: "400", sample: "PRECIAZO" },
    { id: "Bebas Neue", label: "Bebas Neue", family: "'Bebas Neue', sans-serif", weight: "400", sample: "SUPER 2X1" },
    { id: "Montserrat", label: "Montserrat", family: "'Montserrat', sans-serif", weight: "900", sample: "REBAJA" },
    { id: "Fredoka", label: "Fredoka", family: "'Fredoka', sans-serif", weight: "700", sample: "Promo!" },
    { id: "Lilita One", label: "Lilita One", family: "'Lilita One', cursive", weight: "400", sample: "COMBO" },
    { id: "Bangers", label: "Bangers", family: "'Bangers', cursive", weight: "400", sample: "OFERTA!" },
    { id: "Righteous", label: "Righteous", family: "'Righteous', cursive", weight: "400", sample: "Retro" },
    { id: "Permanent Marker", label: "Marcador", family: "'Permanent Marker', cursive", weight: "400", sample: "Pizarra" },
    { id: "Pacifico", label: "Pacifico", family: "'Pacifico', cursive", weight: "400", sample: "Especial" }
  ];

  /* ---------------------------------------------------------
     Tramas de fondo
     --------------------------------------------------------- */
  const PATTERNS = [
    { id: "ninguno", label: "Ninguna" },
    { id: "sunburst", label: "Rayos" },
    { id: "confetti", label: "Confeti" },
    { id: "dots", label: "Puntos" },
    { id: "halftone", label: "Semitono" },
    { id: "stripes", label: "Rayas" },
    { id: "waves", label: "Olas" },
    { id: "zigzag", label: "Zigzag" },
    { id: "cuadros", label: "Cuadros" },
    { id: "grilla", label: "Cuadrícula" },
    { id: "estrellas", label: "Estrellas" }
  ];

  /* ---------------------------------------------------------
     Diseño por defecto (todas las opciones configurables)
     --------------------------------------------------------- */
  const DEFAULT_DESIGN = {
    template: "clasico",
    themeId: "fuego",
    bg1: "#E53E3E",
    bg2: "#F59E0B",
    accent: "#FFE600",
    textColor: "#FFFFFF",

    font: "Bricolage Grotesque",
    titleCase: "normal",
    titleScale: 100,
    textEffect: "sombra",

    badgeShape: "estrella",
    badgePos: "der",
    badgeScale: 100,

    priceStyle: "oscura",
    showSavings: true,

    frameStyle: "linea",
    cornerRibbon: "",

    photoFit: "cover",
    photoStyle: "postal",
    photoZoom: 100,
    photoScale: 100,
    photoOffsetX: 0,
    photoOffsetY: 0,
    photoTilt: true,
    photoShadow: true,

    bgType: "degradado",
    bgAngle: 135,
    bgImage: "",
    bgBlur: 6,
    bgOverlay: 45,
    pattern: "sunburst",
    patternOpacity: 50,
    patternTone: "claro",
    spotlight: false,
    vignette: false,
    grain: false
  };

  /* ---------------------------------------------------------
     Plantillas con personalidad (presets completos)
     --------------------------------------------------------- */
  const TEMPLATES = [
    {
      id: "clasico",
      name: "Clásico",
      desc: "Explosión de oferta",
      values: {}
    },
    {
      id: "gondola",
      name: "Góndola",
      desc: "Cartel de súper",
      values: {
        themeId: "custom", bg1: "#FFD60A", bg2: "#FFC300", accent: "#D90429", textColor: "#141414",
        font: "Anton", titleCase: "upper", textEffect: "ninguno",
        badgeShape: "circulo", priceStyle: "gondola", frameStyle: "ninguno",
        photoStyle: "redondeada", photoTilt: false,
        bgType: "solido", pattern: "stripes", patternTone: "claro", patternOpacity: 70, spotlight: true
      }
    },
    {
      id: "pizarra",
      name: "Pizarra",
      desc: "Almacén de barrio",
      values: {
        themeId: "custom", bg1: "#2B3B33", bg2: "#18221D", accent: "#FDE68A", textColor: "#F7F3E8",
        font: "Permanent Marker", textEffect: "ninguno",
        badgeShape: "circulo", priceStyle: "contorno", frameStyle: "madera",
        photoStyle: "postal", bgType: "radial", pattern: "ninguno", grain: true, vignette: true
      }
    },
    {
      id: "ticket",
      name: "Cupón",
      desc: "Ticket recortable",
      values: {
        themeId: "custom", bg1: "#FFF4DF", bg2: "#FBE3BC", accent: "#E63946", textColor: "#1D1A16",
        font: "Bebas Neue", titleCase: "upper", textEffect: "ninguno",
        badgeShape: "etiqueta", priceStyle: "acento", frameStyle: "ticket",
        photoStyle: "sticker", bgType: "degradado", bgAngle: 180,
        pattern: "dots", patternTone: "oscuro", patternOpacity: 25, grain: true
      }
    },
    {
      id: "pop",
      name: "Pop Art",
      desc: "Cómic y semitono",
      values: {
        themeId: "custom", bg1: "#FF2E63", bg2: "#7B2FF7", accent: "#FFE600", textColor: "#FFFFFF",
        font: "Bangers", textEffect: "3d",
        badgeShape: "estrella", priceStyle: "clara", frameStyle: "doble",
        photoStyle: "sticker", bgType: "radial", pattern: "halftone", patternOpacity: 70
      }
    },
    {
      id: "minimal",
      name: "Minimal",
      desc: "Limpio y elegante",
      values: {
        themeId: "custom", bg1: "#F5F2EB", bg2: "#E9E4D8", accent: "#111111", textColor: "#111111",
        font: "Bricolage Grotesque", textEffect: "ninguno",
        badgeShape: "circulo", priceStyle: "contorno", frameStyle: "ninguno",
        photoStyle: "redondeada", photoTilt: false,
        bgType: "solido", pattern: "ninguno"
      }
    },
    {
      id: "neon",
      name: "Neón",
      desc: "Noche de kiosco",
      values: {
        themeId: "custom", bg1: "#2A1B5C", bg2: "#0B0A1F", accent: "#39FF88", textColor: "#FFFFFF",
        font: "Righteous", textEffect: "brillo",
        badgeShape: "circulo", priceStyle: "oscura", frameStyle: "linea",
        photoStyle: "redondeada", bgType: "radial", pattern: "grilla", patternOpacity: 40, vignette: true
      }
    },
    {
      id: "mercado",
      name: "Mercado",
      desc: "Fresco y natural",
      values: {
        themeId: "custom", bg1: "#15803D", bg2: "#65A30D", accent: "#FEF08A", textColor: "#FFFFFF",
        font: "Fredoka", textEffect: "sombra",
        badgeShape: "cinta", priceStyle: "clara", frameStyle: "punteado",
        photoStyle: "circulo", bgType: "degradado", bgAngle: 160, pattern: "waves", spotlight: true
      }
    },
    {
      id: "kraft",
      name: "Kraft",
      desc: "Papel madera",
      values: {
        themeId: "kraft", bg1: "#C9A27A", bg2: "#A97E52", accent: "#9B1C1C", textColor: "#2B1D12",
        font: "Lilita One", textEffect: "ninguno",
        badgeShape: "etiqueta", priceStyle: "clara", frameStyle: "punteado",
        photoStyle: "postal", bgType: "radial", pattern: "ninguno", grain: true, vignette: true
      }
    }
  ];

  /* ---------------------------------------------------------
     Utilidades
     --------------------------------------------------------- */
  const imageCache = new Map();

  function loadImageCached(src) {
    if (!src) return Promise.resolve(null);
    const cached = imageCache.get(src);
    if (cached && cached.complete && cached.naturalWidth) return Promise.resolve(cached);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function formatMoney(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return "";
    return "$" + n.toLocaleString("es-AR", {
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  function calcDiscount(originalPrice, promoPrice) {
    const orig = Number(originalPrice);
    const promo = Number(promoPrice);
    if (!Number.isFinite(orig) || !Number.isFinite(promo) || orig <= 0 || promo <= 0 || promo >= orig) {
      return { percent: 0, savings: 0 };
    }
    const savings = orig - promo;
    return { percent: Math.round((savings / orig) * 100), savings };
  }

  function hexToRgb(hex) {
    let c = String(hex || "#000000").replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const n = parseInt(c.slice(0, 6), 16) || 0;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgba(hex, a) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function contrastOn(hex) {
    return luminance(hex) > 0.6 ? "#161513" : "#FFFFFF";
  }

  function shade(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const f = (v) => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  function roundRectSub(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    roundRectSub(ctx, x, y, w, h, r);
  }

  function drawStarburst(ctx, cx, cy, outerR, innerR, points) {
    ctx.beginPath();
    const step = Math.PI / points;
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function wrapLines(ctx, text, maxWidth, maxLines) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = current + " " + words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        lines.push(current);
        current = words[i];
        if (lines.length === maxLines - 1) {
          current = words.slice(i).join(" ");
          break;
        }
      }
    }
    lines.push(current);
    return lines.slice(0, maxLines);
  }

  function clearShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  function normalize(promo) {
    const p = Object.assign({}, DEFAULT_DESIGN, promo || {});
    if (promo && promo.photoFrame === false && !promo.photoStyle) p.photoStyle = "sin-marco";
    [
      "photoZoom", "photoScale", "photoOffsetX", "photoOffsetY", "bgAngle", "bgBlur",
      "bgOverlay", "patternOpacity", "titleScale", "badgeScale"
    ].forEach((k) => {
      p[k] = Number(p[k]);
      if (!Number.isFinite(p[k])) p[k] = DEFAULT_DESIGN[k];
    });
    p.cornerRibbon = String(p.cornerRibbon || "");
    return p;
  }

  /* ---------------------------------------------------------
     Fondo
     --------------------------------------------------------- */
  function linearByAngle(ctx, W, H, angleDeg, c1, c2) {
    const a = (angleDeg * Math.PI) / 180;
    const vx = Math.sin(a);
    const vy = -Math.cos(a);
    const half = (Math.abs(W * vx) + Math.abs(H * vy)) / 2;
    const cx = W / 2;
    const cy = H / 2;
    const g = ctx.createLinearGradient(cx - vx * half, cy - vy * half, cx + vx * half, cy + vy * half);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  }

  function drawCoverRect(ctx, img, x, y, w, h) {
    const s = Math.max(w / img.width, h / img.height);
    const dw = img.width * s;
    const dh = img.height * s;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }

  function drawBackground(ctx, W, H, p, bgImg) {
    ctx.save();
    if (p.bgType === "solido") {
      ctx.fillStyle = p.bg1;
      ctx.fillRect(0, 0, W, H);
    } else if (p.bgType === "radial") {
      const r = Math.max(W, H) * 0.8;
      const g = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, r);
      g.addColorStop(0, p.bg1);
      g.addColorStop(1, p.bg2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    } else if (p.bgType === "imagen" && bgImg) {
      ctx.fillStyle = p.bg1;
      ctx.fillRect(0, 0, W, H);
      const blur = Math.max(0, p.bgBlur);
      ctx.save();
      if (blur > 0) ctx.filter = `blur(${blur * 2}px)`;
      const m = blur * 5;
      drawCoverRect(ctx, bgImg, -m, -m, W + m * 2, H + m * 2);
      ctx.restore();
      const alpha = Math.max(0, Math.min(1, p.bgOverlay / 100));
      if (alpha > 0) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = linearByAngle(ctx, W, H, p.bgAngle, p.bg1, p.bg2);
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    } else {
      ctx.fillStyle = linearByAngle(ctx, W, H, p.bgAngle, p.bg1, p.bg2);
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function drawPattern(ctx, W, H, p) {
    const pattern = p.pattern;
    if (!pattern || pattern === "ninguno") return;
    const k = Math.max(0, p.patternOpacity) / 50;
    if (k <= 0) return;
    const base = p.patternTone === "oscuro" ? "0,0,0" : "255,255,255";
    const col = (a) => `rgba(${base},${Math.min(1, a * k)})`;

    ctx.save();
    switch (pattern) {
      case "sunburst": {
        const cx = W / 2;
        const cy = H * 0.44;
        const maxR = Math.hypot(W, H);
        const rays = 24;
        ctx.fillStyle = col(0.09);
        for (let i = 0; i < rays; i++) {
          const a1 = (i * 2 * Math.PI) / rays;
          const a2 = ((i + 0.5) * 2 * Math.PI) / rays;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, maxR, a1, a2);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case "confetti": {
        const colors = [col(0.22), rgba(p.accent, Math.min(1, 0.32 * k)), col(0.12)];
        const count = Math.round((W * H) / 21000);
        for (let i = 0; i < count; i++) {
          const px = (((i * 197 + 53) % 100) / 100) * W;
          const py = (((i * 313 + 79) % 100) / 100) * H;
          const size = 10 + (i % 5) * 6;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate((i * 0.65) % Math.PI);
          ctx.fillStyle = colors[i % colors.length];
          if (i % 3 === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
            ctx.fill();
          } else {
            roundRectPath(ctx, -size, -size * 0.35, size * 2, size * 0.7, 4);
            ctx.fill();
          }
          ctx.restore();
        }
        break;
      }
      case "dots": {
        ctx.fillStyle = col(0.12);
        const gap = 58;
        for (let y = 24; y < H; y += gap) {
          for (let x = 24; x < W + gap; x += gap) {
            const offsetX = (Math.floor(y / gap) % 2) * (gap / 2);
            ctx.beginPath();
            ctx.arc(x + offsetX, y, 9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      }
      case "halftone": {
        ctx.fillStyle = col(0.16);
        const gap = 34;
        for (let y = 0; y <= H + gap; y += gap) {
          for (let x = 0; x <= W + gap; x += gap) {
            const t = (x / W) * 0.5 + (y / H) * 0.5;
            const r = gap * 0.46 * (1 - t) + 1.5;
            if (r <= 0.5) continue;
            ctx.beginPath();
            ctx.arc(x + ((y / gap) % 2 ? gap / 2 : 0), y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      }
      case "stripes": {
        ctx.fillStyle = col(0.08);
        ctx.translate(W / 2, H / 2);
        ctx.rotate(-Math.PI / 6);
        const span = Math.hypot(W, H);
        for (let x = -span; x < span; x += 110) ctx.fillRect(x, -span, 44, span * 2);
        break;
      }
      case "waves": {
        ctx.strokeStyle = col(0.12);
        ctx.lineWidth = 20;
        const rows = Math.ceil(H / 108) + 2;
        for (let row = 0; row < rows; row++) {
          const baseY = row * 108;
          ctx.beginPath();
          for (let x = -40; x <= W + 40; x += 40) {
            const y = baseY + Math.sin(x * 0.012 + row) * 24;
            if (x === -40) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        break;
      }
      case "zigzag": {
        ctx.strokeStyle = col(0.12);
        ctx.lineWidth = 12;
        ctx.lineJoin = "miter";
        for (let y = -40; y < H + 80; y += 90) {
          ctx.beginPath();
          let i = 0;
          for (let x = -60; x <= W + 60; x += 60, i++) {
            const yy = y + (i % 2 ? 30 : 0);
            if (i === 0) ctx.moveTo(x, yy);
            else ctx.lineTo(x, yy);
          }
          ctx.stroke();
        }
        break;
      }
      case "cuadros": {
        ctx.fillStyle = col(0.07);
        const size = 90;
        for (let y = 0, j = 0; y < H; y += size, j++) {
          for (let x = 0, i = 0; x < W; x += size, i++) {
            if ((i + j) % 2 === 0) ctx.fillRect(x, y, size, size);
          }
        }
        break;
      }
      case "grilla": {
        ctx.strokeStyle = col(0.14);
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 54) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
        }
        for (let y = 0; y <= H; y += 54) {
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
        }
        ctx.stroke();
        break;
      }
      case "estrellas": {
        const count = Math.round((W * H) / 34000);
        for (let i = 0; i < count; i++) {
          const px = (((i * 211 + 37) % 100) / 100) * W;
          const py = (((i * 157 + 61) % 100) / 100) * H;
          const R = 14 + (i % 4) * 8;
          ctx.fillStyle = col(i % 3 === 0 ? 0.24 : 0.14);
          drawStarburst(ctx, px, py, R, R * 0.45, 5);
          ctx.fill();
        }
        break;
      }
      default:
        break;
    }
    ctx.restore();
  }

  function drawSpotlight(ctx, W, H, area) {
    const cx = area.x + area.w / 2;
    const cy = area.y + area.h / 2;
    const r = Math.max(area.w, area.h) * 0.65;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(255,255,255,0.42)");
    g.addColorStop(0.55, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawVignette(ctx, W, H) {
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) / 2);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.save();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  let grainCanvas = null;
  function drawGrain(ctx, W, H) {
    if (!grainCanvas) {
      grainCanvas = document.createElement("canvas");
      grainCanvas.width = 220;
      grainCanvas.height = 220;
      const g = grainCanvas.getContext("2d");
      const data = g.createImageData(220, 220);
      for (let i = 0; i < data.data.length; i += 4) {
        const v = Math.random() * 255;
        data.data[i] = v;
        data.data[i + 1] = v;
        data.data[i + 2] = v;
        data.data[i + 3] = 34;
      }
      g.putImageData(data, 0, 0);
    }
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = ctx.createPattern(grainCanvas, "repeat");
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* ---------------------------------------------------------
     Marco del flyer y cinta de esquina
     --------------------------------------------------------- */
  function drawFrame(ctx, W, H, p, priceCardTop) {
    const style = p.frameStyle;
    if (!style || style === "ninguno") return;
    const col = rgba(p.textColor, 0.34);
    ctx.save();

    if (style === "linea") {
      ctx.strokeStyle = col;
      ctx.lineWidth = 7;
      roundRectPath(ctx, 28, 28, W - 56, H - 56, 40);
      ctx.stroke();
    } else if (style === "doble") {
      ctx.strokeStyle = col;
      ctx.lineWidth = 7;
      roundRectPath(ctx, 24, 24, W - 48, H - 48, 40);
      ctx.stroke();
      ctx.lineWidth = 3;
      roundRectPath(ctx, 46, 46, W - 92, H - 92, 28);
      ctx.stroke();
    } else if (style === "punteado") {
      ctx.strokeStyle = rgba(p.textColor, 0.5);
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.setLineDash([1, 20]);
      roundRectPath(ctx, 30, 30, W - 60, H - 60, 36);
      ctx.stroke();
    } else if (style === "ticket") {
      ctx.strokeStyle = col;
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 12]);
      roundRectPath(ctx, 30, 30, W - 60, H - 60, 30);
      ctx.stroke();

      const y = priceCardTop - 26;
      ctx.beginPath();
      ctx.moveTo(70, y);
      ctx.lineTo(W - 70, y);
      ctx.setLineDash([14, 12]);
      ctx.strokeStyle = rgba(p.textColor, 0.45);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = luminance(p.bg1) > 0.6 ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.32)";
      [0, W].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
      });
      for (let x = 30; x < W; x += 60) {
        ctx.beginPath();
        ctx.arc(x, 0, 13, 0, Math.PI * 2);
        ctx.arc(x, H, 13, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === "madera") {
      const t = 46;
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#8B5A2B");
      g.addColorStop(0.5, "#A86B36");
      g.addColorStop(1, "#6E4220");
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      roundRectSub(ctx, t, t, W - t * 2, H - t * 2, 14);
      ctx.fillStyle = g;
      ctx.fill("evenodd");

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      roundRectSub(ctx, t, t, W - t * 2, H - t * 2, 14);
      ctx.clip("evenodd");
      ctx.strokeStyle = "rgba(40,20,5,0.22)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 14; i++) {
        const off = 4 + i * 3.1;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 30) {
          const y1 = off + Math.sin(x * 0.02 + i) * 1.6;
          if (x === 0) ctx.moveTo(x, y1);
          else ctx.lineTo(x, y1);
        }
        for (let x = 0; x <= W; x += 30) {
          const y2 = H - off + Math.sin(x * 0.02 + i * 1.7) * 1.6;
          if (x === 0) ctx.moveTo(x, y2);
          else ctx.lineTo(x, y2);
        }
        for (let y = 0; y <= H; y += 30) {
          const x1 = off + Math.sin(y * 0.02 + i) * 1.6;
          if (y === 0) ctx.moveTo(x1, y);
          else ctx.lineTo(x1, y);
        }
        for (let y = 0; y <= H; y += 30) {
          const x2 = W - off + Math.sin(y * 0.02 + i * 1.3) * 1.6;
          if (y === 0) ctx.moveTo(x2, y);
          else ctx.lineTo(x2, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(0,0,0,0.38)";
      roundRectPath(ctx, t + 2, t + 2, W - t * 2 - 4, H - t * 2 - 4, 14);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,230,190,0.25)";
      ctx.strokeRect(2, 2, W - 4, H - 4);
    }
    ctx.restore();
  }

  function drawCornerRibbon(ctx, W, text, side, accent) {
    ctx.save();
    ctx.font = "900 26px 'Montserrat', sans-serif";
    const tw = ctx.measureText(text).width;
    const d = Math.max(170, Math.min(260, (tw + 50) / 1.414));
    const band = 54;
    if (side === "left") {
      ctx.translate(d / 2, d / 2);
      ctx.rotate(-Math.PI / 4);
    } else {
      ctx.translate(W - d / 2, d / 2);
      ctx.rotate(Math.PI / 4);
    }
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = "#161513";
    ctx.fillRect(-d * 1.5, -band / 2, d * 3, band);
    clearShadow(ctx);

    ctx.strokeStyle = rgba(accent, 0.8);
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(-d * 1.5, -band / 2 + 7);
    ctx.lineTo(d * 1.5, -band / 2 + 7);
    ctx.moveTo(-d * 1.5, band / 2 - 7);
    ctx.lineTo(d * 1.5, band / 2 - 7);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = accent;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 2, d * 1.3);
    ctx.restore();
  }

  /* ---------------------------------------------------------
     Encabezado, títulos y pie
     --------------------------------------------------------- */
  function drawStorePill(ctx, W, isStory, store) {
    const name = ((store && store.name) || "Mi Kiosco").toUpperCase();
    const y = isStory ? 96 : 58;
    ctx.save();
    ctx.font = "800 30px 'DM Sans', sans-serif";
    const pillW = Math.min(600, Math.max(260, ctx.measureText(name).width + 86));
    const pillH = 62;
    const x = (W - pillW) / 2;
    ctx.shadowColor = "rgba(0,0,0,0.22)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "rgba(17, 17, 16, 0.86)";
    roundRectPath(ctx, x, y, pillW, pillH, 999);
    ctx.fill();
    clearShadow(ctx);
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, W / 2, y + pillH / 2 + 1, pillW - 44);
    ctx.restore();
  }

  function drawStyledText(ctx, text, x, y, size, p, lightText) {
    const eff = p.textEffect;
    ctx.save();
    if (eff === "contorno") {
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.lineWidth = Math.max(4, size * 0.14);
      ctx.strokeStyle = lightText ? "rgba(17,17,16,0.92)" : "#FFFFFF";
      ctx.strokeText(text, x, y);
    } else if (eff === "3d") {
      const depth = Math.max(4, Math.round(size * 0.08));
      ctx.fillStyle = lightText ? shade(p.bg1, -0.6) : shade(p.bg1, -0.3);
      for (let i = depth; i > 0; i--) ctx.fillText(text, x + i, y + i);
    } else if (eff === "brillo") {
      ctx.shadowColor = p.accent;
      ctx.shadowBlur = size * 0.5;
      ctx.fillStyle = p.textColor;
      ctx.fillText(text, x, y);
      ctx.fillText(text, x, y);
      clearShadow(ctx);
    } else if (eff === "sombra") {
      ctx.shadowColor = lightText ? "rgba(0,0,0,0.34)" : "rgba(0,0,0,0.16)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
    }
    ctx.fillStyle = p.textColor;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawFooter(ctx, W, isStory, p, store, lightText) {
    const validity = (p.validity || "").trim();
    const parts = [];
    if (store && store.address) parts.push(store.address);
    if (store && store.phone) parts.push("WSP: " + store.phone);
    const contactLine = parts.join("  •  ");
    const footerY = isStory ? 1745 : 1014;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = rgba(p.textColor, 0.92);
    if (lightText) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 8;
    }
    if (isStory) {
      if (validity) {
        ctx.font = "700 32px 'DM Sans', sans-serif";
        ctx.fillText(validity, W / 2, footerY, W - 140);
      }
      if (contactLine) {
        ctx.font = "700 32px 'DM Sans', sans-serif";
        ctx.fillText(contactLine, W / 2, footerY + 60, W - 140);
      }
    } else {
      const line = [validity, contactLine].filter(Boolean).join("  •  ");
      if (line) {
        ctx.font = "700 24px 'DM Sans', sans-serif";
        ctx.fillText(line, W / 2, footerY, W - 140);
      }
    }
    ctx.restore();
  }

  /* ---------------------------------------------------------
     Fotos de productos (ajuste, zoom, encuadre y marcos)
     --------------------------------------------------------- */
  function computeImageRect(img, x, y, w, h, fit, o) {
    const iw = img.width;
    const ih = img.height;
    let s = fit === "contain" ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
    s *= (o.zoom || 100) / 100;
    const dw = iw * s;
    const dh = ih * s;
    let dx = x + (w - dw) / 2;
    let dy = y + (h - dh) / 2;
    dx += ((o.offX || 0) / 50) * (Math.abs(dw - w) / 2);
    dy += ((o.offY || 0) / 50) * (Math.abs(dh - h) / 2);
    return { dx, dy, dw, dh };
  }

  function drawImageInBox(ctx, img, x, y, w, h, radius, fit, o, bg, clip) {
    ctx.save();
    if (clip !== false) {
      roundRectPath(ctx, x, y, w, h, radius);
      ctx.clip();
    }
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(x, y, w, h);
    }
    const r = computeImageRect(img, x, y, w, h, fit, o);
    ctx.drawImage(img, r.dx, r.dy, r.dw, r.dh);
    ctx.restore();
  }

  function setPhotoShadow(ctx, on) {
    if (!on) return;
    ctx.shadowColor = "rgba(15, 15, 20, 0.35)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 14;
  }

  function drawSticker(ctx, img, w, h, fit, o) {
    const b = Math.max(10, Math.round(Math.min(w, h) * 0.035));
    const cw = Math.ceil(w + b * 4);
    const ch = Math.ceil(h + b * 4);

    const inner = document.createElement("canvas");
    inner.width = cw;
    inner.height = ch;
    const ic = inner.getContext("2d");
    drawImageInBox(ic, img, b * 2, b * 2, w, h, fit === "contain" ? 0 : 26, fit, o, null, true);

    const sil = document.createElement("canvas");
    sil.width = cw;
    sil.height = ch;
    const sc = sil.getContext("2d");
    sc.drawImage(inner, 0, 0);
    sc.globalCompositeOperation = "source-in";
    sc.fillStyle = "#FFFFFF";
    sc.fillRect(0, 0, cw, ch);

    const outline = document.createElement("canvas");
    outline.width = cw;
    outline.height = ch;
    const oc = outline.getContext("2d");
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      oc.drawImage(sil, Math.cos(ang) * b, Math.sin(ang) * b);
    }
    oc.drawImage(sil, 0, 0);

    ctx.save();
    setPhotoShadow(ctx, o.shadow);
    ctx.drawImage(outline, -cw / 2, -ch / 2);
    clearShadow(ctx);
    ctx.drawImage(inner, -cw / 2, -ch / 2);
    ctx.restore();
  }

  function drawPhoto(ctx, img, cx, cy, boxW, boxH, angle, o) {
    let w = boxW;
    let h = boxH;
    if (o.fit === "marco") {
      const r = img.width / img.height;
      if (r > w / h) h = w / r;
      else w = h * r;
    }
    if (o.style === "circulo") {
      const s = Math.min(w, h);
      w = s;
      h = s;
    }
    const fit = o.fit === "contain" ? "contain" : "cover";

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    switch (o.style) {
      case "postal": {
        const pad = Math.max(12, w * 0.035);
        const bottom = pad * 1.9;
        const ow = w + pad * 2;
        const oh = h + pad + bottom;
        const ox = -ow / 2;
        const oy = -oh / 2;
        setPhotoShadow(ctx, o.shadow);
        ctx.fillStyle = "#FFFFFF";
        roundRectPath(ctx, ox, oy, ow, oh, 22);
        ctx.fill();
        clearShadow(ctx);
        drawImageInBox(ctx, img, ox + pad, oy + pad, w, h, 12, fit, o, "#FFFFFF");
        break;
      }
      case "redondeada": {
        const x = -w / 2;
        const y = -h / 2;
        setPhotoShadow(ctx, o.shadow);
        ctx.fillStyle = "#FFFFFF";
        roundRectPath(ctx, x, y, w, h, 36);
        ctx.fill();
        clearShadow(ctx);
        drawImageInBox(ctx, img, x, y, w, h, 36, fit, o, "#FFFFFF");
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#FFFFFF";
        roundRectPath(ctx, x, y, w, h, 36);
        ctx.stroke();
        break;
      }
      case "circulo": {
        setPhotoShadow(ctx, o.shadow);
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(0, 0, w / 2 + 10, 0, Math.PI * 2);
        ctx.fill();
        clearShadow(ctx);
        drawImageInBox(ctx, img, -w / 2, -h / 2, w, h, w / 2, fit, o, "#FFFFFF");
        break;
      }
      case "sticker": {
        drawSticker(ctx, img, w, h, fit, o);
        break;
      }
      default: {
        const x = -w / 2;
        const y = -h / 2;
        if (fit === "cover") {
          setPhotoShadow(ctx, o.shadow);
          ctx.fillStyle = "#FFFFFF";
          roundRectPath(ctx, x, y, w, h, 20);
          ctx.fill();
          clearShadow(ctx);
          drawImageInBox(ctx, img, x, y, w, h, 20, fit, o, null);
        } else {
          const needsClip = (o.zoom || 100) > 100;
          ctx.save();
          if (needsClip) {
            roundRectPath(ctx, x, y, w, h, 0);
            ctx.clip();
          }
          setPhotoShadow(ctx, o.shadow && !needsClip);
          const r = computeImageRect(img, x, y, w, h, fit, o);
          ctx.drawImage(img, r.dx, r.dy, r.dw, r.dh);
          ctx.restore();
        }
      }
    }
    ctx.restore();
  }

  function drawPhotosArea(ctx, images, area, p) {
    const { x, y, w, h } = area;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const o = {
      fit: p.photoFit,
      style: p.photoStyle,
      zoom: p.photoZoom,
      offX: p.photoOffsetX,
      offY: p.photoOffsetY,
      shadow: p.photoShadow !== false
    };
    const s = Math.max(0.5, p.photoScale / 100);
    const t = p.photoTilt !== false ? 1 : 0;

    if (!images.length) {
      ctx.save();
      ctx.fillStyle = rgba(p.textColor, 0.12);
      ctx.strokeStyle = rgba(p.textColor, 0.42);
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 12]);
      const pw = Math.min(520, w - 40);
      const ph = Math.min(290, h - 20);
      roundRectPath(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 28);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = rgba(p.textColor, 0.92);
      ctx.font = "700 36px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Agregá fotos de tus productos", cx, cy - 16, pw - 40);
      ctx.font = "500 25px 'DM Sans', sans-serif";
      ctx.fillStyle = rgba(p.textColor, 0.75);
      ctx.fillText("en el Paso 1 para armar tu cartel", cx, cy + 30, pw - 40);
      ctx.restore();
      return;
    }

    const count = images.length;
    if (count === 1) {
      const size = Math.min(w * 0.74, h * 0.82) * s;
      drawPhoto(ctx, images[0], cx, cy, size, size * 0.92, -0.025 * t, o);
    } else if (count === 2) {
      const itemW = Math.min(w * 0.42, h * 0.74) * s;
      const itemH = itemW * 0.95;
      const offset = itemW * 0.58;
      drawPhoto(ctx, images[0], cx - offset, cy + 8, itemW, itemH, -0.055 * t, o);
      drawPhoto(ctx, images[1], cx + offset, cy - 6, itemW, itemH, 0.05 * t, o);

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.28)";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#161513";
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();
      clearShadow(ctx);
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
      ctx.fillStyle = luminance(p.accent) > 0.25 ? p.accent : "#FFE600";
      ctx.font = "800 50px 'Bricolage Grotesque', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("+", cx, cy + 2);
      ctx.restore();
    } else if (count === 3) {
      const itemW = Math.min(w * 0.33, h * 0.54) * s;
      const itemH = itemW * 0.92;
      drawPhoto(ctx, images[0], cx - itemW * 0.95, cy - itemH * 0.22, itemW, itemH, -0.06 * t, o);
      drawPhoto(ctx, images[1], cx + itemW * 0.95, cy - itemH * 0.22, itemW, itemH, 0.06 * t, o);
      drawPhoto(ctx, images[2], cx, cy + itemH * 0.3, itemW * 1.06, itemH * 1.02, 0.015 * t, o);
    } else {
      const itemW = Math.min(w * 0.36, h * 0.42) * s;
      const itemH = itemW * 0.88;
      const dx = itemW * 0.64;
      const dy = itemH * 0.6;
      drawPhoto(ctx, images[0], cx - dx, cy - dy, itemW, itemH, -0.035 * t, o);
      drawPhoto(ctx, images[1], cx + dx, cy - dy, itemW, itemH, 0.035 * t, o);
      drawPhoto(ctx, images[2], cx - dx, cy + dy, itemW, itemH, 0.03 * t, o);
      drawPhoto(ctx, images[3], cx + dx, cy + dy, itemW, itemH, -0.03 * t, o);
    }
  }

  /* ---------------------------------------------------------
     Sello de descuento
     --------------------------------------------------------- */
  function drawBadge(ctx, p, cx, cy, r, percent) {
    const custom = (p.badgeText || "").trim();
    const main = custom || (percent > 0 ? `-${percent}%` : "OFERTA");
    const sub = !custom && percent > 0 ? "OFF" : "";
    const shape = p.badgeShape;
    const fill = p.accent;
    const ink = contrastOn(fill);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(shape === "cinta" ? -0.07 : shape === "etiqueta" ? -0.12 : 0.12);
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = fill;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";

    let textMaxW = r * 1.35;
    let textOffsetX = 0;
    let singleLine = false;
    let hBox = r * 2;

    if (shape === "circulo") {
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.94, 0, Math.PI * 2);
      ctx.fill();
      clearShadow(ctx);
      ctx.stroke();
      ctx.setLineDash([5, 7]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = rgba(ink, 0.45);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (shape === "cinta") {
      const w = r * 2.4;
      const h = r * 0.92;
      const n = h * 0.32;
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2);
      ctx.lineTo(w / 2, -h / 2);
      ctx.lineTo(w / 2 - n, 0);
      ctx.lineTo(w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.lineTo(-w / 2 + n, 0);
      ctx.closePath();
      ctx.fill();
      clearShadow(ctx);
      ctx.stroke();
      textMaxW = w - n * 2 - 30;
      singleLine = true;
      hBox = h;
    } else if (shape === "etiqueta") {
      const w = r * 2.2;
      const h = r * 1.2;
      const tip = h * 0.45;
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(-w / 2 + tip, -h / 2);
      ctx.lineTo(w / 2 - 14, -h / 2);
      ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + 14);
      ctx.lineTo(w / 2, h / 2 - 14);
      ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - 14, h / 2);
      ctx.lineTo(-w / 2 + tip, h / 2);
      ctx.closePath();
      ctx.fill();
      clearShadow(ctx);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-w / 2 + tip * 0.72, 0, h * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      textOffsetX = tip * 0.4;
      textMaxW = w - tip - 34;
      singleLine = true;
      hBox = h;
    } else {
      drawStarburst(ctx, 0, 0, r, r * 0.83, 16);
      ctx.fill();
      clearShadow(ctx);
      ctx.stroke();
    }

    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (singleLine) {
      const label = sub ? `${main} ${sub}` : main.toUpperCase();
      ctx.font = `900 ${Math.round(hBox * 0.42)}px 'Montserrat', sans-serif`;
      ctx.fillText(label, textOffsetX, 3, textMaxW);
    } else if (sub) {
      ctx.font = `900 ${Math.round(r * 0.46)}px 'Montserrat', sans-serif`;
      ctx.fillText(main, 0, -r * 0.12, textMaxW);
      ctx.font = `900 ${Math.round(r * 0.27)}px 'Montserrat', sans-serif`;
      ctx.fillText(sub, 0, r * 0.32);
    } else {
      const fs = Math.round(main.length > 8 ? r * 0.26 : r * 0.34);
      ctx.font = `900 ${fs}px 'Montserrat', sans-serif`;
      const lines = wrapLines(ctx, main.toUpperCase(), textMaxW, 2);
      if (lines.length === 1) {
        ctx.fillText(lines[0], 0, 2, textMaxW);
      } else {
        ctx.fillText(lines[0], 0, -fs * 0.55, textMaxW);
        ctx.fillText(lines[1], 0, fs * 0.6, textMaxW);
      }
    }
    ctx.restore();
  }

  /* ---------------------------------------------------------
     Tarjeta de precios
     --------------------------------------------------------- */
  function drawPriceCard(ctx, p, L, isStory) {
    const { cardX, cardY, cardW, cardH } = L;
    const style = p.priceStyle;
    const orig = formatMoney(p.originalPrice);
    const promoF = formatMoney(p.promoPrice) || "$0";
    const { savings } = calcDiscount(p.originalPrice, p.promoPrice);
    const hasSav = p.showSavings !== false && savings > 0;

    let fill = "rgba(17,17,16,0.9)";
    let stroke = p.accent;
    let priceColor = p.accent;
    let oldColor = "rgba(255,255,255,0.72)";
    let strikeColor = "#EF4444";
    let lw = 5;
    let dash = null;
    let stripH = 0;
    let pillColor = "#16A34A";
    let glow = true;

    if (style === "clara") {
      fill = "#FFFFFF";
      priceColor = luminance(p.bg1) < 0.6 ? p.bg1 : "#161513";
      oldColor = "rgba(22,21,19,0.55)";
      glow = false;
    } else if (style === "acento") {
      fill = p.accent;
      stroke = "#FFFFFF";
      priceColor = contrastOn(p.accent);
      oldColor = rgba(priceColor, 0.62);
      strikeColor = priceColor === "#FFFFFF" ? "#161513" : "#D90429";
      pillColor = "#161513";
      glow = false;
    } else if (style === "contorno") {
      fill = luminance(p.textColor) > 0.6 ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.35)";
      lw = 6;
      dash = [18, 12];
      oldColor = rgba(p.textColor, 0.75);
      glow = false;
    } else if (style === "gondola") {
      fill = "#FFFFFF";
      stroke = "#161513";
      lw = 4;
      priceColor = "#161513";
      oldColor = "rgba(22,21,19,0.6)";
      stripH = isStory ? 74 : 54;
      pillColor = p.accent;
      glow = false;
    }

    const radius = style === "gondola" ? 18 : 32;
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.3)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = fill;
    roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    clearShadow(ctx);

    if (stripH) {
      ctx.save();
      roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.clip();
      ctx.fillStyle = p.accent;
      ctx.fillRect(cardX, cardY, cardW, stripH);
      ctx.restore();
      ctx.fillStyle = contrastOn(p.accent);
      ctx.font = `800 ${isStory ? 34 : 26}px 'DM Sans', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PRECIO PROMOCIONAL", cardX + cardW / 2, cardY + stripH / 2 + 1);
    }

    if (dash) ctx.setLineDash(dash);
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.stroke();
    ctx.setLineDash([]);

    const cx = cardX + cardW / 2;
    const contentTop = cardY + stripH;
    const availH = cardH - stripH;
    const pad = isStory ? 26 : 16;
    const gap = isStory ? 14 : 8;
    const oldSize = isStory ? 42 : 32;
    const pillH = isStory ? 54 : 40;
    let priceSize = isStory ? 150 : 118;
    if (promoF.length > 7) priceSize = isStory ? 120 : 96;
    const capH = (s) => s * 0.74;
    const total = () => (orig ? oldSize + gap : 0) + capH(priceSize) + (hasSav ? gap + pillH : 0);
    while (total() > availH - pad * 2 && priceSize > 48) priceSize -= 4;

    let y = contentTop + (availH - total()) / 2;
    ctx.textAlign = "center";

    if (orig) {
      ctx.font = `700 ${oldSize}px 'DM Sans', sans-serif`;
      ctx.fillStyle = oldColor;
      ctx.textBaseline = "middle";
      const label = "ANTES  " + orig;
      const oy = y + oldSize / 2;
      ctx.fillText(label, cx, oy);
      const m = ctx.measureText(label).width;
      ctx.strokeStyle = strikeColor;
      ctx.lineWidth = isStory ? 6 : 5;
      ctx.beginPath();
      ctx.moveTo(cx - m / 2 - 8, oy + 4);
      ctx.lineTo(cx + m / 2 + 8, oy - 4);
      ctx.stroke();
      y += oldSize + gap;
    }

    ctx.save();
    ctx.font = `900 ${priceSize}px 'Montserrat', sans-serif`;
    ctx.fillStyle = priceColor;
    ctx.textBaseline = "alphabetic";
    if (glow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 16;
    }
    ctx.fillText(promoF, cx, y + capH(priceSize), cardW - 80);
    ctx.restore();
    y += capH(priceSize);

    if (hasSav) {
      y += gap;
      const saveText = `AHORRÁS ${formatMoney(savings)}`;
      ctx.font = `800 ${isStory ? 32 : 24}px 'DM Sans', sans-serif`;
      const sw = ctx.measureText(saveText).width + 52;
      ctx.fillStyle = pillColor;
      roundRectPath(ctx, cx - sw / 2, y, sw, pillH, 999);
      ctx.fill();
      ctx.fillStyle = contrastOn(pillColor);
      ctx.textBaseline = "middle";
      ctx.fillText(saveText, cx, y + pillH / 2 + 1);
    }
    ctx.restore();
  }

  /* ---------------------------------------------------------
     Render principal
     --------------------------------------------------------- */
  async function renderFlyer(canvas, promo, storeProfile, format) {
    const p = normalize(promo);
    const isStory = format === "story";
    const W = 1080;
    const H = isStory ? 1920 : 1080;

    // Cargar imágenes ANTES de dibujar para evitar renders mezclados
    const [rawImgs, bgImg] = await Promise.all([
      Promise.all((p.photos || []).slice(0, 4).map(loadImageCached)),
      p.bgType === "imagen" && p.bgImage ? loadImageCached(p.bgImage) : Promise.resolve(null)
    ]);
    const images = rawImgs.filter(Boolean);

    if (canvas.width !== W) canvas.width = W;
    if (canvas.height !== H) canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const fontMeta = FONTS.find((f) => f.id === p.font) || FONTS[0];
    const lightText = luminance(p.textColor) > 0.6;

    // --- Medición del layout ---
    const titleRaw = (p.title || "Promoción especial del día").trim();
    const titleText = p.titleCase === "upper" ? titleRaw.toUpperCase() : titleRaw;
    const subtitleText = (p.subtitle || "").trim();
    const titleStartY = isStory ? 235 : 168;

    let titleSize = isStory ? 84 : 68;
    if (titleText.length > 36) titleSize = isStory ? 68 : 56;
    else if (titleText.length > 24) titleSize = isStory ? 76 : 62;
    titleSize = Math.round((titleSize * p.titleScale) / 100);

    const titleFont = `${fontMeta.weight} ${titleSize}px ${fontMeta.family}`;
    ctx.font = titleFont;
    const titleLines = wrapLines(ctx, titleText, W - (isStory ? 140 : 170), 2);
    const lineHeight = titleSize * 1.1;
    let afterTitleY = titleStartY + titleLines.length * lineHeight + 10;

    const subSize = isStory ? 34 : 28;
    const subLH = isStory ? 42 : 34;
    const subFont = `700 ${subSize}px 'DM Sans', sans-serif`;
    ctx.font = subFont;
    const subLines = subtitleText ? wrapLines(ctx, subtitleText, W - 180, 2) : [];
    const subStartY = afterTitleY;
    if (subLines.length) afterTitleY += subLines.length * subLH + 10;

    const priceCardTop = isStory ? 1310 : 728;
    const photoAreaTop = Math.max(afterTitleY + 12, isStory ? 430 : 285);
    const photoAreaH = Math.max(200, priceCardTop - photoAreaTop - 30);
    const photoArea = { x: 64, y: photoAreaTop, w: W - 128, h: photoAreaH };

    // --- Fondo ---
    drawBackground(ctx, W, H, p, bgImg);
    drawPattern(ctx, W, H, p);
    if (p.spotlight) drawSpotlight(ctx, W, H, photoArea);
    if (p.vignette) drawVignette(ctx, W, H);
    if (p.grain) drawGrain(ctx, W, H);

    // --- Encabezado ---
    drawStorePill(ctx, W, isStory, storeProfile);

    // --- Título ---
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = titleFont;
    titleLines.forEach((line, i) => {
      drawStyledText(ctx, line, W / 2, titleStartY + i * lineHeight, titleSize, p, lightText);
    });
    ctx.restore();

    if (subLines.length) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = subFont;
      ctx.fillStyle = rgba(p.textColor, 0.92);
      if (lightText) {
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
      }
      subLines.forEach((line, i) => ctx.fillText(line, W / 2, subStartY + i * subLH));
      ctx.restore();
    }

    // --- Fotos ---
    drawPhotosArea(ctx, images, photoArea, p);

    // --- Sello ---
    const { percent } = calcDiscount(p.originalPrice, p.promoPrice);
    if (p.badgeShape !== "ninguno") {
      const r = ((isStory ? 124 : 108) * p.badgeScale) / 100;
      const bx = p.badgePos === "izq" ? 70 + r : W - 70 - r;
      let by = photoAreaTop + r * 0.65;
      if (by + r > priceCardTop - 8) by = Math.max(photoAreaTop, priceCardTop - 8 - r);
      drawBadge(ctx, p, bx, by, r, percent);
    }

    // --- Precio ---
    drawPriceCard(
      ctx,
      p,
      { cardX: 64, cardY: priceCardTop, cardW: W - 128, cardH: isStory ? 360 : 238 },
      isStory
    );

    // --- Pie, marco y cinta ---
    drawFooter(ctx, W, isStory, p, storeProfile, lightText);
    drawFrame(ctx, W, H, p, priceCardTop);
    const ribbon = p.cornerRibbon.trim().toUpperCase();
    if (ribbon) drawCornerRibbon(ctx, W, ribbon, p.badgePos === "izq" ? "right" : "left", p.accent);
  }

  /* ---------------------------------------------------------
     Imágenes de ejemplo
     --------------------------------------------------------- */
  function createSampleProductImages() {
    function makeIllustration(bg1, bg2, title, subtitle, badge) {
      const c = document.createElement("canvas");
      c.width = 600;
      c.height = 600;
      const ctx = c.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, 600, 600);
      g.addColorStop(0, bg1);
      g.addColorStop(1, bg2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 600, 600);

      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.arc(300, 255, 168, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      roundRectPath(ctx, 215, 130, 170, 250, 28);
      ctx.fill();
      ctx.fillStyle = bg1;
      roundRectPath(ctx, 240, 170, 120, 120, 18);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 32px 'Bricolage Grotesque', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(badge, 300, 232);

      ctx.fillStyle = "rgba(17, 17, 16, 0.88)";
      roundRectPath(ctx, 64, 448, 472, 102, 22);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 34px 'DM Sans', sans-serif";
      ctx.fillText(title, 300, 486);
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.font = "600 24px 'DM Sans', sans-serif";
      ctx.fillText(subtitle, 300, 524);
      return c.toDataURL("image/png");
    }

    return [
      makeIllustration("#E53E3E", "#F59E0B", "Gaseosa 500 ml", "Bien fría", "500ml"),
      makeIllustration("#7C3AED", "#EC4899", "2x Alfajores", "Triple chocolate", "x2")
    ];
  }

  global.KioscoFlyer = {
    THEMES,
    FONTS,
    PATTERNS,
    TEMPLATES,
    DEFAULT_DESIGN,
    formatMoney,
    calcDiscount,
    renderFlyer,
    createSampleProductImages
  };
})(window);
