import React from "react";
import "../assets/styles.css"; // Ensure you have a CSS file for sidebar styles

const Sidebar = ({ setActiveSection, handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="student-info">
        {/* Student Info could be displayed here */}
      </div>

      <button onClick={() => setActiveSection("course")}>
        Course Selection
      </button>
      <button onClick={() => setActiveSection("payment")}>
        Payment
      </button>
      <button onClick={() => setActiveSection("otherfees")}>
        Other Fees
      </button>
      <button onClick={() => setActiveSection("receipt")}>
        Receipt
      </button>
      
      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
