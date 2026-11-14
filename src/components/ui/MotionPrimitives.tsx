import React, { useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import toast from 'react-hot-toast';
import RawCountUp from 'react-countup';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import {
  DURATIONS,
  EASINGS,
  fadeUp,
  useDeviceMotionPrefs,
} from '../../frontend/lib/animations';

/* 1. Page Transition Wrapper */
export const PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { prefersReduced } = useDeviceMotionPrefs();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
      transition={{ duration: DURATIONS.normal, ease: EASINGS.decelerate }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* 2. Scroll-Triggered Reveal Section */
export const RevealSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  id?: string;
}> = ({ children, className = '', variants = fadeUp, delay = 0, id }) => {
  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* 3. Universal Animated Button (Hover glow/scale + tap shrink + optional magnetic pull) */
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  magnetic?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  magnetic = false,
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...rest
}) => {
  const { isDesktop, hasFinePointer, prefersReduced } = useDeviceMotionPrefs();
  const btnRef = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 280, damping: 20 });
  const springY = useSpring(my, { stiffness: 280, damping: 20 });

  const enableMagnetic = magnetic && isDesktop && hasFinePointer && !prefersReduced && !disabled;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableMagnetic || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.18;
    const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.18;
    mx.set(offsetX);
    my.set(offsetY);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={btnRef}
      style={enableMagnetic ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={
        disabled || prefersReduced
          ? undefined
          : {
              scale: 1.025,
              transition: { duration: DURATIONS.fast, ease: EASINGS.decelerate },
            }
      }
      whileTap={disabled || prefersReduced ? undefined : { scale: 0.96 }}
      disabled={disabled}
      className={`cursor-pointer disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

/* 4. Universal Animated Card (Smooth float-up hover + border/shadow highlight) */
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  floatDistance?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  floatDistance = -5,
  ...rest
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();

  return (
    <motion.div
      whileHover={
        prefersReduced
          ? undefined
          : {
              y: floatDistance,
              transition: { duration: 0.22, ease: EASINGS.decelerate },
            }
      }
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* 5. GPU-Accelerated Shimmer Skeleton */
export const Skeleton: React.FC<{
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}> = ({ className = '', variant = 'rect' }) => {
  const baseShape =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded-md h-3.5'
      : 'rounded-2xl';

  return (
    <div
      aria-hidden="true"
      className={`inspire-shimmer-bar bg-[var(--surface-2)] border border-[var(--border)]/60 ${baseShape} ${className}`}
    />
  );
};

/* 6. Animated Modal (Blur backdrop + spring scale) */
export const AnimatedModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
  darkSurface?: boolean;
}> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-lg',
  darkSurface = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Modal dialog'}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATIONS.fast }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={EASINGS.spring}
            className={`relative z-10 w-full ${maxWidthClass} rounded-3xl border shadow-2xl p-6 ${
              darkSurface
                ? 'border-slate-800 bg-slate-900 text-slate-100'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
            }`}
          >
            {title && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-current/10">
                <h3 className="text-base font-bold">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-500/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* 7. Animated Dropdown Container */
export const AnimatedDropdown: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: DURATIONS.fast, ease: EASINGS.decelerate }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* 8. Desktop-Only Smooth Cursor Glow (zero React re-renders on pointermove) */
export const CursorGlow: React.FC = () => {
  const { isDesktop, hasFinePointer, prefersReduced } = useDeviceMotionPrefs();
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 28, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 28, mass: 0.4 });

  const enabled = isDesktop && hasFinePointer && !prefersReduced;

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: PointerEvent) => {
      mouseX.set(e.clientX - 180);
      mouseY.set(e.clientY - 180);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed top-0 left-0 w-[360px] h-[360px] rounded-full z-20 opacity-30 dark:opacity-25 blur-3xl bg-gradient-to-tr from-indigo-500/30 via-teal-400/20 to-transparent"
    />
  );
};

/* 9. Custom Animated Toast Notification Helper */
export function showAnimatedToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'success'
) {
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={
          t.visible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 12, scale: 0.94 }
        }
        transition={EASINGS.springBouncy}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl text-xs font-semibold max-w-sm ${
          type === 'success'
            ? 'bg-emerald-950/95 border-emerald-700/70 text-emerald-100'
            : type === 'error'
            ? 'bg-rose-950/95 border-rose-700/70 text-rose-100'
            : 'bg-slate-900/95 border-indigo-700/60 text-slate-100'
        }`}
      >
        {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
        {type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
        <span className="leading-snug flex-1">{message}</span>
        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          aria-label="Dismiss notification"
          className="opacity-60 hover:opacity-100 p-0.5 rounded transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    ),
    { duration: 3200 }
  );
}

/* 10. Safe ESM/CJS Unwrapped Animated Counter (respects reduced motion) */
const ResolvedCountUp = (
  typeof RawCountUp === 'function'
    ? RawCountUp
    : (RawCountUp as unknown as { default?: React.ComponentType<any> })?.default
) as React.ComponentType<{ end: number; duration?: number; separator?: string }> | undefined;

export const AnimatedCounter: React.FC<{
  end: number;
  duration?: number;
}> = ({ end, duration = 1.4 }) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  if (prefersReduced || typeof ResolvedCountUp !== 'function') {
    return <span>{end}</span>;
  }
  return <ResolvedCountUp end={end} duration={duration} />;
};
