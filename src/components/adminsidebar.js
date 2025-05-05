import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminSidebar from "./adminsidebar"; // Make sure it's capitalized correctly
import StudentDetails from "./StudentDetails";  // This will be the page where student data is managed
import OtherFeesPaidStudents from "./otherfeespaid";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Ensure the sidebar is correctly rendered */}
      <AdminSidebar />
      <div className="admin-content">
        <Routes>
          {/* Correct route for StudentDetails */}
          <Route path="/admin/student-details" element={<StudentDetails />} />
          <Route path="/admin/otherfees" element={<OtherFeesPaidStudents />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
