// components/dashboard/SalesChart.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SalesChart = () => {
  const investmentData = [
    { category: 'Tech', value: 45, color: 'bg-blue-500' },
    { category: 'Healthcare', value: 25, color: 'bg-green-500' },
    { category: 'Finance', value: 15, color: 'bg-purple-500' },
    { category: 'E-commerce', value: 10, color: 'bg-yellow-500' },
    { category: 'Other', value: 5, color: 'bg-gray-500' },
  ];

  const totalValue = investmentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Investment by Category</h3>
          <p className="text-sm text-gray-500">Investment Distribution</p>
        </div>
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="font-medium">+15% growth</span>
        </div>
      </div>

      {/* Pie Chart Visualization */}
      <div className="relative w-48 h-48 mx-auto my-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">${totalValue}K</div>
            <div className="text-sm text-gray-500">Total Investment</div>
          </div>
        </div>
        
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {investmentData.reduce((prev, item, index) => {
            const percentage = (item.value / totalValue) * 100;
            const circumference = 2 * Math.PI * 40;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const offset = prev.offset - (percentage / 100) * circumference;
            
            return {
              offset: offset,
              elements: [
                ...prev.elements,
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={getComputedStyle(document.documentElement).getPropertyValue(`--color-${item.color.split('-')[1]}`) || '#3b82f6'}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={prev.offset}
                  className="transition-all duration-500"
                />
              ]
            };
          }, { offset: 0, elements: [] }).elements}
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {investmentData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-800 mr-2">${item.value}K</span>
              <span className="text-xs text-gray-500">
                {((item.value / totalValue) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Top Category</div>
            <div className="font-bold text-gray-800">Tech</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Growth</div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">+18%</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Investments</div>
            <div className="font-bold text-gray-800">32 deals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;