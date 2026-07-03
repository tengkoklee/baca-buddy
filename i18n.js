/* =========================================================================
   Baca Buddy — UI localisation
   The selected language tab drives ALL page text (titles, prompts, buttons).
   t(key)             → string in the current language
   t(key, {n: 5})     → template fill: "{n} ⭐ lagi" → "5 ⭐ lagi"
   applyStaticI18n()  → re-writes the fixed page chrome (called on tab switch)
   ========================================================================= */

'use strict';

const STR = {
  /* menu cards (also used as screen titles) */
  menu_explore: { en: 'Explore',        zh: '看图学词',     ms: 'Jelajah Kata' },
  menu_listen:  { en: 'Listen & Find',  zh: '听一听，找一找', ms: 'Dengar & Cari' },
  menu_match:   { en: 'Match the Word', zh: '图片配字',     ms: 'Padan Kata' },
  menu_build:   { en: 'Sound It Out',   zh: '拼一拼',       ms: 'Eja Perkataan' },
  menu_blend:   { en: 'Blend It',       zh: '拼音节',       ms: 'Cantum Suku Kata' },
  menu_hunt:    { en: 'Sound Hunt',     zh: '找声音',       ms: 'Cari Bunyi' },
  menu_fluent:  { en: 'Read Along',     zh: '朗读',         ms: 'Baca Lancar' },
  menu_trace:   { en: 'Write 写字',     zh: '写字',         ms: 'Tulis 写字' },
  menu_radical: { en: 'Build 拼字',     zh: '部件拼字',     ms: 'Bina 拼字' },
  menu_homo:    { en: 'Same Sound 同音', zh: '同音字',      ms: 'Bunyi Sama 同音' },

  /* other screen titles */
  title_pet:       { en: 'My Pokémon Pal',  zh: '我的宝可梦伙伴', ms: 'Kawan Pokémon Saya' },
  title_tracepick: { en: 'Write 写字 — pick a character', zh: '写字 — 选一个字', ms: 'Tulis 写字 — pilih huruf' },
  pick_topic:      { en: 'pick a topic',    zh: '选一个主题',   ms: 'pilih topik' },

  /* game prompts */
  listen_q: { en: 'Which one did you hear?',  zh: '你听到哪一个？',    ms: 'Yang mana kamu dengar?' },
  match_q:  { en: 'Tap the word. (Tap a card to hear it.)', zh: '点一点正确的字。（点卡片可以听。）', ms: 'Tekan perkataan yang betul. (Tekan kad untuk dengar.)' },
  hunt_q:   { en: 'Which one starts with this sound?', zh: '哪一个是这个声音开头？', ms: 'Yang mana bermula dengan bunyi ini?' },
  homo_q:   { en: 'Which character is this?', zh: '这是哪一个字？',   ms: 'Huruf Cina yang mana?' },
  make_word: { en: 'Make the word for <b>{w}</b>', zh: '拼出 <b>{w}</b> 这个字', ms: 'Bina perkataan untuk <b>{w}</b>' },

  /* buttons */
  hear_it:    { en: 'Hear it',    zh: '听一听',   ms: 'Dengar' },
  hear_again: { en: 'Hear again', zh: '再听一次', ms: 'Dengar lagi' },
  play_all:   { en: 'Play all',   zh: '全部播放', ms: 'Main semua' },
  listen_btn: { en: 'Listen',     zh: '听',       ms: 'Dengar' },
  start:      { en: 'Start',      zh: '开始',     ms: 'Mula' },
  done_btn:   { en: 'Done!',      zh: '好了！',   ms: 'Siap!' },
  next:       { en: 'Next',       zh: '下一个',   ms: 'Seterusnya' },
  watch:      { en: 'Watch',      zh: '看一遍',   ms: 'Tonton' },
  trace_btn:  { en: 'Trace',      zh: '描一描',   ms: 'Surih' },
  list_btn:   { en: 'List',       zh: '列表',     ms: 'Senarai' },
  round:      { en: 'Round {n} / 3', zh: '第 {n} 轮 / 3', ms: 'Pusingan {n} / 3' },

  /* hints */
  home_hint: { en: "Tap a picture and I'll read it to you.", zh: '点一点图片，我会读给你听。', ms: 'Tekan gambar, saya akan bacakan.' },
  flu_hint:  { en: 'Listen first 🔊, then read it out loud — beat your own time, gently!', zh: '先听 🔊，再大声读出来 — 慢慢来，跟自己比！', ms: 'Dengar dulu 🔊, kemudian baca kuat-kuat — lawan masa sendiri!' },

  /* rewards / pokémon */
  to_go:      { en: '{n} ⭐ to go',  zh: '还差 {n} ⭐',  ms: '{n} ⭐ lagi' },
  open_ball:  { en: 'Open! ×{n}',   zh: '打开！×{n}',   ms: 'Buka! ×{n}' },
  pick_a_pal: { en: '💛 Pick a pal!', zh: '💛 选一个伙伴！', ms: '💛 Pilih kawan!' },
  tap_ball:   { en: 'Tap the Pokéball! 点一点精灵球！', zh: '点一点精灵球！', ms: 'Tekan Pokéball itu!' },
  you_caught: { en: 'You caught <b>{name}</b>!', zh: '你抓到了 <b>{name}</b>！', ms: 'Kamu tangkap <b>{name}</b>!' },
  evolving:   { en: 'What?! <b>{name}</b> is evolving!', zh: '咦？！<b>{name}</b> 在进化！', ms: 'Eh?! <b>{name}</b> sedang berevolusi!' },
  evolved:    { en: '🎉 {a} evolved into <b>{b}</b>!', zh: '🎉 {a} 进化成 <b>{b}</b> 了！', ms: '🎉 {a} berevolusi menjadi <b>{b}</b>!' },
  best_friends: { en: '🏆 Best Friends!', zh: '🏆 最好的朋友！', ms: '🏆 Kawan Baik!' },
  choose_pal: { en: 'Choose another pal', zh: '换一个伙伴', ms: 'Tukar kawan' },
  pick_pal_hint: { en: 'Pick your pal! (hearts are saved for each one)', zh: '选一个伙伴！（每只的爱心都会保存）', ms: 'Pilih kawan kamu! (hati disimpan untuk setiap satu)' },
  items_hint: { en: '🍎 +1❤️ · 🎾 +2❤️ · 🎁 +3❤️ — earn items by answering in any game!', zh: '🍎 +1❤️ · 🎾 +2❤️ · 🎁 +3❤️ — 答对题目就能获得道具！', ms: '🍎 +1❤️ · 🎾 +2❤️ · 🎁 +3❤️ — jawab soalan untuk dapat barang!' },
  no_pal_yet: { en: 'Catch your first Pokémon to choose a pal!', zh: '先抓到宝可梦，才能选伙伴！', ms: 'Tangkap Pokémon dahulu untuk pilih kawan!' },
  got_item:   { en: '{e} You got a {item}!', zh: '{e} 你得到了{item}！', ms: '{e} Kamu dapat {item}!' },
  item_berry: { en: 'berry', zh: '果子', ms: 'beri' },
  item_toy:   { en: 'toy',   zh: '玩具', ms: 'mainan' },
  item_gift:  { en: 'gift',  zh: '礼物', ms: 'hadiah' },

  /* test prep (Ejaan / Spelling / 听写) */
  menu_test:   { en: 'Spelling Test', zh: '听写', ms: 'Ejaan' },
  tp_parent_hint: { en: 'For parents 👨‍👩‍👦: type the words from the teacher, one per line. Jayden will drill exactly these for the test.',
                    zh: '给家长 👨‍👩‍👦：输入老师给的听写词语，一行一个。孩子会专门练习这些词。',
                    ms: 'Untuk ibu bapa 👨‍👩‍👦: taip perkataan daripada cikgu, satu setiap baris. Jayden akan berlatih perkataan ini sahaja.' },
  tp_save:     { en: 'Save list',  zh: '保存',     ms: 'Simpan' },
  tp_back:     { en: 'Back',       zh: '返回',     ms: 'Kembali' },
  tp_edit:     { en: 'Edit words', zh: '改词语',   ms: 'Ubah senarai' },
  tp_kid_hint: { en: '{n} words for the test — let\u2019s practise!', zh: '这次听写有 {n} 个词 — 一起练习吧！', ms: '{n} patah perkataan untuk ujian — jom berlatih!' },
  tp_word_n:   { en: 'Word {i} of {n}', zh: '第 {i} 个，共 {n} 个', ms: 'Perkataan {i} / {n}' },
  tp_hint:     { en: 'Hint',       zh: '提示',     ms: 'Bantuan' },
  tp_perfect:  { en: '💯 All correct! Ready for the test!', zh: '💯 全对！听写没问题了！', ms: '💯 Semua betul! Sedia untuk ujian!' },
  tp_score:    { en: '{r} / {n} correct — practise these again:', zh: '对了 {r} / {n} — 再练这些：', ms: '{r} / {n} betul — ulang yang ini:' },
  tp_again:    { en: 'Practise missed', zh: '再练错的', ms: 'Ulang yang salah' },
  tp_done:     { en: 'Done',       zh: '完成',     ms: 'Selesai' },

  /* practice tracker */
  days:      { en: '🔥 {n} day streak', zh: '🔥 连续 {n} 天', ms: '🔥 {n} hari berturut' },
  min_today: { en: '{m}/10 min today',  zh: '今天 {m}/10 分钟', ms: '{m}/10 min hari ini' },
  h_total:   { en: '📚 {h} h total',    zh: '📚 共 {h} 小时',  ms: '📚 jumlah {h} jam' }
};

function uiLang() {
  return (typeof state !== 'undefined' && state && ['en', 'zh', 'ms'].includes(state.lang)) ? state.lang : 'en';
}

function t(key, vars) {
  const e = STR[key];
  let s = e ? (e[uiLang()] || e.en) : key;
  if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}

/* re-write the fixed page chrome in the current language */
function applyStaticI18n() {
  const set = (sel, val, asHTML) => {
    const el = document.querySelector(sel);
    if (el) { if (asHTML) el.innerHTML = val; else el.textContent = val; }
  };
  // screen titles
  set('#screen-listen .screen-title span:last-child', t('menu_listen'));
  set('#screen-match .screen-title span:last-child', t('menu_match'));
  set('#screen-build .screen-title span:last-child', t('menu_build'));
  set('#screen-blend .screen-title span:last-child', t('menu_blend'));
  set('#screen-hunt .screen-title span:last-child', t('menu_hunt'));
  set('#screen-homophone .screen-title span:last-child', t('menu_homo'));
  set('#screen-radical .screen-title span:last-child', t('menu_radical'));
  set('#screen-fluent .screen-title > span:nth-child(2)', t('menu_fluent'));
  set('#screen-tracepick .screen-title span:last-child', t('title_tracepick'));
  set('#screen-pet .screen-title span:last-child', t('title_pet'));
  set('#testTitle', t('menu_test'));
  // prompts
  set('#listenQ', t('listen_q'));
  set('#screen-match .q', t('match_q'));
  set('#screen-hunt .q', t('hunt_q'));
  const homoQ = document.querySelector('#screen-homophone .q');
  if (homoQ) homoQ.childNodes[0].textContent = t('homo_q') + ' ';
  // buttons
  set('#listenReplay .lbl', t('hear_again'));
  set('#flashPlay .lbl', t('play_all'));
  ['buildReplay', 'blendReplay', 'huntReplay', 'homoReplay', 'radicalReplay'].forEach((id) =>
    set('#' + id + ' .lbl', t('hear_it')));
  set('#fluListen .lbl', t('listen_btn'));
  set('#fluNext .lbl', t('next'));
  set('#traceWatch .lbl', t('watch'));
  set('#traceGo .lbl', t('trace_btn'));
  set('#traceBack .lbl', t('list_btn'));
  // hints
  set('#screen-home .hint-line', t('home_hint'));
  set('#screen-fluent .hint-line', t('flu_hint'));
  // live-rendered widgets pick up t() on their next render — nudge them now
  if (typeof renderDose === 'function') renderDose();
  if (typeof renderRewards === 'function') renderRewards();
}
