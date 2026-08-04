import AddTask from './AddTask';
import { RxCrossCircled } from "react-icons/rx";

const ManageTasks = ({ fetchTasks, taskToEdit, onCancelEdit, tasks, setTasks }) => {
    return (
        <div className="grid gap-6 w-full max-w-6xl min-w-auto">
            <section className="w-full max-w-4xl mx-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 sm:p-8">
                <div className="mb-6">
                    <div className="relative flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">
                            {taskToEdit ? 'Edit Task' : 'Add New Task'}
                        </h3>
                        {taskToEdit && onCancelEdit && (
                            <RxCrossCircled
                                onClick={onCancelEdit}
                                className="cursor-pointer text-slate-500 hover:text-slate-700 text-xl"
                                title="Cancel Edit"
                            />
                        )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                        {taskToEdit ? 'Update task details below.' : 'Capture your next goal in seconds.'}
                    </p>
                </div>

                <AddTask
                    isUpdate={!!taskToEdit}
                    taskToEdit={taskToEdit}
                    onSubmitSuccess={() => fetchTasks(setTasks)}
                    onCancel={onCancelEdit}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            </section>
        </div>
    );
};

export default ManageTasks;