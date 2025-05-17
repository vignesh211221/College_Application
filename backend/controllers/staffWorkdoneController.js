const StaffWorkDone = require("../models/StaffWorkDone");

exports.createWorkDone = async (req, res) => {
  try {
    const {
      staff,
      day,
      periodNumber,
      subject,
      class: className,
      unit,
      syllabus,
      coveredTopic,
      completedTime,
      timetableRef,
      date // might be optional
    } = req.body;

    const workDone = new StaffWorkDone({
      staff,
      day,
      date: date ? new Date(date) : new Date(), // Use today's date if not provided
      periodNumber,
      subject,
      class: className,
      unit,
      syllabus,
      coveredTopic,
      completedTime,
      timetableRef
    });

    await workDone.save();
    res.status(201).json({ success: true, workDone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all StaffWorkDone entries by timetableId
exports.getWorkDoneByTimetable = async (req, res) => {
  try {
    const timetableId = req.params.timetableId;
    
    // Fetch work done for the specified timetable
    const workDone = await StaffWorkDone.find({ timetableRef: timetableId });
    
    if (!workDone || workDone.length === 0) {
      return res.status(404).json({ success: false, message: "No work done entries found for this timetable" });
    }

    res.status(200).json({ success: true, workDone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single StaffWorkDone entry by ID
exports.getWorkDoneById = async (req, res) => {
  try {
    const workDoneId = req.params.id;

    // Find a specific work done entry by ID
    const workDone = await StaffWorkDone.findById(workDoneId);

    if (!workDone) {
      return res.status(404).json({ success: false, message: "Work done entry not found" });
    }

    res.status(200).json({ success: true, workDone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update StaffWorkDone entry by ID
exports.updateWorkDone = async (req, res) => {
    try {
      // Find the work done entry by ID and update it with the provided data
      const updatedWorkDone = await StaffWorkDone.findByIdAndUpdate(
        req.params.id, // The ID from the URL
        req.body, // The updated data from the request body
        { new: true } // Return the updated document
      );
  
      // Check if the work done entry was found and updated
      if (!updatedWorkDone) {
        return res.status(404).json({ success: false, message: "Work done entry not found" });
      }
  
      // Return success response with the updated work done entry
      res.status(200).json({ success: true, updatedWorkDone });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  

// Delete StaffWorkDone entry by ID
exports.deleteWorkDone = async (req, res) => {
  try {
    const workDoneId = req.params.id;

    // Find and delete the work done entry by ID
    const deletedWorkDone = await StaffWorkDone.findByIdAndDelete(workDoneId);

    if (!deletedWorkDone) {
      return res.status(404).json({ success: false, message: "Work done entry not found" });
    }

    res.status(200).json({ success: true, message: "Work done entry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getWorkDoneByStaffAndDay = async (req, res) => {
  const { staffId, day } = req.params;  // Use req.params instead of req.query

  if (!staffId || !day) {
    return res.status(400).json({ message: 'staffId and day are required' });
  }

  try {
    // Fetch the work done entries for the given staff and day
    const workEntries = await StaffWorkDone.find({ staff: staffId, day });

    // Check if no entries were found
    if (!workEntries || workEntries.length === 0) {
      return res.status(404).json({ message: 'No work done entries found for this staff member on this day.' });
    }

    res.status(200).json(workEntries);
  } catch (err) {
    console.error('Error fetching workdone:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getWorkDoneByStaffAndDate = async (req, res) => {
  const { staffId, date } = req.params;  // Get from URL parameters

  if (!staffId || !date) {
    return res.status(400).json({ message: 'staffId and date are required' });
  }

  try {
    const targetDate = new Date(date);

    // Only match the date portion, ignoring time
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const workEntries = await StaffWorkDone.find({
      staff: staffId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!workEntries || workEntries.length === 0) {
      return res.status(404).json({ message: 'No work done entries found for this staff member on this date.' });
    }

    res.status(200).json(workEntries);
  } catch (err) {
    console.error('Error fetching work done by date:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
