const task_router = require('express').Router();
const taskController = require('../controller/taskController');
const verifyToken = require('../middleware/authMiddleware');

task_router.post('/create_task', verifyToken, taskController.createtask);
task_router.patch('/update_task/:id', verifyToken, taskController.updatetask);
task_router.post('/delete_task', verifyToken, taskController.deletetask);
task_router.get('/get_my_tasks', verifyToken, taskController.getmytasks);
task_router.delete('/delete_task/:id', verifyToken, taskController.deletetask);

module.exports = task_router;