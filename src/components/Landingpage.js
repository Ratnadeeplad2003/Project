import React from 'react';
import { Link } from 'react-router-dom';
import './Landingpage.css'; // Import the CSS for styling
//import image from '../assets/Online-Fee-Payment.jpg';
import image1 from '../assets/banner-image.png';
const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>Online Payment System</h1>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/aboutus" className="nav-link">About Us</Link>
          </li>
          <li>
            <Link to="/signin" className="nav-link">Sign In</Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
          </li>
          <li>
            <Link to="/admin" className='nav-link'>Admin</Link> {/* Updated link */}
          </li>
        </ul>
      </nav>
      
      <header className="landing-header">
        <h4>Welcome to Student Online Payment System
        For Schools For Parents
Fee collection can be a great concern for schools and colleges. The process can be tedious- sending due date notifications, ensuring payments are on-time, sending reminders, following up, and all the paperwork is so laborious.This is the complete Online payment solution for Schools, Colleges, other Training Institutions.
Quicker & Timely payments
Automated alerts via SMS, WhatsApp, Mail
Bulk student data export
Automated Batch invoicing
Effortless tracking
        </h4>
        <img src={image1} alt="Online Fee Payment" className="landing-image" />

        <p>Connecting students with opportunities</p>
        <Link to="/signup" className="cta-btn">Get Started</Link>
      </header>

      <section className="features" id="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <i className="fas fa-user-graduate"></i>
            <h3>Personalized Dashboard</h3>
            <p>Track your Fee status, view recommended jobs, and manage your profile easily.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-briefcase"></i>
            <h3>Job Recommendations</h3>
            <p>Get automatically recommended jobs based on your skills and resume analysis.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-file-upload"></i>
            <h3>Online  Fee Payment System</h3>
            <p>Adhoc payment communication, real-time tracking and other features make Eduzer the complete Online School Fee Payment System..</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="PayAnyWhereAnytime">
        <h2>Success Stories</h2>
        <div className="testimonial-item">
          <p>"Features like bulk invoicing, secure cross-border transactions makes  the complete Online College Fee Payment System."</p>
          <h4>John Doe</h4>
        </div>
        <div className="testimonial-item">
          <p>"The recommendations were spot on, and the process was seamless."</p>
          <h4>Jane Smith</h4>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 Student Dashboard Portal. All Rights Reserved.</p>
        <p>Contact us: support@studentdashboard.com</p>
      </footer>
    </div>
  );
};

export default LandingPage;
