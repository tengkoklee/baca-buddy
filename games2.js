/* =========================================================================
   Baca Buddy v2 — interactive activities
   ✍️ Trace (hanzi stroke order, finger tracing via hanzi-writer + fallback)
   🧱 Build (assemble characters from radicals/components)
   👯 Same Sound (homophone discrimination — morpheme awareness)
   🧩 Blend It (syllable-grain word blending, EN/BM)
   Uses helpers from app.js: $, pick, shuffle, speak, show, celebrate, ctx…
   ========================================================================= */

'use strict';

/* =========================================================================
   ✍️ TRACE — stroke-order tracing
   ========================================================================= */
let traceIdx = 0;
let traceWriter = null;

function openTracePicker() {
  $('traceGrid').innerHTML = TRACE_CHARS.map((c, i) => `
    <div class="choice zh-choice" data-i="${i}">
      <div class="tc"><span class="cw">${c.ch}</span><span class="t2">${c.emoji} ${c.py}</span></div>
    </div>`).join('');
  $('traceGrid').querySelectorAll('.choice').forEach((el) => {
    el.addEventListener('click', () => openTrace(+el.dataset.i));
  });
  show('screen-tracepick');
}

function openTrace(i) {
  traceIdx = i;
  show('screen-trace');
  renderTrace();
}

function renderTrace() {
  const c = TRACE_CHARS[traceIdx];
  $('traceTitle').textContent = `写字 — ${c.ch}`;
  $('traceMeaning').innerHTML = `${c.emoji} <b>${c.ch}</b> <span class="pinyin">${c.py}</span> · ${c.en} · ${c.ms}`;
  $('traceStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  const box = $('traceBox');
  box.innerHTML = '';
  traceWriter = null;
  speak(c.ch, 'zh');

  if (typeof HanziWriter !== 'undefined') {
    try {
      traceWriter = HanziWriter.create('traceBox', c.ch, {
        width: 300, height: 300, padding: 12,
        showCharacter: false, showOutline: true,
        strokeColor: '#3A352C', outlineColor: '#E3D5B3',
        drawingColor: '#1F6F8B', drawingWidth: 24,
        highlightOnComplete: true, highlightColor: '#2E8B57',
        // local stroke data first (bundled, offline-safe), CDN as fallback
        charDataLoader: (char) =>
          fetch(`hanzi-data/${encodeURIComponent(char)}.json`)
            .then((r) => { if (!r.ok) throw new Error('miss'); return r.json(); })
            .catch(() =>
              fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`)
                .then((r) => r.json())),
        onLoadCharDataError: () => fallbackTrace(c)
      });
      startTraceQuiz();
      return;
    } catch (e) { /* fall through to offline mode */ }
  }
  fallbackTrace(c);
}

function startTraceQuiz() {
  if (!traceWriter) return;
  traceWriter.quiz({
    onComplete: async () => {
      await celebrate();
      $('traceStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
    }
  });
}

async function traceWatch() {
  const c = TRACE_CHARS[traceIdx];
  speak(c.ch, 'zh');
  if (traceWriter) {
    traceWriter.cancelQuiz();
    traceWriter.animateCharacter({ onComplete: () => setTimeout(() => { traceWriter.hideCharacter(); startTraceQuiz(); }, 900) });
  }
}

/* Offline fallback: grey model character + free finger-drawing canvas */
function fallbackTrace(c) {
  const box = $('traceBox');
  box.innerHTML = `
    <div class="trace-fallback">
      <div class="model-char">${c.ch}</div>
      <canvas id="traceCanvas" width="300" height="300"></canvas>
    </div>
    <button class="iconbtn small" id="traceClear">🧽 <span class="lbl">Clear</span></button>`;
  const cv = $('traceCanvas');
  const g = cv.getContext('2d');
  g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#1F6F8B';
  let down = false;
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)];
  };
  cv.addEventListener('pointerdown', (e) => { down = true; const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); e.preventDefault(); });
  cv.addEventListener('pointermove', (e) => { if (!down) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); e.preventDefault(); });
  ['pointerup', 'pointerleave'].forEach((ev) => cv.addEventListener(ev, () => down = false));
  $('traceClear').addEventListener('click', () => g.clearRect(0, 0, cv.width, cv.height));
}

function traceStep(dir) {
  traceIdx = (traceIdx + dir + TRACE_CHARS.length) % TRACE_CHARS.length;
  renderTrace();
}

/* =========================================================================
   🧱 BUILD — assemble a character from its components
   ========================================================================= */
let rad = null;   // { item, remaining: {part: count}, placed: [], tray: [] }

function nextRadical() {
  const item = pick(COMPONENT_CHARS);
  const remaining = {};
  item.parts.forEach((p) => remaining[p] = (remaining[p] || 0) + 1);
  const distractors = shuffle(RADICAL_POOL.filter((p) => !item.parts.includes(p))).slice(0, 2);
  rad = { item, remaining, placed: [], tray: shuffle([...item.parts, ...distractors]) };
  $('radicalStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('radicalEmoji').textContent = item.emoji;
  $('radicalHint').innerHTML = `Make the word for <b>${item.en}</b> <span class="pinyin">${item.py}</span>`;
  renderRadical();
  speak(item.ch, 'zh');
}

function renderRadical() {
  const total = rad.item.parts.length;
  $('radicalAssembly').innerHTML =
    Array.from({ length: total }, (_, i) =>
      `<div class="slot zh ${rad.placed[i] ? 'filled' : ''}">${rad.placed[i] || ''}</div>`
    ).join('') + `<div class="rad-equals">=</div><div class="slot zh result">?</div>`;

  // tray: grey out only as many copies as have been placed
  const placedCount = {};
  rad.placed.forEach((p) => placedCount[p] = (placedCount[p] || 0) + 1);
  const seen = {};
  $('radicalTray').innerHTML = rad.tray.map((p) => {
    seen[p] = (seen[p] || 0) + 1;
    const used = seen[p] <= (placedCount[p] || 0);
    return `<div class="tile zh ${used ? 'used' : ''}" data-p="${p}">${p}</div>`;
  }).join('');
  $('radicalTray').querySelectorAll('.tile:not(.used)').forEach((t) => {
    t.addEventListener('click', () => placeRadical(t));
  });
}

async function placeRadical(tileEl) {
  const p = tileEl.dataset.p;
  if (rad.remaining[p] > 0) {
    rad.remaining[p]--;
    rad.placed.push(p);
    renderRadical();
    if (rad.placed.length === rad.item.parts.length) {
      // reveal!
      const res = $('radicalAssembly').querySelector('.result');
      res.textContent = rad.item.ch;
      res.classList.add('reveal');
      await speak(rad.item.ch, 'zh');
      await celebrate();
      nextRadical();
    }
  } else {
    tileEl.classList.add('wrong');
    setTimeout(() => tileEl.classList.remove('wrong'), 400);
    const t = pick(TRY_AGAIN);
    speak(t.zh, 'zh');
  }
}

/* =========================================================================
   👯 SAME SOUND — homophone discrimination (picture → correct hanzi)
   ========================================================================= */
let homo = null;  // { set, target }

function nextHomo() {
  const set = pick(HOMOPHONE_SETS);
  const target = pick(set.opts);
  homo = { set, target };
  $('homoStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('homoEmoji').textContent = target.emoji;
  $('homoPinyin').textContent = set.py;
  $('homoGloss').innerHTML = '';
  $('homoChoices').innerHTML = shuffle(set.opts.slice()).map((o) => `
    <div class="choice zh-choice" data-ch="${o.ch}"><span class="cw">${o.ch}</span></div>`).join('');
  $('homoChoices').querySelectorAll('.choice').forEach((el) => {
    el.addEventListener('click', () => answerHomo(el));
  });
  speak(target.ch, 'zh');
}

async function answerHomo(el) {
  const o = homo.set.opts.find((x) => x.ch === el.dataset.ch);
  if (o.ch === homo.target.ch) {
    el.classList.add('correct');
    // teach the whole family: 马 horse 🐴 · 蚂 ant 🐜 …
    $('homoGloss').innerHTML = homo.set.opts
      .map((x) => `<b>${x.ch}</b> ${x.emoji} ${x.en}`).join(' &nbsp;·&nbsp; ');
    await speak(o.hint, 'zh');
    await celebrate();
    nextHomo();
  } else {
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 400);
    // teach, don't punish: say what THAT one means, then replay the target
    await speak(`${o.hint}`, 'zh');
    speak(homo.target.ch, 'zh');
    ctx.streak = 0;
  }
}

/* =========================================================================
   🧩 BLEND IT — syllable-grain blending (EN / BM)
   Larger-grain than Sound It Out: hear word → order the syllable tiles.
   ========================================================================= */
let blend = null;  // { word, lang, syls, slots, tray }

function nextBlend() {
  const lang = questionLang(false);
  const multi = ctx.theme.words.filter((w) => (lang === 'ms' ? w.ms.syl : w.en.syl).length >= 2);
  const word = pick(multi.length ? multi : ctx.theme.words);
  const syls = (lang === 'ms' ? w2syl(word, 'ms') : w2syl(word, 'en')).slice();
  // one distractor syllable from a different word
  const other = pick(ctx.theme.words.filter((w) => w.emoji !== word.emoji));
  const dPool = w2syl(other, lang).filter((s) => !syls.includes(s));
  const tray = shuffle(dPool.length ? [...syls, dPool[0]] : [...syls]);
  blend = { word, lang, syls, slots: new Array(syls.length).fill(null), tray };
  ctx.answer = word; ctx.curLang = lang;
  $('blendStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('blendEmoji').textContent = word.emoji;
  renderBlend();
  speak(spoken(word, lang), lang);
}

function w2syl(word, lang) { return lang === 'ms' ? word.ms.syl : word.en.syl; }

function renderBlend() {
  $('blendSlots').innerHTML = blend.slots.map((s, i) =>
    `<div class="slot syl ${s ? 'filled' : ''}" data-i="${i}">${s || ''}</div>`).join('');
  $('blendSlots').querySelectorAll('.slot').forEach((el) => {
    el.addEventListener('click', () => {
      const i = +el.dataset.i;
      if (blend.slots[i]) { blend.slots[i] = null; renderBlend(); }
    });
  });

  const placedCount = {};
  blend.slots.filter(Boolean).forEach((s) => placedCount[s] = (placedCount[s] || 0) + 1);
  const seen = {};
  $('blendTiles').innerHTML = blend.tray.map((s) => {
    seen[s] = (seen[s] || 0) + 1;
    const used = seen[s] <= (placedCount[s] || 0);
    return `<div class="tile syl ${used ? 'used' : ''}" data-s="${s}">${s}</div>`;
  }).join('');
  $('blendTiles').querySelectorAll('.tile:not(.used)').forEach((t) => {
    t.addEventListener('click', () => {
      const i = blend.slots.indexOf(null);
      if (i === -1) return;
      blend.slots[i] = t.dataset.s;
      speak(t.dataset.s, blend.lang);        // hear the syllable as you place it
      renderBlend();
      if (blend.slots.indexOf(null) === -1) checkBlend();
    });
  });
}

async function checkBlend() {
  const ok = blend.slots.join('|') === blend.syls.join('|');
  if (ok) {
    $('blendSlots').querySelectorAll('.slot').forEach((s) => s.classList.add('filled'));
    // blend it: syllables slowly, then the whole word
    for (const s of blend.syls) await speak(s, blend.lang);
    await speak(spoken(blend.word, blend.lang), blend.lang);
    await celebrate();
    nextBlend();
  } else {
    await speak(blend.slots.join(' '), blend.lang);   // hear their attempt
    const t = pick(TRY_AGAIN);
    await speak(t.en, 'en');
    blend.slots = new Array(blend.syls.length).fill(null);
    ctx.streak = 0;
    renderBlend();
    speak(spoken(blend.word, blend.lang), blend.lang);
  }
}

/* =========================================================================
   WIRE-UP for v2 controls (runs after app.js init)
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  $('traceWatch').addEventListener('click', traceWatch);
  $('traceGo').addEventListener('click', () => { if (traceWriter) { traceWriter.cancelQuiz(); traceWriter.hideCharacter(); startTraceQuiz(); } });
  $('traceHear').addEventListener('click', () => speak(TRACE_CHARS[traceIdx].ch, 'zh'));
  $('tracePrev').addEventListener('click', () => traceStep(-1));
  $('traceNext').addEventListener('click', () => traceStep(1));
  $('traceBack').addEventListener('click', openTracePicker);
  $('radicalReplay').addEventListener('click', () => rad && speak(rad.item.ch, 'zh'));
  $('homoReplay').addEventListener('click', () => homo && speak(homo.target.ch, 'zh'));
  $('blendReplay').addEventListener('click', () => blend && speak(spoken(blend.word, blend.lang), blend.lang));
});
