
const profile_router = require('express').Router();
const profileController = require('../controller/profileController');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

profile_router.get('/get_my_profile', verifyToken, profileController.get_my_profile);


profile_router.patch(
    '/update_profile', 
    verifyToken, 
    upload.single('profilePicture'), 
    profileController.update_profile
);

module.exports = profile_router;