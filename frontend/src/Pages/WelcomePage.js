import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Lottie from 'lottie-react';
import animationData from '../images/Animation - 1729347628307.json'; 
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-containerW">
      {/* Lottie animation as background */}
      <div className="background-animationW">
        <Lottie animationData={animationData} loop={true} />
      </div>

      {/* Navigation Bar */}
      <nav className="navbarW">
        <img src={require('../images/logo.png')} alt="GenNews Logo" className="logoW" />
        <div className="navbar-linksW">
          <Link to="/signup" className="nav-linkW">Sign Up</Link>
          <Link to="/login" className="nav-linkW">Log In</Link>
          <Link to="/AboutUs" className="nav-linkW">About Us</Link>

          {/* I will move this link but i add it so i can quickly move to my page (: */}
          <Link to="/Profile" className="nav-linkW">Profile Page</Link>
        </div>
      </nav>

      {/* Main Welcome Section */}
      <div className="welcome-contentW">
        <h1 className="welcome-titleW">Welcome to GenNews</h1>
        <p className="welcome-descriptionW">Empowering journalists with AI-powered tools for efficient article creation and trend analysis.</p>
      </div>
    </div>
  );
};

export default WelcomePage;