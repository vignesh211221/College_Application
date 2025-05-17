const StaffTimetable = require("../models/StaffTimetable");
const mongoose = require("mongoose");

exports.createTimetable = async (req, res) => {
  try {
    const { staff, day, periods, date } = req.body;

    // Check if timetable already exists for that staff and day
    let existingTimetable = await StaffTimetable.findOne({ staff, day });

    const finalDate = date ? new Date(date) : new Date();

    if (existingTimetable) {
      // Update the existing one instead
      existingTimetable.periods = periods;
      existingTimetable.date = finalDate;
      await existingTimetable.save();

      return res.status(200).json({
        success: true,
        message: "Timetable updated successfully",
        timetable: existingTimetable
      });

    } else {
      // Create new timetable
      const newTimetable = await StaffTimetable.create({
        staff,
        day,
        periods,
        date: finalDate
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

exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await StaffTimetable.find().populate("staff");
    res.status(200).json({ success: true, timetables });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await StaffTimetable.findById(req.params.id).populate("staff");

    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    res.status(200).json({ success: true, timetable });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const timetableId = req.params.id;
    const existingTimetable = await StaffTimetable.findById(timetableId);

    if (!existingTimetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    const updatedTimetable = await StaffTimetable.findByIdAndUpdate(
      timetableId,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      updatedTimetable,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    await StaffTimetable.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Timetable deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTimetableByStaffAndDay = async (req, res) => {
  try {
    const { staffId, day } = req.params;

    const existing = await StaffTimetable.findOne({ staff: staffId, day });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Timetable not found for this staff and day" });
    }

    const updated = await StaffTimetable.findOneAndUpdate(
      { staff: staffId, day },
      req.body,
      { new: true }
    ).populate("staff");

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPeriodsByStaffAndDay = async (req, res) => {
  try {
    const { staffId, day } = req.params;

    const timetable = await StaffTimetable.findOne({ staff: staffId, day });

    if (!timetable) {
      return res.status(404).json({ success: false, message: "No timetable found for this staff on this day." });
    }

    res.status(200).json({
      success: true,
      day: timetable.day,
      periods: timetable.periods
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTimetableByStaffID = async (req, res) => {
  try {
    const timetable = await StaffTimetable.find({ staff: req.params.staffId }).populate("staff");
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
