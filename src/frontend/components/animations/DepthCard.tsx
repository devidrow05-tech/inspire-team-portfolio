import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ImageSlot } from '../../../components/ui/ImageSlot';
import type { PublishedProject } from '../../../types/database';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface DepthCardProps {
  project: PublishedProject;
  lang?: 'en' | 'ur';
}

export const DepthCard: React.FC<DepthCardProps> = ({ project, lang = 'en' }) => {
  const { isMobile, prefersReduced } = useDeviceMotionPrefs();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shine, setShine] = useState({ x: 50, y: 50, active: false });

  const allowTilt = !isMobile && !prefersReduced;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!allowTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateY((x - 0.5) * 16);
    setRotateX((0.5 - y) * 16);
    setShine({ x: x * 100, y: y * 100, active: true });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShine({ x: 50, y: 50, active: false });
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:shadow-2xl hover:border-indigo-400/50 transition-shadow h-full"
      style={
        allowTilt
          ? { perspective: '1000px', transformStyle: 'preserve-3d' }
          : undefined
      }
      animate={allowTilt ? { rotateX, rotateY } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/projects/${project.slug}`} className="group h-full flex flex-col">
        {/* Image layer — deeper Z plane */}
        <div style={allowTilt ? { transform: 'translateZ(-10px)' } : undefined}>
          <ImageSlot
            src={project.cover_public_path}
            alt={project.title}
            aspect="16/10"
            fallbackText={project.title}
            badge={project.category_name}
          />
        </div>

        {/* Content layer — elevated Z plane */}
        <div
          className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[var(--surface)]"
          style={allowTilt ? { transform: 'translateZ(16px)' } : undefined}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>By {project.owner_display_name}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Approved &amp; Live
              </span>
            </div>
            <h3 className="font-bold text-base text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {lang === 'ur' && project.title_ur ? project.title_ur : project.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
              {lang === 'ur' && project.short_description_ur
                ? project.short_description_ur
                : project.short_description}
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.slug}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--text-muted)] font-medium"
                >
                  {tag.name_en}
                </span>
              ))}
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
              View
              <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </span>
          </div>
        </div>
      </Link>

      {/* Shine reflection layer */}
      {allowTilt && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: shine.active ? 1 : 0,
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 40%, transparent 72%)`,
          }}
        />
      )}
    </motion.div>
  );
};
