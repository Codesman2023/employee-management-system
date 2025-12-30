const mogoose = require("mongoose")

const attendanceSchema = new mogoose.Schema({
    employee:{
        type: mogoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    clockIn:{
        type: Date,
    },
    clockOut:{
        type: Date,
    },
    totalHours:{
        type: Number,
        default: 0
    }
},
    {timestamps: true});

module.exports = mogoose.model("Attendance", attendanceSchema)
