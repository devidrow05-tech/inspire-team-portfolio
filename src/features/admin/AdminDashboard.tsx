import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  FolderGit2,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  mockUsers,
  mockAssignments,
  mockWorkingProjects,
  mockPublishedProjects,
  mockAuditLogs,
} from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AnimatedCard,
  AnimatedCounter,
  RevealSection,
} from '../../components/ui/MotionPrimitives';
import {
  LiveActivityFeed,
  ScrambleText,
  MagneticButton,
} from '../../frontend/components/animations';
import { staggerContainer, fadeUp, EASINGS } from '../../frontend/lib/animations';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const totalMembers = mockUsers.filter((u) => u.role === 'member').length;
  const activeAssignments = mockAssignments.filter(
    (a) => a.status !== 'completed' && a.status !== 'cancelled'
  ).length;
  const pendingReviews = mockWorkingProjects.filter(
    (p) => p.status === 'submitted' || p.status === 'under_review'
  ).length;
  const publishedWork = mockPublishedProjects.length;

  const activities = mockAuditLogs.slice(0, 8).map((log) => ({
    id: String(log.id),
    message: `${log.actor_name || 'System'}: ${log.action} (${log.entity_type})`,
    time: log.created_at,
    colorClass:
      log.outcome === 'success'
        ? 'bg-emerald-400'
        : log.outcome === 'denied'
        ? 'bg-amber-400'
        : 'bg-rose-400',
  }));

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <RevealSection className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            <ScrambleText text="Executive Operations Dashboard" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin control center: assignments, member progress, approval queues, and storage governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MagneticButton
            type="button"
            onClick={() => navigate('/admin/reviews')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Open Review Queue ({pendingReviews})</span>
          </MagneticButton>
        </div>
      </RevealSection>

      {/* 4 Staggered Dark KPI Cards with CountUp */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <AnimatedCard
          variants={fadeUp}
          className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-indigo-500/40 p-5 space-y-3 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Team Members</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            <AnimatedCounter end={totalMembers} duration={1.1} />
          </div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span>Member accounts</span>
          </div>
        </AnimatedCard>

        <AnimatedCard
          variants={fadeUp}
          className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-amber-500/40 p-5 space-y-3 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Approvals</span>
            <div className="w-7 h-7 rounded-lg bg-amber-950/60 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            <AnimatedCounter end={pendingReviews} duration={1.1} />
          </div>
          <div className="text-[11px] text-amber-400 font-medium">Requires admin decision</div>
        </AnimatedCard>

        <AnimatedCard
          variants={fadeUp}
          className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-teal-500/40 p-5 space-y-3 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Assignments</span>
            <div className="w-7 h-7 rounded-lg bg-teal-950/60 text-teal-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            <AnimatedCounter end={activeAssignments} duration={1.1} />
          </div>
          <div className="text-[11px] text-slate-400">In progress across academy</div>
        </AnimatedCard>

        <AnimatedCard
          variants={fadeUp}
          className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-emerald-500/40 p-5 space-y-3 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Public Portfolio Live</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            <AnimatedCounter end={publishedWork} duration={1.1} />
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">Published projects</div>
        </AnimatedCard>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevealSection className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
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
            {mockWorkingProjects.filter((p) => p.status === 'submitted').length === 0 && (
              <p className="text-xs text-slate-400">No pending submissions right now.</p>
            )}
            {mockWorkingProjects
              .filter((p) => p.status === 'submitted')
              .map((project) => (
                <AnimatedCard
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
                    <div className="text-[11px] text-slate-400">New submission</div>
                  </div>
                  <Link
                    to={`/admin/reviews/${project.id}`}
                    className="shrink-0 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition shadow"
                  >
                    Review Now
                  </Link>
                </AnimatedCard>
              ))}
          </div>
        </RevealSection>

        <RevealSection className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
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
            {mockAssignments.length === 0 && (
              <p className="text-xs text-slate-400">No active assignments.</p>
            )}
            {mockAssignments.map((asg) => (
              <AnimatedCard
                key={asg.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[70%]">
                    {asg.title}
                  </span>
                  <StatusBadge status={asg.status} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Progress</span>
                    <span>{asg.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: Math.max(0, Math.min(1, asg.progress / 100)) }}
                      transition={{ duration: 0.7, ease: EASINGS.decelerate }}
                      className="h-full w-full origin-left bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </RevealSection>
      </div>

      {/* Live Activity Feed */}
      <RevealSection className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Live Governance Activity Feed</h3>
          <Link to="/admin/logs" className="text-xs text-indigo-400 hover:underline">
            Full audit log →
          </Link>
        </div>
        <LiveActivityFeed
          activities={activities}
          emptyText="No recent administrative activity recorded yet."
        />
      </RevealSection>
    </div>
  );
};
