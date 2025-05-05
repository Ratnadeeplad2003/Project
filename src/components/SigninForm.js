import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/signin.css';

const SignIn = () => {
  const [prnNumber, setPrnNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/students/signin", { prnNumber, password });
  
      if (response.data.success) {
        // Save the student data to localStorage
        localStorage.setItem("student", JSON.stringify(response.data.student));
        console.log("Student signed in:", response.data.student);  // Log to check the response data
  
        // Redirect to the dashboard
        navigate("/dashboard"); // Redirect to student dashboard
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setErrorMessage("An error occurred while signing in. Please try again.");
    }
  };
  
  return (
    <form onSubmit={handleSignIn}>
      <input
        type="text"
        value={prnNumber}
        onChange={(e) => setPrnNumber(e.target.value)}
        placeholder="Enter PRN Number"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        required
      />
      <button type="submit">Sign In</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default SignIn;
