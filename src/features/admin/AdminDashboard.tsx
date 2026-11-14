import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, Mail, Globe, Palette, Search, Settings, ArrowUpRight, RefreshCw } from 'lucide-react';
import { portfolioApi } from '../../lib/portfolio';
import { getContactMessages } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ members: 0, projects: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [members, projects, messages] = await Promise.all([
        portfolioApi.listMembers(),
        portfolioApi.listProjects(),
        getContactMessages(),
      ]);
      setStats({
        members: members.length,
        projects: projects.length,
        messages: messages.length,
        unread: messages.filter((message) => message.status === 'new').length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const cards = [
    { label: 'Team Members', value: stats.members, icon: Users, color: 'text-indigo-300', href: '/admin/members' },
    { label: 'Portfolio Projects', value: stats.projects, icon: FolderKanban, color: 'text-teal-300', href: '/admin/projects' },
    { label: 'Contact Messages', value: stats.messages, icon: Mail, color: 'text-sky-300', href: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unread, icon: Mail, color: 'text-amber-300', href: '/admin/messages' },
  ];

  const shortcuts = [
    { label: 'Edit Website Content', description: 'Homepage, about, contact, footer and navigation', href: '/admin/website', icon: Globe },
    { label: 'Manage Team Branding', description: 'Logo, colors and visual identity', href: '/admin/branding', icon: Palette },
    { label: 'SEO Settings', description: 'Search titles and descriptions', href: '/admin/seo', icon: Search },
    { label: 'Website Settings', description: 'Privacy, terms and maintenance controls', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">INSPIRE Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Live overview of your portfolio and website inquiries.</p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh data
        </button>
      </header>

      {error && <div role="alert" className="rounded-xl border border-rose-900 bg-rose-950/30 p-4 text-sm text-rose-300">{error}</div>}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-indigo-500/50">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{card.label}</span><Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="mt-3 text-3xl font-black text-white">{loading ? '—' : card.value}</div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-300">Open section <ArrowUpRight className="h-3.5 w-3.5" /></div>
            </Link>
          );
        })}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Quick Management</h2>
          <p className="mt-1 text-xs text-slate-400">Only the active tools used to manage the website.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500/50">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1"><h3 className="text-sm font-bold text-white">{item.label}</h3><p className="mt-1 text-xs text-slate-400">{item.description}</p></div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
            );
          })}
        </div>
      </section>

      <Link to="/admin/messages" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-5 hover:bg-emerald-950/35 transition">
        <div><h2 className="text-sm font-bold text-emerald-200">Check Contact Inbox</h2><p className="mt-1 text-xs text-emerald-300/70">Read visitor inquiries and reply directly by email.</p></div>
        <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300">Open Inbox <ArrowUpRight className="h-4 w-4" /></span>
      </Link>
    </div>
  );
};
