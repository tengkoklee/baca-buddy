/* Baca Buddy service worker — full offline support.
   Bump VERSION whenever any app file changes: the new SW re-precaches
   everything and old caches are dropped on activate. */
importScripts('audio-manifest.js');   // AUDIO_MAP: bundled speech clips

const VERSION = 'baca-v22';
const RUNTIME = 'baca-runtime-v22';

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
const HANZI = ['一','三','中','二','人','从','他','们','休','信','做','像','元','医','十','双','口','吗','和','园','圆','地','坐','大','天','头','女','她','好','妈','子','字','它','安','家','小','尖','尘','山','心','想','我','手','数','日','早','时','明','星','月','朋','木','机','村','林','树','森','气','水','池','汽','河','泪','洗','清','火','灯','爸','牛','猩','王','田','男','白','目','石','秋','米','耳','花','草','虫','蚂','衣','象','钟','门','闪','问','间','闻','雨','青','马','鱼','鸟','鸡','鸣'];

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
