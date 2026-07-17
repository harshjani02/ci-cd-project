import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { taskContext } from "../App";

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
const labelCls = "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide";

const AddTask = ({ setOpen }) => {
  const { setTasks, setPendingTasks, setCompletedTasks } = useContext(taskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const url = "https://task-manager-backend-srzi.onrender.com";

  // Manually insert \n at cursor position so Radix Dialog cannot intercept Enter
  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const el = textareaRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newValue = description.substring(0, start) + "\n" + description.substring(end);
      setDescription(newValue);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        el.selectionStart = start + 1;
        el.selectionEnd = start + 1;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!title || !description) {
      toast.error("Please fill all fields", { autoClose: 1000 });
      setSubmitting(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) { setSubmitting(false); return; }

    try {
      const response = await axios.post(url + "/api/tasks", { title, description, priority, dueDate, completed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpen(false);
      setSubmitting(false);
      const newTask = response.data.task;
      setTasks((prev) => [...prev, newTask]);
      if (newTask.completed) setCompletedTasks((prev) => [...prev, newTask]);
      else setPendingTasks((prev) => [...prev, newTask]);
      toast.success("Task Added!", { autoClose: 1000 });
      setTitle(""); setDescription(""); setPriority("Low"); setDueDate(""); setCompleted(false);
    } catch (error) {
      toast.error("Failed to add task", { autoClose: 1000 });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleDescriptionKeyDown}
          rows={5}
          placeholder="Describe the task..."
          className={`${inputCls} resize-y`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Status</label>
        <div className="flex gap-3">
          {[{ val: false, label: "Pending" }, { val: true, label: "Completed" }].map(({ val, label }) => (
            <label key={label} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${completed === val ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400" : "border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
              <input type="radio" className="sr-only" checked={completed === val} onChange={() => setCompleted(val)} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default AddTask;
