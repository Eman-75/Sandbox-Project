// import React from 'react';
// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
// import { allocation, holdings } from '../../../../mocks/portfolio';

// function Portfolio() {
//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">Track your investment portfolio and performance</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
//           <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Holdings</h3>
//               <p className="text-sm text-slate-500 dark:text-slate-400">Your investment holdings</p>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">Company</th>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">Sector</th>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">Invested</th>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">Current Value</th>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">MOIC</th>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">IRR</th>
//                   <th className="text-left p-4 text-sm font-semibold text-slate-600">Ownership</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {holdings.map((row) => (
//                   <tr
//                     key={row.name}
//                     className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
//                   >
//                     <td className="p-4 text-sm font-semibold text-slate-900 dark:text-white">{row.name}</td>
//                     <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.sector}</td>
//                     <td className="p-4 text-sm text-slate-900 dark:text-white">{row.invested}</td>
//                     <td className="p-4 text-sm text-slate-900 dark:text-white">{row.currentValue}</td>
//                     <td className="p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
//                       {row.moic}
//                     </td>
//                     <td className="p-4 text-sm text-slate-900 dark:text-white">{row.irr}</td>
//                     <td className="p-4 text-sm text-slate-900 dark:text-white">{row.ownership}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
//           <div className="mb-4">
//             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Allocation</h3>
//             <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio allocation by sector</p>
//           </div>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={allocation} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={3}>
//                   {allocation.map((item) => (
//                     <Cell key={item.name} fill={item.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                     border: 'none',
//                     borderRadius: '12px',
//                     boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="space-y-2">
//             {allocation.map((item) => (
//               <div className="flex items-center justify-between text-sm" key={item.name}>
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
//                   <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
//                 </div>
//                 <span className="font-semibold text-slate-900 dark:text-white">{item.value}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Portfolio;






























import React, { useState, useEffect, useContext } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AuthContext } from '../../../../../context/AuthContext'; // Assuming path
import { toast } from 'react-hot-toast';

function Portfolio() {
  const { axios } = useContext(AuthContext);
  const [holdings, setHoldings] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get('/api/stripe/sent-investments');
        const investments = data.investments;
        setHoldings(investments);

        // --- SYNC LOGIC: Generate Allocation from Table Data ---
        const sectorMap = {};
        let totalInvested = 0;

        investments.forEach((inv) => {
          const sector = inv.startup?.industry || 'N/A';
          const amount = inv.amount || 0;

          totalInvested += amount;
          sectorMap[sector] = (sectorMap[sector] || 0) + amount;
        });

        // Define standard colors (or generate random ones)
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        const calculatedAllocation = Object.keys(sectorMap).map((sector, index) => ({
          name: sector,
          value: totalInvested > 0 ? Math.round((sectorMap[sector] / totalInvested) * 100) : 0,
          color: colors[index % colors.length]
        }));

        setAllocation(calculatedAllocation);
        // -------------------------------------------------------

      } catch (error) {
        toast.error("Failed to load portfolio data");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [axios]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track your investment portfolio and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table Section */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Holdings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your investment holdings</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Company</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Sector</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Invested</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {holdings.length > 0 ? holdings.map((inv) => (
                  <tr key={inv._id} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {inv.startup?.name || 'Unknown Startup'}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {inv.startup?.industry || 'N/A'}
                    </td>
                    <td className="p-4 text-sm text-slate-900 dark:text-white">
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500">No investments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Pie Chart Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Allocation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio allocation by sector</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {allocation.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {allocation.map((item) => (
              <div className="flex items-center justify-between text-sm" key={item.name}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;