const express = require("express");
const router = express.Router();
const staffWorkDoneController = require("../controllers/staffWorkdoneController");


router.post("/", staffWorkDoneController.createWorkDone); // Create
router.get("/timetable/:timetableId", staffWorkDoneController.getWorkDoneByTimetable); // Read All
router.get("/:id", staffWorkDoneController.getWorkDoneById); // Read One
router.put("/:id", staffWorkDoneController.updateWorkDone); // Update
router.delete("/:id", staffWorkDoneController.deleteWorkDone); // Delete

router.get('/staff/:staffId/day/:day', staffWorkDoneController.getWorkDoneByStaffAndDay);
router.get('/by-date/:staffId/:date', staffWorkDoneController.getWorkDoneByStaffAndDate);
// router.get('/staff/:staffId', staffWorkDoneController.getWorkDoneByStaffId);


module.exports = router;
