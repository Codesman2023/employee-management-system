const Task = require("../models/task.model");

module.exports.submitTaskLink = async (req, res) => {
  try {
    const employeeId = req.user.id;      // comes from auth middleware
    const { link } = req.body;
    const { taskId } = req.params;

    if (!link) {
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
      url: link,
      addedBy: "employee",
      addedAt: new Date()
    });

    await task.save();

    res.json({
      msg: "Link submitted successfully",
      task
    });

  } catch (error) {
    console.log("Submit Link Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
