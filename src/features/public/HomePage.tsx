import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ImageSlot } from '../../components/ui/ImageSlot';
import {
  mockPublishedProjects,
  mockMemberProfiles,
  mockCategories,
  mockShowcases
} from '../../services/demo/data';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers,
  Award,
  ChevronRight,
  PhoneCall,
  Code2,
  Cpu,
  Palette,
  Terminal,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Cpu,
  Palette,
  ShieldCheck,
  Terminal,
  Award,
  Layers,
};

export const HomePage: React.FC = () => {
  const { config, t, lang } = useApp();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1A Hero Section - Controlled completely by CMS */}
      {config.hero_visible !== false && (
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border)] bg-gradient-to-b from-indigo-50/50 via-[var(--bg)] to-[var(--bg)] dark:from-indigo-950/20">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{config.hero_badge || t('hero.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text)] leading-tight sm:leading-tight">
              {config.hero_heading || t('hero.title')}
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-normal">
              {config.hero_subheading || t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to={config.hero_btn1_link || '/projects'}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-transform hover:-translate-y-0.5"
              >
                <span>{config.hero_btn1_text || t('hero.ctaProjects')}</span>
                <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
              </Link>
              <Link
                to={config.hero_btn2_link || '/contact'}
                className="inline-flex items-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] font-semibold text-sm px-6 py-3 rounded-xl transition"
              >
                <span>{config.hero_btn2_text || t('hero.ctaContact')}</span>
              </Link>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-[var(--border)]/70 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</div>
                <div className="text-xs text-[var(--text-muted)] font-medium mt-1">{t('hero.statReview')}</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">8+</div>
                <div className="text-xs text-[var(--text-muted)] font-medium mt-1">{t('hero.statCategories')}</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">30+</div>
                <div className="text-xs text-[var(--text-muted)] font-medium mt-1">{t('hero.statMembers')}</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">Zero</div>
                <div className="text-xs text-[var(--text-muted)] font-medium mt-1">Unapproved Leaks</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              {t('sec.featuredProjects')}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {t('sec.featuredSubtitle')}
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>{t('sec.viewAllProjects')}</span>
            <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPublishedProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400/50"
            >
              <ImageSlot
                src={project.cover_public_path}
                alt={project.title}
                aspect="16/10"
                fallbackText={project.title}
                badge={project.category_name}
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>By {project.owner_display_name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Approved & Live</span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lang === 'ur' && project.title_ur ? project.title_ur : project.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {lang === 'ur' && project.short_description_ur ? project.short_description_ur : project.short_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag.slug} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--text-muted)] font-medium">
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
          ))}
        </div>
      </section>

      {/* Services / Pillars Section - Controlled by CMS */}
      {config.services_visible !== false && config.services && config.services.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Core Academic Disciplines & Services
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Disciplined instruction and industry standard deliverables across four flagship tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.services.map((service) => {
              const IconComp = ICON_MAP[service.icon] || Code2;
              return (
                <div
                  key={service.id}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition flex flex-col space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text)]">{service.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* About Preview Section - Controlled by CMS */}
      {config.about_preview_visible !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                ACADEMY OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
                {config.about_preview_heading || 'Governance & Quality First'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {config.about_preview_text ||
                  'Inspire Academy provides an uncompromising environment where students evolve into production-ready software engineers and digital craftsmen.'}
              </p>
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Learn more about our methodology</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>

            <div className="w-full md:w-80 h-48 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white p-6 flex flex-col justify-between shrink-0 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white/90" />
              <div>
                <div className="text-2xl font-black">100% Curated</div>
                <div className="text-xs text-white/80">Zero unchecked public deliverables</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories & Technical Domains */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            {t('sec.categoriesTitle')}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {t('sec.categoriesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/projects?category=${cat.slug}`}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition text-center flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">
                  {lang === 'ur' && cat.name_ur ? cat.name_ur : cat.name_en}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                  {lang === 'ur' && cat.description_ur ? cat.description_ur : cat.description_en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              {t('sec.teamTitle')}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {t('sec.teamSubtitle')}
            </p>
          </div>
          <Link
            to="/team"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <span>{t('sec.viewAllTeam')}</span>
            <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMemberProfiles.map((member) => (
            <Link
              key={member.id}
              to={`/team/${member.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:shadow-lg hover:border-teal-400/50 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-base flex items-center justify-center shadow-md">
                    {member.display_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--text)] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
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
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium">View Portfolio</span>
                <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Assignment Showcase Teaser */}
      {mockShowcases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-r from-indigo-900/90 via-slate-900 to-teal-900/90 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Academy Showcase
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {mockShowcases[0].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {mockShowcases[0].summary}
              </p>
              <div className="pt-2">
                <Link
                  to={`/projects/${mockShowcases[0].linked_project_slug}`}
                  className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Banner - Controlled by CMS */}
      {config.cta_visible !== false && (
        <section className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {config.cta_heading || t('sec.ctaTitle')}
          </h3>
          <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            {config.cta_subheading || t('sec.ctaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to={config.cta_btn_link || '/contact'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow"
            >
              {config.cta_btn_text || t('nav.contact')}
            </Link>
            {config.whatsapp_number && (
              <a
                href={`https://wa.me/${(config.whatsapp_number).replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
