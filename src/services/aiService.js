import { getOfflineAdvice } from '../lib/localAdvisor.js';

// Backend base URL. Empty = same origin (local dev via the Vite proxy, or the Express
// server hosting the build). On static hosting (GitHub Pages) set VITE_API_BASE_URL at
// build time to point at a hosted server; otherwise the app runs in offline mode.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function fetchWithTimeout(url, options = {}, ms = 30000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

let healthPromise = null;

// { online: server reachable, ai: Gemini key configured }. Cached for the session so that
// static hosting does not spam 404s on every message.
export function checkBackend(force = false) {
  if (!healthPromise || force) {
    healthPromise = fetchWithTimeout(`${API_BASE}/api/health`, {}, 6000)
      .then(async (res) => {
        if (!res.ok) return { online: false, ai: false };
        const json = await res.json().catch(() => null);
        return { online: json?.ok === true, ai: json?.ai === true };
      })
      .catch(() => ({ online: false, ai: false }));
  }
  return healthPromise;
}

export class ScannerError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code; // offline | config | rate | bad_request | upstream | server
  }
}

export async function analyzeCrop({ imageDataUrl, cropType, notes, lang }) {
  const status = await checkBackend();
  if (!status.online) throw new ScannerError('offline');
  if (!status.ai) throw new ScannerError('config');

  let res;
  try {
    res = await fetchWithTimeout(
      `${API_BASE}/api/ai/crop-scanner`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageDataUrl, mimeType: 'image/jpeg', cropType, notes, lang }),
      },
      60000,
    );
  } catch {
    throw new ScannerError('offline');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.diagnosis) {
    const code = body?.code || (res.status === 429 ? 'rate' : 'server');
    throw new ScannerError(code);
  }
  return body.diagnosis;
}

// Returns { text, source: 'ai' | 'offline' }. Never throws: the offline advisor is the fallback.
export async function askChat({ message, history, lang }) {
  try {
    const status = await checkBackend();
    if (status.online && status.ai) {
      const res = await fetchWithTimeout(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, lang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.reply === 'string' && data.reply.trim()) return { text: data.reply, source: 'ai' };
      }
    }
  } catch {
    // fall through to offline answer
  }
  return { text: getOfflineAdvice(message, lang), source: 'offline' };
}
