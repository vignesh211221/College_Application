const mongoose = require("mongoose");

const studentTimetableSchema = new mongoose.Schema({
    
      
  department: {
    type: String,
    required: true
  },
  
  className: {  // NEW FIELD: like "CSE 6A", "ECE 5B"
    type: String,
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
      endTime: String,       // "09:50"          // Optional - staff name or ID
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("StudentTimetable", studentTimetableSchema);
