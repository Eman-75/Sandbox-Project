// import React from 'react';
// import { Clock, Eye, CheckCircle, ArrowRight } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const proposals = [
//   {
//     id: 'PR-001',
//     investor: 'Venture Capital Partners',
//     amount: '$250K',
//     status: 'pending',
//     sent: '2 days ago',
//     views: 3,
//   },
//   {
//     id: 'PR-002',
//     investor: 'Sarah Thompson',
//     amount: '$150K',
//     status: 'viewed',
//     sent: '1 week ago',
//     views: 5,
//   },
//   {
//     id: 'PR-003',
//     investor: 'TechGrowth Fund',
//     amount: '$400K',
//     status: 'under review',
//     sent: '3 days ago',
//     views: 8,
//   },
// ];

// const statusConfig = {
//   pending: {
//     label: 'pending',
//     color: 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900',
//     icon: Clock,
//   },
//   viewed: {
//     label: 'viewed',
//     color: 'bg-blue-500 text-white',
//     icon: Eye,
//   },
//   'under review': {
//     label: 'under review',
//     color: 'bg-emerald-500 text-white',
//     icon: CheckCircle,
//   },
// };

// function Proposals() {
//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const fromInvestor = new URLSearchParams(search).get('investor');

//   const handleViewDetails = (proposal) => {
//     navigate(`/startup/proposals?selected=${proposal.id}`);
//     window.alert(`Details for ${proposal.investor}: ${proposal.amount} - Status: ${proposal.status}`);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Proposals</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//           Track your funding proposals and their status
//         </p>
//         {fromInvestor && (
//           <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
//             Redirected from investor: {fromInvestor}
//           </p>
//         )}
//       </div>

//       <div className="space-y-4">
//         {proposals.map((proposal) => {
//           const status = statusConfig[proposal.status];
//           const StatusIcon = status.icon;

//           return (
//             <div
//               key={proposal.id}
//               className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
//             >
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                       {proposal.investor}
//                     </h3>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}
//                     >
//                       <StatusIcon className="w-3 h-3" />
//                       {status.label}
//                     </span>
//                   </div>
//                   <p className="text-2xl font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent mb-2">
//                     {proposal.amount}
//                   </p>
//                   <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
//                     <span>Sent {proposal.sent}</span>
//                     <span className="flex items-center gap-1">
//                       <Eye className="w-4 h-4" />
//                       {proposal.views} views
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => handleViewDetails(proposal)}
//                   className="px-6 py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
//                 >
//                   View Details
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Proposals;


import React from 'react';
import UnifiedProposalsBoard from '../../../proposals/UnifiedProposalsBoard';

function Proposals() {
  return <UnifiedProposalsBoard />;
}

export default Proposals;