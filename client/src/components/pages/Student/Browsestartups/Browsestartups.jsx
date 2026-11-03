import React, { useContext, useEffect, useState } from 'react';
import { Rocket, Send, Eye, X, DollarSign, PieChart, Building2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { ChatContext } from '../../../../../context/ChatContext';

function BrowseStartups() {
  const navigate = useNavigate();
  const { setSelectedUser, getUsers } = useContext(ChatContext);

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [connectionStates, setConnectionStates] = useState({});
  const [connectingUserId, setConnectingUserId] = useState(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await API.get('/users/startups');
        if (res.data.success) {
          const startups = res.data.startups;
          setStartups(startups);

          const connectionStatusMap = {};
          for (const startup of startups) {
            const targetId = startup.userId || startup._id;
            try {
              const statusRes = await API.get(`/connections/${targetId}`);
              connectionStatusMap[targetId] = statusRes.data.status;
            } catch (statusErr) {
              connectionStatusMap[targetId] = 'none';
            }
          }
          setConnectionStates(connectionStatusMap);
        } else {
          toast.error(res.data.message || 'Failed to load startups');
        }
      } catch (err) {
        console.error('Startup fetch error', err);
        toast.error(err.response?.data?.message || 'Failed to load startups');
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const handleConnect = async (startup) => {
    const targetId = startup.userId || startup._id;
    const currentStatus = connectionStates[targetId];

    if (currentStatus === 'accepted') {
      setSelectedUser({ _id: targetId, name: startup.name });
      await getUsers();
      navigate('/student/messages', { state: { selectedUser: { _id: targetId, name: startup.name } } });
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

  const closeModal = () => setSelectedStartup(null);

  if (loading) {
    return <div className="p-10 text-center text-yellow-500">Loading startups...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Browse Startups</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Explore innovative student projects and rising ventures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <div
            key={startup._id}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 space-y-4 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Rocket className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 text-sm font-semibold">
                {startup.fundingStage || 'Idea'} Stage
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {startup.companyName || 'Untitled Startup'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1"><strong>Founder:</strong> {startup.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <strong>Seeking:</strong> ${startup.seekingAmount?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <strong>Equity:</strong> {startup.equityOffering || 'N/A'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic">"{startup.bio || 'No bio available'}"</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => handleConnect(startup)}
                disabled={connectingUserId === (startup.userId || startup._id) || connectionStates[startup.userId || startup._id] === 'pending'}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2 ${connectionStates[startup.userId || startup._id] === 'pending' ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 hover:opacity-90'}`}
              >
                {connectingUserId === (startup.userId || startup._id) ? (
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                ) : connectionStates[startup.userId || startup._id] === 'accepted' ? (
                  <Send className="w-4 h-4" />
                ) : connectionStates[startup.userId || startup._id] === 'pending' ? (
                  <div className="w-4 h-4 rounded-full border border-slate-400" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {connectionStates[startup.userId || startup._id] === 'accepted' ? 'Go to Chat' : connectionStates[startup.userId || startup._id] === 'pending' ? 'Pending' : 'Connect'}
              </button>
              <button
                onClick={() => setSelectedStartup(startup)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedStartup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 rounded-full p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-start">
              {/* Circular Image Container like Investors */}
              <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden object-cover shrink-0">
                {selectedStartup.companyLogo || selectedStartup.profilePicture ? (
                  <img src={selectedStartup.companyLogo || selectedStartup.profilePicture} alt={selectedStartup.companyName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-500 italic text-[10px] text-center p-2">No Logo</div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold dark:text-white">{selectedStartup.companyName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedStartup.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Founder: {selectedStartup.name}</p>
              </div>
            </div>

            {/* Attributes Grid like Investors */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Funding Stage</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{selectedStartup.fundingStage || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Seeking Amount</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">${selectedStartup.seekingAmount?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Equity Offering</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{selectedStartup.equityOffering || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Founded Date</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">
                   {selectedStartup.foundingDate ? new Date(selectedStartup.foundingDate).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Bio / Description</p>
              <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{selectedStartup.bio || 'No bio provided.'}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => handleConnect(selectedStartup)} 
                className="px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                {connectingUserId === (selectedStartup?.userId || selectedStartup?._id)
                  ? 'Connecting...'
                  : connectionStates[selectedStartup?.userId || selectedStartup?._id] === 'accepted'
                  ? 'Go to Chat'
                  : connectionStates[selectedStartup?.userId || selectedStartup?._id] === 'pending'
                  ? 'Pending'
                  : 'Connect with Founder'
                }
              </button>
              
              {selectedStartup.pitchDeckUrl && (
                <a 
                  href={selectedStartup.pitchDeckUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Pitch Deck
                </a>
              )}
              
              <button 
                onClick={closeModal} 
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseStartups;