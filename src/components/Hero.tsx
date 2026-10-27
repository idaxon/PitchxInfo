import { useState, useRef } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { RespondentType } from '../types';
import HeroVisual from './HeroVisual';
import PreLaunchNote from './PreLaunchNote';
import PrototypeNote from './PrototypeNote';

interface HeroProps {
  onSelectType: (type: RespondentType) => void;
  onOpenWaitlist: () => void;
}

// Magnetic button component
function MagneticButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={className}
    >
      {children}
    </button>
  );
}

const COMPARISON_ROWS = [
  {
    traditional: '"I know Python." — Okay, prove it.',
    pitchx: 'Show your skills through assessments and projects.',
  },
  {
    traditional: 'Your best project gets 2 lines on page 2.',
    pitchx: 'Your projects get a place to shine.',
  },
  {
    traditional: 'Recruiters search through piles of resumes.',
    pitchx: 'Recruiters can filter candidates by Proof Score and domain-specific skills.',
  },
  {
    traditional: 'Certificates say you completed a course.',
    pitchx: 'Demonstrate what you can actually build.',
  },
  {
    traditional: 'Your resume stays the same until you update it.',
    pitchx: 'Your profile can grow with every new project and assessment.',
  },
  {
    traditional: 'You apply and wait. And wait. And wait.',
    pitchx: 'Get discovered by recruiters looking for your skills.',
  },
  {
    traditional: 'Everyone claims to be a problem solver.',
    pitchx: 'Give recruiters evidence of how you solve problems.',
  },
];

export default function Hero({ onSelectType }: HeroProps) {
  return (
    <section className="relative pt-[88px] sm:pt-20 lg:pt-24 pb-12 lg:pb-16 overflow-hidden border-b border-[#E4E2DA]">
      {/* Registration Marks at section corners only */}
      <div className="registration-mark top-4 left-4" />
      <div className="registration-mark top-4 right-4" />
      <div className="registration-mark bottom-4 left-4" />
      <div className="registration-mark bottom-4 right-4" />

      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-8">
        
        {/* 12-Column Hero Grid: Left 5 cols text, Right 7 cols visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5 lg:space-y-3.5">
            
            {/* Handwritten margin-note: "Same skills. Different way to get noticed." */}
            <div>
              <PreLaunchNote />
            </div>

            {/* Headline Card: "Build. Prove. Get Hired." with yellow highlighter and doodle rays */}
            <div className="relative inline-block w-full sm:w-auto">
              <div className="relative rounded-2xl bg-[#FFFDF8] border border-[#E4E2DA] p-4 sm:p-5 lg:p-5 shadow-[0_10px_28px_rgba(26,26,25,0.06)]">
                <h1 className="font-display text-[2.2rem] xs:text-[2.6rem] sm:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] font-bold leading-[1.04] sm:leading-[0.98] tracking-tight text-foreground">
                  Build.<br />
                  Prove.<br />
                  <span className="relative inline-block mt-0.5">
                    {/* Yellow highlighter brush stroke */}
                    <span
                      className="absolute inset-x-0 bottom-1 sm:bottom-1.5 h-6 sm:h-9 bg-[#F9BE08] rounded-xs -z-10 shadow-xs"
                      style={{
                        transform: 'rotate(-1.5deg) scaleX(1.04)',
                        clipPath: 'polygon(1% 4%, 99% 0%, 98% 96%, 0% 100%)',
                      }}
                    />
                    <span className="relative z-10 px-1 italic">
                      Get Hired.
                    </span>
                  </span>
                </h1>

                {/* Sunburst Doodle rays on right edge */}
                <div className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden xs:block sm:block">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16 L2 16" stroke="#F9BE08" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M10 8 L4 3" stroke="#F9BE08" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M16 8 L16 2" stroke="#1A1A19" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Subheadline */}
            <p className="font-sans text-[13.5px] sm:text-[15px] text-muted leading-relaxed max-w-[46ch] pt-0.5">
              PitchX validates candidate skills through proof of work, GitHub repositories, verified assessments, and an objective Proof Score.
            </p>

            {/* Buttons: "I'm a Job Seeker" & "I'm a Recruiter" with doodle dashes */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex items-center w-full sm:w-auto">
                {/* 3 radiating doodle marks on left */}
                <div className="hidden sm:block absolute -left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="18" height="20" viewBox="0 0 20 24" fill="none">
                    <path d="M14 6 L4 3" stroke="#1A1A19" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14 12 L2 12" stroke="#1A1A19" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14 18 L4 21" stroke="#1A1A19" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <MagneticButton
                  onClick={() => onSelectType('job_seeker')}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 sm:px-6 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm hover:bg-[#2C2C2A] transition-all shadow-sm active:scale-95"
                >
                  <span>I'm a Job Seeker</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>

              <MagneticButton
                onClick={() => onSelectType('recruiter')}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 sm:px-6 rounded-full border border-foreground bg-white text-foreground font-medium text-xs sm:text-sm hover:bg-accent hover:border-accent hover:text-foreground transition-all duration-200 active:scale-95 shadow-sm"
              >
                <span>I'm a Recruiter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </div>

            {/* Social Proof Row: 4 Avatars + Handwritten note */}
            <div className="pt-0.5 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Candidate"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Candidate"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Candidate"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Candidate"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <svg width="24" height="18" viewBox="0 0 28 22" fill="none" className="text-[#1A1A19]/70 shrink-0">
                  <path d="M4 14 C12 6, 20 8, 24 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M4 14 L8 8 M4 14 L10 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="font-hand text-[15.5px] font-semibold text-[#1A1A19]/80 leading-tight select-none">
                  Join early.<br />Be part of a fairer hiring future.
                </span>
              </div>
            </div>

            {/* Prototype paper-slip note: compact & styled */}
            <div className="pt-1">
              <PrototypeNote onFeedbackClick={() => onSelectType('job_seeker')} />
            </div>

          </div>

          {/* Right Column (7 cols): Layered visual composition */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <HeroVisual />
          </div>

        </div>

        {/* SECTION: YOUR RESUME TALKS. YOUR PROOF SHOWS. */}
        <div id="the-contrast" className="mt-28 pt-16 border-t border-[#E4E2DA] space-y-16">
          
          {/* Main Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4E2DA] font-mono text-xs uppercase tracking-wider text-muted">
              <span>EXHIBIT 01</span>
              <span>·</span>
              <span className="font-semibold text-foreground">THE PROOF GAP</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
              Your Resume Talks. <span className="italic">Your Proof Shows.</span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-muted font-medium">
              The old way of hiring vs. The PitchX way.
            </p>
          </div>

          {/* Side-by-Side Comparison Dossier Ledger */}
          <div className="max-w-5xl mx-auto rounded-2xl border border-[#E4E2DA] bg-white shadow-[0_8px_30px_rgba(26,26,25,0.05)] overflow-hidden">
            
            {/* Table Column Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#E4E2DA] bg-[#F8F7F3]">
              
              {/* Left Column Header: Traditional */}
              <div className="p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#E4E2DA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-muted">
                    Traditional Hiring Platforms
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-light uppercase">Old standard</span>
              </div>

              {/* Right Column Header: PitchX */}
              <div className="p-4 sm:p-5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-foreground font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                    PitchX
                  </span>
                </div>
                <span className="stamp-badge text-[10px] py-0.5 px-2">Verified Proof</span>
              </div>

            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-[#E4E2DA]">
              {COMPARISON_ROWS.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 hover:bg-[#FAF9F5] transition-colors group"
                >
                  {/* Traditional Side */}
                  <div className="p-4 sm:p-5 md:border-r border-[#E4E2DA] flex items-start gap-3 bg-[#FDFCFB] group-hover:bg-[#FAF9F5]">
                    <span className="font-mono text-[11px] text-muted-light font-medium pt-0.5 shrink-0">
                      0{index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="md:hidden inline-flex items-center gap-1 text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-100/80 text-red-800 font-bold mb-1.5">
                        <X className="w-2.5 h-2.5" /> Traditional Resume
                      </span>
                      <p className="font-sans text-sm sm:text-[15px] text-muted leading-relaxed">
                        {row.traditional}
                      </p>
                    </div>
                  </div>

                  {/* PitchX Side */}
                  <div className="p-4 sm:p-5 flex items-start gap-3 bg-white group-hover:bg-[#FAF9F5]">
                    <div className="w-4 h-4 rounded-full bg-accent/25 flex items-center justify-center text-foreground shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 font-bold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="md:hidden inline-flex items-center gap-1 text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/30 text-foreground font-bold mb-1.5">
                        <Check className="w-2.5 h-2.5" /> PitchX Verified Proof
                      </span>
                      <p className="font-sans text-sm sm:text-[15px] text-foreground font-semibold leading-relaxed">
                        {row.pitchx}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* SUB-SECTION: "The Internet Has Enough Resumes. It Needs More Proof." */}
          <div className="max-w-5xl mx-auto pt-6 space-y-8">
            
            <div className="text-center space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                The Internet Has Enough Resumes. <span className="italic">It Needs More Proof.</span>
              </h3>
              <p className="font-sans text-sm text-muted">
                The reality of modern job-hunting platforms vs. verified engineering reality.
              </p>
            </div>

            {/* 3 Critique Dossier Cards + 1 PitchX Punchline Hero Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: LinkedIn */}
              <div className="p-6 rounded-2xl border border-[#E4E2DA] bg-white shadow-sm space-y-3 relative hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E2DA]">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                    LinkedIn
                  </span>
                  <span className="font-mono text-[10px] text-muted">Platform 01</span>
                </div>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  Endorsed by 47 people. Still waiting for someone to endorse your job application.
                </p>
              </div>

              {/* Card 2: Job Portals */}
              <div className="p-6 rounded-2xl border border-[#E4E2DA] bg-white shadow-sm space-y-3 relative hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E2DA]">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                    Job Portals
                  </span>
                  <span className="font-mono text-[10px] text-muted">Platform 02</span>
                </div>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  "Your profile matches this role!" The role: 5 years of experience. You: 6 months into college.
                </p>
              </div>

              {/* Card 3: The Traditional PDF Resume */}
              <div className="p-6 rounded-2xl border border-[#E4E2DA] bg-white shadow-sm space-y-3 relative hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E2DA]">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                    Traditional PDF
                  </span>
                  <span className="font-mono text-[10px] text-muted">Artifact 03</span>
                </div>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  One page of achievements, two pages of skills, zero space to demonstrate whether you can actually build anything.
                </p>
              </div>

            </div>


          </div>

        </div>

      </div>
    </section>
  );
}
