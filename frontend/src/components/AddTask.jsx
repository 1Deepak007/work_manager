import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utils/auth';
import { fetchTasks } from '../utils/dashboard';
import { useState } from 'react';

const AddTask = ({ isUpdate, taskToEdit, onSubmitSuccess, onCancel, setTasks }) => {
    const [setLoading] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: taskToEdit?.title || '',
            description: taskToEdit?.description || '',
            priority: taskToEdit?.priority || 'medium',
            status: taskToEdit?.status || 'pending',
            dueDate: taskToEdit?.dueDate ? (() => {
                const d = new Date(taskToEdit.dueDate);
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${d.getFullYear()}-${month}-${day}`;
            })() : ''
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required('Title is required'),
            description: Yup.string().trim().required('Description is required'),
            priority: Yup.string().required('Priority is required'),
            status: Yup.string().required('Status is required'),
            dueDate: Yup.date().required('Due date is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                if (isUpdate && taskToEdit) {
                    const taskId = taskToEdit.id || taskToEdit._id;
                    await axios.patch(`http://127.0.0.1:5000/api/task/update_task/${taskId}`, values, {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    });
                } else {
                    await axios.post('http://127.0.0.1:5000/api/task/create_task', values, {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    });
                }

                // Refresh the task list after successful creation/update
                await fetchTasks(setTasks, setLoading);

                toast.success(isUpdate ? 'Task updated successfully' : 'Task created successfully');
                resetForm();
                if (onSubmitSuccess) await onSubmitSuccess();
                if (onCancel) onCancel();

            } catch (error) {
                console.error(error);
                toast.error(isUpdate ? 'Failed to update task' : 'Failed to create task');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                    type="text"
                    {...formik.getFieldProps('title')}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Plan the sprint"
                />
                {formik.touched.title && formik.errors.title ? (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.title}</p>
                ) : null}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                    {...formik.getFieldProps('description')}
                    className="min-h-[96px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Add a few details about this task"
                />
                {formik.touched.description && formik.errors.description ? (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
                ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                    <select
                        {...formik.getFieldProps('priority')}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                    <select
                        {...formik.getFieldProps('status')}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
                <input
                    type="date"
                    {...formik.getFieldProps('dueDate')}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {formik.touched.dueDate && formik.errors.dueDate ? (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.dueDate}</p>
                ) : null}
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 sm:w-auto"
                >
                    {isUpdate ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default AddTask;