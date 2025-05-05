import React from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import StudentDetails from "./StudentDetails";
import PaidStudents from "./PaidStudents";
import OtherFeesPaidStudents from "./otherfeespaid";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <Link to="student-details">Student Details</Link>
          </li>
          <li>
            <Link to="paid-students">Paid Students</Link>
          </li>
          <li>
            <Link to="otherfees">Other Fees Details</Link> {/* ✅ Added this line */}
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<div>Welcome To Online Payment System</div>} />
          <Route path="student-details" element={<StudentDetails />} />
          <Route path="paid-students" element={<PaidStudents />} />
          <Route path="otherfees" element={<OtherFeesPaidStudents />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
