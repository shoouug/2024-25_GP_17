import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import Firebase auth and db
import './PreferenceTopics.css';

const PreferenceTopics = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty'
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
  const handleSubmit = async () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }

    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        // Save selected topics and article to the user's document in Firestore
        const userDocRef = doc(db, 'Journalists', user.uid);
        await updateDoc(userDocRef, {
          selectedTopics: selectedTopics, // Save selected topics
          previousArticle: article || 'No article provided' // Save optional article
        });

        console.log('Preferences saved successfully.');
        navigate('/HomePage'); // Redirect to the homepage after saving
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
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

        <div className="article-section">
          <h3>Write Your Article (optional)</h3>
          <textarea
            placeholder="Paste or write your article here..."
            value={article}
            onChange={handleArticleChange}
            rows="6"
          />
        </div>

        <div className="buttons">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceTopics;