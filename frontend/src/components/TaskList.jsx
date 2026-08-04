import { useEffect } from 'react';
import { isOverdue, handleDeleteTask, handleUpdateTask, refreshTasks } from '../utils/dashboard';
import { TfiPencil } from 'react-icons/tfi';

const TaskList = ({ tasks, setTasks, loading, setLoading, onEditTask }) => {

    // fetch tasks from backend on mount if tasks not yet loaded
    useEffect(() => {
        refreshTasks(setTasks, setLoading);
    }, [setTasks, setLoading]);

    const taskList = Array.isArray(tasks) ? tasks : [];

    console.log(taskList);


    const statusStyles = {
  pending: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",

  // Light green background + red text
  in_progress:
    "bg-green-100 text-red-600 dark:bg-green-400 dark:text-red-400 font-bold",

  overdue:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};


    return (
        <section className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-lg shadow-slate-300/70 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Your Tasks</h3>
                    <p className="mt-1 text-sm text-slate-400">A quick view of what needs attention.</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-slate-100">
                    {taskList.length} tasks
                </span>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300">
                    Loading tasks...
                </div>
            ) : taskList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-300">
                    No tasks yet. Create your first one to get started.
                </div>
            ) : (
                <div id="tasklist" className="space-y-3 max-h-[calc(1*28rem)] overflow-y-auto hide-scrollbar pr-2">
                    {taskList.map((task) => {
 const overdue = isOverdue(task.dueDate, task.status);
const taskId = task.id || task._id;

let currentStatus = task.status;

// Only pending tasks become overdue
if (task.status === "pending" && overdue) {
  currentStatus = "overdue";
}

const statusLabel = {
  pending: "Pending",
  in_progress: "Working",
  completed: "Completed",
  overdue: "Overdue",
};

const badgeStyle =
  statusStyles[currentStatus] ||
  "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";

  return (
    <div key={taskId} className="rounded-2xl border border-white/10 bg-slate-800/90 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-lg font-semibold text-white truncate">{task.title}</h4>
          <p className="mt-2 text-sm text-slate-300 line-clamp-3">
            {task.description || "No description added."}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${badgeStyle}`}
        >
          {statusLabel[currentStatus]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handleUpdateTask(
                taskId,
                { status: task.status === "completed" ? "pending" : "completed" },
                setTasks,
                setLoading
              )
            }
            className="rounded-full bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-200 transition hover:bg-blue-500/30"
          >
            {task.status === "completed" ? "Mark Pending" : "Mark Complete"}
          </button>

          <button
            type="button"
            onClick={() => onEditTask && onEditTask(task)}
            title="Edit Task"
            className="flex items-center justify-center rounded-full bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-200 transition hover:bg-amber-500/30"
          >
            <TfiPencil />
          </button>

          <button
            type="button"
            onClick={() => handleDeleteTask(taskId, setTasks, setLoading)}
            className="rounded-full bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-200 transition hover:bg-rose-500/30"
          >
            Delete
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="rounded-full bg-white/10 px-2.5 py-1">{task.priority}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
          </span>
        </div>
      </div>
    </div>
  );
})}
                </div>
            )}
        </section>
    );
};

export default TaskList;