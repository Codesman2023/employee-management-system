const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middlewares/EmployeeAuth.middleware');
const adminAuth = require('../middlewares/AdminAuth.middleware');

router.post('/clock-in', authMiddleware.authUser, attendanceController.clockIn);
router.post('/clock-out', authMiddleware.authUser, attendanceController.clockOut);
router.get('/today', authMiddleware.authUser, attendanceController.getTodayAttendance);

// Admin-only: list all attendance records
router.get('/all', adminAuth.authUser, attendanceController.getAllAttendance);

module.exports = router;