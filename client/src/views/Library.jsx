import { useMemo, useState } from 'react';
import { ArticleCard, ShortCard, VideoCard } from '../components.jsx';
import { Chip, PageTitle } from '../ui.jsx';

export default function Library({ data, track }) {
  const [topic, setTopic] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('relevance');
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    const match = (i) =>
      (topic === 'all' || i.topic === topic) &&
      (!q || `${i.title} ${i.channel || ''} ${i.description || ''}`.toLowerCase().includes(q));
    let videos = data.videos.filter(match);
    if (sort === 'views') videos = [...videos].sort((a, b) => b.views - a.views);
    if (sort === 'short') videos = [...videos].sort((a, b) => a.seconds - b.seconds);
    if (sort === 'long') videos = [...videos].sort((a, b) => b.seconds - a.seconds);
    return { videos, shorts: data.shorts.filter(match) };
  }, [data, topic, q, sort]);

  return (
    <>
      <PageTitle title="Video classroom">
        Extra YouTube lessons and Shorts for this course. Use these after the roadmap, not instead of it.
      </PageTitle>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Topics">
          <Chip active={topic === 'all'} onClick={() => setTopic('all')} count={data.videos.length}>
            All topics
          </Chip>
          {data.topics.map((t) => (
            <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)} count={data.videos.filter((v) => v.topic === t.id).length}>
              {t.label}
            </Chip>
          ))}
        </div>
        <div className="controls">
          <input type="search" placeholder="Search titles or channels" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort videos">
            <option value="relevance">Best match</option>
            <option value="views">Most viewed</option>
            <option value="short">Shortest first</option>
            <option value="long">Longest first</option>
          </select>
        </div>
      </div>

      <section className="block">
        <h3 className="block-title">
          Lessons <span className="count">{filtered.videos.length}</span>
        </h3>
        {filtered.videos.length === 0 ? (
          <p className="empty">No lessons match this filter.</p>
        ) : (
          <div className="lesson-grid">
            {filtered.videos.map((v) => (
              <VideoCard key={v.id} v={v} track={track} />
            ))}
          </div>
        )}
      </section>

      <section className="block">
        <h3 className="block-title">
          Shorts <span className="count">{filtered.shorts.length}</span>
        </h3>
        {filtered.shorts.length === 0 ? (
          <p className="empty">No Shorts match this filter.</p>
        ) : (
          <div className="shorts">
            {filtered.shorts.map((s) => (
              <ShortCard key={s.id} s={s} track={track} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function Reading({ data }) {
  const byTopic = useMemo(() => {
    const map = new Map();
    for (const t of data.topics) map.set(t.id, { ...t, items: [] });
    for (const a of data.articles) {
      const bucket = map.get(a.topic) || { id: a.topic, label: a.topic, items: [] };
      bucket.items.push(a);
      map.set(a.topic, bucket);
    }
    return [...map.values()].filter((t) => t.items.length);
  }, [data]);

  return (
    <>
      <PageTitle title="Reading list">
        Docs, blogs and essays to read alongside the videos. Open a topic, then work through the links in order.
      </PageTitle>

      {byTopic.map((t) => (
        <section key={t.id} className="block">
          <h3 className="block-title">
            {t.label} <span className="count">{t.items.length}</span>
          </h3>
          <div className="article-grid">
            {t.items.map((a) => (
              <ArticleCard key={a.url} a={a} />
            ))}
          </div>
        </section>
      ))}

      <section className="block">
        <h3 className="block-title">Where else to look</h3>
        <p className="lede">
          Instagram, LinkedIn, X and Reddit do not allow open scraping. These links jump to the right search on each platform.
        </p>
        <ul className="link-grid">
          {data.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer">
                <span className="where">{l.where}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
