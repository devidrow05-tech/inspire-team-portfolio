import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockCategories, mockTags } from '../../services/demo/data';
import {
  Sparkles,
  Save,
  ArrowRight,
  Upload,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { slugify, safeUrl } from '../../lib/format';

export const CreateProjectPage: React.FC = () => {
  const { t, lang } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [titleUr, setTitleUr] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [shortDescUr, setShortDescUr] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0].id);
  const [selectedTags, setSelectedTags] = useState<string[]>(['react', 'typescript']);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [roleContribution, setRoleContribution] = useState('');
  const [completionDate, setCompletionDate] = useState('2026-11-10');
  const [autosavedTime, setAutosavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  const handleSaveDraft = () => {
    setAutosavedTime(new Date().toLocaleTimeString());
  };

  const handleSubmitForReview = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Conditional Validation per PRD 10.1
    if (!title.trim() || title.length < 3) {
      setValidationError('Title must be at least 3 characters.');
      return;
    }
    if (!shortDesc.trim() || shortDesc.length > 200) {
      setValidationError('Short description is required to submit (maximum 200 chars).');
      return;
    }
    if (!categoryId) {
      setValidationError('Category is required.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/member/projects');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Create New Project
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Fill in deliverable details. Project stays in Draft until you submit it for Super Admin review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {autosavedTime && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Autosaved at {autosavedTime}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)] text-[var(--text)] transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmitForReview} className="space-y-6">
        {/* Section 1: Titles & Category */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)]">1. Basics & Category</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">
                Project Title (English) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lumina SaaS Analytics"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">
                Project Title (Urdu - اختیاری)
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleUr}
                onChange={(e) => setTitleUr(e.target.value)}
                placeholder="مثال: لومینا اینالیٹکس پورٹل"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500 font-urdu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none font-medium"
              >
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">Completion Date</label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Descriptions */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)]">2. Descriptions</h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">
              Short Description (Max 200 chars) *
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief summary displayed on project cards"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="text-[10px] text-end text-[var(--text-muted)]">
              {shortDesc.length}/200
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">
              Full Project Case Study & Architecture
            </label>
            <textarea
              rows={5}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Describe technical implementation, benchmarks, and deliverables..."
              className="w-full text-xs p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 3: Links & Technologies */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)]">3. Artifact Links & Tech Tags</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">Production Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">GitHub Repository</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text)]">Technology Tags</label>
            <div className="flex flex-wrap gap-2">
              {mockTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.slug);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)]'
                    }`}
                  >
                    {tag.name_en}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/member/projects')}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting to Faculty Review...</span>
            ) : (
              <>
                <span>Submit for Admin Approval</span>
                <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
