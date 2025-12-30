const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/employee.controller');
const authMiddleware = require('../middlewares/EmployeeAuth.middleware');


router.post('/Employee-register', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('fullname.firstname').notEmpty().withMessage('First name is required.'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required.')
],
    userController.registerUser
);


router.post('/Employee-login', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.')
],
    userController.loginUser
);


router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.get('/tasks', authMiddleware.authUser, userController.getMyTasks);

router.put('/tasks/:id', authMiddleware.authUser, userController.updateMyTaskStatus);

router.put('/change-password', authMiddleware.authUser, [
    body('oldPassword').notEmpty().withMessage('Old password is required.'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.')
] ,userController.changePassword);

module.exports = router;
