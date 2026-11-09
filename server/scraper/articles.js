// Blog / article discovery (Hacker News Algolia API - free, no key) and link validation/enrichment.

const UA = 'Mozilla/5.0 (compatible; AIGuideBot/1.0; personal learning project)';
const SKIP_HOSTS = /(^|\.)(youtube\.com|youtu\.be|twitter\.com|x\.com|reddit\.com|linkedin\.com)$/i;

export async function hnSearch(query, { minPoints = 40, limit = 40 } = {}) {
  const url =
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}` +
    `&tags=story&numericFilters=points>${minPoints}&hitsPerPage=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HN API responded ${res.status}`);
  const { hits } = await res.json();
  return hits
    .filter((h) => h.url && h.title)
    .map((h) => {
      const host = new URL(h.url).hostname.replace(/^www\./, '');
      return {
        url: h.url,
        title: h.title,
        source: host,
        points: h.points,
        comments: h.num_comments,
        date: h.created_at?.slice(0, 10),
        discussion: `https://news.ycombinator.com/item?id=${h.objectID}`,
        kind: 'article',
        via: 'Hacker News',
      };
    })
    // keep real blog posts/essays: no papers, repo launches or social links
    .filter((a) => !SKIP_HOSTS.test(a.source) && !/^(arxiv\.org|github\.com|huggingface\.co)$/i.test(a.source) && !/^show hn/i.test(a.title));
}

function meta(html, names) {
  for (const n of names) {
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${n}["'][^>]*content=["']([^"']*)["']`, 'i');
    const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${n}["']`, 'i');
    const m = html.match(re) || html.match(re2);
    if (m?.[1]) return decode(m[1]);
  }
  return '';
}

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

// Returns an enriched resource, or null if the page is definitively gone.
export async function checkAndEnrich(resource) {
  const source = new URL(resource.url).hostname.replace(/^www\./, '');
  const base = { ...resource, source, via: 'Curated' };
  if (resource.skipCheck) return base;
  try {
    const res = await fetch(resource.url, {
      headers: { 'user-agent': UA, accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 404 || res.status === 410) return null;
    if (!res.ok) return base; // 403/429 etc: likely bot-blocking, the link itself is probably fine
    const html = (await res.text()).slice(0, 200_000);
    const description = meta(html, ['og:description', 'description', 'twitter:description']);
    return { ...base, description: description.slice(0, 220) };
  } catch (err) {
    if (/ENOTFOUND/.test(String(err?.cause?.code || err?.message))) return null;
    return base;
  }
}
