import { useEffect, useState } from 'react';
import { saveJSON } from '../lib/storage.js';

// useState that mirrors to localStorage. `load` runs once and must return a valid value
// (it is responsible for validation/migration, see lib/records.js).
export function usePersistentState(key, load) {
  const [value, setValue] = useState(load);
  useEffect(() => {
    saveJSON(key, value);
  }, [key, value]);
  return [value, setValue];
}
