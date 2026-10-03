"use strict";

(function () {
  const DREAMS_V6 = "dreamrift.v6.dreams";
  const SETTINGS_V6 = "dreamrift.v6.settings";
  const DREAMS_V5 = "dreamrift.v5.dreams";
  const SETTINGS_V5 = "dreamrift.v5.settings";
  const DB_NAME = "dreamrift-v6";
  const STORE = "snapshots";

  function migrateLegacy() {
    try {
      if (!localStorage.getItem(DREAMS_V6) && localStorage.getItem(DREAMS_V5)) {
        localStorage.setItem(DREAMS_V6, localStorage.getItem(DREAMS_V5));
      }
      if (!localStorage.getItem(SETTINGS_V6) && localStorage.getItem(SETTINGS_V5)) {
        localStorage.setItem(SETTINGS_V6, localStorage.getItem(SETTINGS_V5));
      }
    } catch {}
  }

  function createBackup(dreams, settings, meta) {
    return {
      format: "dreamrift-backup",
      version: 6,
      exportedAt: new Date().toISOString(),
      dreams: Array.isArray(dreams) ? dreams : [],
      settings: settings || {},
      meta: meta || {}
    };
  }

  function normalizeBackup(value) {
    if (Array.isArray(value)) {
      return { dreams: value, settings: {}, meta: {}, version: 5 };
    }
    if (!value || typeof value !== "object" || !Array.isArray(value.dreams)) return null;
    if (value.format && value.format !== "dreamrift-backup") return null;
    return {
      dreams: value.dreams,
      settings: value.settings && typeof value.settings === "object" ? value.settings : {},
      meta: value.meta && typeof value.meta === "object" ? value.meta : {},
      version: Number(value.version) || 6
    };
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return resolve(null);
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function mirrorSnapshot(snapshot) {
    try {
      const db = await openDB();
      if (!db) return false;
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(snapshot, "latest");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      db.close();
      return true;
    } catch {
      return false;
    }
  }

  async function readMirror() {
    try {
      const db = await openDB();
      if (!db) return null;
      const value = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const request = tx.objectStore(STORE).get("latest");
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
      db.close();
      return value;
    } catch {
      return null;
    }
  }

  window.DreamRiftStorage = {
    migrateLegacy,
    createBackup,
    normalizeBackup,
    mirrorSnapshot,
    readMirror
  };
})();
