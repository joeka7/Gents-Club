import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from '../../router';
import type { Route } from '../../router';
import logoImg from '../../assets/imgs/gents-logo.png';
import logoDarkImg from '../../assets/imgs/gents-logo.png';
import { MobileMenu } from './MobileMenu';
import { useLang } from '../../context/LanguageContext';
import type { Lang } from '../../i18n';

/* ─────────────────────────────────────────────────────────
   Language config — add any language here; full translations
   required in translations.ts for the site content to change.
   ───────────────────────────────────────────────────────── */
interface Language {
  code: Lang;
  nativeName: string; // shown in dropdown + trigger
  name: string;       // English label shown beneath
  flag: string;       // flag emoji
}

const LANGUAGES: Language[] = [
  { code: 'en', nativeName: 'English',  name: 'English',  flag: '🇺🇸' },
  { code: 'ar', nativeName: 'العربية',  name: 'Arabic',   flag: '🇦🇪' },
  { code: 'ru', nativeName: 'Русский',  name: 'Russian',  flag: '🇷🇺' },
  { code: 'hi', nativeName: 'हिन्दी',    name: 'Hindi',    flag: '🇮🇳' },
  { code: 'zh', nativeName: '中文',      name: 'Chinese',  flag: '🇨🇳' },
];

/* ─────────────────────────────────────────────────────────
   LangDropdown — premium dropdown selector
   ───────────────────────────────────────────────────────── */
interface LangDropdownProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  variant?: 'default' | 'light' | 'mobile';
}

function LangDropdown({ lang, setLang, variant = 'default' }: LangDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef  = useRef<HTMLButtonElement>(null);

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  /* Keyboard navigation inside the dropdown */
  const handleMenuKey = useCallback((e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const focused = document.activeElement as HTMLButtonElement;
    const idx = items.indexOf(focused);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }, []);

  /* Open + focus first item */
  const openDropdown = () => {
    setOpen(true);
    // Let the DOM render before focusing
    requestAnimationFrame(() => itemRefs.current[0]?.focus());
  };

  const select = (code: Lang) => {
    setLang(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const cls = [
    'lang-dropdown',
    variant === 'light'  && 'lang-dropdown--light',
    variant === 'mobile' && 'lang-dropdown--mobile',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} ref={containerRef}>
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        className={`lang-dropdown__trigger${open ? ' is-open' : ''}`}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={e => {
          if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !open) {
            e.preventDefault();
            openDropdown();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.name}`}
        dir="ltr"
      >
        <span className="lang-dropdown__current">{current.nativeName}</span>
        <svg
          className={`lang-dropdown__chevron${open ? ' is-open' : ''}`}
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          aria-hidden="true"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Menu ── */}
      {open && (
        <div
          className="lang-dropdown__menu"
          role="listbox"
          aria-label="Select language"
          onKeyDown={handleMenuKey}
        >
          {LANGUAGES.map((l, i) => (
            <button
              key={l.code}
              ref={el => { itemRefs.current[i] = el; }}
              className={`lang-dropdown__item${l.code === lang ? ' is-active' : ''}`}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => select(l.code)}
              dir="ltr"
            >
              <div className="lang-dropdown__item-text">
                <span className="lang-dropdown__item-native">{l.nativeName}</span>
                <span className="lang-dropdown__item-label">{l.name}</span>
              </div>
              <svg
                className="lang-dropdown__check"
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                aria-hidden="true"
              >
                <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor"
                  strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Nav
   ───────────────────────────────────────────────────────── */
export function Nav() {
  const { route, navigate } = useRouter();
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const transparent  = route === 'home' && !scrolled;
  const servicesActive = route === 'for-adults' || route === 'for-students';

  const SERVICES: { id: Route; label: string }[] = [
    { id: 'for-adults',   label: t.nav.forAdults },
    { id: 'for-students', label: t.nav.forStudents },
  ];

  const MOBILE_LINKS: { id: Route; label: string }[] = [
    { id: 'home',         label: t.nav.home },
    { id: 'about',        label: t.nav.about },
    { id: 'for-adults',   label: t.nav.forAdults },
    { id: 'for-students', label: t.nav.forStudents },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [route]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (id: Route) => { navigate(id); setMenuOpen(false); };

  return (
    <nav className={`nav ${transparent ? 'transparent' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="container nav-inner">

        {/* ① Menu links */}
        <div className="nav-left">
          <a className={`nav-link${route === 'home' ? ' active' : ''}`} onClick={() => go('home')}>
            {t.nav.home}
          </a>
          <a className={`nav-link${route === 'about' ? ' active' : ''}`} onClick={() => go('about')}>
            {t.nav.about}
          </a>

          <div
            className={`nav-dropdown${servicesActive ? ' active' : ''}`}
            ref={servicesRef}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <span className="nav-link nav-dropdown__trigger">
              {t.nav.services}
              <svg className="nav-dropdown__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {servicesOpen && (
              <div className="nav-dropdown__menu">
                {SERVICES.map(s => (
                  <a key={s.id} className={`nav-dropdown__item${route === s.id ? ' active' : ''}`} onClick={() => go(s.id)}>
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ② Logo */}
        <div className="nav-mark" onClick={() => go('home')}>
          <img
            src={(transparent || menuOpen) ? logoImg : logoDarkImg}
            alt="Gents Facial Club"
            className="nav-logo-img"
          />
        </div>

        {/* ③ Buttons + lang dropdown + hamburger */}
        <div className="nav-right">
          <a className="nav-join btn btn-solid" href="https://everlastwellness.store/product/gents-facial-club/" target="_blank" rel="noopener noreferrer">
            {t.nav.join}
          </a>
          <a className="nav-cta" onClick={() => go('contact')}>
            {t.nav.contact}
          </a>
          <LangDropdown
            lang={lang}
            setLang={setLang}
            variant={(transparent || menuOpen) ? 'light' : 'default'}
          />
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <rect y="0"    width="20" height="1.5" rx="0.75" fill="currentColor"/>
                <rect y="6.25" width="20" height="1.5" rx="0.75" fill="currentColor"/>
                <rect y="12.5" width="20" height="1.5" rx="0.75" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile full-screen kinetic menu */}
      <MobileMenu
        open={menuOpen}
        links={MOBILE_LINKS}
        onClose={() => setMenuOpen(false)}
      />
    </nav>
  );
}
