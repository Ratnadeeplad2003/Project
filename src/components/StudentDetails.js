import React, { useState, useEffect } from "react";
import Axios from "axios";
import * as XLSX from "xlsx";
import "./studentdetails.css";

const StudentDetails = () => {
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showTable, setShowTable] = useState(false);

  // Load preview data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("studentPreviewData");
    if (savedData) {
      setStudents(JSON.parse(savedData));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("studentPreviewData", JSON.stringify(students));
    }
  }, [students]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setShowTable(false); // Reset table display

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const [headers, ...rows] = parsedData;
      const sanitizedHeaders = headers.map((h) => h.trim());

      const mapped = rows.map((row, index) => {
        const mappedRow = {};
        sanitizedHeaders.forEach((header, i) => {
          mappedRow[header] = row[i];
        });
        return {
          srNo: index + 1,
          name: mappedRow["Name"] || "",
          course: selectedBranch,
          year: selectedYear,
          prn: mappedRow["PRN"] || "",
          fee: mappedRow["Total Fee"] || 0,
        };
      });

      setStudents(mapped);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !selectedBranch || !selectedYear) {
      alert("Please select a file and choose both branch and year.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("branch", selectedBranch);
    formData.append("year", selectedYear);

    try {
      const response = await Axios.post("http://localhost:5000/api/students/bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload response:", response);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    }
  };

  const handleClearPreview = () => {
    setStudents([]);
    setShowTable(false);
    localStorage.removeItem("studentPreviewData");
  };

  return (
    <div className="student-details">
      <h2>Student Details</h2>

      <div className="filters">
        <select onChange={(e) => setSelectedBranch(e.target.value)} required>
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="E&TC">E&TC</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>

        <select onChange={(e) => setSelectedYear(e.target.value)} required>
          <option value="">Select Year</option>
          <option value="SY">S.Y</option>
          <option value="TY">T.Y</option>
          <option value="BTech">B.Tech</option>
        </select>
      </div>

      <div className="file-upload">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <button onClick={handleSubmit}>Upload Student Data</button>
      </div>

      {/* Show file content button */}
      {students.length > 0 && !showTable && (
        <button className="show-file-btn" onClick={() => setShowTable(true)}>
          Show File Data
        </button>
      )}

      {/* Student Table */}
      {students.length > 0 && showTable && (
        <div className="students-list">
          <h3>Uploaded Student Data Preview</h3>
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Course</th>
                <th>Studying Year</th>
                <th>PRN</th>
                <th>Total Fee</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.srNo}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td>{student.prn}</td>
                  <td>₹{student.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="clear-preview" onClick={handleClearPreview}>
            Clear Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
