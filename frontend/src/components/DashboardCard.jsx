import React from 'react';
import './dashboardcard.css';

const DashboardCard = ({ title, description, buttonLabel, onClick }) => {
  return (
    <div className="dashboard-card">
      <h2 className="dashboard-title">{title}</h2>
      <p className="dashboard-description">{description}</p>
      <button className="dashboard-button" onClick={onClick}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default DashboardCard;
