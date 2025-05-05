import React, { useState, useEffect } from 'react';
import './Profile.css'; // Import the CSS file

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState(''); // State for the profile photo
  const [studentName, setStudentName] = useState(''); // State for student name
  const [prnNumber, setPrnNumber] = useState(''); // State for PRN number
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode

  // Load existing profile data from local storage when component mounts
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('student'));
    if (storedProfile) {
      setStudentName(storedProfile.studentName || '');
      setPrnNumber(storedProfile.prnNumber || '');
      setProfilePhoto(storedProfile.profilePhoto || '');
    }
  }, []);

  // Function to handle profile photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader to read the file
      reader.onloadend = () => {
        setProfilePhoto(reader.result); // Set the profile photo state to the file's data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create an updated profile object
    const updatedProfile = {
      studentName,
      prnNumber,
      profilePhoto,
    };

    // Save the updated profile to local storage
    localStorage.setItem('student', JSON.stringify(updatedProfile));

    // Optionally, alert the user or provide feedback
    alert('Profile updated successfully!');
  };

  // Function to toggle editing mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev); // Toggle the editing mode
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {profilePhoto && (
        <img src={profilePhoto} alt="Profile" className="profile-photo" />
      )}
      <form onSubmit={handleSubmit}>
        {isEditing ? (
          <>
            <div className="form-group">
              <label htmlFor="profilePhoto">Profile Photo:</label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*" // Accept image files only
                onChange={handlePhotoChange}
              />
            </div>
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
            <button type="submit">Save Changes</button>
          </>
        ) : (
          <>
            <p><strong>Student Name:</strong> {studentName}</p>
            <p><strong>PRN Number:</strong> {prnNumber}</p>
          </>
        )}
      </form>
      <button onClick={toggleEdit} className="edit-button">
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </button>
    </div>
  );
};

export default Profile;
