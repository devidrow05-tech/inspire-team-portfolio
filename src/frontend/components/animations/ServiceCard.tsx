import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
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
  Sparkles,
} from 'lucide-react';
import { useDeviceMotionPrefs } from '../../lib/animations';

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
  Sparkles,
};

const GRADIENT_PAIRS = [
  ['#6366f1', '#0ea5e9'],
  ['#0ea5e9', '#14b8a6'],
  ['#14b8a6', '#10b981'],
  ['#8b5cf6', '#ec4899'],
  ['#4f46e5', '#14b8a6'],
] as const;

interface ServiceCardProps {
  service: {
    id: string;
    icon: string;
    title: string;
    description: string;
  };
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  const IconComp = ICON_MAP[service.icon] || Code2;
  const [c1, c2] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl p-6 border border-[var(--border)] bg-[var(--surface)] hover:border-indigo-400/50 hover:shadow-xl transition-colors flex flex-col justify-between h-full group"
      initial={prefersReduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: Math.min(index * 0.08, 0.35), duration: 0.45 }}
      whileHover={prefersReduced ? undefined : 'hovered'}
    >
      {/* Morphing gradient blob on hover */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 w-44 h-44 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${c1}, ${c2})`,
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        variants={{ hovered: { opacity: 0.22, scale: 1.45 } }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10 space-y-3">
        <motion.div
          className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
          variants={{ hovered: { scale: 1.12, y: -3, rotate: 6 } }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          <IconComp className="w-6 h-6" />
        </motion.div>
        <h3 className="font-bold text-base text-[var(--text)]">{service.title}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Hover reveal arrow */}
      <motion.div
        aria-hidden="true"
        className="relative z-10 mt-4 pt-3 border-t border-[var(--border)]/60 flex items-center justify-end text-indigo-600 dark:text-indigo-400"
        initial={{ opacity: 0, x: -8 }}
        variants={{ hovered: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
      </motion.div>
    </motion.div>
  );
};
