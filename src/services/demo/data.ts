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

// Intentionally empty until real records are added by the site administrator.
export const mockCategories: Category[] = [];
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
