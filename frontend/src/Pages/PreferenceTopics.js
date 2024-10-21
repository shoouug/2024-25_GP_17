import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './PreferenceTopics.css'; // Assuming you will create a CSS file for styling

const PreferenceTopics = ({ onClose }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState(''); // For showing error messages
  const navigate = useNavigate(); // useNavigate hook for navigation

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
  const handleSubmit = () => {
    // Check if at least one topic is selected
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }

    // Reset error if the form is valid
    setError('');

    // You can perform an API call or logic to save the selected topics and article
    console.log('Selected Topics:', selectedTopics);
    console.log('Article:', article || 'No article provided'); // Article is optional

    // Redirect to the HomePage after submission
    navigate('/homepage'); // Assuming the home page route is '/homepage'

    // Call the onClose function after successful submission (if needed)
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className='pre-msg'>Choose Your Preference Topics</h2>

        {/* Show error if no topic is selected */}
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
          <h3 className='pre-msg'>Write Your Article (optional)</h3>
          <textarea
            placeholder="Paste or write your article here..."
            value={article}
            onChange={handleArticleChange}
            rows="6"
          />
        </div>

          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        
      </div>
    </div>
  );
};

export default PreferenceTopics;