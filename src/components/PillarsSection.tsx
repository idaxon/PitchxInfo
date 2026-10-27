import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PillarCard from './PillarCard';
import { usePillarsScrollTimeline } from '../hooks/usePillarsScrollTimeline';

export default function PillarsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Responsive breakpoint check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scrubbed Framer Motion timeline
  const {
    activeStep,
    indicatorLineHeight,
    prefersReducedMotion,
    card1,
    card2,
    card3,
  } = usePillarsScrollTimeline(containerRef);

  // Cursor Parallax on the active front card
  const [mouseParallax, setMouseParallax] = useState({ cardRotX: 0, cardRotY: 0, innerX: 0, innerY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    setMouseParallax({
      cardRotY: nx * 4, // subtle tilt max 4-6deg
      cardRotX: -ny * 3,
      innerX: nx * 8, // subtle layer shift max 8-12px
      innerY: ny * 6,
    });
  };

  const handleMouseLeave = () => {
    setMouseParallax({ cardRotX: 0, cardRotY: 0, innerX: 0, innerY: 0 });
  };

  // If on mobile or prefers-reduced-motion: render static clean layout (no scroll-pinning, no 3D)
  if (isMobile || prefersReducedMotion) {
    return (
      <section id="about-dossier" className="relative py-20 border-b border-[#E4E2DA] bg-[#F8F7F3]">
        <div className="registration-mark top-6 left-6" />
        <div className="registration-mark top-6 right-6" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
              Three pillars of <span className="italic">tangible evidence</span>.
            </h2>
            <p className="font-sans text-muted text-base">
              Engineered to replace subjective claims with verifiable artifacts and domain-specific benchmarks.
            </p>
            <p className="font-mono text-xs text-muted-light pt-1">
              Planned features. Not live yet.
            </p>
          </div>

          {/* Static Vertical Card Stack for Mobile */}
          <div className="flex flex-col gap-6">
            <PillarCard id="proof-of-work" stepNumber="01" isActive={false} />
            <PillarCard id="verified-skills" stepNumber="02" isActive={false} />
            <PillarCard id="smarter-hiring" stepNumber="03" isActive={false} />
          </div>
        </div>
      </section>
    );
  }

  // DESKTOP: Static clean layout — no scroll-pinning, no dead height
  return (
    <section
      id="about-dossier"
      className="relative py-20 lg:py-28 border-b border-[#E4E2DA] bg-[#F8F7F3]"
      aria-label="Three pillars of tangible evidence"
    >
      {/* Registration Marks */}
      <div className="registration-mark top-6 left-6" />
      <div className="registration-mark top-6 right-6" />
      <div className="registration-mark bottom-6 left-6" />
      <div className="registration-mark bottom-6 right-6" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-16">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.08]">
              Three pillars of <br />
              <span className="italic font-normal">tangible evidence</span>.
            </h2>
            <p className="font-sans text-muted text-base lg:text-lg leading-relaxed max-w-xl">
              Engineered to replace subjective claims with verifiable artifacts and domain-specific benchmarks.
            </p>
            <p className="font-mono text-xs text-muted-light pt-1">
              Planned features. Not live yet.
            </p>
          </div>

          {/* Step Indicator Strip */}
          <div className="lg:col-span-5 flex lg:justify-end items-end">
            <div className="flex items-center gap-6 font-mono text-xs">
              {[
                { num: '01', label: 'Proof of Work' },
                { num: '02', label: 'Verified Skills' },
                { num: '03', label: 'Smarter Hiring' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2 text-muted">
                  <span className="font-display text-sm font-bold text-foreground">{s.num}</span>
                  <span className="uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Column Card Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: '1600px' }}
        >
          <PillarCard id="proof-of-work" stepNumber="01" isActive={false} />
          <PillarCard id="verified-skills" stepNumber="02" isActive={false} />
          <PillarCard id="smarter-hiring" stepNumber="03" isActive={false} />
        </div>

      </div>
    </section>
  );
}

