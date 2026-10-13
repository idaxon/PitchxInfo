import React, { useState, useEffect } from 'react';
import { 
  FileQuestion, 
  Home, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from 'lucide-react';

interface NotFoundProps {
  onBack: () => void;
  onStartSurvey?: () => void;
}

const ATS_EXCUSES = [
  "After careful automated consideration of 0.4 seconds, our ATS determined this route does not possess 12+ years of production experience in React 19.",
  "The hiring manager was super enthusiastic about this URL, but went on a 3-week silent retreat to Bali right before approving the routing table.",
  "We received over 14,200 applications for this route. We have chosen to move forward with a candidate URL whose query parameters align more closely.",
  "Status: GHOSTED. Last seen online 24 days ago promising: 'Our recruiting coordinator will be in touch by end of day Friday!'",
  "Our AI resume parser could not detect 'Proficient in Microsoft Excel' in this URL's HTTP headers, causing immediate disqualification.",
  "This route cleared 5 rounds of technical interviews, a take-home architecture test, and a culture chat, only to be closed due to an internal hiring freeze.",
  "The recruiter opened this link, immediately got distracted by a LinkedIn thought leader post about waking up at 4:30 AM, and closed the browser tab.",
];

export default function NotFound({ onBack, onStartSurvey }: NotFoundProps) {
  const [excuseIndex, setExcuseIndex] = useState(0);
  const [incidentId, setIncidentId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    // Generate deterministic yet unique-looking incident ID
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    setIncidentId(`PX-404-GHOST-${randomHex}`);
  }, []);

  const handleNextExcuse = () => {
    setIsRotating(true);
    setTimeout(() => {
      setExcuseIndex((prev) => (prev + 1) % ATS_EXCUSES.length);
      setIsRotating(false);
    }, 150);
  };

  const handleCopyId = () => {
    if (incidentId) {
      navigator.clipboard.writeText(incidentId).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A1A19] flex flex-col font-sans selection:bg-[#F9BE08] selection:text-[#1A1A19]">
      
      {/* Top Dossier Header Strip */}
      <header className="border-b border-[#E4E2DA] bg-[#1A1A19] text-[#F8F7F3] px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-wider text-[#F9BE08]">PITCHX EVIDENCE FILE</span>
          <span className="text-[#8C8B85] hidden sm:inline">|</span>
          <span className="text-[#8C8B85] hidden sm:inline">CASE FILE #404: ROUTE_UNRESOLVED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            STATUS: GHOSTED
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col justify-center">
        
        {/* The Case Folder Sheet */}
        <div className="bg-[#FAF9F5] border border-[#E4E2DA] rounded-xl shadow-lg relative overflow-hidden p-6 sm:p-10">
          
          {/* Manila folder tab notch visual */}
          <div className="absolute top-0 right-0 w-36 h-8 bg-[#EFECE6] border-b border-l border-[#E4E2DA] rounded-bl-lg flex items-center justify-center">
            <span className="font-mono text-[11px] text-[#8C8B85] tracking-widest font-bold">
              FILE CLASSIFIED
            </span>
          </div>

          {/* Dossier Meta Topline */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E4E2DA] text-xs font-mono text-[#8C8B85]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>INCIDENT LOG:</span>
              <button 
                onClick={handleCopyId}
                className="font-bold text-[#1A1A19] hover:text-amber-700 underline decoration-dotted flex items-center gap-1.5 cursor-pointer"
                title="Click to copy Incident ID"
              >
                <span>{incidentId || 'PX-404-GHOST-XXXXXX'}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#8C8B85]" />}
              </button>
            </div>
            <div>
              <span>PROOF SCORE: </span>
              <span className="font-bold text-red-600 font-mono">0 / 100 (DISQUALIFIED)</span>
            </div>
          </div>

          {/* Glitched 404 Hero & Stamp */}
          <div className="py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-7xl sm:text-8xl font-black font-serif tracking-tighter text-[#1A1A19] leading-none select-none">
                  404
                </span>
                <span className="text-sm font-mono uppercase tracking-widest text-red-600 font-bold bg-red-100/70 border border-red-200 px-2.5 py-1 rounded">
                  MISSING_IN_ACTION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A19] tracking-tight">
                This page got screened out by the ATS.
              </h1>
              <p className="text-sm sm:text-base text-[#61605B] max-w-xl leading-relaxed">
                You were searching for something real, but somewhere between the applicant tracking system and the void, this route ceased to exist.
              </p>
            </div>

            {/* Funny Angled Rubber Stamp */}
            <div className="self-center sm:self-auto shrink-0 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="border-4 border-red-600/90 text-red-600 px-4 py-2 rounded-md font-mono font-black text-center tracking-widest uppercase shadow-sm select-none bg-red-50/50">
                <div className="text-[10px] tracking-[0.25em] text-red-500 font-bold">SYSTEM VERDICT</div>
                <div className="text-xl sm:text-2xl font-black">REJECTED</div>
                <div className="text-[9px] text-red-500">NO FEEDBACK PROVIDED</div>
              </div>
            </div>
          </div>

          {/* Humorous Recruiter / ATS Excuse Card */}
          <div className="my-6 p-5 sm:p-6 bg-[#F3F1EB] border border-[#E4E2DA] rounded-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A19] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Automated Rejection Reason #{excuseIndex + 1}:</span>
              </div>
              <button
                onClick={handleNextExcuse}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-white hover:bg-[#FAF9F5] border border-[#D5D3CA] text-[#1A1A19] rounded shadow-2xs hover:shadow-sm transition-all cursor-pointer font-medium"
              >
                <RotateCcw className={`w-3 h-3 text-amber-600 ${isRotating ? 'animate-spin' : ''}`} />
                <span>Reroll Excuse</span>
              </button>
            </div>
            
            <p className="text-sm sm:text-base text-[#2E2D29] italic font-serif leading-relaxed pl-3 border-l-2 border-[#F9BE08]">
              "{ATS_EXCUSES[excuseIndex]}"
            </p>
          </div>

          {/* Dossier Audit Checklist */}
          <div className="my-6 space-y-2">
            <div className="text-xs font-mono font-bold text-[#8C8B85] uppercase tracking-wider mb-2">
              Forensic Audit Checklist:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 p-2 bg-white/60 border border-[#E4E2DA] rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[#61605B]">You entered a URL with hope</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/60 border border-[#E4E2DA] rounded">
                <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-[#61605B]">Human HR manager actually opened it</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/60 border border-[#E4E2DA] rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[#61605B]">Automated confirmation email received</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/60 border border-[#E4E2DA] rounded">
                <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-[#61605B]">Constructive, personalized feedback</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#E4E2DA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1A1A19] hover:bg-[#2A2A28] text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              <Home className="w-4 h-4 text-[#F9BE08]" />
              <span>Return to Safe Ground (Home)</span>
            </button>

            {onStartSurvey ? (
              <button
                onClick={onStartSurvey}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#F9BE08] hover:bg-[#e6ad04] text-[#1A1A19] font-bold text-sm transition-colors cursor-pointer shadow-sm"
              >
                <span>Help Fix Hiring with PitchX</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-[#F3F1EB] border border-[#D5D3CA] text-[#1A1A19] font-medium text-sm transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#8C8B85]" />
                <span>Search Available Routes</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer Dossier Footnote */}
        <div className="text-center mt-6 text-xs font-mono text-[#8C8B85] space-y-1">
          <p>CONFIDENTIAL INVESTIGATION · PITCHX PROOF-OF-WORK VERIFICATION NETWORK</p>
          <p className="text-[11px] text-[#A8A7A0]">
            Disclaimer: No actual Applicant Tracking Systems were harmed in the making of this 404 page.
          </p>
        </div>

      </main>

    </div>
  );
}
