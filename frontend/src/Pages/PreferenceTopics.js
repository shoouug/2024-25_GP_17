import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // i add zthe array 
import { auth, db } from '../firebase';
import Logo from '../images/logo.png'; // Import the logo image
import './PreferenceTopics.css';

const PreferenceTopics = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty',
    'Politics', 'Education', 'Environment', 'Travel', 'Food', 'Lifestyle', 'History', 'Culture', 'Business', 'Fashion',
    'Automobile', 'Gaming', 'Movies', 'Music', 'Real Estate', 'Personal Finance', 'Pets', 'Parenting', 'Space', 'Weather'
  ];

  // Handle topic selection
  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
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
        const userDocRef = doc(db, 'Journalists', user.uid);
        await updateDoc(userDocRef, {
          selectedTopics: selectedTopics,
          ...(article && { previousArticle: arrayUnion(article) }) {/* so it would store as an array*/}
        });

        {/*Lina code is "selectedTopics: selectedTopics,
           previousArticle: article || 'No article provided'". */}

        console.log('Preferences saved successfully.');
        navigate('/HomePage');
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="preference-page">
      <div className="logo-container">
        <img src={Logo} alt="Website Logo" className="website-logo" />
      </div>
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
  );
};

export default PreferenceTopics;