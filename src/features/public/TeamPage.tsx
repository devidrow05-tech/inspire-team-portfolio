import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockMemberProfiles } from '../../services/demo/data';
import { ChevronRight, Award, Layers } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { lang, t } = useApp();

  // Directory lists only published members (PRD PUBLIC-002)
  const publishedMembers = mockMemberProfiles.filter((m) => m.is_published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
          {t('nav.team')}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Meet the verified specialists, software engineers, and product designers leading technical workflows at Inspire Academy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedMembers.map((member) => (
          <Link
            key={member.id}
            to={`/team/${member.slug}`}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:shadow-xl hover:border-teal-400/50 transition-all duration-200 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {member.display_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text)] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {member.display_name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {lang === 'ur' && member.title_ur ? member.title_ur : member.title}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                {lang === 'ur' && member.bio_ur ? member.bio_ur : member.bio}
              </p>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  Primary Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-medium">Explore Projects</span>
              <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
