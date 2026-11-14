import { useEffect, useState } from 'react';
import type { Variants, Transition } from 'framer-motion';

// Global animation constants for Inspire Academy
export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0,
  epic: 1.5,
} as const;

export const EASINGS = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  sharp: [0.4, 0, 0.6, 1] as const,
  decelerate: [0.0, 0.0, 0.2, 1] as const,
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 14 },
} as const;

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slow, ease: EASINGS.decelerate },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASINGS.decelerate },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.decelerate },
  },
};

export const dominoCard: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: 8 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: EASINGS.decelerate },
  },
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 18px rgba(79, 70, 229, 0.22)',
      '0 0 34px rgba(79, 70, 229, 0.45)',
      '0 0 18px rgba(79, 70, 229, 0.22)',
    ],
    transition: { duration: 2.4, repeat: Infinity },
  },
};

// Pure testable motion & device helpers
export function clampParticleCount(viewportWidth: number, prefersReduced: boolean): number {
  if (prefersReduced || viewportWidth <= 0) return 0;
  if (viewportWidth < 640) return 24;
  if (viewportWidth < 1024) return 44;
  return 72;
}

export function shouldEnable3DScene(viewportWidth: number, prefersReduced: boolean): boolean {
  if (prefersReduced) return false;
  return viewportWidth >= 640;
}

export function getStepProgressPercent(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 1) return 100;
  const clamped = Math.max(1, Math.min(currentStep, totalSteps));
  return Math.round(((clamped - 1) / (totalSteps - 1)) * 100);
}

export function getReducedMotionTransition(prefersReduced: boolean): Transition {
  if (prefersReduced) {
    return { duration: 0.01 };
  }
  return { duration: DURATIONS.normal, ease: EASINGS.decelerate };
}

export interface DeviceMotionPrefs {
  prefersReduced: boolean;
  viewportWidth: number;
  isMobile: boolean;
  isDesktop: boolean;
  hasFinePointer: boolean;
}

export function useDeviceMotionPrefs(): DeviceMotionPrefs {
  const [prefs, setPrefs] = useState<DeviceMotionPrefs>(() => {
    if (typeof window === 'undefined') {
      return {
        prefersReduced: false,
        viewportWidth: 1440,
        isMobile: false,
        isDesktop: true,
        hasFinePointer: true,
      };
    }
    const width = window.innerWidth;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const fine = window.matchMedia?.('(pointer: fine)').matches ?? true;
    return {
      prefersReduced: reduced,
      viewportWidth: width,
      isMobile: width < 640,
      isDesktop: width >= 1024,
      hasFinePointer: fine,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqFine = window.matchMedia('(pointer: fine)');

    const update = () => {
      const width = window.innerWidth;
      setPrefs({
        prefersReduced: mqReduced.matches,
        viewportWidth: width,
        isMobile: width < 640,
        isDesktop: width >= 1024,
        hasFinePointer: mqFine.matches,
      });
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    mqReduced.addEventListener?.('change', update);
    mqFine.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('resize', update);
      mqReduced.removeEventListener?.('change', update);
      mqFine.removeEventListener?.('change', update);
    };
  }, []);

  return prefs;
}
