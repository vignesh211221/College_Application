import React from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar onLogout={() => navigate('/login')} />
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '30px', 
        marginTop: '50px' 
      }}>
        <DashboardCard 
          title="StudentList" 
          description="Manage and view all student records." 
          buttonLabel="View Students"
          onClick={() => navigate('/students')} 
        />
        <DashboardCard 
          title="StaffList" 
          description="Manage and view all staff records." 
          buttonLabel="View Staff"
          onClick={() => navigate('/staffs')} 
        />
        <DashboardCard 
          title="Department" 
          description="Manage departments and staff assignments." 
          buttonLabel="Manage Departments"
          onClick={() => navigate('/departments')} 
        />
        <DashboardCard 
          title="Placements Activities" 
          description="Manage placement drives and incharges." 
          buttonLabel="View Placements"
          onClick={() => navigate('/placements-activities')} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
