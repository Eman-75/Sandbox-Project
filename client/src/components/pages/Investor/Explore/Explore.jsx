import React, { useContext, useEffect, useState } from 'react';
import { Rocket, Send, Eye, X, GraduationCap, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { ChatContext } from '../../../../../context/ChatContext';

function Explore() {
    const navigate = useNavigate();
    const { setSelectedUser, getUsers } = useContext(ChatContext);

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'startup', 'student'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedStage, setSelectedStage] = useState('all');
    const [selectedDegree, setSelectedDegree] = useState('all');
    const [selectedInterest, setSelectedInterest] = useState('all');
    const [selectedSeeking, setSelectedSeeking] = useState('all');
    const [connectionStates, setConnectionStates] = useState({}); // Track connection status for each user
    const [connectingUserId, setConnectingUserId] = useState(null); // Track which user is being connected

    useEffect(() => {
        const fetchExploreData = async () => {
            try {
                const [startupRes, studentRes] = await Promise.all([
                    API.get('/users/startups'),
                    API.get('/users/students')
                ]);

                const startups = (startupRes.data.startups || []).map(s => ({ ...s, exploreType: 'startup' }));
                const students = (studentRes.data.users || []).map(s => ({ ...s, exploreType: 'student' }));

                const combined = [...startups, ...students];
                setItems(combined);
                setFilteredItems(combined);

                // Fetch connection status for all users
                const connectionStatusMap = {};
                for (const user of combined) {
                    const targetId = user.userId || user._id;
                    try {
                        const res = await API.get(`/connections/${targetId}`);
                        connectionStatusMap[targetId] = res.data.status;
                    } catch (err) {
                        connectionStatusMap[targetId] = 'none';
                    }
                }
                setConnectionStates(connectionStatusMap);
            } catch (err) {
                console.error('Explore fetch error', err);
                toast.error('Failed to load explore data');
            } finally {
                setLoading(false);
            }
        };
        fetchExploreData();
    }, []);

    // Filter and Search Logic
    useEffect(() => {
        let result = items;

        // Filter by Tab (Startup/Student)
        if (activeTab !== 'all') {
            result = result.filter(item => item.exploreType === activeTab);
        }

        // Search Query
        if (searchQuery) {
            result = result.filter(item =>
                (item.companyName || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Startup Specific: Funding Stage Filter
        if (activeTab === 'startup' && selectedStage !== 'all') {
            result = result.filter(item => item.fundingStage === selectedStage);
        }

        // Startup Specific: Seeking Amount Filter
        if (activeTab === 'startup' && selectedSeeking !== 'all') {
            const [min, max] = selectedSeeking.split('-').map(Number);
            result = result.filter(item => {
                const amount = item.seekingAmount || 0;
                return max ? (amount >= min && amount <= max) : (amount >= min);
            });
        }

        // Student Specific: Degree Level Filter
        if (activeTab === 'student' && selectedDegree !== 'all') {
            result = result.filter(item => item.degreeLevel === selectedDegree);
        }

        // Student Specific: Interest Category Filter
        if (activeTab === 'student' && selectedInterest !== 'all') {
            result = result.filter(item => item.interestCategories?.includes(selectedInterest));
        }

        setFilteredItems(result);
    }, [activeTab, searchQuery, items, selectedStage, selectedDegree, selectedInterest, selectedSeeking]);

    const handleConnect = async (item) => {
        const targetId = item.userId || item._id;
        const currentStatus = connectionStates[targetId];
        
        // If already connected, go to chat
        if (currentStatus === 'accepted') {
            setSelectedUser({ _id: targetId, name: item.name || item.companyName });
            await getUsers();
            navigate('/investor/messages', { state: { selectedUser: { _id: targetId, name: item.name || item.companyName } } });
            return;
        }

        // If already pending, don't allow another request
        if (currentStatus === 'pending') {
            toast.info('Connection request already pending');
            return;
        }

        // Send new connection request
        setConnectingUserId(targetId);
        try {
            await API.post('/connections/send', {
                toUserId: targetId
            });
            
            setConnectionStates({
                ...connectionStates,
                [targetId]: 'pending'
            });
            
            toast.success('Connection request sent!');
        } catch (err) {
            console.error('Connection request error:', err);
            toast.error(err.response?.data?.message || 'Failed to send connection request');
        } finally {
            setConnectingUserId(null);
        }
    };

    const closeModal = () => setSelectedItem(null);

    if (loading) return <div className="p-10 text-center text-yellow-500 font-bold animate-pulse">Initializing Explore Hub...</div>;

    return (
        <div className="space-y-6 relative min-h-screen overflow-hidden">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Explore</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Discover top student talent and innovative startups</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search name or company..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#e39622] outline-none w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Toggle Tabs */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {['all', 'startup', 'student'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tight ${activeTab === tab
                                    ? 'bg-white dark:bg-slate-700 text-[#e39622] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}s
                            </button>
                        ))}
                    </div>

                    {/* Sub-Filters Row: Only show if NOT on 'all' tab */}
                    {activeTab !== 'all' && (
                        <div className="flex flex-wrap items-center gap-3 py-2 animate-in fade-in slide-in-from-top-1">
                            {activeTab === 'startup' ? (
                                <>
                                    <select
                                        value={selectedStage}
                                        onChange={(e) => setSelectedStage(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        <option value="all">All Stages</option>
                                        <option value="Idea">Idea Stage</option>
                                        <option value="Pre-seed">Pre-seed</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                    </select>

                                    <select
                                        value={selectedSeeking}
                                        onChange={(e) => setSelectedSeeking(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        <option value="all">Any Amount</option>
                                        <option value="0-50000">Under $50k</option>
                                        <option value="50000-250000">$50k - $250k</option>
                                        <option value="250000-1000000">$250k - $1M</option>
                                        <option value="1000000">Over $1M</option>
                                    </select>
                                </>
                            ) : (
                                <>
                                    <select
                                        value={selectedDegree}
                                        onChange={(e) => setSelectedDegree(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="all">All Degrees</option>
                                        <option value="Bachelors">Bachelors</option>
                                        <option value="Masters">Masters</option>
                                        <option value="PhD">PhD</option>
                                    </select>

                                    <select
                                        value={selectedInterest}
                                        onChange={(e) => setSelectedInterest(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="all">All Interests</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Mobile Apps">Mobile Apps</option>
                                        <option value="Cloud Computing">Cloud Computing</option>
                                        <option value="AI/Machine Learning">AI/Machine Learning</option>
                                        <option value="Blockchain">Blockchain</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Cybersecurity">Cybersecurity</option>
                                        <option value="IoT">IoT</option>
                                    </select>
                                </>
                            )}

                            {(selectedStage !== 'all' || selectedDegree !== 'all' || selectedInterest !== 'all') && (
                                <button
                                    onClick={() => { setSelectedStage('all'); setSelectedDegree('all'); setSelectedInterest('all'); }}
                                    className="text-[10px] text-red-500 font-bold hover:underline ml-2"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 space-y-4 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                                    {item.exploreType === 'startup' ? <Rocket className="w-6 h-6 text-orange-500" /> : <GraduationCap className="w-6 h-6 text-blue-500" />}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.exploreType === 'startup' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {item.exploreType}
                                </span>
                            </div>

                            <div className="min-h-[100px]">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {item.exploreType === 'startup' ? item.companyName : item.name}
                                </h3>
                                <div className="text-sm space-y-1 text-slate-500 dark:text-slate-400">
                                    {item.exploreType === 'startup' ? (
                                        <>
                                            <p>
                                                <strong className="text-slate-900 dark:text-white font-semibold">Stage:</strong> {item.fundingStage || 'Idea'}
                                            </p>
                                            <p>
                                                <strong className="text-slate-900 dark:text-white font-semibold">Seeking:</strong> ${item.seekingAmount?.toLocaleString() || '0'}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                <strong className="text-slate-900 dark:text-white font-semibold">Degree:</strong> {item.degreeLevel || 'Student'}
                                            </p>
                                            <p>
                                                <strong className="text-slate-900 dark:text-white font-semibold">Department:</strong> {item.department || 'N/A'}
                                            </p>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 mt-2 line-clamp-2 italic">
                                    {item.bio || 'Professional profile in the Sandbox ecosystem.'}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                {(() => {
                                    const targetId = item.userId || item._id;
                                    const status = connectionStates[targetId];
                                    return (
                                        <button 
                                            onClick={() => handleConnect(item)} 
                                            disabled={connectingUserId === targetId || status === 'pending'}
                                            className={`flex-1 px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity ${
                                                status === 'accepted' 
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90'
                                                    : status === 'pending'
                                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60'
                                                    : 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 hover:opacity-90'
                                            }`}
                                        >
                                            {connectingUserId === targetId ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                                                    Connecting...
                                                </>
                                            ) : status === 'accepted' ? (
                                                <>
                                                    <Send className="w-4 h-4" /> Go to Chat
                                                </>
                                            ) : status === 'pending' ? (
                                                <>
                                                    <div className="w-4 h-4 rounded-full border border-slate-400" />
                                                    Pending
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" /> Connect
                                                </>
                                            )}
                                        </button>
                                    );
                                })()}
                                <button onClick={() => setSelectedItem(item)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Eye className="w-4 h-4" /> Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 align-middle gap-1">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                        <Search className="w-8 h-8 text-slate-900" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No results found</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedStage('all');
                            setSelectedDegree('all');
                            setSelectedInterest('all');
                            setSelectedSeeking('all');
                            setActiveTab('all');
                        }}
                        className="mt-6 text-sm font-bold text-[#e39622] hover:underline"
                    >
                        Reset all filters
                    </button>
                </div>
            )}

            {/* ADAPTIVE POPUP MODAL */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative">
                        <button onClick={closeModal} className="absolute top-3 right-3 rounded-full p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 transition-colors"><X className="w-4 h-4" /></button>

                        <div className="flex gap-4 items-start">
                            <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                                <img src={selectedItem.profilePicture || selectedItem.companyLogo || "https://via.placeholder.com/150"} alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold dark:text-white">{selectedItem.exploreType === 'startup' ? selectedItem.companyName : selectedItem.name}</h3>
                                <p className="text-sm text-slate-500">{selectedItem.email}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-0.5 rounded bg-[#e39622]/10 text-[#e39622] text-[10px] font-bold uppercase">{selectedItem.exploreType}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedItem.exploreType === 'startup' ? (
                                <>
                                    <div><p className="text-xs uppercase text-slate-500">Stage</p><p className="text-sm dark:text-white font-medium">{selectedItem.fundingStage}</p></div>
                                    <div><p className="text-xs uppercase text-slate-500">Seeking</p><p className="text-sm dark:text-white font-medium">${selectedItem.seekingAmount?.toLocaleString()}</p></div>
                                    <div><p className="text-xs uppercase text-slate-500">Equity</p><p className="text-sm dark:text-white font-medium">{selectedItem.equityOffering}</p></div>
                                </>
                            ) : (
                                <>
                                    <div><p className="text-xs uppercase text-slate-500">Major</p><p className="text-sm dark:text-white font-medium">{selectedItem.major || 'N/A'}</p></div>
                                    <div>
                                        <p className="text-xs uppercase text-slate-500 font-bold">Interests</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedItem.interestCategories?.map((cat, i) => (
                                                <span key={i} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-600 dark:text-slate-300">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div><p className="text-xs uppercase text-slate-500">University</p><p className="text-sm dark:text-white font-medium">{selectedItem.university || 'N/A'}</p></div>
                                </>
                            )}
                        </div>

                        <div className="mt-4">
                            <p className="text-xs uppercase text-slate-500">About</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedItem.bio || 'No details provided.'}</p>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button 
                                onClick={() => { handleConnect(selectedItem); closeModal(); }} 
                                disabled={connectingUserId === selectedItem._id || connectionStates[selectedItem._id] === 'pending'}
                                className={`px-6 py-2 rounded-xl font-bold shadow-lg transition-all ${
                                    connectionStates[selectedItem._id] === 'accepted' 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90'
                                        : connectionStates[selectedItem._id] === 'pending'
                                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 shadow-orange-500/10 hover:opacity-90'
                                }`}
                            >
                                {connectingUserId === selectedItem._id 
                                    ? 'Connecting...' 
                                    : connectionStates[selectedItem._id] === 'accepted'
                                    ? 'Go to Chat'
                                    : connectionStates[selectedItem._id] === 'pending'
                                    ? 'Pending'
                                    : 'Connect'
                                }
                            </button>
                            <button onClick={closeModal} className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Explore;
