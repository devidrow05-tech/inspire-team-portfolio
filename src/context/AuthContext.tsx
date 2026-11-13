import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SupabaseUser } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole } from '../types/database';

type AppRole = UserRole | 'visitor';
type LoginResult = { success: boolean; error?: string };

interface AuthContextType {
  currentUser: Profile | null;
  role: AppRole;
  login: (email: string, password: string, requiredRole: UserRole) => Promise<LoginResult>;
  logout: () => Promise<void>;
  failedAttempts: number;
  lockoutUntil: number | null;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function profileFromUser(user: SupabaseUser): Profile | null {
  const role = user.app_metadata?.role;
  if (role !== 'admin' && role !== 'member') return null;

  const now = new Date().toISOString();
  return {
    id: user.id,
    email: user.email ?? '',
    full_name: user.user_metadata?.full_name ?? user.email ?? 'Inspire Team User',
    role,
    status: 'active',
    must_change_password: false,
    preferred_language: 'en',
    preferred_theme: 'system',
    notification_prefs: {},
    last_login_at: now,
    created_at: user.created_at ?? now,
    updated_at: now,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('visitor');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applyUser = (user: User | null) => {
      if (!mounted) return;
      const profile = user ? profileFromUser(user) : null;
      setCurrentUser(profile);
      setRole(profile?.role ?? 'visitor');
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Unable to restore Supabase session:', error.message);
      applyUser(data.session?.user ?? null);
      if (mounted) setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
      if (mounted) setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, requiredRole: UserRole): Promise<LoginResult> => {
    const now = Date.now();
    if (lockoutUntil && now < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - now) / 60000);
      return { success: false, error: `Too many failed attempts. Try again in ${remainingMinutes} minutes.` };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setLockoutUntil(now + 15 * 60 * 1000);
        return { success: false, error: 'Too many failed attempts. Try again in 15 minutes.' };
      }
      return { success: false, error: error?.message || 'Invalid email or password.' };
    }

    const profile = profileFromUser(data.user);
    if (!profile || profile.role !== requiredRole) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setRole('visitor');
      return {
        success: false,
        error: requiredRole === 'admin'
          ? 'This account is not authorized as an admin. Contact the Super Admin.'
          : 'This account is not registered as a team member.',
      };
    }

    setCurrentUser(profile);
    setRole(profile.role);
    setFailedAttempts(0);
    setLockoutUntil(null);
    return { success: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Supabase sign out failed:', error.message);
    setCurrentUser(null);
    setRole('visitor');
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, login, logout, failedAttempts, lockoutUntil, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
