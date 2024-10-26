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
    <div className="homepage-containerH">
      {/* Left Sidebar */}
      <div className="sidebarH">
        <button className="new-chat-btnH" onClick={handleNewChat}>+ New chat</button>
        <div className="chatsH">
          {chats.map((chat, index) => (
            <button key={index} className="chat-btnH">{chat}</button>
          ))}
        </div>
        <div className="sidebar-footerH">
          <button className="mode-btnH">
            <img src={sunIcon} alt="Sun Icon" className="iconH" /> Dark mode
          </button>
          <button className="logout-btnH" onClick={handleLogout}>
            <img src={exitIcon} alt="Exit Icon" className="iconH" /> Log out
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
      <div className="main-contentH">
        <div className="logo-sectionH">
          <img src={logo} alt="Logo" className="logoH" />
          <div className="welcome-sectionH">
  <h1 className="welcome-headingH">Good morning, {journalistName}!</h1>
  <p className="welcome-subtextH">Let’s dive into the latest!</p>
</div>
        </div>

        <div className="topics-sectionH">
          <h2>Start writing what’s happening now</h2>
          <div className="topics-gridH">
            {topics.map((topic, index) => (
              <div key={index} className="topic-cardH">
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Topic Section */}
        <p className="topic-promptH">If you have a topic in your mind, start here!</p>
        <div className="custom-topic-sectionH">
          <div className="custom-topic-inputsH">
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
          <button className="generate-btnH">Generate Article</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;