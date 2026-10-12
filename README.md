# Dimensions Farm (डाइमेंशन्स फार्म)

> Better Farming, Better Future (बेहतर खेती, समृद्ध भविष्य)

A bilingual (Hindi / English) web app for Indian farmers.

| Feature | Notes |
| --- | --- |
| Live weather | Open-Meteo, any Indian place or GPS, 5-day forecast, spray advisory, field alerts |
| My farms | Add farms with a real place lookup; crop stage and harvest date are derived from the sowing date |
| Crop advisory | 7 crops; stage, soil and live weather change the advice |
| AI crop scanner | Leaf photo → diagnosis (needs the backend + Gemini key) |
| Farm accounts | Income / expenses, net profit, per-crop summary, CSV export |
| Chat assistant | Gemini when the backend is available, otherwise an offline knowledge base |
| Mandi prices, marketplace | **Sample data only**, clearly labelled; replace `src/data/sample.js` with a real feed |

All user data (farms, accounts, listings) is stored in the browser's `localStorage` only.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000  (proxies /api to :5000)
```

With the AI features:

```bash
cp .env.example .env # set GEMINI_API_KEY
npm run build
npm start            # http://localhost:5000  (API + built site)
```

```bash
npm test             # unit tests (Node's built-in runner)
```

## Deploy

### GitHub Pages (static site, no AI scanner)

1. Push to `main`.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. `.github/workflows/deploy.yml` runs the tests, builds and publishes on every push.

Everything works except the crop scanner and online chat, which need the backend. The app detects
this automatically (`/api/health`) and tells the user, instead of failing.

### Backend (Render, Railway, Fly, any Node host)

- Build command: `npm install && npm run build`; start command: `npm start`.
- Environment variables: `GEMINI_API_KEY`, and `ALLOWED_ORIGINS` (your Pages origin).
- To use it from the Pages site, add a GitHub Actions **variable** `VITE_API_BASE_URL` with the
  backend URL and re-run the workflow.

The API has per-IP rate limiting, input validation and keeps the key in a header, never in a URL.

## Project layout

```
src/
  lib/          pure logic (dates, finance, spray advice, crop stage, records + migration)
  i18n/         strings.js (hi + en), translate, provider
  data/         crops (ICAR-style package of practice) and clearly-labelled sample data
  services/     weather + geocoding, AI client (with offline fallback)
  hooks/        route (hash), weather, persistent state
  components/   UI sections
server/         Express API (index.js) + testable helpers (lib.js)
tests/          node --test suites (logic, records/migration, i18n completeness, server helpers)
```

Agronomy values are approximate general recommendations; farmers should always confirm with their
local Krishi Vigyan Kendra (KVK).
