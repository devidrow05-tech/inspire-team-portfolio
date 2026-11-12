export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  SITE_URL: import.meta.env.VITE_SITE_URL || window.location.origin,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Inspire Team',
  TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
  IS_DEV: import.meta.env.DEV,
};

// Check if we are running in Demo Mode (when Supabase credentials are not connected)
export const IS_DEMO_MODE = !ENV.SUPABASE_URL || !ENV.SUPABASE_PUBLISHABLE_KEY;
