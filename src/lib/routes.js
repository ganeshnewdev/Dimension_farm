export const ROUTES = [
  'dashboard',
  'scanner',
  'advisory',
  'income',
  'budget',
  'mandi',
  'farms',
  'weather',
  'shop',
];

// '#/scanner' -> 'scanner'; anything unknown falls back to the dashboard.
export function parseHash(hash) {
  const id = String(hash ?? '').replace(/^#\/?/, '').split(/[/?]/)[0];
  return ROUTES.includes(id) ? id : 'dashboard';
}
