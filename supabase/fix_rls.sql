-- ==============================================================================
-- PitchX Supabase Fix: Allow Admin Dashboard & Public Forms to Access Data
-- ==============================================================================
-- Run this script in your Supabase Dashboard:
-- 1. Open https://supabase.com/dashboard/project/tkjbtersuebqrtzlrpga/sql/new
-- 2. Paste this entire script
-- 3. Click "RUN"
-- ==============================================================================

-- Option A: Disable RLS completely on these 3 tables (Recommended for pre-launch stage)
ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;

-- Grant full table access to the public API (anon) and authenticated roles
GRANT ALL ON TABLE public.survey_responses TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.waitlist_signups TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.analytics_events TO anon, authenticated, service_role;

-- Notify PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';
