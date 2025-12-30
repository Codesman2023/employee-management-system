const Leave = require("../models/leave.model");


module.exports.applyLeave = async (req, res) => {
  try {
    const { type, reason, fromDate, toDate } = req.body;

    const leave = await Leave.create({
      employee: req.user.id,
      type,
      reason,
      fromDate,
      toDate
    });

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id }).sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ADMIN ONLY
module.exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee", "name email");
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports.approveLeave = async (req, res) => {
  try {
    await Leave.findByIdAndUpdate(req.params.id, { status: "Approved" });
    res.json({ success: true, message: "Leave Approved" });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports.rejectLeave = async (req, res) => {
  try {
    await Leave.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    res.json({ success: true, message: "Leave Rejected" });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};