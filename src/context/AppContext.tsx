import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig, defaultSiteConfig } from '../types/siteConfig';
import { loadSeoSettings } from '../lib/siteSettings';

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

  // Hero & Sections
  'hero.badge': 'Official Academy Digital Team',
  'hero.title': 'Digital Excellence, Delivered.',
  'hero.subtitle': 'A private-plus-public operations and showcase platform. Every project is assigned, rigorously reviewed, and curated by Inspire leadership before public showcase.',
  'hero.ctaProjects': 'Explore Approved Work',
  'hero.ctaContact': 'Get in Touch',
  'sec.featuredProjects': 'Featured Projects',
  'sec.featuredSubtitle': 'Faculty-approved deliverables and real-world builds ready for inspection.',
  'sec.viewAllProjects': 'View All Projects',
  'sec.categoriesTitle': 'Categories & Technical Domains',
  'sec.categoriesSubtitle': 'Specialized disciplines mentored and delivered inside Inspire.',
  'sec.teamTitle': 'Meet Our Team',
  'sec.teamSubtitle': 'Verified academy engineers, designers, and project leads.',
  'sec.viewAllTeam': 'View All Team Members',
  'sec.ctaTitle': 'Ready to collaborate or join our academy?',
  'sec.ctaDesc': 'Reach out to discuss customized digital builds, training partnerships, or team capabilities.',

  // Common UI
  'common.loading': 'Loading data...',
  'common.demoBanner': '',
  'common.switchRole': '',
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

  // Hero & Sections
  'hero.badge': 'آفیشل اکیڈمی ڈیجیٹل ٹیم',
  'hero.title': 'معیاری ڈیجیٹل خدمات، بروقت تکمیل۔',
  'hero.subtitle': 'انسپائر اکیڈمی کا پرائیویٹ اور پبلک پراجیکٹ شو کیس پلیٹ فارم۔ ہر پراجیکٹ کی باقاعدہ جانچ اور منظوری کے بعد اشاعت کی جاتی ہے۔',
  'hero.ctaProjects': 'منظور شدہ پراجیکٹس دیکھیں',
  'hero.ctaContact': 'رابطہ کریں',
  'sec.featuredProjects': 'نمایاں پراجیکٹس',
  'sec.featuredSubtitle': 'فیکلٹی کی جانب سے منظور شدہ اور معیار کے مطابق تیار کردہ پراجیکٹس۔',
  'sec.viewAllProjects': 'تمام پراجیکٹس دیکھیں',
  'sec.categoriesTitle': 'شعبہ جات اور تکنیکی مہارتیں',
  'sec.categoriesSubtitle': 'انسپائر اکیڈمی میں تربیت اور پراجیکٹ ڈیلیوری کے بنیادی شعبے۔',
  'sec.teamTitle': 'ہماری ٹیم سے ملیں',
  'sec.teamSubtitle': 'تربیت یافتہ انجینئرز، ڈیزائنرز اور پراجیکٹ لیڈز۔',
  'sec.viewAllTeam': 'پوری ٹیم دیکھیں',
  'sec.ctaTitle': 'کیا آپ ہمارے ساتھ کام کرنا یا اکیڈمی میں شامل ہونا چاہتے ہیں؟',
  'sec.ctaDesc': 'ڈیجیٹل پراجیکٹس، تربیتی شراکت داری یا ٹیم کی خدمات کے لیے رابطہ کریں۔',

  // Common UI
  'common.loading': 'لوڈ ہو رہا ہے...',
  'common.demoBanner': '',
  'common.switchRole': '',
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
        const parsed = { ...defaultSiteConfig, ...JSON.parse(saved) } as SiteConfig;
        return {
          ...parsed,
          hero_btn1_link:
            parsed.hero_btn1_link === '/projects' ? '/team' : parsed.hero_btn1_link,
          navigation_items: (parsed.navigation_items || defaultSiteConfig.navigation_items).filter(
            (item) => item.path !== '/projects'
          ),
          footer_nav_links: (parsed.footer_nav_links || defaultSiteConfig.footer_nav_links).filter(
            (lnk) => lnk.url !== '/projects'
          ),
        };
      }
    } catch {
      // fallback
    }
    return defaultSiteConfig;
  });

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      updated.navigation_items = (updated.navigation_items || []).filter(
        (item) => item.path !== '/projects'
      );
      updated.footer_nav_links = (updated.footer_nav_links || []).filter(
        (lnk) => lnk.url !== '/projects'
      );
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

  // Load shared SEO settings from Supabase so changes apply across browsers and visitors.
  useEffect(() => {
    let active = true;
    loadSeoSettings()
      .then((saved) => {
        if (!active || !Object.keys(saved).length) return;
        setConfig((prev) => {
          const updated = { ...prev, ...saved };
          localStorage.setItem('inspire_site_config', JSON.stringify(updated));
          return updated;
        });
      })
      .catch((error) => console.error('Unable to load shared SEO settings:', error));
    return () => { active = false; };
  }, []);

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
