# Baca Buddy 🦉

A gentle, **audio-first / picture-first** app that helps a young dyslexic learner
practise **English · 中文 · Bahasa Melayu** side by side.

Built for a 9-year-old in a Chinese-medium (SJKC) school who understands spoken
English & Chinese well but finds *reading* hard — so every word is shown as a
**picture + sound**, with reading built up gently and always backed by audio.

## Why it's built this way (dyslexia-friendly by design)

- **Cream background, soft dark-brown text** — no harsh white/black glare.
- **Lexend** font by default, **OpenDyslexic** one tap away (⚙️ Settings).
- **Big text, wide letter/line spacing**, one thing on screen at a time.
- **Syllable chunking in colour** (`ap·ple`, `pi·sang`) to make decoding easier.
- **Multisensory**: hear it → see it → do it (build words from letter tiles).
- **Adjustable speaking speed** (🐢 Slow / 🚶 Medium / 🐇 Normal).
- **Gentle feedback** — warm "try again", never a harsh red ✗.
- **Big touch targets** sized for little fingers on an iPad.

## The ten activities

| | Activity | What the child does | Evidence base (see RESEARCH.md) |
|---|---|---|---|
| 📖 | **Explore** | Flashcards: tap the picture or any language to hear it; all 3 words + pinyin. | multisensory exposure |
| 👂 | **Listen & Find** | Hears a word → taps the matching picture. | plays to listening strength |
| 🎯 | **Match the Word** | Sees a picture → taps the correct written word; every tap reads aloud. | word-picture mapping |
| 🔤 | **Sound It Out** | Hears a word → builds it from letter tiles (EN/BM). Tiles say letter **sounds**, not names. | systematic phonics — the only confirmed intervention class (g′≈0.32) |
| 🧩 | **Blend It** | Hears a word → orders its **syllable** tiles (EN/BM), then hears the blend. | larger-grain blending; ideal for transparent Malay |
| ✍️ | **Write 写字** | Finger-traces hanzi **stroke by stroke** with live per-stroke feedback (hanzi-writer). | OG multisensory tracing; KSSR Y3 stroke-order standard |
| 🧱 | **Build 拼字** | Assembles characters from **radicals/components** (好 = 女+子). | character-structure training g=0.70; dyslexics g=0.87 |
| 👯 | **Same Sound 同音** | Picture + sound → picks the right character among exact homophones (马/蚂). | morphological awareness — the core Chinese-dyslexia deficit |
| 🔍 | **Sound Hunt** | Hears a letter **sound** (letter shown big) → taps the picture whose word starts with it. | PA-with-letters — the universal deficit, trained with print (NRP principle) |
| 🏃 | **Read Along** | Listens to a short sentence, then reads it aloud 3 times against a gentle self-race timer. | repeated reading — standard treatment for the persistent Malay fluency deficit |

Plus a **⏱️ practice tracker** on the home screen (🔥 streak · daily 10-min goal · total hours)
— engineering the >15-hour cumulative dose the trials say is needed for measurable effects.

## 🔴 Pokémon reward system

Effort → ⭐ → Pokéballs → a Gen-1 Pokédex to fill (151):
- every correct answer = 1 ⭐ (stars are never taken away — gentle-feedback principle)
- 10 ⭐ = 1 Pokéball; hitting the 10-min daily goal = 1 bonus ball per day
- first catch is always **Pikachu**; no duplicates until the dex is complete
- legendaries (Articuno/Zapdos/Moltres/Mewtwo/Mew) unlock at 25/50/75/100/125 caught
- artwork is hot-linked from the community PokeAPI sprites mirror (cached offline after
  first view) — personal/educational fan use; not for commercial distribution

### 💛 Pokémon Pal (virtual pet)

- choose any **caught** Pokémon as your pal (each remembers its own hearts)
- care items drop as you play: every 4 ⭐ → 🍎 berry (+1❤️) / 🎾 toy (+2❤️) / 🎁 gift (+3❤️)
- 10 ❤️ = 1 friendship level (Lv 10 = 🏆 Best Friends); care only ever ADDS —
  the pal never gets hungry, sad, or sick (gentle-feedback principle)
- **evolution**: base forms evolve at Lv 3, middle forms at Lv 6 (Charmander →
  Charmeleon → Charizard; Eevee evolves randomly!) — evolutions also fill the Pokédex
- a "Buddy of the Day" rotates daily through the collection until a pal is chosen

## Run it

It's a plain web app — no install, no build.

**On the Mac:**
```bash
cd ~/baca-buddy
python3 -m http.server 8080 --bind 0.0.0.0
```
Then open <http://localhost:8080> in Safari/Chrome.

**On the iPad (same Wi-Fi):** open
```
http://192.168.1.168:8080
```
Tip: in Safari tap **Share → Add to Home Screen** so it opens full-screen like a real app.

> Tap the screen once when it loads — iPad only allows sound to start after a tap.

## Speech / voices

Uses the iPad's **built-in** text-to-speech (free, works offline). English and
Chinese voices are on every iPad. If Malay sounds off or silent, add it under
**Settings → Accessibility → Spoken Content → Voices → Malay** (the app also
falls back to an Indonesian voice, ~90% intelligible with Malay).

## Add or change words

Everything is in **`data.js`** — no code needed. Copy one line inside any
theme's `words` array:

```js
{ emoji: '🦋', en: { w: 'butterfly', syl: ['but','ter','fly'] },
  zh: { w: '蝴蝶', py: 'hú dié' },
  ms: { w: 'rama-rama', syl: ['ra','ma','ra','ma'] } },
```

- `emoji` is the picture (no image files needed).
- `syl` = the colour chunks (also the letters used in *Sound It Out*).
- `py` = pinyin, syllables separated by spaces.

To add a whole new topic, copy a full `{ id, emoji, name, pinyin, words }` block.

## Files

- `index.html` — screens & layout
- `styles.css` — the dyslexia-friendly design system
- `data.js` — theme vocabulary (edit this to add words)
- `data2.js` — v2 content: trace characters, component decompositions, homophone sets, EN letter sounds
- `app.js` — core activities, speech engine, settings
- `games2.js` — v2 interactive activities (trace / build / same-sound / blend)
- `kssr/` — official syllabus alignment: the DSKP BI Tahun 3 SJK PDF (MOE), the parsed
  Year 3 vocabulary (`year3_vocab_sjk.json`, 284 words) and the Y1–2 wordlist dump
- `RESEARCH.md` — the deep-research report this design follows
- `fonts/` — *(optional)* drop `OpenDyslexic-Regular.woff2` here to bundle it offline

## Notes

- ✍️ Write 写字 loads stroke data from the hanzi-writer CDN — needs internet.
  Offline it gracefully falls back to a free finger-drawing canvas over a model character.
- KSSR sync status: English word bank source = official DSKP (done, in `kssr/`);
  BC ~400-hanzi list and BM SJK senarai kata still to be extracted from their DSKPs.
