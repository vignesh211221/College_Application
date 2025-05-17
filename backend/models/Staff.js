const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to main user
    required: true
  },
  facultyId: {
    type: String,
    required: true,
    unique: true
  },
  qualification: {
    type: String,
    required: true
  },
  phoneNumber:{
    type:String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  handledSubjects: [
    {
      subject: String,
      class: String // eg: ITA - Final Year
    }
  ],
  assignedByHOD: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // HOD who assigned
    default: null
  },
  department: {
    type: String,
    required: true
  },
  className:{
    type:String
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
