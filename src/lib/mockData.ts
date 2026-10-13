import { SurveySubmissionData, WaitlistSubmissionData, AnalyticsRecord } from '../types';

export const INITIAL_SURVEY_RESPONSES: SurveySubmissionData[] = [
  {
    id: 'd9b73461-8401-4475-a8ea-92b1a8d0001',
    respondent_type: 'job_seeker',
    full_name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    file_number: 'PX-0038',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    marketing_consent: true,
    answers: {
      q1_status: 'College student',
      q2_problem: 'Not getting interview calls',
      q3_would_use: 'Yes',
      q4_feature_interest: 'Verified skill assessments and Proof Score',
      q5_onboarding_fee: 'Yes, if affordable',
      q6_fee_amount: '₹100–₹199',
      q7_early_access: 'Yes',
    }
  },
  {
    id: 'd9b73461-8401-4475-a8ea-92b1a8d0002',
    respondent_type: 'recruiter',
    full_name: 'Priya Sundaram',
    email: 'priya@techscale.io',
    recruiter_position: 'Founder / Co-founder',
    file_number: 'PX-0039',
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
    marketing_consent: true,
    answers: {
      q1_challenge: 'Too many irrelevant resumes',
      q2_would_use: 'Yes',
      q3_proof_score_usefulness: 'Very useful',
      q4_filter_preferences: ['Overall Proof Score', 'GitHub and project portfolio', 'Technical skills'],
      q5_trust_factors: 'Verified skill assessment results',
      q6_test_real_opening: 'Yes, I have an active hiring requirement',
      q7_early_access: 'Yes',
    }
  },
  {
    id: 'd9b73461-8401-4475-a8ea-92b1a8d0003',
    respondent_type: 'job_seeker',
    full_name: 'Rahul Varma',
    email: 'rahul.v@sample.org',
    file_number: 'PX-0040',
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
    marketing_consent: true,
    answers: {
      q1_status: 'Recent graduate',
      q2_problem: 'Difficulty showcasing projects',
      q3_would_use: 'Yes',
      q4_feature_interest: 'Showcasing projects and GitHub',
      q5_onboarding_fee: 'Yes, if it helps recruiters discover me',
      q6_fee_amount: '₹200–₹499',
      q7_early_access: 'Yes',
    }
  },
  {
    id: 'd9b73461-8401-4475-a8ea-92b1a8d0004',
    respondent_type: 'recruiter',
    full_name: 'Marc Koenig',
    email: 'marc@fintechbuild.co',
    recruiter_position: 'Hiring Manager',
    file_number: 'PX-0041',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    marketing_consent: true,
    answers: {
      q1_challenge: 'Difficulty verifying actual skills',
      q2_would_use: 'Yes',
      q3_proof_score_usefulness: 'Very useful',
      q4_filter_preferences: ['Domain-specific scores, such as AI/ML, frontend, and backend', 'Assessment results'],
      q5_trust_factors: 'Transparent score breakdown',
      q6_test_real_opening: 'Maybe, after a demo',
      q7_early_access: 'Yes',
    }
  },
  {
    id: 'd9b73461-8401-4475-a8ea-92b1a8d0005',
    respondent_type: 'job_seeker',
    full_name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    file_number: 'PX-0042',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    marketing_consent: false,
    answers: {
      q1_status: 'Working professional',
      q2_problem: 'Too much competition',
      q3_would_use: 'Maybe',
      q4_feature_interest: 'Companies approaching me directly',
      q5_onboarding_fee: 'I prefer a free basic profile with optional paid features',
      q6_fee_amount: '₹49–₹99',
      q7_early_access: 'Yes',
    }
  }
];

export const INITIAL_WAITLIST: WaitlistSubmissionData[] = [
  {
    id: 'wl-001',
    respondent_type: 'job_seeker',
    email: 'aditya.sharma@example.com',
    consent: true,
    created_at: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 'wl-002',
    respondent_type: 'recruiter',
    email: 'priya@techscale.io',
    consent: true,
    created_at: new Date(Date.now() - 3600000 * 22).toISOString()
  },
  {
    id: 'wl-003',
    respondent_type: 'job_seeker',
    email: 'rahul.v@sample.org',
    consent: true,
    created_at: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: 'wl-004',
    respondent_type: 'recruiter',
    email: 'marc@fintechbuild.co',
    consent: true,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'wl-005',
    respondent_type: 'general',
    email: 'elena.rostova@devmail.org',
    consent: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const INITIAL_ANALYTICS: AnalyticsRecord[] = [
  { event_name: 'landing_page_visit', metadata: { source: 'direct' }, created_at: new Date(Date.now() - 3600000 * 30).toISOString() },
  { event_name: 'landing_page_visit', metadata: { source: 'twitter' }, created_at: new Date(Date.now() - 3600000 * 25).toISOString() },
  { event_name: 'respondent_selected', respondent_type: 'job_seeker', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { event_name: 'survey_start', respondent_type: 'job_seeker', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { event_name: 'survey_complete', respondent_type: 'job_seeker', created_at: new Date(Date.now() - 3600000 * 23).toISOString() },
  { event_name: 'landing_page_visit', metadata: { source: 'linkedin' }, created_at: new Date(Date.now() - 3600000 * 20).toISOString() },
  { event_name: 'respondent_selected', respondent_type: 'recruiter', created_at: new Date(Date.now() - 3600000 * 19).toISOString() },
  { event_name: 'survey_start', respondent_type: 'recruiter', created_at: new Date(Date.now() - 3600000 * 19).toISOString() },
  { event_name: 'survey_complete', respondent_type: 'recruiter', created_at: new Date(Date.now() - 3600000 * 18).toISOString() },
  { event_name: 'landing_page_visit', metadata: { source: 'hackernews' }, created_at: new Date(Date.now() - 3600000 * 10).toISOString() },
  { event_name: 'waitlist_registration', respondent_type: 'general', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
];
