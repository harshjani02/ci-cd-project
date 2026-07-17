import React, { useState, useRef, useEffect, useContext } from "react";
import { CheckSquare, CircleUser, UserCog, LogOut, LogIn } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { taskContext } from "../App";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userName, userEmail, isGuest } = useContext(taskContext);

  useEffect(() => {
    const handler = (e) => {
      if (menuref.current && !menuref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setMenuOpen(false);
    localStorage.removeItem("token");
    // Reload so isGuest recalculates from localStorage
    window.location.href = "/";
  };

  return (
    <div className="fixed top-0 w-full z-30 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-700/60 shadow-sm">
      <nav className="flex justify-between items-center h-14 px-4 lg:px-6 lg:ml-72">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <CheckSquare size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight">
            TaskManager
          </span>
        </NavLink>

        {/* Right side */}
        {isGuest ? (
          // Guest: show Sign In + Sign Up
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login", { state: { from: location } })}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              onClick={() => navigate("/signUp")}
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </div>
        ) : (
          // Authenticated: show profile dropdown
          <div ref={menuref} className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <CircleUser size={26} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute top-12 right-0 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <UserCog size={16} /> Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
