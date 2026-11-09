import { useEffect, useState } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or disabled - ignore */
    }
  }, [key, value]);
  return [value, setValue];
}

export function useTrackData(trackId) {
  const [state, setState] = useState({ loading: !!trackId, error: null, data: null, id: null });
  useEffect(() => {
    if (!trackId) {
      setState({ loading: false, error: null, data: null, id: null });
      return undefined;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(`/api/tracks/${trackId}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || `Request failed (${r.status})`);
        return body;
      })
      .then((data) => !cancelled && setState({ loading: false, error: null, data, id: trackId }))
      .catch((error) => !cancelled && setState({ loading: false, error: error.message, data: null, id: trackId }));
    return () => {
      cancelled = true;
    };
  }, [trackId]);
  if (!trackId) return { loading: false, error: null, data: null };
  const matched = state.id === trackId;
  return { loading: !matched || state.loading, error: matched ? state.error : null, data: matched ? state.data : null };
}

export function useCareer() {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  useEffect(() => {
    let cancelled = false;
    fetch('/api/career')
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || `Request failed (${r.status})`);
        return body;
      })
      .then((data) => !cancelled && setState({ loading: false, error: null, data }))
      .catch((error) => !cancelled && setState({ loading: false, error: error.message, data: null }));
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

export function formatViews(n = 0) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M views`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K views`;
  return `${n} views`;
}
