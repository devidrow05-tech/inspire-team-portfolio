import React, { useEffect, useState } from 'react';
import { ImagePlus, Loader2, Plus, FolderKanban } from 'lucide-react';
import { portfolioApi, type PortfolioProject, type TeamMember } from '../../lib/portfolio';

const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const AdminPortfolioProjectsPage: React.FC = () => {
  const [members,setMembers]=useState<TeamMember[]>([]);
  const [projects,setProjects]=useState<PortfolioProject[]>([]);
  const [memberId,setMemberId]=useState('');
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [details,setDetails]=useState('');
  const [category,setCategory]=useState('');
  const [technologies,setTechnologies]=useState('');
  const [cover,setCover]=useState<File|null>(null);
  const [published,setPublished]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');
  const load=async()=>{const [m,p]=await Promise.all([portfolioApi.listMembers(),portfolioApi.listProjects()]);setMembers(m);setProjects(p);if(!memberId&&m[0])setMemberId(m[0].id);};
  useEffect(()=>{void load().catch(e=>setError(e.message));},[]);
  const add=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);setError('');setSuccess('');try{if(!memberId)throw new Error('Please add a team member first.');let image:null|{path:string;url:string}=null;if(cover)image=await portfolioApi.uploadImage(cover,'projects');const slug=slugify(title)||`project-${Date.now()}`;await portfolioApi.createProject({member_id:memberId,title:title.trim(),slug,short_description:description.trim(),full_description:details.trim(),category:category.trim(),technologies:technologies.split(',').map(x=>x.trim()).filter(Boolean),cover_url:image?.url||null,cover_path:image?.path||null,is_published:published,sort_order:projects.length});setTitle('');setDescription('');setDetails('');setCategory('');setTechnologies('');setCover(null);setSuccess('Project saved. It is now connected to the selected member.');await load();}catch(e){setError(e instanceof Error?e.message:'Unable to save project.');}finally{setSaving(false);}};
  const memberName=(id:string)=>members.find(m=>m.id===id)?.display_name||'Unknown member';
  return <div className="space-y-6">
    <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-teal-500/15 text-teal-300 flex items-center justify-center"><FolderKanban className="w-5 h-5"/></div><div><h1 className="text-2xl font-bold text-white">Portfolio Projects</h1><p className="text-xs text-slate-400 mt-1">Add a project and assign it to a team member. Published projects appear on their profile.</p></div></div>
    {error&&<p className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">{error}</p>}{success&&<p className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">{success}</p>}
    <form onSubmit={add} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h2 className="font-bold text-white">Add Project</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-slate-300">Team member<select required value={memberId} onChange={e=>setMemberId(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white"><option value="">Select member</option>{members.map(m=><option key={m.id} value={m.id}>{m.display_name}</option>)}</select></label>
        <label className="text-xs text-slate-300">Project title<input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="Project title"/></label>
        <label className="text-xs text-slate-300 md:col-span-2">Short description<textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white"/></label>
        <label className="text-xs text-slate-300 md:col-span-2">Full project details<textarea value={details} onChange={e=>setDetails(e.target.value)} rows={4} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white"/></label>
        <label className="text-xs text-slate-300">Category<input value={category} onChange={e=>setCategory(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="Web Development"/></label>
        <label className="text-xs text-slate-300">Technologies<input value={technologies} onChange={e=>setTechnologies(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="React, TypeScript"/></label>
        <label className="text-xs text-slate-300 md:col-span-2">Project cover image<span className="flex items-center gap-3 mt-1 rounded-xl border border-dashed border-slate-700 p-3 text-slate-400"><ImagePlus className="w-5 h-5"/><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setCover(e.target.files?.[0]||null)} className="text-xs"/><span className="text-[10px]">JPG, PNG, WebP · max 5 MB</span></span></label>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish project immediately</label>
      <button disabled={saving||members.length===0} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white">{saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Plus className="w-4 h-4"/>}Save Project</button>
      {members.length===0&&<p className="text-xs text-amber-300">Add a member before creating a project.</p>}
    </form>
    <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"><div className="p-4 border-b border-slate-800 font-bold text-white">Saved Projects ({projects.length})</div>{projects.length===0?<p className="p-6 text-xs text-slate-400">No projects yet.</p>:<div className="divide-y divide-slate-800">{projects.map(p=><div key={p.id} className="p-4 flex items-center gap-3">{p.cover_url?<img src={p.cover_url} alt="" className="w-14 h-12 rounded-lg object-cover"/>:<div className="w-14 h-12 rounded-lg bg-slate-800"/>}<div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white">{p.title}</div><div className="text-xs text-slate-400">{memberName(p.member_id)}</div></div><span className="text-[10px] text-slate-300">{p.is_published?'Published':'Draft'}</span></div>)}</div>}</section>
  </div>;
};
