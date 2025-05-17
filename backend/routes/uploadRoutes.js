const express = require("express");
const multer = require("multer");
const Student = require("../models/Student");
const router = express.Router();

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // create 'uploads' folder if not existing
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST /api/students/:id/upload
router.post("/:id/upload", upload.array("files"), async (req, res) => {
  try {
    const studentId = req.params.id;
    const filePaths = req.files.map((file) => file.filename); // or file.path

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.uploadedFiles.push(...filePaths);
    await student.save();

    res.json({ message: "Files uploaded successfully", files: filePaths });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

module.exports = router;
