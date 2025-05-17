import React, { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../services/studentApi";

const AddStudentForm = ({ department, existingStudent, onClose, onSuccess }) => {
  const initialEmptyForm = {
    username: "",
    email: "",
    password: "",
    role: "student",
    department: department || "",
    phoneNumber: "",
    contactNumber: "",
    address: "",
    fatherName: "",
    motherName: "",
    regulation: "",
    tenthMark: "",
    twelfthMark: "",
    registerNumber: "",
    cgpa: "",
    semester: "",
  };

  const [formData, setFormData] = useState(initialEmptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingStudent) {
      setFormData({
        ...initialEmptyForm,
        ...existingStudent,
        password: "", // do not pre-fill password
      });
    }
  }, [existingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      setError("CGPA must be between 0 and 10.");
      return;
    }
    if (formData.tenthMark < 0 || formData.tenthMark > 100) {
      setError("10th mark must be between 0 and 100.");
      return;
    }
    if (formData.twelfthMark < 0 || formData.twelfthMark > 100) {
      setError("12th mark must be between 0 and 100.");
      return;
    }

    try {
      if (existingStudent) {
        await updateStudent(existingStudent._id, formData);
      } else {
        await createStudent(formData);
        setFormData(initialEmptyForm); // Reset after adding
      }
      onSuccess();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <h2>{existingStudent ? "Edit Student" : "Add Student"}</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <div className="form-grid">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input
              type="password"
              name="password"
              placeholder={existingStudent ? "Leave blank to keep old password" : "Password"}
              value={formData.password}
              onChange={handleChange}
              required={!existingStudent}
            />
            <input type="text" name="registerNumber" placeholder="Register Number" value={formData.registerNumber} onChange={handleChange} required />
            <input type="text" name="regulation" placeholder="Regulation (e.g., 2021-2025)" value={formData.regulation} onChange={handleChange} required />
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
            <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} />
            <input type="text" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} />
            <input type="text" name="motherName" placeholder="Mother's Name" value={formData.motherName} onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <input type="number" name="tenthMark" placeholder="10th Mark (%)" value={formData.tenthMark} onChange={handleChange} />
            <input type="number" name="twelfthMark" placeholder="12th Mark (%)" value={formData.twelfthMark} onChange={handleChange} />
            <input type="number" name="cgpa" placeholder="CGPA" step="0.1" value={formData.cgpa} onChange={handleChange} />
            <input type="number" name="semester" placeholder="Current Semester" value={formData.semester} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn save">{existingStudent ? "Update" : "Add"}</button>
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
