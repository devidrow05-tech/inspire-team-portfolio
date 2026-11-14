import React from 'react';
import { motion } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface SubmissionSuccessProps {
  onDone: () => void;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  onDone,
  title = 'Project Submitted!',
  subtitle = 'Your deliverable is now queued for Super Admin faculty review.',
  buttonLabel = 'Back to Projects',
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-white p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Expanding concentric rings */}
      {!prefersReduced &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            className="absolute rounded-full border-2 border-indigo-500/30 pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 320 + i * 140, height: 320 + i * 140, opacity: 0 }}
            transition={{
              duration: 1.6,
              delay: i * 0.28,
              repeat: Infinity,
              repeatDelay: 0.9,
            }}
          />
        ))}

      {/* SVG Draw Checkmark */}
      <motion.div
        className="relative z-10 w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20"
        initial={prefersReduced ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.12 }}
      >
        <motion.svg width="42" height="42" viewBox="0 0 40 40" aria-hidden="true">
          <motion.path
            d="M 8 21 L 16 29 L 32 12"
            fill="none"
            stroke="#34d399"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: prefersReduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          />
        </motion.svg>
      </motion.div>

      <motion.h2
        className="relative z-10 mt-6 text-2xl sm:text-3xl font-extrabold text-center"
        initial={prefersReduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="relative z-10 text-slate-300 text-sm text-center max-w-md mt-2"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.72 }}
      >
        {subtitle}
      </motion.p>

      <motion.button
        type="button"
        onClick={onDone}
        className="relative z-10 mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition"
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        {buttonLabel}
      </motion.button>
    </motion.div>
  );
};
