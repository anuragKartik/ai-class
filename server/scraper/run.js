// Usage: npm run scrape            (all tracks)
//        npm run scrape -- fde     (one track)
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRACKS } from './config.js';
import { CURATED } from './curated.js';
import { ytSearch } from './youtube.js';
import { hnSearch, checkAndEnrich } from './articles.js';

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIDEOS_PER_TOPIC = 8;
const SHORTS_PER_TOPIC = 8;
const MIN_SHORT_VIEWS = 3000;

function score(item, track) {
  const popularity = Math.log10(item.views + 1);
  let recency = 0;
  if (item.ageDays != null) {
    if (item.ageDays <= 180) recency = 1;
    else if (item.ageDays <= 365) recency = 0.6;
    else if (item.ageDays <= 730) recency = 0.2;
    else recency = -0.3;
  }
  return popularity + recency * track.recencyWeight;
}

async function safe(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.warn(`  ! ${label}: ${err.message}`);
    return [];
  }
}

async function scrapeTrack(track) {
  console.log(`\n== ${track.label} ==`);
  const seen = new Set();
  const videos = [];
  const shorts = [];

  for (const topic of track.topics) {
    console.log(`- ${topic.label}`);
    const vids = [];
    const shrt = [];
    for (const q of topic.queries) {
      for (const item of await safe(`videos "${q}"`, () => ytSearch(q))) vids.push(item);
      await sleep(700);
      for (const item of await safe(`shorts "${q}"`, () => ytSearch(q, { shorts: true }))) shrt.push(item);
      await sleep(700);
    }

    const relevant = (i) => topic.match.test(i.title);
    const pick = (list, limit, filter) => {
      const out = [];
      for (const item of list.filter(filter).sort((a, b) => score(b, track) - score(a, track))) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        out.push({ ...item, topic: topic.id });
        if (out.length >= limit) break;
      }
      return out;
    };

    const v = pick(vids, VIDEOS_PER_TOPIC, (i) => relevant(i) && i.seconds >= track.minVideoSeconds && i.seconds <= 12 * 3600 && i.views > 500);
    const s = pick(shrt, SHORTS_PER_TOPIC, (i) => relevant(i) && i.views >= MIN_SHORT_VIEWS);
    videos.push(...v.map((x) => ({ ...x, course: x.seconds >= 3600 })));
    shorts.push(...s);
    console.log(`  ${v.length} videos, ${s.length} shorts`);
  }

  // Articles: curated (validated) + discovered on Hacker News
  console.log('- Articles');
  const articles = [];
  const urls = new Set();
  for (const [topicId, list] of Object.entries(CURATED[track.id].topics)) {
    for (const r of list) {
      if (urls.has(r.url)) continue;
      const ok = await checkAndEnrich(r);
      if (!ok) {
        console.log(`  x dropped dead link: ${r.url}`);
        continue;
      }
      urls.add(r.url);
      articles.push({ ...ok, topic: topicId });
    }
  }
  const hn = [];
  for (const q of track.hnQueries) {
    hn.push(...(await safe(`HN "${q}"`, () => hnSearch(q, { minPoints: track.hnMinPoints }))));
    await sleep(300);
  }
  const defaultTopic = track.topics[0].id;
  for (const a of hn.sort((x, y) => y.points - x.points)) {
    if (urls.has(a.url) || !track.hnMatch.test(a.title)) continue;
    urls.add(a.url);
    // attach to the first topic whose regex matches the title, else a catch-all
    const topic = track.topics.find((t) => t.match.test(a.title))?.id || defaultTopic;
    articles.push({ ...a, topic });
    if (articles.filter((x) => x.via === 'Hacker News').length >= 15) break;
  }
  console.log(`  ${articles.length} articles`);

  return {
    track: { id: track.id, label: track.label, tagline: track.tagline },
    updatedAt: new Date().toISOString(),
    topics: track.topics.map(({ id, label }) => ({ id, label })),
    videos,
    shorts,
    articles,
    links: CURATED[track.id].links,
  };
}

const only = process.argv[2];
await mkdir(DATA_DIR, { recursive: true });
for (const track of Object.values(TRACKS)) {
  if (only && only !== track.id) continue;
  const result = await scrapeTrack(track);
  await writeFile(path.join(DATA_DIR, `${track.id}.json`), JSON.stringify(result, null, 2));
  console.log(`Saved ${track.id}.json (${result.videos.length} videos, ${result.shorts.length} shorts, ${result.articles.length} articles)`);
}
