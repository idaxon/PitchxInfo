import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SurveySubmissionData } from '../types';
import confetti from 'canvas-confetti';

interface ThankYouViewProps {
  submission: SurveySubmissionData;
  onHome: () => void;
  onOpenAdmin: () => void;
}

// Animated SVG check circle — strokes draw in on mount
function AnimatedCheck() {
  return (
    <div className="flex items-center justify-center">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Yellow circle that draws itself */}
        <circle
          cx="36"
          cy="36"
          r="30"
          stroke="#F9BE08"
          strokeWidth="3"
          strokeLinecap="round"
          className="draw-circle"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        {/* Check mark that draws itself after circle */}
        <polyline
          points="22,37 31,46 50,27"
          stroke="#1A1A19"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="draw-check"
        />
      </svg>
    </div>
  );
}

// Format date nicely
function formatDate(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

export default function ThankYouView({ submission, onHome }: ThankYouViewProps) {

  useEffect(() => {
    // Tasteful yellow-and-black confetti burst once
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.45 },
        colors: ['#F9BE08', '#1A1A19', '#fff'],
        gravity: 0.85,
        scalar: 0.9,
      });
    }, 350);
  }, []);

  const respondentLabel =
    submission.respondent_type === 'job_seeker' ? 'Job Seeker' : 'Recruiter';

  const fileNumber = submission.file_number || `PX-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const submittedDate = formatDate(submission.created_at);

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col items-center justify-center px-5 py-16 relative">

      {/* Subtle paper grain overlay */}
      <div className="paper-grain" aria-hidden="true" />

      {/* Top-left back link */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <button
          onClick={onHome}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#9E9D95] hover:text-foreground transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          PitchX
        </button>
      </div>

      {/* Centered single column, max 560px */}
      <div className="w-full max-w-[560px] flex flex-col items-center gap-8 animate-stamp">

        {/* Animated check circle */}
        <AnimatedCheck />

        {/* Headline */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-[2.75rem] sm:text-[3.5rem] leading-[1.06] tracking-tight text-foreground font-medium">
            Thank you for helping build{' '}
            <em className="italic font-normal not-italic" style={{ fontStyle: 'italic' }}>PitchX</em>.
          </h1>
          <p className="font-sans text-[16px] sm:text-[17px] text-[#6B6A63] leading-relaxed max-w-[38ch] mx-auto">
            Your feedback shapes what we build. We'll reach out before launch with early access.
          </p>
        </div>

        {/* Ticket card */}
        <div className="w-full rounded-2xl border border-[#E4E2DA] bg-white shadow-[0_8px_32px_rgba(26,26,25,0.06)] overflow-hidden">

          {/* Ticket top strip — yellow accent */}
          <div className="h-1.5 w-full bg-accent" />

          {/* Ticket body */}
          <div className="px-7 pt-7 pb-5 space-y-5">

            {/* Header row */}
            <div className="flex items-center justify-between">
              <img
                src="/text.png"
                alt="PitchX"
                className="h-6 w-auto object-contain opacity-80"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">
                Early Access · {submittedDate}
              </span>
            </div>

            {/* Divider with perforation dots */}
            <div className="relative h-[1px] my-1">
              <div className="absolute inset-x-0 top-0 h-px bg-[#E4E2DA]" />
              {/* Perforation circles */}
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#F8F7F3] border border-[#E4E2DA]" />
              <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#F8F7F3] border border-[#E4E2DA]" />
            </div>

            {/* Attendee details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#B4B2AB]">Name</span>
                <p className="font-sans text-[15px] font-semibold text-foreground truncate">{submission.full_name}</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#B4B2AB]">Type</span>
                <p className="font-sans text-[15px] font-semibold text-foreground">{respondentLabel}</p>
              </div>
              <div className="col-span-2 space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#B4B2AB]">Email</span>
                <p className="font-sans text-[14px] text-foreground truncate">{submission.email}</p>
              </div>
            </div>

            {/* Bottom ticket stub divider */}
            <div className="relative h-[1px]">
              <div className="absolute inset-x-0 top-0 h-px border-t border-dashed border-[#E4E2DA]" />
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#F8F7F3] border border-[#E4E2DA]" />
              <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#F8F7F3] border border-[#E4E2DA]" />
            </div>

            {/* Stub row */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">
                File No.
              </span>
              <span className="font-mono text-[13px] font-bold text-foreground tracking-wider">
                {fileNumber}
              </span>
              {/* Mini yellow seal badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/40">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-foreground font-bold">
                  Waitlisted
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Back to home link */}
        <button
          onClick={onHome}
          className="font-mono text-[11px] uppercase tracking-widest text-[#9E9D95] hover:text-foreground transition-colors mt-2"
        >
          ← Back to PitchX
        </button>

        {/* Fine-print disclaimer */}
        <p className="font-sans text-[11px] text-[#B4B2AB] text-center leading-relaxed max-w-[42ch]">
          PitchX is in product validation mode. Registration confirms your interest and early-access priority — not a job offer or guarantee.
        </p>

      </div>
    </div>
  );
}
