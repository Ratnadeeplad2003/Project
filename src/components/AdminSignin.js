import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminSignin.css";

const AdminAuth = ({ setIsAuthenticated }) => {
  const [name, setName] = useState(""); // ✅ Admin Name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Admin Login
  const loginAdmin = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await Axios.post("http://localhost:5000/api/admin/login", loginData);
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token); // Store token
        setIsAuthenticated(true);
        navigate("/admin");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials or server error");
    }
  };

  // ✅ Handle Admin Signup
  const signupAdmin = async (e) => {
    e.preventDefault();
    const signupData = { name, email, password }; // ✅ Include name

    try {
      const response = await Axios.post("http://localhost:5000/api/admin/signup", signupData);
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        setIsAuthenticated(true);
        navigate("/admin");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="admin-auth">
      <h2>{isSignUp ? "Admin Signup" : "Admin Login"}</h2>
      <form onSubmit={isSignUp ? signupAdmin : loginAdmin}>
        {isSignUp && ( // ✅ Show name input only for Signup
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>
      {error && <p className="error">{error}</p>}
      
      <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default AdminAuth;
