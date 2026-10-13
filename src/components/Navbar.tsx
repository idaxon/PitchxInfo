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
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1120px] h-16 rounded-full px-6 flex items-center justify-between border border-[#E4E2DA] bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(26,26,25,0.04)]"
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

          {/* Center: Sentence Case, 15px Medium, Even 32px Gaps, Sliding 2px Yellow Underline */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-muted relative">
            {navLinks.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`relative py-2 transition-colors duration-200 hover:text-foreground ${
                    isActive ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full transition-all duration-300"
                      layout-id="nav-underline"
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right: Join Waitlist Black Pill Button (Yellow Dot pulses once on load, fills yellow on hover) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onStartSurvey('job_seeker')}
              className="text-[14px] font-medium text-muted hover:text-foreground px-3 py-1.5 transition-colors"
            >
              Take Survey
            </button>
            <button
              onClick={onOpenWaitlist}
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-foreground transition-all duration-300 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-accent group-hover:bg-foreground animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_1] transition-colors" />
              <span>Join Waitlist</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-full hover:bg-black/5 text-foreground focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Full-screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F8F7F3] flex flex-col justify-between p-8 sm:hidden animate-fadeIn">
          <div className="pt-24 space-y-8">
            <img
              src="/text.png"
              alt="PitchX"
              className="h-8 w-auto object-contain"
            />
            <div className="space-y-6">
              <a
                href="#about-dossier"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-display text-3xl font-light hover:italic text-foreground"
              >
                About PitchX
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); onStartSurvey('job_seeker'); }}
                className="block text-left font-display text-3xl font-light hover:italic text-foreground"
              >
                For Job Seekers
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onStartSurvey('recruiter'); }}
                className="block text-left font-display text-3xl font-light hover:italic text-foreground"
              >
                For Recruiters
              </button>
            </div>
          </div>

          <div className="space-y-3 pb-8">
            <button
              onClick={() => { setMobileMenuOpen(false); onStartSurvey('job_seeker'); }}
              className="w-full py-3.5 rounded-full bg-foreground text-background text-sm font-medium text-center"
            >
              I'm a Job Seeker
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onStartSurvey('recruiter'); }}
              className="w-full py-3.5 rounded-full border border-foreground text-foreground text-sm font-medium text-center hover:bg-accent"
            >
              I'm a Recruiter
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenWaitlist(); }}
              className="w-full py-3.5 rounded-full bg-accent text-foreground text-sm font-bold text-center"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </>
  );
}
