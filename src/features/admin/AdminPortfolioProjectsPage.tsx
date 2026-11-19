import React, { useEffect, useState } from 'react';
import { ImagePlus, Loader2, Plus, FolderKanban, ExternalLink, Pencil, X } from 'lucide-react';
import { portfolioApi, type PortfolioProject, type TeamMember } from '../../lib/portfolio';

const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const parseLines=(value:string)=>value.split('\n').map(line=>line.trim()).filter(Boolean);
const parsePairs=(value:string)=>parseLines(value).map(line=>{const [title,...rest]=line.split('|');return {title:title.trim(),description:rest.join('|').trim()};}).filter(item=>item.title&&item.description);
export const AdminPortfolioProjectsPage: React.FC = () => {
  const [members,setMembers]=useState<TeamMember[]>([]);
  const [projects,setProjects]=useState<PortfolioProject[]>([]);
  const [editingId,setEditingId]=useState<string|null>(null);
  const [memberId,setMemberId]=useState('');
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [details,setDetails]=useState('');
  const [tagline,setTagline]=useState('');
  const [objectives,setObjectives]=useState('');
  const [audience,setAudience]=useState('');
  const [features,setFeatures]=useState('');
  const [steps,setSteps]=useState('');
  const [gallery,setGallery]=useState('');
  const [challenges,setChallenges]=useState('');
  const [solution,setSolution]=useState('');
  const [outcomes,setOutcomes]=useState('');
  const [contribution,setContribution]=useState('');
  const [category,setCategory]=useState('');
  const [technologies,setTechnologies]=useState('');
  const [projectUrl,setProjectUrl]=useState('');
  const [githubUrl,setGithubUrl]=useState('');
  const [cover,setCover]=useState<File|null>(null);
  const [published,setPublished]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');
  const load=async()=>{const [m,p]=await Promise.all([portfolioApi.listMembers(),portfolioApi.listProjects()]);setMembers(m);setProjects(p);if(!memberId&&m[0])setMemberId(m[0].id);};
  useEffect(()=>{void load().catch(e=>setError(e.message));},[]);
  const reset=()=>{setEditingId(null);setTitle('');setDescription('');setDetails('');setTagline('');setObjectives('');setAudience('');setFeatures('');setSteps('');setGallery('');setChallenges('');setSolution('');setOutcomes('');setContribution('');setCategory('');setTechnologies('');setProjectUrl('');setGithubUrl('');setCover(null);setPublished(true);};
  const edit=(p:PortfolioProject)=>{setEditingId(p.id);setMemberId(p.member_id);setTitle(p.title);setDescription(p.short_description);setDetails(p.full_description);setTagline(p.tagline||'');setObjectives(p.project_objectives||'');setAudience(p.target_audience||'');setFeatures((p.key_features||[]).map(x=>x.title+' | '+x.description).join('\n'));setSteps((p.usage_steps||[]).map(x=>x.title+' | '+x.description).join('\n'));setGallery((p.gallery_urls||[]).join('\n'));setChallenges(p.project_challenges||'');setSolution(p.project_solution||'');setOutcomes(p.project_outcomes||'');setContribution(p.member_contribution||'');setCategory(p.category);setTechnologies(p.technologies.join(', '));setProjectUrl(p.project_url||'');setGithubUrl(p.github_url||'');setPublished(p.is_published);setCover(null);setError('');setSuccess('');window.scrollTo({top:0,behavior:'smooth'});};
  const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);setError('');setSuccess('');try{if(!memberId)throw new Error('Please add a team member first.');let image:null|{path:string;url:string}=null;if(cover)image=await portfolioApi.uploadImage(cover,'projects');const payload={member_id:memberId,title:title.trim(),slug:editingId?(projects.find(p=>p.id===editingId)?.slug||slugify(title)):slugify(title)||`project-${Date.now()}`,short_description:description.trim(),full_description:details.trim(),tagline:tagline.trim()||null,project_objectives:objectives.trim()||null,target_audience:audience.trim()||null,key_features:parsePairs(features),usage_steps:parsePairs(steps),gallery_urls:parseLines(gallery),project_challenges:challenges.trim()||null,project_solution:solution.trim()||null,project_outcomes:outcomes.trim()||null,member_contribution:contribution.trim()||null,category:category.trim(),technologies:technologies.split(',').map(x=>x.trim()).filter(Boolean),project_url:projectUrl.trim()||null,github_url:githubUrl.trim()||null,cover_url:image?.url||(editingId?projects.find(p=>p.id===editingId)?.cover_url:null),cover_path:image?.path||(editingId?projects.find(p=>p.id===editingId)?.cover_path:null),is_published:published,sort_order:editingId?(projects.find(p=>p.id===editingId)?.sort_order||0):projects.length};if(editingId)await portfolioApi.updateProject(editingId,payload);else await portfolioApi.createProject(payload);setSuccess(editingId?'Project case study updated successfully.':'Project saved and linked to the selected member.');reset();await load();}catch(e){setError(e instanceof Error?e.message:'Unable to save project.');}finally{setSaving(false);}};
  const memberName=(id:string)=>members.find(m=>m.id===id)?.display_name||'Unknown member';
  const field='w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white placeholder:text-slate-500';
  const label='text-xs text-slate-300';
  return <div className="space-y-6">
    <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-teal-500/15 text-teal-300 flex items-center justify-center"><FolderKanban className="w-5 h-5"/></div><div><h1 className="text-2xl font-bold text-white">Portfolio Projects</h1><p className="text-xs text-slate-400 mt-1">Create and edit premium project case studies. Only admins can publish project details.</p></div></div>
    {error&&<p className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">{error}</p>}{success&&<p className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">{success}</p>}
    <form onSubmit={save} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-5">
      <div className="flex items-center justify-between"><h2 className="font-bold text-white">{editingId?'Edit Project Case Study':'Add Project'}</h2>{editingId&&<button type="button" onClick={reset} className="text-xs text-slate-300 inline-flex items-center gap-1"><X className="w-4 h-4"/>Cancel edit</button>}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className={label}>Team member<select required value={memberId} onChange={e=>setMemberId(e.target.value)} className={field}><option value="">Select member</option>{members.map(m=><option key={m.id} value={m.id}>{m.display_name}</option>)}</select></label>
        <label className={label}>Project title<input required value={title} onChange={e=>setTitle(e.target.value)} className={field} placeholder="Project title"/></label>
        <label className={label+' md:col-span-2'}>Short description<textarea required value={description} onChange={e=>setDescription(e.target.value)} rows={2} className={field}/></label>
        <label className={label+' md:col-span-2'}>Hero tagline<input value={tagline} onChange={e=>setTagline(e.target.value)} className={field} placeholder="A concise statement for the project banner"/></label>
        <label className={label+' md:col-span-2'}>Full project overview<textarea value={details} onChange={e=>setDetails(e.target.value)} rows={4} className={field} placeholder="Describe the project and what it does…"/></label>
        <label className={label}>Category<input value={category} onChange={e=>setCategory(e.target.value)} className={field} placeholder="Web Development"/></label>
        <label className={label}>Technologies<input value={technologies} onChange={e=>setTechnologies(e.target.value)} className={field} placeholder="React, TypeScript"/></label>
        <label className={label}>Live project URL<input type="url" value={projectUrl} onChange={e=>setProjectUrl(e.target.value)} className={field} placeholder="https://your-project.com"/></label>
        <label className={label}>GitHub repository URL<input type="url" value={githubUrl} onChange={e=>setGithubUrl(e.target.value)} className={field} placeholder="https://github.com/…"/></label>
        <label className={label+' md:col-span-2'}>Project hero / cover image<span className="flex items-center gap-3 mt-1 rounded-xl border border-dashed border-slate-700 p-3 text-slate-400"><ImagePlus className="w-5 h-5"/><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setCover(e.target.files?.[0]||null)} className="text-xs"/><span className="text-[10px]">JPG, PNG, WebP · max 5 MB</span></span></label>
      </div>
      <div className="border-t border-slate-800 pt-4 space-y-3"><h3 className="font-semibold text-white">Case Study Details</h3><div className="grid md:grid-cols-2 gap-3">
        <label className={label}>Project objectives<textarea value={objectives} onChange={e=>setObjectives(e.target.value)} rows={3} className={field} placeholder="What goals does this project achieve?"/></label>
        <label className={label}>Target audience<textarea value={audience} onChange={e=>setAudience(e.target.value)} rows={3} className={field} placeholder="Who is this project designed for?"/></label>
        <label className={label}>Challenges<textarea value={challenges} onChange={e=>setChallenges(e.target.value)} rows={3} className={field}/></label>
        <label className={label}>Solution<textarea value={solution} onChange={e=>setSolution(e.target.value)} rows={3} className={field}/></label>
        <label className={label}>Project outcomes<textarea value={outcomes} onChange={e=>setOutcomes(e.target.value)} rows={3} className={field}/></label>
        <label className={label}>Team member contribution<textarea value={contribution} onChange={e=>setContribution(e.target.value)} rows={3} className={field} placeholder="What did the assigned member build or contribute?"/></label>
      </div>
      <p className="text-[10px] text-slate-500">Features and steps: enter one per line using <b>Title | Description</b> format.</p>
      <label className={label}>Key features<textarea value={features} onChange={e=>setFeatures(e.target.value)} rows={5} className={field} placeholder={'User dashboard | Users can review their activity.\nSecure login | Account access is protected.'}/></label>
      <label className={label}>Step-by-step usage guide<textarea value={steps} onChange={e=>setSteps(e.target.value)} rows={5} className={field} placeholder={'Create an account | Open the sign-up page and enter your details.\nExplore the dashboard | Review the available tools.'}/></label>
      <label className={label}>Gallery screenshot URLs (one URL per line)<textarea value={gallery} onChange={e=>setGallery(e.target.value)} rows={3} className={field} placeholder="https://…"/></label></div>
      <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish project immediately</label>
      <button disabled={saving||members.length===0} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white">{saving?<Loader2 className="w-4 h-4 animate-spin"/>:editingId?<Pencil className="w-4 h-4"/>:<Plus className="w-4 h-4"/>}{editingId?'Update Case Study':'Save Project'}</button>
      {members.length===0&&<p className="text-xs text-amber-300">Add a member before creating a project.</p>}
    </form>
    <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"><div className="p-4 border-b border-slate-800 font-bold text-white">Saved Projects ({projects.length})</div>{projects.length===0?<p className="p-6 text-xs text-slate-400">No projects yet.</p>:<div className="divide-y divide-slate-800">{projects.map(p=><div key={p.id} className="p-4 flex items-center gap-3">{p.cover_url?<img src={p.cover_url} alt="" className="w-14 h-12 rounded-lg object-cover"/>:<div className="w-14 h-12 rounded-lg bg-slate-800"/>}<div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white">{p.title}</div><div className="text-xs text-slate-400">{memberName(p.member_id)} · /projects/{p.slug}</div>{p.project_url&&<a href={p.project_url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] text-teal-300">Visit project <ExternalLink className="w-3 h-3"/></a>}</div><span className="text-[10px] text-slate-300">{p.is_published?'Published':'Draft'}</span><button type="button" onClick={()=>edit(p)} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white" aria-label={'Edit '+p.title}><Pencil className="w-4 h-4"/></button></div>)}</div>}</section>
  </div>;
};
