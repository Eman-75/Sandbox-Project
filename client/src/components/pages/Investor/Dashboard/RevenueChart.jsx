// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

// function RevenueChart() {
//     const data = [
//         { month: 'Jan', revenue: 0, expenses: 0 },
//         { month: 'Feb', revenue: 0, expenses: 0 },
//         { month: 'Mar', revenue: 0, expenses: 0 },
//         { month: 'Apr', revenue: 0, expenses: 0 },
//         { month: 'May', revenue: 0, expenses: 0 },
//         { month: 'Jun', revenue: 0, expenses: 0 },
//         { month: 'Jul', revenue: 0, expenses: 0 },
//         { month: 'Aug', revenue: 0, expenses: 0 },
//         { month: 'Sep', revenue: 0, expenses: 0 },
//         { month: 'Oct', revenue: 0, expenses: 0 },
//         { month: 'Nov', revenue: 0, expenses: 0 },
//         { month: 'Dec', revenue: 0, expenses: 0 },

//     ];
//     return <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border border-slate-200/50 dark:border-slate-700/50 p-6'>
//         <div className='flex items-center justify-between mb-6'>
//             <div>
//                 <h3 className='text-xl font-bold text-slate-800 dark:text-white'>
//                     Portfolio Performance
//                 </h3>
//                 <p className='text-sm text-slate-500 dark:text-slate-400'>Monthly revenue and investment</p>
//             </div>
//             <div className='flex gap-5'>
//                 <div className='flex items-center space-x-4'>
//                 <div className='flex items-center space-x-2'>
//                     <div className='w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'></div>
//                     <div className='text-sm text-slate-600 dark:text-slate-400'>
//                         <span>Revenue</span>

//                     </div>
//                 </div>
//             </div>
//             <div className='flex items-center space-x-4'>
//                 <div className='flex items-center space-x-2'>
//                     <div className='w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full'></div>
//                     <div className='text-sm text-slate-600 dark:text-slate-400'>
//                         <span>Investment</span>

//                     </div>
//                 </div>
//             </div>
//             </div>        
//         </div>

//         <div className='h-80'>
//             <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
//                     <XAxis dataKey="month" stroke='#64748b' fontSize={12} tickLine={false} axisLine={false}/>
//                     <YAxis stroke='#64748b' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
//                     <Tooltip contentStyle={{
//                         backgroundColor: "rgba(255, 255, 255, 0.95)",
//                         border: "none",
//                         borderRadius: "12px",
//                         boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
//                     }}
//                     formatter={(value) => [`$${value.toLocaleString()}`, " "]}
//                     />
//                     <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
//                     <Bar dataKey="expenses" fill="url(#expensesGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
//                     <defs>
//                         <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="#3b82f6" />
//                             <stop offset="100%" stopColor="#8b5cf6" />
//                         </linearGradient>
//                         <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="#94a3b8" />
//                             <stop offset="100%" stopColor="#64748b" />
//                         </linearGradient>
//                     </defs>
//                 </BarChart>
//             </ResponsiveContainer>

//         </div>
//     </div>;
// }

// export default RevenueChart;








import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import axios from '../../../../api/axios';

function RevenueChart() {
    const [data, setData] = useState([
        { month: 'Jan', count: 0 },
        { month: 'Feb', count: 0 },
        { month: 'Mar', count: 0 },
        { month: 'Apr', count: 0 },
        { month: 'May', count: 0 },
        { month: 'Jun', count: 0 },
        { month: 'Jul', count: 0 },
        { month: 'Aug', count: 0 },
        { month: 'Sep', count: 0 },
        { month: 'Oct', count: 0 },
        { month: 'Nov', count: 0 },
        { month: 'Dec', count: 0 },
    ]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get('/dashboard/investor/dashboard');
                setData(response.data.monthlyInvestmentCounts || []);
            } catch (error) {
                console.error('Error fetching investor chart data:', error);
            }
        };

        fetchChartData();
    }, []);

    return <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border border-slate-200/50 dark:border-slate-700/50 p-6'>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h3 className='text-xl font-bold text-slate-800 dark:text-white'>
                    Investment Activity
                </h3>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Number of investments made in each month</p>
            </div>
            <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'></div>
                <div className='text-sm text-slate-600 dark:text-slate-400'>
                    <span>Investments</span>
                </div>
            </div>
        </div>

        <div className='h-80'>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis dataKey="month" stroke='#64748b' fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis allowDecimals={false} stroke='#64748b' fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                    }}
                    formatter={(value) => [`${value}`, "Investments"]}
                    />
                    <Bar dataKey="count" fill="url(#investmentGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <defs>
                        <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>

        </div>
    </div>;
}

export default RevenueChart;
