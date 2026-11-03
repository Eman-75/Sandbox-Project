import React, { useEffect, useState } from 'react';
import {
    FileText, Link, PlayCircle, Search,
    LayoutGrid, LinkIcon
} from 'lucide-react';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';

function StudentResources() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); 
    const [searchQuery, setSearchQuery] = useState('');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await API.get('/resources');
            const data = res.data.resources || [];
            
            // Filter only student resources immediately on fetch
            // This includes items tagged for 'student' specifically
            const studentOnly = data.filter(item => 
                item.audience?.includes('student')
            );
            
            setItems(studentOnly);
            setFilteredItems(studentOnly);
        } catch (err) {
            console.error('Resource fetch error', err);
            toast.error('Failed to load library');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Filter and Search Logic
    useEffect(() => {
        let result = items;

        if (activeTab !== 'all') {
            result = result.filter(item => item.type === activeTab);
        }

        if (searchQuery) {
            result = result.filter(item =>
                (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(result);
    }, [activeTab, searchQuery, items]);

    if (loading) return <div className="p-10 text-center text-[#e39622] font-bold animate-pulse text-xl">Loading your library...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Vault</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Curated guides and tools to help you master the MERN stack</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search learning materials..."
                        className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#e39622] outline-none w-full sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Filters */}
            <div className="flex w-fit bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm overflow-x-auto self-start">
                {['all', 'pdf', 'link', 'video'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-tight whitespace-nowrap ${activeTab === tab
                            ? 'bg-[#e39622] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab}s
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 group">
                            <div>
                                <div className={`p-3 w-fit rounded-xl mb-4 ${
                                    item.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                    item.type === 'video' ? 'bg-blue-100 text-blue-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                    {item.type === 'pdf' && <FileText className="w-6 h-6" />}
                                    {item.type === 'video' && <PlayCircle className="w-6 h-6" />}
                                    {item.type === 'link' && <Link className="w-6 h-6" />}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#e39622] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                                    {item.description || 'No description available for this learning resource.'}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#e39622] hover:bg-[#c9831d] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/10 text-sm"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    Open Resource
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <LayoutGrid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No materials found</h3>
                    <p className="text-slate-500">Check back later for more student resources.</p>
                </div>
            )}
        </div>
    );
}

export default StudentResources;