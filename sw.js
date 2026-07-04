/* Baca Buddy service worker — full offline support.
   Bump VERSION whenever any app file changes: the new SW re-precaches
   everything and old caches are dropped on activate. */
importScripts('audio-manifest.js');   // AUDIO_MAP: bundled speech clips

const VERSION = 'baca-v27';
const RUNTIME = 'baca-runtime-v27';

const CORE = [
  '.',
  'index.html',
  'styles.css',
  'data.js',
  'data2.js',
  'app.js',
  'games2.js',
  'games3.js',
  'testmode.js',
  'data-pokemon.js',
  'rewards.js',
  'i18n.js',
  'adaptive.js',
  'audio-manifest.js',
  'manifest.json',
  'vendor/hanzi-writer.min.js',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

/* every character used by ✍️ Write / 🧱 Build — kept in sync with data2.js
   by tools: the hanzi-data folder simply holds one JSON per char */
const HANZI = ['一','七','三','中','乌','九','书','二','云','五','亮','人','从','他','们','休','伤','信','做','像','元','兔','八','公','六','关','写','冰','刀','剪','包','医','十','厨','友','双','发','叔','口','叶','吃','吗','和','哥','哭','唱','商','喝','嘴','四','园','图','圆','地','场','坐','士','大','天','太','头','女','奶','她','好','妈','姐','姨','子','字','学','它','安','宝','害','家','小','尖','尘','尺','山','巴','市','师','帽','干','店','开','德','心','怕','想','我','户','房','手','托','指','摩','数','日','早','时','明','星','月','朋','服','木','本','朵','机','村','条','林','果','树','校','棕','森','椅','椰','橙','橡','歌','气','水','汁','池','汤','汽','河','泪','泳','洗','海','淇','淋','清','渴','游','滩','火','灯','灰','熊','爷','爸','牙','牛','狗','狮','猩','猫','猴','玉','王','玩','瓜','生','田','电','男','病','白','皮','盐','盖','目','眼','睛','睡','石','秋','空','窗','站','笑','笔','米','粉','糕','糖','紫','累','红','纸','绿','羊','老','耳','肚','肩','胶','脑','脚','脸','膀','膝','臂','自','舌','船','色','芒','花','苹','茶','草','蓝','蕉','虎','虫','蚁','蚂','蛇','蛋','蛙','蜂','蜜','蜡','蝴','蝶','螃','蟹','行','衣','表','袜','裙','裤','西','觉','记','读','象','走','跑','跳','车','连','钟','铅','镜','门','闪','问','间','闻','阳','阿','院','雨','青','面','鞋','风','飞','饭','饼','饿','馆','香','马','骨','鱼','鱿','鲨','鲸','鸟','鸡','鸣','鸭','鹿','黄','黑','鼠','鼻','齿','龟'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // cache:'reload' bypasses the HTTP cache — otherwise a stale copy of an
    // app file can get baked into the new version's precache
    await cache.addAll(CORE.map((u) => new Request(u, { cache: 'reload' })));
    // hanzi data: tolerate individual misses so one bad file can't block install
    await Promise.allSettled(HANZI.map((c) =>
      cache.add(`hanzi-data/${encodeURIComponent(c)}.json`).catch(() => null)));
    // bundled speech clips (~5.6 MB) — the app speaks fully offline
    await Promise.allSettled(Object.values(AUDIO_MAP).map((p) =>
      cache.add(p).catch(() => null)));
    // Pokémon audio (37 MB / 3075 files) is NOT precached here — browsers
    // time-limit the install phase. The page warms it into the version-stable
    // 'baca-pokemon-audio' cache in the background (app.js warmPokemonAudio).
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    const KEEP = [VERSION, RUNTIME, 'baca-pokemon-audio'];   // pokemon audio survives updates
    await Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    // cache-first for everything we know; runtime-cache anything else that succeeds
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok && (req.url.startsWith(self.location.origin)
          || req.url.includes('fonts.g') || req.url.includes('jsdelivr')
          || req.url.includes('raw.githubusercontent.com'))) {   // Pokémon art: cached after first view
        const rt = await caches.open(RUNTIME);
        rt.put(req, res.clone());
      }
      return res;
    } catch (err) {
      // offline and not cached: for navigations, serve the app shell
      if (req.mode === 'navigate') {
        const shell = await caches.match('index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
