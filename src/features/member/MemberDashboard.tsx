import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  FolderGit2,
  FileStack,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { mockAssignments, mockWorkingProjects } from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const MemberDashboard: React.FC = () => {
  const { t } = useApp();

  const myAssignments = mockAssignments;
  const myProjects = mockWorkingProjects;
  const revisionsRequested = myProjects.filter((p) => p.status === 'changes_requested');

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Welcome to your workspace
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Track your assigned deliverables, upload working drafts, and access the client-side Image-to-PDF tool.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/member/tools/image-to-pdf"
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <FileStack className="w-4 h-4" />
            <span>Open PDF Tool</span>
          </Link>
          <Link
            to="/member/projects/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project Draft</span>
          </Link>
        </div>
      </div>

      {/* Revisions Highlight Banner if changes requested (PRD MEMBER-006) */}
      {revisionsRequested.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Action Required: Admin Requested Changes
              </div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300">
                "{revisionsRequested[0].title}" requires adjustments before publication approval.
              </div>
            </div>
          </div>
          <Link
            to={`/member/projects/${revisionsRequested[0].id}/edit`}
            className="shrink-0 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            View Feedback & Edit
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>My Active Assignments</span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)]">{myAssignments.filter((item) => item.status !== "completed" && item.status !== "cancelled").length}</div>
          <div className="text-[11px] text-teal-600 font-medium">Current assignments</div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Submitted / In Review</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)]">{myProjects.filter((item) => item.status === "submitted" || item.status === "under_review").length}</div>
          <div className="text-[11px] text-indigo-600 font-medium">Awaiting review</div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Approved & Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)]">{myProjects.filter((item) => item.status === "published").length}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Published projects</div>
        </div>
      </div>

      {/* Assignments and Projects lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Assignments */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-600" />
              My Assigned Work
            </h3>
            <Link to="/member/assignments" className="text-xs text-teal-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {myAssignments.slice(0, 2).map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text)]">{asg.title}</span>
                  <StatusBadge status={asg.status} />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                  {asg.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Due Date: {asg.due_date}</span>
                  <span className="font-semibold text-teal-600">Progress: {asg.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Working Projects */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              My Projects
            </h3>
            <Link to="/member/projects" className="text-xs text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {myProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={proj.status} />
                    <span className="text-xs font-bold text-[var(--text)] truncate">
                      {proj.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Slug: {proj.slug}
                  </div>
                </div>
                <Link
                  to={`/member/projects/${proj.id}`}
                  className="shrink-0 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
