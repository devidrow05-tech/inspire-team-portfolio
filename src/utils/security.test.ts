import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkLockoutStatus,
  recordFailedAttempt,
  resetLockout,
  generateCssVariables,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MS,
} from './security';

test('security: starts with 0 failed attempts and not locked', () => {
  const initial = resetLockout();
  const status = checkLockoutStatus(initial);
  assert.equal(status.isLocked, false);
  assert.equal(status.minutesRemaining, 0);
  assert.equal(initial.failedAttempts, 0);
});

test('security: records up to 4 failed attempts without locking out', () => {
  let state = resetLockout();
  for (let i = 1; i <= 4; i++) {
    state = recordFailedAttempt(state, 1000000);
    assert.equal(state.failedAttempts, i);
    assert.equal(state.lockoutUntil, null);
    const status = checkLockoutStatus(state, 1000000);
    assert.equal(status.isLocked, false);
  }
});

test('security: 5th failed attempt triggers exactly 15-minute lockout', () => {
  let state = resetLockout();
  state.failedAttempts = 4;
  const now = 10000000;
  state = recordFailedAttempt(state, now);

  assert.equal(state.failedAttempts, MAX_LOGIN_ATTEMPTS);
  assert.equal(state.lockoutUntil, now + LOCKOUT_DURATION_MS);

  // Check 1 minute into lockout
  const status = checkLockoutStatus(state, now + 60 * 1000);
  assert.equal(status.isLocked, true);
  assert.equal(status.minutesRemaining, 14);
});

test('security: lockout automatically expires after 15 minutes', () => {
  const now = 10000000;
  const lockedState = {
    failedAttempts: 5,
    lockoutUntil: now + LOCKOUT_DURATION_MS,
  };

  const statusAfter16Min = checkLockoutStatus(lockedState, now + LOCKOUT_DURATION_MS + 1000);
  assert.equal(statusAfter16Min.isLocked, false);
  assert.equal(statusAfter16Min.minutesRemaining, 0);
});

test('theming: generates valid CSS custom variables', () => {
  const vars = generateCssVariables({
    primary: '#0284C7',
    secondary: '#0D9488',
    bg: '#0F172A',
    text: '#F8FAFC',
  });

  assert.equal(vars['--primary'], '#0284C7');
  assert.equal(vars['--secondary'], '#0D9488');
  assert.equal(vars['--bg'], '#0F172A');
  assert.equal(vars['--text'], '#F8FAFC');
});
