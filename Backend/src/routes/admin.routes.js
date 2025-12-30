const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/AdminAuth.middleware');

router.post('/Admin-register', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('fullname.firstname').notEmpty().withMessage('First name is required.'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required.')
],
    userController.registerUser
);


router.post('/Admin-login', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.')
],
    userController.loginUser
);

router.post('/tasks', authMiddleware.authUser, userController.createTask);

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.put('/tasks/:id', authMiddleware.authUser, userController.updateTask);

router.delete('/tasks/:id', authMiddleware.authUser, userController.deleteTask);

router.get('/tasks', authMiddleware.authUser, userController.getAllTasks);

router.get('/employees', authMiddleware.authUser, userController.getAllEmployees);

router.post('/create-employee', authMiddleware.authUser, userController.createEmployee);

router.get('/employees-list', authMiddleware.authUser, userController.getAllEmployees);

router.put('/update-employees/:id', authMiddleware.authUser, userController.updateEmployee);

router.delete('/delete-employees/:id', authMiddleware.authUser, userController.deleteEmployee);

router.get('/employee/:id', authMiddleware.authUser, userController.getEmployeeProfile);

router.put('/restore-employee/:id', authMiddleware.authUser, userController.restoreEmployee);

router.delete('/permanent-delete-employee/:id', authMiddleware.authUser, userController.permanentDeleteEmployee);

module.exports = router;
