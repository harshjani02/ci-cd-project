import React, { useContext, useState, useEffect } from "react";
import { taskContext } from "../App";
import { ListFilter, Lock } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import TaskCard from "./TaskCard";

const AllTasks = () => {
  const { tasks, error, loading, taskToEdit, setTaskToEdit, open, setOpen, isGuest } = useContext(taskContext);
  const [filteredTask, setFilteredTask] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const base = filter ? tasks.filter((t) => t.priority === filter) : tasks;
    setFilteredTask([...base].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)));
  }, [filter, tasks]);

  if (loading) return <LoadingState />;
  if (error) return <div className="p-4 text-red-500 text-sm">{error}</div>;

  return (
    <div>
      <TaskListHeader title="All Tasks" filter={filter} setFilter={setFilter} count={filteredTask.length} />
      {isGuest
        ? <GuestEmptyState />
        : tasks.length === 0
          ? <EmptyState message="No tasks yet. Click 'Add Task' to get started." />
          : <ul className="space-y-3">{filteredTask.map((task) => <TaskCard key={task._id} task={task} />)}</ul>
      }
      <EditDialog open={open} setOpen={setOpen} taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />
      <DeleteTask />
    </div>
  );
};

// ─── Shared helpers (used by CompletedTasks & PendingTasks too) ───────────────

export const TaskListHeader = ({ title, filter, setFilter, count }) => (
  <div className="flex justify-between items-center mb-5">
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">
        {count} task{count !== 1 ? "s" : ""}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <ListFilter size={15} className="text-gray-400" />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="text-xs font-medium border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  </div>
);

export const GuestEmptyState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-3">
        <Lock size={22} className="text-indigo-400 dark:text-indigo-500" />
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your tasks will appear here</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 max-w-xs">
        Sign in to create, manage, and track all your tasks in one place.
      </p>
      <button
        onClick={() => navigate("/login", { state: { from: location } })}
        className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors"
      >
        Sign in to get started
      </button>
    </div>
  );
};

export const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
      <ListFilter size={22} className="text-gray-300 dark:text-gray-600" />
    </div>
    <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
  </div>
);

export const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 dark:text-gray-500">Loading tasks...</p>
    </div>
  </div>
);

export const EditDialog = ({ open, setOpen, taskToEdit }) => (
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-100 dark:border-slate-700">
        <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-white mb-1">Edit Task</Dialog.Title>
        <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Update the details of your task.
        </Dialog.Description>
        {taskToEdit && <EditTask setOpen={setOpen} taskToEdit={taskToEdit} />}
        <Dialog.Close
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <Plus size={20} className="rotate-45" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default AllTasks;
