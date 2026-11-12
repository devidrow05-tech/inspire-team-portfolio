export interface SiteConfig {
  // General & Identity
  site_name: string;
  site_tagline: string;
  logo_url: string;
  favicon_url: string;

  // Colors
  color_primary: string;
  color_secondary: string;
  color_bg: string;
  color_text: string;
  color_header_bg: string;
  color_footer_bg: string;

  // Typography
  font_heading: string;
  font_body: string;
  font_size_base: 'small' | 'medium' | 'large';

  // Theme
  default_theme: 'light' | 'dark' | 'system';

  // Homepage Hero
  hero_visible: boolean;
  hero_badge: string;
  hero_heading: string;
  hero_subheading: string;
  hero_btn1_text: string;
  hero_btn1_link: string;
  hero_btn2_text: string;
  hero_btn2_link: string;
  hero_bg_image: string;

  // Homepage Featured Projects
  featured_projects_count: number;
  featured_project_ids: string[];

  // Homepage Services / Specialties
  services_visible: boolean;
  services: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;

  // Homepage About Preview
  about_preview_visible: boolean;
  about_preview_heading: string;
  about_preview_text: string;
  about_preview_image: string;

  // Homepage CTA
  cta_visible: boolean;
  cta_heading: string;
  cta_subheading: string;
  cta_btn_text: string;
  cta_btn_link: string;

  // About Page
  about_heading: string;
  about_full_text: string;
  about_banner_image: string;
  about_mission: string;
  about_vision: string;
  about_values: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;

  // Contact Page
  contact_heading: string;
  contact_subheading: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_form_enabled: boolean;
  contact_fields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    subject: boolean;
    message: boolean;
  };
  contact_submission_email: string;
  whatsapp_number: string;

  // Footer
  footer_tagline: string;
  footer_copyright: string;
  footer_nav_links: Array<{ label: string; url: string }>;
  social_links: {
    github: { enabled: boolean; url: string };
    linkedin: { enabled: boolean; url: string };
    instagram: { enabled: boolean; url: string };
    facebook: { enabled: boolean; url: string };
    x: { enabled: boolean; url: string };
    youtube: { enabled: boolean; url: string };
  };

  // Navigation
  navigation_items: Array<{
    id: string;
    label: string;
    path: string;
    enabled: boolean;
  }>;

  // SEO
  seo_default_title: string;
  seo_default_description: string;
  seo_default_og_image: string;
  google_analytics_id: string;
  google_search_console_code: string;
  seo_pages: {
    home: { title: string; description: string; og_image: string };
    team: { title: string; description: string };
    projects: { title: string; description: string };
    about: { title: string; description: string };
    contact: { title: string; description: string };
  };

  // Maintenance & Custom Pages
  maintenance_mode: boolean;
  maintenance_message: string;
  privacy_content: string;
  terms_content: string;
  custom_404_heading: string;
  custom_404_message: string;
  custom_404_button_text: string;
}

export const defaultSiteConfig: SiteConfig = {
  site_name: 'Inspire Academy',
  site_tagline: 'Professional Digital Team & Academy Portfolio',
  logo_url: '',
  favicon_url: '',

  color_primary: '#4338CA',
  color_secondary: '#0F766E',
  color_bg: '#F8FAFC',
  color_text: '#0F172A',
  color_header_bg: '',
  color_footer_bg: '',

  font_heading: 'Plus Jakarta Sans',
  font_body: 'Inter',
  font_size_base: 'medium',

  default_theme: 'system',

  hero_visible: true,
  hero_badge: 'Official Academy Digital Team',
  hero_heading: 'Digital Excellence, Delivered.',
  hero_subheading: 'A private-plus-public operations and showcase platform. Every project is assigned, rigorously reviewed, and curated by Inspire Academy leadership before public showcase.',
  hero_btn1_text: 'Explore Approved Work',
  hero_btn1_link: '/projects',
  hero_btn2_text: 'Get in Touch',
  hero_btn2_link: '/contact',
  hero_bg_image: '',

  featured_projects_count: 3,
  featured_project_ids: ['pub-proj-1', 'pub-proj-2', 'pub-proj-3'],

  services_visible: true,
  services: [
    {
      id: 'srv-1',
      icon: 'Globe',
      title: 'Full-Stack Web Engineering',
      description: 'React, Next.js, Node.js, and high-performance server architectures.',
    },
    {
      id: 'srv-2',
      icon: 'Smartphone',
      title: 'Native Android Development',
      description: 'Modern Kotlin, Jetpack Compose, and offline-first mobile apps.',
    },
    {
      id: 'srv-3',
      icon: 'Palette',
      title: 'UI/UX & Design Systems',
      description: 'Bilingual token architectures, WCAG accessibility, and wireframe prototypes.',
    },
    {
      id: 'srv-4',
      icon: 'TrendingUp',
      title: 'Digital Growth & Technical SEO',
      description: 'Core Web Vitals tuning, conversion optimization, and brand scaling.',
    },
  ],

  about_preview_visible: true,
  about_preview_heading: 'Academic Rigor Meets Real-World Craft',
  about_preview_text: 'Inspire Academy bridges high-end technical training with disciplined production standards. Every project is quality audited before release.',
  about_preview_image: '',

  cta_visible: true,
  cta_heading: 'Ready to collaborate or join our academy?',
  cta_subheading: 'Reach out to discuss customized digital builds, training partnerships, or team capabilities.',
  cta_btn_text: 'Contact Us Today',
  cta_btn_link: '/contact',

  about_heading: 'About Inspire Academy',
  about_full_text: 'Inspire Academy operates as an elite digital institute dedicated to turning emerging engineers, designers, and marketers into world-class practitioners. Unlike standard portfolio sites where members self-publish unchecked work, Inspire Team enforces an iron-clad faculty approval workflow: every piece of public portfolio code, design token, or media is supervised, tested, and approved by the Super Admin.',
  about_banner_image: '',
  about_mission: 'To cultivate world-class software engineers, designers, and digital architects through rigorous real-world client-grade deliverables.',
  about_vision: 'A unified digital operations ecosystem where quality is guaranteed, transparency is absolute, and excellence is verifiable.',
  about_values: [
    {
      id: 'val-1',
      title: 'Zero Unapproved Leaks',
      description: 'Every deliverable is isolated in private storage until explicitly signed off by leadership.',
      icon: 'ShieldCheck',
    },
    {
      id: 'val-2',
      title: 'High Craft Standards',
      description: 'Assignments include clear acceptance criteria, responsive checks, and bilingual standards.',
      icon: 'Award',
    },
    {
      id: 'val-3',
      title: 'Verifiable Accountability',
      description: 'Immutable audit logs record every review, assignment transition, and publish event.',
      icon: 'Users',
    },
  ],

  contact_heading: 'Connect with Inspire Academy',
  contact_subheading: 'Reach out for corporate project consultations, academic programs, or technical team inquiries.',
  contact_email: 'contact@inspireacademy.edu',
  contact_phone: '+92 (0) 42 3578 9900',
  contact_address: 'Inspire Digital Campus, Tech Avenue, Lahore, Pakistan',
  contact_form_enabled: true,
  contact_fields: {
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
  },
  contact_submission_email: 'admin@inspireacademy.edu',
  whatsapp_number: '+923001234567',

  footer_tagline: 'The premier digital showcase and project operations platform of Inspire Academy. Curated, reviewed, and published by faculty leadership.',
  footer_copyright: '© 2026 Inspire Academy Team Hub. All Rights Reserved.',
  footer_nav_links: [
    { label: 'All Approved Projects', url: '/projects' },
    { label: 'Academy Specialists', url: '/team' },
    { label: 'Disciplines & Domains', url: '/categories' },
    { label: 'About Inspire Academy', url: '/about' },
  ],
  social_links: {
    github: { enabled: true, url: 'https://github.com/inspire-team' },
    linkedin: { enabled: true, url: 'https://linkedin.com/company/inspire-team' },
    instagram: { enabled: true, url: 'https://instagram.com/inspireacademy' },
    facebook: { enabled: true, url: 'https://facebook.com/inspireacademy' },
    x: { enabled: true, url: 'https://x.com/inspireteam' },
    youtube: { enabled: true, url: 'https://youtube.com/@inspireacademy' },
  },

  navigation_items: [
    { id: 'nav-1', label: 'Home', path: '/', enabled: true },
    { id: 'nav-2', label: 'Portfolio Projects', path: '/projects', enabled: true },
    { id: 'nav-3', label: 'Meet Our Team', path: '/team', enabled: true },
    { id: 'nav-4', label: 'Categories', path: '/categories', enabled: true },
    { id: 'nav-5', label: 'About Us', path: '/about', enabled: true },
    { id: 'nav-6', label: 'Contact Us', path: '/contact', enabled: true },
  ],

  seo_default_title: 'Inspire Academy — Digital Team Portfolio & Operations Hub',
  seo_default_description: 'Discover curated, audited projects and certified engineers from Inspire Academy.',
  seo_default_og_image: '',
  google_analytics_id: '',
  google_search_console_code: '',
  seo_pages: {
    home: {
      title: 'Inspire Academy — Professional Digital Team & Showcase',
      description: 'Explore approved, production-grade applications built by certified specialists.',
      og_image: '',
    },
    team: {
      title: 'Our Specialists & Engineers — Inspire Academy',
      description: 'Meet our certified software engineers, UI/UX designers, and mobile architects.',
    },
    projects: {
      title: 'Curated Portfolio Projects — Inspire Academy',
      description: 'Browse client-ready digital systems, mobile apps, and designs audited by faculty.',
    },
    about: {
      title: 'About Our Digital Academy & Standards — Inspire Academy',
      description: 'Pioneering technical excellence, rigorous quality gating, and certified craftsmanship.',
    },
    contact: {
      title: 'Contact Inspire Academy & Project Inquiries',
      description: 'Get in touch for custom digital development, student admissions, and corporate partnerships.',
    },
  },

  maintenance_mode: false,
  maintenance_message: 'We are currently performing scheduled maintenance on the public showcase. We will be back online shortly!',
  privacy_content: 'Inspire Academy complies with strict privacy and intellectual property standards. Private assignments, drafts, and client materials remain strictly isolated under Row-Level Security until authorized by leadership.',
  terms_content: 'All published projects on this platform represent verified, approved academic and commercial deliverables. Unapproved or student drafts are not accessible publicly.',
  custom_404_heading: 'Page Not Found',
  custom_404_message: 'The requested page or portfolio case study does not exist or has been relocated by academy administration.',
  custom_404_button_text: 'Return to Homepage',
};
