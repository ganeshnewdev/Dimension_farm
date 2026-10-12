import { STRINGS } from './strings.js';

// {name} placeholders are replaced from `vars`. Missing keys fall back to English, then to
// the key itself (so a gap is visible, never blank).
export function translate(lang, key, vars) {
  const template = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}
