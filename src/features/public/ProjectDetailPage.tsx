import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { portfolioApi, type PortfolioProject, type TeamMember } from '../../lib/portfolio';
import { safeUrl } from '../../lib/format';
import { ChevronLeft, ExternalLink, Github, CheckCircle2, Lightbulb, Layers3, ArrowUpRight, Target, Users, Code2, BookOpen, Images, Sparkles, Rocket, ShieldCheck } from 'lucide-react';

function buildProjectBenefits(project: PortfolioProject): string[] {
  const text = [project.title, project.category, project.short_description, project.full_description, ...project.technologies].join(' ').toLowerCase();
  const benefits: string[] = [];
  const add = (value: string) => { if (!benefits.includes(value)) benefits.push(value); };
  if (/e-?commerce|shop|store|market|cart|payment|checkout/.test(text)) { add('Creates a clear digital buying journey, helping visitors discover products and complete purchases.'); add('Centralizes product, cart, and order interactions in one experience.'); }
  if (/dashboard|analytic|report|metric|chart|admin|management/.test(text)) { add('Makes key information easier to review through a centralized dashboard or management workflow.'); add('Helps teams monitor activity and make decisions using organized project data.'); }
  if (/booking|appointment|reservation|schedule/.test(text)) add('Simplifies booking and scheduling by bringing availability and requests into one flow.');
  if (/education|learning|course|student|school|academy/.test(text)) add('Organizes learning content and student-facing tasks in a single digital space.');
  if (/portfolio|profile|personal brand|resume/.test(text)) add('Presents work, skills, and professional information in a shareable public profile.');
  if (/mobile|android|ios|app/.test(text)) add('Provides an application-focused experience designed around mobile use cases.');
  if (/api|backend|database|supabase|node|server/.test(text)) add('Connects the interface to structured application data and backend workflows.');
  if (/security|auth|login|authentication|role/.test(text)) add('Supports controlled access to relevant features and user-specific workflows.');
  if (/ai|machine learning|automation|chatbot|assistant/.test(text)) add('Uses intelligent or automated workflows to reduce repetitive manual steps.');
  if (/responsive|ui|ux|design|website|web app|frontend|react/.test(text)) add('Provides a consistent interface across supported screen sizes.');
  if (project.technologies.length) add(`Uses ${project.technologies.slice(0, 5).join(', ')} to implement the project’s technical solution.`);
  if (!benefits.length) { add('Brings the project’s stated purpose and core information into one dedicated digital experience.'); add('Provides a clear foundation for future improvements and additional features.'); }
  return benefits;
}
const sectionClass='scroll-mt-28 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8';
const sectionTitle='text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text)]';
const bodyText='text-sm leading-7 text-[var(--text-muted)] whitespace-pre-line';
export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (!slug) { setLoading(false); return; }
    portfolioApi.getProject(slug).then(async (row) => {
      if (!active) return;
      if (!row || !row.is_published) { setProject(null); return; }
      setProject(row);
      const [members, allProjects] = await Promise.all([portfolioApi.listMembers(), portfolioApi.listProjects()]);
      if (active) {
        setMember(members.find((item) => item.id === row.member_id) || null);
        setRelated(allProjects.filter(p => p.is_published && p.id !== row.id).slice(0,3));
      }
    }).catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load project details.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  const benefits = useMemo(() => project ? buildProjectBenefits(project) : [], [project]);
  const features = project?.key_features || [];
  const steps = project?.usage_steps || [];
  const gallery = (project?.gallery_urls || []).filter(url => Boolean(safeUrl(url)));
  const cover = project?.cover_url && safeUrl(project.cover_url) ? project.cover_url : null;
  if (loading) return <div className="max-w-5xl mx-auto px-4 py-24 text-center text-sm text-[var(--text-muted)]">Loading project showcase…</div>;
  if (!project) return <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4"><h1 className="text-2xl font-bold text-[var(--text)]">Project Not Found</h1><p className="text-sm text-[var(--text-muted)]">{error || 'This project is not published or does not exist.'}</p><Link to="/team" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white"><ChevronLeft className="w-4 h-4"/>Back to Team</Link></div>;
  return <div className="pb-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">
      <Link to={member ? `/team/${member.slug}` : '/team'} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-teal-600"><ChevronLeft className="w-4 h-4"/>Back to {member?.display_name || 'Team'}</Link>
    </div>
    <motion.header initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.55}} className="relative isolate overflow-hidden mt-6 bg-slate-950 text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,.32),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,.38),transparent_34%),linear-gradient(120deg,#020617,#111827_55%,#042f2e)]"/>
      {cover&&<><img src={cover} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"/><div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40"/></>}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-teal-200"><Sparkles className="w-4 h-4"/>{project.category || 'INSPIRE Project Showcase'}</span>
          <div className="space-y-3"><p className="text-xs font-bold uppercase tracking-[.22em] text-indigo-200">INSPIRE · PROJECT CASE STUDY</p><h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight">{project.title}</h1><p className="max-w-2xl text-base sm:text-lg leading-8 text-slate-200">{project.tagline || project.short_description}</p></div>
          {member&&<Link to={`/team/${member.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-200 hover:text-white">Created by {member.display_name}<ArrowUpRight className="w-4 h-4"/></Link>}
          <div className="flex flex-wrap gap-3 pt-2">{project.project_url&&safeUrl(project.project_url)&&<a href={safeUrl(project.project_url)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-teal-300 transition">Explore Live Website <ExternalLink className="w-4 h-4"/></a>}{project.github_url&&safeUrl(project.github_url)&&<a href={safeUrl(project.github_url)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition"><Github className="w-4 h-4"/>Source Code</a>}</div>
        </div>
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-teal-400/20 to-indigo-500/20 blur-2xl"/>
          <div className="relative rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
            {cover?<img src={cover} alt={project.title+' preview'} className="w-full aspect-[16/10] rounded-2xl object-cover"/>:<div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-indigo-500/30 to-teal-400/20 flex items-center justify-center"><Layers3 className="w-20 h-20 text-white/80"/></div>}
            <div className="flex items-center justify-between gap-3 p-3"><div><p className="text-xs text-slate-300">PROJECT SNAPSHOT</p><p className="mt-1 font-bold text-white">{project.title}</p></div><span className="rounded-full bg-emerald-300/15 px-3 py-1 text-[10px] font-bold text-emerald-200">INSPIRE PORTFOLIO</span></div>
          </div>
        </div>
      </div>
    </motion.header>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-7">
      <nav className="flex gap-2 overflow-x-auto pb-2">{[['overview','Overview'],['features','Features'],['guide','How to Use'],['technology','Technology'],['gallery','Gallery']].map(([id,label])=><a key={id} href={'#'+id} className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:border-teal-500 hover:text-teal-600 transition">{label}</a>)}</nav>
      <section id="overview" className={sectionClass+' grid lg:grid-cols-[1.3fr_.7fr] gap-8'}>
        <div className="space-y-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500"><Target className="w-5 h-5"/></div><h2 className={sectionTitle}>Project Overview</h2></div><p className={bodyText}>{project.full_description || project.short_description}</p>{project.project_objectives&&<div className="pt-3"><h3 className="mb-2 font-bold text-[var(--text)]">Objectives</h3><p className={bodyText}>{project.project_objectives}</p></div>}{project.target_audience&&<div className="pt-3"><h3 className="mb-2 flex items-center gap-2 font-bold text-[var(--text)]"><Users className="w-4 h-4 text-teal-600"/>Who is it for?</h3><p className={bodyText}>{project.target_audience}</p></div>}</div>
        <div className="rounded-2xl bg-[var(--surface-2)] p-5 space-y-4"><h3 className="font-bold text-[var(--text)]">Project at a glance</h3><div><p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Category</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{project.category||'Digital Project'}</p></div><div><p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Creator</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{member?.display_name||'INSPIRE Team'}</p></div><div><p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Technologies</p><div className="mt-2 flex flex-wrap gap-2">{project.technologies.map(t=><span key={t} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text)]">{t}</span>)}</div></div></div>
      </section>
      <section id="features" className={sectionClass+' space-y-6'}>
        <div className="flex items-center gap-3"><div className="rounded-xl bg-teal-500/10 p-3 text-teal-600"><Layers3 className="w-5 h-5"/></div><div><h2 className={sectionTitle}>Features & Capabilities</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Explore what this project can do.</p></div></div>
        {features.length>0?<div className="grid sm:grid-cols-2 gap-4">{features.map((f,i)=><motion.article key={i} whileHover={{y:-4}} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">{f.image_url&&safeUrl(f.image_url)&&<img src={safeUrl(f.image_url)!} alt={f.title} className="w-full aspect-video object-cover"/>}<div className="p-5"><span className="text-xs font-black text-teal-600">0{i+1}</span><h3 className="mt-2 font-bold text-[var(--text)]">{f.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{f.description}</p></div></motion.article>)}</div>:<p className={bodyText}>Detailed feature descriptions will be added by the INSPIRE admin soon.</p>}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5"><div className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500"/><h3 className="font-bold text-[var(--text)]">Project Benefits</h3></div><ul className="mt-4 grid sm:grid-cols-2 gap-3">{benefits.map((b,i)=><li key={i} className="flex gap-2 text-sm leading-6 text-[var(--text)]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-600"/>{b}</li>)}</ul></div>
      </section>
      <section id="guide" className={sectionClass+' space-y-6'}>
        <div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500"><BookOpen className="w-5 h-5"/></div><div><h2 className={sectionTitle}>How to Use This Website</h2><p className="mt-1 text-xs text-[var(--text-muted)]">A practical step-by-step walkthrough for visitors.</p></div></div>
        {steps.length>0?<ol className="relative space-y-5 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-px before:bg-[var(--border)]">{steps.map((s,i)=><li key={i} className="relative flex gap-4"><span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-[var(--surface)] text-sm font-black text-teal-600">{i+1}</span><div className="flex-1 rounded-2xl bg-[var(--surface-2)] p-4 sm:p-5"><h3 className="font-bold text-[var(--text)]">{s.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{s.description}</p></div></li>)}</ol>:<p className={bodyText}>A step-by-step guide for this project will be published by the INSPIRE admin soon.</p>}
        {project.project_url&&safeUrl(project.project_url)&&<a href={safeUrl(project.project_url)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Open Website and Try It <ArrowUpRight className="w-4 h-4"/></a>}
      </section>
      {(project.project_challenges||project.project_solution||project.project_outcomes)&&<section className={sectionClass+' grid md:grid-cols-3 gap-5'}>{project.project_challenges&&<div><h3 className="font-bold text-[var(--text)]">The Challenge</h3><p className={'mt-3 '+bodyText}>{project.project_challenges}</p></div>}{project.project_solution&&<div><h3 className="font-bold text-[var(--text)]">Our Solution</h3><p className={'mt-3 '+bodyText}>{project.project_solution}</p></div>}{project.project_outcomes&&<div><h3 className="font-bold text-[var(--text)]">Project Outcomes</h3><p className={'mt-3 '+bodyText}>{project.project_outcomes}</p></div>}</section>}
      <section id="technology" className={sectionClass+' space-y-4'}><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-500/10 p-3 text-violet-500"><Code2 className="w-5 h-5"/></div><h2 className={sectionTitle}>Technology & Development</h2></div><div className="flex flex-wrap gap-2">{project.technologies.map(t=><span key={t} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-bold text-[var(--text)]">{t}</span>)}</div>{project.member_contribution&&<div className="border-t border-[var(--border)] pt-4"><h3 className="font-bold text-[var(--text)]">Developer Contribution</h3><p className={'mt-2 '+bodyText}>{project.member_contribution}</p></div>}{member&&<Link to={`/team/${member.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:underline">Meet {member.display_name}<ArrowUpRight className="w-4 h-4"/></Link>}</section>
      <section id="gallery" className={sectionClass+' space-y-5'}><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-500/10 p-3 text-amber-600"><Images className="w-5 h-5"/></div><div><h2 className={sectionTitle}>Project Gallery</h2><p className="mt-1 text-xs text-[var(--text-muted)]">A closer look at the project interface.</p></div></div>{gallery.length>0?<div className="grid sm:grid-cols-2 gap-4">{gallery.map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]"><img src={url} alt={project.title+' screenshot '+(i+1)} loading="lazy" className="w-full aspect-video object-cover transition duration-500 group-hover:scale-[1.03]"/><p className="p-3 text-xs font-semibold text-[var(--text-muted)]">Screenshot {i+1} <ExternalLink className="inline h-3 w-3"/></p></a>)}</div>:cover?<div className="overflow-hidden rounded-2xl border border-[var(--border)]"><img src={cover} alt={project.title+' project preview'} className="w-full max-h-[560px] object-cover"/></div>:<p className={bodyText}>Project screenshots will be added soon.</p>}</section>
      {related.length>0&&<section className="space-y-4"><div className="flex items-center justify-between"><h2 className={sectionTitle}>Explore More Projects</h2><Link to="/team" className="text-xs font-bold text-teal-600">Meet the team <ArrowUpRight className="inline h-3 w-3"/></Link></div><div className="grid md:grid-cols-3 gap-4">{related.map(p=><Link key={p.id} to={'/projects/'+p.slug} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:-translate-y-1 transition"><div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-indigo-950">{p.cover_url&&<img src={p.cover_url} alt="" className="h-full w-full object-cover"/>}</div><div className="p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">{p.category}</p><h3 className="mt-2 font-bold text-[var(--text)]">{p.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">{p.short_description}</p></div></Link>)}</div></section>}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-teal-950 p-7 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-teal-300">INSPIRE · Learn · Create · Innovate</p><h2 className="mt-2 text-2xl font-black">Have a project in mind?</h2><p className="mt-2 text-sm text-slate-300">Connect with our team to explore ideas and build something meaningful.</p></div><Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-teal-100">Contact INSPIRE <Rocket className="w-4 h-4"/></Link></div>
    </div>
  </div>;
};
