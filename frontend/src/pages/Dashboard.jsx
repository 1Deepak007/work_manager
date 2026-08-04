import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ManageTasks from '../components/ManageTasks';
import TaskList from '../components/TaskList';
import { fetchTasks, isOverdue } from '../utils/dashboard';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // fetch tasks from backend
    useEffect(() => {
        fetchTasks(setTasks, setLoading).catch((error) => console.error(error));
    }, []);

    const handleSelectEditTask = (task) => {
        setTaskToEdit(task);
    };

    const handleCancelEdit = () => {
        setTaskToEdit(null);
        fetchTasks(setTasks, setLoading);
    };

    if (!Array.isArray(tasks)) {
        console.error('tasks is not an array');
        return null;
    }

    const overdueCount = tasks.filter((task) => isOverdue(task.dueDate, task.status)).length;

    return (
        <>
            <Navbar />
            <div className="min-h-screen from-slate-100 via-blue-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/80 backdrop-blur">
                        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                    Today’s focus
                                </p>
                                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Task Dashboard</h2>
                                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                                    Organize priorities, track deadlines, and stay productive from one clean workspace.
                                </p>
                            </div>

                            <div className="grid w-full gap-3 sm:grid-cols-5 lg:min-w-[430px]">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Total</p>
                                    <p className="mt-1 text-2xl font-semibold text-slate-900">{tasks.length}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Working</p>
                                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                                        {tasks.filter((task) => task.status === 'in_progress').length}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Pending</p>
                                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                                        {tasks.filter((task) => task.status === 'pending').length}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                                        {tasks.filter((task) => task.status === 'completed').length}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Overdue</p>
                                    <p className="mt-1 text-2xl font-semibold text-rose-600">{overdueCount}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <TaskList
                            tasks={tasks}
                            setTasks={setTasks}
                            loading={loading}
                            setLoading={setLoading}
                            onEditTask={handleSelectEditTask}
                        />
                        <ManageTasks
                            fetchTasks={fetchTasks}
                            taskToEdit={taskToEdit}
                            onCancelEdit={handleCancelEdit}
                            tasks={tasks}
                            setTasks={setTasks}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;