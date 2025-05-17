const express = require("express");
const router = express.Router();
const controller = require("../controllers/staffTimetableController");

router.post("/", controller.createTimetable);
router.get("/", controller.getAllTimetables);
router.get("/:id", controller.getTimetableById);
router.put("/:id", controller.updateTimetable);
router.delete("/:id", controller.deleteTimetable);

router.get("/staff/:staffId", controller.getTimetableByStaffID);
router.get("/:staffId/:day", controller.getPeriodsByStaffAndDay);
router.put("/:staffId/:day", controller.updateTimetableByStaffAndDay);

module.exports = router;
