const express = require("express");
const router = express.Router();

const {
  createStaff,
  getAllStaff,
  getStaffByDepartment,
  getStaffById,
  updateStaff,
  deleteStaff,
  assignHODRole,
  removeHODRole,
  getStudentsByStaffId,
  assignPlacementOfficer,
  removePlacementOfficer,
  removePlacementCoordinator,
  assignPlacementCoordinator,
  // getStudentsByStaffClass,
} = require("../controllers/staffController");
const { protect, staff, admin } = require("../middlewares/authMiddleware");

router.post("/create", createStaff);
router.get("/", getAllStaff);
router.get("/department/:department", getStaffByDepartment);
router.get("/:id", getStaffById);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);
router.put("/assign-hod-role/:id", assignHODRole);
router.put("/remove-hod/:id", removeHODRole);
router.put("/assign-placement-officer/:id", assignPlacementOfficer);
router.put("/remove-placement-officer/:id", removePlacementOfficer);

router.put("/assign-placement-coordinator/:id", assignPlacementCoordinator);  // Add this route
router.put("/remove-placement-coordinator/:id", removePlacementCoordinator);  // Add this route

module.exports = router;
