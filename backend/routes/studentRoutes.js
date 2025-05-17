const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByDepartment,
  getStudentsByStaff,
  getStudentsByHandledClass,
  getStudentsByClass,
  getStudentFilters,
  getStudentsByUserId,
  getPlacementsByStudent,
  studentsApplied,
  applyPlacement,
  getStudentFilesByDeptAndClass,
  uploadStudentFile,
  getUploadedFilesByDeptAndClass,
  getClassNamesByDepartment,
  updateSelectionStatus,
  

} = require("../controllers/studentController");
const { protect, student } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");


// Routes
router.post("/create", createStudent);
router.get("/", getAllStudents);
router.get("/files", getStudentFilesByDeptAndClass);

router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/department/:department", getStudentsByDepartment);
router.get('/classname/:className', getStudentsByClass);
router.get("/filters", getStudentFilters);
router.get("/:id", getStudentById);
router.get("/userid/:id" ,getStudentsByUserId);
router.get("/classes/:department", getClassNamesByDepartment);

router.post("/placements/:studentId/apply/:placementId", applyPlacement);
router.get('/:studentId/placements', getPlacementsByStudent);
router.post("/upload/:studentId", upload.single("file"), uploadStudentFile);
router.get("/files/:department/:className", getUploadedFilesByDeptAndClass);

module.exports = router;
