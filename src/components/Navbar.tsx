import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { RespondentType } from '../types';

interface NavbarProps {
  onStartSurvey: (type: RespondentType) => void;
  onOpenWaitlist: () => void;
}

export default function Navbar({ onStartSurvey, onOpenWaitlist }: NavbarProps) {
  const [activeItem, setActiveItem] = useState<'about' | 'seekers' | 'recruiters'>('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'about', label: 'About PitchX', href: '#about-dossier' },
    { id: 'seekers', label: 'For Job Seekers', href: '#how-it-works', type: 'job_seeker' as RespondentType },
    { id: 'recruiters', label: 'For Recruiters', href: '#how-it-works', type: 'recruiter' as RespondentType },
  ] as const;

  useEffect(() => {
    const handleScroll = () => {
      const aboutEl = document.getElementById('about-dossier');
      const howEl = document.getElementById('how-it-works');
      const scrollPos = window.scrollY + 200;

      if (howEl && scrollPos >= howEl.offsetTop) {
        // Leave seekers/recruiters active based on context
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveItem('about');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1060px] h-[52px] rounded-full px-5 sm:px-6 flex items-center justify-between border border-[#E4E2DA] bg-white/90 backdrop-blur-md shadow-[0_4px_16px_rgba(26,26,25,0.04)]"
          aria-label="Main Navigation"
        >
          {/* Left: PitchX Wordmark Logo */}
          <a
            href="#"
            className="flex items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            aria-label="PitchX Home"
          >
            <img
              src="/text.png"
              alt="PitchX"
              className="h-7 sm:h-8 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </a>

          {/* Center: About PitchX, For Job Seekers, For Recruiters, Take Survey */}
          <div className="hidden md:flex items-center gap-7 text-[15px] font-medium text-muted relative">
            {navLinks.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`relative py-1.5 transition-colors duration-200 hover:text-foreground ${
                    isActive ? 'text-foreground font-semibold' : 'text-muted'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-accent rounded-full transition-all duration-300"
                    />
                  )}
                </a>
              );
            })}

            <button
              onClick={() => onStartSurvey('job_seeker')}
              className="py-1.5 text-muted hover:text-foreground transition-colors font-medium"
            >
              Take Survey
            </button>
          </div>

          {/* Right: Join Waitlist Pill Button + Mobile Quick Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Action Button for Mobile (< 640px) */}
            <button
              onClick={() => onStartSurvey('job_seeker')}
              className="sm:hidden px-3 py-1.5 rounded-full bg-foreground text-background text-[11px] font-semibold hover:bg-[#2C2C2A] transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Survey</span>
            </button>

            {/* Desktop Join Waitlist Pill Button */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onOpenWaitlist}
                className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-[#2C2C2A] transition-all duration-300 shadow-sm active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Join Waitlist</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-1 rounded-full hover:bg-black/5 text-foreground focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#F8F7F3] flex flex-col justify-between p-5 xs:p-6 sm:p-8 md:hidden animate-fadeIn overflow-y-auto">
          <div className="pt-2 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E2DA]">
              <img
                src="/text.png"
                alt="PitchX"
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 pt-1">
              <a
                href="#about-dossier"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-display text-2xl font-medium text-foreground hover:text-accent transition-colors py-1"
              >
                About PitchX
              </a>
              <a
                href="#the-contrast"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-display text-2xl font-medium text-foreground hover:text-accent transition-colors py-1"
              >
                The Contrast
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); onStartSurvey('job_seeker'); }}
                className="block text-left w-full font-display text-2xl font-medium text-foreground hover:text-accent transition-colors py-1"
              >
                For Job Seekers
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onStartSurvey('recruiter'); }}
                className="block text-left w-full font-display text-2xl font-medium text-foreground hover:text-accent transition-colors py-1"
              >
                For Recruiters
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onStartSurvey('job_seeker'); }}
                className="block text-left w-full font-display text-2xl font-medium text-[#B88700] hover:text-foreground transition-colors py-1"
              >
                Take Survey →
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-6 pb-6 border-t border-[#E4E2DA]">
            <button
              onClick={() => { setMobileMenuOpen(false); onStartSurvey('job_seeker'); }}
              className="w-full py-3.5 rounded-full bg-foreground text-background text-sm font-semibold text-center active:scale-98 transition-transform shadow-sm"
            >
              I'm a Job Seeker
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onStartSurvey('recruiter'); }}
              className="w-full py-3.5 rounded-full border border-foreground bg-white text-foreground text-sm font-semibold text-center hover:bg-accent/20 active:scale-98 transition-transform"
            >
              I'm a Recruiter
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenWaitlist(); }}
              className="w-full py-3.5 rounded-full bg-accent text-foreground text-sm font-bold text-center active:scale-98 transition-transform shadow-xs"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </>
  );
}
