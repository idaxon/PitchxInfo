import React, { useState } from 'react';

const ADMIN_PASSWORD = 'pitchx-admin-2026';
const SESSION_KEY = 'pitchx_admin_auth';

interface AdminLoginProps {
  onAuthenticated: () => void;
  onBack: () => void;
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export default function AdminLogin({ onAuthenticated, onBack }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a tiny delay for feel
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        onAuthenticated();
      } else {
        setError('Incorrect password. Access denied.');
        setShake(true);
        setPassword('');
        setLoading(false);
        setTimeout(() => setShake(false), 600);
      }
    }, 400);
  };

  return (
    <div className="admin-login-root">
      {/* Animated background grid */}
      <div className="admin-login-bg" aria-hidden="true">
        <div className="admin-login-grid" />
        <div className="admin-login-glow admin-login-glow-1" />
        <div className="admin-login-glow admin-login-glow-2" />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="admin-login-back"
        aria-label="Back to home"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      {/* Card */}
      <div className={`admin-login-card${shake ? ' admin-login-shake' : ''}`}>
        {/* Lock Icon */}
        <div className="admin-login-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.2" fill="currentColor" />
          </svg>
        </div>

        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-subtitle">Enter the admin password to continue.</p>

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <div className="admin-login-field">
            <label htmlFor="admin-password" className="admin-login-label">Password</label>
            <div className="admin-login-input-wrap">
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className={`admin-login-input${error ? ' admin-login-input-error' : ''}`}
                autoComplete="current-password"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="admin-login-eye"
                aria-label={showPw ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p className="admin-login-error" role="alert">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="admin-login-btn"
            id="admin-login-submit"
          >
            {loading ? (
              <span className="admin-login-spinner" aria-hidden="true" />
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Unlock Dashboard
              </>
            )}
          </button>
        </form>

        <p className="admin-login-hint">
          🔐 Session expires when you close this tab.
        </p>
      </div>
    </div>
  );
}
