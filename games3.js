/* =========================================================================
   Baca Buddy v3 — the final evidence-backed modules
   🔍 Sound Hunt  — phonological awareness WITH letters (PA+print principle)
   🏃 Read Along  — repeated-reading fluency (targets the persistent
                    speed deficit in transparent Malay; EN included)
   ⏱️ Dose tracker — streak + daily-minutes so short sessions accumulate
                    past the >15h effective-dose benchmark
   Uses helpers from app.js: $, pick, shuffle, speak, show, celebrate, ctx…
   ========================================================================= */

'use strict';

/* =========================================================================
   🔍 SOUND HUNT — "which one starts with /s/?" (letter always visible)
   ========================================================================= */
let hunt = null;   // { lang, letter, target, choices }

function nextHunt() {
  const lang = questionLang(false);                    // alphabetic langs only
  const words = ctx.theme.words;
  const target = bagPick('hunt:' + ctx.theme.id + ':' + lang, words);
  const letter = spoken(target, lang)[0].toLowerCase();
  // distractors must start with a DIFFERENT letter (that's the whole game)
  const wrong = shuffle(words.filter((w) => spoken(w, lang)[0].toLowerCase() !== letter)).slice(0, 2);
  if (wrong.length < 2) { nextHunt(); return; }        // theme too uniform — rare
  hunt = { lang, letter, target, choices: shuffle([target, ...wrong]) };
  ctx.answer = target; ctx.curLang = lang;

  $('huntStars').textContent = '⭐'.repeat(Math.min(ctx.streak, 5));
  $('huntLetter').textContent = letter.toUpperCase() + ' ' + letter;
  $('huntChoices').innerHTML = hunt.choices.map((w) => `
    <div class="choice hunt-choice" data-emoji="${w.emoji}">
      <div class="tc"><span class="ce">${w.emoji}</span><span class="hw">${spoken(w, lang)}</span></div>
    </div>`).join('');
  $('huntChoices').querySelectorAll('.choice').forEach((el) => {
    el.addEventListener('click', () => answerHunt(el));
  });
  speakHuntSound();
}

function huntSoundText() {
  return hunt.lang === 'en'
    ? (EN_LETTER_SOUNDS[hunt.letter] || hunt.letter)   // the SOUND, not the name
    : hunt.letter;                                     // BM: letter via ms voice is close to its sound
}

async function speakHuntSound() { await speak(huntSoundText(), hunt.lang); }

async function answerHunt(el) {
  const w = hunt.choices.find((c) => c.emoji === el.dataset.emoji);
  await speak(spoken(w, hunt.lang), hunt.lang);        // always read what they tapped
  if (w.emoji === hunt.target.emoji) {
    el.classList.add('correct');
    await celebrate();
    nextHunt();
  } else {
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 400);
    await speakHuntSound();                            // replay the target sound
    ctx.streak = 0;
  }
}

/* =========================================================================
   🏃 READ ALONG — repeated reading with a gentle self-race timer
   Flow: listen to the model → read it yourself 3 times → watch your own
   times improve. Self-competition only; no failure state.
   ========================================================================= */
let flu = null;    // { lang, idx, round, times: [], running, t0, timerId }

function startFluent() {
  const lang = (state.lang === 'en') ? 'en' : 'ms';    // BM default (the fluency deficit)
  flu = { lang, idx: rand(FLUENCY_SENTENCES[lang].length), round: 0, times: [], running: false, t0: 0, timerId: null };
  show('screen-fluent');
  renderFluent();
}

function fluSentence() { return FLUENCY_SENTENCES[flu.lang][flu.idx]; }

function renderFluent() {
  $('fluLangBtns').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.lang === flu.lang));
  $('fluSentence').textContent = fluSentence();
  $('fluSentence').style.fontSize = fluSentence().length > 22 ? '2rem' : '2.6rem';
  $('fluRound').textContent = flu.round >= 3 ? '🎉' : `Round ${flu.round + 1} / 3`;
  $('fluTimer').textContent = '0.0s';
  $('fluGo').innerHTML = '▶️<span class="lbl">Start</span>';
  renderFluTimes();
}

function renderFluTimes() {
  $('fluTimes').innerHTML = flu.times.map((t, i) => {
    const best = Math.min(...flu.times);
    const star = (t === best && flu.times.length > 1) ? ' ⭐' : '';
    return `<span class="flu-chip">R${i + 1}: ${(t / 1000).toFixed(1)}s${star}</span>`;
  }).join('');
}

function fluToggle() {
  if (flu.round >= 3) { fluNext(); return; }
  if (!flu.running) {
    // start the round
    flu.running = true; flu.t0 = Date.now();
    $('fluGo').innerHTML = '✅<span class="lbl">Done!</span>';
    flu.timerId = setInterval(() => {
      $('fluTimer').textContent = ((Date.now() - flu.t0) / 1000).toFixed(1) + 's';
    }, 100);
  } else {
    // finish the round
    clearInterval(flu.timerId);
    flu.running = false;
    const ms = Date.now() - flu.t0;
    flu.times.push(ms);
    flu.round++;
    renderFluTimes();
    if (flu.round >= 3) {
      $('fluGo').innerHTML = '⏭️<span class="lbl">Next</span>';
      $('fluRound').textContent = '🎉';
      const improved = flu.times[2] <= flu.times[0];
      if (improved) { celebrate(); }
      else { speak(pick(PRAISE).en, 'en'); }           // finishing 3 rounds is a win anyway
    } else {
      $('fluGo').innerHTML = '▶️<span class="lbl">Start</span>';
      $('fluRound').textContent = `Round ${flu.round + 1} / 3`;
    }
  }
}

function fluListen() { speak(fluSentence(), flu.lang); }

function fluNext() {
  clearInterval(flu.timerId);
  const n = FLUENCY_SENTENCES[flu.lang].length;
  flu.idx = (flu.idx + 1) % n;
  flu.round = 0; flu.times = []; flu.running = false;
  renderFluent();
}

function fluSetLang(lang) {
  clearInterval(flu.timerId);
  flu.lang = lang; flu.idx = rand(FLUENCY_SENTENCES[lang].length);
  flu.round = 0; flu.times = []; flu.running = false;
  renderFluent();
}

/* =========================================================================
   ⏱️ DOSE TRACKER — streak + daily minutes (goal 10 min/day), total hours
   Research benchmark: >15h cumulative practice for measurable effects.
   ========================================================================= */
const DAY_GOAL_S = 10 * 60;

function timeDB() {
  try { return JSON.parse(localStorage.getItem('bacaTime') || '{}'); } catch (e) { return {}; }
}

function dayKey(offset = 0) {
  const d = new Date(); d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function tickPractice() {
  if (document.visibilityState !== 'visible') return;
  const db = timeDB();
  db[dayKey()] = (db[dayKey()] || 0) + 10;
  try { localStorage.setItem('bacaTime', JSON.stringify(db)); } catch (e) {}
  renderDose();
}

function renderDose() {
  const el = $('doseBar'); if (!el) return;
  const db = timeDB();
  const today = db[dayKey()] || 0;
  // streak = consecutive days (incl. today if goal met) with >= 5 min
  let streak = 0;
  for (let i = (today >= 300 ? 0 : 1); ; i++) {
    if ((db[dayKey(i)] || 0) >= 300) streak++; else break;
    if (i > 3650) break;
  }
  const totalH = Object.values(db).reduce((a, b) => a + b, 0) / 3600;
  const pct = Math.min(100, Math.round(100 * today / DAY_GOAL_S));
  el.innerHTML = `
    <span class="dose-item">🔥 ${streak} day${streak === 1 ? '' : 's'}</span>
    <span class="dose-meter"><span class="dose-fill" style="width:${pct}%"></span></span>
    <span class="dose-item">${Math.floor(today / 60)}/10 min today</span>
    <span class="dose-item">📚 ${totalH.toFixed(1)} h total</span>`;
}

/* =========================================================================
   WIRE-UP
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  $('huntReplay').addEventListener('click', () => hunt && speakHuntSound());
  $('fluGo').addEventListener('click', fluToggle);
  $('fluListen').addEventListener('click', fluListen);
  $('fluNext').addEventListener('click', fluNext);
  $('fluLangBtns').querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', () => fluSetLang(b.dataset.lang));
  });
  setInterval(tickPractice, 10000);
  renderDose();
});
