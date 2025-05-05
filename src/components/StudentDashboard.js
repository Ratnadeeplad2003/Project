import React, { useState, useEffect } from "react";
import Axios from "axios";
import Sidebar from "./Sidebar";
import CourseSelection from "./CourseSelection"; 
import Payment from "./Payment";
import Receipt from "./Receipt";         // Ensure this component is created
import OtherFees from "./OtherFees";     // Ensure this component is created
import Header from "./Header";
import "../assets/styles.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("course");
  const [studentName, setStudentName] = useState(null);
  const [prnNumber, setPrnNumber] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("student"));
    if (storedUser) {
      setStudentName(storedUser.studentName);
      setPrnNumber(storedUser.prnNumber);
      setProfilePhoto(storedUser.profilePhoto);
    } else {
      navigate("/SignIn");
    }

    // Check if a receipt has been generated
    Axios.get(`http://localhost:5000/api/receipts/${storedUser.prnNumber}`)
      .then((response) => {
        // Additional functionality can be added here based on receipt availability
      })
      .catch((error) =>
        console.error("Error fetching receipt status:", error)
      );
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/SignIn");
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActiveSection("payment");
  };

  const handlePaymentSuccess = async (paymentRecord) => {
    paymentRecord.prnNumber = prnNumber;
    paymentRecord.studentName = studentName;
    paymentRecord.transactionId = transactionId; 

    // If you store a token on login, retrieve it here
    const token = localStorage.getItem("token");

    try {
      // Send the payment record to the server
      await Axios.post("http://localhost:5000/api/payments", paymentRecord, {
        headers: {
          // Authorization: `Bearer ${token}`,  // Uncomment if using token-based auth
        },
      });
      alert(
        "Payment is successful! You will receive your receipt within 2 days."
      );
      setActiveSection("course"); // Return to course selection
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  // Render component based on the activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case "course":
        return <CourseSelection onSelectCourse={handleSelectCourse} />;
      case "payment":
        return (
          <Payment 
            studentName={studentName} 
            prnNumber={prnNumber} 
            transactionId={transactionId}
            onPaymentSuccess={handlePaymentSuccess} 
          />
        );
      case "otherfees":
        return (
          <OtherFees
            studentName={studentName}
            prnNumber={prnNumber}
          />
        );
      case "receipt":
        return (
          <Receipt
            studentName={studentName}
            prnNumber={prnNumber}
          />
        );
      default:
        return <CourseSelection onSelectCourse={handleSelectCourse} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header does not include a logout button now */}
      <Header 
        studentName={studentName} 
        prnNumber={prnNumber} 
        profilePhoto={profilePhoto} 
      />
      <div className="dashboard">
        <Sidebar 
          setActiveSection={setActiveSection} 
          handleLogout={handleLogout} 
        />
        <div className="dashboard-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
