export type UserRole = 'admin' | 'member';
export type AccountStatus = 'active' | 'suspended' | 'deactivated';
export type ProjectStatus = 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'published' | 'rejected' | 'archived';
export type AssignmentStatus = 'assigned' | 'accepted' | 'in_progress' | 'blocked' | 'submitted_for_review' | 'revision_requested' | 'completed' | 'cancelled';
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReviewDecision = 'approved_published' | 'rejected' | 'changes_requested' | 'unpublished' | 'republished' | 'archived' | 'restored' | 'featured' | 'unfeatured';
export type FileKind = 'project_cover' | 'project_gallery' | 'project_pdf' | 'assignment_attachment' | 'avatar' | 'site_asset' | 'showcase_cover' | 'profile_request_attachment';
export type FileStatus = 'pending' | 'active' | 'replaced' | 'deleted';
export type FileVisibility = 'private' | 'public';
export type ContactStatus = 'new' | 'read' | 'replied' | 'spam' | 'archived';
export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected';
export type TagKind = 'technology' | 'topic';
export type CommentVisibility = 'shared' | 'admin_only';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: AccountStatus;
  must_change_password: boolean;
  phone?: string | null;
  preferred_language: 'en' | 'ur';
  preferred_theme: 'light' | 'dark' | 'system';
  notification_prefs: Record<string, boolean>;
  last_login_at?: string | null;
  created_by?: string | null;
  deactivated_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberProfile {
  id: string;
  profile_id: string;
  slug: string;
  display_name: string;
  title?: string | null;
  title_ur?: string | null;
  bio?: string | null;
  bio_ur?: string | null;
  skills: string[];
  specializations: string[];
  experience_text?: string | null;
  avatar_file_id?: string | null;
  avatar_public_path?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  other_links: Array<{ label: string; url: string }>;
  public_contact_email?: string | null;
  contact_enabled: boolean;
  is_published: boolean;
  sort_order: number;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ur?: string | null;
  description_en?: string | null;
  description_ur?: string | null;
  icon?: string | null;
  project_type: 'web' | 'android' | 'design' | 'general';
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  slug: string;
  name_en: string;
  name_ur?: string | null;
  kind: TagKind;
  is_approved: boolean;
  created_by?: string | null;
  created_at: string;
}

export interface FileRecord {
  id: string;
  owner_id: string;
  bucket: 'private-files' | 'public-media';
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  sha256?: string | null;
  kind: FileKind;
  status: FileStatus;
  visibility: FileVisibility;
  public_path?: string | null;
  replaces_file_id?: string | null;
  version_no: number;
  width?: number | null;
  height?: number | null;
  page_count?: number | null;
  alt_text?: string | null;
  activated_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  priority: AssignmentPriority;
  start_date?: string | null;
  due_date?: string | null;
  estimated_hours?: number | null;
  reference_links: Array<{ label: string; url: string }>;
  status: AssignmentStatus;
  progress: number;
  created_by: string;
  completed_at?: string | null;
  completed_by?: string | null;
  cancelled_at?: string | null;
  cancelled_by?: string | null;
  cancel_reason?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  members?: AssignmentMember[];
}

export interface AssignmentMember {
  id: string;
  assignment_id: string;
  member_id: string;
  status: AssignmentStatus;
  progress: number;
  blocked_reason?: string | null;
  submission_note?: string | null;
  admin_feedback?: string | null;
  accepted_at?: string | null;
  started_at?: string | null;
  submitted_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  member_name?: string;
}

export interface AssignmentComment {
  id: string;
  assignment_id: string;
  author_id: string;
  visibility: CommentVisibility;
  body: string;
  edited_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  author_name?: string;
  author_role?: UserRole;
}

export interface PublicShowcase {
  id: string;
  assignment_id: string;
  slug: string;
  title: string;
  title_ur?: string | null;
  summary: string;
  summary_ur?: string | null;
  category_id?: string | null;
  cover_file_id?: string | null;
  cover_public_path?: string | null;
  show_completed_date: boolean;
  completed_on?: string | null;
  shown_members: Array<{ display_name: string; slug: string }>;
  linked_project_slug?: string | null;
  is_visible: boolean;
  published_at?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  assignment_id?: string | null;
  status: ProjectStatus;
  title: string;
  title_ur?: string | null;
  slug: string;
  short_description?: string | null;
  short_description_ur?: string | null;
  full_description?: string | null;
  full_description_ur?: string | null;
  category_id?: string | null;
  website_url?: string | null;
  live_preview_url?: string | null;
  github_url?: string | null;
  android_app_url?: string | null;
  play_store_url?: string | null;
  app_download_url?: string | null;
  completion_date?: string | null;
  role_contribution?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  version_count: number;
  live_version_id?: string | null;
  submitted_at?: string | null;
  last_decision_at?: string | null;
  status_before_archive?: ProjectStatus | null;
  archived_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  files?: ProjectFile[];
  tags?: Tag[];
  collaborators?: Array<{ member_id: string; display_name: string; slug: string; role_label?: string }>;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_id: string;
  role: 'cover' | 'gallery' | 'pdf';
  sort_order: number;
  alt_text?: string | null;
  file?: FileRecord;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_no: number;
  snapshot: any;
  status: 'pending_review' | 'approved' | 'rejected' | 'changes_requested' | 'superseded' | 'withdrawn';
  submitted_by: string;
  submitted_at: string;
  decided_at?: string | null;
}

export interface ProjectReview {
  id: string;
  project_id: string;
  version_id?: string | null;
  reviewer_id: string;
  decision: ReviewDecision;
  feedback?: string | null;
  created_at: string;
}

export interface PublishedProject {
  id: string;
  project_id: string;
  version_id: string;
  owner_id: string;
  owner_display_name: string;
  slug: string;
  title: string;
  title_ur?: string | null;
  short_description: string;
  short_description_ur?: string | null;
  full_description?: string | null;
  full_description_ur?: string | null;
  category_id: string;
  category_slug?: string;
  category_name?: string;
  tags: Array<{ slug: string; name_en: string; name_ur?: string | null; kind: TagKind }>;
  tag_slugs: string[];
  cover_public_path: string;
  gallery: Array<{ path: string; alt?: string; sort_order: number }>;
  pdf_public_path?: string | null;
  website_url?: string | null;
  live_preview_url?: string | null;
  github_url?: string | null;
  android_app_url?: string | null;
  play_store_url?: string | null;
  app_download_url?: string | null;
  completion_date?: string | null;
  role_contribution?: string | null;
  collaborators: Array<{ display_name: string; slug: string; role_label?: string }>;
  seo_title?: string | null;
  seo_description?: string | null;
  is_visible: boolean;
  is_featured: boolean;
  featured_order?: number | null;
  member_sort_order: number;
  published_at: string;
  unpublished_at?: string | null;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  body?: string | null;
  link_path?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_id?: string | null;
  actor_name?: string | null;
  actor_role?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  outcome: 'success' | 'failure' | 'denied';
  metadata: Record<string, any>;
  request_id?: string | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  admin_notes?: string | null;
  created_at: string;
}

export interface ProfileChangeRequest {
  id: string;
  member_id: string;
  member_name?: string;
  requested_changes: Record<string, any>;
  note?: string | null;
  status: ChangeRequestStatus;
  admin_response?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface SiteSettings {
  branding: {
    site_name: string;
    tagline_en: string;
    tagline_ur: string;
    logo_public_path: string | null;
    favicon_public_path: string | null;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  localization: {
    default_language: 'en' | 'ur';
    enabled_languages: string[];
  };
  seo: {
    default_title: string;
    default_description: string;
    og_image_path: string | null;
    indexing_enabled: boolean;
  };
  contact: {
    whatsapp_number: string;
    public_email: string;
    phone: string;
    address_en: string;
    address_ur: string;
  };
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    x?: string;
  };
  features: {
    contact_form_enabled: boolean;
    whatsapp_button_enabled: boolean;
    showcase_enabled: boolean;
  };
  file_limits: {
    max_file_mb: number;
    per_member_quota_mb: number;
    total_quota_mb: number;
    warn_percent: number;
  };
  pdf_tool: {
    max_images: number;
    max_pdf_mb: number;
    default_page: string;
    default_quality: string;
  };
}
