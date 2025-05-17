import React, { useEffect, useState } from "react";
import { getClassNamesByDepartment } from "../../services/studentApi";
import { useNavigate, useParams } from "react-router-dom";
import "../placement/ClassBoxes.css";
import Navbar from "../../components/Navbar";

const ClassBoxes = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const { department } = useParams();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClassNamesByDepartment(department);
        setClasses(res.data);
      } catch (error) {
        console.error("Failed to fetch class names:", error);
      }
    };

    if (department) fetchClasses();
  }, [department]);

  const handleClassClick = (className) => {
    navigate(`/view-student-timetable/${className}/${department}`);
  };

  if (!department) {
    return <p>Please select a department first.</p>;
  }

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
    <div className="class-boxes">
      {classes.length === 0 ? (
        <p>No classes available for this department.</p>
      ) : (
        classes.map((className, index) => (
          <button key={index} onClick={() => handleClassClick(className)}>
            {className || "Unnamed Class"}
          </button>
        ))
      )}
    </div>
    </div>
  );
};

export default ClassBoxes;
