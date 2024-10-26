import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './HomePage.css'; 
import sunIcon from '../images/sun.png'; 
import exitIcon from '../images/exit.png'; 
import logo from '../images/AIPress.png';  // Path to the logo image

{/* for the links 
import { Link } from 'react-router-dom';
*/}

const HomePage = () => {
  const [chats, setChats] = useState([]);
  const [journalistName, setJournalistName] = useState('Journalist Name'); 
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Entertainment', 'Economy', 'Crime', 'Sport', 
  ];

  const handleNewChat = () => {
    const newChat = `Chat ${chats.length + 1}`;
    setChats([...chats, newChat]);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="homepage-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>+ New chat</button>
        <div className="chats">
          {chats.map((chat, index) => (
            <button key={index} className="chat-btn">{chat}</button>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="mode-btn">
            <img src={sunIcon} alt="Sun Icon" className="icon" /> Dark mode
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <img src={exitIcon} alt="Exit Icon" className="icon" /> Log out
          </button>
        </div>
      </div>

{/* Navigation Bar *
<nav className="navbarW">
        <div className="navbar-linksW">
          <Link to="/Profile" className="nav-linkW">Profile Page</Link>
        </div>
      </nav>/}


      {/* Main Content */}
      <div className="main-content">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
          <div className="welcome-section">
  <h1 className="welcome-heading">Good morning, {journalistName}!</h1>
  <p className="welcome-subtext">Let’s dive into the latest!</p>
</div>
        </div>

        <div className="topics-section">
          <h2>Start writing what’s happening now</h2>
          <div className="topics-grid">
            {topics.map((topic, index) => (
              <div key={index} className="topic-card">
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Topic Section */}
        <p className="topic-prompt">If you have a topic in your mind, start here!</p>
        <div className="custom-topic-section">
          <div className="custom-topic-inputs">
            <input
              type="text"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <input
              type="text"
              placeholder="Focus Keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button className="generate-btn">Generate Article</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;