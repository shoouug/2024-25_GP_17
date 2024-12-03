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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [journalistName, setJournalistName] = useState("Journalist Name");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [articleContent, setArticleContent] = useState("");
  const [isArticleGenerated, setIsArticleGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const navigate = useNavigate();
  const [topicError, setTopicError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("dark-mode", newMode);
      if (newMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      return newMode;
    });
  };

  useEffect(() => {
    const isDarkModeEnabled = localStorage.getItem("dark-mode") === "true";
    setIsDarkMode(isDarkModeEnabled);
    if (isDarkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "Journalists", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setJournalistName(`${data.firstName} ${data.lastName}`);
          setSelectedTopics(data.selectedTopics || []);
          setUserData(data);

          const sortedChats = (data.savedArticles || []).sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
          });

          setChats(sortedChats);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleNewChat = () => {
    setSelectedChat(null);
    setArticleContent("");
    setIsArticleGenerated(false);
    setTopic("");
    setKeyword("");
  };

  const handleGenerateArticle = async () => {
    if (!topic.trim()) {
      setTopicError("Topic is required to generate an article."); // Set the error message
      return;
    }

    setTopicError("");

    const newChat = {
      title: topic,
      content: `${topic}${keyword ? ` ${keyword}` : ""}.`,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }),
    };

    const updatedChats = [newChat, ...chats];

    setChats(updatedChats);
    setSelectedChat(newChat);
    setArticleContent(newChat.content);
    setIsArticleGenerated(true);

    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "Journalists", user.uid);
        await updateDoc(userRef, {
          savedArticles: updatedChats,
        });
      } catch (error) {
        console.error("Error saving article:", error);
      }
    }
  };

  const handleTopicCardClick = (selectedTopic) => {
    const newChat = {
      title: selectedTopic,
      content: `This is an article about ${selectedTopic}.`,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }),
    };

    const updatedChats = [newChat, ...chats];
    setSelectedChat(newChat);
    setChats(updatedChats);
    setArticleContent(newChat.content);
    setIsArticleGenerated(true);

    const saveArticleToFirestore = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "Journalists", user.uid);
        await updateDoc(userRef, {
          savedArticles: updatedChats,
        });
      }
    };

    saveArticleToFirestore();
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setArticleContent(chat.content);
    setIsArticleGenerated(true);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleArticleChange = (e) => {
    setArticleContent(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (selectedChat) {
      const updatedChats = chats.map((chat) =>
        chat === selectedChat ? { ...chat, content: articleContent } : chat
      );
      setChats(updatedChats);
      setIsEditing(false);

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "Journalists", user.uid);
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
    doc.save("article.pdf");
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = (e) => {
    if (
      !e.relatedTarget?.closest(".profile-tooltipH") &&
      !e.relatedTarget?.closest(".profile-linkH")
    ) {
      setShowTooltip(false);
    }
  };

  const handleProfileClick = () => {
    setShowTooltip((prev) => !prev);
  };

  const handleEditProfile = () => {
    navigate("/editprofile", { state: { userData } });
  };

  const handleKeywordUpdate = () => {
    if (selectedChat) {
      const updatedContent = `${keyword}`;
      setArticleContent(updatedContent);
      setKeyword("");

      const updatedChats = chats.map((chat) =>
        chat === selectedChat ? { ...chat, content: updatedContent } : chat
      );
      setChats(updatedChats);

      const saveUpdatedArticleToFirestore = async () => {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "Journalists", user.uid);
          await updateDoc(userRef, {
            savedArticles: updatedChats,
          });
        }
      };
      saveUpdatedArticleToFirestore();
    }
  };

  return (
    <div
      className={`homepage-containerH ${isSidebarOpen ? "sidebar-open" : ""}`}
      onClick={() => setIsSidebarOpen(false)}
    >
      <div className="sidebarH" onClick={(e) => e.stopPropagation()}>
        <button className="new-chat-btnH" onClick={handleNewChat}>
          + New chat
        </button>
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
                <img src={sunIcon} alt="Sun Icon" className="iconH" /> Light
                Mode
              </>
            ) : (
              <>
                <img src={moonIcon} alt="Moon Icon" className="iconH" /> Dark
                Mode
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
            <button
              className="menu-btnH"
              onClick={(e) => {
                e.stopPropagation(); // Prevent closing sidebar on button click
                toggleSidebar();
              }}
            >
              ☰
            </button>
            <img src={logo} alt="Logo" className="logoH" />
            <div className="welcome-sectionH">
            <h1 className="welcome-headingH">Good morning, {journalistName}</h1>

              <p className="welcome-subtextH">Let’s dive into the latest!</p>
            </div>
          </div>
          <div className="profile-linkH" onClick={handleProfileClick}>
            <img
              src={ProfileIcon}
              alt="Profile Icon"
              className="ProfileIconH"
            />
            {showTooltip && userData && (
              <div className="profile-tooltipH">
                <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Affiliation:</strong> {userData.affiliation}
                </p>
                <p>
                  <strong>Country:</strong> {userData.country}
                </p>
                <button
                  className="view-profile-btnH"
                  onClick={handleEditProfile}
                >
                  View Profile
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
            {topicError && <p className="error-message">{topicError}</p>}
              <div className="custom-topic-inputsH">
                <input
                  type="text"
                  placeholder="Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required // Enforce validation in forms
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
                  <button className="save-btnH" onClick={handleSave}>
                    Save
                  </button>
                ) : (
                  <button className="edit-btnH" onClick={handleEdit}>
                    Edit
                  </button>
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
                // value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <img
                src={sendIcon}
                alt="Send Icon"
                className="send-iconH"
                onClick={handleKeywordUpdate}
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
