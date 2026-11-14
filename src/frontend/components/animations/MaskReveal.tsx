import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface MaskRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

const CLIP_MAP = {
  up: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  left: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  right: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
} as const;

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  direction = 'up',
  className = '',
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  const triggerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(triggerRef, { once: true, amount: 'some' });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const [fromClip, toClip] = CLIP_MAP[direction];

  return (
    <div ref={triggerRef} className={className}>
      <motion.div
        initial={{ clipPath: fromClip, opacity: 0.4, y: 12 }}
        animate={
          isInView
            ? { clipPath: toClip, opacity: 1, y: 0 }
            : { clipPath: fromClip, opacity: 0.4, y: 12 }
        }
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};
