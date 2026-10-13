-- ==============================================================================
-- PitchX Complete Database Schema: Individual Columns for Every Survey Answer
-- ==============================================================================
-- Run this in your Supabase Dashboard:
-- 1. Open https://supabase.com/dashboard/project/tkjbtersuebqrtzlrpga/sql/new
-- 2. Paste and click RUN
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING TABLE COMPLETELY & RECREATE WITH EXPLICIT ANSWER COLUMNS
DROP TABLE IF EXISTS public.survey_responses CASCADE;

CREATE TABLE public.survey_responses (
    -- Metadata & Contact
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_number TEXT NULL,
    respondent_type TEXT NOT NULL CHECK (respondent_type IN ('job_seeker', 'recruiter')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    recruiter_position TEXT NULL,
    marketing_consent BOOLEAN NOT NULL DEFAULT false,

    -- ==========================================================================
    -- JOB SEEKER SURVEY ANSWERS (INDIVIDUAL COLUMNS)
    -- ==========================================================================
    q1_status TEXT NULL,                    -- Current Status (e.g. Student, Employed, Looking)
    q2_problem TEXT NULL,                   -- Biggest Problem Finding Jobs
    q3_would_use TEXT NULL,                 -- Would Use PitchX? (Yes / Maybe / No)
    q4_feature_interest TEXT NULL,          -- Most Interesting Feature
    q5_onboarding_fee TEXT NULL,            -- Willing to Pay Onboarding Fee?
    q6_fee_amount TEXT NULL,                -- Reasonable Fee Amount

    -- ==========================================================================
    -- RECRUITER SURVEY ANSWERS (INDIVIDUAL COLUMNS)
    -- ==========================================================================
    q1_challenge TEXT NULL,                 -- Biggest Hiring Challenge
    q3_proof_score_usefulness TEXT NULL,    -- How Useful Is Proof Score Filter?
    q4_filter_preferences TEXT NULL,        -- Most Useful Candidate Filters (Comma-separated)
    q5_trust_factors TEXT NULL,             -- What Would Make You Trust Proof Score?
    q6_test_real_opening TEXT NULL,         -- Ready to Test With Real Job Opening?

    -- ==========================================================================
    -- SHARED QUESTION
    -- ==========================================================================
    q7_early_access TEXT NULL,              -- Interested in Early Access?

    -- Backup JSON answers blob for flexible querying
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance & rapid sorting
CREATE INDEX IF NOT EXISTS idx_survey_responses_type ON public.survey_responses (respondent_type);
CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON public.survey_responses (email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created ON public.survey_responses (created_at DESC);


-- 3. WAITLIST SIGNUPS TABLE
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_type TEXT NOT NULL CHECK (respondent_type IN ('job_seeker', 'recruiter', 'general')),
    email TEXT NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_waitlist_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_type ON public.waitlist_signups (respondent_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON public.waitlist_signups (created_at DESC);


-- 4. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    respondent_type TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    session_id TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events (created_at DESC);


-- ==============================================================================
-- PERMISSIONS & ACCESS CONTROL (NO RLS BLOCKING)
-- ==============================================================================
-- Grant full read/write to anon and authenticated roles
GRANT ALL ON TABLE public.survey_responses TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.waitlist_signups TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.analytics_events TO anon, authenticated, service_role;

-- Disable RLS so Admin Dashboard & submissions work without permission errors
ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;

-- Reload schema cache in PostgREST
NOTIFY pgrst, 'reload schema';
