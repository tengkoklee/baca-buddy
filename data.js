/* =========================================================================
   Baca Buddy — trilingual vocabulary content
   -------------------------------------------------------------------------
   Each word:
     emoji : the picture (renders everywhere, no image files needed)
     en    : { w: word,  syl: [syllable chunks] }
     zh    : { w: 汉字,   py: pinyin (syllables space-separated) }
     ms    : { w: word,  syl: [syllable chunks] }

   Syllable chunks power the colour-chunked "reading" display and the
   "Sound It Out" letter-building game. They are learner-friendly chunks,
   not strict linguistic syllabification.

   To add words: copy a { ... } line into any theme's `words` array.
   To add a theme: copy a whole { id, emoji, name, pinyin, words } block.
   ========================================================================= */

/* The learner — used for on-screen + spoken greetings. Edit freely. */
const CHILD_NAME = 'Jayden';

const THEMES = [
  {
    id: 'animals', emoji: '🐾',
    name: { en: 'Animals', zh: '动物', ms: 'Haiwan' }, pinyin: 'dòng wù',
    words: [
      { emoji: '🐶', en: { w: 'dog',      syl: ['dog'] },            zh: { w: '狗',   py: 'gǒu' },        ms: { w: 'anjing',  syl: ['an', 'jing'] } },
      { emoji: '🐱', en: { w: 'cat',      syl: ['cat'] },            zh: { w: '猫',   py: 'māo' },        ms: { w: 'kucing',  syl: ['ku', 'cing'] } },
      { emoji: '🐦', en: { w: 'bird',     syl: ['bird'] },           zh: { w: '鸟',   py: 'niǎo' },       ms: { w: 'burung',  syl: ['bu', 'rung'] } },
      { emoji: '🐟', en: { w: 'fish',     syl: ['fish'] },           zh: { w: '鱼',   py: 'yú' },         ms: { w: 'ikan',    syl: ['i', 'kan'] } },
      { emoji: '🐮', en: { w: 'cow',      syl: ['cow'] },            zh: { w: '牛',   py: 'niú' },        ms: { w: 'lembu',   syl: ['lem', 'bu'] } },
      { emoji: '🐴', en: { w: 'horse',    syl: ['horse'] },          zh: { w: '马',   py: 'mǎ' },         ms: { w: 'kuda',    syl: ['ku', 'da'] } },
      { emoji: '🐘', en: { w: 'elephant', syl: ['el', 'e', 'phant'] }, zh: { w: '大象', py: 'dà xiàng' }, ms: { w: 'gajah',   syl: ['ga', 'jah'] } },
      { emoji: '🐵', en: { w: 'monkey',   syl: ['mon', 'key'] },     zh: { w: '猴子', py: 'hóu zi' },     ms: { w: 'monyet',  syl: ['mo', 'nyet'] } },
      { emoji: '🐯', en: { w: 'tiger',    syl: ['ti', 'ger'] },      zh: { w: '老虎', py: 'lǎo hǔ' },     ms: { w: 'harimau', syl: ['ha', 'ri', 'mau'] } },
      { emoji: '🐰', en: { w: 'rabbit',   syl: ['rab', 'bit'] },     zh: { w: '兔子', py: 'tù zi' },      ms: { w: 'arnab',   syl: ['ar', 'nab'] } },
      { emoji: '🦆', en: { w: 'duck',     syl: ['duck'] },           zh: { w: '鸭子', py: 'yā zi' },      ms: { w: 'itik',    syl: ['i', 'tik'] } },
      { emoji: '🐐', en: { w: 'goat',     syl: ['goat'] },           zh: { w: '山羊', py: 'shān yáng' },  ms: { w: 'kambing', syl: ['kam', 'bing'] } },
      { emoji: '🐍', en: { w: 'snake',    syl: ['snake'] },          zh: { w: '蛇',   py: 'shé' },        ms: { w: 'ular',    syl: ['u', 'lar'] } },
      { emoji: '🦋', en: { w: 'butterfly', syl: ['but', 'ter', 'fly'] }, zh: { w: '蝴蝶', py: 'hú dié' }, ms: { w: 'rama-rama', syl: ['ra', 'ma', 'ra', 'ma'] } },
      { emoji: '🐜', en: { w: 'ant',      syl: ['ant'] },            zh: { w: '蚂蚁', py: 'mǎ yǐ' },      ms: { w: 'semut',   syl: ['se', 'mut'] } },
      { emoji: '🐻', en: { w: 'bear',     syl: ['bear'] },           zh: { w: '熊',   py: 'xióng' },      ms: { w: 'beruang', syl: ['be', 'ru', 'ang'] } },
      { emoji: '🦁', en: { w: 'lion',     syl: ['li', 'on'] },       zh: { w: '狮子', py: 'shī zi' },     ms: { w: 'singa',   syl: ['si', 'nga'] } },
      { emoji: '🐸', en: { w: 'frog',     syl: ['frog'] },           zh: { w: '青蛙', py: 'qīng wā' },    ms: { w: 'katak',   syl: ['ka', 'tak'] } },
      { emoji: '🐭', en: { w: 'mouse',    syl: ['mouse'] },          zh: { w: '老鼠', py: 'lǎo shǔ' },    ms: { w: 'tikus',   syl: ['ti', 'kus'] } },
      { emoji: '🦀', en: { w: 'crab',     syl: ['crab'] },           zh: { w: '螃蟹', py: 'páng xiè' },   ms: { w: 'ketam',   syl: ['ke', 'tam'] } },
      { emoji: '🐢', en: { w: 'turtle',   syl: ['tur', 'tle'] },     zh: { w: '乌龟', py: 'wū guī' },     ms: { w: 'kura-kura', syl: ['ku', 'ra', 'ku', 'ra'] } },
      { emoji: '🐝', en: { w: 'bee',      syl: ['bee'] },            zh: { w: '蜜蜂', py: 'mì fēng' },    ms: { w: 'lebah',   syl: ['le', 'bah'] } }
    ]
  },
  {
    id: 'food', emoji: '🍎',
    name: { en: 'Food', zh: '食物', ms: 'Makanan' }, pinyin: 'shí wù',
    words: [
      { emoji: '🍎', en: { w: 'apple',   syl: ['ap', 'ple'] },     zh: { w: '苹果', py: 'píng guǒ' },  ms: { w: 'epal',  syl: ['e', 'pal'] } },
      { emoji: '🍌', en: { w: 'banana',  syl: ['ba', 'na', 'na'] }, zh: { w: '香蕉', py: 'xiāng jiāo' }, ms: { w: 'pisang', syl: ['pi', 'sang'] } },
      { emoji: '🍚', en: { w: 'rice',    syl: ['rice'] },          zh: { w: '米饭', py: 'mǐ fàn' },     ms: { w: 'nasi',  syl: ['na', 'si'] } },
      { emoji: '🍞', en: { w: 'bread',   syl: ['bread'] },         zh: { w: '面包', py: 'miàn bāo' },   ms: { w: 'roti',  syl: ['ro', 'ti'] } },
      { emoji: '🥚', en: { w: 'egg',     syl: ['egg'] },           zh: { w: '鸡蛋', py: 'jī dàn' },     ms: { w: 'telur', syl: ['te', 'lur'] } },
      { emoji: '🥛', en: { w: 'milk',    syl: ['milk'] },          zh: { w: '牛奶', py: 'niú nǎi' },    ms: { w: 'susu',  syl: ['su', 'su'] } },
      { emoji: '🍊', en: { w: 'orange',  syl: ['or', 'ange'] },    zh: { w: '橙',   py: 'chéng' },      ms: { w: 'oren',  syl: ['o', 'ren'] } },
      { emoji: '🐔', en: { w: 'chicken', syl: ['chick', 'en'] },   zh: { w: '鸡',   py: 'jī' },         ms: { w: 'ayam',  syl: ['a', 'yam'] } },
      { emoji: '💧', en: { w: 'water',   syl: ['wa', 'ter'] },     zh: { w: '水',   py: 'shuǐ' },       ms: { w: 'air',   syl: ['a', 'ir'] } },
      { emoji: '🍰', en: { w: 'cake',    syl: ['cake'] },          zh: { w: '蛋糕', py: 'dàn gāo' },    ms: { w: 'kek',   syl: ['kek'] } },
      { emoji: '🍉', en: { w: 'watermelon', syl: ['wa', 'ter', 'me', 'lon'] }, zh: { w: '西瓜', py: 'xī guā' }, ms: { w: 'tembikai', syl: ['tem', 'bi', 'kai'] } },
      { emoji: '🥭', en: { w: 'mango',   syl: ['man', 'go'] },     zh: { w: '芒果', py: 'máng guǒ' },   ms: { w: 'mangga', syl: ['mang', 'ga'] } },
      { emoji: '🍜', en: { w: 'noodles', syl: ['noo', 'dles'] },   zh: { w: '面条', py: 'miàn tiáo' },  ms: { w: 'mi',    syl: ['mi'] } },
      { emoji: '🍵', en: { w: 'tea',     syl: ['tea'] },           zh: { w: '茶',   py: 'chá' },        ms: { w: 'teh',   syl: ['teh'] } },
      { emoji: '🍬', en: { w: 'sweet',   syl: ['sweet'] },         zh: { w: '糖果', py: 'táng guǒ' },   ms: { w: 'gula-gula', syl: ['gu', 'la', 'gu', 'la'] } },
      { emoji: '🥥', en: { w: 'coconut', syl: ['co', 'co', 'nut'] }, zh: { w: '椰子', py: 'yē zi' },    ms: { w: 'kelapa', syl: ['ke', 'la', 'pa'] } }
    ]
  },
  {
    id: 'school', emoji: '🎒',
    name: { en: 'School', zh: '学校', ms: 'Sekolah' }, pinyin: 'xué xiào',
    words: [
      { emoji: '📖', en: { w: 'book',     syl: ['book'] },          zh: { w: '书',   py: 'shū' },        ms: { w: 'buku',     syl: ['bu', 'ku'] } },
      { emoji: '🖊️', en: { w: 'pen',      syl: ['pen'] },           zh: { w: '笔',   py: 'bǐ' },         ms: { w: 'pen',      syl: ['pen'] } },
      { emoji: '✏️', en: { w: 'pencil',   syl: ['pen', 'cil'] },    zh: { w: '铅笔', py: 'qiān bǐ' },    ms: { w: 'pensel',   syl: ['pen', 'sel'] } },
      { emoji: '🎒', en: { w: 'bag',      syl: ['bag'] },           zh: { w: '书包', py: 'shū bāo' },    ms: { w: 'beg',      syl: ['beg'] } },
      { emoji: '👩‍🏫', en: { w: 'teacher',  syl: ['tea', 'cher'] },   zh: { w: '老师', py: 'lǎo shī' },    ms: { w: 'cikgu',    syl: ['cik', 'gu'] } },
      { emoji: '🪑', en: { w: 'chair',    syl: ['chair'] },         zh: { w: '椅子', py: 'yǐ zi' },      ms: { w: 'kerusi',   syl: ['ke', 'ru', 'si'] } },
      { emoji: '📏', en: { w: 'ruler',    syl: ['ru', 'ler'] },     zh: { w: '尺',   py: 'chǐ' },        ms: { w: 'pembaris', syl: ['pem', 'ba', 'ris'] } },
      { emoji: '✂️', en: { w: 'scissors', syl: ['scis', 'sors'] },  zh: { w: '剪刀', py: 'jiǎn dāo' },   ms: { w: 'gunting',  syl: ['gun', 'ting'] } },
      { emoji: '📄', en: { w: 'paper',    syl: ['pa', 'per'] },     zh: { w: '纸',   py: 'zhǐ' },        ms: { w: 'kertas',   syl: ['ker', 'tas'] } },
      { emoji: '🧽', en: { w: 'eraser',   syl: ['e', 'ras', 'er'] }, zh: { w: '橡皮', py: 'xiàng pí' },  ms: { w: 'pemadam',  syl: ['pe', 'ma', 'dam'] } }
    ]
  },
  {
    id: 'body', emoji: '🖐️',
    name: { en: 'My Body', zh: '身体', ms: 'Badan' }, pinyin: 'shēn tǐ',
    words: [
      { emoji: '✋', en: { w: 'hand',   syl: ['hand'] },   zh: { w: '手',   py: 'shǒu' },      ms: { w: 'tangan',  syl: ['ta', 'ngan'] } },
      { emoji: '👁️', en: { w: 'eye',    syl: ['eye'] },    zh: { w: '眼睛', py: 'yǎn jing' },  ms: { w: 'mata',    syl: ['ma', 'ta'] } },
      { emoji: '👂', en: { w: 'ear',    syl: ['ear'] },    zh: { w: '耳朵', py: 'ěr duo' },    ms: { w: 'telinga', syl: ['te', 'li', 'nga'] } },
      { emoji: '👃', en: { w: 'nose',   syl: ['nose'] },   zh: { w: '鼻子', py: 'bí zi' },     ms: { w: 'hidung',  syl: ['hi', 'dung'] } },
      { emoji: '👄', en: { w: 'mouth',  syl: ['mouth'] },  zh: { w: '嘴巴', py: 'zuǐ ba' },    ms: { w: 'mulut',   syl: ['mu', 'lut'] } },
      { emoji: '🦶', en: { w: 'foot',   syl: ['foot'] },   zh: { w: '脚',   py: 'jiǎo' },      ms: { w: 'kaki',    syl: ['ka', 'ki'] } },
      { emoji: '🦷', en: { w: 'tooth',  syl: ['tooth'] },  zh: { w: '牙齿', py: 'yá chǐ' },    ms: { w: 'gigi',    syl: ['gi', 'gi'] } },
      { emoji: '👅', en: { w: 'tongue', syl: ['tongue'] }, zh: { w: '舌头', py: 'shé tou' },   ms: { w: 'lidah',   syl: ['li', 'dah'] } },
      { emoji: '💇', en: { w: 'hair',   syl: ['hair'] },   zh: { w: '头发', py: 'tóu fa' },    ms: { w: 'rambut',  syl: ['ram', 'but'] } },
      { emoji: '😀', en: { w: 'face',   syl: ['face'] },   zh: { w: '脸',   py: 'liǎn' },      ms: { w: 'muka',    syl: ['mu', 'ka'] } }
    ]
  },
  {
    id: 'family', emoji: '👨‍👩‍👧‍👦',
    name: { en: 'Family', zh: '家人', ms: 'Keluarga' }, pinyin: 'jiā rén',
    words: [
      { emoji: '👨', en: { w: 'father',      syl: ['fa', 'ther'] },        zh: { w: '爸爸', py: 'bà ba' },  ms: { w: 'ayah',     syl: ['a', 'yah'] } },
      { emoji: '👩', en: { w: 'mother',      syl: ['mo', 'ther'] },        zh: { w: '妈妈', py: 'mā ma' },  ms: { w: 'ibu',      syl: ['i', 'bu'] } },
      { emoji: '👦', en: { w: 'brother',     syl: ['bro', 'ther'] },       zh: { w: '哥哥', py: 'gē ge' },  ms: { w: 'abang',    syl: ['a', 'bang'] } },
      { emoji: '👧', en: { w: 'sister',      syl: ['sis', 'ter'] },        zh: { w: '姐姐', py: 'jiě jie' }, ms: { w: 'kakak',   syl: ['ka', 'kak'] } },
      { emoji: '👶', en: { w: 'baby',        syl: ['ba', 'by'] },          zh: { w: '宝宝', py: 'bǎo bao' }, ms: { w: 'bayi',    syl: ['ba', 'yi'] } },
      { emoji: '👴', en: { w: 'grandfather', syl: ['grand', 'fa', 'ther'] }, zh: { w: '爷爷', py: 'yé ye' }, ms: { w: 'datuk',   syl: ['da', 'tuk'] } },
      { emoji: '👵', en: { w: 'grandmother', syl: ['grand', 'mo', 'ther'] }, zh: { w: '奶奶', py: 'nǎi nai' }, ms: { w: 'nenek',  syl: ['ne', 'nek'] } },
      { emoji: '🧑‍🤝‍🧑', en: { w: 'friend',   syl: ['friend'] },            zh: { w: '朋友', py: 'péng you' }, ms: { w: 'kawan',  syl: ['ka', 'wan'] } },
      { emoji: '👨‍👩‍👧‍👦', en: { w: 'family',   syl: ['fa', 'mi', 'ly'] },   zh: { w: '家人', py: 'jiā rén' }, ms: { w: 'keluarga', syl: ['ke', 'lu', 'ar', 'ga'] } }
    ]
  },
  {
    id: 'colours', emoji: '🎨',
    name: { en: 'Colours', zh: '颜色', ms: 'Warna' }, pinyin: 'yán sè',
    words: [
      { emoji: '🔴', en: { w: 'red',    syl: ['red'] },        zh: { w: '红色', py: 'hóng sè' },     ms: { w: 'merah',  syl: ['me', 'rah'] } },
      { emoji: '🔵', en: { w: 'blue',   syl: ['blue'] },       zh: { w: '蓝色', py: 'lán sè' },      ms: { w: 'biru',   syl: ['bi', 'ru'] } },
      { emoji: '🟢', en: { w: 'green',  syl: ['green'] },      zh: { w: '绿色', py: 'lǜ sè' },       ms: { w: 'hijau',  syl: ['hi', 'jau'] } },
      { emoji: '🟡', en: { w: 'yellow', syl: ['yel', 'low'] }, zh: { w: '黄色', py: 'huáng sè' },    ms: { w: 'kuning', syl: ['ku', 'ning'] } },
      { emoji: '⚫', en: { w: 'black',  syl: ['black'] },      zh: { w: '黑色', py: 'hēi sè' },      ms: { w: 'hitam',  syl: ['hi', 'tam'] } },
      { emoji: '⚪', en: { w: 'white',  syl: ['white'] },      zh: { w: '白色', py: 'bái sè' },      ms: { w: 'putih',  syl: ['pu', 'tih'] } },
      { emoji: '🟠', en: { w: 'orange', syl: ['or', 'ange'] }, zh: { w: '橙色', py: 'chéng sè' },    ms: { w: 'jingga', syl: ['jing', 'ga'] } },
      { emoji: '🟣', en: { w: 'purple', syl: ['pur', 'ple'] }, zh: { w: '紫色', py: 'zǐ sè' },       ms: { w: 'ungu',   syl: ['u', 'ngu'] } },
      { emoji: '🟤', en: { w: 'brown',  syl: ['brown'] },      zh: { w: '棕色', py: 'zōng sè' },     ms: { w: 'coklat', syl: ['cok', 'lat'] } }
    ]
  },
  {
    id: 'nature', emoji: '🌳',
    name: { en: 'Nature', zh: '大自然', ms: 'Alam' }, pinyin: 'dà zì rán',
    words: [
      { emoji: '🌳', en: { w: 'tree',     syl: ['tree'] },          zh: { w: '树',   py: 'shù' },        ms: { w: 'pokok',    syl: ['po', 'kok'] } },
      { emoji: '🌼', en: { w: 'flower',   syl: ['flow', 'er'] },    zh: { w: '花',   py: 'huā' },        ms: { w: 'bunga',    syl: ['bu', 'nga'] } },
      { emoji: '☀️', en: { w: 'sun',      syl: ['sun'] },           zh: { w: '太阳', py: 'tài yáng' },   ms: { w: 'matahari', syl: ['ma', 'ta', 'ha', 'ri'] } },
      { emoji: '🌙', en: { w: 'moon',     syl: ['moon'] },          zh: { w: '月亮', py: 'yuè liang' },  ms: { w: 'bulan',    syl: ['bu', 'lan'] } },
      { emoji: '⭐', en: { w: 'star',     syl: ['star'] },          zh: { w: '星星', py: 'xīng xing' },  ms: { w: 'bintang',  syl: ['bin', 'tang'] } },
      { emoji: '🌧️', en: { w: 'rain',     syl: ['rain'] },          zh: { w: '雨',   py: 'yǔ' },         ms: { w: 'hujan',    syl: ['hu', 'jan'] } },
      { emoji: '☁️', en: { w: 'cloud',    syl: ['cloud'] },         zh: { w: '云',   py: 'yún' },        ms: { w: 'awan',     syl: ['a', 'wan'] } },
      { emoji: '🌊', en: { w: 'sea',      syl: ['sea'] },           zh: { w: '海',   py: 'hǎi' },        ms: { w: 'laut',     syl: ['la', 'ut'] } },
      { emoji: '⛰️', en: { w: 'mountain', syl: ['moun', 'tain'] },  zh: { w: '山',   py: 'shān' },       ms: { w: 'gunung',   syl: ['gu', 'nung'] } },
      { emoji: '🏞️', en: { w: 'river',    syl: ['ri', 'ver'] },     zh: { w: '河',   py: 'hé' },         ms: { w: 'sungai',   syl: ['su', 'ngai'] } }
    ]
  },
  {
    id: 'actions', emoji: '🏃',
    name: { en: 'Actions', zh: '动作', ms: 'Perbuatan' }, pinyin: 'dòng zuò',
    words: [
      { emoji: '🍴', en: { w: 'eat',   syl: ['eat'] },   zh: { w: '吃',   py: 'chī' },        ms: { w: 'makan', syl: ['ma', 'kan'] } },
      { emoji: '🥤', en: { w: 'drink', syl: ['drink'] }, zh: { w: '喝',   py: 'hē' },         ms: { w: 'minum', syl: ['mi', 'num'] } },
      { emoji: '🏃', en: { w: 'run',   syl: ['run'] },   zh: { w: '跑',   py: 'pǎo' },        ms: { w: 'lari',  syl: ['la', 'ri'] } },
      { emoji: '🚶', en: { w: 'walk',  syl: ['walk'] },  zh: { w: '走',   py: 'zǒu' },        ms: { w: 'jalan', syl: ['ja', 'lan'] } },
      { emoji: '🤸', en: { w: 'jump',  syl: ['jump'] },  zh: { w: '跳',   py: 'tiào' },       ms: { w: 'lompat', syl: ['lom', 'pat'] } },
      { emoji: '😴', en: { w: 'sleep', syl: ['sleep'] }, zh: { w: '睡觉', py: 'shuì jiào' },  ms: { w: 'tidur', syl: ['ti', 'dur'] } },
      { emoji: '📚', en: { w: 'read',  syl: ['read'] },  zh: { w: '读',   py: 'dú' },         ms: { w: 'baca',  syl: ['ba', 'ca'] } },
      { emoji: '✍️', en: { w: 'write', syl: ['write'] }, zh: { w: '写',   py: 'xiě' },        ms: { w: 'tulis', syl: ['tu', 'lis'] } },
      { emoji: '🎤', en: { w: 'sing',  syl: ['sing'] },  zh: { w: '唱歌', py: 'chàng gē' },   ms: { w: 'nyanyi', syl: ['nya', 'nyi'] } },
      { emoji: '⚽', en: { w: 'play',  syl: ['play'] },  zh: { w: '玩',   py: 'wán' },        ms: { w: 'main',  syl: ['ma', 'in'] } }
    ]
  },
  {
    id: 'numbers', emoji: '🔢',
    name: { en: 'Numbers', zh: '数字', ms: 'Nombor' }, pinyin: 'shù zì',
    words: [
      { emoji: '1️⃣', en: { w: 'one',   syl: ['one'] },        zh: { w: '一', py: 'yī' },  ms: { w: 'satu',     syl: ['sa', 'tu'] } },
      { emoji: '2️⃣', en: { w: 'two',   syl: ['two'] },        zh: { w: '二', py: 'èr' },  ms: { w: 'dua',      syl: ['du', 'a'] } },
      { emoji: '3️⃣', en: { w: 'three', syl: ['three'] },      zh: { w: '三', py: 'sān' }, ms: { w: 'tiga',     syl: ['ti', 'ga'] } },
      { emoji: '4️⃣', en: { w: 'four',  syl: ['four'] },       zh: { w: '四', py: 'sì' },  ms: { w: 'empat',    syl: ['em', 'pat'] } },
      { emoji: '5️⃣', en: { w: 'five',  syl: ['five'] },       zh: { w: '五', py: 'wǔ' },  ms: { w: 'lima',     syl: ['li', 'ma'] } },
      { emoji: '6️⃣', en: { w: 'six',   syl: ['six'] },        zh: { w: '六', py: 'liù' }, ms: { w: 'enam',     syl: ['e', 'nam'] } },
      { emoji: '7️⃣', en: { w: 'seven', syl: ['se', 'ven'] },  zh: { w: '七', py: 'qī' },  ms: { w: 'tujuh',    syl: ['tu', 'juh'] } },
      { emoji: '8️⃣', en: { w: 'eight', syl: ['eight'] },      zh: { w: '八', py: 'bā' },  ms: { w: 'lapan',    syl: ['la', 'pan'] } },
      { emoji: '9️⃣', en: { w: 'nine',  syl: ['nine'] },       zh: { w: '九', py: 'jiǔ' }, ms: { w: 'sembilan', syl: ['sem', 'bi', 'lan'] } },
      { emoji: '🔟', en: { w: 'ten',   syl: ['ten'] },        zh: { w: '十', py: 'shí' }, ms: { w: 'sepuluh',  syl: ['se', 'pu', 'luh'] } }
    ]
  }
];

/* Language metadata: colour identity + display label + speech tag. */
const LANGS = {
  en: { label: 'English', short: 'EN', tag: 'en-US', colour: 'var(--en)' },
  zh: { label: '中文',     short: '中', tag: 'zh-CN', colour: 'var(--zh)' },
  ms: { label: 'Melayu',  short: 'BM', tag: 'ms-MY', colour: 'var(--ms)', fallbackTag: 'id-ID' }
};

/* Encouragement — spoken in the child's strong languages (EN + ZH). */
const PRAISE = [
  { en: 'Well done!',   zh: '做得好！' },
  { en: 'Great job!',   zh: '太棒了！' },
  { en: 'You did it!',  zh: '你做到了！' },
  { en: 'Super!',       zh: '真厉害！' },
  { en: 'Wonderful!',   zh: '很好！' },
  { en: 'Brilliant!',   zh: '好极了！' }
];

const TRY_AGAIN = [
  { en: 'Almost! Try again.', zh: '差一点，再试一次。' },
  { en: 'Try again!',         zh: '再试试看！' },
  { en: 'Listen again.',      zh: '再听一次。' }
];
