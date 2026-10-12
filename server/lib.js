// Pure helpers for the API server (no network, no Express), so they can be unit-tested.

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BASE64_CHARS = 10_000_000; // ~7.5 MB of image data after the client downscale

export function stripDataUrl(value) {
  return String(value).replace(/^data:[^;,]+;base64,/, '');
}

// Gemini normally returns bare JSON when responseMimeType is application/json, but be
// tolerant of code fences or leading prose.
export function extractJSON(text) {
  if (typeof text !== 'string') return null;
  const attempts = [text, text.replace(/^```(?:json)?\s*|\s*```$/gi, '')];
  const braces = text.match(/\{[\s\S]*\}/);
  if (braces) attempts.push(braces[0]);
  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate.trim());
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // try the next strategy
    }
  }
  return null;
}

const list = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v.trim() ? [v] : []).map((x) => String(x).slice(0, 400)).slice(0, 8);
const text = (v, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 400) : fallback);

export function normalizeDiagnosis(raw) {
  const score = Number(raw.confidenceScore);
  return {
    identifiedCrop: text(raw.identifiedCrop),
    conditionName: text(raw.conditionName),
    conditionType: text(raw.conditionType),
    severity: text(raw.severity, 'Moderate'),
    confidenceScore: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
    visibleSymptoms: list(raw.visibleSymptoms),
    possibleCauses: list(raw.possibleCauses),
    organicTreatment: list(raw.organicTreatment),
    chemicalTreatment: list(raw.chemicalTreatment),
    preventiveMeasures: list(raw.preventiveMeasures),
    expertAdvisory: text(raw.expertAdvisory),
  };
}

export function validateScanRequest(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'body' };
  const { imageBase64, mimeType, cropType, notes, lang } = body;
  if (typeof imageBase64 !== 'string' || imageBase64.length < 100) return { ok: false, error: 'image' };
  if (imageBase64.length > MAX_BASE64_CHARS) return { ok: false, error: 'tooLarge' };
  const mime = ALLOWED_MIME.has(mimeType) ? mimeType : 'image/jpeg';
  const data = stripDataUrl(imageBase64);
  if (!/^[A-Za-z0-9+/=\s]+$/.test(data)) return { ok: false, error: 'image' };
  return {
    ok: true,
    value: {
      data,
      mime,
      cropType: typeof cropType === 'string' ? cropType.replace(/\s+/g, ' ').trim().slice(0, 60) : 'auto',
      notes: typeof notes === 'string' ? notes.replace(/\s+/g, ' ').trim().slice(0, 200) : '',
      lang: lang === 'en' ? 'en' : 'hi',
    },
  };
}

// Gemini requires contents to start with a user turn and to alternate roles.
export function buildChatContents(history, message) {
  const turns = [];
  const push = (role, textValue) => {
    const clean = String(textValue ?? '').trim().slice(0, 1000);
    if (!clean) return;
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.parts[0].text += `\n${clean}`;
    else turns.push({ role, parts: [{ text: clean }] });
  };

  if (Array.isArray(history)) {
    for (const item of history.slice(-10)) {
      if (!item || typeof item !== 'object') continue;
      push(item.sender === 'user' ? 'user' : 'model', item.text);
    }
  }
  while (turns.length > 0 && turns[0].role !== 'user') turns.shift();
  push('user', message);
  return turns;
}

export function createRateLimiter({ windowMs = 60_000, max = 20, now = () => Date.now() } = {}) {
  const hits = new Map();
  return function allow(key) {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(t);
    hits.set(key, recent);
    // opportunistic cleanup so the map cannot grow without bound
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.every((ts) => t - ts >= windowMs)) hits.delete(k);
    }
    return true;
  };
}
