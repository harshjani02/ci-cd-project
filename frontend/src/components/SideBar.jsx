import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { CircleCheckBig, Clock, LayoutDashboard, Menu, X, LogIn } from "lucide-react";
import { taskContext } from "../App";
import userImg from "../assets/userImg.png";
import ProfilePic from "./Profile/ProfilePic";

const SideBar = () => {
  const {
    userName, image, setOpenImage,
    theme, setTheme,
    tasks, completedTasks, pendingTasks,
    isGuest,
  } = useContext(taskContext);

  const [hamburger, setHamburger] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setTheme(saved || "");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "");
    }
  }, [theme]);

  const total = tasks.length;
  const completed = completedTasks.length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const navLinks = [
    { to: "/allTasks",       label: "All Tasks",  icon: LayoutDashboard, activeColor: "bg-indigo-600 text-white shadow-sm" },
    { to: "/completedTasks", label: "Completed",  icon: CircleCheckBig,  activeColor: "bg-emerald-600 text-white shadow-sm" },
    { to: "/pendingTasks",   label: "Pending",    icon: Clock,           activeColor: "bg-amber-500 text-white shadow-sm" },
  ];

  return (
    <>
      {/* Hamburger */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setHamburger((p) => !p)}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700"
        >
          {hamburger
            ? <X size={22} className="text-gray-700 dark:text-gray-300" />
            : <Menu size={22} className="text-gray-700 dark:text-gray-300" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {hamburger && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setHamburger(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[72%] md:w-[45%] lg:w-72
          bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700/60
          z-40 flex flex-col pt-14 transition-transform duration-300
          ${hamburger ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Profile section */}
        <div className="flex flex-col items-center px-5 py-7 border-b border-gray-100 dark:border-slate-700/60">
          {isGuest ? (
            // Guest profile placeholder
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center">
                <LogIn size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-500 dark:text-gray-400">Guest User</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Not signed in</p>
              </div>
              <button
                onClick={() => navigate("/login", { state: { from: location } })}
                className="w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 px-3 py-2 rounded-lg transition-colors"
              >
                Sign in to your account
              </button>
            </div>
          ) : (
            // Authenticated profile
            <div className="flex flex-col items-center">
              <div className="relative p-1 rounded-full border-2 border-gray-900 dark:border-white">
                <img
                  src={image || userImg}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover cursor-pointer shadow-sm"
                  onClick={() => setOpenImage(true)}
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </div>
              <p className="mt-3 text-base font-bold text-gray-800 dark:text-white tracking-tight">
                {userName || "User"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">Task Manager</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navLinks.map(({ to, label, icon: Icon, activeColor }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setHamburger(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? activeColor
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Progress — only shown when authenticated */}
        {!isGuest && (
          <div className="mx-3 mt-1 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Progress
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{total}</p>
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">Total</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completed}</p>
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">Done</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{pendingTasks.length}</p>
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">Pending</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Completion</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Guest progress placeholder */}
        {isGuest && (
          <div className="mx-3 mt-1 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Progress
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Sign in to track your task completion and progress.
            </p>
          </div>
        )}

        {/* Theme toggle */}
        <div className="mt-auto px-4 py-4 border-t border-gray-100 dark:border-slate-700/60">
          <button
            onClick={() => setTheme((prev) => (prev === "" ? "dark" : ""))}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <div className="relative w-10 h-5 rounded-full bg-gray-300 dark:bg-indigo-600 transition-colors duration-300">
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                  theme === "dark" ? "left-[calc(100%-1.125rem)]" : "left-0.5"
                }`}
              />
            </div>
          </button>
        </div>
      </aside>

      <ProfilePic />
    </>
  );
};

export default SideBar;
