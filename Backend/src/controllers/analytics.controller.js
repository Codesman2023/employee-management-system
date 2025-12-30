const Task = require("../models/task.model");
const Employee = require("../models/user.Employeemodel");

// ================= SUMMARY STATS =================
exports.getSummaryStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "completed" });
    const pending = await Task.countDocuments({ status: "pending" });
    const failed = await Task.countDocuments({ status: "failed" });
    const inProgress = await Task.countDocuments({ status: "in-progress" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueToday = await Task.countDocuments({
      dueDate: { $gte: today }
    });

    const totalEmployees = await Employee.countDocuments();

    res.json({
      totalTasks,
      completed,
      pending,
      failed,
      inProgress,
      dueToday,
      totalEmployees
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= TASK ANALYTICS =================
exports.getTaskAnalytics = async (req, res) => {
  try {
    const status = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const priority = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.json({ status, priority });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= PRODUCTIVITY =================
exports.getProductivity = async (req, res) => {
  try {
    const result = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          assigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          productivity: {
            $cond: [
              { $eq: ["$assigned", 0] },
              0,
              { $multiply: [{ $divide: ["$completed", "$assigned"] }, 100] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          displayName: { $ifNull: ["$employee.name", { $toString: "$_id" }] }
        }
      },
      {
        $project: {
          _id: "$displayName",
          assigned: 1,
          completed: 1,
          failed: 1,
          productivity: 1
        }
      }
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= RISK & DEADLINES =================
exports.getRisk = async (req, res) => {
  try {
    const now = new Date();
    const next48 = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const overdue = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: "completed" }
    });

    const nearDeadline = await Task.find({
      dueDate: { $gte: now, $lte: next48 },
      status: { $ne: "completed" }
    });

    const highRisk = await Task.find({
      priority: "high",
      status: { $ne: "completed" }
    });

    res.json({ overdue, nearDeadline, highRisk });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
