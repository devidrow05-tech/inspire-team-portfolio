export interface SupabaseUser {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseUser;
}
type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'INITIAL_SESSION';
type AuthListener = (event: AuthEvent, session: AuthSession | null) => void;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}
const storageKey = 'inspire-supabase-auth';
const listeners = new Set<AuthListener>();
let session: AuthSession | null = null;

function readStoredSession(): AuthSession | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) as AuthSession : null;
  } catch { return null; }
}
function saveSession(value: AuthSession | null) {
  session = value;
  try {
    if (value) localStorage.setItem(storageKey, JSON.stringify(value));
    else localStorage.removeItem(storageKey);
  } catch { /* storage may be unavailable */ }
}
function emit(event: AuthEvent) {
  for (const listener of listeners) listener(event, session);
}
async function authRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabasePublishableKey,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.msg || body.message || body.error_description || body.error || 'Authentication request failed.');
  return body;
}
async function refreshSession(current: AuthSession): Promise<AuthSession> {
  const body = await authRequest('token?grant_type=refresh_token', {
    method: 'POST', body: JSON.stringify({ refresh_token: current.refresh_token }),
  });
  const next: AuthSession = {
    access_token: body.access_token,
    refresh_token: body.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + Number(body.expires_in || 3600),
    user: body.user,
  };
  saveSession(next);
  emit('TOKEN_REFRESHED');
  return next;
}
export const supabase = {
  auth: {
    async getSession() {
      let current = session ?? readStoredSession();
      if (current && current.expires_at <= Math.floor(Date.now() / 1000) + 30) {
        try { current = await refreshSession(current); }
        catch { saveSession(null); current = null; }
      } else if (current) { session = current; }
      return { data: { session: current }, error: null };
    },
    onAuthStateChange(callback: AuthListener) {
      listeners.add(callback);
      queueMicrotask(() => callback('INITIAL_SESSION', session ?? readStoredSession()));
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },
    async signInWithPassword(credentials: { email: string; password: string }) {
      try {
        const body = await authRequest('token?grant_type=password', {
          method: 'POST',
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const next: AuthSession = {
          access_token: body.access_token,
          refresh_token: body.refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + Number(body.expires_in || 3600),
          user: body.user,
        };
        saveSession(next);
        emit('SIGNED_IN');
        return { data: { user: next.user, session: next }, error: null };
      } catch (error) {
        return { data: { user: null, session: null }, error: error as Error };
      }
    },
    async signOut() {
      const current = session ?? readStoredSession();
      try {
        if (current) await authRequest('logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${current.access_token}` },
        });
      } finally {
        saveSession(null);
        emit('SIGNED_OUT');
      }
      return { error: null };
    },
  },
};
