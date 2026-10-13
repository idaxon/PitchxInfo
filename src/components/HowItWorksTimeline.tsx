import React from 'react';
import { ArrowRight, Pin } from 'lucide-react';
import { RespondentType } from '../types';

interface HowItWorksProps {
  onSelectType: (type: RespondentType) => void;
}

export default function HowItWorksTimeline({ onSelectType }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="relative py-24 border-b border-border bg-[#F8F7F3] overflow-hidden">
      {/* Registration Marks */}
      <div className="registration-mark top-6 left-6" />
      <div className="registration-mark top-6 right-6" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase text-muted">
            <span>EXHIBIT 03</span>
            <span>//</span>
            <span>OPERATIONAL BLUEPRINT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
            Two parallel lanes. <span className="italic">One standard of proof.</span>
          </h2>
          <p className="font-sans text-muted text-base sm:text-lg">
            How PitchX bridges verified talent and hiring teams without resume middlemen.
          </p>
        </div>

        {/* Taped Paper Sticky Note for Pre-Launch Validation Notice */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          {/* Simulated masking tape on top of note */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E5DFC9]/80 border-t border-b border-[#D6CFA8] rotate-1 shadow-sm z-20 pointer-events-none" />
          
          <div className="bg-[#FFFEEB] border border-[#E8E2BF] p-6 rounded-sm shadow-md font-mono text-xs text-[#4A4736] relative rotate-[-0.5deg]">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#1A1A19] pb-2 border-b border-[#E8E2BF]">
              <Pin className="w-3.5 h-3.5 text-accent" />
              PRE-LAUNCH PROTOCOL NOTE [MANDATORY NOTICE]
            </div>
            <p className="pt-2 leading-relaxed font-sans text-xs sm:text-sm text-[#4A4736]">
              PitchX is currently in its <strong>validation phase</strong> to test willingness to pay, evaluate Proof Score interest, and collect early-access demand. This validation site does not offer live job applications, recruiter ATS, or candidate databases. Take the 2-minute survey below to help shape the platform.
            </p>
          </div>
        </div>

        {/* Two-Lane Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 relative">
          
          {/* Center Vertical Separator Line for Desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-border border-dashed" />

          {/* Lane 1: Job Seekers */}
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="font-mono text-xs uppercase text-accent font-bold tracking-widest block">
                  LANE 01
                </span>
                <h3 className="font-display text-2xl font-medium text-foreground">
                  For Job Seekers & Students
                </h3>
              </div>
              <button
                onClick={() => onSelectType('job_seeker')}
                className="font-mono text-xs uppercase px-3 py-1.5 rounded-full bg-foreground text-background font-semibold hover:bg-accent hover:text-foreground transition-colors"
              >
                Validate Lane →
              </button>
            </div>

            {/* Step 1 */}
            <div className="flex gap-4 items-start p-5 rounded-xl border border-border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-full bg-foreground text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0">
                01
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-medium text-foreground">
                  Connect Repositories & Real Code
                </h4>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                  Import your actual GitHub repos, commit trees, and live production deployments instead of typing keyword lists.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start p-5 rounded-xl border border-border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-full bg-foreground text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0">
                02
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-medium text-foreground">
                  Complete Domain Benchmarks
                </h4>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                  Solve realistic engineering challenges to generate an objective, proctored Proof Score (0-100) that companies respect.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start p-5 rounded-xl border border-border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-full bg-foreground text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0">
                03
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-medium text-foreground">
                  Get Discovered Directly
                </h4>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                  Top companies filter for verified scores and reach out to you directly, skipping endless first-round phone screens.
                </p>
              </div>
            </div>
          </div>

          {/* Lane 2: Recruiters & Hiring Managers */}
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="font-mono text-xs uppercase text-foreground font-bold tracking-widest block">
                  LANE 02
                </span>
                <h3 className="font-display text-2xl font-medium text-foreground">
                  For Recruiters & Founders
                </h3>
              </div>
              <button
                onClick={() => onSelectType('recruiter')}
                className="font-mono text-xs uppercase px-3 py-1.5 rounded-full border border-foreground font-semibold hover:bg-foreground hover:text-background transition-colors"
              >
                Validate Lane →
              </button>
            </div>

            {/* Step 1 */}
            <div className="flex gap-4 items-start p-5 rounded-xl border border-border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-full bg-accent text-foreground font-mono font-bold text-xs flex items-center justify-center shrink-0">
                01
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-medium text-foreground">
                  Define Proof Score Thresholds
                </h4>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                  Set target criteria like "Score &ge; 75/100 in Backend Systems" instead of manually filtering 500 inflated resumes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start p-5 rounded-xl border border-border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-full bg-accent text-foreground font-mono font-bold text-xs flex items-center justify-center shrink-0">
                02
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-medium text-foreground">
                  1-Click Evidence Audit
                </h4>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                  Inspect the candidate's actual commit quality, architecture decisions, and test suites in seconds before any interview.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start p-5 rounded-xl border border-border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-full bg-accent text-foreground font-mono font-bold text-xs flex items-center justify-center shrink-0">
                03
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg font-medium text-foreground">
                  Fast-Track to Final Offer
                </h4>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                  Eliminate 2-3 redundant screening rounds and hire confirmed engineering performers with confidence.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
