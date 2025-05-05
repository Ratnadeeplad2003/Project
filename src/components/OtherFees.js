import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import gpayLogo from "../assets/gpaylogo.jpeg"; 
import phonepeLogo from "../assets/phonepe logo.png";
import upiLogo from "../assets/upilogo.png";
import "../components/Payment.css";
import Axios from "axios";

const OtherFees = ({ studentName, prnNumber }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [nextDueDate, setNextDueDate] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [fee, setFee] = useState(0);

  const [selectedOtherFees, setSelectedOtherFees] = useState({
    tripFees: false,
    departmentFunds: false,
  });
  const [tripFee, setTripFee] = useState("");
  const [deptFee, setDeptFee] = useState("");

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

  useEffect(() => {
    let calculatedFee = 0;
    if (selectedOtherFees.tripFees) {
      calculatedFee += parseInt(tripFee) || 0;
    }
    if (selectedOtherFees.departmentFunds) {
      calculatedFee += parseInt(deptFee) || 0;
    }
    setFee(calculatedFee);
    setPendingAmount(calculatedFee - paymentAmount);
  }, [selectedOtherFees, tripFee, deptFee, paymentAmount]);

  const handleOtherFeesChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOtherFees(prev => ({ ...prev, [name]: checked }));
  };

  const handlePaymentAmountChange = (e) => {
    const amount = parseInt(e.target.value) || 0;
    setPaymentAmount(amount);
    setPendingAmount(fee - amount);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setErrorMessage("Please select a payment method.");
      return;
    }
    if (paymentAmount <= 0 || paymentAmount > fee) {
      setErrorMessage("Enter a valid payment amount.");
      return;
    }

    const newTransactionId = `TX${Math.floor(Math.random() * 100000)}`;
    setTransactionId(newTransactionId);
    const updatedPending = fee - paymentAmount;
    setPendingAmount(updatedPending);

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 2);
    setNextDueDate(dueDate.toLocaleDateString());

    const paymentData = {
      studentName,
      prnNumber,
      paymentMethod,
      amountPaid: paymentAmount,
      fee,
      pendingAmount: updatedPending,
      nextDueDate: dueDate.toLocaleDateString(),
      transactionId: newTransactionId,
      timestamp: Date.now(),
      selectedOtherFees,  // { tripFees: boolean, departmentFunds: boolean }
      tripFee: parseInt(tripFee) || 0,
      deptFee: parseInt(deptFee) || 0,
    };
    

    try {
      await Axios.post("http://localhost:5000/api/otherfeepayments", paymentData);
      setConfirmation(`₹${paymentAmount} paid via ${paymentMethod}. Transaction ID: ${newTransactionId}`);
      setShowQRCode(false);
      await Axios.patch(`http://localhost:5000/api/students/${prnNumber}`, { hasPaid: true });
      setIsPaid(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      setErrorMessage("");
    }
  };

  const isPaymentDisabled = () => {
    return !paymentMethod || fee === 0 || paymentAmount <= 0;
  };

  return (
    <div className="payment-container">
      <h2>Payment for {studentName}</h2>

      <div>
        <label>PRN:</label>
        <input type="text" value={prnNumber} disabled />
      </div>

      <div>
        <label>Other Fees:</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="tripFees"
              checked={selectedOtherFees.tripFees}
              onChange={handleOtherFeesChange}
            />
            Trip Fees
          </label>
          {selectedOtherFees.tripFees && (
            <input
              type="number"
              value={tripFee}
              onChange={(e) => setTripFee(e.target.value)}
              placeholder="Trip Fee Amount"
            />
          )}
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="departmentFunds"
              checked={selectedOtherFees.departmentFunds}
              onChange={handleOtherFeesChange}
            />
            Department Funds
          </label>
          {selectedOtherFees.departmentFunds && (
            <input
              type="number"
              value={deptFee}
              onChange={(e) => setDeptFee(e.target.value)}
              placeholder="Department Fund Amount"
            />
          )}
        </div>
      </div>

      <div>
        <label>Enter Payment Amount:</label>
        <input
          type="number"
          value={paymentAmount}
          onChange={handlePaymentAmountChange}
          placeholder="Payment Amount"
          disabled={fee === 0}
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h3>Select Payment Method:</h3>
      <div className="payment-methods">
        {[
          { label: "GPay", logo: gpayLogo },
          { label: "PhonePe", logo: phonepeLogo },
          { label: "UPI", logo: upiLogo },
        ].map(({ label, logo }) => (
          <label key={label}>
            <input
              type="radio"
              value={label}
              checked={paymentMethod === label}
              onChange={() => {
                setPaymentMethod(label);
                setShowQRCode(true);
              }}
            />
            <img src={logo} alt={label} className="payment-logo" />
          </label>
        ))}
      </div>

      {showQRCode && paymentAmount > 0 && (
        <div className="qr-code">
          <h4>Scan to Pay with {paymentMethod}</h4>
          <QRCodeCanvas
            value={`${paymentMethod.toLowerCase()}_upi_payment_link_or_id`}
            size={150}
          />
        </div>
      )}

      <button onClick={handlePayment} disabled={isPaymentDisabled()}>
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

export default OtherFees;
