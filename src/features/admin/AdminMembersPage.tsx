import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, RefreshCw, Users, Eye, EyeOff } from 'lucide-react';
import { portfolioApi, type TeamMember } from '../../lib/portfolio';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setMembers(await portfolioApi.listMembers()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load team members.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const addMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !title.trim()) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      const baseSlug = slugify(name);
      const slug = members.some((member) => member.slug === baseSlug) ? `${baseSlug}-${Date.now().toString().slice(-5)}` : baseSlug;
      await portfolioApi.createMember({
        display_name: name.trim(),
        slug,
        title: title.trim(),
        bio: bio.trim(),
        skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        is_published: false,
        sort_order: members.length,
      });
      setName(''); setTitle(''); setBio(''); setSkills('');
      setSuccess('Team member profile saved to the database.');
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save team member.'); }
    finally { setSaving(false); }
  };

  const togglePublished = async (member: TeamMember) => {
    setError(''); setSuccess('');
    try {
      await portfolioApi.updateMember(member.id, { is_published: !member.is_published });
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, is_published: !item.is_published } : item));
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to update profile.'); }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-white">Team Members</h1><p className="mt-1 text-sm text-slate-400">Create real team profiles and control whether they appear on the public website.</p></div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/> Refresh</button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/30 p-3 text-xs text-rose-300">{error}</p>}
      {success && <p className="rounded-xl border border-emerald-800 bg-emerald-950/30 p-3 text-xs text-emerald-300">{success}</p>}

      <form onSubmit={addMember} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div className="flex items-center gap-2 text-white"><Plus className="h-4 w-4 text-indigo-300"/><h2 className="text-sm font-bold">Add Team Profile</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs text-slate-300">Full name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Member name"/></label>
          <label className="text-xs text-slate-300">Professional title<input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="Frontend Developer"/></label>
          <label className="text-xs text-slate-300 md:col-span-2">Short bio<textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="A short introduction…"/></label>
          <label className="text-xs text-slate-300 md:col-span-2">Skills (comma separated)<input value={skills} onChange={(e) => setSkills(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="React, UI Design, TypeScript"/></label>
        </div>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>} Save Member Profile</button>
        <p className="text-[11px] text-slate-500">This creates a public portfolio profile record, not a login account. Member sign-in access is managed separately.</p>
      </form>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4"><h2 className="text-sm font-bold text-white">Saved Profiles ({members.length})</h2><Users className="h-4 w-4 text-slate-500"/></div>
        {loading ? <p className="p-8 text-center text-xs text-slate-400">Loading profiles…</p> : members.length === 0 ? <p className="p-8 text-center text-xs text-slate-400">No team profiles have been created yet.</p> : (
          <div className="divide-y divide-slate-800">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 font-bold text-indigo-200">{member.display_name.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white">{member.display_name}</div><div className="mt-0.5 text-xs text-slate-400">{member.title} · /team/{member.slug}</div></div>
                <button type="button" onClick={() => void togglePublished(member)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${member.is_published ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                  {member.is_published ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}{member.is_published ? 'Published' : 'Draft'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
