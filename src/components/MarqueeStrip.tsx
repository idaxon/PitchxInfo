import React from 'react';

export default function MarqueeStrip() {
  const content = "PROJECTS · ASSESSMENTS · PROOF SCORE · REAL WORK · REPOSITORIES AUDITED · OBJECTIVE EVIDENCE · ZERO RESUME SPAM · ";

  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-[#F3F1EA] py-3 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-muted font-medium inline-block pr-8">
          {content} {content}
        </span>
        <span className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-muted font-medium inline-block pr-8" aria-hidden="true">
          {content} {content}
        </span>
      </div>
    </div>
  );
}
