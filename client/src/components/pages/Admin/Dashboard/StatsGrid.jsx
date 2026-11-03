import React from 'react';
import { Users, Activity, ShieldAlert, AlertTriangle, TrendingUp } from 'lucide-react';



const stats = [
  {
    title: 'Total Users',
    value: '490',
    subtitle: '+45 this month',
    accent: 'text-emerald-500',
    icon: Users,
  },
  {
    title: 'Active Deals',
    value: '79',
    subtitle: 'Across platform',
    accent: 'text-amber-400',
    icon: Activity,
  },
  {
    title: 'Pending Verifications',
    value: '12',
    subtitle: 'Requires attention',
    accent: 'text-amber-500',
    icon: ShieldAlert,
  },
  {
    title: 'Reported Issues',
    value: '5',
    subtitle: 'Needs review',
    accent: 'text-rose-500',
    icon: AlertTriangle,
    badge: 5,
  },
];

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 relative">
                <Icon className={`w-5 h-5 text-slate-700 dark:text-slate-300`} />
                {stat.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                    {stat.badge}
                  </span>
                )}
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
              <p className={`text-xs font-semibold mt-2 ${stat.accent}`}>{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;