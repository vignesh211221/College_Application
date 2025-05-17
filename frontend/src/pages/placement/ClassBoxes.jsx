import React, { useEffect, useState } from "react";
import { getClassNamesByDepartment } from "../../services/studentApi";
import { useNavigate, useParams } from "react-router-dom";
import "./ClassBoxes.css";
import Navbar from "../../components/Navbar";

const ClassBoxes = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const { department } = useParams();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // or fetch from user object
    setRole(storedRole);
  }, []);

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
    navigate(`/uploaded-files/${department}/${className}`);
  };

  const handleDashboardRedirect = () => {
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "placementofficer") {
      navigate("/placement-dashboard");
    } else if (role === "placementcoordinator") {
      // Don't show the button if the role is placementcoordinator
      return;
    } else {
      toast.error("Unauthorized role");
    }
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

      {/* Conditionally render the "Back to Dashboard" button */}
      {role !== "placementcoordinator" && (
        <button onClick={handleDashboardRedirect} className="dash-btn">
          Back to Dashboard
        </button>
      )}
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
