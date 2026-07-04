/* =========================================================================
   Baca Buddy — adaptive difficulty layer (GraphoGame pattern)
   1) Per-item mastery (Leitner boxes 0-5): every answer moves the item.
   2) Spaced repetition: low-box items picked far more often. A word answered
      with NO mistake is retired until the NEXT DAY (won't show again today).
   3) Difficulty is set by AGE (9/10/11/12) as a base level, then progresses
      up as words are completed and eases down on failure.
   All progress lives in localStorage ('bacaMastery') on the child's iPad.
   ========================================================================= */

'use strict';

const BOX_WEIGHT = [8, 5, 3, 2, 1, 0.5];   // box 0 (weak) … box 5 (mastered)
const LEVEL_MIN_ANSWERS = 8;               // answers before the progress nudge can move
const LEVEL_UP_EMA = 0.85;
const LEVEL_DOWN_EMA = 0.5;
const AGE_BASE = { 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 6, 15: 7 };   // age → base difficulty level
const AUTO_MIN_ANSWERS = 30;               // answers between auto age-promotions

function adLoad() {
  try { return JSON.parse(localStorage.getItem('bacaMastery') || '{}'); }
  catch (e) { return {}; }
}
function adSave(d) { try { localStorage.setItem('bacaMastery', JSON.stringify(d)); } catch (e) {} }
function adState() {
  const d = adLoad();
  return { items: d.items || {}, levels: d.levels || {}, last: d.last || {},
           meta: d.meta || { autoBase: 2, ema: 0.7, n: 0, lastMove: 0 } };   // autoBase 2 = age-10 start
}

/* next local midnight — a clean word hides until then */
function nextMidnight() { const d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime(); }

/* track whether the CURRENT word was stumbled before being answered right */
let _curKey = '', _curMiss = false;

/* ---------- record every answer ---------- */
function recordAnswer(mode, lang, id, ok) {
  const d = adState();
  const ik = `${mode}|${lang}|${id}`;
  if (ik !== _curKey) { _curKey = ik; _curMiss = false; }   // new word → reset miss flag
  const it = d.items[ik] || { box: 0, seen: 0, right: 0, wrong: 0 };
  it.seen++;
  if (ok) {
    it.right++; it.box = Math.min(5, it.box + 1);
    // completed with NO mistake this encounter → retire until tomorrow
    if (!_curMiss) it.retire = nextMidnight();
  } else {
    it.wrong++; it.box = Math.max(0, it.box - 1);
    _curMiss = true;
    it.retire = 0;                                          // a stumble un-retires it
  }
  it.t = Date.now();
  d.items[ik] = it;

  // progress nudge: rolling accuracy pushes the level up (mastery) / down (failure)
  const lk = `${mode}|${lang}`;
  const lv = d.levels[lk] || { level: 2, ema: 0.7, n: 0, lastMove: 0 };
  lv.ema = lv.ema * 0.85 + (ok ? 1 : 0) * 0.15;
  lv.n++;
  const settled = lv.n - lv.lastMove >= LEVEL_MIN_ANSWERS;
  if (settled && lv.ema > LEVEL_UP_EMA && lv.level < 3) {
    lv.level++; lv.ema = 0.7; lv.lastMove = lv.n;           // progress upward with completion
  } else if (!ok && lv.level > 1) {
    lv.level--; lv.ema = 0.6; lv.lastMove = lv.n;           // a failure eases difficulty at once
  }
  d.levels[lk] = lv;

  // ✨ Auto age: global performance slowly promotes (or eases) the base level
  const m = d.meta;
  m.ema = m.ema * 0.92 + (ok ? 1 : 0) * 0.08;
  m.n++;
  const mSettled = m.n - m.lastMove >= AUTO_MIN_ANSWERS;
  if (mSettled && m.ema > 0.85 && m.autoBase < 7) {
    m.autoBase++; m.ema = 0.7; m.lastMove = m.n;          // he has outgrown this level
  } else if (mSettled && m.ema < 0.5 && m.autoBase > 1) {
    m.autoBase--; m.ema = 0.7; m.lastMove = m.n;          // ease the base down gently
  }
  d.meta = m;
  adSave(d);
}

/* Effective level = age base (or the auto base from progress) + nudge, clamped 1-7. */
function gameLevel(mode, lang) {
  const st = adState();
  const age = (typeof state !== 'undefined' && state && state.age) || 'auto';
  const base = age === 'auto' ? st.meta.autoBase : (AGE_BASE[age] || 2);
  const lv = st.levels[`${mode}|${lang}`];
  const nudge = lv ? (lv.level - 2) : 0;                    // per-game nudge -1..+1
  return Math.max(1, Math.min(7, base + nudge));
}

/* the age the app currently treats him as (for display + report) */
function displayAge() {
  const age = (typeof state !== 'undefined' && state && state.age) || 'auto';
  return age === 'auto' ? 8 + adState().meta.autoBase : age;
}

/* difficulty tag for the stars line */
function levelTag(mode, lang) { return `  ·  Lv${gameLevel(mode, lang)}`; }

/* ---------- mastery-weighted item picker ----------
   Skips words retired today (answered perfectly) unless that empties the pool. */
function adaptivePick(mode, lang, arr, idFn) {
  if (!arr || !arr.length) return undefined;
  if (arr.length === 1) return arr[0];
  const d = adState();
  const now = Date.now();
  const lastKey = `${mode}|${lang}`;
  const lastId = d.last[lastKey];
  const notRetired = arr.filter((x) => {
    const it = d.items[`${mode}|${lang}|${idFn(x)}`];
    return !(it && it.retire && it.retire > now);
  });
  let src = (notRetired.length ? notRetired : arr).filter((x) => idFn(x) !== lastId);
  if (!src.length) src = notRetired.length ? notRetired : arr;   // never empty
  let total = 0;
  const weights = src.map((x) => {
    const it = d.items[`${mode}|${lang}|${idFn(x)}`];
    const w = BOX_WEIGHT[it ? it.box : 0];                 // unseen = weak → shows early
    total += w;
    return w;
  });
  let r = Math.random() * total;
  let chosen = src[src.length - 1];
  for (let i = 0; i < src.length; i++) { r -= weights[i]; if (r <= 0) { chosen = src[i]; break; } }
  d.last[lastKey] = idFn(chosen);
  adSave(d);
  return chosen;
}

/* ---------- per-level knobs (4 tiers: ages 9/10/11/12) ---------- */
const LEVEL_CHOICES = { listen: [3, 4, 5, 6, 7, 8, 8], match: [3, 4, 5, 6, 7, 8, 8], hunt: [3, 4, 5, 5, 6, 6, 6] };
function choiceCount(mode, lang, poolSize) {
  const n = (LEVEL_CHOICES[mode] || [3, 4, 5, 6, 7, 8, 8])[gameLevel(mode, lang) - 1];
  return Math.min(n, poolSize);
}

/* prefer items matching the level's difficulty band; fall back to all */
function levelFilter(arr, fn) {
  const f = arr.filter(fn);
  return f.length >= 2 ? f : arr;
}

/* ---------- progress report data (per language) ----------
   Aggregates the mastery boxes across all game modes into per-word status. */
function progressReport(lang) {
  const d = adState();
  const now = Date.now();
  const byWord = {};   // word/id → best box seen across modes
  Object.keys(d.items).forEach((k) => {
    const [mode, l, id] = k.split('|');
    if (l !== lang) return;
    const it = d.items[k];
    const cur = byWord[id];
    if (!cur || it.box > cur.box) byWord[id] = { box: it.box, retire: it.retire || 0, seen: it.seen, right: it.right, wrong: it.wrong };
    else { cur.seen += it.seen; cur.right += it.right; cur.wrong += it.wrong; }
  });
  const words = Object.entries(byWord).map(([id, v]) => ({ id, ...v }));
  const mastered = words.filter((w) => w.box >= 5).length;
  const strong = words.filter((w) => w.box >= 3 && w.box < 5).length;
  const learning = words.filter((w) => w.box >= 1 && w.box < 3).length;
  const struggling = words.filter((w) => w.box === 0 && w.seen > 0).length;
  const retiredToday = words.filter((w) => w.retire > now).length;
  const totalRight = words.reduce((a, w) => a + (w.right || 0), 0);
  const totalSeen = words.reduce((a, w) => a + (w.seen || 0), 0);
  const accuracy = totalSeen ? Math.round(100 * totalRight / totalSeen) : 0;
  // words that most need work (low box, seen at least once)
  const toReview = words.filter((w) => w.box <= 1 && w.seen > 0)
    .sort((a, b) => a.box - b.box).slice(0, 12).map((w) => w.id);
  const level = Math.max(gameLevel('listen', lang), gameLevel('build', lang), gameLevel('trace', lang));
  return { seen: words.length, mastered, strong, learning, struggling, retiredToday, accuracy, toReview, level };
}
