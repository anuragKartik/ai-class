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
2. Vercel → Project Settings → General → **Root Directory**: leave **empty** (repo root).  
   Do **not** set it to `client` — that breaks install (`client/client/package.json`) and hides `/api`.
3. Build settings come from `vercel.json`. Clear any override Install/Build commands in the Vercel UI so the file wins.
4. Redeploy; then `/api/career` and `/api/tracks/ai` should return JSON

