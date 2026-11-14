import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceMotionPrefs } from './animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Silky smooth scroll powered by Lenis + GSAP ScrollTrigger.
 * Automatically disabled on mobile/touch viewports and when prefers-reduced-motion is active.
 */
export const useSmoothScroll = () => {
  const { isMobile, prefersReduced } = useDeviceMotionPrefs();

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReduced || isMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [isMobile, prefersReduced]);
};
