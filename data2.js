/* =========================================================================
   Baca Buddy v2 — interactive-activity content
   Research-driven (see RESEARCH.md):
   - Chinese: character-STRUCTURE training (radicals/components, stroke order)
     and morpheme/homophone awareness are the proven levers (g=0.70-0.87).
   - EN/BM: systematic phonics + syllable-grain blending (only confirmed
     intervention class, g'≈0.32); Malay is syllable-transparent.
   - KSSR alignment: pinyin = scaffold only; Tahun 3 BC writing standards
     cover basic strokes, stroke order, common radicals/components.
   ========================================================================= */

/* ---------- ✍️ TRACE: stroke-order practice characters (simple → harder).
   All are standard simplified chars covered by hanzi-writer stroke data.   */
const TRACE_CHARS = [
  { ch: '一', py: 'yī',    en: 'one',      ms: 'satu',    emoji: '1️⃣' },
  { ch: '二', py: 'èr',    en: 'two',      ms: 'dua',     emoji: '2️⃣' },
  { ch: '三', py: 'sān',   en: 'three',    ms: 'tiga',    emoji: '3️⃣' },
  { ch: '十', py: 'shí',   en: 'ten',      ms: 'sepuluh', emoji: '🔟' },
  { ch: '人', py: 'rén',   en: 'person',   ms: 'orang',   emoji: '🧍' },
  { ch: '大', py: 'dà',    en: 'big',      ms: 'besar',   emoji: '🐘' },
  { ch: '小', py: 'xiǎo',  en: 'small',    ms: 'kecil',   emoji: '🐜' },
  { ch: '口', py: 'kǒu',   en: 'mouth',    ms: 'mulut',   emoji: '👄' },
  { ch: '山', py: 'shān',  en: 'mountain', ms: 'gunung',  emoji: '⛰️' },
  { ch: '门', py: 'mén',   en: 'door',     ms: 'pintu',   emoji: '🚪' },
  { ch: '子', py: 'zǐ',    en: 'child',    ms: 'anak',    emoji: '👶' },
  { ch: '女', py: 'nǚ',    en: 'girl',     ms: 'perempuan', emoji: '👧' },
  { ch: '日', py: 'rì',    en: 'sun',      ms: 'matahari', emoji: '☀️' },
  { ch: '月', py: 'yuè',   en: 'moon',     ms: 'bulan',   emoji: '🌙' },
  { ch: '水', py: 'shuǐ',  en: 'water',    ms: 'air',     emoji: '💧' },
  { ch: '火', py: 'huǒ',   en: 'fire',     ms: 'api',     emoji: '🔥' },
  { ch: '木', py: 'mù',    en: 'wood',     ms: 'kayu',    emoji: '🪵' },
  { ch: '手', py: 'shǒu',  en: 'hand',     ms: 'tangan',  emoji: '✋' },
  { ch: '心', py: 'xīn',   en: 'heart',    ms: 'hati',    emoji: '❤️' },
  { ch: '天', py: 'tiān',  en: 'sky',      ms: 'langit',  emoji: '🌤️' },
  { ch: '中', py: 'zhōng', en: 'middle',   ms: 'tengah',  emoji: '🎯' },
  { ch: '王', py: 'wáng',  en: 'king',     ms: 'raja',    emoji: '👑' },
  { ch: '牛', py: 'niú',   en: 'cow',      ms: 'lembu',   emoji: '🐮' },
  { ch: '马', py: 'mǎ',    en: 'horse',    ms: 'kuda',    emoji: '🐴' },
  { ch: '鸟', py: 'niǎo',  en: 'bird',     ms: 'burung',  emoji: '🐦' },
  { ch: '白', py: 'bái',   en: 'white',    ms: 'putih',   emoji: '⚪' },
  { ch: '田', py: 'tián',  en: 'field',    ms: 'sawah',   emoji: '🌾' },
  { ch: '目', py: 'mù',    en: 'eye',      ms: 'mata',    emoji: '👁️' },
  { ch: '耳', py: 'ěr',    en: 'ear',      ms: 'telinga', emoji: '👂' },
  { ch: '头', py: 'tóu',   en: 'head',     ms: 'kepala',  emoji: '🙂' },
  { ch: '米', py: 'mǐ',    en: 'rice',     ms: 'beras',   emoji: '🍚' },
  { ch: '虫', py: 'chóng', en: 'insect',   ms: 'serangga', emoji: '🐛' },
  { ch: '好', py: 'hǎo',   en: 'good',     ms: 'baik',    emoji: '👍' },
  { ch: '我', py: 'wǒ',    en: 'me',       ms: 'saya',    emoji: '🙋' },
  { ch: '鱼', py: 'yú',    en: 'fish',     ms: 'ikan',    emoji: '🐟' },
  { ch: '雨', py: 'yǔ',    en: 'rain',     ms: 'hujan',   emoji: '🌧️' }
];

/* ---------- 🧱 BUILD: characters decomposed into teaching components.
   `parts` = learner-friendly component split (canonical display order).     */
const COMPONENT_CHARS = [
  { ch: '好', py: 'hǎo',   en: 'good',    emoji: '👍', parts: ['女', '子'] },
  { ch: '明', py: 'míng',  en: 'bright',  emoji: '🌞', parts: ['日', '月'] },
  { ch: '林', py: 'lín',   en: 'woods',   emoji: '🌲', parts: ['木', '木'] },
  { ch: '森', py: 'sēn',   en: 'forest',  emoji: '🌳', parts: ['木', '木', '木'] },
  { ch: '从', py: 'cóng',  en: 'follow',  emoji: '🚶', parts: ['人', '人'] },
  { ch: '双', py: 'shuāng', en: 'pair',   emoji: '✌️', parts: ['又', '又'] },
  { ch: '朋', py: 'péng',  en: 'friend',  emoji: '🧑‍🤝‍🧑', parts: ['月', '月'] },
  { ch: '尖', py: 'jiān',  en: 'sharp',   emoji: '📌', parts: ['小', '大'] },
  { ch: '尘', py: 'chén',  en: 'dust',    emoji: '💨', parts: ['小', '土'] },
  { ch: '男', py: 'nán',   en: 'boy',     emoji: '👦', parts: ['田', '力'] },
  { ch: '休', py: 'xiū',   en: 'rest',    emoji: '😴', parts: ['亻', '木'] },
  { ch: '们', py: 'men',   en: 'people (plural)', emoji: '👥', parts: ['亻', '门'] },
  { ch: '妈', py: 'mā',    en: 'mum',     emoji: '👩', parts: ['女', '马'] },
  { ch: '吗', py: 'ma',    en: 'question word', emoji: '❓', parts: ['口', '马'] },
  { ch: '爸', py: 'bà',    en: 'dad',     emoji: '👨', parts: ['父', '巴'] },
  { ch: '河', py: 'hé',    en: 'river',   emoji: '🏞️', parts: ['氵', '可'] },
  { ch: '洗', py: 'xǐ',    en: 'wash',    emoji: '🧼', parts: ['氵', '先'] },
  { ch: '草', py: 'cǎo',   en: 'grass',   emoji: '🌿', parts: ['艹', '早'] },
  { ch: '花', py: 'huā',   en: 'flower',  emoji: '🌼', parts: ['艹', '化'] },
  { ch: '字', py: 'zì',    en: 'word',    emoji: '🔤', parts: ['宀', '子'] },
  { ch: '安', py: 'ān',    en: 'peaceful', emoji: '🕊️', parts: ['宀', '女'] },
  { ch: '家', py: 'jiā',   en: 'home',    emoji: '🏠', parts: ['宀', '豕'] },
  { ch: '树', py: 'shù',   en: 'tree',    emoji: '🌳', parts: ['木', '又', '寸'] },
  { ch: '村', py: 'cūn',   en: 'village', emoji: '🏘️', parts: ['木', '寸'] },
  { ch: '和', py: 'hé',    en: 'and',     emoji: '🤝', parts: ['禾', '口'] },
  { ch: '秋', py: 'qiū',   en: 'autumn',  emoji: '🍂', parts: ['禾', '火'] },
  { ch: '星', py: 'xīng',  en: 'star',    emoji: '⭐', parts: ['日', '生'] },
  { ch: '早', py: 'zǎo',   en: 'morning', emoji: '🌅', parts: ['日', '十'] },
  { ch: '灯', py: 'dēng',  en: 'lamp',    emoji: '💡', parts: ['火', '丁'] },
  { ch: '坐', py: 'zuò',   en: 'sit',     emoji: '🪑', parts: ['人', '人', '土'] },
  { ch: '他', py: 'tā',    en: 'he',      emoji: '👦', parts: ['亻', '也'] },
  { ch: '她', py: 'tā',    en: 'she',     emoji: '👧', parts: ['女', '也'] },
  { ch: '地', py: 'dì',    en: 'ground',  emoji: '🌍', parts: ['土', '也'] },
  { ch: '池', py: 'chí',   en: 'pond',    emoji: '💧', parts: ['氵', '也'] },
  { ch: '问', py: 'wèn',   en: 'ask',     emoji: '❓', parts: ['门', '口'] },
  { ch: '间', py: 'jiān',  en: 'room',    emoji: '🚪', parts: ['门', '日'] },
  { ch: '闻', py: 'wén',   en: 'smell',   emoji: '👃', parts: ['门', '耳'] },
  { ch: '闪', py: 'shǎn',  en: 'flash',   emoji: '⚡', parts: ['门', '人'] },
  { ch: '鸣', py: 'míng',  en: 'bird call', emoji: '🐦', parts: ['口', '鸟'] },
  { ch: '蚂', py: 'mǎ',    en: 'ant',     emoji: '🐜', parts: ['虫', '马'] },
  { ch: '泪', py: 'lèi',   en: 'tears',   emoji: '😢', parts: ['氵', '目'] },
  { ch: '信', py: 'xìn',   en: 'letter',  emoji: '✉️', parts: ['亻', '言'] },
  { ch: '想', py: 'xiǎng', en: 'think',   emoji: '💭', parts: ['木', '目', '心'] }
];

/* distractor components for the builder tray */
const RADICAL_POOL = ['口','日','月','木','女','子','亻','氵','艹','宀','门','虫','土','又','寸','心','目','耳','马','鸟','火','田','力','小','大','人','十','王','言','禾','也','石'];

/* ---------- 👯 SAME SOUND: exact-homophone sets (same pinyin incl. tone).
   Targets the morphological/homophone deficit — the verified core Chinese
   dyslexia construct. `hint` = disambiguating compound spoken on reveal.   */
const HOMOPHONE_SETS = [
  { py: 'tā',    opts: [ { ch: '他', emoji: '👦', en: 'he',        hint: '他' },
                         { ch: '她', emoji: '👧', en: 'she',       hint: '她' },
                         { ch: '它', emoji: '🐶', en: 'it',        hint: '它' } ] },
  { py: 'mù',    opts: [ { ch: '木', emoji: '🪵', en: 'wood',      hint: '木头' },
                         { ch: '目', emoji: '👁️', en: 'eye',       hint: '目光' } ] },
  { py: 'shí',   opts: [ { ch: '十', emoji: '🔟', en: 'ten',       hint: '十个' },
                         { ch: '石', emoji: '🪨', en: 'stone',     hint: '石头' },
                         { ch: '时', emoji: '🕐', en: 'time',      hint: '时间' } ] },
  { py: 'yī',    opts: [ { ch: '一', emoji: '1️⃣', en: 'one',       hint: '一个' },
                         { ch: '衣', emoji: '👕', en: 'clothes',   hint: '衣服' },
                         { ch: '医', emoji: '🏥', en: 'doctor',    hint: '医生' } ] },
  { py: 'zuò',   opts: [ { ch: '坐', emoji: '🪑', en: 'sit',       hint: '坐下' },
                         { ch: '做', emoji: '✍️', en: 'do',        hint: '做工' } ] },
  { py: 'yuán',  opts: [ { ch: '元', emoji: '💰', en: 'dollar',    hint: '一元' },
                         { ch: '园', emoji: '🏞️', en: 'garden',    hint: '公园' },
                         { ch: '圆', emoji: '⭕', en: 'round',     hint: '圆形' } ] },
  { py: 'qì',    opts: [ { ch: '气', emoji: '💨', en: 'air',       hint: '空气' },
                         { ch: '汽', emoji: '🚗', en: 'steam/car', hint: '汽车' } ] },
  { py: 'zhōng', opts: [ { ch: '中', emoji: '🎯', en: 'middle',    hint: '中间' },
                         { ch: '钟', emoji: '🕰️', en: 'clock',     hint: '时钟' } ] },
  { py: 'jī',    opts: [ { ch: '鸡', emoji: '🐔', en: 'chicken',   hint: '小鸡' },
                         { ch: '机', emoji: '✈️', en: 'machine',   hint: '飞机' } ] },
  { py: 'xiàng', opts: [ { ch: '象', emoji: '🐘', en: 'elephant',  hint: '大象' },
                         { ch: '像', emoji: '📷', en: 'look like', hint: '好像' } ] },
  { py: 'shù',   opts: [ { ch: '树', emoji: '🌳', en: 'tree',      hint: '大树' },
                         { ch: '数', emoji: '🔢', en: 'number',    hint: '数字' } ] },
  { py: 'xīng',  opts: [ { ch: '星', emoji: '⭐', en: 'star',      hint: '星星' },
                         { ch: '猩', emoji: '🦍', en: 'gorilla',   hint: '猩猩' } ] },
  { py: 'mǎ',    opts: [ { ch: '马', emoji: '🐴', en: 'horse',     hint: '马儿' },
                         { ch: '蚂', emoji: '🐜', en: 'ant',       hint: '蚂蚁' } ] },
  { py: 'qīng',  opts: [ { ch: '青', emoji: '🟢', en: 'green',     hint: '青色' },
                         { ch: '清', emoji: '💧', en: 'clear',     hint: '清水' } ] }
];

/* ---------- 🔤 letter SOUNDS for English phonics (KSSR remedial pathway:
   revisit Y1-2 sound-letter tables; here as TTS-pronounceable approximations
   so tapped letter tiles say the SOUND, not the letter name).              */
const EN_LETTER_SOUNDS = {
  a: 'ah', b: 'buh', c: 'kuh', d: 'duh', e: 'eh', f: 'fff', g: 'guh',
  h: 'huh', i: 'ih', j: 'juh', k: 'kuh', l: 'lll', m: 'mmm', n: 'nnn',
  o: 'o',  p: 'puh', q: 'kwuh', r: 'rrr', s: 'sss', t: 'tuh', u: 'uh',
  v: 'vvv', w: 'wuh', x: 'ks', y: 'yuh', z: 'zzz'
};

/* ---------- 🏃 READ ALONG: repeated-reading fluency sentences.
   Fluency/speed is the persistent deficit in transparent Malay (verified);
   repeated reading is its standard treatment. Sentences use words the child
   already meets in the themes — short, decodable, Tahun-3 friendly.        */
const FLUENCY_SENTENCES = {
  ms: [
    'Saya makan nasi.',
    'Kucing itu kecil.',
    'Ibu minum susu.',
    'Ayah baca buku.',
    'Burung itu biru.',
    'Saya suka epal merah.',
    'Adik main bola.',
    'Gajah itu besar.',
    'Saya ada dua tangan.',
    'Ikan itu dalam air.',
    'Abang lari cepat.',
    'Bunga itu cantik.',
    'Hari ini hujan.',
    'Kakak tulis kata.',
    'Bulan dan bintang di langit.'
  ],
  en: [
    'I eat rice.',
    'The cat is small.',
    'Mother drinks milk.',
    'Father reads a book.',
    'The bird is blue.',
    'I like red apples.',
    'The elephant is big.',
    'I have two hands.',
    'The sun is hot.',
    'I can run fast.',
    'The fish is in the water.',
    'My teacher is kind.',
    'We play at school.',
    'The moon is white.',
    'I love my family.'
  ]
};
