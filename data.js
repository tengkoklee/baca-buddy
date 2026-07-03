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
      { emoji: '🐝', en: { w: 'bee',      syl: ['bee'] },            zh: { w: '蜜蜂', py: 'mì fēng' },    ms: { w: 'lebah',   syl: ['le', 'bah'] } },
      { emoji: '🦌', en: { w: 'deer', syl: ['deer'] }, zh: { w: '鹿', py: 'lù' }, ms: { w: 'rusa', syl: ['ru', 'sa'] } },
      { emoji: '🦈', en: { w: 'shark', syl: ['shark'] }, zh: { w: '鲨鱼', py: 'shā yú' }, ms: { w: 'jerung', syl: ['je', 'rung'] } },
      { emoji: '🐳', en: { w: 'whale', syl: ['whale'] }, zh: { w: '鲸鱼', py: 'jīng yú' }, ms: { w: 'paus', syl: ['pa', 'us'] } },
      { emoji: '🦑', en: { w: 'squid', syl: ['squid'] }, zh: { w: '鱿鱼', py: 'yóu yú' }, ms: { w: 'sotong', syl: ['so', 'tong'] } }
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
      { emoji: '🥥', en: { w: 'coconut', syl: ['co', 'co', 'nut'] }, zh: { w: '椰子', py: 'yē zi' },    ms: { w: 'kelapa', syl: ['ke', 'la', 'pa'] } },
      { emoji: '🌽', en: { w: 'corn', syl: ['corn'] }, zh: { w: '玉米', py: 'yù mǐ' }, ms: { w: 'jagung', syl: ['ja', 'gung'] } },
      { emoji: '🍲', en: { w: 'soup', syl: ['soup'] }, zh: { w: '汤', py: 'tāng' }, ms: { w: 'sup', syl: ['sup'] } },
      { emoji: '🍦', en: { w: 'ice cream', syl: ['ice', 'cream'] }, zh: { w: '冰淇淋', py: 'bīng qí lín' }, ms: { w: 'ais krim', syl: ['ais', 'krim'] } },
      { emoji: '🧂', en: { w: 'salt', syl: ['salt'] }, zh: { w: '盐', py: 'yán' }, ms: { w: 'garam', syl: ['ga', 'ram'] } },
      { emoji: '🧃', en: { w: 'juice', syl: ['juice'] }, zh: { w: '果汁', py: 'guǒ zhī' }, ms: { w: 'jus', syl: ['jus'] } },
      { emoji: '🍪', en: { w: 'biscuit', syl: ['bis', 'cuit'] }, zh: { w: '饼干', py: 'bǐng gān' }, ms: { w: 'biskut', syl: ['bis', 'kut'] } }
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
      { emoji: '🧽', en: { w: 'eraser',   syl: ['e', 'ras', 'er'] }, zh: { w: '橡皮', py: 'xiàng pí' },  ms: { w: 'pemadam',  syl: ['pe', 'ma', 'dam'] } },
      { emoji: '🖍️', en: { w: 'crayon', syl: ['cray', 'on'] }, zh: { w: '蜡笔', py: 'là bǐ' }, ms: { w: 'krayon', syl: ['kra', 'yon'] } },
      { emoji: '📓', en: { w: 'notebook', syl: ['note', 'book'] }, zh: { w: '笔记本', py: 'bǐ jì běn' }, ms: { w: 'buku nota', syl: ['bu', 'ku', 'no', 'ta'] } },
      { emoji: '🧴', en: { w: 'glue', syl: ['glue'] }, zh: { w: '胶水', py: 'jiāo shuǐ' }, ms: { w: 'gam', syl: ['gam'] } },
      { emoji: '💻', en: { w: 'computer', syl: ['com', 'pu', 'ter'] }, zh: { w: '电脑', py: 'diàn nǎo' }, ms: { w: 'komputer', syl: ['kom', 'pu', 'ter'] } },
      { emoji: '🕐', en: { w: 'clock', syl: ['clock'] }, zh: { w: '时钟', py: 'shí zhōng' }, ms: { w: 'jam', syl: ['jam'] } },
      { emoji: '🚪', en: { w: 'door', syl: ['door'] }, zh: { w: '门', py: 'mén' }, ms: { w: 'pintu', syl: ['pin', 'tu'] } },
      { emoji: '🪟', en: { w: 'window', syl: ['win', 'dow'] }, zh: { w: '窗户', py: 'chuāng hu' }, ms: { w: 'tingkap', syl: ['ting', 'kap'] } }
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
      { emoji: '😀', en: { w: 'face',   syl: ['face'] },   zh: { w: '脸',   py: 'liǎn' },      ms: { w: 'muka',    syl: ['mu', 'ka'] } },
      { emoji: '💪', en: { w: 'arm', syl: ['arm'] }, zh: { w: '手臂', py: 'shǒu bì' }, ms: { w: 'lengan', syl: ['le', 'ngan'] } },
      { emoji: '👆', en: { w: 'finger', syl: ['fin', 'ger'] }, zh: { w: '手指', py: 'shǒu zhǐ' }, ms: { w: 'jari', syl: ['ja', 'ri'] } },
      { emoji: '🫄', en: { w: 'stomach', syl: ['sto', 'mach'] }, zh: { w: '肚子', py: 'dù zi' }, ms: { w: 'perut', syl: ['pe', 'rut'] } },
      { emoji: '🙆', en: { w: 'shoulder', syl: ['shoul', 'der'] }, zh: { w: '肩膀', py: 'jiān bǎng' }, ms: { w: 'bahu', syl: ['ba', 'hu'] } },
      { emoji: '🦵', en: { w: 'knee', syl: ['knee'] }, zh: { w: '膝盖', py: 'xī gài' }, ms: { w: 'lutut', syl: ['lu', 'tut'] } },
      { emoji: '🦴', en: { w: 'bone', syl: ['bone'] }, zh: { w: '骨头', py: 'gǔ tou' }, ms: { w: 'tulang', syl: ['tu', 'lang'] } }
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
      { emoji: '👨‍👩‍👧‍👦', en: { w: 'family',   syl: ['fa', 'mi', 'ly'] },   zh: { w: '家人', py: 'jiā rén' }, ms: { w: 'keluarga', syl: ['ke', 'lu', 'ar', 'ga'] } },
      { emoji: '👨‍🦱', en: { w: 'uncle', syl: ['un', 'cle'] }, zh: { w: '叔叔', py: 'shū shu' }, ms: { w: 'pakcik', syl: ['pak', 'cik'] } },
      { emoji: '👩‍🦱', en: { w: 'aunt', syl: ['aunt'] }, zh: { w: '阿姨', py: 'ā yí' }, ms: { w: 'makcik', syl: ['mak', 'cik'] } },
      { emoji: '🧒', en: { w: 'cousin', syl: ['cou', 'sin'] }, zh: { w: '表哥', py: 'biǎo gē' }, ms: { w: 'sepupu', syl: ['se', 'pu', 'pu'] } }
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
      { emoji: '🟤', en: { w: 'brown',  syl: ['brown'] },      zh: { w: '棕色', py: 'zōng sè' },     ms: { w: 'coklat', syl: ['cok', 'lat'] } },
      { emoji: '🩷', en: { w: 'pink', syl: ['pink'] }, zh: { w: '粉红色', py: 'fěn hóng sè' }, ms: { w: 'merah jambu', syl: ['me', 'rah', 'jam', 'bu'] } },
      { emoji: '🩶', en: { w: 'grey', syl: ['grey'] }, zh: { w: '灰色', py: 'huī sè' }, ms: { w: 'kelabu', syl: ['ke', 'la', 'bu'] } }
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
      { emoji: '🏞️', en: { w: 'river',    syl: ['ri', 'ver'] },     zh: { w: '河',   py: 'hé' },         ms: { w: 'sungai',   syl: ['su', 'ngai'] } },
      { emoji: '🏖️', en: { w: 'beach', syl: ['beach'] }, zh: { w: '海滩', py: 'hǎi tān' }, ms: { w: 'pantai', syl: ['pan', 'tai'] } },
      { emoji: '🌲', en: { w: 'forest', syl: ['fo', 'rest'] }, zh: { w: '森林', py: 'sēn lín' }, ms: { w: 'hutan', syl: ['hu', 'tan'] } },
      { emoji: '🪨', en: { w: 'rock', syl: ['rock'] }, zh: { w: '石头', py: 'shí tou' }, ms: { w: 'batu', syl: ['ba', 'tu'] } },
      { emoji: '🍃', en: { w: 'leaf', syl: ['leaf'] }, zh: { w: '叶子', py: 'yè zi' }, ms: { w: 'daun', syl: ['da', 'un'] } },
      { emoji: '🌿', en: { w: 'grass', syl: ['grass'] }, zh: { w: '草', py: 'cǎo' }, ms: { w: 'rumput', syl: ['rum', 'put'] } },
      { emoji: '🔥', en: { w: 'fire', syl: ['fire'] }, zh: { w: '火', py: 'huǒ' }, ms: { w: 'api', syl: ['a', 'pi'] } },
      { emoji: '💨', en: { w: 'wind', syl: ['wind'] }, zh: { w: '风', py: 'fēng' }, ms: { w: 'angin', syl: ['a', 'ngin'] } },
      { emoji: '🌌', en: { w: 'sky', syl: ['sky'] }, zh: { w: '天空', py: 'tiān kōng' }, ms: { w: 'langit', syl: ['la', 'ngit'] } }
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
      { emoji: '⚽', en: { w: 'play',  syl: ['play'] },  zh: { w: '玩',   py: 'wán' },        ms: { w: 'main',  syl: ['ma', 'in'] } },
      { emoji: '🏊', en: { w: 'swim', syl: ['swim'] }, zh: { w: '游泳', py: 'yóu yǒng' }, ms: { w: 'berenang', syl: ['be', 're', 'nang'] } },
      { emoji: '🪁', en: { w: 'fly', syl: ['fly'] }, zh: { w: '飞', py: 'fēi' }, ms: { w: 'terbang', syl: ['ter', 'bang'] } },
      { emoji: '🧘', en: { w: 'sit', syl: ['sit'] }, zh: { w: '坐', py: 'zuò' }, ms: { w: 'duduk', syl: ['du', 'duk'] } },
      { emoji: '🧍', en: { w: 'stand', syl: ['stand'] }, zh: { w: '站', py: 'zhàn' }, ms: { w: 'berdiri', syl: ['ber', 'di', 'ri'] } },
      { emoji: '😄', en: { w: 'laugh', syl: ['laugh'] }, zh: { w: '笑', py: 'xiào' }, ms: { w: 'ketawa', syl: ['ke', 'ta', 'wa'] } },
      { emoji: '😭', en: { w: 'cry', syl: ['cry'] }, zh: { w: '哭', py: 'kū' }, ms: { w: 'menangis', syl: ['me', 'na', 'ngis'] } },
      { emoji: '📖', en: { w: 'open', syl: ['o', 'pen'] }, zh: { w: '开', py: 'kāi' }, ms: { w: 'buka', syl: ['bu', 'ka'] } },
      { emoji: '📕', en: { w: 'close', syl: ['close'] }, zh: { w: '关', py: 'guān' }, ms: { w: 'tutup', syl: ['tu', 'tup'] } }
    ]
  },
  {
    id: 'clothes', emoji: '👕',
    name: { en: 'Clothes', zh: '衣服', ms: 'Pakaian' }, pinyin: 'yī fu',
    words: [
      { emoji: '👕', en: { w: 'shirt', syl: ['shirt'] }, zh: { w: '衣服', py: 'yī fu' }, ms: { w: 'baju', syl: ['ba', 'ju'] } },
      { emoji: '👖', en: { w: 'pants', syl: ['pants'] }, zh: { w: '裤子', py: 'kù zi' }, ms: { w: 'seluar', syl: ['se', 'lu', 'ar'] } },
      { emoji: '👟', en: { w: 'shoes', syl: ['shoes'] }, zh: { w: '鞋子', py: 'xié zi' }, ms: { w: 'kasut', syl: ['ka', 'sut'] } },
      { emoji: '🧦', en: { w: 'socks', syl: ['socks'] }, zh: { w: '袜子', py: 'wà zi' }, ms: { w: 'stokin', syl: ['sto', 'kin'] } },
      { emoji: '🧢', en: { w: 'hat', syl: ['hat'] }, zh: { w: '帽子', py: 'mào zi' }, ms: { w: 'topi', syl: ['to', 'pi'] } },
      { emoji: '👗', en: { w: 'dress', syl: ['dress'] }, zh: { w: '连衣裙', py: 'lián yī qún' }, ms: { w: 'gaun', syl: ['ga', 'un'] } },
      { emoji: '👓', en: { w: 'glasses', syl: ['glas', 'ses'] }, zh: { w: '眼镜', py: 'yǎn jìng' }, ms: { w: 'cermin mata', syl: ['cer', 'min', 'ma', 'ta'] } },
      { emoji: '⌚', en: { w: 'watch', syl: ['watch'] }, zh: { w: '手表', py: 'shǒu biǎo' }, ms: { w: 'jam tangan', syl: ['jam', 'ta', 'ngan'] } }
    ]
  },
  {
    id: 'vehicles', emoji: '🚗',
    name: { en: 'Vehicles', zh: '交通', ms: 'Kenderaan' }, pinyin: 'jiāo tōng',
    words: [
      { emoji: '🚗', en: { w: 'car', syl: ['car'] }, zh: { w: '汽车', py: 'qì chē' }, ms: { w: 'kereta', syl: ['ke', 're', 'ta'] } },
      { emoji: '🚌', en: { w: 'bus', syl: ['bus'] }, zh: { w: '巴士', py: 'bā shì' }, ms: { w: 'bas', syl: ['bas'] } },
      { emoji: '🚂', en: { w: 'train', syl: ['train'] }, zh: { w: '火车', py: 'huǒ chē' }, ms: { w: 'keretapi', syl: ['ke', 're', 'ta', 'pi'] } },
      { emoji: '✈️', en: { w: 'plane', syl: ['plane'] }, zh: { w: '飞机', py: 'fēi jī' }, ms: { w: 'kapal terbang', syl: ['ka', 'pal', 'ter', 'bang'] } },
      { emoji: '🚢', en: { w: 'ship', syl: ['ship'] }, zh: { w: '船', py: 'chuán' }, ms: { w: 'kapal', syl: ['ka', 'pal'] } },
      { emoji: '🚲', en: { w: 'bicycle', syl: ['bi', 'cy', 'cle'] }, zh: { w: '自行车', py: 'zì xíng chē' }, ms: { w: 'basikal', syl: ['ba', 'si', 'kal'] } },
      { emoji: '🏍️', en: { w: 'motorcycle', syl: ['mo', 'tor', 'cy', 'cle'] }, zh: { w: '摩托车', py: 'mó tuō chē' }, ms: { w: 'motosikal', syl: ['mo', 'to', 'si', 'kal'] } },
      { emoji: '🚕', en: { w: 'taxi', syl: ['ta', 'xi'] }, zh: { w: '德士', py: 'dé shì' }, ms: { w: 'teksi', syl: ['tek', 'si'] } }
    ]
  },
  {
    id: 'places', emoji: '🏘️',
    name: { en: 'Places', zh: '地方', ms: 'Tempat' }, pinyin: 'dì fang',
    words: [
      { emoji: '🏠', en: { w: 'house', syl: ['house'] }, zh: { w: '房子', py: 'fáng zi' }, ms: { w: 'rumah', syl: ['ru', 'mah'] } },
      { emoji: '🏫', en: { w: 'school', syl: ['school'] }, zh: { w: '学校', py: 'xué xiào' }, ms: { w: 'sekolah', syl: ['se', 'ko', 'lah'] } },
      { emoji: '🏪', en: { w: 'shop', syl: ['shop'] }, zh: { w: '商店', py: 'shāng diàn' }, ms: { w: 'kedai', syl: ['ke', 'dai'] } },
      { emoji: '🥬', en: { w: 'market', syl: ['mar', 'ket'] }, zh: { w: '市场', py: 'shì chǎng' }, ms: { w: 'pasar', syl: ['pa', 'sar'] } },
      { emoji: '🏥', en: { w: 'hospital', syl: ['hos', 'pi', 'tal'] }, zh: { w: '医院', py: 'yī yuàn' }, ms: { w: 'hospital', syl: ['hos', 'pi', 'tal'] } },
      { emoji: '🛝', en: { w: 'park', syl: ['park'] }, zh: { w: '公园', py: 'gōng yuán' }, ms: { w: 'taman', syl: ['ta', 'man'] } },
      { emoji: '📚', en: { w: 'library', syl: ['li', 'bra', 'ry'] }, zh: { w: '图书馆', py: 'tú shū guǎn' }, ms: { w: 'perpustakaan', syl: ['per', 'pus', 'ta', 'ka', 'an'] } },
      { emoji: '🍳', en: { w: 'kitchen', syl: ['kit', 'chen'] }, zh: { w: '厨房', py: 'chú fáng' }, ms: { w: 'dapur', syl: ['da', 'pur'] } }
    ]
  },
  {
    id: 'feelings', emoji: '😊',
    name: { en: 'Feelings', zh: '心情', ms: 'Perasaan' }, pinyin: 'xīn qíng',
    words: [
      { emoji: '😊', en: { w: 'happy', syl: ['hap', 'py'] }, zh: { w: '开心', py: 'kāi xīn' }, ms: { w: 'gembira', syl: ['gem', 'bi', 'ra'] } },
      { emoji: '😢', en: { w: 'sad', syl: ['sad'] }, zh: { w: '伤心', py: 'shāng xīn' }, ms: { w: 'sedih', syl: ['se', 'dih'] } },
      { emoji: '😠', en: { w: 'angry', syl: ['an', 'gry'] }, zh: { w: '生气', py: 'shēng qì' }, ms: { w: 'marah', syl: ['ma', 'rah'] } },
      { emoji: '😨', en: { w: 'scared', syl: ['scared'] }, zh: { w: '害怕', py: 'hài pà' }, ms: { w: 'takut', syl: ['ta', 'kut'] } },
      { emoji: '🥱', en: { w: 'tired', syl: ['ti', 'red'] }, zh: { w: '累', py: 'lèi' }, ms: { w: 'penat', syl: ['pe', 'nat'] } },
      { emoji: '😋', en: { w: 'hungry', syl: ['hun', 'gry'] }, zh: { w: '饿', py: 'è' }, ms: { w: 'lapar', syl: ['la', 'par'] } },
      { emoji: '🥤', en: { w: 'thirsty', syl: ['thirs', 'ty'] }, zh: { w: '渴', py: 'kě' }, ms: { w: 'haus', syl: ['ha', 'us'] } },
      { emoji: '🤒', en: { w: 'sick', syl: ['sick'] }, zh: { w: '生病', py: 'shēng bìng' }, ms: { w: 'sakit', syl: ['sa', 'kit'] } }
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
