const Task = require("../models/task.model");
const Admin = require("../models/user.Adminmodel");
const { sendTaskLinkSubmittedEmailToAdmin } = require("../services/email.service");

const getAdminTaskRecipients = async () => {
  const configuredEmail = process.env.TASK_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

  if (configuredEmail) {
    return configuredEmail
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
  }

  const admins = await Admin.find({}, "email");
  return admins.map((admin) => admin.email).filter(Boolean);
};

const notifyTaskLinkSubmitted = async ({ task, employee, link }) => {
  try {
    const adminEmails = await getAdminTaskRecipients();
    await sendTaskLinkSubmittedEmailToAdmin({
      adminEmails,
      task,
      employee,
      link,
      status: task.status,
    });
  } catch (emailError) {
    console.error("Task link email failed:", emailError.message);
  }
};

module.exports.submitTaskLink = async (req, res) => {
  try {
    const employeeId = req.user.id;      // comes from auth middleware
    const { link } = req.body;
    const submittedLink = typeof link === "string" ? link.trim() : "";
    const { taskId } = req.params;

    if (!submittedLink) {
      return res.status(400).json({ msg: "Link is required" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // ensure employee owns this task
    if (task.assignedTo.toString() !== employeeId) {
      return res.status(403).json({ msg: "Not authorized for this task" });
    }

    // push link
    task.links.push({
      url: submittedLink,
      addedBy: "employee",
      addedAt: new Date()
    });

    await task.save();

    await notifyTaskLinkSubmitted({
      task,
      employee: req.user,
      link: submittedLink
    });

    res.json({
      msg: "Link submitted successfully",
      task
    });

  } catch (error) {
    console.log("Submit Link Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
