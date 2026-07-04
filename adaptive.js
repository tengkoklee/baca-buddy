/* =========================================================================
   Baca Buddy — adaptive difficulty layer (GraphoGame pattern)
   1) Per-item mastery (Leitner boxes 0-5): every answer moves the item.
   2) Spaced repetition: low-box items are picked far more often; mastered
      items fade to occasional review — never disappear.
   3) Invisible levelling (1-3) per game+language from a rolling accuracy
      EMA: >85% over enough answers → harder; <50% → gently easier.
   All progress lives in localStorage ('bacaMastery') on the child's iPad.
   ========================================================================= */

'use strict';

const BOX_WEIGHT = [8, 5, 3, 2, 1, 0.5];   // box 0 (weak) … box 5 (mastered)
const LEVEL_MIN_ANSWERS = 10;              // answers before a level can move
const LEVEL_UP_EMA = 0.85;
const LEVEL_DOWN_EMA = 0.5;

function adLoad() {
  try { return JSON.parse(localStorage.getItem('bacaMastery') || '{}'); }
  catch (e) { return {}; }
}
function adSave(d) { try { localStorage.setItem('bacaMastery', JSON.stringify(d)); } catch (e) {} }
function adState() {
  const d = adLoad();
  return { items: d.items || {}, levels: d.levels || {}, last: d.last || {} };
}

/* ---------- record every answer ---------- */
function recordAnswer(mode, lang, id, ok) {
  const d = adState();
  const ik = `${mode}|${lang}|${id}`;
  const it = d.items[ik] || { box: 0, seen: 0, right: 0, wrong: 0 };
  it.seen++;
  if (ok) { it.right++; it.box = Math.min(5, it.box + 1); }
  else { it.wrong++; it.box = Math.max(0, it.box - 1); }
  it.t = Date.now();
  d.items[ik] = it;

  // rolling accuracy → level
  const lk = `${mode}|${lang}`;
  const lv = d.levels[lk] || { level: 2, ema: 0.7, n: 0, lastMove: 0 };   // adaptive floor 2
  lv.ema = lv.ema * 0.85 + (ok ? 1 : 0) * 0.15;
  lv.n++;
  const settled = lv.n - lv.lastMove >= LEVEL_MIN_ANSWERS;
  if (settled && lv.ema > LEVEL_UP_EMA && lv.level < 3) {
    lv.level++; lv.ema = 0.7; lv.lastMove = lv.n;
  } else if (settled && lv.ema < LEVEL_DOWN_EMA && lv.level > 1) {
    lv.level--; lv.ema = 0.7; lv.lastMove = lv.n;      // ease off quietly — never a fail state
  }
  d.levels[lk] = lv;
  adSave(d);
}

/* The effective level. A manual difficulty (1/2/3) set in Settings overrides
   the adaptive engine; 'auto' lets accuracy drive it. Default preset = 2. */
function gameLevel(mode, lang) {
  const d = (typeof state !== 'undefined' && state) ? state.difficulty : 2;
  if (d === 1 || d === 2 || d === 3) return d;             // manual fixed level
  const lv = adState().levels[`${mode}|${lang}`];          // 'auto' → adaptive
  return lv ? lv.level : 2;                                // adaptive floor now 2
}

/* difficulty tag for the stars line */
function levelTag(mode, lang) {
  const l = gameLevel(mode, lang);
  return `  ·  Lv${l}`;
}

/* ---------- mastery-weighted item picker (replaces plain shuffle-bags) ---------- */
function adaptivePick(mode, lang, arr, idFn) {
  if (!arr || !arr.length) return undefined;
  if (arr.length === 1) return arr[0];
  const d = adState();
  const lastKey = `${mode}|${lang}`;
  const lastId = d.last[lastKey];
  const pool = arr.filter((x) => idFn(x) !== lastId);      // never the same item twice in a row
  const src = pool.length ? pool : arr;
  let total = 0;
  const weights = src.map((x) => {
    const it = d.items[`${mode}|${lang}|${idFn(x)}`];
    const w = BOX_WEIGHT[it ? it.box : 0];                 // unseen = treated as weak → shows up early
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

/* ---------- per-level knobs ---------- */
const LEVEL_CHOICES = { listen: [3, 4, 6], match: [3, 4, 6], hunt: [3, 4, 5] };
function choiceCount(mode, lang, poolSize) {
  const n = (LEVEL_CHOICES[mode] || [3, 4, 6])[gameLevel(mode, lang) - 1];
  return Math.min(n, poolSize);
}

/* prefer items matching the level's difficulty band; fall back to all */
function levelFilter(arr, fn) {
  const f = arr.filter(fn);
  return f.length >= 2 ? f : arr;
}
