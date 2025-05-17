import React, { useEffect, useState } from "react";
import {
  getStaffByDepartment,
  createStaff,
  updateStaff,
  deleteStaff,
  assignHODRole,
  removeHODRole,
} from "../../services/staffApi";
import "../admin/StudentList.css";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const StaffList = () => {
  const { department } = useParams();
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignedHOD, setAssignedHOD] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    facultyId: "",
    department: department || "",
    qualification: "",
    phoneNumber:"",
    experience: "",
    dateOfJoining: "",
    handledSubjects: [],
    className: "",
  });

  const fetchStaff = async () => {
    try {
      const res = await getStaffByDepartment(department);
      setStaffList(res.data);

      const hod = res.data.find((staff) => staff.user?.role === "hod");
      setAssignedHOD(hod ? hod.user.username : null);
    } catch (error) {
      toast.error("Error fetching staff");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [department]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.handledSubjects];
    updatedSubjects[index][field] = value;
    setFormData((prev) => ({ ...prev, handledSubjects: updatedSubjects }));
  };

  const handleAddSubject = () => {
    setFormData((prev) => ({
      ...prev,
      handledSubjects: [...prev.handledSubjects, { subject: "", class: "" }],
    }));
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...formData.handledSubjects];
    updatedSubjects.splice(index, 1);
    setFormData((prev) => ({ ...prev, handledSubjects: updatedSubjects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.facultyId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const staffData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        facultyId: formData.facultyId.trim(),
        department: formData.department,
        qualification: formData.qualification,
        phoneNumber:formData.phoneNumber,
        experience: formData.experience,
        dateOfJoining: formData.dateOfJoining,
        className: formData.className,
        handledSubjects: formData.handledSubjects,
      };

      if (isEdit && selectedStaff) {
        await updateStaff(selectedStaff._id, staffData);
        toast.success("Staff updated successfully");
      } else {
        if (!formData.password) {
          toast.error("Password is required for new staff");
          return;
        }
        staffData.password = formData.password;
        await createStaff(staffData);
        toast.success("Staff created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      toast.error("Error saving staff");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      facultyId: "",
      department: department || "",
      qualification: "",
      phoneNumber:"",
      experience: "",
      dateOfJoining: "",
      handledSubjects: [],
      className: "",
    });
    setIsEdit(false);
    setSelectedStaff(null);
  };

  const handleEdit = (staff) => {
    setIsEdit(true);
    setSelectedStaff(staff);
    setFormData({
      username: staff.user?.username || "",
      email: staff.user?.email || "",
      password: "",
      facultyId: staff.facultyId || "",
      department: staff.department || department,
      qualification: staff.qualification || "",
      phoneNumber:staff.phoneNumber ||"",
      experience: staff.experience || "",
      dateOfJoining: staff.dateOfJoining?.split("T")[0] || "",
      handledSubjects: staff.handledSubjects || [],
      className: staff.className || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await deleteStaff(id);
        toast.success("Staff deleted");
        fetchStaff();
      } catch (error) {
        toast.error("Error deleting staff");
      }
    }
  };


  return (
    <div>
      <Navbar onLogout={() => navigate('/login')} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <br></br>
      <br></br>
      <div className="student-list-container">
        <div className="container">
          <h2>{department} Department - Staff List</h2>

          {assignedHOD ? (
            <h2>
              Department HOD: <strong>{assignedHOD}</strong>
            </h2>
          ) : (
            <h2>No HOD assigned yet.</h2>
          )}
          <div className="header-controls">
            <button className="add-btn" onClick={() => setShowModal(true)}>
              + Add Staff
            </button>
          </div>
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Email</th>
                  <th>Faculty ID</th>
                  <th>Qualification</th>
                  <th>Phone Number</th>
                  <th>Experience</th>
                  <th>Date of Joining</th>
                  <th>Class Name</th>
                  <th>Handled Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff._id}>
                    <td>{staff.user?.username}</td>
                    <td>{staff.user?.email}</td>
                    <td>{staff.facultyId}</td>
                    <td>{staff.qualification}</td>
                    <td>{staff.phoneNumber}</td>
                    <td>{staff.experience}</td>
                    <td>{staff.dateOfJoining?.split("T")[0]}</td>
                    <td>{staff.className}</td>
                    <td>
                      {staff.handledSubjects?.map((item, index) => (
                        <div key={index}>
                          {item.subject} ({item.class})
                        </div>
                      ))}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(staff)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(staff._id)}
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
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                  />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                  {!isEdit && (
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                    />
                  )}
                  <input
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleInputChange}
                    placeholder="Faculty ID"
                  />
                  <input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="Qualification"
                  />
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="PhoneNumber"
                  />
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Experience"
                  />
                  <input
                    name="dateOfJoining"
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                  />
                  <input
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="Class Name"
                  />

<div>
                <label>Handled Subjects</label>
                {formData.handledSubjects.map((entry, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={entry.subject}
                      onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Class"
                      value={entry.class}
                      onChange={(e) => handleSubjectChange(index, "class", e.target.value)}
                    />
                    
                    <button type="button" onClick={() => handleRemoveSubject(index)}>Remove</button>
                  </div>
                  ))}
                  <button className="addsub-btn"  type="button" onClick={handleAddSubject}>
                    Add Subject
                  </button>
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit">
                      {isEdit ? "Save Changes" : "Add Staff"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffList;
