import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Make sure you have a CSS file for styling

const Header = ({ studentName, prnNumber, profilePhoto, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the Profile page
  };

  return (
    <div className="header">
      <div className="profile-section">
        {profilePhoto && (
          <img src={profilePhoto} alt="Profile" className="profile-photo" />
        )}
        <div className="profile-info">
          <p>{studentName}</p>
          <p>PRN: {prnNumber}</p>
        </div>
        <button onClick={handleProfileClick} className="profile-button">
          Profile
        </button>
      </div>
   
    </div>
  );
};

export default Header;
