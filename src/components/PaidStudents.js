import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import jsPDF from "jspdf";
import "./PaidStudents.css";

const PaidStudents = () => {
  const navigate = useNavigate();
  const [paidStudents, setPaidStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchPaidStudents = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/payments");
        setPaidStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching paid student details:", error);
      }
    };
    fetchPaidStudents();
  }, []);

  // Filter students when branch or year is changed
  useEffect(() => {
    const filtered = paidStudents.filter((student) => {
      return (
        (!selectedBranch || student.branch === selectedBranch) &&
        (!selectedYear || student.year === selectedYear)
      );
    });
    setFilteredStudents(filtered);
  }, [selectedBranch, selectedYear, paidStudents]);

  // Generate receipt PDF, convert to Blob, and upload to backend.
  const generateReceipt = async (student) => {
    try {
      const pdf = new jsPDF();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("Fee Payment Receipt", 75, 20);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.rect(10, 30, 190, 90);
      pdf.text(`Name: ${student.studentName}`, 20, 45);
      pdf.text(`PRN: ${student.prnNumber}`, 20, 55);
      pdf.text(`Amount Paid: ₹${student.amountPaid}`, 20, 65);
      pdf.text(
        `Payment Date: ${new Date(student.timestamp).toLocaleDateString()}`,
        20,
        75
      );
      pdf.text(`Transaction ID: ${student.transactionId}`, 20, 85);
      pdf.line(140, 110, 190, 110);
      pdf.text("Authorized Signature", 145, 120);

      // Convert the PDF to a Blob
      const blob = pdf.output("blob");

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("receipt", blob, `${student.prnNumber}_receipt.pdf`);
      // Optionally, include additional receipt metadata
      formData.append("prnNumber", student.prnNumber);
      formData.append("studentName", student.studentName);
      formData.append("amountPaid", student.amountPaid);
      formData.append("timestamp", student.timestamp);
      formData.append("transactionId", student.transactionId);
      formData.append("branch", student.branch || "");
      formData.append("year", student.year || "");

      // Post the receipt to the backend upload route
      await Axios.post("http://localhost:5000/api/uploads/receipts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Receipt generated and uploaded successfully.");
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt.");
    }
  };

  // Delete a payment record by student PRN
  const deleteStudent = async (prn) => {
    try {
      await Axios.delete(`http://localhost:5000/api/payments/${prn}`);
      const updated = paidStudents.filter((s) => s.prnNumber !== prn);
      setPaidStudents(updated);
      setFilteredStudents(updated);
      alert("Student record deleted.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="paid-students">
      <div className="header-with-back">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Paid Students</h1>
      </div>

      <div className="filters">
        <label>
          Branch:
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="E&TC">E&TC</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </label>

        <label>
          Year:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="SY">S.Y</option>
            <option value="TY">T.Y</option>
            <option value="BTech">B.Tech</option>
          </select>
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>PRN</th>
            <th>Name</th>
            <th>Amount Paid</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={index}>
              <td>{student.prnNumber}</td>
              <td>{student.studentName}</td>
              <td>₹{student.amountPaid}</td>
              <td>{new Date(student.timestamp).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setSelectedStudent(student)}>
                  View
                </button>
                <button onClick={() => generateReceipt(student)}>
                  Generate Receipt
                </button>
                <button onClick={() => deleteStudent(student.prnNumber)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <h2>Payment Details</h2>
            <p>
              <strong>Name:</strong> {selectedStudent.studentName}
            </p>
            <p>
              <strong>PRN:</strong> {selectedStudent.prnNumber}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹{selectedStudent.amountPaid}
            </p>
            <p>
              <strong>Payment Date:</strong>{" "}
              {new Date(selectedStudent.timestamp).toLocaleDateString()}
            </p>
            <p>
              <strong>Transaction ID:</strong>{" "}
              {selectedStudent.transactionId}
            </p>
            <button
              className="close-btn"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidStudents;
