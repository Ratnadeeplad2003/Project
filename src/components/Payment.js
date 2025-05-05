import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import gpayLogo from "../assets/gpaylogo.jpeg"; 
import phonepeLogo from "../assets/phonepe logo.png";
import upiLogo from "../assets/upilogo.png";
import "../components/Payment.css";
import Axios from "axios";

const Payment = ({ studentName, prnNumber }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentOption, setPaymentOption] = useState("installment");
  const [fee, setFee] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(10000);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [nextDueDate, setNextDueDate] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await Axios.get(`http://localhost:5000/api/students/${prnNumber}`);
        setIsPaid(response.data.hasPaid);
        if (response.data.fee) {
          setFee(response.data.fee);
          setPendingAmount(response.data.fee);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    fetchPaymentStatus();
  }, [prnNumber]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setErrorMessage("Please select a payment method.");
      return;
    }

    if (paymentAmount < 10000) {
      setErrorMessage("Minimum payment amount is ₹10,000.");
      return;
    }

    if (isPaid) {
      setErrorMessage("Payment has already been made.");
      return;
    }

    const newTransactionId = `TX${Math.floor(Math.random() * 100000)}`;
    setTransactionId(newTransactionId);

    const updatedPendingAmount = pendingAmount - paymentAmount;
    setPendingAmount(updatedPendingAmount);

    const nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 2);
    setNextDueDate(nextDue.toLocaleDateString());

    const paymentRecord = {
      studentName,
      prnNumber,
      paymentMethod,
      amountPaid: paymentAmount,
      fee,
      pendingAmount: updatedPendingAmount,
      nextDueDate: nextDue.toLocaleDateString(),
      transactionId: newTransactionId,
      timestamp: Date.now(),
    };

    try {
      await Axios.post("http://localhost:5000/api/payments", paymentRecord);
      setConfirmation(
        `Payment of ₹${paymentAmount} successful via ${paymentMethod}. Transaction ID: ${newTransactionId}.`
      );
      setShowQRCode(false);
      await Axios.patch(`http://localhost:5000/api/students/${prnNumber}`, { hasPaid: true });
      setIsPaid(true);
    } catch (error) {
      console.error("Error sending payment record:", error);
      setErrorMessage("Failed to record payment. Please try again.");
    }
  };

 

  const handlePaymentAmountChange = (e) => {
    const amount = parseInt(e.target.value, 10);

    if (isNaN(amount) || amount < 10000) {
      setErrorMessage("Minimum payment amount is ₹10,000.");
      setPaymentAmount(amount);
    } else {
      setErrorMessage("");
      setPaymentAmount(amount);
      setPendingAmount(fee - amount);
    }
  };

  const handleFeeChange = (e) => {
    const newFee = parseInt(e.target.value, 10);
    setFee(newFee);
    setPendingAmount(newFee - paymentAmount);
  };

  const isPaymentButtonDisabled = () => {
    return !paymentMethod || paymentAmount < 10000 || !fee || isPaid;
  };

  

  return (
    <div className="payment-container">
      <h2>Payment for {studentName}</h2>

      <div>
        <label>PRN:</label>
        <input type="text" value={prnNumber} disabled />
      </div>

      <div>
        <label>Total Course Fee (₹):</label>
        <input
          type="number"
          value={fee}
          onChange={handleFeeChange}
          placeholder="Enter total course fee"
        />
      </div>

      <div>
        <label>Enter Payment Amount (Minimum ₹10,000):</label>
        <input
          type="number"
          value={paymentAmount}
          onChange={handlePaymentAmountChange}
          placeholder="₹10,000 minimum"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h3>Select Payment Method:</h3>
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="GPay"
            checked={paymentMethod === "GPay"}
            onChange={() => {
              setPaymentMethod("GPay");
              setShowQRCode(true);
            }}
          />
          <img src={gpayLogo} alt="GPay" className="payment-logo" />
        </label>

        <label>
          <input
            type="radio"
            value="PhonePe"
            checked={paymentMethod === "PhonePe"}
            onChange={() => {
              setPaymentMethod("PhonePe");
              setShowQRCode(true);
            }}
          />
          <img src={phonepeLogo} alt="PhonePe" className="payment-logo" />
        </label>

        <label>
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={() => {
              setPaymentMethod("UPI");
              setShowQRCode(true);
            }}
          />
          <img src={upiLogo} alt="UPI" className="payment-logo" />
        </label>
      </div>

      {showQRCode && (
        <div className="qr-code">
          <h4>Scan to Pay with {paymentMethod}</h4>
          <QRCodeCanvas value={`${paymentMethod.toLowerCase()}_payment_link_or_id`} size={150} />
        </div>
      )}

      <button onClick={handlePayment} disabled={isPaymentButtonDisabled()}>
        Make Payment
      </button>

      {pendingAmount > 0 && <h4>Pending Amount: ₹{pendingAmount}</h4>}
      {nextDueDate && <h4>Next Due Date: {nextDueDate}</h4>}

      {confirmation && (
        <div className="confirmation">
          <p>{confirmation}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
