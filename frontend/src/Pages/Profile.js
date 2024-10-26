import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate
import './Profile.css';

const Profile = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Science', 
    'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty'
  ];

  // Handle topic selection
  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic); // Unselect the topic
      } else {
        return [...prev, topic]; // Select the topic
      }
    });
  };

  // Handle article input change
  const handleArticleChange = (e) => {
    setArticle(e.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }

    setError(''); // Reset error if the form is valid
    console.log('Selected Topics:', selectedTopics);
    console.log('Article:', article || 'No article provided');
    navigate('/HomePage'); // Redirect after submission
  };

  return (
    <div className="profile-container">

      {/* Navigation Bar */}
      <nav className="navbarW">
        <img src={require('../images/logo.png')} alt="GenNews Logo" className="logoW" />
        <div className="navbar-linksW">
        <Link to="/homepage" className="nav-linkW">Home Page</Link>
        <Link to="/aboutus" className="nav-linkW active">About Us</Link>
        <Link to="/" className="nav-linkW">Log out</Link>
        </div>
      </nav>

      {/* Header Section */}
      <header className="profile-header">
        <h1>User Name</h1>
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>affiliation:</strong> Example Corp</p>
        <p><strong>Country:</strong> United States</p>
        <p><strong>Password:</strong> ●●●●●●●●</p>
        <button className="edit-profile-btn">Edit Profile</button>
      </header>

      {/* Preference Topics Section */}
      <section className="preference-topics">
        <h2>Choose Your Preference Topics</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="topics-grid">
          {topics.map((topic) => (
            <div
              key={topic}
              className={`topic-item ${selectedTopics.includes(topic) ? 'selected' : ''}`}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </div>
          ))}
        </div>
      </section>

      {/* Article Writing Section */}
      <section className="article-section">
        <h3>Write Your Article </h3>
        <textarea
          placeholder="Paste or write your article here..."
          value={article}
          onChange={handleArticleChange}
          rows="6"
        />
        <button className="submit-btn" onClick={handleSubmit}>Add Article</button>
      </section>

    </div>
  );
};

export default Profile;
