import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from './GradientText';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const { prefersReduced } = useDeviceMotionPrefs();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, prefersReduced ? 120 : 1550);
    return () => window.clearTimeout(timer);
  }, [onComplete, prefersReduced]);

  return (
    <motion.div
      aria-label="Loading Inspire Academy experience"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: prefersReduced ? 0.1 : 0.45, ease: 'easeInOut' }}
    >
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.215, 0.61, 0.355, 1] }}
        className="mb-7 text-center"
      >
        <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          <GradientText>INSPIRE</GradientText>
        </div>
        <p className="text-slate-400 text-xs mt-1.5 tracking-[0.35em] uppercase font-semibold">
          Academy
        </p>
      </motion.div>

      <div className="w-52 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #6366f1, #14b8a6)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: prefersReduced ? 0.1 : 1.25, ease: 'easeInOut' }}
        />
      </div>

      <motion.span
        className="text-slate-400 text-xs mt-3 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading experience...
      </motion.span>
    </motion.div>
  );
};
