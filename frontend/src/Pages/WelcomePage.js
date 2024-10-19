import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Lottie from 'lottie-react';
import animationData from '../images/Animation - 1729347628307.json'; // Import your animation JSON file
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      {/* Lottie animation as background */}
      <div className="background-animation">
        <Lottie animationData={animationData} loop={true} />
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={require('../images/Logo.png')} alt="GenNews Logo" className="logo" />
        <div className="navbar-links">
          <Link to="/signup" className="nav-link">Sign Up</Link>
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/AboutUs" className="nav-link">About Us</Link>
        </div>
      </nav>

      {/* Main Welcome Section */}
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to GenNews</h1>
        <p className="welcome-description">Empowering journalists with AI-powered tools for efficient article creation and trend analysis.</p>
      </div>
    </div>
  );
};

export default WelcomePage;