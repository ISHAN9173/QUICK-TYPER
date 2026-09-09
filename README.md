# QuickType — Advanced Typing Trainer

A browser-based typing trainer built with plain HTML, CSS, and JavaScript —
no frameworks, no build step, no backend.

## Live Demo

Once deployed with GitHub Pages, your link will look like:
`https://<your-username>.github.io/quicktype-typing-trainer/`

## Features

- **Typing tests** — 15/30/60-second timed tests with live WPM and accuracy
- **Practice drills** — targeted exercises per key, hand, or the full keyboard
- **Progress tracking** — history, charts, and problem-key analysis, saved
  locally in the browser (`localStorage`)
- **Achievements** — unlockable badges with confetti + toast celebrations
- **Daily streaks** — tracks consecutive practice days
- **Daily WPM goal slider** — set a target speed and track live progress
  toward it
- **AI Coach** — an on-device tip generator that reads your recent stats
  (WPM, accuracy, streak) from local storage and surfaces a relevant coaching
  tip — no server or network call involved
- **Read Aloud** — browser text-to-speech reads the current paragraph, with
  a proper start/stop toggle
- **Interactive map** — Leaflet.js-powered map page (India / Ahmedabad / your
  location)
- **Login & Feedback pages** — demo login flow and a feedback form, each
  reachable at their own bookmarkable URL (`#login`, `#feedback`, etc.) with
  browser back-button support
- **Motion** — scroll-reveal animations and a full-screen transition "cut"
  between pages

## Project structure

```
quicktype-typing-trainer/
├── index.html      # All page markup (single-page app, hash-routed)
├── css/
│   └── style.css   # All styling
├── js/
│   └── script.js   # All application logic
└── README.md
```

## Tech used

- HTML5 / CSS3 (custom properties, grid, flexbox, keyframe animations)
- Vanilla JavaScript (no framework) — DOM APIs, `localStorage`,
  `IntersectionObserver`, `SpeechSynthesis`, History API (`pushState` /
  `popstate`)
- [Leaflet.js](https://leafletjs.com/) (via CDN) for the map page
- [Google Fonts](https://fonts.google.com/) — Fredoka & Space Grotesk

## Running locally

No build step needed — just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```bash
npx serve .
```

## Deploying with GitHub Pages

1. Push this folder to a GitHub repository
2. Repo → **Settings → Pages**
3. Source: **Deploy from a branch** → Branch: `main`, folder: `/ (root)`
4. Save — your site goes live at `https://<username>.github.io/<repo>/`
   within about a minute

## Notes

- All progress, streaks, badges, and the daily goal are stored in the
  browser's `localStorage` — clearing browser data resets them.
- The login page uses a hardcoded demo credential (shown on the page itself)
  for demonstration purposes only — there is no real backend or database.
- Requires an internet connection for Google Fonts and the Leaflet map (both
  loaded from CDNs); everything else works fully offline.
