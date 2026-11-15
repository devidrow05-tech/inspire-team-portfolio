import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { portfolioApi, type PortfolioProject, type TeamMember } from '../../lib/portfolio';
import { safeUrl } from '../../lib/format';
import { ChevronLeft, ExternalLink, Github, CheckCircle2, Lightbulb, Layers3 } from 'lucide-react';

function buildProjectBenefits(project: PortfolioProject): string[] {
  const text = [project.title, project.category, project.short_description, project.full_description, ...project.technologies].join(' ').toLowerCase();
  const benefits: string[] = [];
  const add = (value: string) => { if (!benefits.includes(value)) benefits.push(value); };
  if (/e-?commerce|shop|store|market|cart|payment|checkout/.test(text)) {
    add('Creates a clear digital buying journey, helping visitors discover products and complete purchases.');
    add('Centralizes product, cart, and order interactions in one experience.');
  }
  if (/dashboard|analytic|report|metric|chart|admin|management/.test(text)) {
    add('Makes key information easier to review through a centralized dashboard or management workflow.');
    add('Helps teams monitor activity and make decisions using organized project data.');
  }
  if (/booking|appointment|reservation|schedule/.test(text)) {
    add('Simplifies booking and scheduling by bringing availability and requests into one flow.');
  }
  if (/education|learning|course|student|school|academy/.test(text)) {
    add('Organizes learning content and student-facing tasks in a single digital space.');
  }
  if (/portfolio|profile|personal brand|resume/.test(text)) {
    add('Presents work, skills, and professional information in a shareable public profile.');
  }
  if (/mobile|android|ios|app/.test(text)) {
    add('Provides an application-focused experience designed around mobile use cases.');
  }
  if (/api|backend|database|supabase|node|server/.test(text)) {
    add('Connects the interface to structured application data and backend workflows.');
  }
  if (/security|auth|login|authentication|role/.test(text)) {
    add('Supports controlled access to relevant features and user-specific workflows.');
  }
  if (/ai|machine learning|automation|chatbot|assistant/.test(text)) {
    add('Uses intelligent or automated workflows to reduce repetitive manual steps.');
  }
  if (/responsive|ui|ux|design|website|web app|frontend|react/.test(text)) {
    add('Provides a consistent, accessible interface across supported screen sizes.');
  }
  if (project.technologies.length) add(`Uses ${project.technologies.slice(0, 5).join(', ')} to implement the project’s technical solution.`);
  if (!benefits.length) {
    add('Brings the project’s stated purpose and core information into one dedicated digital experience.');
    add('Provides a clear foundation for future improvements and additional features.');
  }
  return benefits;
}

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!slug) { setLoading(false); return; }
    portfolioApi.getProject(slug).then(async (row) => {
      if (!active) return;
      if (!row || !row.is_published) { setProject(null); return; }
      setProject(row);
      const owner = await portfolioApi.listMembers().then((rows) => rows.find((item) => item.id === row.member_id) || null);
      if (active) setMember(owner);
    }).catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load project details.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const benefits = useMemo(() => project ? buildProjectBenefits(project) : [], [project]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-sm text-[var(--text-muted)]">Loading project…</div>;
  if (!project) return <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4"><h1 className="text-2xl font-bold text-[var(--text)]">Project Not Found</h1><p className="text-sm text-[var(--text-muted)]">{error || 'This project is not published or does not exist.'}</p><Link to="/team" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white"><ChevronLeft className="w-4 h-4"/>Back to Team</Link></div>;

  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <Link to={member ? `/team/${member.slug}` : '/team'} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-teal-600"><ChevronLeft className="w-4 h-4"/>Back to {member?.display_name || 'Team'}</Link>
    <header className="space-y-4"><span className="inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600">{project.category || 'Portfolio Project'}</span><h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)]">{project.title}</h1><p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">{project.short_description}</p>{member && <p className="text-xs text-[var(--text-muted)]">Created by <Link className="font-bold text-teal-600" to={`/team/${member.slug}`}>{member.display_name}</Link> · {member.title}</p>}</header>
    {project.cover_url ? <img src={project.cover_url} alt={project.title} className="w-full max-h-[520px] rounded-3xl border border-[var(--border)] object-cover"/> : <div className="w-full aspect-[16/7] rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-teal-900 flex items-center justify-center text-white"><Layers3 className="w-16 h-16 opacity-70"/></div>}
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-4"><h2 className="text-xl font-bold text-[var(--text)]">Project Overview</h2><p className="text-sm leading-7 text-[var(--text-muted)] whitespace-pre-line">{project.full_description || project.short_description}</p><div className="flex flex-wrap gap-2">{project.technologies.map((technology)=><span key={technology} className="rounded-lg bg-[var(--surface-2)] px-3 py-2 text-xs font-semibold text-[var(--text)]">{technology}</span>)}</div></section>
      <section className="rounded-2xl border border-teal-500/20 bg-[var(--surface)] p-6 space-y-4"><div className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500"/><h2 className="text-xl font-bold text-[var(--text)]">Project Benefits</h2></div><p className="text-xs text-[var(--text-muted)]">Benefits are prepared from the project description, category, and technologies.</p><ul className="space-y-3">{benefits.map((benefit,index)=><li key={index} className="flex gap-2 text-sm leading-relaxed text-[var(--text)]"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-600"/><span>{benefit}</span></li>)}</ul></section>
    </div>
    <div className="flex flex-wrap gap-3">{project.project_url && safeUrl(project.project_url) && <a href={safeUrl(project.project_url)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-teal-700">Visit Project <ExternalLink className="w-4 h-4"/></a>}{project.github_url && safeUrl(project.github_url) && <a href={safeUrl(project.github_url)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--text)]"><Github className="w-4 h-4"/>Source Code <ExternalLink className="w-4 h-4"/></a>}</div>
  </div>;
};
