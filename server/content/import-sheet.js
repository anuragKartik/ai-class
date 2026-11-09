// Converts the "100 Days of AI Engineering" Google Sheet (exported as CSV) into plan100.json.
// Re-run after replacing source/100-days-of-ai-engineering.csv:  npm run import:plan
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

// Minimal RFC-4180 CSV parser (handles quoted fields, escaped quotes and newlines in cells).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function youtubeId(url) {
  try {
    const u = new URL(url);
    if (u.pathname === '/playlist' || u.searchParams.has('list') && !u.searchParams.has('v')) return null;
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    if (/youtube\.com$/.test(u.hostname) && u.pathname === '/watch') return u.searchParams.get('v');
  } catch {
    /* not a URL */
  }
  return null;
}

function option(cols) {
  const [title, link, type, mins, creator] = cols.map((c) => c.trim());
  if (!title) return null;
  const isUrl = /^https?:\/\//i.test(link);
  return {
    title,
    url: isUrl ? link : null,
    // e.g. "(section in your PDF)" - keep it as a note so the UI can say where to look
    note: isUrl ? null : link.replace(/^\(|\)$/g, '') || null,
    videoId: isUrl ? youtubeId(link) : null,
    type,
    mins: Number(mins) || null,
    creator,
  };
}

const text = await readFile(path.join(dir, 'source', '100-days-of-ai-engineering.csv'), 'utf8');
const rows = parseCsv(text.replace(/^\uFEFF/, ''));
const title = rows[0][0].trim();
const subtitle = rows[1][0].trim();
const body = rows.slice(4).filter((r) => /^\d+$/.test((r[0] || '').trim()));

const phases = [];
for (const r of body) {
  const phaseRaw = r[1].trim(); // "1. Orientation & Tooling"
  const m = phaseRaw.match(/^(\d+)\.\s*(.*)$/);
  const phaseNo = m ? Number(m[1]) : phases.length + 1;
  const phaseName = m ? m[2] : phaseRaw;
  let phase = phases.find((p) => p.no === phaseNo);
  if (!phase) {
    phase = { no: phaseNo, name: phaseName, days: [] };
    phases.push(phase);
  }
  phase.days.push({
    day: Number(r[0]),
    topic: r[2].trim(),
    outcome: r[3].trim(),
    options: {
      beginner: option(r.slice(7, 12)),
      intermediate: option(r.slice(12, 17)),
      advanced: option(r.slice(17, 22)),
    },
  });
}

const totalDays = phases.reduce((n, p) => n + p.days.length, 0);
await writeFile(path.join(dir, 'plan100.json'), JSON.stringify({ title, subtitle, totalDays, phases }, null, 1));
console.log(`plan100.json: ${totalDays} days in ${phases.length} phases`);
