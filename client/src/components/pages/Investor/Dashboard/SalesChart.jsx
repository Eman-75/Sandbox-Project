// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//     { name: 'Tech', value: 0, color: "#3b82f6" },
//     { name: 'Health', value: 0, color: "#8b5cf6" },
//     { name: 'Real Estate', value: 0, color: "#10b981" },
//     { name: 'Other', value: 10, color: "#f59e0b" },
// ]

// function SalesChart() {
//     return (
//         <div className='bg-white dark:bg-slate-900 backdrop-blur-xl rounded-b-2xl p-6 border border-slate-200/50 dark:border-slate-700/50'>
//             <div className='mb-6'>
//                 <h3 className='text-lg- font-bold text-slate-800 dark:text-white'>Investment by Catgeory</h3>
//                 <p className='text-sm text-slate-500 dark:text-slate-400'>Investment Distribution</p>
//             </div>
//             <div className='h-48'>
//                 <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                         <Pie 
//                         data={data} 
//                         dataKey="value" 
//                         nameKey="name" 
//                         cx="50%" 
//                         cy="50%" 
//                         outerRadius={80} 
//                         innerRadius={40} 
//                         paddingAngle={5}
//                         >
//                             {data.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip contextStyle={{
//                             backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                             border: "none",
//                             borderRadius: '12px',
//                             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
//                         }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>

//             <div className='space-y-3'>
//                 {data.map((item, index) => {
//                     return (
//                     <div className='flex items-center justify-between' key={index}>
//                         <div className='flex itme-sec space-x-3'>
//                             <div className='w-3 h-3 rounded-full' style={{backgroundColor: item.color}} ></div>
//                                 <span className='text-sm text-slate-600 dark:text-slate-400'>{item.name}</span>
//                             </div>
//                             <div className='text-sm font-semibold text-slate-800 dark:text-white'>{item.value}%</div>

//                         </div>
                    
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// export default SalesChart;






import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from '../../../../api/axios';

const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#10b981"];

function SalesChart() {
    const [data, setData] = useState([
        { name: 'Completed', value: 0, color: CHART_COLORS[0] },
        { name: 'Pending', value: 0, color: CHART_COLORS[1] },
        { name: 'Failed', value: 0, color: CHART_COLORS[2] },
    ]);

    useEffect(() => {
        const fetchDistribution = async () => {
            try {
                const response = await axios.get('/dashboard/investor/dashboard');
                const distribution = (response.data.investmentStatusDistribution || []).map((item, index) => ({
                    ...item,
                    color: CHART_COLORS[index % CHART_COLORS.length]
                }));

                setData(distribution);
            } catch (error) {
                console.error('Error fetching investment status distribution:', error);
            }
        };

        fetchDistribution();
    }, []);

    return (
        <div className='bg-white dark:bg-slate-900 backdrop-blur-xl rounded-b-2xl p-6 border border-slate-200/50 dark:border-slate-700/50'>
            <div className='mb-6'>
                <h3 className='text-lg font-bold text-slate-800 dark:text-white'>Investment Status</h3>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Completed, pending and failed investments</p>
            </div>
            <div className='h-48'>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                        data={data} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        innerRadius={40} 
                        paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contextStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: "none",
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                        }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className='space-y-3'>
                {data.every((item) => item.value === 0) && (
                    <p className='text-sm text-slate-500 dark:text-slate-400'>No investments yet.</p>
                )}
                {data.map((item, index) => {
                    return (
                    <div className='flex items-center justify-between' key={index}>
                        <div className='flex items-center space-x-3'>
                            <div className='w-3 h-3 rounded-full' style={{backgroundColor: item.color}} ></div>
                                <span className='text-sm text-slate-600 dark:text-slate-400'>{item.name}</span>
                            </div>
                            <div className='text-sm font-semibold text-slate-800 dark:text-white'>{item.value}</div>

                        </div>
                    
                    );
                })}
            </div>
        </div>
    );
}

export default SalesChart;