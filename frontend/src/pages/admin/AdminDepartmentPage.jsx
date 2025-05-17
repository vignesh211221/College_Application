import React from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate, useParams } from 'react-router-dom';

const AdminDepartmentPage = () => {
  const navigate = useNavigate();
  const { department } = useParams(); // Get department from URL

  const capitalDept = department?.toUpperCase() || "UNKNOWN";

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
          title="Timetable"
          description={`Manage the timetable for the ${capitalDept} department.`}
          buttonLabel="Go to Timetable"
          onClick={() => navigate(`/timetable/staffs/${capitalDept}`)}
        />
        <DashboardCard
          title="Workdone"
          description={`Review and manage work reports for ${capitalDept} staff.`}
          buttonLabel="Go to Workdone"
          onClick={() => navigate(`/workdone/staffs/${capitalDept}`)}
        />
        <DashboardCard
          title="Class Timetable"
          description={`Review Class Timetable ${capitalDept} Department.`}
          buttonLabel="Go to ClassTimetable"
          onClick={() => navigate(`/class-timetable/${capitalDept}`)}
        />
      </div>
    </div>
  );
};

export default AdminDepartmentPage;
