// import React from 'react';
// import { proposals } from '../../../../mocks/proposals';

// const statusColor = {
//   'Under Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
//   'In Dataroom': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
//   'Accepted': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
//   'Negotiating': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-200',
// };

// function Proposals() {
//   return (
//     <div className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proposals</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">Manage your investment proposals and term sheets</p>
//       </div>
//       <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
//         <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
//           {proposals.map((item) => (
//             <div className="p-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between" key={item.id}>
//               <div>
//                 <p className="text-xs uppercase tracking-wide text-slate-400">{item.id}</p>
//                 <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.company}</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">{item.terms}</p>
//               </div>
//               <div className="flex items-center gap-3 md:text-right">
//                 <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.amount}</span>
//                 <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
//                 <span className="text-xs text-slate-500 dark:text-slate-400">Updated {item.updated}</span>
//               </div>
//             </div>
//           ))}
//         </div>
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