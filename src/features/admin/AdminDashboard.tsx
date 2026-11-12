import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Briefcase,
  FolderGit2,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileStack,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  mockUsers,
  mockAssignments,
  mockWorkingProjects,
  mockPublishedProjects
} from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { t } = useApp();

  const totalMembers = mockUsers.filter((u) => u.role === 'member').length;
  const activeAssignments = mockAssignments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled').length;
  const pendingReviews = mockWorkingProjects.filter((p) => p.status === 'submitted' || p.status === 'under_review').length;
  const publishedWork = mockPublishedProjects.length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin control center: assignments, member progress, approval queues, and storage governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/reviews"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Open Review Queue ({pendingReviews})</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Team Members</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalMembers}</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span>All accounts active</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Approvals</span>
            <div className="w-7 h-7 rounded-lg bg-amber-950/60 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingReviews}</div>
          <div className="text-[11px] text-amber-400 font-medium">
            Requires admin decision
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Assignments</span>
            <div className="w-7 h-7 rounded-lg bg-teal-950/60 text-teal-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{activeAssignments}</div>
          <div className="text-[11px] text-slate-400">
            In progress across academy
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Public Portfolio Live</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{publishedWork}</div>
          <div className="text-[11px] text-emerald-400 font-medium">
            100% Admin Curated
          </div>
        </div>
      </div>

      {/* Two Column Layout: Pending Submissions Queue & Active Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Queue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              Submissions Awaiting Review
            </h3>
            <Link to="/admin/reviews" className="text-xs text-indigo-400 hover:underline">
              View queue →
            </Link>
          </div>

          <div className="space-y-3">
            {mockWorkingProjects
              .filter((p) => p.status === 'submitted')
              .map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.status} />
                      <span className="text-xs font-bold text-white truncate">
                        {project.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Author: Hamza Farooq · Submitted today
                    </div>
                  </div>
                  <Link
                    to={`/admin/reviews/${project.id}`}
                    className="shrink-0 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition shadow"
                  >
                    Review Now
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Assignments Progress Monitor */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-400" />
              Active Assignments Oversight
            </h3>
            <Link to="/admin/assignments" className="text-xs text-teal-400 hover:underline">
              Manage tasks →
            </Link>
          </div>

          <div className="space-y-3">
            {mockAssignments.map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[70%]">
                    {asg.title}
                  </span>
                  <StatusBadge status={asg.status} />
                </div>
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Progress</span>
                    <span>{asg.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${asg.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
