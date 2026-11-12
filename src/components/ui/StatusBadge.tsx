import React from 'react';
import { ProjectStatus, AssignmentStatus, AssignmentPriority } from '../../types/database';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status: ProjectStatus | AssignmentStatus | AssignmentPriority | string;
  type?: 'project' | 'assignment' | 'priority';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'project' }) => {
  const { t } = useApp();

  let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (status === 'published' || status === 'completed') {
    colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (status === 'under_review' || status === 'in_progress') {
    colorClasses = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
  } else if (status === 'submitted' || status === 'assigned') {
    colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  } else if (status === 'changes_requested' || status === 'blocked' || status === 'revision_requested' || status === 'high') {
    colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (status === 'rejected' || status === 'urgent') {
    colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  }

  const label = t(`status.${status}`, status.replace(/_/g, ' '));

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${colorClasses} capitalize`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};
