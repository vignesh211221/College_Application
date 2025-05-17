import React from 'react';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
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
          title="StaffLists" 
          description="View Staff details and Assign PlacementCoordinator." 
          buttonLabel="Manage-Staff"
          onClick={() => navigate('/placements')} 
        />
        <DashboardCard 
          title="Placement" 
          description="Post job and internship to students." 
          buttonLabel="Create post"
          onClick={() => navigate('/createplacement')} 
        />
        <DashboardCard 
          title="Placement Applied List" 
          description="Students Applied lists." 
          buttonLabel="View PlacementLists"
          onClick={() => navigate('/appliedlists')} 
        />
        <DashboardCard 
          title="  View Internship or Offer Letters" 
          description="View Students Offer letters." 
          buttonLabel="View documents"
          onClick={() => navigate('/department/files')} 
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
