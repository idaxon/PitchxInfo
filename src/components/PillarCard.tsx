import React from 'react';
import { Code2, CheckCheck, Filter } from 'lucide-react';
import { motion, MotionValue } from 'framer-motion';

export type PillarId = 'proof-of-work' | 'verified-skills' | 'smarter-hiring';

interface PillarCardProps {
  id: PillarId;
  stepNumber: '01' | '02' | '03';
  isActive: boolean;
  isStackedBehind?: boolean;
  // Dynamic motion values for mini-UI animations when driven by scroll
  barProgress?: MotionValue<string> | string;
  bar1Progress?: MotionValue<string> | string;
  bar2Progress?: MotionValue<string> | string;
  bar3Progress?: MotionValue<string> | string;
  // Parallax offsets for inner UI
  innerParallax?: { x: number; y: number };
}

export default function PillarCard({
  id,
  stepNumber,
  isActive,
  isStackedBehind = false,
  barProgress = '98.4%',
  bar1Progress = '92%',
  bar2Progress = '88%',
  bar3Progress = '85%',
  innerParallax = { x: 0, y: 0 },
}: PillarCardProps) {
  return (
    <div
      className={`relative w-full max-w-[480px] rounded-2xl bg-white p-7 sm:p-8 flex flex-col justify-between transition-colors duration-300 ${
        isActive
          ? 'border border-[#F9BE08]/60 shadow-[0_24px_50px_rgba(26,26,25,0.12)]'
          : isStackedBehind
          ? 'border border-[#E4E2DA] shadow-[0_8px_24px_rgba(26,26,25,0.06)]'
          : 'border border-[#E4E2DA] shadow-[0_12px_32px_rgba(26,26,25,0.08)]'
      }`}
      style={{
        willChange: 'transform, opacity',
      }}
    >
      {/* Card Header: Plain serif numeral + PLANNED tag */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E2DA]">
          <span className="font-display text-base font-semibold text-foreground tracking-tight">
            {stepNumber}
          </span>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-accent/25 text-foreground font-bold tracking-wider">
            PLANNED
          </span>
        </div>

        {/* Card Copy */}
        {id === 'proof-of-work' && (
          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-[1.75rem] font-medium text-foreground tracking-tight">
              Proof of Work
            </h3>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Connect GitHub repositories, live deployments, and PR contributions. PitchX inspects real code structure, test coverage, and architecture.
            </p>
          </div>
        )}

        {id === 'verified-skills' && (
          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-[1.75rem] font-medium text-foreground tracking-tight">
              Verified Skills & Proof Score
            </h3>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Standardized domain evaluations generate an objective composite score (0-100) and domain breakdowns. No inflated keyword checklists.
            </p>
          </div>
        )}

        {id === 'smarter-hiring' && (
          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-[1.75rem] font-medium text-foreground tracking-tight">
              Smarter Recruiter Filtering
            </h3>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Filter talent by objective Proof Score thresholds (e.g. &ge; 70/100) and verified tech stacks instead of drowning in 500 keyword-stuffed resumes.
            </p>
          </div>
        )}
      </div>

      {/* Mini Illustrated UI Fragment (with inner parallax shift on active card) */}
      <div
        className="mt-7 transition-transform duration-200 ease-out"
        style={{
          transform: isActive
            ? `translate3d(${innerParallax.x}px, ${innerParallax.y}px, 0)`
            : 'none',
        }}
      >
        {/* CARD 1 MINI UI: Repo Audit Card */}
        {id === 'proof-of-work' && (
          <div className="rounded-xl border border-[#E4E2DA] bg-[#F8F7F3] p-4 sm:p-5 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-muted border-b border-[#E4E2DA]/80 pb-2">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Code2 className="w-3.5 h-3.5 text-accent" />
                k8s-operator-sync
              </span>
              <span className="text-[10px] text-muted-light font-sans italic">
                Sample data
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Unit & Integration Tests</span>
                <span className="text-foreground font-semibold">98.4% (Pass)</span>
              </div>
              <div className="w-full h-1.5 bg-[#E4E2DA] rounded-full overflow-hidden">
                {typeof barProgress === 'string' ? (
                  <div className="h-full bg-accent rounded-full" style={{ width: barProgress }} />
                ) : (
                  <motion.div className="h-full bg-accent rounded-full" style={{ width: barProgress }} />
                )}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-muted">
              <span>14 Merged Pull Requests</span>
              <span className="text-foreground font-medium flex items-center gap-1">
                <CheckCheck className="w-3 h-3 text-accent" /> Audited
              </span>
            </div>
          </div>
        )}

        {/* CARD 2 MINI UI: Domain Breakdown Bars */}
        {id === 'verified-skills' && (
          <div className="rounded-xl border border-foreground/15 bg-foreground text-background p-4 sm:p-5 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                DOMAIN BREAKDOWN
              </span>
              <span className="text-[10px] text-[#A3A299] font-sans italic">
                Sample data
              </span>
            </div>

            {/* Bar 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#C4C3BA]">Systems & Concurrency</span>
                <span className="text-accent font-bold">92 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                {typeof bar1Progress === 'string' ? (
                  <div className="h-full bg-accent" style={{ width: bar1Progress }} />
                ) : (
                  <motion.div className="h-full bg-accent" style={{ width: bar1Progress }} />
                )}
              </div>
            </div>

            {/* Bar 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#C4C3BA]">Database Internals & SQL</span>
                <span className="text-accent font-bold">88 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                {typeof bar2Progress === 'string' ? (
                  <div className="h-full bg-accent" style={{ width: bar2Progress }} />
                ) : (
                  <motion.div className="h-full bg-accent" style={{ width: bar2Progress }} />
                )}
              </div>
            </div>

            {/* Bar 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#C4C3BA]">API Design & Resiliency</span>
                <span className="text-accent font-bold">85 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                {typeof bar3Progress === 'string' ? (
                  <div className="h-full bg-accent" style={{ width: bar3Progress }} />
                ) : (
                  <motion.div className="h-full bg-accent" style={{ width: bar3Progress }} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* CARD 3 MINI UI: Candidate Shortlist Row */}
        {id === 'smarter-hiring' && (
          <div className="rounded-xl border border-[#E4E2DA] bg-[#F8F7F3] p-4 sm:p-5 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-muted border-b border-[#E4E2DA]/80 pb-2">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Filter className="w-3.5 h-3.5 text-accent" />
                FILTER: SCORE &ge; 75
              </span>
              <span className="text-[10px] text-muted-light font-sans italic">
                Sample data
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E4E2DA] flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block text-[11px]">R. Mukherjee</span>
                <span className="text-[10px] text-muted">Backend Engineer</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-foreground text-accent text-[10px] font-bold">
                  87 / 100
                </span>
                <span className="block text-[9px] text-muted-light mt-0.5">1-CLICK AUDIT</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-light pt-1">
              <span>Faster screening</span>
              <span className="text-foreground font-medium">Fewer irrelevant resumes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
