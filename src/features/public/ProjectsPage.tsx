import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ImageSlot } from '../../components/ui/ImageSlot';
import { portfolioApi, type PortfolioProject } from '../../lib/portfolio';
import { Search, ArrowRight } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { t } = useApp();
  const [searchParams,setSearchParams]=useSearchParams();
  const [projects,setProjects]=useState<PortfolioProject[]>([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true);
  useEffect(()=>{portfolioApi.listProjects().then(rows=>setProjects(rows.filter(p=>p.is_published))).catch(console.error).finally(()=>setLoading(false));},[]);
  const category=searchParams.get('category')||'';
  const filtered=projects.filter(p=>(!category||p.category.toLowerCase().replace(/[^a-z0-9]+/g,'-')===category)&&(!search||[p.title,p.short_description,p.category,...p.technologies].join(' ').toLowerCase().includes(search.toLowerCase())));
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div><h1 className="text-3xl font-extrabold text-[var(--text)]">{t('nav.projects')}</h1><p className="text-sm text-[var(--text-muted)] mt-2">Explore projects published by our team members.</p></div>
    <div className="flex flex-col sm:flex-row gap-3"><div className="relative flex-1"><Search className="absolute start-3 top-3 w-4 h-4 text-[var(--text-muted)]"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects or technologies" className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)]"/></div><button onClick={()=>setSearchParams({})} className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)]">Clear category</button></div>
    {loading?<p className="py-12 text-center text-sm text-[var(--text-muted)]">Loading projects…</p>:filtered.length===0?<div className="py-16 text-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">No published projects yet.</div>:<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map(p=><Link key={p.id} to={`/projects/${p.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:shadow-xl transition"><ImageSlot src={p.cover_url||undefined} alt={p.title} aspect="16/10" fallbackText={p.title} badge={p.category}/><div className="p-5"><h2 className="font-bold text-base text-[var(--text)] group-hover:text-indigo-600">{p.title}</h2><p className="mt-2 text-xs text-[var(--text-muted)] line-clamp-3">{p.short_description}</p><div className="mt-4 flex flex-wrap gap-1">{p.technologies.slice(0,4).map(x=><span key={x} className="text-[10px] bg-[var(--surface-2)] rounded px-2 py-1 text-[var(--text-muted)]">{x}</span>)}</div><div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between text-xs font-semibold text-indigo-600"><span>View project</span><ArrowRight className="w-4 h-4"/></div></div></Link>)}</div>}
  </div>;
};
