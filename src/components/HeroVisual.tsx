import { useState, useRef, useEffect } from 'react';
import { GitBranch, Star, ExternalLink, Shield } from 'lucide-react';

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Parallax shifts for the 3 depths
  const backShiftX = mouseOffset.x * 6;
  const backShiftY = mouseOffset.y * 5;
  const midShiftX = mouseOffset.x * 11;
  const midShiftY = mouseOffset.y * 9;
  const frontShiftX = mouseOffset.x * 16;
  const frontShiftY = mouseOffset.y * 14;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] lg:max-w-[620px] h-[480px] sm:h-[540px] flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
      aria-label="Interactive layered PitchX proof profile composition"
    >
      {/* 3D Perspective Scene */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >

        {/* 1. BACK CARD: Candidate Profile Card */}
        <div
          className="hidden sm:block absolute w-[330px] rounded-2xl bg-white border border-[#E4E2DA] p-5 shadow-[0_12px_32px_rgba(26,26,25,0.06)] transition-all duration-300 ease-out"
          style={{
            transform: `translate3d(${-75 + backShiftX}px, ${-90 + backShiftY}px, -60px) rotateY(-12deg) rotateX(6deg)`,
          }}
        >
          {/* Top Row: Sample profile indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E2DA]">
            <span className="font-mono text-[10px] uppercase text-muted tracking-widest font-medium">
              Sample profile
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-foreground font-mono text-[11px] font-bold">
              Proof Score 87
            </span>
          </div>

          {/* Candidate Info */}
          <div className="pt-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center font-display font-semibold text-accent text-base">
              AR
            </div>
            <div>
              <div className="font-display text-base font-semibold text-foreground leading-tight">
                Alex Rivera
              </div>
              <div className="text-xs text-muted">
                Systems & Backend Engineer
              </div>
            </div>
          </div>

          {/* Skill Tags */}
          <div className="pt-4 flex flex-wrap gap-1.5">
            {['Distributed Systems', 'Go', 'Kafka', 'PostgreSQL'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#F8F7F3] border border-[#E4E2DA] font-mono text-[10px] text-foreground font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 2. MIDDLE CARD: GitHub Repo Card */}
        <div
          className="hidden sm:block absolute w-[350px] rounded-2xl bg-white border border-[#E4E2DA] p-5 shadow-[0_16px_36px_rgba(26,26,25,0.08)] transition-all duration-300 ease-out"
          style={{
            transform: `translate3d(${50 + midShiftX}px, ${-30 + midShiftY}px, 0px) rotateY(-12deg) rotateX(6deg)`,
          }}
        >
          <div className="flex items-center justify-between pb-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
              <GitBranch className="w-3.5 h-3.5 text-accent" />
              <span>raft-kv-engine</span>
            </div>
            <span className="font-mono text-[10px] text-muted">public</span>
          </div>

          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            High-throughput distributed consensus engine with raft leader election & WAL persistence.
          </p>

          {/* Sparkline & Stats */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00ADD8]" /> Go
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#1A1A19]" /> 428
              </span>
            </div>

            {/* Commit activity sparkline */}
            <div className="flex items-end gap-1 h-5">
              {[40, 65, 50, 85, 70, 95, 80].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#1A1A19] rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Live Demo chip */}
          <div className="mt-3 pt-2.5 border-t border-[#E4E2DA] flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-foreground font-medium">
              <ExternalLink className="w-3 h-3 text-accent" /> Live benchmark demo
            </span>
            <span className="text-[10px] font-mono text-muted uppercase">98.2% test cov</span>
          </div>
        </div>

        {/* 3. FRONT CARD: Score Breakdown Card (Main focus, mobile and desktop) */}
        <div
          className="relative sm:absolute w-full sm:w-[370px] rounded-2xl bg-white border border-[#E4E2DA] p-6 shadow-[0_20px_44px_rgba(26,26,25,0.11)] transition-all duration-300 ease-out hover:shadow-[0_28px_56px_rgba(26,26,25,0.14)] group"
          style={{
            transform: `translate3d(${frontShiftX * 0.4}px, ${30 + frontShiftY * 0.4}px, 60px) rotateY(-12deg) rotateX(6deg)`,
          }}
        >
          {/* Header & Big Score */}
          <div className="flex items-start justify-between pb-4 border-b border-[#E4E2DA]">
            <div>
              <span className="font-mono text-[10px] uppercase text-muted tracking-widest font-semibold block">
                Proof Score Breakdown
              </span>
              <span className="text-xs text-muted font-sans">
                Objective domain evaluations
              </span>
            </div>

            <div className="text-right">
              <div className="font-mono text-3xl sm:text-4xl font-bold text-foreground leading-none">
                87<span className="text-base sm:text-lg font-normal text-muted">/100</span>
              </div>
            </div>
          </div>

          {/* 4 Thin Horizontal Bars that fill on load */}
          <div className="pt-4 space-y-3 font-mono text-xs">
            {/* Frontend */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Frontend Architecture</span>
                <span className="font-semibold text-foreground">92 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                  style={{ width: mounted ? '92%' : '0%' }}
                />
              </div>
            </div>

            {/* Backend */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Distributed Systems</span>
                <span className="font-semibold text-foreground">84 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000 ease-out delay-100"
                  style={{ width: mounted ? '84%' : '0%' }}
                />
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Projects</span>
                <span className="font-semibold text-foreground">88 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000 ease-out delay-200"
                  style={{ width: mounted ? '88%' : '0%' }}
                />
              </div>
            </div>

            {/* Assessments */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Assessments</span>
                <span className="font-semibold text-foreground">79 / 100</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000 ease-out delay-300"
                  style={{ width: mounted ? '79%' : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Stamp Badge */}
          <div className="mt-4 pt-3 border-t border-[#E4E2DA] flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Shield className="w-3.5 h-3.5 text-accent" />
              Verified Evidence
            </span>
            <span className="text-muted text-[10px]">PX-AUDIT #842</span>
          </div>
        </div>





      </div>
    </div>
  );
}
