import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.28,
  disabled,
  onClick,
  type = 'button',
  ...rest
}) => {
  const { isDesktop, hasFinePointer, prefersReduced } = useDeviceMotionPrefs();
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 24 });
  const y = useSpring(my, { stiffness: 300, damping: 24 });

  const enabled = isDesktop && hasFinePointer && !prefersReduced && !disabled;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mx.set((e.clientX - centerX) * strength);
    my.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={enabled ? { x, y } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReduced || disabled ? undefined : { scale: 1.03 }}
      whileTap={prefersReduced || disabled ? undefined : { scale: 0.96 }}
      onClick={onClick}
      className={`cursor-pointer disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
