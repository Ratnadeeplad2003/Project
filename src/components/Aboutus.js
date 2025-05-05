import React from 'react';
import aboutImage from '../assets/pay_anytime.png'; // Path to your image file
import image2 from'../assets/pay_by.png';
const AboutUs = () => {
  return (
    <div className="about-container">
      <h2>About Us</h2>
      <div className="about-content">
        <img src={aboutImage} alt="About Us" className="about-image" />
        <img src={image2} alt="About Us" className="about-image" />
        <div className="about-description">
          <p>Welcome to our platform. We connect students with opportunities!</p>
          <p>
          WE committed to providing the best platform for managing student fees, processing payments, and ensuring a seamless experience for both students and parents. Our platform helps to simplify the administrative tasks for schools, making fee collection faster and easier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
