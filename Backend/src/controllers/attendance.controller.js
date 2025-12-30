const Attendance = require("../models/attendance.model");

module.exports.clockIn = async (req, res) => {
  try {
    const employeeId = req.user.id;   // from auth middleware
    const today = new Date().toISOString().split("T")[0];

    const already = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (already) {
      return res.status(400).json({ msg: "Already clocked in today" });
    }

    await Attendance.create({
      employee: employeeId,
      date: today,
      clockIn: new Date()
    });

    res.json({ msg: "Clock In successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.clockOut = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ msg: "You did not clock in today" });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ msg: "Already clocked out" });
    }

    const now = new Date();
    const workedMs = now - attendance.clockIn;
    const hours = workedMs / (1000 * 60 * 60);

    attendance.clockOut = now;
    attendance.totalHours = hours.toFixed(2);

    await attendance.save();

    res.json({
      msg: "Clock Out successful",
      hours: attendance.totalHours
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.getTodayAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    res.json(attendance);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name email")
      .sort({ date: -1 });

    res.json({ attendance: records });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};