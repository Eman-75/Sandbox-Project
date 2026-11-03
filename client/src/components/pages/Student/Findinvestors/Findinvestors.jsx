import React, { useContext, useEffect, useState } from 'react';
import { Users, Send, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { ChatContext } from '../../../../../context/ChatContext';

function Investors() {
  const navigate = useNavigate();
  const { setSelectedUser, getUsers } = useContext(ChatContext);

  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [connectionStates, setConnectionStates] = useState({});
  const [connectingUserId, setConnectingUserId] = useState(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const res = await API.get('/users/investors');
        if (res.data.success) {
          const investors = res.data.investors;
          setInvestors(investors);

          const connectionStatusMap = {};
          for (const investor of investors) {
            const targetId = investor.userId || investor._id;
            try {
              const statusRes = await API.get(`/connections/${targetId}`);
              connectionStatusMap[targetId] = statusRes.data.status;
            } catch (statusErr) {
              connectionStatusMap[targetId] = 'none';
            }
          }
          setConnectionStates(connectionStatusMap);
        } else {
          toast.error(res.data.message || 'Failed to load investors');
        }
      } catch (err) {
        console.error('Investor fetch error', err);
        console.error('API URL', API.defaults.baseURL, 'Request', '/users/investors');
        console.error('Response status', err.response?.status, 'data', err.response?.data);
        toast.error(err.response?.data?.message || err.message || 'Failed to load investors');
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  const handleConnect = async (investor) => {
    const targetId = investor.userId || investor._id;
    const currentStatus = connectionStates[targetId];

    if (currentStatus === 'accepted') {
      setSelectedUser({ _id: targetId, name: investor.name });
      await getUsers();
      navigate('/student/messages', { state: { selectedUser: { _id: targetId, name: investor.name } } });
      return;
    }

    if (currentStatus === 'pending') {
      toast.info('Connection request already pending');
      return;
    }

    setConnectingUserId(targetId);
    try {
      await API.post('/connections/send', { toUserId: targetId });
      setConnectionStates((prev) => ({ ...prev, [targetId]: 'pending' }));
      toast.success('Connection request sent!');
    } catch (err) {
      console.error('Connection request error:', err);
      toast.error(err.response?.data?.message || 'Failed to send connection request');
    } finally {
      setConnectingUserId(null);
    }
  };

  const handleViewProfile = (investor) => {
    setSelectedInvestor(investor);
  };

  const closeModal = () => setSelectedInvestor(null);

  const computedMatch = (investor) => {
    // Simple score: number of interest matches always neutral for now
    const score = Math.min(95, Math.max(60, Math.round(65 + (investor.sectorsOfInterest?.length || 0) * 3)));
    return score;
  };

  if (loading) {
    return <div className="p-10 text-center text-yellow-500">Loading investors...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find Investors
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Connect with potential investors for your projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investors.map((investor) => (
          <div
            key={investor._id}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 space-y-4 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Users className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 text-sm font-semibold">
                {computedMatch(investor)}% match
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {investor.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1"><strong>Company:</strong> {investor.companyName || 'N/A'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1"><strong>Role:</strong> {investor.position || 'N/A'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1"><strong>Expertise:</strong> {investor.experienceLevel || 'N/A'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sectors: {investor.sectorsOfInterest?.join(', ') || 'N/A'}</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => handleConnect(investor)}
                disabled={connectingUserId === (investor.userId || investor._id) || connectionStates[investor.userId || investor._id] === 'pending'}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2 ${connectionStates[investor.userId || investor._id] === 'pending' ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 hover:opacity-90'}`}
              >
                {connectingUserId === (investor.userId || investor._id) ? (
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                ) : connectionStates[investor.userId || investor._id] === 'accepted' ? (
                  <Send className="w-4 h-4" />
                ) : connectionStates[investor.userId || investor._id] === 'pending' ? (
                  <div className="w-4 h-4 rounded-full border border-slate-400" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {connectionStates[investor.userId || investor._id] === 'accepted' ? 'Go to Chat' : connectionStates[investor.userId || investor._id] === 'pending' ? 'Pending' : 'Connect'}
              </button>
              <button
                onClick={() => handleViewProfile(investor)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedInvestor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 rounded-full p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700">
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-start">
              <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden object-cover">
                {selectedInvestor.profilePicture ? (
                  <img src={selectedInvestor.profilePicture} alt={selectedInvestor.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-500">No Picture</div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold dark:text-white">{selectedInvestor.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInvestor.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInvestor.companyName}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Position</p>
                <p className="text-sm text-slate-900 dark:text-white">{selectedInvestor.position || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Experience</p>
                <p className="text-sm text-slate-900 dark:text-white">{selectedInvestor.experienceLevel || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Investment Range</p>
                <p className="text-sm text-slate-900 dark:text-white">${selectedInvestor.investmentRange?.min || 0} - ${selectedInvestor.investmentRange?.max || 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Sectors</p>
                <p className="text-sm text-slate-900 dark:text-white">{selectedInvestor.sectorsOfInterest?.join(', ') || '—'}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Bio</p>
              <p className="text-sm text-slate-900 dark:text-white">{selectedInvestor.bio || 'No bio provided.'}</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={() => handleConnect(selectedInvestor)} className="px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold">
                {connectingUserId === (selectedInvestor?.userId || selectedInvestor?._id)
                  ? 'Connecting...'
                  : connectionStates[selectedInvestor?.userId || selectedInvestor?._id] === 'accepted'
                  ? 'Go to Chat'
                  : connectionStates[selectedInvestor?.userId || selectedInvestor?._id] === 'pending'
                  ? 'Pending'
                  : 'Connect'
                }
              </button>
              <button onClick={closeModal} className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Investors;

