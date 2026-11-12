import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Save,
  CheckCircle2,
  Globe2,
  Sparkles,
  ShieldCheck,
  FileCode,
  Layers,
} from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [saveToast, setSaveToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'analytics'>('global');

  // Global SEO States
  const [defaultTitle, setDefaultTitle] = useState(config.seo_default_title || 'Inspire Academy — Elite Engineering & Student Portfolios');
  const [defaultDesc, setDefaultDesc] = useState(
    config.seo_default_description ||
      'Official portfolio and academic project repository of Inspire Academy. Discover production-grade web applications, mobile interfaces, and AI prototypes.'
  );
  const [defaultOgImage, setDefaultOgImage] = useState(config.seo_default_og_image || '');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(config.google_analytics_id || '');
  const [searchConsoleCode, setSearchConsoleCode] = useState(config.google_search_console_code || '');

  // Per-Page Titles
  const [homeTitle, setHomeTitle] = useState(config.seo_pages?.home?.title || 'Inspire Academy | Home & Featured Work');
  const [homeDesc, setHomeDesc] = useState(config.seo_pages?.home?.description || 'Curated academic and production deliverables.');
  const [projectsTitle, setProjectsTitle] = useState(config.seo_pages?.projects?.title || 'Projects Showcase | Inspire Academy');
  const [projectsDesc, setProjectsDesc] = useState(config.seo_pages?.projects?.description || 'Browse approved client builds and systems.');
  const [teamTitle, setTeamTitle] = useState(config.seo_pages?.team?.title || 'Engineering Faculty & Members | Inspire Academy');
  const [teamDesc, setTeamDesc] = useState(config.seo_pages?.team?.description || 'Meet our certified engineers and designers.');
  const [aboutTitle, setAboutTitle] = useState(config.seo_pages?.about?.title || 'About Our Academy & Mission | Inspire Academy');
  const [aboutDesc, setAboutDesc] = useState(config.seo_pages?.about?.description || 'Academic rigor and verifiable engineering.');
  const [contactTitle, setContactTitle] = useState(config.seo_pages?.contact?.title || 'Contact Admissions & Faculty | Inspire Academy');
  const [contactDesc, setContactDesc] = useState(config.seo_pages?.contact?.description || 'Get in touch for inquiries and partnerships.');

  const handleSave = () => {
    updateConfig({
      seo_default_title: defaultTitle,
      seo_default_description: defaultDesc,
      seo_default_og_image: defaultOgImage,
      google_analytics_id: googleAnalyticsId,
      google_search_console_code: searchConsoleCode,
      seo_pages: {
        home: { title: homeTitle, description: homeDesc, og_image: defaultOgImage },
        projects: { title: projectsTitle, description: projectsDesc },
        team: { title: teamTitle, description: teamDesc },
        about: { title: aboutTitle, description: aboutDesc },
        contact: { title: contactTitle, description: contactDesc },
      },
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Search Engine Optimization (SEO)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure OpenGraph social cards, Google Search previews, meta tags, and indexing policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
        >
          <Save className="w-4 h-4" />
          <span>Save SEO Configuration</span>
        </button>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>SEO and metadata updated successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'global'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>Global SEO & Metadata</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'pages'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Per-Page Titles & Overrides</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'analytics'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Webmaster & Analytics</span>
        </button>
      </div>

      {/* Tab 1: Global SEO */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Default Site Metadata
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={defaultTitle}
                  onChange={(e) => setDefaultTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                  <span>Optimal: 50-60 characters</span>
                  <span>{defaultTitle.length} characters</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={defaultDesc}
                  onChange={(e) => setDefaultDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                  <span>Optimal: 120-160 characters</span>
                  <span>{defaultDesc.length} characters</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  OpenGraph Social Card Image URL (1200x630 recommended)
                </label>
                <input
                  type="text"
                  value={defaultOgImage}
                  onChange={(e) => setDefaultOgImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Right: SERP & Social Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Google Search Snippet Preview
                </h3>
              </div>

              {/* Mock Google Result Card */}
              <div className="p-4 rounded-xl bg-white text-slate-900 space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                    IA
                  </div>
                  <span>inspireacademy.edu</span>
                  <span className="text-slate-400">› showcase</span>
                </div>
                <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                  {defaultTitle || 'Inspire Academy'}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {defaultDesc || 'Inspire Academy showcases student engineering deliverables and software projects.'}
                </p>
              </div>

              {/* Mock OG Social Share Card */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300">Social Share Card (X / LinkedIn)</h4>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  {defaultOgImage ? (
                    <img
                      src={defaultOgImage}
                      alt="OG Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-slate-900 flex items-center justify-center text-xs text-slate-600">
                      No OG Image Set
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      inspireacademy.edu
                    </div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{defaultTitle}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{defaultDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Per Page Titles */}
      {activeTab === 'pages' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Custom Page Titles & Descriptions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <label className="block text-xs font-bold text-indigo-400">
                Homepage SEO
              </label>
              <input
                type="text"
                value={homeTitle}
                onChange={(e) => setHomeTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={homeDesc}
                onChange={(e) => setHomeDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <label className="block text-xs font-bold text-teal-400">
                Projects Showcase Page
              </label>
              <input
                type="text"
                value={projectsTitle}
                onChange={(e) => setProjectsTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={projectsDesc}
                onChange={(e) => setProjectsDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <label className="block text-xs font-bold text-amber-400">
                Team Directory Page
              </label>
              <input
                type="text"
                value={teamTitle}
                onChange={(e) => setTeamTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={teamDesc}
                onChange={(e) => setTeamDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <label className="block text-xs font-bold text-purple-400">
                About Academy Page
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <label className="block text-xs font-bold text-emerald-400">
                Contact Page
              </label>
              <input
                type="text"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={contactDesc}
                onChange={(e) => setContactDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Webmaster & Analytics */}
      {activeTab === 'analytics' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Verification & Analytics Tracking
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Leave blank if no tracking tag is desired.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Search Console Verification Meta Tag
              </label>
              <input
                type="text"
                value={searchConsoleCode}
                onChange={(e) => setSearchConsoleCode(e.target.value)}
                placeholder="google-site-verification token"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Injected in the site header for domain verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
