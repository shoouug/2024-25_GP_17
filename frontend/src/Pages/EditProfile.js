import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './EditProfile.css';

const EditProfile = ({ userData, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    country: '',
  });
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const [countryError, setCountryError] = useState('');


  const countries = [
    "Saudi Arabia", "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "United Arab Emirates", "India", "China", 
    "Japan", "South Korea", "Brazil", "Mexico", "Italy", "Spain", 
    "Russia", "Turkey", "South Africa", "Argentina", "Nigeria", 
    "Egypt", "Netherlands", "Sweden", "Switzerland", "Belgium", 
    "Denmark", "Norway", "Finland", "Greece", "Portugal", 
    "Poland", "Indonesia", "Malaysia", "Thailand", "Vietnam", 
    "Philippines", "New Zealand", "Pakistan", "Bangladesh", "Chile", 
    "Colombia", "Venezuela", "Peru", "Austria", "Israel", 
    "Singapore", "Ireland", "Czech Republic", "Hungary", "Romania", 
    "Ukraine", "Kenya", "Ethiopia", "Iceland", "Norway", 
    "Cuba", "Ghana", "Qatar", "Kuwait", "Oman", 
    "Lebanon", "Jordan", "Morocco", "Algeria", "Tunisia", 
    "Luxembourg", "Malta", "Sri Lanka", "Nepal", "Cambodia", 
    "Laos", "Bolivia", "Paraguay", "Uruguay", "Trinidad and Tobago", 
    "Barbados"
  ];

  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      affiliation: userData.affiliation,
      country: userData.country || '',
    });
    setSelectedTopics(userData.selectedTopics || []);
    fetchAllTopics();
  }, [userData]);

  const fetchAllTopics = () => {
    // Define or fetch topics
    setAllTopics([
      'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 
      'Crime', 'Sport', 'Beauty', 'Politics', 'Education', 'Environment', 
      'Travel', 'Food', 'Lifestyle', 'History', 'Culture', 'Business', 'Fashion', 
      'Automobile', 'Gaming', 'Movies', 'Music', 'Real Estate', 
      'Personal Finance', 'Pets', 'Parenting', 'Space', 'Weather'
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'country' && !value) {
      setCountryError('Please select your country.');
    } else {
      setCountryError('');
    }
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
    if (!formData.country) {
      setCountryError('Please select your country.');
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'Journalists', user.uid);
        let profileUpdated = false;
        let articleAdded = false;
  
        // Check if profile data has changed
        const isProfileUpdated = (
          formData.firstName !== userData.firstName ||
          formData.lastName !== userData.lastName ||
          formData.email !== userData.email ||
          formData.affiliation !== userData.affiliation ||
          formData.country !== userData.country ||
          JSON.stringify(selectedTopics) !== JSON.stringify(userData.selectedTopics)
        );
  
        // Update profile data if changed
        if (isProfileUpdated) {
          await updateDoc(docRef, {
            ...formData,
            selectedTopics: selectedTopics,
          });
          profileUpdated = true;
        }
  
        // Add article if there's content
        if (article.trim()) {
          await updateDoc(docRef, {
            previousArticles: arrayUnion(article),
          });
          articleAdded = true;
          setArticle(''); // Clear the article input after submission
        }
  
        // Determine the message to show based on updates
        if (profileUpdated && articleAdded) {
          alert("Profile and article updated successfully!");
        } else if (profileUpdated) {
          alert("Profile updated successfully!");
        } else if (articleAdded) {
          alert("Article added successfully!");
        }
  
        // Close the edit profile modal
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };  

  return (
    <div className="edit-profile-containerW">
      <button className="close-btnW" onClick={onClose}>X</button>
      <form className='formW' onSubmit={handleProfileUpdate}>
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

        {/* Country Selection Dropdown */}
        <select 
          className="country-inputW" 
          name="country" 
          value={formData.country} 
          onChange={handleInputChange} 
          required
        >
          <option value="" disabled>Select your country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {countryError && <p className="error-messageW">{countryError}</p>}

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
        </section>
        <button className="submit-btnW" type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;