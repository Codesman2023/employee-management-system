const userModel = require("../models/user.Adminmodel");
const userService = require("../services/admin.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const Task = require("../models/task.model");
const { createTask } = require("../controllers/admin.controller");
const bcrypt = require("bcrypt");
const Employee = require("../models/user.Employeemodel");

module.exports.getEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const completed = await Task.countDocuments({ assignedTo: id, status: "completed" });
    const pending = await Task.countDocuments({ assignedTo: id, status: "pending" });
    const failed = await Task.countDocuments({ assignedTo: id, status: "failed" });

    res.status(200).json({
      employee,
      taskSummary: {
        completed,
        pending,
        failed
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};

module.exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      name,
      email,
      password: hashed,
      department: department || "General",
      designation: designation || "Employee",
      role: "employee",
      status: "active",
      joiningDate: new Date()
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        _id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee Updated", employee: updated });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.status = "inactive";
    employee.deletedAt = new Date();
    await employee.save();

    res.status(200).json({ message: "Employee marked as inactive" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

// ➕ Create Task
module.exports.createTask = async (req, res) => {
  try {
    const { title, dueDate, assignedTo, category, description, links } = req.body;

    if (!title || !assignedTo) {
      return res
        .status(400)
        .json({ msg: "Title and assignedTo are required." });
    }

    // Accept links array if provided and normalise entries
    let normalizedLinks = [];
    if (Array.isArray(links)) {
      normalizedLinks = links
        .filter(l => l && typeof l.url === 'string' && l.url.trim() !== '')
        .map(l => ({
          url: l.url,
          addedBy: l.addedBy === 'employee' ? 'employee' : 'admin',
          addedAt: l.addedAt ? new Date(l.addedAt) : new Date()
        }));
    }

    const newTask = new Task({
      title,
      dueDate,
      assignedTo,
      category,
      description,
      links: normalizedLinks
    });

    await newTask.save();

    res.status(201).json({ msg: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while creating task." });
  }
};

// ✅ Update Task by ID
module.exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Can contain title, dueDate, category, status, etc.

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.status(200).json({ msg: 'Task updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error while updating task.' });
  }
};

// ✅ Delete Task by ID
module.exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error while deleting task.' });
  }
};

// Example
module.exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo');
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};


module.exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await require('../models/user.Employeemodel').find();
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ msg: 'Server error while fetching employees.' });
  }
};

/**
 * Get all pending employees (status = 'pending')
 */
module.exports.getPendingEmployees = async (req, res) => {
    try {
        const pending = await require('../models/user.Employeemodel').find({ status: 'pending' }).select('-password');
        res.status(200).json({ pending });
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching pending employees' });
    }
}

/**
 * Approve an employee (set status to 'active')
 */
module.exports.approveEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const employeeModel = require('../models/user.Employeemodel');
        const user = await employeeModel.findByIdAndUpdate(id, { status: 'active' }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ msg: 'Employee not found' });
        res.status(200).json({ msg: 'Employee approved', user });
    } catch (err) {
        res.status(500).json({ msg: 'Error approving employee' });
    }
}

/**
 * Reject an employee (set status to 'rejected')
 */
module.exports.rejectEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const employeeModel = require('../models/user.Employeemodel');
        const user = await employeeModel.findByIdAndUpdate(id, { status: 'rejected' }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ msg: 'Employee not found' });
        res.status(200).json({ msg: 'Employee rejected', user });
    } catch (err) {
        res.status(500).json({ msg: 'Error rejecting employee' });
    }
}

module.exports.restoreEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.status = "active";
    employee.deletedAt = null;

    await employee.save();

    res.status(200).json({ message: "Employee restored successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Server Error in restore employee",
      error
    });
  }
};

module.exports.permanentDeleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(id);

    res.status(200).json({ message: "Employee permanently deleted" });

  } catch (error) {
    res.status(500).json({
      message: "Server Error in permanent delete employee",
      error
    });
  }
};
