const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  type: {
    type: String,
    enum: ["Sick", "Casual", "Paid", "Unpaid"],
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  fromDate: {
    type: Date,
    required: true,
  },

  toDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  appliedOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Leave", leaveSchema);