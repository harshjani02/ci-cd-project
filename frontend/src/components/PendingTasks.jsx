import React, { useContext, useState, useEffect } from "react";
import { taskContext } from "../App";
import DeleteTask from "./DeleteTask";
import TaskCard from "./TaskCard";
import { TaskListHeader, EmptyState, LoadingState, EditDialog, GuestEmptyState } from "./AllTasks";

const PendingTasks = () => {
  const { pendingTasks, error, loading, taskToEdit, setTaskToEdit, open, setOpen, isGuest } = useContext(taskContext);
  const [filteredTask, setFilteredTask] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setFilteredTask(filter ? pendingTasks.filter((t) => t.priority === filter) : pendingTasks);
  }, [filter, pendingTasks]);

  if (loading) return <LoadingState />;
  if (error) return <div className="p-4 text-red-500 text-sm">{error}</div>;

  return (
    <div>
      <TaskListHeader title="Pending Tasks" filter={filter} setFilter={setFilter} count={filteredTask.length} />
      {isGuest
        ? <GuestEmptyState />
        : pendingTasks.length === 0
          ? <EmptyState message="No pending tasks. You're all caught up!" />
          : <ul className="space-y-3">{filteredTask.map((task) => <TaskCard key={task._id} task={task} />)}</ul>
      }
      <EditDialog open={open} setOpen={setOpen} taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />
      <DeleteTask />
    </div>
  );
};

export default PendingTasks;
