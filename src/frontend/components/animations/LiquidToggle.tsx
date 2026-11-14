import React from 'react';
import { motion } from 'framer-motion';

interface LiquidToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  id?: string;
  darkSurface?: boolean;
}

export const LiquidToggle: React.FC<LiquidToggleProps> = ({
  checked,
  onChange,
  label,
  id,
  darkSurface = false,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 cursor-pointer group select-none text-left"
    >
      <motion.span
        className="relative w-12 h-6 rounded-full inline-block shrink-0"
        initial={false}
        animate={{
          backgroundColor: checked
            ? '#6366f1'
            : darkSurface
            ? '#334155'
            : '#cbd5e1',
        }}
        transition={{ duration: 0.25 }}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md block"
          initial={false}
          animate={{
            x: checked ? 24 : 0,
            scale: checked ? 0.92 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
        {checked && (
          <motion.span
            aria-hidden="true"
            key="ripple"
            className="absolute inset-0 rounded-full bg-indigo-400/40 pointer-events-none"
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </motion.span>
      {label && (
        <span
          className={`text-xs font-medium ${
            darkSurface ? 'text-slate-200' : 'text-[var(--text)]'
          }`}
        >
          {label}
        </span>
      )}
    </button>
  );
};
