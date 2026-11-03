import React, { useState, useEffect } from 'react';
import { X, Upload, Link, PlayCircle, FileText } from 'lucide-react';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';

function AddResourceModal({ onClose, onSuccess, editData }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'link',
        url: '',
        audience: []
    });

    // Sync formData with editData when the modal opens for editing
    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || '',
                description: editData.description || '',
                type: editData.type || 'link',
                url: editData.url || '',
                audience: editData.audience || []
            });
        }
    }, [editData]);

    const toggleAudience = (role) => {
        setFormData(prev => ({
            ...prev,
            audience: prev.audience.includes(role)
                ? prev.audience.filter(r => r !== role)
                : [...prev.audience, role]
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.audience.length === 0) {
        return toast.error("Please select at least one target audience");
    }

    setLoading(true);
    try {
        if (editData?._id) {
            // Destructure to separate _id from the rest of the data
            // updateData will contain everything EXCEPT the _id
            const { _id, ...updateData } = formData; 
            
            await API.put(`/resources/${editData._id}`, updateData);
            toast.success('Resource updated successfully!');
        } else {
            await API.post('/resources', formData);
            toast.success('Resource added successfully!');
        }
        onSuccess();
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {editData ? 'Edit Resource' : 'Add New Resource'}
                        </h2>
                        <p className="text-xs text-slate-500">Share knowledge with the SandBox community</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resource Title</label>
                        <input 
                            type="text" required
                            placeholder="e.g. MERN Stack Roadmap"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#e39622] dark:text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Type and Target Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resource Type</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="link">Website Link</option>
                                <option value="pdf">PDF Document</option>
                                <option value="video">Video URL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Audience</label>
                            <div className="flex gap-2 pt-1">
                                {['student', 'startup'].map(role => (
                                    <button
                                        key={role} type="button"
                                        onClick={() => toggleAudience(role)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            formData.audience.includes(role)
                                                ? 'bg-[#e39622] text-white shadow-lg shadow-orange-500/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resource Link (URL)</label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="url" required
                                placeholder="https://example.com/resource"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#e39622] dark:text-white"
                                value={formData.url}
                                onChange={(e) => setFormData({...formData, url: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Short Description</label>
                        <textarea 
                            rows="3"
                            placeholder="What is this resource about?"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#e39622] dark:text-white resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button 
                            type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-[#e39622] hover:bg-[#c9831d] text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            {loading ? "Saving..." : (editData ? "Update Resource" : "Add Resource")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddResourceModal;