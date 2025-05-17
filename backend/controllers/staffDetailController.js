const StaffDetail = require('../models/StaffDetail');

// Create or update staff detail based on StaffName, SubjectCode, and className
exports.createOrUpdateStaffDetail = async (req, res) => {
  try {
    const { StaffName, SubjectCode, Subject, Credits, className, PeriodsHours } = req.body;

    if (!StaffName || !SubjectCode || !Subject || !Credits || !className || !PeriodsHours) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    let existingDetail = await StaffDetail.findOne({
      StaffName,
      SubjectCode,
      className
    });

    if (existingDetail) {
      // Update existing detail
      existingDetail.Subject = Subject;
      existingDetail.Credits = Credits;
      existingDetail.PeriodsHours = PeriodsHours;

      await existingDetail.save();

      return res.status(200).json({
        success: true,
        message: "Staff detail updated successfully",
        staffDetail: existingDetail
      });
    } else {
      // Create new staff detail
      const newDetail = await StaffDetail.create({
        StaffName,
        SubjectCode,
        Subject,
        Credits,
        className,
        PeriodsHours
      });

      return res.status(201).json({
        success: true,
        message: "Staff detail created successfully",
        staffDetail: newDetail
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all staff details
exports.getAllStaffDetails = async (req, res) => {
  try {
    const staffDetails = await StaffDetail.find();
    res.status(200).json({ success: true, staffDetails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get staff details by className
exports.getStaffDetailsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    // Modify the query to only select the required fields
    const staffDetails = await StaffDetail.find({ className }).select('StaffName Subject SubjectCode  className Credits PeriodsHours');

    if (!staffDetails || staffDetails.length === 0) {
      return res.status(404).json({ success: false, message: "No staff details found for this class." });
    }

    res.status(200).json({ success: true, staffDetails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// Get staff detail by ID
exports.getStaffDetailById = async (req, res) => {
  try {
    const staffDetail = await StaffDetail.findById(req.params.id);

    if (!staffDetail) {
      return res.status(404).json({ success: false, message: "Staff detail not found" });
    }

    res.status(200).json({ success: true, staffDetail });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update staff detail by ID
// Update staff detail by ID
exports.updateStaffDetailById = async (req, res) => {
  try {
    const updatedDetail = await StaffDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedDetail) {
      return res.status(404).json({ success: false, message: "Staff detail not found" });
    }

    res.status(200).json({
      success: true,
      message: "Staff detail updated successfully",
      staffDetail: updatedDetail
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete staff detail by ID
exports.deleteStaffDetailById = async (req, res) => {
  try {
    const deletedDetail = await StaffDetail.findByIdAndDelete(req.params.id);

    if (!deletedDetail) {
      return res.status(404).json({ success: false, message: "Staff detail not found" });
    }

    res.status(200).json({
      success: true,
      message: "Staff detail deleted successfully",
      staffDetail: deletedDetail
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
