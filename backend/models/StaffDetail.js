const mongoose = require('mongoose');

const staffDetailSchema = new mongoose.Schema({
  StaffName: { type: String, required: true },
  SubjectCode: { type: String, required: true },
  Subject: { type: String, required: true },
  Credits: { type: Number, required: true },
  className:{type: String , required: true},
  PeriodsHours: { type: Number, required: true }
});

module.exports = mongoose.model('StaffDetail', staffDetailSchema);
