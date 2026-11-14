import React from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Cpu,
  Laptop,
  Palette,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { mockCategories } from '../../services/demo/data';
import { useApp } from '../../context/AppContext';

const categoryVisuals: Record<string, { icon: React.ElementType; theme: string; eyebrow: string; visual: string }> = {
  productivity: {
    icon: Laptop,
    theme: 'from-sky-600 via-blue-600 to-indigo-700',
    eyebrow: 'WORK SMARTER',
    visual: '01',
  },
  'design-media': {
    icon: Palette,
    theme: 'from-fuchsia-600 via-violet-600 to-indigo-700',
    eyebrow: 'CREATE & DESIGN',
    visual: '02',
  },
  'technical-ai': {
    icon: Cpu,
    theme: 'from-cyan-600 via-teal-600 to-emerald-700',
    eyebrow: 'BUILD THE FUTURE',
    visual: '03',
  },
  'business-marketing': {
    icon: BriefcaseBusiness,
    theme: 'from-amber-500 via-orange-600 to-rose-600',
    eyebrow: 'GROW YOUR BRAND',
    visual: '04',
  },
};

export const CategoriesPage: React.FC = () => {
  const { lang, t } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <header className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-700 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          Inspire Academy disciplines
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          {t('nav.categories')}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Explore the core learning and professional domains at Inspire Academy.
          Choose a discipline to discover the specialists behind the work.
        </p>
      </header>

      {mockCategories.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
          No categories have been added yet.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6" aria-label="Academy categories">
          {mockCategories.map((cat) => {
            const visual = categoryVisuals[cat.slug] || categoryVisuals.productivity;
            const Icon = visual.icon;
            return (
              <article
                key={cat.id}
                className="group min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className={`relative isolate h-44 sm:h-48 overflow-hidden bg-gradient-to-br ${visual.theme}`}>
                  <div className="absolute inset-0 opacity-20" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '19px 19px' }} />
                  <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border border-white/20" aria-hidden="true" />
                  <div className="absolute -right-1 top-5 h-32 w-32 rounded-full border border-white/20" aria-hidden="true" />
                  <div className="absolute -bottom-16 left-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                  <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 text-white">
                    <div className="flex items-start justify-between">
                      <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.16em] backdrop-blur-sm">
                        {visual.eyebrow}
                      </span>
                      <span className="text-xs font-semibold tracking-widest text-white/70">{visual.visual}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur-md">
                        <Icon className="h-7 w-7" strokeWidth={1.7} />
                      </div>
                      <span className="text-5xl font-black tracking-tighter text-white/20" aria-hidden="true">
                        {visual.visual}
                      </span>
                    </div>
                  </div>
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
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};
