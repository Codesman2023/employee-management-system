const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    select: false,
  },
  profileImage: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
  department: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  emergencyContact: String,
  designation: String,
  role: { type: String, default: "employee" },
  status: {
    type: String,
    enum: ["pending", "active", "inactive", "rejected"],
    default: "pending",
  },
  joiningDate: Date,
  deletedAt: { type: Date, default: null },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: "employee" },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("Employee", userSchema);
