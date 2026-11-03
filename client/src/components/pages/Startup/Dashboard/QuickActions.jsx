import React from 'react';
import { Users, BookOpen, Upload, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    id: 'investors',
    icon: Users,
    title: 'Find Investors',
    description: 'Browse matched investors',
    path: '/startup/investors',
  },
  {
    id: 'learning',
    icon: BookOpen,
    title: 'Learning Hub',
    description: 'Access resources & AI assistant',
    path: '/startup/learninghub',
  },
  {
    id: 'upload',
    icon: Upload,
    title: 'Upload Pitch Deck',
    description: 'Update your materials',
    path: '/startup/profile',
  },
  {
    id: 'schedule',
    icon: Calendar,
    title: 'Schedule Meeting',
    description: 'Connect with investors',
    path: '/startup/messages',
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h3>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="p-6 rounded-xl bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 hover:opacity-90 transition-opacity text-left group"
            >
              <div className="mb-4">
                <Icon className="w-8 h-8 text-slate-900 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{action.title}</h4>
              <p className="text-sm text-slate-800">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
