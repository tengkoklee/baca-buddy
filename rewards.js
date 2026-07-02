/* =========================================================================
   Baca Buddy — Pokémon reward system
   Stars come from EFFORT + SUCCESS only (never removed for mistakes):
   - every correct answer (celebrate) = +1 ⭐
   - every 10 ⭐ = 1 Pokéball
   - hitting the 10-min daily practice goal = +1 bonus ball (once/day)
   - Pokéball → catch a Gen-1 Pokémon into the Pokédex (no duplicates)
   - first catch is always Pikachu; legendaries unlock at collection
     milestones (25/50/75/100/125 caught)
   ========================================================================= */

'use strict';

const STARS_PER_BALL = 10;
const LEGENDARY_MILESTONES = [25, 50, 75, 100, 125];

/* ---------- persistent reward state ---------- */
function rwLoad() {
  try { return JSON.parse(localStorage.getItem('bacaRewards') || '{}'); }
  catch (e) { return {}; }
}
function rwSave(d) { try { localStorage.setItem('bacaRewards', JSON.stringify(d)); } catch (e) {} }
function rwState() {
  const d = rwLoad();
  return {
    stars: d.stars || 0, balls: d.balls || 0,
    caught: d.caught || [], goalDays: d.goalDays || {},
    legendaryPending: d.legendaryPending || 0
  };
}

/* ---------- earning ---------- */
function addStar() {
  const d = rwState();
  d.stars++;
  if (d.stars % STARS_PER_BALL === 0) d.balls++;
  rwSave(d);
  renderRewards();
}

/* daily-goal bonus ball (checked periodically; uses games3 timeDB/dayKey) */
function checkGoalBall() {
  if (typeof timeDB !== 'function') return;
  const d = rwState();
  const today = dayKey();
  if ((timeDB()[today] || 0) >= 600 && !d.goalDays[today]) {
    d.goalDays[today] = true;
    d.balls++;
    rwSave(d);
    renderRewards();
  }
}

/* ---------- catching ---------- */
function weightedPick(pool) {
  const bag = [];
  pool.forEach((p) => { for (let i = 0; i < (p.tier === 'rare' ? 1 : 3); i++) bag.push(p); });
  return pick(bag.length ? bag : pool);
}

function pickCatch() {
  const d = rwState();
  const caught = new Set(d.caught);
  const un = (t) => POKEMON.filter((p) => !caught.has(p.id) && (t ? p.tier === t : p.tier !== 'legendary'));
  if (!caught.size) return POKEMON.find((p) => p.id === 25);          // Pikachu first!
  if (d.legendaryPending > 0 && un('legendary').length) return pick(un('legendary'));
  const pool = un();
  if (pool.length) return weightedPick(pool);
  if (un('legendary').length) return pick(un('legendary'));           // only legendaries left
  return pick(POKEMON);                                               // dex complete — free rethrows
}

function doCatch() {
  const d = rwState();
  if (d.balls <= 0) return null;
  const mon = pickCatch();
  d.balls--;
  if (mon.tier === 'legendary' && d.legendaryPending > 0) d.legendaryPending--;
  if (!d.caught.includes(mon.id)) d.caught.push(mon.id);
  // collection milestone → arm a guaranteed-legendary ball
  if (LEGENDARY_MILESTONES.includes(d.caught.length)) { d.legendaryPending++; d.balls++; }
  rwSave(d);
  return mon;
}

/* ---------- home-screen strip ---------- */
function renderRewards() {
  const el = $('pokeStrip'); if (!el) return;
  const d = rwState();
  const toNext = STARS_PER_BALL - (d.stars % STARS_PER_BALL);
  const pct = Math.round(100 * (d.stars % STARS_PER_BALL) / STARS_PER_BALL);
  el.innerHTML = `
    <button class="poke-ball-btn ${d.balls > 0 ? 'ready' : ''}" id="pokeCatchBtn">
      <span class="pokeball"></span>
      <span class="lbl">${d.balls > 0 ? `Open! ×${d.balls}` : `${toNext} ⭐ to go`}</span>
    </button>
    <span class="dose-meter poke-meter"><span class="dose-fill" style="width:${pct}%"></span></span>
    <span class="dose-item">⭐ ${d.stars}</span>
    <button class="iconbtn small" id="pokeDexBtn">📕 <span class="lbl">Pokédex ${d.caught.length}/151</span></button>`;
  $('pokeCatchBtn').addEventListener('click', openCatch);
  $('pokeDexBtn').addEventListener('click', openDex);
}

/* ---------- catch ceremony ---------- */
let catchMon = null;

function openCatch() {
  const d = rwState();
  if (d.balls <= 0) {
    speak(`${STARS_PER_BALL - (d.stars % STARS_PER_BALL)} more stars to get a Pokeball!`, 'en');
    return;
  }
  catchMon = null;
  $('catchStage').innerHTML = `
    <div class="pokeball big tap-hint" id="catchBall"></div>
    <div class="catch-caption">Tap the Pokéball! 点一点精灵球！</div>`;
  $('catchClose').style.display = 'none';
  $('catchBack').classList.add('open');
  $('catchBall').addEventListener('click', throwBall, { once: true });
}

function throwBall() {
  catchMon = doCatch();
  if (!catchMon) { closeCatch(); return; }
  const ball = $('catchBall');
  ball.classList.remove('tap-hint');
  ball.classList.add('wobbling');
  setTimeout(() => revealCatch(), 1600);
}

async function revealCatch() {
  const mon = catchMon;
  const legend = mon.tier === 'legendary';
  $('catchStage').innerHTML = `
    <div class="catch-burst">✨</div>
    <img class="catch-img ${legend ? 'legendary' : ''}" src="${POKE_ART(mon.id)}"
         alt="${mon.name}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'catch-img-fallback',textContent:'🎁'}))" />
    <div class="catch-name">${legend ? '🌟 ' : ''}You caught <b>${mon.name}</b>!${legend ? ' 🌟' : ''}</div>`;
  $('catchClose').style.display = '';
  confetti();
  await speak(`You caught ${mon.name}!`, 'en');
  speak(legend ? '哇！传说的宝可梦！' : '太棒了！', 'zh');
  renderRewards();
}

function closeCatch() {
  $('catchBack').classList.remove('open');
  renderRewards();
  // more balls waiting? gentle hint
  if (rwState().balls > 0) setTimeout(openCatch, 350);
}

/* ---------- Pokédex ---------- */
function openDex() {
  const d = rwState();
  const caught = new Set(d.caught);
  $('dexCount').textContent = `${d.caught.length} / 151`;
  $('dexGrid').innerHTML = POKEMON.map((p) => caught.has(p.id) ? `
    <div class="dex-cell caught">
      <img loading="lazy" src="${POKE_ART(p.id)}" alt="${p.name}" />
      <div class="dex-name">${p.tier === 'legendary' ? '🌟' : ''}${p.name}</div>
    </div>` : `
    <div class="dex-cell">
      <div class="dex-unknown">?</div>
      <div class="dex-name">#${String(p.id).padStart(3, '0')}</div>
    </div>`).join('');
  show('screen-dex');
}

/* ---------- wire up ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderRewards();
  $('catchClose').addEventListener('click', closeCatch);
  $('catchBack').addEventListener('click', (e) => { if (e.target === $('catchBack') && catchMon) closeCatch(); });
  setInterval(checkGoalBall, 15000);
});
