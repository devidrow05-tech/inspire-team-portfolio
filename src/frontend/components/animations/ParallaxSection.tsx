import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const ParallaxActive: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-36 * speed}px`, `${36 * speed}px`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = '',
}) => {
  const { prefersReduced, isMobile } = useDeviceMotionPrefs();

  if (prefersReduced || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <ParallaxActive speed={speed} className={className}>
      {children}
    </ParallaxActive>
  );
};
