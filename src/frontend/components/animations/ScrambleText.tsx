import React, { useEffect, useRef, useState } from 'react';
import { useDeviceMotionPrefs } from '../../lib/animations';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

interface ScrambleTextProps {
  text: string;
  trigger?: boolean;
  className?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  trigger = true,
  className = '',
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger || prefersReduced || !text) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = window.setInterval(() => {
      const next = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayText(next);
      if (iteration >= text.length) {
        window.clearInterval(interval);
        setDisplayText(text);
      }
      iteration += 0.5;
    }, 28);

    return () => {
      window.clearInterval(interval);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, trigger, prefersReduced]);

  return (
    <span className={className} aria-label={text}>
      {displayText}
    </span>
  );
};
