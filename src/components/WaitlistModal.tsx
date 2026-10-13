import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { submitWaitlistSignup } from '../lib/supabase';
import { analytics } from '../lib/analytics';
import confetti from 'canvas-confetti';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'job_seeker' | 'recruiter' | 'general'>('job_seeker');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await submitWaitlistSignup(email, role, consent);
      analytics.joinWaitlist(email, role);
      setSubmitted(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F9BE08', '#1A1A19', '#E4E2DA']
      });
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#F8F7F3] border-2 border-foreground p-7 sm:p-9 shadow-evidence-lift text-foreground"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-modal-title"
      >
        {/* Registration marks */}
        <div className="registration-mark top-3 left-3" />
        <div className="registration-mark top-3 right-3" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-muted hover:text-foreground transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="stamp-badge">
                EARLY ADMISSION // DOSSIER FILE
              </div>
              <h3 id="waitlist-modal-title" className="font-display text-3xl font-medium tracking-tight">
                Join the <span className="italic">PitchX Waitlist</span>.
              </h3>
              <p className="font-sans text-sm text-muted">
                Receive priority access when our verification engine opens for beta testing. No marketing spam.
              </p>
            </div>

            {/* Role picker */}
            <div className="space-y-2">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
                I identify primarily as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['job_seeker', 'recruiter', 'general'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2.5 px-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition-all ${
                      role === r
                        ? 'bg-foreground text-background border-foreground font-bold shadow-sm'
                        : 'bg-white text-muted border-border hover:border-foreground/40'
                    }`}
                  >
                    {r === 'job_seeker' ? 'Job Seeker' : r === 'recruiter' ? 'Recruiter' : 'Observer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="waitlist-email" className="block font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
                Work or Personal Email *
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
              {error && (
                <p className="font-mono text-xs text-red-600 tracking-wide" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer text-xs text-muted font-sans select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-foreground accent-foreground"
              />
              <span>
                I agree to receive validation survey updates and early cohort invitations from PitchX.
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-widest font-semibold hover:bg-accent hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Claim Early Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Stamped confirmation receipt */
          <div className="text-center py-6 space-y-5 animate-stamp">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent mx-auto flex items-center justify-center text-foreground">
              <CheckCircle2 className="w-8 h-8 text-foreground" />
            </div>

            <div className="space-y-2">
              <span className="stamp-badge">
                STAMP CONFIRMED // STATUS: LOGGED
              </span>
              <h3 className="font-display text-2xl font-medium">
                You're on the early list.
              </h3>
              <p className="font-sans text-sm text-muted max-w-sm mx-auto">
                Your entry has been registered in the pre-launch dossier. We will reach out when Alpha cohort onboarding begins.
              </p>
            </div>

            <div className="p-3 bg-white rounded border border-border font-mono text-xs text-muted">
              Registered ID: <span className="font-bold text-foreground">{email}</span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent hover:text-foreground transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
