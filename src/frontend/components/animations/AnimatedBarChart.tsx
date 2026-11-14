import React from 'react';
import { motion } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

export interface BarChartDatum {
  label: string;
  value: number;
}

interface AnimatedBarChartProps {
  data: BarChartDatum[];
  label: string;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, label }) => {
  const { prefersReduced } = useDeviceMotionPrefs();
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-sm text-white">{label}</h4>
        <span className="text-[11px] font-mono text-indigo-400">Live Velocity</span>
      </div>
      <div className="flex items-end gap-3 h-36">
        {data.map((item, i) => {
          const pct = Math.max(8, Math.round((item.value / max) * 100));
          return (
            <div key={item.label} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <span className="text-[10px] font-mono text-slate-400">{item.value}</span>
              <div className="w-full h-24 flex items-end">
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-teal-400 relative overflow-hidden"
                  initial={prefersReduced ? { height: `${pct}%` } : { height: '0%' }}
                  whileInView={{ height: `${pct}%` }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.75,
                    delay: prefersReduced ? 0 : i * 0.08,
                    ease: 'easeOut',
                  }}
                >
                  {!prefersReduced && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.08 + 0.7,
                        repeat: Infinity,
                        repeatDelay: 3.5,
                      }}
                    />
                  )}
                </motion.div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
