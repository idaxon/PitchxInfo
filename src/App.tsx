import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeStrip from './components/MarqueeStrip';
import PillarsSection from './components/PillarsSection';
import HowItWorksTimeline from './components/HowItWorksTimeline';
import Footer from './components/Footer';
import SurveyView from './components/SurveyView';
import ThankYouView from './components/ThankYouView';
import AdminDashboard from './components/AdminDashboard';
import NotFound from './components/NotFound';
import WaitlistModal from './components/WaitlistModal';
import CustomCursor from './components/CustomCursor';
import { RespondentType, SurveySubmissionData } from './types';
import { analytics } from './lib/analytics';

type ActiveView = 'landing' | 'survey' | 'thank_you' | 'admin' | 'not_found';

function getInitialView(): ActiveView {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname === '/admin') return 'admin';
    if (pathname === '/' || pathname === '') return 'landing';
    return 'not_found';
  }
  return 'landing';
}

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>(getInitialView());
  const [selectedType, setSelectedType] = useState<RespondentType>('job_seeker');
  const [lastSubmission, setLastSubmission] = useState<SurveySubmissionData | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState<boolean>(false);

  // Initial landing page visit tracking
  useEffect(() => {
    analytics.pageView();
  }, []);

  // Sync URL when view changes
  useEffect(() => {
    if (currentView === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (currentView === 'landing' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  }, [currentView]);

  // Handle browser back button
  useEffect(() => {
    const handlePop = () => {
      const pathname = window.location.pathname;
      if (pathname === '/admin') {
        setCurrentView('admin');
      } else if (pathname === '/' || pathname === '') {
        setCurrentView('landing');
      } else {
        setCurrentView('not_found');
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Handlers
  const handleStartSurvey = (type: RespondentType) => {
    setSelectedType(type);
    setCurrentView('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSurveyCompleted = (submission: SurveySubmissionData) => {
    setLastSubmission(submission);
    setCurrentView('thank_you');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-accent selection:text-foreground">
      
      {/* Paper grain subtle overlay */}
      <div className="paper-grain" aria-hidden="true" />

      {/* Desktop subtle custom cursor */}
      <CustomCursor />

      {/* VIEW: SURVEY FLOW (FULL SCREEN CASE FILE) */}
      {currentView === 'survey' && (
        <SurveyView
          initialType={selectedType}
          onComplete={handleSurveyCompleted}
          onExit={handleReturnHome}
        />
      )}

      {/* VIEW: THANK YOU CERTIFICATE RECORD */}
      {currentView === 'thank_you' && lastSubmission && (
        <ThankYouView
          submission={lastSubmission}
          onHome={handleReturnHome}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {/* VIEW: ADMIN TELEMETRY DASHBOARD */}
      {currentView === 'admin' && (
        <AdminDashboard
          onBack={handleReturnHome}
        />
      )}

      {/* VIEW: 404 NOT FOUND CASE FILE */}
      {currentView === 'not_found' && (
        <NotFound
          onBack={handleReturnHome}
          onStartSurvey={() => handleStartSurvey('job_seeker')}
        />
      )}

      {/* VIEW: MAIN LANDING PAGE */}
      {currentView === 'landing' && (
        <>
          <Navbar
            onStartSurvey={handleStartSurvey}
            onOpenWaitlist={() => setWaitlistOpen(true)}
          />

          <main id="main-content">
            <Hero
              onSelectType={handleStartSurvey}
              onOpenWaitlist={() => setWaitlistOpen(true)}
            />

            <MarqueeStrip />

            <PillarsSection />

            <HowItWorksTimeline
              onSelectType={handleStartSurvey}
            />
          </main>

          <Footer
            onStartSurvey={handleStartSurvey}
            onOpenWaitlist={() => setWaitlistOpen(true)}
          />
        </>
      )}

      {/* Pre-launch Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

    </div>
  );
}
