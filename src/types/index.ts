export type RespondentType = 'job_seeker' | 'recruiter';

export interface JobSeekerAnswers {
  q1_status: string; // Current status
  q2_problem: string; // Biggest problem finding jobs
  q3_would_use: string; // Would use PitchX
  q4_feature_interest: string; // Which feature interests most
  q5_onboarding_fee: string; // Would pay onboarding fee
  q6_fee_amount: string; // Reasonable fee amount
  q7_early_access: string; // Early access and launch offers
}

export interface RecruiterAnswers {
  q1_challenge: string; // Biggest hiring challenge
  q2_would_use: string; // Would use PitchX
  q3_proof_score_usefulness: string; // How useful would Proof Score filter be
  q4_filter_preferences: string[]; // Which candidate filters most useful (multiselect)
  q5_trust_factors: string; // What would make you trust Proof Score
  q6_test_real_opening: string; // Would test with real job opening
  q7_early_access: string; // Early access
}

export interface SurveySubmissionData {
  id?: string;
  respondent_type: RespondentType;
  full_name: string;
  email: string;
  recruiter_position?: string;
  answers: JobSeekerAnswers | RecruiterAnswers;
  marketing_consent: boolean;
  file_number: string;
  created_at?: string;
}

export interface WaitlistSubmissionData {
  id?: string;
  respondent_type: RespondentType | 'general';
  email: string;
  consent: boolean;
  created_at?: string;
}

export interface AnalyticsRecord {
  id?: string;
  event_name: 
    | 'landing_page_visit'
    | 'respondent_selected'
    | 'survey_start'
    | 'survey_question_view'
    | 'survey_question_answered'
    | 'survey_complete'
    | 'survey_abandon'
    | 'waitlist_registration';
  respondent_type?: RespondentType | 'general';
  metadata?: Record<string, any>;
  created_at?: string;
}
