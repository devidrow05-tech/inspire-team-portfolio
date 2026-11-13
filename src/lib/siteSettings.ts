import { supabase } from './supabase';
import type { SiteConfig } from '../types/siteConfig';

const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const seoKeys = [
  'seo_default_title',
  'seo_default_description',
  'seo_default_og_image',
  'google_analytics_id',
  'google_search_console_code',
  'seo_pages',
] as const;

export type SeoSettings = Pick<SiteConfig, typeof seoKeys[number]>;

async function requestHeaders(extra: Record<string, string> = {}) {
  const { data } = await supabase.auth.getSession();
  return {
    apikey: publishableKey,
    Authorization: `Bearer ${data.session?.access_token || publishableKey}`,
    ...extra,
  };
}

export async function loadSeoSettings(): Promise<Partial<SeoSettings>> {
  const response = await fetch(`${baseUrl}/rest/v1/site_settings?id=eq.global&select=settings&limit=1`, {
    headers: await requestHeaders(),
  });
  if (!response.ok) throw new Error('Unable to load saved SEO settings.');
  const rows = await response.json();
  return rows[0]?.settings || {};
}

export async function saveSeoSettings(settings: SeoSettings): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) throw new Error('Please sign in as the administrator to save SEO settings.');
  const response = await fetch(`${baseUrl}/rest/v1/site_settings?on_conflict=id`, {
    method: 'POST',
    headers: await requestHeaders({
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }),
    body: JSON.stringify({
      id: 'global',
      settings,
      updated_at: new Date().toISOString(),
      updated_by: data.session.user.id,
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.details || 'Unable to save SEO settings.');
  }
}
