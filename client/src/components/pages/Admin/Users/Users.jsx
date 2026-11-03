import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, ArrowUpRight, ArrowDownRight, Search, Plus, Mail, Phone, MapPin, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import axios from "../../../../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    isVerified: false,
    password: '',
    confirmPassword: ''
  });

  // Function to clear form for a new user
  const handleAddClick = () => {
    setUserToEdit(null);
    setEditFormData({
      name: '', email: '', role: 'student', isVerified: false, password: '', confirmPassword: ''
    });
    setIsEditModalOpen(true);
  };

  // Function to open the modal and fill the inputs
  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role, isVerified: user.isVerified });
    setIsEditModalOpen(true);
  };

  // Function to save changes to MongoDB
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      if (userToEdit) {
        // EDIT MODE
        const response = await axios.patch(`/users/${userToEdit._id}`, editFormData);
        setUsers(users.map(u => u._id === userToEdit._id ? response.data : u));
      } else {
        // ADD MODE
        if (editFormData.password !== editFormData.confirmPassword) {
          return alert("Passwords match error");
        }

        const response = await axios.post(`/auth/register`, editFormData);

        // 1. Get the data from the response
        const newUser = response.data;

        // 2. SAFETY CHECK: Ensure the backend sent a valid object
        if (newUser && newUser._id) {
          // Add a temporary createdAt if the backend didn't provide one immediately
          // This prevents the 'calculateTrend' logic from crashing
          const finalUser = {
            ...newUser,
            createdAt: newUser.createdAt || new Date().toISOString()
          };

          setUsers(prev => [...prev, finalUser]);
        } else {
          // If the backend failed to send the user, refresh the whole list as a backup
          const refresh = await axios.get('/all-users');
          setUsers(refresh.data);
        }

        // Reset form
        setEditFormData({
          name: '', email: '', role: 'student', isVerified: false, password: '', confirmPassword: ''
        });
      }

      // Close Modal
      setIsEditModalOpen(false);
      setUserToEdit(null);

    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert("Operation failed. See console.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/all-users');
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const handleSelectUser = (userId) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };


  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const pendingUsers = users.filter(u => !u.isVerified).length;
  const activeUsers = verifiedUsers;

  const calculateTrend = (users, metric) => {
    if (!users || users.length === 0) {
      return {
        value: "0",
        change: "0%",
        trend: "down"
      };
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    const pendingUsers = users.filter(u => !u.isVerified).length;
    const newThisWeek = users.filter(u => new Date(u.createdAt) > weekAgo).length;
    const newLastWeek = users.filter(u => {
      const date = new Date(u.createdAt);
      return date <= weekAgo && date > twoWeeksAgo;
    }).length;

    const oldUsers = users.filter(u => new Date(u.createdAt) < weekAgo);
    const oldTotal = oldUsers.length;
    const oldVerified = oldUsers.filter(u => u.isVerified).length;
    const oldPending = oldUsers.filter(u => !u.isVerified).length;

    switch (metric) {
      case 'total':
        return {
          value: totalUsers.toString(),
          change: newThisWeek > 0 ? `+${newThisWeek} ` : `0`,
          trend: newThisWeek > 0 ? "up" : "down"
        };

      case 'verified':
        const currentRate = totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0;
        const oldRate = oldTotal > 0 ? (oldVerified / oldTotal) * 100 : 0;
        console.log('Verified - Current:', currentRate, 'Old:', oldRate);
        return {
          value: verifiedUsers.toString(),
          change: `${currentRate.toFixed(1)}%`,
          trend: currentRate > 0 ? "up" : "down"
        };

      case 'pending':
        const currentPendingRate = totalUsers > 0 ? (pendingUsers / totalUsers) * 100 : 0;
        const oldPendingRate = oldTotal > 0 ? (oldPending / oldTotal) * 100 : 0;
        console.log('Pending - Current:', currentPendingRate, 'Old:', oldPendingRate);
        return {
          value: pendingUsers.toString(),
          change: `${currentPendingRate.toFixed(1)}%`,
          trend: currentPendingRate <= oldPendingRate ? "up" : "down"
        };

      case 'new':
        let changeText = "";
        if (newLastWeek === 0 && newThisWeek > 0) {
          changeText = `+${newThisWeek}`;
        } else if (newLastWeek === 0 && newThisWeek === 0) {
          changeText = `0`;
        } else {
          const diff = ((newThisWeek - newLastWeek) / newLastWeek) * 100;
          changeText = diff >= 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
        }
        return {
          value: newThisWeek.toString(),
          change: changeText,
          trend: newThisWeek >= newLastWeek ? "up" : "down"
        };

      default:
        return {
          value: "0",
          change: "0%",
          trend: "down"
        };
    }
  };

  const userTrend = calculateTrend(users, 'createdAt');

  const totalStats = calculateTrend(users, 'total');
  const verifiedStats = calculateTrend(users, 'verified');
  const pendingStats = calculateTrend(users, 'pending');
  const newStats = calculateTrend(users, 'new');

  const dynamicStats = [
    {
      title: "Total Users",
      value: totalStats.value,
      change: totalStats.change,
      subText: "this week",
      trend: totalStats.trend,
      icon: UsersIcon,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/50",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Verified Users",
      value: verifiedStats.value,
      change: verifiedStats.change,
      subText: "Verification Rate",
      trend: verifiedStats.trend,
      icon: UsersIcon,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pending Users",
      value: pendingStats.value,
      change: pendingStats.change,
      subText: "Approval Backlog",
      trend: pendingStats.trend,
      icon: Clock,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "New This Week",
      value: newStats.value,
      change: newStats.change,
      subText: "vs last week",
      trend: newStats.trend,
      icon: Plus,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];


  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await axios.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));

        if (selectedUser === userId) {
          setSelectedUser(null);
        }
        console.log("User deleted from MongoDB");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Error: Could not delete user from database.");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (isVerified) => {
    return isVerified
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
      : "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30";
  };

  const getRoleColor = (role) => {
    const r = role ? role.toLowerCase() : "";
    switch (r) {
      case "investor":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30";
      case "startup":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30";
      case "student":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage and monitor all platform users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                  {stat.value}
                </p>
                <div className="flex items-center space-x-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                      }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{stat.subText}</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-all duration-300`}
              >
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                style={{
                  width: `${Math.min(
                    Math.max(
                      stat.title === "Verified Users" || stat.title === "Pending Users"
                        ? parseFloat(stat.change) || 0
                        : 50,
                      5
                    ),
                    100
                  )}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Add User Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="investor">Investor</option>
              <option value="startup">Startup</option>
              <option value="student">Student</option>
            </select>
            <button
              onClick={handleAddClick}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Phone
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Role
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Location
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Created At
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  className={`border-b border-slate-200/50 dark:border-slate-700/50 transition-colors cursor-pointer ${selectedUser === user._id
                    ? "bg-blue-50/50 dark:bg-blue-900/20"
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    }`}
                >
                  <td className={`p-4 text-sm font-semibold ${user.isSelected ? "text-slate-900" : "text-slate-900 dark:text-white"
                    }`}>
                    {user.name}
                  </td>
                  <td className={`p-4 text-sm ${user.isSelected ? "text-slate-900" : "text-slate-600 dark:text-slate-400"
                    }`}>
                    {user.email}
                  </td>
                  <td className={`p-4 text-sm ${user.isSelected ? "text-slate-900" : "text-slate-600 dark:text-slate-400"
                    }`}>
                    {user.phone || "N/A"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                        user.isVerified
                      )}`}
                    >
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={`p-4 text-sm ${user.isSelected ? "text-slate-900" : "text-slate-600 dark:text-slate-400"
                    }`}>
                    {user.location || "Not Specified"}
                  </td>
                  <td className={`p-4 text-sm ${user.isSelected ? "text-slate-900" : "text-slate-600 dark:text-slate-400"
                    }`}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(user); // This line is the key!
                        }}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{userToEdit ? 'Edit Profile' : 'Add New User'}</h2>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>

              {/* Role selection - only disabled if editing */}
              {/* Role selection - ONLY shows if ADDING a new user */}
              {!userToEdit && (
                <div>
                  <label className="block text-sm font-medium mb-1">Platform Role</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="startup">Startup</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>
              )}

              {/* New Password fields - only show if ADDING a user */}
              {!userToEdit && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                      onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm</label>
                    <input
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                      onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Status</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  value={editFormData.isVerified}
                  onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.value === "true" })}
                >
                  <option value="false">Pending</option>
                  <option value="true">Verified</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all"
                >
                  {userToEdit ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
}

export default Users;