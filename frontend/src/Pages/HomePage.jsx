import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './HomePage.css';
import sunIcon from '../images/sun.png';
import moonIcon from '../images/moon.png';
import exitIcon from '../images/exit.png';
import logo from '../images/GenNews.png';
import ProfileIcon from '../images/ProfileIcon.png';
import sendIcon from '../images/sendbutton.png'; // Import send icon
import EditProfile from './EditProfile';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Track dark mode state
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const navigate = useNavigate();

// Toggle Dark/Light Mode
const toggleDarkMode = () => {
  setIsDarkMode((prevMode) => {
    const newMode = !prevMode; // Determine the new mode
    if (newMode) {
      document.body.classList.add("dark-mode"); // Add dark-mode class
    } else {
      document.body.classList.remove("dark-mode"); // Remove dark-mode class
    }
    return newMode; // Update state
  });
};

// Function to fetch user data and sort articles by timestamp
const fetchUserData = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, 'Journalists', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setJournalistName(`${data.firstName} ${data.lastName}`);
        setSelectedTopics(data.selectedTopics || []);
        setUserData(data);

        // Sort the articles by timestamp (newest first)
        const sortedChats = (data.savedArticles || []).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp); // Descending order
        });

        setChats(sortedChats); // Save sorted chats to state
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    navigate('/');
  }
};

// UseEffect to fetch data on component mount
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      fetchUserData();
    } else {
      navigate('/');
    }
  });
  return () => unsubscribe();
}, [navigate]);


  const handleNewChat = () => {
    setSelectedChat(null);
    setArticleContent('');
    setIsArticleGenerated(false);
    setTopic('');
    setKeyword('');
  };

  const handleGenerateArticle = async () => {
    if (!topic) return;
  
    // Create the new article
    const newChat = {
      title: topic,
      content: `${topic}.`,
      timestamp: new Date().toISOString(), // Use ISO format for sorting consistency
    };
  
    // Add the new article to the top of the stack
    const updatedChats = [newChat, ...chats];
  
    // Update the state and Firestore
    setChats(updatedChats); // Update state to reflect the new stack
    setSelectedChat(newChat);
    setArticleContent(newChat.content);
    setIsArticleGenerated(true);
  
    // Save the new stack to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'Journalists', user.uid);
        await updateDoc(userRef, {
          savedArticles: updatedChats, // Save updated stack to Firestore
        });
      } catch (error) {
        console.error("Error saving article:", error);
      }
    }
  };

  const handleTopicCardClick = (selectedTopic) => {
    // Define the new article
    const newChat = {
      title: selectedTopic,
      content: `This is an article about ${selectedTopic}.`, // Initialize with content
      timestamp: new Date().toLocaleTimeString(),
    };
  
    // Update the chats list with the new chat at the top
    const updatedChats = [newChat, ...chats];
  
    // Set the selected chat and content
    setSelectedChat(newChat);
    setChats(updatedChats);
    setArticleContent(newChat.content); // Ensure the article content is set correctly
    setIsArticleGenerated(true);
  
    // Save to Firestore
    const saveArticleToFirestore = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'Journalists', user.uid);
        await updateDoc(userRef, {
          savedArticles: updatedChats, // Save the updated chats
        });
      }
    };
  
    saveArticleToFirestore();
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
    setIsEditing(true); // Enable editing mode
  };
  
  const handleSave = async () => {
    if (selectedChat) {
      const updatedChats = chats.map(chat =>
        chat === selectedChat ? { ...chat, content: articleContent } : chat
      );
      setChats(updatedChats);
      setIsEditing(false); // Exit editing mode
  
      // Update Firestore with the edited content
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'Journalists', user.uid);
        await updateDoc(userRef, {
          savedArticles: updatedChats,
        });
      }
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text(selectedChat.title, 10, 10);
    doc.text(articleContent, 10, 20);
    doc.save('article.pdf');
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleEditProfile = () => {
    setIsProfileEditing(true);
    setShowTooltip(false);
  };

  const handleKeywordUpdate = () => {
    if (selectedChat) {
      // Replace the entire article content with the new input
      const updatedContent = `${keyword}`;
      setArticleContent(updatedContent); // Set the content to the new input only
      setKeyword(''); // Clear the text field after updating
  
      // Update the chats list with the new content
      const updatedChats = chats.map((chat) =>
        chat === selectedChat ? { ...chat, content: updatedContent } : chat
      );
      setChats(updatedChats);
  
      // Save to Firestore
      const saveUpdatedArticleToFirestore = async () => {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'Journalists', user.uid);
          await updateDoc(userRef, {
            savedArticles: updatedChats,
          });
        }
      };
      saveUpdatedArticleToFirestore();
    }
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
  <button className="mode-btnH" onClick={toggleDarkMode}>
    {isDarkMode ? (
      <>
        <img src={sunIcon} alt="Sun Icon" className="iconH" /> Light Mode
      </>
    ) : (
      <>
        <img src={moonIcon} alt="Moon Icon" className="iconH" /> Dark Mode
      </>
    )}
  </button>
  <button className="logout-btnH" onClick={handleLogout}>
    <img src={exitIcon} alt="Exit Icon" className="iconH" /> Log out
  </button>
</div>
</div>

      <div className="main-contentH">
      <div className="navbarH">
  <div className="logo-sectionH">
    <img src={logo} alt="Logo" className="logoH" />
    <div className="welcome-sectionH">
      <h1 className="welcome-headingH">Good morningg, {journalistName}</h1>
      <p className="welcome-subtextH">Let’s dive into the latest!</p>
    </div>
  </div>
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
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>
      </div>
    )}
  </div>
</div>

       

        {!isArticleGenerated && (
          <>
            <div className="topics-sectionH">
              <h2>Start writing what’s happening now</h2>
              <div className="topics-gridH">
                {selectedTopics.map((topic, index) => (
                  <div 
                    key={index} 
                    className="topic-cardH" 
                    onClick={() => handleTopicCardClick(topic)}
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            <p className="topic-promptH">Or, start with a custom topic</p>
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
    placeholder=""
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
  />
  <img 
    src={sendIcon} 
    alt="Send Icon" 
    className="send-iconH" 
    onClick={handleKeywordUpdate} // Update content when send icon is clicked
  />
</div>
          </>
        )}

        {isProfileEditing && (
          <EditProfile 
            userData={userData} 
            onClose={() => setIsProfileEditing(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;