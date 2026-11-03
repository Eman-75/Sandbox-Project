// components/dashboard/TableSection.jsx
import React from 'react';
import { Clock, DollarSign, TrendingUp, MoreVertical } from 'lucide-react';

const TableSection = () => {
  const proposals = [
    {
      id: 1,
      investor: 'Venture Capital Partners',
      amount: '$250K',
      stage: 'Negotiation',
      date: '2 days ago',
      status: 'active',
      trend: 'up'
    },
    {
      id: 2,
      investor: 'Sarah Thompson',
      amount: '$150K',
      stage: 'Review',
      date: '1 week ago',
      status: 'pending',
      trend: 'up'
    },
    {
      id: 3,
      investor: 'TechGrowth Fund',
      amount: '$400K',
      stage: 'Due Diligence',
      date: '3 days ago',
      status: 'active',
      trend: 'up'
    },
    {
      id: 4,
      investor: 'Angel Investors Network',
      amount: '$180K',
      stage: 'Initial Contact',
      date: '4 days ago',
      status: 'pending',
      trend: 'down'
    },
    {
      id: 5,
      investor: 'Capital Ventures',
      amount: '$320K',
      stage: 'Term Sheet',
      date: '5 days ago',
      status: 'active',
      trend: 'up'
    },
    {
      id: 6,
      investor: 'Startup Founders Fund',
      amount: '$275K',
      stage: 'Review',
      date: '1 week ago',
      status: 'pending',
      trend: 'up'
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Recent Proposals</h3>
            <p className="text-sm text-gray-500">Active investment proposals</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{proposal.investor}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-gray-900">{proposal.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{proposal.stage}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {proposal.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(proposal.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTrendIcon(proposal.trend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">6</span> of <span className="font-medium">12</span> proposals
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSection;