import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [className, setClassName] = useState("Unknown");
  const [staffId, setStaffId] = useState(null);  // Added state for staffId
  const [department, setDepartment] = useState(""); // State for department

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored User:", storedUser);

    if (!storedUser) {
      console.log("No user found in localStorage");
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed User:", parsedUser);

      if (parsedUser?.className) {
        const userClassName = parsedUser.className.trim() || "Unknown";
        console.log("Class name extracted:", userClassName);
        setClassName(userClassName.toUpperCase());
      } else {
        console.log("Class name is empty or missing");
        setClassName("Unknown");
      }

      if (parsedUser?.name) {
        setUser(parsedUser);
        console.log("User set:", parsedUser);
      } else {
        console.log("User name is missing");
        navigate('/login');
      }

      // If staffId is present in the user object, set it
      if (parsedUser?.staffId) {
        setStaffId(parsedUser.staffId);
      } else {
        console.log("Staff ID is missing");
      }

      // If department is present in the user object, set it
      if (parsedUser?.department) {
        setDepartment(parsedUser.department);
      } else {
        console.log("Department is missing");
      }

    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/login');
  };

  if (!user) {
    console.log("No user data found, returning null");
    return null;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '50px'
        }}
      >
        <DashboardCard
          title="Manage Students"
          description={`Add, edit or remove students in ${className} class.`}
          buttonLabel="View Students"
          onClick={() => navigate(`/staffs/class/${className}`)}
        />

        <DashboardCard
          title="Manage Workdone"
          description={`Workdone entry form.`}
          buttonLabel="Submit Workdone"
          onClick={() => navigate(`/staff/workdone/${staffId}`)}
        />

        {/* ✅ NEW: View Timetable Card */}
        <DashboardCard
          title="View Timetable"
          description="Check your scheduled classes."
          buttonLabel="Timetable"
          // Check if staffId is available before navigating
          onClick={() => staffId ? navigate(`/staff/timetable/${staffId}`) : alert('Staff ID is missing')}
        />

        {/* ✅ Create Class Timetable Card */}
        <DashboardCard
          title="Create Class Timetable"
          description="Create or view your class timetable."
          buttonLabel="Create Timetable"
          // Check if staffId and department are available before navigating
          onClick={() => {
            if (staffId && department) {
              navigate(`/student-timetable/class/${className}/${department}`);
            } else {
              alert('Staff ID or Department is missing');
            }
          }}
        />
      </div>
    </div>
  );
};

export default StaffDashboard;
