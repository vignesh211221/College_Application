const mongoose = require("mongoose");

const staffTimetableSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff", // or 'User' if staff are stored in the User model
    required: true
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true
  },
  periods: [
    {
      periodNumber: Number,  // 1-8
      subject: String,
      time: String,          // "09:00"
      endTime: String,       // "09:50"
      class: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("StaffTimetable", staffTimetableSchema);