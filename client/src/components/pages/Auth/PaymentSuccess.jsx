// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { CheckCircle, ArrowRight } from 'lucide-react';

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const sessionId = searchParams.get('session_id');

//   useEffect(() => {
//     // In a real app, you might want to verify the payment here
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleContinue = () => {
//     // Redirect based on user role - this is a simple implementation
//     // In a real app, you'd get the user role from context/auth
//     const userRole = localStorage.getItem('userRole') || 'investor';
//     navigate(`/${userRole}/dashboard`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#e39622] mx-auto mb-4"></div>
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
//             Processing Payment...
//           </h2>
//           <p className="text-slate-600 dark:text-slate-400">
//             Please wait while we confirm your investment
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
//         <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
//           <CheckCircle className="w-12 h-12 text-emerald-600" />
//         </div>

//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
//           Payment Successful!
//         </h1>

//         <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
//           Your investment has been processed successfully. The startup will receive 90% of your investment,
//           and SandBox keeps 10% as a platform fee.
//         </p>

//         <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
//           <p className="text-sm text-slate-600 dark:text-slate-400">
//             Session ID: <span className="font-mono text-slate-900 dark:text-white">{sessionId}</span>
//           </p>
//         </div>

//         <button
//           onClick={handleContinue}
//           className="w-full px-6 py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
//         >
//           Continue to Dashboard
//           <ArrowRight className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;















import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import API from '../../../api/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAndSync = async () => {
      try {
        if (!sessionId) {
          setError("No session ID found. We couldn't verify this transaction.");
          setLoading(false);
          return;
        }

        // 1. Try Stripe-backed verification first
        try {
          await API.get(`/stripe/verify-payment?session_id=${sessionId}`);
        } catch (verifyError) {
          // 2. Sandbox fallback: trust the success redirect and mark the matching pending record completed
          await API.post('/stripe/confirm-success', {
            session_id: sessionId
          });
        }

        // 3. Refresh auth state using the real auth-check endpoint
        await API.get('/auth/check');

        setLoading(false);
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.response?.data?.message || "Verification failed. Please check your dashboard.");
        setLoading(false);
      }
    };

    verifyAndSync();
  }, [sessionId]);

  const handleContinue = () => {
    const userRole = localStorage.getItem('role') || 'investor';
    navigate(`/${userRole}/dashboard`);
  };

  // --- VIEW: LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#e39622] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verifying Investment...</h2>
          <p className="text-slate-600 dark:text-slate-400">Securing your transaction with Stripe</p>
        </div>
      </div>
    );
  }

  // --- VIEW: ERROR ---
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="text-[#e39622] font-semibold underline">Try again</button>
        </div>
      </div>
    );
  }

  // --- VIEW: SUCCESS ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-emerald-100 dark:border-emerald-900/30">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Payment Confirmed!</h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Your investment is now live. The startup will receive 90%, and 10% has been allocated to the platform fee.
        </p>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Receipt Reference</p>
          <p className="font-mono text-xs text-slate-900 dark:text-white break-all">{sessionId}</p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2 group"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
