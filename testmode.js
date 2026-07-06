/* =========================================================================
   📝 TEST PREP — Ejaan / Spelling / 听写
   The parent keys in the teacher's word list for tomorrow's test;
   Jayden drills exactly those words.
   - EN / BM: hear the word → spell it from letter tiles (with distractors)
   - 中文 (听写): hear the word → WRITE each character from memory
     (no outline — true tīngxiě; a 💡 hint shows the outline when stuck)
   Wrong words re-queue at the end until the list is clean. Correct answers
   earn ⭐ like every other game. Lists live in localStorage ('bacaTests').
   ========================================================================= */

'use strict';

/* ---------- storage ---------- */
function tpLoad() {
  try { return JSON.parse(localStorage.getItem('bacaTests') || '{}'); }
  catch (e) { return {}; }
}
function tpSave(d) { try { localStorage.setItem('bacaTests', JSON.stringify(d)); } catch (e) {} }
function tpWords(lang) { return (tpLoad()[lang] || {}).words || []; }
function tpStage(lang) { return (tpLoad()[lang] || {}).stage || 1; }   // 1 Copy · 2 Peek · 3 Test
function tpSetStage(lang, st) { const d = tpLoad(); d[lang] = d[lang] || {}; d[lang].stage = st; tpSave(d); }

/* the drill words: the parent's saved list if any, else fall back to the
   ticked-topic vocabulary so the kid can ALWAYS practise (no setup needed). */
function tpEffectiveWords(lang) {
  const custom = tpWords(lang);
  if (custom.length) return { words: custom, source: 'custom' };
  const pool = (typeof topicTheme === 'function') ? topicTheme().words : [];
  const words = shuffle(pool.map((w) => lang === 'zh' ? w.zh.w : (lang === 'ms' ? w.ms.w : w.en.w)))
    .filter(Boolean).slice(0, 15);
  return { words, source: 'topic' };
}

/* ---------- session state ---------- */
let tp = null;   // { lang, queue, idx, missed:Set, total, round, word, slots, tray, chars, charIdx, writer, hinted }

function openTestMode() {
  renderTestHome(state.lang);   // always land on the drill home (kid-first)
  show('screen-test');
}

/* ---------- parent editor ---------- */
function renderTestEditor(lang) {
  const existing = tpWords(lang).join('\n');
  $('testArea').innerHTML = `
    <div class="pet-card test-card">
      <p class="hint-line">${t('tp_parent_hint')}</p>
      <textarea id="tpWordsInput" class="tp-input" rows="8"
        placeholder="${lang === 'zh' ? '苹果\n学校\n朋友' : (lang === 'ms' ? 'sekolah\nkawan\nmakanan' : 'school\nfriend\nbecause')}">${existing}</textarea>
      <div class="flu-row">
        <button class="iconbtn flu-go" id="tpSaveBtn">💾<span class="lbl">${t('tp_save')}</span></button>
        <button class="iconbtn" id="tpCancelBtn">↩️<span class="lbl">${t('tp_back')}</span></button>
      </div>
    </div>`;
  $('tpSaveBtn').addEventListener('click', () => {
    const words = $('tpWordsInput').value.split('\n').map((w) => w.trim()).filter(Boolean).slice(0, 40);
    const d = tpLoad();
    d[lang] = { ...(d[lang] || {}), words, updated: Date.now() };
    tpSave(d);
    renderTestHome(lang);   // topic-word fallback means home is always usable
  });
  const c = $('tpCancelBtn');
  if (c) c.addEventListener('click', () => renderTestHome(lang));
}

/* ---------- list home (kid-first) ---------- */
function renderTestHome(lang) {
  const eff = tpEffectiveWords(lang);
  const st = tpStage(lang);
  $('testArea').innerHTML = `
    <div class="pet-card test-card">
      <div class="tp-src">${eff.source === 'custom' ? t('tp_src_teacher', { n: eff.words.length }) : t('tp_src_topic')}</div>
      <div class="tp-list">${eff.words.slice(0, 20).map((w) => `<span class="flu-chip">${w}</span>`).join('')}</div>
      <div class="tp-stages">
        <button class="tp-stage-btn ${st === 1 ? 'on' : ''}" data-st="1">${t('tp_stage_copy')}</button>
        <button class="tp-stage-btn ${st === 2 ? 'on' : ''}" data-st="2">${t('tp_stage_peek')}</button>
        <button class="tp-stage-btn ${st === 3 ? 'on' : ''}" data-st="3">${t('tp_stage_test')}</button>
      </div>
      <button class="tp-bigstart" id="tpStartBtn">▶️ ${t('tp_start_drill')}</button>
      <p class="hint-line">${t('tp_stage_hint')}</p>
      <button class="iconbtn small tp-setwords" id="tpEditBtn">✏️<span class="lbl">${t('tp_set_words')}</span></button>
    </div>`;
  $('testArea').querySelectorAll('.tp-stage-btn').forEach((b) => b.addEventListener('click', () => {
    tpSetStage(lang, +b.dataset.st);
    renderTestHome(lang);
  }));
  $('tpStartBtn').addEventListener('click', () => startTestRun(lang));
  $('tpEditBtn').addEventListener('click', () => renderTestEditor(lang));
}

/* ---------- test run ---------- */
function startTestRun(lang) {
  const eff = tpEffectiveWords(lang);
  tp = { lang, queue: shuffle(eff.words), idx: 0, missed: new Set(),
         total: eff.words.length, round: 1, stage: tpStage(lang) };
  nextTestWord();
}

function nextTestWord() {
  if (tp.idx >= tp.queue.length) { finishTestRound(); return; }
  tp.word = tp.queue[tp.idx];
  tp.wrongThisWord = false;
  if (tp.lang === 'zh') renderTingxie();
  else renderEjaan();
}

function tpProgressHTML() {
  return `<div class="tp-progress">${t('tp_word_n', { i: tp.idx + 1, n: tp.queue.length })}${tp.round > 1 ? ' · 🔁' : ''}</div>`;
}

async function tpWordDone(ok) {
  recordAnswer('test', tp.lang, tp.word, ok);
  if (ok) {
    await celebrate();
  } else {
    tp.missed.add(tp.word);
  }
  tp.idx++;
  nextTestWord();
}

/* ---------- EN / BM: spell from tiles ---------- */
function renderEjaan() {
  const target = tp.word.toLowerCase().replace(/[^a-z' -]/g, '');
  const letters = target.replace(/[ -]/g, '').split('');
  const distract = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => !letters.includes(c))).slice(0, 2);
  tp.target = target;
  tp.slots = new Array(letters.length).fill(null);
  tp.letters = letters;
  tp.tray = shuffle([...letters, ...distract]);
  const showWord = tp.stage === 1 ? `<div class="tp-showword">${tp.word}</div>`
    : (tp.stage === 2 ? `<div class="tp-showword fading">${tp.word}</div>` : '');
  $('testArea').innerHTML = `
    <div class="pet-card test-card">
      ${tpProgressHTML()}
      ${showWord}
      <button class="iconbtn" id="tpHear">🔊<span class="lbl">${t('hear_it')}</span></button>
      <div class="build-slots" id="tpSlots"></div>
      <div class="tile-tray" id="tpTiles"></div>
    </div>`;
  $('tpHear').addEventListener('click', () => speak(tp.word, tp.lang));
  renderEjaanTiles();
  speak(tp.word, tp.lang);
}

let tpGen = 0;
function renderEjaanTiles() {
  tpGen++;
  const gen = tpGen;
  $('tpSlots').innerHTML = tp.slots.map((s, i) =>
    `<div class="slot ${s ? 'filled' : ''}" data-i="${i}">${s || ''}</div>`).join('');
  $('tpSlots').querySelectorAll('.slot').forEach((el) => el.addEventListener('click', () => {
    const i = +el.dataset.i;
    if (tp.slots[i]) { tp.slots[i] = null; renderEjaanTiles(); }
  }));
  const placed = {};
  tp.slots.filter(Boolean).forEach((c) => placed[c] = (placed[c] || 0) + 1);
  const need = {};
  tp.letters.forEach((c) => need[c] = (need[c] || 0) + 1);
  const seen = {};
  $('tpTiles').innerHTML = tp.tray.map((c) => {
    seen[c] = (seen[c] || 0) + 1;
    const used = seen[c] <= (placed[c] || 0);
    return `<div class="tile ${used ? 'used' : ''}" data-c="${c}">${c}</div>`;
  }).join('');
  $('tpTiles').querySelectorAll('.tile:not(.used)').forEach((el) => el.addEventListener('click', async () => {
    if (gen !== tpGen) return;                           // stale-render click
    const i = tp.slots.indexOf(null);
    if (i === -1) return;
    tp.slots[i] = el.dataset.c;
    const sayAs = (tp.lang === 'en' && EN_LETTER_SOUNDS[el.dataset.c]) || el.dataset.c;
    speak(sayAs, tp.lang);
    renderEjaanTiles();
    if (tp.slots.indexOf(null) === -1) {
      const ok = tp.slots.join('') === tp.letters.join('');
      if (ok) {
        speak(tp.word, tp.lang);             // fire-and-continue — never freeze the advance
        tpWordDone(!tp.wrongThisWord);
      } else {
        tp.wrongThisWord = true;
        const tr = pick(TRY_AGAIN);
        await speak(tr.en, 'en');
        tp.slots = new Array(tp.letters.length).fill(null);
        renderEjaanTiles();
        speak(tp.word, tp.lang);
      }
    }
  }));
}

/* ---------- 中文 听写: write each character from memory ---------- */
function renderTingxie() {
  tp.chars = tp.word.replace(/[^一-鿿]/g, '').split('');
  if (!tp.chars.length) { tp.idx++; nextTestWord(); return; }   // skip non-hanzi lines
  tp.charIdx = 0;
  tp.hinted = false;
  const showWord = tp.stage === 1 ? `<div class="tp-showword zh">${tp.word}</div>`
    : (tp.stage === 2 ? `<div class="tp-showword zh fading">${tp.word}</div>` : '');
  $('testArea').innerHTML = `
    <div class="pet-card test-card">
      ${tpProgressHTML()}
      ${showWord}
      <div class="flu-row">
        <button class="iconbtn" id="tpHear">🔊<span class="lbl">${t('hear_it')}</span></button>
        <button class="iconbtn" id="tpHint">💡<span class="lbl">${t('tp_hint')}</span></button>
      </div>
      <div class="tp-charboxes" id="tpCharBoxes"></div>
      <div id="tpTraceBox"></div>
    </div>`;
  $('tpHear').addEventListener('click', () => speak(tp.word, 'zh'));
  $('tpHint').addEventListener('click', tpShowHint);
  speak(tp.word, 'zh');
  renderTingxieChar();
}

function renderTingxieChar() {
  $('tpCharBoxes').innerHTML = tp.chars.map((c, i) =>
    `<span class="tp-charbox ${i < tp.charIdx ? 'done' : (i === tp.charIdx ? 'now' : '')}">${i < tp.charIdx ? c : '＿'}</span>`).join('');
  const box = $('tpTraceBox');
  box.innerHTML = '';
  tp.writer = null;
  const ch = tp.chars[tp.charIdx];
  if (typeof HanziWriter !== 'undefined') {
    try {
      tp.writer = HanziWriter.create('tpTraceBox', ch, {
        width: 280, height: 280, padding: 12,
        showCharacter: false,
        showOutline: tp.stage === 1,                       // Copy stage traces over the outline
        strokeColor: '#3A352C', drawingColor: '#1F6F8B', drawingWidth: 24,
        highlightOnComplete: true, highlightColor: '#2E8B57',
        leniency: tp.stage === 1 ? 1.4 : 1.8,              // memory-writing must be forgiving
        acceptBackwardsStrokes: true,                      // dyslexia-friendly
        charDataLoader: (char) =>
          fetch(`hanzi-data/${encodeURIComponent(char)}.json`)
            .then((r) => { if (!r.ok) throw new Error('miss'); return r.json(); })
            .catch(() =>
              fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`)
                .then((r) => r.json())),
        onLoadCharDataError: () => tpFreeDraw(ch)
      });
      tp.writer.quiz({
        showHintAfterMisses: 3,                            // engine flashes the stroke when he's stuck
        onComplete: (summary) => tpCharDone((summary && summary.totalMistakes || 0) <= 3 && !tp.hinted)
      });
      return;
    } catch (e) { /* fall through */ }
  }
  tpFreeDraw(ch);
}

function tpShowHint() {
  tp.hinted = true;                                        // hints are fine — but the word re-queues
  if (tp.writer) {
    tp.writer.showOutline();
    setTimeout(() => { try { tp.writer.hideOutline(); } catch (e) {} }, 3500);
  }
}

/* offline / missing-stroke-data fallback: free drawing + parent judges */
function tpFreeDraw(ch) {
  const box = $('tpTraceBox');
  box.innerHTML = `
    <div class="trace-fallback">
      <canvas id="tpCanvas" width="280" height="280"></canvas>
    </div>
    <div class="flu-row">
      <button class="iconbtn" id="tpJudgeOk">✔️<span class="lbl">OK</span></button>
      <button class="iconbtn" id="tpJudgeNo">✖️</button>
      <button class="iconbtn small" id="tpClear">🧽</button>
    </div>`;
  const cv = $('tpCanvas');
  const g = cv.getContext('2d');
  g.lineWidth = 14; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#1F6F8B';
  let down = false;
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)];
  };
  cv.addEventListener('pointerdown', (e) => { down = true; const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); e.preventDefault(); });
  cv.addEventListener('pointermove', (e) => { if (!down) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); e.preventDefault(); });
  ['pointerup', 'pointerleave'].forEach((ev) => cv.addEventListener(ev, () => down = false));
  $('tpClear').addEventListener('click', () => g.clearRect(0, 0, cv.width, cv.height));
  $('tpJudgeOk').addEventListener('click', () => tpCharDone(true));
  $('tpJudgeNo').addEventListener('click', () => tpCharDone(false));
}

function tpCharDone(ok) {
  if (!ok) tp.wrongThisWord = true;
  tp.charIdx++;
  tp.hinted = false;
  if (tp.charIdx >= tp.chars.length) {
    speak(tp.word, 'zh');
    tpWordDone(!tp.wrongThisWord);
  } else {
    renderTingxieChar();
  }
}

/* ---------- round results + re-queue of missed words ---------- */
function finishTestRound() {
  const missed = [...tp.missed];
  const right = tp.queue.length - missed.length;
  if (!missed.length) {
    $('testArea').innerHTML = `
      <div class="pet-card test-card">
        <div class="catch-burst">🎉🎉🎉</div>
        <div class="catch-name">${t('tp_perfect')}</div>
        <button class="iconbtn flu-go" id="tpDoneBtn">🏁<span class="lbl">${t('tp_done')}</span></button>
      </div>`;
    speak(pick(PRAISE).en, 'en');
    $('tpDoneBtn').addEventListener('click', () => renderTestHome(tp.lang));
    return;
  }
  $('testArea').innerHTML = `
    <div class="pet-card test-card">
      <div class="catch-name">${t('tp_score', { r: right, n: tp.queue.length })}</div>
      <div class="tp-list">${missed.map((w) => `<span class="flu-chip tp-missed">${w}</span>`).join('')}</div>
      <div class="flu-row">
        <button class="iconbtn flu-go" id="tpAgainBtn">🔁<span class="lbl">${t('tp_again')}</span></button>
        <button class="iconbtn" id="tpDoneBtn">🏁<span class="lbl">${t('tp_done')}</span></button>
      </div>
    </div>`;
  $('tpAgainBtn').addEventListener('click', () => {
    tp.queue = shuffle(missed); tp.idx = 0; tp.missed = new Set(); tp.round++;
    nextTestWord();
  });
  $('tpDoneBtn').addEventListener('click', () => renderTestHome(tp.lang));
}
