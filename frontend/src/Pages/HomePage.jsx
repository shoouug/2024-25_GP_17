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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HomePage = () => {
  const [chats, setChats] = useState([]);
  const [journalistName, setJournalistName] = useState('Journalist Name');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [articleContent, setArticleContent] = useState('');
  const [isArticleGenerated, setIsArticleGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state
  const [isProfileEditing, setIsProfileEditing] = useState(false); // State for editing profile
  const navigate = useNavigate();

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
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchJournalistData();
  }, []);

  const handleNewChat = () => {
    setSelectedChat(null);
    setArticleContent('');
    setIsArticleGenerated(false);
    setTopic('');
    setKeyword('');
  };

  const handleGenerateArticle = () => {
    if (!topic) return;

    const newChat = {
      title: topic,
      content: `This is an article about ${topic}. Focus keyword: ${keyword}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChats([...chats, newChat]);
    setSelectedChat(newChat);
    setArticleContent(newChat.content);
    setIsArticleGenerated(true);
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setArticleContent(chat.content);
    setIsArticleGenerated(true);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleArticleChange = (e) => {
    setArticleContent(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedChat) {
      const updatedChats = chats.map(chat =>
        chat === selectedChat ? { ...chat, content: articleContent } : chat
      );
      setChats(updatedChats);
      setIsEditing(false);
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text(selectedChat.title, 10, 10);
    doc.text(articleContent, 10, 20);
    doc.save('article.pdf');
  };

  const handleMouseEnter = () => {
    setShowTooltip(true); // Show tooltip on hover
  };

  const handleMouseLeave = () => {
    setShowTooltip(false); // Hide tooltip when not hovering
  };

  const handleEditProfile = () => {
    setIsProfileEditing(true); // Open the EditProfile component
    setShowTooltip(false); // Hide the tooltip when editing
  };

  return (
    <div className="homepage-containerH">
      <div className="sidebarH">
        <button className="new-chat-btnH" onClick={handleNewChat}>+ New chat</button>
        <div className="chatsH">
          {chats.map((chat, index) => (
            <button
              key={index}
              className="chat-btnH"
              onClick={() => handleChatClick(chat)}
            >
              {chat.title}
            </button>
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

      <div className="main-contentH">
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

        {!isArticleGenerated && (
          <>
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
              <button className="generate-btnH" onClick={handleGenerateArticle}>
                Generate Article
              </button>
            </div>
          </>
        )}

        {isArticleGenerated && (
          <>
            <div className="generated-articleH">
              <h3 className="article-titleH">{selectedChat.title}</h3>
              <p className="article-timestampH">{selectedChat.timestamp}</p>
              <textarea
                className="article-contentH"
                value={articleContent}
                onChange={handleArticleChange}
                readOnly={!isEditing}
              />
              <div className="article-actionsH">
                {isEditing ? (
                  <button className="save-btnH" onClick={handleSave}>Save</button>
                ) : (
                  <button className="edit-btnH" onClick={handleEdit}>Edit</button>
                )}
                <button className="export-btnH" onClick={handleExport}>
                  Export
                </button>
              </div>
            </div>

            <div className="field-topic-change-container">
              <input
                type="text"
                className="field-topic-change"
                placeholder="Focus Keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Edit Profile Modal */}
        {isProfileEditing && (
          <EditProfile 
            userData={userData} 
            onClose={() => setIsProfileEditing(false)} // Close the modal
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;