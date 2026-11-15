import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { portfolioApi, type TeamMember, type PortfolioProject } from '../../lib/portfolio';
import { RevealSection } from '../../components/ui/MotionPrimitives';
import { Github, Linkedin, ChevronLeft, ExternalLink, FolderKanban } from 'lucide-react';
import { safeUrl } from '../../lib/format';

export const MemberProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!slug) { setLoading(false); return; }
    portfolioApi.getMember(slug).then(async (row) => {
      if (!active) return;
      if (!row || !row.is_published) { setMember(null); return; }
      setMember(row);
      const projectRows = await portfolioApi.listProjects(row.id);
      if (active) setProjects(projectRows.filter((project) => project.is_published));
    }).catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load this profile.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-sm text-[var(--text-muted)]">Loading member portfolio…</div>;
  if (!member) return <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4"><h2 className="text-2xl font-bold text-[var(--text)]">Member Profile Not Found</h2><p className="text-sm text-[var(--text-muted)]">{error || 'This profile is not published or does not exist.'}</p><Link to="/team" className="inline-flex items-center gap-2 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"><ChevronLeft className="w-4 h-4"/>Back to Team</Link></div>;

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {member.avatar_url ? <img src={member.avatar_url} alt={member.display_name} referrerPolicy="no-referrer" loading="lazy" decoding="async" className="w-24 h-24 rounded-3xl object-cover shadow-lg"/> : <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">{member.display_name.slice(0,2).toUpperCase()}</div>}
        <div className="min-w-0 flex-1 space-y-2"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">{member.display_name}</h1><span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold">Inspire Team Member</span></div><p className="text-sm font-semibold text-teal-600 dark:text-teal-400">{member.title}</p><p className="text-sm text-[var(--text-muted)] leading-relaxed">{member.bio || 'Professional profile and project portfolio.'}</p></div>
        <div className="flex gap-2">{member.github_url && safeUrl(member.github_url) && <a href={safeUrl(member.github_url)!} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-3 rounded-xl border border-[var(--border)] text-[var(--text)]"><Github className="w-4 h-4"/></a>}{member.linkedin_url && safeUrl(member.linkedin_url) && <a href={safeUrl(member.linkedin_url)!} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-3 rounded-xl border border-[var(--border)] text-[var(--text)]"><Linkedin className="w-4 h-4"/></a>}</div>
      </div>
      <div className="mt-8 pt-6 border-t border-[var(--border)]"><h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Skills & Specializations</h2><div className="flex flex-wrap gap-2">{member.skills.map((skill) => <span key={skill} className="rounded-lg border border-teal-500/20 bg-teal-500/5 px-3 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300">{skill}</span>)}</div></div>
    </section>
    <RevealSection className="space-y-6"><div><h2 className="text-2xl font-bold text-[var(--text)]">Projects by {member.display_name} ({projects.length})</h2><p className="text-xs text-[var(--text-muted)] mt-1">Each published project includes its live link and a project-specific benefits breakdown.</p></div>
      {projects.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--text-muted)]">No public projects have been published for this member yet.</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{projects.map((project) => <motion.article key={project.id} whileHover={{y:-4}} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">{project.cover_url ? <img src={project.cover_url} alt={project.title} className="w-full aspect-[16/10] object-cover"/> : <div className="w-full aspect-[16/10] bg-gradient-to-br from-indigo-950 to-teal-900 flex items-center justify-center text-white"><FolderKanban className="w-10 h-10 opacity-70"/></div>}<div className="p-5 space-y-3"><div className="text-[10px] uppercase tracking-wider font-bold text-teal-600">{project.category || 'Project'}</div><h3 className="font-bold text-lg text-[var(--text)]">{project.title}</h3><p className="text-xs leading-relaxed text-[var(--text-muted)] line-clamp-3">{project.short_description}</p><div className="flex flex-wrap gap-1.5">{project.technologies.slice(0,4).map((tech)=><span key={tech} className="text-[10px] rounded-md bg-[var(--surface-2)] px-2 py-1 text-[var(--text-muted)]">{tech}</span>)}</div><Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-500">View project details <ChevronLeft className="w-4 h-4 rotate-180"/></Link>{project.project_url && safeUrl(project.project_url) && <a href={safeUrl(project.project_url)!} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white">Visit Project <ExternalLink className="w-4 h-4"/></a>}</div></motion.article>)}</div>}
    </RevealSection>
  </div>;
};
