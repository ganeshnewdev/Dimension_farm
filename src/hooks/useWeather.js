import { useCallback, useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherService.js';

// Fetches weather for a coordinate. Aborts the previous request when the location changes
// so a slow, stale response can never overwrite a newer one.
export function useWeather(lat, lon, enabled = true) {
  const [state, setState] = useState({ data: null, loading: enabled, error: false });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    const ctrl = new AbortController();
    setState((s) => ({ data: s.data, loading: true, error: false }));
    fetchWeather(lat, lon, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: false }))
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setState((s) => ({ data: s.data, loading: false, error: true }));
      });
    return () => ctrl.abort();
  }, [lat, lon, enabled, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, refresh };
}
