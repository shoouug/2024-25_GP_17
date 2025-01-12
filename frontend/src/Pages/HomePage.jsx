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
import forward from '../images/forward.png'; 
import Backward from '../images/Backward.png'; 
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
  const [popupKeyword, setPopupKeyword] = useState(""); // For the popup keyword input
  const [showKeywordPopup, setShowKeywordPopup] = useState(false); // To toggle the popup
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

const handleKeywordPopupOpen = () => {
  setPopupKeyword(keyword);
  setShowKeywordPopup(true);
};

const handleKeywordPopupSave = () => {
  setKeyword(popupKeyword);
  setShowKeywordPopup(false);

  // Update the article content dynamically with keywords
  if (selectedChat) {
    const updatedContent = `${topic} ${popupKeyword}`;
    setArticleContent(updatedContent);

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

const handleKeywordPopupCancel = () => {
  setShowKeywordPopup(false);
};

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

  // const handleGenerateArticle = async () => {
  //   if (!topic.trim()) {
  //     setTopicError("Topic is required to generate an article.");
  //     return;
  //   }
  
  //   setTopicError("");
  
  //   const newVersion = {
  //     content: `This is an article about ${topic}${keyword ? ` ${keyword}` : ""}.`,
  //     timestamp: new Date().toLocaleString("en-US", {
  //       year: "numeric",
  //       month: "2-digit",
  //       day: "2-digit",
  //       hour: "numeric",
  //       minute: "numeric",
  //       second: "numeric",
  //       hour12: true,
  //     }),
  //   };
  
  //   if (selectedChat) {
  //     // Append the new version to the selected chat's versions
  //     const updatedChat = {
  //       ...selectedChat,
  //       versions: [...(selectedChat.versions || []), newVersion],
  //     };
  
  //     setSelectedChat(updatedChat);
  //     setArticleContent(newVersion.content);
  //     setCurrentVersionIndex((updatedChat.versions || []).length - 1);
  
  //     // Update chats in the state
  //     const updatedChats = chats.map((chat) =>
  //       chat === selectedChat ? updatedChat : chat
  //     );
  //     setChats(updatedChats);
  
  //     // Save to Firestore
  //     const user = auth.currentUser;
  //     if (user) {
  //       try {
  //         const userRef = doc(db, "Journalists", user.uid);
  //         await updateDoc(userRef, {
  //           savedArticles: updatedChats,
  //         });
  //       } catch (error) {
  //         console.error("Error saving article:", error);
  //       }
  //     }
  //   } else {
  //     // Create a new chat with the first version
  //     const newChat = {
  //       title: topic,
  //       versions: [newVersion],
  //     };
  
  //     setChats([newChat, ...chats]);
  //     setSelectedChat(newChat);
  //     setArticleContent(newVersion.content);
  //     setCurrentVersionIndex(0);
  
  //     const user = auth.currentUser;
  //     if (user) {
  //       try {
  //         const userRef = doc(db, "Journalists", user.uid);
  //         await updateDoc(userRef, {
  //           savedArticles: [newChat, ...chats],
  //         });
  //       } catch (error) {
  //         console.error("Error saving article:", error);
  //       }
  //     }
  //   }
  
  //   setIsArticleGenerated(true);
  // };

  const handleGenerateArticle = async () => {
    if (!topic.trim()) {
      setTopicError("Topic is required to generate an article.");
      return;
    }
  
    setTopicError("");
  
    const newVersion = `This is an article about ${topic}${keyword ? ` ${keyword}` : ""}`;
    let updatedChat;
  
    if (selectedChat) {
      // If a chat is already selected, add the new version
      const updatedVersions = [...selectedChat.versions, newVersion];
      updatedChat = { ...selectedChat, versions: updatedVersions };
  
      const updatedChats = chats.map((chat) =>
        chat === selectedChat ? updatedChat : chat
      );
      setChats(updatedChats);
      setSelectedChat(updatedChat);
    } else {
      // Create a new chat and save the first version
      updatedChat = {
        title: topic,
        versions: [newVersion], // Ensure this is a string, not an object
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
  
      const updatedChats = [updatedChat, ...chats];
      setChats(updatedChats);
      setSelectedChat(updatedChat);
    }
  
    setArticleContent(newVersion);
    setCurrentVersionIndex((updatedChat.versions || []).length - 1); // Point to the latest version
    setIsArticleGenerated(true);
  
    // Save the updated chats to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "Journalists", user.uid);
        await updateDoc(userRef, {
          savedArticles: chats,
        });
      } catch (error) {
        console.error("Error saving article:", error);
      }
    }
  };

  const handleBackward = () => {
    if (selectedChat && currentVersionIndex > 0) {
      const newIndex = currentVersionIndex - 1;
      setCurrentVersionIndex(newIndex);
      setArticleContent(selectedChat.versions[newIndex]); // Retrieve the previous version as a string
    }
  };
  
  const handleForward = () => {
    if (
      selectedChat &&
      currentVersionIndex < selectedChat.versions.length - 1
    ) {
      const newIndex = currentVersionIndex + 1;
      setCurrentVersionIndex(newIndex);
      setArticleContent(selectedChat.versions[newIndex]); // Retrieve the next version as a string
    }
  };

  const handleSave = async () => {
    if (!selectedChat) return;
  
    const updatedVersions = [...selectedChat.versions];
  
    // Update the current version index with the latest content
    updatedVersions[currentVersionIndex] = articleContent; // Ensure this is a string
  
    const updatedChat = { ...selectedChat, versions: updatedVersions };
  
    // Update the chats array with the modified chat
    const updatedChats = chats.map((chat) =>
      chat === selectedChat ? updatedChat : chat
    );
  
    setChats(updatedChats);
    setSelectedChat(updatedChat);
  
    // Save the changes to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "Journalists", user.uid);
        await updateDoc(userRef, {
          savedArticles: updatedChats,
        });
      } catch (error) {
        console.error("Error saving edited article:", error);
      }
    }
  
    setIsEditing(false); // Stop editing mode
  };


  //
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setArticleContent(chat.versions[0] || ""); // Set to the first version by default
    setCurrentVersionIndex(0);
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

  const handleTitleChange = (newTitle) => {
    if (!selectedChat) return;
  
    // Update the selected chat's title
    const updatedChat = { ...selectedChat, title: newTitle };
  
    // Update the chats array with the modified chat
    const updatedChats = chats.map((chat) =>
      chat === selectedChat ? updatedChat : chat
    );
  
    setChats(updatedChats);
    setSelectedChat(updatedChat);
  
    // Update Firestore
    const user = auth.currentUser;
    if (user) {
      const updateTitleInFirestore = async () => {
        try {
          const userRef = doc(db, "Journalists", user.uid);
          await updateDoc(userRef, {
            savedArticles: updatedChats,
          });
        } catch (error) {
          console.error("Error updating chat title in Firestore:", error);
        }
      };
      updateTitleInFirestore();
    }
  };

  const handleTopicCardClick = (selectedTopic) => {
    setTopic(selectedTopic); // Set the topic state to the selected topic
  
    // Generate an article based on the selected topic
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
      versions: [{ content: `This is an article about ${selectedTopic}.` }],
    };
  
    // Update the chats state
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setSelectedChat(newChat);
    setArticleContent(newChat.content);
    setIsArticleGenerated(true);
  
    // Save the new chat to Firestore
    const saveToFirestore = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "Journalists", user.uid);
        try {
          await updateDoc(userRef, {
            savedArticles: updatedChats,
          });
        } catch (error) {
          console.error("Error saving topic-selected article:", error);
        }
      }
    };
  
    saveToFirestore();
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
  </div>
  <div className="profile-sectionH">
    <div className="welcome-sectionH">
      <h1 className="welcome-headingH">Good morning, {journalistName}</h1>
      <p className="welcome-subtextH">Let’s dive into the latest!</p>
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
</div>

        {/* Conditionally render the topics section and prompt */}
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

    <p className="topic-promptH">Or enter a topic of your choice!</p>
  </>
)}
        <div className="input-field-container">
      <input
        type="text"
        placeholder={
          isArticleGenerated
            ? "Change on the article" // Placeholder after generating the article
            : "Enter your topic here..." // Default placeholder
        }
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="input-field"
      />
      <button className="keyword-button" onClick={() => setShowKeywordPopup(true)}>
        Keyword
      </button>
      <img
        src={sendIcon}
        alt="Send Icon"
        className="send-icon"
        onClick={() => {
          if (!topic.trim()) {
            setTopicError("Topic is required to generate an article.");
            return;
          }
          handleGenerateArticle(); // Generate article and navigate to generated article page
          setTopic(""); // Clear the input field
        }}
      />
    </div>

    {showKeywordPopup && (
      <div className="keyword-popup">
        <textarea
          placeholder="Enter keywords separated by commas..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        ></textarea>
        <button onClick={() => setShowKeywordPopup(false)}>Save</button>
      </div>
    )}

{isArticleGenerated && selectedChat && (
  <>
    <div className="generated-articleH">

    <h3 className="article-titleH">
  {isEditing ? (
    <input
      type="text"
      value={selectedChat?.title}
      onChange={(e) => handleTitleChange(e.target.value)}
      className="title-edit-input"
    />
  ) : (
    selectedChat?.title
  )}
</h3>

  <p className="article-timestampH">{selectedChat?.timestamp}</p>
  <textarea
    className="article-contentH"
    value={articleContent}
    onChange={(e) => setArticleContent(e.target.value)}
    readOnly={!isEditing}
  />
  <div className="article-actionsH">
  {isEditing ? (
    <button className="save-btnH" onClick={handleSave}>
      Save
    </button>
  ) : (
    <button className="edit-btnH" onClick={() => setIsEditing(true)}>
      Edit
    </button>
  )}
  <button className="export-btnH" onClick={handleExport}>
    Export
  </button>
  <button
    className="backward-btn"
    onClick={handleBackward}
    disabled={currentVersionIndex === 0}
  >
    <img src={Backward} alt="Backward" />
  </button>
  <button
    className="forward-btn"
    onClick={handleForward}
    disabled={
      !selectedChat || currentVersionIndex >= selectedChat.versions.length - 1
    }
  >
    <img src={forward} alt="Forward" />
  </button>
</div>
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
