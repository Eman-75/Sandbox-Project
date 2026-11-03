import React from 'react';
import { FileSignature, Loader2 } from 'lucide-react';

function InvestorNdaLockOverlay({ loading = false, onSignClick, compact = false }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-white/70 p-4 backdrop-blur-sm">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileSignature className="h-5 w-5" />}
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          {loading ? 'Checking NDA access...' : 'Sign NDA To View Proposal'}
        </h3>
        <p className={`mx-auto mt-2 text-slate-600 ${compact ? 'text-xs' : 'text-sm'}`}>
          Proposal details stay hidden for investors until the master NDA is signed.
        </p>
        {!loading && (
          <button
            onClick={onSignClick}
            className="mt-4 rounded-xl bg-gradient-to-r from-[#e39622] to-[#ffb347] px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Sign NDA
          </button>
        )}
      </div>
    </div>
  );
}

export default InvestorNdaLockOverlay;
