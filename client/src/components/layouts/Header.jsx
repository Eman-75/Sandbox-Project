// import React from "react";
// import Sidebar from "./Sidebar";
// import { Bell, ChevronDown, Filter, Menu, Plus, Search, Settings, Sun } from "lucide-react";

// function Header({sidebarCollapsed, onToggleSidebar, role}) {
//     return <div className="bg-[#fffcf7] dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
//         <div className="flex items-center justify-between">
//             {/* Left Section */}
//             <div className="flex items-center space-x-4">
//                 <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={onToggleSidebar}> 
//                     <Menu className="w-5 h-5" />
//                 </button>

//                 <div className="hidden md:block">
//                     <h1 className="text-2xl font-black text-slate-800 dark:text-white">
//                         Dashboard
//                     </h1>
//                     <p>Welcome back, {localStorage.getItem("name") || "User"}!</p>
//                 </div>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center space-x-3">

//                 {/* Toggle
//                 <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                     <Sun className="w-5 h-5" />
//                 </button> */}

//                 {/* Notification */}
//                 <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                     <Bell className="w-5 h-5" />
//                     <span className="absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
//                 </button>

//                 {/* Settings */}
//                 <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                     <Settings className="w-5 h-5" />
//                 </button>

//                 {/* Profile */}
//                 <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">
//                     <img src="https://images.pexels.com/photos/1625380/pexels-photo-1625380.jpeg?cs=srgb&dl=pexels-edgar-mr-photography-1625380.jpg&fm=jpg" alt="" className="w-8 h-8 rounded-full ring-2 ring-blue-500" />
//                     <div className="hidden md:block">
//                         <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{localStorage.getItem("name") || "User"}</p>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
//                     </div>
//                     <ChevronDown className="w-4 h-4 text-slate-400" />
//                 </div>
//             </div>
//         </div>
//     </div>;
// }

// export default Header;  


import React, { useState, useEffect, useContext } from "react";
import { Bell, ChevronDown, Menu, Settings, X, Check } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext"; // Adjust path
import toast from "react-hot-toast";

function Header({ onToggleSidebar, role }) {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    // Inside Header component
    const { axios, socket, authUser } = useContext(AuthContext); // Use axios from context

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!authUser) return; // Wait until user is authenticated
            try {
                // This will now use the "Authorization" header set in AuthProvider
                const res = await axios.get("/notifications");
                setNotifications(res.data);
            } catch (err) {
                console.error("Error fetching notifications", err);
            }
        };
        fetchNotifications();
    }, [authUser, axios]); // Trigger when user logs in

    // 2. Listen for Real-Time Toast
    useEffect(() => {
        if (socket) {
            socket.on("new_notification", (data) => {
                setNotifications((prev) => [data, ...prev]);
                toast.success(`${data.title}: ${data.message}`);
            });
        }
        return () => socket?.off("new_notification");
    }, [socket]);

    const unreadCount = notifications.filter(n => n.unread).length;

    // 3. Mark all as read when opening dropdown
    const toggleNotifications = async () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown && unreadCount > 0) {
            try {
                await axios.put("/notifications/mark-read");
                setNotifications(notifications.map(n => ({ ...n, unread: false })));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await axios.put("/notifications/mark-all-read");
            if (res.data.success) {
                // Update local state so the UI changes immediately
                setNotifications(notifications.map(n => ({ ...n, unread: false })));
                toast.success("All notifications marked as read");
            }
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    return (
        <div className="bg-[#fffcf7] dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 relative z-60">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={onToggleSidebar} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="hidden md:block">
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Dashboard</h1>
                        <p className="text-sm text-slate-600">Welcome back, {localStorage.getItem("name") || "User"}!</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Notification Section */}
                    <div className="relative">
                        <button
                            onClick={toggleNotifications}
                            className={`p-2.5 rounded-xl transition-all ${showDropdown ? 'bg-slate-100 dark:bg-slate-800 text-yellow-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'}`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-5 h-5 bg-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-4 border-b border-slate-400 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                                        <span className="bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Check className="w-4 h-4 text-yellow-600 cursor-pointer" onClick={markAllAsRead} />
                                        <X className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setShowDropdown(false)} />
                                    </div>
                                </div>

                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.filter(n => n.unread).length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">No notifications yet</div>
                                    ) : (
                                        notifications.filter(notif => notif.unread).map((notif) => (
                                            <div key={notif._id} className={`flex items-start space-x-3 p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative ${notif.unread ? 'bg-slate-50/30' : ''}`}>
                                                {notif.unread && <div className="absolute left-0 top-0 bottom-0 w-1" />}
                                                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                                    <Bell className="w-5 h-5 text-yellow-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{notif.title}</p>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                        <img src="https://images.pexels.com/photos/1625380/pexels-photo-1625380.jpeg?auto=compress&cs=tinysrgb&w=150" alt="profile" className="w-8 h-8 rounded-full ring-2 ring-blue-500" />
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{localStorage.getItem("name") || "User"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div> */}
                    <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700 pr-6">
                        {/* Profile Image Logic */}
                        {authUser?.profilePicture ? (
                            <img
                                src={authUser.profilePicture.startsWith('http')
                                    ? authUser.profilePicture
                                    : `${BASE_URL}/${authUser.profilePicture}`}
                                alt="profile"
                                className="w-9 h-9 rounded-full ring-2 ring-yellow-500 object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center ring-2 ring-yellow-500">
                                <span className="text-yellow-700 font-bold text-xs">
                                    {getInitials(localStorage.getItem("name"))}
                                </span>
                            </div>
                        )}

                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-slate-800 dark:text-white">
                                {localStorage.getItem("name") || "User"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;