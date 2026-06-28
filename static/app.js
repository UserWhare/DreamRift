"use strict";

const STORAGE_KEY = "dreamrift.v5.dreams";
const SETTINGS_KEY = "dreamrift.v5.settings";
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const moods = {
  liminal: {
    label: "Liminal",
    type: "Sonho Liminal",
    places: ["um corredor sem fim", "uma escola vazia", "uma sala de espera molhada", "um shopping depois do fechamento", "um estacionamento onde todos os carros têm a mesma placa"],
    verbs: ["respirava devagar", "ecoava seu nome", "mudava quando você piscava", "parecia esperar por você", "tinha o som de um elevador distante"],
    texture: "luz fluorescente, carpete úmido e silêncio antigo",
    ending: ["a luz apagou como se alguém tivesse fechado uma pálpebra", "você acordou lembrando do cheiro, mas não do caminho", "uma porta abriu atrás de você, mesmo sem parede"],
    boost: { nostalgia: 14, nonsense: 6 }
  },
  abismo: {
    label: "Abismo",
    type: "Pesadelo Abissal",
    places: ["uma cratera com escadas", "um elevador descendo há anos", "um céu por baixo da terra", "um túnel que engolia nomes", "uma cidade pendurada dentro de um poço"],
    verbs: ["pedia silêncio", "apagava as bordas do mundo", "sussurrava números", "devolvia ecos do futuro", "ficava maior quando você parava"],
    texture: "vento frio vindo de um lugar impossível",
    ending: ["o fundo não chegou, mas a queda terminou", "você ouviu aplausos vindos debaixo dos seus pés", "a escuridão piscou primeiro"],
    boost: { threat: 18, lucidity: -6 }
  },
  hotel: {
    label: "Hotel infinito",
    type: "Hotel Infinito",
    places: ["um hotel sem recepção", "um quarto repetido mil vezes", "um lobby sem rostos", "um corredor com portas negativas", "um elevador que só aceitava andares esquecidos"],
    verbs: ["tocava uma campainha sozinha", "trocava o andar de lugar", "guardava hóspedes que esqueceram de acordar", "chovia por dentro", "pedia documentos que ainda não existiam"],
    texture: "tapete vermelho, perfume antigo e lâmpadas baixas",
    ending: ["a recepção ligou para avisar que você nunca fez check-in", "a chave do quarto apareceu dentro da sua boca", "a cama estava arrumada com o formato exato do seu medo"],
    boost: { nostalgia: 9, threat: 8 }
  },
  radio: {
    label: "Sinal de rádio",
    type: "Transmissão Fantasma",
    places: ["uma cabine de transmissão", "um campo cheio de antenas", "um porão com rádios ligados", "uma torre vermelha no escuro", "uma estrada onde os postes repetiam a mesma música"],
    verbs: ["transmitia uma voz infantil", "captava uma versão futura de você", "chiava como se tivesse medo", "repetia a mesma data", "traduzia pensamentos em ruído"],
    texture: "estática, poeira elétrica e luz vermelha",
    ending: ["a transmissão terminou chamando você pelo nome errado", "alguém respondeu antes da pergunta", "o rádio continuou ligado dentro do silêncio"],
    boost: { lucidity: 8, nonsense: 10 }
  },
  infancia: {
    label: "Infância quebrada",
    type: "Memória Falsa",
    places: ["um quarto pequeno demais", "um parquinho coberto por lençóis", "uma festa de aniversário vazia", "uma cozinha com portas erradas", "uma sala de aula onde ninguém cresceu"],
    verbs: ["cantava parabéns fora de ritmo", "guardava brinquedos crescidos", "misturava saudade e ameaça", "sorria sem dentes", "tinha cheiro de chuva antiga"],
    texture: "bolo seco, chuva na janela e memória amassada",
    ending: ["uma criança que parecia você pediu desculpa primeiro", "o bolo tinha velas demais para sua idade", "a porta do quarto fechou com voz de adulto"],
    boost: { nostalgia: 22, threat: 5 }
  },
  neon: {
    label: "Neon",
    type: "Cyberdream",
    places: ["uma rua neon sem céu", "um servidor com cheiro de igreja", "uma lan house submersa", "uma estação orbital abandonada", "um beco renderizado com chuva roxa"],
    verbs: ["renderizava sua sombra", "vendia lembranças criptografadas", "falhava em pixels roxos", "rezava em linguagem binária", "atualizava o passado sem pedir permissão"],
    texture: "chuva digital, cabos como raízes e hologramas mortos",
    ending: ["a tela mostrou: sonho salvo com erro", "seu reflexo carregou em baixa resolução", "o céu reiniciou e esqueceu metade das estrelas"],
    boost: { lucidity: 12, nonsense: 12 }
  },
  maquina: {
    label: "Máquina sonhando",
    type: "Máquina Sonhando",
    places: ["um cérebro mecânico", "uma fábrica dormindo", "um computador coberto de musgo", "uma sala de máquinas respirando", "um data center com batimentos cardíacos"],
    verbs: ["sonhava com você", "calculava a cor do medo", "imprimia sonhos errados", "aprendia culpa", "pedia para ser desligado com carinho"],
    texture: "metal quente, poeira e motor distante",
    ending: ["a máquina acordou e você continuou sonhando", "um recibo saiu escrito: memória recusada", "as engrenagens pararam só quando você piscou"],
    boost: { lucidity: 10, threat: 4, nonsense: 9 }
  },
  mar: {
    label: "Mar escuro",
    type: "Mar Escuro",
    places: ["uma praia sem horizonte", "um navio dentro de um quarto", "um farol no fundo do mar", "um aquário do tamanho de uma cidade", "uma ilha que afundava apenas quando olhada"],
    verbs: ["falava em ondas baixas", "devolvia objetos que você nunca perdeu", "respirava maré preta", "arrastava pegadas para trás", "guardava estrelas presas em garrafas"],
    texture: "sal, madeira inchada e estrelas afogadas",
    ending: ["o mar devolveu sua voz, mas ficou com a resposta", "um peixe acendeu como uma lâmpada triste", "a maré baixou e revelou uma rua familiar"],
    boost: { nostalgia: 7, threat: 10 }
  },
  culto: {
    label: "Ritual falso",
    type: "Ritual Falso",
    places: ["uma igreja sem santo", "um altar de televisores", "um confessionário transparente", "um templo dentro de um elevador", "uma capela construída com telas quebradas"],
    verbs: ["perdoava pecados inventados", "cobrava promessas que você não fez", "rezava seu nome ao contrário", "tocava sinos debaixo da pele", "abria livros que respiravam"],
    texture: "incenso frio, cera preta e coral desafinado",
    ending: ["a bênção chegou em forma de multa", "o altar te reconheceu como testemunha", "alguém apagou as velas com sua respiração"],
    boost: { threat: 11, nonsense: 12 }
  }
};

const sizeModes = {
  curto: { label: "Curto", sections: 2, oddity: 0 },
  medio: { label: "Médio", sections: 3, oddity: 3 },
  profundo: { label: "Profundo", sections: 5, oddity: 6 },
  delirio: { label: "Delírio", sections: 7, oddity: 10 }
};

const wordBank = [
  "porta", "mar", "relógio", "espelho", "catedral", "neblina", "elevador", "janela", "cinzas", "hotel",
  "peixe", "satélite", "máquina", "escada", "máscara", "chave", "rádio", "dente", "floresta", "ônibus",
  "boneca", "subsolo", "igreja", "farol", "fita", "mapa", "formiga", "lua", "corrente", "telefone",
  "trem", "coroa", "lago", "caixa", "fotografia", "piano", "vento", "tapete", "olho", "arquivo",
  "cinema", "agulha", "ponte", "sombra", "sino", "vidro", "nuvem", "poço", "sala", "boneco"
];

const dailySets = [
  ["porta", "mar", "relógio"], ["rádio", "neblina", "hotel"], ["catedral", "peixe", "janela"],
  ["máquina", "lua", "escada"], ["cinzas", "mapa", "farol"], ["ônibus", "boneca", "subsolo"],
  ["espelho", "coroa", "telefone"]
];

const meanings = {
  porta: "uma escolha que você empurrou para amanhã",
  mar: "memória grande demais para caber acordado",
  relógio: "medo de estar atrasado para uma vida sem horário",
  relogio: "medo de estar atrasado para uma vida sem horário",
  espelho: "uma versão sua que aprendeu a mentir primeiro",
  catedral: "culpa transformada em arquitetura",
  neblina: "verdade com baixa resolução",
  elevador: "mudança de fase sem controle de destino",
  janela: "vontade de fugir sem admitir fuga",
  cinzas: "algo terminado que ainda aquece",
  hotel: "um lugar temporário que aprendeu seu nome",
  peixe: "pensamento silencioso fora da água",
  satélite: "observação distante demais para salvar alguém",
  satelite: "observação distante demais para salvar alguém",
  máquina: "sentimento tentando virar procedimento",
  maquina: "sentimento tentando virar procedimento",
  escada: "progresso que cobra pedágio emocional",
  rádio: "mensagem antiga procurando um corpo novo",
  radio: "mensagem antiga procurando um corpo novo",
  dente: "perda de controle disfarçada de detalhe pequeno",
  chave: "permissão para abrir algo que talvez devesse ficar fechado",
  lua: "testemunha fria de uma decisão que ninguém viu",
  mapa: "tentativa de organizar um lugar que muda de forma",
  farol: "esperança que não sabe se ainda deve acender",
  mascara: "identidade usada como armadura",
  máscara: "identidade usada como armadura",
  telefone: "uma conversa atrasada tentando acontecer",
  fotografia: "um instante que não aceitou morrer",
  olho: "vigilância interna disfarçada de intuição",
  arquivo: "lembrança comprimida para ocupar menos dor",
  sombra: "parte sua que chegou antes",
  poço: "profundidade que aprendeu seu endereço",
  poco: "profundidade que aprendeu seu endereço"
};

const openings = [
  ({w, place, mood}) => `Você acordou em ${place}. O ar tinha ${mood.texture}, e tudo parecia limpo demais, como se alguém tivesse apagado os detalhes ruins antes de você chegar. No centro do lugar havia ${article(w[0])} ${w[0]}, imóvel, esperando ser notado.`,
  ({w, place, mood}) => `O sonho começou sem aviso, já no meio de ${place}. Você sabia que estava atrasado, mas não sabia para o quê. ${capitalize(article(w[1]))} ${w[1]} apareceu como se fosse um sinal de trânsito, enquanto ${article(w[0])} ${w[0]} repetia um movimento impossível.`,
  ({w, place, mood}) => `Primeiro veio o som. Depois veio ${place}. A luz tinha a textura de ${mood.texture}, e cada passo parecia abrir uma gaveta antiga dentro da cabeça. Alguém tinha deixado ${article(w[2])} ${w[2]} no chão, perfeitamente alinhado com a sua sombra.`
];

const developments = [
  ({w, verb}) => `Quando você tocou ${w[0]}, ${article(w[1])} ${w[1]} ${verb}. Nada se moveu de verdade, mas a sensação era de que o sonho inteiro tinha virado o rosto para você. Ao longe, ${article(w[2])} ${w[2]} começou a responder perguntas que você ainda não tinha feito.`,
  ({w, place}) => `Você tentou sair, mas ${place} reorganizou seus corredores. Em uma parede, as palavras ${w[0]}, ${w[1]} e ${w[2]} estavam escritas como regras de emergência. A cada vez que você lia, uma palavra sumia e deixava uma lembrança falsa no lugar.`,
  ({w, verb}) => `Pessoas sem rosto passaram por você segurando cópias pequenas de ${w[0]}. Uma delas apontou para ${w[1]} e disse que aquilo era seu, embora você nunca tivesse visto antes. Então ${w[2]} ${verb}, e todos fingiram que isso era normal.`
];

const impossibleEvents = [
  ({w}) => `O evento impossível aconteceu quando ${article(w[2])} ${w[2]} abriu a boca e de dentro saiu uma sala inteira. Lá dentro, havia outra versão sua tentando esconder ${article(w[0])} ${w[0]} atrás de ${article(w[1])} ${w[1]}. Ela não parecia assustada; parecia decepcionada por você ter chegado cedo.`,
  ({w}) => `Em certo momento, o chão virou água, mas ninguém afundou. ${Cap(article(w[1]))} ${w[1]} começou a chover de baixo para cima. Você percebeu que ${w[0]} não era um objeto, e sim uma instrução. ${Cap(article(w[2]))} ${w[2]} era a consequência.`,
  ({w}) => `O céu se abriu como uma gaveta. De dentro caíram versões antigas de ${w[0]}, todas etiquetadas com datas que ainda não aconteceram. Uma delas carregava ${article(w[1])} ${w[1]}. Outra sussurrava ${w[2]} como se fosse senha de hospital.`
];

const descents = [
  ({w, mood}) => `Depois disso, o sonho ficou mais lógico e por isso mais errado. Você entendeu que ${w[0]} representava ${meaningOf(w[0])}, mas essa explicação não trouxe alívio. ${Cap(article(w[1]))} ${w[1]} apontava para ${meaningOf(w[1])}; ${article(w[2])} ${w[2]}, porém, parecia negar todos os significados ao mesmo tempo.`,
  ({w}) => `Você encontrou uma mesa preparada para três coisas: ${article(w[0])} ${w[0]}, ${article(w[1])} ${w[1]} e ${article(w[2])} ${w[2]}. Nenhuma delas era sua, mas todas pareciam lembrar de você. No prato vazio havia um bilhete: “não acorde antes da parte importante”.`,
  ({w, place}) => `${Cap(place)} começou a encolher até caber dentro de ${article(w[0])} ${w[0]}. Você colocou no bolso sem querer. O peso era pequeno, mas a culpa era enorme. Ao tentar largar, ${w[1]} prendeu sua mão e ${w[2]} acendeu por dentro.`
];

const endings = [
  ({w, mood}) => `No final, ${pick(mood.ending)}. Antes de acordar, você viu ${article(w[0])} ${w[0]} sozinho no mesmo lugar de antes, mas agora ele tinha aprendido seu nome.`,
  ({w, mood}) => `O sonho terminou quando ${article(w[2])} ${w[2]} pediu para ser esquecido. Você prometeu, mas ${pick(mood.ending)}. Ao abrir os olhos, a promessa parecia mais real do que o quarto.`,
  ({w, mood}) => `Antes da saída, alguém colocou ${article(w[1])} ${w[1]} na sua mão e disse que era prova suficiente. ${pick(mood.ending)}. Você acordou com a sensação de ter sido absolvido por um crime que não lembra.`
];

const deliriumExtras = [
  ({w}) => `Em uma sala lateral, uma gravação mostrava você dormindo dentro de outra pessoa. Na tela, ${w[0]} aparecia como animal, ${w[1]} como endereço e ${w[2]} como sentença. Um narrador invisível repetia: “a ordem dos símbolos não pode ser corrigida”.`,
  ({w}) => `Depois veio a parte burocrática do pesadelo. Um funcionário sem olhos carimbou ${w[0]} em três documentos, pediu desculpas por ${w[1]} e arquivou ${w[2]} na pasta errada. Quando você reclamou, ele respondeu que sonhos também têm fila.`,
  ({w}) => `Você tentou contar os objetos para manter a lucidez, mas eles se multiplicavam conforme eram lembrados. Havia sete ${w[0]}, treze ${w[1]} e um único ${w[2]} olhando para todos eles como se fosse o responsável.`
];

const interpretationIntros = [
  "Interpretação falsa",
  "Leitura simbólica duvidosa",
  "Diagnóstico onírico inventado",
  "Relatório da fenda"
];

const warnings = [
  "Aviso: não aceite convites feitos por objetos que sabem seu nome.",
  "Aviso: se voltar a esse lugar, conte as portas. Uma delas estará contando você.",
  "Aviso: o sonho terminou, mas deixou uma janela aberta.",
  "Aviso: ignore qualquer rádio que ligue sozinho por educação.",
  "Aviso: se a mesma palavra aparecer amanhã, finja que foi coincidência.",
  "Aviso: sonhos longos costumam devolver algo que você não pediu."
];

const rarityLevels = [
  { key: "comum", label: "Comum", min: 0 },
  { key: "incomum", label: "Incomum", min: 35 },
  { key: "raro", label: "Raro", min: 58 },
  { key: "bizarro", label: "Bizarro", min: 76 },
  { key: "lendario", label: "Lendário", min: 88 },
  { key: "impossivel", label: "Impossível", min: 96 }
];

let state = {
  dreams: loadDreams(),
  settings: loadSettings(),
  currentView: "home"
};

function init() {
  populateMoods();
  hydrateDailyWords();
  bindEvents();
  applySettings();
  renderAll();
}

function populateMoods() {
  const select = $("#mood");
  select.innerHTML = Object.entries(moods).map(([key, mood]) => `<option value="${key}">${escapeHTML(mood.label)}</option>`).join("");
}

function bindEvents() {
  $$(".nav-btn").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
  $("#intensity").addEventListener("input", (e) => $("#intensityText").textContent = e.target.value);
  $("#randomWords").addEventListener("click", () => useWords(randomWords()));
  $("#useDaily").addEventListener("click", () => useWords(getDailyWords()));
  $("#generate").addEventListener("click", generateFlow);
  ["#word1", "#word2", "#word3"].forEach(id => $(id).addEventListener("keydown", (e) => { if (e.key === "Enter") generateFlow(); }));
  $("#search").addEventListener("input", renderArchive);
  $("#filter").addEventListener("change", renderArchive);
  $("#exportAll").addEventListener("click", exportAll);
  $("#downloadBackup").addEventListener("click", exportAll);
  $("#seedDemo").addEventListener("click", seedDemo);
  $("#clearAll").addEventListener("click", clearAll);
  $("#compactMode").addEventListener("change", updateSettingsFromUI);
  $("#reduceMotion").addEventListener("change", updateSettingsFromUI);
  $("#closeModal").addEventListener("click", () => $("#modal").close());
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("#modal").close(); });
}

function setView(view) {
  state.currentView = view;
  $$(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  $$(".view").forEach(el => el.classList.toggle("active", el.id === view));
  if (view === "archive") renderArchive();
  if (view === "ranking") renderRanking();
  if (view === "favorites") renderFavorites();
  if (view === "stats") renderStats();
}

function loadDreams() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveDreams() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dreams.slice(0, 250)));
  renderAll();
}

function loadSettings() {
  try {
    return { compact: true, reduceMotion: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return { compact: true, reduceMotion: true };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function applySettings() {
  document.body.classList.toggle("compact", !!state.settings.compact);
  document.body.classList.toggle("reduce-motion", !!state.settings.reduceMotion);
  $("#compactMode").checked = !!state.settings.compact;
  $("#reduceMotion").checked = !!state.settings.reduceMotion;
}

function updateSettingsFromUI() {
  state.settings.compact = $("#compactMode").checked;
  state.settings.reduceMotion = $("#reduceMotion").checked;
  saveSettings();
  applySettings();
  toast("Ajustes salvos");
}

function getDailyWords() {
  const day = Math.floor(Date.now() / 86400000);
  return dailySets[day % dailySets.length];
}

function hydrateDailyWords() {
  $("#dailyWords").textContent = getDailyWords().join(" / ");
}

function useWords(words) {
  $("#word1").value = words[0] || "";
  $("#word2").value = words[1] || "";
  $("#word3").value = words[2] || "";
  toast("Palavras aplicadas");
}

function randomWords() {
  return [...wordBank].sort(() => Math.random() - 0.5).slice(0, 3);
}

function generateFlow() {
  const run = () => {
    const dream = buildDream();
    state.dreams.unshift(dream);
    saveDreams();
    renderResult(dream);
    setView("home");
    toast("Sonho gerado");
  };

  if ($("#ritual").checked && !state.settings.reduceMotion) {
    runRitual(run);
  } else {
    run();
  }
}

function runRitual(done) {
  const overlay = $("#ritualOverlay");
  const bar = $("#ritualBar");
  const text = $("#ritualText");
  const steps = ["lendo símbolos...", "montando narrativa...", "distorcendo memória...", "abrindo fenda..."];
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  bar.style.width = "0%";
  let index = 0;
  const tick = () => {
    text.textContent = steps[index] || "pronto";
    bar.style.width = `${Math.min(100, (index + 1) * 25)}%`;
    index++;
    if (index <= steps.length) setTimeout(tick, 190);
    else setTimeout(() => {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      done();
    }, 100);
  };
  tick();
}

function buildDream() {
  let words = [$("#word1").value, $("#word2").value, $("#word3").value].map(normalizeWord).filter(Boolean);
  while (words.length < 3) words.push(pick(wordBank));
  words = words.slice(0, 3);

  const moodKey = $("#mood").value;
  const mood = moods[moodKey] || moods.liminal;
  const sizeKey = $("#dreamSize")?.value || "medio";
  const size = sizeModes[sizeKey] || sizeModes.medio;
  const intensity = Number($("#intensity").value) || 60;
  const base = intensity + rand(-12, 16) + rareBonus(words) + size.oddity;
  const oddity = clamp(base);
  const metrics = {
    lucidity: clamp(45 + rand(-20, 20) + (mood.boost.lucidity || 0) - intensity / 8 + (sizeKey === "delirio" ? -8 : 0)),
    threat: clamp(25 + intensity / 2 + rand(-16, 18) + (mood.boost.threat || 0) + (sizeKey === "delirio" ? 7 : 0)),
    nonsense: clamp(28 + intensity / 1.7 + rand(-18, 16) + (mood.boost.nonsense || 0) + (sizeKey === "profundo" ? 5 : 0) + (sizeKey === "delirio" ? 12 : 0)),
    nostalgia: clamp(30 + rand(-14, 20) + (mood.boost.nostalgia || 0))
  };
  const rarity = getRarity(oddity);
  const place = pick(mood.places);
  const verb = pick(mood.verbs);
  const title = makeTitle(words, mood, rarity, size);
  const sections = buildSections({ words, mood, place, verb, sizeKey, rarity, metrics });
  const symbols = buildSymbols(words, mood, oddity);
  const interpretation = buildInterpretation({ words, mood, size, rarity, metrics, oddity, symbols });
  const warning = buildWarning(words, oddity, sizeKey);

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    title,
    words,
    mood: moodKey,
    moodLabel: mood.label,
    type: mood.type,
    size: sizeKey,
    sizeLabel: size.label,
    rarity,
    oddity,
    metrics,
    story: sections.map(s => s.text).join("\n\n"),
    sections,
    interpretation,
    warning,
    symbols,
    favorite: false
  };
}

function buildSections(ctx) {
  const { words: w, mood, place, verb, sizeKey } = ctx;
  const base = [
    { title: "Abertura", text: pick(openings)({ w, mood, place, verb }) },
    { title: "Desenvolvimento", text: pick(developments)({ w, mood, place, verb }) }
  ];

  if (sizeKey === "curto") {
    base.push({ title: "Final", text: pick(endings)({ w, mood, place, verb }) });
    return base;
  }

  base.push({ title: "Evento impossível", text: pick(impossibleEvents)({ w, mood, place, verb }) });

  if (sizeKey === "profundo" || sizeKey === "delirio") {
    base.push({ title: "Descida", text: pick(descents)({ w, mood, place, verb }) });
    base.push({ title: "Símbolo quebrado", text: `Nesse ponto, ${w[0]} deixou de ser coisa e virou ambiente. ${Cap(article(w[1]))} ${w[1]} ficou preso no som dos seus passos. ${Cap(article(w[2]))} ${w[2]} observava tudo de um lugar que não existia quando o sonho começou.` });
  }

  if (sizeKey === "delirio") {
    base.splice(3, 0, { title: "Interferência", text: pick(deliriumExtras)({ w, mood, place, verb }) });
    base.push({ title: "Camada oculta", text: pick(deliriumExtras)({ w: [...w].reverse(), mood, place, verb }) });
  }

  base.push({ title: "Final", text: pick(endings)({ w, mood, place, verb }) });
  return base;
}

function buildSymbols(words, mood, oddity) {
  return words.map((word, index) => {
    const clean = removeAccents(word);
    const base = meanings[word] || meanings[clean] || `símbolo instável ligado a ${word}`;
    const roles = ["gatilho", "cenário emocional", "consequência"];
    const layers = [
      `No sonho, funciona como ${roles[index]}: ${base}.`,
      `Aparece contaminado pela atmosfera ${mood.label.toLowerCase()}, então o significado fica menos confiável.`,
      oddity >= 80 ? "Por causa da alta estranheza, esse símbolo parece consciente de que está sendo interpretado." : "Ainda parece um símbolo comum, mas posicionado no lugar errado."
    ];
    return { word, meaning: layers.join(" ") };
  });
}

function buildInterpretation({ words, mood, size, rarity, metrics, oddity, symbols }) {
  const strongest = Object.entries(metrics).sort((a, b) => b[1] - a[1])[0];
  const weakest = Object.entries(metrics).sort((a, b) => a[1] - b[1])[0];
  const intro = pick(interpretationIntros);
  const emotionalAxis = {
    lucidity: "controle",
    threat: "ameaça",
    nonsense: "confusão",
    nostalgia: "memória"
  };
  return `${intro}: este sonho usa ${words.join(", ")} como uma pequena máquina simbólica. A atmosfera ${mood.label.toLowerCase()} transforma ${symbols[0].word} em ${meaningOf(symbols[0].word)}, enquanto ${symbols[1].word} tenta esconder ${meaningOf(symbols[1].word)}. O ponto dominante é ${emotionalAxis[strongest[0]] || strongest[0]} (${strongest[1]}/100), então o sonho parece querer ${strongest[0] === "threat" ? "ameaçar antes de explicar" : strongest[0] === "nostalgia" ? "fingir saudade para parecer seguro" : strongest[0] === "lucidity" ? "se manter claro só o bastante para incomodar" : "quebrar lógica para criar significado"}. O ponto mais fraco é ${emotionalAxis[weakest[0]] || weakest[0]} (${weakest[1]}/100), indicando que a fenda não entrega respostas completas. Classificação: ${rarity.label}, tamanho ${size.label}, estranheza ${oddity}/100.`;
}

function buildWarning(words, oddity, sizeKey) {
  if (sizeKey === "delirio" && oddity >= 88) return `Aviso: este sonho é longo demais para ser tratado como coincidência. Se ${words[2]} aparecer fora daqui, não responda em voz alta.`;
  if (oddity >= 92) return `Aviso: ${words[0]} e ${words[1]} formaram uma combinação instável. Evite procurar sentido em portas, rádios e objetos parados por algumas horas.`;
  return pick(warnings);
}

function makeTitle(words, mood, rarity, size) {
  const patterns = [
    `O ${titleCase(words[0])} Dentro de ${article(words[1])} ${titleCase(words[1])}`,
    `Arquivo ${titleCase(words[2])}`,
    `${titleCase(words[0])} no ${mood.label}`,
    `A Noite do ${titleCase(words[1])}`,
    `Manual Para Não Sonhar com ${titleCase(words[2])}`,
    `Inventário de ${titleCase(words[0])}, ${titleCase(words[1])} e ${titleCase(words[2])}`,
    `Quando ${titleCase(words[2])} Aprendeu Seu Nome`
  ];
  let title = pick(patterns);
  if (size.label === "Delírio") title = `Delírio: ${title}`;
  if (["lendario", "impossivel"].includes(rarity.key)) title = `Fenda: ${title}`;
  return title;
}

function renderAll() {
  renderArchive();
  renderRanking();
  renderFavorites();
  renderStats();
}

function renderResult(dream) {
  const result = $("#result");
  result.classList.remove("empty");
  result.innerHTML = dreamFullHTML(dream, false);
  bindDreamActions(result);
}

function dreamFullHTML(dream, modal = false) {
  return `
    <article class="${modal ? "modal-content" : "dream-result"}">
      <div class="result-head">
        <div>
          <div class="pills">
            <span class="pill rarity-${dream.rarity.key}">${icon("i-rank")}${escapeHTML(dream.rarity.label)}</span>
            <span class="pill">${icon("i-dream")}${escapeHTML(dream.type)}</span>
            <span class="pill">${icon("i-archive")}${escapeHTML(dream.sizeLabel || "Médio")}</span>
            <span class="pill">Estranheza ${dream.oddity}/100</span>
          </div>
          <h2>${escapeHTML(dream.title)}</h2>
        </div>
        <div class="result-actions">
          <button class="icon-btn fav ${dream.favorite ? "active" : ""}" data-action="favorite" data-id="${dream.id}" title="Favoritar">${icon("i-heart")}</button>
          <button class="icon-btn" data-action="copy" data-id="${dream.id}" title="Copiar">${icon("i-copy")}</button>
          <button class="icon-btn" data-action="export" data-id="${dream.id}" title="Exportar">${icon("i-download")}</button>
          <button class="icon-btn" data-action="delete" data-id="${dream.id}" title="Excluir">${icon("i-trash")}</button>
        </div>
      </div>

      ${storyHTML(dream)}

      <div class="meta-grid">
        ${meterHTML("Lucidez", dream.metrics.lucidity)}
        ${meterHTML("Ameaça", dream.metrics.threat)}
        ${meterHTML("Nonsense", dream.metrics.nonsense)}
        ${meterHTML("Nostalgia", dream.metrics.nostalgia)}
      </div>

      <div class="symbols">
        ${dream.symbols.map(s => `<div class="symbol"><b>${escapeHTML(s.word)}</b><span>${escapeHTML(s.meaning)}</span></div>`).join("")}
      </div>

      <p class="note deep-note">${escapeHTML(dream.interpretation)}</p>
      <p class="note warning-note">${escapeHTML(dream.warning)}</p>
    </article>`;
}

function storyHTML(dream) {
  if (Array.isArray(dream.sections) && dream.sections.length) {
    return `<div class="story sectioned-story">${dream.sections.map(section => `
      <section class="story-block">
        <h4>${escapeHTML(section.title)}</h4>
        <p>${escapeHTML(section.text)}</p>
      </section>`).join("")}</div>`;
  }
  return `<div class="story">${escapeHTML(dream.story || "")}</div>`;
}

function meterHTML(label, value) {
  return `<div class="meter"><span><b>${label}</b><b>${value}</b></span><i style="--w:${value}%"></i></div>`;
}

function renderArchive() {
  const search = normalizeWord($("#search")?.value || "");
  const filter = $("#filter")?.value || "all";
  let items = [...state.dreams];
  if (search) {
    items = items.filter(d => [d.title, d.story, d.moodLabel, d.sizeLabel, ...d.words].join(" ").toLowerCase().includes(search));
  }
  if (filter === "favorite") items = items.filter(d => d.favorite);
  if (filter === "rare") items = items.filter(d => d.oddity >= 58);
  if (filter === "high") items = items.filter(d => d.oddity >= 80);
  renderCards("#archiveList", items);
}

function renderFavorites() {
  renderCards("#favoritesList", state.dreams.filter(d => d.favorite));
}

function renderCards(selector, items) {
  const el = $(selector);
  if (!el) return;
  if (!items.length) {
    el.innerHTML = `<div class="empty-list">Nada por aqui ainda.</div>`;
    return;
  }
  el.innerHTML = items.map(cardHTML).join("");
  bindDreamActions(el);
}

function cardHTML(dream) {
  return `<article class="dream-card">
    <div class="card-top">
      <span class="pill rarity-${dream.rarity.key}">${escapeHTML(dream.rarity.label)}</span>
      <button class="icon-btn fav ${dream.favorite ? "active" : ""}" data-action="favorite" data-id="${dream.id}" title="Favoritar">${icon("i-heart")}</button>
    </div>
    <h3>${escapeHTML(dream.title)}</h3>
    <p>${escapeHTML(excerpt(dream))}</p>
    <div class="card-foot">
      <span>${dream.oddity}/100 · ${escapeHTML(dream.sizeLabel || "Médio")} · ${escapeHTML(dream.moodLabel)}</span>
      <button class="icon-btn" data-action="open" data-id="${dream.id}" title="Abrir">${icon("i-eye")}</button>
    </div>
  </article>`;
}

function excerpt(dream) {
  const text = Array.isArray(dream.sections) && dream.sections.length ? dream.sections[0].text : dream.story || "";
  return text.length > 260 ? text.slice(0, 260).trim() + "..." : text;
}

function renderRanking() {
  const list = [...state.dreams].sort((a, b) => b.oddity - a.oddity).slice(0, 20);
  const el = $("#rankingList");
  if (!el) return;
  if (!list.length) {
    el.innerHTML = `<div class="empty-list">Gere sonhos para criar o ranking.</div>`;
    return;
  }
  el.innerHTML = list.map((dream, index) => `<article class="rank-item">
    <div class="rank-num">${index + 1}</div>
    <div><h3>${escapeHTML(dream.title)}</h3><p>${escapeHTML(dream.rarity.label)} · ${escapeHTML(dream.sizeLabel || "Médio")} · ${escapeHTML(dream.moodLabel)} · ${formatDate(dream.createdAt)}</p></div>
    <button class="score" data-action="open" data-id="${dream.id}" title="Abrir">${dream.oddity}</button>
  </article>`).join("");
  bindDreamActions(el);
}

function renderStats() {
  const total = state.dreams.length;
  const fav = state.dreams.filter(d => d.favorite).length;
  const max = total ? Math.max(...state.dreams.map(d => d.oddity)) : 0;
  const rarity = dominantRarity();
  $("#statTotal").textContent = total;
  $("#statFav").textContent = fav;
  $("#statMax").textContent = max;
  $("#statRarity").textContent = rarity;
}

function dominantRarity() {
  if (!state.dreams.length) return "—";
  const counts = new Map();
  state.dreams.forEach(d => counts.set(d.rarity.label, (counts.get(d.rarity.label) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function bindDreamActions(root) {
  root.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === "favorite") toggleFavorite(id);
      if (action === "copy") copyDream(id);
      if (action === "export") exportDream(id);
      if (action === "delete") deleteDream(id);
      if (action === "open") openDream(id);
    });
  });
}

function findDream(id) {
  return state.dreams.find(d => d.id === id);
}

function toggleFavorite(id) {
  const dream = findDream(id);
  if (!dream) return;
  dream.favorite = !dream.favorite;
  saveDreams();
  toast(dream.favorite ? "Favoritado" : "Removido dos favoritos");
}

function deleteDream(id) {
  if (!confirm("Excluir este sonho?")) return;
  state.dreams = state.dreams.filter(d => d.id !== id);
  saveDreams();
  $("#modal")?.close();
  toast("Sonho excluído");
  if (!state.dreams.length) renderEmptyResult();
}

function renderEmptyResult() {
  const result = $("#result");
  result.classList.add("empty");
  result.innerHTML = `<div class="empty-box">${icon("i-eye")}<h2>Nenhum sonho aberto</h2><p>Gere um sonho e ele aparece aqui.</p></div>`;
}

async function copyDream(id) {
  const dream = findDream(id);
  if (!dream) return;
  const text = dreamText(dream);
  try {
    await navigator.clipboard.writeText(text);
    toast("Copiado");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    toast("Copiado");
  }
}

function exportDream(id) {
  const dream = findDream(id);
  if (!dream) return;
  downloadJSON(`dreamrift-${safeFile(dream.title)}.json`, dream);
}

function exportAll() {
  downloadJSON(`dreamrift-backup-${new Date().toISOString().slice(0,10)}.json`, state.dreams);
}

function openDream(id) {
  const dream = findDream(id);
  if (!dream) return;
  $("#modalBody").innerHTML = dreamFullHTML(dream, true);
  bindDreamActions($("#modalBody"));
  $("#modal").showModal();
}

function clearAll() {
  if (!state.dreams.length) return toast("Arquivo já vazio");
  if (!confirm("Limpar todo o arquivo de sonhos?")) return;
  state.dreams = [];
  saveDreams();
  renderEmptyResult();
  toast("Arquivo limpo");
}

function seedDemo() {
  const oldWords = [$("#word1").value, $("#word2").value, $("#word3").value];
  const oldMood = $("#mood").value;
  const oldSize = $("#dreamSize").value;
  const sets = [
    { words: ["rádio", "hotel", "neblina"], size: "medio" },
    { words: ["máquina", "lua", "escada"], size: "profundo" },
    { words: ["mar", "catedral", "espelho"], size: "delirio" }
  ];
  sets.forEach((item, index) => {
    useWords(item.words);
    $("#mood").value = Object.keys(moods)[index + 1] || "liminal";
    $("#dreamSize").value = item.size;
    $("#intensity").value = String(70 + index * 9);
    state.dreams.unshift(buildDream());
  });
  [$("#word1").value, $("#word2").value, $("#word3").value] = oldWords;
  $("#mood").value = oldMood;
  $("#dreamSize").value = oldSize;
  saveDreams();
  toast("Demo criada");
}

function dreamText(dream) {
  const story = Array.isArray(dream.sections) && dream.sections.length
    ? dream.sections.map(s => `${s.title}\n${s.text}`).join("\n\n")
    : dream.story;
  const symbols = dream.symbols.map(s => `- ${s.word}: ${s.meaning}`).join("\n");
  return `${dream.title}\n\n${dream.rarity.label} · ${dream.type} · ${dream.sizeLabel || "Médio"} · Estranheza ${dream.oddity}/100\nPalavras: ${dream.words.join(", ")}\n\n${story}\n\nSímbolos\n${symbols}\n\n${dream.interpretation}\n${dream.warning}`;
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("JSON baixado");
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 1500);
}

function getRarity(score) {
  return [...rarityLevels].reverse().find(r => score >= r.min) || rarityLevels[0];
}

function rareBonus(words) {
  const joined = words.join("");
  const accents = /[áàâãéêíóôõúç]/i.test(joined) ? 4 : 0;
  const long = words.some(w => w.length >= 9) ? 4 : 0;
  const sameStart = words.every(w => w[0] && w[0] === words[0][0]) ? 8 : 0;
  return accents + long + sameStart;
}

function meaningOf(word) {
  return meanings[word] || meanings[removeAccents(word)] || `um símbolo instável ligado a ${word}`;
}

function normalizeWord(word) {
  return String(word || "").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 24);
}

function removeAccents(text) {
  return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function article(word) {
  return /^[aeiouáàâãéêíóôõú]/i.test(word) ? "um estranho" : "um";
}

function capitalize(text) {
  const s = String(text || "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const Cap = capitalize;

function titleCase(text) {
  return String(text || "").split(" ").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function clamp(num) {
  return Math.max(0, Math.min(100, Math.round(num)));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function uid() {
  return "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatDate(iso) {
  try { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso)); }
  catch { return "agora"; }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function icon(id) {
  return `<svg aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function safeFile(name) {
  return removeAccents(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 50) || "sonho";
}

init();
