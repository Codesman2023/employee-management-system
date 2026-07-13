const adminModel = require("../models/user.Adminmodel");
const employeeModel = require("../models/user.Employeemodel");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../services/email.service");

const sanitizeUser = (user, role) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return { ...safeUser, role };
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email }).select("+password");
    if (admin && await admin.comparePassword(password)) {
      const token = admin.generateAuthToken();
      const user = sanitizeUser(admin, "admin");

      res.cookie("token", token);
      return res.status(200).json({ token, role: "admin", user });
    }

    const employee = await employeeModel.findOne({ email }).select("+password");
    if (employee && await employee.comparePassword(password)) {
      if (employee.status !== "active") {
        return res.status(403).json({
          message: "Your account is not active. Contact Admin."
        });
      }

      const token = employee.generateAuthToken();
      const user = sanitizeUser(employee, "employee");

      res.cookie("token", token);
      return res.status(200).json({ token, role: "employee", user });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const hashResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const findUserByEmail = async (email) => {
  const admin = await adminModel.findOne({ email });
  if (admin) {
    return { user: admin, role: "admin", model: adminModel };
  }

  const employee = await employeeModel.findOne({ email });
  if (employee) {
    return { user: employee, role: "employee", model: employeeModel };
  }

  return null;
};

module.exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const account = await findUserByEmail(email);
    const genericMessage = "If an account exists, a password reset link has been sent.";

    if (!account) {
      return res.status(200).json({ message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    account.user.passwordResetToken = hashResetToken(resetToken);
    account.user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await account.user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    await sendResetPasswordEmail({ email: account.user.email, resetLink });

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error("Forgot password error:", error); 
    return res.status(500).json({ message: "Unable to send password reset email" });
  }
};

module.exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.params;
  const { newPassword } = req.body;
  const hashedToken = hashResetToken(token);

  try {
    let account = await adminModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    let model = adminModel;

    if (!account) {
      account = await employeeModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });
      model = employeeModel;
    }

    if (!account) {
      return res.status(400).json({ message: "Reset link is invalid or expired" });
    }

    account.password = await model.hashPassword(newPassword);
    if (model === employeeModel && account.status === "pending") {
      account.status = "active";
    }
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;
    await account.save();

    return res.status(200).json({
      message: model === employeeModel ? "Password set successfully. Your account is active." : "Password reset successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to reset password" });
  }
};
