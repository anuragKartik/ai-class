import { useEffect, useRef, useState } from 'react';

async function readApiJson(response) {
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }
  if (!response.ok) {
    const message =
      (body && body.error) ||
      (text && text.slice(0, 200)) ||
      `Request failed (${response.status})`;
    throw new Error(`API error (${response.status}): ${message}`);
  }
  if (body === null) {
    throw new Error(`API error (${response.status}): expected JSON, got non-JSON response`);
  }
  return body;
}

function readLocal(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

/** Persists JSON in localStorage. Reloads when `key` changes (e.g. per-account data). */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readLocal(key, initial));
  const skipWrite = useRef(false);
  const prevKey = useRef(key);
  const initialRef = useRef(initial);
  initialRef.current = initial;

  useEffect(() => {
    if (prevKey.current === key) return;
    prevKey.current = key;
    skipWrite.current = true;
    setValue(readLocal(key, initialRef.current));
  }, [key]);

  useEffect(() => {
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
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
      .then(readApiJson)
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
      .then(readApiJson)
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
