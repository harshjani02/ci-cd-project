import React, { useState, useContext, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, ListChecks, CheckCircle2, Circle, TrendingUp, Lock } from "lucide-react";
import { taskContext } from "../App";
import AddTask from "./AddTask";
import SideBar from "./SideBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const {
    tasks, setTasks,
    pendingTasks, setPendingTasks,
    completedTasks, setCompletedTasks,
    loading, setLoading,
    setError, setUserName, setUserEmail, setImage,
    isGuest,
  } = useContext(taskContext);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const url = "https://task-manager-backend-srzi.onrender.com";

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }

    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(url + "/api/user/myDetails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUserName(res.data.user.name);
          setUserEmail(res.data.user.email);
          setImage(res.data.user?.imageUrl);
        }
      } catch {
        setError("Could not load user details.");
      }
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(url + "/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const fetched = res.data.tasks;
          setTasks(fetched);
          setCompletedTasks(fetched.filter((t) => t.completed));
          setPendingTasks(fetched.filter((t) => !t.completed));
        }
      } catch {
        setError("Could not load tasks.");
      }
      setLoading(false);
    };

    getUserDetails();
    fetchTasks();
  }, [isGuest]);

  const completionRate =
    tasks.length > 0
      ? ((completedTasks.length / tasks.length) * 100).toFixed(0)
      : "0";

  const stats = [
    { label: "Total Tasks",     value: loading ? "—" : tasks.length,           icon: ListChecks,   color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Completed",       value: loading ? "—" : completedTasks.length,  icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Pending",         value: loading ? "—" : pendingTasks.length,    icon: Circle,       color: "text-amber-500 dark:text-amber-400",    bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Completion Rate", value: loading ? "—" : `${completionRate}%`,   icon: TrendingUp,   color: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-50 dark:bg-violet-900/20" },
  ];

  const handleAddTask = () => {
    if (isGuest) {
      navigate("/login", { state: { from: location } });
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      <SideBar />

      <div className="lg:ml-72 w-full pt-14">
        {/* Guest banner */}
        {isGuest && (
          <div className="mx-4 lg:mx-6 mt-4 flex items-center justify-between gap-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Lock size={15} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                You're browsing as a guest. Sign in to create and manage your tasks.
              </p>
            </div>
            <button
              onClick={() => navigate("/login", { state: { from: location } })}
              className="shrink-0 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isGuest ? "Preview mode — sign in to manage tasks" : "Manage and track your tasks"}
              </p>
            </div>

            {/* Add Task — opens modal for auth, redirects to login for guest */}
            {isGuest ? (
              <button
                onClick={handleAddTask}
                title="Sign in to add tasks"
                className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer border border-dashed border-gray-300 dark:border-slate-600 hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                <Lock size={14} /> Add Task
              </button>
            ) : (
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900">
                    <Plus size={17} strokeWidth={2.5} /> Add Task
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40 backdrop-blur-sm" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-100 dark:border-slate-700">
                    <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                      New Task
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                      Fill in the details to create a new task.
                    </Dialog.Description>
                    <AddTask setOpen={setOpen} />
                    <Dialog.Close
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      aria-label="Close"
                    >
                      <Plus size={20} className="rotate-45" />
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-gray-100 dark:border-slate-700/60 shadow-sm"
              >
                <div className={`inline-flex p-1.5 rounded-lg ${bg} mb-2.5`}>
                  <Icon size={15} className={color} />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {isGuest ? "—" : value}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="px-4 lg:px-6 pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
