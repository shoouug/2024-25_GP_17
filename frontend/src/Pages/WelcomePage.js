import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={require('../images/Logo.png')} alt="GenNews Logo" className="logo" />
        <div className="navbar-links">
          <Link to="/signup" className="nav-link">Sign Up</Link> {/* Use Link for navigation */}
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/AboutUs" className="nav-link">About Us</Link>
        </div>
      </nav>

      {/* Main Welcome Section */}
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to GenNews</h1>
        <p className="welcome-description">Empowering journalists with AI-powered tools for efficient article creation and trend analysis.</p>
      </div>

      {/* SVG Wave */}
      <div className="wave-container">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(91, 149, 161, 0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(91, 149, 161, 0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(91, 149, 161, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#5B95A1" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default WelcomePage;
