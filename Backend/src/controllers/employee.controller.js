const userModel = require('../models/user.Employeemodel');
const userService = require('../services/employee.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const Task = require('../models/task.model');
const Admin = require('../models/user.Adminmodel');
const { sendTaskLinkSubmittedEmailToAdmin } = require('../services/email.service');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const fs = require('fs/promises');
const path = require('path');
const Employee = userModel;
const profileImageUploadDir = path.join(__dirname, '../../uploads/profile-images');

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ems/employee-profile-images',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const getFileExtension = (file) => {
  const extensionFromName = path.extname(file.originalname || '').toLowerCase();
  if (extensionFromName) return extensionFromName;

  const extensionFromMime = file.mimetype?.split('/')[1];
  return extensionFromMime ? `.${extensionFromMime}` : '.jpg';
};

const saveProfileImageLocally = async (file, employeeId, req) => {
  await fs.mkdir(profileImageUploadDir, { recursive: true });

  const filename = `employee-${employeeId}-${Date.now()}${getFileExtension(file)}`;
  const filePath = path.join(profileImageUploadDir, filename);
  await fs.writeFile(filePath, file.buffer);

  return {
    secure_url: `${req.protocol}://${req.get('host')}/uploads/profile-images/${filename}`,
    public_id: `local:${filename}`,
  };
};

const deleteLocalProfileImage = async (publicId) => {
  if (!publicId?.startsWith('local:')) return;

  const filename = publicId.replace('local:', '');
  const filePath = path.join(profileImageUploadDir, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Old local profile image cleanup failed:', error.message);
    }
  }
};

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

const notifyTaskLinkSubmitted = async ({ task, employee, link, status }) => {
  try {
    const adminEmails = await getAdminTaskRecipients();
    await sendTaskLinkSubmittedEmailToAdmin({
      adminEmails,
      task,
      employee,
      link,
      status,
    });
  } catch (emailError) {
    console.error("Task link email failed:", emailError.message);
  }
};


module.exports.getEmployeeProfileSelf = async (req, res) => {
  try {
    const employee = await userModel.findById(req.user._id).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.status === "inactive") {
      return res.status(403).json({
        message: "Your account is deactivated. Contact Admin."
      });
    }

    res.status(200).json({ employee });

  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
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

module.exports.updateMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const allowedUpdates = {};
    const {
      name,
      department,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      emergencyContact,
    } = req.body || {};

    if (typeof name === 'string' && name.trim()) {
      allowedUpdates.name = name.trim();
    }

    if (typeof department === 'string') {
      allowedUpdates.department = department.trim();
    }

    if (typeof phone === 'string') {
      allowedUpdates.phone = phone.trim();
    }

    if (typeof address === 'string') {
      allowedUpdates.address = address.trim();
    }

    if (typeof city === 'string') {
      allowedUpdates.city = city.trim();
    }

    if (typeof state === 'string') {
      allowedUpdates.state = state.trim();
    }

    if (typeof pincode === 'string') {
      allowedUpdates.pincode = pincode.trim();
    }

    if (typeof country === 'string') {
      allowedUpdates.country = country.trim();
    }

    if (typeof emergencyContact === 'string') {
      allowedUpdates.emergencyContact = emergencyContact.trim();
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ msg: 'No valid profile fields provided' });
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.status(200).json({ msg: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update failed:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'Profile image is required' });
    }

    const previousPublicId = req.user.profileImage?.public_id;
    let uploadResult;

    try {
      uploadResult = await uploadBufferToCloudinary(req.file.buffer);
    } catch (cloudinaryError) {
      console.error('Cloudinary profile image upload failed:', cloudinaryError.message);
      uploadResult = await saveProfileImageLocally(req.file, req.user._id, req);
    }

    if (previousPublicId && previousPublicId !== uploadResult.public_id) {
      if (previousPublicId.startsWith('local:')) {
        await deleteLocalProfileImage(previousPublicId);
      } else {
        cloudinary.uploader.destroy(previousPublicId).catch((error) => {
          console.error('Old profile image cleanup failed:', error.message);
        });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.status(200).json({
      msg: 'Profile image updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile image update failed:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
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
  const { status, link } = req.body;
  const submittedLink = typeof link === "string" ? link.trim() : "";
  const allowedStatuses = ["pending", "in-progress", "under-review", "completed", "failed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid task status' });
  }

  if (!submittedLink) {
    return res.status(400).json({ msg: 'Work link is required before updating task status' });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ msg: 'Task not found' });
  }

  // Ensure the employee is only updating their own task
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  task.links.push({
    url: submittedLink,
    addedBy: "employee",
    addedAt: new Date()
  });

  task.status = status;
  await task.save();

  await notifyTaskLinkSubmitted({
    task,
    employee: req.user,
    link: submittedLink,
    status
  });

  res.status(200).json({ msg: 'Status updated', task });
};

module.exports.changePassword = async (req, res) => {
  try {
    const employeeId = req.user.id;   // from auth middleware
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
      return res.status(400).json({ msg: "All fields are required" });
    }

    const employee = await Employee.findById(employeeId).select("+password");

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(newPassword, salt);

    await employee.save();

    res.json({ msg: "Password changed successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

