const Staff = require("../models/Staff");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create staff and associated user
exports.createStaff = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      facultyId,
      department,
      qualification,
      phoneNumber,
      experience,
      dateOfJoining,
      handledSubjects,
      className, // className is optional here
    } = req.body;

    if (
      !username || !email || !password || !facultyId || !department ||
      !qualification || !phoneNumber || !experience || !dateOfJoining
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: "staff",
      department,
      className: className || null,  // Handle className as optional
    });

    const staff = await Staff.create({
      user: user._id,
      facultyId,
      department,
      qualification,
      phoneNumber,
      experience,
      dateOfJoining,
      handledSubjects,
      className: className || null,  // Handle className as optional
    });

    user.staffId = staff._id;
    await user.save();

    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    console.error("❌ createStaff error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get staff by department
exports.getStaffByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const staffList = await Staff.find({ department })
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single staff
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("user", "username email role");

    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update staff and associated user
exports.updateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const {
      username,
      email,
      password,
      facultyId: newFacultyId,
      department,
      qualification,
      phoneNumber,
      experience,
      dateOfJoining,
      handledSubjects,
      className, // className is optional here
    } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Update staff fields
    staff.facultyId = newFacultyId || staff.facultyId;
    staff.department = department || staff.department;
    staff.qualification = qualification || staff.qualification;
    staff.phoneNumber = phoneNumber || staff.phoneNumber;
    staff.experience = experience || staff.experience;
    staff.dateOfJoining = dateOfJoining || staff.dateOfJoining;
    staff.handledSubjects = handledSubjects || staff.handledSubjects;
    staff.className = className || staff.className; // Handle className as optional
    await staff.save();

    // Update associated user
    const user = await User.findById(staff.user);
    if (!user) return res.status(404).json({ message: "Associated user not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = password;
    await user.save();

    res.status(200).json({ message: "Staff updated successfully", staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete staff and associated user
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    await User.findByIdAndDelete(staff.user);
    await Staff.findByIdAndDelete(req.params.id);

    res.json({ message: "Staff and associated user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign HOD role to a staff
exports.assignHODRole = async (req, res) => {
  try {
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const user = await User.findById(staff.user);
    if (!user) return res.status(404).json({ message: "Associated user not found" });

    user.role = "hod";
    await user.save();

    res.status(200).json({ message: "Staff promoted to HOD successfully", user });
  } catch (error) {
    console.error("assignHODRole error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Remove HOD role
exports.removeHODRole = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId).populate("user");

    if (!staff || !staff.user) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.user.role = "staff";
    await staff.user.save();

    return res.status(200).json({ message: "HOD role removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove HOD role", error: error.message });
  }
};


exports.getTimetablesByStaffId = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Find all timetables for the staff member
    const timetables = await StaffTimetable.find({ staff: staffId });

    if (!timetables || timetables.length === 0) {
      return res.status(404).json({ success: false, message: "No timetables found for this staff." });
    }

    res.status(200).json({
      success: true,
      timetables: timetables
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Assign Placement Officer role
exports.assignPlacementOfficer = async (req, res) => {
  try {
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const user = await User.findById(staff.user);
    if (!user) return res.status(404).json({ message: "Associated user not found" });

    user.role = "placementOfficer";
    await user.save();

    res.status(200).json({ message: "Staff promoted to Placement Officer successfully", user });
  } catch (error) {
    console.error("assignPlacementOfficer error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Remove Placement Officer role
exports.removePlacementOfficer = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId).populate("user");

    if (!staff || !staff.user) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.user.role = "staff";
    await staff.user.save();

    return res.status(200).json({ message: "Placement Officer role removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove Placement Officer role", error: error.message });
  }
};

// Assign Placement Coordinator role
exports.assignPlacementCoordinator = async (req, res) => {
  try {
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const user = await User.findById(staff.user);
    if (!user) return res.status(404).json({ message: "Associated user not found" });

    user.role = "placementCoordinator";  // Assigning Placement Coordinator role
    await user.save();

    res.status(200).json({ message: "Staff promoted to Placement Coordinator successfully", user });
  } catch (error) {
    console.error("assignPlacementCoordinator error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Remove Placement Coordinator role
exports.removePlacementCoordinator = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId).populate("user");

    if (!staff || !staff.user) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.user.role = "staff";  // Resetting role to 'staff'
    await staff.user.save();

    return res.status(200).json({ message: "Placement Coordinator role removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove Placement Coordinator role", error: error.message });
  }
};

