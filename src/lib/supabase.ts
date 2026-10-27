import { createClient } from '@supabase/supabase-js';
import { SurveySubmissionData, WaitlistSubmissionData, AnalyticsRecord, JobSeekerAnswers, RecruiterAnswers } from '../types';
import { INITIAL_SURVEY_RESPONSES, INITIAL_WAITLIST, INITIAL_ANALYTICS } from './mockData';

// Supabase Configuration Helper: Supports both Vite .env and runtime localStorage
export function getActiveSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('pitchx_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('pitchx_supabase_anon_key') : null;

  const url = (localUrl && localUrl.trim()) || 
              import.meta.env.VITE_SUPABASE_URL || 
              import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
              '';
  const key = (localKey && localKey.trim()) || 
              import.meta.env.VITE_SUPABASE_ANON_KEY || 
              import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
              '';

  const isConfigured = Boolean(
    url && 
    key && 
    url !== 'https://your-project-id.supabase.co' &&
    key !== 'your-supabase-anon-key-here'
  );

  return { url, key, isConfigured };
}

let _clientInstance: any = null;
let _lastUrl = '';
let _lastKey = '';

export function getSupabase(): any {
  const { url, key, isConfigured } = getActiveSupabaseConfig();
  if (!isConfigured) return null;
  if (_clientInstance && _lastUrl === url && _lastKey === key) {
    return _clientInstance;
  }
  try {
    _lastUrl = url;
    _lastKey = key;
    _clientInstance = createClient(url, key);
    return _clientInstance;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export const isSupabaseConfigured = getActiveSupabaseConfig().isConfigured;

export function checkIsSupabaseConfigured(): boolean {
  return getActiveSupabaseConfig().isConfigured;
}

export function saveSupabaseCredentials(url: string, key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pitchx_supabase_url', url.trim());
    localStorage.setItem('pitchx_supabase_anon_key', key.trim());
    _clientInstance = null;
  }
}

export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pitchx_supabase_url');
    localStorage.removeItem('pitchx_supabase_anon_key');
    _clientInstance = null;
  }
}

export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string; rowsCount?: number }> {
  try {
    const config = getActiveSupabaseConfig();
    const url = (customUrl !== undefined ? customUrl : config.url).trim();
    const key = (customKey !== undefined ? customKey : config.key).trim();
    if (!url || !key) {
      return { success: false, message: 'Both Supabase Project URL and Anon Key are required.' };
    }
    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('survey_responses').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { success: false, message: 'Table "survey_responses" does not exist yet. Please run the schema.sql in Supabase SQL Editor.' };
      }
      return { success: false, message: `Supabase Error: ${error.message}` };
    }
    return { success: true, message: 'Connected successfully to Supabase!', rowsCount: data?.length || 0 };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed. Please check the URL and Key.' };
  }
}

// Export dynamic client proxy so any direct `supabase.from()` calls always use active client
export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return undefined;
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
}) as any;

// LocalStorage keys for graceful offline/pre-setup operation
const STORAGE_KEYS = {
  SURVEYS: 'pitchx_survey_responses_v1',
  WAITLIST: 'pitchx_waitlist_signups_v1',
  ANALYTICS: 'pitchx_analytics_events_v1',
  COUNTER: 'pitchx_file_number_counter_v1',
};

// Initialize localStorage with initial seed data if empty
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SURVEYS)) {
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(INITIAL_SURVEY_RESPONSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WAITLIST)) {
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(INITIAL_WAITLIST));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.COUNTER, '43');
  }
}

initializeLocalStorage();

// Generate incremental file number PX-0043, PX-0044, etc.
export function getNextFileNumber(): string {
  const current = parseInt(localStorage.getItem(STORAGE_KEYS.COUNTER) || '43', 10);
  const next = current + 1;
  localStorage.setItem(STORAGE_KEYS.COUNTER, next.toString());
  return `PX-${String(current).padStart(4, '0')}`;
}

// 1. Submit Survey Response
export async function submitSurveyResponse(data: Omit<SurveySubmissionData, 'id' | 'created_at'>): Promise<{ success: boolean; data?: SurveySubmissionData; error?: string }> {
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID ? crypto.randomUUID() : `sr-${Date.now()}`;
  const fullRecord: SurveySubmissionData = {
    ...data,
    id,
    created_at: timestamp,
  };

  try {
    const client = getSupabase();
    if (client) {
      const ans: any = data.answers || {};
      const fullPayload: any = {
        respondent_type: data.respondent_type,
        full_name: data.full_name,
        email: data.email,
        recruiter_position: data.recruiter_position || null,
        answers: data.answers,
        marketing_consent: data.marketing_consent,
        file_number: data.file_number,
        created_at: timestamp,
        // Individual question columns
        q1_status: ans.q1_status || null,
        q2_problem: ans.q2_problem || null,
        q3_would_use: ans.q3_would_use || null,
        q4_feature_interest: ans.q4_feature_interest || null,
        q5_onboarding_fee: ans.q5_onboarding_fee || null,
        q6_fee_amount: ans.q6_fee_amount || null,
        q1_challenge: ans.q1_challenge || null,
        q3_proof_score_usefulness: ans.q3_proof_score_usefulness || null,
        q4_filter_preferences: Array.isArray(ans.q4_filter_preferences)
          ? ans.q4_filter_preferences.join(', ')
          : (ans.q4_filter_preferences || null),
        q5_trust_factors: ans.q5_trust_factors || null,
        q6_test_real_opening: ans.q6_test_real_opening || null,
        q7_early_access: ans.q7_early_access || null,
      };

      let { data: inserted, error } = await supabase
        .from('survey_responses')
        .insert([fullPayload])
        .select()
        .single();

      // If schema has not added columns yet, fallback to core payload
      if (error && error.message?.includes('column')) {
        const fallbackPayload = {
          respondent_type: data.respondent_type,
          full_name: data.full_name,
          email: data.email,
          recruiter_position: data.recruiter_position || null,
          answers: data.answers,
          marketing_consent: data.marketing_consent,
          file_number: data.file_number,
          created_at: timestamp,
        };
        const retry = await supabase
          .from('survey_responses')
          .insert([fallbackPayload])
          .select()
          .single();
        inserted = retry.data;
        error = retry.error;
      }

      if (error) {
        console.warn('Supabase insert warning, falling back to local persistence:', error);
      } else if (inserted) {
        fullRecord.id = inserted.id;
      }
    }
  } catch (err) {
    console.warn('Network or Supabase exception, fallback saved locally:', err);
  }

  // Always keep in local store for rapid instant admin retrieval & offline durability
  try {
    const existing: SurveySubmissionData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SURVEYS) || '[]');
    // Avoid duplicate id
    const filtered = existing.filter(item => item.id !== fullRecord.id);
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify([fullRecord, ...filtered]));
  } catch (e) {
    console.error('Local storage write error:', e);
  }

  return { success: true, data: fullRecord };
}

// 2. Submit Waitlist Signup
export async function submitWaitlistSignup(email: string, respondentType: 'job_seeker' | 'recruiter' | 'general' = 'general', consent = true): Promise<{ success: boolean; error?: string }> {
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID ? crypto.randomUUID() : `wl-${Date.now()}`;
  const record: WaitlistSubmissionData = {
    id,
    email,
    respondent_type: respondentType,
    consent,
    created_at: timestamp
  };

  try {
    const client = getSupabase();
    if (client) {
      await supabase.from('waitlist_signups').insert([{
        email,
        respondent_type: respondentType,
        consent,
        created_at: timestamp
      }]);
    }
  } catch (e) {
    console.warn('Waitlist Supabase submission warning:', e);
  }

  try {
    const existing: WaitlistSubmissionData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    // Filter duplicates by email
    const updated = [record, ...existing.filter(i => i.email.toLowerCase() !== email.toLowerCase())];
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(updated));
  } catch (e) {
    console.error('Local storage write error:', e);
  }

  return { success: true };
}

// 3. Analytics Tracking
export async function recordAnalytics(record: AnalyticsRecord): Promise<void> {
  const eventWithMeta: AnalyticsRecord = {
    ...record,
    id: crypto.randomUUID ? crypto.randomUUID() : `ev-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  try {
    const client = getSupabase();
    if (client) {
      supabase.from('analytics_events').insert([{
        event_name: eventWithMeta.event_name,
        respondent_type: eventWithMeta.respondent_type || null,
        metadata: eventWithMeta.metadata || {},
        created_at: eventWithMeta.created_at
      }]).then();
    }
  } catch {
    // Non-blocking
  }

  try {
    const existing: AnalyticsRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify([eventWithMeta, ...existing].slice(0, 500)));
  } catch {
    // Non-blocking
  }
}

// Helper to clean encoding glitches (mojibake) like â‚¹ -> ₹, â€“ -> –, â€” -> —
export function cleanMojibake(text: any): any {
  if (typeof text !== 'string') return text;
  return text
    .replace(/â‚¹/g, '₹')
    .replace(/â€“/g, '–')
    .replace(/â€”/g, ' — ')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€\x9d/g, '"')
    .replace(/â€¦/g, '…')
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬â€œ/g, "–")
    .trim();
}

// Normalize price ranges into clean, consistent display labels
export function normalizePrice(text: any): string {
  if (!text) return 'Not specified';
  const cleaned = cleanMojibake(String(text)).trim();

  // 1. Free / 0
  if (/free|\b0\b/i.test(cleaned)) {
    return '₹0 — Free';
  }

  // 2. More than ₹499 / Above 499 / 500+
  if (/more|>|above/i.test(cleaned) || /\b500\b/.test(cleaned)) {
    return 'More than ₹499';
  }

  // 3. ₹200–₹499 (Must check 200 FIRST to avoid '499' matching 49/99!)
  if (/200/i.test(cleaned)) {
    return '₹200–₹499';
  }

  // 4. ₹100–₹199
  if (/100|199/i.test(cleaned)) {
    return '₹100–₹199';
  }

  // 5. ₹49–₹99
  if (/49|99/i.test(cleaned)) {
    return '₹49–₹99';
  }

  return cleaned;
}

// Helper to normalize any row format uploaded to Supabase or localStorage
function normalizeSurveyRecord(row: any): SurveySubmissionData {
  let answers = row.answers;
  if (typeof answers === 'string') {
    try {
      answers = JSON.parse(answers);
    } catch {
      answers = {};
    }
  } else if (!answers || typeof answers !== 'object') {
    answers = {};
  }

  // Collect top-level question fields (q1_, q2_, etc.) if the table was flattened
  for (const k of Object.keys(row)) {
    if (k.startsWith('q') && !(k in answers)) {
      answers[k] = row[k];
    }
  }

  // Sanitize encoding on all answers
  const sanitizedAnswers: Record<string, any> = {};
  for (const [k, v] of Object.entries(answers)) {
    if (k === 'q6_fee_amount') {
      sanitizedAnswers[k] = normalizePrice(v);
    } else if (typeof v === 'string') {
      sanitizedAnswers[k] = cleanMojibake(v);
    } else if (Array.isArray(v)) {
      sanitizedAnswers[k] = v.map(item => cleanMojibake(item));
    } else {
      sanitizedAnswers[k] = v;
    }
  }

  return {
    id: String(row.id || `sr-${Date.now()}`),
    respondent_type: (row.respondent_type === 'recruiter' || row.role === 'recruiter') ? 'recruiter' : 'job_seeker',
    full_name: cleanMojibake(row.full_name || row.name || 'Anonymous'),
    email: row.email || '',
    recruiter_position: row.recruiter_position ? cleanMojibake(row.recruiter_position) : (row.position ? cleanMojibake(row.position) : undefined),
    answers: sanitizedAnswers as unknown as (JobSeekerAnswers | RecruiterAnswers),
    marketing_consent: Boolean(row.marketing_consent ?? row.consent ?? true),
    file_number: row.file_number || '',
    created_at: row.created_at || new Date().toISOString()
  };
}

export interface AdminDataResult {
  surveys: SurveySubmissionData[];
  waitlist: WaitlistSubmissionData[];
  analytics: AnalyticsRecord[];
  isFromSupabase: boolean;
  supabaseError?: string;
  supabaseCount: number;
}

// 4. Admin Data Fetching
export async function getAdminData(): Promise<AdminDataResult> {
  let surveys: SurveySubmissionData[] = [];
  let waitlist: WaitlistSubmissionData[] = [];
  let analytics: AnalyticsRecord[] = [];
  let isFromSupabase = false;
  let supabaseError: string | undefined;
  let supabaseCount = 0;

  // Try Supabase first if available
  const client = getSupabase();
  if (client) {
    try {
      const { data: sData, error: sErr } = await client
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (sErr) {
        console.error('Supabase survey_responses fetch error:', sErr);
        supabaseError = sErr.message;
      } else if (sData) {
        supabaseCount = sData.length;
        if (sData.length > 0) {
          surveys = sData.map(normalizeSurveyRecord);
          isFromSupabase = true;
        }
      }

      const { data: wData, error: wErr } = await client
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (wErr) {
        console.warn('Supabase waitlist fetch error:', wErr);
      } else if (wData && wData.length > 0) {
        waitlist = wData;
      }

      const { data: aData } = await client
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (aData && aData.length > 0) {
        analytics = aData;
      }
    } catch (e: any) {
      console.warn('Supabase admin fetch fell back to local store:', e);
      supabaseError = e?.message || 'Network exception while connecting to Supabase';
    }
  }

  // Fallback to local storage if remote yielded nothing or not configured
  const localSurveys: SurveySubmissionData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SURVEYS) || '[]');
  const localWaitlist: WaitlistSubmissionData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
  const localAnalytics: AnalyticsRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');

  if (surveys.length === 0) {
    surveys = localSurveys.map(normalizeSurveyRecord);
  }
  if (waitlist.length === 0) {
    waitlist = localWaitlist;
  }
  if (analytics.length === 0) {
    analytics = localAnalytics;
  }

  return { surveys, waitlist, analytics, isFromSupabase, supabaseError, supabaseCount };
}
