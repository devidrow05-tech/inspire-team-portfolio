import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton } from '../ui/MotionPrimitives';
import { DURATIONS, EASINGS } from '../../frontend/lib/animations';
import {
  LayoutDashboard,
  Globe,
  Palette,
  Search,
  Users,
  FolderArchive,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ArrowLeft,
  Home,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('inspire_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('inspire_admin_sidebar_collapsed', String(next));
      } catch {
        // ignore storage restrictions
      }
      return next;
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navGroups: NavGroup[] = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
        { label: 'Contact Inbox', path: '/admin/messages', icon: Mail },
      ],
    },
    {
      title: 'WEBSITE',
      items: [
        { label: 'Website Editor', path: '/admin/website', icon: Globe },
        { label: 'Branding', path: '/admin/branding', icon: Palette },
        { label: 'SEO Settings', path: '/admin/seo', icon: Search },
        { label: 'Website Settings', path: '/admin/settings', icon: Settings },
      ],
    },
    {
      title: 'PORTFOLIO',
      items: [
        { label: 'Team Members', path: '/admin/members', icon: Users },
        { label: 'Portfolio Projects', path: '/admin/projects', icon: FolderArchive },
      ],
    },
  ];

  return (
    <div className="admin-app-shell flex h-[100dvh] min-h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased selection:bg-indigo-500 selection:text-white">
      {/* Collapsible Desktop Sidebar - Dedicated Dark Theme */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 256 }}
        transition={{ duration: DURATIONS.fast, ease: EASINGS.decelerate }}
        className="hidden lg:flex lg:flex-col bg-slate-900 border-r border-slate-800/80 shrink-0 overflow-hidden"
      >
        {/* Brand header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/inspire-original.png?v=3" alt="Inspire Academy" className="w-10 h-10 object-contain shrink-0 rounded-lg bg-white" />
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.16 }}
                  className="truncate"
                >
                  <div className="font-extrabold text-xs tracking-wider text-white">
                    INSPIRE ADMIN
                  </div>
                  <div className="text-[10px] text-indigo-400 font-mono tracking-tight">
                    MASTER CONTROL
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatedButton
            type="button"
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </AnimatedButton>
        </div>

        {/* Nav lists */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center ${
                        sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                      } py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="admin-sidebar-active"
                            transition={EASINGS.spring}
                            className="absolute inset-0 rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30"
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!sidebarCollapsed && item.badge && (
                          <span
                            className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.highlight
                                ? 'bg-amber-500 text-slate-950 font-extrabold'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Admin User info footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                PZ
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">
                    {currentUser?.full_name || 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-indigo-400 truncate font-mono">
                    Super Admin
                  </div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <AnimatedButton
                type="button"
                onClick={handleLogout}
                title="Sign Out of Admin"
                aria-label="Sign Out of Admin"
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
              >
                <LogOut className="w-4 h-4" />
              </AnimatedButton>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-950">
        {/* Topbar */}
        <header className="min-h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <AnimatedButton
              type="button"
              onClick={handleBack}
              title="Back to public website"
              aria-label="Back to public website"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </AnimatedButton>
            <AnimatedButton
              type="button"
              onClick={() => navigate('/admin')}
              title="Go to Admin Dashboard"
              aria-label="Go to Admin Dashboard"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </AnimatedButton>
            <AnimatedButton
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </AnimatedButton>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline text-xs font-bold text-white tracking-wide">
                SYSTEM CONTROL ACTIVE
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <AnimatedButton
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-xs font-medium text-slate-300 hover:text-rose-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </AnimatedButton>
          </div>
        </header>

        {/* Inner Scrollable Viewport */}
        <main className="min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={EASINGS.spring}
              className="relative w-64 bg-slate-900 h-full flex flex-col z-10 shadow-2xl border-e border-slate-800"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img src="/inspire-original.png?v=3" alt="Inspire Academy" className="w-9 h-9 object-contain rounded-lg bg-white shrink-0" />
                  <span className="font-extrabold text-xs text-white tracking-wider">INSPIRE ADMIN</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close admin menu"
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
