import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { RevealSection } from '../../components/ui/MotionPrimitives';
import {
  ScrambleText,
  PremiumInput,
  MaskReveal,
} from '../../frontend/components/animations';
import { staggerContainer, fadeUp, useDeviceMotionPrefs } from '../../frontend/lib/animations';
import { mockMemberProfiles } from '../../services/demo/data';
import { ChevronRight, Sparkles } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { lang, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile, prefersReduced } = useDeviceMotionPrefs();

  const publishedMembers = mockMemberProfiles.filter((m) => {
    if (!m.is_published) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.display_name.toLowerCase().includes(q) ||
      (m.title || '').toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <RevealSection className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Specialists</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
            <ScrambleText text={t('nav.team')} />
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Meet the verified specialists, software engineers, and product designers leading technical workflows at Inspire Academy.
          </p>
        </div>

        {/* Premium Floating-Label Search Bar */}
        <div className="w-full md:w-72">
          <PremiumInput
            id="team-search"
            label="Filter by name, role, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </RevealSection>

      <MaskReveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
        {publishedMembers.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
            {searchTerm
              ? 'No team profiles match your search.'
              : 'Team profiles will appear here when added.'}
          </p>
        )}

        {publishedMembers.map((member) => (
          <motion.div
            key={member.id}
            variants={fadeUp}
            className="perspective-1000 h-full min-h-[260px]"
          >
            <Link
              to={`/team/${member.slug}`}
              className="group block h-full relative preserve-3d transition-transform duration-500 hover:[transform:rotateY(180deg)] focus-visible:[transform:rotateY(180deg)]"
              style={
                isMobile || prefersReduced
                  ? { transform: 'none' }
                  : undefined
              }
            >
              {/* Front Face */}
              <div className="backface-hidden h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between shadow-sm group-hover:border-teal-400/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                      {member.display_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[var(--text)]">
                        {member.display_name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {lang === 'ur' && member.title_ur ? member.title_ur : member.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                    {lang === 'ur' && member.bio_ur ? member.bio_ur : member.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-medium">Explore Projects</span>
                  <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 rtl:-scale-x-100" />
                </div>
              </div>

              {/* Back Face (3D Flip Preview on Desktop Hover) */}
              {!isMobile && !prefersReduced && (
                <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-2xl border border-teal-500/40 bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-950 text-white p-6 flex flex-col justify-between shadow-xl">
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-teal-300">
                      Capabilities Snapshot
                    </div>
                    <h4 className="font-bold text-base">{member.display_name}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-teal-200 border border-white/15 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-teal-300">
                    <span>Open Full Portfolio</span>
                    <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                  </div>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
        </motion.div>
      </MaskReveal>
    </div>
  );
};
