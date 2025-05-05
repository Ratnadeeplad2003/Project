import React, { useState } from "react";

const Confirmation = ({ studentName, prnNumber, amountPaid }) => {
  const [email, setEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Function to handle sending the receipt
  const handleSendReceipt = () => {
    // Basic email validation (can be improved)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setConfirmationMessage("Please enter a valid email address.");
      return;
    }

    // Here you would implement the actual email sending logic (e.g., via an API)
    // For now, we will just simulate this
    setConfirmationMessage(`Receipt sent to ${email}. Thank you, ${studentName}!`);
    
    // Simulate PDF download
    downloadReceipt();
  };

  // Simulated function to download the receipt
  const downloadReceipt = () => {
    // Here you would generate the PDF file and trigger download
    console.log("Generating receipt PDF...");
  };

  return (
    <div className="section">
      <h2>Confirmation</h2>
      <p>Your payment of ₹{amountPaid} has been successfully processed. Please review your details.</p>
      
      <div>
        <label>
          Enter your email to receive the receipt:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            required
          />
        </label>
      </div>
      
      <button onClick={handleSendReceipt}>Send Receipt</button>

      {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
    </div>
  );
};

export default Confirmation;
