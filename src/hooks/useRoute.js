import { useCallback, useEffect, useState } from 'react';
import { parseHash } from '../lib/routes.js';

// Hash routing: works on static hosting, keeps the tab on refresh and makes the browser
// back button behave.
export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next) => {
    window.location.hash = `/${next}`;
  }, []);

  return [route, navigate];
}
