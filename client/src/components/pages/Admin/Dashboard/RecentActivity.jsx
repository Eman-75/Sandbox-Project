import React from 'react';
import { Circle } from 'lucide-react';

const activities = [
  {
    title: 'New user registration',
    subtitle: 'EcoTech Solutions',
    tag: 'Startup',
    time: '10 minutes ago',
  },
  {
    title: 'Profile verification completed',
    subtitle: 'Investment Group Alpha',
    tag: 'Investor',
    time: '1 hour ago',
  },
  {
    title: 'Deal closed',
    subtitle: 'HealthAI Inc',
    tag: 'Startup',
    time: '2 hours ago',
  },
  {
    title: 'Account suspended',
    subtitle: 'Suspicious Startup',
    tag: 'Startup',
    time: '3 hours ago',
  },
];

function RecentActivity() {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 h-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <Circle className="w-3 h-3 text-amber-400 mt-1" fill="currentColor" />
            <div className="flex-1 border-b border-slate-200/30 dark:border-slate-800/60 pb-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{item.subtitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/40">
                  {item.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
