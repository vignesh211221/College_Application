import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  const [studentId, setStudentId] = useState(null);
  const [className, setClassName] = useState("Unknown");
  const [department, setDepartment] = useState("Unknown");

  useEffect(() => {
    const storedStudentId = localStorage.getItem("studentId");
    const storedUser = localStorage.getItem("user");

    // Debugging log
    console.log("Stored Student ID:", storedStudentId);
    console.log("Stored User:", storedUser);

    if (!storedStudentId || !storedUser) {
      navigate('/login');
      return;
    }

    setStudentId(storedStudentId);

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser?.className) {
        const userClassName = parsedUser.className.trim() || "Unknown";
        setClassName(userClassName.toUpperCase());
      } else {
        setClassName("Unknown");
      }

      if (parsedUser?.department) {
        setDepartment(parsedUser.department.trim() || "Unknown");
      } else {
        setDepartment("Unknown");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("studentId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/login');
  };

  // Debugging log for studentId before passing to upload component
  console.log("Student Dashboard - Student ID:", studentId);

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '50px'
      }}>
        <DashboardCard
          title="My Profile"
          description="View and update your student details."
          buttonLabel="Go to Profile"
          onClick={() => navigate(`/studentprofile/${studentId}`)}
        />
        <DashboardCard
          title="Timetable"
          description="View your class schedule and timing."
          buttonLabel="View Timetable"
          onClick={() => navigate(`/view-student-timetable/${className}/${department}`)}
        />
        <DashboardCard
          title="Placement Drives"
          description="See upcoming placement opportunities and Apply placements."
          buttonLabel="Apply Placements"
          onClick={() => navigate(`/student/${studentId}/placements`)}
        />
        <DashboardCard
          title="Upload Placement Documents"
          description="Upload necessary documents for placement drives."
          buttonLabel="Upload Files"
          onClick={() => navigate(`/uploads/${studentId}`)}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
