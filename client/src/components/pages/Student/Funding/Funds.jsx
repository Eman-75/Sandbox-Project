import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { DollarSign, TrendingUp, CreditCard, Calendar, User, Banknote, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const Funds = () => {
    const [investments, setInvestments] = useState([]);
    const [stats, setStats] = useState({ totalReceived: 0, totalInvestments: 0 });
    const [loading, setLoading] = useState(true);
    const [fetchingHistory, setFetchingHistory] = useState(false);
    const [stripeConnected, setStripeConnected] = useState(false);
    const { user, axios } = useContext(AuthContext);

    useEffect(() => {
        const syncUserAndData = async () => {
            console.log("1. [Funds] Sync started. Current user from Context:", user);

            const safetyTimer = setTimeout(() => {
                console.warn("X. [Funds] Safety timer triggered! Forcing loading to false.");
                setLoading(false);
            }, 6000);

            try {
                console.log("2. [Funds] Calling /api/auth/check...");
                const { data } = await axios.get('/api/auth/check');
                console.log("3. [Funds] API Response received:", data);

                if (data.success && data.user) {
                    const isConnected = !!data.user.stripeAccountId;
                    console.log("4. [Funds] Stripe Connected:", isConnected);
                    setStripeConnected(isConnected);

                    if (isConnected) {
                        console.log("5. [Funds] Fetching history...");
                        await fetchHistory();
                        console.log("6. [Funds] History fetch complete.");
                    }
                } else {
                    console.error("!. [Funds] data.success was false or user missing:", data);
                }
            } catch (err) {
                console.error("ERROR. [Funds] Sync failed:", err.response?.status, err.message);
                console.error("ERROR Details:", err.response?.data);
            } finally {
                console.log("7. [Funds] Entering finally block. Setting loading to false.");
                clearTimeout(safetyTimer);
                setLoading(false);
            }
        };

        if (user !== undefined) {
            syncUserAndData();
        } else {
            console.log("?. [Funds] Waiting for user to be defined in AuthContext...");
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            setFetchingHistory(true);
            const { data } = await axios.get('/api/stripe/investments');
            setInvestments(data.investments || []);
            setStats({
                totalReceived: data.totalReceived || 0,
                totalInvestments: data.totalInvestments || 0
            });
        } catch (err) {
            console.error("Failed to load history:", err);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleConnectStripe = async () => {
        try {
            const { data } = await axios.post('/api/stripe/onboard');
            if (data.url) window.location.href = data.url;
        } catch (err) {
            toast.error("Failed to start Stripe onboarding");
        }
    };

    const handleViewDashboard = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/stripe/dashboard-link');
            if (data.url) {
                window.open(data.url, '_blank'); // Open in new tab
            }
        } catch (err) {
            toast.error("Could not access Stripe dashboard.");
        } finally {
            setLoading(false);
        }
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
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Funding Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage all your received investments and receiving payouts.
                    </p>
                </div>
                {stripeConnected && (
                    <button
                        onClick={handleViewDashboard}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Stripe Dashboard
                    </button>
                )}
            </div>

            {/* 1. Connection Section - Disappears if connected */}
            {!stripeConnected && (
                <div className="bg-white dark:from-amber-900/20 dark:to-orange-900/20 border border-slate-200 dark:border-amber-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-black dark:text-amber-100">Connect Your Bank Account</h3>
                            <p className="text-slate-700 dark:text-amber-300 text-sm">Required to receive payouts from investors.</p>
                        </div>
                    </div>
                    <button onClick={handleConnectStripe} className="mt-3 px-8 py-3 bg-[#625bf6] text-white rounded-xl font-semibold cursor-pointer">
                        Connect with <span className='font-bold'>Stripe</span>
                    </button>
                </div>
            )}

            {/* 2. Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Received" value={`$${stats.totalReceived.toFixed(2)}`} icon={<DollarSign className="text-emerald-600" />} color="bg-emerald-100" />
                <StatCard title="Investments" value={stats.totalInvestments} icon={<TrendingUp className="text-blue-600" />} color="bg-blue-100" />
                <StatCard title="Avg. Investment" value={`$${stats.totalInvestments > 0 ? (stats.totalReceived / stats.totalInvestments).toFixed(2) : '0.00'}`} icon={<User className="text-purple-600" />} color="bg-purple-100" />
            </div>

            {/* 3. History Section */}
            <div className="bg-white/80 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Investment History</h3>
                </div>

                {fetchingHistory ? (
                    <div className="p-20 text-center animate-pulse text-slate-400">Loading history...</div>
                ) : !investments || investments.length === 0 ? (
                    <div className="p-20 text-center">
                        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No investment history found yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {investments.map((inv) => (
                            <div key={inv._id} className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#e39622] rounded-full flex items-center justify-center text-white font-bold">
                                        {inv.investor?.name?.charAt(0) || 'I'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{inv.investor?.name || 'Investor'}</p>
                                        <p className="text-xs text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-emerald-600">+${inv.startupAmount?.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple StatCard Sub-component
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white/80 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-amber-700 p-6">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>{icon}</div>
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);

export default Funds;