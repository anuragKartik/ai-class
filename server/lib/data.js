import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const TRACK_META = [
  { id: 'ai', label: 'AI Engineer' },
  { id: 'fde', label: 'Forward Deployed Engineer' },
  { id: 'salesforce', label: 'Salesforce Interview' },
];

const TRACK_IDS = TRACK_META.map((t) => t.id);

function loadJson(...parts) {
  return require(path.join(ROOT, ...parts));
}

export function listTracks() {
  return TRACK_META;
}

export function getTrack(id) {
  if (!TRACK_IDS.includes(id)) {
    const err = new Error('Unknown track');
    err.status = 404;
    throw err;
  }
  try {
    const library = loadJson('data', `${id}.json`);
    const content = loadJson('content', `${id}.json`);
    const plan = id === 'ai' ? loadJson('content', 'plan100.json') : undefined;
    return { ...library, content, plan };
  } catch (err) {
    if (err.status) throw err;
    const wrapped = new Error(
      err.code === 'MODULE_NOT_FOUND'
        ? `No scraped data for "${id}" yet. Run: npm run scrape`
        : err.message,
    );
    wrapped.status = 503;
    throw wrapped;
  }
}

export function getCareer() {
  try {
    return loadJson('content', 'career.json');
  } catch (err) {
    const wrapped = new Error(err.message);
    wrapped.status = 503;
    throw wrapped;
  }
}
