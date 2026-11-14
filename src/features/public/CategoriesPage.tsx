import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Cpu,
  Laptop,
  Palette,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { mockCategories } from '../../services/demo/data';
import { useApp } from '../../context/AppContext';

const categoryVisuals: Record<string, { icon: React.ElementType; theme: string; eyebrow: string; visual: string; accent: string }> = {
  productivity: {
    icon: Laptop,
    theme: 'from-sky-500 via-blue-600 to-indigo-800',
    eyebrow: 'WORK SMARTER',
    visual: '01',
    accent: 'shadow-sky-400/40',
  },
  'design-media': {
    icon: Palette,
    theme: 'from-fuchsia-600 via-violet-600 to-indigo-800',
    eyebrow: 'CREATE & DESIGN',
    visual: '02',
    accent: 'shadow-fuchsia-400/40',
  },
  'technical-ai': {
    icon: Cpu,
    theme: 'from-cyan-500 via-teal-600 to-emerald-800',
    eyebrow: 'BUILD THE FUTURE',
    visual: '03',
    accent: 'shadow-cyan-400/40',
  },
  'business-marketing': {
    icon: BriefcaseBusiness,
    theme: 'from-amber-400 via-orange-600 to-rose-700',
    eyebrow: 'GROW YOUR BRAND',
    visual: '04',
    accent: 'shadow-orange-400/40',
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export const CategoriesPage: React.FC = () => {
  const { lang, t } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <motion.header
        className="max-w-3xl space-y-3"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-700 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          Inspire disciplines
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          {t('nav.categories')}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Explore the core learning and professional domains at Inspire.
          Choose a discipline to discover the specialists behind the work.
        </p>
      </motion.header>

      {mockCategories.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
          No categories have been added yet.
        </p>
      ) : (
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6"
          aria-label="Academy categories"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
        >
          {mockCategories.map((cat) => {
            const visual = categoryVisuals[cat.slug] || categoryVisuals.productivity;
            const Icon = visual.icon;
            return (
              <motion.article
                key={cat.id}
                variants={cardMotion}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -9, scale: 1.015 }}
                className="group min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-2xl transition-shadow duration-500"
              >
                <div className={`relative isolate h-52 sm:h-56 overflow-hidden bg-gradient-to-br ${visual.theme}`}>
                  <motion.div
                    className="absolute -inset-[45%] opacity-35"
                    aria-hidden="true"
                    style={{ background: 'conic-gradient(from 0deg, transparent 0 55%, rgba(255,255,255,.45) 68%, transparent 78% 100%)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 opacity-20" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                  <motion.div
                    className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-white/30"
                    aria-hidden="true"
                    animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                    transition={{ rotate: { duration: 24, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
                  />
                  <motion.div
                    className="absolute right-5 top-9 h-32 w-32 rounded-full border-2 border-dashed border-white/25"
                    aria-hidden="true"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-white/25 blur-3xl"
                    aria-hidden="true"
                    animate={{ x: [0, 30, 0], y: [0, -14, 0], opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute left-[48%] top-10 text-white/80"
                    aria-hidden="true"
                    animate={{ y: [0, -10, 0], rotate: [0, 12, 0], opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 text-white">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.16em] backdrop-blur-md shadow-lg">
                        <Zap className="h-3 w-3" />
                        {visual.eyebrow}
                      </span>
                      <span className="text-xs font-bold tracking-widest text-white/80">{visual.visual}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <motion.div
                        className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-[25px] border border-white/40 bg-white/20 backdrop-blur-xl shadow-2xl ${visual.accent}`}
                        animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        whileHover={{ scale: 1.14, rotate: 8 }}
                      >
                        <div className="absolute inset-1 rounded-[20px] border border-white/20" />
                        <Icon className="relative h-9 w-9 drop-shadow-lg" strokeWidth={1.7} />
                      </motion.div>
                      <motion.span
                        className="text-7xl font-black tracking-tighter text-white/20 select-none"
                        aria-hidden="true"
                        whileHover={{ scale: 1.15, rotate: -7 }}
                      >
                        {visual.visual}
                      </motion.span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-white/80 transition-transform duration-700 group-hover:scale-x-100" />
                </div>
                <div className="flex min-h-[190px] flex-col p-5 sm:p-6">
                  <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                    {lang === 'ur' && cat.name_ur ? cat.name_ur : cat.name_en}
                  </h2>
                  <p className="mt-2 flex-1 text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
                    {lang === 'ur' && cat.description_ur ? cat.description_ur : cat.description_en}
                  </p>
                  <Link
                    to="/team"
                    className="mt-5 inline-flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    <span>Explore specialists</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.section>
      )}
    </main>
  );
};
