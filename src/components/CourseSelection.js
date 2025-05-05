import React, { useState } from 'react';

const CourseSelection = ({ onSelectCourse }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // List of courses with fees and semesters
  const courses = [
    { name: 'B.Tech CSE', fee: 50000, semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'] },
    { name: 'B.Tech E&TC', fee: 45000, semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'] },
    { name: 'B.Tech MECH', fee: 40000, semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'] },
  ];

  // Handle course selection
  const handleCourseChange = (e) => {
    const selected = courses.find(course => course.name === e.target.value);
    setSelectedCourse(selected);
    setSelectedSemester(''); // Reset semester when a new course is selected
  };

  // Handle semester selection
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  // Show semester options only when a course is selected
  const renderSemesterOptions = () => {
    if (selectedCourse) {
      return (
        <div className="semester-selection">
          <h4>Select Your Semester</h4>
          <select onChange={handleSemesterChange} value={selectedSemester || ''}>
            <option value="" disabled>Select a semester</option>
            {selectedCourse.semesters.map((semester, index) => (
              <option key={index} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  // Show proceed button only after both course and semester are selected
  const renderProceedButton = () => {
    if (selectedCourse && selectedSemester) {
      return (
        <button 
          onClick={() => onSelectCourse(selectedCourse)} 
        >
          Proceed to Payment
        </button>
      );
    }
    return null;
  };

  return (
    <div className="course-selection">
      <h2>Select Your Course</h2>
      <select onChange={handleCourseChange} value={selectedCourse ? selectedCourse.name : ''}>
        <option value="" disabled>Select a course</option>
        {courses.map((course, index) => (
          <option key={index} value={course.name}>
            {course.name}
          </option>
        ))}
      </select>

      {renderSemesterOptions()}
      {renderProceedButton()}
    </div>
  );
};

export default CourseSelection;
