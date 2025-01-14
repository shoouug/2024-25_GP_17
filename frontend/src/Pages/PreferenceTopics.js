import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './PreferenceTopics.css';

const PreferenceTopics = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Apply dark mode state on component mount
  useEffect(() => {
    const isDarkModeEnabled = localStorage.getItem('dark-mode') === 'true'; // Get saved state
    if (isDarkModeEnabled) {
      document.body.classList.add('dark-mode'); // Apply dark mode
    } else {
      document.body.classList.remove('dark-mode'); // Ensure dark mode is off
    }
  }, []);

  const topics = [
    'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty',
    'Politics', 'Education', 'Environment','Law', 'Travel', 'Food', 'Lifestyle', 'History', 'Culture', 'Business', 'Fashion',
    'Automobile', 'Gaming', 'Movies', 'Music', 'Real Estate', 'Personal Finance', 'Pets', 'Parenting', 'Space', 'Weather'
  ];

  // Handle topic selection
  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        if (prev.length >= 5) {
          setError('You can only choose up to 5 topics.');
          return prev;
        }
        setError(''); // Clear error if limit is not reached
        return [...prev, topic];
      }
    });
  };

  // Handle article input change
  const handleArticleChange = (e) => {
    setArticle(e.target.value);
  };

  // Handle form submission
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
        ...(article && { previousArticles: arrayUnion(article) }) // Save as an array
      });

      console.log('Preferences saved successfully.');
      navigate('/homepage');
    } else {
      console.error('No user is logged in.');
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

  return (
    <div className="preference-page">
      
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
  <p className="article-description">
    Uploading your article allows GenNews to learn your unique writing style, ensuring that future AI-generated articles align with your preferences.
  </p>
  <p className="article-example">
    <strong>Example:</strong> Suppose your uploaded articles often use phrases like "Sincerely" instead of "Best regards," or you frequently write "However" at the start of a sentence. GenNews will detect these patterns and reflect them in future content.
  </p>
</div>

      <div className="buttons">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default PreferenceTopics;
