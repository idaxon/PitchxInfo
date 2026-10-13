import { useEffect, useRef } from 'react';

/**
 * PreLaunchNote
 * Replaces the generic pill badge with a handwritten margin note:
 *   "Pre-launch. We're listening."
 * + a small curved arrow pointing down-right toward the headline
 * + a hand-drawn yellow highlighter under "listening"
 *
 * Animation sequence (plays once on mount):
 *  0ms   → text fades in + drifts up 6px (400ms ease-out)
 *  350ms → arrow draws via stroke-dashoffset (500ms)
 *  600ms → highlighter draws via stroke-dashoffset (600ms)
 *
 * prefers-reduced-motion: everything shown static, no animation.
 */
export default function PreLaunchNote() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const arrowRef   = useRef<SVGPathElement>(null);
  const arrowHRef  = useRef<SVGPathElement>(null);
  const hlRef      = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrap  = wrapRef.current;
    const arrow = arrowRef.current;
    const arrowH = arrowHRef.current;
    const hl    = hlRef.current;

    if (!wrap) return;

    if (reduced) {
      wrap.style.opacity = '1';
      wrap.style.transform = 'translateY(0)';
      if (arrow)  { arrow.style.strokeDashoffset  = '0'; arrow.style.transition  = 'none'; }
      if (arrowH) { arrowH.style.strokeDashoffset = '0'; arrowH.style.transition = 'none'; }
      if (hl)     { hl.style.strokeDashoffset     = '0'; hl.style.transition     = 'none'; }
      return;
    }

    // Start hidden + shifted down
    wrap.style.opacity = '0';
    wrap.style.transform = 'translateY(6px)';
    wrap.style.transition = 'opacity 400ms cubic-bezier(.22,1,.36,1), transform 400ms cubic-bezier(.22,1,.36,1)';

    // Text drifts in
    const t1 = setTimeout(() => {
      wrap.style.opacity = '1';
      wrap.style.transform = 'translateY(0)';
    }, 60);

    // Arrow draws
    const t2 = setTimeout(() => {
      if (arrow)  { arrow.style.transition  = 'stroke-dashoffset 500ms cubic-bezier(.22,1,.36,1)'; arrow.style.strokeDashoffset  = '0'; }
      if (arrowH) { arrowH.style.transition = 'stroke-dashoffset 500ms cubic-bezier(.22,1,.36,1)'; arrowH.style.strokeDashoffset = '0'; }
    }, 350);

    // Highlighter draws
    const t3 = setTimeout(() => {
      if (hl) { hl.style.transition = 'stroke-dashoffset 600ms cubic-bezier(.22,1,.36,1)'; hl.style.strokeDashoffset = '0'; }
    }, 600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative inline-flex items-center gap-2 select-text"
      style={{ willChange: 'opacity, transform' }}
    >
      {/* ── Handwritten text ─────────────────────────────────────────────── */}
      <span
        className="relative inline-block leading-snug"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(18px, 2.2vw, 22px)',
          fontWeight: 500,
          color: 'rgba(26,26,25,0.80)',
          transform: 'rotate(-3deg)',
          transformOrigin: 'left center',
          letterSpacing: '0.01em',
        }}
      >
        Pre-launch. We&#39;re{' '}
        {/* "listening" gets the highlighter layered under it */}
        <span className="relative inline-block whitespace-nowrap">
          listening.
          {/* ── Yellow highlighter stroke (behind text) ────────────────── */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="absolute pointer-events-none"
            style={{
              left: '-2px',
              bottom: '-1px',
              width: 'calc(100% + 4px)',
              height: '12px',
              overflow: 'visible',
            }}
            viewBox="0 0 90 12"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              ref={hlRef}
              d="M1 8.5 C12 5.5, 24 10, 38 7.5 C52 5, 65 9, 78 6.5 C84 5, 88.5 7.5, 89.5 8.5"
              stroke="#F9BE08"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.40"
              style={{
                strokeDasharray: 112,
                strokeDashoffset: 112,
              }}
            />
          </svg>
        </span>
      </span>

      {/* ── Curved arrow (hidden on mobile) ──────────────────────────────── */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="hidden sm:block shrink-0 pointer-events-none"
        style={{ transform: 'translateY(4px)', marginLeft: '-2px' }}
        width="38"
        height="34"
        viewBox="0 0 38 34"
        fill="none"
      >
        {/* Main arc — gently imperfect bezier */}
        <path
          ref={arrowRef}
          d="M4 3 C8 13, 20 20, 30 28"
          stroke="rgba(26,26,25,0.50)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 44, strokeDashoffset: 44 }}
        />
        {/* Arrowhead — two short strokes at the tip */}
        <path
          ref={arrowHRef}
          d="M30 28 L22 25 M30 28 L27 20"
          stroke="rgba(26,26,25,0.50)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 14, strokeDashoffset: 14 }}
        />
      </svg>
    </div>
  );
}
