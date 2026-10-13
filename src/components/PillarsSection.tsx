import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PillarCard from './PillarCard';
import { usePillarsScrollTimeline } from '../hooks/usePillarsScrollTimeline';

export default function PillarsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // DESKTOP: 400vh Pinned Stage with Scroll-Driven 3D Card Reveal
  return (
    <section
      id="about-dossier"
      ref={containerRef}
      className="relative h-[400vh] border-b border-[#E4E2DA] bg-[#F8F7F3]"
      aria-label="Three pillars of tangible evidence - scroll interactive stage"
    >
      {/* Pinned Viewport Container (100vh Sticky) */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Registration Marks in pinned viewport corners */}
        <div className="registration-mark top-6 left-6" />
        <div className="registration-mark top-6 right-6" />
        <div className="registration-mark bottom-6 left-6" />
        <div className="registration-mark bottom-6 right-6" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (5 cols): Stays pinned throughout scroll */}
            <div className="lg:col-span-5 space-y-8 select-none">
              
              <div className="space-y-4">
                <h2 className="font-display text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.08]">
                  Three pillars of <br />
                  <span className="italic font-normal">tangible evidence</span>.
                </h2>
                
                <p className="font-sans text-muted text-base lg:text-lg leading-relaxed max-w-md">
                  Engineered to replace subjective claims with verifiable artifacts and domain-specific benchmarks.
                </p>

                <p className="font-mono text-xs text-muted-light pt-1">
                  Planned features. Not live yet.
                </p>
              </div>

              {/* Vertical Step Indicator with Scrubbed Yellow Progress Line */}
              <div className="pt-4 flex items-center gap-6">
                {/* Thin Vertical Progress Track */}
                <div className="relative w-[2px] h-32 bg-[#E4E2DA] rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 w-full bg-accent rounded-full"
                    style={{ height: indicatorLineHeight }}
                  />
                </div>

                {/* Step Labels */}
                <div className="flex flex-col justify-between h-32 py-0.5 font-mono text-xs">
                  {/* Step 1 */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-sm transition-colors duration-300 ${
                        activeStep === 1 ? 'font-bold text-foreground text-base' : 'text-muted-light'
                      }`}
                    >
                      01
                    </span>
                    <span
                      className={`uppercase tracking-wider transition-colors duration-300 ${
                        activeStep === 1 ? 'text-foreground font-semibold' : 'text-muted-light'
                      }`}
                    >
                      Proof of Work
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-sm transition-colors duration-300 ${
                        activeStep === 2 ? 'font-bold text-foreground text-base' : 'text-muted-light'
                      }`}
                    >
                      02
                    </span>
                    <span
                      className={`uppercase tracking-wider transition-colors duration-300 ${
                        activeStep === 2 ? 'text-foreground font-semibold' : 'text-muted-light'
                      }`}
                    >
                      Verified Skills
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-sm transition-colors duration-300 ${
                        activeStep === 3 ? 'font-bold text-foreground text-base' : 'text-muted-light'
                      }`}
                    >
                      03
                    </span>
                    <span
                      className={`uppercase tracking-wider transition-colors duration-300 ${
                        activeStep === 3 ? 'text-foreground font-semibold' : 'text-muted-light'
                      }`}
                    >
                      Smarter Hiring
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (7 cols): Card Stage with CSS 3D Perspective (1600px) */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="lg:col-span-7 relative h-[520px] flex items-center justify-center lg:justify-end"
              style={{
                perspective: '1600px',
              }}
            >
              {/* Transform Stage */}
              <div
                className="relative w-full max-w-[480px] h-[480px] flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >

                {/* 1. CARD 1: Proof of Work */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: card1.opacity,
                    z: card1.z,
                    x: card1.x,
                    y: card1.y,
                    rotateY: activeStep === 1 ? mouseParallax.cardRotY - 6 : card1.rotateY,
                    rotateX: activeStep === 1 ? mouseParallax.cardRotX + 3 : 3,
                    scale: card1.scale,
                    filter: activeStep === 1 ? 'none' : 'blur(0.8px)',
                    zIndex: activeStep === 1 ? 30 : 10,
                  }}
                >
                  <PillarCard
                    id="proof-of-work"
                    stepNumber="01"
                    isActive={activeStep === 1}
                    isStackedBehind={activeStep > 1}
                    barProgress={card1.barWidth}
                    innerParallax={
                      activeStep === 1
                        ? { x: mouseParallax.innerX, y: mouseParallax.innerY }
                        : { x: 0, y: 0 }
                    }
                  />
                </motion.div>

                {/* 2. CARD 2: Verified Skills & Proof Score */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: card2.opacity,
                    z: card2.z,
                    x: card2.x,
                    y: card2.y,
                    rotateY: activeStep === 2 ? mouseParallax.cardRotY - 6 : card2.rotateY,
                    rotateX: activeStep === 2 ? mouseParallax.cardRotX + 3 : 3,
                    scale: card2.scale,
                    filter: activeStep === 2 ? 'none' : 'blur(0.8px)',
                    zIndex: activeStep === 2 ? 30 : 20,
                  }}
                >
                  <PillarCard
                    id="verified-skills"
                    stepNumber="02"
                    isActive={activeStep === 2}
                    isStackedBehind={activeStep > 2}
                    bar1Progress={card2.bar1Width}
                    bar2Progress={card2.bar2Width}
                    bar3Progress={card2.bar3Width}
                    innerParallax={
                      activeStep === 2
                        ? { x: mouseParallax.innerX, y: mouseParallax.innerY }
                        : { x: 0, y: 0 }
                    }
                  />
                </motion.div>

                {/* 3. CARD 3: Smarter Recruiter Filtering */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: card3.opacity,
                    z: card3.z,
                    x: card3.x,
                    y: card3.y,
                    rotateY: activeStep === 3 ? mouseParallax.cardRotY - 6 : card3.rotateY,
                    rotateX: activeStep === 3 ? mouseParallax.cardRotX + 3 : 3,
                    scale: card3.scale,
                    filter: 'none',
                    zIndex: 30,
                  }}
                >
                  <PillarCard
                    id="smarter-hiring"
                    stepNumber="03"
                    isActive={activeStep === 3}
                    innerParallax={
                      activeStep === 3
                        ? { x: mouseParallax.innerX, y: mouseParallax.innerY }
                        : { x: 0, y: 0 }
                    }
                  />
                </motion.div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
