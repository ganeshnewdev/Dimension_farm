# Dimensions Farm (डाइमेंशन्स फार्म)

> Better Farming, Better Future (बेहतर खेती, समृद्ध भविष्य)

Web app for Indian farmers: live weather, mandi prices, crop advisory, farm finances and a Hindi/English AI assistant.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

For the AI chat and crop scanner, also run the backend (needs a Gemini key):

```bash
cp .env.example .env # then set GEMINI_API_KEY
npm run build
npm start            # http://localhost:5000
```

## Host on GitHub Pages

1. Push this folder to a GitHub repo (branch `main`).
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` builds and deploys the site (see `.github/workflows/deploy.yml`).
   The URL will be `https://<username>.github.io/<repo-name>/`.

GitHub Pages is static hosting, so the Express backend (`server/`) does not run there:

- Weather, mandi, farms, finances and the **AI chat** (offline knowledge engine) work.
- The **crop scanner** needs the backend. Deploy `server/` to a Node host (e.g. Render, with
  `GEMINI_API_KEY` set there), then add a repo variable `VITE_API_BASE_URL` with that URL
  (**Settings → Secrets and variables → Actions → Variables**) and re-run the workflow.
