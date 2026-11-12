import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Sparkles, Shield, AlertCircle, Lock } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, failedAttempts, lockoutUntil } = useAuth();
  const { config } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = login(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Access denied. Invalid credentials.');
    }
  };

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {config.site_name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono tracking-wider">
              AUTHORIZED ACCESS ONLY
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {isLocked ? (
          <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs text-center space-y-1">
            <div className="font-bold">Access Temporarily Locked</div>
            <div>Too many failed attempts. Please wait 15 minutes before retrying.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@inspireacademy.edu"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Authenticate</span>
              )}
            </button>

            {failedAttempts > 0 && failedAttempts < 5 && (
              <p className="text-[10px] text-slate-500 text-center">
                Failed attempts: {failedAttempts} of 5
              </p>
            )}
          </form>
        )}

        <div className="text-[11px] text-center text-slate-600 pt-2 border-t border-slate-800/80">
          Terminal ID: AUTH-NODE-2026 · Protected with TOTP & RLS
        </div>
      </div>
    </div>
  );
};
