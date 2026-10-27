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
      className="relative inline-flex flex-col items-start select-text mb-1"
      style={{ willChange: 'opacity, transform' }}
    >
      {/* ── Handwritten text ─────────────────────────────────────────────── */}
      <span
        className="relative inline-block leading-[1.15] select-none text-[#1A1A19]/85 font-hand"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(17px, 2vw, 20px)',
          fontWeight: 600,
          transform: 'rotate(-3.5deg)',
          transformOrigin: 'left center',
          letterSpacing: '0.01em',
        }}
      >
        Same skills.<br />
        Different way<br />
        to get noticed.
      </span>

      {/* ── Curved arrow pointing down toward headline ───────────────────── */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none mt-0.5 ml-6"
        width="34"
        height="28"
        viewBox="0 0 44 38"
        fill="none"
      >
        <path
          ref={arrowRef}
          d="M6 4 C12 15, 22 24, 34 32"
          stroke="rgba(26,26,25,0.65)"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ strokeDasharray: 50, strokeDashoffset: 50 }}
        />
        <path
          ref={arrowHRef}
          d="M34 32 L25 30 M34 32 L32 22"
          stroke="rgba(26,26,25,0.65)"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ strokeDasharray: 16, strokeDashoffset: 16 }}
        />
      </svg>
    </div>
  );
}
