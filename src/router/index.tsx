import { createContext, useContext, useState, useEffect } from 'react';

export type Route = 'home' | 'for-adults' | 'for-students' | 'about' | 'contact';

const VALID_ROUTES = new Set<Route>(['home', 'for-adults', 'for-students', 'about', 'contact']);

interface RouterCtx {
  route: Route;
  navigate: (r: Route) => void;
}

const RouterContext = createContext<RouterCtx>({ route: 'home', navigate: () => {} });

export function useRouter() {
  return useContext(RouterContext);
}

const LANG_PREFIXES = ['ar', 'ru', 'hi', 'zh'];

function stripLangPrefix(pathname: string): string {
  return pathname.replace(new RegExp(`^\\/(${LANG_PREFIXES.join('|')})(\/|$)`), '/') || '/';
}

function pathToRoute(pathname: string): Route {
  const seg = stripLangPrefix(pathname).replace(/^\//, '');
  return (VALID_ROUTES.has(seg as Route) ? seg : 'home') as Route;
}

export function buildPath(lang: string, route: Route): string {
  const routePart = route === 'home' ? '' : route;
  if (LANG_PREFIXES.includes(lang)) return routePart ? `/${lang}/${routePart}` : `/${lang}`;
  return routePart ? `/${routePart}` : '/';
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname));

  useEffect(() => {
    const onPop = () => {
      setRoute(pathToRoute(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (r: Route) => {
    const stored = localStorage.getItem('lang') ?? 'en';
    const lang = LANG_PREFIXES.includes(stored) ? stored : 'en';
    const path = buildPath(lang, r);
    window.history.pushState({}, '', path);
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}
