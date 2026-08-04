const verifyToken = require('../middleware/authMiddleware');
const prisma = require("../config/db");


exports.getmytasks = async (req, res) => {
    const currentUser = req.user;   // get current_user_id from token
    // console.log(currentUser);    // console.log(currentUser.id);     // console.log(typeof currentUser.id);
    try {
        const tasks = await prisma.task.findMany({ where: { userId: currentUser.id } });
        if (tasks.length === 0) return res.status(204).json({ message: 'No tasks found' });    // 204 No Content: Request succeeded, but the server returns no content in the body (commonly used with DELETE).
        return res.json(tasks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Server error : Error getting task : ${error.message}` });     // 500 Internal Server Error: Generic error message when an unexpected condition occurred on the server.
    }
}

exports.createtask = async (req, res) => {
    const currentUser = req.user;   // get current_user_id from token
    try {
        const { title, description, priority = 'medium', status = 'pending', dueDate } = req.body;
        const uid = currentUser.id || req.user.id;
        if (!uid || !title || !dueDate) {
            return res.status(400).json({ message: 'userId, title and dueDate are required' });
        }

        const task = await prisma.task.create({
            data: {
                userId: Number(uid),
                title,
                description: description || null,
                priority,
                status,
                dueDate: new Date(dueDate),
            },
        });

        return res.status(201).json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Server error : Error creating task : ${error.message}` });
    }
};

exports.updatetask = async (req, res) => {
    const currentUser = req.user;   // get current_user_id from token
    const { id } = req.params;          // task id
    const updates = { ...req.body };

    try {
        if(!id || isNaN(Number(id)))
            return res.status(400).json({ message: 'Valid Task id is required' });
        
        const existingTask = await prisma.task.findFirst({where : {id:Number(id), userId:Number(currentUser.id)}});

        if(!existingTask)
            return res.status(400).json({ message: 'Task not found' });

        if(updates.dueDate)
            updates.dueDate = new Date(updates.dueDate);

        const updatedTask = await prisma.task.update({where : {id:Number(id)}, data : updates});
        return res.status(200).json(updatedTask);
    } 
    catch (error) {
        console.error('Error updating task : ',error);
        if (!res.headersSent) 
            return res.status(500).json({ message: `Server error : Error updating task : ${error.message}` });
    }
};

exports.deletetask = async (req, res) => {
    const currentUser = req.user;   // get current_user_id from token
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ message: 'Task id is required' });

        await prisma.task.delete({ where: { id: Number(id), userId:Number(currentUser.id) } });
        return res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Server error : Error deleting task : ${error.message}` });
    }
};



// {
//   "userId": 1,
//   "title": "Finish project",
//   "description": "Complete the backend API",
//   "priority": "high",
//   "status": "pending",
//   "dueDate": "2026-08-10T10:00:00.000Z"
// }


// # Table, Create Table
// 'tasks', 'CREATE TABLE `tasks` (\n
// `id` int NOT NULL AUTO_INCREMENT,\n
// `userId` int NOT NULL,\n
// `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,\n
// `description` text COLLATE utf8mb4_unicode_ci,\n
// `priority` enum(\'low\',\'medium\',\'high\') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT \'medium\',\n
// `status` enum(\'pending\',\'in_progress\',\'completed\') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT \'pending\',\n
// `dueDate` datetime(3) NOT NULL,\n
// `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n
// `updatedAt` datetime(3) NOT NULL,\n
// PRIMARY KEY (`id`),\n  KEY `tasks_userId_idx` (`userId`),\n
// CONSTRAINT `tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
