import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PremiumInputProps {
  id?: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
  dir?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  darkSurface?: boolean;
  className?: string;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required,
  maxLength,
  dir,
  placeholder,
  multiline = false,
  rows = 4,
  darkSurface = false,
  className = '',
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isDate = type === 'date';
  const floated = focused || hasValue || isDate || Boolean(placeholder);

  const containerCls = darkSurface
    ? 'border-slate-700 bg-slate-950 text-white'
    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]';

  return (
    <div className={`relative group ${className}`}>
      <motion.label
        htmlFor={id}
        className="pointer-events-none absolute start-3.5 font-semibold z-10"
        initial={false}
        animate={{
          top: floated ? 6 : 13,
          fontSize: floated ? '10px' : '12px',
          color: focused ? '#6366f1' : darkSurface ? '#94a3b8' : 'var(--text-muted)',
        }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          required={required}
          maxLength={maxLength}
          dir={dir}
          value={value}
          onChange={onChange}
          placeholder={focused ? placeholder : ''}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3.5 pt-6 pb-2.5 text-xs rounded-xl border outline-none resize-none transition-colors ${containerCls}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          maxLength={maxLength}
          dir={dir}
          value={value}
          onChange={onChange}
          placeholder={focused ? placeholder : ''}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3.5 pt-5 pb-2 text-xs rounded-xl border outline-none transition-colors ${containerCls}`}
        />
      )}

      {/* Animated focus underline */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-0.5 bg-indigo-500 rounded-b-xl pointer-events-none"
        initial={false}
        animate={{
          width: focused ? '96%' : '0%',
          x: '-50%',
          opacity: focused ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
      />

      {/* Corner sparkle */}
      {focused && (
        <motion.span
          aria-hidden="true"
          className="absolute top-2 end-3 text-indigo-400 text-[10px] pointer-events-none"
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
        >
          ✦
        </motion.span>
      )}
    </div>
  );
};
