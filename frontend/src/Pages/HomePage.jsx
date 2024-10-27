import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './HomePage.css';
import sunIcon from '../images/sun.png';
import exitIcon from '../images/exit.png';
import logo from '../images/AIPress.png';
import ProfileIcon from '../images/ProfileIcon.png';
import EditProfile from './EditProfile'; // Importing the EditProfile component

const HomePage = () => {
  const [chats, setChats] = useState([]);
  const [journalistName, setJournalistName] = useState('Journalist Name');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state
  const [isEditing, setIsEditing] = useState(false); // State for editing profile

  useEffect(() => {
    const fetchJournalistData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'Journalists', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setJournalistName(`${data.firstName} ${data.lastName}`);
            setSelectedTopics(data.selectedTopics || []);
            setUserData(data); // Set the user data here
          } else {
            console.log("No such document found!");
          }
        } else {
          console.log("User is not logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchJournalistData();
  }, []);

  const handleNewChat = () => {
    const newChat = `Chat ${chats.length + 1}`;
    setChats([...chats, newChat]);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleMouseEnter = () => {
    setShowTooltip(true); // Show tooltip on hover
  };

  const handleMouseLeave = () => {
    setShowTooltip(false); // Hide tooltip when not hovering
  };

  const handleEditProfile = () => {
    setIsEditing(true); // Open the EditProfile component
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

      {/* Main Content */}
      <div className="main-contentH">
        {/* Tooltip */}
        <div 
          className="profile-linkH" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={ProfileIcon} 
            alt="Profile Icon" 
            className="ProfileIconH" 
          />
          {showTooltip && userData && (
            <div className="profile-tooltipH">
              <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Affiliation:</strong> {userData.affiliation}</p>
              <p><strong>Country:</strong> {userData.country}</p>
              <button 
                className="edit-profile-btnH" 
                onClick={handleEditProfile} // Open EditProfile on click
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="logo-sectionH">
          <img src={logo} alt="Logo" className="logoH" />
          <div className="welcome-sectionH">
            <h1 className="welcome-headingH">Good morning, {journalistName}</h1>
            <p className="welcome-subtextH">Let’s dive into the latest!</p>
          </div>
        </div>

        <div className="topics-sectionH">
          <h2>Start writing what’s happening now</h2>
          <div className="topics-gridH">
            {selectedTopics.map((topic, index) => (
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

        {/* Edit Profile Modal */}
        {isEditing && (
          <EditProfile 
            userData={userData} 
            onClose={() => setIsEditing(false)} // Close the modal
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;