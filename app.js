/* =========================================================================
   Baca Buddy — app logic
   Audio-first, picture-first trilingual practice for a young dyslexic learner.
   Pure vanilla JS, no build step. Uses the device's built-in text-to-speech.
   ========================================================================= */

'use strict';

const $ = (id) => document.getElementById(id);
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/* ---------- flatten all words (each keeps a ref to its theme) ---------- */
const ALL_WORDS = THEMES.flatMap((t) => t.words.map((w) => ({ ...w, themeId: t.id })));

/* ---------- persistent state ---------- */
const DEFAULTS = { speed: 0.75, font: 'lexend', lang: 'en', sound: true };
let state = loadState();

function loadState() {
  try {
    const s = { ...DEFAULTS, ...JSON.parse(localStorage.getItem('bacaBuddy') || '{}') };
    if (!['en', 'zh', 'ms'].includes(s.lang)) s.lang = 'en';   // migrate away from old 'mix'
    return s;
  }
  catch (e) { return { ...DEFAULTS }; }
}
function saveState() {
  try { localStorage.setItem('bacaBuddy', JSON.stringify({
    speed: state.speed, font: state.font, lang: state.lang, sound: state.sound
  })); } catch (e) {}
}

/* session-only context */
let ctx = { mode: 'explore', theme: THEMES[0], idx: 0, streak: 0, curLang: 'en', answer: null, slots: [], target: '' };

/* =========================================================================
   SPEECH ENGINE
   ========================================================================= */
let voices = [];
function loadVoices() { voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []) || []; updateVoiceNote(); }
if (window.speechSynthesis) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice(lang) {
  const meta = LANGS[lang];
  const want = meta.tag.toLowerCase();
  const base = want.split('-')[0];
  let v = voices.find((x) => x.lang.toLowerCase() === want)
       || voices.find((x) => x.lang.toLowerCase().startsWith(base));
  if (!v && meta.fallbackTag) {                       // Malay → Indonesian fallback (≈90% intelligible)
    const fb = meta.fallbackTag.toLowerCase();
    v = voices.find((x) => x.lang.toLowerCase() === fb)
     || voices.find((x) => x.lang.toLowerCase().startsWith(fb.split('-')[0]));
  }
  return v;
}

let ttsAlive = false;   // flips true the first time ANY utterance genuinely starts

/* =========================================================================
   AUDIO-FIRST SPEECH
   All learning content ships as pre-recorded clips (audio/*.m4a, generated
   with the Mac's Samantha/Tingting/Amira voices) — plain audio playback,
   immune to the Web-Speech engine's silent-lockup bugs. The live TTS engine
   is only a fallback for dynamic lines (Pokémon names etc.).
   ========================================================================= */
const clipEl = new Audio();
clipEl.preload = 'auto';
const CLIP_RATE = { 0.55: 0.75, 0.75: 0.9, 0.95: 1.0 };   // recorded slightly slow already

function speak(text, lang) {
  const key = lang + '|' + String(text);
  if (typeof AUDIO_MAP !== 'undefined' && AUDIO_MAP[key]) return playClip(AUDIO_MAP[key]);
  return ttsSpeak(text, lang);
}

function playClip(src) {
  return new Promise((resolve) => {
    if (!state.sound) { resolve(); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    try {
      clipEl.onended = finish;
      clipEl.onerror = finish;
      clipEl.src = src;                       // setting src stops any previous clip
      clipEl.playbackRate = CLIP_RATE[state.speed] || 1.0;
      ttsAlive = true;                        // audio path is alive by construction
      clipEl.play().then(null, finish);       // autoplay-blocked etc. → resolve quietly
    } catch (e) { finish(); }
    setTimeout(finish, 12000);                // safety net
  });
}

function ttsSpeak(text, lang) {
  return new Promise((resolve) => {
    if (!state.sound || !window.speechSynthesis || !text) { resolve(); return; }
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(String(text));
    const v = pickVoice(lang);
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = LANGS[lang].tag; }
    u.rate = state.speed; u.pitch = 1.05;
    let done = false, started = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onstart = () => { started = true; ttsAlive = true; };
    u.onend = finish; u.onerror = finish;
    // cancel() + speak() in the same tick can zombie the utterance
    // (speaking=true, no audio, no events) — give the engine a beat first
    setTimeout(() => {
      try { speechSynthesis.speak(u); speechSynthesis.resume(); } catch (e) {}
      setTimeout(() => {                            // watchdog: re-kick once if it never started
        if (!started && !done) {
          try { speechSynthesis.cancel(); } catch (e) {}
          setTimeout(() => { try { speechSynthesis.speak(u); speechSynthesis.resume(); } catch (e) {} }, 120);
        }
      }, 1000);
    }, 60);
    setTimeout(finish, Math.min(String(text).length * 400 + 2600, 8500));   // safety net if onend never fires (capped)
  });
}

/* returning from background can leave the synth permanently paused — reset it */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && window.speechSynthesis) {
    try { speechSynthesis.cancel(); speechSynthesis.resume(); } catch (e) {}
    loadVoices();
  }
});

/* text the TTS should read for a word in a given language */
function spoken(word, lang) { return lang === 'zh' ? word.zh.w : (lang === 'ms' ? word.ms.w : word.en.w); }

/* iOS unlocks audio only after a user gesture — prime it once, then greet. */
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked || !window.speechSynthesis) return;
  audioUnlocked = true;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
  // prime the clip player inside the same gesture (iOS unlocks <audio> per element)
  try {
    if (typeof AUDIO_MAP !== 'undefined') {
      const any = Object.values(AUDIO_MAP)[0];
      clipEl.muted = true;
      clipEl.src = any;
      clipEl.play().then(() => { clipEl.pause(); clipEl.muted = false; },
                         () => { clipEl.muted = false; });
    }
  } catch (e) {}
  setTimeout(speakGreeting, 150);          // spoken hello rides on the first tap
}
document.addEventListener('pointerdown', unlockAudio, { once: true });

/* ---------- personal greeting (Jayden) ---------- */
function greetingParts() {
  const h = new Date().getHours();
  if (h < 12) return { en: 'Good morning', zh: '早安' };
  if (h < 18) return { en: 'Good afternoon', zh: '午安' };
  return { en: 'Good evening', zh: '晚上好' };
}

function childName() { return (typeof CHILD_NAME !== 'undefined' && CHILD_NAME) || ''; }

function renderGreeting() {
  const el = $('greetBar'); if (!el || !childName()) return;
  const g = greetingParts();
  el.innerHTML = `👋 ${g.en}, <b>${childName()}</b>! <span class="greet-zh">${g.zh}，${childName()}！</span>`;
}

let greeted = false;
async function speakGreeting() {
  if (greeted || !childName()) return;
  greeted = true;
  const g = greetingParts();
  await speak(`${g.en}, ${childName()}!`, 'en');
  // the Pokémon pal joins the welcome, if one is chosen (rewards.js)
  try {
    const pal = (typeof petInfo === 'function') ? petInfo(rwState()) : null;
    if (pal) await speak(`${pal.mon.name} is waiting for you!`, 'en');
  } catch (e) {}
  speak(`${g.zh}！`, 'zh');
}

/* =========================================================================
   RENDER HELPERS
   ========================================================================= */
const SYL_PAL = ['var(--syl-a)', 'var(--syl-b)', 'var(--syl-c)'];
function sylHTML(arr) {
  return arr.map((s, i) => `<span class="syl" style="color:${SYL_PAL[i % 3]}">${s}</span>`).join('');
}
function zhHTML(str) {
  return [...str].map((c, i) => `<span class="syl" style="color:${SYL_PAL[i % 3]}">${c}</span>`).join('');
}
function wordHTML(word, lang) {
  if (lang === 'zh') return zhHTML(word.zh.w);
  return sylHTML(lang === 'ms' ? word.ms.syl : word.en.syl);
}

/* =========================================================================
   SCREEN ROUTER
   ========================================================================= */
function show(screenId) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === screenId));
  try { speechSynthesis.cancel(); } catch (e) {}
  try { clipEl.pause(); } catch (e) {}     // stop any playing clip on navigation
}

/* =========================================================================
   HOME
   ========================================================================= */
/* Each activity belongs to specific language tracks — no mixed rotation.
   'all' = works in whichever language is selected (Explore always shows the
   three side-by-side, which is its cross-mapping purpose). */
const MENU = [
  { mode: 'explore', ico: '📖', t1: 'Explore',        t2: '看图学词 · Belajar', screen: 'flash',  langs: 'all' },
  { mode: 'listen',  ico: '👂', t1: 'Listen & Find',  t2: '听声音，找图片',      screen: 'listen', langs: 'all' },
  { mode: 'match',   ico: '🎯', t1: 'Match the Word',  t2: '图片配字',           screen: 'match',  langs: 'all' },
  { mode: 'build',   ico: '🔤', t1: 'Sound It Out',    t2: 'Eja perkataan',      screen: 'build',  langs: ['en', 'ms'] },
  { mode: 'blend',   ico: '🧩', t1: 'Blend It',        t2: 'Suku kata',          screen: 'blend',  langs: ['en', 'ms'] },
  { mode: 'hunt',    ico: '🔍', t1: 'Sound Hunt',      t2: 'Cari bunyi',         screen: 'hunt',   langs: ['en', 'ms'] },
  { mode: 'fluent',  ico: '🏃', t1: 'Read Along',      t2: 'Baca lancar',        screen: 'fluent', langs: ['en', 'ms'], direct: true },
  { mode: 'trace',   ico: '✍️', t1: 'Write 写字',      t2: '一笔一画描汉字',      screen: 'trace',    langs: ['zh'], direct: true },
  { mode: 'radical', ico: '🧱', t1: 'Build 拼字',      t2: '部件拼汉字',          screen: 'radical',  langs: ['zh'], direct: true },
  { mode: 'homo',    ico: '👯', t1: 'Same Sound 同音', t2: '同音字，选一选',      screen: 'homophone', langs: ['zh'], direct: true }
];

function renderLangTabs() {
  const el = $('langTabs'); if (!el) return;
  el.innerHTML = ['en', 'zh', 'ms'].map((l) => `
    <button class="lang-tab ${state.lang === l ? 'on' : ''}" data-lang="${l}"
            style="--tabc:${LANGS[l].colour}">
      ${l === 'en' ? '🇬🇧 English' : (l === 'zh' ? '🇨🇳 中文' : '🇲🇾 Melayu')}
    </button>`).join('');
  el.querySelectorAll('.lang-tab').forEach((b) => b.addEventListener('click', () => {
    state.lang = b.dataset.lang; saveState();
    renderLangTabs(); buildHome(); applyStaticI18n();
    speak(b.dataset.lang === 'en' ? 'English!' : (b.dataset.lang === 'zh' ? '中文！' : 'Bahasa Melayu!'), b.dataset.lang);
  }));
}

function buildHome() {
  const items = MENU.filter((m) => m.langs === 'all' || m.langs.includes(state.lang));
  $('menuGrid').innerHTML = items.map((m) => `
    <div class="menu-card" data-mode="${m.mode}">
      <div class="ico">${m.ico}</div>
      <div class="t1">${t('menu_' + m.mode)}</div>
      <div class="t2">${state.lang === 'en' ? m.t2 : STR['menu_' + m.mode].en}</div>
    </div>`).join('');
  $('menuGrid').querySelectorAll('.menu-card').forEach((el) => {
    el.addEventListener('click', () => {
      const m = MENU.find((x) => x.mode === el.dataset.mode);
      if (m.direct) startMode(m.mode, ctx.theme);   // hanzi games need no topic picker
      else openThemePicker(m.mode);
    });
  });
}

function goHome() { show('screen-home'); }

/* =========================================================================
   THEME PICKER
   ========================================================================= */
function openThemePicker(mode) {
  ctx.mode = mode;
  const m = MENU.find((x) => x.mode === mode);
  $('themeModeIcon').textContent = m.ico;
  $('themeModeTitle').textContent = t('menu_' + m.mode) + ' — ' + t('pick_topic');
  $('themeGrid').innerHTML = THEMES.map((t) => `
    <div class="theme-card" data-id="${t.id}">
      <div class="ico">${t.emoji}</div>
      <div class="t1">${t.name.en}</div>
      <div class="t2">${t.name.zh} · ${t.name.ms}</div>
    </div>`).join('');
  $('themeGrid').querySelectorAll('.theme-card').forEach((el) => {
    el.addEventListener('click', () => startMode(mode, THEMES.find((t) => t.id === el.dataset.id)));
  });
  show('screen-themes');
}

function startMode(mode, theme) {
  ctx.theme = theme;
  ctx.idx = 0; ctx.streak = 0;
  if (mode === 'explore') { show('screen-flash'); renderFlash(); }
  else if (mode === 'listen') { show('screen-listen'); nextListen(); }
  else if (mode === 'match') { show('screen-match'); nextMatch(); }
  else if (mode === 'build') { show('screen-build'); nextBuild(); }
  else if (mode === 'blend') { show('screen-blend'); nextBlend(); }
  else if (mode === 'hunt') { show('screen-hunt'); nextHunt(); }
  else if (mode === 'trace') { openTracePicker(); }
  else if (mode === 'radical') { show('screen-radical'); nextRadical(); }
  else if (mode === 'homo') { show('screen-homophone'); nextHomo(); }
  else if (mode === 'fluent') { startFluent(); }
}

/* the practise language is now a single, explicit choice (home-screen tabs) */
function questionLang(allowZh = true) {
  if (!allowZh && state.lang === 'zh') return 'en';   // safety net; zh-only games are hidden anyway
  return state.lang;
}

/* ---------- no-repeat shuffle bags: cycle the whole pool before repeating ---------- */
const _bags = {};
function bagPick(key, arr) {
  if (!arr || !arr.length) return undefined;
  const st = _bags[key] = _bags[key] || { order: [], last: -1, n: arr.length };
  if (st.n !== arr.length) { st.order = []; st.n = arr.length; }   // pool changed → rebuild
  if (!st.order.length) {
    st.order = shuffle(arr.map((_, i) => i));
    // don't let the new cycle start with the item that just ended the old one
    if (arr.length > 1 && st.order[st.order.length - 1] === st.last) {
      const t = st.order[0]; st.order[0] = st.order[st.order.length - 1]; st.order[st.order.length - 1] = t;
    }
  }
  st.last = st.order.pop();
  return arr[st.last];
}

/* =========================================================================
   EXPLORE (flashcards)
   ========================================================================= */
function renderFlash() {
  const words = ctx.theme.words;
  const w = words[ctx.idx];
  $('flashThemeName').textContent = `${ctx.theme.emoji} ${ctx.theme.name.en} · ${ctx.theme.name.zh}`;
  $('flashEmoji').textContent = w.emoji;
  $('flashCount').textContent = `${ctx.idx + 1} / ${words.length}`;

  $('flashRows').innerHTML = ['en', 'zh', 'ms'].map((lang) => {
    const meta = LANGS[lang];
    const pinyin = lang === 'zh' ? `<span class="pinyin">${w.zh.py}</span>` : '';
    return `
      <div class="lang-row" data-lang="${lang}" style="border-left-color:${meta.colour}">
        <span class="chip" style="background:${meta.colour}">${meta.short}</span>
        <span class="word">${wordHTML(w, lang)}</span>
        ${pinyin}
        <span class="spk">🔊</span>
      </div>`;
  }).join('');

  $('flashRows').querySelectorAll('.lang-row').forEach((row) => {
    row.addEventListener('click', async () => {
      $('flashRows').querySelectorAll('.lang-row').forEach((r) => r.classList.remove('speaking'));
      row.classList.add('speaking');
      await speak(spoken(w, row.dataset.lang), row.dataset.lang);
      row.classList.remove('speaking');
    });
  });
}

async function playAllFlash() {
  const w = ctx.theme.words[ctx.idx];
  $('flashEmoji').classList.remove('tap-hint');
  for (const lang of ['en', 'zh', 'ms']) {
    const row = document.querySelector(`#flashRows .lang-row[data-lang="${lang}"]`);
    if (row) row.classList.add('speaking');
    await speak(spoken(w, lang), lang);
    if (row) row.classList.remove('speaking');
  }
}

function flashStep(dir) {
  const n = ctx.theme.words.length;
  ctx.idx = (ctx.idx + dir + n) % n;
  renderFlash();
}

/* =========================================================================
   LISTEN & FIND  (hear a word → tap the matching picture)
   ========================================================================= */
function pickChoices(correct, n, pool) {
  const others = shuffle(pool.filter((w) => w.emoji !== correct.emoji)).slice(0, n - 1);
  return shuffle([correct, ...others]);
}

function nextListen() {
  const lang = questionLang(true);
  ctx.curLang = lang;
  const correct = bagPick('listen:' + ctx.theme.id + ':' + lang, ctx.theme.words);
  ctx.answer = correct;
  const choices = pickChoices(correct, Math.min(4, ctx.theme.words.length), ctx.theme.words);

  $('listenStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('listenChoices').innerHTML = choices.map((w) => `
    <div class="choice" data-emoji="${w.emoji}"><span class="ce">${w.emoji}</span></div>`).join('');
  $('listenChoices').querySelectorAll('.choice').forEach((el) => {
    el.addEventListener('click', () => answerListen(el, choices.find((c) => c.emoji === el.dataset.emoji)));
  });

  const chip = LANGS[lang].short;
  $('listenQ').innerHTML = `Which one is this? <b style="color:${LANGS[lang].colour}">${chip}</b>`;
  speak(spoken(correct, lang), lang);
}

async function answerListen(el, word) {
  if (word.emoji === ctx.answer.emoji) {
    el.classList.add('correct');
    disableChoices('listenChoices');
    await celebrate();
    nextListen();
  } else {
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 400);
    const t = pick(TRY_AGAIN);
    await speak(t.en, 'en');
    speak(spoken(ctx.answer, ctx.curLang), ctx.curLang);
    ctx.streak = 0;
  }
}

/* =========================================================================
   MATCH THE WORD  (see picture → tap the correct written word; taps read aloud)
   ========================================================================= */
function nextMatch() {
  const lang = questionLang(true);
  ctx.curLang = lang;
  const correct = bagPick('match:' + ctx.theme.id + ':' + lang, ctx.theme.words);
  ctx.answer = correct;
  const choices = pickChoices(correct, Math.min(4, ctx.theme.words.length), ctx.theme.words);

  $('matchStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('matchEmoji').textContent = correct.emoji;
  $('matchChoices').innerHTML = choices.map((w) => `
    <div class="choice" data-emoji="${w.emoji}"><span class="cw" style="border-left:0">${wordHTML(w, lang)}</span></div>`).join('');
  $('matchChoices').querySelectorAll('.choice').forEach((el) => {
    el.addEventListener('click', () => answerMatch(el, choices.find((c) => c.emoji === el.dataset.emoji)));
  });

  speak(spoken(correct, lang), lang);
}

async function answerMatch(el, word) {
  await speak(spoken(word, ctx.curLang), ctx.curLang);   // read whatever they tapped (multisensory)
  if (word.emoji === ctx.answer.emoji) {
    el.classList.add('correct');
    disableChoices('matchChoices');
    await celebrate();
    nextMatch();
  } else {
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 400);
    ctx.streak = 0;
  }
}

/* =========================================================================
   SOUND IT OUT  (hear a word → build it from letter tiles)  EN / BM only
   ========================================================================= */
function nextBuild() {
  const lang = questionLang(false);        // no Chinese letter-building
  ctx.curLang = lang;
  const word = bagPick('build:' + ctx.theme.id + ':' + lang, ctx.theme.words);
  ctx.answer = word;
  const target = (lang === 'ms' ? word.ms.w : word.en.w).toLowerCase().replace(/\s+/g, '');
  ctx.target = target;
  ctx.slots = new Array(target.length).fill(null);

  $('buildStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('buildEmoji').textContent = word.emoji;
  renderBuild();

  const chip = LANGS[lang].short;
  speak(spoken(word, lang), lang);
  // brief spoken cue so a non-reader knows what to do
  setTimeout(() => {}, 0);
}

function renderBuild() {
  const target = ctx.target;
  $('buildSlots').innerHTML = target.split('').map((_, i) =>
    `<div class="slot ${ctx.slots[i] ? 'filled' : ''}" data-i="${i}">${ctx.slots[i] || ''}</div>`).join('');
  $('buildSlots').querySelectorAll('.slot').forEach((s) => {
    s.addEventListener('click', () => removeLetter(+s.dataset.i));
  });

  const used = ctx.slots.filter(Boolean);
  const letters = shuffleStable(target.split(''), ctx.target);   // stable shuffle per question
  // count remaining copies of each letter
  const remaining = {};
  target.split('').forEach((c) => remaining[c] = (remaining[c] || 0) + 1);
  used.forEach((c) => remaining[c]--);

  const seen = {};
  $('buildTiles').innerHTML = letters.map((c, idx) => {
    seen[c] = (seen[c] || 0) + 1;
    const isUsed = seen[c] > remaining[c];
    return `<div class="tile ${isUsed ? 'used' : ''}" data-c="${c}">${c}</div>`;
  }).join('');
  $('buildTiles').querySelectorAll('.tile:not(.used)').forEach((t) => {
    t.addEventListener('click', () => placeLetter(t.dataset.c));
  });
}

/* deterministic shuffle so tiles don't reorder on every re-render */
let _shuffleCache = { key: '', arr: [] };
function shuffleStable(arr, key) {
  if (_shuffleCache.key === key) return _shuffleCache.arr;
  const a = shuffle(arr);
  _shuffleCache = { key, arr: a };
  return a;
}

function placeLetter(c) {
  const i = ctx.slots.indexOf(null);
  if (i === -1) return;
  ctx.slots[i] = c;
  // say the letter SOUND, not its name (systematic-phonics principle; KSSR
  // remedial pathway). Approximated for TTS; BM keeps the plain letter.
  const sayAs = (ctx.curLang === 'en' && typeof EN_LETTER_SOUNDS !== 'undefined' && EN_LETTER_SOUNDS[c]) || c;
  speak(sayAs, ctx.curLang);
  renderBuild();
  if (ctx.slots.indexOf(null) === -1) checkBuild();
}

function removeLetter(i) {
  if (!ctx.slots[i]) return;
  ctx.slots[i] = null;
  renderBuild();
}

async function checkBuild() {
  const built = ctx.slots.join('');
  if (built === ctx.target) {
    $('buildSlots').querySelectorAll('.slot').forEach((s) => s.classList.add('filled'));
    await speak(spoken(ctx.answer, ctx.curLang), ctx.curLang);
    await celebrate();
    nextBuild();
  } else {
    const t = pick(TRY_AGAIN);
    await speak(t.en, 'en');
    ctx.slots = new Array(ctx.target.length).fill(null);   // gently reset
    ctx.streak = 0;
    renderBuild();
  }
}

/* =========================================================================
   REWARDS
   ========================================================================= */
function disableChoices(gridId) {
  $(gridId).querySelectorAll('.choice').forEach((c) => { if (!c.classList.contains('correct')) c.classList.add('dim'); });
  $(gridId).querySelectorAll('.choice').forEach((c) => c.replaceWith(c.cloneNode(true))); // strip listeners
}

async function celebrate() {
  ctx.streak++;
  confetti();
  if (typeof addStar === 'function') addStar();   // Pokémon reward system (rewards.js)
  const p = pick(PRAISE);
  await speak(p.en, 'en');
  await speak(p.zh, 'zh');
  await wait(300);
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

function confetti() {
  const box = $('confetti');
  const bits = ['⭐', '🎉', '🌟', '✨', '🎊', '🏆'];
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    s.textContent = pick(bits);
    s.style.left = rand(100) + 'vw';
    s.style.animationDuration = (1 + Math.random() * 1.3) + 's';
    s.style.fontSize = (1.2 + Math.random() * 1.6) + 'rem';
    box.appendChild(s);
    setTimeout(() => s.remove(), 2600);
  }
}

/* =========================================================================
   SETTINGS
   ========================================================================= */
function applyFont() { document.body.classList.toggle('dys', state.font === 'dys'); }
function applySound() {
  $('soundBtn').textContent = state.sound ? '🔊' : '🔇';
  $('soundBtn').classList.toggle('muted', !state.sound);   // obvious amber warning when muted
}

function refreshSettingsUI() {
  $('segSpeed').querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.speed === state.speed));
  $('segFont').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.font === state.font));
}

function updateVoiceNote() {
  const el = $('voiceNote'); if (!el) return;
  const have = { en: !!pickVoice('en'), zh: !!pickVoice('zh'), ms: !!pickVoice('ms') };
  if (have.en && have.zh && have.ms) { el.textContent = ''; return; }
  const missing = [];
  if (!have.en) missing.push('English');
  if (!have.zh) missing.push('中文');
  if (!have.ms) missing.push('Malay');
  el.textContent = missing.length
    ? `Tip: add a voice for ${missing.join(', ')} in iPad Settings → Accessibility → Spoken Content → Voices.`
    : '';
}

function openSheet() { refreshSettingsUI(); updateVoiceNote(); $('sheetBack').classList.add('open'); }
function closeSheet() { $('sheetBack').classList.remove('open'); }

/* ---------- sound-check diagnostic: says exactly why audio is/isn't working ---------- */
async function runSoundTest() {
  const el = $('soundDiag');
  if (!window.speechSynthesis) { el.innerHTML = '❌ This browser has no speech engine at all. Use Safari.'; return; }
  const vs = speechSynthesis.getVoices();
  const en = pickVoice('en'), zh = pickVoice('zh'), ms = pickVoice('ms');
  const line1 = `Voices found: <b>${vs.length}</b> — EN: ${en ? en.name : '❌ none'} · 中文: ${zh ? zh.name : '❌ none'} · BM: ${ms ? ms.name + (ms.lang.startsWith('id') ? ' (Indonesian fallback)' : '') : '❌ none'}`;
  if (!state.sound) {
    el.innerHTML = `${line1}<br>🔇 <b>Sound is MUTED in the app</b> — tap the 🔇 button at the top right to unmute.`;
    return;
  }
  el.innerHTML = `${line1}<br>⏳ Speaking a test line in each language — listen…`;
  ttsAlive = false;
  await speak('Hello Jayden!', 'en');
  await speak('你好！', 'zh');
  await speak('Selamat datang!', 'ms');
  el.innerHTML = ttsAlive
    ? `${line1}<br>✅ <b>The speech engine IS working</b> — if you heard nothing, check the iPad side switch / volume buttons / Silent Mode in Control Centre.`
    : `${line1}<br>⚠️ <b>The engine accepted the words but never spoke.</b> This browser/preview cannot play speech — open the app in <b>Safari</b> (or Chrome) instead. The app itself is fine.`;
}

/* =========================================================================
   WIRE UP
   ========================================================================= */
function init() {
  applyFont(); applySound();
  renderGreeting();
  renderLangTabs();
  buildHome();
  applyStaticI18n();

  $('homeBtn').addEventListener('click', goHome);
  $('brand').addEventListener('click', goHome);
  $('settingsBtn').addEventListener('click', openSheet);
  $('testSound').addEventListener('click', runSoundTest);
  $('sheetBack').addEventListener('click', (e) => { if (e.target === $('sheetBack')) closeSheet(); });
  $('sheetClose').addEventListener('click', closeSheet);

  $('soundBtn').addEventListener('click', () => {
    state.sound = !state.sound; applySound(); saveState();
    if (state.sound) speak('Hello Jayden!', 'en'); else { try { speechSynthesis.cancel(); clipEl.pause(); } catch (e) {} }
  });

  // flashcard controls
  $('flashPrev').addEventListener('click', () => flashStep(-1));
  $('flashNext').addEventListener('click', () => flashStep(1));
  $('flashPlay').addEventListener('click', playAllFlash);
  $('flashEmoji').addEventListener('click', playAllFlash);

  // game replays
  $('listenReplay').addEventListener('click', () => speak(spoken(ctx.answer, ctx.curLang), ctx.curLang));
  $('matchEmoji').addEventListener('click', () => speak(spoken(ctx.answer, ctx.curLang), ctx.curLang));
  $('buildEmoji').addEventListener('click', () => speak(spoken(ctx.answer, ctx.curLang), ctx.curLang));
  $('buildReplay').addEventListener('click', () => speak(spoken(ctx.answer, ctx.curLang), ctx.curLang));

  // settings segmented controls
  $('segSpeed').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.speed = +b.dataset.speed; saveState(); refreshSettingsUI(); speak('Like this', 'en');
  }));
  $('segFont').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.font = b.dataset.font; applyFont(); saveState(); refreshSettingsUI();
  }));

  goHome();
}

document.addEventListener('DOMContentLoaded', init);
