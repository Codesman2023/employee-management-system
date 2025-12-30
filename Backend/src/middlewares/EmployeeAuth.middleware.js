const employeeModel = require('../models/user.Employeemodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const isBlacklisted = await employeeModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized - Token invalid" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await employeeModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account has been deactivated. Contact Admin."
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
