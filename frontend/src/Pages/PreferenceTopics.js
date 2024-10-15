import React, { useState } from 'react';
import './PreferenceTopics.css'; // Assuming you will create a CSS file for styling

const PreferenceTopics = ({ onClose }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [article, setArticle] = useState('');

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
    // You can perform an API call or logic to save the selected topics and article
    console.log('Selected Topics:', selectedTopics);
    console.log('Article:', article);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Choose Your Preference Topics</h2>

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
          <h3>Write Your Article</h3>
          <textarea
            placeholder="Paste or write your article here..."
            value={article}
            onChange={handleArticleChange}
            rows="6"
          />
        </div>

        <div className="buttons">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceTopics;
