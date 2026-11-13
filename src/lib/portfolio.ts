import { supabase } from './supabase';

export interface TeamMember {
  id: string;
  display_name: string;
  slug: string;
  title: string;
  bio: string;
  skills: string[];
  avatar_url: string | null;
  avatar_path: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  is_published: boolean;
  sort_order: number;
}
export interface PortfolioProject {
  id: string;
  member_id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: string;
  technologies: string[];
  cover_url: string | null;
  cover_path: string | null;
  project_url: string | null;
  github_url: string | null;
  is_published: boolean;
  sort_order: number;
}
const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

async function headers(extra: Record<string, string> = {}) {
  const { data } = await supabase.auth.getSession();
  return {
    apikey: publishableKey,
    Authorization: `Bearer ${data.session?.access_token || publishableKey}`,
    ...extra,
  };
}
async function request<T>(table: string, query = '', init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
    ...init,
    headers: await headers({
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> || {}),
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || 'Unable to save portfolio data.');
  }
  if (response.status === 204) return [] as T;
  return response.json() as Promise<T>;
}
export const portfolioApi = {
  listMembers: () => request<TeamMember[]>('team_members', '?select=*&order=sort_order.asc,created_at.desc'),
  getMember: async (slug: string) => {
    const rows = await request<TeamMember[]>('team_members', `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
    return rows[0] || null;
  },
  createMember: async (payload: Partial<TeamMember>) => {
    const rows = await request<TeamMember[]>('team_members', '', {
      method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload),
    });
    return rows[0];
  },
  updateMember: async (id: string, payload: Partial<TeamMember>) => {
    const rows = await request<TeamMember[]>('team_members', `?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload),
    });
    return rows[0];
  },
  listProjects: (memberId?: string) => request<PortfolioProject[]>(
    'portfolio_projects',
    `?select=*&${memberId ? `member_id=eq.${encodeURIComponent(memberId)}&` : ''}order=sort_order.asc,created_at.desc`,
  ),
  getProject: async (slug: string) => {
    const rows = await request<PortfolioProject[]>('portfolio_projects', `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
    return rows[0] || null;
  },
  createProject: async (payload: Partial<PortfolioProject>) => {
    const rows = await request<PortfolioProject[]>('portfolio_projects', '', {
      method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload),
    });
    return rows[0];
  },
  uploadImage: async (file: File, folder: string) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Please choose a JPG, PNG, or WebP image.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const response = await fetch(`${baseUrl}/storage/v1/object/team-media/${path}`, {
      method: 'POST',
      headers: await headers({ 'Content-Type': file.type, 'x-upsert': 'false' }),
      body: file,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || 'Image upload failed.');
    }
    return {
      path,
      url: `${baseUrl}/storage/v1/object/public/team-media/${path}`,
    };
  },
};
