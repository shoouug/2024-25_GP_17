import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './EditProfile.css'; // Add custom styling

const EditProfile = ({ userData, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    country: '',
    password: '',
  });
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      affiliation: userData.affiliation,
      country: userData.country,
      password: '',
    });
    setSelectedTopics(userData.selectedTopics || []);
    fetchAllTopics();
  }, [userData]);

  const fetchAllTopics = () => {
    // Define or fetch topics
    setAllTopics([
      'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 'Crime', 'Sport', 'Beauty',
      'Politics', 'Education', 'Environment', 'Travel', 'Food', 'Lifestyle', 'History', 'Culture', 'Business', 'Fashion',
      'Automobile', 'Gaming', 'Movies', 'Music', 'Real Estate', 'Personal Finance', 'Pets', 'Parenting', 'Space', 'Weather'
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTopicChange = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic)
        : [...prevTopics, topic]
    );
  };

  const handleArticleChange = (e) => {
    setArticle(e.target.value);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'Journalists', user.uid);
        await updateDoc(docRef, {
          ...formData,
          selectedTopics: selectedTopics,
        });
        
        // Show a confirmation popup
        alert('Profile updated successfully!');

        // Close the edit profile modal
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    // Logic to handle article submission
    console.log('Article submitted:', article);
    setArticle('');
  };

  return (
    <div className="edit-profile-containerW">
      <form onSubmit={handleProfileUpdate}>
        <h2>Edit Profile</h2>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="affiliation"
          value={formData.affiliation}
          onChange={handleInputChange}
          placeholder="Affiliation"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Country"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="New Password"
        />

        {/* Preference Topics Section */}
        <section className="preference-topicsW">
          <h2>Choose Your Preference Topics</h2>
          {error && <p className="error-messageW">{error}</p>}
          <div className="topics-gridW">
            {allTopics.map((topic) => (
              <div
                key={topic}
                className={`topic-itemW ${selectedTopics.includes(topic) ? 'selectedW' : ''}`}
                onClick={() => handleTopicChange(topic)}
              >
                {topic}
              </div>
            ))}
          </div>
        </section>

        {/* Article Writing Section */}
        <section className="article-sectionW">
          <h3>Write Your Article</h3>
          <textarea
            placeholder="Paste or write your article here..."
            value={article}
            onChange={handleArticleChange}
            rows="6"
          />
          <div className="buttonsW">
            <button className="submit-btnW" type="submit">Update Profile</button>
            <button className="submit-btnW" onClick={handleArticleSubmit}>Add Article</button>
            <button type="button" className="cancel-btnW" onClick={onClose}>Cancel</button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default EditProfile;
