import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig, defaultSiteConfig } from '../types/siteConfig';

export type Language = 'en' | 'ur';
export type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string, fallback?: string) => string;
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const enDict: Record<string, string> = {
  // Navigation & Brand
  'nav.home': 'Home',
  'nav.about': 'About Us',
  'nav.team': 'Meet Our Team',
  'nav.projects': 'Portfolio Projects',
  'nav.categories': 'Categories',
  'nav.showcase': 'Showcases',
  'nav.contact': 'Contact Us',
  'nav.adminPortal': 'Admin Portal',
  'nav.memberPortal': 'Member Portal',
  'nav.login': 'Sign In',
  'nav.logout': 'Sign Out',
  'nav.pdfTool': 'Image to PDF',

  // Statuses
  'status.draft': 'Draft',
  'status.submitted': 'Submitted',
  'status.under_review': 'Under Review',
  'status.changes_requested': 'Changes Requested',
  'status.published': 'Published',
  'status.rejected': 'Rejected',
  'status.archived': 'Archived',
  'status.assigned': 'Assigned',
  'status.in_progress': 'In Progress',
  'status.blocked': 'Blocked',
  'status.completed': 'Completed',

  // Actions
  'action.save': 'Save',
  'action.cancel': 'Cancel',
  'action.submit': 'Submit for Review',
  'action.approvePublish': 'Approve & Publish',
  'action.requestChanges': 'Request Changes',
  'action.reject': 'Reject',
  'action.delete': 'Delete',
  'action.preview': 'Live Preview',
  'action.generatePdf': 'Convert to PDF',
  'action.download': 'Download',
  'action.filter': 'Filter',
  'action.search': 'Search',
  'action.contactWhatsapp': 'Chat on WhatsApp',
  'action.sendMessage': 'Send Message',

  // Common UI
  'common.loading': 'Loading data...',
  'common.demoBanner': 'DEMO MODE ACTIVE — Using in-memory operational data. Ready for Supabase connection.',
  'common.switchRole': 'Switch Demo Role:',
  'common.roleAdmin': 'Super Admin',
  'common.roleMember': 'Team Member',
  'common.roleVisitor': 'Public Visitor',
};

const urDict: Record<string, string> = {
  // Navigation & Brand
  'nav.home': 'صفحہ اول',
  'nav.about': 'ہمارے متعلق',
  'nav.team': 'ہماری ٹیم',
  'nav.projects': 'پورٹ فولیو پراجیکٹس',
  'nav.categories': 'شعبہ جات',
  'nav.showcase': 'شو کیس',
  'nav.contact': 'رابطہ کریں',
  'nav.adminPortal': 'ایڈمن پورٹل',
  'nav.memberPortal': 'ممبر پورٹل',
  'nav.login': 'لاگ اِن',
  'nav.logout': 'لاگ آؤٹ',
  'nav.pdfTool': 'تصاویر سے پی ڈی ایف',

  // Statuses
  'status.draft': 'ڈرافٹ',
  'status.submitted': 'جمع شدہ',
  'status.under_review': 'زیرِ جائزہ',
  'status.changes_requested': 'تبدیلی درکار',
  'status.published': 'شائع شدہ',
  'status.rejected': 'مسترد',
  'status.archived': 'محفوظ شدہ',
  'status.assigned': 'سونپا گیا',
  'status.in_progress': 'جاری',
  'status.blocked': 'مسئلہ درپیش',
  'status.completed': 'مکمل',

  // Actions
  'action.save': 'محفوظ کریں',
  'action.cancel': 'منسوخ',
  'action.submit': 'جائزے کیلئے جمع کریں',
  'action.approvePublish': 'منظور کریں اور شائع کریں',
  'action.requestChanges': 'تبدیلی طلب کریں',
  'action.reject': 'مسترد کریں',
  'action.delete': 'حذف کریں',
  'action.preview': 'پیشگی منظر',
  'action.generatePdf': 'پی ڈی ایف بنائیں',
  'action.download': 'ڈاؤن لوڈ',
  'action.filter': 'فلٹر',
  'action.search': 'تلاش کریں',
  'action.contactWhatsapp': 'واٹس ایپ پر رابطہ کریں',
  'action.sendMessage': 'پیغام بھیجیں',

  // Common UI
  'common.loading': 'لوڈ ہو رہا ہے...',
  'common.demoBanner': 'ڈیمو موڈ فعال ہے — یہ نمونہ ڈیٹا پر چل رہا ہے جو سپابیس سے فوری منسلک ہو سکتا ہے۔',
  'common.switchRole': 'ڈیمو کردار تبدیل کریں:',
  'common.roleAdmin': 'سپر ایڈمن',
  'common.roleMember': 'ٹیم ممبر',
  'common.roleVisitor': 'عام وزٹر',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('inspire_lang') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('inspire_theme') as Theme) || 'light';
  });

  // Site Configuration from site_settings (persisted locally for instant dynamic updates)
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('inspire_site_config');
      if (saved) {
        return { ...defaultSiteConfig, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return defaultSiteConfig;
  });

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('inspire_site_config', JSON.stringify(updated));
      return updated;
    });
  };

  const resetConfig = () => {
    localStorage.removeItem('inspire_site_config');
    setConfig(defaultSiteConfig);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('inspire_lang', newLang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('inspire_theme', newTheme);
  };

  // Sync Dynamic CSS variables for live Color & Typography control
  useEffect(() => {
    const root = document.documentElement;
    if (config.color_primary) {
      root.style.setProperty('--primary', config.color_primary);
      root.style.setProperty('--focus-ring', config.color_primary);
    }
    if (config.color_secondary) {
      root.style.setProperty('--secondary', config.color_secondary);
    }
    if (config.color_bg && theme === 'light') {
      root.style.setProperty('--bg', config.color_bg);
    }
    if (config.color_text && theme === 'light') {
      root.style.setProperty('--text', config.color_text);
    }
  }, [config, theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [theme]);

  const t = (key: string, fallback?: string): string => {
    const dict = lang === 'ur' ? urDict : enDict;
    return dict[key] || fallback || key;
  };

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t, config, updateConfig, resetConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
