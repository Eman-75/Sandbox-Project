import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const Investment = () => {
  const [connectedStartups, setConnectedStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investingIn, setInvestingIn] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const { axios } = useContext(AuthContext);

  useEffect(() => {
    fetchConnectedStartups();
  }, [axios]);

  const fetchConnectedStartups = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/stripe/connected-startups');
      setConnectedStartups(data);
    } catch (err) {
      console.error('Error fetching connected startups:', err);
      toast.error('Failed to load connected startups');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (startupId, startupName) => {
    if (!investmentAmount || investmentAmount < 10) {
      toast.error('Minimum investment amount is $10');
      return;
    }

    try {
      setInvestingIn(startupId);
      const { data } = await axios.post('/api/stripe/invest', {
        amount: parseFloat(investmentAmount),
        startupId
      });

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Investment failed:', err);
      toast.error(err.response?.data?.message || 'Investment failed');
      setInvestingIn(null);
    }
  };

  const openInvestmentModal = (startup) => {
    setInvestingIn(startup._id);
    setInvestmentAmount('');
  };

  const closeInvestmentModal = () => {
    setInvestingIn(null);
    setInvestmentAmount('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e39622]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Investment Opportunities
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Invest in startups and students you're connected with
          </p>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white px-4 py-3 rounded-xl">
          <Users className="w-5 h-5" />
          <span className="font-semibold">{connectedStartups.length} Connected</span>
        </div>
      </div>

      {/* Investment Modal */}
      {investingIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Make an Investment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#e39622] focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="100.00"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum: $10 • Platform fee: 10%
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeInvestmentModal}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const startup = connectedStartups.find(s => s._id === investingIn);
                    handleInvest(investingIn, startup?.name);
                  }}
                  disabled={!investmentAmount || investmentAmount < 10}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {investingIn === 'processing' ? 'Processing...' : 'Invest Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Startups Grid */}
      {connectedStartups.length === 0 ? (
        <div className="text-center py-20">
          <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            No Connected Startups
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            Connect with startups and students to start investing
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedStartups.map((startup) => (
            <div
              key={startup._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {startup.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  startup.stripeAccountId
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                }`}>
                  {startup.stripeAccountId ? 'Ready to Invest' : 'Setting Up'}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {startup.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 capitalize">
                {startup.role}
              </p>

              <button
                onClick={() => openInvestmentModal(startup)}
                disabled={!startup.stripeAccountId}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {startup.stripeAccountId ? 'Invest Now' : 'Not Ready Yet'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Investment;