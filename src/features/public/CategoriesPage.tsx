import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { mockCategories } from '../../services/demo/data';
import { AnimatedCard, RevealSection } from '../../components/ui/MotionPrimitives';
import { ScrambleText, MaskReveal } from '../../frontend/components/animations';
import { staggerContainer, fadeUp } from '../../frontend/lib/animations';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { lang, t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <RevealSection className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
          <ScrambleText text={t('nav.categories')} />
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Disciplines and specialization domains managed by Inspire Academy.
        </p>
      </RevealSection>

      <MaskReveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {mockCategories.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
              No categories have been added yet.
            </p>
          )}
          {mockCategories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <AnimatedCard className="h-full">
                <Link
                  to="/team"
                  className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:shadow-lg hover:border-indigo-400/50 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-[var(--text)] group-hover:text-indigo-600 transition-colors">
                      {lang === 'ur' && cat.name_ur ? cat.name_ur : cat.name_en}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {lang === 'ur' && cat.description_ur ? cat.description_ur : cat.description_en}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[var(--border)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                    <span>View Specialists</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </MaskReveal>
    </div>
  );
};
