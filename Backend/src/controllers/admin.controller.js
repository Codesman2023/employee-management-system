const userModel = require("../models/user.Adminmodel");
const userService = require("../services/admin.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const Task = require("../models/task.model");
const { createTask } = require("../controllers/admin.controller");

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
  const userId = req.user._id;
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
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
    const { title, dueDate, assignedTo, category, description } = req.body;

    if (!title || !assignedTo) {
      return res
        .status(400)
        .json({ msg: "Title and assignedTo are required." });
    }

    const newTask = new Task({
      title,
      dueDate,
      assignedTo,
      category,
      description,
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
