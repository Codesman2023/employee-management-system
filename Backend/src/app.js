const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const cors = require('cors')
const employeeRoutes = require('./routes/employee.routes')
const adminRoutes = require('./routes/admin.routes')
const app = express()
const connectToDb = require('./db/db')
const cookieParser = require('cookie-parser')

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

module.exports = app