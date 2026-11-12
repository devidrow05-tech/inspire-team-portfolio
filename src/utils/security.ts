/**
 * Pure security & theming logic helper for Inspire Academy
 */

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface LockoutState {
  failedAttempts: number;
  lockoutUntil: number | null;
}

export function checkLockoutStatus(
  state: LockoutState,
  nowMs: number = Date.now()
): { isLocked: boolean; minutesRemaining: number } {
  if (!state.lockoutUntil) {
    return { isLocked: false, minutesRemaining: 0 };
  }

  if (nowMs < state.lockoutUntil) {
    const msRemaining = state.lockoutUntil - nowMs;
    const minutesRemaining = Math.max(1, Math.ceil(msRemaining / (60 * 1000)));
    return { isLocked: true, minutesRemaining };
  }

  // Lockout has elapsed
  return { isLocked: false, minutesRemaining: 0 };
}

export function recordFailedAttempt(
  currentState: LockoutState,
  nowMs: number = Date.now()
): LockoutState {
  const newAttempts = currentState.failedAttempts + 1;
  if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
    return {
      failedAttempts: newAttempts,
      lockoutUntil: nowMs + LOCKOUT_DURATION_MS,
    };
  }
  return {
    failedAttempts: newAttempts,
    lockoutUntil: null,
  };
}

export function resetLockout(): LockoutState {
  return {
    failedAttempts: 0,
    lockoutUntil: null,
  };
}

export function generateCssVariables(colors: {
  primary: string;
  secondary: string;
  bg: string;
  text: string;
}): Record<string, string> {
  return {
    '--primary': colors.primary || '#4338CA',
    '--secondary': colors.secondary || '#0F766E',
    '--bg': colors.bg || '#F8FAFC',
    '--text': colors.text || '#0F172A',
  };
}
