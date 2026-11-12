import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockWorkingProjects, mockPublishedProjects, mockCategories } from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ImageSlot } from '../../components/ui/ImageSlot';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  FileText,
  Layers,
  ArrowLeft,
  Sparkles,
  Lock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t, lang } = useApp();
  const navigate = useNavigate();

  // Find project in working store or demo projects
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
    // PRD BR-01, BR-02: Only role admin can publish; copies files through gate, sets is_visible=true
    setProject((prev) => ({ ...prev, status: 'published' }));
    setDecisionNotification('Project successfully approved and published! Snapshot is now live on the public website.');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleRequestChanges = () => {
    if (!feedbackText.trim()) {
      alert('Feedback is required when requesting revisions.');
      return;
    }
    setProject((prev) => ({ ...prev, status: 'changes_requested' }));
    setDecisionNotification('Revisions requested. Notification sent to member workspace.');
  };

  const handleReject = () => {
    if (!feedbackText.trim()) {
      alert('A reason is required to reject a submission.');
      return;
    }
    setProject((prev) => ({ ...prev, status: 'rejected' }));
    setDecisionNotification('Project marked as rejected. Not visible on public website.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Breadcrumbs */}
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

      {decisionNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{decisionNotification}</span>
        </div>
      )}

      {/* Two Column Layout: Left Content Tabs / Right Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Review Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2.5 px-4 border-b-2 transition ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Submission Details
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`py-2.5 px-4 border-b-2 transition ${
                activeTab === 'media'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Media & PDF Files
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2.5 px-4 border-b-2 transition ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Internal Notes (Admin Only)
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
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
            </div>
          )}

          {activeTab === 'media' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)]">Cover & Screenshots</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                  <ImageSlot aspect="16/10" fallbackText="Project Cover" badge="Cover Image" />
                </div>
                <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                  <ImageSlot aspect="16/10" fallbackText="Gallery Screenshot 1" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
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
              <button
                type="button"
                onClick={() => alert('Internal note saved to assignment_admin_notes')}
                className="text-xs bg-[var(--surface-2)] font-semibold px-3 py-1.5 rounded-lg text-[var(--text)]"
              >
                Save Private Note
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Decision Action Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Admin Decision Panel
            </h3>

            {/* Approve & Publish Button */}
            <button
              onClick={handleApproveAndPublish}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Publish to Public Site</span>
            </button>

            {/* Member-facing Feedback Area */}
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
              <button
                onClick={handleRequestChanges}
                className="py-2.5 px-3 rounded-xl border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Changes</span>
              </button>

              <button
                onClick={handleReject}
                className="py-2.5 px-3 rounded-xl border border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
