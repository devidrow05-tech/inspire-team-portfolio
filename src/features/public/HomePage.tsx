import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import RawTilt from 'react-parallax-tilt';
import { useApp } from '../../context/AppContext';
import { ImageSlot } from '../../components/ui/ImageSlot';
import { HeroParticles } from '../../components/ui/HeroParticles';
import { Hero3DBackground } from '../../components/ui/Hero3DBackground';
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedCounter,
  RevealSection,
} from '../../components/ui/MotionPrimitives';
import {
  staggerContainer,
  fadeUp,
  dominoCard,
  EASINGS,
  useDeviceMotionPrefs,
} from '../../frontend/lib/animations';
import {
  mockPublishedProjects,
  mockMemberProfiles,
  mockCategories,
  mockShowcases,
} from '../../services/demo/data';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Award,
  ChevronRight,
  PhoneCall,
  Code2,
  Cpu,
  Palette,
  Terminal,
  Globe,
  Smartphone,
  TrendingUp,
} from 'lucide-react';

// Safe CJS/ESM default unwrapping for react-parallax-tilt
const Tilt = (
  typeof RawTilt === 'function' ||
  (typeof RawTilt === 'object' && RawTilt !== null && '$$typeof' in RawTilt)
    ? RawTilt
    : (RawTilt as unknown as { default?: typeof RawTilt })?.default || RawTilt
) as typeof RawTilt;

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Cpu,
  Palette,
  ShieldCheck,
  Terminal,
  Award,
  Layers,
  Globe,
  Smartphone,
  TrendingUp,
};

export const HomePage: React.FC = () => {
  const { config, t, lang } = useApp();
  const { isMobile, prefersReduced } = useDeviceMotionPrefs();
  const heroPrimaryLink =
    config.hero_btn1_link && config.hero_btn1_link !== '/projects'
      ? config.hero_btn1_link
      : '/team';

  return (
    <div className="space-y-20 pb-20">
      {/* 1A Hero Section - Interactive Particles + 3D Gyroscopic Emblem + Framer Motion */}
      {config.hero_visible !== false && (
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-indigo-50/80 via-[var(--bg)] to-teal-50/70 dark:from-[#0f172a] dark:via-[#0b1020] dark:to-[#0d2226]">
          {/* Animated Ambient Mesh Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-teal-400/15 dark:bg-teal-500/15 blur-3xl"
          />

          {/* Interactive tsParticles Background */}
          <HeroParticles />

          {/* Three.js 3D Gyroscopic Academy Emblem (Desktop/Tablet) */}
          <Hero3DBackground />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Animated Pill Badge */}
              <motion.div variants={fadeUp} className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide shadow-sm backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{config.hero_badge || t('hero.badge')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                </span>
              </motion.div>

              {/* Animated Hero Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text)] leading-[1.08]"
              >
                {config.hero_heading || t('hero.title')}
              </motion.h1>

              {/* Dynamic Typewriter Specialty Ribbon */}
              <motion.div
                variants={fadeUp}
                className="min-h-[28px] text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 dark:from-indigo-400 dark:via-violet-400 dark:to-teal-300 bg-clip-text text-transparent"
              >
                {prefersReduced ? (
                  <span>Full-Stack Web Engineering · Native Android · UI/UX Design Systems</span>
                ) : (
                  <TypeAnimation
                    sequence={[
                      'Full-Stack Web Engineering · React & Node.js',
                      1800,
                      'Native Android Development · Kotlin & Compose',
                      1800,
                      'Bilingual UI/UX & Accessible Design Systems',
                      1800,
                      'Faculty-Audited Production Deliverables',
                      1800,
                    ]}
                    wrapper="span"
                    speed={52}
                    repeat={Infinity}
                  />
                )}
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
              >
                {config.hero_subheading || t('hero.subtitle')}
              </motion.p>

              {/* Magnetic & Animated CTA Buttons */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center justify-center gap-3 pt-2"
              >
                <Link to={heroPrimaryLink}>
                  <AnimatedButton
                    magnetic
                    type="button"
                    className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 transition-shadow hover:shadow-indigo-600/40"
                  >
                    <span>{config.hero_btn1_text || t('nav.team')}</span>
                    <ArrowRight className="w-4 h-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </AnimatedButton>
                </Link>
                <Link to={config.hero_btn2_link || '/contact'}>
                  <AnimatedButton
                    type="button"
                    className="inline-flex items-center gap-2 bg-[var(--surface)]/85 hover:bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] font-bold text-sm px-6 py-3.5 rounded-xl backdrop-blur-sm transition"
                  >
                    <span>{config.hero_btn2_text || t('hero.ctaContact')}</span>
                  </AnimatedButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Animated Stat Counters */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto pt-8 border-t border-[var(--border)]/80"
            >
              <AnimatedCard className="p-4 rounded-2xl bg-[var(--surface)]/80 border border-[var(--border)] backdrop-blur-md shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  <AnimatedCounter end={mockPublishedProjects.length} duration={1.4} />
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] font-semibold mt-1">
                  Projects Published
                </div>
              </AnimatedCard>
              <AnimatedCard className="p-4 rounded-2xl bg-[var(--surface)]/80 border border-[var(--border)] backdrop-blur-md shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                  <AnimatedCounter end={mockCategories.length} duration={1.4} />
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] font-semibold mt-1">
                  Categories Added
                </div>
              </AnimatedCard>
              <AnimatedCard className="p-4 rounded-2xl bg-[var(--surface)]/80 border border-[var(--border)] backdrop-blur-md shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  <AnimatedCounter end={mockMemberProfiles.length} duration={1.4} />
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] font-semibold mt-1">
                  Team Members
                </div>
              </AnimatedCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Projects Grid with 3D Tilt & Stagger Domino Cards */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            to="/team"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline group"
          >
            <span>{t('sec.viewAllTeam')}</span>
            <ChevronRight className="w-4 h-4 rtl:-scale-x-100 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {mockPublishedProjects.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
              No projects have been added yet.
            </p>
          )}
          {mockPublishedProjects.map((project) => (
            <motion.div key={project.id} variants={dominoCard}>
              <Tilt
                tiltEnable={!isMobile && !prefersReduced}
                tiltMaxAngleX={7}
                tiltMaxAngleY={7}
                glareEnable={!isMobile && !prefersReduced}
                glareMaxOpacity={0.12}
                glareBorderRadius="1rem"
                scale={1.015}
                transitionSpeed={450}
                className="h-full"
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:border-indigo-400/50"
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
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      </RevealSection>

      {/* Services / Pillars Section - Staggered Animated Cards */}
      {config.services_visible !== false && config.services && config.services.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Core Academic Disciplines &amp; Services
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Disciplined instruction and industry standard deliverables across four flagship tracks.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {config.services.map((service) => {
              const IconComp = ICON_MAP[service.icon] || Code2;
              return (
                <motion.div key={service.id} variants={fadeUp}>
                  <AnimatedCard className="h-full p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-indigo-400/50 hover:shadow-lg transition-colors flex flex-col space-y-3 group">
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.06 }}
                      transition={EASINGS.springBouncy}
                      className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
                    >
                      <IconComp className="w-6 h-6" />
                    </motion.div>
                    <h3 className="font-bold text-base text-[var(--text)]">{service.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {service.description}
                    </p>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </motion.div>
        </RevealSection>
      )}

      {/* About Preview Section */}
      {config.about_preview_visible !== false && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline group"
                >
                  <span>Learn more about our methodology</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <AnimatedCard
              floatDistance={-6}
              className="w-full md:w-80 h-48 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white p-6 flex flex-col justify-between shrink-0 shadow-lg"
            >
              <ShieldCheck className="w-10 h-10 text-white/90" />
              <div>
                <div className="text-2xl font-black">100% Curated</div>
                <div className="text-xs text-white/80">Zero unchecked public deliverables</div>
              </div>
            </AnimatedCard>
          </div>
        </RevealSection>
      )}

      {/* Categories & Technical Domains */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            {t('sec.categoriesTitle')}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {t('sec.categoriesSubtitle')}
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {mockCategories.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
              No categories have been added yet.
            </p>
          )}
          {mockCategories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <AnimatedCard className="h-full">
                <Link
                  to="/categories"
                  className="p-5 h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] hover:border-indigo-400/50 transition text-center flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)]">
                      {lang === 'ur' && cat.name_ur ? cat.name_ur : cat.name_en}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                      {lang === 'ur' && cat.description_ur
                        ? cat.description_ur
                        : cat.description_en}
                    </p>
                  </div>
                </Link>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </RevealSection>

      {/* Meet Our Team Section */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline group"
          >
            <span>{t('sec.viewAllTeam')}</span>
            <ChevronRight className="w-4 h-4 rtl:-scale-x-100 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {mockMemberProfiles.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
              Team profiles will appear here when added.
            </p>
          )}
          {mockMemberProfiles.map((member) => (
            <motion.div key={member.id} variants={fadeUp}>
              <AnimatedCard className="h-full">
                <Link
                  to={`/team/${member.slug}`}
                  className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:shadow-lg hover:border-teal-400/50 transition-all duration-200"
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
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium"
                        >
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
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </RevealSection>

      {/* Assignment Showcase Teaser */}
      {mockShowcases.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </RevealSection>
      )}

      {/* Bottom CTA Banner */}
      {config.cta_visible !== false && (
        <RevealSection className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {config.cta_heading || t('sec.ctaTitle')}
          </h3>
          <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            {config.cta_subheading || t('sec.ctaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to={config.cta_btn_link || '/contact'}>
              <AnimatedButton
                magnetic
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow"
              >
                {config.cta_btn_text || t('nav.contact')}
              </AnimatedButton>
            </Link>
            {config.whatsapp_number && (
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={EASINGS.spring}
                href={`https://wa.me/${config.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp</span>
              </motion.a>
            )}
          </div>
        </RevealSection>
      )}
    </div>
  );
};
