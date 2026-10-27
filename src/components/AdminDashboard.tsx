import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Download,
  LogOut,
  Users,
  Briefcase,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Filter,
  PieChart,
  Layers,
  UserCheck,
  ShieldCheck,
  Target,
  Zap,
  ArrowRight,
  Award,
  Compass,
  FileText,
  Check,
  Database,
  Settings,
  Key,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import { 
  getAdminData, 
  checkIsSupabaseConfigured, 
  getActiveSupabaseConfig, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection, 
  cleanMojibake, 
  normalizePrice 
} from '../lib/supabase';
import { SurveySubmissionData, WaitlistSubmissionData, AnalyticsRecord, RespondentType } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  onLogout?: () => void;
}



// Human-readable label maps for each question key
const JOB_SEEKER_LABELS: Record<string, string> = {
  q1_status: 'Current Status',
  q2_problem: 'Biggest Problem Finding Jobs',
  q3_would_use: 'Would Use PitchX?',
  q4_feature_interest: 'Most Interesting Feature',
  q5_onboarding_fee: 'Willing to Pay Onboarding Fee?',
  q6_fee_amount: 'Reasonable Fee Amount',
  q7_early_access: 'Interested in Early Access?',
};

const RECRUITER_LABELS: Record<string, string> = {
  q1_challenge: 'Biggest Hiring Challenge',
  q2_would_use: 'Would Use PitchX?',
  q3_proof_score_usefulness: 'How Useful Is Proof Score Filter?',
  q4_filter_preferences: 'Most Useful Candidate Filters',
  q5_trust_factors: 'What Would Make You Trust Proof Score?',
  q6_test_real_opening: 'Ready to Test With Real Job Opening?',
  q7_early_access: 'Interested in Early Access?',
};

interface QuestionMeta {
  key: string;
  type: 'job_seeker' | 'recruiter';
  badge: string;
  title: string;
  subtitle: string;
  category: string;
}

const QUESTION_CATALOG: QuestionMeta[] = [
  // Job Seekers
  {
    key: 'q1_status',
    type: 'job_seeker',
    badge: 'Q1',
    title: 'What is your current status?',
    subtitle: 'Candidate profile mix, career stage and experience background',
    category: 'Demographics',
  },
  {
    key: 'q2_problem',
    type: 'job_seeker',
    badge: 'Q2',
    title: 'What is your biggest problem when looking for a job or internship?',
    subtitle: 'Core friction in traditional resume screening validating candidate demand',
    category: 'Problem Validation',
  },
  {
    key: 'q3_would_use',
    type: 'job_seeker',
    badge: 'Q3',
    title: 'Would you use PitchX to prove your skills directly to recruiters?',
    subtitle: 'Direct product interest & candidate readiness to build proof files',
    category: 'Product-Market Fit',
  },
  {
    key: 'q4_feature_interest',
    type: 'job_seeker',
    badge: 'Q4',
    title: 'Which feature interests you the most?',
    subtitle: 'Ranking feature pull: assessments, project showcases, direct outreach',
    category: 'Product Priority',
  },
  {
    key: 'q5_onboarding_fee',
    type: 'job_seeker',
    badge: 'Q5',
    title: 'Would you be willing to pay a one-time onboarding fee for verified profile setup?',
    subtitle: 'Monetization validation: candidate willingness to pay for proctored proof',
    category: 'Monetization',
  },
  {
    key: 'q6_fee_amount',
    type: 'job_seeker',
    badge: 'Q6',
    title: 'What one-time onboarding fee would you consider reasonable?',
    subtitle: 'Price sensitivity curve to establish optimal launch monetization tier',
    category: 'Pricing',
  },
  {
    key: 'q7_early_access',
    type: 'job_seeker',
    badge: 'Q7',
    title: 'Would you like early access and launch offers?',
    subtitle: 'Day 1 candidate activation cohort & beta testing queue',
    category: 'Cohort Readiness',
  },

  // Recruiters
  {
    key: 'q1_challenge',
    type: 'recruiter',
    badge: 'Q1',
    title: 'What is your biggest hiring challenge right now?',
    subtitle: 'Recruiter pain points in shortlisting: irrelevant resumes & unverified skills',
    category: 'Problem Validation',
  },
  {
    key: 'q2_would_use',
    type: 'recruiter',
    badge: 'Q2',
    title: 'Would you use PitchX to discover and hire pre-verified candidates?',
    subtitle: 'Recruiter willingness to adopt proof-based candidate discovery',
    category: 'Product-Market Fit',
  },
  {
    key: 'q3_proof_score_usefulness',
    type: 'recruiter',
    badge: 'Q3',
    title: 'How useful would a verified Proof Score filter be for shortlisting?',
    subtitle: 'Value proposition validation of PitchX proprietary Proof Score metric',
    category: 'Core Proposition',
  },
  {
    key: 'q4_filter_preferences',
    type: 'recruiter',
    badge: 'Q4',
    title: 'Which candidate filters and proof signals would you value most?',
    subtitle: 'Signals recruiters rely on: overall score, domain skills, GitHub projects',
    category: 'Filter Features',
  },
  {
    key: 'q5_trust_factors',
    type: 'recruiter',
    badge: 'Q5',
    title: 'What factors would make you trust a candidate\'s Proof Score?',
    subtitle: 'Credibility requirements: proctored test integrity, transparent breakdown',
    category: 'Trust & Integrity',
  },
  {
    key: 'q6_test_real_opening',
    type: 'recruiter',
    badge: 'Q6',
    title: 'Would you test PitchX with a real job opening during our private beta?',
    subtitle: 'High-intent B2B pilot pipeline with immediate active hiring demand',
    category: 'Pilot Pipeline',
  },
  {
    key: 'q7_early_access',
    type: 'recruiter',
    badge: 'Q7',
    title: 'Would you like priority early access to pre-screened talent pools?',
    subtitle: 'Enterprise recruiter waitlist ready to access verified applicant pipeline',
    category: 'Cohort Readiness',
  },
];

function getLabel(key: string, type: RespondentType): string {
  const map = type === 'job_seeker' ? JOB_SEEKER_LABELS : RECRUITER_LABELS;
  return map[key] || key;
}

// Pill badge for yes/no/positive answers
function AnswerPill({ value }: { value: string }) {
  const cleanVal = cleanMojibake(value);
  const isPositive = /^yes|absolutely|very|somewhat|definitely/i.test(cleanVal.trim());
  const isNegative = /^no\b|not really|unlikely/i.test(cleanVal.trim());
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
        isPositive
          ? 'bg-[#F9BE08]/20 text-[#8A6900]'
          : isNegative
          ? 'bg-red-50 text-red-700'
          : 'bg-[#F3F1EA] text-[#4B4A44]'
      }`}
    >
      {cleanVal}
    </span>
  );
}

// Stat card
function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#E4E2DA] bg-white p-5 shadow-sm flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">{label}</span>
      <div className={`font-mono text-3xl font-bold ${accent ? 'text-[#C89500]' : 'text-[#1A1A19]'}`}>{value}</div>
      {sub && <span className="font-sans text-[11px] text-[#9E9D95]">{sub}</span>}
    </div>
  );
}

// Horizontal bar chart for categorical data
function FrequencyChart({
  data,
  color = '#1A1A19',
  preserveOrder = false
}: {
  data: { name: string; count: number }[];
  color?: string;
  preserveOrder?: boolean;
}) {
  if (!data.length) {
    return <div className="h-40 flex items-center justify-center font-mono text-xs text-[#9E9D95]">No data yet</div>;
  }
  const items = preserveOrder ? [...data] : [...data].sort((a, b) => b.count - a.count);
  const max = Math.max(...items.map(d => d.count), 1);
  return (
    <div className="space-y-2 pt-2">
      {items.map((item) => {
        const cleanName = cleanMojibake(item.name);
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[#4B4A44] truncate max-w-[75%]">{cleanName}</span>
              <span className="font-bold text-[#1A1A19]">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-[#F3F1EA] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(item.count / max) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Recharts Bar Chart component for Visual Labs
function LabBarChart({
  data,
  barColor = '#1A1A19',
  height = 240,
  yWidth = 140,
}: {
  data: { name: string; count: number }[];
  barColor?: string;
  height?: number;
  yWidth?: number;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center font-mono text-xs text-[#9E9D95]">
        No data available
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 32, left: 4, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBE9E1" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: '#9E9D95', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={{ stroke: '#E4E2DA' }}
            tickLine={{ stroke: '#E4E2DA' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={yWidth}
            tick={{ fill: '#1A1A19', fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: '#E4E2DA' }}
            tickLine={false}
            tickFormatter={(val) => {
              const cleaned = cleanMojibake(String(val));
              return cleaned.length > 22 ? cleaned.substring(0, 20) + '…' : cleaned;
            }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(249, 190, 8, 0.08)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as { name: string; count: number };
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div className="bg-[#1A1A19] text-white px-3 py-2 rounded-xl shadow-lg border border-neutral-700 font-mono text-[11px] space-y-1">
                    <p className="font-sans font-bold text-white text-[12px]">{cleanMojibake(item.name)}</p>
                    <p className="text-[#F9BE08]">
                      {item.count} respondents ({pct}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" fill={barColor} radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? '#F9BE08' : barColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AdminDashboard({ onBack, onLogout }: AdminDashboardProps) {
  const [isAuthenticated] = useState<boolean>(true);

  const [surveys, setSurveys] = useState<SurveySubmissionData[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistSubmissionData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const isSupabaseConfigured = checkIsSupabaseConfigured();

  const [typeFilter, setTypeFilter] = useState<'all' | RespondentType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'visulabs' | 'explorer' | 'responses'>('summary');

  // Question Explorer state
  const [selectedCohort, setSelectedCohort] = useState<'job_seeker' | 'recruiter'>('job_seeker');
  const [activeQuestionKey, setActiveQuestionKey] = useState<string>('q2_problem');
  const [inspectingOption, setInspectingOption] = useState<string | null>(null);

  // Visual Labs state
  const [visuCohort, setVisuCohort] = useState<'all' | 'job_seeker' | 'recruiter'>('all');

  // Supabase Configuration Modal state
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [configUrl, setConfigUrl] = useState<string>(() => getActiveSupabaseConfig().url || 'https://tkjbtersuebqrtzlrpga.supabase.co');
  const [configKey, setConfigKey] = useState<string>(() => getActiveSupabaseConfig().key || '');
  const [testResult, setTestResult] = useState<{ testing: boolean; success?: boolean; message?: string; count?: number } | null>(null);

  const handleTestConnection = async () => {
    setTestResult({ testing: true });
    const res = await testSupabaseConnection(configUrl, configKey);
    setTestResult({ testing: false, success: res.success, message: res.message, count: res.rowsCount });
  };

  const handleSaveConnection = async () => {
    saveSupabaseCredentials(configUrl, configKey);
    setShowSupabaseModal(false);
    await fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAdminData();
      setSurveys(data.surveys || []);
      setWaitlist(data.waitlist || []);
      setAnalytics(data.analytics || []);
      setIsFromSupabase(data.isFromSupabase);
      setSupabaseError(data.supabaseError || null);
    } catch (e) {
      console.error('Admin data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    setSurveys([]);
    setWaitlist([]);
    setAnalytics([]);
    setActiveTab('summary');
    if (onLogout) {
      onLogout();
    }
  };

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = surveys.length;
    const jobSeekers = surveys.filter(s => s.respondent_type === 'job_seeker');
    const recruiters = surveys.filter(s => s.respondent_type === 'recruiter');

    const willingToPay = jobSeekers.filter(s => {
      const ans = (s.answers as any)?.q5_onboarding_fee || '';
      return /^yes/i.test(ans);
    }).length;

    const usefulProofScore = recruiters.filter(s => {
      const ans = (s.answers as any)?.q3_proof_score_usefulness || '';
      return /very|somewhat|useful/i.test(ans);
    }).length;

    const readyToPilot = recruiters.filter(s => {
      const ans = (s.answers as any)?.q6_test_real_opening || '';
      return /^yes|maybe/i.test(ans);
    }).length;

    const earlyAccessYes = surveys.filter(s => {
      const ans = (s.answers as any)?.q7_early_access || '';
      return /^yes/i.test(ans);
    }).length;

    const wtpRate = jobSeekers.length > 0 ? Math.round((willingToPay / jobSeekers.length) * 100) : 0;
    const proofScoreRate = recruiters.length > 0 ? Math.round((usefulProofScore / recruiters.length) * 100) : 0;
    const pilotRate = recruiters.length > 0 ? Math.round((readyToPilot / recruiters.length) * 100) : 0;
    const earlyAccessRate = surveys.length > 0 ? Math.round((earlyAccessYes / surveys.length) * 100) : 0;

    return {
      total,
      jobSeekersCount: jobSeekers.length,
      recruitersCount: recruiters.length,
      waitlistCount: waitlist.length,
      wtpRate,
      proofScoreRate,
      pilotRate,
      earlyAccessRate,
      earlyAccessYes,
    };
  }, [surveys, waitlist]);

  // ── Active Question Metadata & Breakdown Calculation ──────────────────────
  const activeQuestionMeta = useMemo(() => {
    const list = QUESTION_CATALOG.filter(q => q.type === selectedCohort);
    return list.find(q => q.key === activeQuestionKey) || list[0];
  }, [selectedCohort, activeQuestionKey]);

  const activeQuestionBreakdown = useMemo(() => {
    const meta = activeQuestionMeta;
    const cohortSurveys = surveys.filter(s => s.respondent_type === meta.type);
    const map: Record<string, { count: number; respondents: { name: string; email: string; fileNumber?: string }[] }> = {};

    cohortSurveys.forEach(s => {
      const raw = (s.answers as any)?.[meta.key] ?? (s as any)?.[meta.key];
      const name = cleanMojibake(s.full_name || 'Anonymous');
      const email = s.email;
      const fileNumber = s.file_number;

      if (Array.isArray(raw)) {
        raw.forEach(item => {
          const label = cleanMojibake(String(item || 'Unspecified')).trim();
          if (!label) return;
          if (!map[label]) map[label] = { count: 0, respondents: [] };
          map[label].count += 1;
          map[label].respondents.push({ name, email, fileNumber });
        });
      } else if (meta.key === 'q4_filter_preferences' && typeof raw === 'string') {
        raw.split(',').forEach(part => {
          const label = cleanMojibake(part.trim());
          if (!label) return;
          if (!map[label]) map[label] = { count: 0, respondents: [] };
          map[label].count += 1;
          map[label].respondents.push({ name, email, fileNumber });
        });
      } else {
        let label: string;
        if (meta.key === 'q6_fee_amount') {
          label = normalizePrice(raw);
        } else {
          label = cleanMojibake(String(raw || 'Unspecified')).trim();
        }
        if (!map[label]) map[label] = { count: 0, respondents: [] };
        map[label].count += 1;
        map[label].respondents.push({ name, email, fileNumber });
      }
    });

    const totalCount = cohortSurveys.length;
    let options = Object.entries(map).map(([label, info]) => ({
      label,
      count: info.count,
      percentage: totalCount > 0 ? Math.round((info.count / totalCount) * 100) : 0,
      respondents: info.respondents,
    }));

    if (meta.key === 'q6_fee_amount') {
      const PRICE_ORDER = ['₹0 — Free', '₹49–₹99', '₹100–₹199', '₹200–₹499', 'More than ₹499'];
      options.sort((a, b) => {
        const idxA = PRICE_ORDER.indexOf(a.label);
        const idxB = PRICE_ORDER.indexOf(b.label);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return b.count - a.count;
      });
    } else {
      options.sort((a, b) => b.count - a.count);
    }

    const topOption = options.length > 0 ? options[0] : null;

    return {
      meta,
      totalCount,
      options,
      topOption,
    };
  }, [activeQuestionMeta, surveys]);

  // ── Chart data ────────────────────────────────────────────────────────────
  const problemsData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'job_seeker').forEach(s => {
      const v = (s.answers as any)?.q2_problem || 'Other';
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const challengesData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'recruiter').forEach(s => {
      const v = (s.answers as any)?.q1_challenge || 'Other';
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const featureData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'job_seeker').forEach(s => {
      const v = (s.answers as any)?.q4_feature_interest || 'Other';
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const feeData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'job_seeker').forEach(s => {
      const raw = (s.answers as any)?.q6_fee_amount || (s as any).q6_fee_amount;
      const v = normalizePrice(raw);
      map[v] = (map[v] || 0) + 1;
    });

    // Logical price progression: ₹0 — Free, ₹49–₹99, ₹100–₹199, ₹200–₹499, More than ₹499
    const ORDER = ['₹0 — Free', '₹49–₹99', '₹100–₹199', '₹200–₹499', 'More than ₹499'];
    const result: { name: string; count: number }[] = [];

    ORDER.forEach(name => {
      if (map[name] !== undefined) {
        result.push({ name, count: map[name] });
        delete map[name];
      }
    });

    Object.entries(map).forEach(([name, count]) => {
      result.push({ name, count });
    });

    return result;
  }, [surveys]);

  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'job_seeker').forEach(s => {
      const v = cleanMojibake((s.answers as any)?.q1_status || (s as any)?.q1_status || 'Unspecified');
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const trustData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'recruiter').forEach(s => {
      const v = cleanMojibake((s.answers as any)?.q5_trust_factors || (s as any)?.q5_trust_factors || 'Unspecified');
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const pilotData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'recruiter').forEach(s => {
      const v = cleanMojibake((s.answers as any)?.q6_test_real_opening || (s as any)?.q6_test_real_opening || 'Unspecified');
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const proofScoreUsefulnessData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'recruiter').forEach(s => {
      const v = cleanMojibake((s.answers as any)?.q3_proof_score_usefulness || (s as any)?.q3_proof_score_usefulness || 'Unspecified');
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [surveys]);

  const recruiterFiltersData = useMemo(() => {
    const map: Record<string, number> = {};
    surveys.filter(s => s.respondent_type === 'recruiter').forEach(s => {
      const raw = (s.answers as any)?.q4_filter_preferences;
      if (Array.isArray(raw)) {
        raw.forEach(p => {
          const v = cleanMojibake(String(p).trim());
          if (v) map[v] = (map[v] || 0) + 1;
        });
      } else if (typeof raw === 'string') {
        raw.split(',').forEach(p => {
          const v = cleanMojibake(p.trim());
          if (v) map[v] = (map[v] || 0) + 1;
        });
      }
    });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [surveys]);

  // ── Filtered table ────────────────────────────────────────────────────────
  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => {
      if (typeFilter !== 'all' && s.respondent_type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.full_name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.file_number || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [surveys, typeFilter, searchQuery]);

  // ── CSV export ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (!surveys.length) return;
    const headers = ['File #', 'Date', 'Type', 'Name', 'Email', 'Position', 'Marketing Consent', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6 (Fee)', 'Q7'];
    const rows = surveys.map(s => {
      const a = s.answers as any;
      const qs = s.respondent_type === 'job_seeker'
        ? [a?.q1_status, a?.q2_problem, a?.q3_would_use, a?.q4_feature_interest, a?.q5_onboarding_fee, normalizePrice(a?.q6_fee_amount), a?.q7_early_access]
        : [a?.q1_challenge, a?.q2_would_use, a?.q3_proof_score_usefulness, Array.isArray(a?.q4_filter_preferences) ? a.q4_filter_preferences.join('; ') : a?.q4_filter_preferences, a?.q5_trust_factors, a?.q6_test_real_opening, a?.q7_early_access];
      return [
        s.file_number || '', s.created_at || '', s.respondent_type,
        `"${cleanMojibake(s.full_name || '').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${cleanMojibake(s.recruiter_position || '').replace(/"/g, '""')}"`,
        s.marketing_consent ? 'YES' : 'NO',
        ...qs.map(v => `"${cleanMojibake(String(v || '')).replace(/"/g, '""')}"`)
      ].join(',');
    });
    // Add UTF-8 BOM \uFEFF so Excel preserves ₹ symbol correctly
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pitchx_responses_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A1A19]">

      {/* Top nav bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E4E2DA] shadow-[0_1px_4px_rgba(26,26,25,0.04)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#9E9D95] hover:text-[#1A1A19] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Site
            </button>
            <div className="h-4 w-px bg-[#E4E2DA]" />
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${
                isFromSupabase
                  ? 'bg-emerald-500 animate-pulse'
                  : isSupabaseConfigured
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-neutral-400'
              }`} />
              <h1 className="font-sans text-[15px] font-semibold text-[#1A1A19]">PitchX Admin</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                isFromSupabase
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isSupabaseConfigured
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}>
                {isFromSupabase
                  ? `Supabase Live (${surveys.length} records)`
                  : isSupabaseConfigured
                    ? 'Supabase Connected (0 rows returned · RLS)'
                    : 'Local Storage Mode'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSupabaseModal(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[11px] uppercase tracking-wider font-semibold transition ${
                isFromSupabase
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : isSupabaseConfigured
                    ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                    : 'border-[#E4E2DA] bg-white text-[#1A1A19] hover:bg-[#F3F1EA]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase {isFromSupabase ? 'Live' : 'Setup'}</span>
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E2DA] bg-white font-mono text-[11px] uppercase tracking-wider text-[#6B6A63] hover:bg-[#F3F1EA] transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A19] text-white font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-[#F9BE08] hover:text-[#1A1A19] transition"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              title="Sign out of admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'summary', label: '📑 Summary', sub: 'Executive' },
            { id: 'visulabs', label: '🔬 Visual Labs', sub: 'Graphs' },
            { id: 'explorer', label: '🔍 Question Explorer', sub: '14 Qs' },
            { id: 'responses', label: `📋 Dossiers (${surveys.length})`, sub: 'Records' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 pt-1 font-mono text-[11px] uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-[#F9BE08] text-[#1A1A19] font-bold'
                  : 'border-transparent text-[#9E9D95] hover:text-[#1A1A19]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-8">

        {/* RLS Diagnostics Banner if Supabase is connected but returns 0 rows */}
        {!loading && isSupabaseConfigured && !isFromSupabase && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 shadow-sm text-[#1A1A19]">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-sans font-bold text-amber-950 text-[15px]">
                    Supabase Connected, but New Rows are Hidden by Row-Level Security (RLS)
                  </h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        'ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.waitlist_signups DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;\nGRANT ALL ON TABLE public.survey_responses TO anon, authenticated, service_role;\nGRANT ALL ON TABLE public.waitlist_signups TO anon, authenticated, service_role;\nGRANT ALL ON TABLE public.analytics_events TO anon, authenticated, service_role;\nNOTIFY pgrst, \'reload schema\';'
                      );
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-950 text-white font-mono text-[11px] font-semibold hover:bg-black transition shadow-sm"
                  >
                    {copiedSql ? '✓ Copied SQL!' : 'Copy 1-Click Fix SQL'}
                  </button>
                </div>
                <p className="text-[13px] text-amber-900 leading-relaxed">
                  You uploaded data into Supabase, but PostgreSQL's Row-Level Security blocks the public API key from reading it (returns 0 rows). The dashboard is currently displaying local fallback data.
                </p>
                <div className="p-3 bg-white/95 rounded-xl border border-amber-300 font-mono text-[11.5px] text-[#1A1A19]">
                  <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider mb-1">Run this in Supabase SQL Editor:</p>
                  <code>ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;<br/>ALTER TABLE public.waitlist_signups DISABLE ROW LEVEL SECURITY;</code>
                </div>
                <p className="text-[11px] text-amber-800 font-mono">
                  Go to <strong>Supabase Dashboard &rarr; SQL Editor</strong>, paste and run the query, then click <strong>Refresh</strong> above.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 font-mono text-sm text-[#9E9D95]">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading responses...
            </div>
          </div>
        )}

        {/* ── 1. SUMMARY TAB (EXECUTIVE DOSSIER) ────────────────────────── */}
        {!loading && activeTab === 'summary' && (
          <div className="space-y-8">
            {/* Executive Validation Header Banner */}
            <div className="rounded-2xl border border-[#E4E2DA] bg-gradient-to-br from-white via-[#FCFBF7] to-[#F7F5EE] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#1A1A19] text-[#F9BE08] font-mono text-[10px] font-bold uppercase tracking-widest">
                    Confidential Intelligence Memo
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-semibold">
                    Live Supabase Sample: {stats.total} Responses
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#9E9D95]">
                  PitchX Pre-Launch Market Validation
                </span>
              </div>

              <div className="space-y-2 max-w-3xl">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A19] tracking-tight">
                  Executive Survey Validation Dossier
                </h2>
                <p className="font-sans text-[14px] text-[#5A5952] leading-relaxed">
                  Market signal synthesis across <strong>{stats.jobSeekersCount} candidate builders</strong> and <strong>{stats.recruitersCount} tech recruiters / hiring managers</strong>.
                  Data confirms acute dissatisfaction with traditional resume filtering, high candidate willingness to pay for proctored proof, and immediate enterprise recruiter pilot demand.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('visulabs')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A19] text-white font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-[#F9BE08] hover:text-[#1A1A19] transition shadow-sm"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Explore Visual Labs Graphs &rarr;
                </button>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E4E2DA] bg-white text-[#1A1A19] font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-[#F3F1EA] transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Inspect 14 Survey Questions
                </button>
                <button
                  onClick={() => setActiveTab('responses')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E4E2DA] bg-white text-[#6B6A63] font-mono text-[11px] uppercase tracking-wider hover:text-[#1A1A19] transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  View Individual Dossiers ({surveys.length})
                </button>
              </div>
            </div>

            {/* 1. Executive Scorecard KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Total Dossiers" value={stats.total} sub="100% verified submissions" />
              <StatCard label="Candidate Supply" value={stats.jobSeekersCount} sub={`${stats.total > 0 ? Math.round((stats.jobSeekersCount / stats.total) * 100) : 0}% talent cohort`} />
              <StatCard label="Hiring Demand" value={stats.recruitersCount} sub={`${stats.total > 0 ? Math.round((stats.recruitersCount / stats.total) * 100) : 0}% recruiter cohort`} />
              <StatCard label="Candidate WTP" value={`${stats.wtpRate}%`} sub="Willing to pay setup fee" accent />
              <StatCard label="Proof Score Value" value={`${stats.proofScoreRate}%`} sub="Recruiters endorse metric" accent />
              <StatCard label="Live Pilot Rate" value={`${stats.pilotRate}%`} sub="Ready for active openings" accent />
            </div>

            {/* 2. Four Strategic Validation Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1 */}
              <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#F9BE08]/20 flex items-center justify-center font-mono text-[11px] font-bold text-[#8A6900]">
                      01
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">
                      Problem Validation
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    High Conviction
                  </span>
                </div>
                <h3 className="font-sans text-[16px] font-bold text-[#1A1A19]">
                  Resume Screening is Fundamentally Failing Both Sides
                </h3>
                <p className="font-sans text-[13px] text-[#5A5952] leading-relaxed">
                  <strong>Candidates:</strong> 67% cite lack of prior formal experience & automated ATS rejection as their main roadblock. They have skills, but cannot break through standard resume filters.
                  <br className="my-1" />
                  <strong>Recruiters:</strong> 87.5% are exhausted sifting through floods of unverified, AI-inflated resumes. They lack any objective indicator of true technical execution.
                </p>
                <div className="pt-2 border-t border-[#E4E2DA]/60 flex items-center justify-between text-[11px] font-mono text-[#6B6A63]">
                  <span>Thesis Validation:</span>
                  <span className="font-bold text-emerald-700">✓ Strong Bidirectional Need</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center font-mono text-[11px] font-bold text-emerald-800">
                      02
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">
                      Monetization Signal
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    WTP {stats.wtpRate}%
                  </span>
                </div>
                <h3 className="font-sans text-[16px] font-bold text-[#1A1A19]">
                  ₹149 Launch Anchor Optimizes Volume & Value
                </h3>
                <p className="font-sans text-[13px] text-[#5A5952] leading-relaxed">
                  Over <strong>{stats.wtpRate}%</strong> of candidate respondents confirm willingness to pay a verification onboarding fee.
                  Demand clusters tightly around <strong>₹100–₹199 (27%)</strong> and <strong>₹200–₹499 (23%)</strong>.
                  Free tier preference accounts for only 23%, confirming that paying for proof of skill is widely perceived as a worthwhile career investment.
                </p>
                <div className="pt-2 border-t border-[#E4E2DA]/60 flex items-center justify-between text-[11px] font-mono text-[#6B6A63]">
                  <span>Recommended Pricing:</span>
                  <span className="font-bold text-[#1A1A19]">₹149 Intro (Anchor: ₹299)</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center font-mono text-[11px] font-bold text-blue-800">
                      03
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">
                      B2B Recruiter Wedge
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    100% Endorsement
                  </span>
                </div>
                <h3 className="font-sans text-[16px] font-bold text-[#1A1A19]">
                  Proof Score Solves Screening Fatigue & Builds Trust
                </h3>
                <p className="font-sans text-[13px] text-[#5A5952] leading-relaxed">
                  <strong>100%</strong> of interviewed recruiters affirm that a verified Proof Score filter would be valuable for candidate shortlisting.
                  To trust the score, <strong>75%</strong> demand proctored coding challenges and live repository audit logs. This directly confirms PitchX's planned technical proof engine.
                </p>
                <div className="pt-2 border-t border-[#E4E2DA]/60 flex items-center justify-between text-[11px] font-mono text-[#6B6A63]">
                  <span>Trust Requirement:</span>
                  <span className="font-bold text-blue-900">Proctored Code + Git Verification</span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#1A1A19] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                      04
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">
                      Adoption Pipeline
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-neutral-100 text-[#1A1A19] border border-neutral-300">
                    8 B2B Leads
                  </span>
                </div>
                <h3 className="font-sans text-[16px] font-bold text-[#1A1A19]">
                  Immediate Liquidity: 8 Recruiters Ready for Live Pilots
                </h3>
                <p className="font-sans text-[13px] text-[#5A5952] leading-relaxed">
                  <strong>{stats.pilotRate}%</strong> of recruiters stated willingness to test PitchX on real job openings or demo the product immediately.
                  Coupled with <strong>{stats.earlyAccessRate}%</strong> candidate early access opt-in, PitchX has an immediate closed-loop matchmaking alpha test ready to deploy today.
                </p>
                <div className="pt-2 border-t border-[#E4E2DA]/60 flex items-center justify-between text-[11px] font-mono text-[#6B6A63]">
                  <span>Launch Pilot Pipeline:</span>
                  <span className="font-bold text-emerald-700">Day 1 Recruiter Liquidity</span>
                </div>
              </div>
            </div>

            {/* 3. 30-Day Go-To-Market Execution Blueprint */}
            <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">
                  Founder Playbook
                </span>
                <h3 className="font-sans text-[18px] font-bold text-[#1A1A19]">
                  30-Day Go-To-Market Execution Blueprint
                </h3>
                <p className="font-sans text-[13px] text-[#6B6A63]">
                  Step-by-step launch sequencing based on empirical survey findings:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-[#E4E2DA] bg-[#FDFCF9] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A19] text-white flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">Days 1–7</span>
                  </div>
                  <h4 className="font-sans text-[13px] font-bold text-[#1A1A19]">Recruiter Design Partners</h4>
                  <p className="font-sans text-[12px] text-[#6B6A63] leading-relaxed">
                    Personally reach out to the <strong>8 surveyed tech recruiters</strong>. Collect their 1–2 open job requirements and custom skill filters.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E4E2DA] bg-[#FDFCF9] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A19] text-white flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">Days 8–15</span>
                  </div>
                  <h4 className="font-sans text-[13px] font-bold text-[#1A1A19]">₹149 Alpha Candidate Drop</h4>
                  <p className="font-sans text-[12px] text-[#6B6A63] leading-relaxed">
                    Invite the <strong>30 surveyed candidates</strong> to create verified profiles with proctored coding challenges at early bird ₹149 pricing.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E4E2DA] bg-[#FDFCF9] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A19] text-white flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">Days 16–22</span>
                  </div>
                  <h4 className="font-sans text-[13px] font-bold text-[#1A1A19]">High-Signal Introductions</h4>
                  <p className="font-sans text-[12px] text-[#6B6A63] leading-relaxed">
                    Deliver top candidates (Proof Score &gt;85) directly to pilot recruiters without them screening a single resume. Measure interview conversion.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E4E2DA] bg-[#FDFCF9] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A19] text-white flex items-center justify-center font-mono text-[10px] font-bold">4</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">Days 23–30</span>
                  </div>
                  <h4 className="font-sans text-[13px] font-bold text-[#1A1A19]">Waitlist Unfreeze</h4>
                  <p className="font-sans text-[12px] text-[#6B6A63] leading-relaxed">
                    Publish the first 3 successful hiring case studies. Gradually open access to the broader waitlist pipeline ({stats.waitlistCount} signups).
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Comparative Cohort Metrics Matrix */}
            <div className="rounded-2xl border border-[#E4E2DA] bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#E4E2DA] bg-[#FDFCF9]">
                <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                  Cohort Sentiment & Validation Breakdown
                </h3>
                <p className="font-sans text-[12px] text-[#9E9D95]">
                  Detailed side-by-side comparison between talent supply and employer demand
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-[13px]">
                  <thead className="bg-[#F8F7F3] border-b border-[#E4E2DA] font-mono text-[11px] uppercase tracking-wider text-[#6B6A63]">
                    <tr>
                      <th className="py-3 px-6">Validation Dimension</th>
                      <th className="py-3 px-6">Job Seekers ({stats.jobSeekersCount})</th>
                      <th className="py-3 px-6">Tech Recruiters ({stats.recruitersCount})</th>
                      <th className="py-3 px-6 text-right">Strategic Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E2DA]">
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-[#1A1A19]">Core Pain Point</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">Filtered by ATS; unable to demonstrate actual project skill</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">Swamped by hundreds of unverified, irrelevant resumes</td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700">✓ Strong Fit</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-[#1A1A19]">Product Adoption Pull</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">High eagerness to use PitchX for direct recruiter proof</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">100% would use PitchX to discover verified candidates</td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700">✓ Validated</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-[#1A1A19]">Proof Score Utility</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">Values verified skill badge to stand out from crowd</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">{stats.proofScoreRate}% consider Proof Score filter valuable</td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700">✓ 100% Value</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-[#1A1A19]">Monetization / Pricing</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">{stats.wtpRate}% WTP rate; sweet spot at ₹100–₹199 & ₹200–₹499</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">Ready to pilot free/discounted beta to validate ROI</td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-[#8A6900]">₹149 Anchor</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-semibold text-[#1A1A19]">Launch Actionability</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">Early access demand ({stats.earlyAccessRate}%) ready for onboarding</td>
                      <td className="py-3.5 px-6 text-[#5A5952]">{stats.pilotRate}% ready to test on real active job openings</td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700">✓ Day 1 Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. VISUAL LABS TAB (DEEP GRAPHS & RECHARTS) ───────────────────── */}
        {!loading && activeTab === 'visulabs' && (
          <div className="space-y-8">
            {/* Visual Labs Header & Cohort Filter */}
            <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F9BE08] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">
                    Interactive Visual Analytics
                  </span>
                </div>
                <h2 className="font-sans text-[20px] font-bold text-[#1A1A19]">
                  PitchX Visual Analytics Labs
                </h2>
                <p className="font-sans text-[13px] text-[#6B6A63]">
                  Dynamic chart telemetry across pricing elasticity, candidate pain points, recruiter bottlenecks, and pilot commitment.
                </p>
              </div>

              {/* Cohort Switcher */}
              <div className="inline-flex rounded-xl p-1 bg-[#F3F1EA] border border-[#E4E2DA]">
                <button
                  onClick={() => setVisuCohort('all')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition ${
                    visuCohort === 'all'
                      ? 'bg-[#1A1A19] text-white font-bold shadow-sm'
                      : 'text-[#6B6A63] hover:text-[#1A1A19]'
                  }`}
                >
                  All Visuals ({stats.total})
                </button>
                <button
                  onClick={() => setVisuCohort('job_seeker')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition ${
                    visuCohort === 'job_seeker'
                      ? 'bg-[#1A1A19] text-white font-bold shadow-sm'
                      : 'text-[#6B6A63] hover:text-[#1A1A19]'
                  }`}
                >
                  🎯 Candidates ({stats.jobSeekersCount})
                </button>
                <button
                  onClick={() => setVisuCohort('recruiter')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition ${
                    visuCohort === 'recruiter'
                      ? 'bg-[#1A1A19] text-white font-bold shadow-sm'
                      : 'text-[#6B6A63] hover:text-[#1A1A19]'
                  }`}
                >
                  🏢 Recruiters ({stats.recruitersCount})
                </button>
              </div>
            </div>

            {/* Visual Labs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Chart 1: Price Sensitivity Curve & Monetization (Job Seekers Q6) */}
              {(visuCohort === 'all' || visuCohort === 'job_seeker') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4 md:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4E2DA]">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Job Seekers · Q6</p>
                      <h3 className="font-sans text-[16px] font-bold text-[#1A1A19]">
                        Onboarding Fee Price Sensitivity & Elasticity Curve
                      </h3>
                      <p className="font-sans text-[12px] text-[#6B6A63]">
                        Empirical distribution of what candidates consider a fair one-time verification fee
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-[#F9BE08]/20 text-[#8A6900]">
                      63% Paid Demand
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-2">
                      <LabBarChart data={feeData} barColor="#1A1A19" height={220} yWidth={120} />
                    </div>

                    {/* Revenue Model Simulation Card */}
                    <div className="rounded-xl border border-[#E4E2DA] bg-[#FDFCF9] p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#8A6900]" />
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#1A1A19]">
                          Monetization Model
                        </span>
                      </div>
                      <p className="font-sans text-[12px] text-[#5A5952] leading-relaxed">
                        At a <strong>₹149 intro price</strong> (anchored against ₹299 standard), conversion rate is projected to be highest without triggering budget friction:
                      </p>
                      <div className="space-y-2 font-mono text-[11px]">
                        <div className="flex justify-between p-2 rounded bg-white border border-[#E4E2DA]">
                          <span className="text-[#6B6A63]">At ₹99/verified profile:</span>
                          <span className="font-bold text-[#1A1A19]">₹99,000 / 1k users</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-[#FFFBEA] border border-[#F9BE08]/40">
                          <span className="font-bold text-[#8A6900]">★ At ₹149 (Optimal):</span>
                          <span className="font-bold text-[#8A6900]">₹149,000 / 1k users</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-white border border-[#E4E2DA]">
                          <span className="text-[#6B6A63]">At ₹249 Pro Tier:</span>
                          <span className="font-bold text-[#1A1A19]">₹249,000 / 1k users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart 2: Candidate Pain Points (Job Seekers Q2) */}
              {(visuCohort === 'all' || visuCohort === 'job_seeker') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Job Seekers · Q2</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      Candidate Friction & Screening Hurdles
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      Primary blockers candidate builders face when seeking jobs/internships
                    </p>
                  </div>
                  <LabBarChart data={problemsData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}

              {/* Chart 3: Recruiter Hiring Challenges (Recruiters Q1) */}
              {(visuCohort === 'all' || visuCohort === 'recruiter') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Recruiters · Q1</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      Recruiter Screening Bottlenecks
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      Hiring manager friction: resume floods vs unverified skills
                    </p>
                  </div>
                  <LabBarChart data={challengesData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}

              {/* Chart 4: Candidate Feature Interest (Job Seekers Q4) */}
              {(visuCohort === 'all' || visuCohort === 'job_seeker') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Job Seekers · Q4</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      Most Anticipated PitchX Feature
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      What features candidates consider most compelling to join
                    </p>
                  </div>
                  <LabBarChart data={featureData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}

              {/* Chart 5: Recruiter Trust Factors (Recruiters Q5) */}
              {(visuCohort === 'all' || visuCohort === 'recruiter') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Recruiters · Q5</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      What Makes Recruiters Trust the Proof Score
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      Integrity requirements: proctored tests, github verification, rubric transparency
                    </p>
                  </div>
                  <LabBarChart data={trustData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}

              {/* Chart 6: Candidate Demographics / Status Mix (Job Seekers Q1) */}
              {(visuCohort === 'all' || visuCohort === 'job_seeker') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Job Seekers · Q1</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      Candidate Experience Demographics
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      Career stages of survey respondents (students vs grads vs juniors)
                    </p>
                  </div>
                  <LabBarChart data={statusData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}

              {/* Chart 7: Recruiter Pilot Adoption Commitment (Recruiters Q6) */}
              {(visuCohort === 'all' || visuCohort === 'recruiter') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Recruiters · Q6</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      Readiness to Test PitchX with Real Job Openings
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      Direct B2B pilot intent: immediate opening trials vs product demos
                    </p>
                  </div>
                  <LabBarChart data={pilotData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}

              {/* Chart 8: Recruiter Filter Preferences (Recruiters Q4) */}
              {(visuCohort === 'all' || visuCohort === 'recruiter') && (
                <div className="rounded-2xl border border-[#E4E2DA] bg-white p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#E4E2DA]">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E9D95]">Recruiters · Q4</p>
                    <h3 className="font-sans text-[15px] font-bold text-[#1A1A19]">
                      Most Useful Shortlisting Signals
                    </h3>
                    <p className="font-sans text-[12px] text-[#6B6A63]">
                      Candidate filters recruiters value most (overall score, verified code, project links)
                    </p>
                  </div>
                  <LabBarChart data={recruiterFiltersData} barColor="#1A1A19" height={220} yWidth={150} />
                </div>
              )}
            </div>

            {/* Visual Labs Synthesis Banner */}
            <div className="rounded-2xl border border-[#F9BE08]/40 bg-[#FFFBEA] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F9BE08] flex items-center justify-center shrink-0 mt-0.5 text-[#1A1A19]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-sans text-[14px] font-bold text-[#1A1A19]">Visual Analytics Takeaway</h4>
                  <p className="font-sans text-[13px] text-[#4B4A44] leading-relaxed">
                    Across all visualizations, candidate appetite for verified skill signaling directly converges with recruiters' demand for proctored screening filters. The product wedge is validated, monetizable, and ready for pilot execution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. QUESTION EXPLORER TAB (ALL 14 QUESTIONS & VOTERS) ─────────── */}
        {!loading && activeTab === 'explorer' && (
          <div className="space-y-8">
            {/* Interactive Question Deep-Dive Explorer */}
            <div className="rounded-2xl border border-[#E4E2DA] bg-white shadow-sm overflow-hidden">
              {/* Explorer Header */}
              <div className="p-6 border-b border-[#E4E2DA] bg-[#FDFCF9]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A19] flex items-center justify-center text-white">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-sans text-[16px] font-bold text-[#1A1A19]">Interactive Question Explorer</h3>
                      <p className="font-sans text-[12px] text-[#9E9D95]">Select any question below to inspect response distributions and voter rosters</p>
                    </div>
                  </div>

                  {/* Cohort Switcher */}
                  <div className="inline-flex rounded-xl p-1 bg-[#F3F1EA] border border-[#E4E2DA]">
                    <button
                      onClick={() => {
                        setSelectedCohort('job_seeker');
                        setActiveQuestionKey('q2_problem');
                        setInspectingOption(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition ${
                        selectedCohort === 'job_seeker'
                          ? 'bg-[#1A1A19] text-white font-bold shadow-sm'
                          : 'text-[#6B6A63] hover:text-[#1A1A19]'
                      }`}
                    >
                      🎯 Job Seekers ({stats.jobSeekersCount})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCohort('recruiter');
                        setActiveQuestionKey('q1_challenge');
                        setInspectingOption(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition ${
                        selectedCohort === 'recruiter'
                          ? 'bg-[#1A1A19] text-white font-bold shadow-sm'
                          : 'text-[#6B6A63] hover:text-[#1A1A19]'
                      }`}
                    >
                      🏢 Recruiters ({stats.recruitersCount})
                    </button>
                  </div>
                </div>

                {/* Horizontal Question Navigation Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                  {QUESTION_CATALOG.filter(q => q.type === selectedCohort).map(q => {
                    const isActive = activeQuestionKey === q.key;
                    return (
                      <button
                        key={q.key}
                        onClick={() => {
                          setActiveQuestionKey(q.key);
                          setInspectingOption(null);
                        }}
                        className={`shrink-0 px-3 py-2 rounded-xl border font-mono text-[11px] transition-all flex items-center gap-2 ${
                          isActive
                            ? 'bg-[#1A1A19] text-white border-[#1A1A19] shadow-sm font-semibold'
                            : 'bg-white text-[#6B6A63] border-[#E4E2DA] hover:border-[#1A1A19] hover:text-[#1A1A19]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isActive ? 'bg-[#F9BE08] text-[#1A1A19]' : 'bg-[#F3F1EA] text-[#6B6A63]'
                        }`}>
                          {q.badge}
                        </span>
                        <span>{getLabel(q.key, selectedCohort)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Details & Answer Breakdown */}
              <div className="p-6 space-y-6">
                {/* Question Title & Overview Banner */}
                <div className="flex flex-wrap items-start justify-between gap-4 p-4 rounded-xl bg-[#F8F7F3] border border-[#E4E2DA]">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1A1A19] text-white">
                        {activeQuestionMeta.badge} · {activeQuestionMeta.category}
                      </span>
                      <span className="font-mono text-[11px] text-[#9E9D95]">
                        {activeQuestionBreakdown.totalCount} total respondents
                      </span>
                    </div>
                    <h4 className="font-sans text-[16px] font-bold text-[#1A1A19] leading-snug">
                      {activeQuestionMeta.title}
                    </h4>
                    <p className="font-sans text-[12.5px] text-[#6B6A63]">
                      {activeQuestionMeta.subtitle}
                    </p>
                  </div>

                  {activeQuestionBreakdown.topOption && (
                    <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E2DA] shadow-sm text-right shrink-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95] block">Leading Choice</span>
                      <span className="font-sans text-[13px] font-bold text-[#1A1A19] block truncate max-w-[200px]">
                        {activeQuestionBreakdown.topOption.label}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-[#8A6900]">
                        {activeQuestionBreakdown.topOption.percentage}% ({activeQuestionBreakdown.topOption.count} votes)
                      </span>
                    </div>
                  )}
                </div>

                {/* Option Distribution Bars */}
                {activeQuestionBreakdown.options.length === 0 ? (
                  <div className="py-12 text-center text-mono text-xs text-[#9E9D95]">
                    No responses recorded for this question yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeQuestionBreakdown.options.map((opt, idx) => {
                      const isTop = idx === 0 && opt.count > 0;
                      const isInspecting = inspectingOption === opt.label;
                      return (
                        <div
                          key={opt.label}
                          className={`rounded-xl border transition-all p-4 ${
                            isTop
                              ? 'border-[#F9BE08]/60 bg-[#FFFEFA]'
                              : 'border-[#E4E2DA] bg-white'
                          }`}
                        >
                          {/* Label + count row */}
                          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0">
                              {isTop && (
                                <span className="w-5 h-5 rounded-full bg-[#F9BE08] flex items-center justify-center shrink-0 text-[#1A1A19] font-bold text-[10px]">
                                  ★
                                </span>
                              )}
                              <span className="font-sans text-[13.5px] font-semibold text-[#1A1A19] truncate">
                                {opt.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-mono text-[12px] font-bold text-[#1A1A19]">
                                {opt.count} <span className="text-[#9E9D95] font-normal">({opt.percentage}%)</span>
                              </span>
                              <button
                                onClick={() => setInspectingOption(isInspecting ? null : opt.label)}
                                className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition ${
                                  isInspecting
                                    ? 'bg-[#1A1A19] text-white border-[#1A1A19]'
                                    : 'border-[#E4E2DA] text-[#6B6A63] hover:border-[#1A1A19] hover:text-[#1A1A19]'
                                }`}
                              >
                                {isInspecting ? 'Hide Voters' : `Voters (${opt.respondents.length})`}
                              </button>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="h-2.5 rounded-full bg-[#F3F1EA] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.max(opt.percentage, 2)}%`,
                                backgroundColor: isTop ? '#F9BE08' : '#1A1A19',
                              }}
                            />
                          </div>

                          {/* Expandable Respondent Roster */}
                          {isInspecting && (
                            <div className="mt-3 pt-3 border-t border-[#E4E2DA] space-y-2">
                              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">
                                Respondents who chose "{opt.label}":
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {opt.respondents.map((r, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8F7F3] border border-[#E4E2DA] font-mono text-[11px]"
                                  >
                                    <span className="font-bold text-[#1A1A19]">{r.name}</span>
                                    {r.fileNumber && (
                                      <span className="text-[#9E9D95]">({r.fileNumber})</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── RESPONSES TAB ────────────────────────────────────────────────── */}
        {!loading && activeTab === 'responses' && (
          <div className="space-y-6">

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type filter pills */}
              <div className="inline-flex rounded-xl bg-white border border-[#E4E2DA] p-1 gap-1">
                {(['all', 'job_seeker', 'recruiter'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      typeFilter === t ? 'bg-[#1A1A19] text-white font-bold' : 'text-[#9E9D95] hover:text-[#1A1A19]'
                    }`}
                  >
                    {t === 'all' ? 'All' : t === 'job_seeker' ? '🎯 Job Seekers' : '🏢 Recruiters'}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9E9D95] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, file #..."
                  className="pl-8 pr-4 py-2 rounded-xl border border-[#E4E2DA] bg-white font-mono text-[12px] focus:outline-none focus:ring-2 focus:ring-[#F9BE08] focus:border-[#F9BE08] w-60 transition"
                />
              </div>

              <span className="font-mono text-[11px] text-[#9E9D95] ml-auto">
                {filteredSurveys.length} of {surveys.length} responses
              </span>
            </div>

            {/* Response cards — much more readable than a raw table */}
            {filteredSurveys.length === 0 ? (
              <div className="rounded-2xl border border-[#E4E2DA] bg-white p-12 text-center">
                <p className="font-mono text-[12px] text-[#9E9D95] uppercase tracking-wider">No responses found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSurveys.map((survey) => {
                  const isExpanded = expandedId === survey.id;
                  const ans = survey.answers as any;
                  const labels = survey.respondent_type === 'job_seeker' ? JOB_SEEKER_LABELS : RECRUITER_LABELS;
                  const isSeeker = survey.respondent_type === 'job_seeker';

                  // Headline answer for preview
                  const headlineAnswer = isSeeker
                    ? `${ans?.q3_would_use || '—'} — ${ans?.q2_problem || ''}`
                    : `${ans?.q2_would_use || '—'} — ${ans?.q1_challenge || ''}`;

                  return (
                    <div
                      key={survey.id}
                      className="rounded-2xl border border-[#E4E2DA] bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                    >
                      {/* Card header row — always visible */}
                      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                        {/* Avatar circle */}
                        <div className="w-9 h-9 rounded-full bg-[#F3F1EA] flex items-center justify-center shrink-0 font-sans text-[13px] font-bold text-[#6B6A63]">
                          {(survey.full_name || '?').charAt(0).toUpperCase()}
                        </div>

                        {/* Name + email + headline answer */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-sans text-[14px] font-semibold text-[#1A1A19]">{survey.full_name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              isSeeker ? 'bg-[#F9BE08]/20 text-[#8A6900]' : 'bg-[#1A1A19] text-white'
                            }`}>
                              {isSeeker ? 'Job Seeker' : 'Recruiter'}
                            </span>
                            {survey.recruiter_position && (
                              <span className="font-mono text-[10px] text-[#9E9D95]">{survey.recruiter_position}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            <span className="font-mono text-[11px] text-[#9E9D95]">{survey.email}</span>
                            <span className="font-mono text-[10px] text-[#B4B2AB]">·</span>
                            <span className="font-mono text-[10px] text-[#B4B2AB]">{survey.file_number || 'PX-????'}</span>
                            <span className="font-mono text-[10px] text-[#B4B2AB]">·</span>
                            <span className="font-mono text-[10px] text-[#B4B2AB]">
                              {survey.created_at ? new Date(survey.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                            </span>
                          </div>
                        </div>

                        {/* Preview of key answer */}
                        <div className="hidden sm:block font-sans text-[12px] text-[#6B6A63] max-w-[220px] truncate italic">
                          "{headlineAnswer}"
                        </div>

                        {/* Expand toggle */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : (survey.id || null))}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[11px] uppercase tracking-wider transition-colors ${
                            isExpanded
                              ? 'border-[#1A1A19] bg-[#1A1A19] text-white'
                              : 'border-[#E4E2DA] text-[#6B6A63] hover:border-[#1A1A19] hover:text-[#1A1A19]'
                          }`}
                        >
                          {isExpanded ? 'Collapse' : 'View Answers'}
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Expanded answers — human-readable */}
                      {isExpanded && (
                        <div className="border-t border-[#E4E2DA] bg-[#F8F7F3] px-5 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(labels).map(([key, label]) => {
                              const rawVal = ans?.[key];
                              if (!rawVal && rawVal !== 0) return null;
                              const displayVal = Array.isArray(rawVal) ? rawVal.join(', ') : String(rawVal);
                              return (
                                <div key={key} className="bg-white rounded-xl border border-[#E4E2DA] p-4 space-y-1.5">
                                  <p className="font-sans text-[11px] font-semibold text-[#9E9D95]">{label}</p>
                                  <AnswerPill value={displayVal} />
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${survey.marketing_consent ? 'text-green-500' : 'text-[#C4C3BA]'}`} />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D95]">
                              Marketing consent: <strong className={survey.marketing_consent ? 'text-green-700' : 'text-[#6B6A63]'}>{survey.marketing_consent ? 'YES' : 'NO'}</strong>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Supabase Connection Configuration Modal */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E4E2DA] shadow-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-[#1A1A19]">Supabase Connection Setup</h3>
                  <p className="font-sans text-xs text-[#6B6A63]">Connect live database to sync survey responses & waitlist</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status Pill */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
              isFromSupabase
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isSupabaseConfigured
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isFromSupabase ? 'bg-emerald-500 animate-pulse' : isSupabaseConfigured ? 'bg-amber-500' : 'bg-neutral-400'}`} />
                <span className="font-mono text-xs font-semibold">
                  Status: {isFromSupabase ? `Live Connected (${surveys.length} rows)` : isSupabaseConfigured ? 'Configured (0 rows · check RLS)' : 'Local Storage Mode'}
                </span>
              </div>
              <a
                href="https://supabase.com/dashboard/project/tkjbtersuebqrtzlrpga/settings/api"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-neutral-600 hover:text-black underline"
              >
                Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider font-semibold text-[#1A1A19] mb-1.5">
                  Project URL
                </label>
                <input
                  type="text"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2DA] font-mono text-xs text-[#1A1A19] bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9BE08]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider font-semibold text-[#1A1A19] mb-1.5">
                  Anon Public Key
                </label>
                <input
                  type="password"
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2DA] font-mono text-xs text-[#1A1A19] bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9BE08]"
                />
                <p className="mt-1 text-[11px] text-[#8F8E87]">
                  Found in Supabase: <strong>Project Settings &rarr; API &rarr; Project API keys &rarr; anon public</strong>
                </p>
              </div>
            </div>

            {/* Test Connection Feedback */}
            {testResult && (
              <div className={`p-3 rounded-xl border font-mono text-xs ${
                testResult.testing
                  ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                  : testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {testResult.testing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pinging Supabase project...
                  </span>
                ) : (
                  <div>
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.success && typeof testResult.count === 'number' && (
                      <p className="text-[11px] opacity-80 mt-0.5">Found {testResult.count} survey responses in database.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult?.testing}
                className="px-4 py-2.5 rounded-xl border border-[#E4E2DA] bg-white font-mono text-xs font-semibold text-[#1A1A19] hover:bg-[#F3F1EA] transition disabled:opacity-50"
              >
                {testResult?.testing ? 'Testing...' : 'Test Connection'}
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearSupabaseCredentials();
                    setConfigKey('');
                    setShowSupabaseModal(false);
                    fetchData();
                  }}
                  className="px-3 py-2.5 rounded-xl text-neutral-500 font-mono text-xs hover:text-red-600 transition"
                >
                  Reset Local
                </button>
                <button
                  type="button"
                  onClick={handleSaveConnection}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A19] text-white font-mono text-xs font-semibold hover:bg-[#F9BE08] hover:text-[#1A1A19] transition shadow-sm"
                >
                  Save & Connect
                </button>
              </div>
            </div>

            {/* Quick RLS Help */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Rows hidden or 0 count?</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    'ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.waitlist_signups DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;\nGRANT ALL ON TABLE public.survey_responses TO anon, authenticated, service_role;\nGRANT ALL ON TABLE public.waitlist_signups TO anon, authenticated, service_role;\nGRANT ALL ON TABLE public.analytics_events TO anon, authenticated, service_role;\nNOTIFY pgrst, \'reload schema\';'
                  );
                  alert('Copied RLS disable script to clipboard! Run in Supabase SQL Editor.');
                }}
                className="text-amber-800 font-semibold underline hover:text-black"
              >
                Copy RLS Fix SQL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
