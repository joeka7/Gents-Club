import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SmokeBackground } from '../ui/SmokeBackground';
import { useRouter } from '../../router';
import type { Route } from '../../router';
import { useLang } from '../../context/LanguageContext';

gsap.registerPlugin(CustomEase);

/* Registered once — the reference's signature ease. */
const EASE = 'aljameelaMenu';
if (!gsap.parseEase(EASE)) {
  CustomEase.create(EASE, '0.65, 0.01, 0.05, 0.99');
}

export interface MobileMenuLink {
  id: Route;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  links: MobileMenuLink[];
  onClose: () => void;
  /** Language selector, owned by Nav so its state stays in one place. */
  footer?: ReactNode;
}

export function MobileMenu({ open, links, onClose, footer }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { route, navigate } = useRouter();
  const { t, isRTL } = useLang();

  /* Keep the latest callbacks without re-running the animation effect. */
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  /* One context for the component's whole life, created and reverted on
     mount/unmount, so toggling never strips inline styles the previous
     timeline just set. */
  const ctxRef = useRef<gsap.Context | null>(null);
  useEffect(() => {
    ctxRef.current = gsap.context(() => {});
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  /* The menu starts closed and CSS already hides it — skip the pointless
     close timeline on mount so nothing animates on page load. */
  const hasOpened = useRef(false);

  /* A link tap stores its route here and closes the menu; the exit timeline
     performs the actual navigation once the panel has covered the page. */
  const pendingRouteRef = useRef<Route | null>(null);

  /* Keep the WebGL shader mounted through the exit animation so the backdrop
     never pops to flat colour mid-slide, then tear it down to free the GL
     context while the menu is idle. Derived from `open` with a trailing delay
     rather than set during render. */
  const [lingering, setLingering] = useState(false);
  useEffect(() => {
    if (open) return;
    if (!hasOpened.current) return;
    setLingering(true);
    const id = window.setTimeout(() => setLingering(false), 800);
    return () => window.clearTimeout(id);
  }, [open]);
  const smokeMounted = open || lingering;

  /* ── Open / close timeline ───────────────────────────────────── */
  useEffect(() => {
    const root = rootRef.current;
    const ctx = ctxRef.current;
    if (!root || !ctx) return;
    if (!open && !hasOpened.current) return;
    if (open) {
      hasOpened.current = true;
      /* Reopened mid-exit — cancel any queued navigation. */
      pendingRouteRef.current = null;
    }

    /* Panels enter from the inline-end edge so RTL mirrors correctly. */
    const dir = isRTL ? -1 : 1;

    ctx.add(() => {
      const overlay = root.querySelector('.mm-overlay');
      const panels = root.querySelectorAll('.mm-panel');
      const content = root.querySelector('.mm-content');
      const linkEls = root.querySelectorAll('.mm-link-inner');
      const fadeEls = root.querySelectorAll('[data-mm-fade]');

      const tl = gsap.timeline({
        defaults: { ease: EASE, duration: 0.7 },
      });

      if (open) {
        tl.set(root, { display: 'block' })
          .set(content, { xPercent: 0 })
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, '<')
          .fromTo(
            panels,
            { xPercent: 101 * dir },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            '<'
          )
          .fromTo(
            linkEls,
            { yPercent: 140, rotate: 10 * dir },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            '<+=0.35'
          );

        if (fadeEls.length) {
          tl.fromTo(
            fadeEls,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: 'all' },
            '<+=0.2'
          );
        }
      } else {
        tl.to(overlay, { autoAlpha: 0 })
          .to(content, { xPercent: 120 * dir }, '<')
          /* Swap the route once the panel has cleared the viewport (~0.37s of
             the 0.7s slide, since the ease front-loads the motion). Waiting
             for the full tween would make navigation feel sluggish; going any
             earlier is what exposed the oxblood panel behind the page. */
          .call(
            () => {
              const target = pendingRouteRef.current;
              if (target) {
                pendingRouteRef.current = null;
                navigateRef.current(target);
              }
            },
            undefined,
            0.37
          )
          .set(root, { display: 'none' }, 0.7);
      }
    });
  }, [open, isRTL]);

  /* ── Focus management ────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    if (!root) return;
    const restoreTo = document.activeElement as HTMLElement | null;
    /* Wait for the reveal to start so focus doesn't scroll a hidden element. */
    const id = window.setTimeout(() => {
      root.querySelector<HTMLButtonElement>('.mm-link')?.focus();
    }, 350);
    return () => {
      window.clearTimeout(id);
      restoreTo?.focus?.();
    };
  }, [open]);

  /* ── Escape to close ─────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: Route) => {
    if (route === id) {
      /* Same page — nothing to navigate, just dismiss. */
      onClose();
      return;
    }
    pendingRouteRef.current = id;
    onClose();
  };

  return (
    <div
      className="mm-root"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      {/* Tint layer behind the panel; the panel is full-bleed so this is never
          an exposed backdrop and carries no click handler. */}
      <div className="mm-overlay" />

      <div className="mm-content">
        {/* Layer 1 — WebGL smoke, deepest background */}
        <div className="mm-panel mm-panel--smoke">
          {smokeMounted && <SmokeBackground smokeColor="#4a6d90" />}
        </div>
        {/* Layer 2 — animated colour panel */}
        <div className="mm-panel mm-panel--ink" />

        <nav className="mm-nav">
          <ul className="mm-links">
            {links.map((l) => (
              <li key={l.id} className="mm-link-row">
                <button
                  type="button"
                  className={`mm-link${route === l.id ? ' is-active' : ''}`}
                  onClick={() => go(l.id)}
                  aria-current={route === l.id ? 'page' : undefined}
                >
                  <span className="mm-link-inner">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mm-actions">
            <a
              className="btn btn-solid mm-action"
              data-mm-fade
              href="https://everlastwellness.store/product/aljameela-club/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.nav.join} <span className="arrow"></span>
            </a>
            <button
              type="button"
              className="btn btn-gold mm-action"
              data-mm-fade
              onClick={() => go('contact')}
            >
              {t.nav.contact} <span className="arrow"></span>
            </button>
          </div>

          {footer && (
            <div className="mm-footer" data-mm-fade>
              {footer}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
