import React from 'react';
import { motion } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface SplitHeadingProps {
  text: string;
  className?: string;
}

export const SplitHeading: React.FC<SplitHeadingProps> = ({
  text,
  className = '',
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  const words = text.split(' ').filter(Boolean);

  if (prefersReduced) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <motion.h1
      aria-label={text}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some' }}
      variants={{ visible: { transition: { staggerChildren: 0.022 } } }}
    >
      {words.map((word, wordIdx) => (
        <React.Fragment key={`${wordIdx}-${word}`}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.split('').map((char, charIdx) => (
              <motion.span
                key={`${wordIdx}-${charIdx}-${char}`}
                style={{ display: 'inline-block' }}
                variants={{
                  hidden: { opacity: 0, y: 24, rotate: -5, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    transition: { type: 'spring', stiffness: 260, damping: 18 },
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          {wordIdx < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </motion.h1>
  );
};
