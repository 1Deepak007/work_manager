import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';
import axios from 'axios';

// "title":"Sample task 2", // "description":"this is sample task 2.",  // "priority":"high",   // "status":"in_progress",  // "dueDate":"2027-10-30"

export const fetchTasks = async (setTasks, setLoading) => {
    try {
        const token = getToken();
        if (!token) {
            toast.error('Session expired or user not logged in');
            return;
        }
        const response = await axios.get('http://127.0.0.1:5000/api/task/get_my_tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const taskData = Array.isArray(response.data) ? response.data : [];
        if (setTasks) setTasks(taskData);
        return taskData;
    } catch (error) {
        console.error(error);
        toast.error('Failed to fetch tasks');
        if (setTasks) setTasks([]);
    } finally {
        if (setLoading) {
            setLoading(false);
        }
    }
};


export const handleUpdateTask = async (taskId, updatedData, setTasks, setLoading) => {
    try {
        const payload = typeof updatedData === 'object' ? updatedData : { status: updatedData };
        await axios.patch(
            `http://127.0.0.1:5000/api/task/update_task/${taskId}`,
            payload,
            {
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        );
        toast.success('Task updated successfully');
        await fetchTasks(setTasks, setLoading);
    } catch (error) {
        console.error(error);
        toast.error('Failed to update task');
    }
};

export const handleDeleteTask = async (taskId, setTasks, setLoading) => {

    console.log(taskId, setTasks, setLoading);
    try {
        await axios.delete(`http://127.0.0.1:5000/api/task/delete_task/${taskId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success('Task deleted successfully');
        await fetchTasks(setTasks, setLoading);
    } catch {
        toast.error('Failed to delete task');
    }
};

export const handleEditTask = async (taskId, values) => {
    console.log(taskId, values);
    try {
        await axios.patch(
            `http://127.0.0.1:5000/api/task/update_task/${taskId}`,
            values,
            {
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        );
        toast.success('Task edited successfully');
    } catch (error) {
        console.error(error);
        toast.error('Failed to edit task');
    }
};

// export const isOverdue = (dueDate, status) => {
//     if (!dueDate || status === 'completed') return false;
//     return new Date(dueDate) < new Date();
// };

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "completed") return false;

  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);

  return due < new Date();
};

export const refreshTasks = (setTasks, setLoading) => {
        fetchTasks(setTasks, setLoading);
};