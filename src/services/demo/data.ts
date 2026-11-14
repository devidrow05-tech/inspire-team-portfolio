import {
  Category,
  Tag,
  Profile,
  MemberProfile,
  Assignment,
  Project,
  PublishedProject,
  SiteSettings,
  PublicShowcase,
  NotificationItem,
  AuditLog,
} from '../../types/database';

// Portfolio disciplines inspired by the course categories shown on Inspire Business Academy.
export const mockCategories: Category[] = [
  {
    id: 'productivity',
    slug: 'productivity',
    name_en: 'Productivity',
    name_ur: 'پروڈکٹیوٹی',
    description_en: 'Computer fundamentals, hardware, operating systems, and office productivity tools such as Word, PowerPoint, and Excel.',
    description_ur: 'کمپیوٹر کی بنیادی معلومات، ہارڈویئر، آپریٹنگ سسٹمز اور آفس پروڈکٹیوٹی ٹولز۔',
    icon: 'laptop',
    project_type: 'general',
    sort_order: 1,
    is_active: true,
    created_at: '2026-11-15T00:00:00.000Z',
    updated_at: '2026-11-15T00:00:00.000Z',
  },
  {
    id: 'design-media',
    slug: 'design-media',
    name_en: 'Design & Media',
    name_ur: 'ڈیزائن اور میڈیا',
    description_en: 'Graphic design, Photoshop, video editing, and visual content creation.',
    description_ur: 'گرافک ڈیزائن، فوٹوشاپ، ویڈیو ایڈیٹنگ اور بصری مواد کی تخلیق۔',
    icon: 'palette',
    project_type: 'design',
    sort_order: 2,
    is_active: true,
    created_at: '2026-11-15T00:00:00.000Z',
    updated_at: '2026-11-15T00:00:00.000Z',
  },
  {
    id: 'technical-ai',
    slug: 'technical-ai',
    name_en: 'Technical & AI',
    name_ur: 'ٹیکنیکل اور اے آئی',
    description_en: 'AI tools, AI-assisted workflows, and web or mobile app development.',
    description_ur: 'اے آئی ٹولز، اے آئی سے معاون ورک فلو، ویب اور موبائل ایپ ڈیولپمنٹ۔',
    icon: 'cpu',
    project_type: 'general',
    sort_order: 3,
    is_active: true,
    created_at: '2026-11-15T00:00:00.000Z',
    updated_at: '2026-11-15T00:00:00.000Z',
  },
  {
    id: 'business-marketing',
    slug: 'business-marketing',
    name_en: 'Business & Marketing',
    name_ur: 'بزنس اور مارکیٹنگ',
    description_en: 'YouTube automation, Facebook page management, local dropshipping, and organic digital marketing.',
    description_ur: 'یوٹیوب آٹومیشن، فیس بک پیج مینجمنٹ، لوکل ڈراپ شپنگ اور آرگینک ڈیجیٹل مارکیٹنگ۔',
    icon: 'trending-up',
    project_type: 'general',
    sort_order: 4,
    is_active: true,
    created_at: '2026-11-15T00:00:00.000Z',
    updated_at: '2026-11-15T00:00:00.000Z',
  },
];
export const mockTags: Tag[] = [];
export const mockUsers: Profile[] = [];
export const mockMemberProfiles: MemberProfile[] = [];
export const mockPublishedProjects: PublishedProject[] = [];
export const mockWorkingProjects: Project[] = [];
export const mockAssignments: Assignment[] = [];
export const mockShowcases: PublicShowcase[] = [];
export const mockNotifications: NotificationItem[] = [];
export const mockAuditLogs: AuditLog[] = [];
export const mockSiteSettings = {} as SiteSettings;
