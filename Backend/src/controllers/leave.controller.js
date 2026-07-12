const Leave = require("../models/leave.model");
const Admin = require("../models/user.Adminmodel");
const {
  sendLeaveRequestEmailToAdmin,
  sendLeaveStatusEmailToEmployee,
} = require("../services/email.service");

const getAdminLeaveRecipients = async () => {
  const configuredEmail = process.env.LEAVE_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

  if (configuredEmail) {
    return configuredEmail
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
  }

  const admins = await Admin.find({}, "email");
  return admins.map((admin) => admin.email).filter(Boolean);
};

const notifyLeaveStatus = async ({ leave, admin }) => {
  try {
    await sendLeaveStatusEmailToEmployee({
      leave,
      employee: leave.employee,
      admin,
    });
  } catch (emailError) {
    console.error("Leave status email failed:", emailError.message);
  }
};


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

    try {
      const adminEmails = await getAdminLeaveRecipients();
      await sendLeaveRequestEmailToAdmin({
        adminEmails,
        leave,
        employee: req.user,
      });
    } catch (emailError) {
      console.error("Leave request email failed:", emailError.message);
    }

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
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    ).populate("employee", "name email");

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    await notifyLeaveStatus({ leave, admin: req.user });

    res.json({ success: true, message: "Leave Approved" });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    ).populate("employee", "name email");

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    await notifyLeaveStatus({ leave, admin: req.user });

    res.json({ success: true, message: "Leave Rejected" });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
