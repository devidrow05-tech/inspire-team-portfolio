import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, AlertCircle, ArrowRight } from 'lucide-react';

export const MemberLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('hamza.dev@inspireacademy.edu');
  const [password, setPassword] = useState('MemberPassword2026!');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide valid login credentials.');
      return;
    }
    login(email, 'member');
    navigate('/member');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
            Team Member Workspace
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Invite-only portal. Sign in using credentials issued by academy admin.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Member Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Sign In to Workspace</span>
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
};
