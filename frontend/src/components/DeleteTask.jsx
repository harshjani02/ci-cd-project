import React, { useContext } from "react";
import { taskContext } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { Trash2 } from "lucide-react";

const DeleteTask = () => {
  const { setTasks, setPendingTasks, setCompletedTasks, confirmDelete, setConfirmDelete, taskToDelete, setTaskToDelete } = useContext(taskContext);
  const url = "https://task-manager-backend-srzi.onrender.com";

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first.");
    if (!taskToDelete) return;

    try {
      const taskId = taskToDelete._id;
      await axios.delete(`${url}/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Task deleted!", { autoClose: 1000 });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setPendingTasks((prev) => prev.filter((t) => t._id !== taskId));
      setCompletedTasks((prev) => prev.filter((t) => t._id !== taskId));
      setConfirmDelete(false);
      setTaskToDelete([]);
    } catch (error) {
      toast.error("Error while deleting task!");
      setConfirmDelete(false);
      setTaskToDelete(null);
    }
  };

  if (!confirmDelete || !taskToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6 w-[90vw] max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <Trash2 size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white">Delete Task</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Are you sure you want to delete:</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white bg-gray-50 dark:bg-slate-800 px-3 py-2 rounded-lg mb-5 truncate">
          "{taskToDelete?.title}"
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => { setConfirmDelete(false); setTaskToDelete(null); }}
            className="flex-1 py-2.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
