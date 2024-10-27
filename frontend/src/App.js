import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import HomePage from './Pages/HomePage'; // Import HomePage component
import VerifyEmail from './Pages/VerifyEmail';
import PreferenceTopics from './Pages/PreferenceTopics'; // Import PreferenceTopics component
import SignUp from './Pages/Signup';
import WelcomePage from './Pages/WelcomePage';
import Login from './Pages/login';
import ResetPassword1 from './Pages/reset-password1';
import ResetPassword3 from './Pages/reset-password3';

import Profile from './Pages/Profile';
import AboutUs from './Pages/AboutUs';
import AboutUs2 from './Pages/AboutUs2';
import EditProfile from './Pages/EditProfile';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} /> {/* This is the Welcome Page */}

          <Route path="/signup" element={<SignUp />} /> {/* Sign-Up Page */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/reset-password1" element={<ResetPassword1 />} /> {/* Reset Password Step 1 */}
          <Route path="/reset-password3" element={<ResetPassword3 />} /> {/* Reset Password Step 3 */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/preference-topics" element={<PreferenceTopics />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/aboutus" element={<AboutUs />} /> {/* About Us Page after signing in*/}
          <Route path="/aboutus2" element={<AboutUs2 />} /> {/* About Us Page before signing in*/}
          
          {/* Route for Home Page after successful sign up */}
          <Route path="/homepage" element={<HomePage />} /> {/* Home Page after preferences */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;