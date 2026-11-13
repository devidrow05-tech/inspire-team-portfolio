import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { portfolioApi, type TeamMember } from '../../lib/portfolio';
import { ChevronRight } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { t } = useApp();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { portfolioApi.listMembers().then(rows=>setMembers(rows.filter(m=>m.is_published))).catch(console.error).finally(()=>setLoading(false)); }, []);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div className="max-w-3xl space-y-2"><h1 className="text-3xl font-extrabold text-[var(--text)]">{t('nav.team')}</h1><p className="text-sm text-[var(--text-muted)]">Meet the people behind our work. Open a profile to explore that member’s projects.</p></div>
    {loading ? <p className="py-12 text-center text-sm text-[var(--text-muted)]">Loading team…</p> : members.length===0 ? <p className="py-12 text-center text-sm text-[var(--text-muted)]">Team profiles will appear here when the admin adds and publishes members.</p> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{members.map(m=><Link key={m.id} to={`/team/${m.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:-translate-y-1 hover:shadow-xl transition">
        <div className="flex items-center gap-4">{m.avatar_url ? <img src={m.avatar_url} alt={m.display_name} className="w-16 h-16 rounded-2xl object-cover" /> : <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center">{m.display_name.slice(0,2).toUpperCase()}</div>}
          <div className="min-w-0"><h2 className="font-bold text-base text-[var(--text)] group-hover:text-teal-600">{m.display_name}</h2><p className="text-xs text-[var(--text-muted)]">{m.title}</p></div>
        </div><p className="mt-4 text-xs text-[var(--text-muted)] line-clamp-3">{m.bio}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">{m.skills.slice(0,4).map(s=><span key={s} className="text-[10px] rounded-md bg-[var(--surface-2)] px-2 py-1 text-[var(--text-muted)]">{s}</span>)}</div>
        <div className="mt-5 pt-4 border-t border-[var(--border)] flex justify-between items-center text-xs font-semibold text-teal-600"><span>View member projects</span><ChevronRight className="w-4 h-4"/></div>
      </Link>)}</div>}
  </div>;
};
