import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Palette,
  Smartphone,
  Globe,
  Layers,
  Terminal,
  Sparkles,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { useDeviceMotionPrefs } from '../../lib/animations';

const FLOATING_ICONS = [
  Code2,
  Palette,
  Smartphone,
  Globe,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  Rocket,
  ShieldCheck,
];

export const FloatingTechIcons: React.FC = () => {
  const { prefersReduced, isMobile } = useDeviceMotionPrefs();
  if (prefersReduced) return null;

  const items = isMobile ? FLOATING_ICONS.slice(0, 5) : FLOATING_ICONS;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {items.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-indigo-500/20 dark:text-indigo-300/20 select-none"
          style={{
            left: `${8 + ((i * 11) % 84)}%`,
            top: `${10 + ((i * 17) % 78)}%`,
          }}
          animate={{
            y: [0, -24, 0],
            x: [0, Math.sin(i + 1) * 16, 0],
            rotate: [0, i % 2 === 0 ? 18 : -18, 0],
            opacity: [0.18, 0.42, 0.18],
          }}
          transition={{
            duration: 6 + i * 0.65,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
        >
          <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
        </motion.div>
      ))}
    </div>
  );
};
