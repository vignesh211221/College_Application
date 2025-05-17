import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';
const PlacementCoDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [className, setClassName] = useState("Unknown");
  const [department, setDepartment] = useState("Unknown");  // Added state for department
  const [staffId, setStaffId] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser?.className) {
        setClassName(parsedUser.className.trim() || "Unknown");
      }

      if (parsedUser?.department) {
        setDepartment(parsedUser.department.trim() || "Unknown");  // Extract department
      }

      if (parsedUser?.name) {
        setUser(parsedUser);
      } else {
        navigate('/login');
      }

      if (parsedUser?.staffId) {
        setStaffId(parsedUser.staffId);
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
    return null;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', marginTop: '50px' }}>
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
        <DashboardCard
          title="View Timetable"
          description="Check your scheduled classes."
          buttonLabel="Timetable"
          onClick={() => staffId ? navigate(`/staff/timetable/${staffId}`) : alert('Staff ID is missing')}
        />
        <DashboardCard
          title="Placement Applied List"
          description="View students who applied for each placement."
          buttonLabel="View Applications"
          onClick={() => navigate('/staff/placements')}
        />
        <DashboardCard
          title="View Internship or Offer Letters"
          description="View Students Offer letters."
          buttonLabel="View documents"
          onClick={() => navigate(`/classes/${department}`)}  // Now using department
        />
      </div>
    </div>
  );
};

export default PlacementCoDashboard;