import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types/database';
import { mockUsers } from '../services/demo/data';

interface AuthContextType {
  currentUser: Profile | null;
  role: 'admin' | 'member' | 'visitor';
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  failedAttempts: number;
  lockoutUntil: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Visitor by default on public site; admin logs in explicitly at /admin
  const [role, setRole] = useState<'admin' | 'member' | 'visitor'>('visitor');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Check persisted admin session (if logged in before)
  useEffect(() => {
    try {
      const savedAdmin = sessionStorage.getItem('inspire_admin_session');
      if (savedAdmin) {
        setRole('admin');
        setCurrentUser(mockUsers[0]);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (email: string, password = ''): { success: boolean; error?: string } => {
    const now = Date.now();

    // Check 15-minute lockout (Security requirement: 5 failed attempts -> 15 min lockout)
    if (lockoutUntil && now < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - now) / 60000);
      return {
        success: false,
        error: `Too many failed attempts. Access is locked for ${remainingMinutes} more minutes.`,
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Admin authentication
    if (
      cleanEmail === 'owner@inspireacademy.edu' ||
      cleanEmail === 'admin@inspireacademy.edu' ||
      cleanEmail === 'admin'
    ) {
      // In demo mode or production password verification
      if (cleanPassword === 'SuperSecret2026!' || cleanPassword === 'admin' || cleanPassword === 'admin123') {
        setCurrentUser(mockUsers[0]);
        setRole('admin');
        setFailedAttempts(0);
        setLockoutUntil(null);
        try {
          sessionStorage.setItem('inspire_admin_session', 'true');
        } catch {}
        return { success: true };
      }
    }

    // Member authentication
    const member = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'member');
    if (member) {
      if (cleanPassword === 'MemberPassword2026!' || cleanPassword === 'member123') {
        setCurrentUser(member);
        setRole('member');
        setFailedAttempts(0);
        setLockoutUntil(null);
        return { success: true };
      }
    }

    // Failed attempt handling
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    if (newAttempts >= 5) {
      const lockTime = now + 15 * 60 * 1000; // 15 minutes lockout
      setLockoutUntil(lockTime);
      return {
        success: false,
        error: 'Account locked due to 5 consecutive failed attempts. Try again in 15 minutes.',
      };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your email and password.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('visitor');
    try {
      sessionStorage.removeItem('inspire_admin_session');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, login, logout, failedAttempts, lockoutUntil }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
