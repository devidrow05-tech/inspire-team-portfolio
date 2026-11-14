import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockWorkingProjects } from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ImageSlot } from '../../components/ui/ImageSlot';
import {
  AnimatedButton,
  RevealSection,
  showAnimatedToast,
} from '../../components/ui/MotionPrimitives';
import { EASINGS } from '../../frontend/lib/animations';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState(() => {
    return (
      mockWorkingProjects.find((p) => p.id === projectId) ||
      mockWorkingProjects.find((p) => p.status === 'submitted') ||
      mockWorkingProjects[0]
    );
  });

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'notes'>('content');
  const [feedbackText, setFeedbackText] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [decisionNotification, setDecisionNotification] = useState<string | null>(null);

  const handleApproveAndPublish = () => {
    setProject((prev) => (prev ? { ...prev, status: 'published' } : prev));
    const msg = 'Project successfully approved and published! Snapshot is now live on the public website.';
    setDecisionNotification(msg);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    showAnimatedToast(msg, 'success');
  };

  const handleRequestChanges = () => {
    if (!feedbackText.trim()) {
      showAnimatedToast('Feedback is required when requesting revisions.', 'error');
      return;
    }
    setProject((prev) => (prev ? { ...prev, status: 'changes_requested' } : prev));
    const msg = 'Revisions requested. Notification sent to member workspace.';
    setDecisionNotification(msg);
    showAnimatedToast(msg, 'info');
  };

  const handleReject = () => {
    if (!feedbackText.trim()) {
      showAnimatedToast('A reason is required to reject a submission.', 'error');
      return;
    }
    setProject((prev) => (prev ? { ...prev, status: 'rejected' } : prev));
    const msg = 'Project marked as rejected. Not visible on public website.';
    setDecisionNotification(msg);
    showAnimatedToast(msg, 'error');
  };

  if (!project) {
    return (
      <RevealSection className="max-w-6xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center space-y-3">
        <h1 className="text-xl font-bold text-[var(--text)]">No submissions yet</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Project submissions will appear here after a member adds one.
        </p>
        <Link to="/admin" className="text-sm font-semibold text-indigo-600 hover:underline inline-block">
          Back to dashboard
        </Link>
      </RevealSection>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="space-y-1">
          <Link to="/admin/reviews" className="text-xs text-[var(--text-muted)] hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5 rtl:-scale-x-100" />
            <span>Pending Reviews Queue</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
              {project.title}
            </h1>
            <StatusBadge status={project.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)] text-[var(--text)] transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Visitor View</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {decisionNotification && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={EASINGS.spring}
            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{decisionNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-[var(--border)] text-xs font-semibold">
            {[
              { id: 'content', label: 'Submission Details' },
              { id: 'media', label: 'Media & PDF Files' },
              { id: 'notes', label: 'Internal Notes (Admin Only)' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'content' | 'media' | 'notes')}
                  className={`relative py-2.5 px-4 transition cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="review-detail-tab-underline"
                      transition={EASINGS.spring}
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Summary / Short Description
                  </label>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    {project.short_description || 'No short description provided.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Full Project Case Study
                  </label>
                  <div className="text-xs text-[var(--text)] leading-relaxed whitespace-pre-line p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border)]">
                    {project.full_description || 'No long description provided.'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    External Artifacts
                  </label>
                  <div className="space-y-1 text-xs">
                    {project.github_url && (
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <span>GitHub:</span>
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="underline truncate">
                          {project.github_url}
                        </a>
                      </div>
                    )}
                    {project.website_url && (
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <span>Website:</span>
                        <a href={project.website_url} target="_blank" rel="noreferrer" className="underline truncate">
                          {project.website_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
              >
                <h3 className="text-sm font-bold text-[var(--text)]">Cover & Screenshots</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                    <ImageSlot aspect="16/10" fallbackText="Project Cover" badge="Cover Image" />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                    <ImageSlot aspect="16/10" fallbackText="Gallery Screenshot 1" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
              >
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  Admin Private Notes (Never Visible to Member)
                </div>
                <textarea
                  rows={4}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Enter private faculty review notes here..."
                  className="w-full text-xs p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <AnimatedButton
                  type="button"
                  onClick={() => showAnimatedToast('Internal note saved to assignment_admin_notes', 'success')}
                  className="text-xs bg-[var(--surface-2)] font-semibold px-3 py-1.5 rounded-lg text-[var(--text)]"
                >
                  Save Private Note
                </AnimatedButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text)]">Admin Decision Panel</h3>

            <AnimatedButton
              type="button"
              onClick={handleApproveAndPublish}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Publish to Public Site</span>
            </AnimatedButton>

            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <label className="text-xs font-semibold text-[var(--text)]">
                Feedback for Member (Required for changes/rejection)
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Explain required changes or reasons for rejection..."
                className="w-full text-xs p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <AnimatedButton
                type="button"
                onClick={handleRequestChanges}
                className="py-2.5 px-3 rounded-xl border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Changes</span>
              </AnimatedButton>

              <AnimatedButton
                type="button"
                onClick={handleReject}
                className="py-2.5 px-3 rounded-xl border border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
