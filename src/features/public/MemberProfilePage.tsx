import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioApi, type PortfolioProject, type TeamMember } from '../../lib/portfolio';
import { ImageSlot } from '../../components/ui/ImageSlot';
import { ArrowLeft, ArrowRight, Github, Linkedin, Globe } from 'lucide-react';
import { safeUrl } from '../../lib/format';

export const MemberProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    portfolioApi.getMember(slug).then(async m => {
      setMember(m && m.is_published ? m : null);
      if (m && m.is_published) setProjects((await portfolioApi.listProjects(m.id)).filter(p=>p.is_published));
    }).catch(console.error).finally(()=>setLoading(false));
  }, [slug]);
  if (loading) return <div className="py-20 text-center text-sm text-[var(--text-muted)]">Loading member profile…</div>;
  if (!member) return <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4"><h2 className="text-2xl font-bold text-[var(--text)]">Member Profile Not Found</h2><Link to="/team" className="inline-flex items-center gap-2 text-teal-600"><ArrowLeft className="w-4 h-4"/>Back to Team</Link></div>;
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <Link to="/team" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"><ArrowLeft className="w-4 h-4"/>All Team Members</Link>
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-9 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      {member.avatar_url ? <img src={member.avatar_url} alt={member.display_name} className="w-28 h-28 rounded-3xl object-cover"/> : <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white text-3xl font-bold flex items-center justify-center">{member.display_name.slice(0,2).toUpperCase()}</div>}
      <div className="flex-1 text-center sm:text-left"><h1 className="text-3xl font-extrabold text-[var(--text)]">{member.display_name}</h1><p className="mt-1 text-sm font-semibold text-teal-600">{member.title}</p><p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{member.bio}</p><div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">{member.skills.map(s=><span key={s} className="text-xs px-3 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--text)]">{s}</span>)}</div></div>
      <div className="flex gap-2">{member.github_url && safeUrl(member.github_url) && <a href={safeUrl(member.github_url)!} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 border border-[var(--border)] rounded-xl"><Github className="w-4 h-4"/></a>}{member.linkedin_url && safeUrl(member.linkedin_url) && <a href={safeUrl(member.linkedin_url)!} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 border border-[var(--border)] rounded-xl"><Linkedin className="w-4 h-4"/></a>}{member.website_url && safeUrl(member.website_url) && <a href={safeUrl(member.website_url)!} target="_blank" rel="noreferrer" aria-label="Website" className="p-2 border border-[var(--border)] rounded-xl"><Globe className="w-4 h-4"/></a>}</div>
    </section>
    <section className="space-y-5"><div><h2 className="text-2xl font-bold text-[var(--text)]">Projects by {member.display_name} ({projects.length})</h2><p className="text-xs text-[var(--text-muted)] mt-1">All projects published by this team member.</p></div>
      {projects.length===0 ? <div className="p-10 text-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">No projects published for this member yet.</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{projects.map(p=><Link key={p.id} to={`/projects/${p.slug}`} className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] group hover:shadow-xl transition"><ImageSlot src={p.cover_url || undefined} alt={p.title} aspect="16/10" fallbackText={p.title} badge={p.category}/><div className="p-5"><h3 className="font-bold text-[var(--text)] group-hover:text-teal-600">{p.title}</h3><p className="text-xs mt-2 text-[var(--text-muted)] line-clamp-3">{p.short_description}</p><div className="mt-4 flex items-center justify-between text-xs text-teal-600 font-semibold"><span>View Project</span><ArrowRight className="w-4 h-4"/></div></div></Link>)}</div>}
    </section>
  </div>;
};
