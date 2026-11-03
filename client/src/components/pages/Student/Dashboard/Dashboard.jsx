// import React from 'react';
// import { Users, MessageSquare, UserPlus, FileText, Building, BookOpen, Upload, TrendingUp, Check } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// function Dashboard() {
  
//   const navigate = useNavigate();

//   const activityStats = [
//     {
//       title: "Profile Views",
//       value: "24",
//       icon: Users,
//       trend: "up"
//     },
//     {
//       title: "Messages",
//       value: "8",
//       icon: MessageSquare,
//       trend: "up"
//     },
//     {
//       title: "Connections",
//       value: "3",
//       icon: UserPlus,
//       trend: "check"
//     },
//     {
//       title: "Active Projects",
//       value: "1",
//       icon: FileText,
//       trend: "up"
//     }
//   ];

//   const quickActions = [
//     {
//       title: "Find Investors",
//       description: "Connect with potential investors",
//       icon: Users,
//       onClick: () => navigate('/student/investors')
//     },
//     {
//       title: "Browse Startups",
//       description: "Explore internship opportunities",
//       icon: Building,
//       onClick: () => navigate('/student/startups')
//     },
//     {
//       title: "Learning Hub",
//       description: "Access educational resources",
//       icon: BookOpen,
//       onClick: () => navigate('/student/learninghub')
//     },
//     {
//       title: "Update Profile",
//       description: "Complete your student profile",
//       icon: Upload,
//       onClick: () => navigate('/student/profile')
//     }
//   ];

//   const profileTasks = [
//     {
//       title: "Basic Information",
//       description: "Name, email, and contact details",
//       completed: true
//     },
//     {
//       title: "University Card",
//       description: "Upload your university ID card for verification",
//       completed: false
//     },
//     {
//       title: "Final Year Project",
//       description: "Upload project files and documentation",
//       completed: false
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Activity Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {activityStats.map((stat, index) => (
//           <div 
//             key={index} 
//             className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
//                 <stat.icon className="w-6 h-6 text-white" />
//               </div>
//               {stat.trend === "up" && (
//                 <div className="w-8 h-8 flex items-center justify-center">
//                   <TrendingUp className="w-6 h-6 text-emerald-500" />
//                 </div>
//               )}
//               {stat.trend === "check" && (
//                 <div className="w-8 h-8 flex items-center justify-center">
//                   <Check className="w-6 h-6 text-emerald-500" />
//                 </div>
//               )}
//             </div>
//             <div>
//               <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</p>
//               <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Quick Actions */}
//         <div className="lg:col-span-2">
//           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {quickActions.map((action, index) => (
//               <button
//                 key={index}
//                     onClick={quickActions.onClick}
//                 className="bg-gradient-to-r from-[#e39622] to-[#ffb347] hover:from-yellow-500 hover:to-yellow-700 text-slate-900 rounded-xl p-6 text-left transition-all duration-300 group shadow-lg shadow-yellow-500/20"
//               >
//                 <div className="flex flex-col items-start gap-4">
//                   <div className="p-3 bg-white/90 rounded-lg group-hover:bg-white/30 transition-colors">
//                     <action.icon className="w-6 h-6 text-slate-900" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg mb-1 text-slate-900">{action.title}</h3>
//                     <p className="text-sm text-slate-800">{action.description}</p>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Profile Completion */}
//         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
//           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Student Profile Completion</h2>
//           <div className="mb-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">20%</span>
//             </div>
//             <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300" 
//                 style={{ width: '20%' }}
//               ></div>
//             </div>
//           </div>
//           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
//             Complete your profile to unlock all features and increase your visibility.
//           </p>
//           <div className="space-y-4">
//             {profileTasks.map((task, index) => (
//               <div key={index} className="flex items-start gap-3">
//                 {task.completed ? (
//                   <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mt-0.5 flex-shrink-0">
//                     <Check className="w-3 h-3 text-white" />
//                   </div>
//                 ) : (
//                   <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full mt-0.5 flex-shrink-0"></div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className={`text-sm font-medium ${task.completed ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
//                     {task.title}
//                   </p>
//                   <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{task.description}</p>
//                 </div>
//                 {!task.completed && (
//                   <button
//                     onClick={() => navigate('/student/profile')}
//                     className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 text-xs font-semibold rounded-lg transition-all duration-300 flex-shrink-0"
//                   >
//                     Complete
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
//         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
//         <div className="text-slate-500 dark:text-slate-400 text-sm">No recent activity to display.</div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;








import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, UserPlus, Building, BookOpen, Upload, TrendingUp, Check, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    uploadedDocuments: 0,
    messages: 0,
    connections: 0,
    interestAreas: 0
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileTasks, setProfileTasks] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/dashboard/student/dashboard');
        const data = response.data;

        setStats({
          uploadedDocuments: data.stats?.uploadedDocuments || 0,
          messages: data.stats?.messages || 0,
          connections: data.stats?.connections || 0,
          interestAreas: data.stats?.interestAreas || 0
        });
        setProfileCompletion(data.profileCompletion || 0);
        setProfileTasks(data.profileTasks || []);
        setRecentMessages(data.recentMessages || []);
      } catch (error) {
        console.error('Error fetching student dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activityStats = [
    {
      title: "Uploaded Documents",
      value: stats.uploadedDocuments.toString(),
      icon: FolderOpen,
      trend: "up"
    },
    {
      title: "Messages",
      value: stats.messages.toString(),
      icon: MessageSquare,
      trend: "up"
    },
    {
      title: "Connections",
      value: stats.connections.toString(),
      icon: UserPlus,
      trend: "check"
    },
    {
      title: "Interest Areas",
      value: stats.interestAreas.toString(),
      icon: Users,
      trend: "up"
    }
  ];

  const quickActions = [
    {
      title: "Find Investors",
      description: "Connect with potential investors",
      icon: Users,
      onClick: () => navigate('/student/investors')
    },
    {
      title: "Browse Startups",
      description: "Explore internship opportunities",
      icon: Building,
      onClick: () => navigate('/student/startups')
    },
    {
      title: "Learning Hub",
      description: "Access educational resources",
      icon: BookOpen,
      onClick: () => navigate('/student/learninghub')
    },
    {
      title: "Update Profile",
      description: "Complete your student profile",
      icon: Upload,
      onClick: () => navigate('/student/profile')
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-300 dark:bg-slate-600 rounded-2xl h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.trend === "up" && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
              )}
              {stat.trend === "check" && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-gradient-to-r from-[#e39622] to-[#ffb347] hover:from-yellow-500 hover:to-yellow-700 text-slate-900 rounded-xl p-6 text-left transition-all duration-300 group shadow-lg shadow-yellow-500/20"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-white/90 rounded-lg group-hover:bg-white/30 transition-colors">
                    <action.icon className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-slate-900">{action.title}</h3>
                    <p className="text-sm text-slate-800">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Student Profile Completion</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Complete your profile to unlock all features and increase your visibility.
          </p>
          <div className="space-y-4">
            {profileTasks.map((task, index) => (
              <div key={index} className="flex items-start gap-3">
                {task.completed ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full mt-0.5 flex-shrink-0"></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{task.description}</p>
                </div>
                {!task.completed && (
                  <button
                    onClick={() => navigate('/student/profile')}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 text-xs font-semibold rounded-lg transition-all duration-300 flex-shrink-0"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.slice(0, 4).map((message) => (
              <div key={message.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {message.sender || 'New Message'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {message.message}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {!message.read && <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 ml-auto mb-2"></div>}
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(message.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400 text-sm">No recent activity to display.</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;