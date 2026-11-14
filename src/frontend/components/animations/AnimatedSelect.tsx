import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface AnimatedSelectProps {
  id?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  darkSurface?: boolean;
}

export const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  darkSurface = false,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const surfaceCls = darkSurface
    ? 'border-slate-700 bg-slate-950 text-white'
    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]';

  const dropdownCls = darkSurface
    ? 'border-slate-700 bg-slate-900 text-slate-100'
    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]';

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.985 }}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between gap-2 cursor-pointer transition ${surfaceCls}`}
      >
        <span className={selectedLabel ? '' : 'opacity-60'}>
          {selectedLabel || placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-70"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scaleY: 0.85, transformOrigin: 'top' }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.85 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute top-full mt-1.5 w-full rounded-xl border shadow-xl z-40 overflow-hidden max-h-60 overflow-y-auto ${dropdownCls}`}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              return (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.2) }}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-3.5 py-2.5 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/15 text-indigo-500 font-semibold'
                      : 'hover:bg-indigo-500/10'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
