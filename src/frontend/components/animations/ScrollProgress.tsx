import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[9998] origin-left pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #6366f1, #0ea5e9, #10b981)',
      }}
    />
  );
};
