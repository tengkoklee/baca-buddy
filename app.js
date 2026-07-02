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
const DEFAULTS = { speed: 0.75, font: 'lexend', lang: 'mix', sound: true };
let state = loadState();

function loadState() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('bacaBuddy') || '{}') }; }
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

function speak(text, lang) {
  return new Promise((resolve) => {
    if (!state.sound || !window.speechSynthesis || !text) { resolve(); return; }
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(String(text));
    const v = pickVoice(lang);
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = LANGS[lang].tag; }
    u.rate = state.speed; u.pitch = 1.05;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish; u.onerror = finish;
    speechSynthesis.speak(u);
    setTimeout(finish, String(text).length * 500 + 2200);   // safety net if onend never fires
  });
}

/* text the TTS should read for a word in a given language */
function spoken(word, lang) { return lang === 'zh' ? word.zh.w : (lang === 'ms' ? word.ms.w : word.en.w); }

/* iOS unlocks audio only after a user gesture — prime it once. */
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked || !window.speechSynthesis) return;
  audioUnlocked = true;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
}
document.addEventListener('pointerdown', unlockAudio, { once: true });

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
}

/* =========================================================================
   HOME
   ========================================================================= */
const MENU = [
  { mode: 'explore', ico: '📖', t1: 'Explore',        t2: '看图学词 · Belajar', screen: 'flash'  },
  { mode: 'listen',  ico: '👂', t1: 'Listen & Find',  t2: '听声音，找图片',      screen: 'listen' },
  { mode: 'match',   ico: '🎯', t1: 'Match the Word',  t2: '图片配字',           screen: 'match'  },
  { mode: 'build',   ico: '🔤', t1: 'Sound It Out',    t2: '拼出单词',           screen: 'build'  },
  { mode: 'blend',   ico: '🧩', t1: 'Blend It',        t2: '拼音节 · Suku kata', screen: 'blend'  },
  { mode: 'hunt',    ico: '🔍', t1: 'Sound Hunt',      t2: '听首音，找图片',      screen: 'hunt'   },
  { mode: 'trace',   ico: '✍️', t1: 'Write 写字',      t2: '一笔一画描汉字',      screen: 'trace',    direct: true },
  { mode: 'radical', ico: '🧱', t1: 'Build 拼字',      t2: '部件拼汉字',          screen: 'radical',  direct: true },
  { mode: 'homo',    ico: '👯', t1: 'Same Sound 同音', t2: '同音字，选一选',      screen: 'homophone', direct: true },
  { mode: 'fluent',  ico: '🏃', t1: 'Read Along',      t2: '朗读 · Baca lancar',  screen: 'fluent',   direct: true }
];

function buildHome() {
  $('menuGrid').innerHTML = MENU.map((m) => `
    <div class="menu-card" data-mode="${m.mode}">
      <div class="ico">${m.ico}</div>
      <div class="t1">${m.t1}</div>
      <div class="t2">${m.t2}</div>
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
  $('themeModeTitle').textContent = m.t1 + ' — pick a topic';
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

/* choose the practise language for a question */
function questionLang(allowZh = true) {
  if (state.lang === 'mix') return pick(allowZh ? ['en', 'zh', 'ms'] : ['en', 'ms']);
  if (!allowZh && state.lang === 'zh') return pick(['en', 'ms']);
  return state.lang;
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
  const correct = pick(ctx.theme.words);
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
  const correct = pick(ctx.theme.words);
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
  const word = pick(ctx.theme.words);
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
function applySound() { $('soundBtn').textContent = state.sound ? '🔊' : '🔇'; }

function refreshSettingsUI() {
  $('segSpeed').querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.speed === state.speed));
  $('segFont').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.font === state.font));
  $('segLang').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.lang === state.lang));
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

/* =========================================================================
   WIRE UP
   ========================================================================= */
function init() {
  applyFont(); applySound();
  buildHome();

  $('homeBtn').addEventListener('click', goHome);
  $('brand').addEventListener('click', goHome);
  $('settingsBtn').addEventListener('click', openSheet);
  $('sheetBack').addEventListener('click', (e) => { if (e.target === $('sheetBack')) closeSheet(); });
  $('sheetClose').addEventListener('click', closeSheet);

  $('soundBtn').addEventListener('click', () => {
    state.sound = !state.sound; applySound(); saveState();
    if (state.sound) speak('Sound on', 'en'); else { try { speechSynthesis.cancel(); } catch (e) {} }
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
  $('segLang').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.lang = b.dataset.lang; saveState(); refreshSettingsUI();
  }));

  goHome();
}

document.addEventListener('DOMContentLoaded', init);
