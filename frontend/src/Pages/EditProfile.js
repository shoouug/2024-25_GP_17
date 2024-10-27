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
    setAllTopics(['Politics', 'Sports', 'Health', 'Technology']);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'Journalists', user.uid);
        await updateDoc(docRef, {
          ...formData,
          selectedTopics: selectedTopics,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
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

        <h3>Topics of Interest</h3>
        {allTopics.map((topic) => (
          <div key={topic}>
            <input
              type="checkbox"
              checked={selectedTopics.includes(topic)}
              onChange={() => handleTopicChange(topic)}
            />
            {topic}
          </div>
        ))}

        <button type="submit">Update Profile</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
