// import React from 'react';
// import { CheckCircle, Circle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const profileItems = [
//   {
//     id: 'company',
//     title: 'Company Information',
//     description: 'Company name, industry, and founding date',
//     completed: true,
//   },
//   {
//     id: 'pitch',
//     title: 'Pitch Deck',
//     description: 'Upload your pitch deck presentation',
//     completed: false,
//   },
//   {
//     id: 'business',
//     title: 'Business Plan',
//     description: 'Upload your detailed business plan',
//     completed: false,
//   },
//   {
//     id: 'financial',
//     title: 'Financial Information',
//     description: 'Add your financial projections and current metrics',
//     completed: false,
//   },
//   {
//     id: 'team',
//     title: 'Team Details',
//     description: 'Add information about your team members',
//     completed: false,
//   },
// ];

// function ProfileCompletion() {
//   const navigate = useNavigate();
//   const completedCount = profileItems.filter((item) => item.completed).length;
//   const completionPercentage = Math.round((completedCount / profileItems.length) * 100);

//   return (
//     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
//       <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold text-slate-900 dark:text-white">
//             Startup Profile Completion
//           </h3>
//           <span className="text-2xl font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent">
//             {completionPercentage}%
//           </span>
//         </div>
//         <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
//           <div
//             className="h-full bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-full transition-all duration-500"
//             style={{ width: `${completionPercentage}%` }}
//           />
//         </div>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           Complete your profile to unlock all features and increase your visibility
//         </p>
//       </div>
//       <div className="p-6 space-y-3">
//         {profileItems.map((item) => (
//           <div
//             key={item.id}
//             className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
//           >
//             <div className="mt-1">
//               {item.completed ? (
//                 <div className="p-1 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347]">
//                   <CheckCircle className="w-4 h-4 text-slate-900" />
//                 </div>
//               ) : (
//                 <Circle className="w-4 h-4 text-slate-400" />
//               )}
//             </div>
//             <div className="flex-1 min-w-0">
//               <h4
//                 className={`text-sm font-semibold mb-1 ${
//                   item.completed
//                     ? 'bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent'
//                     : 'text-slate-900 dark:text-white'
//                 }`}
//               >
//                 {item.title}
//               </h4>
//               <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
//             </div>
//             {!item.completed && (
//               <button
//                 onClick={() => navigate('/startup/profile')}
//                 className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
//               >
//                 Complete
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
//         <h4 className="text-sm font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent mb-2">
//           Why complete your profile?
//         </h4>
//         <p className="text-xs text-slate-500 dark:text-slate-400">
//           A complete profile increases your credibility and helps you get discovered by the right
//           people.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default ProfileCompletion;






import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../../api/axios';

function ProfileCompletion() {
  const navigate = useNavigate();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileTasks, setProfileTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const response = await axios.get('/dashboard/startup/dashboard');
        const data = response.data;
        setProfileCompletion(data.profileCompletion || 0);
        setProfileTasks(data.profileTasks || []);
      } catch (error) {
        console.error('Error fetching profile completion:', error);
        setProfileCompletion(0);
        setProfileTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-pulse">
        <div className="p-6 h-64 bg-slate-300 dark:bg-slate-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Startup Profile Completion
          </h3>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent">
            {profileCompletion}%
          </span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete your profile to unlock all features and increase your visibility
        </p>
      </div>
      <div className="p-6 space-y-3">
        {profileTasks.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
          >
            <div className="mt-1">
              {item.completed ? (
                <div className="p-1 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347]">
                  <CheckCircle className="w-4 h-4 text-slate-900" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold mb-1 ${
                  item.completed
                    ? 'bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
            {!item.completed && (
              <button
                onClick={() => navigate('/startup/profile')}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
              >
                Complete
              </button>
            )}
          </div>
        ))}
        {profileTasks.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No profile tasks available yet.</p>
        )}
      </div>
      <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-sm font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent mb-2">
          Why complete your profile?
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          A complete profile increases your credibility and helps you get discovered by the right
          people.
        </p>
      </div>
    </div>
  );
}

export default ProfileCompletion;