import React from 'react';
import { GitBranch, CheckCheck, Filter, Shield, Code2, Layers } from 'lucide-react';

export default function AboutDossier() {
  return (
    <section id="about-dossier" className="relative py-24 border-b border-border bg-[#F8F7F3]">
      {/* Corner registration crosshairs */}
      <div className="registration-mark top-6 left-6" />
      <div className="registration-mark top-6 right-6" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-muted">
              <span>EXHIBIT 02</span>
              <span>//</span>
              <span>PROOF ARCHITECTURE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
              Three pillars of <span className="italic">tangible evidence</span>.
            </h2>
            <p className="font-sans text-muted text-base sm:text-lg">
              Engineered to replace subjective claims with verifiable artifacts and domain-specific benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-light uppercase tracking-wider">
              ROADMAP TRANSPARENCY:
            </span>
            <span className="px-2.5 py-1 rounded bg-[#E4E2DA] text-foreground font-mono text-[11px] font-semibold tracking-wider">
              ALL FEATURES PLANNED FOR ALPHA
            </span>
          </div>
        </div>

        {/* 3 Overlapping Dossier Tabs / Folded Paper Cards of Different Heights */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">

          {/* Dossier Card 01: Proof of Work (Height 1) */}
          <div className="evidence-card relative rounded-xl border border-border bg-white p-7 shadow-evidence flex flex-col justify-between min-h-[440px]">
            {/* Dossier Tab header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-muted">
                  TAB 01 // ARTIFACTS
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-accent/25 text-foreground font-bold tracking-wider">
                  PLANNED
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-medium text-foreground">
                  Proof of Work
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  Connect GitHub repositories, live deployments, and PR contributions. PitchX inspects real code structure, test coverage, and architecture.
                </p>
              </div>
            </div>

            {/* Mini Illustrated UI Fragment: Repo Audit Card */}
            <div className="mt-6 rounded-lg border border-border bg-[#F8F7F3] p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-muted border-b border-border/60 pb-2">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Code2 className="w-3.5 h-3.5 text-accent" />
                  k8s-operator-sync
                </span>
                <span className="text-[10px] text-accent-hover font-bold">SHA: e3b0c44</span>
              </div>

              {/* Commit and Coverage metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted">Unit & Integration Tests</span>
                  <span className="text-foreground font-semibold">98.4% (Pass)</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '98.4%' }} />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-muted-light">
                <span>14 Merged Pull Requests</span>
                <span className="text-foreground font-medium flex items-center gap-1">
                  <CheckCheck className="w-3 h-3 text-accent" /> Audited
                </span>
              </div>
            </div>
          </div>

          {/* Dossier Card 02: Verified Skills & Proof Score (Taller Height) */}
          <div className="evidence-card relative rounded-xl border-2 border-foreground bg-white p-7 shadow-evidence-lift flex flex-col justify-between min-h-[490px]">
            {/* Dossier Tab header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-foreground">
                  TAB 02 // BENCHMARKS [CORE]
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-accent text-foreground font-bold tracking-wider">
                  PLANNED
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-medium text-foreground">
                  Verified Skills & Proof Score
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  Proctored domain evaluations generate an immutable composite score (0-100) and domain breakdowns. No inflated keyword checklists.
                </p>
              </div>
            </div>

            {/* Mini Illustrated UI Fragment: Domain Score Breakdown Bars */}
            <div className="mt-6 rounded-lg border border-foreground/15 bg-foreground text-background p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  DOMAIN BREAKDOWN
                </span>
                <span className="text-[10px] text-[#A3A299]">PITCHX ENGINE</span>
              </div>

              {/* Score bar 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Systems & Concurrency</span>
                  <span className="text-accent font-bold">92 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '92%' }} />
                </div>
              </div>

              {/* Score bar 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Database Internals & SQL</span>
                  <span className="text-accent font-bold">88 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '88%' }} />
                </div>
              </div>

              {/* Score bar 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>API Design & Resiliency</span>
                  <span className="text-accent font-bold">85 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Card 03: Smarter Hiring (Height 2) */}
          <div className="evidence-card relative rounded-xl border border-border bg-white p-7 shadow-evidence flex flex-col justify-between min-h-[440px]">
            {/* Dossier Tab header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-muted">
                  TAB 03 // RECRUITER SUITE
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-accent/25 text-foreground font-bold tracking-wider">
                  PLANNED
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-medium text-foreground">
                  Smarter Recruiter Filtering
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  Filter talent by objective Proof Score thresholds (e.g. &ge; 70/100) and verified tech stacks instead of drowning in 500 keyword-stuffed resumes.
                </p>
              </div>
            </div>

            {/* Mini Illustrated UI Fragment: Candidate Shortlist Row */}
            <div className="mt-6 rounded-lg border border-border bg-[#F8F7F3] p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-muted border-b border-border/60 pb-2">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Filter className="w-3.5 h-3.5 text-accent" />
                  FILTER: SCORE &ge; 75
                </span>
                <span className="text-[10px] text-foreground font-semibold">14 MATCHES</span>
              </div>

              {/* Candidate candidate row */}
              <div className="p-2.5 rounded bg-white border border-border flex items-center justify-between">
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
                <span>90% Faster Screen Time</span>
                <span className="text-foreground font-medium">ZERO Spam CVs</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
