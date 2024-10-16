import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../images/logo.png'; // Update the path according to your folder structure
;

const AboutUs = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="GenNews Logo" className="logo" />
        <div className="navbar-links">
        <Link to="/WelcomingPage" className="nav-link">Welcoming Page</Link>
        <Link to="/Profile" className="nav-link">Profile Page</Link>
        </div>
      </nav>

      {/* About Us Content */}
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>About Us</h1>
        <p>
          GenNews project is a platform designed to help journalists automate their content creation process by utilizing several advanced technologies. To fully understand how GenNews works, it’s important to understand the concepts behind each technology. This section explains these key concepts with simple examples and how they are applied in the project.
        </p>

        
        <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
          <h3>About GenNews</h3>
          <p>GenNews is a platform designed to support journalists in automating content creation. Our mission is to streamline the workflow of journalists by utilizing advanced AI and data-driven technologies.</p>
          <p>Follow us on social media for updates or learn more about our <a href="/mission">mission</a> and <a href="/team">team</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

