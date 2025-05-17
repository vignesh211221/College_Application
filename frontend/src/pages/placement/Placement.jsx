// pages/student/PlacementList.jsx
import React, { useEffect, useState } from 'react';
import { getAllPlacements } from '../../services/placementApi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const PlacementList = () => {
  const [placements, setPlacements] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // or fetch from user object
    setRole(storedRole);
  }, []);


  useEffect(() => {
    const fetchPlacements = async () => {
      const data = await getAllPlacements();
      setPlacements(data);
    };
    fetchPlacements();
  }, []);

  const handleCardClick = (placementId) => {
    navigate(`/placement-piechart/${placementId}`);
  };
  
  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br></br>
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <button
              onClick={() => {
                if (role === "admin") {
                  navigate("/admin-dashboard");
                } else if (role === "placementofficer") {
                  navigate("/placement-dashboard");
                } else {
                  toast.error("Unauthorized role");
                }
              }}
              className="dash-btn"
            >
              Back to Dashboard
            </button>
            <br></br>
            <br></br>
      
      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>All Placements</h2>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'center' 
      }}>
        {placements.map((placement) => (
          <div
            key={placement._id}
            onClick={() => handleCardClick(placement._id)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: '15px',
              width: '200px',
              textAlign: 'center', // center text
              cursor: 'pointer',
              backgroundColor: 'lightblue',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{placement.jobRole}</h3>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>{placement.type}</p>
            <p style={{ margin: '0', fontSize: '14px', color: '#777' }}>{placement.companyName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementList;
