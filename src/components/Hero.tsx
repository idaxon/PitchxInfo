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
    <section className="relative pt-[72px] lg:pt-[120px] pb-16 lg:pb-24 overflow-hidden border-b border-[#E4E2DA]">
      {/* Registration Marks at section corners only */}
      <div className="registration-mark top-6 left-6" />
      <div className="registration-mark top-6 right-6" />
      <div className="registration-mark bottom-6 left-6" />
      <div className="registration-mark bottom-6 right-6" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* 12-Column Hero Grid: Left 5 cols text, Right 7 cols visual bleeding off right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Handwritten margin-note: "Pre-launch. We're listening." */}
            <div className="mb-4">
              <PreLaunchNote />
            </div>

            {/* Headline: "Build. Prove. Get Hired." Serif display, 88-104px desktop, tight leading */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.25rem] font-medium leading-[0.98] tracking-tight text-foreground">
              Build. Prove. <br />
              <span className="relative inline-block italic font-normal text-foreground">
                Get Hired.
                {/* Hand-drawn yellow underline stroke that draws in on load */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 overflow-visible pointer-events-none"
                  viewBox="0 0 240 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C65 3.5 175 2.5 237 8"
                    stroke="#F9BE08"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="draw-underline-path"
                  />
                </svg>
              </span>
            </h1>

            {/* Subheadline: Exact spec copy, 18px, max 52ch */}
            <p className="font-sans text-[18px] text-muted leading-relaxed max-w-[52ch] pt-1">
              PitchX validates candidate skills through proof of work, GitHub repositories, verified assessments, and an objective Proof Score.
            </p>

            {/* Buttons: "I'm a Job Seeker" (black, arrow) & "I'm a Recruiter" (outline -> yellow fill on hover) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MagneticButton
                onClick={() => onSelectType('job_seeker')}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-foreground text-background font-medium text-sm hover:bg-[#2C2C2A] transition-all shadow-sm active:scale-95"
              >
                <span>I'm a Job Seeker</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <MagneticButton
                onClick={() => onSelectType('recruiter')}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full border border-foreground bg-transparent text-foreground font-medium text-sm hover:bg-accent hover:border-accent hover:text-foreground transition-all duration-200 active:scale-95"
              >
                <span>I'm a Recruiter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </div>

            {/* Prototype paper-slip note */}
            <PrototypeNote onFeedbackClick={() => onSelectType('job_seeker')} />

          </div>

          {/* Right Column (7 cols): Layered CSS 3D composition bleeding off right */}
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
                    <span className="font-sans text-sm sm:text-[15px] text-muted leading-relaxed">
                      {row.traditional}
                    </span>
                  </div>

                  {/* PitchX Side */}
                  <div className="p-4 sm:p-5 flex items-start gap-3 bg-white group-hover:bg-[#FAF9F5]">
                    <div className="w-4 h-4 rounded-full bg-accent/25 flex items-center justify-center text-foreground shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 font-bold" />
                    </div>
                    <span className="font-sans text-sm sm:text-[15px] text-foreground font-semibold leading-relaxed">
                      {row.pitchx}
                    </span>
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
