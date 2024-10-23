import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore update function
import { auth, db } from '../firebase';
import './PreferenceTopics.css';

const PreferenceTopics = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty'
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }

    setError('');

    try {
      // Update Firestore document for the current user with selected topics and articles
      const user = auth.currentUser;
      const userDocRef = doc(db, 'Journalists', user.uid);

      await updateDoc(userDocRef, {
        selectedTopics: selectedTopics,
        previousArticles: article ? [article] : []
      });

      console.log('Preferences saved! Redirecting to homepage...');
      navigate('/homepage');
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to save preferences. Please try again.');
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
            onChange={(e) => setArticle(e.target.value)}
            rows="6"
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default PreferenceTopics;