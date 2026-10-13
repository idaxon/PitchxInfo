import React from 'react';

export default function ProofSeal2D({ score = 87, size = 'default' }: { score?: number; size?: 'default' | 'small' | 'large' }) {
  const dimensionClass = {
    small: 'w-24 h-24',
    default: 'w-48 h-48 md:w-56 md:h-56',
    large: 'w-64 h-64 md:w-72 md:h-72',
  }[size];

  return (
    <div className={`relative ${dimensionClass} rounded-full flex items-center justify-center select-none shadow-seal bg-foreground transition-transform hover:scale-105 duration-500`}>
      {/* Outer yellow border */}
      <div className="absolute inset-2 rounded-full border border-accent/40 border-dashed animate-[spin_40s_linear_infinite]" />
      
      {/* Precision yellow ring */}
      <div className="absolute inset-4 rounded-full border-2 border-accent" />

      {/* Internal concentric circle */}
      <div className="absolute inset-6 rounded-full border border-white/10" />

      {/* Central content */}
      <div className="relative text-center flex flex-col items-center justify-center">
        <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-accent font-semibold mb-0.5">
          EXHIBIT 01
        </span>
        <div className="font-mono text-3xl md:text-5xl font-bold text-background tracking-tighter leading-none">
          {score}
        </div>
        <span className="font-mono text-xs md:text-sm text-accent font-medium tracking-wider">
          / 100
        </span>
        <span className="font-mono text-[8px] md:text-[9px] tracking-widest text-[#9E9D95] uppercase mt-1">
          PX · VERIFIED
        </span>
      </div>
    </div>
  );
}
