import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import '../components/signin.css';

const SignupForm = () => {
  const [studentName, setStudentName] = useState('');
  const [prnNumber, setPrnNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for showing loading status
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const newUser = {
      studentName,
      prnNumber,
      email,
      department,
      semester,
      mobileNumber,
      password,
    };
  
    console.log('Sending data to backend:', newUser);  // Log the data being sent
  
    try {
      const response = await axios.post('http://localhost:5000/api/students', newUser);
      alert(response.data.message || 'Signup successful! Please sign in.');
      setLoading(false);
      navigate('/signin');
    } catch (error) {
      console.error('Error during signup:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };
  

  return (
    <div className="signup-form-container">
      <h2>Student Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="studentName">Student Name:</label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prnNumber">PRN Number:</label>
          <input
            type="text"
            id="prnNumber"
            value={prnNumber}
            onChange={(e) => setPrnNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email ID:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="E&TC">E&TC</option>
            <option value="MECH">MECH</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="semester">Semester:</label>
          <select id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} required>
            <option value="">Select Semester</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
            <option value="4">4th Semester</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="tel"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
