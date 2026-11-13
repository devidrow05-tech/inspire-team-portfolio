import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Globe,
  Palette,
  Search,
  Users,
  Briefcase,
  FileCheck2,
  FolderArchive,
  FolderSearch,
  FolderOpen,
  Tag,
  Bell,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Home,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  end?: boolean;
  badge?: string;
  highlight?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const { config } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = () => {
    if (window.history.length > 1 && location.key !== 'default') navigate(-1);
    else navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
      ],
    },
    {
      title: 'CONTENT & CMS',
      items: [
        { label: 'Website Editor', path: '/admin/website', icon: Globe },
        { label: 'Branding & Appearance', path: '/admin/branding', icon: Palette },
        { label: 'SEO Settings', path: '/admin/seo', icon: Search },
      ],
    },
    {
      title: 'TEAM & TASKS',
      items: [
        { label: 'Team Members', path: '/admin/members', icon: Users },
        { label: 'Portfolio Projects', path: '/admin/projects', icon: FolderArchive },
        { label: 'Assignments', path: '/admin/assignments', icon: Briefcase, badge: '2' },
      ],
    },
    {
      title: 'PROJECT WORKFLOW',
      items: [
        { label: 'Pending Review', path: '/admin/reviews', icon: FileCheck2, badge: '1', highlight: true },
        { label: 'Published Work', path: '/admin/projects/published', icon: FolderArchive },
        { label: 'All Submissions', path: '/admin/submissions', icon: FolderSearch },
      ],
    },
    {
      title: 'SYSTEM & LOGS',
      items: [
        { label: 'File Manager', path: '/admin/files', icon: FolderOpen },
        { label: 'Categories & Tags', path: '/admin/categories', icon: Tag },
        { label: 'Notifications', path: '/admin/notifications', icon: Bell },
        { label: 'Analytics & KPIs', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Audit Log', path: '/admin/logs', icon: ScrollText },
        { label: 'Website Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar - Dedicated full-screen Dark theme */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800/80 shrink-0">
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-wider text-white">
                INSPIRE ADMIN
              </div>
              <div className="text-[10px] text-indigo-400 font-mono tracking-tight">
                MASTER CONTROL
              </div>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Preview Public Website (New Tab)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Nav lists */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.highlight
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Admin User info footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                PZ
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser?.full_name || 'Super Admin'}
                </div>
                <div className="text-[10px] text-indigo-400 truncate font-mono">
                  Super Admin
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out of Admin"
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-950">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleBack}
              title="Go back to previous page"
              aria-label="Go back to previous page"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={() => navigate('/admin')}
              title="Go to Admin Dashboard"
              aria-label="Go to Admin Dashboard"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">
                SYSTEM CONTROL ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-xs font-medium text-slate-300 hover:text-rose-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Inner Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-slate-900 h-full flex flex-col z-10 shadow-2xl border-e border-slate-800">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-xs text-white tracking-wider">
                INSPIRE ADMIN
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {group.title}
                  </div>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
