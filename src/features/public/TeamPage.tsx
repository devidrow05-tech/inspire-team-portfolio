import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { RevealSection } from '../../components/ui/MotionPrimitives';
import { ScrambleText, PremiumInput, MaskReveal } from '../../frontend/components/animations';
import { staggerContainer, fadeUp } from '../../frontend/lib/animations';
import { portfolioApi, type TeamMember, type PortfolioProject } from '../../lib/portfolio';
import { ChevronRight, Sparkles, ExternalLink } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([portfolioApi.listMembers(), portfolioApi.listProjects()])
      .then(([memberRows, projectRows]) => {
        if (!active) return;
        setMembers(memberRows.filter((member) => member.is_published));
        setProjects(projectRows.filter((project) => project.is_published));
      })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load team profiles.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const publishedMembers = useMemo(() => members.filter((member) => {
    const q = searchTerm.trim().toLowerCase();
    return !q || member.display_name.toLowerCase().includes(q) || member.title.toLowerCase().includes(q) ||
      member.skills.some((skill) => skill.toLowerCase().includes(q));
  }), [members, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <RevealSection className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400"><Sparkles className="w-3.5 h-3.5" /><span>Verified Specialists</span></div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]"><ScrambleText text={t('nav.team')} /></h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">Meet our team and explore each member's profile, skills, and published project work.</p>
        </div>
        <div className="w-full md:w-72"><PremiumInput id="team-search" label="Filter by name, role, or skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      </RevealSection>
      {error && <p role="alert" className="rounded-xl border border-rose-300 p-4 text-sm text-rose-700">{error}</p>}
      <MaskReveal>
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="col-span-full py-12 text-center text-sm text-[var(--text-muted)]">Loading team profiles…</p>}
          {!loading && publishedMembers.length === 0 && <p className="col-span-full py-12 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">{searchTerm ? 'No team profiles match your search.' : 'Published team profiles will appear here when added.'}</p>}
          {publishedMembers.map((member) => {
            const count = projects.filter((project) => project.member_id === member.id).length;
            return <motion.div key={member.id} variants={fadeUp} className="h-full">
              <Link to={`/team/${member.slug}`} className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-400/60 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  {member.avatar_url ? <img src={member.avatar_url} alt={member.display_name} className="h-14 w-14 rounded-2xl object-cover" /> : <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-md">{member.display_name.slice(0, 2).toUpperCase()}</div>}
                  <div className="min-w-0"><h2 className="font-bold text-base text-[var(--text)]">{member.display_name}</h2><p className="text-xs text-[var(--text-muted)]">{member.title}</p></div>
                </div>
                <p className="mt-4 text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">{member.bio || 'Explore this team member’s professional profile and published work.'}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{member.skills.slice(0, 5).map((skill) => <span key={skill} className="text-[10px] px-2 py-1 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">{skill}</span>)}</div>
                <div className="pt-4 mt-auto border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-medium">{count} published {count === 1 ? 'project' : 'projects'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400">View profile <ChevronRight className="w-4 h-4" /></span>
                </div>
              </Link>
            </motion.div>;
          })}
        </motion.div>
      </MaskReveal>
    </div>
  );
};
