import { NavLink } from "react-router-dom";
import { ChevronDown, LogOut, Zap, ZapIcon, X } from "lucide-react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/SandBox logo.png';
import { AuthContext } from "../../../context/AuthContext";


function Sidebar({ isOpen, setIsOpen, menu = [], role }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  const { authUser, logout } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ✅ GUARD MUST BE INSIDE FUNCTION
  if (!menu || menu.length === 0) {
    return (
      <div
        className={`${isOpen ? "w-72" : "w-20"} bg-black text-white p-4`}
      >
        {isOpen && <p>No menu available</p>}
      </div>
    );
  }

  return (
    <div
      className={`${isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20"} fixed lg:relative inset-y-0 left-0 z-50 h-screen flex flex-col bg-black text-white transition-all`}
    >
      {/* LOGO */}
      <div className="relative flex items-center space-x-3 p-6 border-b border-slate-200/50">
        <div className="">
          <img src={Logo} alt="SandBox Logo" className="w-13 h-13 object-contain" />
        </div>
        {isOpen && (
          <div className="text-xl font-bold text-slate-100 dark:text-white">
            <h1>Sand Box</h1>
            <p className="text-xs text-slate-200 dark:text-slate-400">{role} Panel</p>
          </div>
        )}
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute right-4 top-4 lg:hidden p-2 rounded-lg hover:bg-gray-800 text-white/70"
          >
            <X className="w-6 h-6" />
          </button>
        )}

      </div>


      {/* MENU */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <div key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-xl ${isActive ? "bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white font-medium shadow-lg shadow-orange-500/30" : "text-white/70 font-medium hover:bg-gray-800"
                }`
              }
              onClick={() => item.children && setExpanded(item.path)}
            >
              <item.icon className="w-5 h-5" />
              {isOpen && <span className="ml-5">{item.label}</span>}
              {isOpen && item.children && (
                <ChevronDown className="ml-auto" />
              )}
            </NavLink>

            {isOpen &&
              expanded === item.path &&
              item.children && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className="block p-2 text-sm rounded hover:bg-gray-700"
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>

      {/* User Profile*/}
      {isOpen && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            {/* Dynamic Image Logic */}
            {authUser?.profilePicture ? (
              <img
                src={authUser.profilePicture.startsWith('http')
                  ? authUser.profilePicture
                  : `${BASE_URL}/${authUser.profilePicture.replace(/\\/g, '/')}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full ring-2 ring-orange-500 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center ring-2 ring-orange-500">
                <span className="text-orange-700 font-bold text-xs">
                  {localStorage.getItem("name")?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{localStorage.getItem("name") || "User"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{role}</p>
              </div>
            </div>
          </div>
          <button onClick={() => {
            logout();
            navigate('/');
          }} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

    </div>
  );
}

export default Sidebar;
