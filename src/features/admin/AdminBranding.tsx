import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Palette,
  Image as ImageIcon,
  Type,
  Save,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Eye,
  Sliders,
} from 'lucide-react';

const PRESET_PALETTES = [
  {
    name: 'Inspire Indigo (Default)',
    primary: '#4338CA',
    secondary: '#0F766E',
    bg: '#F8FAFC',
    text: '#0F172A',
    header: '#FFFFFF',
    footer: '#0F172A',
  },
  {
    name: 'Midnight Ocean',
    primary: '#0284C7',
    secondary: '#0D9488',
    bg: '#0F172A',
    text: '#F8FAFC',
    header: '#1E293B',
    footer: '#020617',
  },
  {
    name: 'Emerald Academic',
    primary: '#059669',
    secondary: '#D97706',
    bg: '#F0FDF4',
    text: '#064E3B',
    header: '#FFFFFF',
    footer: '#064E3B',
  },
  {
    name: 'Royal Purple',
    primary: '#7C3AED',
    secondary: '#EC4899',
    bg: '#FAF5FF',
    text: '#3B0764',
    header: '#FFFFFF',
    footer: '#2E1065',
  },
  {
    name: 'Crimson Tech',
    primary: '#DC2626',
    secondary: '#4F46E5',
    bg: '#FFF1F2',
    text: '#4C0519',
    header: '#FFFFFF',
    footer: '#18181B',
  },
];

const FONTS_LIST = [
  'Plus Jakarta Sans',
  'Inter',
  'Outfit',
  'Space Grotesk',
  'Geist',
  'system-ui',
];

export const AdminBranding: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [saveToast, setSaveToast] = useState(false);

  // Form states matching SiteConfig
  const [siteName, setSiteName] = useState(config.site_name);
  const [siteTagline, setSiteTagline] = useState(config.site_tagline);
  const [logoUrl, setLogoUrl] = useState(config.logo_url);
  const [faviconUrl, setFaviconUrl] = useState(config.favicon_url);

  // Colors
  const [colorPrimary, setColorPrimary] = useState(config.color_primary || '#4338CA');
  const [colorSecondary, setColorSecondary] = useState(config.color_secondary || '#0F766E');
  const [colorBg, setColorBg] = useState(config.color_bg || '#F8FAFC');
  const [colorText, setColorText] = useState(config.color_text || '#0F172A');
  const [colorHeaderBg, setColorHeaderBg] = useState(config.color_header_bg || '#FFFFFF');
  const [colorFooterBg, setColorFooterBg] = useState(config.color_footer_bg || '#0F172A');

  // Typography
  const [fontHeading, setFontHeading] = useState(config.font_heading || 'Plus Jakarta Sans');
  const [fontBody, setFontBody] = useState(config.font_body || 'Inter');
  const [fontSizeBase, setFontSizeBase] = useState<'small' | 'medium' | 'large'>(config.font_size_base || 'medium');

  const handleApplyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setColorPrimary(preset.primary);
    setColorSecondary(preset.secondary);
    setColorBg(preset.bg);
    setColorText(preset.text);
    setColorHeaderBg(preset.header);
    setColorFooterBg(preset.footer);
  };

  const handleSave = () => {
    updateConfig({
      site_name: siteName,
      site_tagline: siteTagline,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      color_primary: colorPrimary,
      color_secondary: colorSecondary,
      color_bg: colorBg,
      color_text: colorText,
      color_header_bg: colorHeaderBg,
      color_footer_bg: colorFooterBg,
      font_heading: fontHeading,
      font_body: fontBody,
      font_size_base: fontSizeBase,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetDefaults = () => {
    handleApplyPreset(PRESET_PALETTES[0]);
    setFontHeading('Plus Jakarta Sans');
    setFontBody('Inter');
    setFontSizeBase('medium');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Branding & Appearance
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure website logo, custom color palettes, and global typography with zero code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Colors</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Save Branding</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Branding styles applied instantly to public website!</span>
        </div>
      )}

      {/* Grid: Settings on left, Real-time preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Quick Preset Themes */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Instant Color Schemes
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Click any curated palette to immediately adapt your site’s tone:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_PALETTES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800/50 text-left transition group"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    {preset.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: preset.bg }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Identity & Logos */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Identity & Logos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academy Site Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academy Tagline
                </label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Logo URL or SVG path (Leave empty to use default icon)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="e.g. /logo.svg or https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  {logoUrl && (
                    <button
                      onClick={() => setLogoUrl('')}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Favicon URL (.ico / .png)
                </label>
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="/favicon.ico"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Custom Color Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Custom Palette Colors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Primary Accent</label>
                  <span className="text-[10px] text-slate-500 font-mono">{colorPrimary}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorPrimary}
                    onChange={(e) => setColorPrimary(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorPrimary}
                    onChange={(e) => setColorPrimary(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Secondary Accent</label>
                  <span className="text-[10px] text-slate-500 font-mono">{colorSecondary}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorSecondary}
                    onChange={(e) => setColorSecondary(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorSecondary}
                    onChange={(e) => setColorSecondary(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Page Background</label>
                  <span className="text-[10px] text-slate-500 font-mono">{colorBg}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorBg}
                    onChange={(e) => setColorBg(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorBg}
                    onChange={(e) => setColorBg(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Primary Typography</label>
                  <span className="text-[10px] text-slate-500 font-mono">{colorText}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorText}
                    onChange={(e) => setColorText(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorText}
                    onChange={(e) => setColorText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Header Color */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Header Nav Bar</label>
                  <span className="text-[10px] text-slate-500 font-mono">{colorHeaderBg}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorHeaderBg}
                    onChange={(e) => setColorHeaderBg(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorHeaderBg}
                    onChange={(e) => setColorHeaderBg(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Footer Color */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Footer Bar</label>
                  <span className="text-[10px] text-slate-500 font-mono">{colorFooterBg}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorFooterBg}
                    onChange={(e) => setColorFooterBg(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorFooterBg}
                    onChange={(e) => setColorFooterBg(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Typography & Font Family
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Heading Font
                </label>
                <select
                  value={fontHeading}
                  onChange={(e) => setFontHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {FONTS_LIST.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Body Font
                </label>
                <select
                  value={fontBody}
                  onChange={(e) => setFontBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {FONTS_LIST.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Base Font Scale
                </label>
                <select
                  value={fontSizeBase}
                  onChange={(e) => setFontSizeBase(e.target.value as 'small' | 'medium' | 'large')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="small">Compact (Small)</option>
                  <option value="medium">Standard (Medium)</option>
                  <option value="large">Spacious (Large)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live UI Preview
                </h3>
              </div>
              <span className="text-[10px] text-slate-500">Updates as you edit</span>
            </div>

            {/* Browser frame preview */}
            <div
              className="rounded-2xl border border-slate-800 overflow-hidden shadow-2xl transition-all"
              style={{
                backgroundColor: colorBg,
                color: colorText,
                fontFamily: fontBody,
              }}
            >
              {/* Header preview */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{
                  backgroundColor: colorHeaderBg || '#ffffff',
                  borderColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                    style={{ backgroundColor: colorPrimary }}
                  >
                    IA
                  </div>
                  <span className="text-xs font-bold truncate" style={{ color: colorText, fontFamily: fontHeading }}>
                    {siteName || 'Inspire Academy'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-75">
                  <span>Projects</span>
                  <span>Team</span>
                  <span>Contact</span>
                </div>
              </div>

              {/* Hero preview */}
              <div className="p-6 text-center space-y-3">
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: `${colorPrimary}20`,
                    color: colorPrimary,
                  }}
                >
                  ACADEMY SHOWCASE
                </span>
                <h4
                  className="text-base font-extrabold leading-snug"
                  style={{ color: colorText, fontFamily: fontHeading }}
                >
                  Building High-Impact Web & AI Systems
                </h4>
                <p className="text-[11px] opacity-70 max-w-xs mx-auto">
                  Curated academic deliverables and verified engineer portfolios.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-white text-[11px] font-bold shadow-sm"
                    style={{ backgroundColor: colorPrimary }}
                  >
                    Explore Projects
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border"
                    style={{
                      borderColor: `${colorText}30`,
                      color: colorText,
                    }}
                  >
                    Meet Team
                  </button>
                </div>
              </div>

              {/* Sample Card */}
              <div className="p-4 mx-4 mb-4 rounded-xl border bg-white/70 backdrop-blur-sm space-y-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-600">FEATURED PROJECT</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colorSecondary }}
                  />
                </div>
                <div className="text-xs font-bold" style={{ color: colorText, fontFamily: fontHeading }}>
                  Your Project Title
                </div>
                <div className="text-[10px] opacity-70">
                  Real-time data visualization platform with encrypted export tooling.
                </div>
              </div>

              {/* Footer preview */}
              <div
                className="px-4 py-3 text-center text-[10px] text-slate-300"
                style={{ backgroundColor: colorFooterBg || '#0f172a' }}
              >
                © 2026 {siteName || 'Inspire Academy'}. All rights reserved.
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-white">How styling works:</div>
              <p className="text-[11px] leading-relaxed">
                Saving updates CSS custom variables (<code className="text-indigo-400 font-mono">--primary</code>, <code className="text-indigo-400 font-mono">--secondary</code>, <code className="text-indigo-400 font-mono">--bg</code>, <code className="text-indigo-400 font-mono">--text</code>) globally. The entire public experience updates instantly without compiling code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
