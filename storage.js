/* =========================================================
   PromoKiosco — Almacenamiento Local (IndexedDB + Fallback)
   ========================================================= */
(function (global) {
  "use strict";

  const DB_NAME = "PromoKioscoDB";
  const DB_VERSION = 1;
  const STORE_NAME = "promotions";
  const LS_PROMOS_KEY = "promokiosco_promos_fallback_v1";
  const LS_STORE_KEY = "promokiosco_store_profile_v1";

  let dbPromise = null;
  let useLocalStorageFallback = false;

  function openDB() {
    if (useLocalStorageFallback) return Promise.resolve(null);
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve) => {
      if (!("indexedDB" in global)) {
        useLocalStorageFallback = true;
        resolve(null);
        return;
      }
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
            store.createIndex("updatedAt", "updatedAt", { unique: false });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => {
          useLocalStorageFallback = true;
          resolve(null);
        };
      } catch {
        useLocalStorageFallback = true;
        resolve(null);
      }
    });

    return dbPromise;
  }

  function readFallback() {
    try {
      const raw = localStorage.getItem(LS_PROMOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function writeFallback(list) {
    try {
      localStorage.setItem(LS_PROMOS_KEY, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  }

  async function getAllPromotions() {
    const db = await openDB();
    if (!db) {
      return readFallback().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = (req.result || []).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(rows);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function savePromotion(promo) {
    const record = Object.assign({}, promo, {
      id: promo.id || "promo_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      createdAt: promo.createdAt || Date.now(),
      updatedAt: Date.now()
    });

    const db = await openDB();
    if (!db) {
      const list = readFallback();
      const idx = list.findIndex((p) => p.id === record.id);
      if (idx >= 0) list[idx] = record;
      else list.unshift(record);
      writeFallback(list);
      return record;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async function deletePromotion(id) {
    const db = await openDB();
    if (!db) {
      const list = readFallback().filter((p) => p.id !== id);
      writeFallback(list);
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function clearAllPromotions() {
    const db = await openDB();
    if (!db) {
      writeFallback([]);
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function getStoreProfile() {
    const defaults = {
      name: "Mi Kiosco",
      address: "",
      phone: ""
    };
    try {
      const raw = localStorage.getItem(LS_STORE_KEY);
      if (!raw) return defaults;
      return Object.assign({}, defaults, JSON.parse(raw));
    } catch {
      return defaults;
    }
  }

  function saveStoreProfile(profile) {
    const clean = {
      name: (profile.name || "Mi Kiosco").trim() || "Mi Kiosco",
      address: (profile.address || "").trim(),
      phone: (profile.phone || "").trim()
    };
    try {
      localStorage.setItem(LS_STORE_KEY, JSON.stringify(clean));
    } catch {
      // Ignorar si localStorage no está disponible
    }
    return clean;
  }

  function compressImageFile(file, maxSide = 900) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Archivo de imagen inválido"));
        img.onload = () => {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          if (w > maxSide || h > maxSide) {
            if (w >= h) {
              h = Math.round((h * maxSide) / w);
              w = maxSide;
            } else {
              w = Math.round((w * maxSide) / h);
              h = maxSide;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);

          const isPngOrWebp = file.type === "image/png" || file.type === "image/webp";
          const mime = isPngOrWebp ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(mime, 0.86));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  global.KioscoStorage = {
    getAllPromotions,
    savePromotion,
    deletePromotion,
    clearAllPromotions,
    getStoreProfile,
    saveStoreProfile,
    compressImageFile
  };
})(window);
