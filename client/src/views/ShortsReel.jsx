import { useCallback, useEffect, useRef, useState } from 'react';
import { formatViews } from '../hooks.js';
import { useProgress } from '../context.jsx';

/**
 * Full-screen vertical Reels / Shorts feed.
 * Scroll or swipe up for the next clip — same habit loop as Instagram Reels.
 */
export default function ShortsReel({ shorts, track, startIndex = 0, onClose }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(startIndex);
  const marked = useRef(new Set());
  const { done, toggle } = useProgress();

  useEffect(() => {
    document.body.classList.add('modal-open');
    const node = scrollerRef.current;
    if (node) {
      const slide = node.children[startIndex];
      if (slide) slide.scrollIntoView({ block: 'start' });
    }
    return () => document.body.classList.remove('modal-open');
  }, [startIndex]);

  const go = useCallback(
    (delta) => {
      const next = Math.min(shorts.length - 1, Math.max(0, active + delta));
      scrollerRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(next);
    },
    [active, shorts.length],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return undefined;
    const slides = [...root.querySelectorAll('[data-reel-index]')];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.55)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(visible.target.getAttribute('data-reel-index'));
        if (!Number.isNaN(idx)) setActive(idx);
      },
      { root, threshold: [0.55, 0.8] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [shorts]);

  useEffect(() => {
    const item = shorts[active];
    if (!item) return;
    const key = `${track}.vid.${item.id}`;
    if (marked.current.has(key) || done[key]) return;
    marked.current.add(key);
    toggle(key);
  }, [active, shorts, track, done, toggle]);

  if (!shorts.length) return null;

  return (
    <div className="reel-overlay" role="dialog" aria-modal="true" aria-label="Shorts reel feed">
      <header className="reel-chrome">
        <button type="button" className="reel-close" onClick={onClose} aria-label="Close reels">
          ✕ Close
        </button>
        <p className="reel-progress">
          {active + 1} / {shorts.length}
        </p>
        <p className="reel-hint">Swipe up for next</p>
      </header>

      <div className="reel-scroller" ref={scrollerRef}>
        {shorts.map((s, i) => (
          <ReelSlide
            key={s.id}
            item={s}
            index={i}
            active={i === active}
            nearby={Math.abs(i - active) <= 1}
            watched={!!done[`${track}.vid.${s.id}`]}
          />
        ))}
      </div>

      <div className="reel-side">
        <button type="button" className="reel-nav" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous short">
          ↑
        </button>
        <button
          type="button"
          className="reel-nav"
          onClick={() => go(1)}
          disabled={active >= shorts.length - 1}
          aria-label="Next short"
        >
          ↓
        </button>
      </div>
    </div>
  );
}

function ReelSlide({ item, index, active, nearby, watched }) {
  const play = active || nearby;
  return (
    <article className={`reel-slide ${active ? 'is-active' : ''}`} data-reel-index={index}>
      <div className="reel-frame">
        {play ? (
          <iframe
            key={`${item.id}-${active ? 'play' : 'preload'}`}
            src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=${active ? 1 : 0}&mute=1&playsinline=1&rel=0&loop=1&playlist=${item.id}`}
            title={item.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope"
            allowFullScreen
          />
        ) : (
          <img src={item.thumbnail} alt="" className="reel-poster" loading="lazy" />
        )}
      </div>
      <div className="reel-meta">
        {watched && <span className="reel-watched">Watched</span>}
        <h3>{item.title}</h3>
        <p>
          {item.channel}
          {item.views != null && <> · {formatViews(item.views)}</>}
        </p>
        <p className="reel-sound-note">Tap the player to unmute</p>
        <a href={item.url} target="_blank" rel="noreferrer">
          Open on YouTube ↗
        </a>
      </div>
      {!active && <div className="reel-idle" aria-hidden="true" />}
    </article>
  );
}
