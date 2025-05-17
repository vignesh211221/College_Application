import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../admin/StudentDepartment.css";

const initialDepartments = ["CSE", "ECE", "EEE", "BME", "MECH", "CIVIL", "BIO TECH", "AIDS", "Robotics"];

const StudentDepartment = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState(initialDepartments);
  const [newDept, setNewDept] = useState("");

  const handleDepartmentClick = (dept) => {
    navigate(`/classes/${dept}`); // Make sure this is correct path
  };

  const handleAddDepartment = () => {
    if (newDept && !departments.includes(newDept)) {
      setDepartments((prevDepartments) => [...prevDepartments, newDept]);
      setNewDept("");
    }
  };

  const handleDeleteDepartment = (dept) => {
    setDepartments((prevDepartments) =>
      prevDepartments.filter((department) => department !== dept)
    );
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <br></br>
      <br></br>

      <div className="department-container">
        <div className="department-header">
          <h2>Select a Department</h2>
          <div className="add-department">
            <input
              type="text"
              placeholder="Add new department"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
            />
            <button onClick={handleAddDepartment}>Add</button>
          </div>
        </div>

        <div className="department-grid">
          {departments.map((dept) => (
            <div
              key={dept}
              className="department-box"
              onClick={() => handleDepartmentClick(dept)}
            >
              <span>{dept}</span>
              <button
                className="delete-btn3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDepartment(dept);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDepartment;
