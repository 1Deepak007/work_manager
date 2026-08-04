require('dotenv').config({ override: true });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const auth_router = require('./router/authRoutes') 
const task_router = require('./router/taskRoutes')


const Host = process.env.DB_HOST || '127.0.0.1';
const Port = process.env.DB_PORT || 5000;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.listen(Port, Host, () => {
    console.log(`Server is running on http://${Host}:${Port}`);
});


app.use('/api/auth', auth_router);
app.use('/api/task', task_router);



app.get('/', (req, res) => {
    res.send('Work Manager server is Running');
});