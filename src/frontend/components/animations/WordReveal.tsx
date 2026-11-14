import React from 'react';
import { motion } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface WordRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  className = '',
  as = 'h2',
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  const words = text.split(' ').filter(Boolean);

  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[as] as typeof motion.h2;

  return (
    <MotionTag
      aria-label={text}
      className={`flex flex-wrap gap-x-[0.3em] overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${i}-${word}`}
          aria-hidden="true"
          variants={{
            hidden: { y: '105%', opacity: 0, rotateX: -35 },
            visible: {
              y: 0,
              opacity: 1,
              rotateX: 0,
              transition: {
                duration: 0.65,
                delay: Math.min(i * 0.06, 0.45),
                ease: [0.215, 0.61, 0.355, 1],
              },
            },
          }}
          style={{ display: 'inline-block', transformOrigin: 'bottom' }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
};
