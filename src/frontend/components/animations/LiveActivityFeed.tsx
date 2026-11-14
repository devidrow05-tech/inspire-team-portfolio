import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceMotionPrefs } from '../../lib/animations';

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
  colorClass?: string;
}

interface LiveActivityFeedProps {
  activities: ActivityItem[];
  emptyText?: string;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  activities,
  emptyText = 'No recent activity recorded.',
}) => {
  const { prefersReduced } = useDeviceMotionPrefs();

  if (activities.length === 0) {
    return <p className="text-xs text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="space-y-2.5">
      <AnimatePresence initial={false}>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            layout
            initial={prefersReduced ? false : { opacity: 0, x: -24, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 24, height: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800"
          >
            <motion.div
              aria-hidden="true"
              className={`w-2.5 h-2.5 mt-1 rounded-full shrink-0 ${
                activity.colorClass || 'bg-emerald-400'
              }`}
              animate={
                prefersReduced
                  ? undefined
                  : { scale: [1, 1.4, 1], opacity: [1, 0.55, 1] }
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-100 leading-snug">
                {activity.message}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
