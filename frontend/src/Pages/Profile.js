import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../images/logo.png'; // Update the path according to your folder structure
import './Profile.css';

const Profile = () => {
  return (

    <div className="profile-container">
        {/* Navigation Bar */}
     <nav className="navbar">
     <img src={logo} alt="GenNews Logo" className="logo" />
     <div className="navbar-links">
     <Link to="/WelcomingPage" className="nav-link">Welcoming Page</Link>
     <Link to="/Profile" className="nav-link">Profile Page</Link>
     </div>
   </nav>
      {/* Header Section */}
      <header className="profile-header">
        <h1>User Name</h1>
        <p>Email: user@example.com</p>
        <p>Company: Example Corp</p>
        <p>Country: United States</p>
        <button className="edit-profile-btn">Edit Profile</button>
      </header>

      {/* User Information Section */}
      <section className="user-info">
        <h2>User Information</h2>
        <p><strong>Name:</strong> User Name</p>
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>Company:</strong> Example Corp</p>
        <p><strong>Country:</strong> United States</p>
        <div className="password-section">
          <p><strong>Password:</strong> ●●●●●●●●</p>
          <button className="change-password-btn">Change Password</button>
        </div>
      </section>

      {/* Previous Articles Section */}
      <section className="previous-articles">
        <h2>Previous Articles</h2>
        <ul>
          <li>
            <h3>Article Title 1</h3>
            <p>Brief excerpt of the article...</p>
          </li>
          <li>
            <h3>Article Title 2</h3>
            <p>Brief excerpt of the article...</p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Profile;
