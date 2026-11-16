import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCareer, getTrack, listTracks } from './lib/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/tracks', (_req, res) => res.json(listTracks()));

app.get('/api/tracks/:id', (req, res) => {
  try {
    res.json(getTrack(req.params.id));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/api/career', (_req, res) => {
  try {
    res.json(getCareer());
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

app.listen(PORT, () => console.log(`AI Guide API on http://localhost:${PORT}`));
