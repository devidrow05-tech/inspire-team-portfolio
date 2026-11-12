import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, Users, Target, Compass, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { config } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          {config.about_heading || 'About Inspire Academy'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Pioneering technical education, digital craftsmanship, and faculty-governed engineering.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Academic Philosophy</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text)]">Our Vision & Core Mandate</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
            {config.about_full_text ||
              'Inspire Academy operates as an elite digital institute dedicated to turning emerging engineers, designers, and marketers into world-class practitioners. Unlike standard portfolio sites where members self-publish unchecked work, Inspire Team enforces an iron-clad faculty approval workflow: every piece of public portfolio code, design token, or media is supervised, tested, and approved by the Super Admin.'}
          </p>
        </div>

        {/* Mission & Vision cards from config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
          <div className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Target className="w-5 h-5" />
              <span>Mission Statement</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {config.about_mission ||
                'To cultivate engineering excellence through disciplined project delivery, peer code reviews, and industry standard mentorship.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <Compass className="w-5 h-5" />
              <span>Vision Statement</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {config.about_vision ||
                'To be the benchmark academy in South Asia producing verifiable top 1% technology talent recognized globally.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[var(--border)]">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--text)]">Zero Unapproved Leaks</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every deliverable is isolated in private storage until explicitly signed off by leadership.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--text)]">High Craft Standards</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Assignments include clear acceptance criteria, responsive checks, and bilingual standards.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--text)]">Accountability & Logs</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Immutable audit logs record every review, assignment transition, and publish event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
