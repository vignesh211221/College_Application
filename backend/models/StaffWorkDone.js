const mongoose = require("mongoose");

const staffWorkDoneSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },
  day: {
    type: String,
    required: true
  },
  periodNumber: {
    type: Number,
    required: true
  },
  date: {  
    type: String, // or Date if you prefer
    required: true
  },
  subject: String,
  class: String,
  unit: String,
  syllabus: String,
  coveredTopic: String,
  completedTime: String,
  timetableRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffTimetable"
  }
}, { timestamps: true });

module.exports = mongoose.model("StaffWorkDone", staffWorkDoneSchema);
