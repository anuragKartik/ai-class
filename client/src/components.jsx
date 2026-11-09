import { formatViews } from './hooks.js';
import { usePlayer, useProgress } from './context.jsx';

export function VideoCard({ v, track }) {
  const play = usePlayer();
  const { done, toggle } = useProgress();
  const key = `${track}.vid.${v.id}`;
  const watched = !!done[key];
  const open = () => {
    play(v);
    if (!watched) toggle(key);
  };
  return (
    <article className={`lesson ${watched ? 'is-done' : ''}`}>
      <button className="thumb" onClick={open} aria-label={`Play ${v.title}`}>
        <img src={v.thumbnail} alt="" loading="lazy" />
        <span className="duration">{v.duration}</span>
        {v.course && <span className="badge">Full course</span>}
        {watched && <span className="badge badge-done">Watched</span>}
        <span className="play" aria-hidden="true">▶</span>
      </button>
      <div className="lesson-body">
        <h3 title={v.title}>{v.title}</h3>
        <p className="meta">
          {v.channelUrl ? (
            <a href={v.channelUrl} target="_blank" rel="noreferrer">
              {v.channel}
            </a>
          ) : (
            v.channel
          )}
          <span> · {formatViews(v.views)}</span>
          {v.published && <span> · {v.published}</span>}
        </p>
        <div className="lesson-actions">
          <a href={v.url} target="_blank" rel="noreferrer">
            Open on YouTube ↗
          </a>
          <label className="check small">
            <input type="checkbox" checked={watched} onChange={() => toggle(key)} />
            <span>Watched</span>
          </label>
        </div>
      </div>
    </article>
  );
}

export function ShortCard({ s, track }) {
  const play = usePlayer();
  const { done, toggle } = useProgress();
  const key = `${track}.vid.${s.id}`;
  const watched = !!done[key];
  return (
    <button
      className={`short ${watched ? 'is-done' : ''}`}
      onClick={() => {
        play(s);
        if (!watched) toggle(key);
      }}
      title={s.title}
    >
      <img src={s.thumbnail} alt="" loading="lazy" />
      <span className="short-shade" />
      <span className="short-title">{s.title}</span>
      <span className="short-views">{formatViews(s.views)}</span>
    </button>
  );
}

export function ArticleCard({ a }) {
  return (
    <a className="article" href={a.url} target="_blank" rel="noreferrer">
      <div className="article-top">
        <span className={`pill pill-${a.kind}`}>{a.kind}</span>
        <span className="source">{a.source}</span>
      </div>
      <h3>{a.title}</h3>
      {a.description && <p className="desc">{a.description}</p>}
      <p className="meta">{a.via === 'Hacker News' ? `▲ ${a.points} on Hacker News${a.date ? ` · ${a.date}` : ''}` : 'Hand-picked'}</p>
    </a>
  );
}
