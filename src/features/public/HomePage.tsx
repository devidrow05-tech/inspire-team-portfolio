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
      {/* 1A Hero Section - CMS content with a visual showcase */}
      {config.hero_visible !== false && (
        <section className="inspire-hero relative isolate overflow-hidden border-b border-[var(--border)]">
          <div className="inspire-hero-glow inspire-hero-glow-one" aria-hidden="true" />
          <div className="inspire-hero-glow inspire-hero-glow-two" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-[1.02fr_0.98fr] items-center gap-12 lg:gap-8">
            <div className="max-w-2xl text-center lg:text-left rtl:lg:text-right mx-auto lg:mx-0 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>{config.hero_badge || t('hero.badge')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-[var(--text)] leading-[1.08]">
                {config.hero_heading || t('hero.title')}
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                {config.hero_subheading || t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <Link to={config.hero_btn1_link || '/projects'} className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-600/40">
                  <span>{config.hero_btn1_text || t('hero.ctaProjects')}</span>
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
                <Link to={config.hero_btn2_link || '/contact'} className="inline-flex items-center gap-2 bg-[var(--surface)]/80 hover:bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1">
                  <span>{config.hero_btn2_text || t('hero.ctaContact')}</span>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 pt-2 text-xs font-semibold text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Real student work</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-500" /> Reviewed showcases</span>
              </div>
            </div>

            <div className="inspire-hero-art relative w-full max-w-[560px] mx-auto h-[330px] sm:h-[430px] lg:h-[480px]" aria-label="A visual collage representing creative technology projects">
              <div className="absolute inset-[8%] rounded-[2rem] bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-teal-400/15 blur-2xl" />
              <div className="inspire-orbit absolute inset-[7%] rounded-full border border-indigo-400/20" />
              <div className="inspire-orbit inspire-orbit-two absolute inset-[18%] rounded-full border border-teal-400/20" />
              <div className="inspire-poster inspire-poster-main absolute left-[20%] top-[9%] w-[58%] h-[76%] rounded-[1.6rem] overflow-hidden border border-white/30 shadow-2xl bg-gradient-to-br from-[#172554] via-[#4338ca] to-[#0f766e] p-5 sm:p-7 flex flex-col justify-between text-white">
                <div className="absolute -right-12 -top-10 w-48 h-48 rounded-full border-[26px] border-white/10" />
                <div className="absolute right-5 top-20 w-20 h-20 rounded-3xl rotate-12 bg-teal-300/20 backdrop-blur-sm border border-white/20" />
                <div className="relative flex items-center justify-between text-[10px] sm:text-xs font-bold tracking-[.22em] uppercase text-white/75"><span>INSPIRE / LAB</span><Sparkles className="w-5 h-5" /></div>
                <div className="relative space-y-2 sm:space-y-3">
                  <div className="text-[10px] sm:text-xs uppercase tracking-[.25em] text-teal-200 font-bold">Ideas into impact</div>
                  <div className="text-3xl sm:text-5xl font-black leading-[.98] tracking-tight">CREATE.<br/>BUILD.<br/><span className="text-teal-200">INSPIRE.</span></div>
                  <div className="h-1 w-14 rounded-full bg-teal-300" />
                  <p className="text-[10px] sm:text-xs text-white/75 max-w-[190px]">A showcase of curious minds and bold digital work.</p>
                </div>
                <div className="relative flex items-center justify-between text-[9px] sm:text-[10px] tracking-widest text-white/60"><span>DESIGN · CODE · FUTURE</span><span>01 — 03</span></div>
              </div>
              <div className="inspire-float inspire-float-left absolute left-0 top-[25%] w-[34%] h-[37%] rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-amber-300 to-orange-500 shadow-2xl p-3 sm:p-4 text-slate-950 rotate-[-9deg]">
                <div className="text-[9px] sm:text-[10px] font-black tracking-[.18em]">DESIGN STUDIO</div><div className="mt-4 sm:mt-6 text-xl sm:text-3xl font-black leading-none">Think<br/>different<span className="text-white">.</span></div><div className="mt-3 w-8 h-1 bg-slate-950 rounded-full" />
              </div>
              <div className="inspire-float inspire-float-right absolute right-0 top-[48%] w-[33%] h-[36%] rounded-2xl border border-white/30 shadow-2xl p-3 sm:p-4 text-white rotate-[8deg] bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-800">
                <div className="flex items-center justify-between"><Code2 className="w-5 h-5"/><span className="text-[9px] font-bold tracking-widest">DEV / 24</span></div><div className="mt-5 sm:mt-7 text-xl sm:text-3xl font-black leading-none">Build<br/>what's<br/>next.</div><div className="mt-3 flex gap-1"><i className="w-5 h-1 rounded-full bg-teal-300"/><i className="w-2 h-1 rounded-full bg-white/60"/><i className="w-2 h-1 rounded-full bg-white/60"/></div>
              </div>
              <div className="absolute left-[17%] bottom-[1%] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl shadow-xl px-3.5 py-3 flex items-center gap-3 inspire-float-badge">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300 flex items-center justify-center"><Award className="w-5 h-5"/></div><div><div className="text-xs font-extrabold text-[var(--text)]">Made to stand out</div><div className="text-[10px] text-[var(--text-muted)]">Student creativity, on display</div></div>
              </div>
              <div className="absolute right-[13%] top-[5%] w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_24px_8px_rgba(45,212,191,.35)] animate-pulse" />
            </div>

            <div className="lg:col-span-2 grid grid-cols-3 gap-2 sm:gap-4 pt-7 border-t border-[var(--border)]/80 max-w-4xl w-full mx-auto">
              <div className="text-center p-3 sm:p-4 rounded-2xl bg-[var(--surface)]/70 border border-[var(--border)] backdrop-blur-sm"><div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{mockPublishedProjects.length}</div><div className="text-[10px] sm:text-xs text-[var(--text-muted)] font-semibold mt-1">Projects published</div></div>
              <div className="text-center p-3 sm:p-4 rounded-2xl bg-[var(--surface)]/70 border border-[var(--border)] backdrop-blur-sm"><div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">{mockCategories.length}</div><div className="text-[10px] sm:text-xs text-[var(--text-muted)] font-semibold mt-1">Categories added</div></div>
              <div className="text-center p-3 sm:p-4 rounded-2xl bg-[var(--surface)]/70 border border-[var(--border)] backdrop-blur-sm"><div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{mockMemberProfiles.length}</div><div className="text-[10px] sm:text-xs text-[var(--text-muted)] font-semibold mt-1">Team members</div></div>
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
          {mockPublishedProjects.length === 0 && <p className="col-span-full py-10 text-center text-sm text-[var(--text-muted)]">No projects have been added yet.</p>}
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
          {mockCategories.length === 0 && <p className="col-span-full py-8 text-center text-sm text-[var(--text-muted)]">No categories have been added yet.</p>}
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
          {mockMemberProfiles.length === 0 && <p className="col-span-full py-8 text-center text-sm text-[var(--text-muted)]">Team profiles will appear here when added.</p>}
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
