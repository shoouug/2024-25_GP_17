import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Profile.css';

import sunIcon from '../images/sun.png';
import exitIcon from '../images/exit.png';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Profile = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null); // To store full user data
  const navigate = useNavigate();

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty',
    'Politics', 'Education', 'Environment', 'Travel', 'Food', 'Lifestyle', 'History', 'Culture', 'Business', 'Fashion',
    'Automobile', 'Gaming', 'Movies', 'Music', 'Real Estate', 'Personal Finance', 'Pets', 'Parenting', 'Space', 'Weather'
  ];

    // Fetch journalist data from Firestore
    useEffect(() => {
      const fetchJournalistData = async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            const docRef = doc(db, 'Journalists', user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data); // Store the complete user data
             
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

  // Define handleLogout function
  const handleLogout = () => {
  
    // Redirect to the login page or home page after logout
    navigate('/');
  };

  return (
    <div className="profile-container">

      {/* Header Section */}
      <header className="profile-header">
  {userData ? (
    <>
      <h1>{userData ? `${userData.firstName} ${userData.lastName}` : 'User Name'}</h1>
      <p><strong>Email:</strong> {userData.email || 'user@example.com'}</p>
      <p><strong>Affiliation:</strong> {userData.affiliation || 'KSU'}</p>
      <p><strong>Country:</strong> {userData.country || 'Saudi Arabia'}</p>
      <p><strong>Password:</strong> ●●●●●●●●</p>
    </>
  ) : (
    <p>Loading user data...</p>
  )}
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
        <h3>Write Your Article</h3>
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
