-- ==============================================================================
-- Non-Destructive Update: Add Individual Columns To Existing Table
-- (Use this if you already have rows in survey_responses and want to keep them)
-- ==============================================================================

ALTER TABLE public.survey_responses
    ADD COLUMN IF NOT EXISTS q1_status TEXT,
    ADD COLUMN IF NOT EXISTS q2_problem TEXT,
    ADD COLUMN IF NOT EXISTS q3_would_use TEXT,
    ADD COLUMN IF NOT EXISTS q4_feature_interest TEXT,
    ADD COLUMN IF NOT EXISTS q5_onboarding_fee TEXT,
    ADD COLUMN IF NOT EXISTS q6_fee_amount TEXT,
    ADD COLUMN IF NOT EXISTS q1_challenge TEXT,
    ADD COLUMN IF NOT EXISTS q3_proof_score_usefulness TEXT,
    ADD COLUMN IF NOT EXISTS q4_filter_preferences TEXT,
    ADD COLUMN IF NOT EXISTS q5_trust_factors TEXT,
    ADD COLUMN IF NOT EXISTS q6_test_real_opening TEXT,
    ADD COLUMN IF NOT EXISTS q7_early_access TEXT;

-- If rows already have data inside answers JSONB, populate the columns from JSON:
UPDATE public.survey_responses
SET
    q1_status = COALESCE(q1_status, answers->>'q1_status'),
    q2_problem = COALESCE(q2_problem, answers->>'q2_problem'),
    q3_would_use = COALESCE(q3_would_use, answers->>'q3_would_use'),
    q4_feature_interest = COALESCE(q4_feature_interest, answers->>'q4_feature_interest'),
    q5_onboarding_fee = COALESCE(q5_onboarding_fee, answers->>'q5_onboarding_fee'),
    q6_fee_amount = COALESCE(q6_fee_amount, answers->>'q6_fee_amount'),
    q1_challenge = COALESCE(q1_challenge, answers->>'q1_challenge'),
    q3_proof_score_usefulness = COALESCE(q3_proof_score_usefulness, answers->>'q3_proof_score_usefulness'),
    q4_filter_preferences = COALESCE(q4_filter_preferences, answers->>'q4_filter_preferences'),
    q5_trust_factors = COALESCE(q5_trust_factors, answers->>'q5_trust_factors'),
    q6_test_real_opening = COALESCE(q6_test_real_opening, answers->>'q6_test_real_opening'),
    q7_early_access = COALESCE(q7_early_access, answers->>'q7_early_access')
WHERE answers IS NOT NULL;

-- Disable RLS and grant permissions
ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.survey_responses TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';
