import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, RefreshCw, Users, Eye, EyeOff, ImagePlus, UserRound, Link as LinkIcon } from 'lucide-react';
import { portfolioApi, type TeamMember } from '../../lib/portfolio';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const validImageUrl = (value: string) => {
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:'; }
  catch { return false; }
};

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [photoUrlDrafts, setPhotoUrlDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingMemberId, setUploadingMemberId] = useState('');
  const [savingUrlMemberId, setSavingUrlMemberId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await portfolioApi.listMembers();
      setMembers(rows);
      setPhotoUrlDrafts(Object.fromEntries(rows.map((member) => [member.id, member.avatar_url || ''])));
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load team members.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!avatar) { setAvatarPreview(''); return; }
    const url = URL.createObjectURL(avatar);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  const addMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !title.trim()) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      if (avatarUrl.trim() && !validImageUrl(avatarUrl.trim())) throw new Error('Please enter a valid image URL starting with https:// or http://.');
      const baseSlug = slugify(name);
      const slug = members.some((member) => member.slug === baseSlug) ? `${baseSlug}-${Date.now().toString().slice(-5)}` : baseSlug;
      const image = avatar ? await portfolioApi.uploadImage(avatar, 'members') : null;
      await portfolioApi.createMember({
        display_name: name.trim(),
        slug,
        title: title.trim(),
        bio: bio.trim(),
        skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        avatar_url: image?.url || avatarUrl.trim() || null,
        avatar_path: image?.path || null,
        is_published: false,
        sort_order: members.length,
      });
      setName(''); setTitle(''); setBio(''); setSkills(''); setAvatar(null); setAvatarUrl('');
      setSuccess('Team member profile and photo saved. Publish the profile when it is ready.');
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save team member.'); }
    finally { setSaving(false); }
  };

  const uploadMemberAvatar = async (member: TeamMember, file?: File) => {
    if (!file) return;
    setUploadingMemberId(member.id); setError(''); setSuccess('');
    try {
      const image = await portfolioApi.uploadImage(file, 'members');
      await portfolioApi.updateMember(member.id, { avatar_url: image.url, avatar_path: image.path });
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, avatar_url: image.url, avatar_path: image.path } : item));
      setPhotoUrlDrafts((current) => ({ ...current, [member.id]: image.url }));
      setSuccess(`Profile photo updated for ${member.display_name}.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload profile photo.'); }
    finally { setUploadingMemberId(''); }
  };

  const saveMemberPhotoUrl = async (member: TeamMember) => {
    const url = (photoUrlDrafts[member.id] || '').trim();
    if (url && !validImageUrl(url)) { setError('Please enter a valid image URL starting with https:// or http://.'); return; }
    setSavingUrlMemberId(member.id); setError(''); setSuccess('');
    try {
      await portfolioApi.updateMember(member.id, { avatar_url: url || null, avatar_path: null });
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, avatar_url: url || null, avatar_path: null } : item));
      setSuccess(url ? `Image URL saved for ${member.display_name}.` : `Profile photo removed for ${member.display_name}.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save image URL.'); }
    finally { setSavingUrlMemberId(''); }
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
        <div><h1 className="text-2xl font-extrabold text-white">Team Members</h1><p className="mt-1 text-sm text-slate-400">Create team profiles, upload photos or set an image URL, and control public visibility.</p></div>
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
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs text-slate-300">Profile photo — upload image or paste image URL</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-3">
              {avatarPreview || avatarUrl.trim() ? <img src={avatarPreview || avatarUrl.trim()} alt="Profile photo preview" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} className="h-16 w-16 rounded-xl object-cover"/> : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 text-slate-500"><UserRound className="h-7 w-7"/></div>}
              <div className="min-w-0 flex-1"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setAvatar(e.target.files?.[0] || null)} className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"/><p className="mt-1 text-[10px] text-slate-500">JPG, PNG or WebP upload · max 5 MB</p></div>
            </div>
            <label className="block text-xs text-slate-300">Or image URL<input type="url" value={avatarUrl} onChange={(e) => { setAvatarUrl(e.target.value); if (e.target.value) setAvatar(null); }} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="https://example.com/profile-photo.jpg"/></label>
            <p className="text-[10px] text-slate-500">Direct public image link use karein. Agar upload aur URL dono set hon, uploaded image use hogi.</p>
          </div>
        </div>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>} Save Member Profile</button>
        <p className="text-[11px] text-slate-500">This creates a profile record, not a login account. Existing member photos can also be changed below.</p>
      </form>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4"><h2 className="text-sm font-bold text-white">Saved Profiles ({members.length})</h2><Users className="h-4 w-4 text-slate-500"/></div>
        {loading ? <p className="p-8 text-center text-xs text-slate-400">Loading profiles…</p> : members.length === 0 ? <p className="p-8 text-center text-xs text-slate-400">No team profiles have been created yet.</p> : (
          <div className="divide-y divide-slate-800">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col gap-3 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {member.avatar_url ? <img src={member.avatar_url} alt={member.display_name} className="h-12 w-12 shrink-0 rounded-xl object-cover"/> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 font-bold text-indigo-200">{member.display_name.slice(0, 2).toUpperCase()}</div>}
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white">{member.display_name}</div><div className="mt-0.5 text-xs text-slate-400">{member.title} · /team/{member.slug}</div></div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
                    {uploadingMemberId === member.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <ImagePlus className="h-4 w-4"/>}
                    {member.avatar_url ? 'Upload / Change Photo' : 'Upload Photo'}
                    <input type="file" accept="image/png,image/jpeg,image/webp" disabled={!!uploadingMemberId} onChange={(e) => { void uploadMemberAvatar(member, e.target.files?.[0]); e.currentTarget.value = ''; }} className="sr-only"/>
                  </label>
                  <button type="button" onClick={() => void togglePublished(member)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${member.is_published ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                    {member.is_published ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}{member.is_published ? 'Published' : 'Draft'}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="relative min-w-0 flex-1"><span className="sr-only">Image URL for {member.display_name}</span><LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/><input type="url" value={photoUrlDrafts[member.id] ?? ''} onChange={(e) => setPhotoUrlDrafts((current) => ({ ...current, [member.id]: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white" placeholder="https://example.com/member-photo.jpg"/></label>
                  <button type="button" disabled={savingUrlMemberId === member.id} onClick={() => void saveMemberPhotoUrl(member)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50">{savingUrlMemberId === member.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <LinkIcon className="h-4 w-4"/>} Save Image URL</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
