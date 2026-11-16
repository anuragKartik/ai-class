# Anurag AI Classes

Two-track classroom for **AI Engineer** (LangChain, LangGraph, RAG, agents) and **Forward Deployed Engineer** prep: YouTube lessons, curated reading, growth tracking, mock interviews, and job referrals.

## Setup

```bash
npm run setup
npm run scrape
npm run dev
```

- API: http://localhost:4000
- App: http://localhost:5173

## Deploy (Vercel)

The app is a Vite frontend plus serverless `/api/*` routes (same handlers as the Express server).

1. Push to GitHub (`anuragKartik/ai-class`)
2. In Vercel: Import the repo, root directory = project root (not `client/`)
3. Build settings are in `vercel.json` — leave Framework Preset as Other / Vite is fine
4. Redeploy after push; then `/api/career` and `/api/tracks/ai` should return JSON
