import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { RespondentType } from '../types';

interface FooterProps {
  onStartSurvey: (type: RespondentType) => void;
  onOpenWaitlist: () => void;
}

export default function Footer({ onStartSurvey, onOpenWaitlist }: FooterProps) {
  return (
    <footer className="relative bg-[#1A1A19] text-[#F8F7F3] pt-20 pb-0 overflow-hidden border-t border-[#333330] select-none">
      
      {/* Registration Marks in dark mode */}
      <div className="registration-mark top-6 left-6 opacity-30 [&::before]:bg-white [&::after]:bg-white" />
      <div className="registration-mark top-6 right-6 opacity-30 [&::before]:bg-white [&::after]:bg-white" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#333330]">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center">
              <img
                src="/px-logo.png"
                alt="PitchX"
                className="h-9 w-auto object-contain rounded-[4px] border border-white/10"
              />
            </div>

            <p className="font-sans text-sm text-[#9E9D95] max-w-md leading-relaxed">
              Replacing resume exaggerations with cryptographic proof of engineering work, audited code repositories, and objective benchmark scores.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#73726B]">
              <span>SERIES: 2026-ALPHA</span>
              <span>·</span>
              <span>CONFIDENTIAL PRE-LAUNCH</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs uppercase tracking-wider">
            <span className="text-[#9E9D95] block pb-1">Direct Paths</span>
            <ul className="space-y-2 text-[#C4C3BA]">
              <li>
                <button
                  onClick={() => onStartSurvey('job_seeker')}
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  Job Seeker Survey <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onStartSurvey('recruiter')}
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  Recruiter Survey <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWaitlist}
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  Join Waitlist <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Validation Scope Note */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[#9E9D95] uppercase tracking-wider block pb-1">Notice</span>
            <p className="text-[#8F8E86] leading-relaxed text-[11px] font-sans">
              PitchX is currently in product validation mode. No live hiring pipelines or job boards are in operation.
            </p>
            <div className="pt-2 text-[10px] text-[#73726B]">
              STRICT SCOPE COMPLIANCE ENFORCED
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#73726B]">
          <span>© 2026 PITCHX LABS. ALL RIGHTS RESERVED.</span>
          <span>DESIGN STUDIO EDITION // "THE EVIDENCE FILE"</span>
        </div>

      </div>

      {/* Massive Partially Cropped PitchX Wordmark */}
      <div className="w-full overflow-hidden flex justify-center pointer-events-none select-none opacity-[0.06] -mb-10 sm:-mb-16">
        <span className="font-display text-[20vw] font-bold tracking-tighter leading-none whitespace-nowrap text-white">
          PitchX
        </span>
      </div>

    </footer>
  );
}
