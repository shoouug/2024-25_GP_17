import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../images/logo.png'; // Update the path according to your folder structure
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="GenNews Logo" className="logo" />
        <div className="navbar-links">
          <Link to="/" className="nav-link">Welcome Page</Link>
          <Link to="/Profile" className="nav-link">Profile Page</Link>
        </div>
      </nav>

      {/* Main Content */}
      <header className="about-us-header">
        <h1>About GenNews</h1>
        <p>Empowering journalists through automated content creation with advanced technologies.</p>
      </header>

      <div className="about-us-content">
        <h2>Overview</h2>
        <p>GenNews is a platform designed to help journalists automate their content creation process by utilizing several advanced technologies. This section explains the key concepts behind each technology and their applications in the project.</p>
      </div>

      <footer className="about-us-footer">
        <p>© 2024 GenNews. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;