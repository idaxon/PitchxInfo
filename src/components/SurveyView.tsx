import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { RespondentType, JobSeekerAnswers, RecruiterAnswers, SurveySubmissionData } from '../types';
import { submitSurveyResponse, getNextFileNumber } from '../lib/supabase';
import { analytics } from '../lib/analytics';

interface SurveyViewProps {
  initialType?: RespondentType;
  onComplete: (submission: SurveySubmissionData) => void;
  onExit: () => void;
}

const RECRUITER_POSITIONS = [
  'Recruiter / Talent Acquisition',
  'HR Executive / HR Manager',
  'Hiring Manager',
  'Founder / Co-founder',
  'Technical Interviewer',
  'Recruitment Agency',
  'Other',
];

interface SurveyQuestion {
  key: string;
  title: string;
  subtitle: string;
  options: string[];
  isMulti?: boolean;
}

const JOB_SEEKER_QUESTIONS: SurveyQuestion[] = [
  {
    key: 'q1_status',
    title: 'What best describes your current status?',
    subtitle: 'This helps calibrate our candidate benchmark brackets.',
    options: [
      'College student',
      'Recent graduate',
      'Working professional',
      'Looking for an internship',
    ]
  },
  {
    key: 'q2_problem',
    title: 'What is your biggest problem finding jobs or internships?',
    subtitle: 'Identify the primary bottleneck in your current search.',
    options: [
      'Not getting interview calls',
      'Too much competition',
      'Lack of skills or experience',
      'Difficulty showcasing projects',
      'Finding relevant opportunities',
    ]
  },
  {
    key: 'q3_would_use',
    title: 'Would you use PitchX, where companies discover you through projects, verified skills, and Proof Scores?',
    subtitle: 'Replacing generic resume screening with verifiable proof.',
    options: [
      'Yes',
      'Maybe',
      'No',
    ]
  },
  {
    key: 'q4_feature_interest',
    title: 'Which PitchX feature interests you most?',
    subtitle: 'Select the primary tool you would rely on.',
    options: [
      'Verified skill assessments and Proof Score',
      'Showcasing projects and GitHub',
      'Companies approaching me directly',
      'Finding relevant jobs and internships',
      'AI-generated resume',
    ]
  },
  {
    key: 'q5_onboarding_fee',
    title: 'PitchX may charge a one-time onboarding fee to activate your profile and make it visible to recruiters. Would you pay this fee?',
    subtitle: 'Testing willingness to pay for verified visibility and proctored scoring.',
    options: [
      'Yes, if affordable',
      'Yes, if it helps recruiters discover me',
      'Maybe, depending on the amount',
      'No, I expect free profile activation',
      'I prefer a free basic profile with optional paid features',
    ]
  },
  {
    key: 'q6_fee_amount',
    title: 'What one-time onboarding fee would you consider reasonable?',
    subtitle: 'Help us anchor realistic pricing for profile verification.',
    options: [
      '₹0 — Free',
      '₹49–₹99',
      '₹100–₹199',
      '₹200–₹499',
      'More than ₹499',
    ]
  },
  {
    key: 'q7_early_access',
    title: 'Would you like early access and launch offers?',
    subtitle: 'Join the priority cohort when the testing engine launches.',
    options: [
      'Yes',
      'No',
    ]
  }
];

const RECRUITER_QUESTIONS: SurveyQuestion[] = [
  {
    key: 'q1_challenge',
    title: 'What is your biggest hiring challenge?',
    subtitle: 'Pinpointing where tech recruitment pipelines fail most.',
    isMulti: false,
    options: [
      'Finding candidates with the right skills',
      'Too many irrelevant resumes',
      'Difficulty verifying actual skills',
      'Slow screening and shortlisting',
      'High recruitment costs',
    ]
  },
  {
    key: 'q2_would_use',
    title: 'Would you use PitchX to discover candidates through verified skills, projects, and Proof Scores?',
    subtitle: 'A platform prioritizing verified evidence over CV keywords.',
    isMulti: false,
    options: [
      'Yes',
      'Maybe',
      'No',
    ]
  },
  {
    key: 'q3_proof_score_usefulness',
    title: 'How useful would a Proof Score filter be for shortlisting candidates?',
    subtitle: 'Example: filtering candidates with a score of 70/100 or above before reading resumes.',
    isMulti: false,
    options: [
      'Very useful',
      'Somewhat useful',
      'Useful only if scores are reliable',
      'Not useful',
    ]
  },
  {
    key: 'q4_filter_preferences',
    title: 'Which candidate filters would be most useful?',
    subtitle: 'Select all filters you would rely on during search (Multiple selections allowed).',
    isMulti: true,
    options: [
      'Overall Proof Score',
      'Domain-specific scores, such as AI/ML, frontend, and backend',
      'Technical skills',
      'GitHub and project portfolio',
      'Assessment results',
      'Experience',
    ]
  },
  {
    key: 'q5_trust_factors',
    title: 'What would make you trust the PitchX Proof Score?',
    subtitle: 'What evidence criteria gives your hiring team 100% confidence?',
    isMulti: false,
    options: [
      'Transparent score breakdown',
      'Verified skill assessment results',
      'GitHub and live project evidence',
      'Comparison with interview performance',
      'Testing with real candidates',
    ]
  },
  {
    key: 'q6_test_real_opening',
    title: 'Would you test PitchX with a real job opening?',
    subtitle: 'Evaluate 5-10 pre-vetted candidates with your active criteria.',
    isMulti: false,
    options: [
      'Yes, I have an active hiring requirement',
      'Maybe, after a demo',
      'Interested, but not hiring currently',
      'No',
    ]
  },
  {
    key: 'q7_early_access',
    title: 'Would you like early access to PitchX?',
    subtitle: 'Receive first batch access to our verified candidate shortlist.',
    isMulti: false,
    options: [
      'Yes',
      'No',
    ]
  }
];

export default function SurveyView({ initialType = 'job_seeker', onComplete, onExit }: SurveyViewProps) {
  // Step 0: Type selector (if not chosen) or Basic details
  // Step 1: Basic Details (Name, Email, optional Recruiter Position)
  // Step 2 to 8: Question 1 through Question 7
  
  const [respondentType, setRespondentType] = useState<RespondentType>(initialType);
  const [step, setStep] = useState<number>(0); // 0 = Basic details, 1..7 = questions
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [recruiterPosition, setRecruiterPosition] = useState<string>('Recruiter / Talent Acquisition');
  const [marketingConsent, setMarketingConsent] = useState<boolean>(true);
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeQuestions = respondentType === 'job_seeker' ? JOB_SEEKER_QUESTIONS : RECRUITER_QUESTIONS;
  const totalSteps = activeQuestions.length + 1; // Basic details + Q1..Q7
  const progressPercent = Math.min(100, Math.round((step / totalSteps) * 100));

  // Autosave restore from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pitchx_survey_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.respondentType) setRespondentType(parsed.respondentType);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.recruiterPosition) setRecruiterPosition(parsed.recruiterPosition);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.step === 'number' && parsed.step > 0) setStep(parsed.step);
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  // Autosave to sessionStorage on state changes
  useEffect(() => {
    try {
      sessionStorage.setItem('pitchx_survey_draft', JSON.stringify({
        respondentType,
        fullName,
        email,
        recruiterPosition,
        answers,
        step,
      }));
    } catch {
      // Ignore write errors
    }
  }, [respondentType, fullName, email, recruiterPosition, answers, step]);

  // Track analytics for current step
  useEffect(() => {
    if (step === 0) {
      analytics.startSurvey(respondentType);
    } else if (step > 0 && step <= activeQuestions.length) {
      const currentQ = activeQuestions[step - 1];
      analytics.viewQuestion(respondentType, step, currentQ.key);
    }
  }, [step, respondentType]);

  // Handle Option Select
  const handleSelectOption = useCallback((optionValue: string) => {
    setValidationError('');
    const currentQ = activeQuestions[step - 1];
    if (!currentQ) return;

    if (currentQ.isMulti) {
      const currentList: string[] = answers[currentQ.key] || [];
      const updated = currentList.includes(optionValue)
        ? currentList.filter(item => item !== optionValue)
        : [...currentList, optionValue];
      setAnswers(prev => ({ ...prev, [currentQ.key]: updated }));
      analytics.answerQuestion(respondentType, step, currentQ.key, updated);
    } else {
      setAnswers(prev => ({ ...prev, [currentQ.key]: optionValue }));
      analytics.answerQuestion(respondentType, step, currentQ.key, optionValue);
      // Auto advance to next question on single choice selection after brief visual confirmation
      setTimeout(() => {
        handleNextStep();
      }, 180);
    }
  }, [step, activeQuestions, answers, respondentType]);

  // Validation before advancing
  const handleNextStep = () => {
    setValidationError('');

    // Step 0: Basic details validation
    if (step === 0) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setValidationError('Please enter your full name.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setValidationError('Please provide a valid email address.');
        return;
      }
      if (respondentType === 'recruiter' && !recruiterPosition) {
        setValidationError('Please select your current position.');
        return;
      }
      setStep(1);
      return;
    }

    // Step 1..7: Check if current question answered
    const currentQ = activeQuestions[step - 1];
    const currentAnswer = answers[currentQ.key];

    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      setValidationError('Please select an option before continuing.');
      return;
    }

    // If at last question, submit!
    if (step === activeQuestions.length) {
      submitSurvey();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      onExit();
    }
  };

  // Submit survey responses
  const submitSurvey = async () => {
    setIsSubmitting(true);
    setValidationError('');

    const fileNumber = getNextFileNumber();
    const submissionPayload = {
      respondent_type: respondentType,
      full_name: fullName.trim(),
      email: email.trim(),
      recruiter_position: respondentType === 'recruiter' ? recruiterPosition : undefined,
      answers: answers as JobSeekerAnswers | RecruiterAnswers,
      marketing_consent: marketingConsent,
      file_number: fileNumber,
    };

    try {
      const res = await submitSurveyResponse(submissionPayload);
      if (res.success && res.data) {
        analytics.completeSurvey(respondentType, fileNumber);
        try {
          sessionStorage.removeItem('pitchx_survey_draft');
        } catch {}
        onComplete(res.data);
      } else {
        setValidationError(res.error || 'Failed to submit response. Please retry.');
      }
    } catch {
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard navigation listener (A, B, C, D, Enter, Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in basic details inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        if (e.key === 'Enter' && step === 0) {
          e.preventDefault();
          handleNextStep();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextStep();
        return;
      }

      if (e.key === 'Escape') {
        onExit();
        return;
      }

      // Check for A-Z shortcuts in question step
      if (step > 0 && step <= activeQuestions.length) {
        const currentQ = activeQuestions[step - 1];
        const keyIndex = e.key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
        if (keyIndex >= 0 && keyIndex < currentQ.options.length) {
          e.preventDefault();
          handleSelectOption(currentQ.options[keyIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, activeQuestions, handleSelectOption, handleNextStep]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F7F3] overflow-y-auto flex flex-col justify-between select-none">
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-border bg-[#F8F7F3] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevStep}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors p-1 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 0 ? 'Exit' : 'Back'}</span>
          </button>

          <div className="h-4 w-[1px] bg-border" />

          <div className="flex items-center gap-2 font-mono text-xs uppercase text-muted">
            <span className="font-bold text-foreground">DOSSIER FILE:</span>
            <span>{respondentType === 'job_seeker' ? 'JOB SEEKER / STUDENT' : 'RECRUITER / FOUNDER'}</span>
          </div>
        </div>

        {/* Circular Proof Score Seal Progress Meter (filling clockwise 0 -> 100) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end font-mono text-[10px] uppercase text-muted">
            <span>SEAL PROGRESS</span>
            <span className="font-bold text-foreground">{progressPercent}% VERIFIED</span>
          </div>

          <div className="relative w-11 h-11 flex items-center justify-center">
            {/* SVG circular progress ring */}
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
              {/* Background track */}
              <path
                className="text-border"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Animated Progress indicator */}
              <path
                className="text-accent transition-all duration-500 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono text-[10px] font-bold text-foreground">
              {progressPercent}
            </span>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Case File Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 sm:py-14 flex flex-col justify-center">
        
        {/* STEP 0: Candidate Basic Details */}
        {step === 0 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="stamp-badge">
                EXHIBIT 00 // IDENTITY REGISTRATION
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
                First, your <span className="italic">case file details</span>.
              </h2>
              <p className="font-sans text-sm sm:text-base text-muted">
                Your response will directly influence our validation findings. We respect your confidentiality.
              </p>
            </div>

            {/* Respondent Type switcher pill */}
            <div className="p-1 rounded-xl bg-[#EFECE4] border border-border inline-flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setRespondentType('job_seeker');
                  analytics.selectRespondent('job_seeker');
                }}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all font-semibold ${
                  respondentType === 'job_seeker'
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Job Seeker / Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setRespondentType('recruiter');
                  analytics.selectRespondent('recruiter');
                }}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all font-semibold ${
                  respondentType === 'recruiter'
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Recruiter / Hiring Manager
              </button>
            </div>

            <div className="space-y-5 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-evidence">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
                  Full Name <span className="text-accent-hover">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-[#F8F7F3] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Recruiter Position (if recruiter) */}
              {respondentType === 'recruiter' && (
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
                    Current Position <span className="text-accent-hover">*</span>
                  </label>
                  <select
                    value={recruiterPosition}
                    onChange={(e) => setRecruiterPosition(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-[#F8F7F3] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {RECRUITER_POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
                  {respondentType === 'recruiter' ? 'Work Email Address' : 'Email Address'} <span className="text-accent-hover">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={respondentType === 'recruiter' ? 'name@company.com' : 'alex@domain.com'}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-[#F8F7F3] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Marketing consent */}
              <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-muted pt-2">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-foreground accent-foreground"
                />
                <span>
                  Opt in to receive validation survey outcomes, early-access access codes, and launch notifications.
                </span>
              </label>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-widest font-semibold hover:bg-accent hover:text-foreground transition-all shadow-md"
            >
              <span>Begin Survey (Q1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1..7: ONE HUGE QUESTION PER SCREEN */}
        {step > 0 && step <= activeQuestions.length && (() => {
          const currentQ = activeQuestions[step - 1];
          const selectedAnswer = answers[currentQ.key];

          return (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Question metadata tag */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="stamp-badge">
                    QUESTION {step} OF {activeQuestions.length}
                  </span>
                  {currentQ.isMulti && (
                    <span className="font-mono text-[10px] text-muted-light tracking-wider uppercase font-semibold">
                      [SELECT ALL THAT APPLY]
                    </span>
                  )}
                </div>

                <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.15]">
                  {currentQ.title}
                </h2>

                {currentQ.subtitle && (
                  <p className="font-sans text-muted text-sm sm:text-base">
                    {currentQ.subtitle}
                  </p>
                )}
              </div>

              {/* Options as large selectable rows with keyboard shortcuts (A/B/C/D) */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  const isSelected = currentQ.isMulti
                    ? Array.isArray(selectedAnswer) && selectedAnswer.includes(option)
                    : selectedAnswer === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'border-2 border-foreground bg-white shadow-evidence-lift'
                          : 'border-border bg-white/70 hover:bg-white hover:border-foreground/40 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Keyboard shortcut keycap */}
                        <div
                          className={`w-8 h-8 rounded border font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-foreground text-accent border-foreground'
                              : 'bg-[#F8F7F3] text-muted border-border group-hover:border-foreground/50 group-hover:text-foreground'
                          }`}
                        >
                          {letter}
                        </div>

                        <span className={`font-sans text-sm sm:text-base ${isSelected ? 'font-semibold text-foreground' : 'text-foreground/90'}`}>
                          {option}
                        </span>
                      </div>

                      {/* Selection check icon */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-accent border-accent text-foreground'
                            : 'border-border opacity-0 group-hover:opacity-40'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Validation alert if user tries to continue without choosing */}
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Navigation controls */}
              <div className="pt-4 flex items-center justify-between">
                <span className="hidden sm:inline font-mono text-xs text-muted-light">
                  Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-black/5 border border-border">A</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-black/5 border border-border">B</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-black/5 border border-border">C</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-black/5 border border-border">Enter ↵</kbd>
                </span>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNextStep}
                  className="ml-auto inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-widest font-semibold hover:bg-accent hover:text-foreground transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : step === activeQuestions.length ? (
                    <>
                      <span>Complete File</span>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })()}

      </main>

      {/* Footer Info line */}
      <footer className="w-full border-t border-border px-6 py-3 font-mono text-[11px] text-muted-light flex items-center justify-between">
        <span>PITCHX EVALUATION PROTOCOL // ENCRYPTED SUBMISSION</span>
        <span>AUTOSAVED TO SESSION</span>
      </footer>

    </div>
  );
}
