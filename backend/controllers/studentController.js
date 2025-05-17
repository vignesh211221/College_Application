const Student = require("../models/Student");
const User = require("../models/User");
const Staff = require("../models/Staff");
const mongoose = require("mongoose");
const Placement = require("../models/Placement");
const Upload = require("../models/upload");

// Create a new student and associated user
exports.createStudent = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      registerNumber,
      department,
      phoneNumber,
      fatherName,
      motherName,
      contactNumber,
      address,
      tenthMark,
      twelfthMark,
      regulation,
      className,
      cgpa,
      semester,
    } = req.body;

    if (!username || !email || !password || !department ||  !className || !registerNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Create the base user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: "student", // default role
      department,
      className,
    });

    // 2. Create the student profile
    const student = await Student.create({
      user: user._id,
      registerNumber,
      department,
      phoneNumber,
      fatherName,
      motherName,
      contactNumber,
      address,
      tenthMark,
      twelfthMark,
      regulation,
      className,
      cgpa,
      semester,
    });

    res.status(201).json({ message: "Student created successfully", student , studentId: student._id  });
  } catch (error) {
    console.error("❌ Error in createStudent:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user", "username email");
    res.status(200).json(students);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const students = await Student.find({ department })
      .populate("user", "username email role") // populate from User collection
      .sort({ regulation: -1 }); // descending regulation

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("user", "username email studentId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    console.error("Fetch by ID error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update a student and associated user
exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      username,
      email,
      password,
      registerNumber,
      department,
      phoneNumber,
      fatherName,
      motherName,
      contactNumber,
      address,
      tenthMark,
      twelfthMark,
      regulation,
      className,
      cgpa,
      semester,
    } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Update student fields
    student.registerNumber = registerNumber;
    student.department = department;
    student.phoneNumber = phoneNumber;
    student.fatherName = fatherName;
    student.motherName = motherName;
    student.contactNumber = contactNumber;
    student.address = address;
    student.tenthMark = tenthMark;
    student.twelfthMark = twelfthMark;
    student.regulation = regulation;
    student.className = className,
    student.cgpa = cgpa;
    student.semester = semester;
    await student.save();

    // Update associated user
    const user = await User.findById(student.user);
    if (!user) return res.status(404).json({ message: "Associated user not found" });

    user.username = username;
    user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete a student and associated user
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Delete the associated user first
    await User.findByIdAndDelete(student.user);

    // Delete the student
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student and associated user deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentsByClass = async (req, res) => {
  try {
    const className = req.params.className.trim();

    const students = await Student.find({
      className: { $regex: new RegExp(`^${className}$`, 'i') }
    }).populate("user", "username email");

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found in this class' });
    }

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students by class:", error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStudentFilters = async (req, res) => {
  try {
    const classNames = await Student.distinct("className");
    const departments = await Student.distinct("department");
    const regulations = await Student.distinct("regulation");

    res.status(200).json({ classNames, departments, regulations });
  } catch (error) {
    console.error("Error fetching filters:", error.message);
    res.status(500).json({ error: "Failed to fetch filters" });
  }
};

exports.getStudentsByUserId = async (req, res) => {
  try {
    // Fetch all students related to the specific userId
    const students = await Student.find({ "user": req.params.userId })
      .populate("user", "username email "); // Populate user details

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this user" });
    }

    res.json(students);
  } catch (error) {
    console.error("Fetch by userId error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get placements by student details (department, regulation, className)
exports.getPlacementsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Ensure studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Find the student using the studentId
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Fetch placements for the student's department and regulation
    const placements = await Placement.find({
      departments: student.department,
      regulations: student.regulation,
      expiryDate: { $gte: new Date() },
    });

    res.status(200).json(placements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.applyPlacement = async (req, res) => {
  try {
    const { studentId } = req.params; // Extract studentId from params

    // Ensure studentId is valid
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Find the student using the studentId
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the placement using the placement ID from the params
    const placement = await Placement.findById(req.params.placementId);
    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    // Prevent duplicate application
    if (placement.appliedStudents.includes(student._id)) {
      return res.status(400).json({ error: "Already applied to this placement" });
    }

    // Add the student's ID to the applied students list
    placement.appliedStudents.push(student._id);
    await placement.save();

    res.status(200).json({ message: "Successfully applied to placement", placement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// Controller to get files based on department and class
exports.getStudentFilesByDeptAndClass = async (req, res) => {
  const { department, className } = req.query;

  try {
    const students = await Student.find(
      { department, className },
      "registerNumber uploadedFiles"
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving files", error });
  }
};



exports.uploadStudentFile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const newUpload = new Upload({
      student: student._id,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
    });

    await newUpload.save();
    res.status(201).json({ message: "File uploaded", upload: newUpload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUploadedFilesByDeptAndClass = async (req, res) => {
  const { department, className } = req.params;

  try {
    // Step 1: Get students for the given department and class
    const students = await Student.find({ department, className }).select("_id");

    // Step 2: Fetch uploads and populate student
    const uploads = await Upload.find({ student: { $in: students } })
      .populate({
        path: "student",
        select: "registerNumber department className user",
        populate: {
          path: "user",
          select: "username email"
        }
      });

    // Step 3: Respond with the uploaded files and student data
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getClassNamesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const classNames = await Student.distinct("className", { department });

    res.status(200).json(classNames); // Return class names as an array
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch class names", error });
  }
};
