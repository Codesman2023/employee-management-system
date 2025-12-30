const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require('../middlewares/AdminAuth.middleware');

router.get("/summary", authMiddleware.authUser, analyticsController.getSummaryStats);
router.get("/tasks", authMiddleware.authUser, analyticsController.getTaskAnalytics);
router.get("/productivity", authMiddleware.authUser, analyticsController.getProductivity);
router.get("/risk", authMiddleware.authUser, analyticsController.getRisk);

module.exports = router;
