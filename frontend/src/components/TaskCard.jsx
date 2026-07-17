import React, { useContext } from "react";
import { SquarePen, Trash2, Calendar, Lock, Pin } from "lucide-react";
import { taskContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const priorityConfig = {
  High:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const statusConfig = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const url = "https://task-manager-backend-srzi.onrender.com";

const TaskCard = ({ task }) => {
  const {
    setTaskToEdit, setOpen,
    setConfirmDelete, setTaskToDelete,
    setTasks, setCompletedTasks, setPendingTasks,
    isGuest,
  } = useContext(taskContext);

  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = () => navigate("/login", { state: { from: location } });

  const handleEdit = () => {
    if (isGuest) { requireAuth(); return; }
    setTaskToEdit(task);
    setOpen(true);
  };

  const handleDelete = () => {
    if (isGuest) { requireAuth(); return; }
    setTaskToDelete(task);
    setConfirmDelete(true);
  };

  const handlePin = async () => {
    if (isGuest) { requireAuth(); return; }
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(`${url}/api/tasks/${task._id}/pin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = res.data.task;
      // Update all three lists in context
      const replacer = (prev) => prev.map((t) => t._id === updated._id ? updated : t);
      setTasks(replacer);
      setCompletedTasks(replacer);
      setPendingTasks(replacer);
      toast.success(updated.pinned ? "Task pinned!" : "Task unpinned", { autoClose: 800 });
    } catch {
      toast.error("Failed to update pin", { autoClose: 1000 });
    }
  };

  return (
    <li className={`group bg-white dark:bg-slate-900 border rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
      task.pinned
        ? "border-indigo-300 dark:border-indigo-700/60"
        : "border-gray-100 dark:border-slate-700/60"
    }`}>
      {/* Title row */}
      <div className="flex justify-between items-start gap-4 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {task.pinned && (
            <Pin size={13} className="text-indigo-500 dark:text-indigo-400 shrink-0 fill-indigo-500 dark:fill-indigo-400" />
          )}
          <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-snug tracking-tight truncate">
            {task.title}
          </h2>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full leading-none ${
          task.completed ? statusConfig.completed : statusConfig.pending
        }`}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
        {task.description.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < task.description.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md leading-none ${
            priorityConfig[task.priority] || priorityConfig.Low
          }`}>
            {task.priority}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={11} />
            {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Pin button */}
          <button
            onClick={handlePin}
            className={`p-2 rounded-lg transition-colors ${
              task.pinned
                ? "text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                : "text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
            title={task.pinned ? "Unpin task" : "Pin task"}
          >
            <Pin size={14} className={task.pinned ? "fill-indigo-500 dark:fill-indigo-400" : ""} />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title={isGuest ? "Sign in to delete tasks" : "Delete"}
          >
            {isGuest ? <Lock size={14} className="text-gray-300 dark:text-gray-600" /> : <Trash2 size={15} />}
          </button>
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            title={isGuest ? "Sign in to edit tasks" : "Edit"}
          >
            {isGuest ? <Lock size={14} className="text-gray-300 dark:text-gray-600" /> : <SquarePen size={15} />}
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskCard;
