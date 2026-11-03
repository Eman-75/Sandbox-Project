// import { DialogTitle } from '@headlessui/react';
// import { ArrowDownRight, ArrowRight, ArrowUpRight, DollarSign, Eye, ShoppingCart, Users } from 'lucide-react';
// import React from 'react';

// const stats = [
//     {
//         title: "Total Investment",
//         value: "$0",
//         change: "+12.5%",
//         trend: "up",
//         icon: DollarSign,
//         color: "from-emerald-500 to-teal-600",
//         bgColor: "bg-emerald-50 dark:bg-emerald-900/50",
//         textColor: "text-emerald-600 dark:text-emerald-400",
//     },
//     {
//         title: "Portfolio Value",
//         value: "$0",
//         change: "0%",
//         trend: "up",
//         icon: Users,
//         color: "from-blue-500 to-indigo-600",
//         bgColor: "bg-blue-50 dark:bg-blue-900/20",
//         textColor: "text-blue-600 dark:text-blue-400",
//     },
//     {
//         title: "Active Investments",
//         value: "1",
//         change: "+5.3%",
//         trend: "up",
//         icon: ShoppingCart,
//         color: "from-purple-500 to-pink-600",
//         bgColor: "bg-purple-50 dark:bg-purple-900/20",
//         textColor: "text-purple-600 dark:text-purple-400",
//     },
//     {
//         title: "Connections",
//         value: "2",
//         change: "+2.1%",
//         trend: "up",
//         icon: Eye,
//         color: "from-orange-500 to-red-600",
//         bgColor: "bg-orange-50 dark:bg-orange-900/20",
//         textColor: "text-orange-600 dark:text-orange-400",
//     },
// ]

// function StatsGrid() {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
//             {stats.map((stats, index) => {
//                 return (
//                     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group key={index}">
//                         <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                                 <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{stats.title}</p>
//                                 <p className='text-3xl font-bold text-slate-800 dark:text-white mb-4'>{stats.value}</p>
//                                 <div className="flex items-center space-x-2">
//                                     {stats.trend ==="up" ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
//                                     <span className={`text-sm font-semibold ${stats.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>{stats.change}</span>
//                                     <span className="text-sm text-slate-500 dark:text-slate-400">vs Last month</span>
//                                 </div>
//                             </div>
//                             <div className={`p-3 rounded-xl ${stats.bgColor} group-hover:scale-110 transition-all duration-300`}>
//                                 <stats.icon className={`w-6 h-6 ${stats.textColor}`} />

//                             </div>
                            
//                         </div>
//                         {/* Progressbar */}
//                         <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//                             <div className={`h-full bg-gradient-to-r ${stats.color} rounded-full transition-all duration-100`} style={{width: stats.trend === "up" ? "75%" : "40%"}}>
//                             </div>
//                         </div>
                        
//                     </div>
//                 );

//             })}

//         </div>
//     );
// }

// export default StatsGrid;






























import { ArrowUpRight, BriefcaseBusiness, DollarSign, Handshake, Rocket } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios'; // Ensure this path is correct for your project structure

const getDefaultStats = () => ([
    { title: "Total Investment", value: "$0", change: "Live total", progress: 0, trend: "up", icon: DollarSign, color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/50", textColor: "text-emerald-600 dark:text-emerald-400" },
    { title: "Completed Deals", value: "0", change: "Successful investments", progress: 0, trend: "up", icon: BriefcaseBusiness, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50 dark:bg-blue-900/20", textColor: "text-blue-600 dark:text-blue-400" },
    { title: "Pending Investments", value: "0", change: "Awaiting completion", progress: 0, trend: "up", icon: Rocket, color: "from-purple-500 to-pink-600", bgColor: "bg-purple-50 dark:bg-purple-900/20", textColor: "text-purple-600 dark:text-purple-400" },
    { title: "Total Connections", value: "0", change: "NDA-based relationships", progress: 0, trend: "up", icon: Handshake, color: "from-orange-500 to-red-600", bgColor: "bg-orange-50 dark:bg-orange-900/20", textColor: "text-orange-600 dark:text-orange-400" },
]);

function StatsGrid() {
    const [stats, setStats] = useState(getDefaultStats());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/dashboard/investor/dashboard');
                const apiStats = response.data?.stats || {};

                // Calculations for Progress Bars
                const investmentTarget = Math.max(apiStats.investmentTarget || 100000, apiStats.totalInvestment || 0);
                const totalInvestmentsCount = Math.max(apiStats.totalInvestments || 0, 1);

                const getPercentage = (value, total) => Math.max(0, Math.min(Math.round((value / total) * 100), 100));

                const statsData = [
                    {
                        ...getDefaultStats()[0],
                        value: `$${Number(apiStats.totalInvestment || 0).toLocaleString()}`,
                        progress: getPercentage(apiStats.totalInvestment || 0, investmentTarget),
                    },
                    {
                        ...getDefaultStats()[1],
                        value: (apiStats.completedDeals || 0).toString(),
                        progress: getPercentage(apiStats.completedDeals || 0, totalInvestmentsCount),
                    },
                    {
                        ...getDefaultStats()[2],
                        value: (apiStats.pendingInvestments || 0).toString(),
                        progress: getPercentage(apiStats.pendingInvestments || 0, totalInvestmentsCount),
                    },
                    {
                        ...getDefaultStats()[3],
                        value: (apiStats.totalConnections || 0).toString(),
                        progress: getPercentage(apiStats.totalConnections || 0, 50), // Assuming 50 as a goal for connections
                    },
                ];

                setStats(statsData);
            } catch (error) {
                console.error('Error fetching investor stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl p-6" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{stat.value}</p>
                            <div className="flex items-center space-x-2">
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-semibold text-emerald-500">{stat.change}</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-all duration-300`}>
                            <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`} 
                            style={{ width: `${stat.progress}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsGrid;