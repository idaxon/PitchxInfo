import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, GitBranch, Star, ChevronRight, Globe } from 'lucide-react';

// Inline icon components to avoid extra dependencies
function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const SKILL_BARS = [
  { label: 'Frontend Architecture', icon: '</>',  score: 92, delay: 0 },
  { label: 'Distributed Systems',   icon: '⬢',    score: 84, delay: 100 },
  { label: 'Projects',              icon: '▦',    score: 88, delay: 200 },
  { label: 'Assessments',           icon: '⊕',    score: 79, delay: 300 },
];

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseOffset({ x, y });
  };
  const handleMouseLeave = () => setMouseOffset({ x: 0, y: 0 });

  const shiftX = mouseOffset.x * 4;
  const shiftY = mouseOffset.y * 3;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[640px] select-none mx-auto flex items-center justify-center"
      aria-label="PitchX Proof Profile Composition"
    >

      {/* ===================================================================
          MOBILE LAYOUT (< 640px) — compact full profile card
         =================================================================== */}
      <div className="sm:hidden w-full max-w-[360px] mx-auto py-4 space-y-3">

        {/* Handwritten top-left annotation */}
        <div className="px-1">
          <span
            className="text-[15px] font-semibold text-[#1A1A19]/80 leading-tight"
            style={{ fontFamily: "'Caveat', cursive", display: 'inline-block', transform: 'rotate(-2deg)' }}
          >
            Your work. Your proof. ↓
          </span>
        </div>

        {/* Main Profile + Score Card */}
        <div className="relative rounded-2xl bg-white border border-[#E5E3DA] shadow-[0_16px_40px_rgba(26,26,25,0.09)] overflow-hidden">

          {/* Binder clip decoration at top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ top: '-1px' }}
          >
            <div className="w-6 h-3.5 bg-[#1A1A19] rounded-[3px] relative flex items-center justify-center">
              <div className="w-3 h-2.5 bg-[#F8F7F3] rounded-[2px]" />
            </div>
          </div>

          {/* Profile Header */}
          <div className="p-4 pb-3 border-b border-[#F0EFEA]">
            <div className="flex items-center gap-3">
              {/* Avatar with crown */}
              <div className="relative shrink-0">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                  <span className="text-[14px]">👑</span>
                </div>
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#F9BE08] bg-[#FFF8E6]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Arjun Mehta"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-sans text-[14px] font-bold text-[#1A1A19] leading-tight">Arjun Mehta</h4>
                <p className="font-sans text-[11px] text-[#6B6A63]">Frontend Developer</p>
                <div className="flex items-center gap-2 mt-0.5 text-[#1A1A19]/70">
                  <GitHubIcon className="w-3 h-3" />
                  <LinkedInIcon className="w-3 h-3" />
                  <Globe className="w-3 h-3" />
                </div>
              </div>

              {/* Proof Score badge */}
              <div className="text-right shrink-0">
                <div className="text-[9px] font-mono uppercase text-[#8F8D85] font-bold tracking-wider leading-none">Proof Score</div>
                <div className="font-mono font-black text-[#1A1A19] text-2xl leading-tight">
                  87<span className="text-base font-normal text-[#8F8D85]">/100</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="px-2.5 py-1 rounded-full bg-[#1A1A19] text-white font-sans text-[10px] font-semibold">Overview</span>
              <span className="px-2 py-1 rounded-full text-[#6B6A63] font-sans text-[10px] border border-[#E5E3DA]">Skills</span>
              <span className="px-2 py-1 rounded-full text-[#6B6A63] font-sans text-[10px] border border-[#E5E3DA]">Projects</span>
              <span className="px-2 py-1 rounded-full text-[#6B6A63] font-sans text-[10px] border border-[#E5E3DA]">Assessments</span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8F8D85] font-bold">Proof Score Breakdown</span>
              <span className="font-hand text-[12px] text-[#1A1A19]/60 italic" style={{ fontFamily: "'Caveat', cursive" }}>
                Real skills. Real proof.
              </span>
            </div>

            {SKILL_BARS.map((bar) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#8F8D85] w-3 text-center shrink-0">{bar.icon}</span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#1A1A19]">{bar.label}</span>
                    <span className="font-bold text-[#1A1A19]">{bar.score} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F4F3ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F9BE08] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: mounted ? `${bar.score}%` : '0%', transitionDelay: `${bar.delay}ms` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Verified Evidence footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F0EFEA]">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#F9BE08] flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-[#1A1A19]" />
                </div>
                <div>
                  <p className="font-mono text-[9px] font-bold text-[#1A1A19]">Verified Evidence</p>
                  <p className="font-sans text-[8.5px] text-[#8F8D85]">Backed by real work, code and assessments.</p>
                </div>
              </div>
              <span className="font-mono text-[9px] text-[#8F8D85] flex items-center gap-1">PX-AUDIT #842 <ChevronRight className="w-2.5 h-2.5" /></span>
            </div>
          </div>
        </div>

        {/* Bottom two mini-cards side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Projects */}
          <div className="rounded-xl bg-white border border-[#E5E3DA] p-2.5 shadow-sm">
            <p className="font-mono text-[8px] uppercase tracking-wider text-[#8F8D85] font-bold mb-1.5">Projects</p>
            <div className="w-full h-10 rounded-md overflow-hidden bg-neutral-100 mb-1.5">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=120&q=80"
                alt="Real-time Collab Tool"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-sans text-[10px] font-bold text-[#1A1A19] leading-tight truncate">Real-time Collab Tool</p>
            <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono text-[#6B6A63]">
              <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F9BE08] text-[#F9BE08]" />1.2k</span>
              <span className="flex items-center gap-0.5"><GitBranch className="w-2.5 h-2.5" />320</span>
            </div>
          </div>

          {/* Assessments + GitHub stacked */}
          <div className="space-y-2">
            <div className="rounded-xl bg-white border border-[#E5E3DA] p-2.5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-[8px] uppercase tracking-wider text-[#8F8D85] font-bold">Assessments</p>
                <ChevronRight className="w-3 h-3 text-[#8F8D85]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#1A1A19]">&lt;/&gt; DSA</span>
                <div className="w-6 h-6 rounded-full border-2 border-[#F9BE08] bg-[#FFF8E6] flex items-center justify-center font-mono font-bold text-[10px] text-[#1A1A19]">92</div>
              </div>
            </div>
            <div className="rounded-xl bg-white border border-[#E5E3DA] p-2.5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-[8px] uppercase tracking-wider text-[#8F8D85] font-bold">GitHub Activity</p>
                <GitHubIcon className="w-3 h-3 text-[#1A1A19]" />
              </div>
              <div className="flex items-end gap-0.5 h-5">
                {[35, 60, 45, 80, 55, 100, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#1A1A19] rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="font-mono text-[9px] font-bold text-[#1A1A19] mt-0.5">312 <span className="font-normal text-[#8F8D85]">contributions</span></p>
            </div>
          </div>
        </div>

        {/* Bottom torn paper sticker */}
        <div
          className="relative p-3 text-center overflow-hidden"
          style={{
            background: '#1A1A19',
            borderRadius: '12px',
            transform: 'rotate(-0.5deg)',
          }}
        >
          {/* Torn top edge simulation */}
          <div className="absolute top-0 left-0 right-0 h-2.5 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-full" fill="#1A1A19">
              <path d="M0 12 Q20 2, 40 8 Q60 14, 80 5 Q100 0, 120 9 Q140 15, 160 4 Q180 0, 200 7 Q220 14, 240 3 Q260 0, 280 10 Q300 14, 320 5 Q340 0, 360 8 Q380 14, 400 4 L400 12 Z" />
            </svg>
          </div>
          <p className="font-semibold text-[#F9BE08] text-[14px] leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
            Your work.<br />Your proof.<br />Real opportunities.
          </p>
        </div>

      </div>

      {/* ===================================================================
          DESKTOP & TABLET LAYOUT (>= 640px) — full layered scrapbook
         =================================================================== */}
      <div className="hidden sm:block w-full h-[530px] lg:h-[520px] relative">

        {/* ── TOP-LEFT: "Same skills. Different way to get noticed." ── */}
        <div className="absolute top-3 left-2 z-30 pointer-events-none">
          <span
            className="text-[17px] font-semibold text-[#1A1A19]/80 leading-snug"
            style={{ fontFamily: "'Caveat', cursive", display: 'inline-block', transform: 'rotate(-2.5deg)' }}
          >
            Same skills.<br />Different way<br />to get noticed.
          </span>
          {/* Curved arrow pointing right-down */}
          <svg width="38" height="30" viewBox="0 0 42 34" fill="none" className="mt-0.5 ml-5">
            <path d="M4 6 C14 8, 26 16, 36 28" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M36 28 L28 25 M36 28 L34 19" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* ── TOP CENTER: "Your work. Your proof." annotation ── */}
        <div className="absolute top-0 left-[220px] z-30 pointer-events-none">
          <span
            className="text-[19px] font-semibold text-[#1A1A19]/85 leading-snug"
            style={{ fontFamily: "'Caveat', cursive", display: 'inline-block', transform: 'rotate(1deg)' }}
          >
            Your work.<br />Your proof.
          </span>
          {/* Arrow pointing down */}
          <svg width="24" height="28" viewBox="0 0 28 32" fill="none" className="mt-0.5 ml-2">
            <path d="M6 4 C10 12, 14 20, 18 28" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M18 28 L11 23 M18 28 L22 20" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* ── TOP RIGHT: "Objective. Transparent. Bias-Free." annotation + border box ── */}
        <div className="absolute top-2 right-2 z-30 pointer-events-none">
          <div
            className="border-2 border-dashed border-[#F9BE08] rounded-xl px-3 py-2"
            style={{ transform: 'rotate(1.5deg)' }}
          >
            <span
              className="text-[17px] font-semibold text-[#1A1A19]/85 leading-snug text-center block"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Objective.<br />Transparent.<br />Bias-Free.
            </span>
          </div>
          {/* Arrow pointing down-left */}
          <svg width="32" height="30" viewBox="0 0 36 34" fill="none" className="mt-0.5 mr-4 ml-auto">
            <path d="M28 4 C20 12, 14 20, 8 28" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8 28 L14 22 M8 28 L16 30" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* ── PARALLAX STAGE ── */}
        <div
          className="relative w-full h-full"
          style={{ transform: `translate3d(${shiftX}px, ${shiftY}px, 0)`, transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}
        >

          {/* ── LEFT CARD: PROJECTS ── */}
          <div
            className="absolute left-0 top-[110px] z-10 w-[155px] rounded-xl bg-white border border-[#E5E3DA] p-2.5 shadow-[0_10px_28px_rgba(26,26,25,0.07)] hover:scale-105 transition-transform duration-300"
            style={{ transform: 'rotate(-5deg)' }}
          >
            {/* washi tape */}
            <div
              className="absolute -top-2 left-3 w-10 h-4 rounded-xs bg-[#F9BE08]/65 pointer-events-none"
              style={{ transform: 'rotate(5deg)', clipPath: 'polygon(2% 0%, 98% 3%, 97% 97%, 3% 95%)' }}
            />
            <div className="flex items-center gap-1 mb-1.5">
              <span className="text-[9px]">📁</span>
              <p className="font-sans text-[11px] font-bold text-[#1A1A19]">Projects</p>
              <ChevronRight className="w-3 h-3 text-[#8F8D85] ml-auto" />
            </div>
            <div className="w-full h-14 rounded-md overflow-hidden bg-neutral-100 mb-1.5 border border-[#E5E3DA]">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=160&q=80"
                alt="Real-time Collab Tool"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-sans text-[11px] font-bold text-[#1A1A19] leading-tight">Real-time<br />Collab Tool</p>
            <div className="flex items-center gap-2 mt-0.5 text-[9.5px] font-mono text-[#6B6A63]">
              <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F9BE08] text-[#F9BE08]" />1.2k</span>
              <span className="flex items-center gap-0.5"><GitBranch className="w-2.5 h-2.5" />320</span>
            </div>
          </div>

          {/* ── BOTTOM LEFT STICKY NOTE: "Not just resumes…" ── */}
          <div
            className="absolute left-0 bottom-12 z-20 w-[148px] py-3 px-3 rounded-lg shadow-md"
            style={{ background: '#F9BE08', transform: 'rotate(-2.5deg)' }}
          >
            <span className="text-[9px]">💡</span>
            <p className="font-semibold text-[#1A1A19] text-[15px] leading-tight mt-0.5" style={{ fontFamily: "'Caveat', cursive" }}>
              Not just<br />resumes.<br />Real people,<br />real work.
            </p>
            {/* Curved arrow going right */}
            <svg width="28" height="22" viewBox="0 0 32 26" fill="none" className="mt-1 ml-auto">
              <path d="M4 20 C10 12, 20 8, 28 5" stroke="rgba(26,26,25,0.6)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M28 5 L20 7 M28 5 L26 14" stroke="rgba(26,26,25,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* ── MAIN CENTER CARD: FULL PROFILE + PROOF SCORE ── */}
          <div
            className="absolute top-14 left-[148px] z-20 w-[280px] lg:w-[300px] rounded-2xl bg-white border border-[#E5E3DA] shadow-[0_24px_52px_rgba(26,26,25,0.12)] overflow-hidden"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            {/* Binder clip at top center */}
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
              <div className="w-7 h-4 bg-[#1A1A19] rounded-t-sm rounded-b-[2px] flex items-center justify-center">
                <div className="w-4 h-2.5 bg-[#F8F7F3] rounded-sm" />
              </div>
            </div>

            {/* Profile header section */}
            <div className="pt-5 px-4 pb-3 border-b border-[#F0EFEA]">
              <div className="flex items-start gap-3">
                {/* Avatar with crown */}
                <div className="relative shrink-0">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[16px]">👑</div>
                  <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-[#F9BE08] bg-[#FFF8E6]">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
                      alt="Arjun Mehta"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-[16px] font-bold text-[#1A1A19] leading-tight">Arjun Mehta</h3>
                  <p className="font-sans text-[11.5px] text-[#6B6A63] leading-snug">Frontend Developer</p>
                  <div className="flex items-center gap-2 mt-1 text-[#1A1A19]/70">
                    <GitHubIcon className="w-3.5 h-3.5" />
                    <LinkedInIcon className="w-3.5 h-3.5" />
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Proof score badge */}
                <div className="shrink-0 text-right">
                  <div className="text-[8.5px] font-mono uppercase text-[#8F8D85] tracking-wider font-bold leading-none">Proof Score</div>
                  <div className="font-mono font-black text-[#1A1A19] text-[26px] leading-tight">
                    87<span className="text-[16px] font-normal text-[#8F8D85]">/100</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="px-3 py-1 rounded-full bg-[#1A1A19] text-white font-sans text-[10px] font-semibold">Overview</span>
                <span className="px-2.5 py-1 rounded-full text-[#6B6A63] font-sans text-[10px] border border-[#E5E3DA] hover:border-foreground transition-colors cursor-default">Skills</span>
                <span className="px-2.5 py-1 rounded-full text-[#6B6A63] font-sans text-[10px] border border-[#E5E3DA] hover:border-foreground transition-colors cursor-default">Projects</span>
                <span className="px-2.5 py-1 rounded-full text-[#6B6A63] font-sans text-[10px] border border-[#E5E3DA] hover:border-foreground transition-colors cursor-default">Assessments</span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="px-4 py-3.5 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[13px] font-bold text-[#1A1A19] tracking-tight">Proof Score Breakdown</span>
                <span className="font-hand text-[12px] text-[#1A1A19]/50 italic" style={{ fontFamily: "'Caveat', cursive" }}>
                  Real skills. Real proof.
                </span>
              </div>

              {SKILL_BARS.map((bar) => (
                <div key={bar.label} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#F4F3ED] flex items-center justify-center shrink-0">
                    <span className="font-mono text-[9px] text-[#8F8D85]">{bar.icon}</span>
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex justify-between font-mono text-[10.5px]">
                      <span className="text-[#1A1A19] truncate">{bar.label}</span>
                      <span className="font-bold text-[#1A1A19] ml-2 shrink-0">{bar.score} / 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F4F3ED] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F9BE08] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: mounted ? `${bar.score}%` : '0%', transitionDelay: `${bar.delay}ms` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified evidence footer */}
            <div className="px-4 pb-4 pt-2 border-t border-[#F0EFEA]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#F9BE08] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3 text-[#1A1A19]" />
                  </div>
                  <div>
                    <p className="font-mono text-[9.5px] font-bold text-[#1A1A19]">Verified Evidence</p>
                    <p className="font-sans text-[8.5px] text-[#8F8D85]">All scores backed by real work, code and assessments.</p>
                  </div>
                </div>
                <span className="font-mono text-[9px] text-[#8F8D85] flex items-center gap-0.5 shrink-0">
                  PX-AUDIT #842 <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT TOP CARD: ASSESSMENTS ── */}
          <div
            className="absolute right-3 top-[100px] z-15 w-[155px] rounded-xl bg-white border border-[#E5E3DA] p-3 shadow-[0_10px_24px_rgba(26,26,25,0.07)] hover:scale-105 transition-transform duration-300"
            style={{ transform: 'rotate(3deg)' }}
          >
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#F0EFEA]">
              <span className="font-sans text-[12px] font-bold text-[#1A1A19]">Assessments</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8F8D85]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11.5px] font-bold text-[#1A1A19]">&lt;/&gt; DSA</span>
              <div className="w-8 h-8 rounded-full border-[2.5px] border-[#F9BE08] bg-[#FFF8E6] flex items-center justify-center font-mono font-bold text-[12px] text-[#1A1A19]">
                92
              </div>
            </div>
          </div>

          {/* ── RIGHT MIDDLE: "More than a resume." annotation ── */}
          <div className="absolute right-2 top-[250px] z-30 pointer-events-none flex items-center gap-1.5">
            {/* Arrow curving up-left */}
            <svg width="30" height="26" viewBox="0 0 34 30" fill="none" className="-rotate-12">
              <path d="M28 26 C20 16, 12 10, 5 5" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M5 5 L13 7 M5 5 L7 14" stroke="rgba(26,26,25,0.65)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span
              className="text-[17px] font-semibold text-[#1A1A19]/85 whitespace-nowrap"
              style={{ fontFamily: "'Caveat', cursive", transform: 'rotate(-3deg)', display: 'inline-block' }}
            >
              More than<br />a resume.
            </span>
          </div>

          {/* ── RIGHT BOTTOM CARD: GITHUB ACTIVITY ── */}
          <div
            className="absolute right-3 top-[310px] z-15 w-[155px] rounded-xl bg-white border border-[#E5E3DA] p-3 shadow-[0_10px_24px_rgba(26,26,25,0.07)] hover:scale-105 transition-transform duration-300"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[12px] font-bold text-[#1A1A19]">GitHub Activity</span>
              <GitHubIcon className="w-4 h-4 text-[#1A1A19]" />
            </div>
            <div className="flex items-end gap-1 h-8">
              {[35, 60, 45, 80, 55, 100, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-[#1A1A19] rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="font-mono text-[10px] font-bold text-[#1A1A19] mt-1.5">
              312 <span className="font-normal text-[#6B6A63]">contributions</span>
            </p>
          </div>

          {/* ── BOTTOM RIGHT: Torn dark paper sticker ── */}
          <div
            className="absolute bottom-4 right-2 z-25 w-[150px] py-3.5 px-4 overflow-hidden"
            style={{
              background: '#1A1A19',
              borderRadius: '12px',
              transform: 'rotate(2deg)',
            }}
          >
            {/* Torn edge at top */}
            <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden pointer-events-none">
              <svg viewBox="0 0 200 14" preserveAspectRatio="none" className="w-full h-full" fill="#1A1A19">
                <path d="M0 14 Q15 2,30 8 Q45 13,60 4 Q75 0,90 9 Q105 14,120 3 Q135 0,150 8 Q165 13,180 4 Q195 0,200 8 L200 14 Z" />
              </svg>
            </div>
            <p className="font-semibold text-[#F9BE08] text-[16px] leading-tight text-center pt-1" style={{ fontFamily: "'Caveat', cursive" }}>
              Your work.<br />Your proof.<br />Real opportunities.
            </p>
          </div>

          {/* ── YELLOW STAR DOODLE ── */}
          <div className="absolute bottom-[90px] left-[220px] z-25 pointer-events-none">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 L14.5 9 L22 9.5 L16.5 14.5 L18.5 22 L12 17.5 L5.5 22 L7.5 14.5 L2 9.5 L9.5 9 Z"
                stroke="#F9BE08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* ── CURVED CONNECTING ARROW BOTTOM-LEFT ── */}
          <div className="absolute bottom-8 left-[158px] z-25 pointer-events-none">
            <svg width="44" height="38" viewBox="0 0 44 42" fill="none">
              <path d="M6 6 C12 18, 22 32, 36 36" stroke="rgba(26,26,25,0.55)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M36 36 L28 32 M36 36 L34 27" stroke="rgba(26,26,25,0.55)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
