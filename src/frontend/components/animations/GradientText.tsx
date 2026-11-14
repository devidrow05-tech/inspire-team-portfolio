import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
}) => (
  <span
    className={`bg-gradient-to-r from-indigo-600 via-violet-500 to-teal-400 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 bg-[length:200%_auto] animate-gradient-flow bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);
