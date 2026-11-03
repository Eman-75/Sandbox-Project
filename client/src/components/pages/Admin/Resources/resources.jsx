import React, { useEffect, useState } from 'react';
import {
    FileText, Link, PlayCircle, Plus, Search,
    Filter, Eye, X, Globe, Download, LayoutGrid,
    Edit,
    Link2,
    LinkIcon,
    EditIcon,
    TrashIcon
} from 'lucide-react';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import AddResourceModal from './AddResourceModal'; // We'll create this next

function Resources() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pdf', 'link', 'video'
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAudience, setSelectedAudience] = useState('all');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await API.get('/resources');
            // Assuming res.data contains an array of resources
            const data = res.data.resources || [];
            setItems(data);
            setFilteredItems(data);
        } catch (err) {
            console.error('Resource fetch error', err);
            toast.error('Failed to load library');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;

        try {
            await API.delete(`/resources/${id}`);
            toast.success("Resource removed");
            fetchResources(); // Refresh the list
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete");
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

        if (selectedAudience !== 'all') {
            result = result.filter(item => item.audience?.includes(selectedAudience));
        }

        if (searchQuery) {
            result = result.filter(item =>
                (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(result);
    }, [activeTab, searchQuery, items, selectedAudience]);

    if (loading) return <div className="p-10 text-center text-[#e39622] font-bold animate-pulse text-xl">Syncing Knowledge Base...</div>;

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resource Hub</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Curated tools and guides for the SandBox ecosystem</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#e39622] outline-none w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-[#e39622] hover:bg-[#c9831d] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
                    >
                        <Plus className="w-5 h-5" /> Add Resource
                    </button>
                </div>
            </div>

            {/* Navigation & Sub-filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm overflow-x-auto w-full sm:w-auto">
                    {['all', 'pdf', 'link', 'video'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tight whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#e39622] text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}s
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedAudience}
                        onChange={(e) => setSelectedAudience(e.target.value)}
                        className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none flex-1 sm:flex-none"
                    >
                        <option value="all">All Audiences</option>
                        <option value="student">For Students</option>
                        <option value="startup">For Startups</option>
                    </select>
                </div>
            </div>

            {/* Content Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="flex flex-col gap-2 justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${item.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                    item.type === 'video' ? 'bg-blue-100 text-blue-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    {item.type === 'pdf' && <FileText className="w-6 h-6" />}
                                    {item.type === 'video' && <PlayCircle className="w-6 h-6" />}
                                    {item.type === 'link' && <Link className="w-6 h-6" />}
                                </div>
                                <div className="flex flex-wrap gap-1 justify-end">
                                    {item.audience?.map(aud => (
                                        <span key={aud} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter">
                                            {aud}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#e39622] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                    {item.description || 'No description available for this resource.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                                {/* Primary Action: Open (Takes 2/4 columns) */}
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    Open
                                </a>

                                {/* Secondary: Edit (Takes 1/4 column) */}
                                <button
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setIsAddModalOpen(true);
                                    }}
                                    className="col-span-1 flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                    title="Edit Resource"
                                >
                                    <EditIcon className="w-4 h-4" />
                                </button>

                                {/* Secondary: Delete (Takes 1/4 column) */}
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="col-span-1 flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800/50 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                    title="Delete Resource"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No resources found</h3>
                    <p className="text-slate-500">Try changing your filters or add a new resource to the library.</p>
                </div>
            )}

            {isAddModalOpen && (
                <AddResourceModal
                    editData={selectedItem} // Pass the item if we are editing
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setSelectedItem(null); // Clear selection on close
                    }}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        setSelectedItem(null);
                        fetchResources();
                    }}
                />
            )}

        </div>
    );
}

export default Resources;