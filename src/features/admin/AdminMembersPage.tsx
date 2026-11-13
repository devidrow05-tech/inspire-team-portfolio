import React, { useEffect, useState } from 'react';
import { CheckCircle2, ImagePlus, Loader2, Plus, Users } from 'lucide-react';
import { portfolioApi, type TeamMember } from '../../lib/portfolio';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [published, setPublished] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setMembers(await portfolioApi.listMembers()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load team members.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!name.trim()) return;
    setSaving(true);
    try {
      let image: { path: string; url: string } | null = null;
      if (photo) image = await portfolioApi.uploadImage(photo, 'members');
      const baseSlug = slugify(name);
      const slug = baseSlug || `member-${Date.now()}`;
      await portfolioApi.createMember({
        display_name: name.trim(), slug, title: title.trim(), bio: bio.trim(),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        avatar_url: image?.url || null, avatar_path: image?.path || null,
        is_published: published, sort_order: members.length,
      });
      setName(''); setTitle(''); setBio(''); setSkills(''); setPhoto(null); setPublished(true);
      setSuccess('Team member added. Their public profile is now updated.');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not add member.'); }
    finally { setSaving(false); }
  };

  const togglePublished = async (member: TeamMember) => {
    setError('');
    try {
      await portfolioApi.updateMember(member.id, { is_published: !member.is_published });
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update member.'); }
  };

  return <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center"><Users className="w-5 h-5" /></div>
      <div><h1 className="text-2xl font-bold text-white">Team Members</h1><p className="text-xs text-slate-400 mt-1">Add members here. Published profiles appear automatically on the public Team page.</p></div>
    </div>
    {error && <p className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">{error}</p>}
    {success && <p className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">{success}</p>}
    <form onSubmit={addMember} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h2 className="font-bold text-white">Add a Team Member</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-slate-300 space-y-1">Full name<input required value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="Member name" /></label>
        <label className="text-xs text-slate-300 space-y-1">Designation<input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="e.g. UI/UX Designer" /></label>
        <label className="text-xs text-slate-300 space-y-1 md:col-span-2">Short bio<textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="About this team member" /></label>
        <label className="text-xs text-slate-300 space-y-1 md:col-span-2">Skills (comma separated)<input value={skills} onChange={e=>setSkills(e.target.value)} className="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-3 text-white" placeholder="React, UI Design, WordPress" /></label>
        <label className="text-xs text-slate-300 space-y-2 md:col-span-2">Profile image
          <span className="flex items-center gap-3 rounded-xl border border-dashed border-slate-700 p-3 text-slate-400"><ImagePlus className="w-5 h-5" /><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setPhoto(e.target.files?.[0] || null)} className="min-w-0 text-xs" /><span className="text-[10px]">JPG, PNG or WebP · max 5 MB</span></span>
        </label>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} /> Publish profile immediately</label>
      <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-4 py-2.5 text-xs font-bold text-white">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Add Member</button>
    </form>
    <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="p-4 border-b border-slate-800 font-bold text-white">Saved Members ({members.length})</div>
      {loading ? <p className="p-6 text-xs text-slate-400">Loading members…</p> : members.length === 0 ? <p className="p-6 text-xs text-slate-400">No members added yet.</p> : <div className="divide-y divide-slate-800">
        {members.map(m=><div key={m.id} className="p-4 flex items-center gap-3">
          {m.avatar_url ? <img src={m.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover" /> : <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">{m.display_name.slice(0,2).toUpperCase()}</div>}
          <div className="min-w-0 flex-1"><div className="font-semibold text-sm text-white">{m.display_name}</div><div className="text-xs text-slate-400">{m.title || 'Team Member'} · /team/{m.slug}</div></div>
          <button onClick={()=>void togglePublished(m)} className={`text-[11px] px-3 py-2 rounded-lg border ${m.is_published ? 'border-emerald-800 text-emerald-300' : 'border-slate-700 text-slate-300'}`}>{m.is_published ? <><CheckCircle2 className="inline w-3 h-3 mr-1"/>Published</> : 'Publish'}</button>
        </div>)}
      </div>}
    </section>
  </div>;
};
