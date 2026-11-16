# Anurag AI Classes

Two-track classroom for **AI Engineer** (LangChain, LangGraph, RAG, agents) and **Forward Deployed Engineer** prep: YouTube lessons, curated reading, growth tracking, mock interviews, and job referrals.

**Accounts:** login is local to this browser (no database). Progress, mocks, and job apps are saved on the device under the signed-in account and stay until you log out. Logging into another account on the same laptop loads that account’s data instead.

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
2. Vercel → **Settings → Build and Deployment** → **Root Directory**:
   - Click Edit → clear the value (must be empty / repo root)
   - Do **not** use `client` — that causes `client/client/package.json` and hides `/api`
3. In the same page, clear any custom Install/Build Command overrides so `vercel.json` is used
4. Redeploy; then `/api/career` and `/api/tracks/ai` should return JSON


