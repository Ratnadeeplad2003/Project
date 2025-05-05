import React, { useState, useEffect } from "react";
import Axios from "axios";
import jsPDF from "jspdf";
import "./PaidStudents.css"; // Reusing same styles

const OtherFeesPaidStudents = () => {
  const [paidRecords, setPaidRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/otherfeepayments");
        setPaidRecords(response.data);
      } catch (error) {
        console.error("Error fetching other fee payments:", error);
      }
    };
    fetchPayments();
  }, []);

  const generateReceipt = (payment) => {
    try {
      const pdf = new jsPDF();

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("Other Fee Payment Receipt", 60, 20);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.rect(10, 30, 190, 90);

      pdf.text(`Name: ${payment.studentName}`, 20, 45);
      pdf.text(`PRN: ${payment.prnNumber}`, 20, 55);
      pdf.text(`Amount Paid: ₹${payment.amountPaid}`, 20, 65);
      pdf.text(`Total Fee: ₹${payment.fee}`, 20, 75);
      pdf.text(`Pending Amount: ₹${payment.pendingAmount}`, 20, 85);
      pdf.text(`Next Due Date: ${payment.nextDueDate}`, 20, 95);
      pdf.text(`Transaction ID: ${payment.transactionId}`, 20, 105);
      pdf.text(`Payment Date: ${new Date(payment.timestamp).toLocaleDateString()}`, 20, 115);

      pdf.line(140, 125, 190, 125);
      pdf.text("Authorized Signature", 145, 135);

      pdf.save(`${payment.prnNumber}_other_fee_receipt.pdf`);
      alert("Receipt generated successfully.");
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt.");
    }
  };

  const deletePayment = async (id) => {
    try {
      await Axios.delete(`http://localhost:5000/api/otherfeepayments/${id}`);
      setPaidRecords(paidRecords.filter((record) => record._id !== id));
      alert("Payment record deleted successfully.");
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment.");
    }
  };

  return (
    <div className="paid-students">
      <h1>Other Fee Payments</h1>
      <table>
        <thead>
          <tr>
            <th>PRN</th>
            <th>Name</th>
            <th>Amount Paid</th>
            <th>Pending</th>
            <th>Next Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paidRecords.map((payment, index) => (
            <tr key={index}>
              <td>{payment.prnNumber}</td>
              <td>{payment.studentName}</td>
              <td>₹{payment.amountPaid}</td>
              <td>₹{payment.pendingAmount}</td>
              <td>{payment.nextDueDate}</td>
              <td>
                <button className="view-btn" onClick={() => setSelectedRecord(payment)}>
                  View Details
                </button>
                <button className="generate-btn" onClick={() => generateReceipt(payment)}>
                  Generate Receipt
                </button>
                <button className="delete-btn" onClick={() => deletePayment(payment._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing details */}
      {selectedRecord && (
        <div className="modal">
          <div className="modal-content">
            <h2>Other Fee Payment Details</h2>
            <p><strong>Name:</strong> {selectedRecord.studentName}</p>
            <p><strong>PRN:</strong> {selectedRecord.prnNumber}</p>
            <p><strong>Amount Paid:</strong> ₹{selectedRecord.amountPaid}</p>
            <p><strong>Total Fee:</strong> ₹{selectedRecord.fee}</p>
            <p><strong>Pending Amount:</strong> ₹{selectedRecord.pendingAmount}</p>
            <p><strong>Next Due Date:</strong> {selectedRecord.nextDueDate}</p>
            <p><strong>Transaction ID:</strong> {selectedRecord.transactionId}</p>
            <p><strong>Payment Date:</strong> {new Date(selectedRecord.timestamp).toLocaleDateString()}</p>
            <button className="close-btn" onClick={() => setSelectedRecord(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherFeesPaidStudents;
