import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

type CursorType = 'default' | 'hover' | 'click' | 'text';

export const MagneticCursor: React.FC = () => {
  const { isDesktop, hasFinePointer, prefersReduced } = useDeviceMotionPrefs();
  const enabled = isDesktop && hasFinePointer && !prefersReduced;

  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [pos, setPos] = useState({ x: -100, y: -100 });

  const springConfig = { stiffness: 420, damping: 34 };
  const x = useSpring(-100, springConfig);
  const y = useSpring(-100, springConfig);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('inspire-custom-cursor');
      return;
    }

    document.body.classList.add('inspire-custom-cursor');

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setCursorType('hover');
      } else if (target.closest('h1, h2, h3, p')) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const handleDown = () => setCursorType('click');
    const handleUp = () => setCursorType('default');
    const handleLeaveWindow = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeaveWindow);

    return () => {
      document.body.classList.remove('inspire-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeaveWindow);
    };
  }, [enabled, x, y, visible]);

  if (!enabled || !visible) return null;

  const cursorVariants: Record<CursorType, { width: number; height: number; borderRadius: number; background: string; border: string }> = {
    default: {
      width: 18,
      height: 18,
      borderRadius: 999,
      background: 'rgba(99, 102, 241, 0.25)',
      border: '1.5px solid rgba(99, 102, 241, 0.75)',
    },
    hover: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: 'rgba(99, 102, 241, 0.14)',
      border: '2px solid #6366f1',
    },
    text: {
      width: 4,
      height: 28,
      borderRadius: 4,
      background: 'rgba(99, 102, 241, 0.85)',
      border: '0px solid transparent',
    },
    click: {
      width: 54,
      height: 54,
      borderRadius: 999,
      background: 'rgba(20, 184, 166, 0.16)',
      border: '2px solid #14b8a6',
    },
  };

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={cursorVariants[cursorType]}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      />
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-indigo-500"
        style={{
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
        }}
      />
    </>
  );
};
