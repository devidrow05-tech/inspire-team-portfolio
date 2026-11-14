import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DepthCard } from './DepthCard';
import type { PublishedProject } from '../../../types/database';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface HorizontalProjectsReelProps {
  projects: PublishedProject[];
  lang?: 'en' | 'ur';
}

const StickyHorizontalReel: React.FC<{
  projects: PublishedProject[];
  lang: 'en' | 'ur';
}> = ({ projects, lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const maxShift = Math.min(65, Math.max(20, (projects.length - 3) * 22));
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${maxShift}%`]);

  return (
    <div ref={ref} className="relative h-[200vh]" aria-label="Projects Reel">
      <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-hidden flex items-center">
        <motion.div className="flex gap-6 px-4" style={{ x }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="flex-shrink-0 w-80 sm:w-96"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.08, 0.35) }}
            >
              <DepthCard project={project} lang={lang} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export const HorizontalProjectsReel: React.FC<HorizontalProjectsReelProps> = ({
  projects,
  lang = 'en',
}) => {
  const { isMobile, prefersReduced } = useDeviceMotionPrefs();
  const enableStickyReel = !isMobile && !prefersReduced && projects.length > 3;

  if (projects.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
        No projects have been added yet.
      </p>
    );
  }

  if (!enableStickyReel) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: Math.min(i * 0.08, 0.3), duration: 0.45 }}
            className="h-full"
          >
            <DepthCard project={project} lang={lang} />
          </motion.div>
        ))}
      </div>
    );
  }

  return <StickyHorizontalReel projects={projects} lang={lang} />;
};
