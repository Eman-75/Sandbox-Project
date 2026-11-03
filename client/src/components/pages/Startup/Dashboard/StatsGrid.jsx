import React from 'react';
import { TrendingUp, FileText, Users, Eye, MessageSquare } from 'lucide-react';

const StatsGrid = () => {
  const stats = [
    {
      title: 'Active Proposals',
      value: '12',
      change: '+2.1%',
      trend: 'up',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Matched Investors',
      value: '48',
      change: '+5 new',
      trend: 'up',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Profile Views',
      value: '156',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Messages',
      value: '18',
      change: '+3 new',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-orange-500 to-amber-600',
      badge: 5,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r bg-slate-100 dark:bg-slate-800 relative">
                <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                {stat.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {stat.badge}
                  </span>
                )}
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{stat.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-500">{stat.change}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">this month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
