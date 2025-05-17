const express = require("express");
const router = express.Router();
const placementController = require("../controllers/placementController");
const { protect, placementOfficer, admin } = require("../middlewares/authMiddleware");

// CRUD
router.post("/", protect, placementOfficer , placementController.createPlacement); // Protected by both "protect" and "placementOfficer"
router.get("/", protect, placementController .getAllPlacements); // Only protected by "protect" middleware
router.delete("/:id", protect, placementOfficer, placementController.deletePlacement); // Protected by both "protect" and "placementOfficer"
router.put("/:id", protect, placementOfficer , placementController.updatePlacement); // Protected by both "protect" and "placementOfficer"

router.get("/applied-students/:id", placementController.getAppliedStudents);
router.get('/:id/applied-students/:department', placementController.getAppliedStudentsByDepartment);

router.get('/department-count/:id', placementController.getDepartmentWiseAppliedStudentsCount);
router.put('/:studentId/selection', placementController.updateSelectionStatus);

module.exports = router;