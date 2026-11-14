import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumTooltipProps {
  children: React.ReactNode;
  tip: string;
}

export const PremiumTooltip: React.FC<PremiumTooltipProps> = ({ children, tip }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            role="tooltip"
            className="hidden sm:block absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-lg border border-slate-700"
            initial={{ opacity: 0, y: -4, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.88 }}
            transition={{ duration: 0.14 }}
          >
            {tip}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-l border-t border-slate-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
