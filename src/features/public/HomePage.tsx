import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useApp } from '../../context/AppContext';
import { Hero3DBackground } from '../../components/ui/Hero3DBackground';
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedCounter,
} from '../../components/ui/MotionPrimitives';
import {
  ParallaxSection,
  SplitHeading,
  ScrambleText,
  WordReveal,
  GradientText,
  MagneticButton,
  MaskReveal,
  ServiceCard,
} from '../../frontend/components/animations';
import {
  staggerContainer,
  fadeUp,
  EASINGS,
  useDeviceMotionPrefs,
} from '../../frontend/lib/animations';
import { mockCategories } from '../../services/demo/data';
import { portfolioApi, type TeamMember, type PortfolioProject } from '../../lib/portfolio';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronRight,
  PhoneCall,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { config, t, lang } = useApp();
  const { prefersReduced } = useDeviceMotionPrefs();
  const [publishedProjects, setPublishedProjects] = useState<PortfolioProject[]>([]);
  const [publishedMembers, setPublishedMembers] = useState<TeamMember[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([portfolioApi.listMembers(), portfolioApi.listProjects()])
      .then(([members, projects]) => {
        if (!active) return;
        setPublishedMembers(members.filter((member) => member.is_published));
        setPublishedProjects(projects.filter((project) => project.is_published));
      })
      .catch((error) => console.error('Unable to load homepage portfolio content:', error))
      .finally(() => { if (active) setPortfolioLoading(false); });
    return () => { active = false; };
  }, []);
  const heroPrimaryLink =
    config.hero_btn1_link && config.hero_btn1_link !== '/projects'
      ? config.hero_btn1_link
      : '/team';

  return (
    <div className="space-y-20 pb-20">
      {/* Premium split-layout INSPIRE hero */}
      {config.hero_visible !== false && (
        <section className="inspire-hero relative isolate overflow-hidden border-b border-[var(--border)]">
          <div aria-hidden="true" className="absolute inset-0 inspire-hero-grid opacity-50" />
          <div aria-hidden="true" className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-[100px]" />
          <div aria-hidden="true" className="absolute -bottom-48 right-0 h-[32rem] w-[32rem] rounded-full bg-teal-400/15 blur-[110px]" />
          <ParallaxSection speed={0.25} className="pointer-events-none absolute inset-0">
            <Hero3DBackground />
          </ParallaxSection>

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-14 lg:px-8 lg:py-24">
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.2em] text-teal-700 shadow-sm backdrop-blur dark:text-teal-300">
                  <Sparkles className="h-4 w-4" />
                  <ScrambleText text={config.hero_badge || t('hero.badge')} />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
                </span>
              </motion.div>

              <motion.div variants={fadeUp}>
                <SplitHeading
                  text={config.hero_heading || t('hero.title')}
                  className="text-4xl font-black leading-[1.06] tracking-[-.045em] text-[var(--text)] sm:text-5xl lg:text-[4.25rem]"
                />
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 min-h-[32px] text-base font-extrabold sm:text-lg">
                <GradientText>
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
                </GradientText>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-5 max-w-xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                {config.hero_subheading || t('hero.subtitle')}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={heroPrimaryLink}>
                  <MagneticButton type="button" className="group inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-600/40">
                    <span>{config.hero_btn1_text || t('nav.team')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                  </MagneticButton>
                </Link>
                <Link to={config.hero_btn2_link || '/contact'}>
                  <AnimatedButton type="button" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 px-6 py-3.5 text-sm font-bold text-[var(--text)] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-teal-400/60 hover:bg-[var(--surface-2)]">
                    <span>{config.hero_btn2_text || t('hero.ctaContact')}</span>
                  </AnimatedButton>
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-500" /> Practical learning</span>
                <span className="inline-flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-500" /> Real-world projects</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{opacity:0, y:24, scale:.97}} animate={{opacity:1, y:0, scale:1}} transition={{duration:.8, delay:.15, ease:[.22,1,.36,1]}} className="relative mx-auto w-full max-w-[540px]">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-teal-400/20 blur-2xl" />
              <div className="inspire-hero-showcase relative overflow-hidden rounded-[2rem] border border-white/15 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"><Sparkles className="h-5 w-5" /></div>
                    <div>
                      <p className="text-xs font-black tracking-[.2em] text-white">INSPIRE</p>
                      <p className="mt-0.5 text-[10px] text-slate-300">LEARN · CREATE · INNOVATE</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-[10px] font-bold text-teal-200">CREATIVE LAB</span>
                </div>

                <div className="py-8">
                  <p className="text-[10px] font-bold uppercase tracking-[.28em] text-teal-200">Your next chapter starts here</p>
                  <h3 className="mt-3 max-w-sm text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">Turn your ideas into <span className="text-teal-300">real-world skills.</span></h3>
                  <p className="mt-3 max-w-sm text-xs leading-6 text-slate-300 sm:text-sm">Explore technology, build meaningful projects and grow with a team that inspires progress.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/20 text-indigo-200"><Layers className="h-4 w-4" /></div>
                    <p className="text-xl font-black text-white"><AnimatedCounter end={publishedProjects.length} duration={1.4} /></p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-300">Featured projects</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/20 text-teal-200"><ShieldCheck className="h-4 w-4" /></div>
                    <p className="text-xl font-black text-white"><AnimatedCounter end={publishedMembers.length} duration={1.4} /></p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-300">Creative minds</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/20 to-teal-400/15 p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-200">The INSPIRE approach</p>
                    <p className="mt-1 text-sm font-bold text-white">Learn by building.</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900"><ArrowRight className="h-4 w-4" /></div>
                </div>
                <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full border border-teal-200/20" />
                <div className="pointer-events-none absolute -right-4 top-28 h-16 w-16 rounded-full border border-indigo-200/20" />
              </div>
              <motion.div animate={prefersReduced ? undefined : {y:[0,-9,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}} className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-xl sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Built for growth</p>
                <p className="mt-1 text-xs font-extrabold text-[var(--text)]">Creativity meets technology</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Premium animated academy banner */}
      <section aria-label="INSPIRE academy highlights" className="inspire-premium-banner relative isolate overflow-hidden border-y border-white/10 py-5 sm:py-6">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-teal-400/25 blur-3xl" />
        <div className="relative mx-auto mb-3 flex max-w-7xl items-center justify-center gap-2 px-4 text-[10px] font-extrabold uppercase tracking-[0.28em] text-teal-200/90 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ideas into impact</span>
          <span className="h-px w-8 bg-teal-300/50" />
          <span className="text-white/60">The INSPIRE standard</span>
        </div>
        <div className="inspire-marquee overflow-hidden" role="presentation">
          <div className="inspire-marquee-track flex w-max items-center gap-5 whitespace-nowrap px-3 sm:gap-8">
            {['LEARN WITH PURPOSE', 'BUILD REAL PROJECTS', 'DESIGN THE FUTURE', 'GROW TOGETHER', 'LEARN WITH PURPOSE', 'BUILD REAL PROJECTS', 'DESIGN THE FUTURE', 'GROW TOGETHER'].map((item, index) => (
              <React.Fragment key={index}>
                <span className="text-sm font-black tracking-[0.16em] text-white sm:text-base">{item}</span>
                <span className="h-2 w-2 rotate-45 rounded-[2px] bg-teal-300 shadow-[0_0_18px_rgba(94,234,212,0.8)]" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Branded projects banner — site branding only, no member artwork */}
      <section aria-label="Explore INSPIRE projects" className="inspire-section-banner inspire-projects-banner relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-[1.75rem] border border-indigo-400/25 px-6 py-8 sm:px-10 sm:py-10">
        <div aria-hidden="true" className="inspire-banner-orbit inspire-orbit-one" />
        <div aria-hidden="true" className="inspire-banner-orbit inspire-orbit-two" />
        <div className="relative z-10 grid items-center gap-7 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.22em] text-cyan-200"><Sparkles className="h-3.5 w-3.5" /> Selected work · Real outcomes</span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">Ideas engineered into <span className="inspire-banner-gradient">digital experiences.</span></h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">A closer look at the products, platforms and creative solutions shaped by the INSPIRE team.</p>
          </div>
          <Link to="/projects" className="group inline-flex w-fit items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">
            Discover our work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div aria-hidden="true" className="inspire-banner-code hidden sm:block"><span>01</span><span>DESIGN</span><span>BUILD</span><span>LAUNCH</span></div>
      </section>

      {/* Featured Projects Reel with 3D Depth Cards */}
      <MaskReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <WordReveal
              text={t('sec.featuredProjects')}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]"
            />
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

        {portfolioLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Loading featured projects">
            {[1, 2, 3].map((item) => <div key={item} className="h-64 rounded-2xl bg-[var(--surface-2)] animate-pulse" />)}
          </div>
        ) : publishedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedProjects.slice(0, 6).map((project) => (
              <motion.div key={project.id} variants={fadeUp} whileHover={prefersReduced ? undefined : { y: -6 }}>
                <Link to={'/projects/' + project.slug} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-indigo-400/60 hover:shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-100 to-teal-100 dark:from-indigo-950 dark:via-slate-900 dark:to-teal-950">
                    {project.cover_url ? <img src={project.cover_url} alt={project.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Layers className="h-12 w-12 text-indigo-400/70" /></div>}
                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">{project.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{project.title}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-[var(--text-muted)]">{project.short_description}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">{project.technologies.slice(0, 3).map((technology) => <span key={technology} className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">{technology}</span>)}</div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">Explore project <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
            <Layers className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--text)]">New projects are on the way</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Our published work will appear here as soon as it is ready.</p>
          </div>
        )}
      </MaskReveal>

      {/* Services / Pillars Section - Morphing Gradient ServiceCards */}
      {config.services_visible !== false && config.services && config.services.length > 0 && (
        <MaskReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 flex flex-col items-center">
            <WordReveal
              text="Core Academic Disciplines & Services"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] justify-center"
            />
            <p className="text-sm text-[var(--text-muted)]">
              Disciplined instruction and industry standard deliverables across four flagship tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.services.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        </MaskReveal>
      )}

      {/* About Preview Section with Parallax & Mask Reveal */}
      {config.about_preview_visible !== false && (
        <ParallaxSection speed={0.2}>
          <MaskReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inspire-section-banner inspire-about-banner relative isolate overflow-hidden p-8 sm:p-12 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-4 max-w-2xl">
                <span className="text-xs font-bold tracking-wider uppercase">
                  <GradientText>ACADEMY OVERVIEW</GradientText>
                </span>
                <WordReveal
                  text={config.about_preview_heading || 'Governance & Quality First'}
                  className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]"
                />
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {config.about_preview_text ||
                    'Inspire provides an uncompromising environment where students evolve into production-ready software engineers and digital craftsmen.'}
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
                className="inspire-about-stamp w-full md:w-80 h-48 rounded-2xl text-white p-6 flex flex-col justify-between shrink-0 shadow-lg"
              >
                <ShieldCheck className="w-10 h-10 text-white/90" />
                <div>
                  <div className="text-2xl font-black">100% Curated</div>
                  <div className="text-xs text-white/80">Zero unchecked public deliverables</div>
                </div>
              </AnimatedCard>
            </div>
          </MaskReveal>
        </ParallaxSection>
      )}

      {/* Categories & Technical Domains */}
      <MaskReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 flex flex-col items-center">
          <WordReveal
            text={t('sec.categoriesTitle')}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] justify-center"
          />
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
      </MaskReveal>

      {/* Meet Our Team Section */}
      <MaskReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <WordReveal
              text={t('sec.teamTitle')}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]"
            />
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
          {!portfolioLoading && publishedMembers.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-[var(--text-muted)] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
              Our team profiles will appear here soon.
            </p>
          )}
          {publishedMembers.slice(0, 3).map((member) => (
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
                          {member.title}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                      {member.bio}
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
      </MaskReveal>

      {/* Bottom CTA Banner */}
      {config.cta_visible !== false && (
        <MaskReveal className="inspire-section-banner inspire-contact-banner relative isolate max-w-6xl mx-auto overflow-hidden rounded-[1.75rem] border border-indigo-400/25 px-6 py-10 sm:px-10 sm:py-12 text-center space-y-4">
          <WordReveal
            text={config.cta_heading || t('sec.ctaTitle')}
            as="h3"
            className="text-2xl sm:text-3xl font-bold text-[var(--text)] justify-center"
          />
          <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            {config.cta_subheading || t('sec.ctaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to={config.cta_btn_link || '/contact'}>
              <MagneticButton
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow"
              >
                {config.cta_btn_text || t('nav.contact')}
              </MagneticButton>
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
        </MaskReveal>
      )}
    </div>
  );
};
