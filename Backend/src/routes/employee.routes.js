const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/employee.controller');
const authMiddleware = require('../middlewares/EmployeeAuth.middleware');
const upload = require('../config/multer');

const uploadProfileImage = (req, res, next) => {
    upload.single('profileImage')(req, res, (error) => {
        if (error) {
            return res.status(400).json({ msg: error.message });
        }

        next();
    });
};

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.put('/profile', authMiddleware.authUser, userController.updateMyProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.get('/tasks', authMiddleware.authUser, userController.getMyTasks);

router.put('/tasks/:id', authMiddleware.authUser, userController.updateMyTaskStatus);

router.put('/change-password', authMiddleware.authUser, [
    body('oldPassword').notEmpty().withMessage('Old password is required.'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.')
] ,userController.changePassword);

router.patch(
    '/profile-image',
    authMiddleware.authUser,
    uploadProfileImage,
    userController.updateProfileImage
);

module.exports = router;
