import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "../../services/studentApi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!id) {
      setError("Invalid student ID");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const response = await getStudentById(id);
        setStudent(response.data);
        setFormData({
          username: response.data.user?.username || "",
          email: response.data.user?.email || "",
          registerNumber: response.data.registerNumber || "",
          phoneNumber: response.data.phoneNumber || "",
          contactNumber: response.data.contactNumber || "",
          fatherName: response.data.fatherName || "",
          motherName: response.data.motherName || "",
          address: response.data.address || "",
          department: response.data.department || "",
          className: response.data.className || "",
          regulation: response.data.regulation || "",
          semester: response.data.semester || "",
          tenthMark: response.data.tenthMark || "",
          twelfthMark: response.data.twelfthMark || "",
          cgpa: response.data.cgpa || "",
        });
      } catch (err) {
        setError("Failed to load student data.");
        toast.error("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(id, formData);
      toast.success("Profile updated successfully");
      setShowEditModal(false);
      const updated = await getStudentById(id);
      setStudent(updated.data);
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading student profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
        <br></br>
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <br></br>
      <br></br>

      <div className="student-profile-container">
        <div className="profile-header">
          <h2 className="profile-heading">Student Profile</h2>
          <button className="edit-btn-small"
          onClick={() => setShowEditModal(true)}>
            Edit
          </button>
        </div>
        <br></br>
        <div className="profile-details">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {student.user?.username}</p>
            <p><strong>Email:</strong> {student.user?.email}</p>
            <p><strong>Register Number:</strong> {student.registerNumber}</p>
            <p><strong>Phone Number:</strong> {student.phoneNumber}</p>
            <p><strong>Contact Number:</strong> {student.contactNumber}</p>
            <p><strong>Father's Name:</strong> {student.fatherName}</p>
            <p><strong>Mother's Name:</strong> {student.motherName}</p>
            <p><strong>Address:</strong> {student.address}</p>
          </div>
          <div className="profile-section">
            <h3>Academic Information</h3>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Class Name:</strong> {student.className}</p>
            <p><strong>Batch:</strong> {student.regulation}</p>
            <p><strong>10th Mark:</strong> {student.tenthMark}</p>
            <p><strong>12th Mark:</strong> {student.twelfthMark}</p>
            <p><strong>Semester:</strong> {student.semester}</p>
            <p><strong>CGPA:</strong> {student.cgpa}</p>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleEditSubmit} className="student-form">
              <h3>Edit Profile</h3>
              <input name="username" value={formData.username} onChange={handleEditChange} placeholder="Student Name" />
              <input name="email" value={formData.email} onChange={handleEditChange} placeholder="Email" />
              <input name="registerNumber" value={formData.registerNumber} onChange={handleEditChange} placeholder="Register Number" />
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleEditChange} placeholder="Phone Number" />
              <input name="contactNumber" value={formData.contactNumber} onChange={handleEditChange} placeholder="Contact Number" />
              <input name="fatherName" value={formData.fatherName} onChange={handleEditChange} placeholder="Father's Name" />
              <input name="motherName" value={formData.motherName} onChange={handleEditChange} placeholder="Mother's Name" />
              <input name="address" value={formData.address} onChange={handleEditChange} placeholder="Address" />
              <input name="department" value={formData.department} onChange={handleEditChange} placeholder="Department" />
              <input name="className" value={formData.className} onChange={handleEditChange} placeholder="Class Name" />
              <input name="regulation" value={formData.regulation} onChange={handleEditChange} placeholder="Batch" />
              <input name="tenthMark" value={formData.tenthMark} onChange={handleEditChange} placeholder="10th Mark" />
              <input name="twelfthMark" value={formData.twelfthMark} onChange={handleEditChange} placeholder="12th Mark" />
              <input name="semester" value={formData.semester} onChange={handleEditChange} placeholder="Semester" />
              <input name="cgpa" value={formData.cgpa} onChange={handleEditChange} placeholder="CGPA" />

              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
