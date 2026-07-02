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
    legendaryPending: d.legendaryPending || 0,
    items: d.items || { berry: 0, toy: 0, gift: 0 },
    sinceItem: d.sinceItem || 0,
    pet: d.pet || null,                 // active pal's pokemon id
    petStats: d.petStats || {}          // id → { h: hearts, evos: times evolved }
  };
}

/* ---------- earning ---------- */
const ITEM_EVERY_N_STARS = 4;

function rollItem() {
  const r = Math.random();
  return r < 0.6 ? 'berry' : (r < 0.9 ? 'toy' : 'gift');
}

function addStar() {
  const d = rwState();
  d.stars++;
  if (d.stars % STARS_PER_BALL === 0) d.balls++;
  // care-item drop for the Pokémon pal
  d.sinceItem++;
  if (d.sinceItem >= ITEM_EVERY_N_STARS) {
    d.sinceItem = 0;
    const k = rollItem();
    d.items[k] = (d.items[k] || 0) + 1;
    toast(`${CARE_ITEMS[k].emoji} You got a ${CARE_ITEMS[k].name}!`);
  }
  rwSave(d);
  renderRewards();
}

/* ---------- toast (non-blocking pickup notice) ---------- */
function toast(msg) {
  const box = $('toastBox'); if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.classList.add('gone'), 2200);
  setTimeout(() => t.remove(), 2800);
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

/* ---------- buddy of the day: rotates daily through HIS caught Pokémon ---------- */
function buddyOfTheDay() {
  const d = rwState();
  if (!d.caught.length) return null;
  const day = Math.floor(Date.now() / 86400000);        // changes at midnight
  return POKEMON.find((p) => p.id === d.caught[day % d.caught.length]) || null;
}

/* ---------- home-screen strip ---------- */
function renderRewards() {
  const el = $('pokeStrip'); if (!el) return;
  const d = rwState();
  const toNext = STARS_PER_BALL - (d.stars % STARS_PER_BALL);
  const pct = Math.round(100 * (d.stars % STARS_PER_BALL) / STARS_PER_BALL);
  // companion slot: the chosen pal (with level) — or today's buddy until one is chosen
  const p = petInfo(d);
  const companion = p ? { id: p.mon.id, label: `${p.mon.name} Lv${p.level}` }
    : (buddyOfTheDay() ? { id: buddyOfTheDay().id, label: buddyOfTheDay().name } : null);
  const buddyHTML = companion ? `
    <button class="poke-buddy" id="pokeBuddyBtn" title="My Pokémon pal">
      <img src="${POKE_ART(companion.id)}" alt="${companion.label}"
           onerror="this.style.display='none'" />
      <span class="buddy-name">${companion.label}</span>
    </button>` : (d.caught.length ? `
    <button class="poke-buddy" id="pokeBuddyBtn" title="Choose a pal">
      <span class="buddy-name">💛 Pick a pal!</span>
    </button>` : '');
  el.innerHTML = `${buddyHTML}
    <button class="poke-ball-btn ${d.balls > 0 ? 'ready' : ''}" id="pokeCatchBtn">
      <span class="pokeball"></span>
      <span class="lbl">${d.balls > 0 ? `Open! ×${d.balls}` : `${toNext} ⭐ to go`}</span>
    </button>
    <span class="dose-meter poke-meter"><span class="dose-fill" style="width:${pct}%"></span></span>
    <span class="dose-item">⭐ ${d.stars}</span>
    <button class="iconbtn small" id="pokeDexBtn">📕 <span class="lbl">Pokédex ${d.caught.length}/151</span></button>`;
  $('pokeCatchBtn').addEventListener('click', openCatch);
  $('pokeDexBtn').addEventListener('click', openDex);
  const bb = $('pokeBuddyBtn');
  if (bb) bb.addEventListener('click', openPet);   // companion opens the pal screen
  updateCompanion();                               // keep the wandering pal in sync
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
  await playCry(mon.id);
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

/* =========================================================================
   💛 POKÉMON PAL — choose a caught Pokémon; feed / play / gift to level it
   up. Care only ever ADDS (no hunger, no sadness — gentle by design).
   Level = hearts/10 + 1 (max 10). Base forms evolve at Lv3, middle at Lv6.
   ========================================================================= */
function petLevel(h) { return Math.min(10, Math.floor(h / 10) + 1); }

function petInfo(d) {
  if (!d.pet) return null;
  const mon = POKEMON.find((p) => p.id === d.pet);
  const st = d.petStats[d.pet] || { h: 0, evos: 0 };
  return { mon, h: st.h, evos: st.evos, level: petLevel(st.h) };
}

function openPet() { renderPet(); show('screen-pet'); }

function renderPet() {
  const d = rwState();
  const area = $('petArea');
  if (!d.caught.length) {
    area.innerHTML = `<div class="pet-card"><div class="catch-caption">
      Catch your first Pokémon to choose a pal! 先抓到宝可梦，才能选伙伴！</div></div>`;
    return;
  }
  if (!d.pet) { renderPetChooser(); return; }

  const p = petInfo(d);
  const heartsInLevel = p.h % 10;
  const full = '❤️'.repeat(heartsInLevel), empty = '🤍'.repeat(10 - heartsInLevel);
  const maxed = p.level >= 10;
  area.innerHTML = `
    <div class="pet-card">
      <img class="pet-img" id="petImg" src="${POKE_ART(p.mon.id)}" alt="${p.mon.name}"
           onerror="this.style.display='none'" />
      <div class="pet-name">${p.mon.name} · Lv ${p.level}${maxed ? ' 🏆 Best Friends!' : ''}</div>
      <div class="pet-hearts">${maxed ? '❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️' : full + empty}</div>
      <div class="pet-items">
        ${Object.entries(CARE_ITEMS).map(([k, it]) => `
          <button class="iconbtn pet-item ${(d.items[k] || 0) < 1 ? 'none-left' : ''}" data-item="${k}">
            ${it.emoji}<span class="lbl">×${d.items[k] || 0}</span>
          </button>`).join('')}
      </div>
      <p class="hint-line">🍎 +1❤️ · 🎾 +2❤️ · 🎁 +3❤️ — earn items by answering in any game!</p>
      <button class="iconbtn small" id="petSwitch">🔄<span class="lbl">Choose another pal</span></button>
    </div>`;
  $('petImg').addEventListener('click', async () => {
    bouncePet();
    playVoice(p.mon.id);
  });
  area.querySelectorAll('.pet-item').forEach((b) => b.addEventListener('click', () => useItem(b.dataset.item)));
  $('petSwitch').addEventListener('click', renderPetChooser);
}

function renderPetChooser() {
  const d = rwState();
  $('petArea').innerHTML = `
    <p class="hint-line">Pick your pal! 选一个伙伴！ (hearts are saved for each one)</p>
    <div class="dex-grid">${d.caught.map((id) => {
      const p = POKEMON.find((x) => x.id === id);
      const st = d.petStats[id];
      return `
      <div class="dex-cell caught pet-pick ${d.pet === id ? 'active-pet' : ''}" data-id="${id}">
        <img loading="lazy" src="${POKE_ART(id)}" alt="${p.name}" />
        <div class="dex-name">${p.name}${st ? ` · Lv ${petLevel(st.h)}` : ''}</div>
      </div>`;
    }).join('')}</div>`;
  $('petArea').querySelectorAll('.pet-pick').forEach((el) => {
    el.addEventListener('click', () => {
      const d2 = rwState();
      d2.pet = +el.dataset.id;
      if (!d2.petStats[d2.pet]) d2.petStats[d2.pet] = { h: 0, evos: 0 };
      rwSave(d2);
      const mon = POKEMON.find((p) => p.id === d2.pet);
      speak(`${mon.name}, I choose you!`, 'en');
      renderPet(); renderRewards();
    });
  });
}

function bouncePet() {
  const img = $('petImg'); if (!img) return;
  img.classList.remove('pet-bounce'); void img.offsetWidth;
  img.classList.add('pet-bounce');
}

function floatHeart(n) {
  const img = $('petImg'); if (!img) return;
  const r = img.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = '❤️';
    h.style.left = (r.left + r.width * (0.3 + Math.random() * 0.4)) + 'px';
    h.style.top = (r.top + r.height * 0.3) + 'px';
    h.style.animationDelay = (i * 0.18) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1600 + i * 180);
  }
}

const CARE_LINES = {
  berry: { en: (n) => `Yum yum! ${n} loves it!`,       zh: '好吃！' },
  toy:   { en: (n) => `${n} is having so much fun!`,   zh: '好好玩！' },
  gift:  { en: (n) => `${n} loves the present!`,       zh: '好开心！' }
};

async function useItem(kind) {
  const d = rwState();
  if (!d.pet || (d.items[kind] || 0) < 1) return;
  d.items[kind]--;
  const st = d.petStats[d.pet] || { h: 0, evos: 0 };
  const before = petLevel(st.h);
  st.h += CARE_ITEMS[kind].hearts;
  d.petStats[d.pet] = st;
  rwSave(d);
  bouncePet();
  floatHeart(CARE_ITEMS[kind].hearts);
  const mon = POKEMON.find((p) => p.id === d.pet);
  renderPet();
  await speak(CARE_LINES[kind].en(mon.name), 'en');
  speak(CARE_LINES[kind].zh, 'zh');
  const after = petLevel(st.h);
  if (after > before) {
    confetti();
    await speak(`Level ${after}!`, 'en');
    maybeEvolve();
  }
}

/* evolution: base form at Lv3+, evolved form at Lv6+ (never forced) */
function maybeEvolve() {
  const d = rwState();
  const p = petInfo(d);
  if (!p) return;
  let next = EVOLVES[p.mon.id];
  if (!next) return;
  if (Array.isArray(next)) next = pick(next);            // Eevee!
  const needLevel = 3 * (p.evos + 1);
  if (p.level < needLevel) return;
  evolveCeremony(p.mon, POKEMON.find((x) => x.id === next), p);
}

async function evolveCeremony(fromMon, toMon, p) {
  // commit FIRST — state must be consistent even if speech/animation is interrupted
  const d = rwState();
  d.petStats[toMon.id] = { h: (d.petStats[fromMon.id] || { h: 0 }).h, evos: p.evos + 1 };
  delete d.petStats[fromMon.id];
  d.pet = toMon.id;
  if (!d.caught.includes(toMon.id)) d.caught.push(toMon.id);   // evolutions fill the dex too!
  rwSave(d);

  $('catchStage').innerHTML = `
    <img class="catch-img evolving" src="${POKE_ART(fromMon.id)}" alt="${fromMon.name}" />
    <div class="catch-name">What?! <b>${fromMon.name}</b> is evolving!</div>`;
  $('catchClose').style.display = 'none';
  $('catchBack').classList.add('open');
  catchMon = toMon;                                       // lets backdrop/close work
  speak(`What? ${fromMon.name} is evolving!`, 'en');
  await new Promise((r) => setTimeout(r, 1800));          // let the glow build
  $('catchStage').innerHTML = `
    <div class="catch-burst">✨✨✨</div>
    <img class="catch-img legendary" src="${POKE_ART(toMon.id)}" alt="${toMon.name}" />
    <div class="catch-name">🎉 ${fromMon.name} evolved into <b>${toMon.name}</b>!</div>`;
  $('catchClose').style.display = '';
  confetti();
  renderPet(); renderRewards();                           // refresh UI before the speeches
  await playCry(toMon.id);
  await speak(`Congratulations! ${fromMon.name} evolved into ${toMon.name}!`, 'en');
  speak('哇！进化了！太厉害了！', 'zh');
}

/* ---------- Pokémon cries (bundled mp3, offline-safe) ---------- */
const cryEl = new Audio();
cryEl.volume = 0.55;                       // cries are recorded hot — tame them

function playVoice(id) {          // the pal "says its name" (generated, anime-style)
  return new Promise((resolve) => {
    if (!state.sound) { resolve(); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    try {
      cryEl.onended = finish; cryEl.onerror = finish;
      cryEl.src = POKE_VOICE(id);
      cryEl.volume = 0.95;
      cryEl.play().then(null, finish);
    } catch (e) { finish(); }
    setTimeout(finish, 6000);
  });
}

function playCry(id) {
  return new Promise((resolve) => {
    if (!state.sound) { resolve(); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    try {
      cryEl.onended = finish; cryEl.onerror = finish;
      cryEl.src = POKE_CRY(id);
      cryEl.volume = 0.55;
      cryEl.play().then(null, finish);
    } catch (e) { finish(); }
    setTimeout(finish, 4000);
  });
}

/* =========================================================================
   🚶 WANDERING COMPANION — a LIVING character, not a floating icon.
   Uses the animated Gen-5 pixel sprite (tail flicks, wing flaps…), walks
   along the bottom of the screen like it's on the floor — with a shadow,
   turning to face its direction, idle pauses, and the occasional hop.
   Tap it → it cheers Jayden on, then scampers off.
   ========================================================================= */
const WALK_SPEED = 75;                  // px per second — an amble, not a glide
let compTimer = null;                   // next-action timer
let compX = 24;                         // current floor position
let compWalking = false;

function updateCompanion() {
  const el = $('companion'); if (!el) return;
  const p = petInfo(rwState());
  if (!p) {
    el.style.display = 'none';
    if (compTimer) { clearTimeout(compTimer); compTimer = null; }
    return;
  }
  const img = el.querySelector('img');
  const want = POKE_ANI(p.mon.id);
  if (img.dataset.monId !== String(p.mon.id)) {
    img.dataset.monId = p.mon.id;
    img.src = want;                                        // animated pixel sprite
    img.onerror = () => {                                  // rare miss → static art, smaller
      img.onerror = null;
      img.src = POKE_ART(p.mon.id);
      img.classList.add('static-fallback');
    };
  }
  if (el.style.display === 'none') {
    el.style.display = '';
    el.style.transition = 'none';
    compX = 24 + Math.random() * (window.innerWidth * 0.5);
    el.style.transform = `translateX(${compX}px)`;
  }
  if (!compTimer) companionLoop();
}

/* the behaviour brain: walk / idle / hop, then think again */
function companionLoop() {
  const el = $('companion');
  if (!el || el.style.display === 'none') { compTimer = null; return; }
  let waitMs = 1200 + Math.random() * 1800;                // default: stand and idle
  if (document.visibilityState === 'visible' && !compWalking) {
    const roll = Math.random();
    if (roll < 0.6) waitMs = walkSomewhere() + 400;        // amble to a new spot
    else if (roll < 0.8) { hopCompanion(); waitMs = 1400; }
    // else: just stand there being alive (the gif idles by itself)
  }
  compTimer = setTimeout(companionLoop, waitMs);
}

function walkSomewhere() {
  const el = $('companion');
  const maxX = Math.max(80, window.innerWidth - 110);
  const x = 12 + Math.random() * maxX;
  const dist = Math.abs(x - compX);
  const durMs = Math.min(6000, Math.max(900, (dist / WALK_SPEED) * 1000));
  el.querySelector('img').style.transform = x > compX ? 'scaleX(-1)' : '';   // face travel direction
  el.style.transition = `transform ${durMs}ms linear`;
  el.style.transform = `translateX(${x}px)`;
  el.classList.add('walking');
  compWalking = true;
  compX = x;
  setTimeout(() => { el.classList.remove('walking'); compWalking = false; }, durMs);
  return durMs;
}

function hopCompanion() {
  const el = $('companion');
  el.classList.remove('hopping'); void el.offsetWidth;
  el.classList.add('hopping');
  setTimeout(() => el.classList.remove('hopping'), 700);
}

const COMPANION_LINES = [
  { en: 'You can do it!',      zh: '加油！' },
  { en: "Let's learn!",        zh: '一起学习！' },
  { en: 'You are doing great!', zh: '你很棒！' }
];

async function pokeCompanion() {
  const p = petInfo(rwState()); if (!p) return;
  hopCompanion();
  await playVoice(p.mon.id);                // it says its own name!
  const line = pick(COMPANION_LINES);
  await speak(`${p.mon.name} says: ${line.en}`, 'en');
  speak(line.zh, 'zh');
  walkSomewhere();                          // scamper off after saying hi
}

/* ---------- wire up ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderRewards();
  updateCompanion();
  $('companion').querySelector('img').addEventListener('click', pokeCompanion);
  $('catchClose').addEventListener('click', closeCatch);
  $('catchBack').addEventListener('click', (e) => { if (e.target === $('catchBack') && catchMon) closeCatch(); });
  setInterval(checkGoalBall, 15000);
});
