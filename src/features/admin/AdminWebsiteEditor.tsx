import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Save,
  CheckCircle2,
  Layers,
  FileText,
  Phone,
  LayoutTemplate,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const AdminWebsiteEditor: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'footer' | 'nav'>('home');
  const [saveToast, setSaveToast] = useState(false);

  // Form states initialized with live config
  const [heroHeading, setHeroHeading] = useState(config.hero_heading);
  const [heroSubheading, setHeroSubheading] = useState(config.hero_subheading);
  const [heroBadge, setHeroBadge] = useState(config.hero_badge);
  const [heroBtn1Text, setHeroBtn1Text] = useState(config.hero_btn1_text);
  const [heroBtn1Link, setHeroBtn1Link] = useState(config.hero_btn1_link);
  const [heroBtn2Text, setHeroBtn2Text] = useState(config.hero_btn2_text);
  const [heroBtn2Link, setHeroBtn2Link] = useState(config.hero_btn2_link);
  const [heroVisible, setHeroVisible] = useState(config.hero_visible);

  // About Preview states
  const [aboutPreviewVisible, setAboutPreviewVisible] = useState(config.about_preview_visible);
  const [aboutPreviewHeading, setAboutPreviewHeading] = useState(config.about_preview_heading);
  const [aboutPreviewText, setAboutPreviewText] = useState(config.about_preview_text);

  // Services states
  const [servicesVisible, setServicesVisible] = useState(config.services_visible);
  const [services, setServices] = useState(config.services);

  // CTA states
  const [ctaVisible, setCtaVisible] = useState(config.cta_visible);
  const [ctaHeading, setCtaHeading] = useState(config.cta_heading);
  const [ctaSubheading, setCtaSubheading] = useState(config.cta_subheading);
  const [ctaBtnText, setCtaBtnText] = useState(config.cta_btn_text);
  const [ctaBtnLink, setCtaBtnLink] = useState(config.cta_btn_link);

  // About Page full editor
  const [aboutHeading, setAboutHeading] = useState(config.about_heading);
  const [aboutFullText, setAboutFullText] = useState(config.about_full_text);
  const [aboutMission, setAboutMission] = useState(config.about_mission);
  const [aboutVision, setAboutVision] = useState(config.about_vision);

  // Contact Page editor
  const [contactHeading, setContactHeading] = useState(config.contact_heading);
  const [contactSubheading, setContactSubheading] = useState(config.contact_subheading);
  const [contactEmail, setContactEmail] = useState(config.contact_email);
  const [contactPhone, setContactPhone] = useState(config.contact_phone);
  const [contactAddress, setContactAddress] = useState(config.contact_address);
  const [contactFormEnabled, setContactFormEnabled] = useState(config.contact_form_enabled);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsapp_number);

  // Footer & Nav
  const [footerTagline, setFooterTagline] = useState(config.footer_tagline);
  const [footerCopyright, setFooterCopyright] = useState(config.footer_copyright);
  const [navItems, setNavItems] = useState(config.navigation_items);

  const handleSave = () => {
    updateConfig({
      hero_heading: heroHeading,
      hero_subheading: heroSubheading,
      hero_badge: heroBadge,
      hero_btn1_text: heroBtn1Text,
      hero_btn1_link: heroBtn1Link,
      hero_btn2_text: heroBtn2Text,
      hero_btn2_link: heroBtn2Link,
      hero_visible: heroVisible,

      about_preview_visible: aboutPreviewVisible,
      about_preview_heading: aboutPreviewHeading,
      about_preview_text: aboutPreviewText,

      services_visible: servicesVisible,
      services,

      cta_visible: ctaVisible,
      cta_heading: ctaHeading,
      cta_subheading: ctaSubheading,
      cta_btn_text: ctaBtnText,
      cta_btn_link: ctaBtnLink,

      about_heading: aboutHeading,
      about_full_text: aboutFullText,
      about_mission: aboutMission,
      about_vision: aboutVision,

      contact_heading: contactHeading,
      contact_subheading: contactSubheading,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      contact_address: contactAddress,
      contact_form_enabled: contactFormEnabled,
      whatsapp_number: whatsappNumber,

      footer_tagline: footerTagline,
      footer_copyright: footerCopyright,
      navigation_items: navItems,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAddService = () => {
    const newSrv = {
      id: `srv-${Date.now()}`,
      icon: 'Sparkles',
      title: 'New Discipline Service',
      description: 'Describe the new digital skill or offering provided by the academy.',
    };
    setServices([...services, newSrv]);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleToggleNav = (id: string) => {
    setNavItems(
      navItems.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-indigo-400" />
            Website Content Control (CMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit text, headings, buttons, and section visibility across the public website. Zero code required.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website content updated successfully! Live website will instantly reflect your changes.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold gap-1">
        {[
          { id: 'home', label: '1A. Homepage Editor' },
          { id: 'about', label: '1B. About Page' },
          { id: 'contact', label: '1C. Contact Page' },
          { id: 'footer', label: '1D. Footer Editor' },
          { id: 'nav', label: '1E. Navigation Menu' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-4 rounded-t-xl transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1A: HOMEPAGE */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                Hero Section
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroVisible}
                  onChange={(e) => setHeroVisible(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Visible on Homepage</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Badge Text</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Main Heading</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Subheading Description</label>
              <textarea
                rows={3}
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60">
                <div className="text-xs font-semibold text-indigo-400">Primary Button</div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Button Text</label>
                  <input
                    type="text"
                    value={heroBtn1Text}
                    onChange={(e) => setHeroBtn1Text(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Target Link</label>
                  <input
                    type="text"
                    value={heroBtn1Link}
                    onChange={(e) => setHeroBtn1Link(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60">
                <div className="text-xs font-semibold text-teal-400">Secondary Button</div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Button Text</label>
                  <input
                    type="text"
                    value={heroBtn2Text}
                    onChange={(e) => setHeroBtn2Text(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Target Link</label>
                  <input
                    type="text"
                    value={heroBtn2Link}
                    onChange={(e) => setHeroBtn2Link(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                Services & Disciplines Cards
              </h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={servicesVisible}
                    onChange={(e) => setServicesVisible(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Show Section</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Card #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(srv.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={srv.title}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].title = e.target.value;
                      setServices(updated);
                    }}
                    placeholder="Card Title"
                    className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    value={srv.description}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].description = e.target.value;
                      setServices(updated);
                    }}
                    placeholder="Short description"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Bottom Call-to-Action (CTA) Band
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaVisible}
                  onChange={(e) => setCtaVisible(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Show CTA</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">CTA Heading</label>
                <input
                  type="text"
                  value={ctaHeading}
                  onChange={(e) => setCtaHeading(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Button Label</label>
                <input
                  type="text"
                  value={ctaBtnText}
                  onChange={(e) => setCtaBtnText(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">CTA Sub-text</label>
              <textarea
                rows={2}
                value={ctaSubheading}
                onChange={(e) => setCtaSubheading(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 1B: ABOUT PAGE */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileText className="w-4 h-4 text-indigo-400" />
              About Page Content
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Page Heading</label>
              <input
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Full About Text</label>
              <textarea
                rows={6}
                value={aboutFullText}
                onChange={(e) => setAboutFullText(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Mission Statement</label>
                <textarea
                  rows={3}
                  value={aboutMission}
                  onChange={(e) => setAboutMission(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Vision Statement</label>
                <textarea
                  rows={3}
                  value={aboutVision}
                  onChange={(e) => setAboutVision(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1C: CONTACT PAGE */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Phone className="w-4 h-4 text-emerald-400" />
              Contact Page & Direct Routing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Page Heading</label>
                <input
                  type="text"
                  value={contactHeading}
                  onChange={(e) => setContactHeading(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Public Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Hotline Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">WhatsApp Direct Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+923001234567"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Campus Physical Address</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactFormEnabled}
                  onChange={(e) => setContactFormEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Enable Public Contact Submission Form</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1D: FOOTER */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Footer Text & Copyright
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Footer Tagline</label>
              <textarea
                rows={2}
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Copyright Text</label>
              <input
                type="text"
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 1E: NAVIGATION */}
      {activeTab === 'nav' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
            Navigation Menu Editor
          </h3>
          <p className="text-xs text-slate-400">
            Toggle visibility and manage route links in the public header navbar.
          </p>

          <div className="space-y-2">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{item.label}</span>
                  <span className="text-slate-500 font-mono ms-3">{item.path}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNav(item.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                    item.enabled
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {item.enabled ? 'Enabled' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
