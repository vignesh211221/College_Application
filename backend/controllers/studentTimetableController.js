const StudentTimetable = require("../models/StudentTimetable");
const mongoose = require("mongoose");

// Create a timetable based on className
exports.createTimetable = async (req, res) => {
  try {
    const { className, department, day, periods } = req.body;

    // Check if timetable already exists for that class and day
    let existingTimetable = await StudentTimetable.findOne({
      className,
      department,
      day
    });

    if (existingTimetable) {
      // Update the existing timetable
      existingTimetable.periods = periods;
      await existingTimetable.save();

      return res.status(200).json({
        success: true,
        message: "Timetable updated successfully",
        timetable: existingTimetable
      });
    } else {
      // Create a new timetable if not exists
      const newTimetable = await StudentTimetable.create({
        className,
        department,
        day,
        periods
      });

      return res.status(201).json({
        success: true,
        message: "Timetable created successfully",
        timetable: newTimetable
      });
    }

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get all timetables
exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await StudentTimetable.find();
    res.status(200).json({ success: true, timetables });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get timetable by className (class, department, and semester)
// Get timetable by className (class and department)
exports.getTimetableByClass = async (req, res) => {
  try {
    const { className, department } = req.params;

    const timetables = await StudentTimetable.find({
      className,
      department
    });

    if (!timetables || timetables.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found for this class."
      });
    }

    res.status(200).json({ success: true, timetables }); // <-- Return all days
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Update timetable for a specific class on a specific day
exports.updateTimetableByClassAndDay = async (req, res) => {
  try {
    const { className, department, day } = req.params;
    const { periods } = req.body;

    const existingTimetable = await StudentTimetable.findOne({
      className,
      department,
      day
    });

    if (!existingTimetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found for this class on this day."
      });
    }

    existingTimetable.periods = periods;
    await existingTimetable.save();

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      timetable: existingTimetable
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get periods for a class on a specific day
exports.getPeriodsByClassAndDay = async (req, res) => {
  try {
    const { className, department, day } = req.params;

    const timetable = await StudentTimetable.findOne({
      className,
      department,
      day
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "No timetable found for this class on this day."
      });
    }

    res.status(200).json({
      success: true,
      periods: timetable.periods
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
