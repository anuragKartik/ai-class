import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './hooks.js';

/* ---------- Progress (checkboxes everywhere, saved in this browser) ---------- */
const ProgressCtx = createContext(null);

export function ProgressProvider({ children }) {
  const [done, setDone] = useLocalStorage('anurag-ai-classes.progress.v1', {});
  const toggle = useCallback(
    (key) =>
      setDone((m) => {
        const next = { ...m };
        if (next[key]) delete next[key];
        else next[key] = Date.now();
        return next;
      }),
    [setDone],
  );
  const value = useMemo(() => ({ done, toggle }), [done, toggle]);
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export const useProgress = () => useContext(ProgressCtx);

/** How many keys with this prefix are done. */
export function countDone(done, prefix) {
  let n = 0;
  for (const k in done) if (k.startsWith(prefix)) n++;
  return n;
}

/* ---------- Video player (modal, shared by every view) ---------- */
const PlayerCtx = createContext(() => {});
export const usePlayer = () => useContext(PlayerCtx);

export function PlayerProvider({ children }) {
  const [item, setItem] = useState(null);
  const close = useCallback(() => setItem(null), []);
  useEffect(() => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, []);
  return (
    <PlayerCtx.Provider value={setItem}>
      {children}
      <PlayerModal item={item} onClose={close} />
    </PlayerCtx.Provider>
  );
}

function PlayerModal({ item, onClose }) {
  const isOpen = !!item;
  useEffect(() => {
    if (!isOpen) return undefined; // only lock page scroll while the player is open
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!item) return null;
  const portrait = item.type === 'short';
  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className={`modal-box ${portrait ? 'portrait' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close player">
          Close ✕
        </button>
        <div className="frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
            title={item.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="modal-foot">
          <strong>{item.title}</strong>
          <a href={item.url} target="_blank" rel="noreferrer">
            Video not playing? Open on YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
