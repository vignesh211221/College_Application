const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["job", "internship"],
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  skillsRequired: {
    type: [String]
  },
  eligibility: {
    type: String
  },
  ctc: {
    type: String
  },
  applyLink: {
    type: String
  },
  location:{
    type: String
  },
  departments: {
    type: [String], // e.g. ['CSE', 'IT']
    required: true
  },
  classNames: {
    type: [String], // e.g. ['CSE-A', 'IT-B']
    required: true
  },
  regulations: {
    type: [String], // e.g., ['2021-2025', '2020-2024']
    default: [],
  },
  expiryDate: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  appliedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Placement", placementSchema);
