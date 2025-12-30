const express = require('express');
const router = express.Router();

const taskcontroller = require('../controllers/employeetask.controller');
const authMiddleware = require('../middlewares/EmployeeAuth.middleware');


router.put('/tasks/:taskId/add-link', authMiddleware.authUser, taskcontroller.submitTaskLink);

module.exports = router;