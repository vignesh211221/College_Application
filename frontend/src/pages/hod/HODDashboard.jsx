import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';

const HODDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [department, setDepartment] = useState("UNKNOWN");
  const [className, setClassName] = useState("UNKNOWN");
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("User not found in localStorage");
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed User in HODDashboard:", parsedUser);

      // Set basic user details
      setUser(parsedUser);

      // Set department and class
      setDepartment(parsedUser?.department?.toUpperCase() || "UNKNOWN");
      setClassName(parsedUser?.className?.toUpperCase() || "UNKNOWN");

      // Set staffId if exists
      if (parsedUser?.staffId) {
        setStaffId(parsedUser.staffId);
      } else {
        console.warn("staffId is missing in user object");
      }

    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
        Welcome HOD - {department} | Class: {className}
      </h2>
  
      {/* Department Management Section */}
      <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Department Management</h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px',
        }}
      >
        <DashboardCard
          title="Manage Staff"
          description={`Add, edit or remove staff in ${department} department.`}
          buttonLabel="View Staff"
          onClick={() => navigate(`/stafflist/${department}`)}
        />
        <DashboardCard
          title="Student List"
          description={`Students List view for ${department}.`}
          buttonLabel="View Students"
          onClick={() => navigate(`/students/${department}`)}
        />
        <DashboardCard
          title="Timetable"
          description="Create and manage class schedules for your department."
          buttonLabel="Manage Timetable"
          onClick={() => navigate(`/timetable/staffs/${department}`)}
        />
        <DashboardCard
          title="Manage Workdone"
          description="Create and manage staff workdone for your department."
          buttonLabel="Manage Workdone"
          onClick={() => navigate(`/workdone/staffs/${department}`)}
        />
      </div>
  
      {/* Staff Utilities Section */}
      <h3 style={{ textAlign: 'center', marginTop: '60px' }}>Class Handling</h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px',
        }}
      >
        <DashboardCard
          title="View Workdone"
          description="Workdone entry form."
          buttonLabel="Submit Workdone"
          onClick={() => navigate(`/staff/workdone/${staffId}`)}
        />
        <DashboardCard
          title="View Timetable"
          description="Check your scheduled classes."
          buttonLabel="Timetable"
          onClick={() =>
            staffId
              ? navigate(`/staff/timetable/${staffId}`)
              : alert('Staff ID is missing')
          }
        />
        <DashboardCard
          title="Create Class Timetable"
          description="Create or view your class timetable."
          buttonLabel="Create Timetable"
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

export default HODDashboard;
