const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const cors = require('cors')
const employeeRoutes = require('./routes/employee.routes')
const adminRoutes = require('./routes/admin.routes')
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

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/employees', employeeRoutes)
app.use('/admins', adminRoutes)
app.use('/leaves', leaveRoutes)
app.use("/analytics", analyticsRoutes);
app.use("/employee-tasks", employeetaskRoutes);
app.use("/attendance", attendanceRoutes);

module.exports = app