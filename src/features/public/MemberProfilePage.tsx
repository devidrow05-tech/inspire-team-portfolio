import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockMemberProfiles, mockPublishedProjects } from '../../services/demo/data';
import { ImageSlot } from '../../components/ui/ImageSlot';
import { Github, Linkedin, Globe, Mail, ChevronLeft, ArrowRight } from 'lucide-react';
import { safeUrl } from '../../lib/format';

export const MemberProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useApp();

  const member = mockMemberProfiles.find((m) => m.slug === slug);

  if (!member || !member.is_published) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)]">Member Profile Not Found</h2>
        <p className="text-sm text-[var(--text-muted)]">
          This specialist profile has either not been published or does not exist.
        </p>
        <Link
          to="/team"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
          Back to Team Directory
        </Link>
      </div>
    );
  }

  // Filter projects published by this member
  const memberProjects = mockPublishedProjects.filter(
    (p) => p.owner_id === member.profile_id && p.is_visible
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Profile Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {member.display_name.slice(0, 2).toUpperCase()}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
                {member.display_name}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                Verified Academy Member
              </span>
            </div>

            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
              {lang === 'ur' && member.title_ur ? member.title_ur : member.title}
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
              {lang === 'ur' && member.bio_ur ? member.bio_ur : member.bio}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0">
            {member.github_url && safeUrl(member.github_url) && (
              <a
                href={safeUrl(member.github_url)!}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] transition"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.linkedin_url && safeUrl(member.linkedin_url) && (
              <a
                href={safeUrl(member.linkedin_url)!}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] transition"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
            Verified Technical Skills & Specializations
          </span>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--text)] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Member Approved Projects */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Approved Portfolio Deliverables ({memberProjects.length})
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Faculty-reviewed projects delivered by {member.display_name}.
          </p>
        </div>

        {memberProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-xs text-[var(--text-muted)]">
            No public projects currently released for this member.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-teal-400/50"
              >
                <ImageSlot
                  src={project.cover_public_path}
                  alt={project.title}
                  aspect="16/10"
                  fallbackText={project.title}
                  badge={project.category_name}
                />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[var(--text)] group-hover:text-teal-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                      {project.short_description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-teal-600">
                    <span>Explore Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
