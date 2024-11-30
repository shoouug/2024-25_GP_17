import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './EditProfile.css';
import backArrowIcon from '../images/BackArrow.png'; 

const EditPro = ({ userData }) => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      affiliation: '',
      country: '',
    });

    const [isAffiliationEditable, setIsAffiliationEditable] = useState(false); // State for Affiliation editability
    const [isCountryEditable, setIsCountryEditable] = useState(false); // State for country editability

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [allTopics, setAllTopics] = useState([]);
    const [article, setArticle] = useState('');

    const [error, setError] = useState('');
     const navigate = useNavigate();

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
      // Apply dark mode state on component mount
      useEffect(() => {
       const isDarkModeEnabled = localStorage.getItem('dark-mode') === 'true'; // Get saved state
       if (isDarkModeEnabled) {
         document.body.classList.add('dark-mode'); // Apply dark mode
       } else {
         document.body.classList.remove('dark-mode'); // Ensure dark mode is off
       }
     }, []);

      useEffect(() => {
        const fetchUserData = async () => {
          const user = auth.currentUser;
          if (user) {
            try {
              // Fetching user data from Firestore
              const docRef = doc(db, 'Journalists', user.uid);
              const docSnap = await getDoc(docRef);
      
              if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                  firstName: data.firstName || '',
                  lastName: data.lastName || '',
                  email: data.email || '',
                  affiliation: data.affiliation || '',
                  country: data.country || '',
                });
                setSelectedTopics(data.selectedTopics || []);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          } else {
            navigate('/homepage');
          }
        };
      
        // Fetch all topics (predefined list)
        const fetchAllTopics = () => {
          setAllTopics([
            'Technology', 'Finance', 'Health', 'Art', 'Science', 'Entertainment', 'Economy', 
            'Crime', 'Sport', 'Beauty', 'Politics', 'Education', 'Environment', 
            'Travel', 'Food', 'Lifestyle', 'History', 'Culture', 'Business', 'Fashion', 
            'Automobile', 'Gaming', 'Movies', 'Music', 'Real Estate', 
            'Personal Finance', 'Pets', 'Parenting', 'Space', 'Weather'
          ]);
        };
      
        fetchUserData();
        fetchAllTopics(); // Set the predefined topics
      
      }, [navigate]);
  
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
    setArticle(e.target.value); // Update the article text
  };
  
        // Check if profile data has changed
        const handleProfileUpdate = async () => {
            const user = auth.currentUser;
            if (user) {
              try {
                const docRef = doc(db, 'Journalists', user.uid);
                let profileUpdated = false;
                let articleAdded = false;
          
                // Check if profile data has changed
                const isProfileUpdated = (
                    formData.affiliation !== userData?.affiliation || 
                    formData.country !== userData?.country || 
                    JSON.stringify(selectedTopics) !== JSON.stringify(userData?.selectedTopics)
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
          
                // Show success messages
                if (profileUpdated && articleAdded) {
                  alert("Profile and article updated successfully!");
                } else if (profileUpdated) {
                  alert("Profile updated successfully!");
                } else if (articleAdded) {
                  alert("Article added successfully!");
                }
          
                // Navigate to the homepage
                navigate('/homepage');
              } catch (error) {
                setError('Failed to update profile. Please try again.');
                console.error('Error updating profile:', error);
              }
            }
          };          

// Handle the back navigation
const handleBack = () => {
  navigate('/homepage'); // Navigate back to HomePage
};

// Edit actions
const handleEditAffiliation = () => {
  setIsAffiliationEditable(true); // Enable the affiliation field for editing
};

const handleEditCountry = () => {
  setIsCountryEditable(true); // Enable the country field for editing
};

    return (
        <div className="edit-profile-containerW">
        <div className="back-arrow-container" onClick={handleBack}>
      <img src={backArrowIcon} alt="Back" className="back-arrow-icon" />
    
       </div>

          <div className="form-contentW">
           <h1 className='edW'>Edit your Profile </h1>
           <form className='formW'>
          {/* First Name */}
                 <div className="form-centered">
         <label className="input-labelWijdan">
           First Name:
           <div className="input-containerWijdan">
             <input
               type="text"
               className="inputWijdan"
               value={formData.firstName}
               onChange={handleInputChange}
               name="firstName"
               disabled
             />
           </div>
         </label>
       
         <label className="input-labelWijdan">
           Last Name:
           <div className="input-containerWijdan">
             <input
               type="text"
               className="inputWijdan"
               value={formData.lastName}
               onChange={handleInputChange}
               name="lastName"
               disabled
             />
           </div>
         </label>
       
         <label className="input-labelWijdan">
           Email:
           <div className="input-containerWijdan">
             <input
               type="email"
               className="inputWijdan"
               value={formData.email}
               onChange={handleInputChange}
               name="email"
               disabled
             />
           </div>
         </label>
       
         <label className="input-labelWijdan">
           Affiliation:
           <div className="input-containerWijdan">
             <input
               type="text"
               className="inputWijdan"
               value={formData.affiliation}
               onChange={handleInputChange}
               name="affiliation"
               disabled={!isAffiliationEditable}
             />
             {!isAffiliationEditable && (
               <span className="edit-textWijdan" onClick={handleEditAffiliation}>
                 Edit
               </span>
             )}
           </div>
         </label>
       
         <label className="input-labelWijdan">
           Country:
           <div className="input-containerWijdan">
             <select
               className="inputWijdan"
               name="country"
               value={formData.country}
               onChange={handleInputChange}
               disabled={!isCountryEditable}
               required
             >
               <option value="" disabled>Select your country</option>
               {countries.map((country) => (
                 <option key={country} value={country}>
                   {country}
                 </option>
               ))}
             </select>
             {!isCountryEditable && (
               <span className="edit-textWijdan" onClick={handleEditCountry}>
                 Edit
               </span>
             )}
           </div>
         </label>
       </div>

        
             {/* Preference Topics Section */}
             <section className="preference-topicsW">
              <h2 className='edtW'>Choose Your Preference Topics</h2>
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
              <h2 className='edtW'>Write Your Article</h2>
              <textarea
                placeholder="Paste or write your article here..."
                value={article}
                onChange={handleArticleChange}
                rows="4" /* Adjusted rows for a smaller initial height */
              />
            </section>
           {/* Update Button */}
           <button  className="submit-btnW" type="button" onClick={handleProfileUpdate}>
              Update Profile </button>
        </form>
        </div>
  
          <footer className="about-us-footer">
          <p>Developers: Wijdan Alhashim, Shoug Aljebreen, Lina Alharbi, Lina Albarrak</p>
          <p>© 2024 GenNews. All rights reserved.</p>
        </footer>
        </div>
      );
    };
    
 export default EditPro;