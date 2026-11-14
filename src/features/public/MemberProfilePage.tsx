import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { mockMemberProfiles, mockPublishedProjects } from '../../services/demo/data';
import { RevealSection } from '../../components/ui/MotionPrimitives';
import { WordReveal, DepthCard } from '../../frontend/components/animations';
import { staggerContainer, fadeUp, EASINGS, useDeviceMotionPrefs } from '../../frontend/lib/animations';
import { Github, Linkedin, ChevronLeft } from 'lucide-react';
import { safeUrl } from '../../lib/format';

export const MemberProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useApp();
  const { prefersReduced } = useDeviceMotionPrefs();

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
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
          Back to Team Directory
        </Link>
      </div>
    );
  }

  const memberProjects = mockPublishedProjects.filter(
    (p) => p.owner_id === member.profile_id && p.is_visible
  );

  const nameChars = Array.from(member.display_name);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Profile Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Blur-to-sharp Avatar Reveal */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: EASINGS.decelerate }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shrink-0"
          >
            {member.display_name.slice(0, 2).toUpperCase()}
          </motion.div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Letter-by-letter display name reveal */}
              <h1
                aria-label={member.display_name}
                className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] flex flex-wrap"
              >
                {prefersReduced
                  ? member.display_name
                  : nameChars.map((ch, idx) => (
                      <motion.span
                        key={`${idx}-${ch}`}
                        aria-hidden="true"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.025, duration: 0.25 }}
                        className={ch === ' ' ? 'w-2' : undefined}
                      >
                        {ch}
                      </motion.span>
                    ))}
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

          {/* Floating Spring Social Buttons */}
          <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0">
            {member.github_url && safeUrl(member.github_url) && (
              <motion.a
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={EASINGS.spring}
                href={safeUrl(member.github_url)!}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] transition"
                title="GitHub"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4" />
              </motion.a>
            )}
            {member.linkedin_url && safeUrl(member.linkedin_url) && (
              <motion.a
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={EASINGS.spring}
                href={safeUrl(member.linkedin_url)!}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] transition"
                title="LinkedIn"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
            )}
          </div>
        </div>

        {/* Animated Skill Bars */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
            Verified Technical Skills & Specializations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {member.skills.map((skill, idx) => {
              const level = Math.max(78, 96 - idx * 4);
              return (
                <div
                  key={skill}
                  className="p-3 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                    <span>{skill}</span>
                    <span className="text-teal-600 dark:text-teal-400">{level}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.06, ease: EASINGS.decelerate }}
                      className="h-full w-full origin-left rounded-full bg-gradient-to-r from-indigo-600 to-teal-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Member Approved Projects */}
      <RevealSection className="space-y-6">
        <div>
          <WordReveal
            text={`Approved Portfolio Deliverables (${memberProjects.length})`}
            className="text-2xl font-bold tracking-tight text-[var(--text)]"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Faculty-reviewed projects delivered by {member.display_name}.
          </p>
        </div>

        {memberProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-xs text-[var(--text-muted)]">
            No public projects currently released for this member.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {memberProjects.map((project) => (
              <motion.div key={project.id} variants={fadeUp} className="h-full">
                <DepthCard project={project} lang={lang} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </RevealSection>
    </div>
  );
};
