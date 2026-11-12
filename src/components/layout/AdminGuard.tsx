import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLoginPage } from '../../features/auth/AdminLoginPage';
import { AdminLayout } from './AdminLayout';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { role } = useAuth();

  // If visitor attempts to access /admin directly without session -> Show secure login card ONLY
  if (role !== 'admin') {
    return <AdminLoginPage />;
  }

  // Once authenticated as admin -> Render full admin control layout
  return <AdminLayout>{children}</AdminLayout>;
};

