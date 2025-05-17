const Placement = require("../models/Placement");
const Student = require("../models/Student");
const sendEmail = require("../utils/sendEmail"); // Adjust path if needed

exports.createPlacement = async (req, res) => {
  try {
    const {
      type, companyName, jobRole, description, skillsRequired,
      eligibility,ctc, applyLink, location, departments, classNames,
      regulations, expiryDate
    } = req.body;

    const postedBy = req.user._id;

    // 1. Find eligible students
    const eligibleStudents = await Student.find({
      department: { $in: departments },
      regulation: { $in: regulations }
    }).populate("user", "email username");

    // 2. Create the placement entry
    const placement = new Placement({
      type,
      companyName,
      jobRole,
      description,
      skillsRequired,
      eligibility,
      ctc,
      applyLink,
      location,
      departments,
      classNames,
      regulations,
      expiryDate,
      postedBy,
      appliedStudents: []
    });

    await placement.save();

    for (const student of eligibleStudents) {
      if (student.user && student.user.email) {
        const message = `
Hello ${student.user.username},

A new ${type} opportunity has been posted for your department (${student.department}) and regulation (${student.regulation}).

Company: ${companyName}
Role: ${jobRole}
Drive Location: ${location || 'N/A'}
View Student Dashboard for more details.

Best of luck!
College Placement Team
`;

        await sendEmail({
          email: student.user.email,
          subject: `New ${type} Opportunity at ${companyName}`,
          message
        });
      }
    }

    res.status(201).json({ message: "Placement created and emails sent", placement });
  } catch (error) {
    console.error("Error creating placement:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().populate("postedBy", "username email");
    res.status(200).json(placements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);
    if (!placement) return res.status(404).json({ error: "Placement not found" });
    res.status(200).json({ message: "Placement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updatePlacement = async (req, res) => {
  try {
    const placementId = req.params.id;
    const {
      type,
      companyName,
      jobRole,
      description,
      skillsRequired,
      eligibility,
      ctc,
      applyLink,
      location,
      departments,
      classNames,
      regulations,
      expiryDate,
    } = req.body;

    const placement = await Placement.findById(placementId);
    if (!placement) return res.status(404).json({ message: "Placement not found" });


    placement.type = type;
    placement.companyName = companyName;
    placement.jobRole = jobRole;
    placement.description = description;
    placement.skillsRequired = Array.isArray(skillsRequired)
      ? skillsRequired
      : skillsRequired.split(",").map((s) => s.trim());
    placement.eligibility = eligibility;
    placement.ctc =ctc;
    placement.applyLink = applyLink;
    placement.location = location;
    placement.departments = departments;
    placement.classNames = classNames;
    placement.regulations = regulations;
    placement.expiryDate = expiryDate;

    await placement.save();

    res.json({ message: "Placement updated successfully", placement });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ error: error.message });
  }
};




exports.getAppliedStudents = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate("appliedStudents"); // ← removed field limitation

    if (!placement) return res.status(404).json({ error: "Placement not found" });

    res.status(200).json(placement.appliedStudents); // This will now contain full student info
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAppliedStudentsByDepartment = async (req, res) => {
  const { id, department } = req.params;

  try {
    // Find placement by ID and populate appliedStudents
    const placement = await Placement.findById(id).populate({
      path: 'appliedStudents',
      match: { department }, // Ensure department is part of the student schema
      populate: {
        path: 'user', // Assuming 'user' is a reference inside 'appliedStudents'
        select: 'username email'
      }
    });

    // If placement not found
    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    // Filter out null students (if the match on department failed)
    const filteredStudents = placement.appliedStudents.filter(student => student);

    // If no students found
    if (filteredStudents.length === 0) {
      return res.status(404).json({ error: `No students applied from ${department} department` });
    }

    // Send the filtered students list
    res.status(200).json(filteredStudents);
  } catch (err) {
    // Handle any errors during database query
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// New Controller
exports.getDepartmentWiseAppliedStudentsCount = async (req, res) => {
  const { id } = req.params;
  
  try {
    const placement = await Placement.findById(id).populate({
      path: 'appliedStudents',
      populate: { path: 'user', select: 'username email' },
    });

    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    const departmentCount = {};

    placement.appliedStudents.forEach(student => {
      if (student && student.department) {
        departmentCount[student.department] = (departmentCount[student.department] || 0) + 1;
      }
    });

    res.status(200).json(departmentCount); // Example: { CSE: 10, ECE: 7, MECH: 2 }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSelectionStatus = async (req, res) => {
  const { studentId } = req.params;
  const { status, placementId } = req.body; // Assuming you send the placementId along with the status

  if (!['selected', 'unselected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Fetch the placement details using the placementId to get the company name
    const placement = await Placement.findById(placementId);

    if (!placement) {
      return res.status(404).json({ message: 'Placement not found' });
    }

    // Update the student's selection status
    const student = await Student.findByIdAndUpdate(
      studentId,
      { selectionStatus: status },
      { new: true }
    ).populate('user', 'username email');  // Populate user info (email, username)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If the status is 'selected', send an email
    if (status === 'selected' && student.user && student.user.email) {
      const message = `
          Hello ${student.user.username},

          Congratulations! You have been selected for the placement opportunity at ${placement.companyName}.

          Role: ${placement.jobRole}
          CTC: ${placement.ctc || 'N/A'}

          Best regards,
          College Placement Team
          `;

      try {
        await sendEmail({
          email: student.user.email,
          subject: `Placement Status: Selected at ${placement.companyName}`,
          message
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Optionally handle failure to send email, but continue with status update
      }
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating selection status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};