import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ImageSlot } from '../../components/ui/ImageSlot';
import { mockPublishedProjects, mockMemberProfiles } from '../../services/demo/data';
import {
  ExternalLink,
  Github,
  Download,
  Calendar,
  Layers,
  User,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { safeUrl, formatDate } from '../../lib/format';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useApp();

  const project = mockPublishedProjects.find((p) => p.slug === slug);

  if (!project || !project.is_visible) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)]">Project Not Found</h2>
        <p className="text-sm text-[var(--text-muted)]">
          The requested portfolio project is either unpublished, archived, or does not exist.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
          Back to Projects
        </Link>
      </div>
    );
  }

  // Find owner member profile
  const ownerProfile = mockMemberProfiles.find((mp) => mp.profile_id === project.owner_id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link to="/projects" className="hover:text-indigo-600 flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5 rtl:-scale-x-100" />
          <span>All Projects</span>
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-medium truncate">{project.title}</span>
      </div>

      {/* Main Cover & Title Banner */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {project.category_name}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Quality Audited
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text)]">
          {lang === 'ur' && project.title_ur ? project.title_ur : project.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-4xl">
          {lang === 'ur' && project.short_description_ur ? project.short_description_ur : project.short_description}
        </p>

        {/* Hero Cover */}
        <div className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl">
          <ImageSlot
            src={project.cover_public_path}
            alt={project.title}
            aspect="16/10"
            fallbackText={project.title}
          />
        </div>
      </div>

      {/* Content Columns: Left Details / Right Sticky Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Full Description & Gallery */}
        <div className="lg:col-span-2 space-y-8">
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-[var(--text)] whitespace-pre-line">
            {lang === 'ur' && project.full_description_ur ? project.full_description_ur : project.full_description}
          </div>

          {/* Project Gallery */}
          {project.gallery.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--text)]">Project Gallery & Screens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((g, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[var(--border)]">
                    <ImageSlot
                      src={g.path}
                      alt={g.alt || `Screen ${i + 1}`}
                      aspect="4/3"
                      fallbackText={g.alt || `${project.title} Preview ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role & Contribution */}
          {project.role_contribution && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                Author Contribution
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {project.role_contribution}
              </p>
            </div>
          )}
        </div>

        {/* Right Sticky Column: Metadata, Links, Author Card */}
        <div className="space-y-6">
          {/* Quick Action Links Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text)]">Deliverable Links</h3>
            
            <div className="flex flex-col gap-2.5">
              {project.live_preview_url && safeUrl(project.live_preview_url) && (
                <a
                  href={safeUrl(project.live_preview_url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-between shadow"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.website_url && safeUrl(project.website_url) && (
                <a
                  href={safeUrl(project.website_url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold text-xs transition flex items-center justify-between"
                >
                  <span>Visit Production Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.github_url && safeUrl(project.github_url) && (
                <a
                  href={safeUrl(project.github_url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold text-xs transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    Source Code
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.android_app_url && safeUrl(project.android_app_url) && (
                <a
                  href={safeUrl(project.android_app_url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold text-xs transition flex items-center justify-between"
                >
                  <span>Play Store App Link</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.pdf_public_path && (
                <button
                  onClick={() => alert(`Downloading approved PDF specification: ${project.pdf_public_path}`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-semibold text-xs transition flex items-center justify-between hover:bg-teal-100"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Project PDF
                  </span>
                  <span className="text-[10px] uppercase font-bold">A4 Verified</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border)] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Completed:</span>
                <span className="font-semibold text-[var(--text)]">{formatDate(project.completion_date, lang)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Approved on:</span>
                <span className="font-semibold text-[var(--text)]">{formatDate(project.published_at, lang)}</span>
              </div>
            </div>
          </div>

          {/* Author Card */}
          {ownerProfile && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Author & Specialist
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow">
                  {ownerProfile.display_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text)]">
                    {ownerProfile.display_name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    {lang === 'ur' && ownerProfile.title_ur ? ownerProfile.title_ur : ownerProfile.title}
                  </p>
                </div>
              </div>
              <Link
                to={`/team/${ownerProfile.slug}`}
                className="w-full block text-center py-2 rounded-lg bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:text-indigo-600 transition"
              >
                View Full Specialist Portfolio →
              </Link>
            </div>
          )}

          {/* Tags */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Technologies & Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span key={t.slug} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--text)] font-medium">
                  {t.name_en}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
