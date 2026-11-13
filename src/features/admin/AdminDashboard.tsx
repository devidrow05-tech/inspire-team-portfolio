import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, Globe, Search, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { portfolioApi, type TeamMember, type PortfolioProject } from '../../lib/portfolio';

export const AdminDashboard: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [memberRows, projectRows] = await Promise.all([
        portfolioApi.listMembers(),
        portfolioApi.listProjects(),
      ]);
      setMembers(memberRows);
      setProjects(projectRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadDashboard(); }, []);

  const publishedMembers = members.filter((member) => member.is_published).length;
  const publishedProjects = projects.filter((project) => project.is_published).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage the public team directory, portfolio projects, and website SEO from one place.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800">
          View Live Website <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {error && <div role="alert" className="p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-rose-300 text-xs">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400"><span>Team Members</span><Users className="w-4 h-4 text-indigo-400" /></div>
          <div className="text-3xl font-extrabold text-white mt-3">{loading ? '—' : members.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{publishedMembers} published on website</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400"><span>Portfolio Projects</span><FolderKanban className="w-4 h-4 text-teal-400" /></div>
          <div className="text-3xl font-extrabold text-white mt-3">{loading ? '—' : projects.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{publishedProjects} published on website</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400"><span>Draft Content</span><Globe className="w-4 h-4 text-amber-400" /></div>
          <div className="text-3xl font-extrabold text-white mt-3">{loading ? '—' : (members.length - publishedMembers) + (projects.length - publishedProjects)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Only published content is public</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/members" className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-indigo-500 transition space-y-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <div className="font-bold text-white text-sm">Manage Team Members</div>
          <p className="text-xs text-slate-400">Add profiles, photos, bios and control public visibility.</p>
          <span className="text-xs font-semibold text-indigo-400 inline-flex items-center gap-2">Open members <Plus className="w-3.5 h-3.5" /></span>
        </Link>
        <Link to="/admin/projects" className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-teal-500 transition space-y-3">
          <FolderKanban className="w-5 h-5 text-teal-400" />
          <div className="font-bold text-white text-sm">Manage Portfolio Projects</div>
          <p className="text-xs text-slate-400">Create projects and assign them to a team member.</p>
          <span className="text-xs font-semibold text-teal-400 inline-flex items-center gap-2">Open projects <Plus className="w-3.5 h-3.5" /></span>
        </Link>
        <Link to="/admin/seo" className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-amber-500 transition space-y-3">
          <Search className="w-5 h-5 text-amber-400" />
          <div className="font-bold text-white text-sm">SEO & Search Appearance</div>
          <p className="text-xs text-slate-400">Edit search titles, descriptions, social preview and analytics.</p>
          <span className="text-xs font-semibold text-amber-400 inline-flex items-center gap-2">Configure SEO <ExternalLink className="w-3.5 h-3.5" /></span>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">Recently Added Members</h2>
            <p className="text-xs text-slate-400 mt-1">Real records from your Supabase portfolio database</p>
          </div>
          <button onClick={() => void loadDashboard()} disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-50"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
        </div>
        {!loading && members.length === 0 && <p className="text-xs text-slate-500 py-4">No members added yet. Add your first member to start building the public team directory.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.slice(0, 6).map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-xl bg-slate-950 border border-slate-800 p-3">
              {member.avatar_url ? <img src={member.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">{member.display_name.slice(0, 1).toUpperCase()}</div>}
              <div className="min-w-0"><div className="text-xs font-semibold text-white truncate">{member.display_name}</div><div className="text-[10px] text-slate-500 truncate">{member.title}</div></div>
              <span className={`ml-auto text-[10px] ${member.is_published ? 'text-emerald-400' : 'text-amber-400'}`}>{member.is_published ? 'Live' : 'Draft'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
