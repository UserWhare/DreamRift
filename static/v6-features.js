"use strict";

(function () {
  const data = window.DreamRiftV6Data || { anomalies: [], moodCodex: {} };

  function clean(value) {
    return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function dailyKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isPreviousDay(previousKey, currentKey) {
    if (!previousKey || !currentKey) return false;
    const current = new Date(`${currentKey}T12:00:00`);
    const previous = new Date(`${previousKey}T12:00:00`);
    return Math.round((current - previous) / 86400000) === 1;
  }

  function detectAnomaly(dream) {
    const words = (dream.words || []).map(clean);
    const match = data.anomalies.find(item => {
      if (item.minOddity && Number(dream.oddity) >= item.minOddity) return true;
      if (!item.words) return false;
      return item.words.every(word => words.includes(clean(word)));
    });
    return match ? { ...match } : null;
  }

  function findConnection(dream, existingDreams) {
    const currentWords = new Set((dream.words || []).map(clean));
    for (const old of existingDreams || []) {
      const shared = (old.words || []).map(clean).find(word => currentWords.has(word));
      if (shared) {
        return { id: old.id, title: old.title || "sonho anterior", reason: `os dois carregam o símbolo “${shared}”` };
      }
    }
    const sameMood = (existingDreams || []).find(old => old.mood && old.mood === dream.mood);
    if (sameMood) {
      return { id: sameMood.id, title: sameMood.title || "sonho anterior", reason: "a mesma atmosfera reapareceu" };
    }
    return null;
  }

  function fragmentsFor(dream) {
    const rarity = dream.rarity?.key || "comum";
    const rarityValue = { comum: 4, incomum: 6, raro: 9, bizarro: 12, lendario: 18, impossivel: 26 }[rarity] || 4;
    const sizeValue = { curto: 0, medio: 2, profundo: 5, delirio: 9 }[dream.size] || 2;
    return rarityValue + sizeValue;
  }

  function levelStart(level) {
    return 35 * (level - 1) * (level - 1);
  }

  function levelFor(totalFragments) {
    return Math.max(1, Math.floor(Math.sqrt(Math.max(0, Number(totalFragments) || 0) / 35)) + 1);
  }

  function progressFor(totalFragments) {
    const total = Math.max(0, Number(totalFragments) || 0);
    const level = levelFor(total);
    const start = levelStart(level);
    const next = levelStart(level + 1);
    const current = total - start;
    const needed = Math.max(1, next - start);
    return {
      level,
      current,
      needed,
      remaining: Math.max(0, next - total),
      percent: Math.max(0, Math.min(100, Math.round((current / needed) * 100)))
    };
  }

  function rankFor(level) {
    if (level >= 12) return "Cartógrafo da Fenda";
    if (level >= 9) return "Arquivista Impossível";
    if (level >= 6) return "Sonâmbulo";
    if (level >= 3) return "Observador";
    return "Errante";
  }

  function codexCards(meta) {
    const moodUnlocked = new Set(meta?.codex?.moods || []);
    const anomalyUnlocked = new Set(meta?.codex?.anomalies || []);
    const symbolCount = new Set(meta?.codex?.symbols || []).size;
    const cards = [];

    Object.entries(data.moodCodex || {}).forEach(([key, value]) => {
      cards.push({
        id: `mood-${key}`,
        type: "Atmosfera",
        title: value[0],
        description: value[1],
        hint: "Gere um sonho nesta atmosfera.",
        footer: "Atmosfera registrada",
        unlocked: moodUnlocked.has(key)
      });
    });

    (data.anomalies || []).forEach(item => {
      cards.push({
        id: `anomaly-${item.key}`,
        type: "Anomalia",
        title: item.title,
        description: item.description,
        hint: item.hint,
        footer: "Anomalia estabilizada no Codex",
        unlocked: anomalyUnlocked.has(item.key)
      });
    });

    [10, 25, 40].forEach(target => {
      cards.push({
        id: `symbols-${target}`,
        type: "Símbolos",
        title: `${target} símbolos catalogados`,
        description: `O Codex já reconhece ${symbolCount} símbolos únicos atravessados nas suas fendas.`,
        hint: `Catalogue ${target} símbolos únicos.`,
        footer: `${symbolCount} / ${target}`,
        unlocked: symbolCount >= target
      });
    });

    return cards;
  }

  function profileSummary(meta, dreams) {
    const total = (dreams || []).length;
    if (!total) return "A fenda ainda não conhece seu padrão.";
    const moods = {};
    (dreams || []).forEach(dream => {
      const label = dream.moodLabel || dream.mood || "Desconhecida";
      moods[label] = (moods[label] || 0) + 1;
    });
    const dominant = Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0] || "desconhecida";
    const anomalies = meta?.codex?.anomalies?.length || 0;
    const streak = meta?.daily?.streak || 0;
    return `Seu arquivo puxa mais para ${dominant}. ${anomalies} anomalia(s) registrada(s) e sequência diária de ${streak} dia(s).`;
  }

  window.DreamRiftFeatures = {
    dailyKey,
    isPreviousDay,
    detectAnomaly,
    findConnection,
    fragmentsFor,
    levelFor,
    progressFor,
    rankFor,
    codexCards,
    profileSummary
  };
})();
