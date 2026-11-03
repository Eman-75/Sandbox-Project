import React from 'react';
import { Clock, Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const proposals = [
  {
    id: 'PR-001',
    investor: 'Venture Capital Partners',
    amount: '$250K',
    status: 'pending',
    sent: '2 days ago',
    views: 3,
  },
  {
    id: 'PR-002',
    investor: 'Sarah Thompson',
    amount: '$150K',
    status: 'viewed',
    sent: '1 week ago',
    views: 5,
  },
  {
    id: 'PR-003',
    investor: 'TechGrowth Fund',
    amount: '$400K',
    status: 'under review',
    sent: '3 days ago',
    views: 8,
  },
];

const statusConfig = {
  pending: {
    label: 'pending',
    color: 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900',
    icon: Clock,
  },
  viewed: {
    label: 'viewed',
    color: 'bg-blue-500 text-white',
    icon: Eye,
  },
  'under review': {
    label: 'under review',
    color: 'bg-emerald-500 text-white',
    icon: CheckCircle,
  },
};

function RecentProposals() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Recent Proposals
        </h3>
        <button
          onClick={() => navigate('/startup/proposals')}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
        >
          View All
        </button>
      </div>
      <div className="p-6 space-y-4">
        {proposals.map((proposal) => {
          const status = statusConfig[proposal.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={proposal.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {proposal.investor}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent mb-2">
                    {proposal.amount}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>{proposal.sent}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {proposal.views} views
                  </span>
                </div>
                <button
                  onClick={() => navigate('/startup/proposals')}
                  className="px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentProposals;
