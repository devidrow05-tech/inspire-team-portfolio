import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { mockCategories, mockTags } from '../../services/demo/data';
import {
  AnimatedButton,
  showAnimatedToast,
} from '../../components/ui/MotionPrimitives';
import {
  DURATIONS,
  EASINGS,
  getStepProgressPercent,
} from '../../frontend/lib/animations';
import {
  Save,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Basics & Category' },
  { id: 2, label: 'Descriptions' },
  { id: 3, label: 'Artifacts & Tags' },
] as const;

export const CreateProjectPage: React.FC = () => {
  useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  const [title, setTitle] = useState('');
  const [titleUr, setTitleUr] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0]?.id || 'general');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [autosavedTime, setAutosavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    setAutosavedTime(time);
    showAnimatedToast(`Draft autosaved at ${time}`, 'info');
  };

  const handleNextStep = () => {
    setValidationError(null);
    if (step === 1 && (!title.trim() || title.trim().length < 3)) {
      setValidationError('Project title must be at least 3 characters before continuing.');
      return;
    }
    if (step === 2 && (!shortDesc.trim() || shortDesc.length > 200)) {
      setValidationError('Short description is required (maximum 200 characters).');
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(STEPS.length, s + 1));
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmitForReview = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim() || title.trim().length < 3) {
      setValidationError('Title must be at least 3 characters.');
      setStep(1);
      return;
    }
    if (!shortDesc.trim() || shortDesc.length > 200) {
      setValidationError('Short description is required to submit (maximum 200 chars).');
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showAnimatedToast('Project submitted for Super Admin review!', 'success');
      navigate('/member/projects');
    }, 600);
  };

  const progressPct = getStepProgressPercent(step, STEPS.length);

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
          <AnimatedButton
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)] text-[var(--text)] transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </AnimatedButton>
        </div>
      </div>

      {/* Multi-Step Animated Progress Indicator */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s) => {
            const active = step === s.id;
            const completed = step > s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setValidationError(null);
                  setDirection(s.id >= step ? 1 : -1);
                  setStep(s.id);
                }}
                className="flex items-center gap-2 text-left cursor-pointer group"
              >
                <span
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    completed
                      ? 'bg-emerald-600 text-white'
                      : active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
                  }`}
                >
                  {completed ? <Check className="w-3.5 h-3.5" /> : s.id}
                </span>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    active ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Animated GPU Progress Track */}
        <div className="h-1.5 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
          <motion.div
            initial={false}
            animate={{ scaleX: Math.max(0.08, progressPct / 100) }}
            transition={{ duration: DURATIONS.normal, ease: EASINGS.decelerate }}
            className="h-full w-full origin-left bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full"
          />
        </div>
      </div>

      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </motion.div>
      )}

      {/* Animated Multi-step Form */}
      <form onSubmit={handleSubmitForReview} className="space-y-6">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.25, ease: EASINGS.decelerate }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
            >
              <h3 className="text-sm font-bold text-[var(--text)]">1. Basics & Category</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="proj-title-en" className="text-xs font-semibold text-[var(--text)]">
                    Project Title (English) *
                  </label>
                  <input
                    id="proj-title-en"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lumina SaaS Analytics"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="proj-title-ur" className="text-xs font-semibold text-[var(--text)]">
                    Project Title (Urdu - اختیاری)
                  </label>
                  <input
                    id="proj-title-ur"
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
                  <label htmlFor="proj-category" className="text-xs font-semibold text-[var(--text)]">
                    Category *
                  </label>
                  <select
                    id="proj-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none font-medium"
                  >
                    <option value="general">General Engineering</option>
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="proj-date" className="text-xs font-semibold text-[var(--text)]">
                    Completion Date
                  </label>
                  <input
                    id="proj-date"
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.25, ease: EASINGS.decelerate }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
            >
              <h3 className="text-sm font-bold text-[var(--text)]">2. Descriptions</h3>

              <div className="space-y-1">
                <label htmlFor="proj-short-desc" className="text-xs font-semibold text-[var(--text)]">
                  Short Description (Max 200 chars) *
                </label>
                <input
                  id="proj-short-desc"
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
                <label htmlFor="proj-full-desc" className="text-xs font-semibold text-[var(--text)]">
                  Full Project Case Study & Architecture
                </label>
                <textarea
                  id="proj-full-desc"
                  rows={5}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Describe technical implementation, benchmarks, and deliverables..."
                  className="w-full text-xs p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.25, ease: EASINGS.decelerate }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
            >
              <h3 className="text-sm font-bold text-[var(--text)]">3. Artifact Links & Tech Tags</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="proj-web-url" className="text-xs font-semibold text-[var(--text)]">
                    Production Website URL
                  </label>
                  <input
                    id="proj-web-url"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="proj-github-url" className="text-xs font-semibold text-[var(--text)]">
                    GitHub Repository
                  </label>
                  <input
                    id="proj-github-url"
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
                  {(mockTags.length > 0
                    ? mockTags
                    : [
                        { id: 'react', slug: 'react', name_en: 'React' },
                        { id: 'ts', slug: 'typescript', name_en: 'TypeScript' },
                        { id: 'tailwind', slug: 'tailwind', name_en: 'Tailwind CSS' },
                        { id: 'node', slug: 'nodejs', name_en: 'Node.js' },
                      ]
                  ).map((tag) => {
                    const isSelected = selectedTags.includes(tag.slug);
                    return (
                      <AnimatedButton
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
                      </AnimatedButton>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Navigation Bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <AnimatedButton
              type="button"
              onClick={() => navigate('/member/projects')}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition"
            >
              Cancel
            </AnimatedButton>
            {step > 1 && (
              <AnimatedButton
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </AnimatedButton>
            )}
          </div>

          {step < STEPS.length ? (
            <AnimatedButton
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
            </AnimatedButton>
          ) : (
            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting to Faculty Review...</span>
              ) : (
                <>
                  <span>Submit for Admin Approval</span>
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </>
              )}
            </AnimatedButton>
          )}
        </div>
      </form>
    </div>
  );
};
