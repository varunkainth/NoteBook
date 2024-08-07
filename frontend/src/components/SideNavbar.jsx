// src/components/SideNavbar.jsx
import React from 'react';
import { FaSignOutAlt, FaMoon, FaSun, FaUserEdit } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './SideNavbar.css';

const SideNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem('authToken');
   
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>NoteMaster</h2>
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-item" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <div className="sidebar-item" onClick={() => navigate('/update-profile')}>
          <FaUserEdit />
          <span>Update Profile</span>
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;


