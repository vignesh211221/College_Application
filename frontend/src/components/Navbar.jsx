import React from 'react';
import '../styles/Navbar.css';
import logo from "../assets/logo.png";

const Navbar = ({ onLogout }) => {
  const username = localStorage.getItem("username");

  return (
    <div className="navbar">
      <img src={logo} alt="logo" className="navbar-logo" />
      <div className="navbar-user-info">
        <span className="navbar-username">Welcome, {username || 'User'}</span>
        <button onClick={onLogout} className="navbar-logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
