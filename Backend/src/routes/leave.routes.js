const express = require("express");
const router = express.Router();
const userControler = require("../controllers/leave.controller");
const authMiddleware = require("../middlewares/EmployeeAuth.middleware");
const adminAuthMiddleware = require("../middlewares/AdminAuth.middleware");


router.post("/apply-leave", authMiddleware.authUser, userControler.applyLeave);
router.get("/my-leaves", authMiddleware.authUser, userControler.getMyLeaves);

// ADMIN ONLY ROUTES
router.get("/all-leaves", adminAuthMiddleware.authUser, userControler.getAllLeaves);
router.put("/approve-leave/:id", adminAuthMiddleware.authUser, userControler.approveLeave);
router.put("/reject-leave/:id", adminAuthMiddleware.authUser, userControler.rejectLeave);

module.exports = router;