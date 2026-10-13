import { useEffect, useRef } from 'react';

interface PrototypeNoteProps {
  onFeedbackClick: () => void;
}

/**
 * PrototypeNote — paper slip pinned to the hero, below the CTA buttons.
 *
 * Design: warm-paper background, 1px border, soft shadow, -1.5deg rotation,
 * yellow tape strip across the top-left corner.
 *
 * Animation: drops in from -12px / -4deg → 0 / -1.5deg once, on mount.
 * Hover: straightens to -0.5deg, lifts 2px, shadow deepens.
 * prefers-reduced-motion: opacity fade only.
 */
export default function PrototypeNote({ onFeedbackClick }: PrototypeNoteProps) {
  const slipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slip = slipRef.current;
    if (!slip) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      slip.style.opacity = '1';
      return;
    }

    // Start: hidden, shifted up, over-rotated
    slip.style.opacity = '0';
    slip.style.transform = 'translateY(-12px) rotate(-4deg)';
    slip.style.transition = 'none';

    const t = setTimeout(() => {
      slip.style.transition =
        'opacity 500ms cubic-bezier(.22,1,.36,1), transform 500ms cubic-bezier(.22,1,.36,1)';
      slip.style.opacity = '1';
      slip.style.transform = 'translateY(0) rotate(-1.5deg)';
    }, 550); // after buttons appear

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={slipRef}
      className="group relative max-w-[420px] w-full"
      style={{
        opacity: 0,
        transform: 'translateY(-12px) rotate(-4deg)',
        willChange: 'opacity, transform',
        transformOrigin: 'top left',
      }}
      onMouseEnter={(e) => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) rotate(-0.5deg)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(26,26,25,0.13)';
      }}
      onMouseLeave={(e) => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) rotate(-1.5deg)';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Paper slip container */}
      <div
        style={{
          background: '#FFFDF6',
          border: '1px solid #E4E2DA',
          borderRadius: '4px',
          boxShadow: '0 4px 16px rgba(26,26,25,0.07), 0 1px 3px rgba(26,26,25,0.04)',
          padding: '20px 20px 18px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 300ms cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* ── Yellow tape strip ─────────────────────────────────────────── */}
        {/* Positioned top-left, rotated -8deg, slightly uneven via clip-path */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-6px',
            left: '14px',
            width: '56px',
            height: '20px',
            background: 'rgba(249,190,8,0.55)',
            transform: 'rotate(-8deg)',
            transformOrigin: 'center center',
            // Uneven edges via clip-path: very slight taper on each side
            clipPath: 'polygon(1px 1px, calc(100% - 2px) 0px, 100% 100%, 0px calc(100% - 1px))',
            zIndex: 10,
          }}
        />

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Title */}
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '17px',
              fontWeight: 600,
              color: '#1A1A19',
              lineHeight: 1.3,
              marginBottom: '8px',
              marginTop: '8px', // clears tape
            }}
          >
            Heads up: this is a prototype.
          </p>

          {/* Body */}
          <p
            style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: '14px',
              color: '#4A4A47',
              lineHeight: 1.65,
              marginBottom: '12px',
            }}
          >
            PitchX launches soon. It's built for you, so help us shape it.
            Fill the 2-minute form and tell us what to fix.
          </p>

          {/* Link + sign-off row */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={onFeedbackClick}
              className="feedback-link group/link"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: "'Geist', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#1A1A19',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                outline: 'none',
                position: 'relative',
              }}
              // Keyboard focus ring: yellow outer + black inner
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.outline = '2px solid #F9BE08';
                (e.currentTarget as HTMLElement).style.outlineOffset = '3px';
                (e.currentTarget as HTMLElement).style.borderRadius = '2px';
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.outline = 'none';
              }}
            >
              {/* Yellow underline via pseudo-element (done in CSS below) */}
              <span className="note-link-text">Share your feedback</span>
              <span
                className="note-arrow"
                style={{
                  display: 'inline-block',
                  transition: 'transform 200ms cubic-bezier(.22,1,.36,1)',
                }}
              >
                →
              </span>
            </button>

            {/* Sign-off */}
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: 'italic',
                fontSize: '13px',
                color: '#9E9D95',
                flexShrink: 0,
              }}
            >
              Team PitchX
            </span>
          </div>

        </div>
      </div>

      {/* Inline scoped styles for hover states */}
      <style>{`
        .note-link-text {
          position: relative;
          display: inline-block;
        }
        .note-link-text::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 2px;
          background: #F9BE08;
          border-radius: 1px;
          transform-origin: left;
          transition: height 180ms ease, bottom 180ms ease;
        }
        .feedback-link:hover .note-link-text::after,
        .feedback-link:focus-visible .note-link-text::after {
          height: 8px;
          bottom: -1px;
          opacity: 0.35;
        }
        .feedback-link:hover .note-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
