import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { AnimatedCard, RevealSection } from '../../components/ui/MotionPrimitives';
import { EASINGS, useDeviceMotionPrefs } from '../../frontend/lib/animations';
import { ShieldCheck, Award, Users, Target, Compass, Sparkles, GitBranch } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORKFLOW_MILESTONES = [
  {
    step: '01',
    title: 'Private Assignment Dispatch',
    desc: 'Faculty issues scoped engineering or design briefs directly into isolated member workspaces with clear deadlines.',
  },
  {
    step: '02',
    title: 'Iterative Craft & Local Tooling',
    desc: 'Members build solutions and compile documentation using client-side tools before submitting drafts.',
  },
  {
    step: '03',
    title: 'Super Admin Quality Audit',
    desc: 'Every submission undergoes faculty code review, responsiveness checks, and bilingual polish verification.',
  },
  {
    step: '04',
    title: 'Public Showcase Publication',
    desc: 'Only approved deliverables cross the publication gate onto the public directory with verifiable attribution.',
  },
];

export const AboutPage: React.FC = () => {
  const { config } = useApp();
  const { prefersReduced } = useDeviceMotionPrefs();
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced || !timelineRef.current) return;

      gsap.from('.timeline-spine', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.timeline-node', {
        scale: 0.8,
        opacity: 0,
        y: 22,
        stagger: 0.16,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    },
    { scope: timelineRef, dependencies: [prefersReduced] }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <RevealSection className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          {config.about_heading || 'About Inspire Academy'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Pioneering technical education, digital craftsmanship, and faculty-governed engineering.
        </p>
      </RevealSection>

      <RevealSection className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Academic Philosophy</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text)]">Our Vision & Core Mandate</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
            {config.about_full_text ||
              'Inspire Academy operates as an elite digital institute dedicated to turning emerging engineers, designers, and marketers into world-class practitioners. Unlike standard portfolio sites where members self-publish unchecked work, Inspire Team enforces an iron-clad faculty approval workflow: every piece of public portfolio code, design token, or media is supervised, tested, and approved by the Super Admin.'}
          </p>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
          <AnimatedCard className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-indigo-400/50 hover:shadow-lg transition-colors space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Target className="w-5 h-5" />
              <span>Mission Statement</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {config.about_mission ||
                'To cultivate engineering excellence through disciplined project delivery, peer code reviews, and industry standard mentorship.'}
            </p>
          </AnimatedCard>

          <AnimatedCard className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-teal-400/50 hover:shadow-lg transition-colors space-y-2">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <Compass className="w-5 h-5" />
              <span>Vision Statement</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {config.about_vision ||
                'To be the benchmark academy in South Asia producing verifiable top 1% technology talent recognized globally.'}
            </p>
          </AnimatedCard>
        </div>

        {/* Value Cards with Icon Wiggle & Border Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[var(--border)]">
          <AnimatedCard className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 hover:border-indigo-500/40 hover:shadow-md transition-colors space-y-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={EASINGS.springBouncy}
              className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
            >
              <ShieldCheck className="w-5 h-5" />
            </motion.div>
            <h3 className="font-bold text-sm text-[var(--text)]">Zero Unapproved Leaks</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every deliverable is isolated in private storage until explicitly signed off by leadership.
            </p>
          </AnimatedCard>

          <AnimatedCard className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 hover:border-teal-500/40 hover:shadow-md transition-colors space-y-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={EASINGS.springBouncy}
              className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center"
            >
              <Award className="w-5 h-5" />
            </motion.div>
            <h3 className="font-bold text-sm text-[var(--text)]">High Craft Standards</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Assignments include clear acceptance criteria, responsive checks, and bilingual standards.
            </p>
          </AnimatedCard>

          <AnimatedCard className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 hover:border-indigo-500/40 hover:shadow-md transition-colors space-y-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={EASINGS.springBouncy}
              className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
            >
              <Users className="w-5 h-5" />
            </motion.div>
            <h3 className="font-bold text-sm text-[var(--text)]">Accountability & Logs</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Immutable audit logs record every review, assignment transition, and publish event.
            </p>
          </AnimatedCard>
        </div>
      </RevealSection>

      {/* GSAP ScrollTrigger Governance Timeline */}
      <div
        ref={timelineRef}
        className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 space-y-8 shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <GitBranch className="w-4 h-4" />
          <span>Verification Pipeline</span>
        </div>

        <div className="relative ps-8 space-y-6">
          {/* Animated Timeline Line */}
          <div
            aria-hidden="true"
            className="timeline-spine absolute start-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-teal-500 to-emerald-500 rounded-full"
          />

          {WORKFLOW_MILESTONES.map((item) => (
            <div
              key={item.step}
              className="timeline-node relative p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-1.5"
            >
              <span
                aria-hidden="true"
                className="absolute -start-[26px] top-6 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-[var(--surface)]"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  STEP {item.step}
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">{item.title}</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
