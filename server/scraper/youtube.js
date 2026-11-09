// Key-less YouTube scraper: reads the ytInitialData JSON embedded in the search results page.
// Searching with "#shorts" appended makes YouTube return Shorts, which are parsed separately.

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const MULT = { thousand: 1e3, million: 1e6, billion: 1e9 };

export function parseViews(text = '') {
  const m = text.replace(/,/g, '').match(/([\d.]+)\s*(thousand|million|billion|K|M|B)?\s*views?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = (m[2] || '').toLowerCase();
  const mult = MULT[unit] ?? { k: 1e3, m: 1e6, b: 1e9 }[unit] ?? 1;
  return Math.round(n * mult);
}

export function parseDuration(text = '') {
  const parts = text.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

// "3 months ago" -> approx age in days
export function parseAgeDays(text = '') {
  const m = text.match(/(\d+)\s*(second|minute|hour|day|week|month|year|y|mo|w|d|h)s?/i);
  if (!m) return null;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  const perUnit = { second: 0, minute: 0, hour: 0, day: 1, d: 1, week: 7, w: 7, month: 30, mo: 30, year: 365, y: 365, h: 0 };
  return n * (perUnit[u] ?? 0);
}

function collect(root, key, out = []) {
  if (!root || typeof root !== 'object') return out;
  if (Array.isArray(root)) {
    for (const v of root) collect(v, key, out);
    return out;
  }
  if (root[key]) out.push(root[key]);
  for (const k in root) collect(root[k], key, out);
  return out;
}

async function fetchWithRetry(url, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' },
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) return res;
      lastErr = new Error(`YouTube responded ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  throw lastErr;
}

export async function ytSearch(query, { shorts = false } = {}) {
  const q = shorts ? `${query} #shorts` : query;
  const res = await fetchWithRetry(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`);
  const html = await res.text();
  const raw = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!raw) throw new Error('ytInitialData not found (YouTube layout changed or request was blocked)');
  const data = JSON.parse(raw[1]);

  if (shorts) {
    return collect(data, 'shortsLockupViewModel')
      .map((s) => {
        const id = s.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId || s.entityId?.replace('shorts-shelf-item-', '');
        const a11y = s.accessibilityText || '';
        const m = a11y.match(/^(.*?),\s*([\d.,]+\s*(?:thousand|million|billion)?\s*views?)/i);
        const title = (m ? m[1] : a11y.split(' - play Short')[0]).trim();
        if (!id || !title) return null;
        return {
          id,
          type: 'short',
          title,
          views: m ? parseViews(m[2]) : 0,
          thumbnail: `https://i.ytimg.com/vi/${id}/oar2.jpg`,
          url: `https://www.youtube.com/shorts/${id}`,
        };
      })
      .filter(Boolean);
  }

  return collect(data, 'videoRenderer')
    .map((v) => {
      const lengthText = v.lengthText?.simpleText;
      if (!v.videoId || !lengthText) return null; // skip live streams / premieres
      const channelRun = v.longBylineText?.runs?.[0] || v.ownerText?.runs?.[0];
      const channelPath = channelRun?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl;
      return {
        id: v.videoId,
        type: 'video',
        title: (v.title?.runs || []).map((r) => r.text).join(''),
        channel: channelRun?.text || 'Unknown',
        channelUrl: channelPath ? `https://www.youtube.com${channelPath}` : null,
        duration: lengthText,
        seconds: parseDuration(lengthText),
        views: parseViews(v.viewCountText?.simpleText),
        published: v.publishedTimeText?.simpleText || '',
        ageDays: parseAgeDays(v.publishedTimeText?.simpleText),
        thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
      };
    })
    .filter(Boolean);
}
