import React from 'react';

interface ImageSlotProps {
  src?: string | null;
  alt?: string;
  className?: string;
  aspect?: '16/10' | '1/1' | '4/3' | '3/2' | '21/9';
  fallbackText?: string;
  badge?: string;
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  src,
  alt = 'Inspire Team visual',
  className = '',
  aspect = '16/10',
  fallbackText = 'Inspire Studio Project',
  badge,
}) => {
  const aspectClass =
    aspect === '16/10'
      ? 'aspect-[16/10]'
      : aspect === '1/1'
      ? 'aspect-square'
      : aspect === '4/3'
      ? 'aspect-[4/3]'
      : aspect === '21/9'
      ? 'aspect-[21/9]'
      : 'aspect-[3/2]';

  if (src && src.trim().length > 0) {
    return (
      <div className={`relative overflow-hidden bg-slate-900 ${aspectClass} ${className}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {badge && (
          <span className="absolute top-3 end-3 bg-indigo-600/90 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-md">
            {badge}
          </span>
        )}
      </div>
    );
  }

  // Polished brand gradient placeholder - strict zero external stock photo rule
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 border border-slate-800/60 ${aspectClass} ${className}`}
    >
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative z-10 flex flex-col items-center gap-2 max-w-[85%]">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300/90 truncate">
          {fallbackText}
        </p>
      </div>

      {badge && (
        <span className="absolute top-3 end-3 bg-indigo-600/90 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm backdrop-blur-md">
          {badge}
        </span>
      )}
    </div>
  );
};
