const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const path = require('path')
const cors = require('cors')
const employeeRoutes = require('./routes/employee.routes')
const adminRoutes = require('./routes/admin.routes')
const authRoutes = require('./routes/auth.routes')
const leaveRoutes = require('./routes/leave.routes')
const app = express()
const connectToDb = require('./db/db')
const cookieParser = require('cookie-parser')
const analyticsRoutes = require('./routes/analytics.routes')
const employeetaskRoutes = require('./routes/employeetask.routes')
const attendanceRoutes = require('./routes/attendance.routes')

connectToDb()

app.use(cors())
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/employees', employeeRoutes)
app.use('/admins', adminRoutes)
app.use('/auth', authRoutes)
app.use('/leaves', leaveRoutes)
app.use("/analytics", analyticsRoutes);
app.use("/employee-tasks", employeetaskRoutes);
app.use("/attendance", attendanceRoutes);

module.exports = app
