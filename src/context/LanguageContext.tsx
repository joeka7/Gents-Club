import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../i18n';
import type { Lang, Translations } from '../i18n';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  isRTL: boolean;
  /** Returns enClass when lang is EN, arClass when lang is AR */
  lc: (enClass: string, arClass: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const LANG_CODES: Lang[] = ['ar', 'ru', 'hi', 'zh'];

function detectLangFromUrl(): Lang | null {
  for (const code of LANG_CODES) {
    if (window.location.pathname.startsWith(`/${code}`)) return code;
  }
  return null;
}

function stripAllLangPrefixes(pathname: string): string {
  return pathname.replace(/^\/(ar|ru|hi|zh)(\/|$)/, '/') || '/';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const fromUrl = detectLangFromUrl();
    if (fromUrl) return fromUrl;
    const stored = localStorage.getItem('lang') as Lang | null;
    return stored && (LANG_CODES.includes(stored) || stored === 'en') ? stored : 'en';
  });

  const setLang = (l: Lang) => {
    localStorage.setItem('lang', l);
    setLangState(l);
    const withoutPrefix = stripAllLangPrefixes(window.location.pathname);
    const newPath = LANG_CODES.includes(l)
      ? (withoutPrefix === '/' ? `/${l}` : `/${l}${withoutPrefix}`)
      : withoutPrefix;
    window.history.replaceState({}, '', newPath);
  };

  useEffect(() => {
    const isRTL = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang]);

  const lc = (enClass: string, arClass: string) => lang === 'ar' ? arClass : enClass;

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang], isRTL: lang === 'ar', lc }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
