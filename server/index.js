import express from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_DIR = path.join(__dirname, 'content');
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
const TRACK_IDS = ['ai', 'fde'];
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/tracks', (_req, res) =>
  res.json([
    { id: 'ai', label: 'AI Engineer' },
    { id: 'fde', label: 'Forward Deployed Engineer' },
  ]),
);

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

// A track = scraped library (videos/shorts/articles) + hand-written course content
// (+ the 100-day plan for the AI track).
app.get('/api/tracks/:id', async (req, res) => {
  const { id } = req.params;
  if (!TRACK_IDS.includes(id)) return res.status(404).json({ error: 'Unknown track' });
  try {
    const [library, content] = await Promise.all([
      readJson(path.join(DATA_DIR, `${id}.json`)).catch(() => {
        throw new Error(`No scraped data for "${id}" yet. Run: npm run scrape`);
      }),
      readJson(path.join(CONTENT_DIR, `${id}.json`)),
    ]);
    const plan = id === 'ai' ? await readJson(path.join(CONTENT_DIR, 'plan100.json')) : undefined;
    res.json({ ...library, content, plan });
  } catch (err) {
    res.status(503).json({ error: err.message });
  }
});

app.get('/api/career', async (_req, res) => {
  try {
    res.json(await readJson(path.join(CONTENT_DIR, 'career.json')));
  } catch (err) {
    res.status(503).json({ error: err.message });
  }
});

if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

app.listen(PORT, () => console.log(`AI Guide API on http://localhost:${PORT}`));
