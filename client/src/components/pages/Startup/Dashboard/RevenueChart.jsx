// components/dashboard/RevenueChart.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const RevenueChart = () => {
  const revenueData = [
    { month: 'Q1', revenue: 120, target: 100 },
    { month: 'Q2', revenue: 180, target: 150 },
    { month: 'Q3', revenue: 220, target: 200 },
    { month: 'Q4', revenue: 280, target: 250 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => Math.max(d.revenue, d.target)));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Revenue Progress</h3>
          <p className="text-sm text-gray-500">Quarterly revenue vs targets</p>
        </div>
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="font-medium">+24% above target</span>
        </div>
      </div>

      <div className="space-y-4">
        {revenueData.map((data, index) => {
          const revenuePercent = (data.revenue / maxRevenue) * 100;
          const targetPercent = (data.target / maxRevenue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                <span className="text-sm font-bold text-gray-800">${data.revenue}K</span>
              </div>
              
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                {/* Target Line */}
                <div 
                  className="absolute h-full border-r-2 border-red-500"
                  style={{ left: `${targetPercent}%` }}
                ></div>
                
                {/* Revenue Progress */}
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{ width: `${revenuePercent}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target: ${data.target}K</span>
                <span className="text-green-600 font-medium">+${data.revenue - data.target}K</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">$800K</div>
          <div className="text-sm text-gray-500">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">+24%</div>
          <div className="text-sm text-gray-500">Above Target</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">$200K</div>
          <div className="text-sm text-gray-500">This Quarter</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;