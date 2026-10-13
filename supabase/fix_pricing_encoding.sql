-- ==============================================================================
-- PitchX SQL Fix: Clean Mojibake / Corrupted Rupee (₹) and Dash Encoding
-- ==============================================================================
-- Run this in your Supabase SQL Editor if your uploaded rows show:
-- â‚¹100â€“â‚¹199, â‚¹49â€“â‚¹99, â‚¹0 â€” Free, etc.
-- ==============================================================================

-- 1. Fix q6_fee_amount column (Note: Check 200 FIRST to avoid 499 matching 49/99!)
UPDATE public.survey_responses
SET q6_fee_amount = CASE
    WHEN q6_fee_amount LIKE '%Free%' OR q6_fee_amount LIKE '%0%' THEN '₹0 — Free'
    WHEN q6_fee_amount LIKE '%more%' OR q6_fee_amount LIKE '%500%' THEN 'More than ₹499'
    WHEN q6_fee_amount LIKE '%200%' THEN '₹200–₹499'
    WHEN q6_fee_amount LIKE '%100%' OR q6_fee_amount LIKE '%199%' THEN '₹100–₹199'
    WHEN q6_fee_amount LIKE '%49%' OR q6_fee_amount LIKE '%99%' THEN '₹49–₹99'
    ELSE REPLACE(REPLACE(REPLACE(q6_fee_amount, 'â‚¹', '₹'), 'â€“', '–'), 'â€”', '—')
END
WHERE q6_fee_amount IS NOT NULL;

-- 2. Also update inside the answers JSONB object if present
UPDATE public.survey_responses
SET answers = jsonb_set(
    answers,
    '{q6_fee_amount}',
    to_jsonb(
        CASE
            WHEN answers->>'q6_fee_amount' LIKE '%Free%' OR answers->>'q6_fee_amount' LIKE '%0%' THEN '₹0 — Free'
            WHEN answers->>'q6_fee_amount' LIKE '%more%' OR answers->>'q6_fee_amount' LIKE '%500%' THEN 'More than ₹499'
            WHEN answers->>'q6_fee_amount' LIKE '%200%' THEN '₹200–₹499'
            WHEN answers->>'q6_fee_amount' LIKE '%100%' OR answers->>'q6_fee_amount' LIKE '%199%' THEN '₹100–₹199'
            WHEN answers->>'q6_fee_amount' LIKE '%49%' OR answers->>'q6_fee_amount' LIKE '%99%' THEN '₹49–₹99'
            ELSE REPLACE(REPLACE(REPLACE(COALESCE(answers->>'q6_fee_amount', ''), 'â‚¹', '₹'), 'â€“', '–'), 'â€”', '—')
        END
    )
)
WHERE answers ? 'q6_fee_amount';

-- 3. Clean any corrupted dashes/quotes in other questions
UPDATE public.survey_responses
SET
    full_name = REPLACE(REPLACE(full_name, 'â€™', ''''), 'â€“', '–'),
    q2_problem = REPLACE(REPLACE(q2_problem, 'â€™', ''''), 'â€“', '–'),
    q1_challenge = REPLACE(REPLACE(q1_challenge, 'â€™', ''''), 'â€“', '–')
WHERE full_name LIKE '%â%' OR q2_problem LIKE '%â%' OR q1_challenge LIKE '%â%';

NOTIFY pgrst, 'reload schema';
