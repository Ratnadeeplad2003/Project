import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landingpage";
import AboutUs from "./components/Aboutus";
import SignupForm from "./components/SignupForm";
import SigninForm from "./components/SigninForm";
import Dashboard from "./components/StudentDashboard";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import AdminSignin from "./components/AdminSignin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={isAuthenticated ? <AdminDashboard /> : <AdminSignin setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
