import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './AboutUs.css';
import Lottie from 'lottie-react';
import animationData from '../images/Animation - 1729347628307.json'; 

const AboutUs2 = () => {
    return (

            <div className="about-us-container">
              <div className="background-animationW">
                <Lottie animationData={animationData} loop={true} />
              </div>
        
              {/* Navigation Bar */}
      <nav className="navbarW">
        <img src={require('../images/logo.png')} alt="GenNews Logo" className="logoW" />
        <div className="navbar-linksW">
        <Link to="/" className="nav-linkW">Welcome Page</Link>
        <Link to="/signup" className="nav-linkW">Sign Up</Link>
          <Link to="/login" className="nav-linkW">Log In</Link>
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
  
          <h2>Our Mission</h2>
          <p>At GenNews, our goal is to revolutionize journalism by leveraging the power of AI to assist writers in generating high-quality content...</p>
  
        
          <h2>Our Vision for the Future</h2>
          <p>We envision a future where AI empowers every journalist to reach new heights in content creation...</p>
  
          <h2>Contact Information</h2>
          <p>We value your feedback and suggestions. Feel free to reach out to us at <a href="mailto:GenNews@gmail.com">GenNews@gmail.com</a>.</p>
        </div>
  
        <footer className="about-us-footer">
          <p>Developers: Wijdan Alhashim, Shoug Aljebren, Lina Alharbi, Lina Albarrak</p>
          <p>© 2024 GenNews. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  export default AboutUs2;
  