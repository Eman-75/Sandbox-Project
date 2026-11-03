import React from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

const queue = [
  {
    name: "TechStart Innovation",
    tag: "Startup",
    email: "contact@techstart.io",
    time: "2 hours ago",
  },
  {
    name: "Capital Ventures LLC",
    tag: "Investor",
    email: "info@capitalvc.com",
    time: "5 hours ago",
  },
  {
    name: "Sarah Johnson",
    tag: "Student",
    email: "sarah@univ.edu",
    time: "1 day ago",
  },
];

function VerificationQueue() {
  const handle = (action, name) => {
    window.alert(`${action} ${name} (demo)`);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Verification Queue
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Review new profiles
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {queue.map((item) => (
          <div
            key={item.name}
            className="
              p-4 rounded-xl
              bg-gradient-to-br
              from-slate-100/80 to-slate-200/60
              dark:from-slate-800/70 dark:to-slate-900/60
              border border-slate-300/40 dark:border-slate-700/50
              shadow-sm hover:shadow-md
              transition-all
            "
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 mt-1">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {item.time}
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {item.email}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handle("Approved", item.name)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 text-xs font-semibold hover:from-yellow-500 hover:to-yellow-700 shadow shadow-yellow-500/20 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>

              <button
                onClick={() => handle("Rejected", item.name)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-400/40 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-all"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>

              <button
                onClick={() => handle("Review", item.name)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-yellow-500/40 text-yellow-700 dark:text-yellow-400 text-xs font-semibold hover:bg-yellow-500/10 transition-all"
              >
                <Eye className="w-4 h-4" />
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerificationQueue;
