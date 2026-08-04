const auth_router = require('express').Router();
const authController = require('../controller/authController');

auth_router.post('/signup', authController.signup);
auth_router.post('/login', authController.login);
auth_router.post('/logout', authController.logout);

module.exports = auth_router;