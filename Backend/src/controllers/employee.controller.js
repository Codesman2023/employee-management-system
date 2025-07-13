const userModel = require('../models/user.Employeemodel');
const userService = require('../services/employee.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const Task = require('../models/task.model');

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
            password: hashedPassword
        })

    const token = user.generateAuthToken();
    res.status(201).json({ token , user});

 }

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({email}).select('+password');
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
}


module.exports.getUserProfile = async (req, res) => {
  try {
    // req.user should be set by your auth middleware
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};


module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}


module.exports.getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user.id; // Adjust if your middleware sets user differently

    const tasks = await Task.find({ assignedTo: employeeId });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error while fetching tasks.' });
  }
};

module.exports.updateMyTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ msg: 'Task not found' });
  }

  // Ensure the employee is only updating their own task
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  task.status = status;
  await task.save();

  res.status(200).json({ msg: 'Status updated', task });
};
