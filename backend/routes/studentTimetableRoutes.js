const express = require('express');
const router = express.Router();
const {
  createTimetable,
  getAllTimetables,
  getTimetableByClass,
  updateTimetableByClassAndDay,
  getPeriodsByClassAndDay
} = require('../controllers/StudentTimetableController');

// Route to create a timetable for a class
router.post('/', createTimetable);

// Route to get all timetables
router.get('/', getAllTimetables);

// Route to get timetable by className, department, and semester
router.get('/:className/:department/', getTimetableByClass);

// Route to update timetable for a class and day
router.put('/:className/:department/:day', updateTimetableByClassAndDay);

// Route to get periods for a class on a specific day
router.get('/:className/:department/:day/periods', getPeriodsByClassAndDay);

module.exports = router;
