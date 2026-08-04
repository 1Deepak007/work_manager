# Initialize Node project
        npm init -y
# Core Dependencies
        npm install express cors dotenv bcryptjs jsonwebtoken @prisma/client multer cookie-parser
# Development Dependencies
        npm install --save-dev prisma nodemon
# Initialize Prisma for MySQL:
        npx prisma init --datasource-provider mysql


npm install @prisma/adapter-mysql
npm install @prisma/adapter-mariadb mariadb

# Run Migration & Generate Client
    Creates tables in MySQL automatically.
    Run this command to create the workmanager database tables automatically based on your Prisma schema:Bash
        npx prisma migrate dev --name init

# changing in schema 

did => in Task ->   updatedAt   DateTime @updatedAt    -to->   updatedAt   DateTime @default(now())
run command ->  npx prisma migrate dev --name updated_task_field_updatedAt_default_now

Run ====> npm run dev
====================================================================

# Server Configuration
DB_PORT=5000

# Database Credentials
DB_HOST="127.0.0.1"
DB_USER='root'
DB_PASSWORD='root'
DB_NAME=workmanager
JWT_SECRET=this_is_a_secret_key_for_jwt_token_generation

#port, host, username,password is -> 3306,"127.0.0.1", "root", "root"



++++++++++++++++++ BACKEND

-- Create Database (Optional)
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- 1. Users / Profile Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,            -- Stored as bcrypt hash
    contact VARCHAR(20) DEFAULT NULL,
    hobbies TEXT DEFAULT NULL,                  -- e.g., "Reading, Gaming, Coding"
    profile_picture VARCHAR(255) DEFAULT NULL,  -- Image path / Cloudinary URL
    alternate_email VARCHAR(150) DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    home_town VARCHAR(150) DEFAULT NULL,
    profession VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tasks Table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                        -- Links task to creator
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    due_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key to ensure user integrity & cascade cleanup
    CONSTRAINT fk_tasks_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Index to optimize querying tasks per user
CREATE INDEX idx_tasks_user_id ON tasks(user_id);











{
        "id": 2,
        "userId": 2,
        "title": "sample task",
        "description": "this is sample task",
        "priority": "low",
        "status": "pending",
        "dueDate": "2026-09-10T10:00:00.000Z",
        "createdAt": "2026-08-02T08:05:17.892Z",
        "updatedAt": "2026-08-02T08:05:17.892Z"
    },