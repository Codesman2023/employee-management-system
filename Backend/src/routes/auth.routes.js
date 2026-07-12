const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password").notEmpty().withMessage("Password is required.")
  ],
  authController.loginUser
);

router.post(
  "/forgot-password",
  [
    body("email").isEmail().withMessage("Please enter a valid email address.")
  ],
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")
  ],
  authController.resetPassword
);

module.exports = router;
