import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  AlertTriangle,
} from 'lucide-react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang, setLang, theme, setTheme, t, config } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If maintenance mode is enabled by admin in Section 12, display friendly maintenance banner/screen
  if (config.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">System Maintenance</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {config.maintenance_message || 'We are updating the site. Back soon!'}
          </p>
          <div className="text-xs text-slate-500 pt-4">
            {config.site_name}
          </div>
        </div>
      </div>
    );
  }

  const enabledNavItems = config.navigation_items.filter((item) => item.enabled);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: config.color_bg && theme === 'light' ? config.color_bg : undefined,
        color: config.color_text && theme === 'light' ? config.color_text : undefined,
      }}
    >
      {/* 
        CRITICAL ADMIN ACCESS RULE:
        NO admin button, NO admin link, NO admin hint anywhere on the public website.
        NO "Login" or "Admin" text visible to visitors.
      */}

      {/* Main Navigation Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-[var(--border)] transition-colors"
        style={{
          backgroundColor:
            config.color_header_bg && theme === 'light'
              ? config.color_header_bg
              : 'var(--surface)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand - Controlled from Admin */}
          <Link to="/" className="flex items-center gap-3 group">
            {config.logo_url ? (
              <img
                src={config.logo_url}
                alt={config.site_name}
                className="w-10 h-10 object-contain rounded-xl"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${config.color_primary || '#4338CA'}, ${config.color_secondary || '#0F766E'})`,
                }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div>
              <div
                className="font-extrabold text-lg tracking-tight"
                style={{ color: config.color_primary || 'var(--text)' }}
              >
                {config.site_name || 'INSPIRE ACADEMY'}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                {config.site_tagline || 'Digital Academy Team'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links - Fully Controlled by Admin Nav Editor */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {enabledNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls: Language & Theme ONLY (NO admin button/hint) */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition"
              title="Toggle English / اردو"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-2 pb-4 space-y-1">
            {enabledNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--surface-2)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className="flex-1">{children}</main>

      {/* Polished Public Footer - Controlled from Admin */}
      <footer
        className="border-t border-[var(--border)] text-[var(--text-muted)] text-sm transition-colors mt-auto"
        style={{
          backgroundColor:
            config.color_footer_bg && theme === 'light'
              ? config.color_footer_bg
              : 'var(--surface)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: config.color_primary || '#4338CA' }}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-[var(--text)] tracking-tight">
                  {config.site_name}
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {config.footer_tagline}
              </p>
              {/* Social Links Controlled by Admin */}
              <div className="flex flex-wrap gap-3 text-xs">
                {config.social_links.github?.enabled && config.social_links.github.url && (
                  <a
                    href={config.social_links.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium"
                  >
                    GitHub
                  </a>
                )}
                {config.social_links.linkedin?.enabled && config.social_links.linkedin.url && (
                  <a
                    href={config.social_links.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium"
                  >
                    LinkedIn
                  </a>
                )}
                {config.social_links.instagram?.enabled && config.social_links.instagram.url && (
                  <a
                    href={config.social_links.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium"
                  >
                    Instagram
                  </a>
                )}
                {config.social_links.facebook?.enabled && config.social_links.facebook.url && (
                  <a
                    href={config.social_links.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium"
                  >
                    Facebook
                  </a>
                )}
                {config.social_links.x?.enabled && config.social_links.x.url && (
                  <a
                    href={config.social_links.x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium"
                  >
                    Twitter / X
                  </a>
                )}
                {config.social_links.youtube?.enabled && config.social_links.youtube.url && (
                  <a
                    href={config.social_links.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                {config.footer_nav_links.map((lnk, idx) => (
                  <li key={idx}>
                    <Link to={lnk.url} className="hover:text-indigo-500">
                      {lnk.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
                Disciplines & Work
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/projects?category=web-development" className="hover:text-indigo-500">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link to="/projects?category=android-apps" className="hover:text-indigo-500">
                    Android Applications
                  </Link>
                </li>
                <li>
                  <Link to="/projects?category=ui-ux" className="hover:text-indigo-500">
                    UI/UX Design Systems
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-indigo-500">
                    All Specializations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
                Inquiries & Contact
              </h4>
              <p className="text-xs leading-relaxed mb-3">
                {config.contact_address}
              </p>
              {config.whatsapp_number && (
                <a
                  href={`https://wa.me/${config.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  WhatsApp Direct
                </a>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <div>{config.footer_copyright}</div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-indigo-500">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-indigo-500">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
