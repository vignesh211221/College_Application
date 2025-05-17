import React, { useEffect, useState } from "react";
import {
  getStudentsByDepartment,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentApi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../admin/StudentList.css";
import Navbar from "../../components/Navbar";

const StudentList = () => {
  const { department } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegulation, setSelectedRegulation] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const initialFormState = {
    username: "",
    email: "",
    password: "",
    registerNumber: "",
    department: department || "",
    phoneNumber: "",
    contactNumber: "",
    fatherName: "",
    motherName: "",
    address: "",
    tenthMark: "",
    twelfthMark: "",
    regulation: "",
    className: "",
    cgpa: "",
    semester: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchStudents();
  }, [department]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedRegulation, students]);

  

  const fetchStudents = async () => {
    try {
      const res = await getStudentsByDepartment(department);
      const sorted = res.data.sort((a, b) =>
        b.regulation.localeCompare(a.regulation)
      );
      setStudents(sorted);
      setFilteredStudents(sorted);
    } catch (error) {
      toast.error("Error fetching students");
    }
  };

  const filterStudents = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = students.filter((s) => {
      const matchesSearch =
        (s.registerNumber?.toLowerCase().includes(lowerSearch)) || 
        (s.user?.username?.toLowerCase().includes(lowerSearch));
      const matchesRegulation =
        !selectedRegulation || s.regulation === selectedRegulation;
      return matchesSearch && matchesRegulation;
    });
    setFilteredStudents(filtered);
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      registerNumber,
      ...rest
    } = formData;

    if (!username || !email || !registerNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const studentData = {
        username: username.trim(),
        email: email.trim(),
        registerNumber: registerNumber.trim(),
        ...rest,
      };

      if (isEdit && selectedStudent) {
        await updateStudent(selectedStudent._id, studentData);
        toast.success("Student updated successfully");
      } else {
        if (!password) {
          toast.error("Password is required for new students");
          return;
        }
        studentData.password = password;
        await createStudent(studentData);
        toast.success("Student created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error("Error saving student");
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedStudent(null);
    setIsEdit(false);
  };

  const handleEdit = (student) => {
    setIsEdit(true);
    setSelectedStudent(student);
    setFormData({
      username: student.user?.username || "",
      email: student.user?.email || "",
      password: "",
      registerNumber: student.registerNumber || "",
      department: student.department || department,
      phoneNumber: student.phoneNumber || "",
      contactNumber: student.contactNumber || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      address: student.address || "",
      tenthMark: student.tenthMark || "",
      twelfthMark: student.twelfthMark || "",
      regulation: student.regulation || "",
      className: student.className || "",
      cgpa: student.cgpa || "",
      semester: student.semester || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        toast.success("Student deleted");
        fetchStudents();
      } catch (error) {
        toast.error("Error deleting student");
      }
    }
  };

  const uniqueRegulations = [...new Set(students.map((s) => s.regulation))].sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <button onClick={() => navigate("/admin-dashboard")} className="dash-btn">
        Back to Dashboard
      </button>
      <br></br>
      <br></br>
      
      <div className="student-list-container">
        <div className="header-controls">
          <h2>{department} Students</h2>
          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Student
          </button>
        </div>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search by name or register no"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={selectedRegulation}
            onChange={(e) => setSelectedRegulation(e.target.value)}
          >
            <option value="">All Batch</option>
            {uniqueRegulations.map((reg) => (
              <option key={reg} value={reg}> {/* Add key prop here */}
                {reg}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Register No</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Father</th>
                <th>Mother</th>
                <th>Contact</th>
                <th>Address</th>
                <th>10th Mark</th>
                <th>12th Mark</th>
                <th>Batch</th>
                <th>Class Name</th>
                <th>CGPA</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.user?.username}</td>
                  <td>{student.user?.email}</td>
                  <td>{student.registerNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{student.fatherName}</td>
                  <td>{student.motherName}</td>
                  <td>{student.contactNumber}</td>
                  <td>{student.address}</td>
                  <td>{student.tenthMark}</td>
                  <td>{student.twelfthMark}</td>
                  <td>{student.regulation}</td>
                  <td>{student.className}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.semester}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="content">
              <form onSubmit={handleSubmit} className="student-form">
                <h3>{isEdit ? "Edit Student" : "Add Student"}</h3>
                <input type="text" name="username" placeholder="Student Name" value={formData.username} onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                {!isEdit && (
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                )}
                <input type="text" name="registerNumber" placeholder="Register No" value={formData.registerNumber} onChange={handleInputChange} />
                <input type="text" name="phoneNumber" placeholder="Phone" value={formData.phoneNumber} onChange={handleInputChange} />
                <input type="text" name="contactNumber" placeholder="Contact No" value={formData.contactNumber} onChange={handleInputChange} />
                <input type="text" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleInputChange} />
                <input type="text" name="motherName" placeholder="Mother's Name" value={formData.motherName} onChange={handleInputChange} />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
                <input type="text" name="tenthMark" placeholder="10th Mark" value={formData.tenthMark} onChange={handleInputChange} />
                <input type="text" name="twelfthMark" placeholder="12th Mark" value={formData.twelfthMark} onChange={handleInputChange} />
                <input type="text" name="regulation" placeholder="Batch Ex:(2021-2025)" value={formData.regulation} onChange={handleInputChange} />
                <input type="text" name="className" placeholder="Class Name Ex:(CSE II,CSE III-A)" value={formData.className} onChange={handleInputChange} />
                <input type="text" name="cgpa" placeholder="CGPA" value={formData.cgpa} onChange={handleInputChange} />
                <input type="text" name="semester" placeholder="Semester" value={formData.semester} onChange={handleInputChange} />

                <div className="form-actions">
                  <button type="submit">{isEdit ? "Save Changes" : "Add Student"}</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
