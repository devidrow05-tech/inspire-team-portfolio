import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { AnimatedButton, RevealSection } from '../ui/MotionPrimitives';
import { GradientText, PremiumTooltip } from '../../frontend/components/animations';
import { DURATIONS, EASINGS } from '../../frontend/lib/animations';
import {
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang, setLang, theme, setTheme, config } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 24;
    if (next !== isScrolled) setIsScrolled(next);
  });

  const handleBack = () => {
    if (window.history.length > 1 && location.key !== 'default') navigate(-1);
    else navigate('/');
  };

  // If maintenance mode is enabled by admin, display friendly maintenance screen
  if (config.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATIONS.normal, ease: EASINGS.decelerate }}
          className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
        >
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
        </motion.div>
      </div>
    );
  }

  // Portfolio projects are shown inside each member's Team profile, not as a separate public navigation page.
  const enabledNavItems = config.navigation_items.filter(
    (item) => item.enabled && item.path !== '/projects'
  );
  const footerNavLinks = config.footer_nav_links.filter((lnk) => lnk.url !== '/projects');

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200 relative"
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

      {/* Scroll-Aware Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl border-indigo-500/20 shadow-lg shadow-slate-900/5 dark:shadow-slate-950/50'
            : 'backdrop-blur-md border-[var(--border)]'
        }`}
        style={{
          backgroundColor:
            config.color_header_bg && theme === 'light'
              ? config.color_header_bg
              : 'color-mix(in srgb, var(--surface) 88%, transparent)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Back navigation */}
          <PremiumTooltip tip="Go back">
            <AnimatedButton
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Back</span>
            </AnimatedButton>
          </PremiumTooltip>

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 flex-1 md:flex-initial">
            {(config.logo_url || '/logo.svg') ? (
              <motion.img
                whileHover={{ scale: 1.06 }}
                transition={EASINGS.spring}
                src={config.logo_url || '/logo.svg'}
                alt={config.site_name}
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 object-contain rounded-xl"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.08, rotate: -6 }}
                whileTap={{ scale: 0.95 }}
                transition={EASINGS.spring}
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${config.color_primary || '#4338CA'}, ${config.color_secondary || '#0F766E'})`,
                }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            )}
            <div className="min-w-0">
              <div className="font-extrabold text-base sm:text-lg tracking-tight truncate">
                <GradientText>{config.site_name || 'INSPIRE'}</GradientText>
              </div>
              <div className="hidden sm:block text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium truncate">
                {config.site_tagline || 'Digital Academy Team'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links with Animated Active Underline */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Primary">
            {enabledNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="public-nav-active-pill"
                        transition={EASINGS.spring}
                        className="absolute inset-x-2 bottom-0.5 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                      />
                    )}
                    {!isActive && (
                      <span className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-indigo-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls: Language & Theme ONLY (NO admin button/hint) */}
          <div className="flex items-center gap-2 shrink-0">
            <PremiumTooltip tip={lang === 'en' ? 'Switch to Urdu (اردو)' : 'Switch to English'}>
              <AnimatedButton
                type="button"
                onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>{lang === 'en' ? 'اردو' : 'English'}</span>
              </AnimatedButton>
            </PremiumTooltip>

            <PremiumTooltip tip={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <AnimatedButton
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -60, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 60, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="block"
                    >
                      <Sun className="w-4 h-4 text-amber-400" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 60, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -60, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="block"
                    >
                      <Moon className="w-4 h-4 text-slate-600" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </AnimatedButton>
            </PremiumTooltip>

            <AnimatedButton
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </AnimatedButton>
          </div>
        </div>

        {/* Animated Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATIONS.fast, ease: EASINGS.decelerate }}
              className="md:hidden overflow-hidden border-b border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {enabledNavItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--surface-2)]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Body */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Polished Public Footer */}
      <footer
        className="border-t border-[var(--border)] text-[var(--text-muted)] text-sm transition-colors mt-auto relative z-10"
        style={{
          backgroundColor:
            config.color_footer_bg && theme === 'light'
              ? config.color_footer_bg
              : 'var(--surface)',
        }}
      >
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.svg"
                  alt="Inspire Academy"
                  className="w-10 h-10 object-contain shrink-0"
                />
                <span className="font-bold text-base text-[var(--text)] tracking-tight">
                  {config.site_name}
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {config.footer_tagline}
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                {config.social_links.github?.enabled && config.social_links.github.url && (
                  <a
                    href={config.social_links.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium transition-transform hover:-translate-y-0.5 inline-block"
                  >
                    GitHub
                  </a>
                )}
                {config.social_links.linkedin?.enabled && config.social_links.linkedin.url && (
                  <a
                    href={config.social_links.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium transition-transform hover:-translate-y-0.5 inline-block"
                  >
                    LinkedIn
                  </a>
                )}
                {config.social_links.instagram?.enabled && config.social_links.instagram.url && (
                  <a
                    href={config.social_links.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium transition-transform hover:-translate-y-0.5 inline-block"
                  >
                    Instagram
                  </a>
                )}
                {config.social_links.facebook?.enabled && config.social_links.facebook.url && (
                  <a
                    href={config.social_links.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium transition-transform hover:-translate-y-0.5 inline-block"
                  >
                    Facebook
                  </a>
                )}
                {config.social_links.x?.enabled && config.social_links.x.url && (
                  <a
                    href={config.social_links.x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium transition-transform hover:-translate-y-0.5 inline-block"
                  >
                    Twitter / X
                  </a>
                )}
                {config.social_links.youtube?.enabled && config.social_links.youtube.url && (
                  <a
                    href={config.social_links.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-500 font-medium transition-transform hover:-translate-y-0.5 inline-block"
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
                {footerNavLinks.map((lnk, idx) => (
                  <li key={idx}>
                    <Link to={lnk.url} className="hover:text-indigo-500 transition-colors">
                      {lnk.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
                Disciplines &amp; Work
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/categories" className="hover:text-indigo-500 transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-indigo-500 transition-colors">
                    Android Applications
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-indigo-500 transition-colors">
                    UI/UX Design Systems
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-indigo-500 transition-colors">
                    All Specializations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
                Inquiries &amp; Contact
              </h4>
              <p className="text-xs leading-relaxed mb-3">
                {config.contact_address}
              </p>
              <a
                href="tel:+923093534289"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text)] hover:text-emerald-600 transition-colors mb-3"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                03093534289
              </a>
              <a
                href="https://wa.me/923093534289"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition hover:-translate-y-0.5 shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                WhatsApp Direct
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <div>{config.footer_copyright}</div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-indigo-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-indigo-500 transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </RevealSection>
      </footer>
    </div>
  );
};
