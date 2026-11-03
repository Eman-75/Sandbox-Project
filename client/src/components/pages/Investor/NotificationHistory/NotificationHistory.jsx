import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import {
    Bell, CheckCircle2, Clock, X, TrendingUp,
    MessageSquare, FileText, Zap, Info, UserPlus, Check, XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../../../api/axios";

const NotificationHistory = () => {
    const [allNotifications, setAllNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const { axios } = useContext(AuthContext);


    const getIconData = (type) => {
        switch (type) {
            case 'investment': return { icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' };
            case 'message': return { icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
            case 'document': return { icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
            case 'milestone': return { icon: Zap, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' };
            case 'connection': return { icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' };
            default: return { icon: Info, color: 'text-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' };
        }
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/notifications/history");
            setAllNotifications(res.data);
        } catch (err) {
            console.error("Error fetching notifications", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHistory();
    }, [axios]);

    // Updated Filter Logic
    const filteredNotifications = allNotifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return n.unread === true;
        if (filter === 'message') return n.type === 'message';
        if (filter === 'milestone') return n.type === 'milestone';
        if (filter === 'connection') return n.type === 'connection';
        return true;
    });

    const unreadCount = allNotifications.filter(n => n.unread).length;

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            setAllNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, unread: false } : n)
            );
            toast.success("Marked as read");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put("/notifications/mark-all-read");
            setAllNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            toast.success("All caught up!");
        } catch (err) {
            toast.error("Failed to mark all as read");
        }
    };

    const deleteNotification = async (id) => {
        try {
            // This calls your backend delete route
            await axios.delete(`/api/notifications/${id}`);

            // This updates the UI instantly by filtering out the deleted ID
            setAllNotifications(prev => prev.filter(n => n._id !== id));

            toast.success("Notification removed", {
                style: {
                    borderRadius: '10px',
                    background: '#334155',
                    color: '#fff',
                },
            });
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Could not delete notification");
        }
    };

    const handleAcceptConnection = async (notif) => {
        try {
            await API.put('/connections/accept', {
                connectionId: notif.connectionId
            });
            
            setAllNotifications(prev =>
                prev.map(n => n._id === notif._id ? { 
                    ...n, 
                    unread: false,
                    connectionId: { ...n.connectionId, status: 'accepted' }
                } : n)
            );
            
            toast.success('Connection accepted!');
        } catch (err) {
            console.error('Accept connection error:', err);
            toast.error(err.response?.data?.message || 'Failed to accept connection');
        }
    };

    const handleRejectConnection = async (notif) => {
        try {
            await API.put('/connections/reject', {
                connectionId: notif.connectionId
            });
            
            setAllNotifications(prev => prev.filter(n => n._id !== notif._id));
            toast.success('Connection rejected');
        } catch (err) {
            console.error('Reject connection error:', err);
            toast.error(err.response?.data?.message || 'Failed to reject connection');
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Stay updated with your activities and project milestones
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filter Tabs with your requested Category Names */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'message', label: 'Messages' },
                    { id: 'connection', label: 'Connections' },
                    { id: 'milestone', label: 'Milestones' },
                ].map((opt) => {
                    // Keep calculating count for unread
                    const count = opt.id === 'unread' ? unreadCount : 0;

                    return (
                        <button
                            key={opt.id}
                            onClick={() => setFilter(opt.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${filter === opt.id
                                    ? 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {opt.label}
                            {/* Only render the badge if it's the 'unread' tab and count > 0 */}
                            {opt.id === 'unread' && count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === opt.id ? 'bg-white/20' : 'bg-orange-100 dark:bg-orange-900/30 text-[#e39622]'
                                    }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Main List */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center animate-pulse text-slate-400">Loading your history...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">No notifications in {filter}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredNotifications.map((notif) => {
                            const { icon: Icon, color, bgColor } = getIconData(notif.type);
                            return (
                                <div
                                    key={notif._id}
                                    className={`p-5 md:p-6 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50 ${notif.unread ? 'bg-yellow-100/50 dark:bg-orange-900/5 border-l-4 border-l-[#e39622]' : 'border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl shrink-0 ${bgColor}`}>
                                            <Icon className={`w-6 h-6 ${color}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`text-slate-900 dark:text-white truncate ${notif.unread ? 'font-bold' : 'font-semibold'}`}>
                                                            {notif.title}
                                                        </h3>
                                                        {notif.unread && <span className="ml-2 w-2 h-2 bg-[#e39622] rounded-full" />}
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 ml-4 shrink-0">
                                                    {notif.unread && (
                                                        <button
                                                            onClick={() => markAsRead(notif._id)}
                                                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notif._id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center gap-3 mt-3">
                                                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-8 ml-4">
                                                    <div>{notif.type || 'General'}</div>

                                                    {/* Connection Request Action Buttons */}
                                                    {notif.type === 'connection' && notif.connectionId && notif.connectionId.status === 'pending' && (
                                                        <div className="flex items-center gap-2 ml-auto">
                                                            <button
                                                                onClick={() => handleAcceptConnection(notif)}
                                                                className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                                title="Accept connection"
                                                            >
                                                                <Check className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectConnection(notif)}
                                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                title="Reject connection"
                                                            >
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationHistory;