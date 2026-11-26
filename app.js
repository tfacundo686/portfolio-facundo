/* =========================================================
   PromoKiosco — Controlador Principal (5 Pasos + Estudio HD)
   ========================================================= */
(function () {
  "use strict";

  const {
    getAllPromotions,
    savePromotion,
    deletePromotion,
    clearAllPromotions,
    getStoreProfile,
    saveStoreProfile,
    compressImageFile
  } = window.KioscoStorage;

  const {
    THEMES,
    FONTS,
    PATTERNS,
    TEMPLATES,
    DEFAULT_DESIGN,
    formatMoney,
    calcDiscount,
    renderFlyer,
    createSampleProductImages
  } = window.KioscoFlyer;

  const THEME_LS_KEY = "promokiosco_theme_v1";
  const TOTAL_STEPS = 5;

  const state = {
    step: 1,
    editingId: null,
    format: "square",
    store: getStoreProfile(),
    promotions: [],
    current: createDefaultPromo(),
    pendingPrintPromo: null
  };

  function createDefaultPromo() {
    return Object.assign({}, DEFAULT_DESIGN, {
      title: "",
      subtitle: "",
      originalPrice: "",
      promoPrice: "",
      badgeText: "",
      validity: "Válido hoy o hasta agotar stock",
      photos: []
    });
  }

  const els = {
    headerStoreName: document.getElementById("headerStoreName"),
    savedCountBadge: document.getElementById("savedCountBadge"),
    btnThemeToggle: document.getElementById("btnThemeToggle"),
    themeToggleLabel: document.getElementById("themeToggleLabel"),

    editingBanner: document.getElementById("editingBanner"),
    editingPromoTitle: document.getElementById("editingPromoTitle"),
    btnCancelEdit: document.getElementById("btnCancelEdit"),

    stepTabs: Array.from(document.querySelectorAll(".step-tab")),
    stepPanes: Array.from(document.querySelectorAll(".step-pane")),
    btnPrevStep: document.getElementById("btnPrevStep"),
    btnNextStep: document.getElementById("btnNextStep"),
    stepIndicatorText: document.getElementById("stepIndicatorText"),

    uploadZone: document.getElementById("uploadZone"),
    photoInput: document.getElementById("photoInput"),
    photoThumbs: document.getElementById("photoThumbs"),
    photoCounter: document.getElementById("photoCounter"),
    btnAddSamplePhoto: document.getElementById("btnAddSamplePhoto"),

    inputTitle: document.getElementById("inputTitle"),
    inputPromoPrice: document.getElementById("inputPromoPrice"),
    liveDiscountPct: document.getElementById("liveDiscountPct"),
    liveSavingsText: document.getElementById("liveSavingsText"),

    btnResetDesign: document.getElementById("btnResetDesign"),
    templateGrid: document.getElementById("templateGrid"),
    themeGrid: document.getElementById("themeGrid"),
    fontGrid: document.getElementById("fontGrid"),
    patternGrid: document.getElementById("patternGrid"),

    btnSwapColors: document.getElementById("btnSwapColors"),
    bgImagePreview: document.getElementById("bgImagePreview"),
    bgImageInput: document.getElementById("bgImageInput"),
    btnBgUpload: document.getElementById("btnBgUpload"),
    btnBgRemove: document.getElementById("btnBgRemove"),

    canvasStage: document.getElementById("canvasStage"),
    flyerCanvas: document.getElementById("flyerCanvas"),
    btnFmtSquare: document.getElementById("btnFmtSquare"),
    btnFmtStory: document.getElementById("btnFmtStory"),

    btnSavePromo: document.getElementById("btnSavePromo"),
    btnSaveLabel: document.getElementById("btnSaveLabel"),
    btnResetForm: document.getElementById("btnResetForm"),

    btnDownloadImg: document.getElementById("btnDownloadImg"),
    btnShareWsp: document.getElementById("btnShareWsp"),
    btnShareStory: document.getElementById("btnShareStory"),
    btnPrintFlyer: document.getElementById("btnPrintFlyer"),

    btnQuickSave: document.getElementById("btnQuickSave"),
    btnQuickDownload: document.getElementById("btnQuickDownload"),
    btnQuickPrint: document.getElementById("btnQuickPrint"),

    galleryGrid: document.getElementById("galleryGrid"),
    searchPromos: document.getElementById("searchPromos"),
    btnClearAll: document.getElementById("btnClearAll"),

    btnOpenStoreModal: document.getElementById("btnOpenStoreModal"),
    storeModal: document.getElementById("storeModal"),
    storeNameInput: document.getElementById("storeNameInput"),
    storeAddressInput: document.getElementById("storeAddressInput"),
    storePhoneInput: document.getElementById("storePhoneInput"),
    btnSaveStore: document.getElementById("btnSaveStore"),

    printModal: document.getElementById("printModal"),
    printSheet: document.getElementById("printSheet"),
    toastContainer: document.getElementById("toastContainer")
  };

  // =========================================================
  // Modo Claro / Oscuro
  // =========================================================
  function syncThemeUI() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    els.themeToggleLabel.textContent = current === "dark" ? "Claro" : "Oscuro";
  }

  function toggleDarkMode() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_LS_KEY, next);
    } catch {
      // Ignorar
    }
    syncThemeUI();
  }

  // =========================================================
  // Asistente por Pasos (1 a 5)
  // =========================================================
  function setStep(stepNum) {
    const clamped = Math.max(1, Math.min(TOTAL_STEPS, stepNum));
    state.step = clamped;

    els.stepTabs.forEach((tab) => {
      const n = Number(tab.dataset.step);
      tab.classList.toggle("active", n === clamped);
      tab.classList.toggle("completed", n < clamped);
    });

    els.stepPanes.forEach((pane) => {
      const isActive = Number(pane.dataset.pane) === clamped;
      pane.classList.toggle("active", isActive);
      if (isActive) pane.scrollTop = 0;
    });

    const activeTab = els.stepTabs.find((t) => Number(t.dataset.step) === clamped);
    if (activeTab && activeTab.scrollIntoView) {
      activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    els.stepIndicatorText.textContent = `Paso ${clamped} de ${TOTAL_STEPS}`;
    els.btnPrevStep.disabled = clamped === 1;
    els.btnNextStep.classList.toggle("hidden", clamped === TOTAL_STEPS);
  }

  // =========================================================
  // Notificaciones Toast
  // =========================================================
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;
    els.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.22s ease";
      setTimeout(() => toast.remove(), 240);
    }, 3000);
  }

  // =========================================================
  // Construcción de selectores visuales (Plantillas, Paletas, Fuentes, Tramas)
  // =========================================================
  function buildTemplateGrid() {
    els.templateGrid.innerHTML = "";
    TEMPLATES.forEach((tpl) => {
      const v = Object.assign({}, DEFAULT_DESIGN, tpl.values || {});
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "template-card";
      btn.dataset.templateId = tpl.id;
      const bgStyle =
        v.bgType === "solido"
          ? v.bg1
          : `linear-gradient(135deg, ${v.bg1}, ${v.bg2})`;
      btn.innerHTML = `
        <span class="tpl-preview" style="background:${bgStyle}">
          <span class="tpl-badge" style="background:${v.accent}"></span>
          <span class="tpl-line" style="background:${v.textColor}"></span>
          <span class="tpl-card-mini" style="border-color:${v.accent}"></span>
        </span>
        <strong>${tpl.name}</strong>
        <small>${tpl.desc}</small>
      `;
      btn.addEventListener("click", () => applyTemplate(tpl.id));
      els.templateGrid.appendChild(btn);
    });
  }

  function applyTemplate(templateId) {
    const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    // Conservar textos, precios y fotos del usuario; aplicar estilo de la plantilla
    const keep = {
      id: state.current.id,
      createdAt: state.current.createdAt,
      title: state.current.title,
      subtitle: state.current.subtitle,
      originalPrice: state.current.originalPrice,
      promoPrice: state.current.promoPrice,
      badgeText: state.current.badgeText,
      validity: state.current.validity,
      photos: state.current.photos,
      bgImage: state.current.bgImage,
      photoFit: state.current.photoFit,
      photoZoom: state.current.photoZoom,
      photoScale: state.current.photoScale,
      photoOffsetX: state.current.photoOffsetX,
      photoOffsetY: state.current.photoOffsetY
    };
    state.current = Object.assign({}, DEFAULT_DESIGN, tpl.values || {}, keep, {
      template: tpl.id
    });
    syncFormFromState();
  }

  function buildThemeGrid() {
    els.themeGrid.innerHTML = "";
    THEMES.forEach((t) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-swatch";
      btn.dataset.themeId = t.id;
      btn.style.background = `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`;
      btn.innerHTML = `<span class="theme-dot" style="background:${t.accent}"></span><span>${t.name}</span>`;
      btn.addEventListener("click", () => {
        state.current.themeId = t.id;
        state.current.bg1 = t.bg1;
        state.current.bg2 = t.bg2;
        state.current.accent = t.accent;
        state.current.textColor = t.text;
        syncControlsFromState();
        scheduleCanvasRender();
      });
      els.themeGrid.appendChild(btn);
    });
  }

  function buildFontGrid() {
    els.fontGrid.innerHTML = "";
    FONTS.forEach((f) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-card";
      btn.dataset.fontId = f.id;
      btn.innerHTML = `
        <span class="font-sample" style="font-family:${f.family};font-weight:${f.weight}">${f.sample}</span>
        <span class="font-name">${f.label}</span>
      `;
      btn.addEventListener("click", () => {
        state.current.font = f.id;
        syncControlsFromState();
        scheduleCanvasRender();
      });
      els.fontGrid.appendChild(btn);
    });
  }

  function buildPatternGrid() {
    els.patternGrid.innerHTML = "";
    PATTERNS.forEach((pat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.value = pat.id;
      btn.textContent = pat.label;
      els.patternGrid.appendChild(btn);
    });
  }

  // =========================================================
  // Sincronización declarativa de controles (data-bind, data-seg, data-show-if, data-out)
  // =========================================================
  function evalShowCondition(expr) {
    if (!expr) return true;
    const isNeq = expr.includes("!=");
    const [key, rhs] = expr.split(isNeq ? "!=" : "=");
    const val = String(state.current[key] ?? "");
    const options = rhs.split("|");
    return isNeq ? !options.includes(val) : options.includes(val);
  }

  function syncControlsFromState() {
    const p = state.current;

    // Inputs [data-bind]
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.dataset.bind;
      const val = p[key];
      if (el.type === "checkbox") {
        el.checked = Boolean(val);
      } else {
        const str = val === undefined || val === null ? "" : String(val);
        if (el.value !== str) el.value = str;
      }
    });

    // Outputs [data-out]
    document.querySelectorAll("[data-out]").forEach((out) => {
      const key = out.dataset.out;
      const suffix = out.dataset.suffix || "";
      const v = p[key];
      out.textContent = (v === undefined || v === null ? "" : v) + suffix;
    });

    // Segmented buttons [data-seg]
    document.querySelectorAll("[data-seg]").forEach((group) => {
      const key = group.dataset.seg;
      const currentVal = String(p[key] ?? "");
      group.querySelectorAll("button[data-value]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === currentVal);
      });
    });

    // Visibilidad condicional [data-show-if]
    document.querySelectorAll("[data-show-if]").forEach((el) => {
      el.classList.toggle("hidden", !evalShowCondition(el.dataset.showIf));
    });

    // Grids activos
    els.templateGrid.querySelectorAll(".template-card").forEach((el) => {
      el.classList.toggle("active", el.dataset.templateId === p.template);
    });
    els.themeGrid.querySelectorAll(".theme-swatch").forEach((el) => {
      el.classList.toggle("active", el.dataset.themeId === p.themeId);
    });
    els.fontGrid.querySelectorAll(".font-card").forEach((el) => {
      el.classList.toggle("active", el.dataset.fontId === p.font);
    });

    // Vista previa de imagen de fondo
    if (p.bgImage) {
      els.bgImagePreview.src = p.bgImage;
      els.bgImagePreview.classList.remove("hidden");
      els.btnBgRemove.classList.remove("hidden");
    } else {
      els.bgImagePreview.classList.add("hidden");
      els.btnBgRemove.classList.add("hidden");
    }

    updateDiscountBar();
  }

  function syncFormFromState() {
    renderPhotoThumbs();
    syncControlsFromState();

    if (state.editingId) {
      els.editingBanner.classList.remove("hidden");
      els.editingPromoTitle.textContent = state.current.title || "Sin título";
      els.btnSaveLabel.textContent = "Guardar cambios";
    } else {
      els.editingBanner.classList.add("hidden");
      els.btnSaveLabel.textContent = "Guardar promoción";
    }

    scheduleCanvasRender();
  }

  // =========================================================
  // Fotos de productos
  // =========================================================
  function renderPhotoThumbs() {
    const photos = state.current.photos || [];
    els.photoCounter.textContent = `${photos.length} / 4`;
    els.photoThumbs.innerHTML = "";

    photos.forEach((src, index) => {
      const item = document.createElement("div");
      item.className = "thumb-item";
      item.innerHTML = `
        <img src="${src}" alt="Producto ${index + 1}" />
        <span class="thumb-order">#${index + 1}</span>
        <button type="button" class="thumb-remove" title="Quitar foto" aria-label="Quitar foto">✕</button>
      `;
      item.querySelector(".thumb-remove").addEventListener("click", () => {
        state.current.photos.splice(index, 1);
        renderPhotoThumbs();
        scheduleCanvasRender();
      });
      els.photoThumbs.appendChild(item);
    });
  }

  async function handleFilesAdded(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    const remaining = 4 - state.current.photos.length;
    if (remaining <= 0) {
      showToast("Ya cargaste el máximo de 4 fotos por promoción.", "warn");
      return;
    }

    const toProcess = files.slice(0, remaining);
    for (const file of toProcess) {
      try {
        const dataUrl = await compressImageFile(file, 900);
        state.current.photos.push(dataUrl);
      } catch {
        showToast("No se pudo procesar una de las imágenes.", "warn");
      }
    }

    if (files.length > remaining) {
      showToast("Se agregaron hasta completar el límite de 4 fotos.", "warn");
    }
    renderPhotoThumbs();
    scheduleCanvasRender();
  }

  // =========================================================
  // Cálculo de descuento
  // =========================================================
  function updateDiscountBar() {
    const { percent, savings } = calcDiscount(state.current.originalPrice, state.current.promoPrice);
    if (percent > 0) {
      els.liveDiscountPct.textContent = `-${percent}% OFF`;
      els.liveSavingsText.textContent = `Ahorro para el cliente: ${formatMoney(savings)}`;
    } else if (Number(state.current.promoPrice) > 0) {
      els.liveDiscountPct.textContent = "PRECIO PROMO";
      els.liveSavingsText.textContent = "Podés cargar el valor original para mostrar el porcentaje de rebaja";
    } else {
      els.liveDiscountPct.textContent = "0% OFF";
      els.liveSavingsText.textContent = "Ingresá ambos precios para calcular el ahorro";
    }
  }

  // =========================================================
  // Renderizado en vivo del Canvas
  // =========================================================
  let renderPending = false;
  function scheduleCanvasRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(async () => {
      renderPending = false;
      await renderFlyer(els.flyerCanvas, state.current, state.store, state.format);
    });
  }

  async function renderPromoToDataUrl(promo, format) {
    const offscreen = document.createElement("canvas");
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await renderFlyer(offscreen, promo, state.store, format);
    return offscreen.toDataURL("image/png");
  }

  async function renderPromoToBlob(promo, format) {
    const offscreen = document.createElement("canvas");
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await renderFlyer(offscreen, promo, state.store, format);
    return new Promise((resolve) => offscreen.toBlob(resolve, "image/png"));
  }

  // =========================================================
  // Guardar, Editar, Duplicar y Eliminar
  // =========================================================
  async function handleSavePromo() {
    const title = (state.current.title || "").trim();
    const promoPrice = Number(state.current.promoPrice);

    if (!title) {
      setStep(2);
      els.inputTitle.focus();
      showToast("Ingresá un nombre para la promoción en el Paso 2.", "warn");
      return;
    }
    if (!Number.isFinite(promoPrice) || promoPrice <= 0) {
      setStep(2);
      els.inputPromoPrice.focus();
      showToast("Ingresá un precio con rebaja válido en el Paso 2.", "warn");
      return;
    }

    const thumbCanvas = document.createElement("canvas");
    await renderFlyer(thumbCanvas, state.current, state.store, "square");
    const miniCanvas = document.createElement("canvas");
    miniCanvas.width = 480;
    miniCanvas.height = 480;
    miniCanvas.getContext("2d").drawImage(thumbCanvas, 0, 0, 480, 480);
    const thumbnail = miniCanvas.toDataURL("image/jpeg", 0.84);

    const payload = Object.assign({}, state.current, {
      id: state.editingId || undefined,
      title,
      thumbnail
    });

    const saved = await savePromotion(payload);
    state.editingId = saved.id;
    state.current = Object.assign({}, saved);
    await refreshGallery();
    syncFormFromState();
    showToast("Promoción guardada localmente.", "success");
  }

  function startEditPromo(promo) {
    state.editingId = promo.id;
    state.current = Object.assign(createDefaultPromo(), promo, {
      photos: Array.isArray(promo.photos) ? promo.photos.slice() : []
    });
    syncFormFromState();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`Editando "${promo.title}"`, "info");
  }

  async function duplicatePromo(promo) {
    const copy = Object.assign({}, promo, {
      id: undefined,
      createdAt: undefined,
      title: promo.title + " (Copia)"
    });
    await savePromotion(copy);
    await refreshGallery();
    showToast("Promoción duplicada.", "success");
  }

  async function removePromo(promo) {
    const ok = window.confirm(`¿Eliminar la promoción "${promo.title}"?`);
    if (!ok) return;
    await deletePromotion(promo.id);
    if (state.editingId === promo.id) {
      resetEditor();
    }
    await refreshGallery();
    showToast("Promoción eliminada.", "info");
  }

  function resetEditor() {
    state.editingId = null;
    state.current = createDefaultPromo();
    syncFormFromState();
    setStep(1);
  }

  // =========================================================
  // Exportación: Descargar, WhatsApp, Historia WSP e Imprimir
  // =========================================================
  function safeFileName(title, suffix) {
    const base = (title || "promocion")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 36);
    return `promo-${base || "kiosco"}-${suffix}.png`;
  }

  function triggerDownload(dataUrl, fileName) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function downloadPromoImage(promo, format) {
    const dataUrl = await renderPromoToDataUrl(promo, format);
    const suffix = format === "story" ? "historia-wsp" : "flyer";
    triggerDownload(dataUrl, safeFileName(promo.title, suffix));
    showToast(
      format === "story"
        ? "Historia 9:16 descargada. Lista para subir a Estados de WhatsApp."
        : "Imagen PNG en alta definición descargada.",
      "success"
    );
  }

  function buildWhatsAppText(promo) {
    const { percent, savings } = calcDiscount(promo.originalPrice, promo.promoPrice);
    const lines = [];
    lines.push(`*PROMO EN ${state.store.name.toUpperCase()}*`);
    lines.push(`*${promo.title || "Oferta especial"}*`);
    if (promo.subtitle) lines.push(promo.subtitle);
    if (promo.originalPrice && Number(promo.originalPrice) > 0) {
      lines.push(`Antes: ~${formatMoney(promo.originalPrice)}~`);
    }
    lines.push(`*AHORA: ${formatMoney(promo.promoPrice) || "$0"}*`);
    if (percent > 0) {
      lines.push(`Descuento: *${percent}% OFF* (Ahorrás ${formatMoney(savings)})`);
    }
    if (promo.validity) lines.push(promo.validity);
    if (state.store.address) lines.push(state.store.address);
    if (state.store.phone) lines.push(`Pedidos: ${state.store.phone}`);
    return lines.join("\n");
  }

  async function shareToWhatsApp(promo, format) {
    const fileName = safeFileName(promo.title, format === "story" ? "historia-wsp" : "wsp");
    const text = buildWhatsAppText(promo);

    try {
      const blob = await renderPromoToBlob(promo, format);
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: promo.title || "Promoción",
          text,
          files: [file]
        });
        showToast("Listo para compartir en WhatsApp.", "success");
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }

    const dataUrl = await renderPromoToDataUrl(promo, format);
    triggerDownload(dataUrl, fileName);

    if (format === "story") {
      showToast("Historia 9:16 descargada. Subila desde WhatsApp en Novedades / Estados.", "success");
    } else {
      const url = "https://wa.me/?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      showToast("Imagen descargada y WhatsApp abierto: adjuntá la foto en el chat.", "success");
    }
  }

  function openPrintModal(promo) {
    state.pendingPrintPromo = promo;
    els.printModal.classList.remove("hidden");
  }

  async function executePrint(copies) {
    const promo = state.pendingPrintPromo || state.current;
    els.printModal.classList.add("hidden");

    const dataUrl = await renderPromoToDataUrl(promo, "square");
    els.printSheet.className = `print-sheet copies-${copies}`;
    els.printSheet.innerHTML = "";

    for (let i = 0; i < copies; i++) {
      const img = document.createElement("img");
      img.src = dataUrl;
      img.alt = promo.title || "Flyer";
      els.printSheet.appendChild(img);
    }

    setTimeout(() => window.print(), 180);
  }

  // =========================================================
  // Galería
  // =========================================================
  async function refreshGallery() {
    state.promotions = await getAllPromotions();
    els.savedCountBadge.textContent = String(state.promotions.length);
    els.btnClearAll.classList.toggle("hidden", state.promotions.length === 0);
    renderGalleryList();
  }

  function renderGalleryList() {
    const query = (els.searchPromos.value || "").trim().toLowerCase();
    const list = state.promotions.filter((p) => {
      if (!query) return true;
      return (
        (p.title || "").toLowerCase().includes(query) ||
        (p.subtitle || "").toLowerCase().includes(query)
      );
    });

    els.galleryGrid.innerHTML = "";

    if (!list.length) {
      els.galleryGrid.innerHTML = `
        <div class="empty-gallery">
          <h3>${state.promotions.length ? "Sin resultados" : "Todavía no hay promociones guardadas"}</h3>
          <p>${
            state.promotions.length
              ? "Probá buscando con otra palabra."
              : "Completá los pasos de arriba y guardá tu primera oferta para tenerla siempre a mano."
          }</p>
        </div>
      `;
      return;
    }

    list.forEach((promo) => {
      const { percent } = calcDiscount(promo.originalPrice, promo.promoPrice);
      const card = document.createElement("article");
      card.className = "promo-card";

      const badgeText = promo.badgeText || (percent > 0 ? `-${percent}% OFF` : "PROMO");
      const origHtml =
        promo.originalPrice && Number(promo.originalPrice) > 0
          ? `<span class="price-old">${formatMoney(promo.originalPrice)}</span>`
          : "";

      card.innerHTML = `
        <div class="promo-card-media" title="Clic para editar">
          <img src="${promo.thumbnail || ""}" alt="${escapeHtml(promo.title)}" />
          <span class="promo-card-badge">${escapeHtml(badgeText)}</span>
        </div>
        <div class="promo-card-body">
          <h3 class="promo-card-title">${escapeHtml(promo.title)}</h3>
          <div class="promo-card-prices">
            ${origHtml}
            <span class="price-new">${formatMoney(promo.promoPrice)}</span>
          </div>
          <div class="promo-card-actions">
            <button type="button" class="card-btn edit-btn" data-act="edit">Editar</button>
            <button type="button" class="card-btn wsp-btn" data-act="wsp">WhatsApp</button>
            <button type="button" class="card-btn" data-act="story">Historia 9:16</button>
            <button type="button" class="card-btn" data-act="download">Descargar</button>
            <button type="button" class="card-btn" data-act="print">Imprimir</button>
            <button type="button" class="card-btn" data-act="dup">Duplicar</button>
            <button type="button" class="card-btn del-btn" data-act="del" style="grid-column:1/-1">Eliminar</button>
          </div>
        </div>
      `;

      card.querySelector(".promo-card-media").addEventListener("click", () => startEditPromo(promo));
      card.querySelector('[data-act="edit"]').addEventListener("click", () => startEditPromo(promo));
      card.querySelector('[data-act="wsp"]').addEventListener("click", () => shareToWhatsApp(promo, "square"));
      card.querySelector('[data-act="story"]').addEventListener("click", () => shareToWhatsApp(promo, "story"));
      card.querySelector('[data-act="download"]').addEventListener("click", () => downloadPromoImage(promo, "square"));
      card.querySelector('[data-act="print"]').addEventListener("click", () => openPrintModal(promo));
      card.querySelector('[data-act="dup"]').addEventListener("click", () => duplicatePromo(promo));
      card.querySelector('[data-act="del"]').addEventListener("click", () => removePromo(promo));

      els.galleryGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // =========================================================
  // Eventos
  // =========================================================
  function bindEvents() {
    els.btnThemeToggle.addEventListener("click", toggleDarkMode);

    // Navegación del asistente
    els.stepTabs.forEach((tab) => {
      tab.addEventListener("click", () => setStep(Number(tab.dataset.step)));
    });
    els.btnPrevStep.addEventListener("click", () => setStep(state.step - 1));
    els.btnNextStep.addEventListener("click", () => setStep(state.step + 1));

    // Enlace automático [data-bind]
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.dataset.bind;
      const evName = el.type === "checkbox" ? "change" : "input";
      el.addEventListener(evName, () => {
        if (el.type === "checkbox") {
          state.current[key] = el.checked;
        } else if (el.type === "range") {
          state.current[key] = Number(el.value);
        } else {
          state.current[key] = el.value;
        }

        if (key === "bg1" || key === "bg2" || key === "accent" || key === "textColor") {
          state.current.themeId = "custom";
        }
        syncControlsFromState();
        scheduleCanvasRender();
      });
    });

    // Enlace automático [data-seg]
    document.querySelectorAll("[data-seg]").forEach((group) => {
      const key = group.dataset.seg;
      group.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-value]");
        if (!btn) return;
        state.current[key] = btn.dataset.value;
        syncControlsFromState();
        scheduleCanvasRender();
      });
    });

    // Botones rápidos [data-set]
    document.querySelectorAll("[data-set]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.set;
        state.current[key] = btn.dataset.value;
        syncControlsFromState();
        scheduleCanvasRender();
      });
    });

    // Restablecer diseño de plantilla actual
    els.btnResetDesign.addEventListener("click", () => {
      applyTemplate(state.current.template || "clasico");
      showToast("Diseño restablecido a la plantilla base.", "info");
    });

    // Invertir colores del degradado
    els.btnSwapColors.addEventListener("click", () => {
      const tmp = state.current.bg1;
      state.current.bg1 = state.current.bg2;
      state.current.bg2 = tmp;
      state.current.themeId = "custom";
      syncControlsFromState();
      scheduleCanvasRender();
    });

    // Subida de foto de fondo
    els.btnBgUpload.addEventListener("click", () => els.bgImageInput.click());
    els.bgImageInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!file) return;
      try {
        const dataUrl = await compressImageFile(file, 1080);
        state.current.bgImage = dataUrl;
        state.current.bgType = "imagen";
        syncControlsFromState();
        scheduleCanvasRender();
        showToast("Foto de fondo cargada.", "success");
      } catch {
        showToast("No se pudo cargar la foto de fondo.", "warn");
      }
    });

    els.btnBgRemove.addEventListener("click", () => {
      state.current.bgImage = "";
      syncControlsFromState();
      scheduleCanvasRender();
    });

    // Subida de fotos de productos
    els.uploadZone.addEventListener("click", () => els.photoInput.click());
    els.uploadZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.photoInput.click();
      }
    });
    els.photoInput.addEventListener("change", (e) => {
      handleFilesAdded(e.target.files);
      e.target.value = "";
    });

    ["dragenter", "dragover"].forEach((ev) => {
      els.uploadZone.addEventListener(ev, (e) => {
        e.preventDefault();
        els.uploadZone.classList.add("drag-over");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      els.uploadZone.addEventListener(ev, (e) => {
        e.preventDefault();
        els.uploadZone.classList.remove("drag-over");
      });
    });
    els.uploadZone.addEventListener("drop", (e) => {
      handleFilesAdded(e.dataTransfer.files);
    });

    els.btnAddSamplePhoto.addEventListener("click", () => {
      state.current.photos = createSampleProductImages();
      if (!state.current.title) {
        state.current.title = "Combo Merienda: Gaseosa + 2 Alfajores";
        state.current.subtitle = "Bien fríos • Todos los sabores";
        state.current.originalPrice = "3200";
        state.current.promoPrice = "2290";
      }
      syncFormFromState();
      showToast("Combo de ejemplo cargado.", "success");
    });

    // Formatos 1:1 / 9:16
    const setFormat = (fmt) => {
      state.format = fmt;
      els.btnFmtSquare.classList.toggle("active", fmt === "square");
      els.btnFmtStory.classList.toggle("active", fmt === "story");
      els.canvasStage.classList.toggle("story-mode", fmt === "story");
      scheduleCanvasRender();
    };
    els.btnFmtSquare.addEventListener("click", () => setFormat("square"));
    els.btnFmtStory.addEventListener("click", () => setFormat("story"));

    // Guardar / Nueva / Cancelar
    els.btnSavePromo.addEventListener("click", handleSavePromo);
    els.btnQuickSave.addEventListener("click", handleSavePromo);
    els.btnResetForm.addEventListener("click", () => {
      resetEditor();
      showToast("Listo para crear una nueva promoción.", "info");
    });
    els.btnCancelEdit.addEventListener("click", () => {
      resetEditor();
      showToast("Edición cancelada.", "info");
    });

    // Exportar e imprimir
    els.btnDownloadImg.addEventListener("click", () => downloadPromoImage(state.current, state.format));
    els.btnQuickDownload.addEventListener("click", () => downloadPromoImage(state.current, state.format));
    els.btnShareWsp.addEventListener("click", () => shareToWhatsApp(state.current, "square"));
    els.btnShareStory.addEventListener("click", () => shareToWhatsApp(state.current, "story"));
    els.btnPrintFlyer.addEventListener("click", () => openPrintModal(state.current));
    els.btnQuickPrint.addEventListener("click", () => openPrintModal(state.current));

    els.printModal.querySelectorAll(".print-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => executePrint(Number(btn.dataset.copies)));
    });

    // Buscador y vaciar
    els.searchPromos.addEventListener("input", renderGalleryList);
    els.btnClearAll.addEventListener("click", async () => {
      if (!window.confirm("¿Seguro que querés eliminar todas las promociones guardadas?")) return;
      await clearAllPromotions();
      resetEditor();
      await refreshGallery();
      showToast("Se eliminaron todas las promociones.", "info");
    });

    // Modal negocio
    els.btnOpenStoreModal.addEventListener("click", () => {
      els.storeNameInput.value = state.store.name;
      els.storeAddressInput.value = state.store.address;
      els.storePhoneInput.value = state.store.phone;
      els.storeModal.classList.remove("hidden");
    });

    els.btnSaveStore.addEventListener("click", () => {
      state.store = saveStoreProfile({
        name: els.storeNameInput.value,
        address: els.storeAddressInput.value,
        phone: els.storePhoneInput.value
      });
      els.headerStoreName.textContent = state.store.name;
      els.storeModal.classList.add("hidden");
      scheduleCanvasRender();
      showToast("Datos del negocio guardados.", "success");
    });

    // Cerrar modales
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-close-modal");
        document.getElementById(id).classList.add("hidden");
      });
    });

    [els.storeModal, els.printModal].forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
      });
    });
  }

  async function init() {
    syncThemeUI();
    els.headerStoreName.textContent = state.store.name;
    buildTemplateGrid();
    buildThemeGrid();
    buildFontGrid();
    buildPatternGrid();
    bindEvents();
    setStep(1);
    syncFormFromState();
    await refreshGallery();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => scheduleCanvasRender());
    }
  }

  init();
})();
