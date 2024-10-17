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
     <Link to="/" className="nav-link">Welcome Page</Link>
     <Link to="/AboutUs" className="nav-link">About Us Page</Link>
     </div>
   </nav>
      {/* Header Section */}
      <header className="profile-header">
        <h1>User Name</h1>
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>Company:</strong> Example Corp</p>
        <p><strong>Country:</strong> United States</p>
          <p><strong>Password:</strong> ●●●●●●●●</p>
        <button className="edit-profile-btn">Edit Profile</button>
      </header>

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
