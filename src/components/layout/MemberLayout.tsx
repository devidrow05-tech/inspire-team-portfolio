import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton } from '../ui/MotionPrimitives';
import { EASINGS } from '../../frontend/lib/animations';
import {
  LayoutDashboard,
  Briefcase,
  FolderGit2,
  PlusCircle,
  FileText,
  UserCheck,
  Bell,
  Settings,
  LogOut,
  Globe,
  Sun,
  Moon,
  ExternalLink,
  Menu,
  X,
  FileStack,
  ArrowLeft,
} from 'lucide-react';

export const MemberLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang, setLang, theme, setTheme } = useApp();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1 && location.key !== 'default') navigate(-1);
    else navigate('/member');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberNav = [
    { label: 'My Dashboard', path: '/member', icon: LayoutDashboard },
    { label: 'My Assignments', path: '/member/assignments', icon: Briefcase, badge: '2' },
    { label: 'My Projects', path: '/member/projects', icon: FolderGit2 },
    { label: 'New Project Draft', path: '/member/projects/new', icon: PlusCircle },
    { label: 'Image-to-PDF Engine', path: '/member/tools/image-to-pdf', icon: FileStack, highlight: true },
    { label: 'Submissions & Feedback', path: '/member/submissions', icon: FileText },
    { label: 'My Public Profile', path: '/member/profile', icon: UserCheck },
    { label: 'Notifications', path: '/member/notifications', icon: Bell, shake: true },
    { label: 'Account Settings', path: '/member/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={EASINGS.spring}
              className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm"
            >
              IT
            </motion.div>
            <div>
              <div className="font-bold text-sm tracking-tight text-[var(--text)]">MEMBER WORKSPACE</div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium tracking-wide">INSPIRE ACADEMY</div>
            </div>
          </Link>
          <Link to="/" title="View Public Site" className="text-[var(--text-muted)] hover:text-teal-500 transition">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-3 py-1">
            Personal Workspace
          </div>
          {memberNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/member'}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="member-nav-active"
                        transition={EASINGS.spring}
                        className="absolute inset-0 rounded-lg bg-teal-600 shadow-sm"
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2.5">
                      {item.shake ? (
                        <motion.span
                          animate={{ rotate: [0, -14, 14, -8, 8, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 4.5 }}
                          className="inline-flex"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </motion.span>
                      ) : (
                        <Icon className="w-4 h-4 shrink-0" />
                      )}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="relative z-10 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User bar */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-2)]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center text-xs">
                HF
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold truncate text-[var(--text)]">Team Member</div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">Team Member (Full-Stack)</div>
              </div>
            </div>
            <AnimatedButton
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <LogOut className="w-4 h-4" />
            </AnimatedButton>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <AnimatedButton
              type="button"
              onClick={handleBack}
              title="Go back"
              aria-label="Go back"
              className="inline-flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Back</span>
            </AnimatedButton>
            <AnimatedButton
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open member sidebar"
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
            >
              <Menu className="w-5 h-5" />
            </AnimatedButton>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Role: Team Member
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AnimatedButton
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border)] hover:bg-[var(--surface-2)]"
            >
              <Globe className="w-3.5 h-3.5 text-teal-500" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </AnimatedButton>

            <AnimatedButton
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-1.5 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </AnimatedButton>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={EASINGS.spring}
              className="relative w-64 bg-[var(--surface)] h-full flex flex-col z-10 shadow-2xl"
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <span className="font-bold text-sm">Member Workspace</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close member sidebar"
                  className="p-1 rounded text-[var(--text-muted)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {memberNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-[var(--surface-2)]"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
