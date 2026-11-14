import React, { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { clampParticleCount, useDeviceMotionPrefs } from '../../frontend/lib/animations';

type ParticlesOptions = React.ComponentProps<typeof Particles>['options'];
type InitCallback = React.ComponentProps<typeof ParticlesProvider>['init'];

// Module-level stable callback required by ParticlesProvider across app lifecycle
const initHeroParticlesEngine: InitCallback = async (engine) => {
  await loadSlim(engine);
};

export const HeroParticles: React.FC = () => {
  const { viewportWidth, prefersReduced, isMobile } = useDeviceMotionPrefs();
  const count = clampParticleCount(viewportWidth, prefersReduced);

  const options: ParticlesOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: 'grab',
          },
          onClick: {
            enable: false,
          },
        },
        modes: {
          grab: {
            distance: 130,
            links: { opacity: 0.38 },
          },
        },
      },
      particles: {
        color: { value: ['#6366f1', '#14b8a6', '#818cf8'] },
        links: {
          color: '#6366f1',
          distance: 135,
          enable: true,
          opacity: 0.16,
          width: 1,
        },
        move: {
          enable: true,
          speed: isMobile ? 0.5 : 0.9,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'bounce' },
        },
        number: {
          value: count,
          density: { enable: false },
        },
        opacity: {
          value: { min: 0.18, max: 0.45 },
        },
        shape: { type: 'circle' },
        size: {
          value: { min: 1.5, max: 3.2 },
        },
      },
    }),
    [count, isMobile]
  );

  if (count === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      <ParticlesProvider init={initHeroParticlesEngine}>
        <Particles
          id="inspire-hero-particles"
          options={options}
          className="w-full h-full"
        />
      </ParticlesProvider>
    </div>
  );
};
