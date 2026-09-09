import type React from 'react';

/**
 * Seamless marquee.
 *
 * The track holds COPIES identical copies of the content and slides left by
 * exactly one copy width, so the frame at the end of a cycle is pixel-identical
 * to the frame at the start and the loop is invisible.
 *
 * Two requirements make it seamless:
 *   1. Every copy is exactly the same width — the track is `width: max-content`
 *      and each copy is `flex: 0 0 auto`, so none are shrunk to fit the
 *      viewport (that was the original bug: a squeezed track meant the shift
 *      no longer equalled one copy, leaving an empty trailing area).
 *   2. The shift is `-100% / COPIES`, derived from the count below via the
 *      --marquee-copies custom property so the CSS can never fall out of sync.
 *
 * COPIES - 1 copies remain on screen after the shift, so that much width must
 * cover the viewport. One copy is ~1400px, so 4 copies cover ~4200px — past
 * ultra-wide displays even if the text renders narrower than expected (shorter
 * translations, fallback fonts). Extra copies cost a little DOM and no speed:
 * the animation always travels exactly one copy per cycle.
 */
const COPIES = 4;

export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        /* The keyframe derives its shift from this, so the count lives in one
           place and the two can never disagree. */
        style={{ '--marquee-copies': COPIES } as React.CSSProperties}
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <span
            className="marquee-group"
            key={copy}
            /* Only the first copy is announced; the rest are visual padding. */
            aria-hidden={copy > 0 ? true : undefined}
          >
            {items.map((t, i) => (
              <span key={i}>
                {t}<span className="sep"> ✦ </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
