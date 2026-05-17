/* StudentFlow — modovi, timer, historija, bookmark, todo, kartice, blog */

/* StudentFlow — tptpskripte.js (Edina B.: jedna vanjska datoteka, bez jQuery) */

const STORAGE_KEYS = {
  mode: "sf_mode",
  theme: "sf_theme",
  name: "sf_name",
  history: "sf_history",
  bookmarks: "sf_bookmarks",
  todos: "sf_todos",
};

const IMG = {
  hug: "images/hug.png",
  favicon: "images/favicon.png",
  fokus: "images/jedna_stvar_jedan_ekran.png",
  pomodoro: "images/planiraj_blok_ne_dan.png",
  disanje: "images/disanje_kao_prekidac.png",
  zdravlje: "images/mikro_pauza_za_tijelo.png",
  alati: "images/telefon_u_drugi_prostor.png",
  aktivno: "images/ucenje_aktivno_ne_pasivno.png",
  blogPomodoro: "images/pomodoro_bez_panike.png",
  blogStres: "images/sta_se_desava_u_glavi.png",
  blogSan: "images/san-i_konsolidacija.png",
  imagemap: "images/stres_pri_ucenju.png",
};

const MODES = {
  motivisan: { label: "Motivisan", workMin: 50, breakMin: 10 },
  stres: { label: "Pod stresom", workMin: 25, breakMin: 5 },
};

/** Lokalni MP4 fajlovi u images/ (preuzeti video, ne YouTube) */
const VIBE_VIDEOS = {
  motivisan: "images/leopard.mp4",
  stres: "images/koala.mp4",
};

/** @type {{ id: string, category: string, title: string, desc: string, img: string, href: string }[]} */
const CONTENT_CARDS = [
  {
    id: "c1",
    category: "fokus",
    title: "Jedna stvar, jedan ekran",
    desc: "Smanji prekide: zatvori tabove koje ne trebaš sljedećih 25–50 minuta.",
    img: IMG.fokus,
    href: "https://todoist.com/productivity-methods/pomodoro-technique",
  },
  {
    id: "c2",
    category: "pomodoro",
    title: "Planiraj blok, ne dan",
    desc: "Zapiši 3 ishoda za naredni blok. To smanjuje anksioznost oko 'svega odjednom'.",
    img: IMG.pomodoro,
    href: "https://www.youtube.com/results?search_query=pomodoro+study+with+me",
  },
  {
    id: "c3",
    category: "stres",
    title: "Disanje kao 'prekidač'",
    desc: "Kad osjetiš zagušenje — 4 sekunde udah, 6 sekundi izdah. Ponovi 3 puta.",
    img: IMG.disanje,
    href: "https://www.healthline.com/health/breathing-exercise",
  },
  {
    id: "c4",
    category: "zdravlje",
    title: "Mikro-pauza za tijelo",
    desc: "Svakih 25 min: ramena, vrat, šaka. Kratko = održivo.",
    img: IMG.zdravlje,
    href: "https://www.youtube.com/results?search_query=desk+stretch+5+minutes",
  },
  {
    id: "c5",
    category: "alati",
    title: "Telefon u 'drugi prostor'",
    desc: "Stavi telefon van dosega. Najjeftiniji boost fokusa.",
    img: IMG.alati,
    href: "https://www.bbc.com/worklife/article/20200121-the-truth-about-phone-distraction",
  },
  {
    id: "c6",
    category: "fokus",
    title: "Učenje aktivno, ne pasivno",
    desc: "Nakon čitanja: 2 pitanja sama sebi ili mini sažetak u 3 rečenice.",
    img: IMG.aktivno,
    href: "https://retrievalpractice.org/",
  },
];

/** Blog članci za sadrzaj.html (fullscreen overlay) */
const BLOG_ARTICLES = {
  pomodoro: {
    slug: "pomodoro",
    title: "Pomodoro bez stresa: kako ga prilagoditi ispitu",
    hero: IMG.blogPomodoro,
    html: `
      <p>Pomodoro je alat, ne religija. Ako si pod pritiskom, kraći blokovi pomažu da kreneš.</p>
      <h2>Šta radimo u motivisanom modu?</h2>
      <p>Duži fokus (npr. 50 min) ima smisla kad već znaš šta radiš i treba ti duboki rad.</p>
      <ul>
        <li>Jedan jasan ishod za blok</li>
        <li>Telefon van stola</li>
        <li>Pauza = kretanje, ne scroll</li>
      </ul>
      <h2>Šta radimo u stres modu?</h2>
      <p>Kraći blokovi smanjuju otpor početku. Cilj je <strong>uglavi se u tok</strong>, ne savršenstvo.</p>
      <p>Slični resursi:</p>
      <ul>
        <li><a href="https://todoist.com/productivity-methods/pomodoro-technique" target="_blank" rel="noopener noreferrer">Todoist — Pomodoro metoda</a></li>
        <li><a href="https://www.youtube.com/results?search_query=pomodoro+25+5" target="_blank" rel="noopener noreferrer">YouTube: 25/5 sesije</a></li>
      </ul>
    `,
  },
  stres: {
    slug: "stres",
    title: "Stres pri učenju: zašto mozak 'puca' i šta pomaže",
    hero: IMG.blogStres,
    html: `
      <p>Kratkotrajni stres može fokusirati, ali dugotrajni pritisak smanjuje radnu memoriju — zato se čini da 'ništa ne ulazi'.</p>
      <h2>Brze strategije</h2>
      <ol>
        <li>Smanji zadatak na 2 minute početka</li>
        <li>Jedan izvor informacija u jednom trenutku</li>
        <li>Disanje + voda prije ponovnog ulaska u blok</li>
      </ol>
      <p>Više o disanju:</p>
      <ul>
        <li><a href="https://www.healthline.com/health/breathing-exercise" target="_blank" rel="noopener noreferrer">Healthline — vježbe disanja</a></li>
      </ul>
    `,
  },
  spavanje: {
    slug: "spavanje",
    title: "San, pamćenje i učenje: mini vodič za studente",
    hero: IMG.blogSan,
    html: `
      <p>San konsoliduje ono što učiš. 'Izvlačenje iz glave' (aktivno ponavljanje) + san = bolje pamćenje.</p>
      <h2>Praktično</h2>
      <ul>
        <li>Izbjegavaj 'all-nighter' ako možeš — zamijeni ga kratkim blokovima</li>
        <li>Pred spavanje: 5 minuta sažetka ključnih pojmova</li>
      </ul>
      <p><a href="https://www.sleepfoundation.org/" target="_blank" rel="noopener noreferrer">Sleep Foundation</a> — opšti savjeti o snu.</p>
    `,
  },
};

function $(id) {
  return document.getElementById(id);
}

function safeText(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

// Ovu funkciju escapeHtml sam napisao/la uz pomoć Claude-a.
// Razumijem da: svaki replace() radi jednu zamjenu — & mora biti prvi
// jer se inače dvostruko escapeuje. < i > sprečavaju injekciju HTML tagova,
// a &quot; štiti atribute unutar navodnika. Bez ovoga bi zlonamjerni
// tekst iz korisničkog unosa mogao izvršiti HTML/JS kod u pretraživaču (XSS).
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nowDateString() {
  return new Date().toLocaleString("bs-BA", { dateStyle: "medium", timeStyle: "short" });
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function newId() {
  return `sf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatWorkDuration(totalSec) {
  const sec = Math.max(0, Math.floor(totalSec));
  if (sec === 0) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s} s`;
  if (s === 0) return `${m} min`;
  return `${m} min ${s} s`;
}

/* ---------- Drawer ---------- */
function openDrawer() {
  const drawer = $("drawer");
  const backdrop = $("backdrop");
  if (!drawer || !backdrop) return;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function closeDrawer() {
  const drawer = $("drawer");
  const backdrop = $("backdrop");
  if (!drawer || !backdrop) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
}

/* ---------- Tamni / svijetli mod (LocalStorage + data-theme) ---------- */
/* Motivisan → light, Pod stresom → dark (setMode); ručni toggle: theme-toggle */
function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const t = theme === "dark" ? "dark" : "light";
  localStorage.setItem(STORAGE_KEYS.theme, t);
  document.documentElement.setAttribute("data-theme", t);
  const btn = $("theme-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    btn.textContent = t === "dark" ? "☀️ Svijetli" : "🌙 Tamni";
    btn.title = t === "dark" ? "Prebaci na svijetli mod" : "Prebaci na tamni mod";
  }
}

function toggleTheme() {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}

function wireThemeToggle() {
  $("theme-toggle")?.addEventListener("click", toggleTheme);
}

/* ---------- Mod motivisan / stres (timer + video) ---------- */
function updateModeButtons(mode) {
  const m = mode === "stres" ? "stres" : "motivisan";
  $("mode-motivisan")?.classList.toggle("mode-btn--active", m === "motivisan");
  $("mode-stres")?.classList.toggle("mode-btn--active", m === "stres");
}

function setMode(mode) {
  const m = MODES[mode] ? mode : "motivisan";
  localStorage.setItem(STORAGE_KEYS.mode, m);
  document.body.classList.remove("mode-motivisan", "mode-stres");
  document.body.classList.add(m === "stres" ? "mode-stres" : "mode-motivisan");
  applyTheme(m === "stres" ? "dark" : "light");
  updateModeButtons(m);
  const badge = $("mode-badge");
  if (badge) badge.textContent = MODES[m].label;
  const timerSub = $("timer-sub");
  if (timerSub) {
    timerSub.textContent =
      m === "motivisan"
        ? "Motivisan mod: 50/10 (duže sesije)"
        : "Stres mod: 25/5 (kraće sesije)";
  }
  if ($("vibe-video-wrap")) mountVibeVideo(m, false);
  timer.applyMode(m);
}

function getMode() {
  return localStorage.getItem(STORAGE_KEYS.mode) || "motivisan";
}

let vibeVideoMode = "motivisan";

/* HTML5 <video> iz images/*.mp4 — reprodukcija u stranici, bez YouTube iframea */
function mountVibeVideo(mode, unmuted = false) {
  const wrap = $("vibe-video-wrap");
  if (!wrap) return;

  vibeVideoMode = MODES[mode] ? mode : "motivisan";
  const src = VIBE_VIDEOS[vibeVideoMode] || VIBE_VIDEOS.motivisan;
  const label =
    vibeVideoMode === "stres"
      ? "Opustajući video — koala (lokalni MP4)"
      : "Motivacioni video — leopard (lokalni MP4)";

  wrap.classList.remove("video-wrap--idle");
  wrap.classList.add("video-wrap--playing");

  wrap.innerHTML = `
    <video
      id="vibe-video"
      class="vibe-video__player"
      src="${escapeHtml(src)}"
      title="${escapeHtml(label)}"
      autoplay
      loop
      playsinline
      ${unmuted ? "" : "muted"}
    ></video>
    <button type="button" class="video-unmute ghost-btn" id="video-unmute">
      ${unmuted ? "🔇 Mutiraj" : "🔊 Uključi zvuk"}
    </button>
  `;

  const vid = $("vibe-video");
  if (vid) {
    vid.muted = !unmuted;
    vid.play().catch(() => {});
  }

  $("video-unmute")?.addEventListener("click", () => {
    const v = $("vibe-video");
    if (v) {
      v.muted = !v.muted;
      const btn = $("video-unmute");
      if (btn) btn.textContent = v.muted ? "🔊 Uključi zvuk" : "🔇 Mutiraj";
      if (!v.muted) v.play().catch(() => {});
      return;
    }
    mountVibeVideo(vibeVideoMode, !unmuted);
  });
}

/* ---------- Name ---------- */
function setName(name) {
  const n = safeText(name) || "Student";
  localStorage.setItem(STORAGE_KEYS.name, n);
  const span = $("prikaz-imena");
  if (span) span.textContent = n;
  if ($("motivation-card")) motivation.setName(n);
}

function getName() {
  return localStorage.getItem(STORAGE_KEYS.name) || "Student";
}

/* ---------- Motivation ---------- */
// Ovaj modul za motivirajuće kartice sam napisala uz pomoć Copilot-a.
// Razumijem da: IIFE (Immediately Invoked Function Expression) — funkcija koja
// se odmah poziva i vraća objekt s javnim metodama — je obrazac koji se koristi
// da se varijable (idx, name, rotateTimer, templates) "sakriju" unutar closure-a
// i nisu dostupne ostatku koda (enkapsulacija bez klasa).
// templates je niz arrow funkcija koje primaju ime i vraćaju objekt s tekstom kartice.
// Svaki template je zaseban tako da se lako dodaju novi bez mijenjanja logike rotacije.
const motivation = (() => {
  let idx = 0;
  let name = "Student";
  let rotateTimer = null;

  const templates = [
    (n) => ({ emoji: "🐆", title: `Hajde, ${n}!`, body: "Jedan mali korak danas je velika navika sutra." }),
    (n) => ({ emoji: "⏱️", title: "Pravilo 2 minute", body: `${n}, samo počni 2 minute. Najteži dio je start.` }),
    () => ({ emoji: "🌿", title: "Mikro-pauza", body: "Udahni. Spusti ramena. Nastavi mirno — brzina nije cilj." }),
    (n) => ({ emoji: "🎯", title: "Fokus blok", body: `${n}, jedna stvar. Jedan ekran. Jedan tab ako može.` }),
    () => ({ emoji: "🎁", title: "Nagrada", body: "Poslije bloka — mala nagrada koja te ne 'ukrade' ostatku dana." }),
    (n) => ({ emoji: "📌", title: "Mini-cilj", body: `${n}, napiši jednu rečenicu: šta znači 'uspjeh' u ovom bloku?` }),
    () => ({ emoji: "💧", title: "Voda = pažnja", body: "Dehidracija pravi umor koji liči na demotivaciju." }),
    (n) => ({ emoji: "🧠", title: "Aktivno učenje", body: `${n}, zatvori knjigu i reci naglas 3 pojma koja pamtiš.` }),
    () => ({ emoji: "🛌", title: "San je upgrade", body: "Kratak san ili rana krevet — bolje nego 'herojski' noćni maraton." }),
    (n) => ({ emoji: "🤝", title: "Podrška", body: `${n}, traži pomoć kad zapneš 20 minuta — to je zrelo, ne slabost.` }),
    () => ({ emoji: "📵", title: "Režim aviona", body: "15 minuta bez notifikacija = često više nego još jedan sat 'prolaska'." }),
    (n) => ({ emoji: "✍️", title: "Brain dump", body: `${n}, isprazni glavu na papir 3 min — onda biraj jednu stvar.` }),
    () => ({ emoji: "🚶", title: "Hodaj 5 min", body: "Kratko kretanje resetuje pažnju bolje nego još jedan energetski napitak." }),
    (n) => ({ emoji: "🔁", title: "Ponovi glasno", body: `${n}, objasni temu sebi kao da učiš mlađeg brata/sestru.` }),
    () => ({ emoji: "🧩", title: "Rastavi zadatak", body: "Veliki zadatak = lista od 3–5 mikro koraka. Čekiraj prvi." }),
    (n) => ({ emoji: "⏳", title: "Deadline šok", body: `${n}, šta je najgori realan ishod za 25 min? Radi to.` }),
    () => ({ emoji: "🎧", title: "Ista playlista", body: "Jedna instrumentalna lista smanjuje odluke — manje odlaganja." }),
    (n) => ({ emoji: "📵", title: "Jedan kanal", body: `${n}, jedan chat, jedan mail — ne sve odjednom.` }),
    () => ({ emoji: "🌅", title: "Jutarnji blok", body: "Prvi blok dana je za najteže — mozak je svježiji." }),
    (n) => ({ emoji: "📝", title: "Sažetak u 3 rečenice", body: `${n}, nakon bloka napiši 3 rečenice — to je revizija.` }),
    () => ({ emoji: "🫖", title: "Pauza bez ekrana", body: "Pauza = čaj, prozor, istezanje. Ne feed." }),
    (n) => ({ emoji: "💡", title: "Pitanje 'zašto'", body: `${n}, zašto ovo učiš? Jedna rečenica smisla pomaže fokusu.` }),
    () => ({ emoji: "🔕", title: "Ne savršenstvo", body: "Sesija ne mora biti savršena da bi bila korisna." }),
    (n) => ({ emoji: "🏁", title: "Završi na 80%", body: `${n}, 80% završeno danas > 0% planirano za sutra.` }),
    () => ({ emoji: "🧘", title: "Ramena dolje", body: "Spusti ramena. Čeljust opusti. Nastavi." }),
    (n) => ({ emoji: "📚", title: "Jedna knjiga", body: `${n}, jedan izvor za ovaj blok — manje konfuzije.` }),
    () => ({ emoji: "🌙", title: "Večer bez krivnje", body: "Ako si umoran, kraći blok i raniji kraj su pobjeda." }),
    (n) => ({ emoji: "🦁", title: "Hrabrost", body: `${n}, početak je hrabar čin — ne čekaj 'savršeno raspoloženje'.` }),
  ];

  function cardData(i) {
    const fn = templates[i % templates.length];
    return fn(name);
  }

  function render() {
    const el = $("motivation-card");
    if (!el) return;
    const data = cardData(idx);
    el.innerHTML = `
      <div class="motivation-emoji" aria-hidden="true">${escapeHtml(data.emoji)}</div>
      <div class="motivation-title">${escapeHtml(data.title)}</div>
      <div class="motivation-body">${escapeHtml(data.body)}</div>
    `;
  }

  // dodavanje CSS klase "fading" pokreće CSS transition/animation
  // definisanu u stilovima. setTimeout čeka 220ms (trajanje animacije) pa onda
  // mijenja idx i poziva render() — tek tada je novi tekst vidljiv, bez trzaja.
  // Dvostruki modulo ((nextIdx % len) + len) % len) rješava negativne indekse
  // kad korisnik klikne "nazad" sa idx=0 — bez toga bi dobili -1.
  function transitionTo(nextIdx) {
    const el = $("motivation-card");
    if (!el) return;
    el.classList.add("fading");
    window.setTimeout(() => {
      idx = ((nextIdx % templates.length) + templates.length) % templates.length;
      render();
      el.classList.remove("fading");
    }, 220);
  }

  function next() {
    transitionTo(idx + 1);
  }
  function prev() {
    transitionTo(idx - 1);
  }

  // startAuto/stopAuto koristim setInterval koji poziva next() svakih 7 sekundi.
  // stopAuto se uvijek poziva prije nego se novi interval postavi —
  // bez toga bi se intervali akumulirali i kartice bi se izmjenjivale sve brže.
  function startAuto() {
    stopAuto();
    rotateTimer = window.setInterval(() => next(), 7000);
  }

  function stopAuto() {
    if (rotateTimer) window.clearInterval(rotateTimer);
    rotateTimer = null;
  }

  function setNameNew(newName) {
    name = safeText(newName) || "Student";
    render();
  }

  return { render, next, prev, startAuto, stopAuto, setName: setNameNew };
})();

/* ---------- History ---------- */
function normalizeHistory(raw) {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((row) => ({
    id: row.id || newId(),
    date: row.date || "—",
    durationLabel: row.durationLabel || (row.totalMin != null ? `${row.totalMin} min` : "—"),
    modeLabel: row.modeLabel || "—",
    name: row.name || "Student",
  }));
}

function getHistory() {
  return normalizeHistory(loadJSON(STORAGE_KEYS.history, []));
}

function saveHistory(history) {
  saveJSON(STORAGE_KEYS.history, history.slice(0, 80));
}

function addHistoryRow(row) {
  const history = getHistory();
  history.unshift({
    id: row.id || newId(),
    date: row.date || nowDateString(),
    durationLabel: row.durationLabel || "—",
    modeLabel: row.modeLabel || "—",
    name: row.name || getName(),
  });
  saveHistory(history);
  renderHistoryTable();
  renderHistoryPageTable();
  updateSessionCounter();
}

function deleteHistoryRow(id) {
  const history = getHistory().filter((r) => r.id !== id);
  saveHistory(history);
  renderHistoryTable();
  renderHistoryPageTable();
  updateSessionCounter();
}

function clearHistory() {
  saveJSON(STORAGE_KEYS.history, []);
  renderHistoryTable();
  renderHistoryPageTable();
  updateSessionCounter();
}

function renderHistoryTable() {
  const tbody = $("history-tbody");
  if (!tbody) return;
  const history = getHistory();
  if (!history.length) {
    tbody.innerHTML = `<tr><td colspan="4">Još nema sesija.</td></tr>`;
    return;
  }
  tbody.innerHTML = history
    .map(
      (h) => `
      <tr>
        <td>${escapeHtml(h.date)}</td>
        <td>${escapeHtml(h.durationLabel)}</td>
        <td>${escapeHtml(h.modeLabel)}</td>
        <td><button type="button" class="btn-icon" data-del="${escapeHtml(h.id)}">Obriši</button></td>
      </tr>
    `,
    )
    .join("");
  tbody.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => deleteHistoryRow(btn.getAttribute("data-del")));
  });
}

function renderHistoryPageTable() {
  const tbody = $("history-tbody-page");
  if (!tbody) return;
  const history = getHistory();
  if (!history.length) {
    tbody.innerHTML = `<tr><td colspan="4">Još nema sesija.</td></tr>`;
    return;
  }
  tbody.innerHTML = history
    .map(
      (h) => `
      <tr>
        <td>${escapeHtml(h.date)}</td>
        <td>${escapeHtml(h.durationLabel)}</td>
        <td>${escapeHtml(h.modeLabel)}</td>
        <td>${escapeHtml(h.name)}</td>
      </tr>
    `,
    )
    .join("");
}

/* ---------- Pomodoro ---------- */
// IIFE obrazac (isti kao motivation) omogućava da varijable stanja
// (interval, mode, phase, remainingSec, itd.) budu privatne — ne mogu se slučajno
// promijeniti izvana. setInterval poziva tick() svaku sekundu i oduzima 1 od
// remainingSec. Kad remainingSec dostigne 0, automatski se mijenja faza (work→break
// ili break→work) i loguje završena sesija u historiju.
const timer = (() => {
  let interval = null;
  let mode = "motivisan";
  let phase = "work";
  let remainingSec = 25 * 60;
  let totalSecThisSession = 0;
  let running = false;
  let initialPhaseSec = remainingSec;

  function phaseDurationSec(m, p) {
    const cfg = MODES[m] || MODES.motivisan;
    return (p === "break" ? cfg.breakMin : cfg.workMin) * 60;
  }

  function setPhase(p) {
    phase = p;
    remainingSec = phaseDurationSec(mode, phase);
    initialPhaseSec = remainingSec;
    totalSecThisSession = 0;
    updateUI();
  }

  function applyMode(newMode) {
    mode = MODES[newMode] ? newMode : "motivisan";
    if (!running) {
      phase = "work";
      remainingSec = phaseDurationSec(mode, phase);
      initialPhaseSec = remainingSec;
      totalSecThisSession = 0;
      updateUI();
    }
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // progress bar koristi omjer (initialPhaseSec - remainingSec) / initialPhaseSec
  // koji daje broj između 0 i 1 (postotak provedenog vremena).
  // Math.max/min osiguravaju da vrijednost ostane između 0% i 100%
  // bez obzira na eventualne greške zaokruživanja.
  function updateUI() {
    const display = $("timer-display");
    const bar = $("progress-bar");
    if (display) display.textContent = fmt(remainingSec);
    if (bar) {
      const done = initialPhaseSec ? (initialPhaseSec - remainingSec) / initialPhaseSec : 0;
      bar.style.width = `${Math.max(0, Math.min(1, done)) * 100}%`;
    }
  }

  function logCompletedWorkBlock() {
    const label = formatWorkDuration(totalSecThisSession);
    if (!label) return;
    addHistoryRow({
      date: nowDateString(),
      durationLabel: label,
      mode: mode,
      modeLabel: `${MODES[mode].label} · fokus`,
      name: getName(),
    });
  }

  function tick() {
    if (remainingSec <= 0) return;
    remainingSec -= 1;
    if (phase === "work") totalSecThisSession += 1;
    updateUI();

    if (remainingSec <= 0) {
      if (phase === "work") logCompletedWorkBlock();
      setPhase(phase === "work" ? "break" : "work");
    }
  }

  function start() {
    if (running) return;
    running = true;
    interval = window.setInterval(tick, 1000);
  }

  function pause() {
    running = false;
    if (interval) window.clearInterval(interval);
    interval = null;
  }

  function reset() {
    pause();
    const partial = phase === "work" ? totalSecThisSession : 0;
    const partialLabel = formatWorkDuration(partial);
    if (partialLabel) {
      addHistoryRow({
        date: nowDateString(),
        durationLabel: `${partialLabel} (prekid)`,
        mode,
        modeLabel: `${MODES[mode].label} · reset`,
        name: getName(),
      });
    }
    phase = "work";
    remainingSec = phaseDurationSec(mode, phase);
    initialPhaseSec = remainingSec;
    totalSecThisSession = 0;
    updateUI();
  }

  function init(initialMode) {
    mode = MODES[initialMode] ? initialMode : "motivisan";
    phase = "work";
    remainingSec = phaseDurationSec(mode, phase);
    initialPhaseSec = remainingSec;
    totalSecThisSession = 0;
    updateUI();
  }

  return { init, start, pause, reset, applyMode };
})();

/* ---------- Breathing ---------- */
// Ovaj modul za vođeno disanje sam napisao/la uz pomoć Claude-a.
// Razumijem da: Web Audio API (AudioContext, OscillatorNode, GainNode) omogućava
// generisanje zvuka direktno u pretraživaču bez audio fajlova.
// OscillatorNode generiše sinusni val (type:"sine") na zadanoj frekvenciji.
// GainNode kontroliše jačinu — linearRampToValueAtTime stvara postepeni
// fade-in/out umjesto naglih skokova koji bi zvučali kao "klik".
// ensureAudio() se poziva lazy (tek pri prvoj interakciji) jer pretraživači
// blokiraju AudioContext koji je kreiran bez korisničke interakcije.
const breathing = (() => {
  let running = false;
  let interval = null;
  let phase = "inhale";
  let remaining = 4;
  let cyclesLeft = 6;
  let audioCtx = null;
  let osc = null;
  let gain = null;

  function ensureAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 196;
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
  }

  function setTone(on) {
    try {
      ensureAudio();
      const t = audioCtx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(on ? 0.04 : 0.0001, t + 0.25);
      if (on) osc.frequency.setValueAtTime(phase === "inhale" ? 220 : 174, t);
    } catch {
      /* ignore */
    }
  }

  function updateUI() {
    const text = $("breath-text");
    const t = $("breath-timer");
    if (text) text.textContent = phase === "inhale" ? "Udahni" : "Izdahni";
    if (t) t.textContent = String(remaining);
  }

  function step() {
    if (!running) return;
    remaining -= 1;
    if (remaining <= 0) {
      if (phase === "inhale") {
        phase = "exhale";
        remaining = 6;
      } else {
        phase = "inhale";
        remaining = 4;
        cyclesLeft -= 1;
        if (cyclesLeft <= 0) {
          stop();
          return;
        }
      }
      setTone(true);
    }
    updateUI();
  }

  function open() {
    const modal = $("breath-modal");
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
  }

  function close() {
    stop();
    const modal = $("breath-modal");
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  function start() {
    if (running) return;
    running = true;
    phase = "inhale";
    remaining = 4;
    cyclesLeft = 6;
    updateUI();
    setTone(true);
    interval = window.setInterval(step, 1000);
  }

  function stop() {
    running = false;
    if (interval) window.clearInterval(interval);
    interval = null;
    setTone(false);
  }

  return { open, close, start, stop };
})();

/* ---------- Bookmarkovi (LocalStorage + hash URL) ---------- */
// svaki bookmark sprema href koji se sastoji od naziva HTML fajla
// i hash fragmenta (npr. "sadrzaj.html#tabela"). window.location.pathname.split("/").pop()
// daje samo ime fajla bez putanje (npr. "index.html"), a window.location.hash
// dodaje sekciju na stranici ako postoji. Lista se čuva u localStorage kao JSON niz
// i limitirana je na 30 stavki (slice(0,30)) da ne pretrpa storage.
// Logika gotoLastBookmark razlikuje tri slučaja:
//   1. Bookmark ima hash → skrolaj na sekciju ako si na istoj stranici
//   2. Bookmark je druga stranica → navigiraj na nju
//   3. Bookmark nema hash → samo otvori stranicu
function getBookmarks() {
  const arr = loadJSON(STORAGE_KEYS.bookmarks, []);
  return Array.isArray(arr) ? arr : [];
}

function saveBookmarks(list) {
  saveJSON(STORAGE_KEYS.bookmarks, list.slice(0, 30));
}

function currentBookmarkHref() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const hash = window.location.hash || "";
  return `${path}${hash}`;
}

function saveBookmarkHere() {
  const title = safeText(document.title) || "Bookmark";
  const href = currentBookmarkHref();
  const list = getBookmarks();
  const item = { id: newId(), title, href, created: nowDateString() };
  // filter() uklanja stari bookmark za isti href prije dodavanja novog —
  // tako nema duplikata, a novi uvijek ide na vrh liste (unshift/spread).
  const next = [item, ...list.filter((b) => b.href !== href)];
  saveBookmarks(next);
  renderBookmarkList();
  const hint = $("bookmark-hint");
  if (hint) {
    hint.hidden = false;
    hint.textContent = `Sačuvano: ${href}`;
    window.setTimeout(() => (hint.hidden = true), 3200);
  }
}

function gotoLastBookmark() {
  const list = getBookmarks();
  if (!list.length) return;
  const target = list[0].href;
  if (target.includes("#")) {
    const [p, h] = target.split("#");
    if (p && p !== (window.location.pathname.split("/").pop() || "")) {
      window.location.href = target;
      return;
    }
    window.location.hash = h ? `#${h}` : "";
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    return;
  }
  window.location.href = target;
}

function deleteBookmark(id) {
  saveBookmarks(getBookmarks().filter((b) => b.id !== id));
  renderBookmarkList();
}

function renderBookmarkList() {
  const ul = $("bookmark-list");
  if (!ul) return;
  const list = getBookmarks();
  if (!list.length) {
    ul.innerHTML = `<li class="hint" style="list-style:none;margin:0;">Nema bookmarkova. Klikni „Sačuvaj ovdje".</li>`;
    return;
  }
  // data-bm-del atribut sprema ID bookmarka direktno na dugme —
  // u event listeneru čitamo ga s getAttribute() umjesto closure-a
  // jer innerHTML zamjenjuje cijeli sadržaj i stari closurei bi bili izgubljeni.
  ul.innerHTML = list
    .map(
      (b) => `
    <li>
      <a href="${escapeHtml(b.href)}">${escapeHtml(b.title)}</a>
      <button type="button" class="btn-icon" data-bm-del="${escapeHtml(b.id)}">✕</button>
    </li>
  `,
    )
    .join("");
  ul.querySelectorAll("[data-bm-del]").forEach((btn) => {
    btn.addEventListener("click", () => deleteBookmark(btn.getAttribute("data-bm-del")));
  });
}

/* ---------- Todo ---------- */
function getTodos() {
  const arr = loadJSON(STORAGE_KEYS.todos, []);
  return Array.isArray(arr) ? arr : [];
}

function saveTodos(list) {
  saveJSON(STORAGE_KEYS.todos, list.slice(0, 100));
}

function renderTodos() {
  const ul = $("todo-list");
  if (!ul) return;
  const items = getTodos();
  if (!items.length) {
    ul.innerHTML = `<li class="hint" style="list-style:none;padding:8px 0;">Dodaj prvi zadatak.</li>`;
    return;
  }
  ul.innerHTML = items
    .map((t) => {
      const done = !!t.done;
      return `
      <li class="todo-item">
        <button type="button" class="todo-check ${done ? "todo-check--done" : ""}" data-todo-toggle="${escapeHtml(t.id)}" aria-pressed="${done}">
          ${done ? "✓" : ""}
        </button>
        <span class="todo-text ${done ? "todo-text--done" : ""}">${escapeHtml(t.text)}</span>
        <button type="button" class="todo-del" data-todo-del="${escapeHtml(t.id)}" aria-label="Obriši zadatak">×</button>
      </li>`;
    })
    .join("");

  ul.querySelectorAll("[data-todo-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-todo-toggle");
      // map() vraća novi niz — original se ne mijenja (immutable update).
      // Za svaki element: ako mu id odgovara, vraća kopiju {...x} s done: !x.done,
      // inače vraća original x. Ovo je standardni React/funkcionalni obrazac.
      const next = getTodos().map((x) => (x.id === id ? { ...x, done: !x.done } : x));
      saveTodos(next);
      renderTodos();
    });
  });
  ul.querySelectorAll("[data-todo-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-todo-del");
      saveTodos(getTodos().filter((x) => x.id !== id));
      renderTodos();
    });
  });
}

function addTodo(text) {
  const t = safeText(text);
  if (!t) return;
  saveTodos([{ id: newId(), text: t, done: false }, ...getTodos()]);
  renderTodos();
}

/* ---------- Filtriranje kartica (bez reloada) — index.html #content-cards ---------- */
let activeFilter = "sve";

function renderContentCards() {
  const root = $("content-cards");
  if (!root) return;
  const filtered =
    activeFilter === "sve" ? CONTENT_CARDS : CONTENT_CARDS.filter((c) => c.category === activeFilter);
  if (!filtered.length) {
    root.innerHTML = `<p class="hint">Nema kartica za ovaj filter.</p>`;
    return;
  }
  root.innerHTML = filtered
    .map((c) => {
      const tag =
        { fokus: "Fokus", stres: "Stres", pomodoro: "Pomodoro", zdravlje: "Zdravlje", alati: "Alati" }[c.category] ||
        c.category;
      return `
      <article class="content-card" data-category="${escapeHtml(c.category)}">
        <img class="content-card__img" src="${escapeHtml(c.img)}" alt="${escapeHtml(c.title)}" loading="lazy" width="640" height="400" />
        <div class="content-card__body">
          <div class="content-card__tag">${escapeHtml(tag)}</div>
          <h3 class="content-card__title">${escapeHtml(c.title)}</h3>
          <p class="content-card__desc">${escapeHtml(c.desc)}</p>
          <a class="content-card__link" href="${escapeHtml(c.href)}" target="_blank" rel="noopener noreferrer">Pročitaj više →</a>
        </div>
      </article>`;
    })
    .join("");
}

function wireFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      activeFilter = btn.getAttribute("data-filter") || "sve";
      renderContentCards();
    });
  });
}

/* ---------- Blog overlay (sadrzaj.html) ---------- */
function closeArticleOverlay() {
  const ov = $("article-overlay");
  if (!ov) return;
  ov.hidden = true;
  ov.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openArticleOverlay(slug) {
  const art = BLOG_ARTICLES[slug];
  if (!art) return;
  const ov = $("article-overlay");
  const titleEl = $("article-overlay-title");
  const heroEl = $("article-overlay-hero");
  const bodyEl = $("article-overlay-body");
  if (!ov || !titleEl || !heroEl || !bodyEl) return;
  titleEl.textContent = art.title;
  heroEl.src = art.hero;
  heroEl.alt = art.title;
  // art.html je trusted sadržaj definisan u ovoj skripti (BLOG_ARTICLES konstanta),
  // a ne korisnički unos — zato je innerHTML ovdje siguran.
  bodyEl.innerHTML = art.html;
  ov.hidden = false;
  ov.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  ov.scrollTop = 0;
}

function wireBlogListing() {
  document.querySelectorAll("[data-open-article]").forEach((btn) => {
    btn.addEventListener("click", () => openArticleOverlay(btn.getAttribute("data-open-article")));
  });
  $("article-overlay-close")?.addEventListener("click", closeArticleOverlay);
  $("article-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "article-overlay") closeArticleOverlay();
  });
}

/* ---------- Brojač sesija (interaktivna statistika) ---------- */
function updateSessionCounter() {
  const el = $("session-counter");
  if (!el) return;
  const n = getHistory().length;
  el.textContent = String(n);
  // stat-bump klasa pokreće kratku CSS animaciju (npr. scale/bounce)
  // i uklanja se nakon 400ms — dovoljno za jednu animaciju bez akumulacije klasa.
  el.classList.add("stat-bump");
  window.setTimeout(() => el.classList.remove("stat-bump"), 400);
}

/* ---------- Smooth scroll za anchor linkove ---------- */
function wireSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    a.addEventListener("click", (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.pushState) history.pushState(null, "", href);
    });
  });
}

/* ---------- Responzivni image map ---------- */
// HTML <area> koordinate su u pikselima i ne skaliraju automatski
// kad se slika smanji/poveća (npr. na mobitelu). Rješenje je čuvanje koordinata
// u relativnim vrijednostima (0.0 do 1.0) u IMAGE_MAP_ZONES nizu, a pri svakom
// resize eventu syncImageMapCoords() preračunava stvarne piksel-koordinate
// množenjem s trenutnom širinom/visinom slike (img.clientWidth/clientHeight).
// Isti relativni podaci se koriste i za pozicioniranje CSS overlay dugmadi
// (imagemap-hotspot) koja su pristupačnija od samih <area> elemenata.

const IMAGE_MAP_ZONES = [
  {
    id: "zona-burnout",
    shape: "rect",
    rel: [0.02, 0.03, 0.48, 0.42],
    label: "Lijevi oblak — opasnost burnouta",
    panel: "burnout",
  },
  {
    id: "zona-odmor",
    shape: "rect",
    rel: [0.52, 0.03, 0.98, 0.44],
    label: "Desni oblak — važnost odmora i sna",
    panel: "odmor",
  },
  {
    id: "zona-osoba",
    shape: "rect",
    rel: [0.22, 0.38, 0.58, 0.95],
    label: "Osoba — vježbe disanja",
    panel: "disanje",
  },
  {
    id: "zona-racunar",
    shape: "rect",
    rel: [0.58, 0.52, 0.95, 0.92],
    label: "Laptop — tehnike učenja",
    panel: "tehnike",
  },
];

function syncImageMapCoords() {
  const img = $("imagemap-img");
  const map = $("student-map");
  if (!img || !map) return;
  const w = img.clientWidth;
  const h = img.clientHeight;
  const natW = img.naturalWidth || 1200;
  const natH = img.naturalHeight || 800;
  const scaleX = w / natW;
  const scaleY = h / natH;
  map.querySelectorAll("area[data-zone]").forEach((area, i) => {
    const z = IMAGE_MAP_ZONES[i];
    if (!z) return;
    const [x1, y1, x2, y2] = z.rel;
    const coords = [
      Math.round(x1 * natW * scaleX),
      Math.round(y1 * natH * scaleY),
      Math.round(x2 * natW * scaleX),
      Math.round(y2 * natH * scaleY),
    ];
    area.coords = coords.join(",");
  });
  document.querySelectorAll(".imagemap-hotspot").forEach((btn, i) => {
    const z = IMAGE_MAP_ZONES[i];
    if (!z) return;
    const [x1, y1, x2, y2] = z.rel;
    btn.style.left = `${x1 * 100}%`;
    btn.style.top = `${y1 * 100}%`;
    btn.style.width = `${(x2 - x1) * 100}%`;
    btn.style.height = `${(y2 - y1) * 100}%`;
  });
}

function showImagemapPanel(kind) {
  const panel = $("imagemap-panel");
  const title = $("imagemap-panel-title");
  const body = $("imagemap-panel-body");
  if (!panel || !title || !body) return;
  if (kind === "burnout") {
    title.textContent = "Burnout: kad mozak ‘puca’";
    body.innerHTML = `
      <p>Lijevi oblak simbolizira preopterećenje: pucanje mozga, haos, pritisak vremena. To nije ‘lijenost’ — to je signal da tijelo i um traže pauzu.</p>
      <h2>Znakovi da paziš</h2>
      <ul>
        <li>Stalni umor iako ‘ništa ne radiš’</li>
        <li>Teško pamćenje i koncentracija uprkos dugom učenju</li>
        <li>Cinizam, razdražljivost, gubitak motivacije</li>
        <li>Sve izgleda hitno — nema ‘dovoljno’ vremena</li>
      </ul>
      <h2>Šta pomaže</h2>
      <ul>
        <li>Smanji scope: jedan mikro-zadatak, ne cijeli dan</li>
        <li>Kratke pauze + san (vidi desni oblak)</li>
        <li>Razgovor s nekim — profesor, kolega, savjetnik</li>
      </ul>
      <p><a href="https://theliven.com/tests/burnout-test" target="_blank" rel="noopener noreferrer">WHO — burnout</a></p>
    `;
  } else if (kind === "odmor") {
    title.textContent = "Odmor i san: zašto nisu ‘gubljenje vremena’";
    body.innerHTML = `
      <p>Desni oblak prikazuje zdrave navike: meditacija, hodanje, san, hrana, voda. Bez odmora mozak slabije pamti i uči.</p>
      <h2>Zašto odmor pomaže učenju</h2>
      <ul>
        <li><strong>San</strong> konsoliduje memoriju — ono što učiš noću ‘sjedne’</li>
        <li><strong>Mikro-pauze</strong> (5 min) resetuju pažnju bolje nego scroll</li>
        <li><strong>Kretanje i svjež zrak</strong> smanjuju mentalni ‘zastoj’</li>
        <li><strong>Hidracija i obrok</strong> — mozak troši energiju</li>
      </ul>
      <p>Praktično: nakon svakog Pomodoro bloka ustani, protegni se, popij vodu. Izbjegavaj ‘all-nighter’ ako možeš.</p>
      <p><a href="sadrzaj.html">Članak o snu u blogu</a> · <a href="https://www.sleepfoundation.org/" target="_blank" rel="noopener noreferrer">Sleep Foundation</a></p>
    `;
  } else if (kind === "disanje") {
    title.textContent = "Vježbe disanja";
    body.innerHTML = `
      <p>Kratko disanje smanjuje stres prije učenja. Probajte 4–6 ritam ili Emergency modal na početnoj.</p>
      <ul>
        <li>4 s udah, 6 s izdah (ponoviti 3–6 puta)</li>
        <li><a href="index.html">Emergency disanje na početnoj</a></li>
        <li><a href="https://www.healthline.com/health/breathing-exercise" target="_blank" rel="noopener noreferrer">Healthline — vodič</a></li>
      </ul>
      <button type="button" class="primary-btn" id="imagemap-open-breath">Otvori Emergency disanje</button>
    `;
    $("imagemap-open-breath")?.addEventListener("click", () => {
      panel.hidden = true;
      if (window.location.pathname.endsWith("sadrzaj.html")) {
        window.location.href = "index.html";
        return;
      }
      breathing.open();
    });
  } else if (kind === "tehnike") {
    title.textContent = "Tehnike učenja";
    body.innerHTML = `
      <p>Odaberite jednu tehniku za sljedeći blok — fokus na jedan ishod.</p>
      <ul>
        <li><strong>Pomodoro</strong> — 25/5 ili 50/10 u motivisanom modu</li>
        <li><strong>Aktivno ponavljanje</strong> — 3 pitanja bez materijala</li>
        <li><strong>Jedan ekran</strong> — zatvori nepotrebne tabove</li>
      </ul>
      <p><a href="index.html#pomodoro">Pomodoro timer</a> · <a href="sadrzaj.html#tabela">Tabela tehnika</a></p>
    `;
  } else {
    title.textContent = "Informacija";
    body.innerHTML = `<p>Kliknite zonu na slici za savjet.</p>`;
  }
  panel.hidden = false;
  panel.setAttribute("aria-hidden", "false");
}

function wireResponsiveImageMap() {
  const img = $("imagemap-img");
  if (!img) return;
  const runSync = () => syncImageMapCoords();
  if (img.complete) runSync();
  else img.addEventListener("load", runSync);
  window.addEventListener("resize", runSync);

  document.querySelectorAll(".imagemap-hotspot").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showImagemapPanel(btn.getAttribute("data-panel"));
    });
  });

  const mapEl = $("student-map");
  if (mapEl) {
    mapEl.querySelectorAll("area[data-zone]").forEach((area, i) => {
      area.addEventListener("click", (e) => {
        e.preventDefault();
        const z = IMAGE_MAP_ZONES[i];
        showImagemapPanel(z?.panel || "disanje");
      });
    });
  }

  $("imagemap-panel-close")?.addEventListener("click", () => {
    const panel = $("imagemap-panel");
    if (panel) {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
    }
  });
}

/* ---------- Kontakt forma (validacija samo u JS) ---------- */
// Ove regex patterne za validaciju forme sam pronašao/la uz pomoć Claude-a.
// Razumijem da:
//   CONTACT_EMAIL_RE:
//     ^               — početak stringa
//     [\w.!#$%&'*+/=?^`{|}~-]+  — jedan ili više dozvoljenih znakova ispred @
//                                   (\w = slova, cifre, _, ostali su specijalni znakovi
//                                    koje RFC 5321 dozvoljava u lokalnom dijelu emaila)
//     @               — literal @ koji razdvaja lokalni dio od domene
//     [\w-]+          — ime domene (slova, cifre, crtice)
//     (\.[\w-]+)+     — jedna ili više tačka+nastavak (npr. ".com" ili ".co.ba")
//     $               — kraj stringa
//     /i              — case-insensitive (A isto kao a)
//
//   CONTACT_PHONE_RE:
//     ^               — početak
//     [\d\s\-]+       — jedna ili više cifara (\d), razmaka (\s) ili crtica (\-)
//     $               — kraj
//     (bez /i jer nema slova)
const CONTACT_EMAIL_RE = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/i;
const CONTACT_PHONE_RE = /^[\d\s\-]+$/;

function showContactErr(fieldId, msg) {
  const input = $(fieldId);
  const err = $(`err-${fieldId}`);
  if (input) input.classList.add("input--error", "select--error", "textarea--error");
  if (err) err.textContent = msg || "";
}

function clearContactErr(fieldId) {
  const input = $(fieldId);
  const err = $(`err-${fieldId}`);
  if (input) input.classList.remove("input--error", "select--error", "textarea--error");
  if (err) err.textContent = "";
}

function validateContactForm(data) {
  let ok = true;
  ["ime", "prezime", "email", "telefon", "tema", "poruka"].forEach(clearContactErr);
  if (!data.ime) {
    showContactErr("ime", "Unesite ime.");
    ok = false;
  }
  if (!data.prezime) {
    showContactErr("prezime", "Unesite prezime.");
    ok = false;
  }
  if (!data.email) {
    showContactErr("email", "Unesite email.");
    ok = false;
  } else if (!CONTACT_EMAIL_RE.test(data.email)) {
    showContactErr("email", "Email nije u ispravnom formatu.");
    ok = false;
  }
  if (!data.telefon) {
    showContactErr("telefon", "Unesite telefon.");
    ok = false;
  } else if (!CONTACT_PHONE_RE.test(data.telefon)) {
    showContactErr("telefon", "Telefon: samo cifre, razmaci i crtice.");
    ok = false;
  }
  if (!data.tema) {
    showContactErr("tema", "Odaberite temu upita.");
    ok = false;
  }
  if (!data.poruka) {
    showContactErr("poruka", "Unesite poruku.");
    ok = false;
  }
  return ok;
}

function initKontaktPage() {
  const form = $("kontakt-form");
  if (!form) return;
  const success = $("form-success");
  const resetBtn = $("form-reset");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (success) success.hidden = true;
    const data = {
      ime: safeText($("ime")?.value),
      prezime: safeText($("prezime")?.value),
      email: safeText($("email")?.value),
      telefon: safeText($("telefon")?.value),
      tema: $("tema")?.value || "",
      poruka: safeText($("poruka")?.value),
    };
    if (!validateContactForm(data)) return;
    if (success) {
      success.hidden = false;
      success.textContent = `Hvala, ${data.ime}! Poruka je primljena (demo — nije poslana na server).`;
    }
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    ["ime", "prezime", "email", "telefon", "tema", "poruka"].forEach(clearContactErr);
    if (success) success.hidden = true;
  });
}

/* Legacy helper — ako negdje ostane onclick */
window.vidiVise = function vidiVise(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const hidden = el.hasAttribute("hidden");
  if (hidden) el.removeAttribute("hidden");
  else el.setAttribute("hidden", "true");
};

/* ---------- Boot: inicijalizacija po stranici (elementi opcioni ako nisu u DOM-u) ---------- */
// DOMContentLoaded se okida kad je HTML parsiran i DOM spreman,
// ali prije nego što su slike i ostali resursi učitani (za razliku od "load").
// Svi event listeneri i init pozivi idu ovdje jer elementi moraju postojati
// u DOM-u da bi ih querySelector/getElementById pronašao.
// Optional chaining (?.) znači: ako element ne postoji (null), ne bacaj grešku —
// ovako ista skripta radi na svim stranicama (index, sadrzaj, kontakt, historija).
window.addEventListener("DOMContentLoaded", () => {
  wireThemeToggle();
  wireSmoothScroll();
  initKontaktPage();
  wireResponsiveImageMap();
  updateSessionCounter();

  $("menu-btn")?.addEventListener("click", openDrawer);
  $("drawer-close")?.addEventListener("click", closeDrawer);
  $("backdrop")?.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      breathing.close();
      closeArticleOverlay();
    }
  });

  setName(getName());
  const ni = $("name-input");
  if (ni) ni.value = getName();
  $("name-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    setName($("name-input")?.value ?? "");
  });

  $("mode-motivisan")?.addEventListener("click", () => setMode("motivisan"));
  $("mode-stres")?.addEventListener("click", () => setMode("stres"));

  if ($("motivation-card")) {
    motivation.render();
    motivation.startAuto();
    $("card-next")?.addEventListener("click", () => motivation.next());
    $("card-prev")?.addEventListener("click", () => motivation.prev());
  }

  saveJSON(STORAGE_KEYS.history, getHistory());
  renderHistoryTable();
  renderHistoryPageTable();
  $("clear-history-btn")?.addEventListener("click", clearHistory);

  $("bookmark-save-btn")?.addEventListener("click", saveBookmarkHere);
  $("bookmark-goto-btn")?.addEventListener("click", gotoLastBookmark);
  renderBookmarkList();

  wireFilters();
  renderContentCards();

  $("todo-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("todo-input")?.value ?? "";
    addTodo(v);
    if ($("todo-input")) $("todo-input").value = "";
  });
  renderTodos();

  const m = getMode();
  setMode(m);
  if ($("timer-display")) timer.init(m);
  $("timer-start")?.addEventListener("click", () => timer.start());
  $("timer-pause")?.addEventListener("click", () => timer.pause());
  $("timer-reset")?.addEventListener("click", () => timer.reset());

  $("emergency-btn")?.addEventListener("click", () => {
    if ($("breath-modal")) breathing.open();
    else window.location.href = "index.html";
  });
  $("breath-close")?.addEventListener("click", () => breathing.close());
  $("breath-start")?.addEventListener("click", () => breathing.start());
  $("breath-stop")?.addEventListener("click", () => breathing.stop());
  $("breath-modal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "breath-modal") breathing.close();
  });

  wireBlogListing();

  if (window.location.hash === "#pomodoro") {
    window.setTimeout(() => $("pomodoro")?.scrollIntoView({ behavior: "smooth" }), 300);
  }
});