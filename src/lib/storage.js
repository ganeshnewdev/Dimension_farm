// Safe localStorage helpers. Storage can be missing (private mode, blocked cookies)
// or hold corrupt JSON; neither must ever crash the app.

function getStore() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadJSON(key, fallback, validate) {
  try {
    const store = getStore();
    const raw = store?.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    const store = getStore();
    if (!store) return false;
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
