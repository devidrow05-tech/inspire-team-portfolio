import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DURATIONS,
  EASINGS,
  clampParticleCount,
  shouldEnable3DScene,
  getStepProgressPercent,
  getReducedMotionTransition,
} from './animations';

test('animation constants define expected timing scale', () => {
  assert.ok(DURATIONS.instant < DURATIONS.fast);
  assert.ok(DURATIONS.fast < DURATIONS.normal);
  assert.ok(DURATIONS.normal < DURATIONS.slow);
  assert.ok(DURATIONS.slow < DURATIONS.verySlow);
  assert.equal(EASINGS.spring.type, 'spring');
});

test('clampParticleCount respects reduced motion and mobile caps', () => {
  assert.equal(clampParticleCount(1440, true), 0);
  assert.equal(clampParticleCount(0, false), 0);
  assert.ok(clampParticleCount(390, false) <= 30);
  assert.ok(clampParticleCount(390, false) > 0);
  assert.ok(clampParticleCount(1440, false) <= 80);
});

test('shouldEnable3DScene disables WebGL on mobile and reduced motion', () => {
  assert.equal(shouldEnable3DScene(390, false), false);
  assert.equal(shouldEnable3DScene(1440, true), false);
  assert.equal(shouldEnable3DScene(1440, false), true);
  assert.equal(shouldEnable3DScene(640, false), true);
});

test('getStepProgressPercent computes bounded wizard progress', () => {
  assert.equal(getStepProgressPercent(1, 3), 0);
  assert.equal(getStepProgressPercent(2, 3), 50);
  assert.equal(getStepProgressPercent(3, 3), 100);
  assert.equal(getStepProgressPercent(99, 3), 100);
  assert.equal(getStepProgressPercent(0, 3), 0);
  assert.equal(getStepProgressPercent(1, 1), 100);
});

test('getReducedMotionTransition short-circuits duration when reduced', () => {
  assert.deepEqual(getReducedMotionTransition(true), { duration: 0.01 });
  assert.equal((getReducedMotionTransition(false) as { duration: number }).duration, DURATIONS.normal);
});
